# CODEX HANDOFF — v0.26.09.15.2231_AI_COMMAND_STREAM_HANDOFF_AND_ESCORT_LOCK_RUNTIME_HOTFIX

Browser 2231 is the runtime-integration hotfix following Browser 2121's central Default AI objective authority work. Save format remains 4.

## AI Command handoff failure fixed

The live **AI Command** path was traced end-to-end: `handOffToSimulationAi()` correctly entered `startSimulationAiStream()`, switched the turn to AI, and opened the planning overlay, but the first real `resolveMissionAiStreamBatchAsync(...)` call threw `ReferenceError: tacticalEscortLeaderLockState is not defined`. The handoff catch path then deliberately restored `turn=human`, producing the field symptom of a planning window followed by no AI movement and continued player control.

`tacticalEscortLeaderLockState(...)` is now restored as a real runtime helper using existing fire-team and escort authority. It locks only the current effective fire-team leader when that leader owns living, active civilian/VIP followers. Supports remain governed by Civilian Escort Support, so Engage support can still break off while the leader/Stay/Ask actors retain priority-3 escort authority.

## Regression coverage

`tools/test-ai-command-stream-handoff.cjs` evaluates the actual application runtime and executes a real streamed first AI planning batch. It also continues multiple batches through search/contact transitions and verifies visible/Last Known actors do not retain stale exploration routes. Its two-squad acceptance profile mirrors the supplied North America Alien Abduction Site: Threat 2, Tide Horror, $520k reward, +20 Panic, with Farah included as an AEGIS actor.

The existing Browser 2121 central-objective suite now evaluates the real escort-lock helper rather than masking it with a test-only stub. Final retained local regression/smoke sweep: **34/34 entrypoint files passed**; the focused central/handoff release gate passed **25/25 checks**; Mobile/PWA passed **9/9**.

## Preserve

Keep the Browser 2121 nine-level hierarchy, actor-scoped objective diagnostics/route invalidation, Browser 1426 moving reassembly/leader succession, Browser 1525 nearest-sector/contact pursuit, Beacon/UFO ordering, VIP/civilian escort and extraction, casualty-care phases, tetromino/wall continuity, IndexedDB saves, and the Android/PWA release-beacon launch path. Do not restore Browser 1255 narrow doorway framing.

Field acceptance should still use the supplied Browser 1426 mature campaign save with both squads at North America / Alien Abduction Site / Threat 2 / Tide Horror.

--- Previous handoff ---

# CODEX HANDOFF — v0.26.09.15.2121_DEFAULT_AI_CENTRAL_OBJECTIVE_AUTHORITY_AND_ROUTE_INVALIDATION_PATCH

Browser 2121 is the follow-through audit on Browser 1704's Default AI priority-stack consolidation. Save format remains 4.

## Central objective authority

`tacticalDefaultAiObjectiveDecision(...)` is now the shared strategic resolver for Default AI actor intent. It evaluates the accepted hierarchy numerically:

1. Stabilize a bleeding casualty.
2. Recover/extract a stabilized or downed AEGIS soldier.
3. Continue active civilian/VIP escort duty.
4. Engage visible aliens.
5. Investigate Last Known Contact or distress-reported attacker position.
6. Neutralize a confirmed Alien Field Beacon.
7. Clear an unchecked crashed-UFO bay.
8. Approach/escort a known unassigned VIP or civilian.
9. Search unexplored terrain.

Persistent non-stack player/explicit assignments retain their existing bounded authority below known civilian rescue and above generic search where applicable. Hybrid explicit player movement remains player-owned.

## Browser 1704 leaks corrected

- **Beacon versus Last Known:** the old Beacon engagement-lock branch could force `lastKnownContactPriority=false`. That bypass is removed. Beacon engagement remains resumable persistent state, but Last Known/distress is always priority 5 and therefore wins.
- **Per-team state overwrite:** Browser 1704 resolved state per soldier but wrote the result to every fire-team member. Browser 2121 applies runtime objective state per actor. An escort leader/Stay/Ask support can remain priority 3 while Engage support in the same team resolves priority 4.
- **Stale route authority:** a higher-priority state now clears route scratch belonging to every lower category beneath it. Exploration hunt/patrol data is cleared by any priority 1–8 objective; VIP-approach scratch is cleared by priorities 1–7; local contact-search scratch is cleared by priorities 1–4.
- **Last Known fallback:** an obstructed local Last Known/distress probe no longer calls generic patrol. It holds/retries the reported contact so priority 5 cannot degrade into priority 9.
- **Known civilian assignment:** changing to a known VIP/civilian target clears stale exploration-sector/patrol state immediately while retaining the rescue assignment itself.

## Diagnostics / persistence

Each Default AI actor can now carry optional:
- objective type and numeric priority;
- objective source/reason;
- target entity ID and coordinate;
- objective round/revision;
- previous objective/priority;
- interruption reason/round.

Those fields are included in streamed tactical snapshots. They are optional, so save format remains 4. Priority-1 stabilization and priority-2 casualty responders write the same diagnostics as normal mission objectives.

## Formation, escort and Hybrid boundaries

Browser 1426 post-contact recovery remains a moving formation overlay. It never enters the strategic candidate list and leader succession continues to inherit the recovery latch. Civilian Escort Support remains authoritative: leader always stays; Stay/Ask support remains attached; Engage support may break off for visible contact. Hybrid explicit orders are not silently replaced by Default-AI rescue/search movement.

## Regression / field acceptance

- Behavioral focused regression: `tools/test-default-ai-central-objective-authority.cjs` — 23/23 cases passed.
- Historical focused entrypoint: `tools/test-default-ai-authoritative-priority-stack.cjs` now delegates to the behavioral suite. The retained Browser 1632 global-contact/VIP regression was made successor-build/central-resolver aware and passes 6/6.
- Full retained local Node/smoke sweep from the exact Browser 1704 GitHub Pages artifact: 33/33 entrypoint files passed, including Mobile/PWA and six tactical smoke scripts. Build seam, embedded JavaScript syntax, service-worker syntax and package hashes all pass.
- Field checklist: `DEFAULT_AI_CENTRAL_OBJECTIVE_AUTHORITY_FIELD_ACCEPTANCE.txt`.
- Primary live fixture remains both squads at North America / Alien Abduction Site / Threat 2 / Tide Horror / $520k / +20 Panic, with Farah/Echo watched from deployment through first contact and post-contact continuation.

## Preserve going forward

Do not restore the rejected Browser 1255 narrow doorway framing. Keep tetromino footprint/wall continuity, IndexedDB saves, Beacon forward reform/presentation, VIP/civilian boarding/extraction, Browser 1426 reassembly/leader succession and Browser 1525 local search/contact pursuit intact.

Roadmap-only items remain: real closable/lockable doors and shelter callouts; civilian/VIP casualty assessment/stabilization; AEGIS Operations Overview work as currently recorded; and soldier battle-model face/equipment identity matching.

---

# CODEX HANDOFF — v0.26.09.15.1704_DEFAULT_AI_AUTHORITATIVE_SOLDIER_PRIORITY_STACK_PATCH

Browser 1704 is the deep-dive consolidation of Default AI soldier behavior requested after the supplied two-squad North America Alien Abduction Site exposed competing movement authorities. Save format remains 4.

## Authoritative Default AI objective stack
Default Simulation now resolves soldier/fire-team mission intent against one explicit order:
1. Stabilize a bleeding casualty.
2. Recover/extract a stabilized or downed AEGIS soldier.
3. Continue active civilian/VIP escort duty.
4. Engage visible aliens.
5. Investigate Last Known Contact or a distress-reported attacker position.
6. Neutralize a confirmed Alien Field Beacon.
7. Clear an unchecked crashed-UFO deployment bay.
8. Approach and escort a known unassigned VIP/civilian.
9. Explore for undiscovered aliens/civilians.

Civilian/VIP downed-triage itself is still a recorded future feature; the executable stabilization/recovery slots currently operate on AEGIS casualties because that is the casualty state implemented today.

## What changed in Browser 1704
- Bleeding stabilization is now a true pre-objective pass. A medkit responder may route to a bleeding downed soldier, and that responder is withheld from every lower-priority action for the remainder of the round. Casualty recovery/extraction follows as priority two. Routine non-bleeding medkit healing was found to be an unlisted competing priority and is now opportunistic after the main tactical pass.
- New visible alien contact still truncates stale movement at the first sighting cell, but the contact interrupt now also recalculates escort-support duty immediately: the escort leader stays; Stay/Ask supports remain; Engage supports are released into combat. Remaining free actions replan from the new contact.
- Distress-reported attacker coordinates are folded into Last Known Contact authority instead of competing as a separate search branch.
- Beacon/UFO responsibility is reserved before known-civilian assignment, with Beacon before UFO. A reserved higher-priority source team cannot be stolen by VIP/civilian approach planning.
- Known tracker VIPs and ordinary revealed civilians both qualify for coordinated fire-team assignment. Default Simulation may replace stale autonomous waypoint movement for a known civilian; Hybrid explicit player movement remains player-owned. Generic exploration is blocked while a known civilian/VIP remains unassigned.
- Post-contact reassembly is no longer a mission objective that can hold the leader stationary. The effective leader resumes the highest-priority objective while supports rebuild formation around that moving anchor. The Browser 1426 team-wide recovery latch and bounded unreachable-member fallback remain.
- Emergency planner recovery is priority-aware: visible/Last Known contact continues to receive movement authority, and Beacon/UFO/known-civilian responsibility causes a safe hold rather than an illegal generic patrol fallback.
- FPV/TPV current-order diagnostics now present the same numbered priority stack; formation recovery is labeled as an overlay rather than a higher mission objective.

## Field acceptance
Use `DEFAULT_AI_AUTHORITATIVE_PRIORITY_STACK_FIELD_ACCEPTANCE.txt`. The primary fixture remains the supplied Browser 1426 save and the North America / Threat 2 / Tide Horror Alien Abduction Site with both available squads. Pay particular attention to Farah/Echo, whole-fire-team reaction to first alien contact, known VIP assignment, Civilian Escort Support modes, post-contact moving-leader reform, and fallback behavior.

Focused regression: `tools/test-default-ai-authoritative-priority-stack.cjs`.

## Next roadmap candidates
- Tactical soldier face/equipment identity matching.
- Command Screen → AEGIS Operations Overview.
- Interactive closable/lockable doors, locked-shelter callouts, and civilian/VIP casualty triage remain recorded future systems.

--- Previous handoff ---

# CODEX HANDOFF — v0.26.09.15.1632_DEFAULT_AI_GLOBAL_CONTACT_AND_VIP_PRIORITY_HOTFIX

Browser 1632 corrects the Default AI priority regression exposed by the supplied two-squad North America Alien Abduction Site fixture. The user-defined authority is now explicit: **seen alien contact > active escort commitment / escort-support player choice > known unassigned VIP rescue > ordinary exploration**. Save format remains 4.

## Default AI global contact interruption
- `tacticalAiMovementContactInterruptPlan(...)` walks a planned Default AI movement route cell-by-cell. The first cell that gains personal sight of a previously unknown living alien becomes the hard stop for that route. Stale search/VIP-approach movement beyond the sighting cell is discarded.
- `tacticalAiCivilianPriorityTurn(...)` now promotes newly acquired contact during rescue search/approach to dynamic combat authority immediately. Later unformed rescue/search teams do not continue their old movement in the same planning pass.
- After rescue planning reports live combat, `resolveMission(...)` releases unformed VIP-search/approach duty IDs so those teams can join combat. Established escort leaders remain duty-bound; escort supports stay or break off strictly through `tacticalEscortSupportModeForTeam(...)` and the existing Civilian Escort Support dropdown/prompt.
- Default Simulation clears lower-priority fire-team command movement while live visible combat is active so free teams cannot keep following exploration/command-map waypoints instead of routing to the known alien. Hybrid command remains explicit player authority.

## Known VIP assignment before exploration
- `tacticalVipRescueAssignmentPlan(...)` now enables for a living unresolved tracked VIP even when the generic civilian objective is non-mandatory. Known VIP coordinates therefore receive available fire-team assignments before fallback exploration.
- The initial/fresh Default AI mission pass may invoke tracked-VIP rescue; it is no longer restricted to a continuing simulation state.
- Browser 1525 nearest-sector search remains intact only as the fallback when there is no visible alien combat authority and no applicable unassigned known VIP responsibility.
- Browser 1426 post-contact reassembly remains the transition after combat ends; teams reform before returning to VIP work or fallback search.

## Field acceptance
- Primary fixture: supplied campaign save, both available squads to North America / Threat 2 / Tide Horror / Alien Abduction Site.
- A known tracked VIP should receive a fire-team assignment and that team should visibly route toward the VIP instead of entering generic exploration.
- If a new alien becomes visible during any exploration or VIP-approach route, movement should stop at the first sighting cell and all free teams should switch toward the contact.
- An established escort leader must continue escorting. Support soldiers must honor Civilian Escort Support: Stay = remain attached; Engage = break off; Ask = wait for the player's decision.
- After the contact is resolved, Browser 1426 formation recovery should occur, then remaining VIP assignments resume; only after those responsibilities are exhausted should Browser 1525 deconflicted exploration resume.
- Focused regression: `tools/test-default-ai-global-contact-and-vip-priority.cjs`. Field checklist: `DEFAULT_AI_GLOBAL_CONTACT_AND_VIP_PRIORITY_FIELD_ACCEPTANCE.txt`.

## Next roadmap candidates
- Tactical soldier face/equipment identity matching.
- Command Screen → AEGIS Operations Overview.
- Interactive closable/lockable doors, locked-shelter callouts, and civilian/VIP casualty triage remain recorded future systems.

--- Previous handoff ---

# CODEX HANDOFF — v0.26.09.15.1525_DEFAULT_AI_CONTACT_PURSUIT_AND_LOCAL_SECTOR_SEARCH_HOTFIX

Browser 1525 is a focused Default AI navigation/combat-response hotfix built on Browser 1426. It was prompted by the supplied campaign fixture where both available squads are sent to the North America Alien Abduction Site and Farah Vale, leading Echo Fire Team, can head toward the northwest edge while Default AI soldiers appear reluctant to close on spotted aliens. Save format remains 4.

## Default AI local search / visible-contact pursuit
- `tacticalAiAlienHuntTarget(...)` still partitions unexplored sectors across fire teams to prevent every team from sweeping the same ground, but assigned sectors are now ordered by distance from the team's current authoritative leader instead of raw numeric sector id. A freshly deployed Echo team therefore starts with its nearest assigned sector rather than being dragged toward sector zero / the northwest side of a large map.
- `tacticalAiSpottedAlienApproachPlan(...)` is a bounded live-contact movement bridge. If a personally observed alien is still outside the soldier's preferred ranged engagement band, it reuses `tacticalAiDirectContactPlan(...)` to advance along the direct legal route, then truncates that route as soon as the preferred band is reached.
- Once inside the engagement band, the existing `tacticalAiMovePlan(...)` remains authoritative for cover, standoff, role spacing, formation and line-of-sight choices. This deliberately avoids turning Default AI into reckless point-blank charging.
- The same bounded approach is used when a soldier gains personal contact during the first movement leg and reassesses for an extension move, as well as on later live-combat movement.
- Player/hybrid commands, active formation recovery, Beacon assault logic, Last Known Contact, escort/casualty duties, covered-fire holds and Browser 1426 post-contact reassembly remain higher priority.

## Regression / field acceptance
- Focused regression: `tools/test-default-ai-contact-pursuit-and-local-sector-search.cjs`.
- Primary field fixture: load the supplied Browser 1426 campaign, send Anaconda Squad and Bear Squad to the North America / Threat 2 / Tide Horror Alien Abduction Site, and observe Echo plus the first spotted contacts.
- Farah/Echo should no longer select a remote northwest search sector solely because of sector numbering. Before contact, teams should begin in nearby deconflicted search sectors.
- When a Default AI soldier personally spots an alien outside preferred engagement distance, movement should visibly close toward that contact. Once in ranged engagement distance, cover/standoff movement may again be lateral or stationary.
- Recheck VIP/escort, Beacon, Last Known Contact and post-contact reassembly behavior to ensure the new movement bridge does not outrank those systems.

## Next roadmap candidates
- Tactical soldier face/equipment identity matching.
- Command Screen → AEGIS Operations Overview.
- Interactive closable/lockable building doors, then locked-shelter callouts and civilian/VIP casualty triage remain recorded later roadmap work.

--- Previous handoff ---

# CODEX HANDOFF — v0.26.09.15.1426_POST_CONTACT_FIRE_TEAM_REASSEMBLY_AND_LEADER_SUCCESSION_PATCH

Browser 1316 is the field-tested wall-continuity baseline. Browser 1426 addresses the reported regression where soldiers can disperse during alien contact and then resume unrelated individual movement instead of rebuilding their fire team. Save format remains 4.

## Post-contact fire-team reassembly / leader succession
- Live combat now arms a dedicated `aiPostContactRecoveryRound` latch on every living member of each authoritative fire team. The older `aiPostContactSplitRound`/slot remains leader-only for split-search ownership, so this does not turn supports into independent search authorities.
- Clearing/invalidating Last Known Contact records also arms the team-wide latch before releasing search scratch state.
- `tacticalFireTeamPostContactRecoveryState(...)` reads the team latch after ordinary fire-team reconciliation, so if the former leader dies or is unavailable the newly authoritative leader still owns the regroup.
- While recovery is active, the leader holds and reachable supports route to their formation cells before the team resumes its stored objective. Active combat, Last Known Contact authority and active escort/casualty duties still outrank ordinary regrouping.
- A bounded degraded-cohesion fallback releases the team after three recovery rounds only when every support that still has a legal path is formed and the remaining blocker is genuinely unreachable. Normal formation following remains active afterward so the separated soldier can still catch up.
- Playback snapshots persist the additive recovery round. Save format remains 4; no campaign migration is required.

## Field acceptance
- Let a 3–4 soldier team spread during a fight, end the contact, and verify the leader holds while supports reform before the team resumes Default AI or its persistent VIP/Beacon assignment.
- Repeat with the original fire-team leader killed/downed during the fight; the surviving promoted/acting leader must retain the pending regroup.
- Repeat with one support genuinely unable to route to its slot; after the bounded recovery window the reachable majority should continue while the separated member keeps normal catch-up behavior.
- Verify visible contact, unresolved Last Known Contact, active escort/casualty work and Beacon forward-reform exceptions still outrank ordinary regrouping.

## Next roadmap candidates
- Tactical soldier face/equipment identity matching.
- Command Screen → AEGIS Operations Overview.
- Interactive closable/lockable building doors, then locked-shelter callouts and civilian/VIP casualty triage remain recorded later roadmap work.

--- Previous handoff ---

v0.26.09.15.1316_PROCEDURAL_BUILDING_STAGGERED_TURN_CONNECTOR_HOTFIX_PATCH

Procedural Building Staggered-Turn Connector Hotfix
- Field evidence after Browser 1230 showed the remaining large openings were **not generated doorways**: the affected cells lacked the gray doorway floor marker. Do not restore the rejected Browser 1255 framed-doorway treatment; it narrowed legitimate entrances and addressed the wrong ownership path.
- Root cause: Browser 1050 correctly restricted explicit perimeter seam generation to four-way/cardinal footprint adjacency, but `tacticalThreeExteriorFacadePair(...)` could still label a non-cardinal six-way hex-neighbor pair as an explicit facade pair. Both renderers then filtered that pair out of `tacticalConnectedStructuralWalls(...)`, while the explicit seam pass never owned it. The result was a missing bridge at staggered tetromino steps/turns.
- `tacticalBuildingCardinalAdjacentCells(...)` now gates explicit facade-pair ownership. Cardinal footprint runs continue through the Browser 1230 projection-aware seam path; non-cardinal tactical hex-neighbor pairs keep the established structural connector.
- Door authority is unchanged. True generated doors stay open and retain their gray floor marker; no doorway-frame geometry is added. Collision, pathfinding, LOS, cover, structural HP, targeting and breach authority remain on existing structural covers.
- Shared fallback/persistent renderer contract is covered by `tools/test-procedural-building-wall-continuity.cjs`. Save format remains 4.
- Field checklist: `PROCEDURAL_BUILDING_STAGGERED_TURN_CONNECTOR_FIELD_ACCEPTANCE.txt`.


Roadmap addition — Interactive closable/lockable building doors
- Every authoritative procedural doorway should eventually receive a real full-width door entity while retaining the gray doorway-floor marker; do not reuse the rejected 1255 narrow framing approach or reinterpret non-door wall gaps as doors.
- Shared door state: open/closed/locked/breached/destroyed, with movement, LOS, cover, pathing, visuals and saves consuming the same authority. Soldiers, VIPs, civilians and aliens can operate unlocked doors.
- Hiding VIPs/civilians may close and lock exterior doors. Locked doors must delay alien searches by forcing alternate-entry choice or a time-consuming breach instead of allowing magical traversal. Rescue AI must still be able to gain access without globally auto-unlocking shelters.
- Preserve save format 4 if optional/backward-compatible state can be added safely; older live tactical saves containing open doorway gaps must not have their geometry unexpectedly narrowed or reclassified.

Roadmap addition — Locked-shelter callouts and civilian/VIP casualty triage
- Adjacent AEGIS soldiers should be able to spend TU to call out through a closed/locked authoritative door and ask sheltered VIPs/civilians to unlock/open it. Fear/panic/local threat may cause silence/refusal; retries cost time and AI rescue must not deadlock. No response must not magically reveal whether anyone is inside.
- Some severe civilian/VIP hits should create a short **condition unknown / incapacitated** window instead of instant confirmed death. Unarmored survival odds are deliberately slim but non-zero; obvious overkill remains immediately fatal.
- Adjacent AEGIS can spend time to assess the casualty. If salvageable, one Field Medkit charge can stabilize/save them by reusing existing casualty-care authority. Stabilization preserves life but does not automatically restore normal mobility; save/load and mission reports must distinguish confirmed dead, stabilized survivors and ordinary rescued survivors.
- Preserve save format 4 if this can remain optional/backward-compatible state. This item is designed to build on the interactive locked-door roadmap and the existing Field Medkit / casualty-care system rather than introducing parallel door or medical authorities.

Next roadmap candidate
- **Post-Contact Fire-Team Reassembly and Mission Continuation** remains the next recommended behavior patch after this wall fix is visually accepted.
- After cohesion: tactical soldier face/equipment identity matching, then Command Screen → AEGIS Operations Overview.

--- Previous patch ---

v0.26.09.15.1230_PROCEDURAL_BUILDING_MICRO_GAP_CLOSURE_HOTFIX_PATCH

Procedural Building Micro-Gap Closure Hotfix
- Field follow-up to Browser 1050: broad wall continuity is now much better, but the supplied screenshot still shows a few hairline cracks at intact facade joins.
- Root cause addressed here is geometric rather than structural: staggered hex rows make some cardinal footprint neighbors diagonal in world space, so a fixed assumed facade contribution can leave a tiny uncovered interval depending on whether the endpoint wall is EW or NS.
- `tacticalThreeFacadeProjectedHalfSpan(...)` projects the actual rendered facade half-extents onto the seam vector. `tacticalThreePerimeterSeamInfillScale(...)` fills only the remaining interval plus a controlled 0.12-unit overlap.
- Corner-return presentation gains a modest overlap as well. Doors, window apertures, revealed breaches/destroyed cells and outdoor tetromino recesses remain intentionally open.
- The change is presentation-only and shared by fallback/persistent Three.js. Preserve structural-cover authority, Browser 1050 four-way seam ownership, Browser 0904 tetromino footprints, Browser 0745 IndexedDB saves and save format 4.
- Focused regression remains `tools/test-procedural-building-wall-continuity.cjs`; its new projection-aware case covers the staggered-row micro-gap.


Roadmap addition — Interactive closable/lockable building doors
- Every authoritative procedural doorway should eventually receive a real full-width door entity while retaining the gray doorway-floor marker; do not reuse the rejected 1255 narrow framing approach or reinterpret non-door wall gaps as doors.
- Shared door state: open/closed/locked/breached/destroyed, with movement, LOS, cover, pathing, visuals and saves consuming the same authority. Soldiers, VIPs, civilians and aliens can operate unlocked doors.
- Hiding VIPs/civilians may close and lock exterior doors. Locked doors must delay alien searches by forcing alternate-entry choice or a time-consuming breach instead of allowing magical traversal. Rescue AI must still be able to gain access without globally auto-unlocking shelters.
- Preserve save format 4 if optional/backward-compatible state can be added safely; older live tactical saves containing open doorway gaps must not have their geometry unexpectedly narrowed or reclassified.

Next roadmap candidate
- **Post-Contact Fire-Team Reassembly and Mission Continuation** remains the next recommended behavior patch once this visual follow-up is field accepted.
- After cohesion: tactical soldier face/equipment identity matching, then Command Screen → AEGIS Operations Overview.

--- Previous patch ---

v0.26.09.15.1050_PROCEDURAL_BUILDING_WALL_CONTINUITY_HOTFIX_PATCH

Procedural Building Wall Continuity Hotfix
- Baseline: Browser 0904 tetromino procedural building footprints on save format 4. This patch responds to the field report that the new building shapes can render with disconnected wall pieces / missing connective segments.
- Explicit discovered-building perimeter seams now use the same four-way/cardinal adjacency as the authoritative procedural footprint. Do not revert this to the generic six-way tactical neighbor graph: hex-only diagonals can bridge across an outdoor tetromino recess.
- Intact wall cells at a facade turn now receive a full-height perpendicular presentation return. The established facade mesh supplies the first face; the return supplies the second face, preventing convex/turn cells from collapsing visually into pillar-like wall fragments.
- Corner returns are presentation-only and require a revealed, living `buildingPart: wall` record. Doors, window apertures, revealed breaches/destroyed cells and outdoor tetromino recesses remain open. Gameplay collision/pathfinding, hard cover, structural HP, LOS, targeting and breach traversal continue to use structural-cover authority.
- Both fallback and persistent Three.js renderers call the same perimeter-seam and corner-return helpers and expose diagnostic counts. Preserve the Browser 0904 I/O/T/L/J/S/Z footprint authority, legacy rectangular in-progress tactical-save compatibility, Browser 0745 IndexedDB durable saves, and save format 4.
- Focused regression: `tools/test-procedural-building-wall-continuity.cjs`. Field checklist: `PROCEDURAL_BUILDING_WALL_CONTINUITY_FIELD_ACCEPTANCE.txt`.


Roadmap addition — Interactive closable/lockable building doors
- Every authoritative procedural doorway should eventually receive a real full-width door entity while retaining the gray doorway-floor marker; do not reuse the rejected 1255 narrow framing approach or reinterpret non-door wall gaps as doors.
- Shared door state: open/closed/locked/breached/destroyed, with movement, LOS, cover, pathing, visuals and saves consuming the same authority. Soldiers, VIPs, civilians and aliens can operate unlocked doors.
- Hiding VIPs/civilians may close and lock exterior doors. Locked doors must delay alien searches by forcing alternate-entry choice or a time-consuming breach instead of allowing magical traversal. Rescue AI must still be able to gain access without globally auto-unlocking shelters.
- Preserve save format 4 if optional/backward-compatible state can be added safely; older live tactical saves containing open doorway gaps must not have their geometry unexpectedly narrowed or reclassified.

Next roadmap candidate
- **Post-Contact Fire-Team Reassembly and Mission Continuation** is the next recommended behavior patch. Once immediate contact ends, surviving reachable team members should reform around the authoritative leader and resume their persistent objective without deadlocking on unavailable members.
- After cohesion: tactical soldier face/equipment identity matching, then the dedicated Command Screen → AEGIS Operations Overview dashboard work.

--- Previous patch ---

v0.26.09.15.0904_TETROMINO_PROCEDURAL_BUILDING_FOOTPRINTS_PATCH

Tetromino Procedural Building Footprints
- Procedural structures now support I/O/T/L/J/S/Z footprint families and deterministic rotations within the existing archetype bounds.
- Shared footprint authority drives interior/perimeter classification, doors, walls/windows, furnishings, roofs, perimeter seams, civilian placement, structure-distance checks and AI building egress. Concave recesses remain outside/traversable.
- Pre-patch live tactical saves are detected by legacy structural covers lacking shape metadata and retain rectangular plan authority for that already-started battle. New saves carry building shape metadata in structural covers.
- New focused regression file: tools/test-tetromino-building-footprints.cjs. Field checklist: PROCEDURAL_BUILDING_TETROMINO_FOOTPRINTS_FIELD_ACCEPTANCE.txt.
- Save format remains 4. IndexedDB durable save storage from Browser 0745 remains in place.


Roadmap addition — Interactive closable/lockable building doors
- Every authoritative procedural doorway should eventually receive a real full-width door entity while retaining the gray doorway-floor marker; do not reuse the rejected 1255 narrow framing approach or reinterpret non-door wall gaps as doors.
- Shared door state: open/closed/locked/breached/destroyed, with movement, LOS, cover, pathing, visuals and saves consuming the same authority. Soldiers, VIPs, civilians and aliens can operate unlocked doors.
- Hiding VIPs/civilians may close and lock exterior doors. Locked doors must delay alien searches by forcing alternate-entry choice or a time-consuming breach instead of allowing magical traversal. Rescue AI must still be able to gain access without globally auto-unlocking shelters.
- Preserve save format 4 if optional/backward-compatible state can be added safely; older live tactical saves containing open doorway gaps must not have their geometry unexpectedly narrowed or reclassified.

Next roadmap candidate
- **New field regression to investigate first:** connective wall/seam segments appear to have stopped generating consistently again, leaving intact procedural facades reading as disconnected wall pieces. Audit the 0137/1855/1410/1448/1532/1610 continuity chain against Browser 0904 tetromino footprint authority in both Three.js render paths; preserve doors, revealed breaches, windows and concave footprint recesses. Full acceptance criteria are in the canonical roadmap section **Procedural Building Connective Wall Segment Regression Investigation**.
- Match tactical battle-model faces/equipment markings to soldier identity after any wall-continuity regression is resolved.
- Command Screen AEGIS Operations Overview remains recorded as a later dedicated UI/dashboard patch.

--- Previous patch ---

v0.26.09.15.0745_INDEXEDDB_SAVE_STORAGE_HOTFIX

Durable IndexedDB Save Storage Hotfix
- A mature Month 3 / Day 18 campaign export from Browser 1351 is about 1.35 MB pretty-printed / 894 KB minified. Storing repeated full-campaign snapshots across ten manual slots plus rotating autosaves in localStorage can exhaust the browser origin quota and produce the observed “Browser storage rejected the save” failure.
- IndexedDB is now the primary storage authority for manual save collections and rotating autosaves. Existing localStorage collections migrate lazily; successful IndexedDB writes reclaim the superseded large localStorage key.
- Save, delete, save-slot-backup import, autosave, post-mission reboot checkpoint and startup resume use the durable backend. localStorage remains a compatibility fallback, and the emergency JSON download remains the last-resort manual-save recovery path.
- Existing exported JSON files remain import-compatible. Save format remains 4.

--- Previous patch ---

v0.26.09.14.2320_TACTICAL_CIVIC_LANDMARK_1_TO_7_HEX_FOOTPRINT_PATCH

Tactical Civic Landmark 1–7 Hex Footprints
- Statues and fountains use deterministic connected 1–7 hex footprints with shared placement, collision/pathfinding, hard-cover, visibility and selection authority.
- 3D landmark presentation is centered/scaled to the authoritative footprint; footprint cells and scale survive save/reload.
- Placement protects roads, ingress, neighboring structures, props and Skyranger extraction space. Save format remains 4.

--- Previous patch ---

v0.26.09.14.1351_LAYERED_BUS_AND_SCHOOL_BUS_COLORS_PATCH

Layered Bus Body and School-Bus Colors
- Keep the original lower bus body, wheels, headlights and ground footprint.
- Full-width/full-length glass is twice its former height, topped with a matching metal roof as thick as the old glass section.
- A deterministic mix of yellow school-bus and blue city-bus metal colors survives reload. Both renderers use the shared vehicle builder.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.1149_INTERSECTION_TRAFFIC_CONTROLS_PATCH

Intersection Traffic Controls
- New street maps detect crossings and T-junctions from connected road/lane/path cells, consolidating wide junctions into one location.
- Place complete, consistently oriented traffic-light or stop-sign arrangements on available roadside approaches. Reserve controls before other props and avoid buildings and protected entrances.
- Skip junctions without enough safe space or prop budget; remove scattered mid-road controls. Entrance cleanup never relocates a control away from its junction. Existing saved prop placements are retained.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.1112_BATTLE_VISIBILITY_REUSE_PERFORMANCE_PATCH

Battle Visibility Reuse Performance
- Reuse the last unchanged shared visibility result instead of repeating every soldier sight scan during battle updates. Cache misses run the existing interior-map calculation unchanged.
- Value snapshots detect in-place movement, facing, flashlight, observer eligibility, lighting, smoke, power, wall and vehicle footprint changes. One bounded snapshot is retained; returned Sets are detached.
- Browser fixture with 48 soldiers and 177 covers: repeated checks improved from 26.6–44.7 ms to 0.3–0.4 ms with identical visible cells. This measures visibility work, not total frame time or hardware-specific FPS.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.0955_SOLID_BUILDING_WALL_VISIBILITY_PATCH

Solid Building Wall Visibility
- Standing beside a solid building wall or partition no longer grants sight through it, for observers or targets on either side. Shared sight checks apply to all teams.
- Windows, existing open doorway gaps and breached structures allow aligned sight; a nearby opening does not bypass another wall. Breach rubble no longer blocks longer sightlines.
- Solid wall faces remain discoverable and ordinary cover keeps its existing adjacency behavior. Structural state changes invalidate visibility caches.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.0717_VIP_CAMERA_DIRECTION_MARKERS_PATCH

VIP Camera Direction Markers
- FPV/TPV VIP indicators only appear inside the active camera view. Behind-camera, near/far-clipped and off-screen perspective markers are hidden instead of mirrored or clamped ahead.
- Turning or switching cameras restores visible markers immediately, using camera orientation independently of soldier facing. Isometric edge guidance is retained.
- Yellow awaiting-rescue and cyan ESCORTING presentation continue to use displayed escort state. Save format remains 4.
- Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.2259_VIP_ESCORT_STATUS_MARKERS_PATCH

VIP Escort Status Markers
- Awaiting-rescue VIPs remain gold/yellow; active escorted VIPs use cyan with ESCORTING text and accessible status labels.
- Panic or escort loss/incapacitation restores yellow. Assignment alone does not change status, and dead/extracted VIP trackers disappear.
- Shared state covers 2D, both 3D renderers and perspective/minimap markers; stationary changes refresh cached presentation.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1807_VEHICLE_BODY_FOOTPRINT_AND_PLAYBACK_PATH_INTEGRITY_PATCH

Vehicle Body Footprints + Playback Path Integrity
Validation: 69 Node tests and six smoke scripts pass; final browser diagnostics 897/967 match baseline with no new failures. Updated obsolete elimination-only assertions to respect existing incomplete-operation and casualty authority.
- Rotated land-vehicle bodies and shoulder clearance now drive the shared blocked footprint. New placement reserves it; saved vehicles preserve their visual anchor.
- Sparse playback trails rebuild through adjacent legal cells rather than jumping through obstacles. Destroyed vehicles retain existing traversability.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1726_VITALS_SELECTION_AND_ITEMIZED_MISSION_REPORTS_PATCH

Vitals Selection + Itemized Mission Reports
- Select living field soldiers from vitals in Manual; Hybrid uses the leader, downed cards inspect, Simulation remains read-only. Selected cards have a visible outline.
- New mission reports have grouped itemized results; older reports show itemized archived summaries. Logs and timelines remain intact.
- Save format 4 is unchanged. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1249_MOBILE_ADAPTIVE_MISSION_FAILURE_NOTICE_PATCH

Mobile / Adaptive Mission Failure Notice
- Victory/failure notices layer above vitals. Opening Base preserves a paused clock instead of starting 5-minute time passage.
- Shows Mission Failed for a terminal missed VIP quota even with surviving soldiers, with an explanation and End Failed Incident and Return to Base.
- Completed AI/Hybrid failures use the existing final result; manual failures use live finalization. Pending playback and interrupted streams cannot trigger premature failure notices.
- VIP quota rebalancing is roadmap-only. Save format remains 4.
- Publish index.html, service-worker.js and release-metadata.json together with the existing assets.

--- Previous patch ---

# CODEX HANDOFF — v0.26.09.13.1209_FIRE_TEAM_VITALS_REASSIGNMENT_AND_VEHICLE_HEADLIGHT_ALIGNMENT_PATCH

Vitals follow survivors absorbed into another team without losing casualty cards. Land-vehicle headlamps and forward beams align with the narrow front face in both 3D renderers.

- Living soldiers who change fire teams receive a unique slot in the receiving vitals panel; unchanged teammates keep their slots and fallen soldiers stay in their former panel.
- Panels remain alphabetical. Extra casualty cards use additional grid rows instead of hiding members beyond four. Reconciled slots persist with tactical snapshots.
- Cars, vans, utility vehicles and buses share their detailed model and headlamp geometry across persistent and fallback renderers.
- Headlamps sit on the short front face along local +X; forward spotlights use the same group rotation. Daytime/unpowered lenses remain attached but do not emit light.
- Existing tactical illumination, footprints, casualty-impact display timing and save format 4 are preserved.

Authority: tacticalPhysioCaptureFormation updates live transfer membership and reserves valid existing slots before allocating arrivals. tacticalReconcileFireTeams captures formation again after reassignment. KIA cards retain former membership. The HUD renders all members and additional grid rows.

Vehicle rendering: tacticalThreeAddLandVehicle shares the existing body dimensions; tacticalVehicleHeadlightLayout owns lamp/front/beam anchors. Positive local X is forward. tacticalThreeAddVehicleHeadlightBeam targets forward within the same rotated group; persistent rendering retains its existing light budget. Gameplay light profiles and LOS remain unchanged.

Field gates: absorb a singleton; save/reload; check casualty-filled receiving panels and alphabetical order; confirm impact holds still release correctly. Inspect each vehicle type at multiple rotations by day/night in both renderers. Check Mobile panels with additional casualty rows.

---

# CODEX HANDOFF — v0.26.09.12.2346_TACTICAL_CASUALTY_CARE_PHASE_3C_MEDICAL_RESUPPLY_AND_IMPACT_SYNCHRONIZED_VITALS_PATCH

Medical charges now persist between missions and refill from local stores. Fire-team vitals reveal injuries after the attack impact rather than at frame hydration.

- Remaining charges and reusable kit ownership survive mission return, save/load, tactical transfers and empty kits. Legacy issued kits retain their existing 4/10-charge allocation.
- A purchased Medkit includes four charges. Medical Supplies cost 10k per charge; Medics can refill to ten and other soldiers to four. Returning a kit stores its empty shell and unused charges separately; reissue does not create charges.
- Refill Medkit controls in Quartermaster and personnel/Sickbay loadouts consume only the soldier's local Medical Supplies. Soldiers committed to a sortie or transfer cannot alter their medical loadout.
- Victory salvages fallen soldiers' actual remaining charges and kit shells; failed extractions do not return medical supplies. Tactical kit transfers preserve ownership.
- Soldier cards and launch summaries display persistent charge availability and empty-kit warnings.
- Vitals hold pre-hit health and medical state during observed attacks, then update after projectile impact and its reaction hold. Playback cancellation clears display holds; gameplay authority remains unchanged.
- Save format remains 4; permanent injuries, advanced formulations and encumbrance remain deferred.

Authority: soldier.medicalCharges stores campaign charges; tactical medicalKitOwned tracks shell transfers independently of charges. Final medical outcomes feed growth.medkitOwned and the shared campaign aftermath. Refill/return use local inventories. Medkit is a four-charge retail pack; Empty Medkit is a reusable shell; Medical Supplies are individual charges.

Vitals: applyAiFrameToMap holds injured human snapshots before hydrating observed shot results. showShotEvent/playAiPlaybackFrame release those display snapshots after travel plus impact hold. cancelAiPlaybackTimers clears holds; unmount cancels their timers. Do not delay authoritative units or change shot outcomes for HUD timing.

Field gates: repeat kit issue/refill/return at two bases; save an empty kit; transfer a kit during battle; win/withdraw with a fallen kit owner; verify remaining supplies after the post-mission reboot. Watch a nonfatal hit, downing and KIA at slow/normal/fast playback and in Manual/Hybrid; vitals must change after impact. Check Mobile refill controls and stable alphabetical vitals. Native parity remains deferred.

---

# CODEX HANDOFF — v0.26.09.12.2122_TACTICAL_CASUALTY_CARE_PHASE_3B_SICKBAY_RECOVERY_AND_RESCUE_OUTCOMES_PATCH

Phase 3B adds persistent medical histories, return-to-duty estimates, fractional recovery credit and explicit medical debriefs. Includes the prior stable-slot and alphabetical vitals fixes. Save format remains 4. Native parity remains deferred in the manifest.

## Medical record authority

- tacticalApplyCasualtyExtractionAftermath creates medicalRecords from the authoritative final battlefield after recovery/KIA reconciliation. Each record retains mission and soldier IDs, final HP, outcome, stabilization, rescuer, craft and round metadata.
- campaignRecordMissionMedical attaches each record once per mission/soldier during the shared campaign aftermath map, before friendship processing and the existing post-mission save/reboot. Reapplying a record does not restart care.
- Outcomes: evacuated, recovered-after-victory, wounded-returned, unrecovered, kia. Records are retained on the soldier, including after return to duty or death.
- addMissionReport retains structured records; buildMissionReportEntries appends medical summaries after terminal log trimming.

## Recovery authority

- recoveryDaysRemaining stores full-speed care days, including fractional Barracks credit. Sickbay spends 1/day; Barracks spends 0.5/day.
- soldierRecoverySummary derives remaining calendar days at the current care speed and progress from that same countdown. Bed transfers retain credit. Old saves fall back to woundDays(status).
- recoverSoldierOneDay owns healing, countdown and completion. At zero it marks the active medical record completed, records actual care days, and uses the existing Ready/auto-squad-return path.
- SoldierMedicalHistory renders in SoldierCard for both layouts. Mobile Sickbay list uses calendar-day ETA.

## Field acceptance

1. Stabilize and evacuate one casualty; win with another living casualty still in the field. Verify distinct report outcomes and rescue details in each soldier's history.
2. Withdraw with one evacuated casualty and one casualty left behind. Verify the first survives and the second remains KIA in report, roster and reload.
3. Move a patient between Sickbay and Barracks after a day of care. Verify changed ETA, retained fractional progress, and save/reload consistency.
4. Finish recovery. Verify Ready status, existing squad-return behavior and completed medical history.
5. Inspect Standard and Mobile Sickbay history, progress and ETA. Recheck stable, alphabetical vitals after leader death.

---

# CODEX HANDOFF — v0.26.09.12.1403_TACTICAL_CASUALTY_CARE_PHASE_3A_EXTRACTION_AND_FIRE_TEAM_PHYSIOLOGICAL_HUD_PATCH

Browser 1300 is the release baseline. Browser 1403 implements Tactical Casualty Care Phase 3A: authoritative Skyranger recovery, recovered-versus-abandoned mission aftermath, and the roadmap fire-team physiological HUD with a Mobile Adaptive show/hide button. Save format remains 4.

## Extraction and aftermath authority

- `tacticalExtractDraggedCasualtyAtSkyranger(...)` is the boarding authority. The conscious rescuer must occupy a player Skyranger's first ramp cell, retain a valid adjacent drag link, and carry a living downed casualty.
- A completed extraction sets `casualtyExtracted`, `casualtyRecovered`, `rescued`, rescuer/craft/round metadata, stops active bleeding, clears both drag fields, and removes the casualty from render/path occupancy.
- Manual ramp-side attachment and manual drag movement both call the same helper. `tacticalAiCasualtyExtractionStep(...)` uses the existing attach/per-hex TU costs and hazard-aware route authority; it does not inspect hidden alien positions.
- `tacticalApplyCasualtyExtractionAftermath(...)` owns final recovery. Victory recovers living downed soldiers. Defeat/withdrawal saves physically extracted casualties and records unextracted downed personnel as KIA/unrecovered.
- `finishTacticalMission(...)` receives the final battlefield units. Terminal Simulation/Hybrid playback commits the last frame before aftermath; `resolveMission(...)` applies the same outcome to Classic/direct simulation.

## Physiological HUD

- `TacticalFireTeamPhysiologicalHud` groups all AEGIS soldiers by fire team and arranges up to four members in the roadmap diamond.
- Trace color derives from authoritative HP/incapacity. Trace duration derives from fear pressure/state, and KIA is a flatline. Status text includes medical, fear, extraction, and death states.
- Standard layout keeps the bottom-edge monitor visible. Mobile Adaptive uses the left-rail `Team Vitals` / `Hide Vitals` button; `mobilePhysioHudOpen` persists in the live mission cache.

## Preserve

- Save format 4 and optional-field loading.
- Browser 1300 terminal Hybrid precedence/final-frame commit.
- Phase 1/2 downing, bleeding, stabilization, Field Medkit, and triage rules.
- Existing Beacon, mobile, PWA, building, vehicle, horizon, and renderer authority.
- One active `finishAiPlayback()` definition and one mutable current patch-history record.

## Field gates

1. Extract a downed casualty by dragging onto the Skyranger ramp, then repeat by attaching while already standing on the ramp.
2. Withdraw with one extracted and one unextracted downed casualty; verify the former survives and the latter is KIA/unrecovered.
3. Win with a living unextracted downed soldier and verify recovery.
4. Observe AI extraction TU spending and confirm panic/hidden information constraints.
5. Inspect all health/fear/medical trace states in Standard and Mobile Adaptive; close/reopen Team Vitals and restore the live mission.
6. Repeat Browser 1300 terminal Hybrid, Phase 1/2 casualty, PWA update/cold-start, and representative tactical presentation gates.

---

# Previous handoff — v0.26.09.12.1300_BUILD_AUDIT_AND_TERMINAL_PLAYBACK_INTEGRITY_PATCH

Browser 1226 is the gameplay baseline. Browser 1300 audits the patches added since Browser 1058, fixes terminal Hybrid completion, aligns fallback 3D land-vehicle placement with footprint authority, repairs generic checks, and removes merged one-use patch-delivery files. Save format remains 4.

## Fixed authority boundaries

- `finishAiPlayback()` must evaluate a terminal Hybrid result before consuming `hybridContinuation`. A successful final frame is reconciled through `tacticalCommittedPlaybackFrameUnits(...)` and `tacticalTerminalVictoryResultFromCommittedBattlefield(...)` for both Simulation and Hybrid playback.
- Completion must continue to wait while the playback sequencer owns pending presentation actions. Interrupted, pending, and operation-incomplete streams must not finalize.
- `tacticalThreeCoverWorldAnchor(...)` owns the center of multi-hex land-vehicle presentation in both fallback and persistent Three.js renderers. `tacticalThreeBuildingPresentationCoverShouldRender(...)` owns footprint-cell visibility.
- `check-aegis-build.cjs` locates actual patch-history mutation statements; quoted contract-test strings are not mutations.

## Repository layout

- Keep `src/browser-runtime.html` as canonical game source and generate `index.html`, `service-worker.js`, and `release-metadata.json` with `node tools/package-runtime-shell.cjs`.
- Keep `src/manifest.json`, this handoff, `README_PATCH_NOTES.txt`, `VALIDATION_SUMMARY.txt`, the canonical Game Bible, PWA documentation, stable test/smoke tools, and field-acceptance plans.
- One-use `APPLY_*` wrappers, `manifest.*.merge.json` fragments, `tools/apply-*` updaters, upload lists, per-patch checker snapshots, superseded handoffs, and duplicate Game Bible snapshots were removed after merge. Retrieve an old copy from Git history if needed for archaeology.

## Field gates

1. Finish a Hybrid mission whose playback still contains a continuation snapshot; it must open the terminal report without returning to another player round.
2. Confirm survivor/KIA/civilian counts in that report match the final playback frame.
3. Spot-check a bus or other multi-hex road vehicle in the fallback 3D renderer for centered placement and footprint-cell reveal.
4. Repeat the existing Casualty Care Phase 2 bleeding/stabilization/triage field acceptance and one installed-PWA cold launch.

---

# Previous handoff — v0.26.09.12.1226_TACTICAL_CASUALTY_CARE_PHASE_2_BLEEDING_STABILIZATION_AND_TRIAGE_PATCH

Browser 2248 is the gameplay baseline. Browser 1226 adds Tactical Casualty Care Phase 2: bleeding/deterioration, stabilization, targeted adjacent first aid, multi-charge Field Medkits, and bounded shared AI triage. Save format remains 4.

## Medical state authority
- Recoverable Phase 1 downings now set `bleeding:true`, `stabilized:false`, `bleedOutRounds:3`, and `bleedLastProcessedRound` to the downing round. Catastrophic KIA clears those fields.
- `tacticalCasualtyDeteriorationStep(units, round)` is the once-per-round bleed authority. Preserve the `bleedLastProcessedRound` guard; Manual/Hybrid/Simulation paths may touch the same round. Expiration becomes authoritative KIA.
- Stabilization stops bleeding but does **not** revive the casualty. A stabilized soldier remains alive, downed/unconscious/prone and non-combat-active.

## Field Medkit authority
- `tacticalFieldMedkitCapacity(...)`: ordinary issued kit = 4 tactical charges; Medic specialization = 10. `tacticalInitialMedkitCharges(...)` initializes new deployments and respects restored/continuing tactical charge state.
- Self-treatment remains 12 TU / up to 12 HP / 1 charge.
- `tacticalFirstAidUseResult(...)` owns adjacent treatment: conscious wounded teammate = 14 TU / up to 10 HP / 1 charge; bleeding downed casualty = stabilization for 16 TU / 1 charge.
- Do not convert tactical charges into strategic inventory consumption in this phase. The issued Field Medkit is reusable equipment; strategic resupply/economics are Phase 3.

## AI triage
- `tacticalMedicalPriorityTarget(...)` and `tacticalAiMedicalTriageStep(...)` share the same treatment rules as Manual play. Urgent bleeding casualties rank first and an adjacent Medic is preferred where possible.
- The existing Phase 1 visibility-safe emergency drag remains separate. Do not introduce hidden alien coordinates as a medical trigger.

## Round / visibility invariants
- Downed/unconscious soldiers must remain `tu:0` during human-round refresh.
- Downed/unconscious soldiers provide neither live tactical LOS nor Simulation-playback visibility reconstruction.
- `resolveMission(...)` intentionally differs from Browser 2248 because Phase 2 applies casualty deterioration and AI medical triage.
- `tacticalMissionTerminalState(...)` should remain the Browser 2248 Phase 1 authority: living vs. combat-active vs. downed humans, with all-down resolving defeat.

## Snapshot/save
Optional tactical fields now include `bleeding`, `stabilized`, `bleedOutRounds`, `bleedLastProcessedRound`, `stabilizedById`, `stabilizedRound`, and `medkitCharges`. Save format stays **4**.

## Preserve byte-for-byte unless explicitly targeted
- `tacticalAlienReinforcementArrival(...)`
- `tacticalBuildingPlans(...)`
- `tacticalBuildingCovers(...)`
- `makeBattlefield(...)`
- `tacticalAiMissionResolution(...)`
- `tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(...)`
- `tacticalThreePersistentCreateAlienTransitMaterializationEffect(...)`
- Browser 1800 `release-beacon-navigation-v2` / `aegis-launch-shell-v2` PWA architecture
- Browser 1740 Mobile Tactical Status HUD collapse/expand
- Browser 1610 building perimeter seams
- Browser 1254 horizon treatment
- exactly one `finishAiPlayback()` definition

## Field gates
1. Bleeding casualty counts 3 -> 2 -> 1 -> KIA exactly once per round when untreated.
2. Stabilization spends 16 TU/1 charge, stops deterioration, and does not revive.
3. Adjacent teammate treatment spends 14 TU/1 charge and heals <=10; self treatment spends 12 TU/1 charge and heals <=12.
4. Ordinary Field Medkit starts 4 charges; Medic kit starts 10.
5. AI prioritizes urgent bleeding casualty and prefers adjacent Medic.
6. Save/reload active bleeding/stabilized cases with no reset/double tick.
7. Regress Phase 1 dragging/all-down, Beacon effects, PWA, Mobile HUD, building seams, save format 4.
## Roadmap intake — September 15, 2026: Post-contact fire-team cohesion

- Planned only: after an alien firefight ends, autonomous soldiers should rebuild their assigned fire-team formation around the leader before resuming the team's authoritative objective instead of peeling off as independent agents.
- Recovery must be bounded and may not deadlock on a downed, dead, extracted or unreachable member. Preserve Beacon Assault forward-reform, VIP/casualty exceptions, persistent player assignments and save format 4.
- See the canonical roadmap/game bible section **Post-Contact Fire-Team Reassembly and Mission Continuation** for full acceptance criteria.

