const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const requestedHtmlPaths = process.argv.slice(2);
const htmlPaths = requestedHtmlPaths.length
  ? requestedHtmlPaths.map((htmlPath) => path.resolve(process.cwd(), htmlPath))
  : [
      path.join(root, "index.html"),
      path.join(root, "AEGIS_Articulated_Pose_Editor_CURRENT.html"),
      path.join(root, "AEGIS_Articulated_Pose_Editor_v0.26.08.26.0033_APPROVED_ARTICULATED_POSE_SET_PATCH.html"),
      path.join(root, "AEGIS_Articulated_Pose_Editor_v0.26.08.25.2356_ARTICULATED_SINGLE_RIFLE_AND_POSE_EDITOR_TOOL_PATCH.html"),
    ];
const blocks = htmlPaths.flatMap((htmlPath) => {
  const html = fs.readFileSync(htmlPath, "utf8");
  return [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
    .map((match, index) => ({ source: match[1], filename: `${path.basename(htmlPath)}#script-${index + 1}` }))
    .filter((entry) => entry.source.trim());
});

const failures = [];
blocks.forEach(({ source, filename }) => {
  try {
    new vm.Script(source, { filename });
  } catch (error) {
    failures.push(`${filename}: ${error.message}`);
  }
});

if (failures.length) {
  console.error("Project Aegis embedded JavaScript syntax check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Project Aegis embedded JavaScript syntax check passed (${blocks.length} non-empty blocks across ${htmlPaths.length} HTML files).`);
