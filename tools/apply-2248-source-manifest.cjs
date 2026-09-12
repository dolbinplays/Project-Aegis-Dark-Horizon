#!/usr/bin/env node
const fs=require("fs");
const path=require("path");
const root=process.cwd();
const manifestPath=path.join(root,"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run from the Project Aegis repository root.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("src/manifest.json is missing gameplayParity; refusing destructive reconstruction.");process.exit(1);}
manifest.currentBuild="v0.26.09.11.2248_TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_AND_DRAGGING_PATCH";
manifest.lastInspectedBuild="v0.26.09.11.2248_TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_AND_DRAGGING_PATCH";
manifest.status="tactical-casualty-care-phase-1-complete";
manifest.gameplayParity.browserBuild="v0.26.09.11.2248_TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_AND_DRAGGING_PATCH";
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 2248 without replacing unrelated manifest data.");
