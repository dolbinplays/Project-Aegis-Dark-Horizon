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

