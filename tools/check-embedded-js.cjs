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
function attributeValue(attributes, name) {
  const match = String(attributes || "").match(new RegExp(`\\b${name}\\s*=\\s*(["'])(.*?)\\1`, "i"));
  return match ? match[2] : "";
}

function embeddedScriptBlocks(html, filename, ancestry = []) {
  return [...html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/gi)].flatMap((match, index) => {
    const attributes = match[1] || "";
    const source = match[2] || "";
    const type = attributeValue(attributes, "type").trim().toLowerCase();
    const id = attributeValue(attributes, "id").trim();
    const blockName = `${filename}${ancestry.length ? `#${ancestry.join("#")}` : ""}#script-${index + 1}`;
    if (type === "application/octet-stream" && id === "aegis-runtime-payload") {
      try {
        const decoded = Buffer.from(source.trim(), "base64").toString("utf8");
        return embeddedScriptBlocks(decoded, filename, [...ancestry, "runtime-payload"]);
      } catch (error) {
        return [{ source: "", filename: blockName, decodeFailure: error.message }];
      }
    }
    const javascriptType = !type || type === "text/javascript" || type === "application/javascript";
    if (!javascriptType || !source.trim()) return [];
    return [{ source, filename: blockName }];
  });
}

const blocks = htmlPaths.flatMap((htmlPath) =>
  embeddedScriptBlocks(fs.readFileSync(htmlPath, "utf8"), path.basename(htmlPath)),
);

const failures = [];
blocks.forEach(({ source, filename, decodeFailure }) => {
  if (decodeFailure) {
    failures.push(`${filename}: runtime payload decode failed: ${decodeFailure}`);
    return;
  }
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
