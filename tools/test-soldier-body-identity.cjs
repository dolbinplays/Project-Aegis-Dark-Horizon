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
test('saved body types share portrait scale and retain identity across reload',()=>{
 for(const [body,expected] of [['lean',0.92],['average',1],['stocky',1.08]]){
 const soldier={id:'body',appearance:{body}},before=JSON.stringify(soldier);
 assert.equal(c.soldierVisualData(soldier).bodyScale,expected);
 assert.equal(c.soldierVisualData(JSON.parse(before)).bodyScale,expected);
 assert.equal(JSON.stringify(soldier),before);
 }
 assert.equal(c.soldierBodyScale({body:'unknown'}),1);
});
test('classic torso and armor expand together without changing height or shared geometry',()=>{
 for(const body of ['lean','average','stocky']){
 const visual=c.soldierVisualData({id:'body',appearance:{body,trophy:'patch'}}),scale=visual.bodyScale;
 const geometry=new THREE.BoxGeometry(0.3,0.4,0.2),before=Array.from(geometry.attributes.position.array);
 const torso=new THREE.Mesh(geometry),plate=new THREE.Mesh(geometry),group=new THREE.Group();
 torso.position.y=0.44;plate.position.set(0,0.55,0.18);group.add(torso,plate);
 const marking=c.addTacticalSoldierUniformMarking(THREE,group,visual,[0.12,0.61,0.275],0.04);
 for(const part of [torso,plate,marking])c.tacticalScaleClassicSoldierBodyPart(part,visual);
 assert.equal(torso.scale.x,scale);assert.equal(torso.scale.z,scale);assert.equal(torso.scale.y,1);
 assert.equal(torso.position.y,0.44);assert.equal(plate.position.z,0.18*scale);
 assert.equal(marking.position.x,0.12*scale);assert.equal(marking.position.z,0.275*scale);
 assert.deepEqual(Array.from(geometry.attributes.position.array),before);
 assert.equal(group.children.length,3);
 }
});
test('body changes invalidate persistent models but HP and TU changes do not',()=>{
 const unit={id:'body',team:'human',hp:40,tu:60,baseSoldier:{id:'body',appearance:{body:'lean'}}};
 const signature=c.tacticalThreePersistentUnitSignature(unit);
 assert.equal(signature,c.tacticalThreePersistentUnitSignature({...unit,hp:20,tu:12}));
 assert.equal(signature,c.tacticalThreePersistentUnitSignature(JSON.parse(JSON.stringify(unit))));
 assert.notEqual(signature,c.tacticalThreePersistentUnitSignature({...unit,baseSoldier:{...unit.baseSoldier,appearance:{body:'stocky'}}}));
});
test('classic and articulated construction retain saved body scale through detail switches',()=>{
 for(const body of ['lean','average','stocky'])for(const detail of ['classic','full','mid','low']){
 const geometry=new THREE.BoxGeometry(0.3,0.4,0.2),runtime={THREE,qualitySettings:{shadows:false,standardMaterials:true},geoCache:new Proxy({}, {get:()=>geometry}),materialCache:new Map(),sharedMaterials:new Set(),sharedGeometries:new Set(),soldierModelStyle:detail==='classic'?'classic':'articulated',articulatedDetailMode:detail};
 const unit={id:'body',team:'human',hp:40,facing:'N',baseSoldier:{id:'body',armor:'Field Suit',appearance:{body,trophy:'patch'}}};
 const node=c.tacticalThreePersistentCreateUnitNode(runtime,unit),expected=c.soldierVisualData(unit.baseSoldier).bodyScale;
 assert.equal(node.position.x,0);assert.equal(node.position.z,0);
 if(detail==='full'||detail==='mid'){
 assert.equal(Math.abs(node.userData.articulatedRoot.scale.x),expected);
 assert.equal(node.userData.articulatedRoot.scale.z,expected);
 }else{
 const torso=node.children.find(child=>child.geometry===geometry);
 assert.equal(torso.scale.x,expected);assert.equal(torso.scale.z,expected);
 const marking=node.children.find(child=>child.userData.soldierUniformMarking);
 assert.equal(marking.position.x,0.12*expected);
 }
 c.tacticalThreePersistentDisposeSubtree(node,runtime);
 }
});
