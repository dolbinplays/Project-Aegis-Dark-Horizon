# Browser 0039 — Escort Breach Egress + Standing Order Resume Validation

Build: `v0.26.10.01.0039_ESCORT_BREACH_EGRESS_AND_STANDING_ORDER_RESUME_HOTFIX`  
Save format: **4**

## Live save reproduction

The supplied Browser 0038 Urban Scout Raid save was inspected directly. Celine remains alive at full 72 TU, is the physical `escortId` owner of three living/unrescued VIPs (Avery, Morgan, Reese), and carries Active Escort priority state. Buffered rounds omit useful Celine extraction movement. The shelter's west opening is stored as `breach-rubble`, `buildingPart: breach`, `breached: true`, HP 12; the previous building-exit helper accepted only `hp <= 0`. Browser 0039 shares the explicit passable-breach authority with VIP approach logic.

The same save contains intact six-waypoint `fireTeamCommandPatrolRoute` arrays for Delta, Echo, and Foxtrot, with issued round 19. Their command kinds/order IDs had already been cleared at round 21 with `assisted-objective-complete` (Delta/Echo) and `beacon-destroyed` (Foxtrot), proving serialization retained the route and objective cleanup stranded it before save. Browser 0039 preserves standing orders during completion and repairs this narrow 0038 residue.

## Automated contracts

- A `breach-rubble` opening with residual HP is recognized as passable; an intact wall is not.
- Beacon completion clears the temporary explicit objective but preserves an active Patrol Route.
- Stranded patrol residue reconstructs the active Patrol kind, target, index, and order identity without changing waypoint order.
- Repair is gated to known Beacon/Assist completion reasons and a complete shared patrol route.
- Both VIP-approach and escort-extraction opening discovery call the same passable-breach helper.
- Repair executes before ordinary streamed round planning.
- Save format remains 4.

## Installed-game acceptance

1. Load the reported Browser 0038 save under 0039.
2. Continue Simulation/Hybrid AI and confirm Celine receives Priority-2 escort movement through the breached shelter wall, then advances the three VIPs toward the Skyranger.
3. Open Orders for Delta, Echo, and Foxtrot. Confirm their original six-waypoint patrols are active and retain their saved order/index.
4. Let a temporary Beacon/Assist objective complete while another Patrol/Fallback/Check standing order exists; confirm the standing order resumes instead of clearing.
5. Save/reload during patrol and repeat one combat interruption/resumption.
