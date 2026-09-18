const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH.html'),'utf8');
const current=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');
const library=JSON.parse(fs.readFileSync(path.join(root,'assets','data','aegis-prop-library.json'),'utf8'));
const byKey=new Map(library.props.map(p=>[p.visualKey,p]));
const runtimePath=path.join(root,'src','browser-runtime.html');
const runtime=fs.existsSync(runtimePath)?fs.readFileSync(runtimePath,'utf8'):null;

test('1945 build and canonical library identity are synchronized',()=>{
  assert.match(editor,/v0\.26\.09\.17\.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH/);
  assert.match(editor,/Legacy Fidelity 1945/);
  assert.match(current,/1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH/);
  assert.equal(library.libraryVersion,'v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH');
  assert.equal(library.sourceEditorBuild,library.libraryVersion);
  assert.equal(library.props.length,15);
});

test('common shared props now reproduce legacy renderer geometry',()=>{
  const tree=byKey.get('tree');
  assert.equal(tree.components[0].primitive,'cylinder');
  assert.deepEqual(tree.components[0].size,{radiusTop:.08,radiusBottom:.12,height:.58,segments:7});
  assert.equal(tree.components[1].primitive,'cone');
  assert.deepEqual(tree.components[1].size,{radius:.42,height:.92,segments:8});
  assert.deepEqual(tree.components[1].position,[0,.98,0]);
  const lamp=byKey.get('lamp-post'); assert.equal(lamp.components.length,2); assert.deepEqual(lamp.components[0].size,{radiusTop:.05,radiusBottom:.07,height:2.1,segments:8});
  const concrete=byKey.get('concrete'); assert.equal(concrete.components.length,1); assert.deepEqual(concrete.components[0].size,{width:.92,height:.62,depth:.54});
  const crates=byKey.get('crates'); assert.equal(crates.components.length,1); assert.deepEqual(crates.components[0].size,{width:.64,height:.45,depth:.64});
  const fence=byKey.get('fence'); assert.deepEqual(fence.components[0].scale,[1,.45,.28]);
});

test('legacy-only common scenery is promoted into editable shared definitions',()=>{
  for(const key of ['traffic-light','playground','hay']){
    assert.ok(byKey.has(key),key);
    assert.equal(byKey.get(key).migration.status,'game-derived');
    assert.equal(byKey.get(key).migration.fidelity,'exact-static');
  }
  const traffic=byKey.get('traffic-light'); assert.equal(traffic.components.length,5); assert.deepEqual(traffic.components.slice(2).map(c=>c.material.emissiveStrength),[.55,.55,.55]);
});

test('migration provenance and known limitations are visible in editor data',()=>{
  assert.match(editor,/id="migrationInfo"/);
  assert.match(editor,/Game-derived exact model/);
  assert.equal(byKey.get('tree').migration.fidelity,'baseline-regional');
  assert.equal(byKey.get('bush').migration.fidelity,'baseline-regional');
  assert.equal(byKey.get('rock').migration.status,'pending-primitive');
  assert.match(byKey.get('rock').migration.limitations,/DodecahedronGeometry/);
});

test('recent editor interaction/runtime-authority fixes remain intact',()=>{
  assert.match(editor,/src="assets\/data\/aegis-prop-library\.js"/);
  assert.match(editor,/id="exportRuntimeLibraryBtn"/);
  assert.doesNotMatch(editor,/CapsuleGeometry/);
  assert.match(editor,/function applySelectedComponentTransform\(/);
  assert.match(editor,/orbit\.yaw-=dx\*\.009/);
  assert.match(editor,/range\.addEventListener\('pointerdown',begin\)/);
});

test('Browser 1320 already consumes the updated library without save-format change',{skip:!runtime},()=>{
  assert.match(runtime,/const CURRENT_GAME_BUILD="v0\.26\.09\.17\.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH"/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(runtime,/TACTICAL_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH=true/);
  assert.ok((runtime.match(/tacticalThreeAddRuntimePropDefinitionModel\(\{THREE,group,cover:c,visual,materialFor:mat,qualitySettings\}\)/g)||[]).length>=2);
  for(const key of ['traffic-light','playground','hay']) assert.ok(runtime.includes(key),key);
});
