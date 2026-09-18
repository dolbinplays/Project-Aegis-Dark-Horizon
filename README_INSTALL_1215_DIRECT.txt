AEGIS v0.26.09.18.1215_CONTEXTUAL_PROP_PLACEMENT_AND_ORIENTATION_PREVIEW_PATCH — DIRECT COPY

BASELINE REQUIRED
v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_DIRECT_COPY
GitHub commit 13cb9b461a3f0f8aae28a0f1577822a170a92080

INSTALL
1. Close the game/Prop Editor if open.
2. Extract this ZIP directly into the root of Project-Aegis-Dark-Horizon.
3. Allow Windows to merge folders and replace AEGIS_Prop_Editor_CURRENT.html, AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html, service-worker.js, and release-metadata.json.
4. No BAT file or installer is required.
5. Open AEGIS_Prop_Editor_CURRENT.html for placement authoring. The complete 0835 geometry/damage editor remains embedded on the right side of the new editor page.
6. Open AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html for context previews plus the complete 0835 runtime gallery.

HOSTED / INSTALLED APP NOTE
Runtime map-generator and Invert Vertical Camera integration is injected through the updated service-worker path that already fronts the installed/PWA build. Browser field testing should therefore be done from the hosted/PWA build (or a local HTTP server), not file:// index.html. The editor/gallery authoring pages themselves can still be opened as ordinary files.

SAVE FORMAT REMAINS 4.
The canonical 0835 geometry/damage library and 2145 factory recovery data are not overwritten by this patch.
