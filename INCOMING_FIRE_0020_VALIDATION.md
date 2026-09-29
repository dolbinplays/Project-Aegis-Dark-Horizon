# Browser 0020 — Incoming fire playback completeness

## Causes and fixes

- Streamed alien attacks previously depended on the shooter's visibility. AEGIS-targeted shots now remain observable, including misses and legacy frame records. This does not reveal or change the alien actor's visibility.
- Multiple shots attributed to one actor shared a frame, while map playback animated only the first. Each attack now receives a separate frame; movement belongs only to the first. Unassigned remaining shots also receive individual frames before final state hydration.
- Manual alien-turn resolution called the single shot-effect setter repeatedly in a synchronous loop. Incoming attacks now play sequentially, committing their recorded unit state after each effect and cancelling remaining work when the mission unmounts/changes.
- Shot-expiry callbacks now clear only their own effect ID.

Save format stays 4. Combat rolls, ammunition/TU rules and visibility authority are unchanged.

## Checks

Six new checks cover hidden-shooter hits/misses, snapshot immutability, repeated/unassigned shot completeness, hidden civilian exclusion, manual ordering/timing, cancellation and effect wiring. Existing shot-impact, casualty playback, cooperative planning, Beacon hold and playback scheduler tests are included.

Older test harnesses were refreshed to supply existing impact/stance dependencies and avoid pinning the current build to Browser 0017.

All 47 focused checks pass. Packaging, build consistency, embedded JavaScript syntax and whitespace checks pass. Fresh Edge launch displays Browser 0020 without page errors.

## Field acceptance remaining

In the installed game, observe multiple aliens firing at AEGIS under Manual, Hybrid and Simulation control. Check hits, misses, night/hidden shooters, casualty shots and consecutive attacks in Iso/FPV/TPV. Every incoming attack should have a visible projectile effect, without revealing a hidden alien. Confirm end-of-turn and mission-result progression waits for manual incoming playback.
