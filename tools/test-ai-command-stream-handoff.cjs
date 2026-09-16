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
let appSource = scripts[6].replace(/ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\([^;]+;\s*$/s, '');

const noop = () => {};
const element = () => ({style:{},dataset:{},classList:{add:noop,remove:noop,toggle:noop},appendChild:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],getContext:()=>null});
const storage = () => { const map = new Map(); return {getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key),clear:()=>map.clear()}; };

function runtimeContext() {
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
  vm.createContext(context);
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}

test('AI Command streamed handoff executes the real first planning round and retains Simulation authority', {timeout:30000}, async () => {
  const context=runtimeContext();
  seededRandom(context);
  assert.equal(typeof context.tacticalEscortLeaderLockState, 'function', 'escort-leader authority helper must exist in the real runtime');
  assert.equal(typeof context.resolveMissionAiStreamBatchAsync, 'function');
  const game=context.makeNewGameData({openingIncidentSeed:12345});
  const mission={...game.missions[0],id:'qa-north-america-abduction',kind:'Alien Abduction Site',region:'North America',alien:'Tide Horror',threat:2,reward:520,panicPenalty:20,tacticalMapTier:'medium'};
  const baseSquad=game.soldiers.slice(0,6);
  const squad=[...baseSquad,...baseSquad.map((soldier,index)=>({...soldier,id:`${soldier.id}-bear`,name:index===0?'Farah Vale':`${soldier.name} B`}))];
  const batch=await context.resolveMissionAiStreamBatchAsync({
    squad, mission, tech:game.tech||[], leaderInstruction:'AI Command handoff regression', weaponUpgrades:game.weaponUpgrades,
    initialBattleState:null, revealAllPlaybackActions:false, onProgress:noop, maxSimulationRounds:72, batchRounds:1,
    simulatedRounds:0, hadPriorPlaybackShots:false, alienFieldBeaconKnowledge:game.alienFieldBeaconKnowledge||'unknown', fastHandoff:true
  });
  assert.ok(Array.isArray(batch.frames) && batch.frames.length > 1, 'first AI round should generate playback frames');
  assert.ok(batch.complete || batch.continuation, 'stream must either finish or retain an AI continuation');
  assert.equal(batch.blocked, undefined, 'normal first-round handoff should not be blocked');
  const humans=batch.continuation?.units?.filter(unit=>unit.team==='human'&&unit.alive!==false&&Number(unit.hp)>0)||[];
  assert.ok(humans.length > 0, 'continuation should retain living AEGIS actors');
  assert.ok(humans.some(unit=>Number.isFinite(Number(unit.aiObjectivePriority)) && unit.aiObjectiveType), 'actors should carry central objective diagnostics');
  assert.ok(humans.some(unit=>String(unit.aiTurnAction||'').includes('move')), 'at least one free actor should execute movement under AI control');
  assert.ok(humans.some(unit=>unit.aiObjectiveType==='ACTIVE_ESCORT'), 'known VIP/civilian work should outrank generic exploration in the two-squad abduction fixture');
  const farah=humans.find(unit=>unit.name==='Farah Vale');
  assert.ok(farah && Number.isFinite(Number(farah.aiObjectivePriority)), 'Farah should receive an authoritative objective under AI control');
  assert.ok(!farah.aiAlienHuntMode || farah.aiObjectiveType==='SEARCH', 'Farah must not retain stale exploration scratch beneath a higher objective');
});

test('streamed continuation survives contact transition without reverting to stale search', {timeout:30000}, async () => {
  const context=runtimeContext(); seededRandom(context,246813579);
  const game=context.makeNewGameData({openingIncidentSeed:24680});
  const mission={...game.missions[0],tacticalMapTier:'small'};
  const squad=game.soldiers.slice(0,8);
  let batch=await context.resolveMissionAiStreamBatchAsync({squad,mission,tech:game.tech||[],leaderInstruction:'AI Command transition regression',weaponUpgrades:game.weaponUpgrades,initialBattleState:null,revealAllPlaybackActions:false,onProgress:noop,maxSimulationRounds:72,batchRounds:1,simulatedRounds:0,hadPriorPlaybackShots:false,alienFieldBeaconKnowledge:game.alienFieldBeaconKnowledge||'unknown',fastHandoff:true});
  for(let iteration=0;iteration<2 && batch.continuation;iteration+=1){
    batch=await context.resolveMissionAiStreamBatchAsync({squad,mission,tech:game.tech||[],leaderInstruction:'AI Command continued',weaponUpgrades:game.weaponUpgrades,initialBattleState:batch.continuation,revealAllPlaybackActions:false,onProgress:noop,maxSimulationRounds:72,batchRounds:1,simulatedRounds:batch.simulatedRounds,hadPriorPlaybackShots:true,alienFieldBeaconKnowledge:game.alienFieldBeaconKnowledge||'unknown',fastHandoff:true});
  }
  const humans=(batch.continuation?.units||batch.result?.tacticalChunkContinuation?.units||[]).filter(unit=>unit.team==='human'&&unit.alive!==false&&Number(unit.hp)>0);
  assert.ok(humans.length > 0);
  const contactActors=humans.filter(unit=>['VISIBLE_ALIEN','LAST_KNOWN_CONTACT'].includes(unit.aiObjectiveType));
  if(contactActors.length){
    for(const unit of contactActors){
      assert.equal(unit.aiAlienHuntMode, null, `${unit.name||unit.id} must not retain exploration mode beneath contact authority`);
      assert.ok(unit.aiPatrolTargetX == null, `${unit.name||unit.id} must not retain patrol target beneath contact authority`);
    }
  }
});
