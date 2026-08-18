PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.0015_CIVILIAN_VIP_VEHICLE_FOOTPRINT_PATHING_AUTHORITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes a remaining tactical pathing seam where VIPs and civilians could treat the non-anchor cells of a multi-hex road vehicle as open ground. Cars, vans, trucks, buses, and other live multi-cell hard-cover objects now contribute their complete footprint to the shared movement blocker authority used by reachability, AI route planning, VIP extraction routing, search/guard planning, and battlefield integrity repair.

CIVILIAN / VIP LAND-VEHICLE PATHING FIX
----------------------------------------
- A live road vehicle is treated as one solid multi-hex object for movement rather than as only its anchor cell.
- Every cell in `footprintCells` / `tacticalCoverFootprintCells(...)` is excluded from civilian/VIP reachable-cell searches while the vehicle remains intact.
- AI movement planners consume the same complete blocker set, preventing autonomous civilians/VIPs from entering a vehicle through a side/rear footprint cell.
- VIP routes toward Skyranger extraction ramps remain bounded and now consistently route around the complete body of intervening vehicles.
- Panic/flee movement and nearby destination selection continue to reject hard cover and therefore also reject the complete vehicle footprint.

SHARED FOOTPRINT AUTHORITY
--------------------------
- Added `tacticalHardCoverFootprintKeySet(...)` as a reusable complete-hard-cover footprint authority.
- `tacticalPathBlockerIndex(...)`, `tacticalReachableCellSet(...)`, `tacticalAiReachablePlan(...)`, and `tacticalAiThreatAwareReachablePlan(...)` now agree on those footprint cells.
- Search, guard, reported-contact, extraction/no-reentry, and other tactical target-selection helpers that previously rebuilt anchor-only hard-cover sets now use the shared footprint-aware authority.
- This is intentionally broader than a VIP-only conditional so soldiers, aliens, civilians, and VIPs cannot disagree about whether a vehicle cell is physically occupied.

BATTLEFIELD INTEGRITY SAFETY NET
--------------------------------
- `tacticalNearestPlayableOpenCell(...)` now excludes complete hard-cover footprints when selecting a fallback location.
- `tacticalRepairBattlefieldState(...)` treats a living actor already inside a live hard-cover footprint as invalid tactical state.
- A civilian/VIP loaded or produced inside a non-anchor vehicle cell is relocated to the nearest legal open cell and the repair is identified as `cover-overlap`.
- This closes the fallback/repair route that could otherwise recreate the overlap after ordinary pathfinding had been fixed.

PRESERVED BEHAVIOR
------------------
- Destroyed vehicles release their complete footprint as before because only live hard-cover records contribute blockers.
- Vehicle dimensions, HP, destruction, LOS/shot blocking, cover behavior, fire/smoke behavior, and presentation are unchanged.
- Skyranger hull cells remain solid hard cover while the rear ramp/center aisle remains passable extraction geometry.
- Browser 2355 fire/smoke and Browser 2315 FPV/TPV ground presentation remain active.
- Save format remains 4; no migration and no new binary assets are required.

BUILD HEALTH / VALIDATION
-------------------------
- Added a representative 3x2 vehicle regression.
- The contract verifies all vehicle footprint cells enter the hard-cover blocker index.
- It verifies ordinary reachable cells and AI reachable cells exclude the complete vehicle footprint.
- It verifies a VIP route to an extraction ramp does not cross any vehicle footprint cell.
- It seeds a VIP into a non-anchor vehicle footprint cell and verifies battlefield integrity repair returns that VIP to legal ground.
- All non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Run a Small Town/urban mission with cars, vans, trucks, and a bus. Escort a VIP past them and confirm no route enters any part of a vehicle body.
2. Allow a civilian to panic/flee beside a vehicle and confirm the civilian routes around the full footprint rather than stepping into a side/rear vehicle cell.
3. Place a road vehicle between an escorted VIP group and the Skyranger ramp; confirm the VIPs route around the vehicle and still reach the open ramp.
4. Destroy a road vehicle and confirm its former footprint becomes traversable under the normal destruction rules.
5. Confirm soldiers and aliens also continue respecting the same complete vehicle footprint, preventing actor-class disagreements about solidity.
6. Confirm friendly Skyranger side/hull cells remain blocked while the rear ramp and center aisle remain traversable.

ROADMAP CONTINUITY
------------------
- The documentation-only plan for future multi-floor/multi-level structures and multi-deck alien craft remains on the roadmap. Browser 0015 does not begin that implementation.
