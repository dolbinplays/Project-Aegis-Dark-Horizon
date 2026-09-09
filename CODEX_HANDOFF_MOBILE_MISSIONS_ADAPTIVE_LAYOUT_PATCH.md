# CODEX HANDOFF — v0.26.09.09.1244_MOBILE_MISSIONS_ADAPTIVE_LAYOUT_PATCH

Completed the next systematic Mobile · Adaptive command screen: **Missions / Mission Control**. This release builds on Browser 1242 and retains its final-VIP playback/casualty authority fixes.

- The Browser 0707 source lineage already contained a partially staged Mobile Missions adapter; Browser 1244 formally promotes, hardens, versions, documents, and validates it.
- Mobile Mission Control uses **Briefing / Squads / Launch** sections inside a fixed viewport between the command rails. Each work area owns its own scrolling; the command page itself remains bounded.
- Squads reuses the existing primary-squad buttons, support-squad selector, selected Barracks base, response-force roster, and ready-soldier callbacks. Portrait stacks the two work panes; landscape/tablet uses a split view.
- Launch reuses the existing `requestMissionLaunch` authority and leader-instruction state. No launch, squad, inventory, aircraft, or campaign rule was copied into a second mobile implementation.
- `MissionLaunchReviewFrame` makes the launch confirmation viewport-bounded on Mobile, with scrollable review content, persistent Cancel / Confirm actions, focus entry/restore, and Tab containment.
- `MissionControlScreen` now has shape guards. If a future Standard Mission Control refactor changes the element structure it expects, the Mobile adapter returns the original content rather than crashing.
- Standard/Desktop returns the original Mission Control and launch confirmation unchanged. Save format remains 4.

QA focus: no-incident state; Briefing; primary/support squad changes; Barracks-base changes; leader orders; all four launch modes; portrait stack; landscape/tablet split; launch confirmation scrolling/actions; Mobile→Standard state parity. See `MOBILE_MISSIONS_FIELD_ACCEPTANCE.txt`.

Next systematic mobile target: **Reports**, then **Memorial** after field acceptance.

---
