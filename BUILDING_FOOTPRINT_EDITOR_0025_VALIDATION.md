# Browser 0025 — Building footprint editor

The residence editor now supports adding and removing building cells within its existing 9 × 8 grid. Select **Add / remove building cell** to toggle cells. Removing a cell removes its wall or furnishing; Undo and Redo restore the footprint and contents together. Newly exposed edges must be sealed before publishing or writing to the project.

Validation runs at both staggered hex-row offsets. Invalid layouts disable publishing, project writes and mission-generation testing. Larger grids and additional building archetypes remain roadmap items. Existing battle snapshots are unchanged; save format remains 4.

## Completed checks

- All 13 building-layout checks pass, including non-mutating footprint edits, coordinate and minimum-size guards, sealed L-shaped footprints on both row offsets, serialization and generation, and rejection of disconnected cells or exposed perimeter gaps.
- Fresh headless Edge exercised the actual editor: removing a perimeter wall produced an invalid 71-cell footprint and disabled project writes; Undo restored validity, Redo restored the invalid edit, and another Undo restored validity.
- Imported a valid 60-cell L-shaped residence in the browser and ran mission generation: all 29 authored items were retained in a 289-cover battlefield. The rendered footprint and missing-cell placeholders were visually inspected. No page errors occurred.
- Build packaging and build seam checks pass for `v0.26.09.30.0025_BUILDING_FOOTPRINT_EDITOR_PATCH`.
- Browser verification used a fresh test context and did not modify player campaign data.

## Manual acceptance after deployment

Open the building editor in Chrome or Edge, reshape a residence, seal its exterior and validate. Write it to the project using the native folder picker, review the authored files, and generate a new mission after publishing. Confirm the installed game loads the updated assets. Native folder prompts and deployed installed-game acceptance remain manual checks.

The requested confirmation before overwriting an occupied manual save slot was added to the roadmap; it is not implemented in this release.
