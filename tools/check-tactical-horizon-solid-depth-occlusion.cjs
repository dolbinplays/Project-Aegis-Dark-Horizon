const fs=require('fs'),crypto=require('crypto');
const runtimePath=process.argv[2]||'src/browser-runtime.html';
const source=fs.readFileSync(runtimePath,'utf8');
const build='v0.26.09.11.1110_TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX';
function extractFunction(src,name){
  const key=`function ${name}`; const start=src.indexOf(key); if(start<0) throw new Error(`Missing ${name}`);
  let paren=src.indexOf('(',start),pdepth=0,quote=null,escape=false,lineComment=false,blockComment=false,body=-1;
  for(let i=paren;i<src.length;i++){const c=src[i],n=src[i+1]; if(lineComment){if(c==='\n')lineComment=false;continue;} if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;} if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote)quote=null; continue;} if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;} if(c==='"'||c==="'"||c==='`'){quote=c;continue;} if(c==='(')pdepth++; else if(c===')'&&--pdepth===0){body=src.indexOf('{',i+1);break;}}
  if(body<0)throw new Error(`Missing body ${name}`); let depth=0;quote=null;escape=false;lineComment=false;blockComment=false;
  for(let i=body;i<src.length;i++){const c=src[i],n=src[i+1]; if(lineComment){if(c==='\n')lineComment=false;continue;} if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;}continue;} if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote)quote=null;continue;} if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;} if(c==='"'||c==="'"||c==='`'){quote=c;continue;} if(c==='{')depth++; else if(c==='}'&&--depth===0)return src.slice(start,i+1);}
  throw new Error(`Unclosed ${name}`);
}
function sha(t){return crypto.createHash('sha256').update(t).digest('hex');}
const checks=[]; const add=(n,p)=>checks.push({name:n,pass:Boolean(p)});
add('Current runtime build is Browser 1110',source.includes(`const CURRENT_GAME_BUILD="${build}"`));
add('Solid horizon occlusion hotfix flag present',source.includes('const TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX=true'));
add('Browser 1046 horizon flag retained',source.includes('const TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH=true'));
const override=extractFunction(source,'tacticalThreePersistentBuildPerspectiveBackdropDepthContinuity');
add('Distant solid batches are explicitly opaque',override.includes('transparent:false')&&override.includes('opacity:1'));
add('Distant solid batches write depth',override.includes('depthWrite:true')&&override.includes('depthTest:true'));
add('Distant solid batches advertise occlusion authority',override.includes('aegisSolidDepthOcclusion=true'));
add('Old alpha-opacity makeBatch parameter removed',!override.includes('makeBatch=(items,geometry,name,opacity)'));
add('Consolidated haze remains separate and transparent',override.includes('hazeMaterial=new THREE.MeshBasicMaterial')&&override.includes('transparent:true,opacity:.16,depthWrite:false'));
add('Window batch remains depth-tested but non-depth-writing',override.includes('seeded-emissive-window-atlas-batch')&&override.includes('depthWrite:false,depthTest:true'));
add('Occlusion diagnostic dataset present',override.includes('aegisPerspectiveBackdropSolidOcclusion="depth-write"'));
add('Horizon renderer still creates no point lights',!override.includes('new THREE.PointLight'));
add('Horizon renderer remains outside tactical pickables/cover/LOS',!override.includes('pickables.push')&&!override.includes('tacticalCover')&&!override.includes('hasLineOfSight'));
const world=extractFunction(source,'tacticalThreePersistentBuildWorldContinuation');
add('Map-edge continuation scenery remains depth-writing',world.includes('sceneryMaterial=new THREE.MeshBasicMaterial')&&world.includes('depthWrite:true'));
add('Current patch history entry present',source.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Tactical Horizon Solid Building Depth Occlusion Hotfix"'));
add('Browser 1046 history frozen literal',source.includes('build:"v0.26.09.11.1046_TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH",date:"September 11, 2026",title:"Tactical Horizon Depth + Distant Building Continuity"'));
const app=extractFunction(source,'AlienResponseCommand');
add('Exactly one mutable current history entry remains',(app.match(/\{build:CURRENT_GAME_BUILD,date:/g)||[]).length===1);
add('Save format remains 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4\s*;/.test(source));
add('Exactly one literal finishAiPlayback declaration remains',(source.match(/function finishAiPlayback\(\)\{/g)||[]).length===1);
const expected={resolveMission:'60363040b40de491c28dd4ee7819fe291489fe48a16effae14b23966ad12f456',tacticalMissionTerminalState:'7789262fc140b640d81eb443b91d24bdf9daacfdbdbe2bbac7af5358a84a160c',tacticalAiMissionResolution:'3ef3c32a49421c2f353d95d6e18f9f46954ead16505df535cb66cd5e618cd702'};
for(const [name,hash] of Object.entries(expected)) add(`${name} byte-identical to Browser 1046/0915 authority`,sha(extractFunction(source,name))===hash);
add('New Build Health suite registered',source.includes('function tacticalHorizonSolidBuildingDepthOcclusionContractChecks()')&&source.includes('AEGIS_POST_DEFERRED_BUILD_HEALTH_RUNNER_BEFORE_1110_HORIZON_OCCLUSION'));
for(const c of checks)console.log(`${c.pass?'PASS':'FAIL'} - ${c.name}`); const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed; console.log(`\nPassed: ${passed}/${checks.length}\nFailed: ${failed}`); process.exit(failed?1:0);
