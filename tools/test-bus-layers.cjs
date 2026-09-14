const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test'),THREE=require('../assets/vendor/three.min.js');
const s=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8'),c=vm.createContext({TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE:1.5});
for(const name of ['tacticalBusBodyColor','tacticalVehicleHeadlightLayout','tacticalThreeAddLandVehicle']){const a=s.indexOf('function '+name+'('),b=s.indexOf('function ',a+10);vm.runInContext(s.slice(a,b),c);}
const make=cover=>{const g=new THREE.Group();c.tacticalThreeAddLandVehicle(THREE,g,cover,{wreck:new THREE.BoxGeometry(1,.38,.66),wall:new THREE.BoxGeometry(.92,.62,.54),crate:new THREE.BoxGeometry(.64,.45,.64)},(key,color,options)=>new THREE.MeshBasicMaterial({color}));g.updateMatrixWorld(true);return g;};
test('Bus layers match body footprint, meet without gaps and use requested heights',()=>{
  const g=make({visual:'vehicle-bus'}),body=new THREE.Box3().setFromObject(g.children[0]),glass=new THREE.Box3().setFromObject(g.getObjectByName('bus-glass')),roof=new THREE.Box3().setFromObject(g.getObjectByName('bus-roof')),eps=1e-6;
  for(const box of [glass,roof])for(const axis of ['x','z']){assert.ok(Math.abs(box.min[axis]-body.min[axis])<eps);assert.ok(Math.abs(box.max[axis]-body.max[axis])<eps);}
  const old=.62*1.44*1.5;assert.ok(Math.abs(glass.max.y-glass.min.y-2*old)<eps);assert.ok(Math.abs(roof.max.y-roof.min.y-old)<eps);
  assert.ok(Math.abs(body.max.y-glass.min.y)<eps);assert.ok(Math.abs(glass.max.y-roof.min.y)<eps);assert.ok(Math.abs(body.max.y-body.min.y-.38*3.6*1.5)<eps);
  const wheels=g.children.filter(m=>m.geometry.type==='CylinderGeometry');assert.equal(wheels.length,4);assert.deepEqual(wheels.map(w=>w.position.toArray()),[[-2.25,.22,-1.12],[-2.25,.22,1.12],[2.25,.22,-1.12],[2.25,.22,1.12]]);
  const lamps=g.children.filter(m=>m.name==='vehicle-headlamp');assert.deepEqual(lamps.map(m=>m.position.toArray()),JSON.parse(JSON.stringify(c.tacticalVehicleHeadlightLayout({visual:'vehicle-bus'}).lamps.map(p=>[p.x,p.y,p.z]))));
});
test('Yellow and blue variants remain deterministic after save/reload and tint both metal layers',()=>{
  const colors=new Set();for(let x=1;x<=6;x++){const cover={visual:'vehicle-bus',x,y:8},color=c.tacticalBusBodyColor(cover);colors.add(color);assert.equal(color,c.tacticalBusBodyColor(JSON.parse(JSON.stringify(cover))));const g=make(cover);assert.equal(g.children[0].material.color.getHex(),color);assert.equal(g.getObjectByName('bus-roof').material.color.getHex(),color);}
  assert.equal(colors.size,2);
});
