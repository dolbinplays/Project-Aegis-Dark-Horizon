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

const THREE=require('../assets/vendor/three.min.js');
test('bounded cooperative planners restore global limits between interleaved slices',async()=>{
 const c=runtimeContext(),flags=[],pending=[];let now=0;
 const flag=()=>vm.runInContext('TACTICAL_AI_FAST_HANDOFF_ACTIVE',c);
 c.tacticalAiNowMs=()=>now+=50;c.tacticalStartupYield=()=>new Promise(resolve=>pending.push(resolve));
 c.resolveMissionGenerator=function*(){flags.push(flag());yield{phase:'one'};flags.push(flag());return{success:true};};
 const first=c.tacticalResolveBoundedAiRoundCooperative({},'stream'),second=c.tacticalResolveBoundedAiRoundCooperative({},'stream');
 assert.equal(flag(),false);assert.equal(pending.length,2);
 pending.shift()();await first;assert.equal(flag(),false);pending.shift()();await second;
 assert.deepEqual(flags,[true,true,true,true]);assert.equal(flag(),false);
});
test('cancelled planning performs no initial or resumed work and closes its generator',async()=>{
 const c=runtimeContext();let executed=0,closed=0,cancel=true,now=0;
 c.resolveMissionGenerator=function*(){try{executed++;yield{};executed++;return{};}finally{closed++;}};
 await assert.rejects(c.resolveMissionCooperative({},{shouldCancel:()=>cancel}),e=>e.code==='AEGIS_AI_COOPERATIVE_CANCELLED');assert.equal(executed,0);
 cancel=false;c.tacticalAiNowMs=()=>now+=50;c.tacticalStartupYield=async()=>{cancel=true;};
 await assert.rejects(c.tacticalResolveBoundedAiRoundCooperative({},'stream',{shouldCancel:()=>cancel}),e=>e.code==='AEGIS_AI_COOPERATIVE_CANCELLED');
 assert.equal(executed,1);assert.equal(closed,1);assert.equal(vm.runInContext('TACTICAL_AI_FAST_HANDOFF_ACTIVE',c),false);
});
test('checkpoint failures close planning and restore global execution limits',async()=>{
 const c=runtimeContext();let closed=false,now=0;c.tacticalAiNowMs=()=>now+=50;
 c.resolveMissionGenerator=function*(){try{yield{};return{};}finally{closed=true;}};
 await assert.rejects(c.tacticalResolveBoundedAiRoundCooperative({},'stream',{onCheckpoint:()=>{throw Error('checkpoint failed');}}),/checkpoint failed/);
 assert.equal(closed,true);assert.equal(vm.runInContext('TACTICAL_AI_FAST_HANDOFF_ACTIVE',c),false);
});
function cameraFixture(){const c=runtimeContext(),coverRoot=new THREE.Group(),runtime={THREE,coverRoot,renderer:{domElement:{dataset:{}}}},wall=new THREE.Mesh(new THREE.BoxGeometry(4,4,.1),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));return{c,runtime,wall};}
test('TPV clearance stops before close walls instead of clamping through them',()=>{
 const {c,runtime,wall}=cameraFixture();runtime.coverRoot.add(wall);
 for(const distance of [.1,.3,.5,1]){wall.position.z=distance;runtime.coverRoot.updateMatrixWorld(true);const result=c.tacticalThreePersistentThirdPersonRayClearance(runtime,new THREE.Vector3(),new THREE.Vector3(0,0,2));assert.equal(result.clear,false);assert.ok(result.position.z<distance-.05);assert.ok(result.position.z>=0);}
});
test('hidden parent groups do not produce phantom TPV obstructions',()=>{
 const {c,runtime,wall}=cameraFixture(),hidden=new THREE.Group();hidden.visible=false;wall.position.z=1;hidden.add(wall);runtime.coverRoot.add(hidden);runtime.coverRoot.updateMatrixWorld(true);
 assert.equal(c.tacticalThreePersistentThirdPersonRayClearance(runtime,new THREE.Vector3(),new THREE.Vector3(0,0,2)).clear,true);
 hidden.visible=true;assert.equal(c.tacticalThreePersistentThirdPersonRayClearance(runtime,new THREE.Vector3(),new THREE.Vector3(0,0,2)).clear,false);
});
test('elevated TPV side recovery preserves horizontal orbit radius',()=>{
 const {c,runtime}=cameraFixture(),candidates=[];let calls=0;
 c.tacticalThreePersistentThirdPersonRayClearance=(r,look,desired)=>{candidates.push(desired.clone());return{position:desired.clone(),clear:++calls>1,distance:calls===1?1:desired.distanceTo(look)};};
 c.tacticalThreePersistentResolveThirdPersonCameraPosition(runtime,new THREE.Vector3(),new THREE.Vector3(0,12,4));
 assert.ok(candidates.length>1);for(const candidate of candidates.slice(1))assert.ok(Math.abs(Math.hypot(candidate.x,candidate.z)-4)<1e-9);
});







