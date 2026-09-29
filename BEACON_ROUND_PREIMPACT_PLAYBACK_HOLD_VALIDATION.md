# Beacon Round Pre-Impact Playback Hold Validation

Build: `v0.26.09.29.0015_BEACON_ROUND_PREIMPACT_PLAYBACK_HOLD_HOTFIX`

Save format: **4** (unchanged).

## Field report reproduced in source

The player reported that during streamed AI battle playback the Alien Field Beacon stopped rendering once the AI had determined that a later AEGIS shot in the same round would destroy it. The Beacon became visible again only for the final shot so the destruction animation could run.

## Root cause

The shared resolver buffers an AEGIS action phase as one playback frame containing movement and multiple shot records. Before this hotfix, `currentFrameBase()` generated `beaconPresentationSnapshot` only when the completed human-phase frame was appended. At that time the resolver had already applied every action in the phase. If a later shot destroyed the Beacon, the frame-level snapshot was therefore sampled from already-destroyed authoritative cover state.

The lethal-shot record still carried `beaconPresentationBefore`, so the dedicated destruction cinematic could reconstruct/restore the Beacon when that final shot started. That explains the visible symptom: absent during earlier playback, then reappearing for the final destruction shot.

## Fix

- Capture `humanPhaseBeaconPresentationSnapshot` immediately before the AEGIS action phase begins.
- Override the completed human-phase frame's `beaconPresentationSnapshot` with that pre-action snapshot.
- `tacticalBeaconStreamFramePresentationCovers(...)` now restores the frame snapshot even when the same frame contains a lethal Beacon shot.
- A committed destruction state still wins immediately after impact, so the intact snapshot cannot resurrect the Beacon after the cinematic commit.
- No gameplay-authority or save-state fields were added.

## Automated validation

`tools/test-beacon-round-preimpact-playback-hold.cjs` passes **6/6** checks:

1. Browser 0015 build identifier is present.
2. A buffered frame whose authoritative covers already contain the wreck still renders the round-start active Beacon before cinematic state begins.
3. Active lethal-shot presentation keeps the Beacon intact through projectile travel.
4. Explicit impact commit reveals the authoritative destroyed/wreck state.
5. `resolveMission(...)` captures the Beacon before phase actions and writes the preserved snapshot onto the completed AEGIS phase frame.
6. The playback helper no longer opts out of restoration merely because the buffered frame contains the lethal shot.

Inherited regression results:

- Browser 0014 VIP/window concealment: **6/6**.
- Browser 0013 shot-impact sequencing/directional knockback: **6/6**.
- Browser 0012 alien forced entry: **6/6**.
- Browser 0011 cooperative planning/equivalence: **5/5**.
- Browser 0010 planning-query/hazard equivalence: **6/6**.
- Five executable inline runtime JavaScript blocks pass `node --check`.
- `service-worker.js` passes `node --check`.

## Manual field gate

Run Simulation AI against a visible active Beacon and arrange for multiple actions in the AEGIS phase before a final lethal shot. The Beacon must remain continuously visible throughout all earlier playback actions, remain intact while the killing projectile travels, and become a wreck only after the impact/explosion commits. Repeat for a final mission objective and for a replacement Beacon.
