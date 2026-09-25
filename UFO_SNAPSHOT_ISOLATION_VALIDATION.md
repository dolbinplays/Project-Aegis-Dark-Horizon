# UFO snapshot isolation

Build: v0.26.09.25.0007_UFO_SNAPSHOT_ISOLATION_PATCH

Previously, reinforcement normalization cloned deliveryLanding but shared placement coordinates and arrays. AI currentFrameBase also shallow-copied craft data, sharing nested objects across frames and the reinforcement snapshot. New tacticalAlienDropshipSnapshot uses the existing serializable clone utility at normalization, frame creation and playback registration boundaries. It does not clone geometry or run in the renderer animation loop.

Two behavioral regressions failed before the fix and pass afterward: modifying normalized hull/ramp/center/observation state cannot change the input; modifying the craft in a real AI frame cannot change another frame or its reinforcement snapshot. All 30 focused UFO tests pass, including existing save/normalization, source isolation, arrivals and handoff. Packaging, build seam, embedded JavaScript syntax and whitespace checks pass. Full suite was not rerun.

Before-fix log: E:/JoshGameProjects/GitHub/PADH GPT Files/ufo-snapshot-before.txt. Live installed-game acceptance remains pending. Save format stays 4; no flight animation is added.
