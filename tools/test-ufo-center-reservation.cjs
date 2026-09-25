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








const c=runtimeContext(),mission={id:'center',kind:'Alien Incident',gridSize:64,threat:2};
test('both headings reserve the central hull hex without closing the ramp',()=>{
 for(const sign of [-1,1])for(const anchor of [{x:25,y:25},{x:0,y:0},{x:63,y:63}]){
  const craft=c.tacticalAlienDropshipCraft(anchor,64,sign),center=craft.deliveryCenter,covers=c.tacticalAlienDropshipCovers(craft);
  assert.equal(center.x,craft.rampCenter.x);assert.equal(center.y,craft.rampCenter.y+3*sign);
  assert.equal(c.isHardCoverAt(covers,center.x,center.y),true);
  assert.ok(craft.rampCells.every(cell=>!c.isHardCoverAt(covers,cell.x,cell.y)));
  assert.equal(c.tacticalAlienDeliveryPlacementClear(craft,[],[{...center,id:'vip',team:'civilian',hp:18}]),false);
  assert.equal(c.tacticalAlienDeliveryPlacementClear(craft,[{...center,id:'rock',kind:'hard',hp:100}],[]),false);
  const record=c.tacticalAlienDeliveryLandingRecord({mission,placement:craft,round:5});
  assert.deepEqual(JSON.parse(JSON.stringify(record.beaconCenter)),JSON.parse(JSON.stringify(center)));
  craft.deliveryCenter.x=-1;assert.notEqual(record.beaconCenter.x,-1);
 }
});
test('arrival through save and departure plants exactly on its reserved center',()=>{
 const a=c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:10},mission,round:5});
 assert.equal(a.landed,true);const center=a.placement.deliveryCenter;
 assert.ok(a.reinforcements.every(unit=>unit.x!==center.x||unit.y!==center.y));
 const state=c.tacticalAlienReinforcementState(mission,a.units,JSON.parse(JSON.stringify(a.state)));
 const out=c.tacticalAdvanceUfoBeaconDelivery({state,units:a.units,covers:a.covers,mission,round:7});
 assert.equal(out.changed,true);assert.equal(out.beacon.x,center.x);assert.equal(out.beacon.y,center.y);
 assert.equal(out.covers.filter(cover=>cover.alienBeacon).length,1);
});
test('older saved deliveries retain their previously committed anchor',()=>{
 const a=c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4},mission,round:5});
 const oldAnchor=a.placement.hullCells.find(cell=>cell.x!==a.placement.deliveryCenter.x);
 a.state.dropship.deliveryLanding.beaconCenter={x:oldAnchor.x,y:oldAnchor.y};delete a.state.dropship.deliveryCenter;
 const state=c.tacticalAlienReinforcementState(mission,a.units,JSON.parse(JSON.stringify(a.state)));
 const out=c.tacticalAdvanceUfoBeaconDelivery({state,units:a.units,covers:a.covers,mission,round:7});
 assert.equal(out.changed,true);assert.equal(out.beacon.x,oldAnchor.x);assert.equal(out.beacon.y,oldAnchor.y);
});
