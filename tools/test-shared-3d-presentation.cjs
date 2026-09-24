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



const context=runtimeContext({React:{memo:fn=>{fn.type=fn;return fn;}}});
const evaluate=code=>vm.runInContext(code,context);
test('shared controls retain the existing Build Health contracts',()=>{
 assert.equal(evaluate('tacticalThreeIsoColorControlContractTest()'),true);
 assert.equal(evaluate('tacticalThreeIsoNightBrightnessControlContractTest()'),true);
});
test('color follows all cameras without compounding and resets to neutral',()=>{
 evaluate('var sharedCanvas={style:{filter:""},dataset:{}},sharedRuntime={renderer:{domElement:sharedCanvas}}');
 for(const view of [{},{firstPersonView:true},{thirdPersonView:true},{reactionThirdPersonActor:{id:'h1'}},{}]){
  context.sharedProps={...view,isoColor:175};
  evaluate('tacticalThreePersistentApplyIsoColor(sharedRuntime,sharedProps)');
  assert.equal(context.sharedCanvas.style.filter,'saturate(1.75)');
  assert.equal(evaluate('tacticalThreePersistentApplyIsoColor(sharedRuntime,sharedProps)'),false);
 }
 evaluate('tacticalThreePersistentApplyIsoColor(sharedRuntime,{isoColor:100,thirdPersonView:true})');
 assert.equal(context.sharedCanvas.style.filter,'');
});
test('night and twilight brightness scale each camera baseline while daylight stays neutral',()=>{
 for(const iso of [true,false])for(const phase of ['night','twilight','day']){
  context.phase=phase;context.iso=iso;
  const base=evaluate('tacticalThreeNightPresentationProfile({phase},iso)');
  const low=evaluate('tacticalThreeIsoNightBrightnessPresentation(tacticalThreeNightPresentationProfile({phase},iso),50,phase,iso)');
  const high=evaluate('tacticalThreeIsoNightBrightnessPresentation(tacticalThreeNightPresentationProfile({phase},iso),200,phase,iso)');
  const neutral=evaluate('tacticalThreeIsoNightBrightnessPresentation(tacticalThreeNightPresentationProfile({phase},iso),100,phase,iso)');
  assert.equal(neutral.exposure,base.exposure);
  assert.equal(neutral.isoFillIntensity,0);assert.equal(neutral.isoMaterialLift,0);
  assert.equal(high.localLightScale,base.localLightScale);
  if(phase==='day'){assert.equal(high.exposure,base.exposure);assert.equal(high.isoMaterialLift,0);}
  else{assert.ok(low.exposure<base.exposure);assert.ok(high.exposure>base.exposure);assert.ok(high.isoFillIntensity>0);}
 }
});
test('existing saved preferences survive reload and resets',()=>{
 evaluate('writeTacticalThreeIsoColor(175);writeTacticalThreeIsoNightBrightness(150)');
 const reloaded=runtimeContext();reloaded.localStorage=context.localStorage;
 assert.equal(vm.runInContext('readTacticalThreeIsoColor()',reloaded),175);
 assert.equal(vm.runInContext('readTacticalThreeIsoNightBrightness()',reloaded),150);
 evaluate('writeTacticalThreeIsoColor(100);writeTacticalThreeIsoNightBrightness(100)');
 assert.equal(evaluate('readTacticalThreeIsoColor()'),100);assert.equal(evaluate('readTacticalThreeIsoNightBrightness()'),100);
});

test('camera switches preserve brightness and restore materials on reset or daylight',()=>{
 evaluate('var lamp={isPointLight:true,intensity:2,distance:9,userData:{aegisTacticalPresentationBaseIntensity:2}},emissive={value:0,getHex(){return this.value},setHex(v){this.value=v}},material={color:{getHex:()=>0x335577},emissive,emissiveIntensity:0,userData:{}},lightingRuntime={tacticalLighting:{phase:"night",ambient:0.12,key:0.14},renderer:{domElement:{dataset:{}}},hemiLight:{},keyLight:{},rimLight:{},isoFillLight:{},sharedMaterials:new Set(),scene:{traverse:fn=>{fn(lamp);fn({material})}}}');
 for(const view of [{},{firstPersonView:true},{thirdPersonView:true},{reactionThirdPersonActor:{id:'h'}},{}]){
  context.lightingProps={...view,isoNightBrightness:200};
  evaluate('tacticalThreePersistentApplyNightPresentation(lightingRuntime,lightingProps)');
  assert.equal(context.lightingRuntime.renderer.domElement.dataset.aegisIsoNightBrightness,'200');
  assert.equal(context.lightingRuntime.isoFillLight.intensity,0.36);
  assert.ok(Math.abs(context.material.emissiveIntensity-0.42)<0.0001);
  assert.equal(context.lamp.distance,9);
  // Compare local lights against the same camera at neutral brightness.
  const intensity=context.lamp.intensity;
  evaluate('tacticalThreePersistentApplyNightPresentation(lightingRuntime,{...lightingProps,isoNightBrightness:100})');
  assert.equal(context.lamp.intensity,intensity);
  assert.equal(context.material.emissiveIntensity,0);assert.equal(context.emissive.value,0);
 }
 evaluate('tacticalThreePersistentApplyNightPresentation(lightingRuntime,{firstPersonView:true,isoNightBrightness:200});lightingRuntime.tacticalLighting.phase="day";tacticalThreePersistentApplyNightPresentation(lightingRuntime,{firstPersonView:true,isoNightBrightness:200})');
 assert.equal(context.lightingRuntime.renderer.toneMappingExposure,0.82);
 assert.equal(context.lightingRuntime.isoFillLight.intensity,0);assert.equal(context.material.emissiveIntensity,0);
});
