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


function escortFixture(c, tracked=true) {
 const base=c.makeNewGameData({openingIncidentSeed:12}).soldiers[0];
 const human=(id,x,y,role)=>({id,name:id,team:'human',alive:true,hp:40,maxHp:40,tu:60,maxTu:60,x,y,fireTeamId:'alpha',fireTeamRole:role,fireTeamLeaderId:'lead',weaponKind:'laser',baseSoldier:{...base,id},fearState:'steady',grenadeCharges:0});
 const vip=(id,escortId,x,y)=>({id,name:id,team:'civilian',alive:true,hp:18,x,y,revealed:true,vipTracker:tracked,rescued:false,escortId});
 return [human('lead',20,8,'leader'),human('support',20,18,'left'),vip('v1','lead',21,8),vip('v2','support',21,18)];
}
for(const tracked of [true,false])test(`${tracked?'VIP':'civilian'} escort owners on one team each receive a rescue turn`,()=>{
 const c=runtimeContext();seededRandom(c);const units=escortFixture(c,tracked);
 assert.deepEqual(Array.from(c.tacticalAiRescueActorOrder(units).map(u=>u.id)).sort(),['lead','support']);
 const result=c.tacticalAiCivilianPriorityTurn({units,placement:c.tacticalSkyrangerPlacement({x:8,y:24}),covers:[],mission:{id:'escorts',kind:'Alien Incident',gridSize:32,clock:{minute:720}},round:2});
 for(const id of ['lead','support'])assert.ok(result.actedIds.includes(id)&&result.movementTrails[id]?.length>1,`${id} skipped: ${JSON.stringify(result.events)}`);
});
test('active escort priority includes a support soldier and an unassigned solo escort',()=>{
 const c=runtimeContext();const units=escortFixture(c).filter(u=>u.id!=='v1');
 units.push({...units[1],id:'solo',fireTeamId:null}, {...units[2],id:'v3',escortId:'solo'});
 assert.deepEqual(Array.from(c.tacticalActiveEscortActorIds(units)).sort(),['solo','support']);
 assert.deepEqual(Array.from(c.tacticalActiveEscortActorIds(units,new Set(['support']))),['solo']);
});
test('moving an escort does not consume another escort owners TU or move them as support',()=>{
 const c=runtimeContext();const units=escortFixture(c);
 const after=c.tacticalAdvanceEscortedCivilians(units,'lead',{x:19,y:8},[],null,4,{gridSize:32});
 const before=units.find(u=>u.id==='support'),support=after.find(u=>u.id==='support');
 assert.deepEqual([support.x,support.y,support.tu],[before.x,before.y,before.tu]);
});

for(const tracked of [true,false])test(`hidden ${tracked?'VIP':'civilian'} followers retain an extraction turn`,()=>{
 const c=runtimeContext();seededRandom(c);const units=escortFixture(c,tracked).map(u=>u.team==='civilian'?{...u,revealed:false,visible:false}:u);
 const result=c.tacticalAiCivilianPriorityTurn({units,placement:c.tacticalSkyrangerPlacement({x:8,y:24}),covers:[],mission:{id:'hidden-escorts',gridSize:32,clock:{minute:720}},round:2,combatPriority:true});
 for(const id of ['lead','support'])assert.ok(result.actedIds.includes(id)&&result.movementTrails[id]?.length>1,`${id} skipped`);
});
if(process.env.AEGIS_ESCORT_SAVE)test('Pavel advances from the reported save with three hidden VIPs',()=>{
 const c=runtimeContext();seededRandom(c);const data=JSON.parse(fs.readFileSync(process.env.AEGIS_ESCORT_SAVE,'utf8')).data;
 const live=data.activeTacticalState.liveState,mission=live.aiPlayback.mission,pavel=live.units.find(u=>u.name==='Pavel');
 const locked=c.tacticalEnsureVipRescueCommitments({units:live.units,covers:live.covers,mission,round:live.tacticalRound});
 assert.equal(locked.units.find(u=>u.id===pavel.id).fireTeamVipRescueCommitmentStatus,'escort');
 const result=c.tacticalAiCivilianPriorityTurn({units:locked.units,covers:live.covers,placement:live.deployment.skyranger,mission,round:live.tacticalRound,combatPriority:true,explored:live.explored});
 assert.ok(result.actedIds.includes(pavel.id),JSON.stringify(result.events));
 assert.ok(result.movementTrails[pavel.id]?.length>1,'Pavel must actually move');
 console.log('Pavel save replay:',JSON.stringify({before:[pavel.x,pavel.y],after:result.units.filter(u=>u.id===pavel.id).map(u=>[u.x,u.y]),events:result.events.slice(-3)}));
});
