# Civilian & VIP Emergency Aid

Build: v0.26.09.23.0002_CIVILIAN_VIP_EMERGENCY_AID_PATCH
Save format: 4

## Behavior

Noncatastrophic fatal alien gunfire has a 5–15% chance of leaving an unarmored civilian/VIP alive, unconscious and bleeding, scaled by overkill severity. Actual equipped armor raises that range to 20–30%. Overkill beyond 25% of maximum HP (rounded up, minimum two HP) and further fatal hits on an incapacitated casualty remain fatal. Explosive and fire lethality are unchanged.

An adjacent conscious soldier can assess for 8 TU without spending a medical charge. The existing medical button or clicking the casualty performs assessment, then stabilization with the existing TU cost and one Field Medkit charge. A stabilized survivor remains unconscious; clicking them secures/releases a drag, with existing drag costs. Reaching the Skyranger ramp performs physical extraction. Stabilization alone does not count toward rescue quotas.

AI triage uses the same medical functions and responder ownership. Where TU permits, assessment and stabilization happen in the same turn with both costs paid. Medical responders respect Hybrid player ownership. Unrevealed non-VIPs require visibility before AI medical targeting. Incapacitated civilians cannot walk, panic-run, answer shelter callouts, join an ordinary escort or board themselves. Playback groups them with their carrier and preserves medical state. Debriefs distinguish stabilized, extracted alive, lost and not extracted.

## Automated validation

- Twelve new real-runtime tests pass: severe-hit survival and overkill; assessment costs and constraints; stabilization without revival; bleeding expiry; blocked autonomous movement/boarding; drag extraction and serialized state; AI treatment/ownership; rescue quota and report outcomes; actual mission-round snapshots; combined AI action costs; hidden-casualty targeting; actual manual click callbacks; and civilian carrier playback (some cases grouped).
- Existing stabilization recognition and optional soldier recovery tests pass alongside the new tests (35 total).
- Final complete test-run summary: 467 checks, 432 passed, 35 failed; failed names match the prior escort patch baseline with no new failures. PowerShell reported a disk-space error while redirecting output to C: TEMP; the written log contains the complete test counts. C: reported zero free bytes afterward. Final focused tests and package checks were repeated directly without writing to C: TEMP.
- Packaged runtime identity/build seams, embedded JavaScript syntax and git whitespace checks pass.

## Live acceptance pending

In Manual and AI/Hybrid play, observe an incapacitated civilian/VIP, assess them, stabilize them, save/reload, and drag them into a Skyranger. Verify CHECK/CRITICAL/STABLE presentation in 2D and prone appearance in Three.js, synchronized escort movement, and the final rescue/debrief totals. Confirm an untreated casualty bleeds out and a dead civilian cannot be revived. Actual play balance and visual acceptance have not been claimed.

## Roadmap intake

Objective-based team distance sorting is recorded separately as planned: click an objective at the top of the assignment screen to order teams from nearest to farthest vertically. It is not implemented in this medical patch.
