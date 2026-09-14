const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const start=source.indexOf('function shouldAutoSetBaseActivitySpeed(');
const helper=source.slice(start,source.indexOf('function ',start+10));
const effectStart=source.indexOf('useEffect(()=>{if(screen==="game"&&!gameOver&&shouldAutoSetBaseActivitySpeed(');
assert.ok(effectStart>0);
const effect=source.slice(effectStart,source.indexOf('useEffect(',effectStart+10));
function open(tab,minutes,running){
  const writes=[];
  const context=vm.createContext({tab,screen:'game',gameOver:false,geoscapeTickMinutes:minutes,geoscapeClockRunning:running,
    useEffect:fn=>fn(),setGeoscapeTickMinutes:v=>writes.push(['minutes',v]),setGeoscapeClockRunning:v=>writes.push(['running',v]),completeAction:()=>{}});
  vm.runInContext(helper+effect,context);return writes;
}
test('Navigating to Base preserves pause at zero and remembered nonzero speeds',()=>{
  for(const minutes of [0,1,5,30,60])assert.deepEqual(open('base',minutes,false),[]);
});
test('Other views cannot resume the clock; running Base behavior remains compatible',()=>{
  for(const tab of ['geoscape','missions','barracks','sickbay'])assert.deepEqual(open(tab,30,false),[]);
  assert.deepEqual(open('base',5,true),[]);
  assert.deepEqual(open('base',30,true),[['minutes',5],['running',true]]);
});
