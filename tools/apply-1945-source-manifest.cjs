const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 1945.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
manifest.currentBuild="v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH";
manifest.lastInspectedBuild="v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH";
manifest.status="mobile-tactical-status-hud-complete";
manifest.gameplayParity={...(manifest.gameplayParity||{}),browserBuild:"v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH"};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH without replacing unrelated manifest content.");
