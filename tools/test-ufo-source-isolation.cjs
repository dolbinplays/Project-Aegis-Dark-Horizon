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
function craft(id,x=20){return {...c.tacticalAlienDropshipCraft({x,y:15},64),deliveryLanding:{sourceId:id}};}
test('register, update, and depart affect only their delivery identity',()=>{
 const player={id:'player'},wreck={id:'wreck',alienCraft:true,crashedUfo:true},a=craft('a'),b=craft('b');
 const state={crafts:[player,wreck,a]};c.tacticalRegisterAlienDropship(state,b);assert.equal(state.crafts.length,4);
 c.tacticalRegisterAlienDropship(state,{...b,revealed:true});assert.equal(state.crafts.length,4);assert.ok(state.crafts.includes(a));
 c.tacticalRegisterAlienDropship(state,{...b,departed:true});assert.deepEqual(Array.from(state.crafts,v=>v.id||v.deliveryLanding.sourceId),['player','wreck','a']);
 c.tacticalRegisterAlienDropship(state,{...b,departed:true});assert.equal(state.crafts.length,3);
});
test('legacy transports use stable ID or footprint and never replace unrelated craft',()=>{
 const a=c.tacticalAlienDropshipCraft({x:12,y:12},64),b=c.tacticalAlienDropshipCraft({x:30,y:12},64),state={crafts:[a,b]};
 c.tacticalRegisterAlienDropship(state,{...a,revealed:true});assert.equal(state.crafts.length,2);assert.ok(state.crafts.includes(b));
 c.tacticalRegisterAlienDropship(state,{...a,departed:true});assert.equal(state.crafts.length,1);assert.equal(state.crafts[0],b);
});
test('cover retirement requires explicit departure and preserves other source covers',()=>{
 const a=craft('a'),b=craft('b',40),ca=c.tacticalAlienDropshipCovers(a).map(v=>({...v,ufoDeliverySourceId:'a'})),cb=c.tacticalAlienDropshipCovers(b).map(v=>({...v,ufoDeliverySourceId:'b'}));
 const beacon={id:'beacon',alienBeacon:true},covers=[...ca,...cb,beacon];
 assert.equal(c.tacticalRetireAlienDropshipCovers(covers).length,covers.length);
 assert.equal(c.tacticalRetireAlienDropshipCovers(covers,a).length,covers.length);
 const out=c.tacticalRetireAlienDropshipCovers(covers,{...a,departed:true});assert.equal(out.length,cb.length+1);assert.ok(out.includes(beacon));assert.ok(out.includes(cb[0]));
});
test('a later actual wave preserves another landed transport and avoids its footprint',()=>{
 const mission={id:'isolation',kind:'Alien Incident',gridSize:64,threat:2,alienReinforcementDifficulty:'hard'};
 const other=craft('other'),covers=c.tacticalAlienDropshipCovers(other).map(v=>({...v,ufoDeliverySourceId:'other'})),skyranger={crafts:[other]};
 const out=c.tacticalAlienReinforcementArrival({state:{waveCount:1,called:true,arrivalRound:8,arrivalTotalCount:4},mission,covers,skyranger,round:8});
 assert.equal(out.landed,true);assert.ok(covers.every(v=>out.covers.some(w=>w.id===v.id)));
 assert.equal(c.tacticalCraftFootprintsSeparated(other,out.placement,1),true);
 c.tacticalRegisterAlienDropship(skyranger,out.placement);assert.ok(skyranger.crafts.includes(other));assert.equal(skyranger.crafts.length,2);
});
