const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const start=runtime.indexOf('const TACTICAL_BUILDING_DOOR_APERTURE_ALIGNMENT_AND_OPEN_POSE_HOTFIX=true;');
const end=runtime.indexOf('function TacticalIsoThreeView',start);
assert.ok(start>=0&&end>start,'door hotfix helper slice');
const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON});
ctx.TACTICAL_HEX_WORLD_RADIUS=1;ctx.TACTICAL_HEX_WORLD_X=Math.sqrt(3);ctx.TACTICAL_HEX_ODD_ROW_OFFSET=.5;ctx.TACTICAL_HEX_ROW_STEP=.755;ctx.TACTICAL_HEX_WORLD_Z=ctx.TACTICAL_HEX_WORLD_X*ctx.TACTICAL_HEX_ROW_STEP;
ctx.tacticalDoorIsOpen=cover=>String(cover?.doorState||'')==='open';ctx.tacticalDoorIsLocked=cover=>Boolean(cover?.doorLocked)||String(cover?.doorState||'')==='locked';ctx.tacticalBuildingDoorState=cover=>String(cover?.doorState||'closed');
ctx.tacticalNeighbors=(x,y)=>[{x,y:y+1},{x:x+1,y},{x:x-1,y},{x,y:y-1}];
ctx.tacticalBuildingCellAt=(x,y)=>x===5&&y===6?{building:{id:'house'},interior:true}:null;
ctx.tacticalThreeWorldForCell=(x=0,y=0)=>({x:(x+(Math.abs(y)%2?.5:0))*ctx.TACTICAL_HEX_WORLD_X,z:y*ctx.TACTICAL_HEX_WORLD_Z});
vm.runInContext(runtime.slice(start,end),ctx);
const ew={x:5,y:5,buildingId:'house',buildingPart:'door',doorState:'open',doorOrientation:'ew',visual:'building-door-brick-open-ew'};
const ns={...ew,doorOrientation:'ns',visual:'building-door-brick-open-ns'};

test('hotfix identity and save format are present',()=>{
 assert.match(runtime,/TACTICAL_BUILDING_DOOR_APERTURE_ALIGNMENT_AND_OPEN_POSE_HOTFIX=true/);
 assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});
test('door frame span is derived from actual hex spacing rather than the old narrow fixed frame',()=>{
 const a=ctx.tacticalThreeBuildingDoorGeometrySpec(ew),b=ctx.tacticalThreeBuildingDoorGeometrySpec(ns);
 assert.ok(a.outerWidth>1.6&&a.outerWidth<a.neighborSpan,'EW frame nearly spans its structural cell');
 assert.ok(b.outerWidth>1.4&&b.outerWidth<b.neighborSpan,'NS frame nearly spans its structural cell');
 assert.ok(a.panelWidth>1.1&&b.panelWidth>.95,'door leaf fills the framed opening');
});
test('open pose uses a real jamb-side hinge pivot and not a centered rotated leaf',()=>{
 const source=String(ctx.tacticalThreeAddBuildingDoorModel);
 assert.match(source,/hinge\.position\.set\(-spec\.panelHalf,0,0\)/);
 assert.match(source,/panel\.position\.set\(spec\.panelHalf,0\.74,0\)/);
 assert.match(source,/aegisDoorTrueHingePivot=true/);
 assert.doesNotMatch(runtime,/panel\.position\.x=0\.48|panel\.position\.z=0\.48/);
});
test('open leaf swings toward the building interior',()=>{
 const angle=ctx.tacticalThreeBuildingDoorSwingAngle(ew,{});
 assert.equal(angle,-Math.PI/2);
});
test('both Three.js cover render paths use the same authoritative door geometry helper',()=>{
 const calls=runtime.match(/tacticalThreeAddBuildingDoorModel\(\{THREE,group,cover:c,geoCache,materialFor:mat,qualitySettings,mission(?::props\.mission)?\}\)/g)||[];
 assert.equal(calls.length,2);
});
test('frame jambs and lintel use the same outer-width geometry contract',()=>{
 const source=String(ctx.tacticalThreeAddBuildingDoorModel);
 assert.match(source,/spec\.jambCenter/);assert.match(source,/spec\.outerWidth\/0\.92/);assert.match(source,/spec\.jambWidth\/0\.92/);
});
