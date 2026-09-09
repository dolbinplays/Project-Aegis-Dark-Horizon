# CODEX HANDOFF — v0.26.09.09.1242_FINAL_VIP_PLAYBACK_COMPLETION_AND_CASUALTY_AUTHORITY_HOTFIX

Follow-up to Browser 1058 after review identified three concrete release/authority defects.

1. **Duplicate playback completion owner:** TacticalMission contained two same-scope `finishAiPlayback()` declarations. The later declaration overrode the earlier Browser 1058 repair. Browser 1242 removes the shadowed version and consolidates Hybrid continuation plus Simulation terminal completion into one handler.
2. **Death-animation display HP is not casualty authority:** an actor may temporarily show positive presentation HP while `alive:false` is already authoritative. `tacticalCommittedPlaybackFrameUnits(...)` now uses the explicit death flag first for permanent human/alien outcome state; omitted `alive` with positive HP still remains living.
3. **Source manifest synchronization:** do not replace the full repository manifest with a partial reconstruction. Run `node tools/apply-1242-source-manifest.cjs` after overlaying this package; it edits only currentBuild, lastInspectedBuild, gameplayParity.browserBuild, and status, preserving every other manifest field.

Terminal success now uses the last buffered playback frame, reconciles survivors, genuine casualties, and rescued civilians, then rebuilds medical/growth/KIA report data from that committed battlefield before `finishTacticalMission`. `aiTerminalVictoryCommitRef` participates in battle-outcome precedence so a committed Tactical Victory cannot later become Squad Lost because of transient presentation state.

Regression coverage checks one active finish handler, positive-HP/omitted-alive survivor preservation, explicit-death/positive-display-HP casualty preservation, rescued civilian state, final-frame completion, victory precedence, and save format 4.

No tactical decision, damage, TU, pathfinding, LOS, rescue quota, reinforcement, or save-format rules were intentionally changed. Physical field acceptance is still required for the exact live final-VIP sequence.
