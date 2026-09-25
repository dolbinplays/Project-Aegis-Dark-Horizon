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
const mission=(kind,vips,civilians=0,known=true)=>({id:'quota',kind,incidentRescueCountVersion:2,incidentVipCount:vips,incidentCivilianCount:civilians,incidentVipCountKnown:known});
test('three-person critical rescue requires two but keeps unresolved survivors active',()=>{
 const m=mission('Alien Abduction',3);const quota=c.tacticalCivilianObjectiveForMission(m,3);
 assert.equal(quota.required,2);assert.match(c.incidentRescueBriefing(m),/2 of 3/);
 const pending=c.tacticalCivilianObjectiveProgress(m,3,2,0,1);
 assert.equal(pending.quotaMet,true);assert.equal(pending.canResolveVictory,false);
 const resolved=c.tacticalCivilianObjectiveProgress(m,3,2,1,0);
 assert.equal(resolved.canResolveVictory,true);
 assert.match(c.incidentRescueBriefing(m),/Reaching the minimum does not end the mission/);
});
test('briefings match mission authority for all small rescue populations',()=>{
 for(const kind of ['Alien Abduction','Alien Terror','Urban Attack','Farmstead','Alien Scout'])for(let total=0;total<=8;total++){
  const m=mission(kind,total);const quota=c.tacticalCivilianObjectiveForMission(m,total),text=c.incidentRescueBriefing(m);
  if(total===0)assert.match(text,/No rescue quota/);
  else if(quota.mandatory)assert.ok(text.includes(quota.required+' of '+total));
  else assert.match(text,/Optional rescue/);
 }
});
test('mixed population is explicit without folding civilians into VIP count',()=>{
 const m=mission('Urban Attack',2,3);
 assert.match(c.incidentVipBriefing(m),/VIP count: 2/);
 assert.match(c.incidentRescueBriefing(m),/3 of 5 people \(2 VIPs \+ 3 civilians\)/);
});
test('incomplete reports conceal quota and population until tracker confirmation',()=>{
 const a=mission('Alien Abduction',3,0,false),b=mission('Alien Abduction',8,0,false);
 assert.equal(c.incidentRescueBriefing(a),c.incidentRescueBriefing(b));
 assert.match(c.incidentRescueBriefing(a),/pending tracker confirmation/);
 assert.match(c.incidentRescueBriefing(c.confirmIncidentVipTrackers(a).mission),/2 of 3/);
});
