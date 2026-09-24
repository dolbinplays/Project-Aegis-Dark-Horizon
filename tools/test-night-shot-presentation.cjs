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
const run=code=>vm.runInContext(code,c);
const start=source.indexOf('const aliensFromFrame =');
const end=source.indexOf('const civiliansFromFrame =',start);
const mapper=source.slice(start,end);
function mapAlien(unit,oldUnit={}){
 c.frame={aliens:[unit]};c.oldById={[unit.id]:oldUnit};c.mission={threat:2};c.deferDeaths=false;
 c.frameHp=(u,o,max)=>Number.isFinite(u.hp)?u.hp:(o.hp||max);c.frameVisibleByHumans=()=>false;
 return run('(function(){'+mapper+'return aliensFromFrame[0];})()');
}
test('shot visibility survives actual playback conversion and expires next frame',()=>{
 const alien={id:'a',team:'alien',hp:20,alive:true,x:12,y:8,revealed:true,shotPresentationVisible:true,aegisLastSeenMarkerActive:true,aegisLastSeenX:10,aegisLastSeenY:8};
 const mapped=mapAlien(alien);assert.equal(mapped.shotPresentationVisible,true);
 assert.equal(c.tacticalUnitVisibleOnMap(mapped,false,{aiMapPlayback:true}),true);
 assert.equal(c.tacticalVisibleTargetMarkers({units:[mapped],visibleByHumans:()=>false,aiMapPlayback:true}).length,1);
 assert.equal(c.tacticalLastKnownAlienContactMarkers([mapped],{shotPresentation:true}).length,0);
 assert.equal(c.tacticalLastKnownAlienContactMarkers([mapped]).length,1);
 const next=mapAlien({...alien,shotPresentationVisible:undefined,visible:false},mapped);
 assert.equal(next.shotPresentationVisible,false);
 assert.equal(c.tacticalUnitVisibleOnMap(next,false,{aiMapPlayback:true}),false);
});
test('visibility-only changes refresh persistent alien models',()=>{
 const base={missionId:'m',renderQuality:'auto',terrainKey:'t',coverKey:'c',visibilityKey:'v',unitsKey:'u'};
 assert.equal(c.tacticalThreePersistentInvalidationPlan(base,{...base,visibilityKey:'changed'}).units,true);
});

test('night shots require current sight, not remembered contact or presentation flags',()=>{
 const mission={id:'night-shot',kind:'Alien Incident',gridSize:32,threat:1,tacticalClock:{month:1,dayOfMonth:1,minute:0},location:{lat:0,lon:0}};
 const shooter={id:'s',team:'human',hp:40,alive:true,x:5,y:5,facing:'E',weaponKind:'ballistic',weaponRange:18,flashlightOn:false,tu:60,ammo:20,acc:80,reactions:90};
 const target={id:'a',team:'alien',hp:30,alive:true,x:15,y:5,revealed:true,aegisLastSeenMarkerActive:true,shotPresentationVisible:true};
 const check=(human,covers=[])=>c.tacticalShotCommitVisibilityState({shooter:human,target,covers,mission,range:18,requiredTargetTeam:'alien'});
 assert.equal(c.tacticalLightingForMission(mission).phase,'night');assert.equal(check(shooter).ok,false);
 assert.equal(c.tacticalReactionShotResult({shooter,target,mission,triggerRoll:1,hitRoll:1}).triggered,false);
 const lit={...shooter,flashlightOn:true};assert.equal(check(lit).ok,true);
 assert.equal(check({...lit,facing:'W'}).ok,false);
 assert.equal(check(lit,[{id:'wall',x:10,y:5,hp:50,kind:'hard',block:1}]).ok,false);
 const flare={id:'flare',x:15,y:5,hp:1,lightType:'flare',lightActive:true,lightRadius:10,visual:'tactical-flare'};
 assert.equal(check(shooter,[flare]).ok,true);assert.equal(check(shooter,[{...flare,lightActive:false}]).ok,false);
 const miss=c.tacticalReactionShotResult({shooter:lit,target,mission,triggerRoll:1,hitRoll:100});
 assert.equal(miss.triggered,true);assert.equal(miss.hit,false);assert.equal(miss.visibility.ok,true);
});
test('verified lethal and missed shot frames retain rendered targets during conversion',()=>{
 for(const killed of [false,true]){
  const target={id:'a',team:'alien',x:12,y:8,hp:killed?0:20,alive:!killed,fellThisFrame:killed};
  const frame=c.tacticalShotPresentationFrame({shots:[{side:'human',toId:'a',targetVisibilityVerified:true,targetRenderRequired:true,killed}],aliens:[target]});
  const mapped=mapAlien(frame.aliens[0]);assert.equal(mapped.shotPresentationVisible,true);
  assert.equal(c.tacticalUnitVisibleOnMap(mapped,false,{aiMapPlayback:true}),true);
 }
 const hidden=c.tacticalShotPresentationFrame({shots:[{side:'human',toId:'a'}],aliens:[{id:'a',revealed:false}]});
 assert.notEqual(hidden.aliens[0].shotPresentationVisible,true);
});
