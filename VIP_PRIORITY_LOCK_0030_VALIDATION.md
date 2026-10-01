# Browser 0030 — VIP Priority Lock Sticky Rescuer Hotfix

The reported problem was reproduced in source review as split authority between the team-level civilian objective, the actor-level VIP Priority Lock helper, and the central Default-AI objective resolver. The commitment helper could also drop/transfer a rescuer when no route was available on the current planning pass.

## Fix

- Existing eligible commitment ownership is now sticky even when the immediate route is blocked.
- Temporary priority-1 stabilization, fear override, or an already-owned casualty task can suspend the same rescuer without transferring the VIP assignment.
- New ordinary casualty-recovery/extraction selection excludes an actionable locked rescuer.
- The central resolver exposes `VIP_PRIORITY_LOCK` at priority 25 for the chosen rescuer, between Active Escort (20) and Visible Alien (30).
- Route invalidation does not erase civilian approach scratch when `VIP_PRIORITY_LOCK` is the current authority.
- The tactical current-order HUD reports `VIP PRIORITY LOCK`.

## Automated checks

- Focused executable Node behavior harnesses: 7/7 passed — blocked route retains rescuer, stabilization preemption retains ownership, genuinely unavailable/dead rescuer is replaced, a soldier already escorting another civilian is not selected, the central resolver elevates the locked rescuer correctly, VIP approach state survives priority transitions, and casualty-recovery exclusion wiring is present.
- Eight in-runtime Build Health contracts cover blocked-route ownership, stabilization suspension without transfer, central-priority ordering, route-state preservation, casualty-recovery exclusion wiring, HUD feedback, sticky-existing-owner selection, and save format 4.
- All five executable inline runtime JavaScript blocks pass `node --check`.
- Release seam verification checks embedded-runtime byte identity, SHA-256/byte metadata, service-worker/build identities, and ZIP integrity.

## Installed-game acceptance

Assign a civilian/VIP objective to a fire team and enable VIP Priority Lock. Observe the named committed rescuer through: visible alien contact; a temporarily blocked door/path; a bleeding casualty that requires stabilization; a separate downed AEGIS casualty; contact with the assigned civilian/VIP; escort formation; and extraction. The lock should remain on the same soldier except when that soldier becomes genuinely unavailable, and no hidden target information should be revealed. Repeat in Simulation and autonomous Hybrid support, including save/reload during the approach.
