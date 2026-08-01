Alien Response Command / Project Aegis
Patch: v0.26.08.01.0146_FULL_SQUAD_AI_COMBAT_PRIORITY_AND_THREAT_AVOIDING_ESCORT_PARITY_PATCH
Native: v0.26.08.01.GODOT.0016_FULL_SQUAD_AI_COMBAT_PRIORITY_THREAT_AVOIDING_ESCORT_AND_SEQUENTIAL_ACTION_VERTICAL_SLICE

Purpose:
- Keep every viable AI-controlled soldier tasked each turn without restoring unbounded pathfinding.
- Preserve active civilian escorts while non-escorts prioritize squad-spotted aliens, then search unexplored ground.
- Route escorted civilians around known alien firing exposure when a safer bounded path exists.
- Present visible AI actions sequentially and connect Classic Lineup tracers to their exact shooter and target.
- Add compact-header base selection, warn before recruiting into a base without a Skyranger, and recover successful-mission salvage to the squad's home base instead of a ferry staging base.

Validation performed:
- Static browser parsing and the build seam checker passed.
- Browser Build Health passed 298/298 through a cache-busted localhost load.
- Localhost start screen, Geoscape, compact Base selector, six-soldier tactical launch, 151-cell movement highlight, TU-spending movement, and three End Turn cycles passed.
- Browser diagnostics contained no runtime errors; only the existing Tailwind development-CDN warning was present.
- Godot tests passed 111/111; native Build Health passed 85/85.

Manual gate:
- Run the originally affected mandatory-rescue battle under AI command for several turns and confirm every viable soldier acts, escorts avoid known firing lanes, and visible actors move one at a time.
- Build or select a second base without a Skyranger and confirm soldier recruitment requires explicit approval.
- Complete a ferry-staged mission and confirm bodies, alien items, and recovered equipment arrive at the squad's stationing base.
- Inspect Classic Lineup fire and confirm each tracer starts at the firing unit and ends at the selected target.
