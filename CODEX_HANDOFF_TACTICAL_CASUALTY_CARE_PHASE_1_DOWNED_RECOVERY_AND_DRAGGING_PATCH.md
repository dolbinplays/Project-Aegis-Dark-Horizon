# CODEX HANDOFF — v0.26.09.11.2248_TACTICAL_CASUALTY_CARE_PHASE_1_DOWNED_RECOVERY_AND_DRAGGING_PATCH

Browser 2058 is the release baseline. Browser 2248 adds Tactical Casualty Care Phase 1: recoverable downed/unconscious AEGIS soldiers, physical casualty dragging, and one bounded visibility-safe AI emergency pull. Save format remains 4.

## Casualty state authority
- `tacticalResolveHumanCasualtyHit(...)` is now the shared human-hit casualty boundary for the integrated alien-fire paths. A non-catastrophic lethal wound may produce an alive 1-HP downed/unconscious/prone soldier with 0 TU; sufficiently catastrophic overkill remains KIA (`hp:0`, `alive:false`).
- `tacticalHumanIsDowned(...)` identifies medically alive but incapacitated AEGIS soldiers. `tacticalHumanCombatActive(...)` is the action/observer predicate for conscious combatants. Do not replace these with ad-hoc `hp > 0` tests in action/LOS authority.
- Downed soldiers do not act, fire, self-treat, lead/command, satisfy rescue actor ordering, or contribute tactical LOS. They remain medical survivors for aftermath/extraction authority unless a later rule explicitly changes that outcome.

## Dragging
- Manual attach/release goes through `tacticalCasualtyToggleDragResult(...)`. Attach costs 8 TU.
- Drag movement costs 8 TU per hex and calls `tacticalAdvanceDraggedCasualty(...)`; the casualty occupies the rescuer's prior hex. Do not teleport the casualty to the rescuer's destination.
- `tacticalReleaseInvalidCasualtyDrags(...)` is the repair boundary for stale/broken reciprocal links.
- Presentation remains derived from authoritative unit coordinates. Downed humans use the prone-alive articulated pose; Tactical Status exposes DWN / DRG.

## AI recovery boundary
- `tacticalAiCasualtyRecoveryStep(...)` may perform one emergency pull only from threats present in `tacticalVisibleCellSet(...)` for surviving active humans. Do not pass hidden alien knowledge into this helper.
- It is a bounded reposition, not full treatment/triage authority. Phase 2 owns stabilization, bleeding, targeted field treatment, Medic treatment logic, and deeper casualty prioritization.

## Mission terminal authority
- `tacticalMissionTerminalState(...)` intentionally changed in Browser 2248. It now reports surviving (`livingHumanCount`), combat-active (`activeHumanCount`), and downed (`downedHumanCount`) humans separately.
- Victory/primary-secured requires at least one combat-active AEGIS soldier. `squadWiped` means there are zero combat-active soldiers, preventing an all-downed mission from hanging forever.
- `resolveMission(...)` intentionally changed to stop the tactical loop when there are no combat-active humans. Do not revert these changes to Browser 2058 merely to recover byte parity.

## Snapshot/save
- Tactical snapshots may carry `downed`, `unconscious`, `downedRound`, `downedById`, `downedReason`, `draggedById`, `draggingCasualtyId`, and prone state.
- Save format remains **4**. Do not bump it for these optional tactical fields unless a future migration genuinely requires it.

## Preserve
The following unrelated authorities should remain byte-for-byte Browser 2058 unless a future targeted patch changes them:
- `tacticalAlienReinforcementArrival(...)`
- `tacticalBuildingPlans(...)`
- `tacticalBuildingCovers(...)`
- `makeBattlefield(...)`

Also preserve Browser 2058 Beacon arrival cinematics, Browser 2015 materialization, Browser 1800 field-accepted `release-beacon-navigation-v2` / `aegis-launch-shell-v2` PWA architecture, Browser 1740 Mobile Tactical Status HUD collapse/expand, Browser 1610 building perimeter seams, Browser 1254 horizon treatment, exactly one `finishAiPlayback()` definition, and save format 4.

## Field gates
1. Recoverable lethal hit -> downed/unconscious at 1 HP; catastrophic overkill -> KIA.
2. Manual attach/release and several drag steps -> casualty trails rescuer's previous cells and documented TU is spent.
3. 3D Iso / FPV / TPV -> prone casualty follows correctly and DWN / DRG are visible.
4. Simulation AI -> visible nearby threat may cause one emergency pull; hidden threat must not.
5. All-down -> tactical defeat resolves; one active soldier + downed survivors -> mission can continue.
6. Recheck Beacon cinematic/materialization, Android PWA single-launch update/cold start, Mobile HUD, building seams, and save/load.
