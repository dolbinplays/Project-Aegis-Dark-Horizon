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
const r={id:'r',team:'human',alive:true,hp:40,x:5,y:5};
const p={id:'p',team:'human',alive:true,hp:1,x:4,y:5,downed:true,unconscious:true,stabilized:true,prone:true};
for(const extracted of [false,true])test('drag playback groups patient first in roster with rescuer, extracted='+extracted,()=>{
 const patient={...p,x:6,draggedById:extracted?null:'r',casualtyExtractionRescuerId:extracted?'r':null,rescued:extracted,extracted,casualtyExtracted:extracted};
 const end={soldiers:[patient,{...r,x:7,draggingCasualtyId:extracted?null:'p'}],aliens:[],civilians:[],shots:[],movementTrails:{p:[{x:4,y:5},{x:5,y:5},{x:6,y:5}],r:[{x:5,y:5},{x:6,y:5},{x:7,y:5}]}};
 const frames=c.tacticalAiSequentialPlaybackFrames([{...end,soldiers:[p,r],movementTrails:{}},end]);
 const action=frames.find(f=>f.actionActorId==='r');
 assert.ok(action);assert.deepEqual([...action.actionMovementIds],['r','p']);
 assert.equal(frames.filter(f=>f.actionActorId==='p').length,0);
 assert.equal(action.soldiers.find(u=>u.id==='p').unconscious,true);
 const route=c.tacticalPlaybackMovementPath(action,'p',p,patient,[],[p,r]);
 assert.deepEqual(JSON.parse(JSON.stringify(route)),[{x:5,y:5},{x:6,y:5}]);
});
test('unlinked casualty does not acquire an invented rescuer',()=>{
 assert.equal(c.tacticalPlaybackCasualtyRescuerId(p,p),null);
 assert.equal(c.tacticalPlaybackCasualtyRescuerId({...r,casualtyExtractionRescuerId:'old'},r),null);
});

for(const vipTracker of [false,true])test('escorted civilian moves in escort action even when escort fires, VIP='+vipTracker,()=>{
 const civilian={id:'v',team:'civilian',alive:true,hp:18,x:4,y:5,escortId:'r',vipTracker};
 const enemy={id:'a',team:'alien',alive:true,hp:20,x:12,y:5};
 const end={label:'Human turn',soldiers:[{...r,x:7}],aliens:[enemy],civilians:[{...civilian,x:6}],shots:[{fromId:'r',toId:'a',fromX:7,fromY:5,toX:12,toY:5,side:'human',hit:false,observable:true}],movementTrails:{r:[{x:5,y:5},{x:6,y:5},{x:7,y:5}],v:[{x:4,y:5},{x:5,y:5},{x:6,y:5}]}};
 const frames=c.tacticalAiSequentialPlaybackFrames([{...end,soldiers:[r],civilians:[civilian],shots:[],movementTrails:{}},end]);
 const action=frames.find(f=>f.actionActorId==='r');
 assert.ok(action);assert.deepEqual([...action.actionMovementIds],['r','v']);
 assert.equal(frames.filter(f=>f.actionActorId==='v').length,0);
 assert.deepEqual(JSON.parse(JSON.stringify(c.tacticalPlaybackMovementPath(action,'v',civilian,end.civilians[0],[],[r,civilian]))),[{x:5,y:5},{x:6,y:5}]);
});
test('manual escort and drag advance on the same movement step',()=>{
 const carrier={...r,tu:40,draggingCasualtyId:'p'};
 const patient={...p,draggedById:'r'};
 const civilian={id:'v',team:'civilian',hp:18,alive:true,x:5,y:6,escortId:'r'};
 const moved=c.tacticalAdvanceEscortedCivilians([carrier,patient,civilian],'r',{x:6,y:5},[],null,4,{}, {applyFireTeamFormation:false});
 const dragged=c.tacticalAdvanceDraggedCasualty(moved,'r',{x:5,y:5},null,1);
 assert.equal(dragged.find(u=>u.id==='r').x,6);
 assert.equal(dragged.find(u=>u.id==='p').x,5);
 assert.notDeepEqual({x:dragged.find(u=>u.id==='v').x,y:dragged.find(u=>u.id==='v').y},{x:5,y:6});
 assert.equal(dragged.find(u=>u.id==='p').unconscious,true);
});
