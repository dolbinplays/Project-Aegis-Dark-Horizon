PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.1345_THREE_GLOBE_SOLAR_SURFACE_AUTHORITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the remaining mismatch between the Geoscape globe and flat Terminator Map. The globe itself was never transparent; the visual problem came from a second opaque SVG Earth presentation drawn above the actual Three.js sphere. That SVG layer included its own screen-space circular night mask, so the visible shadow could resemble a far-side night shadow showing through the Earth. Browser 1345 removes that duplicate visible surface/terminator and makes the real opaque Three.js sphere the sole visible Earth surface. The same subsolar point already used by the flat Terminator Map now directly drives the globe lighting.

THREE.JS GLOBE IS NOW THE VISIBLE EARTH AUTHORITY
-------------------------------------------------
- The Three.js ocean sphere remains fully opaque (`transparent:false`, `opacity:1`) with depth testing/writing and front-side rendering.
- Three.js land geometry remains slightly above the ocean sphere and uses front-side depth-tested materials.
- The SVG command layer no longer paints an opaque ocean disc, duplicate landmass fills, duplicate gloss, or `SmoothGeoscapeGlobeTerminator`.
- The SVG layer remains available for interaction and UI overlays such as markers, range/ferry lines, selection feedback, clouds, and command presentation.
- Background SVG stars are excluded from the globe disc so they cannot appear to shine through the now-visible WebGL Earth.

GLOBE / TERMINATOR MAP SOLAR PARITY
-----------------------------------
- `geoscapeSubsolarPoint()` is the common solar authority for both views.
- The flat map continues evaluating day/night from each map location relative to that subsolar latitude/longitude.
- The globe transforms the same subsolar point into the current camera-centered spherical frame and positions the Three.js directional light along that vector.
- A region's solar state is therefore tied to the strategic clock and its real longitude/latitude, not to the screen-space position of a 2D shadow circle.
- Rotating/focusing the globe changes the visible geography while the solar direction remains physically consistent.
- The far hemisphere cannot contribute a separate visible night overlay.

LIGHTING READABILITY
--------------------
- Whole-globe light intensity is no longer brightened/dimmed from a separate day/night readout.
- The visible terminator is produced by the surface normal relative to the shared solar vector.
- Ambient illumination is intentionally low but nonzero so the night hemisphere remains readable without looking self-lit.
- Back lighting is reduced to a very faint rim contribution rather than materially illuminating the night hemisphere.

PRESERVED SYSTEMS
-----------------
- Browser 1245 AI stream recovery remains active.
- Browser 1245 flat Terminator Map interpolation/flash fix remains active.
- Browser 1115 dateline-shortest aircraft routing remains active.
- Browser 1055 flat-map world wrapping and stronger tactical radio static remain active.
- Tactical systems, mission rules, save data, and save format are unchanged.

REGRESSION COVERAGE
-------------------
- Build Health requires Three.js to be the visible surface authority and `geoscapeSubsolarPoint` to be the solar authority.
- The SVG terminator and duplicate surface opacity must be zero.
- A direct solar-parity test requires the projected subsolar point to align with the Three.js sun vector and its antipode to point exactly away.
- The globe mount exposes data diagnostics showing Three.js surface authority and far-side night overlay disabled.
- All six non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Compare the flat Terminator Map and globe at the same paused time. Day and night regions must match.
2. Rotate/focus the globe while paused. The solar boundary must stay tied to the Sun/strategic clock rather than the screen.
3. Run every Geoscape time speed and confirm the globe and map boundaries move in the same direction and remain synchronized.
4. Confirm no stars or second circular shadow appear inside the globe disc/night hemisphere.
5. Confirm globe drag, wheel zoom, placement clicks, base/incident markers, UFOs, aircraft, range rings, and ferry overlays still work.

PREVIOUS BUILD 1245
-------------------
Browser 1245 fixed the streamed Simulation AI `Assignment to constant variable` continuation failure, preserved Retry AI Continuation recovery, removed the approximately once-per-second flat Terminator Map flash, and unified the mathematical subsolar point used by the flat map and Three.js globe. Browser 1345 completes that visual unification by removing the duplicate SVG Earth/terminator layer that was still obscuring the actual Three.js result.
