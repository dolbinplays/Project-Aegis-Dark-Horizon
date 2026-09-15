const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const start=source.indexOf('const TACTICAL_BUILDING_ARCHETYPES=');
const end=source.indexOf('function tacticalStreetRoadDirection',start);
assert.ok(start>=0&&end>start,'tetromino building source block');
const context=vm.createContext({
  TACTICAL_GRID_SIZE:64,
  clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),
  tacticalKey:(x,y)=>`${x},${y}`,
  tacticalDistance:(a,b)=>Math.max(Math.abs(Number(a.x)-Number(b.x)),Math.abs(Number(a.y)-Number(b.y))),
  tacticalBiomeForMission:()=>({key:'city'}),
  tacticalMapProfileForMission:()=>({key:'medium',size:64,structureBonus:0}),
  tacticalSeed:(mission={})=>Number(mission.seed)||9417,
  tacticalFieldFeature:()=>null,
});
vm.runInContext(source.slice(start,end),context);
// Lexical consts stay inside the VM realm; surface only the API required by these tests.
const api=vm.runInContext(`({
  families:TACTICAL_BUILDING_TETROMINO_ORDER.slice(),
  defs:JSON.parse(JSON.stringify(TACTICAL_BUILDING_TETROMINO_FAMILIES)),
  legacyMissionIds:TACTICAL_LEGACY_RECTANGULAR_BUILDING_MISSION_IDS,
  tacticalBuildingShapeModuleCells,tacticalBuildingFootprintCells,tacticalBuildingPerimeterCells,tacticalBuildingInteriorCells,tacticalBuildingDoorCells,tacticalBuildingPlans,tacticalBuildingFootprintKeySet
})`,context);
const fixture=(family,rotation=0)=>{const b={id:`qa-${family}-${rotation}`,key:'records',x:10,y:10,width:12,height:9,shapeFamily:family,shapeRotation:rotation};b.footprintCells=api.tacticalBuildingFootprintCells(b);b.doors=api.tacticalBuildingDoorCells(b);return b;};
const connected=cells=>{const keys=new Set(cells.map(c=>`${c.x},${c.y}`)),seen=new Set([`${cells[0].x},${cells[0].y}`]),q=[cells[0]];while(q.length){const c=q.shift();for(const [dx,dy] of [[1,0],[-1,0],[0,1],[0,-1]]){const k=`${c.x+dx},${c.y+dy}`;if(keys.has(k)&&!seen.has(k)){seen.add(k);q.push({x:c.x+dx,y:c.y+dy});}}}return seen.size===cells.length;};

test('all seven tetromino families contain four connected modules through every rotation',()=>{
  assert.deepEqual(JSON.parse(JSON.stringify(api.families)),['I','O','T','L','J','S','Z']);
  for(const family of api.families){assert.equal(api.defs[family].length,4);for(let rotation=0;rotation<4;rotation++){const cells=api.tacticalBuildingShapeModuleCells(family,rotation);assert.equal(cells.length,4);assert.equal(new Set(cells.map(c=>`${c.x},${c.y}`)).size,4);assert.ok(connected(cells),`${family} rotation ${rotation}`);}}
});

test('scaled footprints stay connected and concave families leave real open recesses',()=>{
  for(const family of api.families){for(let rotation=0;rotation<4;rotation++){const b=fixture(family,rotation),cells=api.tacticalBuildingFootprintCells(b);assert.ok(cells.length>0);assert.ok(connected(cells),`${family} rotation ${rotation} scaled`);assert.ok(cells.every(c=>c.x>=b.x&&c.x<b.x+b.width&&c.y>=b.y&&c.y<b.y+b.height));if(['T','L','J','S','Z'].includes(family))assert.ok(cells.length<b.width*b.height,`${family} should preserve a recess`);}}
});

test('doors use perimeter cells with an adjacent usable interior',()=>{
  for(const family of api.families){const b=fixture(family,3),perimeter=new Set(api.tacticalBuildingPerimeterCells(b).map(c=>`${c.x},${c.y}`)),interior=new Set(api.tacticalBuildingInteriorCells(b).map(c=>`${c.x},${c.y}`));assert.ok(b.doors.length>=1, family);for(const door of b.doors){assert.ok(perimeter.has(`${door.x},${door.y}`),`${family} perimeter door`);assert.ok([[1,0],[-1,0],[0,1],[0,-1]].some(([dx,dy])=>interior.has(`${door.x+dx},${door.y+dy}`)),`${family} door leads inside`);}}
});

test('mission plans are deterministic and carry shape authority without changing legacy bounds',()=>{
  const mission={id:'qa-tetromino',kind:'Urban Scout Raid',region:'North America',tacticalMapTier:'medium',seed:9417};
  const first=api.tacticalBuildingPlans(mission),snapshot=JSON.parse(JSON.stringify(first));
  // Clear through a new cache key while preserving equivalent shape selection inputs.
  const second=api.tacticalBuildingPlans({...mission,id:'qa-tetromino-copy'});
  assert.ok(first.length>0);assert.equal(first.length,second.length);
  first.forEach((plan,index)=>{assert.ok(api.families.includes(plan.shapeFamily));assert.ok(Number.isInteger(plan.shapeRotation));assert.equal(plan.width,snapshot[index].width);assert.equal(plan.height,snapshot[index].height);assert.deepEqual(JSON.parse(JSON.stringify(plan.footprintCells)),snapshot[index].footprintCells);assert.deepEqual(JSON.parse(JSON.stringify(plan.footprintCells)),JSON.parse(JSON.stringify(second[index].footprintCells)));assert.deepEqual(JSON.parse(JSON.stringify(plan.doors)),JSON.parse(JSON.stringify(second[index].doors)));});
});

test('seed sweep reaches every tetromino family in every rotation for generated plans',()=>{
  const seen=new Set();
  for(let seed=0;seed<56;seed++){
    const mission={id:`qa-family-sweep-${seed}`,kind:'Urban Scout Raid',region:'North America',tacticalMapTier:'medium',seed};
    for(const plan of api.tacticalBuildingPlans(mission))seen.add(`${plan.shapeFamily}:${plan.shapeRotation}`);
  }
  for(const family of ['I','O','T','L','J','S','Z'])for(let rotation=0;rotation<4;rotation++)assert.ok(seen.has(`${family}:${rotation}`),`${family} rotation ${rotation}`);
});

test('pre-patch live tactical missions can retain legacy rectangular building footprints',()=>{
  const mission={id:'qa-legacy-rectangle',kind:'Town Abduction',region:'Europe',tacticalMapTier:'small',seed:7421};
  api.legacyMissionIds.add(mission.id);
  const plans=api.tacticalBuildingPlans(mission);
  assert.ok(plans.length>0);
  for(const plan of plans){
    assert.equal(plan.shapeFamily,undefined);
    assert.equal(plan.footprintCells.length,plan.width*plan.height);
    assert.deepEqual(JSON.parse(JSON.stringify(plan.doors[0])),{x:plan.x+Math.floor(plan.width/2),y:plan.y+plan.height-1});
  }
});

test('rendering, egress and perimeter seams reference authoritative footprint helpers',()=>{
  for(const [needle,label] of [
    ['tacticalBuildingFootprintCells(building).forEach','roof footprint'],
    ['tacticalBuildingPerimeterCells(building).map','roof perimeter'],
    ['tacticalBuildingPerimeterCells(plan)','perimeter seams'],
    ['for(const perimeterCell of tacticalBuildingPerimeterCells(building))','building egress'],
    ['tacticalBuildingInteriorCells(building)','interior civilian placement'],
  ])assert.ok(source.includes(needle),label);
  assert.ok(source.includes('TACTICAL_TETROMINO_PROCEDURAL_BUILDING_FOOTPRINTS_PATCH=true'));
  assert.ok(source.includes('CURRENT_SAVE_FORMAT_VERSION=4'));
});
