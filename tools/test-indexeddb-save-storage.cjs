const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const runtimePath = path.join(root, 'src', 'browser-runtime.html');
const source = fs.readFileSync(runtimePath, 'utf8');


test('save hotfix uses IndexedDB as the primary durable slot backend', () => {
  assert.match(source, /const CURRENT_GAME_BUILD="v0\.26\./);
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

test('fallback copies are retained and startup compares all recovery sources', () => {
  assert.match(source, /const legacy=normalizeManualSaveSlotCollection\(readSaveSlots\(\)\)/);
  assert.match(source, /const legacy=normalizeAutoSaveSlotCollection\(readAutoSaveSlots\(\)\)/);
  assert.match(source, /aegisMergeRecoverySlots\(key,\[primary,legacy,current,folder,previous,folderPrevious\]\)/);
  assert.match(source, /writeSaveSlots\(normalized\):writeAutoSaveSlots\(normalized\)/);
  const body=source.slice(source.indexOf('async function aegisWriteRecoverableSlots('),source.indexOf('function readAutoSaveIntervalMinutes('));
  assert.ok(!body.includes('localStorage.removeItem'), 'successful writes retain the fallback');
});

test('campaign save format remains version 4', () => {
  assert.match(source, /const CURRENT_SAVE_FORMAT_VERSION=4/);
});
