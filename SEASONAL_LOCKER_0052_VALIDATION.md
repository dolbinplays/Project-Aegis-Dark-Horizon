# Seasonal Locker + Collection Polish — 0052

Build: `v0.26.10.05.0052.1_SEASONAL_LOCKER_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Barracks exposes a shared Seasonal Locker built from existing `seasonalCosmetics` and `seasonalSparePieces` records.
- Manual swaps move one recovered item; they do not clone or destroy it. Displaced equipped pieces return to retained spares.
- Four persistent per-soldier locks cover Top, Bottom, Helmet / Mask, and Weapon Skin.
- Seasonal recovery auto-assignment skips locked slots, even when the locked slot is empty.
- Full-set celebration and weapon presentation continue to consume existing equipped cosmetic records.
- Seasonal content remains presentation-only. Save format remains 4.

## Automated checks
- All executable inline runtime scripts parse with Node.
- Service worker parses with Node.
- Host runtime payload matches `src/browser-runtime.html` byte-for-byte and by SHA-256.
- Shared locker inventory groups costume types by `itemId` and counts every owned/spare copy; transactions preserve individually recovered pieces.
- Manual transaction moves an item between soldiers without duplication and returns displaced gear to spares.
- Lock normalization defaults old saves to all-unlocked.
- Automatic drop assignment contains the locked-slot exclusion.
- Build IDs, launch cache, metadata and save format are synchronized.

## Field acceptance
1. Open Barracks on desktop and Mobile/Adaptive and confirm Seasonal Locker is reachable.
2. Verify set progress accurately reflects equipped plus spare recovered items.
3. Move one piece from Soldier A to Soldier B and confirm it disappears from A and appears once on B.
4. Replace an equipped piece and confirm the displaced piece remains available in the Locker.
5. Unequip a piece and confirm it remains retained rather than disappearing.
6. Lock an occupied slot and an empty slot; recover new Halloween pieces and confirm automatic assignment skips both locked slots.
7. Complete a matching four-piece set and confirm the existing full-set victory flourish remains active.
8. Save/reload and verify cosmetics, spares, locks and collection totals persist.

## Review findings and fixes
- Re-selecting the same type on a later soldier could remove a different earned copy from an earlier soldier. Same-type selection now does nothing.
- Worn pieces were selected before spares, unnecessarily stripping another soldier. Transactions now consume an available spare first.
- Collection rows concealed spare/copy counts. Each type now shows total owned and spare quantities.
- UI handlers passed a render-time roster snapshot into the setter. Functional updates now preserve queued recruitment and soldier state changes.
- Source build manifest still pointed to 0051.1; synchronized before canonical packaging.
- Replaced the copied-helper fixture with tests against the actual canonical runtime; included them in the packaging gate.

## Automated result — reviewed package
- **62/62** mandatory release tests passed, including six new Seasonal Locker regressions.
- New regressions cover real copy conservation, spare preference, transfer/unequip, invalid targets, lock persistence through normalization and automatic assignment, and queued roster updates.
- Embedded-script syntax check: PASS (9 non-empty blocks across 4 HTML files).
- Build seam and embedded runtime/source parity checks: PASS.
- Canonical packager launch-host validation: PASS.
- Runtime byte count: 7842399.
- Runtime SHA-256: `ffe7ecaf10f26d4890d76a7a2f68e6ee88c72e5efef1d667c583e15abb9cfa6a`.
- Save format remains **4**.
- Installed-game desktop/mobile visual field acceptance remains pending. Component behavior was checked using the actual runtime with a React element test fixture.
