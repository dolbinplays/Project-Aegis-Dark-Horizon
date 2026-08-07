PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1415_TACTICAL_ALIEN_BEACON_FANOUT_SEARCH_AND_LONE_SURVIVOR_EXFIL_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update fixes original alien groups clustering around the Alien Field Beacon instead of leaving the insertion area to hunt civilians, VIPs, and AEGIS soldiers.

TACTICAL - ALIEN GROUPS FAN OUT FROM THE BEACON
-----------------------------------------------
- Root cause: the ordinary non-VIP alien objective planner checked its home/exfil target before its search doctrine. Every original alien with no visible or remembered target therefore tried to return to the active Field Beacon.
- While two or more original aliens remain alive, no-target behavior now enters the existing deterministic search doctrine instead of beacon exfil.
- Search assignments remain distributed by alien index/mission seed so the group fans out across different sectors rather than marching as one stack.
- Search waypoints for original aliens are rejected when they fall within four hexes of an active Field Beacon. This prevents an outward-search assignment from immediately placing the alien back into the beacon cluster.
- Aliens still immediately override search when they see a living civilian, VIP, or AEGIS soldier, and remembered living contacts retain priority before search.

TACTICAL - LONE SURVIVOR EMERGENCY FALLBACK PRESERVED
-------------------------------------------------------
- The existing emergency reinforcement fiction remains active, but it is now a straggler behavior rather than a whole-squad default.
- Only the lone surviving original alien in a non-VIP mission may fall back to its active Field Beacon, legacy dropship, or recorded insertion point when no living target is visible or remembered.
- Reaching that support point can still arm the existing emergency reinforcement call.
- A visible living target still cancels/overrides the fallback immediately.
- Reinforcement aliens retain their caller-rally behavior and then transition into search; this patch does not force reinforcement waves to retreat to the beacon.

PLAYER-FACING RESULT
--------------------
A fresh alien force should no longer sit gathered around its deployment beacon waiting for AEGIS to find it. After deployment, aliens without contact should spread out and search the battlefield. If the force is reduced to one original survivor, that final alien may withdraw to the beacon and attempt to call for help.

PRESERVED BEHAVIOR
------------------
- Build 1345 per-fire-team escort-support assignment board and contact-loop fix.
- Build 1300 streamed one-round Simulation AI playback/look-ahead.
- Build 1215 path-coherence and single-movement-commit rules.
- Alien Field Beacon reinforcement materialization/destruction behavior.
- VIP-target priority, last-known-contact pursuit, reinforcement rally/search, reaction fire, fog of war, and save format 4.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- New Build Health contract verifies that two original aliens beside an active beacon both receive outward `search` objectives more than four hexes from the beacon.
- The same contract verifies that a lone original survivor receives a beacon fallback objective.
- Static test-symbol scan: 356 unique `*Test` symbols / 355 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing regression test.
- Start-screen version derives from the authoritative build ID and displays v0.26.08.07.1415.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Start a fresh non-VIP tactical incident and locate the Alien Field Beacon.
2. Keep the initial alien group alive but out of contact with AEGIS.
3. Advance several alien turns and confirm the aliens leave the beacon area and fan out into different search sectors.
4. Confirm they pursue and attack civilians, VIPs, or AEGIS soldiers as soon as those targets become visible.
5. Reduce the original alien force to one survivor, break contact, and confirm that lone straggler may withdraw toward the beacon and make the existing emergency reinforcement call.
6. Confirm reinforcement aliens still rally appropriately and then search rather than camping permanently at the beacon.


======================================================================
PREVIOUS BUILD NOTES
======================================================================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1345_TACTICAL_ESCORT_SUPPORT_ASSIGNMENT_BOARD_AND_CONTACT_LOOP_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update replaces the all-or-nothing escort-support prompt with a per-fire-team assignment board and fixes the repeated-contact loop that could ask the player to break off the same escort team (for example Foxtrot) again and again after AI playback rebuilt.

TACTICAL - ESCORT SUPPORT ASSIGNMENT BOARD
-------------------------------------------
- When Simulation AI spots a living alien while one or more fire-team leaders are escorting civilians/VIPs, tactical action pauses before continuing the affected AI plan.
- Every currently escorting fire team with at least one living support soldier appears in a two-column assignment window.
- Left column: `Stay on Escort`. Supports remain with their leader and protect the civilian/VIP column.
- Right column: `Break Off and Engage`. The leader continues escorting while the supporting soldiers temporarily leave formation and use normal combat AI against the visible alien contact.
- All eligible teams begin in the left column for each new contact decision.
- Clicking a team in the left column moves that team to the right column.
- Clicking a team in the right column moves it back to the left column.
- No movement/AI response is committed while the player is arranging the board.
- `Apply Escort Decisions` commits every fire-team choice atomically and then resumes streamed Simulation AI from the currently displayed authoritative battlefield.
- The tactical log records which teams stayed on escort duty and which teams broke off.

TACTICAL - REPEATED FOXTROT / CONTACT-LOOP FIX
-----------------------------------------------
- Root cause: the old response handler cleared AI playback and rebuilt the continuation after the player chose Stay/Break Off. During that temporary `aiPlayback = null` state, the contact-active guard was also reset. The rebuilt playback then saw the same still-visible alien and treated the same contact as a brand-new decision.
- The contact-active guard now survives AI playback teardown/rebuild.
- The active contact flag and an open two-column assignment board are retained in the live tactical cache so renderer/remount recovery does not silently restart the decision.
- A contact episode is cleared only on a phase-complete AI frame with no visible living aliens. Brief empty setup frames during a replan do not clear the decision.
- Therefore choosing Foxtrot (or any other team) to break off cannot immediately reopen the same popup simply because the streamed AI continuation was rebuilt.
- When an engagement genuinely ends, any team still marked `breakoff` automatically normalizes back to `stay` as its escort AI resumes formation. A later genuinely new alien contact can then create a fresh assignment board.

TACTICAL - PER-TEAM STATE
-------------------------
- The new helper `tacticalSetEscortSupportAssignments(...)` applies mixed decisions in one state transition.
- Each selected fire team receives its own `fireTeamEscortSupportMode` (`stay` or `breakoff`) and issue round.
- Break-off support soldiers are excluded from escort-duty ownership while living threats are active, allowing ordinary combat AI to use them.
- The escort leader remains responsible for the civilians/VIPs in either mode.
- Once no active threat remains, break-off teams rejoin escort duty and normal formation logic moves supports back toward their leader.

PRESERVED BEHAVIOR
------------------
- Build 1300 streamed one-round Simulation AI playback/look-ahead remains active.
- Build 1215 path-coherence and one-movement-commit rules remain active.
- Alien Field Beacon, fire-team formations, Command Map, manual escort authority, VIP terminal resolution, and strategic aircraft systems are unchanged.
- Save format remains 4.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct assignment helper contract confirms Alpha can remain `stay` while Foxtrot is simultaneously `breakoff` in the same decision.
- Build Health adds `Escort contact popup assigns individual fire teams between escort duty and break-off combat without re-prompting the same contact episode`.
- Static test-symbol scan: 355 unique `*Test` symbols / 354 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing regression test.
- Static inspection confirms the popup contains `Stay on Escort`, `Break Off and Engage`, and `Apply Escort Decisions` controls.
- Static inspection confirms AI playback teardown no longer resets the contact-active guard and that only a phase-complete no-visible-alien frame releases the contact episode.
- Start-screen version derives from the authoritative build ID and displays v0.26.08.07.1345.

MANUAL TEST GATES
-----------------
1. Run a mission with at least two fire-team leaders escorting civilians/VIPs and hand control to Simulation AI.
2. Reveal an alien and confirm the assignment board pauses action.
3. Confirm all escorting teams initially appear under `Stay on Escort`.
4. Click Foxtrot and another team into `Break Off and Engage`; move one of them back to `Stay on Escort`; press `Apply Escort Decisions`.
5. Confirm only the teams left in the right column send supports toward the firefight while every escort leader keeps moving civilians/VIPs.
6. Confirm the same still-visible alien contact does not reopen the popup after the AI continuation rebuilds.
7. Let the contact end and confirm detached supports return to their original leaders.
8. Create a genuinely new later alien contact and confirm a fresh assignment board may appear.


======================================================================
PREVIOUS BUILD NOTES
======================================================================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1300_TACTICAL_AI_STREAMED_SIMULATION_AND_PLAYBACK_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update changes Simulation AI Command from an all-upfront continuation calculation into streamed one-round simulation/playback. The player begins watching after the first tactical round is prepared; while that round is being played, the AI may prepare at most one additional round of look-ahead. It no longer calculates the rest of a long encounter before playback starts.

AI COMMAND - STREAMED SIMULATION / PLAYBACK
--------------------------------------------
- Manual-to-AI takeover prepares only one tactical round before normal playback begins.
- `resolveMissionAiStreamBatchAsync(...)` wraps the existing deterministic simulator in one-round batches.
- If that round does not end the battle, the simulator returns the authoritative continuation snapshot rather than performing mission-end processing.
- Playback starts immediately from the first batch.
- During playback, the next one-round batch is generated only after playback enters the current buffered batch.
- At most one future tactical round is therefore queued. Simulation cannot race ahead and pre-resolve the whole encounter in the background.
- If a streamed round contains no visible/action frames, the browser yields and advances to the next one-round simulation batch rather than stalling.
- When a terminal result occurs, the final batch carries the normal mission result, casualty, growth, rescue, and survivor processing.
- The existing overall 72-round AI safety interval remains. The final safety batch returns live tactical control instead of inventing a mission result when both sides still have survivors.

INITIAL HANDOFF / LOADING SCREEN
--------------------------------
- The `Transferring Tactical Command` screen remains, but it now represents only the initial one-round preparation rather than progress through the whole encounter.
- Its copy explicitly states that playback begins after the first streamed round and that Simulation AI keeps at most one round of look-ahead.
- The first browser yield happens before the initial round is calculated so the handoff UI can paint promptly.
- The 1245 continuation optimization is preserved: AI takeover does not regenerate tactical deployment data for a battlefield that already exists.

PLAYBACK BUFFER / CONTROL SAFETY
--------------------------------
- Reaching the last currently buffered frame while another streamed round is pending no longer exposes a premature `Continue Mission Result` control.
- Tactical-map playback and the classic overlay show `AI thinking one round ahead...` until the next batch arrives.
- `aiResolutionPending` now treats pending/queued stream continuation as unresolved tactical ownership, preventing temporary end-of-buffer states from being mistaken for mission victory.
- Taking back command invalidates any in-flight look-ahead result before it can be appended.
- Issuing or clearing a Command Map fire-team order invalidates only the queued future stream and rebuilds from the currently displayed authoritative battlefield.
- Pausing AI action may retain the single already-queued look-ahead batch, but no additional rounds are generated while planning is paused.
- Save/reload clears a persisted `streamPending` flag and resets the runtime stream token so an interrupted streamed battle can resume instead of remaining stuck waiting for an async task that no longer exists.
- If look-ahead generation fails, the current streamed batch remains valid and the mission returns safely to player control instead of finalizing an incomplete AI result.

PERFORMANCE EFFECT
------------------
- Build 1245 removed redundant deployment generation and yielded between two-round chunks, but still completed the whole bounded continuation before showing normal playback.
- Build 1300 removes that remaining up-front workload. Initial takeover cost is bounded to one tactical round plus state capture/playback setup.
- Subsequent AI computation is amortized across the time the player is already watching tactical playback.
- Stored future playback frames are also bounded to roughly the current batch plus one-round look-ahead instead of potentially dozens of rounds.

PRESERVED BEHAVIOR
------------------
- Deterministic simulation remains authoritative; this patch changes scheduling and buffering rather than hit chance, damage, TU, pathing, fire-team doctrine, rescue priorities, reinforcement cadence, or mission objectives.
- The 1215 path-coherence / one-movement-commit fix remains active.
- The 1145 interceptor swarm null-target fix and 1015 tactical/swarm systems remain active.
- Save format remains 4.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Build Health retains the 1245 handoff optimization contract and adds `Simulation AI streams one-round playback batches with at most one round of look-ahead`.
- Static test-symbol scan: 354 `*Test` symbols / 353 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing test.
- Static inspection confirms the old all-upfront `resolveMissionForAiHandoffAsync(...)` helper is absent from the build.
- Static inspection confirms one-round `batchRounds=1`, streamed continuation state, one-batch prefetch gating, buffered-end UI guards, stream invalidation, and save/reload pending-state recovery are present.
- Start-screen version derives from the authoritative build ID and displays v0.26.08.07.1300.

MANUAL TEST GATES
-----------------
1. Start a live tactical battle, play at least one manual turn, then hand control to Simulation AI.
2. Confirm `Transferring Tactical Command` appears promptly and disappears after only the first tactical round is prepared.
3. Confirm tactical playback starts without waiting for the rest of a long encounter to be calculated.
4. Watch the frame counter: when playback reaches the end of a buffered round before look-ahead is ready, confirm it briefly displays `AI thinking one round ahead...` and then continues automatically.
5. Confirm browser timeout / page-not-responding notifications are reduced or eliminated on the same large battle that triggered them in 1245 and earlier builds.
6. Pause through Command Map, issue multiple fire-team orders, resume, and confirm only a short first-round rebuild occurs before playback resumes.
7. Take Back Control while AI playback is active and verify no later queued AI movement suddenly overwrites the restored player state.
8. Save/reload during streamed AI playback and confirm the stream resumes rather than remaining stuck in a permanent thinking state.
9. Let a battle resolve normally and verify victory/failure, survivors, wounds, XP, rescue results, reports, and Skyranger return behavior remain correct.
10. Exercise the 72-round safety interval if possible and confirm unresolved survivors return to player command instead of producing a synthetic result.


PREVIOUS BUILD NOTES - 1245
===========================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1245_TACTICAL_AI_HANDOFF_PROGRESSIVE_LOADING_AND_CHUNKED_SIMULATION_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This pass targets the browser timeout / "page not responding" notifications that could occur immediately after confirming Simulation AI Command takeover of a live tactical battle.

AI COMMAND HANDOFF - REDUNDANT DEPLOYMENT WORK REMOVED
-------------------------------------------------------
- `resolveMission(...)` previously called `tacticalDeployment(...)` before checking whether it was inheriting an already-live tactical battlefield.
- During manual-to-AI takeover, that deployment result was not used: live units, covers, Skyranger geometry, explored cells, reinforcement state, and tactical round came from `initialBattleState`.
- Build 1245 checks continuation ownership first and skips tactical deployment generation entirely for a live AI handoff.
- Fresh strategic simulations still create a deployment normally.

AI COMMAND HANDOFF - COOPERATIVE CHUNKED SIMULATION
----------------------------------------------------
- The old handoff ran the complete bounded continuation simulation synchronously in the click handler. A difficult battle could calculate dozens of tactical rounds without returning control to the browser event loop.
- Build 1245 adds `resolveMissionForAiHandoffAsync(...)`.
- Live AI takeover is simulated in two-round chunks, with a browser yield between checkpoints.
- Intermediate chunks return an authoritative tactical continuation snapshot instead of applying mission-end growth/casualty post-processing.
- Human TU is refreshed at chunk boundaries to preserve the same new-round behavior that the former single continuous loop applied.
- Units, HP, ammunition, medkits, positions, cover damage, explored cells, fire-team state, command orders, alien reinforcement state, Skyranger extraction geometry, and tactical-round numbering are carried into the next chunk.
- The final chunk applies the existing terminal/safety-limit result rules. Save format and tactical balance are unchanged.

AI COMMAND LOADING / PROGRESS SCREEN
------------------------------------
- Confirming AI Command now immediately mounts a full-screen `Transferring Tactical Command` overlay.
- The overlay shows the current preparation stage and percentage progress.
- Stages cover live-state capture, bounded tactical-round simulation checkpoints, and playback preparation.
- Because the simulator yields between small batches, the browser can repaint the progress screen and process UI work instead of appearing frozen for the entire preparation interval.
- Rebuilding Simulation AI after Command Map orders uses the same progressive preparation path.
- If preparation throws an error, control returns to the player and the tactical log reports the failure rather than leaving the battle stranded in AI mode.

PRESERVED BEHAVIOR
------------------
- The 1215 one-movement-commit and path-coherence correction remains active.
- AI movement, hit/damage math, reinforcement cadence, fire-team doctrine, rescue priorities, reaction fire, fog, TU costs, and playback ordering remain simulation-side and deterministic.
- The 1015/1145 interceptor swarm fixes remain intact.
- Tactical startup still uses the existing deployment-generation progress screen for fresh missions.
- Save format remains 4.

VALIDATION COMPLETED
--------------------
- All non-empty embedded JavaScript blocks pass `node --check`.
- Build Health includes `AI tactical command handoff skips redundant deployment generation, yields between simulation chunks, and shows progress`.
- Static contract confirms continuation-mode `resolveMission` skips `tacticalDeployment`, supports bounded chunk returns, and exposes continuation snapshots.
- Static contract confirms the handoff helper yields through `tacticalStartupYield()` and defaults to two tactical rounds per chunk.
- TacticalMission contains the AI handoff progress state and `Transferring Tactical Command` overlay.
- Start-screen version derives from the authoritative build ID and displays v0.26.08.07.1245.

MANUAL TEST GATES
-----------------
1. Start a live tactical battle, play at least one manual turn, then press AI Command and confirm Tactical Map Watch.
2. Confirm the progress overlay paints immediately rather than the browser appearing frozen.
3. Watch progress advance through multiple simulation checkpoints on a long battle.
4. Confirm no browser timeout / page-not-responding notification appears during takeover.
5. Verify AI playback begins from the same live positions, HP, ammo, cover damage, civilian state, reinforcement state, and tactical round.
6. Repeat using Classic Playback.
7. During Simulation AI Command, pause in Command Map, issue/revise fire-team orders, resume, and confirm the progressive preparation overlay is used for the rebuild.
8. Finish a long mission and verify normal victory/failure, survivor, casualty, experience, rescue, and Skyranger-return processing.


PREVIOUS BUILD NOTES - 1215
===========================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1215_TACTICAL_AI_PATH_COHERENCE_AND_SINGLE_MOVE_COMMIT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This tactical AI pathing correction addresses player-observed soldier routes that could wander unnecessarily or visibly double back during one AI playback turn.

TACTICAL AI - SINGLE MOVEMENT COMMIT PER SOLDIER / ROUND
---------------------------------------------------------
- Confirmed that `tacticalPath(...)` itself is a breadth-first pathfinder with a visited-cell set; a single path generated by that helper cannot contain a literal loop.
- The visible double-backs were produced one layer above the pathfinder: `processHumanAiTurn` could commit a primary movement plan and then commit a second movement plan during the same soldier turn.
- In ordinary search behavior, a successful main movement could be followed immediately by a fallback patrol because the fallback guard did not check whether movement had already committed.
- In reported/direct-contact behavior, a soldier could move toward the report, acquire a contact, and then immediately start a second movement route toward that new contact in the same round.
- Build 1215 introduces `roundMovementCommittedIds` and `tacticalAiMovementCommitAllowed(...)`.
- Once a human AI soldier has committed a movement route in the current tactical round, later movement-plan attempts for that soldier are rejected until the next round.
- The soldier may still face, fire, reload, react, and otherwise resolve the rest of the action after moving; only a second locomotion route is blocked.
- Fallback patrol movement now explicitly requires that no movement route has already committed.

TACTICAL AI - PATH COHERENCE / DETOUR SCORING
----------------------------------------------
- The prior general human movement scorer rewarded `cell.steps`, meaning a candidate could gain score simply for spending additional movement steps even when those steps produced little progress toward the actual target.
- Build 1215 adds `tacticalAiPathEfficiencyMetrics(...)`.
- Human AI movement scoring now distinguishes productive steps from detour steps:
  - productive movement toward the current target receives a small positive weight;
  - nonproductive excess movement receives a penalty;
  - net progress toward the target remains the strongest movement term.
- This reduces long lateral/winding routes chosen only because they consumed more TU.
- Real obstacle avoidance, hard-cover blocking, occupied cells, formation geometry, fire-team pacing, friendly-traffic deferral, fog search, and player Command Map destinations remain authoritative.
- Alien movement retains its previous step-weight behavior; this patch is targeted at the player-reported AEGIS soldier pathing issue.

PRESERVED BEHAVIOR
------------------
- Dynamic friendly-traffic deferral/re-pathing from 1015 remains active.
- Fire-team leaders still wait for real formation occupancy and pace to the slowest member once formed.
- Living soldiers still cannot finish a completed tactical state on the same hex.
- Movement-trail playback continues showing the actual route used rather than inventing presentation-only shortcuts.
- Manual tactical movement is unchanged and remains exempt from AI formation/path scoring.
- Escort-support stay/break-off behavior is unchanged.
- The 1145 interceptor swarm target-snapshot crash fix remains intact.
- Save format remains 4.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct path-coherence / single-move contract: true.
- Static test scan: 352 `*Test` symbols / 351 declarations; the only unmatched token remains the existing Three.js `depthTest` material property.
- Build Health includes `AI movement commits one coherent route per soldier per round and penalizes nonproductive detours`.
- The human movement simulation contains the round movement-commit guard and the fallback patrol guard.
- Human `tacticalAiMovePlan` scoring contains productive-step reward and detour-step penalty terms.
- Start-screen version derives from the authoritative build ID and displays v0.26.08.07.1215.

MANUAL TEST GATES
-----------------
1. Run several AI-controlled tactical rounds in open terrain and around buildings/cover.
2. Watch individual soldier movement trails and confirm one soldier does not walk one route and then immediately reverse onto a second route in the same round.
3. Observe search/patrol behavior and confirm soldiers generally make visible progress toward their assigned search point instead of taking long lateral paths merely to spend TU.
4. Test friendly soldiers blocking lanes and confirm the existing defer/re-path behavior still allows a cleaner route after the blocker moves.
5. Test fire-team formation/regrouping and confirm support soldiers still reach valid formation cells without stacking on teammates.
6. Test a soldier that acquires an alien contact while moving; the soldier should stop after its committed route, then engage normally rather than starting a second locomotion route in that same round.
7. Switch between 2D Hex and 3D Iso and confirm movement playback remains consistent.


PREVIOUS BUILD NOTES - 1145
===========================
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

