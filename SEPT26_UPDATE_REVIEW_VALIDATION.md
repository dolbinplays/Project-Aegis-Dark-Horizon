# September 26 update review

Build: v0.26.09.26.0014_UPDATE_REVIEW_AND_UFO_FLIGHT_LIFECYCLE_HOTFIX

Reviewed packaged changes since 5bd0986 (0007), covering Sickbay capacity, UFO flight presentation, beacon/building exclusion, facility demolition, Bandages/Medkit progression and last-known-contact clearance.

Confirmed fixes:
- Canonical browser-runtime.html and src/manifest.json still described 0007 while index.html shipped 0013. Recovered the embedded runtime after verifying its SHA-256 against release metadata, preserving all intervening changes. Source, manifest, payload and metadata are synchronized. Packaging now rejects an older source/manifest pair before any writes.
- Flight models used the ramp anchor, while stationary UFO models use the body center. Flight routes now preserve that model offset through touchdown/liftoff.
- Approach visibility clamped a touchdown-only sighting back to 92 percent and applied a different spatial curve from the sampled visibility route. Presentation now respects the full observed progress and follows the sampled spatial route without rewinding.
- Finished/replaced flight effects removed objects without disposing owned geometry. Shared cleanup now releases geometry, retains cached materials, restores static craft/masks/camera, and runs on runtime teardown as well.
- Medical test harnesses omitted new Bandage dependencies. Updated those harnesses; existing healing/stabilization behavior is preserved.

Verification:
- Three new real-Three.js regressions failed before the changes and pass afterward. Added replacement cleanup and Bandage stabilization/persistence coverage; all five review tests pass.
- Packaging suite passes 10/10, including stale-source rejection with zero writes.
- Full suite before fixes: 534 tests, 481 passed, 53 failed. Final full run: 539 tests, 499 passed, 40 failed, with no new failure names. The additional packaging guard test was added afterward and verified in its focused suite. Remaining failures are pre-existing; the suite is not wholly green.
- Build seam, embedded JavaScript syntax and payload checks pass. Host shell outside the payload/build string is identical to the incoming release.
- Logs are in E:/JoshGameProjects/GitHub/PADH GPT Files/sept26-review/.

Live installed-game visual verification remains pending. Save format stays 4. No commit or deployment performed.
