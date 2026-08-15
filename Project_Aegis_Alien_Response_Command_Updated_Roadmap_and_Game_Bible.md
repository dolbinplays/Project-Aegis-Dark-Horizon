# PROJECT AEGIS / ALIEN RESPONSE COMMAND
## Codex Handoff: Updated Full Roadmap + Game Bible

Last updated: 2026-08-14
Current handoff build: `v0.26.08.14.1728_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_INDEX_ONLY_PATCH`
Native vertical slice: `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`
Current patch status: **Browser 1728 preserves Hybrid AI Command when an escort-contact assignment prompt interrupts its one-round support playback. Stay-on-escort and break-off choices now rebuild only the remaining bounded hybrid support action, retain player control of fire-team leads, and return to the next leader-command phase instead of starting full Simulation AI. Browser 1712's UFO Interception Board and full-TU formation catch-up remain active with the earlier shared 2D/Three.js hybrid controls, ordered playback, rescue, beacon, extraction, audio, window-ballistics, and crashed-UFO systems. Save format remains 4; native Godot remains at 0026 and requires parity work.**



---

# v0.26.08.14.1728 - Hybrid Escort Prompt Mode Preservation

Browser build `v0.26.08.14.1728_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Hybrid escort-contact decision doctrine

- The alien-contact escort assignment board may interrupt either a full Simulation AI stream or the bounded support playback of Hybrid AI Command. Its continuation must preserve the control mode that raised it.
- `Stay on Escort` keeps that fire team's supports protecting the civilian/VIP column. `Break Off and Engage` temporarily releases its supports to the visible fight while the lead keeps the escort moving. Applying either selection changes duty assignments only; it cannot silently transfer strategic control of the mission.
- During Hybrid AI, the pre-decision playback plan is stale because it was calculated before the player's assignments. Applying the decision therefore rebuilds a single bounded support-and-engagement round from the live displayed battlefield, with fire-team leads held at their player-selected positions.
- The replacement playback remains marked as a hybrid round, uses the normal formation, flank, TU-reserve, targeting, escort, extraction, and sequential-animation systems, and returns to a living fire-team lead with refreshed TU when complete.
- A full Simulation AI prompt continues its full-AI stream because that was the mode the player had already selected. The continuation mode is derived from the interrupted playback's hybrid marker, including when an escort prompt was restored from cached tactical state.
- Failure to prepare the replacement hybrid round returns the current battlefield to player-controlled Hybrid AI leader command. It must never fall through to a full mission simulation.

## Validation and native roadmap

- Build Health checks explicit hybrid prompt state, hybrid playback fallback detection, normal Simulation AI continuation, the dedicated hybrid restart path, and the retained one-round hybrid marker.
- Release validation requires the new patch flag, continuation-mode helper, bounded `maxRoundsOverride:1` simulation, hybrid completion route, and unchanged save format 4.
- Port mode-preserving escort decisions to Godot when native hybrid command is implemented; the prompt response must replan only the native bounded support phase and return leader control.

---

# v0.26.08.14.1712 - UFO Interception Board and Hybrid Support Catch-Up

Browser build `v0.26.08.14.1712_UFO_INTERCEPTION_BOARD_AND_HYBRID_SUPPORT_CATCH_UP_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Geoscape UFO-interception interface doctrine

- `Active UFOs (count)` is a peer of `Open Incident List`: selecting it opens a centered command panel rather than expanding content at the bottom of the Geoscape page.
- The UFO Interception Board has a fixed heading and close action with an independently scrollable contact body bounded to the viewport. A large contact count must never require scrolling past the globe, tracking summary, or other Geoscape sections merely to reach the list.
- Every radar-visible contact retains its size or unresolved-echo identity, region, flight progress, radar-contact quality, threat, estimated mission risk, interceptor sortie readiness, last air-combat result, and remembered damage state.
- `1 Interceptor`, `Pair`, and `All Bases` remain the authoritative launch actions. Detection, readiness, active-flight exclusion, fuel, range, staging, ferry-network reach, permanent home-base ownership, and return-route checks remain unchanged.
- Opening and closing the board changes presentation state only. It cannot pause or alter UFO travel, change detection, create a track, spend resources, advance time, or modify campaign saves.

## Hybrid support catch-up doctrine

- After the player moves a fire-team lead, each out-of-contact hybrid support compares the exact formation-cell distance with its movement capacity after the AI's selected shot reserve.
- When the support could move farther with its current TU and the reserve alone would leave it short of the formation cell, the AI may select `Formation Catch-Up`: movement reserve becomes zero for that handoff and the soldier spends up to the full adaptive movement allowance toward the direct formation route.
- Catch-up is bounded by actual TU at four TU per hex, the fifteen-step adaptive ceiling, hard terrain, occupied cells, path-search limits, and the standard leader-relative formation destination. It grants no free movement and cannot place multiple living units on one hex.
- The movement continues through the established initial checkpoint and extension sequence, preserving one coherent displayed route and post-move reassessment rather than adding another visible movement phase.
- An observed alien cancels formation catch-up reserve release. In contact, enemy-relative aggressive flanking and the normal reserve, shooting, range, LOS, cover, cohesion, escort, and extraction rules remain authoritative.

## Validation and native roadmap

- Geoscape regression requires a centered dialog, bounded viewport height, independent vertical scroll region, radar-contact data, close action, and the existing one, pair, and all-base launch choices.
- Tactical regression demonstrates a distant support with 60 TU and a 28-TU reserve moving eight steps normally but fifteen steps under no-contact catch-up, while the same soldier preserves the reserve when an alien is supplied as the combat target.
- Port the modal contact-board presentation and catch-up reserve decision to Godot while reusing native radar, interception, formation, TU, occupancy, and action-playback systems.

---

# v0.26.08.14.1347 - Hybrid Aggressive Flanking and Support Movement Fix

Browser build `v0.26.08.14.1347_HYBRID_AGGRESSIVE_FLANKING_AND_SUPPORT_MOVEMENT_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Hybrid support movement doctrine

- Supporting soldiers must move during a hybrid AI handoff whenever they have TU available after their chosen reserve and a legal route exists to a materially better formation or combat position.
- A formation destination is a friendly navigation goal, not a hostile contact. It must be handled by a direct route toward the exact open role cell produced by the authoritative fire-team formation system.
- If the exact formation cell is temporarily unreachable, the support chooses the reachable cell that makes the greatest safe progress toward it. A general combat-position score may not convert an ordinary formation-follow request into an unexplained hold.
- Movement continues to respect impassable terrain, occupied cells, the AI-selected TU reserve, bounded search limits, escort and extraction priorities, and the six-hex fire-team cohesion requirement.

## Aggressive contact flanking doctrine

- Once a fire team has an actually observed living alien, supporting soldiers use that alien as the combat reference. A legal preferred target established by the lead has priority; otherwise the nearest observed alien is used.
- The flank axis runs from the fire-team lead to the observed alien. A soldier assigned the left role seeks the left side of that axis and a soldier assigned the right role seeks the right side, producing distinct enemy-relative angles rather than merely copying static map offsets.
- Candidate flank cells favor current line of sight, legal weapon distance, controlled forward pressure, hard-cover value, low friendly crowding, and approximately two-to-six hexes of separation from the lead. Positions substantially behind the lead or on the wrong assigned side are rejected.
- If no viable combat flank can be reached with available movement TU, the support falls back to direct leader-relative formation following. Aggressive movement extends the standard formation behavior; it does not replace fire-team roles, break cohesion, or create independent player-controlled support paths.
- At the end of movement, support soldiers reassess visibility from the new position. They may fire on the preferred alien when legal, select another visible alien if that target is gone or unavailable, kneel, or hold according to the normal AI action rules.

## Hybrid handoff and validation

- Fire-team leads remain in the positions chosen by the player and cannot spend their remaining TU again during the AI support handoff.
- Supporting routes, movement, shots, impacts, and camera changes remain sequentially presented. The mode still resolves one AI round, clears temporary handoff orders, refreshes surviving soldiers' TU, and returns control to a living lead.
- Regression coverage verifies that rear-positioned left and right supports spend movement, arrive on opposite sides of the lead-to-alien axis, remain within cohesion, and retain a moving direct-formation fallback.
- Native Godot parity must port both the enemy-relative flank evaluator and the friendly formation-route distinction while reusing the native formation and occupancy authority.

---

# v0.26.08.14.1236 - Battle-Screen Hybrid Command and Collapsible UFO List

Browser build `v0.26.08.14.1236_HYBRID_LEADER_CONTROL_AND_COLLAPSIBLE_UFO_LIST_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Main battlescape hybrid-control doctrine

- Hybrid AI Command is a reversible battle-screen control mode available from the shared tactical toolbar in both the 2D map and Three.js isometric view.
- While active, player navigation changes from individual soldiers to living fire-team leads. Previous Fire Team and Next Fire Team cycle one lead per team; clicking a supporting soldier redirects selection to that soldier's lead.
- Fire-team leads remain ordinary manually controlled units during the player phase. Movement range, reachable cells, TU cost, selected reserve mode, remaining shot allowance, kneeling, inventory, targeting, and weapon fire all use the existing manual tactical rules.
- Supporting soldiers cannot receive independent player movement routes in this mode. The player establishes the team position by moving its lead, retaining a clear hierarchy and preventing accidental formation splits.
- Switching Hybrid AI Command off during an idle human phase restores standard individual-soldier selection and the normal manual alien-turn sequence.

## One-round support and engagement handoff

- End Turn becomes Run Hybrid AI Turn. It creates a temporary in-place order at every living lead's player-selected location and resolves exactly one AI-controlled tactical round.
- The lead holds the chosen position while supporting soldiers derive their destinations from the existing fire-team formation system. Role offsets, slowest-member pacing, cohesion, occupancy, escort assignments, rescue priorities, extraction traffic, and bounded blocked-route behavior remain authoritative.
- The AI determines each support's reserve profile, legal route and distance, post-move reassessment, kneeling, firing mode, ammunition use, and whether to shoot at the end of movement.
- All support movement and alien engagement uses sequential playback: path display, actor animation, footfalls, shots, impacts, and camera focus remain attached to the acting unit rather than being collapsed into confusing parallel phases.
- A valid shot fired by a lead during the manual phase records that alien as the fire team's preferred handoff target. Team members use it only while alive, visible, in range, and in line of sight, then fall back to another legal visible target.
- Leads are treated as finished during the support handoff, preventing AI from spending leftover player-phase TU a second time. At playback completion, temporary hybrid orders clear, current battlefield state and reinforcement state are retained, all living soldiers receive the normal fresh-turn TU allocation, the round advances, and player control returns to the first living fire-team lead. A resolved mission proceeds through the normal result handoff instead.

## Geoscape active-UFO list interaction

- Active UFO tracking cards are collapsed by default to keep the Geoscape interface compact when many contacts are present.
- An `Active UFOs (count)` button sits beside `Open Incident List`. It reveals the authoritative card list and changes to `Hide Active UFOs` while expanded.
- Collapsing the card list is presentation-only. Radar detection, contact state, selected targets, interceptions, aircraft routes, reports, incident generation, and Geoscape time continue unchanged.

## Validation and native roadmap

- Browser regression verifies one-lead-per-team selection, in-place leader orders shared with supports, preferred-target propagation, temporary-order cleanup, one-round handoff markers, and the battle-toolbar labels.
- Static release checks require both new patch flags, the hybrid round helpers, player-facing toggle and navigation labels, and the Geoscape UFO-list control.
- Port the leader-selection state, one-round continuation handoff, sequential support presentation, and collapsible contact-list interaction to Godot without duplicating the native formation implementation.

---

# v0.26.08.14.1142 - Hybrid Fire-Team Command, Ordered Playback, Helmets, and Transfer Confirmation

Browser build `v0.26.08.14.1142_HYBRID_FIRETEAM_PLAYBACK_HELMETS_AND_TRANSFER_CONFIRMATION_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## AI-controlled battle turn and presentation doctrine

- An AI-controlled soldier owns one coherent action presentation. The playback frame names the acting unit and explicitly lists every unit allowed to animate in that frame.
- A normal movement frame may animate the acting soldier plus civilians genuinely moving with that escort. It may not animate another soldier merely because combat or end-of-phase state for that soldier also changed.
- Shot damage and other combat state can be staged without importing a target's later coordinates. Impact and phase-completion frames carry no movement authority.
- Route display, footstep playback, camera focus, estimated delay, and unit interpolation all consume the same action-movement list. A unit cannot walk without its own route/action presentation and cannot snap back from a prematurely applied final position.
- The tactical AI continues to choose its reserve profile before movement, spend available TU on a bounded route, reassess contacts from the new position, and make its final fire/kneel decision from the completed position. Internally merged movement trails remain one observable soldier action rather than several confusing playback phases.

## Hybrid Fire-Team Command control mode

- Hybrid Fire-Team Command sits between full manual control and complete Simulation AI control.
- The player commands each fire-team leader's destination from the Tactical Command Map. The leader is the only unit receiving that player route.
- The player may also designate one currently revealed alien as the team's preferred target. This is an engagement preference, not guaranteed knowledge or a forced illegal shot.
- The AI retains authority over reserve TU, snap/aimed/burst or other available fire mode, kneeling, path execution, contact reassessment, ammunition use, grenade use, and whether a valid shot exists at the end of movement.
- At the end of movement, team members select the preferred target only if it is alive, personally visible, in range, and reachable by line of sight. If it is dead or unavailable, they may select another visible alien using normal AI targeting.
- The command persists as a formation hold after the leader reaches the waypoint. The player explicitly clears or replaces it; three consecutive turns of blocked progress still clear it safely.

## Formation preservation requirement

- Hybrid command must never replace, bypass, or duplicate the standard fire-team formation implementation.
- Supporting soldiers continue using leader-relative role cells, slowest-member pacing, cohesion checks, occupied-cell repair, and the existing fire-team movement trail system.
- When a hybrid order exists, support formation remains the movement priority even during contact. Supports may still fire after arriving, prefer the team's designated target, and fall back to another visible alien when necessary.
- Escort and VIP responsibilities remain authoritative. A fire team already responsible for an evacuee continues using the established escort, extraction-traffic, and lost-contact rules instead of abandoning that duty for an ordinary waypoint.

## Three.js soldier helmet presentation

- Three.js AEGIS soldier models include a small tactical helmet made from a curved shell and short brim.
- Helmet color is derived from the same equipped-armor palette used by the soldier body, including baseline and researched armor variants.
- The helmet is presentation-only. It cannot change protection, hit boxes, visibility, cover, TU, damage, loadout, or save format.

## Barracks troop-transfer interaction

- Transfer destinations remain hidden on each soldier card until the player presses Transfer.
- Selecting a destination opens a dedicated confirmation screen before any state change.
- Confirmation identifies the soldier, origin base, destination base, estimated travel time, logistics fee, immediate squad-duty removal, transit unavailability, and cancellation-without-refund rule.
- Insufficient funds disables the confirmation action. Back or closing the destination choice leaves campaign state unchanged.
- Only Confirm Transfer invokes the authoritative transfer operation that deducts funds, removes squad assignment, and writes the transit record.

## Validation and native roadmap

- Browser regression requires non-acting soldiers to retain their prior coordinates until their own sequential frame and forbids movement on impact or phase-completion frames.
- Hybrid regression requires preferred-target selection, legal fallback selection, formation-source use for supports, order persistence at the waypoint, and complete preferred-target cleanup when an order is cleared.
- Three.js regression requires the tactical helmet helper and armor-color material key. Barracks regression requires collapsed options and the modal confirmation marker.
- Port hybrid order data, preferred-target fallback, sequential movement ownership, and troop-transfer confirmation to the Godot vertical slice without implementing a second formation system.
- Native helmet presentation can use the native soldier model/material pipeline; it remains a renderer task rather than a gameplay-parity blocker.

---

# v0.26.08.14.0949 - VIP Rescue, Patch History, Shot Stack, and SFX Multipliers

Browser build `v0.26.08.14.0949_VIP_RESCUE_INGRESS_PATCH_HISTORY_SHOT_STACK_AND_SFX_MULTIPLIERS_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Authoritative mandatory rescue resolution

- A mandatory rescue objective now exposes separate terminal permissions: `canResolveVictory` requires the quota to be met, while `canResolveFailure` requires all VIPs to be resolved below quota.
- Defeating the alien force no longer converts an exhausted below-quota rescue objective into a victory. The shared terminal state records an objective failure for manual End Turn, Watch AI Team Leader, streamed Simulation AI, playback, mission reports, rewards, and panic handling.
- A quota that has become mathematically impossible remains in the rescue phase while living unresolved VIPs remain. Soldiers continue rescue work so every possible extraction can earn partial credit.
- Once no active VIP remains and the quota is missed, the battle ends as a resolved failure rather than waiting for irrelevant reinforcement checks, beacon search, or an AI safety-limit withdrawal.
- A failed mission retains the existing 20% fallback base reward and applies the mission panic penalty. Each extracted VIP still pays its normal per-rescue reward; the quota completion bonus is withheld.
- Soldier survival, experience, injuries, KIA state, VIP rescued/lost totals, and the action log remain authoritative regardless of success or failure.

## Traffic-aware VIP building ingress

- The rescue planner distinguishes mobile formation traffic from fixed occupancy. A fire-team leader may plan through a doorway or narrow corridor currently occupied by one of its own supports because the established formation mover will shift that support as the leader advances.
- Unrelated soldiers, aliens, civilians, hard walls, intact windows, and other fixed occupancy remain path blockers.
- When a VIP occupies a building, candidate contact cells must be passable cells inside the same building. Exterior adjacency across a solid wall does not count as a completed approach.
- Full path selection compares the valid interior contact cells around the VIP and follows a real door or existing breach. When temporary unrelated traffic prevents a complete route, bounded fallback movement ranks valid door and breach openings before raw straight-line distance to the VIP.
- The leader remains the only movement authority for the fire team. Supports keep their relative formation behavior, Time Unit pacing, and occupancy repair; no extra movement phase is introduced.
- The 0915 extraction rule remains intact: once an escort and VIP have exited their building, the route to the Skyranger cannot re-enter any building.

## In-game patch notes and version history

- Save / Load owns a Patch Notes / Version History entry point alongside Build Health and Enhanced SFX Library.
- The viewer must work from the standalone `file://` build without a server or network request. Current and historical summaries are embedded with the playable artifact.
- Opening the viewer selects the current build. Desktop uses a scrollable version list; compact layouts use an equivalent selector.
- Every record exposes a display version, release date, title, summary, full build identifier, save-format status, and test-relevant highlights where available.
- `README_PATCH_NOTES.txt` remains the authoritative detailed archive. The in-game viewer is a testing reference and must be updated whenever `CURRENT_GAME_BUILD` changes.

## Tactical shot-result presentation

- A tactical shot creates a result card containing weapon or fire-mode label, outcome, shooter, and target. Cards are newest-first at the top of the battlescape and older cards move down as new shots arrive.
- Each card remains fully visible for exactly 10 seconds, then enters its own 700-millisecond opacity/scale fade before removal. Later shots do not reset an older card's timer.
- The bounded stack retains up to six entries so sustained fire remains readable without obscuring the battlefield indefinitely.
- A `Shot Results: On / Off` battle-header control changes presentation only. Turning it off clears visible cards and pending card timers; ballistics, TU, ammunition, damage, audio, dialogue, and the permanent Mission Timeline remain authoritative.
- The visibility preference is part of the live cached battle state, so command-section navigation does not unexpectedly turn the overlay back on.

## Enhanced SFX multiplier mix

- Every Enhanced SFX Library sound has a discrete 1x, 2x, 3x, or 4x multiplier in addition to its 0-100% individual level and the master SFX level.
- Gain order is individual level, then selected multiplier, then master SFX volume. Preview and routed gameplay playback use the same computed mix gain.
- Stored boost values are normalized to the 1-4 range. Legacy boolean `true` migrates to 2x and `false` or a missing value migrates to 1x without altering campaign save format 4.
- Reset Mix restores all per-sound levels to 100% and multipliers to 1x.
- These settings remain local audio preferences and must never change tactical rules, Time Units, fire-team movement, save results, or campaign balance.

## Regression and parity roadmap

- The mandatory-rescue regression covers open rescue, quota-met-but-unresolved, impossible-but-active, terminal success, terminal failure, AI result classification, and exact partial-credit behavior.
- The building-ingress regression places a support in the doorway and requires the leader's route to cross that opening, end inside the VIP's building, contact the VIP, and retain support duty.
- The shot-result regression covers bounded newest-first stacking, independent fade/removal transforms, a 10-second visibility constant, and a multi-entry capacity; browser testing must also exercise the battle-header toggle.
- The Enhanced SFX regression covers legacy boolean migration, clamping to 1x-4x, and exact 2x/3x gain calculations. Browser testing must exercise every multiplier button and Reset Mix.
- Static release checks require the Save / Load patch-history entry point, the selected-version detail pane, the tactical stack/toggle markers, and the complete four-choice SFX control.
- Port the split rescue victory/failure terminal permissions, partial-credit result, own-team mobile-traffic filtering, same-building contact-cell rule, and entrance-biased fallback to Godot as one paired native milestone.
- Port the tactical result stack and audio multiplier controls to the native interface without changing their presentation-only/local-preference scope. A native patch-history viewer may read equivalent packaged release data.
- Add native fixtures for a support-blocked door, an unrelated-unit-blocked door, a breached alternate entrance, and the extraction no-reentry boundary.

---

# v0.26.08.13.2320 - Seven-Hex Beacon Shield and Mission Exit Fix

Browser build `v0.26.08.13.2320_SEVEN_HEX_BEACON_SHIELD_AND_MISSION_EXIT_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Shield footprint and interception doctrine

- A deployed kinetic or combined field surrounds exactly seven cells: the beacon's center hex and its six immediate neighbors.
- The six outer cells remain normal passable terrain. The field does not add hard cover, reserve occupancy, or block soldier, alien, civilian, VIP, escort, or fire-team paths; only the beacon's physical center remains occupied.
- A shield applies when a shot starts outside the field and ends on a protected cell. Kinetic shields intercept high-speed ballistic fire; combined shields intercept ballistic and directed-energy fire. Explosive blast remains capable of crossing either field.
- The rule protects any unit in the footprint, including reinforcements immediately after beam-in. It is positional protection, not a permanent reinforcement status: a unit that leaves the seven cells loses the field's protection.
- A shot starting inside the field does not cross the boundary and is not intercepted. An armed soldier can therefore enter one of the six outer cells and directly damage or destroy the beacon. This close-assault route supplements compatible ranged weapons and Frag Grenades.

## AI and fire-team movement

- Confirmed-beacon AI considers any living armed team capable because it can close with the field; Frag Grenades and shield-compatible ranged weapons remain faster alternatives when safe and available.
- The existing leader-only movement authority is unchanged. The assigned leader chooses the beacon approach while support soldiers retain leader-relative formation cells, slowest-member pacing, occupancy checks, and coherent one-movement-phase behavior.
- Entering the field does not split the team or create a special support movement phase. Supports continue forming outside or alongside the leader according to existing formation rules.
- Visible alien contact, player Command Map orders, rescue work, active escort responsibility, and civilian traffic management continue to outrank a beacon close assault.

## Presentation, victory, and regression safety

- Once revealed, all seven protected cells receive a cyan kinetic or magenta combined outline in 2D. Three.js renders a widened, flattened shell encompassing the same footprint.
- Field interception feedback applies to protected-unit shots as well as direct attacks against the beacon.
- The confirmed-beacon victory gate remains authoritative: entering the field creates a viable destruction path but victory still waits for actual beacon neutralization, alien-force defeat, and any mandatory rescue objective.
- Tactical result creation now assigns `result.beaconObjective` from the correctly scoped `tacticalBeaconObjective`. The obsolete undefined `tacticalAlienBeaconObjective` reference that caused an exit-time `ReferenceError` is forbidden by the regression contract.
- Build Health now verifies the exact seven-cell footprint, passability, reinforcement placement, outside-fire interception, inside-fire bypass, explosive passage, 2D/Three.js presentation, leader-only formation movement, and the corrected exit handoff.

## Native parity roadmap

- Add the seven-cell field footprint and outside-to-inside interception query to the Godot tactical board.
- Port the close-assault eligibility rule without creating a second movement phase or bypassing commander-centered formation ownership.
- Add paired cyan/magenta footprint presentation and reinforcement-arrival protection tests.
- The browser-only JavaScript scope crash has no direct Godot equivalent, but native result handoff should still receive a beacon-objective regression fixture.

---

# v0.26.08.13.1204 - Adaptive Alien Beacon Combined Shield

Browser build `v0.26.08.13.1204_ADAPTIVE_ALIEN_BEACON_COMBINED_SHIELD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Phase 3 campaign threshold

- Beacon destruction history continues to come from completed mission reports, including compatible action-log recognition for older format-4 reports.
- Newly generated non-crash deployments remain unshielded at 0-2 destructions, use the kinetic field at 3-5, and upgrade to the combined kinetic-energy field at 6 or more.
- Each battlefield stores an explicit shield state when generated. Continuing manual battles, streamed AI snapshots, and old saves do not change shield type mid-operation.
- UFO crash-site missions remain excluded and continue to replace the beacon with the crashed craft, impact trench, debris, broken vegetation/structures, and smoke.

## Combined shield behavior

- Ballistic, laser, plasma, and alien energy fire are intercepted. The attack still uses normal TU/ammunition and reports the correct intercepted damage class, but beacon HP does not change.
- Frag Grenade blast remains slow/explosive enough to cross the field and damage the beacon under the existing safe seven-cell blast contract.
- The shield volume remains traversable for soldiers, aliens, civilians, and VIPs. The beacon's physical center hex stays occupied until destruction.
- Phase 2 behavior remains distinct: a kinetic-only beacon still blocks ballistics while laser and plasma fire pass normally.

## AI and formation doctrine

- A combined-shield strike assignment requires a free fire team containing at least one living soldier with an available Frag Grenade. Energy weapons alone no longer qualify for Phase 3.
- The fire-team leader remains the sole beacon movement authority. Supports continue to use established leader-relative formation cells, half-pace assembly, slowest-member pacing, occupancy, and coherent single-turn movement.
- A grenade-capable support may attack when normal formation puts that soldier in safe range. Supports never become independent beacon movement leaders.
- Visible alien combat, player Command Map orders, rescue work, active escorts, and civilian duties continue to outrank beacon attack.

## Presentation, persistence, and validation

- The 2D badge identifies `K+E SHIELD` in magenta and explains that ballistic and energy fire are blocked. The Three.js field uses a matching magenta shell, distinct from the cyan Phase 2 field.
- Reinforcement visibility reconciliation preserves the original beacon record, shield type, HP, damage, and revealed state.
- Crash-mission reinforcement registration continues to preserve the original crashed-UFO model, wreck covers, trail, broken trees/buildings, and smoke.
- Build Health covers both progression thresholds, all relevant damage classes, grenade passage, AI team eligibility, leader-only movement authority, and 2D/Three.js presentation.

## Native parity

The Godot vertical slice remains at 0026. Phase 2 and Phase 3 beacon adaptation, campaign report history, AI strike eligibility, presentation, and landmark persistence remain queued for paired native implementation.

---

# v0.26.08.13.1956 - Confirmed Beacon Mission Completion Gate

Browser build `v0.26.08.13.1956_CONFIRMED_BEACON_MISSION_COMPLETION_GATE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Victory-condition doctrine

- In non-crash missions whose primary objective requires defeating the alien force, confirmed Alien Field Beacon knowledge makes an active mission beacon part of the remaining hostile operation.
- Eliminating the last living alien no longer ends the mission while the known beacon remains active. The battle enters a clearly announced **Secure the Beacon** phase until the device is destroyed or disabled.
- Victory requires no living aliens, no active confirmed-target beacon, and completion of any independent mandatory civilian/VIP rescue requirement.
- Destroying or disabling the beacon cancels a reinforcement wave still in transit, including destruction by a manually thrown Frag Grenade.
- Reinforcements that materialized before neutralization remain part of the force that must be defeated; beacon destruction never removes enemies already on the battlefield.

## Discovery and AI continuation

- Campaign confirmation that beacons are viable targets does not grant artificial battlefield vision. An undiscovered device changes the objective to **Locate and neutralize the Alien Field Beacon**, and AI units conduct coordinated existing grid/fog exploration until normal range and line of sight reveal it.
- Once discovered, one suitable free fire team receives the beacon strike assignment under established priority and shield-breach rules. The leader remains movement authority and supporting soldiers retain formation movement.
- Direct control, Watch AI Team Leader, streamed Simulation AI, and Classic Lineup resolution all use the same beacon-aware terminal-state helper.
- The HUD, tactical log, and playback outcome state whether the squad is searching, advancing to neutralize, unable to breach, or complete.

## Deadlock and mission-scope safeguards

- If no living soldier has a weapon or Frag Grenade capable of breaching the deployed shield, AI resolution stops without inventing a destruction. The operation remains incomplete, returns control where applicable, and offers withdrawal with an explicit **No available beacon-breach capability** explanation.
- UFO Crash Site missions are excluded because the intact beacon is replaced by the crashed UFO, impact trail, debris, damage, and smoke.
- Missions that do not require alien-force defeat retain their own objective rules unless they explicitly name beacon neutralization as mandatory.
- Build Health covers active, hidden, destroyed, and impossible-to-breach beacons; unknown doctrine; transit cancellation; already-arrived reinforcements; mandatory rescue coexistence; shared mode wiring; and non-elimination/crash-site exclusions.
- Native Godot parity remains queued and must adopt the same shared terminal-state contract and objective messaging.

---

# v0.26.08.12.1552 - Adaptive Alien Beacon Kinetic Shield

Browser build `v0.26.08.12.1552_ADAPTIVE_ALIEN_BEACON_KINETIC_SHIELD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Campaign adaptation threshold

- AEGIS counts completed mission reports in which an Alien Field Beacon was destroyed. New mission results mark the destruction and preserve it in the report action log, while log-text recognition keeps older format-4 reports compatible.
- Once three destructions have been recorded, newly generated non-crash tactical deployments receive a kinetic shield. Earlier deployments and already streamed tactical snapshots retain their original explicit shield state.
- UFO crash-site missions remain excluded because their deployment wrapper removes the beacon and places the angled crashed UFO, impact trench, debris, broken vegetation/structures, and smoke instead.
- No save migration is required: mission reports are already part of format-4 campaign saves.

## Shield behavior

- High-speed ballistic damage is intercepted. The attack still spends its normal TU and ammunition, reveals the impact, and records a shield-interception message, but beacon HP does not change.
- Laser and plasma fire are classified as energy and damage the beacon normally.
- Frag Grenade blast is classified as explosive and passes through the field under the existing prime/throw cost, range, blast shape, and friendly-risk rules.
- The shield does not make surrounding cells impassable. Personnel and ordinary tactical movement can enter the field area, while the beacon's own physical hex remains occupied until it is destroyed.
- Reducing the beacon to zero through an effective attack still opens its cell and cancels pending reinforcement transit.

## Reinforcement landmark persistence

- When a beacon wave materializes, visibility reconciliation merges into the current cover set and retains the original beacon by identity. Its HP, shield, damage, and revealed state cannot be replaced by a new placeholder or dropped from the frame.
- In crashed-UFO missions, a later reinforcement dropship is a separate craft. Registering it preserves the crashed-UFO craft model and every wreck/trail cover, so the original objective scenery remains visible while the live dropship arrives.
- Landmark preservation covers the crashed core, hull, wings, impact scars, broken trees, building debris, and other crash-trail pieces without duplicating records already present in the updated battlefield.

## AI and fire-team doctrine

- Confirmed-beacon targeting still assigns at most one available fire team after visible contact, player command, rescue, escort, and civilian responsibilities are evaluated.
- A shielded-beacon team must contain at least one living soldier with an energy weapon or available Frag Grenade. A ballistic-only team is not assigned to waste turns against the field.
- The assigned fire-team leader remains the movement authority and advances the whole team under the established leader/support formation, half-pace assembly, slowest-member pacing, occupancy, and coherent single-turn rules. Any shield-capable member may attack when the formation puts that soldier in range; a support does not become an independent beacon movement leader.
- Safe grenade assessment continues to reject blast cells containing AEGIS personnel, civilians, or VIPs.

## Presentation, validation, and parity

- The 2D marker displays `K-SHIELD`; its title and cover details identify ballistic immunity.
- The Three.js beacon displays a translucent cyan field that brightens when a bullet is intercepted.
- Build Health deterministically covers threshold progression, campaign report counting, ballistic interception, energy/grenade passage, unshielded legacy behavior, capable AI team selection, deployed state, both render paths, and original beacon/crashed-UFO persistence when reinforcements arrive.
- Native Godot parity now includes campaign beacon-loss history, per-mission shield state, weapon-class filtering, AI capability selection, and kinetic-field presentation.

---

# v0.26.08.12.1305 - Escort Contact Recovery and Extraction Traffic

Browser build `v0.26.08.12.1305_ESCORT_CONTACT_AND_EXTRACTION_TRAFFIC_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## One-full-round lost-contact rule

- Escort attachment now has a deliberate grace period. At each completed tactical round, a civilian is considered in contact if within normal four-person column spacing or if an unobstructed sightline exists in either direction.
- Only the combination of excess separation and blocked sight starts the timer. The first round boundary records the loss and announces a regroup window; release occurs only if the same condition remains at the following boundary, so a complete intervening round is always available for recovery.
- Restored sight or spacing clears the timer immediately at the next assessment and retains the existing escort.
- Release removes the active escort, priority claim, approach claim, order, and blocked-formation state while keeping the civilian revealed and available. This permits any free fire-team leader to make a normal contact and assume the escort.
- When the original escort is alive, every living member of that fire team returns to stay-together escort mode and the leader receives a recall target for the separated civilian. A direct recall target takes precedence over ordinary VIP distribution while no alien contact requires combat priority.
- If a different team contacts the civilian first, the previous recall assignment is cleared rather than producing two competing escorts.
- Round evaluation is shared by direct tactical control, rounds with pending alien reinforcement, post-combat rescue turns, and both full and streamed simulation-AI resolution. Contact and recall fields are retained in tactical snapshots.

## Skyranger extraction traffic doctrine

- An escort leader entering a player Skyranger extraction corridor activates a temporary ramp-guard formation for that fire team's supporting soldiers.
- Guard targets are selected outside all friendly ramp and hull cells, favor nearby passable and defensible ground. Supports remain under the existing movement-capacity, TU reserve, occupancy, pacing, and turn-order systems.
- While the assignment is active, a support soldier cannot select any extraction cell even if a normal formation target would pull them forward. This reserves the narrow corridor for escorted civilians and VIPs.
- The leader may enter and hold the corridor so the single-file civilian formation can advance. When the final assigned follower enters an extraction cell, is marked rescued/extracted, and leaves active occupancy, the leader moves to a free outside cell and the temporary guard markers clear.
- This formation override is scoped to escorted extraction. It does not alter ordinary fire-team triangles, building door/breach movement, combat break-off, manual movement, or search behavior.

## Roadmap and validation

- Build Health includes a blocked-sight, excessive-distance test across two round boundaries; it covers warning, full-round release, original-team recall, support return, reassignment by a second team, and timer reset after regrouping.
- A second deterministic scenario drives a full fire team and escorted VIP through a Skyranger corridor, requiring supports to remain outside ramp cells and the leader to clear the corridor after the VIP extracts.
- Native Godot parity now includes the contact timer/recall state and the extraction ramp-guard/leader-clearance behavior alongside Browser 0915's outdoor no-reentry route.

---

# v0.26.08.12.0915 - VIP Extraction No-Building-Reentry Routing

Browser build `v0.26.08.12.0915_VIP_EXTRACTION_NO_BUILDING_REENTRY_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Outdoor extraction commitment

- AI escorts inside a building continue to select a valid door or breached wall and carry the column toward it under the established egress system.
- As soon as the escort reaches outdoor ground, extraction pathfinding treats every building cell as unavailable and plans around structures to the chosen Skyranger ramp corridor.
- The route is planned beyond the current turn's movement allowance, then only the TU-bounded prefix is committed. This prevents repeated local shortest-path decisions from sending a team back through the doorway it just cleared.
- If no complete path is temporarily available because of living-unit traffic, the escort selects bounded outdoor progress and retries rather than using a building as a shortcut.
- At the final ramp egress, a leader with trailing VIPs converts unused bounded movement steps into formation advances while holding position. This prevents the last member of a long column from stalling just outside the ramp after the leader has no further waypoint.

## VIP and fire-team formation behavior

- Outdoor commitment is tracked per moving unit during extraction. A VIP still inside may continue through the room and leave normally; after reaching an outdoor cell, that VIP's next formation move cannot return indoors.
- Supporting soldiers use the same extraction-only candidate filter after they individually exit.
- The filter does not replace formation destinations, formation pace, TU reserves, occupancy checks, leader waiting, support break-off, or regrouping. It only removes building cells from an already-outdoor unit's eligible formation moves.
- Search, initial VIP contact, manual player movement, combat maneuvers, and deliberate building entry remain unchanged because the no-reentry rule is enabled only for an active escorted extraction.

## Roadmap and validation

- Browser Build Health now includes a deterministic route across the far side of a procedural building and requires the completed route segment to stay outside.
- Manual validation should observe a full rescue column leaving a large building, clearing doorway congestion, moving around the structure, and reaching the Skyranger without reversing indoors.
- Native Godot parity now includes porting the outdoor extraction commitment alongside the existing door/breach egress and formation-following systems.

---

# v0.26.08.12.0858 - Enhanced SFX Per-Sound Double Boost

Browser build `v0.26.08.12.0858_ENHANCED_SFX_PER_SOUND_DOUBLE_BOOST_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Library boost controls

- Every one of the 17 Enhanced SFX Library rows now carries a dedicated `Boost ×2` button beside its Play control.
- Boost is an independent toggle per sound. Active buttons are highlighted as `Boost ×2 On`, expose their pressed state accessibly, and add `×2` to the row's level readout.
- The toggle affects both Play previews and the corresponding sound during gameplay, making it possible to raise quiet footsteps or impacts without making weapons and aircraft equally louder.
- `Reset Mix` returns all individual sliders to 100 percent and switches all 17 boosts off.

## Gain and persistence contract

- Effective enhanced gain is `individual slider / 100 × (boost ? 2 : 1)`, then multiplied by the existing master SFX bus.
- A 60 percent row with Boost therefore produces 1.2 times its unscaled source level before the master bus. A 0 percent sound remains silent even when boosted.
- Boost preferences are normalized strictly to booleans, stored under their own versioned local key, and default off for missing or newly added sounds.
- Existing slider preferences remain in their original storage key. The patch needs no migration and does not alter campaign data or save format 4.
- Original SFX uses gain 1 through this layer, bypassing both enhanced sliders and boosts. Returning to Enhanced restores both saved preference sets.

## Gameplay safety

- The boost layer only changes a short-lived Web Audio gain node created for the selected effect.
- It cannot add movement events, move units, spend TU, alter AI planning, change shot results, or affect escort and fire-team formation rules.

## Validation gates

1. Open Save / Load > Enhanced SFX Library and confirm every sound row has Play and Boost ×2 controls.
2. Set a sound to 50 percent, audition it with boost off, enable boost, and confirm the preview is twice as loud while other sounds remain unchanged.
3. Reload the page and confirm the selected sound's boost remains on and its slider remains unchanged.
4. Use Reset Mix and confirm all levels return to 100 percent and every Boost ×2 control turns off.
5. Switch to Original SFX and confirm enhanced boosts do not affect it; switch back and confirm the enhanced boost selection returns.
6. Run Build Health and confirm the extended Enhanced SFX Library contract reports OK.

---

# v0.26.08.12.0825 - Enhanced SFX Library and Per-Sound Mix

Browser build `v0.26.08.12.0825_ENHANCED_SFX_LIBRARY_AND_PER_SOUND_MIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Save / Load audio archive

- The Save / Load Game header now includes an `Enhanced SFX Library` button that opens a dedicated full-screen audio archive and returns directly to Save / Load.
- The archive lists every enhanced effect that is currently routed in gameplay, grouped as Movement, Weapons, Impacts and Casualties, and Skyranger.
- Its 17 entries cover soldier, alien, civilian, and VIP footsteps; ballistic, laser, AEGIS plasma, and alien shots; miss/flyby, hit/injury, armor, glass, death, and fall feedback; and Skyranger flyby, takeoff, and landing.
- Every row has a Play button and an independent 0-100 percent level. Preview buttons explicitly audition the enhanced synthesis even when the player has Original SFX selected.
- The screen also exposes master SFX volume, a `Reset All to 100%` action, the active SFX profile, and a one-click route back to Enhanced Tactical SFX when Original SFX is active.

## Mix and persistence contract

- Individual levels multiply the master SFX bus instead of replacing it. A 50 percent weapon setting under a 70 percent master level therefore plays at half of the established 70 percent bus output.
- Versioned per-sound preferences are stored locally and normalized to the 0-100 range. Missing or older keys default to 100 percent so new sounds are audible after an update.
- Original SFX retains its prior mix and bypasses enhanced per-sound levels. Switching profiles does not discard the saved enhanced mix.
- Window shattering now has an audible enhanced route in both simulated playback frames and manual window-crossing shots.
- No level is serialized into campaign data; save format remains 4.

## Gameplay and formation safety

- The library and mixer operate only on Web Audio destination gains and presentation callbacks.
- They do not plan paths, create animation steps, spend TU, choose shots, alter line of sight, change AI decisions, move escorts, or edit unit state.
- Fire-team leaders, supports, formation pacing, coherent single-turn movement, checkpoint reassessment, and final-action rules remain authoritative and unchanged.

## Validation gates

1. Open Save / Load Game and confirm the Enhanced SFX Library button opens the dedicated screen and Back returns cleanly.
2. Play all 17 rows and confirm each produces the labeled effect; test the four movement roles and four weapon reports for clear differences.
3. Set one sound to 0 percent, leave another at 100 percent, and confirm previews and gameplay respect the individual levels under the same master setting.
4. Reload the page and confirm the individual mix persists while campaign saves remain compatible.
5. Switch to Original SFX and confirm its established mix is unchanged; switch back to Enhanced and confirm the individual mix returns.
6. Run Build Health and confirm the Enhanced SFX Library contract reports OK.

---

# v0.26.08.12.0024 - Tactical Mission Visibility Music Crossfade

Browser build `v0.26.08.12.0024_TACTICAL_MISSION_VISIBILITY_MUSIC_CROSSFADE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Contact in the Dark adaptive mission structure

- While no living alien is in current line of sight of a living soldier, the alternate mission cue loops from 0:00 up to the 0:36 boundary.
- While one or more living aliens are currently visible, it loops from 0:37 up to the 1:00 boundary.
- Music state uses the same live soldier line-of-sight calculation as tactical observation, not the alien's persistent `revealed` or last-known-position memory. A contact moving behind opaque cover therefore returns the score to search.
- Gaining or losing contact creates a 1.4-second equal-direction crossfade using two media players: the outgoing section fades down as the incoming player seeks to its new segment start and fades up.
- Every active player enforces its own segment boundaries. The search passage cannot spill into combat, and the combat passage cannot wrap through the search introduction.
- A newer visibility change cancels the prior transition timer and disposes its stale outgoing player before starting another crossfade.
- The segmented behavior is limited to `contact_in_the_dark.mp3` when `Dark Horizon Alternate` and the mission context are active. Original soundtrack and fallback/synth routing retain their existing behavior.

## Gameplay safety

- The music hook observes live positions, health, cover, and line of sight but does not write tactical state.
- Alien reveal memory, fog rendering, AI contact logic, window visibility, unit paths, TU, action order, escort movement, and fire-team formation rules are unchanged.
- Save format remains 4 because the transient music state is neither serialized nor added to campaign data.

## Manual validation gate

1. Enter a tactical mission with Dark Horizon Alternate selected and confirm 0:00-0:36 repeats before contact.
2. Reveal a living alien and confirm the score crossfades to 0:37-1:00 rather than jumping or stopping.
3. Break every soldier's line of sight to all living aliens and confirm a crossfade back to the opening search passage even though contact remains remembered on the map.
4. Regain and lose contact rapidly and confirm there is never more than one incoming and one outgoing layer and that the abandoned transition is cleaned up.
5. Switch to Original Soundtrack and confirm its existing complete mission loop is unchanged.

---

# v0.26.08.11.2200 - Alternate Soundtrack and Tactical Audio Direction

Browser build `v0.26.08.11.2200_ALTERNATE_SOUNDTRACK_AND_TACTICAL_AUDIO_DIRECTION_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Selectable soundtrack identity

- Players can choose `Original Soundtrack` or `Dark Horizon Alternate` in Audio Settings. The choice persists in local browser audio preferences rather than the campaign save.
- The alternate bank contains 15 original generated score cues beside, rather than in place of, the existing score. Every context has a distinct alternate: `Dark Horizon Overture`, `Command Directive`, `Global Vigil`, `Fort Aegis`, `Quartermaster Ledger`, `Mainframe Archive`, `Barracks After Midnight`, `Unknown Specimen`, `Assembly Line Zero`, `Fireteam Covenant`, `Recovery Ward`, `Contact in the Dark`, `After Action`, `Names on the Wall`, and `Command Suspended`.
- Automatic and manual track-selection modes continue to work. Changing soundtrack while music is playing restarts the current context on the newly selected bank.
- Missing alternate audio falls back to the original encoded track and then to the established synthesized theme, so an asset failure cannot silence the game.

## Tactical sound hierarchy

1. Physical action sounds communicate routine activity: soldier boots, alien claws, civilian steps, tracked-VIP hurried shoes, weapon reports, projectile impacts, glass, pain, and falls.
2. Spoken soldier radio lines communicate information or intent changes: contact gained, contact resolved, VIP/contact search resumed, objective secured, hit/kill confirmation, command handoff, or other meaningful status changes.
3. Generic `Moving` and `Advancing` acknowledgements are accent lines, not a narration of every path. Manual orders use an 18 percent chance with a 4.5-second cooldown; AI playback uses a deterministic one-in-seven movement accent so replays remain bounded.

## State-change radio doctrine

- `contact search/VIP search -> engagement`: announce alien contact and switch to engagement behavior.
- `engagement -> VIP search`: announce “Resuming search for the VIP”; the current audio route uses the recorded `Keep Moving` performance until a dedicated matching take is recorded.
- `engagement -> contact search`: announce that the immediate area is clear and the search is resuming.
- `any active phase -> secure`: announce that the area is secure.
- Kill, injury, shot, last-alien, command-return, and escort-support callouts retain their existing priority and recorded personality variants.

## Movement and formation safety

- Footsteps are emitted from existing visible animation steps; they do not create steps, change destinations, consume TU, or write unit positions.
- Manual movement still advances escorted civilians through the existing escort helper and explicitly leaves automatic fire-team formation application disabled for direct player moves.
- Simulation AI still obtains its path from the coherent-turn playback trail after the reserve, checkpoint, continuation, formation-pacing, traffic, and unique-hex rules have resolved.
- Audio callbacks therefore cannot change leader waiting, support cohesion, escort assignments, contact rushes, command-map orders, or occupancy validation.

## Generated sound-effects source library and roadmap

- The signed-in ElevenLabs project now contains generated candidates for 16 tactical categories: human, alien, civilian, and VIP footsteps; ballistic rifle, laser, and alien plasma fire; soldier, alien, and civilian injury reactions; soldier, alien, and civilian/VIP deaths; glass shatter; dirt/concrete impacts; and metal/armor impacts.
- The enhanced browser SFX profile supplies the event routing and distinct real-time footstep textures now. Generated candidates should be auditioned, normalized, trimmed, exported, and substituted category by category; the Original SFX option must remain available throughout that replacement pass.
- Future dedicated voice recording should add exact status lines for `Resuming search for the VIP`, `Resuming contact search`, and other objective transitions across the established soldier personality styles.
- Native Godot parity must reproduce soundtrack-bank selection, audio preference persistence, event-priority dialogue, role footsteps, and fallback behavior without changing tactical outcomes.

## Validation gates

- Switch soundtrack banks while music is playing and confirm the current screen context restarts on the selected bank.
- Watch manual and Simulation AI movement for humans, aliens, civilians, and tracked VIPs; confirm footsteps follow visible movement without affecting formation positions or TU.
- Watch an alien engagement interrupt a VIP search, then end, and confirm the resume-status callout occurs once while routine movement remains mostly non-verbal.
- Confirm Original SFX still plays when selected, enhanced sounds respect the SFX volume, and both modes leave voices independently controlled.

---

# v0.26.08.11.1652 - Adaptive Coherent AI Turns and Window Ballistics

Browser build `v0.26.08.11.1652_ADAPTIVE_COHERENT_AI_TURNS_AND_WINDOW_BALLISTICS_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Simulation AI turn model

- Every AI-controlled soldier chooses an individual TU reserve before movement instead of inheriting one global fire mode.
- Available reserve choices are Snap Shot, Aimed Shot, Burst, Full Auto, and Kneel + Snap. Selection considers visible range, target cover, contact count, fire-team role, ammunition, and available TU.
- Aimed fire is preferred for distant or protected targets when TU permits. Burst and automatic fire are considered at closer ranges with sufficient ammunition and contacts. Rear/base-fire roles can reserve kneeling plus a snap shot when no target is visible.
- A soldier can plan against the full TU remaining after that personal reserve rather than the old generic eight-step AI ceiling.

## Coherent movement and reassessment

- Each soldier receives one observable turn sequence: initial movement, one checkpoint reassessment, an optional continuation, then one final action.
- The initial and continuation legs append to the same recorded movement trail. Playback therefore presents one continuous route rather than multiple movement phases for the same soldier.
- The checkpoint updates the soldier's personally visible alien contacts. The soldier may stop to engage, continue toward a newly observed enemy, continue toward the current objective, or finish by kneeling when appropriate.
- At most one continuation is permitted, and total movement can never exceed TU left after the current reserve.

## Fire-team formation guarantee

- Adaptive movement does not replace fire-team movement rules. Both the initial plan and its optional continuation pass through the existing formation pace authority.
- Leaders remain half-paced while supports are assembling and still use the slowest eligible member's capacity when formed.
- Supporting soldiers cannot use a no-contact continuation to separate beyond the established leader-cohesion bound.
- Existing contact-rush, player Command Map, escort-support, friendly-traffic, formation-target, and unique-hex safeguards remain in force.

## Building sight and window ballistics

- Procedural building exteriors continue to mix window wall sections with solid wall sections.
- Window sections transmit line of sight for human, alien, civilian, AI, fog-of-war, and targeting calculations. Solid walls and partitions remain opaque.
- When a projectile path crosses an intact window, the pane shatters before the normal hit roll and that first round receives an 18-point accuracy penalty.
- If the penalized roll still succeeds, the projectile can hit the soldier or alien beyond the window. Subsequent rounds and attacks cross the shattered window without another glass penalty.
- Shattered windows remain hard, impassable wall cells; creating a traversable opening still requires the existing structural breach system.
- Manual fire, Simulation AI fire, alien fire, and reaction fire use the shared shattering rule and damaged-window presentation.

## Roadmap and validation

- Browser Build Health includes contracts for adaptive reserves, coherent movement metadata, single reassessment, formation-governed continuation, window sight, solid-wall occlusion, glass shattering, and the first-shot penalty.
- Manual release validation must watch complete Simulation AI turns, verify formation cohesion across checkpoint continuations, and test both window and solid-wall engagements in 2D and Three.js tactical views.
- Native Godot parity remains a roadmap item: port the personal reserve decision, coherent playback sequence, formation continuation guard, window LOS, and window projectile state before declaring browser/native tactical parity.
- The next AI refinement should expose the chosen reserve and final turn action more prominently in playback HUD text, using the metadata already saved on frame units.

---

# v0.26.08.10.1005 - UFO Crash Site Wreck and Impact Trail

Browser build `v0.26.08.10.1005_UFO_CRASH_SITE_WRECK_AND_IMPACT_TRAIL_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Crash-site tactical identity

- UFO Crash Site missions no longer place an intact Alien Field Beacon at the alien deployment center.
- The downed craft now occupies a seven-cell hard-cover footprint and appears at a stable mission-seeded yaw and uneven pitch/roll.
- Three.js renders a scorched saucer with a flattened hull, fractured dome, incomplete rim, torn panel, exposed damaged core, dead purple machinery glow, and a bounded static smoke plume.
- 2D Hex renders dedicated crash-wreck silhouettes, impact scars, broken trees, building debris, and smoke rather than reusing the reinforcement-craft or beacon artwork.

## Procedural impact trail

- A mission-seeded 10-20-cell path runs into the wreck and widens at irregular intervals.
- Open terrain becomes churned soil. Vegetation becomes fallen trunks and stumps. Urban or structural cover becomes masonry and beam debris.
- Terrain crossed by the impact path is replaced instead of stacked, keeping cover lookup and tactical presentation coherent.
- Aliens and civilians are placed after the wreck cover is finalized so no unit begins inside an indestructible wreck cell.

## Scope and regression coverage

- Crash-site detection supports current mission kinds plus explicit/legacy crash-site metadata.
- Ordinary incidents retain their Alien Field Beacon, reinforcement call, and dropship behavior.
- Build Health verifies beacon exclusion, wreck geometry, impact-trail length, abnormal craft tilt, unit placement safety, and both renderer contracts.
- Browser syntax and runtime startup remain release gates; save format remains 4.

---

# v0.26.08.07.2055 - Incident Map Limit Self-Test Startup TDZ Hotfix

Browser build `v0.26.08.07.2055_INCIDENT_MAP_LIMIT_SELF_TEST_STARTUP_TDZ_FIX_INDEX_ONLY_PATCH` preserves save format 4 and all 1850 gameplay behavior. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Startup crash fix

- Fixed the player-reported startup `ReferenceError: IncidentMapLimitPanel is not defined`.
- Root cause: the 1850 Barracks/Incident Map Limit Build Health contract called `String(IncidentMapLimitPanel)` while `AlienResponseCommand` was still initializing and before that local `const` component had reached its declaration. JavaScript correctly treated the local binding as uninitialized and threw from the temporal dead zone.
- The regression contract now inspects `String(AlienResponseCommand)` for the settings-panel markers and continues to directly test the 5-20 clamping/routine-incident helpers. It no longer evaluates the not-yet-initialized component binding.
- No Incident Map Limit gameplay logic, Barracks ordering, tactical AI, beacon knowledge, grenade doctrine, or save-format behavior was changed by this hotfix.

## Post-review code cleanup

- Routine-incident cap accounting now excludes protected crash sites and other critical/player-created operations. Those missions remain on the board and may push the total above the configured routine limit without consuming routine incident slots.
- Generated routine batches are de-duplicated against both the active board and earlier candidates in the same batch.
- The Incident Map Limit range control now exposes a valid accessible label in the rendered DOM.
- VIP rescue coordination now uses the established nearest-VIP fallback when a legacy/test tactical state has no assignable fire-team leaders, rather than enabling coordination with an empty assignment plan.
- The structural-damage Build Health contract now checks the base cover renderer that owns the crack, shattered-window, and smoke presentation, plus the alien-technology wrapper's delegation to that renderer. This corrects a false diagnostic failure without reducing feature coverage.

## Validation

- Zero remaining `String(IncidentMapLimitPanel)` references.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Authoritative browser build and visible start-screen version derive from 2055.
- Save format remains 4.

---

# v0.26.08.07.1850 - VIP Rescue Coordination + Grenade AI + Beacon Intel + Barracks Reading Order + Incident Limit

Browser build `v0.26.08.07.1850_VIP_RESCUE_COORDINATION_GRENADE_AI_BEACON_INTEL_BARRACKS_ROW_ORDER_AND_INCIDENT_LIMIT_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## VIP rescue Simulation AI distribution

- On mandatory civilian/VIP rescue missions, Simulation AI now creates persistent fire-team-to-VIP assignments instead of letting every fire-team leader independently choose the nearest marked VIP.
- The highest-ranked living deployed AEGIS soldier acts as rescue coordinator; XP/experience breaks equal-rank ties, then existing mission/service data provides stable deterministic fallback ordering.
- One fire team is assigned to each unresolved marked VIP where possible before any duplicate rescue coverage is allowed.
- If VIPs outnumber teams, available teams go to different VIPs first. If teams outnumber VIPs, excess teams remain free for security/combat/escort work instead of clumping on a rescue target.
- Valid assignments persist across streamed one-round AI continuation batches and are cleared/reassigned only when the VIP resolves, the assignment becomes invalid, or a higher-authority escort/combat/player Command Map rule applies.

## Simulation AI Frag Grenade doctrine

- AI-start and inherited soldiers now carry/preserve the same Frag Grenade state used by manual tactical control.
- Simulation AI can choose a grenade when it can hit multiple visible aliens, attack a single visibly entrenched alien, or attack a confirmed high-priority Field Beacon.
- AI rejects a throw if the blast would hit a living AEGIS soldier, civilian, or VIP.
- Exposed single aliens do not justify routine grenade expenditure when ordinary fire remains the better choice.
- Grenade explosions continue to use the existing authoritative blast/structural-breach rules, so an unidentified beacon can still be destroyed incidentally even before AEGIS understands its strategic value.

## Alien Field Beacon knowledge and Mainframe database unlock

- AEGIS begins without strategic understanding of the Field Beacon. Seeing the device alone does not make it an automatic Simulation AI target.
- When a beacon reinforcement materialization is actually observed, the tactical continuation records that fact and campaign knowledge advances to **Confirmed**.
- Confirmation unlocks one persistent **Alien Field Beacon** Mainframe database entry. Repeated observations reuse that knowledge rather than generating duplicate unlock reports.
- The database records only demonstrated knowledge: reinforcements can materialize around the device. Future shielding, hacking, capture value, and deeper operating principles remain unknown until their own discovery/research progression exists.
- After confirmation, one nearby suitable free fire team may deliberately attack an active discovered beacon. Visible alien threats, escort/rescue duties, and explicit player Command Map orders outrank the automatic beacon objective.
- Confirmed beacon knowledge and in-mission observation state survive streamed AI round boundaries.

## Barracks row-major reading order

- The main Soldier Barracks card list now uses a responsive grid instead of CSS multi-columns.
- Soldiers therefore fill **left-to-right across a row, then continue on the next row**, matching normal book-reading order rather than filling top-to-bottom down one column first.
- Existing soldier sort selection still determines the underlying roster order; this patch changes only how that sorted sequence is laid out visually.

## Configurable Incident Map Limit

- Command Settings now includes an **Incident Map Limit** slider from **5 through 20**.
- The setting is saved with the campaign and defaults to 20 for existing/legacy saves that do not contain it.
- Routine monthly/generated incidents are constrained by the configured limit. Longwave Radar can still create additional incident opportunities, but only available active-board slots are filled.
- Lowering the limit never deletes incidents already active on the map.
- UFO crash sites and other critical/player-created operations remain preserved even if they temporarily push the map above the routine limit.
- Completed routine UFO operations suppressed because the board is full no longer produce a false incident-open prompt; the report instead states that the configured limit prevented adding those routine markers.

## Validation contract

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct helper harness passes VIP assignment persistence/diversity, grenade value/safety, beacon knowledge targeting, and incident-cap clamping.
- Build Health adds regressions for VIP rescue distribution, grenade/beacon intelligence doctrine, and Barracks/Incident Map Limit behavior.
- Static test-symbol scan: 361 `*Test` symbols / 360 declarations; the only unmatched token is the existing Three.js material property `depthTest`.
- Save format remains 4.

## Manual validation gate

1. Hand a terror/VIP rescue mission with several tracked VIPs to Simulation AI and confirm separate fire teams depart for separate VIPs.
2. Let one VIP resolve and confirm its team can be reassigned without the other teams collapsing onto the same target.
3. Present two clustered aliens with a safe blast area and confirm an equipped AI soldier can choose a Frag Grenade; repeat with a civilian/friendly in the blast and confirm the grenade is rejected.
4. Before beacon knowledge is learned, expose a Field Beacon and confirm Simulation AI does not abandon normal priorities just to attack it.
5. Observe reinforcements materialize from the beacon, confirm the Mainframe database entry unlocks once, then confirm a later suitable free team can prioritize the active beacon.
6. Open Barracks with enough soldiers for multiple rows and verify visual order proceeds left-to-right, then down.
7. Set Incident Map Limit to 5, fill the map, and confirm routine new incidents stop adding without deleting existing incidents; verify a UFO crash site is still preserved.


---

# v0.26.08.07.1630 - Tactical Damage-State Smoke + Breach Feedback Seed + Unlimited Downtime Capacity

Browser build `v0.26.08.07.1630_TACTICAL_DAMAGE_STATE_SMOKE_BREACH_FEEDBACK_AND_UNLIMITED_DOWNTIME_CAPACITY_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Stage 3 goal

The tactical rules already tracked structural HP and transitioned building pieces through intact, damaged, critical, and breached states, but the visual treatment lagged behind the simulation. A wall or window could lose most of its HP while still looking essentially intact, making it hard to understand which routes were nearly open and which structures had actually taken heavy fire.

Build 1630 adds a shared presentation contract without changing tactical math.

## Shared structural-damage feedback

`tacticalCoverDamageFeedback(...)` now converts existing cover state into deterministic presentation metadata:

- **Damaged** — first crack tier, modest material darkening, light dust/smoke cue.
- **Critical** — stronger crack tier, deeper darkening, stronger smoke/dust cue.
- **Breached** — preserves the existing passable rubble/opening state and adds a settling dust/smoke cue.
- **Damaged window** — uses the same structural state while additionally marking the pane as shattered.

`tacticalCoverDamageTooltip(...)` exposes the resulting state alongside remaining structural HP and window/smoke feedback.

## 2D Hex presentation

- Building walls draw deterministic crack overlays when damaged or critical.
- Window cells visibly change from intact blue glass to a broken/shattered treatment after structural damage.
- Damaged/critical structural cells receive restrained dust/smoke wisps.
- Breach rubble retains the existing amber OPEN treatment and gains a visible settling dust cue.
- Existing `DMG`, `CRIT`, and `OPEN` badges remain intact.

## Three.js presentation

- Damaged structures use darker state-aware material tones.
- Crack geometry is added to damaged/critical walls without changing collision geometry.
- Broken windows use a dimmed pane plus shard/frame cue.
- Damaged/critical walls and breach rubble receive small bounded translucent smoke/dust meshes.
- Effects are intentionally static/lightweight so tactical rendering does not reintroduce the timeout/performance problems addressed by earlier Three.js optimization work.

## Temporary unlimited Training Center / Rec Room capacity

The current downtime scheduler previously modeled both facility-wide and per-activity slot caps: six soldiers per Training Center, eight per Rec Room, plus smaller caps for range, gym, running, cards, pool, and darts. Those limits are intentionally disabled for now.

- If at least one **Training Center** exists, any number of currently living/eligible soldiers may train during the same downtime tick.
- If at least one **Rec Room** exists, any number of currently living/eligible soldiers may use recreation during the same downtime tick.
- Individual activity caps are also disabled, so a large roster can all choose range practice, gym work, cards, pool, or another valid activity without arbitrary overflow.
- The facility itself is still required. No Training Center still means no training access; no Rec Room still means no recreation access.
- Existing activity preferences, autonomous choices, friendship/contact generation, training gains, stress recovery, and Sickbay/overflow exclusions remain unchanged.
- The old slot values remain in `DOWNTIME_ACTIVITIES` as dormant balancing data for a later deliberate capacity pass.

This is a usability/balance simplification rather than a final world-simulation rule. A future capacity system can return when facility scale, shift scheduling, staffing, room upgrades, and base population pressure have enough supporting gameplay to make the restriction interesting rather than arbitrary.

## Gameplay boundary

This is a **feedback seed**, not the later fire/smoke simulation. Smoke/dust currently does not:

- block or shorten line of sight;
- damage or suppress units;
- change movement cost or AI pathfinding;
- spread to adjacent cells;
- ignite furnishings;
- interact with building power.

Those systems remain later Stage 3 work after the visual contract is playtested.

## Validation

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct damage-state helper contract confirms damaged, critical, breached, and broken-window output.
- Build Health adds `Tactical structural damage shows cracks broken windows smoke and breach feedback in 2D and Three.js`.
- Build Health also verifies temporary unlimited downtime capacity using a 24-soldier roster with a single Training Center and single Rec Room.
- Static test-symbol scan is rerun for this combined build; only Three.js `depthTest` is expected to remain an intentional non-test token.
- Save format remains 4.

## Manual validation gate

1. Damage a wall through intact -> damaged -> critical -> breached and compare both tactical renderers.
2. Damage a window and confirm the shattered state is obvious before full breach.
3. Verify the underlying hex remains blocked until the existing breach threshold actually opens it.
4. Confirm smoke/dust does not alter LOS, movement, or damage.
5. Confirm renderer switching preserves the same authoritative structural HP/state.
6. Assign more than six healthy soldiers to one Training Center and more than eight to one Rec Room; confirm all eligible soldiers can resolve their selected downtime mode.
7. Remove the matching facility and confirm the activity becomes unavailable, proving only the capacity cap was removed rather than the facility requirement.


# v0.26.08.07.1415 - Alien Beacon Fan-Out Search + Lone-Survivor Exfil Fix

Browser build `v0.26.08.07.1415_TACTICAL_ALIEN_BEACON_FANOUT_SEARCH_AND_LONE_SURVIVOR_EXFIL_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-reported behavior

A group of living aliens could be found sitting together around their Alien Field Beacon instead of moving across the map to hunt civilians, VIPs, or AEGIS soldiers.

## Root cause

The no-contact objective order for ordinary original aliens was:

1. visible living target;
2. valid living last-known target;
3. reinforcement rally (for reinforcement units);
4. **home/exfil target for every original non-VIP alien**;
5. battlefield search.

Because the current-build physical Alien Field Beacon is the preferred home target, step 4 intercepted the whole starting force before the search doctrine was reachable. Healthy groups therefore behaved like static beacon guards.

## Corrected hunt/search doctrine

While **two or more original aliens remain alive**, an original alien with no visible or remembered living target now proceeds directly into deterministic battlefield search.

- Search assignments are distributed using the existing mission-seeded/alient-indexed waypoint system, so different aliens naturally fan out toward different sectors.
- Original-alien search waypoints within four hexes of an active Field Beacon are rejected.
- Formation offsets are also prevented from pulling a search destination back into that immediate beacon perimeter.
- Buildings and broad battlefield sectors remain valid search destinations.
- Acquiring line of sight to a civilian, VIP, or AEGIS soldier immediately overrides search and restores combat targeting.
- A remembered target is pursued before generic search while that target is still living/unresolved.

The beacon is therefore an insertion/support device, not a permanent defensive post for the whole alien group.

## Lone-survivor fallback preserved

The existing emergency-call behavior remains useful as a late-contact pressure mechanic. When only **one original alien** remains alive in an ordinary non-VIP mission and that alien has no visible or valid remembered target, it may fall back to:

1. the active Alien Field Beacon;
2. a legacy alien dropship ramp when applicable; or
3. its recorded insertion point for older/compatibility states.

Reaching that support point may still trigger the established emergency reinforcement call. Seeing a living target immediately overrides withdrawal.

This changes the fiction from “the whole alien squad retreats to the beacon” to “a last surviving straggler tries to get back to communications and call for help.”

## Reinforcement behavior

Reinforcement aliens keep their existing arrival/rally ownership. They may initially converge around the caller/rally position as intended, then transition into their search doctrine. They are not converted into original-alien beacon guards by this patch.

## Validation

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Added Build Health coverage: `Alien groups fan out from an active Field Beacon to hunt targets while only a lone original survivor may fall back to call reinforcements`.
- Direct contract setup places two original aliens adjacent to an active beacon and confirms both receive `search` objectives outside the four-hex beacon perimeter.
- The same setup removes one alien and confirms the remaining original alien receives the beacon fallback objective.
- Static test-symbol scan: 356 unique `*Test` symbols / 355 declarations; only the existing Three.js `depthTest` material property is unmatched.
- Save format remains 4.

## Manual validation gate

1. Observe a fresh alien group before it has seen AEGIS or civilians and verify it leaves the beacon area.
2. Confirm multiple aliens spread toward distinct sectors rather than stacking on one destination.
3. Reveal a civilian/VIP/soldier and verify immediate hunt/attack override.
4. Leave one original alien alive, remove contact, and verify that lone survivor may return to the beacon to call reinforcements.
5. Confirm reinforcement arrivals still rally/search normally.


---

# v0.26.08.07.1345 - Tactical Escort Support Assignment Board + Contact Loop Fix

Browser build `v0.26.08.07.1345_TACTICAL_ESCORT_SUPPORT_ASSIGNMENT_BOARD_AND_CONTACT_LOOP_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-facing escort-support command board

The earlier escort-support decision was global: every currently escorting fire team either kept its supports with the rescue column or every team broke supports off together. That did not give the commander enough control when several fire teams were escorting different civilians/VIPs at the same time.

Build 1345 turns the interrupt into an assignment board:

- **Stay on Escort (left column):** every eligible escort fire team begins here. Supporting soldiers remain with their leader and protect the civilian/VIP column.
- **Break Off and Engage (right column):** clicking a team on the left moves it here. Its leader retains escort ownership while the supporting soldiers temporarily use normal combat AI to reinforce the visible alien engagement.
- Clicking a team in the right column moves it back to the left.
- The board shows the fire-team designation, leader, escorted civilian/VIP count, and support names.
- Rearranging the board changes only the pending decision; no team starts moving while the commander is still assigning responsibilities.
- **Apply Escort Decisions** commits the mixed set of choices in one operation and rebuilds only the small streamed AI continuation from the displayed tactical state.

This allows outcomes such as Alpha and Bravo remaining on escort duty while Foxtrot and Golf break off, rather than requiring one answer for the entire response force.

## Foxtrot repeated-popup loop: root cause and fix

The old handler deliberately cleared the current AI playback after a Stay/Break Off choice so the simulator could rebuild from the newly selected support doctrine. The same temporary `aiPlayback = null` transition also reset `escortSupportContactActiveRef`. When the rebuilt playback immediately showed the same still-visible alien, the contact gate concluded that this was a new contact and reopened the popup. A player could therefore choose **Break Off To Support** for Foxtrot repeatedly without ever escaping the decision loop.

Build 1345 separates **playback ownership** from **contact-episode ownership**:

- Clearing/rebuilding streamed AI playback no longer clears the active escort-contact episode.
- An empty setup frame during the replan does not clear the episode either.
- The episode is released only when a **phase-complete** AI frame contains no visible living aliens.
- The active episode and any open assignment board are retained in the live tactical cache across renderer/remount recovery.
- The same engagement therefore cannot repeatedly re-prompt solely because the AI continuation was invalidated and regenerated.
- After a genuine clear interval, a later newly spotted contact is allowed to open a new assignment board.

## Break-off return normalization

The 1015 behavior already caused detached supports to move back toward their escort leader once no active alien threat remained, but the stored team mode could remain `breakoff`. Build 1345 normalizes that mode back to `stay` when the escort AI processes a quiet/no-threat state.

This gives the state machine a clean lifecycle:

1. new visible contact -> assignment board;
2. player commits per-team stay/break-off choices;
3. break-off supports fight while their leader continues escorting;
4. visible engagement ends;
5. affected teams return to `stay` and re-form around their escort leader;
6. a later genuinely new contact may request a new decision.

## Streaming AI integration

The 1300 one-round streaming architecture remains authoritative.

- The assignment popup pauses frame advancement.
- Applying decisions invalidates the current one-round look-ahead rather than a long precomputed battle.
- AI resumes from the currently displayed positions, HP, TU, ammunition, escorts, fire-team identities, cover state, explored cells, reinforcement state, and selected mixed escort-support modes.
- No future movement is committed while the assignment board is open.

## Validation

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct mixed-assignment helper validation confirms one team can remain `stay` while another is `breakoff` in the same atomic decision.
- Build Health adds a regression for the two-column board and contact-loop guard.
- Static `*Test` scan reports 355 unique symbols and 354 declarations; the only unmatched token remains the existing Three.js `depthTest` material property.
- Save format remains 4.

## Manual validation gate

1. Start a mission with multiple escorting fire teams and enable Simulation AI.
2. Spot a living alien and verify all escorting teams appear in the left column.
3. Move Foxtrot to the right, move another team right and back left, then apply.
4. Verify only the final right-column teams detach supports.
5. Verify escort leaders continue their civilian/VIP movement.
6. Verify the same still-visible contact does not repeatedly reopen the popup after the stream rebuild.
7. End the engagement and verify supports return/re-form.
8. Spot aliens in a later new engagement and verify the board can legitimately appear again.

---


# v0.26.08.07.1300 - Tactical AI Streamed Simulation and Playback Fix

Browser build `v0.26.08.07.1300_TACTICAL_AI_STREAMED_SIMULATION_AND_PLAYBACK_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design change

Build 1245 made the manual-to-Simulation-AI handoff cooperative by dividing preparation into two-round chunks with browser yields, but it still completed the entire bounded continuation before normal playback began. A battle that eventually needed twenty or forty rounds therefore remained an up-front computation problem even though the browser was allowed to repaint between chunks.

Build 1300 changes the ownership model to **streamed AI simulation**:

1. capture the authoritative live battlefield;
2. prepare one tactical round;
3. begin playback immediately;
4. while the player watches that buffered round, prepare at most one additional round;
5. append that round to playback only if the same AI stream is still authoritative;
6. repeat until the mission reaches a real terminal result or the existing safety interval returns command to the player.

The simulator is still deterministic and simulation-side. This is a scheduling/buffering change, not a move toward visual-layer AI or approximate combat.

## One-round batch contract

`resolveMissionAiStreamBatchAsync(...)` requests one round from the existing continuation-capable `resolveMission(...)` implementation.

- Nonterminal intermediate rounds use `simulationChunkOnly` and return `tacticalChunkContinuation` before mission-end growth/casualty processing.
- The continuation contains current units, HP, TU, ammunition, medkits, fire-team/order state, cover damage, explored cells, reinforcement state, extraction geometry, alien-contact state, and tactical round.
- The next round starts exclusively from that continuation snapshot.
- The last allowed safety batch uses the existing final continuation behavior so a still-unresolved battle returns live survivors to player control.
- A terminal batch performs the normal final result processing exactly once.

## Bounded look-ahead

The player-facing playback queue is intentionally not allowed to become another hidden all-upfront simulation.

- Initial playback contains only the first prepared batch.
- The next batch may be requested when playback has entered the current batch.
- Once appended, another batch is not requested until playback reaches the newly appended batch.
- Therefore the simulator can hold **at most one tactical round ahead of what the player is currently watching**.
- A no-action/no-visible-frame round is allowed to advance to another one-round batch after a browser yield so an empty batch cannot deadlock the stream.

This reduces initial takeover latency, bounds future-frame memory, and makes Command Map replanning cheaper because only a small amount of predicted future state can be discarded.

## End-of-buffer behavior

A temporary end of buffered playback is not a mission ending.

- `aiResolutionPending` includes `streamPending` and `streamContinuation` ownership in addition to ordinary unplayed frames.
- Tactical-map playback replaces `Continue Mission Result` with `AI thinking one round ahead...` while future streamed work is pending.
- The classic overlay applies the same guard.
- When the appended round arrives, normal playback resumes from the next frame.

## Command ownership and cancellation

Streaming introduces asynchronous work that must never overwrite a newer player decision. Build 1300 adds stream epochs/tokens for that purpose.

- Handing command to AI starts a new authoritative stream token.
- Take Back Control invalidates the token before restoring human command.
- Issuing or clearing a Command Map order invalidates the queued future batch and restarts Simulation AI from the currently displayed live battlefield.
- A completed stale async batch checks its token and is discarded rather than mutating the new state.
- Pausing may retain the one already-generated look-ahead round, but further round generation is blocked while planning remains paused.

## Save/reload recovery

An async computation itself cannot survive a browser reload. A saved `streamPending: true` value would therefore be stale after restoration.

Cached playback now restores with:

- `streamPending` reset to false;
- runtime stream token reset to the current session token;
- the stored authoritative continuation retained.

The streaming effect can then regenerate the next one-round batch from the saved continuation rather than waiting for a vanished Promise.

## Failure recovery

If a future look-ahead batch throws an exception:

- already displayed/buffered tactical state remains valid;
- the failed future continuation is discarded;
- the playback is marked for safe tactical continuation rather than mission completion;
- the tactical log reports the look-ahead failure;
- control can return to the player without inventing casualties or victory.

## Progress UI

The `Transferring Tactical Command` screen remains but its purpose is narrower and more accurate. It now reports preparation of the **first streamed AI tactical round**. Its explanatory text states that normal playback starts after that first round and the AI keeps at most one round of look-ahead afterward.

Command Map rebuilds use the same short initial-stream preparation path.

## Preserved systems

- 1245 continuation-mode deployment bypass and browser yield before AI work.
- 1215 one-movement-commit and productive-progress path scoring.
- 1015 friendly-traffic re-pathing, fire-team cohesion, unique living-soldier occupancy, escort support decisions, and interceptor swarm.
- 1145 immutable defeated-UFO target snapshot.
- Event timeline, movement trails, reinforcement arrival staging, Field Beacon rules, VIP terminal-rescue rules, manual control override, and false-total-loss prevention.
- Save format 4.

## Validation

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Build Health retains the 1245 AI handoff optimization test.
- Build Health adds `Simulation AI streams one-round playback batches with at most one round of look-ahead`.
- Static test-symbol scan finds 354 `*Test` symbols and 353 declarations; the only unmatched token remains Three.js `depthTest`, which is not a regression-test reference.
- The obsolete all-upfront `resolveMissionForAiHandoffAsync(...)` helper is absent.
- The streamed implementation contains one-round batching, continuation snapshots, one-batch prefetch gating, async token invalidation, end-of-buffer result guards, and reload recovery.
- The start-screen concise version derives from `CURRENT_GAME_BUILD` as `v0.26.08.07.1300`.

## Manual validation gate

The most important test is the previously slow handoff on a large live battle. Playback should begin after roughly one tactical round of calculation rather than after the entire future encounter is known. While watching, occasional short `AI thinking one round ahead...` pauses are acceptable if the simulator cannot keep up with playback; repeated browser timeout/not-responding notifications are not.

Also validate Take Back Control during playback, Command Map pause/replan/resume, save/reload during streamed AI ownership, terminal mission completion, and the 72-round unresolved safety return.

---

# v0.26.08.07.1245 - Tactical AI Handoff Progressive Loading and Chunked Simulation Fix

Browser build `v0.26.08.07.1245_TACTICAL_AI_HANDOFF_PROGRESSIVE_LOADING_AND_CHUNKED_SIMULATION_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-reported behavior

Confirming Simulation AI Command takeover of an already-live tactical battle could cause the browser to present at least two timeout / page-not-responding notifications before AI playback appeared. The existing tactical mission startup already had a yielding preparation screen, but the manual-to-AI handoff still performed its entire continuation simulation synchronously inside the confirmation action.

## Source diagnosis

Two sources of avoidable main-thread blocking were confirmed.

First, `resolveMission(...)` called `tacticalDeployment(...)` before checking whether `initialBattleState` represented a live continuation. During AI takeover the newly generated deployment was discarded because the simulator correctly inherited the current battlefield instead. This meant an expensive deployment-generation pass could occur for no gameplay benefit.

Second, continuation AI used a single synchronous `while` loop with a 72-round safety interval. Complex rescue/search/reinforcement battles could therefore perform pathfinding, visibility, fire-team reconciliation, movement trails, reaction fire, alien turns, and frame construction for many rounds without yielding to the browser.

## Continuation deployment bypass

`resolveMission(...)` now establishes `continuing` before deployment creation.

- Fresh simulations continue to call `tacticalDeployment(...)`.
- Live tactical continuations set deployment to `null` and derive grid size, units, covers, Skyranger/extraction geometry, round, explored cells, and reinforcement state entirely from `initialBattleState`.
- No tactical map is regenerated during manual-to-AI ownership transfer.

## Cooperative simulation chunks

`resolveMission(...)` now accepts bounded `maxRoundsOverride` and `simulationChunkOnly` controls used by the AI handoff wrapper. When a chunk reaches its local limit while the battle is still unresolved, it returns an authoritative continuation snapshot before mission-end post-processing.

`resolveMissionForAiHandoffAsync(...)` then:

1. captures the current live battle;
2. yields to the browser so the progress overlay can paint;
3. simulates two tactical rounds;
4. captures the resulting units, cover state, explored cells, reinforcement state, extraction geometry, and next round;
5. refreshes living AEGIS TU for the next tactical round, matching the previous continuous-loop behavior;
6. yields again before the next chunk;
7. repeats until a real terminal result occurs or the existing overall safety interval is reached;
8. prepares the accumulated sequential playback frames and hands control to the normal playback system.

Intermediate chunks do not roll end-of-mission stat increases, casualty records, or operation results, preventing artificial post-processing between checkpoints. Final mission processing remains on the terminal/final safety chunk.

## AI handoff progress overlay

Confirming AI takeover now displays a full-screen `Transferring Tactical Command` panel with a progress bar and stage text. It reports live-state capture, current tactical-round checkpoint ranges, and final playback preparation.

The same progressive pipeline is used when Simulation AI must be rebuilt after player Command Map orders. An exception during preparation restores player control and writes a readable tactical-log error instead of leaving command ownership in an ambiguous state.

## Preserved tactical authority

This is a scheduling/performance correction rather than an AI balance rewrite. Movement/path scoring, fire-team doctrine, one-route-per-round behavior from 1215, friendly-traffic deferral, reaction fire, TU/ammunition costs, alien reinforcement cadence, rescue logic, fog/visibility, damage, and final mission resolution remain simulation-side.

## Validation

- All non-empty embedded JavaScript blocks pass syntax validation.
- Build Health contains a dedicated AI-handoff optimization contract.
- The contract verifies continuation simulation skips deployment generation, supports chunk-only continuation snapshots, yields between chunks, defaults to two-round chunks, and exposes the progress UI.
- Save format remains 4.
- Start-screen version remains derived from `CURRENT_GAME_BUILD` and displays `v0.26.08.07.1245`.

## Manual validation gate

The primary manual gate is the original failure path: take over an active tactical battle with Simulation AI and verify the loading panel paints immediately, advances through checkpoints, and reaches playback without repeated browser timeout notifications. Long rescue/search battles and Command Map rebuilds should also be tested because they maximize continuation-simulation work.

---


# v0.26.08.07.1215 - Tactical AI Path Coherence and Single-Move Commit Fix

Browser build `v0.26.08.07.1215_TACTICAL_AI_PATH_COHERENCE_AND_SINGLE_MOVE_COMMIT_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-reported behavior

AI-controlled AEGIS soldiers were still showing visibly odd movement: long winding routes, routes that appeared to spend movement without useful progress, and trails that could double back on themselves during one rendered AI turn.

## Source diagnosis

The low-level `tacticalPath(...)` helper was not the source of literal loops. It uses breadth-first traversal with a visited-cell set, so one path returned by that function cannot revisit the same hex.

Two higher-level behaviors were responsible for the apparent path instability:

1. A human AI soldier could commit more than one movement plan in a single tactical round. A successful normal movement could be followed by fallback patrol, and direct-contact response could move toward a reported location and then immediately initiate a second movement plan after discovering an alien.
2. The generic human movement scorer gave a positive bonus for `cell.steps`. That could make an unnecessarily long candidate more attractive simply because it used more movement steps, even when those steps produced little additional progress toward the current target.

## Single movement commit per tactical round

Build 1215 adds `roundMovementCommittedIds` to the human AI phase plus the helper `tacticalAiMovementCommitAllowed(...)`.

- A soldier may commit at most one locomotion route in one tactical round.
- A second movement-plan attempt for that same soldier is rejected until the next round.
- Post-move facing, fire, reaction, targeting, reload, and other action resolution still function normally.
- The fallback patrol branch now requires that the soldier has not already committed movement.
- Friendly-traffic defer/re-path still happens before commitment, so waiting for a teammate to clear the lane can still produce the better first-and-only route.

This turns each soldier's visible playback into one coherent movement decision rather than a concatenation of unrelated routes.

## Human path-efficiency scoring

`tacticalAiPathEfficiencyMetrics(...)` separates candidate movement into:

- net progress toward the target;
- productive steps that contribute to that progress;
- detour steps that consume movement without equivalent target progress.

Human AI scoring now gives a small reward to productive movement and penalizes excess detour movement. Target progress remains the primary directional signal. The result should favor a shorter, more legible route when two candidates offer similar tactical value.

The correction does not convert tactical movement into naive straight-line movement. Hard cover, occupied cells, doors, buildings, map boundaries, fire-team formation targets, command destinations, threat/cover scoring, and bounded pathfinding still apply. A longer route remains legal when terrain or tactical requirements actually require it.

Alien movement keeps the prior movement-step scoring to avoid silently changing alien combat behavior in a soldier-pathing patch.

## Regression coverage

Build Health adds:

- `AI movement commits one coherent route per soldier per round and penalizes nonproductive detours`

The contract verifies that a first movement commit is allowed, a second positive-step commit for the same soldier is blocked, zero-step/nonmovement resolution remains allowed, direct progress has zero detour cost, a deliberately overlong path to the same endpoint is classified as detour movement, and the live planner/simulation source contains the new scoring and movement-commit guards.

## Validation completed

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct path-coherence / single-move contract returns `true`.
- Static test scan reports 352 `*Test` symbols / 351 declarations; the only unmatched token is the existing Three.js material property `depthTest`.
- The start-screen version derives from `CURRENT_GAME_BUILD` and displays `v0.26.08.07.1215`.
- Save format remains 4.

## Manual validation gate

1. Run AI-controlled tactical missions on open, urban, and building-heavy maps.
2. Watch a soldier's full movement trail and confirm it contains one committed movement route per tactical round rather than a main route plus fallback reversal.
3. Confirm search and formation movement usually favor direct useful progress when no real obstacle requires a detour.
4. Confirm friendly-traffic deferral still waits for a pending teammate and then chooses the cleaner route.
5. Confirm soldiers may still fire normally after moving and do not lose combat responses simply because a second locomotion plan is refused.
6. Confirm necessary obstacle/door/building detours still work and no new stalls appear.

---

# v0.26.08.07.1145 - Interceptor Swarm Target Snapshot Null Fix

Browser build `v0.26.08.07.1145_INTERCEPTOR_SWARM_TARGET_SNAPSHOT_NULL_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-reported failure

After launching **All Bases** interceptors at a UFO while Skyrangers were simultaneously traveling to an incident, Geoscape time could run for a short period and then display:

`Runtime error: Uncaught TypeError: Cannot read properties of null (reading 'id')`

The captured stack identified the actionable application frame as `index.html:5605:152`, inside an `Array.some` callback in the staggered swarm shootdown path.

## Confirmed root cause

The swarm shootdown effect used this sequence conceptually:

1. resolve a successful interceptor pass against the mutable local variable `target`;
2. queue `setMissions(old => old.some(... target.id ...))` to add the crash site;
3. continue the same effect and assign `target = null` so later inbound sorties abort;
4. React executes the queued functional state updater after the effect has continued;
5. the updater reads `target.id`, but `target` is now null.

This was a JavaScript closure/state-scheduling race, not an invalid UFO record, corrupt save, Skyranger ownership error, or ferry-range failure. Simultaneous Skyranger travel made the failure easier to encounter because the Geoscape clock continued advancing while the staggered swarm effects resolved.

## Implemented correction

- The successful shootdown branch now snapshots the UFO into `defeatedTarget` and its identity into `defeatedTargetId` before any queued state update is created.
- Crash-site mission insertion now uses `appendCrashMissionOnceForTarget(...)`, which receives the immutable captured ID rather than closing over the mutable `target` variable.
- The de-duplication helper tolerates null/legacy mission entries with optional ID access instead of assuming every array entry is a valid object.
- Crash-site report creation, shootdown text, and contact removal use the defeated-target snapshot for the entire branch.
- Only after those synchronous values are captured does the swarm set its working `target` to null and abort remaining inbound aircraft.
- All other 1015 global swarm behavior remains unchanged: independent staggered ETAs, per-sortie combat, target-destroyed aborts, ferry routing, home-base/home-hangar preservation, and normal aircraft recovery.

## Regression coverage

Build Health adds:

- `Interceptor swarm shootdown snapshots target identity before queued mission state updates`

The direct regression deliberately captures a UFO ID, sets the mutable working target to null, then verifies crash-site insertion and de-duplication still succeed using the snapshot.

## Validation completed

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct target-snapshot regression: `true`.
- Static `*Test` symbol scan: 351 references / 350 declarations; the only unmatched token remains the existing Three.js material property `depthTest`, not a missing test function.
- The exact old swarm closure `mission.sourceCraftId===target.id` is absent from the current swarm resolution block.
- The new crash-site updater is bound to `defeatedTargetId`.
- Start-screen version continues to derive from `CURRENT_GAME_BUILD` and therefore displays `v0.26.08.07.1145`.
- Save format remains 4.

## Manual validation gate

1. Detect a flying UFO and launch `All Bases`.
2. While that swarm is outbound, launch one or more Skyrangers to an incident.
3. Run Geoscape time until an interceptor achieves a confirmed shootdown.
4. Confirm a single crash-site mission is created without a runtime overlay.
5. Confirm still-inbound interceptors abort from their current positions and route toward their permanent home bases.
6. Let the Skyrangers continue independently to their incident and confirm their travel/tactical ownership is unaffected.
7. Save/reload during the overlapping aircraft operations and repeat the completion path.

---

# v0.26.08.07.1015 - Global Interceptor Swarm + Tactical Cohesion / Beacon Fix

Browser build `v0.26.08.07.1015_GLOBAL_INTERCEPTOR_SWARM_AND_TACTICAL_COHESION_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Tactical: current incidents now actually use the Alien Field Beacon

The Alien Field Beacon foundation had been added to one tactical deployment implementation, but the effective multi-Skyranger deployment override still used the older insertion logic. Fresh incidents could therefore lack a beacon record and legitimately fall through to the legacy purple reinforcement saucer path.

Build 1015 merges beacon creation into the effective multi-transport deployment path. Current-build tactical incidents create exactly one active Alien Field Beacon regardless of whether one or two Skyrangers deploy. The purple saucer remains a compatibility path only for genuinely legacy tactical snapshots that predate beacon state.

The six immediately adjacent beacon cells are now reserved as a clear materialization ring. Procedural props/cover are removed from those six cells during deployment before aliens are placed. Starting aliens preferentially occupy that ring, and reinforcement transit can rely on the six one-hex neighbors rather than falling back to a distant ring because map decoration happened to block a pad cell.

## Tactical: dynamic friendly-traffic re-pathing

AI pathfinding still resolves inside the deterministic tactical simulation rather than inside the visual animation layer, preserving TU cost, visibility, reaction fire, casualty, save/reload, and replay consistency. The scheduler is now more willing to defer an AI soldier when a route is longer primarily because a friendly soldier who has not acted yet occupies the direct lane.

- A one-step avoidable detour is sufficient to qualify for defer/re-path rather than requiring a two-step penalty.
- The blocking friendly acts first when appropriate.
- The deferred soldier then calculates against the updated occupied-cell map.
- Movement trails continue recording the final chosen route for step-by-step playback.
- Static terrain, hostile occupancy, cover, map boundaries, and true impassable cells still force normal detours.

## Tactical: strict fire-team assembly pacing

The half-speed leader rule now depends on supports actually occupying their current formation cells instead of relying on a stale or prematurely asserted `formationReady` state.

At initial deployment and after a firefight/regroup:

- a multi-soldier fire-team leader remains capped at half normal movement until supporting soldiers occupy the triangle, spaced-file, diamond, doorway-flank, or escort slots within the established tolerance;
- after the team is genuinely formed, leader pace is limited by the slowest active member;
- only the existing active visible-alien rush rule may override AI pacing;
- player-controlled movement remains exempt from all AI formation pacing.

## Tactical: unique living-soldier hex invariant

Living AEGIS soldiers may not finish a completed tactical movement/action state on the same hex.

- Destination planning treats other living soldiers as occupied.
- Deferred friendly-traffic re-pathing rechecks occupancy against the current state.
- Post-move/tactical-state repair resolves any legacy or edge-case overlap deterministically to the nearest valid open cell.
- Dead units do not reserve a living-unit destination.

This invariant is intended to prevent re-pathing and fire-team regrouping from trading long detours for stacked soldiers.

## Tactical: escort support response decision

When any AEGIS soldier spots one or more living aliens while a fire-team leader is actively escorting civilians/VIPs, tactical play can pause for an escort-support decision covering the affected escort teams:

- **Stay With Escort** — supporting soldiers remain with their fire-team leader and continue protecting the civilian/VIP column.
- **Break Off To Support** — supporting soldiers temporarily leave the escort formation and use normal combat AI to move toward/reinforce the visible alien engagement.

The escort leader continues the rescue assignment in either case. Once no living alien is currently visible/engaged, detached supports automatically path back to their original fire-team leader and resume the applicable escort formation. Leadership succession and existing fire-team identities remain intact.

## Strategic air combat: All Bases interceptor swarm

Detected flying UFOs now expose an `All Bases (N)` response. It selects every **Ready** interceptor that has a legal direct or staged ferry-network route to the contact, across all bases, while reserving staging hangars so two aircraft cannot claim the same transient slot.

Each interceptor is tracked as an independent sortie inside one swarm operation:

- aircraft launch from their actual current bases;
- direct and staged ferry routes remain independent;
- attack ETAs are staggered according to each aircraft's route and travel time;
- each aircraft attacks only when it reaches its own impact time;
- earlier aircraft can damage the UFO before later attack passes arrive;
- aircraft that have already completed their pass continue their normal home-return route;
- if any pass destroys the UFO, every aircraft still inbound immediately aborts pursuit from its current interpolated route position;
- an aborted aircraft first returns to a sensible route/ferry anchor, then follows normal ferry-network routing/refueling toward its permanent home base;
- permanent `homeBase` / `homeHangarKey` ownership is preserved, so a staging base never silently becomes the aircraft's home;
- aborted aircraft incur no fictitious combat damage and recover Ready when they reach home; aircraft that actually fought retain normal damage/repair outcomes;
- the strategic route panel shows the independent aircraft, phases, and remaining ETAs.

`All Bases` does not launch an aircraft that is Repairing, otherwise unavailable, or has no legal route under the existing range/fuel/ferry/hangar rules. When every stationed interceptor is Ready and routable, all of them participate.

If the UFO is destroyed while an aircraft is still outbound, that aircraft does not teleport home and does not vanish. It turns around from its current route position and finishes a clock-driven return journey.

## Preserved systems

- 2115 observed reinforcement disembarkation staging and visibility hardening.
- 1515 actual movement-trail tactical playback.
- Alien Field Beacon destruction and reinforcement cancellation.
- Manual-control override of fire-team movement and rescue restrictions.
- Tactical Command Map and temporary fire-team orders.
- VIP terminal rescue, reinforcement difficulty, and survivor-preservation rules.
- Atomic multi-Skyranger launch and staged per-leg Skyranger fuel behavior.
- Start-screen version is derived from the authoritative build ID and displays `v0.26.08.07.1015`.

## Regression / validation coverage

Build Health and direct executable contracts cover:

- current two-Skyranger deployment creates exactly one beacon and selects beacon reinforcement deployment;
- the first six starting-alien positions are in the clear six-cell beacon ring when six cells are required;
- friendly-traffic defer/re-path triggers even for a one-step avoidable detour;
- fire-team leader half pacing remains active until actual formation occupancy;
- living-soldier end-state hexes are unique;
- escort-support stay/break-off behavior and automatic return;
- movement trails beyond the historical eight-hex playback cap;
- all-bases swarm option reservation across multiple launch bases and independent travel progression;
- target-destroyed abort-return route construction points to the aircraft's home base.

Full Chromium gameplay remains a manual validation gate in this tool environment because the container's browser sandbox/zygote startup is unreliable. Syntax, package integrity, static Build Health resolution, and direct Node contracts are required before handoff.


# v0.26.08.06.2115 - Tactical Reinforcement Disembarkation Visibility Fix

Browser build `v0.26.08.06.2115_TACTICAL_REINFORCEMENT_DISEMBARKATION_VISIBILITY_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problem corrected

The 1145 arrival-integrity work guaranteed that a legacy reinforcement saucer could not count as successfully landed unless the complete requested alien group had valid spawn cells. A second presentation gap remained: the craft renderer considered the saucer observed when any hull or ramp footprint cell was inside AEGIS visibility, while individual alien rendering still required each alien's own hex to be in the current vision cone and line of sight. The rear ramp could therefore be hidden behind the craft even though the saucer itself was visible. AI playback also advanced a phase-complete landing frame after roughly 500 ms, making a legitimate deployment very easy to miss.

## Implemented reinforcement staging

- Reinforcement arrival records whether the beacon or legacy dropship was actually observed by AEGIS at the moment of deployment.
- An observed landing gets an explicit `reinforcementLanding` playback frame containing deployment kind, wave number, troop count, and deployment coordinates.
- Just-arrived reinforcement units receive a frame-local visibility override only for that observed deployment frame. This does not permanently reveal aliens after they move back into fog.
- 2D Hex and Three.js tactical rendering both respect the temporary observed-disembarkation visibility flag.
- The AI action camera focuses the observed beacon or dropship deployment point before subsequent movement.
- Observed AI landing frames remain on screen for about 2.2 seconds before playback advances; unobserved arrival frames receive a shorter 1.2-second safety beat instead of the former 0.5-second phase-complete delay.
- During manual tactical play, an observed arrival remains staged for roughly 1.25 seconds before the alien turn begins moving the new units.
- Once the arrival beat ends, normal fog-of-war and vision-cone rules immediately resume.

## Compatibility

New tactical battlefields continue to use the Alien Field Beacon. A visible purple saucer therefore normally indicates a legacy tactical state created before the beacon foundation or another compatibility path with no beacon record. Those legacy battles remain supported and now receive the stronger disembarkation presentation.

## Regression coverage

Build Health now includes `Observed reinforcement arrivals visibly stage complete troops before AI movement resumes`. The contract checks the temporary alien visibility override, explicit reinforcement landing frame metadata, Three.js support, and the presence of the observed-arrival path.

---


# v0.26.08.06.1515 - Tactical AI Movement Trail Playback Fix

Browser build `v0.26.08.06.1515_TACTICAL_AI_MOVEMENT_TRAIL_PLAYBACK_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problem corrected

AI-controlled tactical turns could perform more than one movement plan before the next rendered frame. The simulator stored only the unit’s final coordinates, while tactical playback animated movement only when frame-to-frame displacement was eight hexes or less. When combined movement exceeded that cutoff, the soldier or alien appeared directly on the destination hex and the movement-delay estimator also returned no delay.

## Implemented movement trails

- Simulation frames can now store `movementTrails` keyed by tactical unit ID.
- Normal human AI movement appends the actual path produced by the movement planner.
- Fire-team VIP/civilian rescue movement records leader and follower movement step by step.
- Alien movement records every traversed cell, including movement interrupted by reaction fire.
- Panic civilian movement contributes its resolved route.
- Multiple movement plans by the same unit in one half-turn append into one continuous trail without duplicate junction cells.
- Playback consumes the recorded route rather than applying the old eight-hex displacement cutoff.
- A legacy/recovery fallback reconstructs a longer route when an older frame lacks a recorded trail.
- Units selected for animation stay at their previously displayed hex until playback advances them through the trail.
- Playback timing is calculated from the full path length so the next frame cannot overtake a long movement animation.

## Gameplay continuity

This is a presentation/synchronization fix. It does not change movement TU costs, fire-team pacing, player manual movement, AI destination selection, rescue priorities, cover rules, reaction fire, search doctrine, or mission balance.

## Regression coverage

Build Health now includes `AI tactical playback preserves movement trails beyond the old eight-hex frame cap`. The direct contract verifies a nine-step combined trail survives append/snapshot/replay and reaches the intended final hex without the former snap condition.

---


# v0.26.08.06.1245 - Alien Field Beacon Boot Null Guard

Browser build `v0.26.08.06.1245_ALIEN_FIELD_BEACON_BOOT_NULL_GUARD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problem corrected

The 1145 beacon regression test was evaluated during application startup and constructed an observer using `beacon.x` before confirming that the deployment had produced a valid beacon record. A null diagnostic fixture therefore raised `Cannot read properties of null (reading 'x')` and could prevent the start screen from loading.

## Implemented safeguards

- Beacon contract fixtures validate deployment, beacon, first alien cell, and numeric coordinates before use.
- The foundation diagnostic is enclosed in a safe failure boundary and returns `false` rather than throwing.
- Beacon creation rejects missing, blank, null, and non-numeric coordinates.
- Beacon spawn-cell generation returns an empty result for invalid beacon coordinates.
- Build Health includes a dedicated boot-null-guard regression.
- Runtime error reporting now includes source location and stack details when available, while non-exception resource-load events are ignored by the crash overlay.

## Continuity

No campaign, tactical balance, reinforcement cadence, or save-format rules changed. The Alien Field Beacon foundation from 1145 remains the current playable implementation.

---




# v0.26.08.06.1145 - Alien Field Beacon Foundation and Reinforcement Arrival Integrity

Browser build `v0.26.08.06.1145_TACTICAL_ALIEN_FIELD_BEACON_FOUNDATION_AND_REINFORCEMENT_ARRIVAL_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problems addressed

A reinforcement saucer could become visible near an AEGIS Skyranger while its newly created aliens remained initialized as hidden until a later visibility pass. The arrival routine also allowed the landing to count as successful even when it had produced fewer valid troop spawn cells than the requested wave size. Together, those behaviors could make a real reinforcement event look like an empty craft or create an incomplete deployment.

The alien deployment fiction also lacked a persistent tactical device tying together the starting alien force, reinforcement calls, the alien exfil fallback, later research, and eventual alien-base access.

## Implemented Alien Field Beacon foundation

### New tactical missions

- Every newly generated tactical battlefield places one one-hex `Alien Field Beacon` at the original alien insertion point.
- The starting alien force is positioned around that beacon. The six adjacent hexes are used first; larger initial forces may occupy the next safe ring.
- Original aliens record the beacon as their home point for fallback and emergency-call behavior.
- The beacon begins unshielded with 72 HP and can be targeted and destroyed by ordinary ballistic or energy fire.
- The beacon blocks movement while active and becomes non-blocking when destroyed.
- The 2D battlefield has a dedicated beacon glyph and HP label.
- The Three.js battlefield has a dedicated single-hex alien pedestal, luminous core, ring, and energy-column model.

### Reinforcement transit

- New missions route reinforcement materialization through the active beacon instead of adding another tactical saucer.
- Reinforcement units may occupy only the six hexes immediately surrounding the beacon.
- The full requested group must have valid passable, unoccupied cells before transit completes.
- When any required cell is unavailable, the entire wave remains pending and retries on the following round; a partial or zero-unit deployment cannot count as success.
- All materialized aliens receive the beacon as their home point and retain the existing caller-rally behavior.
- Immediate line-of-sight reconciliation reveals arriving aliens and the beacon whenever AEGIS soldiers can actually see their cells.

### Beacon destruction

- Shooting the beacon reduces its HP using the existing weapon-mode, ammunition, TU, range, and line-of-sight rules.
- Reducing it to zero destroys it, removes its movement block, and cuts off pending reinforcement transit.
- Later reinforcement checks recognize that the mission had a beacon but no longer has an active one, preventing calls from silently falling back to the old insertion-point transmitter.
- The tactical log identifies beacon damage, destruction, obstructed transit, and cancelled reinforcement signals.

## Legacy tactical-save compatibility

A tactical battle already created by an older build may not contain a beacon. Those battles keep the existing purple-saucer reinforcement method rather than receiving a new device in the middle of the operation. The legacy arrival path now also requires the complete reinforcement group to receive valid spawn cells and immediately recalculates visibility before reporting success. This directly addresses the observed visible-but-apparently-empty craft case without regenerating existing battlefields.

## Adaptive beacon progression

### Phase 2: kinetic shield - implemented in Browser 1552

After three destroyed beacons recorded in campaign mission reports, alien deployment doctrine adapts by adding a kinetic barrier to newly deployed beacons. High-speed ballistic projectiles are intercepted, while energy weapons, grenades, and personnel pass through. An encounter's explicit shield state is fixed when its battlefield is generated, so an in-progress mission does not change beneath the player.

### Phase 3: combined kinetic and energy shield - implemented in Browser 1204

After six destroyed beacons recorded in campaign mission reports, newly deployed non-crash beacons upgrade to a combined field that blocks ballistic and directed-energy fire. Slow thrown explosives such as Frag Grenades pass through, and personnel can enter the field physically. The AI requires a grenade-capable team for beacon duty while retaining leader-controlled formation movement.

### Intact disablement paths

- Research several destroyed beacons to decipher their access system and unlock a qualified hacking action.
- Capture or study a live alien commander to discover the short-range command badge.
- Recover that commander badge during a mission and use it from inside the shield to authenticate, collapse the shield, and disable the beacon intact.
- Intact recovery should provide substantially greater research and strategic value than wreckage.

### Strategic and endgame development

- Add a Geoscape alien flyover and beacon-drop event before the tactical incident begins.
- Expand the implemented mission-report beacon-loss history into richer encounter and intact-recovery statistics when the beacon research tree is built.
- Add destroyed and intact beacon research projects.
- Trace beacon endpoints to alien bases.
- Eventually spoof or reverse a captured beacon connection so AEGIS can deploy into an alien base.

## Validation

- All six non-empty embedded JavaScript blocks passed `node --check`.
- A direct executable beacon contract confirmed a three-unit wave materializes only in adjacent cells, is immediately revealed when observed, and is blocked after beacon destruction.
- New arrivals require `spawnCells.length === requestedCount` before committing.
- Legacy saucer arrivals use the same complete-group rule and immediate visibility reconciliation.
- Build Health now includes the Alien Field Beacon foundation regression.
- The concise start-screen version remains derived from `CURRENT_GAME_BUILD` and displays `v0.26.08.06.1145`.
- Save format remains 4; existing campaign saves require no repair.

## Manual test checklist

1. Start a new tactical mission and locate the one-hex beacon near the original alien deployment area.
2. Observe it in both 2D Hex and 3D Iso views.
3. Allow a reinforcement call and verify the entire wave materializes in open adjacent hexes.
4. Place an AEGIS soldier within line of sight and verify no arriving alien remains artificially invisible.
5. Occupy enough surrounding cells to prevent the full wave and verify the transit retries rather than partially deploying.
6. Shoot the beacon to zero HP and verify pending transit is cancelled and later calls do not occur.
7. Load an older live tactical battle with no beacon and verify a legacy saucer still works, with visible ramp troops when observed.


# v0.26.08.06.0735 - Start-Screen Version Synchronization Guard

Browser build `v0.26.08.06.0735_START_SCREEN_VERSION_SYNC_GUARD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problem statement

The 2355 package correctly updated `CURRENT_GAME_BUILD`, save exports, diagnostics, and package names, but the start screen still displayed `v0.26.08.05.2315`. The concise visible version was stored in a second manually maintained constant, allowing it to fall behind later patch builds.

## Implemented correction

- `CURRENT_GAME_BUILD` is now the single authoritative browser release identifier.
- `CURRENT_GAME_VERSION` is derived from the leading version segment of that build identifier instead of being entered separately.
- The start screen explicitly labels the concise value as `Version` and displays the complete build identifier directly beneath it.
- Build Health now verifies that the concise version matches the build prefix and that the start-screen component is bound to both values.

## Permanent release invariant

Every future browser update must change the authoritative `CURRENT_GAME_BUILD`. The visible start-screen version updates automatically from that value. Release packaging should still verify that:

1. the standalone HTML build identifier matches the intended release;
2. the start screen displays the same concise version;
3. the game ZIP and Codex handoff contain byte-identical `index.html` files;
4. patch notes, roadmap header, ZIP name, and HTML filename use the same release version.

## Preserved behavior

- Tactical startup staging, caches, AI, fire teams, Command Map, rescue, reinforcement, alien exfil, aircraft systems, and mission resolution are unchanged.
- Save format remains 4. Existing campaigns require no repair.

## Validation

- All six non-empty embedded JavaScript blocks passed `node --check`.
- Direct extraction confirmed the displayed concise version is `v0.26.08.06.0735` and the full build is `v0.26.08.06.0735_START_SCREEN_VERSION_SYNC_GUARD_INDEX_ONLY_PATCH`.
- The old independently maintained `v0.26.08.05.2315` version constant is no longer present.
- Build Health includes `Start screen version is synchronized with the current build`.
- The standalone, game-package, and Codex copies of `index.html` are byte-identical.


# v0.26.08.05.2355 - Tactical Startup Main-Thread Optimization

Browser build `v0.26.08.05.2355_TACTICAL_STARTUP_MAIN_THREAD_OPTIMIZATION_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Problem statement

Starting an asset-backed tactical mission could make the browser report that the page was not responding, sometimes more than once before the battlefield appeared. The tactical feature set now performs procedural structure planning, street and prop placement, cover generation, Skyranger deployment, alien/civilian placement, fire-team initialization, visibility calculation, event-timeline setup, Command Map preparation, and optional Three.js rendering. Several of those tasks were still performed consecutively in one main-thread startup task.

A second source of unnecessary work existed in the tactical unit-state wrapper. Visibility reconciliation can intentionally return the exact existing unit array when no reveal, memory, or civilian-claim state changed. The wrapper nevertheless passed that unchanged array through battlefield repair, initial-fire-team assignment, and fire-team reconciliation, producing fresh objects and another expensive render pass.

## Implemented optimization

### Yielding tactical preparation gate

New tactical missions now mount a lightweight `TacticalMissionStartup` preparation screen before the full battlefield component. Battlefield construction is divided into short stages with browser yields between them:

1. structure planning;
2. street and scene-cover placement;
3. hard-cover distribution;
4. soft-cover and concealment distribution;
5. Skyranger and unit deployment;
6. final tactical handoff.

The preparation screen provides a stage label and progress bar. It lets the browser paint and process input between generation phases instead of presenting one long uninterrupted task. Existing cached live tactical battles bypass generation and restore directly.

### Deployment caching

Prepared deployment data is cached by mission identity and deployed soldier IDs. The cache is bounded and reuses completed deployment data when the same tactical component is remounted during normal screen recovery. Live tactical-state cache data remains authoritative for a battle already in progress.

### Building-cell spatial cache

Building footprint, perimeter, doorway, and interior lookups are now precomputed into a coordinate map per tactical battlefield. Repeated terrain, prop, cover, 2D-cell, and Three.js queries no longer scan every building plan for the same coordinate. The cache is bounded across recent mission maps.

### No-op unit-update bailout

The tactical `setUnits` wrapper now exits immediately when an updater returns the exact current unit array. This prevents visibility and pre-contact effects from performing battlefield repair and full fire-team reconciliation when nothing actually changed. Real movement, damage, escort, command-order, leadership, casualty, and formation updates still pass through the existing safety and reconciliation pipeline.

### Viewport allocation reduction

The arrays describing the currently visible 2D/3D tactical viewport are memoized by start coordinate and view size. Ordinary UI-state changes no longer allocate the same cell and row coordinate structures repeatedly.

## Preserved behavior

- Tactical map generation rules, cover counts, biome rules, buildings, Skyranger placement, alien count, civilian objectives, fire teams, fog of war, and mission balance are unchanged.
- Manual control, AI Command, Command Map orders, VIP rescue, alien reinforcements, exfil behavior, and mission resolution are unchanged.
- Existing live tactical snapshots restore without regeneration.
- Save format remains 4. No campaign repair or migration is required.

## Validation

- All six non-empty embedded JavaScript blocks passed `node --check`.
- Both tactical render mounts now use the startup gate.
- The chunked battlefield builder contains explicit browser yields between generation phases and inside the hard/soft cover loops.
- The building-cell cache, bounded deployment cache, no-op unit-update bailout, and memoized viewport arrays are present.
- Build Health references resolve except the existing Three.js `depthTest` material property, which is not a test declaration.
- A full browser timing comparison remains the manual gate because Chromium cannot reliably start in the current sandbox/zygote environment.

## Manual performance checklist

- Start several missions across city, small-town, farm, and nature biomes.
- Confirm the tactical preparation screen paints promptly and its progress advances rather than the browser displaying repeated not-responding prompts.
- Confirm generated maps retain expected buildings, cover density, civilians, aliens, Skyrangers, fire teams, fog, and extraction ramps.
- Switch between 2D Hex and 3D Iso after startup and verify normal interaction.
- Save and reload a live tactical battle and confirm it restores directly from cache/save state rather than regenerating a different map.


# v0.26.08.05.2315 - Alien Exfil Homing and Emergency Reinforcement Call

Browser build `v0.26.08.05.2315_TACTICAL_ALIEN_EXFIL_HOMING_AND_EMERGENCY_CALL_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

A surviving alien should not stand indefinitely beside a dead civilian or remain trapped in a map corner simply because its previous target no longer exists. It also should not possess perfect knowledge of an unseen AEGIS soldier's position. Once no living target is visible and no valid living last-known contact remains, the alien should attempt to withdraw to its own support point.

The preferred support point is the most recent alien landing craft ramp. When the battlefield has no landed alien craft, the alien uses the insertion position recorded when it originally spawned as a deterministic field beacon. This preserves the user's intended fiction without requiring every mission archetype to add a second physical craft to the map.

## Target priority

Alien priorities are now:

1. Any visible living VIP, civilian, or AEGIS soldier according to the mission's existing priority rules.
2. A valid last-known position belonging to a target that is still alive and unresolved.
3. Existing reinforcement rally/search doctrine for reinforcement units.
4. Existing mandatory-VIP search doctrine.
5. Exfil toward the latest alien dropship or original insertion beacon.

A dead civilian or dead soldier is not a valid remembered target. Seeing a new living target immediately cancels withdrawal and any pending local call request.

## Exfil movement

Withdrawal uses a dedicated movement planner rather than the general combat-position scoring function.

- It evaluates currently reachable cells under the alien's real TU allowance.
- It prefers a cell that strictly reduces distance to the home target.
- It ignores stale visited-cell penalties that could otherwise make standing still appear preferable.
- It continues respecting hard cover, occupied cells, map boundaries, and reaction fire.
- Two consecutive blocked exfil turns clear stale movement history before the next retry.

This is intentionally narrow: it changes only no-stimulus withdrawal behavior and does not rewrite the normal firefight, VIP hunt, rally, or reinforcement formation AI.

## Emergency call at home

When the alien reaches within one hex of its dropship ramp or insertion beacon, it can transmit an emergency reinforcement request.

- The request enters the existing reinforcement state machine.
- The arrival uses the existing two-round purple-dropship warning.
- Ordinary non-VIP missions retain their one-wave limit.
- Killing the caller before the next reinforcement-state update prevents the request from producing a wave.
- A visible living target overrides the exfil state before the call is armed.

## Persistence and migration

Newly spawned original aliens store their insertion coordinates. Reinforcement aliens store their dropship ramp as home. Tactical snapshots preserve home coordinates, emergency-call state, and exfil stall count.

Older tactical states that lack home coordinates use the alien's current valid location as a safe migration fallback. This may allow an already-stalled legacy alien to call from its current position, but it avoids corrupting or regenerating an active battlefield.

## Validation summary

- All embedded JavaScript passes syntax validation.
- Build Health includes a contract for exfil movement, emergency calling, and visible-target override.
- Static test reference scanning remains clean except for the known Three.js `depthTest` property token.
- Packaged and standalone browser files are byte-identical.

## Manual validation gate

1. Leave one alien alive in an ordinary hunt mission.
2. Let it kill a civilian with no other target visible.
3. Confirm it leaves the body and withdraws instead of remaining in the corner.
4. Confirm it uses a landed alien craft when present and its insertion beacon otherwise.
5. Reveal a living target and confirm immediate attack override.
6. Let it reach home and verify the emergency two-round reinforcement warning.
7. Verify one-wave limits and mission terminal rules remain intact.

---

# v0.26.08.05.2245 - Persistent Command Map and Multi-Team Pause Planning

Browser build `v0.26.08.05.2245_TACTICAL_COMMAND_MAP_PERSISTENT_MULTI_ORDER_PAUSE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

The Tactical Command Map is a command workspace rather than a one-order dialog. It stays open while the commander reviews fire teams, assigns destinations, revises orders, and observes the live tactical state. The player should never need to reopen the map after every fire-team order.

The commander also needs a bounded planning pause during tactical-map AI Command. That pause must not cut a soldier's movement animation in half or leave a partially resolved combat frame. A pause request therefore blocks the next AI frame, allows the current movement/action frame to settle, and then freezes advancement until **Resume Action** is pressed.

## Persistent overlay behavior

The Command Map remains open when the player:

- selects a different fire team;
- issues a movement destination;
- clears an existing destination;
- causes the current AI continuation to be rebuilt;
- resumes AI action after planning;
- watches unit positions, revealed terrain, or order markers update.

Only the explicit **Close** button dismisses the overlay. Closing the overlay does not itself cancel fire-team orders or alter AI control.

## Pause Action control

While tactical-map Simulation AI Command is active, the Command Map provides **Pause Action**.

- If no action animation is underway, automatic frame advancement stops immediately.
- If a soldier or alien is currently moving, firing, falling, or completing the active action frame, the control changes to **Pausing after current action...**.
- The next precomputed frame is blocked as soon as the pause is requested.
- The current frame is allowed to complete its movement and associated result resolution.
- The map then enters a clear paused-planning state.

Manual player control is already decision-paused and does not require a second pause mode. The Pause Action control is therefore enabled for Simulation AI Command rather than ordinary manual turns.

## Multi-fire-team planning

During the paused state, the player can configure the whole deployed force without interruption:

1. Select Alpha Fire Team and place or revise its command point.
2. Select Bravo Fire Team and place a different command point.
3. Continue through Charlie, Delta, and any other living teams.
4. Clear any order that is no longer useful.
5. Press **Resume Action** once the full plan is ready.

The first order issued while paused invalidates the old precomputed continuation because that continuation does not know about the new destination. It does **not** restart the battle immediately. Later orders update the same live tactical state. Resume Action then performs one clean AI rebuild using all final orders.

## Resume and authoritative state

When action resumes, Simulation AI begins from the battlefield currently displayed in the Command Map, including:

- soldier, alien, and civilian/VIP positions;
- HP, TU, ammunition, facing, and escort ownership;
- cover damage and breached walls;
- fog-of-war exploration;
- tactical round and reinforcement state;
- fire-team identity, leadership, role, and formation;
- every active player command destination.

The overlay remains open after Resume Action. This supports an ongoing command-room style of play in which the commander can pause again and adjust the plan without reopening the map.

## Existing command priorities preserved

A player destination remains subordinate to immediate tactical responsibilities:

- currently visible aliens trigger combat doctrine;
- eligible civilians and VIPs trigger rescue doctrine;
- assigned escorts continue toward AEGIS extraction;
- formation assembly and slowest-member pacing remain active;
- a genuine visible-contact rush can override leader pacing;
- leadership succession preserves the team's order;
- reaching the destination clears the order and restores ordinary AI control;
- three stalled turns still clear an unreachable order.

## Persistence

The live tactical cache now retains the Command Map paused-planning state in addition to overlay visibility and selected fire team. Save format remains 4.

## Validation summary

- All six non-empty embedded JavaScript blocks pass `node --check`.
- The old close-on-order call is absent from issue and clear handlers.
- AI auto-advance is gated by both paused and pause-requested states.
- A settling interval prevents the next frame from starting while the current animated frame completes.
- Resume either continues the retained playback or rebuilds it once from current state after orders invalidate the old continuation.
- Static Build Health coverage confirms persistent overlay and pause controls.
- All `*Test` references resolve to declarations.
- Packaged and standalone browser files are byte-identical.

## Manual validation gate

1. Hand a mission with multiple fire teams to tactical-map AI Command.
2. Open Command Map and issue orders to Alpha, Bravo, and Charlie without closing it.
3. Request a pause during an active movement and confirm no following frame begins.
4. While paused, revise multiple team orders and verify the map remains static.
5. Resume once and confirm each team follows its final destination until combat/rescue priority intervenes or the point is reached.
6. Confirm Close is the only action that dismisses the Command Map.

---

# v0.26.08.05.2230 - Tactical Fire-Team Command Map and Temporary Orders

Browser build `v0.26.08.05.2230_TACTICAL_FIRE_TEAM_COMMAND_MAP_AND_TEMPORARY_ORDERS_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

Fire teams remain autonomous tactical units, but the commander needs a lightweight way to direct where a specific team should go without taking manual control of each soldier. A command-map order is therefore a temporary destination for the selected fire-team leader rather than a permanent behavior mode or a rigid waypoint for every member.

The fire team continues to obey its established doctrine while carrying out the order:

- the leader sets direction;
- supports form the appropriate triangle, spaced file, diamond, doorway flank, or escort formation;
- the leader uses half pace while the formation is assembling and matches the slowest active member after formation;
- a currently spotted alien may authorize the existing contact-rush speed override;
- hard cover, occupied cells, breached walls, doors, playable map boundaries, TU reserves, and bounded pathfinding remain authoritative.

## Tactical Command Map

A **Command Map** button is available on the tactical battlefield during player control and tactical-map AI Command.

Opening it displays a top-down hex map with:

- a dropdown containing every living fire team by phonetic designation;
- the selected team's leader and members highlighted on the map;
- leader/support role markers;
- known civilians and VIPs;
- revealed aliens only;
- terrain, buildings, cover, map edges, and persistent fog-of-war;
- the selected team's current command point, when one exists.

The map does not reveal hidden aliens or other information that the deployed soldiers have not legitimately observed.

## Issuing an order

Clicking a passable command-map hex assigns that point to the selected fire team.

- The order is copied to the living members of that fire team so leadership succession preserves it.
- The highest-ranking/most-experienced current leader owns navigation toward the target.
- Supporting soldiers move according to the existing fire-team formation rules rather than independently pathing to the exact clicked hex.
- A click on blocked or occupied terrain is resolved to the nearest valid open cell when possible.
- The Fire Team Assignment HUD shows the active command coordinates.
- The command map provides an explicit **Clear Order** control.

When an order is issued while tactical-map AI playback is active, the current displayed frame is retained, future precomputed frames are discarded, and AI continuation is rebuilt from the live battlefield with the new order. Positions, HP, ammunition, TU, civilians, cover damage, fog, reinforcement state, and tactical round remain authoritative.

## Priority overrides

A command-map destination never outranks immediate combat or rescue responsibilities.

The order is temporarily suspended when the fire team encounters:

- a currently visible living alien;
- an eligible civilian;
- a tracked or visible VIP;
- an escort already assigned to one of its members;
- another existing mandatory rescue priority.

The team fights, rescues, or extracts under its normal AI doctrine. When the higher-priority situation is resolved, a still-active command order can resume.

## Completion and return to autonomy

When the fire-team leader reaches the selected hex:

- the command target is cleared from every current member of that fire team;
- the tactical log records arrival;
- the Fire Team Assignment HUD removes the player-order line;
- the team immediately returns to ordinary AI search, rescue, formation, and combat priorities until another order is issued.

A safety rule also clears an order after three consecutive AI turns in which the leader cannot make meaningful progress toward it. This prevents an obsolete destination from permanently trapping a team after terrain destruction, unit congestion, or a changed battlefield state.

## Persistence

Temporary fire-team command fields are included in tactical continuation snapshots and AI playback frames. They survive:

- tactical renderer switching;
- AI Command and Take Back Control;
- tactical cache restoration;
- ordinary campaign save/reload while the live tactical state is retained;
- fire-team leader death and succession, provided the team identity remains active.

## Validation summary

- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct helper contracts pass command issuance, team isolation, order lookup, immutable clearing, and in-place AI clearing.
- Static contracts confirm the Command Map button, overlay, top-down team highlighting, temporary order marker, AI target integration, priority text, arrival clearing, and Build Health entry are present.
- The game and Codex packages use byte-identical `index.html` files.
- Chromium headless smoke was attempted but timed out in this environment with DBus/sandbox startup errors before producing a DOM; a full asset-backed browser mission remains the manual gate.

## Manual validation gate

1. Start a tactical mission with at least two fire teams and hand control to tactical-map AI Command.
2. Open Command Map, select Bravo, and confirm only Bravo members are strongly highlighted with its leader distinguished.
3. Click a distant passable hex and confirm the current battlefield is preserved while AI continuation restarts from that point.
4. Confirm Bravo moves toward the marker under formation pacing while Alpha continues its own doctrine.
5. Place an alien or eligible VIP in Bravo's sight and confirm combat/rescue overrides the movement order.
6. After the interruption, confirm Bravo resumes the order when appropriate.
7. Confirm arrival clears the marker and the Fire Team Assignment HUD returns to normal autonomous status.
8. Issue and manually clear another order.

---

# v0.26.08.05.2145 - Last-Alien Fog/Grid Sweep and AI Fire-Team HUD

Browser build `v0.26.08.05.2145_TACTICAL_LAST_ALIEN_SWEEP_AND_AI_FIRE_TEAM_HUD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

AI-controlled alien-hunting missions must not stall because one living alien remains hidden in fog of war, inside a building, or outside the soldiers' ordinary patrol route. When the primary objective has not completed and no living alien is currently observed, fire teams transition from local contact investigation into a map-clearing search doctrine.

The Fire Team Assignment display is also a persistent command aid rather than a manual-selection-only tooltip. It belongs at the top-right of the tactical battlefield and remains available while AI Command is active.

## Last-known-contact search

Before beginning a full sweep, soldiers continue the existing bounded search around a valid last-known alien position. This prevents a recent contact from being abandoned immediately merely because line of sight was lost.

Once that local search is exhausted and a valid living alien still exists without current visual contact, the search doctrine advances to the fog-sweep phase.

## Phase one: fire-team fog sweep

- Every living fire-team leader receives a deterministic search slot.
- The playable battlefield is divided into eight-cell sectors and distributed across the active fire teams.
- Teams select reachable, passable cells that remain unexplored.
- A team keeps its current fog target until it reaches or reveals that area instead of changing direction every turn.
- Hard-cover cells and the protected outer map boundary are rejected as search destinations.
- Newly revealed cells are added to the persistent tactical explored set and carried into later AI frames and save/reload state.
- Seeing a living alien immediately cancels search behavior and restores ordinary combat priority.

## Phase two: deterministic grid sweep

After no passable unexplored cells remain, fire teams begin a full-map alternating lane sweep:

- grid waypoints are spaced approximately five cells apart;
- each horizontal lane reverses direction from the previous lane, producing a systematic back-and-forth pattern;
- waypoints are distributed between active fire teams so they do not all search the same lane;
- building centers and valid door cells are inserted into the sweep plan;
- each team stores its current waypoint and index, then advances only after reaching the assigned area;
- the sweep continues until the hidden alien is discovered, the alien is killed, or another legitimate terminal state occurs.

The doctrine supplements fire-team formation and pacing. It does not constrain manual player movement or manual target selection.

## Fire Team Assignment HUD position and AI visibility

The assignment box now appears at the **top-right** of the battlefield view.

During player control it shows the selected soldier's:

- phonetic fire-team designation;
- current role;
- current fire-team leader;
- active member count.

During AI Command the box remains visible. It follows:

1. the current AI playback actor when that actor is a living AEGIS soldier;
2. otherwise the living soldier nearest the AI action camera;
3. otherwise a deterministic living-soldier fallback.

This keeps Alpha, Bravo, Charlie, and later team identities readable while soldiers move, rescue civilians, search fog, or enter combat under autonomous control. The centered shot-result feedback remains separate and can appear simultaneously.

## Compatibility

- Existing campaigns and tactical snapshots require no repaired save.
- Existing explored cells, fire-team IDs, phonetic designations, and AI playback state remain compatible.
- The new alien-hunt mode, target coordinates, waypoint index, and explored set are preserved in live tactical snapshots.
- Optional rescue rules, mandatory VIP terminal resolution, reinforcement cadence, manual-control overrides, and player-only Skyranger extraction remain unchanged.
- Save format remains 4.
- Native parity remains pending.

## Validation contract

Build Health adds:

- `AI fire teams clear fog and then grid-sweep for hidden final aliens`
- `Fire-team assignment HUD stays top-right during player and AI control`

Validation performed:

- all six non-empty embedded JavaScript blocks passed `node --check`;
- the direct alien-search contract advanced from an unexplored fog target to a legal grid-sweep waypoint and then advanced the waypoint index after arrival;
- the HUD contract confirmed AI-frame actor/camera fallback logic and the top-right battlefield class;
- all 336 `*Test` references resolved to 335 declarations, with the only unmatched token being the existing Three.js material property `depthTest`;
- packaged and standalone HTML copies were verified byte-identical.

## Manual validation gate

1. Run an AI-controlled eliminate-all-aliens mission until at least one alien remains alive but unseen.
2. Confirm the tactical log announces the systematic fog sweep.
3. Watch different fire teams clear different unexplored sectors.
4. After fog is exhausted, confirm the teams follow alternating grid lanes and inspect building doors/interiors.
5. Confirm sighting the hidden alien immediately restores combat behavior.
6. During AI Command, confirm the Fire Team Assignment box remains at the top-right and updates to the active or nearest observed AEGIS soldier.

---

# v0.26.08.05.2030 - Manual Escort Authority and Phonetic Fire-Team Designations

Browser build `v0.26.08.05.2030_TACTICAL_MANUAL_ESCORT_AND_FIRE_TEAM_DESIGNATIONS_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

Manual tactical control overrides AI role restrictions as well as AI movement restrictions. The player may choose any living soldier to make civilian or VIP contact. Fire-team leaders remain the preferred autonomous rescue actors when AI Command is active.

Every fire team also receives a military phonetic designation so the player can immediately understand a selected soldier's tactical element without relying on internal team numbers.

## Manual civilian and VIP contact

During a human-controlled tactical turn:

- Any living selected AEGIS soldier adjacent to a revealed civilian or VIP may spend 8 TU to establish or retry an escort.
- The soldier does not need to be the fire-team leader.
- A selected soldier may escort up to four civilians under the existing capacity rule.
- When multiple eligible VIPs occupy the same building, the selected soldier may contact the group under the existing building-contact behavior.
- Civilians follow the soldier who established the escort and may extract only through player-controlled Skyranger ramps.
- Manual escort interaction does not automatically move supporting soldiers or impose formation pacing.

AI Command retains leader-first rescue doctrine for new contacts. When the player has already assigned civilians to a supporting soldier, AI Command recognizes that existing escort and continues routing it toward AEGIS extraction rather than abandoning or silently reassigning the civilians.

## Phonetic fire-team designations

Fire teams are named in deployment order using the military phonetic alphabet:

- Alpha Fire Team
- Bravo Fire Team
- Charlie Fire Team
- Delta Fire Team
- continuing through Zulu, then Alpha 2 if a future battle ever exceeds 26 active designations.

The designation is unique across the complete deployed response force, not restarted separately for each response squad.

Designation identity is preserved through:

- leader death and succession;
- team redistribution after casualties;
- triangle, spaced-file, diamond, doorway, escort, and combat-spread states;
- manual control and AI Command handoff;
- 2D and Three.js tactical renderer switching;
- live tactical caching and save/reload.

When teams merge, the surviving receiving team keeps its designation. A newly reconstructed legacy team receives the next available deterministic designation.

## Selected-unit fire-team display

Selecting a living soldier now shows a persistent battlefield box at the top-left of the tactical view. It displays:

- the phonetic fire-team name;
- the selected soldier's current role;
- the current fire-team leader;
- the number of active team members.

The existing selected-soldier sidebar also uses the phonetic designation. Temporary shot-result feedback remains centered at the top and does not replace the fire-team assignment display.

## Compatibility

- Existing campaigns and tactical snapshots require no repaired save.
- Legacy tactical teams without designation fields receive deterministic unique designations when reconciled.
- Save format remains 4.
- AI movement pacing, formation behavior, alien reinforcement cadence, VIP terminal-state rules, and extraction-ramp ownership remain unchanged.
- Native parity remains pending.

## Validation contract

Build Health adds:

- `Manual tactical control lets any soldier escort VIPs and shows phonetic fire-team designations`

Direct contracts confirm that a supporting soldier is rejected by the AI leader-only default, accepted when manual authority is explicitly enabled, spends 8 TU, becomes the civilian's escort, and reports Alpha/Bravo designations correctly.

---


# v0.26.08.05.1945 - Manual Tactical Control Formation Override

Browser build `v0.26.08.05.1945_TACTICAL_MANUAL_CONTROL_FORMATION_OVERRIDE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design ruling

Fire teams are an autonomous-AI doctrine. They organize soldiers, pace leaders, flank contacts, and manage rescue formations while AI Command is active, but they do not restrict direct player orders. Taking control of the battle transfers movement authority completely to the player.

## Manual movement authority

During a human tactical turn:

- Every living soldier uses their full legal movement allowance after the player's selected reserve-fire setting.
- Standard movement remains 4 TU per hex with the existing 8-step ceiling.
- A fire-team leader may move ahead of supports, move away from a visible alien, or reposition laterally without any formation-derived reduction.
- The player does not need a spotted-alien rush condition to use full movement.
- Supporting soldiers remain individually selectable and move only when directly ordered.

Normal movement restrictions still apply: hard cover, occupied cells, map edges, insufficient TU, targeting modes, and movement animation locks.

## Highlight and click parity

The reachable-cell overlay and click-to-move path validation now share `tacticalManualMovementStepAllowance`.

This removes the 1745 mismatch in which a cell could be highlighted using full TU but rejected by a second leader-pacing calculation after the click. A path that genuinely becomes invalid now produces a readable log message instead of failing silently.

## Manual escort boundary

The manual override distinguishes civilians from AI-controlled supports:

- Assigned VIPs and civilians continue following their escort leader.
- Alien landing-craft ramps remain excluded from extraction.
- Supporting soldiers do not automatically slide into triangle, file, diamond, doorway, or escort-flank positions when the player moves the leader.
- Supporting soldiers are treated as stationary occupied cells, preventing civilians from moving through or onto them.
- Supporting soldiers do not lose TU because another soldier was manually moved.

The existing rule that the fire-team leader establishes initial VIP contact remains unchanged. This update controls movement automation rather than changing rescue leadership.

## AI Command remains unchanged

When AI Command is active:

- an assembling or reforming leader uses half pace;
- a cohesive leader matches the slowest active member;
- a move closing on a currently spotted living alien may use full speed;
- supports automatically seek formation positions;
- rescue, building-entry, combat-spread, regrouping, succession, and redistribution logic continue to use fire-team doctrine.

Taking control pauses those formation movement constraints. Returning control to AI reactivates them from the current battlefield state without deleting fire-team identities.

## Compatibility

- No save migration or repaired campaign is required.
- Existing tactical snapshots keep their fire-team IDs and roles.
- Save format remains 4.
- Native parity remains pending.

## Validation contract

Build Health adds:

- `Manual tactical control bypasses fire-team pacing and forced support movement`

Static and syntax validation confirms that manual highlights and manual path validation share one full-range helper, manual movement does not invoke leader pacing, and AI movement retains the existing 1745 formation gate.

---


# v0.26.08.05.1745 - Tactical Fire-Team Cohesion Pacing and Contact Rush

Browser build `v0.26.08.05.1745_TACTICAL_FIRE_TEAM_COHESION_PACING_AND_CONTACT_RUSH_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design goal

Fire teams should move as coherent tactical elements rather than allowing a high-TU leader to run several hexes ahead of slower supports. The leader now regulates the team's strategic movement pace while preserving a single emergency exception for closing on a currently observed firefight.

## Cohesion pacing states

### Forming or reforming

- The team evaluates every living support against its current formation target.
- Formation targets include the normal triangle, two-person file, four-person diamond, building-door flank, and VIP escort geometry.
- A support is formation-ready when it occupies its assigned cell or an adjacent legal fallback cell.
- Until every support is ready, the leader's movement allowance is capped at the lower of:
  - half the leader's normal available movement; and
  - the slowest living fire-team member's available movement.
- This gives supports excess movement with which to close the gap rather than allowing the leader to preserve or widen separation.

### Cohesive formation

- Once all supports are ready, the leader may move no faster than the slowest living team member.
- Movement capacity is calculated from current Time Units after reserved-fire costs, using the existing 4 TU per hex and 8-step maximum.
- A depleted or very slow support can force the leader to wait, preserving the unit rather than abandoning that soldier.

## Spotted-alien contact rush

The only pacing override is a real movement plan toward a currently spotted alien:

- At least one living alien must be visible to AEGIS.
- The leader's destination must reduce distance to that visible alien.
- Merely having an alien visible somewhere on the map is not enough when the planned move goes away from the contact.
- Remembered alien locations, casualty distress markers, patrol waypoints, VIP tracker signals, rescue routes, and formation regrouping do not trigger the override.
- Losing current visual contact immediately restores normal cohesion pacing.

## AI tactical integration

- Human AI movement plans are generated normally, then passed through the fire-team pacing gate before positions or TU are committed.
- The gate affects search, patrol, formation, remembered-contact response, combat repositioning, and post-contact regrouping.
- Direct movement that closes on a spotted alien retains the unmodified movement plan.
- Supporting soldiers continue moving toward formation cells using their own movement capacity.
- Unit state records the active pace mode—forming, cohesive, solo, or contact rush—for diagnostics and tactical playback continuity.

## Rescue and escort integration

- Fire-team leaders use the same pacing calculation while searching buildings, contacting VIPs, escorting civilian columns, and returning to player Skyrangers.
- Route length is capped before escort movement begins, so the leader cannot consume more movement than the slowest active team member can support.
- Civilians and support soldiers continue advancing one cell per leader step through the existing formation-aware escort movement.
- Alien sightings do not accelerate an escort unless the generated movement itself is actually toward the spotted firefight.

## Manual tactical integration

- Manual movement of the current fire-team leader obeys forming and cohesive pace caps.
- Clicking a destination that closes distance to a currently visible alien receives the contact-rush exception.
- Manual support movement remains individually controlled and is not treated as leader movement.

## Compatibility

- No campaign migration or repaired save is required.
- New pace fields are optional tactical diagnostics and may be absent from older snapshots.
- Save format remains 4.
- All existing fire-team assignment, succession, redistribution, VIP formation, building entry, and player-only extraction rules remain active.

## Validation contract

Build Health now includes:

- `Fire-team leaders pace formations and only override for a spotted-alien contact rush`

Direct tests verify half-speed forming pace, slowest-member cohesive pace, full-speed approach to a spotted alien, and continued pacing when moving away from that same contact.

A bounded Chromium headless smoke was attempted, but the local browser timed out with DBus/zygote errors before producing a DOM. Full asset-backed tactical validation therefore remains a manual gate.

---

# v0.26.08.05.1545 - Tactical Fire Teams and Player Extraction Ramp Guard

Browser build `v0.26.08.05.1545_TACTICAL_FIRE_TEAMS_AND_PLAYER_EXTRACTION_RAMP_GUARD_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design goals

This update fixes a rescue-path ownership error and introduces the first complete browser implementation of automatic tactical fire teams. The tactical AI should no longer behave as a loose collection of independent soldiers during movement and rescue operations. Each response squad now subdivides into small ranked elements that move, search, fight, escort, absorb casualties, and regroup together.

The formation geometry treats the requested “one more space away” spacing as **hex distance two from the fire-team leader**. In a standard three-person team, the two supporting soldiers occupy the rear-left and rear-right points at distance two, leaving the intervening center hex open. When a single VIP is escorted, that center hex is reserved for the VIP.

## Player-only extraction ownership

- Alien reinforcement saucers remain physical craft with ramps, but their ramps are no longer eligible extraction cells.
- Rescue routing now derives its corridors only from player-controlled Skyranger craft records.
- A mixed placement containing one or more Skyrangers and an alien landing craft filters the alien craft before calculating extraction corridors, ramp distance, rescue-perimeter anchors, or civilian extraction.
- Manual and AI-controlled civilian movement share the same player-only extraction check.
- An alien ramp may still be crossed as ordinary passable terrain when otherwise legal, but entering it cannot mark a civilian or VIP as rescued.

## Automatic fire-team creation

At tactical deployment, each selected response squad organizes its own soldiers before moving out:

- Fire teams normally contain three soldiers.
- The number of teams is chosen to favor groups of three while allowing a bounded fourth member where the squad has an extra survivor.
- Team leaders are selected by rank first, then mission experience, bravery, reactions, and deterministic ID tie-breaking.
- The highest-qualified soldiers are distributed across the available teams so one team does not consume every veteran leader.
- Fire-team identity, squad identity, leader ID, role, and remembered building entry are stored on tactical soldier state and carried through AI handoff, renderer changes, and live tactical caching.

## Formation geometry

### Three-person standard formation

- Leader occupies the forward point and determines facing.
- Left support occupies the rear-left point at hex distance two.
- Right support occupies the rear-right point at hex distance two.
- The central hex directly behind the leader remains open for an escorted VIP.

### Two-person reduced formation

- The senior soldier becomes leader.
- The supporting soldier moves two hexes directly behind the leader.
- One empty hex remains between them, creating the requested spaced single-file element.

### Four-person diamond

- A three-person triangle gains a rear member.
- The fourth soldier occupies the position behind and between the two supporting soldiers.
- This occurs when a lone survivor joins a full three-person team or when the squad begins with a four-person remainder that is best kept together.

### Solo survivor

- A lone fire-team survivor moves toward the nearest viable team.
- A lone survivor joins a two-person team to restore a three-person triangle.
- A lone survivor joins a three-person team as the rear member of a four-person diamond.
- When only a four-person team is available, its lowest-priority nonleader separates and joins the lone survivor, producing a three-person team and a spaced two-person team.

## Casualty succession and redistribution

Fire teams reconcile at the start of AI rounds and after live tactical state changes:

- When a leader dies, the highest-ranked and most experienced surviving member becomes the new leader.
- A four-person team meeting a two-person team transfers its lowest-priority nonleader, producing two three-person teams.
- A four-person team meeting a lone survivor transfers its extra member, producing a three-person team and a two-person team.
- A one-person team joins the nearest compatible team when possible.
- Role labels are recalculated after every transfer so leader, left, right, wingman, and rear positions remain deterministic.

## Fire-team movement and combat

- Leaders act before supporting members and set the team’s travel direction.
- Outside immediate contact, supporting soldiers move toward their assigned triangle, single-file, or diamond positions.
- Formation positions are goals rather than teleport locks. Hard cover, occupied cells, map edges, buildings, and safe pathing may temporarily distort the shape.
- During alien contact, each soldier uses the fire-team leader rather than only the squad-wide commander as the maneuver anchor.
- Left and right supports use the existing cover-aware movement scorer to spread and seek opposite flanks while remaining within practical command distance and weapon range.
- Rear members favor support fire.
- After contact clears, the team resumes formation movement around its surviving leader.

## VIP and civilian rescue doctrine

- Only the active fire-team leader may establish a new VIP/civilian escort.
- Manual attempts by a supporting soldier are blocked with a player-readable explanation.
- AI search and rescue assignments are issued to leaders; their supporting soldiers are reserved as part of the same duty element.
- When a leader contacts a VIP inside a building, every available living VIP/civilian in that same building is contacted as one group, up to the existing four-civilian escort capacity.
- An outdoor contact remains a single-civilian contact rather than pulling unrelated civilians from elsewhere on the map.

## Building entry and exit behavior

- When a leader crosses a door or breached wall into a building, the entry opening and outside approach hex are remembered.
- Supporting soldiers remain outside the building and take available flanking cells around that approach.
- The leader enters alone, gathers the available VIP group, and then prefers the same door or breach when calculating the exit route.
- If the remembered opening is no longer viable, the bounded route planner may select another safe legal exit rather than stall permanently.
- After the leader exits, entry memory clears and the team reforms around the escort.

## Escort formation

- One escorted VIP occupies the central hex directly behind the leader.
- Additional VIPs form a line behind that first center position.
- The left and right supporting soldiers flank the last VIP in the escort line.
- A fourth fire-team member occupies the rear-security position behind the escorted group.
- Civilian and support movement is resolved one step at a time with collision, cover, building, and extraction checks.

## Manual tactical integration

- Fresh manual missions create and place fire teams before the first player turn.
- Cached older tactical battles without fire-team fields receive deterministic team assignment on resume.
- The selected-unit panel shows the soldier’s fire-team number and role.
- Players may still move individual soldiers manually; formations are enforced by AI movement rather than hard-locking manual controls.
- Only leaders may initiate civilian contact, but supporting soldiers retain normal movement, fire, inventory, and combat actions under player control.

## Save and compatibility contract

- Save format remains 4.
- Existing campaign saves require no repair.
- Existing live tactical states without fire-team metadata are assigned teams when opened or handed to AI.
- Fire-team fields are included in tactical simulation snapshots so AI intervals, Take Back Control, 2D/3D renderer switching, and survivor preservation do not discard team identity.
- The 1035 Easy/Medium reinforcement cadence, 0945 timeline and shot feedback, 2345 staged fuel, atomic multi-Skyranger ownership, false-total-loss prevention, sequential VIP waves, and terminal rescue rules remain intact.

## Validation completed

- All six non-empty application JavaScript blocks passed `node --check` after the integration changes.
- Direct fire-team contracts confirmed:
  - four soldiers form one diamond;
  - five form a three-person and a two-person team;
  - six form two teams of three;
  - seven form a four-person and a three-person team;
  - eight form two teams of three and one team of two;
  - leader death promotes a surviving member;
  - four plus two redistributes to three plus three;
  - four plus one redistributes to three plus two;
  - a two-person wingman remains two hexes behind the leader.
- Direct rescue contracts confirmed:
  - all available VIPs in the same building join the leader’s contact group;
  - unrelated outdoor civilians are not pulled into the group;
  - the first VIP occupies the center behind the leader and additional VIPs extend the line;
  - supports remain outside when the leader crosses into a building and the entry point is remembered.
- Direct extraction contracts confirmed that alien ramps never count as extraction cells or AI extraction corridors while player ramps remain valid.
- Static test scanning found 331 `*Test` references and 330 declarations; the only unmatched token remains the existing Three.js material property `depthTest`, which is not a test function.

## Manual validation still required

1. Start a fresh one- and two-Skyranger tactical mission and confirm every response squad visibly divides into the expected teams.
2. Give control to the AI and watch teams move in triangles, two-person spaced files, and four-person diamonds across open terrain.
3. Kill a fire-team leader and confirm the next senior survivor takes point on the following AI round.
4. Create four-plus-two and four-plus-one survivor combinations and confirm redistribution follows the documented rules.
5. Enter a building containing multiple VIPs; confirm only the leader enters, supports flank the approach, all available VIPs join, and the leader prefers the same exit.
6. Escort one and several VIPs and confirm the center-line and rear-flank formations remain readable where terrain permits.
7. Spawn an alien reinforcement saucer near the team and confirm neither manual nor AI rescue movement treats its ramp as extraction.
8. Switch between manual control, AI Command, 2D Hex, and 3D Iso and confirm fire-team identity and escort ownership remain stable.
9. Finish the mission and confirm normal victory, survivor, reinforcement, report, and Skyranger return processing remains intact.
10. Run browser Build Health and confirm the three new fire-team/extraction rows pass.

## Known limitations and next steps

- Formation goals are intentionally elastic around hard cover, narrow interiors, occupied hexes, and active firefights; soldiers are not teleported or forced to abandon viable cover merely to draw a perfect shape.
- The browser patch does not yet add colored fire-team overlays, group-selection hotkeys, player-issued fire-team orders, suppression, bounding overwatch, or dedicated breach commands.
- Native Godot 0026 does not yet contain this system.
- The next tactical update should add readable fire-team overlays and orders, then build explicit bounding-overwatch and breach/clear actions on top of the team ownership introduced here.

---
# v0.26.08.05.1035 - Reinforcement Difficulty and Casualty Pressure

Browser build `v0.26.08.05.1035_TACTICAL_REINFORCEMENT_DIFFICULTY_AND_CASUALTY_PRESSURE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design goal

Alien reinforcement pressure now supports an explicit campaign setting rather than forcing one cadence on every player. The existing 2120 behavior remains available as **Easy**, while **Medium** adds the requested casualty-sensitive escalation and predictable five-round response to alien commander loss.

This setting affects reinforcement timing only. It does not alter alien health, damage, accuracy, tactical AI doctrine, mission objectives, landing safety, wave size, or the number of soldiers and VIPs deployed.

## Easy reinforcement cadence

Easy preserves the prior browser rules:

- Normal call pressure begins at 4%.
- Continued visual contact adds 7 percentage points per contact round.
- Call pressure remains capped at 46%.
- Alien casualties are recorded for diagnostics but do not increase call probability.
- Killing the active alien commander starts the existing deterministic 5–15-round missed-check-in clock.
- That investigation wave is held until the current alien squad has been eliminated.
- Successful normal calls retain the existing two-round dropship warning.

Existing campaigns and legacy tactical missions without a stored difficulty value migrate to Easy so loading an old save does not silently make its reinforcement cadence more aggressive.

## Medium reinforcement cadence

Medium keeps the same 4% base chance, +7-point pressure step, 46% cap, and two-round warning for ordinary commander calls, then adds two escalation rules:

1. **Alien casualty pressure**
   - Every alien killed during the current reinforcement cycle adds one additional +7-percentage-point pressure step.
   - Casualty pressure stacks with visual-contact pressure.
   - The combined probability is still capped at 46%.
   - Example: contact round 2 normally produces 11%; one alien casualty raises that Medium call chance to 18%.
   - The timeline/log reports the new pressure when a casualty increases it.

2. **Fixed commander-loss investigation**
   - Killing the active alien squad commander starts a fixed five-round countdown.
   - The investigation force becomes due exactly five tactical rounds after the recorded death round.
   - Remaining living aliens do not hold that response back.
   - The missed-check-in arrival is immediate when the five-round deadline is reached; it does not add a second two-round warning on top of the requested five-round response.

## Reinforcement-cycle ownership

Casualties are counted against the alien group associated with the current call cycle. When a VIP reinforcement saucer lands:

- the landed force becomes the next cycle's tracked group;
- its first eligible alien becomes the new commander;
- cycle casualty pressure resets to zero;
- the existing deterministic 3–6-round VIP cooldown still applies before a normal call cycle can reopen.

The existing safety limits remain authoritative:

- one pending alien arrival at a time;
- maximum 10 living reinforcement aliens before new calls pause;
- two-to-four aliens per dropship;
- maximum 32 bounded landing candidates per attempt;
- failed safe placement retries on a later round;
- mandatory VIP missions may continue sequential cycles while living VIPs remain unresolved;
- ordinary non-VIP incidents retain their one-wave limit.

## Campaign and save contract

- New campaigns default to Medium, while the first-base setup allows Easy or Medium to be selected before campaign creation.
- Existing saves missing the field migrate to Easy.
- The campaign setting is available from Command Settings and Save / Load.
- Changing the campaign setting affects future launches only.
- At Skyranger launch, the selected value is copied into the mission record.
- A launched or saved tactical operation therefore keeps the same reinforcement cadence even if the campaign setting is changed later.
- Tactical reinforcement state also stores the resolved mode, current cycle alien IDs, and accumulated alien casualties.
- Save format remains 4 because the new fields are optional and migration-safe.

## Player-facing feedback

Reinforcement messages now identify:

- current call-pressure percentage;
- alien casualty count when it contributes to Medium pressure;
- whether commander loss is using the Easy post-wipe check-in or the Medium fixed-five-round investigation;
- reinforcement wave number and existing arrival warning.

## Build Health

Added:

- `Medium reinforcement mode adds casualty pressure and launches a fixed five-round commander-loss investigation`

Renamed the prior missed-check-in row to make its Easy-mode scope explicit:

- `Easy reinforcement mode retains the original 5 to 15 round post-wipe missed check-in cadence`

The direct helper contract verifies:

- Easy contact round 2 with one casualty remains 11%;
- Medium contact round 2 with one casualty becomes 18%;
- Medium emits a casualty-pressure event;
- Easy retains a deterministic 5–15-round delay and waits for alien-squad elimination;
- Medium records exactly five rounds and dispatches while a non-commander alien remains alive.

## Validation performed

- All six non-empty embedded JavaScript blocks passed `node --check`.
- The direct Easy/Medium reinforcement contract passed in Node.
- Static source checks confirmed campaign creation, migration, save/load, launch-time mission attachment, and all three settings-panel placements.
- Static test-reference scanning found 328 `*Test` tokens and 327 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a test function.
- Game build and save-format constants remain internally consistent.

## Manual validation gate

1. Start or load a campaign, select Easy, and launch a mandatory VIP mission.
2. Kill a non-commander alien while the commander has contact; confirm the casualty is tracked but the Easy call percentage follows contact rounds only.
3. Kill the Easy commander, leave another alien alive through the deadline, and confirm the investigation waits until the alien squad is eliminated.
4. Repeat on Medium and confirm each alien casualty adds one +7-point step up to the 46% cap.
5. Kill the Medium commander while another alien remains alive and confirm the investigation force becomes due exactly five rounds later.
6. Save and reload during the countdown and confirm the mode, death round, deadline, and casualty pressure remain stable.
7. Change the campaign setting after a mission has launched and confirm the active mission keeps its launch-time mode while the next mission uses the new selection.
8. Complete sequential VIP waves and confirm cooldown, population cap, landing safety, terminal rescue, and victory behavior remain intact.

## Native parity

Godot 0026 does not yet include reinforcement difficulty, casualty-pressure calls, fixed-five-round Medium commander-loss response, settings UI, or the browser's 2120 sequential VIP wave lifecycle.

---

# v0.26.08.05.0945 - Tactical Event Timeline and Shot Feedback

Browser build `v0.26.08.05.0945_TACTICAL_EVENT_TIMELINE_AND_SHOT_FEEDBACK_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design goal

Tactical combat already generated useful action text, but only the newest eight unstructured strings remained visible. Fast AI movement, reaction fire, civilian panic, reinforcements, and off-camera actions could therefore become difficult to reconstruct. The next Stage 3 slice makes battlefield events readable without modifying hit chance, damage, TU, AI doctrine, objectives, or victory logic.

## Mission Timeline contract

- A live tactical mission retains its latest 48 events.
- Every event records text, category, tactical round, and acting side.
- Categories are Combat, Rescue, Movement, and System.
- The side panel provides All, Combat, Rescue, Movement, and System filters.
- The panel can be hidden without discarding history.
- The same live mission cache preserves the timeline through renderer changes, AI Command, and Take Back Control.
- The old eight-line string log remains in parallel for current mission-resolution and mission-report compatibility.

## Shot outcome feedback

Every manual or tactical-map AI projectile now produces a centered temporary banner:

- `HIT`
- `MISS`
- `ARMOR HIT`
- `TARGET DOWN`

The banner names the firing mode, shooter, and target. It is pointer-transparent and does not change projectile timing, camera ownership, dialogue, impact sound, or damage resolution.

## Selection and facing

The selected human unit receives a bright facing-arrow badge on the 2D hex. The soldier status panel also shows the same arrow beside the existing six-direction code. Three.js retains its selected ring and weapon-direction presentation while sharing the improved status readout.

## Build Health

Added:

- `Tactical event timeline categorizes round-stamped actions and shows shot outcomes`

The helper contract verifies event-delta detection, category assignment, round stamps, shot outcome labels, and facing arrows.

## Validation performed

- All six non-empty embedded scripts passed `node --check`.
- Direct Node helper execution passed.
- Static test-reference scan found only the known Three.js `depthTest` property unmatched.
- Save format remains 4.

## Manual validation gate

1. Confirm hit, miss, armor-hit, and kill banners during manual fire and AI tactical-map playback.
2. Confirm all six selected-soldier facing arrows agree with the existing facing controls.
3. Generate combat, rescue, movement, and system events and verify filters, rounds, and acting-side stamps.
4. Switch 2D/3D, hand control to AI, and reclaim control without losing the live timeline.
5. Finish the mission and confirm current mission-report behavior remains compatible.

## Native parity

Godot 0026 still needs the categorized timeline, shot-result banner, facing indicator, live-state continuity, and parity tests.

---

# v0.26.08.04.2345 - Skyranger Staged Per-Leg Fuel Commit Fix

Browser build `v0.26.08.04.2345_SKYRANGER_STAGED_PER_LEG_FUEL_COMMIT_FIX_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Player-reported failure

The supplied 2120 campaign rejected a two-Skyranger response with:

> Aegis One changed readiness before the launch could commit; no aircraft or fuel were consumed.

The save itself showed both **Aegis One** and **Night Lifter** as `Ready`, undamaged, fully fueled at `100/100`, and not attached to any active Skyranger flight or relocation. The selected UFO Recon Sweep in Oceania required staging through the East Asia base.

## Confirmed route arithmetic

The route planner correctly found two independently valid fuel segments:

- Fort Aegis to E. Asia 1: 14,161 km one way, 89 fuel;
- E. Asia 1 to the Oceania incident and back to E. Asia 1: 8,226 km round trip, 52 fuel.

The complete route budget is 141 fuel, but it is deliberately separated by a staging-base refuel. Build 2120's final atomic guard incorrectly required the aircraft to hold all 141 fuel before leaving Fort Aegis.

## Corrected staged-launch contract

Every selected Skyranger now receives a three-part launch fuel plan:

- `initialFuelCost`: fuel required before the first takeoff;
- `postStageFuelCost`: fuel reserved after the scheduled staging refuel for the incident round trip;
- `routeFuelBudget`: informational total across all route legs and refuel stops.

The launch transaction now follows this order:

1. Select distinct compatible Ready transports.
2. Validate status, repairs, and only the first flight leg's fuel.
3. Commit the multi-transport transaction atomically.
4. Deduct the initial ferry-leg fuel.
5. Advance through the existing ferry and refuel timeline.
6. At tactical arrival, settle the staging refuel and reserve the incident round-trip fuel from a full tank.
7. Preserve all fuel maps in travel and mission records for saves and diagnostics.

A route budget larger than tank capacity is therefore legal when every individual leg fits the tank and a valid refuel stop exists.

## Direct-flight preservation

Non-staged missions are unchanged. A direct Skyranger still commits its complete out-and-back mission fuel at launch because it has no intermediate refuel stop.

## Atomic safety preserved

The following protections from 0845 and 1245 remain authoritative:

- one distinct Skyranger per selected squad;
- no status or fuel mutation before all validation passes;
- duplicate launch-click lock;
- complete aircraft ownership recorded in mission and travel state;
- incomplete launch rollback on load;
- selected planning incidents do not falsely count as active operations.

## Diagnostics

A genuine commit failure now identifies whether the aircraft:

- changed from `Ready` to another status;
- still has repair time remaining;
- lacks fuel for the initial flight leg.

The game no longer describes a valid multi-leg route as an unexplained readiness change.

## Build Health coverage

Added:

- `Staged Skyranger launches validate and consume fuel per refueled flight leg`

The contract verifies the supplied-route shape of 89 initial fuel, 52 post-stage fuel, and a 141 total route budget. It confirms a 100-fuel craft passes the atomic guard, departs with 11 fuel, settles to 48 after the staging refuel and incident reservation, and leaves direct launch accounting unchanged.

## Validation performed

- All six non-empty embedded scripts passed `node --check`.
- The direct staged-fuel helper harness passed all expected values.
- The supplied save was parsed and confirmed both transports were Ready at full fuel with no active Skyranger travel.
- Route calculations reproduced the reported 89 and 52 fuel segments.
- Build Health references resolve to declarations, excluding the known Three.js `depthTest` property.
- Save format remains 4.

## Manual validation gate

1. Load the supplied campaign and launch both squads to the Oceania Recon Sweep.
2. Confirm both Skyrangers depart and the East Asia refuel appears in the route timeline.
3. Save/reload during the ferry and again after staging.
4. Complete the tactical mission and confirm both transports return through the staged route.
5. Verify a direct nearby mission retains its original fuel behavior.
6. Verify an aircraft genuinely below the first-leg fuel requirement receives a precise blocker.

## Native parity

Godot 0026 still requires the per-leg launch fuel plan, staged refuel settlement, persisted fuel maps, diagnostics, and parity tests.

---

# v0.26.08.04.2120 - VIP Unbounded Reinforcement Waves and Terminal Rescue State

Browser build `v0.26.08.04.2120_TACTICAL_VIP_UNBOUNDED_REINFORCEMENT_WAVES_AND_TERMINAL_RESCUE_STATE_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`.

## Design goal

Mandatory VIP rescue missions should remain tense until the rescue situation is completely resolved. Defeating the force currently on the map creates a temporary clear interval, not a permanent guarantee that alien command has stopped responding. At the same time, unlimited total waves must never mean unlimited work in one browser frame or an ever-growing collection of obsolete craft and corpse records.

## Previous one-wave restriction

The tactical reinforcement state used mission-wide `called` and `arrived` guards. Once one purple saucer landed, `arrived` stayed true and every later reinforcement check returned immediately. The original commander could call once, or its death could eventually produce one missed-check-in investigation, but a mandatory rescue could never begin another cycle.

The rescue progress state also equated quota completion or mathematical impossibility with terminal resolution. A terror mission could therefore stop being a rescue phase while another living VIP remained unextracted.

## Sequential VIP reinforcement contract

- A mandatory VIP mission uses a numbered reinforcement cycle rather than a mission-wide one-shot flag.
- Wave 1 retains the existing commander-call probabilities: 4% base, +7 percentage points per continuing contact round, capped at 46%.
- A successful call retains the existing two-round warning.
- Each landed wave contains two to four aliens according to threat.
- The first alien in each wave is marked as that wave's eligible commander/caller.
- The next call cycle opens after a deterministic three-to-six-round cooldown.
- If the commander dies before calling, the existing deterministic five-to-fifteen-round missed-check-in timer can trigger the next investigation after the active alien force is cleared.
- Total wave count is not capped while living mandatory VIPs remain unresolved.
- Only one arrival can be pending at a time.
- Ordinary non-VIP incidents retain the original one-wave rule.

Reinforcement state now retains:

- `waveCount`;
- `callEligibleRound`;
- `lastArrivalRound`;
- `lastArrivalReason`;
- the current wave commander's ID;
- current call, arrival, rally, and missed-check-in data.

A legacy VIP battle that already contains an old `arrived: true` one-wave state reopens a fresh cycle after a bounded cooldown rather than remaining permanently sealed.

## Terminal rescue contract

For a mandatory rescue mission, quota progress and terminal resolution are separate concepts.

- `quotaMet` determines the civilian reward/completion result.
- `terminalResolved` requires zero living, unextracted VIPs.
- Meeting the quota while another VIP remains alive keeps the rescue phase active.
- Making the quota impossible while another VIP remains alive also keeps the rescue phase active.
- The operation can resolve only after every VIP is extracted or confirmed dead.
- Once terminally resolved, the actual rescued/lost totals determine rewards, rescue failure, regional panic, reports, and campaign consequences.
- A pending VIP reinforcement call is no longer relevant and is cancelled when no living unresolved VIP remains.
- Optional civilian rescue continues to be non-blocking in eliminate-all-aliens missions.

## AI behavior during clear intervals

- Fresh AI simulations and inherited tactical AI intervals both continue mandatory rescue work when the battlefield is temporarily clear.
- Existing escorts retain extraction priority.
- Free soldiers continue toward tracker pings, interiors, and bounded unexplored sectors.
- The AI does not finalize victory merely because the current alien group has been destroyed.
- The 1655 survivor-preservation rule remains authoritative if an AI interval reaches its safety limit.

## Bounded performance and landing safety

Unlimited total waves are constrained by bounded local work:

- at most 32 deterministic landing candidates per arrival attempt;
- one pending arrival transaction;
- no landing outside the map or overlapping buildings, units, or player Skyrangers;
- one-round retry when no legal footprint exists;
- new calls pause if the projected force would exceed 10 living reinforcement aliens;
- only the newest alien saucer footprint remains in the active cover/craft registry;
- dead reinforcement units older than the immediately preceding wave are retired when a later wave lands;
- each alien turn, path search, AI interval, and playback remains subject to existing bounded limits.

## Presentation updates

- Call, missed-check-in, and landing messages identify the reinforcement wave number.
- The objective panel distinguishes:
  - quota not yet met;
  - quota met but living VIPs remain unresolved;
  - quota failed but living VIPs remain unresolved;
  - all VIPs terminally resolved.
- Clear-turn messaging tells the player how many VIPs remain unresolved rather than reporting zero remaining merely because the reward quota was met.

## Build Health coverage

Added:

- `Mandatory VIP missions support sequential bounded reinforcement waves and terminal VIP resolution`

The executable contract verifies two sequential calls and landings, a new commander per wave, unique wave state and IDs, one retained saucer, bounded concurrent pressure, unresolved VIP victory blocking, terminal resolution, pending-wave cancellation, and unchanged non-VIP one-wave behavior.

## Validation performed

- All six non-empty embedded scripts passed `node --check`.
- Direct helper contracts passed sequential VIP waves, ordinary one-wave calls, and ordinary missed-check-in investigation behavior.
- Terminal-state tests passed quota-met-but-open, quota-failed-but-open, terminal success, and terminal rescue failure.
- Build Health symbol scan found no missing test declaration; `depthTest` remains a Three.js material property.
- Save format remains 4.

## Manual validation gate

1. Run a mandatory terror/abduction mission and observe at least two reinforcement waves.
2. Confirm every warning, landing, commander handoff, and rally remains fog-safe.
3. Confirm old saucer collision geometry disappears when a later saucer becomes current.
4. Meet the quota while leaving one VIP alive and confirm the battle stays open.
5. Make the quota impossible while leaving one VIP alive and confirm the battle stays open.
6. Resolve the final VIP, eliminate the active aliens, and confirm the operation closes with accurate rescue results.
7. Repeat under AI control and through an AI safety-interval handoff.
8. Run a non-VIP incident and confirm only one wave is possible.

## Native parity

The browser implementation is complete in 2120. Godot 0026 still has the previous one-wave reinforcement ownership and must port the numbered cycle, terminal rescue state, bounded pressure guard, legacy migration, and parity tests before native behavior can be considered equivalent.

---

# v0.26.08.04.1655 - Tactical AI False Total-Loss and Survivor Preservation

Browser build `v0.26.08.04.1655_TACTICAL_AI_FALSE_TOTAL_LOSS_AND_SURVIVOR_PRESERVATION_INDEX_ONLY_PATCH` preserves save format 4. Native Godot remains unchanged.

## Player-reported failure

During an eliminate-all-aliens mission with optional civilian rescue, AI command appeared to be winning with roughly eight or nine soldiers alive. After the last visible alien died, every surviving soldier suddenly dropped to zero HP and the game reported that both squads were lost.

## Confirmed source defect

`tacticalAiMissionResolution` returned `squadDefeated: !terminal.primarySecured`.

That made these two states incorrectly equivalent:

- every soldier is dead;
- the primary objective is not yet secured because at least one alien is still active.

When the bounded AI simulation reached its round limit with any living alien remaining, `resolveMission` entered the `squadDefeated` branch, forced every human unit to `hp = 0`, and appended a synthetic `Squad overrun` frame. No alien attack or damage event was required.

## Corrected terminal-state contract

- `squadDefeated` now equals `terminal.squadWiped` only.
- A genuine squad wipe requires zero living human units.
- A living squad with a living alien is classified as unresolved, not defeated.
- A living squad with no valid living aliens and optional civilian rescue is a victory.
- The synthetic overrun frame can only be produced after a real zero-survivor state.

## AI safety-interval behavior

- Tactical continuation simulations now receive up to 72 rounds instead of 36.
- Fresh strategic simulations receive up to 48 rounds instead of 24.
- If a tactical handoff reaches the safety limit while both sides still have survivors, the final live state is retained.
- The AI playback closes without calling mission completion.
- Tactical control returns to the player with current HP, positions, ammunition, civilians, cover damage, fog, and alien state preserved.
- The player may continue manually or hand control back to the AI for another interval.
- A non-tactical strategic simulation that reaches its limit records an incomplete withdrawal with survivors rather than inventing KIA results.

## Preserved behavior

- Final-alien elimination resolves victory immediately when civilian rescue is optional.
- Mandatory VIP/civilian objectives continue to require their configured rescue threshold.
- Genuine alien attacks still kill soldiers normally.
- A true zero-survivor battlefield still resolves as `Squad Lost`.
- Off-map-alien repair, reinforcement pending checks, action-aware camera framing, diagonal-corner camera support, and all Skyranger launch fixes remain intact.

## Build Health coverage

Added:

- `AI simulation never converts an unresolved battle into a synthetic total squad loss`

The test verifies:

- one living soldier plus one living alien is unresolved, not squad-defeated;
- a real zero-HP squad is defeated;
- a living squad plus zero living aliens is victorious;
- the old executable `!primarySecured` defeat rule is absent;
- tactical safety-limit continuation is present.

## Validation performed

- Extracted all embedded scripts and passed all six non-empty blocks through `node --check`.
- Direct terminal-state harness confirmed unresolved, wiped, and victory classifications.
- Confirmed unresolved tactical playback returns command without calling mission completion.
- Confirmed the final frame preserves living unit HP rather than creating a synthetic death frame.
- Save format remains 4.

## Manual validation gate

1. Start or load a large tactical mission.
2. Leave at least one alien hidden or distant while several soldiers remain alive.
3. Hand control to the AI and allow the safety interval to complete.
4. Verify no surviving soldier drops dead without a damage event.
5. Verify tactical control returns with the live battlefield intact.
6. Hand control to the AI again or continue manually.
7. Kill the final alien and confirm immediate victory when civilian rescue is optional.
8. Separately test a genuine total squad wipe and confirm `Squad Lost` still appears.

## Save-repair note

Build 1655 prevents this failure from being produced again, but it cannot reconstruct soldiers already committed as KIA in an autosave after the false-loss result. Such a save can be repaired from its JSON if supplied, using the last valid tactical frame or pre-result autosave as evidence.

---



# v0.26.08.04.1245 - Skyranger Planning-Lock Regression Fix

Browser build `v0.26.08.04.1245_SKYRANGER_PLANNING_LOCK_REGRESSION_FIX_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; native parity is queued only if the same planning/operation state overlap exists there.

## Player-reported regression

In a new campaign, selecting two squads and two available Skyrangers produced:

`Launch mission could not be completed. Blocking status: another Skyranger launch, flight, or tactical operation is already active`

No aircraft had actually departed.

## Root cause

- Mission Control uses `activeMission` for two different phases: the incident currently being planned and the mission that has actually entered tactical ownership.
- Patch 0845 added a duplicate-launch guard using `skyrangerLaunchCommitRef.current || skyrangerTravel || activeMission`.
- Opening **Plan Response** or **Use Highest Threat Incident** set `activeMission` before launch confirmation.
- The guard therefore interpreted the selected incident itself as an already-active operation and blocked the first legitimate launch.
- The atomic transport selection and commit code never had a chance to run.

## Corrected phase contract

Added `skyrangerMissionHasCommittedOperation` and `skyrangerLaunchConflictKey`. A launch is blocked only when one of these is true:

- another launch is synchronously committing;
- an actual `skyrangerTravel` record exists;
- tactical simulation or playback exists;
- the mission carries committed-operation evidence such as a committed transaction, transaction ID, assigned aircraft IDs, tactical clock, manual tactical state, or simulation-in-progress state.

A selected planning incident with squad choices or a requested transport count is not treated as committed and remains launchable.

## Lock lifecycle hardening

- The commit-ref reset now uses the same planning-versus-committed test.
- Merely selecting or changing an incident cannot retain the synchronous lock.
- Failed validation still clears the lock in the transaction `finally` path.
- A successful outbound flight, manual tactical battle, AI simulation, or return flight remains protected from duplicate launch requests.
- Conflict messages now identify whether the blocker is a commit, flight, playback, or committed tactical operation.

## Preserved 0845 behavior

- one distinct compatible Ready Skyranger per selected response squad;
- all-or-nothing validation and fleet commit;
- complete multi-aircraft mission/travel ownership;
- duplicate-click prevention during the commit itself;
- incomplete half-launch and partial-travel rollback on load;
- fuel restoration and incident preservation for repaired saves;
- coherent flight, tactical, simulation, and return ownership.

## Build Health coverage

Added:

- `Selected incidents remain launchable while committed Skyranger operations stay locked`

The regression verifies that:

- a normal selected incident is allowed;
- a two-squad planning record with `transportCount: 2` is allowed;
- a synchronous launch commit is blocked;
- a real flight is blocked;
- tactical playback is blocked;
- committed transaction ownership is blocked;
- manual tactical and AI-simulation ownership are blocked.

## Validation performed

- All eight script elements were extracted; all six non-empty embedded JavaScript blocks passed `node --check`.
- Direct Node regression confirmed planning and selected two-squad incidents return no launch conflict.
- The same regression confirmed commit, flight, playback, committed operation, manual tactical, and simulation states remain blocked.
- Static inspection confirmed the raw `skyrangerLaunchCommitRef.current || skyrangerTravel || activeMission` guard is no longer present.
- The Build Health row and test declaration are both present.
- The packaged ZIP was extracted and syntax-checked again.
- A full asset-backed browser launch remains the final manual gate in this environment.

## Manual validation gate

1. Start a new campaign in build 1245.
2. Select an incident and open Plan Response.
3. Select both available squads.
4. Confirm two Ready Skyrangers are shown and launch the mission.
5. Verify the launch proceeds instead of showing the 0845 active-operation blocker.
6. Rapidly press launch confirmation and verify only one atomic launch is committed.
7. Attempt another launch while the transports are outbound and verify it is blocked as a real flight conflict.
8. Save and reload during travel and confirm both aircraft remain owned by the same transaction.

## Codex follow-up rule

Do not use `activeMission != null` as a tactical-ownership test. Mission selection/planning and committed operation ownership must remain separate phases, even if they share the same state field for legacy UI compatibility.

---

# v0.26.08.04.0845 - Atomic Multi-Transport Skyranger Launch

Browser build `v0.26.08.04.0845_SKYRANGER_ATOMIC_MULTI_TRANSPORT_LAUNCH_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; native parity for this browser launch transaction is queued.

## Confirmed player save failure

The attached autosave confirmed that the prior problem was not merely a display mismatch:

- `Aegis One` and `Night Lifter` were both saved as `Outbound`.
- Each transport had only `7/100` fuel and a `310` minute refuel timer.
- `skyrangerTravel` was `null`, so no clock-driven route could reach the incident or return home.
- `activeMission.transportCount` was `2`, but the mission stored only one `aircraftId`, naming `Night Lifter`.
- The same Europe crash-site incident remained in the normal mission list.
- The reports showed two separate launch attempts, first with Aegis One and later with Night Lifter.

This is a half-committed multi-transport launch: aircraft and fuel changed independently of the authoritative travel record.

## Prevention contract

- A response using two squads requires two distinct compatible Ready Skyrangers.
- All response squads, soldiers, aircraft, launch bases, routes, hangars, fuel costs, and transport counts are validated before any state is changed.
- Compatible transports must share the same boarding base and route contract so the response arrives as one operation.
- A synchronous launch-commit lock rejects repeated clicks or a second launch attempt while the first transaction is committing.
- The complete travel object is constructed before aircraft state is committed.
- Aircraft fuel and `Outbound` status are applied to the complete aircraft set in one fleet update.
- Failed validation consumes no fuel, changes no aircraft status, and creates no active mission or travel record.
- A launch transaction ID follows the operation from departure through tactical combat or AI simulation and return.

## Multi-aircraft mission ownership

The mission and travel records now preserve:

- `launchTransactionId`;
- `launchTransactionStatus`;
- `aircraftIds` and `aircraftNames`;
- `fuelCostById`;
- `returnHangarKeyById`;
- actual aircraft assignment for every `responseSquadDeployment`;
- total transport count.

All participating aircraft remain unavailable during outbound travel, tactical combat, AI simulation, and return travel. Every assigned transport is set to Returning together and restored to its correct home hangar together after landing.

## Save/load rollback hardening

`repairIncompleteSkyrangerLaunchState` validates saved ownership before stale-aircraft reconciliation. It rolls back an operation when either of these is true:

- an active mission claims multiple transports without a complete transaction and there is no travel record;
- a partial travel record contains fewer aircraft than its declared transport count.

Rollback behavior:

- clear the incomplete `activeMission` and `skyrangerTravel`;
- return every orphaned Outbound or Returning Skyranger to Ready;
- refund fuel committed by the incomplete launch and clear the false refuel timer;
- preserve or restore the incident in the normal mission list;
- add a strategic report explaining that the incomplete transaction was recovered.

Coherent modern transactions and legacy manual tactical missions remain protected from false recovery.

## AI simulation ownership correction

When outbound travel completes into an AI-resolved mission, the operation now retains an active mission ownership record while simulation playback is running. This prevents live readiness reconciliation from incorrectly freeing the transports before the mission has begun its return flight.

## Build Health coverage

Added:

- `Skyranger launches commit atomically across every selected squad transport`

The regression verifies:

- two selected squads receive two distinct compatible transports;
- the exact no-travel half-launch signature is rolled back;
- both transports return to Ready with full refunded fuel;
- the incident remains available;
- a partial travel record with only one of two required aircraft is rolled back;
- a coherent two-aircraft transaction remains active and is not falsely recovered.

## Validation performed

- All eight HTML script elements were extracted; all six non-empty embedded JavaScript blocks passed `node --check`.
- The direct helper harness passed distinct two-transport selection, exact half-launch rollback, partial-travel rollback, and coherent-transaction preservation.
- The attached autosave was inspected directly and matched the 0845 rollback signature: two Outbound Skyrangers at 7 fuel, no travel record, transport count 2, and only one mission aircraft ID.
- Static Build Health reference scanning found 321 referenced test identifiers and 321 declarations, with no missing references.
- The packaged ZIP was extracted and syntax-checked again.
- A full asset-backed browser mission launch and return remains the final manual validation gate because the index-only package does not include the complete asset tree in this environment.

## Manual validation gate

1. Load the original affected autosave in build 0845 and confirm the recovery report appears.
2. Confirm Aegis One and Night Lifter are both Ready with restored fuel.
3. Select Aurochs Squad and Barracuda Squad for the Europe incident.
4. Confirm the launch requires and assigns two named Skyrangers.
5. Double-click or rapidly press the confirmation control and verify only one launch transaction occurs.
6. Save during outbound travel, reload, and confirm both aircraft remain assigned to the same travel record.
7. Enter the tactical mission or AI simulation and confirm both transports remain unavailable.
8. Complete the mission and return flight, then confirm both aircraft restore to their individual Fort Aegis hangars.
9. Attempt a two-squad launch with only one Ready Skyranger and confirm the game blocks before changing fuel or aircraft status.

## Codex follow-up rule

Do not reintroduce single-aircraft ownership for a multi-squad response. Any native or future browser implementation must treat mission launch as one transaction whose aircraft set, squad assignments, route, fuel, tactical ownership, return ownership, and rollback behavior remain internally consistent.

---

# v0.26.08.04.0745 - Skyranger Autosave Readiness Recovery

Browser build `v0.26.08.04.0745_SKYRANGER_AUTOSAVE_READINESS_RECOVERY_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; native parity is not required for the browser-only autosave storage mismatch unless the same condition is reproduced in the native slice.

## Player-reported problem

- An autosave loaded with two Skyrangers visibly present at Fort Aegis.
- No active mission or visible aircraft route appeared to own either transport.
- Attempting to launch both available squads produced `Launch mission could not be completed. Blocking status: no ready Skyranger is available`.

## Source-level finding

- That exact blocker is reached only when `skyrangerSortieOptionsForMission` receives zero aircraft from `readyAircraftByType(fleet, "skyranger")`.
- A hangar can still display a Skyranger assignment even when the authoritative `aircraftFleet` record is not Ready.
- The load path already recovered stale airborne Interceptors but had no equivalent Skyranger recovery pass.
- A Skyranger could therefore remain `Outbound` or `Returning` after its matching `skyrangerTravel` or tactical mission record disappeared.
- A stale `Queued` state without a relocation order, or `Repairing` with zero remaining minutes, could also suppress all launch options.
- The exact player autosave was not attached, so these source-supported states remain the leading diagnosis until the exported autosave is inspected.

## Implemented recovery contract

- Added `activeSkyrangerAircraftIdSet` to identify transports legitimately owned by an active flight or tactical mission.
- Added `recoverStaleSkyrangerAircraft` to reconcile loaded and live aircraft state.
- `Outbound` and `Returning` Skyrangers with no matching active flight or mission return to Ready while retaining their base, hangar, fuel, and identity.
- `Queued` Skyrangers with no matching relocation order return to Ready.
- `Repairing` aircraft with zero remaining repair minutes normalize to Ready.
- Legitimate active flights, active tactical missions, and queued relocations remain unavailable and are not falsely recovered.
- Recovery runs during save migration, campaign application, and live state transitions.

## Diagnostic blocker

When no ready transport exists, mission confirmation and launch now report every saved Skyranger state, including:

- aircraft name;
- assigned/current base;
- Ready, Outbound, Returning, Repairing, or Queued status;
- current fuel and capacity;
- repair and refuel minutes;
- whether the craft belongs to an active mission/flight;
- whether a relocation is queued.

This distinguishes a legitimate operational blocker from an orphaned autosave state and prevents the hangar display from being mistaken for launch readiness.

## Build Health coverage

Added:

- `Autosaves recover stale Skyranger readiness and explain transport blockers`

The regression creates two Fort Aegis Skyrangers saved as stale Outbound and Returning aircraft, verifies both recover to Ready without active ownership, preserves equivalent states when an active flight or mission owns them, normalizes zero-minute repair, restores mission sortie options, and verifies the diagnostic names the base and stale statuses.

## Validation performed

- All six embedded JavaScript blocks passed `node --check`.
- Static test-reference scan found no missing test declaration after excluding Three.js' `depthTest` material property.
- Direct stale-Skyranger harness passed for orphaned Outbound, Returning, and zero-minute Repairing records.
- Active `skyrangerTravel` and active tactical mission ownership remained preserved.
- The packaged ZIP was extracted and syntax-checked again.
- Browser navigation to localhost was blocked by the sandbox administrator, so a full in-browser Build Health pass remains pending.

## Manual validation gate

- Export the affected autosave before overwriting it.
- Load it in build 0745.
- Inspect the two Fort Aegis hangars and confirm each aircraft displays Ready unless a real active flight, mission, repair timer, or relocation owns it.
- Retry the incident launch with both selected squads.
- If launch remains blocked, copy the expanded blocker text; it should now identify the exact aircraft state rather than give only a generic message.
- Export the autosave JSON for direct record-level confirmation of the original cause.

---

# v0.26.08.04.0115 - Tactical Isometric Diagonal Corner Camera Fix

Browser build `v0.26.08.04.0115_TACTICAL_ISO_DIAGONAL_CORNER_CAMERA_FIX_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; native parity for this browser camera correction remains queued.

## Player-reported problem

- In Three.js isometric battles, the camera could follow soldiers through most of the map but lose them or refuse to pan far enough when they entered the northwest or southeast corners.
- The same diagonal weakness could affect action-camera framing for complete movement paths and shooter-target pairs.
- Fit Map could claim to contain the full grid while the actual northwest-to-southeast projected diagonal still extended beyond the orthographic camera.

## Root cause

- The rectangular viewport-fill patch correctly projected the camera corners onto the ground to determine how many hexes to render.
- Camera-center clamping still reduced that tilted footprint to independent minimum and maximum map X/Y offsets.
- In an isometric projection, map X and Y are coupled in screen space. A northwest or southeast cell can sit outside the camera's diagonal edge even while it remains inside the footprint's axis-aligned X/Y bounding box.
- Fit Map used unrotated grid-column and grid-row spans rather than the complete projected battlefield bounds.

## Implemented camera contract

- Added a deterministic camera-projection basis derived from the existing Three.js camera position and look direction.
- Added forward and inverse transforms between tactical hex coordinates and orthographic camera-plane coordinates.
- Acting soldiers, complete movement routes, and shooter-target pairs are fitted against the real horizontal and vertical camera-plane half-extents.
- The actor remains the preferred focus. The camera shifts only as much as necessary to keep all requested action points visible.
- Projected camera centers are constrained against projected battlefield bounds, then converted back to tactical hex coordinates.
- Viewport coverage now clips rendered cells to the finite tactical grid without overriding the corrected projected camera center with the old independent X/Y clamp.
- The map remains non-interactive outside the established playable perimeter; this patch changes presentation only.

## Fit Map correction

- Fit Map zoom now uses the projected battlefield width and height in the camera plane.
- The calculation includes odd-row hex offsets, visible hex margins, and the northwest-to-southeast diagonal.
- Full-map framing retains the complete Small, Medium, and Large battlefield rather than fitting only unrotated row/column dimensions.

## Preserved systems

- Rectangular viewport-filling hex coverage at normal zoom levels.
- AI action-camera movement-path and shooter-target framing.
- Fog of war and hidden alien movement suppression.
- Unit, cover, Skyranger, purple saucer, VIP tracker, targeting, and click-picking coordinates.
- Off-map integrity repair and ghost-objective rejection.
- Northwest AI pile-up recovery and reached-report local searches.
- Optional-rescue terminal victory and mandatory-rescue terminal gates.
- Save format 4 and tactical live-state cache compatibility.

## Build Health coverage

Added:

- `Three.js isometric camera follows soldiers into northwest and southeast map corners`

The regression evaluates all four battlefield corners at Close, Near, Wide, Full, Map, and Fit Map on an 80x80 battlefield. Every corner must remain inside the projected view and the rendered coverage must include the corresponding map boundaries.

## Validation performed

- Extracted all six embedded JavaScript blocks and ran `node --check`; all passed.
- Static `*Test` reference scan found no undefined test declarations after excluding Three.js' `depthTest` material property.
- Direct Node projection regression passed all four corners at all six zoom levels.
- Representative 80x80 projected camera centers remained finite and inside map bounds.
- Fit Map coverage remained the complete `0..79` range on both axes while every projected corner tested visible.
- The packaged ZIP was extracted and syntax-checked again.

## Manual validation gate

- In a live Three.js tactical battle, select or follow soldiers into the northwest and southeast corners at every zoom level.
- Confirm the selected soldier remains visible and the camera continues tracking rather than stopping short.
- Under AI Command, confirm complete movement routes near those corners remain visible.
- Trigger combat near each corner and confirm shooter and target remain framed whenever the selected zoom can contain both.
- Confirm Fit Map shows all four battlefield corners simultaneously.
- Confirm 2D Hex behavior and tactical click selection remain unchanged.

Next recommended paired work remains native parity for the accumulated browser tactical behavior, followed by the planned VIP reinforcement-wave and terminal-rescue-state parity patch after hands-on validation.

---

# v0.26.08.04.0045 - Tactical AI Action Camera, Off-Map Integrity, Corner-Stall, and Victory Hardening

Browser build `v0.26.08.04.0045_TACTICAL_AI_ACTION_CAMERA_OFFMAP_AND_VICTORY_HARDENING_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; browser-to-native parity for this patch remains queued.

## Player-reported problems corrected

- At Full and Fit Map zoom, AI playback could center on an actor without retaining the complete movement route, causing part of the action to occur outside the visible camera frame.
- Combat camera framing could show only the shooter or only the target instead of the complete exchange.
- Several AI-controlled soldiers could choose the same northwest-biased fallback and huddle in the upper-left corner instead of continuing the mission.
- Soldiers arriving at a reported/last-known alien location could stay in direct-response state even though the report had already been reached.
- Eliminate-all-alien missions could remain open after the final alien died when civilian rescue was optional.
- A stale or corrupted alien/unit coordinate, last-known position, rally point, search point, distress position, or AI playback position could behave like an off-map alien and pull pathing toward `0,0` or negative northwest coordinates.

## AI action-camera contract

- AI movement frames carry a bounded focus descriptor containing the acting unit, every cell of the visible movement path, and the destination.
- Full and Fit Map retain the selected zoom while shifting the camera only enough to keep the active soldier and complete route inside the rectangular viewport.
- Combat frames carry both shooter and target endpoints. The active actor remains the preferred camera anchor, but the view shifts toward the pair's bounding region whenever map bounds and zoom allow it.
- The rectangular viewport coverage planner from build 2312 remains authoritative, so camera reframing does not recreate the old square island of rendered hexes.
- Camera focus metadata survives tactical-map AI playback and Take Back Control without changing tactical state.

## Northwest pile-up and reached-report search

- Equal-score movement cells use unit-specific deterministic hashes instead of coordinate ordering that consistently favored low `x/y` values.
- Direct contact response retains shortest practical movement toward a valid report, but reaching the report transitions the soldier into a bounded local search rather than repeatedly requesting the same cell.
- Local search uses unit-specific rings around the reported position and then distinct interior patrol waypoints.
- Fallback scoring penalizes allied crowding, repeated cells, and map-edge hugging while rewarding useful interior clearance and separation.
- A soldier unable to advance does not invent an unrelated northwest destination.

## Battlefield integrity guard

- Every living, unrescued tactical unit is checked against the current Small, Medium, or Large playable perimeter.
- A living unit outside the playable map is relocated to a deterministic, unoccupied, non-hard-cover interior cell instead of remaining an unreachable target.
- Invalid coordinate pairs are cleared for:
  - alien and soldier last-known contacts;
  - reinforcement rally locations;
  - alien search destinations;
  - patrol destinations;
  - casualty/distress and attacker-direction records.
- Reinforcements with an invalid rally point transition to formation search rather than walking toward an impossible coordinate.
- Alien visible-target, last-known-target, and human contact-response plans reject off-map objectives before pathfinding.
- AI continuation/reclaim state and every live `setUnits` update pass through the same repair seam.
- Repairs create a tactical event-log message so a recovered campaign state is visible to the player rather than silently changed.
- The mission terminal helper counts only living aliens occupying valid battlefield cells. A ghost/off-map record cannot keep an eliminate-all-alien mission open; the normal state guard attempts relocation first so a real living alien remains visible and killable.

## Mission objective terminal rules

- If the primary objective is eliminate all aliens and civilian rescue is optional, killing every valid deployed alien ends the mission in victory immediately.
- Optional civilians continue to affect rescue bonuses, report text, casualties, and campaign consequences, but they cannot block terminal victory.
- Mandatory VIP/civilian rescue missions retain the secure-area rescue phase until every required target is extracted or dead under the existing contract.
- A legitimately called but not-yet-arrived reinforcement craft can still hold the mission open until arrival; an invalid ghost coordinate cannot.
- Manual End Turn, tactical-map AI command, Classic playback resolution, and the visible battle-result overlay use the shared terminal-state helper.

## Build Health coverage

Added or preserved:

- `AI tactical camera frames the acting soldier movement path and shooter target pair`
- `AI tactical movement avoids northwest corner pile-ups and searches around reached contact reports`
- `Eliminate-all-alien missions end in victory when civilian rescue is optional`
- `Tactical battlefield integrity repairs off-map aliens and rejects ghost objectives`

The off-map regression fixture injects a living revealed alien at `-99,-99` with matching stale last-known, rally, and search coordinates. It verifies deterministic interior relocation, coordinate clearing, valid patrol replacement, ghost-target rejection, and terminal victory without a soft lock.

## Validation performed

- Extracted all six embedded JavaScript blocks and ran `node --check`; all passed.
- Re-extracted the final app script and scanned all Build Health `*Test` references: 311 unique references, none missing.
- Ran the exact integrity functions under Node with a living alien at `-99,-99`.
- The alien was relocated to a deterministic interior cell, all invalid coordinate pairs were cleared, human search selected an interior patrol target instead of northwest convergence, and the terminal helper reported zero valid living aliens plus one rejected invalid record.
- The optional-rescue eliminate-all-alien fixture resolved victory correctly.
- The index-only ZIP is re-extracted and syntax-checked during packaging.
- Full localhost/WebGL/in-browser Build Health verification remains a hands-on gate because the sandbox blocked browser navigation; direct `set_content` execution also lacks an allowed storage origin.

## Manual validation gate

1. Load the affected battle or a copy of its save and hand control to AI at Full and Fit Map.
2. Confirm every acting soldier remains visible along the complete movement route, including start and destination.
3. Confirm visible gunfights frame both shooter and target whenever the selected zoom can contain both.
4. Let one squad report an alien to another distant squad. Confirm responders travel toward the report, then spread into local search instead of stacking in the northwest corner.
5. Allow several responders to reach the same report and confirm they occupy distinct cells and continue searching.
6. Kill every alien in a mission whose civilian objective is optional. Confirm victory begins immediately and unresolved civilians are recorded only in the outcome/bonus.
7. Repeat in a mandatory rescue mission and confirm rescue remains required.
8. Load any battle showing an off-map or ghost target. Confirm the tactical log reports an integrity recovery and the unit appears on a valid interior cell, or the invalid objective is cleared.
9. Run Build Health and confirm all four rows above pass.

## Codex follow-up

- Port the action focus-region, corner-stall recovery, shared terminal-state helper, and battlefield-integrity guard into the Godot vertical slice before claiming browser/native parity.
- Preserve the current browser campaign as the authoritative reference for map bounds, optional-versus-mandatory rescue, and hidden-information rules.
- After this manual gate, resume the queued VIP unlimited-wave/terminal-rescue parity work without removing the new invalid-coordinate safeguards.

---

# v0.26.08.03.2312 - Tactical 3D Rectangular Viewport Fill

Browser build `v0.26.08.03.2312_TACTICAL_3D_RECTANGULAR_VIEWPORT_FILL_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; this patch is browser-renderer work only.

## Problem corrected

- The Three.js tactical camera used a wide rectangular orthographic viewport, but the renderer generated only a square cell window such as `18x18` or `26x26`.
- Close and Near zoom therefore showed a small diamond-shaped island of terrain surrounded by empty tactical background even though the camera could see a much larger ground footprint.
- The zoom level controlled both camera scale and the number of generated cells, which made the center battle panel feel underused.

## Implemented viewport contract

- Three.js camera scale and rendered-cell coverage are now separate systems.
- Each zoom button still changes apparent tactical scale: Close is most zoomed in, followed by Near, Wide, Full/Map, with Fit Map remaining the full-field containment option.
- A deterministic ground-footprint helper projects the orthographic camera corners onto the tactical ground plane.
- The renderer converts that footprint into live hex-coordinate bounds and creates every intersecting hex plus a four-cell off-screen buffer.
- Coverage is rectangular and aspect-aware rather than forcing a square `viewSize x viewSize` window.
- The camera focus is clamped far enough from map edges to keep the viewport covered whenever the finite battlefield is large enough to do so.
- Fit Map deliberately contains the complete Small, Medium, or Large battlefield and may retain perimeter margin where the square map and wide viewport have different proportions.
- Window resize events immediately update camera bounds and zoom, then perform one debounced scene rebuild so newly exposed viewport space receives real hex geometry.
- Ground picking, fog of war, cover, units, civilians, VIP pings, Skyrangers, alien saucers, movement highlights, and targeting continue to use the same shared tactical state.
- Auto, Performance, and Quality rendering modes retain their existing maximum requested zoom spans and material/light budgets; the patch fills the viewport without restoring unbounded per-cell pathfinding or animation work.

## UI/readability changes

- The bottom-right Three.js status now reports actual viewport coverage and the selected zoom label instead of claiming every view is a square such as `26 x 26`.
- The Three.js status description now identifies viewport-filled coverage while preserving the existing tactical-readability overlay.

## Build Health coverage

Added:

`Three.js tactical zoom fills the rectangular viewport without square hex clipping`

The contract verifies:

- Close, Near, Wide, and Fit Map produce ordered camera zoom values;
- wider zooms expose progressively larger ground footprints;
- computed coverage includes the complete projected footprint;
- coverage remains inside battlefield bounds;
- the renderer uses viewport-generated `renderRows` rather than the old square `visibleRows.flatMap` data window.

## Validation performed

- Extracted all six embedded browser scripts and ran `node --check`; all passed.
- Directly executed the new viewport helpers under Node.
- At a representative `1260x620` tactical canvas on a Medium `80x80` map, calculated buffered coverage was approximately:
  - Close: `23x27` rendered cells;
  - Near: `31x35`;
  - Wide: `41x49`;
  - Map: `59x73`;
  - Fit Map: the complete `80x80` battlefield.
- The helper contract returned `true`.
- Static Build Health reference scanning found no missing test declarations; the only unmatched `depthTest` token remains a Three.js material property.
- A full visual WebGL smoke test remains pending because the supplied index-only handoff did not include `assets/vendor/three.min.js` or the complete asset tree.

## Manual validation gate

1. Open a Medium or Large tactical battle in Three.js Quality mode.
2. Select Close, Near, Wide, Full, and Map in sequence. Confirm hex terrain reaches every side of the central rectangular battle panel instead of shrinking into a centered square island.
3. Confirm each button still produces an obvious scale change.
4. Pan/focus soldiers near all four map edges and confirm the camera shifts inward enough to avoid empty background whenever the map is larger than the selected viewport.
5. Select Fit Map and confirm the complete battlefield remains visible, accepting deliberate margin caused by fitting a square map inside a wide panel.
6. Repeat in Auto and Performance modes and confirm frame pacing remains practical.
7. Resize the browser window and confirm the camera updates immediately and the hex coverage rebuilds once after resizing settles.
8. Switch between 2D Hex and 3D Iso and confirm selection, movement, fog, cover, VIP trackers, saucer visibility, and battle state remain unchanged.
9. Run browser Build Health and confirm the new rectangular-viewport row passes alongside the 2032 VIP-hunt contract.

## Codex follow-up

Treat the rectangular viewport planner as the browser Three.js camera contract. Do not reintroduce a square render-window cap tied directly to the selected zoom label. Future panning or camera-control work should continue to derive render coverage from the real projected viewport footprint and keep performance bounded through renderer quality budgets rather than by leaving visible portions of the panel empty.


# v0.26.08.03.2032 - Tactical VIP Hunt, Civilian Panic, and Reinforcement Search

Browser build `v0.26.08.03.2032_TACTICAL_VIP_HUNT_PANIC_AND_REINFORCEMENT_SEARCH_INDEX_ONLY_PATCH` preserves save format 4. The native Godot vertical slice remains at `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`; matching native behavior is explicitly pending because no Godot project files were supplied in this handoff.

## Design clarification implemented

- Mandatory VIP/rescue missions now give the alien force an explicit objective to find and kill VIPs.
- The player-visible VIP tracker pulse remains AEGIS-only information. Aliens do not read the pulse, the hidden VIP cell, or any player-only fog-of-war data.
- Aliens may target a VIP only after a real alien unit has line of sight to that VIP.
- Visible VIPs take priority over visible soldiers. Visible ordinary civilians remain targets of opportunity after higher-priority targets.
- When no valid target is visible, original alien forces on VIP missions search deterministic building centers and map sectors in formation instead of moving directly toward hidden VIP coordinates.

## Civilian and VIP panic

- A living civilian or VIP who personally sees an alien enters panic automatically.
- A civilian or VIP who is fired upon enters panic whether the shot hits or misses.
- Panic breaks the current escort chain and sends the civilian through the existing bounded two-step threat-avoidance movement.
- Panic movement still uses real line of sight, occupied-cell checks, hard-cover blockers, map bounds, and the existing recovery logic after the threat is no longer visible.

## Reinforcement arrival and rally behavior

- Commander calls now store the commander's exact position at the moment of the call.
- Missed-check-in investigations store the dead commander's final position.
- Reinforcements begin on the purple saucer's rear-ramp cells where practical, rather than appearing as a disconnected cluster beside the craft.
- Every reinforcement receives a rally position, formation index, caller identity, and `rally` phase.
- Reinforcements immediately move toward the caller's or missing commander's last-known position.
- Once the reinforcement group reaches that area, each member transitions into a bounded formation search through nearby buildings and map sectors.
- During the search, real line-of-sight contact immediately overrides the search order: visible VIP first, visible soldier second, and visible civilian as a target of opportunity.
- Last-known target positions are retained only after a legitimate sighting; reaching the last-known cell returns the alien to formation search.

## Purple saucer fog of war

- Alien saucer hull and ramp cover cells now initialize with `revealed: false`.
- The craft is revealed only when AEGIS soldiers can observe its footprint under the same tactical visibility process used for other map objects.
- The Three.js craft model is created only when at least one craft footprint cell is in the player's visible set.
- Arrival messages may warn that reinforcements landed, but the craft's map position and model remain hidden until actually observed.

## Technical implementation notes

- Added shared helpers for alien-visible target priority, hidden-information-safe search waypoints, formation search cells, alien objective phases, reinforcement rally behavior, and civilian threat panic.
- Updated both tactical execution paths:
  - manual `End Turn` alien behavior;
  - AI-command / simulated tactical continuation behavior.
- Added tactical snapshot and AI-frame continuity fields so reinforcement rally/search phases, last-known contacts, and search assignments survive AI playback and `Take Back Control` handoff.
- Preserved the established 20-hex alien weapon/vision limit, TU costs, reaction fire, blocked-cell rules, map-edge guards, bounded eight-step movement, destructible cover, and save format 4.
- Non-VIP original alien behavior retains its previous soldier-pursuit fallback; reinforcement squads use the new rally-and-search behavior on all incident types.

## Build Health coverage

Added:

`Alien VIP hunts, civilian panic, fogged saucers, and reinforcement rally searches preserve hidden information`

The contract verifies:

- a visible VIP outranks a visible soldier;
- a hidden tracked VIP produces a sector-search target rather than direct pursuit;
- civilian sight of an alien triggers panic and breaks escort ownership;
- reinforcements first receive a rally target;
- reinforcements transition to formation search after reaching the rally area;
- every purple saucer cover cell begins unrevealed;
- arriving aliens carry rear-ramp emergence and rally metadata;
- at least one reinforcement begins on the craft's ramp path.

## Validation performed

- Extracted every embedded browser script and ran `node --check`; all scripts passed.
- Loaded the start screen in the available isolated Chromium harness with a local-storage shim; build `V0.26.08.03.2032` rendered.
- Started a fresh campaign and reached the main Geoscape with no JavaScript page exceptions.
- Directly executed the new tactical contract in Chromium; it returned `true`.
- Direct helper validation confirmed:
  - visible target result: `vip`;
  - hidden tracked VIP result: `search` / `alien-search-sector`;
  - civilian visible-threat result: `panic: true`, escort cleared.
- Build Health displayed `324/328` in the isolated `set_content` harness. The four failures were pre-existing external-audio/Three.js/Skyranger harness limitations caused by unavailable relative asset loading in that restricted test mode. The new VIP-hunt contract displayed `OK`.
- Full mission launch, multiple manual alien turns, reinforcement arrival presentation, and browser-with-complete-assets Build Health remain hands-on gates.

## Manual validation gate

1. Launch a mandatory VIP rescue incident and do not reveal any VIPs. Confirm aliens search buildings and sectors rather than moving directly toward tracker pulses.
2. Let an alien see a VIP and a soldier simultaneously. Confirm it targets the VIP when a legal shot exists.
3. Keep a VIP hidden behind walls while its tracker pulse is visible to the player. Confirm the aliens do not path directly toward the pulse.
4. Let a civilian see an alien without being shot. Confirm the civilian panics, leaves any escort, and runs away through a legal route.
5. Fire at a civilian and miss. Confirm the civilian still panics and runs.
6. Trigger a normal commander reinforcement call. Confirm the incoming force emerges through the purple saucer's rear ramp and moves toward the commander's call position.
7. Kill a commander before the call, wipe the original force, and wait for the missed-check-in investigation. Confirm the new force rallies on the dead commander's last position.
8. After the reinforcements reach the rally area, confirm they spread into a readable formation search for VIPs or soldiers.
9. During that search, expose an ordinary civilian with no higher-priority visible target. Confirm the aliens may fire at the civilian as a target of opportunity.
10. Observe the saucer landing outside soldier vision. Confirm no hull, ramp, or 3D craft model appears until a soldier gains line of sight to the footprint.
11. Repeat under manual control and AI Command, then use `Take Back Control` and confirm reinforcement phase/search memory remains intact.
12. Repeat on Small, Medium, Large, and two-Skyranger maps to verify bounded pathing and frame pacing.

## Native parity follow-up

The next Codex pass with the Godot project should port the exact hidden-information contract before expanding unlimited VIP reinforcement waves:

- visible-VIP-first alien target priority;
- no access to tracker pings or hidden VIP coordinates;
- civilian/VIP panic on sight or incoming fire;
- rear-ramp emergence;
- caller/dead-commander rally point;
- formation search after rally;
- opportunistic civilian fire;
- saucer fog-of-war visibility;
- matching native tests and Build Health rows.

Recommended next paired patch after the browser manual gate and native parity port:

`TACTICAL_VIP_UNBOUNDED_REINFORCEMENT_WAVES_AND_TERMINAL_RESCUE_STATE_PARITY_PATCH`

---

# v0.26.08.03.0156 / GODOT.0026 - Cross-Squad Direct Contact Response

Browser build `v0.26.08.03.0156_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_PARITY_PATCH` and native build `v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- The tactical AI used mission-wide alien visibility as though every soldier personally saw the contact. A distant second-squad responder therefore entered commander-protection, cover, line-of-sight, and flank scoring immediately.
- Those tactical scores could outweigh direct distance gain, causing a responder to hold near its commander, take a lateral position, or make only limited progress even though another squad had reported an exact alien position.
- Reported and last-known contacts did not have an explicit transition point from direct response to ordinary cover-and-engage behavior.

Implemented roadmap scope:

- Browser and Godot now calculate personal alien sight for each responding soldier separately from the mission-wide contact report.
- A non-escort with no personal sight follows a shortest practical route toward the nearest current report, distress position, or last-known alien cell. Movement remains capped at eight steps and preserves the selected firing-mode TU reserve.
- The direct route uses existing blocked-cell, occupied-cell, map-edge, doorway, and bounded path rules. If a complete route cannot be produced, a bounded reachable-cell fallback selects maximum distance gain rather than cover or formation position.
- Each route is inspected in order and ends on the first cell from which that soldier personally sees a living alien. If TU remains, the same turn immediately runs the existing cover, commander formation, flank, line-of-sight, weapon-range, and firing plan.
- Established civilian and VIP escorts retain their rescue target and never enter cross-squad convergence. A responder that cannot advance toward the report no longer substitutes an unrelated patrol move.
- Browser Build Health and native direct tests cover report-versus-personal-sight separation, full bounded direct movement, early stop on acquired sight, the cover-and-engage handoff, and escort exclusion.

Verification checklist:

- Godot 4.7.1 strict editor parsing passed with all native classes registered.
- Native tests passed `147/147`. All `104/104` native Build Health rows passed inside the suite.
- All six browser app scripts parsed and `node tools\check-aegis-build.cjs` passed with synchronized 0156/0026 labels and required seams.
- The localhost start screen displayed build 0156, a fresh campaign reached the Geoscape, and browser Build Health passed `327/327` with no failed rows.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles, returning to the human phase each time with all six soldiers alive.
- Tactical-map AI command inherited round 4 and generated a 33-frame continuation. `Take Back Control` restored the same human-phase battle.
- Browser console/runtime errors: none.

Remaining risks and manual validation:

- Send two squads to a Medium or Large incident with their Skyrangers widely separated. Let Squad A spot and fire on aliens before Squad B has personal sight.
- Confirm every Squad B soldier without an escort advances directly toward the nearest reported position, rather than staying near the Squad B commander or detouring for cover.
- Watch each responder cross its personal sight boundary. Confirm direct movement stops, then cover, formation, flanking, weapon range, line of sight, and firing behavior resume using any remaining TU.
- Assign a civilian or VIP to one Squad B soldier before contact. Confirm that escort continues on the threat-aware extraction route while the other Squad B soldiers respond.
- Let the alien leave observation. Confirm responders continue to the last-known position and then search locally without exposing unseen alien movement through fog of war.
- Automated fixtures use controlled open routes. Dense multi-building cross-squad pacing and the visual clarity of the transition remain the hands-on gate.

Next recommended paired patch after this gate: `TACTICAL_VIP_UNBOUNDED_REINFORCEMENT_WAVES_AND_TERMINAL_RESCUE_STATE_PARITY_PATCH`.

Browser implementation completed in build 2120; native Godot parity remains pending. The following contract is now browser canon:

- Browser 2120 allows an unlimited total number of VIP-mission reinforcement waves. The mission-wide one-wave guard remains unchanged for non-VIP incidents; Godot parity remains queued.
- After each VIP-mission reinforcement arrival, the alien force may establish a new eligible commander/caller and begin a fresh bounded call-check and arrival cycle. The implementation must prevent overlapping duplicate arrivals, preserve the warning/countdown presentation, and keep each individual turn and landing search bounded even though the total number of waves is uncapped.
- Killing a current alien commander may suppress or delay that wave's active call opportunity, but it must not permanently disable later VIP-mission reinforcement waves or the missed-check-in investigation cycle.
- A VIP mission cannot resolve as a tactical victory merely because every currently deployed alien is dead. It remains active while any required VIP is alive and not extracted, including while the battlefield is temporarily clear between waves.
- The terminal rescue condition is explicit: the mission may conclude only after every required VIP is either extracted or confirmed dead. Extracted VIPs count as rescued; dead VIPs count as resolved but not rescued and must affect the mission result, score, and campaign consequences accurately.
- AI-controlled soldiers must continue searching for and extracting unresolved living VIPs during clear intervals. Existing escorts retain extraction priority, while free soldiers spread toward tracker pings and unexplored likely locations.
- Browser and Godot parity coverage must include multiple sequential waves, no one-wave cap in VIP missions, unchanged one-wave behavior in ordinary incidents, no victory during a clear interval with unresolved living VIPs, terminal completion after every VIP is extracted or dead, save/resume continuity, bounded landing placement, and fog-of-war-safe playback.
- Performance safeguards must cap work per alien turn, reinforcement arrival, path search, render update, and AI playback frame. Unlimited waves must not mean unbounded work in any single browser frame or native process tick.

The inventory/elevation foundation remains queued immediately afterward as `TACTICAL_CLASSIC_INVENTORY_CONTAINER_LOADOUT_AND_ELEVATION_RENDER_FOUNDATION_PARITY_PATCH`.

---

# v0.26.08.03.0155 / GODOT.0025 - Missed Check-In Investigation Reinforcements and Purple Saucer

Browser build `v0.26.08.03.0155_ALIEN_COMMANDER_MISSED_CHECKIN_INVESTIGATION_REINFORCEMENT_PARITY_PATCH` and native build `v0.26.08.03.GODOT.0025_ALIEN_COMMANDER_MISSED_CHECKIN_REINFORCEMENT_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Killing the original commander before a successful call permanently disabled reinforcement logic. An unresolved rescue could therefore continue indefinitely after the original force was wiped without triggering the missed check-in response requested by the campaign fiction.
- Legacy optional-round normalization treated `null` as round zero because `Number(null)` is zero. That could make a missing deadline appear immediately due in test or migrated state.
- The alien landing craft reused an angular dropship silhouette that did not read clearly as a distinct alien flying saucer, especially in the Three.js isometric view.

Implemented roadmap scope:

- Commander death before a call records the death round and derives a deterministic delay from 5 through 15 rounds. The value is stable for that incident and survives the existing tactical-state lifecycle without changing save format 4.
- The fallback remains dormant while any original alien survives. Once that force is wiped, an unresolved mission reaching the deadline schedules an immediate missed-check-in investigation arrival.
- Commander calls and missed-check-in investigations share the existing `called` and `arrived` guards, so only one reinforcement wave can ever be created per incident.
- Investigation arrivals reuse the two-to-four-alien deployment, 32 deterministic perimeter candidates, map-edge guards, occupied-cell rejection, building and Skyranger separation, and one-round landing retry when no valid footprint exists.
- Browser 2D now draws a layered purple disc, dome, rim lights, rear opening, and ramp. Three.js builds one flattened saucer body with an upper dome, illuminated rim, rear opening, rails, and ramp instead of assembling the alien craft from Skyranger-like boxes and wings.
- Godot draws the same saucer language with layered ellipses, dome, rim lights, and rear deployment ramp.
- Browser Build Health and native direct tests cover optional-round normalization, deterministic deadline bounds, no early trigger, surviving-alien suppression, wiped-force activation, one-wave ownership, and the purple saucer rendering contract.

Verification checklist:

- Godot 4.7.1 strict editor parsing passed with all native classes registered.
- Native tests passed `144/144`. All `103/103` native Build Health rows passed inside the suite.
- All six browser app scripts parsed and `node tools\check-aegis-build.cjs` passed with synchronized 0155/0025 labels and required seams.
- The localhost start screen displayed build 0155, a fresh campaign reached the Geoscape, and browser Build Health passed `326/326` with no failed rows.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles, returning to the human phase each time with all six soldiers alive.
- The same live mission switched to Three.js, reported a 26x26 tactical view, and initialized one canvas.
- Browser console/runtime errors: none.

Remaining risks and manual validation:

- Kill the original commander before any call, wipe the original force while a mandatory rescue remains unresolved, and confirm the displayed deadline falls 5 to 15 rounds after commander death.
- Keep that mission active through the deadline and confirm exactly one investigation saucer lands with two to four aliens. Confirm its rear ramp is visible and usable for deployment.
- Complete an equivalent mission before the deadline and confirm no investigation craft arrives after returning to the Geoscape.
- Allow a normal commander call in a separate battle, then defeat that force and wait past the theoretical missed-check-in window to confirm a second wave cannot occur.
- Repeat on Medium and Large maps, including a two-Skyranger deployment, and confirm the saucer never contacts a building or either Skyranger.
- Inspect the craft in browser 2D, browser Three.js, and Godot. Automated contracts verify construction and placement, but the exact live missed-check-in presentation remains the hands-on gate.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_CONTAINER_LOADOUT_AND_ELEVATION_RENDER_FOUNDATION_PARITY_PATCH`, expanding the bounded inventory foundation without beginning a broad multi-level tactical rewrite.

---

# v0.26.08.02.0154 / GODOT.0024 - AI Camera, Fit Map Perimeter, Nearest VIP, and Alien Reinforcements

Browser build `v0.26.08.02.0154_TACTICAL_AI_CAMERA_FIT_MAP_NEAREST_VIP_AND_ALIEN_REINFORCEMENT_PARITY_PATCH` and native build `v0.26.08.02.GODOT.0024_NEAREST_VIP_ESCORT_AND_ALIEN_REINFORCEMENT_DROPSHIP_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- AI map playback could fall back to a squad or battlefield center between frames instead of retaining the active actor's camera anchor.
- Fit Map used the exact calculated battlefield extents, leaving no presentation perimeter and allowing the lower corner to appear clipped.
- Tracker assignment and stale civilian claims could steer a free soldier toward a reserved or farther VIP instead of the closest currently unescorted target.
- Incident battles had no bounded reinforcement state, commander suppression rule, delayed arrival, one-call guard, or landing-craft clearance contract.
- The first native landing candidate pattern sampled only alternating top and bottom lanes and imposed an unnecessary one-cell buffer around every moving unit. On a crowded Small map it could reject every candidate even when a non-overlapping side/perimeter footprint existed.

Implemented roadmap scope:

- AI playback frames carry an acting-unit ID. Camera handoff centers that visible actor, uses observable shot endpoints when appropriate, and retains the last anchor on phase-complete frames rather than cutting to map center.
- Browser 2D and Three.js Fit Map calculations reserve roughly ten percent perimeter space and validate every Small, Medium, and Large corner against live viewport/camera metrics.
- Before combat priority, each free soldier independently selects the nearest revealed unescorted VIP. Hidden tracker guidance uses the same per-soldier nearest-target rule, and adjacency still performs the established 8 TU contact action.
- The original alien force marks one commander. Each alien turn with soldier observation increments a capped call chance from 4 percent; killing that commander before a successful call permanently prevents that force from summoning reinforcements.
- One successful call schedules arrival two rounds later. A delayed craft deploys two to four non-commander aliens and cannot be called again during that incident.
- Browser and Godot render one small purple alien craft with a rear ramp. Placement inspects at most 32 deterministic perimeter candidates, keeps every hull/ramp cell inside the map, requires more than one hex of separation from live building cells and every Skyranger hull/ramp cell, and forbids direct overlap with living units.
- If no safe candidate exists at ETA, arrival waits one round and retries the same bounded search. Tactical victory waits while a called craft remains inbound.
- Build Health and native direct tests cover camera ownership, Fit Map perimeter framing, nearest-VIP selection, commander-death suppression, forced call, delayed clear landing, two-to-four-unit deployment, and the one-call limit.

Verification checklist:

- Godot 4.7.1 strict editor parsing passed with all native classes registered.
- Native tests passed `138/138`. All `101/101` native Build Health rows passed inside the suite.
- All six browser app scripts parsed, `node tools\check-aegis-build.cjs` passed, and `git diff --check` reported no whitespace errors.
- The localhost start screen displayed build 0154, a fresh campaign reached the Geoscape, and browser Build Health passed `324/324` with no failed rows.
- A six-soldier Small 64x64 Red River Signal mission launched in safe 2D, used Fit Map in 2D and Three.js, and completed three confirmed End Turn cycles with all six soldiers alive.
- The live commander naturally called reinforcements. Two hostiles arrived after the delay; the alien craft was visibly clear of the Ranger Outpost and Skyranger in 2D and appeared as one purple craft in Three.js.
- AI tactical playback reached a named active-actor frame and `Take Back Control` restored the same human-phase battle.
- Browser console/runtime errors: none. The existing Tailwind CDN development warning was the only console warning.

Remaining risks and manual validation:

- Kill the original alien commander before any successful call, then maintain alien observation for several rounds and confirm no reinforcement countdown begins.
- In separate Medium and Large missions, including one with two Skyrangers, allow a natural arrival and confirm no alien hull or ramp cell contacts a building or either Skyranger.
- Confirm a called craft with no valid landing footprint remains inbound and later lands only after a valid footprint opens.
- In a rescue mission with VIPs separated across the map or inside different buildings, confirm each unengaged free soldier approaches and contacts the closest unescorted VIP without circling.
- The natural trigger is intentionally rare and deterministic per incident/round; balance of the 4-to-46-percent escalation and two-round warning still needs longer campaign play.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_CONTAINER_LOADOUT_AND_ELEVATION_RENDER_FOUNDATION_PARITY_PATCH`, expanding the bounded inventory foundation without beginning a broad multi-level tactical rewrite.

---

# v0.26.08.02.0153 / GODOT.0023 - Inventory, VIP Priority, Door Routing, Fit Map, and Facility Dropdown

Browser build `v0.26.08.02.0153_TACTICAL_INVENTORY_VIP_PRIORITY_DOOR_ROUTING_FIT_MAP_AND_BASE_FACILITY_DROPDOWN_PARITY_PATCH` and native build `v0.26.08.02.GODOT.0023_INVENTORY_VIP_PRIORITY_DOOR_ROUTING_FIT_MAP_AND_BASE_FACILITY_DROPDOWN_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- A tracker-search move could end beside a civilian without running the contact action. On the next turn, target scoring could choose a different adjacent hex, producing repeated circles around the VIP.
- Tracker assignment reserved one searcher per ping and sent the rest into general area sweeps even though tracked rescue was still the primary objective.
- Local soldier engagement checks allowed new rescue claims while another squad member had already confirmed alien contact, splitting non-escort combat response.
- Several browser tactical helpers retained the original 64-cell boundary. Large-map doorway and visibility routes could therefore reject valid cells outside the old bounds.
- Native building ingress and both clients' overview controls did not have explicit direct regression coverage.
- Base facility construction rendered the complete catalog as a long button list, and the classic inventory display had no bounded adjacent-transfer or floor-state actions.

Implemented roadmap scope:

- Before alien contact, all free AI soldiers receive deterministic tracker assignments. Multiple soldiers may approach the same tracked VIP from distinct zones when there are fewer pings than soldiers.
- Any visible or remembered alien contact creates squad-wide combat priority for non-escorts. Existing escorts continue along threat-aware extraction routes; new claims resume when contact is cleared.
- Reaching adjacency during tracker movement immediately spends the established 8 TU contact cost and assigns the escort in the same AI action. Stale tracker assignments are invalidated after reveal or contact.
- Browser and native rescue plans use the actual doorway or destroyed-wall breach path when a target is inside a building. Browser path, reachable, neighbor, edge, and visibility bounds derive from the live Small, Medium, or Large grid while retaining indexed queues and bounded movement slices.
- Fit Map shows the entire tactical grid in browser 2D/Three.js and native tactical views. Existing zoom indices remain compatible with current saves.
- Field inventory now supports 4 TU adjacent same-elevation hand/belt transfers plus exact-cell, exact-elevation drop and pickup. Primed grenades and incompatible or occupied target slots remain blocked.
- Base construction uses one compact facility dropdown with current cost, duration, capacity effect, and blocker feedback.
- Browser Build Health adds four rows. Native Build Health adds four rows and reaches 100; native automation adds six checks and reaches 131.

Verification checklist:

- Godot 4.7.1 strict project parsing passed with all native classes registered.
- Native tests passed `131/131`, including Fit Map framing, four inventory state checks, real-door ingress, tracker assignment, and three practical End Turn cycles.
- All `100/100` native Build Health rows passed inside the suite.
- All six browser app scripts parsed, and `node tools\check-aegis-build.cjs` passed with synchronized 0153/0023 labels and required seams.
- The localhost start screen displayed build 0153, a fresh campaign reached the Geoscape, and the compact Base facility selector exposed all 12 build choices. Browser Build Health passed `320/320` with no failed rows.
- A six-soldier Small 64x64 Red River Signal rescue mission launched in safe 2D. Fit Map retained the complete tactical state, and three End Turn cycles returned to the human phase without a tactical runtime surface or console error. The existing Tailwind CDN development warning was the only console warning.

Remaining risks and manual validation:

- Run a mandatory-rescue mission with an indoor VIP under AI command. Confirm soldiers enter through a doorway, contact the VIP immediately on adjacency, and do not circle.
- Reveal an alien before contact. Confirm all non-escorts break toward combat while an existing escort continues taking a threat-aware route to the Skyranger.
- On Small, Medium, and Large missions, switch between normal zooms and Fit Map in 2D and Three.js. Confirm the complete playable perimeter is visible and selection remains accurate.
- Transfer a grenade or Medkit between adjacent soldiers, drop it, pick it up, and verify 4 TU per action. Confirm transfer is blocked across different elevations and for a primed grenade.
- Open Base construction and verify every facility remains selectable from the dropdown with correct cost, duration, blocker, and project-slot behavior.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_CONTAINER_LOADOUT_AND_ELEVATION_RENDER_FOUNDATION_PARITY_PATCH`, expanding the bounded inventory foundation without beginning a broad multi-level tactical rewrite.

---

# v0.26.08.02.0152 / GODOT.0022 - Escort Building Egress, Full-Column Extraction, and Isometric Framing

Browser build `v0.26.08.02.0152_TACTICAL_ESCORT_BUILDING_EGRESS_FULL_COLUMN_EXTRACTION_AND_ISOMETRIC_FRAMING_PARITY_PATCH` and native build `v0.26.08.02.GODOT.0022_ESCORT_BUILDING_EGRESS_AND_FULL_COLUMN_EXTRACTION_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Rescue AI selected each turn's reachable cell by straight-line distance to the distant ramp. Inside a building, the correct route can initially move sideways or farther away to reach a door or breach, so escorts could settle against an intact wall or oscillate.
- Browser building egress initially inherited the old 64-cell neighbor default even on Medium and Large maps, leaving interiors beyond row or column 63 with no candidates.
- Extraction routing always targeted the first ramp cell. On the following turn, an escort already standing on that cell could move back outside instead of continuing into the craft.
- In browser step-by-step movement, removing the first extracted civilian left a one-cell gap. Remaining civilians kept their joined state and refused the fallback move needed to close the column.
- The Three.js orthographic framing used a symmetric fixed span with map-scaled zoom. The tilted ground projection could extend below the lower clip edge, especially in overview framing.

Implemented roadmap scope:

- Browser and Godot detect the procedural building containing an escort, inspect only that building's bounded perimeter, and accept declared doors or nonblocking destroyed-wall rubble as exits. Actual paths are ranked by known alien exposure, route length, and onward ramp distance.
- Browser egress is capped at 192 queued cells and a 32-step building-local search, then truncated to the existing eight-step per-turn movement budget. Native routing keeps its existing bounded path and eight-step movement limits. Shot-mode TU reservation remains authoritative.
- After reaching the exterior, the same plan spends any remaining movement toward extraction without crossing intact walls. A turn that cannot clear the structure resumes from the exact live cell next turn.
- Ramp routing recognizes an escort already on the corridor and continues inward through unique ramp cells. Coordinated missions select the current or nearest Skyranger's own corridor instead of concatenating separate craft ramps.
- Browser civilian columns may close a one-cell gap left by an extracted lead follower. The existing single-file, occupancy, capacity, panic, and wall rules remain intact.
- Native Skyranger ramps use a deterministic bounded path through their nine extraction cells, giving a four-civilian column enough trailing movement without sending any unit onto the unplayable map edge.
- Three.js camera bounds remain aspect-correct while reserving additional projected space above tall objects and below the near ground edge. Near and Full Performance views retain visible margin below the battlefield.
- Browser Build Health adds two rows and reaches 316. Native Build Health adds one row and reaches 96; native automation adds two direct checks and reaches 125.

Verification checklist:

- Static browser app-script parsing and `node tools\check-aegis-build.cjs` passed with synchronized 0152/0022 labels.
- Localhost 0152 start screen displayed, a fresh campaign reached the Geoscape, and browser Build Health passed `316/316` with no failed rows.
- A six-soldier Small Red River Signal launched in safe 2D. Selecting Jace displayed authoritative `48/48` TU. Three End Turn cycles returned to the human phase with all six soldiers alive; revealed contacts progressed from one to three.
- The same live battle switched to Three.js Performance. Near `26x26` and Full capped `32x32` views rendered the complete lower battlefield edge with visible margin.
- Godot 4.7.1 strict editor parsing passed. Native tests passed `125/125`, including forced destroyed-wall egress and a four-civilian ramp column. All `96/96` visible native Build Health rows passed inside the suite.
- No browser runtime-error surface appeared during startup, Build Health, tactical turns, or Three.js switching. The available in-app browser interface did not expose a separate historical console-message feed.

Remaining risks and manual validation:

- Load the affected rescue campaign without overwriting it. Place an AI-controlled escort column inside a building and confirm it uses the nearest practical door rather than pressing against a wall.
- Destroy a different exterior wall, block or avoid the normal door, and confirm soldiers plus all escorted civilians pass through the rubble before turning toward extraction.
- Test one through four followers. Confirm the escort continues inward on subsequent turns until every civilian or VIP enters the ramp and the rescue counter increments for each one.
- Repeat with two dispatched squads and two Skyrangers. Confirm each escort uses its own nearest craft and neither column crosses to the other ramp.
- Inspect Three.js Close, Near, Wide, Full, and Performance-capped Map views on Small, Medium, and Large missions. Confirm the lower map edge, Skyrangers, and units remain visible while panning to southern cells.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.02.0151 / GODOT.0021 - VIP Priority, Rescue Guards, Camera Visibility, and Building Density

Browser build `v0.26.08.02.0151_TACTICAL_VIP_PRIORITY_GUARDS_CAMERA_VISIBILITY_AND_BUILDING_DENSITY_PARITY_PATCH` and native build `v0.26.08.02.GODOT.0021_VIP_PRIORITY_GUARDS_VISIBILITY_AND_BUILDING_DENSITY_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- A remembered alien contact acted as a global combat gate, so soldiers who were nowhere near that threat could ignore an adjacent tracked VIP.
- Escorted civilians still depended on ordinary fog visibility and could disappear even though the player had already established and was actively guiding the rescue column.
- Secure rescue AI kept assigning map-search destinations after every VIP had been found and escorted instead of forming a protective evacuation perimeter.
- The browser tactical camera let recent shot playback override the player's current soldier selection.
- Building counts used fixed biome baselines. Map size did not create additional building opportunities, and terrain categories did not expose a clear wilderness-to-town-to-city density progression.

Implemented roadmap scope:

- Browser and Godot AI use a bounded per-soldier local-engagement test requiring a living visible alien, current weapon range, and line of sight. Unengaged soldiers can take immediate contact responsibility for a visible unclaimed VIP while squadmates continue toward remembered contacts.
- Living, unrescued escorted civilians stay visible in browser 2D, browser Three.js, and Godot tactical presentation without revealing unrelated civilians or unseen aliens.
- Once aliens are defeated and every active VIP is revealed and assigned an escort, deterministic guard assignment gives non-escorts distinct passable cells around escorted civilians and Skyranger ramps. Active escorts retain extraction duty.
- Manual browser 2D and Three.js camera centers use the selected living soldier before any historical shot effect; AI playback continues using its current action anchor.
- Browser and Godot building-density profiles preserve deterministic seeds and bounded candidate lists. Browser Small, Medium, and Large tiers expose zero, one, and two bonus opportunities on top of biome baselines; the more compact native boards use one, two, and three optional rolls after their fixed primary structure. Both use descending city, town, farm, and wilderness placement chances.
- Browser Build Health adds four rows and reaches 314. Native Build Health adds three rows and reaches 95; native automation adds four direct checks and reaches 123.

Verification checklist:

- Static browser app-script parsing and `node tools\check-aegis-build.cjs` passed with synchronized 0151/0021 labels.
- Localhost 0151 start screen displayed, a fresh campaign reached the Geoscape, and browser Build Health passed `314/314` with no failed rows.
- A six-soldier Small Red River Signal launched in safe 2D on a `64x64` battlefield with one Skyranger and one Ranger Outpost. Selecting Bryn displayed authoritative `51/51` TU and a three-hex route to the extraction ramp.
- Three End Turn cycles returned to the human phase. All six soldiers remained alive; visible alien contacts advanced from zero to one and then three without a lockup.
- Browser console inspection found no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Godot 4.7.1 strict editor parsing passed. Native tests passed `123/123`, including remote-contact VIP priority, local-engagement override, escorted-VIP visibility, unique rescue guards, and biome/tier density scaling. All `95/95` visible native Build Health rows passed inside the suite.

Remaining risks and manual validation:

- In a mandatory rescue battle, keep one revealed alien contact beyond a soldier's local range and place that soldier beside an uncontacted VIP. Confirm AI contacts the VIP while other available soldiers converge on the remembered threat.
- Repeat with a visible alien in range and line of sight of that soldier. Confirm the threatened soldier fights while another available soldier assumes VIP duty.
- Select several widely separated soldiers in browser 2D and Three.js. Confirm each selection recenters the camera and a prior shot does not pull focus away.
- Escort a blue VIP through explored and currently unobserved cells. Confirm the civilian remains visible until reaching a rear ramp.
- After killing every alien and contacting every surviving VIP, confirm established escorts keep extracting while idle soldiers spread into distinct nearby guard positions without blocking ramps.
- Compare repeated Small, Medium, and Large wilderness, farm, town, and city maps. Confirm larger and more urban maps trend toward more structures while deterministic mission seeds reproduce the same layout.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.02.0150 / GODOT.0020 - Multi-Skyranger Deployment, Map Tiers, Edge Guards, and 3D VIP Pings

Browser build `v0.26.08.02.0150_TACTICAL_MULTI_SKYRANGER_MAP_TIERS_EDGE_GUARDS_AND_3D_VIP_PINGS_PARITY_PATCH` and native build `v0.26.08.02.GODOT.0020_MULTI_TRANSPORT_MAP_TIERS_AND_EDGE_GUARDS_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Tactical deployment retained only a single Skyranger placement and inferred every soldier from one combined list, so coordinated response squads could not receive separate craft or exact ramp formations.
- Browser and native tactical dimensions were fixed constants. Mission threat, response size, and civilian capacity could not select a larger battlefield.
- Neighbor and path rules treated outer cells as playable, allowing player and AI plans to target the visible map boundary.
- VIP tracker data existed in Three.js battles, but the renderer created no dedicated tracker geometry. The first geometry pass was also too subtle and disappeared completely between pulse windows.

Implemented roadmap scope:

- Strategic browser launches persist `responseSquadDeployments`, exact soldier IDs, transport indexes, and transport count through direct and ferry travel before tactical generation.
- Browser deployment creates one separated, building-clear Skyranger per response squad and forms each squad beside its own rear ramp. Godot supports the native slice's current one- or two-transport response and preserves exact deployment groups when supplied.
- Browser map profiles are Small `64x64`, Medium `80x80`, and Large `96x96`; native profiles are Small `20x14`, Medium `26x18`, and Large `32x22`. Higher tiers add deterministic civilian capacity and bounded terrain coverage.
- Mission threat and coordinated transport count select a profile conservatively, while explicit `tacticalMapTier` or `mapSize` data remains authoritative.
- Tactical neighbors, direct paths, reachable floods, AI movement plans, search targets, visibility bounds, click handling, and generated units share the live grid size and reject the outer perimeter.
- 2D and Three.js windows remain capped by their existing performance budgets instead of rendering an entire Medium or Large map at once.
- Three.js now creates lightweight amber world rings, an elevated locator, and a screen-space `VIP` reticle projected from the correct tactical cell. The locator remains visible between bounded pulse windows and clamps below the tactical status overlay.
- Browser Build Health adds three rows and reaches 310. Native Build Health adds three rows and reaches 92; native automation adds three direct checks and reaches 119.

Verification checklist:

- Static browser app-script parsing and `node tools\check-aegis-build.cjs` passed with synchronized 0150/0020 labels. `git diff --check` passed aside from informational Windows line-ending notices.
- Localhost start screen displayed 0150, a fresh campaign reached the Geoscape, and browser Build Health passed `310/310` with no failed rows.
- A six-soldier Small Prairie Abduction launched in safe 2D with one Skyranger and its rear-ramp formation. The generated mission reported a `64x64` battlefield.
- The same live mission switched to Three.js Performance mode. One in-window tracked VIP produced a persistent projected `VIP` reticle below the status overlay and reported one active 3D tracker beacon.
- Three End Turn cycles returned to the human phase. All six soldiers remained alive and the mission continued without a lockup.
- Browser console inspection found no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Godot 4.7.1 strict editor parsing passed. Native tests passed `119/119`, including exact two-transport squad formation, all three map profiles and civilian counts, and perimeter path rejection. All `92/92` visible native Build Health rows passed inside the suite.

Remaining risks and manual validation:

- Dispatch two staffed squads with two available Skyrangers in the browser. Confirm exactly two craft appear, neither overlaps a building, and each squad begins beside its own rear ramp.
- Launch a Medium battle and a Large battle. Confirm the reported dimensions, increased civilian population, viewport panning, terrain distribution, frame pacing, and turn duration remain practical.
- In player and AI control, try to order units onto every outer edge and toward off-map objectives. Confirm no soldier, alien, civilian, path highlight, or AI route enters or crosses the perimeter.
- In a multi-VIP rescue battle, inspect 3D Close, Near, Wide, and Full views. Confirm each in-window VIP reticle tracks the correct location, remains legible below overlays, and its world rings pulse without obscuring units.
- In Godot, visually inspect Small, Medium, and Large boards plus a two-transport battle. Confirm both craft, ramp formations, scaled hexes, tracker pulses, and edge outlines remain readable at the native window size.
- The native vertical slice currently caps tactical transports at two because its strategic response layer does not yet expose the browser game's broader multi-base aircraft roster.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0149 / GODOT.0019 - VIP Trackers and Post-Combat Rescue Search

Browser build `v0.26.08.01.0149_TACTICAL_VIP_TRACKERS_AND_POST_COMBAT_RESCUE_SEARCH_PARITY_PATCH` and native build `v0.26.08.01.GODOT.0019_VIP_TRACKERS_AND_POST_COMBAT_RESCUE_SEARCH_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Once aliens were defeated, secure-rescue AI could read every hidden civilian position directly instead of using authorized mission intelligence or conducting a real search.
- Rescue searchers did not retain explored coverage or divide responsibility across separate building interiors and map sectors, encouraging redundant movement.
- Mandatory rescue targets had no periodic locator cue, so finding the final civilians could become a slow blind sweep.
- The first browser marker draft calculated tracker data inside every rendered hex; it was replaced before release with one indexed tracker map per tactical render.
- Fresh startup smoke exposed that tracker polling could pass an explicit null mission into the older objective helper. The helper now normalizes null mission context before reading mission intent, preventing non-tactical screens from failing.

Implemented roadmap scope:

- All civilians counted by a mandatory rescue objective are treated as tracked VIPs. Browser safe-2D and the Godot board draw periodic amber map pulses at their current cells until rescue or death.
- While no alien is visible or remembered, AI searchers follow distinct tracker pings and retain the selected firing mode's TU reserve. Alien contact and squad distress override tracker guidance; active civilian escorts keep their extraction assignment.
- Secure-area AI assigns one searcher to each unclaimed tracker first, then one searcher per unexplored building interior, then spreads remaining soldiers across distinct unexplored sectors.
- Existing civilian escorts remain assigned to extraction and are excluded from search reassignment.
- Browser and native visibility refreshes retain bounded explored-cell memory. Ordinary untracked hidden civilians are not selected through hidden-position omniscience.
- Browser objective lookup accepts absent or null mission context, so start-screen and Geoscape tracker polling remains inert and safe outside battle.
- Search assignment stays deterministic and bounded by the existing tactical candidate limits; no full-map repeated pathfinding or per-cell tracker filtering was introduced.
- Browser Build Health adds one row and reaches 307. Native Build Health adds one row and reaches 89; native automation adds one direct check and reaches 116.

Verification checklist:

- Static browser app-script parsing and `node tools\\check-aegis-build.cjs` passed with synchronized 0149/0019 labels.
- Localhost start screen displayed 0149, Geoscape loaded, and browser Build Health passed `307/307` after a cache-busted reload.
- A six-soldier Prairie Abduction launched in safe 2D. The 64x64 overview displayed two VIP tracker pulses; three End Turn cycles returned to the human phase with all six soldiers alive.
- A second cache-busted Prairie Abduction handoff generated 188 bounded AI playback frames. With zero aliens revealed, playback advanced through frame 6; taking back control preserved all six soldiers, rescue progress 0/2, round 1, both VIP pulses, and the live battlefield.
- The in-battle UFO alert retained tactical command while recording the selected post-battle Geoscape speed.
- Browser diagnostics contained no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Godot 4.7.1 strict editor parsing passed. Native tests passed `116/116`, including distinct tracker/building/sector assignments, and all `89/89` visible native Build Health rows passed inside the suite.

Remaining risks and manual validation:

- Before alien contact in browser and Godot mandatory-rescue missions, hand control to AI and confirm separate available soldiers move toward separate tracker pulses while preserving enough TU for their selected shot.
- Reveal an alien or trigger a squad distress call and confirm non-escorts immediately leave tracker search for the higher-priority contact while active escorts continue toward extraction.
- In browser and Godot mandatory-rescue missions, eliminate every alien before finding every VIP. Hand control to AI and confirm separate soldiers head toward separate pulses/buildings instead of stacking or oscillating.
- Let one soldier retain an active civilian column during that sweep and confirm the escort continues to the Skyranger ramp while other soldiers search.
- Watch several pulse cycles at Near, Wide, and Full zoom and confirm both the location and visual cadence remain readable without obscuring units.
- Confirm a non-mandatory mission does not expose unrevealed ordinary civilians through tracker markers or AI targeting.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0148 / GODOT.0018 - Simulation Reliability, Squad Replacement, and Distress Response

Browser build `v0.26.08.01.0148_TACTICAL_SIMULATION_RELIABILITY_AND_SQUAD_REPLACEMENT_INDEX_ONLY_PATCH` and native build `v0.26.08.01.GODOT.0018_TACTICAL_DISTRESS_RESPONSE_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Fresh simulated encounters refreshed human TU only when inheriting an existing manual battlefield. After round one, a fresh squad could spend all TU and remain inert forever while aliens refreshed normally each turn.
- Classic sequential playback inherited a lethal target's final dead snapshot before its shooter frame, especially when the target also moved or the firing alien was hidden.
- Simultaneous squad replacements were generated inside one state map against the same unchanged used-name list, so both wiped A/B squads independently selected the C letter.
- Tactical AI retained general alien contact memory but did not broadcast a wounded or downed soldier's location and the firing direction as a squad response objective.
- A randomized building/deployment self-test compared unit positions against pre-landing cover, including props the Skyranger had legitimately removed from the authoritative battlefield, producing intermittent four-row Build Health failures.

Implemented roadmap scope:

- Every living simulated soldier refreshes to `maxTu` after round one; inherited first-round TU remains untouched and dead soldiers are never refreshed.
- Classic playback stages lethal targets alive at their final moved position through the shot frame, applies death on the following impact frame, and includes hidden firing actions in the all-seeing Classic presentation.
- Mission cleanup now allocates replacement squad names sequentially in one transaction. A/B wipeouts reserve C before generating D while surviving squads still remove KIA normally.
- Browser and native alien fire record the casualty position, shooter identity, and firing cell for twelve bounded turns. Non-escort AI soldiers converge on a living wounded soldier or a casualty's last position; once within four hexes they search the shooter's recorded firing direction. Current visible combat still takes priority and established civilian escorts remain on extraction duty.
- Tactical deployment health checks now validate against the post-placement cover collection used by rendering, pathfinding, and line of sight, removing the randomized false failure without changing map generation.
- Browser Build Health adds three rows and reaches 306. Native Build Health adds one row and reaches 88; native automation adds one direct check and reaches 115.

Verification checklist:

- Static browser app-script parsing passed through the build checker.
- `node tools\check-aegis-build.cjs` passed with synchronized browser 0148 and native 0018 labels and the new tactical seams.
- Localhost start screen displayed 0148 and Geoscape loaded.
- Browser Build Health passed `306/306` on two final cache-busted loads, including simulated TU refresh, paired C/D replacements, Classic lethal ordering, and squad distress response.
- A practical six-soldier simulated Red River Signal incident completed after three exchanges: five soldiers survived and all three aliens were eliminated.
- Browser diagnostics contained no runtime errors. The only warnings were Tailwind's existing development-CDN advisory.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `115/115`; all `88/88` visible native Build Health rows passed inside the suite.

Remaining risks and manual validation:

- Wipe both A and B squads in one coordinated browser mission and confirm the two empty replacements are labeled C and D with distinct names.
- Watch a lethal Classic Lineup exchange in which the target moves or the shooter is initially hidden. Confirm the target remains standing through the visible shot and falls only on impact.
- During AI command, let alien fire hit or miss a soldier. Confirm every available non-escort converges on the living soldier or downed position, then fans toward the reported shooter direction while active civilian escorts continue to the ramp.
- Repeat a high-threat two-squad Simulate Encounter and confirm every living soldier resumes acting after round one until the final alien is eliminated or the squad is genuinely defeated.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0147 / GODOT.0017 - Contact Memory, Tactical Continuity, and Safe Landing

Browser build `v0.26.08.01.0147_TACTICAL_CONTACT_MEMORY_STATE_CONTINUITY_AND_SAFE_LANDING_PARITY_PATCH` and native build `v0.26.08.01.GODOT.0017_TACTICAL_CONTACT_MEMORY_RESCUE_PRIORITY_AND_SAFE_LANDING_VERTICAL_SLICE` preserve save format 4 and close several tactical continuity gaps without restoring unbounded map work.

Root causes addressed:

- AI combat movement depended on currently visible aliens. Once line of sight broke, non-escort soldiers could resume generic search instead of reinforcing the last observed contact area.
- Civilian discovery did not establish ownership before alien contact, so later combat priority could displace the soldier who had first found an unapproached civilian.
- Leaving a manual tactical section unmounted `TacticalMission`; returning regenerated deployment, fog, units, damage, rescue progress, and controls from the mission seed.
- Skyranger placement used its preferred deployment center and then removed overlapping cover, which could erase structure cells and allow the craft to touch a procedural building.
- Sequential Classic Lineup frames applied lethal HP state in the firing frame, and all-clear dialogue could occur before the final impact/action frame had completed.
- A delayed alien-turn callback could read stale pre-resolution units after the final alien had already been removed.

Implemented roadmap scope:

- Browser aliens retain `lastKnownX/lastKnownY`; native aliens retain `last_known_cell`. A mission-level contact flag prevents a discovered threat from being forgotten merely because it leaves line of sight.
- Non-escort AI soldiers use bounded movement toward visible contacts first and remembered contact cells second. Shooting, reaction fire, visibility, and fog still require current observation and line of sight.
- Before any alien contact, a revealed civilian is claimed by the nearest eligible observing soldier. The civilian and soldier retain reciprocal priority IDs; an active escort remains exempt from combat convergence.
- Browser live tactical state is cached by mission ID across command-section unmounts, including deployment, cover damage, units/TU, selection, fog, view, fire/reserve/targeting controls, log, round, and AI playback. Cache entries are removed only when the incident finishes.
- Skyranger placement checks the complete hull/ramp footprint plus one-hex building clearance through a bounded battlefield search. Existing building cover is retained rather than deleted under the craft.
- Classic Lineup lethal shots keep the target alive in the shot frame and add an immediate impact frame for death. Final resolution and last-alien dialogue are phase-complete gated, and manual alien callbacks re-read authoritative units before acting.
- Browser Build Health gains five rows and reaches 303. Native Build Health gains two rows and reaches 87; native automation adds three direct checks and reaches 114.

Verification checklist:

- Static browser app-script parsing passed.
- `node tools\check-aegis-build.cjs` passed with paired 0147/0017 labels and the new tactical seams.
- Localhost start screen and Geoscape smoke passed with the 0147 label.
- Browser Build Health passed `303/303` on a cache-busted load.
- A practical six-soldier 64x64 safe-2D incident launched. Mina's selected state and the original deployment/log survived a visit to Base and return to Missions.
- Three End Turn cycles returned to the human phase in approximately 0.9, 1.1, and 1.1 seconds.
- Tactical-map AI playback showed sequential actor frames for Theo and Mina; Take Back Control returned to the same live mission.
- Browser diagnostics contained no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Native tests passed `114/114`; native Build Health passed `87/87`; Godot 4.7.1 strict editor parsing exited successfully.

Remaining risks and manual validation:

- Load the originally affected rescue campaign without overwriting it. Confirm every non-escort converges on the last observed alien area while current escorts continue to the ramp and no soldier oscillates or idles indefinitely.
- Spot a civilian before any alien and confirm the discovering soldier retains rescue priority after another soldier reveals a hostile.
- Inspect several dense urban maps and confirm the complete Skyranger hull and ramp remain at least one hex clear of every building.
- Damage a wall, move units, and begin civilian rescue; visit another command section and return to confirm every changed cell, TU value, and escort state remains exact.
- Watch a lethal Classic Lineup exchange and confirm the target remains standing until the shot appears, falls on impact, all-clear follows the final action, and no unit continues firing afterward.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0146 / GODOT.0016 - Full-Squad AI, Threat-Aware Escorts, and Base Continuity

Browser build `v0.26.08.01.0146_FULL_SQUAD_AI_COMBAT_PRIORITY_AND_THREAT_AVOIDING_ESCORT_PARITY_PATCH` and native build `v0.26.08.01.GODOT.0016_FULL_SQUAD_AI_COMBAT_PRIORITY_THREAT_AVOIDING_ESCORT_AND_SEQUENTIAL_ACTION_VERTICAL_SLICE` preserve save format 4 and close the tactical AI utilization and strategic recovery-ownership gaps.

Root causes addressed:

- AI rescue scheduling could repeatedly consume one soldier's turn while other viable soldiers remained idle, and local contacts were not consistently promoted to squad-wide combat priorities.
- Escort path scoring favored short extraction routes without measuring how many known alien weapon envelopes the civilians would cross.
- Multiple state snapshots could become visible together during AI playback, making soldiers and aliens appear to move simultaneously.
- Classic Lineup shot lines inferred rows from shot order instead of carrying the firing and target unit identities.
- Successful mission recovery preferred the last launch/ferry base, which could misroute bodies and alien items away from the responding squad's home base.
- The minimized header had no base switch, and recruitment allowed a no-Skyranger base without an explicit player acknowledgement.

Implemented roadmap scope:

- Each viable AI soldier receives bounded work every turn: active escorts continue evacuation, non-escorts answer squad-observed contacts, and remaining soldiers search unexplored space or take a deterministic patrol step.
- Contact response remains combat-first unless a soldier already leads civilians. Stalled routes use bounded history resets and fallback cells instead of two-cell oscillation.
- Threat-aware rescue routing scores exposure steps, entries into danger, and total known firing-range exposure before route length. Searches cap at 192 unique cells and 768 processed states in both clients.
- AI output frames are split by visible actor. Visible soldiers and aliens move one at a time; alien state outside current observation remains suppressed and cannot pull the camera.
- Browser simulation shots carry `fromId` and `toId`; Classic Lineup resolves exact source/target endpoints from those identities.
- Both minimized command headers include the selected-base dropdown.
- Browser recruitment checks for a Skyranger assigned to the selected base and requires `window.confirm` before ordering a soldier without one.
- Successful recovery resolves the responding squad's stationing base first, then legacy soldier/original/launch fallbacks for save compatibility.
- Browser Build Health gains five rows; native Build Health gains three paired tactical rows. Multi-base recruitment/recovery remains an explicit native exception because the Godot vertical slice is still single-base.

Verification checklist:

- Static browser app-script parsing passed.
- `node tools\check-aegis-build.cjs` passed with paired 0146/0016 labels, bounded tactical seams, and the strategic continuity contract.
- Localhost start screen and Geoscape smoke passed with the 0146 label.
- The minimized header exposed both Command Section and Base selectors.
- Browser Build Health passed `298/298` on a cache-busted load.
- A practical six-soldier 64x64 safe-2D mission launched; selecting Hana exposed 151 reachable cells and movement reduced TU from 54 to 22.
- Three End Turn cycles returned to the human phase in approximately 2.7, 4.0, and 2.9 seconds.
- Browser diagnostics contained no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Native tests passed `111/111`; native Build Health passed `85/85`.
- Godot 4.7.1 headless editor parsing exited successfully; Windows reported only the environment certificate-store warning and the expected scan-aborted message after the bounded quit.

Remaining risks and manual validation:

- Load the originally affected mandatory-rescue campaign without overwriting it. Give AI command for several turns and confirm every viable soldier acts, escorts progress, combat contacts rally non-escorts, and no unit oscillates indefinitely.
- Observe a large visible firefight and confirm soldiers and aliens animate one actor at a time while unobserved alien movement remains hidden.
- Confirm threat-aware civilian routes visibly avoid known alien firing lanes when a safe route exists and minimize exposure when none does.
- At a second browser base with no assigned Skyranger, recruit a soldier and confirm cancel creates no order while approval creates exactly one local order.
- Complete a ferry-staged browser mission and confirm alien bodies, alien items, and recovered squad equipment arrive at the squad's stationing base, not the staging base.
- Inspect Classic Lineup playback and confirm every tracer joins the correct shooter and target through movement and casualties.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.31.0145 - Direct-File Recorded Voice Playback Fallback

Browser build `v0.26.07.31.0145_DIRECT_FILE_RECORDED_VOICE_PLAYBACK_FALLBACK_INDEX_ONLY_PATCH` preserves save format 4 and native build 0015. It fixes recorded voices for players who open `index.html` directly without changing tactical outcomes or hosted audio behavior.

Root cause addressed:

- Music and synthesized SFX can play from a direct page, but browser security blocks the `fetch()` call used to load local recorded WAV files from a `file://` document.

Implemented roadmap scope:

- Direct-file launches use a native `Audio` element with bounded media-fragment take timing instead of fetching and decoding the WAV.
- The fallback stays inside the existing ordered dialogue queue and honors the independent Voices toggle, a perceptual volume curve, segmented take endings, active-media cleanup, and music ducking.
- The initial Test Voices media start remains inside the button gesture. Localhost and hosted pages continue to use the existing per-take normalization, computer/radio processing, limiter, and static bookends.
- Browser Build Health and the seam checker cover protocol selection, fallback volume bounds, active-player ownership, and the retained HTTP path.

Verification checklist:

- Static app-script parsing passed all `8/8` inline and external script assets.
- `node tools\\check-aegis-build.cjs` passed with the browser 0145/native 0015 labels and real Test Voices PCM energy checks.
- Localhost start-screen and Geoscape smoke passed with the new 0145 label.
- Browser Build Health passed `293/293`, including `Direct-file recorded voice fallback avoids blocked local fetches`.
- The localhost computer, aircraft, and soldier Test Voices sequence completed with status `passed` while music was active.
- A practical six-soldier 64x64 safe-2D incident launched, soldier selection exposed current TU and movement controls, and three End Turn cycles returned to the human phase.
- No browser runtime error overlay appeared during voice, Geoscape, Build Health, launch, or tactical testing.
- Godot 4.7.1 strict editor parsing passed; the unchanged native 0015 suite passed `108/108`, with Build Health remaining `82/82`.

Manual validation still required:

- Open `index.html` directly, open Audio Settings, leave Voices enabled at 100%, and press `Test Voices`.
- Confirm computer, aircraft, and soldier clips play in order, music dips and returns, and lowering or muting Voices affects speech without affecting SFX.

---

# v0.26.07.31.0144 / GODOT.0015 - Voice Audibility Normalization and Music Ducking

Browser build `v0.26.07.31.0144_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_PARITY_PATCH` and native build `v0.26.07.31.GODOT.0015_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_VERTICAL_SLICE` preserve save format 4 and repair the inaudible Test Voices mix without changing gameplay state or tactical outcomes.

Root causes addressed:

- The recorded takes are valid but average roughly -21 to -28 dBFS, leaving speech masked by the full-level music bed even with the voice slider raised.
- Computer and aircraft clips relied entirely on category processing, with no clean reinforcement path to preserve consonants and speech intelligibility.
- The old Test Voices result proved only that sources were scheduled and ended; it did not reject silent or near-silent take data.

Implemented roadmap scope:

- Browser playback samples at most 12,000 values from the selected take, caches its RMS/peak result, rejects takes below a conservative audibility floor, and applies bounded makeup gain limited by both target RMS and a 0.9 peak ceiling.
- Processed computer and aircraft voices keep their existing 1980s computer/radio character while adding a low-level clean intelligibility path. A dedicated compressor-limiter controls the combined voice peak.
- Active dialogue ducks streamed and synthesized music to 16% of its selected level, then restores it smoothly after the final queued clip. SFX volume and tactical behavior are unchanged.
- Godot voices receive matching +6 dB bounded player makeup and duck the Music player by 16 dB for the duration of the queued voice sequence.
- Browser Build Health adds actual bounded normalization and intelligibility/ducking rows. Native Build Health adds the paired makeup/ducking row. The seam checker reads the real PCM data for all three Test Voices categories and rejects any test take below the same audibility floor.

Verification checklist:

- Static browser parsing passed all `8/8` script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0144/0015 labels and real WAV energy checks.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`; native Build Health passed `82/82`.
- Browser Build Health passed `292/292`.
- Localhost start screen and Geoscape smoke passed with the new 0144 label.
- The computer, aircraft, and soldier test WAV URLs each returned HTTP 200 and the sequential browser Test Voices command completed while music was active.
- A practical six-soldier 64x64 safe-2D incident launched, selected-soldier movement highlighting produced 150 cells, and three End Turn cycles returned to the human phase.
- No browser runtime error overlay appeared during the voice, Geoscape, Build Health, launch, or tactical tests.

Manual validation still required:

- Set Voices to 100%, leave music playing, press `Test Voices`, and confirm all three categories are clearly audible while music dips and then returns.
- Repeat at 50% and confirm volume changes without muting SFX or music.
- Trigger a UFO/base announcement, a Skyranger aircraft call, and several tactical soldier lines naturally; confirm they remain ordered and intelligible.
- Toggle Voices off and confirm recorded speech stops while Test SFX and music remain audible, then reload and verify the preference persists.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.29.0143 / GODOT.0014 - Dedicated Voice Bus, Controls, and Playback Recovery

Browser build `v0.26.07.29.0143_DEDICATED_VOICE_BUS_CONTROLS_AND_PLAYBACK_RECOVERY_PARITY_PATCH` and native build `v0.26.07.29.GODOT.0014_DEDICATED_VOICE_BUS_CONTROLS_AND_PLAYBACK_RECOVERY_VERTICAL_SLICE` preserve save format 4 and repair the shared recorded-dialogue path without changing tactical outcomes.

Root causes addressed:

- Browser dialogue was connected to the low-gain SFX node, so voice level could not be raised independently from clicks and weapon sounds.
- Audio-context resume was issued without waiting for the browser to accept it. A queued strategic or tactical announcement could therefore reach playback while the context was still suspended.
- There was no explicit voice mute, voice level, or direct playback test, making a failure across all three voice categories difficult to distinguish from a quiet SFX mix.
- Native dialogue also reused its SFX player even though a `Voices` bus already existed in the project layout.

Implemented roadmap scope:

- Browser dialogue now routes through a dedicated `voiceGain` node connected directly to the destination. SFX remains on its existing bounded gain.
- Any pointer or keyboard interaction attempts to unlock the browser audio context; recorded playback explicitly awaits resume and declines cleanly if the context remains suspended.
- Audio Settings now includes a Voices checkbox, independent 0-100 volume slider, and `Test Voices` command. Enabled state and volume persist in local browser storage without changing campaign saves.
- `Test Voices` plays a base-computer clip, an aircraft-radio clip, and a soldier clip sequentially through their existing category-specific processing and reports a pass only when all three complete.
- Godot now uses a dedicated `VoicePlayer` on a `Voices` bus routed to `Master`, persistent voice mute/volume configuration, and matching Audio Settings/Test Voices controls.
- Browser Build Health gains three dedicated voice-control rows. Native Build Health gains a matching bus/control row, and the seam checker continues to validate all 105 WAV recordings and at least 300 segmented takes.

Verification checklist:

- Static browser parsing passed `8/8` executable script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0143/0014 labels and dedicated voice seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`.
- Native Build Health passed `81/81`.
- Browser Build Health passed `290/290`.
- Localhost smoke passed through the updated start screen, first-base confirmation, and Geoscape.
- Browser `Test Voices` transitioned from `playing` to `passed` after sequential computer, aircraft, and soldier playback.
- Voice mute disabled the test command and re-enabling voices restored it.
- Current browser diagnostics contain no runtime errors. The only warning is the existing Tailwind development-CDN advisory.

Manual validation still required:

- Use `Test Voices` at several voice levels and confirm the base-computer, aircraft-radio, and soldier clips are all clearly audible and appropriately processed.
- Turn Voices off, trigger base, aircraft, and combat events, and confirm all recorded speech remains muted while SFX still plays.
- Re-enable Voices, reload the page, and confirm enabled state and volume persist.
- Trigger a UFO detection, Skyranger launch/return, and tactical movement/fire sequence naturally; confirm clips remain ordered and do not overlap.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0142 / GODOT.0013 - AI Command Reclaim, Rescue Paths, and Voice Recovery

Browser build `v0.26.07.28.0142_TACTICAL_AI_COMMAND_RECLAIM_RESCUE_PATH_AND_VOICE_RECOVERY_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0013_TACTICAL_AI_RECLAIM_RESCUE_PATH_AND_VOICE_RECOVERY_VERTICAL_SLICE` preserve save format 4 and repair AI-controlled tactical continuity in both clients.

Root causes addressed:

- Browser AI command generated a bounded continuation from the live battle but exposed no way to stop playback and resume direct control.
- Rescue movement repeatedly chose one locally attractive step. Equal-scoring cells could make one escort oscillate while the rest of the squad was starved of work.
- A shortest route to the craft interior could approach beside the ramp, leaving a correctly following civilian one cell away from extraction.
- Browser soldier cues could begin outside the handoff click and be suppressed by soldier cooldown behavior. Native voice requests replaced the current stream instead of waiting their turn.

Implemented roadmap scope:

- `Take Back Control` cancels pending AI playback timers and restores direct human command at the currently displayed frame. Positions, HP, TU, ammunition, civilians, cover damage, breaches, fog, and round state are retained.
- Native AI command exposes the same reversible control and stops between bounded soldier actions before returning a living soldier selection and reachable cells.
- Human AI scheduling is deterministic and round-robin, so later soldiers receive rescue/exploration opportunities instead of one soldier monopolizing every turn.
- Rescue targets use one bounded reachable-cell flood per soldier. A short visited-cell history penalizes reversals, while two stalled escort turns release civilians for squad reassignment.
- Escort extraction composes the bounded approach path with the ordered ramp centerline and one clear interior egress cell, ensuring single-file followers cross an extraction hex.
- Combat movement in both clients remembers a bounded recent-cell history and penalizes immediate reversals without changing deterministic attack, LOS, cover, or TU rules.
- Browser handoff audio is unlocked by the player click and AI soldier cues explicitly join the tactical queue. Godot queues voice files sequentially and emits movement, contact, shot, hit, miss, kill, handoff, and reclaim cues.
- Browser and native Build Health each gain reclaim, rescue anti-loop, and tactical voice rows. Native automation directly verifies multi-soldier rescue work, unique-cell routing, and state-preserving reclaim.

Verification checklist:

- Static browser parsing passed `8/8` executable script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0142/0013 labels and all new recovery seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`, including three practical End Turn cycles.
- Native Build Health passed `80/80`.
- Browser Build Health passed `287/287`.
- Localhost smoke passed through start screen, first-base confirmation, Geoscape, six-soldier squad assignment, launch confirmation, Skyranger travel, and a live 64x64 safe-2D incident.
- AI command inherited the live incident and exposed `Take Back Control`; reclaim at frame `2/17` restored a human turn and reported that positions, damage, ammunition, TU, civilians, and breached cover were retained.
- The reclaimed live battle completed three subsequent End Turn cycles and returned to the human phase each time.
- Current browser diagnostics contain no runtime errors. The only warning is the existing Tailwind development-CDN advisory.
- All seven native tactical cue files referenced by this patch exist in the dialogue asset directory.

Manual validation still required:

- Reproduce the originally affected mandatory-rescue battle, reveal civilians, hand command to AI, and confirm several soldiers act while escorts reach the ramp without two-cell oscillation.
- Use `Take Back Control` during movement, after a shot, after a casualty, and during the mandatory secure-rescue phase; verify every visible tactical value remains at the displayed frame.
- Listen with Voices enabled in both clients and confirm handoff, movement, contact, firing, miss, kill, and reclaim phrases play sequentially at a useful volume.
- Run an escort with two to four civilians and confirm the whole column follows the same path and extracts through the ramp centerline.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0141 / GODOT.0012 - Classic Hand Slots, Targeting, and Grenades

Browser build `v0.26.07.28.0141_TACTICAL_CLASSIC_HAND_SLOTS_TARGETING_AND_GRENADE_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0012_TACTICAL_HAND_SLOTS_TARGETING_AND_GRENADE_VERTICAL_SLICE` preserve save format 4 and advance the classic battlescape command surface in both clients.

Root causes addressed:

- Tactical inventory reported a right-hand weapon but did not expose functional hand selection or a left-hand field item.
- Clicking an alien, structure, or movement cell shared one implicit action path, leaving no persistent targeting state or readable cancellation step.
- The command console listed throwable preparation as a future exception because no bounded grenade gameplay contract existed.

Implemented roadmap scope:

- Each deployed soldier receives one mission-local Frag Grenade in the left hand; the equipped weapon remains in the right hand. Campaign saves and strategic stores are unchanged.
- Right-hand selection enters weapon targeting. Left-hand selection reports preparation state; priming costs 4 TU and enters grenade targeting. Cancel Target restores movement.
- Grenade throws cost 12 TU, have a six-hex range, consume the one charge, and return the active hand and mode to normal movement.
- The deterministic blast examines at most seven cells: 28 base damage at the center and 16 on neighboring cells, with small armor reduction and deterministic variance.
- Blast damage affects aliens, soldiers, and civilians. Alien kills are credited to the thrower, while civilian danger is reported honestly.
- Center and edge breach damage reuse structural destruction rules. Destroyed walls remain visible rubble with no hard blocker, so soldiers, aliens, and civilians can traverse the opening.
- Browser 2D cells and Three.js canvas use explicit fire/grenade cursors; the native board shows ranged target outlines and a line to the hovered target.
- Browser Build Health gains three hand/preparation/blast rows. Native Build Health gains the matching three rows, and the native automated suite gains three direct tactical checks.

Verification checklist:

- Static parsing passed for all six inline browser scripts.
- `node tools\check-aegis-build.cjs` passed with paired 0141/0012 labels and hand/grenade parity seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `105/105`, including three practical End Turn cycles.
- Native Build Health passed `77/77`.
- Browser Build Health passed `284/284`.
- Localhost browser smoke passed through start screen, first-base confirmation, Geoscape, mission selection, Skyranger flight, and safe-2D tactical launch.
- In a live browser battle Caleb primed at `59 -> 55 TU`, threw at `55 -> 43 TU`, consumed `Frag x1 -> x0`, applied a seven-cell blast, and returned to movement mode.
- The same live battle completed three additional End Turn cycles and returned to the human phase each time.
- Current-load browser diagnostics contain only the existing Tailwind CDN development warning; no current patch runtime error was recorded.

Manual validation still required:

- Throw grenades near mixed aliens, soldiers, and civilians to judge center/edge damage, friendly-fire clarity, and whether the 4 TU plus 12 TU cost feels fair.
- Destroy exterior walls and partitions with grenades, then path a soldier, alien, escorted civilian, and panicked civilian through the resulting rubble.
- Compare fire and grenade targeting in 2D Hex and Three.js Iso at normal display resolution, including cancellation and out-of-range feedback.
- Prime a grenade, end the turn, and confirm preserving preparation into the next human turn is understandable.
- Exercise the Godot hand buttons and grenade cursor at the player's normal window size to check console spacing and target-line readability.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0140 / GODOT.0011 - Tactical AI Doctrine, Reaction Fog, and Classic Command Console

Browser build `v0.26.07.28.0140_TACTICAL_AI_DOCTRINE_REACTION_FOG_AND_CLASSIC_COMMAND_CONSOLE_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0011_TACTICAL_AI_DOCTRINE_AND_REACTION_FIRE_VERTICAL_SLICE` preserve save format 4 and advance the browser game and Godot vertical slice together.

Root causes addressed:

- AI movement previously favored direct pursuit and rescue routing without a shared commander-centered formation or cover/flank score.
- The Godot commander comparator selected the lowest-scoring candidate; it now selects the highest rank/mission/bravery/Reaction score with deterministic ID tie-breaking.
- Manual browser alien turns retained an older beeline branch and could target civilians while living soldiers remained.
- AI takeover could expose frame information beyond the squad's current observation even when direct player control used fog of war.
- Tactical action controls were distributed through the side panel and did not provide a compact classic battlescape command surface.

Implemented roadmap scope:

- Commanders learn Protected Wedge, Assault Line, Echelon Flank, Support and Maneuver, and Diamond Security doctrine from rank plus completed-mission thresholds.
- AI assigns commander, left/right flank, base-of-fire, and security roles; non-commanders remain within a bounded command radius while the formation fans toward known threats.
- One bounded reachable-cell flood supplies each move decision. Scoring considers cover, LOS, weapon range, flank side, commander distance, role, and forward progress without restoring per-cell pathfinding or full-map repeated scans.
- Exploring soldiers preserve enough TU for their selected fire mode. Civilian escorts preserve the same reaction reserve while advancing toward the ramp.
- Reaction fire checks each observed alien movement step against the soldier's Reaction stat, range, LOS, TU, current fire mode, and ammunition. Each soldier can interrupt a given alien phase only once.
- Alien AI targets living humans first, seeks cover and lateral pressure, preserves attack TU, and fires after movement when it gains a valid solution.
- AI command inherits the live battlefield and current round. Unobserved alien movement and shots remain hidden; map contacts and playback camera anchors use current observation rather than historical reveal.
- Both clients expose a first functional classic battlescape console: previous/next soldier, tactical map, field inventory, kneel/stand, no/snap/aimed/auto/kneel TU reserves, Done/TU bleed, End Turn, AI Command, and confirmed Dust Off.
- Remaining original-game command depth is recorded honestly: hand-slot transfers, throwable preparation, dedicated targeting cursors, and elevation controls are not represented until matching gameplay systems exist.

Verification checklist:

- Static parsing passed for all six inline browser scripts.
- `node tools\check-aegis-build.cjs` passed with paired build labels and required AI/UI seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `102/102`, including three practical End Turn cycles.
- Native visible Build Health passed `74/74`.
- Browser Build Health passed `281/281`.
- Localhost smoke passed through start screen, first-base setup, Geoscape, six-soldier squad assignment, launch confirmation, Skyranger travel, and a live 64x64 safe-2D incident.
- Snap reserve and Field Inventory were exercised on a selected soldier.
- AI command inherited round 1, played fifteen frames across seven combat exchanges, and reached tactical victory.
- Browser console errors were clear. The only warning was Tailwind's existing development-CDN advisory.

Remaining risks and manual validation:

- Observe a veteran-led squad and confirm advanced doctrine produces readable flanks without excessive bunching or separation from the commander.
- Verify Snap, Aimed, Burst/Auto combinations reserve the expected TU after movement, reload, and fire-mode changes.
- Watch aliens cross multiple visible hexes and confirm valid Reaction-stat shots consume TU/ammo once; repeat with movement completely outside squad observation and confirm no alien model, movement, shot, or camera jump appears.
- Run a mandatory civilian rescue under AI command. Confirm the escort keeps a reaction reserve, civilians remain single-file, and rescue takes priority after civilians are spotted.
- Confirm aliens seek cover and attack soldiers rather than diverting to civilians while any soldier survives.
- At the player's normal resolution, inspect Map, Inventory, stance, reserves, Done, End Turn, AI Command, and Dust Off in both browser and Godot clients for clipping or ambiguity.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_HAND_SLOTS_TARGETING_AND_THROWABLE_PREP_PARITY_PATCH`, adding bounded functional hand-slot transfers, targeting cursors, and throwable preparation before deeper elevation controls.

---

# 1. Project Identity

## Working Title
Alien Response Command

## Project Codename
Project Aegis

## Genre
Single-player strategy / base-management / tactical alien-defense game inspired by classic X-COM-style structure, built as a single-file HTML game.

## Current Platform / Build Format
- Primary format: single-file HTML game.
- Deployment target: GitHub Pages and local browser play.
- Patch distribution: zipped build folder containing `index.html` at the root of the folder.
- Preferred patch type: `INDEX_ONLY` unless assets are required.
- Future possibility: paid alpha on itch.io.
- The browser campaign remains the complete reference game and the Godot 4 build remains a vertical slice, but new player-facing gameplay rules now ship as paired browser/Godot patches unless a temporary exception is explicitly recorded.

## Player Fantasy
The player commands a fledgling global defense organization responding to escalating alien activity. They recruit soldiers, manage a base, research alien threats, shoot down UFOs, deploy squads, endure casualties, and build emotional attachment to soldiers whose personalities, stress, friendships, injuries, commendations, and deaths shape the campaign.

## Tone
- Military sci-fi
- Tactical command
- Human cost of war
- Slightly pulpy alien-invasion drama
- Soldiers should become memorable individuals, not disposable units.

## Core Pillars
1. **Strategic command pressure** — Balance funding, panic, radar coverage, aircraft readiness, personnel, research, and soldier health.
2. **Soldier attachment** — Soldiers should feel like people with histories, stress, relationships, accomplishments, and memorial consequences.
3. **Tactical readability** — Tactical missions must be readable, paced, and emotionally legible, even in a lightweight browser implementation.
4. **Campaign escalation** — Alien activity should grow over time and eventually point toward alien command-site discovery and a final mission.
5. **Fast patchability** — The game should remain easy to patch, test, package, and deploy through single-file HTML builds.

---

# 2. Current Build State

## Latest Known Build
`v0.26.08.03.2032_TACTICAL_VIP_HUNT_PANIC_AND_REINFORCEMENT_SEARCH_INDEX_ONLY_PATCH`

## Native Vertical Slice Build
`v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE`

## What This Patch Was Intended To Add
This paired tactical/strategic patch adds:
- Full-squad bounded AI tasking with squad-contact combat priority and retained civilian escort duty.
- Threat-aware civilian extraction routes and sequential visible-actor playback without exposing hidden aliens.
- Exact shooter-to-target Classic Lineup tracers.
- Compact-header base selection, explicit no-Skyranger recruitment confirmation, and squad-home mission recovery ownership in the browser campaign.
- Five browser Build Health rows and three paired native rows without changing save format 4.

The current release line also preserves this cumulative implemented scope:
- A save-compatible hangar-occupancy correction so Outbound and Returning aircraft no longer occupy the physical hangar they already departed.
- Preserved destination/home reservations, keeping real hangar capacity and staged-route overbooking protections intact.
- A supplied-save regression covering Fort Aegis to S. America staging and the final S. America incident round trip.
- An explicit browser-only parity exception for multi-base ferry routing until that system exists in the Godot vertical slice.
- Base-local browser Medkit issue, return, and display using the existing inventory ownership model.
- One-charge browser tactical self-treatment matching the native 12-HP and 12-TU rule.
- Final tactical HP and remaining Medkit charge propagation into browser mission resolution.
- One-to-five-day browser wound recovery derived from final missing HP, with unused KIA Medkit recovery on victory and loss on defeat.
- An explicit paired browser/Godot gameplay contract in the manifest and checker so future player-facing rules cannot silently diverge.
- Continuous Three.js building walls joined along the true offset-hex neighbor vectors instead of isolated per-cell posts.
- Solid corner cores with deliberate openings at doors and destroyed wall cells.
- Explicit all-unit breach traversal coverage for player movement, alien pathing, and panicked civilians.
- AI-controlled continuation through achievable mandatory civilian rescue phases after alien elimination.
- A bounded area-secure sweep for unrevealed survivors, distinct-rescuer assignment, deepest-ramp routing, and rescued/required playback labels.
- Shared manual/AI rescue completion rules without falsely killing a surviving squad when the AI extraction budget expires.
- Screen-neutral strategic UFO speed prompts so choosing a speed cannot replace Base, Soldiers, Research, Workshop, Missions, or a live incident battlefield with the Geoscape.
- Deferred post-battle Geoscape speed application while manual tactical combat keeps the strategic clock paused.
- A bounded area-secure rescue phase when a mandatory civilian requirement is incomplete but still achievable after the last alien falls.
- Clear remaining-rescue, completed, optional, and impossible objective feedback without changing tactical outcomes before area security.
- Build Health and checker coverage for tactical alert ownership, deferred speed, and civilian rescue-phase completion rules.
- A shared per-cell tactical visual descriptor used by both 2D CSS cells and Three.js terrain palette batches.
- Shared 0.755 row-step and half-cell odd-row-offset constants matching the actual 2D board layout.
- Exact base/accent canvas gradients on bounded Three.js instanced palette batches instead of midpoint-only solid colors.
- A custom flat Three.js hex footprint matching the 2D clip polygon, plus one bounded seam-underlay batch for raster junctions.
- Build Health and checker coverage for Urban gradient diversity, shared cell centers/footprints, and seam closure.
- Per-cell Three.js terrain colors sourced from the same `tacticalTerrainForCell` base/accent pairs as the 2D map.
- Bounded explicit-material palette batches that avoid the failing per-instance tint path while keeping thousands of ground cells instanced.
- Pointy-top Three.js hex geometry aligned to the existing odd-row tactical coordinate spacing, removing the repeating triangular holes between tiles.
- Build Health and checker coverage for 2D/3D palette parity, bounded batching, and gapless geometry math.
- Stronger base-computer processing with coarser stepped-wave quantization, deeper square-wave modulation, compression, and a bounded 22 ms metallic parallel delay.
- Generated band-limited static before and after soldier recordings without changing the supplied WAV assets or moving voices off the shared Sound Effects volume control.
- A soldier playback-tail promise that includes decode time, clip duration, and trailing static, and which strategic computer/aircraft FIFO work must await before starting.
- Explicit Wilderness, Farmland, Small Town, and Urban District ground colors on the existing single Three.js instanced ground mesh, bypassing the browser path that rendered per-instance floor colors black.
- Build Health and checker coverage for robotic computer processing, soldier static, the tactical-to-strategic audio gate, and visible biome ground materials.
- One context-aware recorded soldier callout per AI tactical playback frame, covering movement, fire, misses, kills, wounds, and the final alien defeat in both map and classic playback.
- Personality-aware AI chatter using each frame soldier's preserved campaign identity and the existing soldier-category cooldown, avoiding a delayed tactical speech backlog.
- A shared FIFO for all non-soldier recorded announcements so base-computer and aircraft clips cannot overlap or overtake one another.
- Clip-end waiting with a short inter-announcement gap; existing intentional delays remain relative to each queued phrase.
- Build Health and checker coverage for AI frame cue selection, soldier identity propagation, strategic queue routing, and tactical/strategic queue separation.
- Action-aware tactical AI watch-camera anchors for squad movement, civilian rescue, casualties, alien movement, shot midpoints, and quiet-frame squad fallback.
- Per-frame camera updates during AI tactical-map takeover without rebuilding or resetting the inherited battlefield.
- A high-pass/low-pass, stepped-wave, compressed, lightly modulated base-computer voice chain for recorded `computer` dialogue.
- A tighter-band, stronger-modulation aircraft-radio chain for recorded `aircraft` dialogue, while soldier and other voice categories remain clean.
- Shared Sound Effects volume/mute ownership for all recorded voice categories, preserving the existing audio controls.
- Build Health and seam-checker coverage for action camera selection and category-specific recorded-dialogue processing.
- A generated recorded-dialogue manifest covering all 105 supplied WAV files, 87 event keys, four soldier delivery styles, and 326 silence-separated takes without modifying the source recordings.
- Lazy per-file fetch/decode caching, take-repeat avoidance, category cooldowns, and synthesized SFX fallback so recordings do not add tactical map or turn-processing work.
- Command alerts for save/load, research/manufacturing/construction/transfer completion, personnel, incidents, UFO contact, mission outcomes, funding/aircraft blockers, council reports, and command attention.
- Aircraft announcements for Skyranger launch, touchdown, ramp deployment, return, landing, and interceptor launch.
- Personality-matched soldier selection, movement, reload, combat-result, injury, End Turn, and victory callouts with steady-professional fallback for phrases not recorded in every style.
- Build Health and checker coverage for recording count, take bounds, required events, source-file existence, personality variants, semantic mapping, and runtime seams.
- A lighting-free tactical visibility context with fixed 20-hex vision and indexed cover lookups, removing local-light generation and per-cell illumination work from LOS and rendering.
- A bounded human-visibility pass that visits only cells within observer vision range, deduplicates overlap, and exposes constant-time visible-cell membership to both tactical renderers.
- A single breadth-first reachable-cell flood fill for soldier selection instead of running a separate path search for every candidate destination.
- Removal of redundant 64x64 visibility scans during reveal/exploration and cover-reveal updates.
- Build Health coverage for a deterministic Port Attack visibility/reachability workload and the new indexed tactical seams.
- A single colorized `THREE.InstancedMesh` for tactical ground instead of one mesh per visible hex, while preserving instance-aware cell picking.
- Exact pointy-hex center spacing plus a tiny overlap so neighboring ground hexes meet edge to edge without blue seams.
- A reliable 2D tactical default for new campaigns; players opt into Three.js with the explicit `3D Iso` control.
- A Three.js context-loss/missing-instancing recovery path that returns to the playable 2D battlefield instead of leaving a stalled mission.
- Persistent Auto, Performance, and Quality controls on the main menu so lower-powered PCs can arm Performance mode before launching a mission.
- Build Health coverage for instanced-ground budgets, instance picking, gapless hex spacing, main-menu preference wiring, and 2D recovery.
- Persistent Auto, Performance, and Quality controls beside the Three.js tactical view selector.
- Conservative Auto hardware detection that selects Performance on lower/unknown memory-core profiles and balanced settings only on stronger profiles.
- Performance mode: 1x pixel ratio, antialiasing off, shadows off, Lambert materials, 32x32 maximum 3D overview, lower-detail rings, and no redundant fog meshes.
- Auto Balanced mode: 1.2x pixel ratio, shadows off, and a 40x40 maximum overview.
- Quality mode retains higher pixel density, shadows, standard materials, fog meshes, and the full 64x64 overview for players who explicitly choose it.
- Normal-cell ring removal so only edge, reachable, and selected cells create ring geometry.
- Tactical building, street-lamp, vehicle, and interior light simulation is parked; these remain terrain and visual props without affecting LOS or creating static point lights.
- On-demand idle rendering; continuous animation frames now run only for the victory dance.
- Build Health performance budgets covering mode resolution, view caps, light caps, shadow/fog/ring budgets, idle frames, picking, and UI wiring.
- Taller overlapping cutaway wall runs and internal room partitions so tactical structures read as enclosed buildings rather than isolated wall segments.
- Denser, purpose-specific interiors: records desks/files, market shelves, workshop tools/workbenches, diner counters/tables, residential beds/sofas, fire-station lockers, farmhouse kitchens, barn hay/racks, and outpost radios.
- Deterministic sedans, vans, utility vehicles, headlights, and roadside lamp posts on city, small-town, and farm routes.
- Incident arrival-clock stamping plus solar phase calculation from Geoscape month/day/minute and incident latitude/longitude.
- Day, twilight, and night ambient/fog/directional lighting in Three.js and matching brightness/saturation treatment in 2D Hex.
- Night/twilight visibility ranges that improve inside illuminated interiors and near lamps or vehicle headlights.
- Build Health coverage for enclosure partitions, furnishing diversity, vehicles, lamps, solar phase, local-light vision, render support, and mission clock normalization.
- Deterministic tactical building districts inspired by the readable, roofless battlefield architecture of early alien-defense strategy games while using original Project Aegis layouts and names.
- Urban Municipal Records Offices, Corner Markets, and Vehicle Workshops; small-town Diners, Residences, and Fire Stations; Farmhouses and Equipment Barns; and wilderness Ranger Outposts.
- Shared building plans for 2D Hex and Three.js, including passable door gaps, hard walls, partial-cover windows, interior floors, counters, tables, shelves, and storage racks.
- Building walls participate in existing hit points, shot absorption, pathfinding, fog of war, and line-of-sight rules instead of being decorative scenery.
- Roofless Three.js cutaway walls and glass plus distinct 2D wall/window/furnishing artwork.
- Tactical status and event-log summaries that name the generated structures without revealing hidden occupants.
- Build Health coverage for biome variety, doors, walls, windows, furnishings, interior terrain, both render paths, and safe unit deployment.
- A persistent Globe / Terminator Map segmented control on the Geoscape and first-base site view.
- A full-world flat map using the existing detailed landmass geometry and current Project Aegis map colors.
- A smooth day/night mask calculated from the authoritative Geoscape month, day, and minute state; the subsolar point and terminator move whenever simulation time advances.
- The same bases, incidents, detected UFOs, alien bases, aircraft, range rings, ferry links, and placement crosshair on the flat operational map.
- A serial aircraft relocation queue foundation that reserves destination hangars immediately and keeps queued aircraft unavailable until their clock-tracked route begins.
- Compact active/queued relocation summaries naming craft, destination, route, ETA, and reservation state.
- A classic-lineup victory-animation correction so only paper dolls dance while their information cards remain stable.
- Build Health rows for relocation queue reservations, classic paper-doll-only dancing, and the clock-synchronized terminator map.
- Staged Skyranger and interceptor markers now show compact current phase labels on the Geoscape globe, such as ferry, refuel, attack, and return phases.
- The Geoscape globe now includes a small Solar readout in the globe header so the player can tell whether the visible terminator is daylight, night side, dawn, or dusk.
- Day/night lighting is more readable through stronger terminator placement, a brighter sun glow, more visible twilight line, and synchronized Three.js ambient/back-light intensity.
- Build Health now includes `Staged aircraft route labels and day-night globe lighting are readable`.
- New-base placement ferry previews now render Interceptor and Skyranger ferry eligibility as separated side-by-side dotted lanes with distinct colors when both craft types can connect the proposed base to an existing base.
- Build Health now includes `New-base placement previews separated Interceptor and Skyranger ferry lanes`.
- Skyranger mission confirmation now surfaces staged ferry/refuel incident routes instead of only showing the final staging-base round trip.
- Staged Skyranger loadout checks use the home/origin base where the squad boards, not the forward staging base where the transport refuels.
- Build Health now includes `Skyranger ferry staging extends incident response range`, covering a mission that is out of direct Skyranger round-trip range but reachable through an open-hangar staging base.
- Phase-aware travel display for staged aircraft routes so craft visibly depart their home base, fly ferry/refuel legs, then depart the staging base for the UFO or incident.
- Skyranger mission launch can now select a same-base squad/Skyranger pairing that stages through an owned base with an open hangar when direct mission range is not enough.
- Staged Skyranger travel stores the final mission return base so the return leg goes back to the forward staging base instead of pretending the transport started there.
- The ChatGPT-applied staged-interceptor execution pass is now recorded: interceptor staged routes can execute ferry/refuel/attack/return phases and prompt after a surviving UFO whether to attack again or ferry back home.
- Build Health now includes `Staged aircraft routes display origin ferry legs`.

- UFO Tracking now checks the ferry/refuel staging planner when no interceptor has a direct home-base round trip to a detected UFO.
- Detected UFOs reachable through a staging base now report `staged route available`, naming the interceptor, staging base, one-way ferry leg, and final refueled intercept round trip.
- Interceptor launch blockers now distinguish a recognized staged route from a true range/fuel failure, while leaving full staged launch execution as the next bounded patch.
- Build Health now includes `Interceptor UFO tracking recognizes ferry-staged reach`.

- New-base placement now draws dotted ferry-link lines from the proposed site to existing bases when at least one currently accessible aircraft type can fly the one-way base-to-base leg.
- Ferry-link preview text names each connected base, approximate one-way distance, and the aircraft types that can make the trip.
- The link preview uses current aircraft access and fuel-tank upgrade range profiles, while keeping the existing aircraft reach rings intact.
- Build Health now includes `New-base placement previews dotted aircraft ferry links`.
- Aircraft ferry/refuel staging planning helpers that evaluate owned bases as intermediate refuel stops.
- Ferry legs are checked as one-way base-to-base flights so aircraft can use their full practical range to reach a staging base.
- Final incident/intercept legs from the staging base still require enough refueled range/fuel for the round trip back to that last staging base.
- Staging requires an owned base with an open hangar slot.
- UFO Tracking now includes a compact Ferry / Refuel Staging readout for selected incidents and detected UFOs.
- Build Health now includes `Aircraft ferry staging checks open hangars and refuel legs`.
- Mission launch confirmation now previews the selected Skyranger, launch base, round-trip distance, fuel commitment, and response-force soldier loadout before the player confirms.
- The confirmation modal now reports local launch-base weapons/armor stock, issued gear, in-transit gear, unarmed soldiers, and soldiers without armor.
- Barracks now shows a clear empty-state message when the selected base has no local weapons or armor available for rearming.
- Pure helper seams now summarize selected-base loadout stock and mission-launch loadout readiness.
- Build Health now includes `Mission confirmation explains local loadout and launch base`.
- Barracks equip buttons now list only weapons/armor available in the currently selected base's local stores.
- Equip button labels name the selected base stock source instead of showing aggregate global inventory.
- Loadout availability tooltips now describe selected-base stock, issued gear, and in-transit gear counts.
- Pure helper seams now count issued equipment and in-transit equipment for an item.
- Build Health now includes `Base-local loadout buttons only advertise selected-base stock`.
- A compact selected-base Logistics Center that merges inbound/outbound soldier and equipment transfers into one manifest.
- Transfer manifest rows show direction, payload, origin, destination, ETA, fee-paid state, no-refund status, and cancel action.
- Quartermaster equipment transfers now offer bulk payload choices of 1, 5, and All where local stock allows.
- Bulk transfer fees scale from the existing distance/handling cost rules.
- Build Health now includes `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Clear base-to-base logistics fees for soldier and equipment transfers.
- Insufficient-funds blockers for soldier/equipment transfer creation.
- Cancel-to-origin actions for in-transit soldiers and equipment, with explicit no-refund messaging.
- Personnel Transfers and Quartermaster item transfer cards now show transfer fee/cancel information.
- Build Health now includes `Base transfer logistics charge fees and cancel back to origin`.
- The solid Geoscape globe now renders visible land using the detailed `GEOSCAPE_THREE_LANDMASSES` dataset from the earlier hologram globe, preserving the more recognizable continent/island shapes.
- The coarse `EARTH_BASE_REGIONS` polygons are no longer used as filled visible continents; they remain as transparent/subtle selection boundaries for gameplay region logic.
- Build Health now includes `Solid Geoscape globe uses detailed landmasses and remains draggable`.
- Geoscape globe input now remains available even when Skyranger or interceptor travel state exists, preventing stale travel records from permanently locking map rotation.
- A small interaction policy helper defines drag, wheel, click, and incident-focus behavior so future travel-camera work does not accidentally disable player globe control.
- The Geoscape globe now uses a solid ocean fill, visible land fills/strokes, capped terminator shading, and restrained cloud/gloss layers so Earth reads more like a satellite globe than a transparent hologram.
- Build Health now includes `Solid Geoscape globe remains draggable during travel states`.
- The first-base selection screen now shows the first two opening alien incidents before the player confirms the starting base.
- Opening incidents are deterministic North America crisis markers: `Prairie Abduction` and `Red River Signal`.
- The confirmed campaign starts with those same two opening incidents, keeping setup guidance and actual Geoscape state aligned.
- The first-base globe now previews dotted starting reach rings for Shortwave Radar coverage, Interceptor practical reach, and Skyranger practical reach.
- The setup side panel now explains whether both opening crises are inside the proposed starting site's Skyranger radius.
- Build Health now includes `First-base selection previews opening incidents and starting reach`.
- Workshop orders now preserve the production/destination base chosen when the order starts, instead of implicitly using the selected base at completion time.
- Completed Workshop stock is routed into the intended destination base's local stores.
- Workshop inventory display now shows manufactured stock for the currently selected base instead of global stock.
- Quartermaster/Base Stores now surfaces compact inbound/outbound equipment logistics summaries for the selected base.
- Quartermaster item cards now distinguish local stock, issued gear, and in-transit gear in a compact availability line.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the current playable build label and verify the new Workshop/logistics Build Health row.
- Build Health now includes `Workshop production preserves destination base and equipment logistics summaries`.
- A first `src/` source-layout scaffold while preserving `index.html` as the playable distribution artifact.
- `src/manifest.json` records the current playable artifact, save format, source areas, required runtime seams, and future engine-port targets.
- `src/engine-port-contract.md` defines the Godot 4 readiness boundary: JSON-friendly data, deterministic systems, UI adapters, explicit save migrations, and manifest-keyed assets.
- `tools/check-aegis-build.cjs` provides a dependency-free static seam check that validates the current build label and required architecture/runtime markers.
- `index.html` now exposes `ARCHITECTURE_MODULE_PLAN` and Build Health includes `Modular source layout and engine-port prep contract is present`.
- Mission recovery stock routing into the Skyranger return-base local `baseInventories`, while keeping legacy aggregate `gearInventory` compatibility.
- Successful mission alien spoils and KIA equipment recovery now update the local stores of the base that receives the returning Skyranger.
- Mission summaries now include a compact return-base stock delivery line.
- High-visibility UI text encoding cleanup removed broken currency/icon mojibake from the game file, including the Time Control funds line class of issue.
- Former fragile inline load/save marker text now uses the existing icon component path.
- Build Health now includes `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
- Start-screen mount recovery from `v0.26.07.09.0008_START_SCREEN_MOUNT_FIX_INDEX_ONLY_PATCH`, verified through localhost before continuing roadmap work.
- Base-local equipment store normalization with old-save compatible `baseInventories` while preserving aggregate `gearInventory` compatibility.
- Quartermaster/Base Stores selected-base stock display, local storage capacity/readout, and all-bases storage summary.
- Buy, sell, equip, remove, and forced assignment auto-equip paths now route practical loose stock through the relevant local base inventory where safely contained.
- Initial equipment transfer logistics for portable gear, with origin base, destination base, item payload, quantity, travel time, in-transit status, and Geoscape-clock arrival.
- In-transit equipment is removed from the origin's available local stock until it arrives at the destination base.
- Build Health now includes `Base-local equipment stores and transfers keep stock local until arrival`.
- Base-local Barracks and Sickbay filtering using the currently selected base.
- In-transit soldier state for initial soldier-only base transfers.
- Barracks transfer buttons for moving a ready soldier from the selected base to another base.
- Transfers record origin base, destination base, total/remaining travel time, and in-transit status.
- Soldier transfers advance through Geoscape clock time and update the soldier's base on arrival.
- In-transit soldiers are hidden from local base rosters, excluded from squad assignment, and unavailable for mission launch.
- Selected-base Sickbay capacity/readout now matches the filtered local patient list.
- Build Health now includes `Base-local rosters and soldier transfers keep personnel available only at their base`.
- A compact Geoscape Range Overlays control with toggles for Shortwave Radar, Longwave Radar, Interceptor reach, Skyranger reach, and All Off.
- Lightweight dotted/dashed base-centered range rings on the Geoscape globe.
- Overlay rings respect Interceptor Drop Tanks and Skyranger Extended Tanks when showing practical aircraft reach.
- Base-placement aircraft range preview rings remain separate from the persistent Geoscape overlay rings.
- The Squads screen now filters available assignment candidates to soldiers stationed at the same base as the selected squad.
- Squad base matching resolves real campaign base IDs first, then safe legacy stationing fields, and falls back conservatively for empty/legacy squads.
- Cross-base soldiers are hidden from the selected squad's available assignment list, and direct assignment is defensively blocked if a soldier is stationed at another base.
- Build Health now includes `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.
- UFO mission intents for active craft: Recon, Abduction, Terror Raid, Harvest, Base Scout, and Supply.
- UFO flights can now complete operations into ground incidents before simply escaping, with threat/panic based on UFO size, region, alien type, and mission intent.
- Crash sites remain separate from landed/terror-style incidents.
- Interception outcomes can disrupt UFO operations, delaying mission completion and downgrading later ground threat/panic when damage or forced disengagement occurs.
- UFO Tracking now surfaces mission intent/risk text once radar contact quality is strong enough to read the operation.
- Build Health now includes `UFO mission intents can create landed terror incidents`, covering old-save intent normalization, landed incident generation, panic consequences, radar-readable mission text, and air-combat disruption/downgrade behavior.
- Distance-based base radar coverage for UFO contacts, derived from installed Shortwave and Longwave Radar facilities and each base's Geoscape location.
- Shortwave Radar acts as a local/regional detector with a 4,500km range; Longwave Radar acts as a wider strategic detector with a 9,000km range.
- UFO Tracking and the Geoscape globe now show only detected/known UFOs or contacts currently inside radar coverage, rather than exposing all UFOs whenever any radar exists.
- Contact quality states such as Weak, Faint, Tracked, and Locked now affect detection chance and air-combat firing-solution quality.
- Overlapping radar coverage improves contact quality and detection chance.
- UFO Tracking now names the best detecting base/radar source, approximate distance, detection chance, and overlap count for each contact.
- Build Health coverage now includes radar range gating, out-of-range UFO hiding, Shortwave-vs-Longwave range differences, overlapping coverage improvements, starting radar continuity, and no-regression checks for interceptor and Skyranger launch selection.
- A second Skyranger stationing fix for saves where ready transport bases were visible but selected soldiers still failed to match either Fort Aegis or N. Africa ready Skyranger bases.
- Soldier stationing now resolves through real campaign base IDs first, then safe legacy base name/region tokens, while ignoring room/activity-only `baseLocation` labels such as Barracks as base identity.
- Save/load migration now normalizes missing soldier `baseId` values with the selected/first campaign base when only room-state location data exists.
- Skyranger launch blockers now name mixed-base offending soldiers and their interpreted stationing so the player can see exactly why a response force is blocked.
- Build Health coverage now includes Fort Aegis plus N. Africa ready-Skyranger matching, room-only legacy location fallback, mixed-base named blocker text, and legacy load normalization.
- A targeted Skyranger stationing fix so mission launch checks soldiers against the actual Skyranger launch base using current and legacy base identifiers.
- Soldier stationing now recognizes base `id`, base name, region, legacy `baseLocation` strings/objects, and older `homeBaseId` / `assignedBaseId` fields without weakening wrong-base squad blocking.
- North America-to-nearby-incident range validation remains tied to the Skyranger practical range/fuel model; a representative North America to Central America round trip is about 6,813km, inside the starting 16,000km range.
- Skyranger blocker text now names the ready Skyranger bases involved when soldiers are not stationed at any matching transport base.
- Build Health coverage for in-range North America launch eligibility, legacy soldier stationing normalization, wrong-base blocking, under-fueled blocking, and the existing Skyranger assigned-base regression row.
- X-COM-style Geoscape time compression modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- A smoother one-second Geoscape clock cadence where the selected compression mode controls elapsed simulation minutes instead of changing aircraft/travel formulas.
- Old-save normalization for legacy or odd Geoscape tick settings, snapping them to the nearest supported compression mode.
- Time-control UI labels that show the selected compression mode and perceived clock rate.
- Build Health coverage for time-scale conversion, route progress scaling, repair/refuel progression, and no-regression tactical/modal clock blocking.
- Dotted aircraft reach previews during Build New Base placement mode, centered on the proposed site on the Geoscape globe.
- Separate current Interceptor and Skyranger practical reach rings, using the existing aircraft range profile and half-range round-trip planning model.
- Additional upgrade-preview rings when Interceptor Drop Tanks or Skyranger Extended Tanks are not yet owned, so the player can compare starting craft reach against upgraded reach.
- Selected-site summary text explaining the current aircraft reach values without requiring the player to hunt through unrelated panels.
- Build Health coverage for placement-mode range preview state, range values, hidden inactive-mode previews, render data, summary text, and no-regression base construction behavior.
- One Shortwave Radar seeded into the default Fort Aegis starting base layout.
- Expansion bases remain clean starter bases with only their free Access Lift.
- Starting radar coverage now contributes to the existing shortwave/longwave detection summary from the beginning of a new campaign.
- Build Health coverage for the starting Shortwave Radar seed without disturbing the existing hangar layout or expansion-base construction contract.
- Global save-compatible aircraft fuel tank upgrade flags for Interceptors and Skyrangers.
- Purchasable Interceptor Drop Tanks and Skyranger Extended Tanks in UFO Tracking.
- Upgraded Interceptors increase from 100 fuel / 7,800km range to 135 fuel / 10,500km range.
- Upgraded Skyrangers increase from 100 fuel / 16,000km range to 130 fuel / 20,800km range.
- Existing and newly ordered aircraft inherit the upgraded capacity/range while preserving current status, repair, airborne, and fuel behavior.
- Old saves normalize missing tank flags safely; saves that already have a fuel tank flag apply it to the aircraft fleet during load/migration.
- Build Health coverage for fuel tank upgrade normalization, application, range expansion, refueling to the new capacity, and no-regression aircraft travel/range selection.
- A targeted stuck-airborne recovery fix for interceptors left in `Outbound` or `Returning` without an active `interceptorTravel` record.
- Active interceptor travel now synchronizes aircraft fleet status as `Outbound` before the attack leg and `Returning` after the attack leg.
- Save/load migration now recovers stale airborne interceptors into a short `Repairing` recovery window so they become grounded and eligible to refuel instead of staying permanently unusable.
- Aircraft readiness lines now call out airborne refuel pause and stale-travel recovery status.
- Build Health coverage for active travel status sync, return recovery, stale `Outbound` / `Returning` recovery, recovered refueling, legitimate airborne no-refuel behavior, and recovery display text.
- Richer UFO interception outcomes: confirmed shootdown, damaged escape, evasive maneuvers, contact lost, forced disengage, ammunition pressure, and cautious breakaway.
- A shared air-combat outcome helper that uses UFO size/speed/threat, formation size, weapon power, detection coverage, and Cautious/Standard/Aggressive stance.
- Interceptor launch summaries now show the outcome, hit estimate, combat roll, evasion pressure, fuel cost, launch base, and clock-based ETA.
- UFO Tracking sortie text now previews hit estimate and UFO evasion pressure alongside range/fuel readiness.
- Missed/non-crash encounters can advance the UFO flight, mark contact lost, or preserve a damaged-escape summary without changing the clock-based travel/return contract.
- Aircraft recovery now records the richer air-combat outcome and applies bounded outcome modifiers to damage and repair burden.
- Build Health coverage for richer evasion/contact-lost outcomes, stance modifiers, ammo bounds, contact-state updates, recovery bounds, and no-regression checks for interceptor base range, Skyranger base matching, and new-base placement.
- A targeted Geoscape UI fix so the new-base placement confirmation controls render directly above the globe when placement mode is active.
- A visible base name field, selected site summary, construction cost, funds-after-construction readout, and confirm button near the existing Build/Cancel placement controls.
- Shared placement validation state so confirm is disabled with a clear reason until a name is entered and enough funds are available.
- Build Health coverage for the base-placement confirmation state and new-base construction data contract.
- A targeted correction so Skyranger mission launch evaluates each ready Skyranger's assigned base instead of the selected/first campaign base.
- Save-compatible soldier home-base normalization so old saves place missing soldier base state at the campaign's selected/first base.
- Mission launch pairing that only selects a ready Skyranger whose base contains the assigned response soldiers.
- Clear Skyranger launch blockers for no ready transport, soldiers not stationed at a ready Skyranger base, practical range, and fuel.
- Manual and simulated missions now resolve their response force from the preserved Skyranger launch base.
- A targeted correction so interceptor range/fuel checks use each interceptor's assigned base or hangar, not the first campaign base.
- Launch selection now prefers eligible ready interceptors from bases that can actually reach the UFO.
- Interceptor travel now preserves the selected launch base for ETA/progress.
- Old aircraft records with a `hangarKey` but missing `baseId` derive the base from the hangar key during normalization.
- Save-compatible fuel, range, and refuel readiness fields on top of the existing `aircraftFleet` identity/readiness state.
- Simple practical range profiles for Skyrangers and interceptors, with launch blocking when a round trip exceeds range.
- Fuel consumption committed at launch and refueling advanced only by Geoscape clock minutes while craft are not airborne.
- Interception stance choices: Cautious, Standard, and Aggressive.
- Stance effects on hit chance, aircraft damage risk, ammo expenditure, fuel use, and repair time.
- UFO Tracking readouts for interceptor fuel/range readiness and per-contact sortie feasibility.
- Hangar readiness readouts expanded through `aircraftStatusLine` to show fuel, range, repair, and refuel state.
- Build Health coverage for old-save normalization, range checks, refueling behavior, stance effects, fuel-based launch blocking, and existing repair behavior.
- Build Health coverage for multi-base interceptor range selection, hangar-key base normalization, Skyranger assigned-base selection, wrong-base soldier blocking, multi-base Skyranger matching, fuel/refuel continuity, and old-save soldier base fallback.

## Current Player Verification Needed
Before moving to the next major feature stage, test:

0c. **Supplied-save staged Skyranger route**
   - Import or load `Project-Aegis-Campaign_slot_10_v0_26_07_17_0137_2026-07-26T06-25-26.project-aegis-save.json` without overwriting the source export.
   - Select the active South America Alien Abduction Site from the first base.
   - Confirm a Fort Aegis Skyranger can stage through the now-empty S. America hangar, refuel, and launch the incident response.
   - Confirm Saber One continues its existing return to Fort Aegis and still owns its Fort Aegis recovery reservation.
   - Confirm no occupied staging hangar is treated as open and no aircraft is duplicated or displaced.

0. **New base placement**
   - Click Build New Base from the Geoscape.
   - Confirm the New Base Site panel, base name field, selected site summary, cost, and confirm button appear immediately above the globe without needing to hunt through the page.
   - Confirm dotted Interceptor and Skyranger aircraft reach rings appear centered on the proposed base site.
   - Confirm the selected-site summary includes the dotted aircraft reach values.
   - Confirm the button stays disabled until a base name is entered and enough funds are available.
   - Enter a name, confirm construction, and verify the new base is created with the standard Access Lift seed layout.

0b. **Smooth Geoscape time**
   - Use the Geoscape Clock modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
   - Confirm the clock feels like time compression rather than a chunky End Day-only flow.
   - Launch aircraft or track a UFO and confirm faster modes make visible progress faster while preserving the same clock-based travel/return/repair/refuel rules.
   - Confirm tactical/manual mission states, council slides, and blocking modal states still stop the auto-clock.

0a. **Starting Shortwave Radar**
   - Start a new campaign and inspect the starting base.
   - Confirm the default base includes one Shortwave Radar facility.
   - Confirm expansion bases built through Build New Base still start with only the Access Lift seed layout.
   - Confirm UFO Tracking coverage starts with one shortwave radar counted.

1. **Aircraft readiness and hangars**
   - Start a new campaign and inspect the starting base hangars.
   - Confirm the Skyranger and starting Interceptor show named aircraft, fuel, range, and readiness text.
   - Order a new aircraft from an empty hangar and confirm the new craft receives a stable name/status plus full fuel/range values.

2. **Interceptor readiness and repair**
   - Launch one or more interceptors at a detected UFO.
   - Confirm ready interceptor count drops immediately and launch buttons disable when no ready/fueled/in-range craft remain.
   - With multiple bases, confirm UFO Tracking and launch use the base where each interceptor is stationed.
   - Confirm airborne interceptors show Outbound before the attack leg and Returning after the attack leg.
   - Advance Geoscape time through the return leg and confirm any damaged craft enter Repairing.
   - Advance more clock time and confirm repaired craft return to Ready.
   - Confirm fuel refills only while craft are not Outbound or Returning.
   - Load an older/save-mismatched campaign with a stale Outbound or Returning interceptor and confirm it recovers through a short Repairing state instead of staying stuck.

3. **Interception stance**
   - Change stance between Cautious, Standard, and Aggressive in UFO Tracking.
   - Confirm contact readouts and launch reports show the selected stance.
   - Confirm Aggressive improves hit chance but increases ammo/fuel/damage/repair pressure in Build Health and practical play.

3a. **Richer air-combat outcomes**
   - Launch one or more interceptors at detected UFOs with different stances.
   - Confirm launch summaries can report outcomes such as Confirmed Shootdown, Damaged Escape, Evasive Maneuvers, Contact Lost, Forced Disengage, Ammunition Pressure, or Breakaway.
   - Confirm the UFO Tracking contact readout includes hit estimate and UFO evasion pressure.
   - Confirm misses still send interceptors through clock-based return/recovery instead of instantly resetting them.
   - Confirm any contact-lost result clearly changes the contact state instead of pretending the UFO was simply shot down or ignored.

3b. **Aircraft fuel tank upgrades**
   - Open UFO Tracking and confirm Interceptor Tanks and Skyranger Tanks upgrade cards are visible near aircraft ordnance.
   - Purchase Interceptor Drop Tanks and confirm interceptor readiness text shows 10,500km range and 135 fuel capacity after normalization/refuel.
   - Purchase Skyranger Extended Tanks and confirm Skyranger readiness text shows 20,800km range and 130 fuel capacity.
   - Confirm upgraded aircraft can accept longer practical sorties but still block missions that exceed range or fuel.
   - Confirm automatic refueling still uses Geoscape clock time and does not require funds or Base Stores.

4. **Skyranger status**
   - Launch a mission and confirm Skyranger travel still uses clock-based progress.
   - With multiple bases, confirm the Skyranger launches from the base where the chosen transport is housed.
   - Confirm soldiers assigned to the mission must be stationed at the chosen Skyranger's launch base.
   - From a North America starting base, confirm a ready Skyranger and squad can launch to a nearby North/Central America incident that is within the 16,000km practical range.
   - Confirm older soldiers with legacy `baseLocation` or missing `baseId` no longer get falsely blocked when they are effectively stationed at the Skyranger base.
   - Confirm launch is blocked or clearly reported if the round trip exceeds practical range or current fuel.
   - Finish/return from the mission and confirm the Skyranger becomes Ready again.

5. **Save compatibility**
   - Load or import an older save with no `aircraftFleet` field.
   - Confirm it normalizes a Skyranger/interceptor fleet with fuel/range fields and no crash.

6. **Build Health**
   - Confirm the in-browser Build Health panel passes all checks, including the expanded Skyranger stationing/range launch row, smooth Geoscape time compression, base-placement aircraft range previews, fuel tank upgrades, air-combat reports, stuck-Outbound recovery, richer UFO evasion, new-base placement, aircraft identity/repair, range/fuel/stance, interceptor assigned-base, and Skyranger assigned-base rows.

---

# 3. Packaging and Versioning Rules

These rules matter for every Codex patch.

## Versioning
Use version format:

`v0.yy.mm.dd.hhmm_SHORT_PATCH_NAME`

Example:

`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY`

## Displayed Version
The in-game displayed version number must match the zip/build version.

## Zip Naming
Zip file name should match:

`Alien_Response_Command_Game_v0_YY_MM_DD_HHMM_PATCH_LABEL_INDEX_ONLY.zip`

## Folder Structure Inside Zip
The zip should contain one folder, named exactly like the zip without `.zip`.

Inside that folder:
- `index.html` must be at the root.
- Do not add an extra outer folder.
- Do not bury `index.html` deeper than one folder.

## Patch Type
Use `INDEX_ONLY` unless the patch truly requires external assets. If a new asset is added, include it in the package and use an asset-aware build label.

## Build Health
Whenever possible:
- Keep existing Build Health tests passing.
- Add tests for new systems.
- Avoid removing prior tests unless replacing them with stronger coverage.

---

# 4. Gameplay Overview

## Core Loop
1. Review base status, personnel, funding, panic, facilities, and threats.
2. Recruit / manage soldiers, scientists, engineers, and aircraft.
3. Advance time.
4. Detect alien incidents / UFOs.
5. Intercept UFOs or respond to ground incidents.
6. Resolve missions tactically or through simulation.
7. Soldiers gain XP, injuries, stress, commendations, relationships, and service notes.
8. Research, build, expand facilities, and improve readiness.
9. End month with Council Review.
10. Survive escalating alien activity until command-site discovery and final mission path.

## Main Screens / Sections
- Start screen
- Base / Command view
- Barracks
- Sickbay
- Memorial
- Training Center
- Recreation / Rec Room
- Laboratory
- Workshop
- Stores / Quartermaster
- Hangars / aircraft management
- Geoscape
- Incident list
- Tactical mission
- Simulated mission
- Council Review / End-of-Month Review
- Build Health / Self-tests
- Instructions

---

# 5. Soldier Systems Game Bible

## Soldier Identity
Each soldier can have:
- Name
- Rank
- Callsign
- Personality
- Background
- Specialization
- Squad assignment
- Service notes
- Cosmetic unlock notes
- Mission count
- Kills
- Wounds
- XP / level progress
- Commendations
- Stress / morale state
- Downtime preference
- Friendships
- Squad history
- KIA memorial record if killed

## Callsigns
Completed features:
- Edit Callsign
- Random Callsign
- Clear Callsign
- Save/load persistence
- Special callsigns include:
  - Pirate Detective
  - Chat Ghost
  - Cogito

## Specializations
Completed / polished:
- Rifleman
- Medic
- Scout
- Heavy
- Sniper
- Engineer
- Assault
- Officer

Implemented:
- Auto specialization assignment
- Assignment rebalance
- Dropdown specialization selector
- Squad role composition
- Save/load persistence

## Ranks and Progression
Soldiers have rank progression and XP. Promotions should feel meaningful but not overcomplicated. Rank should influence leadership, morale impact, and squad chain-of-command in later systems.

## Stress / Morale
Morale states:
- Steady
- Stable
- Tense
- Shaken
- Critical

Current behavior:
- Missions increase stress.
- Rec Room / recovery downtime reduces stress.
- Stress can apply minor gameplay penalties/bonuses.
- Stress changes can create service notes.
- Friend deaths can create stress shocks.
- Officers and cohesion can help mitigate morale damage or trigger rally recovery.

## Downtime
Implemented first-pass systems:
- Training Center
- Rec Room
- Downtime assignment UI
- Training progress seed system
- Stress reduction seed system
- Autonomous downtime selection
- Preferred activity logic
- Facility slot/fallback logic
- Shared downtime friendship growth
- Daily/monthly downtime summary hooks

## Soldier Needs and Preferences
Soldiers should autonomously choose downtime activities based on:
- stress
- personality
- specialization
- background
- recent events
- facility availability
- player guidance

Example preferred activities:
- pool
- cards
- darts
- gym
- running
- shooting range
- maintenance
- reading
- memorial visits

Design direction: the player should set broad guidance, not micromanage every recreation choice. Soldiers should feel like people making choices based on need and temperament.

## Friendships
Implemented first-pass systems:
- Friendship scores
- Shared downtime friendship growth
- Shared mission friendship growth
- Compatibility bonuses from similar backgrounds/preferences
- Top-friend display logic
- Friend-death stress penalties

Future improvements:
- More emotionally specific service notes.
- Friendship-based memorial offerings.
- Rivalries or strained relationships.
- Squad relationship map.

## Squad Cohesion
Implemented first-pass systems:
- Squad cohesion scoring
- Cohesion labels such as Loose / Familiar / Cohesive / Bonded
- Cohesion bonuses
- Rally recovery hooks
- Friend-death cohesion effects

Future improvements:
- Clearer squad-level UI card.
- Tactical cohesion feedback.
- Better event log entries explaining cohesion effects.
- Officer and second-in-command rally events.

---

# 6. Memorial Game Bible

## Memorial Purpose
The Memorial should make casualties matter. It should be emotional, inspectable, and persistent.

## Current Completed Systems
- KIA soldiers move to Memorial.
- Memorial sorting.
- Memorial upgrades.
- Service summaries.
- Early KIA commendations:
  - Line of Duty
  - First Fallen

## Approved Memorial Tone Examples
**Worn Playing Card**  
“You still owe me one rematch. I’ll keep the table open.”  
Left by Sgt. Mara Voss.

**Spent Rifle Casing**  
“You covered my retreat at Redfall. I came home because you didn’t.”  
Left by Cpl. Dane Okafor.

## Future Memorial Offering System
Planned Stage 2.7:
- Clickable tribute items.
- Relationship-based offerings.
- Emotional inspected-item writing.
- Persistent memorial history.
- Offerings influenced by friendship, squad membership, shared missions, and service history.

Design rule: memorial writing should be short, specific, and personal. Avoid generic “you were brave” text when a concrete memory can be referenced.

---

# 7. Base Facilities Game Bible

## Existing / Planned Base Facilities
- Access Lift
- Living Quarters
- Sickbay
- Laboratory
- Workshop
- Base Stores
- Training Center
- Recreation / Rec Room
- Memorial
- Radar / Longwave Radar
- Quartermaster / Upgrade Bench
- Hangar

## Facility Roles
### Living Quarters
Personnel capacity and base life.

### Sickbay
Injury recovery. Sickbay soldier cards have been optimized/collapsed similarly to barracks cards.

### Laboratory
Research. Current assumption: 10 scientists per lab.

### Workshop
Engineering/manufacturing. Current assumption: 10 engineers per workshop.

### Base Stores
Storage and supplies. Text readability has been fixed for dark mode.

### Training Center
Soldier stat improvement over time. Also supports downtime/training guidance.

Future minigame note: when the Training Center receives a deeper interaction pass, allow optional playable drill minigames based on available training activities. These should be opt-in bonuses/immersive activities, not mandatory chores, and can feed small training progress, morale, rivalry/friendship, or squad-cohesion outcomes.

### Rec Room
Stress reduction and friendship growth through recreation.

Future minigame note: eventually add playable versions of the games soldiers can play in the Rec Room. These should use soldier relationship context where possible, so friends, rivals, and squadmates can produce different banter, stakes, morale outcomes, and memorial memories later.

### Memorial
KIA record, emotional attachment, future offerings.

### Radar
Detects alien activity and UFOs. Longwave Radar adds incidents and detection value.

Roadmap update: radar detection should eventually be distance-based from each base, not only a global coverage score. Shortwave Radar should provide local/regional detection, Longwave Radar should project farther coverage, and overlapping radar fields should improve contact quality.

### Hangar
Aircraft storage. Hangar is conceptually a 2x2 tile. Supports craft purchase/assignment and empty hangar states.

Default starting base layout should include **two 2x2 hangars**: one populated with the starting Interceptor and one populated with the Skyranger. This keeps the visual base layout consistent with the campaign starting equipment.

Roadmap update: the default starting base should also include **one Shortwave Radar** so new campaigns begin with minimal local detection coverage. Longwave Radar should remain the broader/deeper detection expansion facility.

Future ambient base-life note: when a base has an empty, operationally free hangar reserved for ferry-route flexibility, stationed soldiers can sometimes use that open space for improvised recreation such as soccer, touch football, sparring drills, or other off-duty games. This should be flavor/morale texture first, not a blocker: aircraft storage, ferry staging, refuel stops, hangar reservation, and emergency operations always take priority and immediately clear the space.

---

# 8. Tactical / Mission Game Bible

## Tactical Mission Goals
Tactical missions should be readable, dramatic, and paced well. Even if lightweight, the player should understand:
- who is acting
- where shots originate
- what was hit or missed
- who moved
- who died
- why the outcome happened

## Completed Tactical Improvements
- Hex map.
- Larger tactical units.
- Heads/figures visible above hex edge.
- Path line in blue.
- Bouncy movement steps.
- Speed control range.
- AI slowed for readability.
- Minimum exchange pacing.
- Shot origin/impact fixes.
- No blink-in/blink-out movement.
- Camera stability improvements.
- Replay stability fixes.
- Shot/death timing sync.
- Classic Lineup Sim View restored.
- Live 48-event tactical Mission Timeline with round/side stamps and Combat, Rescue, Movement, and System filters.
- Centered HIT, MISS, ARMOR HIT, and TARGET DOWN shot-result feedback.
- Selected-soldier facing arrow in the 2D map and soldier-status panel.
- Three.js Close, Near, Wide, Full, and Map zooms use aspect-aware rectangular viewport coverage rather than a clipped square cell island.
- Three.js camera scale is decoupled from rendered-cell generation; the projected ground footprint determines bounded hex coverage and edge-safe camera centering.

## Still Planned Tactical Readability Improvements
- Richer long-term mission-log export and report filtering if the 48-event live timeline proves useful.
- Additional accessibility options for shot-result duration and motion.
- Playback speed controls.
- Continue battlefield-space optimization for the 2D Hex view and future free-pan camera controls; Three.js rectangular viewport fill is implemented in browser build 2312.
- Simulated mission paper-doll/layered sprite consistency.

## Simulated Missions
Current direction:
- Probability-driven outcome.
- Optional Classic Lineup View.
- Soldiers should use the newer layered sprite system where practical, not old static images.

---

# 9. Geoscape / Campaign Game Bible

## Current Campaign Foundations
Implemented or first-pass:
- Geoscape ticking time.
- UFO spawning.
- Radar detection.
- Interceptors.
- Aircraft ammo/upgrades.
- Persistent aircraft identity/readiness seed.
- Aircraft damage/repair seed after interception.
- Crash-site incidents.
- Hidden command-site discovery gating.

## Future Campaign Goals
- Replace static End Day/End Month feeling with more continuous time progression.
- Let the player control time speed.
- Make Geoscape time feel closer to classic X-COM: smooth clock flow with selectable time compression, where aircraft and UFO motion visibly speed up or slow down with the selected time scale while underlying travel math remains clock-accurate.
- Seed the first base with one Shortwave Radar so initial UFO detection feels intentional before the player expands the radar network.
- Replace abstract global radar coverage with base-centered radar range so UFOs can only be reliably detected when they fly within Shortwave/Longwave coverage.
- Add player-controlled Geoscape overlay filters so commanders can toggle radar rings, Interceptor practical reach, Skyranger practical reach, and all range rings off when the globe is too busy.
- UFOs range from very small to very large.
- Larger craft are harder to shoot down.
- Shootdowns create crash incidents.
- Some UFOs should eventually land or complete a mission profile, creating alien ground incidents such as terror raids, abductions, harvest sites, scouting operations, or landed UFO missions if not intercepted in time.
- Live alien research should eventually reveal alien command sites.
- Highest-tier live alien research gates alien base/final command-site discovery.
- Endgame final mission should become available after the correct chain of detection/research/escalation.

## Air War
Current aircraft ideas:
- Interceptors are faster and shorter range than Skyrangers.
- Multi-interceptor attack formation.
- Default gatling + small missiles.
- Large missiles purchasable.
- Energy weapons later.
- Aircraft ammo/upgrades.
- Aircraft fuel tank upgrades to extend practical range and make starting craft more useful before full aircraft replacement.
- Hangar assignment and empty hangar states.
- Named Skyranger/interceptor craft with Ready, Outbound, Returning, and Repairing status.
- Light post-sortie interceptor damage and clock-driven repair timers.
- Simple aircraft fuel/range readiness with clock-driven refueling.
- Future ferry/staging routes where aircraft can land at another owned base with an open compatible hangar, refuel there, and launch a follow-up leg to extend practical response range.
- Multi-base sortie staging so Skyrangers and their squads can fly to a forward base, refuel, and join a closer-base Skyranger response when hangar capacity and timing allow.
- Ambient base-life use for empty, operationally free hangars: soldiers stationed at that base may use unused hangar floor space for morale/recreation scenes such as improvised sports, as long as this never interferes with aircraft storage, ferry staging, refuel reservations, or emergency launch readiness.
- Interception stances that trade hit chance against ammo burn, fuel use, damage risk, and repair time.
- Lightweight UFO evasion / air-combat event outcomes: confirmed shootdown, damaged escape, evasive maneuvers, contact lost, forced disengage, ammunition pressure, and cautious breakaway.
- Compact air-combat after-action reports in UFO Tracking for launch, impact, delayed crash, and recovery phases.
- Lightweight damaged-UFO memory after damaged escapes, including follow-up hit bonuses and delayed crash-site chances.

Still planned:
- Pilot/crew identity if the air-war layer needs named aviators later.
- Fuller multi-step air-combat history and filtering if the report list grows beyond the current compact latest-report model.
- Fuel tank upgrade path for Interceptors and Skyrangers, likely through Workshop purchase/install or research unlocks, increasing fuel capacity/range while preserving automatic refueling.
- Aircraft ferry/refuel staging through owned bases, including hangar reservation, refuel/turnaround timing, staged mission launches, staged interceptions, and clear return-home/stay-staged options.
- Hangar downtime scenes that make empty hangars feel lived-in: soldiers can use unused hangars for improvised sports or recreation when no aircraft, ferry reservation, refuel stop, transfer, repair, or emergency sortie needs the space. These scenes can feed small morale, friendship, rivalry, or squad-cohesion flavor later.
- Deeper aircraft damage outcomes and repair cost/bay constraints.

---

# 10. Council Review / End-of-Month Game Bible

## Purpose
The Council Review is the monthly strategic report and narrative checkpoint. It should summarize the month, funding, panic, performance, and consequences.

## Current Issue Addressed
The **Next Slide** button previously moved around because slide content could change modal height.

## Latest Patch Goal
`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY` should:
- Give Council Review a stable slide frame.
- Keep footer buttons in a consistent location.
- Let long slide content scroll inside the body instead of resizing the whole modal.
- Preserve Skip to Reports / Next Slide usability.

## Future Council Review Improvements
- Better visual presentation.
- More specific Council commentary.
- Better standardized slide size and spacing.
- Replay monthly review.
- More readable graphs or status blocks.
- Ensure all controls remain stable across all slide types.

---

# 11. Audio / Music Game Bible

## Current Audio Features
- Music/SFX toggles.
- Volume sliders.
- Music changes automatically when moving between screens/sections.

## Known Preference
Music may need balancing:
- Music default can be low.
- SFX can remain high.
- Prior note: music around 5%, SFX around 100% felt closer to desired balance.

## New Roadmap Feature: Music Track Selection / Auto Mode
First pass built in v0.26.06.09.0030:
- Player can manually select the currently playing music track.
- Player can leave music in Auto Songs mode.
- Auto mode preserves current behavior where tracks switch when moving from one screen/section to another.
- Manual mode keeps the selected track while navigating between screens.
- Track selection is available from both normal and minimized header layouts.
- Current music/SFX sliders remain available.

Still planned:
- Save selected music mode and track preference if playtesting confirms the control shape.
- Refine compact selector layout if it feels too tall in the minimized header.
- Add more track labels if future music modes are added.

---

# 12. UI / Accessibility Game Bible

## Current UI Direction
- Dark mode support.
- Collapsible soldier cards.
- Cleaner soldier card actions.
- Barracks and Sickbay cards optimized to reduce clutter.
- Header minimized.
- Dropdowns and section controls preferred when cards become too busy.
- Build Health button in header/menu.
- Menu/Save access should remain easy.

## Important UI Rules
- Keep dense cards collapsible.
- Avoid burying vital status information.
- Do not let action buttons drift around if the player is stepping through repeated content.
- Preserve mobile responsiveness when possible.
- Preserve focus visibility and reduce-motion support.
- Avoid decorative layers blocking clicks.

## Future UI Polish
- More consistent card sizes.
- Better summary badges.
- Cleaner squad overview.
- Better soldier detail modal.
- More unified visual styling.
- Improved tactical screen space usage.
- Better music selector UI.

---

# 13. Roadmap Status

## Stage 1 — Stabilize Current Build
Status: **Complete**

Completed:
- Save / Load / Import / Export verification.
- Start screen / version verification.
- Command-section rendering fixes.
- Tactical / Simulated mission verification.
- Portrait / geoscape / UI regression repairs.
- Build Health / Campaign Self-Tests.
- 113/113 test pass verification.

---

## Stage 2 — Soldier Attachment / Soldier Life Systems
Status: **In progress, late Stage 2**

### 2.1 — Soldier Dossier Foundation
Status: **Complete**

Completed:
- Personality display.
- Background display.
- Service notes.
- Squad history.
- Cosmetic unlock notes.
- Record / kills / missions / wounds tracking.

### 2.2 — Editable Callsigns
Status: **Complete**

Completed:
- Edit Callsign.
- Random Callsign.
- Clear Callsign.
- Save/load persistence.
- Special callsigns:
  - Pirate Detective
  - Chat Ghost
  - Cogito

### 2.3 — Medals / Commendations
Status: **Complete**

Completed:
- First Blood.
- Survivor.
- Wounded in Action.
- Veteran.
- Ace.
- Field Promotion.
- Base Breaker.
- Earth’s Shield.
- Fallen Star.
- Commendation display in dossier.

### 2.4 — Squad History + Memorial Upgrade
Status: **Complete**

Completed:
- Squad Legacy panel.
- Current/former/KIA squad tracking.
- Memorial upgrades.
- Memorial sorting.
- Service summary improvements.
- Early KIA commendations:
  - Line of Duty
  - First Fallen

### 2.5 — Soldier Specializations
Status: **Complete / Polished**

Completed:
- Rifleman.
- Medic.
- Scout.
- Heavy.
- Sniper.
- Engineer.
- Assault.
- Officer.
- Auto specialization assignment.
- Assignment rebalance.
- Dropdown specialization selector.
- Squad role composition.
- Save/load persistence.

### 2.6A — Downtime Facilities Seed
Status: **Complete**

Completed:
- Training Center.
- Rec Room.
- Downtime assignment UI.
- Training progress seed system.
- Stress reduction seed system.
- Future optional minigame parking lot for Training Center drills and Rec Room games, to be added when interaction depth fits the roadmap stage.
- Rec Room downtime now separates soldier tastes for cards, pool, and darts. Training Center downtime separates tastes for shooting range, gym work, and running, so soldiers can like one activity without liking every activity in that facility.

### 2.6B — Soldier Stress / Morale Seed
Status: **Complete**

Completed:
- Stress values.
- Morale states.
- Mission stress increases.
- Rec Room stress reduction.
- Minor gameplay penalties/bonuses.
- Stress service notes.

### 2.6C — Soldier Needs and Preferences
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Soldiers autonomously choose downtime activities.
- Preferences influenced by stress/personality/specialization/background/recent events.
- Preferred activities visible in Soldier Dossier.
- Player sets guidance rather than micromanaging every recreation action.

### 2.6D — Facility Scheduling / First-Come-First-Served Usage
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Facilities have limited slots.
- Soldiers compete for preferred activities.
- Backup activities selected if full.
- Activity participation feeds friendship growth.

### 2.6E — Friendship and Attachment Growth
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Soldiers develop friendships.
- Shared downtime accelerates bonds.
- Shared missions accelerate bonds.
- Similar backgrounds/preferences improve compatibility.
- Friendships visible in dossier.

### 2.6F — Squad Cohesion Effects
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Cohesion bonuses.
- Friend-death grief effects.
- Morale shocks.
- Officer mitigation.
- Rally recovery mechanics.

### 2.6G — Downtime / Friendship / Cohesion QA + Visibility Polish
Status: **Built / Needs playtest confirmation**

Latest patch:
`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY`

Included:
- Downtime QA/self-tests.
- Better visibility for preferred activity reasoning.
- Daily downtime summary text.
- Council Review fixed slide frame.

Recommended next action: test and verify before moving to 2.7.

---

## Stage 2.7 — Memorial Offerings / Personal Tributes
Status: **Built / pending player playtest confirmation**

Built in v0.26.06.08.2415:
- Expanded memorial offerings to 100 distinct tribute item types.
- Added 20 contextual message patterns that reference the item, activity, donor, fallen soldier, mission, or region.
- Updated in v0.26.06.09.1719 with the supplied Memorial Offerings Content Pack: 100 tagged item types and 80 tagged message templates, including item-specific messages for Rec Room, medic, engineer, crash-site, mission, training, barracks, and personal tribute contexts.
- Updated in v0.26.06.09.1750 with the expansion pack: +50 offering items and +120 non-duplicate messages, for 150 tagged items and 200 message templates total.`n- Updated in v0.26.06.10.0100 with the Rec Room Memorial Content Pack: +50 tagged rec-room/adult-offtime/game keepsake items and +81 tagged messages, for 200 tagged items and 281 message templates total. Selection now supports cards, pool, darts, music, movies, chess/dice, rivalry, close-friend absence, and subtle adult-offtime keepsakes with wording guardrails.`n- Updated in v0.26.06.10.0200 with the Massive Memorial Message Library JSON: +3,500 fallback/variety messages across 7 relationship tiers and 10 item categories. Existing hand-written messages remain preferred when they are strong contextual matches. The massive library scores relationship tier first, item category/tags second, and tone third; it supports rival-respect and deep-bond gating, per-fallen message ID history, and recent global duplicate reduction.
- Memorial friendship tiers: 4-7 Buddy can rarely leave a simple offering only with same-squad, same-fatal-mission, or witnessed-death context; 8-13 Friend is the normal offering threshold; 14-24 Close Friend has high chance for emotionally specific personal offerings; 25+ Deep Bond enables premium emotional tags for anniversary visits, post-victory/final-mission offerings, and highly specific shared-history items. Friendship scores still clamp to the existing 99 max.
- Memorial donors now need a believable reason to leave something: friendship, respect, shared squad history, downtime bond, officer/medic/engineer role context, mission-survivor connection, or command tribute fallback. Soldiers with strong rivalry/dislike and no meaningful respect are suppressed.
- Added a lightweight rivalry/dislike layer for soldier relationships based on personality friction, mismatched downtime preferences, stress gaps, role rivalry, and background/work-style tension.
- Preserved clickable tribute inspection and save-compatible memorial offering normalization.
- Added Sickbay/forced-deployment equipment validation so recovered or force-assigned soldiers with missing weapon/armor attempt to equip the best available inventory by rank, XP, combat strength, then coin-flip tie breaker.
- Set Barracks Guidance default to Autonomous and added a Barracks bulk button to set all ready Barracks soldiers to Autonomous.
Goals:
- Clickable tribute items.
- Relationship-based offerings.
- Emotional inspected-item writing.
- Persistent memorial history.
- Offerings left by friends, squadmates, survivors, officers, or rescued soldiers.
- Offerings should reference actual relationships/events when possible.

Recommended patch name:
`Alien_Response_Command_Game_v0_26_MM_DD_HHMM_MEMORIAL_OFFERINGS_SEED_INDEX_ONLY`

Suggested implementation steps:
1. Add memorialOffering data structure.
2. Generate offerings on soldier death, monthly review, or after friend/squadmate survives a mission.
3. Display offering list on each KIA memorial entry.
4. Add inspect modal with short emotional text.
5. Add Build Health tests:
   - KIA can receive offering.
   - Friend is more likely to leave offering.
   - Offering persists through save/load.
   - Inspect text renders safely.
   - Memorial still works with no offerings.

---

## Stage 2.8 — Squad Leadership / Chain of Command
Status: **Built / pending player playtest confirmation**

Completed:
- Squad lead + second-in-command are selected automatically.
- Leadership selection weighs rank, bravery, Officer specialization, background, service history, missions, and commendations.
- Small cohesion/morale command bonuses are calculated and surfaced on the Squad screen.
- Squad-leader death creates survivor morale shock.
- A surviving second-in-command can rally the squad and record a service note.
- Mission results can call out leader loss and second-in-command rally events.
- Build Health tests cover leader selection, second-in-command selection, command bonus bounds, leader death shock, second-in-command rally, active squad command resolution, and command event report text.

Still planned:
- Manual officer assignment or lock-in options if auto-selection feels too opaque.
- Additional Officer specialization interactions during tactical missions.

---

## Stage 3 — Tactical Readability
Status: **Started / Partially complete**

Completed:
- Tactical sprite visibility fixes.
- Larger tactical units.
- Movement pacing improvements.
- Shot origin improvements.
- Camera stability improvements.
- Replay stability fixes.
- Shot/death timing sync.
- Classic Lineup Sim View restoration.
- Simulated/classic playback speed controls: Slow, Normal, Fast, and Instant.
- Deterministic nature, farm, small-town, and city terrain shared by 2D and Three.js tactical views.
- Original biome-specific building archetypes with roofless cutaway presentation, doors, windows, destructible walls, interior floors, and furnishings.
- Building geometry participates in tactical movement, deployment, cover, fog of war, and line of sight.
- Enclosed building silhouettes with internal partitions and purpose-specific furnishing layouts.
- Street vehicles, lamp posts, headlights, and interior fixtures remain readable tactical scenery without active local-light simulation.
- Tactical LOS now uses a fixed 20-hex visibility range; Geoscape-clock day/twilight/night illumination gameplay is parked until it can fit the tactical performance budget.
- Persistent Auto/Performance/Quality Three.js modes with conservative hardware-aware defaults.
- Three.js view-size, pixel-ratio, shadow, light, material, ring, fog-mesh, and idle-frame budgets to prevent tactical timeouts.

Still planned:
- Persist or export the expanded tactical timeline into long-term mission reports after playtesting confirms the event density.
- Add optional shot-feedback duration/accessibility settings.
- Battlefield-space optimization.
- Simulated mission sprite consistency.
- Improve the Three.js battle option for alien incidents so manual tactical missions feel more readable, responsive, and worth choosing over auto-resolve.
- Add deliberate building-breach actions, gameplay fire/smoke propagation, and power loss. Clearer damaged-wall/window feedback now has a browser presentation seed in 1630.
- Add civilians, rescue/extraction zones, and structure-specific objectives for terror, abduction, harvest, and supply missions.
- VIP Rescue AI fire-team distribution is implemented in Browser 1850: the senior tactical coordinator assigns distinct fire teams across distinct marked VIPs before allowing duplicate coverage, while extra teams remain available for security, combat, escort support, or later reassignment.
- Adaptive Alien Field Beacon Phase 2 is implemented in Browser 1552: three recorded beacon destructions trigger ballistic-blocking kinetic fields on later beacon deployments, and reinforcement arrivals preserve the original beacon or crashed-UFO landmark.
- Next beacon milestone after live playtesting: Phase 3 combined kinetic/energy shielding plus intact hacking and commander-badge disablement. This remains behind research/evidence gates rather than being enabled automatically.
- Explore upper floors, stairs, and roof visibility only after the single-level cutaway maps remain readable and performant.

Completed in browser 0945:
`TACTICAL_EVENT_TIMELINE_AND_SHOT_FEEDBACK_INDEX_ONLY`

Completed browser Stage 3 feedback seed:
`TACTICAL_DAMAGE_STATE_SMOKE_AND_BREACH_FEEDBACK_SEED_INDEX_ONLY`

Possible follow-up after playtest:
`TACTICAL_FIRE_SMOKE_PROPAGATION_AND_POWER_LOSS_FOUNDATION_INDEX_ONLY`


---


## Implemented in Browser 1850 — Alien Field Beacon Knowledge and Priority Doctrine
Status: **Implemented in browser build 1850**

### Design goal

AEGIS should **not begin the campaign already understanding what an Alien Field Beacon is or why it matters**.

Soldiers may see, shoot, grenade, damage, or destroy a beacon before they understand its function. Before the force has sufficient evidence, the beacon is treated as an unfamiliar alien device rather than an automatically high-priority strategic objective.

### Knowledge states

Use an explicit AEGIS knowledge state for Alien Field Beacons.

#### 1. Unknown / Unidentified

Before AEGIS has observed or credibly deduced the beacon's reinforcement role:

- Soldiers can visually notice the beacon as an alien object.
- The object remains physically destructible under the currently valid weapon/damage rules.
- A soldier may damage or destroy it incidentally, through player orders, grenade blast, suppressive fire, breach fire, or local tactical judgment.
- Simulation AI should **not automatically abandon better combat, rescue, escort, or survival objectives merely because a beacon is visible**.
- The AI does not yet assign a special beacon-destruction fire team.
- Tactical descriptions/log language should avoid claiming certainty about its purpose before discovery.

#### 2. Suspected Reinforcement Source

AEGIS should be able to infer that the device matters after evidence such as:

- Alien reinforcements are visibly materialized/deployed from the beacon or its reserved reinforcement hexes.
- A tactical observer sees a reinforcement event originate at the beacon.
- Multiple sufficiently strong observations allow the command system to deduce the connection even if every soldier did not personally witness the exact moment.

At this stage:

- The beacon receives increased tactical interest.
- The combat log / tactical knowledge system can record that the device appears linked to alien reinforcement arrivals.
- AI may favor destroying it when doing so is tactically safe, but immediate threats, VIP/civilian rescue, escort commitments, and explicit player orders can still outrank it.

#### 3. Confirmed Reinforcement Beacon

Once AEGIS has directly witnessed or otherwise firmly established the connection:

- The object becomes a recognized **Alien Field Beacon**.
- Its reinforcement-enabling role becomes known to the organization and can persist according to the campaign knowledge/research system.
- Simulation AI treats an active beacon as a strategic target because leaving it intact can produce additional alien forces.
- A suitable nearby free fire team may be assigned to destroy or disable it.
- The AI should avoid sending the entire squad to the beacon; rescue, escort, contact response, and perimeter security still require distributed forces.
- If the beacon is already disabled/destroyed, its priority immediately drops.

### Knowledge acquisition and persistence

- The tactical encounter should be able to promote beacon knowledge when alien reinforcements actually arrive through it.
- Discovery should be recorded in authoritative tactical/campaign state rather than existing only as a UI message.
- **Database unlock:** the first time AEGIS confirms the beacon's reinforcement function, create a permanent entry in the globally accessible **research database / alien intel records**. The entry should identify it as an **Alien Field Beacon**, record the observed fact that alien reinforcements can arrive through it, and preserve any still-unknown properties as unresolved rather than revealing future mechanics early.
- Once the organization has confirmed the beacon's function, future trained AEGIS personnel should not need to rediscover the basic reinforcement relationship in every mission unless a later design explicitly introduces new beacon variants that require fresh identification.
- Future research/intelligence progression can add deeper knowledge such as shielding, hacking, capture value, reinforcement timing, or alien command-network behavior without erasing the basic reinforcement-source discovery.

### AI targeting doctrine after discovery

Once confirmed:

- Evaluate the beacon alongside other tactical objectives rather than treating it as the only objective.
- Prefer a fire team that is nearby, free, combat-capable, and not currently carrying a higher-authority player order or critical escort/rescue task.
- Use ordinary fire if effective.
- Use grenades when tactically appropriate and the blast is safe.
- Avoid civilian, VIP, or friendly blast risk.
- Do not waste scarce explosives when ordinary fire can safely solve the problem.
- Preserve compatibility with later adaptive beacon defenses: the AI should use only attack types that AEGIS currently knows or has evidence are effective.

### Required regression coverage

Add deterministic tests for at least:

1. **Unknown beacon visible** -> AI does not automatically elevate it above all other objectives.
2. **Unknown beacon destroyed incidentally** -> destruction is allowed even though strategic significance is not yet understood.
3. **Observed alien reinforcement arrival** -> beacon knowledge advances to suspected/confirmed state.
4. **Confirmed beacon + free nearby fire team** -> AI creates a legitimate beacon-destruction objective.
5. **Confirmed beacon + active VIP/escort emergency** -> higher-priority rescue/escort commitments are preserved.
6. **Confirmed beacon already destroyed/disabled** -> no stale beacon objective persists.
7. **Knowledge persistence** -> after organizational confirmation, later encounters recognize the basic reinforcement role without requiring redundant rediscovery.
8. **Future shield compatibility** -> AI does not assume bullets/grenades/energy work when campaign knowledge says that attack class is blocked.
9. **Database entry unlock** -> observing/confirming a beacon reinforcement event creates exactly one persistent Alien Field Beacon entry in the research database / alien intel records, and later sightings update/reuse that entry rather than creating duplicates.

### Narrative / player-experience intent

The first beacon encounters should feel mysterious. The player and soldiers may think it is simply alien machinery, a communications node, a power source, or battlefield equipment. The strategic importance becomes clear when reinforcements are seen emerging from it. That moment should change both the player's understanding and AEGIS tactical doctrine.


## Implemented in Browser 1850 — VIP Rescue AI Fire-Team Distribution
Status: **Implemented in browser build 1850**

### Player-facing goal

When a tactical mission is a **VIP rescue** and the player hands command to **Simulation AI**, the AI should behave like a coordinated rescue force instead of allowing every nearby fire team to converge on the same closest VIP.

A senior deployed AEGIS soldier should coordinate the initial rescue assignments so multiple marked VIPs are approached in parallel.

### Tactical coordinator selection

At AI takeover:

1. Consider living, deployed AEGIS soldiers who are still tactically available.
2. Select the **highest-ranked** soldier as rescue coordinator.
3. If multiple soldiers share that rank, prefer the soldier with the greatest **experience / XP**.
4. If a further deterministic tie-break is required, use existing stable service/order data rather than randomness.

This is a command-role decision only. It does not teleport the coordinator, create a new unit type, or require that the coordinator personally escort a VIP.

### One-fire-team-per-VIP distribution doctrine

At the beginning of AI control, collect the currently **marked, living, unresolved VIPs** and the fire teams available to perform rescue work.

The coordinator should issue distinct rescue objectives under these rules:

- Assign **one fire team to each marked VIP where possible**.
- Do not assign a second fire team to a VIP while another marked VIP remains completely unassigned and a free rescue-capable fire team exists.
- Prefer sensible path distance / reachability when pairing a team with a VIP, but **global assignment diversity takes priority over every team independently choosing the closest VIP**.
- Once assigned, a fire team should retain its VIP objective long enough to produce coherent movement rather than recalculating to the globally closest VIP every tactical step.
- A team may be reassigned when its VIP is rescued/extracted, killed, becomes invalid/unreachable, or when a higher-priority player/escort/combat rule legitimately overrides the rescue objective.
- If there are **more VIPs than available fire teams**, distribute the available teams across different VIPs first; remaining VIPs stay queued for reassignment as teams become free.
- If there are **more fire teams than marked VIPs**, assign one team per VIP first. Extra teams should remain available for security, alien engagement, escort support, reserve positioning, or reinforcement of a threatened rescue rather than automatically clumping on the nearest VIP.
- Existing escort-support decisions from the 1345 assignment board remain authoritative when a team is already escorting a civilian/VIP.
- Existing explicit player Command Map orders should remain higher authority than automatically generated rescue assignments.

### Streamed Simulation AI compatibility

This doctrine must work with the current streamed one-round AI architecture:

- Assignment state must be carried in the authoritative tactical continuation between streamed rounds.
- The one-round look-ahead must not forget team-to-VIP ownership and re-clump everyone on the next simulation batch.
- Manual-to-AI handoff, AI-from-start missions, pause/take-back-control, Command Map replans, and save/reload recovery must not duplicate or silently erase valid rescue assignments.
- Reassignment should occur only when the current assignment becomes resolved/invalid or an explicit higher-priority tactical rule requires it.

### Acceptance / Build Health coverage for the next patch

Add deterministic regression coverage for at least:

1. **Three marked VIPs + three available fire teams** -> three distinct team-to-VIP objectives.
2. **Two marked VIPs + four available fire teams** -> both VIPs receive one team before any duplicate rescue assignment is allowed.
3. **Four marked VIPs + two available fire teams** -> the two teams are assigned to different VIPs rather than both selecting the closest one.
4. **Coordinator selection** -> higher rank wins; equal rank is resolved by greater experience.
5. **Stream continuation persistence** -> assignments survive at least one streamed AI round/look-ahead boundary without collapsing back to nearest-target clumping.
6. **VIP resolved** -> its fire team becomes eligible for a new unresolved VIP or another valid tactical role.
7. **Player Command Map override** -> an explicit player order is not overwritten merely because the AI rescue coordinator has a default VIP assignment.

### Suggested patch focus

Bundle this with the next tactical-AI patch rather than treating it as a standalone UI feature. The same patch should also introduce the staged Alien Field Beacon knowledge/priority doctrine and Simulation AI grenade-use foundation. The implementation should reuse the existing fire-team, squad-leadership, civilian/VIP rescue, Command Map, escort-support, and streamed-AI state contracts wherever possible.

---

## Stage 3.5 — UI / Audio / Quality-of-Life Polish
Status: **Started / first pass built**

Completed / first pass:
- Music Track Selection / Auto Songs mode.
- Manual Song mode from the normal header.
- Manual Song mode from the minimized header.
- Better exposed music labels through the selector.
- Base downtime location visualization seed: individual soldiers can be represented on the base grid according to downtime activity and wounded status.
- Geoscape command-globe styling pass.

Still planned:
- Save music preference if playtesting confirms the selector behavior.
- Audio balance defaults.
- More consistent modal/button layouts.
- More responsive tactical/base panels.
- More card collapse refinements.
- Stronger Skyranger in-flight presentation that matches the rest of the command-interface aesthetic.
- Fuller live-base animation layer for soldiers moving through halls and rooms during downtime.

Recommended patch:
`BASE_ACTIVITY_ANIMATION_AND_SKYRANGER_FLIGHT_POLISH_INDEX_ONLY`

---

## Stage 4 — Campaign Completion
Status: **Foundation started**

Completed / first pass:
- Geoscape ticking time.
- UFO spawning.
- Radar detection.
- Interceptors.
- Aircraft ammo/upgrades.
- Save-compatible aircraft identity/readiness state.
- Named Skyranger/interceptor craft with launch/return/repair status.
- Light interceptor damage and clock-driven repair timers.
- Aircraft fuel/range readiness and clock-driven refueling.
- Cautious/Standard/Aggressive interception stance choices.
- Richer UFO evasion / air-combat event outcomes with stance-visible launch summaries and report lines.
- Compact air-combat after-action reports and damaged-UFO memory after damaged escapes.
- Crash-site incidents.
- Hidden command-site discovery gating.
- Base hallway/pathing foundation where hallways are represented by the grid lines around rooms, not by room tiles.
- Base invasion readiness helpers for entry points, traversable layout, containment reachability, and air-defense reduction.
- Air Defense Battery seed facility.

Still planned:
- Command Objectives Tracker.
- Alien escalation over months.
- Smooth Geoscape time-compression model where aircraft/UFO perceived speed scales with the selected clock rate without breaking real route duration, repair, refuel, or event timing.
- Base-centered radar range and contact-quality model where UFO detection depends on distance from each base's radar facilities.
- Geoscape overlay filter controls for showing/hiding radar and aircraft range rings around each existing base.
- Selected-base scoping for base-local screens such as Barracks, Squads, Hangars, Sickbay, Workshop/Base Stores views, and personnel/equipment readiness lists.
- Base-to-base transfer logistics for soldiers, weapons, armor, aircraft stores, and other portable equipment, with transfer time/cost and clear origin/destination state.
- UFO landing / terror-style incident chain where flying UFOs have mission intent and can touch down or complete operations that create ground incidents and panic consequences.
- Live alien research chain polish.
- Command-site assault rewards.
- Final mission path.
- Victory/defeat endings.
- Base invasion event chain.

## Stage 4B — Base Invasions / Facility Defense
Status: **Roadmapped / foundation started**

Design target:
- Larger alien ships can locate and land at a player base later in the campaign.
- Base invasions enter through the central Access Lift/elevator and through Hangars.
- The actual base layout directly determines the tactical/base-defense map.
- Hallways fit around the outside of facilities/rooms as the grid lines/gaps between room tiles and become the primary movement lanes.
- Soldiers physically present in the base respond from their current locations.
- Sickbay soldiers start with whatever equipment they currently have on them; stripped patients must reach a Barracks/Base Stores arms locker or pick up dropped weapons.
- Dropped human or alien weapons can be recovered during the defense.
- Soldiers can use alien weapons only after the relevant alien weapon research is completed in the Laboratory.
- If attackers reach Alien Containment, they can free captured aliens there, adding them to the attacking force.
- Air Defense Batteries can damage incoming ships, potentially driving them off or reducing how many attackers breach the base.
- Base Stores should function as arms/armor locker points for emergency rearming.
- The live downtime base view should eventually become the pre-invasion state: soldiers seen moving/resting/training in the base are the same soldiers who must react when the alarm hits.

Recommended staged implementation:
1. Expand hallway/base-grid rendering and connectivity rules, keeping hallways as the grid spaces around rooms.
2. Add persistent soldier base-location state and simple movement between downtime destinations.
3. Add base-defense tactical map generation from the real base grid.
4. Add invasion trigger rules from large alien craft and campaign escalation.
5. Add air-defense interception roll before breach.
6. Add emergency arming behavior from stores/barracks and dropped equipment.
7. Add containment breach/free-captive behavior.
8. Add mission report and council consequences for successful or failed base defense.

Recommended design: Stage 4 should focus on making the campaign finishable while building base invasion as the major late-campaign defensive threat.

---

## Stage 5 — Release Prep / Paid Alpha
Status: **Not yet started in earnest**

Planned:
- Tutorial/onboarding.
- Difficulty settings.
- Balance pass.
- Bug-fix pass.
- Itch.io page assets.
- Trailer GIFs/screenshots.
- Store copy.
- Alpha release packaging.
- Basic analytics or feedback collection if appropriate.
- Known issues list.
- Control/help screen.
- First-run player guidance.

---

# 14. Next Recommended Patch

## Immediate Recommendation
First validate browser build 0139 against the supplied slot-10 export without overwriting it. Confirm Fort Aegis can select a staged Skyranger response through S. America, that the S. America hangar is available after Saber One has departed, and that Saber One keeps its Fort Aegis return reservation. Then complete the paired native 0010/browser 0138 medical gate: exact Medkit issue/return stock, 12-HP/12-TU treatment, one-charge consumption, final-HP wound duration, strategic-midnight recovery, KIA ownership, and imported-copy source isolation.

In a mandatory civilian-rescue incident, hand AI Command the live battlefield after the last alien dies or just before AI kills it. Confirm AI enters secure rescue, searches for unrevealed survivors, preserves existing escort chains, reports rescued/required progress, and extracts enough civilians before victory. Confirm an impossible requirement still resolves and an exhausted bounded rescue does not falsely mark surviving soldiers KIA. Then trigger a UFO speed prompt while working in Base, Soldiers, Research, Workshop, and Missions; choose a speed and confirm the same command section remains open while time advances. Repeat from an in-progress incident and confirm the battlefield remains active until the deferred speed applies after battle.

Manually listen to several base-computer announcements and confirm the stronger effect remains intelligible and suitably computer-like. Complete an AI-controlled incident and confirm the final soldier phrase plus trailing static finish before `all_aboard` or the first return-flight pilot phrase begins. Confirm the static bookends do not clip consonants or overpower quiet soldier takes at low and high Sound Effects volume.

Load the same Urban District save used for the supplied screenshots without overwriting it. At Near and Close zoom, compare the tan center-right region, dark terrain bands, buildings, Skyranger, soldiers, props, and map-edge cells in 2D and `3D Iso`; confirm each region occupies the same hex coordinates and no repeating black junction triangles remain. Repeat the affected high-threat Port Attack in Performance mode.

In a live tactical battle, empty a ballistic magazine, click Reload, immediately fire, and confirm the shot uses the restored magazine and post-reload TU. Reduce a soldier below Burst cost but keep at least 14 TU, click Burst then Single, and confirm the Single shot resolves instead of reporting Burst's TU requirement. Also confirm the selected-soldier extraction readout updates as civilians form, follow, hold, panic, and extract.

Repeat the exact affected high-threat Port Attack in safe 2D. If it still stalls, use `TACTICAL_AI_TURN_CHUNKING_AND_2D_DOM_VIRTUALIZATION_INDEX_ONLY` with phase timings before changing outcomes. If performance and the new status feedback are stable, continue `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY` as the next bounded tactical slice.

Focus verification on:
- Build New Base placement showing dotted ferry links from the proposed new site to existing bases when current aircraft can fly the one-way leg.
- Ferry-link text naming connected bases, one-way distance, and whether Interceptors, Skyrangers, or both can make the ferry trip.
- Moving the proposed site updating both the aircraft reach rings and the ferry-link connections.
- Existing base-placement confirmation behavior remaining visible and usable.
- Build Health including `New-base placement previews dotted aircraft ferry links`.
- UFO Tracking showing the Ferry / Refuel Staging readout without crowding the existing aircraft/radar controls.
- Selected incidents producing a Skyranger staging preview when a ready Skyranger, open staging hangar, and valid final round trip exist.
- Detected UFOs producing an interceptor staging preview when a ready interceptor, open staging hangar, and valid final round trip exist.
- One-way ferry legs allowing a craft to reach a staging base farther than a normal round-trip sortie would allow.
- Final staging-base-to-target legs still requiring refueled round-trip range/fuel back to the staging base.
- Closed/occupied hangars blocking staged-route readiness.
- Build Health including `Aircraft ferry staging checks open hangars and refuel legs`.
- Mission launch confirmation naming the selected Skyranger, launch base, round-trip distance, and fuel commitment.
- Mission launch confirmation showing response-force weapon/armor state plus local launch-base stock/issued/in-transit messaging.
- Barracks showing a clear selected-base empty state when no local weapons/armor can be equipped.
- Build Health including `Mission confirmation explains local loadout and launch base`.
- Barracks equip buttons showing only weapons/armor stocked at the selected base.
- Equip button labels naming the selected base as the stock source.
- Equip tooltips explaining local stock, issued gear, and in-transit gear counts.
- Switching bases changes the available equip buttons to that base's local stores.
- Build Health including `Base-local loadout buttons only advertise selected-base stock`.
- Logistics Center appearing on the selected base when inbound/outbound soldier or equipment transfers exist.
- Logistics Center rows showing direction, payload, origin, destination, ETA, fee-paid text, no-refund text, and cancel actions.
- Quartermaster equipment transfer controls offering 1, 5, and All payload choices when local stock allows.
- Bulk equipment transfer fees scaling from payload quantity and handling size.
- Build Health including `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Soldier transfer buttons showing ETA and logistics fee.
- Equipment transfer buttons showing transfer fee in Quartermaster/Base Stores.
- Transfers blocking when funds are below the required logistics fee.
- In-transit soldiers and equipment showing cancel actions that return the payload to the origin base with no refund.
- Canceled soldiers/equipment becoming available again at the origin base.
- Build Health including `Base transfer logistics charge fees and cancel back to origin`.
- Dragging the Geoscape globe after aircraft travel has occurred, including after Skyranger and interceptor sorties.
- Confirming the globe reads as a solid Earth-style map while keeping the more detailed hologram-era continent/island shapes.
- Build Health including `Solid Geoscape globe uses detailed landmasses and remains draggable`.
- First-base setup showing `Prairie Abduction` and `Red River Signal` before confirmation.
- The dotted first-base setup rings showing starting Shortwave Radar coverage, Interceptor practical reach, and Skyranger practical reach.
- The opening-crisis coverage summary showing both opening incidents inside the default North America starting Skyranger radius.
- First base confirmation carrying those same two incidents into the main Geoscape.
- Build Health including `First-base selection previews opening incidents and starting reach`.
- Workshop build orders showing and preserving their intended destination base.
- Completed Workshop items appearing in the destination base's local stores even if another base is selected when time advances.
- Workshop stock display reflecting the currently selected base's manufactured stock.
- Quartermaster/Base Stores showing compact inbound/outbound equipment logistics for the selected base.
- Quartermaster availability lines distinguishing local stock, issued gear, and in-transit gear.
- Build Health including `Workshop production preserves destination base and equipment logistics summaries`.
- `index.html` remaining the playable artifact after the source-layout scaffold.
- `src/manifest.json`, `src/engine-port-contract.md`, and `tools/check-aegis-build.cjs` staying aligned with the current build label.
- The dependency-free build seam checker passing.
- Build Health including `Modular source layout and engine-port prep contract is present`.
- Successful missions adding alien bodies/materials/equipment to the returning Skyranger base's local stores.
- KIA recovered equipment returning to the correct local base stores.
- Legacy aggregate `gearInventory` still reflecting recovered stock for compatibility.
- Wrong-base local stores remaining isolated after mission recovery.
- The Time Control funds line rendering without stray encoding characters before `Funds`.
- Load / Save Menu using a real icon path rather than fragile inline symbol text.
- Build Health including `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
- Geoscape Clock modes showing Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- The active clock mode displaying a readable compression/rate label.
- Aircraft/UFO visible progress feeling faster at higher compression while still completing from elapsed Geoscape minutes.
- Repair, refuel, delayed crash, UFO movement, and mission timers remaining clock-based under every compression mode.
- Tactical/manual mission states, council slides, and blocking modal states still stopping automatic time flow.
- Build New Base placement mode showing dotted aircraft reach rings centered on the proposed site.
- Interceptor and Skyranger current practical reach rings matching the aircraft range profile.
- Fuel tank upgrade preview rings appearing only when the relevant tank upgrade is not already owned.
- The New Base Site summary explaining dotted aircraft reach values near the confirm controls.
- Base construction still creating the expected Access Lift seed layout after using the preview.
- New campaigns showing one Shortwave Radar in the starting base.
- UFO Tracking coverage showing one shortwave radar counted at campaign start.
- Expansion bases still starting with only the free Access Lift layout.
- Fort Aegis and N. Africa both listing ready Skyrangers while a Fort Aegis squad launches from the Fort Aegis Skyranger to an in-range incident.
- Mixed-base response forces producing a blocker that names which soldiers are stationed away from the selected launch base.
- UFO Tracking listing only contacts that are detected/known or currently inside radar range.
- Shortwave Radar showing local/regional coverage while Longwave Radar reaches farther strategic contacts.
- Per-contact radar text naming the detecting base/radar source and contact quality.
- Overlapping radar coverage improving contact quality/detection chance in Build Health.
- UFO Tracking showing mission intent/risk once contact quality is strong enough.
- Active UFOs sometimes completing operations into landed/terror-style incidents instead of only escaping.
- Crash-site incidents staying distinct from landed/terror-style incidents.
- Damaged or disrupted UFOs delaying/downgrading later ground incident threat/panic.
- Build Health including the new `UFO mission intents can create landed terror incidents` row.
- Geoscape Range Overlays controls toggling Shortwave, Longwave, Interceptor, Skyranger, and All Off.
- Dotted/dashed base-centered overlay rings staying visually distinct from new-base placement preview rings.
- Aircraft overlay reach updating from Interceptor Drop Tanks and Skyranger Extended Tanks.
- Squads screen available-soldier list showing only soldiers stationed at the selected squad's base.
- Same-base soldiers still appearing as assignable and wrong-base soldiers being hidden/blocked.
- Build Health including `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.
- Barracks showing soldiers stationed at the currently selected base only.
- Sickbay showing wounded/recovering soldiers stationed at the currently selected base only.
- Transfer buttons appearing on ready Barracks soldiers when more than one base exists.
- Transferred soldiers appearing in Personnel Transfers, becoming unavailable while in transit, and arriving after Geoscape clock time advances.
- In-transit soldiers being blocked from squad assignment and mission launch.
- Build Health including `Base-local rosters and soldier transfers keep personnel available only at their base`.
- Interceptor Tanks and Skyranger Tanks cards appearing in UFO Tracking beside aircraft ordnance.
- Interceptor Drop Tanks installing for $320k and raising Interceptors to 135 fuel / 10,500km practical range.
- Skyranger Extended Tanks installing for $440k and raising Skyrangers to 130 fuel / 20,800km practical range.
- Old saves normalizing missing tank flags safely.
- Saves with tank flags applying upgraded range/fuel values to existing aircraft during load/migration.
- Newly ordered Interceptors or Skyrangers inheriting the purchased global tank upgrade.
- Longer sorties becoming possible only when upgraded range/fuel actually supports the route.
- Refueling still advancing automatically through Geoscape clock time with no funds or Base Stores requirement.
- Latest Air Combat report card appearing in UFO Tracking after an interception.
- Per-contact Last air contact details appearing after damaged escape, contact lost, evasive maneuvers, forced disengage, ammunition pressure, or breakaway.
- Damaged Escape UFOs showing damaged-memory follow-up hit bonus and delayed crash chance.
- Damaged UFOs sometimes creating delayed crash sites as Geoscape clock time advances.
- Existing saves or playtest states with interceptors stuck in `Outbound` / `Returning` recovering into a short Repairing window instead of staying permanently unusable.
- Active interceptor flights showing `Outbound` before the attack leg and `Returning` after the attack leg.
- Grounded recovered interceptors gaining fuel again when Geoscape time advances.
- Interceptor launches showing richer outcomes, hit estimate, combat roll, evasion pressure, fuel cost, launch base, and clock-based ETA.
- UFO Tracking showing hit estimate and evasion pressure while still respecting range/fuel/base readiness.
- Outcomes such as Confirmed Shootdown, Damaged Escape, Contact Lost, Forced Disengage, Ammunition Pressure, and Breakaway appearing clearly in practical play over several launches.
- Old saves normalizing a valid aircraft fleet with fuel/range fields.
- Starting hangars showing named Skyranger/interceptor fuel, range, readiness, repair, and refuel state.
- Multi-base campaigns where interceptors stationed in a newer base can intercept nearby UFOs even when the first base is out of range.
- Multi-base campaigns where Skyranger mission launch originates from the Skyranger's assigned base and blocks squads whose soldiers are stationed elsewhere.
- Interceptor ready count and fuel dropping on launch, then recovering after return/repair/refuel.
- Repair and refuel timers advancing only through Geoscape clock time.
- Skyranger mission launch/return still using the clock-based travel contract.
- New-base placement mode showing the name field, selected site summary, cost, and confirm button immediately above the Geoscape globe.
- Build Health passing all checks in browser.

## Best Next Feature Patch
If this batch tests well, continue with the next priority roadmap patch:

`STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`

Suggested focus:
- Fix staged interceptor visual semantics so arrival at a friendly staging base is shown as a landing/refuel/turnaround, not as an attack impact or base explosion.
- Separate friendly ferry/refuel phase effects from hostile UFO attack/interception effects in Geoscape rendering, event text, sound cues, and action logs.
- Preserve the current staged-interceptor reach/launch behavior, but make each route phase readable: home-base takeoff, ferry leg, staging-base landing, refuel timer, final attack launch, UFO attack, return-to-staging-base, and post-attack decision.
- When the player chooses to return home after a staged interception, show the interceptor retracing the planned ferry route through valid refuel stops instead of disappearing or snapping home.
- If the UFO survives and the interceptor returns to the staging base, keep the prompt to attack again or ferry back home, but make the aircraft's current base/status/readiness match the visible route phase.
- Keep direct interceptor launches, direct Skyranger launches, staged Skyranger travel, fuel tank upgrades, assigned-base range checks, local rosters/stores, transfer logistics, and save compatibility intact.
- Add Build Health coverage for friendly staging-base arrival using non-combat effects, no base-destruction/attack text on refuel stops, post-intercept return-to-staging-base, return-home route replay through ferry legs, and no-regression direct aircraft travel/repair/refuel.

## Near-Term First Base Placement Planning Candidate
Implemented in `v0.26.07.10.0020_FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY_PATCH`; keep this section as the reference contract for future first-base story/onboarding polish:

`FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`

Suggested focus:
- Seed the first two alien incidents before first-base confirmation and show them on the same world map the player uses to choose the starting base.
- Position those first two incidents so one well-placed starting base can respond to both with the starting Skyranger.
- Show dotted starting-site preview rings for Interceptor practical reach, Skyranger practical reach, and starting Shortwave Radar coverage.
- Use the opening incidents to make first-base placement feel like the world governments' direct response to the first alien crisis.
- Keep the first-base confirmation flow stable and readable.
- Add Build Health coverage for visible opening incidents, reachable first crises, preview ring values, inactive-state hiding, and no-regression first-base confirmation.

## Near-Term Aircraft Ferry / Refuel Staging Candidate
Planned as a future Air War and multi-base logistics patch:

`AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY`

Suggested focus:
- Allow Skyrangers and interceptors to ferry to another owned base as an intermediate staging/refuel stop when the destination base has an available compatible hangar.
- Treat base-to-base ferry legs as one-way legs that only need enough fuel/range to reach the next friendly base, because the aircraft will refuel there before continuing.
- Do not require a craft to have enough fuel for a full home-base round trip when it is transiting between owned bases; this effectively lets staged aircraft extend their operational reach by chaining valid base-to-base legs.
- Once an aircraft leaves the last friendly staging base for a mission site or UFO interception, require enough practical fuel/range to complete the outbound leg and return to that last staging base.
- After the sortie, aircraft should either remain at the last staging base until ordered home or retrace the planned staging route home through valid refuel stops, with each return leg advancing on Geoscape clock time.
- Friendly staging-base arrival must never reuse hostile attack/explosion presentation. It should show landing, hangar reservation/occupancy, refuel/turnaround progress, and clear action text so players understand the base is helping the aircraft rather than being attacked.
- Return-home after a staged interception should visibly replay the reverse ferry path from the staging base to the original home base, including travel time and refuel stops where needed, instead of teleporting or silently resetting the aircraft.
- Track hangar occupancy/reservations so a forward base cannot accept more staged aircraft than it can physically house.
- Keep ferry, refuel, turnaround, mission launch, interception, return, and optional return-home legs tied to Geoscape clock time.
- Let a Skyranger from a farther base carry its own stationed squad to a forward base, refuel, and then launch alongside a local Skyranger for the same incident when both routes and hangars are valid.
- Preserve squad stationing clarity: soldiers remain associated with the Skyranger/base they boarded from unless a later transfer or cross-base task-force system explicitly changes that.
- Let interceptors stage through forward bases to attack UFOs that are outside their direct home-base range, with the same fuel, damage, repair, and after-action rules used by normal interceptions.
- Surface route-leg planning clearly in Geoscape and aircraft readiness UI: home base, staging base, one-way ferry reach, final sortie round-trip reach from the last staging base, hangar blocker, refuel ETA, launch window, return-home/stay-staged choice, and combined response readiness.
- Preserve existing direct-launch behavior, fuel tank upgrades, assigned-base range checks, base-local rosters/stores, Skyranger stationing, interceptor selection, transfer logistics, and old-save compatibility.
- Add Build Health coverage for ferry-to-base creation, one-way base-to-base range validation, final sortie round-trip validation from the last staging base, hangar availability/reservation blockers, refuel timing at staging base, staged Skyranger incident launch, staged interceptor launch, in-range-after-staging validation, route-home/refuel-stop handling, return-home/stay-staged handling, old-save normalization, and no-regression direct aircraft travel/repair/refuel.

## Near-Term Staged Sortie Route UI / Return-Home Fix
Future bugfix and polish patch:

`STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`

Observed issue:
- During a staged interceptor sortie, the craft can appear to attack or blow up the friendly destination/staging base when it reaches that base for refueling, then continue on to the UFO after refuel completes.
- After the interception, the interceptor may not visibly return along the ferry route back to its original home base.

Suggested focus:
- Give route phases explicit presentation modes such as `friendly-ferry`, `friendly-landing`, `refuel`, `hostile-intercept`, `return-to-staging`, and `return-home-ferry`.
- Ensure friendly base arrival cannot trigger attack, explosion, combat, UFO impact, or base-damage visual/audio/text effects.
- Show a clear landing/refuel state at the staging base before the final attack leg begins.
- If the UFO survives, return the interceptor to the last staging base and ask whether to attack again or ferry home.
- If the player chooses ferry home, visibly fly the reverse route through each ferry/refuel leg back to the original base, preserving clock-based travel time and aircraft status.
- Keep aircraft `baseId`, `hangarKey`, status, fuel, repair, and current-route state aligned with what the player sees on the Geoscape.
- Add Build Health coverage for no friendly-base attack visuals, staging-base refuel presentation, post-attack return-to-staging, player choice to attack again, player choice to ferry home, reverse-route travel display, and no-regression direct interceptor/Skyranger sorties.

## Near-Term Base-Local Equipment Logistics Polish
Implemented in `v0.26.07.10.0005_BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY_PATCH`; keep this section as the reference contract for future logistics polish:

`BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`

Suggested focus:
- Give workshop orders an explicit production/base destination instead of implicitly using the selected base at day-end.
- Surface equipment transfers in a compact Logistics/Transfers summary so players can review inbound and outbound payloads without opening each item card.
- Add a confirmation screen before starting any equipment transfer. The confirmation should name the origin base, destination base, item, quantity, logistics fee, travel time/ETA, and the fact that the gear will be unavailable while in transit.
- Tighten mission loadout messaging so local base stock, issued gear, and in-transit gear are easy to distinguish before launch.
- Consider transfer costs and transfer cancellation rules after the core flow is playtested.
- Preserve global access for Mainframe/research database/alien intel/reports/memorial records.
- Add Build Health coverage for workshop destination stock, transfer UI summaries, local loadout messaging, old-save normalization, and no-regression soldier transfers / Skyranger stationing.

## Near-Term Modular Source Layout and Engine-Port Prep
Implemented in `v0.26.07.09.0045_MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future source extraction:

`MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY`

Suggested focus:
- Introduce a build-friendly source layout while preserving `index.html` as the playable distribution artifact.
- Split future work into clear source areas such as data definitions, simulation systems, UI panels, Build Health tests, and asset manifests.
- Keep the current single-file game runnable during the transition by generating or manually syncing the production `index.html` from the organized source.
- Create a lightweight contract for future Godot 4 migration: data-driven game state, deterministic simulation helpers, explicit UI adapters, and JSON-friendly campaign/save structures.
- Move no risky gameplay systems during the first pass; start with extracted constants/helpers/tests or a documented build harness if that is the safest step.
- Preserve save compatibility, current browser deployment, and localhost Build Health behavior.
- Add Build Health/static checks that prove the generated/playable `index.html` contains the expected build label and key systems after any source organization step.

## Near-Term Mission Recovery Local Stores Fix
Implemented in `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future mission-recovery expansion:

`MISSION_RECOVERY_TO_LOCAL_BASE_STORES_INDEX_ONLY`

Suggested focus:
- Route successful mission recovery loot into the Skyranger's return-base local `baseInventories`, not only the legacy aggregate `gearInventory`.
- Preserve old-save compatibility by keeping aggregate `gearInventory` synchronized or derivable from local base stores where older systems still read it.
- Recovered alien remains, alien weapon fragments, alien power cells, live aliens, and KIA soldier equipment should appear in the local stores of the base that actually received the returning Skyranger.
- Mission reports should continue to list recovered materials, but the Quartermaster/Base Stores screen should also visibly reflect the recovered stock at the correct base.
- Keep crash-site recovery, landed/terror incident recovery, alien containment handling, known alien unlocks, and research/autopsy prerequisites intact.
- Add Build Health coverage for successful mission alien-body recovery, alien equipment/material recovery, local return-base stock updates, legacy `gearInventory` compatibility, KIA equipment recovery to the return base, wrong-base stock isolation, and no-regression base-local equipment transfers.

## Near-Term UI Text Encoding and Icon Cleanup Candidate
Implemented in `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future text/icon sanitation passes:

`UI_TEXT_ENCODING_AND_ICON_SANITATION_INDEX_ONLY`

Suggested focus:
- Sweep the single-file build for mojibake / garbled encoding artifacts such as U+00C2, U+00E2, U+00C3, replacement characters, or broken currency/icon text.
- Clean up visible odd characters like the stray encoded currency marker before `Funds`; replace with the intended icon component where appropriate, or use plain readable text if an icon is not useful.
- Prefer existing `Icon` / `ICONS` usage for former inline-symbol UI markers so future encoding passes are less fragile.
- Check high-visibility UI surfaces first: Time Control header, Geoscape panels, mission reports, Quartermaster/Base Stores, build/transfer summaries, aircraft readiness, and modal confirmations.
- Preserve intentional ASCII abbreviations, version strings, save keys, and player-facing content that is already rendering correctly.
- Add Build Health coverage or static seam checks for disallowed mojibake markers in rendered/static UI text, plus a targeted check that the Time Control funds label renders cleanly.

## Near-Term Starting Base Upgrade Candidate
Implemented in `v0.26.07.06.0155_STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY_PATCH`; keep this section as the reference contract for any future starting-base template adjustments:

`STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY`

Suggested focus:
- Add one Shortwave Radar to the default Fort Aegis starting layout.
- Keep newly constructed expansion bases seeded only with their intended starter facilities unless a later base-template system changes this.
- Preserve the existing starting hangar layout and avoid crowding or overlapping the base grid.
- Ensure radar detection/coverage calculations count the seeded Shortwave Radar.
- Surface the starting radar clearly in Base Facilities and any radar-readiness summaries.
- Add Build Health coverage for first-base facility seeding, old-save normalization, radar count/detection coverage, and no-regression base construction behavior.

## Near-Term Base Placement Planning Candidate
Implemented in `v0.26.07.06.0165_BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY_PATCH`; keep this section as the reference contract for future base-placement planning overlays:

`BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY`

Suggested focus:
- While Build New Base placement mode is active, show dotted circular range overlays centered on the proposed new base site.
- Future extension: mirror this range-preview behavior on the beginning first-base selection screen via `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`.
- Use the existing aircraft range profiles so the player can see practical Interceptor and Skyranger reach before confirming construction.
- Show separate dotted circles for current Interceptor and Skyranger reach, plus upgraded fuel-tank preview rings when those upgrades are not already purchased.
- Keep the overlay lightweight and readable on the Geoscape globe: thin dashed/dotted rings, restrained colors, and no large opaque coverage fills.
- Update the selected-site summary to explain what the dotted circles represent, including approximate radius/range values.
- Preserve current base-placement confirmation behavior, construction cost, validation, and save compatibility.
- Add Build Health coverage for placement-mode range preview state, range values matching aircraft profiles/upgrades, no overlay when placement mode is inactive, and no regression to new-base construction.

## Near-Term Radar Model Candidate
Implemented in `v0.26.07.07.0140_BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY_PATCH`; keep this section as the reference contract for future radar polish:

`BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`

Suggested focus:
- Give each base radar facility a detection radius from that base's geoscape location.
- Make Shortwave Radar a local/regional detection source and Longwave Radar a wider strategic detection source.
- Replace or supplement the current global radar coverage score with distance-based per-UFO coverage from eligible bases.
- Let overlapping radar fields improve detection chance, tracking speed, contact quality, or intercept solution accuracy.
- Track contact quality states such as Faint Echo, Tracked Contact, and Precise Fix before a UFO becomes fully actionable.
- Surface which base/radar network is detecting or tracking each UFO in UFO Tracking.
- Keep old saves compatible by deriving radar coverage from existing base facilities.
- Add Build Health coverage for distance-based detection, out-of-range UFO invisibility, overlapping coverage bonuses, Shortwave vs Longwave range differences, contact-quality progression, old-save normalization, and no-regression interceptor launch behavior.

## Near-Term Geoscape Overlay Filter Candidate
Future patch candidate:

`GEOSCAPE_RANGE_OVERLAY_FILTERS_INDEX_ONLY`

Suggested focus:
- Add a compact Geoscape overlay/filter control that lets the player choose which base-centered rings are visible.
- Ring options should include Shortwave Radar range, Longwave Radar range, Interceptor practical reach, Skyranger practical reach, and an All Off state.
- Rings should render around existing bases, not only proposed new-base sites.
- Use dotted or dashed lightweight circles with restrained colors so overlays help planning without covering the globe.
- Respect aircraft fuel tank upgrades when showing current Interceptor and Skyranger practical reach.
- Make the control persistent/save-compatible if possible, but safe to default to a readable setting for old saves.
- Keep base-placement range preview behavior intact; placement-preview rings and existing-base overlay rings should not visually fight each other.
- Add Build Health coverage for overlay filter state, per-ring visibility, upgraded aircraft range values, radar ring values, all-off hiding, and no-regression base-placement preview behavior.

## Near-Term Multi-Base Scope and Transfers Candidate
Future patch candidate:

`BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`

Suggested focus:
- Base-local screens should show information for the currently selected base when the data is physically local to a base.
- Barracks should list only soldiers stationed at the selected base, with clear counts for other bases.
- Squads should only assign soldiers stationed at the selected base unless a future explicit cross-base task force mode exists.
- Sickbay should show wounded soldiers at the selected base; global memorial/history views can remain shared.
- Hangars should show aircraft housed at the selected base and preserve assigned-base launch logic.
- Base Stores / equipment views should separate local stock from globally shared knowledge. Mainframe, research database, alien intel, reports, and memorial records remain globally accessible.
- Add base-to-base transfers for soldiers and portable equipment such as weapons, armor, medkits, recovered materials, and aircraft ammunition where appropriate.
- Transfers should have origin base, destination base, item/person payload, travel time, optional cost, and clear in-transit status.
- Starting a soldier or equipment transfer should require a confirmation modal before the payload leaves the base. The modal should clearly summarize who/what is moving, origin, destination, ETA, fee, refund/cancellation rules, and operational consequences such as soldiers being unavailable for squads or gear being unavailable for loadouts.
- Soldiers in transit should be unavailable for squads/missions until they arrive.
- Equipment in transit should be unavailable at both origin and destination until arrival.
- Preserve save compatibility by normalizing older soldiers/equipment into the selected/first base if no base-local state exists.
- Add Build Health coverage for selected-base roster filtering, wrong-base squad assignment blocking, transfer confirmation, transfer creation, in-transit unavailability, arrival at destination, equipment stock movement, old-save normalization, and no-regression Skyranger stationing behavior.

## Near-Term Geoscape Time Candidate
Implemented in `v0.26.07.06.0175_SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY_PATCH`; keep this section as the reference contract for future time-control polish:

`SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY`

Suggested focus:
- Replace the chunky tick-feeling Geoscape controls with smoother time compression modes inspired by X-COM: Pause, 5 Seconds, 1 Minute, 5 Minutes, 30 Minutes, 1 Hour, 6 Hours, and 1 Day.
- Keep simulation authoritative in elapsed Geoscape minutes while using a consistent one-second real-time cadence for automatic advancement.
- Make perceived aircraft/UFO speed visibly scale with selected time compression: fast time should make craft progress faster, slow time should make them creep.
- Preserve current route duration math, fuel use, repair, refuel, UFO progress, delayed crash, Skyranger travel, and interceptor return timing.
- Pause or slow time automatically for important prompts such as new radar contact, mission landing/terror incident, interception result, crash site, base invasion warning, or council-critical event.
- Surface the active time scale clearly near the Geoscape clock without making the interface feel like an End Day/End Month button stack.
- Add Build Health coverage for time-scale conversion, route progress scaling, clock-accurate travel completion, repair/refuel progression, UFO movement progression, and no-regression tactical/modal clock blocking.

## Near-Term Campaign Escalation Candidate
After fuel tanks, the starting radar seed, smoother Geoscape time, and base-centered radar range, consider:

`UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`

Suggested focus:
- Give active UFOs a simple mission intent such as Recon, Abduction, Terror Raid, Harvest, Base Scout, or Supply.
- Let some UFOs land or complete their operation when flight progress reaches a threshold instead of only escaping.
- Generate a ground incident from that UFO's size, region, alien type, mission intent, and detection state.
- Keep crash sites separate from landed/terror incidents: shootdowns create crash sites, while missed/ignored operations create alien activity incidents.
- Add panic/funding consequences for ignored terror-style incidents and smaller consequences for lesser operations.
- Let successful interception prevent, delay, downgrade, or alter the incident depending on outcome.
- Surface UFO mission intent and landing/operation risk in UFO Tracking once enough radar contact is available.
- Add Build Health coverage for UFO mission intent normalization, landing incident generation, panic consequences, interception prevention/downgrade, old-save compatibility, and no-regression air travel/damage behavior.

---

# 15. Codex Implementation Guidelines

## General
- Work inside `index.html` unless explicitly adding assets.
- Preserve existing functions and tests.
- Avoid large rewrites when a targeted patch is safer.
- Keep save/load backward compatible.
- Defensive coding: handle missing fields on old saves.
- Prefer small helper functions over duplicating logic.
- Keep UI copy short and readable.

## Testing
After changes:
1. Run JavaScript syntax check on inline scripts.
2. Run Build Health in browser if possible.
3. Verify version label.
4. Verify no console errors on load.
5. Verify save/load still works.
6. Verify old saves do not crash if new fields are absent.

## Save Compatibility
When adding fields to soldiers, squads, memorial entries, facilities, or campaign state:
- Default missing values on read.
- Avoid assuming every soldier has new arrays/maps.
- Add migration/normalization helper when needed.
- Do not break existing exported saves.

## UI Safety
- Do not make cards taller unless collapsible.
- Avoid buttons shifting during repeated interactions.
- Use internal scroll areas for variable-length content.
- Keep mobile/narrow width pressure in mind.
- Keep focus rings visible.

## Narrative Text
- Keep memorial/service note text concise.
- Prefer specific details over generic praise.
- Use actual available game data when possible:
  - friend name
  - squad name
  - mission count
  - kills
  - wounds
  - shared downtime activity
  - specialization
  - rank

---

# 16. Open Design Questions

These are not blockers, but should be kept in mind.

1. How much should the player directly control soldier downtime vs broad guidance?  
   Current direction: broad guidance, not micromanagement.

2. Should friendships ever create negative effects beyond grief?  
   Possible future: panic, refusal, rivalry, overprotectiveness.

3. Should squad cohesion affect tactical outcomes visibly?  
   Current direction: yes, but it needs clear UI/event-log explanation.

4. Should the campaign be made finishable before adding more life-sim detail?  
   Recommended answer: yes, while using base-invasion/downtime visualization work as systems that support campaign escalation.

5. Should the HTML version stay the paid alpha, with Godot saved for a sequel?  
   Current direction: yes.

6. How tactical should base invasions become in this HTML version?  
   Current direction: use an X-COM-style base-defense model, but stage it carefully: visual base pathing first, then map generation, then invasion combat.

---

# 17. One-Paragraph Codex Summary

Alien Response Command / Project Aegis is a single-file HTML X-COM-like strategy game focused on base management, tactical alien response, and soldier attachment. The current build is `v0.26.06.10.0300_BASE_ACTIVITY_ANIMATION_AND_INVASION_MAP_SEED_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH`, which corrects hallways to be textured grid-line/gap spaces around facilities rather than buildable room tiles, adds `assets/base_tiles/hallway.png`, keeps the Air Defense Battery seed facility, base-invasion readiness helpers, persistent soldier base-location state, Live/Static downtime movement markers in the Base view, Base Defense Preview seed panel, a geoscape command-globe styling pass, tagged relationship-aware memorial offerings, 200-item/281-handwritten-message memorial expansion content plus a 3,500-message fallback library, Buddy/Friend/Close Friend/Deep Bond offering tiers, object-matched memorial messages, separated Rec Room/Training Center activity tastes, rivalry/dislike relationship suppression, and future parked Rec Room/Training Center minigame scope. Stage 1 is complete. Stage 2 soldier-life systems are built through Stage 2.8 pending playtest confirmation. Stage 3/3.5 UI/audio/tactical polish is in progress. Stage 4 campaign completion now includes a clear base-invasion roadmap where real base layout, hallway-grid movement, Access Lift, Hangars, Sickbay gear state, Base Stores arms lockers, Alien Containment breaches, air defense, and alien weapon research all matter. Maintain index-only patching, matching displayed version/build zip names, save compatibility, Build Health coverage, and stable UI layouts.

## 2026-06-10 Patch Notes - Base Time Alerts and Geoscape Interceptor Visuals

Build `v0.26.06.10.0310_SICKBAY_BASE_TIME_AND_GEOSCAPE_INTERCEPTOR_VISUALS_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` adds the next strategic-map and base-life pass:

- Fixed forced-Sickbay mission return exploit: a wounded or overflow-recovering soldier who is forced onto a mission and comes back alive without new wounds keeps their prior wound/recovery status instead of becoming fully healed.
- Base view now auto-selects 5-minute geoscape ticks when opened so live soldier movement can be watched at a useful cadence.
- Base downtime movement now advances on geoscape clock ticks, giving soldiers visible movement between current and destination base locations instead of only updating during daily downtime resolution.
- Personnel arrivals for ordered soldiers, scientists, and engineers now raise a time-control alert so the player can pause or switch to 5m/30m/1h before updating squads, research, or workshop orders.
- Newly detected UFO contacts now raise the same kind of time-control alert for UFO tracking/interception decisions.
- Tracked UFOs now drift across the geoscape as time advances instead of staying pinned to their original contact point.
- Geoscape clouds now get a fresh visible offset and slide direction on time ticks, avoiding the repeated same-position reset.
- Interceptor launches now create a temporary geoscape attack run using one to four visible interceptor craft, with weapon-fire visuals based on the available aircraft weapon set.
- Build Health coverage expanded for Sickbay mission returns, Base auto-speed, arrival/contact prompts, tick-based movement, moving UFOs, and interceptor formation payloads.

Roadmap follow-up: continue evolving interception from a visual attack run into a fuller air-combat layer with travel time, return-to-base handling, interceptor damage/repair, fuel/range, pilot/aircraft identity, and richer UFO evasive behavior. Keep the current geoscape visuals as the first readable layer before adding deeper tactical air combat.

## 2026-06-10 Patch Notes - Interceptor Return, Crash, Cloud, and Base Doll Motion

Build `v0.26.06.10.0320_INTERCEPTOR_RETURN_CRASH_CLOUD_AND_BASE_DOLL_MOTION_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` refines the geoscape and Base activity presentation:

- Interceptor attack runs are slowed down from the initial fast pass; they remain faster than Skyrangers but give the player time to read the launch, approach, firing pass, and return/crash result.
- Missed interceptor attacks now make the firing pass and return to base before the interceptors become available again.
- Successful interceptor attacks now show a small explosion and crashing UFO effect at the target.
- UFO tracking alerts now route the player to Geoscape after they choose a time speed, so interceptor launch controls are immediately available.
- Cloud movement now uses independent per-cloud offsets and headings instead of locking all clouds into the same relative formation.
- Clouds continue drifting during pause; time ticks refresh the cloud seed, but pause itself no longer requires clouds to jump.
- Base activity markers now use miniature soldier paper-dolls with initials overlaid, plus small idle movement while soldiers are on station in a room.
- Wounded soldiers now prefer the same Sickbay destination until the notional room capacity fills, preventing two wounded soldiers from being spread across two Sickbay rooms unnecessarily.
- Build Health coverage expanded for Sickbay grouping, cloud independence, idle Base marker motion, and UFO prompt routing.

Roadmap follow-up: continue improving air combat readability with hit/miss timing, damage states, interceptor return/repair state, and eventual interception tactical choices. Continue improving Base life by moving paper-doll markers toward hallway-aware overlays and room-specific idle animations.

## 2026-06-10 Patch Notes - Deferred UFO Crash Marker and Interceptor Return Camera

Build `v0.26.06.10.0330_DEFERRED_UFO_CRASH_MARKER_AND_INTERCEPTOR_RETURN_CAMERA_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` refines successful interceptor attacks on the Geoscape:

- Successful interceptor attacks now keep the UFO model visible during launch, approach, and firing instead of immediately replacing it with a crash-site incident marker.
- Crash-site incidents are now created only after the explosion/crash visual beat, so the marker appears after the UFO is visibly shot down.
- Successful attacks now continue showing the interceptor formation returning to base after the hit, matching the miss flow and keeping the return trip readable.
- The Geoscape camera target follows the interceptor run through the return leg so players can watch aircraft come home after the shootdown.
- Build Health coverage remains green for the full campaign self-test suite after the deferred crash marker and return-run timing changes.

Roadmap follow-up: keep building the interception layer toward persistent aircraft state, return-to-base service windows, damage/repair outcomes, and deeper UFO/interceptor encounter choices. The current geoscape run should remain visually readable as those mechanics are added.

## 2026-06-29 Patch Notes - Three.js Geoscape and Camera Ownership

Build `v0.26.06.29.0100_THREE_GEOSCAPE_CAMERA_OWNERSHIP_AND_SOLAR_DAY_NIGHT_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` upgrades the Geoscape presentation and fixes camera ownership during simulation ticks:

- Normal Geoscape time ticks, UFO drift, cloud refreshes, and background simulation updates no longer auto-recenter the camera on North America or the first base.
- Explicit focus actions remain allowed: selected regions, selected incidents, Skyranger travel, interceptor travel, and reset-token behavior can still move the camera intentionally.
- Cinematic travel now uses a separate camera center while updating the player view to the travel endpoint, so control returns without snapping back to the starting base after a Skyranger or interceptor sequence.
- The flat primary globe presentation now has a local Three.js-rendered sphere underneath the existing marker overlay, with recognizable continent meshes, rim lighting, atmosphere, clouds, and retained SVG marker/click layers.
- A local `assets/vendor/three.min.js` dependency is packaged with the build so the globe does not require a CDN connection.
- The Geoscape globe now receives campaign clock state and computes a sun vector from month/day/minute, letting the day-night lighting direction advance with the campaign clock.
- Build Health coverage expanded for camera ownership, player/cinematic camera separation, Three.js initialization helpers, globe marker compatibility helpers, and solar clock movement.

Roadmap follow-up: continue the Three.js migration by moving markers/routes from the SVG overlay into native 3D billboards and arcs, then add interactive globe drag/zoom controls that write back into the same player-owned camera state. Preserve the current camera ownership rules as the globe becomes more fully 3D.

## 2026-06-29 Patch Notes - Aligned Three.js Geoscape Projection

Build `v0.26.06.29.0110_ALIGNED_THREE_GEOSCAPE_AUTHORITATIVE_PROJECTION_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` fixes the mixed Three.js/SVG Geoscape globe presentation:

- The SVG orthographic projection is now the authoritative geography, marker, route, and click/placement model again, so bases, UFOs, incidents, labels, and route effects share one camera/orientation source.
- The Three.js layer no longer draws independent continent meshes that can drift away from the overlay. It now provides a restrained spherical ocean/lighting backdrop under the projected landmasses.
- Region and island fills were restored to readable opacity so North America, Europe, Africa, South America, East Asia, and Oceania visibly line up with their labels and markers.
- The oversized cyan rim/ring was reduced to a subtle atmospheric sphere, avoiding the previous target-disc/second-shell look.
- A subtle clock-driven gloss/night overlay now uses the same Geoscape clock sun-vector helper without changing marker projection.
- Camera ownership rules from the previous patch remain intact: normal time ticks and background simulation updates do not snap the player view back to the first base.
- Build Health coverage expanded with an authoritative projection test for visible region centers, hidden far-side points, zoom scaling, and the clock-driven terminator overlay.

Roadmap follow-up: a future deeper Three.js pass should move the marker layer into true 3D billboards/arcs only after the 3D camera, click picking, hidden-side rejection, and SVG fallback all share one tested coordinate transform.

## 2026-06-29 Patch Notes - Three.js Globe Owns the Geoscape Surface

Build `v0.26.06.29.0130_THREE_GLOBE_OWNS_GEOSCAPE_SURFACE_ALIGNED_MARKERS_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` moves the visible Geoscape Earth surface into the Three.js layer:

- The Three.js canvas now owns the visible globe surface, ocean sphere, and landmass meshes instead of acting as a decorative backing behind the old SVG map.
- Three.js landmasses are rebuilt from the same orthographic lon/lat projection math used by marker placement, so tactical SVG markers, labels, and routes align with the Three globe surface.
- The old SVG continent/terrain/river/road visual map has been removed from the visible geography layer. SVG is now reserved for operational overlays, labels, boundaries, markers, routes, clouds, and effects.
- The landmass set was expanded into more Earth-like simplified continents and islands: Alaska, Canada, main North America, Central America, Caribbean, Greenland, South America, Europe, Britain/Ireland, Africa, Madagascar, Asia, India/Southeast Asia, Japan, Indonesia, Australia, New Zealand, and Antarctica.
- Camera ownership protections remain in place: ordinary time ticks and background simulation updates should not snap the Geoscape camera back to the first base.
- Build Health now verifies Three surface alignment with marker projection, the larger Earth-like landmass set, zoom/projection behavior, and the existing Geoscape camera ownership rules.

Roadmap follow-up: continue improving the Three.js globe toward true interactive 3D drag/pick controls, but keep the tested shared projection contract until all SVG overlays have equivalent Three billboards/arcs.

## 2026-07-04 Patch Notes - Aircraft Clock Speed and Council Frame Repair

Build `v0.26.07.04.0053_AIRCRAFT_CLOCK_SPEED_COUNCIL_FRAME_INDEX_ONLY_PATCH` repairs two roadmap-critical presentation and simulation contracts:

- Council Review slides now use a shared fixed-frame contract for the modal overlay, slide body, and stable footer controls instead of relying on a stale build-name marker for Build Health.
- The Council Review fixed-slide-frame Build Health row now tests the actual modal frame/footer helper, including fixed overlay placement, bounded slide height, scrollable body, and persistent Skip/Next/Finish controls.
- Skyranger and interceptor travel now use aircraft top speed, Earth-scale route distance, and elapsed Geoscape clock minutes to advance progress.
- Short aircraft trips finish sooner because they cover less distance. Long trips take proportionally longer instead of changing the aircraft's speed.
- Interceptor runs still use the existing outbound and return visual path, but progress is now clock-driven from 0-100 outbound and 100-200 return.
- Successful interceptor hits defer crash-site creation until the attack reaches the UFO; interceptor availability returns only after the clock-driven return leg completes.
- Launch messages now include route ETA/top-speed feedback so the player can read why a craft is still en route.
- Build Health coverage now includes fixed aircraft speed consistency, route-distance progress scaling, elapsed-clock advancement, return-leg behavior, and the repaired Council slide frame.

Roadmap follow-up: continue building toward persistent aircraft identity, aircraft damage/repair, range/fuel constraints, and richer UFO/interceptor choices. Keep travel progress tied to Geoscape time so future air-combat systems remain physically readable at Earth scale.

## 2026-07-05 Patch Notes - Aircraft Identity, Damage, and Repair Seed

Build `v0.26.07.05.0100_AIRCRAFT_IDENTITY_DAMAGE_REPAIR_SEED_INDEX_ONLY_PATCH` adds the first persistent aircraft readiness layer:

- Added save-compatible `aircraftFleet` normalization so old saves without aircraft identity data receive named Skyranger/interceptor records from hangar assignments and legacy interceptor counts.
- Aircraft now carry stable names, callsigns, base/hangar identity, status, damage, repair time, and last-sortie outcome.
- Skyranger mission launch marks the selected Skyranger Outbound, mission return marks it Returning, and completed return restores it to Ready.
- Interceptor launch now selects ready named interceptor craft, marks them Outbound, and blocks launches when no ready craft are available.
- Returning interceptors can take light sortie damage and enter short Repairing windows; repair timers advance through Geoscape clock minutes.
- The Geoscape UFO Tracking panel now reports ready/configured interceptors plus repairing/returning totals.
- Hangar inspection now surfaces the named aircraft and its readiness/damage/repair status.
- Build Health coverage now includes old-save aircraft-fleet normalization, repair readiness, and launch blocking.

Roadmap follow-up: playtest the repair cadence and UI clarity, then extend the air-war layer with range/fuel constraints and player-facing interception choices that trade hit chance, damage risk, ammo use, and repair time.

## 2026-07-05 Patch Notes - Aircraft Range, Fuel, and Interception Choices

Build `v0.26.07.05.0200_AIRCRAFT_RANGE_FUEL_AND_INTERCEPTION_CHOICES_INDEX_ONLY_PATCH` extends the aircraft readiness layer without changing the single-file architecture:

- Added save-compatible fuel capacity, current fuel, range, and refuel timer fields to normalized aircraft records.
- Skyrangers and interceptors now use simple practical range profiles and block launches when the round trip exceeds range or available fuel.
- Fuel is consumed at launch and refuels through existing Geoscape clock advancement while craft are not Outbound or Returning.
- UFO Tracking now surfaces interceptor fuel/range readiness and per-contact sortie feasibility.
- Added Cautious, Standard, and Aggressive interception stances; stance modifies hit chance, ammo expenditure, fuel use, damage risk, and repair time.
- Hangar inspection inherits clearer fuel/range/repair/refuel status through the shared aircraft readiness line.
- Existing clock-based Skyranger/interceptor travel and interceptor repair behavior are preserved.
- Build Health coverage now includes aircraft fuel/range normalization, route range checks, fuel refill behavior, stance effect bounds, fuel-based launch blocking, and the previous repair readiness checks.

Verification checklist:
- Start a new campaign and confirm the start screen/build label shows `v0.26.07.05.0200`.
- Open Build Health in browser and confirm all checks pass, including aircraft identity/repair and aircraft range/fuel/stance rows.
- Inspect a hangar and confirm named aircraft show fuel and range readiness.
- In UFO Tracking, switch stances and confirm contact launch buttons/readouts respond to readiness.
- Launch an interceptor and confirm fuel is consumed, the craft becomes Outbound/Returning, then returns to Ready or Repairing after the clock-driven return leg.
- Advance Geoscape time and confirm grounded aircraft refuel while airborne aircraft do not.

Roadmap follow-up: if this tests cleanly, move next to `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` so UFO size, speed, stance, and formation choices produce more varied interception outcomes while preserving the new fuel/range/repair foundation.

## 2026-07-05 Patch Notes - Interceptor Base Range Selection Fix

Build `v0.26.07.05.0210_INTERCEPTOR_BASE_RANGE_SELECTION_FIX_INDEX_ONLY_PATCH` corrects the first-base range bug found after the aircraft fuel/range patch:

- Interceptor sortie readiness now resolves each aircraft's launch base from its `baseId` or `hangarKey`.
- Old aircraft records that have a hangar assignment but no explicit `baseId` now derive the base from the hangar key during normalization.
- UFO Tracking readiness and launch blocking now evaluate all ready interceptors across all bases and prefer eligible aircraft with the lowest fuel cost.
- Interceptor launch reports and travel plans preserve the selected launch base instead of always using the first base with a location.
- Existing fuel consumption, refueling, stance effects, damage/repair, and clock-based travel contracts are preserved.
- Build Health now includes a multi-base range selection row verifying that an interceptor in a closer North Africa base can be selected while a North America interceptor remains out of range.

Verification checklist:
- Build a first base far from a detected UFO and confirm its interceptor is correctly blocked by range.
- Build/order an interceptor at a closer second base and confirm the UFO can be intercepted from that closer base once the aircraft is Ready and fueled.
- Confirm Build Health passes the new `Interceptor range uses each aircraft assigned base` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this bugfix verifies cleanly.

## 2026-07-06 Patch Notes - Richer UFO Evasion and Air Combat Events

Build `v0.26.07.06.0100_RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY_PATCH` deepens interceptor resolution without changing the single-file architecture or the clock-based travel contract:

- UFO interception can now resolve into Confirmed Shootdown, Damaged Escape, Evasive Maneuvers, Contact Lost, Forced Disengage, Ammunition Pressure, or Breakaway.
- Outcome selection uses UFO size/speed/threat, formation size, weapon power, detection coverage, and the current Cautious/Standard/Aggressive stance.
- UFO Tracking readiness text now includes a lightweight hit estimate and UFO evasion pressure preview.
- Launch summaries and command reports now include outcome label, stance, hit estimate, combat roll, evasion pressure, launch base, fuel cost, and ETA.
- Non-shootdown outcomes can advance UFO progress, mark contact lost, or store a damaged/evasion summary while interceptors still fly home on Geoscape clock ticks.
- Aircraft recovery records the richer air-combat outcome and applies bounded damage/repair modifiers after the return leg.
- Build Health now includes `Richer UFO evasion and air combat events stay bounded`, covering outcome variety, contact-lost state, stance modifiers, ammo bounds, recovery bounds, and regression checks for multi-base interceptor range, Skyranger base matching, and new-base placement.

Verification checklist:
- Launch interceptors against detected UFOs with different stances and confirm the launch summary names a richer air-combat outcome.
- Confirm UFO Tracking shows hit estimate / evasion pressure while preserving range/fuel/base readiness.
- Advance Geoscape time after an interception and confirm return/repair still follows clock time.
- Confirm Build Health passes the new `Richer UFO evasion and air combat events stay bounded` row.
- Confirm older saves still normalize `aircraftFleet` records safely.

Roadmap follow-up: `AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Interceptor Stuck-Outbound Recovery Fix

Build `v0.26.07.06.0115_INTERCEPTOR_STUCK_OUTBOUND_RECOVERY_FIX_INDEX_ONLY_PATCH` fixes a playtest bug where an interceptor could remain stuck in `Outbound` with low fuel after the visible interception travel state was gone:

- Active interceptor travel now synchronizes assigned aircraft to `Outbound` during the outbound leg and `Returning` after the attack leg reaches the UFO.
- Stale airborne interceptor records with no active `interceptorTravel` are recovered conservatively into a short `Repairing` window instead of staying permanently Outbound/Returning.
- Recovered craft are grounded and can refuel normally as Geoscape clock time advances.
- Legitimately Outbound/Returning aircraft still do not refuel while airborne.
- Aircraft status lines now indicate when airborne craft have refueling paused and when a craft was recovered from stale travel.
- Save/load migration applies the stale-airborne recovery guard so old or mismatched saves can recover stuck interceptors.
- Build Health now includes `Interceptor airborne status recovery prevents stuck Outbound craft`, covering active travel status sync, return recovery, stale Outbound/Returning recovery, recovered refueling, airborne no-refuel behavior, and recovery display text.

Verification checklist:
- Load a save with a stuck Outbound/Returning interceptor and confirm it enters short Repairing recovery, then refuels over clock time.
- Launch an interceptor, advance time past the attack leg, and confirm the aircraft status changes to Returning before final recovery.
- Confirm airborne craft do not refuel while Outbound/Returning.
- Confirm recovered/grounded craft do refuel while Geoscape time advances.
- Confirm Build Health passes the new `Interceptor airborne status recovery prevents stuck Outbound craft` row.

Roadmap follow-up remains `AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY`.

## 2026-07-10 Patch Notes - First Base Selection Range Preview

Build `v0.26.07.10.0020_FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY_PATCH` makes first-base placement part of the campaign opening instead of a blind map choice:

- The first-base selection screen now shows two opening alien incidents before the player confirms the starting base.
- The opening incidents are deterministic and carry into the actual campaign Geoscape: `Prairie Abduction` and `Red River Signal`.
- The beginning globe now shows the opening incident markers alongside the proposed starting-base crosshair.
- Dotted first-base preview rings show starting Shortwave Radar coverage, starting Interceptor practical reach, and starting Skyranger practical reach from the proposed site.
- The setup side panel now reports whether both opening crises are inside the current proposed site's starting Skyranger radius.
- Build Health now includes `First-base selection previews opening incidents and starting reach`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, first-base setup verification, first base confirmation -> main Geoscape, clean browser console, and Build Health 214/214.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0020`.
- Start a new campaign and confirm the first-base setup screen shows `Prairie Abduction` and `Red River Signal`.
- Confirm the setup screen shows dotted starting reach rings and a `2/2` opening-crisis Skyranger coverage summary for the default North America site.
- Confirm first base placement carries those same two incidents into the main Geoscape.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Confirm Build Health passes 214/214 and includes the new first-base selection row.
- Confirm browser console errors are clear.

Roadmap follow-up was `BASE_LOCAL_LOADOUT_AND_MISSION_CONFIRMATION_HARDENING_INDEX_ONLY`, completed in `v0.26.07.10.0080`.

## 2026-07-10 Patch Notes - Base Placement Ferry Link Preview

Build `v0.26.07.10.0095_BASE_PLACEMENT_FERRY_LINK_PREVIEW_INDEX_ONLY_PATCH` extends new-base placement with ferry-network visibility:

- While Build New Base placement mode is active, the Geoscape draws dotted links from the proposed site to existing bases when at least one currently accessible aircraft type can fly the one-way ferry leg.
- The New Base Site summary now includes ferry-link text naming the connected base, approximate one-way distance, and whether Interceptors, Skyrangers, or both can make the trip.
- Ferry-link calculations use the player's current aircraft types and fuel-tank upgrade range profiles.
- Existing base-placement aircraft reach rings remain unchanged.
- Build Health now includes `New-base placement previews dotted aircraft ferry links`.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the new playable build label and seam.

Verification checklist:
- Run `node tools\check-aegis-build.cjs`.
- Run inline script syntax checks.
- Load `http://127.0.0.1:5173/index.html`, start/load a campaign, click Build New Base, and confirm dotted ferry-link lines/text appear when the proposed site is within one-way ferry range of existing bases.
- Move the proposed site and confirm ferry links update with the site.
- Run Build Health and confirm all checks pass, including `New-base placement previews dotted aircraft ferry links`.
- Confirm browser console errors are clear.

Roadmap follow-up remains `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_EXECUTION_INDEX_ONLY`, starting with one staged-leg execution path and hangar reservation/refuel timing.

## 2026-07-10 Patch Notes - Aircraft Ferry Refuel and Multi-Base Sortie Staging

Build `v0.26.07.10.0090_AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY_PATCH` seeds the aircraft ferry/refuel staging system without yet changing live launch/return state:

- Added pure helper seams for owned-base staging plans, open-hangar checks, one-way base-to-base ferry validation, and refueled final-leg round-trip validation.
- Ferry legs use one-way range/fuel checks because the aircraft is expected to land and refuel at the staging base.
- Final mission/interception legs still require enough refueled range/fuel to fly from the last staging base to the target and return to that same staging base.
- Staging candidates require an open hangar at the intermediate base before they can be considered ready.
- UFO Tracking now includes a compact Ferry / Refuel Staging card for selected incidents and detected UFOs.
- Build Health now includes `Aircraft ferry staging checks open hangars and refuel legs`.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the new playable build label and seam.

Verification checklist:
- Run `node tools\check-aegis-build.cjs`.
- Run static app-script parse.
- Load `http://127.0.0.1:5173/index.html`, confirm the start screen shows the new build label, start a campaign, and confirm the Geoscape loads.
- Confirm UFO Tracking shows the Ferry / Refuel Staging card.
- Run Build Health and confirm all checks pass, including `Aircraft ferry staging checks open hangars and refuel legs`.
- Confirm browser console errors are clear.

Roadmap follow-up is `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_EXECUTION_INDEX_ONLY`, starting with one staged-leg execution path and hangar reservation/refuel timing.

## 2026-07-10 Patch Notes - Base-Local Loadout and Mission Confirmation Hardening

Build `v0.26.07.10.0080_BASE_LOCAL_LOADOUT_AND_MISSION_CONFIRMATION_HARDENING_INDEX_ONLY_PATCH` tightens the last step before squad deployment so commanders can see the local-base consequences before committing a Skyranger:

- Mission launch confirmation now previews the selected Skyranger, launch base, round-trip distance, and fuel commitment when a valid sortie can be selected.
- If launch is blocked, the confirmation preview surfaces the same Skyranger stationing/range/fuel blocker text used by the launch path.
- The confirmation modal now lists the response-force soldiers with weapon and armor state, plus a local loadout check for unarmed soldiers, under-armored soldiers, loose launch-base stock, issued gear, and in-transit gear.
- Barracks now shows a selected-base empty state when no local weapons or armor are available for rearming instead of silently rendering no equip buttons.
- Added pure helper seams for selected-base loadout summaries and mission-launch loadout summaries.
- Build Health now includes `Mission confirmation explains local loadout and launch base`.
- Verified through Node app-script parse, `node tools/check-aegis-build.cjs`, localhost start screen smoke, first-base confirmation to main Geoscape, and browser Build Health 219/219.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0080`.
- Start a new campaign and confirm first-base setup and main Geoscape still load without runtime errors.
- Open Build Health and confirm 219/219 checks pass with `Mission confirmation explains local loadout and launch base`.
- Open Barracks at a base with no local weapons/armor and confirm the empty rearm text is shown.
- Open a mission launch confirmation and confirm the launch base, Skyranger, fuel/distance, response-force loadout, and local stock/in-transit summary are visible.

Roadmap follow-up is `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY`, starting with a contained route-leg and hangar-eligibility seed.

## 2026-07-10 Patch Notes - Base-Local Loadout Stock Enforcement and Transfer Polish

Build `v0.26.07.10.0065_BASE_LOCAL_LOADOUT_STOCK_ENFORCEMENT_AND_TRANSFER_POLISH_INDEX_ONLY_PATCH` tightens the Barracks equipment UI so it matches the local-base stock rules already enforced by the equip action:

- Barracks equip buttons now list only weapons and armor physically stocked at the currently selected base.
- Equip button labels now show the selected base as the stock source instead of showing aggregate/global inventory counts.
- Equip button tooltips use `localLoadoutAvailabilityMessage` to show selected-base local stock plus issued and in-transit counts.
- Added helper seams for issued-equipment counting and in-transit equipment counting.
- Corrected the Build Health fixture to use shipped catalog item names such as `Laser Carbine`.
- Build Health now includes `Base-local loadout buttons only advertise selected-base stock`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, and browser Build Health 218/218.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0065`.
- Confirm Barracks equip buttons only show selected-base local weapons/armor.
- Confirm switching selected bases changes the available equip buttons to that base's local stores.
- Confirm equip button labels name the selected base stock source.
- Confirm equip button tooltips describe local stock, issued gear, and in-transit gear.
- Confirm transfer fees, Logistics Center rows, and bulk equipment transfer buttons still behave as in `v0.26.07.10.0060`.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 218/218 with the new local-loadout row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base Transfer Logistics Center and Bulk Payloads

Build `v0.26.07.10.0060_BASE_TRANSFER_LOGISTICS_CENTER_AND_BULK_PAYLOADS_INDEX_ONLY_PATCH` makes transfer logistics easier to inspect and reduces click friction for moving equipment:

- Added a compact selected-base Logistics Center that merges personnel and equipment transfers into one inbound/outbound manifest.
- Logistics Center rows show transfer direction, payload, origin, destination, ETA, fee-paid state, no-refund status, and cancel action.
- Quartermaster equipment transfer controls now offer bulk payload choices of `1`, `5`, and `All` where selected-base stock allows.
- Bulk transfer costs scale through the existing distance/handling cost rules.
- Added pure helper seams for equipment transfer quantity choices and selected-base transfer manifests.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track this build label and required Logistics Center Build Health row.
- Build Health now includes `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, and browser Build Health 217/217.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0060`.
- Start or load a campaign with at least two bases and create a soldier or equipment transfer.
- Confirm the selected base shows a Logistics Center with inbound/outbound transfer manifest rows.
- Confirm manifest rows show payload, origin, destination, ETA, fee-paid/no-refund text, and cancel actions.
- Confirm Quartermaster equipment cards show `Send 1`, `Send 5`, and `Send All` options when local stock allows.
- Confirm bulk transfers deduct the correct local quantity and charge a scaled logistics fee.
- Confirm transfer cancellation still returns soldiers/equipment to origin with no refund.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 217/217 with the new Logistics Center row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base Transfer Costs, Cancellation, and Logistics Rules

Build `v0.26.07.10.0055_BASE_TRANSFER_COSTS_CANCELLATION_AND_LOGISTICS_RULES_INDEX_ONLY_PATCH` makes base-to-base logistics more legible and less free-form:

- Soldier transfers now charge distance-based logistics fees and block if funds are insufficient.
- Equipment transfers now charge distance/handling-based logistics fees and block if funds are insufficient.
- In-transit soldier transfers can be cancelled from the Personnel Transfers panel; cancellation returns the soldier to the origin base and does not refund the fee.
- In-transit equipment transfers can be cancelled from Quartermaster item logistics rows; cancellation returns the item payload to the origin base and does not refund the fee.
- Transfer summaries now include fee-paid/no-refund messaging so the player can understand cancellation consequences before using the action.
- The detailed solid Geoscape globe Build Health helper was tightened so the early self-test path recognizes the preserved 30-landmass / 356-vertex detailed geometry set.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track this build label and required transfer-cost Build Health row.
- Build Health now includes `Base transfer logistics charge fees and cancel back to origin`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, opaque/borderless globe DOM check, and browser Build Health 216/216.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0055`.
- Start a campaign with more than one base and confirm Barracks soldier transfer buttons show ETA and fee.
- Confirm low funds block soldier and equipment transfers with a clear required/available funds message.
- Confirm active soldier transfers appear in Personnel Transfers with a cancel action and return the soldier to the origin base without refund.
- Confirm Quartermaster equipment transfer buttons show fee and active equipment transfers can be cancelled back to origin.
- Confirm in-transit soldiers/equipment remain unavailable until arrival or cancellation.
- Confirm Geoscape landmasses remain detailed, opaque, borderless, and draggable.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 216/216 with the new transfer-cost row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Opaque Borderless Geoscape Landmasses

Build `v0.26.07.10.0050_OPAQUE_BORDERLESS_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` makes the detailed solid Geoscape landmasses fully opaque:

- Landmass fill opacity is now `1`, so the ocean layer no longer shows through the continents.
- The borderless landmass stroke behavior from `v0.26.07.10.0045` is preserved.
- Build Health now checks the opaque detailed landmass contract.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0050`.
- Confirm Geoscape landmasses are solid/opaque and still borderless.
- Confirm globe dragging still works and Build Health passes the opaque detailed-landmass row.

## 2026-07-10 Patch Notes - Borderless Solid Geoscape Landmasses

Build `v0.26.07.10.0045_BORDERLESS_SOLID_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` removes the thin white outline from the detailed solid Geoscape landmasses:

- Detailed landmass paths now render with transparent stroke and zero stroke width.
- The globe keeps the restored `GEOSCAPE_THREE_LANDMASSES` shapes and solid ocean/land styling.
- Region gameplay boundaries remain separate and subtle, so selection logic is preserved without outlining every landmass.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0045`.
- Confirm Geoscape landmasses no longer show a thin white border.
- Confirm globe dragging still works and Build Health passes the detailed solid-landmass row.

## 2026-07-10 Patch Notes - Detailed Solid Geoscape Landmasses

Build `v0.26.07.10.0040_DETAILED_SOLID_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` keeps the solid Geoscape globe styling but restores the more detailed landmass shapes from the earlier hologram/Three.js globe:

- Visible continents and islands now render from `GEOSCAPE_THREE_LANDMASSES`, preserving the 30-landmass / 356-vertex geography set.
- Coarse `EARTH_BASE_REGIONS` polygons are no longer filled as visible land; they remain as transparent/subtle selection boundaries for region gameplay.
- The solid globe visual contract now records `landmassSource: "GEOSCAPE_THREE_LANDMASSES"`.
- Build Health now includes `Solid Geoscape globe uses detailed landmasses and remains draggable`.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0040`.
- Start a new campaign, confirm the first base, and verify the Geoscape globe landmasses look like the previous detailed globe shapes while staying solid.
- Drag the globe and confirm rotation still works.
- Run Build Health and confirm the detailed solid-landmass row passes.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Solid Geoscape Globe and Drag Recovery

Build `v0.26.07.10.0035_SOLID_GEOSCAPE_GLOBE_AND_DRAG_RECOVERY_INDEX_ONLY_PATCH` fixes the playtest issue where the Geoscape globe could stop accepting drag input partway through a campaign and updates the globe presentation to read as a solid Earth-style strategic map:

- Globe drag, wheel zoom, click selection, and incident focus now route through a dedicated interaction policy instead of returning early whenever aircraft travel state exists.
- Stale or active Skyranger/interceptor travel state should no longer permanently prevent the player from rotating the world map.
- The visible globe surface now uses a solid ocean fill, visible land fill/strokes, capped day/night shading, restrained cloud opacity, and less hologram-like glow.
- The older Build Health wording was updated so the map contract now describes solid land/ocean geography layers instead of claiming SVG geography is hidden.
- A stale memorial Build Health catalog threshold was aligned to the current shipped 150-item memorial offering catalog while preserving the 281-message template requirement.
- Build Health now includes `Solid Geoscape globe remains draggable during travel states`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, actual pointer-drag projection-change check, solid globe DOM checks, clean browser console, and Build Health 215/215.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0035`.
- Start a new campaign, confirm the first base, and drag the Geoscape globe before and after aircraft travel occurs.
- Confirm the globe appears solid with readable oceans and landmasses rather than transparent/holographic.
- Run Build Health and confirm 215/215 with the new solid-globe row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base-Local Equipment Logistics Polish and Workshop Origin

Build `v0.26.07.10.0005_BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY_PATCH` tightens the base-local equipment loop without changing save format:

- Workshop orders now record the production/destination base at queue time.
- Completed Workshop items route into that destination base's local stores, rather than whichever base is selected when time advances.
- Workshop inventory display now shows manufactured stock for the currently selected base.
- Quartermaster/Base Stores now shows compact inbound/outbound equipment logistics for the selected base.
- Quartermaster item cards now include a compact availability line for local stock, issued gear, and in-transit gear.
- `src/manifest.json` now tracks the current build label and `tools/check-aegis-build.cjs` verifies the new Workshop/logistics Build Health row.
- Build Health now includes `Workshop production preserves destination base and equipment logistics summaries`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 213/213.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0005`.
- Run `node tools/check-aegis-build.cjs` and confirm the source manifest matches the playable artifact.
- Run the Node app-script parse check.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Confirm Build Health passes 213/213 and includes the new Workshop/logistics row.
- Confirm browser console errors are clear.
- In practical play, queue Workshop production from one base, switch bases while time advances, and confirm completed stock appears at the original production destination.

Roadmap follow-up is `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`, then deeper transfer rules such as costs/cancellation if needed.

## 2026-07-09 Patch Notes - Modular Source Layout and Engine Port Prep

Build `v0.26.07.09.0045_MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY_PATCH` begins the project-organization pass without disrupting the current browser build:

- `index.html` remains the playable distribution artifact and save format remains 4.
- Added `ARCHITECTURE_MODULE_PLAN` inside the playable build so Build Health can verify the source-layout contract from the runtime artifact.
- Added `src/README.md` as the extraction roadmap for data, systems, UI, tests, and asset manifest areas.
- Added `src/manifest.json` with the current build label, save format, playable artifact, required runtime seams, and engine-port targets.
- Added `src/engine-port-contract.md` to define the Godot 4 migration boundary around JSON-friendly data, deterministic simulation helpers, UI adapters, and explicit save migrations.
- Added `tools/check-aegis-build.cjs`, a dependency-free Node seam check for the current build label and required architecture/runtime markers.
- Build Health now includes `Modular source layout and engine-port prep contract is present`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 212/212.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0045`.
- Run `node tools/check-aegis-build.cjs` and confirm the source manifest matches the playable artifact.
- Run the Node app-script parse check.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Confirm Build Health passes 212/212 and includes the new modular-source row.
- Confirm browser console errors are clear.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`, then `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Mission Recovery Local Stores and UI Encoding Cleanup

Build `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH` tightens the new base-local inventory loop and cleans up visible text/icon encoding artifacts:

- Successful mission recovery now routes alien spoils into the returning Skyranger base's local `baseInventories`.
- KIA recovered equipment now returns to the same local base inventory instead of only updating the legacy aggregate stock.
- The legacy aggregate `gearInventory` remains synchronized for compatibility with older systems and older saves.
- Mission summaries now include a compact line naming the base that received recovered stock.
- The game file was swept for common mojibake markers and broken inline-symbol UI text in high-visibility surfaces.
- The Load / Save Menu button now uses the existing icon component path instead of a fragile inline marker.
- Build Health now includes `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
- Verified through Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 211/211.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0035`.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Complete or simulate a successful mission and confirm alien bodies/materials/equipment arrive in the Skyranger return-base stores.
- Confirm KIA recovered gear returns to the correct local base inventory.
- Confirm wrong-base local stores do not receive the recovered stock.
- Confirm the Time Control funds label renders without stray encoded characters.
- Confirm Build Health passes 211/211 and includes the two new rows.

Roadmap follow-up is `MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY`, then `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Base-Local Equipment Stores and Transfer Logistics

Build `v0.26.07.09.0025_BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH` extends the multi-base logistics pass from personnel into portable equipment:

- Added old-save compatible `baseInventories` while preserving aggregate `gearInventory` for compatibility with older saves and existing systems.
- Quartermaster/Base Stores now show selected-base local stock, selected-base storage capacity, all-bases storage totals, and local issued gear.
- Buying, selling, equipping, removing gear, and forced auto-equip now use the selected/relevant base inventory where safely contained.
- Added initial equipment transfer records with origin base, destination base, item name, quantity, total/remaining travel time, and in-transit status.
- Equipment transfers advance through Geoscape clock time and add stock to the destination base on arrival.
- In-transit equipment is unavailable at both origin and destination until arrival.
- Build Health now includes `Base-local equipment stores and transfers keep stock local until arrival`.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0025`.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Open Quartermaster and confirm local storage, local free storage, all-bases storage, and local issued items render.
- Confirm Build Health passes 209/209 and includes the new equipment logistics row.
- Confirm browser console errors are clear during start screen, Geoscape, Quartermaster, and Build Health.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Start-Screen Mount Fix

Build `v0.26.07.09.0008_START_SCREEN_MOUNT_FIX_INDEX_ONLY_PATCH` repaired the start-screen mount after the first base-local roster/transfer patch.

- Start screen loads from localhost.
- Start New Game works.
- First base confirmation reaches the main Geoscape.
- Browser console errors were clear.
- Build Health passed 208/208 before the equipment-localization patch.
## 2026-07-08 Patch Notes - Base-Local Rosters and Soldier Transfer Logistics

Build `v0.26.07.08.0140_BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH` begins the multi-base logistics pass:

- Barracks now derives its visible soldier roster from the currently selected base.
- Sickbay now derives its visible patient/recovery roster from the currently selected base.
- Selected-base Sickbay patient count uses selected-base Sickbay capacity for the local screen.
- Ready Barracks soldiers can be transferred from the selected base to another base when multiple bases exist.
- Soldier transfers store origin base, destination base, total/remaining travel time, and in-transit status.
- Transfers advance through Geoscape clock time and update the soldier's base on arrival.
- In-transit soldiers are removed from squad duty, hidden from local base rosters, blocked from squad assignment, and excluded from mission response forces until arrival.
- Personnel Transfers appear in Barracks for inbound/outbound selected-base transfers.
- Build Health now includes `Base-local rosters and soldier transfers keep personnel available only at their base`.

Verification checklist:
- Select different bases and confirm Barracks shows only soldiers stationed at the selected base.
- Confirm Sickbay/patient lists are filtered to the selected base.
- Transfer a ready soldier from one base to another and confirm the soldier is removed from squad duty and listed as in transit.
- Advance Geoscape clock time and confirm the transferred soldier arrives at the destination base.
- Confirm in-transit soldiers cannot be assigned to squads or launched on missions.
- Confirm Build Health passes with the new base-local transfer row and the prior squad/base filter row.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-08 Patch Notes - Geoscape Range Overlay Filters and Squad Base Filter

Build `v0.26.07.08.0120_GEOSCAPE_RANGE_OVERLAY_FILTERS_AND_SQUAD_BASE_FILTER_INDEX_ONLY_PATCH` adds player-selectable range planning overlays and tightens squad assignment to base-local soldiers:

- Geoscape now has a compact Range Overlays control with toggles for Shortwave Radar, Longwave Radar, Interceptor reach, Skyranger reach, and All Off.
- Overlay rings render as lightweight dotted/dashed circles around existing bases.
- Radar rings use the existing Shortwave 4,500km and Longwave 9,000km range model.
- Aircraft rings use practical round-trip reach and respect purchased Interceptor Drop Tanks and Skyranger Extended Tanks.
- New-base placement preview rings remain separate and visually distinct from persistent base overlay rings.
- Squads now resolve a selected squad's base from explicit squad base fields when available, assigned members when needed, and the selected/current base as a conservative fallback.
- The Squads screen available-soldier list now only shows unassigned, living, non-wounded soldiers stationed at the selected squad's base.
- Wrong-base soldiers are hidden from the assignable list and are defensively blocked if directly assigned through stale UI state.
- Build Health now includes `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.

Verification checklist:
- Open Geoscape and toggle Shortwave, Longwave, Interceptor, Skyranger, and All Off range overlays.
- Confirm the overlay rings draw around existing bases and remain visually distinct from Build New Base preview rings.
- Confirm tank upgrades change aircraft overlay reach values.
- Open Squads, select a squad, and confirm only soldiers stationed at that squad's base appear in the available assignment list.
- Confirm soldiers stationed at other bases are hidden and that same-base soldiers can still be assigned.
- Confirm Build Health passes with the two new rows.

Roadmap follow-up is `BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-08 Patch Notes - UFO Landing and Terror Incidents

Build `v0.26.07.08.0100_UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY_PATCH` adds the first UFO operation-to-ground-incident loop:

- Active UFOs now normalize with a mission intent: Recon, Abduction, Terror Raid, Harvest, Base Scout, or Supply.
- UFOs can complete operations into ground incidents once flight progress reaches the mission threshold, instead of only disappearing as escaped contacts.
- Landed/terror-style incidents are generated from UFO size, region, alien type, and mission intent, while existing crash-site incidents remain separate.
- Air-combat outcomes can disrupt UFO operations: damaged escapes, forced disengagements, ammunition pressure, and breakaways add delay/downgrade pressure before a later ground incident.
- UFO Tracking now shows a mission-risk line once radar contact quality and tracking are good enough to read the operation.
- Old saves with UFO records missing mission intent normalize safely to a valid intent.
- Build Health now includes `UFO mission intents can create landed terror incidents`, covering intent normalization, incident generation, panic consequences, radar-readable mission text, and interception disruption/downgrade behavior.

Verification checklist:
- Start/load a campaign and confirm UFO Tracking still respects radar range/contact quality.
- Track contacts long enough to see mission risk text appear once radar quality improves.
- Advance Geoscape time and confirm some UFOs generate landed/terror-style incidents rather than only lost-contact reports.
- Confirm crash sites from shootdowns and delayed damaged-UFO crashes remain separate from landed incidents.
- Intercept a UFO and confirm damaged/disrupted outcomes can delay or downgrade the later operation.
- Confirm Build Health passes with the new UFO mission-intent row.

Roadmap follow-up is `GEOSCAPE_RANGE_OVERLAY_FILTERS_INDEX_ONLY`, followed by `BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Base Radar Range and Contact Quality

Build `v0.26.07.07.0140_BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY_PATCH` implements the first distance-based radar model:

- Base radar coverage is now derived from each base's installed radar facilities and Geoscape location.
- Shortwave Radar provides local/regional UFO contact range at 4,500km.
- Longwave Radar provides wider strategic UFO contact range at 9,000km.
- UFOs outside radar range stay hidden unless already detected/known; the Geoscape globe and UFO Tracking panel no longer reveal all UFOs just because the player owns any radar.
- Radar contact quality now reports Weak, Faint, Tracked, or Locked based on distance, UFO detectability, radar type, and overlapping radar coverage.
- Overlapping radar coverage improves detection chance and air-combat firing solution quality.
- UFO Tracking contact rows now name the detecting base/radar source, approximate range, detection chance, and overlap count.
- Build Health now includes `Base radar range and contact quality gate UFO tracking`, covering range gating, Shortwave-vs-Longwave behavior, overlap quality, visible-contact filtering, starting radar continuity, and no-regression checks for interceptor and Skyranger launch selection.

Verification checklist:
- Start/load a campaign and confirm Fort Aegis' Shortwave Radar creates local/regional UFO coverage without globally revealing every UFO.
- Add/build Longwave Radar and confirm it reaches farther contacts than Shortwave Radar.
- Add overlapping radar coverage from multiple bases and confirm contact quality/detection improves.
- Confirm detected UFOs still support assigned-base interceptor range/fuel selection.
- Confirm Skyranger stationing/load normalization still passes and launch blockers remain clear.
- Confirm Build Health passes 204/204 checks, including the new radar row.

Roadmap follow-up is `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Skyranger Stationing Load Normalization Fix

Build `v0.26.07.07.0120_SKYRANGER_STATIONING_LOAD_NORMALIZATION_FIX_INDEX_ONLY_PATCH` fixes the remaining playtest blocker where the game listed ready Skyranger bases such as `N. Africa1` and `Fort Aegis` but still refused launch because selected soldiers did not match either base:

- Soldier stationing now resolves against actual campaign base IDs before falling back to safe legacy base name/region tokens.
- Room/activity-only `baseLocation` state, such as Barracks movement markers, no longer counts as base identity and no longer prevents fallback to the selected/first base during old-save normalization.
- Save/load migration assigns a real fallback base ID when soldiers lack explicit `baseId`, `homeBaseId`, or `assignedBaseId` data.
- Skyranger launch selection now correctly chooses the matching ready Skyranger when Fort Aegis and N. Africa both have ready transports.
- Mixed-base response forces remain blocked, but the blocker now names offending soldiers and where the game believes they are stationed.
- Build Health expands the Skyranger assigned-base row with Fort Aegis/N. Africa matching, room-only legacy location fallback, mixed-base named blocker text, and legacy load normalization.

Verification checklist:
- Load the affected campaign and confirm a Fort Aegis squad can launch from a ready Fort Aegis Skyranger to an in-range incident while N. Africa also has a ready Skyranger.
- Confirm an N. Africa squad can still launch from an N. Africa Skyranger to an in-range incident.
- Confirm mixed-base squads are blocked with named soldiers and their interpreted stationing.
- Confirm under-fueled and out-of-range Skyrangers still produce fuel/range blockers rather than stationing blockers.
- Confirm Build Health passes the expanded `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Skyranger Stationing and Range Launch Fix

Build `v0.26.07.07.0105_SKYRANGER_STATIONING_RANGE_LAUNCH_FIX_INDEX_ONLY_PATCH` fixes a playtest blocker where a ready Skyranger and apparently stationed squad could be refused with `assigned soldiers are not stationed at any ready Skyranger base`:

- Skyranger launch eligibility now compares soldiers against the actual launch base object rather than only a raw base id string.
- Soldier stationing checks now recognize current `baseId`, older `homeBaseId` / `assignedBaseId`, legacy `baseLocation` strings, legacy `baseLocation` objects, base names, and base regions.
- Old-save and mixed-save soldier stationing data can match the correct base without allowing truly wrong-base soldiers to launch.
- Blocking text now lists the ready Skyranger base names when soldiers are not stationed at any matching ready transport base.
- Representative North America to Central America-style incidents validate as in range under the existing model: about 6,813km round trip against the starting Skyranger's 16,000km practical range.
- Build Health expands the Skyranger assigned-base row with North America in-range launch eligibility, legacy stationing normalization, wrong-base blocking, under-fueled blocking, and existing multi-base/range/fuel continuity checks.

Verification checklist:
- Load or start a campaign with a ready North America Skyranger and squad at that base.
- Launch to a nearby North/Central America incident and confirm the false stationing blocker no longer appears.
- Confirm a squad stationed at a different base is still blocked from using the wrong Skyranger.
- Confirm under-fueled and out-of-range Skyrangers still produce fuel/range blockers rather than stationing blockers.
- Confirm Build Health passes the expanded `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Smooth X-COM Style Geoscape Time

Build `v0.26.07.06.0175_SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY_PATCH` makes the Geoscape clock feel more like classic time compression while preserving the existing simulation contract:

- Added Geoscape time compression modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- Automatic Geoscape time now advances on a smoother one-second cadence, with the selected mode controlling elapsed Geoscape minutes.
- Time-control labels now show the active compression mode and perceived clock rate.
- Old saves with missing or odd clock settings normalize to the nearest supported compression mode.
- Aircraft travel, UFO movement, repair, refuel, delayed crash, and mission timing remain driven by elapsed Geoscape minutes.
- Build Health now includes `Smooth X-COM-style Geoscape time compression preserves clock math`, covering time-scale conversion, route progress scaling, repair/refuel progression, and no-regression clock blocking.

Verification checklist:
- Open the Geoscape and confirm the clock offers Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d modes.
- Confirm higher compression modes visibly advance aircraft/UFO progress faster than low compression modes.
- Confirm repair and refuel progress still match elapsed Geoscape minutes.
- Confirm tactical/manual mission states and council/modal states still block automatic clock flow.
- Confirm Build Health passes the new `Smooth X-COM-style Geoscape time compression preserves clock math` row.

Roadmap follow-up: `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Base Placement Aircraft Range Preview

Build `v0.26.07.06.0165_BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY_PATCH` makes new-base siting more readable by previewing aircraft reach before the player commits funds:

- Build New Base placement mode now renders dotted aircraft reach rings centered on the proposed site.
- The preview shows current Interceptor and Skyranger practical reach using the existing round-trip range model.
- If Interceptor Drop Tanks or Skyranger Extended Tanks are not owned, lighter upgrade-preview rings show how future fuel tank upgrades would improve reach.
- The New Base Site summary now includes a dotted aircraft reach line so the globe overlay is explained near the name/cost/confirm controls.
- Existing base-placement confirmation behavior, construction cost, validation, and Access Lift seed layout are preserved.
- Build Health now includes `New-base placement previews dotted aircraft range rings`, covering inactive preview hiding, ring values, render data, summary text, and no-regression base construction.

Verification checklist:
- Click Build New Base and confirm dotted Interceptor and Skyranger range rings appear around the proposed site.
- Confirm the selected-site summary includes current aircraft reach values.
- Purchase one or both fuel tank upgrades and confirm the preview no longer treats the owned upgrade as a future-preview ring.
- Construct a new base and confirm it still starts with the expected Access Lift seed layout.
- Confirm Build Health passes the new `New-base placement previews dotted aircraft range rings` row.

Roadmap follow-up: `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Starting Base Shortwave Radar Seed

Build `v0.26.07.06.0155_STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY_PATCH` gives the player a clearer default radar foothold without changing expansion-base construction:

- Added one Shortwave Radar to the default Fort Aegis starting base layout.
- Preserved the existing two starting hangars, Access Lift, Living Quarters, Laboratory, Sickbay, and Base Stores seed.
- Newly constructed expansion bases still start with only their free Access Lift.
- Existing radar coverage math now counts the seeded Shortwave Radar at campaign start.
- Build Health now includes `Initial base starts with one Shortwave Radar`, covering the seed while preserving the starting hangar and expansion-base checks.

Verification checklist:
- Start a new campaign and confirm the starting base contains one Shortwave Radar.
- Confirm the starting Skyranger and Interceptor hangars are still present.
- Open UFO Tracking and confirm coverage shows one shortwave radar counted at campaign start.
- Build a new expansion base and confirm it still starts with only the Access Lift.
- Confirm Build Health passes the new `Initial base starts with one Shortwave Radar` row.

Roadmap follow-up: `BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY` and `SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY` are complete; next target is `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Aircraft Fuel Tank Upgrades

Build `v0.26.07.06.0145_AIRCRAFT_FUEL_TANK_UPGRADES_INDEX_ONLY_PATCH` makes starting craft more useful deeper into the campaign without replacing the single-file aircraft model:

- Added global save-compatible fuel tank upgrade flags for Interceptors and Skyrangers.
- Added purchasable Interceptor Drop Tanks in UFO Tracking for $320k.
- Added purchasable Skyranger Extended Tanks in UFO Tracking for $440k.
- Interceptor Drop Tanks raise Interceptors from 100 fuel / 7,800km range to 135 fuel / 10,500km range.
- Skyranger Extended Tanks raise Skyrangers from 100 fuel / 16,000km range to 130 fuel / 20,800km range.
- Existing aircraft, loaded aircraft, and newly ordered aircraft inherit purchased tank upgrades while preserving status, repair, airborne, and refuel behavior.
- Refueling remains automatic and clock-based; no funds or Base Stores fuel storage is required.
- Build Health now includes `Aircraft fuel tank upgrades extend sortie reach safely`, covering old-save normalization, upgrade application, upgraded range checks, upgraded refueling, and no-regression aircraft travel/range selection.

Verification checklist:
- Open Geoscape/UFO Tracking and confirm Interceptor Tanks and Skyranger Tanks upgrade cards appear beside aircraft ordnance.
- Purchase Interceptor Drop Tanks and confirm Interceptor readiness/range updates to 10,500km / 135 fuel.
- Purchase Skyranger Extended Tanks and confirm Skyranger readiness/range updates to 20,800km / 130 fuel.
- Confirm upgraded aircraft can launch longer valid sorties while still blocking routes beyond upgraded practical range or current fuel.
- Confirm refueling still advances only through Geoscape clock time and airborne craft still do not refuel.
- Confirm Build Health passes the new `Aircraft fuel tank upgrades extend sortie reach safely` row.

Roadmap follow-up: `STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY`, then `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY` after the starting radar seed verifies cleanly.

## 2026-07-06 Patch Notes - Air Combat Reports and UFO Damage Memory

Build `v0.26.07.06.0130_AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY_PATCH` makes interceptor outcomes easier to review and gives damaged UFO escapes a small persistent consequence layer:

- Added compact air-combat after-action reports for launch, impact, delayed crash, and aircraft recovery phases.
- UFO Tracking now surfaces the latest Air Combat report card and per-contact Last air contact summaries.
- Damaged Escape outcomes now attach lightweight UFO damage memory with a follow-up hit bonus and delayed crash chance.
- Damaged UFO memory advances only through Geoscape clock time; damaged contacts can later create delayed crash-site incidents.
- Save/load migration normalizes older UFO contacts and air-combat report history safely.
- Build Health now includes `Air combat after-action reports and UFO damage memory persist`, covering report creation, damaged-UFO memory, delayed crash behavior, report normalization, stance continuity, multi-base interceptor selection, and interceptor return recovery.

Verification checklist:
- Open Geoscape and confirm the UFO Tracking panel loads.
- Launch an interceptor and confirm Latest Air Combat appears with outcome, stance, aircraft, fuel/ammo, and roll information.
- Confirm damaged escapes show Last air contact plus UFO damaged follow-up/crash chance text on the contact.
- Advance Geoscape time and confirm damaged-UFO delayed crash behavior does not break normal UFO detection/escape flow.
- Confirm Build Health passes the new `Air combat after-action reports and UFO damage memory persist` row.

Roadmap follow-up: `AIRCRAFT_FUEL_TANK_UPGRADES_INDEX_ONLY`, with `STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY` still queued as a small starting-base quality-of-life patch.

## 2026-07-05 Patch Notes - New Base Placement Confirmation UI Fix

Build `v0.26.07.05.0230_NEW_BASE_PLACEMENT_CONFIRMATION_UI_FIX_INDEX_ONLY_PATCH` corrects the Geoscape placement flow where the globe entered base-placement mode but the actual confirmation controls were not visible to the player:

- The New Base Site confirmation controls now render directly above the Geoscape globe whenever placement mode is active.
- The visible placement panel includes the base name field, selected region/location summary, construction cost, projected funds after construction, validation reason, and confirm button.
- The existing Cancel Base Placement button remains in the Geoscape action row.
- Confirm construction is disabled until the base has a name and the council has enough funds.
- Existing `buildNewBase` behavior remains the construction authority, preserving the single-file architecture and save compatibility.
- Build Health now includes a row for new-base placement confirmation state and the new-base creation contract.

Verification checklist:
- Click Build New Base and confirm the New Base Site panel appears above the globe without scrolling.
- Enter a valid base name and confirm the button enables when funds are sufficient.
- Construct the base and confirm the new base appears with the Access Lift seed layout.
- Confirm Build Health passes the new `New-base placement confirmation stays visible and validates construction` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this UI bugfix verifies cleanly.

## 2026-07-05 Patch Notes - Skyranger Base and Soldier Location Fix

Build `v0.26.07.05.0220_SKYRANGER_BASE_AND_SOLDIER_LOCATION_FIX_INDEX_ONLY_PATCH` corrects the Skyranger equivalent of the multi-base aircraft-origin bug:

- Skyranger sortie selection now evaluates ready Skyrangers from their assigned `baseId` / `hangarKey` base instead of the currently selected or first base.
- Mission response soldiers now carry a save-compatible `baseId`; old saves with missing soldier base state normalize to the campaign selected/first base.
- Mission launch only selects a Skyranger whose launch base contains the assigned response force.
- Launch blocking now reports whether the blocker is no ready Skyranger, soldiers not stationed at a ready Skyranger base, route range, or fuel.
- Skyranger travel still consumes fuel at launch, advances by Geoscape clock time, preserves the launch base for arrival/return, and restores Ready status after the return leg.
- Manual tactical missions and simulated missions now resolve the response force against the preserved launch base.
- Selected-base live activity and base-defense preview data now use soldiers stationed at that base rather than every global soldier.
- Build Health now includes Skyranger assigned-base selection, wrong-base soldier blocking, multi-base matching, range/fuel continuity, and old-save soldier base fallback checks.

Verification checklist:
- Build or load a multi-base campaign with a Skyranger in a secondary base and soldiers still stationed at the first base; confirm launch is blocked with a soldier-location reason.
- Station or recruit soldiers at the same base as a ready Skyranger and confirm mission launch originates from that Skyranger's base.
- Confirm existing interceptor multi-base range behavior still passes.
- Confirm Build Health passes the new `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this bugfix verifies cleanly.

## v0.26.07.10.0100 - Interceptor Ferry-Staged Reach Recognition Fix

Build `v0.26.07.10.0100_INTERCEPTOR_FERRY_STAGING_RECOGNITION_FIX_INDEX_ONLY_PATCH` fixes a UFO Tracking/readiness gap in the ferry/refuel staging seed:

- Interceptor readiness text now consults the ferry/refuel staging planner after direct home-base range checks fail.
- UFOs reachable by ferrying to another base, refueling, then flying the final round trip are labeled as staged-route targets instead of being reported as simply out of range.
- Launch blockers now explain that a staged route was found but direct launch execution cannot yet fly the staged sortie.
- Build Health includes `Interceptor UFO tracking recognizes ferry-staged reach`.

Verification checklist:
- Confirm a UFO beyond direct interceptor round-trip range can show `staged route available` when a valid staging base has an open hangar.
- Confirm direct interceptor launches still behave as before.
- Confirm Build Health passes, including the new staged-reach row.

Next recommended patch: `LIVE_AIRCRAFT_FERRY_STAGED_SORTIE_EXECUTION_INDEX_ONLY`, implementing actual multi-leg staged launch/return state now that recognition is correct.

## v0.26.07.11.0005 - Staged Aircraft Route Display and Skyranger Ferry Fix

Build `v0.26.07.11.0005_STAGED_AIRCRAFT_ROUTE_DISPLAY_AND_SKYRANGER_FERRY_FIX_INDEX_ONLY_PATCH` syncs the recent staged-interceptor work and fixes the visible ferry-route issue:

- Records the ChatGPT-applied staged-interceptor execution work in the bible: staged interceptor launches can carry route phases, recover to the staging base, and ask whether to attack again or ferry home if the UFO survives.
- Adds phase-aware Skyranger travel display so transports do not appear to launch from the closest/staging base when they actually originate elsewhere.
- Allows Skyranger mission launch to use the existing ferry/refuel planner when a same-base squad and transport can reach a forward base with an open hangar, refuel, then continue to the incident.
- Staged Skyranger mission state preserves the original base, forward launch base, return hangar, route description, ferry/refuel timing, and final return base.
- Build Health includes `Staged aircraft routes display origin ferry legs`.

Verification checklist:
- Confirm an interceptor staged sortie visibly starts at its origin base and follows ferry/refuel/attack phases.
- Confirm a staged Skyranger visibly departs its home base before the final incident leg.
- Confirm direct interceptor and direct Skyranger launches still behave normally.
- Confirm Build Health passes, including `Staged aircraft routes display origin ferry legs`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY`, making multi-craft staged backup choices clearer in the launch confirmation UI and adding stronger route-line visualization for every ferry leg.

## v0.26.07.11.0015 - Skyranger Ferry-Staged Incident Response Fix

Build `v0.26.07.11.0015_SKYRANGER_FERRY_STAGED_INCIDENT_RESPONSE_FIX_INDEX_ONLY_PATCH` hardens Skyranger use of the ferry/refuel staging system so incident response behaves more like the updated interceptor staging flow:

- Skyranger mission confirmation now displays the full staged ferry/refuel plan when direct home-base round-trip range is not enough.
- Staged Skyranger confirmation text names the boarding/origin base, staging base, ferry distance, refuel stop, final incident round trip, and route fuel budget.
- Local loadout checks in the mission confirmation now use the boarding/origin base where the soldiers and Skyranger actually start, not the forward staging base.
- Build Health includes `Skyranger ferry staging extends incident response range`, covering a mission outside direct Skyranger range but reachable through an owned base with an open compatible hangar.
- The existing phase-aware staged Skyranger travel display and direct Skyranger launch behavior are preserved.

Verification checklist:
- Confirm a Skyranger/squad whose incident is outside direct round-trip range can use a valid open-hangar staging base when the ferry leg and final staging-base round trip are both valid.
- Confirm the launch confirmation explains the ferry/refuel route instead of only showing the final staging-base leg.
- Confirm the loadout warning/stock text references the soldiers' boarding base.
- Confirm closing the staging-base hangar blocks the staged route.
- Confirm Build Health passes, including `Skyranger ferry staging extends incident response range`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`, fixing friendly staging-base landing/refuel presentation and visible return-home ferry-route replay after staged interceptor attacks.

## v0.26.07.11.0020 - Base Placement Ferry Lanes and Skyranger Staging Fix

Build `v0.26.07.11.0020_BASE_PLACEMENT_FERRY_LANES_AND_SKYRANGER_STAGING_FIX_INDEX_ONLY_PATCH` adds the requested new-base siting readability pass on top of the Skyranger ferry-staged incident response work:

- New-base placement ferry previews now split Interceptor and Skyranger connection lines into separated side-by-side dotted lanes instead of collapsing both aircraft types into one line.
- Interceptor ferry lanes use the existing yellow aircraft-range language; Skyranger ferry lanes use the existing blue transport-range language.
- A proposed site that can connect to an existing base by both aircraft types now shows both lanes at once, making it easier to tell whether the new base can join the ferry network for combat craft, transports, or both.
- Existing range rings, base-placement confirmation, ferry reach math, and Skyranger staged incident response behavior are preserved.
- Build Health includes `New-base placement previews separated Interceptor and Skyranger ferry lanes`.

Verification checklist:
- Click Build New Base and confirm existing-base ferry links render as adjacent colored dotted lanes when both Interceptors and Skyrangers can make the one-way ferry leg.
- Confirm one-type ferry links still render as a single dotted lane in that craft type's color.
- Confirm the text summary still names connected bases, one-way distance, and eligible aircraft types.
- Confirm Build Health passes, including `New-base placement previews separated Interceptor and Skyranger ferry lanes` and `Skyranger ferry staging extends incident response range`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`, fixing friendly staging-base landing/refuel presentation and visible return-home ferry-route replay after staged interceptor attacks.

## v0.26.07.11.0025 - Staged Route Labels and Day/Night Globe Readability

Build `v0.26.07.11.0025_STAGED_ROUTE_LABELS_AND_DAY_NIGHT_GLOBE_READABILITY_INDEX_ONLY_PATCH` continues the staged-sortie UI roadmap and improves Geoscape globe readability:

- Staged aircraft markers now display a compact current route phase label directly on the Geoscape globe, covering ferry, refuel, attack, mission, and return phases.
- The Geoscape globe header now includes a Solar readout that names Daylight, Night Side, Dawn Line, or Dusk Line and summarizes the current day/night mix.
- The SVG terminator overlay uses stronger shade placement, a clearer twilight ring, and a brighter sun glow so the day/night cycle is easier to parse at a glance.
- Three.js globe lighting now syncs sunlight, ambient light, and back-light intensity to the same day/night helper.
- Staged route phase labels use readable title-cased ferry text so the Geoscape label and Build Health route-label checks agree.
- Existing opaque detailed landmasses, globe dragging, base-placement ferry lanes, Skyranger staged incident response, and interceptor staged route behavior are preserved.
- Build Health includes `Staged aircraft route labels and day-night globe lighting are readable`.

Verification checklist:
- Open the Geoscape and confirm the globe header shows a Solar day/night readout.
- Advance time through morning/evening and confirm the terminator and sun glow visibly shift.
- Launch or simulate a staged route and confirm the current ferry/refuel/attack/return phase label appears near the aircraft marker.
- Confirm Build Health passes, including `Staged aircraft route labels and day-night globe lighting are readable`.

Next recommended patch: `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`, focusing on the staged interceptor landing/refuel presentation at friendly bases and replaying the return-home ferry route after attacks.

## v0.26.07.11.0030 - Sun Glow Overlay Softening

Build `v0.26.07.11.0030_SUN_GLOW_OVERLAY_SOFTENING_INDEX_ONLY_PATCH` is a small visual correction after the day/night readability pass:

- The Geoscape sun-glow cue was softened so it no longer reads as a literal yellow ball overlaid on the Earth.
- Both `geoscapeTerminatorOverlay` helper definitions now return the same explicit `sunGlowOpacity` and twilight data, preventing the SVG glow circle from falling back to full opacity.
- The glow is broader and opacity-capped, preserving the readable day/night lighting direction while keeping attention on the globe surface.
- Existing Solar readout, terminator shade, twilight ring, staged route labels, globe dragging, opaque landmasses, and aircraft ferry/staging behavior are preserved.

Verification checklist:
- Confirm the Geoscape globe still shows a readable day/night terminator and Solar readout.
- Confirm the former yellow sun-ball cue is no longer visually dominant on the globe.
- Confirm Build Health passes after the visual-only correction.

Next recommended patch remains `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`.


## v0.26.07.11.1650 - Transfer Time Sync Fix

Build `v0.26.07.11.1650_TRANSFER_TIME_SYNC_FIX_INDEX_ONLY_PATCH` was applied outside this Codex pass and then inspected here before further roadmap work:

- The playable `index.html` build label advanced from the sun-glow patch to the transfer time sync fix.
- App-script syntax parsing passed during inspection.
- The bible and manifest were found stale at `v0.26.07.11.0030_SUN_GLOW_OVERLAY_SOFTENING_INDEX_ONLY_PATCH` and required sync before the next patch.
- Existing staged interceptor and Skyranger ferry-route helpers, return-route planning, and clock-based route progress were present in the inspected build.

Verification checklist:
- Confirm manifest and bible match the playable build before future patches.
- Confirm Build Health after the metadata sync and any follow-up code changes.

Next recommended patch remained `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`.


## v0.26.07.11.1715 - Staged Sortie Friendly-Base Visual and Return Hardening

Build `v0.26.07.11.1715_STAGED_SORTIE_FRIENDLY_BASE_VISUAL_AND_RETURN_HARDENING_INDEX_ONLY_PATCH` tightens the staged ferry/interceptor presentation without changing the save format:

- Added a phase-aware interceptor combat-visual guard so weapon fire and hit explosions only render during `attack-outbound` phases.
- Friendly ferry, staging-base refuel, return-to-stage, and ferry-home phases remain visible as route labels/movement but no longer look like the interceptor is attacking a friendly base.
- The hit explosion timing now keys off the route plan's `impactProgress` instead of the old fixed `94-128` global-progress window, which could overlap friendly refuel phases on staged sorties.
- Added Build Health coverage for staged friendly-base phases staying non-combat while the actual attack leg remains combat-enabled.
- Tightened ferry staging so the final staging/destination base must have a real open hangar; transient route handling is no longer allowed to stand in for an occupied destination hangar.
- Fixed fast-forward recovered-soldier auto-equip so completed Workshop gear is seeded into the temporary equipment pool before recovered soldiers try to equip it.
- Synced `src/manifest.json` and the seam checker to the new build label.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Browser smoke from `http://127.0.0.1:5173/index.html` passed: start screen, first-base setup, first-base confirmation, and main Geoscape loaded.
- Browser Build Health passed `226/226`.
- Browser console errors: none from the game page.
- In play, staged interceptor ferry/refuel phases should show ferry/refuel labels, not weapon fire or explosion effects; confirmed hits should still show impact at the UFO and route home when applicable.

Next recommended patch: `STAGED_SORTIE_RETURN_DECISION_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY`, focusing on clearer post-attack choices for staged interceptors that miss or disengage and stronger multi-craft staged sortie confirmation text.


## v0.26.07.11.1730 - Staged Sortie Return Decision and Multi-Craft Backup Polish

Build `v0.26.07.11.1730_STAGED_SORTIE_RETURN_DECISION_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY_PATCH` continues the staged aircraft ferry roadmap while preserving save format 4:

- Added a compact sortie-selection summary helper so staged interceptor launches can name direct vs staged craft, the staging base, and the ferry route used.
- Polished the staged interceptor post-attack ferry decision modal with route, home-base, staging-base, and formation details.
- The Attack UFO Again action now checks whether enough eligible ready aircraft can reengage before it is enabled or executed.
- Multi-craft staged interceptor selection now reserves distinct open hangars at the staging base, preventing a pair of aircraft from sharing one empty hangar slot.
- Added Build Health coverage for clear staged return decisions and multi-craft staged backup hangar reservation.

Verification checklist:
- Run `node tools\\check-aegis-build.cjs`.
- Run a static app-script parse.
- Run browser smoke and Build Health from `http://127.0.0.1:5173/index.html` when localhost is available.
- In play, test a staged interceptor miss/disengage and confirm the decision modal clearly offers attack again only when valid, or ferry home to the original base.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_MANUAL_TEST_POLISH_INDEX_ONLY`, focusing on small visible route timeline improvements for staged ferry/attack/return phases and any manual-test findings from staged sortie play.

## v0.26.07.11.1740 - Staged Sortie Backup Hangar Reservation Fix

- Fixed a staged-interceptor formation fallback where backup selection could still treat one open staging hangar as enough for multiple aircraft after grouped selection failed.
- Backup interceptor formation selection now reserves distinct staging hangars in the fallback path too, keeping ferry staging capacity honest.
- Browser Build Health exposed the issue at 226/227; this fix restored the staged sortie return decision and multi-craft backup row.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.11.1740_STAGED_SORTIE_BACKUP_HANGAR_RESERVATION_FIX_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke confirmed start screen, first base confirmation, and Geoscape load.
- Browser Build Health passed `227/227`.
- Browser console errors: none from the game page.

Next recommended patch: STAGED_SORTIE_ROUTE_TIMELINE_AND_MANUAL_TEST_POLISH_INDEX_ONLY.

## v0.26.07.11.1755 - Staged Sortie Route Timeline Readout

Build `v0.26.07.11.1755_STAGED_SORTIE_ROUTE_TIMELINE_READOUT_INDEX_ONLY_PATCH` adds a compact route timeline readout while preserving save format 4:

- Added an active route timeline helper for Skyranger and interceptor route phases.
- Geoscape globe now shows a lightweight active route timeline strip during aircraft travel, including ferry, refuel, attack/mission, and return leg coloring.
- Added Build Health coverage for current phase text, progress conversion, and route segment coloring.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Browser smoke confirmed start screen, first base confirmation, and Geoscape load from `http://127.0.0.1:5173/index.html`.
- Browser Build Health passed `228/228`.
- Browser console errors: none from the fixed `1755` game page.
- In play, staged aircraft routes should show a bottom-of-globe route timeline during active travel.

Next recommended patch: STAGED_SORTIE_ROUTE_TIMELINE_MANUAL_FLOW_HARDENING_INDEX_ONLY.

## v0.26.07.12.1010 - Tactical 3D Victory Dance and Equipment Colors Sync

Build `v0.26.07.12.1010_TACTICAL_3D_VICTORY_DANCE_AND_EQUIPMENT_COLORS_INDEX_ONLY_PATCH` was applied outside this Codex pass and then inspected here before further roadmap work:

- Current `index.html` now reports the tactical 3D victory dance / equipment color patch.
- Added/confirmed Build Health coverage for a Three.js isometric tactical battlemap that reuses tactical hex state, natural cover, equipment colors, and victory display behavior.
- Synced `src/manifest.json` and `tools/check-aegis-build.cjs` to the actual current build so seam checks no longer point at stale `1755` metadata.
- Optimization note: the current build is still playable as a single-file artifact, but external patching appears to have dropped the recently added staged-sortie route timeline and staged-return decision Build Health rows. Treat that as a roadmap hardening item rather than assuming the previous staged-route polish is fully covered.

Verification checklist:
- `node tools\\check-aegis-build.cjs` should pass after this sync.
- Static app-script parse should pass.
- Browser smoke should confirm start screen, first base confirmation, and Geoscape load from `http://127.0.0.1:5173/index.html`.
- Browser Build Health initially failed `221/226` on the inspected tactical 3D build, which led directly to the follow-up ferry staging and fast-forward regression fix.
- Browser console errors should be checked after reload.

Next recommended patch at the time of inspection: `FERRY_STAGING_AND_FAST_FORWARD_REGRESSION_FIX_INDEX_ONLY`, restoring ferry staging and fast-forward coverage before further roadmap work.

## v0.26.07.12.1025 - Ferry Staging and Fast-Forward Regression Fix

Build `v0.26.07.12.1025_FERRY_STAGING_AND_FAST_FORWARD_REGRESSION_FIX_INDEX_ONLY_PATCH` hardens the externally added tactical 3D build after browser Build Health exposed ferry/fast-forward regressions:

- Restored real-open-hangar requirements for aircraft ferry staging and UFO tracking staged reach. Transient staging slots no longer satisfy live sortie planning.
- Restored staged multi-interceptor hangar reservation so backup aircraft cannot overbook one staging hangar.
- Restored fast-forward recovered-soldier auto-equip behavior so completed Workshop gear is seeded before recovered soldiers choose replacement equipment.
- Updated Build Health expectations around closed staging bases and full-network ferry assignment to match the real-hangar rule.

Verification checklist:
- `node tools\\check-aegis-build.cjs` should pass.
- Static app-script parse should pass.
- Browser smoke should confirm start screen, first base confirmation, and Geoscape load.
- Browser Build Health should return to all-pass from the observed `221/226` failure state.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY`, restoring the route timeline/readout and post-attack ferry decision coverage on top of the tactical 3D work.

## v0.26.07.12.1030 - Build Health Stabilization and Bible Sync

Build `v0.26.07.12.1030_BUILD_HEALTH_STABILIZATION_AND_BIBLE_SYNC_INDEX_ONLY_PATCH` follows the external tactical 3D work and the 1025 ferry regression fix with a small verification stabilization pass:

- Synced the playable `index.html` build constant with `src/manifest.json` so the seam checker and start screen point at the same current build lineage.
- Corrected the full-network ferry self-test target so the final staging base is actually within the interceptor's post-refuel round-trip range under real-open-hangar rules.
- Stabilized the memorial-offering variety self-test so randomized tribute selection no longer creates false negative Build Health rows when the expanded catalog is present.
- Confirmed the 1010 tactical 3D sync notes remain distinct from the later 1025 ferry regression notes.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Local diagnostic self-test harness passed with no failing rows.
- Browser smoke passed from `http://127.0.0.1:5173/index.html`: start screen, first base confirmation, and Geoscape load.
- Browser Build Health passed `226/226`.
- Browser console errors were clear.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY`, then continue into the next roadmap systems once staged-route UX coverage is fully restored.


## v0.26.07.12.1115 - Staged Sortie Route Timeline and Return Decision Restore

Build `v0.26.07.12.1115_STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY_PATCH` restores the visible staged-sortie route readout on top of the ferry staging systems:

- Added a compact Geoscape route timeline panel for active interceptor and Skyranger ferry sorties.
- Timeline rows show queued, active, and completed ferry, refuel, attack, incident, and return legs.
- Staged interceptor post-attack decisions now summarize the staging base, origin base, and return-home route.
- Friendly staging-base arrival/refuel remains a non-combat route phase rather than a base attack.
- Cleaned the backup reminder funds line so corrupted replacement characters no longer appear before Funds.
- Build Health coverage now checks staged interceptor timeline/decision restoration and staged Skyranger ferry/refuel/incident/return route summaries.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1115_STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke passed from `http://127.0.0.1:5173/index.html`: start screen, first base confirmation, and main Geoscape load.
- Browser Build Health passed `228/228`, including the staged route timeline rows.
- Browser console errors were clear.
- Manual follow-up should launch a ferry-staged interceptor and Skyranger to confirm the route panel is readable during live travel.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY`, focused on manual staged-sortie playtest findings, attack-again/ferry-home flow polish, and any remaining route visualization edge cases. Near-term tactical candidate after the ferry/staged-sortie flow is stable: `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY`.

## Roadmap Addition - Tactical Three.js Alien Incident Battle Polish

Future patch candidate: `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY`.

Goal: improve the Three.js battle option for alien incidents so it becomes a clearer, more satisfying tactical choice rather than a novelty beside auto-resolve/classic simulation.

Planned scope:

- Improve tactical camera framing, zoom defaults, and unit readability on the Three.js battlefield.
- Make soldier and alien silhouettes, facing, movement paths, cover, overwatch/shot intent, hit/miss feedback, and deaths easier to read.
- Keep alien incidents, landed UFO missions, crash sites, and future terror missions using a shared tactical battle presentation where possible.
- Preserve existing tactical simulation helpers, mission reports, soldier XP/wounds/KIA handling, equipment recovery, and local-base Skyranger return logic.
- Keep tactical mode isolated from Geoscape clock advancement until the mission resolves.
- Add small tactical UI affordances for selected unit, current weapon, cover/line-of-sight hints, and end-turn/resolve state.
- Add Build Health coverage for tactical Three.js initialization, selected-unit display, cover/LOS consistency, hit/miss event rendering metadata, mission completion handoff, and no-regression auto-resolve/classic lineup paths.

Design note: this should remain an index-only polish pass until the tactical architecture is ready for a larger extraction. Avoid a broad tactical rewrite; make the current Three.js option visibly better and easier to test.


## v0.26.07.12.1140 - Tactical Three.js Readability Seed

Build `v0.26.07.12.1140_TACTICAL_THREEJS_READABILITY_SEED_INDEX_ONLY_PATCH` starts the tactical Three.js alien-incident polish roadmap without changing save format:

- Added a compact tactical readability overlay for the Three.js battle view that summarizes selected unit, weapon kind, cover state, HP/TU, current turn, and fire mode.
- Added a deterministic helper for tactical readability text so future camera/LOS/selection polish has a tested contract.
- Added Build Health coverage for the tactical readability overlay helper while preserving the existing Three.js tactical battlemap coverage.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1140_TACTICAL_THREEJS_READABILITY_SEED_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser Build Health should include the new Three.js tactical readability row on the next manual/browser pass.

Next recommended patch remains `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` for live ferry-route playtest hardening, with `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY` queued as the next tactical polish lane.

## v0.26.07.12.1210 - Tactical Three.js Incident Battle Polish

Build `v0.26.07.12.1210_TACTICAL_THREEJS_INCIDENT_BATTLE_POLISH_INDEX_ONLY_PATCH` expands the alien-incident Three.js tactical polish pass without changing save format:

- Tactical missions now default to the Three.js view when the bundled renderer is available, with the existing 2D Hex view still available as a manual fallback.
- Expanded the Three.js tactical readability overlay with selected soldier weapon, cover, HP/TU, ammo, fire mode, visible hostile count, line-of-sight target count, and reachable movement count.
- Added terrain-aware Three.js ground hex coloring so forest/brush, city/terror, crash/wreck, rock, crate, and open tiles read closer to the 2D tactical maps.
- Added Build Health coverage for the enhanced Three.js tactical incident battle readout, terrain color diversity, and 3D default/fallback seam.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1210_TACTICAL_THREEJS_INCIDENT_BATTLE_POLISH_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke confirmed the start screen shows `V0.26.07.12.1210`, first-base setup works, and Geoscape loads after confirming Fort Aegis.
- Browser Build Health passed `230/230` and includes `Three.js tactical incident battle polish shows terrain colors LOS movement ammo and 3D defaults`.
- Browser console check found no game runtime errors; the only warning observed was the existing Tailwind CDN production warning.
- Manual tactical smoke should verify Three.js incident maps open by default when available, 2D Hex remains selectable, and 3D tile colors feel closer to the 2D map.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` remains the route-flow priority, especially interceptor post-attack re-attack/send-home decisions and Skyranger staged-route manual playtesting. Tactical follow-up candidate: add stronger Three.js camera controls, cover markers, and selected-target previews after the ferry flow is stable.

## v0.26.07.12.1240 - Procedural Tactical Biomes

Build `v0.26.07.12.1240_PROCEDURAL_TACTICAL_BIOMES_INDEX_ONLY_PATCH` replaces the remaining cyan/holographic Three.js ground treatment with deterministic mission biomes without changing save format:

- Added Wilderness, Farmland, Small Town, and Urban District tactical environments selected from mission intent and mission seed.
- Unified the 2D and Three.js tactical views around the same procedural terrain data so paths, streams, roads, service lanes, irrigation ditches, fields, lawns, yards, and urban lots remain consistent when switching views.
- Natural maps can generate winding dirt paths and streams; farm maps generate crop bands, pasture, tilled soil, lanes, irrigation, hay, fencing, and crop cover.
- Small-town and city maps generate roads and lanes with environment-specific concrete, fencing, crates, wrecks, yards, lawns, and sparse vegetation.
- Replaced the default cyan Three.js tile and lighting treatment with opaque natural/urban ground colors, warmer daylight, biome-colored fog/backgrounds, and subdued neutral tile seams. Selection and movement highlights remain distinct.
- Added Build Health coverage for deterministic biome selection, terrain diversity, paths/water/roads, environment-specific cover, and shared 2D/Three.js terrain colors.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1240_PROCEDURAL_TACTICAL_BIOMES_INDEX_ONLY_PATCH`.
- Static app-script parsing passed after the final terrain and lighting edits.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, Skyranger mission launch, clock-based incident arrival, and opening a live Three.js tactical mission.
- Browser Build Health passed `231/231`, including `Procedural tactical biomes generate wilderness streams city roads farms and small towns`.
- The live opening incident rendered as a Wilderness battlefield with opaque varied ground colors and reported shared 2D/Three.js terrain state. Final lighting was reduced and filmic color handling added after the smoke screenshot showed over-bright greens/browns.
- Browser console contained no game runtime errors. The existing Tailwind development-CDN warning remains non-blocking.
- Additional manual variety testing should open Farmland, Small Town, and Urban District incidents and confirm their roads, lanes, irrigation, structures, and traversal feel distinct during normal play.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` remains the campaign-flow priority. The next tactical follow-up should add Three.js camera controls, cover markers, and selected-target previews after biome playtesting.

## v0.26.07.12.1310 - Aircraft Ferry Range and Home Return Hardening

Build `v0.26.07.12.1310_AIRCRAFT_FERRY_RANGE_AND_HOME_RETURN_HARDENING_INDEX_ONLY_PATCH` audits and hardens interceptor/Skyranger ferry-network eligibility and return-home state without changing save format:

- Aircraft now normalize separate permanent `homeBaseId` / `homeHangarKey` identity alongside mutable current base/hangar location. Old saves infer home identity from their existing aircraft assignment.
- UFO Tracking and interceptor launch now use the same unified per-aircraft eligibility result, preferring a valid direct sortie and otherwise using a valid ferry/refuel route.
- Staged interceptors retain their original home base and outbound ferry route after a surviving-UFO pass, including through a repeat attack.
- A repeat attack that destroys the UFO now includes the reverse ferry/refuel route and does not silently treat the staging base as the aircraft's permanent home.
- The post-pass decision validates that the same aircraft are present and ready, the UFO remains tracked/detected, and it is still reachable before enabling another attack.
- Aircraft undergoing staging-base repair/refuel keep the decision pending without blocking Geoscape controls; the decision appears when the flight becomes ready.
- Blocked attack/return actions no longer erase the pending decision. The player can also intentionally keep the flight at its staging base while preserving its permanent home identity.
- Skyranger staged mission return remains incident site -> staging base -> reverse ferry route -> original home base, now backed by the same normalized aircraft home identity.
- Added Build Health coverage for old-save home normalization, direct reach from a current operating base, ferry-network reach, vanished contacts, repair waits, repeat-attack home lineage, reverse ferry phases, and final home-base recovery.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1310_AIRCRAFT_FERRY_RANGE_AND_HOME_RETURN_HARDENING_INDEX_ONLY_PATCH`.
- Static app-script parsing passed after the final route-contract wording fix.
- Localhost browser smoke passed through the start screen, first-base confirmation, and main Geoscape.
- Browser Build Health passed `232/232`, including `Aircraft ferry range and home return preserve direct staged and repeat-attack routes` and the existing staged-route timeline checks.
- Browser console contained no game runtime errors.
- Manually test a direct interceptor sortie and confirm it returns to its assigned home hangar.
- Manually test a staged miss, another attack, and a later shootdown; confirm the route returns through the staging/ferry network to the original home base.
- Let a UFO disappear after a staged pass and confirm re-attack is disabled while Ferry Back Home remains available.
- Run a staged Skyranger incident and confirm the return timeline reaches its original base after the mission.

Next recommended patch: `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, focused on canceling queued orders safely, returning reservations to the correct hangar state, and separating serial queue ownership from the future multi-flight travel model.

## v0.26.07.12.1415 - Geoscape Ferry Network Overlay

Build `v0.26.07.12.1415_GEOSCAPE_FERRY_NETWORK_OVERLAY_INDEX_ONLY_PATCH` was integrated externally after the 1310 handoff:

- Added player-controlled Interceptor and Skyranger ferry-network line filters to the Geoscape.
- Added Show Both and Hide Lines controls plus a connectivity summary for isolated bases.
- Kept ferry-network lines separate from range overlays and new-base placement previews.
- Added Build Health coverage for network filtering, one-way link visibility, lane types, and isolated-base reporting.

This external patch was inspected and preserved by the 1500 loaded-save eligibility pass.

## v0.26.07.12.1500 - Loaded-Save Interceptor Eligibility Fix

Build `v0.26.07.12.1500_LOADED_SAVE_INTERCEPTOR_ELIGIBILITY_FIX_INDEX_ONLY_PATCH` fixes loaded campaigns that could show nearby UFOs and home-base interceptors while leaving all interception controls unavailable, without changing save format:

- Legacy UFO records with tracking history but no explicit `detected` field now retain a firing-quality radar lock after normalization.
- Explicit modern `detected: false` contact-lost states remain false and still require radar reacquisition.
- Active Interceptor travel, Skyranger travel, and pending staged-return decisions are now included in campaign saves and restored on load.
- Migration now consults saved interceptor travel before applying stale-airborne recovery, preventing a legitimate active sortie from being incorrectly converted to Repairing.
- UFO Tracking now distinguishes a visible radar echo without firing-quality lock from aircraft readiness blockers and summarizes non-ready aircraft statuses.
- Added a deterministic loaded-save fixture with two ready North America interceptors and two nearby North America UFOs, including legacy radar-lock inference, home-base/hangar preservation, per-contact launch eligibility, explicit contact-lost preservation, and active-travel preservation.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1500_LOADED_SAVE_INTERCEPTOR_ELIGIBILITY_FIX_INDEX_ONLY_PATCH`.
- Static app-script parsing passed.
- Localhost browser smoke confirmed the 1500 start screen, loaded Autosave 2, and rendered the main Geoscape.
- Browser Build Health passed `234/234`, including `Loaded saves preserve interceptor eligibility and active travel`.
- No game runtime exception surfaced during the browser smoke or Build Health pass.
- Manually load the affected two-UFO North America campaign and confirm each detected contact enables `1 Interceptor` while a ready local craft remains available.
- Confirm an explicit contact-lost radar echo remains blocked and now explains that Geoscape time must advance for reacquisition.
- Save during a ferry/interception route, reload, and confirm the active route and original-home return decision remain intact.

Next recommended patch: `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY`, after manual confirmation of the new saved reservation and relocation flow.

## v0.26.07.25.0139 - Skyranger Ferry Airborne Hangar Release Fix

Browser build `v0.26.07.25.0139_SKYRANGER_FERRY_AIRBORNE_HANGAR_RELEASE_FIX_INDEX_ONLY_PATCH` preserves save format 4 and fixes a staged incident route reproduced from the supplied slot-10 browser export.

Root cause and implemented scope:

- Fort Aegis is about 10,820 km from the active South America incident, so the normal 21,640 km Skyranger round trip is correctly outside the standard 16,000 km range.
- S. America 1 is a valid staging base: the Fort Aegis ferry leg is about 8,792 km one way and the refueled incident round trip is about 7,098 km.
- Saber One had already departed S. America 1 and was Returning to Fort Aegis, but retained its S. America `hangarKey` for travel continuity. The generic slot lookup treated that stale departure key as physical occupancy while Fort Aegis also correctly held the craft's recovery reservation, blocking two hangars with one airborne craft.
- `aircraftOccupiesHangarSlot` now excludes only `Outbound` and `Returning` aircraft from physical departure-slot occupancy. Ready, Queued, and Repairing craft remain occupying, and destination/home reservation records continue to block their recovery hangars.
- The staging planner still requires a real open hangar. Transient staging and occupied-hangar overbooking remain disabled.
- Build Health now includes `Returning interceptors release departed staging hangars without losing home reservations`, using the supplied base, mission, range, and travel geometry.
- Multi-base ferry routing is recorded as a temporary browser-only gameplay parity exception because the current Godot vertical slice does not implement that strategic system.

Compatibility and risk:

- The supplied export was inspected read only and was not rewritten. Existing save records and save format 4 remain unchanged.
- The correction is constant-time inside the existing bounded fleet slot lookup and adds no Geoscape clock, tactical, pathfinding, visibility, rendering, or AI work.
- Manual validation should confirm the staged response in the exact export and verify that an actually occupied S. America hangar still blocks the route.

Verification completed during implementation:

- All six inline application scripts parsed.
- `node tools\check-aegis-build.cjs` passed for the 0139 build label and new occupancy seam.
- Browser Build Health passed `277/277`, including the supplied-save hangar-release regression and every prior ferry, tactical, and medical row.
- The supplied slot-10 export loaded through localhost without saving over the source file. Incident staging named Aegis One, Fort Aegis, S. America 1, the 8,792 km ferry, and the 7,098 km final round trip.
- Confirm Launch started the staged route, completed ferry/refuel/mission travel under the Geoscape clock, and opened the exact 12-soldier 64x64 safe-2D incident.
- Three End Turn cycles completed with control returning to the human turn and no browser application error. The only console warning was the existing Tailwind CDN production advisory.

## v0.26.07.24.0138 - Tactical Medkit and Wounded Recovery Parity Patch

Browser build `v0.26.07.24.0138_TACTICAL_MEDKIT_AND_WOUNDED_RECOVERY_PARITY_PATCH` preserves save format 4 and ports the pending native 0010 medical gameplay contract into the complete HTML campaign.

Implemented scope:

- Soldiers can issue or return one Medkit from the currently selected base. Issue consumes one local-store unit, return restores one, unavailable stock is disabled, repeated issue/return calls are idempotent, and existing weapon/armor mission-confirmation rules remain unchanged.
- An issued Medkit becomes one tactical charge. A selected injured living soldier can restore up to 12 HP for 12 TU; the charge is consumed immediately and HP, TU, movement highlighting, button state, campaign-soldier health, and tactical feedback update together.
- Full-health, no-charge, insufficient-TU, non-human-turn, dead/nonhuman, and no-selection attempts are rejected without changing medical state.
- Manual tactical completion carries each soldier's final HP and remaining Medkit charge into mission resolution. Surviving injured soldiers receive one recovery day per ten missing final HP, rounded up and capped from one to five days, and the after-action casualty line now identifies them instead of reporting no major casualties.
- Unused Medkits on KIA soldiers are recovered after victory and lost after defeat with mission-report feedback. Used charges remain consumed and surviving unused charges remain issued.
- Browser and native gameplay parity is now an explicit manifest/checker contract covering base-local ownership, the 12-HP/12-TU action, one-charge consumption, final-HP wound recovery, and victory-recovery/defeat-loss behavior.

Performance and compatibility:

- Medkit use touches only the selected unit and existing movement-preview state. Mission medical resolution scans only the bounded deployed roster. No tactical visibility, light, map-generation, pathfinding, civilian, alien-AI, or render-loop work was added.
- Save format remains 4. Missing soldier Medkit state defaults to false, existing browser inventory remains authoritative, and no active campaign or tactical save is rewritten during normalization.
- The browser Sickbay retains its existing bed-capacity and overflow behavior; the shared parity contract governs the player-facing medical action and ownership rules rather than forcing identical platform presentation.

Verification completed during implementation:

- All six inline application scripts parsed.
- `node tools\check-aegis-build.cjs` passed with matching browser/native labels, save format, medical constants, and parity-system declarations.
- Browser Build Health passed `276/276`, including four new medical/parity rows and every prior regression.
- A fresh unsaved localhost campaign bought one Medkit, issued it, returned it, and reissued it while local stock changed by exactly one each time.
- A six-soldier response launched into a 64x64 safe-2D incident. The carrier showed `Medkit ready`, the `Use Medkit - 12 TU` action correctly remained disabled at full HP, and three End Turn cycles returned control to the human turn without a runtime exception or lockup.
- Native counterpart verification remains `97/97` tests, `69/69` visible Build Health rows, strict Godot 4.7.1 parsing, and a hardware-rendered treatment plus three-turn tactical smoke.
- Browser work used a fresh unsaved campaign and native hardware work used an isolated in-memory campaign; no player save or browser export was overwritten.

Manual validation still required:

- Injure a browser Medkit carrier, use the action, and confirm HP rises by up to 12, TU falls by 12, the charge disappears, movement highlighting shrinks, and repeat use is disabled.
- Complete a browser mission with a surviving injured soldier and verify the final post-treatment HP produces the expected `Wounded - N days` state, save/reload persistence, midnight countdown, and return to duty.
- Confirm unused KIA Medkits return after victory and are lost after defeat in both versions.
- Repeat one bounded medical flow in an imported native copy and confirm the original browser export bytes remain unchanged.

Known risks:

- Self-treatment is the current paired scope. Adjacent ally aid, unconscious stabilization, body-part trauma, bleeding, multiple charges, and ground-item interaction remain deferred.
- Browser and native Sickbay presentation differs because the browser campaign already models bed capacity and overflow. Any future shared rule change must still be implemented and checked in both versions.

Next paired step after live validation: `TACTICAL_ADJACENT_FIELD_AID_AND_SICKBAY_PATIENT_ROSTER_PARITY_PATCH`, adding adjacent ally treatment and a focused patient roster to both versions without broad medical simulation.

## v0.26.07.19.GODOT.0010 - Tactical Medkit and Wounded Status Recovery Vertical Slice

Native build `v0.26.07.19.GODOT.0010_TACTICAL_MEDKIT_AND_WOUNDED_STATUS_RECOVERY_VERTICAL_SLICE` preserves save format 4 and follows player-verified 0009 with the smallest useful medical loop connecting manufactured Medkits, soldier loadouts, tactical damage, mission results, and strategic time.

Implemented scope:

- The Soldiers screen now displays loose Medkit stock and provides one binary Medkit control per living soldier. Issuing consumes one local item, returning restores one, repeated issue calls are idempotent, unavailable stock is disabled and rejected, and new recruits still arrive without free equipment.
- An issued Medkit becomes one tactical charge. The selected injured soldier can spend 12 TU to restore up to 12 HP; the charge is consumed immediately and authoritative HP, TU, movement range, button state, and Tactical Control feedback refresh together.
- Full-health, no-charge, insufficient-TU, non-human-turn, and no-selection attempts are rejected without changing HP, TU, or inventory.
- Tactical mission results preserve unused charges for survivors, consume used charges, recover unused Medkits from KIA soldiers after victory, and lose them with explicit field-loss feedback after defeat.
- Surviving soldiers below maximum HP enter `Wounded` status for one recovery day per ten missing final HP, rounded up and capped from one to five days. Final post-Medkit HP determines the duration.
- Wounded soldiers remain excluded from deployable assigned personnel. Each crossed strategic midnight decrements the exact timer; reaching zero restores `Ready` status and adds a medical-clearance report.
- Soldier cards show exact remaining recovery days. Native and imported-copy saves persist `medkit` ownership and `recovery_days`; legacy strings such as `Sickbay - 3 days` migrate conservatively.

Performance and compatibility:

- Medkit use touches only the selected unit. Wound recovery scans the bounded local roster only when strategic time crosses midnight; no tactical pathfinding, visibility, AI, civilian, map-generation, or render-loop workload was added.
- Save format remains 4. Missing Medkit ownership defaults to false, missing wounded timers default conservatively, negative loose stock clamps to zero, and issued ownership is not silently returned or duplicated during normalization.
- Browser imports preserve loose Medkit stock but do not infer issued medical items from ambiguous browser inventory shapes. The browser export remains read only.

Verification completed during implementation:

- Godot 4.7.1 strict editor parsing passed.
- Native tests pass `97/97`; visible native Build Health passes `69/69` through the same runner.
- Coverage includes Medkit issue/return/idempotence, save round-trip, legacy wound migration, exact 12-HP/12-TU tactical consumption, repeat-use rejection, post-treatment mission wounds, one-day midnight progression, exact partial recovery persistence, final clearance, successful KIA recovery, failed-mission loss, browser wound normalization, and every previous native regression.
- A hardware-rendered OpenGL smoke on the native main scene issued a Medkit, mounted the real Tactical Control UI, treated an injured soldier from 18/38 to 30/38 HP for 12 TU, showed `No medkit`, disabled repeat use, refreshed movement highlighting, and completed three End Turn cycles through human turn 4 without a lockup.
- The paired HTML build loaded through localhost, displayed build 0138, completed first-base setup, conserved Medkit stock across issue/return/reissue, reached Geoscape, launched a six-soldier 64x64 safe-2D incident, completed three End Turn cycles, and passed browser Build Health `276/276`.
- The hardware smoke used an unsaved in-memory campaign and the browser regression used a fresh unsaved browser campaign, so neither a native save nor a browser export was overwritten.

Manual validation still required:

- Issue and return a Medkit on the Soldiers screen and confirm loose stock changes by exactly one each time. Save/reload with one issued and confirm ownership and stock remain exact.
- Launch an injured Medkit carrier, use the tactical button, and confirm HP rises by up to 12, TU falls by 12, movement highlights shrink, the charge disappears, and a second use is disabled.
- Complete a mission with a surviving injured soldier, confirm the exact `Wounded - N days` roster status and deployment exclusion, save/reload, then cross each strategic midnight until medical clearance returns the soldier to duty.
- Confirm an unused Medkit on a KIA soldier returns after victory but is lost after defeat, with the corresponding command report.
- Repeat one bounded flow in an imported native copy and confirm the original browser export bytes remain unchanged.

Known risks:

- This slice supports self-treatment only. Adjacent ally treatment, stabilized unconscious soldiers, body-part trauma, bleeding, multiple charges, and item-ground interaction remain deferred.
- Recovery duration uses final missing HP and does not yet model Sickbay capacity, staff, facility damage, or treatment priority.

Next native step after live validation: `GODOT.0011_ADJACENT_FIELD_AID_AND_SICKBAY_PATIENT_ROSTER_VERTICAL_SLICE`, adding adjacent ally treatment and a focused patient view without broad medical simulation.

## v0.26.07.19.GODOT.0009 - Local Base Inventory and Soldier Loadout Vertical Slice

Native build `v0.26.07.19.GODOT.0009_LOCAL_BASE_INVENTORY_AND_SOLDIER_LOADOUT_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0008 construction gate with the smallest usable connection between Workshop output, local stores, soldier records, and tactical combat.

Implemented scope:

- Added content-defined Ballistic Rifle, Laser Rifle, Unarmed, Field Suit, and No Armor profiles. The Ballistic Rifle preserves the established 17-25 damage, seven-hex range, 16 TU shot, and 26 breach damage. The Laser Rifle uses 22-28 damage, nine-hex range, 14 TU shots, and 32 breach damage. Field Suits reduce incoming tactical damage by two.
- The Soldiers screen now exposes loose Ballistic Rifle, Laser Rifle, and Field Suit counts plus one compact weapon and armor selector per soldier.
- Loadout changes are atomic and base local: issuing an item consumes exactly one loose unit, while the previous issued item returns to the same stores record. Unavailable items are omitted and rejected by campaign state, preventing UI or direct-call duplication.
- Soldiers can deliberately return equipment by selecting Unarmed or No Armor. Existing imported equipment names remain preserved until the player chooses a supported native replacement.
- New recruits now arrive Unarmed and with No Armor so hiring cannot create free equipment outside Workshop/stores ownership.
- Saved weapon and armor names enter the native tactical unit record. Unarmed soldiers cannot shoot or breach; Laser Rifle range, damage, TU, and breach values affect live tactical actions; Field Suit mitigation affects alien damage.
- Tactical Control now republishes the authoritative selected-unit record whenever tactical state changes. Movement, shots, breaches, civilian contact, selection changes, and turn transitions therefore refresh displayed TU and HP in step with movement highlights and combat state.
- Successful missions recover issued weapon and armor from KIA soldiers into local stores. Failed missions remove that equipment as field losses and add explicit report feedback instead of leaving gear stranded on an unusable roster record.

Performance and compatibility:

- Equipment work is bounded to one soldier, two slots, and the small native content catalog per interaction. No tactical per-frame scan, map generation, pathfinding, visibility, civilian, alien-turn, or rendering workload was added.
- Native and imported-copy saves remain format 4. Soldier weapon/armor records and nonnegative store counts normalize conservatively; known native store keys are supplied without changing issued-item ownership.
- The browser export remains read only. Full browser Quartermaster rules, arbitrary imported equipment statistics, transfers, ammunition inventory, multiple bases, and body-part armor remain outside this vertical slice.

Verification completed during implementation:

- Godot 4.7.1 strict editor parsing passed.
- Native tests pass `88/88`; visible native Build Health passes `63/63` through the same runner.
- Coverage includes stock-conserving weapon/armor exchange, unavailable-item rejection, malformed stock/loadout migration, exact save/reload, unequipped recruits, successful KIA recovery, tactical profile inheritance, Unarmed fire rejection, a real range-eight Laser Rifle shot costing 14 TU, immediate selected-unit TU republishing from 64 to 50 after that shot, and all previous construction, manufacturing, import, aircraft, rescue, breach, and three-turn tactical regressions.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M loaded the 44-soldier imported Fort Aegis roster, displayed local Ballistic Rifle/Laser Rifle/Field Suit stock, exchanged both available Laser Rifles across assigned and unassigned soldiers without duplication, and rendered tactical combat through turn four without a lockup.
- The imported native-copy save was backed up before the live exchange and restored afterward to its exact original SHA-256 checksum. The browser source export was never written.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached the start screen, first-base setup, and Geoscape, and browser Build Health passed `272/272`. The runtime error overlay remained empty; console inspection found only the existing Tailwind production-CDN warning.

Player gate completed:

- During live tactical validation, the player identified that movement highlighting used the post-shot TU value while Tactical Control retained the selection-time value.
- Tactical state emission was corrected to republish the authoritative selected unit after every action and turn transition. The player confirmed the displayed TU now updates correctly and accepted 0009 for progression.
- Automated, Build Health, hardware GPU, and exact imported-copy restoration checks remain the recorded evidence for stock conservation, persistence, tactical profiles, Field Suit mitigation, Unarmed rejection, KIA recovery, and browser-source isolation.

Known risks:

- Native combat uses only the bounded catalog profiles. Unsupported imported equipment names remain display-preserved but use conservative fallback tactical values until exchanged for supported native equipment.
- Failed-mission KIA equipment is intentionally lost; successful-mission recovery is deterministic and does not yet model corpse access, mission extraction zones, or item-by-item salvage.

Next native step after live validation: `GODOT.0010_TACTICAL_MEDKIT_AND_WOUNDED_STATUS_RECOVERY_VERTICAL_SLICE`, making already manufactured Medkits useful without importing the browser game's full inventory, body-part injury, or Sickbay simulation.

## v0.26.07.19.GODOT.0008 - Base Facility Construction and Specialist Capacity Vertical Slice

Native build `v0.26.07.19.GODOT.0008_BASE_FACILITY_CONSTRUCTION_AND_SPECIALIST_CAPACITY_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0007 gate with the smallest local base-expansion loop needed to resolve full specialist facilities.

Implemented scope:

- Added Living Quarters, Laboratory, and Workshop projects using the browser campaign's established $300k, $450k, and $400k costs.
- Living Quarters take three crossed strategic midnights, Workshops take four, and Laboratories take five. Up to three projects advance concurrently.
- Construction is prepaid. A project occupies one bounded slot and grants no operational capacity until its exact completion day.
- Completed Living Quarters add 12 local personnel spaces, Laboratories add 10 Scientist spaces, and Workshops add 10 Engineer spaces. Existing hiring blockers immediately recalculate from the operational counts.
- Pending projects expose future facility count and capacity without permitting early specialist orders.
- Projects can be cancelled for half their prepaid cost. Identity, facility type, base ownership, cost, total duration, and exact days remaining persist in native or isolated imported-copy saves.
- The Base screen now combines construction catalog, operational/projected counts, three-slot status, funds, active progress, cancellation refund, personnel arrivals, and one shared strategic-day control.

Performance and compatibility:

- Construction is bounded to three records and updates only at strategic midnight; no tactical, rendering-loop, pathfinding, or per-frame work was added.
- Native 0001-0007 saves receive an empty construction list. Existing and imported repeated facility counts remain authoritative and are incremented only by completed local projects.
- Save format remains 4. Browser exports remain read only, and native/imported-copy slot isolation is unchanged.

Verification completed:

- Godot 4.7.1 strict editor parsing passed during implementation.
- Native tests pass `79/79`; visible native Build Health passes `58/58` through the same runner.
- Coverage includes exact established costs, three concurrent slots, full-queue blocking, no early capacity, projected capacity, independent countdowns, partial native save/reload, staggered completion, half-cost cancellation, specialist hiring reopening, and legacy empty-queue migration.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered imported Fort Aegis at 1440x900 with three partial projects, `[1, 3, 2]` days remaining, operational capacities `48/10/10`, and projected capacities `60/20/20`; catalog, progress, refunds, blockers, and personnel controls showed no horizontal overflow.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached first-base setup and Geoscape, browser Build Health passed `272/272`, and runtime errors were empty. The only warning was the existing Tailwind production-CDN notice.

Manual validation completed by player:

- The $1.15M three-project start, full-slot blocker, and no-early-capacity rules passed in imported Fort Aegis.
- Save/reload preserved exact project identities and 1/3, 3/5, and 2/4 days remaining.
- Day 3/4/5 capacity activation, reopened Scientist/Engineer hiring, half-cost cancellation, and unchanged browser source bytes all passed.

Next native step after live validation: `GODOT.0009_LOCAL_BASE_INVENTORY_AND_SOLDIER_LOADOUT_VERTICAL_SLICE`, making manufactured local-store equipment usable by native soldiers through a bounded weapon/armor assignment flow without importing the browser game's full Quartermaster, transfer, or multi-base logistics systems.

## v0.26.07.19.GODOT.0007 - Engineering Staffing and Manufacturing Queue Vertical Slice

Native build `v0.26.07.19.GODOT.0007_ENGINEERING_STAFFING_AND_MANUFACTURING_QUEUE_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0006 gate with the next bounded Workshop-management transition.

Implemented scope:

- Replaced instant Medkit and Laser Rifle delivery with a base-local prepaid FIFO queue capped at eight orders.
- Each assigned Engineer contributes three work points at each crossed strategic midnight, matching the browser campaign's established production rate. Assignment is bounded by both local Engineers and 10 spaces per Workshop.
- Medkits cost $40k and require 18 work. Research-gated Laser Rifles preserve the native slice's $180k cost and require 60 work.
- Only the active order receives work. Unused output from a completed order carries into the next FIFO order during the same midnight pass.
- Completed items enter local stores and release assigned Engineers when the queue empties. Cancelling any queued order returns half its prepaid cost.
- Workshop now exposes Engineer assignment, daily output, catalog authorization, local inventory, active/queued status, progress, FIFO ETA, cancellation refund, and one-day strategic advancement.
- Queue identifiers, item snapshots, progress, assignment, base ownership, funds, reports, and stores persist through save normalization without changing save format 4.

Performance and compatibility:

- Manufacturing is bounded to eight orders and advances only at strategic midnight; it adds no tactical or per-frame work.
- Native 0001-0006 saves receive an empty unstaffed queue. Browser-imported copies preserve their actual Workshop count and never mutate the browser source export.
- Tactical rules, air operations, personnel/research queues, active save paths, browser build 0137, and the single-file HTML artifact remain unchanged.

Verification completed:

- Godot 4.7.1 strict editor import and GDScript parsing passed.
- Native tests passed `70/70`; visible native Build Health passed `52/52` through the same run.
- Coverage includes locked production, Engineer/Workshop staffing clamps, prepaid orders, active-only midnight work, FIFO overflow, local-store completion, automatic staff release, half-cost cancellation, and exact partial-order normalization.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered the staffed Workshop catalog and scrolled partial-order queue at 1440x900 without clipping or horizontal overflow; seeded state read two orders, four assigned Engineers, 12 work per day, and 12/18 active progress.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached first-base setup and Geoscape, and browser Build Health passed `272/272`.
- Browser runtime errors were empty; the only warning was the existing Tailwind production-CDN notice.

Manual validation completed by player:

- Prepaid Medkit and Laser Rifle orders, Engineer assignment limits, active-only midnight progress, FIFO overflow, local-store completion, and displayed ETA all passed.
- Partial-order save/reload preserved exact order identity, progress, staffing, funds, and stores.
- Half-cost cancellation and imported-copy source isolation passed.

Next native step after live validation: `GODOT.0008_BASE_FACILITY_CONSTRUCTION_AND_SPECIALIST_CAPACITY_VERTICAL_SLICE`, adding bounded Laboratory, Workshop, and Living Quarters construction so a staffed campaign can deliberately expand specialist capacity without importing the browser game's complete base-building simulation.

## v0.26.07.19.GODOT.0006 - Personnel Arrivals and Research Unlock Vertical Slice

Native build `v0.26.07.19.GODOT.0006_PERSONNEL_ARRIVALS_AND_RESEARCH_UNLOCK_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0005 staffing gate with the next bounded personnel and technology transition.

Implemented scope:

- Added base-local Soldier, Scientist, and Engineer hiring orders using the browser game's established $120k, $95k, and $90k costs.
- Every order arrives after three crossed strategic midnights. Pending orders reserve Living Quarters capacity; Scientists also reserve Laboratory capacity and Engineers reserve Workshop capacity.
- Pending orders can be cancelled for a deterministic half-cost refund, immediately releasing their reserved capacity.
- Soldier orders capture one of six deterministic recruit records at order time. Delivered soldiers arrive Ready, local to the selected base, and unassigned so they cannot silently displace the active six-seat squad.
- Added 10 Engineer spaces per Workshop. New native campaigns include one Workshop, and native 0001-0005 saves conservatively gain the Workshop already implied by their functional Workshop command screen.
- Browser-imported copies preserve their actual Workshop count and remain blocked from Engineer hiring or manufacturing when no local Workshop exists.
- Laser Weapons completion now records the completed topic, releases assigned scientists, unlocks Laser Power Output 1, and grants the `laser_rifle_production` capability.
- Laser Power Output 1 opens as a separate unstaffed 180-point follow-on project. Browser imports already working on that topic infer Laser Weapons as completed without mutating the source export.
- Workshop Laser Rifle production is owned by campaign state: it remains blocked before research, requires a local Workshop, deducts $180k, and adds one rifle to local stores after the unlock.
- Base, Research, and Workshop screens now expose projected occupancy, pending arrivals, cancellation refund, engineer capacity, completed topics, unlocked capabilities, follow-on selection, and Laser Rifle stores/production.

Performance and compatibility:

- Personnel queues are bounded to the small pending-order list and update only when strategic time crosses midnight; no tactical or per-frame work was added.
- Capacity reservations prevent a queued batch from overbooking Living Quarters, Laboratories, or Workshops while preserving already over-capacity imported states.
- Queue identifiers, recruits, arrival timing, completed research, unlocks, follow-on progress, funds, and stores are JSON-friendly and survive normal or isolated imported-copy save round trips.
- Save format remains 4. HTML `index.html`, browser saves, native slot paths, tactical rules, air operations, and browser-import source isolation are unchanged.

Verification completed:

- Godot 4.7.1 strict editor import and GDScript parsing passed.
- Native tests passed `61/61`; visible native Build Health passed `45/45` through the same run.
- Coverage includes established hiring costs, projected quarters/specialist reservations, full specialist facilities remaining authoritative despite spare quarters, missing-Workshop blocking, half-refund cancellation, no early delivery, third-midnight delivery, deterministic unassigned recruits, legacy Workshop/queue migration, research completion, prerequisite inference, follow-on selection, locked/unlocked Laser Rifle production, funds, and stores.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered Base personnel queues, completed Research, and unlocked Workshop screens at 1440x900 without clipping or horizontal overflow.
- The unchanged HTML artifact's six inline scripts parsed and `node tools\check-aegis-build.cjs` passed for browser build 0137.
- Localhost browser smoke reached first-base setup and Geoscape; browser Build Health passed `272/272`, runtime error logs were empty, and only the existing Tailwind production-CDN warning remained.

Manual validation completed by player:

- Load the native campaign that passed 0005 and confirm the Workshop migration preserves all prior campaign values while adding 10 Engineer spaces.
- Recruit one Soldier, advance two days, save/reload, advance the third day, and confirm the same named recruit arrives Ready but unassigned.
- In the native campaign, use its final open quarters slot to hire/cancel a Scientist and then an Engineer, verifying each half-cost refund before recruiting the Soldier.
- In imported Fort Aegis, confirm five spare quarters allow Soldier hiring but its full 10/10 Laboratory and Workshop correctly block Scientist and Engineer orders.
- Complete Laser Weapons, begin Laser Power Output 1, manufacture one Laser Rifle, then save/reload and verify completed research, capability, active follow-on, funds, and local stores.
- Re-import the current browser campaign read only and confirm its exact Workshop count, inferred Laser Weapons prerequisite, isolated copy save, and unchanged source bytes.

Next native step after live validation: `GODOT.0007_ENGINEERING_STAFFING_AND_MANUFACTURING_QUEUE_VERTICAL_SLICE`, replacing instant Medkit/Laser Rifle construction with a small Engineer-assigned timed production queue while avoiding the full browser manufacturing tree and multi-base logistics.

## v0.26.07.18.GODOT.0005 - Base Personnel and Research Staffing Vertical Slice

Native build `v0.26.07.18.GODOT.0005_BASE_PERSONNEL_AND_RESEARCH_STAFFING_VERTICAL_SLICE` preserves save format 4 and implements the smallest safe strategic-management subset recommended after live browser-import validation.

Implemented scope:

- Added base-local facility counts without importing or simulating the browser build's complete multi-base layout.
- Living Quarters provide 12 personnel spaces and Laboratories support 10 scientists, matching the verified HTML rules.
- Local occupancy counts living soldiers, scientists, and engineers. KIA soldiers do not consume quarters capacity, while over-capacity imported states remain intact and receive visible feedback instead of destructive normalization.
- New native campaigns begin with six soldiers, five scientists, no engineers, 11/12 occupied personnel spaces, and five scientists assigned to Laser Weapons.
- Browser imports preserve selected-base repeated Living Quarters and Laboratory cells plus top-level scientist/engineer totals. All imported soldiers remain available, while base identity remains explicit for local occupancy accounting.
- Research assignment is adjustable from zero through the lower of available scientists and Laboratory capacity. The save stores both the new explicit assignment key and the prior 0004 compatibility alias.
- Each assigned scientist contributes 2 research points per elapsed strategic day. Projects preserve their own required-point totals; completion caps at that requirement, records one report, and releases the assigned staff.
- The Base screen now shows live local personnel, soldiers, scientists, engineers, capacity overflow, and facility-specific staffing instead of placeholder values.
- The Research screen now shows total scientists, lab capacity, assigned/available staff, progress, daily rate, ETA, a numeric staffing control, and a bounded one-day advance disabled during active flight operations.
- Save normalization supplies conservative scientist, engineer, facility-count, and staffing defaults to native 0001-0004 saves without changing save format or save-slot isolation.

Performance and compatibility:

- Capacity and staffing calculations traverse the bounded local roster only when strategic UI/state changes occur; no tactical or per-frame work was added.
- Research advances once per crossed strategic midnight rather than on every minute tick.
- Existing imported copies missing repeated facility counts infer one instance from their preserved facility list. Re-importing the unchanged browser export preserves exact repeated Quarters/Laboratory counts.
- The HTML artifact, browser saves, regular native save, and isolated imported-copy save paths remain unchanged.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native tests passed `50/50`; visible Build Health passed `36/36` through the same run.
- Coverage includes exact personnel/lab rules, legacy migration, staffing clamps, deterministic daily progress, completion/staff release, repeated browser facility counts, imported personnel totals, and all prior tactical/interception/import checks.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered native and exact-import Base/Research screens at 1440x900. The three-column facility grid removed horizontal overflow and all summary/staffing controls remained readable.
- The exact July 12 browser export imported read-only in memory as Fort Aegis with four Living Quarters, 48 personnel capacity, 43 living/local personnel, one Laboratory, 10 scientists, 10 engineers, and Laser Power Output 1 at 170/180 points with 10 assigned and one day remaining. Source bytes remained unchanged and neither native save slot was written.
- Imported project requirements now set the ProgressBar maximum before its value; the exact 170/180 state visibly reports 94% instead of being clamped through the control's default 100-point maximum.
- The unchanged HTML artifact's six inline scripts parsed and `node tools\check-aegis-build.cjs` passed for browser build 0137.
- Localhost browser smoke reached first-base setup and the Geoscape; browser Build Health passed `272/272` and runtime error logs were empty. The existing Tailwind production-CDN warning remains non-blocking.

Manual validation still required:

- New/native Base personnel counts and capacity behaved as expected.
- Research staffing, daily rates, ETA, zero-staff pause, restored progress, and save/reload behavior passed.
- Browser-imported repeated facility counts, personnel totals, research staffing/progress, and isolated-copy behavior passed.

The completed gate authorized native 0006's bounded personnel hiring/arrival queues and first research-topic completion/unlock transition.

## v0.26.07.18.GODOT.0004 - Browser Save Import Copy Vertical Slice

Native build `v0.26.07.18.GODOT.0004_BROWSER_SAVE_IMPORT_COPY_VERTICAL_SLICE` preserves save format 4 and exposes the first conservative bridge from an exported HTML campaign into the native vertical slice.

Implemented scope:

- Added a start-screen browser-save file picker with a 32 MB input limit, JSON validation, recognized Project Aegis campaign kind, and rejection of future save formats or ambiguous all-slot backups.
- Corrected the dormant importer to read the actual HTML export contract under the `data` wrapper instead of the unused `game` key.
- Added a review-before-write dialog showing source file, browser build, save format, campaign date, funds, selected base, soldier count, compatible incident count, and explicit compatibility limits.
- Normalized the selected browser base, known facilities, soldier identity/stats/readiness/active squad, active incidents and rescue requirements, research summary, inventory, reports, funds, and Geoscape clock into the bounded native data model.
- The real browser schema's nested `stats`, `identity`, base `grid`, research `topic`, and assigned-scientist fields map directly; KIA and wounded status are visible in the roster.
- Browser active squads are capped at the native Skyranger's six ready seats, while the complete imported roster remains available through page-owned scrolling.
- Browser aircraft, complex layout, relationship, transfer, and queue systems remain in the untouched browser file; the native slice supplies its own Saber One and Nightglass defaults.
- Imported campaigns write only to `user://project_aegis_godot_imported_copy_v4.json`. The regular native slot at `user://project_aegis_godot_save_v4.json` and the selected browser export are never overwritten by this flow.
- Added **Load Imported Copy**, imported-copy save labeling, a persistent source-build provenance banner, and source metadata that survives save/reload.
- Dense imported incident sets receive distinct deterministic marker/hit positions; only selected or hovered incident labels render, preventing strategic-map label piles without changing selection outcomes.
- Fixed command-screen replacement by detaching outgoing UI synchronously before deferred deletion, preserving the new header/navigation while switching among long imported pages.

Performance and compatibility:

- File reads are user-initiated and bounded to 32 MB. Parsing and normalization each traverse the selected campaign data once, with no tactical or per-frame cost.
- Existing native and browser saves remain unchanged. Save format remains 4 because the imported copy maps into the existing native contract and uses a separate path.
- Unsupported all-slot backups explain that one individual browser campaign or slot must be exported, avoiding an ambiguous automatic choice.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native tests passed `45/45`; visible Build Health passed `32/32` through the same run.
- The test suite writes a representative 0137 campaign export, reads it through the exact `data` wrapper, maps the selected second base grid, eight-soldier roster, nested identity/stats, six-seat active squad, rescue incident, research, funds, date, and clock, then writes and reloads a separate imported copy.
- The test suite confirms the browser source file remains byte-for-byte unchanged and the imported path is distinct from the regular native save path.
- Hardware OpenGL smoke on the NVIDIA GeForce GTX 960M rendered and visually verified the start screen, Downloads-rooted picker, compatibility review, imported-copy Geoscape, full 44-soldier roster, and 11-incident Mission Control at 1440x900.
- The actual 606,055-byte July 12 build-1500 browser export previewed and normalized as Month 4 Day 1 at Fort Aegis with 44 soldiers, six ready soldiers assigned, 11 launchable incidents, and unchanged source bytes. Its disposable imported-copy file reloaded successfully and was removed after the test.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed for build 0137, and localhost browser smoke reached first-base placement and the Geoscape.
- Browser Build Health passed `272/272`; browser error logs were empty during the start-screen, base-placement, Geoscape, and diagnostics flow.

Manual validation completed:

- The player imported the current browser campaign through the live picker and confirmed the review/import flow worked.
- The player confirmed native and imported save slots remained distinct and save/reload behavior worked.
- The player confirmed the imported command screens and mapped incident mission flow worked at the normal display scaling.

Next native step completed in native build 0005: base-local personnel capacity and research staffing now follow the verified HTML rules without broad multi-base logistics.

## v0.26.07.18.GODOT.0003 - Native Air Interception Vertical Slice

Native build `v0.26.07.18.GODOT.0003_AIR_INTERCEPTION_VERTICAL_SLICE` preserves save format 4 and adds the first bounded strategic aircraft-combat loop.

Implemented scope:

- Added one save-compatible Saber One interceptor and one tracked Nightglass Scout UFO contact to new and normalized native campaigns.
- Added clickable UFO markers, contact selection, Cautious/Standard/Aggressive posture controls, and mutually exclusive Skyranger/interceptor launch commitments.
- Added 20-minute outbound and return legs, map route/craft visualization, fuel commitment, missile expenditure, hull damage, reports, and recorded pilot cues.
- Air combat is deterministic and bounded to at most three exchanges; it cannot create an unbounded simulation loop.
- A destroyed UFO creates a selectable Scout Crash Site tactical incident. Escaped contacts and lost interceptors resolve without leaving an active-flight lock.
- Surviving craft return to bounded service time, then restore hull, fuel, missiles, and Ready status through Geoscape clock advancement.
- Save normalization preserves exact mid-interception phase, progress, posture, craft state, UFO state, combat log, and return/service state without changing save format.
- Added seven visible Build Health rows covering the complete air-operation lifecycle and ten headless checks including a real save/reload at 50% outbound progress.

Performance and compatibility:

- The strategic map still uses one custom-drawn control; UFO and aircraft route rendering add no per-marker scene-node churn.
- Combat executes at most three deterministic rounds only when outbound progress reaches 100%.
- Existing native saves receive missing aircraft/contact defaults through normalization. Browser saves and `index.html` remain untouched.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native headless tests passed `33/33`; visible Build Health passed `23/23` through the same run.
- The test suite saved at 50% outbound travel, loaded that save into a new campaign object, resumed combat, created a crash site, returned, serviced, and restored Saber One readiness.
- Hardware-rendered OpenGL smoke produced and visually verified tracked-contact, outbound-route, and post-combat return states at 1440x900.

Manual validation completed:

- The player selected Nightglass, used the interception controls, and advanced through outbound combat, return, and service without a reported issue.
- The player confirmed native save continuity and the generated Scout Crash Site recovery flow work as expected.
- The player confirmed the pilot audio and complete native interception update work as expected.

Next native step completed in native build 0004: conservative browser-save import now uses a review-first picker and an isolated imported-copy slot without overwriting the browser export or regular native campaign.

## v0.26.07.18.GODOT.0002 - Tactical Battle Log Trim Fix

Native build `v0.26.07.18.GODOT.0002_TACTICAL_LOG_TRIM_FIX` preserves save format 4 and fixes the hard lock reported during an incident battle.

Root cause:

- The tactical sidebar retains at most ten battle-log labels.
- When an eleventh label arrived, the trimming loop called `queue_free()` on the oldest child and immediately checked `get_child_count()` again.
- Godot defers `queue_free()` until the frame ends, so the count remained eleven inside the synchronous loop. The same child was queued repeatedly without a terminating state change, driving CPU and memory growth until the window stopped responding.

Implemented fix:

- Excess log entries are now removed from the container before being freed, so the visible child count decreases synchronously on every loop iteration.
- The ten-entry display cap and newest-first message order are unchanged.
- Added native Build Health coverage that sends 24 consecutive tactical messages and requires the container to finish at exactly ten entries.

Verification completed:

- Godot 4.7.1 editor import and GDScript parsing passed.
- Native headless tests passed `22/22`.
- Native Build Health passed `16/16`, including `Tactical battle log trims immediately at ten entries`.
- The tactical test completed soldier movement highlighting, civilian contact, wall destruction, breach traversal, and three asynchronous End Turn cycles.

Manual validation completed:

- The player completed a full native incident mission without another lockup or reported issue.
- The tactical log passed its real sustained-play gate through mission completion and return to command.

## v0.26.07.18.GODOT.0001 - Native Godot 4 Vertical Slice

The first native Godot 4.7.1 slice lives beside the verified HTML artifact. It deliberately reuses save format 4 as a data-contract version while writing to a separate native JSON save, so browser campaigns are not overwritten.

Implemented scope:

- Added a native project, main scene, restrained command UI, data catalog, campaign state model, deterministic hex helpers, strategic map, and tactical board under `godot/`.
- Added first-base placement, Geoscape incidents, Skyranger travel, six-soldier roster management, research/workshop actions, mission and report views, and native save/load.
- Added a 20x14 tactical incident with terrain, connected building walls, cover, a single readable Skyranger and nine-cell rear ramp, six soldiers, three aliens, and two civilians.
- Added bounded reachable-cell/path calculations, TU movement and firing, alien turns, civilian contact/following/panic/recontact, mandatory extraction, mission resolution, and campaign rewards/casualty updates.
- Destroyed wall cells become soft rubble and are excluded from the shared blocker index, allowing human, alien, and civilian paths through the breach.
- Added an in-game 15-row Build Health checker plus a 22-check headless test suite covering campaign, save, hex, movement highlighting, three End Turn cycles, rescue, and breach contracts.

Performance and compatibility:

- Tactical rendering is one custom Godot control rather than one scene node per hex; movement highlighting uses one bounded reachable flood and paths are calculated only for chosen destinations.
- The sample battlefield is fixed at 20x14 and does not port the HTML lighting system, avoiding the browser build's former full-map lighting/DOM costs.
- `index.html`, its build label, and browser save remain unchanged. Godot stores native state separately at `user://project_aegis_godot_save_v4.json`.

Verification completed:

- Godot 4.7.1 headless editor import and GDScript parsing completed with all native classes registered.
- Native headless tests passed `22/22`; this run invokes and passes all `15/15` visible Build Health rows and completes three tactical End Turn cycles.
- A hardware-rendered OpenGL smoke run produced and visually verified the native start, Geoscape, and tactical states at 1440x900.
- The visual pass found and fixed zero-width/zero-height label behavior in wrapped command text and the tactical header; the rerender shows the title, live turn summary, and multiline battle log.

Manual validation still required:

- Complete one full native campaign loop from base placement through tactical victory and return to command.
- Select and move multiple soldiers, run at least three alien turns, destroy and cross a wall breach, and rescue a civilian through the rear ramp.
- Save, return to the menu, load the native campaign, and confirm funds, base, roster, reports, incidents, and mission outcome persist.
- Check music transitions, input feel, tactical readability, and display scaling on the player's normal setup.

Next native step: after this hands-on gate, port a bounded aircraft interception loop and expose a conservative browser-save import UI without overwriting the original save.

## v0.26.07.17.0137 - Continuous Tactical Walls and Traversable Breaches

Build `v0.26.07.17.0137_TACTICAL_CONTINUOUS_WALLS_AND_TRAVERSABLE_BREACHES_INDEX_ONLY_PATCH` preserves save format 4 while making incident-battle buildings read as connected structures and locking destroyed-wall traversal into the shared tactical movement contract.

Root causes:

- Three.js rendered every structural wall cell as one undersized box. Adjacent pieces did not touch, so building perimeters resembled isolated posts rather than solid walls.
- Offset hex rows do not share a simple north/south world axis. Enlarging one fixed box orientation could not reliably close both horizontal and diagonal neighbor gaps.
- Structural destruction already produced soft `breach-rubble` with `block: 0`, but there was no explicit regression test proving every tactical mover accepted that opening.

Implemented changes:

- Added `tacticalConnectedStructuralWalls`, using the existing cover-cell index and at most six neighbor lookups per visible structural cell.
- Three.js walls now render a larger central joint plus one canonical center-to-center bridge for each adjacent wall, window, or partition belonging to the same building.
- Bridge direction follows the actual shared offset-hex world coordinates, so straight runs and corners meet without assuming a square-grid axis.
- Door cells have no structural cover and therefore remain open. Destroyed segments become soft rubble and are excluded from the connector set, causing adjacent bridges to disappear and leaving a visible breach.
- Intact wall HP, cover, line of sight, and collision rules are unchanged.
- Added Build Health coverage proving an intact wall blocks the human reachable-cell flood, breached rubble enters it, alien `stepToward` selects it, and a panicked civilian uses it when it is the only available escape cell.

Performance and compatibility:

- No full-map scan, per-cell pathfinding pass, lighting work, or save field was added.
- Connector discovery is bounded to six indexed lookups per rendered wall and creates one bridge per unique visible neighboring pair.
- Safe 2D remains the default. Both battle views continue consuming the same cover HP, breach state, and movement rules.

Verification completed:

- Static app-script parsing passed for all six embedded scripts.
- `node --check tools/check-aegis-build.cjs`, `node tools/check-aegis-build.cjs`, and `git diff --check` passed for build 0137.
- Browser Build Health passed `272/272`, including `Continuous tactical walls open traversable breaches for every unit type`.
- Localhost browser smoke confirmed the 0137 start screen, first-base selection, fresh Geoscape, six-soldier response setup, mission confirmation, Skyranger travel, and 64x64 safe-2D tactical launch.
- The practical mission completed three End Turn cycles, switched to Three.js, and handed the same live turn-4 state to AI Command. Playback reached frame 23 mission success without resetting the battlefield.
- The revealed Wilderness Ranger Outpost rendered as a continuous joined wall run with a clear doorway interruption in Three.js Performance mode.

Manual validation still required:

- Inspect Urban and Small Town building perimeters in Three.js Near/Close views and confirm straight runs, corners, windows, partitions, and doors all read naturally.
- Shoot through a wall segment and confirm the joined wall visibly opens at that cell while rubble remains.
- Move a soldier through the breach, then observe an alien and both calm/escorted and panicked civilians route through the same opening.
- Repeat the affected high-threat Port Attack in safe 2D and Three.js Performance mode to confirm the bounded wall joins do not create a noticeable performance regression.

Next recommended patch: after live breach and Port validation, continue the bounded strategic roadmap slice `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, beginning with safe queued-order cancellation and destination-reservation release.

## v0.26.07.17.0136 - Tactical AI Mandatory Rescue and Extraction Progress

Build `v0.26.07.17.0136_TACTICAL_AI_MANDATORY_RESCUE_AND_EXTRACTION_PROGRESS_INDEX_ONLY_PATCH` preserves save format 4 and carries AI-controlled incident battles through the mandatory civilian rescue phase.

Root causes:

- The continuation resolver's main loop required at least one living alien. AI takeover after area security did not run any rescue turn, and killing the final alien inside the resolver broke out before the next rescue turn.
- AI rescue duty considered only revealed civilians even after the battlefield was secure, so an achievable mandatory objective could remain unfinished with hidden survivors.
- Escort AI selected the nearest ramp cell every step rather than the deepest rear-ramp cell, encouraging edge oscillation instead of leading the single-file chain through the extraction lane.
- Resolver success checked only alien elimination and surviving soldiers. It did not share the manual tactical `canResolveVictory` rescue contract, and the generic failure branch would wipe the squad if success were simply gated without separating area security from squad defeat.

Implemented changes:

- Added shared `tacticalAiRescueProgress`, `tacticalAiShouldContinueRescue`, and `tacticalAiMissionResolution` helpers around the existing civilian objective contract.
- Inherited AI continues for a maximum of 36 bounded exchanges while combat or an achievable mandatory rescue remains unresolved. Normal generated simulations retain their existing 24-round cap.
- Once no aliens remain, AI enters an area-secure sweep. Hidden living civilians become eligible search targets, are revealed on contact, and then use the existing 8-TU contact, panic recovery, four-follower capacity, and four-step movement rules.
- Each available rescuer claims a distinct civilian for the current turn. Existing escorts retain rescue duty and move toward the deepest Skyranger ramp cell so followers traverse extraction cells in order.
- Secure-rescue playback frames report `rescued/required` progress and continue driving the existing action camera and soldier dialogue paths.
- Final AI success now requires both area security and `canResolveVictory`. If the bounded extraction phase expires while rescue remains achievable, surviving soldiers are preserved and the result is reported as an incomplete rescue rather than a false squad wipe.
- Added deterministic Build Health coverage beginning with zero living aliens and one hidden mandatory civilian, then verifying sweep contact, escort, ramp extraction, survivor preservation, final mission success, and the lightweight incomplete-rescue resolution contract.

Performance and compatibility:

- No full-map visibility scan, local-light work, per-cell destination pathfinding, renderer fork, or save-format field was added.
- Rescue work remains bounded to the small unit list, at most six soldiers, four followers per escort, four movement steps per exchange, and 36 inherited exchanges.
- Safe 2D remains the default and the same unit/civilian frames continue feeding both tactical playback views.

Verification completed:

- Static app-script parsing passed for all six embedded scripts during implementation.
- `node --check tools/check-aegis-build.cjs` and `node tools/check-aegis-build.cjs` passed for build 0136.
- Browser Build Health passed `271/271`, including `AI mandatory rescue phase searches escorts and extracts before resolution`.
- Localhost browser smoke confirmed the 0136 start screen, first-base selection, fresh-campaign Geoscape, squad assignment, mission confirmation, and Skyranger arrival.
- A fresh six-soldier Red River Signal safe-2D mission handed its live frame to AI Command. Tactical-map playback began at `AI inherited round 1`, advanced through 11 preserved-state frames, and reached mission success.
- Browser diagnostics contained no application errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Hand AI Command a mandatory rescue incident after the final alien is dead. Confirm it searches for unrevealed survivors, makes contact, and extracts the required number before victory.
- Let AI kill the final alien while it already has one to four followers. Confirm the exact chain continues through the rear ramp without overlap or a map reset.
- Confirm secure-rescue playback labels, camera movement, and soldier rescue chatter remain understandable through the transition.
- Repeat the affected high-threat Port Attack in safe 2D and confirm the inherited 36-exchange ceiling does not create a noticeable performance regression.

Next recommended patch: validate the live AI rescue transition, then continue the next bounded strategic slice, `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, beginning with safe queued-order cancellation and destination-reservation release.

## v0.26.07.17.0135 - Strategic Alert Screen Continuity and Secure Rescue Phase

Build `v0.26.07.17.0135_STRATEGIC_ALERT_SCREEN_CONTINUITY_AND_RESCUE_PHASE_INDEX_ONLY_PATCH` preserves save format 4, prevents strategic alert choices from replacing the active command screen, and advances the next bounded civilian-objective roadmap slice.

Root causes:

- `resolveTimeSpeedPrompt` treated every UFO prompt as a Geoscape navigation request. Choosing any prompt speed called `setTab("geoscape")`, replacing Base, Soldiers, Research, Workshop, Missions, or a still-active battlefield even though the player had work in progress there.
- Tactical victory resolved immediately when the final alien was removed. A mandatory rescue objective could therefore end before the player escorted the required civilians to the Skyranger ramp.

Implemented changes:

- `promptResolutionTargetTab` now makes UFO and personnel time prompts screen-neutral. Outside battle, the selected Geoscape speed starts immediately without changing the active command section.
- Speed choices made during tactical combat are stored as a deferred post-battle setting. The strategic clock stays stopped until tactical ownership ends, then resumes at the selected speed or remains paused when Pause was selected.
- Tactical alert copy and button labels state that the selection applies after battle, removing ambiguity without adding debug UI.
- Added `tacticalCivilianObjectiveProgress` to derive required, rescued, active, possible, complete, impossible, and rescue-phase state in one bounded calculation.
- When the last alien falls and a mandatory rescue remains achievable, End Turn refreshes the human rescue turn instead of resolving victory. Completed, optional, or impossible objectives continue to resolve normally.
- Added objective-panel progress text, a `Refresh Rescue Turn` command label, and deterministic Build Health rows for command-screen continuity, tactical deferred speed, and civilian rescue-phase completion rules.

Verification completed:

- Static app-script parsing passed after implementation.
- `node tools/check-aegis-build.cjs` passed for build 0135.
- Localhost browser smoke confirmed the 0135 start screen, fresh-campaign first-base flow, and main Geoscape.
- Browser Build Health passed `270/270`, including `UFO alert speed selection retains the active command screen` and `Mandatory civilian objectives continue through a bounded secure rescue phase`.
- A fresh six-soldier Red River Signal mission launched on the live 64 x 64 safe-2D battlefield. Soldier selection and movement highlighting remained responsive.
- Three End Turn cycles completed with control returning to the human turn each time; all six soldiers remained active and alien reveals advanced from zero to two.
- Browser diagnostics contained no application errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Trigger a UFO prompt from several non-Geoscape command sections and confirm every speed choice retains the active section while strategic time advances normally.
- Reproduce the reported UFO prompt from the affected in-progress save and confirm choosing each desired post-battle speed never changes the active battlefield state.
- Finish that battle and confirm the deferred Geoscape speed starts only after tactical ownership ends.
- Enter the secure rescue phase in a mandatory civilian incident, extract enough followers at the Skyranger ramp, and confirm victory appears at the requirement boundary.
- Confirm a mandatory requirement made impossible by civilian losses does not trap the battle.

Next recommended patch: continue the next safest bounded roadmap item after the alert transition and secure-rescue flow pass hands-on validation.

## v0.26.07.17.0134 - Shared Cell Gradient and Seamless Three.js Layout

Build `v0.26.07.17.0134_THREEJS_SHARED_CELL_GRADIENT_AND_SEAMLESS_LAYOUT_INDEX_ONLY_PATCH` preserves save format 4 and corrects the remaining Urban District 2D/3D color and placement mismatch.

Root causes:

- The 2D battlefield's pointy hex is intentionally drawn inside a square cell. Its rows advance by 0.755 cell and odd rows shift by half a cell. Build 0133 incorrectly treated the board as a regular pointy-hex grid with `sqrt(3) x radius` horizontal and `1.5 x radius` vertical center spacing.
- Build 0133 reduced each 2D `base` and `accent` gradient to one midpoint color in Three.js. Similar Urban grays collapsed visually, and the richer 2D road, lane, lot, plaza, and building-floor treatment did not carry across.
- Mathematically touching polygon edges still exposed the clear/background color at antialiased three-cell junctions.

Implemented changes:

- Added `tacticalCellVisual` as the shared terrain/fog descriptor used by both `tacticalCellStyle` and `tacticalThreeGroundPalette`.
- Centralized the 0.755 row step and 0.5 odd-row offset. The 2D rows, 2D shot overlay, Three.js world coordinates, and geometry tests now consume those constants.
- Replaced the regular cylinder floor with a flat custom buffer geometry whose square bounds and 25/75-percent shoulders match the 2D CSS clip polygon.
- Replaced midpoint-only materials with small cached canvas gradients using each cell palette's exact base/accent pair. Matching palettes remain grouped into bounded instanced batches and retain instance picking.
- Added a single slightly larger instanced underlay below the colored cells so antialiasing cannot expose black triangular holes. This adds one bounded draw call rather than per-cell DOM or mesh work.
- Added Build Health and checker seams for shared Urban palette inputs, exact 2D/3D cell-center math, custom footprints, texture cleanup, and the seam-underlay budget.

Verification completed:

- Static app-script parsing passed.
- `node tools/check-aegis-build.cjs` passed for build 0134.
- Browser smoke confirmed the 0134 start screen, first-base selection, and fresh-campaign Geoscape.
- Browser Build Health passed `268/268`, including all three new 2D/3D parity rows.
- A fresh six-soldier Red River Signal mission launched on the live 64 x 64 Wilderness battlefield.
- Matched live 2D and Three.js views showed the same orange path, dark unexplored field, bright green clearing, gray stone strip, vegetation, soldiers, and Skyranger regions.
- Performance-mode Three.js rendered the new gradient palette and custom footprint at Near and Close zoom without repeating black triangular junction gaps.
- Three.js picking selected Maia, displayed 164 reachable cells, and moved her to a sampled reachable ground hex for 8 TU, confirming instanced cell picking still maps to the authoritative tactical coordinate.
- Three End Turn cycles completed with control returning to the human turn each time.
- Browser diagnostics contained no application or WebGL errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Compare the same saved Urban District incident in 2D and 3D at Near and Close zoom, paying particular attention to the tan center-right region, dark terrain bands, buildings, Skyranger, and row-edge cells shown in the supplied screenshots. The browser verification used a fresh Wilderness mission because the affected save was not present in the isolated test session.
- Repeat on the affected high-threat Port Attack in Performance mode and watch for turn-time regression.

Next recommended patch: resume the next bounded roadmap gameplay item after matched Urban and Port Attack hands-on confirmation.

## v0.26.07.16.0133 - Three.js Terrain Palette and Hex Alignment

Build `v0.26.07.16.0133_THREEJS_TERRAIN_PALETTE_AND_HEX_ALIGNMENT_INDEX_ONLY_PATCH` preserves save format 4 and corrects the two isometric-ground regressions shown in matched 2D and 3D screenshots.

Root causes:

- Build 0132 deliberately replaced unreliable per-instance floor colors with one explicit biome material. That prevented black ground but flattened every procedural terrain region into one color.
- The tactical grid uses pointy-top odd-row coordinates with `sqrt(3) x radius` horizontal spacing and `1.5 x radius` vertical spacing. The Three.js cylinder used a 30-degree start angle, producing a flat-top hex against pointy-top placement math and leaving repeating triangular holes.

Implemented changes:

- Each 3D cell now receives the same deterministic `tacticalTerrainForCell` base/accent pair used by 2D. The representative 3D material color is the midpoint of those two colors.
- Cells with matching terrain colors are grouped into explicit-material `InstancedMesh` batches. This avoids per-cell meshes and the GPU-dependent per-instance color path while bounding ground batches to 24.
- Unexplored and explored-but-unseen ground retain tactical dimming; AI playback and resolved battles reveal the underlying terrain palette consistently.
- The hex cylinder now starts at zero radians, matching the pointy-top tactical coordinate system. A 0.1% radius overlap suppresses subpixel cracks without changing cell centers or picking.
- Exact per-instance picking remains attached to every palette batch, and tactical simulation, cover, movement, visibility, LOS, civilians, AI, and saves are unchanged.
- Added Build Health and checker seams for palette variation, 2D palette sourcing, pointy-top geometry, coordinate spacing, and bounded palette batching.

Verification completed:

- Static app-script parsing passed after the renderer rewrite.
- `node tools/check-aegis-build.cjs` passed for build 0133.
- Browser smoke confirmed the 0133 start screen, first-base selection, and fresh-campaign Geoscape.
- Browser Build Health passed `267/267`, including both new terrain-palette and pointy-hex rows.
- A fresh six-soldier Red River Signal mission launched on the 64 x 64 Wilderness battlefield.
- Live close-zoom 2D and 3D screenshots showed the same orange path, green vegetation, gray stone/road, bright grass, dark scrub, and unexplored regions in the same generated battlefield.
- Quality and Performance isometric modes both rendered varied terrain with pointy hex edges meeting cleanly and without the previous repeating triangular holes.
- Screenshot pixel analysis measured 350 quantized color buckets and 3,851 non-dark terrain-color samples in the isometric battle view.
- Three End Turn cycles completed with control returning to the player each time.
- AI inherited the live round-four battlefield, reached frame `21/21`, and produced a fully revealed tactical victory map with blue stream, orange path/dry ground, multiple green terrain families, gray stone/road, brown ground, and building areas.
- Browser diagnostics contained no application or WebGL errors; the only console entry was the existing Tailwind CDN development warning.

Manual validation still required:

- Repeat the 2D/3D comparison on Farmland, Small Town, and Urban District maps, including Performance mode.
- Inspect long animated battles for any rare overlap flicker at mixed-color palette boundaries; none appeared in the tested Wilderness mission.
- Re-test the affected high-threat Port Attack because ground draw calls rise from one biome batch to a bounded terrain-palette set.

Subsequent result: the supplied Urban District screenshots showed that 0133's Wilderness verification was insufficient. Urban colors remained visually flattened and the regular-hex Three.js footprint did not match the square-bounded 2D cell layout. Build 0134 supersedes those two implementation assumptions while retaining the verified instancing and picking recovery.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after cross-biome 3D palette/alignment and Port performance confirmation.

## v0.26.07.15.0132 - Computer Voice, Soldier Static, Transition Gate, and 3D Terrain Color

Build `v0.26.07.15.0132_COMPUTER_VOICE_STATIC_TRANSITION_AND_3D_TERRAIN_COLOR_INDEX_ONLY_PATCH` preserves save format 4 and improves recorded transmission character, post-battle voice ordering, and isometric environment readability.

Root causes:

- The base-computer effect was intentionally light, so the original recording still sounded mostly natural instead of like a 1980s command computer.
- Soldier clips bypassed the strategic FIFO. Their asynchronous fetch/decode could still be active when the first return-flight aircraft phrase entered the queue, allowing the pilot to begin before the final tactical recording actually ended.
- Three.js terrain used dark procedural 2D colors as per-instance tints. In the tested browser/GPU path those instance colors rendered effectively black, and scene fog darkened them further.

Implemented changes:

- Base-computer recordings now use 18-step wave shaping, 31 Hz square modulation, stronger compression, and a bounded 22 ms parallel metallic delay.
- Soldier recordings receive 75 ms of band-limited lead static and 90 ms of trailing static generated through Web Audio; original recordings remain unmodified.
- Soldier playback now tracks a Promise through decode, playback, and trailing static. Every queued computer or aircraft task awaits the latest soldier tail before starting.
- Strategic computer and aircraft clips retain the existing FIFO and clip-end gap, while tactical soldier lines remain immediate and cooldown-limited.
- The single Three.js instanced ground mesh now uses explicit biome material colors: green Wilderness, ochre Farmland, muted green-gray Small Town, and gray Urban District.
- Ground is unlit and excluded from scene fog so biome color remains visible; models, props, effects, LOS, exploration, and fog-of-war visibility rules are unchanged.
- Removed per-cell instance-color writes from the 3D ground hot path while preserving one batched ground mesh and exact instance picking.
- Added three Build Health rows and checker seams for computer metallic processing, soldier static/transition gating, and biome ground materials.

Verification completed:

- Static app-script parsing passed.
- `node tools/check-aegis-build.cjs` passed for build 0132.
- Browser smoke confirmed the 0132 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `266/266` after a clean reload.
- A fresh six-soldier Red River Signal mission launched on the 64 x 64 tactical battlefield.
- The Wilderness `3D Iso` view rendered a clearly green ground plane instead of black while retaining the cohesive Skyranger, soldiers, props, and one instanced ground mesh.
- AI inherited the live battlefield, reached its final playback frame at accelerated speed, and returned directly to Geoscape.
- The transition queue was allowed seven seconds to drain. No runtime exception or recorded-dialogue fallback warning appeared; the only console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Judge base-computer intelligibility and the intended 1980s computer character by ear.
- Confirm lead/trailing static is audible but does not clip speech or become distracting across varied soldier takes and Sound Effects volume levels.
- Confirm the final tactical soldier recording and static tail fully end before the first pilot phrase on incident return.
- Visually confirm Farmland, Small Town, and Urban District isometric ground colors on the affected machine, including Performance mode.
- Re-test a live spotted-civilian rescue, reload/fire-mode state changes, and the affected high-threat Port Attack.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the audio listening pass, cross-biome 3D check, live civilian rescue, and Port Attack performance check.

## v0.26.07.15.0131 - AI Tactical Soldier Dialogue and Geoscape Voice Queue

Build `v0.26.07.15.0131_AI_TACTICAL_SOLDIER_DIALOGUE_AND_GEOSCAPE_VOICE_QUEUE_INDEX_ONLY_PATCH` preserves save format 4 and closes the remaining dialogue gaps in AI tactical playback and strategic announcement ordering.

Root causes:

- Manual tactical actions called the recorded soldier dialogue system directly, but AI playback frames only emitted weapon, impact, and fall effects. The AI simulation retained soldier identities and action data without translating those frames into voice cues.
- Computer and aircraft categories used independent cooldown clocks. Rapid strategic events could therefore begin simultaneously, and later same-category phrases could be discarded instead of waiting their turn.

Implemented changes:

- AI playback derives at most one soldier cue per frame, prioritizing final-contact victory, a human kill, a wounded soldier, a human shot or miss, then squad movement.
- Frame coordinates identify the acting or wounded soldier, and the preserved campaign soldier record selects the appropriate recorded personality style.
- Tactical soldier clips remain immediate and cooldown-limited so accelerated battle playback cannot create a stale queue of old combat lines.
- All non-soldier recordings share a FIFO Promise chain. Computer and aircraft phrases wait for the preceding clip to end plus a 120 ms gap before beginning.
- Explicit phrase delays remain intact but begin only after earlier queued announcements finish, preserving sequences such as `all_aboard` followed by `returning_to_base`.
- Missing or failed clips release the queue and retain synthesized fallback behavior instead of blocking later announcements.
- Build Health covers kill, wound, movement, and final-contact AI cue selection plus strategic queue routing and soldier exclusion.

Verification completed:

- Static parsing passed for all 6 inline app scripts.
- `node tools/check-aegis-build.cjs` passed for build 0131.
- Browser smoke confirmed the 0131 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `263/263`.
- A six-soldier Red River Signal mission launched on the 64 x 64 safe-2D battlefield. AI inherited the live battle, completed all 17 playback frames at 150% speed, and reached tactical victory.
- The result returned to Geoscape and exercised the paired `all_aboard` / `returning_to_base` path plus landing progression without application errors or recorded-dialogue fallback warnings.
- The only browser console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Listen through a complete AI-led incident and confirm soldier lines are frequent enough to add character without talking over important battle sounds.
- Trigger two or more computer/aircraft announcements close together and confirm every phrase plays once, in event order, with a natural gap and no overlap.
- Re-test an AI-led spotted-civilian rescue and confirm movement/rescue chatter remains appropriate.
- Re-test the affected high-threat Port Attack for performance and audio pacing.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the AI chatter and strategic queue listening pass plus live civilian rescue and Port Attack checks.

## v0.26.07.15.0130 - Tactical AI Camera and Dialogue Transmission FX

Build `v0.26.07.15.0130_TACTICAL_AI_CAMERA_AND_DIALOGUE_TRANSMISSION_FX_INDEX_ONLY_PATCH` preserves save format 4 and adds action-aware AI tactical-map framing plus category-specific processing for recorded command and aircraft voices.

Root causes:

- AI tactical-map takeover preserved the battlefield state correctly, but later playback frames did not consistently update the watch camera. The simulation advanced while the viewport remained near its initial squad position.
- Recorded dialogue buffers were routed cleanly into the Sound Effects bus. That preserved the performances, but base-computer and aircraft-pilot clips had no source-specific transmission character.

Implemented changes:

- Every AI playback frame derives a bounded camera anchor from rescued civilians, casualties, moved soldiers, moved civilians, moved aliens, or the first shot midpoint, in that gameplay-first order.
- Shot playback re-centers on the shooter/target midpoint before the effect runs. Quiet frames fall back to the center of the living squad, then other living units.
- AI takeover continues from the inherited units, cover damage, explored cells, round, and Skyranger state; camera following does not regenerate the map or alter tactical outcomes.
- Base-computer recordings use high-pass and low-pass filtering, stepped wave shaping, compression, and light modulation for a constrained 1980s command-computer sound.
- Aircraft recordings use a narrower band and stronger modulation for radio-transmission character. Soldier and other categories retain clean recorded playback.
- All recorded voices remain attached to the existing Sound Effects gain, volume, and mute controls.
- Build Health now covers deterministic movement, shot, rescue, and fallback camera anchors plus distinct computer and aircraft processing profiles.

Verification completed:

- Static parsing passed for all 6 inline app scripts.
- `node tools/check-aegis-build.cjs` passed for build 0130.
- Browser smoke confirmed the 0130 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `261/261` after the final helper-scope correction.
- A six-soldier Red River Signal mission launched on the 64 x 64 safe-2D battlefield. AI inherited round 1 and advanced through playback frames 1-5 without resetting the map.
- Near-zoom screenshots confirmed the viewport moved from the deployment area to hostile action and back to the advancing squad as playback frames changed.
- Aircraft launch, touchdown, and ramp dialogue events ran after the corrected reload without application errors or recorded-dialogue fallback warnings. The only fresh console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Listen to several base alerts and confirm the computer treatment is intelligible, appropriately synthetic, and not too harsh at normal Sound Effects volume.
- Listen to launch, touchdown, ramp, return, and interceptor pilot clips and confirm the radio treatment is distinct without obscuring the words.
- Watch a complete AI-led incident, especially shots, casualties, and civilian rescue, and confirm the camera changes feel helpful rather than too frequent.
- Re-test the affected high-threat Port Attack for turn performance and camera pacing.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the transmission-listening pass plus live AI rescue and Port Attack checks.

## v0.26.07.14.0129 - Recorded Command and Tactical Dialogue Integration

Build `v0.26.07.14.0129_RECORDED_COMMAND_AND_TACTICAL_DIALOGUE_INTEGRATION_AUDIO_ASSET_PATCH` preserves save format 4 and incorporates the user-recorded command, aircraft, and soldier performances without adding tactical simulation work.

Implemented scope:

- Inventoried 105 mono, 48 kHz, 16-bit PCM WAV source recordings totaling about 22.5 minutes. The original files remain unedited.
- Added `tools/build-dialogue-manifest.cjs`, which detects silence-separated takes and emits `assets/audio/dialogue/manifest.js`. The current manifest contains 87 semantic events and 326 usable takes; every spoken file resolves to three or four alternatives.
- Recorded files are fetched and decoded only when their event first occurs, then cached for reuse. Playback avoids immediately repeating the same take and rate-limits computer, aircraft, and soldier channels independently.
- Soldier acknowledgements select aggressive-hotshot, grim, nervous-but-determined, or steady-professional delivery from the soldier's existing personality trait. Missing style-specific combat phrases fall back to the steady-professional recording.
- Tactical hooks cover selection, movement, reload, shot outcomes, wounds/armor hits, End Turn, and victory. Existing synthesized shot, impact, click, and Skyranger effects remain active underneath and act as a safe fallback.
- Strategic hooks cover save/load, research/manufacturing/construction/transfer completion, personnel arrival, UFO/incident contact, mission outcome, council/base warnings where emitted, blocked funding/aircraft actions, Skyranger phases, and interceptor launch.
- No visibility, line-of-sight, lighting, pathfinding, civilian, AI, map generation, or 2D/3D tactical rule was changed. Save format remains 4.

Verification completed:

- `node tools/build-dialogue-manifest.cjs` completed with 105 recordings, 87 events, and 326 takes. `node --check` passed for the generator and checker.
- Static parsing passed for all 6 inline app scripts. `node tools/check-aegis-build.cjs` passed for build 0129 and independently validated recording count, source existence, take bounds, required events, and soldier styles.
- Localhost returned HTTP 200 for `index.html`, the generated dialogue manifest, and a representative encoded WAV URL.
- Browser Build Health passed 259/259, including `Recorded command aircraft and soldier dialogue uses segmented cached playback`.
- Browser smoke confirmed short version 0129, first-base setup, Geoscape load, a real Save action, six-soldier Red River Signal safe-2D launch, soldier selection, reload, one-hex movement, and three complete End Turn cycles.
- Final console inspection found no application errors and no `Recorded dialogue unavailable` fallback warnings. The only console entry was the existing Tailwind CDN warning.

Manual validation still required:

- Listen to several command, aircraft, and each soldier-style acknowledgement in normal play. Confirm the chosen take starts/ends cleanly and that speech volume sits comfortably over SFX and optional music.
- In tactical combat, sample selection, movement, reload, hit, miss, kill, wound, End Turn, and victory lines. Confirm cooldowns prevent chatter without making the squad feel silent.
- Launch and recover a Skyranger and perform an interceptor sortie. Confirm touchdown/ramp/return lines occur at natural moments and do not overlap awkwardly.
- Continue the outstanding spotted-civilian AI rescue and affected high-threat Port Attack tests from build 0128.

Remaining risks:

- Automated tests can prove files decode without fallback warnings, but cannot judge performance quality, trim feel, loudness, or whether a delivery emotionally matches the moment.
- The source recordings add about 124 MB to a complete build package. Runtime loading is lazy and cached, but first playback of each long source file still transfers that entire WAV.
- Several strategic alerts depend on the existing report wording; the checker covers current mappings, but future text changes should preserve or explicitly update their semantic audio hooks.
- One pre-campaign browser remount reported 256/259 because three older procedural tactical-map rows rolled false; the immediate final rerun passed 259/259. Those pre-existing randomized self-tests should eventually use fixed fixtures so Build Health cannot flicker between reloads.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the dialogue listening pass plus the live AI rescue and Port Attack checks.

## v0.26.07.14.0128 - Tactical AI Continuation and Civilian Rescue Priority

Build `v0.26.07.14.0128_TACTICAL_AI_CONTINUATION_AND_CIVILIAN_RESCUE_PRIORITY_INDEX_ONLY_PATCH` preserves save format 4 and fixes manual-to-AI tactical handoff while adding bounded civilian rescue priorities to the continuation AI.

Gameplay scope implemented:

- AI Command now clones the current tactical units, cover state, round, explored cells, and Skyranger hull/ramp placement before invoking the mission resolver. It no longer asks the resolver to create a fresh deployment.
- Continuation soldiers preserve identity, position, facing, HP, TU, ammunition, and existing casualties. Aliens preserve identity, position, HP, reveal state, and casualties. Civilians preserve reveal, rescue, escort, formation, and panic state.
- Playback frames now carry civilians plus live HP, TU, and ammunition. Map playback applies those values instead of restoring pre-handoff values or dropping civilians from the unit array.
- AI rescue duty considers only living revealed civilians and existing revealed escorts. Hidden civilians remain unknown to the AI.
- Existing escorts move toward the current Skyranger ramp before their soldier performs combat actions. Available soldiers approach and contact the nearest revealed unescorted civilian, spending the existing 8 TU and using the existing repeated-contact chance for panic.
- Rescue movement reuses the existing single-file escort mover and remains bounded to six soldiers, four followers per soldier, and four soldier steps per exchange.
- Alien fire can select a visible civilian when one is exposed. Surviving civilian hits can trigger panic, and civilians whose escort dies can break and use the existing two-step line-of-sight panic movement and recovery rules.
- AI Command is disabled while a manual movement animation is active, preventing pending movement timers from racing the continuation snapshot.
- Extracted civilians remain rescued rather than being interpreted as fallen units during playback; they do not trigger death animations or sounds.

Performance and compatibility:

- Save format remains 4 because the continuation snapshot is transient tactical state and does not alter campaign-save structure.
- Normal instant simulations keep their existing generated-deployment behavior. The live-state branch is used only when AI inherits a manual tactical battle.
- Rescue decisions examine the small active unit lists and reuse indexed cover/visibility helpers. No full-map scan, per-cell pathfinding loop, local-light calculation, or 2D/3D state fork was added.
- Safe 2D remains the tactical default. Lighting remains removed from gameplay and render hot paths.

Verification completed:

- Static inline app-script parsing passed 6/6; `node --check tools\check-aegis-build.cjs` passed; `node tools\check-aegis-build.cjs` passed for build 0128.
- Localhost returned HTTP 200 and the start screen displayed short version 0128. A new checker seam now requires the short version to match the manifest build prefix.
- Browser Build Health passed 258/258, including `AI tactical handoff preserves the live battlefield and prioritizes spotted civilians`.
- A fresh campaign confirmed the North America first-base site, loaded the Geoscape, assigned six soldiers, and launched Red River Signal on the safe-2D 64 x 64 battlefield.
- Orin moved one hex toward the ramp and spent 4 TU. AI Command changed to disabled `Movement Active` during the animation and became available only after movement settled.
- Tactical Map handoff opened on `Frame 1/25: AI inherited round 1`, not a new `Contact confirmed` deployment. Playback reached Exchange 3A after three A/B exchanges without a tactical error banner.
- Final browser console inspection found no application errors. Build Health was rerun after the extracted-civilian playback correction and remained 258/258.

Manual validation still required:

- Reveal a civilian, leave them unescorted, then hand the battle to AI Command. Confirm an available soldier approaches, spends 8 TU on contact, and leads the civilian toward the existing rear ramp before taking combat actions.
- Hand off with one to four civilians already following a soldier. Confirm the exact chain, panic state, current positions, and extraction progress continue without overlap or a map reset.
- Hand off after damaging a soldier, spending ammunition/TU, killing an alien, and breaching structural cover. Confirm the first playback frame preserves each exact value and the breach remains passable.
- Let aliens threaten an AI-led civilian and kill an escort. Confirm panic, flight, recovery, and repeated contact feel appropriate during AI continuation.
- Repeat the affected high-threat Port Attack in safe 2D and confirm the inherited AI turns remain responsive.

Remaining risks:

- Build Health deterministically covers revealed-versus-hidden civilian priority, snapshot preservation, ramp extraction, and source seams, but a live spotted-civilian AI rescue was not reached during browser verification.
- The continuation resolver computes the remaining fight into playback frames up front. It preserves the inherited state but still uses the existing simulation AI combat model rather than replaying manual click-by-click tactical AI.
- Dense multi-escort cross-traffic and the exact high-threat Port Attack save remain the authoritative performance and interaction fixtures.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the live AI rescue and Port Attack checks.

## v0.26.07.14.0127 - Tactical Live Action State and Escort Route Feedback

Build `v0.26.07.14.0127_TACTICAL_LIVE_ACTION_STATE_AND_ESCORT_ROUTE_FEEDBACK_INDEX_ONLY_PATCH` preserves save format 4 and fixes stale tactical action state while completing the safest contained portion of `TACTICAL_CIVILIAN_ESCORT_STATUS_AND_EXTRACTION_ROUTE_FEEDBACK_INDEX_ONLY`.

Gameplay scope implemented:

- Reload, fire-mode selection, alien shots, and structural breach shots now resolve from an immediately current tactical unit and mode snapshot instead of a previous React render closure.
- Sequential actions cannot restore stale ammo or TU by mapping over an older unit array. Reload writes its updated unit to the live snapshot before the next click can resolve.
- Fire-mode selection updates the live mode before React completes its visual commit, so a Burst-to-Single switch uses Single's 14-TU cost and one-round profile on the next action.
- Selected soldiers now show an `Extraction Route` status with direct distance to the nearest rear-ramp hex and counts for assigned, following, forming, and held civilians.
- Escort feedback is derived from the existing four-civilian bounded chain and direct hex distance. It does not run pathfinding, scan the battlefield, or change escort outcomes.

Performance and compatibility:

- Save format remains 4 because tactical unit refs, selected fire mode, and escort-route summaries are transient manual-battle state.
- Port visibility indexing, one-pass movement reachability, lighting removal, safe-2D default, and 2D/Three.js parity remain unchanged.
- The route readout examines only the selected soldier, at most four active followers, and five Skyranger ramp cells.

Verification completed:

- Static inline app-script parsing passed 6/6; `node --check tools/check-aegis-build.cjs` passed; `node tools/check-aegis-build.cjs` passed for build 0127.
- Localhost returned HTTP 200, the start screen displayed build 0127, and browser Build Health passed 257/257.
- A fresh campaign reached first-base confirmation and the Geoscape. Range and ferry controls remained combined in the Operational Overlays section.
- A six-soldier Red River Signal mission launched in safe 2D on the 64 x 64 battlefield. Selecting Greta displayed `Ramp 3 hexes away` and `No civilians assigned`; movement consumed TU and updated ramp distance.
- Reload changed Greta from 55 to 37 TU with 12 rounds ready. Clicking Burst and then Single left Single visibly selected. Three End Turn cycles returned to human control with the selected soldier restored to full TU.
- Browser console inspection found no application errors; existing non-error browser advisories remain outside gameplay code.

Manual validation still required:

- Empty a ballistic magazine, reload, and immediately fire at a revealed alien or structural breach target. Confirm the restored ammunition is used and the shot does not report another reload requirement.
- With 14-23 TU remaining, click Burst, switch to Single, and immediately fire at a valid target. Confirm the shot succeeds at Single cost instead of reporting insufficient Burst TU.
- Escort civilians and confirm assigned/following/forming/held counts and ramp distance update through corners, blocked chains, panic, recovery, and extraction.
- Repeat the exact affected high-threat Port Attack in safe 2D for the authoritative performance check.

Remaining risks:

- Build Health covers zero-ammo reload state and the Burst-illegal/Single-legal threshold deterministically, but the exact target-click cadence still needs hands-on confirmation in a battle with a revealed valid target.
- Ramp distance is intentionally direct hex distance, not a promised traversable path length; blocked-route guidance remains future scope.
- The exact Port Attack save and dense multi-escort routes remain the authoritative performance and interaction fixtures.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the reload/fire-mode target-click checks and escort-status playtest pass.

## v0.26.07.13.0126 - Escort Formation Collision and Panic Balance

Build `v0.26.07.13.0126_TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY_PATCH` preserves save format 4 and hardens the bounded civilian escort and panic systems introduced in build 0124.

Gameplay scope implemented:

- Escort chains now distinguish civilians still forming up from civilians joined to the single-file route. Newly contacted civilians can take bounded one-hex catch-up steps until they reach their predecessor's trail.
- Once joined, each civilian moves only into the exact hex vacated by the soldier or preceding follower. A link that cannot advance holds every follower behind it instead of compressing, overlapping, or cutting around the obstruction.
- Destination reservation includes every non-chain unit and each committed chain destination. The movement remains limited to one soldier and at most four followers, with no full-map path search.
- Civilian badges now distinguish `FORM`, `FOLLOW`, `HOLD`, and `PANIC` states in both tactical views through the shared unit glyph.
- Panicked civilians still move at most two hexes per alien turn, but candidate cells now rank fewer visible aliens ahead of raw distance. One indexed visibility context is reused for the bounded candidate checks.
- Panic balance is centralized and deterministic for tests: surviving civilian break chance is 65% after a hit and 20% after a miss; loss of an escort uses 75%; contact attempts remain 55%, 80%, then 95%; recovery out of sight is 55% on the first turn and reaches 95% by the third.
- Build Health controls now open on a normal click instead of pointer-down, preventing the newly mounted Close button from consuming the same click.

Performance and compatibility:

- Save format remains 4 because escort formation and panic state are transient to an active manual tactical battle.
- The optimization budget remains bounded to four followers, six neighboring cells per forming follower, and two panic steps. Panic candidate line-of-sight checks reuse one cover index per civilian move.
- Port visibility indexing, reachable-cell flood fill, lighting removal, safe-2D default, and the shared 2D/Three.js tactical state remain unchanged.

Verification checklist:

- Static app-script parsing passed 6/6 and `node tools\check-aegis-build.cjs` passed for build 0126; the checker also passed `node --check`.
- Browser Build Health passed 255/255, including `Escort chains reserve single-file cells and panic favors broken sightlines`.
- Localhost start screen displayed build 0126, first-base confirmation reached the Geoscape, and a six-soldier Red River Signal safe-2D mission launched on the 64 x 64 battlefield with 26 Skyranger hull cells and five passable ramp cells.
- Three End Turn cycles returned to human control in 575ms, 630ms, and 597ms without a runtime banner.
- Final browser console inspection found no errors. The only current-page messages were the existing Tailwind CDN production advisories emitted on page reload.

Manual validation still required:

- Contact two to four civilians from different sides of a soldier, walk several corners and a one-cell breach, and confirm `FORM` changes to `FOLLOW` without overlap. Block the chain and confirm trailing civilians display `HOLD` until the route clears.
- Walk the complete chain onto the visible rear ramp and confirm civilians extract in order while every vacated ramp cell remains traversable.
- Let aliens hit and miss escorted civilians, then kill an escort soldier. Confirm panic frequency feels fair, fleeing favors cells that break alien sightlines, and repeated 8-TU contact attempts can recover a panicked civilian.
- Repeat the exact affected high-threat Port Attack in safe 2D for the authoritative performance check.

Remaining risks:

- Collision and formation self-tests cover deterministic multi-follower movement and occupied neighboring cells, but dense player-created cross-traffic and multiple chains still need hands-on stress testing.
- Panic probabilities are intentionally conservative first-pass balance values and may need tuning after repeated real battles.
- The exact high-threat Port Attack save remains the authoritative performance case.

Next recommended patch: `TACTICAL_CIVILIAN_ESCORT_STATUS_AND_EXTRACTION_ROUTE_FEEDBACK_INDEX_ONLY`, after hands-on formation, ramp traversal, and panic-frequency validation.

## v0.26.07.13.0125 - Isometric Skyranger Single Craft and Ramp

Build `v0.26.07.13.0125_TACTICAL_ISOMETRIC_SKYRANGER_SINGLE_CRAFT_AND_RAMP_INDEX_ONLY_PATCH` preserves save format 4 and replaces the modular-looking isometric Skyranger hull with one cohesive aircraft and attached rear extraction ramp.

Visual scope implemented:

- Three.js no longer renders one box or panel for every Skyranger collision cell. Hull and ramp cover cells remain gameplay-only in the isometric renderer.
- One aligned `Skyranger` group now represents the complete transport with a continuous fuselage, lower hull, raised cabin, tapered nose, cockpit, wings, twin engines, tailplanes, vertical tail, rear cargo opening, and cargo floor.
- A single sloped rear ramp is visibly attached to the cargo opening. Ramp rails and transverse deck stripes make the civilian extraction route readable from the tactical camera.
- The craft uses the existing deterministic Skyranger placement and body direction, so the visual rear ramp remains aligned with the same passable extraction cells used by 2D, pathfinding, and civilian escort logic.
- The model uses one bounded group of fixed primitive meshes and adds no dynamic lights, animation loop, per-cell model generation, or save data.

Preserved behavior:

- Safe 2D keeps its multi-cell hull and ramp indicators for precise tactical path reading.
- Civilian escort capacity, breadcrumb following, panic, recovery, extraction rewards, and ramp-cell traversal are unchanged.
- Port visibility, indexed cover lookup, reachable-cell flood fill, lighting removal, and safe-2D default remain unchanged.

Verification checklist:

- Static app-script parsing passed 6/6.
- `node tools\check-aegis-build.cjs` passed for build 0125, and the checker passed `node --check`.
- Browser Build Health passed 254/254, including the cohesive Three.js craft and attached-ramp contract.
- The localhost start screen displayed build 0125, first-base confirmation reached the Geoscape, and a six-soldier 64 x 64 safe-2D mission launched with the unchanged 26-cell hull footprint and five passable ramp cells.
- Three.js Performance mode rendered a nonblank 648 x 640 canvas. Visual inspection at Near and Close zoom confirmed one continuous aircraft silhouette with cockpit, fuselage, wings, engines, tail, rear cargo opening, and one attached ramp facing the deployed soldiers.
- Three.js Quality mode rendered the same craft on a nonblank 800 x 750 canvas without a runtime error.
- Three End Turn cycles in isometric Close view returned to human control in 915ms, 856ms, and 841ms.
- Final browser console inspection found no errors. The only current-page message was the existing Tailwind CDN production advisory.

Manual validation still required:

- Inspect the Skyranger in Three.js Performance and Quality modes at Near and Close zoom. Confirm it reads as one aircraft rather than separate cover pieces.
- Walk a soldier and escorted civilians onto the rear ramp. Confirm the visible ramp aligns with the cyan extraction cells and civilians extract normally.
- Repeat the exact affected high-threat Port Attack in safe 2D to retain authoritative performance validation.

Remaining risks:

- The fixed primitive model is intentionally gameplay-readable rather than final aircraft art; proportions and colors may still benefit from art-direction tuning.
- Wing overhang is visual and does not expand the underlying five-hex-wide collision footprint.
- The exact high-threat Port Attack save remains the authoritative performance case.

Next recommended patch: `TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY`, after hands-on ramp alignment and multi-civilian escort validation.

## v0.26.07.13.0124 - Tactical Skyranger Ramp, Civilian Escorts, and Panic

Build `v0.26.07.13.0124_TACTICAL_SKYRANGER_RAMP_CIVILIAN_ESCORT_AND_PANIC_INDEX_ONLY_PATCH` preserves save format 4 and replaces instant civilian extraction with physical escort gameplay tied to a deployed Skyranger.

Gameplay scope implemented:

- Tactical deployment clears a deterministic five-hex-wide Skyranger footprint near the squad, adds indestructible hull cover, and leaves a visible five-cell centerline rear ramp/corridor. Soldiers deploy just outside the ramp as if they disembarked from the transport.
- Civilian extraction occurs only when a following civilian physically enters a Skyranger ramp cell. Rescued civilians retain living HP, leave occupancy and both renderers, and no longer intercept cell clicks or stale movement highlighting.
- Contacting an adjacent revealed civilian costs 8 TU and assigns them to the selected soldier. Each soldier may lead up to four living civilians.
- Escort followers advance through the cells vacated by the soldier and preceding followers. The update touches only that soldier's escort chain and keeps civilians in single file without full-map path searches.
- Alien fire can break a surviving civilian from their escort. Losing a soldier escort gives each follower a chance to panic and detach.
- Panicked civilians make at most two bounded neighbor steps per alien turn, choosing cells that increase distance from currently visible alien threats. Once no threat remains visible they have an increasing chance to recover.
- A soldier can retry contact with a panicked civilian for 8 TU. The first attempt can fail, while later attempts receive an increasing success chance.
- Safe 2D and Three.js both render the multi-cell Skyranger hull/ramp and civilian state feedback. Following civilians are cyan and marked `FOLLOW`; panicked civilians are red and marked `PANIC` without using the casualty state.
- The Geoscape now presents range rings and aircraft ferry-route controls inside one `Operational Overlays` section while preserving the independent Shortwave, Longwave, Interceptor, Skyranger, Show Both, and hide controls.

Performance and compatibility:

- Save format remains 4 because Skyranger placement, escort chains, and panic are transient manual-battle state.
- Port visibility, indexed cover lookup, shared reachable-cell flood fill, and lighting removal remain unchanged.
- Panic movement examines at most six neighbors for two steps per panicked civilian. Escort movement updates at most four followers for the moving soldier.

Verification checklist:

- Static app-script parsing passed 6/6 after the final Geoscape merge.
- `node tools\check-aegis-build.cjs` passed for build 0124, including the new escort and merged-overlay rows; the checker itself also passed `node --check`.
- Browser Build Health passed 253/253.
- The localhost start screen displayed build 0124, first-base confirmation reached the Geoscape, and the merged `Operational Overlays` section retained all seven range/ferry controls. Activating Shortwave reported one visible range ring; activating Show Both reported the combined Interceptor and Skyranger network without runtime errors.
- A six-soldier 64 x 64 safe-2D Red River Signal mission generated 26 visible Skyranger hull cells, five passable ramp cells, and two living civilians. Three End Turn cycles returned to human control in 684ms, 684ms, and 656ms without a runtime banner.
- Three.js Performance mode rendered the shared Skyranger state on a nonblank 648 x 640 canvas.
- Final browser console inspection found no errors. The only current-page message was the existing Tailwind CDN production advisory.

Manual validation still required:

- Contact one civilian and move through several turns and corners. Confirm the civilian follows the soldier's vacated cells without blocking the soldier or overlapping another follower.
- Build a four-civilian chain, walk the soldier up the Skyranger ramp, and confirm the civilians extract in order while the ramp cells remain traversable.
- Let aliens fire at an escorted civilian and kill an escort soldier in separate tests. Confirm panic can occur, fleeing increases distance from visible aliens, and civilians stop fleeing before recovering once the threat is no longer visible.
- Retry contact with a panicked civilian until they follow, confirming each attempt costs 8 TU and that an initial refusal remains possible.
- Load the affected campaign without overwriting it and run the exact high-threat Port Attack in safe 2D through selection, movement highlights, escort movement, and at least three End Turn cycles.

Remaining risks:

- The exact high-threat Port Attack save remains the authoritative performance case.
- Escort path behavior around tight one-cell breaches and multiple independently moving escort chains needs hands-on stress testing.
- Panic and recovery percentages are first-pass values and may need pacing adjustments after campaign play.

Next recommended patch: `TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY`, after manual validation of multi-civilian corners, ramp entry, and panic recovery. Fire/smoke and building power-loss remain deferred while lighting is parked.

## v0.26.07.13.0123 - Tactical Rescue State, Rewards, and Objective Variants

Build `v0.26.07.13.0123_TACTICAL_RESCUE_STATE_REWARDS_AND_OBJECTIVES_INDEX_ONLY_PATCH` preserves save format 4, fixes extracted-civilian state rendering, and implements the safest contained portion of the rescue outcome and mission-objective roadmap item.

Gameplay scope implemented:

- Rescuing a civilian now records a living `rescued`/`extracted` state instead of setting HP to zero. Extracted civilians leave both tactical renderers, no longer occupy movement cells, and cannot be selected or targeted as battlefield casualties.
- Civilian casualty counts remain based on actual zero HP without the rescued flag, keeping rescued and killed outcomes separate.
- Terror and abduction incidents use a Critical Rescue objective requiring two thirds of civilians, paying $40k per extraction plus a $100k completion bonus after primary mission success.
- Port, urban, farmstead, harvest, prairie, and town incidents use an Area Evacuation objective requiring half of civilians, paying $30k per extraction plus a $60k completion bonus after primary mission success.
- Other incident types keep civilian rescue optional and pay $25k per extraction. Rescue earnings remain available after an abort, but objective completion bonuses require primary mission success.
- The tactical objective panel reports the mission-intent requirement and current rescue bonus. Manual mission results carry the civilian outcome into campaign funds, mission summaries, logs, and stored mission reports.
- Primary tactical victory rules remain unchanged: civilian objectives are secondary and cannot convert an alien-elimination failure into mission success.

Verification checklist:

- Static app-script parsing passed 6/6.
- `node tools\check-aegis-build.cjs` passed, including the build-label seam and required Build Health rows.
- Browser Build Health passed 251/251, including the rescue extraction-state and mission-intent reward row.
- Localhost start screen displayed build 0123 and a new campaign loaded through first-base placement into the Geoscape.
- A six-soldier 64 x 64 safe-2D Red River Signal mission launched with two living civilians and the Civilian Assistance objective visible. Three End Turn cycles returned to human control in 731ms, 770ms, and 734ms without a runtime banner; all six soldiers and both awaiting-rescue civilians remained active.
- Browser console inspection found no errors. The only warnings were the existing Tailwind CDN production advisory.

Manual validation still required:

- Player validation confirmed that a revealed adjacent civilian disappeared without turning red, spent 8 TU, and incremented the extracted counter. The vacated cell remained non-traversable because the click occupant lookup and reachable-cell memo dependency still retained stale civilian state; build 0124 supersedes instant extraction and fixes both stale boundaries.
- Complete and abort separate manual missions after extracting civilians. Confirm per-rescue funding is credited in both cases and the requirement completion bonus is credited only after primary victory.
- Load the affected campaign without overwriting it and run the exact high-threat Port Attack in safe 2D through selection, movement highlighting, rescue interaction if available, and at least three End Turn cycles.

Remaining risks:

- Auto-resolved/classic missions do not simulate the manual civilian layer, so they retain the base mission reward with no rescue bonus.
- The exact high-threat Port Attack save remains the authoritative performance case and still requires player-side validation.
- Reward amounts and rescue requirement ratios are deliberately conservative first-pass values and may need economy tuning after real campaign play.

Next recommended patch: `TACTICAL_CIVILIAN_ESCORT_INTERACTION_AND_OBJECTIVE_BALANCE_INDEX_ONLY`, only after hands-on rescue pacing and reward validation. Fire/smoke and building power-loss remain deferred while tactical lighting is parked and Port performance remains under observation. Parallel strategic work remains `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY` after its existing manual reservation-flow validation.

## v0.26.07.13.0122 - Tactical Lighting Removal, Civilian Rescue, and Breach Feedback

Build `v0.26.07.13.0122_TACTICAL_LIGHTING_REMOVAL_CIVILIAN_RESCUE_BREACH_FEEDBACK_INDEX_ONLY_PATCH` preserves save format 4, removes tactical illumination from active gameplay/render hot paths, and implements the first contained civilian/rescue and structural-breach roadmap slice.

Lighting decision:

- Tactical vision is fixed at 20 hexes for soldiers and aliens; local lamps, interiors, headlights, solar phase, and per-cell brightness no longer change LOS.
- The shared visibility context now contains only the indexed live-cover lookup used by bounded LOS checks.
- Safe 2D terrain styling no longer calculates mission lighting or per-cell local light.
- Three.js uses a neutral baseline scene and no longer builds static building, lamp, vehicle-headlight, or wreck point lights. Transient weapon-impact feedback remains.
- Street lamps, vehicle headlights, windows, and fixtures remain visual terrain props so a future lighting pass can be reconsidered without changing map generation or saves.

Gameplay scope implemented:

- Manual tactical deployments create two to four neutral civilians on clear deterministic cells without changing campaign save data.
- Civilians reveal through the existing bounded human visibility pass, can be attacked by aliens, and report rescued/lost/awaiting counts in the tactical objective panel and mission log.
- A soldier adjacent to a revealed civilian can spend 8 TU to escort that civilian to the marked cyan extraction perimeter.
- Both 2D and Three.js identify civilians separately from armed soldiers and aliens; civilians do not display weapons or facing beams.
- Revealed structural walls, windows, and partitions can be targeted deliberately with the selected fire mode.
- Structural damage produces damaged/critical HP badges. Destroyed structural cover becomes visible, passable breach rubble instead of disappearing without feedback.
- Build Health adds rows for lighting-free tactical hot paths and shared civilian/rescue/breach state while retaining the bounded Port visibility/reachability regression.

Verification checklist:

- Static parsing passed across all six inline scripts after the final polish.
- `node tools\check-aegis-build.cjs` passed for the 0122 manifest/build seams.
- Localhost start screen displayed `v0.26.07.13.0122`; first-base confirmation and the main Geoscape loaded normally.
- Browser Build Health passed `250/250`, including the lighting-removal, civilian/rescue/breach, and bounded Port rows.
- A final six-soldier safe-2D mission launched on the 64x64 field with two civilians, 19 extraction-zone cells, one selected-soldier ring, and 180 visible movement highlights.
- Three End Turn cycles returned to the human turn in approximately 1.17 to 1.20 seconds each without degrading the civilian objective state.
- The Three.js Performance view rendered a nonblank 648x640 canvas with the neutral-visibility status and shared civilian/rescue/breach contract.
- A separate clean localhost load produced no runtime or console errors. The only console message was the existing Tailwind CDN production warning.

Manual validation still required:

- Load the player's affected campaign without overwriting it and launch the exact high-threat Port Attack in safe 2D; compare launch, selection, highlights, and three End Turn cycles against 0121.
- In a mission where civilians become visible, move adjacent and click one. Confirm 8 TU is spent, the extraction count increments, and aliens can kill an unrescued civilian without affecting soldier controls.
- On a map with a revealed building, fire Single/Burst/Full Auto at a wall or window. Confirm HP badges progress through damaged/critical, destruction leaves passable rubble, and both 2D and 3D show the breach.
- Judge whether immediate 8-TU extraction feels appropriately paced or should become a multi-turn escort objective in the next gameplay patch.

Remaining risks:

- The exact high-threat Port Attack save remains the authoritative performance case and was not available in this automated session.
- The practical smoke mission did not reveal a civilian or structural building target near the drop zone, so live rescue and deliberate-breach interaction still need hands-on confirmation.
- Civilian targeting increases tactical pressure and may need threat-specific weighting after playtesting.
- Dormant lighting helper code remains parked for possible later reuse, but Build Health verifies that active LOS, safe 2D styling, and Three.js scene construction do not call it.

Next recommended patch: `TACTICAL_RESCUE_OUTCOME_REWARDS_AND_MISSION_OBJECTIVE_VARIANTS_INDEX_ONLY`, adding mission-intent-specific rescue requirements and outcome rewards after the interaction feel is confirmed. Fire/smoke and building power-loss simulation remain deferred until gameplay behavior and the Port performance baseline are stable.

## v0.26.07.13.0121 - Tactical Lighting Cache Performance Fix

Build `v0.26.07.13.0121_TACTICAL_LIGHTING_CACHE_PERFORMANCE_INDEX_ONLY_PATCH` preserves save format 4 and targets the remaining renderer-independent tactical CPU pressure from local lighting during safe-2D alien incident battles.

Root causes addressed:

- Tactical state changes scanned all 4,096 map cells and recalculated human visibility for each cell.
- Each visibility calculation could still rescan all local light sources for target and observer cells during repeated line-of-sight checks, making lighting a likely contributor to the remaining Port Attack slowdown.
- Cover reveal repeated much of the same visibility work after the full-map scan.
- Selecting a soldier ran an independent breadth-first path search for every possible destination instead of computing the reachable area once.

Implemented changes:

- Added per-cell local-light caching to the shared tactical visibility context so target and observer lighting are computed once per visibility pass.
- Reused the cached lighting object in tactical vision range checks instead of recalculating mission solar/phase lighting per cell.
- Preserved the existing indexed cover lookup, bounded visible-cell set, and single reachable-cell flood fill from the previous performance patch.
- Added Build Health row `Tactical lighting cache keeps local-light visibility bounded` and strengthened the deterministic Port Attack fixture.

Verification checklist:

- Static app-script parsing passed across all six inline scripts.
- `node tools\\check-aegis-build.cjs` passed with the 0121 manifest/build seams.
- Browser Build Health passed `249/249`, including `Tactical lighting cache keeps local-light visibility bounded` and `Port tactical visibility and turns use indexed bounded passes`.
- Localhost smoke passed through the 0121 start screen, first-base confirmation, main Geoscape load, Build Health, full six-soldier squad assignment, mission launch confirmation, Skyranger travel, and safe-2D tactical arrival.
- The live 64x64 2D battlefield became interactive after the Skyranger arrival tick in approximately 3.6 seconds, including the verification wait interval.
- Soldier selection returned the selected soldier controls in approximately 1.1 seconds; DOM inspection confirmed the selected-cell ring and tactical controls, but visual movement-highlight feel still needs manual eyes-on testing.
- Three End Turn cycles returned to the human turn in approximately 0.9-1.0 seconds each.
- No browser runtime or console errors surfaced during Build Health or the live tactical mission; the only browser warning was Tailwind's CDN production warning.

Manual validation still required:

- Load the player's affected campaign and launch the exact high-threat Port Attack in safe 2D.
- Confirm initial launch, soldier movement-range highlights, and at least three End Turn cycles remain responsive without Windows offering to close the page.
- If a long pause remains, note the displayed tactical phase and whether it occurs before the map appears, on soldier selection, or during alien actions.

Next recommended patch: `TACTICAL_AI_TURN_CHUNKING_AND_2D_DOM_VIRTUALIZATION_INDEX_ONLY` only if the affected Port Attack still stalls. Otherwise continue `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.13.0100 - Three.js Instanced Ground and Failsafe Recovery

Build `v0.26.07.13.0100_TACTICAL_THREEJS_INSTANCED_GROUND_AND_FAILSAFE_RECOVERY_INDEX_ONLY_PATCH` preserves save format 4 and removes the largest remaining per-map Three.js ground allocation while making isometric combat opt-in and recoverable.

Implemented changes:

- Replaced hundreds of individual tactical ground meshes with one colorized `THREE.InstancedMesh`; instance IDs map back to authoritative tactical cells for selection and movement picking.
- Standardized the ground transform on exact pointy-hex spacing (`sqrt(3) * radius` horizontally and `1.5 * radius` vertically) with a 1.2 percent overlap to eliminate visible seams between neighboring tiles.
- Performance mode now budgets one ground mesh while preserving terrain colors, height, fog visibility, edge cells, and tactical simulation data.
- New campaigns enter manual tactical combat in 2D Hex. Three.js remains available through the explicit `3D Iso` control and does not change tactical rules.
- Missing Three.js instancing support or a lost WebGL context automatically returns the mission to 2D with a readable recovery notice.
- Auto, Performance, and Quality controls now appear on the main menu and persist through the existing local preference key, allowing Performance to be selected before any battle loads.
- Build Health includes `Three.js tactical instanced ground preserves picking gapless hexes and 2D recovery`.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed with the 0100 manifest/build seams.
- Browser Build Health passed `247/247`.
- Localhost smoke passed through the start screen, main-menu Performance selection, first-base confirmation, squad assignment, mission launch, and Skyranger arrival.
- The mission opened in 2D Hex, then switched successfully to a live 26x26 Three.js Performance map with one 648x640 canvas.
- The Three.js readout reported `Wilderness - Night - Performance`, confirming that the pre-battle main-menu preference was honored.

Manual validation still required:

- On the affected PC, select Performance on the main menu and complete a full Three.js mission, including selection, movement, firing, End Turn, and victory.
- Confirm adjoining ground hexes visually meet edge to edge at Near, Close, and Map zoom levels.
- Confirm deliberate WebGL interruption or graphics-driver reset returns to 2D rather than trapping the campaign, if such a test can be performed safely.

Next recommended patch: `TACTICAL_THREEJS_SCENE_TELEMETRY_AND_COVER_INSTANCING_INDEX_ONLY` only if the affected PC still stalls. Otherwise continue `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.13.0030 - Three.js Tactical Performance and Timeout Hardening

Build `v0.26.07.13.0030_TACTICAL_THREEJS_PERFORMANCE_AND_TIMEOUT_HARDENING_INDEX_ONLY_PATCH` preserves save format 4 and targets the timeout/stall risk reported on the player's PC.

Root causes addressed:

- The isometric renderer previously created a ring mesh for every visible cell, including ordinary noninteractive ground.
- Unseen ground received a second fog mesh even though its base tile was already rendered dark.
- All tactical building, vehicle, and lamp lights were added even when far outside the current camera window.
- Dynamic shadows and a 1024px shadow map were always enabled.
- Device pixel ratio could reach 2x, multiplying fragment workload.
- The 64x64 Map view could attempt thousands of separate tile/ring/fog objects.
- A permanent requestAnimationFrame loop traversed and rendered the entire scene at roughly 60fps even while idle.

Implemented changes:

- Added persistent `Auto`, `Performance`, and `Quality` controls to manual Three.js tactical missions.
- Auto resolves to Performance for lower/unknown hardware hints and to Auto Balanced only when both reported CPU and memory hints are strong.
- Performance caps the 3D overview at 32x32, uses 1x pixel ratio, disables antialiasing/shadows/redundant fog meshes, uses Lambert materials, limits local lights to six, and lowers ring geometry detail.
- Auto Balanced caps at 40x40 with 1.2x pixel ratio, no shadows, and ten local lights.
- Quality remains opt-in and preserves the full 64x64 overview, higher pixel density, shadows, standard materials, more lights, and fog meshes.
- Ordinary cell rings are no longer created. Rings remain for map edges, reachable cells, and the selected unit cell.
- Local tactical lights are filtered to the visible map window, sorted by camera proximity, and capped by quality mode.
- Static scenes render once and again on resize/state rebuild. Continuous frame animation is reserved for the victory dance.
- Ray picking remains attached to ground tiles, preserving click-to-select/move behavior.
- The Three.js status identifies the resolved quality mode and the displayed Hexes count reveals any overview cap.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 0030 manifest/build seams.
- Browser Build Health passed `246/246`, including `Three.js tactical performance mode caps expensive rendering and idles on demand`.
- A live manual tactical mission loaded as `Auto Performance` with no console errors.
- Selecting the 64x64 Map control in Performance produced a responsive `Hexes: 32 x 32` Three.js view with a visible 648x600 canvas.
- Deterministic coverage confirms Performance has zero normal rings, zero redundant fog meshes, zero idle animation frames, six lights, no shadows, and a 1x pixel ratio.

Manual validation still required:

- Reproduce the formerly timing-out mission on the affected PC using Auto/Performance.
- Select, move, rotate, and fire with several soldiers; run alien turns and confirm responsiveness does not degrade over time.
- Test the capped Map overview, then return to Near/Close and confirm camera/selection behavior remains correct.
- Complete a victory and confirm the temporary animation loop stops when leaving the mission.
- Compare Performance lighting/building readability against Quality only if the optimized mode is stable.

Next recommended patch: `TACTICAL_THREEJS_INSTANCED_GROUND_AND_SCENE_TELEMETRY_INDEX_ONLY` only if Performance still stalls on the affected PC; it would batch ground tiles into instanced draw calls and add a compact renderer-object/draw-call readout. Otherwise resume `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.12.1940 - Tactical Enclosures, Vehicles, and Local Lighting

Build `v0.26.07.12.1940_TACTICAL_ENCLOSURES_VEHICLES_AND_LOCAL_LIGHTING_INDEX_ONLY_PATCH` preserves save format 4 while deepening tactical structure readability and incident atmosphere.

Implemented changes:

- Exterior wall segments are taller and overlap enough to read as continuous roofless building shells in the isometric view.
- Larger structures receive internal hard-cover partitions with passable room gaps.
- Furnishing placement now follows building purpose rather than a generic three-prop pattern, with at least eight distinct interior object types across district archetypes.
- City, small-town, and farm route networks can contain sedans, vans, utility vehicles, and nearby lamp posts.
- Vehicles provide substantial cover and street obstruction; lamps remain lighter cover while acting as illumination sources.
- Three.js vehicles include body/cabin geometry and headlights, while 2D Hex uses matching vehicle and lamp silhouettes.
- Manual tactical missions stamp their actual Geoscape arrival month/day/minute into mission state.
- Tactical solar phase uses the incident latitude/longitude plus stamped Geoscape clock to select Daylight, Twilight, or Night.
- Three.js changes sky, fog, hemisphere light, and directional light by phase, then adds local point lights for interiors, lamp posts, and vehicle headlights.
- 2D Hex uses the same solar/local-light model for per-cell brightness and saturation.
- Unaided visibility is longest in daylight, shorter at twilight, and shortest at night; lit target/observer areas restore part of that range without bypassing walls or facing cones.
- Coordinated-support copy now correctly describes round-based field time rather than the removed one-day mission cost.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 1940 manifest/build seams.
- Browser Build Health passed `245/245`, including `Tactical enclosures vehicles and local lights shape shared battlefield visibility`.
- Deterministic coverage confirms internal partitions, eight-plus furnishing visuals, three-plus city vehicles and lamps, all three solar phases, ordered vision ranges, local-light vision improvement, both render paths, and normalized mission clock stamps.
- Localhost browser smoke passed through start screen, first base, squad assignment, manual mission confirmation, Skyranger travel, and a North America night tactical arrival.
- The live Three.js status reported `Wilderness - Night`, named the Ranger Outpost, and explained that lamps/windows/vehicle lights affect visibility.

Manual validation still required:

- Reveal and enter several structures to judge wall continuity, room gaps, furniture density, and doorway pathfinding at normal tactical zoom.
- Play a city or small-town map to compare parked vehicle spacing and street-lamp placement against road usability.
- Compare the same tactical controls at day, twilight, and night and confirm darkness is tense without becoming visually exhausting.
- Confirm local light pools are apparent around interiors, street lamps, and headlights in both 2D and Three.js.
- Shoot vehicles, windows, partitions, and exterior walls to assess current cover-HP feedback before dedicated breach/fire work.

Next recommended tactical patch: `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`, adding civilians/rescue zones, explicit breach feedback, fire/smoke, destructible light sources, and building power-loss states. Parallel strategic follow-up remains `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1900 - Tactical Building Archetypes and Interiors

Build `v0.26.07.12.1900_TACTICAL_BUILDING_ARCHETYPES_AND_INTERIORS_INDEX_ONLY_PATCH` preserves save format 4 and expands the procedural tactical battlefield with original early-alien-defense-inspired structures.

Implemented changes:

- Added deterministic building plans for all four tactical biome families.
- City districts can contain a Municipal Records Office, Corner Market, and Vehicle Workshop.
- Small towns can contain a Roadside Diner, Family Residence, and Volunteer Fire Station.
- Farmland can contain a Farmhouse and Equipment Barn; wilderness can contain a Ranger Outpost.
- Each structure has an original footprint, one or more passable doors, hard/destructible wall cells, partial-cover window cells, distinct interior flooring, and interior cover props.
- Building placement avoids roads, service lanes, streams, and irrigation channels while leaving navigable exterior space.
- Random terrain cover no longer spawns inside planned building footprints.
- The 2D Hex view renders distinct brick, plaster, metal, timber, window, shelf, rack, counter, and table silhouettes.
- The Three.js view renders roofless cutaway wall sections, translucent blue window panes, and raised interior furnishings.
- Both views consume the same terrain and cover records, preserving movement, TU, line of sight, fog, weapon, damage, and AI rules.
- Tactical status and event logs identify the generated district structures without revealing hidden units.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 1900 manifest/build seams.
- Localhost browser smoke passed through start screen, first-base confirmation, squad assignment, mission confirmation, Skyranger travel, and Three.js tactical launch.
- Browser Build Health passed `244/244`, including `Tactical building archetypes share passable interiors across 2D and Three.js maps`.
- The deterministic test covers biome variety, six or more distinct structure names, blocking walls, partial windows, furnishings, passable doors, interior terrain, renderer support, and safe human/alien deployment.

Manual validation still required:

- Explore a wilderness/farm map and verify the outpost/farm structures read clearly after fog is revealed.
- Explore a small-town/city map in both 2D and Three.js and compare door, window, interior, and wall readability.
- Shoot structural wall/window cells and confirm their existing cover HP/destruction behavior feels appropriate.
- Confirm soldiers and aliens route through door gaps rather than clipping through hard wall cells.

Next recommended tactical patch: `TACTICAL_BUILDING_BREACHES_CIVILIANS_AND_OBJECTIVES_INDEX_ONLY`, adding clearer damaged structure states, controlled breach interactions, civilians/rescue zones, and mission-intent-specific objectives. Parallel strategic follow-up remains `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1830 - Relocation Queue, Classic Dance, and Terminator Map

Build `v0.26.07.12.1830_RELOCATION_QUEUE_CLASSIC_DANCE_AND_TERMINATOR_MAP_INDEX_ONLY_PATCH` preserves save format 4 while extending relocation logistics and adding an alternate operational world view.

Implemented changes:

- Send Home/Rebase requests made while another aircraft route is active can enter a conservative serial queue instead of failing outright.
- Queued craft are marked unavailable, retain origin/home identity, and reserve their destination hangar immediately.
- Queue state is included in campaign saves, normalized on load, and reconciled with existing active-route reservations.
- The Geoscape Ferry / Refuel Staging area lists active and queued relocation routes with craft, destination, route, ETA, and hangar reservation.
- Invalid or orphaned queued orders release their reservation and recover the affected craft safely.
- The classic-lineup victory celebration applies animation to the soldier paper-doll group only; the surrounding status card remains still.
- A persistent segmented control switches the Geoscape between the solid interactive globe and a full-world day/night terminator map.
- The terminator map reuses the detailed Geoscape land geometry plus bases, incidents, detected UFOs, alien bases, active aircraft, range overlays, ferry links, and placement previews.
- A continuous solar mask derives from the authoritative Geoscape clock. Advancing one Geoscape hour moves the subsolar longitude 15 degrees and redraws the day/night boundary.
- The flat map remains interactive for incident selection and land-site placement, and its view preference is stored separately from campaign saves.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed with the 1830 manifest and required seams.
- Localhost browser smoke passed through start screen, first-base setup, map-mode switching, first-base confirmation, and main Geoscape.
- The Terminator Map rendered at 720x360 with detailed opaque landmasses, both opening incident markers, range previews, and a smooth clock-driven solar mask.
- A practical `Tick +1h` changed the displayed subsolar longitude from E60 to E45, confirming synchronization with Geoscape time.
- Browser Build Health passed `243/243`, including relocation queue, classic paper-doll dance, and terminator-map rows.

Manual validation still required:

- Queue two real aircraft relocation orders in a multi-base campaign and save/reload before the second begins.
- Confirm a queued destination hangar clearly remains reserved and cannot be claimed by another aircraft/order.
- Watch a classic-lineup victory and confirm cards stay fixed while surviving paper dolls dance.
- Compare the Globe and Terminator Map during active UFO/aircraft movement and confirm all operational markers remain readable on both day and night sides.

Next recommended patch: `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1715 - Aircraft Relocation Reservations and Round-Based Mission Time

Build `v0.26.07.12.1715_AIRCRAFT_RELOCATION_RESERVATIONS_AND_ROUND_BASED_MISSION_TIME_INDEX_ONLY_PATCH` preserves save format 4 while hardening aircraft relocation and making incident duration proportional to battle length.

Implemented changes:

- Send Home/Rebase orders reserve their destination hangar as soon as the aircraft launches, preventing another route or purchase from claiming the slot.
- Hangar reservations are stored in existing campaign hangar state and survive save/load when the matching relocation remains active.
- Orphaned or mismatched reservations are cleared conservatively during load normalization instead of permanently blocking a base.
- A craft can recognize and use its own reservation, while other aircraft see the slot as occupied.
- Successful relocation converts the reservation into the aircraft's normal hangar assignment; Rebase still changes permanent home only on arrival.
- Alien incidents no longer advance an automatic full day after resolution.
- Mission results now store combat rounds. Manual tactical play counts completed player/alien rounds, while simulation, AI-led, and classic playback use the resolver's rounds.
- Field time is calculated as 30 deployment/recovery minutes plus 5 minutes per combat round, bounded by the existing 24-round battle limit. Typical incidents consume 35 to 150 Geoscape minutes.
- Mission time advances through the authoritative Geoscape minute system, so UFO movement, repairs, refueling, transfers, aircraft travel, incident timers, and midnight rollover remain synchronized.
- Mission Reports and the general event log show combat rounds and exact elapsed field time.
- The Three.js isometric battlefield now uses viewport-proportional orthographic camera bounds and a 600px minimum tactical height, reducing the vertically squashed appearance on wide screens without distorting hex geometry or units.
- Manual 2D, Three.js isometric, standard simulation-map, and classic-lineup battle views now animate living soldiers on the final victory frame. Defeats, fallen soldiers, and unresolved rounds remain still.

Verification checklist:

- Static app-script parsing passed.
- The dependency-free build seam checker passed.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, squad assignment, mission confirmation, Skyranger outbound travel, simulated combat, return travel, and Reports.
- A practical 9-round `Red River Signal` simulation consumed `1h 15m`, remained on Month 1 Day 1, returned the Skyranger normally, and recorded the duration in the mission report.
- Browser Build Health passed `240/240`.
- New rows pass for destination-hangar save/resume reservations, round-based incident duration, proportional Three.js tactical framing, and victory dances in every tactical presentation.
- Browser console errors were clear.

Manual validation still required:

- Save and reload during a real multi-base Send Home/Rebase flight, then confirm the destination remains reserved and the aircraft resumes its route.
- Confirm the reserved hangar is visibly understandable in the selected Base/Hangar UI.
- Compare the Three.js map height on the player's normal display and confirm the extra vertical space feels better rather than oversized.
- Watch the final success frame in all four battle presentations and confirm the celebration is readable without obscuring controls.

Next recommended patch: `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY`, adding a compact reservation badge/ETA and considering multiple simultaneous relocation flights after the single active-route architecture is safely expanded.

## v0.26.07.12.1630 - Ferry Aircraft Rebase and Homeward Recovery Controls

Build `v0.26.07.12.1630_FERRY_AIRCRAFT_REBASE_AND_HOMEWARD_RECOVERY_CONTROLS_INDEX_ONLY_PATCH` adds explicit player control over Ready aircraft parked away from their permanent home base without changing save format.

Implemented changes:

- The selected Hangar aircraft panel now shows the aircraft's current base and permanent home base.
- Ready aircraft away from home receive a `Send Home` order without requiring an active UFO or alien incident.
- Ready Interceptors and Skyrangers can be ordered to `Rebase` through a destination-base selector when a complete ferry route and open destination hangar exist.
- Send Home preserves permanent home identity. Rebase changes `homeBaseId` and `homeHangarKey` only after clock-tracked arrival.
- Ferry legs reuse complete graph routing, one-way full-tank leg checks, real intermediate hangars, per-stop refueling, and final-base refueling time.
- The route is stored in the existing aircraft travel save state, appears in the Geoscape route timeline, and keeps the aircraft unavailable until arrival.
- Arrival releases the old physical hangar assignment, reserves the destination hangar, and avoids creating duplicate seeded aircraft from stale hangar configuration.
- Repairing, airborne, under-fueled, unreachable, and no-open-hangar aircraft remain blocked with a player-readable reason.

Verification checklist:

- Static app-script parsing passed.
- The dependency-free build seam checker passed.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, Base screen, and selected Interceptor Hangar.
- Browser Build Health passed `236/236`, including `Ready aircraft can ferry home or rebase through clock-tracked routes`.
- Browser console errors were clear.
- Deterministic coverage confirms final-destination refueling time, Send Home preserving home identity, Rebase changing home only on recovery, old-hangar release, destination-hangar reservation, and Ready-only blocking.

Manual validation still required:

- In a multi-base campaign, send a remotely parked craft home and confirm every ferry/refuel phase advances with Geoscape time.
- Save and reload during that flight; confirm the route resumes and the craft remains unavailable.
- Rebase a Ready aircraft to a different open hangar and confirm the old home slot is released only after arrival.
- Confirm a competing aircraft cannot claim the destination hangar during the active route. This patch validates the destination at order time; explicit in-flight hangar reservation hardening remains the next bounded patch.

Completed next in `v0.26.07.12.1715_AIRCRAFT_RELOCATION_RESERVATIONS_AND_ROUND_BASED_MISSION_TIME_INDEX_ONLY_PATCH`: active relocations now reserve destination hangars and restore valid reservations on load.

## v0.26.07.12.1545 - Attached-Save Multi-Hop Interceptor Ferry Fix

Build `v0.26.07.12.1545_ATTACHED_SAVE_MULTI_HOP_INTERCEPTOR_FERRY_FIX_INDEX_ONLY_PATCH` uses the player-provided Month 4 campaign export as the authoritative regression case without changing save format.

Root cause and save findings:

- The save's Fort Aegis hangar configuration still listed two interceptor home slots, but the fleet records placed Saber One at Oceana 1 with stale `Outbound` status and Saber Two at Madagascar 1 with 60 repair minutes remaining. The UI's configured-hangar count made those remote aircraft look local.
- Both records predated permanent `homeBaseId` / `homeHangarKey` fields. Normalization incorrectly treated their current ferry bases as permanent homes, even though their stable aircraft IDs still encoded the original Fort Aegis slots.
- Route planning treated the configured Fort Aegis home slots as occupied. A returning aircraft therefore could not select its own reserved home hangar as the final staging/refuel destination.
- Ferry graph search supported several hops, but intermediate stops used permissive transient placeholders instead of consistently requiring real open hangars.
- The two North America contacts are approximately 1,483 km and 1,486 km from Fort Aegis. Saber Two's valid route is `Madagascar 1 -> N. Africa 1 -> Fort Aegis`; Saber One's later route is `Oceana 1 -> Madagascar 1 -> N. Africa 1 -> Fort Aegis` once Madagascar's only hangar is clear.

Implemented changes:

- Legacy aircraft home identity is inferred from stable aircraft IDs and matching configured hangar slots when explicit home fields are absent.
- Aircraft may use their own reserved home hangar when returning or staging, but another physically present aircraft still blocks that slot.
- Every intermediate ferry/refuel base now requires a real open hangar; full-tank range is evaluated separately for every one-way leg.
- Explicit destination-transient overrides no longer leak through a conflicting `allowTransientStage` option.
- Interceptor preview, button state, formation selection, and launch execution now share `interceptorEligibilityForContact` as the authoritative result.
- UFO Tracking reports radar lock, eligible count, current aircraft status/base/timer, origin, complete ferry route, staging base, and final round-trip distance/fuel.
- Pair launches no longer silently clamp to one aircraft when only one interceptor is ready.
- Added a minimized regression fixture derived from the attached save, including both exact North America UFO coordinates and all five saved base coordinates.

Verification checklist:

- Static app-script parsing passed after the route and diagnostics changes.
- Browser Build Health passed `235/235`, including `Attached save supports reserved-home and multi-hop interceptor ferry routes`.
- The attached-save fixture confirms legacy Fort Aegis home identity for Saber One and Saber Two.
- The fixture confirms Saber Two's two-hop route and Saber One's three-hop route.
- The fixture confirms occupied intermediate hangars block refueling and each craft's own reserved Fort Aegis slot remains usable.
- The fixture confirms both North America contacts are independently launchable when the two aircraft are Ready at Fort Aegis.
- The fixture confirms UFO Tracking, launch-button eligibility, and formation selection agree.
- Chrome file-chooser import was attempted, but local browser policy rejected automated file assignment. The original save file was never modified.

Manual validation:

- Load the attached campaign and advance at least 60 Geoscape minutes. Both saved interceptors initially require recovery because the export contains no active travel record and records Saber Two with 60 repair minutes.
- Confirm UFO Tracking names Saber One at Oceana 1 and Saber Two at Madagascar 1 instead of presenting them as physically at Fort Aegis.
- Launch Saber Two against a North America contact and confirm the route reads `Madagascar 1 -> N. Africa 1 -> Fort Aegis`, refuels at each stop, then flies the Fort Aegis/UFO round trip.
- After Madagascar's hangar clears, confirm Saber One can route `Oceana 1 -> Madagascar 1 -> N. Africa 1 -> Fort Aegis`.
- Confirm both aircraft ultimately return to their original Fort Aegis home hangars.

Completed next in `v0.26.07.12.1630_FERRY_AIRCRAFT_REBASE_AND_HOMEWARD_RECOVERY_CONTROLS_INDEX_ONLY_PATCH`: explicit Send Home/Rebase commands now let Ready aircraft leave remote staging bases without requiring an active UFO.
