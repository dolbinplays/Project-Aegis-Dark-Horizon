const fs=require('fs');
const path='/mnt/data/aegis_file_safe_context_hotfix_1600/AEGIS_Prop_Editor_v0.26.09.18.1600_FILE_SAFE_NATIVE_3D_CONTEXT_FALLBACK_HOTFIX.html';
const s=fs.readFileSync(path,'utf8');
const checks={
  '1600 build marker':s.includes('v0.26.09.18.1600_FILE_SAFE_NATIVE_3D_CONTEXT_FALLBACK_HOTFIX'),
  'save format remains 4':s.includes('Save format 4'),
  'parent loads Three.js':s.includes('<script src="./assets/vendor/three.min.js"></script>'),
  'native fallback viewport exists':s.includes('id="nativeFallback"')&&s.includes('id="nativeMount"'),
  'native prop renderer exists':s.includes('function nativeBuildProp()'),
  'straight/T/four-way renderer exists':s.includes('function nativeBuildRoad(kind)')&&s.includes("kind==='t-intersection'")&&s.includes("kind==='four-way-intersection'"),
  'building renderer + protected ingress exists':s.includes('function nativeBuildBuilding()')&&s.includes('0xef4444'),
  'spawn facing arrow exists':s.includes('PROP FORWARD / SPAWN FACING')&&s.includes('ArrowHelper'),
  'placement drag exists':s.includes('function nativePlaceFromPointer')&&s.includes("$('placementDrag')"),
  'file URL immediately enables fallback':s.includes("location.protocol==='file:'")&&s.includes("setNativeFallbackVisible(true,'File-safe native 3D context active')"),
  'non-file timeout fallback exists':s.includes('elapsed>2500')&&s.includes("setNativeFallbackVisible(true,'Native 3D context fallback active')"),
  'road/building automatic reference exists':s.includes('function preferredContextForRule(rule)')&&s.includes("return'building-adjacent'")&&s.includes("return'straight-road'")&&s.includes("return't-intersection'")&&s.includes("return'four-way-intersection'"),
  'manual reference remains possible':s.includes("$('previewContext').onchange=pushContext"),
  'placement override key unchanged':s.includes("KEY='aegis-prop-placement-overrides-v1'"),
  '0835 geometry editor remains embedded':s.includes('AEGIS_Prop_Editor_v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH.html'),
  'retry control retained':s.includes('id="retryBridge"')&&s.includes('startBridgeWatch(\'manual\')'),
  'direct live placement save remains':s.includes('function save()')&&s.includes('localStorage.setItem(KEY,JSON.stringify(map))'),
  'damage/variant editor remains delegated':s.includes('0835 geometry editor still owns geometry, collision, damage states, variants, lighting anchors'),
};
let failed=0;
for(const [name,pass] of Object.entries(checks)){console.log(`${pass?'PASS':'FAIL'}: ${name}`);if(!pass)failed++;}
console.log(`\n${Object.keys(checks).length-failed}/${Object.keys(checks).length} checks passed`);
process.exitCode=failed?1:0;
