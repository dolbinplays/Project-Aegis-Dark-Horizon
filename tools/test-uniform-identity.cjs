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
test('portrait and tactical markings share saved trophy identity and colors',()=>{
 assert.equal(c.tacticalSoldierUniformMarkingSpec({trophy:'none'}),null);
 for(const trophy of ['alien tooth','lucky charm','patch','dog tags']){
  const visual=c.soldierVisualData({id:'mark',appearance:{trophy}});
  const spec=c.tacticalSoldierUniformMarkingSpec(visual.appearance);
  assert.equal(spec.kind,trophy);assert.equal(spec.color,'#f59e0b');assert.equal(spec.border,'#451a03');
  const group=new THREE.Group(),mesh=c.addTacticalSoldierUniformMarking(THREE,group,visual);
  assert.equal(mesh.userData.soldierUniformMarking,trophy);assert.equal(group.children.length,1);assert.equal(mesh.geometry.attributes.position.count,72);
 }
 assert.ok(String(c.SoldierAvatar).includes('tacticalSoldierUniformMarkingSpec'));
});
test('unmarked soldiers get no mesh and marked geometry follows its torso and disposes',()=>{
 const group=new THREE.Group();assert.equal(c.addTacticalSoldierUniformMarking(THREE,group,{appearance:{trophy:'none'}}),null);
 const visual=c.soldierVisualData({id:'mark',appearance:{trophy:'patch'}}),before=JSON.stringify(visual),mesh=c.addTacticalSoldierUniformMarking(THREE,group,visual);
 const initial=mesh.getWorldPosition(new THREE.Vector3());group.rotation.y=Math.PI/2;group.position.x=3;group.updateMatrixWorld(true);
 assert.ok(mesh.getWorldPosition(new THREE.Vector3()).distanceTo(initial)>1);assert.equal(JSON.stringify(visual),before);
 let disposed=0;mesh.geometry.addEventListener('dispose',()=>disposed++);mesh.material.addEventListener('dispose',()=>disposed++);
 c.tacticalThreePersistentDisposeSubtree(group,{sharedGeometries:new Set(),sharedMaterials:new Set()});assert.equal(disposed,2);
});
test('saved marking changes refresh models without changing saved identity',()=>{
 const unit={id:'mark',team:'human',appearance:{trophy:'patch'}},signature=c.tacticalThreePersistentUnitSignature(unit);
 assert.equal(signature,c.tacticalThreePersistentUnitSignature(JSON.parse(JSON.stringify(unit))));
 assert.notEqual(signature,c.tacticalThreePersistentUnitSignature({...unit,appearance:{trophy:'none'}}));
 for(const name of ['tacticalThreePersistentAddArticulatedSoldierModel','tacticalThreePersistentAddArticulatedMidSoldierModel'])
 assert.ok(String(c[name]).includes('addTacticalSoldierUniformMarking'));
});
