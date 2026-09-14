const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const THREE=require('../assets/vendor/three.min.js');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
const context=vm.createContext({clamp:(v,min,max)=>Math.max(min,Math.min(max,v))});
const a=source.indexOf('function tacticalPositionVipTrackerIndicators('),b=source.indexOf('function ',a+10);
vm.runInContext(source.slice(a,b),context);
const mount={clientWidth:844,clientHeight:390};
const marker=(x,z)=>({position:new THREE.Vector3(x,0,z),userData:{indicator:{style:{},textContent:'VIP — Escorting'}}});
const camera=()=>{const c=new THREE.PerspectiveCamera(60,844/390,.1,100);c.position.set(0,3.7,0);c.updateMatrixWorld();return c;};
const update=(c,groups,m=mount)=>context.tacticalPositionVipTrackerIndicators(THREE,c,m,groups);
test('Perspective VIP markers hide behind the eye, at the eye, beyond far plane and outside view',()=>{
  const c=camera(),groups=[marker(0,-10),marker(0,10),marker(0,0),marker(0,-.05),marker(0,-101),marker(30,-10),marker(-30,-10)];
  update(c,groups);assert.equal(groups[0].userData.indicator.style.display,'block');
  for(const group of groups.slice(1))assert.equal(group.userData.indicator.style.display,'none');
  assert.equal(groups[0].userData.indicator.style.left,'422px');assert.equal(groups[0].userData.indicator.style.top,'195px');
});
test('Camera rotation restores hidden markers and hides the former forward marker without rebuilding',()=>{
  const c=camera(),front=marker(0,-10),rear=marker(0,10);update(c,[front,rear]);
  c.rotation.y=Math.PI;update(c,[front,rear]);
  assert.equal(front.userData.indicator.style.display,'none');assert.equal(rear.userData.indicator.style.display,'block');
  assert.equal(rear.userData.indicator.textContent,'VIP — Escorting');
});
test('Orbit/translated camera uses camera pose and supports parent transforms',()=>{
  const c=camera(),parent=new THREE.Group();parent.position.set(20,0,20);parent.rotation.y=Math.PI/2;parent.add(c);parent.updateMatrixWorld(true);
  const forward=marker(10,20),behind=marker(30,20);update(c,[forward,behind]);
  assert.equal(forward.userData.indicator.style.display,'block');assert.equal(behind.userData.indicator.style.display,'none');
});
test('Perspective edge positions are true projections on desktop and mobile; vertical offscreen hides',()=>{
  for(const [width,height] of [[844,390],[390,844]]){
    const c=camera();c.aspect=width/height;c.updateProjectionMatrix();const point=new THREE.Vector3(.98,-.8,0).unproject(c);const g=marker(point.x,point.z);
    c.position.y+=3.7-point.y;c.updateMatrixWorld();update(c,[g],{clientWidth:width,clientHeight:height});
    assert.equal(g.userData.indicator.style.display,'block');assert.ok(Math.abs(parseFloat(g.userData.indicator.style.left)-width*.99)<.001);
    c.position.y=100;update(c,[g]);assert.equal(g.userData.indicator.style.display,'none');
  }
});
test('Orthographic map retains edge guidance and switching cameras restores presentation',()=>{
  const g=marker(100,-10),p=camera();update(p,[g]);assert.equal(g.userData.indicator.style.display,'none');
  const c=new THREE.OrthographicCamera(-10,10,10,-10,.1,100);c.position.y=3.7;update(c,[g]);
  assert.equal(g.userData.indicator.style.display,'block');assert.equal(g.userData.indicator.style.left,'820px');
  update(p,[g]);assert.equal(g.userData.indicator.style.display,'none');
});
