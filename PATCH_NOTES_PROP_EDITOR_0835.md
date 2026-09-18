# Project Aegis — 0835 Generated Prop Damage & Destroyed States Patch

Build: `v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH`

## Added
- Generated editable **Damaged** and **Destroyed** presentation models for all 57 shared props with positive HP.
- Category-aware damage generation: organic collapse, bent roadside fixtures, structural breakage, stone/rubble breakup, vehicle wreck deformation, and furniture/cabinet collapse.
- Vehicle damaged/destroyed models include state-specific lighting anchor positions so gallery review remains coherent.
- Each generated state is marked `generated-unreviewed` as an editable starting point.
- Prop Editor target labels identify generated states for review.
- Runtime live-library migration now fills missing generated states from the project file while preserving any user-authored damaged/destroyed models already stored in the browser.
- Preserved exact 2358 pre-generation library at `assets/data/aegis-prop-library-2358-pre-generated-damage-backup.json`.
- Added immutable generated-state baseline `assets/data/aegis-prop-generated-damage-baseline-0835.json`.

## Compatibility
- Save format remains **4**.
- Intact/base models are unchanged by this patch.
- Existing custom damage states in a same-origin live editor library take precedence over generated defaults.
