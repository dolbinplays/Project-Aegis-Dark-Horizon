const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const editorPath=path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1705_SHARED_PROP_LIBRARY_EDITOR_RUNTIME_AUTHORITY_PATCH.html');
const editor=fs.readFileSync(editorPath,'utf8');
const current=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');
const libraryPath=path.join(root,'assets','data','aegis-prop-library.js');
const runtimePath=path.join(root,'src','browser-runtime.html');
const library=fs.existsSync(libraryPath)?fs.readFileSync(libraryPath,'utf8'):null;
const runtime=fs.existsSync(runtimePath)?fs.readFileSync(runtimePath,'utf8'):null;

test('1705 editor identity and current launcher are synchronized',()=>{
  assert.match(editor,/v0\.26\.09\.17\.1705_SHARED_PROP_LIBRARY_EDITOR_RUNTIME_AUTHORITY_PATCH/);
  assert.match(editor,/Shared Runtime 1705/);
  assert.match(current,/AEGIS_Prop_Editor_v0\.26\.09\.17\.1705_SHARED_PROP_LIBRARY_EDITOR_RUNTIME_AUTHORITY_PATCH\.html/);
});

test('editor loads the exact canonical game library before application code',()=>{
  const vendor=editor.indexOf('src="assets/vendor/three.min.js"');
  const propLibrary=editor.indexOf('src="assets/data/aegis-prop-library.js"');
  const app=editor.indexOf("const PROP_EDITOR_BUILD='");
  assert.ok(vendor>=0&&propLibrary>vendor&&app>propLibrary);
  if(library)assert.match(library,/window\.AEGIS_PROP_LIBRARY=/);
  assert.match(editor,/const GAME_LIBRARY_PAYLOAD=\(window\.AEGIS_PROP_LIBRARY\?\.schema===LIBRARY_SCHEMA/);
  assert.match(editor,/library:\(GAME_LIBRARY\|\|DEFAULT_PROPS\)\.map\(deepClone\)/);
});

test('1650 startup compatibility and 1620 live interaction fixes remain present',()=>{
  assert.doesNotMatch(editor,/CapsuleGeometry/);
  assert.match(editor,/new THREE\.CylinderGeometry\(\.15,\.18,\.62,10\)/);
  assert.match(editor,/function applySelectedComponentTransform\(/);
  assert.match(editor,/orbit\.yaw-=dx\*\.009/);
  assert.match(editor,/orbit\.pitch=clamp\(orbit\.pitch-dy\*\.008/);
  assert.match(editor,/range\.addEventListener\('pointerdown',begin\)/);
  assert.match(editor,/let interactionActive=false/);
});

test('editor exposes canonical source and explicit reload authority',()=>{
  assert.match(editor,/id="librarySourceText"/);
  assert.match(editor,/id="reloadGameLibraryBtn"/);
  assert.match(editor,/state\.librarySource='canonical'/);
  assert.match(editor,/Working copy of canonical game library/);
});

test('JSON and runtime JS exports are generated from one library payload',()=>{
  assert.match(editor,/function libraryPayload\(\).*libraryVersion:PROP_EDITOR_BUILD.*sourceEditorBuild:PROP_EDITOR_BUILD.*props:state\.library\.map\(exportableProp\)/s);
  assert.match(editor,/id="exportRuntimeLibraryBtn"/);
  assert.match(editor,/function runtimeLibraryScript\(\)/);
  assert.match(editor,/window\.AEGIS_PROP_LIBRARY=\$\{JSON\.stringify\(libraryPayload\(\),null,2\)\}/);
  assert.match(editor,/downloadJson\('aegis-prop-library\.json',libraryPayload\(\)\)/);
  assert.match(editor,/downloadText\('aegis-prop-library\.js',runtimeLibraryScript\(\),'text\/javascript'\)/);
});

test('Browser 1320 remains runtime consumer and save format remains four',{skip:!runtime},()=>{
  assert.match(runtime,/const CURRENT_GAME_BUILD="v0\.26\.09\.17\.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH"/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(runtime,/TACTICAL_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH=true/);
  assert.ok((runtime.match(/tacticalThreeAddRuntimePropDefinitionModel\(\{THREE,group,cover:c,visual,materialFor:mat,qualitySettings\}\)/g)||[]).length>=2);
});
