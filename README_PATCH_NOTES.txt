PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.1515_GEOSCAPE_TICK_FLICKER_ELIMINATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Removes the remaining once-per-Geoscape-tick visual flicker from the Three.js globe and the flat day/night Terminator Map while preserving Browser 1345's corrected shared solar geometry.

ROOT CAUSES
-----------
1. The smooth visual solar clock could continue extrapolating past the next expected strategic tick. If the browser/main thread was delayed while the large strategic state update ran, the next authoritative React update could force the visual clock back toward strategic time. That backwards correction read as a once-per-second night-shadow flash.
2. The Terminator Map was rebuilding a full ImageData buffer and performing repeated object creation/trigonometric solar calculations for every pixel at roughly 25 presentation frames per second. This added main-thread pressure at the same time the strategic tick updated campaign state.
3. advanceGeoscapeTimeByMinutes() regenerated the random globe cloud-drift seed every strategic tick. Because the seed ID was part of every cloud SVG key, the cloud layer was physically unmounted and remounted about once per second, producing an additional visible globe flash.

FIXES
-----
- Solar presentation now interpolates only as far as the next expected strategic tick. If the authoritative tick is late, the presentation holds at that boundary instead of running ahead.
- Normal strategic ticks use an authoritative "tick handoff": the newly advanced strategic time becomes the next interpolation anchor with no backwards phase correction.
- Pause/resume, time-speed changes, loads, and deliberate time jumps remain explicit re-anchor events.
- Terminator Map reuses one persistent ImageData buffer.
- Terminator Map precomputes latitude/longitude sine/cosine tables once and uses a fast solar dot-product loop for subsequent frames.
- The flat night canvas is isolated on a persistent composited paint layer.
- The Three.js WebGL globe mount/canvas is also isolated on a stable compositor layer.
- Per-tick setCloudDriftSeed(makeCloudDriftSeed(4)) has been removed.
- Globe cloud element keys are stable across strategic time ticks, so cloud animations continue instead of restarting.

PRESERVED SYSTEMS
-----------------
- Browser 1345 Three.js globe surface authority and globe/flat-map solar parity remain active.
- Browser 1245 Simulation AI stream recovery remains active.
- Browser 1115 dateline-shortest aircraft routing remains active.
- Browser 1055 flat-map world-wrap craft copies and louder tactical radio static remain active.
- Tactical fire/smoke hazard AI, civilian/VIP vehicle-footprint pathing, breaching, building interior floors, FPV/TPV mission backdrops, and all earlier tactical fixes remain active.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- A delayed tick test confirms the presentation reaches the next tick and then hands off without a backwards jump.
- Build Health confirms cloud drift is no longer reseeded from the strategic tick function.
- Build Health confirms the Terminator Map uses persistent Float32Array trig tables and exposes tick-flicker compositor diagnostics.
- Build Health confirms the Three.js globe exposes the same compositor-isolation diagnostic.
- All six non-empty embedded JavaScript blocks pass node --check.

MANUAL TEST GATES
-----------------
1. Run the Geoscape for 15-20 seconds at 1m, 30m, 1h, 6h, and 1d compression. The globe must not flash when the strategic clock ticks.
2. Repeat on the flat Terminator Map. The night overlay must slide continuously without the once-per-second pulse/flash.
3. Observe globe clouds for at least 15 seconds. They should drift continuously instead of visibly restarting each tick.
4. Pause time, compare a clearly daylit and clearly dark region between the globe and flat map, and confirm Browser 1345 solar parity is preserved.
5. Recheck aircraft movement, including dateline crossings, to confirm this presentation patch did not affect travel authority.

RECENT BASELINE
---------------
1345: Three.js globe became the sole visible Earth surface; duplicate SVG Earth/night circle removed; globe and Terminator Map share geoscapeSubsolarPoint().
1245: Simulation AI continuation const-assignment fix plus stable visual-clock source and initial globe/map solar parity.
1115: First-round Simulation AI continuation and shortest dateline aircraft route.
1055: AI stream watchdog, smooth day/night presentation foundation, flat-map craft world wrap, stronger tactical radio static.
0215: Deliberate breaching, building interior floor tiles, and FPV/TPV biome backdrops.
