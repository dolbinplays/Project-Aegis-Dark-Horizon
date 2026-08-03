Alien Response Command / Project Aegis
Patch: v0.26.08.02.0154_TACTICAL_AI_CAMERA_FIT_MAP_NEAREST_VIP_AND_ALIEN_REINFORCEMENT_PARITY_PATCH
Native: v0.26.08.02.GODOT.0024_NEAREST_VIP_ESCORT_AND_ALIEN_REINFORCEMENT_DROPSHIP_VERTICAL_SLICE

Purpose:
- Keep AI tactical playback centered on each active actor and retain the last camera anchor between actions.
- Reserve a visible perimeter in 2D and Three.js Fit Map views so no battlefield corner is clipped.
- Send every out-of-combat soldier to that soldier's closest unescorted VIP and perform contact on arrival.
- Allow one living alien commander to make a low, escalating reinforcement call while aliens observe soldiers.
- Delay arrival by two rounds and deploy two to four aliens from one small purple landing craft.
- Keep every alien hull and ramp cell inside the battlefield, more than one hex from buildings and all Skyranger hull/ramp cells, and off occupied unit cells.
- Preserve save format 4 and bounded tactical work; landing search examines at most 32 deterministic perimeter candidates.

Validation performed:
- Godot 4.7.1 strict project parsing passed.
- Native tests passed 138/138, including commander-death suppression, forced call, clear landing placement, delayed arrival, two-to-four-unit deployment, one-call-only behavior, and practical turn cycles.
- Native Build Health passed 101/101 inside the automated suite.
- All six browser app scripts parsed and the build seam checker passed.
- Localhost start screen and Geoscape loading passed; Browser Build Health passed 324/324.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles with all soldiers alive.
- The live commander naturally called reinforcements; two hostiles arrived from a craft visibly clear of the building and Skyranger in both 2D and Three.js Fit Map views.
- AI tactical map playback reached a named active-actor frame and Take Back Control restored the human phase.
- Browser console contained no runtime errors. The existing Tailwind CDN development warning remains.

Manual gate:
- Kill the alien commander before any call, preserve alien sight of soldiers for several rounds, and confirm no reinforcement call occurs.
- On Medium and Large maps with one and two Skyrangers, allow a reinforcement arrival and confirm the alien craft never touches a building or either Skyranger.
- Confirm the two-round countdown, purple craft, two-to-four reinforcements, and one-call maximum in a longer natural battle.
- In a rescue mission with separated VIPs, confirm each free soldier approaches and contacts the closest unescorted VIP.
