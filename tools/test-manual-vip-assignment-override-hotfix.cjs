const fs=require("fs"),path=require("path"),vm=require("vm");
const root=path.resolve(__dirname,"..");
const runtime=fs.readFileSync(path.join(root,"src","browser-runtime.html"),"utf8");
function extract(name){const start=runtime.indexOf("function "+name+"(");if(start<0)throw new Error("missing "+name);let bodyToken=runtime.indexOf("){",start);if(bodyToken<0)throw new Error("missing body for "+name);let brace=bodyToken+1,depth=0,quote=null,escape=false;for(let i=brace;i<runtime.length;i++){const c=runtime[i],n=runtime[i+1];if(quote){if(escape){escape=false;continue;}if(c==="\\"){escape=true;continue;}if(quote==="\""||quote==="'"){if(c===quote)quote=null;continue;}if(quote==="\`"){if(c==="\`"){quote=null;continue;}continue;}}else{if(c==="\""||c==="'"||c==="\`"){quote=c;continue;}if(c==="/"&&n==="/"){const end=runtime.indexOf("\n",i+2);i=end<0?runtime.length:end;continue;}if(c==="/"&&n==="*"){const end=runtime.indexOf("*/",i+2);i=end<0?runtime.length:end+1;continue;}if(c==="{")depth++;else if(c==="}"){depth--;if(depth===0)return runtime.slice(start,i+1);}}}throw new Error("unterminated "+name);}
const ctx={console,Map,Set,Math,TACTICAL_ESCORT_CAPACITY:4};
ctx.tacticalBuildingCellAt=()=>null;ctx.tacticalDistance=(a,b)=>Math.abs(a.x-b.x)+Math.abs(a.y-b.y);ctx.tacticalEscortFollowers=(units,id)=>units.filter(u=>u.team==="civilian"&&u.escortId===id&&u.hp>0&&!u.rescued&&!u.panic);ctx.tacticalFireTeamIsLeader=()=>true;ctx.tacticalCivilianContactChance=()=>100;ctx.rand=()=>1;ctx.facingToward=()=>"E";ctx.tacticalFireTeamLabelForUnit=u=>u.fireTeamId||"Fire Team";ctx.tacticalFireTeamObjectiveAssistTeamId=()=>null;
ctx.tacticalExplicitVipOwnerTeamMap=function(units=[]){const owners=new Map();units.forEach(unit=>{if(unit?.team!=="human"||unit.hp<=0||unit.alive===false||!unit.fireTeamId||unit.fireTeamObjectiveAssignmentMode!=="explicit"||unit.fireTeamObjectiveAssignmentType!=="civilian"||!unit.fireTeamObjectiveAssignmentTargetId)return;if(!owners.has(unit.fireTeamObjectiveAssignmentTargetId))owners.set(unit.fireTeamObjectiveAssignmentTargetId,unit.fireTeamId);});return owners;};
ctx.tacticalResetCompletedObjectiveTeamInPlace=function(units,teamId){units.forEach(u=>{if(u.team==="human"&&u.fireTeamId===teamId){u.fireTeamObjectiveAssignmentMode="default";u.fireTeamObjectiveAssignmentId=null;u.fireTeamObjectiveAssignmentType=null;u.fireTeamObjectiveAssignmentTargetId=null;}});return 1;};
vm.createContext(ctx);for(const name of ["tacticalReleaseDisplacedCivilianAssignmentsInPlace","tacticalFireTeamContactCivilianIds","tacticalFireTeamContactCivilians"])vm.runInContext(extract(name),ctx);
const alpha={id:"alpha",name:"Alpha",team:"human",hp:40,alive:true,tu:40,x:1,y:1,fireTeamId:"team-a",fireTeamRole:"leader",fireTeamObjectiveAssignmentMode:"explicit",fireTeamObjectiveAssignmentType:"civilian",fireTeamObjectiveAssignmentTargetId:"vip",fireTeamObjectiveAssignmentId:"civilian:vip"};
const bravo={id:"bravo",name:"Bravo",team:"human",hp:40,alive:true,tu:40,x:2,y:1,fireTeamId:"team-b",fireTeamRole:"leader",fireTeamObjectiveAssignmentMode:"default"};
const vip={id:"vip",name:"VIP",team:"civilian",hp:18,alive:true,x:3,y:1,rescued:false,escortId:null,panic:false};
const units=[alpha,bravo,vip];
function ok(value,msg){if(!value)throw new Error(msg);console.log("PASS",msg);}
ok(ctx.tacticalFireTeamContactCivilianIds(units,bravo,vip,{}).length===0,"AI/default contact respects another team's objective reservation");
ok(ctx.tacticalFireTeamContactCivilianIds(units,bravo,vip,{}, {allowAssignmentOverride:true}).includes(vip.id),"explicit player override may contact a merely assigned civilian");
const actuallyEscorted={...vip,escortId:alpha.id};
ok(ctx.tacticalFireTeamContactCivilianIds([alpha,bravo,actuallyEscorted],bravo,actuallyEscorted,{}, {allowAssignmentOverride:true}).length===0,"real escortId remains exclusive physical ownership");
const handoff=ctx.tacticalFireTeamContactCivilians({units:units.map(u=>({...u})),leaderId:bravo.id,primaryId:vip.id,mission:{},allowNonLeader:true,allowAssignmentOverride:true,round:3});
const handedVip=handoff.units.find(u=>u.id===vip.id),releasedAlpha=handoff.units.find(u=>u.id===alpha.id);
ok(handedVip.escortId===bravo.id,"successful manual contact transfers physical escort to selected soldier");
ok(releasedAlpha.fireTeamObjectiveAssignmentMode==="default"&&!releasedAlpha.fireTeamObjectiveAssignmentId,"displaced objective owner is released only after successful handoff");
ok(handoff.releasedObjectiveTeamIds.includes(alpha.fireTeamId),"handoff reports displaced fire-team release");
ok(runtime.includes("allowAssignmentOverride: true")&&runtime.includes("if (!candidateIds.length) return setLog"),"manual UI path opts into override and cannot report zero-candidate success");
ok(runtime.includes("if (target.escortId && target.escortId !== selectedUnit.id)"),"manual UI guards active physical escort ownership");
ok(runtime.includes("const TACTICAL_MANUAL_VIP_ASSIGNMENT_OVERRIDE_AND_ESCORT_OWNERSHIP_HOTFIX=true;"),"hotfix marker is present");
const save=(runtime.match(/const CURRENT_SAVE_FORMAT_VERSION=(\d+)/)||[])[1];ok(Number(save)===4,"save format remains 4");
console.log("Manual VIP assignment override hotfix regression passed.");
