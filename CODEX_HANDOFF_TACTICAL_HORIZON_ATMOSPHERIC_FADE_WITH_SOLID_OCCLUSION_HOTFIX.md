# CODEX HANDOFF — v0.26.09.11.1230_TACTICAL_HORIZON_ATMOSPHERIC_FADE_WITH_SOLID_OCCLUSION_HOTFIX

Browser 1110 is the renderer baseline. This hotfix restores atmospheric perspective without giving up solid depth occlusion.

## Renderer rule
- Keep structure/silhouette materials `transparent:false`, `opacity:1`, `depthWrite:true`, and `depthTest:true`. Do not use building alpha transparency as the distance cue.
- `tacticalHorizonAtmosphericFadeMix(...)` controls phase-aware layer blending. Daylight deliberately fades the strongest; twilight is moderate; night is subtler.
- `tacticalHorizonAtmosphericTargetColor(...)` derives the target from the active atmosphere palette so the skyline approaches the actual mission horizon rather than a fixed gray/black.
- Near/mid/far instance colors progressively approach that target. The world-continuation extension building batch uses the matching `extension` mix.
- Keep the separate consolidated haze shell transparent and keep the seeded window batch depth-tested/non-depth-writing.

## Preserve
No new draw calls, point lights, dynamic shadows, pickables, cover, LOS, pathing, collision, targeting, AI, objectives, or save state. Preserve Browser 1110 solid occlusion, Browser 1046 horizon/window density, Browser 0915 mobile Classic layout, Browser 0745 Classic stabilization, one `finishAiPlayback()`, tactical outcome authority, and save format 4.

## Field gate
Inspect a bright daytime city/town horizon first: exposed near/mid/far architecture should visibly recede by color while overlapping buildings remain fully opaque. Repeat at twilight/night to verify distance softening remains but the skyline/window contrast does not wash out.

