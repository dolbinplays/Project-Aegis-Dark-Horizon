const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');
const libraryScript=fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.js'),'utf8');
const libraryJson=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.json'),'utf8'));
const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1320_RUNTIME_LIBRARY_INTEGRATION_TOOL.html'),'utf8');
const worker=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
function between(start,end){const a=runtime.indexOf(start),b=runtime.indexOf(end,a+start.length);assert.ok(a>=0,`missing ${start}`);assert.ok(b>a,`missing ${end}`);return runtime.slice(a,b);}
const ctx={console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON,globalThis:null,window:{}};ctx.globalThis=ctx;ctx.clamp=(n,min,max)=>Math.max(min,Math.min(max,Number(n)||0));ctx.tacticalCoverIsBuildingDoor=()=>false;ctx.tacticalDoorIsLocked=()=>false;ctx.tacticalDoorTraversableForPath=()=>false;ctx.tacticalCoverFootprintCells=()=>[{x:1,y:1}];ctx.tacticalPropIsSpecialStructure=()=>false;
vm.createContext(ctx);vm.runInContext(libraryScript,ctx);
vm.runInContext(between('const TACTICAL_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH=true;','function tacticalPropIsSpecialStructure'),ctx);

test('runtime integration marker, build identity and save format are correct',()=>{
  assert.match(runtime,/TACTICAL_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH=true/);
  assert.match(runtime,/const CURRENT_GAME_BUILD="v0\.26\.09\.17\.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH"/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('shared canonical library has the editor schema and representative common props',()=>{
  assert.equal(libraryJson.schema,'aegis-prop-library-v1');
  assert.ok(Array.isArray(libraryJson.props)&&libraryJson.props.length>=12);
  const keys=new Set(libraryJson.props.map(p=>p.visualKey));
  for(const key of ['tree','lamp-post','stop-sign','vending-machine','newspaper-machine','bus-stop','street-bench','crates','concrete','fence','rock','bush'])assert.ok(keys.has(key),key);
  assert.ok(libraryJson.props.every(p=>p.schema==='aegis-prop-definition-v1'&&Array.isArray(p.components)&&p.components.length));
});

test('browser runtime loads the shared library before app code and service worker precaches it',()=>{
  assert.match(runtime,/data-aegis-prop-library="runtime" src="\.\/assets\/data\/aegis-prop-library\.js"/);
  assert.match(worker,/\.\/assets\/data\/aegis-prop-library\.js/);
});

test('runtime resolves definitions and consumes editor navigation and edge metadata',()=>{
  const tree=ctx.tacticalRuntimePropDefinitionForVisual('tree'),bush=ctx.tacticalRuntimePropDefinitionForVisual({visual:'bush'}),lamp=ctx.tacticalRuntimePropDefinitionForVisual('lamp-post');
  assert.equal(tree?.metadata?.navigationClass,'solid');
  assert.equal(bush?.metadata?.navigationClass,'passable');
  assert.equal(lamp?.metadata?.edgeFraction,.42);
  assert.equal(ctx.tacticalRuntimePropLibrary()?.props?.length,libraryJson.props.length);
  assert.match(runtime,/tacticalRuntimePropMetadata\(visual\)\?\.navigationClass/);
  assert.match(runtime,/tacticalRuntimePropMetadata\(visual\)\?\.edgeFraction/);
});

test('both Three.js cover render paths prefer shared prop definition models and keep legacy fallback',()=>{
  assert.equal((runtime.match(/tacticalThreeAddRuntimePropDefinitionModel\(\{THREE,group,cover:c,visual,materialFor:mat,qualitySettings\}\)/g)||[]).length,2);
  assert.match(runtime,/else if\(visual\.includes\("tree"\)\)/);
  assert.match(runtime,/function tacticalRuntimePropComponentGeometry/);
  for(const primitive of ['cylinder','sphere','cone','torus'])assert.ok(runtime.includes(`primitive==="${primitive}"`));
});

test('shared renderer can instantiate an editor-authored definition without game-specific model code',()=>{
  class Geometry{constructor(...args){this.args=args;}}
  class Mesh{constructor(geometry,material){this.geometry=geometry;this.material=material;this.position={set:(...v)=>this.pos=v};this.rotation={set:(...v)=>this.rot=v};this.scale={set:(...v)=>this.scl=v};this.userData={};}}
  const THREE={Mesh,BoxGeometry:Geometry,CylinderGeometry:Geometry,SphereGeometry:Geometry,ConeGeometry:Geometry,TorusGeometry:Geometry};
  const group={children:[],userData:{},add(item){this.children.push(item);}};
  const ok=ctx.tacticalThreeAddRuntimePropDefinitionModel({THREE,group,visual:'vending-machine',materialFor:(key,color,opts)=>({key,color,opts}),qualitySettings:{shadows:true}});
  assert.equal(ok,true);assert.ok(group.children.length>=4);assert.equal(group.userData.aegisPropLibraryVisual,'vending-machine');
});

test('live cover annotation records prop-library provenance without changing save format',()=>{
  assert.match(runtime,/propDefinitionKey:definition\.visualKey/);
  assert.match(runtime,/propDefinitionSchema:AEGIS_PROP_DEFINITION_SCHEMA/);
  assert.match(runtime,/propLosClass:String\(metadata\?\.losClass\|\|"existing-cover"\)/);
});

test('Prop Editor loads the canonical game library and exports a drop-in runtime library JS file',()=>{
  assert.match(editor,/src="assets\/data\/aegis-prop-library\.js"/);
  assert.match(editor,/const GAME_LIBRARY=\(window\.AEGIS_PROP_LIBRARY/);
  assert.match(editor,/id="exportRuntimeLibraryBtn"/);
  assert.match(editor,/aegis-prop-library\.js/);
  assert.match(editor,/window\.AEGIS_PROP_LIBRARY=\$\{JSON\.stringify\(payload,null,2\)\}/);
  assert.match(editor,/replace assets\/data\/aegis-prop-library\.js/);
});
