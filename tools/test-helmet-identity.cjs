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
test('all portrait helmet markings produce bounded geometry in the same colors',()=>{
 for(const kind of ['stripe','star','chevron','red mark','blue mark']){
  const group=new THREE.Group(),visual={appearance:{helmetDecal:kind},isUnderclothes:false};
  const mark=c.addTacticalHelmetIdentityMarking(THREE,group,visual);
  assert.equal(group.children.length,1);assert.equal(mark.userData.helmetIdentityMarking,kind);
  assert.equal(mark.material.color.getHex(),kind==='red mark'?0xef4444:kind==='blue mark'?0x38bdf8:0xf59e0b);
  mark.geometry.computeBoundingBox();const box=mark.geometry.boundingBox;
  assert.ok(box.min.y>0.12&&box.max.y<0.28);assert.ok(box.min.z>0.14);assert.ok(box.max.x<0.1&&box.min.x> -0.1);
  assert.ok(mark.geometry.attributes.position.count<=40);
 }
});
test('unmarked and unequipped soldiers do not receive a decal',()=>{
 for(const visual of [{appearance:{helmetDecal:'none'}},{appearance:{helmetDecal:'unknown'}},{appearance:{helmetDecal:'star'},isUnderclothes:true}]){
  const group=new THREE.Group();assert.equal(c.addTacticalHelmetIdentityMarking(THREE,group,visual),null);assert.equal(group.children.length,0);
 }
});
test('classic helmets retain identity and follow changes in facing',()=>{
 const group=new THREE.Group(),material=new THREE.MeshStandardMaterial();
 const helmet=c.addTacticalSoldierThreeHelmet(THREE,group,material,false,{appearance:{helmetDecal:'star'}},'E');
 assert.equal(helmet.children.filter(n=>n.userData.helmetIdentityMarking).length,1);
 c.tacticalThreePersistentApplyFacing({geoCache:{}},group,{facing:'W'});
 assert.equal(helmet.rotation.y,c.tacticalArticulatedSoldierFacingAngle('W'));
 assert.equal(helmet.children.find(n=>n.userData.helmetIdentityMarking).parent,helmet);
});
test('saved appearance survives normalization and changes persistent model identity',()=>{
 const base={id:'identity',name:'Identity',team:'human',hp:40,armor:'Field Suit',equipment:'Ballistic Rifle',appearance:{helmetDecal:'red mark'}};
 const saved=JSON.parse(JSON.stringify(base));assert.equal(c.soldierVisualData(saved).appearance.helmetDecal,'red mark');
 assert.notEqual(c.tacticalThreePersistentUnitSignature(base),c.tacticalThreePersistentUnitSignature({...base,appearance:{...base.appearance,helmetDecal:'stripe'}}));
});
