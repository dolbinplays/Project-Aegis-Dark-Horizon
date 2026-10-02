const fs=require('fs');
const path=require('path');
const runtime=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function extract(name){const marker=`function ${name}(`,start=runtime.indexOf(marker);if(start<0)throw new Error(`Missing ${name}`);let p=runtime.indexOf('(',start),pd=0,brace=-1;for(let i=p;i<runtime.length;i++){if(runtime[i]==='(')pd++;else if(runtime[i]===')'&&--pd===0){brace=runtime.indexOf('{',i);break;}}if(brace<0)throw new Error(`Missing body ${name}`);let depth=0,inS=false,inD=false,inT=false,esc=false;for(let i=brace;i<runtime.length;i++){const c=runtime[i];if(esc){esc=false;continue;}if((inS||inD||inT)&&c==='\\'){esc=true;continue;}if(!inD&&!inT&&c==="'")inS=!inS;else if(!inS&&!inT&&c==='"')inD=!inD;else if(!inS&&!inD&&c==='`')inT=!inT;else if(!inS&&!inD&&!inT){if(c==='{')depth++;else if(c==='}'&&--depth===0)return runtime.slice(start,i+1);}}throw new Error(`Unclosed ${name}`);}
function tacticalKey(x,y){return `${x},${y}`;}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function tacticalHumanCombatActive(u){return !!(u&&u.team==='human'&&u.hp>0&&u.alive!==false&&!u.extracted&&!u.casualtyExtracted);}
function tacticalHumanIsDowned(u){return !!(u&&(u.downed||u.unconscious));}
function tacticalAiCommanderScore(u={}){const rank={Rookie:0,Squaddie:1,Corporal:2,Sergeant:3,Lieutenant:4,Captain:5}[u.baseSoldier?.rank]||0;return rank*1000+(u.baseSoldier?.missions||0)*20+(u.baseSoldier?.stats?.bravery||0)+(u.baseSoldier?.stats?.reactions||0);}
function tacticalPhysioCaptureFormation(units=[]){const groups=new Map();for(const u of units.filter(x=>x.team==='human')){if(!groups.has(u.fireTeamId))groups.set(u.fireTeamId,[]);groups.get(u.fireTeamId).push(u);}return units.map(u=>{if(u.team!=='human')return u;const members=groups.get(u.fireTeamId)||[],slot=Math.max(0,members.findIndex(x=>x.id===u.id));return {...u,physioFormation:{teamId:u.fireTeamId,label:u.fireTeamDesignation||'AEGIS',slot}};});}
function tacticalDistance(a,b){return Math.abs((a?.x||0)-(b?.x||0))+Math.abs((a?.y||0)-(b?.y||0));}
function tacticalFireTeamCentroid(m=[]){return m.length?{x:m.reduce((s,u)=>s+(u.x||0),0)/m.length,y:m.reduce((s,u)=>s+(u.y||0),0)/m.length}:{x:0,y:0};}
function tacticalFireTeamDistanceBetween(a=[],b=[]){return tacticalDistance(tacticalFireTeamCentroid(a),tacticalFireTeamCentroid(b));}
const TACTICAL_FIRE_TEAM_MAX_SIZE=4;
for(const name of ['tacticalFireTeamDesignationForUnit','tacticalFireTeamLabelForUnit','tacticalFireTeamCommandGroups','tacticalNormalizeFireTeamPatrolRoute','tacticalFireTeamOwnedStateSnapshot','tacticalApplyFireTeamOwnedState','tacticalFireTeamMembers','tacticalFireTeamRoleAssignments','tacticalReconcileFireTeams','tacticalCanReassignFireTeamMember','tacticalReassignFireTeamMember'])eval(extract(name));
const teamFieldsMatch=runtime.match(/const TACTICAL_FIRE_TEAM_TEAM_OWNED_FIELDS=Object\.freeze\(\[(.*?)\]\);/s);if(!teamFieldsMatch)throw new Error('Missing team-owned fields');eval(`const TACTICAL_FIRE_TEAM_TEAM_OWNED_FIELDS=Object.freeze([${teamFieldsMatch[1]}]);globalThis.TACTICAL_FIRE_TEAM_TEAM_OWNED_FIELDS=TACTICAL_FIRE_TEAM_TEAM_OWNED_FIELDS;`);
const tests=[];const t=(name,pass)=>tests.push([name,!!pass]);
const patrol=[{x:4,y:4},{x:8,y:4},{x:8,y:8}];
const base=(id,team,designation,role,rank='Squaddie')=>({id,name:id,team:'human',hp:40,alive:true,x:2,y:2,tu:60,fireTeamId:team,fireTeamRole:role,fireTeamLeaderId:role==='leader'?id:null,fireTeamSquadId:`squad-${team}`,fireTeamSquadName:`Squad ${team}`,fireTeamIndex:designation==='Alpha'?0:1,fireTeamDesignationIndex:designation==='Alpha'?0:1,fireTeamDesignation:designation,fireTeamObjectiveAssignmentMode:'default',baseSoldier:{rank,missions:rank==='Sergeant'?12:3,stats:{bravery:50,reactions:50}}});
const aLead={...base('a-lead','alpha','Alpha','leader','Corporal'),fireTeamCommandOrderId:'alpha-patrol',fireTeamCommandTeamId:'alpha',fireTeamCommandTargetX:8,fireTeamCommandTargetY:4,fireTeamCommandIssuedRound:4,fireTeamCommandStatus:'active',fireTeamCommandKind:'patrol',fireTeamCommandPatrolRoute:patrol,fireTeamCommandPatrolIndex:1};
const aWing={...aLead,...base('a-wing','alpha','Alpha','left')};
const bLead={...base('b-lead','bravo','Bravo','leader','Sergeant'),fireTeamObjectiveAssignmentMode:'explicit',fireTeamObjectiveAssignmentId:'civilian:vip',fireTeamObjectiveAssignmentType:'civilian',fireTeamObjectiveAssignmentTargetId:'vip',fireTeamObjectiveAssignmentLabel:'VIP Morgan'};
const bWing={...bLead,...base('b-wing','bravo','Bravo','left'),fireTeamObjectiveAssignmentMode:'explicit',fireTeamObjectiveAssignmentId:'civilian:vip',fireTeamObjectiveAssignmentType:'civilian',fireTeamObjectiveAssignmentTargetId:'vip',fireTeamObjectiveAssignmentLabel:'VIP Morgan'};
const vip={id:'vip-a',name:'Avery',team:'civilian',hp:18,alive:true,x:3,y:2,rescued:false,escortId:aLead.id,lastEscortFireTeamId:'alpha'};
const valid=tacticalCanReassignFireTeamMember([aLead,aWing,bLead,bWing,vip],aLead.id,'bravo');
t('Valid drag between teams is accepted',valid.ok);
const moved=tacticalReassignFireTeamMember([aLead,aWing,bLead,bWing,vip],aLead.id,'bravo',9);
const actor=moved.units.find(u=>u.id===aLead.id),alpha=moved.units.filter(u=>u.team==='human'&&u.fireTeamId==='alpha'),bravo=moved.units.filter(u=>u.team==='human'&&u.fireTeamId==='bravo'),vipAfter=moved.units.find(u=>u.id===vip.id);
t('Dragged soldier changes team while source/destination memberships update',moved.ok&&actor.fireTeamId==='bravo'&&alpha.length===1&&bravo.length===3);
t('Commander-managed roster lock is applied to all living AEGIS members',moved.units.filter(u=>u.team==='human').every(u=>u.fireTeamRosterManual===true));
t('Source patrol stays on Alpha instead of following moved soldier',alpha[0].fireTeamCommandOrderId==='alpha-patrol'&&alpha[0].fireTeamCommandPatrolIndex===1&&actor.fireTeamCommandOrderId==null);
t('Moved soldier adopts Bravo team-owned VIP assignment',actor.fireTeamObjectiveAssignmentMode==='explicit'&&actor.fireTeamObjectiveAssignmentTargetId==='vip');
t('Physical escort ownership remains actor-owned across reassignment',vipAfter.escortId===aLead.id&&vipAfter.lastEscortFireTeamId==='bravo');
t('Leadership/roles are deterministically recalculated for both teams',alpha[0].fireTeamRole==='leader'&&bravo.filter(u=>u.fireTeamRole==='leader').length===1&&bravo.every(u=>u.fireTeamLeaderId===bravo.find(x=>x.fireTeamRole==='leader').id));
const full=[bLead,bWing,{...bWing,id:'b3'},{...bWing,id:'b4'}];t('Four-soldier destination rejects another member',!tacticalCanReassignFireTeamMember([aLead,aWing,...full],aLead.id,'bravo').ok);
t('Last active member cannot be dragged out of a fire team',!tacticalCanReassignFireTeamMember([aLead,bLead,bWing],aLead.id,'bravo').ok);
const hud=extract('TacticalFireTeamPhysiologicalHud');
t('Vitals HUD implements pointer drag/drop and destination highlighting',hud.includes('onPointerMove')&&hud.includes('data-aegis-physio-team-id')&&hud.includes('data-aegis-drop-target')&&hud.includes('data-aegis-physio-draggable'));
t('Vitals labels show full Fire Team names in widened panels',hud.includes('`${designation} Fire Team`')&&runtime.includes('[data-aegis-physio-team]{flex:0 0 224px')&&runtime.includes('flex-basis:204px'));
t('Manual roster membership is persisted and stops legacy auto-balance',runtime.includes('fireTeamRosterManual:Boolean(unit.fireTeamRosterManual)')&&extract('tacticalReconcileFireTeams').includes('let changed=!manualRoster'));
console.log(`${tests.filter(x=>x[1]).length}/${tests.length}`);for(const [name,pass] of tests)console.log(`${pass?'PASS':'FAIL'} ${name}`);if(tests.some(x=>!x[1]))process.exit(1);
