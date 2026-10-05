# Costume Anatomy, Fit & Visual Authoring — 0054

Build: `v0.26.10.05.0054.1_COSTUME_FIT_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Costume fit authoring remains presentation-only and stays in `assets/data/aegis-costume-library.js/json`.
- Existing schema name remains `aegis-costume-library-v1`; 0054 adds optional sanitized `slots` visual fields, so Browser 0053 libraries remain valid.
- Per-slot base transforms are layered with optional body-family fit transforms.
- Supported fit families: Lean, Standard, Stocky, Alien, Brute, Drone, Leech.
- Untouched transforms are identity offsets, preserving Browser 0053.1 geometry.
- Collectible IDs, setKey/variantKey, Locker inventory, drop logic, full-set completion, combat authority and save format are unchanged.

## Automated checks
- Runtime executable inline scripts parse with Node.
- Service worker and Costume Editor scripts parse with Node.
- Host embedded runtime byte count and SHA-256 match metadata.
- Costume library JS evaluates and contains every foundation/signature identity.
- Runtime contains sanitized slot authoring, fit-family selection, transform application and material treatment.
- Editor contains articulated Three.js preview, four slot controls, seven fit families, six preview poses, project-folder load/save and backup-before-replace flow.

## Field acceptance
1. Open Seasonal Locker → Costume Editor on desktop Chrome/Edge.
2. Choose Project Aegis folder and load current library without data loss.
3. Adjust each slot's X/Y/Z position, rotation and scale; verify preview updates.
4. Add separate Lean, Stocky, Brute and Drone overrides and verify switching families changes only that preview fit.
5. Cycle Standing, Aim, Kneel, Prone, Walk and Victory poses to inspect clipping.
6. Save, confirm timestamped JS/JSON backups, relaunch the game and verify authored transforms appear in tactical costume presentation.
7. Recover/equip ordinary and signature pieces and confirm item counts, IDs, favorite locks and foundation completion remain unchanged.
8. Save/reload campaign and confirm save format remains 4.

Installed-game visual/file-picker acceptance remains pending.

## Review fixes — 0054.1
- Preview costume meshes had different sizes/heights from runtime. Foundation geometry, local placement and material opacity now match; body anatomy and poses remain simplified guides for in-game checking.
- Rebuilding preview costumes now disposes removed geometries/materials, preventing GPU allocation growth while editing.
- Corrected arm and leg selection for aim, kneel and victory pose controls.
- Editor rejects invalid/nonfinite transforms, nonpositive/out-of-range scales and invalid fit overrides. Runtime safely bounds loaded values.
- Optional opacity defaults preserve previous per-mesh opacity. Untouched authored defaults omit opacity; blank editor opacity restores inheritance.
- A failed WebGL initialization leaves file authoring functional and reports the missing preview.
- Synchronized the canonical manifest with the release build.

## Reviewed package results
- **74/74** mandatory release tests passed.
- Five added regressions cover transform rejection, safe runtime defaults, actual Three.js preview/runtime geometry parity across all seven foundation sets, GPU resource disposal, and file authoring without WebGL.
- Existing backup, library validation, collection and gameplay regressions remain passing.
- Syntax checks: PASS (10 non-empty blocks across 5 HTML files).
- Build seam / embedded runtime parity: PASS.
- Runtime SHA-256: `22afcc172df20da3c1d337aa4d4605aafffb8041eb1c23f2b8c0fd584bc635a5`.
- Save format remains 4.
- Real-browser GPU rendering, file-picker operation and installed-game pose/clipping acceptance remain pending. Tests instantiate actual Three.js geometry with a stub renderer.
