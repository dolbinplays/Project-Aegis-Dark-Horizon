const fs=require('fs');
const path=require('path');
const runtime=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function extract(name){const marker=`function ${name}(`,start=runtime.indexOf(marker);if(start<0)throw new Error(`Missing ${name}`);let p=runtime.indexOf('(',start),pd=0,brace=-1;for(let i=p;i<runtime.length;i++){if(runtime[i]==='(')pd++;else if(runtime[i]===')'&&--pd===0){brace=runtime.indexOf('{',i);break;}}if(brace<0)throw new Error(`Missing body ${name}`);let depth=0,inS=false,inD=false,inT=false,esc=false;for(let i=brace;i<runtime.length;i++){const c=runtime[i];if(esc){esc=false;continue;}if((inS||inD||inT)&&c==='\\'){esc=true;continue;}if(!inD&&!inT&&c==="'")inS=!inS;else if(!inS&&!inT&&c==='"')inD=!inD;else if(!inS&&!inD&&c==='`')inT=!inT;else if(!inS&&!inD&&!inT){if(c==='{')depth++;else if(c==='}'&&--depth===0)return runtime.slice(start,i+1);}}throw new Error(`Unclosed ${name}`);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function tacticalKey(x,y){return `${x},${y}`;}
function tacticalDistance(a,b){return Math.abs((a?.x||0)-(b?.x||0))+Math.abs((a?.y||0)-(b?.y||0));}
function tacticalHumanCombatActive(u){return !!(u&&u.team==='human'&&u.hp>0&&u.alive!==false);}
const TACTICAL_STANDING_FIRE_TEAM_ORDER_KINDS=['patrol','fallback-post','check-location'];
const TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT='default';
const TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIST_PREFIX='assist-team:';
function tacticalFireTeamObjectiveAssistTeamId(choiceId=''){const value=String(choiceId||'');return value.startsWith(TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIST_PREFIX)?value.slice(TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIST_PREFIX.length)||null:null;}
function tacticalFireTeamObjectiveAssistChoice(teamId=null){return teamId?`${TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIST_PREFIX}${teamId}`:TACTICAL_FIRE_TEAM_OBJECTIVE_DEFAULT;}
function tacticalFireTeamCommandGroups(units=[]){const ids=[...new Set(units.filter(u=>u.team==='human'&&u.fireTeamId).map(u=>u.fireTeamId))];return ids.map((id,i)=>({id,label:`Team ${i+1}`,members:units.filter(u=>u.fireTeamId===id)}));}
function tacticalFireTeamLeaderForUnit(unit,units=[]){return units.find(u=>u.fireTeamId===unit?.fireTeamId&&u.fireTeamRole==='leader')||unit||null;}
function tacticalGridSizeFrom(){return 80;}
function tacticalNeighbors(x,y){return [{x:x+1,y},{x:x-1,y},{x,y:y+1},{x,y:y-1}];}
function uid(){return 'qa';}
for(const name of ['tacticalNormalizeFireTeamPatrolRoute','tacticalFireTeamOrderIsStanding','tacticalFireTeamCommandOrderForUnit','tacticalStandingFireTeamOrderSnapshot','tacticalSuspendedStandingFireTeamOrderSnapshot','tacticalApplyStandingFireTeamOrderSnapshotInPlace','tacticalSuspendStandingFireTeamOrderInPlace','tacticalResumeSuspendedStandingFireTeamOrderInPlace','tacticalIssueFireTeamCommand','tacticalFireTeamObjectiveAssignmentForTeam','tacticalApplyFireTeamObjectiveAssignments'])eval(extract(name));
const tests=[];const t=(name,pass)=>tests.push([name,!!pass]);
const teamId='qa-alpha',route=[{x:4,y:4},{x:12,y:4},{x:12,y:12},{x:4,y:12}];
const make=(id,role='leader',status='active')=>({id,name:id,team:'human',hp:40,alive:true,x:2,y:2,fireTeamId:teamId,fireTeamRole:role,fireTeamCommandOrderId:'qa-patrol',fireTeamCommandTeamId:teamId,fireTeamCommandTargetX:12,fireTeamCommandTargetY:4,fireTeamCommandIssuedRound:7,fireTeamCommandStatus:status,fireTeamCommandKind:'patrol',fireTeamCommandPatrolRoute:route.map(c=>({...c})),fireTeamCommandPatrolIndex:1,fireTeamCommandBlockedReason:status==='blocked'?'route-unreachable':null,fireTeamObjectiveAssignmentMode:'default',fireTeamObjectiveAssignmentId:null,fireTeamObjectiveAssignmentType:null,fireTeamObjectiveAssignmentTargetId:null});
const vipA={id:'vip-a',type:'civilian',targetId:'vip-a',label:'VIP Avery',x:50,y:50},vipB={id:'vip-b',type:'civilian',targetId:'vip-b',label:'VIP Morgan',x:51,y:50};
let assigned=tacticalApplyFireTeamObjectiveAssignments([make('lead'),make('wing','left')],{[teamId]:'vip-a'},[vipA,vipB],10);
const suspended=tacticalSuspendedStandingFireTeamOrderSnapshot(assigned,teamId);
t('VIP assignment suspends rather than clears patrol',!tacticalFireTeamCommandOrderForUnit(assigned[0],assigned)&&suspended?.kind==='patrol'&&suspended.patrolIndex===1&&suspended.patrolRoute.length===4&&assigned.every(u=>u.fireTeamCommandOrderId==='qa-patrol'));
t('VIP assignment becomes authoritative explicit objective while patrol is suspended',assigned.every(u=>u.fireTeamObjectiveAssignmentMode==='explicit'&&u.fireTeamObjectiveAssignmentType==='civilian'&&u.fireTeamObjectiveAssignmentTargetId==='vip-a'));
assigned=tacticalApplyFireTeamObjectiveAssignments(assigned,{[teamId]:'vip-b'},[vipA,vipB],11);
const retargeted=tacticalSuspendedStandingFireTeamOrderSnapshot(assigned,teamId);
t('Changing VIP target preserves the same suspended patrol',retargeted?.id==='qa-patrol'&&retargeted.patrolIndex===1&&assigned.every(u=>u.fireTeamObjectiveAssignmentTargetId==='vip-b'));
let resumed=tacticalApplyFireTeamObjectiveAssignments(assigned,{[teamId]:'default'},[vipA,vipB],14);
const resumedOrder=tacticalFireTeamCommandOrderForUnit(resumed[0],resumed);
t('Clearing/completing VIP objective resumes same patrol',resumedOrder?.id==='qa-patrol'&&resumedOrder.kind==='patrol'&&resumedOrder.patrolIndex===1&&resumedOrder.x===12&&resumedOrder.y===4&&resumed.every(u=>u.fireTeamObjectiveAssignmentMode==='default'));
let blocked=tacticalApplyFireTeamObjectiveAssignments([make('lead-b','leader','blocked'),make('wing-b','left','blocked')],{[teamId]:'vip-a'},[vipA],20);blocked=tacticalApplyFireTeamObjectiveAssignments(blocked,{[teamId]:'default'},[vipA],21);const blockedOrder=tacticalFireTeamCommandOrderForUnit(blocked[0],blocked);
t('Blocked standing-order state survives VIP override',blockedOrder?.status==='blocked'&&blockedOrder.blockedReason==='route-unreachable');
const standingKindCase=(kind,target)=>{const base=[make(`lead-${kind}`),make(`wing-${kind}`,'left')].map(u=>({...u,fireTeamCommandKind:kind,fireTeamCommandPatrolRoute:kind==='patrol'?route.map(c=>({...c})):[],fireTeamCommandPatrolIndex:0,fireTeamCommandTargetX:target.x,fireTeamCommandTargetY:target.y}));const during=tacticalApplyFireTeamObjectiveAssignments(base,{[teamId]:'vip-a'},[vipA],24),after=tacticalApplyFireTeamObjectiveAssignments(during,{[teamId]:'default'},[vipA],25);return tacticalFireTeamCommandOrderForUnit(after[0],after);};
const fallback=standingKindCase('fallback-post',{x:20,y:20});t('Fallback Post also resumes after VIP objective',fallback?.kind==='fallback-post'&&fallback.x===20&&fallback.y===20);
const check=standingKindCase('check-location',{x:22,y:18});t('Check Location also resumes after VIP objective',check?.kind==='check-location'&&check.x===22&&check.y===18);
const legacyWaypoint=[{...make('lead-c'),fireTeamCommandKind:'waypoint',fireTeamCommandPatrolRoute:[],fireTeamCommandPatrolIndex:0},{...make('wing-c','left'),fireTeamCommandKind:'waypoint',fireTeamCommandPatrolRoute:[],fireTeamCommandPatrolIndex:0}];const legacyAssigned=tacticalApplyFireTeamObjectiveAssignments(legacyWaypoint,{[teamId]:'vip-a'},[vipA],30);
t('Legacy non-standing Move/Hold command still yields destructively to VIP assignment',legacyAssigned.every(u=>u.fireTeamCommandOrderId==null&&u.fireTeamCommandKind==null&&u.fireTeamCommandStatus==='objective-reassigned'));
const overlaySource=runtime.slice(runtime.indexOf('function FireTeamCommandMapOverlay('),runtime.indexOf('const TACTICAL_DEPLOYMENT_PREP_CACHE'));
t('Orders UI shows suspended standing order instead of pretending it vanished',overlaySource.includes('tacticalSuspendedStandingFireTeamOrderSnapshot')&&overlaySource.includes('SUSPENDED BY ASSIGNED OBJECTIVE')&&overlaySource.includes('displayOrder&&React.createElement("button"'));
t('Stream snapshots already persist all fields needed to survive save/load',runtime.includes('fireTeamCommandStatus: unit.fireTeamCommandStatus')&&runtime.includes('fireTeamCommandKind: unit.fireTeamCommandKind||null')&&runtime.includes('fireTeamCommandPatrolRoute:tacticalNormalizeFireTeamPatrolRoute(unit.fireTeamCommandPatrolRoute)')&&runtime.includes('fireTeamCommandPatrolIndex:Math.max(0,Number(unit.fireTeamCommandPatrolIndex)||0)'));
console.log(`${tests.filter(x=>x[1]).length}/${tests.length}`);for(const [name,pass] of tests)console.log(`${pass?'PASS':'FAIL'} ${name}`);if(tests.some(x=>!x[1]))process.exit(1);
