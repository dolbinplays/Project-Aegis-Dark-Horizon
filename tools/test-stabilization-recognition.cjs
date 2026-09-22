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


const c=runtimeContext({React:{createElement:(type,props,...children)=>({type,props:props||{},children})}});
const copy=x=>JSON.parse(JSON.stringify(x));
const medic=()=>({id:'medic',name:'Medic',team:'human',alive:true,hp:40,maxHp:40,tu:60,maxTu:60,medkitCharges:4,x:4,y:4});
const casualty=()=>({id:'patient',name:'Patient',team:'human',alive:true,hp:1,maxHp:40,tu:0,downed:true,unconscious:true,bleeding:true,bleedOutRounds:3,x:5,y:4});
const mission={id:'recognition-mission',kind:'Rescue',region:'Europe'};
const roster=[{id:'medic',name:'Medic',status:'Ready',stats:{health:40},currentHealth:40},{id:'patient',name:'Patient',status:'Ready',stats:{health:40},currentHealth:40}];
const stabilize=()=>c.tacticalFirstAidUseResult([medic(),casualty()],'medic','patient','human',2);
const aftermath=units=>c.tacticalApplyCasualtyExtractionAftermath({success:true,logs:[]},units,roster,mission,true,3);

test('successful stabilization records the actual responder once and preserves all medical costs and incapacitation',()=>{const input=[medic(),casualty()],before=copy(input),r=c.tacticalFirstAidUseResult(input,'medic','patient','human',2);assert.equal(r.ok,true);assert.equal(r.rescuer.tu,44);assert.equal(r.rescuer.medkitCharges,3);assert.equal(r.target.hp,1);assert.equal(r.target.downed,true);assert.equal(r.target.unconscious,true);assert.equal(r.target.bleeding,false);assert.deepEqual(input,before);assert.equal(r.target.stabilizationEvents.length,1);assert.equal(r.target.stabilizationEvents[0].rescuerId,'medic');const again=c.tacticalFirstAidUseResult(r.units,'medic','patient','human',2);assert.equal(again.ok,false);assert.equal(again.target.stabilizationEvents.length,1);});
test('self-treatment, ordinary teammate healing and blocked treatment earn no recognition',()=>{for(const units of [[{...medic(),tu:0},casualty()],[{...medic(),medkitCharges:0},casualty()],[medic(),{...casualty(),alive:false,hp:0}],[medic(),{...casualty(),x:20}]]){const r=c.tacticalFirstAidUseResult(units,'medic','patient','human',2);assert.equal(r.ok,false);assert.equal(r.target.stabilizationEvents,undefined);}const healed=c.tacticalFirstAidUseResult([medic(),{...casualty(),downed:false,unconscious:false,bleeding:false,hp:20}],'medic','patient','human',2);assert.equal(healed.ok,true);assert.equal(healed.target.stabilizationEvents,undefined);assert.equal(c.tacticalMedkitUseResult({...medic(),hp:20},'human').unit.stabilizationEvents,undefined);});
test('marker comes only from a presented confirmed event and never replaces casualty status',()=>{assert.equal(c.TacticalStabilizationMarker({unit:casualty()}),null);assert.equal(c.TacticalStabilizationMarker({unit:{...casualty(),stabilized:true,stabilizedById:'medic'}}),null);const r=stabilize();const marker=c.TacticalStabilizationMarker({unit:r.target});assert.equal(marker.children[0],'↑');assert.match(marker.props['aria-label'],/not revived/);assert.equal(c.tacticalPhysioMemberState(r.target),'STB');const dead={...r.target,hp:0,alive:false};assert.ok(c.TacticalStabilizationMarker({unit:dead}));assert.equal(c.tacticalPhysioMemberState(dead),'KIA');assert.ok(c.TacticalStabilizationMarker({unit:{...r.target,fireTeamId:'new-team'}}));});
test('aftermath grants rescuer credit and report attribution; duplicate completion and reload are idempotent',()=>{const result=aftermath(stabilize().units),credited=c.campaignRecordStabilizationRecognition(roster[0],result,mission);assert.equal(credited.stabilizationRecognitionCount,1);assert.equal(credited.identity.commendations[0].name,'Field Lifesaver');assert.equal(c.campaignRecordStabilizationRecognition(roster[1],result,mission),roster[1]);const again=c.campaignRecordStabilizationRecognition(copy(credited),copy(result),mission);assert.equal(again.stabilizationRecognitionCount,1);assert.equal(again.stabilizationRecognitionIds.length,1);const entries=c.buildMissionReportEntries(result,mission);assert.equal(entries.filter(x=>x.startsWith('Field Lifesaver:')).length,1);assert.ok(entries.some(x=>/Medic stabilized Patient in round 2/.test(x)));});
test('different casualties and later distinct stabilization events count separately',()=>{const first=stabilize();const second=c.tacticalFirstAidUseResult([...first.units,{...casualty(),id:'patient2',name:'Second Patient'}],'medic','patient2','human',2);const later=c.tacticalFirstAidUseResult(second.units.map(u=>u.id==='patient'?{...u,bleeding:true,stabilized:false}:u),'medic','patient','human',3);const result=aftermath(later.units);const credited=c.campaignRecordStabilizationRecognition(roster[0],result,mission);assert.equal(credited.stabilizationRecognitionCount,3);assert.equal(new Set(credited.stabilizationRecognitionIds).size,3);assert.ok(c.commendationNames(credited.identity).includes('Field Lifesaver ×3'));});
test('new missions can award again; subsequent casualty or rescuer death does not erase successful treatment',()=>{const r=stabilize(),result=aftermath(r.units.map(u=>({...u,hp:0,alive:false})));const first=c.campaignRecordStabilizationRecognition({...roster[0],status:'KIA'},result,mission);assert.equal(first.stabilizationRecognitionCount,1);assert.equal(first.status,'KIA');const second=c.campaignRecordStabilizationRecognition(first,result,{...mission,id:'next-mission'});assert.equal(second.stabilizationRecognitionCount,2);});
test('extraction and legacy stabilization flags cannot fabricate medkit recognition',()=>{const result=aftermath([medic(),{...casualty(),bleeding:false,stabilized:true,stabilizedById:'medic',casualtyExtracted:true,casualtyExtractionRescuerId:'medic',casualtyExtractionMedicalStabilized:true}]);assert.equal(c.campaignRecordStabilizationRecognition(roster[0],result,mission),roster[0]);assert.equal(c.buildMissionReportEntries(result,mission).filter(x=>x.startsWith('Field Lifesaver:')).length,0);});
test('campaign migration and export round trip retain credit; new battle units do not inherit the marker',()=>{const game=c.makeNewGameData();game.soldiers[0]=c.campaignRecordStabilizationRecognition(roster[0],aftermath(stabilize().units),mission);const restored=c.migrateCampaignData(copy(game));assert.equal(restored.saveFormatVersion,4);assert.equal(restored.soldiers[0].stabilizationRecognitionCount,1);assert.equal(c.campaignRecordStabilizationRecognition(restored.soldiers[0],aftermath(stabilize().units),mission).stabilizationRecognitionCount,1);assert.equal(c.TacticalStabilizationMarker({unit:{...medic(),baseSoldier:restored.soldiers[0]}}),null);});
test('presented playback snapshots reveal treatment only at its event and survive tactical save/load',()=>{const initial=[medic(),casualty()],r=stabilize();const before=c.tacticalCommittedPlaybackFrameUnits(initial,{soldiers:copy(initial)});assert.equal(c.TacticalStabilizationMarker({unit:before.find(u=>u.id==='patient')}),null);const after=c.tacticalCommittedPlaybackFrameUnits(initial,{soldiers:copy(r.units)});assert.ok(c.TacticalStabilizationMarker({unit:after.find(u=>u.id==='patient')}));const payload={version:1,missionId:mission.id,liveState:{deployment:{},units:after,covers:[]}};assert.equal(c.tacticalRestoreLiveStateSavePayload(mission,copy(payload)),true);const saved=c.tacticalLiveStateSavePayload(mission.id);assert.equal(saved.liveState.units.find(u=>u.id==='patient').stabilizationEvents[0].rescuerId,'medic');});

test('stream snapshots copy treatment records and the actual playback medical adapter respects frame order',()=>{const start=source.indexOf('function snapshotUnits('),end=source.indexOf('\n  }',start)+4;vm.runInContext(source.slice(start,end),c);const r=stabilize(),snap=c.snapshotUnits(r.units),patient=snap.find(u=>u.id==='patient');assert.equal(patient.stabilizationEvents.length,1);assert.notEqual(patient.stabilizationEvents,r.target.stabilizationEvents);const state=c.tacticalPlaybackMedicalState(patient,casualty());assert.equal(state.downed,true);assert.equal(state.bleeding,false);assert.equal(state.stabilizationEvents.length,1);const before=c.tacticalPlaybackMedicalState({...casualty(),stabilizationEvents:[]},state);assert.equal(before.stabilizationEvents.length,0);assert.equal(before.bleeding,true);});
test('real AI triage produces the same confirmed event and respects Hybrid player ownership',()=>{const r=c.tacticalAiMedicalTriageStep({humans:[{...medic(),id:'player',hybridPlayerControlledLead:true},{...medic(),id:'ai'},casualty()],aliens:[],covers:[],mission:{gridSize:48},round:4,stabilizeOnly:true,excludedResponderIds:new Set(['player'])});const patient=r.humans.find(u=>u.id==='patient');assert.equal(patient.stabilizationEvents.length,1);assert.equal(patient.stabilizationEvents[0].rescuerId,'ai');assert.equal(patient.downed,true);});
