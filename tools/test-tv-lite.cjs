const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');
function harness(enabled=true){
 let now=0,id=0;const timers=new Map(),events={},sizes=[],draws=[],options=[];
 const host={AEGIS_TV_PROFILE:enabled?'lite':'standard'};host.parent=host;
 const document={hidden:false,createElement:()=>({}),head:{append(){}},addEventListener(){}};
 const window={parent:host,addEventListener:(name,fn)=>events[name]=fn};
 class Renderer{constructor(o){options.push(o);this.domElement={style:{}};}setPixelRatio(value){this.ratio=value;}setSize(...args){sizes.push(args);}render(...args){draws.push(args);}dispose(){this.disposed=true;}getRenderTarget(){return null;}}
 const context={window,document,performance:{now:()=>now},setTimeout:(fn,delay)=>{timers.set(++id,{fn,at:now+delay});return id;},clearTimeout:key=>timers.delete(key),setInterval:()=>1,clearInterval(){}};
 vm.runInNewContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-tv-runtime.js'),'utf8'),context);
 return{api:window.AEGIS_TV_RUNTIME,host,window,context,document,events,sizes,draws,options,Renderer,timers,advance(ms){now+=ms;for(const[key,t]of [...timers])if(t.at<=now){timers.delete(key);t.fn();}}};
}
test('TV profile reaches nested runtimes and desktop does not opt in',()=>{
 const h=harness();assert.equal(h.api.enabled,true);assert.equal(h.host.AEGIS_TV_ACTIVE_RUNTIME,h.api);h.events.pagehide();assert.equal(h.host.AEGIS_TV_ACTIVE_RUNTIME,null);
 const desktop=harness(false);assert.equal(desktop.api.enabled,false);assert.equal(desktop.host.AEGIS_TV_ACTIVE_RUNTIME,undefined);
 const renderer=desktop.api.createRenderer({WebGLRenderer:desktop.Renderer},{antialias:true});renderer.setPixelRatio(2);renderer.setSize(3840,2160);renderer.render('a');renderer.render('b');assert.equal(renderer.ratio,2);assert.equal(desktop.options[0].antialias,true);assert.equal(desktop.draws.length,2);
});
test('TV drawing buffer is bounded, preserves CSS size, and avoids redundant allocation',()=>{
 const h=harness(),r=h.api.createRenderer({WebGLRenderer:h.Renderer},{antialias:true});r.setPixelRatio(3);r.setSize(3840,2160);r.setSize(3840,2160);
 assert.equal(h.options[0].antialias,false);assert.equal(r.ratio,1);assert.deepEqual(h.sizes,[[1280,720,false]]);assert.equal(r.domElement.style.width,'3840px');
 r.setSize(1000,2000,false);assert.deepEqual(h.sizes.at(-1),[360,720,false]);assert.equal(r.domElement.style.width,'3840px');
});
test('render throttling keeps the latest frame and dispose cancels pending work',()=>{
 const h=harness(),r=h.api.createRenderer({WebGLRenderer:h.Renderer},{});r.render('first');h.advance(5);r.render('second');r.render('latest');assert.equal(h.draws.length,1);assert.equal(h.timers.size,1);h.advance(29);assert.equal(h.draws.at(-1)[0],'latest');
 r.render('pending');r.dispose();h.advance(100);assert.equal(h.draws.length,2);assert.equal(h.api.snapshot().renderers,0);assert.equal(h.timers.size,0);
});
test('animation budget skips expensive updates without changing the supplied simulation time',()=>{
 const h=harness(),state={};assert.equal(h.api.frameDue(state,0),true);assert.equal(h.api.frameDue(state,16),false);assert.equal(h.api.frameDue(state,34),true);h.document.hidden=true;assert.equal(h.api.frameDue(state,1000),false);h.document.hidden=false;assert.equal(h.api.frameDue(state,1500),true);assert.equal(state.tvLastFrame,1500);
});
test('diagnostics measure actual draws and drop disposed renderers',()=>{
 const h=harness(),r=h.api.createRenderer({WebGLRenderer:h.Renderer},{});for(let i=0;i<30;i++){r.render('scene');h.advance(34);}assert.equal(h.api.snapshot().fps,29);r.dispose();assert.equal(h.api.snapshot().fps,0);
});
test('TV menu pagination bounds work and retains explicit parent page selection',()=>{
 const start=source.indexOf('function AegisTvPagedList('),end=source.indexOf('function readTacticalThreeQuality',start);
 const context={aegisTvLite:()=>true,React:{Fragment:'fragment',createElement:(type,props,...children)=>({type,props,children})}};vm.runInNewContext(source.slice(start,end),context);
 const rendered=[],items=Array.from({length:100},(_,i)=>i);let chosen;
 const view=context.AegisTvPagedList({items,page:3,pageSize:12,onPageChange:p=>chosen=p,renderItem:x=>{rendered.push(x);return x;}});
 assert.deepEqual(rendered,items.slice(36,48));view.children[0].children[2].props.onClick();assert.equal(chosen,4);
 rendered.length=0;context.aegisTvLite=()=>false;context.AegisTvPagedList({items,renderItem:x=>rendered.push(x)});assert.equal(rendered.length,100);
});
test('TV defaults and all WebGL constructors go through presentation budget; asset is cached',()=>{
 assert.ok(source.includes('useState(()=>aegisTvLite()?"2d":tacticalMissionInitialPresentation(cachedBattleState).tacticalViewMode)'));
 assert.ok(source.includes('useState(!aegisTvLite()&&Boolean(cachedBattleState?.aiFirstPersonView))'));
 assert.equal((source.match(/new THREE.WebGLRenderer\(/g)||[]).length,1);
 assert.ok(source.includes('useState(()=>aegisTvLite()?[]:runSelfTests())'));
 assert.ok(fs.readFileSync(path.join(root,'service-worker.js'),'utf8').includes('./assets/runtime/aegis-tv-runtime.js'));
});
test('patch-history initialization does not repeatedly wrap the test runner on menu updates',()=>{
 const start=source.indexOf('const PATCH_NOTES_HISTORY=useMemo('),end=source.indexOf('function PatchNotesLibraryScreen',start);
 let memo,runner=()=>[],registrations=0;
 const context={CURRENT_GAME_BUILD:'test-build',useMemo:fn=>memo??(memo=fn())};
 Object.defineProperty(context,'runSelfTests',{get:()=>runner,set:value=>{runner=value;registrations++;}});
 vm.runInNewContext('renderHistory=()=>{'+source.slice(start,end)+'return PATCH_NOTES_HISTORY;};',context);
 const first=context.renderHistory(),registered=registrations;assert.ok(registered>0);assert.ok(first.length>200);
 for(let i=0;i<50;i++)assert.equal(context.renderHistory(),first);
 assert.equal(registrations,registered);assert.equal(first.filter(entry=>entry.build==='test-build').length,1);
});
