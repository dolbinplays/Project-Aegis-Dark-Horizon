const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');

function functionSource(name){
  const needle=`function ${name}`;
  const start=source.indexOf(needle);
  assert.ok(start>=0,`${name} source`);
  const header=source.slice(start,start+1200);
  const bodyMatch=/\)\s*\{/.exec(header);
  assert.ok(bodyMatch,`${name} opening brace`);
  const brace=start+bodyMatch.index+bodyMatch[0].lastIndexOf('{');
  let depth=0,quote=null,escape=false,templateDepth=0;
  for(let i=brace;i<source.length;i++){
    const ch=source[i],next=source[i+1];
    if(quote){
      if(escape){escape=false;continue;}
      if(ch==='\\'){escape=true;continue;}
      if(quote==='`'&&ch==='$'&&next==='{'){templateDepth+=1;i+=1;continue;}
      if(quote==='`'&&templateDepth>0){if(ch==='{')templateDepth+=1;else if(ch==='}')templateDepth-=1;continue;}
      if(ch===quote)quote=null;
      continue;
    }
    if(ch==='"'||ch==="'"||ch==='`'){quote=ch;continue;}
    if(ch==='{')depth+=1;
    else if(ch==='}'&&--depth===0)return source.slice(start,i+1);
  }
  throw new Error(`Unable to extract ${name}`);
}

// Reuse the shipped tetromino footprint implementation to build exact family/rotation fixtures.
const shapeStart=source.indexOf('const TACTICAL_BUILDING_ARCHETYPES=');
const shapeEnd=source.indexOf('function tacticalStreetRoadDirection',shapeStart);
assert.ok(shapeStart>=0&&shapeEnd>shapeStart,'tetromino source block');
const shapeContext=vm.createContext({
  TACTICAL_GRID_SIZE:64,
  clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
  tacticalKey:(x,y)=>`${x},${y}`,
  tacticalDistance:(a,b)=>Math.max(Math.abs(Number(a.x)-Number(b.x)),Math.abs(Number(a.y)-Number(b.y))),
  tacticalBiomeForMission:()=>({key:'city'}),
  tacticalMapProfileForMission:()=>({key:'medium',size:64,structureBonus:0}),
  tacticalSeed:()=>9417,
  tacticalFieldFeature:()=>null,
});
vm.runInContext(source.slice(shapeStart,shapeEnd),shapeContext);
const shapeApi=vm.runInContext(`({
  tacticalBuildingFootprintCells,tacticalBuildingPerimeterCells,tacticalBuildingDoorCells,tacticalBuildingFacadeOrientation
})`,shapeContext);

let activePlan=null;
const key=(x,y)=>`${x},${y}`;
const footprintKeys=plan=>new Set(shapeApi.tacticalBuildingFootprintCells(plan).map(c=>key(c.x,c.y)));
const perimeterKeys=plan=>new Set(shapeApi.tacticalBuildingPerimeterCells(plan).map(c=>key(c.x,c.y)));
const doorKeys=plan=>new Set((plan.doors||[]).map(c=>key(c.x,c.y)));
const facadeExposure=(plan,cell)=>{
  const keys=footprintKeys(plan),x=Number(cell.x),y=Number(cell.y);
  const north=!keys.has(key(x,y-1)),south=!keys.has(key(x,y+1)),west=!keys.has(key(x-1,y)),east=!keys.has(key(x+1,y));
  return{north,south,west,east,horizontal:north||south,vertical:west||east,outsideCount:[north,south,west,east].filter(Boolean).length};
};
const wallContext=vm.createContext({
  tacticalKey:key,
  tacticalBuildingFootprintKeySet:footprintKeys,
  tacticalBuildingPerimeterCells:(plan)=>shapeApi.tacticalBuildingPerimeterCells(plan),
  tacticalBuildingPlans:()=>activePlan?[activePlan]:[],
  tacticalBuildingPresentationBuildingIdForCover:(cover)=>cover?.buildingId||null,
  tacticalBuildingCellAt:(x,y)=>{
    if(!activePlan||!footprintKeys(activePlan).has(key(x,y)))return null;
    return{building:activePlan,perimeter:perimeterKeys(activePlan).has(key(x,y)),door:doorKeys(activePlan).has(key(x,y))};
  },
});
for(const name of ['tacticalBuildingFacadeExposure','tacticalBuildingCardinalAdjacentCells','tacticalThreeExteriorFacadePair','tacticalThreeBuildingPerimeterSeamPairs','tacticalThreeFacadeProjectedHalfSpan','tacticalThreePerimeterSeamInfillScale','tacticalThreeBuildingCornerClosureRecords']){
  vm.runInContext(functionSource(name),wallContext);
}
const wallApi=vm.runInContext(`({tacticalBuildingFacadeExposure,tacticalBuildingCardinalAdjacentCells,tacticalThreeExteriorFacadePair,tacticalThreeBuildingPerimeterSeamPairs,tacticalThreeFacadeProjectedHalfSpan,tacticalThreePerimeterSeamInfillScale,tacticalThreeBuildingCornerClosureRecords})`,wallContext);

function fixture(family,rotation=0){
  const plan={id:`qa-${family}-${rotation}`,key:'records',x:10,y:10,width:12,height:9,shapeFamily:family,shapeRotation:rotation};
  plan.footprintCells=shapeApi.tacticalBuildingFootprintCells(plan);
  plan.doors=shapeApi.tacticalBuildingDoorCells(plan);
  return plan;
}
function presentationCovers(plan){
  const doors=doorKeys(plan);
  return shapeApi.tacticalBuildingPerimeterCells(plan).filter(c=>!doors.has(key(c.x,c.y))).map((cell,index)=>{
    const exposure=facadeExposure(plan,cell);
    const corner=exposure.horizontal&&exposure.vertical;
    // Match the runtime rule that corner cells cannot be windows.
    const part=!corner&&index%5===2?'window':'wall';
    const horizontal=shapeApi.tacticalBuildingFacadeOrientation(plan,cell).horizontal;
    return{x:cell.x,y:cell.y,hp:20,revealed:true,buildingId:plan.id,buildingPart:part,visual:`building-${part}-brick-${horizontal?'ew':'ns'}`};
  });
}

const families=['I','O','T','L','J','S','Z'];

test('every intact tetromino wall turn receives a perpendicular corner-return record',()=>{
  for(const family of families)for(let rotation=0;rotation<4;rotation++){
    const plan=fixture(family,rotation);activePlan=plan;
    const covers=presentationCovers(plan),closures=wallApi.tacticalThreeBuildingCornerClosureRecords({mission:{},presentationCovers:covers,discoveredBuildingIds:new Set([plan.id])});
    const actual=new Set(closures.map(c=>key(c.cell.x,c.cell.y)));
    const coversByKey=new Map(covers.map(c=>[key(c.x,c.y),c]));
    const expected=shapeApi.tacticalBuildingPerimeterCells(plan).filter(cell=>{
      const cover=coversByKey.get(key(cell.x,cell.y));
      const exposure=facadeExposure(plan,cell);
      return cover?.buildingPart==='wall'&&exposure.horizontal&&exposure.vertical;
    });
    assert.ok(expected.length>0,`${family} rotation ${rotation} has wall turns`);
    assert.equal(actual.size,expected.length,`${family} rotation ${rotation} closure count`);
    for(const cell of expected)assert.ok(actual.has(key(cell.x,cell.y)),`${family} rotation ${rotation} closes ${key(cell.x,cell.y)}`);
  }
});

test('doors, window apertures and revealed breaches never receive corner-return geometry',()=>{
  const plan=fixture('L',1);activePlan=plan;
  let covers=presentationCovers(plan);
  const corner=shapeApi.tacticalBuildingPerimeterCells(plan).find(cell=>{
    const exposure=facadeExposure(plan,cell);return exposure.horizontal&&exposure.vertical&&covers.some(c=>c.x===cell.x&&c.y===cell.y&&c.buildingPart==='wall');
  });
  assert.ok(corner,'corner fixture');
  const discovered=new Set([plan.id]);
  const baseline=wallApi.tacticalThreeBuildingCornerClosureRecords({mission:{},presentationCovers:covers,discoveredBuildingIds:discovered});
  assert.ok(baseline.some(c=>c.cell.x===corner.x&&c.cell.y===corner.y),'intact wall closes');
  covers=covers.map(c=>c.x===corner.x&&c.y===corner.y?{...c,buildingPart:'breach',visual:'breach-rubble',hp:0}:c);
  const breached=wallApi.tacticalThreeBuildingCornerClosureRecords({mission:{},presentationCovers:covers,discoveredBuildingIds:discovered});
  assert.ok(!breached.some(c=>c.cell.x===corner.x&&c.cell.y===corner.y),'breach stays open');
  const windowCornerCovers=presentationCovers(plan).map(c=>c.x===corner.x&&c.y===corner.y?{...c,buildingPart:'window',visual:'building-window-brick-ew'}:c);
  const windowed=wallApi.tacticalThreeBuildingCornerClosureRecords({mission:{},presentationCovers:windowCornerCovers,discoveredBuildingIds:discovered});
  assert.ok(!windowed.some(c=>c.cell.x===corner.x&&c.cell.y===corner.y),'window aperture stays open');
  for(const door of plan.doors)assert.ok(!baseline.some(c=>c.cell.x===door.x&&c.cell.y===door.y),'door stays open');
});

test('explicit wall seams follow authoritative four-way footprint adjacency instead of hex-only diagonals',()=>{
  for(const family of ['T','L','J','S','Z'])for(let rotation=0;rotation<4;rotation++){
    const plan=fixture(family,rotation);activePlan=plan;
    const covers=presentationCovers(plan),seams=wallApi.tacticalThreeBuildingPerimeterSeamPairs({mission:{},presentationCovers:covers,discoveredBuildingIds:new Set([plan.id])});
    const validCells=footprintKeys(plan);
    for(const seam of seams){
      const dx=Math.abs(Number(seam.a.x)-Number(seam.b.x)),dy=Math.abs(Number(seam.a.y)-Number(seam.b.y));
      assert.equal(dx+dy,1,`${family} rotation ${rotation} seam is cardinal`);
      assert.ok(validCells.has(key(seam.a.x,seam.a.y))&&validCells.has(key(seam.b.x,seam.b.y)),`${family} seam stays on footprint`);
    }
  }
});

test('corner-return renderer creates a full-height perpendicular wall, not a decorative pillar',()=>{
  const buildSource=functionSource('tacticalThreeBuildCornerClosures');
  assert.match(buildSource,/returnWall\.scale\.set\(1\.42,\s*3\.18,\s*0\.94\)/);
  assert.match(buildSource,/returnWall\.rotation\.y\s*=\s*Math\.PI\s*\/\s*2/);
  assert.match(buildSource,/aegisBuildingCornerReturn\s*=\s*true/);
  assert.match(buildSource,/aegisBuildingCornerMicroGapOverlap\s*=\s*true/);
});

test('fallback and persistent Three.js renderers both build and report footprint corner returns',()=>{
  assert.ok((source.match(/tacticalThreeBuildCornerClosures\(\{/g)||[]).length>=3,'helper plus both renderer calls');
  assert.ok((source.match(/aegisBuildingCornerClosureCount/g)||[]).length>=2,'both renderer datasets');
  assert.ok(source.includes('PROCEDURAL_BUILDING_TETROMINO_CORNER_CLOSURE_HOTFIX = true'));
  assert.ok(source.includes('CURRENT_SAVE_FORMAT_VERSION=4'));
});


test('projection-aware perimeter seam infill overlaps staggered-row facade endpoints without global wall inflation',()=>{
  const a={visual:'building-wall-brick-ew'},b={visual:'building-window-brick-ew'},vertical={visual:'building-wall-brick-ns'};
  const dx=Math.sqrt(3)*0.5,dz=Math.sqrt(3)*0.755,distance=Math.hypot(dx,dz);
  const ew=wallApi.tacticalThreeFacadeProjectedHalfSpan(a,dx,dz),ns=wallApi.tacticalThreeFacadeProjectedHalfSpan(vertical,dx,dz);
  assert.ok(Math.abs(ew-ns)>0.02,'orientation changes projected endpoint coverage');
  const scale=wallApi.tacticalThreePerimeterSeamInfillScale(distance,a,b,dx,dz);
  const filledLength=scale*0.92;
  assert.ok(filledLength>Math.max(0,distance-ew-wallApi.tacticalThreeFacadeProjectedHalfSpan(b,-dx,-dz)),'controlled overlap exceeds exact uncovered span');
  assert.ok(filledLength<distance,'micro-gap infill stays local to the seam rather than replacing the wall run');
  const buildSource=functionSource('tacticalThreeBuildExplicitPerimeterSeams');
  assert.match(buildSource,/tacticalThreePerimeterSeamInfillScale\(distance, seam\.a, seam\.b, dx, dz\)/);
  assert.match(buildSource,/aegisBuildingPerimeterMicroGapClosure\s*=\s*true/);
});

test('projection-aware seam coverage closes every generated tetromino perimeter pair through all rotations',()=>{
  const WORLD_X=Math.sqrt(3),WORLD_Z=Math.sqrt(3)*0.755;
  const world=(x,y)=>({x:(x+(Math.abs(y)%2?0.5:0))*WORLD_X,z:y*WORLD_Z});
  for(const family of families)for(let rotation=0;rotation<4;rotation++){
    const plan=fixture(family,rotation);activePlan=plan;
    const covers=presentationCovers(plan);
    const seams=wallApi.tacticalThreeBuildingPerimeterSeamPairs({mission:{},presentationCovers:covers,discoveredBuildingIds:new Set([plan.id])});
    assert.ok(seams.length>0,`${family} rotation ${rotation} has perimeter seams`);
    for(const seam of seams){
      const aw=world(seam.a.x,seam.a.y),bw=world(seam.b.x,seam.b.y),dx=bw.x-aw.x,dz=bw.z-aw.z,distance=Math.hypot(dx,dz);
      const spanA=wallApi.tacticalThreeFacadeProjectedHalfSpan(seam.a,dx,dz),spanB=wallApi.tacticalThreeFacadeProjectedHalfSpan(seam.b,-dx,-dz);
      const exactGap=Math.max(0,distance-spanA-spanB);
      const fill=wallApi.tacticalThreePerimeterSeamInfillScale(distance,seam.a,seam.b,dx,dz)*0.92;
      assert.ok(fill+1e-9>=exactGap,`${family} rotation ${rotation} ${key(seam.a.x,seam.a.y)}→${key(seam.b.x,seam.b.y)} covers geometric gap`);
      if(exactGap>0.02)assert.ok(fill>=exactGap+0.10,`${family} rotation ${rotation} seam keeps overlap margin`);
    }
  }
});


test('staggered-row tetromino turns stay on the general structural connector path instead of being suppressed as cardinal facade seams',()=>{
  const hexNeighbors=(x,y)=>{
    const odd=y&1;
    const deltas=odd?[[1,0],[-1,0],[1,-1],[0,-1],[1,1],[0,1]]:[[1,0],[-1,0],[0,-1],[-1,-1],[0,1],[-1,1]];
    return deltas.map(([dx,dy])=>({x:x+dx,y:y+dy}));
  };
  let staggeredPairs=0;
  for(const family of ['T','L','J','S','Z'])for(let rotation=0;rotation<4;rotation++){
    const plan=fixture(family,rotation);activePlan=plan;
    const covers=presentationCovers(plan),byKey=new Map(covers.map(c=>[key(c.x,c.y),c]));
    for(const a of covers){
      for(const cell of hexNeighbors(a.x,a.y)){
        const b=byKey.get(key(cell.x,cell.y));
        if(!b)continue;
        if(key(a.x,a.y)>=key(b.x,b.y))continue;
        const cardinal=wallApi.tacticalBuildingCardinalAdjacentCells(a,b);
        if(cardinal)continue;
        staggeredPairs+=1;
        assert.equal(wallApi.tacticalThreeExteriorFacadePair(a,b,{}),false,`${family} rotation ${rotation} staggered pair ${key(a.x,a.y)}→${key(b.x,b.y)} must remain connector-eligible`);
      }
    }
  }
  assert.ok(staggeredPairs>0,'concave tetromino fixtures expose staggered non-cardinal wall neighbors');
  assert.match(source,/tacticalConnectedStructuralWalls\(c,structuralByCell,props\.mission\)\.filter\(neighbor=>!tacticalThreeExteriorFacadePair\(c,neighbor,props\.mission\)\)/);
  assert.match(source,/tacticalConnectedStructuralWalls\(c,structuralByCell,mission\)\.filter\(neighbor=>!tacticalThreeExteriorFacadePair\(c,neighbor,mission\)\)/);
});

test('explicit perimeter seams remain cardinal while true door cells stay open',()=>{
  const plan=fixture('S',0);activePlan=plan;
  const covers=presentationCovers(plan),byKey=new Map(covers.map(c=>[key(c.x,c.y),c]));
  const seams=wallApi.tacticalThreeBuildingPerimeterSeamPairs({mission:{},presentationCovers:covers,discoveredBuildingIds:new Set([plan.id])});
  assert.ok(seams.length>0,'S footprint has explicit seams');
  for(const seam of seams)assert.equal(wallApi.tacticalBuildingCardinalAdjacentCells(seam.a,seam.b),true,'explicit seam is cardinal');
  for(const door of plan.doors){
    const fakeDoorCover={x:door.x,y:door.y,hp:20,revealed:true,buildingId:plan.id,buildingPart:'wall',visual:'building-wall-brick-ew'};
    const adjacent=shapeApi.tacticalBuildingPerimeterCells(plan).map(c=>byKey.get(key(c.x,c.y))).find(Boolean);
    assert.equal(wallApi.tacticalThreeExteriorFacadePair(fakeDoorCover,adjacent,{}),false,'door does not become a facade seam');
  }
  assert.ok(source.includes('PROCEDURAL_BUILDING_STAGGERED_TURN_CONNECTOR_HOTFIX = true'));
});
