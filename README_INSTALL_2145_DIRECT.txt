AEGIS 2145 ORIGINAL PROP MODEL RESTORATION + FACTORY BACKUP — DIRECT COPY ZIP

BUILD
v0.26.09.17.2145_ORIGINAL_PROP_MODEL_RESTORATION_AND_FACTORY_BACKUP_PATCH

BASELINE
Built against pushed GitHub main commit f5a9d2c2ef49286d31616808654ce3e408e4f7b5 (2120 gallery URL hotfix).

INSTALL
1. Close the game/editor if open.
2. Extract this ZIP directly into the root of Project-Aegis-Dark-Horizon.
3. Allow Windows to merge folders and replace files.
4. Commit/push the changed files as usual.
5. After the installed app receives the update, open the Prop Runtime Test Gallery with Ctrl+Shift+G and inspect the restored models.

WHAT CHANGED
- Restored the exact original 1155 Foundation Tool authoring models for: Tree, Lamp Post, Stop Sign, Vending Machine, Newspaper Machine, Bus Stop, Street Bench, Crates, Concrete Barrier, Fence Segment, Rock, and Bush.
- Those 12 are now the canonical live shared-library definitions used by the game and Prop Editor.
- The previous 2058 57-prop library is preserved unchanged at assets/data/aegis-prop-library-2058-pre-foundation-restore-backup.json.
- An immutable 12-prop factory-original snapshot is stored at assets/data/aegis-prop-factory-originals-1155.json for the planned Revert to Original workflow.
- Remaining 45 editable props are unchanged except build/QA metadata.
- The 2120 installed-app Prop Test Gallery URL hotfix is preserved.
- The 2145 editor export now embeds the fixed gallery launcher so exporting from the editor will not regress the 2120 fix.

SAVE FORMAT
Remains 4. No campaign save schema change.
