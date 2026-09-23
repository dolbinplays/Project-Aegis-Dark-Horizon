# Synchronized Escort Movement

Build: v0.26.09.23.0001_SYNCHRONIZED_ESCORT_MOVEMENT_PATCH

AI and Hybrid playback now group dragged casualties with their carrier, including patients listed first in the roster. Civilian/VIP followers also stay with an escort whose shooting action occurs later in the action order. Valid recorded companion trails follow the escort's vacated cells rather than being reconstructed against static escort occupancy.

Playback hydration retains drag links, prone/unconscious status and extraction flags. Extracted patients remain visible until movement completes. Manual movement continues to advance escorts, civilians and dragged casualties in the same step. Single-file ramp boarding remains sequenced after approach; medical costs, recognition and save format 4 are unchanged.

## Validation

- Six full-runtime companion tests pass, covering casualty roster order, extraction, missing links, civilian/VIP escorts who fire and manual movement.
- All 18 playback scheduler behavioral checks pass, including simultaneous carrier/patient steps and deferred extraction visibility.
- Focused recovery, stabilization, movement and vehicle-footprint run: 37 test-runner checks pass (the scheduler file contains 18 internal checks).
- Full suite: 455 checks, 420 passed, 35 failed. Failure names match the previous fence-patch baseline exactly; no new failures.
- Packaged runtime identity, build seams, embedded JavaScript syntax and whitespace checks pass.

## Live acceptance pending

In Manual and AI/Hybrid control, escort a VIP/civilian and drag an unconscious stabilized soldier toward a Skyranger. Check simultaneous movement in 2D and Three.js views, including a turn where the escort fires, then confirm the casualty remains visible through its final drag step and disappears on extraction. Save/reload mid-route and confirm escort ownership persists. Automated tests do not replace this visual check.
