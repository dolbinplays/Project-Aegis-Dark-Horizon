const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
const build="v0.26.09.11.1230_TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX";
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 1230.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("Refusing lossy update: src/manifest.json is missing gameplayParity.");process.exit(1);}
manifest.currentBuild=build;
manifest.lastInspectedBuild=build;
manifest.status="tactical-horizon-atmospheric-fade-with-solid-occlusion-hotfix-complete";
manifest.gameplayParity={...manifest.gameplayParity,browserBuild:build};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 1230 without replacing unrelated content.");
