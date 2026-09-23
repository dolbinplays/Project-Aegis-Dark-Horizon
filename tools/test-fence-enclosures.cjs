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
test('new farm and town battlefields use connected enclosures with open access',()=>{
 for(const kind of ['Farmstead Raid','Town Abduction'])for(const tier of ['small','medium','large']){
 const mission={id:'fence-'+kind+'-'+tier,kind,region:'Europe',threat:2,tacticalMapTier:tier},covers=c.makeBattlefield(mission),fences=covers.filter(x=>x.fenceEnclosureId);
 assert.ok(fences.length>0,kind+' '+tier+' has a safe enclosure');
 for(const fence of fences){assert.equal(c.tacticalCoverUsesHexEdgePlacement(fence),false);assert.ok(fence.fenceLinks.length>=1);for(const link of fence.fenceLinks)assert.ok(fences.some(other=>other.x===link.x&&other.y===link.y));}
 const blockers=c.tacticalHardCoverFootprintKeySet(covers),protectedKeys=c.tacticalBuildingIngressProtectedCellKeys(mission);
 for(const fence of fences){assert.equal(protectedKeys.has(c.tacticalKey(fence.x,fence.y)),false);assert.equal(Boolean(c.tacticalBuildingCellAt(fence.x,fence.y,mission)),false);assert.ok(!['road','lane','stream','irrigation'].includes(c.tacticalFieldFeature(fence.x,fence.y,mission)));}
 for(const first of [...new Map(fences.map(f=>[f.fenceEnclosureId,f])).values()]){
 const gaps=first.fenceAccessGaps;assert.equal(gaps.length,4);for(const gap of gaps)assert.equal(blockers.has(c.tacticalKey(gap.x,gap.y)),false);
 const route=c.tacticalPath(gaps[0],gaps[2],covers,[],128);assert.ok(route?.length>1,'actual pathfinder crosses the enclosure');assert.ok(route.some(cell=>cell.y>Math.min(...gaps.map(g=>g.y))&&cell.y<Math.max(...gaps.map(g=>g.y))),'route enters the plot interior');
 }
 assert.equal(covers.some(x=>x.visual==='fence'&&!x.fenceEnclosureId&&!x.structural&&!x.authoredBuildingLayout),false);
 }
});
test('saved enclosure covers are idempotent and other biomes are untouched',()=>{
 const mission={id:'fence-save',kind:'Farmstead Raid',region:'Europe',tacticalMapTier:'medium'},covers=c.makeBattlefield(mission);
 const restored=JSON.parse(JSON.stringify(covers));
 assert.equal(c.tacticalFenceEnclosurePlan(restored,mission),restored);
 const city={id:'city',kind:'Terror Raid',region:'Europe'},original=[{id:'test',visual:'fence',x:3,y:3}];
 if(c.tacticalBiomeForMission(city).key==='city')assert.equal(c.tacticalFenceEnclosurePlan(original,city),original);
});

test('sync and async generators produce the same fence plan',async()=>{
 const mission={id:'async-fence',kind:'Farmstead Raid',region:'Europe',threat:2,tacticalMapTier:'medium'};
 const sync=c.makeBattlefield(mission),asyncCovers=await c.makeBattlefieldAsync(mission);
 const plan=covers=>JSON.stringify(covers.filter(x=>x.fenceEnclosureId).map(x=>({id:x.id,x:x.x,y:x.y,links:x.fenceLinks,gaps:x.fenceAccessGaps})));
 assert.equal(plan(asyncCovers),plan(sync));
});
test('occupied plots are skipped rather than enclosing buildings, roads or blocking props',()=>{
 const mission={id:'fence-blocked',kind:'Farmstead Raid',region:'Europe',threat:2,tacticalMapTier:'small'},size=c.tacticalGridSizeForMission(mission),covers=[];
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)covers.push({id:x+','+y,x,y,hp:40,kind:'hard',visual:'rock'});
 const result=c.tacticalFenceEnclosurePlan(covers,mission);assert.equal(result.length,covers.length);assert.ok(!result.some(x=>x.fenceEnclosureId));
});
test('enclosure renderer connects the canonical fence model at matching half-cell endpoints',()=>{
 vm.runInContext(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.js'),'utf8'),c);
 class Vector{constructor(){this.set(0,0,0);}set(x,y,z){Object.assign(this,{x,y,z});}}
 class Group{constructor(){this.position=new Vector();this.rotation=new Vector();this.scale=new Vector();this.scale.set(1,1,1);this.userData={};this.children=[];}add(child){this.children.push(child);}}
 class Mesh extends Group{constructor(geometry,material){super();this.geometry=geometry;this.material=material;}}
 const THREE={Group,Mesh,BoxGeometry:class{constructor(...args){this.args=args;}}};
 const cover={x:10,y:10,visual:'fence',fenceEnclosureId:'test',fenceLinks:[{x:11,y:10},{x:10,y:11}]},group=new Group();
 assert.equal(c.tacticalThreeAddFenceEnclosureModel({THREE,group,cover,visual:'fence',materialFor:()=>({})}),true);
 assert.equal(group.children.length,2);
 for(let i=0;i<2;i++){
 const section=group.children[i],origin=c.tacticalThreeWorldForCell(cover.x,cover.y),end=c.tacticalThreeWorldForCell(cover.fenceLinks[i].x,cover.fenceLinks[i].y);
 assert.equal(section.userData.aegisPropLibraryVisual,'fence');
 assert.ok(section.children.length>0);
 assert.ok(Math.abs(section.position.x-(end.x-origin.x)/4)<1e-8);
 assert.ok(Math.abs(section.position.z-(end.z-origin.z)/4)<1e-8);
 }
});
