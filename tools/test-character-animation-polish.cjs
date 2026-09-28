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
function runtime(){return {THREE,qualitySettings:{shadows:false,standardMaterials:true},materialCache:new Map(),sharedMaterials:new Set(),sharedGeometries:new Set()};}
function model(r,unit,visual=c.tacticalArticulatedCivilianAppearance(unit),detail='full'){
 const group=new THREE.Group();c.tacticalThreePersistentAddArticulatedCivilianModel(r,group,unit,visual,unit.hp>0,detail);return group;
}
function part(node,name){let found;node.traverse(p=>{if(p.name==='civilian-part-'+name)found=p;});return found;}

test('pose specs are cached and immutable',()=>{
 const a=c.tacticalArticulatedSoldierPoseSpec('attention'),b=c.tacticalArticulatedSoldierPoseSpec('attention');assert.equal(a,b);assert.ok(Object.isFrozen(a));assert.ok(Object.isFrozen(a.leftHip));
 assert.equal(c.tacticalArticulatedSoldierPoseSpec('bad'),c.tacticalArticulatedSoldierPoseSpec('standing'));
});
test('stopping frightened VIP walk preserves cover kneel for dresses and pantsuits',()=>{
 for(const outfitStyle of ['dress','trousers']){
 const r=runtime(),unit={id:'kneel',vip:true,hp:30,panic:true},v={...c.tacticalArticulatedCivilianAppearance(unit),presentation:'female',outfitStyle},node=model(r,unit,v);
 r.unitNodes=new Map([[unit.id,node]]);node.userData.alive=true;node.userData.walking=true;
 c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,180);assert.equal(node.userData.walkAnimationActive,true);
 c.tacticalThreeApplyArticulatedCivilianPresentation(node,{pose:'civilianFearCover',walkPose:'victory',frightened:true,takingCover:true});node.userData.walking=false;
 const joints=node.userData.articulatedRoot.userData.joints,expected=c.tacticalArticulatedSoldierPoseSpec('kneeling');
 c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,200);
 assert.equal(node.userData.articulatedPose,'civilianFearCover');assert.equal(joints.leftHip.rotation.x,expected.leftHip[0]);assert.equal(joints.leftKnee.rotation.x,expected.leftKnee[0]);assert.equal(node.userData.civilianTakingCover,true);assert.equal(node.userData.walkAnimationActive,false);
 }
});
test('idle animation skips pose lookup and walking retains existing leg cycle',()=>{
 const r=runtime(),unit={id:'idle',vip:true,hp:30},node=model(r,unit);r.unitNodes=new Map([[unit.id,node]]);let reads=0;const original=c.tacticalArticulatedSoldierPoseSpec;c.tacticalArticulatedSoldierPoseSpec=(...args)=>{reads++;return original(...args);};
 try{
 for(let i=0;i<100;i++)c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,i*16);assert.equal(reads,0);
 node.userData.walking=true;node.userData.alive=true;const phase=240;c.tacticalThreePersistentAnimateArticulatedSoldierWalk(r,phase);
 const base=original('attention'),cycle=c.tacticalArticulatedSoldierWalkCycle(phase,0),j=node.userData.articulatedRoot.userData.joints;
 assert.equal(j.leftHip.rotation.x,base.leftHip[0]+cycle.stride*0.34);assert.equal(j.rightHip.rotation.x,base.rightHip[0]-cycle.stride*0.34);
 }finally{c.tacticalArticulatedSoldierPoseSpec=original;}
});
test('VIP hair caps cover the crown instead of letting the scalp poke through',()=>{
 const r=runtime();for(const hairStyle of ['short','swept','bob','bun']){
 const parts=c.tacticalVipHairParts(r,{hairStyle}),cap=new THREE.Mesh(parts[0].geometry,new THREE.MeshBasicMaterial({side:THREE.DoubleSide}));cap.position.set(...parts[0].position);cap.scale.set(...parts[0].scale);cap.rotation.set(...parts[0].rotation);cap.updateMatrixWorld(true);
 const ray=new THREE.Raycaster(new THREE.Vector3(0,1,0),new THREE.Vector3(0,-1,0)),hit=ray.intersectObject(cap)[0];
 assert.ok(hit&&hit.point.y>0.115+0.155*1.04,hairStyle+' covers crown');
 }
});
