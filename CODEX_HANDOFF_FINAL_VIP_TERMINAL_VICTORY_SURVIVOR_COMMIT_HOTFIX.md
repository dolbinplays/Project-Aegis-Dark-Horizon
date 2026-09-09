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
