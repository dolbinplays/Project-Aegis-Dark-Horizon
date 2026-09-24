# Night shot target visibility

Build: v0.26.09.24.0005_NIGHT_SHOT_TARGET_VISIBILITY_PATCH

Reproduced before fixing:
- Actual aliensFromFrame conversion dropped shotPresentationVisible, leaving a verified target hidden whenever current map sight differed from shot-time sight.
- Persistent renderer invalidation did not refresh unit models on visibility-only changes.

Changes preserve the frame's temporary visibility flag and explicitly clear it when absent from the next frame. Both renderer keys include it; visibility invalidation refreshes models and includes flashlight/downed state. Live target markers and legacy rendering follow the existing shot-presentation rule. Last-known marker suppression is presentation-only; AI contact memory remains available.

Validation:
- Four new behavioral tests: real frame conversion and expiry; visibility invalidation; dark/flashlight/facing/wall/flare/reaction shot legality; missed and lethal verified targets.
- Existing visibility memoization tests and all 18 playback sequencer checks pass.
- Build seam, packaged runtime generation, embedded JavaScript syntax and git diff whitespace checks pass.
- No live browser visual verification performed. Playtest a night AI/Hybrid mission in 2D, Iso, FPV and TPV, including flashlight changes and contact loss. Confirm the alien is visible during the shot/impact and returns to last-known behavior when contact is lost.

Save format remains 4. No changes to firing permissions, damage or medical/rescue rules.

Full regression run: 484 tests, 449 passed, 35 pre-existing failures; no new failure names compared with the shared-3D-controls baseline. Log: E:/JoshGameProjects/GitHub/PADH GPT Files/night-shot-targets/regressions.txt.
