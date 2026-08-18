PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.0045_FIRE_SMOKE_HAZARD_AWARE_PATHING_AND_AI_RESPONSE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes the Browser 2355 fire/smoke system part of tactical AI movement decisions. Soldiers, aliens, civilians, VIPs, escorts, fire teams, rescue/extraction routing, search/guard planning, and AI playback now prefer safer routes around active fire and dense smoke while retaining a fallback through hazards if no reasonable legal alternative exists.

FIRE / SMOKE HAZARD-AWARE PATHING
---------------------------------
- Added a shared movement-hazard cost model derived from the existing tactical fire/smoke cover records.
- Active fire carries a very high cost instead of becoming an impassable blocker.
- Civilians and VIPs apply the strongest fire avoidance, AEGIS soldiers apply a strong penalty, and aliens apply a lower but still meaningful penalty.
- Smoke applies a softer routing penalty, with an additional cost for dense smoke.
- This keeps hazards tactically meaningful without creating invisible walls or deadlocking trapped units.

AI MOVEMENT / FIRE-TEAM RESPONSE
--------------------------------
- `tacticalAiReachablePlan()` and `tacticalAiThreatAwareReachablePlan()` now track cumulative `hazardCost`, `fireSteps`, and `smokeSteps` and can replace a short hazardous path with a safer alternate path to the same cell.
- General tactical AI destination scoring penalizes cumulative hazard exposure and strongly penalizes actual fire crossings.
- Direct-contact movement, formation following, hybrid fire-team command movement, aggressive flanking, alien beacon assault movement, and alien exfil all inherit the new authority.
- Existing reserve-TU, formation cohesion, cover, command-distance, LOS, and combat doctrine rules remain active.

VIP / CIVILIAN / ESCORT SAFETY
------------------------------
- Panic movement now avoids burning adjacent cells before comparing ordinary threat-distance preferences.
- Escorted civilians/VIPs prefer hazard-free formation cells when following their escort.
- VIP catch-up routing to the Skyranger ramp uses weighted hazard-aware search and still refuses to cut through unrelated buildings.
- Building-exit and no-building-reentry extraction routes now include fire/smoke cost, allowing an escort route to change when a previously safe approach catches fire.
- Search-sector and rescue-perimeter planners do not choose actively burning cells as normal assignment destinations.
- Browser 0015 full land-vehicle footprint blocking remains authoritative at the same time, so a detour cannot route a civilian/VIP through a car, van, truck, or bus.

DYNAMIC PLAYBACK REVALIDATION
-----------------------------
- AI movement trails are revalidated against current fire/smoke state immediately before playback.
- If fire or smoke spread after the authoritative move was generated, the renderer reconstructs a safer legal path to the same resolved destination when one exists.
- If no safer legal route exists, the required hazardous route remains valid; the unit is not teleported and the resolved destination is not changed.

SMOKE / COMBAT BEHAVIOR
-----------------------
- Existing Browser 2355 smoke LOS authority remains unchanged.
- AI movement now also treats dense smoke as an undesirable observation/firing corridor, complementing the existing LOS checks that already prevent valid engagement through sufficiently obscured smoke.
- No new damage, accuracy, fire-spread, or smoke-lifetime numbers are introduced in this patch.

SAVE / COMPATIBILITY
--------------------
- Save format remains 4.
- No new persistent tactical fields are required. Hazard-awareness is calculated from the existing `hazardType`, `fireIntensity`, `smokeDensity`, and `burning` cover state.
- Manual player movement remains possible through hazardous cells; Browser 0045 changes autonomous route choice rather than silently overriding player decisions.
- The future multi-floor/multi-level structure and multi-deck alien-craft roadmap work remains planning-only and is not implemented here.

VALIDATION
----------
- Build Health verifies that avoidable fire/smoke is routed around.
- A forced-route regression verifies fire remains traversable when the burning gap is the only legal crossing.
- A panic regression verifies a VIP chooses a non-burning neighboring cell when one exists.
- A playback regression verifies a recorded trail through newly active fire is reconstructed onto a safer legal route.
- Browser 0015's multi-hex vehicle-footprint regression remains active.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Start a tactical mission and create a burning vehicle/structure between an AI-controlled unit and its objective. Confirm the unit routes around the flames if there is a practical alternative.
2. Escort VIPs toward the Skyranger, then allow fire to spread into the previous approach lane. Confirm the escort/VIP column recalculates around the hazard rather than continuing through it.
3. Put a civilian into panic near a fire cell and confirm panic movement prefers a safe neighbor.
4. Create a constrained corridor where the only legal route crosses fire. Confirm AI can still cross rather than treating the fire as an invisible wall.
5. Observe dense smoke between AI and a destination and confirm route selection prefers a clear alternative when available.
6. During AI playback, let the current hazard state invalidate a previously recorded route and confirm the animated movement uses a safer legal path without changing the resolved destination.
7. Recheck a VIP route around a multi-hex land vehicle to confirm Browser 0015 remains intact.
