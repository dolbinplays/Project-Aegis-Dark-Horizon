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
function fixture(){
 const mission={id:'shield-tactics',kind:'Alien Terror Raid',region:'Europe',threat:2,tacticalMapTier:'small',tacticalTimeOfDay:'day',tacticalLighting:'day'};
 const human={id:'h',name:'Observer',team:'human',hp:40,maxHp:40,alive:true,tu:60,maxTu:60,ammo:12,weaponKind:'ballistic',x:8,y:12,facing:'E',gridSize:32,acc:95,baseSoldier:{stats:{accuracy:95,reactions:95}}};
 const beacon={id:'b',alienBeacon:true,kind:'hard',visual:'alien-field-beacon',alienBeaconState:'active',alienBeaconShield:'combined',hp:72,maxHp:72,x:12,y:12,gridSize:32,revealed:true};
 const alien={id:'a',name:'Alien',team:'alien',hp:40,maxHp:40,alive:true,x:11,y:12,revealed:true,gridSize:32};
 return{mission,human,beacon,alien};
}
function learned(beacon,kind='ballistic'){return c.tacticalAlienBeaconShieldImpactCovers([beacon],kind)[0];}
test('unknown shield permits probing; observed classes are retained independently',()=>{
 const {human,alien,beacon}=fixture();assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[beacon]),false);
 const ballistic=learned(beacon);assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[ballistic]),true);
 assert.equal(c.tacticalAiKnownShieldBlocksShot({...human,weaponKind:'laser'},alien,[ballistic]),false);
 const both=learned(ballistic,'laser');assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[both]),true);assert.equal(c.tacticalAiKnownShieldBlocksShot({...human,weaponKind:'laser'},alien,[both]),true);
 assert.equal(c.tacticalAiKnownShieldBlocksShot({...human,weaponKind:'grenade'},alien,[both]),false);
 assert.equal(beacon.alienBeaconShieldObserved,undefined);
});
test('knowledge is source scoped, survives JSON saves, and rechecks current field boundaries',()=>{
 const {human,alien,beacon}=fixture(),known=JSON.parse(JSON.stringify(learned(beacon)));
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[known]),true);
 for(const patch of [{id:'replacement'},{x:13},{alienBeaconShield:'kinetic'},{alienBeaconState:'disabled'},{hp:0},{revealed:false}])assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[{...known,...patch}]),false,JSON.stringify(patch));
 assert.equal(c.tacticalAiKnownShieldBlocksShot({...human,x:12,y:11},alien,[known]),false);
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,{...alien,x:9},[known]),false);
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[beacon]),false);
 const legacy={...known};delete legacy.alienBeaconShieldObservationKey;delete legacy.alienBeaconShieldBlockedClasses;
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[legacy]),true);
});
test('target selection skips known blocked preferred target without mutating explicit order',()=>{
 const {human,alien,beacon}=fixture(),alternative={...alien,id:'other',x:9,y:10},order={preferredTargetId:alien.id};
 assert.equal(c.tacticalFireTeamCommandShotTarget(order,[alien,alternative],human,[learned(beacon)]).id,'other');
 assert.equal(c.tacticalFireTeamCommandShotTarget(order,[alien],human,[learned(beacon)]),null);
 assert.equal(c.tacticalFireTeamCommandShotTarget(order,[alien,alternative],human,[beacon]).id,'a');assert.equal(order.preferredTargetId,'a');
});
test('reaction fire learns from first impact and then preserves ammunition and TU',()=>{
 const {human,alien,beacon,mission}=fixture();
 const first=c.tacticalReactionShotResult({shooter:human,target:alien,covers:[beacon],mission,triggerRoll:1,hitRoll:1});
 assert.equal(first.triggered,true);assert.equal(first.shieldBlocked,true);assert.equal(first.damage,0);
 const before=JSON.stringify(first.shooter),next=c.tacticalReactionShotResult({shooter:first.shooter,target:alien,covers:first.covers,mission,triggerRoll:1,hitRoll:1});
 assert.equal(next.triggered,false);assert.equal(next.reason,'known-shield-block');assert.equal(JSON.stringify(next.shooter),before);
 assert.equal(c.tacticalReactionShotResult({shooter:human,target:{...alien,x:27},covers:first.covers,mission,triggerRoll:1,hitRoll:1}).triggered,false);
});
test('known shield makes a single alien a grenade candidate while preserving friendly safety',()=>{
 const {human,alien,beacon,mission}=fixture(),unit={...human,grenadeCharges:1},covers=[learned(beacon)];
 const yes=c.tacticalAiGrenadeDecision({unit,units:[unit,alien],covers,mission,visibleAliens:[alien]});assert.ok(yes);
 const civilian={id:'vip',team:'civilian',hp:20,alive:true,x:alien.x,y:alien.y};
 assert.equal(c.tacticalAiGrenadeDecision({unit,units:[unit,alien,civilian],covers,mission,visibleAliens:[alien]}),null);
 assert.equal(c.tacticalAiGrenadeDecision({unit:{...unit,tu:0},units:[unit,alien],covers,mission,visibleAliens:[alien]}),null);
});
test('combat movement can approach a known shield using reachable legal cells',()=>{
 const {human,alien,beacon,mission}=fixture(),covers=[learned(beacon)],units=[human,alien];
 const plan=c.tacticalAiMovePlan({unit:human,target:alien,covers,units,mission,targetKnown:true,reserveTu:14,maxMoveSteps:6});
 assert.ok(plan.steps>0);assert.ok(c.tacticalDistance(plan.cell,alien)<c.tacticalDistance(human,alien));
 assert.ok(plan.steps*4+14<=human.tu);assert.notDeepEqual({x:plan.cell.x,y:plan.cell.y},{x:alien.x,y:alien.y});
 const noTu=c.tacticalAiMovePlan({unit:{...human,tu:0},target:alien,covers,units,mission,targetKnown:true,reserveTu:14,maxMoveSteps:6});assert.equal(noTu.steps,0);
});
test('direct beacon observations and later field observations share bounded class history',()=>{
 const {beacon}=fixture();const direct=c.tacticalBreachCover(beacon,20,'ballistic');const next=learned(direct,'laser');
 assert.deepEqual(Array.from(next.alienBeaconShieldBlockedClasses).sort(),['energy','high-speed-ballistic']);
 assert.equal(learned(next,'ballistic').alienBeaconShieldBlockedClasses.length,2);
});
test('unobserved interceptions grant no knowledge and kinetic fields allow energy fire',()=>{
 const {human,alien,beacon}=fixture(),covers=[beacon];
 assert.equal(c.tacticalAlienBeaconShieldImpactCovers(covers,'alien',false),covers);
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,covers),false);
 const kinetic=learned({...beacon,alienBeaconShield:'kinetic'});
 assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,[kinetic]),true);
 assert.equal(c.tacticalAiKnownShieldBlocksShot({...human,weaponKind:'laser'},alien,[kinetic]),false);
 assert.equal(c.tacticalAlienBeaconShieldShotState({attacker:{...human,weaponKind:'laser'},target:alien,covers:[kinetic],weaponKind:'laser'}).blocked,false);
});
test('real streamed AI stops covered follow-up fire after observing a blocked shot',async()=>{
 seededRandom(c,873);
 const f=fixture(),game=c.makeNewGameData({openingIncidentSeed:873}),base={...game.soldiers[0],id:f.human.id};
 const human={...f.human,baseSoldier:base,base,fireTeamId:'alpha',fireTeamLeaderId:f.human.id,fireTeamRole:'leader',acc:100,grenadeCharges:0};
 const alien={...f.alien,hp:300,maxHp:300,alienType:'Signal Leech',weaponKind:'alien',tu:0,maxTu:1,facing:'W'};
 const cover=Array.from(c.tacticalNeighbors(human.x,human.y,32)).map((cell,i)=>({...cell,id:'cover-'+i,hp:80,maxHp:80,kind:'hard',block:1})).find(cover=>c.hasLineOfSight(human,alien.x,alien.y,[cover],f.mission)&&c.tacticalAiThreatFacingCoverScore(human,alien,c.tacticalAiCoverAdjacencyIndex([cover],32))>0);
 assert.ok(cover);
 const covers=[f.beacon,cover],units=[human,alien],mission={...f.mission,incidentVipCount:0,incidentCivilianCount:0,incidentRescueCountVersion:2};
 assert.equal(c.tacticalAiCoveredFiringHoldState({unit:human,targets:[alien],units,covers,mission}).active,true);
 c.Math.random=()=>0.01;
 const batch=await c.resolveMissionAiStreamBatchAsync({squad:[base],mission,tech:[],weaponUpgrades:game.weaponUpgrades,initialBattleState:{units,covers,round:1,gridSize:32},maxSimulationRounds:72,batchRounds:1,simulatedRounds:0,fastHandoff:true,revealAllPlaybackActions:false,onProgress:noop});
 const shots=(batch.frames||[]).flatMap(frame=>frame.shots||[]).filter(shot=>shot.side==='human'&&shot.toId===alien.id);
 assert.ok(shots.some(shot=>shot.shieldBlocked),'first actual AI shot must encounter the field');
 assert.equal(shots.filter(shot=>shot.shieldBlocked).length,1,'no repeated blocked covered fire');
 const state=batch.continuation||batch.result?.tacticalChunkContinuation;assert.ok(state);
 const remembered=state.covers.find(cover=>cover.id===f.beacon.id);assert.ok(remembered?.alienBeaconShieldBlockedClasses?.includes('high-speed-ballistic'));
 assert.ok(batch.frames.some(frame=>frame.covers?.some(cover=>cover.id===f.beacon.id&&cover.alienBeaconShieldBlockedClasses?.length)));
 const saved=JSON.parse(JSON.stringify(state));assert.equal(c.tacticalAiKnownShieldBlocksShot(human,alien,saved.covers),true);
 assert.equal(c.tacticalAiCoveredFiringHoldState({unit:human,targets:[alien],units,covers:saved.covers,mission}).active,false);
});
test('normal, Hybrid and emergency AI conserve fire when all visible targets have known protection',()=>{
 const f=fixture(),game=c.makeNewGameData({openingIncidentSeed:875}),base={...game.soldiers[0],id:f.human.id};
 for(const mode of ['simulation','hybrid','emergency']){
  const human={...f.human,baseSoldier:base,maxTu:14,tu:14,grenadeCharges:0,fireTeamId:'alpha',fireTeamLeaderId:f.human.id,fireTeamRole:'leader'};
  const alien={...f.alien,alienType:'Signal Leech',weaponKind:'alien',tu:0,maxTu:1};
  const original=c.tacticalAiAdaptiveReserveDecision;let injected=false;
  if(mode==='emergency')c.tacticalAiAdaptiveReserveDecision=(...args)=>{if(!injected&&new Error().stack.includes('at processHumanAiTurn (')){injected=true;throw Error('test planner interruption');}return original(...args);};
  let result;
  try{result=c.resolveMission({squad:[base],mission:{...f.mission,incidentVipCount:0,incidentCivilianCount:0,incidentRescueCountVersion:2},tech:[],mode:'simulation',aiControlMode:mode==='hybrid'?'hybrid':'simulation',initialBattleState:{units:[human,alien],covers:[learned(f.beacon)],round:1,gridSize:32},maxRoundsOverride:1,simulationChunkOnly:true});}finally{c.tacticalAiAdaptiveReserveDecision=original;}
  const shots=result.frames.flatMap(frame=>frame.shots||[]).filter(shot=>shot.side==='human');assert.equal(shots.length,0,mode);
  assert.ok(result.frames.every(frame=>frame.soldiers.every(unit=>unit.ammo===human.ammo)),mode);
  if(mode==='emergency'){assert.ok(injected);assert.match(JSON.stringify(result.logs),/test planner interruption/);}
  else assert.ok(result.frames.some(frame=>frame.soldiers.some(unit=>unit.aiTurnAction==='shield-aware-hold')),mode+' reached the shield hold decision');
 }
});




