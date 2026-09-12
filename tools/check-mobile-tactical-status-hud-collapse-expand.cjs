#!/usr/bin/env node
const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const root=path.resolve(__dirname,'..');
const runtime=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const base=fs.readFileSync(path.join(root,'_base_1740_runtime.html'),'utf8');
const manifest=JSON.parse(fs.readFileSync(path.join(root,'src','manifest.json'),'utf8'));
const BUILD=manifest.currentBuild;
const tests=[]; const add=(name,pass)=>tests.push({name,pass:Boolean(pass)});
function fnSource(text,name){
  const needle=`function ${name}(`;const start=text.indexOf(needle);if(start<0)return null;
  const open=text.indexOf('(',start);let pdepth=0,quote=null,esc=false,close=-1;
  for(let i=open;i<text.length;i++){const c=text[i];if(quote){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===quote){quote=null;continue;}continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='(')pdepth++;else if(c===')'){pdepth--;if(pdepth===0){close=i;break;}}}
  if(close<0)return null;const brace=text.indexOf('{',close);if(brace<0)return null;let depth=0;quote=null;esc=false;
  for(let i=brace;i<text.length;i++){const c=text[i],n=text[i+1];if(quote){if(esc){esc=false;continue;}if(c==='\\'){esc=true;continue;}if(c===quote){quote=null;continue;}continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='/'&&n==='*'){const e=text.indexOf('*/',i+2);if(e<0)return null;i=e+1;continue;}if(c==='/'&&n==='/'){const e=text.indexOf('\n',i+2);if(e<0)return text.slice(start);i=e;continue;}if(c==='{')depth++;else if(c==='}'){depth--;if(depth===0)return text.slice(start,i+1);}}return null;
}
function sameFn(name){const a=fnSource(base,name),b=fnSource(runtime,name);return Boolean(a&&b&&a===b);}
const hud=fnSource(runtime,'TacticalUnifiedThreeStatusPanel')||'';
const mission=fnSource(runtime,'TacticalMission')||'';
const app=fnSource(runtime,'AlienResponseCommand')||'';
const styleMatch=runtime.match(/<style[^>]+id="aegis-mobile-interface"[^>]*>([\s\S]*?)<\/style>/); const styles=styleMatch?styleMatch[1]:runtime;
add('runtime build synchronized',runtime.includes(`const CURRENT_GAME_BUILD="${BUILD}"`));
add('collapse expand patch flag present',runtime.includes('const MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH=true;'));
add('save format remains 4',runtime.includes('const CURRENT_SAVE_FORMAT_VERSION=4;'));
add('1708 history frozen',runtime.includes('build:"v0.26.09.11.1708_PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH"'));
add('1740 mobile HUD history frozen',runtime.includes('build:"v0.26.09.11.1740_MOBILE_TACTICAL_STATUS_HUD_COLLAPSE_EXPAND_PATCH",date:"September 11, 2026",title:"Mobile Tactical Status HUD Collapse / Expand"'));
add('exactly one mutable current history entry',((app.match(/PATCH_NOTES_HISTORY\.unshift\(\{build:CURRENT_GAME_BUILD/g)||[]).length===1));
add('battle local collapse state exists',mission.includes('mobileStatusHudCollapsed')&&mission.includes('setMobileStatusHudCollapsed'));
add('new mission resets collapsed state',mission.includes('setMobileStatusHudCollapsed(false)')&&mission.includes('[mission.id]'));
add('Mobile only supplies toggle callback',mission.includes('onToggleMobileCollapsed:mobileLayout?()=>setMobileStatusHudCollapsed'));
add('Mobile passes collapsed state to unified panel',mission.includes('mobileCollapsed:mobileLayout&&mobileStatusHudCollapsed'));
add('panel accepts collapse props',hud.includes('mobileCollapsed=false')&&hud.includes('onToggleMobileCollapsed=null'));
add('whole panel tap toggle present',hud.includes('onClick:mobileToggle?toggle:undefined'));
add('keyboard Enter toggle present',hud.includes('event.key==="Enter"'));
add('keyboard Space toggle present',hud.includes('event.key===" "'));
add('aria expanded present',hud.includes('aria-expanded'));
add('chevron affordance present',hud.includes('data-aegis-status-collapse-affordance')&&hud.includes('mobileCollapsed?"▾":"▴"'));
add('core soldier name remains outside collapsed gate',hud.indexOf('data-aegis-status-name')<hud.indexOf('!mobileCollapsed&&'));
add('identity remains outside collapsed gate',hud.indexOf('data-aegis-status-secondary":"identity')<hud.indexOf('!mobileCollapsed&&'));
add('vitals remain outside collapsed gate',hud.indexOf('data-aegis-status-secondary":"vitals')<hud.indexOf('!mobileCollapsed&&'));
add('authoritative status icons remain outside collapsed gate',hud.indexOf('data-aegis-authoritative-status-icons')<hud.indexOf('!mobileCollapsed&&'));
add('fire team assignment is inside expanded gate',hud.indexOf('Fire Team Assignment')>hud.indexOf('!mobileCollapsed&&'));
add('objective overlay is inside expanded gate',hud.indexOf('TacticalFpvOrderOverlay')>hud.indexOf('!mobileCollapsed&&'));
add('AI turn plan is inside expanded gate',hud.indexOf('AI Turn Plan')>hud.indexOf('!mobileCollapsed&&'));
add('status chips stop click propagation',hud.includes('data-aegis-status-interactive')&&hud.includes('event.stopPropagation()'));
add('desktop keeps pointer none class authority',hud.includes('pointer-events-none absolute right-3 top-3'));
add('mobile collapsed CSS exists',styles.includes('[data-aegis-mobile-collapsed="true"]'));
add('collapsed portrait restores vitals',styles.includes('[data-aegis-status-secondary="vitals"]{display:flex!important}'));
add('collapsed portrait restores status icons',styles.includes('[data-aegis-authoritative-status-icons]{display:flex!important}'));
add('collapse affordance CSS exists',styles.includes('[data-aegis-status-collapse-affordance]'));
for(const name of ['tacticalBuildingPlans','tacticalBuildingCovers','makeBattlefield','resolveMission','tacticalMissionTerminalState','tacticalAiMissionResolution']) add(`${name} unchanged from Browser 1740`,sameFn(name));
add('PWA single launch flag preserved',runtime.includes('const PWA_SINGLE_LAUNCH_UPDATE_HANDOFF_PATCH=true;'));
add('Browser 1610 seam patch preserved',runtime.includes('PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX'));
const passed=tests.filter(t=>t.pass).length; for(const t of tests)console.log(`${t.pass?'PASS':'FAIL'} - ${t.name}`);console.log(`\nPassed: ${passed}/${tests.length}`);console.log(`Failed: ${tests.length-passed}`);if(passed!==tests.length)process.exit(1);
