# Browser 0019 — Transport visuals

Build: `v0.26.09.29.0019_TRANSPORT_WING_CLEARANCE_AND_UFO_FLIGHT_RAMP_PATCH`

## Changes

- Raised main Skyranger wings to the roofline and shortened/moved their inner edges outside the walkable cabin. Engines and exhaust move upward together. Roof, floor, ramp, tailplanes and lighting remain attached in their existing positions.
- UFO approach/departure presentation requests a closed rear hull without ramp or rails. Ordinary landed craft retain the aperture, ramp and interior. Flight completion still hands off to the existing landed model. No new ramp deployment animation is introduced.
- No changes to authoritative placement, cover, pathing, extraction, reinforcement timing or save format 4.

## Validation

- Three new executable Three.js model/integration checks verify wing bounds/cabin clearance, engine attachment, unchanged placement, six UFO headings, landed/flight geometry and both flight event phases.
- Existing UFO landing/disembarkation and TPV/shield/roof tests pass: 19 checks including the new tests.
- Rendered model views inspected from rear-quarter and low-side angles, plus landed/flying UFO comparison. Preview: `E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance/transport-0019.png`.
- Packaging, build consistency, embedded JavaScript syntax and whitespace checks pass. Fresh Edge launcher displays Browser 0019 with no page errors.

## Installed-game acceptance remaining

Inspect deployment and VIP/civilian/casualty boarding in Iso, FPV and TPV, including beside the raised engines/wings. Observe UFO approach, landed disembarkation and departure; ramps should only be present on the landed model. Confirm normal mission progression and extraction.
