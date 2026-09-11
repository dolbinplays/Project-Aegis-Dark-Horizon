const fs=require('fs'),crypto=require('crypto');
const runtimePath=process.argv[2]||'src/browser-runtime.html';
const source=fs.readFileSync(runtimePath,'utf8');
const build='v0.26.09.11.1230_TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX';
function extractFunction(src,name){
  const key=`function ${name}`; const start=src.indexOf(key); if(start<0) throw new Error(`Missing ${name}`);
  let paren=src.indexOf('(',start),pdepth=0,quote=null,escape=false,lineComment=false,blockComment=false,body=-1;
  for(let i=paren;i<src.length;i++){const c=src[i],n=src[i+1]; if(lineComment){if(c==='\n')lineComment=false;continue;} if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;} if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote)quote=null; continue;} if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;} if(c==='"'||c==="'"||c==='`'){quote=c;continue;} if(c==='(')pdepth++; else if(c===')'&&--pdepth===0){body=src.indexOf('{',i+1);break;}}
  if(body<0)throw new Error(`Missing body ${name}`); let depth=0;quote=null;escape=false;lineComment=false;blockComment=false;
  for(let i=body;i<src.length;i++){const c=src[i],n=src[i+1]; if(lineComment){if(c==='\n')lineComment=false;continue;} if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;} if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote)quote=null;continue;} if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;} if(c==='"'||c==="'"||c==='`'){quote=c;continue;} if(c==='{')depth++; else if(c==='}'&&--depth===0)return src.slice(start,i+1);}
  throw new Error(`Unclosed ${name}`);
}
function sha(t){return crypto.createHash('sha256').update(t).digest('hex');}
function blend(from,to,t){const fr=(from>>16)&255,fg=(from>>8)&255,fb=from&255,tr=(to>>16)&255,tg=(to>>8)&255,tb=to&255;return [Math.round(fr+(tr-fr)*t),Math.round(fg+(tg-fg)*t),Math.round(fb+(tb-fb)*t)];}
function luminance(rgb){return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;}
const checks=[]; const add=(n,p)=>checks.push({name:n,pass:Boolean(p)});
add('Current runtime build is Browser 1230',source.includes(`const CURRENT_GAME_BUILD="${build}"`));
add('Atmospheric fade hotfix flag present',source.includes('const TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX=true'));
add('Browser 1110 solid occlusion flag retained',source.includes('const TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX=true'));
add('Browser 1046 horizon continuity flag retained',source.includes('const TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH=true'));
const fade=extractFunction(source,'tacticalHorizonAtmosphericFadeMix');
add('Phase-aware fade defines extension near mid and far layers',fade.includes('day:{extension:.38,near:.48,mid:.68,far:.84}')&&fade.includes('twilight:{extension:.28,near:.36,mid:.54,far:.72}')&&fade.includes('night:{extension:.16,near:.23,mid:.39,far:.57}'));
add('Day fade is stronger than twilight and night',fade.includes('day:{extension:.38')&&fade.includes('twilight:{extension:.28')&&fade.includes('night:{extension:.16'));
const target=extractFunction(source,'tacticalHorizonAtmosphericTargetColor');
add('Atmospheric target derives from active sky top and bottom palette',target.includes('atmosphere?.bottom')&&target.includes('atmosphere?.top')&&target.includes('skyBias'));
const plan=extractFunction(source,'tacticalPerspectiveHorizonDepthPlan');
add('Horizon plan uses phase-aware near mid far fade values',plan.includes('tacticalHorizonAtmosphericFadeMix(phase,"near")')&&plan.includes('tacticalHorizonAtmosphericFadeMix(phase,"mid")')&&plan.includes('tacticalHorizonAtmosphericFadeMix(phase,"far")'));
const base=0x344756, targetDay=0xa6bccb, near=blend(base,targetDay,.48), mid=blend(base,targetDay,.68), far=blend(base,targetDay,.84);
add('Representative daytime near mid far colors progressively brighten',luminance(near)<luminance(mid)&&luminance(mid)<luminance(far)&&luminance(near)>luminance(blend(base,targetDay,.14)));
const renderer=extractFunction(source,'tacticalThreePersistentBuildPerspectiveBackdropDepthContinuity');
add('Distant structure batches remain opaque',renderer.includes('transparent:false')&&renderer.includes('opacity:1'));
add('Distant structure batches remain depth-writing and depth-tested',renderer.includes('depthWrite:true')&&renderer.includes('depthTest:true')&&renderer.includes('aegisSolidDepthOcclusion=true'));
add('Atmospheric fade diagnostic identifies opaque color/contrast mode',renderer.includes('aegisPerspectiveBackdropAtmosphericFade="opaque-color-contrast"'));
add('Consolidated haze remains separate and transparent',renderer.includes('aegisConsolidatedHorizonHaze=true')&&renderer.includes('hazeMaterial=new THREE.MeshBasicMaterial')&&renderer.includes('transparent:true,opacity:.16,depthWrite:false'));
add('Window batch remains depth-tested and non-depth-writing',renderer.includes('seeded-emissive-window-atlas-batch')&&renderer.includes('depthWrite:false,depthTest:true'));
add('Horizon renderer creates no point lights',!renderer.includes('new THREE.PointLight'));
add('Horizon renderer remains outside pickables cover and LOS',!renderer.includes('pickables.push')&&!renderer.includes('tacticalCover')&&!renderer.includes('hasLineOfSight'));
const world=extractFunction(source,'tacticalThreePersistentBuildWorldContinuationAtmosphericContinuity');
add('Map-edge continuation uses same phase-aware atmospheric target',world.includes('tacticalHorizonAtmosphericTargetColor')&&world.includes('tacticalHorizonAtmosphericFadeMix(atmosphere.lighting.phase,"extension")'));
add('Current patch history entry present',source.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Tactical Horizon Atmospheric Fade With Solid Occlusion Hotfix"'));
add('Browser 1110 history frozen literal',source.includes('build:"v0.26.09.11.1110_TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX",date:"September 11, 2026",title:"Tactical Horizon Solid Building Depth Occlusion Hotfix"'));
const app=extractFunction(source,'AlienResponseCommand');
add('Exactly one mutable current history entry remains',(app.match(/\{build:CURRENT_GAME_BUILD,date:/g)||[]).length===1);
add('Save format remains 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4\s*;/.test(source));
add('Exactly one literal finishAiPlayback declaration remains',(source.match(/function finishAiPlayback\(\)\{/g)||[]).length===1);
const expected={resolveMission:'60363040b40de491c28dd4ee7819fe291489fe48a16effae14b23966ad12f456',tacticalMissionTerminalState:'7789262fc140b640d81eb443b91d24bdf9daacfdbdbe2bbac7af5358a84a160c',tacticalAiMissionResolution:'3ef3c32a49421c2f353d95d6e18f9f46954ead16505df535cb66cd5e618cd702'};
for(const [name,hash] of Object.entries(expected)) add(`${name} byte-identical to Browser 1110 authority`,sha(extractFunction(source,name))===hash);
add('New Build Health suite registered',source.includes('function tacticalHorizonAtmosphericFadeWithSolidOcclusionContractChecks()')&&source.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_1230_HORIZON_FADE'));
for(const c of checks)console.log(`${c.pass?'PASS':'FAIL'} - ${c.name}`); const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed; console.log(`\nPassed: ${passed}/${checks.length}\nFailed: ${failed}`); process.exit(failed?1:0);
