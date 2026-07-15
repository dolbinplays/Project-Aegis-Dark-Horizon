const fs = require("fs");
const path = require("path");
const vm = require("vm");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const manifestPath = path.join(root, "src", "manifest.json");
const dialogueDirectory = path.join(root, "assets", "audio", "dialogue");
const dialogueManifestPath = path.join(dialogueDirectory, "manifest.js");

const html = fs.readFileSync(indexPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));
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
  "Tactical enclosures and street props remain gameplay-only terrain",
  "Three.js tactical performance mode caps expensive rendering and idles on demand",
  "Three.js tactical instanced ground preserves picking gapless hexes and 2D recovery",
  "Tactical lighting is removed from gameplay and render hot paths",
  "Tactical civilians rescue actions and breach feedback share 2D and 3D state",
  "Tactical rescue extraction state and mission-intent rewards stay distinct from casualties",
  "Skyranger ramp civilian escorts follow bounded paths and recover from panic",
  "Escort chains reserve single-file cells and panic favors broken sightlines",
  "Reload and fire-mode changes are authoritative for the next tactical action",
  "Selected escorts report bounded formation state and ramp distance",
  "AI tactical handoff preserves the live battlefield and prioritizes spotted civilians",
  "AI tactical map playback follows squad movement rescue and combat action",
  "Three.js Skyranger renders one cohesive craft with attached extraction ramp",
  "Geoscape range and ferry controls share one operational overlay section",
  "Port tactical visibility and turns use indexed bounded passes",
  "Three.js isometric tactical framing preserves vertical proportions",
  "All tactical battle views animate surviving soldiers after victory",
  "Classic lineup victory dance moves paper dolls without moving soldier cards",
  "Day-night terminator map follows Geoscape clock and preserves operational layers",
  "Recorded command aircraft and soldier dialogue uses segmented cached playback",
  "Recorded computer and aircraft dialogue use distinct transmission effects",
  "PROJECT_AEGIS_RECORDED_DIALOGUE",
  "playRecordedDialogue",
  "recordedDialogueFxProfile",
  "connectRecordedDialogueVoiceFx",
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
