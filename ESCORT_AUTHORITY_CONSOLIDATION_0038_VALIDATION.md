# Escort Authority Consolidation + Regression Hardening — Browser 0038

Build: `v0.26.10.01.0038_ESCORT_AUTHORITY_CONSOLIDATION_AND_REGRESSION_HARDENING_PATCH`  
Save format: **4**

## Purpose

Browsers 0035–0037 fixed three field-observed escort failures, but several subsystems still derived “active escort” independently. Browser 0038 makes one actor-level helper authoritative so scheduling, objective priority, formation, combat interruption and HUD state cannot disagree about the same physical escort owner.

## Authority changes

- `tacticalEscortFollowers(...)` remains the physical follower query and deliberately ignores `revealed` state.
- `tacticalEscortOwnerState(...)` is the canonical actor-level ownership result. A living AEGIS soldier is an active escort owner whenever one or more living, conscious, unrescued civilians/VIPs still carry that soldier's `escortId`.
- `tacticalActiveEscortOwnerIds(...)` supplies actionable Priority-2 escort actors while respecting Priority-1 medical reservation, fear override and explicit Hybrid player ownership.
- The compatibility helper `tacticalEscortLeaderLockState(...)` now consumes actor-level ownership. It no longer requires the escort owner to be the formal fire-team leader.
- `tacticalAiRescueActorOrder(...)` schedules every physical escort owner independently before new rescue leaders.
- `tacticalFireTeamFormationTargets(...)` omits any nonleader member who owns a separate civilian/VIP column.
- The two combat-contact retention paths use actor ownership before applying support break-off doctrine.
- `tacticalThreeStatusConditions(...)` receives the actual unit list and uses the shared ownership helper for the ESC status.
- `window.__AEGIS_ESCORT_AUTHORITY_DIAGNOSTICS` is refreshed at Priority-2 scheduling and contains owner ID/name, fire-team ID, follower IDs/count, hidden-follower count, eligibility and blocking reason.

## Focused executable fixture

`test-escort-authority-0038.cjs` extracts the exact patched helper functions from the runtime and passed **8/8** checks:

1. Three hidden VIP followers remain authoritative for one owner.
2. Two support-position escort owners in one fire team are both active.
3. Both same-team owners are scheduled independently.
4. A support-position escort owner resolves Priority 2 ahead of visible alien contact.
5. Automatic fire-team formation targeting excludes both escort owners.
6. FPV/TPV status shows ESC from the real unit list.
7. The compatibility owner-lock recognizes a support-position owner as the actor lock.
8. Developer diagnostics report the three hidden followers without requiring visibility flags.

## Release checks

- All **5** executable embedded runtime JavaScript blocks pass `node --check`.
- Host build identity and embedded runtime build identity are synchronized to Browser 0038.
- Embedded runtime bytes and SHA-256 metadata are regenerated from the exact patched runtime.
- Historical in-game patch history freezes Browser 0034 to its explicit build ID and restores 0035, 0036 and 0037 entries before the new 0038 entry.
- Save format remains **4**.

## Manual field acceptance

Use a mission with multiple established VIP/civilian escorts, preferably including the recent failure pattern: a support-position soldier owns several VIPs while aliens remain visible and the rest of the fire team is scattered. Verify that the owner keeps **PRIORITY 2 — ACTIVE ESCORT**, advances the column toward extraction, is not moved by another soldier's formation target, and survives save/reload and Skyranger boarding. Also test two escort owners in one fire team and a frightened/hidden follower.
