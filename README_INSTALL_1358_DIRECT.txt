Project Aegis 1358 — direct-copy editor patch

Copy the ZIP contents into the root of Project-Aegis-Dark-Horizon, preserving paths.

Primary entry point:
  AEGIS_Prop_Editor_CURRENT.html

The new editor depends on files already present in the current Project Aegis tree, especially:
  AEGIS_Prop_Editor_v0.26.09.18.0835_GENERATED_PROP_DAMAGE_AND_DESTROYED_STATES_PATCH.html
  assets/data/aegis-prop-library.js
  assets/data/aegis-prop-placement-rules.js

This patch is additive to the 1215 contextual-placement release. It changes the editor authoring experience only; the 1215 game runtime placement resolver remains unchanged.

Save format: 4
