# UFO delivery landing foundation

Build: v0.26.09.24.0010_UFO_DELIVERY_LANDING_FOUNDATION_PATCH

The existing dropship path now rejects hard cover anywhere in its hull/ramp footprint, supplementing building, vehicle, unit and craft separation checks. New successful arrivals store a versioned landing record inside dropship state with source ID, wave, landed round, detached hull/ramp cells, arrival IDs and a deterministic hull anchor nearest the footprint center. Normalization clones that optional record; legacy states receive no inferred record.

Four behavioral tests cover every occupied hull/ramp cell, hard-prop rejection and fallback search, both craft orientations, deterministic anchors, actual reinforcement arrivals and saved-state normalization without aliasing.

This does not enable UFO-delivered beacons. Existing beacon deployment, wave timing and mission gates remain in effect. Flight observation, a complete landed round, takeoff, exact center reservation and atomic source handoff still require implementation. No live browser acceptance performed. Save format remains 4.

Full regression suite: 503 tests, 468 passed, 35 pre-existing failures; no new failure names. Packaging, build seam, embedded JavaScript syntax and whitespace checks pass. Log: E:/JoshGameProjects/GitHub/PADH GPT Files/ufo-delivery-landing/regressions.txt.
