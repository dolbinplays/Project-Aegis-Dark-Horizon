v0.26.09.15.0904_TETROMINO_PROCEDURAL_BUILDING_FOOTPRINTS_PATCH

Tetromino Procedural Building Footprints
- Procedural structures now support I/O/T/L/J/S/Z footprint families and deterministic rotations within the existing archetype bounds.
- Shared footprint authority drives interior/perimeter classification, doors, walls/windows, furnishings, roofs, perimeter seams, civilian placement, structure-distance checks and AI building egress. Concave recesses remain outside/traversable.
- Pre-patch live tactical saves are detected by legacy structural covers lacking shape metadata and retain rectangular plan authority for that already-started battle. New saves carry building shape metadata in structural covers.
- New focused regression file: tools/test-tetromino-building-footprints.cjs. Field checklist: PROCEDURAL_BUILDING_TETROMINO_FOOTPRINTS_FIELD_ACCEPTANCE.txt.
- Save format remains 4. IndexedDB durable save storage from Browser 0745 remains in place.

Next roadmap candidate
- Match tactical battle-model faces/equipment markings to soldier identity, unless field acceptance exposes a tetromino-building regression first.
- Command Screen AEGIS Operations Overview remains recorded as a later dedicated UI/dashboard patch.

--- Previous patch ---

v0.26.09.15.0745_INDEXEDDB_SAVE_STORAGE_HOTFIX

Durable IndexedDB Save Storage Hotfix
- A mature Month 3 / Day 18 campaign export from Browser 1351 is about 1.35 MB pretty-printed / 894 KB minified. Storing repeated full-campaign snapshots across ten manual slots plus rotating autosaves in localStorage can exhaust the browser origin quota and produce the observed “Browser storage rejected the save” failure.
- IndexedDB is now the primary storage authority for manual save collections and rotating autosaves. Existing localStorage collections migrate lazily; successful IndexedDB writes reclaim the superseded large localStorage key.
- Save, delete, save-slot-backup import, autosave, post-mission reboot checkpoint and startup resume use the durable backend. localStorage remains a compatibility fallback, and the emergency JSON download remains the last-resort manual-save recovery path.
- Existing exported JSON files remain import-compatible. Save format remains 4.

--- Previous patch ---

v0.26.09.14.2320_TACTICAL_CIVIC_LANDMARK_1_TO_7_HEX_FOOTPRINT_PATCH

Tactical Civic Landmark 1–7 Hex Footprints
- Statues and fountains use deterministic connected 1–7 hex footprints with shared placement, collision/pathfinding, hard-cover, visibility and selection authority.
- 3D landmark presentation is centered/scaled to the authoritative footprint; footprint cells and scale survive save/reload.
- Placement protects roads, ingress, neighboring structures, props and Skyranger extraction space. Save format remains 4.

--- Previous patch ---

v0.26.09.14.1351_LAYERED_BUS_AND_SCHOOL_BUS_COLORS_PATCH

Layered Bus Body and School-Bus Colors
- Keep the original lower bus body, wheels, headlights and ground footprint.
- Full-width/full-length glass is twice its former height, topped with a matching metal roof as thick as the old glass section.
- A deterministic mix of yellow school-bus and blue city-bus metal colors survives reload. Both renderers use the shared vehicle builder.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.1149_INTERSECTION_TRAFFIC_CONTROLS_PATCH

Intersection Traffic Controls
- New street maps detect crossings and T-junctions from connected road/lane/path cells, consolidating wide junctions into one location.
- Place complete, consistently oriented traffic-light or stop-sign arrangements on available roadside approaches. Reserve controls before other props and avoid buildings and protected entrances.
- Skip junctions without enough safe space or prop budget; remove scattered mid-road controls. Entrance cleanup never relocates a control away from its junction. Existing saved prop placements are retained.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.1112_BATTLE_VISIBILITY_REUSE_PERFORMANCE_PATCH

Battle Visibility Reuse Performance
- Reuse the last unchanged shared visibility result instead of repeating every soldier sight scan during battle updates. Cache misses run the existing interior-map calculation unchanged.
- Value snapshots detect in-place movement, facing, flashlight, observer eligibility, lighting, smoke, power, wall and vehicle footprint changes. One bounded snapshot is retained; returned Sets are detached.
- Browser fixture with 48 soldiers and 177 covers: repeated checks improved from 26.6–44.7 ms to 0.3–0.4 ms with identical visible cells. This measures visibility work, not total frame time or hardware-specific FPS.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.0955_SOLID_BUILDING_WALL_VISIBILITY_PATCH

Solid Building Wall Visibility
- Standing beside a solid building wall or partition no longer grants sight through it, for observers or targets on either side. Shared sight checks apply to all teams.
- Windows, existing open doorway gaps and breached structures allow aligned sight; a nearby opening does not bypass another wall. Breach rubble no longer blocks longer sightlines.
- Solid wall faces remain discoverable and ordinary cover keeps its existing adjacency behavior. Structural state changes invalidate visibility caches.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.14.0717_VIP_CAMERA_DIRECTION_MARKERS_PATCH

VIP Camera Direction Markers
- FPV/TPV VIP indicators only appear inside the active camera view. Behind-camera, near/far-clipped and off-screen perspective markers are hidden instead of mirrored or clamped ahead.
- Turning or switching cameras restores visible markers immediately, using camera orientation independently of soldier facing. Isometric edge guidance is retained.
- Yellow awaiting-rescue and cyan ESCORTING presentation continue to use displayed escort state. Save format remains 4.
- Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.2259_VIP_ESCORT_STATUS_MARKERS_PATCH

VIP Escort Status Markers
- Awaiting-rescue VIPs remain gold/yellow; active escorted VIPs use cyan with ESCORTING text and accessible status labels.
- Panic or escort loss/incapacitation restores yellow. Assignment alone does not change status, and dead/extracted VIP trackers disappear.
- Shared state covers 2D, both 3D renderers and perspective/minimap markers; stationary changes refresh cached presentation.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1807_VEHICLE_BODY_FOOTPRINT_AND_PLAYBACK_PATH_INTEGRITY_PATCH

Vehicle Body Footprints + Playback Path Integrity
Validation: 69 Node tests and six smoke scripts pass; final browser diagnostics 897/967 match baseline with no new failures. Updated obsolete elimination-only assertions to respect existing incomplete-operation and casualty authority.
- Rotated land-vehicle bodies and shoulder clearance now drive the shared blocked footprint. New placement reserves it; saved vehicles preserve their visual anchor.
- Sparse playback trails rebuild through adjacent legal cells rather than jumping through obstacles. Destroyed vehicles retain existing traversability.
- Save format remains 4. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1726_VITALS_SELECTION_AND_ITEMIZED_MISSION_REPORTS_PATCH

Vitals Selection + Itemized Mission Reports
- Select living field soldiers from vitals in Manual; Hybrid uses the leader, downed cards inspect, Simulation remains read-only. Selected cards have a visible outline.
- New mission reports have grouped itemized results; older reports show itemized archived summaries. Logs and timelines remain intact.
- Save format 4 is unchanged. Publish index.html, service-worker.js and release-metadata.json together with existing assets.

--- Previous patch ---

v0.26.09.13.1249_MOBILE_ADAPTIVE_MISSION_FAILURE_NOTICE_PATCH

Mobile / Adaptive Mission Failure Notice
- Victory/failure notices layer above vitals. Opening Base preserves a paused clock instead of starting 5-minute time passage.
- Shows Mission Failed for a terminal missed VIP quota even with surviving soldiers, with an explanation and End Failed Incident and Return to Base.
- Completed AI/Hybrid failures use the existing final result; manual failures use live finalization. Pending playback and interrupted streams cannot trigger premature failure notices.
- VIP quota rebalancing is roadmap-only. Save format remains 4.
- Publish index.html, service-worker.js and release-metadata.json together with the existing assets.

--- Previous patch ---

# CODEX HANDOFF — v0.26.09.13.1209_FIRE_TEAM_VITALS_REASSIGNMENT_AND_VEHICLE_HEADLIGHT_ALIGNMENT_PATCH

Vitals follow survivors absorbed into another team without losing casualty cards. Land-vehicle headlamps and forward beams align with the narrow front face in both 3D renderers.

- Living soldiers who change fire teams receive a unique slot in the receiving vitals panel; unchanged teammates keep their slots and fallen soldiers stay in their former panel.
- Panels remain alphabetical. Extra casualty cards use additional grid rows instead of hiding members beyond four. Reconciled slots persist with tactical snapshots.
- Cars, vans, utility vehicles and buses share their detailed model and headlamp geometry across persistent and fallback renderers.
- Headlamps sit on the short front face along local +X; forward spotlights use the same group rotation. Daytime/unpowered lenses remain attached but do not emit light.
- Existing tactical illumination, footprints, casualty-impact display timing and save format 4 are preserved.

Authority: tacticalPhysioCaptureFormation updates live transfer membership and reserves valid existing slots before allocating arrivals. tacticalReconcileFireTeams captures formation again after reassignment. KIA cards retain former membership. The HUD renders all members and additional grid rows.

Vehicle rendering: tacticalThreeAddLandVehicle shares the existing body dimensions; tacticalVehicleHeadlightLayout owns lamp/front/beam anchors. Positive local X is forward. tacticalThreeAddVehicleHeadlightBeam targets forward within the same rotated group; persistent rendering retains its existing light budget. Gameplay light profiles and LOS remain unchanged.

Field gates: absorb a singleton; save/reload; check casualty-filled receiving panels and alphabetical order; confirm impact holds still release correctly. Inspect each vehicle type at multiple rotations by day/night in both renderers. Check Mobile panels with additional casualty rows.

---

# CODEX HANDOFF — v0.26.09.12.2346_TACTICAL_CASUALTY_CARE_PHASE_3C_MEDICAL_RESUPPLY_AND_IMPACT_SYNCHRONIZED_VITALS_PATCH

Medical charges now persist between missions and refill from local stores. Fire-team vitals reveal injuries after the attack impact rather than at frame hydration.

- Remaining charges and reusable kit ownership survive mission return, save/load, tactical transfers and empty kits. Legacy issued kits retain their existing 4/10-charge allocation.
- A purchased Medkit includes four charges. Medical Supplies cost 10k per charge; Medics can refill to ten and other soldiers to four. Returning a kit stores its empty shell and unused charges separately; reissue does not create charges.
- Refill Medkit controls in Quartermaster and personnel/Sickbay loadouts consume only the soldier's local Medical Supplies. Soldiers committed to a sortie or transfer cannot alter their medical loadout.
- Victory salvages fallen soldiers' actual remaining charges and kit shells; failed extractions do not return medical supplies. Tactical kit transfers preserve ownership.
- Soldier cards and launch summaries display persistent charge availability and empty-kit warnings.
- Vitals hold pre-hit health and medical state during observed attacks, then update after projectile impact and its reaction hold. Playback cancellation clears display holds; gameplay authority remains unchanged.
- Save format remains 4; permanent injuries, advanced formulations and encumbrance remain deferred.

Authority: soldier.medicalCharges stores campaign charges; tactical medicalKitOwned tracks shell transfers independently of charges. Final medical outcomes feed growth.medkitOwned and the shared campaign aftermath. Refill/return use local inventories. Medkit is a four-charge retail pack; Empty Medkit is a reusable shell; Medical Supplies are individual charges.

Vitals: applyAiFrameToMap holds injured human snapshots before hydrating observed shot results. showShotEvent/playAiPlaybackFrame release those display snapshots after travel plus impact hold. cancelAiPlaybackTimers clears holds; unmount cancels their timers. Do not delay authoritative units or change shot outcomes for HUD timing.

Field gates: repeat kit issue/refill/return at two bases; save an empty kit; transfer a kit during battle; win/withdraw with a fallen kit owner; verify remaining supplies after the post-mission reboot. Watch a nonfatal hit, downing and KIA at slow/normal/fast playback and in Manual/Hybrid; vitals must change after impact. Check Mobile refill controls and stable alphabetical vitals. Native parity remains deferred.

---

# CODEX HANDOFF — v0.26.09.12.2122_TACTICAL_CASUALTY_CARE_PHASE_3B_SICKBAY_RECOVERY_AND_RESCUE_OUTCOMES_PATCH

Phase 3B adds persistent medical histories, return-to-duty estimates, fractional recovery credit and explicit medical debriefs. Includes the prior stable-slot and alphabetical vitals fixes. Save format remains 4. Native parity remains deferred in the manifest.

## Medical record authority

- tacticalApplyCasualtyExtractionAftermath creates medicalRecords from the authoritative final battlefield after recovery/KIA reconciliation. Each record retains mission and soldier IDs, final HP, outcome, stabilization, rescuer, craft and round metadata.
- campaignRecordMissionMedical attaches each record once per mission/soldier during the shared campaign aftermath map, before friendship processing and the existing post-mission save/reboot. Reapplying a record does not restart care.
- Outcomes: evacuated, recovered-after-victory, wounded-returned, unrecovered, kia. Records are retained on the soldier, including after return to duty or death.
- addMissionReport retains structured records; buildMissionReportEntries appends medical summaries after terminal log trimming.

## Recovery authority

- recoveryDaysRemaining stores full-speed care days, including fractional Barracks credit. Sickbay spends 1/day; Barracks spends 0.5/day.
- soldierRecoverySummary derives remaining calendar days at the current care speed and progress from that same countdown. Bed transfers retain credit. Old saves fall back to woundDays(status).
- recoverSoldierOneDay owns healing, countdown and completion. At zero it marks the active medical record completed, records actual care days, and uses the existing Ready/auto-squad-return path.
- SoldierMedicalHistory renders in SoldierCard for both layouts. Mobile Sickbay list uses calendar-day ETA.

## Field acceptance

1. Stabilize and evacuate one casualty; win with another living casualty still in the field. Verify distinct report outcomes and rescue details in each soldier's history.
2. Withdraw with one evacuated casualty and one casualty left behind. Verify the first survives and the second remains KIA in report, roster and reload.
3. Move a patient between Sickbay and Barracks after a day of care. Verify changed ETA, retained fractional progress, and save/reload consistency.
4. Finish recovery. Verify Ready status, existing squad-return behavior and completed medical history.
5. Inspect Standard and Mobile Sickbay history, progress and ETA. Recheck stable, alphabetical vitals after leader death.

---

# CODEX HANDOFF — v0.26.09.12.1403_TACTICAL_CASUALTY_CARE_PHASE_3A_EXTRACTION_AND_FIRE_TEAM_PHYSIOLOGICAL_HUD_PATCH

Browser 1300 is the release baseline. Browser 1403 implements Tactical Casualty Care Phase 3A: authoritative Skyranger recovery, recovered-versus-abandoned mission aftermath, and the roadmap fire-team physiological HUD with a Mobile Adaptive show/hide button. Save format remains 4.

## Extraction and aftermath authority

- `tacticalExtractDraggedCasualtyAtSkyranger(...)` is the boarding authority. The conscious rescuer must occupy a player Skyranger's first ramp cell, retain a valid adjacent drag link, and carry a living downed casualty.
- A completed extraction sets `casualtyExtracted`, `casualtyRecovered`, `rescued`, rescuer/craft/round metadata, stops active bleeding, clears both drag fields, and removes the casualty from render/path occupancy.
- Manual ramp-side attachment and manual drag movement both call the same helper. `tacticalAiCasualtyExtractionStep(...)` uses the existing attach/per-hex TU costs and hazard-aware route authority; it does not inspect hidden alien positions.
- `tacticalApplyCasualtyExtractionAftermath(...)` owns final recovery. Victory recovers living downed soldiers. Defeat/withdrawal saves physically extracted casualties and records unextracted downed personnel as KIA/unrecovered.
- `finishTacticalMission(...)` receives the final battlefield units. Terminal Simulation/Hybrid playback commits the last frame before aftermath; `resolveMission(...)` applies the same outcome to Classic/direct simulation.

## Physiological HUD

- `TacticalFireTeamPhysiologicalHud` groups all AEGIS soldiers by fire team and arranges up to four members in the roadmap diamond.
- Trace color derives from authoritative HP/incapacity. Trace duration derives from fear pressure/state, and KIA is a flatline. Status text includes medical, fear, extraction, and death states.
- Standard layout keeps the bottom-edge monitor visible. Mobile Adaptive uses the left-rail `Team Vitals` / `Hide Vitals` button; `mobilePhysioHudOpen` persists in the live mission cache.

## Preserve

- Save format 4 and optional-field loading.
- Browser 1300 terminal Hybrid precedence/final-frame commit.
- Phase 1/2 downing, bleeding, stabilization, Field Medkit, and triage rules.
- Existing Beacon, mobile, PWA, building, vehicle, horizon, and renderer authority.
- One active `finishAiPlayback()` definition and one mutable current patch-history record.

## Field gates

1. Extract a downed casualty by dragging onto the Skyranger ramp, then repeat by attaching while already standing on the ramp.
2. Withdraw with one extracted and one unextracted downed casualty; verify the former survives and the latter is KIA/unrecovered.
3. Win with a living unextracted downed soldier and verify recovery.
4. Observe AI extraction TU spending and confirm panic/hidden information constraints.
5. Inspect all health/fear/medical trace states in Standard and Mobile Adaptive; close/reopen Team Vitals and restore the live mission.
6. Repeat Browser 1300 terminal Hybrid, Phase 1/2 casualty, PWA update/cold-start, and representative tactical presentation gates.

---

# Previous handoff — v0.26.09.12.1300_BUILD_AUDIT_AND_TERMINAL_PLAYBACK_INTEGRITY_PATCH

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
