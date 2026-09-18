AEGIS 2030 FULL EDITABLE SCENERY PROP MIGRATION — DIRECT COPY ZIP

This package is intentionally installer-free.

INSTALL
1. Close the game/editor if they are open.
2. Extract this ZIP directly into the root of your Project-Aegis-Dark-Horizon folder.
3. Allow Windows to merge folders and replace files when prompted.
4. Open AEGIS_Prop_Editor_CURRENT.html to edit the shared game prop library.
5. Launch the game normally through your existing index.html / installed PWA.

FILES REPLACED / ADDED
- AEGIS_Prop_Editor_CURRENT.html
- AEGIS_Prop_Editor_v0.26.09.17.2030_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH.html
- assets/data/aegis-prop-library.js
- assets/data/aegis-prop-library.json
- CODEX_HANDOFF_PROP_EDITOR_2030.md
- PROP_EDITOR_FULL_EDITABLE_SCENERY_FIELD_ACCEPTANCE.txt
- VALIDATION_SUMMARY_PROP_EDITOR_2030.txt
- tools/test-prop-editor-full-scenery-migration-direct.cjs

WHY THIS VERSION IS DIFFERENT FROM THE FAILED INSTALLER
The earlier package expected a separate 1945 editor HTML file to already be present locally and then patched the large game HTML files. This direct-copy package does not require that baseline file and does not run a patcher.

The shared prop library now carries a small deferred 2030 runtime bridge. The existing game already loads assets/data/aegis-prop-library.js, so the bridge activates after the current runtime starts and adds the new shared-prop capabilities without requiring you to replace index.html or src/browser-runtime.html.

WHAT IS NOW EDITABLE / GAME-BACKED
- All 15 props from the pushed 1945 shared library remain present.
- Exact dodecahedron rock.
- Brush and crop families.
- Vehicle wreck.
- Civic statue and water fountain with existing multi-hex landmark scale preserved.
- Power panel.
- Sedan, van, utility pickup, and bus, while retaining the existing road rotation, multi-hex footprint, and headlight systems.
- The complete current procedural building interior furnishing catalog.

Dedicated stateful/special renderers remain dedicated: interactive building doors, structural walls/windows, Skyranger/UFO structures, alien beacons, and tactical fire/smoke/flare effects.

SAVE FORMAT
Save format remains 4.
