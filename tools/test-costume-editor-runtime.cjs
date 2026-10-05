const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtimeContext}=require('./runtime-test-context.cjs');
const root=path.resolve(__dirname,'..');
const library=()=>JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-costume-library.json'),'utf8'));
function editorFixture(files={},failure=null,previewFailure=false){
 const elements=new Map(),writes=[];
 const node=()=>({children:[],append(...nodes){this.children.push(...nodes);},dataset:{},classList:{add(){},toggle(){}},addEventListener(){},getBoundingClientRect(){return{width:600,height:600};},style:{setProperty(){}},appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];},click(){}});
 const document={querySelectorAll(selector){return selector==='.slotbtn'?(elements.get('slots')?.children||[]):[];},querySelector(){return node();},getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);},createElement:node};
 const missing=()=>Object.assign(new Error('missing'),{name:'NotFoundError'});
 const dir={async getFileHandle(name,options={}){
  if(!(name in files)&&!options.create)throw missing();
  return{async getFile(){return{text:async()=>files[name]};},async createWritable(){if(failure?.(name))throw new Error('write denied');let value;return{async write(text){value=text;},async close(){files[name]=value;writes.push(name);},async abort(){}};}};
 }};
 const folder={async getFileHandle(name){if(name!=='index.html')throw missing();return{};},async getDirectoryHandle(name){assert.equal(name,'assets');return{async getDirectoryHandle(child){assert.equal(child,'data');return dir;}};}};
 const c={document,structuredClone,Blob,URL,setTimeout:()=>{},performance:{now:()=>0},devicePixelRatio:1,requestAnimationFrame:()=>{},THREE:{...require('../assets/vendor/three.min.js'),WebGLRenderer:class{constructor(){if(previewFailure)throw new Error("WebGL unavailable");}setPixelRatio(){}setSize(){}render(){}}},window:{addEventListener(){},showDirectoryPicker:async()=>folder}};
 vm.createContext(c);vm.runInContext(fs.readFileSync(path.join(root,"assets/runtime/aegis-costume-celebration.js"),"utf8"),c);const html=fs.readFileSync(path.join(root,'AEGIS_Costume_Editor_CURRENT.html'),'utf8');vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],c);
 return{c,elements,files,writes};
}
test('service worker evaluates and caches both new offline assets',()=>{
 const handlers={};const c={URL,self:{registration:{scope:'https://example.org/game/'},addEventListener:(key,fn)=>handlers[key]=fn}};vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'service-worker.js'),'utf8'),c);
 assert.equal(typeof handlers.fetch,'function');
 assert.equal(vm.runInContext('AEGIS_TOOL_NAV_URLS.has("https://example.org/game/AEGIS_Building_Layout_Editor_CURRENT.html")',c),true);
 for(const asset of ['./AEGIS_Costume_Editor_CURRENT.html','./assets/data/aegis-costume-library.js'])assert.equal(vm.runInContext(`AEGIS_SMALL_SHELL.includes(${JSON.stringify(asset)})`,c),true);
});
test('ordinary drops retain legacy IDs and signatures complete their foundation set',()=>{
 const c=runtimeContext();let standard=0,rare=0;
 for(let i=0;i<500;i++){
  const p=c.seasonalHalloweenPieceForCarrier({id:'test-'+i},0);
  if(p.variantKey){rare++;const loadout=Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{...p,slot}]));assert.equal(c.seasonalFullSet(loadout).key,p.setKey);}
  else{standard++;assert.equal(p.itemId,`halloween:${p.setKey}:${p.slot}`);}
 }
 assert.ok(standard>0&&rare>0);
});
test('authored palette, label and flourish resolve on existing pieces with safe malformed-data fallback',()=>{
 const c=runtimeContext();c.AEGIS_COSTUME_LIBRARY=library();
 const base=c.AEGIS_COSTUME_LIBRARY.sets.find(row=>row.key==='vampire');Object.assign(base,{label:'Test name',primary:123,flourish:'Test flourish'});
 assert.equal(c.seasonalPieceDisplayLabel({setKey:'vampire',slot:'top'}),'Test name Top');
 assert.equal(c.seasonalSetDefinition('vampire').primary,123);
 const full=Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{setKey:'vampire',slot}]));assert.equal(c.seasonalFullSet(full).flourish,'Test flourish');
 c.AEGIS_COSTUME_LIBRARY.sets={};c.AEGIS_COSTUME_LIBRARY.variants={};assert.ok(Number.isFinite(c.seasonalSetDefinition({setKey:'vampire',variantKey:'crimson-vampire'}).primary));
});
test('editor rejects corrupt project data instead of enabling a default overwrite',async()=>{
 const f=editorFixture({'aegis-costume-library.json':'{broken','aegis-costume-library.js':'original'});
 await f.elements.get('choose').onclick();assert.equal(f.elements.get('save').disabled,true);assert.match(f.elements.get('status').textContent,/Cannot load/);assert.equal(f.writes.length,0);
});
test('editor saves both formats after backing up both originals',async()=>{
 const f=editorFixture({'aegis-costume-library.json':JSON.stringify(library()),'aegis-costume-library.js':'original JS'});
 await f.elements.get('choose').onclick();f.elements.get('label').value='<Costume name>';await f.elements.get('save').onclick();
 assert.equal(f.writes.length,4);assert.ok(f.writes.slice(0,2).every(name=>name.includes('.backup-')));
 const c={window:{}};vm.runInNewContext(f.files['aegis-costume-library.js'],c);assert.equal(c.window.AEGIS_COSTUME_LIBRARY.sets[0].label,'<Costume name>');
 assert.equal(JSON.parse(f.files['aegis-costume-library.json']).sets[0].label,'<Costume name>');
});
test('failed backup prevents either canonical library from being overwritten',async()=>{
 const files={'aegis-costume-library.json':JSON.stringify(library()),'aegis-costume-library.js':'original JS'},before={...files};
 const f=editorFixture(files,name=>name.startsWith('aegis-costume-library.js.backup-'));
 await f.elements.get('choose').onclick();await f.elements.get('save').onclick();
 assert.equal(files['aegis-costume-library.js'],before['aegis-costume-library.js']);assert.equal(files['aegis-costume-library.json'],before['aegis-costume-library.json']);assert.match(f.elements.get('status').textContent,/Save failed/);
});
test('editor rejects invalid identities and colors and reports unavailable folder access',async()=>{
 const f=editorFixture(),data=library();data.sets[0].primary=-1;assert.throws(()=>f.c.validateLibrary(data),/color/);
 data.sets[0].primary=0;data.variants[0].setKey='witch';assert.throws(()=>f.c.validateLibrary(data),/identity/);
 f.c.window.showDirectoryPicker=null;await f.elements.get('choose').onclick();assert.equal(f.elements.get('save').disabled,true);assert.match(f.elements.get('status').textContent,/unavailable/);
});

test('fit editor rejects malformed, nonfinite and out-of-range transforms before saving',()=>{
 const f=editorFixture();
 for(const [key,value] of [['position',[0,Infinity,0]],['rotation',[0,'bad',0]],['scale',[0,1,1]],['scale',[-1,1,1]],['scale',[4,1,1]],['position',[0,1]]]){
  const data=library();data.sets[0].slots.top[key]=value;assert.throws(()=>f.c.validateLibrary(data),/transform/);
 }
 const data=library();data.sets[0].slots.top.fits.stocky={scale:[1,NaN,1]};assert.throws(()=>f.c.validateLibrary(data),/transform/);
});
test('runtime clamps invalid fit data and retains legacy opacity when no override is authored',()=>{
 const c=runtimeContext();const style=c.seasonalCostumeSlotStyle({slots:{top:{position:[Infinity,2,0],scale:[-1,99,NaN],opacity:NaN,emissive:Infinity}}},'top');
 assert.equal(style.position[0],0);assert.equal(style.scale[0],.2);assert.equal(style.scale[1],3);assert.equal(style.scale[2],1);assert.equal(style.opacity,undefined);assert.equal(style.emissive,.16);
 let options;c.tacticalThreePersistentMaterial=(runtime,key,color,value)=>{options=value;return value;};c.seasonalThreeMaterial({},'test',0,.94,style);assert.equal(options.opacity,.94);
});
test('preview costume geometry, placement and material match runtime for every foundation set',()=>{
 const f=editorFixture(),c=runtimeContext(),THREE=f.c.THREE;c.AEGIS_COSTUME_LIBRARY=library();
 c.tacticalThreePersistentMaterial=(runtime,key,color,options)=>new THREE.MeshStandardMaterial({color,opacity:options.opacity,emissiveIntensity:options.emissive});
 const signature=root=>{const meshes=[];root.traverse(object=>{if(object.isMesh)meshes.push({type:object.geometry.type,parameters:object.geometry.parameters,position:object.position.toArray(),rotation:object.rotation.toArray(),opacity:object.material.opacity});});return JSON.parse(JSON.stringify(meshes));};
 for(let i=0;i<library().sets.length;i++){
  f.c.select('sets:'+i);const key=library().sets[i].key,loadout=Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{setKey:key,slot}])),root=new THREE.Group();c.seasonalThreeAddCostume({THREE},root,{id:'test',seasonalCosmetics:loadout});
  const expected=signature(root).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));const actual=signature(vm.runInContext('costumeRoot',f.c)).sort((a,b)=>JSON.stringify(a).localeCompare(JSON.stringify(b)));
  assert.deepEqual(actual,expected,key);
 }
});
test('rebuilding the preview releases replaced GPU geometry and materials',()=>{
 const f=editorFixture();const root=vm.runInContext('costumeRoot',f.c);let geometry=0,material=0,count=0;
 root.traverse(object=>{if(object.isMesh){count++;object.geometry.addEventListener('dispose',()=>geometry++);object.material.addEventListener('dispose',()=>material++);}});
 f.c.rebuildCostume();assert.ok(count>0);assert.equal(geometry,count);assert.equal(material,count);
});

test('missing WebGL preview does not disable file authoring',async()=>{
 const f=editorFixture({'aegis-costume-library.json':JSON.stringify(library()),'aegis-costume-library.js':'original'},null,true);
 assert.match(f.elements.get('status').textContent,/preview unavailable/);
 await f.elements.get('choose').onclick();assert.equal(f.elements.get('save').disabled,false);await f.elements.get('save').onclick();assert.equal(f.writes.length,4);
});

test('all celebration effects remain finite across frames, including a zero-time start',()=>{
 const c=runtimeContext(),THREE=require('../assets/vendor/three.min.js');let now=0;c.performance.now=()=>now;
 c.tacticalThreePersistentMaterial=(r,key,color,o)=>new THREE.MeshStandardMaterial({color,opacity:o.opacity});
 for(const effect of ['orbit','cape','witchlight','moon','sand','mist','lightning','bones','spectral']){
  c.AEGIS_COSTUME_LIBRARY=library();c.AEGIS_COSTUME_LIBRARY.sets[0].celebration={effect,intensity:.7,speed:1,phases:[{pose:'standing',durationMs:150},{pose:'victory',durationMs:150}]};
  const unit={id:'test',seasonalCosmetics:Object.fromEntries(['top','bottom','head','weapon'].map(slot=>[slot,{setKey:'vampire',slot}]))},node=new THREE.Group();now=0;
  const group=c.seasonalThreeCelebrationFlourish({THREE},node,unit);now=175;group.children[0].onBeforeRender();assert.equal(group.userData.phaseIndex,1,effect);
  for(const time of [300,1500,7000]){now=time;assert.equal(c.seasonalThreeCelebrationFlourish({THREE},node,unit),group);group.traverse(o=>assert.ok([...o.position.toArray(),...o.scale.toArray()].every(Number.isFinite),effect));}
 }
});
test('phase controls remain attached after preview reads and support one to four phases',()=>{
 const f=editorFixture();f.c.rebuildCelebrationInputs();const first=f.elements.get('celebrationPhases').children[0],select=first.children[0].children[0],duration=first.children[1].children[0];
 f.c.ensureCelebration();f.c.ensureCelebration();select.value='kneel';select.onchange();duration.value='650';duration.oninput();
 assert.equal(f.c.ensureCelebration().phases[0].pose,'kneel');assert.equal(f.c.ensureCelebration().phases[0].durationMs,650);
 for(let i=0;i<6;i++)f.elements.get('addCelebrationPhase').onclick();assert.equal(f.c.ensureCelebration().phases.length,4);
 for(let i=0;i<6;i++)f.elements.get('removeCelebrationPhase').onclick();assert.equal(f.c.ensureCelebration().phases.length,1);
});
test('editor previews selected effect from phase zero and disposes it on completion',()=>{
 const f=editorFixture();let now=12345;f.c.performance.now=()=>now;f.c.ensureCelebration().effect='lightning';f.elements.get('previewCelebration').onclick();f.c.loop(now);
 const group=vm.runInContext('celebrationGroup',f.c);assert.equal(group.children.length,6);assert.equal(group.userData.phaseIndex,0);
 let disposed=0;group.traverse(o=>o.geometry?.addEventListener('dispose',()=>disposed++));now+=7100;f.c.loop(now);assert.equal(vm.runInContext('celebrationGroup',f.c),null);assert.equal(disposed,6);
});
