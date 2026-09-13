const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const THREE=require('../assets/vendor/three.min.js');
const source=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const ctx=vm.createContext({TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE:1.5,tacticalAiCommanderScore:u=>u.score||0,tacticalDistance:(a,b)=>Math.hypot(a.x-b.x,a.y-b.y),tacticalFireTeamDesignation:i=>['Alpha','Bravo','Charlie'][i]});
for(const name of ['tacticalPhysioCaptureFormation','tacticalPhysioRoleSlot','tacticalFireTeamRoleAssignments','tacticalFireTeamCentroid','tacticalFireTeamDistanceBetween','tacticalReconcileFireTeams','tacticalVehicleHeadlightLayout','tacticalThreeAddLandVehicle','tacticalThreeAddVehicleHeadlightBeam']){
  const a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+9);assert.ok(a>=0&&b>a,name);vm.runInContext(source.slice(a,b),ctx);
}
const member=(id,team,role,slot)=>({id,team:'human',alive:true,hp:40,x:5,y:5,score:10-slot,fireTeamId:team,fireTeamDesignation:team,fireTeamRole:role,physioFormation:{teamId:team,label:team,slot}});
test('Headlight beams follow the existing night brightness control',()=>{
  const a=source.indexOf('function tacticalThreePersistentApplyNightPresentation('),b=source.indexOf('\nfunction ',a+9);
  ctx.tacticalThreeNightPresentationProfile=()=>({localLightScale:2,ambientScale:1,keyScale:1});
  ctx.tacticalThreeIsoNightBrightnessPresentation=p=>p;
  ctx.tacticalThreePersistentApplyIsoNightMaterialLift=()=>{};
  vm.runInContext(source.slice(a,b),ctx);
  const scene=new THREE.Scene(),group=new THREE.Group();scene.add(group);
  const light=ctx.tacticalThreeAddVehicleHeadlightBeam(THREE,group,{visual:'vehicle-sedan'});
  ctx.tacticalThreePersistentApplyNightPresentation({scene,tacticalLighting:{phase:'night',ambient:.1,key:.1}},{});
  assert.equal(light.intensity,2.6);
});
test('Actual singleton absorption moves the survivor once and retains fallen cards in the former team',()=>{
  const fallen={...member('fallen','Alpha','leader',0),alive:false,hp:0},lone=member('lone','Alpha','left',1);
  const receiving=[member('b0','Bravo','leader',0),member('b1','Bravo','left',1),member('b2','Bravo','right',2)];
  const result=ctx.tacticalReconcileFireTeams([fallen,lone,...receiving],{},2),survivor=result.find(u=>u.id==='lone');
  assert.equal(survivor.fireTeamId,'Bravo');assert.equal(survivor.physioFormation.teamId,'Bravo');assert.equal(survivor.physioFormation.slot,3);
  assert.equal(result.find(u=>u.id==='fallen').physioFormation.teamId,'Alpha');
  for(const old of receiving)assert.equal(result.find(u=>u.id===old.id).physioFormation.slot,old.physioFormation.slot);
  const restored=ctx.tacticalPhysioCaptureFormation(JSON.parse(JSON.stringify(result)).reverse());
  assert.equal(restored.find(u=>u.id==='lone').physioFormation.slot,3);
});
test('Casualty-filled receiving panels retain every member in unique cells beyond the diamond',()=>{
  const team=[member('a','Bravo','leader',0),member('b','Bravo','left',1),member('c','Bravo','right',2),{...member('dead','Bravo','rear',3),alive:false,hp:0}];
  const entrant={...member('new','Alpha','left',1),fireTeamId:'Bravo',fireTeamDesignation:'Bravo'};
  const result=ctx.tacticalPhysioCaptureFormation([...team,entrant]);
  assert.equal(result.find(u=>u.id==='new').physioFormation.slot,4);
  assert.equal(new Set(result.map(u=>JSON.stringify(ctx.tacticalPhysioRoleSlot(u)))).size,5);
  assert.equal(result.filter(u=>u.physioFormation.teamId==='Bravo').length,5);
  const a=source.indexOf('function TacticalFireTeamPhysiologicalHud'),b=source.indexOf('\nfunction ',a+9);
  assert.ok(!source.slice(a,b).includes('.slice(0,4)'));
});
test('Repeated transfers and stale duplicate slots are reconciled without duplicates',()=>{
  let result=ctx.tacticalPhysioCaptureFormation([member('a','Bravo','leader',0),member('b','Bravo','leader',0)]);
  assert.equal(new Set(result.map(u=>u.physioFormation.slot)).size,2);
  result=ctx.tacticalPhysioCaptureFormation(result.map(u=>u.id==='b'?{...u,fireTeamId:'Charlie',fireTeamDesignation:'Charlie'}:u));
  assert.equal(result.find(u=>u.id==='b').physioFormation.teamId,'Charlie');
  assert.equal(result.find(u=>u.id==='a').physioFormation.slot,0);
});
for(const visual of ['vehicle-sedan','vehicle-van','vehicle-utility','vehicle-bus'])test(visual+' lamps and beam attach to the narrow front at every heading',()=>{
  const geoCache={wreck:new THREE.BoxGeometry(1,.38,.66),wall:new THREE.BoxGeometry(.92,.62,.54),crate:new THREE.BoxGeometry(.64,.45,.64)};
  const group=new THREE.Group(),cover={visual};
  ctx.tacticalThreeAddLandVehicle(THREE,group,cover,geoCache,()=>new THREE.MeshStandardMaterial(),{},true);
  const light=ctx.tacticalThreeAddVehicleHeadlightBeam(THREE,group,cover),layout=ctx.tacticalVehicleHeadlightLayout(cover),lamps=group.children.filter(o=>o.name==='vehicle-headlamp');
  assert.equal(lamps.length,2);assert.ok(layout.length>layout.width);
  for(const lamp of lamps){assert.ok(lamp.position.x>layout.length/2);assert.ok(Math.abs(lamp.position.z)<layout.width/2);}
  for(const heading of [0,Math.PI/3,Math.PI/2,Math.PI,4*Math.PI/3,3*Math.PI/2]){
    group.rotation.y=heading;group.position.set(7,.18,9);group.updateMatrixWorld(true);
    const forward=new THREE.Vector3(1,0,0).transformDirection(group.matrixWorld),lamp=lamps[0].getWorldPosition(new THREE.Vector3()).sub(group.position);
    assert.ok(lamp.dot(forward)>layout.length/2);
    const beam=light.target.getWorldPosition(new THREE.Vector3()).sub(light.getWorldPosition(new THREE.Vector3())).normalize();
    assert.ok(beam.dot(forward)>.99);
  }
  group.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});
});
