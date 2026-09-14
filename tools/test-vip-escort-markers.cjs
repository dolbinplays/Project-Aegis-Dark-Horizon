const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const THREE=require('../assets/vendor/three.min.js');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const context=vm.createContext({document:{createElement:()=>({style:{},attributes:{},setAttribute(k,v){this.attributes[k]=v;}})},tacticalKey:(x,y)=>`${x},${y}`,tacticalThreePersistentClearRoot:root=>root.clear()});
for(const name of ['tacticalHumanIsDowned','tacticalHumanCombatActive','tacticalCivilianObjectiveForMission','tacticalVipMarkerPresentation','tacticalCreateVipTrackerIndicator','tacticalVipTrackerPings','tacticalThreePersistentUpdateTrackers']){
  const a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+10);vm.runInContext(source.slice(a,b),context);
}
const mission={kind:'Alien Terror Raid'},escort={id:'escort',team:'human',alive:true,hp:40},vip={id:'vip',team:'civilian',hp:18,alive:true,vipTracker:true,x:8,y:9};
const marker=(v=vip,h=escort)=>context.tacticalVipMarkerPresentation(v,[h,v]);
test('VIPs stay yellow until an actual active escort is established',()=>{
  assert.equal(marker().color,'#fbbf24');assert.equal(marker({...vip,priorityEscortId:'escort',approachedById:'escort'}).escorting,false);
  const state=marker({...vip,escortId:'escort'});assert.equal(state.color,'#22d3ee');assert.equal(state.label,'VIP — Escorting');
});
test('Panic, lost escort, dead/downed/extracted escort restore awaiting-rescue status',()=>{
  assert.equal(marker({...vip,escortId:'missing'}).escorting,false);
  assert.equal(marker({...vip,escortId:'escort',panic:true}).escorting,false);
  for(const change of [{hp:0},{alive:false},{downed:true},{unconscious:true},{extracted:true},{casualtyExtracted:true}])assert.equal(marker({...vip,escortId:'escort'},{...escort,...change}).escorting,false);
});
test('Dead or extracted VIPs have no tracker and optional civilians remain untracked',()=>{
  for(const change of [{hp:0},{alive:false},{rescued:true},{extracted:true}])assert.equal(context.tacticalVipTrackerPings([escort,{...vip,...change}],mission).length,0);
  assert.equal(context.tacticalVipTrackerPings([escort,{...vip,vipTracker:false}],mission).length,0);
  assert.equal(context.tacticalVipTrackerPings([escort,vip],{kind:'Recon'}).length,0);
});
test('Displayed frame state and JSON reload preserve status without leaking later escort state',()=>{
  const before=[escort,vip],after=JSON.parse(JSON.stringify([escort,{...vip,escortId:'escort'}]));
  assert.equal(context.tacticalVipTrackerPings(before,mission)[0].status,'awaiting-rescue');
  assert.equal(context.tacticalVipTrackerPings(after,mission)[0].status,'escorting');
  assert.equal(context.tacticalVipTrackerPings(before,mission)[0].status,'awaiting-rescue');
  const indicator=context.tacticalCreateVipTrackerIndicator(context.tacticalVipTrackerPings(after,mission)[0]);
  assert.equal(indicator.attributes['aria-label'],'VIP — Escorting');assert.match(indicator.textContent,/ESCORTING/);
});
test('Persistent 3D markers update color and accessible label without VIP movement, then reverse and disappear',()=>{
  const indicators=[],runtime={THREE,visibleSet:new Set(['8,9']),trackerRoot:new THREE.Group(),mount:{appendChild:item=>indicators.push(item)},worldFor:(x,y)=>({x,z:y})};
  const update=units=>context.tacticalThreePersistentUpdateTrackers(runtime,{units,mission});
  update([escort,vip]);const initial=runtime.trackerNodes[0];assert.equal(initial.children[0].material.color.getHexString(),'fde047');
  update([escort,{...vip,escortId:'escort'}]);const active=runtime.trackerNodes[0];assert.notEqual(active,initial);assert.equal(active.children[0].material.color.getHexString(),'67e8f9');assert.equal(active.userData.indicator.attributes['aria-label'],'VIP — Escorting');
  update([escort,{...vip,escortId:'escort'}]);assert.equal(runtime.trackerNodes[0],active,'unchanged state does not rebuild');
  update([escort,{...vip,escortId:'escort',panic:true}]);assert.equal(runtime.trackerNodes[0].children[0].material.color.getHexString(),'fde047');
  update([escort,{...vip,rescued:true}]);assert.equal(runtime.trackerNodes.length,0);
});
