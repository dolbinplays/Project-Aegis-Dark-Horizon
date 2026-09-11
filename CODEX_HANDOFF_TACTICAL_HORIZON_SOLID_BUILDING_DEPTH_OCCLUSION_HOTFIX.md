# CODEX HANDOFF — v0.26.09.11.1110_TACTICAL_HORIZON_SOLID_BUILDING_DEPTH_OCCLUSION_HOTFIX

Browser 1046 is the visual baseline. This is a perspective-horizon occlusion hotfix only.

## Renderer change
- Browser 1046 used `transparent:true`, partial opacity, and `depthWrite:false` for near/mid/far horizon building/silhouette batches. That produced the intended atmospheric softness but allowed rear geometry to blend through foreground buildings.
- The structure/silhouette batches are now opaque (`transparent:false`, `opacity:1`) with `depthWrite:true` and `depthTest:true`.
- Keep atmospheric depth in `tacticalPerspectiveHorizonDepthPlan(...)` instance colors and the separate consolidated haze shell. Do not restore building alpha transparency as the distance cue.
- The seeded window batch intentionally remains depth-tested and non-depth-writing; opaque building depth should hide windows behind nearer structures.
- The existing world-continuation scenery batch was already solid/depth-writing and should remain so.

## Preserve
Do not add horizon objects to pickables, cover, LOS, pathing, collision, hazards, AI, or save state. Preserve Browser 1046 structure/window caps and draw-call count, Browser 0915 mobile Classic layout, Browser 0745 Classic stabilization, one `finishAiPlayback()`, tactical outcome authority, and save format 4.

## Field gate
Align multiple distant buildings in FPV/TPV and confirm the front building fully occludes the rear one where they overlap. Verify atmospheric color/haze remains, night facade windows still render correctly, and no z-fighting/transparent seams appear during camera motion.

