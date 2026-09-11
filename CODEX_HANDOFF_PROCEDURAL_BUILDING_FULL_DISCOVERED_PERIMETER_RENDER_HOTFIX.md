# CODEX HANDOFF — v0.26.09.11.1532_PROCEDURAL_BUILDING_FULL_DISCOVERED_PERIMETER_RENDER_HOTFIX

Browser 1448 is the baseline. This hotfix fixes the remaining field-reproduced building facade gaps by separating **building discovery** from **per-facade-cell current LOS** in presentation only.

## Exact regression fixture
Use mission id `4ab9770a-ce83-471b-8cf3-53ca0fcb1765`: Urban Scout Raid / North America / Threat 2 / Glass Wraith / reward 520 / panic +16. The current deterministic generator produces Municipal Records Office, Corner Market, and Vehicle Workshop. The regression must discover each building from one exterior cell and still make every exterior wall/window presentation record renderer-eligible.

## Root cause and repair
- Browser 1410 already generated pristine renderer-only proxies for unrevealed exterior wall/window cells after legitimate building discovery.
- Browser 1448 already supplied connector infill.
- The remaining failure was the cover renderer itself: its outer filter and connector-neighbor filter still required every facade cell to belong to the current visible-set.
- `tacticalThreeBuildingPresentationCoverShouldRender(...)` preserves ordinary current-visible rendering, but additionally permits exterior wall/window presentation records for a legitimately discovered building.
- Persistent and fallback Three.js renderers use the same helper for both facade cells and structural connector neighbors.

## Information authority
Do not broaden this to partitions or furnishings. Door cells have no exterior record and stay open. Hidden breaches keep a pristine shell until revealed; revealed breaches suppress the proxy and remain open. Do not move presentation shell records into tactical covers or saves.

## Preserve
`tacticalBuildingPlans`, `tacticalBuildingCovers`, `makeBattlefield`, `resolveMission`, `tacticalMissionTerminalState`, and `tacticalAiMissionResolution` must remain unchanged from Browser 1448. Preserve Browser 1448 connector infill, Browser 1410 shell proxies, Browser 1254 horizon presentation, save format 4, Installed PWA Single-Launch Update Handoff roadmap item, and Mobile Tactical Status HUD Collapse / Expand roadmap item.

## Field gate
Replay the exact saved Urban Scout Raid and inspect all three deterministic buildings from 3D Iso, FPV, and TPV under partial discovery. Exterior gaps should be gone while windows, doors, revealed breaches, hidden interiors, and hidden-damage authority remain correct.

---
