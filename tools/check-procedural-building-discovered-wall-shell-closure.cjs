const fs=require('fs');
const path=require('path');
const crypto=require('crypto');
const root=process.cwd();
const runtimePath=path.join(root,'src','browser-runtime.html');
const runtime=fs.readFileSync(runtimePath,'utf8');
const BUILD='v0.26.09.11.1410_PROCEDURAL_BUILDING_DISCOVERED_WALL_SHELL_CLOSURE_PATCH';
const BASE='v0.26.09.11.1254_TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX';
const expectedHashes={
  resolveMission:'60363040b40de491c28dd4ee7819fe291489fe48a16effae14b23966ad12f456',
  tacticalMissionTerminalState:'7789262fc140b640d81eb443b91d24bdf9daacfdbdbe2bbac7af5358a84a160c',
  tacticalAiMissionResolution:'3ef3c32a49421c2f353d95d6e18f9f46954ead16505df535cb66cd5e618cd702',
  tacticalBuildingPlans:'f77087d6dba9a04008e36784ad3181dfbd1f4e50b417aaaea25117a50014a473',
  tacticalBuildingCovers:'c3070bf9b0414f2e48c62aff7646352d66a408b058537bc3f97257e75815b6b0',
  makeBattlefield:'a0512bda277a92c8ce8d244b46f79dbc1a3efd9024e98c9fe6202437f5355df2'
};
function extractFunction(src,name){
  const m=new RegExp(`function\\s+${name}\\s*\\(`).exec(src); if(!m) throw new Error(`missing ${name}`);
  const start=m.index, openParen=src.indexOf('(',m.index), len=src.length;
  let parenDepth=0,state='code',quote='',i=openParen,closeParen=-1;
  for(;i<len;i++){
    const c=src[i],n=src[i+1]||'';
    if(state==='code'){
      if(c==='"'||c==="'"||c==='`'){state='str';quote=c;}
      else if(c==='/'&&n==='/'){state='line';i++;}
      else if(c==='/'&&n==='*'){state='block';i++;}
      else if(c==='(')parenDepth++;
      else if(c===')'&&--parenDepth===0){closeParen=i;break;}
    } else if(state==='str'){
      if(c==='\\')i++; else if(c===quote){state='code';quote='';}
    } else if(state==='line'){if(c==='\n')state='code';}
    else if(state==='block'&&c==='*'&&n==='/'){state='code';i++;}
  }
  const brace=src.indexOf('{',closeParen+1); let depth=0; state='code';quote='';
  for(i=brace;i<len;i++){
    const c=src[i],n=src[i+1]||'';
    if(state==='code'){
      if(c==='"'||c==="'"||c==='`'){state='str';quote=c;}
      else if(c==='/'&&n==='/'){state='line';i++;}
      else if(c==='/'&&n==='*'){state='block';i++;}
      else if(c==='{')depth++;
      else if(c==='}'&&--depth===0)return src.slice(start,i+1);
    } else if(state==='str'){
      if(c==='\\')i++; else if(c===quote){state='code';quote='';}
    } else if(state==='line'){if(c==='\n')state='code';}
    else if(state==='block'&&c==='*'&&n==='/'){state='code';i++;}
  }
  throw new Error(`unterminated ${name}`);
}
function hashFunction(name){return crypto.createHash('sha256').update(extractFunction(runtime,name)).digest('hex');}
const helper=extractFunction(runtime,'tacticalThreeBuildingPresentationCovers');
const discover=extractFunction(runtime,'tacticalThreeDiscoveredBuildingIds');
const buildingCovers=extractFunction(runtime,'tacticalBuildingCovers');
const legacy=extractFunction(runtime,'TacticalIsoThreeView');
const persistent=extractFunction(runtime,'tacticalThreePersistentBuildCovers');
const checks=[]; const add=(name,pass)=>checks.push({name,pass:Boolean(pass)});
add('Browser 1410 runtime build identity',runtime.includes(`const CURRENT_GAME_BUILD="${BUILD}"`));
add('Save format remains four',runtime.includes('const CURRENT_SAVE_FORMAT_VERSION=4'));
add('Discovered wall shell patch flag present',runtime.includes('const PROCEDURAL_BUILDING_DISCOVERED_WALL_SHELL_CLOSURE_PATCH = true'));
add('Discovered-building helper present',runtime.includes('function tacticalThreeDiscoveredBuildingIds'));
add('Presentation-cover helper present',runtime.includes('function tacticalThreeBuildingPresentationCovers'));
add('Living AEGIS occupancy can discover building',discover.includes('unit?.team === "human"')&&discover.includes('tacticalBuildingCellAt'));
add('Legitimately revealed building records can discover building',discover.includes('if (!cover?.revealed) return')&&discover.includes('visible.has(tacticalKey'));
add('Only exterior wall/window records are synthesized',helper.includes('["wall", "window"].includes')&&!helper.includes('buildingPart: "partition"')&&!helper.includes('buildingPart:"partition"'));
add('Renderer-only pristine proxies are explicitly marked',helper.includes('aegisPresentationShell: true')&&helper.includes('presentationOnly: true'));
add('Presentation proxies cannot emit hidden interior lights',helper.includes('lightActive: false')&&helper.includes('lightType: null'));
add('Revealed structural state always wins over proxy',helper.includes('actual.some(cover => cover.revealed)'));
add('Hidden wall/window records are replaced only inside presentation list',helper.includes('const output = source.filter')&&helper.includes('!cover.revealed'));
add('Door cells stay absent from procedural structural cover authority',buildingCovers.includes('if(!cell?.perimeter||cell.door)continue'));
add('Browser 1855 connector authority remains present',runtime.includes('const PROCEDURAL_BUILDING_WALL_CONNECTOR_INTEGRITY_PATCH = true')&&runtime.includes('function tacticalConnectedStructuralWalls')&&runtime.includes('function tacticalStructuralConnectorOwnedBy'));
add('Legacy Three renderer consumes presentation covers',legacy.includes('tacticalThreeBuildingPresentationCovers')&&legacy.includes('presentationCovers.filter'));
add('Persistent Three renderer consumes presentation covers',persistent.includes('tacticalThreeBuildingPresentationCovers')&&persistent.includes('presentationCovers.filter'));
add('Renderer exposes active proxy diagnostic',legacy.includes('aegisBuildingShellProxyCount')&&persistent.includes('aegisBuildingShellProxyCount'));
add('In-runtime discovered shell regression registered',runtime.includes('const tacticalDiscoveredBuildingWallShellClosureTest=(()=>')&&runtime.includes('Discovered enterable buildings render a continuous pristine wall shell until unseen damage is actually revealed'));
add('Browser 2251 roof cutaway retained',runtime.includes('v0.26.08.24.2251_TACTICAL_BUILDING_ROOFS_AND_PLAYER_AWARE_CUTAWAY_PATCH')&&runtime.includes('tacticalBuildingRoofCutawayModel'));
add('Browser 1254 horizon treatment retained',runtime.includes('TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX'));
add('Mission resolver byte-identical to Browser 1254',hashFunction('resolveMission')===expectedHashes.resolveMission);
add('Terminal-state authority byte-identical to Browser 1254',hashFunction('tacticalMissionTerminalState')===expectedHashes.tacticalMissionTerminalState);
add('AI resolution authority byte-identical to Browser 1254',hashFunction('tacticalAiMissionResolution')===expectedHashes.tacticalAiMissionResolution);
add('Procedural building plans byte-identical to Browser 1254',hashFunction('tacticalBuildingPlans')===expectedHashes.tacticalBuildingPlans);
add('Procedural building cover generation byte-identical to Browser 1254',hashFunction('tacticalBuildingCovers')===expectedHashes.tacticalBuildingCovers);
add('Battlefield generation byte-identical to Browser 1254',hashFunction('makeBattlefield')===expectedHashes.makeBattlefield);
add('Exactly one active finishAiPlayback declaration',(runtime.match(/function finishAiPlayback\(\)\{/g)||[]).length===1);
add('Exactly one mutable patch-history record',(runtime.match(/PATCH_NOTES_HISTORY\.unshift\(\{build:CURRENT_GAME_BUILD,date:/g)||[]).length===1);
add('Browser 1254 history entry frozen',runtime.includes(`PATCH_NOTES_HISTORY.unshift({build:"${BASE}"`));
add('Browser 1410 patch notes present',fs.readFileSync(path.join(root,'README_PATCH_NOTES.txt'),'utf8').includes(BUILD));
add('Browser 1410 roadmap header synchronized',fs.readFileSync(path.join(root,'Project_Aegis_Alien_Response_Command_Updated_Roadmap_and_Game_Bible.md'),'utf8').includes(`Current browser build: \`${BUILD}\``));
add('Browser 1410 Codex handoff present',fs.existsSync(path.join(root,'CODEX_HANDOFF_PROCEDURAL_BUILDING_DISCOVERED_WALL_SHELL_CLOSURE_PATCH.md')));
add('Browser 1410 field acceptance present',fs.existsSync(path.join(root,'PROCEDURAL_BUILDING_DISCOVERED_WALL_SHELL_CLOSURE_FIELD_ACCEPTANCE.txt')));
add('Browser 1410 manifest updater present',fs.existsSync(path.join(root,'tools','apply-1410-source-manifest.cjs'))&&fs.existsSync(path.join(root,'APPLY_1410_SOURCE_MANIFEST.bat'))&&fs.existsSync(path.join(root,'src','manifest.1410.merge.json')));
let passed=0; for(const c of checks){console.log(`${c.pass?'PASS':'FAIL'} - ${c.name}`);if(c.pass)passed++;}
console.log(`\nPassed: ${passed}/${checks.length}`); console.log(`Failed: ${checks.length-passed}`); if(passed!==checks.length)process.exit(1);
