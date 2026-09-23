# Fence Enclosures & Access Gaps

Build: v0.26.09.22.0008_FENCE_ENCLOSURES_AND_ACCESS_GAPS_PATCH

New town and farm battlefields replace scattered generated fence props with deterministic connected plots. Town maps permit one yard, preferring proximity to buildings; farms permit two plots. A candidate must have an empty plot and surrounding apron, with no buildings, protected ingress, roads, lanes, streams, irrigation or existing cover. Unsafe candidates are skipped.

Each enclosure leaves two two-hex gates. Saved fence links drive two half-segments per connected fence cell, joining at shared midpoints. Both Three.js renderers use the current canonical Prop Editor fence model through its normal runtime renderer. Whole-cell solid-prop navigation remains authoritative. Normal deployment clearance and destruction can remove segments.

Only newly generated battlefields receive these layouts. Existing saved tactical cover arrays are not regenerated. Save format remains 4.

## Automated checks
- Five fence tests pass: farm/town generation at small/medium/large sizes; protected-cell and pathfinder access checks; saved-cover idempotence; matching sync/async fence placement; crowded-map rejection; and canonical model connection geometry (grouped into five tests).
- Nine existing solid-prop/hex-edge movement tests pass.
- Full suite: 449 checks, 414 passed, 35 failed. Failing names match the prior baseline; no new failing names.
- Build seams, packaged runtime identity, embedded JavaScript syntax and whitespace checks pass.

## Live acceptance pending
Inspect a newly generated town and farm battle in 3D Iso, FPV/TPV and 2D. Walk through both gates, destroy a fence segment, and save/reload. Confirm the fence appearance, gap width, damage presentation and Skyranger clearance in actual play. Automated model tests verify geometry and shared renderer use but do not substitute for visual inspection.
