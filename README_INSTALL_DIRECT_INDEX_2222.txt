Project Aegis — 2222 Direct Index Runtime Repair

Build: v0.26.09.18.2222_NATIVE_TOOLS_EDITORS_RUNTIME_PAYLOAD_PATCH
Save format: 4 (unchanged)

INSTALL
1. Copy index.html to the repository/project root, replacing the prior index.html.
2. Copy AEGIS_Tools_Editors.html, AEGIS_Prop_Editor_CURRENT.html, and AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html to the same root.
3. Keep the existing versioned 2051 Prop Editor and Runtime Test Gallery files in place.

WHAT THIS FIXES
The Tools / Editors button is now physically present inside the embedded React runtime payload in index.html. It no longer depends on the service worker or post-render DOM injection to create the Save / Load control.

EXPECTED HEADER ORDER
Enhanced SFX Library -> Tools / Editors -> Patch Notes / Version History

No campaign rules, AI, combat, pathfinding, LOS, accuracy, objectives, prop definitions, editor schemas, or save schema were changed.
