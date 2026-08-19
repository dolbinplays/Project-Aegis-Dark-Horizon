PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.18.2345_COMPOSITOR_TERMINATOR_SCOPE_STARTUP_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the Browser 2315 startup crash:

  ReferenceError: TickStableCompositorTerminatorSolarSurface is not defined

The Browser 2315 Terminator Map renderer was implemented in the wrong lexical scope. TerminatorGeoscapeMap is a top-level component, but the TickStableCompositorTerminatorSolarSurface memoized component and its helper functions were declared inside AlienResponseCommand. When React rendered the top-level map, that identifier did not exist in the map component's scope.

STARTUP SCOPE FIX
-----------------
- Adds a dedicated globally scoped compositor Terminator Map component before TerminatorGeoscapeMap is declared.
- TerminatorGeoscapeMap now mounts TickStableCompositorTerminatorSolarSurfaceGlobal explicitly.
- The global renderer retains the Browser 2315 design:
  - static opaque 2D ocean/land/grid base;
  - separate repeating night/twilight mask;
  - Web Animations compositor movement;
  - playback-rate changes for Geoscape time speed;
  - ordinary running strategic ticks do not directly reposition the mask;
  - paused clock changes may re-anchor the mask deliberately.
- Browser 2315's fixed-step cloudless Three.js globe remains unchanged.
- Dateline shortest-route/world-wrap behavior is unchanged.
- Browser 1945 FPV/TPV ground alignment and Browser 1845 perspective backdrop depth fix are unchanged.
- Tactical AI, fire/smoke, breach, lighting, and other gameplay systems are unchanged.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Adds GEOSCAPE_COMPOSITOR_TERMINATOR_SCOPE_STARTUP_HOTFIX_PATCH.
- Adds geoscapeCompositorTerminatorScopeStartupContractTest(), which requires the globally visible compositor component and verifies that TerminatorGeoscapeMap mounts it.
- Static ordering verification confirms the global compositor authority is declared before TerminatorGeoscapeMap and before AlienResponseCommand mounts.
- All 6 non-empty embedded JavaScript blocks pass node --check.

MANUAL TEST GATES
-----------------
1. Launch the browser build and confirm the start screen appears without a runtime error.
2. Start or load a campaign and enter the Geoscape.
3. Switch to Terminator Map and confirm it renders instead of throwing TickStableCompositorTerminatorSolarSurface is not defined.
4. Switch Globe <-> Terminator Map several times.
5. Resume the Browser 2315 live flicker test at 1h, 6h, and 1d speeds.

IMPORTANT
---------
Browser 2345 is deliberately a startup hotfix. It fixes the component-scope crash that prevented Browser 2315 from being tested. It does not claim that the still-under-investigation tick-linked Geoscape flicker is resolved.

PREVIOUS BUILD 2315
-------------------
v0.26.08.18.2315_COMPOSITOR_SOLAR_DECOUPLE_AND_FIXED_STEP_GLOBE_PATCH

Browser 2315 moved the flat-map day/night presentation onto a static 2D Earth plus a compositor-driven repeating night/twilight mask and changed the globe to a bounded fixed-step, cloudless Three.js solar renderer. Its purpose was to decouple the visible solar presentation from the once-per-second strategic simulation tick. Browser 2345 preserves that architecture and only repairs the startup scope error discovered in live testing.
