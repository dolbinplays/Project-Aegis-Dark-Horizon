PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0525_LARGE_ROAD_VEHICLES_BEACON_FLYOVER_AND_FPV_ORDER_HUD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Rescaled civilian road vehicles to believable multi-hex proportions, completed the five-turn replacement-beacon mechanic with a lightweight overhead craft/drop presentation, and expanded the AI first-person visor with the observed soldier's current objective/order beneath Fire Team Assignment.

LARGE ROAD VEHICLE PROPORTIONS
------------------------------
- Ordinary sedan/van/utility props now use a visual envelope at least three hexes long by two hexes wide so their scale reads correctly beside soldiers in Iso and FPV.
- Vehicle placement reserves the complete decorative footprint so bus stops, benches, machines, signs, and other street props do not spawn through the same vehicle body.
- Vehicles orient along the local road/lane/path direction instead of all sharing one world-axis heading.
- Buses remain longer than ordinary cars while using the same lightweight low-poly primitive approach.
- The scale change is primarily presentation; it does not rewrite tactical movement rules or vehicle simulation.

REPLACEMENT BEACON FLYOVER PRESENTATION
---------------------------------------
- The existing authoritative five-turn beacon-redeployment rule is unchanged.
- When a replacement beacon actually deploys, a small alien saucer crosses the battlefield, an energy drop beam appears, and a beacon payload descends at the chosen safe drop point before the craft exits.
- The animation uses the already-selected safe drop cell and cannot move the beacon, change the countdown, reveal hidden information, alter reinforcements, or affect combat.
- The effect is bounded to roughly five seconds and reuses the persistent renderer animation loop.

FPV CURRENT OBJECTIVE / ORDER HUD
---------------------------------
- Beneath Fire Team Assignment, FPV now shows the observed soldier's current objective/order.
- The readout can identify player/fire-team waypoints, VIP rescue assignments, escort/extraction duty, separated-civilian regrouping, escort support/break-off duty, fog/grid searches, last-contact searches, beacon support, visible-contact engagement, and default leader/support formation behavior.
- The readout is derived only from the soldier's authoritative AI/order state and known tactical state. It does not expose hidden aliens, unrevealed VIPs, or unseen objectives.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static contracts require a six-cell-or-larger 3x2 ordinary vehicle footprint, replacement-beacon flyover renderer seams, and FPV Current Objective / Order wiring.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Open a Small Town/urban mission and compare a civilian car directly against a soldier; confirm the car reads as approximately 3 hexes long by 2 hexes wide and follows the road direction.
2. Destroy an active beacon, keep the operation active for five turns, and confirm the replacement event includes an overhead craft, descending payload/beam, and the beacon at a safe unoccupied location.
3. Use AI Command > Tactical Map > FPV and confirm the upper-right Fire Team panel gains a Current Objective / Order section that changes as the acting soldier transitions between search, combat, escort, rescue, and extraction work.
4. Confirm the order panel does not name hidden aliens or unrevealed civilians/VIPs.

PREVIOUS BUILD - 0455
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0455_FPV_CONTINUOUS_GROUND_BEACON_REDEPLOYMENT_CRITICAL_CINEMA_AND_STREET_LIFE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This combined tactical presentation/campaign patch replaces the stubborn first-person hex-edge shimmer with a continuous FPV-only ground renderer instead of another depth-offset adjustment, removes the physical camera-relative sun sphere that could fill the horizon, standardizes all reinforcement/legacy alien models on the six Mainframe archetypes, restores the yellow AI acting-soldier ring, permits alien recovery after an objective failure when AEGIS survivors have nevertheless cleared the battlefield, adds the requested five-turn Alien Field Beacon redeployment cycle, expands lightweight street-life scenery, and gives rare Critical Kill dismemberments a slowed cinematic camera presentation.

FPV CONTINUOUS-GROUND STABILITY
-------------------------------
- FPV no longer displays the battlefield floor as thousands of neighboring hex meshes. While First Person View is active, those individual ground batches are hidden and replaced by one continuous textured plane assembled from the authoritative per-cell terrain palettes.
- The continuous texture retains local terrain color, authored accent color, deterministic variation, sidewalks/access walks, and the same regional terrain identity while eliminating shared polygon borders from the first-person depth buffer.
- Returning to Three.js Iso immediately restores the normal explicit-material hex batches. The isometric renderer, picking, terrain identity, movement cells, paths, cover, and tactical rules are unchanged.
- FPV also hides the per-hex ground-fog meshes while the continuous plane is active so a second set of touching coplanar hex borders cannot shimmer over the replacement floor. Entity visibility, objective reveal rules, minimap knowledge, cover visibility, and tactical LOS remain authoritative.
- Browser 0135's permanent safety rule remains intact: the live persistent ground still does not use `setColorAt()` / ground `instanceColor`.

CAMERA-RELATIVE SUN DOME REMOVAL
--------------------------------
- The giant yellow dome reported at the FPV horizon was the physical sun/halo geometry living inside the camera-relative sky root.
- The physical sun/moon sphere and halo are removed entirely from the battlefield scene.
- The location/time-derived celestial direction remains available for directional key lighting, daylight/twilight/night sky gradients, stars, and regional atmosphere.
- Because there is no longer a physical celestial mesh, no yellow sphere can follow the FPV camera or intersect the battlefield horizon.

CANONICAL REINFORCEMENT ALIEN MODELS
------------------------------------
- New beacon and dropship reinforcement waves no longer spawn placeholder `Void Lancer` / `Void Raider` alien types that fell through to the old purple generic geometry.
- The reinforcement commander uses the Pale Commander silhouette; supporting reinforcements deterministically select Signal Leech, Glass Wraith, Needle Drone, Tide Horror, or Chitin Brute.
- Legacy/unknown alien records are also mapped deterministically onto one of those six Mainframe archetypes at render time, so old save data cannot reintroduce the purple fallback in the middle of a mission.
- The existing Mainframe-aligned colors and modular gib-capable body parts remain authoritative.

AI ACTING-SOLDIER SELECTION RING
--------------------------------
- During AI tactical-map control, the active AEGIS actor is once again identified by a bright yellow selection ring in Three.js Iso.
- The ring follows `movingUnit` / current FPV actor before falling back to the ordinary selected soldier, and its invalidation key now changes when the AI actor changes.
- Manual selection retains the established cyan selected-unit ring.

FAILED-MISSION ALIEN RECOVERY
-----------------------------
- Mission success is no longer the only condition that permits recovery of dead alien material.
- If an objective fails but AEGIS still has at least one living soldier and every alien on the battlefield has been killed, the normal alien remains / weapon-fragment / power-cell recovery table is still applied.
- A squad wipe or failed mission with surviving aliens still recovers no battlefield alien loot.
- Live alien capture remains success-gated; this change applies to killed-alien battlefield recovery only.
- Save format remains 4.

FIVE-TURN REPLACEMENT BEACON REDEPLOYMENT
-----------------------------------------
- Destroying the active Alien Field Beacon starts a five-turn redeployment countdown if the mission remains active for another reason, such as surviving aliens or unresolved rescue work.
- Example: destroying the beacon on round 3 makes the replacement eligible on round 8.
- If all objectives are already complete before the deadline, the mission still ends normally; the countdown does not hold open an otherwise completed operation.
- On the due round an alien craft performs an overhead redeployment pass and attempts to place a replacement beacon in a deterministic random safe cell.
- Safe placement excludes living AEGIS personnel, living aliens, civilians/VIPs, Skyranger hull/ramp cells, live cover/structures, building cells, map edges, and a safety radius around AEGIS/civilians.
- If no safe cell exists, the craft retries on the following round instead of overwriting an occupied cell.
- Replacement beacons receive unique generation IDs and the normal adaptive shield type for that campaign. Destroying a replacement starts a fresh five-turn cycle if the mission continues.
- Destroying any beacon generation still counts as a beacon destruction in the mission report/history even if a later replacement remains active.

LIGHTWEIGHT STREET-LIFE PASS
----------------------------
- Sedan/van/utility-car proportions are longer and lower, with visible cabins and wheels rather than the previous tall box-like vehicles.
- Bounded context-aware props can now appear on urban/small-town/farm maps: buses, bus stops, traffic lights, stop signs, benches, newspaper machines, vending machines, civic statues, water fountains, and small playground equipment.
- Props are placed near roads, curbs, building fronts, or appropriate open/civic/residential spaces rather than uniformly scattered.
- Counts are deliberately capped by settlement type. The new objects reuse simple low-poly primitives and the existing cover renderer rather than creating a heavy simulation system.
- Existing vegetation, sidewalks, access walks, buildings, and destructible-cover behavior remain active.

CRITICAL KILL CINEMATIC
-----------------------
- Rare exceptional lethal shots that already qualify for modular alien dismemberment now receive a dedicated cinematic presentation.
- The visible projectile travel is lengthened for those kills, the camera cuts to an over-shoulder / target-side angle, and detached alien pieces move in time-dilated slow motion through the impact beat.
- The camera then returns to the prior First Person or AI-observer camera automatically.
- Ordinary kills do not invoke the cinematic, so normal firefights keep their established pace.
- The cinematic is strictly post-resolution presentation: target choice, RNG, accuracy, damage, ammunition, TU, XP, kill credit, recovery, and mission outcome are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Targeted reinforcement testing verifies a beacon destroyed on round 3 produces due round 8, remains unavailable on round 7, and becomes replacement-ready on round 8.
- Safe-cell testing rejects occupied units, cover, buildings, and Skyranger footprint cells.
- Legacy `Void Raider` rendering resolves to a Mainframe archetype rather than the purple fallback.
- A failed result explicitly marked as battlefield-cleared-with-survivors qualifies for alien field recovery.
- Static validation requires the FPV continuous-ground toggle, physical celestial-geometry removal, five-turn redeployment branch, canonical reinforcement types, yellow AI selection ring, street-life catalog, Critical Kill cinematic camera, and unchanged explicit-material/no-ground-instance-color invariant.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Re-run the same FPV route that previously showed flickering shared hex edges and confirm the floor is stable while moving/turning/leaning.
2. Sweep the FPV horizon in daylight and confirm no large yellow sphere/dome follows the camera.
3. Trigger initial aliens and later reinforcement aliens in one mission and confirm every alien uses one of the six modular Mainframe silhouettes/colors.
4. Watch AI control in Three.js Iso and confirm the currently acting soldier has a yellow selection ring.
5. Fail a VIP/objective mission after killing every alien while at least one AEGIS soldier survives; confirm dead-alien recovery is awarded in aftermath.
6. Destroy a beacon, keep the mission active for five more turns, and confirm the overhead replacement event places a new beacon only in a safe open cell.
7. Inspect city/small-town maps for appropriately bounded buses, bus stops, traffic controls, benches, machines, civic fixtures, playgrounds, and more believable car proportions.
8. Trigger a rare Critical Kill and confirm the camera cuts to a slowed cinematic dismemberment beat, then returns cleanly to FPV/AI observation.

PREVIOUS BUILD - 0345
=====================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0345_FPV_DEPTH_STABILITY_ALIEN_DATABASE_PALETTE_AND_CONTINUOUS_WINDOW_WALL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Focused the next tactical renderer pass on the three live visual issues reported after Browser 0335. The remaining ground-edge shimmer is specifically first-person, so the FPV perspective camera now uses a depth-buffer-friendly near/far clipping range and the ground drops the obsolete polygon offset that was no longer needed after physical terrain-bed separation. Modular alien models retain their distinct/gib-capable silhouettes but move toward the colors of the Mainframe database sprite families. Transparent window apertures keep their see-through opening while new sill/lintel junction geometry closes the visible gaps between neighboring wall sections.

FPV GROUND-EDGE DEPTH STABILITY
--------------------------------
- The remaining edge flicker was reported specifically in first-person rather than the elevated isometric camera, pointing to perspective depth precision rather than another terrain-palette problem.
- FPV camera clipping changes from near/far 0.04/180 to 0.12/140. Raising the near plane substantially improves perspective Z-buffer precision at shallow ground angles while still leaving the camera-space weapon comfortably inside the visible volume.
- Ground surface materials no longer use `polygonOffsetFactor:-2` / `polygonOffsetUnits:-2`. Browser 0205/0245 already physically separated the visible terrain face, lower terrain bed, fog, and other overlay layers, so the extra depth bias could create unnecessary grazing-angle instability.
- Isometric terrain colors, texture generation, neighbor grading, sidewalks, paths, vegetation, fog knowledge, movement, cover, and tactical math are otherwise unchanged.
- Browser 0135's explicit-material terrain invariant remains permanent: no ground `instanceColor` / `setColorAt()` path is restored.

MAINFRAME-ALIGNED MODULAR ALIEN COLORS
--------------------------------------
- The six modular battlefield silhouettes from Browser 0245 remain intact and remain assembled from separable gib-capable parts.
- Signal Leech now uses a cooler gray-scout palette instead of the stronger purple body treatment.
- Glass Wraith shifts toward pale translucent cyan/white.
- Needle Drone uses insectoid bronze/tan and dark mechanical accents.
- Tide Horror uses a clearer reptilian olive/green palette.
- Chitin Brute uses stronger rust/chitin browns and orange-brown armor accents.
- Pale Commander uses pale gray/lilac psionic tones rather than warm off-white alone.
- These changes are presentation-only. Alien HP, weapons, armor, AI, recovery, autopsy identity, database records, and Critical Kill rules are unchanged.

CONTINUOUS WALLS AROUND TRANSPARENT WINDOWS
-------------------------------------------
- Browser 0335 correctly removed opaque full-height bridge geometry from window openings, but that exposed visible gaps between adjacent structural cells.
- Wall/window and window/window junctions now build a low sill connector and an upper lintel connector across the cell boundary instead of a full-height slab.
- The middle of the window remains physically open and carries the existing transparent glass pane, so an alien on the far side reads as being seen through glass rather than through a solid wall.
- Solid wall-to-wall junctions retain the existing full structural connector.
- Junction geometry is derived only from currently living authoritative cover cells. If either source wall/window segment is destroyed or breached, the connector disappears on the next cover rebuild, so the facade remains visually consistent with destruction.
- LOS, glass shattering, the established first-shot accuracy penalty, movement blocking, wall HP, and breach rules are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the FPV camera uses 0.12/140 clipping, the current ground material no longer uses the old negative polygon offset, and the prior 0.04/180 FPV camera definition is absent.
- Static validation confirms all six alien archetypes retain unique body colors and that the new gray-scout / insectoid / reptilian / chitin / pale-psionic palette markers are present.
- Transparent-window validation now requires explicit sill and lintel connector seams rather than the Browser 0335 rule that skipped every structural connection touching a window.
- Save format remains 4; existing campaigns require no migration.

MANUAL TEST GATES
-----------------
1. Reproduce the same FPV walk across a multi-texture hex boundary that was flickering in Browser 0335. Confirm the edge remains stable while the camera walks, leans, turns, and enters Tactical Focus.
2. Switch out of FPV and confirm the elevated isometric battlefield still has the same rich terrain colors/textures and does not show a new seam regression.
3. View every identified alien archetype in the Mainframe and then in 3D tactical view; confirm the battlefield colors now read closer to the corresponding database image family while silhouettes remain distinct.
4. Inspect wall-window-wall and window-window sequences in FPV. Confirm the facade is visually continuous at the sill and lintel but the central glass aperture remains transparent.
5. Destroy/breach a structural segment adjacent to a window and confirm its junction connector disappears with that structure.

PREVIOUS BUILD - 0335
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0335_FPV_NAV_HUD_TRANSPARENT_WINDOWS_AND_AI_RESCUE_DUSTOFF_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Expanded the AI-observer first-person presentation and aligned two tactical behaviors with what the player sees. FPV now carries a persistent soldier identity panel, a continuously scrolling compass ribbon driven by the smoothed camera heading, and a north-up lower-right local tactical mini-map that remains constrained to legitimate squad knowledge. Three.js building windows now render as true framed transparent apertures rather than short opaque walls with blue panels, matching the existing line-of-sight and shot-through-window rules. Mandatory VIP missions under AI command can now end cleanly with a Dust Off once every VIP is resolved and a missed rescue quota is mathematically unrecoverable, even if hostile aliens remain on the map.

FPV SOLDIER IDENTITY / COMPASS / MINI-MAP
------------------------------------------
- The lower-left FPV visor identity block now gives the observed AEGIS soldier's name primary visual prominence and retains available rank, equipped weapon, HP, and TU context.
- A top-center compass ribbon scrolls continuously from the smoothed first-person camera direction rather than snapping only between stored hex facings. Tactical Focus target acquisition therefore rotates naturally through intermediate bearings as well.
- The centered compass index includes a live cardinal and degree readout.
- A compact 19 x 19 local tactical mini-map occupies the lower-right corner while FPV is active. It is north-up so the compass and map form a stable navigation pair.
- Explored/visible terrain can appear on the mini-map. AEGIS squadmates and known Skyranger extraction ramps remain known; hostile aliens, VIPs/civilians, and Alien Field Beacons are included only when the existing tactical visibility/reveal rules permit them.
- The mini-map therefore improves situational awareness without creating omniscient contacts or revealing an objective through opaque terrain.
- The existing renderer/coverage status readout moves to bottom-center during FPV so it does not overlap the mini-map.

TRANSPARENT WINDOW APERTURES
----------------------------
- The gameplay model already treats building-window cover as line-of-sight transparent and allows projectiles to cross it; solid wall sections remain opaque. The 3D presentation now visually matches that contract.
- A window cell no longer places a shortened opaque wall directly behind the glass. The wall is assembled as a lower section, upper lintel, and two side jambs around an actual central opening.
- Intact glass is now lightly transparent, double-sided, and non-depth-writing so soldiers and aliens on the far side are visibly understandable in FPV instead of appearing to be targeted through a solid wall.
- Shattered glass becomes almost clear while retaining a small broken-frame/shard presentation.
- Structural connector geometry is forbidden from drawing a solid bridge across any edge involving a window aperture. Adjacent true wall cells retain their normal opaque connected-wall treatment.
- Decorative regional trim, sills, shutters, awnings, foundations, roofs, damage cracking, and smoke remain available around the aperture.
- This changes presentation only. Existing 18-point first-shot glass accuracy penalty, shattering, movement blocking, structural breaching, cover HP, LOS, and ballistics rules are unchanged.

AI DUST OFF AFTER IRRECOVERABLE VIP FAILURE
--------------------------------------------
- Mandatory VIP objectives distinguish an active rescue phase from a terminal failed objective. The new AI-specific Dust Off rule applies only after every VIP is resolved (rescued or confirmed dead), no unresolved VIP remains, and the required rescue quota was missed.
- Simulation AI and Hybrid AI support handoffs check this state after rescue processing and before committing the squad to another combat exchange.
- When the state is terminal, the AI commander orders Dust Off immediately rather than continuing to hunt remaining aliens during an operation that can no longer be turned into a success.
- The mission resolves as a normal failure even if living aliens remain on the battlefield. It is not treated as a simulation safety-limit withdrawal or an incomplete operation.
- Extracted VIPs retain their normal per-rescue partial credit. The missed-quota completion bonus remains withheld, and normal failure panic/reward/report consequences remain authoritative.
- Surviving soldiers retain their real HP, wounds, KIA state, XP, and kill credit at the moment of withdrawal. No synthetic casualties are created to explain the remaining hostile force.
- Manual-control doctrine is intentionally unchanged: a player who has not handed the operation to AI can still choose whether to continue fighting or use the existing Dust Off control.
- If the rescue quota was met, or even one mandatory VIP remains alive and unresolved, the new failure Dust Off does not trigger.

PRESERVED TACTICAL PRESENTATION
-------------------------------
- Browser 0245 stable hex-depth separation, guaranteed-visible batched vegetation, modular alien silhouettes, and rare Critical Kill dismemberment remain active.
- Browser 0205 sidewalks/access walks and Tactical Focus remain active.
- Browser 0145 rich terrain presentation, FPV obstacle-avoidance lean, weapon rig, regional sky/day-night atmosphere, and regional architecture remain active.
- The left-side shot-result stack remains in its approved location.
- Browser 0135's explicit-material/no-ground-instance-color invariant remains permanent.
- Random victory music, reinforcement/victory gating, indexed tactical pathfinding, cooperative mission aftermath, and lazy memorial indexing are unchanged.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted mandatory-VIP fixture confirms one rescued plus two dead VIPs on a 2-of-3 terror quota triggers AI Dust Off; one remaining live unresolved VIP does not; and a completed 2-of-3 quota does not produce failure Dust Off.
- Static window validation requires a lower wall, lintel, two aperture jambs, transparent pane material, disabled glass depth writing, double-sided glass, and the guard that prevents solid connector geometry from spanning a window.
- FPV Build Health retains the soldier identity, smooth compass, and knowledge-limited mini-map contract from the planned navigation-HUD work.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Enter Simulation AI map playback, enable First Person, and confirm the lower-left panel clearly shows the observed soldier name, the top compass moves smoothly as that soldier turns, and the lower-right mini-map remains north-up.
2. Rotate through a full turn/Tactical Focus shot and confirm the compass degree/cardinal readout moves continuously rather than jumping between six hex facings.
3. Place an alien on the far side of an intact building window. Confirm FPV visibly shows transparent glass/open aperture framing rather than an opaque wall, while an adjacent true wall still completely blocks the view.
4. Fire through the intact window and confirm the established glass-shatter/accuracy behavior still occurs; inspect the same opening afterward and confirm shattered glass is nearly clear.
5. Run a mandatory 2-of-3 VIP mission under Simulation AI. Rescue only one VIP and allow the other two to die while aliens remain. Confirm the AI announces Dust Off and the mission completes as a failure without continuing alien-hunting rounds.
6. Repeat with one VIP still alive/unresolved and confirm AI does not Dust Off merely because the quota has become difficult or impossible; the remaining VIP must first be resolved.
7. Repeat after rescuing enough VIPs to meet the quota and confirm this failure-specific Dust Off does not trigger.
8. Confirm extracted VIP partial credit, soldier wounds/KIA/XP/kills, failure panic/reward handling, mission report, and return-to-base aftermath remain correct.

PREVIOUS BUILD - 0245
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0245_STABLE_HEX_EDGES_VISIBLE_VEGETATION_CRITICAL_GIBS_AND_ALIEN_SILHOUETTES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Strengthened the persistent Three.js tactical presentation after Browser 0205 testing. Neighboring hex surfaces now have a larger deterministic inset plus explicit vertical/depth separation so two textured terrain faces cannot compete for the same edge pixels. Decorative grass and shrubs are larger, denser within bounded quality caps, and no longer eligible for whole-batch frustum culling, addressing the case where generated vegetation was not visible at all. The six existing Mainframe alien archetypes now receive distinct modular low-poly battlefield silhouettes. Exceptional lethal AEGIS gunshots can produce a presentation-only Critical Kill dismemberment effect assembled from those modular body pieces; ordinary lethal hits retain the normal fallen-body presentation.

STABLE HEX EDGE DEPTH SEPARATION
--------------------------------
- Browser 0205 removed the old overlapping seam batches, but live testing still showed high-contrast neighboring hex edges appearing to flip or squiggle while the camera moved.
- Visible terrain faces are now inset farther (`surfaceScale 0.982` instead of `0.996`), creating a deliberate microscopic separation between neighboring surfaces rather than relying on mathematically shared raster edges.
- The visible surface plane is raised to approximately `y = 0.035`, while the single stable terrain bed is lowered to approximately `y = -0.085`. The bed fills the tiny visual gaps without being coplanar with either adjacent tile.
- Ground materials also use an explicit polygon offset as an additional depth-stability guard. Fog sits independently at approximately `y = 0.165`.
- The Browser 0135 root-cause invariant remains permanent: visible ground color still comes from explicit ordinary material batches. The active ground builder contains no `setColorAt()` / ground `instanceColor` path, so the black-ground regression is not reintroduced.
- Rich Browser 0145 neighbor grading, procedural ground texture, rotated texture orientation, roadside sidewalks, building access walks, and regional palettes remain active.

VISIBLE BATCHED GRASS / SHRUBS
------------------------------
- The Browser 0205 grass and shrub `InstancedMesh` objects could be culled as a complete batch even though their translated instances covered a large battlefield. Both decorative batches now explicitly disable frustum culling.
- Grass geometry is taller/wider and shrubs are modestly larger so they remain readable from both 3D Iso and FPV without becoming heavy scene objects.
- Density remains biome-aware but is increased enough to be visible: tropical/temperate remain fuller, arid/tundra remain restrained.
- Quality caps remain bounded at approximately 220/440/680 grass tufts and 28/54/88 shrubs for Performance/Balanced/Quality before biome scaling.
- Sidewalk/access-walk edges adjacent to natural terrain can now receive a small pair of tufts roughly one third of the eligible time, biased toward the natural side of the boundary. This produces occasional grass peeking between paving hexes rather than a continuous border.
- Grass and shrubs remain two lightweight instanced decorative batches. They add no collision, occupancy, cover, concealment, LOS, ballistics, TU, or pathfinding behavior.

MODULAR MAINFRAME-ARCHETYPE ALIENS
----------------------------------
- Tactical aliens are no longer all represented by the same generic purple body/head pair.
- The battlefield renderer now uses the same six archetype identities already used by the Mainframe database visual mapping and alien descriptions:
  - Signal Leech: compact bulbous neural-parasite silhouette with hanging tendrils.
  - Glass Wraith: tall, narrow, translucent/crystalline body with elongated limbs.
  - Needle Drone: low mechanical core with multiple legs and visible dorsal needles.
  - Tide Horror: broad amphibious/reptilian body with elongated head, heavy limbs, and tail.
  - Chitin Brute: thick armored torso, prominent shoulder plates, and oversized limbs.
  - Pale Commander: tall pale frame, enlarged head, and recognizable neural-crown spines.
- The models deliberately remain low-poly and lightweight. The goal is immediate silhouette recognition at tactical scale rather than photorealism.
- Each alien is assembled from tagged modular pieces (head, torso/core, limbs, plates, tendrils, needles, tail/crown as appropriate). This gives the renderer real separable parts for the critical-kill presentation rather than spawning unrelated debris.
- Alien archetype is now part of the persistent unit visual signature so changing/creating a different alien type cannot accidentally reuse another species' model.

EXCEPTIONAL LETHAL-SHOT / CRITICAL KILL PRESENTATION
----------------------------------------------------
- Only a successful AEGIS shot that actually kills an alien can qualify. Nonlethal shots, misses, alien-on-human attacks, and Frag Grenades do not use this effect.
- Qualification is deterministic and intentionally uncommon. A presentation score considers damage relative to the alien's maximum HP, true overkill beyond the HP it had before the shot, shot hit chance, aimed/sniper fire, complete multi-round hits, and modest energy-weapon bonuses.
- The score threshold is high enough that an ordinary lethal hit remains an intact fallen alien. A severe high-quality overkill can trigger `CRITICAL KILL` in the left-side shot-result stack.
- Combat is already resolved before this presentation is evaluated. It does not reroll accuracy, alter damage, change ammunition/TU, award extra kills, change salvage/recovery, or affect mission outcome.
- When triggered in Three.js, the target's actual modular alien pieces separate at impact, travel outward in deterministic physics-like arcs, spin, fall under gravity, and leave a small persistent remnant on the battlefield.
- The original alien node is hidden only for that critical-kill presentation; campaign casualty/remains logic continues using the authoritative tactical result.
- Tactical Focus still acquires the authoritative target before the shot, so an FPV Critical Kill occurs as the culmination of the existing deliberate acquisition/release sequence rather than as a disconnected effect.

PRESERVED SYSTEMS
-----------------
- Roadside sidewalks and building access paths remain presentation-only and unchanged.
- Tactical Focus, FPV target HUD, weapon rig, pre-aim, camera smoothing, avoidance lean, regional sky/day-night presentation, and regional architecture remain active.
- The left-side shot-result stack remains in its approved location.
- Random victory music and the terminal reinforcement/victory gate remain unchanged.
- Browser 1930 indexed pathfinding, Browser 2207 cooperative aftermath, and Browser 2335 lazy memorial index remain active.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Targeted critical-kill tests confirm a severe aimed plasma overkill qualifies, while an ordinary ballistic lethal hit, a grenade kill, and an alien killing a human do not.
- All six Mainframe archetype names resolve to six distinct tactical silhouette profiles.
- The active persistent ground builder contains no `setColorAt()` call, uses the 0.982 surface inset, raises visible faces, applies depth/polygon separation, and raises fog independently.
- Both vegetation batches explicitly use `frustumCulled=false`, and sidewalk-edge tufts are biased farther toward the natural boundary.
- Static Build Health now covers the hex-depth, visible-vegetation, modular-alien, and critical-dismemberment seams.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Reopen the same mixed-terrain mission that showed the edge shimmer. Pan, orbit, zoom, and enter FPV while watching a boundary between two very different terrain materials. Confirm neither edge repeatedly swaps/flips on top of the other.
2. Confirm rich terrain color fading and texture from Browser 0145 remain visible and the black-ground regression does not return.
3. Check arid, temperate, and tropical missions in 3D Iso and FPV. Confirm actual grass/shrubs are visibly present, while arid growth remains sparse.
4. Find sidewalk/access-walk boundaries beside natural ground and confirm occasional small grass pairs poke through near the hex edge without becoming a continuous hedge.
5. Compare Signal Leech, Glass Wraith, Needle Drone, Tide Horror, Chitin Brute, and Pale Commander on the battlefield. Confirm they can be identified from silhouette/major anatomy without opening the Mainframe.
6. Observe ordinary alien deaths and confirm most remain intact fallen models.
7. Observe an exceptionally strong lethal AEGIS firearm/energy shot. When it qualifies, confirm the shot stack reports `CRITICAL KILL`, modular parts separate only after impact, and pieces arc/fall without affecting the already-resolved combat result.
8. Confirm nonlethal fire, grenade kills, and alien attacks on humans never invoke alien gunshot dismemberment.
9. Confirm kills, XP, ammunition, TU, mission reports, rewards, salvage/remains recovery, and victory gating match the authoritative battle exactly.

PREVIOUS BUILD - 0205
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0205_SIDEWALK_STABLE_TERRAIN_TACTICAL_FOCUS_AND_LIGHT_VEGETATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added a presentation-focused tactical pass on top of Browser 0145's rich explicit-material terrain. Roads and service lanes now receive lighter one-hex pedestrian sidewalks, and building doors can receive short decorative access walks to the nearest sidewalk. The persistent ground renderer no longer overlaps enlarged neighboring hex faces or competing seam meshes, removing the coplanar z-fighting that made hex edges shimmer and squiggle. AI first-person firefights gain an original Tactical Focus presentation that frames and acquires the authoritative target before releasing the already-resolved shot. Sparse biome-aware grass tufts and shrubs are added through two bounded instanced decorative batches, including occasional edge grass where pedestrian paving meets natural ground.

ROADSIDE SIDEWALKS AND BUILDING ACCESS WALKS
---------------------------------------------
- Cells directly beside true road and service-lane cells can receive a one-hex-wide pedestrian sidewalk rendered in a lighter neutral gray than the roadway.
- Sidewalk generation excludes the road itself, building interiors, streams/irrigation, hard cover, and the outer map boundary.
- Each authored building door examines valid exterior approach cells and performs a bounded search for the nearest generated sidewalk. When a route exists, the exterior cells between the door and sidewalk receive a slightly lighter pedestrian access-walk treatment.
- Access walks are capped and deterministic; they do not grow arbitrarily across the map.
- Sidewalk and access-walk state is presentation-only. The underlying tactical terrain, TU movement costs, passability, occupancy, cover, building-entry rules, AI pathfinding, and line of sight remain authoritative and unchanged.
- Sidewalk/access-walk surfaces remain part of the rich explicit-material terrain system and retain restrained paved wear rather than becoming featureless flat polygons.

STABLE TERRAIN LAYERS / Z-FIGHTING FIX
--------------------------------------
- Browser 0145's visible hex faces used a slightly oversized surface together with locally colored seam underlays. Adjacent surfaces could therefore occupy overlapping pixels at the same depth and fight for ownership, producing the reported shimmering/squiggling edge effect.
- Visible tactical hex faces are now slightly inset instead of oversized (`surfaceScale 0.996`). Neighboring terrain batches therefore do not overlap one another.
- The many overlapping colored seam underlays are removed from the active persistent terrain builder.
- One lower terrain bed sits safely below the complete battlefield and is visible only through the very narrow raster gaps between inset hexes. It uses a darkened average battlefield tone and never competes with the surface plane for depth.
- The Browser 0135 black-ground invariant remains permanent: the active visible terrain builder uses explicit ordinary material colors and contains no ground `setColorAt()` / `instanceColor` dependency.
- Fog remains on its own elevated transparent layer and cannot z-fight with the ground surface.

AI FPV - TACTICAL FOCUS
-----------------------
- Human AI-controlled shots shown in first person now enter an original `Tactical Focus` presentation phase after movement and before visible firing.
- The camera tightens from the normal approximately 72-degree field of view toward approximately 58 degrees while the reticle turns onto the authoritative shot target.
- The visor panel identifies the target, approximate distance, weapon, and a presentation-only firing-solution quality indicator while the sight settles.
- At normal Battle Speed the target-acquisition beat is approximately 0.88 seconds, with bounded scaling for faster/slower playback. The shot then enters a short release and recovery beat.
- The actual AI decision, hit/miss roll, damage, ammunition, TU use, target choice, shot order, and mission result are already authoritative before the presentation begins and are not recalculated by Tactical Focus.
- Alien actions never steal the soldier-eye observer camera. Existing FPV target visibility, HUD knowledge restrictions, pre-aim behavior, weapon rig, avoidance lean, and camera smoothing remain active.
- The feature intentionally uses Project Aegis terminology and visual language rather than another game's branding or proprietary interface.

LIGHTWEIGHT BIOME VEGETATION
----------------------------
- Sparse grass tufts and small shrubs are generated only on compatible organic ground and are deterministic for the mission seed.
- Grass uses one instanced three-sided cone batch and shrubs use one low-poly icosahedron batch. Hundreds of decorative plants therefore require only two additional draw batches rather than one object/draw call per plant.
- Density is scaled by environment: tropical and temperate maps can be fuller, while arid and tundra maps remain sparse.
- Density is also quality-aware. Performance mode uses lower caps than Balanced and Quality modes.
- Current caps are approximately 150/280/430 grass tufts and 18/38/62 shrubs for Performance/Balanced/Quality before biome scaling.
- A small minority of sidewalk/access-walk cells beside natural terrain can receive one short grass tuft biased toward the natural edge, creating occasional vegetation peeking through the paving boundary rather than a continuous grass border.
- Decorative vegetation has no occupancy, collision, cover, concealment, LOS, projectile, TU, or pathfinding role and does not cast tactical shadows.

PRESERVED SYSTEMS
-----------------
- Browser 0145's rich terrain fading, explicit material batches, procedural surface textures, local biome palettes, and FPV obstacle-avoidance lean remain active.
- The left-side tactical shot-result stack remains unchanged.
- FPV weapon barrel, visor markers, target pre-aim, location-aware sky, day/night presentation, regional architecture, and victory celebration remain active.
- Terminal victory/reinforcement gating and the random Operation Vindicator victory bank are unchanged.
- Browser 1930 pathfinding optimization, Browser 2207 cooperative mission aftermath, and Browser 2335 lazy memorial index remain active.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- The active persistent terrain builder contains no `seamBatches` and no `setColorAt()` call; it requires the stable lower terrain bed and marks the rendered surface as non-overlapping.
- The shared hex geometry contract requires `surfaceScale < 1` for the active ground surface.
- Static release checks require the pedestrian surface map, stable terrain bed, lightweight vegetation layer, Tactical Focus acquisition seam, current build metadata, and unchanged save format.
- The packaged victory MP3 files are byte-for-byte unchanged from Browser 0145.

MANUAL TEST GATES
-----------------
1. Load a Small Town/urban tactical mission containing roads. Confirm a lighter one-hex sidewalk appears alongside road edges and that building entrances receive plausible short access walks toward the nearest sidewalk where geometry permits.
2. Pan/zoom the 3D Iso camera over high-contrast adjacent terrain and watch the edges while the camera moves. Confirm neighboring hex faces no longer shimmer, squiggle, or repeatedly swap which texture appears on top.
3. Confirm the rich Browser 0145 terrain colors/textures remain visible and the black-ground regression does not return.
4. Enable AI FPV and observe a human soldier firing. Confirm movement finishes, Tactical Focus turns the reticle onto the intended target, the FOV tightens, the solution panel appears, and only then does the visible shot release.
5. Compare the tactical result with normal AI playback and confirm Tactical Focus changes presentation only, not target, hit/miss, damage, TU, ammunition, or action order.
6. Inspect tropical/temperate/arid/tundra maps at different 3D quality settings. Confirm grass/shrub density is sparse and biome-appropriate and does not noticeably reduce responsiveness.
7. Inspect sidewalk/path boundaries and confirm only occasional small edge tufts appear rather than a dense continuous grass line.
8. Confirm the left-side shot-result stack remains in its current position and behavior.

PREVIOUS BUILD - 0145
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0145_RICH_TERRAIN_EXPLICIT_MATERIAL_AND_FPV_AVOIDANCE_LEAN_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Browser 0135 finally isolated and fixed the black-ground regression: the live GPU path was failing when the consolidated persistent terrain depended on `InstancedMesh.setColorAt()` / `instanceColor`. With that root cause now known, this patch deliberately rolls back the visual simplifications from the unsuccessful terrain-diagnostic passes and restores the richer terrain treatment on top of the proven explicit-material renderer. Balanced neighbor fading, authored base/accent variation, CanvasTexture surface detail, rotated texture orientation, and color-matched seams are active again, but ground color never returns to per-instance colors. FPV also gains a small obstacle-avoidance lean while an AI-controlled soldier moves past nearby units or cover.

ROOT-CAUSE FIX PRESERVED
------------------------
- Browser 0135's successful rule is retained as a hard renderer invariant: the persistent terrain builder contains no `setColorAt()` call and does not rely on `instanceColor` for visible ground color.
- Each terrain batch uses an ordinary explicit `MeshBasicMaterial.color`, the same reliable material-color path that fixed the live black-ground screenshots.
- Fog remains matrix/count-only instancing and likewise does not use per-instance color.
- Exact tactical picking is preserved through each batch's instance-indexed cell list.

RICH TERRAIN PRESENTATION RESTORED
----------------------------------
- Restored the Browser 2335 balanced neighbor-fading doctrine instead of the later diagnostic flat-color presentation.
- Every cell first mixes its authored base/accent palette with deterministic local variation.
- Neighbor influence is contrast-aware: approximately 9% for similar adjacent terrain, 14% for moderate transitions, and 18% for strong boundaries.
- This allows dry ground, scrub, grass, roads, stone, building floors, paths, and other surfaces to grade into one another without replacing the owning terrain identity with one map-wide average.
- Cell colors are quantized into explicit-material batches. This preserves local fading while avoiding one draw call per hex and avoiding the broken instance-color path.

GROUND TEXTURE AND SEAMS RESTORED SAFELY
----------------------------------------
- Procedural 64 x 64 CanvasTexture detail is active again.
- The texture is a neutral light modulation map rather than the source of terrain hue. Explicit material color remains authoritative, so texture sampling cannot recreate the previous black instance-color failure.
- Organic ground receives irregular mottling; crop/field surfaces receive subtle bands; roads, lanes, stone, and built surfaces receive restrained wear/fleck detail.
- Every hex receives one of six deterministic 60-degree texture rotations so repeated patterns do not align across the complete battlefield.
- A narrow color-matched seam underlay is restored. Seam color is derived from the owning cell plus nearby terrain rather than a universal dark strip.

DIAGNOSTIC TERRAIN PASSES ROLLED BACK FROM ACTIVE PRESENTATION
-------------------------------------------------------------
- Browser 2355's no-neighbor-blend palette-only presentation is no longer the active terrain surface.
- Browser 0030's forced daylight luminance lift and texture removal are no longer used by the active persistent terrain builder.
- Browser 0125's terrain-derived per-cell fog-color experiment is no longer active.
- Browser 0135's deliberately simplified flat semantic-family colors served their diagnostic purpose and are superseded by the rich explicit-material batches in this build.
- The historical helper code remains in the single-file artifact for patch-history/build-health continuity, but the live terrain path now follows Browser 0145's explicit-material rich-rendering contract.
- Pre-diagnostic unseen/explored fog strengths are restored while retaining the safe matrix-only fog implementation.

FPV OBSTACLE-AVOIDANCE LEAN
---------------------------
- During AI movement, FPV examines the current movement path and nearby living units/cover around the observed soldier.
- If another unit or cover object occupies or crowds the movement corridor, the camera eases toward the clearer side instead of remaining perfectly centered through the obstruction.
- Centerline obstacles choose a deterministic left/right side so the view does not jitter between directions.
- The lean uses a small lateral eye shift, a restrained camera roll, and matching weapon-rig movement.
- The lean eases in and out rather than snapping at hex boundaries.
- This is visual only. It does not alter the authoritative movement path, occupancy, collision, TU use, formation logic, AI decisions, or where the soldier actually stands.

PRESERVED SYSTEMS
-----------------
- The left-side shot-result stack remains unchanged.
- FPV target pre-aim, weapon barrel, visor HUD, camera smoothing, local sky, traditional regional architecture, and day/night presentation remain active.
- Victory music and the terminal reinforcement gate are unchanged.
- Browser 1930 pathfinding optimization, Browser 2207 cooperative mission aftermath, and Browser 2335 lazy memorial indexing remain active.
- Save format remains 4.

VALIDATION
----------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the active persistent terrain builder has no `setColorAt()` call.
- Static validation confirms the active terrain builder both uses `map:tacticalThreePersistentGroundTexture(...)` and assigns an explicit material color for every terrain batch.
- The active terrain path contains the restored contrast-aware neighbor blend and color-matched seam batches.
- An isolated FPV avoidance test confirms: no nearby obstacle = zero lean; a centerline obstacle creates a deterministic nonzero lean; a side obstacle produces a lean away from that side.
- Assets are unchanged from Browser 0135.

MANUAL TEST GATES
-----------------
1. Reopen the arid Small Town daylight mission that proved Browser 0135 fixed the black ground. Confirm the ground remains colored rather than black.
2. Compare the same battlefield with Browser 0135: Browser 0145 should show noticeably richer within-tile mottling, local gradient/variation, and softer terrain transitions.
3. Verify true roads, dry soil, scrub, vegetation, stone, and building-floor surfaces remain visually distinct instead of becoming one averaged sheet.
4. Enable FPV during AI movement and watch a soldier pass close to another soldier, a wall/crate/tree, or other cover. Confirm the camera and weapon lean slightly to the clearer side and return smoothly to center afterward.
5. Confirm the lean does not change the actual hex route, movement timing, occupancy, firing, or AI result.
6. Confirm the left-side shot-result stack, FPV target acquisition, HUD markers, victory music, and mission completion still behave normally.

PREVIOUS BUILD - 0135
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0135_EXPLICIT_TERRAIN_MATERIAL_BATCH_AND_FOG_OVERLAY_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
The Browser 0125 screenshots provided decisive new evidence: the battlefield remained pure black even in FPV immediately around a living AEGIS soldier, where the ground receives no fog-of-war mesh. That rules out fog as the primary remaining failure. The common factor was Browser 0030's single ground `InstancedMesh`, which depended on per-instance `setColorAt()` data to produce every terrain color. Browser 0135 removes that dependency completely. The persistent battlefield now uses a bounded set of still-instanced meshes whose ordinary Three.js materials carry explicit terrain colors, while fog uses fixed translucent materials and matrix-only instancing. This follows the same basic material-color path that is already rendering soldiers, buildings, props, and the Skyranger correctly in the supplied screenshots.

EXPLICIT TERRAIN MATERIAL BATCHES
---------------------------------
- Removed the single vertex/instance-colored ground mesh from the persistent renderer.
- Ground cells are grouped into semantic surface families such as road, lane, path, stream, building floor, doorway, dry earth, scrub, grass, forest, crop, stone, and open terrain.
- Every resulting batch is still an `InstancedMesh`, but its `MeshBasicMaterial.color` explicitly contains the terrain color. Ground visibility no longer depends on `InstancedMesh.instanceColor` or `setColorAt()`.
- Organic terrain families use two deterministic variants so large areas do not become one perfectly flat material while remaining within a bounded draw-call count.
- True pavement and built surfaces retain stable dedicated material families, preserving road-versus-soil value separation.

BLACK UNDERLAY / SEAM REMOVAL
-----------------------------
- The persistent ground seam underlay has been removed from the active terrain builder.
- The slightly oversized main hex geometry already closes raster gaps, so a second ground layer is not required.
- This removes another possible full-map dark surface beneath the playable tiles and simplifies diagnosis of the renderer.
- Edge/reachable/selected/extraction rings remain independent and unchanged.

FOG WITHOUT INSTANCE COLORS
---------------------------
- Unseen and explored fog remain dynamic instanced overlays, but they now use fixed translucent day/twilight/night material colors.
- Fog instances update matrices/counts only. There are no fog `setColorAt()` calls and no `instanceColor` dependency.
- Browser 0125's substantially reduced day/twilight/night fog opacities are retained.
- Visible cells still receive no fog overlay at all.
- Hidden aliens, civilians, VIPs, beacons, covers, and objective information remain governed by the existing tactical reveal/LOS rules.

PRESERVED SYSTEMS
-----------------
- The well-received left-side shot-result stack is unchanged.
- FPV pre-aim, weapon model, visor HUD, camera smoothing, location-aware sky, regional architecture, and biome selection remain active.
- Victory music, reinforcement victory gate, pathfinding optimization, cooperative aftermath, lazy memorial indexing, cover, movement, LOS, Time Units, AI decisions, and mission resolution are unchanged.
- Save format remains 4.

VALIDATION
----------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the persistent terrain/fog block contains no `setColorAt()` calls.
- Static validation confirms terrain batches use explicit `MeshBasicMaterial({color: batch.color})` values.
- A representative material-batch fixture produced separate arid dry-ground (`#da9b51`), scrub (`#9c7733`), road (`#455060`), and grass (`#6f873b`) materials with only four batches.
- Build Health now requires the explicit-material-batch marker and rejects reintroduction of the ground `setColorAt(cell.surfaceColor)` dependency.

MANUAL TEST GATES
-----------------
1. Load the same arid Small Town daylight mission shown in the Browser 0125 screenshots.
2. In FPV, the ground directly around and ahead of the observed soldier must no longer be a pure black plane.
3. In 3D Iso, roads should render as a distinct darker gray while dry earth/scrub/vegetation use visibly different tan, ochre, and muted green materials.
4. Move between visible, explored, and unrevealed areas and confirm fog changes brightness without replacing the terrain with a black sheet.
5. Confirm unit/cover/objective visibility, hex picking, movement, pathfinding, the FPV HUD, and the left-side shot stack remain correct.

PREVIOUS BUILD - 0125
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0125_TERRAIN_COLOR_PRESERVING_FOG_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Live screenshots from Browser 0030 proved that the terrain palette itself was no longer the main problem. The persistent fog-of-war renderer was still placing a single dark biome-colored mesh over every unseen cell at 72% opacity in daylight, visually flattening otherwise distinct tan, brown, green, gray, and road surfaces into one near-black sheet. Browser 0125 fixes the fog layer itself: unseen and explored ground now receive per-cell fog tints derived from each tile's own terrain color, with substantially lower daytime opacity, so terrain remains readable in 3D Iso and FPV without revealing hidden units, objectives, or tactical knowledge.

COLOR-PRESERVING FOG-OF-WAR
----------------------------
- Persistent unseen/explored fog batches now use `vertexColors` and per-instance colors instead of one universal dark biome color.
- Each unseen cell derives its veil from that cell's presented terrain color, slightly cooled/desaturated toward the mission biome and then darkened. Grass remains greenish, arid soil remains brown/tan, roads remain gray, and concrete/stone retain their own value relationships under fog.
- Explored cells use a lighter version of the same per-cell tint so known terrain remains almost fully readable when it is outside current sight.
- Currently visible cells continue to receive no ground fog mesh at all.

DAY / TWILIGHT / NIGHT OPACITY
-------------------------------
- Daylight unseen fog: 72% -> 34%.
- Daylight explored fog: 13% -> 10%.
- Twilight unseen/explored fog: 79% / 24% -> 42% / 15%.
- Night unseen/explored fog: 84% / 36% -> 50% / 22%.
- Night remains visually darker because the underlying terrain itself still follows the mission's local lighting phase. The fog layer no longer has to create darkness by painting the map black.

TACTICAL KNOWLEDGE PRESERVED
-----------------------------
- Alien, civilian, VIP, beacon, and other objective reveal rules are unchanged.
- Fog still consumes the existing authoritative visible/explored sets.
- Hidden contacts are not rendered merely because their ground tile is now readable.
- Line of sight, AI knowledge, shooting, pathfinding, cover, movement, Time Units, and mission outcomes are unchanged.
- Save format remains 4.

VALIDATION
----------
- All six embedded JavaScript blocks pass syntax validation.
- Static validation confirms both persistent fog materials are per-instance vertex-colored and the dynamic update writes independent unseen/explored colors for every fogged cell.
- Representative daylight arid composites now remain clearly separated under unseen fog: dry ground approximately `#b88345`, scrub approximately `#84652b`, and true road approximately `#3a4451` rather than converging toward a common near-black value.
- The left-side shot result stack, FPV weapon/HUD/pre-aim, regional architecture, victory music, pathfinding optimization, cooperative aftermath, and lazy memorial index are untouched.

MANUAL TEST GATES
-----------------
1. Recreate the arid Small Town daylight operation shown in the Browser 0030 screenshots. The unrevealed ground should now retain visible tan/brown/gray terrain families instead of reading as a black sheet.
2. In 3D Iso, compare a road against adjacent dry ground/scrub both inside and outside current sight. The road should remain noticeably darker and grayer.
3. Enable FPV and confirm the ground ahead is no longer black merely because cells are outside the current visibility set.
4. Confirm unrevealed aliens/VIPs/objectives remain hidden exactly as before.
5. Verify the left-side shot-result stack remains unchanged.

PREVIOUS BUILD - 0030
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0030_BRIGHT_REGIONAL_TERRAIN_READABILITY_AND_ASPHALT_REMOVAL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Reworked the persistent Three.js tactical ground after live screenshots showed Browser 2355 still rendering arid daylight missions as a dark, nearly uniform asphalt sheet. The remaining problem was the visual stack rather than neighbor averaging: palette CanvasTextures were still multiplied across every tile and produced a repeated diagonal streak pattern, while the explored-ground fog veil remained dark enough to bury already-known biome color. Browser 0030 removes the active ground texture map entirely, renders explicit per-cell biome colors, raises daylight readability by regional environment, narrows the seam underlay again, and lightens only explored daylight fog. Unrevealed fog-of-war remains strongly obscured.

BRIGHT BIOME-SPECIFIC GROUND
----------------------------
- Persistent 3D ground now uses one vertex-colored instanced hex surface with the authoritative per-cell terrain color written directly to each instance.
- The active tile material no longer uses `tacticalThreePersistentGroundTexture(...)`; this removes the repeated diagonal dash/streak artifact visible in both isometric and FPV screenshots.
- Arid daylight receives the strongest readability lift so desert scrub, dusty yards, dry ground, and pale stone read as tan/ochre/sun-bleached surfaces rather than charcoal.
- Mediterranean, tropical, temperate, boreal, and tundra/alpine surfaces receive smaller environment-specific daylight lifts that preserve their own palette identity.
- True roads and service lanes intentionally receive much less lift, preserving the visual hierarchy of darker pavement against brighter surrounding soil/vegetation.
- Twilight and night retain darker presentation scaling; the change does not turn nighttime missions into daylight.

FOG-OF-WAR READABILITY
----------------------
- Explored-but-not-currently-visible ground uses a 13% veil during daylight instead of the previous 38% dark overlay.
- Twilight explored fog remains stronger at 24%; night remains stronger at 36%.
- Completely unrevealed cells remain heavily obscured: 72% by day, 79% at twilight, and 84% at night.
- No tactical knowledge is added. Alien/civilian/objective reveal rules and the authoritative visible/explored sets are unchanged.

SEAMS / HEX READABILITY
-----------------------
- Surface geometry scale is tightened from 1.008 to 1.006 and raster-closing underlay scale from 1.018 to 1.012.
- Seam color is now only about 1.5% darker than the owning presented tile and receives almost no detail-color pull.
- This keeps tiny WebGL gaps closed without redrawing the battlefield as dark hex outlines.
- Per-cell deterministic color variation remains, but its range is reduced so it cannot overpower the terrain category.

PRESERVED SYSTEMS
-----------------
- The left-side shot-result stack remains exactly where it is.
- FPV pre-aim, weapon rendering, target/VIP/civilian/extraction HUD, camera smoothing, sky/day-night atmosphere, architecture, victory music, reinforcement victory gate, pathfinding, cooperative aftermath, and lazy memorial indexing remain active.
- Cover, movement, pathfinding, line of sight, fog knowledge, hit chance, AI decisions, Time Units, mission resolution, and campaign data are unchanged.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static release validation confirms the persistent terrain builder contains no active ground texture map, uses explicit instance colors, retains the new patch flag, keeps the left shot stack, and uses the narrower seam geometry.
- A representative arid daylight fixture moves desert scrub from approximately `#745726` to `#9c7733` (luminance ~122) and dry ground from approximately `#a87539` to `#da9b51` (luminance ~163), while a true road remains near `#455060` (luminance ~79).
- Build Health now requires the bright regional terrain marker, texture-map-free persistent terrain, a brighter arid surface than road surface, narrow color-matched seams, and the reduced daylight explored-fog opacity.

MANUAL TEST GATES
-----------------
1. Re-run an arid Small Town daylight mission similar to the supplied screenshots. Open ground should read as dusty tan/ochre/stone, not black asphalt.
2. From 3D Iso, verify roads remain visibly darker than lawns/yards/scrub/soil and that terrain categories can be distinguished at a glance.
3. Enable FPV and verify nearby visible ground retains the same bright regional colors without the repeating diagonal dash texture.
4. Move into previously explored but currently unseen ground and verify it is shaded but still readable; completely unrevealed terrain should remain strongly fogged.
5. Confirm the left-side shot-result stack remains unchanged.
6. Run Build Health and confirm the FPV/terrain readability contract reports OK.

PREVIOUS BUILD - 2355
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2355_TERRAIN_PALETTE_RESTORE_AND_COLOR_MATCHED_SEAMS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected the 3D terrain presentation after Browser 2335 still made the battlefield read as a uniform sheet of asphalt. The problem was structural rather than a percentage needing another small adjustment: the complete interior color of every tile was still averaged toward neighboring tiles and then multiplied through one neutral texture. This build removes whole-tile neighbor averaging, restores authored terrain-specific textures, and confines visual softening to narrow color-matched seams plus subtle organic texture variation.

AUTHORED TERRAIN PALETTE RESTORE
--------------------------------
- The interior of each tactical hex again uses its own authored base, accent, and detail colors.
- Grass, forest floor, scrub, farmland, harvested fields, tilled soil, roads, service lanes, concrete, building interiors, stone, snow/sand, crash scars, and regional biome palettes remain visibly distinct.
- Neighbor colors no longer alter the complete tile face.
- The former single neutral ground texture has been removed from active persistent rendering.
- Palette-specific 64x64 textures now contain subdued deterministic mottling based on that terrain's own colors.
- Hex textures receive one of six rotations plus a very small brightness variation, reducing repeated stamped patterns without flattening terrain categories.

COLOR-MATCHED SEAMS
-------------------
- The raster-gap underlay is narrowed from scale 1.024 to 1.018.
- Each underlay instance receives a slightly darkened color derived from its own tile instead of one battlefield-wide gray seam color.
- The seam remains sufficient to close tiny WebGL junction gaps but no longer redraws the board as a dark hex grid.
- The legacy/fallback Three.js renderer receives the same terrain-matched seam behavior.

PRESERVED SYSTEMS
-----------------
- The well-received left-side shot-result stack is unchanged.
- FPV pre-aim, weapon rendering, HUD markers, regional sky, first-person camera smoothing, architecture, victory music, reinforcement victory gate, pathfinding, cooperative aftermath, and lazy memorial indexing remain unchanged.
- Terrain labels, cover, movement, pathfinding, line of sight, fog, extraction, destruction, AI decisions, and combat balance are unchanged.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- Build Health now requires authored palette batches, palette-matched seams, and removal of the active `neighborBlendedGround` renderer marker.
- A high-contrast grass-versus-road fixture must retain at least 86% of its authored color separation.
- The seam must remain close to the source tile color rather than becoming a universal gray.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Package validation confirms all victory-audio assets are unchanged.

MANUAL TEST GATES
-----------------
1. Inspect a mixed 3D battlefield from high zoom. Roads, fields, grass, soil, concrete, forest floor, and building interiors should be immediately distinguishable.
2. Confirm the ground no longer reads as one gray/asphalt sheet.
3. Look for narrow dark gaps between hexes. Tiny raster gaps should remain closed without an obvious universal grid.
4. Enter FPV and confirm the restored terrain color variety remains readable near ground level.
5. Confirm the shot-result stack remains on the left and unchanged.
6. Run Build Health and confirm the authored-palette terrain contract reports OK.

PREVIOUS BUILD - 2335
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2335_BALANCED_TERRAIN_BLEND_AND_LAZY_MEMORIAL_INDEX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Refined Browser 2300's terrain smoothing to a middle ground: neighboring hexes still soften abrupt boundaries, but each cell now retains more of its authored base/accent identity and natural local variation. The well-received left-side shot-result stack is unchanged. This build also completes the next documented performance cleanup by lazily indexing the 3,500-entry memorial message library and reusing that index during KIA/tribute generation.

BALANCED 3D TERRAIN BLENDING
----------------------------
- A cell's authored base and accent colors now create a deterministic local tone before any neighbor influence is applied.
- Neighbor blending is reduced from a uniform 26% to a contrast-aware 9%, 14%, or 18%.
- Similar neighboring terrain receives only a light smoothing pass; visibly different terrain receives a somewhat stronger but still bounded transition.
- Brightness variation is narrower and secondary to authored palette variation, preventing both flat sameness and regular alternating tiles.
- The seam underlay remains terrain-derived but is slightly lighter, avoiding a return to dark chessboard outlines.
- The renderer continues using one instanced ground batch with per-cell colors and exact instance-to-hex picking.
- Terrain labels, biome classification, cover, movement, pathfinding, visibility, fog, extraction, destruction, and balance are unchanged.

LAZY MEMORIAL MESSAGE INDEX
---------------------------
- The 3,500-entry massive memorial-message library no longer repeatedly normalizes every message's tags for every generated tribute.
- The first memorial selection lazily builds reusable records and indexes for relationship tier, item category, relationship tags, item tags, and tone.
- Later KIA and Memorial-screen selections reuse normalized Set-based records instead of allocating and scanning normalized tag arrays repeatedly.
- Candidate selection includes every message capable of receiving a positive score for the requested relationship/item/tone context.
- Exact legacy selection is preserved: if the best indexed candidate is low enough that unrelated zero-score entries could enter the weighted near-best pool, selection automatically falls back to the complete indexed record list.
- The index is transient runtime data. It is not serialized and requires no save migration.

PRESERVED PRESENTATION
----------------------
- The shot-result stack remains in the compact left-side position introduced by Browser 2300.
- FPV pre-aim, target HUD, visible weapon, regional sky, architecture, victory music, and the terminal reinforcement gate are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a balanced-blend contract requiring neighbor smoothing while retaining at least 62% of the original color separation in a high-contrast fixture.
- Added a lazy-index contract verifying one reusable cache, full library coverage, meaningful candidate narrowing, and identical indexed/exhaustive selected message IDs.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A 76,800-cell deterministic terrain comparison found that the revised blend preserved more of the authored cell color in 89.9% of samples while still moving 80.2% of samples toward their neighboring palette.
- Memorial equivalence validation compared 420 representative contexts against the previous exhaustive selector with zero message-ID mismatches. In an isolated 180-selection benchmark, the warmed indexed selector was about 4.2× faster (99 ms versus 420 ms).
- Save format remains 4 and the victory audio assets are unchanged.

MANUAL TEST GATES
-----------------
1. Inspect mixed forest/farmland, urban-edge, arid, tropical, tundra, road, soil, and concrete areas from elevated 3D Iso. Confirm boundaries are softened but the terrain no longer looks uniformly colored.
2. Zoom between local cells and confirm forests, fields, roads, scars, snow/sand, and building ground retain recognizable color differences.
3. Confirm the left-side shot-result stack remains unchanged and does not cover the primary action.
4. Complete a mission with one or more KIA, allow the cooperative aftermath to finish, and inspect the Memorial. Confirm tribute text/items remain varied and appropriate.
5. Reopen several fallen soldiers' memorial entries and confirm no runtime error and no missing offerings.
6. Run Build Health and confirm the balanced terrain / lazy memorial index contracts report OK.

PREVIOUS BUILD - 2300
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2300_FPV_PREAIM_LEFT_SHOT_STACK_AND_TERRAIN_BLEND_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Improved AI first-person combat readability by adding an explicit pre-fire target-acquisition phase: after movement completes, the camera and crosshair turn toward the acting AEGIS soldier's target and receive a bounded settle interval before the visible shot, muzzle response, and projectile effect begin. Tactical shot-result cards now occupy a compact left-side stack rather than the center of the battlefield, and persistent 3D ground colors blend with neighboring hexes to reduce the chessboard appearance from elevated camera angles.

FPV PRE-FIRE TARGET ACQUISITION
--------------------------------
- Human AI shots shown through First Person now create a temporary aim cue after the soldier's movement animation completes.
- The perspective camera targets the actual shot destination before `showShotEvent(...)` creates recoil, weapon audio, tracer/projectile, and impact presentation.
- Aim turning uses a faster but still smoothed interpolation while the cue is active, allowing the center reticle to settle onto the target instead of snapping at the same instant as the shot.
- At normal Battle Speed the acquisition interval is approximately 620 milliseconds. Faster playback scales the interval down but retains a 360-millisecond minimum; slower playback receives a proportionally longer interval.
- The reticle changes to an amber acquisition state and identifies the pending target during this short presentation window.
- Alien action frames and non-first-person playback retain their existing timing. The observer never changes to an alien viewpoint.
- This delay is presentation-only. AI choice, hit chance, resolved hit/miss result, damage, ammunition, Time Units, target selection, reaction-fire authority, and frame order are already authoritative and remain unchanged.

LEFT-SIDE TACTICAL SHOT STACK
------------------------------
- Shot-result cards have moved from the upper center of the tactical battlefield to a compact column on the left.
- The stack begins below the upper-left renderer/FPV status block so it does not cover the center reticle, line of fire, target brackets, or the main action.
- Cards use left-aligned text and a slightly narrower maximum width while preserving newest-first ordering, six-entry capacity, ten-second full visibility, independent fade timing, toggle behavior, and permanent Mission Timeline records.
- The relocation applies to 2D, 3D isometric, manual, Hybrid AI, and Simulation AI tactical presentation.

NEIGHBOR-BLENDED 3D TERRAIN
----------------------------
- Each persistent 3D ground hex now mixes its authored terrain color with the average color of adjacent hexes.
- A small deterministic location/mission variation keeps natural ground from becoming a flat single color while avoiding harsh alternating palette blocks.
- The prior set of separate palette batches is replaced in the live persistent renderer by one instanced ground batch with per-instance colors. This reduces terrain draw-call fragmentation while retaining one pickable cell mapping for tactical interaction.
- The seam underlay now derives from the average battlefield ground color instead of using a high-contrast slate seam, making neighboring terrain read as a continuous surface from above.
- Terrain identity, labels, regional biome selection, cover objects, occupancy, pathfinding, fog-of-war, visibility, movement, extraction cells, and tactical balance are unchanged.
- The change is procedural and requires no new image or audio assets.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression contract requiring the FPV aim cue, target-directed camera pose, speed-bounded settle delay, left-side shot-result stack, and neighbor-blended instanced terrain path.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted pure-helper test confirmed human shots create aim cues, alien shots do not take over the soldier-eye camera, the camera pose points at the intended target, and settle delays remain 620 ms at normal speed / 413 ms at 150% / 1240 ms at 50%.
- A high-contrast adjacent-cell fixture reduced summed RGB difference from 288 to 190 after blending, confirming the algorithm softens abrupt tile transitions without flattening them completely.
- Static package validation confirms the current build identifier, aim state/prop wiring, left-side stack classes, instanced per-cell colors, unchanged save format 4, and retained victory audio files.
- A complete live WebGL AI firefight remains the manual validation gate in this execution environment.

MANUAL TEST GATES
-----------------
1. Start a 3D tactical mission, hand control to Simulation AI, enable First Person, and observe an AEGIS soldier with a visible target. Confirm the camera turns and the reticle settles onto the target before the shot/tracer begins.
2. Repeat at 10%, 50%, 100%, and 150% Battle Speed. Confirm acquisition remains readable and no shot is skipped or duplicated.
3. Observe alien actions and confirm FPV holds the last valid AEGIS soldier rather than aiming through an alien's eyes.
4. Confirm hit/miss, damage, ammunition, career kill credit, shot audio, impact timing, and playback order match the authoritative simulation result.
5. Generate several shot results and confirm the stack stays on the left, below the FPV status panel, without covering the reticle or main target area.
6. Toggle Shot Results Off/On and confirm the established clearing/timing behavior remains intact.
7. Inspect mixed forest, farmland, urban-edge, arid, tropical, and tundra battlefields from 3D isometric zoom. Confirm neighboring ground colors transition more naturally and dark chessboard seams are reduced.
8. Confirm cover, walls, windows, buildings, movement paths, extraction, fog, and cell clicking remain aligned with the same authoritative hexes.
9. Run Build Health and confirm the new FPV pre-aim / left stack / terrain blend contract reports OK.

PREVIOUS BUILD - 2255
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2255_CAMERA_RELATIVE_SKY_FPV_HUD_WEAPON_AND_TRADITIONAL_ARCHITECTURE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected the oversized first-person celestial sphere by making the procedural sky camera-relative, repaired the persistent renderer's missing first-person weapon geometries so an armed soldier's barrel is reliably visible, added a visibility-authorized sci-fi visor HUD, and made regional buildings easier to recognize from ground level through traditional facade, roofline, window, shutter, and foundation details.

CAMERA-RELATIVE SKY / SUN FIX
-----------------------------
- The sky dome, stars, sun, moon, and celestial halo now remain centered on the active camera rather than remaining fixed at the battlefield world origin.
- The player can no longer approach the sun sphere as the observed soldier crosses a large map.
- Sun and moon discs use a smaller fixed apparent scale and remain near the atmospheric horizon/sky direction derived from mission time and longitude.
- The sky-gradient shader now derives height from local sphere coordinates, preventing camera translation from distorting the horizon gradient.
- The directional light continues to use the celestial direction while the decorative sky layer follows the camera.
- This is presentation-only and does not alter tactical light sources, line of sight, fog-of-war, accuracy, detection, or mission time.

FIRST-PERSON WEAPON VISIBILITY REPAIR
-------------------------------------
- Root cause: Browser 2210's persistent Three.js renderer created a first-person weapon rig but its own geometry cache did not define the referenced barrel, shroud, sight, and muzzle geometries. The older non-persistent renderer did define them, which allowed static source checks to pass while the live persistent view could show no weapon.
- The persistent runtime now owns explicit barrel, shroud, receiver, grip, sight, and muzzle geometry.
- The rig remains attached to the perspective camera and renders above world depth, preventing terrain or nearby cover from hiding the weapon.
- Barrel, shroud, and receiver retain the authoritative `soldierVisualData(...).weaponColor` used by the soldier card and battlefield model.
- Weapon length scaling, walking sway, and recoil remain presentation-only. Unarmed soldiers still show no firearm.

SCI-FI SOLDIER VISOR HUD
------------------------
- First-person observation now projects tactical brackets for visible hostile targets, priority VIPs, civilians, squadmates, a revealed active Alien Field Beacon, and known Skyranger extraction ramps.
- Each bracket has a role label, color-coded outline, and approximate hex distance.
- The HUD uses the same tactical visibility authorization as the battlefield renderer. A hidden alien, unrevealed civilian, or unseen beacon is not added merely because First Person is active.
- The viewed soldier is omitted from the overlay.
- Brackets are projected from world space every first-person render frame and naturally track smooth camera movement, turns, and unit motion.
- The overlay is observer information only. It does not select targets, issue orders, change AI priorities, or provide line-of-sight through cover.

TRADITIONAL / REGIONALLY READABLE BUILDINGS
--------------------------------------------
- The six existing regional environment profiles now select matching architectural presentation kits:
  - tropical veranda architecture,
  - arid adobe courtyard architecture,
  - Mediterranean stucco and tile architecture,
  - temperate brick-and-timber architecture,
  - boreal timber architecture,
  - tundra/alpine stone-and-timber architecture.
- Structural wall cells retain their exact gameplay footprint but now add recognizable foundations, facade palettes, eaves or parapets, roofline trim, vertical posts, framed windows, sills, shutters, and climate-appropriate awnings.
- Windows remain the same ballistic/visibility objects and retain their intact or shattered state.
- No decorative door is placed on a blocked wall cell, avoiding misleading false entrances.
- Existing authored doorway gaps, wall continuity, breach rubble, building interiors, cover values, destruction, pathfinding, and line-of-sight remain authoritative and unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a release contract requiring the camera-relative sky seam, complete persistent first-person weapon geometry, visibility-gated entity HUD, six architecture styles, and regional facade details.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted HUD fixture confirmed visible hostile, VIP, civilian, objective, and extraction entries while rejecting a revealed-but-currently-unseen alien.
- Static validation confirms the persistent geometry cache includes all weapon-rig parts and that the sky sync occurs before rendering.
- Headless Chromium could not produce a page DOM in this execution environment, so full live WebGL/React validation remains a manual gate.
- Save format remains 4. No external assets changed; players with the Browser 0043+ assets folder can replace only `index.html`.

MANUAL TEST GATES
-----------------
1. Enter a 3D tactical mission during daylight, enable AI First Person, and cross a large portion of the map. Confirm the sun remains a distant small disc and never becomes a large yellow dome.
2. Repeat at night and confirm the moon/stars remain fixed at atmospheric distance while the camera moves.
3. Observe an armed ballistic, laser, and plasma soldier. Confirm a barrel/receiver/grip are visible and match the weapon color on the soldier card.
4. Confirm the visor HUD brackets only contacts the squad can currently see, plus known squadmates/extraction. Move an alien behind opaque cover and confirm its hostile bracket disappears with tactical visibility.
5. Confirm VIP, civilian, revealed beacon, and extraction markers use distinct colors and track correctly while the observed soldier moves and turns.
6. Compare tropical, arid, Mediterranean, temperate, boreal, and tundra missions. Confirm buildings read as deliberate architecture rather than featureless slabs, especially from ground level.
7. Shoot through and shatter a window, breach a wall, and enter a doorway. Confirm all prior structural gameplay behavior remains unchanged.
8. Run Build Health and confirm the new FPV sky/HUD/weapon/architecture contract reports OK.

PREVIOUS BUILD - 2210
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2210_FIRST_PERSON_CAMERA_SKY_WEAPON_AND_REGIONAL_BIOME_POLISH_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Polished AI soldier-eye observation so discrete tactical hex movement reads as smooth first-person motion, added a camera-space weapon barrel that uses the same equipped-weapon color as the soldier card and battlefield model, introduced mission-location day/night skies, and expanded regional terrain/flora presentation across tropical, arid, Mediterranean, temperate, boreal, and tundra/alpine environments.

FIRST-PERSON CAMERA STABILIZATION
---------------------------------
- The observer camera no longer snaps directly to each newly committed tactical hex and facing.
- Eye position eases toward the soldier's authoritative world position while viewing direction uses a slightly softer interpolation, keeping movement responsive without abrupt turns.
- Acting-soldier changes snap to the new soldier rather than flying the camera across the battlefield between units.
- Movement uses restrained, bounded head bob and lateral sway. Idle breathing motion is deliberately minimal.
- Shots add a short controlled recoil response without changing aim, ballistics, damage, playback timing, or AI decisions.
- First-person rendering runs at the normal animation-frame cadence while active instead of using the slower tracker/victory-animation refresh interval.
- Isometric rendering, fog, terrain caches, unit nodes, and tactical simulation still use the same persistent Three.js runtime.

FIRST-PERSON WEAPON PRESENTATION
--------------------------------
- A compact camera-space weapon rig is shown in the lower-right portion of the first-person view.
- Barrel and shroud color come from `soldierVisualData(...).weaponColor`, the same source used by the soldier card and Three.js soldier model.
- Ballistic weapons remain dark gunmetal, laser weapons use the established blue/cyan treatment, and plasma weapons use the established green treatment.
- Basic length/scale differences distinguish carbines, sniper weapons, and heavier weapons while retaining a low-obstruction silhouette.
- The rig follows camera sway and recoil, updates when the acting soldier changes, and remains hidden for unarmed soldiers.
- The first-person HUD now identifies the viewed soldier and equipped weapon.

LOCATION-AWARE TACTICAL SKY
----------------------------
- Tactical atmosphere reads the mission's stored `tacticalClock` and geographic `location`.
- Local solar state selects daylight, twilight, or night presentation.
- The sky uses a procedural horizon-to-zenith gradient rather than an external image asset.
- Twilight receives a warmer horizon; night adds deterministic stars and a moon; daylight/twilight place a sun-like celestial disc according to local solar time.
- Hemisphere, key, rim, fog color, and fog distance are adjusted to the presentation phase.
- The atmosphere is available in first person and remains compatible with the isometric view.
- Sky and lighting are presentation only. Tactical visibility range, line of sight, fog-of-war discovery, AI knowledge, and weapon accuracy are unchanged.

REGIONAL TERRAIN AND FLORA VARIETY
-----------------------------------
- Mission coordinates and campaign region select one of six broad environmental profiles: tropical rainforest, arid scrubland, Mediterranean scrub, temperate woodland, boreal forest, or tundra/alpine ground.
- Open-ground labels and palettes adapt by profile, including rainforest floors, humid earth, desert scrub, acacia woodland, conifer forest, frost-paled ground, and regional stone tones.
- Three.js trees vary in canopy proportions and color: broad tropical crowns, flattened acacia forms, olive-like Mediterranean forms, tall conifers, and sparse alpine trees.
- Bushes, brush, crops, trunks, and rocks use matching regional palettes and modest deterministic shape variation.
- Small bounded cosmetic flora/stone batches add ground-level detail without occupying cells or becoming tactical cover.
- Cosmetic scatter uses a bounded deterministic sampling pass rather than scanning or creating detail on every map cell.
- Existing hard/soft cover records remain authoritative. Regional presentation does not add movement blockers, cover bonuses, line-of-sight blockers, or destructible objects.

GAMEPLAY / COMPATIBILITY
------------------------
- AI orders, movement paths, Time Units, fire-team formation, escort behavior, reaction fire, damage, reinforcement logic, victory handling, and mission results are unchanged.
- Existing cached tactical battles and save-format-4 campaigns require no migration.
- No new external assets were added. The victory-music assets from Browser 0043/1930/2145 are unchanged, so players with an intact assets folder may replace only `index.html`.

BUILD HEALTH / VALIDATION
-------------------------
- Added a presentation contract covering tropical/arid/tundra classification, local atmosphere generation, eased first-person animation, high-cadence first-person rendering, weapon-color sourcing, procedural sky/stars, and bounded regional scatter.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Isolated helper validation confirmed tropical South America, arid Africa, tundra northern Europe, temperate mid-latitude East Asia, arid forest-to-acacia terrain conversion, and night atmosphere selection.
- Static release checks confirm synchronized build metadata, current patch history, both new patch flags, the first-person weapon rig, local sky, regional flora profiles, and unchanged save format 4.
- A full live WebGL mission remains the final manual validation gate.

MANUAL TEST GATES
-----------------
1. Start a 3D tactical mission, hand control to Simulation AI, enable First Person, and watch a soldier cross several hexes. Confirm the camera glides through each step without hard positional snaps.
2. Watch the soldier turn and fire. Confirm the turn is readable, recoil is brief, and the reticle remains usable.
3. Observe ballistic-, laser-, and plasma-equipped soldiers and confirm the visible barrel matches the weapon color shown on their soldier cards.
4. Launch missions at daytime, twilight, and nighttime campaign hours. Confirm the sky, horizon, stars/celestial object, fog tone, and light levels change without altering fog-of-war discovery.
5. Compare low-latitude South America/Africa, arid Africa or the Middle East, northern Europe, and ordinary temperate missions. Confirm terrain and flora differ while every tactical cover cell and route remains unchanged.
6. Toggle First Person off during movement and confirm the persistent isometric battlefield returns cleanly.
7. Run Build Health and confirm the first-person camera/weapon/sky/regional-biome contract reports OK.

PREVIOUS BUILD - 2145
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2145_AI_FIRST_PERSON_OBSERVER_AND_TERMINAL_VICTORY_MUSIC_GATE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added an optional soldier-eye camera for AI-controlled tactical-map playback and corrected a reinforcement-state race that could briefly declare victory and start victory music before a newly materialized Alien Field Beacon wave reached the live battlefield unit state. The first-person view reuses the persistent Three.js scene and authoritative AI action stream; the victory cue now waits for a fully committed terminal mission state.

AI SOLDIER FIRST-PERSON OBSERVER
--------------------------------
- During full Simulation AI map playback and the AI-controlled portion of Hybrid AI, the tactical toolbar exposes `First Person: Off / On`.
- Enabling the option remembers the player's current 2D/3D view, switches to the persistent Three.js battlefield, and follows the currently acting living AEGIS soldier from eye height.
- During an AEGIS movement or shot, the camera follows that soldier and looks along the soldier's facing or active firing direction.
- During an alien/civilian action, the observer holds the most recently followed living AEGIS soldier rather than granting an alien-eye view.
- The viewed soldier's own Three.js model is hidden only from that perspective, preventing helmet/body clipping. A restrained reticle and `EYES:` identifier show whose viewpoint is active.
- Turning the option off restores the prior tactical view. It also turns itself off and restores the prior view when map-based AI playback ends, or safely falls back to 2D if the renderer reports a failure.
- The perspective camera shares the existing renderer, scene, terrain, fog, cover, actors, effects, and action timing. It does not create a second tactical simulation or rebuild the battlefield.

TERMINAL VICTORY / REINFORCEMENT AUDIO GATE
--------------------------------------------
- Root cause of the reported false cue: Alien Field Beacon arrival code updated the reinforcement cache before React committed the generated alien units. During that short boundary, the mission could see `arrived=true` while the old unit array still contained zero living aliens.
- Every reinforcement arrival now records the exact generated alien IDs and marks `arrivalCommitPending=true`.
- The pending marker remains authoritative until all generated IDs appear in the live unit collection. Tactical terminal-state evaluation cannot declare victory during that boundary.
- Because the victory dance and direct-control victory cue derive from the same terminal state, neither can start before the wave is actually present.
- Direct tactical audio also contains a defensive reversible handoff: if a previously signaled victory becomes non-terminal, the victory player is stopped and its mission trigger is released.
- Simulation/Classic playback victory music now requires the actual final `Mission success` frame, a completed stream, no continuation state, and no pending reinforcement commit.
- Confirmed beacon destruction, mandatory rescue objectives, incomplete operations, withdrawals, failures, and all existing victory rules remain authoritative.

GAMEPLAY / COMPATIBILITY
------------------------
- First-person mode is an observer camera only. AI orders, Time Units, movement paths, formations, escorts, visibility rules, weapon fire, damage, reinforcement behavior, and mission results are unchanged.
- Team-authoritative fog and hidden-contact rules remain active; the camera does not reveal unrevealed aliens or unexplored battlefield state.
- The four Operation Vindicator victory MP3 files are unchanged from Browser 0043/1930. Players updating from Browser 1930 may keep their existing `assets` directory.
- Save format remains 4; existing campaigns and cached tactical battles require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- Added a terminal-victory regression that reproduces a reinforcement cache containing generated IDs before those IDs exist in the live unit array. Victory must remain false until the units are committed.
- Added a playback-audio regression requiring the final completed frame and rejecting an incomplete stream or a reinforcement commit boundary.
- Added an AI first-person observer contract covering human-only actor selection, last-soldier fallback, facing/shot camera direction, perspective-camera ownership, active-camera rendering, toolbar wiring, reticle, and reversible view cleanup.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Isolated tests confirm the reinforcement pending marker clears only after every generated ID is present, terminal victory remains blocked during the gap, final-frame victory audio remains allowed afterward, and first-person actor/facing selection is correct.
- Automated Chromium loading remains blocked by the execution environment's browser-administrator policy, so a complete live WebGL mission is retained as a manual test gate.

MANUAL TEST GATES
-----------------
1. Hand a 3D tactical mission to Simulation AI, toggle First Person on, and confirm the camera follows each acting AEGIS soldier during movement and firing.
2. Let an alien act and confirm the view remains with the last living AEGIS soldier rather than changing to an alien viewpoint.
3. Toggle First Person off and confirm the exact previous 2D/3D view returns. Repeat by allowing AI playback to end while First Person is still active.
4. Repeat during a Hybrid AI support handoff and confirm the view follows support soldiers, then exits when player leader control returns.
5. Trigger an Alien Field Beacon reinforcement as the apparent last alien is defeated. Confirm no victory music or victory dance begins before the arriving aliens are committed and visible under normal fog rules.
6. Defeat the actual final force and satisfy all beacon/rescue objectives; confirm one random Operation Vindicator cue begins exactly once.
7. Run Build Health and confirm the new first-person observer and terminal victory-music contracts report OK.

PREVIOUS BUILD - 1930
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.1930_TACTICAL_PATH_PARENT_POINTER_AND_BLOCKER_INDEX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Optimized tactical route searches without changing movement rules or route choice. The main breadth-first pathfinder now indexes hard cover and living occupancy once per search, stores parent links instead of copying the complete route into every queued node, and reconstructs only the final winning path. Multi-destination beacon and rescue planners also reuse one blocker index across their candidate searches.

INDEXED BLOCKERS
----------------
- `tacticalPathBlockerIndex(...)` builds one hard-cover key set and one living-unit occupancy key set for a route-search context.
- Destroyed/soft cover remains passable, rescued units remain non-blocking, and the acting unit is excluded exactly as before.
- Each explored cell now performs constant-time blocker membership checks rather than scanning the full cover and unit arrays.
- `tacticalReachableCellSet(...)` uses the same indexed blocker doctrine.

PARENT-POINTER ROUTE RECONSTRUCTION
-----------------------------------
- The old breadth-first queue stored a full copied `path` array on every candidate node. Longer searches repeatedly allocated and copied every prior step.
- Each queued node now stores only coordinates, step count, and its parent queue index.
- Once the destination is found, the route is reconstructed backward through those parent indexes and reversed once.
- Neighbor order, visited-on-enqueue behavior, shortest-path selection, maximum-step handling, target blocking, and returned start-to-target coordinate shape remain unchanged.
- `tacticalPathDistance(...)` can return the discovered step count without reconstructing a coordinate array.

SHARED MULTI-DESTINATION INDEXES
--------------------------------
- Alien Field Beacon close-assault planning reuses one blocker index while comparing the six legal shield-entry cells.
- VIP/civilian rescue ingress planning reuses one blocker index while comparing multiple legal contact cells, doors, and breached approaches.
- This reduces repeated setup work in AI situations that intentionally compare several routes from the same unit and battlefield state.

VALIDATION
----------
- A deterministic Build Health contract verifies hard-cover indexing, living occupancy indexing, rescued-unit exclusion, route legality, path-distance agreement, parent-index storage, and removal of per-node path-array copying.
- An external randomized equivalence test compared 5,000 generated maps against the previous pathfinder and produced identical routes or identical null results in every case.
- In an isolated 96 x 96 long-route Node benchmark, 30 identical searches fell from roughly 855 ms with copied route arrays to roughly 255 ms with indexed blockers and parent indexes. Browser gains will vary by battlefield and hardware.
- All non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; existing campaigns and cached tactical states require no migration.

MANUAL TEST GATES
-----------------
1. Move a soldier around hard cover in 2D and Three.js views and confirm the preview and completed route match prior behavior.
2. Run Hybrid AI and full Simulation AI through buildings, narrow doors, friendly traffic, and long formation catch-up routes.
3. Run a VIP rescue with an occupied doorway and confirm the leader still chooses a legal interior contact route while supports remain formation traffic.
4. Assault a confirmed shielded Alien Field Beacon and confirm the team can compare and select reachable entry cells without changing shield or formation rules.
5. Confirm TU cost, reserved-fire allowance, occupancy, extraction, fog, reaction fire, and movement animation remain unchanged.
6. Run Build Health and confirm “Tactical pathfinding uses indexed blockers and parent-pointer reconstruction” reports OK.

PREVIOUS BUILD - 0043
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.0043_RANDOM_MISSION_VICTORY_MUSIC_AUDIO_ASSET_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added a four-track mission-victory music bank using the supplied Operation Vindicator recordings. When a tactical mission reaches an authoritative successful outcome, one track is randomly selected and plays while surviving soldiers celebrate on the final battlefield.

RANDOM SUCCESS MUSIC
--------------------
- Packaged all four supplied MP3 files under `assets/audio/victory/`.
- A successful direct-control, Hybrid AI, Simulation AI, or Classic Lineup mission selects one Operation Vindicator track at random.
- The selector avoids immediately repeating the last successfully played track whenever another track is available.
- The cue triggers once for a mission even if the victory battlefield rerenders, switches between 2D and Three.js, or remains open after the song ends.
- Mission failure, withdrawal, objective failure, incomplete operations, and unresolved AI safety handoffs do not trigger victory music.

MUSIC HANDOFF
-------------
- The active mission-threat score pauses when the victory cue starts.
- Victory music follows the existing Music On / Off setting and master music volume.
- Changing the music mode manually remains an explicit player override.
- Leaving the completed mission stops the victory cue immediately; the normal Geoscape/command music system then resumes through its existing context routing.
- The four tracks are external packaged assets rather than base64 strings, avoiding a large increase to `index.html` parse and startup cost.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression contract requiring four unique victory assets, randomized no-immediate-repeat selection, successful-mission wiring in `TacticalMission`, and successful terminal-frame wiring in Simulation/Classic playback.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- All four MP3 assets decode as stereo 44.1 kHz audio and are approximately 60.0 seconds long.
- Save format remains 4; existing campaigns require no migration.

MANUAL TEST GATES
-----------------
1. Complete a direct-control 3D Iso mission and confirm one Operation Vindicator cue starts once when Tactical Victory appears.
2. Switch between 3D Iso and 2D Hex while the victory screen remains open and confirm the cue does not restart.
3. End the incident before the cue finishes and confirm it stops immediately as the Skyranger return begins.
4. Complete several successful missions and confirm the selected cue varies without immediately repeating when alternatives exist.
5. Complete or withdraw from a failed mission and confirm no victory cue plays.
6. Test Simulation AI and Classic Lineup victories and confirm the cue begins on the authoritative `Mission success` frame.
7. Turn Music Off before victory and confirm the victory cue remains silent; turn music back on for a later mission and confirm normal operation.

PREVIOUS BUILD - 2207
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.2207_COOPERATIVE_MISSION_AFTERMATH_AND_DIRECT_FINALIZER_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Further optimized the tactical mission ending and return-to-base debrief after Browser 2024 removed the hidden second battle simulation. The manual exit path now constructs its result directly from the live battlefield instead of entering the shared tactical resolver at all, and the campaign aftermath is processed cooperatively in short chunks so Chromium can repaint and service input between expensive stages.

DIRECT LIVE-BATTLE FINALIZER
----------------------------
- `End Incident and Return to Base`, loss confirmation, and manual withdrawal no longer construct a tactical continuation snapshot after the visible battle has ended.
- The manual finish path no longer calls `resolveMission(...)`, even in `finalizeOnly` mode.
- Growth, XP, kill credit, wound/KIA state, tactical medical status, stat-up rolls, civilian outcome, and round count are derived directly from the authoritative live tactical units.
- This avoids the resolver's remaining simulation-oriented setup work such as tactical visibility recomputation, unit visibility snapshots, playback-frame construction, continuation-state packaging, and other state preparation that is unnecessary after a completed player battle.
- The shared resolver and its `finalizeOnly` compatibility seam remain available for other code paths; this patch only removes that overhead from the already-completed manual battlefield exit.

COOPERATIVE RETURN-TO-BASE AFTERMATH
------------------------------------
- `finishMission(...)` is now a cooperative asynchronous debrief pipeline rather than one uninterrupted JavaScript task.
- Large roster updates are applied through bounded 12-soldier chunks with an event-loop yield between chunks.
- Friendship aftermath, KIA memorial processing, soldier-state commit, reports, recovery, and Geoscape-time advancement receive separate yield boundaries so the browser can render between major stages.
- KIA memorial-offering generation is processed in smaller chunks, preventing the large memorial-message library from monopolizing the entire mission-return transition when several soldiers are lost.
- Mission growth is indexed by soldier ID once and reused through roster and squad-wipe checks instead of repeatedly scanning the result-growth array.

SAVE / CONSISTENCY SAFETY
-------------------------
- A mission-aftermath in-progress guard prevents the same debrief from being started twice.
- Rotating autosave is suspended while the cooperative aftermath is only partially applied.
- Manual save is temporarily blocked during that short debrief window so no save slot can capture an in-between campaign state.
- The guard clears when the debrief completes or if the debrief throws an error.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- Build Health now requires the manual tactical path to use `tacticalFinalizeLiveBattleResult(...)` and rejects reintroduction of `finalizeOnly:true` or a `finalBattleState` continuation snapshot in the tactical finish function.
- The same contract requires cooperative roster mapping, explicit event-loop yields, and the autosave in-progress guard.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Current build metadata and in-game patch history are synchronized to Browser 2207.

MANUAL TEST GATES
-----------------
1. Win a 3D Iso mission, leave the soldiers dancing briefly, then click End Incident and Return to Base. Confirm the Skyranger return transition begins without a long frozen pause.
2. Let the Skyranger reach base and confirm the debrief/report transition remains responsive instead of producing a browser "page not responding" warning.
3. Repeat with wounded soldiers and at least one KIA to exercise the heavier memorial/recovery path.
4. Confirm XP, career kills, wounds/KIA, recovered gear/materials, rescue totals, reward, panic, mission report, and squad removal still match the played battle.
5. Try saving during the brief debrief-processing window and confirm the game refuses the save rather than writing a partial campaign state.
6. Repeat a 2D mission and a Hybrid AI mission that returns to manual control before victory.

PREVIOUS BUILD - 2024
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.2024_MANUAL_TACTICAL_EXIT_FAST_PATH_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Optimized the manual tactical mission exit transition. Ending a played battle no longer launches a second hidden multi-round AI simulation before the Skyranger return handoff. The game now snapshots the live battlefield and runs only the established result-finalization formulas, preserving the actual battle outcome while making the exit click substantially lighter.

MANUAL TACTICAL EXIT FAST PATH
------------------------------
- `End Incident and Return to Base`, loss confirmation, and manual withdrawal now snapshot the current tactical units, cover, rescue state, Alien Field Beacon state, reinforcement state, explored cells, round, and Skyranger deployment.
- `resolveMission(...)` gained a `finalizeOnly` path. It reuses the existing XP, wounds, KIA, stat-up, civilian, beacon, result-log, recovery, and campaign aftermath formulas but skips the combat simulation loop completely.
- The previous manual exit path invoked `resolveMission(...)` from a fresh deployment. That could spend time resolving up to dozens of hidden AI rounds after the visible battle had already ended.
- The new path does not create an extra tactical round, does not move units, does not fire hidden shots, and does not regenerate the battlefield.
- Full Simulation AI and Hybrid AI results that already own an authoritative resolved result continue to use their existing result handoff.

LIVE KILL ACCOUNTING
--------------------
- Manual direct-fire kills now increment the acting soldier's mission kill counter.
- Frag Grenade multi-kills add the exact number of aliens eliminated to the thrower's mission kill counter.
- Manual reaction-fire kills increment the reacting soldier's counter.
- AI/Hybrid playback snapshots now retain the `kills` value so command handoffs do not erase previously earned kills before a later manual mission exit.
- Mission XP and career kill totals therefore use the played battle's retained kill count rather than a hidden post-battle re-simulation.

BUILD HEALTH / VALIDATION
-------------------------
- Added a Build Health contract requiring the manual finish path to create a live-state continuation snapshot, request `finalizeOnly:true`, and gate the resolver's combat loop behind `!finalizeOnly`.
- The contract also checks direct-fire and grenade kill-accounting seams.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Complete a 3D Iso tactical victory and click End Incident and Return to Base; confirm the Geoscape/Skyranger return transition begins promptly.
2. Repeat after a 2D manual victory.
3. Confirm wounded/KIA soldiers, rescue totals, beacon status, recovered materials, rewards, panic, and mission report still match the battle.
4. Confirm soldiers receive career kills for manual rifle kills, grenade multi-kills, and reaction-fire kills.
5. Test a manual withdrawal/failed mission and confirm no extra hidden combat occurs before return.

PREVIOUS BUILD - 1650
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1650_ALL_TACTICAL_VICTORY_DANCE_RESTORE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restored the soldier victory celebration across successful tactical mission outcomes. The persistent Three.js renderer was starting its victory animation loop but not invalidating the actor layer when the victory flag changed, so existing soldier nodes never received the dance state. 2D and playback celebrations remain active, and the shared success rule is now future-safe for victory objectives that may not require every alien to be dead.

ALL-SUCCESS VICTORY CELEBRATION
-------------------------------
- Every surviving AEGIS soldier celebrates while a successfully completed tactical battlefield remains open for review.
- Direct-control, Hybrid AI, full Simulation AI, Classic Lineup, 2D Hex, tactical-map playback, and Three.js Iso all retain their existing presentation paths but share the same successful-outcome doctrine.
- KIA soldiers remain fallen and do not animate. Mission failures, withdrawals, objective failures, incomplete operations, and unresolved AI handoffs do not trigger celebration.
- Playback victory detection now keys off the authoritative `Mission success` terminal frame instead of additionally requiring `alienAlive === 0`. This preserves celebrations for future objective-driven victories that can legitimately end with hostiles still present.

PERSISTENT THREE.JS REGRESSION FIX
----------------------------------
- Root cause: Browser 1342 made the Three.js scene persistent and separated actor updates from animation state. `victoryDance` correctly restarted the animation loop, but the actor invalidation key only tracked unit state. When victory arrived without a unit-state change, `tacticalThreePersistentUpdateUnits(...)` did not run and every existing soldier node kept `victoryDance=false`.
- The persistent actor key now includes the victory-dance state. A victory transition updates the existing nodes in place, marks only living human soldiers to celebrate, and retains the same renderer, scene, terrain, cover, fog, and actor objects.
- Returning from celebration or disposing the battlefield still restores normal standing/fallen poses through the existing explicit living-state logic from Browser 1645.

BUILD HEALTH
------------
- Strengthened the all-battle-views victory contract to verify direct 2D/3D wiring, Simulation/Classic playback, living-vs-fallen behavior, failure exclusion, and persistent actor invalidation when only the victory flag changes.
- Added a future-facing success fixture whose terminal frame is `Mission success` even with a nonzero alien count; surviving soldiers still celebrate because success, not elimination count, is authoritative.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1645
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1645_THREEJS_LIVING_UNIT_POSE_HOTFIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected an intermittent persistent-3D pose bug that could make every soldier, civilian, and alien begin a mission lying prone despite being alive. The 1615 2D cell-index optimization remains active.

LIVING UNIT POSE HOTFIX
-----------------------
- VIP tracker animation exposed the bug because it keeps the persistent renderer animation loop active.
- The loop previously searched a composite visual signature for `:0:` as a shorthand for death. Ordinary living-unit fields such as not panicked also contain that token.
- Every 3D unit node now stores an explicit living-state property. Animation and animation shutdown use only that property to choose standing or fallen rotation.
- Fallen units remain prone, while living soldiers, civilians, and aliens remain upright during tracker pulses and other continuous animations.

2D CELL RENDER INDEXES
----------------------
- Living/visible-state unit occupancy is indexed once per unit-state update while preserving fallen-human and resolved-battle display rules.
- Active cover is indexed once per cover update; destroyed cover is excluded exactly as before.
- Ground-level equipment is grouped by cell once per inventory change rather than filtered for every rendered hex.
- The current movement path is indexed by cell and retains the first step number when a path revisits a hex.
- Each rendered cell constructs its coordinate key once and reuses it for visibility, exploration, tracker, beacon-shield, item, movement, and React-key lookups.
- The optimization changes presentation lookup cost only; tactical movement, formation following, fog, line of sight, targeting, and mission resolution are unchanged.

VISIBILITY AND TERRAIN CACHES
-----------------------------
- Procedural 2D terrain cells are generated once per mission/cell and reused during later renders.
- Sight-blocking cover is indexed once per cover-state signature, including wall, window, breach, HP, blocking, and shattered-window state.
- Each living human observer has a bounded visibility entry keyed by mission, grid size, position, facing, and current cover signature.
- Alien or civilian movement reuses every soldier visibility entry. Moving one soldier misses only that observer entry while the remaining fire team stays cached.
- Bounded mission, context, and observer cache sizes prevent long campaigns from growing memory without limit.

AI-CONTROLLED FOG-OF-WAR FIX
----------------------------
- The supplied Sunken Relay save exposed a presentation mismatch: full-AI playback suppressed every 3D ground-fog instance even though unit and cover discovery still followed soldier vision.
- `aiMapPlayback` no longer reveals the complete ground. Unseen cells use the strong fog batch, explored cells use the lighter batch, and visible cells remain clear in manual, Hybrid AI, and full-AI control.
- Only a resolved tactical battle may reveal the complete ground for the final battlefield view.

PERSISTENT THREE.JS TACTICAL RUNTIME
------------------------------------
- Entering a 3D tactical mission creates one renderer and scene runtime. It is disposed when the mission view ends, the mission changes, or the player changes the 3D quality setting.
- The complete tactical grid is built once with instanced ground and seam geometry. Changing the viewed area, selecting a soldier, or following an action moves the camera without reconstructing terrain.
- Fog uses two reusable instanced batches for unseen and explored cells. Visibility changes update their matrices and counts rather than creating thousands of new meshes.
- Static cover and Skyranger geometry live in their own scene layer and rebuild only when their source state changes. Cover changes also invalidate visibility so a newly opened breach cannot leave stale fog behind.
- Human, alien, and civilian models are indexed by unit ID. Movement mutates each existing node's position, and facing rotates only the weapon/direction pieces. Visual-signature changes such as death, equipment, panic, or escort status replace only that unit node.
- Selection rings, VIP trackers, movement/shot effects, camera framing, and animation state each have bounded update paths instead of sharing a single full-scene rebuild effect.

VALIDATION
----------
- Added a regression contract proving that a living unit whose signature contains unrelated zero-valued fields remains upright while a fallen unit remains prone.
- Added a deterministic contract covering living and fallen unit rules, destroyed cover exclusion, floor-level item grouping, and repeated movement-path cells.
- The 2D render-source check requires all four memoized indexes to be wired into the visible-cell loop.
- Added a focused cache contract proving that unrelated alien movement reuses every soldier sight result, while moving one soldier recalculates only that observer.
- The contract also verifies deterministic terrain reuse, shared cover-context reuse, and bounded cache behavior. JavaScript syntax and the static release checker pass for build 1445.
- Added Build Health contracts for persistent scene ownership, cached terrain, stable unit nodes, cleanup, and layer-specific invalidation.
- Static JavaScript syntax validation passes.
- Live browser validation launched a 64 x 64 tactical mission, switched into 3D Iso, selected another soldier, and completed a turn update while retaining the same renderer identity (`tactical-three-1`) with exactly one live 3D root and no runtime-error overlay.
- The full diagnostic suite remains at the prior build's established baseline; the new persistence-specific check passes.
- Save format remains 4. Existing campaigns and cached tactical battle state require no migration.

PREVIOUS BUILD - 1615
=====================

Build: v0.26.08.15.1615_TACTICAL_2D_CELL_RENDER_INDEX_PATCH
Save format: 4 (unchanged)

Added memoized 2D cell indexes for units, cover, floor equipment, and movement paths.

PREVIOUS BUILD - 1445
=====================

Build: v0.26.08.15.1445_TACTICAL_VISIBILITY_AND_STATIC_TERRAIN_CACHE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Added deterministic terrain, reusable cover-context, and per-observer tactical visibility caches.

PREVIOUS BUILD - 1430
=====================

Build: v0.26.08.15.1430_PERSISTENT_THREE_TACTICAL_RENDERER_AND_AI_FOG_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Restored unexplored and explored 3D fog shading during full-AI tactical control while retaining the persistent renderer.

PREVIOUS BUILD - 1342
=====================

Build: v0.26.08.15.1342_PERSISTENT_THREE_TACTICAL_RENDERER_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Introduced the persistent Three.js tactical renderer, stable actor nodes, instanced terrain/fog, and layer-specific invalidation. Full-AI ground fog was corrected in the following 1430 build.

PREVIOUS BUILD - 1208
=====================

Build: v0.26.08.15.1208_DEFERRED_BUILD_HEALTH_AND_STABLE_GEOCLOCK_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Reduced boot work and corrected the Geoscape clock lifecycle. Startup now runs only a tiny critical smoke test covering the game root, React runtime, and build/save metadata. The complete Build Health suite is cached but not executed until the player opens Build Health. The Geoscape clock now keeps one interval across ordinary campaign and UFO updates while a live callback reference supplies current simulation state.

DEFERRED BUILD HEALTH
---------------------
- The full diagnostic suite no longer runs from the app component's boot-time memo. The memo receives a shared four-check boot result without constructing battlefields, visibility contexts, path searches, tactical fixtures, or the rest of the full suite.
- Selecting any Build Health button opens the diagnostics panel immediately and schedules the full suite through requestIdleCallback, with a short timer fallback for browsers that do not implement the idle API.
- The completed result array is cached for the session. Reopening Build Health does not repeat the full suite.
- Full-suite exceptions are caught and displayed as a failed diagnostic instead of escaping into the startup path.
- The critical boot smoke remains synchronous and deliberately small: root element, React runtime, and build/save metadata only.

STABLE GEOSCAPE CLOCK LIFECYCLE
--------------------------------
- The Geoscape timer now depends only on whether the clock is running, its selected speed, the active app screen, and game-over state.
- Month, day, minute, mission, playback, council, UFO, and radar updates no longer tear down and recreate the interval on every simulation tick.
- A render-updated callback ref gives each interval tick the latest campaign closure, avoiding stale state without adding volatile effect dependencies.
- Pausing, changing speed, leaving the game screen, or reaching game over still tears the timer down normally.

BUILD HEALTH
------------
- Browser validation confirms the start screen appears while the full-suite status remains deferred, Build Health first displays the four boot checks, and the complete suite then replaces them after the idle run.
- The full suite now reports dedicated passing contracts for deferred execution and stable Geoscape interval ownership. A live 5-minute clock run advanced from 08:00 to 08:10 without a runtime error.
- Static release checks require the new patch flags, deferred runner/cache/listener, live Geoscape callback ref, bounded timer dependencies, current metadata, and unchanged save format.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 2112
=====================

Build: v0.26.08.14.2112_HYBRID_OPENING_ESCORT_SUPPORT_FOLLOW_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed Hybrid AI support soldiers being suppressed by the escort/rescue system during the opening support handoff. When a player-controlled fire-team leader is holding position with a VIP or civilian, only the leader remains committed to the escort action; supports spend their own TU moving toward the current formation cells. Long catch-up moves may complete their second movement checkpoint instead of being reduced to a single hex while the support remains outside normal cohesion.

OPENING HYBRID ESCORT FOLLOW FIX
--------------------------------
- Hybrid AI marks the player-controlled leader as a fixed escort lead during the support handoff. The rescue planner no longer treats the entire fire team as already committed merely because the held leader has zero TU.
- Supporting soldiers remain eligible for the normal hybrid movement pass and calculate their positions around the leader and escorted civilian/VIP column.
- Stay on Escort keeps supports on escort-relative formation cells even when aliens are visible. Break Off and Engage retains enemy-relative flank behavior.
- The leader does not move a second time under rescue AI after the player has positioned them.
- Formation catch-up extensions may continue when each additional leg makes progress toward the held leader.

PREVIOUS BUILD - 1728
=====================

Build: v0.26.08.14.1728_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed the escort-contact decision in Hybrid AI Command. Applying Stay on Escort or Break Off and Engage now replans the remaining support action as a bounded Hybrid AI round, keeps fire-team leads under player control, and returns to the next Hybrid AI leader phase instead of silently handing the entire mission to full Simulation AI.

HYBRID ESCORT DECISION MODE PRESERVATION
----------------------------------------
- Applying an escort-contact decision now detects whether it interrupted a normal Simulation AI stream or a one-round Hybrid AI support handoff from the active playback marker.
- In Hybrid AI, Apply Escort Decisions cancels only the stale pre-decision playback plan, applies the selected team assignments to the live battlefield, and rebuilds one bounded hybrid support round from that position.
- The rebuilt playback retains the Hybrid AI round marker, holds player-controlled fire-team leads in place, and uses the chosen stay/break-off duties for support movement and engagement.
- When that support round ends, the normal Hybrid AI completion path refreshes TU and returns selection to a living fire-team lead. It does not continue simulating future rounds or finish the mission under full AI control.
- Normal full Simulation AI escort prompts retain their prior continuation behavior. The fix changes only prompts raised during a Hybrid AI support round.
- If the hybrid replan cannot be prepared, the battlefield is restored to a fresh player-controlled Hybrid AI leader phase instead of falling through to full AI.

BUILD HEALTH
------------
- A deterministic regression checks explicit hybrid prompts, legacy prompts detected from a hybrid playback marker, and ordinary Simulation AI prompts.
- Static release checks require the patch flag, continuation-mode helper, hybrid restart path, bounded one-round settings, and Build Health result label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1712
=====================

Build: v0.26.08.14.1712_UFO_INTERCEPTION_BOARD_AND_HYBRID_SUPPORT_CATCH_UP_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Active UFOs now opens a centered, scrollable UFO Interception Board instead of expanding the contact cards at the bottom of the Geoscape. The board retains the complete radar, mission-risk, damage-memory, sortie-readiness, and one/pair/all-base interceptor controls. Hybrid support soldiers also use a full-TU formation catch-up when their selected shot reserve would otherwise leave them behind their moved fire-team lead.

UFO INTERCEPTION BOARD
----------------------
- The Active UFOs (count) button beside Open Incident List now opens a centered modal panel with a fixed header, close button, and independently scrollable contact list.
- Players no longer need to scroll below the globe and tracking panels to review a long list of UFOs.
- Each contact retains its UFO size or unresolved-echo label, region, flight progress, radar quality, threat, sortie summary, mission-risk estimate, last air-combat report, and remembered UFO damage.
- The existing 1 Interceptor, Pair, and All Bases launch actions operate directly from the board and keep their established readiness, detection, route, ferry-network, and active-travel safeguards.
- The panel is presentation-only: UFO movement, detection, air combat, time progression, and save data remain authoritative and unchanged.

FULL-TU HYBRID FORMATION CATCH-UP
---------------------------------
- A hybrid support compares the distance to its current leader-relative formation cell with the number of steps available after its AI-selected shot reserve.
- If that reserve is the only reason the support cannot reach formation during a no-contact handoff, the AI temporarily chooses Formation Catch-Up, releases the reserve, and may spend its full movement TU allowance.
- The catch-up uses the direct formation path and the normal two-leg reassessment playback, so a support may cover up to the full fifteen-step adaptive movement ceiling rather than stopping at an eight-step aimed-reserve allowance.
- A support does not discard its reserve for catch-up when an alien is observed. Enemy-relative flanking, legal fire, cover, cohesion, occupancy, escort, and extraction rules remain authoritative during contact.

BUILD HEALTH
------------
- A new Geoscape contract verifies the centered dialog, independent scroll region, radar-contact cards, and all three interceptor launch controls.
- A tactical regression compares the same distant support route with and without catch-up, confirming eight reserved steps become fifteen full-TU steps while visible contact preserves the original reserve.
- Static release checks require both patch flags, modal controls, scroll markers, catch-up planner, action label, and regression fixtures.
- Save format remains 4. Existing campaigns require no migration.

PREVIOUS BUILD - 1347
=====================

Build: v0.26.08.14.1347_HYBRID_AGGRESSIVE_FLANKING_AND_SUPPORT_MOVEMENT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed hybrid AI support soldiers holding position when they should follow their leader. During alien contact, left and right supports now calculate aggressive firing flanks relative to the line between their fire-team lead and an actually observed alien. Outside contact, or when a safe flank cannot be reached, supports use a direct route toward their normal leader-relative formation slots.

HYBRID SUPPORT MOVEMENT FIX
---------------------------
- The previous handoff sent a desired formation cell through a general combat-position scorer as though that cell were an enemy. That scorer could prefer the soldier's starting hex, producing a complete support hold despite available TU.
- Formation following now uses a dedicated path to the exact open role cell selected by the established fire-team formation system. It spends only TU available after the AI's chosen reserve and retains normal occupancy, terrain, and bounded-route checks.
- A blocked exact role cell falls back to the reachable cell that makes the best progress toward it instead of silently abandoning the movement.

AGGRESSIVE ENEMY-RELATIVE FLANKS
--------------------------------
- When the fire team observes an alien, support movement is evaluated against that real alien rather than the formation marker.
- Left and right roles seek opposite lateral sides of the lead-to-alien line. Candidate positions favor line of sight, weapon range, useful forward pressure, nearby cover, low crowding, and cohesion within six hexes of the lead.
- The team's preferred alien remains first choice when it is alive and observed; otherwise the nearest currently observed alien becomes the flank reference.
- If no legal aggressive flank is available, the soldier safely returns to direct formation-follow movement. This keeps the standard fire-team formation as the fallback and does not give supports independent player orders.
- Fire-team leads remain under player control during the hybrid phase. Run Hybrid AI Turn still resolves one sequentially animated support-and-engagement round and then returns control with refreshed TU.

BUILD HEALTH
------------
- A deterministic regression fixture places left and right supports behind their lead, confirms both spend movement TU, and verifies that they choose opposite sides of an observed alien while remaining within fire-team cohesion.
- The fixture also verifies that direct formation fallback advances toward an exact role cell when no combat flank is being used.
- Static release checks require the new patch marker, combat-target selection, dedicated formation-follow planner, aggressive flank planner, resolver integration, and regression label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1236
=====================

Build: v0.26.08.14.1236_HYBRID_LEADER_CONTROL_AND_COLLAPSIBLE_UFO_LIST_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hybrid AI Command is now available directly from the main tactical toolbar in both the 2D and Three.js isometric battle views. While active, the player cycles through fire-team leads, moves them using the normal TU and reserve system, and may fire at an alien to establish the team's preferred target. Ending the turn hands supporting-soldier formation movement and alien engagement to the AI for one animated round, then returns leader control. The Geoscape's long active-UFO card list is now collapsed by default behind an Active UFOs button beside Open Incident List.

BATTLE-SCREEN HYBRID AI COMMAND
-------------------------------
- A Hybrid AI: On / Off button is part of the shared tactical toolbar, so it remains available in both 2D Map and Three.js ISO views.
- Enabling it changes Prev Soldier and Next Soldier into Prev Fire Team and Next Fire Team. The buttons select one living lead per fire team rather than cycling supporting soldiers.
- Clicking a supporting soldier while hybrid command is active selects that soldier's fire-team lead. This prevents accidental independent support routes.
- The selected lead keeps the normal movement preview, reachable-cell range, TU cost, reserved-shot allowance, kneeling, inventory, firing, and targeting controls.
- Normal manual battle control is restored immediately when Hybrid AI is switched off during an idle player phase.

ONE-ROUND AI SUPPORT HANDOFF
----------------------------
- Run Hybrid AI Turn holds every lead at the position chosen by the player and gives supporting soldiers an in-place formation order around that lead.
- The established formation, occupancy, cohesion, escort, rescue, and movement-safety rules remain authoritative; hybrid mode does not create a second movement system.
- AI chooses support routes, remaining movement, kneeling, legal fire mode, and end-of-movement engagement. Its paths, movement, shots, and impacts use the sequential tactical playback introduced in build 1142.
- If a lead fired at an alien during the player phase, that alien becomes the team's preferred handoff target. A dead, hidden, blocked, or out-of-range preferred target falls back to another legal visible alien.
- Only one AI-controlled tactical round is resolved. Leads are marked finished during that handoff so the AI cannot spend their leftover player-phase TU a second time. When playback finishes, temporary in-place orders clear, the tactical round advances, every surviving soldier receives the normal fresh-turn TU allocation, and control returns to the first living fire-team lead.
- Existing command-map orders, rescue responsibilities, and campaign save format remain compatible.

COLLAPSIBLE ACTIVE UFO LIST
---------------------------
- The Geoscape interface places Active UFOs (count) directly beside Open Incident List.
- Active UFO cards and the no-contacts message are hidden by default, preventing the tracking panel from growing into a long always-visible list.
- Opening the button reveals the same authoritative UFO cards and controls. Hide Active UFOs collapses them again without changing tracking, interception, radar detection, travel, or time progression.

BUILD HEALTH
------------
- A new regression fixture verifies leader-only cycling, shared in-place formation orders, preferred-target propagation, order cleanup, the one-round AI handoff markers, and both battle-toolbar labels.
- Static release checks require the two patch flags, hybrid helpers, main battle-screen toggle, fire-team navigation labels, one-round handoff control, and Geoscape UFO-list toggle.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1142
=====================

Build: v0.26.08.14.1142_HYBRID_FIRETEAM_PLAYBACK_HELMETS_AND_TRANSFER_CONFIRMATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
AI tactical playback now isolates movement to the unit whose action and route are being shown, removing out-of-order walks and position snap-backs. The Tactical Command Map is now a hybrid fire-team control layer: players command each leader's waypoint and may choose a preferred alien, while the AI retains TU-reserve, movement-execution, shot-mode, kneeling, and fallback-target decisions. Supporting soldiers continue using the established formation system. Three.js soldiers now wear small armor-matched tactical helmets. Barracks soldier cards hide destinations behind a Transfer button and require a detailed confirmation screen before a troop transfer begins.

ORDERED AI MOVEMENT PRESENTATION
--------------------------------
- Sequential playback frames now record the exact IDs allowed to move during each action.
- Combat damage may update a target's HP and state without borrowing that target's later position from the end-of-phase snapshot.
- Only the acting soldier and any civilian actually following that soldier animate during the route display. Other soldiers wait for their own action frame.
- Impact and phase-completion frames cannot replay leftover movement, eliminating the unmarked walk-and-snap-back sequence.
- Timing estimates use the same per-frame movement set as the renderer, so audio, paths, movement, shots, and impacts stay ordered.

HYBRID FIRE-TEAM COMMAND
------------------------
- The Tactical Command Map is now labeled Hybrid Fire-Team Command.
- The player chooses a fire team, an optional preferred visible alien, and a waypoint for that team's leader.
- The AI still determines its TU reserve, snap/aimed/burst behavior, kneeling, route execution, post-move reassessment, and whether it has a valid shot.
- Supporting soldiers do not receive independent player routes. They continue deriving their positions from the existing leader-relative formation, pace, occupancy, and cohesion rules.
- After movement, every team member prefers the designated alien when it is alive, visible, in range, and in line of sight. If it dies or cannot be seen, the soldier may engage another visible alien.
- Arriving at the waypoint changes the order into a formation hold instead of silently discarding it. The player may clear or replace the order from the map.
- Rescue/escort responsibilities and hard tactical safety rules remain authoritative; a blocked command still clears after bounded failed progress rather than deadlocking the battle.

THREE.JS TACTICAL HELMETS
-------------------------
- Every living or fallen Three.js AEGIS soldier model receives a small tactical helmet shell and brim.
- Helmet material comes from the same armor-color value used by that soldier's equipped armor, so Field Suits, Ceramic Armor, Psi Weave, and future palette variants remain visually consistent.
- Helmets are presentation-only and do not alter armor protection, visibility, hit chance, movement, TU, or save data.

BARRACKS TRANSFER CONFIRMATION
------------------------------
- Destination buttons are no longer permanently expanded on every soldier card.
- A Transfer button reveals the valid destination-base list for only that card.
- Choosing a destination opens a confirmation screen showing soldier name, origin, destination, travel time, logistics fee, squad-duty removal, availability during transit, and the no-refund cancellation rule.
- Confirm Transfer is disabled when campaign funds cannot cover the fee. Back closes the confirmation without moving the soldier or charging funds.
- The existing authoritative transfer function still performs the final fund deduction, squad removal, transit record, ETA, and arrival behavior only after confirmation.

BUILD HEALTH
------------
- Sequential playback regression covers a second soldier who moves later but is also updated by an earlier combat action; that soldier must retain the old position until their own frame.
- Hybrid-command regression covers preferred-target selection, nearest-visible fallback, clearing preferred-target state, formation-source preservation, and the new Command Map language.
- Static release checks require explicit action movement IDs, hybrid command fields and fallback targeting, armor-matched Three.js helmet construction, and both transfer-option and transfer-confirmation UI markers.
- Save format remains 4. Existing campaigns and in-progress tactical states require no migration.

PREVIOUS BUILD - 0949
=====================

Build: v0.26.08.14.0949_VIP_RESCUE_INGRESS_PATCH_HISTORY_SHOT_STACK_AND_SFX_MULTIPLIERS_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue missions use the rescue quota as an authoritative victory condition, with partial credit preserved when a quota is missed. Fire-team leaders route into VIP buildings more reliably when their own supports occupy narrow approaches. Testers can open patch notes and version history directly from Save / Load. Tactical shot results stack at the top of a battle for ten seconds, fade independently, and can be hidden from a battle-screen button. Enhanced SFX entries support persistent 1x, 2x, 3x, and 4x multipliers.

VIP BUILDING INGRESS
--------------------
- Rescue route planning now treats the leader's own fire-team members as mobile formation traffic instead of permanent path blockers. The formation mover remains responsible for shifting those supports safely as the leader advances.
- When a VIP is inside a building, the contact destination must also be inside that building. Soldiers no longer satisfy the approach by merely standing against the exterior side of a solid wall.
- Full routes compare valid adjacent contact cells inside the target building and naturally cross a door or an already-open breach.
- If a complete route is temporarily blocked by unrelated occupants, bounded fallback movement prioritizes the target building's valid door and breach cells instead of repeatedly pressing toward the nearest exterior wall.
- Extraction no-reentry behavior is unchanged. This traffic exception applies while approaching a VIP; escorted columns that have cleared a building still remain committed to outdoor routes toward the Skyranger.
- Fire-team movement authority is unchanged: the leader owns the move, supports preserve formation, and this fix does not create additional movement phases.

MISSION RESOLUTION CONSISTENCY
------------------------------
- Meeting the mandatory rescue quota and resolving every remaining VIP permits victory once the alien force and any required confirmed beacon objective are neutralized.
- Resolving every VIP below quota creates a terminal objective failure after the alien force is defeated. Manual and AI-controlled battles now consume the same terminal-state result.
- A mathematically impossible quota does not immediately discard surviving VIPs. The rescue phase remains open while any VIP is still active so the squad can extract them for partial credit.
- Terminal quota failure ends cleanly rather than consuming extra reinforcement waits, beacon-search turns, or the AI safety interval in pursuit of an impossible victory.

PARTIAL CREDIT AND CAMPAIGN RESULTS
-----------------------------------
- A missed mandatory quota records a mission failure and applies the mission's normal failure panic penalty and 20% base-reward fallback.
- Each extracted VIP still awards the profile's per-rescue payment. The quota-completion bonus is withheld on failure.
- Surviving soldiers retain their ordinary mission experience and medical outcomes; extracted and lost VIP totals remain explicit in the action log and report.

PATCH NOTES AND VERSION HISTORY
-------------------------------
- Save / Load now includes a Patch Notes / Version History button beside Build Health and the Enhanced SFX Library.
- The latest build opens by default with a readable summary and detailed highlights for testing.
- A desktop build list and mobile version selector expose the recent browser-build history without leaving the game or requiring network access.
- Each entry shows its human-readable version, date, title, summary, full build identifier, save-format compatibility, and the most important testing points.
- The viewer is embedded in index.html for direct-file play. README_PATCH_NOTES.txt remains the authoritative detailed archive.

TACTICAL SHOT RESULT STACK
--------------------------
- Shot results remain fully visible for 10 seconds, then fade over 700 milliseconds before removal.
- New results enter at the top and push older results downward. Up to six recent shots can remain visible at once and each keeps its own display/fade timer.
- The battle header includes a Shot Results: On / Off button. Turning the display off immediately clears its notices and timers but does not alter ballistics, damage, sound, dialogue, or the Mission Timeline.
- The display preference is retained in the live state for the current battle when moving between command sections.

ENHANCED SFX BOOST MULTIPLIERS
------------------------------
- Every sound now exposes 1x, 2x, 3x, and 4x choices instead of a single 2x toggle.
- The selected multiplier applies after the sound's individual level and before the master SFX volume.
- Existing locally saved boolean boost settings migrate automatically: Boost On becomes 2x and Boost Off becomes 1x.
- Reset Mix restores every individual level to 100% and every multiplier to 1x.

BUILD HEALTH
------------
- The rescue-phase regression now distinguishes `canResolveVictory` from `canResolveFailure` and covers both below-quota failure and quota-met victory terminal states.
- The door-ingress regression now places a support soldier directly in the only immediate entrance route and verifies that the leader still enters through the opening, finishes inside the VIP's building, contacts the VIP, and keeps the support on fire-team duty.
- The tactical feedback regression covers newest-first stacking, independent fade/removal transforms, the exact 10-second visibility contract, and a stack capacity greater than one.
- Enhanced SFX regression now covers boolean-setting migration plus bounded 1x, 2x, 3x, and 4x gain calculations.
- Static checks require the Save / Load viewer, version selection, battle-screen shot toggle, ten-second stack timing, fade timing, and all four SFX multiplier controls.
- Static checks require the shared terminal failure branch in AI simulation and manual End Turn handling, plus the partial-credit contract and browser/native parity record.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 0903
=====================

Build: v0.26.08.14.0903_VIP_RESCUE_QUOTA_AND_BUILDING_INGRESS_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue quotas became authoritative across manual and AI mission resolution. Resolving all VIPs below quota became a clean failure with normal per-VIP partial credit, while fire-team rescue routes began treating their own formation supports as mobile traffic and required a valid interior approach to a VIP inside a building.

CORE CHANGES
------------
- Split terminal rescue permission into canResolveVictory and canResolveFailure.
- Prevented impossible-but-still-active rescue objectives from ending before surviving VIPs could be extracted for partial credit.
- Routed leaders through valid building doors or breaches and prevented exterior adjacency through a solid wall from counting as contact.
- Preserved leader-owned formation movement and the outdoor extraction no-reentry rule.

PREVIOUS BUILD - 2320
=====================

Build: v0.26.08.13.2320_SEVEN_HEX_BEACON_SHIELD_AND_MISSION_EXIT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Alien Field Beacon shields now occupy the beacon hex and its six adjacent hexes. Compatible incoming fire is intercepted when fired from outside the field, protecting reinforcements that have just beamed into those cells, while soldiers can still walk through the field and attack the beacon from inside. This build also fixes the undefined beacon-objective reference that could crash the tactical victory exit handoff.

SEVEN-HEX SHIELD AND CLOSE ASSAULT
----------------------------------
- The shield footprint is exactly seven passable hexes: the beacon center and all six immediate neighbors. Only the beacon itself remains a physical obstacle.
- Kinetic shields stop outside ballistic fire entering any protected hex. Combined shields stop outside ballistic, laser, plasma, and alien-energy fire. Explosive attacks retain their established penetration behavior.
- Reinforcements materialize in the six surrounding cells and are protected while they remain inside the field; the protection is positional and does not follow them after they leave.
- A soldier standing in any shield hex is already inside the boundary, so compatible direct fire can damage the beacon without being intercepted. This gives every armed fire team a close-assault solution even when it lacks the shield's preferred ranged counter or a Frag Grenade.
- Fire-team formation movement is preserved. The assigned leader remains movement authority, supports use their established leader-relative positions, and the shield footprint adds no pathing obstruction.

PRESENTATION AND MISSION EXIT FIX
---------------------------------
- Revealed shield footprints are outlined across all seven cells in 2D: cyan for kinetic and magenta for combined fields.
- The Three.js shell is enlarged and flattened around the complete seven-hex footprint rather than hugging only the beacon model.
- Shield impacts against protected units use the same visible beacon-field feedback as blocked direct beacon shots.
- Tactical victory exit now stores `tacticalBeaconObjective`, the objective value actually in scope, instead of referencing the undefined `tacticalAlienBeaconObjective` name.

BUILD HEALTH
------------
- Added a seven-hex contract covering exact footprint, passable adjacent cells, outside interception, explosive passage, inside-field bypass, protected reinforcement arrival, 2D/Three.js presentation, and preserved leader-only formation movement.
- The mission-completion regression now explicitly requires the correct result-handoff variable and rejects the undefined name that caused the reported runtime error.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 1956
=====================

Build: v0.26.08.13.1956_CONFIRMED_BEACON_MISSION_COMPLETION_GATE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Eliminate-force missions now treat a confirmed active Alien Field Beacon as part of the hostile operation. Defeating the last alien begins a visible Locate or Secure the Beacon phase instead of ending the mission early. AI-controlled squads search without artificial battlefield knowledge, preserve fire-team formation during the strike, and stop cleanly with a withdrawal option if the deployed shield cannot be breached.

MISSION COMPLETION GATE
-----------------------
- A non-crash mission that requires alien-force defeat cannot report victory while a campaign-confirmed field beacon remains active.
- Mandatory VIP/civilian rescue remains an independent requirement; beacon completion does not bypass the existing rescue terminal state.
- Missions with unknown beacon doctrine, UFO crash sites, and objectives that do not require alien-force defeat retain their established completion rules.
- The same beacon-aware terminal helper now governs direct control, Watch AI Team Leader, streamed Simulation AI, and Classic Lineup outcomes.

SEARCH, STRIKE, AND FIRE-TEAM COHESION
--------------------------------------
- A confirmed but unseen beacon stays hidden. After the last alien falls, AI units conduct coordinated grid/fog exploration until normal range and line of sight reveal it.
- Once discovered, one free shield-capable fire team receives the strike assignment. The leader remains movement authority and supporting soldiers keep their existing formation behavior.
- Tactical controls, logs, and playback explicitly distinguish Locate, Neutralize, No Breach, and Complete phases.
- Direct control remains available throughout the objective so the player can adjust equipment use or choose Dust Off.

REINFORCEMENTS AND DEADLOCK SAFETY
----------------------------------
- Destroying the beacon cancels a reinforcement wave that is still in transit. Reinforcements that already arrived remain on the battlefield and must still be defeated.
- Manual Frag Grenade destruction now follows the same pending-transit cancellation rule as direct weapon fire and AI attacks.
- If no living soldier can breach the deployed shield, automated resolution returns an incomplete operation instead of looping or inventing a victory, with a clear withdrawal explanation.

BUILD HEALTH
------------
- Added a regression contract covering unknown and confirmed doctrine, locate/neutralize/complete phases, already-arrived reinforcements, transit cancellation, mandatory rescue coexistence, impossible combined-shield breach, non-elimination and crash-site exclusions, AI search continuation, shared-mode wiring, and tactical objective presentation.
- Save format remains 4; no migration is required.
- Native Godot parity remains queued.

PREVIOUS BUILD - 1204
=====================

Build: v0.26.08.13.1204_ADAPTIVE_ALIEN_BEACON_COMBINED_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Phase 3 of Alien Field Beacon adaptation is active. After six beacon destructions are recorded in campaign mission reports, newly generated non-crash incidents upgrade from the ballistic-only kinetic field to a combined shield that also intercepts laser and plasma fire. Grenades and personnel still pass through, existing battlefields retain their deployed shield state, and reinforcement arrivals still preserve original beacons and crashed-UFO landmarks.

COMBINED KINETIC-ENERGY SHIELD
------------------------------
- Destruction history remains report-based and save-format-4 compatible: 0-2 destroyed beacons deploy unshielded, 3-5 deploy the Phase 2 kinetic shield, and 6 or more deploy the combined field.
- Combined shields block ballistic, laser, plasma, and alien energy weapon damage without reducing beacon HP. TU/ammunition are still spent and the tactical log identifies the intercepted damage class.
- Frag Grenades remain the intentional Phase 3 breach path and use the existing prime/throw costs, range, seven-cell blast, and friendly-risk rejection.
- The field remains non-solid around the beacon. Soldiers, aliens, civilians, and VIPs can move through the shield volume; only the beacon's physical hex remains occupied.
- UFO crash-site deployments remain excluded and continue replacing the beacon with the angled smoking wreck and impact trail.

AI, FORMATION, AND PRESENTATION
-------------------------------
- Simulation AI assigns a combined-shield beacon only to a free fire team that still has a living soldier with a Frag Grenade. Ballistic- or energy-only teams do not waste turns firing into the field.
- The fire-team leader remains the sole movement authority. A grenade-capable support follows normal formation and attacks only when the formation places that soldier safely in range.
- Laser/plasma users carrying grenades reserve their direct weapon fire against the combined shield and use the existing safe grenade decision instead.
- 2D displays a magenta `K+E SHIELD` badge and descriptive tooltip. Three.js uses a magenta combined-field shell distinct from the cyan Phase 2 kinetic field.

PRESERVED REINFORCEMENT LANDMARKS
---------------------------------
- Beacon reinforcement waves retain the original beacon record, including its shield, HP, damage, and revealed state.
- Reinforcement dropships in crash missions retain the original crashed-UFO craft, wreckage, trail, broken trees/buildings, and smoke.

BUILD HEALTH
------------
- Added a Phase 3 regression contract covering the six-destruction threshold, ballistic/laser/plasma interception, grenade passage, AI team eligibility, formation movement ownership, and 2D/Three.js presentation.
- Existing Phase 2 kinetic-shield and reinforcement-landmark regression contracts remain active.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1552
=====================

Build: v0.26.08.12.1552_ADAPTIVE_ALIEN_BEACON_KINETIC_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
After three Alien Field Beacon destructions recorded in campaign mission reports, later non-crash incidents deploy the beacon with an adaptive kinetic shield. The field stops ballistic rounds, while laser/plasma fire, Frag Grenades, and personnel continue to pass through. Existing tactical battles retain their deployed beacon state, UFO crash sites still replace the beacon with the crashed craft and impact trail, and reinforcement arrivals no longer remove either mission landmark.

ADAPTIVE KINETIC SHIELD
-----------------------
- The campaign derives the alien adaptation threshold from saved mission reports, so existing format-4 campaigns need no migration or new campaign field.
- The first three destroyed-beacon encounters retain the original unshielded device. Once the third destruction is in the report archive, newly generated beacon missions receive the kinetic field.
- Ballistic fire still spends the chosen shot's TU and ammunition, but causes no beacon HP damage and produces a shield-interception combat log message.
- Laser and plasma weapons pass through the field and damage the beacon normally.
- Frag Grenade blast damage passes through the field and can destroy the beacon under the existing prime, throw, blast-radius, and friendly-risk rules.
- The field does not occupy surrounding cells, so soldiers, aliens, civilians, and VIPs retain normal movement around it.
- A mission's shield state is fixed when its battlefield is created and is preserved by the existing tactical snapshot system.

AI AND FIRE-TEAM SAFETY
-----------------------
- Confirmed-beacon doctrine assigns only one free fire team, preserving player orders, combat priorities, rescue work, escorts, and existing formation movement.
- A shielded-beacon assignment is accepted only if the chosen team has an energy weapon or a Frag Grenade that can breach the field.
- The fire-team leader remains the movement authority and advances the whole team under the existing leader/support formation and pacing rules; any shield-capable member may attack once the formation puts that soldier in range. Other teams do not clump on the beacon.
- The established safe-grenade logic still rejects any throw whose blast includes an AEGIS soldier, civilian, or VIP.

REINFORCEMENT LANDMARK PERSISTENCE
----------------------------------
- Beacon reinforcement materialization preserves the exact original beacon cover record, including HP, shield state, damage state, and visibility.
- Crash-site reinforcement arrivals preserve every crashed-UFO hull, wing, core, impact-trail, scar, broken-tree, debris, and smoke source cover.
- Registering a live reinforcement dropship no longer removes the crashed-UFO craft model from the battlefield; both can coexist for the duration of the arrival.
- The preservation merge is identity-based, so an already retained landmark is not duplicated.

PRESENTATION AND BUILD HEALTH
-----------------------------
- The 2D beacon marker carries a K-SHIELD badge and its hover description identifies the ballistic block.
- The 3D Iso beacon receives a translucent cyan shield shell that brightens on a ballistic impact.
- Cover details and tactical logs distinguish shield interception from ordinary damage and destruction.
- Regression coverage verifies the three-destruction threshold, ballistic interception, energy/grenade passage, unshielded legacy damage, mission deployment, report-history counting, capable AI team selection, 2D/3D presentation seams, and beacon/crashed-UFO persistence through reinforcement arrival.

PREVIOUS BUILD - 1305
=====================
Build: v0.26.08.12.1305_ESCORT_CONTACT_AND_EXTRACTION_TRAFFIC_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
VIPs and civilians who remain both separated from and unable to see their escort for one complete round now return to an unescorted, reassignable state. The original fire team is recalled when possible. At Skyranger extraction, supporting soldiers form defensive positions outside the ramp cells, and the escort leader clears the corridor after the final assigned civilian extracts.

ESCORT CONTACT AND REASSIGNMENT
--------------------------------
- Normal four-person escort-column spacing remains valid and does not start the lost-contact timer.
- Separation alone does not release a follower if the VIP and escort retain an unobstructed line of sight.
- Blocked sight alone does not release a follower while the escort remains within normal contact distance.
- The first completed round of both separation and lost sight starts a regroup warning; a second completed round in that same condition releases the follower, ensuring a full round elapsed.
- Regaining distance or sight during the grace round clears the warning without changing the escort assignment.
- A released civilian is revealed, calm, and free of exclusive escort claims so another fire-team leader can immediately make contact.
- The original living fire team is switched back to stay-together escort support, and its leader receives a return target. If another team reaches the civilian first, the stale recall clears.
- The rule runs at round boundaries in direct-control, reinforcement-wait, post-combat rescue, and simulation-AI battles. Its state is retained across streamed tactical snapshots.

EXTRACTION-ZONE TRAFFIC
-----------------------
- When an escort leader enters the selected Skyranger extraction corridor, living fire-team supports receive defensive guard cells outside every ramp and hull footprint.
- Guard positions prefer nearby cover and remain subject to TU, occupancy, formation-order, and passability checks.
- Supporting soldiers are explicitly prevented from choosing extraction cells while the guard assignment is active, leaving ramp capacity for VIPs and civilians.
- The leader holds the corridor while the assigned civilian column advances, preserving the existing single-file escort behavior.
- When the last assigned follower reaches an extraction cell and leaves the map, the leader immediately moves to a clear cell outside the extraction footprint and releases the temporary guard assignment.
- These overrides apply only to active escorted extraction; normal patrol, combat, building entry, manual movement, and fire-team formation behavior are unchanged.

BUILD HEALTH
------------
- Added a deterministic two-round blocked-sight scenario that verifies the grace round, release, original-team recall, support return, another-team reassignment, and contact recovery reset.
- Added a Skyranger traffic scenario that verifies supports remain outside extraction cells, the VIP extracts, and the leader clears the ramp afterward.

PREVIOUS BUILD - 0915
=====================
Build: v0.26.08.12.0915_VIP_EXTRACTION_NO_BUILDING_REENTRY_INDEX_ONLY_PATCH

AI-controlled VIP rescue teams now commit to outdoor extraction routes after leaving a building. Escorts route around cleared structures instead of treating their interiors as shortcuts, and each VIP or supporting fire-team soldier that reaches outdoor ground is prevented from stepping back inside while following formation.

VIP EXTRACTION - NO BUILDING RE-ENTRY
-------------------------------------
- Added an extraction-specific route search that treats every building as closed terrain once an escort is outdoors.
- Escorts already inside still use the established door-or-breach egress route, then switch to the outdoor-only route for the remaining journey to the Skyranger.
- Outdoor routing plans all the way to the selected ramp corridor before committing the current TU-bounded movement segment, avoiding local distance choices that can produce doorway loops.
- If a temporary obstacle blocks the complete route, the escort can still make bounded outdoor progress toward extraction and retry from its new position next round.
- Escorted VIPs independently inherit the same rule: once an individual VIP reaches outdoor ground during extraction, its formation choices exclude building cells.
- Fire-team supports retain normal formation targets, pace limits, TU costs, occupancy rules, and break-off behavior; only indoor candidate cells are removed after that support has exited.
- Units that have not yet cleared the structure can continue moving inside and through a valid door or breach, preventing the new rule from trapping the rear of a civilian column.
- When the leader reaches the far end of the ramp first, it now holds the extraction corridor and spends its remaining bounded movement allowance advancing trailing VIPs instead of leaving the rear of the column stranded.

BUILD HEALTH
------------
- Added a cross-building regression scenario with extraction on the far side of a structure. The contract requires a complete route whose committed segment contains no building cells.
- Extended the contract to verify the extraction-only follower guard is active while the normal formation system remains the movement authority.

PREVIOUS BUILD - 0858
=====================
Build: v0.26.08.12.0858_ENHANCED_SFX_PER_SOUND_DOUBLE_BOOST_INDEX_ONLY_PATCH

SUMMARY
-------
Every sound in the Save / Load Enhanced SFX Library now has its own persistent Boost ×2 button. Boost doubles only the selected effect after its individual slider and before the master SFX volume, so quiet sounds can be raised without changing the rest of the mix.

PER-SOUND DOUBLE BOOST
----------------------
- Added a Boost ×2 toggle beside Play on all 17 Enhanced SFX Library rows.
- An active boost is clearly highlighted and reads Boost ×2 On; the row readout also shows its slider percentage followed by ×2.
- Boost multiplies the sound's individual slider by two before the master SFX bus. For example, 60% with Boost ×2 produces a 120% per-sound gain that still follows the master SFX volume.
- Boost state persists locally for each sound under a separate versioned preference key. Existing saved slider levels migrate without changes and every boost defaults off.
- Reset Mix returns all sliders to 100% and switches every boost off.
- Original SFX bypasses both enhanced levels and enhanced boosts. Switching back to Enhanced Tactical SFX restores the player's saved mix.
- Boost is audio presentation only and cannot affect combat, TU, AI decisions, escort routing, or fire-team formation movement.

BUILD HEALTH
------------
- Extended the 17-entry audio-library contract to verify boost normalization, default-off behavior, the exact ×2 gain calculation, unique per-row boost controls, local persistence, and reset behavior.

PREVIOUS BUILD - 0825
=====================
Build: v0.26.08.12.0825_ENHANCED_SFX_LIBRARY_AND_PER_SOUND_MIX_INDEX_ONLY_PATCH

Save / Load Game now has a dedicated Enhanced SFX Library. Players can audition all 17 enhanced effects, tune each one independently, adjust the existing master SFX volume from the same screen, and keep the mix as a local audio preference without changing campaign saves.

ENHANCED SFX LIBRARY
--------------------
- Added an Enhanced SFX Library button to the Save / Load Game header and a full library screen with a clear return control.
- The library exposes every enhanced sound currently routed in the browser build: four role-specific footsteps; ballistic, laser, AEGIS plasma, and alien weapon reports; miss/flyby, hit/injury, armor, glass, death, and fall feedback; plus Skyranger flyby, takeoff, and landing.
- Every sound has its own Play button and 0-100 percent level control. Library previews always use the enhanced version so it can be compared even when Original SFX is currently selected.
- Individual levels multiply the existing master SFX volume. The library also exposes that master control and provides Reset All to 100%.
- Per-sound levels persist in local audio preferences under their own versioned setting and do not enter campaign save data.
- Original SFX bypasses the enhanced per-sound mix. A one-click Use Enhanced SFX control is shown when the original profile is active.
- Added an audible glass-shatter route to window-crossing shots in manual and simulated tactical playback, using the same presentation-only callback layer as existing weapon and impact sounds.

GAMEPLAY SAFETY
---------------
- The mixer only scales audio destinations. It does not write movement, combat, TU, AI, escort, or formation state.
- Fire-team formation movement and the coherent single-turn AI rules remain unchanged.

BUILD HEALTH
------------
- Added a 17-entry catalog contract covering unique routing keys, bounded level normalization, persistent local storage, the Save / Load entry button, screen controls, preview routing, master-volume multiplication, and glass feedback.

PREVIOUS BUILD - 0024
=====================
Build: v0.26.08.12.0024_TACTICAL_MISSION_VISIBILITY_MUSIC_CROSSFADE_INDEX_ONLY_PATCH

The Dark Horizon alternate mission track is now visibility-reactive. Contact in the Dark loops its 0:00-0:36 search section while no living alien is in current soldier line of sight, loops its 0:37-1:00 combat section while any alien is visible, and crossfades between those two sections as contact changes.

MISSION MUSIC VISIBILITY CROSSFADES
-----------------------------------
- Current line of sight, rather than permanent revealed/last-known-contact memory, drives the music state. Losing sight behind a wall or other cover returns the score to search even though soldiers remember the contact.
- Search uses 0:00 up to the 0:36 boundary. Visible engagement uses 0:37 up to the 1:00 boundary. Each segment seeks back to its own start before playback can drift into the other section.
- Visibility changes start a 1.4-second two-player crossfade: the old segment fades down while a second synchronized media player starts and fades up at the new segment boundary.
- A rapid second visibility change cancels and cleans up the stale outgoing player before starting the newest transition, preventing stacked playback.
- The behavior applies specifically to Dark Horizon Alternate's Contact in the Dark mission cue. Original Soundtrack mission playback and all non-mission tracks retain their established looping and fallback behavior.
- This is presentation-only: visibility rules are read without changing unit reveal memory, AI decisions, fire-team formation movement, TU, combat, or save format.

BUILD HEALTH
------------
- Added required seams for the 0:00/0:36 and 0:37/1:00 segment contract, live LOS visibility signal, crossfade duration, outgoing-player cleanup, and alternate-mission routing.

PREVIOUS BUILD - 2200
=====================
Build: v0.26.08.11.2200_ALTERNATE_SOUNDTRACK_AND_TACTICAL_AUDIO_DIRECTION_INDEX_ONLY_PATCH

The browser build added a selectable Dark Horizon alternate soundtrack, a selectable enhanced tactical-SFX profile, role-specific movement footfalls, and event-driven tactical radio direction. Routine movement acknowledgements are rare; soldiers announce meaningful transitions such as engaging alien contact, resuming a VIP/contact search, and securing the area. Fire-team formation movement is unchanged.

ALTERNATE SOUNDTRACK
--------------------
- Added 15 original ElevenLabs-generated score cues alongside the existing score, giving every existing music context its own one-to-one alternate.
- Audio Settings now lets players switch between Original Soundtrack and Dark Horizon Alternate without changing their campaign save.
- The alternate bank independently scores Start, Command Menu, Geoscape, Base, Inventory, Database, Soldiers, Research, Workshop, Squads, Sickbay, Missions, Reports, Memorial, and Pause.
- If an alternate file cannot load, playback safely falls back through the original file bank and existing synthesized theme.

TACTICAL AUDIO DIRECTION
------------------------
- Human, alien, civilian, and tracked-VIP movement now produces distinct footfall textures on the same animation steps that already drive movement.
- Simulation AI radio dialogue prioritizes tactical state changes: alien engagement begins, contact ends and VIP search resumes, contact search resumes, or the area becomes secure.
- The VIP transition is authored as “Resuming search for the VIP” and uses the recorded Keep Moving performance until a dedicated recording is added.
- Generic Moving/Advancing acknowledgements remain as an occasional manual-order response and a deterministic one-in-seven AI-movement accent, with longer cooldowns.
- Existing hit, kill, last-contact, weapon, armor-impact, pain, death, glass, and environmental sounds remain active.
- Audio Settings includes Enhanced Tactical SFX and Original SFX choices; the preference persists locally and does not alter save format 4.

ELEVENLABS SOURCE LIBRARY
-------------------------
- Generated a 16-category sound-effects library in the project's signed-in ElevenLabs account: role-specific footsteps; ballistic, laser, and alien plasma weapons; soldier, alien, and civilian injury/death reactions; glass; dirt/concrete impacts; and armor impacts.
- The integrated enhanced profile establishes the routing and event timing for those categories while generated takes can be auditioned and substituted without changing combat or formation logic.

BUILD HEALTH
------------
- Added checks for alternate-track routing, persisted soundtrack/SFX selection, state-change radio callouts, bounded generic movement acknowledgements, and footfalls on movement animation steps.
- Fire-team paths, TU use, escort following, cohesion limits, and formation pacing are untouched by the audio hooks.

PREVIOUS BUILD - 1652
=====================
Build: v0.26.08.11.1652_ADAPTIVE_COHERENT_AI_TURNS_AND_WINDOW_BALLISTICS_INDEX_ONLY_PATCH

Simulation AI now gives each soldier an individual TU reserve and presents that soldier's movement as one coherent turn: move, reassess once from the new position, optionally continue within the same path, then fire or kneel. Fire-team formation pacing remains authoritative. Building windows now transmit sight and can be shot through; the first passing projectile shatters intact glass and takes an accuracy penalty, while solid wall sections remain opaque.

SIMULATION AI - ADAPTIVE COHERENT TURNS
---------------------------------------
- Each AI-controlled soldier independently selects Snap Shot, Aimed Shot, Burst, Full Auto, or Kneel + Snap according to range, target cover, visible contact count, role, ammunition, and available TU.
- AI movement may use the soldier's full post-reserve TU allowance instead of inheriting the old eight-step planning ceiling.
- Movement is recorded as one continuous playback trail with one internal observation checkpoint and at most one continuation.
- After reaching the checkpoint, the soldier reassesses personal line of sight and can continue toward a newly observed or existing objective before choosing the final action.
- If an alien is visible after movement, the soldier may shoot with the selected reserve. A suitable rear/base-fire soldier with no target may end by kneeling while preserving a snap reserve.
- The continuation is rechecked by fire-team formation pacing. Leaders still wait for supports, supporting soldiers stay within leader cohesion bounds, contact-rush rules remain intact, and movement cannot exceed remaining TU.

TACTICAL BUILDINGS - WINDOWS AND SOLID WALLS
--------------------------------------------
- Procedural buildings retain alternating window sections and solid wall sections.
- Intact and shattered windows transmit line of sight for soldiers, aliens, civilians, visibility maps, and AI targeting.
- Solid wall and partition sections continue to block line of sight.
- A projectile crossing an intact window shatters it before the normal target hit roll and applies an 18-point accuracy penalty to that first round.
- Later rounds and later attacks pass through the shattered opening without the glass penalty.
- Shattered window cells remain hard wall geometry for movement, so the change does not create unintended walk-through routes; structural breaches remain the way to create passable openings.
- Manual fire, Simulation AI fire, alien fire, and reaction fire share the window-shattering rule.

BUILD HEALTH
------------
- Added adaptive-reserve and coherent-turn regression coverage, including the fire-team formation continuation guard.
- Added window-ballistics regression coverage for sight through windows, blocked sight through solid walls, glass shattering, first-shot penalty, and persistent movement blocking.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm the new adaptive AI-turn and building-window contracts report OK.
2. Watch a Simulation AI round and confirm each soldier shows one continuous movement trail followed by one final action, without separate repeated movement phases.
3. Confirm fire-team leaders still wait for supports and that supports do not abandon formation during the checkpoint continuation.
4. Place a soldier and alien across a window and confirm sight is possible, the first shot shatters the glass, and a later shot crosses the broken pane normally.
5. Repeat across a solid wall section and confirm neither sight nor target fire is available.

PREVIOUS BUILD - 1005
=====================
Build: v0.26.08.10.1005_UFO_CRASH_SITE_WRECK_AND_IMPACT_TRAIL_INDEX_ONLY_PATCH

UFO Crash Site tactical maps now show the downed alien craft itself instead of an intact Alien Field Beacon. Each site builds a deterministic impact scene with a visibly tilted, damaged UFO, a churned-earth trail, context-sensitive broken trees or building debris, and smoke from the wreck.

TACTICAL - UFO CRASH SITE WRECKS
--------------------------------
- Removed the Alien Field Beacon from every mission identified as a UFO Crash Site.
- Added a persistent crashed-UFO footprint as hard cover near the surviving alien deployment area.
- The UFO is rendered at a deterministic off-axis yaw and tilt so it reads as a forced landing rather than a parked reinforcement craft.
- Added torn hull panels, a fractured dome, exposed damaged machinery, dead alien lighting, scorch damage, and a bounded smoke plume in the Three.js view.
- Added dedicated crashed-UFO artwork and smoke cues to the 2D tactical view.
- Added a 10-20-cell impact trail that widens irregularly as it approaches the wreck.
- Existing trees, brush, crops, concrete, and buildings crossed by the trail are replaced with fallen trees, stumps, masonry, beams, or other debris as appropriate; open ground becomes churned earth.
- Alien and civilian deployment is recalculated around the completed crash scene, preventing units from spawning inside the UFO's hard-cover footprint.
- Ordinary Alien Field Beacon and reinforcement-dropship behavior remains unchanged on non-crash missions.

BUILD HEALTH
------------
- Added a regression contract proving that crash sites contain no active beacon, include the angled UFO craft and complete wreck footprint, generate a substantial impact trail, keep units out of hard cover, and retain both 2D and Three.js rendering support.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm "UFO crash sites replace the field beacon with an angled smoking wreck and impact trail" reports OK.
2. Deploy to forest/farmland and urban UFO Crash Sites and confirm the trail selects broken vegetation or building debris appropriately.
3. Inspect the wreck in both 2D Hex and Three.js views and confirm the unusual angle, hull damage, impact scar, and smoke remain visible.
4. Confirm ordinary incident missions can still use Alien Field Beacons and reinforcement dropships.

PREVIOUS BUILD - 2055
=====================
Build: v0.26.08.07.2055_INCIDENT_MAP_LIMIT_SELF_TEST_STARTUP_TDZ_FIX_INDEX_ONLY_PATCH

Startup-crash hotfix for browser build 1850. The Incident Map Limit feature itself was valid, but its new Build Health contract referenced a local React component before that `const` binding had initialized, preventing the start screen from loading.

STARTUP - INCIDENT MAP LIMIT SELF-TEST TDZ FIX
---------------------------------------------
- Fixed: `ReferenceError: IncidentMapLimitPanel is not defined` during `runSelfTests()`.
- Root cause: `String(IncidentMapLimitPanel)` executed while `AlienResponseCommand` was still initializing, before the local `const IncidentMapLimitPanel = ...` declaration had executed.
- Removed the unsafe forward reference.
- The regression still verifies 5-20 clamping and routine incident limiting directly.
- UI coverage now comes from `String(AlienResponseCommand)`, which safely contains the local settings-panel source without evaluating the uninitialized binding.
- All 1850 gameplay features remain active: VIP rescue fire-team distribution, Simulation AI grenade use, staged Alien Field Beacon knowledge and database unlock, confirmed-beacon targeting, row-major Barracks reading order, and the saved 5-20 Incident Map Limit.

POST-REVIEW CODE CLEANUP
------------------------
- Routine-incident cap accounting now excludes critical crash sites and other protected operations, so those missions can push the board above the routine limit without consuming routine slots.
- Candidate routine incidents are de-duplicated against both the active board and the rest of the same generated batch.
- The Incident Map Limit slider now receives a real `aria-label` instead of leaking the invalid React-only `ariaLabel` prop to the DOM.
- VIP rescue coordination now falls back to the established nearest-VIP behavior when a legacy or test tactical state has no assignable fire-team leaders, instead of enabling coordination with an empty assignment board.
- The structural-damage Build Health check now inspects the base cover renderer where the crack, shattered-window, and smoke code lives, while also verifying that the alien-technology wrapper delegates to that renderer. This removes a false failure without weakening coverage.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Zero `String(IncidentMapLimitPanel)` references remain.
- Start-screen version derives as v0.26.08.07.2055 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open `index.html` locally and confirm the start screen appears without a runtime error.
2. Open Command Settings and confirm Incident Map Limit remains selectable from 5 through 20.
3. Open Barracks and confirm soldiers still fill left-to-right, then down.
4. Load an existing save and confirm the Incident Map Limit defaults/persists correctly.
5. Run Build Health and confirm the Barracks/Incident Map Limit contract no longer crashes startup.

PREVIOUS CURRENT FEATURE BUILD - 1850
=====================================
Build: v0.26.08.07.1850_VIP_RESCUE_COORDINATION_GRENADE_AI_BEACON_INTEL_BARRACKS_ROW_ORDER_AND_INCIDENT_LIMIT_INDEX_ONLY_PATCH

1850 introduced coordinated VIP-rescue fire-team assignments, selective Simulation AI Frag Grenades, staged Alien Field Beacon knowledge with a persistent Mainframe database unlock after observed reinforcement materialization, confirmed-beacon tactical targeting, row-major Barracks reading order, and a saved configurable 5-20 routine Incident Map Limit. These features remain active in 2055.

INTERMEDIATE FEATURE BUILD - 1630
=================================
Build: v0.26.08.07.1630_TACTICAL_DAMAGE_STATE_SMOKE_BREACH_FEEDBACK_AND_UNLIMITED_DOWNTIME_CAPACITY_INDEX_ONLY_PATCH

1630 added shared structural-damage presentation for the 2D and Three.js tactical views: cracked damaged walls, stronger critical-state damage, shattered windows, and bounded dust/smoke cues for damaged structures and breaches. It also temporarily removed Training Center, Rec Room, and per-activity attendance caps while preserving the requirement to own the matching facility.

PREVIOUS FEATURE BUILD - 1415
=============================
Build: v0.26.08.07.1415_TACTICAL_ALIEN_BEACON_FANOUT_SEARCH_AND_LONE_SURVIVOR_EXFIL_FIX_INDEX_ONLY_PATCH

1415 stopped groups of original aliens from camping around the Alien Field Beacon. Groups with no contact now fan out through deterministic battlefield search outside the immediate beacon perimeter, while a lone original survivor can still fall back to the beacon or insertion point and attempt the existing emergency reinforcement call.

OLDER PATCH HISTORY
===================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1145_INTERCEPTOR_SWARM_TARGET_SNAPSHOT_NULL_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This is a targeted stability patch for the 1015 All Bases interceptor swarm. It fixes the player-reported `Cannot read properties of null (reading 'id')` crash that could occur while a swarm and Skyranger incident response were progressing at the same time.

STRATEGIC AIR COMBAT - SWARM SHOOTDOWN TARGET SNAPSHOT FIX
-----------------------------------------------------------
- Confirmed stack frame: `index.html:5605:152`, inside `Array.some` during the successful staggered-swarm shootdown path.
- Root cause: the queued `setMissions(...)` functional updater referenced the mutable local variable `target.id`.
- The same swarm effect subsequently assigned `target = null` so later inbound aircraft would abort.
- React executed the queued updater after that mutation, causing the null-ID exception.
- Build 1145 snapshots both the defeated UFO object and `defeatedTargetId` before queuing mission-state work.
- Crash-site de-duplication now runs through `appendCrashMissionOnceForTarget(...)` and never depends on the later mutable target variable.
- The helper tolerates null/legacy mission entries while checking `sourceCraftId`.
- Contact removal and shootdown reporting use the same immutable defeated-target snapshot.

PRESERVED 1015 BEHAVIOR
------------------------
- All Bases still launches every Ready interceptor with a legal direct/ferry-network route from all bases.
- Sorties retain independent staggered attack ETAs and combat passes.
- A confirmed shootdown still aborts every not-yet-engaged inbound interceptor from its current route position.
- Aborted aircraft still route home through normal ferry/refuel logic and retain permanent home-base/home-hangar ownership.
- Simultaneous Skyranger travel remains allowed and is not cancelled by interceptor combat.
- Alien Field Beacon, dynamic friendly re-pathing, strict fire-team cohesion, living-soldier hex separation, and escort-support response from 1015 are unchanged.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct target-snapshot regression: true.
- Static test scan: 351 `*Test` references / 350 declarations; the only unmatched token is the existing Three.js `depthTest` material property.
- The old mutable closure `mission.sourceCraftId===target.id` is absent from the swarm resolution block.
- Build Health includes `Interceptor swarm shootdown snapshots target identity before queued mission state updates`.
- Start-screen version derives as v0.26.08.07.1145 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Launch All Bases against a detected UFO.
2. Launch Skyrangers to an incident before the interceptor swarm finishes.
3. Advance Geoscape time until the swarm scores a confirmed shootdown.
4. Verify one crash site is added and no runtime error appears.
5. Verify remaining inbound interceptors abort and return home normally.
6. Verify the Skyranger mission continues independently through arrival and tactical ownership.
7. Save/reload during overlapping travel and repeat the completion path.


PREVIOUS BUILD NOTES - 1015
===========================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1015_GLOBAL_INTERCEPTOR_SWARM_AND_TACTICAL_COHESION_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update combines the current tactical follow-up fixes with a new global multi-base interceptor swarm response.

TACTICAL - CURRENT INCIDENTS USE THE ALIEN FIELD BEACON
--------------------------------------------------------
- Fixed the effective multi-Skyranger deployment override, which could bypass the newer Alien Field Beacon deployment code and make fresh incidents use the legacy purple saucer reinforcement path.
- Current-build one- and two-Skyranger tactical deployments now create exactly one Alien Field Beacon.
- The six immediately adjacent hexes around the beacon are reserved clear of procedural cover so the beacon always has its intended materialization ring.
- Starting aliens preferentially use that ring; beacon reinforcements continue to materialize in those six adjacent cells.
- Purple saucers remain supported only as a compatibility path for genuine legacy tactical snapshots with no beacon state.

TACTICAL - DYNAMIC FRIENDLY RE-PATHING
--------------------------------------
- AI movement remains deterministic simulation-side; gameplay pathfinding was not moved into the visual animation layer.
- When a soldier's direct route is blocked mainly by a friendly soldier who has not acted yet, the mover can defer and re-path after friendly traffic changes.
- Even a one-step avoidable detour can now trigger the defer/re-path rule.
- Static terrain, cover, enemies, map edges, TU costs, reaction fire, and visibility remain authoritative.
- The movement-trail playback system continues to animate the route the AI actually used.

TACTICAL - STRICT FIRE-TEAM ASSEMBLY PACING
-------------------------------------------
- Fire-team leaders remain at half movement until supporting soldiers actually occupy their formation positions.
- This is enforced at mission deployment and when a team reforms after combat.
- Once formed, leaders pace to the slowest active team member.
- Only a genuine rush toward a currently visible living alien overrides AI formation pacing.
- Player-controlled soldiers remain exempt from AI formation speed rules.

TACTICAL - NO TWO LIVING SOLDIERS END ON THE SAME HEX
------------------------------------------------------
- Living soldier destinations are treated as occupied during completed movement/action states.
- Deferred re-pathing rechecks the current occupancy map before movement resolves.
- Tactical-state repair deterministically separates any legacy/edge-case overlap to a nearest valid cell.

TACTICAL - ESCORT SUPPORT RESPONSE
----------------------------------
When an alien is spotted while one or more fire-team leaders are escorting civilians/VIPs, the player receives an escort-support decision:

1. Stay With Escort
   - supports remain with their leader and protect the rescue column.

2. Break Off To Support
   - supports temporarily leave the escort formation and use normal combat AI to reinforce the visible alien contact.
   - the escort leader keeps moving the civilians/VIPs toward extraction.
   - after the active visible/engaged alien contact is gone, detached supports automatically return to their original fire-team leader and resume formation.

STRATEGIC AIR COMBAT - ALL BASES INTERCEPTOR SWARM
---------------------------------------------------
- Detected flying UFOs now have an `All Bases (N)` launch option.
- It selects every Ready interceptor with a legal direct or ferry-network route, across every base.
- Staging hangars are reserved independently so multiple aircraft cannot claim the same transient hangar slot.
- Every aircraft gets its own route phases, impact ETA, return path, and home-base/home-hangar identity.
- Attack passes occur as each interceptor reaches the UFO; they are intentionally staggered when travel times differ.
- Earlier passes can damage the UFO before later passes arrive.
- If one aircraft destroys the UFO, every interceptor still inbound aborts pursuit from its current route position and begins a clock-driven return.
- Aborted aircraft use the normal ferry/refuel network to get back to their permanent home bases rather than teleporting or remaining at a staging base.
- Aircraft that already fought retain normal damage/repair outcomes; aircraft that aborted before combat do not receive fictitious combat damage.
- All swarm aircraft eventually recover at their permanent home bases/hangars.
- The strategic aircraft route display shows each swarm member and its current phase/remaining ETA.

The All Bases command does not launch an aircraft that is Repairing, otherwise unavailable, or has no legal route under normal range/fuel/ferry/hangar rules. If every stationed interceptor is Ready and routable, all of them launch.

PRESERVED FIXES
---------------
- Observed reinforcement arrivals visibly stage their troops before AI movement.
- AI movement trails animate long/multi-stage routes instead of snapping units to destination cells.
- Alien Field Beacon boot null guards.
- Beacon destruction cancels/prevents reinforcement transit.
- Tactical startup main-thread optimization.
- Fire-team Command Map and persistent pause/multi-order controls.
- Manual tactical movement and manual civilian/VIP escort override AI formation restrictions.
- VIP sequential reinforcement and terminal rescue behavior.
- Tactical AI false-total-loss prevention.
- Atomic multi-Skyranger launch and staged per-leg fuel correction.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct Node contract results:
  beacon=true
  traffic=true
  cohesion=true
  occupancy=true
  escort=true
  baseBeacon=true
  movementTrail=true
  swarm=true
- Static Build Health scan: 350 *Test references / 349 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing regression test.
- Current two-Skyranger deployment contract confirms the beacon path.
- Beacon foundation contract confirms the six-cell adjacent deployment ring and beacon reinforcement deployment.
- Interceptor swarm contract confirms options spanning multiple bases, independent elapsed travel, staging-hangar reservation, and a target-destroyed return route aimed at the permanent home base.
- Start-screen version derives as v0.26.08.07.1015 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
A complete live Chromium tactical/geoscape smoke test remains the final validation gate because the container browser sandbox/zygote process is unreliable. Recommended manual checks:

1. Start a fresh two-Skyranger tactical incident and confirm a Field Beacon, not a purple saucer, is present.
2. Watch an AI fire team form at deployment and after combat; the leader should remain at half pace until supports are actually formed up.
3. Put friendly soldiers in each other's likely travel lanes and confirm later movers re-path more directly after the lane clears.
4. Confirm no two living soldiers finish a round on the same hex.
5. Escort a VIP/civilian with a fire-team leader, spot an alien, test both escort-support choices, and confirm detached supports return afterward.
6. Station Ready interceptors at several bases, select `All Bases`, verify staggered arrivals, destroy the UFO before every interceptor arrives, and follow the remaining aircraft home through normal ferry routing.



