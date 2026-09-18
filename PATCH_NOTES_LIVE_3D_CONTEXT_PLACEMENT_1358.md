# Project Aegis — 1358 Live 3D Contextual Prop Placement Preview

Build: `v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_PATCH`

## What changed

- Moved road/building placement context out of the separate 2D proxy preview and into the Prop Editor's real Three.js model viewport.
- Straight-road, T-intersection, four-way, and building-adjacent references now render beside the actual selected prop while the normal geometry/damage editor remains active.
- The cyan `PROP FORWARD / SPAWN FACING` indicator now lives in the same 3D transform hierarchy used for contextual placement.
- Curb/wall distance, lateral offset, facing, rotation, and mirror preview update the live 3D prop/context relationship immediately.
- Added **Drag prop to place in 3D**. When enabled, left-dragging in the viewport moves the prop on the ground plane and writes the resulting distance/lateral offset back to the placement controls. When disabled, the original orbit and component-picking behavior remains authoritative.
- Added live rotate ±5°, mirror, and preview-placement reset controls.
- Parent placement selection and the embedded 0835 geometry editor now synchronize selected props in both directions.
- Building preview includes a visible door/approach protected zone so placement can be judged against ingress clearance.
- Context geometry is editor-only presentation and is never written into the prop geometry model.

## Compatibility

- Existing 1215 placement rules and runtime resolver are unchanged.
- Intact/Damaged/Destroyed models, cosmetic variants, collision data, vehicle lighting anchors, factory recovery, and revision history remain owned by the 0835 editor.
- Save format remains **4**.
- No campaign/gameplay schema changes.
