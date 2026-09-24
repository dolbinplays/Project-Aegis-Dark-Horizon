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



const c=runtimeContext(),copy=x=>JSON.parse(JSON.stringify(x));
const medic={id:'m',name:'Medic',team:'human',alive:true,hp:40,maxHp:40,tu:60,maxTu:60,x:5,y:5,medkitCharges:2};
const civilian={id:'v',name:'VIP',team:'civilian',alive:true,hp:10,maxHp:18,tu:0,x:4,y:5,vipTracker:true,escortId:'m'};
const wound=()=>c.tacticalResolveCivilianCasualtyHit(civilian,11,{id:'a'},1,0).unit;
const assess=()=>c.tacticalFirstAidUseResult([medic,wound()],'m','v','human',1);
const stabilize=()=>c.tacticalFirstAidUseResult(assess().units,'m','v','human',1);
const placement={crafts:[{rampCells:[{x:5,y:5},{x:6,y:5}]}]};
test('severe civilian hits have bounded survival; overkill and repeated fatal hits never revive',()=>{
 const u=wound();assert.equal(u.team,'civilian');assert.equal(u.downed,true);assert.equal(u.casualtyCondition,'unknown');assert.equal(u.escortId,null);
 assert.equal(c.tacticalResolveCivilianCasualtyHit(civilian,11,null,1,.99).killed,true);
 assert.equal(c.tacticalResolveCivilianCasualtyHit(civilian,40,null,1,0).killed,true);
 assert.equal(c.tacticalResolveCivilianCasualtyHit(u,5,null,2,0).killed,true);
 assert.equal(c.tacticalResolveCivilianCasualtyHit(civilian,3,null,1,0).unit.hp,7);
});
test('assessment costs only TU, stabilization costs one charge and never revives or rescues',()=>{
 const a=assess();assert.equal(a.kind,'assess');assert.equal(a.rescuer.tu,52);assert.equal(a.rescuer.medkitCharges,2);assert.equal(a.target.casualtyCondition,'critical');
 const st=stabilize();assert.equal(st.kind,'stabilize');assert.equal(st.rescuer.medkitCharges,1);assert.equal(st.target.bleeding,false);assert.equal(st.target.unconscious,true);assert.equal(Boolean(st.target.rescued),false);
 assert.equal(c.tacticalCasualtyDeteriorationStep(st.units,10).diedIds.length,0);
 assert.equal(c.tacticalFirstAidUseResult([ {...medic,medkitCharges:0},wound()],'m','v').ok,true);
 assert.equal(c.tacticalFirstAidUseResult([{...medic,tu:7},wound()],'m','v').ok,false);
 assert.equal(c.tacticalFirstAidUseResult([{...medic,x:15},wound()],'m','v').ok,false);
});
test('untreated civilian bleeding expires once per round',()=>{
 let units=[wound()];const same=c.tacticalCasualtyDeteriorationStep(units,1);assert.equal(same.changed,false);
 for(let r=2;r<=8;r++)units=c.tacticalCasualtyDeteriorationStep(units,r).units;
 assert.equal(units[0].hp,0);assert.equal(units[0].alive,false);
});
test('incapacitated civilians cannot walk, panic-run, join an escort, or board themselves',()=>{
 const u=wound();u.escortId='m';u.panic=true;
 assert.equal(c.tacticalEscortFollowers([medic,u],'m').length,0);
 assert.equal(c.tacticalFireTeamContactCivilianIds([medic,u],medic,u,{}).length,0);
 assert.equal(c.tacticalPanicCivilianMove(u,[medic,u],[],{}).x,u.x);
 assert.equal(c.tacticalCivilianRampContactBoardingTrail(u,placement.crafts[0],[],{}).length,0);
 assert.equal(c.tacticalArticulatedCivilianPresentationState(u,{}).pose,'proneDead');
});
test('stabilized civilian drag extracts physically and retains medical state through save and playback',()=>{
 const st=stabilize(),drag=c.tacticalCasualtyToggleDragResult(st.units,'m','v');assert.equal(drag.ok,true);
 const saved=copy(drag.units),result=c.tacticalExtractDraggedCasualtyAtSkyranger(saved,'m',placement,2);
 assert.equal(result.extracted,true);assert.equal(result.casualty.rescued,true);assert.equal(result.casualty.unconscious,true);assert.equal(result.casualty.casualtyExtractionRescuerId,'m');
 const state=c.tacticalPlaybackMedicalState(result.casualty);assert.equal(state.casualtyCondition,'critical');assert.equal(state.casualtyAssessedById,'m');
 assert.equal(c.tacticalExtractDraggedCasualtyAtSkyranger(result.units,'m',placement,2).extracted,false);
});
test('AI assesses then stabilizes and extracts civilian using the shared responder ownership',()=>{
 const a=c.tacticalAiMedicalTriageStep({humans:[medic,wound()],aliens:[],covers:[],mission:{gridSize:20},round:1,stabilizeOnly:true});
 assert.equal(a.humans.find(u=>u.id==='v').casualtyCondition,'critical');assert.equal(a.humans.find(u=>u.id==='m').medkitCharges,1);
 const b=c.tacticalAiMedicalTriageStep({humans:a.humans,aliens:[],covers:[],mission:{gridSize:20},round:1,stabilizeOnly:true});
 assert.equal(b.humans.find(u=>u.id==='v').stabilized,true);
 const e=c.tacticalAiCasualtyExtractionStep({humans:b.humans,aliens:[],covers:[],mission:{gridSize:20},skyranger:placement,round:2});
 assert.deepEqual([...e.extractedIds],['v']);
});

test('mission rescue quotas stay unresolved until the unconscious VIP is physically extracted',()=>{
 const mission={id:'medical-rescue',kind:'Alien Abduction Site',region:'Europe',threat:1,gridSize:20};
 const st=stabilize();let progress=c.tacticalAiRescueProgress(mission,[st.target]);assert.equal(progress.rescued,0);assert.equal(progress.active,1);assert.equal(progress.canResolveVictory,false);
 const drag=c.tacticalCasualtyToggleDragResult(st.units,'m','v'),e=c.tacticalExtractDraggedCasualtyAtSkyranger(drag.units,'m',placement,2);
 progress=c.tacticalAiRescueProgress(mission,[e.casualty]);assert.equal(progress.rescued,1);assert.equal(progress.active,0);
 const report=c.tacticalApplyCasualtyExtractionAftermath({success:true,logs:[]},e.units,[],mission,true,2);
 assert.equal(report.civilianMedical[0].extracted,true);assert.match(c.buildMissionReportEntries(report,mission).join(' '),/VIP.*stabilized; extracted alive/);
});
test('real mission round preserves the civilian medical pool and assessment snapshot',()=>{
 const game=c.makeNewGameData({openingIncidentSeed:24680}),base={...game.soldiers[0],id:'m',medkit:true,medicalCharges:2};
 const human={...medic,baseSoldier:base,weaponKind:'ballistic',ammo:12,revealed:true};
 const mission={id:'medical-round',kind:'Alien Abduction Site',region:'Europe',threat:1,gridSize:20,tacticalMapTier:'small'};
 const initial=c.tacticalAiContinuationState({units:[human,wound()],covers:[],round:1,explored:[],skyranger:placement,fireMode:'single',alienContactSeen:false});
 const result=c.resolveMission({squad:[base],mission,tech:game.tech||[],mode:'auto',leaderInstruction:'medical regression',weaponUpgrades:game.weaponUpgrades,initialBattleState:initial,maxRoundsOverride:1,simulationChunkOnly:true});
 assert.ok(result.frames?.length,'real resolver generates frames');
 const patients=result.frames.flatMap(f=>f.civilians||[]).filter(u=>u.id==='v');
 assert.ok(patients.length,'civilian remains in civilian snapshots');
 assert.ok(patients.some(u=>u.casualtyCondition==='critical'),'assessment survives real snapshot');
 assert.equal(result.frames.flatMap(f=>f.soldiers||[]).some(u=>u.id==='v'),false,'civilian never joins soldier roster');
});

test('AI pays assessment plus stabilization costs in one urgent action when TU permits',()=>{
 const r=c.tacticalAiFirstAidUseResult([medic,wound()],'m','v','human',1);
 assert.equal(r.assessed,true);assert.equal(r.rescuer.tu,medic.tu-r.cost);assert.equal(r.chargesSpent,1);assert.equal(r.target.stabilized,true);
});
test('unrevealed non-VIP casualty behind solid sight blockers is not an omniscient medical target',()=>{
 const u={...wound(),vipTracker:false,revealed:false,x:15,y:15};
 const saved=c.hasLineOfSight;c.hasLineOfSight=()=>false;
 try{assert.equal(c.tacticalCasualtyKnownForAid(u,[medic,u],[],{}),false);const r=c.tacticalAiMedicalTriageStep({humans:[medic,u],aliens:[],covers:[],mission:{gridSize:20},stabilizeOnly:true});assert.equal(r.actedIds.length,0);}finally{c.hasLineOfSight=saved;}
});

test('manual civilian click performs assessment, stabilization and ramp extraction in order',()=>{
 const context=runtimeContext();context.selectedUnit={...medic};context.unitsRef={current:[{...medic},wound()]};context.turn='human';context.tacticalRound=1;context.initialDeployment={skyranger:placement};context.setUnits=next=>{context.unitsRef.current=next;};context.setLog=()=>{};
 const start=source.indexOf('function rescueCivilian(target)'),end=source.indexOf('const AEGIS_FIRE_AT_COVER_BEFORE_KINETIC_BEACON_SHIELD',start);
 vm.runInContext(source.slice(start,end),context);
 for(const expected of ['critical','stabilized','extracted']){context.rescueCivilian(context.unitsRef.current.find(u=>u.id==='v'));const u=context.unitsRef.current.find(u=>u.id==='v');assert.equal(expected==='critical'?u.casualtyCondition:expected==='stabilized'?u.stabilized:u.extracted,expected==='critical'?'critical':true);}
 assert.equal(context.unitsRef.current.find(u=>u.id==='m').medkitCharges,1);
});
test('civilian casualty playback keeps carrier and patient together even after extraction clears links',()=>{
 const before={...wound(),draggedById:'m',stabilized:true,bleeding:false};const after={...before,x:6,draggedById:null,casualtyExtractionRescuerId:'m',rescued:true,extracted:true,casualtyExtracted:true};
 const frames=c.tacticalAiSequentialPlaybackFrames([{soldiers:[medic],aliens:[],civilians:[before],shots:[]},{soldiers:[{...medic,x:7}],aliens:[],civilians:[after],shots:[],movementTrails:{m:[{x:5,y:5},{x:6,y:5},{x:7,y:5}],v:[{x:4,y:5},{x:5,y:5},{x:6,y:5}]}}]);
 const action=frames.find(f=>f.actionActorId==='m');assert.deepEqual([...action.actionMovementIds],['m','v']);assert.equal(frames.some(f=>f.actionActorId==='v'),false);
});
