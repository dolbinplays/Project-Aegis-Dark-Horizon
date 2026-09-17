const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'src', 'browser-runtime.html');
const source = fs.readFileSync(runtimePath, 'utf8');

function extractFunction(name) {
  const marker = `function ${name}(`;
  const start = source.indexOf(marker);
  assert.ok(start >= 0, `${name} should exist`);
  const openParen = source.indexOf('(', start);
  let parenDepth = 0, closeParen = -1, quote = null, escaped = false;
  for (let i = openParen; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '(') parenDepth += 1;
    else if (ch === ')' && --parenDepth === 0) { closeParen = i; break; }
  }
  const brace = source.indexOf('{', closeParen);
  let depth = 0; quote = null; escaped = false;
  for (let i = brace; i < source.length; i += 1) {
    const ch = source[i];
    if (quote) {
      if (escaped) escaped = false;
      else if (ch === '\\') escaped = true;
      else if (ch === quote) quote = null;
      continue;
    }
    if (ch === '"' || ch === "'" || ch === '`') { quote = ch; continue; }
    if (ch === '{') depth += 1;
    else if (ch === '}' && --depth === 0) return source.slice(start, i + 1);
  }
  throw new Error(`Could not extract ${name}`);
}

function makeContext({assignmentType=null, escortLeader=false}={}) {
  const context = {
    Math, Number, Boolean, String, Array, Object, Set, Map,
    TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT:'default',
    TACTICAL_FIRE_TEAM_TACTICAL_STATES: {
      LIVE_COMBAT:'live-combat', ESCORT:'escort', LAST_KNOWN_CONTACT:'last-known-contact',
      REFORM:'reform', PERSISTENT_ASSIGNMENT:'persistent-assignment', DEFAULT_SEARCH:'default-search'
    },
    TACTICAL_DEFAULT_AI_PRIORITY_STACK: {
      STABILIZE:10, CASUALTY_RECOVERY:20, ACTIVE_ESCORT:30, VISIBLE_ALIEN:40,
      LAST_KNOWN_CONTACT:50, ALIEN_BEACON:60, UFO_BAY:70, KNOWN_CIVILIAN:80, SEARCH:90
    },
    tacticalDefaultAiPriorityRank: key => ({
      STABILIZE:10,CASUALTY_RECOVERY:20,ACTIVE_ESCORT:30,VISIBLE_ALIEN:40,
      LAST_KNOWN_CONTACT:50,ALIEN_BEACON:60,UFO_BAY:70,KNOWN_CIVILIAN:80,SEARCH:90
    }[String(key || 'SEARCH').toUpperCase()] || 90),
    tacticalFireTeamObjectiveAssignmentForTeam: () => assignmentType
      ? {mode:'explicit',type:assignmentType,objectiveId:`obj-${assignmentType}`,label:`Assigned ${assignmentType}`}
      : {mode:'default',objectiveId:'default'},
    tacticalHumanCombatActive: unit => Boolean(unit && unit.team === 'human' && unit.alive !== false && Number(unit.hp) > 0 && !unit.downed && !unit.unconscious && !unit.extracted && !unit.casualtyExtracted),
    tacticalFireTeamLeaderForUnit: (unit, units) => units.find(candidate => candidate.id === 'leader') || unit,
  };
  vm.createContext(context);
  vm.runInContext(`
    ${extractFunction('tacticalEscortFollowers')}
    ${extractFunction('tacticalEscortLeaderLockState')}
    ${extractFunction('tacticalDefaultAiObjectiveDecision')}
    ${extractFunction('tacticalFireTeamPriorityState')}
    ${extractFunction('tacticalAiClearExplorationRouteInPlace')}
    ${extractFunction('tacticalAiClearCivilianApproachRouteInPlace')}
    ${extractFunction('tacticalAiClearContactSearchRouteInPlace')}
    ${extractFunction('tacticalDefaultAiObjectiveTargetDescriptor')}
    ${extractFunction('tacticalInvalidateLowerPriorityAiRoutesInPlace')}
    ${extractFunction('tacticalRecordDefaultAiObjectiveInPlace')}
    ${extractFunction('tacticalDefaultAiObjectiveDiagnostic')}
    ${extractFunction('tacticalApplyFireTeamPriorityStateInPlace')}
    this.resolve = tacticalDefaultAiObjectiveDecision;
    this.apply = tacticalApplyFireTeamPriorityStateInPlace;
    this.diag = tacticalDefaultAiObjectiveDiagnostic;
  `, context);
  return context;
}

function actor(id='leader') {
  return {
    id, name:id, team:'human', hp:40, alive:true, fireTeamId:'alpha',
    aiAlienHuntMode:'fog-sweep', aiAlienHuntTargetX:3, aiAlienHuntTargetY:4, aiAlienHuntIndex:2,
    aiPatrolIndex:1, aiPatrolTargetX:5, aiPatrolTargetY:6, aiMoveVisited:['3,4'],
    aiVipApproachStage:'approach', aiVipApproachStallCount:2, aiVipApproachIngressOpeningX:9,
    aiVipRescueTargetId:'vip-1', aiContactSearchIndex:2, aiContactSearchTargetX:20, aiContactSearchTargetY:20
  };
}

test('build/save identity and central authority marker are current', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\.09\.17\.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH"/);
  assert.match(source, /const TACTICAL_DEFAULT_AI_CENTRAL_OBJECTIVE_AUTHORITY_AND_ROUTE_INVALIDATION_PATCH=true/);
  assert.match(source, /const TACTICAL_AI_COMMAND_STREAM_HANDOFF_AND_ESCORT_LOCK_RUNTIME_HOTFIX=true/);
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('priority 1 stabilization outranks visible alien, escort, Beacon and search', () => {
  const c=makeContext({assignmentType:'beacon'}), u=actor(), units=[u];
  const result=c.resolve({unit:u,units,stabilizePriority:true,casualtyRecoveryPriority:true,liveCombatPriority:true,civilianDutyIds:new Set([u.id]),lastKnownContactPriority:true,assignedBeaconAssault:{assigned:true}});
  assert.equal(result.type,'STABILIZE'); assert.equal(result.priority,10);
});

test('priority 2 casualty recovery outranks escort and visible alien', () => {
  const c=makeContext(), u=actor(), units=[u];
  const result=c.resolve({unit:u,units,casualtyRecoveryPriority:true,liveCombatPriority:true,civilianDutyIds:new Set([u.id])});
  assert.equal(result.type,'CASUALTY_RECOVERY'); assert.equal(result.priority,20);
});

test('active escort outranks visible alien for retained escort actor', () => {
  const c=makeContext(), u=actor(), units=[u];
  const result=c.resolve({unit:u,units,liveCombatPriority:true,civilianDutyIds:new Set([u.id])});
  assert.equal(result.type,'ACTIVE_ESCORT'); assert.equal(result.priority,30);
});

test('Engage escort support released from duty resolves to visible alien', () => {
  const c=makeContext(), leader=actor('leader'), support=actor('support'), units=[leader,support];
  const result=c.resolve({unit:support,units,liveCombatPriority:true,civilianDutyIds:new Set([leader.id])});
  assert.equal(result.type,'VISIBLE_ALIEN'); assert.equal(result.priority,40);
});

test('visible alien interrupts known civilian approach and exploration', () => {
  const c=makeContext({assignmentType:'civilian'}), u=actor(), units=[u];
  const state=c.resolve({unit:u,units,liveCombatPriority:true,knownCivilianPriority:true,objectiveTarget:{id:'alien-1',x:14,y:8},objectiveSource:'contact-interrupt'});
  c.apply(units,'alpha',state,8,{actorId:u.id,interruptReason:'new-visible-alien-contact'});
  assert.equal(u.aiObjectiveType,'VISIBLE_ALIEN');
  assert.equal(u.aiAlienHuntMode,null); assert.equal(u.aiPatrolTargetX,null);
  assert.equal(u.aiVipApproachStage,null);
  assert.equal(u.aiVipRescueTargetId,'vip-1', 'persistent assignment identity is retained while route scratch is canceled');
  assert.equal(u.aiObjectiveTargetId,'alien-1');
});

test('Last Known Contact takes over after visual contact is lost even with Beacon assignment', () => {
  const c=makeContext({assignmentType:'beacon'}), u=actor(), units=[u];
  const state=c.resolve({unit:u,units,liveCombatPriority:false,lastKnownContactPriority:true,assignedBeaconAssault:{assigned:true},objectiveTarget:{id:'lkc',x:18,y:11}});
  assert.equal(state.type,'LAST_KNOWN_CONTACT'); assert.equal(state.priority,50);
  const lockIndex=source.indexOf('const earlyBeaconEngagementLock=tacticalFireTeamBeaconEngagementLockState');
  assert.ok(lockIndex >= 0);
  assert.doesNotMatch(source.slice(lockIndex,lockIndex+500), /if\(earlyBeaconEngagementLock\.active\)lastKnownContactPriority=false/);
});

test('visible alien outranks Beacon', () => {
  const c=makeContext({assignmentType:'beacon'}), u=actor();
  assert.equal(c.resolve({unit:u,units:[u],liveCombatPriority:true,assignedBeaconAssault:{assigned:true}}).type,'VISIBLE_ALIEN');
});

test('Beacon outranks crashed-UFO bay', () => {
  const c=makeContext({assignmentType:'beacon'}), u=actor();
  const result=c.resolve({unit:u,units:[u],reinforcementSourcePriorityKind:'beacon',assignedBeaconAssault:{assigned:true}});
  assert.equal(result.type,'ALIEN_BEACON'); assert.equal(result.priority,60);
});

test('crashed-UFO bay outranks known civilian approach', () => {
  const c=makeContext({assignmentType:'ufo-bay'}), u=actor();
  const result=c.resolve({unit:u,units:[u],reinforcementSourcePriorityKind:'ufo-bay',knownCivilianPriority:true});
  assert.equal(result.type,'UFO_BAY'); assert.equal(result.priority,70);
});

test('known unassigned civilian outranks exploration', () => {
  const c=makeContext({assignmentType:'civilian'}), u=actor();
  const result=c.resolve({unit:u,units:[u],knownCivilianPriority:true});
  assert.equal(result.type,'KNOWN_CIVILIAN'); assert.equal(result.priority,80); assert.equal(result.allowsGenericSearch,false);
});

test('exploration is selected only when every higher category is absent', () => {
  const c=makeContext(), u=actor();
  const result=c.resolve({unit:u,units:[u]});
  assert.equal(result.type,'SEARCH'); assert.equal(result.priority,90); assert.equal(result.allowsGenericSearch,true);
});

test('post-contact formation recovery is overlay metadata and never a strategic candidate', () => {
  const c=makeContext(), u=actor();
  const result=c.resolve({unit:u,units:[u],postContactRecovery:{active:true,needsFormation:true}});
  assert.equal(result.type,'SEARCH');
  assert.equal(result.formationRecoveryActive,true);
  assert.ok(!result.candidates.some(candidate=>candidate.type==='REFORM'));
});

test('actor-scoped state prevents break-off support from overwriting escort leader objective', () => {
  const c=makeContext(), leader=actor('leader'), support=actor('support'), units=[leader,support];
  const escort=c.resolve({unit:leader,units,liveCombatPriority:true,civilianDutyIds:new Set([leader.id])});
  const combat=c.resolve({unit:support,units,liveCombatPriority:true,civilianDutyIds:new Set([leader.id]),objectiveTarget:{id:'alien-1',x:15,y:15}});
  c.apply(units,'alpha',escort,9,{actorId:'leader'});
  c.apply(units,'alpha',combat,9,{actorId:'support'});
  assert.equal(leader.aiObjectiveType,'ACTIVE_ESCORT');
  assert.equal(support.aiObjectiveType,'VISIBLE_ALIEN');
  assert.equal(leader.fireTeamTacticalStateKey,'escort');
  assert.equal(support.fireTeamTacticalStateKey,'live-combat');
});

test('higher priority transition records why stale objective was interrupted', () => {
  const c=makeContext(), u=actor();
  u.aiObjectiveType='SEARCH'; u.aiObjectivePriority=90; u.aiObjectiveRevision=2;
  const state=c.resolve({unit:u,units:[u],liveCombatPriority:true,objectiveTarget:{id:'alien-2',x:21,y:7},objectiveSource:'contact-interrupt'});
  c.apply([u],'alpha',state,10,{actorId:u.id,interruptReason:'new-visible-alien-contact'});
  const d=c.diag(u);
  assert.equal(d.previousType,'SEARCH'); assert.equal(d.previousPriority,90);
  assert.equal(d.interruptedBy,'new-visible-alien-contact'); assert.equal(d.target.id,'alien-2');
  assert.equal(d.revision,3);
});

test('Last Known Contact obstruction holds the report instead of falling back to generic patrol', () => {
  const fn=extractFunction('tacticalAiReportedContactSearchPlan');
  assert.match(fn,/lastKnownContactHold:true/);
  assert.match(fn,/priorityHold:true/);
  assert.doesNotMatch(fn,/tacticalAiFallbackPatrolPlan/);
});

test('known civilian assignment target change invalidates stale exploration cache', () => {
  const fn=extractFunction('tacticalApplyVipRescueAssignments');
  assert.match(fn,/aiAlienHuntMode:null/);
  assert.match(fn,/aiPatrolTargetX:null/);
  assert.match(fn,/aiMoveVisited:\[\]/);
});

test('contact acquisition immediately applies actor-scoped route invalidation', () => {
  assert.match(source,/interruptActorIds/);
  assert.match(source,/interruptReason:"new-visible-alien-contact"/);
  assert.match(source,/objectiveSource:"contact-interrupt"/);
});

test('leader succession does not make formation recovery a replacement objective', () => {
  const recovery=extractFunction('tacticalFireTeamPostContactRecoveryState');
  assert.match(recovery,/tacticalFireTeamLeaderForUnit\(unit,living\)\|\|unit/);
  assert.match(recovery,/recoveryRounds=teamMembers\.map\(tacticalPostContactRecoveryRoundValue\)/);
  const c=makeContext({assignmentType:'beacon'}), promoted=actor('leader');
  const result=c.resolve({unit:promoted,units:[promoted],postContactRecovery:{active:true,needsFormation:true},assignedBeaconAssault:{assigned:true}});
  assert.equal(result.type,'ALIEN_BEACON');
});

test('save/playback snapshot persists objective selection and interruption diagnostics', () => {
  for (const field of ['aiObjectiveType','aiObjectivePriority','aiObjectiveSource','aiObjectiveTargetId','aiObjectiveInterruptedBy','aiObjectiveRevision']) {
    assert.match(source,new RegExp(field));
  }
  assert.match(source,/CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('two fire teams remain deconflicted for known civilian assignment', () => {
  const plan=extractFunction('tacticalVipRescueAssignmentPlan');
  assert.match(plan,/const claimed=new Set/);
  assert.match(plan,/!claimed\.has/);
  assert.match(plan,/claimed\.add/);
});

test('Hybrid explicit player movement remains a separate player authority path', () => {
  assert.match(source,/overrideLowerPriorityOrders:aiControlMode!=="hybrid"/);
  assert.match(source,/aiControlMode!=="hybrid"/);
});

test('diagnostic helper exposes type/source/target/priority/fire-team and interruption reason', () => {
  const c=makeContext(), u=actor();
  const state=c.resolve({unit:u,units:[u],lastKnownContactPriority:true,objectiveTarget:{id:'lkc-7',x:7,y:9},objectiveSource:'distress-report'});
  c.apply([u],'alpha',state,12,{actorId:u.id,interruptReason:'lost-visual-contact'});
  const d=c.diag(u);
  assert.equal(d.type,'LAST_KNOWN_CONTACT'); assert.equal(d.priority,50); assert.equal(d.source,'distress-report');
  assert.deepEqual(JSON.parse(JSON.stringify(d.target)),{id:'lkc-7',x:7,y:9});
  assert.equal(d.fireTeamId,'alpha');
});
