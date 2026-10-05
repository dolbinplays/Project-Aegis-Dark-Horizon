# Full-Set Victory Flourish & Celebration Authoring — 0055

Build: `v0.26.10.05.0055.1_VICTORY_FLOURISH_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Celebration authoring is optional presentation data inside the existing `aegis-costume-library-v1` records.
- Existing libraries without `celebration` remain valid and use the prior orbit flourish.
- Runtime accepts only approved effect/pose names, bounded intensity/speed, at most four phases and bounded durations.
- Full-set eligibility still comes from the four equipped seasonal slots sharing one foundation `setKey`.
- A signature override is used only when all four equipped pieces share the same `variantKey`; mixed signature/foundation completion uses the foundation definition.
- Victory/result authority, survivor eligibility, flythrough sequencing, TU, rewards, XP, morale, AI and save format are unchanged.

## Automated checks
- Runtime, service worker and Costume Editor scripts parse with Node.
- Embedded runtime bytes/SHA-256 match source and release metadata.
- Costume library contains bounded celebration blocks for all foundation/signature definitions.
- Runtime sanitizes celebration data and retains legacy fallback.
- Runtime flourish renderer consumes effect/intensity/speed/phase data and does not own victory eligibility.
- Editor exposes effect/intensity/speed, timed phases, Preview Celebration and Load Last Backup.

## Field acceptance
1. Open Costume Editor and preview each effect family.
2. Change phase pose/timing, save, relaunch and verify the authored flourish appears on a legitimate full-set survivor during the normal victory dance/flythrough.
3. Complete a uniform signature four-piece set and verify its signature celebration override.
4. Mix signature/foundation pieces from one foundation and verify foundation completion/flourish remains valid.
5. Load an older 0054 library without celebration data and verify the legacy orbit flourish.
6. Use Load Last Backup and confirm it changes editor preview only until Save is explicitly pressed.
7. Confirm mission completion/results remain immediately authoritative and save format remains 4.

- Celebration replacement disposes locally created geometry without disposing shared persistent materials.

## Review fixes — 0055.1
- Sand and mist referenced a particle count outside its scope. Shared animation derives the count from the group, avoiding runtime exceptions.
- Game and editor share effect geometry, phase timing and animation in `assets/runtime/aegis-costume-celebration.js`, included in offline assets.
- Runtime creates effects only for living humans during authoritative victory playback and animates on rendered frames. A zero-time start advances correctly; palette changes invalidate cached effect geometry.
- Editor previews the selected effect from its first phase, restores its prior guide pose afterward and disposes effect geometry/materials.
- Repeated normalization no longer detaches phase controls from saved objects. Add/remove controls support one through four phases.
- Canonical manifest synchronized before packaging.

## Reviewed package results
- **77/77 mandatory release tests passed**.
- Added regressions exercise all nine effects across repeated updates, zero-time phase progression, persistent phase editing, phase count limits, selected-effect preview and cleanup.
- Embedded JavaScript syntax: PASS (10 non-empty blocks across 5 HTML files).
- Shared effect script syntax: PASS.
- Build seam and packaged runtime/source parity: PASS.
- Runtime SHA-256: `9323dffb731eb1d477ccd27d4d5bf8ac7de03d38889a6c49a8a1f971dd493c67`.
- Save format remains 4.
- Installed-game visual/file-picker acceptance remains pending. Automated tests use actual Three.js geometry with a stub renderer.
- Authored phase poses control the flourish motion; the soldier's existing victory animation remains authoritative. Editor body poses are simplified guides, not a replacement skeletal animation system.
