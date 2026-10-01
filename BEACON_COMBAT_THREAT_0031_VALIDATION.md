# Browser 0031 — Beacon Combat Threat Formation Bypass

## Report addressed

When AEGIS finished a visible-alien firefight with a legitimately known/revealed Alien Field Beacon still active, a fire team assigned to the Beacon could spend its next movement re-establishing formation before resuming the Beacon assault. This contradicted the established Browser 0024 doctrine that a known active Beacon is an immediate combat target rather than quiet post-contact work.

## Fix

- An active, revealed Beacon with confirmed reinforcement knowledge and an explicit fire-team Beacon assignment now creates `beaconCombatThreatActive` for eligible team members.
- That state immediately clears/suppresses the post-contact formation-recovery latch. The team does not wait to re-form before resuming the Beacon assault.
- Ordinary formation-target movement is disabled while the Beacon combat-threat state owns the action.
- Every assigned team member receives the active Beacon as a legitimate direct threat target when no currently visible alien wins target selection.
- Soldiers that cannot already make an immediate legal Beacon attack use direct-contact-style movement toward the Beacon rather than first moving to a formation slot.
- Existing same-tier alien/Beacon target comparison remains intact: immediate visible alien danger and the Browser 0024 distance/effectiveness comparison can still select an alien during the mixed fight.
- Last Known Contact, active escort, urgent medical/casualty authority, shield knowledge, TU/ammunition, hazards, occupancy and movement legality remain unchanged.
- Save format remains 4.

## Automated/source-contract verification

1. Current runtime identifies Browser 0031 and save format 4.
2. Beacon combat-threat state requires an active revealed Beacon, confirmed Beacon knowledge and an assigned Beacon objective.
3. Last Known Contact and active civilian/VIP duty still suppress the Beacon direct-response state according to the existing higher-priority hierarchy.
4. Post-contact recovery is explicitly completed/suppressed when the assigned Beacon remains an active combat threat.
5. Formation targets are disabled while `beaconCombatThreatActive` is true.
6. Assigned members receive `beaconCombatThreatTarget` rather than falling through to formation/search movement.
7. Initial and extension movement both expose direct Beacon approach through `tacticalAiDirectContactPlan(...)` while preserving the ordinary spotted-alien approach path.
8. All five executable inline runtime JavaScript blocks parse with `node --check` after the hotfix.

## Installed-game field acceptance

Reproduce the original case with an assigned Beacon team:

1. Begin with visible aliens and a revealed/known active Beacon in the same engagement.
2. Let the assigned team become scattered while fighting.
3. Kill or lose current alien contact while the Beacon remains active.
4. Confirm the team does **not** stop or move backward/sideways simply to restore its pre-contact formation.
5. Confirm the assigned soldiers immediately advance toward or attack the Beacon using legal TU/path/cover/shield rules.
6. Repeat with an alien still visible and confirm Browser 0024 same-tier target selection still decides between that alien and the Beacon without a formation-recovery detour.
7. Repeat with an unresolved Last Known Contact and confirm the approved global priority stack is unchanged.
8. Repeat in Simulation and autonomous Hybrid support, then save/reload during the unfinished Beacon assault.
