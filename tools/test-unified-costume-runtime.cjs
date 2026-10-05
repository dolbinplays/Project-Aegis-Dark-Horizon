const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const {runtimeContext}=require('./runtime-test-context.cjs');
const root=path.resolve(__dirname,'..'),THREE=require('../assets/vendor/three.min.js');
const editor='AEGIS_Articulated_Pose_Editor_v0.26.10.05.0056_UNIFIED_POSE_AND_COSTUME_AUTHORING_PATCH.html';
const library=()=>JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-costume-library.json'),'utf8'));
function fixture(failBackup=false){
 const elements=new Map(),writes=[],files={'aegis-costume-library.json':JSON.stringify(library()),'aegis-costume-library.js':'original'};
 const node=()=>({children:[],dataset:{},style:{},classList:{toggle(){},add(){}},append(...n){this.children.push(...n);},appendChild(n){this.children.push(n);},replaceChildren(){this.children=[];},addEventListener(){},set innerHTML(v){this.children=[];}});
 const document={getElementById(id){if(!elements.has(id))elements.set(id,node());return elements.get(id);},createElement:node,querySelectorAll:()=>[]};
 const dir={async getFileHandle(name,opt={}){if(!(name in files)&&!opt.create)throw Object.assign(new Error('missing'),{name:'NotFoundError'});return{async getFile(){return{text:async()=>files[name]};},async createWritable(){if(failBackup&&name.includes('js.backup'))throw new Error('backup denied');let value;return{async write(v){value=v;},async close(){files[name]=value;writes.push(name);},async abort(){}};}};},async *entries(){for(const name of Object.keys(files))yield[name,await this.getFileHandle(name)];}};
 const folder={async getFileHandle(){return{};},async getDirectoryHandle(){return{async getDirectoryHandle(){return dir;}};}};
 const c={document,console,devicePixelRatio:1,requestAnimationFrame(){},THREE:{...THREE,WebGLRenderer:class{constructor(){this.domElement=node();}setPixelRatio(){}setSize(){}render(){}}},showDirectoryPicker:async()=>folder,addEventListener(){},navigator:{},alert(){}};c.window=c;vm.createContext(c);
 vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-costume-articulated.js'),'utf8'),c);
 const html=fs.readFileSync(path.join(root,editor),'utf8');const source=[...html.matchAll(/<script[^>]*>([\s\S]*?)<\/script>/g)].map(m=>m[1]).find(s=>s.includes('const BUILD='));vm.runInContext(source,c);
 return{c,elements,files,writes};
}
test('unified editor boots and shares generated recolors with the game',()=>{
 const f=fixture(),c=runtimeContext();for(const slot of ['top','bottom','head','weapon']){
  vm.runInContext(`currentSlot=${JSON.stringify(slot)}`,f.c);
  assert.equal(JSON.stringify(f.c.effectiveRecolor()),JSON.stringify(c.seasonalDefaultRecolorForSlot(f.c.crow(),slot)));
 }
});
test('unified validation rejects unsafe attachment, recolor, fit and celebration data',()=>{
 const f=fixture();for(const mutate of [
  r=>r.slots.top.attachments=[{type:'hat',anchor:'head',scale:[0,1,1]}],
  r=>r.slots.top.recolor={torso:{color:-1}},
  r=>r.slots.top.fits={standard:{position:[Infinity,0,0]}},
  r=>r.celebration={effect:'oops'},
 ]){const data=library();mutate(data.sets[0]);assert.throws(()=>f.c.validateCostumeLibrary(data));}
});
test('explicit empty attachments suppress legacy defaults while absent lists retain them',()=>{
 const c=runtimeContext();c.AEGIS_COSTUME_LIBRARY=library();c.AEGIS_COSTUME_LIBRARY.sets[0].slots.top.attachments=[];
 const make=()=>{const n=new THREE.Group(),rig=new THREE.Group(),torso=new THREE.Group();rig.userData.joints={torso};rig.add(torso);n.add(rig);n.userData={articulatedSoldier:true,articulatedRoot:rig};return{n,torso};};
 const runtime={THREE};c.tacticalThreePersistentMaterial=(r,key,color)=>new THREE.MeshStandardMaterial({color});const unit={team:'human',hp:20},loadout={top:{setKey:'vampire',slot:'top'}};
 let f=make();c.seasonalThreeAddArticulatedAttachments(runtime,f.n,unit,loadout);assert.equal(f.torso.children.length,0);
 delete c.AEGIS_COSTUME_LIBRARY.sets[0].slots.top.attachments;f=make();c.seasonalThreeAddArticulatedAttachments(runtime,f.n,unit,loadout);assert.equal(f.torso.children.length,1);
});
test('preview preserves attachment accent, opacity and transform',()=>{
 const f=fixture();const attachment={id:'test',type:'hat',anchor:'head',color:0x123456,accent:0xabcdef,opacity:.4,emissive:.2,position:[.1,.2,.3],rotation:[0,0,0],scale:[1,1,1]};
 f.c.slotrow().attachments=[attachment];f.c.rebuildAttachments();const groups=[];vm.runInContext('root',f.c).traverse(o=>{if(o.userData.editorAttachment)groups.push(o);});assert.equal(groups.length,1);
 assert.equal(groups[0].children[0].material.color.getHex(),attachment.accent);assert.equal(groups[0].children[0].material.opacity,.4);
 assert.deepEqual(groups[0].position.toArray(),[.1,.2,.3]);
});
test('repeated preview changes dispose replaced materials',()=>{
 const f=fixture(),meshes=vm.runInContext('Object.values(partMeshes)',f.c),materials=new Set(meshes.map(m=>m.material));let disposed=0;materials.forEach(m=>m.addEventListener('dispose',()=>disposed++));f.c.applyCostumePreview();assert.equal(disposed,materials.size);
});
test('save serializes once, backs up both files, and blocks overlapping save requests',async()=>{
 const f=fixture();await f.elements.get('chooseProject').onclick();const first=f.elements.get('saveCostume').onclick();await f.elements.get('saveCostume').onclick();await first;
 assert.equal(f.writes.length,4);assert.ok(f.writes.slice(0,2).every(n=>n.includes('backup')));assert.equal(f.elements.get('saveCostume').disabled,false);
 const c={window:{}};vm.runInNewContext(f.files['aegis-costume-library.js'],c);assert.equal(c.window.AEGIS_COSTUME_LIBRARY.schema,'aegis-costume-library-v1');
});
test('corrupt load and failed backup cannot overwrite canonical files',async()=>{
 let f=fixture();f.files['aegis-costume-library.json']='{broken';await f.elements.get('chooseProject').onclick();assert.equal(f.elements.get('saveCostume').disabled,true);
 f=fixture(true);await f.elements.get('chooseProject').onclick();await f.elements.get('saveCostume').onclick();assert.equal(f.files['aegis-costume-library.js'],'original');assert.match(f.elements.get('costumeStatus').textContent,/Save failed/);
});
test('new project selection loads defaults instead of another projects unsaved library',async()=>{
 const f=fixture();f.c.crow().label='Other project';delete f.files['aegis-costume-library.json'];delete f.files['aegis-costume-library.js'];await f.elements.get('chooseProject').onclick();assert.notEqual(f.c.crow().label,'Other project');
});
