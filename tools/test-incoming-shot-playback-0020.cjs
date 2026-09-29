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

function fixture(){const human={id:'h',name:'AEGIS',team:'human',side:'human',x:4,y:4,hp:40,alive:true,visible:true},alien={id:'a',name:'Alien',team:'alien',side:'alien',x:9,y:4,hp:30,alive:true,visible:false,revealed:false};return{round:1,label:'Exchange 1B',soldiers:[human],aliens:[alien],civilians:[],shots:[]};}
test('hidden incoming hits and misses are presented without revealing shooter or mutating snapshots',()=>{
 const c=runtimeContext();for(const hit of [true,false]){const frame=fixture(),before=JSON.stringify(frame);frame.shots=[{fromId:'a',toId:'h',fromX:9,fromY:4,toX:4,toY:4,side:'alien',hit,observable:false}];const snapshot=JSON.stringify(frame),out=c.tacticalShotPresentationFrame(frame);assert.equal(out.shots[0].observable,true);assert.equal(out.aliens[0].visible,false);assert.equal(out.aliens[0].revealed,false);assert.equal(JSON.stringify(frame),snapshot);}
});
test('every incoming shot survives sequencing exactly once, including repeated shooter and orphan records',()=>{
 const c=runtimeContext(),first=fixture(),last=fixture();last.shots=[false,true,false].map((hit,i)=>({id:'shot'+i,fromId:i===2?'orphan':'a',toId:'h',fromX:i===2?13:9,fromY:4,toX:4,toY:4,side:'alien',hit,observable:false}));
 const frames=c.tacticalAiSequentialPlaybackFrames([first,last]);const shots=frames.flatMap(frame=>frame.shots||[]);assert.deepEqual(Array.from(shots,shot=>shot.id),['shot0','shot1','shot2']);assert.ok(frames.every(frame=>(frame.shots||[]).length<=1));assert.ok(shots.every(shot=>shot.observable));assert.ok(frames.every(frame=>frame.aliens[0].visible===false));
});
test('unobserved alien attacks on unknown civilians stay hidden',()=>{const c=runtimeContext(),frame=fixture();frame.shots=[{side:'alien',toId:'unknown',observable:false,hit:true}];assert.equal(c.tacticalAiAuthoritativeShotRecords(frame)[0].observable,false);});
test('manual incoming shots wait for each full animation before next event and state commit',async()=>{
 const c=runtimeContext(),calls=[];await c.tacticalPlayIncomingShotSequence([{shot:{id:1},units:[1]},{shot:{id:2},units:[2]}],shot=>{calls.push('shot'+shot.id);return{totalMs:650};},()=>false,units=>calls.push('commit'+units[0]),async ms=>{calls.push('wait'+ms);});assert.deepEqual(calls,['shot1','wait650','commit1','shot2','wait650','commit2']);
});
test('leaving a mission cancels queued shots and pending state commits',async()=>{
 const c=runtimeContext();let cancelled=false,presented=0,committed=0;await c.tacticalPlayIncomingShotSequence([{shot:{}},{shot:{}}],()=>{presented++;return{totalMs:400};},()=>cancelled,()=>committed++,async()=>{cancelled=true;});assert.equal(presented,1);assert.equal(committed,0);
});
test('effect expiry only clears the same shot and manual wiring retains sequencing',()=>{
 const c=runtimeContext(),source=String(c.TacticalMission);assert.ok(source.includes('current?.id===shotId?null:current'));assert.ok(source.includes('await tacticalPlayIncomingShotSequence'));assert.ok(source.includes('const manualShotEpochRef=useRef(0)'));assert.ok(source.includes('incomingPresentations.push'));
});
