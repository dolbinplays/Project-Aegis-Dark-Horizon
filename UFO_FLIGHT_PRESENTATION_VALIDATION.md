# Observation-Gated UFO Flight Presentation Validation

Build: `v0.26.09.25.0009_OBSERVATION_GATED_UFO_FLIGHT_PRESENTATION_PATCH`  
Save format: `4`

## Scope

This patch presents the already-authoritative version-2 reinforcement transport lifecycle. It does **not** change reinforcement wave counts, R/R+1/R+2 timing, disembarkation legality, source ownership, beacon health/shield rules, or mission victory requirements.

## Implemented authority

1. **Deterministic flight plan** — each version-2 transport receives a stored approach/exit route tied to its committed landing footprint. Thirteen samples run from beyond the tactical boundary to the landing anchor.
2. **Observation gate** — off-map samples cannot be used as fake edge-cell sightings. Living, conscious/active, non-extracted AEGIS soldiers may latch the craft when an in-bounds sampled route cell passes the existing tactical sight check and bounded range. Final landing-footprint observation can reveal only the closing descent.
3. **Independent knowledge** — craft observation does not mark delivered aliens visible and does not reveal the planted beacon. Hidden craft covers remain unrevealed until their own source is seen.
4. **Persistent 3D presentation** — observed Iso/FPV/TPV flight uses one temporary saucer node in the existing persistent Three.js scene and cinematic camera. The terrain/static scene is not rebuilt by the animation.
5. **Departure handoff presentation** — a previously observed version-2 transport lifts from its committed footprint at the existing handoff boundary. A separately visible beacon is masked beneath the hull until the craft clears; an unobserved beacon stays unpresented.
6. **2D fallback** — observed 2D Hex flight uses a bounded purple-craft sky overlay with no positional text card. Hidden flights produce no overlay.
7. **Leak closure** — legacy and persistent 3D craft rendering require craft knowledge. Alien transports are excluded from the FPV/TPV Skyranger extraction HUD and local minimap extraction markers.
8. **Manual/AI parity** — live Manual and streamed AI frames carry detached craft snapshots, route data, source ID and departure data. Late landed-craft observation refreshes only that source.

## Automated/static checks completed

- All inline JavaScript blocks in the rebuilt runtime pass `node --check`.
- `service-worker.js` passes `node --check` after release metadata is updated.
- Release packaging verifies the embedded runtime byte count and SHA-256 against `release-metadata.json`.
- Static contracts: **22/22 passed**. They verify: 0009 build/save metadata; deterministic 13-sample plan; hidden cinematic suppression; observed approach/departure event payloads; 3D runtime hook and animation helper presence; beacon masking on rebuild; legacy/persistent hidden-craft filters; alien-craft exclusion from extraction HUD/minimap; Manual and AI craft snapshot propagation; and layered function-source preservation for existing Build Health checks.
- Targeted extracted-function harness: **6/6 passed** for deterministic planning, in-bounds observation gating, hidden-event suppression, observed approach payload, legacy cinematic compatibility, and departure/beacon knowledge separation.
- Existing 0001–0007 UFO source timing, disembarkation, observation memory, center reservation, source isolation and snapshot-isolation code remains present and save format stays 4.

## Live field acceptance required

1. **Observed approach:** arrange a living soldier with valid sight to the incoming path. Confirm the purple saucer appears only from the first observable portion, crosses the map, descends to the committed footprint, and stays visible after LOS is later broken.
2. **Hidden approach:** repeat with no legal observer. Confirm no craft model, shadow, camera cut, card, locator, FPV objective, minimap extraction marker or landing-coordinate cue appears.
3. **Independent aliens:** observe the craft while delivered aliens remain out of LOS. Confirm the flight does not reveal those aliens. Conversely, see a delivered alien without seeing the craft and confirm the saucer location remains unknown.
4. **3D cameras:** exercise Iso, FPV and TPV. Confirm the existing tactical scene does not rebuild or flicker, the first-person weapon returns correctly, and normal camera ownership resumes after the pass.
5. **2D Hex:** confirm an observed transport receives only the bounded sky craft overlay and an unseen transport receives nothing.
6. **Landed discovery:** miss the approach, then later discover the landed craft. Confirm only that craft becomes visible and it remains tied to the correct source/footprint.
7. **Observed departure:** keep the craft observed through the handoff. Confirm it lifts and exits; if the beacon is visible, it appears only as the hull clears it.
8. **Hidden beacon:** observe the craft but not the planted beacon at handoff. Confirm the craft may depart visibly while the beacon position stays hidden until ordinary LOS/knowledge discovers it.
9. **Sequential sources:** run multiple transports beside a crashed UFO or other landed craft. One source's arrival/departure must not hide, move or remove another.
10. **Save/load:** save while a version-2 craft is landed/observed and around the handoff boundary. Confirm the stored route, observation latch, source ID and beacon center are retained and no arrival/hand-off duplicates.
11. **Manual / Hybrid / Simulation:** repeat representative observed and hidden cases in each mode and verify the same knowledge rules.
12. **Installed/PWA:** deploy `index.html`, `service-worker.js`, and `release-metadata.json` together, allow the new service worker to activate, then repeat at least one observed and one hidden arrival.

## Deferred

Initial mission beacon and replacement-beacon routing are not converted to the version-2 transport lifecycle by this patch. Explicit skip controls, broader reusable flight choreography, and native parity also remain follow-up work.
