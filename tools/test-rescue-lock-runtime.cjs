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

for(const tracked of [true,false])test(`${tracked?'VIP':'civilian'} priority lock advances its responder despite visible combat`,()=>{
 const c=runtimeContext();seededRandom(c);
 const mission={id:'rescue-lock',kind:'Alien Incident',gridSize:32,clock:{minute:720}};
 const base=c.makeNewGameData({openingIncidentSeed:12}).soldiers[0];
 const human=(id,x,role)=>({id,name:id,team:'human',alive:true,hp:40,maxHp:40,tu:60,maxTu:60,x,y:8,fireTeamId:'alpha',fireTeamRole:role,fireTeamLeaderId:'lead',weaponKind:'laser',baseSoldier:{...base,id},fearState:'steady',grenadeCharges:0});
 const target={id:'rescue',name:'Rescue target',team:'civilian',alive:true,hp:18,x:12,y:8,revealed:true,vipTracker:tracked,rescued:false};
 const alien={id:'alien',team:'alien',alive:true,hp:40,x:8,y:13,revealed:true,visible:true};
 const raw=[human('lead',3,'leader'),human('support',7,'left'),target,alien];
 const objective={id:'civilian:rescue',type:'civilian',targetId:'rescue',label:'Rescue target',x:12,y:8};
 const assigned=c.tacticalApplyFireTeamObjectiveAssignments(raw,{alpha:objective.id},[objective],2,{vipCommitmentChoices:{alpha:true}});
 const locked=c.tacticalEnsureVipRescueCommitments({units:assigned,covers:[],mission,round:2});
 assert.equal(locked.committedRescuerIds.length,1);
 const id=locked.committedRescuerIds[0],before=locked.units.find(u=>u.id===id);
 const result=c.tacticalAiCivilianPriorityTurn({units:locked.units,covers:[],mission,round:2,combatPriority:true,threats:[alien]});
 const after=result.units.find(u=>u.id===id);
 assert.ok(c.tacticalDistance(after,target)<c.tacticalDistance(before,target)||result.units.find(u=>u.id===target.id).escortId===id,JSON.stringify(result.events));
 const restored=JSON.parse(JSON.stringify(result.units));
 assert.equal(restored.find(u=>u.id===id).fireTeamVipRescueCommitmentEnabled,true);
 const completed=restored.map(u=>u.id===target.id?{...u,rescued:true}:u);
 assert.equal(c.tacticalEnsureVipRescueCommitments({units:completed,mission}).committedRescuerIds.length,0);
});
