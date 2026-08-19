PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.2355_GEOSCAPE_IMPERATIVE_CANVAS_OVERLAY_TICK_ISOLATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Targets the still-reproducible once-per-strategic-tick Geoscape flash after Browser 2345 restored startup.

Live testing has now shown that the flash can survive changes to the solar clock, WebGL surface, compositor night mask, front-buffer commit strategy, cloud rendering, and tick scheduling. Browser 2355 therefore attacks a different layer: the large React SVG command overlays that were still being reconciled/repainted over both Earth views every strategic commit.

TERMINATOR MAP
--------------
- Keeps the static opaque Earth base and compositor-driven repeating night/twilight mask from the 2315/2345 architecture.
- Replaces the player-facing React SVG command layer with one persistent transparent 720x360 canvas.
- Canvas draws:
  - bases and labels;
  - incidents;
  - detected UFOs;
  - alien bases;
  - Skyrangers and interceptors;
  - opposite-edge world-wrap craft copies;
  - aircraft/base range rings;
  - ferry links;
  - placement/selection crosshair.
- Incident hit testing and map-coordinate selection now occur directly on the canvas.
- A strategic tick can update backing data, but it no longer causes React to diff/repaint a large SVG tree over the solar surface.

GLOBE
-----
- Keeps the fixed-step, cloudless Three.js Earth and corrected solar lighting.
- The legacy SVG globe command overlay is explicitly not mounted.
- A persistent transparent 360x360 canvas now draws command information over WebGL:
  - exterior stars;
  - selected-region outline;
  - range rings and ferry links;
  - bases, incidents, UFOs, alien bases;
  - Skyrangers and interceptors;
  - placement crosshair;
  - lightweight occupation markers.
- Globe click, drag, pointer, and wheel interaction is handled by that canvas.
- The previous completed WebGL/canvas pixels remain visible through a heavy strategic tick instead of relying on a large SVG repaint.

TICK DECOUPLING
---------------
- EarthBaseGlobe no longer re-observes the obsolete unified solar clock on every minute/day tick.
- That observer now reacts only to run/pause and time-speed changes.
- This removes another tick-coupled presentation side effect while preserving the current fixed-step globe and compositor map solar motion.

REGRESSION COVERAGE
-------------------
- Adds GEOSCAPE_IMPERATIVE_CANVAS_OVERLAY_TICK_ISOLATION_PATCH.
- Adds GEOSCAPE_REACT_SVG_TICK_REPAINT_REMOVAL_PATCH.
- Adds a Build Health contract requiring:
  - player-facing Terminator Map canvas overlay;
  - player-facing Globe canvas overlay;
  - legacy globe SVG explicitly disabled;
  - compositor solar map surface retained underneath.
- All 6 non-empty embedded JavaScript blocks pass node --check.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Launch and load/start a campaign.
2. Run Terminator Map at 1h, 6h, then 1d for at least 30-60 seconds.
3. Watch the entire map at the once-per-second strategic tick; it should not blank/flash.
4. Confirm the night shadow keeps moving continuously and does not jump because of ordinary ticks.
5. Switch to Globe and repeat. A heavy tick may momentarily delay the next drawn frame, but the previous completed globe frame should remain visible.
6. Confirm globe drag, click, zoom/wheel, incidents, bases, UFOs, aircraft, range rings, and ferry links remain usable.
7. Confirm Terminator Map incident clicking and location selection still work.

IMPORTANT
---------
This patch deliberately changes the dynamic command-overlay presentation path rather than making another solar-clock adjustment. It is based on the live evidence that the remaining flash survived multiple independent solar-renderer implementations and appears only while the strategic React update is running. Desktop verification is still required before declaring the flicker resolved.

PREVIOUS BUILD 2345
-------------------
v0.26.08.18.2345_COMPOSITOR_TERMINATOR_SCOPE_STARTUP_HOTFIX_PATCH

Browser 2345 repaired the startup scope error in the 2315 compositor Terminator renderer. It intentionally did not claim to fix the tick-linked flicker.
