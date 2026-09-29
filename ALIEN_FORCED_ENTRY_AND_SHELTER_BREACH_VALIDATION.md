# Alien Forced Entry + Shelter Breach Doctrine

Build: `v0.26.09.29.0012_ALIEN_FORCED_ENTRY_AND_SHELTER_BREACH_PATCH`

Save format: **4** (unchanged).

## Scope

- Forced entry is authorized only for a visible human/civilian target or legitimate VIP / Last Known Contact search states whose known target coordinate lies inside a building.
- Generic alien patrol/search objectives cannot authorize building breach.
- A legal open/unlocked route to the same target area suppresses forced entry.
- If no route exists, the alien approaches a reachable adjacent cell while reserving 14 TU, then attacks the existing locked door cover.
- Door HP, damaged/unlocked state, breach rubble, reaction fire and pathing remain the established shared authority.
- Streamed Simulation AI and live/manual alien turns use the same `tacticalAlienForcedEntryPlan(...)` and `tacticalAlienForcedEntryAttackResult(...)` helpers.

## Automated validation

Focused `tools/test-alien-forced-entry.cjs` covers: knowledge-backed selection, generic-search rejection, open-route suppression, authoritative structural damage + TU cost, indestructible-door rejection, and both alien execution loops using the shared helpers.

Inherited Browser 0010 planning-query regressions remain **6/6 passing** with a minimal building-layout headless stub because this release overlay does not contain the repository asset file. Browser 0011 cooperative planning equivalence/cancellation is **5/5 passing against the final Browser 0012 runtime**, including deterministic sync/cooperative equivalence and safe cancellation.

Focused alien forced-entry regression is **6/6 passing** against the final Browser 0012 runtime. All **5 non-empty embedded runtime JavaScript blocks** parse successfully; the service worker and focused test files also pass `node --check`. The packaged `index.html` runtime payload is byte-for-byte identical to canonical `src/browser-runtime.html`, and release metadata hashes/byte counts match. Save format remains 4.

## Field acceptance

1. Let a threatened civilian/VIP secure a building, then let an alien legitimately see or retain a valid contact inside. Confirm the alien uses an unlocked alternate entrance when one exists.
2. Lock all legal entrances and confirm the alien approaches a reachable locked door, spends attack TU, damages/forces the existing door state, and resumes pursuit after the opening becomes traversable.
3. Repeat with no valid target knowledge and confirm aliens do not randomly smash shelter doors while performing generic search.
4. Verify reaction fire can still stop an alien during its approach.
5. Exercise Manual, Hybrid and full Simulation AI, then save/reload around a damaged/forced shelter entrance.
6. Confirm indestructible or unreachable doors do not create an endless breach loop.

## Separate presentation regressions recorded during this patch

The user also reported (a) soldiers entering downed/bleeding/prone presentation before the causative shot is shown, and (b) Beacons disappearing before their lethal shot and then reappearing for the destruction cinematic. Both were investigated and root causes were identified in the roadmap; they are intentionally not mixed into Browser 0012.
