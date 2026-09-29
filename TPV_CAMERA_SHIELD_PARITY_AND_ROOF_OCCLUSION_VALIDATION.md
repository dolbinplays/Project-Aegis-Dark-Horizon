# TPV Camera Occlusion Recovery + Beacon Shield Parity + Sealed Sloped Roofs Validation

Build: `v0.26.09.29.0016_TPV_CAMERA_SHIELD_PARITY_AND_ROOF_OCCLUSION_PATCH`

Save format: **4** (unchanged).

## Scope

### TPV obstruction recovery

The persistent TPV chase camera now treats the requested camera position as a visibility problem rather than blindly accepting the nominal rear/shoulder offset.

- A Three.js ray is evaluated between the observed soldier/look point and the desired chase-camera location against persistent `coverRoot` geometry, including Skyranger/building/scenery meshes.
- Roof panels/decks and nearly transparent presentation meshes are excluded so roof cutaway and camera collision do not fight each other.
- If the requested position is blocked, the solver first clamps to the nearest safe visible distance and then samples bounded lateral orbit candidates (approximately ±30°, ±60° and ±83° around the actor).
- The clearest legal candidate becomes the presentation camera position. The soldier's tactical coordinates, AI/control mode and authoritative facing are not modified.
- Runtime diagnostics mark the camera result as `clear` or `recovered` through the existing tactical DOM dataset for field inspection.

### Beacon / shield manual-AI parity audit

The audit traced direct manual target fire, manual cover/Beacon fire, reaction fire, Hybrid/autonomous fire and full Simulation playback through the existing Beacon shield helpers.

Two seams were corrected:

1. An older manual direct-fire-at-Beacon path called generic structural cover damage without passing the equipped weapon kind. It now calls the shared weapon-aware damage helper with shooter and cover context.
2. AI shield blocks could be authoritative but visually ambiguous because playback received only `shieldBlocked` and not the source field. Shot records now preserve the blocking Beacon coordinates/grid size; presentation computes the first field-intersection cell and terminates the blocked projectile there.

Behavioral checks execute the actual shared shield authority:

- kinetic field + outside ballistic: blocked;
- kinetic field + outside laser: permitted under the established doctrine;
- combined field + outside ballistic/laser/plasma: blocked;
- Frag Grenade from outside: retains established effectiveness;
- shooter legally inside the seven-hex field: bypasses the field for applicable fire;
- ordinary alien standing inside a combined field: receives the same field protection as Beacon-targeted shield logic.

The patch does not change shield balance, knowledge discovery or AI doctrine; it removes control-mode and presentation seams around the existing rules.

### Sealed pitched/slanted roof deck

Every pitched/slanted procedural roof receives a flat under-deck at the roof base plane beneath the decorative slope.

- The deck uses the same building group/material lifecycle and damage-hole exclusions as the outer pitched roof.
- Exterior views therefore see a closed roof envelope instead of interior space through gaps beneath the slopes.
- Roof-cutaway occlusion now checks the set of buildings occupied by living AEGIS soldiers before allowing ray-based transparency. Unoccupied buildings stay opaque from outside.
- Existing interior occupancy fade remains available so soldiers working inside a building remain observable.

## Automated validation

Current focused results on the Browser 0016 runtime:

- `test-tpv-shield-roof-parity.cjs`: **8/8 passed**.
- `test-beacon-round-preimpact-playback-hold.cjs`: **6/6 passed**.
- `test-vip-window-concealment.cjs`: **6/6 passed**.
- `test-shot-impact-state-sequencing.cjs`: **6/6 passed**.
- `test-alien-forced-entry.cjs`: **6/6 passed**.
- `test-cooperative-planning-responsiveness.cjs`: **5/5 passed**.
- `test-planning-query-reuse.cjs`: **6/6 passed**.

The new suite verifies actual shield damage outcomes, field-bypass behavior, ordinary-alien field protection, shield-source playback metadata, TPV ray/sweep source integration, sealed roof deck construction, occupied-building cutaway gating and unchanged save format 4.

## Manual / installed-game gate

Installed/PWA WebGL field acceptance remains required:

1. Enter TPV with soldiers beside the Skyranger, inside/near its hull/ramp, beside building walls and near dense map-edge scenery. Orbit/advance playback and confirm the camera chooses a nearby visible angle instead of sitting inside geometry or losing the actor.
2. Repeat with narrow spaces and elevated camera offsets. Confirm recovery is stable rather than rapidly switching sides every frame.
3. Attack kinetic and combined Beacon shields under Manual, Hybrid and Simulation with ballistic, laser/plasma and Frag Grenades from both outside and inside the field. Confirm gameplay damage/block results match and blocked projectiles visibly stop at the field.
4. Exercise reaction fire against a protected alien and ordinary aliens inside the field; confirm identical protection rules and no apparent through-shield hit.
5. Inspect pitched/slanted buildings from low, high and map-edge exterior angles. Confirm the flat deck seals the interior. Put a living AEGIS soldier inside and confirm the normal roof cutaway/fade reveals the interior, then leave and confirm the roof becomes opaque again.
6. Regress Browser 0015 Beacon destruction hold, Browser 0014 blinds/curtains, Browser 0013 impact sequencing, Browser 0012 forced entry and save/load format 4.

## Limits

TPV collision recovery is intentionally bounded presentation logic, not a full physics camera. Extremely dense/narrow geometry may still require field tuning of candidate offsets. The new shield work does not rebalance shield tiers or grant AI new knowledge. The sloped-roof under-deck is presentation geometry and does not create another tactical floor/collision layer.
