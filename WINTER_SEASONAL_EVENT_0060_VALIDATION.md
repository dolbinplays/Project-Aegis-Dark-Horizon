# 0060.1 Winter Seasonal Review — October 7, 2026

Build: `v0.26.10.07.0060.1_WINTER_SEASONAL_REVIEW_HOTFIX`

## Findings fixed
- Winter was in a separate script after game/editor bootstrap and outside the canonical application script exercised by runtime tests. Moved initialization before bootstrap inside the canonical script; a first-render regression verifies registration.
- Legacy Halloween drops lacking eventKey were classified using the current calendar event, producing Winter feedback in December. Recovery now derives identity from the piece.
- Older decoration health checks inspected helper source text and failed on the new event dispatch wrappers. Replaced them with actual map/deployment decoration checks.
- Corrected release-history ordering and an older 0044 entry inheriting the current build number; synchronized source manifest and launch caches.
- Replaced Winter token/syntax-only checks with five executable runtime tests and added them to the mandatory packaging gate. Updated the Locker regression to initialize React state and select the item control by its options after the new event selector was added.

## Executed validation
- Full mandatory release suite: **98 passed, 0 failed**.
- Winter first-render initialization, calendar boundaries, legacy reward identity, event-isolated collections/highlights, copy-conserving swaps, and Three.js decoration rendering: **PASS**.
- Decorations verified deterministic, presentation-only, and nonblocking using actual runtime helpers and real Three.js objects.
- Build seam/host/source checks: **PASS**.
- Embedded JavaScript syntax: **PASS**, 11 non-empty blocks across 6 HTML files.
- `git diff --check`: **PASS**.
- Canonical packager rebuilt `index.html`. Runtime SHA-256: `e8cb22015cebdc58a3aa03715e38d1ee0dfdc494644c94c3f35d393685d1b0cf`.
- Save format remains 4. No commit, push, or new ZIP produced.
- Installed-game visual/audio acceptance remains pending; runtime tests use a controlled Node VM and Three.js without GPU rendering.

---

## Original 0060 author validation (historical)

# Winter Seasonal Event Pack — 0060 validation

Build: `v0.26.10.07.0060_WINTER_SEASONAL_EVENT_PACK`
Save format: `4`

## Contract
- Winter is a second data-driven event pack, not a replacement for Halloween and not a hard-coded gameplay branch.
- Active window is December 1 through February 28 and deliberately crosses the calendar-year boundary.
- The same generic event carrier/collectible authority used by Halloween creates Winter drops.
- Collection progress, completion, reward feedback, and local completion highlights are scoped by `eventKey`. Legacy missing `eventKey` remains Halloween-compatible.
- Shared campaign inventory remains `seasonalCosmetics` plus `seasonalSparePieces`; no save migration is introduced.
- Winter has Base/tactical decoration, reward-feedback, and victory-flourish features, but `music:false`; normal soundtrack banks remain authoritative.

## Authored Winter catalog
Foundation sets (7): Arctic Trooper, Nutcracker, Snow Ranger, Winter Wizard, Krampus Hunter, Toy Soldier, Frost Specter.

Signature variants (5): Polar Vanguard, Clockwork Captain, Whiteout Ranger, Aurora Sage, Rimehorn Warden.

## Automated checks
- December resolves `winter`; January remains active across the year boundary; November resolves no event; October still resolves `halloween`.
- Generic Winter carrier selection returns bounded deterministic carriers.
- Generic Winter collectible factory retains `eventKey=winter`, stable `winter:` item IDs, four-slot semantics, and no gameplay stat payload.
- Four Winter foundation slots complete only Winter; the same inventory does not complete a Halloween set.
- Mixed-event loadouts cannot satisfy full-set victory authority.
- Winter tactical decorations are `presentationOnly:true` and `block:0`.
- Seasonal Locker source includes an explicit event selector and event-scoped inventory/progress.
- Reward stinger source resolves `feedback.eventKey` and carries a distinct Winter reward theme while remaining on the existing SFX bus.
- Runtime/index/service-worker JavaScript syntax, embedded runtime byte/hash parity, release metadata parity, and ZIP integrity are checked.
- Save format remains 4.

## Field acceptance
1. Set seasonal date override to December 15; play multiple missions and verify one-to-three Winter carriers depending on threat.
2. Kill/recover Winter carriers and verify Top/Bottom/Helmet-Mask/Weapon pieces use Winter IDs and remain permanently owned.
3. Open Barracks → Seasonal Locker and switch between Halloween and Winter. Verify progress, signatures, complete sets, and NEW highlights do not cross-count.
4. Equip a Winter piece over an existing Halloween slot and verify the displaced Halloween copy returns to shared retained inventory exactly once; swap it back.
5. Lock occupied and empty slots and verify Winter auto-assignment honors the same locks.
6. Complete one Winter foundation set and a uniform Winter signature set; verify callout/stinger/Locker highlight and victory flourish.
7. Verify Winter Base snow/ice dressing is visible but never intercepts facility input.
8. Verify tactical snowman/pine/light/snowdrift decorations are visible, non-blocking, and do not affect LOS/cover/pathing/occupancy.
9. Confirm Original/Dark Horizon music continues normally during Winter and Master Music/Mute remain unchanged.
10. Override to October: Halloween behavior remains unchanged and Winter does not spawn. Override to November: neither event spawns/presents seasonal dressing.
11. Save/reload with mixed Halloween/Winter ownership and verify no schema migration and no copy loss.

Installed-game/PWA visual and audio acceptance remains pending.

## Executed delivery checks
- Focused 0060 appended-runtime helper suite: **11 / 11 PASS**.
- Embedded executable JavaScript syntax: **PASS** — 6 non-empty script blocks.
- Service worker JavaScript syntax: **PASS**.
- Runtime source / embedded host payload byte equality: **PASS**.
- Runtime byte-count / SHA-256 / release-metadata parity: **PASS** — 7,907,169 bytes; `beda2e5c02500c7082dbbbc25276d2b5f56a4f5d5fcf2e990a205f68d8ca778f`.
- Host SHA-256 / release metadata parity: **PASS**.
- ZIP extraction/integrity and manifest membership: **PASS** — 9 files.
- Installed-game/PWA visual and audio acceptance remains pending.
