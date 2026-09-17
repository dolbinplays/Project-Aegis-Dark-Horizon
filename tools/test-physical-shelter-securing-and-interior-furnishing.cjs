const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
function slice(start,end){const a=runtime.indexOf(start),b=runtime.indexOf(end,a+start.length);assert.ok(a>=0,start);assert.ok(b>a,end);return runtime.slice(a,b);}

test('physical shelter and furnishing overhaul marker is present without save schema change',()=>{
  assert.match(runtime,/TACTICAL_PHYSICAL_SHELTER_SECURING_AND_INTERIOR_COVER_OVERHAUL_PATCH=true/);
  assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);
});

test('business and dwelling catalogs use recognizable furnishings rather than primitive prop labels',()=>{
  const ctx=vm.createContext({Math,Number,String,Object,Array,Set,Map});
  ctx.tacticalKey=(x,y)=>`${x},${y}`;ctx.tacticalDistance=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));
  ctx.tacticalNeighbors=(x,y)=>[{x:x-1,y},{x:x+1,y},{x,y:y-1},{x,y:y+1}];
  ctx.tacticalBuildingInteriorCells=building=>Array.from({length:36},(_,i)=>({x:building.x+1+i%6,y:building.y+1+Math.floor(i/6)}));
  ctx.tacticalBuildingPerimeterCells=building=>[{x:building.x,y:building.y},{x:building.x+building.width-1,y:building.y},{x:building.x,y:building.y+building.height-1},{x:building.x+building.width-1,y:building.y+building.height-1}];
  vm.runInContext(slice('function tacticalBuildingFurnishingPoints(building={}){','function tacticalStreetRoadDirection'),ctx);
  const residence=ctx.tacticalBuildingFurnishingPoints({id:'home-1',key:'residence',x:4,y:4,width:9,height:8,doors:[{x:8,y:11}]});
  const market=ctx.tacticalBuildingFurnishingPoints({id:'market-1',key:'market',x:4,y:4,width:10,height:8,doors:[{x:9,y:11}]});
  const homeVisuals=residence.map(p=>p.visual),marketVisuals=market.map(p=>p.visual);
  assert.ok(homeVisuals.some(v=>v.includes('couch')));assert.ok(homeVisuals.some(v=>v.includes('bed')));assert.ok(homeVisuals.some(v=>v.includes('dining-table')));
  assert.ok(marketVisuals.some(v=>v.includes('checkout-counter')));assert.ok(marketVisuals.some(v=>v.includes('cash-register')));assert.ok(marketVisuals.some(v=>v.includes('store-shelf')));
  assert.ok([...residence,...market].filter(p=>p.visual!=='interior-power-panel').every(p=>p.furnishingCover===true));
});

test('furnishing cover authority gives large furniture useful tactical cover',()=>{
  const src=slice('function tacticalInteriorFurnishingCoverBlock','function tacticalStreetRoadDirection');
  const ctx=vm.createContext({String});vm.runInContext(src,ctx);
  assert.equal(ctx.tacticalInteriorFurnishingCoverBlock('interior-store-shelf'),0.75);
  assert.equal(ctx.tacticalInteriorFurnishingCoverBlock('interior-couch'),0.5);
  assert.equal(ctx.tacticalInteriorFurnishingCoverBlock('interior-dining-table'),0.5);
  assert.equal(ctx.tacticalInteriorFurnishingCoverBlock('interior-cash-register'),0);
});

test('civilian securing walks toward the door before remote locking and emits a movement trail',()=>{
  const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map});
  ctx.TACTICAL_CIVILIAN_SHELTER_THREAT_RANGE=14;ctx.TACTICAL_BUILDING_DOOR_STATES={LOCKED:'locked'};
  ctx.tacticalCivilianShelterLockStep=()=>null;ctx.preserveLayeredPatchFunctionSource=()=>{};
  ctx.tacticalKey=(x,y)=>`${x},${y}`;ctx.tacticalDistance=(a,b)=>Math.max(Math.abs(a.x-b.x),Math.abs(a.y-b.y));ctx.tacticalGridSizeFrom=()=>64;
  ctx.tacticalNeighbors=(x,y)=>[{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1},{x:x+1,y:y-1},{x:x-1,y:y+1}];
  ctx.tacticalCoverOccupiesCell=(cover,x,y)=>cover.x===x&&cover.y===y;ctx.tacticalHumanIsDowned=()=>false;ctx.tacticalFireIntensityAt=()=>0;ctx.tacticalSmokeDensityAt=()=>0;
  const building={id:'home',label:'Residence'};ctx.tacticalBuildingCellAt=(x,y)=>({building,door:x===5&&y===5});
  ctx.tacticalCivilianShelterBuilding=c=>building;ctx.tacticalShelterBuildingHasAegisInside=()=>false;ctx.tacticalShelterBuildingHasAlienInside=()=>false;
  ctx.tacticalVisibilityContext=()=>({});ctx.tacticalCivilianVisibleThreats=()=>[{id:'alien',team:'alien',hp:20,alive:true,x:12,y:12}];
  ctx.tacticalShelterDoorsForBuilding=(b,covers)=>covers;ctx.tacticalDoorIsLocked=()=>false;ctx.tacticalBuildingDoorOccupied=()=>false;
  ctx.tacticalTransitionBuildingDoor=(door,state)=>({...door,doorState:state,doorLocked:state==='locked'});ctx.facingToward=()=> 'NW';
  ctx.tacticalMovementTrailAppend=(trails,id,path)=>{trails[id]=path.map(p=>({x:p.x,y:p.y}));};
  ctx.tacticalPath=(civilian,target)=>[{x:civilian.x,y:civilian.y},{x:8,y:8},{x:7,y:7},{x:target.x,y:target.y}];
  const block=slice('const TACTICAL_PHYSICAL_SHELTER_SECURING_AND_INTERIOR_COVER_OVERHAUL_PATCH=true;','function tacticalBuildingCovers');vm.runInContext(block,ctx);
  const civilian={id:'vip',name:'VIP',team:'civilian',hp:18,alive:true,x:9,y:9,rescued:false,escortId:null,panic:false};
  const door={id:'door',x:5,y:5,hp:70,buildingId:'home',buildingPart:'door',doorState:'open'};
  const result=ctx.tacticalCivilianShelterLockStep({units:[civilian],covers:[door],mission:{},round:2});
  const moved=result.units.find(u=>u.id==='vip');assert.deepEqual({x:moved.x,y:moved.y},{x:7,y:7});assert.equal(moved.shelterState,'securing');assert.equal(result.lockedDoorIds.length,0);assert.ok(result.movementTrails.vip.length>=2);
});

test('secured civilians can retreat toward furnishing cover after doors are locked',()=>{
  assert.match(runtime,/function tacticalShelterCoverRetreatPlan/);
  assert.match(runtime,/shelterState:'taking-cover'/);
  assert.match(runtime,/shelterCoverId:retreat\.cover\.id/);
});

test('both Three.js tactical renderers use recognizable compound furniture models',()=>{
  assert.match(runtime,/function tacticalThreeAddInteriorFurnishingModel/);
  assert.ok((runtime.match(/tacticalThreeAddInteriorFurnishingModel\(\{THREE,group,visual,geoCache,materialFor:mat,qualitySettings\}\)/g)||[]).length>=2);
  assert.match(runtime,/couch-base/);assert.match(runtime,/mattress/);assert.match(runtime,/register-screen/);assert.match(runtime,/counter-top/);assert.match(runtime,/shelf-\$\{i\}/);
});

test('furniture generation keeps a wider door/swing clearance',()=>{
  assert.match(runtime,/doors\.every\(door=>tacticalDistance\(door,cell\)>2\)/);
  assert.match(runtime,/tacticalDistance\(door,point\)<=1/);
});
