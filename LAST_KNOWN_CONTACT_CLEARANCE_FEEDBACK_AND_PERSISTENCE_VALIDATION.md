# Last Known Contact Clearance Feedback + Persistence Validation

Build: `v0.26.09.26.0013_LAST_KNOWN_CONTACT_CLEARANCE_FEEDBACK_AND_PERSISTENCE_HOTFIX`  
Save format: `4`

## Field report / scope

A live tactical report showed Last Known Contact markers sometimes disappearing before the player had personally seen the alien die or move. Existing doctrine intentionally permits a third resolution path: **any living AEGIS soldier may clear a report by gaining legitimate LOS to the exact recorded cell and confirming it is empty**. The prior build performed that resolution silently, which made legitimate off-screen verification indistinguishable from premature state loss.

This hotfix preserves that authority and makes it observable while strengthening streamed state ownership.

## Implemented authority

- `empty-verified` is recorded only when the existing LOS/facing/lighting/cover visibility authority verifies the marker cell.
- The resolution records verifier ID/name, Fire Team ID/label, round, level and recorded marker hex. No current hidden alien position is exposed.
- All tactical views share a brief `LAST KNOWN POSITION CLEARED — AREA OBSERVED EMPTY` notice.
- Multiple reports on one verified cell are grouped.
- Snapshot serialization and playback merge carry the resolution metadata. An older frame cannot resurrect a marker after a newer resolution.
- A later genuine sighting clears old resolution metadata and starts a new contact epoch.
- Death and invalid legacy-coordinate sanitation remain distinct non-banner resolution reasons.
- Save format stays 4.

## Automated validation

- 5/5 non-empty executable embedded runtime JavaScript blocks parse with `node --check`.
- Focused executable source-derived harness: **7/7 passed**. It verifies valid empty-cell clearance, reason/verifier/cell attribution, no clear when the observer faces away, stale-frame resurrection protection, fresh-contact reset, and stacked-cell notice grouping.
- Focused static/release validation: **22/22 passed**, including snapshot fields, UI wiring, patch-history scope, save format, embedded payload identity, metadata hashes and service-worker build identity.
- Host executable JavaScript and service-worker JavaScript parse successfully with `node --check`.
- ZIP integrity is verified after packaging.

## Live acceptance gates

1. Observe an alien, lose LOS, and confirm the Last Known Contact marker persists.
2. Advance rounds while no AEGIS soldier can see the recorded cell; the marker must not expire from time, hidden movement, camera changes or AI objective churn.
3. Let a different soldier/fire team gain legitimate LOS to the recorded cell while the alien remains hidden elsewhere. Confirm the marker clears and the banner identifies the verifier/fire team.
4. Repeat with a wall, smoke/darkness/facing obstruction that prevents legitimate verification; the marker must remain.
5. Reacquire the alien after a cleared report, lose sight again, and confirm a fresh marker can be created.
6. Save/load before and after clearance and confirm no stale marker resurrection or duplicate notice.
7. Confirmed alien death and malformed legacy marker cleanup must not claim that a soldier observed an empty cell.
