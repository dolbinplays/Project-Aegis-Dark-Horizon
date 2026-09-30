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

function load(c,name){vm.runInContext(fs.readFileSync(path.join(root,name),'utf8'),c);}
function memoryFolder(files=new Map()){
  let fail=null;
  const dir={name:'Test project',getDirectoryHandle:async()=>dir,removeEntry:async name=>files.delete(name),getFileHandle:async(name,options={})=>{
    if(!files.has(name)&&!options.create)throw Object.assign(Error('Missing'),{name:'NotFoundError'});
    if(!files.has(name))files.set(name,'');
    return{getFile:async()=>({text:async()=>files.get(name)}),createWritable:async()=>({write:async text=>{if(fail===name){fail=null;throw Error('Simulated disk failure');}files.set(name,text);},close:async()=>{},abort:async()=>{}})};
  }};
  files.set('manifest.json',JSON.stringify({currentBuild:'test'}));
  return{dir,files,fail:name=>fail=name};
}
test('project writes merge edits, preserve other content, back up and verify reloadable runtime data',async()=>{
  const c=runtimeContext(),f=memoryFolder();c.showDirectoryPicker=async()=>f.dir;load(c,'assets/runtime/aegis-project-authoring.js');
  const writer=c.AEGIS_PROJECT_AUTHORING;
  await writer.writeSection('poses',{standing:{example:1}});
  await writer.writeSection('buildingLayout',{name:'Saved residence'});
  const saved=JSON.parse(f.files.get('aegis-authored-content.json'));
  assert.equal(saved.poses.standing.example,1);assert.equal(saved.buildingLayout.name,'Saved residence');
  assert.ok(f.files.get('aegis-authored-content.json.backup').includes('standing'));
  vm.runInContext(f.files.get('aegis-authored-content.js'),c);
  assert.equal(c.AEGIS_AUTHORED_CONTENT.buildingLayout.name,'Saved residence');
});
test('partial write failure rolls back the pair instead of leaving JSON and runtime JS inconsistent',async()=>{
  const c=runtimeContext(),f=memoryFolder(new Map([['a.json','old-json'],['a.js','old-js']]));load(c,'assets/runtime/aegis-project-authoring.js');f.fail('a.js');
  await assert.rejects(c.AEGIS_PROJECT_AUTHORING.writeFiles(f.dir,[['a.json','new-json'],['a.js','new-js']]),/Previous project files restored/);
  assert.equal(f.files.get('a.json'),'old-json');assert.equal(f.files.get('a.js'),'old-js');
});
test('saved pose drives actual runtime pose authority while invalid data falls back and facing stays separate',()=>{
  const c=runtimeContext();load(c,'assets/runtime/aegis-authored-content-runtime.js');
  const original=JSON.parse(JSON.stringify(c.tacticalArticulatedSoldierPoseSpec('standing')));delete original.pose;
  const authored={...original,rootPosition:[0,.8,0],torso:[.2,0,0]};
  c.AEGIS_AUTHORED_CONTENT={schema:'aegis-authored-content-v1',poses:{standing:authored,kneeling:{rootPosition:[NaN,0,0]}}};
  vm.runInContext('TACTICAL_ARTICULATED_POSE_SPEC_CACHE.clear()',c);
  assert.equal(c.tacticalArticulatedSoldierPoseSpec('standing').rootPosition[1],.8);
  assert.equal(c.tacticalArticulatedSoldierPoseSpec('kneeling').rootPosition[1],.43);
  assert.equal('facing' in c.tacticalArticulatedSoldierPoseSpec('standing'),false);
  assert.throws(()=>c.AEGIS_AUTHORED_RUNTIME.validatePose({rootPosition:[Infinity,0,0]}));
});
test('Skyranger uses editable geometry without changing placement, ramp metadata or night lighting',()=>{
  const c=runtimeContext();load(c,'assets/runtime/aegis-authored-content-runtime.js');load(c,'assets/data/aegis-prop-library.js');
  const def=c.AEGIS_PROP_LIBRARY.props.find(p=>p.visualKey==='vehicle-skyranger');assert.equal(def.components.length,30);
  def.components.find(p=>p.name==='left-wing').position[1]=3.1;
  const placement={rampCenter:{x:7,y:9},bodySign:1},before=JSON.stringify(placement);
  const model=c.addTacticalSkyrangerThreeModel(THREE,new THREE.Group(),(x,y)=>({x,z:y}),placement,(_,color)=>new THREE.MeshBasicMaterial({color}),{tacticalLighting:{phase:'night'}});
  assert.equal(model.getObjectByName('left-wing').position.y,3.1);
  assert.ok(model.getObjectByName('tapered-nose').geometry.attributes.position.count>=8);
  assert.equal(model.getObjectByName('rear-ramp').userData.rampCell.x,7);
  let lights=0;model.traverse(n=>{if(n.isPointLight)lights++;});assert.equal(lights,3);
  assert.equal(JSON.stringify(placement),before);
});
test('old browser-local prop libraries inherit newly shipped Skyranger without losing previous edits',()=>{
  const c=runtimeContext();c.location.pathname='/AEGIS_Prop_Editor_CURRENT.html';
  c.localStorage.setItem('aegis-prop-live-library-v1',JSON.stringify({schema:'aegis-prop-library-v1',props:[{visualKey:'vehicle-sedan',name:'My sedan',components:[]}]}));
  load(c,'assets/data/aegis-prop-library.js');
  assert.ok(c.AEGIS_PROP_LIBRARY.props.some(p=>p.visualKey==='vehicle-skyranger'));
  assert.equal(c.AEGIS_PROP_LIBRARY.props.find(p=>p.visualKey==='vehicle-sedan').name,'My sedan');
});
test('edited editor scripts remain syntactically valid',()=>{
  for(const file of ['AEGIS_Prop_Editor_v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH.html','AEGIS_Articulated_Pose_Editor_v0.26.08.26.0033_APPROVED_ARTICULATED_POSE_SET_PATCH.html']){
    const html=fs.readFileSync(path.join(root,file),'utf8');for(const match of html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi))new vm.Script(match[1],{filename:file});
  }
});
