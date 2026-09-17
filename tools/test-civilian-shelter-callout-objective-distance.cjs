const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict'),{test}=require('node:test');
const runtime=fs.readFileSync(path.join(__dirname,'../src/browser-runtime.html'),'utf8');
const ctx=vm.createContext({console,Math,Number,String,Object,Array,Set,Map,Boolean,JSON});
ctx.clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
ctx.tacticalKey=(x,y)=>`${x},${y}`;
ctx.tacticalDistance=(a,b)=>Math.max(Math.abs(Number(a.x)-Number(b.x)),Math.abs(Number(a.y)-Number(b.y)));
ctx.tacticalHumanIsDowned=()=>false;ctx.facingToward=()=> 'E';
ctx.tacticalCoverFootprintCells=(cover)=>[{x:Number(cover?.x)||0,y:Number(cover?.y)||0}];
ctx.tacticalCoverOccupiesCell=(cover,x,y)=>Number(cover?.x)===Number(x)&&Number(cover?.y)===Number(y);
const building={id:'house',label:'House',doors:[{x:5,y:5}]};
ctx.tacticalBuildingCellAt=(x,y)=>Number(x)>=5&&Number(x)<=7&&Number(y)>=5&&Number(y)<=7?{building,door:Number(x)===5&&Number(y)===5}:null;
ctx.tacticalVisibilityContext=()=>({});ctx.tacticalFireIntensityAt=()=>0;ctx.tacticalSmokeDensityAt=()=>0;
ctx.tacticalCivilianVisibleThreats=(civilian,units)=>units.filter(unit=>unit.team==='alien'&&unit.hp>0);
function evalSlice(start,end){const a=runtime.indexOf(start),b=runtime.indexOf(end,a+start.length);assert.ok(a>=0,start);assert.ok(b>a,end);vm.runInContext(runtime.slice(a,b),ctx);}
evalSlice('const TACTICAL_INTERACTIVE_BUILDING_DOOR_STATE_AND_PATHING_FOUNDATION_PATCH=true;','function tacticalBuildingCovers');
evalSlice('const TACTICAL_FIRE_TEAM_OBJECTIVE_DISTANCE_SORT_PATCH=true;','function tacticalFireTeamObjectiveAssignmentForTeam');
// The VIP approach route is evaluated with compact dependency stubs.
ctx.TACTICAL_AI_MAX_MOVE_STEPS=6;ctx.TACTICAL_AI_MAX_CANDIDATES=200;ctx.tacticalGridSizeFrom=()=>40;ctx.tacticalFireTeamMembers=()=>[];ctx.tacticalAiHazardAwarePath=(leader,goal)=>[{x:leader.x,y:leader.y},{x:goal.x,y:goal.y}];
ctx.tacticalAiRescueRoute=(args)=>({cell:{x:args.unit.x,y:args.unit.y},path:[{x:args.unit.x,y:args.unit.y}],steps:0,reached:false});
const routeStart=runtime.indexOf('function tacticalVipApproachRoute');const routeEnd=runtime.indexOf('function tacticalVipApproachStatusText',routeStart);vm.runInContext(runtime.slice(routeStart,routeEnd),ctx);
const door={id:'door-1',x:5,y:5,hp:70,maxHp:70,kind:'hard',block:0,structural:true,buildingPart:'door',buildingId:'house',buildingLabel:'House',doorMaterial:'brick',doorOrientation:'ew',doorState:'open',doorLocked:false,visual:'building-door-brick-open-ew'};
const vip={id:'vip',name:'VIP One',team:'civilian',hp:18,alive:true,x:6,y:6,revealed:true,rescued:false,escortId:null};
const alien={id:'alien',team:'alien',hp:30,alive:true,x:10,y:6};
const soldier={id:'s1',name:'Rook',team:'human',hp:40,alive:true,tu:40,x:4,y:5,fireTeamId:'ft1',fireTeamRole:'leader'};

test('patch markers are present and save format stays 4',()=>{assert.match(runtime,/TACTICAL_CIVILIAN_VIP_SHELTER_LOCKING_AND_AEGIS_CALLOUT_PATCH=true/);assert.match(runtime,/TACTICAL_FIRE_TEAM_OBJECTIVE_DISTANCE_SORT_PATCH=true/);assert.match(runtime,/const CURRENT_SAVE_FORMAT_VERSION=4/);});
test('threatened unescorted civilian inside a building locks its ordinary exterior door',()=>{const result=ctx.tacticalCivilianShelterLockStep({units:[vip,alien],covers:[door],mission:{},round:3});assert.deepEqual(Array.from(result.lockedDoorIds),['door-1']);assert.equal(result.covers[0].doorState,'locked');assert.equal(result.covers[0].doorShelterLocked,true);assert.equal(result.units.find(u=>u.id==='vip').shelterState,'locked');});
test('shelter locking does not lock an AEGIS soldier inside or affect an already escorted VIP',()=>{const inside={...soldier,x:6,y:5};let result=ctx.tacticalCivilianShelterLockStep({units:[vip,alien,inside],covers:[door],mission:{},round:3});assert.equal(result.lockedDoorIds.length,0);result=ctx.tacticalCivilianShelterLockStep({units:[{...vip,escortId:'s1'},alien],covers:[door],mission:{},round:3});assert.equal(result.lockedDoorIds.length,0);});
test('Call Out is offered only for a civilian-secured locked door and opens it for 8 TU',()=>{const locked=ctx.tacticalCivilianShelterLockStep({units:[vip,alien],covers:[door],mission:{},round:3});const action=ctx.tacticalAegisCallOutActionState(soldier,locked.covers,[soldier,...locked.units],{},'human');assert.equal(action.ok,true);const response=ctx.tacticalAegisCallOutResult({unit:soldier,covers:locked.covers,units:[soldier,...locked.units],mission:{},turn:'human',round:4});assert.equal(response.ok,true);assert.equal(response.door.doorState,'open');assert.equal(response.door.doorShelterLocked,false);assert.equal(response.unit.tu,32);assert.equal(response.units.find(u=>u.id==='vip').shelterState,'responded');});
test('VIP ingress recognizes a locked shelter as Call Out ready instead of unreachable',()=>{const locked=ctx.tacticalCivilianShelterLockStep({units:[vip,alien],covers:[door],mission:{},round:3});const ingress={buildingId:'house',opening:{x:5,y:5},outside:{x:4,y:5},kind:'door',openingKey:'house:door:5,5'};const route=ctx.tacticalVipApproachRoute({leader:soldier,vip,ingress,covers:locked.covers,units:[soldier,vip,alien],mission:{},maxSteps:6});assert.equal(route.vipApproachStage,'shelter-callout-ready');assert.equal(route.reached,true);assert.equal(route.shelterDoorId,'door-1');});
test('each fire team sees spatial objectives nearest to farthest with deterministic ties',()=>{const objectives=[{id:'far',label:'Far',x:20,y:20,priority:10},{id:'near-b',label:'Beta',x:3,y:2,priority:20},{id:'near-a',label:'Alpha',x:3,y:2,priority:20}];const left={id:'left',members:[{...soldier,x:2,y:2}]};const right={id:'right',members:[{...soldier,id:'s2',x:20,y:19}]};assert.deepEqual(Array.from(ctx.tacticalObjectivesSortedForFireTeam(objectives,left),o=>o.id),['near-a','near-b','far']);assert.equal(ctx.tacticalObjectivesSortedForFireTeam(objectives,right)[0].id,'far');});
test('Assign Objectives and tactical controls expose distance sorting and Call Out on desktop/mobile',()=>{assert.match(runtime,/distanceSortedObjectives\.map/);assert.match(runtime,/selectedCalloutAction\.door&&.*Call Out/s);assert.match(runtime,/aegisMobileButton\("Call Out",callOutSelectedShelter/);});
test('shelter state is included in streamed tactical snapshots',()=>{assert.match(runtime,/shelterBuildingId:unit\.shelterBuildingId/);assert.match(runtime,/shelterDoorIds:Array\.isArray\(unit\.shelterDoorIds\)/);assert.match(runtime,/shelterCalloutRound:unit\.shelterCalloutRound/);});
test('alien forced-entry doctrine is deliberately not introduced in this patch',()=>{assert.doesNotMatch(runtime,/TACTICAL_ALIEN_FORCED_ENTRY_DOCTRINE_PATCH=true/);});
