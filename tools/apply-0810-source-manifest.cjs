const fs=require("fs");
const path=require("path");
const manifestPath=path.join(process.cwd(),"src","manifest.json");
if(!fs.existsSync(manifestPath)){console.error("Missing src/manifest.json. Run this from the repository root after overlaying Browser 0810.");process.exit(1);}
const manifest=JSON.parse(fs.readFileSync(manifestPath,"utf8"));
if(!manifest.gameplayParity||typeof manifest.gameplayParity!=="object"){console.error("Refusing lossy update: src/manifest.json is missing gameplayParity.");process.exit(1);}
manifest.currentBuild="v0.26.09.10.0810_CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH";
manifest.lastInspectedBuild="v0.26.09.10.0810_CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH";
manifest.status="classic-lineup-streamed-rolling-battle-planning-reinforcement-ufo-beam-patch-complete";
manifest.gameplayParity={...manifest.gameplayParity,browserBuild:"v0.26.09.10.0810_CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH"};
fs.writeFileSync(manifestPath,JSON.stringify(manifest,null,2)+"\n");
console.log("Updated src/manifest.json to Browser 0810 without replacing unrelated content.");
