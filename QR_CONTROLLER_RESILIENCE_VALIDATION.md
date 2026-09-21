# QR pairing and controller resilience — validation

Build: `v0.26.09.20.0002_QR_PAIRING_AND_CONTROLLER_RESILIENCE_PATCH`

Save format remains 4. Changes are local and have not been deployed by the agent.

## Implemented

- Local QR generation on the TV, fragment-based code transfer, automatic phone
  pairing, history cleanup, manual fallback and QR rotation with the pairing ID.
- TV-issued expiring input leases discard commands queued during stalls.
  Fresh heartbeat recovery, backpressure checks, pointer-release bypass and
  preservation of healthy direct channels during signaling errors.
- TV Lite pauses drawing while hidden or behind the pairing overlay, keeps only
  the latest pending frame, and handles fractional display timestamps at 30 FPS.
- Enter honors handled key events; disabled controls do not activate; taps send
  pending pointer motion before clicking.
- Restored the real streamed-AI test harness's building-layout dependency and
  replaced obsolete fixed-build assertions in active AI tests with manifest checks.

## Results

- 33 focused TV/QR/controller/rendering checks pass.
- Application smoke test executes Start → Save/Load → Start → New Game Setup with
  persistent hook state. Hook order and the self-test runner remain stable. This
  is a headless component test, not browser/DOM or visual validation.
- Both real streamed AI planning/continuation scenarios pass.
- Six independent QR round trips pass using `qrcode-generator` 2.0.4 for encoding
  and `jsQR` 1.4.0 for decoding generated RGBA matrices. Tested root, project
  subdirectory and escaped-space URLs at two module scales. The decoder was used
  from a verified temporary package; it is not shipped in the game.
- Build identity, embedded JavaScript syntax, source/payload packaging and diff
  whitespace checks pass.

Full repository test sweep:

| Run | Checks | Passed | Failed |
| --- | ---: | ---: | ---: |
| Before this patch | 363 | 323 | 40 |
| After this patch | 377 | 342 | 35 |

All remaining failing test names also failed in the baseline; no new failing test
names appeared. The suite is **not fully green**. Remaining failures are in older
editor/library tests, including fixed historical build/launcher expectations,
absent historical fixtures, missing timer mocks, and legacy geometry/visual-key
assumptions. They were not suppressed or marked as skipped. Historical fidelity
assertions still need individual review before being rewritten or retired.

## Reproduce focused coverage

```powershell
node --test tools/test-tv-phone-controller.cjs tools/test-tv-lite.cjs
node --test tools/test-ai-command-stream-handoff.cjs
node --test tools/test-default-ai-central-objective-authority.cjs tools/test-default-ai-global-contact-and-vip-priority.cjs
node tools/check-aegis-build.cjs
node tools/check-embedded-js.cjs
```

For the full sweep (includes the known older failures):

```powershell
$aegisTests = @(rg --files tools -g 'test-*.cjs')
node --test --test-concurrency=4 @aegisTests
```

## Pending acceptance

Browser automation could not initialize (`failed to write kernel assets`). No
live browser or physical Fire Stick compatibility/performance claim is made for
this patch. Follow the physical-device steps in `TV_PHONE_CONTROLLER_SETUP.md`,
including a real phone-camera scan, complete mission, menus, save/load, sleep/wake,
and code rotation. Reload both TV and phone pages to upgrade to protocol 2.
