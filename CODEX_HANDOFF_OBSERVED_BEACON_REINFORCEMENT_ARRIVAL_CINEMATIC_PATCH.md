# CODEX HANDOFF — v0.26.09.11.2058_OBSERVED_BEACON_REINFORCEMENT_ARRIVAL_CINEMATIC_PATCH

Browser 2015 is the release baseline. Browser 2058 adds a presentation-only cinematic for legitimately observed Alien Field Beacon reinforcement batches while preserving Browser 2015 materialization, Browser 1800's now-field-accepted Android PWA release-beacon architecture, Browser 1740 Mobile Tactical Status HUD collapse/expand, Browser 1610 building seams, Browser 1254 horizon treatment, and save format 4.

## Cinematic presentation authority
- Do not create a new reinforcement resolver, transport resolver, visibility model, or camera-visible tactical state.
- `tacticalAlienReinforcementArrival(...)`, `reinforcementLandingVisible`, and ordinary `visibleByHumans(...)` remain authoritative.
- `tacticalThreePersistentObservedBeaconForArrivalCinematic(...)` may return a Beacon only when the active live Alien Field Beacon itself is legitimately visible to AEGIS.
- `tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(...)` may start only for current living alien arrivals already eligible for Browser 2015 materialization and ordinary AEGIS visibility.
- Hidden Beacon or hidden arrivals must create no cinematic, camera movement, transit cue, map focus, or destination disclosure.

## Camera behavior
- Play one short 3D cinematic per authoritative observed reinforcement batch, not once per alien.
- Camera framing must come from the actual visible Beacon world coordinate plus the centroid of the current observed arrival batch.
- Repeated renderer synchronization for the same batch is deduplicated by a bounded seen-set. A genuinely later overflow/new batch with different authoritative arrivals may receive a new shot.
- 3D Iso, FPV, and TPV share the same persistent camera path. Hide FPV weapon geometry while the cinematic owns the shot, then restore the previously active tactical view.
- Yield to boarding, Beacon-destruction, and critical-kill cinematics. Do not fight for the active camera.
- 2D Hex keeps Browser 2015's event/map focus and paired-ring materialization pulse; do not create a second tactical/camera simulation.

## Preserve
The following functions were compared byte-for-byte to Browser 2015 and must remain unchanged unless a future gameplay patch explicitly targets them:
- `tacticalAlienReinforcementArrival(...)`
- `tacticalBuildingPlans(...)`
- `tacticalBuildingCovers(...)`
- `makeBattlefield(...)`
- `resolveMission(...)`
- `tacticalMissionTerminalState(...)`
- `tacticalAiMissionResolution(...)`

Also preserve exactly one `finishAiPlayback()`, campaign/tactical save authority, Browser 2015 transit cleanup/deduplication, Browser 1800 release-beacon navigation v2, and save format 4.

## PWA baseline
Browser 1800's Android PWA architecture is now fully field accepted: ordinary no-update cold starts opened on the first tap, and Browser 1800 -> Browser 2015 updated from one manual installed-app launch with no second launch. Treat `release-beacon-navigation-v2`, the stable `aegis-launch-shell-v2` cache, nonblocking host boot, and no controller-change auto reload as the accepted baseline.

## Field gates
1. In 3D Iso, FPV, and TPV, observe an Alien Field Beacon reinforcement wave while both the Beacon and arrivals are in legitimate AEGIS visual range. One short cinematic should frame the Beacon and arrival group while Browser 2015 materialization plays.
2. Verify FPV weapon presentation is hidden during the shot and the exact prior tactical view returns afterward.
3. Verify multiple aliens in one batch produce one cinematic; a later overflow/new batch may produce another.
4. Repeat with the Beacon or arrival hidden and verify zero camera/location information leak.
5. Confirm Browser 2015 materialization, Browser 1800 PWA update/cold-start behavior, Mobile HUD collapse/expand, Browser 1610 building seams, and save format 4 remain intact.
