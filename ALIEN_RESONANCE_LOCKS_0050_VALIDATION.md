# Alien Resonance Locks — 0050

Build: `v0.26.10.04.0050_ALIEN_RESONANCE_LOCKS_PATCH`
Save format: `4`

## Contract
- Newly generated Alien Base Assault battlefields may place one secured alien bulkhead shortcut per deck.
- Every secured shortcut retains another route; the lock is never the only progression path.
- Secured doors reuse the existing authoritative door states and can be damaged/breached through ordinary combat.
- Resonance Lock uses five tension tests. Engineer specialization and Alien Beacon Interface Protocols each widen the success window.
- Manual base cost is 12 TU; attempt 1/2 successes refund 4/2 TU. Auto Resolve is 12 TU, researched Electronic Bypass is 10 TU, Pale Commander credential override is 6 TU.
- Five failed tests spend 12 TU and leave the door locked. Abort before the first committed test costs 0 TU.
- Save format remains 4. Existing battle snapshots are not retrofitted with new doors.

## Automated checks
- Embedded runtime source and host payload byte/hash identity.
- All executable embedded runtime JavaScript blocks parse with Node.
- Service worker parses with Node.
- Deterministic resonance puzzle target and tolerance.
- Locked alien doors block movement and successful bypass opens the existing authoritative door.
- Alien-base generation identifies secured doors as optional shortcuts and preserves save format 4.

## Field acceptance
1. Start new Alien Base Assaults with several seeds and locate secured bulkheads on multiple decks.
2. Verify a locked secured door blocks movement but another route remains available.
3. Test mouse, keyboard arrows and touch on the resonance slider; verify five-test feedback and success window.
4. Verify ordinary success costs 12 TU, first/second-test success effectively costs 8/10 TU, and five misses spend 12 TU without opening the door.
5. Verify Auto Resolve costs 12 TU, researched Electronic Bypass costs 10 TU, and a carried Pale Commander badge offers the 6-TU credential path.
6. Shoot/breach a secured door and confirm existing structural damage/pathing authority opens the route without invoking the minigame.
7. Save/reload after bypassing a door and confirm the authoritative open state persists.
8. Confirm ordinary Earth building/shelter doors continue using their existing Open/Close/Call Out behavior and never launch Resonance Lock.

## Automated result — packaged build
- 5/5 executable inline runtime scripts: PASS (`node --check`).
- Service worker syntax: PASS (`node --check`).
- Embedded runtime payload: byte-for-byte PASS against `src/browser-runtime.html`.
- Runtime byte count: 7,798,432.
- Runtime SHA-256: `62f2cdc66c2dfb8381515814617335e51a4afc966520d9a98b49e3cc9e33bb16`.
- QA alien-base seed 17 leaves all three intended secured-door footprints clear of generated fixtures before the 0050 security-door pass.
- Save format remains 4.

## Launch-page repair

The initial 0050 host contained `<scrip<script ...payload...>...</script>pt>` where the payload and executable bootstrap script tags belonged. The browser therefore never executed the iframe bootstrap. The gameplay source itself passed startup checks. Regenerating the host with `tools/package-runtime-shell.cjs` repairs the markup and refreshes release hashes. The source manifest is synchronized to 0050.

`tools/validate-runtime-host.cjs` now requires the runtime payload, game iframe, and executable bootstrap; packaging validates its generated output before writing it, and `check-embedded-js.cjs` rejects the malformed 0050 host. Three regression checks cover valid markup, the exact damaged boundary, and missing required host components. Gameplay and save format remain unchanged.
