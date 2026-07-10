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
  "First-base selection previews opening incidents and starting reach",
  "Solid Geoscape globe remains draggable during travel states",
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
