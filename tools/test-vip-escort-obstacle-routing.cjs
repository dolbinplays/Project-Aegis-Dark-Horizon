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
const leader={id:'escort',team:'human',alive:true,hp:40,tu:60,x:8,y:5,facing:'E'};
const vip={id:'vip',team:'civilian',alive:true,hp:18,x:5,y:5,escortId:'escort',panic:false};
const mission={gridSize:32};
const wall=[4,5,6].map(y=>({id:'wall-'+y,x:6,y,hp:100,kind:'hard'}));
test('escorted VIP routes around a wall instead of staying at its nearest point',()=>{
 let units=[leader,vip];
 for(let i=0;i<12;i++)units=c.tacticalAdvanceEscortedCivilians(units,leader.id,leader,wall,null,0,mission,{applyFireTeamFormation:false});
 const result=units.find(u=>u.id===vip.id);
 assert.ok(result.x>=7,JSON.stringify(result));
 assert.equal(result.escortId,leader.id);
});

test('route avoids occupied cells and a forbidden access lane',()=>{
 const occupied=new Set(['8,5','5,4']);
 const step=c.tacticalEscortFollowerRouteStep({civilian:vip,desired:{x:7,y:5},leader,previousLeader:leader,covers:wall,units:[leader,vip],occupied,mission,cellAllowed:cell=>cell.y>=5});
 assert.ok(step);
 assert.equal(c.tacticalDistance(vip,step),1);
 assert.ok(step.y>=5);
 assert.equal(occupied.has(c.tacticalKey(step.x,step.y)),false);
 assert.equal(c.isHardCoverAt(wall,step.x,step.y),false);
});
test('a completely enclosed VIP waits without clipping through blockers',()=>{
 const sealed=c.tacticalNeighbors(vip.x,vip.y,32).map((cell,i)=>({...cell,id:'sealed-'+i,kind:'hard',hp:100}));
 const result=c.tacticalAdvanceEscortedCivilians([leader,vip],leader.id,leader,sealed,null,0,mission,{applyFireTeamFormation:false}).find(u=>u.id===vip.id);
 assert.equal(result.x,vip.x);assert.equal(result.y,vip.y);assert.equal(result.escortBlocked,true);
 assert.equal(result.escortId,leader.id);
});
test('an obstructed formation slot falls back to reachable space near escort',()=>{
 const covers=[{id:'slot',x:7,y:5,hp:100,kind:'hard'}];
 let units=[leader,vip];
 for(let i=0;i<8;i++)units=c.tacticalAdvanceEscortedCivilians(units,leader.id,leader,covers,null,0,mission,{applyFireTeamFormation:false});
 const result=units.find(u=>u.id===vip.id);
 assert.ok(c.tacticalDistance(result,leader)<=1);assert.equal(c.isHardCoverAt(covers,result.x,result.y),false);
});
test('escort movement contracts retain ramp, traffic, and separation behavior',()=>{
 for(const name of ['tacticalEscortCornerMobileTrafficYieldContractTest','tacticalRampContactNonclippingCivilianBoardingContractChecks','tacticalCivilianEscortSeparationFearCatchupContractChecks']){
  const checks=c[name]();for(const [label,pass] of Object.entries(checks))assert.equal(Boolean(pass),true,name+': '+label);
 }
});
