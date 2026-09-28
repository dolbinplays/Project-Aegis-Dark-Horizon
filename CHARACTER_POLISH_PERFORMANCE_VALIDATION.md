# Character polish and animation performance — September 28 Browser 0006

## Fixes

Walk cleanup previously passed civilianFearCover into the soldier pose selector, which silently selected standing. Cleanup now uses the civilian presentation authority, retaining cover-kneeling, frightened flags and the next walk pose. Regression covers dress and pantsuit rigs.

Browser model previews showed scalp poking through the VIP hair cap crown. Increased cap height covers the existing head sphere. A real Three.js downward raycast verifies coverage for short, swept, bob and bun styles.

The walk loop previously constructed all ten pose definitions for every articulated character every frame, including idle units. It now checks walking first; pose specifications are cached by normalized pose name and frozen, including their arrays. All current callers were inspected and only read these specifications. Existing animation timing and joint formulas are retained.

## CPU benchmark

Command: node tools/benchmark-character-animation.cjs. Set AEGIS_BENCH_SOURCE to an alternate canonical runtime HTML for a baseline run. Fixture: 48 mid-detail soldiers and 12 VIPs with real Three.js joints, 100 warm-up frames, then nine batches of 300 frames. Weapon/base geometry stubs are adequate for this animation-only benchmark; no renderer, AI planning, terrain or GPU work is timed.

| Moving characters | Before median ms/frame | After median ms/frame |
| --- | ---: | ---: |
| 0 | 0.2122 | 0.0222 |
| 12 | 0.2822 | 0.0845 |
| 60 | 0.5441 | 0.4561 |

Timing is machine-dependent. This is not a total frame-rate claim or a complete two-Skyranger mission benchmark.

## Visual verification

Rendered actual runtime VIP full/mid models with bundled Three.js in headless Edge WebGL (software rendering). Inspected walking, alternate stride, fear-cover kneeling and fallen views of dress/pantsuit and bob/bun/swept variants. Screenshots and runnable fixture are in E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance. Hair crown defect corrected after inspection. The dress remains a stylized split-panel silhouette.

This isolated fixture does not establish complete installed-game acceptance. Live boarding, all soldier weapons/armor, roof cutaways, night lighting, all gameplay cameras, total GPU frame time and AI playback stalls remain unverified. No broad clipping-free or FPS claim is made.

## Automated coverage

Four new tests cover immutable cached poses, the walking-to-cover-kneeling transition, idle lookup elimination/unchanged gait equations, and crown coverage. Existing wardrobe and soldier-identity regressions are included. Save format remains 4. Full repository suite not rerun.

Results: all 42 targeted tests passed. Runtime packaging, build seam, embedded JavaScript syntax and whitespace checks passed.
