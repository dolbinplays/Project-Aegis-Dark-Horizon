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
test('VIP business palette is diverse, coordinated and deterministic through playback and reload',()=>{
 const tops=new Set();for(let i=0;i<300;i++){
 const unit={id:'vip-'+i,team:'civilian',vip:true,hp:30,tu:40},before=JSON.stringify(unit),v=c.tacticalArticulatedCivilianAppearance(unit);tops.add(v.top);
 assert.equal(v.top,v.trousers);assert.equal(v.isUnarmed,true);
 assert.equal(JSON.stringify(v),JSON.stringify(c.tacticalArticulatedCivilianAppearance({...unit,panic:true,escortId:'soldier',x:3,y:4,tu:2})));
 assert.equal(JSON.stringify(v),JSON.stringify(c.tacticalArticulatedCivilianAppearance(JSON.parse(before))));
 assert.equal(JSON.stringify(unit),before);
 }
 assert.equal(tops.size,6);
});
test('head geometry is shared across outfits and body sizes; torso ignores skin and hair',()=>{
 const r=runtime(),unit={id:'vip',vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit),a=model(r,unit,v);
 const b=model(r,unit,{...v,top:0x123456,trousers:0x123456,bodyScale:1.1});
 assert.equal(part(a,'head-assembly').geometry,part(b,'head-assembly').geometry);
 assert.notEqual(part(a,'torso-assembly').geometry,part(b,'torso-assembly').geometry);
 const d=model(r,unit,{...v,skin:0xbd7e56,hair:0x123456});
 assert.equal(part(a,'torso-assembly').geometry,part(d,'torso-assembly').geometry);
 assert.notEqual(part(a,'head-assembly').geometry,part(d,'head-assembly').geometry);
 const count=r.soldierGeometryCache.size;model(r,unit,v,'mid');assert.equal(r.soldierGeometryCache.size,count);
});
test('wardrobe models retain unarmed joints, mesh budget and authoritative fear/death poses',()=>{
 const r=runtime();for(const panic of [false,true])for(const hp of [30,0]){
 const unit={id:'vip-'+panic,hp,panic,vip:true},node=model(r,unit),before=JSON.stringify(unit);let meshes=0;
 node.traverse(p=>{if(p.isMesh)meshes++;assert.ok(!/weapon/i.test(p.name));});assert.equal(meshes,10);
 assert.ok(node.userData.articulatedRoot.userData.joints.leftKnee);assert.ok(node.userData.articulatedRoot.userData.joints.rightKnee);
 const state=c.tacticalArticulatedCivilianPresentationState(unit,{movingUnit:{id:unit.id},covers:[]});
 c.tacticalThreeApplyArticulatedCivilianPresentation(node,state);
 assert.equal(node.userData.articulatedPose,hp===0?'proneDead':panic?'victory':'attention');
 assert.equal(JSON.stringify(unit),before);
 }
});
test('VIP and ordinary civilian materials do not depend on creation order',()=>{
 for(const firstVip of [true,false]){
 const r=runtime(),a=model(r,{id:'first',vip:firstVip,hp:30}),b=model(r,{id:'second',vip:!firstVip,hp:30});
 assert.equal(part(a,'torso-assembly').material.metalness,firstVip?0.035:0.01);
 assert.equal(part(b,'torso-assembly').material.metalness,firstVip?0.01:0.035);
 }
});
test('both VIP presentation variants are stable and share the walking rig without added meshes',()=>{
 const variants=new Set(),r=runtime();
 for(let i=0;i<100;i++){
 const unit={id:'presentation-'+i,vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit);variants.add(v.presentation);
 assert.equal(c.tacticalArticulatedCivilianAppearance(JSON.parse(JSON.stringify(unit))).presentation,v.presentation);
 const node=model(r,unit,v,i%2?'mid':'full'),torso=node.userData.articulatedRoot.userData.joints.torso;
 assert.equal(torso.scale.x,v.presentation==='female'?0.94:1);
 let count=0;node.traverse(p=>{if(p.isMesh)count++;});assert.equal(count,10);
 assert.ok(node.userData.articulatedRoot.userData.joints.leftHip);assert.ok(node.userData.articulatedRoot.userData.joints.rightAnkle);
 }
 assert.deepEqual([...variants].sort(),['female','male']);
});
test('female VIP blouse and bob are separate cached geometry, without changing rescue authority',()=>{
 const r=runtime(),unit={id:'wardrobe',vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit);
 const male=model(r,unit,{...v,presentation:'male',hairStyle:'short'}),female=model(r,unit,{...v,presentation:'female',hairStyle:'bob'});
 assert.notEqual(part(male,'head-assembly').geometry,part(female,'head-assembly').geometry);
 assert.notEqual(part(male,'torso-assembly').geometry,part(female,'torso-assembly').geometry);
 assert.ok(part(female,'torso-assembly').geometry.attributes.position.count<part(male,'torso-assembly').geometry.attributes.position.count,'blouse omits tie');
 assert.ok(part(female,'head-assembly').geometry.attributes.position.count>part(male,'head-assembly').geometry.attributes.position.count,'bob joins existing head mesh');
});
test('five VIP hairstyles are deterministic and available across presentation variants',()=>{
 const styles={male:new Set(),female:new Set()};
 for(let i=0;i<500;i++){
 const unit={id:'hair-'+i,vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit);
 styles[v.presentation].add(v.hairStyle);
 assert.equal(c.tacticalArticulatedCivilianAppearance({...unit,panic:true,escortId:'escort',x:8}).hairStyle,v.hairStyle);
 assert.equal(c.tacticalArticulatedCivilianAppearance(JSON.parse(JSON.stringify(unit))).hairStyle,v.hairStyle);
 }
 for(const set of Object.values(styles))assert.deepEqual([...set].sort(),['bald','bob','bun','short','swept']);
 assert.equal(c.tacticalArticulatedCivilianAppearance({id:'ordinary',vip:false}).hairStyle,'short');
});
test('hairstyles have distinct bounded head geometry and reuse it between full and mid models',()=>{
 const r=runtime(),unit={id:'hair',vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit),shapes=new Set();
 for(const hairStyle of ['short','swept','bob','bun','bald']){
 const visual={...v,hairStyle},node=model(r,unit,visual),head=part(node,'head-assembly'),geometry=head.geometry;
 shapes.add(Buffer.from(geometry.attributes.position.array.buffer).toString('base64'));
 for(const x of geometry.attributes.position.array)assert.ok(Number.isFinite(x)&&Math.abs(x)<0.5);
 assert.ok(geometry.attributes.position.count<1000);
 const count=r.soldierGeometryCache.size,mid=model(r,unit,visual,'mid');
 assert.equal(part(mid,'head-assembly').geometry,geometry);assert.equal(r.soldierGeometryCache.size,count);
 let meshes=0;node.traverse(p=>{if(p.isMesh)meshes++;});assert.equal(meshes,10);
 const parent=head.parent;parent.rotation.y=1;node.updateMatrixWorld(true);assert.ok(head.matrixWorld.elements.every(Number.isFinite));
 }
 assert.equal(shapes.size,5);
 const empty=runtime();assert.equal(c.tacticalVipHairParts(empty,{hairStyle:'bald'}).length,0);assert.equal(empty.soldierGeometryCache,undefined);
});
test('hair geometry remains shared across gender and wardrobe and owned by runtime disposal',()=>{
 const r=runtime(),unit={id:'hair',vip:true,hp:30},v=c.tacticalArticulatedCivilianAppearance(unit),a=model(r,unit,{...v,presentation:'male',hairStyle:'bun'}),b=model(r,unit,{...v,presentation:'female',hairStyle:'bun',top:0x123456});
 const geo=part(a,'head-assembly').geometry;assert.equal(geo,part(b,'head-assembly').geometry);
 let disposed=0;geo.addEventListener('dispose',()=>disposed++);c.tacticalThreePersistentDisposeSubtree(a,r);assert.equal(disposed,0,'removing one unit cannot dispose shared head');
 assert.ok(r.sharedGeometries.has(geo));for(const g of r.sharedGeometries)g.dispose();assert.equal(disposed,1);
});
