# AEGIS Prop Editor 2145 handoff

Build: `v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH`

## Purpose
Restore the visual designs from the first Prop Editor Foundation Tool as the canonical game models for the corresponding 12 props, without losing the later 2058 definitions.

## Restored canonical visual keys
`tree`, `lamp-post`, `stop-sign`, `vending-machine`, `newspaper-machine`, `bus-stop`, `street-bench`, `crates`, `concrete`, `fence`, `rock`, `bush`.

The definitions were recovered from commit `efb9cf4dada88cb258f9d723d3d609b73301ffa6` / `AEGIS_Prop_Editor_v0.26.09.17.1155_PROP_EDITOR_FOUNDATION_TOOL.html`. Geometry, transforms, material values, and collision envelopes are restored from that source.

## Backups / future revert workflow
- `assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json`: full previous 57-prop library, untouched.
- `assets/data/aegis-prop-factory-originals-1155.json`: immutable 12-prop factory snapshot intended as the seed for the planned per-prop **Revert to Original** feature.

This patch does **not** yet implement automatic filesystem writes from a browser editor. The roadmap item for automatic live update + last-known-good snapshots remains a follow-up because browser/PWA write authority needs a deliberate persistence design.

## Runtime
The normal game continues to consume `assets/data/aegis-prop-library.js`. The existing shared-library renderer authority therefore picks up the restored models without save migration. The 2120 installed-app gallery URL resolution fix remains in the runtime bridge.

## Save compatibility
Save format remains **4**.
