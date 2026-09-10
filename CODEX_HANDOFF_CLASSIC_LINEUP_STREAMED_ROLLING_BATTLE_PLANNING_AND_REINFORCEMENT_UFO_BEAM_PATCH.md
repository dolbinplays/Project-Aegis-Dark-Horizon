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
