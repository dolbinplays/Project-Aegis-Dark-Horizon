PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.2225_GEOSCAPE_UNIFIED_SOLAR_RENDERER_REBUILD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Rebuilds the player-facing Geoscape day/night presentation instead of layering another timing workaround onto the repeatedly flickering legacy solar renderer. The Globe and Terminator Map now share one monotonic visual solar clock that advances independently of the once-per-second strategic simulation tick. Ordinary same-speed strategic ticks can update campaign state, aircraft, incidents, routes, funding, transfers, etc. without directly moving, rebuilding, clearing, or re-anchoring the visible Earth/day-night surface.

UNIFIED SOLAR PRESENTATION CLOCK
--------------------------------
- Adds one shared GEOSCAPE_UNIFIED_SOLAR_CLOCK for both Globe and Terminator Map views.
- The visual clock advances from browser monotonic time according to the selected Geoscape compression rate.
- Ordinary strategic ticks are observed as authoritative campaign progress but are explicitly ignored as visual reposition commands.
- Pause freezes the shared visual clock.
- Changing time speed preserves the currently displayed solar phase and changes only its rate of progression.
- Large genuine discontinuities such as loading/jumping to a very different campaign time can deliberately re-anchor the presentation.
- Missed render time is bounded and repaid gradually rather than being applied as one visible terminator jump.

TERMINATOR MAP RENDERER REBUILD
-------------------------------
- The old CPU-generated shade bitmap / back-buffer / front-buffer solar surface is no longer the mounted player-facing map surface.
- The new map background is one persistent WebGL renderer appended imperatively to a stable DOM mount.
- Ocean, landmasses, and latitude/longitude grid are generated once as a static texture.
- A lightweight fragment shader calculates day/night/twilight directly from each pixel's latitude/longitude and the shared Sun vector.
- No strategic tick regenerates or clears the map background.
- React continues to update the SVG command layer above the map for bases, incidents, UFOs, Skyrangers, interceptors, route lines, range rings, ferry links, selection, and interaction.
- Existing dateline world wrapping and shortest logical craft routing remain unchanged.

GLOBE RENDERER REBUILD
----------------------
- The previous Browser 2115 solar-integrator globe component is no longer mounted as the player-facing Earth surface.
- A new persistent surface-only Three.js renderer owns the opaque ocean sphere, landmasses, atmosphere, and solar lighting.
- The globe reads the exact same shared visual solar clock as the Terminator Map.
- Both views still derive solar geography from geoscapeSubsolarPoint(), preserving the corrected globe/map day-night parity from Browser 1345.
- Globe rotation changes the viewpoint, not the Sun.
- Globe clouds remain disabled by design.
- Marker/route/interaction overlays remain separate from the Earth surface so strategic updates do not rebuild the globe renderer.

PRESERVED SYSTEMS
-----------------
- Browser 1945 FPV/TPV world-space ground and building-floor alignment.
- Browser 1845 FPV/TPV backdrop depth occlusion.
- Browser 1115 dateline shortest-route aircraft pathing and map-edge wrapping.
- Simulation AI stream safeguards/recovery.
- Tactical fire/smoke, hazard-aware routing, deliberate breaching, interior floor materials, mission backgrounds, Night Operations lighting, and all earlier gameplay systems.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Added GEOSCAPE_UNIFIED_SOLAR_RENDERER_REBUILD_PATCH build flag.
- Build Health verifies that an ordinary strategic tick does not re-anchor the shared visual clock.
- Build Health requires the new Terminator Map ShaderMaterial and shared uSun authority.
- Build Health requires the new unified cloudless Three.js globe to sample the shared clock.
- Legacy Browser 2115 solar components remain dormant in source for compatibility/history but are not mounted as the player-facing solar surfaces.
- All six non-empty embedded JavaScript blocks pass node --check.

MANUAL TEST GATES
-----------------
1. Run the Terminator Map for at least 30 seconds at 1h, 6h, and 1d speeds. Confirm there is no once-per-tick whole-map flash and no forward snap in the night boundary.
2. Repeat on the Globe. Confirm no intermittent full-globe flash and no clouds.
3. Switch Globe <-> Terminator Map repeatedly and confirm the same regions are day/night in both views.
4. Pause time and confirm both solar views freeze exactly.
5. Change time speed while running and confirm the boundary changes speed without jumping position.
6. Confirm bases, incidents, UFOs, aircraft, route lines, range overlays, and ferry links continue updating normally above the persistent Earth surfaces.
7. Test a Skyranger/interceptor crossing +/-180 longitude and confirm the short dateline route/world-wrap behavior remains intact.

NOTE
----
A full desktop WebGL/compositor test cannot be completed in this environment because browser navigation/rendering is blocked by the runtime administrator policy. The rebuild is therefore syntax/static-contract validated and still needs the live desktop visual gate above.
