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
const mission={id:'handoff',kind:'Alien Incident',region:'Europe',gridSize:64,threat:2,alienReinforcementDifficulty:'medium'};
function arrival(){return c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:4},mission,round:5});}
function advance(a,round,units=a.units,covers=a.covers){return c.tacticalAdvanceUfoBeaconDelivery({state:a.state,units,covers,mission,round});}
test('new arrival holds a full subsequent round then plants exactly once without another wave',()=>{
 const a=arrival(),original=JSON.stringify(a),record=a.state.dropship.deliveryLanding;
 assert.equal(c.tacticalUfoBeaconDeliveryPending(a.state),true);
 assert.equal(advance(a,5).changed,false);assert.equal(advance(a,6).changed,false);
 const out=advance(a,7);assert.equal(out.changed,true);assert.equal(out.state.waveCount,a.state.waveCount);
 assert.equal(out.covers.filter(v=>v.alienBeacon).length,1);assert.equal(out.covers.filter(v=>v.alienDropshipPart).length,0);
 assert.equal(out.beacon.x,record.beaconCenter.x);assert.equal(out.beacon.y,record.beaconCenter.y);
 assert.equal(out.state.dropship.deliveryLanding.phase,'planted');assert.equal(c.tacticalUfoBeaconDeliveryPending(out.state),false);
 assert.equal(c.tacticalAdvanceUfoBeaconDelivery({state:out.state,covers:out.covers,units:a.units,mission,round:8}).changed,false);
 assert.equal(JSON.stringify(a),original);
 const replay=advance(a,7,a.units,out.covers);assert.equal(replay.covers.filter(v=>v.alienBeacon).length,1);
 const destroyed=out.covers.map(cover=>cover.id===out.beacon.id?{...cover,hp:0,alienBeaconState:"destroyed"}:cover);
 const replayDestroyed=advance(a,8,a.units,destroyed);assert.equal(replayDestroyed.beacon.hp,0);assert.equal(replayDestroyed.covers.filter(v=>v.alienBeacon).length,1);
});
test('pending delivery prevents premature victory and another reinforcement call',()=>{
 const a=arrival(),human={id:'h',team:'human',hp:40,alive:true,x:3,y:3};
 const terminal=c.tacticalMissionTerminalState({mission,humans:[human],aliens:[],covers:a.covers,reinforcementState:a.state});
 assert.equal(terminal.reinforcementPending,true);assert.equal(terminal.victory,false);
 const turn=c.tacticalAlienReinforcementTurn({mission,state:a.state,units:a.units,covers:a.covers,round:6,rollOverride:1});assert.equal(turn.arrivalReady,false);assert.equal(turn.event,null);
});
test('save/load preserves deadline; occupied center retries without removing the craft',()=>{
 const a=JSON.parse(JSON.stringify(arrival())),cell=a.state.dropship.deliveryLanding.beaconCenter;
 a.state=c.tacticalAlienReinforcementState(mission,a.units,a.state);
 const blocked=advance(a,7,[...a.units,{id:'block',team:'human',hp:20,...cell}]);assert.equal(blocked.changed,false);assert.equal(blocked.covers,a.covers);
 assert.equal(advance(a,8).changed,true);
 const old=JSON.parse(JSON.stringify(a));old.state.dropship.deliveryLanding.version=1;assert.equal(advance(old,20).changed,false);
});
test('hidden handoff does not reveal a beacon or remove unrelated craft',()=>{
 const a=arrival(),unrelated={id:'other-craft',x:2,y:2,hp:999,alienDropshipPart:'hull',ufoDeliverySourceId:'other'};
 const out=advance(a,7,a.units,[...a.covers,unrelated]);assert.equal(out.observed,false);assert.equal(out.beacon.revealed,false);assert.ok(out.covers.includes(unrelated));
 const player={crafts:[{id:'player'},{deliveryLanding:{sourceId:'other'}},a.placement]};c.tacticalRegisterAlienDropship(player,out.craft);
 assert.equal(player.crafts.length,2);assert.ok(player.crafts.some(v=>v.id==='player'));
});

test('repeated arrival requests cannot create a second delivery while the craft is landed',()=>{
 const a=arrival(),repeat=c.tacticalAlienReinforcementArrival({state:a.state,units:a.units,covers:a.covers,mission,round:6});
 assert.equal(repeat.landed,false);assert.equal(repeat.deliveryPending,true);assert.equal(repeat.units,a.units);assert.equal(repeat.covers,a.covers);
});
test('AI round continuation advances a landed delivery even after the arrival squad is gone',()=>{
 const a=arrival(),game=c.makeNewGameData({openingIncidentSeed:12345}),soldier=game.soldiers[0];
 const human={id:soldier.id,name:soldier.name,team:'human',hp:40,maxHp:40,alive:true,x:3,y:3,facing:'E',tu:50,maxTu:50,ammo:20,weaponKind:'ballistic',baseSoldier:soldier};
 const skyranger=c.tacticalSkyrangerPlacement({x:4,y:45});c.tacticalRegisterAlienDropship(skyranger,a.placement);
 const initialBattleState={units:[human],covers:a.covers,round:6,gridSize:64,skyranger,alienReinforcement:a.state};
 const result=c.resolveMission({squad:[soldier],mission,tech:game.tech||[],mode:'simulation',initialBattleState,maxRoundsOverride:3,simulationChunkOnly:true});

 const handoff=result.frames.find(frame=>frame.ufoBeaconHandoff);
 assert.ok(handoff,'AI emits the handoff frame before resolving the operation');
 assert.equal(handoff.round,7);
 assert.equal(handoff.alienReinforcement.dropship.deliveryLanding.phase,'planted');
 assert.equal(handoff.covers.filter(cover=>cover.deliveredByUfo).length,1);
 assert.equal(handoff.alienDropship.departed,true);

});

test('Build Health verifies sequential waves through the planted beacon',()=>{assert.equal(c.tacticalVipSequentialReinforcementWavesContractTest(),true);});
