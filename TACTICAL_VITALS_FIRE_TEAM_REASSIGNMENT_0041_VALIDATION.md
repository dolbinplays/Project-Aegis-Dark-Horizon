# Browser 0041 — Tactical Vitals Fire-Team Drag Reassignment Validation

Build: `v0.26.10.02.0041_TACTICAL_VITALS_FIRE_TEAM_DRAG_REASSIGNMENT_PATCH`  
Save format: **4**

## Scope

Browser 0041 adds direct commander fire-team reassignment from the tactical Vitals strip and widens the fire-team panels so their complete labels remain readable. The drag transaction uses existing fire-team authority and deliberately separates **actor-owned duties** from **team-owned orders**.

## Authoritative behavior

- A living, conscious, non-extracted AEGIS soldier may be dragged from one active fire team to another during the human phase when no AI playback/battle-resolution/unit-movement lock is active.
- The destination team may contain no more than four active members. The final active member of a source team cannot be removed.
- Source/destination leadership, roles, commander references and formation-slot metadata are reconciled immediately after the move.
- Physical civilian/VIP escort ownership and casualty-response/drag ownership remain actor-owned and follow the reassigned soldier.
- Patrol Route, Fallback Post, Check Location, explicit Beacon/VIP assignment, VIP Priority Lock planning state and other command/objective state remain team-owned. The source team retains its state and the moved actor adopts the destination team's team-owned state.
- The first manual roster edit marks the tactical AEGIS roster commander-managed for the remainder of the battle. Automatic casualty-driven membership rebalancing is suppressed, but deterministic leadership succession continues.
- Vitals labels show the full `<Designation> Fire Team Vitals` form; legal destinations highlight while dragging.
- `fireTeamRosterManual` is preserved in streamed tactical snapshots/save state. Save format remains 4.

## Automated validation

`tools/test-tactical-vitals-fire-team-reassignment-0041.cjs` passes **12/12** focused checks covering valid reassignment, roster lock, source patrol ownership, destination-objective adoption, physical escort continuity, deterministic leadership/role reconciliation, destination capacity, non-empty source protection, Vitals drag/drop wiring, full-label layout, and persistence hooks.

Inherited recent regression suites also remain green:

- `tools/test-escort-authority-0038.cjs` — **8/8**
- `tools/test-escort-breach-standing-order-0039.cjs` — **9/9**
- `tools/test-civilian-objective-standing-order-0040.cjs` — **10/10**

Release hardening additionally requires all executable embedded runtime JavaScript blocks and `service-worker.js` to pass syntax validation, exact canonical-runtime/embedded-payload byte identity, matching release byte/SHA metadata, and ZIP integrity.

## Installed-game field acceptance

1. Drag an ordinary soldier from Alpha to Bravo; verify both Vitals panels, formation placement and current HUD reflect the new team immediately.
2. Drag Alpha's current leader; verify Alpha receives a legal replacement and the moved soldier receives the correct role inside Bravo.
3. Drag a soldier who already owns escorted VIPs/civilians; verify the evacuees keep following that soldier and extraction continues.
4. Drag a soldier participating in casualty recovery/dragging; verify the actor-owned casualty responsibility is not silently discarded.
5. Give Alpha a Patrol/Fallback/Check standing order or explicit Beacon/VIP assignment, then move one Alpha member to Bravo; verify the order remains with Alpha and is not carried into Bravo.
6. Give Bravo a different objective and drag a soldier into Bravo; verify the moved soldier adopts Bravo's team-owned objective state.
7. Attempt to overfill a four-person destination and to remove the last active member of a source team; both must reject without partial state mutation.
8. Save/reload after custom reassignment and confirm membership remains unchanged even after subsequent reconciliation/casualties.
9. Repeat the drag on a touch-capable device and confirm a deliberate drag does not break ordinary tap-to-select behavior.

Installed-game acceptance remains pending.
