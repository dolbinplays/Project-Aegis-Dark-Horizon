# Tactical helmet identity

Build: v0.26.09.24.0007_TACTICAL_HELMET_IDENTITY_PATCH

Scope: saved helmet markings only. Portraits/Classic Lineup and tactical meshes share the marking/color definition. Classic and both articulated detail levels receive bounded geometry parented to the helmet/head. Persistent appearance keys include the marking; classic helmets follow facing changes. No new textures, campaign fields or combat behavior.

Four tests use the bundled Three.js to check all five markings, geometry bounds/vertex limits, colors, missing/unknown/unequipped cases, classic facing and save/appearance signatures. Packaging, build seam and embedded JavaScript checks pass.

Each marked soldier adds one mesh/draw submission. No frame-rate improvement is claimed. Geometry and material are owned by the soldier node and use the existing subtree disposal path.

Live visual acceptance remains pending: compare named soldiers' portraits and helmets in Classic, articulated Quality and Performance modes; inspect turning, kneeling/prone poses and TPV. Face/hair/accessory and uniform insignia parity remain follow-up work.

Full suite: 492 tests, 457 passed, 35 pre-existing failures; no new failure names. Log: E:/JoshGameProjects/GitHub/PADH GPT Files/helmet-identity/regressions.txt.
