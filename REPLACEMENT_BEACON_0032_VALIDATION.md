# Browser 0032 — Replacement Beacon Five-Turn UFO Delivery Hotfix

Build: `v0.26.10.01.0032_REPLACEMENT_BEACON_FIVE_TURN_UFO_DELIVERY_HOTFIX`  
Save format: **4**

## Corrected authority

- Beacon destruction starts a round-deduplicated five-completed-turn countdown.
- Deployment is not eligible during the fifth waiting turn; eligibility begins on the following tactical round.
- The countdown state is persisted in the existing tactical reinforcement payload with optional fields and no save-format bump.
- A successful replacement deployment creates an observation-gated UFO delivery craft and flight plan tied to the committed Beacon cell.
- Observed replacement delivery uses the shared UFO approach cinematic. The newly authoritative Beacon is presentation-masked until the approach completes.
- Hidden delivery craft stay hidden; no new knowledge is granted from internal replacement state.
- Hard difficulty reinforcement counts and overflow rules are unchanged.

## Automated checks

- All executable inline runtime JavaScript blocks pass `node --check`.
- `service-worker.js` passes `node --check`.
- Focused source contract verifies explicit completed-turn fields, the `destroyedRound + 6` readiness boundary, same-round deduplication, replacement UFO craft creation, Manual and streamed-AI presentation wiring, and Beacon masking during the replacement approach.
- Canonical runtime is embedded byte-for-byte in `index.html`; runtime byte count/SHA-256 and host SHA-256 are synchronized in release metadata.
- ZIP integrity is verified.

## Manual acceptance

1. Destroy an active Beacon during tactical round N.
2. Complete rounds N+1 through N+5. No replacement Beacon may appear during those five rounds.
3. On N+6, allow a legal replacement site. If the delivery route/location is observable, confirm the UFO approach plays before the replacement Beacon is shown.
4. Block all legal replacement footprints on N+6; confirm the game retries later without resetting or shortening the already-completed five-turn delay.
5. Save/reload during the countdown and confirm the remaining turns are unchanged.
6. Repeat on Hard and confirm the replacement still carries the established doubled difficulty-scaled reinforcement group.
