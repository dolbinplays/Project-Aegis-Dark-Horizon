# Grounded TPV Background Scenery

Build: `v0.26.09.28.0009_GROUNDED_TPV_BACKGROUND_SCENERY_PATCH`

Save format: **4** (unchanged).

## Cause and correction

The perspective scenery subgroup was a child of the sky root. Each rendered frame translated the sky root to the camera, so buildings, landscape silhouettes, horizon haze and decorative windows moved upward and sideways with it. Increased TPV camera height exposed the scenery bases above the ground.

`tacticalThreePersistentSyncSkyToCamera` now cancels the parent's translation on the scenery subgroup. The sky dome and celestial details continue following the camera; scenery remains at its authored map coordinates. Keeping the subgroup under the sky root preserves existing rebuild/disposal ownership. No geometry, materials, draw calls, camera limits, collision or visibility rules were added or changed.

## Validation

**21 tests passed** across `test-grounded-perspective-backdrop.cjs`, `test-observed-shield-tactics.cjs`, `test-beacon-immunity-rings.cjs` and `test-night-shot-presentation.cjs`.

The new tests execute the effective runtime functions with real Three.js objects. They cover 27 landscape/lighting/map-size combinations, repeated camera translations and heights from 1.7 to 40 world units, rotations, stable scenery/window/haze world matrices, FPV/TPV/reaction/Iso transitions, and sky cleanup/rebuild. Existing scenery stays within its four-draw-call limit.

Headless Edge WebGL fixtures using the actual backdrop builder reproduced the old floating skyline and were visually inspected after the fix at raised and map-edge camera positions. These fixtures use a simplified ground plane to isolate the transform defect; they are not full gameplay screenshots or performance benchmarks.

Fixture script and images are on E: under `E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance/`:

- `backdrop-visual.cjs`
- `backdrop-raised-before.png`
- `backdrop-raised-after.png`
- `backdrop-low-after.png`
- `backdrop-edge-after.png`

Runtime packaging, build-seam, embedded JavaScript syntax and whitespace checks pass. A fresh headless Edge launch displayed Browser 0009 with no page errors (`launch-0009.png` in the fixture directory). Installed-game acceptance remains pending: raise/lower and rotate the TPV free camera in an existing mission, move toward map edges, and switch to FPV and Iso. Full mission terrain, all map themes and GPU performance were not exhaustively field-tested.
