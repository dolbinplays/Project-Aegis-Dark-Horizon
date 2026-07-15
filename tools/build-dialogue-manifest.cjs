const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const audioDir = path.join(root, "assets", "audio", "dialogue");
const outputPath = path.join(audioDir, "manifest.js");
const soldierStyles = [
  "nervous but determined",
  "aggressive hotshot",
  "steady professional",
  "grim",
];
const aircraftPhrases = new Set([
  "all aboard", "approaching the landing zone", "breaking off", "ferry leg complete",
  "guns firing", "interceptor returning home", "lifting off", "missile away",
  "ramp clear", "ramp going down", "refueling complete", "returning to base",
  "skyranger has landed", "skyranger inbound", "skyranger ready", "taking damage",
  "target lost", "thirty seconds", "touchdown", "weapons hot",
]);

function readPcm16Wav(filePath) {
  const buffer = fs.readFileSync(filePath);
  if (buffer.toString("ascii", 0, 4) !== "RIFF" || buffer.toString("ascii", 8, 12) !== "WAVE") {
    throw new Error(`${path.basename(filePath)} is not a RIFF/WAVE file`);
  }
  let offset = 12;
  let format = null;
  let dataOffset = -1;
  let dataSize = 0;
  while (offset + 8 <= buffer.length) {
    const id = buffer.toString("ascii", offset, offset + 4);
    const size = buffer.readUInt32LE(offset + 4);
    const body = offset + 8;
    if (id === "fmt ") {
      format = {
        audioFormat: buffer.readUInt16LE(body),
        channels: buffer.readUInt16LE(body + 2),
        sampleRate: buffer.readUInt32LE(body + 4),
        bitsPerSample: buffer.readUInt16LE(body + 14),
      };
    } else if (id === "data") {
      dataOffset = body;
      dataSize = Math.min(size, buffer.length - body);
      break;
    }
    offset = body + size + (size % 2);
  }
  if (!format || dataOffset < 0 || format.audioFormat !== 1 || format.bitsPerSample !== 16) {
    throw new Error(`${path.basename(filePath)} must be PCM 16-bit WAV audio`);
  }
  const frameCount = Math.floor(dataSize / (format.channels * 2));
  return { buffer, dataOffset, frameCount, ...format };
}

function percentile(values, ratio) {
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(sorted.length * ratio)))] || 0;
}

function analyzeTakes(wav, fileName) {
  const windowFrames = Math.max(1, Math.round(wav.sampleRate * 0.02));
  const energies = [];
  for (let start = 0; start < wav.frameCount; start += windowFrames) {
    const end = Math.min(wav.frameCount, start + windowFrames);
    let sumSquares = 0;
    let count = 0;
    for (let frame = start; frame < end; frame += 1) {
      for (let channel = 0; channel < wav.channels; channel += 1) {
        const sampleOffset = wav.dataOffset + (frame * wav.channels + channel) * 2;
        const sample = wav.buffer.readInt16LE(sampleOffset);
        sumSquares += sample * sample;
        count += 1;
      }
    }
    energies.push(Math.sqrt(sumSquares / Math.max(1, count)));
  }
  const noiseFloor = percentile(energies, 0.25);
  const threshold = Math.max(500, noiseFloor * 2.6);
  const raw = [];
  let startWindow = null;
  energies.forEach((energy, index) => {
    if (energy >= threshold && startWindow === null) startWindow = index;
    if ((energy < threshold || index === energies.length - 1) && startWindow !== null) {
      const endWindow = energy < threshold ? index : index + 1;
      if ((endWindow - startWindow) * 0.02 >= 0.12) raw.push({ start: startWindow * 0.02, end: endWindow * 0.02 });
      startWindow = null;
    }
  });
  const merged = [];
  for (const run of raw) {
    const previous = merged[merged.length - 1];
    if (previous && run.start - previous.end <= 0.82) previous.end = run.end;
    else merged.push({ ...run });
  }
  while (merged.length > 4) {
    let smallestGapIndex = 0;
    let smallestGap = Infinity;
    for (let index = 0; index < merged.length - 1; index += 1) {
      const gap = merged[index + 1].start - merged[index].end;
      if (gap < smallestGap) {
        smallestGap = gap;
        smallestGapIndex = index;
      }
    }
    merged[smallestGapIndex].end = merged[smallestGapIndex + 1].end;
    merged.splice(smallestGapIndex + 1, 1);
  }
  const duration = wav.frameCount / wav.sampleRate;
  const takes = merged.map((run) => {
    const start = Math.max(0, run.start - 0.18);
    const end = Math.min(duration, run.end + 0.24);
    return { start: Number(start.toFixed(3)), duration: Number((end - start).toFixed(3)) };
  });
  if (!takes.length) throw new Error(`No voiced takes detected in ${fileName}`);
  return { duration: Number(duration.toFixed(3)), threshold: Math.round(threshold), takes };
}

function normalizePhrase(value) {
  return value
    .normalize("NFKD")
    .replace(/[\u2018\u2019']/g, "")
    .replace(/[^a-zA-Z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ")
    .toLowerCase();
}

function eventKey(value) {
  return normalizePhrase(value).replace(/\s+/g, "_");
}

function classify(fileName) {
  const stem = fileName.replace(/\.wav$/i, "").trim();
  const normalized = normalizePhrase(stem);
  if (normalized === "room tone") return { category: "ambience", phrase: "room tone", style: "neutral" };
  const style = soldierStyles.find((candidate) => normalized.endsWith(` ${candidate}`));
  if (style) {
    const phrase = normalized.slice(0, -(style.length + 1)).trim();
    return { category: "soldier", phrase, style: eventKey(style) };
  }
  return { category: aircraftPhrases.has(normalized) ? "aircraft" : "computer", phrase: normalized, style: "neutral" };
}

const wavFiles = fs.readdirSync(audioDir).filter((name) => name.toLowerCase().endsWith(".wav")).sort((a, b) => a.localeCompare(b));
if (!wavFiles.length) throw new Error(`No WAV recordings found in ${audioDir}`);

const events = {};
let takeCount = 0;
let totalDuration = 0;
for (const fileName of wavFiles) {
  const classification = classify(fileName);
  const key = eventKey(classification.phrase);
  const wav = readPcm16Wav(path.join(audioDir, fileName));
  const analysis = classification.category === "ambience"
    ? { duration: Number((wav.frameCount / wav.sampleRate).toFixed(3)), takes: [{ start: 0, duration: Number((wav.frameCount / wav.sampleRate).toFixed(3)) }] }
    : analyzeTakes(wav, fileName);
  const fileUrl = `./assets/audio/dialogue/${fileName.split("/").map(encodeURIComponent).join("/")}`;
  if (!events[key]) events[key] = { category: classification.category, variants: {} };
  if (events[key].variants[classification.style]) throw new Error(`Duplicate dialogue variant ${key}/${classification.style}`);
  events[key].variants[classification.style] = {
    file: fileUrl,
    source: fileName,
    sourceDuration: analysis.duration,
    takes: analysis.takes,
  };
  takeCount += analysis.takes.length;
  totalDuration += analysis.duration;
}

const manifest = {
  version: 1,
  generatedBy: "tools/build-dialogue-manifest.cjs",
  sourceFormat: { audioFormat: "PCM", channels: 1, sampleRate: 48000, bitsPerSample: 16 },
  recordingCount: wavFiles.length,
  takeCount,
  sourceDuration: Number(totalDuration.toFixed(3)),
  events,
};

const output = `window.PROJECT_AEGIS_RECORDED_DIALOGUE=${JSON.stringify(manifest, null, 2)};\n`;
fs.writeFileSync(outputPath, output, "utf8");
console.log(`Wrote ${path.relative(root, outputPath)} with ${wavFiles.length} recordings, ${Object.keys(events).length} events, and ${takeCount} takes.`);
