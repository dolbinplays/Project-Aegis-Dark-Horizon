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
function visual(hairStyle,armor){return c.soldierVisualData({id:'hair',armor,appearance:{hairStyle,hair:'#92400e',accessory:'none'}});}
test('all saved hair styles use distinct bounded geometry, with bald and helmet coverage respected',()=>{
 const signatures=new Set();
 for(const style of ['buzz','short','sweep','curly','pony','mohawk']){
  const v=visual(style),surfaces=c.tacticalSoldierHairSurfaces(v);assert.ok(surfaces.length>0);signatures.add(JSON.stringify(surfaces));
  const positions=[],colors=[];c.tacticalAppendSoldierHairGeometry(THREE,positions,colors,v,0.155,0,[1,1,1]);
  assert.ok(positions.every(Number.isFinite));assert.ok(positions.length/3<=576);assert.equal(colors.length,positions.length);
  assert.equal(c.tacticalSoldierHairSurfaces(visual(style,'Field Suit')).length,0);
 }
 assert.equal(signatures.size,6);assert.equal(c.tacticalSoldierHairSurfaces(visual('bald')).length,0);
});
test('unarmored classic heads do not gain a helmet; equipped heads still do',()=>{
 const mat=new THREE.MeshStandardMaterial(),group=new THREE.Group();
 assert.equal(c.addTacticalSoldierThreeHelmet(THREE,group,mat,false,visual('short')),null);
 assert.ok(c.addTacticalSoldierThreeHelmet(THREE,group,mat,false,visual('short','Field Suit')));
});
test('hair stays in the existing face mesh with saved color and normal disposal',()=>{
 const group=new THREE.Group(),v=visual('pony'),face=c.addTacticalSoldierFace(THREE,group,v),before=JSON.stringify(v);
 assert.equal(group.children.length,1);assert.ok(face.geometry.attributes.position.count<=1200);
 const expected=new THREE.Color(v.hair),colors=face.geometry.attributes.color.array;
 assert.ok(Math.abs(colors[colors.length-3]-expected.r)<1e-6);
 group.rotation.y=1;group.updateMatrixWorld(true);assert.equal(JSON.stringify(v),before);
 let count=0;face.geometry.addEventListener('dispose',()=>count++);face.material.addEventListener('dispose',()=>count++);
 c.tacticalThreePersistentDisposeSubtree(group,{sharedGeometries:new Set(),sharedMaterials:new Set()});assert.equal(count,2);
});
test('hairstyle and armor changes invalidate model identity and survive save reload',()=>{
 const unit={id:'hair',team:'human',appearance:{hairStyle:'short',hair:'#92400e'}};
 const signature=c.tacticalThreePersistentUnitSignature(unit);
 assert.equal(signature,c.tacticalThreePersistentUnitSignature(JSON.parse(JSON.stringify(unit))));
 assert.notEqual(signature,c.tacticalThreePersistentUnitSignature({...unit,appearance:{...unit.appearance,hairStyle:'pony'}}));
 assert.notEqual(signature,c.tacticalThreePersistentUnitSignature({...unit,armor:'Field Suit'}));
});
