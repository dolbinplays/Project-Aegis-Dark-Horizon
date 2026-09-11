# CODEX HANDOFF — v0.26.09.11.1448_PROCEDURAL_BUILDING_FACADE_CONNECTOR_INFILL_HOTFIX

Browser 1410 is the baseline. This hotfix addresses the remaining narrow exterior facade seams visible between neighboring wall/window cells.

## Root cause
Browser 1410 restored a complete presentation shell for discovered buildings, but the Browser 1855 connector path still treated every join containing a window as sill + lintel only. The center-to-center spacing between neighboring hex cells exceeds the rendered facade-cell width, leaving an uncovered vertical strip between cells.

## Repair
- `tacticalThreeFacadeConnectorInfillScale(distance)` computes only the uncovered geometric seam between neighboring facade-cell meshes.
- Window↔wall and window↔window structural joins retain the existing sill/lintel and add one full-height opaque `facade-infill` mesh across that seam.
- The infill is centered between cell centers; it does not occupy the actual aperture inside the window cell.
- Door cells remain open because they have no structural cover record. Revealed breaches remain open because breached/destroyed covers are excluded from structural connector ownership.
- Browser 1410 presentation-shell proxies remain the mechanism for still-unrevealed exterior spans of a legitimately discovered building.

## Preserve
Do not move facade infill into tactical covers or saves. Preserve transparent/shattered window behavior, Browser 1410 hidden-damage handling, Browser 1254 horizon presentation, tactical wall/LOS/pathing authority, and save format 4.

## Field gate
Inspect long exterior walls in 3D Iso, FPV, and TPV. Verify the narrow seam between neighboring wall/window cells is closed, while the actual window aperture, doors, and revealed breaches remain open.

