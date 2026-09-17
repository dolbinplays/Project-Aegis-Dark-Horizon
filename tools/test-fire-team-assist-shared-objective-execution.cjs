const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON});
ctx.TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT='default';
ctx.tacticalDistance=(a,b)=>Math.max(Math.abs(Number(a?.x||0)-Number(b?.x||0)),Math.abs(Number(a?.y||0)-Number(b?.y||0)));
ctx.tacticalKey=(x,y)=>`${x},${y}`;
ctx.tacticalFireTeamIsLeader=(u)=>u?.fireTeamRole==='leader';
ctx.tacticalFormalFireTeamLeaderForUnit=(u,units)=>(units||[]).find(x=>x?.fireTeamId===u?.fireTeamId&&x.fireTeamRole==='leader')||u||null;
ctx.tacticalFireTeamLeaderForUnit=ctx.tacticalFormalFireTeamLeaderForUnit;
ctx.tacticalFireTeamTurnOrder=(units)=>[...(units||[])].sort((a,b)=>String(a.id).localeCompare(String(b.id)));
ctx.tacticalEscortFollowers=(units,id)=>(units||[]).filter(u=>u?.team==='civilian'&&u.escortId===id&&Number(u.hp)>0&&!u.rescued);
ctx.tacticalFireTeamCommandOrderForUnit=()=>null;
ctx.tacticalFireTeamObjectiveAssistTeamId=(objectiveId)=>{const match=String(objectiveId||'').match(/^assist-fire-team:(.+)$/);return match?match[1]:null;};
ctx.tacticalCivilianObjectiveForMission=()=>({mandatory:true,required:2});
ctx.tacticalAiRankIndex=()=>0;
ctx.tacticalCivilianContactChance=()=>100;
ctx.rand=()=>1;
ctx.facingToward=()=> 'E';
ctx.tacticalFireTeamLabelForUnit=u=>u?.fireTeamId||'Fire Team';
ctx.tacticalBuildingCellAt=()=>null;
ctx.alienFieldBeaconKnowledgeConfirmed=k=>k==='confirmed';
ctx.tacticalActiveAlienBeacon=covers=>(covers||[]).find(c=>c?.alienBeacon&&Number(c.hp)>0&&c.alienBeaconState!=='destroyed'&&c.alienBeaconState!=='disabled')||null;
ctx.tacticalGridSizeFrom=()=>64;
ctx.tacticalAlienBeaconShieldCells=(b)=>[{x:b.x-1,y:b.y},{x:b.x+1,y:b.y}];
ctx.isHardCoverAt=()=>false;
ctx.tacticalAiBeaconAssaulterId=({units,excludedUnitIds})=>(units||[]).filter(u=>u?.team==='human'&&u.hp>0&&u.alive!==false&&!excludedUnitIds.has(u.id)&&(u.weaponKind==='laser'||Number(u.grenadeCharges)>0))[0]?.id||null;

function evalBetween(start,end){const a=runtime.indexOf(start),b=runtime.indexOf(end,a+start.length);assert.ok(a>=0,`missing ${start}`);assert.ok(b>a,`missing ${end}`);vm.runInContext(runtime.slice(a,b),ctx);}
evalBetween('function tacticalFireTeamObjectiveAssignmentForTeam','function tacticalFireTeamObjectiveChoiceMap');
evalBetween('function tacticalFireTeamObjectiveAssistState','function tacticalFireTeamObjectiveAssistTarget');
evalBetween('function tacticalResetCompletedObjectiveTeamInPlace','function tacticalReleaseCompletedBeaconObjectiveAssignmentsInPlace');
evalBetween('function tacticalExplicitVipOwnerTeamMap','function tacticalFireTeamMoveUnitToward');
evalBetween('function tacticalVipRescueCoordinatorExperience','function tacticalApplyVipRescueAssignments');
evalBetween('function tacticalFireTeamBeaconAssaultState','function tacticalFireTeamBeaconAssignmentNeutralizationState');

const human=(id,team,x,y,extra={})=>({id,name:id,team:'human',alive:true,hp:36,tu:48,x,y,fireTeamId:team,fireTeamRole:'leader',weaponKind:'ballistic',ammo:12,grenadeCharges:0,...extra});
const vip=(id,x,y,extra={})=>({id,name:id,team:'civilian',alive:true,hp:18,x,y,rescued:false,escortId:null,vipTracker:true,revealed:true,...extra});
const explicitVip=(u,target)=>({...u,fireTeamObjectiveAssignmentMode:'explicit',fireTeamObjectiveAssignmentId:`civilian:${target.id}`,fireTeamObjectiveAssignmentType:'civilian',fireTeamObjectiveAssignmentTargetId:target.id,fireTeamObjectiveAssignmentLabel:`VIP ${target.name}`});
const assist=(u,primaryId,objectiveId,objectiveType,targetId)=>({...u,fireTeamObjectiveAssignmentMode:'assist',fireTeamObjectiveAssignmentId:`assist-fire-team:${primaryId}`,fireTeamObjectiveAssignmentType:'assist-fire-team',fireTeamObjectiveAssignmentTargetId:primaryId,fireTeamObjectiveAssignmentLabel:`Assist ${primaryId}`,fireTeamObjectiveAssistTeamId:primaryId,fireTeamObjectiveAssistObjectiveId:objectiveId,fireTeamObjectiveAssistObjectiveType:objectiveType});

test('patch marker is present and save format remains 4',()=>{
  assert.match(runtime,/TACTICAL_FIRE_TEAM_ASSIST_SHARED_OBJECTIVE_EXECUTION_PATCH=true/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('VIP assist inherits the primary VIP as a shared rescue target while default teams keep separate claims',()=>{
  const a=vip('vip-a',14,4),b=vip('vip-b',24,4);
  const alpha=explicitVip(human('alpha-lead','alpha',2,4),a);
  const bravo=assist(human('bravo-lead','bravo',7,4),'alpha',`civilian:${a.id}`,'civilian',a.id);
  const charlie=human('charlie-lead','charlie',20,4);
  const plan=ctx.tacticalVipRescueAssignmentPlan({units:[alpha,bravo,charlie,a,b],mission:{kind:'VIP Rescue'},secureRescue:true});
  const byTeam=new Map(Array.from(plan.assignments,x=>[x.fireTeamId,x]));
  assert.equal(byTeam.get('alpha').vipId,a.id);
  assert.equal(byTeam.get('bravo').vipId,a.id);
  assert.equal(byTeam.get('bravo').assist,true);
  assert.equal(byTeam.get('bravo').assistTeamId,'alpha');
  assert.equal(byTeam.get('charlie').vipId,b.id);
  assert.equal(plan.assistAssignmentCount,1);
});

test('only an assist relationship to the explicit VIP owner grants autonomous first-contact override',()=>{
  const a=vip('vip-a',8,4),alpha=explicitVip(human('alpha-lead','alpha',2,4),a);
  const bravo=assist(human('bravo-lead','bravo',7,4),'alpha',`civilian:${a.id}`,'civilian',a.id);
  const charlie=human('charlie-lead','charlie',7,5);
  assert.equal(ctx.tacticalFireTeamAssistCivilianClaimAllowed(bravo,a,[alpha,bravo,charlie,a]),true);
  assert.equal(ctx.tacticalFireTeamAssistCivilianClaimAllowed(charlie,a,[alpha,bravo,charlie,a]),false);
});

test('assisting team reaching the VIP first becomes physical escort owner and releases stale objective race',()=>{
  const a=vip('vip-a',8,4),alpha=explicitVip(human('alpha-lead','alpha',2,4),a);
  const bravo=assist(human('bravo-lead','bravo',7,4),'alpha',`civilian:${a.id}`,'civilian',a.id);
  const units=[alpha,bravo,a];
  const result=ctx.tacticalFireTeamContactCivilians({units,leaderId:bravo.id,primaryId:a.id,mission:{},allowAssignmentOverride:ctx.tacticalFireTeamAssistCivilianClaimAllowed(bravo,a,units),round:6});
  const escorted=result.units.find(u=>u.id===a.id),alphaAfter=result.units.find(u=>u.id===alpha.id),bravoAfter=result.units.find(u=>u.id===bravo.id);
  assert.equal(escorted.escortId,bravo.id);
  assert.equal(escorted.priorityEscortId,bravo.id);
  assert.equal(alphaAfter.fireTeamObjectiveAssignmentMode,'default');
  assert.equal(bravoAfter.fireTeamObjectiveAssignmentMode,'default');
  assert.deepEqual(Array.from(result.joinedIds),[a.id]);
});

test('unrelated autonomous team still cannot steal an explicitly reserved VIP',()=>{
  const a=vip('vip-a',8,4),alpha=explicitVip(human('alpha-lead','alpha',2,4),a),charlie=human('charlie-lead','charlie',7,4);
  const result=ctx.tacticalFireTeamContactCivilians({units:[alpha,charlie,a],leaderId:charlie.id,primaryId:a.id,mission:{},round:6});
  assert.equal(result.joinedIds.length,0);
  assert.equal(result.units.find(u=>u.id===a.id).escortId,null);
});

test('beacon assist remains an assist assignment but becomes a legal second assault team with its own breacher',()=>{
  const beacon={id:'beacon-a',x:20,y:20,hp:72,maxHp:72,alienBeacon:true,alienBeaconState:'active',alienBeaconShield:'combined'};
  const alpha={...human('alpha-lead','alpha',5,5),weaponKind:'laser',fireTeamObjectiveAssignmentMode:'explicit',fireTeamObjectiveAssignmentId:'beacon:beacon-a',fireTeamObjectiveAssignmentType:'beacon',fireTeamObjectiveAssignmentTargetId:'beacon-a',fireTeamObjectiveAssignmentLabel:'Alien Field Beacon'};
  const bravo=assist({...human('bravo-lead','bravo',8,8),weaponKind:'ballistic',grenadeCharges:1},'alpha','beacon:beacon-a','beacon','beacon-a');
  const state=ctx.tacticalFireTeamBeaconAssaultState({unit:bravo,units:[alpha,bravo],covers:[beacon],mission:{},knowledge:'confirmed'});
  assert.equal(state.assigned,true);
  assert.equal(state.directAssigned,false);
  assert.equal(state.assisting,true);
  assert.equal(state.assistTeamId,'alpha');
  assert.equal(state.assaulterId,bravo.id);
  assert.equal(state.capable,true);
  assert.equal(ctx.tacticalFireTeamObjectiveAssignmentForTeam([alpha,bravo],'bravo').mode,'assist');
});

test('assist team with no effective beacon attack remains assist-follow capable instead of entering direct-assignment blocked hold',()=>{
  assert.match(runtime,/objectiveAssistExecutesBeacon=Boolean\(assignedBeaconAssault\.assisting&&assignedBeaconAssault\.capable/);
  assert.match(runtime,/beaconAssignmentBlockedHold=Boolean\(assignedBeaconAssault\.directAssigned/);
  assert.match(runtime,/aiBeaconAssistContribution="follow-primary-no-effective-shot"/);
});

test('runtime rescue contact and beacon firing seams consume shared assist authority',()=>{
  const rescue=runtime.slice(runtime.indexOf('function tacticalAiCivilianPriorityTurn'),runtime.indexOf('function tacticalAdvanceEscortedCivilians',runtime.indexOf('function tacticalAiCivilianPriorityTurn')));
  const resolver=runtime.slice(runtime.indexOf('function resolveMission'),runtime.indexOf('function tacticalAiRoleForUnit'));
  assert.match(rescue,/assistCivilianClaim=tacticalFireTeamAssistCivilianClaimAllowed/);
  assert.match(rescue,/allowAssignmentOverride:assistCivilianClaim/);
  assert.match(resolver,/explicitBeaconAssaultMember=Boolean\(assignedBeaconAssault\.assigned/);
  assert.match(resolver,/beaconStrikeAttack = Boolean\(beaconStrikeAssigned/);
});
