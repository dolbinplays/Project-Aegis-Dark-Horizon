# CODEX HANDOFF — v0.26.09.11.1410_PROCEDURAL_BUILDING_DISCOVERED_WALL_SHELL_CLOSURE_PATCH

Browser 1254 is the field-accepted baseline for horizon presentation. This patch addresses enterable procedural buildings that can appear as disconnected perimeter posts under a complete roof.

## Root cause
Browser 1855 intentionally requires both neighboring structural cells to be revealed before its wall connector span is drawn. The later full-building roof/cutaway presentation can make a building visually discovered while much of its perimeter cover is still unrevealed, producing the pillar-and-roof appearance.

## Repair
- `tacticalThreeDiscoveredBuildingIds(...)` identifies buildings legitimately discovered by revealed building presentation or living AEGIS occupancy.
- `tacticalThreeBuildingPresentationCovers(...)` creates renderer-only pristine proxies for unrevealed **exterior wall/window** cells of those buildings.
- The proxies are `revealed:true` only inside the rendering list so existing structural connectors can close the facade. They are not inserted into authoritative tactical covers.
- A revealed real state always wins. Revealed breaches/destroyed walls remain open; hidden damage receives a pristine proxy until observed.
- Doors, partitions, furnishings, LOS, pathing, cover HP, breach rules, AI, mission resolution, and saves are unchanged.

## Preserve
Do not move the proxies into battlefield state or save data. Do not synthesize partitions. Keep Browser 1855 connector ownership and Browser 2251 roof cutaway behavior. Save format remains 4.

## Field gate
Test discovered buildings from Iso/FPV/TPV, door openings, an unseen-to-seen breach transition, and a soldier entering a building whose far perimeter has not yet been individually revealed.

