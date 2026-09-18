# AEGIS Prop Editor 1740 — Game Prop Inventory

This editor-only patch adds a runtime visual inventory on top of the validated 1705 shared-library editor. It does not change Browser 1320 or save format 4.

The inventory merges the working shared prop library with a runtime-source scan. Shared rows are editable and open the matching definition. Legacy exact visuals and legacy matcher families remain visible as migration targets. Special/system visuals are separated so mission structures and hazards are not mistaken for ordinary props.

The editor ships with an embedded scan snapshot of current `main` (commit `4d223a5957`, `src/browser-runtime.html` blob `0b908738c2`) for direct `file://` use. `Scan Current Runtime` refreshes `src/browser-runtime.html` over same-origin HTTP; `Import Runtime HTML` provides the local-file fallback.

Preserve: canonical `assets/data/aegis-prop-library.js` authority, runtime JS export, r128 compatibility, continuous live transform sliders, natural orbit drag, and save format 4.
