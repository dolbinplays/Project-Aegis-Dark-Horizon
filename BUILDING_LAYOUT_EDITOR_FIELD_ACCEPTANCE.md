# Building Layout Editor — Foundation

Build: `v0.26.09.19.0002_BUILDING_LAYOUT_EDITOR_FOUNDATION_PATCH`

Open **Tools / Editors → Building Layout Editor**, or open
`AEGIS_Building_Layout_Editor_CURRENT.html` from the project root.
Keep the editor beside `index.html` and the `assets` directory.

## Included

- Existing 9 × 8 residence footprint, generated furnishings, and shared prop visuals.
- Wall, window, door, furnishing and removal brushes; select, rotate, duplicate,
  undo/redo; browser draft recovery; JSON import/export.
- Actual tactical Three.js rendering, with a roof cutaway.
- Shared validation for exterior gaps, missing doors, overlapping occupied cells,
  blocked door approaches/swing clearance, disconnected footprints, and unreachable rooms.
- Validation uses tactical cell occupancy and pathing rules; it does not promise
  arbitrary mesh-to-mesh collision detection. Check unusually scaled props visually.
- A walking fixture uses the tactical pathfinder and automatic door opening;
  adjacent door interaction uses the game's normal door action.
- Publish applies the validated template to residences in **newly generated**
  battlefields on the same browser/origin. Missions capture a layout snapshot.
  Restored battles retain their layout and door state under save format 4.
- “Use procedural layouts” removes the published override for future battles.
  It does not remove the draft or rewrite saved missions.

## Verification completed

- Build identity/source/payload checks and embedded JavaScript syntax.
- Automated layout validation, row-parity, compiler, publication, corrupt-data
  fallback, mission snapshot, and actual tactical save/restore tests.
- Existing tetromino, furnishing, and door-geometry regression suites.
- Browser smoke: template loading, furniture placement, blocked doorway rejection,
  undo, publish, walking indoors, door interaction, fixture serialization, and
  tactical preview rendering.
- Full battlefield-generation browser test: all 39 authored items retained in a
  313-cover mission. The editor exposes this check as **Test mission generation**.
- Direct `file://` launch could not be tested because the browser automation's URL
  policy blocks local-file navigation. Hosted startup was tested successfully.

## Field acceptance still needed

1. Publish an edited dwelling on the same hosted origin as your campaign.
2. Generate a new Small Town battlefield with a residence. Confirm the edited
   furnishings and doorway placement, including 2D and 3D views.
3. Move a squad through the entrance and around the furnishings; open/close doors.
4. Save, reload, and confirm geometry, soldier positions and door states remain.
5. Publish another revision; confirm the existing battle retains its snapshot.
6. Revert to procedural layouts and generate another battlefield.
7. Test the installed PWA after the new worker has installed, then repeat offline.

The fixture round-trip is isolated from campaign saves. A full campaign mission
and installed-PWA field run are not represented by that fixture test.

Local-file storage behavior varies by browser. JSON export/import is the portable
handoff; hosted editor and game must share the same origin for browser publishing.

## Deferred scope

Arbitrary footprint painting, business archetypes, multiple template selection,
project-folder layout libraries and content spawning controls remain follow-on work.
The foundation editor does not redefine shared prop models or campaign rules.

Run `node --test tools/test-building-layout-editor.cjs` for focused regression checks.
