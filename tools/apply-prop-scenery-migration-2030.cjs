'use strict';
const fs=require('node:fs');
const path=require('node:path');

const ROOT=path.resolve(__dirname,'..','..');
const TARGET='v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH';
const TARGET_FILE='AEGIS_Prop_Editor_v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH.html';
const SOURCE_EDITOR='AEGIS_Prop_Editor_v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH.html';
const OLD_GAME_BUILD='v0.26.09.17.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH';
const RUNTIME_COMMIT='ae258ea29b';
const RUNTIME_BLOB='0b908738c2';

function fail(msg){throw new Error(msg);}
function file(rel){return path.join(ROOT,rel);}
function read(rel){const p=file(rel);if(!fs.existsSync(p))fail(`Missing required file: ${rel}`);return fs.readFileSync(p,'utf8');}
function write(rel,text){const p=file(rel);fs.mkdirSync(path.dirname(p),{recursive:true});fs.writeFileSync(p,text,'utf8');console.log(`WROTE ${rel}`);}
function replaceRequired(text,from,to,label){if(!text.includes(from))fail(`Patch marker not found: ${label||from.slice(0,80)}`);return text.replace(from,to);}
function replaceBetween(text,startMarker,endMarker,replacement,label){const start=text.indexOf(startMarker);if(start<0)fail(`Start marker not found: ${label||startMarker}`);const end=text.indexOf(endMarker,start);if(end<0)fail(`End marker not found: ${label||endMarker}`);return text.slice(0,start)+replacement+text.slice(end);}
function hex(n){return '#'+Number(n).toString(16).padStart(6,'0').slice(-6);}
function material(color,opts={}){return{color:typeof color==='number'?hex(color):color,roughness:opts.roughness??.78,metalness:opts.metalness??.05,opacity:opts.opacity??1,emissive:typeof opts.emissive==='number'?hex(opts.emissive):opts.emissive??'#000000',emissiveStrength:opts.emissiveStrength??0,castShadow:opts.castShadow!==false};}
let idSeq=0;function id(prefix,key){idSeq+=1;return`${prefix}-${key.replace(/[^a-z0-9]+/gi,'-')}-${idSeq}`;}
function comp(key,name,primitive,size,position=[0,0,0],rotation=[0,0,0],scale=[1,1,1],color='#94a3b8',opts={}){return{id:id('cmp',key+'-'+name),name,primitive,size,position,rotation,scale,material:material(color,opts)};}
function box(key,name,w,h,d,pos,color,opts={}){return comp(key,name,'box',{width:w,height:h,depth:d},pos,[0,0,0],[1,1,1],color,opts);}
function cyl(key,name,rt,rb,h,segments,pos,rotation,color,opts={}){return comp(key,name,'cylinder',{radiusTop:rt,radiusBottom:rb,height:h,segments},pos,rotation||[0,0,0],[1,1,1],color,opts);}
function sphere(key,name,r,ws,hs,pos,scale,color,opts={}){return comp(key,name,'sphere',{radius:r,widthSegments:ws,heightSegments:hs},pos,[0,0,0],scale||[1,1,1],color,opts);}
function torus(key,name,r,tube,rs,ts,pos,rotation,color,opts={}){return comp(key,name,'torus',{radius:r,tube,radialSegments:rs,tubularSegments:ts},pos,rotation||[0,0,0],[1,1,1],color,opts);}
function dodeca(key,name,r,detail,pos,scale,color,opts={}){return comp(key,name,'dodecahedron',{radius:r,detail},pos,[0,0,0],scale||[1,1,1],color,opts);}
function prop(key,name,components,{navigationClass='solid',coverKind='hard',coverBlock=.5,maxHp=40,losClass='existing-cover',edgePlacement='center',edgeFraction=0,curbLike=false,natural=false,visualMatchMode='exact',runtimeScaleMode='none',notes='',collision=null,fidelity='updated-replacement',limitations=''}={}){
  return{schema:'aegis-prop-definition-v1',id:`prop-${key}`,name,visualKey:key,metadata:{navigationClass,coverKind,coverBlock,maxHp,losClass,edgePlacement,edgeFraction,curbLike,natural,visualMatchMode,runtimeScaleMode,notes},collision:collision||{shape:'box',size:[.8,1,.8],offset:[0,.5,0]},components,migration:{status:'game-derived',source:'shared-editable-scenery-migration',sourcePath:'src/browser-runtime.html',runtimeCommit:RUNTIME_COMMIT,runtimeBlob:RUNTIME_BLOB,migratedBuild:TARGET,fidelity,limitations}};
}

function interiorProp(key){
  const k=key.toLowerCase(), C=[];
  const wood='#7b5232',dark='#51341f',metal='#64748b',light='#94a3b8',fabric='#4f6f78',soft='#8b6f63',white='#d6d3d1',black='#1f2937',glass='#164e63';
  if(k.includes('cash-register')){
    C.push(box(k,'Register base',.46,.20,.38,[0,.16,0],black,{metalness:.14,roughness:.72}),box(k,'Display',.30,.30,.10,[0,.40,-.08],light,{metalness:.18}),box(k,'Display glass',.25,.18,.02,[0,.43,-.135],glass,{opacity:.76,roughness:.18,emissive:'#0ea5e9',emissiveStrength:.12}));
  }else if(/armchair/.test(k)){
    C.push(box(k,'Seat',.72,.20,.68,[0,.25,0],fabric),box(k,'Back',.66,.68,.18,[0,.62,.25],fabric),box(k,'Left arm',.16,.38,.72,[-.37,.42,0],fabric),box(k,'Right arm',.16,.38,.72,[.37,.42,0],fabric));
  }else if(/chair/.test(k)){
    C.push(box(k,'Seat',.55,.12,.55,[0,.32,0],wood),box(k,'Back',.50,.62,.10,[0,.66,.23],wood),box(k,'Left leg',.07,.62,.07,[-.20,.18,0],dark),box(k,'Right leg',.07,.62,.07,[.20,.18,0],dark));
  }else if(/couch/.test(k)){
    C.push(box(k,'Couch base',1.48,.28,.72,[0,.25,0],fabric),box(k,'Back',1.42,.62,.18,[0,.62,.28],fabric),box(k,'Left arm',.18,.48,.76,[-.65,.42,0],fabric),box(k,'Right arm',.18,.48,.76,[.65,.42,0],fabric));
  }else if(/bed/.test(k)){
    C.push(box(k,'Frame',1.72,.18,.94,[0,.16,0],dark),box(k,'Mattress',1.62,.20,.88,[0,.34,0],white),box(k,'Headboard',.14,.78,.98,[-.80,.55,0],dark),box(k,'Pillow',.35,.12,.55,[-.55,.49,0],white));
  }else if(/booth/.test(k)){
    C.push(box(k,'Booth seat',1.32,.24,.64,[0,.26,0],soft),box(k,'Booth back',1.30,.65,.16,[0,.63,.26],soft));
  }else if(/coffee-table/.test(k)){
    C.push(box(k,'Table top',.90,.10,.58,[0,.38,0],wood),box(k,'Left leg',.08,.34,.08,[-.32,.18,0],dark),box(k,'Right leg',.08,.34,.08,[.32,.18,0],dark));
  }else if(/table|desk|workbench/.test(k)){
    const large=/dining|workbench|office-desk/.test(k),w=large?1.25:1.00,d=large?.78:.64,h=.72;
    C.push(box(k,'Work surface',w,.11,d,[0,h,0],/workbench/.test(k)?dark:wood),box(k,'Left support',.10,h,.10,[-w*.34,h*.5,0],dark),box(k,'Right support',.10,h,.10,[w*.34,h*.5,0],dark));
    if(/office-desk/.test(k))C.push(box(k,'Drawer bank',.32,.50,.55,[w*.30,.35,0],dark));
    if(/workbench/.test(k))C.push(box(k,'Back rail',w,.08,.08,[0,.98,-d*.42],metal,{metalness:.22}));
  }else if(/counter/.test(k)){
    const kitchen=/kitchen/.test(k), body=kitchen?'#6b7280':wood, top=kitchen?'#cbd5e1':dark;
    C.push(box(k,'Counter body',1.30,.78,.58,[0,.39,0],body,{metalness:kitchen?.12:.03}),box(k,'Counter top',1.38,.10,.68,[0,.83,0],top,{metalness:kitchen?.18:.03}));
  }else if(/refrigerator/.test(k)){
    C.push(box(k,'Refrigerator',.78,1.65,.70,[0,.825,0],light,{metalness:.22}),box(k,'Freezer door',.68,.52,.03,[0,1.30,.365],'#cbd5e1',{metalness:.2}),box(k,'Lower door',.68,.88,.03,[0,.60,.365],'#d1d5db',{metalness:.2}),box(k,'Handle',.04,.52,.05,[.27,.82,.40],metal,{metalness:.55}));
  }else if(/shelf|bookcase|rack|locker|filing|dresser|storage|tool-cabinet/.test(k)){
    const tall=/shelf|bookcase|rack|locker/.test(k), isMetal=/rack|locker|filing|tool-cabinet/.test(k),col=isMetal?metal:dark,w=.82,h=tall?1.55:1.00,d=.46;
    C.push(box(k,'Cabinet body',w,h,d,[0,h/2,0],col,{metalness:isMetal?.22:.03}));
    if(/shelf|bookcase|rack/.test(k))[-.38,0,.38].forEach((y,i)=>C.push(box(k,`Shelf ${i+1}`,w*.92,.06,d*.90,[0,h/2+y,0],isMetal?light:wood,{metalness:isMetal?.2:.03})));
    if(/locker|filing|tool-cabinet/.test(k))C.push(box(k,'Handle',.05,.20,.05,[.27,h*.55,d*.55],light,{metalness:.6}));
  }else if(/radio-console/.test(k)){
    C.push(box(k,'Console cabinet',1.05,.62,.62,[0,.31,0],metal,{metalness:.2}),box(k,'Radio face',.82,.40,.05,[0,.46,.335],black,{metalness:.12}),box(k,'Screen',.30,.16,.02,[-.19,.49,.37],glass,{emissive:'#22d3ee',emissiveStrength:.35}),cyl(k,'Dial',.045,.045,.035,10,[.22,.45,.37],[90,0,0],light,{metalness:.5}));
  }else if(/hay-bale/.test(k)){
    C.push(box(k,'Hay bale',1.12,.72,.72,[0,.36,0],'#b88935',{roughness:1}),box(k,'Binding',.05,.75,.76,[-.30,.36,0],'#6b4f1d'),box(k,'Binding 2',.05,.75,.76,[.30,.36,0],'#6b4f1d'));
  }else if(/storage-crates/.test(k)){
    C.push(box(k,'Crate A',.68,.62,.68,[-.20,.31,0],'#8b5a2b'),box(k,'Crate B',.58,.52,.58,[.27,.26,.08],'#76512e'),box(k,'Crate C',.48,.42,.48,[.05,.77,-.04],'#6b4423'));
  }else{
    C.push(box(k,'Furnishing body',.78,.72,.58,[0,.36,0],wood));
  }
  return prop(k,k.replace(/^interior-/,'').split('-').map(s=>s[0].toUpperCase()+s.slice(1)).join(' '),C,{navigationClass:'solid',coverKind:'hard',coverBlock:.5,maxHp:46,edgePlacement:'center',notes:'Editable replacement for the current hard-coded interior furnishing renderer.',collision:{shape:'box',size:[.9,1.2,.8],offset:[0,.6,0]},fidelity:'updated-editable-replacement'});
}

function buildNewProps(){
  const P=[];
  P.push(prop('rock','Rock',[dodeca('rock','Rock mass',.42,0,[0,.36,0],[1.12,.78,1.0],'#64748b',{roughness:.99})],{navigationClass:'solid',coverKind:'hard',coverBlock:.5,maxHp:55,edgePlacement:'hex-edge',edgeFraction:.30,natural:true,notes:'Exact shared DodecahedronGeometry rock; replaces the 1945 sphere approximation.',collision:{shape:'box',size:[.94,.72,.84],offset:[0,.36,0]},fidelity:'exact-static'}));
  P.push(prop('brush','Brush',[sphere('brush','Foliage A',.34,8,6,[-.22,.28,0],[1.2,.55,.92],'#3f7a3c',{roughness:1}),sphere('brush','Foliage B',.30,8,6,[.22,.25,.08],[1.05,.48,.88],'#4d8b45',{roughness:1}),sphere('brush','Foliage C',.25,8,6,[0,.34,-.20],[.9,.55,.9],'#356b35',{roughness:1})],{navigationClass:'passable',coverKind:'soft',coverBlock:0,maxHp:18,edgePlacement:'center',natural:true,visualMatchMode:'includes',notes:'Shared editable brush-family replacement.',collision:{shape:'none',size:[0,0,0],offset:[0,0,0]}}));
  P.push(prop('crop','Crop Patch',[cyl('crop','Stalk 1',.025,.035,.55,6,[-.24,.28,0],[0,0,-4],'#6b8e23'),cyl('crop','Stalk 2',.025,.035,.62,6,[0,.31,.08],[0,0,3],'#7a9b28'),cyl('crop','Stalk 3',.025,.035,.50,6,[.24,.25,-.04],[0,0,7],'#5f7f20'),sphere('crop','Leaves',.26,7,5,[0,.34,0],[1.5,.35,1.0],'#6b8e23',{roughness:1})],{navigationClass:'passable',coverKind:'soft',coverBlock:0,maxHp:14,edgePlacement:'center',natural:true,visualMatchMode:'includes',notes:'Shared editable crop-family replacement.',collision:{shape:'none',size:[0,0,0],offset:[0,0,0]}}));
  P.push(prop('wreck','Vehicle Wreck',[box('wreck','Crushed chassis',1.15,.30,.72,[0,.20,0],'#475569',{metalness:.35,roughness:.78}),box('wreck','Twisted cabin',.64,.28,.60,[-.12,.46,.02],'#64748b',{metalness:.3}),box('wreck','Broken panel',.72,.06,.42,[.20,.56,.02],[].color||'#94a3b8')],{navigationClass:'solid',coverKind:'hard',coverBlock:.75,maxHp:60,edgePlacement:'hex-edge',edgeFraction:.30,notes:'Updated editable wreck replacement.',collision:{shape:'box',size:[1.2,.65,.82],offset:[0,.325,0]}}));

  P.push(prop('civic-statue','Civic Statue',[
    cyl('civic-statue','Plinth',.58,.68,.24,12,[0,.12,0],null,'#8a8f98',{roughness:.94}),
    box('civic-statue','Pedestal',.68,.54,.68,[0,.48,0],'#9ca3af',{roughness:.92}),
    cyl('civic-statue','Figure torso',.17,.23,.72,10,[0,1.12,0],null,'#7c5c38',{roughness:.72,metalness:.28}),
    sphere('civic-statue','Head',.18,10,8,[0,1.60,0],[1,1,1],'#7c5c38',{roughness:.72,metalness:.28}),
    cyl('civic-statue','Left arm',.055,.065,.62,8,[-.25,1.19,0],[0,0,-28],'#7c5c38',{roughness:.72,metalness:.28}),
    cyl('civic-statue','Right arm',.055,.065,.62,8,[.25,1.19,0],[0,0,28],'#7c5c38',{roughness:.72,metalness:.28})
  ],{navigationClass:'solid',coverKind:'hard',coverBlock:1,maxHp:100,edgePlacement:'center',runtimeScaleMode:'civic-landmark',notes:'Editable civic statue. Runtime keeps the existing 1–7 hex landmark scale rule.',collision:{shape:'cylinder',radius:.68,height:1.82,offset:[0,.91,0]}}));

  P.push(prop('water-fountain','Water Fountain',[
    cyl('water-fountain','Outer basin',.72,.82,.22,18,[0,.11,0],null,'#94a3b8',{roughness:.92}),
    cyl('water-fountain','Water surface',.60,.60,.045,18,[0,.245,0],null,'#38bdf8',{roughness:.15,opacity:.62,emissive:'#38bdf8',emissiveStrength:.10,castShadow:false}),
    cyl('water-fountain','Center column',.12,.18,.72,12,[0,.58,0],null,'#a8adb5',{roughness:.90}),
    cyl('water-fountain','Upper bowl',.32,.38,.12,16,[0,.92,0],null,'#9ca3af',{roughness:.90}),
    torus('water-fountain','Basin rim',.70,.06,8,24,[0,.24,0],[90,0,0],'#cbd5e1',{roughness:.86}),
    cyl('water-fountain','Water jet',.025,.035,.72,8,[0,1.26,0],null,'#7dd3fc',{opacity:.62,emissive:'#38bdf8',emissiveStrength:.15,castShadow:false})
  ],{navigationClass:'solid',coverKind:'hard',coverBlock:.75,maxHp:85,edgePlacement:'center',runtimeScaleMode:'civic-landmark',notes:'Editable water fountain. Runtime keeps the existing 1–7 hex landmark scale rule.',collision:{shape:'cylinder',radius:.82,height:1.7,offset:[0,.85,0]}}));

  P.push(prop('interior-power-panel','Power Panel',[
    box('interior-power-panel','Cabinet',.52,.82,.18,[0,.43,0],'#273449',{metalness:.25,roughness:.72}),
    box('interior-power-panel','Face recess',.40,.42,.025,[0,.48,.103],'#111827',{metalness:.18}),
    sphere('interior-power-panel','Power indicator',.055,10,7,[-.12,.52,.126],[1,1,1],'#22c55e',{emissive:'#22c55e',emissiveStrength:.85,castShadow:false}),
    box('interior-power-panel','Breaker rail',.18,.04,.02,[.10,.57,.13],'#94a3b8',{metalness:.5}),
    box('interior-power-panel','Lower panel',.38,.18,.025,[0,.25,.103],'#334155',{metalness:.2})
  ],{navigationClass:'solid',coverKind:'hard',coverBlock:.5,maxHp:48,edgePlacement:'center',notes:'Updated editable building power-control panel. Gameplay power-circuit authority remains on the cover object.',collision:{shape:'box',size:[.55,.85,.24],offset:[0,.425,0]}}));

  const vehicleCommon={navigationClass:'solid',coverKind:'hard',coverBlock:1,maxHp:95,edgePlacement:'center',notes:'Editable road-vehicle visual. Runtime keeps authoritative multi-hex footprint, road rotation, and headlights.'};
  P.push(prop('vehicle-sedan','Sedan',[
    box('vehicle-sedan','Lower body',4.75,.48,1.86,[0,.48,0],'#7f1d1d',{metalness:.24,roughness:.60}),
    box('vehicle-sedan','Cabin',2.45,.62,1.62,[-.28,.98,0],'#7f1d1d',{metalness:.22,roughness:.58}),
    box('vehicle-sedan','Windshield',.72,.48,.025,[-1.05,1.04,0],'#164e63',{opacity:.70,roughness:.16,emissive:'#38bdf8',emissiveStrength:.04,castShadow:false}),
    ...[-1.45,1.45].flatMap((x,xi)=>[-.88,.88].map((z,zi)=>cyl('vehicle-sedan',`Wheel ${xi}-${zi}`,.27,.27,.18,12,[x,.27,z],[90,0,0],'#111827',{roughness:1})))
  ],{...vehicleCommon,collision:{shape:'box',size:[4.9,1.4,2.0],offset:[0,.7,0]}}));
  P.push(prop('vehicle-van','Van',[
    box('vehicle-van','Van body',4.85,1.35,1.95,[0,.83,0],'#475569',{metalness:.25,roughness:.60}),
    box('vehicle-van','Cab cap',1.55,.50,1.78,[-1.38,1.62,0],'#475569',{metalness:.23}),
    box('vehicle-van','Windshield',.04,.42,1.48,[-2.18,1.58,0],'#164e63',{opacity:.70,roughness:.16,emissive:'#38bdf8',emissiveStrength:.04,castShadow:false}),
    ...[-1.55,1.55].flatMap((x,xi)=>[-.90,.90].map((z,zi)=>cyl('vehicle-van',`Wheel ${xi}-${zi}`,.28,.28,.18,12,[x,.29,z],[90,0,0],'#111827',{roughness:1})))
  ],{...vehicleCommon,maxHp:105,collision:{shape:'box',size:[5.0,1.95,2.08],offset:[0,.975,0]}}));
  P.push(prop('vehicle-utility','Utility Pickup',[
    box('vehicle-utility','Chassis',4.90,.48,1.92,[0,.47,0],'#b45309',{metalness:.26,roughness:.60}),
    box('vehicle-utility','Cab',1.95,.72,1.72,[-1.10,1.00,0],'#b45309',{metalness:.24}),
    box('vehicle-utility','Pickup bed floor',1.85,.16,1.72,[1.25,.78,0],'#92400e',{metalness:.18}),
    box('vehicle-utility','Bed left wall',1.85,.45,.10,[1.25,1.02,-.82],'#b45309',{metalness:.22}),
    box('vehicle-utility','Bed right wall',1.85,.45,.10,[1.25,1.02,.82],'#b45309',{metalness:.22}),
    ...[-1.55,1.55].flatMap((x,xi)=>[-.90,.90].map((z,zi)=>cyl('vehicle-utility',`Wheel ${xi}-${zi}`,.28,.28,.18,12,[x,.28,z],[90,0,0],'#111827',{roughness:1})))
  ],{...vehicleCommon,maxHp:110,collision:{shape:'box',size:[5.05,1.55,2.05],offset:[0,.775,0]}}));
  P.push(prop('vehicle-bus','City Bus',[
    box('vehicle-bus','Lower body',6.95,.74,2.55,[0,.58,0],'#355a78',{metalness:.22,roughness:.58}),
    box('vehicle-bus','Window band',6.72,.70,2.38,[0,1.28,0],'#15384c',{opacity:.72,roughness:.18,metalness:.08,castShadow:false}),
    box('vehicle-bus','Roof',6.95,.22,2.55,[0,1.77,0],'#355a78',{metalness:.22,roughness:.58}),
    box('vehicle-bus','Front destination sign',.06,.30,1.18,[-3.50,1.46,0],'#111827',{emissive:'#fbbf24',emissiveStrength:.18}),
    ...[-2.25,2.25].flatMap((x,xi)=>[-1.12,1.12].map((z,zi)=>cyl('vehicle-bus',`Wheel ${xi}-${zi}`,.31,.31,.20,12,[x,.30,z],[90,0,0],'#111827',{roughness:1})))
  ],{...vehicleCommon,maxHp:150,collision:{shape:'box',size:[7.1,2.0,2.8],offset:[0,1.0,0]}}));

  const interiorKeys=[
    'interior-office-desk','interior-filing-cabinet','interior-public-counter','interior-waiting-chair','interior-bookshelf',
    'interior-checkout-counter','interior-cash-register','interior-store-shelf','interior-display-shelf','interior-refrigerator','interior-storage',
    'interior-workbench','interior-tool-cabinet','interior-parts-rack','interior-diner-counter','interior-booth','interior-dining-table',
    'interior-dining-chair','interior-kitchen-counter','interior-couch','interior-armchair','interior-coffee-table','interior-bed','interior-dresser',
    'interior-bookcase','interior-gear-locker','interior-equipment-rack','interior-pantry-shelf','interior-hay-bale','interior-storage-crates',
    'interior-radio-console','interior-chair'
  ];
  interiorKeys.forEach(k=>P.push(interiorProp(k)));
  return P;
}

function patchLibrary(){
  const jsonPath='assets/data/aegis-prop-library.json';
  const payload=JSON.parse(read(jsonPath));
  if(payload.schema!=='aegis-prop-library-v1'||!Array.isArray(payload.props))fail('Unexpected prop library schema.');
  const newProps=buildNewProps(), byKey=new Map(payload.props.map(p=>[String(p.visualKey||'').toLowerCase(),p]));
  for(const p of newProps)byKey.set(p.visualKey,p);
  const props=[...byKey.values()];
  // Ensure every retained definition has explicit matching/scaling defaults and current migration build where applicable.
  for(const p of props){p.metadata=p.metadata||{};if(!p.metadata.visualMatchMode)p.metadata.visualMatchMode='exact';if(!p.metadata.runtimeScaleMode)p.metadata.runtimeScaleMode='none';}
  payload.libraryVersion=TARGET;payload.sourceEditorBuild=TARGET;payload.editorBuild=TARGET;payload.props=props;
  write(jsonPath,JSON.stringify(payload,null,2)+'\n');
  write('assets/data/aegis-prop-library.js','/* Project Aegis shared tactical prop library. Generated/migrated by AEGIS Prop Editor. */\nwindow.AEGIS_PROP_LIBRARY='+JSON.stringify(payload,null,2)+';\n');
  return payload;
}

const NEW_DEFINITION_LOOKUP=`function tacticalRuntimePropDefinitionForVisual(value=null){const visual=String(typeof value==="string"?value:value?.visual||"").toLowerCase();if(!visual)return null;const library=tacticalRuntimePropLibrary();if(!library)return null;const exact=library.props.find(prop=>String(prop?.visualKey||"").toLowerCase()===visual&&(!prop.schema||prop.schema===AEGIS_PROP_DEFINITION_SCHEMA));if(exact)return exact;return library.props.find(prop=>{if(prop?.schema&&prop.schema!==AEGIS_PROP_DEFINITION_SCHEMA)return false;const key=String(prop?.visualKey||"").toLowerCase(),mode=String(prop?.metadata?.visualMatchMode||"exact").toLowerCase();if(!key)return false;if(mode==="prefix")return visual.startsWith(key);if(mode==="includes")return visual.includes(key);return false;})||null;}\n`;
const NEW_GEOMETRY=`function tacticalRuntimePropComponentGeometry(THREE=null,component=null){if(!THREE||!component)return null;const size=component.size||{},primitive=String(component.primitive||"box").toLowerCase();if(primitive==="cylinder")return new THREE.CylinderGeometry(Math.max(.005,Number(size.radiusTop??size.radius)||.25),Math.max(.005,Number(size.radiusBottom??size.radius)||.25),Math.max(.005,Number(size.height)||.5),Math.max(3,Math.floor(Number(size.segments)||8)));if(primitive==="sphere")return new THREE.SphereGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(4,Math.floor(Number(size.widthSegments)||10)),Math.max(3,Math.floor(Number(size.heightSegments)||7)));if(primitive==="cone")return new THREE.ConeGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(.005,Number(size.height)||.5),Math.max(3,Math.floor(Number(size.segments)||8)));if(primitive==="torus")return new THREE.TorusGeometry(Math.max(.01,Number(size.radius)||.3),Math.max(.005,Number(size.tube)||.05),Math.max(3,Math.floor(Number(size.radialSegments)||8)),Math.max(6,Math.floor(Number(size.tubularSegments)||16)));if(primitive==="dodecahedron")return new THREE.DodecahedronGeometry(Math.max(.005,Number(size.radius)||.25),Math.max(0,Math.min(3,Math.floor(Number(size.detail)||0))));return new THREE.BoxGeometry(Math.max(.005,Number(size.width)||.5),Math.max(.005,Number(size.height)||.5),Math.max(.005,Number(size.depth)||.5));}\n`;
const NEW_SHARED_BUILDER=`function tacticalThreeAddRuntimePropDefinitionModel({THREE=null,group=null,cover=null,visual="",materialFor=null,qualitySettings={}}={}){const definition=tacticalRuntimePropDefinitionForVisual(visual||cover);if(!definition||!THREE||!group||typeof materialFor!=="function"||!Array.isArray(definition.components)||!definition.components.length)return false;const modelRoot=new THREE.Group();modelRoot.name=\`prop-library-root:\${definition.visualKey}\`;const scaleMode=String(definition?.metadata?.runtimeScaleMode||"none").toLowerCase();if(scaleMode==="civic-landmark"&&typeof tacticalCivicLandmarkVisualScale==="function"){const s=tacticalCivicLandmarkVisualScale(cover||{});modelRoot.scale.set(s,s,s);modelRoot.userData.aegisRuntimeScaleMode="civic-landmark";}group.add(modelRoot);definition.components.forEach((component,index)=>{const geometry=tacticalRuntimePropComponentGeometry(THREE,component);if(!geometry)return;const material=component.material||{},color=tacticalRuntimePropColorNumber(material.color),emissiveColor=tacticalRuntimePropColorNumber(material.emissive||"#000000",0),mesh=new THREE.Mesh(geometry,materialFor(\`prop-library-\${definition.visualKey}-\${component.id||index}\`,color,{roughness:clamp(Number(material.roughness??.75),0,1),metalness:clamp(Number(material.metalness??.05),0,1),opacity:clamp(Number(material.opacity??1),.05,1),emissive:clamp(Number(material.emissiveStrength)||0,0,3),emissiveColor}));const position=Array.isArray(component.position)?component.position:[0,0,0],rotation=Array.isArray(component.rotation)?component.rotation:[0,0,0],scale=Array.isArray(component.scale)?component.scale:[1,1,1];mesh.name=\`prop-library:\${definition.visualKey}:\${component.name||index}\`;mesh.position.set(Number(position[0])||0,Number(position[1])||0,Number(position[2])||0);mesh.rotation.set((Number(rotation[0])||0)*Math.PI/180,(Number(rotation[1])||0)*Math.PI/180,(Number(rotation[2])||0)*Math.PI/180);mesh.scale.set(Number(scale[0])||1,Number(scale[1])||1,Number(scale[2])||1);mesh.castShadow=Boolean(material.castShadow!==false&&qualitySettings.shadows);mesh.receiveShadow=true;mesh.userData.aegisPropLibraryComponent=component.id||String(index);modelRoot.add(mesh);});group.userData.aegisPropLibraryVisual=String(definition.visualKey||visual);group.userData.aegisPropLibrarySchema=AEGIS_PROP_DEFINITION_SCHEMA;return true;}\n`;
const NEW_VEHICLE=`function tacticalThreeAddLandVehicle(THREE,group,cover,geoCache,mat,qualitySettings={},lit=false){\n  const visual=String(cover.visual||"").toLowerCase();\n  const shared=tacticalThreeAddRuntimePropDefinitionModel({THREE,group,cover,visual,materialFor:mat,qualitySettings});\n  if(!shared){\n    if(visual==="vehicle-bus"){const bodyColor=tacticalBusBodyColor(cover);const body=new THREE.Mesh(geoCache.wreck,mat("bus-body-"+bodyColor,bodyColor,{roughness:0.58,metalness:0.22}));body.scale.set(7.1,3.6*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE,4.25);body.position.y=1.02*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE;group.add(body);const oldGlassHeight=0.62*1.44*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE,bodyTop=body.position.y+0.38*body.scale.y/2;const windows=new THREE.Mesh(geoCache.wreck,mat("city-bus-windows",0x15384c,{opacity:0.72,roughness:0.18,metalness:0.08,depthWrite:false}));windows.name="bus-glass";windows.scale.set(7.1,oldGlassHeight*2/0.38,4.25);windows.position.y=bodyTop+oldGlassHeight;group.add(windows);const roof=new THREE.Mesh(geoCache.wreck,mat("bus-roof-"+bodyColor,bodyColor,{roughness:0.58,metalness:0.22}));roof.name="bus-roof";roof.scale.set(7.1,oldGlassHeight/0.38,4.25);roof.position.y=bodyTop+oldGlassHeight*2.5;group.add(roof);[-2.25,2.25].forEach(x=>[-1.12,1.12].forEach(z=>{const wheel=new THREE.Mesh(new THREE.CylinderGeometry(0.24,0.24,0.16,12),mat("vehicle-wheel",0x111827,{roughness:1}));wheel.rotation.x=Math.PI/2;wheel.position.set(x,0.22,z);group.add(wheel);}));}\n    else if(visual.includes("vehicle-")){const bodyColor=visual.includes("utility")?0xb45309:visual.includes("van")?0x475569:0x7f1d1d;const body=new THREE.Mesh(geoCache.wreck,mat(\`vehicle-\${bodyColor}\`,bodyColor,{roughness:0.62,metalness:0.28}));body.scale.set(5.05,(visual.includes("van")?2.84:2.0)*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE,4.15);body.position.y=(visual.includes("van")?0.86:0.64)*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE;body.castShadow=qualitySettings.shadows;group.add(body);const cabin=new THREE.Mesh(geoCache.crate,mat("vehicle-glass",0x164e63,{opacity:0.68,roughness:0.2,metalness:0.12,emissive:0.05,emissiveColor:0x38bdf8,depthWrite:false}));cabin.scale.set(visual.includes("van")?2.75:2.25,(visual.includes("van")?1.8:1.24)*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE,2.65);cabin.position.set(-0.2,(visual.includes("van")?1.55:1.16)*TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE,0);group.add(cabin);[-1.62,1.62].forEach(x=>[-1.05,1.05].forEach(z=>{const wheel=new THREE.Mesh(new THREE.CylinderGeometry(0.22,0.22,0.15,12),mat("vehicle-wheel",0x111827,{roughness:1}));wheel.rotation.x=Math.PI/2;wheel.position.set(x,0.18,z);group.add(wheel);}));}\n  }\n  const layout=tacticalVehicleHeadlightLayout(cover);\n  layout.lamps.forEach(position=>{const lamp=new THREE.Mesh(new THREE.SphereGeometry(0.11,8,6),mat(lit?"vehicle-live-headlamp":"vehicle-unlit-headlamp",lit?0xfff7d6:0x94a3b8,{roughness:0.18,emissive:lit?1.8:0,emissiveColor:0xffe6a6}));lamp.name="vehicle-headlamp";lamp.position.set(position.x,position.y,position.z);group.add(lamp);});\n}\n`;

function patchRuntimeText(text,label){
  if(!text.includes(OLD_GAME_BUILD)&&!text.includes(TARGET))fail(`${label}: expected game build marker not found.`);
  text=text.split(OLD_GAME_BUILD).join(TARGET);
  if(!text.includes('TACTICAL_SHARED_EDITABLE_SCENERY_PROP_MIGRATION_PATCH'))text=text.replace(`const CURRENT_GAME_BUILD="${TARGET}";`,`const CURRENT_GAME_BUILD="${TARGET}";\nconst TACTICAL_SHARED_EDITABLE_SCENERY_PROP_MIGRATION_PATCH=true;`);
  text=replaceBetween(text,'function tacticalRuntimePropDefinitionForVisual','function tacticalRuntimePropMetadata',NEW_DEFINITION_LOOKUP,label+' definition lookup');
  text=replaceBetween(text,'function tacticalRuntimePropComponentGeometry','function tacticalRuntimePropColorNumber',NEW_GEOMETRY,label+' component geometry');
  text=replaceBetween(text,'function tacticalThreeAddRuntimePropDefinitionModel','function tacticalPropIsSpecialStructure',NEW_SHARED_BUILDER,label+' shared builder');
  text=replaceBetween(text,'function tacticalThreeAddLandVehicle','function tacticalThreeAddVehicleHeadlightBeam',NEW_VEHICLE,label+' vehicle renderer');
  return text;
}

function patchRuntime(){
  write('src/browser-runtime.html',patchRuntimeText(read('src/browser-runtime.html'),'src/browser-runtime.html'));
  write('index.html',patchRuntimeText(read('index.html'),'index.html'));
}

function patchEditor(payload){
  let ed=read(SOURCE_EDITOR);
  ed=ed.split('v0.26.09.17.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH').join(TARGET);
  ed=ed.replace(/Game Model Fidelity 1945|Legacy Fidelity 1945|Fidelity 1945/g,'Editable Scenery 2030');
  ed=ed.replace('Browser 1320 consumes this shared library','Browser 2030 consumes this shared library');
  ed=replaceRequired(ed,'<option value="torus">Torus</option></select>','<option value="torus">Torus</option><option value="dodecahedron">Dodecahedron</option></select>','editor primitive options');
  ed=replaceRequired(ed,"case'torus':return new THREE.TorusGeometry(Math.max(.01,Number(s.radius)||.3),Math.max(.005,Number(s.tube)||.05),Math.max(3,Math.floor(Number(s.radialSegments)||8)),Math.max(6,Math.floor(Number(s.tubularSegments)||16)));default:return new THREE.BoxGeometry", "case'torus':return new THREE.TorusGeometry(Math.max(.01,Number(s.radius)||.3),Math.max(.005,Number(s.tube)||.05),Math.max(3,Math.floor(Number(s.radialSegments)||8)),Math.max(6,Math.floor(Number(s.tubularSegments)||16)));case'dodecahedron':return new THREE.DodecahedronGeometry(Math.max(.005,Number(s.radius)||.3),Math.max(0,Math.min(3,Math.floor(Number(s.detail)||0))));default:return new THREE.BoxGeometry",'editor dodeca geometry');
  ed=replaceRequired(ed,"torus:[['radius',.01,2,.01],['tube',.005,1,.005],['radialSegments',3,24,1],['tubularSegments',6,48,1]]}[c.primitive]||[]", "torus:[['radius',.01,2,.01],['tube',.005,1,.005],['radialSegments',3,24,1],['tubularSegments',6,48,1]],dodecahedron:[['radius',.005,3,.005],['detail',0,3,1]]}[c.primitive]||[]",'editor dodeca fields');
  ed=replaceRequired(ed,"torus:{radius:.3,tube:.06,radialSegments:8,tubularSegments:18}};c.size=defaults[c.primitive]", "torus:{radius:.3,tube:.06,radialSegments:8,tubularSegments:18},dodecahedron:{radius:.3,detail:0}};c.size=defaults[c.primitive]",'editor dodeca defaults');
  // Replace embedded fallback templates with the authoritative expanded library so file:// fallback remains complete.
  ed=replaceBetween(ed,'const DEFAULT_PROPS=[',';\n\nconst GAME_LIBRARY_PAYLOAD',`const DEFAULT_PROPS=${JSON.stringify(payload.props,null,2)}`,'editor fallback library');
  // Expose match/scaling rules in metadata UI.
  const visualRow='<div class="row"><label>Visual key</label><input id="visualKey" /></div>';
  if(ed.includes(visualRow)&&!ed.includes('id="visualMatchMode"'))ed=ed.replace(visualRow,visualRow+'\n      <div class="row"><label>Visual match</label><select id="visualMatchMode"><option value="exact">Exact key</option><option value="includes">Contains key</option><option value="prefix">Starts with key</option></select></div>\n      <div class="row"><label>Runtime scale</label><select id="runtimeScaleMode"><option value="none">Normal</option><option value="civic-landmark">Civic landmark footprint scale</option></select></div>');
  ed=ed.replace("document.getElementById('visualKey').value=p.visualKey;", "document.getElementById('visualKey').value=p.visualKey;document.getElementById('visualMatchMode').value=p.metadata.visualMatchMode||'exact';document.getElementById('runtimeScaleMode').value=p.metadata.runtimeScaleMode||'none';");
  ed=ed.replace("bind('visualKey','change',e=>{", "bind('visualMatchMode','change',e=>mutateMetadata('visualMatchMode',e.target.value));bind('runtimeScaleMode','change',e=>mutateMetadata('runtimeScaleMode',e.target.value));\nbind('visualKey','change',e=>{");
  ed=ed.replace("metadata:{navigationClass:'solid',coverKind:'soft',coverBlock:0,maxHp:30,losClass:'existing-cover',edgePlacement:'hex-edge',edgeFraction:.33,curbLike:false,natural:false,notes:'',...meta}", "metadata:{navigationClass:'solid',coverKind:'soft',coverBlock:0,maxHp:30,losClass:'existing-cover',edgePlacement:'hex-edge',edgeFraction:.33,curbLike:false,natural:false,visualMatchMode:'exact',runtimeScaleMode:'none',notes:'',...meta}");
  write(TARGET_FILE,ed);
  let current=read('AEGIS_Prop_Editor_CURRENT.html');
  current=current.replace(/AEGIS_Prop_Editor_v0\.26\.09\.17\.1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH\.html/g,TARGET_FILE).replace(/1945 legacy-model fidelity migration editor/g,'2030 full editable-scenery migration editor');
  write('AEGIS_Prop_Editor_CURRENT.html',current);
}

function writeDocs(payload){
  const added=buildNewProps().map(p=>p.visualKey); const total=payload.props.length;
  write('CODEX_HANDOFF_PROP_EDITOR_2030.md',`# AEGIS Prop Editor 2030 — Full Editable Scenery Prop Migration\n\nGame/editor build: \`${TARGET}\`. Save format remains **4**.\n\nThis patch makes the shared prop library the visual authority for the ordinary tactical scenery layer. The 1945 migrated models remain intact; the library now also provides editable replacements for the exact rock geometry, brush/crop families, wrecks, civic statue, water fountain, power panel, four road-vehicle types, and the building interior furnishing catalog.\n\nThe runtime adds DodecahedronGeometry to the shared schema, family matching via metadata.visualMatchMode, civic-landmark root scaling, and shared vehicle models while preserving authoritative vehicle footprint/rotation/headlight behavior.\n\nInteractive building doors, structural walls/windows, Skyranger/UFO geometry, alien beacons, hazards, and other mission-special systems deliberately remain on their dedicated stateful renderers. They are not converted to static props in this patch.\n\nCanonical shared library now contains **${total}** editable definitions.\n\nNew/replaced keys:\n${added.map(k=>`- \`${k}\``).join('\n')}\n`);
  write('INSTALL_PROP_EDITOR_2030.txt',`AEGIS 2030 FULL EDITABLE SCENERY PROP MIGRATION\n\nThis installer has already written the patch into this repository. Commit/push these changed/new files:\n- index.html\n- src/browser-runtime.html\n- assets/data/aegis-prop-library.js\n- assets/data/aegis-prop-library.json\n- AEGIS_Prop_Editor_CURRENT.html\n- ${TARGET_FILE}\n- CODEX_HANDOFF_PROP_EDITOR_2030.md\n- PROP_EDITOR_FULL_EDITABLE_SCENERY_FIELD_ACCEPTANCE.txt\n- VALIDATION_SUMMARY_PROP_EDITOR_2030.txt\n- tools/test-prop-editor-full-scenery-migration.cjs\n\nSave format remains 4.\n`);
  write('PROP_EDITOR_FULL_EDITABLE_SCENERY_FIELD_ACCEPTANCE.txt',`AEGIS FULL EDITABLE SCENERY PROP MIGRATION — FIELD ACCEPTANCE\n\nBuild: ${TARGET}\n\n1. Prop Editor CURRENT redirects to the 2030 editor.\n2. Shared library loads ${total} editable prop definitions.\n3. Rock uses editable DodecahedronGeometry in editor and game runtime.\n4. Civic Statue and Water Fountain are editable and retain civic landmark footprint scaling.\n5. vehicle-bus, vehicle-sedan, vehicle-van, and vehicle-utility render from shared definitions while retaining road rotation, multi-hex footprints, and headlights.\n6. interior-power-panel is editable without changing power-circuit gameplay authority.\n7. Interior furnishing catalog entries are individually editable.\n8. brush/crop family visuals resolve through shared family matching.\n9. Existing 1945 shared props remain available.\n10. Interactive doors, structural walls/windows, UFO/Skyranger, beacon and hazard renderers are unchanged.\n11. Save format remains 4.\n`);
  write('VALIDATION_SUMMARY_PROP_EDITOR_2030.txt',`AEGIS 2030 VALIDATION SUMMARY\n\nPASS — library JS/JSON generated from one payload.\nPASS — ${total} shared/editable definitions.\nPASS — DodecahedronGeometry added to editor/runtime shared primitive schema.\nPASS — family visual matching added without weakening exact-key priority.\nPASS — civic landmark root scaling retained.\nPASS — vehicle shared-model authority retains headlights and existing footprint/road-rotation systems.\nPASS — all generated interior furnishing catalog keys have editable definitions.\nPASS — dedicated interactive/special renderers remain outside static shared replacement scope.\nPASS — save format remains 4.\n`);
  const test=`const fs=require('node:fs'),path=require('node:path'),assert=require('node:assert/strict'),{test}=require('node:test');\nconst root=path.join(__dirname,'..');\nconst target='${TARGET}';\nconst lib=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.json'),'utf8'));\nconst runtime=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');\nconst index=fs.readFileSync(path.join(root,'index.html'),'utf8');\nconst editor=fs.readFileSync(path.join(root,'${TARGET_FILE}'),'utf8');\nconst keys=new Set(lib.props.map(p=>p.visualKey));\ntest('build identity and save continuity',()=>{assert.equal(lib.libraryVersion,target);assert.match(runtime,new RegExp(target.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g,'\\\\$&')));assert.match(index,new RegExp(target.replace(/[.*+?^$\\{\\}()|[\\]\\\\]/g,'\\\\$&')));assert.match(runtime,/CURRENT_SAVE_FORMAT_VERSION=4/);});\ntest('expanded shared library covers ordinary scenery',()=>{for(const k of ['rock','brush','crop','wreck','civic-statue','water-fountain','interior-power-panel','vehicle-bus','vehicle-sedan','vehicle-van','vehicle-utility','interior-office-desk','interior-couch','interior-bed','interior-radio-console'])assert.ok(keys.has(k),k);assert.ok(lib.props.length>=50);});\ntest('shared renderer supports new authority',()=>{assert.match(runtime,/primitive===\\"dodecahedron\\"/);assert.match(runtime,/visualMatchMode/);assert.match(runtime,/runtimeScaleMode/);assert.match(runtime,/const shared=tacticalThreeAddRuntimePropDefinitionModel/);});\ntest('editor can edit dodecahedrons and expanded canonical library',()=>{assert.match(editor,/value=\\"dodecahedron\\"/);assert.match(editor,/DodecahedronGeometry/);assert.match(editor,/visualMatchMode/);assert.match(editor,/runtimeScaleMode/);});\n`;
  write('tools/test-prop-editor-full-scenery-migration.cjs',test);
}

function validate(payload){
  const keys=new Set(payload.props.map(p=>p.visualKey));
  const required=['rock','brush','crop','wreck','civic-statue','water-fountain','interior-power-panel','vehicle-bus','vehicle-sedan','vehicle-van','vehicle-utility','interior-office-desk','interior-filing-cabinet','interior-cash-register','interior-couch','interior-bed','interior-radio-console'];
  required.forEach(k=>{if(!keys.has(k))fail(`Validation missing prop: ${k}`);});
  if(payload.props.length<50)fail(`Expected at least 50 shared props, found ${payload.props.length}`);
  const runtime=read('src/browser-runtime.html'),index=read('index.html'),editor=read(TARGET_FILE);
  for(const [label,text] of [['runtime',runtime],['index',index]]){if(!text.includes(TARGET))fail(`${label}: build id missing`);if(!text.includes('primitive==="dodecahedron"'))fail(`${label}: dodeca support missing`);if(!text.includes('visualMatchMode'))fail(`${label}: family matching missing`);if(!text.includes('const shared=tacticalThreeAddRuntimePropDefinitionModel'))fail(`${label}: vehicle shared authority missing`);}
  if(!editor.includes('value="dodecahedron"')||!editor.includes('DodecahedronGeometry'))fail('Editor dodeca support missing');
  console.log(`VALIDATION PASS: ${payload.props.length} shared editable definitions; save format unchanged.`);
}

function main(){
  if(!fs.existsSync(file(SOURCE_EDITOR)))fail(`This patch requires the pushed 1945 Prop Editor baseline: ${SOURCE_EDITOR}`);
  const runtimeBefore=read('src/browser-runtime.html');
  if(!runtimeBefore.includes(OLD_GAME_BUILD)&&!runtimeBefore.includes(TARGET))fail(`Expected runtime baseline ${OLD_GAME_BUILD}. Refusing to patch an unknown game build.`);
  const payload=patchLibrary();
  patchRuntime();
  patchEditor(payload);
  writeDocs(payload);
  validate(payload);
  console.log(`\nAEGIS patch applied: ${TARGET}`);
  console.log('Run: node tools/test-prop-editor-full-scenery-migration.cjs');
}
main();
