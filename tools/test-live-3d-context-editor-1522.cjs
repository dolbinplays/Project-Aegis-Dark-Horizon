const fs=require('fs');
const assert=require('assert');
const editor='AEGIS_Prop_Editor_v0.26.09.18.1522_LIVE_3D_CONTEXT_BRIDGE_STARTUP_AND_AUTO_REFERENCE_HOTFIX.html';
const current='AEGIS_Prop_Editor_CURRENT.html';
const s=fs.readFileSync(editor,'utf8');
const c=fs.readFileSync(current,'utf8');
const checks=[
 ['current redirects to 1522',c.includes(editor)],
 ['still embeds authoritative 0835 geometry editor',s.includes('AEGIS_Prop_Editor_v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH.html')],
 ['save format remains 4',s.includes('Save format 4')],
 ['live context root still injected into Three scene',s.includes("contextRoot.name='aegis-live-placement-context-root'")&&s.includes('scene.add(contextRoot)')],
 ['road reference geometry remains in 3D',s.includes('function buildRoad(kind)')&&s.includes("ctx.includes('road')")],
 ['building reference and protected ingress remain in 3D',s.includes('function buildBuilding()')&&s.includes('0xef4444')],
 ['spawn-facing helper remains live',s.includes('PROP FORWARD / SPAWN FACING')&&s.includes('new T.ArrowHelper')],
 ['ground-plane placement drag remains wired',s.includes('aegis-context-placement-drag')&&s.includes('intersectPlane')],
 ['startup watcher runs even if iframe load event was missed',s.includes("startBridgeWatch('startup')")&&s.includes("setInterval(attempt,250)")],
 ['frame load also restarts bridge watch',s.includes("startBridgeWatch('frame-load')")],
 ['inner bridge waits for scene/root/renderer readiness',s.includes('function waitForEditor()')&&s.includes('readyAttempts<240')&&s.includes("typeof scene!=='undefined'")],
 ['opaque file origins use safe postMessage fallback',s.includes("location.origin&&location.origin!=='null'?location.origin:'*'")],
 ['failed bootstraps clear retry guards',s.includes("dataset.aegisContextBridgeBootstrap=''")&&s.includes('__AEGIS_CONTEXT_BRIDGE_BOOTSTRAP_1522=false')],
 ['manual reconnect control is exposed',s.includes('id="retryBridge"')&&s.includes("startBridgeWatch('manual')")],
 ['roadside props auto-select eligible context',s.includes('function preferredContextForRule(rule)')&&s.includes("contexts.includes('t-intersection')")&&s.includes("contexts.includes('four-way-intersection')")],
 ['building-adjacent props auto-select building reference',s.includes("if(mode==='building-adjacent')return'building-adjacent'")],
 ['new roadside mode defaults to straight context when none selected',s.includes('function ensureRoadContextDefault()')&&s.includes('straight-road')],
 ['manual context override remains available',s.includes("$('previewContext').onchange=pushContext")],
 ['parent and embedded prop selections remain synchronized',s.includes('function syncPropToFrame()')&&s.includes('aegis-prop-editor-active')&&s.includes('selectProp(visualKey)')],
 ['placement authority remains parent-level',s.includes("schema:'aegis-prop-placement-v1'")&&s.includes('mergeIntoLiveLibrary')],
];
for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`);assert.ok(pass,name)}
console.log(`PASS 1522 live 3D bridge startup + auto-reference hotfix: ${checks.length} contracts`);
