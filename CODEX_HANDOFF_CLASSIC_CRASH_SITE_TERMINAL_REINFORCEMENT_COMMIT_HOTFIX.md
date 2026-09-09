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

