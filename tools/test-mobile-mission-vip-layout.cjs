const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const source=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const component=source.slice(source.indexOf('function MissionControlScreen('),source.indexOf('function MissionLaunchReviewFrame('));
const children=value=>(Array.isArray(value)?value.flat(Infinity):[value]).filter(x=>x!==null&&x!==undefined&&typeof x!=='boolean');
const el=(type,props,...items)=>({type,props:{...props,children:children(items)}});
const valid=x=>Boolean(x&&typeof x==='object'&&x.props);
const React={createElement:el,isValidElement:valid,Children:{toArray:children},cloneElement:(node,props,...items)=>({type:node.type,props:{...node.props,...props,...(items.length?{children:children(items)}:{})}})};
const nodes=tree=>valid(tree)?[tree,...children(tree.props.children).flatMap(nodes)]:[];
const text=tree=>valid(tree)?children(tree.props.children).map(text).join(' '):String(tree??'');
function setup(withVip=true,layout='mobile'){
 let section='briefing',clicked=null;
 const context=vm.createContext({React,Map,useAegisInterfaceLayout:()=>layout,useState:()=>[section,value=>section=value],useRef:value=>({current:value}),useEffect:()=>{}});
 vm.runInContext(component,context);
 const button=(label,action)=>el('button',{onClick:()=>clicked=action},label);
 const squads=el('div',{},'Choose primary',el('div',{},el('button',{onClick:()=>clicked='primary'},el('b',{},'Alpha'),el('p',{},'6 seats'))),el('div',{},'Morale'),el('label',{},'Support',el('select',{onChange:()=>clicked='support'})));
 const vip=el('p',{'data-aegis-vip-briefing':true},'VIP count: unknown. TRANSMISSION LOST');
 const column=el('div',{},el('header',{},el('h2',{},'Abduction'),button('Open Incident List','incidents')),el('p',{},'Threat 2'),withVip?vip:null,el('p',{},'Selected response force'),el('div',{},'Visual roster'),squads,el('textarea',{onChange:()=>clicked='orders'}));
 const estimate=el('aside',{},el('p',{},'Power estimate'),el('div',{},button('Play Tactical Mission','launch')));
 const content=el('div',{},el('section',{},el('main',{},column,estimate)));
 const render=(mission={kind:'Abduction'})=>context.MissionControlScreen({content,mission,bases:[],onSelectBase:()=>clicked='base'});
 return{render,content,clicked:()=>clicked};
}
test('VIP briefing retains adaptive Briefing, Squads and Launch panes and original callbacks',()=>{
 const t=setup();let tree=t.render();assert.equal(tree.props['data-aegis-mobile-missions'],'true');assert.match(text(tree),/VIP count: unknown/);
 nodes(tree).find(n=>n.type==='button'&&text(n)==='Open Incident List').props.onClick();assert.equal(t.clicked(),'incidents');
 nodes(tree).find(n=>n.type==='button'&&text(n)==='Squads').props.onClick();tree=t.render();assert.match(text(tree),/Visual roster/);
 nodes(tree).find(n=>n.props['aria-label']==='Mission primary squad').props.onChange({target:{value:'0'}});assert.equal(t.clicked(),'primary');
 nodes(tree).find(n=>n.props['aria-label']==='Mission support squad').props.onChange();assert.equal(t.clicked(),'support');
 nodes(tree).find(n=>n.type==='button'&&text(n)==='Launch').props.onClick();tree=t.render();
 nodes(tree).find(n=>n.type==='textarea').props.onChange();assert.equal(t.clicked(),'orders');
 nodes(tree).find(n=>n.type==='button'&&text(n)==='Play Tactical Mission').props.onClick();assert.equal(t.clicked(),'launch');
});
test('legacy briefings still adapt and standard/tactical screens remain unchanged',()=>{
 assert.equal(setup(false).render().props['data-aegis-mobile-missions'],'true');
 const standard=setup(true,'standard');assert.equal(standard.render(),standard.content);
 const tactical=setup();assert.equal(tactical.render({manual:true}),tactical.content);
});
