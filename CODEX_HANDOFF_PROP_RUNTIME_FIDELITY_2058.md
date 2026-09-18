# AEGIS 2058 — Prop Runtime Fidelity & Test Gallery

Build: `v0.26.09.17.2058_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH`  
Save format: **4**

This patch builds on the delivered 2030 direct-copy scenery overlay and does not require replacing the multi-megabyte browser runtime. `assets/data/aegis-prop-library.js` continues to act as the deferred runtime bridge.

## New authority layer
Each shared prop now carries an optional `rootTransform` (`position`, `rotation`, `scale`). The editor previews it, the exported runtime library preserves it, and the game-side bridge applies it before special runtime scaling. Civic landmark scaling therefore multiplies the editor-authored root scale instead of replacing it.

The editor also reports whether a model is fully shared-editor driven, family matched, or shared geometry with retained runtime behavior (vehicles, civic landmarks, power panel).

## Runtime QA gallery
`AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html` loads the exact canonical shared library and exposes all 57 props in one QA surface. Camera presets: Iso, TPV, FPV, Top. Runtime-context controls exercise landmark scale, power-panel state and vehicle lights. The running game can open the gallery with **Ctrl+Shift+G**; `?propqa=1` also exposes a small Prop QA button.

## Validation intent
The focused Node test verifies build identity, 57 shared definitions, root transforms, gallery wiring, editor authority/root controls, bridge preservation, and (when run inside the full repository) scans `src/browser-runtime.html` to confirm ordinary scenery exact visual keys resolve to a shared model or an explicit dedicated-renderer exception.
