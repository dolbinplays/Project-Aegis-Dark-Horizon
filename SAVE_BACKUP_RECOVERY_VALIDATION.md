# Automatic save backup and recovery

Build: `v0.26.09.22.0002_AUTOMATIC_SAVE_BACKUP_AND_RECOVERY_PATCH`

Save format remains 4. Changes are local; no deployment or Git commit was made. The player's existing testing backup was not read, changed or imported.

## Windows / Chrome setup after updating

1. Open Menu / Save and Backup Manager. If your slots are still missing, use **Restore From File** with your existing known-good backup.
2. Click **Choose / Reconnect Backup Folder**. Choose a dedicated Project Aegis backup folder and grant Chrome the requested folder access.
3. Save once. Backup Manager shows the folder and the last successful file-backup time. Verify files appear in the selected folder.
4. Subsequent manual saves, rotating autosaves and completed mission debrief checkpoints update the folder automatically while permission remains available.
5. On later launches, available browser and folder copies are checked automatically and valid slots are restored. Use Load on the desired slot; startup does not choose a campaign for you.
6. If browser site data was completely cleared, reconnect the same folder, or import a backup file with Restore From File. Clearing site data can remove the remembered folder handle, so automatic access cannot be promised until it is reconnected.

The folder contains up to four files:

- project-aegis-manual.backup.json
- project-aegis-manual-previous.backup.json
- project-aegis-autosave.backup.json
- project-aegis-autosave-previous.backup.json

Only these dedicated filenames are used. The current/previous files are rotating recovery generations, not an unlimited campaign archive. Keep separate archival exports for long-term milestones.

## Changes

- Each IndexedDB write atomically commits the primary and current recovery collection, retaining the previous valid generation. First upgraded writes also preserve a preexisting primary when no recovery journal exists.
- Successful database saves retain a best-effort localStorage mirror instead of deleting the fallback. Quota errors do not make a failed fallback mirror invalidate a successful database save.
- Startup checks primary, local fallback, current/previous database recovery records and accessible folder generations. Each slot selects its newest valid available revision. Reads do not overwrite the source records being recovered.
- Monotonic revisions prevent a failed database write followed by a newer local save from loading the older database value, including after a system-clock rollback.
- Intentional deletion is represented by a revision-stamped empty slot. Older backups cannot resurrect deliberately cleared slots.
- Browser persistence is requested where supported. Persistence does not make browser data immune to deliberate clearing, profile loss or disk loss.
- Folder selection checks existing backups before writing new files. Invalid/unreadable current files are not overwritten. Revoked permission, storage errors and failed folder writes are exposed in Backup Manager.
- Folder backups can remain usable even if both browser write paths fail. If the database cannot remember the folder handle, the selected folder can still work for the current session.
- The existing verified post-mission checkpoint now writes recovery copies and the external autosave backup before requesting a runtime reboot. Opening a debrief without an existing matching checkpoint also triggers an autosave after aftermath settles.
- Save-menu startup distinguishes checking recovery copies from a completed empty-slot result.

## Findings and limits

Code inspection identified two weaknesses in the prior implementation: successful IndexedDB writes removed the local fallback, and reads always preferred any IndexedDB array over a potentially newer fallback after a write failure. These are fixed, but the exact cause of the player's original missing saves was not established. No attempt was made to inspect Chrome profile databases or overwrite the player's known-good testing backup.

Browser-only copies share the same site/profile storage and may disappear together if it is cleared. External folder files provide the independent layer. Unsupported browsers continue to offer ordinary JSON export/import. Folder permission behavior is controlled by Chrome and must be checked on each use.

## Automated coverage

- 17 recovery scenarios plus 5 durable-save contracts pass: primary corruption/loss, previous-generation recovery, newer fallback, clock rollback, deletion markers, invalid-save rejection, failed database access, external-file rotation, folder reconnection after simulated browser clearing, revoked permission, malformed file preservation, failure of both browser write paths, first-write upgrade protection and the actual completed-mission checkpoint.
- Tests run canonical runtime functions using simulated IndexedDB transactions and file handles. They do not prove real Chrome permission persistence or filesystem behavior.
- Application start/save/new-game hook-order smoke passes after the startup-status change.
- Build identity, source/payload packaging, embedded JavaScript syntax and whitespace checks pass.

Full repository sweep: **417 checks, 382 passed, 35 failed**. All failing names match the prior stabilization-patch baseline. The older editor/library failures remain; no tests were suppressed.

Reproduce:

```powershell
node --test tools/test-save-recovery-backups.cjs tools/test-indexeddb-save-storage.cjs
node --test --test-name-pattern='TV start' tools/test-ai-command-stream-handoff.cjs
node tools/check-aegis-build.cjs
node tools/check-embedded-js.cjs
```

## Live acceptance remaining

Browser automation in this task could not initialize earlier (failed to write kernel assets). No real installed-Chrome or folder-picker acceptance is claimed.

- Use a disposable campaign and dedicated test folder. Confirm a manual save creates the manual file, an autosave creates its separate file, and the next save retains the previous generation.
- Complete a mission, inspect its debrief, close/reopen the installed game, and confirm the verified checkpoint remains loadable.
- With a separate exported test backup secured, use a disposable Chrome profile to simulate site-data clearing. Reconnect the test folder and verify slot names and campaign progress recover. Do not clear the player's working profile for this test.
- Revoke folder access and verify saving still works in browser storage while Backup Manager reports the folder problem. Reconnect and confirm writes resume.
- Confirm a manually cleared slot stays cleared through restart despite an older backup containing it.

References: [Chrome File System Access](https://developer.chrome.com/docs/capabilities/web-apis/file-system-access), [Chrome persistent file permissions](https://developer.chrome.com/blog/persistent-permissions-for-the-file-system-access-api), [StorageManager.persist](https://developer.mozilla.org/docs/Web/API/StorageManager/persist).
