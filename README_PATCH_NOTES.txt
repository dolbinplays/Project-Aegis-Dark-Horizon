Alien Response Command / Project Aegis
Patch: v0.26.08.03.2032_TACTICAL_VIP_HUNT_PANIC_AND_REINFORCEMENT_SEARCH_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Make aliens on mandatory VIP/rescue maps actively hunt VIPs without giving them access to AEGIS tracker pings or hidden VIP coordinates.
- Make civilians and VIPs panic and run when they see aliens or are fired upon.
- Make alien reinforcements emerge through the purple saucer's rear ramp, rally at the caller's or missing commander's last-known position, and then search the area in formation.
- Keep the purple landing craft under normal tactical fog-of-war rules.
- Preserve TU, reaction fire, pathfinding, cover, map-edge, playback, and save-format contracts.

Implemented:
- Added hidden-information-safe alien target priority: visible VIP, visible soldier, then visible civilian opportunity target.
- Added deterministic building/sector searches for VIP missions when no alien has real line of sight to a target.
- Aliens do not use `vipTracker` coordinates as navigation targets; the tracker remains player-only.
- Added alien last-known target memory only after legitimate line-of-sight contact.
- Added automatic civilian/VIP panic on visible alien contact and on incoming alien fire, including misses.
- Panic clears escort ownership and reuses the existing bounded threat-avoidance run behavior.
- Commander calls record the caller's position; missed check-ins record the dead commander's position.
- Reinforcements spawn on rear-ramp cells where practical and carry rally/search formation state.
- Reinforcements move to the rally area first, then search buildings and map sectors in formation for VIPs or soldiers.
- Visible civilians can be attacked as targets of opportunity when no higher-priority visible target is available.
- Purple saucer hull and ramp covers now start unrevealed. The 3D craft is only built when its footprint is in the player's visible set.
- Updated manual End Turn and AI-command/simulation alien phases.
- Added AI playback/reclaim continuity for alien objective, rally, last-known, and search state.
- Added Build Health row: `Alien VIP hunts, civilian panic, fogged saucers, and reinforcement rally searches preserve hidden information`.

Validation performed:
- All embedded JavaScript passed `node --check`.
- Isolated Chromium start-screen and fresh-campaign Geoscape smoke passed with no JavaScript page exceptions.
- The new direct tactical contract returned true.
- Target test: visible VIP outranked visible soldier.
- Hidden-information test: an unrevealed tracked VIP generated a sector-search order instead of direct pursuit.
- Panic test: a civilian seeing an alien entered panic and lost escort ownership.
- Build Health showed the new row as OK. The isolated no-assets harness reported 324/328 because four existing audio/Three.js/Skyranger checks require the normal relative asset environment.

Manual test gate:
- Confirm aliens do not path toward player-visible VIP pings through fog.
- Confirm visible VIPs are targeted before soldiers when legal shots exist.
- Confirm civilians panic on sight and on hit or missed alien fire.
- Confirm reinforcements visibly emerge from the rear ramp and rally to the correct caller/dead-commander location.
- Confirm the reinforcement group transitions into a formation search and fires on visible civilians as opportunity targets.
- Confirm the purple saucer remains invisible until its footprint is observed in both 2D Hex and Three.js Iso.
- Confirm the behavior under manual End Turn, AI Command, and Take Back Control.

Native parity status:
- Not implemented in this file set because the Godot project was not supplied.
- Codex should port this exact hidden-information and reinforcement-doctrine contract before implementing unlimited VIP reinforcement waves and terminal rescue state.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.03.0156_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_PARITY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

Purpose:
- Distinguish mission-wide alien reports from each soldier's personal tactical sight.
- Send every non-escort without personal sight along the shortest practical bounded route toward the nearest reported or last-known alien position.
- Suspend commander-formation, cover, and flank scoring during the direct response so a distant second squad does not hesitate or drift.
- Stop direct convergence as soon as the responding soldier personally sees an alien, then use remaining TU for the existing cover, formation, line-of-sight, range, and firing logic.
- Preserve civilian and VIP escort duty, shot-mode TU reserves, fog of war, reaction fire, bounded pathfinding, and save format 4.

Validation performed:
- Godot 4.7.1 strict project parsing passed.
- Native tests passed 147/147, including report-versus-personal-sight separation, full bounded direct advance, and early transition on personal contact.
- Native Build Health passed 104/104 inside the automated suite.
- All six browser app scripts parsed and the build seam checker passed.
- Localhost start screen and Geoscape loading passed; Browser Build Health passed 327/327.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles with all soldiers alive.
- Tactical-map AI command produced a 33-frame continuation from round 4, and Take Back Control restored the same human-phase battle.
- Browser console contained no runtime errors.

Manual gate:
- Send two squads to a Large incident with wide separation and hand control to AI.
- Let Squad A spot and fire on aliens while Squad B has no personal sight. Confirm every Squad B soldier without an escort heads directly toward the reported contact rather than holding formation near its commander or detouring for cover.
- Confirm Squad B soldiers stop the direct approach when they personally see an alien, then seek cover, establish weapon range and line of sight, and engage while preserving their selected shot reserve.
- Confirm any Squad B soldier already escorting civilians or VIPs continues toward extraction instead of joining the response.
- Break visual contact and confirm responders continue toward the last-known position, then search locally when they arrive.

