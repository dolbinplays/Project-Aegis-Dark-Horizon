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
  const layoutsPath=path.join(root,'assets/runtime/aegis-building-layouts.js');
  if(fs.existsSync(layoutsPath))vm.runInContext(fs.readFileSync(layoutsPath,'utf8'),context);
  else context.AEGIS_BUILDING_LAYOUTS={create:()=>({read:()=>null,shape:x=>x,plan:(l,b)=>b,covers:()=>[],validate:()=>({ok:false,errors:['compact-package-stub'],warnings:[],reachable:[]}),publish:x=>x,clear:noop,copy:x=>JSON.parse(JSON.stringify(x))})};
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}

const c=runtimeContext();
function fixture(){
 const mission={id:'query-reuse',kind:'Alien Incident',gridSize:32,threat:1,tacticalClock:{month:1,dayOfMonth:1,minute:0},location:{lat:0,lon:0}};
 const humans=Array.from({length:4},(_,i)=>({id:'h'+i,team:'human',hp:40,alive:true,x:5,y:5+i,facing:'E',weaponKind:'ballistic',flashlightOn:true,tu:60,ammo:12}));
 const aliens=Array.from({length:5},(_,i)=>({id:'a'+i,team:'alien',hp:40,alive:true,x:11+i,y:5+i,facing:'W'}));
 const covers=[{id:'door',x:8,y:5,kind:'hard',hp:60,block:1,buildingPart:'door',visual:'building-door',doorState:'closed'},{id:'smoke',x:9,y:6,hp:10,hazardType:'smoke',smokeDensity:3}];
 return{mission,humans,aliens,units:[...humans,...aliens],covers};
}
const ids=units=>Array.from(units,u=>u.id);
test('shared sight context preserves per-observer decisions and rebuilds after in-place changes',()=>{
 const f=fixture();
 for(let stage=0;stage<4;stage++){
  const expected=f.aliens.filter(target=>f.humans.some(shooter=>c.tacticalShotCommitVisibilityState({shooter,target,covers:f.covers,mission:f.mission,range:40,requiredTargetTeam:'alien'}).ok));
  const original=c.tacticalVisibilityContext;let builds=0;c.tacticalVisibilityContext=(...args)=>{builds++;return original(...args);};
  try{assert.deepEqual(ids(c.tacticalAiObservedAliens(f.units,f.covers,f.mission)),ids(expected));assert.equal(builds,1);}finally{c.tacticalVisibilityContext=original;}
  for(const shooter of f.humans){const expectedPersonal=f.aliens.filter(target=>c.tacticalShotCommitVisibilityState({shooter,target,covers:f.covers,mission:f.mission,range:40,requiredTargetTeam:'alien'}).ok);assert.deepEqual(ids(c.tacticalAiPersonallyObservedAliens(shooter,f.units,f.covers,f.mission)),ids(expectedPersonal));}
  if(stage===0)f.covers[0].doorState='open';if(stage===1){f.covers[1].hp=0;f.humans[0].flashlightOn=false;}if(stage===2){f.covers[0].hp=0;f.covers.push({id:'flare',x:13,y:8,hp:1,lightType:'flare',lightActive:true,lightRadius:10});}
 }
});
test('fear perception retains lighting, sight and casualty filters with one context per query',()=>{
 const f=fixture();f.aliens[2].hp=0;
 for(const unit of [f.humans[0],f.aliens[0]]){
  const teams=unit.team==='alien'?['human','civilian']:['alien'];
  const expected=f.units.filter(other=>teams.includes(other.team)&&other.hp>0&&other.alive!==false&&!other.rescued&&c.tacticalDistance(unit,other)<=c.tacticalVisionRangeForCell(unit,other.x,other.y,f.covers,f.mission)&&c.hasLineOfSight(unit,other.x,other.y,f.covers,f.mission));
  const original=c.tacticalVisibilityContext;let builds=0;c.tacticalVisibilityContext=(...args)=>{builds++;return original(...args);};
  try{assert.deepEqual(ids(c.tacticalFearPerceivedHostiles(unit,f.units,f.covers,f.mission)),ids(expected));assert.equal(builds,1);}finally{c.tacticalVisibilityContext=original;}
 }
});
function referencePath(path,unit,covers){let fireSteps=0,smokeSteps=0,hazardCost=0,maxFire=0,maxSmoke=0;for(const cell of path.slice(1)){const fire=c.tacticalFireIntensityAt(covers,cell.x,cell.y),smoke=c.tacticalSmokeDensityAt(covers,cell.x,cell.y);fireSteps+=fire>0?1:0;smokeSteps+=smoke>0?1:0;maxFire=Math.max(maxFire,fire);maxSmoke=Math.max(maxSmoke,smoke);hazardCost+=c.tacticalMovementHazardCost(unit,cell,covers);}return{fireSteps,smokeSteps,hazardCost,maxFire,maxSmoke};}
test('indexed path hazards equal live queries across footprints and mutable fire/smoke state',()=>{
 const path=Array.from({length:12},(_,i)=>({x:i+1,y:5})),covers=[{id:'burn',x:3,y:5,hp:20,burning:true,fireIntensity:2,footprintCells:[{x:3,y:5},{x:4,y:5}]},{id:'smoke',x:6,y:5,hp:10,hazardType:'smoke',smokeDensity:3},{id:'dead',x:7,y:5,hp:0,hazardType:'fire',fireIntensity:3}];
 for(let stage=0;stage<4;stage++){
  for(const team of ['human','alien','civilian'])assert.deepEqual(JSON.parse(JSON.stringify(c.tacticalPathHazardStats(path,{team},covers))),referencePath(path,{team},covers));
  covers[0].hp=stage%2?20:0;covers[1].smokeDensity=stage;covers[2].hp=stage?15:0;
 }
});
test('query-local hazard indexes see in-place ignition even inside an existing AI round context',()=>{
 const unit={id:'human',team:'human',hp:40,x:1,y:5},covers=[{id:'wood',x:3,y:5,hp:20,kind:'soft',visual:'tree'}],path=[{x:2,y:5},{x:3,y:5}];
 const round=c.tacticalCreateAiRoundContext({units:[unit],covers,mission:{id:'ignite'},round:1});
 c.tacticalWithActiveAiRoundContext(round,()=>{
  assert.equal(c.tacticalPathHazardStats(path,unit,covers).fireSteps,0);
  covers[0].burning=true;covers[0].fireIntensity=3;
  assert.deepEqual(JSON.parse(JSON.stringify(c.tacticalPathHazardStats(path,unit,covers))),referencePath(path,unit,covers));
  covers[0].hp=0;assert.equal(c.tacticalPathHazardStats(path,unit,covers).fireSteps,0);
 });
});
test('movement candidate scoring builds at most one visibility context for its candidate loop',()=>{
 const f=fixture(),unit=f.humans[0],target=f.aliens[0];
 const original=c.tacticalVisibilityContext;let builds=0;c.tacticalVisibilityContext=(...args)=>{builds++;return original(...args);};
 try{const plan=c.tacticalAiMovePlan({unit,target,covers:f.covers,units:f.units,mission:f.mission,targetKnown:true,reserveTu:14});assert.ok(plan.path.length>0);assert.ok(builds<=8,'one candidate-loop context plus a bounded number of threat checks');}finally{c.tacticalVisibilityContext=original;}
});
test('allocation-free hex distance matches cube conversion across odd/even rows and coordinate forms',()=>{
 let state=147;
 const next=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
 for(let i=0;i<5000;i++){
  const a={x:Math.floor(next()*300)-100,y:Math.floor(next()*300)-100},b={x:Math.floor(next()*300)-100,y:Math.floor(next()*300)-100};
  if(i%5===0){a.x=String(a.x);b.y=String(b.y);}if(i%7===0){a.y+=.25;b.x+=.5;}
  const ac=c.tacticalOffsetToCube(a.x,a.y),bc=c.tacticalOffsetToCube(b.x,b.y);
  assert.equal(c.tacticalDistance(a,b),Math.max(Math.abs(ac.x-bc.x),Math.abs(ac.y-bc.y),Math.abs(ac.z-bc.z)));
 }
});





