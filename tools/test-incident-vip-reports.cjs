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


const context=runtimeContext();
test('incident factories record fixed populations',()=>{
 const game=context.makeNewGameData({openingIncidentSeed:12345});
 const missions=[...game.missions,context.makeMission(1),context.makeCrashSiteMission({id:'ufo',size:'Small',region:'Europe'},1),context.makeUfoOperationIncident({id:'ufo',size:'Small',region:'Europe'},1),context.missionFromAlienBase({id:'base',region:'Europe',threat:5})];
 for(const m of missions){assert.ok(Number.isInteger(m.incidentVipCount));assert.equal(typeof m.incidentVipCountKnown,'boolean');assert.equal(context.incidentVipCount({...m,transportCount:2,responseSquadIds:['a','b']}),m.incidentVipCount);}
 assert.equal(missions.at(-1).incidentVipCount,0);
});
test('incomplete reports conceal a deterministic count until tracker contact',()=>{
 const missions=Array.from({length:50},(_,i)=>context.normalizeIncidentVipReport({id:'rescue-'+i,kind:'Alien Abduction Site',region:'Europe',threat:2}));
 const unknown=missions.filter(m=>!m.incidentVipCountKnown);assert.ok(unknown.length>0&&unknown.length<50);
 for(const m of unknown){assert.match(context.incidentVipBriefing(m),/unknown.*TRANSMISSION LOST/);const result=context.confirmIncidentVipTrackers(m);assert.equal(result.mission.incidentVipCount,m.incidentVipCount);assert.equal(result.newlyConfirmed,true);assert.match(result.message,/does not provide visual identification/);assert.equal(context.confirmIncidentVipTrackers(result.mission).newlyConfirmed,false);assert.equal(m.incidentVipCountKnown,false);}
});
test('legacy live battles retain existing civilians; new saves retain original population after losses',()=>{
 const units=[{team:'human'},...Array.from({length:6},()=>({team:'civilian'}))];
 const old={activeMission:{id:'live',kind:'Alien Abduction Site',threat:2,manual:true},activeTacticalState:{missionId:'live',liveState:{units}},missions:[]};
 context.normalizeCampaignIncidentVipReports(old);assert.equal(old.activeMission.incidentVipCount,6);assert.equal(old.activeMission.incidentVipCountKnown,true);
 old.activeTacticalState.liveState.units=units.slice(0,2);context.normalizeCampaignIncidentVipReports(old);assert.equal(old.activeMission.incidentVipCount,6);
 const unrelated={activeMission:{id:'other',threat:2},activeTacticalState:{missionId:'live',liveState:{units}},missions:[]};context.normalizeCampaignIncidentVipReports(unrelated);assert.notEqual(unrelated.activeMission.incidentVipCount,6);
});
test('unknown reports persist through campaign migration and outbound travel',()=>{
 const mission={id:'travel',kind:'Alien Abduction Site',threat:2,incidentVipCount:4,incidentVipCountKnown:false};
 const data={missions:[mission],activeMission:mission,skyrangerTravels:[{mission}],skyrangerTravel:{mission}};
 const restored=context.normalizeCampaignIncidentVipReports(JSON.parse(JSON.stringify(data)));
 for(const m of [restored.missions[0],restored.activeMission,restored.skyrangerTravels[0].mission,restored.skyrangerTravel.mission]){assert.equal(m.incidentVipCount,4);assert.equal(m.incidentVipCountKnown,false);}
});
test('battlefields place the recorded population regardless of transport count',()=>{
 const game=context.makeNewGameData({openingIncidentSeed:12345});
 for(const count of [2,4,8])for(const transports of [1,2]){
 const mission={...game.missions[0],id:'deployment-'+count,kind:'Alien Abduction Site',threat:2,incidentVipCount:count,incidentCivilianCount:0,transportCount:transports};
 const deployment=context.tacticalDeployment({squad:game.soldiers.slice(0,transports*4),mission});
 assert.equal(deployment.civilianPositions.length,count);assert.equal(new Set(deployment.civilianPositions.map(p=>p.x+','+p.y)).size,count);
 assert.equal(context.tacticalCivilianObjectiveForMission(mission,count).required,Math.ceil(count*2/3));
 }
});

test('AI Command first-round handoff preserves the incident population', {timeout:30000}, async()=>{
 const game=context.makeNewGameData({openingIncidentSeed:24680});
 const mission=context.confirmIncidentVipTrackers({...game.missions[0],incidentVipCount:4,incidentVipCountKnown:false}).mission;
 const batch=await context.resolveMissionAiStreamBatchAsync({squad:game.soldiers.slice(0,6),mission,tech:game.tech||[],leaderInstruction:'VIP population regression',weaponUpgrades:game.weaponUpgrades,initialBattleState:null,revealAllPlaybackActions:false,onProgress:noop,maxSimulationRounds:72,batchRounds:1,simulatedRounds:0,hadPriorPlaybackShots:false,alienFieldBeaconKnowledge:'unknown',fastHandoff:true});
 const units=batch.continuation?.units||batch.result?.tacticalChunkContinuation?.units;
 assert.ok(units,'first-round handoff retains tactical units');
 assert.equal(units.filter(unit=>unit.team==='civilian').length,4);
 const data=context.migrateCampaignData({...game,skyrangerTravels:[],missions:[mission],activeMission:{...mission,manual:true},activeTacticalState:{missionId:mission.id,liveState:{units}}});
 assert.equal(data.activeMission.incidentVipCount,4);assert.equal(data.activeMission.incidentVipCountKnown,true);
});

test('ordinary civilians keep their population but are excluded from the briefing VIP count',()=>{
 const m=context.normalizeIncidentVipReport({id:'optional',kind:'UFO Crash Site',threat:2,incidentVipCount:5,incidentVipCountKnown:true});
 assert.equal(m.incidentVipCount,0);assert.equal(m.incidentCivilianCount,5);assert.equal(context.incidentNoncombatantCount(m),5);assert.match(context.incidentVipBriefing(m),/VIP count: 0/);
 assert.equal(context.tacticalCivilianPositions(m,[]).length,5);
 assert.equal(context.tacticalCivilianObjectiveForMission(m,5).required,0);
});
test('mixed saved units count actual VIP flags including casualties and rescued VIPs',()=>{
 const units=[{team:'civilian',vipTracker:true,hp:0},{team:'civilian',isVip:true,rescued:true},{team:'civilian',vipTracker:false},{team:'civilian',vipTracker:false}];
 const m=context.normalizeIncidentVipReport({id:'mixed',kind:'Alien Abduction Site',incidentVipCount:4},units);
 assert.equal(m.incidentVipCount,2);assert.equal(m.incidentCivilianCount,2);assert.equal(context.incidentNoncombatantCount(m),4);
 assert.match(context.incidentVipBriefing(m),/VIP count: 2/);
 const again=context.normalizeIncidentVipReport(JSON.parse(JSON.stringify(m)),units.slice(2));assert.equal(again.incidentVipCount,2);
 const tracked=context.tacticalAssignVipTrackers(units,m);assert.deepEqual([...tracked.map(u=>u.vipTracker)],[true,true,false,false]);
});
test('mixed counts survive mission list and aircraft travel copies without leaking unknown reports',()=>{
 const m={id:'mixed-trip',kind:'Alien Abduction Site',incidentRescueCountVersion:2,incidentVipCount:2,incidentCivilianCount:3,incidentVipCountKnown:false};
 const data=context.normalizeCampaignIncidentVipReports({missions:[m],activeMission:m,skyrangerTravels:[{mission:m}],skyrangerTravel:{mission:m}});
 for(const v of [data.missions[0],data.activeMission,data.skyrangerTravel.mission,data.skyrangerTravels[0].mission]){assert.equal(context.incidentNoncombatantCount(v),5);assert.equal(v.incidentVipCount,2);assert.match(context.incidentVipBriefing(v),/VIP count: unknown/);}
 const landed=context.confirmIncidentVipTrackers(m);assert.match(landed.message,/2 VIPs confirmed/);assert.equal(landed.mission.incidentCivilianCount,3);
});
test('new mixed rosters assign only the recorded VIP portion, with explicit civilian identity preserved',()=>{
 const m={kind:'Alien Abduction Site',incidentRescueCountVersion:2,incidentVipCount:2,incidentCivilianCount:3};
 const units=Array.from({length:5},(_,i)=>({id:'v'+i,team:'civilian'}));
 assert.deepEqual([...context.tacticalAssignVipTrackers(units,m).map(u=>u.vipTracker)],[true,true,false,false,false]);
 assert.deepEqual([...context.tacticalAssignVipTrackers([{team:'civilian',vipTracker:false},{team:'civilian'},{team:'civilian'},{team:'civilian'}],m).map(u=>u.vipTracker)],[false,true,true,false]);
 assert.equal(context.incidentVipCount({kind:'Alien Base',alienBaseId:'a'}),0);
});
