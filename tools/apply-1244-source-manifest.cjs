const fs=require("fs");
const path=require("path");
const root=path.resolve(__dirname,"..");
const file=path.join(root,"src","manifest.json");
if(!fs.existsSync(file)){console.error("Missing src/manifest.json; run this from the Project Aegis repository after overlaying the patch.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(file,"utf8"));
const BUILD="v0.26.09.09.1244_MOBILE_MISSIONS_ADAPTIVE_LAYOUT_PATCH";
manifest.currentBuild=BUILD;
manifest.lastInspectedBuild=BUILD;
manifest.status="mobile-missions-adaptive-layout-patch-complete";
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object")throw new Error("Existing source manifest is missing gameplayParity; refusing a lossy rewrite.");
manifest.gameplayParity.browserBuild=BUILD;
fs.writeFileSync(file,JSON.stringify(manifest,null,2)+"\n");
console.log("Synchronized src/manifest.json to",BUILD);
