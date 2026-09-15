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

function distance(a, b) {
  return Math.max(Math.abs(Number(a.x) - Number(b.x)), Math.abs(Number(a.y) - Number(b.y)));
}

test('build exposes the local-sector/contact-pursuit hotfix under save format four', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\./);
  assert.match(source, /const TACTICAL_DEFAULT_AI_CONTACT_PURSUIT_AND_LOCAL_SECTOR_SEARCH_HOTFIX=true/);
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('default search begins with the nearest deconflicted sector instead of the northwest-most sector number', () => {
  const context = {
    console, Set, Map, Math, Number, Object, Array, Boolean, String,
    tacticalGridSizeFrom: () => 64,
    tacticalPlayableCell: (cell) => Number(cell?.x) >= 2 && Number(cell?.y) >= 2 && Number(cell?.x) < 62 && Number(cell?.y) < 62,
    tacticalAiObservedAliens: () => [],
    tacticalFireTeamLeaderForUnit: (unit) => unit,
    tacticalKey: (x, y) => `${x},${y}`,
    tacticalHardCoverFootprintKeySet: () => new Set(),
    tacticalAiAlienHuntTeamSlot: () => ({ slot: 0, count: 7 }),
    tacticalValidCoordinatePair: () => null,
    tacticalAiKnownAlienCraftSweepCells: () => [],
    tacticalDistance: distance,
    tacticalAiCellTieValue: () => 0,
    tacticalAiAlienHuntGridCells: () => [],
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalAiAlienHuntTarget')}; this.tacticalAiAlienHuntTarget=tacticalAiAlienHuntTarget;`, context);
  const leader = { id: 'echo-leader', team: 'human', hp: 35, alive: true, x: 52, y: 52, fireTeamId: 'echo' };
  const alien = { id: 'hidden-alien', team: 'alien', hp: 40, alive: true, x: 30, y: 30 };
  const hunt = context.tacticalAiAlienHuntTarget({ unit: leader, aliens: [alien], units: [leader, alien], covers: [], mission: {}, explored: [], round: 1 });
  assert.equal(hunt.gridSource, 'assigned-sector');
  assert.equal(hunt.sector, 63, 'the local southeast sector should beat numeric sector zero');
  assert.ok(hunt.target.x >= 56 && hunt.target.y >= 56, `expected local southeast search target, got ${hunt.target.x},${hunt.target.y}`);
  assert.ok(distance(leader, hunt.target) < 16, 'initial search target should be local to the deployed leader');
});

test('personally spotted alien approach closes directly only until the preferred ranged engagement band', () => {
  const context = {
    console, Math, Number, Object, Array, Boolean, String,
    TACTICAL_AI_MAX_ADAPTIVE_MOVE_STEPS: 16,
    tacticalAiWeaponEffectiveRange: () => 20,
    tacticalAiPreferredStandoffForRange: () => 4,
    tacticalDistance: distance,
    tacticalAiDirectContactPlan: ({ unit, target, maxMoveSteps }) => {
      const limit = Math.min(Number(maxMoveSteps) || 16, target.x - unit.x);
      const path = Array.from({ length: limit + 1 }, (_, i) => ({ x: unit.x + i, y: unit.y }));
      const cell = path[path.length - 1];
      return { path, cell, steps: path.length - 1, directContact: true };
    },
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalAiSpottedAlienApproachPlan')}; this.tacticalAiSpottedAlienApproachPlan=tacticalAiSpottedAlienApproachPlan;`, context);
  const unit = { id: 'soldier', team: 'human', hp: 35, alive: true, x: 0, y: 0 };
  const target = { id: 'alien', team: 'alien', hp: 40, alive: true, x: 15, y: 0 };
  const plan = context.tacticalAiSpottedAlienApproachPlan({ unit, target, covers: [], units: [unit, target], reserveTu: 14, mission: {}, maxMoveSteps: 16 });
  assert.equal(plan.spottedAlienApproach, true);
  assert.equal(plan.preferredContactMax, 9);
  assert.equal(plan.cell.x, 6, 'approach should stop as soon as the target is nine hexes away');
  assert.equal(plan.steps, 6);
  assert.equal(distance(plan.cell, target), 9);
});

test('inside the preferred ranged band, normal cover and standoff movement remains authoritative', () => {
  const context = {
    console, Math, Number, Object, Array, Boolean, String,
    TACTICAL_AI_MAX_ADAPTIVE_MOVE_STEPS: 16,
    tacticalAiWeaponEffectiveRange: () => 20,
    tacticalAiPreferredStandoffForRange: () => 4,
    tacticalDistance: distance,
    tacticalAiDirectContactPlan: () => { throw new Error('direct approach should not run inside the preferred band'); },
  };
  vm.createContext(context);
  vm.runInContext(`${extractFunction('tacticalAiSpottedAlienApproachPlan')}; this.tacticalAiSpottedAlienApproachPlan=tacticalAiSpottedAlienApproachPlan;`, context);
  const unit = { id: 'soldier', team: 'human', hp: 35, alive: true, x: 0, y: 0 };
  const target = { id: 'alien', team: 'alien', hp: 40, alive: true, x: 7, y: 0 };
  assert.equal(context.tacticalAiSpottedAlienApproachPlan({ unit, target }), null);
});

test('live-combat resolve paths prefer the spotted-contact approach before generic tactical movement', () => {
  const helperCalls = source.match(/tacticalAiSpottedAlienApproachPlan\(/g) || [];
  assert.ok(helperCalls.length >= 4, 'helper should be defined and used across initial/direct-response/extension movement legs');
  assert.match(source, /const contactApproachPlan=tacticalAiSpottedAlienApproachPlan/);
  assert.match(source, /const defaultAiSpottedContactApproach=Boolean\(fireTeamPriorityState\.key===TACTICAL_FIRE_TEAM_TACTICAL_STATES\.LIVE_COMBAT/);
  assert.match(source, /const extensionContactApproach=fireTeamPriorityState\.key===TACTICAL_FIRE_TEAM_TACTICAL_STATES\.LIVE_COMBAT/);
  assert.match(source, /spottedContactApproachPlan&&spottedContactApproachPlan\.steps>0\?spottedContactApproachPlan:tacticalAiMovePlan/);
});
