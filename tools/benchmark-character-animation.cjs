const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(process.env.AEGIS_BENCH_SOURCE || path.join(root, 'src', 'browser-runtime.html'), 'utf8');
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
const geometry=new THREE.BoxGeometry(0.3,0.4,0.2),r={THREE,qualitySettings:{shadows:false,standardMaterials:true},geoCache:new Proxy({}, {get:()=>geometry}),materialCache:new Map(),sharedMaterials:new Set(),sharedGeometries:new Set(),unitNodes:new Map(),soldierModelStyle:'articulated',articulatedDetailMode:'mid'};
for(let i=0;i<60;i++){
 const unit=i<48?{id:'soldier-'+i,team:'human',hp:40,appearance:{gender:i%2?'female':'male',trophy:'patch'},armor:'Field Suit'}:{id:'vip-'+i,team:'civilian',vip:true,hp:30};
 const node=c.tacticalThreePersistentCreateUnitNode(r,unit,i);node.userData.walking=true;r.unitNodes.set(unit.id,node);
}
const result={fixture:'48 mid-detail soldiers + 12 VIPs, CPU animation only',samples:{}};
for(const moving of [0,12,60]){
 let i=0;for(const node of r.unitNodes.values())node.userData.walking=i++<moving;
 for(let frame=0;frame<100;frame++)c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,frame*16.67);
 const samples=[];
 for(let sample=0;sample<9;sample++){
 const start=performance.now();for(let frame=0;frame<300;frame++)c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,frame*16.67);
 samples.push((performance.now()-start)/300);
 }
 samples.sort((a,b)=>a-b);result.samples[moving]={medianMs:samples[4],worstBatchMs:samples[8]};
}
console.log(JSON.stringify(result,null,2));
