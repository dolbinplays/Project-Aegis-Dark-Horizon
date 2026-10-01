const fs=require('fs'),vm=require('vm');
const path=process.argv[2]||__dirname+'/browser-runtime.html';
const src=fs.readFileSync(path,'utf8');
function sliceBetween(a,b){const i=src.indexOf(a),j=src.indexOf(b,i);if(i<0||j<0)throw new Error(`missing source seam: ${a} -> ${b}`);return src.slice(i,j);}
const sandbox={console,Math,Set,Map,Array,Object,Number,String,Boolean,JSON};
sandbox.tacticalKey=(x,y)=>`${x},${y}`;
sandbox.clamp=(v,min,max)=>Math.max(min,Math.min(max,v));
sandbox.tacticalHumanCombatActive=u=>Boolean(u&&u.team==='human'&&u.alive!==false&&Number(u.hp)>0&&!u.downed&&!u.unconscious);
let uidSeq=0;sandbox.uid=()=>`qa-${++uidSeq}`;
vm.createContext(sandbox);
vm.runInContext(sliceBetween('const TACTICAL_UNIFIED_ORDERS_PATROL_FALLBACK_POSTS_PATCH','const TACTICAL_FIRE_TEAM_OBJECTIVE_ASSIGNMENT_PATCH'),sandbox);
vm.runInContext(sliceBetween('function tacticalMarkFireTeamCommandHoldingInPlace','function tacticalReleaseCompletedCommandMapWaypoint'),sandbox);
vm.runInContext(sliceBetween('function tacticalReleaseCompletedCommandMapWaypoint','function tacticalFireTeamCommandDestination'),sandbox);
const mkTeam=()=>[
 {id:'leader',team:'human',hp:40,alive:true,x:2,y:2,fireTeamId:'alpha',fireTeamRole:'leader'},
 {id:'left',team:'human',hp:40,alive:true,x:2,y:3,fireTeamId:'alpha',fireTeamRole:'left'}
];
const results=[];const check=(name,pass)=>{results.push({name,pass:Boolean(pass)});console.log(`${pass?'PASS':'FAIL'} ${name}`)};
let team=mkTeam();
team=sandbox.tacticalIssueFireTeamCommand(team,'alpha',{x:4,y:4},3,'player-order:patrol',null,{kind:'patrol',patrolRoute:[{x:4,y:4},{x:8,y:4},{x:8,y:8},{x:4,y:4}]});
let order=sandbox.tacticalFireTeamCommandOrderForUnit(team[0],team);
check('patrol order stores unique route and first waypoint',order.kind==='patrol'&&order.patrolRoute.length===3&&order.x===4&&order.y===4&&order.patrolIndex===0);
team.forEach(u=>{u.x=4;u.y=4;});
let arrival=sandbox.tacticalHandleFireTeamStandingOrderArrival(team,team[0],0,4);order=sandbox.tacticalFireTeamCommandOrderForUnit(team[0],team);
check('patrol arrival advances to next waypoint without clearing',arrival.advanced&&order&&order.patrolIndex===1&&order.x===8&&order.y===4);
team.forEach(u=>{u.x=8;u.y=4;});sandbox.tacticalHandleFireTeamStandingOrderArrival(team,team[0],0,5);
team.forEach(u=>{u.x=8;u.y=8;});sandbox.tacticalHandleFireTeamStandingOrderArrival(team,team[0],0,6);order=sandbox.tacticalFireTeamCommandOrderForUnit(team[0],team);
check('patrol loops deterministically back to first waypoint',order.patrolIndex===0&&order.x===4&&order.y===4);
let fallback=sandbox.tacticalIssueFireTeamCommand(mkTeam(),'alpha',{x:6,y:6},2,'player-order:fallback',null,{kind:'fallback-post'});fallback.forEach(u=>{u.x=6;u.y=6;});arrival=sandbox.tacticalHandleFireTeamStandingOrderArrival(fallback,fallback[0],0,3);order=sandbox.tacticalFireTeamCommandOrderForUnit(fallback[0],fallback);
check('fallback post holds and remains persistent',arrival.holding&&order&&order.kind==='fallback-post'&&order.status==='holding');
let checkTeam=sandbox.tacticalIssueFireTeamCommand(mkTeam(),'alpha',{x:7,y:7},2,'player-order:check',null,{kind:'check-location'});checkTeam.forEach(u=>{u.x=7;u.y=7;});arrival=sandbox.tacticalHandleFireTeamStandingOrderArrival(checkTeam,checkTeam[0],0,3);
check('check location clears after quiet arrival',arrival.completed&&sandbox.tacticalFireTeamCommandOrderForUnit(checkTeam[0],checkTeam)===null&&checkTeam[0].fireTeamCommandCompletedReason==='check-complete');
let blocked=sandbox.tacticalIssueFireTeamCommand(mkTeam(),'alpha',{x:9,y:9},2,'player-order:fallback-blocked',null,{kind:'fallback-post'});sandbox.tacticalMarkFireTeamCommandBlockedInPlace(blocked,'alpha',5,'route-unreachable');order=sandbox.tacticalFireTeamCommandOrderForUnit(blocked[0],blocked);
check('blocked standing order is retained and readable',order&&order.status==='blocked'&&order.blockedReason==='route-unreachable');
const staticChecks=[
 ['resolver pauses standing order for visible combat even in Hybrid',src.includes('liveCombatPriority&&(aiControlMode!=="hybrid"||tacticalFireTeamOrderIsStanding(playerOrder))')],
 ['standing orders are not cleared by beacon/UFO source takeover',src.includes('playerOrder&&!typedBeaconOrder&&!tacticalFireTeamOrderIsStanding(playerOrder)')&&src.includes('playerOrder&&!tacticalFireTeamOrderIsStanding(playerOrder)){')],
 ['standing order snapshot fields persist through streamed frames',src.includes('fireTeamCommandPatrolRoute:tacticalNormalizeFireTeamPatrolRoute(unit.fireTeamCommandPatrolRoute)')&&src.includes('fireTeamCommandBlockedReason:unit.fireTeamCommandBlockedReason||null')],
 ['Orders UI exposes patrol fallback check and objective navigation',src.includes('Patrol Route')&&src.includes('Fallback Post')&&src.includes('Check Location')&&src.includes('Assign Objectives')&&src.includes('onOpenObjectives')],
 ['standing orders rank below explicit objectives/known rescue but above exploration',src.includes('priority:tacticalFireTeamOrderIsStanding(playerOrder)?88:85')&&src.includes('priority:85,reason:`assigned-objective:')],
 ['current-order HUD defers standing orders until after priority 8',src.indexOf('PRIORITY 8 - KNOWN CIVILIAN/VIP')<src.indexOf('STANDING ORDER - ${tacticalFireTeamOrderKindLabel(fireTeamOrder).toUpperCase()}')],
 ['save format remains 4',src.includes('const CURRENT_SAVE_FORMAT_VERSION=4')||src.includes('CURRENT_SAVE_FORMAT_VERSION = 4')]
];
staticChecks.forEach(([n,p])=>check(n,p));
const failed=results.filter(r=>!r.pass);
console.log(`\n${results.length-failed.length}/${results.length} unified-orders checks passed.`);
if(failed.length)process.exit(1);
