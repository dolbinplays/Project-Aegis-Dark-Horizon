const fs=require('fs');
const path=require('path');
const root=path.resolve(__dirname,'..');
const file=path.join(root,'AEGIS_Prop_Editor_v0.26.09.18.1645_UNIFIED_PROP_LIBRARY_PLACEMENT_AND_MODEL_AUTHORING_PATCH.html');
const s=fs.readFileSync(file,'utf8');
const checks={
  '1645 build marker':s.includes('v0.26.09.18.1645_UNIFIED_PROP_LIBRARY_PLACEMENT_AND_MODEL_AUTHORING_PATCH'),
  'save format remains 4':s.includes('Save format 4')&&s.includes('SAVE_FORMAT=4'),
  'single authoritative prop selector':(s.match(/id="prop"/g)||[]).length===1,
  'merged section title':s.includes('Prop Library & Placement'),
  'placement/model tabs exist':s.includes('id="placementTab"')&&s.includes('id="modelTab"'),
  'no iframe normal-editor dependency':!s.includes('<iframe'),
  'native three viewport':s.includes('id="mount"')&&s.includes('function initThree()'),
  'single prop selection loads both editors':s.includes('function loadSelectedProp()')&&s.includes('loadPlacementForm({autoContext:true})')&&s.includes('refreshModelUI()'),
  'whole prop position rotation scale':s.includes('id="rootPosition"')&&s.includes('id="rootRotation"')&&s.includes('id="rootScale"'),
  'component list + selected component editor':s.includes('id="componentList"')&&s.includes('id="componentEditor"'),
  'component add duplicate delete':s.includes('id="addComp"')&&s.includes('id="dupComp"')&&s.includes('id="delComp"'),
  'viewport component picking':s.includes('function pickComponent(e)')&&s.includes('meshById'),
  'intact/damage/variant target support':s.includes('function refreshModelTarget()')&&s.includes("modelTarget.startsWith('variant:')"),
  'road context renderer':s.includes('function buildRoad(kind)')&&s.includes("kind==='t-intersection'")&&s.includes("kind==='four-way-intersection'"),
  'building + protected ingress renderer':s.includes('function buildBuilding()')&&s.includes('0xef4444'),
  'spawn facing arrow':s.includes('PROP FORWARD / SPAWN FACING')&&s.includes('ArrowHelper'),
  'placement direct drag':s.includes('function placeFromPointer(e)')&&s.includes('placementDragActive'),
  'automatic road/building reference':s.includes('function preferredContextForRule(rule)')&&s.includes("return'building-adjacent'")&&s.includes("return'straight-road'")&&s.includes("return't-intersection'")&&s.includes("return'four-way-intersection'"),
  'placement strictness retained':s.includes('id="strict"')&&s.includes("strictness:$('strict').value"),
  'placement override key unchanged':s.includes("PLACEMENT_KEY='aegis-prop-placement-overrides-v1'"),
  'placement project sidecar retained':s.includes('function writePlacementSidecar()')&&s.includes('aegis-prop-placement-overrides.json'),
  'model local live publishing':s.includes('function publishModel(')&&s.includes("localStorage.setItem(LIVE_KEY"),
  'model revision snapshots retained':s.includes("HISTORY_KEY='aegis-prop-revision-history-v1'")&&s.includes('function addRevision('),
  'model undo redo':s.includes('function undoModel()')&&s.includes('function redoModel()'),
  'advanced recovery remains available':s.includes('id="openAdvanced"')&&s.includes('0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH.html'),
  'runtime gallery link retained':s.includes('id="openGallery"')&&s.includes('AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html'),
  'no schema/save format bump':!s.includes('SAVE_FORMAT=5')&&!s.includes('save format 5'),
};
let failed=0;
for(const [name,pass] of Object.entries(checks)){console.log(`${pass?'PASS':'FAIL'}: ${name}`);if(!pass)failed++;}
console.log(`\n${Object.keys(checks).length-failed}/${Object.keys(checks).length} checks passed`);
process.exitCode=failed?1:0;
