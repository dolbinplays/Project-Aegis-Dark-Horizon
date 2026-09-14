const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const {test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const context=vm.createContext({tacticalHumanIsDowned:unit=>Boolean(unit.downed),tacticalFireTeamLeaderForUnit:(unit,units)=>units.find(u=>u.fireTeamId===unit.fireTeamId&&u.fireTeamRole==='leader'),React:{createElement:(type,props,...children)=>({type,props:props||{},children})}});
for(const name of ['tacticalPhysioSelectionTarget','missionReportDetailSections','MissionReportDetails']){
  const start=source.indexOf('function '+name+'('),end=source.indexOf('\nfunction ',start+10);
  vm.runInContext(source.slice(start,end),context);
}
const humans=[{id:'lead',team:'human',hp:40,fireTeamId:'a',fireTeamRole:'leader'},{id:'support',team:'human',hp:30,fireTeamId:'a'},{id:'down',team:'human',hp:1,downed:true,fireTeamId:'a'}];
test('Manual vitals select the exact soldier; Hybrid selects the team leader',()=>{
  assert.equal(context.tacticalPhysioSelectionTarget(humans,'support').id,'support');
  assert.equal(context.tacticalPhysioSelectionTarget(humans,'support',{hybrid:true}).id,'lead');
});
test('Downed soldiers can be inspected without a drag action; non-field soldiers cannot be selected',()=>{
  assert.equal(context.tacticalPhysioSelectionTarget(humans,'down',{hybrid:true}).id,'down');
  for(const override of [{hp:0},{alive:false},{extracted:true},{casualtyExtracted:true},{rescued:true},{team:'alien'}]){
    assert.equal(context.tacticalPhysioSelectionTarget([{...humans[0],...override}],'lead'),null);
  }
  assert.equal(context.tacticalPhysioSelectionTarget(humans,'missing'),null);
});
test('Playback/movement/terminal gating overrides even an otherwise selectable living soldier',()=>{
  assert.equal(context.tacticalPhysioSelectionTarget(humans,'support',{blocked:true}),null);
  assert.ok(source.includes('blocked:Boolean(aiPlayback||battleResolved||turn!=="human"||movingUnit)'));
});
test('New report sections survive JSON save/reload, omit empty entries, and do not mutate stored records',()=>{
  const report={summary:'Original summary.',sections:[{title:'Objectives and outcome',items:['Failure',' 2/3 rescued ','']},{title:'Rewards and recovery',items:['Reward: 80k']},{title:'Empty',items:[]}]};
  const before=JSON.stringify(report),sections=context.missionReportDetailSections(JSON.parse(before));
  assert.equal(sections.length,2);assert.equal(sections[0].items[1],'2/3 rescued');assert.equal(JSON.stringify(report),before);
  const tree=context.MissionReportDetails({report});assert.equal(tree.props['data-aegis-mission-report-sections'],'true');
  assert.equal(tree.children[0][0].children[1].type,'ul');
});
test('Legacy reports preserve every summary character apart from whitespace while becoming itemized',()=>{
  const summary='SUCCESS: Urban Rescue. Duration: 2.5 minutes. Reward: 80k. Casualties: Lt. Smith wounded. Recovered equipment: Rifle x2.';
  const sections=context.missionReportDetailSections({summary});
  assert.equal(sections[0].items.join(' '),summary);assert.ok(sections[0].items.length>1);
  assert.equal(context.missionReportDetailSections({}).length,0);
});
