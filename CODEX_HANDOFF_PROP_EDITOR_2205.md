# Codex Handoff — AEGIS Prop Editor 2205

Current prop tooling build: `v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH`
Save format: **4**
Baseline commit: `fab18aded547e4632cf606b20c12048b27dcf1ec` (2145)

## New authority model
- `assets/data/aegis-prop-library.js/json` remain the canonical project files.
- Browser key `aegis-prop-live-library-v1` can temporarily override the canonical prop library on the same origin/device.
- The shared library script applies this override synchronously before tactical runtime model lookup.
- `BroadcastChannel('aegis-prop-library-live-v1')` propagates editor publication to other open same-origin tabs/windows.
- `assets/data/aegis-prop-factory-library-2145.js/json` is an immutable full 57-prop factory snapshot for editor recovery.
- `assets/data/aegis-prop-last-known-good.js/json` is the rolling whole-library disk backup used before project-folder writes.

## Editor safety
- Up to 10 prior revisions per prop are kept in `aegis-prop-revision-history-v1`.
- Factory revert restores components, root transform, and collision while preserving the selected prop's stable runtime identity/gameplay metadata.
- Invalid libraries are not published.

## Follow-up
Field-test same-origin live editing with the installed PWA and normal browser play. Existing already-instantiated tactical meshes may need a tactical redraw/re-entry; newly built prop geometry uses the latest live library.
