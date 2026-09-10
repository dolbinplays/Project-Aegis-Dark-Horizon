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
