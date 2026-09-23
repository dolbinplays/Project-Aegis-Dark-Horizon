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


const c=runtimeContext(),copy=x=>JSON.parse(JSON.stringify(x));
const mission={id:'recovery-qa',kind:'Alien Abduction Site',region:'Europe',threat:1,gridSize:20};
const placement={crafts:[{rampCells:[{x:5,y:5},{x:6,y:5}]}]};
const rescuer=(id='r',team='alpha')=>({id,name:id,team:'human',hp:40,maxHp:40,alive:true,tu:40,maxTu:40,x:5,y:5,fireTeamId:team,fireTeamRole:'leader',fireTeamLeaderId:id});
const patient=()=>({id:'p',name:'Patient',team:'human',hp:1,maxHp:40,alive:true,tu:0,x:4,y:5,downed:true,unconscious:true,stabilized:true,bleeding:false});
const objectives=units=>c.tacticalKnownMissionObjectives({units,covers:[],mission});
const assign=units=>c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:'casualty-recovery:p'},objectives(units),2);
const extract=()=>c.tacticalExtractDraggedCasualtyAtSkyranger([{...rescuer(),draggingCasualtyId:'p'},{...patient(),draggedById:'r'}],'r',placement,3);
const aftermath=units=>c.tacticalApplyCasualtyExtractionAftermath({success:true,growth:[],logs:[]},units,units.map(u=>({...u,status:'Ready',stats:{health:40}})),mission,true,3);
test('only stabilized unconscious casualties appear as optional objectives',()=>{
 assert.equal(objectives([rescuer(),patient()]).filter(o=>o.type==='casualty-recovery').length,1);
 for(const patch of [{stabilized:false,bleeding:true},{downed:false,unconscious:false},{extracted:true},{casualtyExtracted:true},{alive:false,hp:0}]){
 assert.equal(objectives([rescuer(),{...patient(),...patch}]).filter(o=>o.type==='casualty-recovery').length,0);
 }
 assert.equal(objectives([patient()])[0].optional,true);
});
test('assignment uses the existing board, reserves one team and creates no walk-onto-casualty waypoint',()=>{
 const units=[rescuer(),rescuer('b','beta'),patient()];
 const next=c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:'casualty-recovery:p',beta:'casualty-recovery:p'},objectives(units),2);
 assert.equal(c.tacticalFireTeamObjectiveAssignmentForTeam(next,'alpha').type,'casualty-recovery');
 assert.equal(c.tacticalFireTeamObjectiveAssignmentForTeam(next,'beta').mode,'default');
 assert.equal(next[0].fireTeamCommandOrderId,null);
 assert.equal(c.tacticalRecoveryResponderAllowed(next[1],next[2],next),false);
});
test('assigned team extracts rather than a closer unassigned soldier, and completes its objective',()=>{
 const input=assign([{...rescuer(),x:8,y:5},{...rescuer('b','beta'),x:4,y:6},patient()]);
 let units=copy(input),extracted=false;
 for(let round=2;round<8&&!extracted;round++){
 const step=c.tacticalAiCasualtyExtractionStep({humans:units.map(u=>u.id==='p'?u:{...u,tu:40}),aliens:[],covers:[],mission,skyranger:placement,round});
 units=step.humans;extracted=units.find(u=>u.id==='p').casualtyExtracted;
 }
 assert.equal(extracted,true);
 assert.equal(units.find(u=>u.id==='p').stabilizedRecoveryEvent.rescuerId,'r');
 assert.equal(c.tacticalFireTeamObjectiveAssignmentForTeam(units,'alpha').mode,'default');
 assert.equal(input.find(u=>u.id==='p').casualtyExtracted,undefined);
});
test('confirmed manual extraction grants repeatable deduplicated rescuer recognition and report attribution',()=>{
 const extracted=extract();assert.equal(extracted.extracted,true);
 const result=aftermath(extracted.units),soldier={...rescuer(),status:'Ready'};
 const award=c.campaignRecordRecoveryRecognition(soldier,result,mission);
 assert.equal(award.recoveryRecognitionCount,1);assert.equal(award.identity.commendations[0].name,'No One Left Behind');
 assert.equal(c.campaignRecordRecoveryRecognition(copy(award),copy(result),mission).recoveryRecognitionCount,1);
 assert.equal(c.campaignRecordRecoveryRecognition(award,result,{id:'another'}).recoveryRecognitionCount,2);
 assert.equal(c.campaignRecordRecoveryRecognition(rescuer('b'),result,mission).recoveryRecognitionCount,undefined);
 assert.match(c.buildMissionReportEntries(result,mission).join(' '),/No One Left Behind: r recovered/);
 assert.equal(extracted.casualty.unconscious,true);
});
test('unstabilized extraction and end-of-mission recovery do not invent achievement credit',()=>{
 const units=[{...rescuer(),draggingCasualtyId:'p'},{...patient(),stabilized:false,bleeding:true,bleedOutRounds:3,draggedById:'r'}];
 const result=c.tacticalExtractDraggedCasualtyAtSkyranger(units,'r',placement,3);
 assert.equal(result.extracted,true);assert.equal(result.casualty.stabilizedRecoveryEvent,null);
 for(const state of [result.units,[rescuer(),patient()]]){
 const soldier=rescuer();assert.equal(c.campaignRecordRecoveryRecognition(soldier,aftermath(state),mission),soldier);
 }
});
test('changed casualty status releases optional assignment without completing the mission',()=>{
 for(const patch of [{downed:false,unconscious:false},{alive:false,hp:0},{extracted:true,casualtyExtracted:true}]){
 const units=assign([rescuer(),patient()]);Object.assign(units[1],patch);c.tacticalReleaseFinishedRecoveryObjectives(units,4);
 assert.equal(c.tacticalFireTeamObjectiveAssignmentForTeam(units,'alpha').mode,'default');
 }
});
test('Hybrid player ownership and higher medical responder duties remain protected',()=>{
 for(const patch of [{hybridPlayerControlledLead:true},{}]){
 const units=assign([{...rescuer(),...patch},rescuer('b','beta'),patient()]);
 const step=c.tacticalAiCasualtyExtractionStep({humans:units,mission,skyranger:placement,excludedResponderIds:patch.hybridPlayerControlledLead?[]:['r']});
 assert.equal(step.extractedIds.length,0);
 }
});
test('recovery event survives playback, tactical save and campaign migration',()=>{
 const result=extract(),patientUnit=result.casualty;
 const state=c.tacticalPlaybackMedicalState(patientUnit,patient());assert.equal(state.stabilizedRecoveryEvent.rescuerId,'r');
 const before=c.tacticalPlaybackMedicalState({...patient(),stabilizedRecoveryEvent:null},state);assert.equal(before.stabilizedRecoveryEvent,null);
 const payload={version:1,missionId:mission.id,liveState:{deployment:{},units:result.units,covers:[]}};
 assert.equal(c.tacticalRestoreLiveStateSavePayload(mission,copy(payload)),true);
 assert.equal(c.tacticalLiveStateSavePayload(mission.id).liveState.units.find(u=>u.id==='p').stabilizedRecoveryEvent.rescuerId,'r');
 const game=c.makeNewGameData();game.soldiers[0]=c.campaignRecordRecoveryRecognition({...game.soldiers[0],id:'r'},aftermath(result.units),mission);
 assert.equal(c.migrateCampaignData(copy(game)).soldiers[0].recoveryRecognitionCount,1);
});

test('AI continuation retains drag ownership across a save and credits the final carrier',()=>{
 let units=assign([{...rescuer(),x:2,y:5,tu:16},{...patient(),x:1,y:5}]);
 const first=c.tacticalAiCasualtyExtractionStep({humans:units,mission,skyranger:placement,round:2});
 assert.equal(first.extractedIds.length,0);
 units=copy(first.humans);assert.equal(units.find(u=>u.id==='r').draggingCasualtyId,'p');
 const next=c.tacticalAiCasualtyExtractionStep({humans:units.map(u=>u.id==='r'?{...u,tu:40}:u),mission,skyranger:placement,round:3});
 assert.equal(next.extractedIds[0],'p');assert.equal(next.humans.find(u=>u.id==='p').stabilizedRecoveryEvent.rescuerId,'r');
});
test('assisting recovery team can extract and both assignments release',()=>{
 const units=[{...rescuer(),hybridPlayerControlledLead:true,x:10,y:10},rescuer('b','beta'),patient()];
 const assigned=c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:'casualty-recovery:p',beta:c.tacticalFireTeamObjectiveAssistChoice('alpha')},objectives(units),2);
 const result=c.tacticalAiCasualtyExtractionStep({humans:assigned,mission,skyranger:placement,round:3});
 assert.equal(result.extractedIds[0],'p');assert.equal(result.humans.find(u=>u.id==='p').stabilizedRecoveryEvent.rescuerId,'b');
 for(const team of ['alpha','beta'])assert.equal(c.tacticalFireTeamObjectiveAssignmentForTeam(result.humans,team).mode,'default');
});
test('stream snapshots preserve recovery events without fabricating earlier credit',()=>{
 const start=source.indexOf('function snapshotUnits('),end=source.indexOf('\n  }',start)+4;vm.runInContext(source.slice(start,end),c);
 const snapshot=c.snapshotUnits(extract().units).find(u=>u.id==='p');
 assert.equal(snapshot.stabilizedRecoveryEvent.rescuerId,'r');
 assert.equal(c.snapshotUnits([patient()])[0].stabilizedRecoveryEvent,null);
});

test('objective board renders optional recovery and dispatches the existing assignment callback',()=>{
 const ui=runtimeContext({React:{createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)})}});
 ui.ReactDOM.createPortal=tree=>tree;
 const board=vm.runInContext('FireTeamObjectiveAssignmentOverlay',ui),units=[rescuer(),patient()],known=ui.tacticalKnownMissionObjectives({units,mission,covers:[]});let changed=null;
 const tree=board({prompt:{reason:'review'},teams:[{id:'alpha',label:'Alpha',members:[units[0]]}],objectives:known,choices:{},onChange:(team,objective)=>changed=[team,objective]});
 const nodes=node=>node&&typeof node==='object'?[node,...(node.children||[]).flatMap(nodes)]:[];
 const content=node=>node&&typeof node==='object'?(node.children||[]).map(content).join(' '):String(node??'');
 assert.ok(content(tree).includes('Recover Patient (optional)'));assert.match(content(tree),/No One Left Behind/);
 nodes(tree).find(node=>node.type==='select').props.onChange({target:{value:'casualty-recovery:p'}});
 assert.deepEqual(changed,['alpha','casualty-recovery:p']);
 const dragging=ui.tacticalKnownMissionObjectives({units:[units[0],{...units[1],draggedById:'r'}],mission,covers:[]});
 assert.match(dragging.find(o=>o.type==='casualty-recovery').detail,/Being dragged by r/);
});
