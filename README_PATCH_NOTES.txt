Alien Response Command / Project Aegis
Patch: v0.26.08.01.0147_TACTICAL_CONTACT_MEMORY_STATE_CONTINUITY_AND_SAFE_LANDING_PARITY_PATCH
Native: v0.26.08.01.GODOT.0017_TACTICAL_CONTACT_MEMORY_RESCUE_PRIORITY_AND_SAFE_LANDING_VERTICAL_SLICE

Purpose:
- Remember the last observed alien position and send every non-escort soldier toward that contact area until it is cleared or replaced by a newer sighting.
- Give a civilian spotted before alien contact a persistent priority escort without taking an established escort away from rescue work.
- Preserve the exact live manual tactical map, units, TU, selection, fog, controls, log, round, and AI playback state when the player visits another command section.
- Place the Skyranger and extraction ramp only after a bounded clearance search keeps its full footprint away from buildings.
- Keep lethal Classic Lineup targets standing through the firing frame, apply death on the following impact frame, and delay all-clear dialogue/resolution until action playback is complete.

Validation performed:
- Static browser parsing and the build seam checker passed.
- Browser Build Health passed 303/303 through a cache-busted localhost load.
- Localhost start screen, Geoscape, six-soldier tactical launch, selected-soldier state, Base-to-Missions state restoration, three End Turn cycles, sequential AI playback, and Take Back Control passed.
- The three tactical turn cycles returned to the human phase in approximately 0.9, 1.1, and 1.1 seconds.
- Browser diagnostics contained no runtime errors; only the existing Tailwind development-CDN warning was present.
- Godot tests passed 114/114, native Build Health passed 87/87, and Godot 4.7.1 strict editor parsing passed.

Manual gate:
- Run the originally affected mandatory-rescue battle under AI command and confirm non-escorts converge on the last observed alien area while established escorts continue toward the ramp.
- Spot a civilian before any alien and confirm the discovering soldier keeps that civilian as their top priority after squad contact begins.
- Check several dense urban incident maps and confirm no Skyranger hull or ramp cell touches a building.
- Leave a damaged/rescue-progressed manual map for another command section, return, and confirm every changed cell and unit state remains exact.
- Watch a Classic Lineup lethal shot and confirm the target falls only after the shot is shown, all-clear follows the final impact, and no further attacks occur.
