const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const root=path.join(__dirname,'..');
const current=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_CURRENT.html'),'utf8');
const editorPath=path.join(root,'AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html');
const editor=fs.readFileSync(editorPath,'utf8');
const roadmap=fs.readFileSync(path.join(root,'Project_Aegis_Alien_Response_Command_Updated_Roadmap_and_Game_Bible.md'),'utf8');
const handoff=fs.readFileSync(path.join(root,'CODEX_HANDOFF.md'),'utf8');
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const runtime=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');

function inlineScripts(html){return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/g)].map(m=>m[1]).filter(Boolean);}

test('stable launcher points to the versioned Prop Editor foundation',()=>{
  assert.match(current,/AEGIS_Prop_Editor_v0\.26\.09\.17\.1155_PROP_EDITOR_FOUNDATION_TOOL\.html/);
  assert.match(editor,/PROP_EDITOR_BUILD='v0\.26\.09\.17\.1155_PROP_EDITOR_FOUNDATION_TOOL'/);
});

test('foundation exports explicit prop and library schemas and provides real built-in templates',()=>{
  assert.match(editor,/aegis-prop-definition-v1/);
  assert.match(editor,/aegis-prop-library-v1/);
  for(const visual of ['tree','lamp-post','stop-sign','vending-machine','newspaper-machine','bus-stop','street-bench','crates','concrete','fence','rock','bush']) assert.ok(editor.includes(`'${visual}'`),visual);
});

test('component authoring includes primitive dimensions transforms materials add duplicate delete and direct preview picking',()=>{
  for(const primitive of ['box','cylinder','sphere','cone','torus'])assert.ok(editor.includes(`value="${primitive}"`),primitive);
  for(const marker of ['positionControls','rotationControls','scaleControls','geometryFields','componentColor','roughness','metalness','opacity','emissiveStrength','addComponentBtn','duplicateComponentBtn','deleteComponentBtn','raycaster.intersectObjects'])assert.ok(editor.includes(marker),marker);
});

test('prop metadata represents current movement cover LOS and hex-edge placement concerns',()=>{
  for(const marker of ['navigationClass','coverKind','coverBlock','maxHp','losClass','edgePlacement','edgeFraction','curbLike','naturalProp','collisionShape'])assert.ok(editor.includes(marker),marker);
  assert.match(editor,/Solid \/ route around/);
  assert.match(editor,/Hex edge/);
});

test('editor workflow provides undo redo draft persistence import export validation and keyboard nudge',()=>{
  for(const marker of ['undoBtn','redoBtn','localStorage.setItem','localStorage.getItem','exportPropBtn','exportLibraryBtn','fileInput','validateProp','ArrowLeft','PageUp'])assert.ok(editor.includes(marker),marker);
});

test('inline editor JavaScript compiles without executing browser or Three.js dependencies',()=>{
  const scripts=inlineScripts(editor);
  assert.ok(scripts.length>=1);
  for(const source of scripts)new vm.Script(source);
});

test('roadmap carries both editors and explicitly shares the prop schema into the future building editor',()=>{
  assert.match(roadmap,/Developer Authoring Tools Roadmap — Prop Editor \+ Building Layout Editor/);
  assert.match(roadmap,/Prop Editor — Foundation Tool 1155/);
  assert.match(roadmap,/Building Layout Editor — Planned/);
  assert.match(roadmap,/same prop-definition library|same prop schema\/library/);
  assert.match(handoff,/Prop Editor phase 2/);
  assert.match(handoff,/Building Layout Editor/);
});

test('authoring-tool addition leaves Browser 1145 runtime save authority and installed-PWA launch interception unchanged',()=>{
  assert.match(roadmap,/Current browser build: `v0\.26\.09\.17\.1145_HEX_EDGE_PROP_PLACEMENT_AND_SOLID_PROP_NAVIGATION_PATCH`/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
  assert.match(sw,/Editors and QA pages must never become the installed game's launch page/);
  assert.doesNotMatch(sw,/AEGIS_Prop_Editor/);
});
