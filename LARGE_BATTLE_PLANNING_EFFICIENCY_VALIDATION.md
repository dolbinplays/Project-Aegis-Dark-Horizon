# Large-Battle Planning Efficiency

Build: `v0.26.09.28.0010_LARGE_BATTLE_PLANNING_EFFICIENCY_PATCH`

Save format: **4** (unchanged).

## Changes

- Contact checks, fear perception, movement candidate scoring and playback snapshots share visibility context within a single synchronous calculation instead of rebuilding it for each observer/target pair.
- Escort formation and route scoring use fresh per-calculation fire/smoke indexes. These indexes are not retained between actions and do not depend on the existing round cache, preserving in-place ignition and destruction changes.
- Hex-distance calculations avoid allocating two temporary cube-coordinate objects and retain the same arithmetic.
- Corrected the roadmap entry that still described the September 22 incident VIP-count patch as unimplemented.

No tactical priorities, movement costs, visibility rules, mission outcomes or save schema were intentionally changed.

## Performance evidence

The existing real streamed-battle fixture uses 48 soldiers, 6 VIPs, 8 aliens and 378 covers. Initial non-profiled runs measured:

| Round | Browser 0009 baseline | Optimized runtime |
| --- | ---: | ---: |
| 1 | 35.43 s | 16.85 s |
| 2 | 53.21 s | 15.90 s |
| 3 | 54.25 s | 16.68 s |

Both produced 38/50/49 frames and retained 62 unit records. These are indicative single-run planning timings on this machine, not GPU FPS measurements. Investigation of differing full-state hashes found that the original profiler seeded Math.random but not crypto.randomUUID, allowing soldier identity and specialization differences. Consequently these timings are not presented as an exact identical-input benchmark. The profiler now uses deterministic UUIDs as well, supports a reference runtime through `AEGIS_PROFILE_RUNTIME`, limits rounds with `AEGIS_PROFILE_ROUNDS`, and optionally dumps comparison data through `AEGIS_PROFILE_OUTPUT_DIR`.

## Regression coverage

**76 tests passed** across planning query reuse, hazard queries, visibility memoization, solid-wall sight, night-shot presentation, standing before movement, VIP escort routing, observed shield tactics, principal rescue, optional soldier recovery and civilian emergency aid.

Six new tests cover sight equivalence after in-place door/smoke/flashlight/flare changes, fear perception, indexed hazard equivalence, ignition inside an existing AI round context, bounded context construction during movement scoring, and 5,000 hex-distance comparisons against the original cube arithmetic.

Packaging, build-seam and embedded JavaScript syntax checks pass. Full repository tests were not run. Installed-game acceptance remains pending. Planning rounds still take seconds; further optimization or asynchronous planning remains follow-up work.

Benchmark profiles, dumps and launch artifacts are stored on E: under `E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance/`.
