PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1650_ALL_TACTICAL_VICTORY_DANCE_RESTORE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restored the soldier victory celebration across successful tactical mission outcomes. The persistent Three.js renderer was starting its victory animation loop but not invalidating the actor layer when the victory flag changed, so existing soldier nodes never received the dance state. 2D and playback celebrations remain active, and the shared success rule is now future-safe for victory objectives that may not require every alien to be dead.

ALL-SUCCESS VICTORY CELEBRATION
-------------------------------
- Every surviving AEGIS soldier celebrates while a successfully completed tactical battlefield remains open for review.
- Direct-control, Hybrid AI, full Simulation AI, Classic Lineup, 2D Hex, tactical-map playback, and Three.js Iso all retain their existing presentation paths but share the same successful-outcome doctrine.
- KIA soldiers remain fallen and do not animate. Mission failures, withdrawals, objective failures, incomplete operations, and unresolved AI handoffs do not trigger celebration.
- Playback victory detection now keys off the authoritative `Mission success` terminal frame instead of additionally requiring `alienAlive === 0`. This preserves celebrations for future objective-driven victories that can legitimately end with hostiles still present.

PERSISTENT THREE.JS REGRESSION FIX
----------------------------------
- Root cause: Browser 1342 made the Three.js scene persistent and separated actor updates from animation state. `victoryDance` correctly restarted the animation loop, but the actor invalidation key only tracked unit state. When victory arrived without a unit-state change, `tacticalThreePersistentUpdateUnits(...)` did not run and every existing soldier node kept `victoryDance=false`.
- The persistent actor key now includes the victory-dance state. A victory transition updates the existing nodes in place, marks only living human soldiers to celebrate, and retains the same renderer, scene, terrain, cover, fog, and actor objects.
- Returning from celebration or disposing the battlefield still restores normal standing/fallen poses through the existing explicit living-state logic from Browser 1645.

BUILD HEALTH
------------
- Strengthened the all-battle-views victory contract to verify direct 2D/3D wiring, Simulation/Classic playback, living-vs-fallen behavior, failure exclusion, and persistent actor invalidation when only the victory flag changes.
- Added a future-facing success fixture whose terminal frame is `Mission success` even with a nonzero alien count; surviving soldiers still celebrate because success, not elimination count, is authoritative.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1645
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1645_THREEJS_LIVING_UNIT_POSE_HOTFIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected an intermittent persistent-3D pose bug that could make every soldier, civilian, and alien begin a mission lying prone despite being alive. The 1615 2D cell-index optimization remains active.

LIVING UNIT POSE HOTFIX
-----------------------
- VIP tracker animation exposed the bug because it keeps the persistent renderer animation loop active.
- The loop previously searched a composite visual signature for `:0:` as a shorthand for death. Ordinary living-unit fields such as not panicked also contain that token.
- Every 3D unit node now stores an explicit living-state property. Animation and animation shutdown use only that property to choose standing or fallen rotation.
- Fallen units remain prone, while living soldiers, civilians, and aliens remain upright during tracker pulses and other continuous animations.

2D CELL RENDER INDEXES
----------------------
- Living/visible-state unit occupancy is indexed once per unit-state update while preserving fallen-human and resolved-battle display rules.
- Active cover is indexed once per cover update; destroyed cover is excluded exactly as before.
- Ground-level equipment is grouped by cell once per inventory change rather than filtered for every rendered hex.
- The current movement path is indexed by cell and retains the first step number when a path revisits a hex.
- Each rendered cell constructs its coordinate key once and reuses it for visibility, exploration, tracker, beacon-shield, item, movement, and React-key lookups.
- The optimization changes presentation lookup cost only; tactical movement, formation following, fog, line of sight, targeting, and mission resolution are unchanged.

VISIBILITY AND TERRAIN CACHES
-----------------------------
- Procedural 2D terrain cells are generated once per mission/cell and reused during later renders.
- Sight-blocking cover is indexed once per cover-state signature, including wall, window, breach, HP, blocking, and shattered-window state.
- Each living human observer has a bounded visibility entry keyed by mission, grid size, position, facing, and current cover signature.
- Alien or civilian movement reuses every soldier visibility entry. Moving one soldier misses only that observer entry while the remaining fire team stays cached.
- Bounded mission, context, and observer cache sizes prevent long campaigns from growing memory without limit.

AI-CONTROLLED FOG-OF-WAR FIX
----------------------------
- The supplied Sunken Relay save exposed a presentation mismatch: full-AI playback suppressed every 3D ground-fog instance even though unit and cover discovery still followed soldier vision.
- `aiMapPlayback` no longer reveals the complete ground. Unseen cells use the strong fog batch, explored cells use the lighter batch, and visible cells remain clear in manual, Hybrid AI, and full-AI control.
- Only a resolved tactical battle may reveal the complete ground for the final battlefield view.

PERSISTENT THREE.JS TACTICAL RUNTIME
------------------------------------
- Entering a 3D tactical mission creates one renderer and scene runtime. It is disposed when the mission view ends, the mission changes, or the player changes the 3D quality setting.
- The complete tactical grid is built once with instanced ground and seam geometry. Changing the viewed area, selecting a soldier, or following an action moves the camera without reconstructing terrain.
- Fog uses two reusable instanced batches for unseen and explored cells. Visibility changes update their matrices and counts rather than creating thousands of new meshes.
- Static cover and Skyranger geometry live in their own scene layer and rebuild only when their source state changes. Cover changes also invalidate visibility so a newly opened breach cannot leave stale fog behind.
- Human, alien, and civilian models are indexed by unit ID. Movement mutates each existing node's position, and facing rotates only the weapon/direction pieces. Visual-signature changes such as death, equipment, panic, or escort status replace only that unit node.
- Selection rings, VIP trackers, movement/shot effects, camera framing, and animation state each have bounded update paths instead of sharing a single full-scene rebuild effect.

VALIDATION
----------
- Added a regression contract proving that a living unit whose signature contains unrelated zero-valued fields remains upright while a fallen unit remains prone.
- Added a deterministic contract covering living and fallen unit rules, destroyed cover exclusion, floor-level item grouping, and repeated movement-path cells.
- The 2D render-source check requires all four memoized indexes to be wired into the visible-cell loop.
- Added a focused cache contract proving that unrelated alien movement reuses every soldier sight result, while moving one soldier recalculates only that observer.
- The contract also verifies deterministic terrain reuse, shared cover-context reuse, and bounded cache behavior. JavaScript syntax and the static release checker pass for build 1445.
- Added Build Health contracts for persistent scene ownership, cached terrain, stable unit nodes, cleanup, and layer-specific invalidation.
- Static JavaScript syntax validation passes.
- Live browser validation launched a 64 x 64 tactical mission, switched into 3D Iso, selected another soldier, and completed a turn update while retaining the same renderer identity (`tactical-three-1`) with exactly one live 3D root and no runtime-error overlay.
- The full diagnostic suite remains at the prior build's established baseline; the new persistence-specific check passes.
- Save format remains 4. Existing campaigns and cached tactical battle state require no migration.

PREVIOUS BUILD - 1615
=====================

Build: v0.26.08.15.1615_TACTICAL_2D_CELL_RENDER_INDEX_PATCH
Save format: 4 (unchanged)

Added memoized 2D cell indexes for units, cover, floor equipment, and movement paths.

PREVIOUS BUILD - 1445
=====================

Build: v0.26.08.15.1445_TACTICAL_VISIBILITY_AND_STATIC_TERRAIN_CACHE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Added deterministic terrain, reusable cover-context, and per-observer tactical visibility caches.

PREVIOUS BUILD - 1430
=====================

Build: v0.26.08.15.1430_PERSISTENT_THREE_TACTICAL_RENDERER_AND_AI_FOG_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Restored unexplored and explored 3D fog shading during full-AI tactical control while retaining the persistent renderer.

PREVIOUS BUILD - 1342
=====================

Build: v0.26.08.15.1342_PERSISTENT_THREE_TACTICAL_RENDERER_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Introduced the persistent Three.js tactical renderer, stable actor nodes, instanced terrain/fog, and layer-specific invalidation. Full-AI ground fog was corrected in the following 1430 build.

PREVIOUS BUILD - 1208
=====================

Build: v0.26.08.15.1208_DEFERRED_BUILD_HEALTH_AND_STABLE_GEOCLOCK_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Reduced boot work and corrected the Geoscape clock lifecycle. Startup now runs only a tiny critical smoke test covering the game root, React runtime, and build/save metadata. The complete Build Health suite is cached but not executed until the player opens Build Health. The Geoscape clock now keeps one interval across ordinary campaign and UFO updates while a live callback reference supplies current simulation state.

DEFERRED BUILD HEALTH
---------------------
- The full diagnostic suite no longer runs from the app component's boot-time memo. The memo receives a shared four-check boot result without constructing battlefields, visibility contexts, path searches, tactical fixtures, or the rest of the full suite.
- Selecting any Build Health button opens the diagnostics panel immediately and schedules the full suite through requestIdleCallback, with a short timer fallback for browsers that do not implement the idle API.
- The completed result array is cached for the session. Reopening Build Health does not repeat the full suite.
- Full-suite exceptions are caught and displayed as a failed diagnostic instead of escaping into the startup path.
- The critical boot smoke remains synchronous and deliberately small: root element, React runtime, and build/save metadata only.

STABLE GEOSCAPE CLOCK LIFECYCLE
--------------------------------
- The Geoscape timer now depends only on whether the clock is running, its selected speed, the active app screen, and game-over state.
- Month, day, minute, mission, playback, council, UFO, and radar updates no longer tear down and recreate the interval on every simulation tick.
- A render-updated callback ref gives each interval tick the latest campaign closure, avoiding stale state without adding volatile effect dependencies.
- Pausing, changing speed, leaving the game screen, or reaching game over still tears the timer down normally.

BUILD HEALTH
------------
- Browser validation confirms the start screen appears while the full-suite status remains deferred, Build Health first displays the four boot checks, and the complete suite then replaces them after the idle run.
- The full suite now reports dedicated passing contracts for deferred execution and stable Geoscape interval ownership. A live 5-minute clock run advanced from 08:00 to 08:10 without a runtime error.
- Static release checks require the new patch flags, deferred runner/cache/listener, live Geoscape callback ref, bounded timer dependencies, current metadata, and unchanged save format.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 2112
=====================

Build: v0.26.08.14.2112_HYBRID_OPENING_ESCORT_SUPPORT_FOLLOW_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed Hybrid AI support soldiers being suppressed by the escort/rescue system during the opening support handoff. When a player-controlled fire-team leader is holding position with a VIP or civilian, only the leader remains committed to the escort action; supports spend their own TU moving toward the current formation cells. Long catch-up moves may complete their second movement checkpoint instead of being reduced to a single hex while the support remains outside normal cohesion.

OPENING HYBRID ESCORT FOLLOW FIX
--------------------------------
- Hybrid AI marks the player-controlled leader as a fixed escort lead during the support handoff. The rescue planner no longer treats the entire fire team as already committed merely because the held leader has zero TU.
- Supporting soldiers remain eligible for the normal hybrid movement pass and calculate their positions around the leader and escorted civilian/VIP column.
- Stay on Escort keeps supports on escort-relative formation cells even when aliens are visible. Break Off and Engage retains enemy-relative flank behavior.
- The leader does not move a second time under rescue AI after the player has positioned them.
- Formation catch-up extensions may continue when each additional leg makes progress toward the held leader.

PREVIOUS BUILD - 1728
=====================

Build: v0.26.08.14.1728_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed the escort-contact decision in Hybrid AI Command. Applying Stay on Escort or Break Off and Engage now replans the remaining support action as a bounded Hybrid AI round, keeps fire-team leads under player control, and returns to the next Hybrid AI leader phase instead of silently handing the entire mission to full Simulation AI.

HYBRID ESCORT DECISION MODE PRESERVATION
----------------------------------------
- Applying an escort-contact decision now detects whether it interrupted a normal Simulation AI stream or a one-round Hybrid AI support handoff from the active playback marker.
- In Hybrid AI, Apply Escort Decisions cancels only the stale pre-decision playback plan, applies the selected team assignments to the live battlefield, and rebuilds one bounded hybrid support round from that position.
- The rebuilt playback retains the Hybrid AI round marker, holds player-controlled fire-team leads in place, and uses the chosen stay/break-off duties for support movement and engagement.
- When that support round ends, the normal Hybrid AI completion path refreshes TU and returns selection to a living fire-team lead. It does not continue simulating future rounds or finish the mission under full AI control.
- Normal full Simulation AI escort prompts retain their prior continuation behavior. The fix changes only prompts raised during a Hybrid AI support round.
- If the hybrid replan cannot be prepared, the battlefield is restored to a fresh player-controlled Hybrid AI leader phase instead of falling through to full AI.

BUILD HEALTH
------------
- A deterministic regression checks explicit hybrid prompts, legacy prompts detected from a hybrid playback marker, and ordinary Simulation AI prompts.
- Static release checks require the patch flag, continuation-mode helper, hybrid restart path, bounded one-round settings, and Build Health result label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1712
=====================

Build: v0.26.08.14.1712_UFO_INTERCEPTION_BOARD_AND_HYBRID_SUPPORT_CATCH_UP_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Active UFOs now opens a centered, scrollable UFO Interception Board instead of expanding the contact cards at the bottom of the Geoscape. The board retains the complete radar, mission-risk, damage-memory, sortie-readiness, and one/pair/all-base interceptor controls. Hybrid support soldiers also use a full-TU formation catch-up when their selected shot reserve would otherwise leave them behind their moved fire-team lead.

UFO INTERCEPTION BOARD
----------------------
- The Active UFOs (count) button beside Open Incident List now opens a centered modal panel with a fixed header, close button, and independently scrollable contact list.
- Players no longer need to scroll below the globe and tracking panels to review a long list of UFOs.
- Each contact retains its UFO size or unresolved-echo label, region, flight progress, radar quality, threat, sortie summary, mission-risk estimate, last air-combat report, and remembered UFO damage.
- The existing 1 Interceptor, Pair, and All Bases launch actions operate directly from the board and keep their established readiness, detection, route, ferry-network, and active-travel safeguards.
- The panel is presentation-only: UFO movement, detection, air combat, time progression, and save data remain authoritative and unchanged.

FULL-TU HYBRID FORMATION CATCH-UP
---------------------------------
- A hybrid support compares the distance to its current leader-relative formation cell with the number of steps available after its AI-selected shot reserve.
- If that reserve is the only reason the support cannot reach formation during a no-contact handoff, the AI temporarily chooses Formation Catch-Up, releases the reserve, and may spend its full movement TU allowance.
- The catch-up uses the direct formation path and the normal two-leg reassessment playback, so a support may cover up to the full fifteen-step adaptive movement ceiling rather than stopping at an eight-step aimed-reserve allowance.
- A support does not discard its reserve for catch-up when an alien is observed. Enemy-relative flanking, legal fire, cover, cohesion, occupancy, escort, and extraction rules remain authoritative during contact.

BUILD HEALTH
------------
- A new Geoscape contract verifies the centered dialog, independent scroll region, radar-contact cards, and all three interceptor launch controls.
- A tactical regression compares the same distant support route with and without catch-up, confirming eight reserved steps become fifteen full-TU steps while visible contact preserves the original reserve.
- Static release checks require both patch flags, modal controls, scroll markers, catch-up planner, action label, and regression fixtures.
- Save format remains 4. Existing campaigns require no migration.

PREVIOUS BUILD - 1347
=====================

Build: v0.26.08.14.1347_HYBRID_AGGRESSIVE_FLANKING_AND_SUPPORT_MOVEMENT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed hybrid AI support soldiers holding position when they should follow their leader. During alien contact, left and right supports now calculate aggressive firing flanks relative to the line between their fire-team lead and an actually observed alien. Outside contact, or when a safe flank cannot be reached, supports use a direct route toward their normal leader-relative formation slots.

HYBRID SUPPORT MOVEMENT FIX
---------------------------
- The previous handoff sent a desired formation cell through a general combat-position scorer as though that cell were an enemy. That scorer could prefer the soldier's starting hex, producing a complete support hold despite available TU.
- Formation following now uses a dedicated path to the exact open role cell selected by the established fire-team formation system. It spends only TU available after the AI's chosen reserve and retains normal occupancy, terrain, and bounded-route checks.
- A blocked exact role cell falls back to the reachable cell that makes the best progress toward it instead of silently abandoning the movement.

AGGRESSIVE ENEMY-RELATIVE FLANKS
--------------------------------
- When the fire team observes an alien, support movement is evaluated against that real alien rather than the formation marker.
- Left and right roles seek opposite lateral sides of the lead-to-alien line. Candidate positions favor line of sight, weapon range, useful forward pressure, nearby cover, low crowding, and cohesion within six hexes of the lead.
- The team's preferred alien remains first choice when it is alive and observed; otherwise the nearest currently observed alien becomes the flank reference.
- If no legal aggressive flank is available, the soldier safely returns to direct formation-follow movement. This keeps the standard fire-team formation as the fallback and does not give supports independent player orders.
- Fire-team leads remain under player control during the hybrid phase. Run Hybrid AI Turn still resolves one sequentially animated support-and-engagement round and then returns control with refreshed TU.

BUILD HEALTH
------------
- A deterministic regression fixture places left and right supports behind their lead, confirms both spend movement TU, and verifies that they choose opposite sides of an observed alien while remaining within fire-team cohesion.
- The fixture also verifies that direct formation fallback advances toward an exact role cell when no combat flank is being used.
- Static release checks require the new patch marker, combat-target selection, dedicated formation-follow planner, aggressive flank planner, resolver integration, and regression label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1236
=====================

Build: v0.26.08.14.1236_HYBRID_LEADER_CONTROL_AND_COLLAPSIBLE_UFO_LIST_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hybrid AI Command is now available directly from the main tactical toolbar in both the 2D and Three.js isometric battle views. While active, the player cycles through fire-team leads, moves them using the normal TU and reserve system, and may fire at an alien to establish the team's preferred target. Ending the turn hands supporting-soldier formation movement and alien engagement to the AI for one animated round, then returns leader control. The Geoscape's long active-UFO card list is now collapsed by default behind an Active UFOs button beside Open Incident List.

BATTLE-SCREEN HYBRID AI COMMAND
-------------------------------
- A Hybrid AI: On / Off button is part of the shared tactical toolbar, so it remains available in both 2D Map and Three.js ISO views.
- Enabling it changes Prev Soldier and Next Soldier into Prev Fire Team and Next Fire Team. The buttons select one living lead per fire team rather than cycling supporting soldiers.
- Clicking a supporting soldier while hybrid command is active selects that soldier's fire-team lead. This prevents accidental independent support routes.
- The selected lead keeps the normal movement preview, reachable-cell range, TU cost, reserved-shot allowance, kneeling, inventory, firing, and targeting controls.
- Normal manual battle control is restored immediately when Hybrid AI is switched off during an idle player phase.

ONE-ROUND AI SUPPORT HANDOFF
----------------------------
- Run Hybrid AI Turn holds every lead at the position chosen by the player and gives supporting soldiers an in-place formation order around that lead.
- The established formation, occupancy, cohesion, escort, rescue, and movement-safety rules remain authoritative; hybrid mode does not create a second movement system.
- AI chooses support routes, remaining movement, kneeling, legal fire mode, and end-of-movement engagement. Its paths, movement, shots, and impacts use the sequential tactical playback introduced in build 1142.
- If a lead fired at an alien during the player phase, that alien becomes the team's preferred handoff target. A dead, hidden, blocked, or out-of-range preferred target falls back to another legal visible alien.
- Only one AI-controlled tactical round is resolved. Leads are marked finished during that handoff so the AI cannot spend their leftover player-phase TU a second time. When playback finishes, temporary in-place orders clear, the tactical round advances, every surviving soldier receives the normal fresh-turn TU allocation, and control returns to the first living fire-team lead.
- Existing command-map orders, rescue responsibilities, and campaign save format remain compatible.

COLLAPSIBLE ACTIVE UFO LIST
---------------------------
- The Geoscape interface places Active UFOs (count) directly beside Open Incident List.
- Active UFO cards and the no-contacts message are hidden by default, preventing the tracking panel from growing into a long always-visible list.
- Opening the button reveals the same authoritative UFO cards and controls. Hide Active UFOs collapses them again without changing tracking, interception, radar detection, travel, or time progression.

BUILD HEALTH
------------
- A new regression fixture verifies leader-only cycling, shared in-place formation orders, preferred-target propagation, order cleanup, the one-round AI handoff markers, and both battle-toolbar labels.
- Static release checks require the two patch flags, hybrid helpers, main battle-screen toggle, fire-team navigation labels, one-round handoff control, and Geoscape UFO-list toggle.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1142
=====================

Build: v0.26.08.14.1142_HYBRID_FIRETEAM_PLAYBACK_HELMETS_AND_TRANSFER_CONFIRMATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
AI tactical playback now isolates movement to the unit whose action and route are being shown, removing out-of-order walks and position snap-backs. The Tactical Command Map is now a hybrid fire-team control layer: players command each leader's waypoint and may choose a preferred alien, while the AI retains TU-reserve, movement-execution, shot-mode, kneeling, and fallback-target decisions. Supporting soldiers continue using the established formation system. Three.js soldiers now wear small armor-matched tactical helmets. Barracks soldier cards hide destinations behind a Transfer button and require a detailed confirmation screen before a troop transfer begins.

ORDERED AI MOVEMENT PRESENTATION
--------------------------------
- Sequential playback frames now record the exact IDs allowed to move during each action.
- Combat damage may update a target's HP and state without borrowing that target's later position from the end-of-phase snapshot.
- Only the acting soldier and any civilian actually following that soldier animate during the route display. Other soldiers wait for their own action frame.
- Impact and phase-completion frames cannot replay leftover movement, eliminating the unmarked walk-and-snap-back sequence.
- Timing estimates use the same per-frame movement set as the renderer, so audio, paths, movement, shots, and impacts stay ordered.

HYBRID FIRE-TEAM COMMAND
------------------------
- The Tactical Command Map is now labeled Hybrid Fire-Team Command.
- The player chooses a fire team, an optional preferred visible alien, and a waypoint for that team's leader.
- The AI still determines its TU reserve, snap/aimed/burst behavior, kneeling, route execution, post-move reassessment, and whether it has a valid shot.
- Supporting soldiers do not receive independent player routes. They continue deriving their positions from the existing leader-relative formation, pace, occupancy, and cohesion rules.
- After movement, every team member prefers the designated alien when it is alive, visible, in range, and in line of sight. If it dies or cannot be seen, the soldier may engage another visible alien.
- Arriving at the waypoint changes the order into a formation hold instead of silently discarding it. The player may clear or replace the order from the map.
- Rescue/escort responsibilities and hard tactical safety rules remain authoritative; a blocked command still clears after bounded failed progress rather than deadlocking the battle.

THREE.JS TACTICAL HELMETS
-------------------------
- Every living or fallen Three.js AEGIS soldier model receives a small tactical helmet shell and brim.
- Helmet material comes from the same armor-color value used by that soldier's equipped armor, so Field Suits, Ceramic Armor, Psi Weave, and future palette variants remain visually consistent.
- Helmets are presentation-only and do not alter armor protection, visibility, hit chance, movement, TU, or save data.

BARRACKS TRANSFER CONFIRMATION
------------------------------
- Destination buttons are no longer permanently expanded on every soldier card.
- A Transfer button reveals the valid destination-base list for only that card.
- Choosing a destination opens a confirmation screen showing soldier name, origin, destination, travel time, logistics fee, squad-duty removal, availability during transit, and the no-refund cancellation rule.
- Confirm Transfer is disabled when campaign funds cannot cover the fee. Back closes the confirmation without moving the soldier or charging funds.
- The existing authoritative transfer function still performs the final fund deduction, squad removal, transit record, ETA, and arrival behavior only after confirmation.

BUILD HEALTH
------------
- Sequential playback regression covers a second soldier who moves later but is also updated by an earlier combat action; that soldier must retain the old position until their own frame.
- Hybrid-command regression covers preferred-target selection, nearest-visible fallback, clearing preferred-target state, formation-source preservation, and the new Command Map language.
- Static release checks require explicit action movement IDs, hybrid command fields and fallback targeting, armor-matched Three.js helmet construction, and both transfer-option and transfer-confirmation UI markers.
- Save format remains 4. Existing campaigns and in-progress tactical states require no migration.

PREVIOUS BUILD - 0949
=====================

Build: v0.26.08.14.0949_VIP_RESCUE_INGRESS_PATCH_HISTORY_SHOT_STACK_AND_SFX_MULTIPLIERS_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue missions use the rescue quota as an authoritative victory condition, with partial credit preserved when a quota is missed. Fire-team leaders route into VIP buildings more reliably when their own supports occupy narrow approaches. Testers can open patch notes and version history directly from Save / Load. Tactical shot results stack at the top of a battle for ten seconds, fade independently, and can be hidden from a battle-screen button. Enhanced SFX entries support persistent 1x, 2x, 3x, and 4x multipliers.

VIP BUILDING INGRESS
--------------------
- Rescue route planning now treats the leader's own fire-team members as mobile formation traffic instead of permanent path blockers. The formation mover remains responsible for shifting those supports safely as the leader advances.
- When a VIP is inside a building, the contact destination must also be inside that building. Soldiers no longer satisfy the approach by merely standing against the exterior side of a solid wall.
- Full routes compare valid adjacent contact cells inside the target building and naturally cross a door or an already-open breach.
- If a complete route is temporarily blocked by unrelated occupants, bounded fallback movement prioritizes the target building's valid door and breach cells instead of repeatedly pressing toward the nearest exterior wall.
- Extraction no-reentry behavior is unchanged. This traffic exception applies while approaching a VIP; escorted columns that have cleared a building still remain committed to outdoor routes toward the Skyranger.
- Fire-team movement authority is unchanged: the leader owns the move, supports preserve formation, and this fix does not create additional movement phases.

MISSION RESOLUTION CONSISTENCY
------------------------------
- Meeting the mandatory rescue quota and resolving every remaining VIP permits victory once the alien force and any required confirmed beacon objective are neutralized.
- Resolving every VIP below quota creates a terminal objective failure after the alien force is defeated. Manual and AI-controlled battles now consume the same terminal-state result.
- A mathematically impossible quota does not immediately discard surviving VIPs. The rescue phase remains open while any VIP is still active so the squad can extract them for partial credit.
- Terminal quota failure ends cleanly rather than consuming extra reinforcement waits, beacon-search turns, or the AI safety interval in pursuit of an impossible victory.

PARTIAL CREDIT AND CAMPAIGN RESULTS
-----------------------------------
- A missed mandatory quota records a mission failure and applies the mission's normal failure panic penalty and 20% base-reward fallback.
- Each extracted VIP still awards the profile's per-rescue payment. The quota-completion bonus is withheld on failure.
- Surviving soldiers retain their ordinary mission experience and medical outcomes; extracted and lost VIP totals remain explicit in the action log and report.

PATCH NOTES AND VERSION HISTORY
-------------------------------
- Save / Load now includes a Patch Notes / Version History button beside Build Health and the Enhanced SFX Library.
- The latest build opens by default with a readable summary and detailed highlights for testing.
- A desktop build list and mobile version selector expose the recent browser-build history without leaving the game or requiring network access.
- Each entry shows its human-readable version, date, title, summary, full build identifier, save-format compatibility, and the most important testing points.
- The viewer is embedded in index.html for direct-file play. README_PATCH_NOTES.txt remains the authoritative detailed archive.

TACTICAL SHOT RESULT STACK
--------------------------
- Shot results remain fully visible for 10 seconds, then fade over 700 milliseconds before removal.
- New results enter at the top and push older results downward. Up to six recent shots can remain visible at once and each keeps its own display/fade timer.
- The battle header includes a Shot Results: On / Off button. Turning the display off immediately clears its notices and timers but does not alter ballistics, damage, sound, dialogue, or the Mission Timeline.
- The display preference is retained in the live state for the current battle when moving between command sections.

ENHANCED SFX BOOST MULTIPLIERS
------------------------------
- Every sound now exposes 1x, 2x, 3x, and 4x choices instead of a single 2x toggle.
- The selected multiplier applies after the sound's individual level and before the master SFX volume.
- Existing locally saved boolean boost settings migrate automatically: Boost On becomes 2x and Boost Off becomes 1x.
- Reset Mix restores every individual level to 100% and every multiplier to 1x.

BUILD HEALTH
------------
- The rescue-phase regression now distinguishes `canResolveVictory` from `canResolveFailure` and covers both below-quota failure and quota-met victory terminal states.
- The door-ingress regression now places a support soldier directly in the only immediate entrance route and verifies that the leader still enters through the opening, finishes inside the VIP's building, contacts the VIP, and keeps the support on fire-team duty.
- The tactical feedback regression covers newest-first stacking, independent fade/removal transforms, the exact 10-second visibility contract, and a stack capacity greater than one.
- Enhanced SFX regression now covers boolean-setting migration plus bounded 1x, 2x, 3x, and 4x gain calculations.
- Static checks require the Save / Load viewer, version selection, battle-screen shot toggle, ten-second stack timing, fade timing, and all four SFX multiplier controls.
- Static checks require the shared terminal failure branch in AI simulation and manual End Turn handling, plus the partial-credit contract and browser/native parity record.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 0903
=====================

Build: v0.26.08.14.0903_VIP_RESCUE_QUOTA_AND_BUILDING_INGRESS_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue quotas became authoritative across manual and AI mission resolution. Resolving all VIPs below quota became a clean failure with normal per-VIP partial credit, while fire-team rescue routes began treating their own formation supports as mobile traffic and required a valid interior approach to a VIP inside a building.

CORE CHANGES
------------
- Split terminal rescue permission into canResolveVictory and canResolveFailure.
- Prevented impossible-but-still-active rescue objectives from ending before surviving VIPs could be extracted for partial credit.
- Routed leaders through valid building doors or breaches and prevented exterior adjacency through a solid wall from counting as contact.
- Preserved leader-owned formation movement and the outdoor extraction no-reentry rule.

PREVIOUS BUILD - 2320
=====================

Build: v0.26.08.13.2320_SEVEN_HEX_BEACON_SHIELD_AND_MISSION_EXIT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Alien Field Beacon shields now occupy the beacon hex and its six adjacent hexes. Compatible incoming fire is intercepted when fired from outside the field, protecting reinforcements that have just beamed into those cells, while soldiers can still walk through the field and attack the beacon from inside. This build also fixes the undefined beacon-objective reference that could crash the tactical victory exit handoff.

SEVEN-HEX SHIELD AND CLOSE ASSAULT
----------------------------------
- The shield footprint is exactly seven passable hexes: the beacon center and all six immediate neighbors. Only the beacon itself remains a physical obstacle.
- Kinetic shields stop outside ballistic fire entering any protected hex. Combined shields stop outside ballistic, laser, plasma, and alien-energy fire. Explosive attacks retain their established penetration behavior.
- Reinforcements materialize in the six surrounding cells and are protected while they remain inside the field; the protection is positional and does not follow them after they leave.
- A soldier standing in any shield hex is already inside the boundary, so compatible direct fire can damage the beacon without being intercepted. This gives every armed fire team a close-assault solution even when it lacks the shield's preferred ranged counter or a Frag Grenade.
- Fire-team formation movement is preserved. The assigned leader remains movement authority, supports use their established leader-relative positions, and the shield footprint adds no pathing obstruction.

PRESENTATION AND MISSION EXIT FIX
---------------------------------
- Revealed shield footprints are outlined across all seven cells in 2D: cyan for kinetic and magenta for combined fields.
- The Three.js shell is enlarged and flattened around the complete seven-hex footprint rather than hugging only the beacon model.
- Shield impacts against protected units use the same visible beacon-field feedback as blocked direct beacon shots.
- Tactical victory exit now stores `tacticalBeaconObjective`, the objective value actually in scope, instead of referencing the undefined `tacticalAlienBeaconObjective` name.

BUILD HEALTH
------------
- Added a seven-hex contract covering exact footprint, passable adjacent cells, outside interception, explosive passage, inside-field bypass, protected reinforcement arrival, 2D/Three.js presentation, and preserved leader-only formation movement.
- The mission-completion regression now explicitly requires the correct result-handoff variable and rejects the undefined name that caused the reported runtime error.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 1956
=====================

Build: v0.26.08.13.1956_CONFIRMED_BEACON_MISSION_COMPLETION_GATE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Eliminate-force missions now treat a confirmed active Alien Field Beacon as part of the hostile operation. Defeating the last alien begins a visible Locate or Secure the Beacon phase instead of ending the mission early. AI-controlled squads search without artificial battlefield knowledge, preserve fire-team formation during the strike, and stop cleanly with a withdrawal option if the deployed shield cannot be breached.

MISSION COMPLETION GATE
-----------------------
- A non-crash mission that requires alien-force defeat cannot report victory while a campaign-confirmed field beacon remains active.
- Mandatory VIP/civilian rescue remains an independent requirement; beacon completion does not bypass the existing rescue terminal state.
- Missions with unknown beacon doctrine, UFO crash sites, and objectives that do not require alien-force defeat retain their established completion rules.
- The same beacon-aware terminal helper now governs direct control, Watch AI Team Leader, streamed Simulation AI, and Classic Lineup outcomes.

SEARCH, STRIKE, AND FIRE-TEAM COHESION
--------------------------------------
- A confirmed but unseen beacon stays hidden. After the last alien falls, AI units conduct coordinated grid/fog exploration until normal range and line of sight reveal it.
- Once discovered, one free shield-capable fire team receives the strike assignment. The leader remains movement authority and supporting soldiers keep their existing formation behavior.
- Tactical controls, logs, and playback explicitly distinguish Locate, Neutralize, No Breach, and Complete phases.
- Direct control remains available throughout the objective so the player can adjust equipment use or choose Dust Off.

REINFORCEMENTS AND DEADLOCK SAFETY
----------------------------------
- Destroying the beacon cancels a reinforcement wave that is still in transit. Reinforcements that already arrived remain on the battlefield and must still be defeated.
- Manual Frag Grenade destruction now follows the same pending-transit cancellation rule as direct weapon fire and AI attacks.
- If no living soldier can breach the deployed shield, automated resolution returns an incomplete operation instead of looping or inventing a victory, with a clear withdrawal explanation.

BUILD HEALTH
------------
- Added a regression contract covering unknown and confirmed doctrine, locate/neutralize/complete phases, already-arrived reinforcements, transit cancellation, mandatory rescue coexistence, impossible combined-shield breach, non-elimination and crash-site exclusions, AI search continuation, shared-mode wiring, and tactical objective presentation.
- Save format remains 4; no migration is required.
- Native Godot parity remains queued.

PREVIOUS BUILD - 1204
=====================

Build: v0.26.08.13.1204_ADAPTIVE_ALIEN_BEACON_COMBINED_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Phase 3 of Alien Field Beacon adaptation is active. After six beacon destructions are recorded in campaign mission reports, newly generated non-crash incidents upgrade from the ballistic-only kinetic field to a combined shield that also intercepts laser and plasma fire. Grenades and personnel still pass through, existing battlefields retain their deployed shield state, and reinforcement arrivals still preserve original beacons and crashed-UFO landmarks.

COMBINED KINETIC-ENERGY SHIELD
------------------------------
- Destruction history remains report-based and save-format-4 compatible: 0-2 destroyed beacons deploy unshielded, 3-5 deploy the Phase 2 kinetic shield, and 6 or more deploy the combined field.
- Combined shields block ballistic, laser, plasma, and alien energy weapon damage without reducing beacon HP. TU/ammunition are still spent and the tactical log identifies the intercepted damage class.
- Frag Grenades remain the intentional Phase 3 breach path and use the existing prime/throw costs, range, seven-cell blast, and friendly-risk rejection.
- The field remains non-solid around the beacon. Soldiers, aliens, civilians, and VIPs can move through the shield volume; only the beacon's physical hex remains occupied.
- UFO crash-site deployments remain excluded and continue replacing the beacon with the angled smoking wreck and impact trail.

AI, FORMATION, AND PRESENTATION
-------------------------------
- Simulation AI assigns a combined-shield beacon only to a free fire team that still has a living soldier with a Frag Grenade. Ballistic- or energy-only teams do not waste turns firing into the field.
- The fire-team leader remains the sole movement authority. A grenade-capable support follows normal formation and attacks only when the formation places that soldier safely in range.
- Laser/plasma users carrying grenades reserve their direct weapon fire against the combined shield and use the existing safe grenade decision instead.
- 2D displays a magenta `K+E SHIELD` badge and descriptive tooltip. Three.js uses a magenta combined-field shell distinct from the cyan Phase 2 kinetic field.

PRESERVED REINFORCEMENT LANDMARKS
---------------------------------
- Beacon reinforcement waves retain the original beacon record, including its shield, HP, damage, and revealed state.
- Reinforcement dropships in crash missions retain the original crashed-UFO craft, wreckage, trail, broken trees/buildings, and smoke.

BUILD HEALTH
------------
- Added a Phase 3 regression contract covering the six-destruction threshold, ballistic/laser/plasma interception, grenade passage, AI team eligibility, formation movement ownership, and 2D/Three.js presentation.
- Existing Phase 2 kinetic-shield and reinforcement-landmark regression contracts remain active.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1552
=====================

Build: v0.26.08.12.1552_ADAPTIVE_ALIEN_BEACON_KINETIC_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
After three Alien Field Beacon destructions recorded in campaign mission reports, later non-crash incidents deploy the beacon with an adaptive kinetic shield. The field stops ballistic rounds, while laser/plasma fire, Frag Grenades, and personnel continue to pass through. Existing tactical battles retain their deployed beacon state, UFO crash sites still replace the beacon with the crashed craft and impact trail, and reinforcement arrivals no longer remove either mission landmark.

ADAPTIVE KINETIC SHIELD
-----------------------
- The campaign derives the alien adaptation threshold from saved mission reports, so existing format-4 campaigns need no migration or new campaign field.
- The first three destroyed-beacon encounters retain the original unshielded device. Once the third destruction is in the report archive, newly generated beacon missions receive the kinetic field.
- Ballistic fire still spends the chosen shot's TU and ammunition, but causes no beacon HP damage and produces a shield-interception combat log message.
- Laser and plasma weapons pass through the field and damage the beacon normally.
- Frag Grenade blast damage passes through the field and can destroy the beacon under the existing prime, throw, blast-radius, and friendly-risk rules.
- The field does not occupy surrounding cells, so soldiers, aliens, civilians, and VIPs retain normal movement around it.
- A mission's shield state is fixed when its battlefield is created and is preserved by the existing tactical snapshot system.

AI AND FIRE-TEAM SAFETY
-----------------------
- Confirmed-beacon doctrine assigns only one free fire team, preserving player orders, combat priorities, rescue work, escorts, and existing formation movement.
- A shielded-beacon assignment is accepted only if the chosen team has an energy weapon or a Frag Grenade that can breach the field.
- The fire-team leader remains the movement authority and advances the whole team under the existing leader/support formation and pacing rules; any shield-capable member may attack once the formation puts that soldier in range. Other teams do not clump on the beacon.
- The established safe-grenade logic still rejects any throw whose blast includes an AEGIS soldier, civilian, or VIP.

REINFORCEMENT LANDMARK PERSISTENCE
----------------------------------
- Beacon reinforcement materialization preserves the exact original beacon cover record, including HP, shield state, damage state, and visibility.
- Crash-site reinforcement arrivals preserve every crashed-UFO hull, wing, core, impact-trail, scar, broken-tree, debris, and smoke source cover.
- Registering a live reinforcement dropship no longer removes the crashed-UFO craft model from the battlefield; both can coexist for the duration of the arrival.
- The preservation merge is identity-based, so an already retained landmark is not duplicated.

PRESENTATION AND BUILD HEALTH
-----------------------------
- The 2D beacon marker carries a K-SHIELD badge and its hover description identifies the ballistic block.
- The 3D Iso beacon receives a translucent cyan shield shell that brightens on a ballistic impact.
- Cover details and tactical logs distinguish shield interception from ordinary damage and destruction.
- Regression coverage verifies the three-destruction threshold, ballistic interception, energy/grenade passage, unshielded legacy damage, mission deployment, report-history counting, capable AI team selection, 2D/3D presentation seams, and beacon/crashed-UFO persistence through reinforcement arrival.

PREVIOUS BUILD - 1305
=====================
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
