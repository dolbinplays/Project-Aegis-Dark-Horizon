# Project Aegis — Contextual Prop Placement & Orientation Preview Patch

Build: `v0.26.09.18.1215_CONTEXTUAL_PROP_PLACEMENT_AND_ORIENTATION_PREVIEW_PATCH`
Baseline: `v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_DIRECT_COPY` / `13cb9b461a3f0f8aae28a0f1577822a170a92080`
Save format: **4** (unchanged)

## What changed
- Added parent-level placement authority with Free Placement, Roadside, and Building-Adjacent modes plus Preferred/Required context strictness.
- Roadside rules support Straight, T-intersection, Four-way and Any-road eligibility, curb distance, lateral offset, facing, side, mirroring, road-surface permission, and deterministic orientation.
- Building-adjacent rules support wall distance, lateral offset, toward/away/along-wall facing, rotation, mirroring, window-avoidance intent, and mandatory use of the existing ingress-protection mask.
- Added deterministic runtime migration for the existing street-scene generator output. Legacy props without placement metadata remain legal through Free/legacy fallback.
- Required Roadside props are removed rather than freely spawned when no legal context exists; Preferred props retain graceful legacy fallback.
- Existing 0835 prop geometry/damage data is preserved. Placement rules merge onto each parent prop at runtime; damage states and cosmetic variants inherit the parent rule.
- Added a contextual Prop Editor wrapper with the full 0835 geometry/damage editor retained alongside placement controls and a spawn-facing reference preview.
- Added a contextual Runtime Test Gallery wrapper while retaining the full 0835 state/variant/day-night/vehicle-light/anchor gallery.
- Added `Invert Vertical Camera`, default Off, stored only in local browser/device storage. It applies only to manual FPV/TPV perspective pointer/touch vertical look; Iso pan and scripted/AI camera paths are excluded.

## Runtime integration
The current 0835 geometry library is deliberately not replaced. The updated service worker serves the existing canonical `aegis-prop-library.js`, merges `aegis-prop-placement-rules.js` (and optional project-authored overrides) onto parent definitions, then loads `assets/runtime/aegis-contextual-prop-placement-runtime.js`.

This keeps the 2145 factory-original/revision/Last Known Good geometry recovery system intact and avoids reconstructing or downgrading any of the 57 current shared models.
