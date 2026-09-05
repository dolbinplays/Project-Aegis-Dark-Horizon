const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const source = fs.readFileSync(path.join(__dirname, '../src/browser-runtime.html'), 'utf8');
const block = source.split('// AEGIS_PLAYBACK_SEQUENCER_BEGIN')[1].split('// AEGIS_PLAYBACK_SEQUENCER_END')[0];
const context = vm.createContext({});
vm.runInContext(block, context);

function clock() {
  let time = 0, nextId = 0, peakHandles = 0;
  const pending = new Map();
  const add = (callback, due, kind) => {
    const id = ++nextId;
    pending.set(id, { callback, due, kind });
    peakHandles = Math.max(peakHandles, pending.size);
    return id;
  };
  const options = {
    now: () => time,
    setTimer: (callback, delay) => add(callback, time + delay, 'timer'),
    clearTimer: id => pending.delete(id),
    requestFrame: callback => add(callback, (Math.floor(time / 16) + 1) * 16, 'frame'),
    cancelFrame: id => pending.delete(id),
  };
  return {
    options, pending,
    get time() { return time; },
    get peakHandles() { return peakHandles; },
    jump: elapsed => { time += elapsed; },
    advanceTo(target) {
      let iterations = 0;
      while (pending.size) {
        if (++iterations > 100000) throw Error('Scheduler did not yield');
        const [id, event] = [...pending].sort((a, b) => a[1].due - b[1].due)[0];
        if (event.due > target) break;
        pending.delete(id);
        time = Math.max(time, event.due);
        event.callback(time);
      }
      time = Math.max(time, target);
    },
  };
}
const tests = [];
function test(name, body) {
  try { body(); tests.push({ name, pass: true }); }
  catch (error) { tests.push({ name, pass: false }); console.error(`FAIL: ${name}\n${error.stack}`); }
}
const make = () => { const c = clock(); return { c, q: context.tacticalCreatePlaybackSequencer(c.options) }; };

test('Long movement retains two jobs and one native wake handle, then releases everything', () => {
  const { c, q } = make(), events = [];
  q.sequence(i => events.push(i), 82, i => 380 * (i + 1));
  q.schedule(() => events.push('commit'), 380 * 83);
  assert.equal(q.pendingCount, 2);
  assert.equal(q.report().queuedEvents, 83);
  c.advanceTo(33000);
  assert.deepEqual(events, [...Array(82).keys(), 'commit']);
  assert.equal(q.report().peakPendingJobs, 2);
  assert.equal(c.peakHandles, 1);
  assert.equal(q.pendingCount, 0);
  assert.equal(c.pending.size, 0);
});

test('An earlier inserted event re-arms the wake and equal deadlines remain FIFO', () => {
  const { c, q } = make(), events = [];
  q.schedule(() => events.push('late'), 1000);
  q.schedule(() => events.push('first'), 100);
  q.schedule(() => events.push('second'), 100);
  c.advanceTo(120);
  assert.deepEqual(events, ['first', 'second']);
  c.advanceTo(1024);
  assert.deepEqual(events, ['first', 'second', 'late']);
  assert.equal(c.peakHandles, 1);
});

test('A long stall preserves every movement beat and the shot-to-impact interval', () => {
  const { c, q } = make(), events = [];
  q.sequence(i => events.push({ event: `step-${i}`, at: c.time }), 3, i => 380 * (i + 1));
  q.schedule(() => {
    events.push({ event: 'shot', at: c.time });
    q.schedule(() => events.push({ event: 'impact', at: c.time }), 600);
  }, 1520);
  c.jump(10000);
  c.advanceTo(10032);
  assert.equal(events.length, 1);
  c.advanceTo(13000);
  assert.deepEqual(events.map(e => e.event), ['step-0', 'step-1', 'step-2', 'shot', 'impact']);
  for (let i = 1; i < 4; i++) assert.ok(events[i].at - events[i - 1].at >= 360);
  assert.ok(events[4].at - events[3].at >= 580);
  assert.equal(q.report().stalls, 1);
  assert.equal(c.peakHandles, 1);
});

test('Cancelling inside final-VIP commit drops later movement and permits a fresh generation', () => {
  const { c, q } = make(), events = [];
  q.sequence(i => {
    events.push(i);
    if (i === 1) { q.cancelAll(); q.schedule(() => events.push('victory'), 100); }
  }, 10, i => 100 * (i + 1));
  q.schedule(() => events.push('stale-shot'), 300);
  c.advanceTo(2000);
  assert.deepEqual(events, [0, 1, 'victory']);
  assert.equal(q.pendingCount, 0);
  assert.equal(c.pending.size, 0);
});

test('Individual recurring cancellation and stale native callbacks cannot revive work', () => {
  const { c, q } = make(), events = [];
  const id = q.sequence(i => { events.push(i); q.cancel(id); }, 3, i => 100 * (i + 1));
  c.advanceTo(400);
  assert.deepEqual(events, [0]);
  q.schedule(() => events.push('old'), 100);
  const stale = [...c.pending.values()][0].callback;
  q.cancelAll();
  q.schedule(() => events.push('new'), 200);
  stale();
  c.advanceTo(1000);
  assert.deepEqual(events, [0, 'new']);
  assert.equal(c.peakHandles, 1);
});

test('Pause and next-frame boundaries wait for a Beacon impact scheduled by a shot', () => {
  const { c, q } = make(), events = [];
  q.scheduleBoundary(() => events.push('pause'), 100);
  q.schedule(() => {
    events.push('shot');
    q.schedule(() => events.push('beacon-destroyed'), 600);
  }, 200);
  c.advanceTo(500);
  assert.deepEqual(events, ['shot']);
  c.advanceTo(1000);
  assert.deepEqual(events, ['shot', 'beacon-destroyed', 'pause']);
  assert.equal(q.hasPendingActions, false);
});

test('A boundary waits for the final step of a reusable movement job', () => {
  const { c, q } = make(), events = [];
  q.scheduleBoundary(() => events.push('advance'), 10);
  q.sequence(i => events.push(i), 4, i => 100 * (i + 1));
  c.advanceTo(500);
  assert.deepEqual(events, [0, 1, 2, 3, 'advance']);
});

test('Idle queues own no timer and a cancelled rAF cannot mutate the battlefield', () => {
  const { c, q } = make(); let calls = 0;
  assert.equal(c.pending.size, 0);
  q.schedule(() => calls++, 0);
  const stale = [...c.pending.values()][0].callback;
  q.cancelAll(); stale(); c.advanceTo(10000);
  assert.equal(calls, 0);
  assert.equal(c.pending.size, 0);
});

test('Callback failure releases its sequence and leaves later independent work runnable', () => {
  const { c, q } = make(); let completed = false;
  q.sequence(() => { throw Error('test failure'); }, 4, i => 100 * (i + 1));
  q.schedule(() => { completed = true; }, 500);
  assert.throws(() => c.advanceTo(200), /test failure/);
  c.advanceTo(1000);
  assert.ok(completed);
  assert.equal(q.report().errors, 1);
  assert.equal(q.pendingCount, 0);
});

for (const speed of [10, 100, 150]) test(`Battle speed ${speed}% preserves nominal step timing and single-file boarding order`, () => {
  const { c, q } = make(), events = [], delay = ms => Math.max(60, Math.round(ms / (speed / 100)));
  q.sequence(i => events.push({ i, at: c.time }), 6, i => delay(380 * (i + 1)));
  c.advanceTo(delay(380 * 7));
  assert.deepEqual(events.map(e => e.i), [0, 1, 2, 3, 4, 5]);
  for (const e of events) assert.ok(Math.abs(e.at - delay(380 * (e.i + 1))) <= 16);
  assert.equal(q.report().stalls, 0);
});

// Execute the actual TacticalMission playback callbacks with a small state adapter.
// Tactical route/LOS resolution is supplied by the fixture; scheduling, hydration,
// boarding commits, and handoff/cancellation execute the shipped function bodies.
function missionFixture({ terminal = false, speed = 100 } = {}) {
  const { c, q } = make(), states = [];
  const human = { id: 'lead', name: 'Lead', team: 'human', alive: true, hp: 40, maxHp: 40, tu: 48, maxTu: 48, acc: 60, ammo: 12, weaponKind: 'ballistic', x: 5, y: 5 };
  const vip = { id: 'vip', name: 'VIP', team: 'civilian', alive: true, hp: 18, x: 5, y: 6, rescued: false, extracted: false };
  const scope = {
    mission: { id: 'fixture' }, squad: [human], initialDeployment: { skyranger: {} }, weaponUpgrades: {}, alienFieldBeaconKnowledge: 'confirmed',
    unitsRef: { current: [human, vip] }, coversRef: { current: [] }, TACTICAL_REINFORCEMENT_STATE_CACHE: new Map(), TACTICAL_FEAR_STATES: { steady: 'steady' },
    aiPlayback: null, aiPlaybackTimelineRef: { current: q },
    aiDelay: ms => Math.max(60, Math.round(ms / (speed / 100))),
    scheduleAiPlayback: (callback, delay) => q.schedule(callback, delay),
    scheduleAiPlaybackSequence: (callback, count, delayAt) => q.sequence(callback, count, delayAt),
    cancelAiPlaybackTimers: () => q.cancelAll(),
    invalidateAiStream: () => { scope.invalidated = true; },
    setUnits: update => { scope.unitsRef.current = typeof update === 'function' ? update(scope.unitsRef.current) : update; states.push({ at: c.time, units: structuredClone(scope.unitsRef.current) }); },
    setCovers: update => { scope.coversRef.current = typeof update === 'function' ? update(scope.coversRef.current) : update; },
    setAiPlayback: update => { scope.aiPlayback = typeof update === 'function' ? update(scope.aiPlayback) : update; },
    setMovingUnit: unit => { scope.moving = unit; }, setAiFrameAnimating: value => { scope.animating = value; },
    setTacticalRound: () => {}, setAiMapCameraAnchor: () => {}, setLog: () => {}, onBattleImpact: () => {},
    tacticalAiFrameCameraAnchor: () => null, hasLineOfSight: () => true,
    tacticalSequenceRampBoardingPlaybackPlans: plans => plans,
    tacticalAiFrameCivilianExtractionPlaybackState: (frame, target) => ({ animate: target.team === 'civilian' }),
    tacticalPlaybackUnitMayAnimate: () => true,
    tacticalPlaybackMovementPath: (frame, id) => frame.movementTrails[id] || [],
    tacticalMergeAlienContactPlaybackMemory: unit => unit,
    tacticalFinalVipBoardingTerminalVictoryCheckpoint: () => ({ eligible: terminal, cutoffSteps: 2, boardingIds: ['vip'] }),
    tacticalCameraFocusDescriptor: () => null,
    tacticalPlaybackPlanStep: (plan, index) => plan?.path[Math.min(index, plan.path.length - 1)],
    tacticalAiMissionResolution: () => ({ success: terminal }),
    battleWeaponKindForSoldier: () => 'ballistic', getEffectiveStat: () => 60, injuryPenalty: () => 0, ballisticCapacity: () => 12,
    updateFacing: () => 'E',
    setAiRoundPreparation: () => {}, setCommandMapPaused: () => {}, setCommandMapPauseRequested: () => {}, setTurn: () => {}, setTargetingMode: () => {}, setSelected: () => {}, onDialogue: () => {},
  };
  const a = source.indexOf('function applyAiFrameToMap('), b = source.indexOf('function estimateAiFrameMovementDelay', a);
  const d = source.indexOf('function takeBackAiCommand()'), e = source.indexOf('function finishAiPlayback()', d);
  vm.runInContext(source.slice(a, b) + '\n' + source.slice(d, e), vm.createContext(scope));
  return { c, q, scope, states, human, vip };
}

test('Shipped movement callback preserves destination, TU, ammo, damage, and final hydration', () => {
  const { c, q, scope, human } = missionFixture();
  const frame = { soldiers: [{ ...human, x: 8, tu: 36, ammo: 11, hp: 32 }], civilians: [], aliens: [], covers: [], movementTrails: { lead: [{ x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }] } };
  scope.applyAiFrameToMap(frame, { animate: true, deferDeaths: true });
  assert.equal(q.pendingCount, 2);
  assert.equal(scope.unitsRef.current[0].x, 5);
  c.advanceTo(400); assert.equal(scope.unitsRef.current[0].x, 6);
  c.advanceTo(1700);
  const final = scope.unitsRef.current[0];
  assert.deepEqual([final.x, final.hp, final.tu, final.ammo], [8, 32, 36, 11]);
  assert.equal(scope.animating, false); assert.equal(scope.moving, null);
});

test('Shipped final-VIP cutoff commits extraction and cancels the unplayed soldier route', () => {
  const { c, q, scope, human, vip, states } = missionFixture({ terminal: true });
  const frame = { soldiers: [{ ...human, x: 10 }], civilians: [{ ...vip, x: 7, rescued: true, extracted: true, alive: false }], aliens: [], covers: [], movementTrails: { lead: [6, 7, 8, 9, 10].map(x => ({ x, y: 5 })), vip: [{ x: 6, y: 6 }, { x: 7, y: 6 }] } };
  scope.aiPlayback = { frames: [frame], frameIndex: 0, result: {} };
  scope.applyAiFrameToMap(frame, { animate: true, deferDeaths: true });
  q.schedule(() => { throw Error('Queued shot survived terminal boarding'); }, 1600);
  c.advanceTo(800);
  assert.equal(scope.unitsRef.current.find(u => u.id === 'vip').rescued, false);
  c.advanceTo(3000);
  assert.equal(scope.unitsRef.current.find(u => u.id === 'vip').rescued, true);
  assert.equal(scope.unitsRef.current.find(u => u.id === 'lead').x, 7);
  assert.equal(scope.aiPlayback.frames.at(-1).label, 'Mission success');
  assert.equal(scope.aiPlayback.streamComplete, true);
  assert.equal(q.pendingCount, 0);
  assert.ok(scope.invalidated);
  assert.ok(!states.some(state => state.units.find(u => u.id === 'lead')?.x > 7));
});

test('Shipped boarding continues remaining movement when the mission is not terminal', () => {
  const { c, scope, human, vip } = missionFixture();
  const frame = { soldiers: [{ ...human, x: 9 }], civilians: [{ ...vip, x: 7, rescued: true, alive: false }], aliens: [], covers: [], movementTrails: { lead: [6, 7, 8, 9].map(x => ({ x, y: 5 })), vip: [{ x: 6, y: 6 }, { x: 7, y: 6 }] } };
  scope.applyAiFrameToMap(frame, { animate: true }); c.advanceTo(2200);
  assert.equal(scope.unitsRef.current.find(u => u.id === 'lead').x, 9);
  assert.equal(scope.invalidated, undefined);
});

test('Shipped Take Back Control retains the current authoritative frame and cancels later callbacks', () => {
  const { c, q, scope, human } = missionFixture();
  const frame = { soldiers: [{ ...human, x: 8, tu: 36, ammo: 11, hp: 32 }], civilians: [], aliens: [], covers: [{ id: 'wreck', hp: 0 }], movementTrails: { lead: [{ x: 6, y: 5 }, { x: 7, y: 5 }, { x: 8, y: 5 }] } };
  scope.aiPlayback = { frames: [frame], frameIndex: 0 };
  scope.applyAiFrameToMap(frame, { animate: true }); c.advanceTo(400);
  scope.takeBackAiCommand();
  const retained = JSON.stringify(scope.unitsRef.current); c.advanceTo(3000);
  assert.equal(JSON.stringify(scope.unitsRef.current), retained);
  assert.equal(scope.unitsRef.current[0].x, 8);
  assert.equal(scope.coversRef.current[0].hp, 0);
  assert.equal(scope.aiPlayback, null); assert.equal(q.pendingCount, 0);
});

console.log(`Playback sequencer: ${tests.filter(t => t.pass).length}/${tests.length} behavioral tests passed.`);
if (tests.some(t => !t.pass)) process.exitCode = 1;
