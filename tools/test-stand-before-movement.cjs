const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src', 'browser-runtime.html'), 'utf8');
const scripts = [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
assert.ok(scripts.length >= 7, 'canonical runtime should retain executable application script');
const appScript = scripts.find(script => script.includes('const CURRENT_GAME_BUILD=') && script.includes('function resolveMissionAiStreamBatchAsync'));
assert.ok(appScript, 'canonical runtime application script should be discoverable independent of external script tags');
let appSource = appScript.replace(/ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\([^;]+;\s*$/s, '');

const noop = () => {};
const element = () => ({style:{},dataset:{},classList:{add:noop,remove:noop,toggle:noop},appendChild:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],getContext:()=>null});
const storage = () => { const map = new Map(); return {getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key),clear:()=>map.clear()}; };

function runtimeContext(options={}) {
  const context = {
    console, Math:Object.create(Math), Date, JSON, Number, String, Boolean, Array, Object, Map, Set, WeakMap, WeakSet,
    Promise, RegExp, Error, TypeError, parseInt, parseFloat, isNaN, Infinity, NaN, structuredClone, TextEncoder, TextDecoder,
    Blob, URL, URLSearchParams, performance:{now:()=>Date.now()}, setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame:callback=>setTimeout(()=>callback(Date.now()),0), cancelAnimationFrame:clearTimeout,
    localStorage:storage(), sessionStorage:storage(), navigator:{userAgent:'node',hardwareConcurrency:8,storage:{estimate:async()=>({quota:1e9,usage:0})}},
    location:{protocol:'http:',hostname:'localhost',href:'http://localhost/'}, history:{}, addEventListener:noop, removeEventListener:noop,
    matchMedia:()=>({matches:false,addEventListener:noop,removeEventListener:noop}), crypto:crypto.webcrypto,
    document:{body:element(),head:element(),documentElement:element(),getElementById:()=>element(),createElement:element,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,removeEventListener:noop},
    React:{createElement:()=>({}),memo:fn=>fn,forwardRef:fn=>fn,Component:class{},PureComponent:class{},useState:()=>[null,noop],useEffect:noop,useMemo:fn=>fn(),useRef:value=>({current:value}),useCallback:fn=>fn,useLayoutEffect:noop,Fragment:'fragment'},
    ReactDOM:{createRoot:()=>({render:noop})}, THREE:{}
  };
  context.window=context; context.globalThis=context; context.self=context;
  Object.assign(context.React,options.React||{});
  if(options.tv)context.AEGIS_TV_RUNTIME={enabled:true,metrics:{}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-building-layouts.js'),'utf8'),context);
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}









const c=runtimeContext(),unit={id:'lead',team:'human',hp:40,alive:true,x:10,y:10,tu:12,kneeling:true,facing:'E'};
test('standing plus movement is affordable before movement commits',()=>{
 assert.equal(c.tacticalMovementCommitCellState({...unit,tu:7},{x:11,y:10},[],[],{}).ok,false);
 assert.equal(c.tacticalMovementCommitCellState({...unit,tu:8},{x:11,y:10},[],[],{}).ok,true);
 assert.equal(c.tacticalMovementCommitCellState({...unit,downed:true},{x:11,y:10},[],[],{}).ok,false);
 assert.equal(c.tacticalMovementCommitCellState(unit,{x:12,y:10},[],[],{requireAdjacent:false,movementTu:12}).ok,false);
});
test('escort leader stands and pays once; insufficient TU does not move',()=>{
 const mission={id:'stand',kind:'Alien Incident',region:'Europe',gridSize:64};
 const before=JSON.stringify(unit);
 const out=c.tacticalAdvanceEscortedCivilians([unit],unit.id,{x:11,y:10},[],null,4,mission,{applyFireTeamFormation:false});
 assert.equal(out[0].x,11);assert.equal(out[0].kneeling,false);assert.equal(out[0].tu,4);assert.equal(JSON.stringify(unit),before);
 const next=c.tacticalAdvanceEscortedCivilians(out,unit.id,{x:12,y:10},[],null,4,mission,{applyFireTeamFormation:false});
 assert.equal(next[0].tu,0);
 const poor={...unit,tu:7},held=c.tacticalAdvanceEscortedCivilians([poor],unit.id,{x:11,y:10},[],null,4,mission,{applyFireTeamFormation:false});
 assert.equal(held[0].x,10);assert.equal(held[0].tu,7);assert.equal(held[0].kneeling,true);
});
test('playback stands a mover without charging TU twice or standing a carried casualty',()=>{
 const before=JSON.stringify(unit),moving=c.tacticalPlaybackMovingStance(unit);
 assert.equal(moving.kneeling,false);assert.equal(moving.tu,unit.tu);assert.equal(JSON.stringify(unit),before);
 const casualty={...unit,downed:true,unconscious:true};assert.equal(c.tacticalPlaybackMovingStance(casualty),casualty);
 const start=appSource.indexOf('function applyAiFrameToMap('),end=appSource.indexOf('function estimateAiFrameMovementDelay',start),code=appSource.slice(start,end);
 assert.ok(code.includes('kneeling:typeof unit.kneeling==="boolean"?unit.kneeling:Boolean(oldUnit.kneeling)'));
 assert.ok(code.includes('...tacticalPlaybackMovingStance(target), x: previous.x'));
 assert.ok(code.includes('...tacticalPlaybackMovingStance(unit), x: step.x'));
 assert.ok(appSource.includes('return units.map((unit) => ({ kneeling:Boolean(unit.kneeling),casualtyCondition:'));
});

test('real AI snapshots preserve stance through a moving support round',()=>{
 const game=c.makeNewGameData({openingIncidentSeed:321}),soldier=game.soldiers[0];
 const human={...unit,id:soldier.id,name:soldier.name,tu:60,maxTu:60,maxHp:40,ammo:20,weaponKind:'ballistic',acc:60,baseSoldier:soldier};
 const alien={id:'alien',team:'alien',hp:60,maxHp:60,alive:true,x:45,y:45,tu:40,maxTu:40,acc:30,weaponKind:'alien',name:'Tide Horror',alienType:'Tide Horror',revealed:false};
 const mission={id:'stand-resolve',kind:'Alien Incident',region:'Europe',gridSize:64,threat:1};
 const result=c.resolveMission({squad:[soldier],mission,tech:[],mode:'simulation',initialBattleState:{units:[human,alien],covers:[],round:1,gridSize:64},maxRoundsOverride:1,simulationChunkOnly:true});
 assert.ok(result.frames.length>1);
 assert.equal(result.frames[0].soldiers[0].kneeling,true);
 assert.ok(result.frames.some(frame=>frame.soldiers.some(u=>u.x!==human.x||u.y!==human.y)),'AI actually moved');
 for(const frame of result.frames)for(const u of frame.soldiers){assert.equal(typeof u.kneeling,'boolean');assert.ok(u.tu>=0);}
});
