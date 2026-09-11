# CODEX HANDOFF — v0.26.09.11.0745_CLASSIC_LINEUP_STREAMING_VISIBILITY_AND_BATTLE_TEMPO_STABILIZATION_PATCH

Browser 1735 is the baseline. This patch stabilizes the streamed Classic presentation only; shared tactical outcome authority is deliberately unchanged.

## Preserve these invariants
- `resolveMission(...)`, `tacticalMissionTerminalState(...)`, and `tacticalAiMissionResolution(...)` must remain the combat/result authority.
- Continuation chunks are still one tactical round and resume through `initialBattleState`; do not create a second Classic resolver.
- `classicLineupStreamAppendFrames(...)` may remove the first chunk frame only when `classicLineupStreamInheritedSeamFrame(...)` identifies the explicit inherited seam. Do not return to unconditional `slice(1)`.
- `tacticalAiSequentialPlaybackFrames(...)` may insert a **presentation-only** reinforcement materialization hold if a new reinforcement would otherwise first appear in an observable combat frame. This hold cannot create, damage, move, or schedule an alien.
- First contact, reveal/LKC transitions, VIP/civilian contact/escort/boarding/extraction/death, rescue-role changes, reinforcement arrival, Beacon/UFO-bay state, shots, impacts, deaths, and terminal frames are no-skip presentation transitions.
- Lethal shot order is tracer with live target → impact/death → fade/reflow.
- Automatic pacing may compact up to two quiet round checkpoints; manual Next stays single-frame.
- Stream prefetch triggers at a two-round lead (`<= CLASSIC_LINEUP_STREAM_TARGET_ROUND_BUFFER`) to reduce catch-up pauses.

## Regression focus
Exercise a meaningful first frame at a chunk seam, first-contact shot, reinforcement first-action shot, lethal hit, LKC resolution, VIP escort/boarding/extraction, quiet multi-round search, and final mission commit. Preserve Browser 1223 visible-target insertion, Browser 0810 UFO beam/streaming, Browser 2154 rescue priority, Browser 2054 fade/reflow, Browser 1712 stale-contact sanitation, Browser 1242 casualty authority, exactly one `finishAiPlayback()`, and save format 4.

