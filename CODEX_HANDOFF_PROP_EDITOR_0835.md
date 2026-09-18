# Codex Handoff — AEGIS Prop Editor 0835

Current build: `v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH`
Save format: **4**
Authoritative baseline before this patch: pushed 2358 commit `3dd741b8cff22d8cd56d303eef9f52633b605653`.

## State
The canonical shared library has 57 props. Every one currently has positive HP and now carries explicit editable `presentation.damageStates.damaged` and `presentation.damageStates.destroyed` models. These are generated starting points, not locked assets. The 2358 editor's model-target UI edits them directly.

## Important continuity
- Intact geometry is unchanged.
- 2145 immutable factory base library remains untouched.
- 2358 pre-generation full library is preserved in `assets/data/aegis-prop-library-2358-pre-generated-damage-backup.json`.
- 0835 generated baseline is preserved in `assets/data/aegis-prop-generated-damage-baseline-0835.json`.
- Runtime selection remains HP-driven: destroyed at HP <= 0; damaged at or below each prop's threshold (default 50% HP).
- Same-origin old live libraries are upgraded by merging missing file damage states, without overwriting user-authored state models.
