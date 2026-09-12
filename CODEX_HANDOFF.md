# CODEX HANDOFF — v0.26.09.12.1300_BUILD_AUDIT_AND_TERMINAL_PLAYBACK_INTEGRITY_PATCH

Browser 1226 is the gameplay baseline. Browser 1300 audits the patches added since Browser 1058, fixes terminal Hybrid completion, aligns fallback 3D land-vehicle placement with footprint authority, repairs generic checks, and removes merged one-use patch-delivery files. Save format remains 4.

## Fixed authority boundaries

- `finishAiPlayback()` must evaluate a terminal Hybrid result before consuming `hybridContinuation`. A successful final frame is reconciled through `tacticalCommittedPlaybackFrameUnits(...)` and `tacticalTerminalVictoryResultFromCommittedBattlefield(...)` for both Simulation and Hybrid playback.
- Completion must continue to wait while the playback sequencer owns pending presentation actions. Interrupted, pending, and operation-incomplete streams must not finalize.
- `tacticalThreeCoverWorldAnchor(...)` owns the center of multi-hex land-vehicle presentation in both fallback and persistent Three.js renderers. `tacticalThreeBuildingPresentationCoverShouldRender(...)` owns footprint-cell visibility.
- `check-aegis-build.cjs` locates actual patch-history mutation statements; quoted contract-test strings are not mutations.

## Repository layout

- Keep `src/browser-runtime.html` as canonical game source and generate `index.html`, `service-worker.js`, and `release-metadata.json` with `node tools/package-runtime-shell.cjs`.
- Keep `src/manifest.json`, this handoff, `README_PATCH_NOTES.txt`, `VALIDATION_SUMMARY.txt`, the canonical Game Bible, PWA documentation, stable test/smoke tools, and field-acceptance plans.
- One-use `APPLY_*` wrappers, `manifest.*.merge.json` fragments, `tools/apply-*` updaters, upload lists, per-patch checker snapshots, superseded handoffs, and duplicate Game Bible snapshots were removed after merge. Retrieve an old copy from Git history if needed for archaeology.

## Field gates

1. Finish a Hybrid mission whose playback still contains a continuation snapshot; it must open the terminal report without returning to another player round.
2. Confirm survivor/KIA/civilian counts in that report match the final playback frame.
3. Spot-check a bus or other multi-hex road vehicle in the fallback 3D renderer for centered placement and footprint-cell reveal.
4. Repeat the existing Casualty Care Phase 2 bleeding/stabilization/triage field acceptance and one installed-PWA cold launch.

---

# Previous handoff — v0.26.09.12.1226_TACTICAL_CASUALTY_CARE_PHASE_2_BLEEDING_STABILIZATION_AND_TRIAGE_PATCH

Browser 2248 is the gameplay baseline. Browser 1226 adds Tactical Casualty Care Phase 2: bleeding/deterioration, stabilization, targeted adjacent first aid, multi-charge Field Medkits, and bounded shared AI triage. Save format remains 4.

## Medical state authority
- Recoverable Phase 1 downings now set `bleeding:true`, `stabilized:false`, `bleedOutRounds:3`, and `bleedLastProcessedRound` to the downing round. Catastrophic KIA clears those fields.
- `tacticalCasualtyDeteriorationStep(units, round)` is the once-per-round bleed authority. Preserve the `bleedLastProcessedRound` guard; Manual/Hybrid/Simulation paths may touch the same round. Expiration becomes authoritative KIA.
- Stabilization stops bleeding but does **not** revive the casualty. A stabilized soldier remains alive, downed/unconscious/prone and non-combat-active.

## Field Medkit authority
- `tacticalFieldMedkitCapacity(...)`: ordinary issued kit = 4 tactical charges; Medic specialization = 10. `tacticalInitialMedkitCharges(...)` initializes new deployments and respects restored/continuing tactical charge state.
- Self-treatment remains 12 TU / up to 12 HP / 1 charge.
- `tacticalFirstAidUseResult(...)` owns adjacent treatment: conscious wounded teammate = 14 TU / up to 10 HP / 1 charge; bleeding downed casualty = stabilization for 16 TU / 1 charge.
- Do not convert tactical charges into strategic inventory consumption in this phase. The issued Field Medkit is reusable equipment; strategic resupply/economics are Phase 3.

## AI triage
- `tacticalMedicalPriorityTarget(...)` and `tacticalAiMedicalTriageStep(...)` share the same treatment rules as Manual play. Urgent bleeding casualties rank first and an adjacent Medic is preferred where possible.
- The existing Phase 1 visibility-safe emergency drag remains separate. Do not introduce hidden alien coordinates as a medical trigger.

## Round / visibility invariants
- Downed/unconscious soldiers must remain `tu:0` during human-round refresh.
- Downed/unconscious soldiers provide neither live tactical LOS nor Simulation-playback visibility reconstruction.
- `resolveMission(...)` intentionally differs from Browser 2248 because Phase 2 applies casualty deterioration and AI medical triage.
- `tacticalMissionTerminalState(...)` should remain the Browser 2248 Phase 1 authority: living vs. combat-active vs. downed humans, with all-down resolving defeat.

## Snapshot/save
Optional tactical fields now include `bleeding`, `stabilized`, `bleedOutRounds`, `bleedLastProcessedRound`, `stabilizedById`, `stabilizedRound`, and `medkitCharges`. Save format stays **4**.

## Preserve byte-for-byte unless explicitly targeted
- `tacticalAlienReinforcementArrival(...)`
- `tacticalBuildingPlans(...)`
- `tacticalBuildingCovers(...)`
- `makeBattlefield(...)`
- `tacticalAiMissionResolution(...)`
- `tacticalThreePersistentStartBeaconReinforcementArrivalCinematic(...)`
- `tacticalThreePersistentCreateAlienTransitMaterializationEffect(...)`
- Browser 1800 `release-beacon-navigation-v2` / `aegis-launch-shell-v2` PWA architecture
- Browser 1740 Mobile Tactical Status HUD collapse/expand
- Browser 1610 building perimeter seams
- Browser 1254 horizon treatment
- exactly one `finishAiPlayback()` definition

## Field gates
1. Bleeding casualty counts 3 -> 2 -> 1 -> KIA exactly once per round when untreated.
2. Stabilization spends 16 TU/1 charge, stops deterioration, and does not revive.
3. Adjacent teammate treatment spends 14 TU/1 charge and heals <=10; self treatment spends 12 TU/1 charge and heals <=12.
4. Ordinary Field Medkit starts 4 charges; Medic kit starts 10.
5. AI prioritizes urgent bleeding casualty and prefers adjacent Medic.
6. Save/reload active bleeding/stabilized cases with no reset/double tick.
7. Regress Phase 1 dragging/all-down, Beacon effects, PWA, Mobile HUD, building seams, save format 4.
