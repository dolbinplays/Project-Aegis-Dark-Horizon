# Sickbay bed capacity authority

Build: v0.26.09.25.0008_SICKBAY_BED_CAPACITY_AUTHORITY_HOTFIX

Save format: 4

## Report reproduced in source

The supplied screenshot showed Fort Aegis at **Beds (8/4)**. Source review confirmed that the UI was faithfully counting eight `Wounded` soldiers at the selected base while the selected-base capacity was four. The defect was therefore authoritative state, not just a label/rendering error.

## Root cause

Mission aftermath initialized occupancy from the selected base but compared new wounds against campaign-wide `sickbayCapacity`. Daily/fast-forward refill also rebalanced against campaign-wide capacity. `rebalanceSickbayBeds` could fill free beds but did not demote an already over-cap set of full-speed patients.

## Fix

- Added base-local Sickbay capacity authority (4 beds per Sickbay facility).
- Added deterministic over-cap repair that preserves existing occupants first and moves only excess patients to `Overflow Nd`.
- Mission aftermath now enforces capacity after all survivor states are known and preserves pre-mission bed occupants.
- Daily, skip-time and end-month refill use each patient's stationed base.
- A live React effect repairs over-cap legacy/current state and capacity reductions without auto-admitting deliberate Barracks moves.
- Mission report overflow wording no longer cites a misleading campaign-wide bed count.

## Automated / static validation

- Built-in Build Health adds a two-base regression: a 4-bed base with five wounded is capped at four while an 8-bed base with five wounded keeps all five.
- Existing numeric Sickbay refill self-test remains compatible.
- Embedded runtime syntax, payload hash/byte metadata, service worker syntax, release metadata and whitespace/package checks were run on the repackaged build.

## Live acceptance requested

1. Load the affected campaign. Fort Aegis should repair from 8/4 to 4/4 Beds, with four excess soldiers in Barracks recovery.
2. Advance one day and verify only genuinely free Fort Aegis beds refill from Fort Aegis Barracks.
3. Return more wounded soldiers from a mission while all four beds are full; existing patients should retain beds and new excess casualties should enter Barracks.
4. If multiple bases exist, verify beds do not pool across bases.
5. Save/reload and confirm the repaired assignment persists.
