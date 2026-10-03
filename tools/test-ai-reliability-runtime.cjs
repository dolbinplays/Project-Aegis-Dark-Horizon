const test=require('node:test'),assert=require('node:assert/strict');
const {runtimeContext}=require('./runtime-test-context.cjs');
test('missing gameplay helper prevents a saved AI round before any planning',async()=>{
 const c=runtimeContext();c.seasonalRecoveredDropsFromAliens=undefined;let planned=false;c.resolveMissionGenerator=()=>{planned=true;};
 await assert.rejects(c.resolveMissionAiStreamBatchAsync({initialBattleState:{round:2,units:[],covers:[]}}),/Game startup check failed: seasonalRecoveredDropsFromAliens/);
 assert.equal(planned,false);
});
test('diagnostics distinguish player pause, planning, playback, and failed continuation',()=>{
 const c=runtimeContext();const status=state=>c.tacticalAiDiagnosticReport(state).status;
 assert.equal(status({turn:'ai',commandMapPaused:true}),'waiting-for-player');
 assert.equal(status({turn:'ai',objectiveAssignmentPrompt:{}}),'waiting-for-player');
 assert.equal(status({turn:'ai',aiPlayback:{streamPending:true}}),'planning');
 assert.equal(status({turn:'ai',aiPlayback:{frames:[{},{}],frameIndex:0}}),'playing-actions');
 assert.equal(status({turn:'ai',aiPlayback:{streamFailed:true,streamError:'failure'}}),'error');
 assert.equal(status({turn:'ai'}),'blocked');assert.equal(status({turn:'human'}),'player-control');
});
test('diagnostic export data includes escort ownership and suspended orders without campaign payload',()=>{
 const c=runtimeContext();const units=[{id:'lead',name:'Lead',team:'human',hp:40,alive:true,fireTeamId:'alpha',x:4,y:4,tu:60},{id:'vip',team:'civilian',hp:18,escortId:'lead'}];
 const report=c.tacticalAiDiagnosticReport({units,turn:'ai',aiPlayback:{streamFailed:true,streamError:'missing helper',streamRecoveryContinuation:{secretCampaign:'not exported'}}});
 assert.equal(report.soldiers[0].escortIds[0],'vip');assert.equal(report.canRetry,true);assert.equal(report.error,'missing helper');assert.ok(!JSON.stringify(report).includes('secretCampaign'));
});

test('field-save regression completes its failed mission and retains a serializable result',{timeout:120000},async()=>{
 const c=runtimeContext();const fixture=JSON.parse(JSON.stringify(require('./fixtures/ai-stalled-result-0042.json')));
 const squad=fixture.initialBattleState.units.filter(u=>u.team==='human').map(u=>u.baseSoldier||u.base).filter(Boolean);
 const batch=await c.resolveMissionAiStreamBatchAsync({...fixture,squad,batchRounds:1,maxSimulationRounds:72,hadPriorPlaybackShots:true,fastHandoff:true});
 assert.equal(batch.complete,true);assert.ok(batch.frames.length>0);assert.ok(JSON.parse(JSON.stringify(batch.result)));
});

test('diagnostic download writes a readable JSON report',async()=>{
 const c=runtimeContext();let blob,clicked=false,removed=false;
 c.URL={createObjectURL:value=>{blob=value;return 'blob:diagnostic';},revokeObjectURL:()=>{}};
 c.document.createElement=()=>({click:()=>{clicked=true;},remove:()=>{removed=true;}});
 c.setTimeout=callback=>{callback();return 1;};
 c.tacticalExportAiDiagnostics({turn:'ai',aiPlayback:{streamFailed:true,streamError:'example'}});
 assert.equal(clicked,true);assert.equal(removed,true);assert.equal(JSON.parse(await blob.text()).error,'example');
});
