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

function model(c,alien=false,flight=false,heading='SE'){
 const placement=c.tacticalSkyrangerPlacementForHeading({x:24,y:24},64,heading);
 placement.alienCraft=alien;const before=JSON.stringify(placement);
 const scene=new THREE.Scene(),craft=c.addTacticalSkyrangerThreeModel(THREE,scene,(x,y)=>({x:x+(y%2)*.5,z:y*.866}),placement,(_key,color)=>new THREE.MeshStandardMaterial({color}),{tacticalLighting:{phase:'day'},ufoFlightPresentation:flight});
 assert.equal(JSON.stringify(placement),before,'rendering must not mutate authoritative placement');
 craft.position.set(0,0,0);craft.rotation.set(0,0,0);craft.updateMatrixWorld(true);return craft;
}
test('high wings clear the walkable cabin and retain attached engines',()=>{
 const c=runtimeContext(),craft=model(c),roof=craft.getObjectByName('troop-bay-roof');
 for(const side of ['left','right']){
  const wing=craft.getObjectByName(side+'-wing'),bounds=new THREE.Box3().setFromObject(wing);
  assert.ok(bounds.min.y>2,'wing clears lower occupancy volume');
  assert.ok(bounds.max.y>=roof.position.y,'wing attaches at roofline');
  assert.ok(side==='left'?bounds.max.x<-2.575:bounds.min.x>2.575,'wing stays outside cabin width');
  const engine=craft.getObjectByName(side+'-engine'),glow=craft.getObjectByName(side+'-engine-glow');
  assert.equal(engine.position.y,glow.position.y);assert.ok(bounds.intersectsBox(new THREE.Box3().setFromObject(engine)),'engine remains attached');
 }
 assert.equal(craft.getObjectByName('rear-ramp').userData.extractionPoint,true);
 assert.equal(craft.getObjectByName('troop-bay-floor').position.y,.48);
 if(process.env.AEGIS_TRANSPORT_PREVIEW)fs.writeFileSync(process.env.AEGIS_TRANSPORT_PREVIEW+'/skyranger.json',JSON.stringify(craft.toJSON()));
});
test('flight UFO has a closed hull without ramp or rails; landed UFO retains access',()=>{
 const c=runtimeContext();
 for(const heading of ['N','NE','SE','S','SW','NW']){
  const landed=model(c,true,false,heading),flying=model(c,true,true,heading);
  for(const name of ['saucer-rear-ramp','saucer-left-ramp-rail','saucer-right-ramp-rail']){assert.ok(landed.getObjectByName(name));assert.equal(flying.getObjectByName(name),undefined);}
  for(const name of ['saucer-lower-disc','saucer-main-disc']){assert.equal(flying.getObjectByName(name).geometry.parameters.thetaLength,Math.PI*2);assert.ok(landed.getObjectByName(name).geometry.parameters.thetaLength<Math.PI*2);}
  if(process.env.AEGIS_TRANSPORT_PREVIEW&&heading==='SE')for(const [name,craft]of Object.entries({landed,flying}))fs.writeFileSync(process.env.AEGIS_TRANSPORT_PREVIEW+'/'+name+'.json',JSON.stringify(craft.toJSON()));
 }
});
test('approach and departure instantiate flight presentation models without changing event state',()=>{
 const c=runtimeContext();let settings;
 c.addTacticalSkyrangerThreeModel=(_t,_s,_w,_p,_m,opts)=>{settings=opts;return new THREE.Group();};
 c.tacticalThreePersistentSetAnimationState=()=>{};
 for(const phase of ['approach','departure']){
  const runtime={THREE,effectRoot:new THREE.Group(),coverRoot:new THREE.Group(),worldFor:(x,y)=>({x,z:y}),qualitySettings:{},renderer:{domElement:{dataset:{}}}};
  const event={id:phase,ufoFlight:{phase,sourceId:'test',craft:{alienCraft:true},flightPlan:{landing:{x:5,y:5},entry:{x:0,y:0},exit:{x:20,y:20}}}},before=JSON.stringify(event);
  assert.equal(c.tacticalThreePersistentStartUfoFlightPresentation(runtime,event),true);assert.equal(settings.ufoFlightPresentation,true);assert.equal(JSON.stringify(event),before);
 }
});
