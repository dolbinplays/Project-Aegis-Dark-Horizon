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
const effect=appSource.split('\n').find(line=>line.startsWith('useEffect(()=>{TACTICAL_LIVE_STATE_CACHE.set(mission.id,'));
assert.ok(effect);
function snapshotHarness(enabled){
 const deps=effect.slice(effect.lastIndexOf('},[')+3,-3).split(',');
 const scope={};
 for(const name of deps)if(/^[a-zA-Z]+$/.test(name))scope[name]=null;
 Object.assign(scope,{mission:{id:'hybrid-persistence',kind:'Alien Incident',gridSize:64},hybridBattleMode:enabled,initialDeployment:{},coversState:[],unitsState:[],floorItems:[],explored:new Set(),log:[],tacticalEvents:[],aiObserverHandoffViewRef:{current:null},alienContactSeenRef:{current:false},escortSupportContactActiveRef:{current:false},objectiveAssignmentKnownIdsRef:{current:new Set()},objectiveAssignmentChoices:{},objectiveAssignmentVipCommitmentChoices:{}});
 const cache=vm.runInContext('TACTICAL_LIVE_STATE_CACHE',c);
 let previous;
 scope.TACTICAL_LIVE_STATE_CACHE=cache;
 scope.useEffect=(fn,deps)=>{if(!previous||deps.some((value,i)=>value!==previous[i]))fn();previous=deps;};
 const context=vm.createContext(scope);
 return{scope,render(){vm.runInContext(effect,context);return cache.get(scope.mission.id);}};
}
test('Hybrid remains on through selection, turn, playback and view snapshot replacements',()=>{
 const h=snapshotHarness(true);assert.equal(h.render().hybridBattleMode,true);
 for(const patch of [{selected:'leader-2'},{turn:'ai',aiPlayback:{hybridRound:true}},{tacticalRound:2,turn:'human',aiPlayback:null},{tacticalViewMode:'3d'},{log:['Menu return']}])
 {Object.assign(h.scope,patch);assert.equal(h.render().hybridBattleMode,true);}
});
test('explicit disable is saved even if no other tactical state changes',()=>{
 const h=snapshotHarness(true);h.render();h.scope.hybridBattleMode=false;assert.equal(h.render().hybridBattleMode,false);
 h.scope.selected='next';assert.equal(h.render().hybridBattleMode,false);
 h.scope.hybridBattleMode=true;assert.equal(h.render().hybridBattleMode,true);
});
test('save restoration retains Hybrid on and off independently per mission',()=>{
 for(const enabled of [true,false]){
  const h=snapshotHarness(enabled),live=JSON.parse(JSON.stringify(h.render()));
  assert.equal(c.tacticalRestoreLiveStateSavePayload(h.scope.mission,{missionId:h.scope.mission.id,liveState:live}),true);
  const restored=vm.runInContext('TACTICAL_LIVE_STATE_CACHE.get("hybrid-persistence")',c);
  assert.equal(Boolean(restored.hybridBattleMode),enabled);
 }
 const h=snapshotHarness(true);h.scope.mission={...h.scope.mission,id:'other-mission'};h.render();
 const off=snapshotHarness(false);off.render();
 assert.equal(vm.runInContext('TACTICAL_LIVE_STATE_CACHE.get("other-mission").hybridBattleMode',c),true);
});

test('FPV and TPV survive Hybrid idle snapshots, save restoration and the next handoff',()=>{
 for(const mode of ['first-person','third-person']){
  const h=snapshotHarness(true);
  h.scope.aiObserverHandoffViewRef.current=c.tacticalAiObserverHandoffSnapshot({firstPerson:mode==='first-person',thirdPerson:mode==='third-person',returnView:'2d'});
  let live=h.render();assert.equal(live.aiObserverHandoffView.mode,mode);
  h.scope.turn='human';h.scope.aiFirstPersonView=false;h.scope.aiThirdPersonView=false;live=h.render();
  assert.equal(live.aiObserverHandoffView.mode,mode);
  c.tacticalRestoreLiveStateSavePayload(h.scope.mission,{missionId:h.scope.mission.id,liveState:JSON.parse(JSON.stringify(live))});
  const restored=vm.runInContext('TACTICAL_LIVE_STATE_CACHE.get("hybrid-persistence")',c);
  const view=c.tacticalAiObserverHandoffRestore(restored.aiObserverHandoffView);
  assert.equal(view.firstPerson,mode==='first-person');assert.equal(view.thirdPerson,mode==='third-person');assert.equal(view.returnView,'2d');
 }
});
test('actual Hybrid finish and Take Back Control preserve camera before clearing playback',()=>{
 const start=appSource.indexOf('function finishAiPlayback(){'),end=appSource.indexOf('function endTurn()',start);
 const finish=appSource.slice(start,end),branch=finish.slice(finish.indexOf('if(playback?.hybridRound)'));
 assert.ok(branch.indexOf('preserveAiObserverPerspectiveForHandoff();')<branch.indexOf('setAiPlayback(null)'));
 const take=appSource.slice(appSource.indexOf('function takeBackAiCommand(){'),appSource.indexOf('function applyShotDamage('));
 assert.ok(take.indexOf('preserveAiObserverPerspectiveForHandoff();')<take.indexOf('setAiPlayback(null)'));
});
