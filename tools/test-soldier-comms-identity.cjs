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
test('only saved comms appearance adds headset geometry, without changing identity',()=>{
 for(const accessory of ['none','comms','glasses','scar']){
  const visual=c.soldierVisualData({id:'radio',appearance:{accessory}}),before=JSON.stringify(visual);
  assert.equal(c.tacticalSoldierCommsSegments(visual).length,accessory==='comms'?4:0);
  const group=new THREE.Group(),face=c.addTacticalSoldierFace(THREE,group,visual);
  assert.equal(group.children.length,1);assert.equal(JSON.stringify(visual),before);
  assert.equal(face.userData.soldierFaceAccessory,accessory);
 }
});
test('headset follows head transforms and stays finite across head proportions and detail levels',()=>{
 for(const head of ['narrow','round','square','strong','soft'])for(const mid of [false,true]){
  const group=new THREE.Group(),visual=c.soldierVisualData({id:'radio',appearance:{head,accessory:'comms'}});
  const face=c.addTacticalSoldierFace(THREE,group,visual,0.155,mid?0.115:0,c.tacticalSoldierHeadScale(visual,mid));
  assert.ok(face.geometry.attributes.position.count<=600);assert.ok([...face.geometry.attributes.position.array].every(Number.isFinite));
  const local=new THREE.Vector3(0.16,-0.04,0.02),before=face.localToWorld(local.clone());group.rotation.y=Math.PI/2;group.position.set(4,2,3);group.updateMatrixWorld(true);
  const after=face.localToWorld(local.clone());assert.ok(after.distanceTo(before)>1);
  let disposed=0;face.geometry.addEventListener('dispose',()=>disposed++);face.material.addEventListener('dispose',()=>disposed++);
  c.tacticalThreePersistentDisposeSubtree(group,{sharedGeometries:new Set(),sharedMaterials:new Set()});assert.equal(disposed,2);
 }
});
test('save/reload and accessory changes retain or refresh model identity',()=>{
 const unit={id:'radio',team:'human',appearance:{head:'round',accessory:'comms'}};
 assert.equal(c.tacticalThreePersistentUnitSignature(unit),c.tacticalThreePersistentUnitSignature(JSON.parse(JSON.stringify(unit))));
 assert.notEqual(c.tacticalThreePersistentUnitSignature(unit),c.tacticalThreePersistentUnitSignature({...unit,appearance:{...unit.appearance,accessory:'none'}}));
});
