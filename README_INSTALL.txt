AEGIS 2030 — FULL EDITABLE SCENERY PROP MIGRATION

Baseline required:
- Latest main containing AEGIS Prop Editor 1945_LEGACY_PROP_MODEL_FIDELITY_MIGRATION_PATCH
- Game runtime still at v0.26.09.17.1320_PROP_EDITOR_RUNTIME_LIBRARY_INTEGRATION_PATCH
- Save format 4

HOW TO APPLY
1. Extract this ZIP into the root of your Project-Aegis-Dark-Horizon working copy.
   The "tools" folder in the ZIP should merge with the repository's tools folder.
2. Double-click APPLY_FULL_EDITABLE_SCENERY_PROP_MIGRATION_PATCH.bat
   OR run:
      node tools/apply-prop-scenery-migration-2030.cjs
3. The patcher writes the new runtime/editor/library files and documentation.
4. Run the focused test if you did not use the BAT:
      node --test tools/test-prop-editor-full-scenery-migration.cjs
5. Review, launch the game and Prop Editor locally, then commit/push the generated files.

WHAT IT DOES
- Keeps every 1945 shared prop.
- Replaces the old rock approximation with editable DodecahedronGeometry.
- Adds editable brush/crop family models.
- Adds editable wreck, civic statue, water fountain and power-panel models.
- Adds editable sedan, van, utility pickup and bus models.
- Preserves vehicle footprint authority, road rotation and headlights.
- Adds individually editable definitions for the full building-furnishing catalog.
- Adds editor controls for exact/contains/prefix visual matching and civic landmark scaling.
- Keeps special stateful renderers (doors, building structures, Skyranger/UFO, beacons, hazards) intact.

The script refuses to apply if it cannot find the expected 1945 editor / 1320 game baseline.
Save format remains 4.
