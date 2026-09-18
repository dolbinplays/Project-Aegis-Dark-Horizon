# Codex Handoff — Prop Presentation Authoring 2358

Build: `v0.26.09.17.2358_PROP_VARIANTS_DAMAGE_STATES_AND_ATTACHMENT_ANCHORS_PATCH`
Save format: **4**
Baseline: pushed `2205_LIVE_PROP_PUBLISHING_AND_SAFE_REVERT`.

## New schema (backward compatible)
Each prop may now carry `presentation` with:
- `damageThreshold`
- `damageStates.damaged` / `damageStates.destroyed` (model-shaped objects)
- `variants[]` (model-shaped objects with stable ids/names)
- `attachments.vehicleLighting` (`headlamps`, `beamOrigin`, `beamTarget`, `taillights`) at the base presentation level, with optional target-specific `attachments.vehicleLighting` overrides on damage states / variants

The original top-level `components`, `rootTransform`, and `collision` remain the Intact/base model.

## Runtime
The shared-library bridge selects damaged/destroyed states by HP, chooses cosmetic variants deterministically, and overrides vehicle lamp/beam attachment coordinates while preserving the existing multi-hex footprint, road rotation, and real Three.js spotlight behavior.

## Safety / recovery
Missing states fall back to Intact. Existing 2145 factory files remain immutable. The direct-copy package keeps the prior 2205 canonical library as `aegis-prop-last-known-good.*`.
