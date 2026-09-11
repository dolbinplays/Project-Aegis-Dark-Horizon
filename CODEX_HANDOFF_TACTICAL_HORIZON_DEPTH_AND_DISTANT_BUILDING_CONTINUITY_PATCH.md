# CODEX HANDOFF — v0.26.09.11.1046_TACTICAL_HORIZON_DEPTH_AND_DISTANT_BUILDING_CONTINUITY_PATCH

Browser 0915 is the baseline. This patch implements the approved tactical horizon / distant-building continuity follow-up and is presentation-only.

## Renderer authority
- Continue using `tacticalThreePersistentBuildWorldContinuation(...)` for map-edge terrain/scenery and `tacticalThreePersistentBuildPerspectiveBackdrop(...)` for FPV/TPV horizon presentation. Do not introduce a second scenery authority.
- `tacticalPerspectiveHorizonDepthPlan(...)` deterministically creates near/mid/far horizon bands and the combined perspective window plan.
- The Browser 1046 wrapper applies a matching near-atmosphere color treatment to the existing world-continuation scenery batch.
- Twilight/night city and town windows from both map-edge extension buildings and the horizon are combined into one `seeded-emissive-window-atlas-batch` InstancedMesh. Despite the name, this is an unlit MeshBasic presentation batch; it intentionally creates no PointLight/SpotLight.
- Keep horizon meshes outside `pickables`, cover collections, LOS, pathfinding, hazards, and save state.

## Performance boundary
- Preserve Performance/Auto/Quality caps. Avoid per-window meshes, per-building timers, dynamic shadows, or per-window lights.
- Keep the far radius inside the established sky dome and keep the consolidated haze layer.
- Camera movement, targeting, fog changes, and AI playback must not rebuild tactical authority.

## Preserve
- `resolveMission(...)`, `tacticalMissionTerminalState(...)`, and `tacticalAiMissionResolution(...)` are byte-identical to Browser 0915.
- Preserve Browser 0915 mobile Classic layout, Browser 0745 Classic stabilization, Browser 1223 visible-target repair, Browser 0810 rolling Classic planner, Browser 1242 casualty authority, one `finishAiPlayback()`, and save format 4.

## Field gate
Compare day/twilight/night city/town FPV/TPV views, especially looking from map-edge extension buildings toward the skyline. Depth must fade consistently, windows must remain sparse and presentation-only, gameplay lights/markers must remain dominant, and 3D Iso should stay visually clean.

---
