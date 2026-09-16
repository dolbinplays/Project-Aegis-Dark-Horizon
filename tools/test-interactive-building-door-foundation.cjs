const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),tacticalHumanIsDowned:()=>false,facingToward:()=> 'E'});
ctx.tacticalKey=(x,y)=>`${x},${y}`;
ctx.tacticalDistance=(a,b)=>Math.max(Math.abs(Number(a.x)-Number(b.x)),Math.abs(Number(a.y)-Number(b.y)));
ctx.tacticalCoverFootprintCells=(cover)=>Array.isArray(cover?.footprintCells)&&cover.footprintCells.length?cover.footprintCells:[{x:Number(cover?.x)||0,y:Number(cover?.y)||0}];
ctx.tacticalCoverOccupiesCell=(cover,x,y)=>ctx.tacticalCoverFootprintCells(cover).some(c=>c.x===Number(x)&&c.y===Number(y));
ctx.tacticalIsSkyrangerInteriorRampCover=()=>false;ctx.tacticalIsFireHazard=()=>false;ctx.tacticalSmokeDensityForCover=()=>0;ctx.tacticalUnitIsRampBoardingPresentation=()=>false;
ctx.tacticalCoverIsWindow=(cover)=>String(cover?.buildingPart||'').toLowerCase()==='window';
function evalSlice(startNeedle,endNeedle){const a=runtime.indexOf(startNeedle),b=runtime.indexOf(endNeedle,a+startNeedle.length);assert.ok(a>=0,startNeedle);assert.ok(b>a,endNeedle);vm.runInContext(runtime.slice(a,b),ctx);}
evalSlice('const TACTICAL_INTERACTIVE_BUILDING_DOOR_STATE_AND_PATHING_FOUNDATION_PATCH=true;','function tacticalBuildingCovers');
evalSlice('function tacticalPathBlockerIndex','function tacticalAuthoritativeMovementPlan');
evalSlice('function tacticalCoverAllowsVision','function tacticalCoverIsSolidBuildingBarrier');
const door=(state='closed',locked=false)=>({id:'door-1',x:5,y:5,hp:70,maxHp:70,kind:'hard',block:state==='open'?0:1,structural:true,buildingPart:'door',buildingId:'house',buildingLabel:'House',doorMaterial:'brick',doorOrientation:'ew',doorState:state,doorLocked:locked,visual:`building-door-brick-${state}-ew`});
const soldier={id:'s1',name:'Rook',team:'human',hp:40,tu:40,x:4,y:5};

test('patch identity and generated building cover source define real door records without a save-format migration',()=>{
 assert.match(runtime,/TACTICAL_INTERACTIVE_BUILDING_DOOR_STATE_AND_PATHING_FOUNDATION_PATCH=true/);
 assert.match(runtime,/buildingPart:"door"/);assert.match(runtime,/doorState:TACTICAL_BUILDING_DOOR_STATES\.OPEN/);
 assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});
test('door state model distinguishes open closed locked damaged breached and destroyed',()=>{
 for(const state of ['open','closed','locked','damaged'])assert.equal(ctx.tacticalBuildingDoorState(door(state,state==='locked')),state);
 assert.equal(ctx.tacticalBuildingDoorState({...door(),breached:true}),'breached');
 assert.equal(ctx.tacticalBuildingDoorState({...door(),hp:0,damageState:'destroyed'}),'destroyed');
});
test('closed unlocked doors remain route-traversable while locked doors become hard path blockers',()=>{
 const closed=door('closed'),locked=door('locked',true);
 assert.equal(ctx.tacticalDoorTraversableForPath(closed),true);assert.equal(ctx.tacticalDoorTraversableForPath(locked),false);
 assert.equal(ctx.tacticalPathBlockerIndex([closed],[soldier],soldier.id).hardCover.has('5,5'),false);
 assert.equal(ctx.tacticalPathBlockerIndex([locked],[soldier],soldier.id).hardCover.has('5,5'),true);
});
test('open doors permit sight and closed or locked doors remain solid LOS barriers',()=>{
 assert.equal(ctx.tacticalCoverAllowsVision(door('open')),true);
 assert.equal(ctx.tacticalCoverAllowsVision(door('closed')),false);
 assert.equal(ctx.tacticalCoverAllowsVision(door('locked',true)),false);
});
test('manual adjacent door operation costs TU and toggles state',()=>{
 const closed=door('closed');const result=ctx.tacticalToggleBuildingDoorResult({unit:soldier,covers:[closed],units:[soldier],turn:'human'});
 assert.equal(result.ok,true);assert.equal(result.reason,'open');assert.equal(result.unit.tu,32);assert.equal(result.door.doorState,'open');
 const close=ctx.tacticalToggleBuildingDoorResult({unit:result.unit,covers:result.covers,units:[result.unit],turn:'human'});assert.equal(close.ok,true);assert.equal(close.reason,'closed');
});
test('a doorway occupied by any living unit cannot be closed through that unit',()=>{
 const open=door('open');const occupant={id:'vip',team:'civilian',hp:20,x:5,y:5};const action=ctx.tacticalBuildingDoorActionState(soldier,[open],[soldier,occupant],'human');
 assert.equal(action.ok,false);assert.match(action.reason,/occupied/i);
});
test('ordinary movement auto-opens an unlocked closed door but never a locked door',()=>{
 const closed=door('closed'),locked={...door('locked',true),id:'door-2',x:6};const covers=[closed,locked];
 const opened=ctx.tacticalAutoOpenDoorAtCell(covers,{x:5,y:5},soldier);assert.equal(opened[0].doorState,'open');assert.equal(opened[1].doorState,'locked');
});
test('manual movement charges for closed unlocked doors and tactical controls expose Door on desktop and mobile',()=>{
 assert.match(runtime,/doorAutoOpenCount\*TACTICAL_BUILDING_DOOR_INTERACT_TU/);
 assert.match(runtime,/onClick:toggleSelectedDoor/);assert.match(runtime,/aegisMobileButton\(selectedDoorAction\.label,toggleSelectedDoor/);
});
test('door state participates in both visibility cache keys',()=>{
 assert.match(runtime,/cover\.doorState\|\|""/);assert.match(runtime,/c\.doorState\|\|""/);
});
test('door entities participate in structural restoration, discovered-building rendering, and deliberate breach',()=>{
 assert.match(runtime,/\["wall","window","partition","door"\]/);
 assert.match(runtime,/part === "door" \|\| visual\.includes\("building-wall"\)/);
 assert.match(runtime,/visual\.includes\("building-door"\)/);assert.match(runtime,/wall, window, partition, or door/);
});
test('Three.js renders a dedicated hinged door panel rather than treating a door as a rock',()=>{
 const count=(runtime.match(/panel\.userData\.aegisDoorState=tacticalBuildingDoorState\(c\)/g)||[]).length;
 assert.equal(count,2);assert.match(runtime,/door-frame-/);assert.match(runtime,/door-panel-/);
});
