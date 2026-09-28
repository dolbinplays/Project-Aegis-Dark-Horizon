# Door jamb seam geometry — September 27 build 0004

The existing seam renderer used projected bounding spans along a center-to-center ray. On staggered rows those spans can overestimate the actual surface reached by the connector. The new geometry starts at the side jamb outer endpoint, intersects the neighboring wall rectangle, and adds 0.02 world units of overlap at each end. Connector depth matches the frame; front/back neighbors cannot produce doorway infill. No changes to door panels, hinge pose, collision, TU, LOS, locks or save data.

Validation:
- 3 new geometry tests: both row parities, door orientations, sides and neighboring wall orientations; actual wall-face contact and full-width aperture clearance; front/back exclusions; state independence and no input mutation.
- 9 procedural wall-continuity regressions across tetromino families/rotations.
- 11 interactive door regressions.
- 6 structural/door-default regressions, including generated seam records and breached-door exclusion.
- Release/build/syntax/whitespace checks.
- Full repository suite not rerun.

Live visual acceptance pending: inspect rectangular and T/L/J/S/Z facades in Iso/FPV/TPV, including open, closed and breached doors and concave recesses.
