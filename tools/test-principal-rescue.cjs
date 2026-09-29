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
function fixture(){const mission=c.makePrincipalRescueMission({id:'principal-test',threat:2,region:'Europe',reward:500});const civilians=[{...c.principalUnitFields(mission,0),team:'civilian',hp:18,alive:true,x:12,y:12},{id:'optional',team:'civilian',hp:18,alive:true,x:13,y:12}];return{mission,civilians,humans:[{id:'human',team:'human',hp:40,alive:true,x:8,y:8}],aliens:[{id:'alien',team:'alien',hp:30,alive:true,x:20,y:20}],covers:[]};}
test('principal identity, briefing and mission persistence are stable',()=>{const f=fixture(),copy=JSON.parse(JSON.stringify(f.mission));assert.deepEqual(c.makePrincipalRescueMission(copy),copy);assert.match(c.incidentVipBriefing(copy),/MANDATORY PRINCIPAL/);assert.match(c.incidentVipBriefing(copy),/alien elimination is not required/);assert.equal(c.incidentVipCount(copy),3);assert.equal(c.principalUnitFields(copy,0).id,copy.principal.id);assert.equal(Object.keys(c.principalUnitFields(copy,1)).length,0);});
test('optional rescues cannot replace principal, while extraction can end a contested mission',()=>{const f=fixture();f.civilians[1].rescued=true;assert.equal(c.tacticalMissionTerminalState(f).victory,false);f.civilians[0].rescued=true;const done=c.tacticalMissionTerminalState(f);assert.equal(done.victory,true);assert.equal(done.principal.optionalRescued,1);assert.equal(c.tacticalMissionTerminalState({...f,playbackPending:true}).resolved,false);});
test('principal death and permanent loss fail immediately even with live aliens and optional VIPs',()=>{for(const loss of [{hp:0},{alive:false},{permanentlyUnrecoverable:true}]){const f=fixture();Object.assign(f.civilians[0],loss);const result=c.tacticalMissionTerminalState(f);assert.equal(result.objectiveFailed,true);assert.equal(result.victory,false);assert.equal(c.tacticalAiMissionResolution(f.mission,f.humans,f.aliens,f.civilians).operationIncomplete,false);}});
test('missing principal cannot be replaced by a surviving optional person',()=>{const f=fixture();f.civilians.shift();const state=c.tacticalMissionTerminalState(f);assert.equal(state.objectiveFailed,true);assert.match(state.principal.reason,/unavailable/);});
test('debrief separates principal result and optional rescue credit',()=>{const f=fixture();f.civilians[0].hp=0;f.civilians[1].rescued=true;const failed=c.tacticalCivilianOutcomeForMission(f.mission,2,1,1,false,f.civilians);assert.equal(failed.completed,false);assert.equal(failed.completionReward,0);assert.equal(failed.rescueReward,40);assert.equal(failed.principal.optionalRescued,1);const entries=c.buildMissionReportEntries({success:false,logs:[],civilianOutcome:failed},f.mission);assert.match(JSON.stringify(entries),/Principal/);});
test('ordinary rescue quota behavior remains unchanged',()=>{const f=fixture();f.mission={id:'ordinary',kind:'Alien Abduction Site'};f.civilians[0].rescued=true;assert.equal(c.tacticalAiRescueProgress(f.mission,f.civilians).canResolveVictory,false);});
test('actual AI stream creates and preserves the named principal and optional people',{timeout:90000},async()=>{
 seededRandom(c,4123);const game=c.makeNewGameData({openingIncidentSeed:4123}),mission=c.makePrincipalRescueMission({...game.missions[0],id:'principal-stream',threat:1});
 const batch=await c.resolveMissionAiStreamBatchAsync({squad:game.soldiers.slice(0,4),mission,tech:game.tech||[],weaponUpgrades:game.weaponUpgrades,leaderInstruction:'Rescue principal',initialBattleState:null,revealAllPlaybackActions:false,onProgress:noop,maxSimulationRounds:72,batchRounds:1,simulatedRounds:0,hadPriorPlaybackShots:false,alienFieldBeaconKnowledge:'unknown',fastHandoff:true});
 const units=batch.continuation?.units||batch.result?.tacticalChunkContinuation?.units;assert.ok(units);
 const principal=units.find(u=>u.id===mission.principal.id);assert.ok(principal?.requiredVip);assert.match(principal.name,/Senior Scientist/);assert.equal(units.filter(u=>u.team==='civilian').length,3);
 const outcome=c.tacticalFinalizeLiveBattleResult({squad:game.soldiers.slice(0,4),mission,units:units.map(u=>u.id===principal.id?{...u,rescued:true}:u),success:true,round:2});assert.equal(outcome.civilianOutcome.principal.rescued,true);
 const failedUnits=units.map(u=>u.id===principal.id?{...u,hp:0,alive:false}:u);
 const final=c.resolveMission({squad:game.soldiers.slice(0,4),mission,tech:game.tech||[],weaponUpgrades:game.weaponUpgrades,mode:'ai',initialBattleState:{...batch.continuation,units:failedUnits},maxRoundsOverride:1});assert.equal(final.success,false);assert.equal(final.civilianOutcome.principal.lost,true);assert.equal(final.tacticalChunkContinuationRequired,undefined);
});
test('principal failure notice names the person rather than reporting an aggregate quota',()=>{const f=fixture();f.civilians[0].hp=0;const terminal=c.tacticalMissionTerminalState(f),notice=c.tacticalMissionFailurePresentationState({terminal});assert.equal(notice.active,true);assert.match(notice.message,/Senior Scientist/);assert.doesNotMatch(notice.message,/quota|requirement missed/);assert.equal(c.principalRescueContractTest(),true);});
test('principal mission generation begins after the opening campaign and retains ordinary incidents',()=>{seededRandom(c,4923);for(let i=0;i<20;i++)assert.equal(c.highValuePrincipalMission(c.makeMission(1)),false);const missions=Array.from({length:120},()=>c.makeMission(3));assert.ok(missions.some(c.highValuePrincipalMission));assert.ok(missions.some(m=>!c.highValuePrincipalMission(m)));});
test('principal report survives an existing terminal log and manual finalization cannot bypass the objective',()=>{const f=fixture();f.civilians[1].rescued=true;const failed=c.tacticalFinalizeLiveBattleResult({mission:f.mission,units:[...f.humans,...f.civilians],success:true});assert.equal(failed.success,false);const entries=c.buildMissionReportEntries({...failed,logs:['Contact confirmed: test','Mission failed. Principal lost.']},f.mission);assert.match(JSON.stringify(entries),/Optional evacuees rescued: 1\/1/);});
test('principal extraction still wins when surviving soldiers have already boarded',()=>{const f=fixture();f.civilians[0].rescued=true;f.humans[0].extracted=true;const done=c.tacticalMissionTerminalState(f);assert.equal(done.victory,true);assert.equal(done.squadWiped,false);});
test('automatic rescue assignment prefers principal over a nearer optional VIP',()=>{const f=fixture();const leader={...f.humans[0],name:'Leader',fireTeamId:'alpha',fireTeamLeaderId:'human',fireTeamRole:'leader',tu:60,maxTu:60};f.civilians[0].vipTracker=true;f.civilians[1].vipTracker=true;f.civilians[1].x=9;f.civilians[1].y=8;const plan=c.tacticalVipRescueAssignmentPlan({mission:f.mission,units:[leader,...f.civilians]});assert.equal(plan.assignments[0]?.vipId,f.mission.principal.id);});
