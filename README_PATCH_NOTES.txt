PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.2315_TPV_FPV_GROUND_TEXTURE_PARITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Refines the Browser 2245 TPV continuous-ground fix. Third Person and incoming-fire reaction TPV were already using the same continuous-ground anti-flicker path as FPV, but the terrain still read harsher in TPV because the ground texture presented stronger visible hex boundaries from the chase-camera angle. This patch keeps the same continuous-ground floor and swaps TPV onto a parity-smoothed texture derived from the FPV ground texture so TPV looks much closer to FPV while keeping 3D Iso unchanged.

TPV / FPV GROUND TEXTURE PARITY
-------------------------------
- FPV keeps the original continuous-ground texture already used by Browser 0455.
- TPV and incoming-fire reaction TPV now automatically switch that same continuous-ground plane onto a parity-smoothed texture derived from the FPV terrain canvas.
- The TPV texture is produced by lightly blurring the FPV terrain canvas and blending it back with the original, preserving the same terrain palette and mission-specific ground logic while reducing strong visible hex borders.
- The goal is visual parity: TPV should now read much closer to FPV rather than showing a harsher large-hex mosaic.

WHAT DOES NOT CHANGE
--------------------
- 3D Iso still restores the explicit per-hex ground and the normal command-view board look.
- Terrain authority, pathfinding, movement costs, LOS, tactical visibility rules, target selection, AI knowledge, and combat calculations do not change.
- The patch does not create a second battlefield renderer or a second ground plane.
- Save format remains 4.

PERFORMANCE / VALIDATION
------------------------
- The persistent renderer still builds one continuous perspective floor. Camera mode changes only swap which cached texture that floor material displays.
- Runtime diagnostics now distinguish the base FPV texture from the parity-smoothed TPV texture.
- Build Health verifies the TPV parity texture generation and selection logic in addition to the existing FPV / TPV / reaction-TPV continuous-ground path checks.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Open the same tactical map in FPV and TPV and compare the ground.
2. Confirm TPV terrain now looks much closer to FPV, with softer visual boundaries between hexes.
3. Move the observer and rotate the camera to verify the earlier TPV edge-flicker fix still holds.
4. Trigger an incoming-fire reaction cut and confirm it uses the same softened TPV terrain presentation.
5. Return to 3D Iso and confirm the normal explicit hex board still appears.

CODE / SYSTEM NOTES
-------------------
- `TACTICAL_TPV_GROUND_TEXTURE_PARITY_PATCH` added.
- `tacticalThreePersistentBuildFirstPersonGround()` now generates both an FPV base texture and a TPV parity-smoothed texture.
- `tacticalThreePersistentSetFirstPersonGroundMode()` now swaps the continuous-ground material map by perspective mode and publishes `data-aegis-tpv-ground-texture` diagnostics.
- `tacticalThreePersistentDisposeRuntime()` now disposes the extra TPV texture.

NEXT LIKELY FOLLOW-UP
---------------------
- If this looks right in live play, the next logical tactical polish step is to continue reducing presentation mismatches between FPV/TPV and Iso while preserving exact authoritative gameplay state.
