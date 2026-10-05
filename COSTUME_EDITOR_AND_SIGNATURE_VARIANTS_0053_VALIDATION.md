# Costume Editor + Halloween Signature Variants — 0053

Build: `v0.26.10.05.0053.1_COSTUME_EDITOR_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Costume authoring is presentation-only and resolves through `assets/data/aegis-costume-library.js`.
- Signature variants retain foundation `setKey` while adding stable `variantKey`.
- Rare variants are not required for ordinary set completion.
- Locker copy-conservation and favorite-lock authority remain unchanged.
- Editor writes JS/JSON to the selected project folder and creates timestamped backups when replacing files.

## Automated checks
- Runtime and service worker JavaScript parse.
- Embedded runtime equals `src/browser-runtime.html` by bytes and SHA-256.
- Signature catalog contains five approved variants.
- Runtime loads authored costume library and uses `variantKey` in presentation resolution.
- Seasonal Locker exposes Costume Editor and foundation completion uses `setKey`/slot rather than exact legacy item IDs.
- Save format remains 4.

## Field acceptance
1. Open Barracks → Seasonal Locker → Costume Editor.
2. Select the Project Aegis folder and edit a palette. Save; verify JS/JSON and backup files under `assets/data/`.
3. Relaunch and verify the authored palette appears on matching soldiers/aliens/weapon presentation.
4. Recover ordinary and signature pieces and verify individual copies remain conserved.
5. Equip a signature piece alongside standard matching-set pieces and verify foundation completion still succeeds.
6. Confirm no costume/editor change affects HP, TU, armor, damage, accuracy, AI, economy, research, LOS, or mission outcomes.

## Review hotfix — 0053.1
- Fixed service-worker initialization: the building editor URL incorrectly received another relative path as its base. Syntax checks alone did not catch this runtime exception.
- Added costume editor and costume runtime library to the offline shell list.
- Kept legacy IDs for new ordinary drops; signatures still have separate variant IDs and count toward their foundation set.
- Editor validates schema, catalog identities and colors; unreadable/incomplete files cannot enable a default overwrite. It completes both backups before either canonical file write and reports errors.
- Editor dropdown labels use text nodes and reflect edits immediately. Unsupported folder access is explained.
- Authored labels and foundation flourish names resolve on saved pieces. Malformed presentation rows fall back to built-in values without spreading arbitrary authored properties into runtime definitions.
- Restored the previous actual-runtime locker test entry point and added seven new executable worker/editor/runtime regressions.

## Reviewed package results
- Mandatory release gate: **69/69 tests passed**.
- Embedded JavaScript syntax: PASS (10 non-empty blocks across 5 HTML files, including the costume editor).
- Build seam and runtime/source parity: PASS.
- Worker initialization and offline asset inclusion: PASS in VM test.
- Editor load/save validation, backup ordering/failure, generated JavaScript evaluation and runtime presentation: PASS with DOM/file-handle fixtures.
- Runtime SHA-256: `1cf9b07d36fd5618692d821b8bb30e1e7be8e8bd44215f0a2046105e85e5e49c`.
- Save format remains 4.
- Real browser file-picker, installed/offline behavior and visual field acceptance remain pending. Backups remain available if a filesystem error interrupts the subsequent two-file replacement.
