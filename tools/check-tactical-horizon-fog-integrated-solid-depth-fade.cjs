const fs=require('fs'),crypto=require('crypto');
const runtimePath=process.argv[2]||'src/browser-runtime.html';
const source=fs.readFileSync(runtimePath,'utf8');
const build='v0.26.09.11.1254_TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX';
function extractFunction(src,name){
  const key=`function ${name}`; const start=src.indexOf(key); if(start<0) throw new Error(`Missing ${name}`);
  let paren=src.indexOf('(',start),pdepth=0,quote=null,escape=false,lineComment=false,blockComment=false,body=-1;
  for(let i=paren;i<src.length;i++){const c=src[i],n=src[i+1];if(lineComment){if(c==='\n')lineComment=false;continue;}if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;}if(quote){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===quote)quote=null;continue;}if(c==='/'&&n==='/'){lineComment=true;i++;continue;}if(c==='/'&&n==='*'){blockComment=true;i++;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='(')pdepth++;else if(c===')'&&--pdepth===0){body=src.indexOf('{',i+1);break;}}
  if(body<0)throw new Error(`Missing body ${name}`);let depth=0;quote=null;escape=false;lineComment=false;blockComment=false;
  for(let i=body;i<src.length;i++){const c=src[i],n=src[i+1];if(lineComment){if(c==='\n')lineComment=false;continue;}if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;}if(quote){if(escape){escape=false;continue;}if(c==='\\'){escape=true;continue;}if(c===quote)quote=null;continue;}if(c==='/'&&n==='/'){lineComment=true;i++;continue;}if(c==='/'&&n==='*'){blockComment=true;i++;continue;}if(c==='"'||c==="'"||c==='`'){quote=c;continue;}if(c==='{')depth++;else if(c==='}'&&--depth===0)return src.slice(start,i+1);}
  throw new Error(`Unclosed ${name}`);
}
function sha(t){return crypto.createHash('sha256').update(t).digest('hex');}
function blend(from,to,t){const fr=(from>>16)&255,fg=(from>>8)&255,fb=from&255,tr=(to>>16)&255,tg=(to>>8)&255,tb=to&255;return [Math.round(fr+(tr-fr)*t),Math.round(fg+(tg-fg)*t),Math.round(fb+(tb-fb)*t)];}
function lum(v){return v[0]*.2126+v[1]*.7152+v[2]*.0722;}
const checks=[];const add=(n,p)=>checks.push({name:n,pass:Boolean(p)});
add('Current runtime build is Browser 1254',source.includes(`const CURRENT_GAME_BUILD="${build}"`));
add('Fog-integrated solid-depth fade flag present',source.includes('const TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX=true'));
add('Browser 1230 atmospheric fade flag retained',source.includes('const TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX=true'));
add('Browser 1110 solid occlusion flag retained',source.includes('const TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX=true'));
const fade=extractFunction(source,'tacticalHorizonAtmosphericFadeMix');
add('Daylight base palette is lifted substantially',fade.includes('day:{extension:.5,near:.62,mid:.74,far:.84}'));
add('Twilight and night preserve progressively more silhouette contrast',fade.includes('twilight:{extension:.38,near:.48,mid:.62,far:.74}')&&fade.includes('night:{extension:.22,near:.3,mid:.43,far:.56}'));
const targetDay=0xa6bccb,base=0x263543,near=blend(base,targetDay,.62),mid=blend(base,targetDay,.74),far=blend(base,targetDay,.84);
add('Representative daylight near mid far base colors progressively brighten',lum(near)<lum(mid)&&lum(mid)<lum(far)&&near.every(v=>v>90));
const renderer=extractFunction(source,'tacticalThreePersistentBuildPerspectiveBackdropDepthContinuity');
add('Horizon batches remain fully opaque',renderer.includes('transparent:false')&&renderer.includes('opacity:1'));
add('Horizon batches remain depth-writing and depth-tested',renderer.includes('depthWrite:true')&&renderer.includes('depthTest:true')&&renderer.includes('aegisSolidDepthOcclusion=true'));
add('Daylight horizon batches participate in scene fog',renderer.includes('fog:plan.phase==="day"')&&renderer.includes('aegisFogIntegratedSolidFade=plan.phase==="day"'));
add('Fog integration does not use building alpha transparency',!renderer.includes('makeBatch=(items,geometry,name,opacity)'));
add('Perspective diagnostic reports scene-fog mode',renderer.includes('aegisPerspectiveBackdropAtmosphericFade="opaque-scene-fog-color"'));
add('Perspective diagnostic distinguishes daylight scene fog from phase color fade',renderer.includes('aegisPerspectiveBackdropFogIntegrated=plan.phase==="day"?"day-scene-fog":"phase-color-fade"'));
add('Consolidated haze remains separate transparent presentation layer',renderer.includes('aegisConsolidatedHorizonHaze=true')&&renderer.includes('transparent:true,opacity:.16,depthWrite:false'));
add('Seeded window batch remains depth-tested and non-depth-writing',renderer.includes('seeded-emissive-window-atlas-batch')&&renderer.includes('depthWrite:false,depthTest:true'));
add('No horizon point lights added',!renderer.includes('new THREE.PointLight'));
add('Horizon scenery remains outside tactical pickables cover and LOS',!renderer.includes('pickables.push')&&!renderer.includes('tacticalCover')&&!renderer.includes('hasLineOfSight'));
const world=extractFunction(source,'tacticalThreePersistentBuildWorldContinuationAtmosphericContinuity');
add('Map-edge continuation still shares atmospheric target',world.includes('tacticalHorizonAtmosphericTargetColor')&&world.includes('tacticalHorizonAtmosphericFadeMix(atmosphere.lighting.phase,"extension")'));
add('Original world-continuation material remains fog-aware and depth-writing',source.includes('sceneryMaterial=new THREE.MeshBasicMaterial({color:profile.scenery,toneMapped:false,fog:true,depthWrite:true})'));
add('Browser 1230 history is frozen literal',source.includes('build:"v0.26.09.11.1230_TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX",date:"September 11, 2026",title:"Tactical Horizon Atmospheric Fade With Solid Occlusion Hotfix"'));
add('Current Browser 1254 history entry present',source.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Tactical Horizon Fog-Integrated Solid Depth Fade Hotfix"'));
const app=extractFunction(source,'AlienResponseCommand');
add('Exactly one mutable current history entry remains',(app.match(/\{build:CURRENT_GAME_BUILD,date:/g)||[]).length===1);
add('Save format remains 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4\s*;/.test(source));
add('Exactly one literal finishAiPlayback declaration remains',(source.match(/function finishAiPlayback\(\)\{/g)||[]).length===1);
const expected={resolveMission:'60363040b40de491c28dd4ee7819fe291489fe48a16effae14b23966ad12f456',tacticalMissionTerminalState:'7789262fc140b640d81eb443b91d24bdf9daacfdbdbe2bbac7af5358a84a160c',tacticalAiMissionResolution:'3ef3c32a49421c2f353d95d6e18f9f46954ead16505df535cb66cd5e618cd702'};
for(const [name,hash] of Object.entries(expected))add(`${name} byte-identical to Browser 1230 authority`,sha(extractFunction(source,name))===hash);
add('New Build Health suite registered',source.includes('function tacticalHorizonFogIntegratedSolidDepthFadeContractChecks()')&&source.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_1254_HORIZON_FOG'));
for(const c of checks)console.log(`${c.pass?'PASS':'FAIL'} - ${c.name}`);const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed;console.log(`\nPassed: ${passed}/${checks.length}\nFailed: ${failed}`);process.exit(failed?1:0);
