(function(root){
const seasonalThreeMaterial=(runtime,...args)=>runtime.material(...args);
function seasonalDefaultRecolorForSlot(definition={},slot="top"){
 const primary=Number.isInteger(definition.primary)?definition.primary:0x64748b,accent=Number.isInteger(definition.accent)?definition.accent:primary,paint=(color,emissive=.06)=>({color,opacity:1,emissive});
 if(slot==="top")return{"torso":paint(primary),"chest-plate":paint(accent,.08),"left-upper-arm":paint(primary),"right-upper-arm":paint(primary),"left-forearm":paint(primary),"right-forearm":paint(primary)};
 if(slot==="bottom")return{"left-thigh":paint(primary),"right-thigh":paint(primary),"left-shin":paint(primary),"right-shin":paint(primary),"left-foot":paint(accent),"right-foot":paint(accent)};
 if(slot==="head")return{"helmet-merged":paint(primary,.08)};
 if(slot==="weapon")return{"weapon-body-merged":paint(primary,.15),"weapon-dark-merged":paint(accent,.08),"weapon-muzzle":paint(accent,.12)};
 return{};
}
function seasonalDefaultAttachments(definition={},slot="top"){
 const key=definition.setKey||definition.key,primary=definition.primary,accent=definition.accent;
 if(slot==="top"&&key==="vampire")return[{id:"vampire-cape",type:"cape",anchor:"torso",color:primary,accent,position:[0,.18,.28],rotation:[-.12,0,0],scale:[1,1,1],opacity:.92,emissive:.06}];
 if(slot!=="head")return[];
 if(key==="witch")return[{id:"witch-hat",type:"hat",anchor:"head",color:primary,accent,position:[0,.30,0],rotation:[0,0,0],scale:[1,1,1],opacity:.96,emissive:.08}];
 if(key==="wolfman")return[{id:"wolfman-mask",type:"mask",anchor:"head",color:primary,accent,position:[0,.12,-.09],rotation:[0,0,0],scale:[1.08,1.02,.9],opacity:.96,emissive:.04}];
 if(key==="mummy")return[{id:"mummy-mask",type:"mask",anchor:"head",color:primary,accent,position:[0,.115,-.085],rotation:[0,0,0],scale:[1.05,1.03,.88],opacity:.9,emissive:.02}];
 if(key==="lagoon")return[{id:"lagoon-mask",type:"mask",anchor:"head",color:primary,accent,position:[0,.115,-.09],rotation:[0,0,0],scale:[1.08,1.05,.9],opacity:.94,emissive:.08}];
 if(key==="frankenstein")return[{id:"frankenstein-wig",type:"wig",anchor:"head",color:accent,accent:primary,position:[0,.25,0],rotation:[0,0,0],scale:[1.04,.85,1.04],opacity:.96,emissive:.02}];
 if(key==="skeleton")return[{id:"skeleton-mask",type:"mask",anchor:"head",color:primary,accent,position:[0,.115,-.09],rotation:[0,0,0],scale:[1.02,1.02,.88],opacity:.94,emissive:.02}];
 return[];
}
function seasonalThreeBuildAttachment(runtime,definition={},attachment={}){const THREE=runtime.THREE,group=new THREE.Group(),style={opacity:attachment.opacity,emissive:attachment.emissive},mat=seasonalThreeMaterial(runtime,`attachment-${attachment.type}-${attachment.id}`,attachment.color,attachment.opacity,style),accent=seasonalThreeMaterial(runtime,`attachment-accent-${attachment.type}-${attachment.id}`,attachment.accent,attachment.opacity,style),add=(mesh)=>{mesh.castShadow=Boolean(runtime.qualitySettings?.shadows);group.add(mesh);return mesh;};group.name=`seasonal-attachment-${attachment.id}`;group.userData.aegisSeasonalAttachment=true;group.position.set(...attachment.position);group.rotation.set(...attachment.rotation);group.scale.set(...attachment.scale);
 if(attachment.type==="cape"){const m=add(new THREE.Mesh(new THREE.BoxGeometry(.72,.62,.08),mat));m.position.set(0,.18,.30);m.rotation.x=-.12;}
 else if(attachment.type==="hat"){const brim=add(new THREE.Mesh(new THREE.CylinderGeometry(.28,.28,.045,12),accent));brim.position.y=.08;const cone=add(new THREE.Mesh(new THREE.ConeGeometry(.20,.52,10),mat));cone.position.y=.34;}
 else if(attachment.type==="mask"){const m=add(new THREE.Mesh(new THREE.SphereGeometry(.17,10,8),mat));m.scale.set(1,1,.56);}
 else if(attachment.type==="helmet"){const shell=add(new THREE.Mesh(new THREE.SphereGeometry(.19,10,8,0,Math.PI*2,0,Math.PI*.64),mat));shell.position.y=.08;}
 else if(attachment.type==="wig"){const hair=add(new THREE.Mesh(new THREE.SphereGeometry(.19,10,8,0,Math.PI*2,0,Math.PI*.58),mat));hair.position.y=.09;hair.scale.set(1.06,.9,1.06);}
 else if(attachment.type==="horns"){for(const x of [-.13,.13]){const horn=add(new THREE.Mesh(new THREE.ConeGeometry(.045,.28,7),x<0?mat:accent));horn.position.set(x,.18,0);horn.rotation.z=x<0?.35:-.35;}}
 else if(attachment.type==="crown"){const crown=add(new THREE.Mesh(new THREE.CylinderGeometry(.16,.21,.18,8,1,true),mat));crown.position.y=.16;}
 else if(attachment.type==="scarf"){const scarf=add(new THREE.Mesh(new THREE.TorusGeometry(.17,.04,7,20),mat));scarf.rotation.x=Math.PI/2;scarf.position.y=.02;}
 else if(attachment.type==="shoulders"){for(const x of [-.28,.28]){const pad=add(new THREE.Mesh(new THREE.BoxGeometry(.20,.08,.28),x<0?mat:accent));pad.position.set(x,.31,0);}}
 return group;}
root.AEGIS_COSTUME_ARTICULATED={recolor:seasonalDefaultRecolorForSlot,attachments:seasonalDefaultAttachments,create:seasonalThreeBuildAttachment};
})(globalThis);
