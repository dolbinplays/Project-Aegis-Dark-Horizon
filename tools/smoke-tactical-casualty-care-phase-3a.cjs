const fs=require('fs'),vm=require('vm'),assert=require('assert/strict');
const src=fs.readFileSync('src/browser-runtime.html','utf8');
const medicalStart=src.indexOf('const TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_DRAGGING_PATCH=true;');
const medicalEnd=src.indexOf('function tacticalMedkitActionState',medicalStart);
const hudStart=src.indexOf('function tacticalPhysioHealthColor');
const hudEnd=src.indexOf('function tacticalFirstPersonHudEntries',hudStart);
assert.ok(medicalStart>=0&&medicalEnd>medicalStart&&hudStart>=0&&hudEnd>hudStart,'Phase 3A helper blocks present');
const ctx={console,Math,Set,Map,
  TACTICAL_FEAR_STATES:{steady:'steady',shaken:'shaken',pinned:'pinned',override:'override'},
  clamp:(value,min,max)=>Math.max(min,Math.min(max,value)),
  tacticalDistance:(a,b)=>Math.max(Math.abs(Number(a?.x||0)-Number(b?.x||0)),Math.abs(Number(a?.y||0)-Number(b?.y||0))),
  tacticalKey:(x,y)=>`${x},${y}`,
  tacticalPlayerSkyrangerCrafts:placement=>Array.isArray(placement?.crafts)?placement.crafts:placement?[placement]:[],
  tacticalSkyrangerRampTouchCellForCraft:craft=>craft?.rampCells?.[0]||null,
  tacticalAiHazardAwarePath:(start,target,_covers,_units,maxSteps)=>{const path=[{x:start.x,y:start.y}];let x=start.x,y=start.y;while(x!==target.x||y!==target.y){if(x!==target.x)x+=Math.sign(target.x-x);else y+=Math.sign(target.y-y);path.push({x,y});}return path.length-1<=maxSteps?path:null;},
  updateFacing:unit=>unit.facing||'E',
  tacticalVisibleCellSet:()=>new Set(),tacticalGridSizeFrom:()=>48,tacticalNeighbors:()=>[],isHardCoverAt:()=>false,adjacentToCover:()=>false,
  applyTacticalMedicalGrowth:(growth,medical)=>growth.map(record=>{const outcome=medical.find(item=>item.id===record.id);return{...record,state:outcome?.hp>0?'Wounded 1d':'KIA',wounded:outcome?.hp>0?1:40,tacticalFinalHp:outcome?.hp||0};})
};
vm.createContext(ctx);
vm.runInContext(src.slice(medicalStart,medicalEnd)+src.slice(hudStart,hudEnd),ctx);
const craft={rampCells:[{x:5,y:5},{x:6,y:5}]},placement={crafts:[craft]};
const linked=[{id:'r',name:'Doc',team:'human',alive:true,hp:36,maxHp:36,tu:32,x:5,y:5,draggingCasualtyId:'c'},{id:'c',name:'Casey',team:'human',alive:true,hp:1,maxHp:40,tu:0,x:4,y:5,downed:true,unconscious:true,bleeding:true,draggedById:'r'}];
const manual=ctx.tacticalExtractDraggedCasualtyAtSkyranger(linked,'r',placement,4);
assert.equal(manual.extracted,true);assert.equal(manual.casualty.casualtyExtracted,true);assert.equal(manual.casualty.stabilized,true);assert.equal(manual.units.find(unit=>unit.id==='r').draggingCasualtyId,null);
const aiHumans=[{id:'ai-r',name:'Medic',team:'human',alive:true,hp:36,maxHp:36,tu:24,x:4,y:5,baseSoldier:{specialization:'Medic'}},{id:'ai-c',name:'Down',team:'human',alive:true,hp:1,maxHp:40,tu:0,x:3,y:5,downed:true,unconscious:true,bleeding:false,stabilized:true}];
const ai=ctx.tacticalAiCasualtyExtractionStep({humans:aiHumans,aliens:[],covers:[],mission:{gridSize:20},skyranger:placement,round:5});
assert.equal(ai.extractedIds.join(','),'ai-c');assert.equal(ai.humans.find(unit=>unit.id==='ai-c').casualtyExtracted,true);assert.equal(ai.humans.find(unit=>unit.id==='ai-r').tu,8);
const farHumans=[{id:'far-r',name:'Carry',team:'human',alive:true,hp:36,maxHp:36,tu:16,x:1,y:5},{id:'far-c',name:'Far Down',team:'human',alive:true,hp:1,maxHp:40,tu:0,x:0,y:5,downed:true,unconscious:true,bleeding:false,stabilized:true}];
const partial=ctx.tacticalAiCasualtyExtractionStep({humans:farHumans,aliens:[],covers:[],mission:{gridSize:20},skyranger:placement,round:5}),partialRescuer=partial.humans.find(unit=>unit.id==='far-r'),partialCasualty=partial.humans.find(unit=>unit.id==='far-c');
assert.equal(partial.extractedIds.length,0);assert.equal(partialRescuer.x,2);assert.equal(partialRescuer.draggingCasualtyId,'far-c');assert.equal(partialCasualty.draggedById,'far-r');
const continuedHumans=partial.humans.map(unit=>unit.id==='far-r'?{...unit,tu:24}:unit),completed=ctx.tacticalAiCasualtyExtractionStep({humans:continuedHumans,aliens:[],covers:[],mission:{gridSize:20},skyranger:placement,round:6});
assert.equal(completed.extractedIds.join(','),'far-c');assert.equal(completed.humans.find(unit=>unit.id==='far-c').casualtyExtractionRound,6);
const roster=[{id:'c',name:'Casey'},{id:'lost',name:'Lost'}],lost={id:'lost',name:'Lost',team:'human',alive:true,hp:1,maxHp:40,downed:true,unconscious:true};
const growth=roster.map(soldier=>({id:soldier.id,state:'Ready',wounded:0,tacticalFinalHp:40}));
const defeat=ctx.tacticalApplyCasualtyExtractionAftermath({success:false,growth,logs:[]},[manual.casualty,lost],roster,{id:'m'},false,5);
assert.notEqual(defeat.growth.find(record=>record.id==='c').state,'KIA');assert.equal(defeat.growth.find(record=>record.id==='lost').state,'KIA');assert.equal(defeat.casualtyRecovery.extractedIds.join(','),'c');assert.equal(defeat.casualtyRecovery.abandonedIds.join(','),'lost');
const victory=ctx.tacticalApplyCasualtyExtractionAftermath({success:true,growth:[growth[1]],logs:[]},[lost],[roster[1]],{id:'m'},true,5);
assert.notEqual(victory.growth[0].state,'KIA');assert.equal(victory.casualtyRecovery.recoveredIds.join(','),'lost');
assert.ok(ctx.tacticalPhysioHeartbeatDuration({team:'human',alive:true,hp:40,maxHp:40,fearState:'steady'})>ctx.tacticalPhysioHeartbeatDuration({team:'human',alive:true,hp:20,maxHp:40,fearState:'override'}));
assert.equal(ctx.tacticalPhysioHeartbeatDuration({team:'human',alive:false,hp:0,maxHp:40}),0);assert.equal(ctx.tacticalPhysioMemberState(manual.casualty),'EVAC');assert.equal(ctx.tacticalPhysioRoleSlot({},3).gridRow,3);
assert.match(src,/mobilePhysioHudOpen\?"Hide Vitals":"Team Vitals"/);assert.match(src,/\(!mobileLayout\|\|mobilePhysioHudOpen\).*TacticalFireTeamPhysiologicalHud/);assert.match(src,/AEGIS_FIRE_TEAM_PHYSIOLOGICAL_HUD_BEGIN/);
assert.match(src,/return tacticalContinuationRequired\?terminalResult:tacticalApplyCasualtyExtractionAftermath/);
console.log('PASS - Phase 3A Skyranger casualty extraction, withdrawal aftermath, fire-team vitals, and Mobile Adaptive toggle');

// A fallen leader and their promoted replacement must retain distinct deployment slots.
const vitalsTeam=['leader','left','right','rear'].map((role,index)=>({id:'v'+index,name:'Member '+index,team:'human',fireTeamId:'golf',fireTeamDesignation:'Golf',fireTeamRole:role,alive:true,hp:40,maxHp:40}));
for(const size of [3,4]){
  const initial=ctx.tacticalPhysioCaptureFormation(vitalsTeam.slice(0,size));
  const after=ctx.tacticalPhysioCaptureFormation(JSON.parse(JSON.stringify(initial.map((u,i)=>({...u,alive:i!==0,hp:i===0?0:40,fireTeamRole:i===1?'leader':u.fireTeamRole})).reverse())));
  const positions=after.map(u=>JSON.stringify(ctx.tacticalPhysioRoleSlot(u)));
  assert.equal(new Set(positions).size,size,'No overlapping casualty/successor cards');
  for(const u of after)assert.equal(JSON.stringify(u.physioFormation),JSON.stringify(initial.find(v=>v.id===u.id).physioFormation),'Slots survive promotion, reordered playback, and save/restore');
  assert.equal(ctx.tacticalPhysioMemberState(after.find(u=>u.id==='v0')),'KIA');
}
const legacy=ctx.tacticalPhysioCaptureFormation(vitalsTeam.slice(0,3).map((u,i)=>({...u,fireTeamRole:i<2?'leader':'right',alive:i!==0,hp:i===0?0:40})));
assert.equal(new Set(legacy.map(u=>JSON.stringify(ctx.tacticalPhysioRoleSlot(u)))).size,3,'Old saves with duplicate leaders get unique cells');
assert.match(src,/physioFormation: unit.physioFormation \? \{\.\.\.unit.physioFormation\} : null/);
console.log('PASS - stable three/four-member vitals after leader death, promotion, restore, and legacy duplicate roles');
