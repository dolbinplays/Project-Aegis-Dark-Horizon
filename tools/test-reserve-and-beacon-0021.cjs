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

const THREE=require('../assets/vendor/three.min.js');

test('shot timing is independent of round count and matches reserve for each weapon',()=>{
 const c=runtimeContext();for(const weaponKind of ['ballistic','laser','plasma'])for(const timing of ['single','aimed']){
  const unit={id:'h',team:'human',hp:40,tu:22,weaponKind,ammo:12};const upgrades={laserCooling:2,plasmaCooling:2};const costs=[];
  for(const mode of ['single','burst','auto']){const action=c.tacticalActionState([unit],'h',mode,upgrades,timing);costs.push(action.mode.tu);assert.equal(action.mode.tu,c.tacticalReserveTuForMode(unit,timing,mode,upgrades));assert.equal(action.mode.rounds,{single:1,burst:3,auto:6}[mode]);assert.equal(action.mode.accPenalty,{single:0,burst:14,auto:28}[mode]-(timing==='aimed'?12:0));assert.equal(action.canFire,true);}
  assert.deepEqual(costs,[timing==='aimed'?22:14,timing==='aimed'?22:14,timing==='aimed'?22:14]);
 }
});
test('standing is paid before movement while shot or later kneel stays reserved',()=>{
 const c=runtimeContext(),u={id:'h',team:'human',hp:40,alive:true,tu:30,kneeling:true,weaponKind:'ballistic',ammo:12};
 assert.equal(c.tacticalManualMovementStepAllowance(u,14),3);assert.equal(c.tacticalManualMovementStepAllowance(u,22),1);assert.equal(c.tacticalManualMovementStepAllowance(u,4),5);assert.equal(c.tacticalManualMovementStepAllowance({...u,tu:7},4),0);assert.equal(c.tacticalManualMovementStepAllowance({...u,kneeling:false},14),4);
 assert.equal(c.tacticalReserveTuForMode(u,'none'),0);assert.equal(c.tacticalReserveTuForMode(u,'kneel'),4);
});
test('legacy automatic reserves migrate to Snap; actual aimed shots require aimed TU',()=>{
 const c=runtimeContext(),u={id:'h',team:'human',hp:40,tu:20,weaponKind:'ballistic',ammo:12};assert.equal(c.tacticalNormalizeReserveMode('auto'),'single');assert.equal(c.tacticalNormalizeReserveMode('burst'),'single');assert.equal(c.tacticalActionState([u],'h','auto',{},'single').canFire,true);assert.equal(c.tacticalActionState([u],'h','single',{},'aimed').canFire,false);
});
test('reaction bursts roll independent rounds and spend one Snap cost',()=>{
 const c=runtimeContext();c.tacticalShotCommitVisibilityState=()=>({ok:true,distance:3});c.tacticalAiKnownShieldBlocksShot=()=>false;c.tacticalShatterWindowInShotPath=(_a,_b,covers)=>({covers,penalty:0});c.tacticalDarknessAccuracyPenalty=()=>0;c.tacticalAlienBeaconShieldShotState=()=>({blocked:false});c.upgradedWeaponDamage=()=>10;c.specializationCombatModifier=()=>0;
 const shooter={id:'h',team:'human',hp:40,tu:30,weaponKind:'ballistic',ammo:12,acc:70,x:2,y:2,baseSoldier:{stats:{reactions:90}}},target={id:'a',team:'alien',hp:100,x:5,y:2};
 const result=c.tacticalReactionShotResult({shooter,target,requestedMode:'burst',triggerRoll:1,hitRoll:[1,100,1]});assert.equal(result.hits,2);assert.equal(result.damage,20);assert.equal(result.shooter.ammo,9);assert.equal(result.shooter.tu,16);
});
test('known active beacon blocks ordinary, rescue-only, crash-site and principal victory',()=>{
 const c=runtimeContext(),human={id:'h',team:'human',hp:40,alive:true,weaponKind:'laser',tu:40,x:5,y:5},principalMission=c.makePrincipalRescueMission({id:'principal-test',reward:400}),principal={...c.principalUnitFields(principalMission,0),team:'civilian',hp:18,alive:true,rescued:true,x:6,y:5};
 for(const mission of [{id:'normal',kind:'Alien Incident'},{id:'rescue',requiresAlienDefeat:false},{id:'crash',kind:'UFO Crash Site',crashSite:true},principalMission]){
  const beacon={...c.tacticalAlienFieldBeaconCover({x:15,y:15},mission,64),revealed:true};const args={mission,humans:[human],aliens:[],civilians:mission===principalMission?[principal]:[],beaconKnowledge:'confirmed',covers:[beacon]};const state=c.tacticalMissionTerminalState(args);assert.equal(state.beaconObjective.pending,true);assert.equal(state.victory,false);
  for(const alienBeaconState of ['destroyed','disabled'])assert.equal(c.tacticalMissionTerminalState({...args,covers:[{...beacon,hp:0,alienBeaconState}]}).beaconObjective.pending,false);
 }
});
test('unknown beacon does not invent knowledge; extraction resumes victory after neutralization',()=>{
 const c=runtimeContext(),mission=c.makePrincipalRescueMission({id:'p',reward:400}),human={id:'h',team:'human',hp:40,alive:true,weaponKind:'laser',x:5,y:5},principal={...c.principalUnitFields(mission,0),team:'civilian',hp:18,alive:true,rescued:true,x:6,y:5},beacon={...c.tacticalAlienFieldBeaconCover({x:50,y:50},mission,64),revealed:false};const args={mission,humans:[human],aliens:[],civilians:[principal],covers:[beacon]};assert.equal(c.tacticalMissionTerminalState({...args,beaconKnowledge:'unknown'}).victory,true);assert.equal(c.tacticalMissionTerminalState({...args,beaconKnowledge:'confirmed'}).beaconObjective.phase,'locate');assert.equal(c.tacticalMissionTerminalState({...args,beaconKnowledge:'confirmed',covers:[{...beacon,hp:0,alienBeaconState:'destroyed'}]}).victory,true);
});
test('UI and movement commit use consistent cost authority',()=>{const c=runtimeContext(),source=String(c.TacticalMission);assert.ok(source.includes('selectedUnit.tu < cost + reservedTu'));assert.ok(source.includes('accuracy per round'));assert.ok(!source.includes('FIRE_MODES[mode].tu'));assert.ok(source.includes('weaponUpgrades,reserveMode)'));assert.ok(source.includes('Standing before movement costs 4 TU extra.'));});
