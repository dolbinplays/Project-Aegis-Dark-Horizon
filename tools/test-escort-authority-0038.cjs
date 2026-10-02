const TACTICAL_FEAR_STATES={override:"override",pinned:"pinned",shaken:"shaken"};
const TACTICAL_FIRE_TEAM_TACTICAL_STATES={LIVE_COMBAT:"live-combat",ESCORT:"escort",LAST_KNOWN_CONTACT:"last-known-contact",REFORM:"reform",PERSISTENT_ASSIGNMENT:"persistent-assignment",DEFAULT_SEARCH:"default-search"};
const TACTICAL_DEFAULT_AI_PRIORITY_STACK={STABILIZE:10,ACTIVE_ESCORT:20,VISIBLE_ALIEN:30,CASUALTY_RECOVERY:40,LAST_KNOWN_CONTACT:50,ALIEN_BEACON:60,UFO_BAY:70,KNOWN_CIVILIAN:80,SEARCH:90};
const TACTICAL_VIP_PRIORITY_LOCK_PRIORITY=25;
const TACTICAL_ESCORT_AUTHORITY_CONSOLIDATION_PATCH=true;
const TACTICAL_ESCORT_CAPACITY=4;
const TACTICAL_FIRE_TEAM_RALLY_TU_COST=8;
const TACTICAL_CASUALTY_DRAG_STEP_TU=8;
function tacticalHumanCombatActive(u){return !!(u&&u.team==="human"&&Number(u.hp)>0&&u.alive!==false&&!u.downed&&!u.unconscious);}
function tacticalFireTeamLeaderForUnit(u,units){if(!u)return null;return units.find(x=>x.team==="human"&&x.fireTeamId===u.fireTeamId&&x.fireTeamRole==="leader")||u;}
function tacticalFireTeamIsLeader(u,units){return tacticalFireTeamLeaderForUnit(u,units)?.id===u?.id;}
function tacticalFireTeamTurnOrder(list){return [...list];}
function tacticalFireTeamObjectiveAssignmentForTeam(units,teamId){const u=units.find(x=>x.team==="human"&&x.fireTeamId===teamId);return u?.fireTeamObjectiveAssignmentMode?{mode:u.fireTeamObjectiveAssignmentMode,type:u.fireTeamObjectiveAssignmentType,targetId:u.fireTeamObjectiveAssignmentTargetId,label:u.fireTeamObjectiveAssignmentLabel,vipCommitmentEnabled:u.fireTeamVipRescueCommitmentEnabled,vipCommitmentTargetId:u.fireTeamVipRescueCommitmentTargetId,vipCommitmentRescuerId:u.fireTeamVipRescueCommitmentRescuerId}:{mode:"default",objectiveId:"default"};}
function tacticalDefaultAiPriorityRank(key="SEARCH"){return Number(TACTICAL_DEFAULT_AI_PRIORITY_STACK[String(key).toUpperCase()])||90;}
function tacticalFireTeamOrderIsStanding(){return false;}
function tacticalFireTeamOrderKindLabel(){return "Move";}
function tacticalFireTeamMembers(units,teamId){return units.filter(u=>u.team==="human"&&u.fireTeamId===teamId&&u.hp>0&&u.alive!==false);}
function tacticalFireTeamDirectionIndex(){return 0;}
function tacticalBuildingCellAt(){return null;}
function tacticalFireTeamFlankDoorTargets(){return [];}
function tacticalFireTeamStep(origin,dir,steps=1){return {x:origin.x,y:origin.y+steps};}
function tacticalHumanIsDowned(){return false;}
function tacticalHumanIsBleeding(){return false;}
function tacticalFireIntensityAt(){return 0;}
function tacticalSmokeDensityAt(){return 0;}
function tacticalEscortFollowers(units = [], escortId = null) {
  // The physical escortId relationship is the one authoritative ownership record.
  // Visibility/revealed state, fire-team role, panic and temporary search state do not release ownership.
  return (Array.isArray(units)?units:[])
    .filter((unit) => unit?.team === "civilian" && !unit.downed && !unit.unconscious && Number(unit.hp) > 0 && unit.alive !== false && !unit.rescued && unit.escortId === escortId)
    .sort((left, right) => (left.escortOrder || 0) - (right.escortOrder || 0) || String(left.id).localeCompare(String(right.id)));
}

function tacticalEscortOwnerState(unit=null,units=[],options={}){
  const safeUnits=Array.isArray(units)?units:[],excludedSource=options?.excludedIds;
  const excluded=excludedSource instanceof Set?excludedSource:new Set(Array.isArray(excludedSource)?excludedSource:[]);
  const followers=unit?.id?tacticalEscortFollowers(safeUnits,unit.id):[];
  const ownerAlive=Boolean(unit&&unit.team==="human"&&tacticalHumanCombatActive(unit)&&!unit.rescued);
  const active=Boolean(ownerAlive&&followers.length);
  const fearOverride=Boolean(active&&unit.fearState===TACTICAL_FEAR_STATES.override);
  const playerOwned=Boolean(active&&unit.hybridPlayerControlledLead);
  const medicallyReserved=Boolean(active&&excluded.has(unit.id));
  const actionable=Boolean(active&&!fearOverride&&!playerOwned&&!medicallyReserved);
  const blockedReason=!active?(followers.length?"owner-unavailable":"no-followers"):fearOverride?"fear-override":playerOwned?"hybrid-player-owned":medicallyReserved?"priority-1-stabilization":null;
  return{active,actionable,owner:unit||null,ownerId:unit?.id||null,fireTeamId:unit?.fireTeamId||null,followers,civilianIds:followers.map(civilian=>civilian.id),followerCount:followers.length,hiddenFollowerCount:followers.filter(civilian=>civilian.revealed!==true).length,blockedReason};
}

function tacticalActiveEscortOwnerIds(units=[],excludedIds=new Set()){
  const safeUnits=Array.isArray(units)?units:[],excluded=excludedIds instanceof Set?excludedIds:new Set(excludedIds||[]);
  return safeUnits.filter(unit=>tacticalEscortOwnerState(unit,safeUnits,{excludedIds:excluded}).actionable).map(unit=>unit.id);
}

function tacticalEscortOwnerDiagnostics(units=[],options={}){
  const safeUnits=Array.isArray(units)?units:[],excludedIds=options?.excludedIds instanceof Set?options.excludedIds:new Set(options?.excludedIds||[]);
  return safeUnits.filter(unit=>unit?.team==="human").map(unit=>tacticalEscortOwnerState(unit,safeUnits,{excludedIds})).filter(state=>state.active).map(state=>{const name=state.owner?.name||state.ownerId||"AEGIS";const count=state.followerCount;return{ownerId:state.ownerId,ownerName:name,fireTeamId:state.fireTeamId,followerIds:[...state.civilianIds],followerCount:count,hiddenFollowerCount:state.hiddenFollowerCount,actionable:state.actionable,blockedReason:state.blockedReason,diagnostic:`${name} — ACTIVE ESCORT | ${count} follower${count===1?"":"s"} | ${state.actionable?"turn eligible":`paused: ${state.blockedReason||"higher authority"}`}`};});
}

function tacticalEscortLeaderLockState(unit=null,units=[]){
  // Compatibility name retained for older callers; Browser 0038 makes this actor-level.
  const safeUnits=Array.isArray(units)?units:[],ownerState=tacticalEscortOwnerState(unit,safeUnits);
  return{active:ownerState.active,leader:ownerState.active?unit:(unit?tacticalFireTeamLeaderForUnit(unit,safeUnits):null),owner:ownerState.owner,followers:ownerState.followers,civilianIds:ownerState.civilianIds,fireTeamId:ownerState.fireTeamId,ownerState};
}
const TACTICAL_ESCORT_CONTACT_DISTANCE = TACTICAL_ESCORT_CAPACITY + 1;

function tacticalActiveEscortActorIds(units=[],excludedIds=new Set()){
  return tacticalActiveEscortOwnerIds(units,excludedIds);
}

function tacticalAiRescueActorOrder(units=[],round=1,excludedLeaderIds=[]){
  const safeUnits=Array.isArray(units)?units:[];
  const excluded=new Set(Array.isArray(excludedLeaderIds)?excludedLeaderIds:excludedLeaderIds instanceof Set?Array.from(excludedLeaderIds):[]);
  const livingHumans=safeUnits.filter(unit=>tacticalHumanCombatActive(unit)&&!excluded.has(unit.id));
  const escortOwners=livingHumans.filter(unit=>tacticalEscortOwnerState(unit,safeUnits).active).sort((left,right)=>tacticalEscortOwnerState(right,safeUnits).followerCount-tacticalEscortOwnerState(left,safeUnits).followerCount||String(left.id).localeCompare(String(right.id)));
  const actors=[];const coordinatedTeams=new Set();
  // Each physical escort owner needs a turn, even when several belong to one fire team.
  escortOwners.forEach(owner=>{coordinatedTeams.add(owner.fireTeamId||`solo:${owner.id}`);actors.push(owner);});
  livingHumans.filter(unit=>unit.fireTeamVipRescueCommitmentEnabled&&unit.fireTeamVipRescueCommitmentRescuerId===unit.id).forEach(rescuer=>{const teamKey=rescuer.fireTeamId||`solo:${rescuer.id}`;if(coordinatedTeams.has(teamKey))return;coordinatedTeams.add(teamKey);actors.push(rescuer);});
  livingHumans.filter(unit=>tacticalFireTeamIsLeader(unit,safeUnits)).forEach(leader=>{const teamKey=leader.fireTeamId||`solo:${leader.id}`;if(coordinatedTeams.has(teamKey))return;coordinatedTeams.add(teamKey);actors.push(leader);});
  return tacticalFireTeamTurnOrder(actors,round);
}
const TACTICAL_AI_EXTRACTION_CORRIDOR_CIVILIAN_PRIORITY_YIELD_PATCH=true;

function tacticalDefaultAiObjectiveDecision({unit=null,units=[],round=1,stabilizePriority=false,casualtyRecoveryPriority=false,liveCombatPriority=false,lastKnownContactPriority=false,civilianDutyIds=null,postContactRecovery=null,playerOrder=null,assignedBeaconAssault=null,beaconAssignmentNeutralization=null,reinforcementSourcePriorityKind=null,knownCivilianPriority=false,objectiveTarget=null,objectiveSource=null}={}){
  const safeUnits=Array.isArray(units)?units:[];
  const assignment=unit?.fireTeamId?tacticalFireTeamObjectiveAssignmentForTeam(safeUnits,unit.fireTeamId):{mode:"default",objectiveId:TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT};
  const members=unit?.fireTeamId?safeUnits.filter(candidate=>candidate?.team==="human"&&candidate.hp>0&&candidate.alive!==false&&candidate.fireTeamId===unit.fireTeamId):unit?[unit]:[];
  const escortLeaderLock=tacticalEscortLeaderLockState(unit,safeUnits);
  const unitEscortActive=Boolean(escortLeaderLock.active||civilianDutyIds?.has?.(unit?.id));
  const teamEscortActive=Boolean(escortLeaderLock.active||members.some(member=>civilianDutyIds?.has?.(member.id)));
  const assignmentType=assignment?.mode==="assist"?(assignment.assistObjectiveType||assignment.type):assignment?.type;
  const beaconPersistent=Boolean(assignedBeaconAssault?.assigned||beaconAssignmentNeutralization?.active||assignmentType==="beacon"||assignmentType==="command-core");
  const ufoPersistent=Boolean(assignmentType==="ufo-bay");
  const civilianPersistent=Boolean(knownCivilianPriority||assignmentType==="civilian");
  const vipPriorityLockActive=Boolean(unit&&assignment?.mode==="explicit"&&assignment.type==="civilian"&&assignment.vipCommitmentEnabled&&assignment.vipCommitmentTargetId===assignment.targetId&&assignment.vipCommitmentRescuerId===unit.id);
  const assignmentPersistent=Boolean(assignment?.mode&&assignment.mode!=="default");
  const commandPersistent=Boolean(playerOrder);
  const candidates=[];
  const add=(type,key,priorityKey,reason,label,source=objectiveSource,target=objectiveTarget)=>candidates.push({type,key,priority:tacticalDefaultAiPriorityRank(priorityKey),reason,label,source:source||reason,target:target||null});
  if(stabilizePriority)add("STABILIZE","stabilize","STABILIZE","bleeding-casualty-requires-stabilization","Stabilize bleeding casualty","casualty-triage");
  if(unitEscortActive)add("ACTIVE_ESCORT",TACTICAL_FIRE_TEAM_TACTICAL_STATES.ESCORT,"ACTIVE_ESCORT",escortLeaderLock.active?"escort-owner-locked-until-extraction":"active-civilian-vip-escort",escortLeaderLock.active?"Civilian/VIP escort - owner locked":"Civilian/VIP escort","escort-duty");
  if(vipPriorityLockActive)candidates.push({type:"VIP_PRIORITY_LOCK",key:TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,priority:TACTICAL_VIP_PRIORITY_LOCK_PRIORITY,reason:"player-vip-priority-lock",label:assignment.label||"Committed civilian/VIP rescue",source:"player-vip-priority-lock",target:objectiveTarget||null});
  if(liveCombatPriority)add("VISIBLE_ALIEN",TACTICAL_FIRE_TEAM_TACTICAL_STATES.LIVE_COMBAT,"VISIBLE_ALIEN","visible-alien-contact","Engage visible alien contact",objectiveSource||"visible-contact");
  if(casualtyRecoveryPriority)add("CASUALTY_RECOVERY","casualty-recovery","CASUALTY_RECOVERY","downed-casualty-recovery-extraction","Recover/extract downed AEGIS soldier","casualty-recovery");
  if(lastKnownContactPriority)add("LAST_KNOWN_CONTACT",TACTICAL_FIRE_TEAM_TACTICAL_STATES.LAST_KNOWN_CONTACT,"LAST_KNOWN_CONTACT","unresolved-last-known-contact","Investigate Last Known Contact",objectiveSource||"last-known-contact");
  if(reinforcementSourcePriorityKind==="beacon"||beaconPersistent)add("ALIEN_BEACON",TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,"ALIEN_BEACON","assigned-beacon-assault","Alien Field Beacon assault","beacon-assignment");
  if(reinforcementSourcePriorityKind==="ufo-bay"||ufoPersistent)add("UFO_BAY",TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,"UFO_BAY","ufo-bay-clearance","Clear crashed UFO bay","ufo-bay-assignment");
  if(civilianPersistent)add("KNOWN_CIVILIAN",TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,"KNOWN_CIVILIAN","known-civilian-rescue",assignment.label||"Approach known civilian/VIP","civilian-assignment");
  if(assignmentPersistent)candidates.push({type:"ASSIGNED_OBJECTIVE",key:TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,priority:85,reason:`assigned-objective:${assignment.type||assignment.mode||"objective"}`,label:assignment.label||"Assigned mission objective",source:"persistent-assignment",target:objectiveTarget||null});
  if(commandPersistent)candidates.push({type:"ASSIGNED_OBJECTIVE",key:TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT,priority:tacticalFireTeamOrderIsStanding(playerOrder)?88:85,reason:`fire-team-order:${playerOrder?.kind||"command"}`,label:tacticalFireTeamOrderKindLabel(playerOrder),source:"player-command",target:playerOrder?{x:playerOrder.x,y:playerOrder.y,id:playerOrder.id}:null});
  add("SEARCH",TACTICAL_FIRE_TEAM_TACTICAL_STATES.DEFAULT_SEARCH,"SEARCH","no-higher-priority-duty","Default sector search","fallback-search");
  const selected=[...candidates].sort((left,right)=>left.priority-right.priority)[0];
  return{...selected,round:Math.max(1,Number(round)||1),assignment,leader:tacticalFireTeamLeaderForUnit(unit,members)||unit,members,escortActive:teamEscortActive,unitEscortActive,escortLeaderLock,persistent:Boolean(selected.key===TACTICAL_FIRE_TEAM_TACTICAL_STATES.PERSISTENT_ASSIGNMENT),formationRecoveryActive:Boolean(postContactRecovery?.active&&postContactRecovery?.needsFormation),allowsGenericSearch:selected.type==="SEARCH",candidates};
}

function tacticalFireTeamFormationTargets(units=[],leader=null,covers=[],mission={}){
  const targets=new Map();
  if(!leader)return targets;
  const members=tacticalFireTeamMembers(units,leader.fireTeamId).filter(unit=>unit.id!==leader.id&&!tacticalEscortOwnerState(unit,units).active);
  const followers=tacticalEscortFollowers(units,leader.id);
  const direction=tacticalFireTeamDirectionIndex(leader.facing||"E");
  const rear=(direction+3)%6,rearLeft=(direction+2)%6,rearRight=(direction+4)%6;
  const leaderBuilding=tacticalBuildingCellAt(leader.x,leader.y,mission||{})?.building||null;
  const doorTargets=leaderBuilding?tacticalFireTeamFlankDoorTargets(leader,units,covers,mission):[];
  followers.forEach((civilian,index)=>targets.set(civilian.id,tacticalFireTeamStep(leader,rear,index+1)));
  const lastFollower=followers.length?targets.get(followers[followers.length-1].id):null;
  members.forEach(member=>{
    let target=null;
    if(member.fireTeamExtractionGuardActive&&Number.isFinite(Number(member.fireTeamExtractionGuardX))&&Number.isFinite(Number(member.fireTeamExtractionGuardY)))target={x:Number(member.fireTeamExtractionGuardX),y:Number(member.fireTeamExtractionGuardY)};
    else if(leaderBuilding&&doorTargets.length){
      if(member.fireTeamRole==="left")target=doorTargets[0]||doorTargets[1];
      else if(member.fireTeamRole==="right")target=doorTargets[1]||doorTargets[0];
      else target={x:Number(leader.fireTeamEntryOutsideX),y:Number(leader.fireTeamEntryOutsideY)};
    }else if(lastFollower){
      if(member.fireTeamRole==="left")target=tacticalFireTeamStep(lastFollower,rearLeft,1);
      else if(member.fireTeamRole==="right")target=tacticalFireTeamStep(lastFollower,rearRight,1);
      else target=tacticalFireTeamStep(lastFollower,rear,1);
    }else if(member.fireTeamRole==="wingman")target=tacticalFireTeamStep(leader,rear,2);
    else if(member.fireTeamRole==="left")target=tacticalFireTeamStep(leader,rearLeft,2);
    else if(member.fireTeamRole==="right")target=tacticalFireTeamStep(leader,rearRight,2);
    else target=tacticalFireTeamStep(leader,rear,2);
    if(target)targets.set(member.id,target);
  });
  return targets;
}

function tacticalThreeStatusConditions(unit=null,covers=[],units=[]){if(!unit)return[];const statuses=[];const add=(key,short,label,description,tone)=>statuses.push({key,short,label,description,tone});if(unit.casualtyExtracted||unit.extracted)add("casualty-extracted","EVAC","Casualty Extracted","This unconscious casualty is safely aboard the Skyranger and will survive a withdrawal.","border-cyan-200/70 bg-cyan-950/80 text-cyan-50");if(tacticalHumanIsDowned(unit))add("downed","DWN","Downed / Unconscious","This soldier is alive but unconscious and cannot act or provide vision. An adjacent conscious AEGIS soldier can stabilize active bleeding with a Field Medkit or secure and drag them to safer ground.","border-red-200/80 bg-red-950/90 text-red-50");if(unit.draggingCasualtyId)add("dragging-casualty","DRG","Dragging Casualty",`This soldier is dragging a downed teammate. Movement costs ${TACTICAL_CASUALTY_DRAG_STEP_TU} TU per hex until the casualty is released.`,"border-amber-200/70 bg-amber-950/75 text-amber-50");if(unit.fearState===TACTICAL_FEAR_STATES.override)add("panicked","PAN","Panicked",`Fear has overridden normal orders. Current forced response: ${String(unit.fearForcedAction||"freeze").replaceAll("-"," ")}. A recovery check occurs at the next normal turn start.`,"border-rose-300/70 bg-rose-950/80 text-rose-100");else if(unit.fearState===TACTICAL_FEAR_STATES.pinned)add("pinned","PIN","Pinned","Heavy morale pressure is limiting this soldier's combat performance and accuracy.","border-orange-300/70 bg-orange-950/80 text-orange-100");else if(unit.fearState===TACTICAL_FEAR_STATES.shaken)add("shaken","SHK","Shaken","Morale pressure is applying a moderate accuracy penalty until the soldier steadies.","border-amber-300/70 bg-amber-950/80 text-amber-100");if(tacticalHumanIsBleeding(unit))add("bleeding","BLD","Bleeding",`This downed casualty is unstable. ${Math.max(0,Number(unit.bleedOutRounds)||0)} round${Math.max(0,Number(unit.bleedOutRounds)||0)===1?"":"s"} remain before critical collapse unless an adjacent responder stabilizes them.`,"border-red-300/70 bg-red-950/80 text-red-100");else if(unit.bleeding||Number(unit.bleedTurns)>0)add("bleeding","BLD","Bleeding","This unit has an active bleeding condition and needs medical attention.","border-red-300/70 bg-red-950/80 text-red-100");if(tacticalHumanIsDowned(unit)&&unit.stabilized)add("stabilized","STB","Stabilized","Bleeding is controlled. This casualty remains unconscious and cannot act, but the battlefield bleed-out clock is stopped.","border-emerald-300/70 bg-emerald-950/75 text-emerald-100");const maxHp=Math.max(1,Number(unit.maxHp)||Number(unit.hp)||1);if(Number(unit.hp)<maxHp||Number(unit.baseSoldier?.injuryDays)>0)add("wounded","WND","Wounded",`Current health is ${Math.max(0,Math.round(Number(unit.hp)||0))}/${Math.round(maxHp)}. Existing injuries may also reduce combat stats.`,"border-rose-200/55 bg-rose-950/55 text-rose-100");if(unit.kneeling)add("kneeling","KNL","Kneeling","The soldier is kneeling, affecting stance-based accuracy, defense, and movement costs.","border-sky-300/60 bg-sky-950/65 text-sky-100");if(tacticalFireIntensityAt(covers,unit.x,unit.y)>0)add("burning","FIR","In Fire","The occupied hex is burning and can inflict continuing battlefield harm.","border-orange-300/70 bg-orange-950/85 text-orange-100");if(tacticalSmokeDensityAt(covers,unit.x,unit.y)>0)add("smoke","SMK","In Smoke","Smoke at this hex can interfere with tactical visibility and shooting.","border-slate-300/65 bg-slate-800/90 text-slate-100");if(Number(unit.fearRallyBonus)>0)add("rallied","RLY","Rallied",`A teammate spent ${TACTICAL_FIRE_TEAM_RALLY_TU_COST} TU to add +${Math.round(Number(unit.fearRallyBonus))} to this soldier's next normal fear-recovery check. No extra check is created.`,"border-emerald-300/65 bg-emerald-950/70 text-emerald-100");if(unit.fireTeamLeadershipState==="acting-leader")add("acting-leader","ACT","Acting Leader","This soldier temporarily commands the fire team while its formal leader is under a fear override.","border-violet-300/70 bg-violet-950/75 text-violet-100");if(unit.fireTeamLeadershipState==="leader-overridden")add("command-disrupted","CMD","Command Disrupted","Fear has suspended this leader's command authority until a normal recovery check succeeds.","border-fuchsia-300/70 bg-fuchsia-950/75 text-fuchsia-100");if(tacticalEscortOwnerState(unit,units).active||unit.aiVipRescueTargetId)add("escort","ESC","Escort Duty","This soldier has an active civilian or VIP rescue responsibility.","border-emerald-300/60 bg-emerald-950/70 text-emerald-100");return statuses;}

const leader={id:"lead",name:"Lead",team:"human",hp:40,alive:true,x:10,y:10,tu:60,fireTeamId:"alpha",fireTeamRole:"leader"};
const a={...leader,id:"pavel",name:"Pavel",fireTeamRole:"left",x:9,y:10}; const b={...leader,id:"finn",name:"Finn",fireTeamRole:"right",x:11,y:10};
const vip=(id,owner,order,revealed=false)=>({id,name:id,team:"civilian",hp:18,alive:true,x:8+order,y:12,rescued:false,escortId:owner,escortOrder:order,escortJoined:true,revealed});
const units=[leader,a,b,vip("v1",a.id,1,false),vip("v2",a.id,2,false),vip("v3",a.id,3,false),vip("v4",b.id,1,true)];
const tests=[]; const t=(name,pass)=>tests.push({name,pass:!!pass});
const sa=tacticalEscortOwnerState(a,units),sb=tacticalEscortOwnerState(b,units);
t("hidden followers remain authoritative",sa.active&&sa.followerCount===3&&sa.hiddenFollowerCount===3);
t("two support owners both active",tacticalActiveEscortOwnerIds(units).includes(a.id)&&tacticalActiveEscortOwnerIds(units).includes(b.id));
const rescueOrder=tacticalAiRescueActorOrder(units,1,[]).map(x=>x.id); t("two same-team owners both scheduled",rescueOrder.includes(a.id)&&rescueOrder.includes(b.id));
const pr=tacticalDefaultAiObjectiveDecision({unit:a,units,round:1,liveCombatPriority:true,civilianDutyIds:new Set()}); t("support owner beats visible contact",pr.type==="ACTIVE_ESCORT"&&pr.priority===20&&pr.unitEscortActive);
const targets=tacticalFireTeamFormationTargets(units,leader,[],{}); t("formation excludes other escort owners",!targets.has(a.id)&&!targets.has(b.id));
const status=tacticalThreeStatusConditions(a,[],units).map(x=>x.key); t("status shows escort from real unit list",status.includes("escort"));
t("compat owner lock recognizes support owner",tacticalEscortLeaderLockState(a,units).active&&tacticalEscortLeaderLockState(a,units).leader.id===a.id);
const diag=tacticalEscortOwnerDiagnostics(units).find(x=>x.ownerId===a.id); t("diagnostic reports three hidden followers",diag&&diag.followerCount===3&&diag.hiddenFollowerCount===3&&/ACTIVE ESCORT/.test(diag.diagnostic));
console.log(`${tests.filter(x=>x.pass).length}/${tests.length}`); for(const x of tests)console.log(`${x.pass?'PASS':'FAIL'} ${x.name}`); if(tests.some(x=>!x.pass))process.exit(1);
