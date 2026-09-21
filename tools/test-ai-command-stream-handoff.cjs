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

test('TV start, save menu and new-game setup retain hook order and initialize history once',()=>{
  const slots=[];let cursor=0;
  const useState=initial=>{const index=cursor++;if(!slots[index])slots[index]={kind:'state',value:typeof initial==='function'?initial():initial};assert.equal(slots[index].kind,'state');return[slots[index].value,value=>{slots[index].value=typeof value==='function'?value(slots[index].value):value;}];};
  const useMemo=(fn,deps)=>{const index=cursor++;if(!slots[index])slots[index]={kind:'memo',value:fn(),deps};else{assert.equal(slots[index].kind,'memo');if(!deps||deps.some((d,i)=>!Object.is(d,slots[index].deps?.[i])))slots[index]={kind:'memo',value:fn(),deps};}return slots[index].value;};
  const useRef=value=>{const index=cursor++;if(!slots[index])slots[index]={kind:'ref',value:{current:value}};assert.equal(slots[index].kind,'ref');return slots[index].value;};
  const useEffect=()=>{const index=cursor++;if(!slots[index])slots[index]={kind:'effect'};assert.equal(slots[index].kind,'effect');};
  const createElement=(type,props,...children)=>({type,props:{...props,children:children.flat()}});
  const context=runtimeContext({tv:true,React:{useState,useMemo,useRef,useEffect,useLayoutEffect:useEffect,useCallback:(fn,deps)=>useMemo(()=>fn,deps),createElement}});
  const render=()=>{cursor=0;return context.AlienResponseCommand();};
  function nodes(tree){if(!tree||typeof tree!=='object')return[];return[tree,...(tree.props?.children||[]).flatMap(nodes)];}
  const text=tree=>{if(tree===null||tree===undefined||typeof tree==='boolean')return'';if(typeof tree!=='object')return String(tree);return(tree.props?.children||[]).map(text).join(' ');};
  const start=render(),hookCount=cursor,runner=context.runSelfTests;
  const openMenu=nodes(start).find(node=>node.type==='button'&&/Load|Save/.test(text(node)));
  assert.ok(openMenu,'start screen exposes save/load entry');openMenu.props.onClick();
  const menu=render();assert.match(text(menu),/Save \/ Load Game/);assert.equal(cursor,hookCount);assert.equal(context.runSelfTests,runner);
  const back=nodes(menu).find(node=>node.type==='button'&&text(node)==='Return to Start Screen');assert.ok(back);back.props.onClick();render();assert.equal(cursor,hookCount);assert.equal(context.runSelfTests,runner);
  const newGame=nodes(start).find(node=>node.type==='button'&&/Start New Game/.test(text(node)));assert.ok(newGame);newGame.props.onClick();const setup=render();assert.match(text(setup),/base/i);assert.equal(cursor,hookCount);assert.equal(context.runSelfTests,runner);
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
