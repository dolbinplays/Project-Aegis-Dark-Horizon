const fs=require('fs'),vm=require('vm'),assert=require('assert/strict'),test=require('node:test');
const src=fs.readFileSync('src/browser-runtime.html','utf8');
const start=src.indexOf('const TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIGNMENT_PATCH=true;');
const end=src.indexOf('function tacticalFireTeamObjectiveAssistState',start);
assert.ok(start>=0&&end>start,'objective assignment/commitment helper block present');
const block=src.slice(start,end);
const ctx={console,Math,Set,Map,
  TACTICAL_AI_MAX_MOVE_STEPS:8,
  TACTICAL_FEAR_STATES:{steady:'steady',shaken:'shaken',pinned:'pinned',override:'override'},
  tacticalFireTeamCommandGroups:units=>[...new Set((units||[]).filter(u=>u.team==='human'&&u.fireTeamId).map(u=>u.fireTeamId))].map((id,index)=>({id,label:`Team ${index+1}`,members:units.filter(u=>u.fireTeamId===id)})),
  tacticalFireTeamLeaderForUnit:(u,units)=>(units||[]).find(x=>x.fireTeamId===u?.fireTeamId&&x.fireTeamRole==='leader')||u,
  tacticalIssueFireTeamCommand:units=>units,
  tacticalNeighbors:(x,y)=>[{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1}],
  tacticalActiveAlienBeacon:()=>null,
  tacticalAlienBeaconRecord:()=>null,
  tacticalHumanCombatActive:u=>Boolean(u&&u.team==='human'&&u.alive!==false&&Number(u.hp)>0&&!u.downed&&!u.unconscious&&!u.extracted),
  tacticalDistance:(a,b)=>Math.max(Math.abs(Number(a?.x||0)-Number(b?.x||0)),Math.abs(Number(a?.y||0)-Number(b?.y||0))),
  tacticalAiRescueRoute:({unit,targets})=>{const t=targets[0],path=[{x:unit.x,y:unit.y}];let x=unit.x,y=unit.y,guard=0;while(Math.max(Math.abs(x-t.x),Math.abs(y-t.y))>1&&guard++<100){if(x!==t.x)x+=Math.sign(t.x-x);else if(y!==t.y)y+=Math.sign(t.y-y);path.push({x,y});}return{path,reached:Math.max(Math.abs(x-t.x),Math.abs(y-t.y))<=1};},
};
vm.createContext(ctx);vm.runInContext(block,ctx);
const soldier=(id,team,x,y,role='left',extra={})=>({id,name:id,team:'human',alive:true,hp:36,tu:48,x,y,fireTeamId:team,fireTeamRole:role,fearState:'steady',medkitCharges:0,...extra});
const vip=(id,x,y,extra={})=>({id,name:id,team:'civilian',alive:true,hp:18,x,y,rescued:false,escortId:null,vipTracker:true,revealed:true,...extra});
const objective=v=>({id:`civilian:${v.id}`,type:'civilian',targetId:v.id,label:v.name,x:v.x,y:v.y});

test('patch marker and save format 4 remain present',()=>{
  assert.match(src,/TACTICAL_PLAYER_SELECTABLE_VIP_RESCUE_COMMITMENT_PRIORITY_LOCK_PATCH=true/);
  assert.match(src,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('objective application persists VIP Priority Lock only on a civilian assignment',()=>{
  const v=vip('vip-a',12,4),units=[soldier('lead','alpha',2,4,'leader'),soldier('support','alpha',3,4),v];
  const applied=ctx.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:`civilian:${v.id}`},[objective(v)],3,{vipCommitmentChoices:{alpha:true}});
  const team=applied.filter(u=>u.fireTeamId==='alpha');
  assert.ok(team.every(u=>u.fireTeamVipRescueCommitmentEnabled===true));
  assert.ok(team.every(u=>u.fireTeamVipRescueCommitmentTargetId===v.id));
  const cleared=ctx.tacticalApplyFireTeamObjectiveAssignments(applied,{alpha:'default'},[objective(v)],4,{vipCommitmentChoices:{alpha:true}});
  assert.ok(cleared.filter(u=>u.fireTeamId==='alpha').every(u=>u.fireTeamVipRescueCommitmentEnabled===false&&u.fireTeamVipRescueCommitmentTargetId===null));
});

test('commitment chooses one reachable member and persists that member while valid',()=>{
  const v=vip('vip-a',12,4),units=ctx.tacticalApplyFireTeamObjectiveAssignments([
    soldier('lead','alpha',2,4,'leader'),soldier('near','alpha',7,4),soldier('far','alpha',1,4),v
  ],{alpha:`civilian:${v.id}`},[objective(v)],3,{vipCommitmentChoices:{alpha:true}});
  const first=ctx.tacticalEnsureVipRescueCommitments({units,covers:[],mission:{gridSize:32},round:3});
  assert.equal(first.committedRescuerIds.length,1);assert.equal(first.committedRescuerIds[0],'near');
  const moved=first.units.map(u=>u.id==='far'?{...u,x:11,y:4}:u);
  const second=ctx.tacticalEnsureVipRescueCommitments({units:moved,covers:[],mission:{gridSize:32},round:4});
  assert.deepEqual(Array.from(second.committedRescuerIds),['near']);
});

test('medical priority exclusion hands pre-contact commitment to another eligible team member',()=>{
  const v=vip('vip-a',10,4),units=ctx.tacticalApplyFireTeamObjectiveAssignments([
    soldier('near','alpha',7,4),soldier('backup','alpha',4,4),v
  ],{alpha:`civilian:${v.id}`},[objective(v)],2,{vipCommitmentChoices:{alpha:true}});
  const first=ctx.tacticalEnsureVipRescueCommitments({units,covers:[],mission:{gridSize:32},round:2});
  assert.equal(first.committedRescuerIds[0],'near');
  const second=ctx.tacticalEnsureVipRescueCommitments({units:first.units,covers:[],mission:{gridSize:32},round:3,excludedResponderIds:new Set(['near'])});
  assert.equal(second.committedRescuerIds[0],'backup');
});

test('incapacitated or fear-override committed responder is replaced',()=>{
  const v=vip('vip-a',10,4),units=ctx.tacticalApplyFireTeamObjectiveAssignments([
    soldier('near','alpha',7,4),soldier('backup','alpha',4,4),v
  ],{alpha:`civilian:${v.id}`},[objective(v)],2,{vipCommitmentChoices:{alpha:true}});
  const first=ctx.tacticalEnsureVipRescueCommitments({units,covers:[],mission:{gridSize:32},round:2});
  const overridden=first.units.map(u=>u.id==='near'?{...u,fearState:'override'}:u);
  const second=ctx.tacticalEnsureVipRescueCommitments({units:overridden,covers:[],mission:{gridSize:32},round:3});
  assert.equal(second.committedRescuerIds[0],'backup');
  const dead=second.units.map(u=>u.id==='backup'?{...u,hp:0,alive:false}:u.id==='near'?{...u,fearState:'steady'}:u);
  const third=ctx.tacticalEnsureVipRescueCommitments({units:dead,covers:[],mission:{gridSize:32},round:4});
  assert.equal(third.committedRescuerIds[0],'near');
});

test('active escortId becomes physical commitment authority and cross-team escort clears stale lock',()=>{
  const v=vip('vip-a',8,4),base=ctx.tacticalApplyFireTeamObjectiveAssignments([
    soldier('lead','alpha',7,4,'leader'),soldier('support','alpha',6,4),v
  ],{alpha:`civilian:${v.id}`},[objective(v)],2,{vipCommitmentChoices:{alpha:true}});
  let escorted=base.map(u=>u.id===v.id?{...u,escortId:'support'}:u);
  let state=ctx.tacticalEnsureVipRescueCommitments({units:escorted,covers:[],mission:{gridSize:32},round:3});
  assert.deepEqual(Array.from(state.committedRescuerIds),['support']);assert.ok(state.units.filter(u=>u.fireTeamId==='alpha').every(u=>u.fireTeamVipRescueCommitmentStatus==='escort'));
  escorted=[...base,soldier('bravo','bravo',8,5,'leader')].map(u=>u.id===v.id?{...u,escortId:'bravo'}:u);
  state=ctx.tacticalEnsureVipRescueCommitments({units:escorted,covers:[],mission:{gridSize:32},round:3});
  assert.equal(state.committedRescuerIds.length,0);assert.ok(state.units.filter(u=>u.fireTeamId==='alpha').every(u=>u.fireTeamVipRescueCommitmentEnabled===false));
});

test('runtime rescue path explicitly bypasses visible-contact suspension only for committed responder',()=>{
  const rescue=src.slice(src.indexOf('function tacticalAiCivilianPriorityTurn'),src.indexOf('function tacticalAdvanceEscortedCivilians',src.indexOf('function tacticalAiCivilianPriorityTurn')));
  assert.match(rescue,/if\(dynamicCombatPriority&&!followers\.length&&!committedRescuer\)/);
  assert.match(rescue,/\(!dynamicCombatPriority\|\|committedRescuer\)/);
  assert.match(rescue,/allowNonLeader:committedRescuer/);
  assert.match(rescue,/applyFireTeamFormation:!committedRescuer&&!escortSupportBreakoff/);
  assert.match(rescue,/player-vip-rescue-commitment/);
});

test('only committed pre-contact rescuer is reserved; teammates remain available for combat',()=>{
  const rescue=src.slice(src.indexOf('function tacticalAiCivilianPriorityTurn'),src.indexOf('function tacticalAdvanceEscortedCivilians',src.indexOf('function tacticalAiCivilianPriorityTurn')));
  assert.match(rescue,/const fireTeamDutyMembers = committedRescuer&&!followers\.length\?\[soldier\]/);
  const resolver=src.slice(src.indexOf('function resolveMission'),src.indexOf('function classicLineup',src.indexOf('function resolveMission'))>0?src.indexOf('function classicLineup',src.indexOf('function resolveMission')):src.length);
  assert.match(resolver,/committedVipRescuerIds/);
  assert.match(resolver,/civilianDutyIds=new Set/);
});

test('objective board exposes per-civilian VIP Priority Lock and keeps draft state transactional',()=>{
  assert.match(src,/data-aegis-vip-priority-lock/);assert.match(src,/onVipCommitmentChange/);
  assert.match(src,/objectiveAssignmentVipCommitmentChoices/);assert.match(src,/baselineVipCommitments/);
  assert.match(src,/setObjectiveAssignmentVipCommitmentChoices\(\{\.\.\.objectiveAssignmentPrompt\.baselineVipCommitments\}\)/);
});

test('streamed snapshots and live playback merge preserve commitment authority fields',()=>{
  for(const key of ['fireTeamVipRescueCommitmentEnabled','fireTeamVipRescueCommitmentTargetId','fireTeamVipRescueCommitmentRescuerId','fireTeamVipRescueCommitmentIssuedRound','fireTeamVipRescueCommitmentStatus']){
    assert.ok(src.includes(`${key}:`),`${key} snapshot/state field present`);
  }
  assert.match(src,/Object\.prototype\.hasOwnProperty\.call\(unit,"fireTeamVipRescueCommitmentRescuerId"\)/);
});
