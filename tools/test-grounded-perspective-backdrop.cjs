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

const c=runtimeContext(),THREE=require('../assets/vendor/three.min.js');
function fixture(mission,phase='day',size=64){
 const scene=new THREE.Scene(),skyRoot=new THREE.Group();scene.add(skyRoot);
 const runtime={THREE,scene,skyRoot,qualitySettings:{key:'auto'},renderer:{domElement:{dataset:{}}},sharedGeometries:new Set(),sharedMaterials:new Set(),firstPersonGround:new THREE.Group(),isoGround:new THREE.Group()};
 const group=c.tacticalThreePersistentBuildPerspectiveBackdrop(runtime,mission,{bottom:0x64748b,lighting:{phase}},size);
 return{runtime,group,camera:new THREE.PerspectiveCamera(60,1,.1,300)};
}
test('distant scenery remains in map coordinates across camera heights, translations and rotations',()=>{
 for(const [kind,region] of [['Urban Terror','North America'],['Town Abduction','Europe'],['Alien Hunt','South America']])for(const phase of ['day','twilight','night'])for(const size of [64,80,96]){
  const f=fixture({id:'grounded-'+kind,kind,region,threat:2,tacticalMapTier:size===64?'small':size===80?'medium':'large'},phase,size);
  const batch=f.group.children.find(child=>child.isInstancedMesh);assert.ok(batch);const local=new THREE.Matrix4();batch.getMatrixAt(0,local);
  const expected=new THREE.Vector3().setFromMatrixPosition(local);
  for(const [x,y,z] of [[0,1.7,0],[0,8,0],[0,30,0],[45,40,-30],[-40,2,35],[0,1.7,0]]){
   f.camera.position.set(x,y,z);f.camera.lookAt(0,0,0);c.tacticalThreePersistentSyncSkyToCamera(f.runtime,f.camera);
   const actual=new THREE.Vector3().setFromMatrixPosition(new THREE.Matrix4().multiplyMatrices(batch.matrixWorld,local));assert.ok(actual.distanceTo(expected)<1e-9);
   assert.ok(f.runtime.skyRoot.position.distanceTo(f.camera.position)<1e-9);
   assert.equal(f.group.parent,f.runtime.skyRoot);assert.ok(f.runtime.perspectiveBackdropDrawCalls<=4);
  }
  c.tacticalThreePersistentClearRoot(f.runtime.skyRoot,f.runtime);assert.equal(f.runtime.skyRoot.children.length,0);
 }
});
test('window atlas and haze retain their world transforms during free-camera movement',()=>{
 const f=fixture({id:'night-windows',kind:'Urban Terror',region:'North America',threat:3},'night',80);
 const windows=f.group.children.find(child=>child.userData.aegisSeededNightWindows),haze=f.group.children.find(child=>child.userData.aegisConsolidatedHorizonHaze);assert.ok(windows);assert.ok(haze);
 f.camera.position.set(0,2,0);c.tacticalThreePersistentSyncSkyToCamera(f.runtime,f.camera);const before=windows.matrixWorld.clone(),hazeBefore=haze.matrixWorld.clone();
 f.camera.position.set(24,35,-28);c.tacticalThreePersistentSyncSkyToCamera(f.runtime,f.camera);
 assert.ok(windows.matrixWorld.equals(before));assert.ok(haze.matrixWorld.equals(hazeBefore));
 assert.equal(f.runtime.renderer.domElement.dataset.aegisPerspectiveBackdropPointLights,'0');
});
test('FPV, TPV, reaction view and Iso switches preserve grounding and visibility ownership',()=>{
 const f=fixture({id:'view-switch',kind:'Urban Terror',region:'Europe'},'day');
 for(const [enabled,mode] of [[true,'fpv'],[true,'tpv'],[true,'reaction-tpv'],[false,'iso'],[true,'tpv']]){
  c.tacticalThreePersistentSetFirstPersonGroundMode(f.runtime,enabled,mode);f.camera.position.set(8,mode==='tpv'?30:2,5);c.tacticalThreePersistentSyncSkyToCamera(f.runtime,f.camera);
  assert.equal(f.group.visible,enabled);assert.equal(f.group.getWorldPosition(new THREE.Vector3()).length(),0);
 }
 let disposed=0;f.group.traverse(node=>node.geometry?.addEventListener('dispose',()=>disposed++));
 c.tacticalThreePersistentClearRoot(f.runtime.skyRoot,f.runtime);assert.ok(disposed>=2);
 const next=c.tacticalThreePersistentBuildPerspectiveBackdrop(f.runtime,{id:'rebuilt',kind:'Town Abduction',region:'Europe'},{lighting:{phase:'day'}},64);
 c.tacticalThreePersistentSyncSkyToCamera(f.runtime,f.camera);assert.equal(next.getWorldPosition(new THREE.Vector3()).length(),0);
});







