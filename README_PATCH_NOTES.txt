PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.0215_BREACH_INTERIOR_FLOORS_AND_PERSPECTIVE_BACKDROPS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds three related tactical-environment improvements: deliberate breach-and-clear interaction, building-specific interior floor hexes, and setting-specific FPV/TPV horizon scenery. The goal is to make buildings feel like actual interiors, make entering them more tactical, and make perspective-camera missions feel located in a larger world instead of ending at a flat/empty horizon.

DELIBERATE BREACH-AND-CLEAR
---------------------------
- Tactical action panel now includes `Breach - 14 TU`.
- Select Breach, then select an adjacent revealed building wall, window, or partition.
- The selected soldier must be alive, human-controlled, and carrying a weapon.
- Ballistic breaching consumes 3 rounds; energy weapons use the action without ballistic ammunition cost.
- The action uses the existing structural breach authority and produces the established passable `breach-rubble` opening.
- Indestructible geometry, alien beacons, Skyranger hull cells, non-building props, and destroyed structures are not valid deliberate-breach targets.
- After the opening exists, ordinary player movement, fire-team formation, VIP/civilian escort routing, LOS, fire/smoke hazards, and AI pathing all consume the same changed cover state.

BOUNDED AI BREACH-AND-CLEAR
---------------------------
- VIP-rescue AI fire-team leads can use the deliberate breach action when already adjacent to the VIP's building.
- The behavior only considers a nearby VIP and avoids breaching when a normal doorway is already close.
- The AI pays the same TU/ammunition costs as the player action and recalculates remaining movement afterward.
- This is intentionally conservative; AI does not generically demolish structures during ordinary navigation.

BUILDING INTERIOR FLOOR HEXES
-----------------------------
- Building archetypes now specify floor patterns: tile, linoleum, concrete, checker, wood, or plank.
- 2D tactical cells use patterned indoor backgrounds.
- Persistent 3D Iso uses matching generated ground textures for interior hexes.
- Interior cells greatly reduce neighbor-color blending so outdoor grass/soil/asphalt no longer washes into the room floor.
- FPV and TPV continuous ground draw the same indoor patterns before perspective texture generation.
- TPV still uses Browser 2315's smoothed continuous-ground variant, so interior detail does not restore the earlier flickering shared hex edges.

FPV / TPV SETTING-SPECIFIC BACKDROPS
------------------------------------
- FPV, TPV, and incoming-fire reaction TPV now show a lightweight mission horizon beyond the playable map.
- Urban missions: low-contrast geometric city skyline.
- Small-town missions: low buildings plus distant tree-line forms.
- Farmland missions: distant ridges, vegetation forms, and simple farm structures.
- Forest/wilderness missions: layered low-poly tree silhouettes.
- Arid/tundra/selected wilderness regions: broad geometric mountain silhouettes.
- Background geometry is deliberately translucent and visually subdued, with horizon haze, so it adds environmental context without pulling attention away from combat.
- 3D Iso hides the perspective backdrop and retains the existing tactical-board presentation.

PERFORMANCE / COMPATIBILITY
---------------------------
- No new external art files are required.
- Interior patterns are procedurally generated.
- Horizon scenery uses lightweight Three.js primitive geometry built with the mission atmosphere and then reused.
- The backdrop follows the existing camera-relative sky-root behavior and is toggled by perspective/iso camera ownership.
- Save format remains 4.
- Browser 0115's startup TDZ hotfix remains intact; the new patch constants are initialized in the early tactical constants block.

VALIDATION
----------
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Isolated helper harness passed:
  * deliberate wall breach -> `breach-rubble`
  * 14 TU expenditure
  * 3 ballistic rounds expenditure
  * patterned interior CSS generation
  * urban mission -> `cityscape` backdrop profile
- Build Health adds a combined contract for deliberate breaching, indoor-floor metadata/presentation, AI rescue breach source, and perspective-backdrop ownership.

MANUAL TEST GATES
-----------------
1. Launch the build and confirm there is no startup/runtime error.
2. Place a soldier adjacent to a building wall; use Breach and verify the opening becomes passable.
3. Confirm a ballistic breach costs 14 TU and 3 rounds.
4. Compare indoor and outdoor ground in 3D Iso, FPV, and TPV. Indoor hexes should clearly read as room flooring.
5. Check multiple building types; flooring should not all look identical.
6. In an urban FPV/TPV mission, verify a subdued city skyline exists beyond the tactical level instead of a flat empty horizon.
7. Check wilderness, farm, and small-town perspective views and verify the distant background changes with the mission setting.
8. Move/rotate the FPV/TPV camera and confirm the background stays distant and does not distract from combat.
9. Return to 3D Iso and confirm the perspective backdrop is hidden.
10. Re-test night lighting, fire/smoke routing, VIP extraction, vehicle-footprint blocking, and TPV ground-edge stability for regressions.

ROADMAP
-------
Multi-floor/multi-level structures and multi-deck alien craft remain planned future Stage 3 work. Browser 0215 deliberately improves the single-level building foundation first: interior identity, controlled breaching, and stronger perspective environmental context.
