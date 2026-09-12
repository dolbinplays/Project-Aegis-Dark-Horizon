# CODEX HANDOFF — v0.26.09.12.1226_TACTICAL_CASUALTY_CARE_PHASE_2_BLEEDING_STABILIZATION_AND_TRIAGE_PATCH

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
