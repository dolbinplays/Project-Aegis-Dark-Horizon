# CODEX HANDOFF — v0.26.09.09.1628_REINFORCEMENT_LIVENESS_AUTHORITY_HOTFIX

This is a follow-up to Browser 1517 using the user's exact failing campaign save as an executable regression fixture.

## Confirmed defect
Fresh aliens created by `tacticalAlienReinforcementArrival(...)` had positive HP but omitted `alive:true`. Terminal authority uses `alive !== false && hp > 0`, while Classic/Simulation paths still contain truthy `unit.alive` filters. The exact save therefore ended with two 34-HP ghost reinforcements (Pale Commander + Needle Drone), displayed Alien survivors 0, and `Mission unresolved`.

## Repair
- Both reinforcement constructors now set `alive:true`.
- Post-reveal reinforcement records normalize liveness while preserving explicit false as death authority.
- Classic Lineup and resolver terminal summaries use `tacticalPlaybackFrameUnitAuthoritativeAlive(...)` for parity with terminal/result authority.
- Keep Browser 1517's incorporated-arrival commit helper. Do not revert Browser 1242 casualty reconciliation.

## Executable regression
The exact uploaded East Asia/Threat 2/Tide Horror/$360k save fixture was run through the actual resolver. 1517: `success:false`, two 34-HP omitted-alive reinforcements. 1628: `success:true`, reinforcement actors participate and both are dead at terminal success.

Save format remains 4. Preserve the queued Mobile upper-right tactical HUD and Classic Lineup civilian/VIP/victory roadmap items.
