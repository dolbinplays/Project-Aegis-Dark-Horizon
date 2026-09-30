# Browser 0023 — Project authoring and editable Skyranger

## Using the editors

- Props: select the prop (including **Skyranger / vehicle-skyranger**), edit its model/components, then use **Write Unified Library to Project**.
- Building layouts: preview and validate the layout, then use **Write Layout to Project**. Both staggered-row placements are validated before writing.
- Soldier poses: preview the selected pose, then use **Write Pose to Project**. Positions and joint rotations are validated; tactical facing is not exported into the pose.
- Select the repository root in Chrome/Edge's folder picker. Writes retain `.backup` files, verify the written contents, and restore previous files if a write fails. Props also retain the existing last-known-good library files.
- Review and commit the changed project files, then publish the game. Writing local files does not publish to GitHub or update an already installed game by itself. Reload after deploying to load the updated assets.

Layout and pose edits merge into `assets/data/aegis-authored-content.json` and its runtime JS counterpart. Writing one pose preserves other poses and the building layout. The runtime loads this data before resolving poses or generating new missions. Invalid authored poses/layouts fall back safely. Browser-local building overrides still take precedence; **Use procedural layouts** explicitly opts that browser out of authored residences. Existing battle snapshots are unchanged. The layout editor still supports the established 9 × 8 residence footprint.

The Skyranger's 30 existing visual components were migrated without changing the other prop definitions. Its tapered nose is a preserved mesh with editable transforms/materials. Tactical craft heading, boarding/extraction cells and night lights remain game-controlled. Keep visual ramp changes aligned with the established boarding lane. The change applies to the tactical 3D craft, not the separate base-tile artwork or 2D symbols.

## Validation

- Six project-authoring checks: merged writes and reload, backups/rollback on partial failure, runtime pose authority and invalid fallback, editable Skyranger with unchanged placement/lights, migration of old browser prop libraries, and editor script parsing.
- Ten building-layout checks, including shipped defaults without browser storage, malformed local override fallback, existing mission/save snapshots, structural validation and generation. Updated that test harness to load newer window-covering and save-repair dependencies.
- Three transport regressions: high-wing cabin clearance, landed versus flying UFO geometry, and presentation event authority.
- Rendered all three editors in fresh headless Edge. Skyranger preview and all project-write buttons succeeded with an in-memory File System Access adapter and no page errors. Actual native folder permission prompts remain a manual browser check; tests did not modify player browser data.
- Historical `test-prop-presentation-2358.cjs` and `test-unified-prop-pipeline-2051.cjs` still pin obsolete release identifiers (2358/2051); they are not current-release acceptance tests. Their attempted runs stopped at those version assertions. Last-known-good preservation was retained following the pipeline check.
- Build packaging and build seam checks pass. Save format remains 4.
