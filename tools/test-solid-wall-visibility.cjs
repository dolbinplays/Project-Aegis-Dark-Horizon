const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const context=vm.createContext({tacticalKey:(x,y)=>`${x},${y}`,tacticalLightingForMission:()=>({phase:'day'}),tacticalLightSources:()=>[],tacticalSmokeDensityForCover:()=>0,tacticalAlienBeaconShieldBlocks:()=>false,
  TACTICAL_DIRECTIONS:[{key:'E',vx:1,vy:0},{key:'W',vx:-1,vy:0}]});
for(const name of ['tacticalOffsetToCube','tacticalCubeToOffset','tacticalCubeRound','tacticalDistance','lineCells','tacticalHexPixel','isInVisionCone','tacticalVisionRangeForCell','tacticalSmokeObscurationAlongPath','tacticalCoverFootprintCells','adjacentToCover','tacticalCoverIsWindow','tacticalCoverAllowsVision','tacticalCoverIsSolidBuildingBarrier','tacticalVisibilityContext','hasLineOfSight','tacticalBreachCover','tacticalVisibilityCoverCacheKey']){
  const a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+10);assert.ok(a>=0,name);vm.runInContext(source.slice(a,b),context);
}
const wall={id:'wall',x:10,y:10,hp:80,maxHp:80,kind:'hard',block:1,structural:true,buildingId:'house',buildingPart:'wall',visual:'building-wall-brick-ew'};
const unit=(x,facing='E',team='human',y=10)=>({x,y,facing,team,hp:40});
const sees=(from,to,covers)=>context.hasLineOfSight(from,to.x,to.y,covers);
test('Adjacent solid walls block from either side for humans, aliens and civilians, including target adjacency',()=>{
  for(const team of ['human','alien','civilian'])for(const [start,end] of [[9,11],[9,14],[6,11],[6,14]]){
    assert.equal(sees(unit(start,'E',team),unit(end),[wall]),false);
    assert.equal(sees(unit(end,'W',team),unit(start),[wall]),false);
  }
});
test('Partitions and legacy visual-only walls block; the wall itself remains discoverable',()=>{
  for(const change of [{buildingPart:'partition',visual:'building-partition-brick-ns'},{buildingPart:undefined,structural:undefined},{buildingPart:'door',visual:'building-door-steel'}]){
    const cover={...wall,...change};assert.equal(sees(unit(9),unit(11),[cover]),false);
    assert.equal(sees(unit(9),unit(10),[cover]),true);
  }
});
test('Windows, generated door gaps and actual structural breaches allow aligned sight without bypassing other walls',()=>{
  const window={...wall,buildingPart:'window',visual:'building-window-brick-ew'};
  const breach=context.tacticalBreachCover(wall,100);
  assert.equal(breach.buildingPart,'breach');
  for(const covers of [[],[window],[breach],[{...wall,hp:0}]]){
    assert.equal(sees(unit(6),unit(14),covers),true);
    assert.equal(sees(unit(14,'W'),unit(6),covers),true);
    assert.equal(sees(unit(6),unit(14),[...covers,{...wall,id:'second',x:12}]),false);
  }
});
test('A nearby opening does not grant sight through the neighboring wall and facing still matters',()=>{
  const window={...wall,id:'window',y:11,buildingPart:'window',visual:'building-window-brick-ew'};
  assert.equal(sees(unit(9),unit(11),[wall,window]),false);
  assert.equal(sees(unit(9,'W'),unit(11),[]),false);
  assert.equal(sees(unit(9,'E','human',11),unit(11,'E','human',11),[wall,window]),true);
});
test('Low cover keeps its existing adjacency rule; reload and cover cache keys reflect structural transitions',()=>{
  const crate={...wall,buildingPart:'furnishing',visual:'interior-crate'};
  assert.equal(sees(unit(9),unit(11),[crate]),true);
  assert.equal(sees(unit(6),unit(14),[crate]),false);
  assert.equal(sees(unit(9),unit(11),JSON.parse(JSON.stringify([wall]))),false);
  assert.notEqual(context.tacticalVisibilityCoverCacheKey([wall]),context.tacticalVisibilityCoverCacheKey([{...wall,buildingPart:'window'}]));
  assert.notEqual(context.tacticalVisibilityCoverCacheKey([wall]),context.tacticalVisibilityCoverCacheKey([{...wall,breached:true}]));
});
