#!/usr/bin/env node
const fs=require("fs");
const path=require("path");
const root=process.cwd();
const manifestPath=path.join(root,"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run from the Project Aegis repository root.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("src/manifest.json is missing gameplayParity; refusing destructive reconstruction.");process.exit(1);}
manifest.currentBuild="v0.26.09.11.1532_PROCEDURAL_BUILDING_FULL_DISCOVERED_PERIMETER_RENDER_HOTFIX";
manifest.lastInspectedBuild="v0.26.09.11.1532_PROCEDURAL_BUILDING_FULL_DISCOVERED_PERIMETER_RENDER_HOTFIX";
manifest.status="procedural-building-full-discovered-perimeter-render-hotfix-complete";
manifest.gameplayParity.browserBuild="v0.26.09.11.1532_PROCEDURAL_BUILDING_FULL_DISCOVERED_PERIMETER_RENDER_HOTFIX";
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to v0.26.09.11.1532_PROCEDURAL_BUILDING_FULL_DISCOVERED_PERIMETER_RENDER_HOTFIX without replacing unrelated manifest data.");
