const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {test} = require('node:test');
const source = fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const context = vm.createContext({});
for (const name of ['tacticalMissionResultHasTerminalOutcome','tacticalAiPlaybackTerminalState','tacticalMissionFailurePresentationState']) {
  const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+10);
  vm.runInContext(source.slice(start,end),context);
}
const state=options=>context.tacticalMissionFailurePresentationState(options);
const terminal={objectiveFailed:true,squadWiped:false,rescueProgress:{rescued:2,required:3}};
const playback=()=>({frames:[{},{}],frameIndex:1,streamComplete:true,result:{success:false,objectiveFailed:true,civilianOutcome:{rescued:2,required:3}}});
test('Missed VIP quota with survivors produces a failure notice and actual counts',()=>{
  const result=state({terminal});assert.equal(result.active,true);assert.equal(result.title,'Mission Failed');assert.match(result.message,/2\/3 rescued/);assert.match(result.message,/partial credit/);
});
test('Unfinished objectives and victory do not show failure',()=>{
  for(const value of [{},{rescueProgress:{impossible:true,active:1}},{...terminal,playbackPending:true},{...terminal,victory:true}])assert.equal(state({terminal:value}).active,false);
});
test('Full AI and Hybrid terminal failures show only after the final presented frame',()=>{
  for(const hybridRound of [false,true]){
    const p={...playback(),hybridRound};assert.equal(state({playback:p}).active,true);
    p.frameIndex=0;assert.equal(state({terminal,playback:p}).active,false);
  }
});
test('Pending actions, animation, stream continuation, interruption and incomplete results suppress failure',()=>{
  for(const option of [{animating:true},{pendingActions:true}])assert.equal(state({terminal,playback:playback(),...option}).active,false);
  for(const key of ['streamPending','streamContinuation','streamFailed'])assert.equal(state({terminal,playback:{...playback(),[key]:true}}).active,false);
  const p=playback();p.result.operationIncomplete=true;assert.equal(state({terminal,playback:p}).active,false);
  p.result={success:true};assert.equal(state({terminal,playback:p}).active,false);
});
test('AI rescue dust-off with hostiles remaining is an explicit failure',()=>{
  const p=playback();p.result.objectiveFailed=false;p.result.aiRescueDustOff=true;
  assert.equal(state({terminal:{livingAlienCount:4},playback:p}).active,true);
  assert.match(state({playback:p}).message,/2\/3 rescued/);
});
test('Squad loss has its own explanation without implying all soldiers are dead',()=>{
  const result=state({terminal:{squadWiped:true,downedHumanCount:2}});
  assert.equal(result.active,true);assert.match(result.title,/Squad Lost/);assert.match(result.message,/No soldiers remain able/);
});
