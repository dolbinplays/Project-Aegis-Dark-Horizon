const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.join(__dirname, '../src/browser-runtime.html'), 'utf8');
const block = source.split('// AEGIS_MOBILE_INTERFACE_BEGIN')[1].split('// AEGIS_MOBILE_INTERFACE_END')[0];
function setup(value, blocked = false) {
  const writes = [], events = [], document = {documentElement:{dataset:{}}};
  const parent = {document:{documentElement:{dataset:{}}}};
  const context = vm.createContext({document, window:{parent, dispatchEvent:e=>events.push(e)},
    CustomEvent: class {constructor(type, init){this.type=type;this.detail=init.detail;}},
    localStorage:{getItem(){if(blocked)throw Error('Storage blocked');return value;},setItem(k,v){if(blocked)throw Error('Storage blocked');writes.push([k,v]);}}});
  vm.runInContext(block,context);
  return {context, document, parent, writes, events};
}
let count = 0;
function test(name, run){run();count++;console.log('PASS '+name);}
test('A fresh or invalid preference keeps the classic Standard layout',()=>{
  for(const value of [null,undefined,'','desktop','Mobile','garbage'])assert.equal(setup(value).document.documentElement.dataset.aegisLayout,'standard');
});
test('Saved Mobile choice initializes both runtime and host shell',()=>{
  const {document,parent}=setup('mobile');
  assert.equal(document.documentElement.dataset.aegisLayout,'mobile');
  assert.equal(parent.document.documentElement.dataset.aegisLayout,'mobile');
});
test('Changing and reverting a layout publishes the preference without campaign writes',()=>{
  const t=setup();
  assert.equal(t.context.writeAegisInterfaceLayout('mobile'),'mobile');
  assert.equal(t.context.writeAegisInterfaceLayout('standard'),'standard');
  assert.deepEqual(t.writes,[['project-aegis-interface-layout-v1','mobile'],['project-aegis-interface-layout-v1','standard']]);
  assert.deepEqual(t.events.map(e=>[e.type,e.detail]),[['aegis-interface-layout-change','mobile'],['aegis-interface-layout-change','standard']]);
  assert.equal(t.parent.document.documentElement.dataset.aegisLayout,'standard');
});
test('Blocked browser storage still permits changing the layout for the session',()=>{
  const t=setup(null,true); assert.equal(t.context.writeAegisInterfaceLayout('mobile'),'mobile');
  assert.equal(t.document.documentElement.dataset.aegisLayout,'mobile');assert.equal(t.events.length,1);
});
test('Cross-origin embedding does not prevent selecting Mobile',()=>{
  const t=setup();Object.defineProperty(t.parent,'document',{get(){throw Error('Cross origin');}});
  assert.equal(t.context.writeAegisInterfaceLayout('mobile'),'mobile');
});
test('Small mobile canvases use their actual size; Standard keeps its established minimum',()=>{
  const f=setup().context.aegisTacticalViewportDimensions;
  for(const [width,height] of [[668,390],[491,375],[392,320],[262,844]]){
    const mount={clientWidth:width,clientHeight:height};
    assert.deepEqual({...f(mount,{},'mobile')},{width,height});
    assert.deepEqual({...f(mount,{},'standard')},{width:Math.max(640,width),height:Math.max(420,height)});
  }
});
test('Mobile Auto uses Performance while explicit quality and Standard Auto remain available',()=>{
  const t=setup('mobile');
  const quality=source.match(/function tacticalThreeResolvedQuality\([^]*?(?=function tacticalThreeQualitySettings)/)[0];
  t.context.normalizeTacticalThreeQuality=value=>value;
  vm.runInContext(quality,t.context);
  const f=t.context.tacticalThreeResolvedQuality,hardware={cores:16,memory:16};
  assert.equal(f('auto',hardware),'performance');assert.equal(f('quality',hardware),'quality');
  t.context.writeAegisInterfaceLayout('standard');assert.equal(f('auto',hardware),'balanced');
});
test('Geoscape capture cleanup tolerates an implicit release and acquisition/release races',()=>{
  const start=source.indexOf('const safelySetGlobePointerCapture='),end=source.indexOf('const handleGlobePointerDown=',start);
  assert.ok(start>0 && end>start);
  const c=vm.createContext({});vm.runInContext(source.slice(start,end)+'\nthis.acquire=safelySetGlobePointerCapture;this.release=safelyReleaseGlobePointerCapture;',c);
  let releases=0;
  c.release({hasPointerCapture:()=>false,releasePointerCapture:()=>releases++},1);assert.equal(releases,0);
  c.release({hasPointerCapture:()=>true,releasePointerCapture:()=>releases++},1);assert.equal(releases,1);
  c.release({hasPointerCapture:()=>true,releasePointerCapture(){throw Error('NotFoundError');}},1);
  c.acquire({setPointerCapture(){throw Error('NotFoundError');}},1);
});
test('A long interrupted two-finger gesture cannot produce a late tactical click',()=>{
  const camera={},runtime={camera,activeCamera:camera},canvas={style:{},setPointerCapture(){},releasePointerCapture(){}};
  let time=0;
  const t=setup('mobile');Object.assign(t.context,{runtime,renderer:{domElement:canvas},performance:{now:()=>time},latestPropsRef:{current:{}}});
  const down=source.slice(source.indexOf('runtime.mobileTouchIds=new Set();'),source.indexOf('runtime.onPointerMove=event=>'));
  const end=source.match(/runtime.endPan=event=>[^]*?(?=\n)/)[0];
  vm.runInContext(down+end,t.context);
  const touch=id=>({pointerId:id,pointerType:'touch',button:0,clientX:0,clientY:0});
  runtime.onPointerDown(touch(1));runtime.onPointerDown(touch(2));
  assert.equal(runtime.panPointer,null);
  time=1000;runtime.endPan(touch(2));time=3000;runtime.endPan(touch(1));
  assert.ok(runtime.suppressClickUntil>time);assert.equal(runtime.mobileTouchIds.size,0);
  runtime.onPointerDown(touch(3));assert.equal(runtime.mobileTouchCanceled,false);assert.equal(runtime.panPointer.id,3);
  time=4000;runtime.endPan({...touch(3),type:'pointercancel'});assert.equal(runtime.panPointer,null);assert.ok(runtime.suppressClickUntil>time);
});
console.log(`${count}/${count} mobile interface behavioral tests passed.`);
