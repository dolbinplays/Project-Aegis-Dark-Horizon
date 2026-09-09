const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/browser-runtime.html'), 'utf8');
// These functions contain no nested declarations. Load every completion declaration
// in source order so an accidental later override is exercised just as in the game.
function declarations(name) {
  return [...source.matchAll(new RegExp('function '+name+'\\(', 'g'))].map(match=>{
    const end=source.indexOf('function ',match.index+match[0].length);
    return source.slice(match.index,end).trim();
  });
}
function setup({hybrid=false,pending=false,success=true,continuation=null}={}) {
  const squad=['survivor','kia'].map(id=>({id,name:id,status:'Ready',stats:{health:40}}));
  const frame={label:success?'Mission success':'Squad defeated',round:28,
    soldiers:[{id:'survivor',hp:31,maxHp:40,medkitCharges:1,kills:2},{id:'kia',hp:0,maxHp:40,alive:false}],
    aliens:[{id:'alien',hp:0,alive:false}],civilians:[{id:'vip',hp:20,rescued:true},{id:'lost',hp:0,alive:false}]};
  const result={success,squadDefeated:!success,rounds:28,growth:squad.map(s=>({id:s.id,state:'KIA',wounded:40,tacticalFinalHp:0,xpGain:77,kill:2,statUps:[['accuracy',2]],statDamage:{}}))};
  const playback={view:'overlay',frames:[frame],frameIndex:0,streamComplete:true,hybridRound:hybrid,hybridContinuation:continuation,result};
  const observed={finished:[],cancelled:0,applied:0};
  const context=vm.createContext({
    clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),WOUND_HP_PER_DAY:4,MAX_WOUND_RECOVERY_DAYS:60,
    // Roster normalization is outside this regression; fixtures already have full health records.
    normalizeSoldier:s=>s,getCurrentHealth:s=>s.stats.health,
    aiPlayback:playback,aiFrameAnimating:false,aiPlaybackTimelineRef:{current:{hasPendingActions:pending}},
    unitsRef:{current:[{id:'survivor',team:'human',hp:0,alive:false,maxHp:40},{id:'kia',team:'human',hp:40,maxHp:40},{id:'alien',team:'alien',hp:40},{id:'vip',team:'civilian',hp:20,rescued:false},{id:'lost',team:'civilian',hp:20}]},
    squad,mission:{kind:'Alien Terror Raid'},tacticalRound:1,
    setUnits:units=>{context.unitsRef.current=typeof units==='function'?units(context.unitsRef.current):units;},
    setAiRoundPreparation:()=>{},setCommandMapPaused:()=>{},setCommandMapPauseRequested:()=>{},
    setMovingUnit:()=>{},setAiFrameAnimating:()=>{},setAiPlayback:()=>{},setAiMapCameraAnchor:()=>{},setTurn:()=>{},setLog:()=>{},
    invalidateAiStream:()=>{},cancelAiPlaybackTimers:()=>observed.cancelled++,
    applyAiFrameToMap:()=>observed.applied++,finishTacticalMission:r=>observed.finished.push(r),
  });
  for(const name of ['tacticalMissionResultHasTerminalOutcome','tacticalAiPlaybackTerminalState','tacticalPlaybackFrameUnitAuthoritativeAlive','tacticalRestoreCommittedVictorySurvivors','tacticalCommittedVictoryFrameUnits','tacticalTerminalVictoryResultFromCommittedBattlefield','tacticalMedkitWoundDays','applyTacticalMedicalGrowth','tacticalCivilianObjectiveForMission','tacticalCivilianOutcomeForMission','finishAiPlaybackResult','finishAiPlayback']) {
    for(const declaration of declarations(name)) vm.runInContext(declaration,context);
  }
  return {context,observed,playback,frame,result,squad};
}

test('Tactical playback has a single completion handler',()=>assert.equal(declarations('finishAiPlayback').length,1));
for(const hybrid of [false,true]) test(`${hybrid?'Hybrid':'Full AI'} terminal completion reconciles survivors, real casualties and civilian outcomes from the final frame`,()=>{
  const {context,observed}=setup({hybrid});context.finishAiPlayback();
  const result=observed.finished[0];assert.ok(result);assert.equal(result.success,true);
  assert.equal(result.growth[0].tacticalFinalHp,31);assert.notEqual(result.growth[0].state,'KIA');
  assert.equal(result.growth[1].state,'KIA');assert.equal(result.survivingHumans,1);assert.equal(result.remainingAliens,0);
  assert.equal(result.civilianOutcome.rescued,1);assert.equal(result.civilianOutcome.lost,1);
  assert.equal(result.growth[0].xpGain,77);assert.equal(result.growth[0].statUps[0][1],2);
});
test('A committed hybrid victory outranks a stale continuation snapshot',()=>{
  const {context,observed}=setup({hybrid:true,continuation:{round:29,units:[]}});context.finishAiPlayback();
  assert.equal(observed.finished.length,1);assert.equal(observed.finished[0].survivingHumans,1);
});
for(const hybrid of [false,true]) test(`${hybrid?'Hybrid':'Full AI'} completion waits for queued presentation actions`,()=>{
  const {context,observed}=setup({hybrid,pending:true});context.finishAiPlayback();
  assert.equal(observed.finished.length,0);assert.equal(observed.cancelled,0);
});
test('An explicit death cannot become a medical survivor through positive animation HP',()=>{
  const {context,squad}=setup();const result=context.tacticalTerminalVictoryResultFromCommittedBattlefield({},[{id:'kia',team:'human',hp:12,maxHp:40,alive:false}],squad);
  assert.equal(result.growth[1].state,'KIA');assert.equal(result.tacticalMedical[0].hp,0);assert.equal(result.survivingHumans,0);
});
test('A genuine defeat is passed through without survivor repair',()=>{
  const {context,observed,result}=setup({success:false});context.finishAiPlayback();assert.equal(observed.finished[0],result);
});
for(const state of ['streamPending','streamFailed','operationIncomplete']) test(`Unresolved ${state} playback cannot finalize`,()=>{
  const {context,observed,playback}=setup();if(state==='operationIncomplete')playback.result[state]=true;else playback[state]=true;
  context.finishAiPlayback();assert.equal(observed.finished.length,0);
});
