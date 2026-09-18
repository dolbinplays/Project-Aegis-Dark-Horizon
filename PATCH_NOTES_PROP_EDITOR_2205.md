# AEGIS 2205 — Live Prop Publishing & Safe Revert

Build: `v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH`

- Added same-origin live library publishing from Prop Editor to the game and Runtime Test Gallery.
- Added BroadcastChannel/storage synchronization for live prop overrides.
- Added immutable 57-prop 2145 factory baseline and per-prop safe revert.
- Added up to 10 browser-stored prior revisions per prop.
- Added Restore Last Backup / Restore Selected Revision / Revert Model to Factory / Reset All Models to Factory.
- Added project-folder connection and optional automatic mirroring through File System Access API.
- Project writes preserve the previous canonical whole library as `aegis-prop-last-known-good.js/json`.
- Added publish validation for unique visual keys, usable components/geometry, positive scales, and collision sanity.
- Runtime Test Gallery reloads on live editor publication.
- Preserved 2145 original-model restoration, 2120 installed-app gallery URL fix, and save format 4.
