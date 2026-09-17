const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON});
ctx.TACTICAL_GRID_SIZE=64;
ctx.TACTICAL_AI_FAST_HANDOFF_ACTIVE=false;ctx.TACTICAL_AI_HANDOFF_MAX_EXPANDED=4096;
ctx.TACTICAL_DIRECTIONS=[{key:'E'},{key:'NE'},{key:'NW'},{key:'W'},{key:'SW'},{key:'SE'}];
ctx.clamp=(n,min,max)=>Math.max(min,Math.min(max,n));
ctx.tacticalKey=(x,y)=>`${x},${y}`;
ctx.tacticalStepForDirection=(x,y,key)=>{const odd=y&1,d=odd?{E:[1,0],W:[-1,0],NE:[1,-1],NW:[0,-1],SE:[1,1],SW:[0,1]}:{E:[1,0],W:[-1,0],NE:[0,-1],NW:[-1,-1],SE:[0,1],SW:[-1,1]};const [dx,dy]=d[key]||[0,0];return{x:x+dx,y:y+dy};};
ctx.tacticalNeighbors=(x,y,grid=64)=>ctx.TACTICAL_DIRECTIONS.map(d=>ctx.tacticalStepForDirection(x,y,d.key)).filter(p=>p.x>=0&&p.y>=0&&p.x<grid&&p.y<grid);
ctx.tacticalCoverFootprintCells=(cover)=>Array.isArray(cover?.footprintCells)&&cover.footprintCells.length?cover.footprintCells:[{x:cover.x,y:cover.y}];
ctx.tacticalCoverIsBuildingDoor=(cover)=>String(cover?.buildingPart||'').toLowerCase()==='door'||String(cover?.visual||'').includes('building-door');
ctx.tacticalDoorIsLocked=(cover)=>Boolean(cover?.doorLocked)||String(cover?.doorState||'')==='locked';
ctx.tacticalDoorTraversableForPath=(cover)=>ctx.tacticalCoverIsBuildingDoor(cover)&&!ctx.tacticalDoorIsLocked(cover);
ctx.tacticalIsSkyrangerInteriorRampCover=()=>false;
ctx.tacticalGridSizeFrom=()=>64;
ctx.tacticalBuildingIngressProtectedCellKeys=()=>new Set();
ctx.tacticalBuildingCellAt=()=>null;
ctx.tacticalFieldFeature=(x,y,mission)=>mission?.roadAt===`${x},${y}`?'road':null;
ctx.tacticalIsFireHazard=()=>false;
ctx.tacticalSmokeDensityForCover=()=>0;
ctx.tacticalUnitIsRampBoardingPresentation=()=>false;

function evalBetween(start,end){const a=runtime.indexOf(start),b=runtime.indexOf(end,a+start.length);assert.ok(a>=0,`missing ${start}`);assert.ok(b>a,`missing ${end}`);vm.runInContext(runtime.slice(a,b),ctx);}
evalBetween('const TACTICAL_HEX_EDGE_PROP_PLACEMENT_AND_SOLID_PROP_NAVIGATION_PATCH=true;','function tacticalLiveLandVehicleFootprintKeySet');
evalBetween('function tacticalPathBlockerIndex','function tacticalAuthoritativeMovementPlan');
function evalFunction(name){const a=runtime.indexOf('function '+name+'('),b=runtime.indexOf('function ',a+10);assert.ok(a>=0,name);vm.runInContext(runtime.slice(a,b),ctx);}
for(const name of ['tacticalReachableCellSet','tacticalPathSearch','tacticalPathDistance','tacticalPath'])evalFunction(name);

const soft=(visual,x=10,y=10,extra={})=>({id:`${visual}-${x}-${y}`,x,y,hp:30,maxHp:30,kind:'soft',block:0,visual,...extra});
const hard=(visual,x=10,y=10,extra={})=>({id:`${visual}-${x}-${y}`,x,y,hp:48,maxHp:48,kind:'hard',block:.5,visual,...extra});

test('patch marker is present and save format remains 4',()=>{
  assert.match(runtime,/TACTICAL_HEX_EDGE_PROP_PLACEMENT_AND_SOLID_PROP_NAVIGATION_PATCH=true/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('navigation contract classifies solid props separately from low passable foliage',()=>{
  for(const visual of ['tree','lamp-post','stop-sign','vending-machine','newspaper-machine','bus-stop','street-bench'])assert.equal(ctx.tacticalPropNavigationClass(soft(visual)),'solid',visual);
  for(const visual of ['bush','brush','crop'])assert.equal(ctx.tacticalPropNavigationClass(soft(visual)),'passable',visual);
  assert.equal(ctx.tacticalPropNavigationClass(hard('concrete')),'solid');
});

test('path blocker and placement authority both block live solid props but release destroyed props',()=>{
  const tree=soft('tree',12,10),lamp=soft('lamp-post',13,10),bush=soft('bush',14,10),destroyed={...soft('vending-machine',15,10),hp:0};
  const blockers=ctx.tacticalPathBlockerIndex([tree,lamp,bush,destroyed],[],null).hardCover;
  assert.equal(blockers.has('12,10'),true);
  assert.equal(blockers.has('13,10'),true);
  assert.equal(blockers.has('14,10'),false);
  assert.equal(blockers.has('15,10'),false);
  const placement=ctx.tacticalHardCoverFootprintKeySet([tree,lamp,bush,destroyed]);
  assert.equal(placement.has('12,10'),true);
  assert.equal(placement.has('13,10'),true);
  assert.equal(placement.has('14,10'),false);
});

test('closed unlocked doors remain traversable while locked doors remain blockers',()=>{
  const closed=hard('building-door-brick-closed-ew',8,8,{buildingPart:'door',doorState:'closed',doorLocked:false});
  const locked={...closed,id:'locked',x:9,doorState:'locked',doorLocked:true};
  const blocked=ctx.tacticalHardCoverFootprintKeySet([closed,locked]);
  assert.equal(blocked.has('8,8'),false);
  assert.equal(blocked.has('9,8'),true);
});


test('authoritative route search detours around a soft-rendered solid prop instead of stepping through it',()=>{
  const unit={id:'human-1',team:'human',hp:40,x:10,y:10},tree=soft('tree',11,10),target={x:12,y:10};
  const route=ctx.tacticalPath(unit,target,[tree],[unit],8);
  assert.ok(Array.isArray(route)&&route.length>2);
  assert.equal(route.some(cell=>cell.x===11&&cell.y===10),false);
  const reachable=ctx.tacticalReachableCellSet(unit,[tree],[unit],3);
  assert.equal(reachable.has('11,10'),false);
  assert.equal(reachable.has('12,10'),true);
});

test('edge placement is deterministic, stored across JSON reload, and stays inside the owning hex',()=>{
  const mission={id:'qa-prop-edge',kind:'Urban Scout Raid'},tree=soft('tree',20,20),covers=[tree];
  const first=ctx.tacticalApplyHexEdgePropPlacement(covers,mission)[0],reload=JSON.parse(JSON.stringify(first)),second=ctx.tacticalApplyHexEdgePropPlacement([reload],mission)[0];
  assert.equal(first.propPlacementMode,'hex-edge');
  assert.equal(first.propEdgeDirectionKey,second.propEdgeDirectionKey);
  assert.equal(first.propEdgeFraction,second.propEdgeFraction);
  assert.ok(first.propEdgeFraction>=.2&&first.propEdgeFraction<.5);
  assert.equal(first.propNavigationClass,'solid');
});

test('curb fixtures prefer a neighboring road-facing edge while natural props avoid a road edge',()=>{
  const mission={id:'qa-curb',kind:'Town Abduction',roadAt:'11,10'};
  const lamp=soft('lamp-post',10,10),tree=soft('tree',10,10);
  assert.equal(ctx.tacticalPropEdgeDirectionKey(lamp,mission,[lamp]),'E');
  assert.notEqual(ctx.tacticalPropEdgeDirectionKey(tree,mission,[tree]),'E');
});

test('multihex vehicles, civic landmarks, and building furniture do not get edge-shifted',()=>{
  const fixtures=[
    hard('vehicle-sedan',10,10,{solidVehicleFootprint:true,footprintCells:[{x:10,y:10},{x:11,y:10}]}),
    hard('civic-statue',12,12,{civicLandmark:true,footprintCells:[{x:12,y:12},{x:13,y:12}]}),
    hard('interior-counter',14,14,{buildingId:'b1',buildingPart:'interior-prop'})
  ];
  fixtures.forEach(item=>assert.equal(ctx.tacticalCoverUsesHexEdgePlacement(item),false,item.visual));
});

test('manual and AI movement authorities share the same solid-prop blocking contract and Three.js consumes the saved edge spec',()=>{
  assert.match(runtime,/function isHardCoverAt\(covers=\[\],x,y\)\{return covers\.some\(c=>tacticalCoverBlocksMovement\(c\)/);
  assert.match(runtime,/function tacticalPathBlockerIndex[\s\S]*?const hard=tacticalCoverBlocksMovement\(cover\)/);
  assert.match(runtime,/function tacticalHardCoverFootprintKeySet[\s\S]*?tacticalCoverBlocksMovement\(cover\)/);
  assert.match(runtime,/tacticalThreeCoverWorldAnchorWithHexEdgeProps/);
  assert.match(runtime,/propEdgeDirectionKey/);
  assert.match(runtime,/propEdgeFraction/);
  assert.match(runtime,/makeBattlefieldWithHexEdgePropPlacement/);
  assert.match(runtime,/makeBattlefieldAsyncWithHexEdgePropPlacement/);
});
