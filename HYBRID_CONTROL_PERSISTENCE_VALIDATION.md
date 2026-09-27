# Hybrid control persistence — build 0003

Root cause: the main TacticalMission effect replaces the live-state object on routine tactical updates without including hybridBattleMode. A separate effect patched the flag only when the mission or flag changed. Subsequent cache replacement erased it; remount/save restoration treated missing as false.

Fix: declare the state before the main writer, include it in that writer and its dependency list, and remove the supplemental writer. Explicit toggle remains the only setter. No AI/turn/combat behavior or save schema change. Old saves that already lost the flag cannot reveal the user's prior choice; enable Hybrid once after updating.

Validation: three tests execute the actual snapshot effect with React-style dependency comparison. They cover selection, AI playback, turn, round, view and log replacements; explicit disable/enable with otherwise unchanged state; real save restoration; and mission isolation. Save recovery and previous TPV regressions are also run. Live installed-game acceptance remains pending.

Field check: enable Hybrid, move/select leaders, end a Hybrid turn, open/close the menu, change tactical view and save/reload. Hybrid should stay on. Explicitly disable and repeat; it should stay off.

Observer follow-up: Hybrid finish and Take Back Control now capture the active FPV/TPV handoff before clearing playback. The pending handoff is included in tactical snapshots and restored on mount; the existing playback-start effect consumes it. Explicitly disabling Hybrid clears the pending choice. Leader-control intervals still use the map. Added tests cover FPV and TPV through idle snapshots, real save restoration and next-handoff interpretation, plus capture-before-clear wiring. Five Hybrid tests and five TPV tests pass; the 17 save-recovery tests also passed before this additive camera follow-up.
