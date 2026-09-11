const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
const build="v0.26.09.11.0915_CLASSIC_LINEUP_MOBILE_LANDSCAPE_READABILITY_AND_COMPACT_LAYOUT_PATCH";
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 0915.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("Refusing lossy update: src/manifest.json is missing gameplayParity.");process.exit(1);}
manifest.currentBuild=build;
manifest.lastInspectedBuild=build;
manifest.status="classic-lineup-mobile-landscape-readability-compact-layout-complete";
manifest.gameplayParity={...manifest.gameplayParity,browserBuild:build};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 0915 without replacing unrelated content.");
