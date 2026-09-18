AEGIS 2205 LIVE PROP PUBLISHING & SAFE REVERT — DIRECT COPY ZIP

BUILD
v0.26.09.17.2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT_PATCH

INSTALL
1. Close the game/editor if open.
2. Extract this ZIP directly into the root of Project-Aegis-Dark-Horizon.
3. Allow Windows to merge folders and replace files.
4. Open AEGIS_Prop_Editor_CURRENT.html.
5. Launch/reload the game normally after editing.

WHAT CHANGED
- Valid editor changes can auto-publish into the same-origin live prop library used by the game and Runtime Test Gallery.
- Same-origin game/gallery tabs receive BroadcastChannel updates; the gallery reloads automatically to show the new model. Existing tactical geometry may require the game to redraw/re-enter the tactical view, but future model construction uses the updated library immediately.
- The editor keeps up to 10 previous revisions per prop in browser storage.
- Every prop can revert its model geometry/root transform/collision to the immutable full 57-prop 2145 factory baseline. The 12 restored Foundation originals therefore revert to their original 1155 designs.
- A connected local project folder can be mirrored automatically. Before the editor overwrites the canonical JS/JSON, it copies the previous whole files to assets/data/aegis-prop-last-known-good.js/json.
- Project-folder connection uses the browser File System Access API when available. Live browser publishing still works if that API is unavailable.
- Malformed/zero-scale/duplicate-key definitions are blocked from live/project publishing.
- Save format remains 4.

IMPORTANT SCOPE
The browser live layer is same-origin/device-local. It does not push GitHub for you. Project-folder mirroring updates your local repo files; commit/push remains the normal way to distribute those canonical edits to other devices/installed apps.
