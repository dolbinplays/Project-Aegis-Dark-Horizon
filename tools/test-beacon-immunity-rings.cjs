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
const beacon={alienBeacon:true,hp:72,alienBeaconState:'active'};
test('ring sets derive from combat immunity with stable colors',()=>{
 for(const shield of ['none','kinetic','combined','unknown']){
  const styles=c.tacticalAlienBeaconImmunityRingStyles({...beacon,alienBeaconShield:shield});
  for(const kind of ['ballistic','laser'])assert.equal(styles.some(s=>s.kind===kind),c.tacticalAlienBeaconShieldBlocksDamage(shield,kind));
 }
 const kinetic=c.tacticalAlienBeaconImmunityRingStyles({...beacon,alienBeaconShield:'kinetic'});
 const combined=c.tacticalAlienBeaconImmunityRingStyles({...beacon,alienBeaconShield:'combined'});
 assert.equal(kinetic.length,1);assert.equal(combined.length,2);assert.equal(kinetic[0].color,combined[0].color);assert.notEqual(combined[0].color,combined[1].color);
});
test('disabled, destroyed and ordinary covers do not carry rings',()=>{
 for(const patch of [{hp:0},{alienBeaconState:'disabled'},{alienBeaconState:'destroyed'},{alienBeacon:false}]){
  assert.equal(c.tacticalAlienBeaconImmunityRingStyles({...beacon,alienBeaconShield:'combined',...patch}).length,0);
 }
});
test('crown geometry remains small, depth-tested and detached from combat state',()=>{
 const cover={...beacon,alienBeaconShield:'combined'},before=JSON.stringify(cover),group=new THREE.Group();
 const mat=(key,color)=>new THREE.MeshStandardMaterial({color});
 c.tacticalThreeAddBeaconImmunityRings(THREE,group,mat,cover);
 assert.equal(group.children.length,2);assert.equal(JSON.stringify(cover),before);
 for(const mesh of group.children){assert.ok(mesh.position.y>1.4);assert.equal(mesh.material.depthTest,true);assert.equal(mesh.geometry.parameters.radius,0.53);}
 assert.ok(group.children[1].position.y>group.children[0].position.y);
 let disposed=0;group.traverse(node=>node.geometry?.addEventListener('dispose',()=>disposed++));
 c.tacticalThreePersistentClearRoot(group,{sharedGeometries:new Set(),sharedMaterials:new Set()});
 assert.equal(disposed,2);assert.equal(group.children.length,0);
});
test('rings remain inside the visibility-gated cover renderer shared by 3D views',()=>{
 const begin=appSource.indexOf("function tacticalThreePersistentBuildCovers(");const code=appSource.slice(begin,appSource.indexOf("\nfunction ",begin+10));
 assert.ok(code.indexOf('tacticalThreeBuildingPresentationCoverShouldRender')<code.indexOf('tacticalThreeAddBeaconImmunityRings'));
 const gate=c.tacticalThreeBuildingPresentationCoverShouldRender;
 assert.equal(gate({...beacon,visual:'alien-field-beacon',x:20,y:20,revealed:false},{id:'rings'},new Set(),new Set()),false);
 assert.equal(gate({...beacon,visual:'alien-field-beacon',x:20,y:20,revealed:true},{id:'rings'},new Set(),new Set([c.tacticalKey(20,20)])),true);
});
