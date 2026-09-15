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

function makeContext({ unreachableId = null, inPositionIds = new Set() } = {}) {
  const context = {
    console,
    Set,
    Map,
    Math,
    Number,
    Object,
    Array,
    Boolean,
    String,
    TACTICAL_AI_MAX_ADAPTIVE_MOVE_STEPS: 8,
    TACTICAL_AI_MAX_CANDIDATES: 128,
    TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT: 'default',
    tacticalFireTeamIsLeader: (unit, units) => Boolean(unit && unit.fireTeamRole === 'leader' && units.some(other => other.id === unit.id && other.hp > 0 && other.alive !== false)),
    tacticalFireTeamTurnOrder: (units) => [...units].sort((a, b) => (a.fireTeamRole === 'leader' ? -1 : 1) - (b.fireTeamRole === 'leader' ? -1 : 1) || String(a.id).localeCompare(String(b.id))),
    tacticalAiAlienHuntTeamSlot: () => ({ slot: 0 }),
    tacticalFireTeamLeaderForUnit: (unit, units) => units.find(other => other.fireTeamId === unit.fireTeamId && other.fireTeamRole === 'leader' && other.hp > 0 && other.alive !== false) || units.find(other => other.fireTeamId === unit.fireTeamId && other.hp > 0 && other.alive !== false) || unit,
    tacticalFireTeamObjectiveAssignmentForTeam: () => ({ mode: 'default', objectiveId: 'default' }),
    tacticalGridSizeFrom: () => 32,
    tacticalAiHazardAwarePath: (member, target) => member.id === unreachableId ? null : [{ x: member.x, y: member.y }, { x: target.x, y: target.y }],
    tacticalFireTeamFormationPaceState: (units, leader) => {
      const supports = units.filter(u => u.fireTeamId === leader.fireTeamId && u.id !== leader.id && u.hp > 0 && u.alive !== false).map((u, index) => ({
        id: u.id,
        target: { x: leader.x - 1 - index, y: leader.y },
        distance: inPositionIds.has(u.id) ? 0 : 3,
        inPosition: inPositionIds.has(u.id),
      }));
      return { applies: supports.length > 0, inFormation: supports.every(s => s.inPosition), mode: 'forming', supports };
    },
  };
  vm.createContext(context);
  for (const name of [
    'tacticalPostContactRecoveryRoundValue',
    'tacticalMarkFireTeamPostContactRecoveryInPlace',
    'tacticalArmFireTeamPostCombatFormationRecovery',
    'tacticalFireTeamPostContactRecoveryState',
    'tacticalCompleteFireTeamPostContactRecovery',
  ]) vm.runInContext(`${extractFunction(name)}; this.${name}=${name};`, context);
  return context;
}

function fixture() {
  return [
    { id: 'leader', team: 'human', hp: 40, alive: true, x: 10, y: 10, fireTeamId: 'alpha', fireTeamRole: 'leader' },
    { id: 'left', team: 'human', hp: 36, alive: true, x: 4, y: 10, fireTeamId: 'alpha', fireTeamRole: 'left' },
    { id: 'right', team: 'human', hp: 36, alive: true, x: 4, y: 12, fireTeamId: 'alpha', fireTeamRole: 'right' },
  ];
}

test('build exposes the new post-contact team latch hotfix under save format four', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\./);
  assert.match(source, /const TACTICAL_POST_CONTACT_TEAM_LATCH_AND_LEADER_SUCCESSION_HOTFIX=true/);
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(source, /aiPostContactRecoveryRound: unit\.aiPostContactRecoveryRound/);
});

test('live combat arms every team member while legacy split-search authority stays leader-only', () => {
  const ctx = makeContext();
  const units = fixture();
  ctx.tacticalArmFireTeamPostCombatFormationRecovery(units, 18);
  assert.deepEqual(units.map(u => u.aiPostContactRecoveryRound), [18, 18, 18]);
  assert.equal(units[0].aiPostContactSplitRound, 18);
  assert.equal(units[0].aiPostContactSplitSlot, 0);
  assert.equal(units[1].aiPostContactSplitRound, undefined);
  assert.equal(units[2].aiPostContactSplitRound, undefined);
});

test('leader loss cannot erase a surviving team post-contact regroup', () => {
  const ctx = makeContext();
  const units = fixture();
  ctx.tacticalArmFireTeamPostCombatFormationRecovery(units, 18);
  units[0].hp = 0;
  units[0].alive = false;
  units[1].fireTeamRole = 'leader';
  const state = ctx.tacticalFireTeamPostContactRecoveryState({ unit: units[1], units, covers: [], mission: {}, round: 19, liveCombatPriority: false, lastKnownContactPriority: false, civilianDutyIds: new Set() });
  assert.equal(state.pending, true);
  assert.equal(state.active, true);
  assert.equal(state.needsFormation, true);
  assert.equal(state.leader.id, 'left');
});

test('bounded degraded recovery ignores only a genuinely unreachable support after three rounds', () => {
  const ctx = makeContext({ unreachableId: 'right', inPositionIds: new Set(['left']) });
  const units = fixture();
  // Make right the only support that cannot legally reach its target; left is treated as formed.
  units[1].fireTeamRole = 'left';
  units[2].fireTeamRole = 'right';
  ctx.tacticalArmFireTeamPostCombatFormationRecovery(units, 18);
  const early = ctx.tacticalFireTeamPostContactRecoveryState({ unit: units[0], units, covers: [], mission: {}, round: 20, liveCombatPriority: false, lastKnownContactPriority: false, civilianDutyIds: new Set() });
  const late = ctx.tacticalFireTeamPostContactRecoveryState({ unit: units[0], units, covers: [], mission: {}, round: 21, liveCombatPriority: false, lastKnownContactPriority: false, civilianDutyIds: new Set() });
  assert.equal(early.degradedReady, false);
  assert.equal(early.needsFormation, true);
  assert.equal(late.degradedReady, true);
  assert.equal(late.formationReady, true);
  assert.deepEqual([...late.unreachableSupportIds], ['right']);
});

test('completion clears dedicated and legacy recovery scratch state without changing team assignment', () => {
  const ctx = makeContext();
  const units = fixture();
  ctx.tacticalArmFireTeamPostCombatFormationRecovery(units, 18);
  units.forEach(unit => { unit.aiContactSearchTargetX = 7; unit.aiRescueTargetId = 'vip'; });
  assert.equal(ctx.tacticalCompleteFireTeamPostContactRecovery(units, 'alpha'), true);
  for (const unit of units) {
    assert.equal(unit.fireTeamId, 'alpha');
    assert.equal(unit.aiPostContactRecoveryRound, null);
    assert.equal(unit.aiPostContactSplitRound, null);
    assert.equal(unit.aiPostContactSplitSlot, null);
    assert.equal(unit.aiContactSearchTargetX, null);
    assert.equal(unit.aiRescueTargetId, null);
  }
});
