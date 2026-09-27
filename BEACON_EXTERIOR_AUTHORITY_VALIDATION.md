# Unified Exterior Beacon Placement — Browser 0015

Build: v0.26.09.26.0015_UNIFIED_EXTERIOR_BEACON_PLACEMENT_PATCH
Save format: 4

## Fix
The effective multi-transport tacticalDeployment override still used the old center-only placement and deleted surrounding cover. It now uses the shared exterior seven-cell authority without that cover deletion. Initial and replacement placement and UFO landing/handoff reject building interiors, including passable floors, and blocked center/ring cells.

Saved active interior beacons move to a deterministic nearest legal exterior footprint during tactical save restoration. Matching deployment/playback cover copies and reinforcement beacon/rally references move together. Identity, health, shield data, visibility and reinforcement deadlines remain intact. If no legal site exists, existing saved data remains intact; repair is attempted again on a later restore. New placements defer when blocked.

Nearest-cell searches now sort candidates before checking blockers and stop on the first valid site instead of checking every site.

## Automated validation
- tools/test-beacon-exterior-authority.cjs: 5/5 passing. Covers the effective deployment across 12 generated missions, saved interior relocation and playback state, adjacent-cell UFO handoff blocking/retry, replacement wave progression, empty building interiors and no legal placement.
- Eight UFO/recent-review suites: 35/35 passing. Covers handoff, center reservation, landing, disembarkation, observation memory, source isolation, snapshot isolation and prior flight/medical review fixes.
- Existing handoff fixtures now represent units having left the reserved ring. A separate new test asserts that occupied adjacent cells defer planting.
- Release build seam, embedded JavaScript syntax and git whitespace checks passed.
- Full repository suite was not rerun; the previous review recorded unrelated existing failures.

## Field acceptance still needed
Launch the updated installed game. Reload an affected indoor-beacon mission, then check a new urban mission and an observed UFO delivery. Confirm the beacon and its six adjacent cells remain outside dwellings and other buildings. Verify save/reload before and after a replacement/handoff and confirm no duplicate source or wave reset. Dense authored office, market and irregular layouts still need visual field coverage.
