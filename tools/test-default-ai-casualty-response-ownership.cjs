const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),test=require('node:test');
const src=fs.readFileSync('src/browser-runtime.html','utf8');
const a=src.indexOf('const TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_DRAGGING_PATCH=true;');
const b=src.indexOf('function tacticalMedkitActionState',a);
assert.ok(a>=0&&b>a,'casualty-care helper block present');
const block=`const TACTICAL_MEDKIT_FIELD_CHARGES=4,TACTICAL_MEDIC_FIELD_CHARGES=10,TACTICAL_FIRST_AID_TU=14,TACTICAL_FIRST_AID_HEAL=10,TACTICAL_STABILIZE_TU=16,TACTICAL_MEDKIT_TU=12,TACTICAL_MEDKIT_HEAL=12;\n`+src.slice(a,b);
const ctx={console,Math,Set,Map,
  TACTICAL_FEAR_STATES:{steady:'steady',shaken:'shaken',pinned:'pinned',override:'override'},
  TACTICAL_AI_MAX_CANDIDATES:220,
  clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
  soldierMedicalCharges:s=>String(s?.specialization||'').toLowerCase()==='medic'?10:s?.medkit?4:0,
  tacticalDistance:(a,b)=>Math.max(Math.abs(Number(a?.x||0)-Number(b?.x||0)),Math.abs(Number(a?.y||0)-Number(b?.y||0))),
  tacticalKey:(x,y)=>`${x},${y}`,
  tacticalNeighbors:(x,y,size=48)=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]].map(([dx,dy])=>({x:x+dx,y:y+dy})).filter(p=>p.x>=0&&p.y>=0&&p.x<size&&p.y<size),
  tacticalVisibleCellSet:(_humans,_covers,_mission)=>new Set(['8,0','8,1','7,0','7,1']),
  tacticalGridSizeFrom:()=>48,
  isHardCoverAt:()=>false,adjacentToCover:()=>false,
  updateFacing:(u,x,y)=>x>u.x?'E':x<u.x?'W':u.facing||'N',
  tacticalAiHazardAwarePath:(start,target,_covers,_units,maxSteps)=>{const path=[{x:start.x,y:start.y}];let x=start.x,y=start.y,guard=0;while((x!==target.x||y!==target.y)&&guard++<200){if(x!==target.x)x+=Math.sign(target.x-x);else if(y!==target.y)y+=Math.sign(target.y-y);path.push({x,y});}return path.length-1<=maxSteps?path:null;},
  tacticalPlayerSkyrangerCrafts:p=>Array.isArray(p?.crafts)?p.crafts:p?[p]:[],
  tacticalSkyrangerRampTouchCellForCraft:c=>c?.rampCells?.[0]||null,
};
vm.createContext(ctx);vm.runInContext(block,ctx);
const medic=(id,x,y,extra={})=>({id,name:id,team:'human',alive:true,hp:36,maxHp:36,tu:24,maxTu:48,x,y,medkitCharges:10,baseSoldier:{medkit:true,specialization:'Medic'},fearState:'steady',...extra});
const casualty=(id,x,y,extra={})=>({id,name:id,team:'human',alive:true,hp:1,maxHp:40,tu:0,maxTu:48,x,y,downed:true,unconscious:true,prone:true,bleeding:true,stabilized:false,bleedOutRounds:3,fearState:'steady',...extra});
const refresh=(units,tu=24)=>units.map(u=>u.team==='human'&&!ctx.tacticalHumanIsDowned(u)?{...u,tu}:u);

test('build keeps save format 4 and exposes casualty ownership authority marker',()=>{
  assert.match(src,/TACTICAL_DEFAULT_AI_CASUALTY_STABILIZATION_RECOVERY_OWNERSHIP_PATCH=true/);
  assert.match(src,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('stabilization approach keeps one responder even when another medic becomes closer next round',()=>{
  let units=[medic('alpha',3,0,{tu:20}),medic('bravo',12,0,{tu:20}),casualty('case',7,0,{bleedOutRounds:2})];
  const first=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},round:4,stabilizeOnly:true});
  const owner=first.humans.find(u=>u.id==='case').aiCasualtyResponderId;assert.equal(owner,'alpha');assert.equal(first.humans.find(u=>u.id==='alpha').aiCasualtyTargetId,'case');
  units=refresh(first.humans,20).map(u=>u.id==='bravo'?{...u,x:6,y:0}:u);
  const second=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},round:5,stabilizeOnly:true});
  assert.equal(second.humans.find(u=>u.id==='case').aiCasualtyResponderId,'alpha');assert.ok(second.dutyIds.includes('alpha'));assert.ok(!second.dutyIds.includes('bravo'));
});

test('successful stabilization transitions the same responder directly into recovery ownership',()=>{
  const units=[medic('alpha',4,4,{tu:40}),medic('bravo',7,4,{tu:40}),casualty('case',5,4,{bleedOutRounds:1})];
  const result=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[{id:'alien',team:'alien',alive:true,hp:20,x:8,y:4}],covers:[],mission:{gridSize:48},round:6,stabilizeOnly:true});
  const patient=result.humans.find(u=>u.id==='case'),responder=result.humans.find(u=>u.id==='alpha');
  assert.equal(patient.stabilized,true);assert.equal(patient.bleeding,false);assert.equal(patient.aiCasualtyResponderId,'alpha');assert.equal(patient.aiCasualtyDutyKind,'recover');assert.equal(responder.aiCasualtyTargetId,'case');assert.equal(responder.aiCasualtyDutyKind,'recover');
});

test('assigned recovery responder is not replaced by a closer alternate while still valid',()=>{
  const craft={rampCells:[{x:12,y:4}]},placement={crafts:[craft]};
  let units=[medic('alpha',4,4,{tu:16,aiCasualtyTargetId:'case',aiCasualtyDutyKind:'recover',aiCasualtyDutyAssignedRound:6}),medic('bravo',6,4,{tu:40}),casualty('case',5,4,{bleeding:false,stabilized:true,aiCasualtyResponderId:'alpha',aiCasualtyDutyKind:'recover',aiCasualtyDutyAssignedRound:6})];
  const result=ctx.tacticalAiCasualtyExtractionStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},skyranger:placement,round:7});
  assert.ok(result.dutyIds.includes('alpha'));assert.ok(!result.dutyIds.includes('bravo'));assert.equal(result.humans.find(u=>u.id==='case').aiCasualtyResponderId,'alpha');
});

test('dead/incapacitated responder releases ownership so a valid teammate can take over',()=>{
  const craft={rampCells:[{x:8,y:4}]},placement={crafts:[craft]};
  const units=[medic('alpha',4,4,{alive:false,hp:0,aiCasualtyTargetId:'case',aiCasualtyDutyKind:'recover'}),medic('bravo',5,4,{tu:40}),casualty('case',4,4,{bleeding:false,stabilized:true,aiCasualtyResponderId:'alpha',aiCasualtyDutyKind:'recover'})];
  const result=ctx.tacticalAiCasualtyExtractionStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},skyranger:placement,round:8});
  const patient=result.humans.find(u=>u.id==='case');assert.notEqual(patient.aiCasualtyResponderId,'alpha');assert.ok(patient.casualtyExtracted||patient.aiCasualtyResponderId==='bravo');
});

test('override-fear responder releases recovery ownership immediately to an eligible teammate',()=>{
  const craft={rampCells:[{x:8,y:4}]},placement={crafts:[craft]};
  const units=[medic('alpha',4,4,{fearState:'override',aiCasualtyTargetId:'case',aiCasualtyDutyKind:'recover'}),medic('bravo',5,4,{tu:40}),casualty('case',4,5,{bleeding:false,stabilized:true,aiCasualtyResponderId:'alpha',aiCasualtyDutyKind:'recover'})];
  const result=ctx.tacticalAiCasualtyExtractionStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},skyranger:placement,round:9});
  const patient=result.humans.find(u=>u.id==='case');assert.notEqual(patient.aiCasualtyResponderId,'alpha');assert.ok(patient.casualtyExtracted||patient.aiCasualtyResponderId==='bravo');
});

test('unreachable assigned responder releases ownership and a reachable adjacent teammate takes over in the same extraction pass',()=>{
  const craft={rampCells:[{x:9,y:4}]},placement={crafts:[craft]},priorPath=ctx.tacticalAiHazardAwarePath;
  const units=[medic('alpha',0,0,{tu:40,aiCasualtyTargetId:'case',aiCasualtyDutyKind:'recover'}),medic('bravo',5,4,{tu:40}),casualty('case',4,4,{bleeding:false,stabilized:true,aiCasualtyResponderId:'alpha',aiCasualtyDutyKind:'recover'})];
  ctx.tacticalAiHazardAwarePath=(start,target,...rest)=>start?.id==='alpha'?null:priorPath(start,target,...rest);
  try{
    const result=ctx.tacticalAiCasualtyExtractionStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},skyranger:placement,round:10});
    const patient=result.humans.find(u=>u.id==='case');assert.notEqual(patient.aiCasualtyResponderId,'alpha');assert.ok(patient.casualtyExtracted||patient.aiCasualtyResponderId==='bravo');assert.ok(result.dutyIds.includes('bravo'));
  }finally{ctx.tacticalAiHazardAwarePath=priorPath;}
});

test('physical manual drag supersedes a stale AI reservation and is adopted for continuation',()=>{
  const units=[medic('alpha',2,2,{aiCasualtyTargetId:'case',aiCasualtyDutyKind:'recover'}),medic('bravo',4,2,{draggingCasualtyId:'case'}),casualty('case',3,2,{bleeding:false,stabilized:true,draggedById:'bravo',aiCasualtyResponderId:'alpha',aiCasualtyDutyKind:'recover'})];
  ctx.tacticalReconcileCasualtyResponderAssignmentsInPlace(units,9);
  assert.equal(units.find(u=>u.id==='case').aiCasualtyResponderId,'bravo');assert.equal(units.find(u=>u.id==='bravo').aiCasualtyTargetId,'case');assert.equal(units.find(u=>u.id==='alpha').aiCasualtyTargetId,null);
});

test('hybrid player-controlled lead is never commandeered as an autonomous casualty responder',()=>{
  const units=[medic('player',4,4,{hybridPlayerControlledLead:true,tu:48}),medic('ai',6,4,{tu:48}),casualty('case',5,4,{bleedOutRounds:1})];
  const result=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},round:10,stabilizeOnly:true,excludedResponderIds:new Set(['player'])});
  assert.notEqual(result.humans.find(u=>u.id==='case').aiCasualtyResponderId,'player');assert.ok(result.actedIds.includes('ai'));
});

test('one medic with two casualties treats the most urgent casualty without claiming both',()=>{
  const units=[medic('doc',4,4,{tu:48}),casualty('urgent',5,4,{bleedOutRounds:1}),casualty('later',4,5,{bleedOutRounds:3})];
  const result=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},round:11,stabilizeOnly:true});
  assert.equal(result.humans.find(u=>u.id==='urgent').stabilized,true);assert.notEqual(result.humans.find(u=>u.id==='later').aiCasualtyResponderId,'doc');
});

test('two medics can take different casualties in one priority-one pass without dogpiling',()=>{
  const units=[medic('doc-a',4,4,{tu:48}),medic('doc-b',7,4,{tu:48}),casualty('case-a',5,4,{bleedOutRounds:1}),casualty('case-b',6,4,{bleedOutRounds:2})];
  const result=ctx.tacticalAiMedicalTriageStep({humans:units,aliens:[],covers:[],mission:{gridSize:48},round:12,stabilizeOnly:true});
  const owners=['case-a','case-b'].map(id=>result.humans.find(u=>u.id===id).aiCasualtyResponderId).filter(Boolean);assert.equal(new Set(owners).size,2);assert.equal(new Set(result.actedIds).size,2);
});

test('streamed tactical snapshots persist additive casualty ownership fields',()=>{
  assert.match(src,/aiCasualtyResponderId:unit\.aiCasualtyResponderId\|\|null/);assert.match(src,/aiCasualtyTargetId:unit\.aiCasualtyTargetId\|\|null/);assert.match(src,/Object\.prototype\.hasOwnProperty\.call\(unit,"aiCasualtyResponderId"\)/);
});

test('priority responders are removed from lower-priority actor processing for the whole round',()=>{
  assert.match(src,/priorityResponderDutyIds=new Set\(\[\.\.\.medicalPriorityDutyIds,\.\.\.casualtyRecoveryDutyIds,\.\.\.casualtyExtractionDutyIds\]\)/);assert.match(src,/if\(priorityResponderDutyIds\.has\(human\.id\)\)return/);
});
