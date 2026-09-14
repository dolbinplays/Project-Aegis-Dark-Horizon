const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
function fixture(){
  let calls=0;const context=vm.createContext({tacticalHumanIsDowned:u=>u.downed||u.unconscious,tacticalGridSizeFrom:(units,covers,mission)=>mission.gridSize||48,tacticalLightingForMission:m=>({phase:m.phase||'day',location:m.location,clock:m.tacticalClock}),tacticalComputeInteriorVisibleCellSet:()=>{calls++;return new Set(['10,10']);}});
  const a=source.indexOf('function tacticalMemoizedVisibleCellSet('),b=source.indexOf('tacticalVisibleCellSet=tacticalMemoizedVisibleCellSet;',a);
  vm.runInContext(source.slice(a,b),context);
  const units=[{id:'soldier',team:'human',hp:40,x:8,y:8,facing:'E',flashlightOn:false}],covers=[{id:'wall',x:10,y:8,hp:80,kind:'hard',buildingPart:'wall'}],mission={gridSize:48};
  return {context,units,covers,mission,run:()=>context.tacticalMemoizedVisibleCellSet(units,covers,mission),calls:()=>calls};
}
test('Unchanged and JSON-restored snapshots reuse sight calculation; returned sets are detached',()=>{
  const f=fixture();f.run().clear();assert.deepEqual([...f.run()],['10,10']);assert.equal(f.calls(),1);
  f.context.tacticalMemoizedVisibleCellSet(...JSON.parse(JSON.stringify([f.units,f.covers,f.mission]))).add('corruption');assert.equal(f.calls(),1);assert.equal(f.run().has('corruption'),false);
});
test('In-place position, facing, flashlight, eligibility, lighting and map changes invalidate',()=>{
  for(const mutate of [f=>f.units[0].x++,f=>f.units[0].y++,f=>f.units[0].facing='W',f=>f.units[0].flashlightOn=true,f=>f.mission.phase='night',f=>f.mission.gridSize=64,f=>f.mission.tacticalClock={minute:0},f=>f.mission.location={lat:60,lon:20}]){
    const f=fixture();f.run();mutate(f);f.run();assert.equal(f.calls(),2);
  }
  for(const state of [{hp:0},{downed:true},{unconscious:true},{team:'alien'}]){const f=fixture();f.run();Object.assign(f.units[0],state);assert.equal(f.run().size,0);}
});
test('All cover state participates, including dead power controls, smoke, breached walls and vehicle geometry',()=>{
  for(const change of [{hp:0},{buildingPart:'window'},{breached:true},{lightActive:false},{smokeDensity:3},{powerControl:true,powerCircuitId:'house',hp:0},{footprintCells:[{x:9,y:8}]},{roadRotation:1},{vehicleBodyAnchor:{x:11,y:8}}]){
    const f=fixture();f.run();Object.assign(f.covers[0],change);f.run();assert.equal(f.calls(),2);
  }
});
test('One retained snapshot is replaced on state changes and oversized keys are not retained',()=>{
  const f=fixture();f.run();f.units[0].x++;f.run();f.units[0].x--;f.run();assert.equal(f.calls(),3);
  f.covers[0].oversized='x'.repeat(1000001);f.run();assert.equal(f.context.tacticalMemoizedVisibleCellSet.cache,null);f.run();assert.equal(f.calls(),5);
});
