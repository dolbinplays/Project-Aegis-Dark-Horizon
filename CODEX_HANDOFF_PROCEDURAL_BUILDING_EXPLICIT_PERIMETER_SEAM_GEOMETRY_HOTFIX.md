# CODEX HANDOFF — v0.26.09.11.1610_PROCEDURAL_BUILDING_EXPLICIT_PERIMETER_SEAM_GEOMETRY_HOTFIX

Browser 1532 is the baseline. This hotfix addresses the still-field-reproduced vertical slits between intact procedural exterior facade segments by moving **exterior seam ownership from tactical hex-neighbor inference to the building plan's explicit perimeter order**.

## Exact regression fixture
Use mission id `4ab9770a-ce83-471b-8cf3-53ca0fcb1765`: Urban Scout Raid / North America / Threat 2 / Glass Wraith / reward 520 / panic +16. Current deterministic layout: Municipal Records Office (19,32 / 12x9), Corner Market (49,32 / 10x8), Vehicle Workshop (19,46 / 12x8). The intact discovered perimeter produces 34 / 30 / 32 explicit seam strips respectively.

## Root cause and repair
- Browser 1532 already proves every discovered exterior facade cell is renderer-eligible under partial LOS. The field screenshots nevertheless retain narrow vertical gaps, so visibility is no longer the remaining cause.
- Individual facade pieces are narrower than their world-space cell-center spacing. The old connector system derives joins through tactical hex-neighbor ownership and can omit a visually necessary rectangular-building facade join.
- `tacticalThreeBuildingPerimeterSeamPairs(...)` walks each plan's top/bottom/left/right perimeter in plan order. Consecutive intact `wall`/`window` presentation records become one explicit seam pair.
- `tacticalThreeBuildExplicitPerimeterSeams(...)` measures actual Three.js world-space distance and fills only the unused gap with an opaque, full-height presentation mesh.
- Persistent and fallback Three.js renderers run this seam pass. Exterior facade pairs are filtered out of the legacy connector path to avoid duplicate coplanar geometry; partitions/non-exterior joins keep the legacy connector.

## Preserve information authority
Doors intentionally break the run. Revealed breaches break the run and remain open. Hidden damage retains Browser 1410's pristine presentation shell until observed. Windows retain their actual apertures. Never move these seam meshes into tactical covers, pickables, saves, LOS, pathing, damage, AI, or mission authority.

## Preserve
`tacticalBuildingPlans`, `tacticalBuildingCovers`, `makeBattlefield`, `resolveMission`, `tacticalMissionTerminalState`, and `tacticalAiMissionResolution` remain byte-for-byte Browser 1532. Preserve Browsers 1532/1448/1410 building presentation fixes, Browser 1254 horizon presentation, save format 4, Installed PWA Single-Launch Update Handoff roadmap item, and Mobile Tactical Status HUD Collapse / Expand roadmap item.

## Field gate
Replay the exact saved Urban Scout Raid and inspect the same long facades shown in the field screenshots. No intact exterior wall/window join should show a narrow vertical slit. Windows, doors, revealed breaches, hidden interiors, and hidden-damage authority must remain correct.

---
