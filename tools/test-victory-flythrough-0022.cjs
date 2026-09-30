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

function fixture(){const c=runtimeContext(),units=[{id:'b',name:'Bravo',team:'human',hp:30,x:3,y:2},{id:'a',name:'Alpha',team:'human',hp:30,x:2,y:2}],runtime={THREE,width:1200,height:800,cinematicCamera:new THREE.PerspectiveCamera(),coverRoot:new THREE.Group(),unitNodes:new Map(units.map(u=>[u.id,new THREE.Group()])),worldFor:(x,y)=>({x,z:y}),victoryFlythroughProps:{victoryDance:true,units,explored:new Set(['2,2','3,2'])}};c.tacticalThreePersistentUpdateCamera=()=>runtime.restored=true;c.tacticalThreePersistentUpdateUnits=()=>{};return{c,runtime,units};}
test('roster is stable and excludes dead, unconscious, downed and extracted soldiers',()=>{const{c,units}=fixture();const before=JSON.stringify(units),invalid=['downed','unconscious','extracted','rescued'].map((key,i)=>({...units[0],id:'invalid'+i,[key]:true}));assert.deepEqual(Array.from(c.tacticalVictoryFlythroughRoster([...units,...invalid,{...units[0],id:'dead',hp:0}]),u=>u.id),['a','b']);assert.equal(JSON.stringify(units),before);});
test('no flythrough before victory or while final shot/movement is pending',()=>{for(const busy of [{victoryDance:false},{shotFx:{id:'final'}},{movingUnit:{id:'a'}}]){const{c,runtime}=fixture();Object.assign(runtime.victoryFlythroughProps,busy);c.tacticalVictoryFlythroughStep(runtime,0);assert.equal(runtime.victoryFlythrough,undefined);}});
test('visits each eligible actor once then restores camera without changing units',()=>{const{c,runtime,units}=fixture(),before=JSON.stringify(units);c.tacticalVictoryFlythroughStep(runtime,0);assert.equal(runtime.victoryFlythrough.actorId,'a');for(let now=250;now<=2500;now+=250)c.tacticalVictoryFlythroughStep(runtime,now);assert.equal(runtime.victoryFlythrough.actorId,'b');for(let now=2750;now<=5000;now+=250)c.tacticalVictoryFlythroughStep(runtime,now);assert.equal(runtime.victoryFlythrough.done,true);assert.equal(runtime.restored,true);assert.equal(JSON.stringify(units),before);c.tacticalVictoryFlythroughStep(runtime,5100);assert.equal(runtime.victoryFlythrough.done,true);});
test('invalidated actors skip and empty roster cannot stall results',()=>{const{c,runtime,units}=fixture();c.tacticalVictoryFlythroughStep(runtime,0);units[0].unconscious=true;for(let now=250;now<=2500;now+=250)c.tacticalVictoryFlythroughStep(runtime,now);assert.equal(runtime.victoryFlythrough.done,true);const empty=fixture();empty.runtime.victoryFlythroughProps.units=[];empty.c.tacticalVictoryFlythroughStep(empty.runtime,0);assert.equal(empty.runtime.victoryFlythrough.done,true);});
test('reduced motion cuts between short holds; unexplored gaps never fly through',()=>{const{c,runtime}=fixture();c.tacticalVictoryCelebrationReducedMotion=()=>true;c.tacticalVictoryFlythroughStep(runtime,0);for(let now=250;now<=1000;now+=250)c.tacticalVictoryFlythroughStep(runtime,now);assert.equal(runtime.victoryFlythrough.actorId,'b');assert.equal(runtime.victoryFlythrough.travel,false);const f=fixture();f.runtime.victoryFlythroughProps.explored=new Set();f.c.tacticalVictoryFlythroughStep(f.runtime,0);for(let now=250;now<=2500;now+=250)f.c.tacticalVictoryFlythroughStep(f.runtime,now);assert.equal(f.runtime.victoryFlythrough.travel,false);});
test('skip and deadline complete idempotently and remove controls',()=>{const{c,runtime}=fixture();let removed=0;c.tacticalVictoryFlythroughStep(runtime,0);runtime.victoryFlythroughPanel={remove:()=>removed++};c.tacticalVictoryFlythroughFinish(runtime);c.tacticalVictoryFlythroughFinish(runtime);assert.equal(removed,1);assert.equal(runtime.victoryFlythrough.done,true);const f=fixture();f.c.tacticalVictoryFlythroughStep(f.runtime,0);f.c.tacticalVictoryFlythroughStep(f.runtime,120001);assert.equal(f.runtime.victoryFlythrough.done,true);});
test('camera uses actual obstruction recovery and does not enter a close wall',()=>{const{c,runtime}=fixture();const wall=new THREE.Mesh(new THREE.BoxGeometry(10,10,.2),new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));wall.position.set(2,1,2.7);runtime.coverRoot.add(wall);runtime.coverRoot.updateMatrixWorld(true);c.tacticalVictoryFlythroughStep(runtime,0);assert.ok(runtime.cinematicCamera.position.z<2.6);});
test('close visits isolate and scale weapon effects then restore the full celebration',()=>{const{c,runtime}=fixture();runtime.victoryCelebrationEffects=new Map(['a','b'].map(unitId=>[unitId,{unitId,scale:2.85,group:new THREE.Group()}]));c.tacticalVictoryFlythroughStep(runtime,0);assert.equal(runtime.victoryCelebrationEffects.get('a').group.visible,true);assert.equal(runtime.victoryCelebrationEffects.get('b').group.visible,false);assert.ok(runtime.victoryCelebrationEffects.get('a').group.scale.x<.25);c.tacticalVictoryFlythroughFinish(runtime);for(const effect of runtime.victoryCelebrationEffects.values()){assert.equal(effect.group.visible,true);assert.equal(effect.group.scale.x,1);}});
