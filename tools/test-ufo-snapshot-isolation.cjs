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








const c=runtimeContext(),mission={id:'snapshot',kind:'Alien Incident',gridSize:64,threat:2};
function arrival(){return c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4},mission,round:5});}
test('normalizing live delivery state detaches every mutable placement field',()=>{
 const a=arrival(),before=JSON.stringify(a.state),n=c.tacticalAlienReinforcementState(mission,a.units,a.state);
 n.dropship.hullCells[0].x=-1;n.dropship.rampCells[0].y=-1;n.dropship.rampCenter.x=-1;n.dropship.deliveryCenter.y=-1;n.dropship.deploymentCenter.x=-1;n.dropship.deliveryLanding.craftObserved=true;
 assert.equal(JSON.stringify(a.state),before);
});
test('real AI frame craft snapshots cannot rewrite other frames or reinforcement state',()=>{
 const a=arrival(),game=c.makeNewGameData({openingIncidentSeed:12345}),soldier=game.soldiers[0];
 const human={id:soldier.id,name:soldier.name,team:'human',hp:40,maxHp:40,alive:true,x:32,y:32,facing:'E',tu:50,maxTu:50,ammo:20,weaponKind:'ballistic',baseSoldier:soldier};
 const skyranger=c.tacticalSkyrangerPlacement({x:4,y:45});c.tacticalRegisterAlienDropship(skyranger,a.placement);
 const initialBattleState={units:[human],covers:a.covers,round:6,gridSize:64,skyranger,alienReinforcement:a.state};
 const result=c.resolveMission({squad:[soldier],mission,tech:game.tech||[],mode:'simulation',initialBattleState,maxRoundsOverride:3,simulationChunkOnly:true});
 const frames=result.frames.filter(frame=>frame.alienDropship);assert.ok(frames.length>=2);
 const first=frames[0],second=frames[1],before=JSON.stringify(second),stateBefore=JSON.stringify(first.alienReinforcement);
 first.alienDropship.hullCells[0].x=-1;first.alienDropship.deliveryLanding.beaconCenter.y=-1;first.alienDropship.deliveryLanding.craftObserved=true;
 assert.equal(JSON.stringify(second),before);assert.equal(JSON.stringify(first.alienReinforcement),stateBefore);
});
