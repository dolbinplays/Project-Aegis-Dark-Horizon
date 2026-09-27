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









const c=runtimeContext(),THREE=require('../assets/vendor/three.min.js');
c.tacticalThreePersistentRenderFrame=()=>{};
function setup(){
 const canvas={dataset:{},addEventListener(){},setPointerCapture(){},releasePointerCapture(){}};
 const r={THREE,worldFor:(x,y)=>({x,z:y}),thirdPersonCamera:new THREE.PerspectiveCamera(),renderer:{domElement:canvas},onPointerDown(){},onPointerMove(){},endPan(){}};
 r.activeCamera=r.thirdPersonCamera;
 const props={thirdPersonView:true,thirdPersonActor:{id:'a',x:10,y:12,facing:'E',team:'human',hp:40}};
 return{r,props};
}
function relative(r){return r.thirdPersonState.targetPosition.clone().sub(r.thirdPersonState.targetLook);}
function close(a,b){assert.ok(a.distanceTo(b)<1e-9,JSON.stringify([a.toArray(),b.toArray()]));}
test('default camera retains the established shoulder offset',()=>{
 const {r,props}=setup();c.tacticalThreePersistentSetThirdPersonTarget(r,props);
 const dir=vm.runInContext('TACTICAL_DIRECTIONS.find(d=>d.key==="E")',c);
 const f=new THREE.Vector3(dir.vx,0,dir.vy).normalize(),right=new THREE.Vector3(f.z,0,-f.x);
 close(relative(r),f.multiplyScalar(-5.1).addScaledVector(right,1.15).add(new THREE.Vector3(0,1.5,0)));
});
test('right drag and wheel change camera only and carry across actors without drift',()=>{
 const {r,props}=setup(),before=JSON.stringify(props);
 c.tacticalThirdPersonObserverInstallControls(r,()=>props);
 const ev={button:2,pointerId:1,clientX:100,clientY:100,preventDefault(){}};
 r.onPointerDown(ev);r.onPointerMove({...ev,clientX:160,clientY:120});
 r.onObserverWheel({deltaY:120,preventDefault(){}});
 assert.equal(JSON.stringify(props),before);assert.ok(r.thirdPersonObserverOrbit.zoom>1);
 const offset=relative(r);
 for(let i=0;i<20;i++){props.thirdPersonActor={...props.thirdPersonActor,id:'actor-'+i,x:20+i,y:30};c.tacticalThreePersistentSetThirdPersonTarget(r,props);close(relative(r),offset);}
 r.endPan({...ev,type:'pointercancel'});assert.equal(r.observerOrbitPointer,null);
});
test('relative offset rotates with the next actor facing',()=>{
 const {r,props}=setup();r.thirdPersonObserverOrbit={yaw:1,pitch:0.2,zoom:1.2};
 c.tacticalThreePersistentSetThirdPersonTarget(r,props);const distance=relative(r).length();
 props.thirdPersonActor={...props.thirdPersonActor,id:'b',facing:'W'};
 c.tacticalThreePersistentSetThirdPersonTarget(r,props);
 assert.ok(Math.abs(relative(r).length()-distance)<1e-9);
 const opposite=relative(r);props.thirdPersonActor={...props.thirdPersonActor,id:'a',facing:'E'};c.tacticalThreePersistentSetThirdPersonTarget(r,props);
 assert.ok(Math.abs(opposite.x+relative(r).x)<1e-9);assert.ok(Math.abs(opposite.z+relative(r).z)<1e-9);
});
test('reaction and cinematic cameras preserve orbit and reset returns the default',()=>{
 const {r,props}=setup();r.thirdPersonObserverOrbit={yaw:0.8,pitch:0.3,zoom:1.3};
 c.tacticalThreePersistentSetThirdPersonTarget(r,props);const expected=relative(r);
 c.tacticalThreePersistentSetIncomingFireReactionTarget(r,{reactionThirdPersonActor:props.thirdPersonActor,reactionShotFx:{id:'shot',fromX:2,fromY:3}});
 assert.equal(c.tacticalThirdPersonObserverCanOrbit(r,props),false);
 r.activeIncomingFireReaction=false;r.activeCamera=new THREE.PerspectiveCamera();
 assert.equal(c.tacticalThirdPersonObserverCanOrbit(r,props),false);
 r.activeCamera=r.thirdPersonCamera;c.tacticalThreePersistentSetThirdPersonTarget(r,props);close(relative(r),expected);
 c.tacticalThirdPersonObserverReset(r,props);
 assert.deepEqual(JSON.parse(JSON.stringify(r.thirdPersonObserverOrbit)),{yaw:0,pitch:0,zoom:1});
 const base=setup();c.tacticalThreePersistentSetThirdPersonTarget(base.r,base.props);close(relative(r),relative(base.r));
});
test('controls leave FPV and cinematic input alone, and wheel distance stays bounded',()=>{
 const {r,props}=setup();let delegated=0;r.onPointerDown=()=>delegated++;c.tacticalThirdPersonObserverInstallControls(r,()=>props);
 props.thirdPersonView=false;r.onPointerDown({button:2});assert.equal(delegated,1);assert.equal(r.thirdPersonObserverOrbit,undefined);
 props.thirdPersonView=true;
 for(let i=0;i<100;i++)r.onObserverWheel({deltaY:1000,preventDefault(){}});
 assert.equal(r.thirdPersonObserverOrbit.zoom,2.5);
 for(let i=0;i<100;i++)r.onObserverWheel({deltaY:-1000,preventDefault(){}});
 assert.equal(r.thirdPersonObserverOrbit.zoom,0.55);
});
