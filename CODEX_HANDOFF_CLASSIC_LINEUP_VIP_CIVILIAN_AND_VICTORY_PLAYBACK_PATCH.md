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
