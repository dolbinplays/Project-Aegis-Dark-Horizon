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


const context=runtimeContext();
const soldier=(id,callsign,status='Ready')=>({id,name:'Soldier '+id,status,currentHealth:100,identity:{callsign}});
const names=roster=>Array.from(roster,s=>s.identity?.callsign);
function uniqueLiving(roster){const keys=roster.filter(context.soldierReservesCallsign).map(s=>context.soldierCallsignKey(s.identity?.callsign)).filter(Boolean);assert.equal(new Set(keys).size,keys.length);}

test('manual assignment checks case, whitespace and display normalization across bases',()=>{
 const roster=[{...soldier('a','Ghost'),baseId:'north'},{...soldier('b',null),baseId:'south'}];
 for(const value of ['ghost',' Ghost ','  GHOST  ','"Ghost"']){const result=context.assignSoldierCallsign(roster,'b',value);assert.equal(result.ok,false);assert.match(result.reason,/Soldier a/);assert.equal(result.roster,roster);}
 assert.equal(context.assignSoldierCallsign(roster,'a',' ghost ').callsign,'ghost');
 const spaced=[soldier('a','Pirate   Detective'),soldier('b',null)];assert.equal(context.assignSoldierCallsign(spaced,'b','pirate detective').ok,false);
});
test('all recoverable states reserve a callsign, even at zero health',()=>{
 for(const status of ['Ready','Wounded','Sickbay','Hospitalized','Unconscious','Downed','Missing','Overflow Recovery','Unknown']){const roster=[{...soldier('a','Ghost',status),currentHealth:0,alive:false},soldier('b',null)];assert.equal(context.assignSoldierCallsign(roster,'b','ghost').ok,false,status);}
});
test('confirmed KIA releases ownership without changing the memorial',()=>{
 const dead=soldier('a','Ghost','KIA'),roster=[dead,soldier('b',null)];const result=context.assignSoldierCallsign(roster,'b','Ghost');assert.equal(result.ok,true);assert.equal(result.roster[0],dead);uniqueLiving(result.roster);
});
test('clear releases ownership, blank edits are rejected and display limit applies before collision checks',()=>{
 const roster=[soldier('a','ABCDEFGHIJKLMNOPQRSTUV'),soldier('b',null)];assert.equal(context.assignSoldierCallsign(roster,'b','ABCDEFGHIJKLMNOPQRSTUVextra').ok,false);
 for(const value of ['', '   ', '""'])assert.equal(context.assignSoldierCallsign(roster,'b',value).ok,false);
 const cleared=context.assignSoldierCallsign(roster,'a',null);assert.equal(cleared.ok,true);assert.equal(context.assignSoldierCallsign(cleared.roster,'b','ABCDEFGHIJKLMNOPQRSTUV').ok,true);
 assert.equal(context.assignSoldierCallsign(roster,'absent','Ghost').ok,false);
});
test('legacy duplicate repair preserves first owner, preexisting suffixes, KIA and unrelated data',()=>{
 const roster=[soldier('dead','Ghost','KIA'),soldier('a','Ghost'),soldier('b',' ghost '),soldier('c','Ghost 2'),soldier('d','GHOST'),soldier('e',null)];const before=JSON.stringify(roster);const repaired=context.normalizeLivingSoldierCallsigns(roster);
 assert.deepEqual(names(repaired),['Ghost','Ghost','ghost 3','Ghost 2','GHOST 4',null]);uniqueLiving(repaired);assert.equal(JSON.stringify(roster),before);assert.equal(repaired[0],roster[0]);assert.equal(repaired[1],roster[1]);assert.equal(JSON.stringify(context.normalizeLivingSoldierCallsigns(repaired)),JSON.stringify(repaired));
});
test('full campaign migration repairs imported and old saves idempotently in save format 4',()=>{
 const game=context.makeNewGameData();game.soldiers[0].identity.callsign='Echo';game.soldiers[1].identity.callsign=' echo ';game.soldiers[2].identity.callsign='Echo 2';game.soldiers[3].status='KIA';game.soldiers[3].identity.callsign='Echo';
 const before=JSON.stringify(game);const migrated=context.migrateCampaignData(game);uniqueLiving(migrated.soldiers);assert.equal(migrated.saveFormatVersion,4);assert.equal(migrated.soldiers[1].identity.callsign,'echo 3');assert.equal(migrated.soldiers[3].identity.callsign,'Echo');assert.match(migrated.reports[0],/Duplicate living-soldier callsigns repaired/);assert.ok(migrated.reports[0].includes(game.soldiers[1].name));assert.equal(JSON.stringify(game),before);
 const roundTrip=context.migrateCampaignData(JSON.parse(JSON.stringify(migrated)));assert.deepEqual(names(roundTrip.soldiers),names(migrated.soldiers));assert.deepEqual(Array.from(roundTrip.reports),Array.from(migrated.reports));assert.deepEqual(Array.from(roundTrip.soldiers,s=>s.id),Array.from(game.soldiers,s=>s.id));
});
test('random names exclude living owners and current name but permit KIA names',()=>{
 const pool=vm.runInContext('SOLDIER_CALLSIGNS',context);const roster=Array.from(pool,(name,i)=>soldier(String(i),name.toLowerCase()));roster[0].status='KIA';const newcomer=soldier('new',null);assert.equal(context.chooseSoldierCallsign(newcomer,roster,10),pool[0]);
 const current=soldier('current',pool[0]);assert.notEqual(context.chooseSoldierCallsign(current,[current],10),pool[0]);
});
test('exhausted random pool generates bounded unique suffixes for hundreds of soldiers',()=>{
 let roster=[];for(let i=0;i<220;i++){const next=soldier(String(i),null);const name=context.chooseSoldierCallsign(next,roster,0);assert.ok(name.length<=22);const assigned=context.assignSoldierCallsign([...roster,next],next.id,name);assert.equal(assigned.ok,true);roster=assigned.roster;}uniqueLiving(roster);assert.ok(names(roster).some(name=>/ 2$/.test(name)));
});
test('long imported duplicates retain bounded names and do not collide with existing suffixes',()=>{
 const long='ABCDEFGHIJKLMNOPQRSTUV';const repaired=context.normalizeLivingSoldierCallsigns([soldier('a',long),soldier('b',long+' tail'),soldier('c',long.slice(0,20)+' 2')]);uniqueLiving(repaired);assert.equal(repaired[1].identity.callsign,long.slice(0,20)+' 3');
});
test('mission award batch reserves each new name and releases this mission casualties regardless of order',()=>{
 const pool=vm.runInContext('SOLDIER_CALLSIGNS',context);const roster=Array.from(pool,(name,i)=>soldier('old'+i,name));const fallen=roster[0];const newcomers=Array.from({length:70},(_,i)=>soldier('new'+i,null));const award=context.createMissionCallsignAllocator([...roster,...newcomers],[fallen.id]);
 const awarded=newcomers.map(s=>({...s,identity:award(s,'test mission')}));assert.equal(awarded[0].identity.callsign,fallen.identity.callsign);uniqueLiving([...roster.map(s=>s===fallen?{...s,status:'KIA'}:s),...awarded]);assert.equal(award(fallen,'fallen in battle').callsign,fallen.identity.callsign);
 assert.equal(context.awardSoldierCallsign(roster[1],'another mission',roster).callsign,roster[1].identity.callsign);
});
test('new recruits start unnamed and future generated duplicates use roster repair',()=>{
 const recruits=Array.from({length:20},()=>context.makeSoldier());assert.ok(recruits.every(s=>s.identity.callsign===null));recruits[0].identity.callsign='Doc';recruits[1].identity.callsign='doc';uniqueLiving(context.normalizeLivingSoldierCallsigns(recruits));
});
test('actual edit handler rejects two claims before React rerenders and reports the owner',()=>{
 let roster=[soldier('a',null),soldier('b',null)],messages=[],blocked=[];const scope={soldiersRef:{current:roster},assignSoldierCallsign:context.assignSoldierCallsign,setSoldiers:fn=>{roster=fn(roster);},completeAction:message=>messages.push(message),blockedAction:(action,reason)=>blocked.push(reason)};
 const start=source.indexOf('function updateSoldierCallsign('),end=source.indexOf('function editSoldierCallsign(',start);vm.createContext(scope);vm.runInContext(source.slice(start,end),scope);scope.updateSoldierCallsign('a','Ghost');scope.updateSoldierCallsign('b',' ghost ');uniqueLiving(roster);assert.equal(roster[1].identity.callsign,null);assert.equal(messages.length,1);assert.match(blocked[0],/Soldier a/);
});
