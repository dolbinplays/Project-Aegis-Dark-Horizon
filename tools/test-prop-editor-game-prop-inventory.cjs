const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1740_GAME_PROP_INVENTORY_AND_MIGRATION_VISIBILITY_PATCH.html'),'utf8');
const current=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');
const runtimePath=path.join(root,'src','browser-runtime.html');
const runtime=fs.existsSync(runtimePath)?fs.readFileSync(runtimePath,'utf8'):null;

test('1740 build identity and stable launcher are current',()=>{
  assert.match(editor,/v0\.26\.09\.17\.1740_GAME_PROP_INVENTORY_AND_MIGRATION_VISIBILITY_PATCH/);
  assert.match(editor,/Game Inventory 1740/);
  assert.match(current,/1740_GAME_PROP_INVENTORY_AND_MIGRATION_VISIBILITY_PATCH/);
});

test('inventory UI exposes source, counts, filters and runtime refresh paths',()=>{
  for(const id of ['inventorySourceText','inventoryStats','inventoryFilter','inventoryStatus','inventoryList','scanRuntimeBtn','importRuntimeBtn','runtimeFileInput']) assert.match(editor,new RegExp(`id="${id}"`));
  assert.match(editor,/function runtimeInventoryFromSource\(/);
  assert.match(editor,/function gamePropInventoryRows\(/);
  assert.match(editor,/function refreshInventory\(/);
  assert.match(editor,/function scanCurrentRuntime\(/);
  assert.match(editor,/fetch\('src\/browser-runtime\.html'/);
});

test('embedded current-main inventory exposes representative legacy and special visuals',()=>{
  for(const token of ['traffic-light','civic-statue','playground','water-fountain','interior-power-panel','vehicle-','building-wall','building-window','building-door','alien-field-beacon','skyranger','crashed-ufo-']) assert.ok(editor.includes(token),token);
  assert.match(editor,/RUNTIME_INVENTORY_SNAPSHOT_COMMIT='4d223a5957'/);
  assert.match(editor,/RUNTIME_INVENTORY_SNAPSHOT_BLOB='0b908738c25a1ef2dbcb1c479c9e8d52a320bfe3'/);
});

test('shared runtime authority and recent interaction fixes remain intact',()=>{
  assert.match(editor,/src="assets\/data\/aegis-prop-library\.js"/);
  assert.match(editor,/id="exportRuntimeLibraryBtn"/);
  assert.match(editor,/function runtimeLibraryScript\(/);
  assert.doesNotMatch(editor,/CapsuleGeometry/);
  assert.match(editor,/new THREE\.CylinderGeometry\(\.15,\.18,\.62,10\)/);
  assert.match(editor,/function applySelectedComponentTransform\(/);
  assert.match(editor,/orbit\.yaw-=dx\*\.009/);
  assert.match(editor,/range\.addEventListener\('pointerdown',begin\)/);
});

test('current runtime remains Browser 1320/save format four when repository runtime is present',{skip:!runtime},()=>{
  assert.match(runtime,/const CURRENT_GAME_BUILD="v0\.26\.09\.17\.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH"/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(runtime,/TACTICAL_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH=true/);
  for(const token of ['traffic-light','civic-statue','water-fountain','playground','interior-power-panel']) assert.ok(runtime.includes(token),token);
});
