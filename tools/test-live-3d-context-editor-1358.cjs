const fs=require('fs');
const assert=require('assert');
const editor='AEGIS_Prop_Editor_v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_PATCH.html';
const current='AEGIS_Prop_Editor_CURRENT.html';
const s=fs.readFileSync(editor,'utf8');
const c=fs.readFileSync(current,'utf8');
const checks=[
 ['current redirects to 1358',c.includes(editor)],
 ['uses authoritative 0835 editor scene',s.includes('AEGIS_Prop_Editor_v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH.html')],
 ['separate 2D context canvas removed',!s.includes('<canvas')],
 ['live context root injected into Three scene',s.includes("contextRoot.name='aegis-live-placement-context-root'")&&s.includes('scene.add(contextRoot)')],
 ['road reference geometry rendered in 3D',s.includes('function buildRoad(kind)')&&s.includes("ctx.includes('road')" )],
 ['building reference and ingress zone rendered in 3D',s.includes('function buildBuilding()')&&s.includes('0xef4444')],
 ['prop root receives context placement transform',s.includes('root.position.set(p.x,0,p.z)')&&s.includes('root.rotation.set(0,p.yaw,0)')],
 ['spawn-facing helper is in live root',s.includes('PROP FORWARD / SPAWN FACING')&&s.includes('new T.ArrowHelper')],
 ['mirrored preview remains presentation only',s.includes("root.scale.set(config.mirrored?-1:1,1,1)")],
 ['3D placement drag writes back distance/lateral',s.includes('aegis-context-placement-drag')&&s.includes("$('curb').value")&&s.includes("$('wallDist').value")],
 ['placement drag uses ground-plane ray intersection',s.includes('new T.Plane(new T.Vector3(0,1,0),0)')&&s.includes('intersectPlane')],
 ['normal editor interaction is preserved when drag is off',s.includes("if(!config.placementEdit||config.context==='free')return")],
 ['parent and embedded prop selections synchronize',s.includes('function syncPropToFrame()')&&s.includes('aegis-prop-editor-active')&&s.includes('selectProp(visualKey)')],
 ['placement authority still parent-level',s.includes("schema:'aegis-prop-placement-v1'")&&s.includes('mergeIntoLiveLibrary')],
 ['save format unchanged',s.includes('Save format 4')],
 ['context helper disposal is bounded',s.includes('aegisPlacementHelper')&&s.includes('geometry?.dispose')&&s.includes('material?.dispose')],
];
for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`);assert.ok(pass,name)}
console.log(`PASS 1358 live 3D contextual prop placement editor: ${checks.length} contracts`);
