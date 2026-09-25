# UFO disembarkation safety

Build: v0.26.09.25.0003_UFO_DISEMBARKATION_SAFETY_PATCH

Replaced hull-only cluster selection followed by obstacle filtering with a deterministic breadth-first search seeded by legal ramp cells. Search is limited to eight steps from ramp seeds, checks complete cover footprints and occupied cells, and yields unique connected positions. Existing arrival code commits no craft, covers or partial wave unless every requested unit fits; insufficient room retains next-round retry.

Validation: 15 targeted tests pass across new disembarkation tests and existing delivery-landing and beacon-handoff suites. Tests cover occupied cells, surrounding hard props, sealed ramps, deterministic output, nonmutation, real arrival, source identity, save/reload, duplicate handoff protection and AI continuation. Final packaging, build seam, embedded syntax and whitespace checks pass. Full suite was not rerun for this bounded patch.

Live installed-game acceptance remains pending. Flight animations and broader initial/replacement beacon conversion are not part of this patch. Save format remains 4.
