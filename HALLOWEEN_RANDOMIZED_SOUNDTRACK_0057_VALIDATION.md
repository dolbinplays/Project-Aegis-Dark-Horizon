# Halloween Randomized Soundtrack Bank — 0057

Build: `v0.26.10.05.0057.1_HALLOWEEN_AUDIO_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Halloween music is presentation-only and active only during the calendar month of October through the existing seasonal-event date authority.
- The player's Original / Dark Horizon preference remains stored; Halloween temporarily overlays both banks rather than replacing the preference.
- Each of the 15 normal music contexts has exactly two Halloween MP3s and uses randomized no-immediate-repeat ordering.
- Mission music retains the existing `Contact in the Dark` search/contact segment contract and crossfade behavior.
- October victory uses eight Halloween Operation Vindicator tracks, with terminal-victory authority unchanged.
- Outside October, existing Original / Dark Horizon music routing is unchanged.
- Save format remains 4.

## Packaged assets
- Normal context tracks: 30 MP3s.
- Victory tracks: 8 MP3s.
- Total: 38 distinct MP3 files.
- Assets remain external under `assets/audio/halloween/`; they are not embedded into `index.html`.
- The service worker does not pre-cache the full 162 MB seasonal bank during installation; successfully fetched audio may use the existing runtime cache path.

## Automated checks performed during packaging
- Runtime payload decodes and matches `src/browser-runtime.html` exactly.
- Runtime SHA-256 matches release metadata.
- `index.html` embedded JavaScript parses.
- `service-worker.js` parses.
- All 38 expected Halloween MP3 paths exist in the package and have unique SHA-256 hashes.
- Every normal music context maps to two seasonal URLs.
- Halloween victory catalog contains eight unique IDs/URLs.
- No-immediate-repeat helpers reject the immediately previous first choice when alternatives exist.
- Halloween mission URLs are recognized by the same visibility-reactive segment code used by Dark Horizon `Contact in the Dark`.
- Save format remains 4.

## Field acceptance
1. During October, enter Start, Menu and each command tab several times; verify seasonal music is used and alternates vary without immediate repeats.
2. Change Original / Dark Horizon while Halloween is active; confirm seasonal playback remains, then test outside October and confirm the chosen normal bank resumes.
3. Start a tactical mission with no visible alien: verify the chosen Halloween mission cue loops inside 0:00–0:36. Gain current LOS to an alien: verify a 1.4-second crossfade into 0:37–1:00 of the same cue. Lose LOS and verify return to search.
4. Win several missions and verify the Halloween victory bank can select across all eight cues without an immediate repeat.
5. Trigger a Beacon reinforcement commit boundary and verify victory music still cannot start early.
6. Set Music Off / volume 0 and confirm seasonal tracks obey those controls.
7. Test installed/PWA playback with network available, then replay already-fetched seasonal tracks while offline.

## Review hotfix — 0057.1
- Restore 0056.1 authoring safeguards unintentionally reverted by the soundtrack patch: validation, serialized saves, explicit attachment removal, shared preview/runtime attachments and GPU cleanup. Restore shared runtime imports/offline caching and previous patch-note history.
- Preserve underlying soundtrack identity through Halloween mission crossfades and failed-playback recovery, avoiding Original-selection restarts.
- Ignore obsolete media play-promise completions when updating no-repeat history.
- Synchronize source manifest and release build metadata. User-supplied MP3 assets remain unchanged.

## Reviewed package results
- **79/79 mandatory release tests passed**.
- Four new executable tests cover all 38 external asset paths, October routing, normal-bank fallback, per-context nonrepeat ordering, same-take crossfade continuity, failure recovery and stale playback completions.
- Unified editor/attachment regressions pass again after restoring the reverted fixes.
- Embedded script syntax: PASS (11 non-empty blocks across 6 HTML files).
- Build seam and embedded runtime/source parity: PASS.
- Runtime SHA-256: `d44e334e397ea442f82822b128e5a1028d3a58f536e7f8d607e1152b611040ff`.
- Save format remains 4.
- Actual audio decoding/listening, volume behavior and installed/offline playback acceptance remain pending; automated audio tests use media stubs to exercise the actual runtime functions.
