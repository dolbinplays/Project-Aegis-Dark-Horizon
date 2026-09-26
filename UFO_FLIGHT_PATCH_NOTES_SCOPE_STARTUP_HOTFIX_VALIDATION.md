# UFO Flight Patch Notes Scope Startup Hotfix

Build: v0.26.09.25.0010_UFO_FLIGHT_PATCH_NOTES_SCOPE_STARTUP_HOTFIX

Save format: 4

## Reproduced defect

Browser 0009 placed `PATCH_NOTES_HISTORY.unshift(...)` for its own history entry after `AlienResponseCommand` had closed. `PATCH_NOTES_HISTORY` is declared inside that component's Patch Notes `useMemo`, so startup evaluated the trailing mutation at module scope and threw `ReferenceError: PATCH_NOTES_HISTORY is not defined` before React could mount the game.

## Correction

- Removed the module-scope 0009 history mutation.
- Reinserted the complete 0009 history entry inside the owning `PATCH_NOTES_HISTORY` `useMemo` before sort/return.
- Added the 0010 hotfix entry in that same valid lexical scope.
- Changed the historical 0008 Sickbay entry from `build: CURRENT_GAME_BUILD` to its explicit 0008 build ID so the current marker resolves only to 0010.
- No Browser 0009 UFO flight/observation/reinforcement logic was intentionally changed.

## Automated validation

- Decoded runtime contains exactly one 0009 Observation-Gated UFO Flight Presentation history entry and one 0010 scope-hotfix entry.
- No `PATCH_NOTES_HISTORY.unshift` mutation exists after the Patch Notes history sort/return boundary.
- Embedded runtime scripts parse successfully with Node syntax checking.
- Host JavaScript and `service-worker.js` parse successfully.
- Re-encoded runtime byte count and SHA-256 match `index.html` payload attributes and `release-metadata.json`.
- Host SHA-256 matches release metadata.
- ZIP integrity check passes.

## Live field acceptance

1. Launch the updated game from a normal browser tab and confirm the start/main screen appears with no `PATCH_NOTES_HISTORY` runtime error.
2. Repeat after installed/PWA update and one cold relaunch.
3. Open Patch History and confirm 0010 is newest, followed by 0009 UFO Flight and 0008 Sickbay Capacity.
4. Start or continue one reinforcement-capable tactical mission and verify an observed UFO can still show the Browser 0009 approach/departure while an unobserved craft does not leak its location.
5. Save/reload remains format 4.
