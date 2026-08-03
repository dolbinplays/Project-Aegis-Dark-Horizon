Alien Response Command / Project Aegis
Patch: v0.26.08.02.0153_TACTICAL_INVENTORY_VIP_PRIORITY_DOOR_ROUTING_FIT_MAP_AND_BASE_FACILITY_DROPDOWN_PARITY_PATCH
Native: v0.26.08.02.GODOT.0023_INVENTORY_VIP_PRIORITY_DOOR_ROUTING_FIT_MAP_AND_BASE_FACILITY_DROPDOWN_VERTICAL_SLICE

Purpose:
- Stop AI soldiers from circling tracked civilians or VIPs by making adjacent arrival perform the contact action immediately.
- Send every free soldier toward active tracker pings before alien contact, then give squad-wide alien contact priority to all non-escorts while established escorts continue evacuation.
- Route soldiers through actual building doors or destroyed-wall breaches on every tactical map size.
- Add Fit Map for complete Small, Medium, and Large battlefield framing.
- Add bounded 4 TU adjacent inventory transfers plus exact-cell and elevation-aware floor drop/pickup state.
- Replace the Base facility button list with one compact construction dropdown.

Validation performed:
- Godot 4.7.1 strict project parsing passed.
- Native tests passed 131/131, including a practical mission with three End Turn cycles.
- Native Build Health passed 100/100 inside the automated suite.
- All six browser app scripts parsed and the build seam checker passed.
- Localhost start screen and Geoscape loading passed; Browser Build Health passed 320/320.
- A six-soldier Small 64x64 rescue mission used Fit Map and completed three End Turn cycles with no runtime or console errors.

Manual gate:
- In an indoor VIP mission, confirm AI soldiers follow tracker pings, use a doorway, contact an adjacent VIP without circling, and continue the escort to the Skyranger.
- Reveal an alien and confirm all non-escorts switch to combat while current escorts continue evacuation.
- Exercise Fit Map in 2D and Three.js on every map tier.
- Transfer, drop, and pick up one item between adjacent same-elevation soldiers and verify the 4 TU cost.
