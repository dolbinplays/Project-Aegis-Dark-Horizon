# Codex Handoff — Unified Prop Library Authoring 1645

## Baseline
- Repo: `dolbinplays/Project-Aegis-Dark-Horizon`
- Base commit: `0b39b8a7bcdf6af162eed83a1472ad85b8396212`
- Base release: `v0.26.09.18.1600_FILE_SAFE_NATIVE_3D_CONTEXT_FALLBACK_HOTFIX`
- Save format: **4**

## Architectural change
The 1600 editor used an outer placement-authority UI plus a second 0835 Game Prop Library editor, which caused two independent-looking prop selections. 1645 makes the outer/native editor the normal authoritative authoring surface.

There is now one selected visual key (`#prop`) driving both placement and model/component authoring. No iframe is used by the normal editing path.

## Normal editor modes

### Placement
- Parent placement metadata only.
- Existing 1600 context behavior retained:
  - free / straight / T / four-way / building-adjacent,
  - auto context selection,
  - curb/wall offset,
  - facing/rotation/mirroring,
  - protected ingress visualization,
  - PROP FORWARD arrow,
  - direct ground-plane drag.

### Model / Components
- Uses the same selected prop.
- Native viewport operates at model origin instead of contextual placement transform.
- Whole-prop `rootTransform` editing.
- Existing damage/variant target editing when targets exist.
- Component CRUD and transform/geometry/material editing.
- Collision JSON editing.
- Component ray-picking in the viewport.
- Browser live publishing writes the same `aegis-prop-live-library-v1` format.
- Revision snapshots use `aegis-prop-revision-history-v1`.

## Advanced/recovery continuity
The 0835 editor is intentionally preserved and opened only when requested via the Advanced / Recovery control. It remains responsible for workflows not duplicated in 1645, especially:
- factory reset,
- selecting/restoring saved revision history,
- creating/resetting Damaged/Destroyed targets,
- adding/renaming/deleting variants,
- deep vehicle-lighting-anchor editing,
- full project-library write workflow.

Do not remove the 0835 file from the repository.

## Important keys retained
- Placement overrides: `aegis-prop-placement-overrides-v1`
- Live library: `aegis-prop-live-library-v1`
- Revision history: `aegis-prop-revision-history-v1`
- Auto publish: `aegis-prop-auto-publish-v1`
- Broadcast channel: `aegis-prop-library-live-v1`

## QA focus for next iteration
- Windows direct `file://` launch.
- Prop selection remains identical when toggling authoring modes.
- Component clicking/ray-picking on scaled/rotated props.
- Auto-publish debounce during slider drags.
- Undo/Redo after component CRUD and transform edits.
- Advanced editor sees live-published 1645 geometry after opening/reloading.
- No regression to 1600 placement previews or project placement-sidecar writes.
