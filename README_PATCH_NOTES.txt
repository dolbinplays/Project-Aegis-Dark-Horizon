PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.12.1305_ESCORT_CONTACT_AND_EXTRACTION_TRAFFIC_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
VIPs and civilians who remain both separated from and unable to see their escort for one complete round now return to an unescorted, reassignable state. The original fire team is recalled when possible. At Skyranger extraction, supporting soldiers form defensive positions outside the ramp cells, and the escort leader clears the corridor after the final assigned civilian extracts.

ESCORT CONTACT AND REASSIGNMENT
--------------------------------
- Normal four-person escort-column spacing remains valid and does not start the lost-contact timer.
- Separation alone does not release a follower if the VIP and escort retain an unobstructed line of sight.
- Blocked sight alone does not release a follower while the escort remains within normal contact distance.
- The first completed round of both separation and lost sight starts a regroup warning; a second completed round in that same condition releases the follower, ensuring a full round elapsed.
- Regaining distance or sight during the grace round clears the warning without changing the escort assignment.
- A released civilian is revealed, calm, and free of exclusive escort claims so another fire-team leader can immediately make contact.
- The original living fire team is switched back to stay-together escort support, and its leader receives a return target. If another team reaches the civilian first, the stale recall clears.
- The rule runs at round boundaries in direct-control, reinforcement-wait, post-combat rescue, and simulation-AI battles. Its state is retained across streamed tactical snapshots.

EXTRACTION-ZONE TRAFFIC
-----------------------
- When an escort leader enters the selected Skyranger extraction corridor, living fire-team supports receive defensive guard cells outside every ramp and hull footprint.
- Guard positions prefer nearby cover and remain subject to TU, occupancy, formation-order, and passability checks.
- Supporting soldiers are explicitly prevented from choosing extraction cells while the guard assignment is active, leaving ramp capacity for VIPs and civilians.
- The leader holds the corridor while the assigned civilian column advances, preserving the existing single-file escort behavior.
- When the last assigned follower reaches an extraction cell and leaves the map, the leader immediately moves to a clear cell outside the extraction footprint and releases the temporary guard assignment.
- These overrides apply only to active escorted extraction; normal patrol, combat, building entry, manual movement, and fire-team formation behavior are unchanged.

BUILD HEALTH
------------
- Added a deterministic two-round blocked-sight scenario that verifies the grace round, release, original-team recall, support return, another-team reassignment, and contact recovery reset.
- Added a Skyranger traffic scenario that verifies supports remain outside extraction cells, the VIP extracts, and the leader clears the ramp afterward.

PREVIOUS BUILD - 0915
=====================
Build: v0.26.08.12.0915_VIP_EXTRACTION_NO_BUILDING_REENTRY_INDEX_ONLY_PATCH

AI-controlled VIP rescue teams now commit to outdoor extraction routes after leaving a building. Escorts route around cleared structures instead of treating their interiors as shortcuts, and each VIP or supporting fire-team soldier that reaches outdoor ground is prevented from stepping back inside while following formation.

VIP EXTRACTION - NO BUILDING RE-ENTRY
-------------------------------------
- Added an extraction-specific route search that treats every building as closed terrain once an escort is outdoors.
- Escorts already inside still use the established door-or-breach egress route, then switch to the outdoor-only route for the remaining journey to the Skyranger.
- Outdoor routing plans all the way to the selected ramp corridor before committing the current TU-bounded movement segment, avoiding local distance choices that can produce doorway loops.
- If a temporary obstacle blocks the complete route, the escort can still make bounded outdoor progress toward extraction and retry from its new position next round.
- Escorted VIPs independently inherit the same rule: once an individual VIP reaches outdoor ground during extraction, its formation choices exclude building cells.
- Fire-team supports retain normal formation targets, pace limits, TU costs, occupancy rules, and break-off behavior; only indoor candidate cells are removed after that support has exited.
- Units that have not yet cleared the structure can continue moving inside and through a valid door or breach, preventing the new rule from trapping the rear of a civilian column.
- When the leader reaches the far end of the ramp first, it now holds the extraction corridor and spends its remaining bounded movement allowance advancing trailing VIPs instead of leaving the rear of the column stranded.

BUILD HEALTH
------------
- Added a cross-building regression scenario with extraction on the far side of a structure. The contract requires a complete route whose committed segment contains no building cells.
- Extended the contract to verify the extraction-only follower guard is active while the normal formation system remains the movement authority.

PREVIOUS BUILD - 0858
=====================
Build: v0.26.08.12.0858_ENHANCED_SFX_PER_SOUND_DOUBLE_BOOST_INDEX_ONLY_PATCH

SUMMARY
-------
Every sound in the Save / Load Enhanced SFX Library now has its own persistent Boost ×2 button. Boost doubles only the selected effect after its individual slider and before the master SFX volume, so quiet sounds can be raised without changing the rest of the mix.

PER-SOUND DOUBLE BOOST
----------------------
- Added a Boost ×2 toggle beside Play on all 17 Enhanced SFX Library rows.
- An active boost is clearly highlighted and reads Boost ×2 On; the row readout also shows its slider percentage followed by ×2.
- Boost multiplies the sound's individual slider by two before the master SFX bus. For example, 60% with Boost ×2 produces a 120% per-sound gain that still follows the master SFX volume.
- Boost state persists locally for each sound under a separate versioned preference key. Existing saved slider levels migrate without changes and every boost defaults off.
- Reset Mix returns all sliders to 100% and switches every boost off.
- Original SFX bypasses both enhanced levels and enhanced boosts. Switching back to Enhanced Tactical SFX restores the player's saved mix.
- Boost is audio presentation only and cannot affect combat, TU, AI decisions, escort routing, or fire-team formation movement.

BUILD HEALTH
------------
- Extended the 17-entry audio-library contract to verify boost normalization, default-off behavior, the exact ×2 gain calculation, unique per-row boost controls, local persistence, and reset behavior.

PREVIOUS BUILD - 0825
=====================
Build: v0.26.08.12.0825_ENHANCED_SFX_LIBRARY_AND_PER_SOUND_MIX_INDEX_ONLY_PATCH

Save / Load Game now has a dedicated Enhanced SFX Library. Players can audition all 17 enhanced effects, tune each one independently, adjust the existing master SFX volume from the same screen, and keep the mix as a local audio preference without changing campaign saves.

ENHANCED SFX LIBRARY
--------------------
- Added an Enhanced SFX Library button to the Save / Load Game header and a full library screen with a clear return control.
- The library exposes every enhanced sound currently routed in the browser build: four role-specific footsteps; ballistic, laser, AEGIS plasma, and alien weapon reports; miss/flyby, hit/injury, armor, glass, death, and fall feedback; plus Skyranger flyby, takeoff, and landing.
- Every sound has its own Play button and 0-100 percent level control. Library previews always use the enhanced version so it can be compared even when Original SFX is currently selected.
- Individual levels multiply the existing master SFX volume. The library also exposes that master control and provides Reset All to 100%.
- Per-sound levels persist in local audio preferences under their own versioned setting and do not enter campaign save data.
- Original SFX bypasses the enhanced per-sound mix. A one-click Use Enhanced SFX control is shown when the original profile is active.
- Added an audible glass-shatter route to window-crossing shots in manual and simulated tactical playback, using the same presentation-only callback layer as existing weapon and impact sounds.

GAMEPLAY SAFETY
---------------
- The mixer only scales audio destinations. It does not write movement, combat, TU, AI, escort, or formation state.
- Fire-team formation movement and the coherent single-turn AI rules remain unchanged.

BUILD HEALTH
------------
- Added a 17-entry catalog contract covering unique routing keys, bounded level normalization, persistent local storage, the Save / Load entry button, screen controls, preview routing, master-volume multiplication, and glass feedback.

PREVIOUS BUILD - 0024
=====================
Build: v0.26.08.12.0024_TACTICAL_MISSION_VISIBILITY_MUSIC_CROSSFADE_INDEX_ONLY_PATCH

The Dark Horizon alternate mission track is now visibility-reactive. Contact in the Dark loops its 0:00-0:36 search section while no living alien is in current soldier line of sight, loops its 0:37-1:00 combat section while any alien is visible, and crossfades between those two sections as contact changes.

MISSION MUSIC VISIBILITY CROSSFADES
-----------------------------------
- Current line of sight, rather than permanent revealed/last-known-contact memory, drives the music state. Losing sight behind a wall or other cover returns the score to search even though soldiers remember the contact.
- Search uses 0:00 up to the 0:36 boundary. Visible engagement uses 0:37 up to the 1:00 boundary. Each segment seeks back to its own start before playback can drift into the other section.
- Visibility changes start a 1.4-second two-player crossfade: the old segment fades down while a second synchronized media player starts and fades up at the new segment boundary.
- A rapid second visibility change cancels and cleans up the stale outgoing player before starting the newest transition, preventing stacked playback.
- The behavior applies specifically to Dark Horizon Alternate's Contact in the Dark mission cue. Original Soundtrack mission playback and all non-mission tracks retain their established looping and fallback behavior.
- This is presentation-only: visibility rules are read without changing unit reveal memory, AI decisions, fire-team formation movement, TU, combat, or save format.

BUILD HEALTH
------------
- Added required seams for the 0:00/0:36 and 0:37/1:00 segment contract, live LOS visibility signal, crossfade duration, outgoing-player cleanup, and alternate-mission routing.

PREVIOUS BUILD - 2200
=====================
Build: v0.26.08.11.2200_ALTERNATE_SOUNDTRACK_AND_TACTICAL_AUDIO_DIRECTION_INDEX_ONLY_PATCH

The browser build added a selectable Dark Horizon alternate soundtrack, a selectable enhanced tactical-SFX profile, role-specific movement footfalls, and event-driven tactical radio direction. Routine movement acknowledgements are rare; soldiers announce meaningful transitions such as engaging alien contact, resuming a VIP/contact search, and securing the area. Fire-team formation movement is unchanged.

ALTERNATE SOUNDTRACK
--------------------
- Added 15 original ElevenLabs-generated score cues alongside the existing score, giving every existing music context its own one-to-one alternate.
- Audio Settings now lets players switch between Original Soundtrack and Dark Horizon Alternate without changing their campaign save.
- The alternate bank independently scores Start, Command Menu, Geoscape, Base, Inventory, Database, Soldiers, Research, Workshop, Squads, Sickbay, Missions, Reports, Memorial, and Pause.
- If an alternate file cannot load, playback safely falls back through the original file bank and existing synthesized theme.

TACTICAL AUDIO DIRECTION
------------------------
- Human, alien, civilian, and tracked-VIP movement now produces distinct footfall textures on the same animation steps that already drive movement.
- Simulation AI radio dialogue prioritizes tactical state changes: alien engagement begins, contact ends and VIP search resumes, contact search resumes, or the area becomes secure.
- The VIP transition is authored as “Resuming search for the VIP” and uses the recorded Keep Moving performance until a dedicated recording is added.
- Generic Moving/Advancing acknowledgements remain as an occasional manual-order response and a deterministic one-in-seven AI-movement accent, with longer cooldowns.
- Existing hit, kill, last-contact, weapon, armor-impact, pain, death, glass, and environmental sounds remain active.
- Audio Settings includes Enhanced Tactical SFX and Original SFX choices; the preference persists locally and does not alter save format 4.

ELEVENLABS SOURCE LIBRARY
-------------------------
- Generated a 16-category sound-effects library in the project's signed-in ElevenLabs account: role-specific footsteps; ballistic, laser, and alien plasma weapons; soldier, alien, and civilian injury/death reactions; glass; dirt/concrete impacts; and armor impacts.
- The integrated enhanced profile establishes the routing and event timing for those categories while generated takes can be auditioned and substituted without changing combat or formation logic.

BUILD HEALTH
------------
- Added checks for alternate-track routing, persisted soundtrack/SFX selection, state-change radio callouts, bounded generic movement acknowledgements, and footfalls on movement animation steps.
- Fire-team paths, TU use, escort following, cohesion limits, and formation pacing are untouched by the audio hooks.

PREVIOUS BUILD - 1652
=====================
Build: v0.26.08.11.1652_ADAPTIVE_COHERENT_AI_TURNS_AND_WINDOW_BALLISTICS_INDEX_ONLY_PATCH

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
