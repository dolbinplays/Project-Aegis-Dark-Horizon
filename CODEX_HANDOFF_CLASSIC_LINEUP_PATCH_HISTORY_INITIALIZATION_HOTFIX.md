# CODEX HANDOFF — v0.26.09.10.1735_CLASSIC_LINEUP_PATCH_HISTORY_INITIALIZATION_HOTFIX

Browser 1223 is the gameplay baseline. This is a startup-only release-history scope hotfix. `PATCH_NOTES_HISTORY` is local to `AlienResponseCommand()`, so every mutation of that array must remain inside that controller after its declaration and before the history sort. Browser 1223 accidentally added its current history entry after the controller closed, producing `ReferenceError: PATCH_NOTES_HISTORY is not defined` at startup.

The Browser 1223 entry is now frozen as a literal build ID inside the established initialization sequence and Browser 1735 inserts its current entry there. Do not move patch-history mutations to module scope unless PATCH_NOTES_HISTORY itself is first deliberately refactored to module scope.

No tactical/gameplay behavior is intentionally changed. Preserve Browser 1223 visible-target rendering and outcome-preserving fast pacing, Browser 0810 rolling Classic planning/UFO beam, shared resolver/terminal authority, and save format 4.

---

