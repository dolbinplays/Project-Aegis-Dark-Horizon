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
test('effective deployment preserves props and places all seven beacon cells outside buildings',()=>{
 for(let seed=1;seed<=12;seed++){
  const mission={id:'exterior-'+seed,kind:'Alien Incident',region:'Europe',gridSize:64,threat:2};
  const covers=c.makeBattlefield(mission), before=JSON.stringify(covers);
  const game=c.makeNewGameData({openingIncidentSeed:seed});
  const deployed=c.tacticalDeployment({squad:game.soldiers.slice(0,8),mission,covers});
  const beacon=deployed.covers.find(v=>v.alienBeacon);
  assert.ok(beacon,'mission '+seed+' has a legal beacon');
  assert.equal(c.tacticalBeaconFootprintIntersectsBuilding(beacon,mission),false);
  assert.equal(JSON.stringify(covers),before);
 }
});
test('saved interior beacon moves deterministically while preserving authority and playback',()=>{
 const mission={id:'saved-exterior',kind:'Alien Incident',region:'Europe',gridSize:64,threat:2};
 let interior;
 for(let y=3;y<61&&!interior;y++)for(let x=3;x<61;x++)if(c.tacticalBuildingCellAt(x,y,mission)){interior={x,y};break;}
 assert.ok(interior);
 const beacon={id:'saved-source:beacon',...interior,hp:71,maxHp:100,alienBeacon:true,revealed:false,shield:13,ufoDeliverySourceId:'saved-source'};
 const payload={missionId:mission.id,liveState:{deployment:{alienBeacon:{...beacon}},units:[],covers:[beacon],aiPlayback:{frames:[{covers:[{...beacon}]}]}},reinforcementState:{waveCount:4,arrivalRound:19,beacon:{id:beacon.id,...interior},rallyX:interior.x,rallyY:interior.y}};
 const before=JSON.stringify(payload);
 assert.equal(c.tacticalRestoreLiveStateSavePayload(mission,payload),true);
 const saved=vm.runInContext('TACTICAL_LIVE_STATE_CACHE.get("saved-exterior")',c);
 const state=vm.runInContext('TACTICAL_REINFORCEMENT_STATE_CACHE.get("saved-exterior")',c);
 const moved=saved.covers[0];
 assert.equal(c.tacticalBeaconFootprintIntersectsBuilding(moved,mission),false);
 assert.notDeepEqual([moved.x,moved.y],[interior.x,interior.y]);
 for(const key of ['id','hp','maxHp','shield','revealed','ufoDeliverySourceId'])assert.equal(moved[key],beacon[key]);
 assert.equal(state.waveCount,4);assert.equal(state.arrivalRound,19);
 assert.deepEqual([state.beacon.x,state.beacon.y],[moved.x,moved.y]);
 assert.deepEqual([saved.aiPlayback.frames[0].covers[0].x,saved.aiPlayback.frames[0].covers[0].y],[moved.x,moved.y]);
 assert.equal(JSON.stringify(payload),before);
 c.tacticalRestoreLiveStateSavePayload(mission,payload);
 const again=vm.runInContext('TACTICAL_LIVE_STATE_CACHE.get("saved-exterior").covers[0]',c);
 assert.deepEqual([again.x,again.y],[moved.x,moved.y]);
});
test('UFO handoff waits for occupied adjacent cells then plants without changing source or deadline',()=>{
 const mission={id:'ring-block',kind:'Alien Incident',region:'Europe',gridSize:64,threat:2};
 const arrival=c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4},mission,round:5});
 const record=arrival.state.dropship.deliveryLanding;
 const ring=c.tacticalReplacementBeaconDeploymentFootprintCells(record.beaconCenter,64);
 const cell=ring.find(v=>v.x!==record.beaconCenter.x||v.y!==record.beaconCenter.y);
 const blocked=c.tacticalAdvanceUfoBeaconDelivery({state:arrival.state,units:[{id:'guard',team:'alien',hp:20,...cell}],covers:arrival.covers,mission,round:7});
 assert.equal(blocked.changed,false);
 const out=c.tacticalAdvanceUfoBeaconDelivery({state:blocked.state,units:[],covers:blocked.covers,mission,round:8});
 assert.equal(out.changed,true);
 assert.equal(out.beacon.ufoDeliverySourceId,record.sourceId);
 assert.equal(out.state.dropship.deliveryLanding.handoffRound,record.handoffRound);
 assert.equal(c.tacticalBeaconFootprintIntersectsBuilding(out.beacon,mission),false);
});

test('replacement uses exterior authority and preserves wave progression',()=>{
 const mission={id:'replacement-exterior',kind:'Alien Incident',region:'Europe',gridSize:64,threat:2};
 const covers=c.makeBattlefield(mission);
 const out=c.tacticalDeployReplacementAlienBeacon({mission,covers,units:[],round:20,state:{waveCount:2,beaconReplacementCount:1}});
 assert.equal(out.deployed,true);
 assert.equal(c.tacticalBeaconFootprintIntersectsBuilding(out.beacon,mission),false);
 assert.equal(out.state.beaconReplacementCount,2);
 assert.equal(out.waveNumber,3);
});
test('empty interior floors and adjacent building cells reject a footprint; a fully blocked map has no fallback',()=>{
 const original=c.tacticalBuildingCellAt;
 try{
  const mission={id:'blocked-exterior',gridSize:32},cell={x:15,y:15,gridSize:32};
  const ring=c.tacticalReplacementBeaconDeploymentFootprintCells(cell,32);
  const edge=ring.find(v=>v.x!==cell.x||v.y!==cell.y);
  c.tacticalBuildingCellAt=(x,y)=>x===edge.x&&y===edge.y?{buildingId:'empty-floor'}:null;
  assert.equal(c.tacticalAlienBeaconDeploymentFootprintClear({cell,mission}),false);
  c.tacticalBuildingCellAt=()=>({buildingId:'dense'});
  assert.equal(c.tacticalAlienBeaconSafeCellNear({preferred:cell,mission}),null);
 }finally{c.tacticalBuildingCellAt=original;}
});
