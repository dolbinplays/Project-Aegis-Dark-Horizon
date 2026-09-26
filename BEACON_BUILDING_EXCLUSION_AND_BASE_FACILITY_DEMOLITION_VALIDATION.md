# Beacon Building Exclusion + Base Facility Demolition validation

Build: `v0.26.09.25.0011_BEACON_BUILDING_EXCLUSION_AND_BASE_FACILITY_DEMOLITION_HOTFIX`  
Save format: **4**

## Report reproduced in source audit

The initial tactical Beacon placement path selected an `alienCenter` using hard-cover clearance and sight/distance checks, but did not require the Beacon's seven-cell deployment footprint to be outside procedural-building cells. Large building interiors can contain passable floor cells with no hard-cover record, so a Beacon could legally pass the old center-cell test while visually and tactically sitting inside a dwelling. Reinforcement-UFO landing used distance from structural cover rather than an explicit full building-footprint exclusion, leaving a similar interior-space seam.

## Repair

- Added one shared `tacticalAlienBeaconDeploymentFootprintClear(...)` authority for Beacon center + six adjacent cells. It rejects map-edge cells, living occupancy, live cover footprints, player craft footprints, and `tacticalBuildingCellAt(...)`.
- Initial deployment uses that authority for every hidden/far candidate and deterministic fallback.
- Replacement Beacon placement delegates to the same authority.
- UFO landing and `tacticalAlienDeliveryPlacementClear(...)` reject every building cell in the complete transport footprint.
- UFO-to-Beacon handoff checks the persisted center again. A saved center that is now/was invalid because it lies in a building is deterministically repaired to the nearest legal seven-cell Beacon footprint while preserving source identity and handoff timing.

## Base demolition rules

- Built 1x1 facilities can be selected and demolished after confirmation. No construction refund is issued.
- Empty Hangars clear their complete 2x2 footprint. A Hangar with an aircraft or reservation is blocked until relocation.
- Base Stores removal is blocked when local loose inventory would exceed projected remaining capacity.
- Sickbay removal is permitted; the existing base-local Sickbay capacity effect moves excess patients to Barracks recovery.
- **Access Lift is always protected and cannot be demolished.**

## Automated/static gates

1. Current runtime build and Patch History expose 0011 exactly once as the mutable current entry; 0010 is frozen explicitly.
2. Initial Beacon deployment references `tacticalAlienBeaconDeploymentFootprintClear`.
3. Shared Beacon legality checks `tacticalBuildingCellAt` for all seven footprint cells.
4. Replacement Beacon legality delegates to the shared rule.
5. UFO landing checks the full craft footprint against `tacticalBuildingCellAt`.
6. Delivery-placement clearance independently checks building cells.
7. UFO handoff invokes deterministic `tacticalAlienBeaconSafeCellNear` repair when a stored center is inside a building.
8. Base UI contains a Demolish Facility control and a confirmation modal.
9. Demolition preflight hard-blocks `access`.
10. Hangar occupancy/reservation and Base Stores capacity guards are present.
11. Mobile Base confirmation-sheet state covers construction or demolition.
12. Runtime embedded JavaScript and service worker parse successfully.
13. Save format remains 4.

## Live field acceptance

- Generate several Small/Medium/Large town or residential incidents. Inspect initial Beacon location and all six adjacent spawn cells; none may lie in a dwelling/business footprint.
- Destroy a Beacon and allow replacement deployment near dense buildings. Confirm the replacement selects another legal site or retries instead of occupying a building.
- Trigger a version-2 reinforcement UFO near dense structures. Confirm the entire landed craft remains outside buildings and its eventual Beacon is left on a legal exterior footprint.
- Load a save that contains an older invalid UFO delivery center if available; when handoff occurs, confirm the Beacon relocates deterministically outside the building without duplicating the source/wave.
- In Base view, demolish and rebuild ordinary facilities. Confirm no refund is added.
- Attempt to demolish the Access Lift: the UI must show it as protected and no state mutation may occur.
- Attempt to demolish an occupied Hangar and over-capacity Base Stores: both must be rejected with actionable reasons.
- Remove a Sickbay with more patients than remaining beds and confirm overflow moves to Barracks recovery.
- Save/reload after demolishing facilities and confirm cleared grid spaces, aircraft assignments, storage, Sickbay state, upkeep, and Access Lift protection remain consistent.
