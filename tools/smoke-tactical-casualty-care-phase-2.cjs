const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync('src/browser-runtime.html','utf8');
const a=src.indexOf('const TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_DRAGGING_PATCH=true;');
const b=src.indexOf('function applyTacticalMedicalGrowth',a);
assert.ok(a>=0&&b>a,'medical helper block present');
const block=`const TACTICAL_MEDKIT_FIELD_CHARGES=4,TACTICAL_MEDIC_FIELD_CHARGES=10,TACTICAL_FIRST_AID_TU=14,TACTICAL_FIRST_AID_HEAL=10,TACTICAL_STABILIZE_TU=16,TACTICAL_MEDKIT_TU=12,TACTICAL_MEDKIT_HEAL=12;\n`+src.slice(a,b);
const ctx={console,Math,Set,Map,
 tacticalDistance:(a,b)=>Math.max(Math.abs((a?.x||0)-(b?.x||0)),Math.abs((a?.y||0)-(b?.y||0))),
 tacticalKey:(x,y)=>`${x},${y}`, tacticalNeighbors:()=>[], tacticalVisibleCellSet:()=>new Set(), tacticalGridSizeFrom:()=>48,isHardCoverAt:()=>false,adjacentToCover:()=>false,updateFacing:(u)=>u.facing||'E'
};vm.createContext(ctx);vm.runInContext(block,ctx);
const medicBase={medkit:true,specialization:'Medic'},rifleBase={medkit:true,specialization:'Rifleman'};
assert.equal(ctx.tacticalInitialMedkitCharges(medicBase),10);assert.equal(ctx.tacticalInitialMedkitCharges(rifleBase),4);assert.equal(ctx.tacticalInitialMedkitCharges({medkit:false,specialization:'Medic'}),0);assert.equal(ctx.tacticalInitialMedkitCharges(medicBase,3),3);
const raw={id:'c1',name:'Mira',team:'human',alive:true,hp:10,maxHp:40,tu:40,maxTu:40,x:5,y:5};
let hit=ctx.tacticalResolveHumanCasualtyHit(raw,12,{id:'a1'},4);assert.equal(hit.downed,true);assert.equal(hit.unit.bleeding,true);assert.equal(hit.unit.stabilized,false);assert.equal(hit.unit.bleedOutRounds,3);assert.equal(hit.unit.bleedLastProcessedRound,4);
let d=ctx.tacticalCasualtyDeteriorationStep([hit.unit],4);assert.equal(d.changed,false);d=ctx.tacticalCasualtyDeteriorationStep(d.units,5);assert.equal(d.units[0].bleedOutRounds,2);assert.equal(d.units[0].alive,true);d=ctx.tacticalCasualtyDeteriorationStep(d.units,6);assert.equal(d.units[0].bleedOutRounds,1);d=ctx.tacticalCasualtyDeteriorationStep(d.units,7);assert.equal(d.units[0].alive,false);assert.equal(d.diedIds[0],'c1');
const responder={id:'m1',name:'Doc',team:'human',alive:true,hp:30,maxHp:36,tu:50,maxTu:50,x:5,y:5,medkitCharges:10,baseSoldier:medicBase};
const casualty={...hit.unit,x:6,y:5};
let treatment=ctx.tacticalFirstAidUseResult([responder,casualty],'m1','c1','human',5);assert.equal(treatment.ok,true);assert.equal(treatment.kind,'stabilize');assert.equal(treatment.rescuer.tu,34);assert.equal(treatment.rescuer.medkitCharges,9);assert.equal(treatment.target.stabilized,true);assert.equal(treatment.target.bleeding,false);assert.equal(treatment.target.downed,true);assert.equal(treatment.target.hp,1);
d=ctx.tacticalCasualtyDeteriorationStep(treatment.units,20);assert.equal(d.changed,false);assert.equal(d.units.find(u=>u.id==='c1').alive,true);
const wounded={id:'w1',name:'Bryn',team:'human',alive:true,hp:12,maxHp:40,tu:40,maxTu:40,x:6,y:5};
treatment=ctx.tacticalFirstAidUseResult([responder,wounded],'m1','w1','human',5);assert.equal(treatment.kind,'treat');assert.equal(treatment.healed,10);assert.equal(treatment.target.hp,22);assert.equal(treatment.rescuer.tu,36);assert.equal(treatment.rescuer.medkitCharges,9);
const self=ctx.tacticalMedkitUseResult({...responder,hp:18,maxHp:40,medkitCharges:4},'human');assert.equal(self.ok,true);assert.equal(self.unit.medkitCharges,3);assert.equal(self.unit.hp,30);
const priority=ctx.tacticalMedicalPriorityTarget([responder,wounded,casualty],'m1');assert.equal(priority.id,'c1');
const rifleResponder={...responder,id:'r1',name:'Rifle',medkitCharges:4,baseSoldier:rifleBase};const medicResponder={...responder,id:'m2',name:'Medic',medkitCharges:10,baseSoldier:medicBase};const urgent={...casualty,id:'c2',name:'Urgent',bleedOutRounds:1,stabilized:false,bleeding:true};
const triage=ctx.tacticalAiMedicalTriageStep({humans:[rifleResponder,medicResponder,urgent],round:6});assert.equal(triage.actedIds[0],'m2');assert.equal(triage.humans.find(u=>u.id==='c2').stabilized,true);assert.equal(triage.humans.find(u=>u.id==='m2').medkitCharges,9);
console.log('PASS - Phase 2 bleeding clock, stabilization, teammate treatment, multi-charge medkits, and medic-priority AI triage');
