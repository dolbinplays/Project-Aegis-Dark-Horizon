const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const source=fs.readFileSync(require('node:path').join(__dirname,'../src/browser-runtime.html'),'utf8');
function fixture(feature,blocked=()=>false,protectedKeys=new Set()){
  const c=vm.createContext({TACTICAL_GRID_SIZE:48,TACTICAL_HEX_WORLD_X:Math.sqrt(3),TACTICAL_HEX_WORLD_Z:Math.sqrt(3)*.755,tacticalKey:(x,y)=>`${x},${y}`,tacticalFieldFeature:feature,tacticalBuildingCellAt:blocked,tacticalBuildingIngressProtectedCellKeys:()=>protectedKeys});
  for(const name of ['tacticalRoadJunctions','tacticalIntersectionControlProps']){const a=source.indexOf('function '+name+'('),b=source.indexOf('function ',a+10);vm.runInContext(source.slice(a,b),c);}return c;
}
const cross=(x,y)=>Math.abs(x-24)<=2||Math.abs(y-24)<=2?'road':null;
test('Wide crossings consolidate into one junction; straight roads and corners do not become intersections',()=>{
  assert.equal(fixture(cross).tacticalRoadJunctions({},48).length,1);
  assert.equal(fixture((x,y)=>Math.abs(x-24)<=2?'road':null).tacticalRoadJunctions({},48).length,0);
  assert.equal(fixture((x,y)=>(x===24&&y<=24)||(y===24&&x>=24)?'lane':null).tacticalRoadJunctions({},48).length,0);
  const stub=fixture((x,y)=>Math.abs(x-24)<=2||(Math.abs(y-24)<=1&&x>20)?'road':null).tacticalRoadJunctions({},48);
  assert.equal(stub.length,1);assert.equal(stub[0].approaches.length,3,'short roadside stub is not a fourth approach');
});
test('T junction uses three coherent controls and crossing uses four, respecting budgets',()=>{
  const t=fixture((x,y)=>y===24||x===24&&y<24?'lane':null);
  const signs=t.tacticalIntersectionControlProps({},48,{traffic:0,stop:3});assert.equal(signs.length,3);assert.ok(signs.every(p=>p.visual==='stop-sign'));
  const lights=fixture(cross).tacticalIntersectionControlProps({},48,{traffic:4,stop:4});assert.equal(lights.length,4);assert.ok(lights.every(p=>p.visual==='traffic-light'));assert.equal(new Set(lights.map(p=>p.intersectionId)).size,1);
  assert.equal(fixture(cross).tacticalIntersectionControlProps({},48,{traffic:2,stop:2}).length,0);
});
test('Controls face incoming traffic and remain off roads, protected entries and building cells',()=>{
  const protectedKeys=new Set(['30,27']),c=fixture(cross,(x,y)=>x===27&&y===30,protectedKeys);
  const props=c.tacticalIntersectionControlProps({},48,{traffic:4,stop:4});assert.equal(props.length,4);
  for(const p of props){assert.equal(cross(p.x,p.y),null);assert.equal(protectedKeys.has(`${p.x},${p.y}`),false);assert.ok(!(p.x===27&&p.y===30));
    const expected={east:[1,0],south:[0,1],west:[-1,0],north:[0,-1]}[p.trafficApproach];assert.ok(Math.sin(p.roadRotation)*expected[0]+Math.cos(p.roadRotation)*expected[1]>.9999);
  }
});
test('Blocked junction arrangements are skipped, and seeded/reloaded placement remains identical',()=>{
  const c=fixture(cross,()=>true);assert.equal(c.tacticalIntersectionControlProps({},48,{traffic:4,stop:4}).length,0);
  const open=fixture(cross),a=open.tacticalIntersectionControlProps({},48,{traffic:4,stop:4});assert.equal(JSON.stringify(a),JSON.stringify(open.tacticalIntersectionControlProps(JSON.parse('{}'),48,{traffic:4,stop:4})));
  assert.equal(new Set(a.map(p=>`${p.x},${p.y}`)).size,a.length);
});
