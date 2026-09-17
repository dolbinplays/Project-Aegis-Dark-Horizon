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

test('successor build preserves global contact and VIP priority hotfix under save format four', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\.09\.16\.2245_PROCEDURAL_BUILDING_SEAM_CONTINUITY_AND_CLOSED_EXTERIOR_DOOR_DEFAULTS_PATCH"/);
  assert.match(source, /const TACTICAL_DEFAULT_AI_GLOBAL_CONTACT_AND_VIP_PRIORITY_HOTFIX=true/);
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('movement plan stops at the first newly spotted alien instead of finishing stale exploration movement', () => {
  const context = {
    Set, Array, Math, Number, Object, Boolean, String,
    tacticalAiPersonallyObservedAliens: (observer, units) => Number(observer.x) >= 3 ? units.filter(unit => unit.team === 'alien') : [],
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalAiMovementContactInterruptPlan')}; this.fn=tacticalAiMovementContactInterruptPlan;`, context);
  const unit = { id: 'lead', team: 'human', hp: 30, alive: true, x: 0, y: 0 };
  const alien = { id: 'alien-1', team: 'alien', hp: 30, alive: true, x: 9, y: 0 };
  const plan = { path: [0,1,2,3,4,5].map(x => ({ x, y: 0 })), cell: { x: 5, y: 0 }, steps: 5 };
  const result = context.fn({ unit, plan, units: [unit, alien], covers: [], mission: {}, knownContactIds: new Set() });
  assert.equal(result.interrupted, true);
  assert.deepEqual(Array.from(result.alienIds), ['alien-1']);
  assert.equal(result.plan.steps, 3);
  assert.equal(result.plan.cell.x, 3);
  assert.equal(result.plan.contactInterrupted, true);
});

test('already-known contact does not repeatedly truncate movement', () => {
  const context = {
    Set, Array, Math, Number, Object, Boolean, String,
    tacticalAiPersonallyObservedAliens: (_observer, units) => units.filter(unit => unit.team === 'alien'),
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalAiMovementContactInterruptPlan')}; this.fn=tacticalAiMovementContactInterruptPlan;`, context);
  const unit = { id: 'lead', team: 'human', hp: 30, alive: true, x: 0, y: 0 };
  const alien = { id: 'alien-1', team: 'alien', hp: 30, alive: true, x: 9, y: 0 };
  const plan = { path: [0,1,2,3].map(x => ({ x, y: 0 })), cell: { x: 3, y: 0 }, steps: 3 };
  const result = context.fn({ unit, plan, units: [unit, alien], knownContactIds: new Set(['alien-1']) });
  assert.equal(result.interrupted, false);
  assert.equal(result.plan.steps, 3);
});

test('tracked VIP activates autonomous fire-team assignment even for a non-mandatory civilian objective', () => {
  const context = {
    Set, Map, Array, Math, Number, Object, Boolean, String,
    tacticalCivilianObjectiveForMission: () => ({ mandatory: false }),
    tacticalVipRescueCoordinatorForUnits: units => units.find(unit => unit.team === 'human') || null,
    tacticalFireTeamTurnOrder: units => [...units],
    tacticalFireTeamIsLeader: unit => unit.fireTeamRole === 'leader',
    tacticalEscortFollowers: () => [],
    tacticalFireTeamCommandOrderForUnit: () => null,
    tacticalDistance: (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y)),
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalVipRescueAssignmentPlan')}; this.fn=tacticalVipRescueAssignmentPlan;`, context);
  const leader = { id: 'alpha-lead', team: 'human', hp: 30, alive: true, x: 2, y: 2, fireTeamId: 'alpha', fireTeamRole: 'leader' };
  const support = { id: 'alpha-support', team: 'human', hp: 30, alive: true, x: 2, y: 3, fireTeamId: 'alpha', fireTeamRole: 'left' };
  const vip = { id: 'vip-1', team: 'civilian', hp: 18, alive: true, x: 10, y: 10, vipTracker: true, rescued: false, escortId: null };
  const plan = context.fn({ units: [leader, support, vip], mission: {}, secureRescue: false });
  assert.equal(plan.enabled, true);
  assert.equal(plan.assignments.length, 1);
  assert.equal(plan.assignments[0].fireTeamId, 'alpha');
  assert.equal(plan.assignments[0].vipId, 'vip-1');
});

test('default AI authority keeps visible contact above known VIP rescue and exploration while preserving higher escort authority', () => {
  const central = extractFunction('tacticalDefaultAiObjectiveDecision');
  const rescue = extractFunction('tacticalAiCivilianPriorityTurn');
  assert.match(central, /if\(unitEscortActive\)add\("ACTIVE_ESCORT"/);
  assert.match(central, /if\(liveCombatPriority\)add\("VISIBLE_ALIEN"/);
  assert.match(central, /if\(civilianPersistent\)add\("KNOWN_CIVILIAN"/);
  assert.match(central, /add\("SEARCH",TACTICAL_FIRE_TEAM_TACTICAL_STATES\.DEFAULT_SEARCH,"SEARCH"/);
  assert.match(source, /tacticalAiMovementContactInterruptPlan\(\{unit:human,plan,units:allUnits\(\),covers,mission,knownContactIds:roundObservedContactIds\}\)/);
  assert.match(source, /interruptReason:"new-visible-alien-contact"/);
  assert.match(rescue, /if\(dynamicCombatPriority&&!followers\.length&&!committedRescuer\)/);
  assert.match(rescue, /const committedRescuer=Boolean\(soldier&&soldier\.fireTeamVipRescueCommitmentEnabled/);
  assert.match(rescue, /player-vip-rescue-commitment/);
  assert.match(rescue, /noteNewRescueContact\(advancedLeader,"VIP approach movement"\)/);
  assert.match(rescue, /noteNewRescueContact\(advancedLeader,"VIP search movement"\)/);
  assert.match(rescue, /if \(\(!dynamicCombatPriority\|\|committedRescuer\) && currentCivilian/);
});

test('escort leader and support doctrine remain authoritative during contact', () => {
  const priority = extractFunction('tacticalFireTeamPriorityState');
  const central = extractFunction('tacticalDefaultAiObjectiveDecision');
  assert.match(priority, /return tacticalDefaultAiObjectiveDecision\(options\)/);
  assert.ok(central.indexOf('ACTIVE_ESCORT') < central.indexOf('VISIBLE_ALIEN'), 'escort candidate must remain above visible combat');
  assert.match(source, /Ask When Contact Is Spotted/);
  assert.match(source, /Stay With Escort/);
  assert.match(source, /Engage Spotted Aliens/);
  assert.match(source, /return tacticalEscortSupportModeForTeam\(combatUnits,member\.fireTeamId\)!=="breakoff"/);
});
