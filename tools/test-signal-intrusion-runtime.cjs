const test=require('node:test'),assert=require('node:assert/strict');
const {runtimeContext}=require('./runtime-test-context.cjs');
function fixture(){
 const c=runtimeContext(),timers=[],observers=[];
 class Node {
  constructor(tag){this.tag=tag;this.children=[];this.style={};this.disabled=false;this.attrs={};}
  appendChild(n){this.children.push(n);n.parent=this;return n;}
  prepend(n){this.children.unshift(n);}
  remove(){if(this.parent)this.parent.children=this.parent.children.filter(x=>x!==this);}
  setAttribute(k,v){this.attrs[k]=v;}
  addEventListener(){} focus(){c.document.activeElement=this;}
  set innerHTML(value){this.parts={};for(const k of ['status','grid','log','actions'])this.parts[k]=new Node('div');}
  querySelector(selector){return this.parts?.[selector.match(/intrusion-(\w+)/)?.[1]]||null;}
  querySelectorAll(){return this.children.filter(n=>n.tag==='button');}
 }
 c.document.createElement=tag=>new Node(tag);c.document.body=new Node('body');
 c.MutationObserver=class{constructor(fn){this.fn=fn;this.disconnected=false;observers.push(this);}observe(){}disconnect(){this.disconnected=true;}};
 c.setTimeout=fn=>{timers.push(fn);return timers.length;};
 const outcomes=[];const puzzle=c.aegisSignalIntrusionPuzzle('review');
 c.aegisRunSignalIntrusionMinigame({seed:'review',onSuccess:x=>outcomes.push(['success',x]),onFailure:x=>outcomes.push(['failure',x]),onAutoResolve:()=>outcomes.push(['auto'])});
 const overlay=c.document.body.children[0],panel=overlay.children[0],buttons=panel.parts.grid.children,actions=panel.parts.actions.children;
 const correct=buttons.find(b=>b.textContent===puzzle.target.join('-')),wrong=buttons.filter(b=>b!==correct);
 return{c,timers,observers,outcomes,buttons,actions,correct,wrong,flush:()=>{while(timers.length)timers.shift()();}};
}
test('winning locks all guesses immediately and commits exactly one fixed reward',()=>{
 const f=fixture();f.correct.onclick();for(const button of f.wrong)button.onclick();f.flush();
 assert.equal(f.outcomes.length,1);assert.equal(f.outcomes[0][0],'success');assert.equal(f.outcomes[0][1].attemptsUsed,1);assert.equal(f.outcomes[0][1].refund,4);
 assert.equal(f.c.__AEGIS_SIGNAL_INTRUSION_ACTIVE,false);assert.equal(f.c.document.body.children.length,0);
});
test('four failed guesses lock out further input and charge one failure',()=>{
 const f=fixture();for(const button of f.wrong.slice(0,4))button.onclick();f.correct.onclick();f.flush();
 assert.deepEqual(f.outcomes.map(x=>x[0]),['failure']);assert.equal(f.outcomes[0][1].attemptsUsed,4);
});
test('committing disables auto resolve and abort synchronously',()=>{
 const f=fixture();f.wrong[0].onclick();assert.ok(f.actions.every(b=>b.disabled));f.actions.forEach(b=>b.onclick());assert.equal(f.outcomes.length,0);
});
test('abort and auto resolve clean up their UI resources',()=>{
 for(const action of [0,1]){const f=fixture();f.actions[action].onclick();f.flush();assert.equal(f.c.document.body.children.length,0);assert.ok(f.observers.every(o=>o.disconnected));assert.equal(f.c.__AEGIS_SIGNAL_INTRUSION_ACTIVE,false);assert.equal(f.outcomes.length,action===0?1:0);}
});

for(const attempt of [2,3,4])test(`success on attempt ${attempt} preserves its TU refund`,()=>{
 const f=fixture();for(const b of f.wrong.slice(0,attempt-1))b.onclick();f.correct.onclick();f.flush();
 assert.equal(f.outcomes.length,1);assert.equal(f.outcomes[0][1].attemptsUsed,attempt);assert.equal(f.outcomes[0][1].refund,attempt===2?2:0);
});
test('only one intrusion can be open at a time, and closing permits a new one',()=>{
 const f=fixture();assert.equal(f.c.aegisRunSignalIntrusionMinigame({seed:'duplicate'}),false);assert.equal(f.c.document.body.children.length,1);
 f.actions[1].onclick();assert.equal(f.c.aegisRunSignalIntrusionMinigame({seed:'next'}),true);assert.equal(f.c.document.body.children.length,1);
});
