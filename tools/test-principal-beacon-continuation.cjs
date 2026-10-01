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

function fixture(){
 const c=runtimeContext(),mission={id:'combat-beacon',kind:'Alien Incident',region:'Europe',gridSize:32,incidentVipCount:0,incidentCivilianCount:0,incidentRescueCountVersion:2,clock:{minute:720}};
 const human={id:'h',name:'Tester',team:'human',alive:true,hp:40,maxHp:40,tu:48,maxTu:48,weaponKind:'laser',ammo:12,grenadeCharges:0,x:8,y:8,facing:'E',acc:80};
 const alien={id:'a',team:'alien',alive:true,hp:90,maxHp:90,x:17,y:11,facing:'W',weaponKind:'alien',tu:0,maxTu:1};
 const beacon={...c.tacticalAlienFieldBeaconCover({x:13,y:8},mission,32),hp:150,maxHp:150,alienBeaconShield:'none',revealed:true};
 return{c,mission,human,alien,beacon,args:{unit:human,units:[human,alien],visibleAliens:[alien],covers:[beacon],mission,knowledge:'confirmed'}};
}

test('extracted principal still permits real AI rounds against a required beacon', async()=>{
 const f=fixture(), c=f.c, game=c.makeNewGameData({openingIncidentSeed:875});
 const mission={...c.makePrincipalRescueMission({id:'principal-beacon-loop',reward:400}),gridSize:32,clock:{minute:720}};
 const base={...game.soldiers[0],id:'h',equipment:'Laser Carbine'};
 const human={...f.human,baseSoldier:base,fireTeamId:'alpha',fireTeamLeaderId:'h',fireTeamRole:'leader'};
 const principal={...c.principalUnitFields(mission,0),team:'civilian',alive:true,hp:18,rescued:true,x:2,y:2};
 c.Math.random=()=>.5;
 const initialBattleState={units:[human,principal],covers:[f.beacon],round:6,gridSize:32};
 const batch=await c.resolveMissionAiStreamBatchAsync({squad:[base],mission,initialBattleState,alienFieldBeaconKnowledge:'confirmed'});
 assert.ok(batch.frames.some(frame=>(frame.shots||[]).some(shot=>shot.targetAlienBeacon)),JSON.stringify(batch.result.logs));
 assert.equal(batch.selfHealReason,null,'must not reconstruct an unexecuted round');
 assert.ok(batch.complete || batch.continuation.round>6,'must finish or advance the round');
});

test('principal loss or extraction without a required beacon still ends immediately',async()=>{
 for(const lost of [false,true]){
  const f=fixture(),c=f.c,mission={...c.makePrincipalRescueMission({id:'principal-terminal',reward:400}),gridSize:32};
  const base={...c.makeNewGameData({openingIncidentSeed:875}).soldiers[0],id:'h'};
  const human={...f.human,baseSoldier:base};
  const principal={...c.principalUnitFields(mission,0),team:'civilian',alive:!lost,hp:lost?0:18,rescued:!lost,x:2,y:2};
  const batch=await c.resolveMissionAiStreamBatchAsync({squad:[base],mission,initialBattleState:{units:[human,principal],covers:[],round:6,gridSize:32}});
  assert.equal(batch.complete,true);assert.equal(batch.result.success,!lost);
 }
});

test('an unresolved zero-round result cannot be silently reconstructed forever',async()=>{
 const c=runtimeContext();
 c.tacticalResolveBoundedAiRoundCooperative=async()=>({result:{success:false,operationIncomplete:true,frames:[{round:5,soldiers:[{id:'h',team:'human',hp:40,alive:true}],aliens:[],civilians:[],covers:[]}]}});
 await assert.rejects(c.resolveMissionAiStreamBatchAsync({mission:{id:'no-progress'},initialBattleState:{round:6,units:[{id:'h',team:'human',hp:40,alive:true}],covers:[]}}),/did not advance/);
});
