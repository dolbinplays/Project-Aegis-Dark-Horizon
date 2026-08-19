PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.1645_GEOSCAPE_FREE_RUNNING_SOLAR_CLOCK_FLICKER_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the remaining synchronized once-per-Geoscape-tick flash reported after Browser 1515. Live testing showed both the Three.js globe lighting and the flat Terminator Map night mask flickering while time was running, with no flicker while paused. Browser 1645 removes the last ordinary-tick presentation re-anchor: the animated solar clock now free-runs continuously at the selected time-compression rate, and the one-second strategic tick only updates the authoritative reference instead of restarting the visual interpolation.

ROOT CAUSE
----------
- Browser 1515 still replaced the presentation clock/anchor whenever an ordinary strategic tick arrived.
- `setInterval`/React commits and `requestAnimationFrame` are not phase-locked, so a tick arriving a few milliseconds early or late could shift the apparent solar phase for one frame.
- At 6h/1d time compression, a few milliseconds correspond to many in-game minutes, making the tiny timing correction visually obvious as a pulse/flash.
- Paused time did not flicker because no tick handoff was occurring.

FREE-RUNNING SOLAR PRESENTATION
-------------------------------
- `geoscapeVisualClockAtElapsed()` no longer clamps its interpolation to one tick interval.
- While time is running, the visual clock advances continuously at `tickMinutes / tickIntervalMs`.
- Ordinary Geoscape ticks now use `tick-observed-no-reanchor`: they update `authoritativeClock` but preserve the original visual `clock` and `anchorMs`.
- The globe lighting and Terminator Map night mask therefore have exactly the same solar phase immediately before and immediately after a normal strategic tick.
- Speed changes still re-anchor, but at the exact currently displayed visual minute so changing speed does not create a jump.
- Pause/resume, load, and explicit strategic time jumps remain intentional re-anchor events.

PRESERVED
---------
- Browser 1345 Three.js globe solar-surface authority and globe/map solar parity remain active.
- Browser 1515 persistent Terminator ImageData/trig fast path, compositor isolation, and stable cloud keys remain active.
- Aircraft dateline shortest routes/world wrap, Simulation AI continuation fixes, tactical radio static, tactical lighting/pathing, and all other gameplay systems are unchanged.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Build Health tests both an early and late ordinary tick at 1d/sec and requires zero presentation-minute discontinuity across the tick.
- Ordinary ticks must preserve the original animation anchor.
- A speed change must begin from the exact visual minute that was already being displayed.
- An isolated helper harness confirmed zero discontinuity across deliberately early and late tick arrivals.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Leave the globe visible for at least 15 seconds at 1m, 30m, 1h, 6h, and 1d. There should be no once-per-second brightness/night-boundary flash.
2. Repeat on the Terminator Map. The night mask should slide continuously through strategic ticks instead of pulsing.
3. Pause time and confirm the solar presentation freezes.
4. Change time speeds while running and confirm the terminator changes velocity without jumping position.

KNOWN TEST LIMITATION
---------------------
A full GPU/WebGL browser verification could not be completed in the container because headless Chromium could not initialize an EGL/ANGLE display. Syntax and isolated clock-continuity validation passed, but the final visual gate should be checked in the normal desktop browser.
