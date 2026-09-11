# CODEX HANDOFF — v0.26.09.11.0915_CLASSIC_LINEUP_MOBILE_LANDSCAPE_READABILITY_AND_COMPACT_LAYOUT_PATCH

Browser 0745 is the gameplay baseline. This patch is a **Classic Lineup responsive presentation patch only** for short-height landscape phones.

## Mobile landscape layout authority
- The compact mode is CSS/media-query driven by landscape + short viewport height. Do not make it a second mission/playback mode.
- `MissionSimulationOverlay` retains one Classic data/render authority; data attributes provide responsive hooks for the same mission, speed, frame, result, rules, and action content.
- Larger layouts keep the full title, survivor/rescue cards, and explanatory paragraph. Short landscape phones use the compact title, result chips, and optional `ⓘ Classic rules` disclosure.
- Keep Next/Continue/Tactical Computation callbacks and stream-terminal gating unchanged.

## Preserve
- `resolveMission(...)`, `tacticalMissionTerminalState(...)`, and `tacticalAiMissionResolution(...)` are byte-identical to Browser 0745.
- Preserve Browser 0745 protected-event pacing and chunk seam hardening, Browser 1223 visible-target insertion, Browser 0810 rolling planner/UFO beam, Browser 2154 VIP rescue priority/support standoff, Browser 2054 fade/reflow, Browser 1712 LKC sanitation, Browser 1242 survivor/KIA authority, one `finishAiPlayback()`, and save format 4.

## Field gate
At roughly 844×390 and nearby landscape phone sizes, verify the battle arena owns most of the screen, the controls never cover it, result chips fit, rules remain collapsed until requested, and Next/Continue stay reachable. Confirm Standard/Desktop remains unchanged.

---
