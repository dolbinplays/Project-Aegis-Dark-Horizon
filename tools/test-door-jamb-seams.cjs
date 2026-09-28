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









const c=runtimeContext();
const world=(x,y)=>c.tacticalThreeWorldForCell(x,y,0,0,0);
test('both jambs meet neighboring walls across row parity and facade orientations',()=>{
 for(const ns of [false,true])for(const y of [10,11])for(const side of [-1,1])for(const wallNs of [false,true]){
  const door={x:20,y,doorOrientation:ns?'ns':'ew',visual:'building-door-brick-'+(ns?'ns':'ew')};
  const wall={x:20+(ns?0:side),y:y+(ns?side:0),visual:'building-wall-brick-'+(wallNs?'ns':'ew')};
  const g=c.tacticalThreeDoorWallSeamGeometry({door,wall},world);if(!g)continue;
  const length=g.scale*0.92,ux=g.dx/g.distance,uz=g.dz/g.distance;
  const start={x:g.center.x-ux*length/2,z:g.center.z-uz*length/2},end={x:g.center.x+ux*length/2,z:g.center.z+uz*length/2};
  assert.ok(Math.hypot(start.x-g.jamb.x,start.z-g.jamb.z)<=0.021);
  const hx=wallNs?0.243:0.552,hz=wallNs?0.552:0.243;
  assert.ok(Math.abs(end.x-g.wallWorld.x)<=hx+1e-9);assert.ok(Math.abs(end.z-g.wallWorld.z)<=hz+1e-9);
  const spec=c.tacticalThreeBuildingDoorGeometrySpec(door);
  const inner=Math.abs(ns?start.z-g.doorWorld.z:start.x-g.doorWorld.x);
  const transverse=(ns?Math.abs(ux):Math.abs(uz))*g.depth/2;
  assert.ok(inner-transverse>spec.outerWidth/2-spec.jambWidth,'full connector stays outside aperture');
 }
});
test('doorway front/back neighbors cannot create an infill across the opening',()=>{
 for(const orientation of ['ew','ns']){
  const door={x:20,y:20,doorOrientation:orientation};
  const wall=orientation==='ew'?{x:20,y:21}:{x:21,y:20};
  assert.equal(c.tacticalThreeDoorWallSeamGeometry({door,wall},world),null);
 }
});
test('door swing and lock state do not change seam endpoints or mutate tactical data',()=>{
 const base={x:20,y:21,doorOrientation:'ns',visual:'building-door-brick-ns'},wall={x:20,y:22,visual:'building-wall-brick-ns'};
 const expected=JSON.stringify(c.tacticalThreeDoorWallSeamGeometry({door:base,wall},world));
 for(const doorState of ['open','closed','locked']){
  const door={...base,doorState},before=JSON.stringify(door);
  assert.equal(JSON.stringify(c.tacticalThreeDoorWallSeamGeometry({door,wall},world)),expected);assert.equal(JSON.stringify(door),before);
 }
});
