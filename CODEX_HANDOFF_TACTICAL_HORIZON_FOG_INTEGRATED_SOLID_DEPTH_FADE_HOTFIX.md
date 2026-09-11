# CODEX HANDOFF — v0.26.09.11.1254_TACTICAL_HORIZON_FOG_INTEGRATED_SOLID_DEPTH_FADE_HOTFIX

Browser 1230 is the visual baseline. This hotfix addresses the field-observed black-cutout daytime skyline without changing solid occlusion.

## Renderer rule
- Keep horizon structure/silhouette geometry opaque: `transparent:false`, `opacity:1`, `depthTest:true`, `depthWrite:true`.
- Daylight batches now set `fog:true` through `fog:plan.phase==="day"`, using the live tactical scene fog for camera-distance atmospheric perspective. This fog changes fragment color, not alpha, so front-to-back occlusion remains intact.
- Daylight near/mid/far base-color mixes are intentionally stronger before fogging (`.62/.74/.84`). Map-edge extension uses `.50`.
- Twilight/night stay on the phase-aware opaque color fade rather than the short scene-fog range; preserve readable skyline massing behind seeded windows.
- Keep the transparent haze shell separate and keep window instances depth-tested/non-depth-writing.

## Preserve
No new draw calls, point lights, shadows, tactical pickables, cover, LOS, pathing, collision, AI, objective/result authority, or save data. Preserve Browser 1230 solid atmospheric color treatment, Browser 1110 depth occlusion, Browser 1046 horizon/window generation, Browser 0915 mobile Classic presentation, exactly one `finishAiPlayback()`, and save format 4.

## Field gate
Use a bright daytime city/town FPV/TPV view: skyline buildings should read as fog-softened blue-gray architecture, not black silhouettes, while foreground buildings still completely hide rear geometry where they overlap. Repeat at night to ensure window lights remain attached to visible massing.

---
