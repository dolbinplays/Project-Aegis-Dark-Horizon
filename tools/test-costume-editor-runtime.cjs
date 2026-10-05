const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtimeContext}=require('./runtime-test-context.cjs');
const root=path.resolve(__dirname,'..');
const library=()=>JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-costume-library.json'),'utf8'));
function editorFixture(files={},failure=null){
 const elements=new Map(),writes=[];
 const node=()=>({children:[],style:{setProperty(){}},appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];},click(){}});
 const document={getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);},createElement:node};
 const missing=()=>Object.assign(new Error('missing'),{name:'NotFoundError'});
 const dir={async getFileHandle(name,options={}){
  if(!(name in files)&&!options.create)throw missing();
  return{async getFile(){return{text:async()=>files[name]};},async createWritable(){if(failure?.(name))throw new Error('write denied');let value;return{async write(text){value=text;},async close(){files[name]=value;writes.push(name);},async abort(){}};}};
 }};
 const folder={async getFileHandle(name){if(name!=='index.html')throw missing();return{};},async getDirectoryHandle(name){assert.equal(name,'assets');return{async getDirectoryHandle(child){assert.equal(child,'data');return dir;}};}};
 const c={document,structuredClone,Blob,URL,setTimeout:()=>{},window:{showDirectoryPicker:async()=>folder}};
 vm.createContext(c);const html=fs.readFileSync(path.join(root,'AEGIS_Costume_Editor_CURRENT.html'),'utf8');vm.runInContext(html.match(/<script>([\s\S]*?)<\/script>/)[1],c);
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
