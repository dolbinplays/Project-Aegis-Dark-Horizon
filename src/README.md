# Project Aegis Source Layout Prep

This folder is the staging area for gradually moving Project Aegis away from a single monolithic `index.html` without breaking the current playable artifact.

Current rule:
- `index.html` remains the playable distribution build.
- Source files in `src/` are contracts and extraction targets until a later build step is introduced.
- Do not move runtime code out of `index.html` unless the generated/playable artifact is verified by Build Health.

Planned source areas:
- `src/data/` - campaign constants, equipment, aliens, facilities, mission tables, text catalogs.
- `src/systems/` - deterministic simulation helpers for time, aircraft, UFOs, bases, soldiers, missions, and logistics.
- `src/ui/` - panel/view components and UI adapter helpers.
- `src/tests/` - Build Health fixtures and static seam checks.
- `src/assets/` - asset manifest data that maps game concepts to files in `assets/`.

Portability goals:
- Keep campaign state JSON-friendly.
- Keep simulation helpers deterministic and UI-independent.
- Keep browser UI as an adapter over game state, so a later Godot 4 version can reuse the same concepts and data contracts.
- Preserve save compatibility during every extraction step.
