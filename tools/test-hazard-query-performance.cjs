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








const c=runtimeContext();
function oldFire(covers,x,y){let value=0;for(const cover of covers){if(!cover||Number(cover.hp)<=0||!c.tacticalCoverOccupiesCell(cover,x,y))continue;if(c.tacticalIsFireHazard(cover)||cover.burning)value=Math.max(value,c.clamp(Number(cover.fireIntensity)||1,1,3));}return value;}
function oldSmoke(covers,x,y){let value=0;for(const cover of covers){if(!cover||Number(cover.hp)<=0||!c.tacticalCoverOccupiesCell(cover,x,y))continue;value=Math.max(value,c.tacticalSmokeDensityForCover(cover));}return c.clamp(Number(value)||0,0,3);}
test('hazard queries match old calculations across footprints, destroyed props and in-place changes',()=>{
 const covers=[{x:3,y:4,hp:20,visual:'tree',kind:'hard'},{x:4,y:4,hp:20,burning:true,fireIntensity:2,footprintCells:[{x:4,y:4},{x:5,y:4}]},{x:6,y:4,hp:10,hazardType:'smoke',smokeDensity:3},{x:7,y:4,hp:0,hazardType:'fire',fireIntensity:3}];
 for(let stage=0;stage<3;stage++){
 for(let y=2;y<7;y++)for(let x=1;x<10;x++){assert.equal(c.tacticalFireIntensityAt(covers,x,y),oldFire(covers,x,y));assert.equal(c.tacticalSmokeDensityAt(covers,x,y),oldSmoke(covers,x,y));}
 covers[0].burning=true;covers[1].hp=stage===0?0:20;covers[2].smokeDensity=stage;
 }
});
test('non-hazard scenery does not expand footprints for fire or smoke checks',()=>{
 const covers=Array.from({length:378},(_,i)=>({id:'prop-'+i,x:i%40,y:Math.floor(i/40),hp:20,visual:'rock',kind:'hard'}));let calls=0;const original=c.tacticalCoverOccupiesCell;c.tacticalCoverOccupiesCell=(...args)=>{calls++;return original(...args);};
 try{assert.equal(c.tacticalFireIntensityAt(covers,5,5),0);assert.equal(c.tacticalSmokeDensityAt(covers,5,5),0);assert.equal(calls,0);}finally{c.tacticalCoverOccupiesCell=original;}
});
