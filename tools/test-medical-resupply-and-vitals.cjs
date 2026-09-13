const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const src=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
function declaration(name){const a=src.indexOf('function '+name+'('),b=src.indexOf('function ',a+9);assert.ok(a>=0&&b>a,name);return src.slice(a,b);}
function setup(){const ctx=vm.createContext({TACTICAL_MEDKIT_FIELD_CHARGES:4,TACTICAL_MEDIC_FIELD_CHARGES:10,normalizeGearInventory:x=>({...x}),tacticalAiAuthoritativeShotRecords:f=>f.shots||[]});
  for(const name of ['soldierMedicalCharges','soldierMedicalLoadoutLabel','changeSoldierMedkitState','refillSoldierMedkitState','campaignMedicalLoadoutAfterMission','recoverKiaMedicalSupplies','tacticalFieldMedkitCapacity','tacticalInitialMedkitCharges','tacticalPhysioVisibleUnits','tacticalPhysioFrameInjuryIds'])vm.runInContext(declaration(name),ctx);return ctx;}
test('Charges survive mission return and reload, including an empty reusable kit',()=>{
  const c=setup(),soldier={id:'a',medkit:true,medicalCharges:4};
  const after={...soldier,...c.campaignMedicalLoadoutAfterMission(soldier,{state:'Ready',medkitCharges:1,medkitOwned:true})};
  assert.equal(c.tacticalInitialMedkitCharges(JSON.parse(JSON.stringify(after))),1);
  const empty={...after,...c.campaignMedicalLoadoutAfterMission(after,{state:'Ready',medkitCharges:0,medkitOwned:true})};
  assert.equal(empty.medkit,true);assert.equal(c.tacticalInitialMedkitCharges(empty),0);
  assert.equal(c.tacticalInitialMedkitCharges({medkit:true,specialization:'Medic'}),10,'Legacy issued Medic kit retains its capacity');
  assert.equal(c.tacticalInitialMedkitCharges(empty,2),2,'Live continuation remains authoritative');
});
test('Return/reissue/refill conserves every charge and reuses the empty kit',()=>{
  const c=setup(),soldier={id:'a',medkit:true,medicalCharges:1};
  const returned=c.changeSoldierMedkitState(soldier,{Medkit:0,'Medical Supplies':2},false);
  assert.equal(returned.inventory['Empty Medkit'],1);assert.equal(returned.inventory['Medical Supplies'],3);
  const issued=c.changeSoldierMedkitState(returned.soldier,returned.inventory,true);
  assert.equal(issued.soldier.medicalCharges,0);assert.equal(issued.inventory['Empty Medkit'],0);
  const refill=c.refillSoldierMedkitState(issued.soldier,issued.inventory);
  assert.equal(refill.loaded,3);assert.equal(refill.soldier.medicalCharges,3);assert.equal(refill.inventory['Medical Supplies'],0);
  assert.equal(c.refillSoldierMedkitState(refill.soldier,refill.inventory).ok,false);
});
test('Purchased kits contain four charges and a Medic fills to ten using six local supplies',()=>{
  const c=setup(),issued=c.changeSoldierMedkitState({medkit:false,specialization:'Medic'},{Medkit:1,'Medical Supplies':8},true);
  assert.equal(issued.soldier.medicalCharges,4);
  const filled=c.refillSoldierMedkitState(issued.soldier,issued.inventory);
  assert.equal(filled.loaded,6);assert.equal(filled.soldier.medicalCharges,10);assert.equal(filled.inventory['Medical Supplies'],2);
  assert.equal(c.refillSoldierMedkitState(filled.soldier,filled.inventory).changed,false);
  assert.equal(c.refillSoldierMedkitState(issued.soldier,{'Medical Supplies':0}).ok,false,'Remote supplies do not participate');
});
test('Transferred kit ownership and KIA salvage cannot duplicate kits or refund spent charges',()=>{
  const c=setup(),original={id:'a',medkit:true,medicalCharges:4},recipient={id:'b',medkit:false};
  assert.equal(c.campaignMedicalLoadoutAfterMission(original,{state:'Ready',medkitCharges:0,medkitOwned:false}).medkit,false);
  assert.equal(c.campaignMedicalLoadoutAfterMission(recipient,{state:'Ready',medkitCharges:2,medkitOwned:true}).medkit,true);
  const medical=[{id:'a',medkitOwned:false,medkitCharges:0},{id:'b',medkitOwned:true,medkitCharges:2}];
  const salvage=c.recoverKiaMedicalSupplies([original,recipient],['a','b'],true,medical);
  assert.equal(salvage['Empty Medkit'],1);assert.equal(salvage['Medical Supplies'],2);
  assert.equal(Object.keys(c.recoverKiaMedicalSupplies([original,recipient],['a','b'],false,medical)).length,0);
});
test('Vitals retain pre-hit health through projectile travel and release after impact; cancellation clears holds',()=>{
  const c=setup(),timers=new Map();let now=0,nextId=0;
  Object.assign(c,{physioHeldRef:{current:{}},physioTimerRef:{current:new Map()},setPhysioHeld:x=>{c.display=x;},setTimeout:(f,ms)=>{const id=++nextId;timers.set(id,{f,at:now+ms});return id;},clearTimeout:id=>timers.delete(id)});
  for(const name of ['holdPhysioVitals','releasePhysioVitals','releasePhysioVitalsAfter'])vm.runInContext(declaration(name).split('\n')[0],c);
  const old={id:'a',team:'human',hp:40,alive:true},injured={...old,hp:1,downed:true,bleeding:true};
  c.holdPhysioVitals([old]);c.releasePhysioVitalsAfter(['a'],920);
  const advance=ms=>{now+=ms;for(const [id,timer] of [...timers])if(timer.at<=now){timers.delete(id);timer.f();}};
  advance(800);assert.equal(c.tacticalPhysioVisibleUnits([injured],c.display)[0].hp,40);
  assert.equal(c.tacticalPhysioVisibleUnits([injured],c.display)[0].downed,undefined);assert.equal(injured.hp,1,'Combat result remains authoritative');
  advance(120);assert.equal(c.tacticalPhysioVisibleUnits([injured],c.display)[0].hp,1);
  c.holdPhysioVitals([injured]);c.releasePhysioVitalsAfter(['a'],500);c.releasePhysioVitals();
  assert.equal(timers.size,0);assert.equal(Object.keys(c.display).length,0);
  assert.match(src,/releasePhysioVitalsAfter\(\[target.id\],travelMs\+Math.max\(120,reactionImpactHoldMs\)\)/);
  assert.match(src,/releasePhysioVitalsAfter\(tacticalPhysioFrameInjuryIds\(frame\)/);
});
test('Only observed hits stage vitals, excluding misses and unrelated soldiers',()=>{
  const c=setup(),ids=c.tacticalPhysioFrameInjuryIds({soldiers:[{id:'a'},{id:'b'},{id:'c'}],shots:[{toId:'a',hit:true},{toId:'b',hit:false},{toId:'c',hit:true,observable:false}]});
  assert.equal(ids.join(','),'a');
});
