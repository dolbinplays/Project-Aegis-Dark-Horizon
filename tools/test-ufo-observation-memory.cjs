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
const mission={id:'observation',kind:'Alien Incident',gridSize:64,threat:2};
const arrival=()=>c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4},mission,round:5});
const advance=(a,round,units=[],covers=a.covers)=>c.tacticalAdvanceUfoBeaconDelivery({state:a.state,units,covers,mission,round});
test('unobserved delivery and beacon remain hidden through handoff',()=>{
 const a=arrival(),out=advance(a,7);assert.equal(a.state.dropship.deliveryLanding.craftObserved,false);
 assert.equal(out.changed,true);assert.equal(out.departureObserved,false);assert.equal(out.observed,false);assert.equal(out.beacon.revealed,false);
});
test('later source-specific sighting is latched before the handoff deadline',()=>{
 const a=arrival(),before=JSON.stringify(a);
 const covers=a.covers.map((v,i)=>i===0?{...v,revealed:true}:v);
 const out=advance(a,6,[],covers);assert.equal(out.changed,false);assert.equal(out.state.dropship.deliveryLanding.craftObserved,true);assert.equal(out.state.dropship.deliveryLanding.firstObservedRound,6);
 assert.equal(JSON.stringify(a),before);
 const loaded=JSON.parse(JSON.stringify(out.state));const normalized=c.tacticalAlienReinforcementState(mission,[],loaded);
 const departed=advance({...a,state:normalized},7);
 assert.equal(departed.departureObserved,true);assert.equal(departed.observed,false);assert.equal(departed.beacon.revealed,false);
 assert.equal(departed.state.dropship.deliveryLanding.firstObservedRound,6);
 assert.equal(advance({...a,state:departed.state,covers:departed.covers},8).changed,false);
});
test('another UFO or revealed scenery cannot authorize this delivery',()=>{
 const a=arrival();const unrelated=[{id:'other',x:1,y:1,hp:100,alienDropshipPart:'hull',ufoDeliverySourceId:'other',revealed:true}];
 const out=advance(a,6,[],[...a.covers,...unrelated]);assert.equal(out.state,a.state);
});
test('living soldier sight detects the craft; dead, downed and extracted observers cannot',()=>{
 const a=arrival(),ramp=a.placement.rampCells[0];
 const human={id:'observer',team:'human',hp:40,alive:true,x:ramp.x,y:ramp.y-1,facing:'S',gridSize:64};
 const seen=advance(a,6,[human]);assert.equal(seen.state.dropship.deliveryLanding.craftObserved,true);
 for(const patch of [{hp:0},{alive:false},{downed:true,unconscious:true},{extracted:true}]){
  const unseen=advance(a,6,[{...human,...patch}]);assert.equal(unseen.state.dropship.deliveryLanding.craftObserved,false);
 }
});
test('previously observed legacy version-two craft retains knowledge without revealing beacon',()=>{
 const a=arrival();a.state.dropship.revealed=true;delete a.state.dropship.deliveryLanding.craftObserved;
 const out=advance(a,7);assert.equal(out.departureObserved,true);assert.equal(out.beacon.revealed,false);
});

test('real AI continuation preserves sighting then labels departure without revealing the beacon',()=>{
 const a=arrival(),game=c.makeNewGameData({openingIncidentSeed:12345}),soldier=game.soldiers[0];
 const human={id:soldier.id,name:soldier.name,team:'human',hp:40,maxHp:40,alive:true,x:32,y:32,facing:'E',tu:50,maxTu:50,ammo:20,weaponKind:'ballistic',baseSoldier:soldier};
 const skyranger=c.tacticalSkyrangerPlacement({x:4,y:45});c.tacticalRegisterAlienDropship(skyranger,a.placement);
 const covers=a.covers.map((cover,i)=>i===0?{...cover,revealed:true}:cover);
 const initialBattleState={units:[human],covers,round:6,gridSize:64,skyranger,alienReinforcement:a.state};
 const result=c.resolveMission({squad:[soldier],mission,tech:game.tech||[],mode:'simulation',initialBattleState,maxRoundsOverride:3,simulationChunkOnly:true});
 const remembered=result.frames.find(frame=>frame.alienReinforcement?.dropship?.deliveryLanding?.craftObserved&&frame.alienReinforcement.dropship.deliveryLanding.phase==='landed');
 assert.ok(remembered,'pre-deadline sighting must enter streamed state');
 const handoff=result.frames.find(frame=>frame.ufoBeaconHandoff);
 assert.ok(handoff);assert.equal(handoff.ufoBeaconHandoff.departureObserved,true);assert.equal(handoff.ufoBeaconHandoff.observed,false);
 assert.equal(handoff.label,'UFO departure observed');assert.equal(handoff.covers.find(cover=>cover.deliveredByUfo).revealed,false);
});
