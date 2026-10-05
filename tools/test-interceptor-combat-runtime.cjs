const test = require('node:test');
const assert = require('node:assert/strict');
const {runtimeContext} = require('./runtime-test-context.cjs');

function fixture() {
  const c = runtimeContext(), timers = [];
  class Node {
    constructor(tag) { this.tag=tag; this.children=[]; this.style={}; this.disabled=false; this.attrs={}; }
    appendChild(node) { this.children.push(node); node.parent=this; return node; }
    remove() { if(this.parent)this.parent.children=this.parent.children.filter(node=>node!==this); }
    setAttribute(key,value) { this.attrs[key]=value; }
    focus() { c.document.activeElement=this; }
  }
  const root=new Node('root'), opener=new Node('button');
  opener.focus();
  c.document.getElementById=()=>root;
  c.document.createElement=tag=>new Node(tag);
  c.document.body=new Node('body');
  c.setTimeout=fn=>{timers.push(fn);return timers.length;};
  const events=[];
  c.aegisRunInterceptorCombatMinigame({contact:{id:'test',size:'Small',region:'Europe'},
    onCommit:result=>events.push(['commit',result]),
    onAutoResolve:()=>events.push(['auto']),onAbort:()=>events.push(['abort'])});
  const overlay=c.document.body.children[0];
  const nodes=node=>[node,...node.children.flatMap(nodes)];
  const all=nodes(overlay), slider=all.find(node=>node.tag==='input');
  const [commit,auto,abort]=all.filter(node=>node.tag==='button');
  const flush=()=>{while(timers.length)timers.shift()();};
  return {c,root,opener,overlay,slider,commit,auto,abort,events,flush};
}

test('interception blocks campaign ticks until abort and restores focus without launching',()=>{
  const f=fixture();
  assert.equal(f.c.geoscapeClockBlockedForState({}),true);
  assert.equal(f.root.inert,true);
  f.abort.onclick();
  f.flush(); // delayed initial focus must not steal focus after dismissal
  assert.equal(f.c.geoscapeClockBlockedForState({}),false);
  assert.equal(f.root.inert,false);
  assert.equal(f.c.document.activeElement,f.opener);
  assert.equal(f.c.document.body.children.length,0);
  f.auto.onclick();f.commit.onclick();f.abort.onclick();f.flush();
  assert.deepEqual(f.events,[['abort']]);
});

test('Auto Resolve settles once and unlocks the campaign clock',()=>{
  const f=fixture();
  f.auto.onclick();f.auto.onclick();f.abort.onclick();f.commit.onclick();f.flush();
  assert.deepEqual(f.events,[['auto']]);
  assert.equal(f.c.geoscapeClockBlockedForState({}),false);
});

test('three stages commit once, resist repeated inputs and keep time blocked between stages',()=>{
  const f=fixture();f.flush();
  for(const stage of ['pursuit','weapons','breakaway']){
    f.slider.value=f.c.aegisInterceptorStageTarget('test|Small|Europe|1|standard',stage);
    f.commit.onclick();f.commit.onclick();f.auto.onclick();f.abort.onclick();
    assert.equal(f.c.geoscapeClockBlockedForState({}),true);
    assert.equal(f.events.length,0);
    f.flush();
    if(stage!=='breakaway')assert.equal(f.c.document.activeElement,f.slider);
  }
  assert.equal(f.events.length,1);
  assert.equal(f.events[0][0],'commit');
  assert.equal(f.events[0][1].average,100);
  assert.equal(f.c.geoscapeClockBlockedForState({}),false);
  f.commit.onclick();f.flush();assert.equal(f.events.length,1);
});

test('keyboard focus stays inside the attack dialog and does not reach background shortcuts',()=>{
  const f=fixture();f.flush();
  let stopped=0,prevented=0;
  const key=(key,shiftKey=false)=>({key,shiftKey,stopPropagation:()=>stopped++,preventDefault:()=>prevented++});
  f.overlay.onkeydown(key('Tab',true));
  assert.equal(f.c.document.activeElement,f.abort);
  f.overlay.onkeydown(key('Tab'));
  assert.equal(f.c.document.activeElement,f.slider);
  f.overlay.onkeydown(key('ArrowRight'));
  assert.equal(stopped,3);assert.equal(prevented,2);
  f.abort.onclick();
});

test('neutral modifiers round-trip and Auto Resolve preserves baseline chance and outcome',()=>{
  const c=runtimeContext(),neutral=c.aegisNormalizeInterceptorCombatModifiers({autoResolve:true});
  assert.equal(c.aegisNormalizeInterceptorCombatModifiers(neutral).interactive,false);
  for(const formationSize of [1,2])for(const stanceKey of ['standard','aggressive','cautious']){
    const args={contact:{size:'Small',region:'Europe'},formationSize,stanceKey,weapons:[],detectionCoverage:3};
    for(let roll=1;roll<=100;roll++){
      const baseline=c.resolveAirCombatOutcome({...args,roll});
      const auto=c.resolveAirCombatOutcome({...args,roll,interactiveModifiers:neutral});
      assert.equal(auto.hitChance,c.airCombatHitChance(args.contact,formationSize,[],3,stanceKey));
      assert.equal(auto.key,baseline.key);assert.equal(auto.ammoMultiplier,baseline.ammoMultiplier);
      assert.equal(auto.incomingDamageMultiplier,1);
    }
  }
});

test('pilot damage bonus only applies to damaged escapes and remains capped',()=>{
  const c=runtimeContext();
  for(const key of ['confirmedShootdown','contactLost','evasiveManeuvers','breakaway'])
    assert.equal(c.damagedUfoMemoryFromCombat({}, {key,ufoDamageBonusLevels:1}),null);
  assert.equal(c.damagedUfoMemoryFromCombat({}, {key:'damagedEscape',ufoDamageBonusLevels:1}).level,2);
  assert.equal(c.damagedUfoMemoryFromCombat({ufoDamage:{level:3}}, {key:'damagedEscape',ufoDamageBonusLevels:1}).level,3);
});
