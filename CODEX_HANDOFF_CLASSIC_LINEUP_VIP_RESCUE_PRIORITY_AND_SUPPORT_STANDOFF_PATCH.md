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
