const fs=require('node:fs'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test'),path=require('node:path');
const root=path.resolve(__dirname,'..'),source=fs.readFileSync(path.join(root,'src/browser-runtime.html'),'utf8');
function fn(name){const start=source.indexOf('function '+name+'(');assert.ok(start>=0,name);for(let end=source.indexOf('}',start);end>=0;end=source.indexOf('}',end+1)){const text=source.slice(start,end+1);try{new vm.Script('('+text+')');return text;}catch{}}throw Error(name);}
const store=new Map(),library=JSON.parse(fs.readFileSync(path.join(root,'assets/data/aegis-prop-library.json'),'utf8'));
const ctx=vm.createContext({console,localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v),removeItem:k=>store.delete(k)},TACTICAL_GRID_SIZE:64,TACTICAL_DIRECTIONS:['E','W','NE','NW','SE','SW'].map(key=>({key})),tacticalKey:(x,y)=>`${x},${y}`,clamp:(v,min,max)=>Math.max(min,Math.min(max,v)),tacticalSeed:m=>m.seed||9417,tacticalBiomeForMission:()=>({key:'smalltown'}),tacticalMapProfileForMission:()=>({key:'medium',size:64,structureBonus:0}),tacticalFieldFeature:()=>null,tacticalIsSkyrangerInteriorRampCover:()=>false,TACTICAL_BUILDING_DOOR_STATES:{CLOSED:'closed'}});
vm.runInContext('window=globalThis;',ctx);
const start=source.indexOf('const TACTICAL_BUILDING_ARCHETYPES='),end=source.indexOf('function tacticalStreetRoadDirection',start);
vm.runInContext(source.slice(start,end),ctx);
for(const name of ['tacticalOffsetToCube','tacticalDistance','tacticalCoverStats','tacticalStepForDirection','tacticalNeighbors','tacticalCoverFootprintCells','tacticalPropVisualKey','tacticalPropIsSpecialStructure','tacticalCoverIsSolidPropObstacle','tacticalCoverBlocksMovement','tacticalBuildingCovers'])vm.runInContext(fn(name),ctx);
ctx.propExists=visual=>library.props.some(p=>p.visualKey===visual);
vm.runInContext(fs.readFileSync(path.join(root,'assets/runtime/aegis-building-layouts.js'),'utf8'),ctx);
const api=vm.runInContext(`window.AEGIS_BUILDING_LAYOUT_API=AEGIS_BUILDING_LAYOUTS.create({propExists,facade:tacticalBuildingFacadeOrientation,perimeter:tacticalBuildingPerimeterCells,furnishingBlock:tacticalInteriorFurnishingCoverBlock,coverStats:tacticalCoverStats,coverCells:tacticalCoverFootprintCells,blocks:tacticalCoverBlocksMovement,neighbors:tacticalNeighbors})`,ctx);
function fixture(){const footprint=Array.from({length:72},(_,i)=>({x:i%9,y:Math.floor(i/9)}));return{schema:'aegis-building-layout-v1',name:'Test Dwelling',archetype:'residence',width:9,height:8,footprint,items:footprint.filter(p=>p.x===0||p.x===8||p.y===0||p.y===7).map(p=>({...p,type:p.x===4&&p.y===7?'door':'wall'}))};}
test('dwelling validates on both staggered-row parities using tactical movement authority',()=>{for(const y of [10,11])assert.equal(api.validate(fixture(),{x:10,y}).ok,true);});
test('validator rejects missing entrance, shell gaps, overlap, unknown props, and blocked doors',()=>{
 const noDoor=fixture();noDoor.items=noDoor.items.map(p=>({...p,type:'wall'}));assert.match(api.validate(noDoor).errors.join(' '),/exterior door/);
 const gap=fixture();gap.items.shift();assert.match(api.validate(gap).errors.join(' '),/seam gap/);
 const overlap=fixture();overlap.items.push({...overlap.items[0]});assert.match(api.validate(overlap).errors.join(' '),/Overlapping/);
 const unknown=fixture();unknown.items.push({x:2,y:2,type:'prop',visual:'missing-prop'});assert.equal(api.validate(unknown).ok,false);
 const blocked=fixture();blocked.items.push({x:4,y:6,type:'prop',visual:'interior-couch'});assert.match(api.validate(blocked).errors.join(' '),/clearance conflict/);
});
test('enclosed walkable interior is rejected and an opening restores reachability',()=>{const value=fixture();for(let x=1;x<8;x++)value.items.push({x,y:3,type:'wall'});assert.match(api.validate(value).errors.join(' '),/unreachable/);value.items=value.items.filter(p=>!(p.x===4&&p.y===3));assert.equal(api.validate(value).ok,true);});
test('furnishings compile from canonical visuals and deterministic cover records',()=>{const value=fixture();value.items.push({x:2,y:2,type:'prop',visual:'interior-couch',rotation:Math.PI/2});const b=api.plan(value,{id:'home',x:10,y:11,wall:'brick',width:9,height:8});const records=api.covers(value,b),couch=records.find(c=>c.visual==='interior-couch');assert.equal(couch.block,ctx.tacticalInteriorFurnishingCoverBlock('interior-couch'));assert.equal(couch.furnishingRotation,Math.PI/2);assert.equal(couch.x,12);assert.deepEqual(records,api.covers(value,b));});
test('publishing validates before replacing last good layout; corrupt storage falls back safely',()=>{store.clear();const good=fixture();api.publish(good);const previous=[...store.values()][0];const broken=fixture();broken.items=[];assert.throws(()=>api.publish(broken));assert.equal([...store.values()][0],previous);store.set('aegis-building-layout-published-v1','{broken');assert.equal(api.read(),null);});
test('authored mission snapshot survives JSON restore and later publishing without rewriting plans',()=>{
 const layout=fixture();api.publish(layout);const mission={id:'authored-mission',seed:9417,authoredBuildingLayout:api.read()};const plans=ctx.tacticalBuildingPlans(mission);const home=plans.find(p=>p.key==='residence');assert.ok(home?.authoredLayout);assert.equal(home.footprintCells.length,72);const covers=ctx.tacticalBuildingCovers(mission).filter(c=>c.buildingId===home.id);assert.equal(covers.length,layout.items.length);assert.equal(covers.filter(c=>c.buildingPart==='door').length,1);
 const saved=JSON.stringify({mission,covers});const changed=fixture();changed.name='Later Revision';api.publish(changed);const restored=JSON.parse(saved);assert.equal(restored.mission.authoredBuildingLayout.name,'Test Dwelling');assert.deepEqual(JSON.parse(JSON.stringify(ctx.tacticalBuildingCovers(restored.mission).filter(c=>c.buildingId===home.id))),restored.covers);
 const oldMission={id:'legacy-battle',seed:9417};assert.ok(ctx.tacticalBuildingPlans(oldMission).every(b=>!b.authoredLayout));
});
test('new battlefield entry points pin snapshots once, including a null procedural selection',()=>{
 const capture=fn('aegisCaptureBuildingLayout');vm.runInContext(capture,ctx);store.clear();const mission={};ctx.aegisCaptureBuildingLayout(mission);assert.equal(mission.authoredBuildingLayout,null);api.publish(fixture());ctx.aegisCaptureBuildingLayout(mission);assert.equal(mission.authoredBuildingLayout,null);const fresh={};ctx.aegisCaptureBuildingLayout(fresh);assert.equal(fresh.authoredBuildingLayout.name,'Test Dwelling');assert.match(source,/makeBattlefield=function\(mission=\{\}\)\{aegisCaptureBuildingLayout/);assert.match(source,/makeBattlefieldAsync=function\(mission=\{\},\.\.\.args\)\{aegisCaptureBuildingLayout/);
});
test('oversize/malformed input is rejected without unbounded geometry work',()=>{const huge=fixture();huge.items=Array(145).fill({x:0,y:0,type:'wall'});assert.equal(api.validate(huge).ok,false);const bad=fixture();bad.footprint[0].x=Infinity;assert.equal(api.validate(bad).ok,false);});
test('the real tactical save/restore path preserves authored geometry and door state',()=>{
 ctx.TACTICAL_LIVE_STATE_CACHE=new Map();ctx.TACTICAL_REINFORCEMENT_STATE_CACHE=new Map();ctx.TACTICAL_LIVE_SAVE_PAYLOAD_BUILD_COUNT=0;
 for(const name of ['tacticalSerializableClone','tacticalLiveStateSavePayload','tacticalRestoreLiveStateSavePayload'])vm.runInContext(fn(name),ctx);
 const mission={id:'real-save-roundtrip',seed:9417,authoredBuildingLayout:fixture()},building=ctx.tacticalBuildingPlans(mission).find(b=>b.authoredLayout),covers=api.covers(mission.authoredBuildingLayout,building);
 covers.find(c=>c.buildingPart==='door').doorState='open';
 ctx.TACTICAL_LIVE_STATE_CACHE.set(mission.id,{deployment:{},units:[],covers});
 const payload=JSON.parse(JSON.stringify(ctx.tacticalLiveStateSavePayload(mission.id)));
 ctx.TACTICAL_LIVE_STATE_CACHE.clear();assert.equal(ctx.tacticalRestoreLiveStateSavePayload(mission,payload),true);
 assert.equal(ctx.TACTICAL_LIVE_STATE_CACHE.get(mission.id).covers.find(c=>c.buildingPart==='door').doorState,'open');
 assert.ok(ctx.tacticalBuildingPlans(mission).some(b=>b.authoredLayout),'restore must not misclassify authored covers as legacy rectangles');
});
