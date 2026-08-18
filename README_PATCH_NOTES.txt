PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.0115_HAZARD_PATH_RULES_BOOT_TDZ_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the Browser 0045 launch crash: `Cannot access 'TACTICAL_HAZARD_PATH_RULES' before initialization`. The hazard-aware playback changes made an older startup self-test enter `tacticalMovementHazardCost()` before the later `const TACTICAL_HAZARD_PATH_RULES` declaration had initialized. The rules object is now initialized in the early tactical constants block, before any startup contract can invoke hazard-aware pathing.

ROOT CAUSE
----------
- Browser 0045 added `TACTICAL_HAZARD_PATH_RULES` near the hazard-path helper functions.
- Existing startup code immediately evaluates `tacticalAiMovementTrailPlaybackFixTest()`.
- That test calls `tacticalPlaybackMovementPath()`. Browser 0045 made playback capable of rebuilding routes through `tacticalAiHazardAwarePath()`.
- The hazard-aware pathfinder calls `tacticalMovementHazardCost()`, which reads `TACTICAL_HAZARD_PATH_RULES`.
- Because the script had not yet reached that later `const` declaration, JavaScript's temporal dead zone raised a `ReferenceError` and stopped boot.

HOTFIX
------
- Moved the immutable `TACTICAL_HAZARD_PATH_RULES` declaration into the early tactical constants block.
- Removed the later duplicate declaration.
- Added `TACTICAL_HAZARD_PATH_RULES_BOOT_TDZ_HOTFIX_PATCH`.
- Added a Build Health contract confirming the rules object is initialized and retains the expected fire/smoke weights.
- Hazard routing behavior and weights are otherwise unchanged.

UNCHANGED GAMEPLAY
------------------
- Browser 0045 fire/smoke-aware AI routing remains active.
- Browser 0015 civilian/VIP land-vehicle footprint avoidance remains active.
- Browser 2355 fire/smoke propagation remains active.
- Browser 2315 FPV/TPV ground parity remains active.
- No save migration or balance change. Save format remains 4.

VALIDATION
----------
- Initialization-order check: `TACTICAL_HAZARD_PATH_RULES` now appears before the launch-time `tacticalAiMovementTrailPlaybackFixContract` evaluation.
- Duplicate declaration check: only one hazard-rules declaration remains.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- The headless Chromium environment available here did not produce a usable full DOM run for this asset-relative standalone file, so the final manual gate is loading the packaged build and confirming the start screen opens without the reported ReferenceError.

MANUAL TEST GATES
-----------------
1. Load the build and confirm the start screen appears without a runtime error.
2. Open Build Health and confirm the hazard rules boot-TDZ contract passes.
3. Start a tactical mission and verify fire/smoke-aware routing still avoids hazards as in Browser 0045.
4. Verify VIP/civilian vehicle-footprint avoidance still behaves as in Browser 0015.
