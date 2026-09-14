const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const THREE=require('../assets/vendor/three.min.js');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const X=Math.sqrt(3),Z=X*.755;
const context=vm.createContext({TACTICAL_HEX_WORLD_X:X,TACTICAL_HEX_WORLD_Z:Z,TACTICAL_HEX_ODD_ROW_OFFSET:.5,TACTICAL_GRID_SIZE:48,TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE:1.5,TACTICAL_AI_FAST_HANDOFF_ACTIVE:false,TACTICAL_AI_HANDOFF_MAX_EXPANDED:4096,
  TACTICAL_DIRECTIONS:['E','NE','NW','W','SW','SE'].map(key=>({key})),tacticalKey:(x,y)=>`${x},${y}`,tacticalGridSizeForMission:()=>48,
  tacticalIsSkyrangerInteriorRampCover:()=>false,tacticalIsFireHazard:()=>false,tacticalSmokeDensityForCover:()=>0,tacticalUnitIsRampBoardingPresentation:()=>false});
for(const name of ['tacticalOffsetToCube','tacticalDistance','tacticalStepForDirection','tacticalNeighbors','tacticalHexPixel','tacticalThreeWorldForCell','tacticalStreetRoadDirection','tacticalStreetVehicleFootprint','tacticalLandVehicleBodyAnchor','tacticalVehiclePolygonsOverlap','tacticalLandVehicleBodyFootprint','tacticalCoverFootprintCells','tacticalHardCoverFootprintKeySet','tacticalLiveLandVehicleFootprintKeySet','tacticalCoverOccupiesCell','tacticalMovementCommitCellState','tacticalThreeCoverWorldAnchor','tacticalVehicleHeadlightLayout','tacticalThreeAddLandVehicle','tacticalGridSizeFrom','tacticalPathBlockerIndex','tacticalPathSearch','tacticalPath']){
  const a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+10);assert.ok(a>=0,name);vm.runInContext(source.slice(a,b),context);
}
const world=(x,y)=>({x:(x+(y&1?.5:0))*X,z:y*Z});
const key=p=>`${p.x},${p.y}`;
function model(cover){
  const group=new THREE.Group(),anchor=context.tacticalThreeCoverWorldAnchor(world,cover);
  group.position.set(anchor.x,0,anchor.z);group.rotation.y=cover.roadRotation||0;
  context.tacticalThreeAddLandVehicle(THREE,group,cover,{wreck:new THREE.BoxGeometry(1,.38,.66),wall:new THREE.BoxGeometry(.92,.62,.54),crate:new THREE.BoxGeometry(.64,.45,.64)},()=>new THREE.MeshBasicMaterial());
  group.updateMatrixWorld(true);return group;
}
for(const visual of ['vehicle-sedan','vehicle-van','vehicle-utility','vehicle-bus'])test(`${visual}: all six headings on even/odd rows block the rendered body and adjacent movement clearance`,()=>{
  for(const row of [20,21])for(const direction of context.TACTICAL_DIRECTIONS){
    const next=context.tacticalStepForDirection(20,row,direction.key);
    context.tacticalFieldFeature=(x,y)=>x===20&&y===row||x===next.x&&y===next.y?'road':null;
    const footprint=context.tacticalStreetVehicleFootprint(20,row,{},visual==='vehicle-bus'?5:3,2);
    const cover={id:'car',x:20,y:row,hp:70,kind:'hard',visual,solidVehicleFootprint:true,footprintCells:footprint.cells,vehicleBodyAnchor:footprint.bodyAnchor,roadRotation:footprint.rotation};
    const blocked=context.tacticalPathBlockerIndex([cover],[]).hardCover,group=model(cover),inverse=group.matrixWorld.clone().invert();
    const body=group.children[0];body.geometry.computeBoundingBox();const box=body.geometry.boundingBox.clone().applyMatrix4(body.matrix);
    const a=world(20,row),b=world(next.x,next.y),forward=new THREE.Vector3(1,0,0).transformDirection(group.matrixWorld);
    assert.ok(forward.dot(new THREE.Vector3(b.x-a.x,0,b.z-a.z).normalize())>.999999,'body faces actual road heading');
    for(let y=row-6;y<=row+6;y++)for(let x=14;x<=26;x++){
      if(blocked.has(`${x},${y}`))continue;
      for(const end of context.tacticalNeighbors(x,y,48)){
        if(blocked.has(key(end)))continue;
        const start=world(x,y),finish=world(end.x,end.y);
        for(let t=0;t<=20;t++){
          const p=new THREE.Vector3(start.x+(finish.x-start.x)*t/20,0,start.z+(finish.z-start.z)*t/20).applyMatrix4(inverse);
          assert.ok(!(p.x>box.min.x-.25&&p.x<box.max.x+.25&&p.z>box.min.z-.25&&p.z<box.max.z+.25),'legal neighboring steps must clear body and shoulders');
        }
      }
    }
    assert.equal(JSON.stringify(context.tacticalCoverFootprintCells(JSON.parse(JSON.stringify(cover)))),JSON.stringify(footprint.cells),'saved generated footprint is stable');
  }
});
test('Legacy diagonal footprint expands to cover the body without moving its rendered anchor',()=>{
  const cover={id:'legacy',x:20,y:20,hp:70,kind:'hard',visual:'vehicle-sedan',solidVehicleFootprint:true,roadRotation:Math.PI/3,footprintCells:[{x:19,y:19},{x:20,y:19},{x:20,y:20},{x:21,y:20},{x:21,y:21},{x:22,y:21}]};
  const oldPoints=cover.footprintCells.map(p=>world(p.x,p.y));
  const anchor=context.tacticalThreeCoverWorldAnchor(world,cover);
  assert.ok(Math.abs(anchor.x-oldPoints.reduce((n,p)=>n+p.x,0)/oldPoints.length)<1e-8);
  assert.ok(Math.abs(anchor.z-oldPoints.reduce((n,p)=>n+p.z,0)/oldPoints.length)<1e-8);
  const oldKeys=new Set(cover.footprintCells.map(key)),expanded=context.tacticalCoverFootprintCells(cover);
  const added=expanded.filter(p=>!oldKeys.has(key(p)));assert.ok(added.length>0);
  assert.equal(context.tacticalMovementCommitCellState({id:'h',x:10,y:10},added[0],[cover],[],{requireAdjacent:false}).reason,'live-vehicle-footprint');
  assert.equal(context.tacticalMovementCommitCellState({id:'h',x:10,y:10},added[0],[{...cover,hp:0}],[],{requireAdjacent:false}).ok,true);
});
test('Human, alien and VIP path searches detour around the same full body; footprint cache refreshes after rotation',()=>{
  const cover={id:'car',x:20,y:20,hp:70,kind:'hard',visual:'vehicle-sedan',solidVehicleFootprint:true,roadRotation:0};
  for(const team of ['human','alien','civilian']){
    const unit={id:team,team,hp:40,x:15,y:20,gridSize:48},route=context.tacticalPath(unit,{x:25,y:20},[cover],[unit],30);
    assert.ok(route?.length>1);assert.ok(route.every(p=>!context.tacticalCoverOccupiesCell(cover,p.x,p.y)));
    for(let i=1;i<route.length;i++)assert.equal(context.tacticalMovementCommitCellState({...unit,...route[i-1]},route[i],[cover],[unit]).ok,true);
  }
  const first=context.tacticalLandVehicleBodyFootprint(cover);assert.equal(context.tacticalLandVehicleBodyFootprint(cover),first);
  cover.roadRotation=Math.PI/3;assert.notEqual(context.tacticalLandVehicleBodyFootprint(cover),first);
});
test('Playback reconstructs a sparse trail instead of animating a jump through a vehicle',()=>{
  const name='tacticalPlaybackMovementPath',a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+10);
  vm.runInContext(source.slice(a,b),context);
  context.tacticalAiHazardAwarePath=(unit,target,covers,units,maxSteps,blockers)=>context.tacticalPath(unit,target,covers,units,maxSteps,blockers);
  context.tacticalPathHazardStats=()=>({fireSteps:0,hazardCost:0});
  const cover={id:'car',x:20,y:20,hp:70,kind:'hard',visual:'vehicle-sedan',solidVehicleFootprint:true,roadRotation:0};
  for(const team of ['human','alien','civilian']){
    const unit={id:team,team,hp:40,x:15,y:20,gridSize:48},target={...unit,x:25,y:20};
    const path=context.tacticalPlaybackMovementPath({movementTrails:{[team]:[unit,target]}},team,unit,target,[cover],[unit]);
    assert.ok(path.length>1);let previous=unit;
    for(const step of path){assert.equal(context.tacticalDistance(previous,step),1);assert.equal(context.tacticalCoverOccupiesCell(cover,step.x,step.y),false);previous=step;}
    assert.equal(previous.x,target.x);assert.equal(previous.y,target.y);
  }
});
