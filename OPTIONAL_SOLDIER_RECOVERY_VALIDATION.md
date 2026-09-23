# Optional Soldier Recovery & No One Left Behind

Build: v0.26.09.22.0007_OPTIONAL_SOLDIER_RECOVERY_AND_NO_ONE_LEFT_BEHIND_PATCH

Stabilized unconscious casualties appear as optional objectives on the existing fire-team assignment board. The board identifies the casualty and current dragging status. One primary team owns an objective; assigned assistants can help. The existing AI extraction path respects assignment ownership and Hybrid player control, while a physical manual drag retains authority. Extraction or changed casualty status clears the objective.

The actual extracting soldier earns the repeatable No One Left Behind commendation. Award credit uses a confirmed extraction event captured before onboard medical stabilization. Bleeding casualties stabilized only during boarding, generic successful-mission recovery, assignment alone, and team membership alone do not qualify. Mission/event keys deduplicate recognition across repeated result processing and saves. Attribution appears in mission reports and the existing soldier commendation display.

Medical rules, mandatory rescue quotas, victory conditions, and save format 4 are unchanged. Existing autonomous casualty recovery remains available without explicit assignments.

## Verification
- Twelve focused tests cover eligibility, assignment conflicts, actual team approach/drag/extraction, manual awards, nonqualifying recovery, objective release, Hybrid/medical ownership, save/migration/playback, continuation mid-drag, assisting teams, snapshots, and the rendered objective board callback.
- Existing casualty ownership tests pass.
- Full regression run before the last four focused tests were added: 440 checks, 405 passed, 35 failed. Failing names exactly match the preceding baseline; no new failing names.
- Build seams, packaged-runtime identity and embedded JavaScript syntax pass.

## Live acceptance still pending
1. Stabilize a downed soldier and assign their optional recovery objective to a team.
2. Run AI/Hybrid continuation; verify approach, dragging and Skyranger extraction, including a save/reload while dragging.
3. Confirm the casualty stays unconscious and the objective disappears on extraction.
4. Check No One Left Behind on the extracting soldier and the debrief attribution; reload without duplicate credit.
5. Check an unreachable route, a lost responder and interrupted manual drag in a real mission.
