# Project Aegis — v0.26.09.18.2222 Native Tools / Editors Runtime Payload Patch

## Purpose
The 2115 launcher attempted to add **Tools / Editors** after the game had already rendered. The actual Save / Load screen is produced inside the embedded React runtime, so that DOM-injection path was not reliable in the installed app.

## What changed
- `service-worker.js` now patches the **embedded runtime payload before the game iframe is created**.
- The patch finds the authoritative `Enhanced SFX Library` React button in the Save / Load header and inserts a native React **Tools / Editors** button immediately after it.
- The modified runtime payload is re-encoded and its `data-source-bytes` and `data-sha256` values are regenerated before the shell is returned to the browser.
- The previous 2115 launcher remains as a fallback only; the Save / Load button no longer depends on MutationObserver / post-render DOM injection.
- Added `AEGIS_Tools_Editors.html`, a dedicated hub for the current Prop Editor and Runtime Test Gallery.
- The service worker now caches and recognizes the Tools / Editors hub as a first-class navigation target.
- Save format remains **4**.

## Expected Save / Load header
The relevant portion should read:

`Enhanced SFX Library` → **`Tools / Editors`** → `Patch Notes / Version History`

## Scope
No campaign rules, tactical AI, combat, pathfinding, LOS, accuracy, objective logic, saves, prop definitions, or editor data schemas were changed.

## Important update handoff note
The currently installed 2115 service worker may own the first navigation after these files are copied. Allow that first launch to finish updating, then fully close and reopen the installed app once. The second navigation will be controlled by the 2222 worker and will use the patched embedded runtime payload.
