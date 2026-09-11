# CODEX HANDOFF — v0.26.09.10.1735_CLASSIC_LINEUP_PATCH_HISTORY_INITIALIZATION_HOTFIX

Browser 1223 is the gameplay baseline. This is a startup-only release-history scope hotfix. `PATCH_NOTES_HISTORY` is local to `AlienResponseCommand()`, so every mutation of that array must remain inside that controller after its declaration and before the history sort. Browser 1223 accidentally added its current history entry after the controller closed, producing `ReferenceError: PATCH_NOTES_HISTORY is not defined` at startup.

The Browser 1223 entry is now frozen as a literal build ID inside the established initialization sequence and Browser 1735 inserts its current entry there. Do not move patch-history mutations to module scope unless PATCH_NOTES_HISTORY itself is first deliberately refactored to module scope.

No tactical/gameplay behavior is intentionally changed. Preserve Browser 1223 visible-target rendering and outcome-preserving fast pacing, Browser 0810 rolling Classic planning/UFO beam, shared resolver/terminal authority, and save format 4.

---

# CODEX HANDOFF — v0.26.09.10.1223_CLASSIC_LINEUP_VISIBLE_TARGET_AND_OUTCOME_PRESERVING_FAST_PACING_HOTFIX

Browser 0810 is the baseline. This hotfix addresses Classic Lineup invisible shot targets and long presentation duration without changing the tactical resolver.

## Visible target authority
- `tacticalAiSequentialPlaybackFrames(...)` still derives sequential presentation from authoritative resolver frames.
- Its working roster now **upserts** actors that are absent from the prior frame but are required by the current action.
- Before an observable AEGIS shot frame is emitted, the authoritative target is inserted into `working.aliens` and marked visible/revealed for shot presentation. This cannot invent a target because it only operates on a target already present in the authoritative target frame/shot record.
- Newly appearing shooters and `contactInterrupt.alienIds` are inserted by the same mechanism.
- Preserve the lethal staging rule: a target killed in the current action remains alive/present for the shot and commits death at the impact stage.

## Outcome-preserving fast pacing
- `classicLineupAutoAdvanceTargetIndex(...)` is presentation-only. Timer-driven Classic playback may skip quiet sequential movement frames until the next consequential frame or phase-complete frame.
- The manual **Next** action must remain one generated frame at a time.
- `classicLineupAdaptivePlaybackDelayMs(...)` shortens quiet/impact/end-of-round dwell times but does not alter resolver calls or frame content.
- Retain every shot, impact, contact/replan, reinforcement, rescue/death transition, alien appearance/death, Beacon/UFO-bay event, and terminal result.
- The original full frame array remains intact for the Classic archived timeline and manual inspection.

## Outcome parity invariant
The Browser 1223 `resolveMission(...)` block is byte-for-byte identical to Browser 0810 and hashes to `03d42521a34234aeaa36fdf965efa36c696ed90b5fe0c9cbd40e08effbc97964`. Do not move the acceleration into tactical AI, combat odds, pathing, RNG, rescue logic, reinforcement timing, or terminal resolution. Presentation-only acceleration is what guarantees exact outcome parity.

## Preserve
Browser 0810 streamed rolling planning and reinforcement UFO/beam; Browser 2154 rescue priority/support standoff; Browser 2054 alien fade/reflow; Browser 1712 stale-contact sanitation; Browser 1242 survivor/KIA authority; one `finishAiPlayback()`; save format 4.

## Field gate
Test newly discovered aliens being fired upon, first-action reinforcement shooters, long hidden-contact search, mandatory VIP rescue, manual Next, automatic playback, and final Mission Report parity.

---

# CODEX HANDOFF — v0.26.09.10.0810_CLASSIC_LINEUP_STREAMED_ROLLING_BATTLE_PLANNING_AND_REINFORCEMENT_UFO_BEAM_PATCH

Browser 2154 is the field-tested baseline for this release. This patch changes Classic Lineup from whole-operation pre-resolution to a resumable rolling stream while preserving the shared Tactical resolver and all 2018/2054/2154 presentation/rescue behavior. Save format remains 4.

## Architecture / authority
- Classic streaming must continue to call `resolveMission(..., mode:"classic")`; do not introduce a second resolver. The opening call is bounded by `CLASSIC_LINEUP_STREAM_INITIAL_ROUNDS`, and subsequent calls resume through `initialBattleState` with `simulationChunkOnly:true`.
- `classicLineupStreamAppendFrames(...)` drops the inherited continuation seam frame. Do not append the seam or rerun earlier rounds.
- `classicLineupStreamShouldPrefetch(...)` keeps a small round lead (`CLASSIC_LINEUP_STREAM_TARGET_ROUND_BUFFER`) instead of resolving to terminal before playback. Planning yields through `tacticalStartupYield()`.
- Preserve the exact continuation snapshot as tactical authority for stable IDs/state. Never reconstruct soldiers, aliens, VIPs/civilians, escorts, Beacons, Last Known Contacts, reinforcement state, Skyranger state, explored cells, or fire-team state from presentation frames.
- `finishSimPlayback()` must refuse campaign handoff for streamed Classic until `tacticalMissionResultHasTerminalOutcome(playback.result)` is true, the stream is complete, and no continuation/planner work remains. Rewards/casualties/permanent soldier state therefore remain deferred to authoritative completion.
- Shared `tacticalMissionTerminalState(...)` / `tacticalAiMissionResolution(...)` remain the only success/failure authority. Preserve mandatory rescue, optional civilians, living alien, Last Known Contact, Field Beacon/reinforcement source, pending reinforcement, UFO-bay, playback-pending, and Squad Lost gates.

## Reinforcement presentation
- `classicLineupStreamReinforcementPresentationState(...)` reacts only to already-authoritative reinforcement arrival frames.
- The Classic SVG draws a small UFO and conical pulsing beam above the alien lane. This is presentation-only and must never spawn/modify tactical actors.
- `classicLineupStreamCommitQueuedReinforcement(...)` only retires the existing `arrivalCommitPending` presentation gate after the authoritative arrival actors are present in a queued presentation frame. It preserves the continuation unit array/actor state.
- Browser 2054 canonical first-appearance ordering remains authoritative for the lineup: new aliens enter from the bottom and later reflow normally.

## Preserve
- Browser 2154 nearest-suitable mandatory-VIP rescuer, building/ramp access, and support standoff doctrine.
- Browser 2054 alien casualty fade/reflow and reinforcement bottom insertion.
- Browser 2018 civilian/VIP paper dolls, extraction/death presentation, victory dance, and lightweight Classic timeline.
- Browser 1945 Mobile Tactical Status HUD.
- Browser 1712 stale dead-alien Last Known Contact cleanup.
- Browser 1242 final survivor/KIA authority and exactly one active `finishAiPlayback()` declaration.
- Save format 4 and Standard/manual Tactical behavior.

## Regression gate
Confirm early playback before full mission resolution; exact continuation snapshot reuse; seam de-duplication; no campaign commit before shared terminal authority; mandatory/optional rescue parity; alien/LKC/Beacon/reinforcement/UFO-bay/Squad Lost blockers; presentation-only reinforcement UFO state; bottom-entry reinforcement actors; Browser 1712 and 1242 authority; exactly one `finishAiPlayback()`; build/cache/manifest/hash identity; and ZIP integrity.

---

# CODEX HANDOFF — v0.26.09.09.2154_CLASSIC_LINEUP_VIP_RESCUE_PRIORITY_AND_SUPPORT_STANDOFF_PATCH

Browser 2054 Classic Lineup Attrition/Reflow is the baseline. Browser 1712 crash-site terminal victory and Browser 1945 Mobile Tactical Status HUD are field-accepted. This patch implements the approved Classic Lineup VIP Rescue Priority & Support Standoff roadmap item.

## Behavioral authority
- New helpers `classicLineupUnresolvedRescueTargets`, `classicLineupRescuePriorityPlan`, `classicLineupSupportStandoffPlan`, and `classicLineupVipRescuePriorityTurn` operate only inside Classic one-shot behavior.
- Mandatory VIP targets are assigned to the nearest available living AEGIS soldier using tactical route distance. Do not revert this to leader-only selection.
- The direct responder may enter buildings and Skyranger ramp/extraction space because those spaces may be required to contact/escort the VIP.
- Up to two nearby soldiers support each responder. Their preferred destination is outside buildings, outside the Skyranger footprint, 3–8 hexes from the responder, and at least 5 hexes from structures/Skyranger.
- A closer support cell is allowed only as a threat-cover exception when observed alien fire exists and the exterior cell supplies positive tactical cover.
- Support movement is committed independently so formation logic does not drag the whole fire team into the VIP building or extraction lane.
- Mandatory VIP rescue can outrank observed combat for the assigned responder. Optional civilian rescue priority only activates when no alien is currently observed.

## Presentation
- Classic soldier cards expose `VIP RESCUE`, `SUPPORT`, and `SUPPORT/COVER` from the same one-shot unit state. These labels are diagnostic/presentation only.

## Preserve
Do not add a Classic-specific mission resolver. `resolveMission(...)`, `tacticalAiMissionResolution(...)`, and `tacticalMissionTerminalState(...)` remain authoritative. Preserve Browser 2054 alien attrition/reflow, Browser 2018 civilian/VIP playback and victory dance, Browser 1712 dead-contact sanitation, Browser 1628 reinforcement liveness, Browser 1517 arrival commit, Browser 1242 casualty authority, Standard/manual Tactical behavior, and save format 4.

## Field acceptance
Test a mandatory VIP inside a building, a multi-VIP mission, visible alien fire requiring support-cover exceptions, optional civilians during combat, Skyranger ramp clearance, and final Report parity.

---

# CODEX HANDOFF — v0.26.09.09.2054_CLASSIC_LINEUP_ATTRITION_REFLOW_AND_VICTORY_PARITY_PATCH

Browser 2018 is the baseline. Browser 1945 Mobile Tactical Status HUD and Browser 1712 Classic crash-site terminal repair are field-accepted. This patch implements the approved Classic Lineup attrition/reflow + tactical-victory-parity roadmap item.

## Alien lineup presentation
- `classicLineupAlienCanonicalOrder(frames)` establishes stable identity order by first appearance. Initial aliens remain in first-frame order; later actors append and are treated as reinforcements for presentation.
- `classicLineupAlienDeathFrameIndex(...)` finds the authoritative lethal transition. The death frame remains visible; the next frame retains a short low-opacity fade ghost; later frames remove the dead actor from the lineup.
- `classicLineupAlienDisplayModels(playback)` computes active/fading models, evenly spaced y slots, prior slots, reinforcement/new-arrival state, and visibility without changing any tactical actor coordinates or result data.
- Living survivors reflow over the alien-side presentation lane. SVG `animateTransform` interpolates the difference between prior and current slots. Reinforcement actors enter from below into the bottom active slot and carry a small REINFORCEMENT/REINF tag.

## Rescue / victory authority
- Do not create a Classic-specific win-condition function. Classic UI wording uses `tacticalCivilianObjectiveForMission(...)`; mission success/failure remains the one-shot `resolveMission(...)` result using Tactical terminal rules.
- `finishSimPlayback()` must continue passing `playback.result` unchanged into `beginSkyrangerReturn(...)`.
- Preserve living alien, Last Known Contact, Field Beacon/reinforcement-source, arrival-commit, UFO-bay, mandatory rescue, and Squad Lost gates. Optional civilian assistance must stay optional wherever Tactical marks it optional.

## Timeline
- `classicLineupTimelineFromFrames(...)` now notices alien IDs that first appear after frame zero and records an explicit reinforcement-arrival event even if the frame label is generic.
- Keep the timeline lightweight; do not fabricate hidden TacticalMission events.

## Build Health / preserve
- `classicLineupAttritionReflowAndVictoryParityContractChecks()` covers lethal→fade lifecycle, survivor upward reflow, bottom reinforcement ordering, optional-vs-mandatory rescue terminal behavior, shared result authority, timeline reinforcement recording, and save format 4.
- Preserve Browser 2018 civilian/VIP playback + victory celebration, Browser 1945 Mobile Tactical Status HUD, Browser 1712 Last Known Contact terminal repair, Browser 1628/1517 reinforcement safeguards, Browser 1242 survivor/KIA authority, and exactly one `finishAiPlayback()` implementation.

## Field acceptance
Kill top/middle aliens and watch fade/reflow; trigger reinforcements and verify bottom insertion; exercise both mandatory-rescue and optional-civilian missions; confirm victory dance remains success-only; then verify Mission Report outcome/reward/casualties and reinforcement timeline entries.

---

# CODEX HANDOFF — v0.26.09.09.2018_CLASSIC_LINEUP_VIP_CIVILIAN_AND_VICTORY_PLAYBACK_PATCH

Browser 1945 Mobile Tactical Status HUD is field-accepted. Browser 1712 Classic crash-site false-failure is also field-accepted. This patch implements the approved Classic Lineup civilian/VIP + victory playback roadmap item.

## Authority changes
- Fresh one-shot `resolveMission(...)` previously created `civilians=[]` even though `tacticalDeployment(...)` had already produced `civilianPositions`. Browser 2018 seeds those positions as ordinary tactical civilian actors and runs them through `tacticalAssignVipTrackers(...)`. This is shared by one-shot modes so Classic does not invent a second result authority.
- Existing tactical escort, rescue, alien targeting, casualty, reinforcement, and terminal rules remain authoritative.

## Classic presentation
- `ClassicCivilianDollFigure` is presentation-only. VIP is gold; civilian is cyan.
- `classicLineupCivilianDisplayModel(...)` uses actual frame coordinates and nearest living units. Unescorted actors interpolate between sides by tactical proximity.
- Escort ownership puts the actor left of the escorting soldier; distance to actual `skyranger-ramp` cover drives left-edge extraction progress.
- `rescued/extracted` removes the actor only after commit; `rampBoardingPresentation` keeps it visible until then.
- Lethal civilian shots use `toId` endpoint resolution against the civilian display model. `fellThisFrame`/lethal-shot presence keeps the target visible on impact before removal.
- Surviving AEGIS paper dolls use the existing success-only victory bounce plus a nested sway/rotation.

## Reports
- `classicLineupTimelineFromFrames(...)` creates a bounded structured archive only from actions visible/derivable from Classic frames: hits/kills, rescue contact, extraction, civilian death, reinforcement labels, terminal result.
- It does not claim full TacticalMission event parity.

## Preserve
Do not regress Browser 1945 Mobile HUD, Browser 1712 dead-contact terminal sanitation, Browser 1628 reinforcement liveness, Browser 1517 arrival commit, Browser 1242 final-VIP casualty authority, Standard/Desktop tactical layouts, or save format 4.

---

# CODEX HANDOFF — v0.26.09.09.1945_MOBILE_TACTICAL_STATUS_HUD_PATCH

Browser 1712 is field-accepted for the Classic crash-site false-failure regression. This patch returns to the queued Mobile tactical presentation work.

## Change
- The Standard tactical `TacticalUnifiedThreeStatusPanel` was already the authoritative shared 3D Iso / FPV / TPV status box, but the original Mobile decluttering CSS explicitly hid `[data-aegis-unified-three-status-panel]`.
- Browser 1945 overrides that hide only in Mobile · Adaptive and keeps the panel upper-right inside `data-aegis-battle-viewport`.
- Required Mobile core: soldier **name**, **Fire Team Assignment**, **Current Objective / Order**.
- Objective text remains `tacticalFirstPersonCurrentObjectiveOrder(...)`; do not create a second Mobile objective resolver.
- Manual selection and AI observer/acting actor continue to use TacticalMission's existing `tacticalStatusHudUnit` / `fireTeamHudOrder` / `aiTurnHudDecision` flow.
- Portrait/short-height CSS hides or compacts secondary detail first: rank/weapon, vitals, status chips, role detail, formal-leader notes, duplicate player-order coordinate line, and larger AI-plan diagnostics.
- The overlay remains pointer-transparent; it must never own tactical selection or consume a command rail.

## Preserve
Do not regress Browser 1712 Last Known Contact terminal victory, Browser 1628 reinforcement liveness, Browser 1517 offline arrival commit, Browser 1242 final-VIP casualty authority, Mobile Missions/Reports/Memorial, or save format 4. The Classic Lineup victory-dance + civilian/VIP playback roadmap item remains queued.

## Field acceptance
Test portrait phone, short landscape phone, and tablet. In one mission switch manual selected soldiers, player orders, Simulation acting soldiers, FPV, TPV, and Mobile↔Standard. Name/team/order must stay synchronized and Standard styling must not change.

---

# CODEX HANDOFF — v0.26.09.09.1712_CLASSIC_CRASH_SITE_LAST_KNOWN_CONTACT_TERMINAL_HOTFIX

Browser 1628 passed a limited resolver fixture but the user's real Classic field replay still failed. Do not treat the 1628 fixture as full reproduction: the exported pre-mission save does not by itself prove the same transient response-force selection/random combat path used during the field run. The field report and `0 events retained` clue exposed the remaining terminal branch.

## Remaining defect
A dead alien could retain `aegisLastSeenMarkerActive:true`. `tacticalLastKnownAlienContactMarkers(...)` did not check alien liveness, and `tacticalUpdateAlienContactMemory(...)` could promote an observed contact to a marker after death if no current AEGIS observer saw the corpse. In Classic's zero-alien branch this made terminal authority return `unresolvedLastKnownContact:true`; with no rescue phase left, the one-shot resolver could break and finalize success=false.

## Repair
- `tacticalAlienCanOwnUnresolvedLastKnownContact(...)`: requires alien + HP > 0 + `alive !== false`.
- Marker enumeration, purge, and contact-memory update use that rule.
- Same-round zero-alien terminal evaluation purges dead/invalid contacts before checking mission completion.
- Final one-shot resolution purges once more as a terminal guard.
- Critical Classic resolve loops use `tacticalPlaybackFrameUnitAuthoritativeAlive(...)`.
- `simulateMission(...)` now passes campaign `alienFieldBeaconKnowledge` into `resolveMission(...)`.
- Failure diagnostics identify exact terminal blockers.
- `buildMissionReportEntries(...)` no longer masks `Mission incomplete.` with the generic scattered-alien failure line.
- New Classic reports with no structured timeline state that one-shot simulation did not emit one, instead of claiming they are legacy/pre-archive reports.

## Release-quality correction
The Browser 1517 and 1628 regression test blocks had been appended after the closing `</script>` tag and therefore were inert document text. Browser 1712 moves them inside the executable runtime and chains the new Last Known Contact contract after them.

## Preserve
Do not regress Browser 1242 final-VIP casualty authority, Browser 1517 arrival commit, Browser 1628 reinforcement actor liveness, Mobile Missions/Reports/Memorial, or the queued Mobile upper-right tactical HUD and Classic civilian/VIP/victory-dance roadmap items. Save format stays 4.

---

# CODEX HANDOFF — v0.26.09.09.1628_REINFORCEMENT_LIVENESS_AUTHORITY_HOTFIX

This is a follow-up to Browser 1517 using the user's exact failing campaign save as an executable regression fixture.

## Confirmed defect
Fresh aliens created by `tacticalAlienReinforcementArrival(...)` had positive HP but omitted `alive:true`. Terminal authority uses `alive !== false && hp > 0`, while Classic/Simulation paths still contain truthy `unit.alive` filters. The exact save therefore ended with two 34-HP ghost reinforcements (Pale Commander + Needle Drone), displayed Alien survivors 0, and `Mission unresolved`.

## Repair
- Both reinforcement constructors now set `alive:true`.
- Post-reveal reinforcement records normalize liveness while preserving explicit false as death authority.
- Classic Lineup and resolver terminal summaries use `tacticalPlaybackFrameUnitAuthoritativeAlive(...)` for parity with terminal/result authority.
- Keep Browser 1517's incorporated-arrival commit helper. Do not revert Browser 1242 casualty reconciliation.

## Executable regression
The exact uploaded East Asia/Threat 2/Tide Horror/$360k save fixture was run through the actual resolver. 1517: `success:false`, two 34-HP omitted-alive reinforcements. 1628: `success:true`, reinforcement actors participate and both are dead at terminal success.

Save format remains 4. Preserve the queued Mobile upper-right tactical HUD and Classic Lineup civilian/VIP/victory roadmap items.

---

# CODEX HANDOFF — v0.26.09.09.1517_CLASSIC_CRASH_SITE_TERMINAL_REINFORCEMENT_COMMIT_HOTFIX

Field report: a UFO crash-site mission watched through **Classic Lineup View** showed all aliens killed, but campaign aftermath recorded failure.

## Root cause
`arrivalCommitPending` is a presentation gate created when alien reinforcements land. Streamed tactical play needs that gate so victory cannot occur before the arrival presentation is committed. Classic/instant simulations are precomputed in one `resolveMission` call. If AEGIS kills the complete newly arrived wave during the same simulated round, the zero-alien branch can end the loop while that presentation-only flag is still true. Final `tacticalMissionTerminalState` then rejects victory despite `livingAlienCount===0`.

## Fix
- Added `tacticalOfflineSimulationCommitReinforcementArrival(state, units)`.
- Immediately before final one-shot mission resolution, and only when `simulationChunkOnly` is false, it clears `arrivalCommitPending` if every recorded `arrivalUnitId` is present in the authoritative simulation roster.
- Missing arrival identities remain pending/fail-closed. Truly inbound (`called && !arrived`) reinforcement state remains unchanged.
- Streamed Simulation AI keeps its existing presentation-commit semantics.

## Preserve
Browser 1242 survivor/KIA terminal authority; Browsers 1244/1324/1453 mobile work; empty crashed-UFO-bay victory; reinforcement arrival/call cadence; VIP quotas; Beacon/Last Known Contact gates; save format 4. Carry forward both approved roadmap items: Mobile upper-right unit/fire-team/objective HUD and Classic Lineup victory/civilian-VIP presentation.

## Regression target
A crash site with a just-arrived reinforcement unit marked dead and still carrying `arrivalCommitPending:true` must be non-victory before offline commit repair and victory afterward. If the arrival unit ID is absent, the pending flag must remain true.

# CODEX HANDOFF — v0.26.09.09.1453_MOBILE_MEMORIAL_ADAPTIVE_LAYOUT_PATCH

Systematic Mobile · Adaptive pass continued from Browser 1324 and completed the current command-screen sequence with **Memorial / Hall of the Fallen**. This is presentation-only and deliberately preserves Browser 1242 casualty/result authority.

## Implemented
- Added `MOBILE_MEMORIAL_ADAPTIVE_LAYOUT_PATCH` and a dedicated `MobileMemorialScreen`.
- Mobile Memorial owns the fixed phone/tablet command viewport between the existing rails.
- Portrait uses Remembrance Wall index or one selected service record with **Back to wall**; landscape/tablet shows both panes together.
- The Mobile roster consumes `sortedMemorialSoldiers`, `memorialSortKey`, and `setSelectedMemorialSoldierId` rather than creating a second KIA store.
- Compact rows show grayscale portrait, name, missions, kills, and final squad.
- Retired Squad Names remain available with retirement month, total-loss mission, and region.
- Selected detail reuses `SoldierCard`, `memorialServiceSummary`, `MemorialTributeList`, mission/kills/XP counts, squad history, final squad, and recovered-equipment state.
- Standard Memorial is explicitly rendered only outside Mobile and remains unchanged.

## Authority preserved
- Browser 1242: single active `finishAiPlayback`, final buffered battlefield casualty authority, explicit death flags, survivor/KIA reconciliation, committed Tactical Victory precedence.
- Browser 1244 Mobile Missions and Browser 1324 Mobile Reports.
- KIA creation/removal, retired-squad history, tribute data, report data, campaign state, and save format 4.
- The approved Mobile tactical upper-right soldier/fire-team/objective HUD roadmap item is retained and remains the next focused tactical-mobile presentation target.

## Release
Synchronize the repository's existing full `src/manifest.json` with `tools/apply-1453-source-manifest.cjs` after overlaying the package. Do not replace the full manifest with the merge fragment.

## Field gate
Test no-KIA, one-KIA, long-roster, retired-squad, all sort modes, portrait selection/back, landscape/tablet split, tribute inspection, Mobile→Standard parity, and a genuine new mission KIA.

Next focused Mobile target: **Tactical upper-right unit / fire-team / objective HUD**.

---

# CODEX HANDOFF — v0.26.09.09.1324_MOBILE_REPORTS_ADAPTIVE_LAYOUT_PATCH

Systematic Mobile · Adaptive pass resumed from Browser 1244. This patch is presentation-only for the Reports command section and deliberately preserves the Browser 1242 terminal casualty/result authority.

## Implemented
- Added `MOBILE_REPORTS_ADAPTIVE_LAYOUT_PATCH` and a dedicated `MobileReportsScreen` adapter.
- Mobile Reports is viewport-bounded between the existing command rails.
- Portrait uses a report index or selected detail with Back to index; landscape/tablet displays index + detail together.
- Index and detail scroll independently. The existing monthly summary/mission report buttons remain the authoritative selection callbacks.
- The existing monthly Council detail, Council slide replay, Mission Action Log, General Reports, and Archived Tactical Timeline are reused rather than reimplemented.
- Post-mission resume still binds to `selectedMissionReportId`; a restored report therefore opens detail automatically in Mobile.
- Long tactical timelines no longer need a nested fixed-height scroll region on Mobile because the entire detail pane is bounded and scrollable.
- Shape guards return the original report content if Standard markup changes later. Standard/Desktop Reports is unchanged.

## Authority preserved
- Browser 1242: one active `finishAiPlayback`, last-buffered-frame terminal commit, explicit `alive:false` casualty authority, survivor/KIA reconciliation, committed Tactical Victory precedence.
- Browser 1244: Mobile Missions / launch confirmation.
- Monthly calculations, funding, mission reports, tactical timeline archive data, Council slides, campaign state, and save format 4 are unchanged.

## Release
Synchronize the repository's existing full `src/manifest.json` with `tools/apply-1324-source-manifest.cjs` after overlaying the package. Do not replace the complete manifest with the small merge file.

## Field gate
Test portrait index→monthly detail→Back, index→mission detail→Back, a long tactical timeline, post-mission direct restore to the new report, landscape/tablet split view, Council slide replay, and Standard/Desktop parity.

Next systematic Mobile target: Memorial.


---

# CODEX HANDOFF — v0.26.09.09.1244_MOBILE_MISSIONS_ADAPTIVE_LAYOUT_PATCH

Completed the next systematic Mobile · Adaptive command screen: **Missions / Mission Control**. This release builds on Browser 1242 and retains its final-VIP playback/casualty authority fixes.

- The Browser 0707 source lineage already contained a partially staged Mobile Missions adapter; Browser 1244 formally promotes, hardens, versions, documents, and validates it.
- Mobile Mission Control uses **Briefing / Squads / Launch** sections inside a fixed viewport between the command rails. Each work area owns its own scrolling; the command page itself remains bounded.
- Squads reuses the existing primary-squad buttons, support-squad selector, selected Barracks base, response-force roster, and ready-soldier callbacks. Portrait stacks the two work panes; landscape/tablet uses a split view.
- Launch reuses the existing `requestMissionLaunch` authority and leader-instruction state. No launch, squad, inventory, aircraft, or campaign rule was copied into a second mobile implementation.
- `MissionLaunchReviewFrame` makes the launch confirmation viewport-bounded on Mobile, with scrollable review content, persistent Cancel / Confirm actions, focus entry/restore, and Tab containment.
- `MissionControlScreen` now has shape guards. If a future Standard Mission Control refactor changes the element structure it expects, the Mobile adapter returns the original content rather than crashing.
- Standard/Desktop returns the original Mission Control and launch confirmation unchanged. Save format remains 4.

QA focus: no-incident state; Briefing; primary/support squad changes; Barracks-base changes; leader orders; all four launch modes; portrait stack; landscape/tablet split; launch confirmation scrolling/actions; Mobile→Standard state parity. See `MOBILE_MISSIONS_FIELD_ACCEPTANCE.txt`.

Next systematic mobile target: **Reports**, then **Memorial** after field acceptance.

---

# CODEX HANDOFF — v0.26.09.09.1242_FINAL_VIP_PLAYBACK_COMPLETION_AND_CASUALTY_AUTHORITY_HOTFIX

Follow-up to Browser 1058 after review identified three concrete release/authority defects.

1. **Duplicate playback completion owner:** TacticalMission contained two same-scope `finishAiPlayback()` declarations. The later declaration overrode the earlier Browser 1058 repair. Browser 1242 removes the shadowed version and consolidates Hybrid continuation plus Simulation terminal completion into one handler.
2. **Death-animation display HP is not casualty authority:** an actor may temporarily show positive presentation HP while `alive:false` is already authoritative. `tacticalCommittedPlaybackFrameUnits(...)` now uses the explicit death flag first for permanent human/alien outcome state; omitted `alive` with positive HP still remains living.
3. **Source manifest synchronization:** do not replace the full repository manifest with a partial reconstruction. Run `node tools/apply-1242-source-manifest.cjs` after overlaying this package; it edits only currentBuild, lastInspectedBuild, gameplayParity.browserBuild, and status, preserving every other manifest field.

Terminal success now uses the last buffered playback frame, reconciles survivors, genuine casualties, and rescued civilians, then rebuilds medical/growth/KIA report data from that committed battlefield before `finishTacticalMission`. `aiTerminalVictoryCommitRef` participates in battle-outcome precedence so a committed Tactical Victory cannot later become Squad Lost because of transient presentation state.

Regression coverage checks one active finish handler, positive-HP/omitted-alive survivor preservation, explicit-death/positive-display-HP casualty preservation, rescued civilian state, final-frame completion, victory precedence, and save format 4.

No tactical decision, damage, TU, pathfinding, LOS, rescue quota, reinforcement, or save-format rules were intentionally changed. Physical field acceptance is still required for the exact live final-VIP sequence.


---

# CODEX HANDOFF — v0.26.09.09.1058_FINAL_VIP_TERMINAL_VICTORY_SURVIVOR_COMMIT_HOTFIX

Severe tactical terminal-state hotfix on top of Browser 0707.

## Reproduction
A mandatory VIP mission reached final extraction with no live aliens, unresolved contacts, active reinforcement source, pending arrival, or other mandatory objective. The timeline correctly logged that Tactical Victory was committed. Immediately afterward every surviving soldier fell to HP 0, the UI changed to Squad Lost, and confirming the loss produced a failed Mission Report with every soldier KIA.

## Root cause
`tacticalMissionTerminalState` correctly defines a positive-HP unit as living unless `alive === false`. Some TacticalMission actors had positive HP with `alive` omitted. `applyAiFrameToMap` used truthiness for `unit.alive`, so a second application of the synthetic `Mission success` terminal frame interpreted omitted `alive` as dead and wrote HP 0. The loss-first battle-outcome expression then overrode the committed victory, and campaign aftermath consumed the corrupted battlefield.

## Fix
- Shared `tacticalPlaybackFrameUnitAuthoritativeAlive` matches terminal-state semantics.
- Frame hydration writes explicit `alive` and `fellThisFrame` values for humans/aliens/civilians.
- Fresh tactical actors initialize with `alive:true`.
- Final-VIP victory normalizes committed human survivors.
- Terminal success reapplication restores frame-confirmed survivors before hydration.
- Battle outcome gives committed victory precedence.
- `finishAiPlayback` and manual `finish` reconcile successful casualty/medical result data from the committed battlefield.
- Save format remains 4.

## Field gate
Repeat the final-VIP boarding scenario, verify no survivor HP changes after the terminal frame, verify Tactical Victory remains visible, and verify the permanent Mission Report remains a success with only genuine KIA. Also verify a genuine wipe still reports Squad Lost.


---

# CODEX HANDOFF — v0.26.09.07.1925_MOBILE_PWA_AUDIO_REGRESSION_FIX_PATCH

## Patch focus

- Geoscape drawers keep their own bounded width on narrow phones.
- Mobile Geoscape and Base drawers remain below confirmation windows without changing board placement.
- Master Mute remains authoritative through music crossfades, delayed dialogue callbacks, and the post-mission audio bridge.
- Only game-shell navigation can update the offline game launch page; editor and tool pages remain separate.
- The canonical packager retains PWA installation support and regenerates release hashes and service-worker cache versions.
- Release identity is synchronized with the authoritative source manifest; Standard layout and save format 4 are preserved.

## Validation

Syntax and standard release checks pass. Focused suites pass 34/34. Seeded Build Health remains 792/854 with 62 pre-existing failures. Phone portrait, phone landscape, tablet, and Standard desktop flows were checked in the browser; construction completes with an unobscured, scrollable confirmation.

Canonical release workflow is documented in PWA_DEPLOYMENT_README.txt. The new regression suite is tools/test-mobile-pwa-regressions.cjs. .gitattributes preserves bytes used by embedded payloads and release hashes on Windows. No campaign authority or save-format changes. Physical device installation/audio output remains a field check.

---

# CODEX HANDOFF — v0.26.09.07.1428_MOBILE_BASE_DRAWER_BOARD_VISIBILITY_HOTFIX

## Patch focus
Mobile Base drawer/board coexistence hotfix. Browser 1404 correctly created independently scrolling Base drawers, but the fixed drawer overlaid the 6×6 facility board. Browser 1428 makes the drawer consume/reserve layout width so the Base primary workspace shifts left and the complete board remains visible/tappable while management controls are open.

## Authority preserved
- Existing `mobileBaseDrawer` state and Base Info / Activity / Defense / Facility / Build rail controls remain authoritative.
- No duplicate facility grid or mobile-only construction path was introduced.
- Facility tile buttons continue to call the established `buildFacility(x,y)` path.
- Standard/Desktop Base layout and save format 4 are unchanged.

## Implementation seam
- `data-aegis-base-layout` owns `--aegis-base-drawer-width`.
- The fixed Base sidebar consumes that variable.
- When `data-mobile-base-drawer` is non-empty, `data-aegis-base-primary` reserves the same width plus the drawer gap and remains left aligned.
- `data-aegis-base-grid` remains square and `max-width:100%` in the reserved workspace, allowing uniform shrink rather than drawer overlap.
- On narrow portrait phones, opening a Base drawer temporarily hides both command rails and reduces root padding so the board and drawer can split the full screen; a sticky **Close panel** control inside the drawer restores the rails.

## Field gate
On Mobile · Adaptive Base, open Build, choose a facility, and confirm every legal square across the full 6×6 board remains visible and tappable. Repeat with other Base drawers and on tablet sizing.

---

# CODEX HANDOFF — v0.26.09.07.1404_MOBILE_BASE_COMMAND_ADAPTIVE_LAYOUT_PATCH

## Scope
Second systematic Mobile · Adaptive screen pass. Preserve the accepted Geoscape and convert the Base command screen into a fixed phone/tablet workspace targeting a 1080×2340-class portrait smartphone while scaling upward to tablets. Save format remains 4.

## Implemented
- Mobile Base command root is fixed to the device viewport between the established scrollable command rails.
- The 6×6 facility grid is the persistent center workspace with a compact base selector/storage header.
- Right rail adds Base Info, Activity, Defense, Facility, and Build drawer toggles.
- Each drawer uses independent vertical scrolling and does not dismount the underlying base grid.
- Existing Base Info, activity layer, defense readiness, selected-facility/hangar controls, V.A.L.A.N.T. facility controls, and facility construction UI are reused rather than duplicated.
- Portrait phone presentation hides facility-name ribbons on the 6×6 tiles to protect touch target/readability; tablet sizing expands the board/drawers.
- Standard/Desktop Base remains untouched.

## Invariants
- Save format 4 unchanged.
- Facility placement/cost/upkeep and 2×2 Hangar footprint authority unchanged.
- Hangar assignment/order/rebase/ferry authority unchanged.
- Base Activity and Base Defense calculations unchanged.
- Browser 1345 Geoscape/Terminator correction, Browser 1258 master mute and remembered Resume speed, and PWA behavior retained.

## Field gate
Test Base on the same physical phone used for Geoscape acceptance, then on a representative tablet. Confirm no whole-page Base scrolling, complete grid visibility, independent rail/drawer scrolling, facility selection/build flow, Hangar controls, and Standard interface parity.

---

# CODEX HANDOFF — v0.26.09.07.1345_MOBILE_TERMINATOR_COMPOSITOR_SCALE_HOTFIX

## Scope
Field hotfix for the Browser 1258 mobile Terminator Map fill failure shown in the September 7 screenshot. Save format remains 4.

## Root cause
The Terminator background is not a static image with blank margins. `GlobalTickStableCompositorTerminatorSolarSurface` generates a 720×360 canvas and fills its parent. Browser 1258 also shipped an overly broad mobile CSS rule:

`[data-aegis-terminator-map-root] > div.pointer-events-none { transform: scale(.82); ... }`

The actual solar compositor is one of those direct children, so the background was rendered at 82% while the root and marker canvas stayed full-size.

## Implemented
- Remove the accidental compositor `scale(.82)` rule.
- Keep the generated base map, day/night mask, full-size marker canvas, and pointer coordinate space aligned to the same Mobile · Adaptive viewport.
- Preserve Browser 1258 master mute and remembered Resume speed.
- Preserve desktop Terminator behavior and save format 4.

---

# CODEX HANDOFF — v0.26.09.07.1258_MOBILE_GEOSCAPE_TERMINATOR_AUDIO_TIME_RESUME_HOTFIX

## Scope
Physical-phone follow-up to Browser 1231. Preserve the accepted fixed Mobile Geoscape while correcting Terminator scaling and adding two small mobile quality-of-life controls. Save format remains 4.

## Implemented
- Mobile-only Terminator root now flex-fills the full center strategic pane and overrides the desktop `aspect-ratio: 2/1`; Standard/Desktop remains unchanged.
- Right mobile rail adds master Mute / Unmute for music, SFX, and recorded voice. Individual audio settings remain intact; device-local mute preference restores them on Unmute.
- Pause / Resume tracks the last nonzero Geoscape compression rate in device-local storage and resumes that exact rate.
- Resume button identifies the stored rate (for example `Resume 30m`).

## Preserve
- Browser 1231 fixed Geoscape/scrollable rails/drawers.
- PWA orientation `any`.
- Save format 4, strategic simulation, day/night clock authority, map targeting, incident/UFO/base/range/ferry behavior.

---

# CODEX HANDOFF — v0.26.09.07.1231_MOBILE_GEOSCAPE_ADAPTIVE_PHONE_TABLET_LAYOUT_PATCH

## Scope
First systematic mobile optimization patch: Geoscape only. Target a 1080×2340-class portrait phone and scale upward to tablets without changing strategic authority or save format 4.

## Implemented
- Fixed mobile Geoscape command viewport; no whole-page vertical scroll while Geoscape is active.
- Persistent Globe/Terminator center between independently scrollable rails.
- Mobile drawers: Time / Status, Routes, Operational Overlays, New Base.
- Mobile-only base-placement cancel action.
- Adaptive phone/tablet rail/drawer sizing.
- PWA orientation changed to `any` to permit portrait use.

## Preserve
- Standard desktop UI behavior.
- Save format 4 and all campaign data.
- Existing globe pointer-capture hotfix, range/ferry overlays, incidents, UFO interception, aircraft travel, and base placement authority.

## Next requested work
After field acceptance of the Geoscape, continue screen-by-screen mobile optimization using the same principle: keep the primary workspace visible and move secondary controls into independently scrolling rails/drawers/sheets.

---

# Codex Handoff — v0.26.09.07.1127_PWA_INSTALLABLE_APP_SHELL_PATCH

Implemented installable PWA support around the existing Project Aegis browser host.

## Release identity
- Build: `v0.26.09.07.1127_PWA_INSTALLABLE_APP_SHELL_PATCH`
- Save format: `4` unchanged
- Canonical runtime: `src/browser-runtime.html`
- Playable host: `index.html`
- Runtime bytes: `6609480`
- Runtime SHA-256: `e29670f59967c93d6d0290152771154fbfde2412d4831e7427ffc3edafbab725`

## Added files
- `manifest.webmanifest`
- `service-worker.js`
- `assets/icons/aegis-192.png`
- `assets/icons/aegis-512.png`

## Behavior
- Installed PWA requests landscape; uses fullscreen where supported, standalone fallback otherwise.
- Host captures `beforeinstallprompt`; runtime exposes Install Aegis on start screen and Menu / Save.
- iOS/no-programmatic-prompt path provides Add to Home Screen guidance.
- Service worker is secure-context gated and uses network-first navigation plus opportunistic static caching.
- `file://` remains playable and does not attempt service-worker registration.

## Important deployment note
Deploy the entire patch over the existing repository so the existing `assets/` tree remains present. The patch ZIP contains the changed/new release files; it does not duplicate the game's pre-existing large asset library.
