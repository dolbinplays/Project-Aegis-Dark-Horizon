const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'src', 'browser-runtime.html');
const source = fs.readFileSync(runtimePath, 'utf8');

const BUILD = 'v0.26.09.15.0745_INDEXEDDB_SAVE_STORAGE_HOTFIX';

test('save hotfix uses IndexedDB as the primary durable slot backend', () => {
  assert.match(source, new RegExp(`const CURRENT_GAME_BUILD="${BUILD.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}"`));
  assert.match(source, /const INDEXEDDB_SAVE_STORAGE_HOTFIX=true/);
  assert.match(source, /indexedDB\.open\(AEGIS_SAVE_DATABASE_NAME,AEGIS_SAVE_DATABASE_VERSION\)/);
  assert.match(source, /async function readDurableManualSaveSlots\(\)/);
  assert.match(source, /async function writeDurableManualSaveSlots\(slots\)/);
  assert.match(source, /async function readDurableAutoSaveSlots\(\)/);
  assert.match(source, /async function writeDurableAutoSaveSlots\(slots\)/);
});

test('manual saves persist through the durable backend before UI state is committed', () => {
  const start = source.indexOf('async function saveToSlot(slotNumber)');
  const end = source.indexOf('const ActiveUfoListModal=', start);
  assert.ok(start >= 0 && end > start, 'saveToSlot implementation should be discoverable');
  const body = source.slice(start, end);
  assert.match(body, /await readDurableManualSaveSlots\(\)/);
  assert.match(body, /await writeDurableManualSaveSlots\(nextSlots\)/);
  assert.match(body, /emergencyExport:true/);
  assert.ok(body.indexOf('await writeDurableManualSaveSlots(nextSlots)') < body.indexOf('setSaveSlots(nextSlots)'), 'durable write should complete before React state reports the save');
});

test('autosaves and post-mission reboot checkpoints share durable storage authority', () => {
  assert.match(source, /async function writeRotatingAutoSave\(\)[\s\S]*?await readDurableAutoSaveSlots\(\)[\s\S]*?await writeDurableAutoSaveSlots\(nextSlots\)/);
  assert.match(source, /async function writePostMissionRuntimeRebootCheckpoint[\s\S]*?const nextSlots=await readDurableAutoSaveSlots\(\)[\s\S]*?await writeDurableAutoSaveSlots\(nextSlots\)[\s\S]*?await readDurableAutoSaveSlots\(\)/);
  assert.match(source, /useEffect\(\(\)=>\{if\(postMissionRuntimeResumeAttemptedRef\.current\)[\s\S]*?await readDurableAutoSaveSlots\(\)/);
});

test('legacy localStorage data remains a fallback and is reclaimed only after a successful IndexedDB write', () => {
  assert.match(source, /const legacy=normalizeManualSaveSlotCollection\(readSaveSlots\(\)\)/);
  assert.match(source, /const legacy=normalizeAutoSaveSlotCollection\(readAutoSaveSlots\(\)\)/);
  assert.match(source, /await writeAegisIndexedDbSlotCollection\(AEGIS_SAVE_DATABASE_MANUAL_KEY,normalized\);[\s\S]*?localStorage\.removeItem\(SAVE_STORAGE_KEY\)/);
  assert.match(source, /await writeAegisIndexedDbSlotCollection\(AEGIS_SAVE_DATABASE_AUTOSAVE_KEY,normalized\);[\s\S]*?localStorage\.removeItem\(AUTO_SAVE_STORAGE_KEY\)/);
  assert.match(source, /return writeSaveSlots\(normalized\)/);
  assert.match(source, /return writeAutoSaveSlots\(normalized\)/);
});

test('campaign save format remains version 4', () => {
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
});
