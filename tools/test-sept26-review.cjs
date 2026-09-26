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








const c=runtimeContext();const THREE=require('../assets/vendor/three.min.js');
function setup(){
 c.tacticalThreePersistentSetAnimationState=()=>{};
 const runtime={THREE,effectRoot:new THREE.Group(),coverRoot:new THREE.Group(),worldFor:(x,y)=>({x,z:y}),qualitySettings:{standardMaterials:false},tacticalLighting:{phase:'day'},materialCache:new Map(),sharedMaterials:new Set(),sharedGeometries:new Set(),renderer:{domElement:{dataset:{}}},camera:new THREE.PerspectiveCamera(),firstPersonWeaponRoot:{visible:true}};
 runtime.activeCamera=runtime.camera;
 const craft=c.tacticalAlienDropshipCraft({x:20,y:15},64),plan=c.tacticalUfoFlightPlanForPlacement(craft,{id:'review'});
 const event={id:'flight',ufoFlight:{craft,flightPlan:plan,sourceId:'review',phase:'departure'}};
 return{runtime,event};
}
test('animated departure begins at the actual static UFO model center',()=>{
 const {runtime,event}=setup(),scene=new THREE.Group();
 const model=c.addTacticalSkyrangerThreeModel(THREE,scene,runtime.worldFor,event.ufoFlight.craft,()=>new THREE.MeshLambertMaterial(),runtime.qualitySettings);
 assert.equal(c.tacticalThreePersistentStartUfoFlightPresentation(runtime,event),true);
 const animated=runtime.ufoFlightPresentation.craft;
 assert.equal(animated.position.x,model.position.x);assert.equal(animated.position.z,model.position.z);
});
test('flight completion releases temporary geometry but retains cached materials',()=>{
 const {runtime,event}=setup();c.tacticalThreePersistentStartUfoFlightPresentation(runtime,event);
 const state=runtime.ufoFlightPresentation;let total=0,disposed=0,materialDisposals=0;
 state.root.traverse(node=>{if(node.geometry){total++;node.geometry.addEventListener('dispose',()=>disposed++);}});
 for(const material of runtime.materialCache.values())material.addEventListener('dispose',()=>materialDisposals++);
 c.tacticalThreePersistentAnimateUfoFlightPresentation(runtime,state.endAt+1);
 assert.ok(total>0);assert.equal(disposed,total);assert.equal(materialDisposals,0);assert.equal(runtime.effectRoot.children.length,0);
});
test('touchdown-only sighting never rewinds the visible approach to an earlier position',()=>{
 const {runtime,event}=setup();event.ufoFlight.phase='approach';event.ufoFlight.flightPlan.firstObservedProgress=1;
 c.tacticalThreePersistentStartUfoFlightPresentation(runtime,event);const state=runtime.ufoFlightPresentation;
 assert.equal(state.visibleStart,1);c.tacticalThreePersistentAnimateUfoFlightPresentation(runtime,state.startAt);
 assert.equal(state.craft.position.x,state.landingPoint.x);assert.equal(state.craft.position.z,state.landingPoint.z);
});

test('replacing a flight restores the old static craft and disposes its geometry',()=>{
 const {runtime,event}=setup();const staticCraft=new THREE.Group();staticCraft.userData={alienReinforcementCraft:true,ufoDeliverySourceId:'review'};runtime.coverRoot.add(staticCraft);
 event.ufoFlight.phase='approach';c.tacticalThreePersistentStartUfoFlightPresentation(runtime,event);assert.equal(staticCraft.visible,false);
 const old=runtime.ufoFlightPresentation;let disposed=0;old.root.traverse(node=>node.geometry?.addEventListener('dispose',()=>disposed++));
 c.tacticalThreePersistentStartUfoFlightPresentation(runtime,{...event,id:'other',ufoFlight:{...event.ufoFlight,sourceId:'other'}});
 assert.equal(staticCraft.visible,true);assert.ok(disposed>0);assert.equal(runtime.effectRoot.children.length,1);
 c.tacticalThreePersistentFinishUfoFlightPresentation(runtime);assert.equal(runtime.effectRoot.children.length,0);
});
test('bandage-only stabilization preserves HP and spent charges through mission return',()=>{
 const rescuer={id:'r',team:'human',hp:30,maxHp:30,alive:true,tu:60,x:5,y:5,bandageCharges:1,medkitCharges:0,baseSoldier:{bandages:1}};
 const target={id:'t',team:'human',hp:1,maxHp:40,alive:true,downed:true,unconscious:true,bleeding:true,bleedOutRounds:2,x:5,y:6};
 const out=c.tacticalFirstAidUseResult([rescuer,target],'r','t','human',4);
 assert.equal(out.ok,true);assert.equal(out.target.hp,1);assert.equal(out.target.stabilized,true);assert.equal(out.rescuer.bandageCharges,0);
 const saved=c.campaignMedicalLoadoutAfterMission({bandages:1},{state:'Ready',bandageCharges:0,medkitCharges:0,medkitOwned:false});assert.equal(saved.bandages,0);
 assert.equal(c.tacticalFirstAidActionState([rescuer,{...target,downed:false,unconscious:false,bleeding:false,hp:20}],'r','t').ok,false);
});
