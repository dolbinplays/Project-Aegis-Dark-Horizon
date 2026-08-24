const fs = require("fs");
const vm = require("vm");
const path = require("path");

const root = path.resolve(__dirname, "..");
const htmlPath = path.join(root, "index.html");
const html = fs.readFileSync(htmlPath, "utf8");
const blocks = [...html.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi)]
  .map((match) => match[1])
  .filter((source) => source.trim());

const failures = [];
blocks.forEach((source, index) => {
  try {
    new vm.Script(source, { filename: `index.html#script-${index + 1}` });
  } catch (error) {
    failures.push(`script ${index + 1}: ${error.message}`);
  }
});

if (failures.length) {
  console.error("Project Aegis embedded JavaScript syntax check failed:");
  failures.forEach((failure) => console.error(`- ${failure}`));
  process.exit(1);
}

console.log(`Project Aegis embedded JavaScript syntax check passed (${blocks.length} non-empty blocks).`);
