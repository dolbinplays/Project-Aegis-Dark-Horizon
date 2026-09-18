# Codex Handoff — Contextual Prop Placement 1215

Current patch build: `v0.26.09.18.1215_CONTEXTUAL_PROP_PLACEMENT_AND_ORIENTATION_PREVIEW_PATCH`
Authoritative baseline: GitHub `main` commit `13cb9b461a3f0f8aae28a0f1577822a170a92080`
Save format: **4**.

## Architecture
- `assets/data/aegis-prop-placement-rules.js` is the shipped parent-placement catalog. When the canonical prop library is present, it merges a normalized `placement` object onto every parent prop (specific legacy street/building props get authored rules; unlisted props receive Free Placement / Preferred Context).
- `assets/data/aegis-prop-placement-overrides.js|json` is an optional project-authored sidecar written by the 1215 editor. Runtime/localStorage overrides take precedence over shipped defaults.
- `assets/runtime/aegis-contextual-prop-placement-runtime.js` wraps the current global tactical placement/camera seams without changing save schema.
- `service-worker.js` preserves the current launch/cache architecture and transforms only the response for `assets/data/aegis-prop-library.js`: canonical geometry text + placement rules + optional override + runtime-extension loader.
- Existing `index.html` and `src/browser-runtime.html` are intentionally untouched in this direct-copy patch; both already request the shared prop library as an external script.

## Placement runtime
- Street-scene results are contextualized after legacy generation, preserving the existing procedural road/building generators as fallback authorities.
- `tacticalApplyHexEdgePropPlacement` is also wrapped so shared props produced outside the street-life pass receive the same parent authority.
- Resolved covers are stamped with `propPlacementAuthority` and are idempotent on subsequent passes. This prevents save/reload or later annotation passes from choosing a second orientation.
- Existing `tacticalBuildingIngressProtectedCellKeys()` is consulted for building-adjacent and off-lane roadside candidates.
- Road context classification is deterministic from adjacent road/lane/path cells: 2-or-fewer road neighbors = straight, 3 = T, 4+ = four-way.
- Opposite curb sides derive facing from the prop-to-road vector; mirroring is tied to resolved side when possible, then stable-hash fallback for centerline cases.

## Camera inversion
- Storage key: `project-aegis-invert-vertical-camera-v1` (`1`/`0`), default Off.
- The extension wraps `tacticalThreePersistentUpdateCamera`, installs pointer/touch look only on `firstPersonCamera` / `thirdPersonCamera`, and applies a local pitch/yaw offset after the existing automatic camera pose.
- The inversion multiplier applies only to the manual vertical delta. Horizontal delta is identical either way.
- Guards exclude `runtime.camera` (ordinary Iso), `cinematicCamera`, boarding cinematic, and incoming-fire reaction TPV. Existing AI/base camera motion remains the underlying pose and is not inverted.

## Follow-up after field acceptance
If 1215 is accepted, consider folding the extension functions directly into `src/browser-runtime.html` and materializing placement onto the canonical JSON/JS library during a future full source rebuild. The extension architecture is intentionally reversible and low-risk for this migration patch.
