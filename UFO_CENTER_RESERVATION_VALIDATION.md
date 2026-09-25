# UFO center reservation

Build: v0.26.09.25.0005_UFO_CENTER_RESERVATION_PATCH

New transport geometry includes the formerly empty central hull hex at rampCenter.y + bodySign * 3. It is separate from all three ramp cells and participates in existing footprint validation and hard-cover collision. deliveryCenter is committed at craft creation; the landing record copies that coordinate into beaconCenter. Older placements lacking a valid center retain the existing hull-anchor fallback, and saved records are never recentered during normalization or handoff.

Validation: 24 focused UFO tests pass. New coverage checks both headings and edge-clamped anchors, occupied/blocked center rejection, passable ramps, detached record coordinates, real arrival exclusion, JSON save/normalization and exact beacon placement, plus legacy saved-anchor retention. Existing observation, landing, disembarkation and handoff tests pass. Package, build seam, embedded syntax and whitespace checks pass. Full suite was not rerun for this bounded patch.

Live visual acceptance remains pending. No flight animation or initial/replacement-beacon conversion is included. Save format remains 4.
