# Cooperative AI Planning Responsiveness

Build: `v0.26.09.28.0011_COOPERATIVE_AI_PLANNING_RESPONSIVENESS_PATCH`

Save format: **4** (unchanged).

## Purpose

Browser 0010 materially reduced repeated planning work but still generated a streamed Simulation AI round through one long synchronous resolver call. Browser 0011 keeps that resolver and its tactical doctrine authoritative while allowing the streamed Simulation AI caller to consume it cooperatively through safe generator checkpoints. The goal is responsiveness, not a claim of lower total CPU time or higher GPU FPS.

## Implementation

- `resolveMissionGenerator(...)` owns the existing tactical resolver body. `resolveMission(...)` exhausts it synchronously for existing callers.
- `resolveMissionCooperative(...)` consumes the same generator and yields through the established browser startup-yield path when a planning slice exceeds its bounded budget.
- Safe checkpoints occur between completed setup/round phases, completed soldier decisions, completed alien phases and bounded VIP/rescue planning boundaries. No yield is inserted in the middle of an individual movement/combat commit.
- `tacticalAiCivilianPriorityTurnGenerator(...)` exposes rescue-specific checkpoints at actor ordering, search/assignment/ingress stages and between fire-team actors. Its synchronous wrapper remains available to existing callers and preserves source-contract inspection.
- Only streamed Simulation AI uses the cooperative bounded-round path. Manual/Classic/Hybrid authority is not silently moved to a second resolver.
- Existing AI stream epoch/token cancellation is passed into cooperative planning. A stale in-progress stream throws `AEGIS_AI_COOPERATIVE_CANCELLED` at a safe checkpoint and cannot publish a newer command's future state.
- `window.__AEGIS_TACTICAL_AI_PERF__` retains prior counters and now records cooperative run/yield/cancellation data, active/wall planning time and maximum measured synchronous slice.

## Deterministic large-battle stress fixture

Fixture: **48 soldiers, 6 VIPs, 8 aliens, 378 covers**, one streamed tactical round, deterministic `Math.random` and UUID sequence.

| Runtime | Wall / planning measurement | Interface yields | Max measured synchronous slice | Frames | Units | Covers |
| --- | ---: | ---: | ---: | ---: | ---: | ---: |
| Browser 0010 matched baseline | 10.20 s wall / 10.06 s resolver | 0 inside resolver | ~10.06 s resolver task | 38 | 62 | 378 |
| Browser 0011 run A | 10.71 s wall / 10.49 s active | 35 | 1.39 s | 38 | 62 | 378 |
| Browser 0011 run B | 12.22 s wall / 11.97 s active | 36 | 0.99 s | 38 | 62 | 378 |

All three runs produced the exact same state fingerprint:

`df8a4b2c14a5b8dc6c851cf00ef618a8ab9a88ba5c37c99ca4537da4a8bf6ebe`

These Node timings are indicative and machine/run dependent. The responsiveness result is the segmentation of the long main-thread resolver into bounded completed-work slices; Browser 0011 does **not** claim lower total planning CPU time. The remaining largest segment in this fixture is initial deployment/setup at roughly one second.

## Regression coverage

- New `test-cooperative-planning-responsiveness.cjs`: **5/5 passed**. It verifies build/save identity, cooperative streamed wiring and token cancellation, legacy resolver source-contract visibility, deterministic synchronous/cooperative equivalence, real yielding and safe cancellation.
- Browser 0010 planning-query-reuse regression suite rerun against Browser 0011: **6/6 passed**, covering visibility-context reuse after mutable door/smoke/flashlight/flare changes, fear perception, indexed hazard equivalence, in-round ignition changes, bounded movement visibility construction and 5,000 allocation-free hex-distance equivalence cases.
- All five non-empty embedded runtime JavaScript blocks pass `node --check`.
- Service worker and focused test scripts pass `node --check`.
- Packaged runtime payload bytes/hash are verified against the standalone runtime; release metadata and host hash are synchronized during packaging.

## Field acceptance / remaining limits

Installed-browser/PWA testing remains required. In a large active mission, hand command to Simulation AI and confirm the transfer/progress UI continues repainting rather than appearing frozen, Take Back Control cancels unfinished future planning cleanly, playback resumes normally, and mission outcomes match established Tactical authority. Exercise VIP rescue, Last Known Contact/search, Beacon/reinforcement and night/hazard cases.

Individual atomic tactical calculations can still take hundreds of milliseconds and initial setup is approximately one second in the stress fixture. If installed profiling still shows unacceptable pauses, the next optimization should target the measured atomic subsystem rather than weakening doctrine; Web Worker migration remains a later option if cooperative main-thread planning is insufficient.
