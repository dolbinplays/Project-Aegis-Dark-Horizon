AEGIS 2058 PROP RUNTIME FIDELITY & TEST GALLERY — DIRECT COPY PATCH

BUILD
v0.26.09.17.2058_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH

INSTALL
1. Close the game/editor if open.
2. Extract this ZIP directly into the root of Project-Aegis-Dark-Horizon.
3. Allow Windows to merge folders and replace files.
4. Open AEGIS_Prop_Editor_CURRENT.html for editing.
5. Open AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html for the QA gallery.
6. Launch the game normally. Ctrl+Shift+G opens the same gallery from the running game. If you launch index.html?propqa=1, a small Prop QA button is also shown.

WHAT THIS PATCH ADDS
- Whole-prop/root Position, Rotation and Scale controls in the Prop Editor.
- Runtime applies those root transforms before civic landmark footprint scaling.
- Per-prop Game Runtime Authority status: fully shared, family-shared, or editor visual + retained runtime behavior.
- Runtime test gallery covering all 57 shared props with Iso, TPV, FPV and Top camera presets.
- Gallery controls for landmark footprint scale, power-panel online/offline indicator, and vehicle headlights.
- Runtime status object and Ctrl+Shift+G gallery shortcut.
- Inventory/fidelity regression test for repository use.

CONTINUITY
The previously delivered 2030 direct-copy overlay is the local baseline for this package. GitHub main was still at pushed Prop Editor 1945 when this patch was built; 2030 had not yet been pushed. Save format remains 4.
