#!/usr/bin/env node
const fs=require("fs");
const path=require("path");
const root=process.cwd();
const manifestPath=path.join(root,"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run from the Project Aegis repository root.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("src/manifest.json is missing gameplayParity; refusing destructive reconstruction.");process.exit(1);}
manifest.currentBuild="v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX";
manifest.lastInspectedBuild="v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX";
manifest.status="procedural-building-explicit-perimeter-seam-geometry-hotfix-complete";
manifest.gameplayParity.browserBuild="v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX";
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX without replacing unrelated manifest data.");
