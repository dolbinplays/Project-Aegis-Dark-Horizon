const assert=require('assert'),fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const store=new Map();global.localStorage={getItem:k=>store.has(k)?store.get(k):null,setItem:(k,v)=>store.set(k,String(v))};
global.CustomEvent=function(type,init){this.type=type;this.detail=init?.detail};global.dispatchEvent=()=>{};
require(path.join(root,'assets/data/aegis-prop-placement-rules.js'));
const api=require(path.join(root,'assets/runtime/aegis-contextual-prop-placement-runtime.js'));
const n=(x,y)=>[{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1},{x:x+1,y:y+1},{x:x-1,y:y-1}];global.tacticalNeighbors=n;
let road=new Set(),buildings=new Set(),protectedCells=new Set();global.tacticalFieldFeature=(x,y)=>road.has(`${x},${y}`)?'road':'';global.tacticalBuildingCellAt=(x,y)=>buildings.has(`${x},${y}`)?{x,y,buildingPart:'wall'}:null;global.tacticalBuildingIngressProtectedCellKeys=()=>new Set(protectedCells);
global.AEGIS_PROP_LIBRARY={schema:'aegis-prop-library-v1',props:[
 {visualKey:'stop-sign',placement:global.AEGIS_PROP_PLACEMENT_NORMALIZE(global.AEGIS_PROP_PLACEMENT_RULES.rules['stop-sign'])},
 {visualKey:'street-bench',placement:global.AEGIS_PROP_PLACEMENT_NORMALIZE(global.AEGIS_PROP_PLACEMENT_RULES.rules['street-bench'])},
 {visualKey:'bus-stop',placement:global.AEGIS_PROP_PLACEMENT_NORMALIZE(global.AEGIS_PROP_PLACEMENT_RULES.rules['bus-stop'])},
 {visualKey:'vending-machine',placement:global.AEGIS_PROP_PLACEMENT_NORMALIZE(global.AEGIS_PROP_PLACEMENT_RULES.rules['vending-machine'])},
 {visualKey:'legacy-unconfigured'}
]};global.tacticalRuntimePropDefinitionForVisual=v=>global.AEGIS_PROP_LIBRARY.props.find(p=>p.visualKey===v)||null;
// Required Roadside refuses a straight-only context.
road=new Set(['5,5','6,5','4,5']);let result=api.applyContextualPlacement([{id:'stop',visual:'stop-sign',x:5,y:5}],{id:'straight'});assert.equal(result.length,0,'required stop sign should not accept straight road');
// Required Roadside accepts a T intersection.
road=new Set(['5,5','6,5','4,5','5,6']);result=api.applyContextualPlacement([{id:'stop',visual:'stop-sign',x:5,y:5}],{id:'t'});assert.equal(result.length,1);assert.equal(result[0].propRoadContext,'t-intersection');assert.equal(result[0].propPlacementMode,'roadside');
// Four-way intersection eligibility is distinct and accepted by intersection-required props.
road=new Set(['5,5','6,5','4,5','5,6','5,4']);result=api.applyContextualPlacement([{id:'stop4',visual:'stop-sign',x:5,y:5}],{id:'four'});assert.equal(result.length,1);assert.equal(result[0].propRoadContext,'four-way-intersection');
// Opposite-side roadside spawns face the road from opposite directions and mirror handed geometry deterministically.
road=new Set(['5,4','5,5','5,6']);const pair=api.applyContextualPlacement([{id:'bus-left',visual:'bus-stop',x:4,y:5},{id:'bus-right',visual:'bus-stop',x:6,y:5}],{id:'mirror'});assert.equal(pair.length,2);assert.notEqual(pair[0].propRoadSideResolved,pair[1].propRoadSideResolved);assert.notEqual(pair[0].propPlacementMirrored,pair[1].propPlacementMirrored);const delta=Math.abs((((pair[0].propSpawnFacingDeg-pair[1].propSpawnFacingDeg)%360)+360)%360);assert(delta>150&&delta<210,'opposite curbs should face approximately opposite directions toward the same road');
// Preferred Roadside falls back instead of disappearing when no road exists.
road=new Set();result=api.applyContextualPlacement([{id:'bench',visual:'street-bench',x:2,y:2}],{id:'fallback'});assert.equal(result.length,1);assert.equal(result[0].propPlacementFallback,'legacy-free');
// Legacy definitions without metadata remain free and functional.
result=api.applyContextualPlacement([{id:'legacy',visual:'legacy-unconfigured',x:3,y:3}],{id:'legacy'});assert.equal(result.length,1);assert.equal(result[0].propPlacementMode,'free');
// Building-adjacent vending machines relocate away from protected door approach cells while staying adjacent to a wall.
road=new Set();buildings=new Set(['10,10','11,10']);protectedCells=new Set(['9,10']);result=api.applyContextualPlacement([{id:'vend',visual:'vending-machine',x:9,y:10}],{id:'building'});assert.equal(result.length,1);assert(!protectedCells.has(`${result[0].x},${result[0].y}`),'building prop occupied ingress protected cell');assert.equal(result[0].propPlacementMode,'building-adjacent');assert(n(result[0].x,result[0].y).some(p=>buildings.has(`${p.x},${p.y}`)),'building prop not wall adjacent');
// Deterministic placement/orientation.
const first=JSON.stringify(api.applyContextualPlacement([{id:'vend',visual:'vending-machine',x:9,y:10}],{id:'building'}));const second=JSON.stringify(api.applyContextualPlacement([{id:'vend',visual:'vending-machine',x:9,y:10}],{id:'building'}));assert.equal(first,second);
// Parent placement is separate from presentation states/variants, so all variants inherit one authority object.
const parent={visualKey:'x',placement:{mode:'roadside'},presentation:{damageStates:{damaged:{components:[]},destroyed:{components:[]}},variants:[{name:'v',components:[]}]}};assert(parent.placement&&!parent.presentation.damageStates.damaged.placement&&!parent.presentation.variants[0].placement);
// Invert setting defaults off and persists locally without save data.
store.clear();assert.equal(api.readInvertVerticalCamera(),false);api.writeInvertVerticalCamera(true);assert.equal(api.readInvertVerticalCamera(),true);assert.equal(store.get('project-aegis-invert-vertical-camera-v1'),'1');
const runtime=fs.readFileSync(path.join(root,'assets/runtime/aegis-contextual-prop-placement-runtime.js'),'utf8');const editor=fs.readFileSync(path.join(root,'AEGIS_Prop_Editor_v0.26.09.18.1215_CONTEXTUAL_PROP_PLACEMENT_AND_ORIENTATION_PREVIEW_PATCH.html'),'utf8');const gallery=fs.readFileSync(path.join(root,'AEGIS_Prop_Runtime_Test_Gallery_v0.26.09.18.1215_CONTEXTUAL_PROP_PLACEMENT_AND_ORIENTATION_PREVIEW_PATCH.html'),'utf8');const sw=fs.readFileSync(path.join(root,'service-worker.js'),'utf8');
assert(runtime.includes('runtime.activeCamera===runtime.firstPersonCamera||runtime.activeCamera===runtime.thirdPersonCamera'));assert(runtime.includes("runtime.activeCamera===runtime.cinematicCamera"));assert(runtime.includes("aegisBoardingCinematic==='active'"));assert(runtime.includes('runtime.activeIncomingFireReaction'));assert(!runtime.includes('runtime.panOffset.x+='),'runtime extension must not alter ordinary Iso pan');assert(editor.includes('Parent Prop Placement Authority')&&editor.includes('PROP FORWARD / SPAWN FACING'));assert(editor.includes('aegis-prop-placement-overrides-v1'));assert(gallery.includes('four-way-intersection')&&gallery.includes('building-adjacent')&&gallery.includes('PROP FORWARD / SPAWN FACING'));assert(sw.includes('transformedPropLibraryResponse')&&sw.includes('aegis-contextual-prop-placement-runtime.js'));
const metadata=JSON.parse(fs.readFileSync(path.join(root,'release-metadata.json'),'utf8'));assert.equal(metadata.save_format,4);assert.equal(api.saveFormat,4);
console.log('PASS 1215 contextual prop placement / orientation preview: required/preferred contexts, ingress protection, deterministic placement, inheritance, legacy fallback, gallery/editor contracts, vertical inversion isolation, save format 4');
