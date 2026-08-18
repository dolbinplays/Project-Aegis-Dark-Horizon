PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.2355_TACTICAL_FIRE_SMOKE_PROPAGATION_FOUNDATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Introduces the first gameplay-authoritative tactical fire and smoke propagation layer. Destruction can now leave persistent flames instead of ending as a purely static damaged object. Fire can damage exposed units, burn and spread through suitable cover, emit short-lived drifting smoke, and provide real local illumination during Night Operations. Dense accumulated smoke now participates in line-of-sight checks. The implementation is deliberately bounded and turn-based so it adds environmental tactics without creating an expensive continuous simulation.

FIRE CREATION AND PERSISTENCE
-----------------------------
- Destroying a building PWR control can seed an electrical fire.
- Destroyed road vehicles can ignite, including vehicles that previously supplied headlights.
- Grenades and energetic weapon destruction can ignite flammable battlefield objects such as trees, brush, hay/crops, crates, timber construction, and selected interior furnishings.
- Open flame is stored as a non-solid tactical hazard rather than hard cover, so it does not become an artificial pathfinding wall.
- Fire persists for a bounded number of completed tactical rounds.

BURNING COVER AND SPREAD
------------------------
- Suitable intact cover can become `burning` rather than immediately becoming a separate fire tile.
- Burning cover takes structural burn damage each hazard step and can eventually collapse/breach through the existing structural-damage system.
- When burning cover collapses, the location can retain an open-flame hazard.
- Each active fire source considers nearby flammable cover through a bounded deterministic spread check. There is no unbounded flood-fill or per-frame propagation simulation.

UNIT FIRE DAMAGE
----------------
- A living unit occupying an active flame cell at the end of a completed tactical exchange takes fire damage.
- The shared rule applies to AEGIS, aliens, civilians, and VIPs.
- Fire damage and structural burn damage are centralized in `TACTICAL_FIRE_SMOKE_RULES` for later balancing.

SMOKE AND LINE OF SIGHT
-----------------------
- Active fire emits short-lived smoke into a deterministic neighboring open cell.
- Smoke is non-solid and does not block movement or become physical projectile cover.
- Smoke density is now indexed in the tactical visibility context.
- LOS counts smoke density along the actual hex line between observer and target. Enough accumulated smoke blocks visibility even without a solid wall.
- Humans currently lose LOS at a lower accumulated smoke threshold than aliens, preserving the aliens' modest low-visibility advantage.
- Fire cells themselves contribute a smaller smoke-obscuration value.

NIGHT OPERATIONS INTERACTION
----------------------------
- Open flames are now real local tactical light sources with an approximately four-hex illumination radius.
- Burning cover also emits open-flame illumination while it remains structurally present.
- Fire feeds the same Night Operations light authority as street lamps, headlights, interior lights, Skyranger lamps, Weapon Lights, Field Flares, and alien beacon glow.
- Fire can therefore improve local night visibility even while the smoke it produces may later obstruct a longer sightline.

2D / THREE.JS PRESENTATION
--------------------------
- 2D tactical view gains explicit FIRE and SMK glyphs.
- Persistent Three.js renders flame hazards with inexpensive emissive flame/smoke geometry.
- Smoke hazards render as translucent clustered volumes.
- Burning intact cover keeps its ordinary model and receives a small flame/smoke overlay, so its identity and structural state remain readable.
- Presentation uses the same authoritative hazard records as damage, spread, LOS, and lighting.

TURN / AI INTEGRATION
---------------------
- The shared environmental-hazard step runs at completed-round boundaries during manual tactical play.
- Simulation/Hybrid AI resolution calls the same hazard step before recording the next tactical exchange frame.
- Area-secure rounds that remain open for reinforcements, beacon objectives, or VIP rescue also advance environmental hazards instead of freezing fires until another alien appears.

PERFORMANCE AND SAVE COMPATIBILITY
----------------------------------
- Hazard simulation is round-based, not frame-based.
- Fire/smoke/burning metadata participates in visibility and renderer invalidation so changes become authoritative immediately.
- No new external binary assets are required.
- Save format remains 4; the hazard records fit inside the existing tactical cover-state structure.

FIRST-PASS SCOPE LIMITS
-----------------------
This is the foundation, not the final environmental-hazard system. The patch intentionally does not yet add dedicated smoke accuracy penalties, respiratory damage, suppression/panic, movement costs, firefighting/extinguishers, sophisticated wind, explosive fuel chains, or AI hazard-avoidance doctrine. Those can now be layered onto one shared authoritative fire/smoke state instead of being implemented as disconnected effects.

BUILD HEALTH / VALIDATION
-------------------------
- Added an isolated fire/smoke contract that verifies a destroyed power control can create fire, an exposed unit takes fire damage, smoke is emitted, the flame resolves as a light source, smoke enters LOS calculations, and both manual and AI tactical paths invoke the shared hazard step.
- Visibility cache keys now include hazard type, fire intensity/lifetime, smoke density/lifetime, and burning state.
- 2D and Three.js renderer checks require explicit fire/smoke presentation paths.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Destroy a PWR panel during a mission and confirm an electrical fire can remain at the location.
2. Destroy a vehicle or grenade a flammable prop and confirm qualifying destruction can ignite.
3. Keep the operation active for several rounds and confirm fire persists, emits smoke, and can spread to nearby flammable cover without exploding across the map instantly.
4. Leave a living unit on an active flame cell through the end of the round and confirm it takes fire damage.
5. Create enough smoke across a sightline and confirm LOS closes while movement through smoke remains possible.
6. Repeat during a night mission and confirm open flame creates a local illuminated pocket.
7. Confirm burning structural/prop cover continues showing its ordinary object plus flame/smoke feedback until it collapses.
8. Confirm FPV/TPV ground parity from Browser 2315 and all prior Night Operations behavior remain intact.

PREVIOUS BUILD - 2315
=====================

Build: v0.26.08.17.2315_TPV_FPV_GROUND_TEXTURE_PARITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Refines the Browser 2245 TPV continuous-ground fix. Third Person and incoming-fire reaction TPV were already using the same continuous-ground anti-flicker path as FPV, but the terrain still read harsher in TPV because the ground texture presented stronger visible hex boundaries from the chase-camera angle. This patch keeps the same continuous-ground floor and swaps TPV onto a parity-smoothed texture derived from the FPV ground texture so TPV looks much closer to FPV while keeping 3D Iso unchanged.

TPV / FPV GROUND TEXTURE PARITY
-------------------------------
- FPV keeps the original continuous-ground texture already used by Browser 0455.
- TPV and incoming-fire reaction TPV now automatically switch that same continuous-ground plane onto a parity-smoothed texture derived from the FPV terrain canvas.
- The TPV texture is produced by lightly blurring the FPV terrain canvas and blending it back with the original, preserving the same terrain palette and mission-specific ground logic while reducing strong visible hex borders.
- The goal is visual parity: TPV should now read much closer to FPV rather than showing a harsher large-hex mosaic.

WHAT DOES NOT CHANGE
--------------------
- 3D Iso still restores the explicit per-hex ground and the normal command-view board look.
- Terrain authority, pathfinding, movement costs, LOS, tactical visibility rules, target selection, AI knowledge, and combat calculations do not change.
- The patch does not create a second battlefield renderer or a second ground plane.
- Save format remains 4.

PERFORMANCE / VALIDATION
------------------------
- The persistent renderer still builds one continuous perspective floor. Camera mode changes only swap which cached texture that floor material displays.
- Runtime diagnostics now distinguish the base FPV texture from the parity-smoothed TPV texture.
- Build Health verifies the TPV parity texture generation and selection logic in addition to the existing FPV / TPV / reaction-TPV continuous-ground path checks.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Open the same tactical map in FPV and TPV and compare the ground.
2. Confirm TPV terrain now looks much closer to FPV, with softer visual boundaries between hexes.
3. Move the observer and rotate the camera to verify the earlier TPV edge-flicker fix still holds.
4. Trigger an incoming-fire reaction cut and confirm it uses the same softened TPV terrain presentation.
5. Return to 3D Iso and confirm the normal explicit hex board still appears.

CODE / SYSTEM NOTES
-------------------
- `TACTICAL_TPV_GROUND_TEXTURE_PARITY_PATCH` added.
- `tacticalThreePersistentBuildFirstPersonGround()` now generates both an FPV base texture and a TPV parity-smoothed texture.
- `tacticalThreePersistentSetFirstPersonGroundMode()` now swaps the continuous-ground material map by perspective mode and publishes `data-aegis-tpv-ground-texture` diagnostics.
- `tacticalThreePersistentDisposeRuntime()` now disposes the extra TPV texture.

NEXT LIKELY FOLLOW-UP
---------------------
- If this looks right in live play, the next logical tactical polish step is to continue reducing presentation mismatches between FPV/TPV and Iso while preserving exact authoritative gameplay state.
