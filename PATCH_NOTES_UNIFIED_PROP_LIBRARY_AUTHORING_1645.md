# Project Aegis — 1645 Unified Prop Library / Placement / Model Authoring Patch

Build: `v0.26.09.18.1645_UNIFIED_PROP_LIBRARY_PLACEMENT_AND_MODEL_AUTHORING_PATCH`

Authoritative baseline: GitHub `main` commit `0b39b8a7bcdf6af162eed83a1472ad85b8396212` (`v0.26.09.18.1600_FILE_SAFE_NATIVE_3D_CONTEXT_FALLBACK_HOTFIX`).

Save format remains **4**.

## Purpose

Remove the confusing split between the outer Parent Prop Placement Authority selector and the embedded Game Prop Library selector. The normal Prop Editor now has one authoritative selected prop and one native 3D viewport.

## Changes

- Replaces the two-normal-editor workflow with one **Prop Library & Placement** selector.
- Selecting a prop once now loads that same prop into:
  - placement rules,
  - contextual road/building preview,
  - whole-prop position / rotation / scale,
  - model target selection,
  - collision metadata,
  - component list and component transforms/materials.
- Adds explicit **Placement** and **Model / Components** authoring tabs at the top of the editor.
- Placement mode retains the 1600 file-safe road, T-intersection, four-way, building wall, doorway protection, mirroring, forward-arrow, and direct placement-drag preview.
- Model / Components mode resets the viewport to model-authoring coordinates and exposes:
  - whole prop Position / Rotation / Scale,
  - component selection by list or by clicking the 3D model,
  - component Position / Rotation / Scale,
  - primitive geometry fields,
  - material color, roughness, metalness, opacity, emissive, cast-shadow,
  - Add / Duplicate / Delete component,
  - collision JSON editing,
  - Undo / Redo.
- Existing Damaged, Destroyed, and cosmetic variant targets can be selected for editing when they already exist.
- Normal model edits can auto-apply to the browser's live prop library using the same live-library key and revision-history key already used by the advanced editor.
- Placement publishing still uses the existing parent placement override key and can still write project-folder placement sidecars.
- The preserved 0835 editor remains available from **Open Advanced / Recovery Editor** for factory reset, revision restoration, creating/resetting presentation states, and deep vehicle-lighting-anchor work.
- The Runtime Test Gallery remains directly accessible.

## Compatibility

- No tactical save schema change.
- No game/runtime tactical files changed in this editor-only patch.
- Existing placement overrides and live prop-library browser data remain compatible.
- Factory-original/revision recovery systems are not removed.

## Field testing requested

1. Open `AEGIS_Prop_Editor_CURRENT.html` directly from the project folder.
2. Select Bus Stop once in **Prop Library & Placement**.
3. Confirm Placement mode shows Straight road automatically.
4. Switch to **Model / Components** without re-selecting Bus Stop.
5. Change whole-prop position/scale and confirm the same Bus Stop updates in the center viewport.
6. Select a component from the list and by clicking the model; adjust its transform/geometry.
7. Switch back to Placement and confirm the same Bus Stop and its contextual rule are still selected.
8. Reload after a live apply and confirm edits persist through the existing live prop-library path.
