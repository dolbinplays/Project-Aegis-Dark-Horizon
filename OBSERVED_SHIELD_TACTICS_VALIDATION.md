# Observation-Driven Shield Tactics

Build: `v0.26.09.28.0008_OBSERVATION_DRIVEN_SHIELD_TACTICS_PATCH`

Save format: **4** (unchanged).

## Behavior

Observed shield interceptions now record the demonstrated blocked damage classes on the beacon. A ballistic observation does not automatically teach energy immunity. Unknown protection permits a probing shot. Observations include source identity, position and shield type, with compatibility for older records containing a last blocked damage class.

Normal AI, Hybrid, emergency recovery and reaction fire check learned protection before spending weapon ammunition/TU. Covered follow-up fire reevaluates after each attack. Target selection can skip a protected preferred target without changing the player's assignment. The existing grenade planner considers a single known-protected alien while retaining blast safety, range, LOS, charges and TU checks. Combat movement can favor legal inside-field positions instead of maintaining ineffective ranged standoff; normal movement authority and formation pacing still apply. When no useful shot is available, the AI can hold fire with an explanation.

Shield destruction, disablement, source replacement, type/position changes and units crossing the field boundary are reevaluated without a permanent target blacklist. Unobserved enemy interceptions do not create observations. Frame and continuation cover records retain the learned classes. Manual firing remains player-controlled; no inventory or rifle-swapping system was added.

## Automated validation

**53 tests passed** across:

- `tools/test-observed-shield-tactics.cjs` — 10 tests, including a real streamed covered-fire round, persisted observation/frame state, normal/Hybrid holds, injected planner failure exercising emergency recovery, reaction-fire costs, unknown protection, source invalidation, kinetic/combined classes, grenades and friendly safety, and legal approach movement.
- `tools/test-night-shot-presentation.cjs`
- `tools/test-stand-before-movement.cjs`
- `tools/test-beacon-immunity-rings.cjs`
- `tools/test-principal-rescue.cjs`
- `tools/test-vip-rescue-commitment-priority-lock.cjs`
- `tools/test-default-ai-global-contact-and-vip-priority.cjs`
- `tools/test-ai-command-stream-handoff.cjs`

Packaging and build-seam checks pass. Embedded JavaScript syntax and whitespace checks pass. The generated `index.html`, runtime manifest, release metadata and service-worker cache identify Browser 0008.

A fresh headless Edge session loaded the packaged launcher and embedded title screen, displayed Browser 0008, and reported no page errors. Screenshot: `E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance/launch-0008.png`. This was a launch smoke check, not an installed-game battle test.

## Field acceptance

Installed-game acceptance remains pending: observe ballistic and energy interceptions, check alternate targeting and grenade safety, approach a field from obstructed terrain, then save/reload and repeat after beacon destruction. Confirm the hold-fire explanation and all tactical camera views during playback. Automated testing does not establish GPU performance or cover every generated map/formation combination.

The TPV floating-background-scenery item remains planned for a separate patch.
