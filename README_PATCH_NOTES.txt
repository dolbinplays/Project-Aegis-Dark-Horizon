Alien Response Command / Project Aegis
Patch: v0.26.08.05.1035_TACTICAL_REINFORCEMENT_DIFFICULTY_AND_CASUALTY_PRESSURE_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity pending)
Save format: 4

Purpose:
- Preserve the current alien reinforcement cadence as an Easy setting.
- Add the requested Medium cadence where alien casualties raise call pressure and commander death draws an investigation force exactly five rounds later.
- Keep reinforcement difficulty deterministic across save/load by attaching the selected mode to each mission at launch.
- Retain all existing VIP sequential-wave, landing-safety, population-cap, mission-terminal, tactical-timeline, and Skyranger reliability fixes.

Difficulty settings:

Easy — current 2120 cadence preserved:
- Base commander-call chance remains 4%.
- Continued visual contact adds 7 percentage points per contact round.
- Call chance remains capped at 46%.
- Alien kills are recorded but do not increase the call probability.
- Commander death starts the existing deterministic 5–15-round missed-check-in timer.
- The missed-check-in investigation remains held until the current alien squad is eliminated.
- Successful normal calls retain the existing two-round dropship warning.

Medium — updated cadence:
- Uses the same 4% base chance, +7-point pressure step, 46% cap, and two-round normal-call warning.
- Every alien killed in the current reinforcement cycle adds one additional +7-percentage-point pressure step.
- Casualty pressure stacks with visual-contact pressure.
- Example: contact round 2 is 11% on Easy and 18% on Medium after one alien casualty.
- Killing the active alien commander starts a fixed five-round investigation countdown.
- The investigation force becomes due exactly five rounds after the recorded commander death round.
- Other living aliens do not postpone the Medium missed-check-in response.
- The five-round deadline is the arrival deadline; no additional two-round warning is added after it.

Cycle behavior:
- The original alien group is the first tracked casualty-pressure cycle.
- Each landed VIP reinforcement wave resets casualty pressure and makes its landed force the next tracked cycle.
- The first eligible alien in the landed wave becomes the next commander.
- The existing deterministic 3–6-round cooldown before the next normal VIP call remains intact.
- One pending arrival, the 10-living-reinforcement pressure cap, two-to-four units per craft, 32 landing candidates, safe-placement retries, and non-VIP one-wave behavior remain unchanged.

Campaign/save integration:
- Added campaign field `alienReinforcementDifficulty`.
- New campaigns default to Medium.
- First Base Setup allows Easy or Medium selection before campaign creation.
- Existing and legacy saves without the field migrate to Easy so their behavior does not silently become more aggressive.
- Added the selector to Command Settings and Save / Load.
- Changing the campaign selection affects future launches only.
- Skyranger launch copies the setting into the mission record.
- Reinforcement state records the resolved difficulty, current cycle alien IDs, and accumulated casualties.
- Active missions therefore retain their launch-time cadence after save/reload or later campaign-setting changes.
- Save format remains 4.

Player-facing feedback:
- Commander-call messages show the calculated pressure percentage.
- Medium casualty events report when a kill raises reinforcement call pressure.
- Commander-loss messages distinguish Easy post-wipe behavior from Medium's exact five-round response.
- Existing wave-number and dropship-arrival messages remain intact.

Build Health:
- Renamed the previous missed-check-in row to:
  `Easy reinforcement mode retains the original 5 to 15 round post-wipe missed check-in cadence`
- Added:
  `Medium reinforcement mode adds casualty pressure and launches a fixed five-round commander-loss investigation`

Validation performed:
- Extracted all six non-empty embedded JavaScript blocks and ran `node --check`; all passed.
- Direct reinforcement contract passed:
  - Easy contact round 2 plus one casualty remains 11%.
  - Medium contact round 2 plus one casualty becomes 18%.
  - Medium emits a casualty-pressure event.
  - Easy retains deterministic 5–15-round timing and does not arrive while a squad survivor remains.
  - Medium records exactly five rounds and becomes arrival-ready at the deadline while another alien remains alive.
- Confirmed the campaign field is created, migrated, saved, restored, selectable in three UI locations, and copied into both preliminary and committed mission records.
- Static scan found 328 `*Test` tokens and 327 declarations; only the existing Three.js material property `depthTest` is unmatched.
- Save format remains 4.

Manual validation gate:
1. Launch a mandatory VIP mission on Easy.
2. Kill a non-commander alien and confirm call pressure still follows contact rounds only.
3. Kill the Easy commander and leave another alien alive through the check-in deadline; confirm no investigation arrives until the alien squad is eliminated.
4. Launch an equivalent mission on Medium.
5. Kill one or more non-commander aliens and confirm each casualty adds one +7-point pressure step, capped at 46%.
6. Kill the Medium commander while another alien remains alive and confirm the investigation becomes due exactly five rounds later.
7. Save and reload during the five-round countdown; confirm death round, deadline, casualties, and mode remain unchanged.
8. Change campaign difficulty while a mission is active; confirm the active operation retains its launch-time mode and the next mission uses the new setting.
9. Confirm sequential VIP cooldowns, safe dropship placement, population cap, rescue terminal state, timeline, and victory resolution still behave normally.
10. Run browser Build Health and confirm both Easy and Medium reinforcement rows pass.

Known limitation / follow-up:
- This is a reinforcement-cadence setting, not yet a complete global combat difficulty system.
- No Hard reinforcement profile is included in this patch.
- Native Godot 0026 does not yet contain the 2120 sequential VIP system or the new difficulty modes.

Recommended next patch after hands-on validation:
- `TACTICAL_DAMAGE_STATE_SMOKE_AND_BREACH_FEEDBACK_SEED_INDEX_ONLY`
- Continue the Stage 3 readability roadmap with bounded damaged-wall/window states, smoke/fire seeds, and Mission Timeline integration without adding upper floors yet.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.05.0945_TACTICAL_EVENT_TIMELINE_AND_SHOT_FEEDBACK_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity pending)
Save format: 4

Purpose:
- Complete the next Stage 3 tactical-readability slice without changing combat balance.
- Make manual and AI-controlled battles easier to follow after rapid movement, reaction fire, civilian panic, reinforcement events, and off-camera actions.
- Replace the disposable eight-line side-panel readout with a longer categorized live mission timeline while retaining the legacy short log for mission-result compatibility.
- Make hit, miss, armor-hit, and kill outcomes readable at the moment a projectile resolves.
- Make the selected soldier's facing obvious in both the 2D battlefield and the unit-status panel.

Implemented:
- Added a live Mission Timeline retaining the latest 48 tactical events.
- Events are stamped with tactical round and acting side.
- Events are classified as Combat, Rescue, Movement, or System.
- Added All / Combat / Rescue / Movement / System filters.
- Added a hide/show control so the longer timeline does not permanently crowd the side panel.
- The timeline and selected filter remain intact while the same live tactical mission is cached, including renderer changes and AI-control handoffs.
- Kept the existing eight-line compatibility log used by current mission-resolution/report code.
- Added a centered shot-outcome banner for HIT, MISS, ARMOR HIT, and TARGET DOWN.
- Shot feedback identifies the firing mode, shooter, and target and works during manual play and tactical-map AI playback.
- Added a bright facing-arrow badge to the selected soldier's 2D hex.
- Added a matching facing arrow beside the existing N/NE/SE/S/SW/NW status text.
- Added patch marker `TACTICAL_EVENT_TIMELINE_AND_SHOT_FEEDBACK_PATCH`.
- Added Build Health row: `Tactical event timeline categorizes round-stamped actions and shows shot outcomes`.

Behavior intentionally unchanged:
- Hit chance, damage, ammunition, TU costs, reaction fire, cover, line of sight, civilian/VIP rules, reinforcement waves, AI doctrine, and victory/failure rules.
- Existing Three.js projectile lines, impact effects, dialogue, and camera behavior.
- Existing mission-report compatibility log and save format 4.
- Skyranger atomic launch, staged per-leg fuel, autosave recovery, planning-lock, and multi-transport ownership fixes.

Validation performed:
- Extracted all six non-empty embedded JavaScript blocks and ran `node --check`; all passed.
- Executed the event helper contract directly in Node:
  - new prepended log lines are detected without re-adding retained history;
  - combat, rescue, and movement lines classify correctly;
  - round and acting-side stamps are retained;
  - TARGET DOWN and MISS shot outcomes resolve correctly;
  - facing arrows map correctly, including NE and SW.
- Static test scan found 327 `*Test` references and 326 declarations; the only unmatched token remains Three.js material property `depthTest`, which is not a test.
- Confirmed the new patch flag and Build Health row are present.
- Save format remains 4.

Manual validation gate:
1. Launch a manual tactical mission and fire hit, miss, armored-hit, and killing shots.
2. Confirm the centered banner identifies each result and clears without blocking clicks.
3. Select and rotate a soldier through all six facings; confirm the 2D badge and status readout agree.
4. Move, reload, use a Medkit, escort/panic/extract a civilian, and trigger alien activity.
5. Confirm each action appears with the correct category, round, and AEGIS/ALIEN stamp.
6. Switch among timeline filters and hide/show the panel.
7. Hand control to AI on the tactical map, then take control back; confirm the same timeline remains available and continues growing.
8. Switch between 2D Hex and 3D Iso and confirm battle state and timeline remain intact.
9. Finish the mission and verify the existing mission result/report flow still completes normally.
10. Run browser Build Health and confirm the new tactical timeline row passes.

Known limitation / follow-up:
- The 48-event timeline is part of the live tactical cache. This patch does not expand the serialized campaign save format or export the entire timeline into long-term mission reports.
- Native Godot 0026 does not yet include this timeline, shot banner, or facing badge.

Recommended next patch after hands-on validation:
- `TACTICAL_DAMAGE_STATE_SMOKE_AND_BREACH_FEEDBACK_SEED_INDEX_ONLY`
- Focus on readable damaged-wall/window states, bounded smoke/fire seeds, and event-timeline integration without expanding to upper floors yet.

--- PREVIOUS PATCH NOTES ---
Alien Response Command / Project Aegis
Patch: v0.26.08.04.2345_SKYRANGER_STAGED_PER_LEG_FUEL_COMMIT_FIX_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Fix staged Skyranger launches being rejected by the atomic commit guard even though every individual flight leg was valid.
- Validate and consume fuel for the current leg only, then honor the scheduled staging-base refuel before reserving the incident round-trip fuel.
- Preserve the 0845 atomic multi-transport launch protections and the 1245 planning-lock correction.

Player-reported blocker:
- "Aegis One changed readiness before the launch could commit; no aircraft or fuel were consumed."
- The attached 2120 save showed Aegis One and Night Lifter both Ready at 100/100 fuel, with no active Skyranger travel or relocation.
- The selected Oceania UFO Recon Sweep required staging through E. Asia 1.

Confirmed root cause:
- Fort Aegis -> E. Asia 1 is a 14,161 km one-way ferry leg costing 89 fuel.
- E. Asia 1 -> incident -> E. Asia 1 is an 8,226 km round trip costing 52 fuel.
- The route budget is therefore 141 fuel across a scheduled refuel stop.
- The 2120 final commit guard incorrectly compared all 141 fuel against the aircraft's single 100-fuel tank.
- The route planner itself correctly considered each leg flyable and included a refuel at E. Asia 1; only the final atomic revalidation used the wrong total.

Implemented per-leg fuel transaction:
- Added a staged launch fuel plan with three separate values per aircraft:
  - initial-leg fuel cost;
  - post-stage incident round-trip fuel reservation;
  - full route fuel budget across all refuel stops.
- Atomic commit readiness now checks only the initial flight leg against current fuel.
- Staged launch consumes only the initial ferry-leg fuel when the aircraft leaves its origin base.
- At mission arrival, the scheduled staging refuel is applied and the incident round-trip fuel is reserved from a full tank.
- Direct, non-staged launches retain their existing full round-trip fuel commitment.
- Multi-hop staged routes use the first ferry leg for initial validation; later ferry legs remain covered by their existing refuel phases.
- Campaign travel and mission records now retain `fuelCostById`, `postStageFuelCostById`, and `routeFuelBudgetById` for save continuity and diagnostics.

Improved blocker text:
- A real status change now reports the actual new status.
- Repair blocking reports remaining repair minutes.
- Fuel blocking reports the initial-leg requirement and available fuel.
- The misleading generic readiness-change message is no longer used for valid staged routes.

Attached-save expected behavior:
- The Fort Aegis -> E. Asia 1 -> Oceania route now passes commit validation.
- Each 100-fuel Skyranger commits 89 fuel on departure and retains 11 fuel during the ferry leg.
- After the E. Asia refuel, each aircraft reserves 52 fuel for the incident round trip and reaches tactical deployment with 48 fuel represented.
- Both selected squads may launch together when two compatible Ready Skyrangers are selected.

Build Health row:
- Staged Skyranger launches validate and consume fuel per refueled flight leg.

Validation performed:
- All six non-empty embedded JavaScript blocks passed `node --check`.
- Direct staged-fuel contract passed:
  - 89 initial fuel;
  - 52 post-stage round-trip reservation;
  - 141 full route budget;
  - 100 fuel passes the initial-leg atomic guard despite being below the full route budget;
  - departure fuel becomes 11;
  - staged mission-arrival fuel becomes 48;
  - direct 52-fuel sorties remain unchanged.
- The supplied save was parsed directly and confirmed both Skyrangers are Ready at 100/100 with no active Skyranger travel.
- The supplied route distances and costs reproduced as 14,161 km / 89 fuel and 8,226 km / 52 fuel.
- Static Build Health scan found 326 Test references and 325 declarations; the only excluded unmatched token is the known Three.js `depthTest` material property.
- Save format remains 4.

Manual test gate:
1. Load the supplied 2120 save in build 2345.
2. Select the Oceania UFO Recon Sweep and both squads.
3. Confirm Aegis One and Night Lifter launch from Fort Aegis instead of showing the readiness-change blocker.
4. Confirm the route timeline shows the E. Asia staging/refuel phase.
5. Save and reload during the Fort Aegis -> E. Asia ferry leg.
6. Advance through refueling and tactical arrival; confirm both transports remain owned by the operation.
7. Complete the mission and confirm both transports follow the staged return route and return to Fort Aegis.
8. Launch a nearby direct mission and confirm its original round-trip fuel accounting remains unchanged.
9. Attempt a staged launch with less fuel than the first ferry leg and confirm the blocker names the initial-leg fuel shortfall.

Known validation limit:
- A complete browser asset-backed Geoscape launch was not available in the sandbox. Syntax, route arithmetic, commit helpers, save state, and package structure were validated directly; the hands-on flight remains the final gate.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.2120_TACTICAL_VIP_UNBOUNDED_REINFORCEMENT_WAVES_AND_TERMINAL_RESCUE_STATE_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Implement sequential reinforcement cycles for mandatory VIP/civilian rescue missions instead of permanently stopping after the first purple saucer.
- Keep clear intervals dangerous while living VIPs remain unresolved, without allowing duplicate arrivals or unbounded work in one turn.
- Require terminal VIP resolution before departure: every living VIP must be extracted or every remaining VIP must be confirmed dead.
- Preserve the existing one-wave limit for ordinary non-VIP incidents.

Previous limitation:
- Reinforcement state used mission-wide `called` and `arrived` booleans.
- Once the first saucer landed, `arrived` remained true for the rest of the incident and every later call/check-in path returned early.
- Mandatory rescue could stop being a rescue phase as soon as the numerical quota was met or became impossible, even while living unresolved VIPs remained on the battlefield.
- This contradicted the queued VIP mission contract and could make the battlefield become permanently quiet or resolve before all living VIPs were accounted for.

Implemented reinforcement cycle:
- Added persistent `waveCount`, `callEligibleRound`, `lastArrivalRound`, and `lastArrivalReason` state.
- The original commander may call wave 1 using the existing 4% base chance, +7% per contact round, 46% cap, and two-round arrival warning.
- The first unit in every landed VIP reinforcement wave is a new eligible alien commander/caller.
- After a wave lands, the next call cycle opens after a deterministic three-to-six-round cooldown.
- If the current commander dies before calling, the existing deterministic five-to-fifteen-round missed-check-in investigation cycle can schedule the next wave after the active alien force is cleared.
- VIP missions have no total wave-count cap while living VIPs remain unresolved.
- Non-VIP incidents keep the original mission-wide one-wave guard.

Bounded performance and placement safeguards:
- Only one pending arrival transaction can exist at a time.
- Each landing attempt still checks at most 32 deterministic perimeter candidates.
- Every craft footprint must remain inside the map and clear of buildings, units, and all player Skyrangers.
- A failed landing retries one round later rather than spawning outside the battlefield.
- New calls pause when the projected wave would exceed 10 living reinforcement aliens.
- Older alien saucer cover geometry is retired when a later VIP wave lands; only the latest saucer remains registered for rendering and collision.
- Dead reinforcement units older than the immediately preceding wave are pruned during a later arrival, bounding long-session unit growth while preserving current combat state.

Terminal VIP rescue state:
- Mandatory rescue remains active while any living, unextracted VIP remains, even when the reward quota is already met.
- If the quota becomes impossible, the battle still remains open until every surviving VIP is extracted or confirmed dead.
- Once all VIPs are resolved, the numerical rescue result is evaluated normally for rewards, failure reporting, panic, and campaign consequences.
- A pending VIP reinforcement call is cancelled/ignored when no living unresolved VIP remains.
- Victory then requires a living Aegis force, no valid living aliens, no relevant pending arrival, and no unresolved mandatory VIP.
- Optional civilian rescue remains non-blocking in eliminate-all-aliens missions.

AI and presentation behavior:
- Fresh and inherited AI-control intervals both continue searching and extracting during clear mandatory-rescue turns.
- Existing escorts retain priority; free soldiers continue following tracker pings and bounded search assignments.
- Logs identify reinforcement wave numbers for commander calls, missed check-ins, and landings.
- The tactical objective panel distinguishes quota progress from terminal resolution, including quota-met and quota-failed states with living VIPs still unresolved.
- Legacy one-wave VIP reinforcement state is reopened on continuation after a bounded cooldown instead of remaining permanently sealed.

Build Health row:
- Mandatory VIP missions support sequential bounded reinforcement waves and terminal VIP resolution.

Validation performed:
- All six non-empty embedded JavaScript blocks passed `node --check`.
- Direct executable contracts passed for:
  - two sequential VIP reinforcement calls and landings;
  - a fresh commander assigned to each wave;
  - unique wave IDs and wave-number state;
  - one retained alien saucer after later landings;
  - the 10-unit concurrent reinforcement pressure guard;
  - unresolved living VIPs blocking terminal victory;
  - resolved VIPs cancelling an otherwise pending wave and allowing victory;
  - unchanged one-wave behavior in ordinary incidents;
  - unchanged ordinary missed-check-in behavior.
- Static Build Health reference scan found 324 declared Test symbols; the only unmatched `depthTest` token remains the Three.js material property.
- Save format remains 4.

Manual test gate:
1. Start a mandatory terror or abduction rescue mission with at least three VIPs.
2. Allow the original commander to call and confirm wave 1 arrives after its warning.
3. Keep one or more living VIPs unresolved and continue fighting long enough for a second commander call or missed-check-in investigation.
4. Confirm wave 2 lands safely, uses unique units, and does not leave multiple permanent saucer collision footprints.
5. Meet the rescue reward quota while leaving another VIP alive; confirm the mission remains active and the UI says that VIP is unresolved.
6. Make the quota impossible while one VIP remains alive; confirm the mission still remains active until that VIP is extracted or killed.
7. Resolve every VIP and eliminate all active aliens; confirm any no-longer-relevant inbound VIP wave is cancelled and the battle ends.
8. Run an ordinary crash-site or signal incident and confirm it still receives no more than one reinforcement wave.
9. Repeat under AI control and verify clear rescue turns, wave warnings, fog of war, survivor HP, and terminal resolution remain intact.

Known validation limit:
- A complete asset-backed live WebGL battle was not available in the sandbox. Sequential logic, terminal-state contracts, syntax, and package structure were validated directly; the full visual/playability sequence remains the hands-on gate.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.1655_TACTICAL_AI_FALSE_TOTAL_LOSS_AND_SURVIVOR_PRESERVATION_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged)
Save format: 4

Purpose:
- Prevent the tactical AI from converting an unresolved battlefield into an instantaneous total squad loss.
- Preserve living soldiers, HP, positions, equipment state, civilians, cover damage, and fog when an AI safety interval expires.
- Return tactical control instead of finalizing a still-active battle.

Player-reported symptom:
- Approximately eight or nine soldiers remained alive.
- Only one alien was visibly present.
- The visible alien died during AI control.
- Every remaining soldier then dropped dead simultaneously and the mission reported both squads lost.

Confirmed root cause:
- tacticalAiMissionResolution used squadDefeated: !terminal.primarySecured.
- Any unresolved battle therefore counted as a defeated squad, even when soldiers were alive.
- At the AI round cap, resolveMission forced all human HP to zero and appended a synthetic Squad overrun frame.
- A hidden or distant alien could trigger the failure immediately after the last visible alien died.

Implemented:
- squadDefeated now requires terminal.squadWiped.
- Living soldiers plus living aliens are classified as unresolved, not defeated.
- Tactical AI interval increased from 36 to 72 rounds.
- Fresh strategic AI interval increased from 24 to 48 rounds.
- An unresolved tactical handoff preserves the final live frame and returns command to the player.
- The unresolved handoff does not call mission completion, remove the incident, apply KIA records, or retire squads.
- Strategic safety-limit withdrawal preserves survivors instead of inventing deaths.
- Final-alien victory and genuine total-loss behavior remain unchanged.

Build Health row:
- AI simulation never converts an unresolved battle into a synthetic total squad loss.

Validation performed:
- All six non-empty embedded JavaScript blocks passed node --check.
- Direct terminal-state harness verified:
  - living human + living alien = unresolved, no squad defeat;
  - zero living humans = real squad defeat;
  - living human + zero living aliens = victory.
- Confirmed tactical continuation marker and survivor-preserving playback close are present.
- Save format remains 4.

Manual test gate:
- Hand a large fog-of-war battle to AI with survivors and at least one hidden alien.
- Allow the AI safety interval to end.
- Confirm survivors remain alive and tactical control returns.
- Continue AI or manual play and eliminate the final alien.
- Confirm optional civilian rescue does not block victory.
- Verify a genuine zero-survivor wipe still reports Squad Lost.

Save recovery:
- This patch prevents new false wipes.
- It does not automatically revive soldiers already written as KIA in a post-failure save.
- A pre-failure autosave or the affected save JSON can be used for a targeted repair.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.1245_SKYRANGER_PLANNING_LOCK_REGRESSION_FIX_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity review pending)
Save format: 4

Purpose:
- Fix the 0845 regression where selecting an incident made the first legitimate Skyranger launch block itself.
- Keep planning incidents launchable while preserving duplicate-launch protection for real commits, flights, tactical battles, and simulations.
- Preserve the 0845 atomic multi-transport transaction and autosave rollback behavior.

Player-reported symptom:
- In a new game, selecting two squads and two Skyrangers produced `another Skyranger launch, flight, or tactical operation is already active`.
- No Skyranger flight or tactical operation was actually active.

Root cause:
- Mission planning stores the selected incident in activeMission.
- The 0845 guard blocked on any non-null activeMission.
- The chosen planning incident was therefore mistaken for an already-committed tactical operation.

Implemented:
- Added a committed-operation classifier for activeMission.
- Planning-only incidents are allowed through the launch guard.
- Launch commit, real Skyranger travel, tactical playback, committed transactions, manual tactical battles, and AI simulations remain blocked.
- Updated the commit-ref reset so selecting an incident cannot retain the launch lock.
- Added specific blocker messages for commit, flight, playback, and committed-operation conflicts.
- Preserved distinct-aircraft validation, all-or-nothing fuel/status commit, multi-aircraft ownership, duplicate-click protection, and incomplete-launch rollback from 0845.

Build Health row:
- Selected incidents remain launchable while committed Skyranger operations stay locked.

Validation performed:
- All six non-empty embedded JavaScript blocks passed node --check.
- Direct regression allowed a normal planning incident and a two-squad transportCount 2 planning record.
- Direct regression continued to block commit, flight, playback, committed, manual tactical, and simulation states.
- Static inspection confirmed the old raw activeMission guard is absent.
- The packaged ZIP was extracted and syntax-checked again.

Manual test gate:
- Start a new campaign and open Plan Response for an incident.
- Select both squads and launch with two Ready Skyrangers.
- Confirm the launch proceeds and assigns two named transports.
- Rapidly confirm twice and verify only one transaction is created.
- Verify a second launch is blocked while the first flight or tactical operation is genuinely active.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.0845_SKYRANGER_ATOMIC_MULTI_TRANSPORT_LAUNCH_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Prevent partial or duplicate multi-Skyranger launches from consuming aircraft and fuel without a matching travel record.
- Require one distinct compatible Ready Skyranger for every selected response squad.
- Make outbound, tactical, AI simulation, return, save/load, and hangar recovery share one authoritative aircraft set.
- Automatically roll back the exact half-launch state found in the attached autosave.

Confirmed autosave state:
- Aegis One: Outbound, fuel 7/100, refuel 310m.
- Night Lifter: Outbound, fuel 7/100, refuel 310m.
- skyrangerTravel: null.
- activeMission.transportCount: 2.
- activeMission stored only Night Lifter's aircraftId.
- The Europe crash-site incident remained available in the mission list.
- Reports recorded separate Aegis One and Night Lifter launch attempts.

Implemented prevention:
- Added a launch-commit ref lock so repeated confirmation clicks cannot start a second transaction.
- Validates squads, soldiers, transport count, distinct aircraft, route compatibility, base stationing, fuel, and repair/readiness before commit.
- Requires two transports for two selected squads.
- Builds the complete travel and mission ownership records before applying aircraft state.
- Applies fuel and Outbound status to all selected aircraft in one fleet update.
- Failed validation leaves aircraft, fuel, mission state, and travel state unchanged.
- Maps each response squad deployment to its actual aircraft ID and name.

Implemented ownership and return:
- Stores launchTransactionId, aircraftIds, aircraftNames, fuelCostById, and returnHangarKeyById.
- Keeps all transports owned during outbound travel, tactical combat, and AI simulation.
- Marks every participating aircraft Returning together.
- Restores every aircraft to its proper hangar together after landing.

Implemented load repair:
- Detects an incomplete active mission with no travel record and insufficient aircraft ownership.
- Detects a partial travel record with fewer aircraft than its declared transport count.
- Clears incomplete mission/travel ownership.
- Restores orphaned transports to Ready with committed fuel refunded.
- Preserves or restores the incident for a clean relaunch.
- Adds a strategic report explaining the recovery.
- Preserves coherent modern transactions and legacy manual tactical missions.

Build Health row:
- Skyranger launches commit atomically across every selected squad transport.

Validation performed:
- All non-empty embedded JavaScript blocks passed node --check.
- Direct helper regression passed distinct two-transport selection.
- Exact half-launch and partial-travel rollback regressions passed.
- Coherent two-aircraft transaction preservation passed.
- The uploaded autosave matched the rollback signature exactly.
- Static Build Health scan found 321 test references and 321 declarations with no missing references.
- Extracted package scripts passed syntax validation again.

Manual test gate:
- Load the original autosave in 0845 and confirm both transports recover.
- Launch both squads and confirm two named aircraft are assigned.
- Rapidly press launch confirmation and verify only one operation is created.
- Save/reload during outbound travel and tactical ownership.
- Complete the return and confirm both aircraft restore to their own hangars.
- Try a two-squad launch with only one Ready transport and verify no fuel or status changes occur.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.0745_SKYRANGER_AUTOSAVE_READINESS_RECOVERY_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged)
Save format: 4

Purpose:
- Repair autosaves where Skyrangers remain in stale non-ready states even though no active mission, flight, or relocation owns them.
- Explain the actual saved status of every transport instead of returning only `no ready Skyranger is available`.
- Preserve legitimate active missions, aircraft travel, repair timers, refueling, and relocation reservations.

Source-level finding:
- The exact blocker appears only when the authoritative aircraft fleet contains zero Skyrangers with status Ready and no repair time remaining.
- Hangar visuals can still show a Skyranger assignment while its fleet record is Outbound, Returning, Queued, or Repairing.
- Interceptors had stale-airborne recovery on load; Skyrangers did not.
- The affected autosave was not attached, so the exact two records still require export-based inspection.

Implemented:
- Added active Skyranger ownership detection for `skyrangerTravel` and active tactical missions.
- Added stale Skyranger reconciliation during migration, campaign load, and live state changes.
- Orphaned Outbound/Returning transports recover to Ready.
- Orphaned Queued transports recover to Ready.
- Repairing aircraft with zero minutes remaining normalize to Ready.
- Active flights, missions, relocation orders, and positive repair timers remain authoritative.
- Expanded launch blocker names each Skyranger, base, status, fuel, repair/refuel time, and active/queued ownership.

Build Health row:
- Autosaves recover stale Skyranger readiness and explain transport blockers.

Validation performed:
- All six embedded JavaScript blocks passed node --check.
- Direct stale-Skyranger recovery harness passed.
- Static Build Health test-reference scan passed after excluding Three.js depthTest.
- Active flight and tactical mission states remained preserved in the direct harness.
- Browser localhost navigation was blocked by administrator policy, so full live Build Health remains a manual gate.

Manual test gate:
- Export the affected autosave first.
- Load it in build 0745 and retry the two-squad launch.
- Confirm genuinely orphaned Skyrangers display Ready.
- If blocked, capture the new detailed transport-state message.
- Export the autosave JSON so the original state records can be inspected directly.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.0115_TACTICAL_ISO_DIAGONAL_CORNER_CAMERA_FIX_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Let the Three.js isometric camera follow soldiers into the northwest and southeast battlefield corners.
- Keep complete AI movement paths and shooter-target exchanges visible near diagonal map edges.
- Make Fit Map account for the true projected battlefield diagonal rather than only unrotated rows and columns.
- Preserve rectangular viewport fill, fog of war, action-camera behavior, pathing hardening, and mission-resolution fixes.

Root cause:
- The renderer used the real tilted camera footprint to decide how many hexes to create, but camera-center clamping still used independent map X/Y minimum and maximum offsets.
- Isometric screen position couples tactical X and Y. Northwest and southeast cells could therefore lie beyond a diagonal camera edge despite passing the axis-aligned clamp.
- Fit Map used unrotated grid spans and could under-fit the longest projected diagonal.

Implemented:
- Added an orthographic camera-plane projection basis from the current isometric camera orientation.
- Added tactical-cell to camera-plane and camera-plane to tactical-cell transforms.
- Fitted actors, full movement routes, and shooter-target pairs in projected screen axes.
- Preserved the acting unit as the preferred focus while shifting enough to retain the complete action.
- Constrained projected centers against projected map bounds before converting back to hex coordinates.
- Prevented viewport coverage from reapplying the old axis-aligned center clamp.
- Recalculated Fit Map zoom from projected battlefield width and height, including diagonal extent and odd-row offsets.
- Added Build Health coverage for northwest and southeast camera tracking.

Build Health row:
- Three.js isometric camera follows soldiers into northwest and southeast map corners.

Validation performed:
- All six embedded JavaScript blocks passed node --check.
- Static test-reference scan found no undefined test declarations after excluding Three.js depthTest.
- Direct Node regression checked northwest, southeast, southwest, and northeast corners.
- Close, Near, Wide, Full, Map, and Fit Map all kept every tested corner visible.
- Fit Map retained complete 80x80 coverage from 0 through 79 on both axes.
- The packaged ZIP was extracted and syntax-checked again.

Manual test gate:
- Follow selected soldiers into northwest and southeast corners in Three.js Iso.
- Cycle Close, Near, Wide, Full, Map, and Fit Map and confirm tracking continues at each level.
- Use AI Command and confirm full routes remain visible near the diagonal corners.
- Confirm firefights near the corners frame both shooter and target whenever possible.
- Confirm Fit Map displays all four corners and 2D Hex remains unchanged.

Native parity:
- Godot remains at GODOT.0026.
- Codex must port the projected diagonal camera-fit contract if the native tactical camera exhibits the same edge limitation.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.04.0045_TACTICAL_AI_ACTION_CAMERA_OFFMAP_AND_VICTORY_HARDENING_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; parity port pending)
Save format: 4

Purpose:
- Keep AI-controlled movement fully visible at Full and Fit Map by framing the actor plus the complete movement path.
- Frame both shooter and target during visible combat whenever the selected zoom and map bounds allow it.
- Stop coordinated AI squads from huddling in the northwest corner after a blocked or reached contact report.
- End eliminate-all-alien missions immediately when civilian rescue is optional.
- Repair or reject off-map living units and stale tactical objective coordinates so ghost targets cannot attract pathing or soft-lock victory.

Implemented:
- Added action focus regions for movement paths and shooter-target pairs.
- Kept the acting unit as the preferred camera anchor while shifting enough to retain the complete action.
- Preserved the 2312 rectangular Three.js viewport coverage at every zoom.
- Replaced coordinate-biased AI tie resolution with unit-specific deterministic hashes.
- Added crowding, repeated-cell, and edge penalties plus interior/separation rewards.
- Added bounded local-search rings after a soldier reaches a report or last-known alien location.
- Added distinct deterministic patrol waypoints when local search cannot advance.
- Added shared mission terminal state for manual and AI resolution.
- Optional civilian rescue no longer blocks victory after all valid aliens are dead.
- Mandatory rescue and real inbound reinforcement gates remain unchanged.
- Added tactical playable-cell validation for Small, Medium, and Large maps.
- Added deterministic relocation of living off-map units to valid unoccupied interior cells.
- Cleared invalid last-known, distress, reinforcement-rally, alien-search, and patrol coordinate pairs.
- Rejected invalid alien/player objectives before pathfinding.
- Applied integrity repair to cached battles, live unit updates, AI playback frames, and AI continuation state.
- Added tactical event-log messages for integrity repairs.
- Prevented invalid off-map alien records from blocking terminal victory if they reach the terminal helper before relocation.

Build Health rows:
- AI tactical camera frames the acting soldier movement path and shooter target pair.
- AI tactical movement avoids northwest corner pile-ups and searches around reached contact reports.
- Eliminate-all-alien missions end in victory when civilian rescue is optional.
- Tactical battlefield integrity repairs off-map aliens and rejects ghost objectives.

Validation performed:
- All six embedded JavaScript blocks passed node --check.
- All 311 referenced Build Health test declarations were present.
- Exact Node regression used a living revealed alien at -99,-99 with stale last-known/rally/search coordinates.
- The guard relocated that alien to a deterministic interior cell and cleared every invalid coordinate pair.
- Human search chose an interior patrol objective instead of following the negative northwest target.
- The terminal helper reported one invalid record, zero valid living aliens, and correct victory for optional rescue.
- The packaged ZIP is extracted and syntax-checked again.
- Full asset-backed browser/WebGL Build Health remains a manual gate because sandbox navigation was blocked.

Manual test gate:
- Use AI Command at Full and Fit Map and confirm the complete acting-soldier route stays visible.
- Confirm visible firefights show shooter and target whenever possible.
- Reproduce the northwest pile-up and confirm soldiers spread through the report area and continue searching.
- Kill all aliens in an optional-rescue mission and confirm immediate victory.
- Confirm mandatory rescue still remains active after the area is secure.
- Load the suspected off-map battle and confirm a recovery message appears and no unreachable ghost target remains.
- Run browser Build Health and confirm all four rows above pass.

Native parity:
- Godot remains at GODOT.0026.
- Codex must port action-region camera framing, corner-stall recovery, terminal-state rules, and off-map integrity repair before parity is restored.

--- PREVIOUS PATCH NOTES ---

Alien Response Command / Project Aegis
Patch: v0.26.08.03.2312_TACTICAL_3D_RECTANGULAR_VIEWPORT_FILL_INDEX_ONLY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE (unchanged; browser renderer patch)
Save format: 4

Purpose:
- Fill the complete central Three.js tactical rectangle with real battlefield hexes at every normal zoom level.
- Keep Close, Near, Wide, Full, Map, and Fit Map meaningfully different without clipping rendering to a small square cell window.
- Preserve fog of war, targeting, cover, units, civilian/VIP state, landing craft visibility, quality modes, tactical state continuity, and the 2032 alien VIP-hunt behavior.

Root cause:
- The orthographic camera viewed a wide rectangular ground footprint, but the scene created only a square `viewSize x viewSize` patch such as 18x18 or 26x26.
- Camera zoom and rendered-cell count were coupled, leaving empty background around a centered diamond of terrain.

Implemented:
- Added a deterministic isometric ground-footprint calculation for the current canvas size and camera angle.
- Added a viewport plan that converts the projected footprint into hex-coordinate bounds.
- Added edge-safe camera-center clamping so finite maps cover the viewport whenever their dimensions allow it.
- Replaced Three.js use of the parent square `visibleRows` with aspect-aware `renderRows` generated from the real viewport footprint.
- Added a four-cell off-screen buffer to prevent seams during animation, picking, and small layout shifts.
- Zoom buttons now control camera scale; rendered coverage follows the rectangle naturally.
- Fit Map still contains the complete battlefield instead of cropping it to fill the panel.
- Resize handling updates camera bounds immediately and triggers one debounced coverage rebuild.
- Bottom-right status reports actual hex coverage plus the selected zoom label.
- Added static marker `TACTICAL_3D_RECTANGULAR_VIEWPORT_FILL_PATCH`.
- Added Build Health row: `Three.js tactical zoom fills the rectangular viewport without square hex clipping`.

Representative 1260x620 / Medium 80x80 coverage:
- Close: about 23x27 buffered cells.
- Near: about 31x35.
- Wide: about 41x49.
- Map: about 59x73.
- Fit Map: complete 80x80 battlefield.

Validation performed:
- All six embedded JavaScript blocks passed `node --check`.
- The viewport helper contract passed direct Node execution.
- Close > Near > Wide > Fit Map zoom ordering passed.
- Coverage bounds remained inside the 80x80 test battlefield and included the complete projected Near footprint.
- Static test-reference scan found no missing test declarations; `depthTest` is the existing Three.js material property.
- Full WebGL visual smoke remains a manual gate because the supplied index-only handoff did not contain the external Three.js/asset tree.

Manual test gate:
- Open a Medium or Large incident in 3D Iso.
- Cycle Close, Near, Wide, Full, and Map. Confirm terrain reaches all sides of the center rectangle and each level still changes apparent scale.
- Confirm Fit Map shows the complete battlefield, with only deliberate aspect-ratio margin.
- Focus units near each map edge and confirm the camera stays over real terrain.
- Repeat in Auto, Performance, and Quality.
- Resize the browser and confirm coverage rebuilds after resizing settles.
- Switch 2D/3D and verify selection, movement, fog, VIP pings, reinforcements, saucer visibility, and battle state are unchanged.
- Run Build Health and confirm the new rectangular-viewport row passes.

--- PREVIOUS PATCH NOTES ---

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

