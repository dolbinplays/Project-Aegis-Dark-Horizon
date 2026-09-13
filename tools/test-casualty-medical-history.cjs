const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(path.join(__dirname, '../src/browser-runtime.html'), 'utf8');
const context = vm.createContext({
  normalizeSoldier:s=>({...s}),
  hasTemporaryInjury:s=>s.currentHealth<s.stats.health||Object.values(s.statDamage||{}).some(v=>v>0),
  clamp:(value,min,max)=>Math.max(min,Math.min(max,value)),
  WOUND_HP_PER_DAY:4, MAX_WOUND_RECOVERY_DAYS:60,
  React:{createElement:(type,props,...children)=>({type,props:props||{},children})}
});
for(const name of ['tacticalHumanIsDowned','tacticalCasualtyAftermathOutcomes','tacticalApplyCasualtyExtractionAftermath','tacticalMissionMedicalRecords','medicalOutcomeLabel','medicalRecordSummary','campaignRecordMissionMedical','applyTacticalMedicalGrowth','woundDays','isWounded','enteredMissionWithActiveWound','getCurrentHealth','healStatDamageByDays','soldierRecoveryRemaining','soldierRecoverySummary','recoverSoldierOneDay','recoverSoldierForDays','buildMissionReportEntries','SoldierMedicalHistory']) {
  const start=source.indexOf('function '+name+'('),end=source.indexOf('function ',start+9);
  assert.ok(start>=0 && end>start,name);
  vm.runInContext(source.slice(start,end),context);
}
// The wound helper is followed by constants, so load only its declaration.
vm.runInContext(source.match(/function tacticalMedkitWoundDays[^\n]+?(?=const TACTICAL_CASUALTY)/)[0],context);
const copy=value=>JSON.parse(JSON.stringify(value));
const mission={id:'medical-test',kind:'Rescue patrol',region:'Europe',alien:'Sectoid'};
const roster=['evac','victory','left','dead','wound','medic'].map(id=>({id,name:id,status:'Ready',stats:{health:40},currentHealth:40}));
function aftermath(success) {
  const unit=id=>({id,name:id,team:'human',hp:1,maxHp:40,alive:true,downed:true});
  const units=[{...unit('evac'),casualtyExtracted:true,casualtyExtractionRescuerId:'medic',casualtyExtractionRound:3,casualtyExtractionCraftIndex:0,stabilized:true,stabilizedById:'medic',stabilizedRound:2},unit('victory'),unit('left'),{...unit('dead'),hp:0,alive:false},{...unit('wound'),hp:28,downed:false},{...unit('medic'),hp:40,downed:false}];
  return context.tacticalApplyCasualtyExtractionAftermath({success,logs:['Contact confirmed: test','Mission success. Complete.']},units,roster,mission,success,5);
}
test('Final battlefield creates distinct evacuation, victory recovery, abandonment, death and wound records',()=>{
  const win=aftermath(true),loss=aftermath(false);
  assert.equal(win.medicalRecords.find(r=>r.soldierId==='evac').outcome,'evacuated');
  assert.equal(win.medicalRecords.find(r=>r.soldierId==='victory').outcome,'recovered-after-victory');
  assert.equal(loss.medicalRecords.find(r=>r.soldierId==='left').outcome,'unrecovered');
  assert.equal(loss.medicalRecords.find(r=>r.soldierId==='dead').outcome,'kia');
  assert.equal(win.medicalRecords.find(r=>r.soldierId==='wound').outcome,'wounded-returned');
  assert.ok(!win.medicalRecords.some(r=>r.soldierId==='medic'));
  const evac=win.medicalRecords.find(r=>r.soldierId==='evac');
  assert.equal(evac.rescuerName,'medic'); assert.equal(evac.stabilizedRound,2); assert.equal(evac.craftIndex,0);
  assert.equal(evac.initialRecoveryDays,10);
});
test('Recording the same mission twice after save/reload preserves one history entry and recovery progress',()=>{
  const result=aftermath(true),soldier={...roster[0],status:'Wounded 10d',currentHealth:1};
  const recorded=context.campaignRecordMissionMedical(soldier,result,mission,{month:2,dayOfMonth:7});
  const recovering=context.recoverSoldierOneDay(recorded).soldier;
  const again=context.campaignRecordMissionMedical(copy(recovering),result,mission,{month:2,dayOfMonth:8});
  assert.equal(again.medicalHistory.length,1);assert.equal(again.medicalHistory[0].day,7);
  assert.equal(again.recoveryDaysRemaining,9);
  assert.equal(soldier.medicalHistory,undefined);
});
test('Barracks retain half-day credits across reload and bed transfer; ETA matches actual return to duty',()=>{
  let patient={...roster[0],status:'Overflow 3d',currentHealth:28,statDamage:{accuracy:3},recoveryDaysInitial:3};
  assert.equal(context.soldierRecoverySummary(patient).etaDays,6);
  patient=context.recoverSoldierOneDay(patient).soldier;
  assert.equal(patient.recoveryDaysRemaining,2.5);
  assert.equal(context.soldierRecoverySummary(copy(patient)).etaDays,5);
  patient={...copy(patient),status:'Wounded 3d'};
  assert.equal(context.soldierRecoverySummary(patient).etaDays,3);
  assert.equal(context.recoverSoldierForDays(patient,2).soldier.status,'Wounded 1d');
  assert.equal(context.recoverSoldierForDays(patient,3).soldier.status,'Ready');
  const overflow={...roster[0],status:'Overflow 3d',currentHealth:28};
  assert.notEqual(context.recoverSoldierForDays(overflow,5).soldier.status,'Ready');
  assert.equal(context.recoverSoldierForDays(overflow,6).soldier.status,'Ready');
});
test('Completed recovery retains mission history and never recovers KIA',()=>{
  const result=aftermath(true);
  const patient=context.campaignRecordMissionMedical({...roster[0],status:'Wounded 10d',currentHealth:1},result,mission,{});
  const recovered=context.recoverSoldierForDays(copy(patient),10).soldier;
  assert.equal(recovered.status,'Ready');assert.equal(recovered.medicalHistory[0].recoveryCompleted,true);
  assert.equal(recovered.medicalHistory[0].recoveryElapsedDays,10);assert.equal(recovered.activeMedicalRecordId,null);
  const dead={...roster[0],status:'KIA',currentHealth:0};
  assert.equal(context.recoverSoldierForDays(dead,50).soldier.status,'KIA');
});
test('Medical debrief survives terminal log truncation and history UI renders recovery',()=>{
  const result=aftermath(true),entries=context.buildMissionReportEntries(result,mission);
  assert.equal(entries.filter(line=>line.startsWith('Medical:')).length,5);
  assert.ok(entries.some(line=>line.includes('rescued by medic')));
  const soldier=context.campaignRecordMissionMedical({...roster[0],status:'Wounded 10d',currentHealth:1},result,mission,{month:1,dayOfMonth:1});
  const rendered=JSON.stringify(context.SoldierMedicalHistory({soldier}));
  assert.match(rendered,/Estimated return to duty: 10 days/);assert.match(rendered,/Medical history \(1\)/);
});
