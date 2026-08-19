PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.2315_COMPOSITOR_SOLAR_DECOUPLE_AND_FIXED_STEP_GLOBE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Live testing of Browser 2225 still showed intermittent flashes tied to the once-per-second strategic tick. Browser 2315 changes the rendering mechanism again rather than tuning another timing constant. The flat Terminator Map no longer uses a continuously rendered full-surface WebGL Earth. Its base map is static, while the night/twilight mask is animated by the browser compositor. The globe remains Three.js but switches to a bounded fixed-step presentation loop and no longer preserves the WebGL drawing buffer.

TERMINATOR MAP: STATIC BASE + COMPOSITOR NIGHT MASK
---------------------------------------------------
- Removes the player-facing full-surface WebGL Terminator Map renderer introduced in Browser 2225.
- Ocean, continents, and geographic grid are drawn once into a static opaque 2D canvas.
- The moving day/night presentation is a separate transparent night/twilight mask.
- The mask is repeated three times horizontally and translated one world-map width per full game day, so the animation wraps seamlessly at +/-180 longitude.
- The translation uses the Web Animations API and compositor transform animation rather than requestAnimationFrame or a per-frame WebGL render.
- Playback rate is derived directly from the selected Geoscape speed. Ordinary strategic ticks do not set animation currentTime, move the mask, clear the canvas, or re-anchor its phase.
- Pause pauses the compositor animation exactly.
- Changing time speed changes playbackRate without moving the currently displayed boundary.
- Paused/manual time changes may deliberately re-anchor the displayed phase.
- Seasonal solar declination is refreshed on a coarse month bucket instead of every strategic tick, preventing once-per-second mask regeneration while retaining campaign-scale seasonal tilt.

GLOBE: FIXED-STEP WEBGL PRESENTATION
------------------------------------
- Keeps the corrected Three.js globe and geoscapeSubsolarPoint solar geography.
- WebGL preserveDrawingBuffer is now disabled.
- Globe solar presentation runs on a bounded ~33 ms fixed-step loop.
- A strategic tick that blocks the main thread no longer causes the globe to apply the full missed wall-clock interval in one frame.
- Missed time becomes bounded debt and only a very small amount is recovered on each subsequent globe frame.
- The intended failure mode during a very heavy strategic update is a brief visual hold/slowdown, not a flash or forward terminator snap.
- Globe rendering is inactive while the Terminator Map view is selected, reducing hidden GPU work.
- Globe clouds remain disabled.

WHY THIS PATCH IS DIFFERENT
---------------------------
Browsers 1515 through 2225 progressively removed clock re-anchors, canvas clears, cloud rebuilds, large catch-up steps, filtered overlays, and finally rebuilt both solar surfaces in WebGL. Live desktop testing still showed tick-linked flashing. Browser 2315 therefore removes the flat map's solar motion from the JavaScript/WebGL frame loop entirely. The browser compositor can continue transforming the transparent night mask even while the main thread is busy processing a strategic tick.

PRESERVED SYSTEMS
-----------------
- Correct globe/map solar geography from Browser 1345.
- Cloudless globe presentation.
- Dateline shortest-route aircraft pathing and map-edge world wrapping from Browser 1115.
- FPV/TPV world-space ground and building-floor alignment from Browser 1945.
- FPV/TPV backdrop depth occlusion from Browser 1845.
- Simulation AI stream safeguards/recovery.
- Tactical fire/smoke, hazard-aware routing, deliberate breaching, interior floor materials, mission backgrounds, and Night Operations lighting.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Adds GEOSCAPE_COMPOSITOR_TERMINATOR_SURFACE_PATCH.
- Adds GEOSCAPE_FIXED_STEP_GLOBE_SOLAR_PATCH.
- Adds GEOSCAPE_TICK_SURFACE_DECOUPLE_PATCH.
- Build Health requires the player-facing Terminator Map to use a compositor animation with playbackRate and no WebGLRenderer.
- Build Health requires the player-facing globe to use preserveDrawingBuffer:false and a bounded fixed-step timer.
- Build Health confirms the actual Terminator Map and EarthBaseGlobe mount points use the new components.
- All six non-empty embedded JavaScript blocks pass node --check.

MANUAL TEST GATES
-----------------
1. Run the Terminator Map at 1h, 6h, and especially 1d speeds for at least 30 seconds.
2. Confirm the ocean/continents/grid never disappear or flash when the strategic clock ticks.
3. Confirm the night boundary moves at a constant apparent speed and does not jump forward at tick boundaries.
4. Pause and confirm the boundary freezes exactly.
5. Change speed while running and confirm the existing boundary keeps its position while only its movement rate changes.
6. Repeat on the Globe. A heavy strategic tick may cause a tiny hold, but there should be no full-globe flash and no large forward solar snap.
7. Switch Globe <-> Terminator Map and confirm the same broad regions remain day/night.
8. Confirm bases, incidents, UFOs, aircraft, routes, range rings, and dateline wrapping still behave normally.

NOTE
----
The flicker has proven browser/compositor-sensitive and has repeatedly survived static and syntax validation. Browser 2315 changes the rendering mechanism specifically to remove the Terminator Map solar motion from the main-thread frame loop. Live desktop testing remains the final gate.
