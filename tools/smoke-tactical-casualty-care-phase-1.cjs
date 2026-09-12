const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync('src/browser-runtime.html','utf8');
const a=src.indexOf('const TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_DRAGGING_PATCH=true;');
const b=src.indexOf('function tacticalMedkitActionState',a);
assert.ok(a>=0&&b>a,'casualty helper block present');
const block=src.slice(a,b);
const ctx={console,Math,Set,Map,
 tacticalDistance:(a,b)=>Math.max(Math.abs((a?.x||0)-(b?.x||0)),Math.abs((a?.y||0)-(b?.y||0))),
 tacticalKey:(x,y)=>`${x},${y}`,
 tacticalNeighbors:(x,y,size=48)=>[[1,0],[-1,0],[0,1],[0,-1],[1,1],[-1,-1]].map(([dx,dy])=>({x:x+dx,y:y+dy})).filter(p=>p.x>=0&&p.y>=0&&p.x<size&&p.y<size),
 tacticalVisibleCellSet:()=>new Set(['8,5']),
 tacticalGridSizeFrom:()=>48,
 isHardCoverAt:()=>false,
 adjacentToCover:()=>false,
 updateFacing:(u,x,y)=>x>u.x?'E':'W'
};
vm.createContext(ctx);vm.runInContext(block,ctx);
const soldier={id:'s1',name:'Mira',team:'human',alive:true,hp:10,maxHp:40,tu:40,maxTu:40,x:5,y:5};
let r=ctx.tacticalResolveHumanCasualtyHit(soldier,12,{id:'a1'},3);
assert.equal(r.downed,true);assert.equal(r.killed,false);assert.equal(r.unit.hp,1);assert.equal(r.unit.alive,true);assert.equal(r.unit.tu,0);assert.equal(r.unit.prone,true);
r=ctx.tacticalResolveHumanCasualtyHit(soldier,30,{id:'a1'},3);
assert.equal(r.killed,true);assert.equal(r.unit.hp,0);assert.equal(r.unit.alive,false);
r=ctx.tacticalResolveHumanCasualtyHit({...soldier,hp:20},5,{id:'a1'},3);
assert.equal(r.downed,false);assert.equal(r.unit.hp,15);
const rescuer={id:'r1',name:'Bryn',team:'human',alive:true,hp:30,maxHp:30,tu:40,maxTu:40,x:5,y:5};
const casualty={...soldier,id:'c1',name:'Mira',hp:1,tu:0,x:6,y:5,downed:true,unconscious:true,prone:true};
let drag=ctx.tacticalCasualtyToggleDragResult([rescuer,casualty],'r1','c1');
assert.equal(drag.ok,true);assert.equal(drag.units.find(u=>u.id==='r1').tu,32);assert.equal(drag.units.find(u=>u.id==='r1').draggingCasualtyId,'c1');assert.equal(drag.units.find(u=>u.id==='c1').draggedById,'r1');
let moved=drag.units.map(u=>u.id==='r1'?{...u,x:4,y:5}:u);
moved=ctx.tacticalAdvanceDraggedCasualty(moved,'r1',{x:5,y:5});
assert.deepEqual({x:moved.find(u=>u.id==='c1').x,y:moved.find(u=>u.id==='c1').y},{x:5,y:5});
let released=ctx.tacticalCasualtyToggleDragResult(moved,'r1','c1');assert.equal(released.release,true);assert.equal(released.units.find(u=>u.id==='r1').draggingCasualtyId,null);
const aiHumans=[{...rescuer,id:'r2',x:6,y:5,tu:40,medkitCharges:1},{...casualty,id:'c2',x:5,y:5}];
const aiAliens=[{id:'a2',team:'alien',alive:true,hp:20,x:8,y:5}];
const ai=ctx.tacticalAiCasualtyRecoveryStep({humans:aiHumans,aliens:aiAliens,covers:[],mission:{},round:4});
assert.equal(ai.events.length,1);assert.deepEqual({x:ai.humans.find(u=>u.id==='c2').x,y:ai.humans.find(u=>u.id==='c2').y},{x:6,y:5});assert.equal(ai.humans.find(u=>u.id==='r2').tu,32);
console.log('PASS - casualty conversion, catastrophic KIA, manual drag lifecycle, physical follow movement, and AI emergency pull');
