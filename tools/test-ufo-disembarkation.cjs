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
const craft=c.tacticalAlienDropshipCraft({x:16,y:10},32);
const hull=c.tacticalAlienDropshipCovers(craft);
test('disembarkation uses unique connected cells clear of all obstacles and units',()=>{
 const props=[{id:'prop',x:15,y:9,hp:100,kind:'hard'},{id:'wall',x:16,y:9,hp:100,kind:'hard'}];
 const occupied=new Set(['17,9','15,10']);const before=JSON.stringify([...occupied]);
 const cells=c.tacticalAlienDropshipDisembarkationCells(craft,20,[...hull,...props],occupied);
 assert.equal(cells.length,20);assert.equal(new Set(cells.map(v=>v.x+','+v.y)).size,20);
 for(const cell of cells){assert.equal(c.isHardCoverAt([...hull,...props],cell.x,cell.y),false);assert.equal(occupied.has(cell.x+','+cell.y),false);}
 assert.equal(JSON.stringify([...occupied]),before);
 assert.deepEqual(JSON.parse(JSON.stringify(cells)),JSON.parse(JSON.stringify(c.tacticalAlienDropshipDisembarkationCells(craft,20,[...hull,...props],occupied))));
});
test('sealed ramps cannot spawn aliens outside their enclosing wall',()=>{
 const ramps=new Set(craft.rampCells.map(v=>v.x+','+v.y));const wall=new Map();
 for(const ramp of craft.rampCells)for(const cell of c.tacticalNeighbors(ramp.x,ramp.y,32))if(!ramps.has(cell.x+','+cell.y))wall.set(cell.x+','+cell.y,{...cell,id:'seal-'+cell.x+'-'+cell.y,hp:100,kind:'hard'});
 const cells=c.tacticalAlienDropshipDisembarkationCells(craft,10,[...hull,...wall.values()]);
 assert.equal(cells.length,3);assert.ok(cells.every(cell=>ramps.has(cell.x+','+cell.y)));
});
test('blocked ramps produce no invented arrival cells',()=>{
 const occupied=new Set(craft.rampCells.map(v=>v.x+','+v.y));
 assert.equal(c.tacticalAlienDropshipDisembarkationCells(craft,4,hull,occupied).length,0);
});
test('actual arrival commits the requested wave with no overlapping or blocked cells',()=>{
 const mission={id:'disembark',kind:'Alien Incident',gridSize:64,threat:2};
 const out=c.tacticalAlienReinforcementArrival({state:{waveCount:0,called:true,arrivalRound:5,arrivalTotalCount:12},mission,round:5});
 assert.equal(out.landed,true);assert.equal(out.reinforcements.length,12);
 assert.equal(new Set(out.reinforcements.map(v=>v.x+','+v.y)).size,12);
 assert.ok(out.reinforcements.every(v=>!c.isHardCoverAt(out.covers,v.x,v.y)));
 assert.equal(out.state.dropship.deliveryLanding.arrivalUnitIds.length,12);
});
