const fs=require('fs'),path=require('path');
const root=path.resolve(__dirname,'..');
const src=fs.readFileSync(path.join(root,'src','browser-runtime.html'),'utf8');
const checks=[
 ['build id',/const CURRENT_GAME_BUILD="v[0-9.]+_[A-Z0-9_]+"/.test(src)],
 ['patch flag',src.includes('TACTICAL_ACTIVE_ESCORT_EXTRACTION_PERSISTENCE_HOTFIX=true')],
 ['panic does not remove escort ownership',/function tacticalEscortFollowers[\s\S]*?\.filter\(\(unit\) => unit\.team === "civilian"[\s\S]*?unit\.escortId === escortId\)/.test(src)&&!(/function tacticalEscortFollowers[\s\S]{0,500}!unit\.panic/.test(src))],
 ['escort pace bypasses support reformation',src.includes('secureRescuePaceOverride=Boolean(followers.length||')],
 ['civilian catchup remains',src.includes('escort-catchup-half')&&src.includes('Math.floor(ordinaryEscortMaxSteps/2)')],
 ['priority contract included',src.includes('Active escort remains Priority 2 above visible alien contact')],
 ['save format 4',src.includes('const CURRENT_SAVE_FORMAT_VERSION=4')]
];
let ok=0; for(const [name,pass] of checks){console.log(`${pass?'PASS':'FAIL'} ${name}`); if(pass)ok++;}
console.log(`${ok}/${checks.length} checks passed`); process.exit(ok===checks.length?0:1);
