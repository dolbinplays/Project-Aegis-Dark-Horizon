PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.11.1652_ADAPTIVE_COHERENT_AI_TURNS_AND_WINDOW_BALLISTICS_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Simulation AI now gives each soldier an individual TU reserve and presents that soldier's movement as one coherent turn: move, reassess once from the new position, optionally continue within the same path, then fire or kneel. Fire-team formation pacing remains authoritative. Building windows now transmit sight and can be shot through; the first passing projectile shatters intact glass and takes an accuracy penalty, while solid wall sections remain opaque.

SIMULATION AI - ADAPTIVE COHERENT TURNS
---------------------------------------
- Each AI-controlled soldier independently selects Snap Shot, Aimed Shot, Burst, Full Auto, or Kneel + Snap according to range, target cover, visible contact count, role, ammunition, and available TU.
- AI movement may use the soldier's full post-reserve TU allowance instead of inheriting the old eight-step planning ceiling.
- Movement is recorded as one continuous playback trail with one internal observation checkpoint and at most one continuation.
- After reaching the checkpoint, the soldier reassesses personal line of sight and can continue toward a newly observed or existing objective before choosing the final action.
- If an alien is visible after movement, the soldier may shoot with the selected reserve. A suitable rear/base-fire soldier with no target may end by kneeling while preserving a snap reserve.
- The continuation is rechecked by fire-team formation pacing. Leaders still wait for supports, supporting soldiers stay within leader cohesion bounds, contact-rush rules remain intact, and movement cannot exceed remaining TU.

TACTICAL BUILDINGS - WINDOWS AND SOLID WALLS
--------------------------------------------
- Procedural buildings retain alternating window sections and solid wall sections.
- Intact and shattered windows transmit line of sight for soldiers, aliens, civilians, visibility maps, and AI targeting.
- Solid wall and partition sections continue to block line of sight.
- A projectile crossing an intact window shatters it before the normal target hit roll and applies an 18-point accuracy penalty to that first round.
- Later rounds and later attacks pass through the shattered opening without the glass penalty.
- Shattered window cells remain hard wall geometry for movement, so the change does not create unintended walk-through routes; structural breaches remain the way to create passable openings.
- Manual fire, Simulation AI fire, alien fire, and reaction fire share the window-shattering rule.

BUILD HEALTH
------------
- Added adaptive-reserve and coherent-turn regression coverage, including the fire-team formation continuation guard.
- Added window-ballistics regression coverage for sight through windows, blocked sight through solid walls, glass shattering, first-shot penalty, and persistent movement blocking.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm the new adaptive AI-turn and building-window contracts report OK.
2. Watch a Simulation AI round and confirm each soldier shows one continuous movement trail followed by one final action, without separate repeated movement phases.
3. Confirm fire-team leaders still wait for supports and that supports do not abandon formation during the checkpoint continuation.
4. Place a soldier and alien across a window and confirm sight is possible, the first shot shatters the glass, and a later shot crosses the broken pane normally.
5. Repeat across a solid wall section and confirm neither sight nor target fire is available.

PREVIOUS BUILD - 1005
=====================
Build: v0.26.08.10.1005_UFO_CRASH_SITE_WRECK_AND_IMPACT_TRAIL_INDEX_ONLY_PATCH

UFO Crash Site tactical maps now show the downed alien craft itself instead of an intact Alien Field Beacon. Each site builds a deterministic impact scene with a visibly tilted, damaged UFO, a churned-earth trail, context-sensitive broken trees or building debris, and smoke from the wreck.

TACTICAL - UFO CRASH SITE WRECKS
--------------------------------
- Removed the Alien Field Beacon from every mission identified as a UFO Crash Site.
- Added a persistent crashed-UFO footprint as hard cover near the surviving alien deployment area.
- The UFO is rendered at a deterministic off-axis yaw and tilt so it reads as a forced landing rather than a parked reinforcement craft.
- Added torn hull panels, a fractured dome, exposed damaged machinery, dead alien lighting, scorch damage, and a bounded smoke plume in the Three.js view.
- Added dedicated crashed-UFO artwork and smoke cues to the 2D tactical view.
- Added a 10-20-cell impact trail that widens irregularly as it approaches the wreck.
- Existing trees, brush, crops, concrete, and buildings crossed by the trail are replaced with fallen trees, stumps, masonry, beams, or other debris as appropriate; open ground becomes churned earth.
- Alien and civilian deployment is recalculated around the completed crash scene, preventing units from spawning inside the UFO's hard-cover footprint.
- Ordinary Alien Field Beacon and reinforcement-dropship behavior remains unchanged on non-crash missions.

BUILD HEALTH
------------
- Added a regression contract proving that crash sites contain no active beacon, include the angled UFO craft and complete wreck footprint, generate a substantial impact trail, keep units out of hard cover, and retain both 2D and Three.js rendering support.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm "UFO crash sites replace the field beacon with an angled smoking wreck and impact trail" reports OK.
2. Deploy to forest/farmland and urban UFO Crash Sites and confirm the trail selects broken vegetation or building debris appropriately.
3. Inspect the wreck in both 2D Hex and Three.js views and confirm the unusual angle, hull damage, impact scar, and smoke remain visible.
4. Confirm ordinary incident missions can still use Alien Field Beacons and reinforcement dropships.

PREVIOUS BUILD - 2055
=====================
Build: v0.26.08.07.2055_INCIDENT_MAP_LIMIT_SELF_TEST_STARTUP_TDZ_FIX_INDEX_ONLY_PATCH

Startup-crash hotfix for browser build 1850. The Incident Map Limit feature itself was valid, but its new Build Health contract referenced a local React component before that `const` binding had initialized, preventing the start screen from loading.

STARTUP - INCIDENT MAP LIMIT SELF-TEST TDZ FIX
---------------------------------------------
- Fixed: `ReferenceError: IncidentMapLimitPanel is not defined` during `runSelfTests()`.
- Root cause: `String(IncidentMapLimitPanel)` executed while `AlienResponseCommand` was still initializing, before the local `const IncidentMapLimitPanel = ...` declaration had executed.
- Removed the unsafe forward reference.
- The regression still verifies 5-20 clamping and routine incident limiting directly.
- UI coverage now comes from `String(AlienResponseCommand)`, which safely contains the local settings-panel source without evaluating the uninitialized binding.
- All 1850 gameplay features remain active: VIP rescue fire-team distribution, Simulation AI grenade use, staged Alien Field Beacon knowledge and database unlock, confirmed-beacon targeting, row-major Barracks reading order, and the saved 5-20 Incident Map Limit.

POST-REVIEW CODE CLEANUP
------------------------
- Routine-incident cap accounting now excludes critical crash sites and other protected operations, so those missions can push the board above the routine limit without consuming routine slots.
- Candidate routine incidents are de-duplicated against both the active board and the rest of the same generated batch.
- The Incident Map Limit slider now receives a real `aria-label` instead of leaking the invalid React-only `ariaLabel` prop to the DOM.
- VIP rescue coordination now falls back to the established nearest-VIP behavior when a legacy or test tactical state has no assignable fire-team leaders, instead of enabling coordination with an empty assignment board.
- The structural-damage Build Health check now inspects the base cover renderer where the crack, shattered-window, and smoke code lives, while also verifying that the alien-technology wrapper delegates to that renderer. This removes a false failure without weakening coverage.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Zero `String(IncidentMapLimitPanel)` references remain.
- Start-screen version derives as v0.26.08.07.2055 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open `index.html` locally and confirm the start screen appears without a runtime error.
2. Open Command Settings and confirm Incident Map Limit remains selectable from 5 through 20.
3. Open Barracks and confirm soldiers still fill left-to-right, then down.
4. Load an existing save and confirm the Incident Map Limit defaults/persists correctly.
5. Run Build Health and confirm the Barracks/Incident Map Limit contract no longer crashes startup.

PREVIOUS CURRENT FEATURE BUILD - 1850
=====================================
Build: v0.26.08.07.1850_VIP_RESCUE_COORDINATION_GRENADE_AI_BEACON_INTEL_BARRACKS_ROW_ORDER_AND_INCIDENT_LIMIT_INDEX_ONLY_PATCH

1850 introduced coordinated VIP-rescue fire-team assignments, selective Simulation AI Frag Grenades, staged Alien Field Beacon knowledge with a persistent Mainframe database unlock after observed reinforcement materialization, confirmed-beacon tactical targeting, row-major Barracks reading order, and a saved configurable 5-20 routine Incident Map Limit. These features remain active in 2055.

INTERMEDIATE FEATURE BUILD - 1630
=================================
Build: v0.26.08.07.1630_TACTICAL_DAMAGE_STATE_SMOKE_BREACH_FEEDBACK_AND_UNLIMITED_DOWNTIME_CAPACITY_INDEX_ONLY_PATCH

1630 added shared structural-damage presentation for the 2D and Three.js tactical views: cracked damaged walls, stronger critical-state damage, shattered windows, and bounded dust/smoke cues for damaged structures and breaches. It also temporarily removed Training Center, Rec Room, and per-activity attendance caps while preserving the requirement to own the matching facility.

PREVIOUS FEATURE BUILD - 1415
=============================
Build: v0.26.08.07.1415_TACTICAL_ALIEN_BEACON_FANOUT_SEARCH_AND_LONE_SURVIVOR_EXFIL_FIX_INDEX_ONLY_PATCH

1415 stopped groups of original aliens from camping around the Alien Field Beacon. Groups with no contact now fan out through deterministic battlefield search outside the immediate beacon perimeter, while a lone original survivor can still fall back to the beacon or insertion point and attempt the existing emergency reinforcement call.

OLDER PATCH HISTORY
===================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1145_INTERCEPTOR_SWARM_TARGET_SNAPSHOT_NULL_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This is a targeted stability patch for the 1015 All Bases interceptor swarm. It fixes the player-reported `Cannot read properties of null (reading 'id')` crash that could occur while a swarm and Skyranger incident response were progressing at the same time.

STRATEGIC AIR COMBAT - SWARM SHOOTDOWN TARGET SNAPSHOT FIX
-----------------------------------------------------------
- Confirmed stack frame: `index.html:5605:152`, inside `Array.some` during the successful staggered-swarm shootdown path.
- Root cause: the queued `setMissions(...)` functional updater referenced the mutable local variable `target.id`.
- The same swarm effect subsequently assigned `target = null` so later inbound aircraft would abort.
- React executed the queued updater after that mutation, causing the null-ID exception.
- Build 1145 snapshots both the defeated UFO object and `defeatedTargetId` before queuing mission-state work.
- Crash-site de-duplication now runs through `appendCrashMissionOnceForTarget(...)` and never depends on the later mutable target variable.
- The helper tolerates null/legacy mission entries while checking `sourceCraftId`.
- Contact removal and shootdown reporting use the same immutable defeated-target snapshot.

PRESERVED 1015 BEHAVIOR
------------------------
- All Bases still launches every Ready interceptor with a legal direct/ferry-network route from all bases.
- Sorties retain independent staggered attack ETAs and combat passes.
- A confirmed shootdown still aborts every not-yet-engaged inbound interceptor from its current route position.
- Aborted aircraft still route home through normal ferry/refuel logic and retain permanent home-base/home-hangar ownership.
- Simultaneous Skyranger travel remains allowed and is not cancelled by interceptor combat.
- Alien Field Beacon, dynamic friendly re-pathing, strict fire-team cohesion, living-soldier hex separation, and escort-support response from 1015 are unchanged.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct target-snapshot regression: true.
- Static test scan: 351 `*Test` references / 350 declarations; the only unmatched token is the existing Three.js `depthTest` material property.
- The old mutable closure `mission.sourceCraftId===target.id` is absent from the swarm resolution block.
- Build Health includes `Interceptor swarm shootdown snapshots target identity before queued mission state updates`.
- Start-screen version derives as v0.26.08.07.1145 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Launch All Bases against a detected UFO.
2. Launch Skyrangers to an incident before the interceptor swarm finishes.
3. Advance Geoscape time until the swarm scores a confirmed shootdown.
4. Verify one crash site is added and no runtime error appears.
5. Verify remaining inbound interceptors abort and return home normally.
6. Verify the Skyranger mission continues independently through arrival and tactical ownership.
7. Save/reload during overlapping travel and repeat the completion path.


PREVIOUS BUILD NOTES - 1015
===========================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1015_GLOBAL_INTERCEPTOR_SWARM_AND_TACTICAL_COHESION_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update combines the current tactical follow-up fixes with a new global multi-base interceptor swarm response.

TACTICAL - CURRENT INCIDENTS USE THE ALIEN FIELD BEACON
--------------------------------------------------------
- Fixed the effective multi-Skyranger deployment override, which could bypass the newer Alien Field Beacon deployment code and make fresh incidents use the legacy purple saucer reinforcement path.
- Current-build one- and two-Skyranger tactical deployments now create exactly one Alien Field Beacon.
- The six immediately adjacent hexes around the beacon are reserved clear of procedural cover so the beacon always has its intended materialization ring.
- Starting aliens preferentially use that ring; beacon reinforcements continue to materialize in those six adjacent cells.
- Purple saucers remain supported only as a compatibility path for genuine legacy tactical snapshots with no beacon state.

TACTICAL - DYNAMIC FRIENDLY RE-PATHING
--------------------------------------
- AI movement remains deterministic simulation-side; gameplay pathfinding was not moved into the visual animation layer.
- When a soldier's direct route is blocked mainly by a friendly soldier who has not acted yet, the mover can defer and re-path after friendly traffic changes.
- Even a one-step avoidable detour can now trigger the defer/re-path rule.
- Static terrain, cover, enemies, map edges, TU costs, reaction fire, and visibility remain authoritative.
- The movement-trail playback system continues to animate the route the AI actually used.

TACTICAL - STRICT FIRE-TEAM ASSEMBLY PACING
-------------------------------------------
- Fire-team leaders remain at half movement until supporting soldiers actually occupy their formation positions.
- This is enforced at mission deployment and when a team reforms after combat.
- Once formed, leaders pace to the slowest active team member.
- Only a genuine rush toward a currently visible living alien overrides AI formation pacing.
- Player-controlled soldiers remain exempt from AI formation speed rules.

TACTICAL - NO TWO LIVING SOLDIERS END ON THE SAME HEX
------------------------------------------------------
- Living soldier destinations are treated as occupied during completed movement/action states.
- Deferred re-pathing rechecks the current occupancy map before movement resolves.
- Tactical-state repair deterministically separates any legacy/edge-case overlap to a nearest valid cell.

TACTICAL - ESCORT SUPPORT RESPONSE
----------------------------------
When an alien is spotted while one or more fire-team leaders are escorting civilians/VIPs, the player receives an escort-support decision:

1. Stay With Escort
   - supports remain with their leader and protect the rescue column.

2. Break Off To Support
   - supports temporarily leave the escort formation and use normal combat AI to reinforce the visible alien contact.
   - the escort leader keeps moving the civilians/VIPs toward extraction.
   - after the active visible/engaged alien contact is gone, detached supports automatically return to their original fire-team leader and resume formation.

STRATEGIC AIR COMBAT - ALL BASES INTERCEPTOR SWARM
---------------------------------------------------
- Detected flying UFOs now have an `All Bases (N)` launch option.
- It selects every Ready interceptor with a legal direct or ferry-network route, across every base.
- Staging hangars are reserved independently so multiple aircraft cannot claim the same transient hangar slot.
- Every aircraft gets its own route phases, impact ETA, return path, and home-base/home-hangar identity.
- Attack passes occur as each interceptor reaches the UFO; they are intentionally staggered when travel times differ.
- Earlier passes can damage the UFO before later passes arrive.
- If one aircraft destroys the UFO, every interceptor still inbound aborts pursuit from its current route position and begins a clock-driven return.
- Aborted aircraft use the normal ferry/refuel network to get back to their permanent home bases rather than teleporting or remaining at a staging base.
- Aircraft that already fought retain normal damage/repair outcomes; aircraft that aborted before combat do not receive fictitious combat damage.
- All swarm aircraft eventually recover at their permanent home bases/hangars.
- The strategic aircraft route display shows each swarm member and its current phase/remaining ETA.

The All Bases command does not launch an aircraft that is Repairing, otherwise unavailable, or has no legal route under normal range/fuel/ferry/hangar rules. If every stationed interceptor is Ready and routable, all of them launch.

PRESERVED FIXES
---------------
- Observed reinforcement arrivals visibly stage their troops before AI movement.
- AI movement trails animate long/multi-stage routes instead of snapping units to destination cells.
- Alien Field Beacon boot null guards.
- Beacon destruction cancels/prevents reinforcement transit.
- Tactical startup main-thread optimization.
- Fire-team Command Map and persistent pause/multi-order controls.
- Manual tactical movement and manual civilian/VIP escort override AI formation restrictions.
- VIP sequential reinforcement and terminal rescue behavior.
- Tactical AI false-total-loss prevention.
- Atomic multi-Skyranger launch and staged per-leg fuel correction.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct Node contract results:
  beacon=true
  traffic=true
  cohesion=true
  occupancy=true
  escort=true
  baseBeacon=true
  movementTrail=true
  swarm=true
- Static Build Health scan: 350 *Test references / 349 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing regression test.
- Current two-Skyranger deployment contract confirms the beacon path.
- Beacon foundation contract confirms the six-cell adjacent deployment ring and beacon reinforcement deployment.
- Interceptor swarm contract confirms options spanning multiple bases, independent elapsed travel, staging-hangar reservation, and a target-destroyed return route aimed at the permanent home base.
- Start-screen version derives as v0.26.08.07.1015 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
A complete live Chromium tactical/geoscape smoke test remains the final validation gate because the container browser sandbox/zygote process is unreliable. Recommended manual checks:

1. Start a fresh two-Skyranger tactical incident and confirm a Field Beacon, not a purple saucer, is present.
2. Watch an AI fire team form at deployment and after combat; the leader should remain at half pace until supports are actually formed up.
3. Put friendly soldiers in each other's likely travel lanes and confirm later movers re-path more directly after the lane clears.
4. Confirm no two living soldiers finish a round on the same hex.
5. Escort a VIP/civilian with a fire-team leader, spot an alien, test both escort-support choices, and confirm detached supports return afterward.
6. Station Ready interceptors at several bases, select `All Bases`, verify staggered arrivals, destroy the UFO before every interceptor arrives, and follow the remaining aircraft home through normal ferry routing.
