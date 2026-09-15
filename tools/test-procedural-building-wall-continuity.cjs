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
for(const name of ['tacticalBuildingFacadeExposure','tacticalThreeExteriorFacadePair','tacticalThreeBuildingPerimeterSeamPairs','tacticalThreeBuildingCornerClosureRecords']){
  vm.runInContext(functionSource(name),wallContext);
}
const wallApi=vm.runInContext(`({tacticalBuildingFacadeExposure,tacticalThreeBuildingPerimeterSeamPairs,tacticalThreeBuildingCornerClosureRecords})`,wallContext);

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
  assert.match(buildSource,/returnWall\.scale\.set\(1\.2,\s*3\.15,\s*0\.9\)/);
  assert.match(buildSource,/returnWall\.rotation\.y\s*=\s*Math\.PI\s*\/\s*2/);
  assert.match(buildSource,/aegisBuildingCornerReturn\s*=\s*true/);
});

test('fallback and persistent Three.js renderers both build and report footprint corner returns',()=>{
  assert.ok((source.match(/tacticalThreeBuildCornerClosures\(\{/g)||[]).length>=3,'helper plus both renderer calls');
  assert.ok((source.match(/aegisBuildingCornerClosureCount/g)||[]).length>=2,'both renderer datasets');
  assert.ok(source.includes('PROCEDURAL_BUILDING_TETROMINO_CORNER_CLOSURE_HOTFIX = true'));
  assert.ok(source.includes('CURRENT_SAVE_FORMAT_VERSION=4'));
});
