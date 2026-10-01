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
  vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-department-heads.js'),'utf8'),context);
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}

function fixture(){
 const c=runtimeContext(),d=c.makeNewGameData({openingIncidentSeed:42});
 const api=vm.runInContext('({normalizeBaseInventories,localBaseInventoryForBase,aggregateBaseInventories,soldierInTransit,soldierStationedAtBase,squadStationingBaseId,squadCapacity,personnelUsed,uid,supplyCatalogEntry,marketBuyPrice,storageStatusForInventory,isRemovableInventoryItem,changeSoldierMedkitState,soldierBandageCapacity,soldierBandageCount,refillSoldierBandagesState,tacticalFieldMedkitCapacity,soldierMedicalCharges,refillSoldierMedkitState,capacity:()=>100})',c);
 d.activeMission=null;d.skyrangerTravels=[];d.funds=5000;d.departmentHeads=c.AEGIS_DEPARTMENT_HEADS.normalize();
 for(const role of ['quartermaster','personnel'])Object.assign(d.departmentHeads[role],{hired:true,baseId:d.bases[0].id,squadIds:[d.squads[0].id]});
 return{c,d,api,run:()=>c.AEGIS_DEPARTMENT_HEADS.run(d,api)};
}
test('old saves default to unhired, disabled heads; saved policy survives normalization',()=>{const f=fixture();assert.equal(f.c.AEGIS_DEPARTMENT_HEADS.normalize().personnel.enabled,false);f.d.departmentHeads.personnel.enabled=true;assert.equal(f.c.AEGIS_DEPARTMENT_HEADS.normalize(JSON.parse(JSON.stringify(f.d.departmentHeads))).personnel.enabled,true);});
test('Personnel fills local squads and counts pending recruits without duplicate orders',()=>{
 const f=fixture();Object.assign(f.d.departmentHeads.personnel,{enabled:true,reserves:2,budget:1000});
 const r=f.run();assert.equal(r.squads[0].soldierIds.length,6);assert.equal(r.pendingRecruitments.length,2);assert.equal(r.funds,4760);assert.ok(r.pendingRecruitments.every(p=>p.daysLeft===3&&p.baseId===f.d.bases[0].id));
 Object.assign(f.d,r);const second=f.run();assert.equal(second.pendingRecruitments.length,2);assert.equal(second.funds,4760);
});
test('Personnel observes treasury, budget and housing limits including department heads',()=>{
 for(const constraint of ['floor','budget','housing']){const f=fixture();Object.assign(f.d.departmentHeads.personnel,{enabled:true,reserves:4,budget:1000});if(constraint==='floor')f.d.departmentHeads.personnel.treasuryFloor=5000;if(constraint==='budget')f.d.departmentHeads.personnel.budget=119;if(constraint==='housing')f.api.capacity=()=>13;const r=f.run();assert.equal(r.pendingRecruitments.length,0,constraint);assert.equal(r.funds,5000);}
});
test('Quartermaster refills persistent supplies with real inventory accounting and market prices',()=>{
 const f=fixture();f.d.squads[0].soldierIds=[f.d.soldiers[0].id];f.d.soldiers[0]={...f.d.soldiers[0],bandages:0,medkit:true,medicalCharges:0};f.d.tech.push('Field Medkits');
 f.d.baseInventories[f.d.bases[0].id]=f.c.normalizeGearInventory({Bandage:0,'Medical Supplies':0});
 Object.assign(f.d.departmentHeads.quartermaster,{enabled:true,autoBuy:true,budget:1000,stock:{}});
 const original=JSON.stringify(f.d);const r=f.run();assert.equal(JSON.stringify(f.d),original,'planner must not mutate input');const s=r.soldiers[0];assert.equal(s.bandages,f.c.soldierBandageCapacity(s));assert.equal(s.medicalCharges,f.c.tacticalFieldMedkitCapacity(s));assert.equal(r.funds,5000-s.bandages*f.c.marketBuyPrice('Bandage')-s.medicalCharges*f.c.marketBuyPrice('Medical Supplies'));
 Object.assign(f.d,r);const again=f.run();assert.equal(again.funds,r.funds);
});
test('Quartermaster cannot bypass research, stores, or market availability',()=>{
 const f=fixture();f.d.squads[0].soldierIds=[f.d.soldiers[0].id];f.d.soldiers[0].bandages=0;
 Object.assign(f.d.departmentHeads.quartermaster,{enabled:true,autoBuy:true,weapon:'Plasma Lance',medkit:'issue',stock:{Bandage:20}});f.api.storageStatusForInventory=()=>({over:true});const r=f.run();assert.equal(r.funds,5000);assert.equal(r.soldiers[0].equipment,f.d.soldiers[0].equipment);assert.ok(r.notes.some(n=>/research/.test(n)));
});
test('departments cannot change deployed campaigns',()=>{const f=fixture();f.d.departmentHeads.personnel.enabled=true;f.d.activeMission={id:'live'};assert.equal(f.run().blocked,true);f.d.activeMission=null;f.d.skyrangerTravels=[{id:'returning'}];assert.equal(f.run().blocked,true);});
test('loadout exchanges return old gear and do not manufacture advanced equipment',()=>{
 const f=fixture(),s=f.d.soldiers[0];f.d.squads[0].soldierIds=[s.id];f.d.tech.push('Laser Weapons');
 f.d.baseInventories[f.d.bases[0].id]=f.c.normalizeGearInventory({'Laser Carbine':1});
 Object.assign(f.d.departmentHeads.quartermaster,{enabled:true,autoBuy:true,weapon:'Laser Carbine',bandages:false,refillMedkits:false,stock:{}});
 const old=s.equipment,before=f.d.baseInventories[f.d.bases[0].id][old]||0,r=f.run();assert.equal(r.soldiers[0].equipment,'Laser Carbine');assert.equal(r.baseInventories[f.d.bases[0].id]['Laser Carbine'],0);assert.equal(r.baseInventories[f.d.bases[0].id][old],before+1);assert.equal(r.funds,5000);
 f.d.baseInventories[f.d.bases[0].id]['Laser Carbine']=0;const missing=f.run();assert.equal(missing.soldiers[0].equipment,old);assert.equal(missing.funds,5000);
});
test('disabled policies do not spend, recruit, or issue supplies',()=>{const f=fixture();const before=JSON.stringify(f.d);const r=f.run();assert.equal(r.funds,f.d.funds);assert.equal(r.pendingRecruitments.length,0);assert.deepEqual(r.soldiers,f.d.soldiers);assert.equal(JSON.stringify(f.d),before);});

