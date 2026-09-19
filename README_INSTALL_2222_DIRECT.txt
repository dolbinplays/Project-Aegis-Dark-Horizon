PROJECT AEGIS 2222 — DIRECT COPY INSTALL

1. Extract this ZIP directly over the root of Project-Aegis-Dark-Horizon.
2. Allow files to overwrite their existing paths.
3. Fully close the installed Project Aegis app and any browser tabs running the game.
4. Launch Project Aegis once and allow several seconds for the service-worker update to install.
5. Fully close the app again, then reopen it.
6. Open Menu / Save.
7. Verify the header now contains:
   Enhanced SFX Library -> Tools / Editors -> Patch Notes / Version History
8. Click Tools / Editors and verify the Prop Editor and Runtime Test Gallery open from the hub.

WHY ONE REOPEN IS EXPECTED FOR THIS PATCH
The old 2115 worker can still own the first navigation while the 2222 worker is installing. After activation, subsequent navigation uses the new pre-render runtime-payload patch. This handoff is specific to updating the service worker; it does not change campaign save behavior.

SAVE FORMAT: 4
NO BAT / NO INSTALLER
