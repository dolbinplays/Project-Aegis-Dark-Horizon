# Project Aegis — v0.26.09.17.2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH

- Added editable **Intact / Damaged / Destroyed** presentation model targets.
- Added optional cosmetic model variants with deterministic runtime selection from stable cover identity.
- Missing damage states and variants safely fall back to Intact; campaign save format remains 4.
- Added model-local vehicle lighting anchors for left/right headlights, beam origin/target, and left/right taillights; damage states and variants can carry target-specific overrides.
- Seeded model-aligned anchors for sedan, van, utility pickup, and bus.
- Runtime vehicle footprint and road rotation remain game-authoritative.
- Prop Editor component, root-transform, collision, live-publishing, revision-history, and project-mirroring workflows now operate on the selected model target.
- Runtime Test Gallery now exercises damage state, HP threshold, deterministic variants, day/night vehicle lighting, and anchor visualization.
- Factory recovery remains based on the immutable 2145 library; 2205 is preserved as the direct-copy last-known-good whole-library backup.
