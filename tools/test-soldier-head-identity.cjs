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
test('all saved head shapes share portrait proportions across tactical detail levels',()=>{
 for(const [head,width,height] of [['narrow',24,31],['round',31,31],['square',30,31],['strong',28,33],['soft',28,29],['unknown',28,31]]){
  const visual=c.soldierVisualData({id:'shape',name:'Shape',appearance:{head},armor:'Field Suit'});
  const shape=c.soldierHeadShape(visual.appearance);assert.equal(shape.width,width);assert.equal(shape.height,height);
  const classic=c.tacticalSoldierHeadScale(visual),art=c.tacticalSoldierHeadScale(visual,true);
  assert.equal(classic[0],width/28);assert.equal(classic[1],height/31);
  assert.equal(art[0],classic[0]*0.92);assert.equal(art[1],classic[1]*1.04);
  const geo=new THREE.SphereGeometry(0.155,8,6),mesh=new THREE.Mesh(geo);mesh.scale.set(...art);mesh.updateMatrixWorld();
  const box=new THREE.Box3().setFromObject(mesh);assert.ok(box.max.x<0.178);assert.ok(box.max.y<0.178);
 }
});
test('saved head identity survives reload and invalidates a changed soldier model',()=>{
 const unit={id:'soldier',name:'Soldier',team:'human',hp:40,baseSoldier:{id:'soldier',name:'Soldier',armor:'Field Suit',appearance:{head:'narrow',helmetDecal:'star'}}};
 const restored=JSON.parse(JSON.stringify(unit));assert.equal(c.tacticalThreePersistentUnitSignature(restored),c.tacticalThreePersistentUnitSignature(unit));
 restored.baseSoldier.appearance.head='round';assert.notEqual(c.tacticalThreePersistentUnitSignature(restored),c.tacticalThreePersistentUnitSignature(unit));
});
test('legacy soldiers retain deterministic head identity',()=>{
 const soldier={id:'legacy',name:'Legacy',armor:'Field Suit'};
 const before=c.soldierVisualData(soldier),after=c.soldierVisualData(JSON.parse(JSON.stringify(soldier)));
 assert.deepEqual(c.tacticalSoldierHeadScale(before),c.tacticalSoldierHeadScale(after));
});

test('classic head proportions rotate with the soldier without changing scale',()=>{
 const node=new THREE.Group(),head=new THREE.Mesh(new THREE.SphereGeometry(0.2));head.userData.soldierIdentityHead=true;head.scale.set(...c.tacticalSoldierHeadScale({head:'narrow'}));node.add(head);
 for(const facing of ['E','W','NE','SW']){c.tacticalThreePersistentApplyFacing({geoCache:{}},node,{facing});assert.equal(head.rotation.y,c.tacticalArticulatedSoldierFacingAngle(facing));assert.equal(head.scale.x,24/28);}
});
