# Unified Pose + Costume Authoring — 0056

Build: `v0.26.10.05.0056.1_UNIFIED_AUTHORING_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Existing pose authoring remains available in the stable Articulated Pose Editor path.
- Costume authoring uses optional presentation-only `recolorMode`, `recolor`, and `attachments` fields inside existing `aegis-costume-library-v1` slot records.
- Articulated human Top/Bottom/Head/Weapon pieces may recolor real `soldierBodyPart` meshes directly.
- Group controls do not collapse left/right identity; each distinct piece remains independently addressable.
- Optional attachments are rig-anchored geometry for silhouette-changing costume elements only.
- Alien/Classic seasonal presentation retains legacy overlays. Save and gameplay authority are unchanged.

## Automated checks
- Runtime/host/service-worker/unified-editor JavaScript parse.
- Embedded runtime byte count/SHA-256 equal packaged source and metadata.
- Runtime contains the 20-part recolor allowlist and custom/default/none mode sanitization.
- Runtime applies recolor only to articulated human meshes tagged with `soldierBodyPart`.
- Runtime retains legacy overlay branch for non-articulated/alien units.
- Unified editor exposes Pose and Costume tabs, joint controls, every distinct model piece, group shortcuts, directional copy controls, attachments and project-folder costume saving.
- Stable Pose Editor and legacy Costume Editor both route to the unified editor.
- Save format remains 4.

## Field acceptance
1. Verify all established pose presets, facing preview, mirror arms/legs and Write Pose to Project behavior.
2. Recolor left and right arms/legs differently and confirm the preview preserves asymmetry.
3. Use Top/Bottom group shortcuts, then override a single distinct part.
4. Equip the authored costume in-game on an articulated soldier and confirm no duplicate torso/leg overlay geometry is required.
5. Add cape, mask, helmet/wig and horn attachments and cycle tactical poses for clipping/follow behavior.
6. Verify alien seasonal carriers remain visibly costumed and recoverable.
7. Load an older 0055.1 costume library with no recolor fields and confirm generated foundation recolors appear without migration.
8. Save/reload a campaign; collection counts, favorite locks, signature variants, victory flourishes and save format remain unchanged.

Installed-game visual/file-picker acceptance remains pending.

## Packaged build results
- Runtime embedded script syntax: PASS.
- Unified Pose + Costume Editor syntax: PASS.
- Stable Pose Editor launcher and Costume Editor compatibility redirect syntax: PASS.
- Service worker syntax: PASS.
- Embedded runtime/source byte parity: PASS.
- Embedded runtime SHA-256 / release-metadata parity: PASS.
- 20-part articulated recolor allowlist: PASS.
- `default` / `custom` / `none` recolor-mode sanitation: PASS.
- Articulated-human direct-recolor gate: PASS.
- Non-articulated / alien legacy overlay branch retained: PASS.
- Attachment type/anchor sanitation and rig attachment renderer: PASS.
- Seasonal Locker opens unified Pose + Costume Editor: PASS.
- Existing authored pose override lookup and pose validation restored in unified editor: PASS.
- Costume JS/JSON pair validation and backup-before-replace workflow retained: PASS.
- ZIP extraction/integrity: PASS.
- Save format remains 4.

Real installed-game visual acceptance, browser directory-picker authoring, and pose/attachment clipping checks remain pending.

## Review hotfix — 0056.1
- Restored validation for slot/family transforms, per-part colors/materials, attachment type/anchor/count/transforms and celebration phases.
- Empty authored attachment lists now suppress generated defaults; missing lists retain backward-compatible defaults.
- Runtime and editor share attachment geometry/materials through `assets/runtime/aegis-costume-articulated.js`. Preview uses saved standard-fit transforms and displays generated defaults.
- Repeated preview changes dispose replaced materials; accent colors, opacity and emissive treatment are retained.
- Saves lock concurrent save/project/backup controls and finish both backups before replacing canonical files. Selecting a library-free project resets to packaged defaults rather than retaining another project's data.
- Celebration phase options match runtime names. WebGL initialization failures leave file authoring available.
- Added offline navigation for the versioned unified editor and updated the canonical manifest/launcher checks.
- Existing user-authored costume JS/JSON files and timestamped backups were preserved.

## Reviewed release results
- **75/75 mandatory release tests passed**.
- Replaced tests for the retired standalone editor with eight executable unified-editor tests; retained runtime/collection/effect regressions.
- Checks cover actual editor initialization, validation, shared default recolors, explicit attachment removal, preview material/transform agreement, disposal, overlapping saves, corrupt loads, failed backups and project switching.
- Embedded JavaScript syntax: PASS (11 non-empty blocks across 6 HTML files, including the versioned unified editor).
- Shared attachment helper syntax: PASS.
- Build seam and embedded runtime/source parity: PASS.
- Runtime SHA-256: `976afdce5ab43b7c20fab1c022102415d1d3cd3781166ae7b7ff6be991f02f4d`.
- Save format remains 4.
- Real browser rendering, native file-picker behavior and installed/offline field acceptance remain pending; editor tests use actual Three.js geometry and a stub renderer/file handles.
