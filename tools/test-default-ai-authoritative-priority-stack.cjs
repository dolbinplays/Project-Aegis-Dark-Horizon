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
  let parenDepth = 0;
  let closeParen = -1;
  for (let i = openParen; i < source.length; i += 1) {
    if (source[i] === '(') parenDepth += 1;
    else if (source[i] === ')') {
      parenDepth -= 1;
      if (parenDepth === 0) { closeParen = i; break; }
    }
  }
  assert.ok(closeParen > openParen, `${name} parameter list should close`);
  const brace = source.indexOf('{', closeParen);
  let depth = 0;
  let quote = null;
  let escaped = false;
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
    else if (ch === '}') {
      depth -= 1;
      if (depth === 0) return source.slice(start, i + 1);
    }
  }
  throw new Error(`Could not extract ${name}`);
}

const resolver = extractFunction('resolveMission');

test('build declares the authoritative Default AI priority stack without changing save format', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\.09\.15\.1704_DEFAULT_AI_AUTHORITATIVE_SOLDIER_PRIORITY_STACK_PATCH"/);
  assert.match(source, /const TACTICAL_DEFAULT_AI_AUTHORITATIVE_SOLDIER_PRIORITY_STACK_PATCH=true/);
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(source, /STABILIZE:10,CASUALTY_RECOVERY:20,ACTIVE_ESCORT:30,VISIBLE_ALIEN:40,LAST_KNOWN_CONTACT:50,ALIEN_BEACON:60,UFO_BAY:70,KNOWN_CIVILIAN:80,SEARCH:90/);
});

test('per-unit state resolver keeps active escort above visible contact while released support can fight', () => {
  const context = {
    Math, Number, Boolean, String, Array, Object, Set,
    TACTICAL_FIRE_TEAM_TACTICAL_STATES: { LIVE_COMBAT:'live-combat', ESCORT:'escort', LAST_KNOWN_CONTACT:'last-known-contact', PERSISTENT_ASSIGNMENT:'persistent-assignment', DEFAULT_SEARCH:'default-search' },
    TACTICAL_DEFAULT_AI_PRIORITY_STACK: { STABILIZE:10, CASUALTY_RECOVERY:20, ACTIVE_ESCORT:30, VISIBLE_ALIEN:40, LAST_KNOWN_CONTACT:50, ALIEN_BEACON:60, UFO_BAY:70, KNOWN_CIVILIAN:80, SEARCH:90 },
    tacticalDefaultAiPriorityRank: key => ({STABILIZE:10,CASUALTY_RECOVERY:20,ACTIVE_ESCORT:30,VISIBLE_ALIEN:40,LAST_KNOWN_CONTACT:50,ALIEN_BEACON:60,UFO_BAY:70,KNOWN_CIVILIAN:80,SEARCH:90}[String(key).toUpperCase()] || 90),
    tacticalFireTeamObjectiveAssignmentForTeam: () => ({ mode:'default', objectiveId:'default' }),
    tacticalEscortLeaderLockState: unit => ({ active: unit.id === 'leader', leader: unit.id === 'leader' ? unit : null }),
    tacticalFireTeamLeaderForUnit: (unit, units) => units.find(candidate => candidate.id === 'leader') || unit,
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalFireTeamPriorityState')}; this.fn=tacticalFireTeamPriorityState;`, context);
  const leader = { id:'leader', team:'human', hp:40, alive:true, fireTeamId:'alpha' };
  const support = { id:'support', team:'human', hp:40, alive:true, fireTeamId:'alpha' };
  const units = [leader, support];
  const leaderState = context.fn({ unit:leader, units, liveCombatPriority:true, civilianDutyIds:new Set([leader.id]) });
  const supportState = context.fn({ unit:support, units, liveCombatPriority:true, civilianDutyIds:new Set([leader.id]) });
  assert.equal(leaderState.key, 'escort');
  assert.equal(leaderState.priority, 30);
  assert.equal(supportState.key, 'live-combat');
  assert.equal(supportState.priority, 40);
});

test('Last Known Contact outranks Beacon, UFO bay, known civilian and exploration; formation recovery is overlay only', () => {
  const prioritySource = extractFunction('tacticalFireTeamPriorityState');
  assert.ok(prioritySource.indexOf('else if(lastKnownContactPriority)') < prioritySource.indexOf('reinforcementSourcePriorityKind==="beacon"'));
  assert.ok(prioritySource.indexOf('reinforcementSourcePriorityKind==="beacon"') < prioritySource.indexOf('reinforcementSourcePriorityKind==="ufo-bay"'));
  assert.ok(prioritySource.indexOf('else if(reinforcementSourcePriorityKind==="ufo-bay"') < prioritySource.indexOf('else if(civilianPersistent)'));
  assert.match(prioritySource, /formationRecoveryActive:Boolean\(postContactRecovery\?\.active&&postContactRecovery\?\.needsFormation\)/);
  assert.doesNotMatch(prioritySource, /key=TACTICAL_FIRE_TEAM_TACTICAL_STATES\.REFORM/);
  assert.match(resolver, /postContactSupportReform/);
  assert.match(resolver, /aiPostContactFormationOverlay="leader-advancing-objective"/);
  assert.doesNotMatch(resolver, /aiTurnAction="post-contact-form-up";human\.fireTeamPaceMode="forming";human\.fireTeamFormationReady=false;return/);
});

test('distress reports are promoted into Last Known Contact authority', () => {
  assert.match(resolver, /const rawDistressSearch = !lastKnownContactSearch\?tacticalAiDistressTarget/);
  assert.match(resolver, /const distressSearch=rawDistressSearch\?\{\.\.\.rawDistressSearch,lastKnownContact:true,remembered:true,distressContact:true\}:null/);
  assert.match(resolver, /roundStartDistressContactBarrier/);
  assert.match(resolver, /rememberedCombatContact\|\|roundStartDistressContactBarrier/);
});

test('new alien contact cancels lower-priority duty for Engage support but retains escort leader and Stay/Ask support', () => {
  assert.match(resolver, /combatRetainedCivilianDutyIds/);
  assert.match(resolver, /if\(member\.id===leader\.id\)return true/);
  assert.match(resolver, /tacticalEscortSupportModeForTeam\(allUnits\(\),member\.fireTeamId\)!=="breakoff"/);
  assert.match(resolver, /civilianDutyIds=combatRetainedCivilianDutyIds/);
  assert.match(resolver, /tacticalArmFireTeamPostCombatFormationRecovery\(humans,initialRound\+round-1\)/);
});

test('Beacon and UFO source teams are reserved before known-civilian assignment, with Beacon first', () => {
  const reserveIndex = resolver.indexOf('const reservedSourceTeamId=preRescueBeaconTeam||preRescueUfoTeam||null');
  const rescueIndex = resolver.indexOf('tacticalAiCivilianPriorityTurn({ units: allUnits()');
  assert.ok(reserveIndex >= 0 && rescueIndex > reserveIndex);
  assert.match(resolver, /!preRescueBeaconObjective\.pending\?tacticalAiUfoBayInspectionTeamId/);
  assert.match(resolver, /reservedSourceLeaderIds/);
  assert.match(resolver, /\.\.\.reservedSourceLeaderIds/);
  assert.match(resolver, /!beaconObjectiveAtTurnStart\.pending\?\(preRescueUfoTeam\|\|tacticalAiUfoBayInspectionTeamId/);
});

test('known revealed civilians and tracker VIPs receive fire-team assignments before exploration', () => {
  const assignment = extractFunction('tacticalVipRescueAssignmentPlan');
  assert.match(assignment, /unit\.vipTracker===true\|\|unit\.revealed===true/);
  assert.match(assignment, /overrideLowerPriorityOrders/);
  assert.match(resolver, /overrideLowerPriorityOrders:aiControlMode!=="hybrid"/);
  assert.match(resolver, /knownUnassignedCivilianPriorityPending/);
  assert.match(resolver, /fireTeamPriorityState\.allowsGenericSearch && !knownUnassignedCivilianPriorityPending/);
  assert.match(resolver, /aiTurnAction="known-civilian-assignment-pending"/);
});

test('bleeding stabilization and casualty recovery preempt mission AI; routine healing is deferred', () => {
  const stabilizeIndex = resolver.indexOf('stabilizeOnly:true');
  const turnOrderIndex = resolver.indexOf('humanTurnOrder.forEach');
  const routineIndex = resolver.indexOf('routineOnly:true');
  assert.ok(stabilizeIndex >= 0 && turnOrderIndex > stabilizeIndex && routineIndex > turnOrderIndex);
  assert.match(resolver, /priorityResponderDutyIds/);
  assert.match(resolver, /if\(priorityResponderDutyIds\.has\(human\.id\)\)return/);
  assert.match(extractFunction('tacticalAiMedicalTriageStep'), /medical-stabilization-approach/);
  assert.match(extractFunction('tacticalAiCasualtyExtractionStep'), /casualty-extraction-approach/);
});

test('emergency planner cannot fall back to patrol while a higher-priority objective exists', () => {
  assert.match(resolver, /emergencyObserved/);
  assert.match(resolver, /emergencyLastKnown/);
  assert.match(resolver, /emergencyHigherPriorityHold/);
  assert.match(resolver, /"emergency-priority-hold"/);
  const targetIndex = resolver.indexOf('const rawPlan=emergencyTarget?');
  const patrolIndex = resolver.indexOf(':tacticalAiFallbackPatrolPlan', targetIndex);
  assert.ok(targetIndex >= 0 && patrolIndex > targetIndex);
});

test('perspective order diagnostics mirror the canonical stack instead of presenting reform as a higher mission objective', () => {
  const hud = extractFunction('tacticalFirstPersonCurrentObjectiveOrder');
  const labels = [
    'PRIORITY 1 - STABILIZE', 'PRIORITY 2 - CASUALTY RECOVERY', 'PRIORITY 3 - ACTIVE ESCORT',
    'PRIORITY 4 - VISIBLE ALIEN', 'PRIORITY 5 - LAST KNOWN CONTACT', 'PRIORITY 6 - ALIEN FIELD BEACON',
    'PRIORITY 7 - UFO BAY', 'PRIORITY 8 - KNOWN CIVILIAN/VIP', 'PRIORITY 9 - SEARCH'
  ];
  let previous = -1;
  for (const label of labels) {
    const index = hud.indexOf(label);
    assert.ok(index > previous, `${label} should follow the prior canonical priority label`);
    previous = index;
  }
  assert.ok(hud.indexOf('FORMATION OVERLAY') > hud.indexOf('PRIORITY 9 - SEARCH'));
});
