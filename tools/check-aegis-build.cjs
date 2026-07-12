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
  "Aircraft ferry range and home return preserve direct staged and repeat-attack routes",
  "Staged aircraft routes display origin ferry legs",
  "Staged interceptor route timeline and return decision are restored",
  "Staged Skyranger route timeline includes ferry refuel incident and return legs",
  "Staged aircraft route labels and day-night globe lighting are readable",
  "Skyranger ferry staging extends incident response range",
  "First-base selection previews opening incidents and starting reach",
  "Solid Geoscape globe uses opaque detailed landmasses and remains draggable",
  "Three.js tactical readability overlay summarizes selected unit cover weapon and turn",
  "Three.js tactical incident battle polish shows terrain colors LOS movement ammo and 3D defaults",
  "Procedural tactical biomes generate wilderness streams city roads farms and small towns",
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
