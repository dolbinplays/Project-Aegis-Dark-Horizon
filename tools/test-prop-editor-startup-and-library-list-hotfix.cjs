const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');
const versioned=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1340_PROP_EDITOR_STARTUP_AND_LIBRARY_LIST_HOTFIX.html'),'utf8');
const lib=fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.js'),'utf8');

test('CURRENT and versioned hotfix editor are identical',()=>assert.equal(editor,versioned));
test('hotfix build badge and identity are current',()=>{
  assert.match(editor,/Runtime Integration 1340 Hotfix/);
  assert.match(editor,/v0\.26\.09\.17\.1340_PROP_EDITOR_STARTUP_AND_LIBRARY_LIST_HOTFIX/);
  assert.doesNotMatch(editor,/Foundation Tool 1155/);
});
test('editor no longer calls unsupported THREE.CapsuleGeometry',()=>{
  assert.doesNotMatch(editor,/CapsuleGeometry/);
  assert.match(editor,/new THREE\.CylinderGeometry\(\.15,\.18,\.62,10\)/);
});
test('editor still loads canonical runtime library before application code',()=>{
  assert.match(editor,/src="assets\/vendor\/three\.min\.js"/);
  assert.match(editor,/src="assets\/data\/aegis-prop-library\.js"/);
  assert.match(lib,/window\.AEGIS_PROP_LIBRARY=/);
});
test('working library initializes from canonical game library with fallback templates',()=>{
  assert.match(editor,/const GAME_LIBRARY=\(window\.AEGIS_PROP_LIBRARY\?\.schema===LIBRARY_SCHEMA/);
  assert.match(editor,/library:\(GAME_LIBRARY\|\|DEFAULT_PROPS\)\.map\(deepClone\)/);
  assert.match(editor,/function refreshPropList\(/);
  assert.match(editor,/refreshAll\(\);setStatus\('Runtime-integrated Prop Editor ready'\)/);
});
