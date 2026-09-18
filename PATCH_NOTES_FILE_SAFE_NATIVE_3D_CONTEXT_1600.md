# Project Aegis — 1600 File-Safe Native 3D Context Fallback Hotfix

**Build:** `v0.26.09.18.1600_FILE_SAFE_NATIVE_3D_CONTEXT_FALLBACK_HOTFIX`

**Authoritative GitHub baseline:** `v0.26.09.18.1358_LIVE_3D_CONTEXTUAL_PROP_PLACEMENT_PREVIEW_DIRECT_COPY`, commit `35b8c05147ac184fcca52f477206a74f92d11332`.

**Save format:** 4 (unchanged)

## Problem fixed

The 1358/1522 contextual editor could display the full 0835 geometry editor inside an iframe, but a normal Windows direct-file (`file://`) launch could prevent the outer placement editor from reaching the iframe's JavaScript globals. The prop model therefore rendered normally while the road/building bridge remained stuck in a connecting state.

A retry loop cannot reliably solve a browser origin boundary. This hotfix removes that boundary from the placement preview path.

## New file-safe native placement viewport

The outer contextual editor now loads Three.js directly and can render a native placement preview in its own document. On `file://` launches this activates immediately. On hosted/same-origin launches, the existing embedded-scene bridge is still attempted; if it does not connect promptly the native view becomes the fallback.

The native placement viewport renders:

- the selected prop from the shared AEGIS prop library;
- Straight road, T-intersection and Four-way intersection reference geometry;
- representative Building-Adjacent wall, doorway, windows and protected ingress area;
- curb / sidewalk / lane markings;
- cyan `PROP FORWARD / SPAWN FACING` arrow;
- mirrored placement preview;
- live placement distance, lateral offset, facing and rotation;
- ground-plane drag authoring when `Drag prop to place in 3D` is enabled.

The normal 0835 geometry editor remains present and continues to own component geometry, whole-prop transforms, collision, Intact/Damaged/Destroyed models, cosmetic variants, vehicle lighting anchors, revision history and factory reverts.

## Automatic 3D reference behavior retained

The 1522 roadmap behavior remains in place:

- Roadside props automatically select Straight road when eligible.
- If Straight road is not eligible, T-intersection or Four-way is selected according to the prop's legal contexts.
- Building-Adjacent props automatically select Building-adjacent.
- Free Placement props use Free context.
- The user can manually override the preview reference afterward.

## Compatibility

No tactical save schema changes were made. Save format remains 4. Placement overrides continue to use `aegis-prop-placement-overrides-v1`.

The game runtime placement implementation from the 1215 patch is not changed by this hotfix.
