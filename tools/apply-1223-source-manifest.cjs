const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 1223.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("Refusing lossy update: src/manifest.json is missing gameplayParity.");process.exit(1);}
manifest.currentBuild="v0.26.09.10.1223_CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX";
manifest.lastInspectedBuild="v0.26.09.10.1223_CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX";
manifest.status="classic-lineup-visible-target-outcome-preserving-fast-pacing-hotfix-complete";
manifest.gameplayParity={...manifest.gameplayParity,browserBuild:"v0.26.09.10.1223_CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX"};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 1223 without replacing unrelated content.");
