const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const crypto = require('node:crypto');

const root = path.resolve(__dirname, '..');
const source = fs.readFileSync(path.join(root, 'src', 'browser-runtime.html'), 'utf8');
const scripts = [...source.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/gi)].map(match => match[1]);
assert.ok(scripts.length >= 7, 'canonical runtime should retain executable application script');
const appScript = scripts.find(script => script.includes('const CURRENT_GAME_BUILD=') && script.includes('function resolveMissionAiStreamBatchAsync'));
assert.ok(appScript, 'canonical runtime application script should be discoverable independent of external script tags');
let appSource = appScript.replace(/ReactDOM\.createRoot\(document\.getElementById\("root"\)\)\.render\([^;]+;\s*$/s, '');

const noop = () => {};
const element = () => ({style:{},dataset:{},classList:{add:noop,remove:noop,toggle:noop},appendChild:noop,remove:noop,setAttribute:noop,getAttribute:()=>null,addEventListener:noop,removeEventListener:noop,querySelector:()=>null,querySelectorAll:()=>[],getContext:()=>null});
const storage = () => { const map = new Map(); return {getItem:key=>map.get(key)||null,setItem:(key,value)=>map.set(key,String(value)),removeItem:key=>map.delete(key),clear:()=>map.clear()}; };

function runtimeContext(options={}) {
  const context = {
    console, Math:Object.create(Math), Date, JSON, Number, String, Boolean, Array, Object, Map, Set, WeakMap, WeakSet,
    Promise, RegExp, Error, TypeError, parseInt, parseFloat, isNaN, Infinity, NaN, structuredClone, TextEncoder, TextDecoder,
    Blob, URL, URLSearchParams, performance:{now:()=>Date.now()}, setTimeout, clearTimeout, setInterval, clearInterval,
    requestAnimationFrame:callback=>setTimeout(()=>callback(Date.now()),0), cancelAnimationFrame:clearTimeout,
    localStorage:storage(), sessionStorage:storage(), navigator:{userAgent:'node',hardwareConcurrency:8,storage:{estimate:async()=>({quota:1e9,usage:0})}},
    location:{protocol:'http:',hostname:'localhost',href:'http://localhost/'}, history:{}, addEventListener:noop, removeEventListener:noop,
    matchMedia:()=>({matches:false,addEventListener:noop,removeEventListener:noop}), crypto:crypto.webcrypto,
    document:{body:element(),head:element(),documentElement:element(),getElementById:()=>element(),createElement:element,querySelector:()=>null,querySelectorAll:()=>[],addEventListener:noop,removeEventListener:noop},
    React:{createElement:()=>({}),memo:fn=>fn,forwardRef:fn=>fn,Component:class{},PureComponent:class{},useState:()=>[null,noop],useEffect:noop,useMemo:fn=>fn(),useRef:value=>({current:value}),useCallback:fn=>fn,useLayoutEffect:noop,Fragment:'fragment'},
    ReactDOM:{createRoot:()=>({render:noop})}, THREE:{}
  };
  context.window=context; context.globalThis=context; context.self=context;
  Object.assign(context.React,options.React||{});
  if(options.tv)context.AEGIS_TV_RUNTIME={enabled:true,metrics:{}};
  vm.createContext(context);
  vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-building-layouts.js'),'utf8'),context);
  vm.runInContext(appSource, context, {timeout:15000});
  return context;
}

function seededRandom(context, seed=123456789) {
  let state=seed>>>0;
  context.Math.random=()=>((state=(Math.imul(state,1664525)+1013904223)>>>0)/4294967296);
}



const c=runtimeContext();
const member=(x,y,extra={})=>({id:'u',team:'human',hp:40,alive:true,x,y,fireTeamRole:'leader',...extra});
const teams=[{id:'far',label:'Far',members:[member(10,4)]},{id:'near',label:'Near',members:[member(3,4)]},{id:'tie',label:'Tie',members:[member(3,4)]},{id:'missing',label:'Missing',members:[]}];
const objectives=[{id:'west',label:'West rescue',x:2,y:4},{id:'east',label:'East beacon',x:11,y:4}];
test('distance sorting is nearest-first, stable for ties, and never mutates inputs',()=>{
 const before=JSON.stringify(teams),rows=c.tacticalTeamsSortedForObjective(teams,objectives[0]);
 assert.deepEqual([...rows.map(r=>r.team.id)],['near','tie','far','missing']);assert.equal(rows[0].distance,1);assert.equal(rows[3].distance,Infinity);assert.equal(JSON.stringify(teams),before);
 assert.deepEqual([...c.tacticalTeamsSortedForObjective(teams,null).map(r=>r.team.id)],teams.map(t=>t.id));
});
test('leader anchors distance; incapacitated leaders fall back to an active member',()=>{
 const team={members:[member(3,4,{fireTeamRole:'support'}),member(10,4)]};
 assert.equal(c.tacticalFireTeamDistanceToObjective(team,objectives[0]),8);
 team.members[1].unconscious=true;assert.equal(c.tacticalFireTeamDistanceToObjective(team,objectives[0]),1);
 team.members[0].extracted=true;assert.equal(c.tacticalFireTeamDistanceToObjective(team,objectives[0]),Infinity);
 assert.equal(c.tacticalFireTeamDistanceToObjective(teams[0],{x:null,y:4}),Infinity);
});
test('actual objective cards reorder rendered rows without issuing assignments; reset and reopen restore order',()=>{
 let state=null;const changed=[];
 const ui=runtimeContext({React:{useState:initial=>[state,value=>{state=value;}],createElement:(type,props,...children)=>({type,props:props||{},children:children.flat(Infinity)})}});ui.ReactDOM.createPortal=tree=>tree;
 const board=vm.runInContext('FireTeamObjectiveAssignmentOverlay',ui),prompt={reason:'review'},choices={far:'west',near:'assist:far'};
 const props={prompt,teams,objectives,choices,onChange:(...args)=>changed.push(args)};
 const nodes=n=>n&&typeof n==='object'?[n,...(n.children||[]).flatMap(nodes)]:[];
 const ids=tree=>nodes(tree).filter(n=>n.props['data-aegis-objective-assignment-team']).map(n=>n.props['data-aegis-objective-assignment-team']);
 let tree=board(props);assert.deepEqual(ids(tree),teams.map(t=>t.id));
 const button=nodes(tree).find(n=>n.props['data-aegis-objective-sort']==='west');assert.equal(button.type,'button');button.props.onClick();tree=board(props);
 assert.deepEqual(ids(tree),['near','tie','far','missing']);assert.equal(changed.length,0);assert.equal(choices.far,'west');assert.equal(nodes(tree).find(n=>n.props['data-aegis-objective-sort']==='west').props['aria-pressed'],true);
 const firstSelect=nodes(tree).find(n=>n.type==='select');firstSelect.props.onChange({target:{value:'east'}});assert.deepEqual(changed,[['near','east']]);
 nodes(tree).find(n=>n.props['data-aegis-objective-sort']==='east').props.onClick();assert.equal(ids(board(props))[0],'far');
 nodes(board(props)).find(n=>n.props['data-aegis-objective-sort-reset']).props.onClick();assert.deepEqual(ids(board(props)),teams.map(t=>t.id));
 button.props.onClick();assert.deepEqual(ids(board({...props,prompt:{reason:'review'}})),teams.map(t=>t.id));
 assert.deepEqual(ids(board({...props,objectives:[]})),teams.map(t=>t.id));
 assert.equal(board({...props,prompt:null}),null);
});

test('sorting recomputes from updated positions and objectives while retaining tie order',()=>{
 const moved=teams.map(t=>t.id==='far'?{...t,members:[member(2,4)]}:t);
 assert.equal(c.tacticalTeamsSortedForObjective(moved,objectives[0])[0].team.id,'far');
 assert.equal(c.tacticalTeamsSortedForObjective(teams,{...objectives[0],x:11})[0].team.id,'far');
 assert.equal(c.tacticalTeamsSortedForObjective([],objectives[0]).length,0);
});
