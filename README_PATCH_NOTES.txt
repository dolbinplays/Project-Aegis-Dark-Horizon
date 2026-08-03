Alien Response Command / Project Aegis
Patch: v0.26.08.03.0156_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_PARITY_PATCH
Native: v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

Purpose:
- Distinguish mission-wide alien reports from each soldier's personal tactical sight.
- Send every non-escort without personal sight along the shortest practical bounded route toward the nearest reported or last-known alien position.
- Suspend commander-formation, cover, and flank scoring during the direct response so a distant second squad does not hesitate or drift.
- Stop direct convergence as soon as the responding soldier personally sees an alien, then use remaining TU for the existing cover, formation, line-of-sight, range, and firing logic.
- Preserve civilian and VIP escort duty, shot-mode TU reserves, fog of war, reaction fire, bounded pathfinding, and save format 4.

Validation performed:
- Godot 4.7.1 strict project parsing passed.
- Native tests passed 147/147, including report-versus-personal-sight separation, full bounded direct advance, and early transition on personal contact.
- Native Build Health passed 104/104 inside the automated suite.
- All six browser app scripts parsed and the build seam checker passed.
- Localhost start screen and Geoscape loading passed; Browser Build Health passed 327/327.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles with all soldiers alive.
- Tactical-map AI command produced a 33-frame continuation from round 4, and Take Back Control restored the same human-phase battle.
- Browser console contained no runtime errors.

Manual gate:
- Send two squads to a Large incident with wide separation and hand control to AI.
- Let Squad A spot and fire on aliens while Squad B has no personal sight. Confirm every Squad B soldier without an escort heads directly toward the reported contact rather than holding formation near its commander or detouring for cover.
- Confirm Squad B soldiers stop the direct approach when they personally see an alien, then seek cover, establish weapon range and line of sight, and engage while preserving their selected shot reserve.
- Confirm any Squad B soldier already escorting civilians or VIPs continues toward extraction instead of joining the response.
- Break visual contact and confirm responders continue toward the last-known position, then search locally when they arrive.
