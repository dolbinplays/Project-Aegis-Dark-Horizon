const fs=require('fs');
const path=require('path');
const runtime=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function extract(name){const marker=`function ${name}(`,start=runtime.indexOf(marker);if(start<0)throw new Error(`Missing ${name}`);let p=runtime.indexOf('(',start),pd=0,brace=-1;for(let i=p;i<runtime.length;i++){if(runtime[i]==='(')pd++;else if(runtime[i]===')'&&--pd===0){brace=runtime.indexOf('{',i);break;}}if(brace<0)throw new Error(`Missing body ${name}`);let depth=0,inS=false,inD=false,inT=false,esc=false;for(let i=brace;i<runtime.length;i++){const c=runtime[i];if(esc){esc=false;continue;}if((inS||inD||inT)&&c==='\\'){esc=true;continue;}if(!inD&&!inT&&c==="'")inS=!inS;else if(!inS&&!inT&&c==='"')inD=!inD;else if(!inS&&!inD&&c==='`')inT=!inT;else if(!inS&&!inD&&!inT){if(c==='{')depth++;else if(c==='}'&&--depth===0)return runtime.slice(start,i+1);}}throw new Error(`Unclosed ${name}`);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function tacticalKey(x,y){return `${x},${y}`;}
function tacticalHumanCombatActive(u){return !!(u&&u.team==='human'&&u.hp>0&&u.alive!==false);}
const TACTICAL_STANDING_FIRE_TEAM_ORDER_KINDS=['patrol','fallback-post','check-location'];
const TACTICAL_STRANDED_PATROL_REPAIR_COMPLETION_REASONS=['beacon-destroyed','beacon-disabled','beacon-target-ended','beacon-neutralized','assisted-objective-complete'];
const TACTICAL_AI_MAX_MOVE_STEPS=14,TACTICAL_AI_MAX_CANDIDATES=4096;
function tacticalGridSizeFrom(){return 12;}
const building={id:'b',x:2,y:2,w:3,h:3,doors:[]};
function tacticalBuildingCellAt(x,y){return x>=2&&x<=4&&y>=2&&y<=4?{building}:null;}
function tacticalBuildingPerimeterCells(){const out=[];for(let x=2;x<=4;x++){out.push({x,y:2},{x,y:4});}for(let y=3;y<=3;y++){out.push({x:2,y},{x:4,y});}return out;}
function tacticalNeighbors(x,y){return [[1,0],[-1,0],[0,1],[0,-1]].map(([dx,dy])=>({x:x+dx,y:y+dy})).filter(c=>c.x>=0&&c.x<12&&c.y>=0&&c.y<12);}
function isHardCoverAt(covers,x,y){return covers.some(c=>c.x===x&&c.y===y&&c.kind==='hard'&&c.hp>0);}
function tacticalFireIntensityAt(){return 0;}function tacticalSmokeDensityAt(){return 0;}function tacticalMovementHazardCost(){return 0;}function tacticalAiRouteThreatStats(){return {threatSteps:0,reentries:0,exposure:0};}function tacticalPathHazardStats(){return {hazardCost:0,fireSteps:0,smokeSteps:0};}function tacticalPlayerExtractionRampCells(){return [{x:0,y:3}];}function tacticalDistance(a,b){return Math.abs(a.x-b.x)+Math.abs(a.y-b.y);}
for(const name of ['tacticalNormalizeFireTeamPatrolRoute','tacticalFireTeamOrderIsStanding','tacticalFireTeamCommandOrderForUnit','tacticalStandingFireTeamOrderSnapshot','tacticalApplyStandingFireTeamOrderSnapshotInPlace','tacticalRepairStrandedPatrolOrdersInPlace','tacticalResetCompletedObjectiveTeamInPlace','tacticalBuildingOpeningIsPassableBreach','tacticalAiBuildingExitRoute'])eval(extract(name));
const tests=[];const t=(name,pass)=>tests.push([name,!!pass]);
const rubble={id:'r',x:2,y:3,buildingId:'b',visual:'breach-rubble',buildingPart:'breach',breached:true,hp:12,maxHp:12,kind:'soft',block:0,structural:false};
t('breach-rubble with residual HP is passable',tacticalBuildingOpeningIsPassableBreach(rubble));
t('intact wall is not passable breach',!tacticalBuildingOpeningIsPassableBreach({...rubble,visual:'building-wall',buildingPart:'wall',breached:false}));
const exit=tacticalAiBuildingExitRoute({unit:{id:'celine',team:'human',hp:40,alive:true,x:3,y:3},placement:{},covers:[rubble],units:[],maxSteps:8,mission:{}});
t('escort route exits through breached rubble',exit.path.some(c=>c.x===2&&c.y===3)&&exit.clearedBuilding&&exit.exitKind==='breach');
const teamId='delta',route=[{x:28,y:46},{x:11,y:44},{x:11,y:20},{x:74,y:20},{x:74,y:45},{x:30,y:46}];
const make=(id)=>({id,team:'human',hp:40,alive:true,fireTeamId:teamId,fireTeamCommandOrderId:'patrol-19',fireTeamCommandTeamId:teamId,fireTeamCommandTargetX:28,fireTeamCommandTargetY:46,fireTeamCommandIssuedRound:19,fireTeamCommandStatus:'active',fireTeamCommandKind:'patrol',fireTeamCommandPatrolRoute:route.map(x=>({...x})),fireTeamCommandPatrolIndex:0,fireTeamObjectiveAssignmentMode:'assist',fireTeamObjectiveAssignmentId:'assist:foxtrot',fireTeamObjectiveAssignmentType:'assist-fire-team'});
const active=[make('zara'),make('tobin'),make('zev')];tacticalResetCompletedObjectiveTeamInPlace(active,teamId,{round:21,reason:'assisted-objective-complete',objectiveType:'assist-fire-team'});const kept=tacticalFireTeamCommandOrderForUnit(active[0],active);
t('Assist completion preserves active patrol',kept?.kind==='patrol'&&kept.patrolRoute.length===6&&active.every(u=>u.fireTeamObjectiveAssignmentMode==='default'));
const stranded=active.map(u=>({...u,fireTeamCommandOrderId:null,fireTeamCommandTeamId:null,fireTeamCommandTargetX:null,fireTeamCommandTargetY:null,fireTeamCommandKind:null,fireTeamCommandStatus:'assisted-objective-complete',fireTeamCommandCompletedRound:21,fireTeamCommandCompletedReason:'assisted-objective-complete',fireTeamCommandIssuedRound:19,fireTeamCommandPatrolRoute:route.map(x=>({...x})),fireTeamCommandPatrolIndex:0}));const repair=tacticalRepairStrandedPatrolOrdersInPlace(stranded,25),restored=tacticalFireTeamCommandOrderForUnit(stranded[0],stranded);
t('0038 stranded six-waypoint patrol repairs',repair.changed&&repair.count===1&&restored?.kind==='patrol'&&restored.patrolRoute.length===6&&restored.x===28&&restored.y===46);
const ambiguous=stranded.map(u=>({...u,fireTeamCommandOrderId:null,fireTeamCommandTeamId:null,fireTeamCommandTargetX:null,fireTeamCommandTargetY:null,fireTeamCommandKind:null,fireTeamCommandStatus:'manual-clear',fireTeamCommandCompletedReason:'manual-clear'}));
t('manual/ambiguous clear is not inferred as patrol',!tacticalRepairStrandedPatrolOrdersInPlace(ambiguous,25).changed);
t('runtime invokes repair before streamed planning',runtime.includes('tacticalRepairStrandedPatrolOrdersInPlace(humans,initialRound+round-1)'));
t('cached tactical load repairs stranded patrol before Orders UI reads units',runtime.includes('tacticalRepairStrandedPatrolOrdersInPlace(reconciled,Math.max(1,Number(cachedBattleState.tacticalRound)||1));return reconciled'));
t('both rescue ingress and extraction use shared breach helper',runtime.includes('cover?.buildingId===building.id&&tacticalBuildingOpeningIsPassableBreach(cover)')&&extract('tacticalAiBuildingExitRoute').includes('tacticalBuildingOpeningIsPassableBreach(cover)'));
console.log(`${tests.filter(x=>x[1]).length}/${tests.length}`);for(const [name,pass] of tests)console.log(`${pass?'PASS':'FAIL'} ${name}`);if(tests.some(x=>!x[1]))process.exit(1);
