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

function fixture(){
 const c=runtimeContext(),mission={id:'combat-beacon',kind:'Alien Incident',region:'Europe',gridSize:32,incidentVipCount:0,incidentCivilianCount:0,incidentRescueCountVersion:2,clock:{minute:720}};
 const human={id:'h',name:'Tester',team:'human',alive:true,hp:40,maxHp:40,tu:48,maxTu:48,weaponKind:'laser',ammo:12,grenadeCharges:0,x:8,y:8,facing:'E',acc:80};
 const alien={id:'a',team:'alien',alive:true,hp:90,maxHp:90,x:17,y:11,facing:'W',weaponKind:'alien',tu:0,maxTu:1};
 const beacon={...c.tacticalAlienFieldBeaconCover({x:13,y:8},mission,32),hp:150,maxHp:150,alienBeaconShield:'none',revealed:true};
 return{c,mission,human,alien,beacon,args:{unit:human,units:[human,alien],visibleAliens:[alien],covers:[beacon],mission,knowledge:'confirmed'}};
}
test('known reinforcement beacon competes with living aliens; nearer alien and point-blank danger win',()=>{
 const f=fixture();assert.ok(f.c.tacticalAiCombatBeaconChoice(f.args)?.ranged);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,visibleAliens:[{...f.alien,x:11,y:8}]}),null);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,visibleAliens:[{...f.alien,x:10,y:8}],playerOrder:{kind:'beacon-assault'}}),null);
});
test('unknown, hidden, destroyed, out-of-sight and unaffordable beacons are ineligible',()=>{
 const f=fixture();assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,knowledge:'unknown'}),null);
 for(const change of [{revealed:false},{hp:0,alienBeaconState:'destroyed'},{x:31}])assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,covers:[{...f.beacon,...change}]}),null);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,unit:{...f.human,tu:0}}),null);
 f.c.hasLineOfSight=()=>false;assert.equal(f.c.tacticalAiCombatBeaconChoice(f.args),null);
});
test('player orders and rescue commitments survive; unassigned Hybrid followers can choose the beacon',()=>{
 const f=fixture();for(const playerOrder of [{id:'player-waypoint',kind:'move'},{id:'hybrid-round:m:alpha:1',preferredTargetId:'a'}])assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,playerOrder}),null);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,civilianDuty:true}),null);
 assert.ok(f.c.tacticalAiCombatBeaconChoice({...f.args,playerOrder:{id:'hybrid-round:m:alpha:1'}}));
});
test('observed protection prevents waste; safe grenade bypass and source replacement reevaluate',()=>{
 const f=fixture(),beacon=JSON.parse(JSON.stringify(f.c.tacticalAlienBeaconShieldImpactCovers([{...f.beacon,alienBeaconShield:'combined'}],'laser')[0]));
 assert.equal(f.c.tacticalAiKnownShieldBlocksShot(f.human,beacon,[beacon]),true);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,covers:[beacon]}),null);
 const choice=f.c.tacticalAiCombatBeaconChoice({...f.args,covers:[beacon],unit:{...f.human,grenadeCharges:1}});assert.ok(choice?.grenade?.beaconHit);
 assert.equal(f.c.tacticalAiCombatBeaconChoice({...f.args,covers:[beacon],unit:{...f.human,grenadeCharges:1},units:[f.human,{id:'vip',team:'civilian',hp:20,alive:true,x:13,y:8}]}),null);
 assert.ok(f.c.tacticalAiCombatBeaconChoice({...f.args,covers:[{...f.beacon,id:'replacement'}]}));
});
test('real simulation and Hybrid rounds fire at the beacon before the living alien is defeated',()=>{
 for(const mode of ['simulation','hybrid']){
  const f=fixture(),game=f.c.makeNewGameData({openingIncidentSeed:875}),base={...game.soldiers[0],id:f.human.id,equipment:'Laser Carbine'};
  const human={...f.human,baseSoldier:base,fireTeamId:'alpha',fireTeamLeaderId:'h',fireTeamRole:'leader'};
  assert.ok(f.c.tacticalAiPersonallyObservedAliens(human,[human,f.alien],[f.beacon],f.mission).some(a=>a.id===f.alien.id),'alien must be visible during the beacon choice');
  f.c.Math.random=()=>.5;
  const result=f.c.resolveMission({squad:[base],mission:f.mission,tech:[],mode:'simulation',aiControlMode:mode,initialBattleState:{units:[human,f.alien],covers:[f.beacon],round:1,gridSize:32},maxRoundsOverride:1,simulationChunkOnly:true,alienFieldBeaconKnowledge:'confirmed'});
  const shots=result.frames.flatMap(frame=>frame.shots||[]).filter(shot=>shot.side==='human');
  assert.ok(shots.some(shot=>shot.targetAlienBeacon),mode+': '+JSON.stringify(result.logs));
  assert.ok(result.frames.some(frame=>frame.shots?.some(shot=>shot.targetAlienBeacon)&&frame.aliens.some(alien=>alien.hp>0)));
 }
});
