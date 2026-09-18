# Codex Handoff — AEGIS Prop Editor 1600

## Baseline

GitHub `main` baseline used for this hotfix:

- Build: `v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_DIRECT_COPY`
- Commit: `35b8c05147ac184fcca52f477206a74f92d11332`
- Save format: 4

## Why this patch exists

The 1358 design placed placement-authoring controls in an outer page and the full 0835 geometry editor in an iframe. 1522 added load/retry/readiness logic, but the user's Windows `file://` launch still showed the embedded editor while the context bridge remained permanently connecting. This is consistent with direct-file cross-document access/origin restrictions rather than a simple initialization race.

## 1600 architecture

Do not remove the full 0835 geometry editor. It remains the authoritative geometry/model editing surface.

For contextual placement preview, the outer page now owns a second Three.js renderer (`nativeFallback`). It reads the same shared project prop library and renders the selected parent prop plus placement reference geometry without crossing the iframe boundary.

Activation rules:

1. `file://` -> native placement viewport immediately.
2. hosted/same-origin -> try embedded-scene bridge first.
3. if bridge is not ready after ~2.5 seconds -> show native fallback.
4. if embedded bridge later succeeds -> hide native fallback and use the embedded scene again.

The `Retry Embedded Context` button keeps the bridge path available but the native view means placement authoring no longer depends on it.

## Placement authority

Parent placement data still uses `aegis-prop-placement-v1` definitions and local overrides are stored under `aegis-prop-placement-overrides-v1`. Intact/Damaged/Destroyed/variant models do not get separate placement definitions.

## Auto-reference behavior

`preferredContextForRule()` is authoritative for automatic preview choice:

- `building-adjacent` -> Building-adjacent
- Roadside + straight/any -> Straight road
- Roadside + T only -> T-intersection
- Roadside + four-way only -> Four-way intersection
- otherwise Free / Straight fallback as appropriate

Manual selection of `previewContext` remains allowed.

## Known limitation / follow-up

Under a direct `file://` launch the native placement renderer reads the shared prop library available to the outer document. It cannot inspect unsaved transient component edits inside an origin-isolated iframe. Save/publish geometry changes through the existing editor workflow before judging them in the native placement preview. A future cleanup could fully merge placement controls into the monolithic geometry editor and remove the iframe wrapper entirely.

## Validation distinction

Automated/static validation confirms syntax and integration contracts. This environment blocks direct browser navigation to local `file://` and localhost pages, so actual Windows direct-file visual behavior still requires field testing on the user's machine.
