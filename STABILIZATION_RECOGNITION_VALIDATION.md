# Battlefield stabilization recognition — validation

Build: `v0.26.09.22.0001_STABILIZATION_RECOGNITION_PATCH`

Save format remains 4. Local changes only; no commit or deployment was performed.

## Approved behavior

The player selected successful teammate stabilization as the qualifying event on September 22, replacing the older roadmap requirement to get the casualty back up. Medical costs, healing and incapacitation are unchanged.

- A confirmed Field Medkit stabilization appends a battle-local event to the patient. The event identifies the patient, responder, treatment round and per-patient sequence.
- A red upward arrow immediately follows the casualty's vitals name indicator. Its accessible label/tooltip explains that treatment stopped bleeding and does not mean revival or current survival. Current BLD/STB/KIA/EVAC status remains separate.
- Mission aftermath awards the responder Field Lifesaver, with a cumulative count shown through existing dossier/memorial commendation presentation. Mission report entries identify who treated whom and when.
- Award IDs combine mission identity and treatment-event identity. Reprocessing results, replaying frames or reloading saves cannot award the same event twice. Distinct patients and distinct future injury/stabilization events can earn further credit.
- Ordinary healing, self-treatment, failed attempts and extraction-only stabilization are excluded. Historical flags on old saves do not generate retroactive credit.
- Subsequent wounds or death preserve recognition without implying survival. Markers belong only to tactical units; fresh battles do not inherit them from campaign records.
- The explicit streamed snapshot and map-playback hydration paths preserve recognition and current casualty state through Manual/AI/Hybrid handoffs.

## Automated validation

- 11 focused tests in tools/test-stabilization-recognition.cjs pass against the canonical runtime.
- Playback sequencer passes 17 behavioral checks, including actual shipped frame hydration, medical status, recognition retention, terminal handling and Take Back Control.
- All four casualty-care/terminal-state smoke scripts pass, including stabilization costs, no revival, AI triage, dragging, extraction and post-casualty vitals.
- Build identity, canonical source/packaged payload consistency, embedded JavaScript syntax and diff whitespace checks pass.

Full repository sweep: **400 checks, 365 passed, 35 failed**. All 35 failing names match the previous callsign-patch run. They remain older editor/library failures; no tests were skipped or suppressed. The suite is not fully green.

Reproduce:

```powershell
node --test tools/test-stabilization-recognition.cjs tools/test-ai-playback-sequencer.cjs
node --test tools/test-casualty-medical-history.cjs tools/test-medical-resupply-and-vitals.cjs tools/test-default-ai-casualty-response-ownership.cjs
node tools/smoke-tactical-casualty-care-phase-1.cjs
node tools/smoke-tactical-casualty-care-phase-2.cjs
node tools/smoke-tactical-casualty-care-phase-3a.cjs
node tools/smoke-tactical-casualty-terminal-state.cjs
node tools/check-aegis-build.cjs
node tools/check-embedded-js.cjs
```

## Pending live acceptance

Browser automation could not initialize: failed to write kernel assets (system cannot find the path specified). Automated coverage is headless; no live browser visual acceptance is claimed.

1. In Manual, stabilize a bleeding teammate. Verify the red arrow sits beside the vitals name, its explanation is accessible, and the patient remains downed/STB at the same HP. Check long names and Mobile Adaptive layouts.
2. Repeat with AI/Hybrid. The marker should first appear with the treatment frame, survive Take Back Control and tactical save/load, and remain through reassignment and later injury/KIA without obscuring current status.
3. Complete the mission. Verify the responder's Field Lifesaver commendation and the attributed report entry. Save/reload and resume the same post-mission checkpoint: the count must not increase again.
4. Stabilize a different patient in another battle. Verify the count increases and the previous battle's marker did not carry into fresh tactical units.
5. Test ordinary healing, self-treatment, unsuccessful treatment and extraction-only medical stabilization; none should produce recognition.

Fire TV work remains deferred.
