# Browser 0044 — Tactical Wall Authority + Halloween Map Visibility Validation

Build: `v0.26.10.02.0044_TACTICAL_WALL_AUTHORITY_AND_HALLOWEEN_MAP_VISIBILITY_HOTFIX`

Save format: **4**

## Field issues addressed

1. A soldier was observed moving through a wall segment that the Three.js renderer displayed as solid. The discovered-building shell/seam repairs could visually close a missing perimeter segment without restoring a matching authoritative structural cover in old/partial battlefield state.
2. Halloween tactical-map decorations were not visible on a live October mission. Browser 0042 seeded them only near ordinary procedural buildings and required each decoration hex to satisfy its own reveal/visibility condition.

## Wall authority fix

- `tacticalRestoreMissingBuildingPerimeterAuthority()` audits procedural building perimeter cells against `tacticalBuildingCovers(mission)`.
- A genuinely missing non-door wall/window is restored as real hard structural cover, so pathfinding, movement commit, LOS/cover authority and presentation agree.
- Existing `breach`, `breach-rubble`, `breached`, or destroyed structural state prevents restoration; legitimate openings stay open.
- `tacticalThreeBuildingPresentationCovers()` no longer paints a pristine solid shell over an authoritative breach. It renders the opening presentation instead.
- The audit is applied to newly generated battlefields, streamed Simulation continuation, and the actual `coversState` restored from loaded tactical saves. This prevents an old save from retaining the visual-only wall/pathing mismatch after load.

## Halloween map visibility fix

- Every October mission type receives seasonal presentation props; alien-base/open-terrain missions are no longer excluded.
- Procedural buildings receive multiple nearby seasonal candidates. Once a building is discovered, its Halloween decorations render with it rather than waiting for the decoration cell to be independently revealed.
- `tacticalDeployment()` adds a small guaranteed revealed landing-zone cluster around AEGIS deployment on every October map, ensuring visible Halloween dressing even when no ordinary buildings exist. Loaded October tactical saves are also normalized through the same seasonal cover preparation path, and the decoration pass is idempotent so reopening a save does not stack duplicate seasonal props.
- The map catalog includes pumpkins, webs, bats and ghosts. All remain `block:0`, `presentationOnly:true`, and never affect movement, LOS, cover, occupancy or objectives.

## Automated coverage

Run `node tools/test-wall-halloween-map-0044.cjs`, then the inherited Browser 0038–0043 focused suites. Current focused total: **75/75**. All five executable runtime JavaScript blocks and `service-worker.js` must also pass `node --check`.

## Field acceptance

- Revisit a procedural building with previously suspicious facade seams. No living unit should cross a visually intact wall/window cell. Doors and actual breach-rubble openings must remain traversable.
- During October, start several mission types (urban, rural/open terrain, crash site, alien-base if available). Halloween props should be immediately visible near deployment, and additional dressing should appear around discovered buildings.
- Confirm every seasonal prop remains non-blocking and does not alter targeting, pathing, LOS, cover or mission outcome.
