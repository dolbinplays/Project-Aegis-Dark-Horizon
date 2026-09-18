# Project Aegis — Prop Editor 2145 Patch Notes

**Build:** `v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH`

This patch restores the visual models that shipped with the original 1155 Prop Editor Foundation Tool for the twelve props that had direct counterparts in that first editor. Those definitions now replace the later legacy-derived versions in the live shared prop library, so the same models are used by the game, the Prop Editor, and the Runtime Test Gallery.

The restored models are Tree, Lamp Post, Stop Sign, Vending Machine, Newspaper Machine, Bus Stop, Street Bench, Crates, Concrete Barrier, Fence Segment, Rock, and Bush.

The later 2058 definitions have not been discarded. A complete immutable copy of the previous 57-prop library is included at `assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json`. The recovered twelve Foundation originals are also stored separately in `assets/data/aegis-prop-factory-originals-1155.json`, establishing a clean factory source for the planned per-prop **Revert to Original** feature.

The Prop Editor remains fully editable and now exports the fixed installed-app gallery launcher introduced in 2120, preventing an editor export from accidentally restoring the earlier `Invalid URL` bug.

## Roadmap follow-up

Automatic live prop publishing remains the next authoring-workflow milestone: editor saves should update the game's active prop model automatically, snapshot the prior version as last-known-good, retain the immutable factory original, and expose per-prop **Restore Last Backup** and **Revert to Original** controls. Save format remains 4.
