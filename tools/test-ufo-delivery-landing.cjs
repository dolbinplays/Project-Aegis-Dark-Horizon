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
const mission={id:'ufo-delivery',kind:'Alien Incident',region:'Europe',gridSize:64,threat:2,alienReinforcementDifficulty:'medium'};
test('landing footprint rejects hard props and occupied hull or ramp cells',()=>{
 const craft=c.tacticalAlienDropshipCraft({x:25,y:25},64,1);
 assert.equal(c.tacticalAlienDeliveryPlacementClear(craft,[],[]),true);
 for(const cell of [...craft.hullCells,...craft.rampCells]){
  assert.equal(c.tacticalAlienDeliveryPlacementClear(craft,[{id:'rock',...cell,hp:30,kind:'hard',block:1}],[]),false);
  assert.equal(c.tacticalAlienDeliveryPlacementClear(craft,[],[{id:'unit',...cell,hp:20}]),false);
 }
});
test('landing search skips a hard prop on its first otherwise valid footprint',()=>{
 const first=c.tacticalAlienDropshipPlacement({mission,round:5});assert.ok(first);
 const rock={id:'rock',...first.hullCells[0],hp:30,kind:'hard',block:1};
 const next=c.tacticalAlienDropshipPlacement({mission,covers:[rock],round:5});assert.ok(next);
 assert.equal(c.tacticalAlienDeliveryPlacementClear(next,[rock],[]),true);
 assert.notDeepEqual(next.rampCenter,first.rampCenter);
});
test('delivery record fixes one hull-center anchor and detaches snapshot arrays',()=>{
 for(const sign of [-1,1]){
  const craft=c.tacticalAlienDropshipCraft({x:25,y:25},64,sign),record=c.tacticalAlienDeliveryLandingRecord({mission,placement:craft,waveNumber:2,round:7,unitIds:['a','a','b']});
  assert.ok(craft.hullCells.some(p=>p.x===record.beaconCenter.x&&p.y===record.beaconCenter.y));
  assert.equal(record.sourceId,'ufo-delivery:ufo-delivery:2');assert.equal(record.arrivalUnitIds.length,2);
  const copy=JSON.stringify(record);craft.hullCells[0].x=0;assert.equal(JSON.stringify(record),copy);
 }
});
test('actual arrival stores identity and normalizing a saved state preserves it without aliasing',()=>{
 const state={waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4};
 const arrival=c.tacticalAlienReinforcementArrival({state,mission,round:5});assert.equal(arrival.landed,true);assert.equal(arrival.deploymentKind,'dropship');
 const record=arrival.state.dropship.deliveryLanding;assert.ok(record);assert.equal(record.arrivalUnitIds.length,arrival.reinforcements.length);
 const normalized=c.tacticalAlienReinforcementState(mission,arrival.units,JSON.parse(JSON.stringify(arrival.state)));
 assert.equal(JSON.stringify(normalized.dropship.deliveryLanding),JSON.stringify(record));
 const again=c.tacticalAlienReinforcementState(mission,arrival.units,arrival.state);again.dropship.deliveryLanding.beaconCenter.x=-1;assert.notEqual(record.beaconCenter.x,-1);
 assert.equal(c.tacticalAlienReinforcementState(mission,[],{dropship:{rampCenter:{x:1,y:2}}}).dropship.deliveryLanding,undefined);
});
