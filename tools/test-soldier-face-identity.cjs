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
test('face accessories use saved appearance and hair color',()=>{
 const plain=c.tacticalSoldierFaceFeatures({appearance:{accessory:'none'}});assert.equal(plain.length,4);
 for(const [accessory,count] of [['scar',5],['glasses',13],['mustache',6],['bandage',5]]){
  const visual=c.soldierVisualData({id:'s',appearance:{accessory,hair:'#aabbcc'}}),features=c.tacticalSoldierFaceFeatures(visual);assert.equal(features.length,count);
  if(accessory==='mustache')assert.equal(features[4].color,'#aabbcc');
 }
});
test('all detail levels keep bounded finite face geometry in one owned mesh',()=>{
 for(const accessory of ['none','scar','glasses','mustache','bandage'])for(const mid of [false,true]){
  const parent=new THREE.Group(),visual=c.soldierVisualData({id:'s',appearance:{accessory,head:'narrow'}});
  const face=c.addTacticalSoldierFace(THREE,parent,visual,0.155,mid?0.115:0,mid?c.tacticalSoldierHeadScale(visual,true):[1,1,1]);
  assert.equal(parent.children.length,1);assert.ok(face.geometry.attributes.position.count>=c.tacticalSoldierFaceFeatures(visual).length*6);assert.ok(face.geometry.attributes.position.count<=400);
  assert.ok([...face.geometry.attributes.position.array].every(Number.isFinite));
  let disposed=0;face.geometry.addEventListener('dispose',()=>disposed++);face.material.addEventListener('dispose',()=>disposed++);
  c.tacticalThreePersistentDisposeSubtree(parent,{sharedGeometries:new Set(),sharedMaterials:new Set()});assert.equal(disposed,2);
 }
});
test('saved accessories survive reload and refresh model identity',()=>{
 const unit={id:'s',team:'human',name:'S',appearance:{head:'round',accessory:'scar',hair:'#112233'}};
 assert.equal(c.tacticalThreePersistentUnitSignature(unit),c.tacticalThreePersistentUnitSignature(JSON.parse(JSON.stringify(unit))));
 assert.notEqual(c.tacticalThreePersistentUnitSignature(unit),c.tacticalThreePersistentUnitSignature({...unit,appearance:{...unit.appearance,accessory:'glasses'}}));
});
