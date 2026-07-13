const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const indexPath = path.join(root, "index.html");
const manifestPath = path.join(root, "src", "manifest.json");

const html = fs.readFileSync(indexPath, "utf8");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const required = [
  manifest.currentBuild,
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
  "Port tactical visibility and turns use indexed bounded passes",
  "Three.js isometric tactical framing preserves vertical proportions",
  "All tactical battle views animate surviving soldiers after victory",
  "Classic lineup victory dance moves paper dolls without moving soldier cards",
  "Day-night terminator map follows Geoscape clock and preserves operational layers",
  "runSelfTests"
];

const missing = required.filter((needle) => !html.includes(needle));

if (manifest.playableArtifact !== "index.html") {
  missing.push("manifest playableArtifact must remain index.html");
}

if (manifest.preserveSingleFileArtifact !== true) {
  missing.push("manifest preserveSingleFileArtifact must be true");
}

if (missing.length) {
  console.error("Project Aegis build seam check failed:");
  missing.forEach((item) => console.error(`- ${item}`));
  process.exit(1);
}

console.log(`Project Aegis build seam check passed for ${manifest.currentBuild}`);
