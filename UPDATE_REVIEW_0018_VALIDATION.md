# September 29 update review — Browser 0018

Reviewed changes since `9dc6df8` (Browser 0010) through `dbd758d` (Browser 0017). Fetch confirmed local main matched origin/main before editing. No existing uncommitted work was present.

## Confirmed fixes

- Cooperative planning held `TACTICAL_AI_FAST_HANDOFF_ACTIVE` across an await. UI work could inherit the temporary limit, and overlapping planners could restore each other's flags incorrectly. The flag now applies only while advancing/closing a generator and is restored before yielding control.
- Cancellation was checked after generator advancement, allowing cancelled work to start or run another segment after an await. It is now checked before and after advancement; cancellation and checkpoint errors close the generator.
- TPV clearance ignored very close hits and clamped the recovered camera to a minimum 0.62 distance, which could place it beyond the obstruction. Recovery now stays before the actual intersection, including close walls.
- TPV occluder collection included visible mesh children of invisible parents. It now traverses visible hierarchy only.
- Elevated TPV side recovery used total 3D camera distance as horizontal radius, pushing the camera outward. It now preserves the horizontal radius and consistently applies candidate scoring.
- Source manifest build fields still identified Browser 0010 after the later pushes. Synchronized all three fields and regenerated the launcher with matching source hashes and cache version.

## Verification

49 focused checks passed across eight suites: update-review (6), cooperative planning (5), TPV/shield/roof parity (8), default AI priorities (6), forced entry (6), VIP/window concealment (6), shot-impact sequencing (6), Beacon pre-impact hold (6).

The new tests exercise interleaved planners, cancellation before start and after yielding, checkpoint failure cleanup, actual Three.js ray intersections against nearby walls, invisible parent groups and elevated orbit geometry. Existing cooperative tests verify synchronous/cooperative deterministic equivalence.

Packaging and build consistency checks pass. Save format remains 4. No priority, shelter, combat damage or mission-outcome rule changes are intended. Full repository tests and installed-game visual acceptance remain outside this focused review.
