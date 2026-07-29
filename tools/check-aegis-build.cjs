const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const manifestPath = path.join(root, "src", "manifest.json");
const nativeContentPath = path.join(root, "godot", "data", "content.json");
const nativeMainPath = path.join(root, "godot", "scripts", "main.gd");
const nativeTacticalPath = path.join(root, "godot", "scripts", "tactical_board.gd");
const nativeAudioBusPath = path.join(root, "godot", "default_bus_layout.tres");
const dialogueDirectory = path.join(root, "assets", "audio", "dialogue");
const dialogueManifestPath = path.join(dialogueDirectory, "manifest.js");

const html = fs.readFileSync(indexPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
const nativeContent = JSON.parse(fs.readFileSync(nativeContentPath, "utf8"));
const nativeMain = fs.readFileSync(nativeMainPath, "utf8");
const nativeTactical = fs.readFileSync(nativeTacticalPath, "utf8");
const nativeAudioBus = fs.readFileSync(nativeAudioBusPath, "utf8");
const dialogueBox = { window: {} };
vm.runInNewContext(fs.readFileSync(dialogueManifestPath, "utf8"), dialogueBox, { filename: dialogueManifestPath });
const dialogue = dialogueBox.window.PROJECT_AEGIS_RECORDED_DIALOGUE;

const required = [
  manifest.currentBuild,
  `CURRENT_GAME_VERSION=\"${manifest.currentBuild.match(/^v[^_]+/)?.[0] || ""}\"`,
  "ARCHITECTURE_MODULE_PLAN",
  "Modular source layout and engine-port prep contract is present",
  "Workshop production preserves destination base and equipment logistics summaries",
  "Base transfer logistics charge fees and cancel back to origin",
  "Base transfer Logistics Center lists payloads and supports bulk equipment quantities",
  "Base-local loadout buttons only advertise selected-base stock",
  "Mission confirmation explains local loadout and launch base",
  "Aircraft ferry staging checks open hangars and refuel legs",
  "New-base placement previews separated Interceptor and Skyranger ferry lanes",
  "Interceptor UFO tracking recognizes ferry-staged reach",
  "Loaded saves preserve interceptor eligibility and active travel",
  "Attached save supports reserved-home and multi-hop interceptor ferry routes",
  "Returning interceptors release departed staging hangars without losing home reservations",
  "Ready aircraft can ferry home or rebase through clock-tracked routes",
  "Aircraft relocation reserves destination hangars across save resume",
  "Aircraft relocation queue preserves reservations and unavailable status",
  "Alien incident duration advances by combat rounds instead of a full day",
  "Aircraft ferry range and home return preserve direct staged and repeat-attack routes",
  "Staged aircraft routes display origin ferry legs",
  "Staged interceptor route timeline and return decision are restored",
  "Staged Skyranger route timeline includes ferry refuel incident and return legs",
  "Staged aircraft route labels and day-night globe lighting are readable",
  "Skyranger ferry staging extends incident response range",
  "First-base selection previews opening incidents and starting reach",
  "Solid Geoscape globe uses opaque detailed landmasses and remains draggable",
  "Three.js tactical readability overlay summarizes selected unit cover weapon and turn",
  "Three.js tactical incident battle polish preserves terrain LOS movement and ammo readability",
  "Procedural tactical biomes generate wilderness streams city roads farms and small towns",
  "Tactical building archetypes share passable interiors across 2D and Three.js maps",
  "Continuous tactical walls open traversable breaches for every unit type",
  "Tactical enclosures and street props remain gameplay-only terrain",
  "Three.js tactical performance mode caps expensive rendering and idles on demand",
  "Three.js tactical instanced ground preserves picking gapless hexes and 2D recovery",
  "Tactical lighting is removed from gameplay and render hot paths",
  "Tactical civilians rescue actions and breach feedback share 2D and 3D state",
  "Tactical rescue extraction state and mission-intent rewards stay distinct from casualties",
  "Mandatory civilian objectives continue through a bounded secure rescue phase",
  "AI mandatory rescue phase searches escorts and extracts before resolution",
  "Skyranger ramp civilian escorts follow bounded paths and recover from panic",
  "Escort chains reserve single-file cells and panic favors broken sightlines",
  "Reload and fire-mode changes are authoritative for the next tactical action",
  "Selected escorts report bounded formation state and ramp distance",
  "AI tactical handoff preserves the live battlefield and prioritizes spotted civilians",
  "AI tactical map playback follows squad movement rescue and combat action",
  "AI commanders unlock experienced doctrine and bounded formation roles",
  "Fire-mode reaction shots use Reaction stat ammo and reserved TU",
  "Alien AI hunts humans through bounded cover while AI playback preserves fog",
  "Classic battlescape console exposes real map inventory stance reserve done and dust-off controls",
  "Tactical deployment exposes functional right and left hand slots",
  "Frag Grenade preparation spends four TU and enters explicit targeting",
  "Frag Grenade blast is seven-hex bounded and opens traversable rubble",
  "AI command can return the live battle to player control",
  "AI rescue routing rotates soldiers and rejects two-cell loops",
  "AI tactical soldier voices are queued and audio-unlocked",
  "Dedicated voice bus has independent volume and mute gain",
  "Voice preferences normalize and persist independently from SFX",
  "Audio settings expose voice toggle slider and user-gesture playback test",
  "AI tactical playback emits bounded context-aware soldier dialogue",
  "Three.js Skyranger renders one cohesive craft with attached extraction ramp",
  "Geoscape range and ferry controls share one operational overlay section",
  "UFO alert speed selection retains the active command screen",
  "Port tactical visibility and turns use indexed bounded passes",
  "Three.js isometric tactical framing preserves vertical proportions",
  "All tactical battle views animate surviving soldiers after victory",
  "Classic lineup victory dance moves paper dolls without moving soldier cards",
  "Day-night terminator map follows Geoscape clock and preserves operational layers",
  "Recorded command aircraft and soldier dialogue uses segmented cached playback",
  "Recorded computer and aircraft dialogue use distinct transmission effects",
  "Geoscape computer and aircraft dialogue share an ordered queue",
  "Base computer voice uses metallic robotic processing",
  "Soldier dialogue uses radio static bookends and gates strategic aircraft playback",
  "Three.js tactical ground shares exact 2D cell gradients",
  "Three.js tactical hex centers and footprints match the 2D board",
  "Three.js tactical seam underlay closes raster junctions",
  "Medkit issue and return conserve local Base Inventory",
  "Tactical Medkit use spends 12 TU heals 12 HP and consumes one charge",
  "Manual tactical final HP drives bounded wounded recovery",
  "Browser and native medical gameplay share an explicit parity contract",
  "paired-browser-godot",
  "aircraftOccupiesHangarSlot",
  "changeSoldierMedkitState",
  "tacticalMedkitUseResult",
  "applyTacticalMedicalGrowth",
  "recoverUnusedKiaMedkits",
  "Use Medkit - 12 TU",
  "PROJECT_AEGIS_RECORDED_DIALOGUE",
  "playRecordedDialogue",
  "recordedDialogueFxProfile",
  "recordedDialogueStaticBookends",
  "recordedDialogueShouldQueue",
  "voiceVolumeToGain",
  "VOICE_SETTINGS_STORAGE_KEY",
  "data-aegis-voice-control",
  "testVoicePlayback",
  "tacticalAiFrameDialogueCue",
  "tacticalAiCommanderForUnits",
  "tacticalAiDoctrineForCommander",
  "tacticalAiMovePlan",
  "tacticalReactionShotResult",
  "tacticalReserveTuForMode",
  "tacticalGrenadePrimeResult",
  "tacticalGrenadeThrowResult",
  "tacticalGrenadeBlastCells",
  "tacticalAiRoundRobinUnits",
  "tacticalAiRescueRoute",
  "tacticalAiExtractionEgress",
  "tacticalAiExtractionRoute",
  "takeBackAiCommand",
  "cancelAiPlaybackTimers",
  "Hands / Targeting",
  "connectRecordedDialogueVoiceFx",
  "enqueueRecordedDialogue",
  "dialogueSoldierTail",
  "metallicDelay",
  "tacticalBiome.sky",
  "TACTICAL_THREE_MAX_GROUND_PALETTES",
  "tacticalThreeGroundPalette",
  "tacticalCivilianObjectiveProgress",
  "tacticalAiShouldContinueRescue",
  "tacticalAiMissionResolution",
  "deferredGeoscapeSpeed",
  "tacticalCellVisual",
  "tacticalThreeWorldForCell",
  "tacticalCreateThreeHexGeometry",
  "groundPaletteBatches",
  "tacticalThreeHexGeometrySpec",
  "tacticalConnectedStructuralWalls",
  "bridgeScaleY",
  "recordedDialogueStyleForSoldier",
  "data-aegis-recorded-dialogue=\"segmented-takes\"",
  "runSelfTests"
];

const missing = required.filter((needle) => !html.includes(needle));

if (manifest.playableArtifact !== "index.html") {
  missing.push("manifest playableArtifact must remain index.html");
}

if (manifest.preserveSingleFileArtifact !== true) {
  missing.push("manifest preserveSingleFileArtifact must be true");
}

if (manifest.gameplayParity?.policy !== "paired-browser-godot") {
  missing.push("manifest gameplayParity policy must require paired browser/Godot gameplay patches");
}

if (manifest.gameplayParity?.browserBuild !== manifest.currentBuild) {
  missing.push("manifest gameplayParity browserBuild must match currentBuild");
}

if (manifest.gameplayParity?.nativeBuild !== manifest.nativePrototype?.build || nativeContent.build !== manifest.nativePrototype?.build) {
  missing.push("manifest and Godot content native build labels must match");
}
if (!nativeMain.includes(manifest.nativePrototype?.build || "")) {
  missing.push("Godot main scene build label must match the manifest native build");
}
for (const nativeNeedle of [
  "func reclaim_ai_command",
  "func _ai_rescue_plan",
  "func _ai_extraction_plan",
  "ai_last_acted_ids",
  "voice_queue",
  "func _play_next_voice",
  "voice_player",
  "func _show_audio_settings",
  "func _set_voice_enabled",
  "func _set_voice_volume",
]) {
  if (!nativeMain.includes(nativeNeedle) && !nativeTactical.includes(nativeNeedle)) {
    missing.push(`native tactical recovery seam missing: ${nativeNeedle}`);
  }
}
if (!nativeAudioBus.includes('bus/3/name = &"Voices"') || !nativeAudioBus.includes('bus/3/send = &"Master"')) {
  missing.push("native Voices bus must route independently to Master");
}

if (manifest.gameplayParity?.saveFormat !== manifest.saveFormat || nativeContent.save_format !== manifest.saveFormat) {
  missing.push("browser/native gameplay parity must preserve the shared save format");
}

if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "multi-base-aircraft-ferry-routing" && entry?.reason)) {
  missing.push("browser-only multi-base ferry routing must be recorded as a temporary gameplay parity exception");
}

const nativeMedkit = nativeContent.field_items?.find((item) => item.id === "Medkit");
if (nativeMedkit?.heal !== 12 || nativeMedkit?.tu_cost !== 12) {
  missing.push("native Medkit must preserve the paired 12 HP / 12 TU contract");
}
const nativeGrenade = nativeContent.field_items?.find((item) => item.id === "Frag Grenade");
if (nativeGrenade?.prime_tu !== 4 || nativeGrenade?.throw_tu !== 12 || nativeGrenade?.range !== 6 || nativeGrenade?.damage !== 28 || nativeGrenade?.edge_damage !== 16) {
  missing.push("native Frag Grenade must preserve the paired prime throw range and damage contract");
}

for (const system of [
  "base-local-medkit-issue-return",
  "tactical-self-treatment-12hp-12tu",
  "one-charge-consumption",
  "final-hp-wounded-recovery",
  "victory-recovery-defeat-loss",
  "rank-experience-commander-doctrine",
  "commander-centered-formation-roles",
  "bounded-cover-aware-movement",
  "fire-mode-tu-reservation",
  "reaction-fire-during-alien-movement",
  "civilian-escort-reaction-reservation",
  "alien-human-priority-cover-advance",
  "ai-command-live-fog-of-war",
  "classic-map-inventory-stance-reserve-done-dustoff-controls",
  "tactical-right-left-hand-slots",
  "explicit-fire-grenade-targeting",
  "standard-frag-prime-throw-tu",
  "bounded-seven-hex-blast-breach",
  "tactical-ai-command-reclaim",
  "round-robin-ai-soldier-scheduling",
  "bounded-rescue-route-anti-loop",
  "queued-tactical-voice-recovery",
  "dedicated-voice-bus-controls",
]) {
  if (!manifest.gameplayParity?.requiredSystems?.includes(system)) {
    missing.push(`gameplay parity system missing: ${system}`);
  }
}

if (!nativeContent.soldiers?.every((soldier) => Number.isFinite(soldier.reactions))) {
  missing.push("native soldiers must expose Reaction stats for tactical interruption fire");
}

if (!manifest.gameplayParity?.temporaryExceptions?.some((entry) => entry?.system === "complete-classic-battlescape-command-set" && entry?.reason)) {
  missing.push("remaining classic battlescape command depth must be recorded as a temporary gameplay parity exception");
}

const dialogueWavFiles = fs.readdirSync(dialogueDirectory).filter((name) => name.toLowerCase().endsWith(".wav"));
const dialogueVariants = Object.values(dialogue?.events || {}).flatMap((event) => Object.values(event.variants || {}));
if (dialogue?.recordingCount !== 105 || dialogueWavFiles.length !== 105 || dialogueVariants.length !== 105) {
  missing.push("recorded dialogue manifest must cover all 105 WAV recordings");
}
if ((dialogue?.takeCount || 0) < 300) {
  missing.push("recorded dialogue manifest must expose at least 300 segmented takes");
}
for (const variant of dialogueVariants) {
  const sourcePath = path.join(dialogueDirectory, variant.source || "");
  if (!variant.source || !fs.existsSync(sourcePath)) missing.push(`dialogue source missing: ${variant.source || "unknown"}`);
  if (!Array.isArray(variant.takes) || !variant.takes.length || variant.takes.some((take) => take.start < 0 || take.duration <= 0 || take.start + take.duration > variant.sourceDuration + 0.01)) {
    missing.push(`dialogue take bounds invalid: ${variant.source || "unknown"}`);
  }
}
for (const eventKey of ["mission_successful", "ufo_contact_detected", "lifting_off", "ramp_going_down", "copy", "moving", "reloading", "target_down", "im_hit"]) {
  if (!dialogue?.events?.[eventKey]) missing.push(`required recorded dialogue event missing: ${eventKey}`);
}
for (const style of ["steady_professional", "aggressive_hotshot", "grim", "nervous_but_determined"]) {
  if (!dialogue?.events?.moving?.variants?.[style]) missing.push(`movement dialogue style missing: ${style}`);
}

if (missing.length) {
  console.error("Project Aegis build seam check failed:");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Project Aegis build seam check passed for ${manifest.currentBuild}`);
