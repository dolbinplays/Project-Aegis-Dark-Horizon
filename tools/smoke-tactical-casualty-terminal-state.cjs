#!/usr/bin/env node
const fs=require('fs'),vm=require('vm'),path=require('path');
const src=fs.readFileSync(path.join(__dirname,'..','src','browser-runtime.html'),'utf8');
function fnSource(text,name){
  const needle=`function ${name}(`,start=text.indexOf(needle);if(start<0)throw new Error(`Missing ${name}`);
  const open=text.indexOf('(',start);let pd=0,q=null,esc=false,close=-1;
  for(let i=open;i<text.length;i++){const c=text[i];if(q){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===q)q=null;continue;}if(c==='"'||c==="'"||c==='`'){q=c;continue;}if(c==='(')pd++;else if(c===')'&&--pd===0){close=i;break;}}
  const brace=text.indexOf('{',close);let depth=0;q=null;esc=false;
  for(let i=brace;i<text.length;i++){const c=text[i],n=text[i+1];if(q){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===q)q=null;continue;}if(c==='"'||c==="'"||c==='`'){q=c;continue;}if(c==='/'&&n==='*'){const e=text.indexOf('*/',i+2);i=e+1;continue;}if(c==='/'&&n==='/'){const e=text.indexOf('\n',i+2);i=e;continue;}if(c==='{')depth++;else if(c==='}'&&--depth===0)return text.slice(start,i+1);}throw new Error(`Unclosed ${name}`);
}
const code=[fnSource(src,'tacticalHumanIsDowned'),fnSource(src,'tacticalHumanCombatActive'),fnSource(src,'tacticalMissionTerminalState')].join('\n');
const context={
  tacticalGridSizeFrom:()=>60,
  tacticalPlayableCell:()=>true,
  tacticalAiRescueProgress:()=>({mandatory:false,active:0,canResolveFailure:false,canResolveVictory:true}),
  tacticalMissionHasUnresolvedAlienContact:()=>false,
  tacticalAlienBeaconObjectiveState:()=>({pending:false}),
  tacticalReinforcementSourceObjectiveState:()=>({pending:false,ufoBayObjective:null}),
};
vm.createContext(context);vm.runInContext(code,context);
const downed={id:'down',team:'human',hp:1,alive:true,downed:true,unconscious:true,x:2,y:2};
const active={id:'up',team:'human',hp:20,alive:true,tu:30,x:3,y:2};
const allDown=context.tacticalMissionTerminalState({humans:[downed],aliens:[],civilians:[],covers:[]});
if(!(allDown.livingHumanCount===1&&allDown.activeHumanCount===0&&allDown.downedHumanCount===1&&allDown.squadWiped&&allDown.resolved&&!allDown.primarySecured&&!allDown.victory))throw new Error(`all-down terminal mismatch: ${JSON.stringify(allDown)}`);
const stillActive=context.tacticalMissionTerminalState({humans:[active,downed],aliens:[],civilians:[],covers:[]});
if(!(stillActive.livingHumanCount===2&&stillActive.activeHumanCount===1&&stillActive.downedHumanCount===1&&!stillActive.squadWiped&&stillActive.primarySecured&&stillActive.victory))throw new Error(`active+downed terminal mismatch: ${JSON.stringify(stillActive)}`);
console.log('PASS - all-down resolves as tactical defeat while active+downed can still secure victory');
