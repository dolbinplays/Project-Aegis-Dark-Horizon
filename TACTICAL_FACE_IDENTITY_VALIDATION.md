# Tactical face identity

Build: v0.26.09.24.0009_TACTICAL_FACE_IDENTITY_PATCH

Scope: eyes/mouth plus existing scar, glasses, mustache and bandage appearance. Classic heads own the feature mesh; articulated heads/head joints own equivalent features, with the shared head shape applied in mid-detail. Mustache color derives from saved hair. Appearance changes refresh persistent model identity.

The feature mesh is vertex-colored and subdivides long strokes along the head surface. It adds one draw submission per soldier; no textures or external assets. Owned geometry/materials are disposed through the existing subtree cleanup. No performance improvement is claimed.

Eleven focused identity tests pass, including all supported accessories, finite/bounded geometry, disposal events, saved identity, head proportions, turning and helmet markings. Build seam and embedded JavaScript checks pass.

Live visual acceptance remains pending: compare portraits against classic/Quality/Performance models, especially glasses and bandages under helmets, TPV close-ups, prone and casualty poses. Hair, comms and uniform insignia remain future scope. Save format 4 and combat behavior are unchanged.

Full regression run: 499 tests, 464 passed, 35 pre-existing failures; no new failure names. Log: E:/JoshGameProjects/GitHub/PADH GPT Files/face-identity/regressions.txt.
