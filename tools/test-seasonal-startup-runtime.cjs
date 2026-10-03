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
    ReactDOM:{createRoot:()=>({render:()=>{if(options.onRender)options.onRender(context);}})}, THREE:{}
  };
  context.window=context; context.globalThis=context; context.self=context;
  Object.assign(context.React,options.React||{});
  if(options.editor){context.parent={location:{search:"?aegisBuildingEditor=regression"},parent:{}};context.AEGIS_INSTALL_BUILDING_EDITOR=api=>{assert.equal(typeof context.seasonalRecoveredDropsFromAliens,"function");context.editorInstalled=Boolean(api.generate);};}
  if(options.tv)context.AEGIS_TV_RUNTIME={enabled:true,metrics:{}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-building-layouts.js'),'utf8'),context);
  vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-department-heads.js'),'utf8'),context);
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}


test('normal game startup registers seasonal helpers before rendering',()=>{
 let rendered=false; const c=runtimeContext({onRender:ctx=>{rendered=true;assert.equal(typeof ctx.seasonalRecoveredDropsFromAliens,'function');assert.equal(typeof ctx.tacticalPrepareMissionCovers0044,'function');}});
 assert.equal(rendered,true);
 for(const name of ['seasonalRecoveredDropsFromAliens','seasonalHalloweenMapDecorations','tacticalPrepareMissionCovers0044'])assert.equal(typeof c[name],'function',name);
 for(const fn of ['seasonalHalloween0042ContractChecks','seasonalHalloween0044ContractChecks'])for(const [name,pass] of Object.entries(c[fn]()))assert.equal(pass,true,name);
});
if(process.env.AEGIS_STALLED_SAVE)test('reported failed AI continuation produces another batch without seasonal errors',{timeout:120000},async()=>{
 const c=runtimeContext();seededRandom(c);const data=JSON.parse(fs.readFileSync(process.env.AEGIS_STALLED_SAVE,'utf8')).data;
 const live=data.activeTacticalState.liveState,play=live.aiPlayback;
 const initial=play.streamRecoveryContinuation;
 assert.ok(initial&&initial.units?.length,'saved recovery battlefield exists');
 const squad=initial.units.filter(u=>u.team==='human').map(u=>u.baseSoldier||u.base||data.soldiers.find(s=>s.id===u.id)).filter(Boolean);
 const batch=await c.resolveMissionAiStreamBatchAsync({squad,mission:play.mission,tech:data.tech||[],weaponUpgrades:data.weaponUpgrades,initialBattleState:initial,maxSimulationRounds:72,batchRounds:1,simulatedRounds:play.streamSimulatedRounds,hadPriorPlaybackShots:true,alienFieldBeaconKnowledge:data.alienFieldBeaconKnowledge||'unknown',fastHandoff:true});
 assert.ok(batch.complete||batch.continuation,'AI must finish or return a continuation');
 assert.ok(batch.frames?.length,'AI must return playback frames');
 console.log('Saved mission replay',JSON.stringify({complete:batch.complete,frames:batch.frames.length,simulatedRounds:batch.simulatedRounds}));
});

test('building editor startup still installs after shared gameplay extensions',()=>{
 const c=runtimeContext({editor:true,onRender:()=>assert.fail('editor must not render the game')});
 assert.equal(c.editorInstalled,true);
});
