const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 2018.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("Refusing lossy update: src/manifest.json is missing gameplayParity.");process.exit(1);}
manifest.currentBuild="v0.26.09.09.2018_CLASSIC_LINEUP_VIP_CIVILIAN_AND_VICTORY_PLAYBACK_PATCH";
manifest.lastInspectedBuild="v0.26.09.09.2018_CLASSIC_LINEUP_VIP_CIVILIAN_AND_VICTORY_PLAYBACK_PATCH";
manifest.status="classic-lineup-vip-civilian-and-victory-playback-complete";
manifest.gameplayParity={...manifest.gameplayParity,browserBuild:"v0.26.09.09.2018_CLASSIC_LINEUP_VIP_CIVILIAN_AND_VICTORY_PLAYBACK_PATCH"};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 2018 without replacing unrelated content.");
