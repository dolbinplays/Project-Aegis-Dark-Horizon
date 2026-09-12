# CODEX HANDOFF — v0.26.09.11.2015_TACTICAL_ALIEN_BEACON_REINFORCEMENT_MATERIALIZATION_PRESENTATION_PATCH

Browser 1800 is the release baseline. Browser 1800's Android PWA cold-start/release-beacon architecture has been preserved; its no-update cold-start behavior is field accepted. This patch implements the parked observed Alien Field Beacon reinforcement materialization presentation without changing tactical authority.

## Presentation authority
- Do not create a reinforcement/transport resolver. `tacticalAlienReinforcementArrival(...)`, `reinforcementLandingVisible`, and ordinary `visibleByHumans(...)` remain authoritative.
- `tacticalThreePersistentCreateAlienTransitMaterializationEffect(...)` may create runtime-only presentation only when the arriving unit is an alive alien, `reinforcementLandingVisible` is already true, and AEGIS can legitimately see the arrival hex.
- Hidden arrivals must create no glow, silhouette, pulse, camera cue, or destination disclosure.
- The effect remains at the unit's already-authoritative hex. It may not move actors, change HP/TU/ammo, alter counts, reveal fog, select cells, affect cover/LOS/pathing/targeting, or alter mission results.

## 3D presentation
- Persistent 3D Iso / FPV / TPV share one `transitRoot` and one deduplicated effect map keyed by authoritative alien identity.
- The sequence uses additive containment rings, asymmetric energy filaments, particles, a coarse wireframe alien silhouette, then the normal alien model resolves during the final phase.
- Auto/Quality duration is 1350 ms. Performance duration is 980 ms.
- Transit state holds the persistent renderer animation loop open until effect completion.
- Renderer disposal clears `transitRoot`, transit maps, and associated shared presentation resources.

## 2D Hex presentation
- `BattleUnitGlyph(...)` uses only the existing observed `reinforcementLandingVisible` state to add a lightweight paired-ring pulse/drop-shadow.
- Do not add a second transport simulation or new tactical state for 2D.

## Preserve
Preserve Browser 1800 Android PWA cold-start/release-beacon architecture, Browser 1740 Mobile Tactical Status HUD collapse/expand, Browser 1610 field-accepted building seam geometry, Browser 1254 horizon fog/depth treatment, all reinforcement timing/count/shield/AI authority, exactly one `finishAiPlayback()`, and save format 4.

The following functions were compared byte-for-byte to Browser 1800 and must remain unchanged unless a future gameplay patch explicitly targets them:
- `tacticalAlienReinforcementArrival(...)`
- `tacticalBuildingPlans(...)`
- `tacticalBuildingCovers(...)`
- `makeBattlefield(...)`
- `resolveMission(...)`
- `tacticalMissionTerminalState(...)`
- `tacticalAiMissionResolution(...)`

## Field gates
1. Browser 1800 installed Android PWA -> publish Browser 2015 -> one manual app launch should reach Browser 2015 without a second launch.
2. Trigger an observed Beacon reinforcement and inspect 3D Iso, FPV, TPV, and 2D Hex.
3. Repeat with a hidden arrival and verify no position leak.
4. Repeat waves and verify transit effects clean up/deduplicate.
5. Confirm reinforcement counts/timing/shield behavior, Mobile HUD collapse/expand, building seams, and save format 4 remain correct.
