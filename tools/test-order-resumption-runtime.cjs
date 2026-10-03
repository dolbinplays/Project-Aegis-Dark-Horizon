const test=require('node:test'),assert=require('node:assert/strict');
const {runtimeContext,seededRandom}=require('./runtime-test-context.cjs');
function fixture(c,kind){
 const base=c.makeNewGameData({openingIncidentSeed:42}).soldiers[0];
 const human={id:'lead',name:'Lead',team:'human',hp:40,maxHp:40,alive:true,x:4,y:4,tu:60,maxTu:60,weaponKind:'laser',ammo:30,fireTeamId:'alpha',fireTeamRole:'leader',fireTeamLeaderId:'lead',baseSoldier:{...base,id:'lead'},fearState:'steady'};
 return c.tacticalIssueFireTeamCommand([human],'alpha',{x:18,y:4},2,'selected-order',null,{kind,patrolRoute:[{x:4,y:4},{x:18,y:4},{x:18,y:18}],patrolIndex:1});
}
for(const kind of ['patrol','fallback-post','check-location']){
 test(`${kind} returns after combat and temporary medical priorities`,()=>{
  const c=runtimeContext();let units=fixture(c,kind),order=c.tacticalFireTeamCommandOrderForUnit(units[0],units);
  for(const flag of ['liveCombatPriority','lastKnownContactPriority','stabilizePriority','casualtyRecoveryPriority']){
   assert.notEqual(c.tacticalDefaultAiObjectiveDecision({unit:units[0],units,playerOrder:order,[flag]:true}).source,'player-command');
   units=JSON.parse(JSON.stringify(units));order=c.tacticalFireTeamCommandOrderForUnit(units[0],units);
   assert.equal(c.tacticalDefaultAiObjectiveDecision({unit:units[0],units,playerOrder:order}).source,'player-command');
   assert.equal(order.id,'selected-order');assert.equal(order.x,18);
  }
 });
 for(const tracked of [false,true])test(`${kind} resumes after ${tracked?'VIP':'civilian'} extraction across save reload`,()=>{
  const c=runtimeContext();let units=fixture(c,kind);
  const vip={id:'vip',team:'civilian',hp:18,alive:true,x:5,y:4,revealed:true,vipTracker:tracked,rescued:false};units.push(vip);
  units=c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:'civilian:vip'},[{id:'civilian:vip',type:'civilian',targetId:'vip',label:'Rescue',x:5,y:4}],3);
  units.find(u=>u.id==='vip').escortId='lead';
  units=c.tacticalReleaseCompletedVipEscortState(JSON.parse(JSON.stringify(units)));
  assert.equal(c.tacticalFireTeamCommandOrderForUnit(units[0],units),null,'no standing movement while escort is active');
  units.find(u=>u.id==='vip').rescued=true;
  units=c.tacticalReleaseCompletedVipEscortState(JSON.parse(JSON.stringify(units)));
  const order=c.tacticalFireTeamCommandOrderForUnit(units[0],units);
  assert.ok(order,'standing order restored automatically');assert.equal(order.id,'selected-order');assert.equal(order.kind,kind);assert.equal(order.x,18);
  assert.equal(c.tacticalDefaultAiObjectiveDecision({unit:units[0],units,playerOrder:order}).source,'player-command');
  if(kind==='patrol')assert.equal(order.patrolIndex,1);
  const plan=c.tacticalFireTeamCommandMovePlan({unit:units[0],target:order,covers:[],units,mission:{gridSize:32},reserveTu:0});
  assert.ok(plan.steps>0&&plan.path.length>1,'resumed command must advance toward its destination');
 });
 test(`${kind} is not resurrected after the player cancels it`,()=>{
  const c=runtimeContext();let units=fixture(c,kind);units=c.tacticalClearFireTeamCommand(units,'alpha','player-cleared',3);
  c.tacticalResetCompletedObjectiveTeamInPlace(units,'alpha',{reason:'assisted-objective-complete',round:5});
  assert.equal(c.tacticalFireTeamCommandOrderForUnit(units[0],units),null);
 });
}
test('temporary objective completion preserves a suspended fallback post',()=>{
 const c=runtimeContext(),units=fixture(c,'fallback-post');
 c.tacticalSuspendStandingFireTeamOrderInPlace(units,'alpha',c.tacticalFireTeamCommandOrderForUnit(units[0],units));
 c.tacticalResetCompletedObjectiveTeamInPlace(units,'alpha',{reason:'casualty-recovered',round:5});
 assert.equal(c.tacticalFireTeamCommandOrderForUnit(units[0],units)?.kind,'fallback-post');
});

for(const kind of ['patrol','fallback-post','check-location'])test(`${kind} drives actual AI movement after the fight ends`,async()=>{
 const c=runtimeContext();seededRandom(c);let units=fixture(c,kind);
 units[0].aiObjectiveType='VISIBLE_ALIEN';units[0].aiObjectiveSource='visible-contact';
 units.push({id:'defeated',team:'alien',hp:0,alive:false,x:7,y:4,revealed:true},{id:'unseen',team:'alien',hp:50,maxHp:50,alive:true,x:30,y:30,tu:0,maxTu:1,revealed:false,weaponKind:'alien'});
 const restored=JSON.parse(JSON.stringify({units,covers:[],round:6,gridSize:32}));
 const batch=await c.resolveMissionAiStreamBatchAsync({squad:[units[0].baseSoldier],mission:{id:'resumed-'+kind,kind:'Alien Incident',gridSize:32,incidentVipCount:0,incidentCivilianCount:0,incidentRescueCountVersion:2,clock:{minute:720}},initialBattleState:restored,batchRounds:1});
 const last=batch.continuation?.units?.find(u=>u.id==='lead')||batch.frames.flatMap(f=>f.soldiers||[]).filter(u=>u.id==='lead').at(-1);
 assert.ok(last&&last.x>4,'soldier must move toward the selected eastward order');
 if(kind==='patrol')assert.ok(last.fireTeamCommandOrderId==='selected-order','patrol identity retained');
});
test('one rescued VIP does not resume patrol while another follower still needs extraction',()=>{
 const c=runtimeContext();let units=fixture(c,'patrol');
 const objective={id:'civilian:vip',type:'civilian',targetId:'vip',x:5,y:4};
 units=c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:objective.id},[objective],3);
 units.push({id:'vip',team:'civilian',hp:18,rescued:true,escortId:'lead'},{id:'other',team:'civilian',hp:18,rescued:false,escortId:'lead'});
 units=c.tacticalReleaseCompletedVipEscortState(units);
 assert.equal(c.tacticalFireTeamCommandOrderForUnit(units[0],units),null);
 units.find(u=>u.id==='other').rescued=true;units=c.tacticalReleaseCompletedVipEscortState(units);
 assert.equal(c.tacticalFireTeamCommandOrderForUnit(units[0],units)?.id,'selected-order');
});

test('escort cleanup does not mutate prior playback objects or replace a newer order',()=>{
 const c=runtimeContext();let units=fixture(c,'patrol');const objective={id:'civilian:vip',type:'civilian',targetId:'vip',x:5,y:4};
 units=c.tacticalApplyFireTeamObjectiveAssignments(units,{alpha:objective.id},[objective],3);
 units.push({id:'vip',team:'civilian',hp:18,rescued:true,escortId:'lead'});
 const before=JSON.stringify(units);c.tacticalReleaseCompletedVipEscortState(units);assert.equal(JSON.stringify(units),before);
 units=c.tacticalIssueFireTeamCommand(units,'alpha',{x:8,y:12},5,'replacement-order',null,{kind:'fallback-post'});
 const after=c.tacticalReleaseCompletedVipEscortState(units),order=c.tacticalFireTeamCommandOrderForUnit(after[0],after);
 assert.equal(order.id,'replacement-order');assert.equal(order.y,12);
});
