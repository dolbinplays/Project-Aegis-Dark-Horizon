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
test('real formation pacing excludes downed support and preserves the objective through save round-trip',()=>{
 const mission={id:'regroup-qa',kind:'Alien Abduction Site',region:'Europe',threat:1,tacticalMapTier:'small'};
 let units=[
 {id:'leader',name:'Leader',team:'human',hp:40,alive:true,x:12,y:12,facing:'E',tu:60,maxTu:60,fireTeamId:'alpha',fireTeamRole:'leader',fireTeamLeaderId:'leader'},
 {id:'left',name:'Left',team:'human',hp:40,alive:true,x:10,y:12,tu:60,maxTu:60,fireTeamId:'alpha',fireTeamRole:'left',fireTeamLeaderId:'leader'},
 {id:'right',name:'Right',team:'human',hp:1,alive:true,downed:true,x:3,y:3,fireTeamId:'alpha',fireTeamRole:'right',fireTeamLeaderId:'leader'}];
 const target=context.tacticalFireTeamFormationTargets(units.filter(u=>!u.downed),units[0],[],mission).get('left');
 Object.assign(units[1],target);
 context.tacticalArmFireTeamPostCombatFormationRecovery(units,18);
 context.tacticalArmFireTeamPostCombatFormationRecovery(units,25);
 units=JSON.parse(JSON.stringify(units));
 const before=context.tacticalFireTeamObjectiveAssignmentForTeam(units,'alpha');
 const state=context.tacticalFireTeamPostContactRecoveryState({unit:units[0],units,covers:[],mission,round:26});
 assert.equal(state.recoveryAge,1);assert.equal(state.formationReady,true);assert.equal(state.pace.supports.length,1);
 context.tacticalCompleteFireTeamPostContactRecovery(units,'alpha');
 assert.deepEqual(context.tacticalFireTeamObjectiveAssignmentForTeam(units,'alpha'),before);
 assert.equal(units[2].downed,true);assert.equal(units[2].hp,1);
});
test('combat, contact pursuit and active escort still suspend formation recovery',()=>{
 const units=[{id:'leader',team:'human',hp:40,alive:true,x:12,y:12,fireTeamId:'alpha',fireTeamRole:'leader',fireTeamLeaderId:'leader'}];
 context.tacticalArmFireTeamPostCombatFormationRecovery(units,3);
 for(const priority of [{liveCombatPriority:true},{lastKnownContactPriority:true},{civilianDutyIds:new Set(['leader'])}]){
 const state=context.tacticalFireTeamPostContactRecoveryState({unit:units[0],units,round:4,...priority});
 assert.equal(state.active,false);assert.equal(state.pending,true);
 }
});

test('resolving a long contact resets the recovery window for the surviving team',()=>{
 const units=[{id:'leader',team:'human',hp:40,alive:true,x:12,y:12,fireTeamId:'alpha',fireTeamRole:'leader',fireTeamLeaderId:'leader',aiPostContactRecoveryRound:3}];
 context.tacticalResetAlienSearchAfterResolvedContact(units,12);
 assert.equal(units[0].aiPostContactRecoveryRound,12);
 assert.equal(context.tacticalFireTeamPostContactRecoveryState({unit:units[0],units,round:13}).recoveryAge,1);
});
