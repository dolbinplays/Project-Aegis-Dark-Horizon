const fs=require('fs'),crypto=require('crypto'),vm=require('vm');
const runtimePath=process.argv[2]||'src/browser-runtime.html';
const source=fs.readFileSync(runtimePath,'utf8');
const build='v0.26.09.11.1046_TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH';
function extractFunction(src,name){
  const key=`function ${name}`; const start=src.indexOf(key); if(start<0) throw new Error(`Missing ${name}`);
  let paren=src.indexOf('(',start),pdepth=0,quote=null,escape=false,lineComment=false,blockComment=false,body=-1;
  for(let i=paren;i<src.length;i++){
    const c=src[i],n=src[i+1];
    if(lineComment){if(c==='\n') lineComment=false; continue;}
    if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;} continue;}
    if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote){quote=null;} continue;}
    if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='(') pdepth++; else if(c===')'&&--pdepth===0){body=src.indexOf('{',i+1);break;}
  }
  if(body<0) throw new Error(`Missing body ${name}`);
  let depth=0;quote=null;escape=false;lineComment=false;blockComment=false;
  for(let i=body;i<src.length;i++){
    const c=src[i],n=src[i+1];
    if(lineComment){if(c==='\n') lineComment=false; continue;}
    if(blockComment){if(c==='*'&&n==='/'){blockComment=false;i++;} continue;}
    if(quote){if(escape){escape=false;continue;} if(c==='\\'){escape=true;continue;} if(c===quote){quote=null;} continue;}
    if(c==='/'&&n==='/'){lineComment=true;i++;continue;} if(c==='/'&&n==='*'){blockComment=true;i++;continue;}
    if(c==='"'||c==="'"||c==='`'){quote=c;continue;}
    if(c==='{') depth++; else if(c==='}'&&--depth===0) return src.slice(start,i+1);
  }
  throw new Error(`Unclosed ${name}`);
}
function sha(text){return crypto.createHash('sha256').update(text).digest('hex');}
const checks=[]; const add=(name,pass)=>checks.push({name,pass:Boolean(pass)});
add('Current runtime build is Browser 1046',source.includes(`const CURRENT_GAME_BUILD="${build}"`));
add('Horizon depth patch flag present',source.includes('const TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH=true'));
add('Pure horizon planning helper present',source.includes('function tacticalPerspectiveHorizonDepthPlan('));
add('Near mid far depth layers present',source.includes('layerSpec={near:')&&source.includes('mid:{mix:')&&source.includes('far:{mix:'));
add('Atmospheric structure color blend present',source.includes('tacticalHorizonBlendColor(baseColor,fogColor'));
add('Quality-specific structure counts present',source.includes('qualityCounts=quality==="performance"')&&source.includes('quality==="quality"'));
add('Seeded bounded window caps present',source.includes('windowCap=quality==="performance"?64:quality==="quality"?160:112'));
add('Windows only allocated for urban/town non-day phases',source.includes('(profile.kind==="cityscape"||profile.kind==="town")&&phase!=="day"'));
add('Window presentation uses one instanced batch',source.includes('seeded-emissive-window-atlas-batch')&&source.includes('windowBatch=new THREE.InstancedMesh'));
const override=extractFunction(source,'tacticalThreePersistentBuildPerspectiveBackdropDepthContinuity');
add('Horizon renderer does not create point lights',!override.includes('new THREE.PointLight'));
add('Horizon renderer stays outside pickables',!override.includes('pickables.push')&&!override.includes('tacticalCover')&&!override.includes('hasLineOfSight'));
add('Horizon renderer exposes zero point-light diagnostic',override.includes('dataset.aegisPerspectiveBackdropPointLights="0"'));
add('Consolidated haze retained',override.includes('aegisConsolidatedHorizonHaze'));
add('Established perspective backdrop is layered rather than replaced elsewhere',source.includes('AEGIS_TACTICAL_THREE_PERSISTENT_BUILD_PERSPECTIVE_BACKDROP_BEFORE_1046'));
add('Map-edge continuation scenery shares the near atmospheric color treatment',source.includes('tacticalThreePersistentBuildWorldContinuationAtmosphericContinuity')&&source.includes('aegisAtmosphericDepthLayer="near-extension"'));
add('Urban perspective backdrop stays at four draw calls or fewer',override.includes('perspectiveBackdropDrawCalls=(boxBatch?1:0)+(coneBatch?1:0)+(windowBatch?1:0)+1'));
add('Browser 0915 mobile Classic flag remains present',source.includes('const CLASSIC_LINEUP_MOBILE_LANDSCAPE_READABILITY_AND_COMPACT_LAYOUT_PATCH=true'));
add('Browser 0745 Classic stabilization flag remains present',source.includes('const CLASSIC_LINEUP_STREAMING_VISIBILITY_AND_BATTLE_TEMPO_STABILIZATION_PATCH=true'));
add('Save format remains 4',/const CURRENT_SAVE_FORMAT_VERSION\s*=\s*4\s*;/.test(source));
add('Exactly one literal finishAiPlayback declaration remains',(source.match(/function finishAiPlayback\(\)\{/g)||[]).length===1);
add('Browser 0915 patch history is frozen',source.includes(`build:"v0.26.09.11.0915_CLASSIC_LINEUP_MOBILE_LANDSCAPE_READABILITY_AND_COMPACT_LAYOUT_PATCH"`));
add('Browser 1046 current patch history entry is present',source.includes('build:CURRENT_GAME_BUILD,date:"September 11, 2026",title:"Tactical Horizon Depth + Distant Building Continuity"'));
const expected={
 resolveMission:'60363040b40de491c28dd4ee7819fe291489fe48a16effae14b23966ad12f456',
 tacticalMissionTerminalState:'7789262fc140b640d81eb443b91d24bdf9daacfdbdbe2bbac7af5358a84a160c',
 tacticalAiMissionResolution:'3ef3c32a49421c2f353d95d6e18f9f46954ead16505df535cb66cd5e618cd702'
};
for(const [name,hash] of Object.entries(expected)) add(`${name} byte-identical to Browser 0915`,sha(extractFunction(source,name))===hash);
try{
  const blend=extractFunction(source,'tacticalHorizonBlendColor'),plan=extractFunction(source,'tacticalPerspectiveHorizonDepthPlan');
  const context={result:null,clamp:(v,a,b)=>Math.max(a,Math.min(b,v)),tacticalPerspectiveBackdropProfile:(m)=>String(m.kind).includes('Urban')?{kind:'cityscape',primary:0x263543,secondary:0x344756}:String(m.kind).includes('Town')?{kind:'town',primary:0x334139,secondary:0x46544b}:{kind:'forest',primary:0x233b31,secondary:0x315243},tacticalWorldContinuationProfile:(m)=>String(m.kind).includes('Urban')?{kind:'urban',scenery:0x2f3b45}:String(m.kind).includes('Town')?{kind:'town',scenery:0x3e4b42}:{kind:'forest',scenery:0x294234},tacticalAtmospherePaletteForMission:()=>({bottom:0x030814,lighting:{phase:'night'}}),tacticalWorldContinuationBounds:(r,t,g)=>{const horizonRadius=g>=96?84:g>=80?72:60,span=g>=96?118:g>=80?98:78,pad=48;return{horizonRadius,pad,centerX:0,centerZ:0,minX:-span/2,maxX:span/2,minZ:-span/2,maxZ:span/2,spanX:span,spanZ:span};},tacticalSeed:(m)=>{let h=2166136261;for(const c of String(m.id||'')){h^=c.charCodeAt(0);h=Math.imul(h,16777619)>>>0;}return h||1;}};
  vm.runInNewContext(`${blend}\n${plan}\nresult={city:tacticalPerspectiveHorizonDepthPlan({id:'qa-city',kind:'Urban Terror'},80,'auto','night'),repeat:tacticalPerspectiveHorizonDepthPlan({id:'qa-city',kind:'Urban Terror'},80,'auto','night'),forest:tacticalPerspectiveHorizonDepthPlan({id:'qa-forest',kind:'Alien Hunt'},96,'quality','day')};`,context,{timeout:2000});
  const {city,repeat,forest}=context.result,layers=new Set(city.structures.map(x=>x.layer)),maxDistance=Math.max(...city.structures.map(x=>x.distance),...city.silhouettes.map(x=>x.distance),0);
  add('Standalone plan generates all three urban depth layers',layers.has('near')&&layers.has('mid')&&layers.has('far'));
  add('Standalone plan keeps far geometry inside sky-edge cap',maxDistance<=city.skyEdge);
  add('Standalone night plan generates deterministic bounded windows',city.windows.length>0&&city.windows.length<=city.windowCap&&JSON.stringify(city.windows)===JSON.stringify(repeat.windows));
  add('Standalone night plan combines extension and horizon window sources',city.extensionWindowCount>0&&city.horizonWindowCount>0&&city.windows.some(x=>x.source==='map-edge-extension')&&city.windows.some(x=>x.source==='horizon'));
  add('Standalone day wilderness plan creates no windows',forest.windows.length===0);
}catch(error){console.error('Standalone horizon plan test error:',error); add('Standalone horizon plan executes',false);}
for(const c of checks) console.log(`${c.pass?'PASS':'FAIL'} - ${c.name}`);
const passed=checks.filter(c=>c.pass).length,failed=checks.length-passed; console.log(`\nPassed: ${passed}/${checks.length}\nFailed: ${failed}`); process.exit(failed?1:0);
