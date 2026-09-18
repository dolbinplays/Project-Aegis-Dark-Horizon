const fs=require('fs'),assert=require('assert'),vm=require('vm');
function inlineJs(path){const s=fs.readFileSync(path,'utf8'),parts=[...s.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)].map(m=>m[1]).filter(Boolean);for(const code of parts)new vm.Script(code,{filename:path});return s;}
const editor=inlineJs('AEGIS_Prop_Editor_v0.26.09.17.2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH.html');const gallery=inlineJs('AEGIS_Prop_Runtime_Test_Gallery_v0.26.09.17.2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH.html');
for(const token of ['modelTarget','damageThreshold','vehicleAnchorFields','createOrResetTarget','addVariant','defaultVehicleLightingFor','activeModel'])assert(editor.includes(token),token);
for(const token of ['damageState','hpRatio','variantSelect','timeOfDay','showAnchors','resolve(p,context'])assert(gallery.includes(token),token);
assert(fs.readFileSync('AEGIS_Prop_Editor_CURRENT.html','utf8').includes('2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH'));assert(fs.readFileSync('AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html','utf8').includes('2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH'));
console.log('PASS 2358 editor/gallery parse and surface tests');
