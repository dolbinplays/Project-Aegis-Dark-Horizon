'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert'),vm=require('vm');
const root=path.resolve(__dirname,'..');
const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH.html'),'utf8');
const gallery=fs.readFileSync(path.join(root,'AEGIS_Prop_Runtime_Test_Gallery_v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH.html'),'utf8');
const runtimePath=path.join(root,'assets/runtime/aegis-contextual-prop-placement-runtime.js');
const runtime=fs.readFileSync(runtimePath,'utf8');
const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
const meta=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));
let pass=0;function check(cond,msg){assert.ok(cond,msg);pass++;}

check((editor.match(/id="prop"/g)||[]).length===1,'editor must have exactly one prop selector');
check(editor.includes('Apply to Game')&&editor.includes('Apply Prop to Game'),'unified Apply to Game controls missing');
check(editor.includes("p.placement=clone(rule)")&&editor.includes("placementAuthority='canonical-prop-definition'"),'editor does not embed canonical placement on prop');
check(editor.includes('function modelPayload')&&editor.includes("if(!p.placement)p.placement=normalizePlacement(shipped(p.visualKey))"),'payload does not materialize placement for all props');
check(editor.includes('function writeUnifiedLibraryToProject')&&editor.includes('aegis-prop-last-known-good.json')&&editor.includes('aegis-prop-last-known-good.js'),'project write / last-known-good preservation missing');
check(editor.includes('Runtime Test Gallery')&&editor.includes('openGalleryTop'),'prominent runtime gallery control missing');
check(editor.includes('MATCH — game/gallery live')&&editor.includes('MATCH — canonical files'),'pipeline status indicators missing');
check(editor.includes('Legacy placement sidecars remain compatibility fallbacks only'),'legacy fallback messaging missing');
check(editor.includes('SAVE_FORMAT=4'),'editor save format changed');

check(gallery.includes('Generate valid-context test scene')&&gallery.includes('Generate Test Scene'),'gallery test-scene controls missing');
check(gallery.includes('function eligibleContexts')&&gallery.includes('allowMirroring'),'gallery context matrix logic missing');
check(gallery.includes("p?.placement||legacy[p?.visualKey]")&&gallery.includes("canonical?'canonical prop definition':'legacy fallback'"),'gallery canonical-first placement resolution missing');
check(gallery.includes('Damaged')&&gallery.includes('Destroyed')&&gallery.includes('Variant —'),'gallery presentation state support missing');
check(gallery.includes('vehicle lighting anchors / beam')||gallery.includes('vehicle lighting anchors'),'gallery vehicle-lighting validation missing');

check(runtime.includes("const BUILD='v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH'"),'runtime extension build not updated');
check(runtime.includes('function placementResolutionForVisual'),'runtime resolution source function missing');
check(runtime.indexOf('if(definition?.placement)') < runtime.indexOf('if(overrides[name])'),'runtime must prefer canonical prop placement over legacy local override');
check(runtime.includes("source:'canonical-prop-definition'")&&runtime.includes("legacy-placement-catalog"),'runtime placement source labels missing');
check(runtime.includes('propPlacementRuleSource=resolution.source')&&runtime.includes("propPlacementCanonical=resolution.source==='canonical-prop-definition'"),'runtime resolved props do not expose placement authority');
check(runtime.includes('AEGIS_UNIFIED_PROP_RUNTIME_PIPELINE_PATCH=true'),'runtime pipeline feature flag missing');
check(runtime.includes('const SAVE_FORMAT=4'),'runtime save format changed');

check(sw.includes('aegis-v0.26.09.18.2115_IN_GAME_TOOLS_EDITOR_RENDERED_RUNTIME_HOTFIX'),'service worker cache was not bumped');
check(sw.includes('./assets/runtime/aegis-contextual-prop-placement-runtime.js'),'service worker no longer refreshes runtime extension');
check(meta.build==='v0.26.09.18.2115_IN_GAME_TOOLS_EDITOR_RENDERED_RUNTIME_HOTFIX','release metadata build mismatch');
check(meta.save_format===4,'release metadata save format changed');
check(meta.runtime_extension_build==='v0.26.09.18.2051_IN_GAME_TOOLS_AND_PROP_EDITOR_ACCESS_PATCH','release metadata runtime extension mismatch');
check(meta.prop_authoring_pipeline==='canonical-prop-definition','release metadata pipeline authority missing');
check(meta.tools_editor_launcher_build===meta.build,'release metadata launcher build mismatch');

// Runtime behavior: canonical definition must beat stale legacy override.
const sandbox={console,setTimeout,clearTimeout,setInterval,clearInterval,CustomEvent:function(){},module:{exports:{}},exports:{}};
sandbox.globalThis=sandbox;
sandbox.localStorage={getItem(k){if(k==='aegis-prop-placement-overrides-v1')return JSON.stringify({'bus-stop':{mode:'building-adjacent',strictness:'required',buildingAdjacent:{wallDistance:.9}}});return null;},setItem(){}};
sandbox.AEGIS_PROP_LIBRARY={props:[{visualKey:'bus-stop',placement:{schema:'aegis-prop-placement-v1',mode:'roadside',strictness:'preferred',roadside:{contexts:['straight-road'],preferredCurbDistance:.35,lateralOffset:0,rotationDeg:0,facing:'toward-road',roadSide:'either',allowMirroring:true,allowRoadSurface:false}}}]};
sandbox.AEGIS_PROP_PLACEMENT_RULES={rules:{'bus-stop':{mode:'free',strictness:'preferred'}},defaultPlacement:{mode:'free',strictness:'preferred'}};
sandbox.tacticalRuntimePropDefinitionForVisual=v=>sandbox.AEGIS_PROP_LIBRARY.props.find(p=>p.visualKey===v)||null;
vm.createContext(sandbox);vm.runInContext(runtime,sandbox,{filename:'aegis-contextual-prop-placement-runtime.js'});
const api=sandbox.module.exports;
const resolved=api.placementResolutionForVisual('bus-stop');
check(resolved.source==='canonical-prop-definition','runtime did not choose canonical placement source');
check(resolved.rule.mode==='roadside','runtime allowed stale legacy override to beat canonical placement');
check(api.saveFormat===4,'runtime API save format changed');

// Legacy compatibility remains available when canonical placement is absent.
delete sandbox.AEGIS_PROP_LIBRARY.props[0].placement;
const legacy=api.placementResolutionForVisual('bus-stop');
check(legacy.source==='legacy-local-override'&&legacy.rule.mode==='building-adjacent','legacy local fallback no longer works');
sandbox.localStorage.getItem=()=>null;
const catalog=api.placementResolutionForVisual('bus-stop');
check(catalog.source==='legacy-placement-catalog'&&catalog.rule.mode==='free','catalog fallback no longer works');

// No batch/installer artifacts are part of the patch directory.
const all=[];function walk(d){for(const n of fs.readdirSync(d)){const p=path.join(d,n),st=fs.statSync(p);if(st.isDirectory()){if(n==='base1215')continue;walk(p)}else all.push(p)}}walk(root);
check(!all.some(p=>/\.(bat|cmd|exe|msi)$/i.test(p)),'direct-copy patch contains installer/batch artifact');
console.log(`PASS ${pass} unified prop authoring → runtime pipeline contracts`);
