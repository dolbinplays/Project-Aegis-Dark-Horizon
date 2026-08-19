PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.0015_GEOSCAPE_OVERLAY_SELF_TEST_SCOPE_STARTUP_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Startup hotfix for Browser 2355.

Browser 2355 could crash during launch-time Build Health with:

  ReferenceError: EarthBaseGlobe is not defined

The failure was in the new regression test, not in the player-facing globe renderer itself.

ROOT CAUSE
----------
- geoscapeImperativeCanvasOverlayTickIsolationContractTest() was declared in a scope that cannot directly access EarthBaseGlobe.
- The test executed String(EarthBaseGlobe) while runSelfTests() was running.
- Because that identifier is not available in the test's lexical scope, the self-test threw before the game could finish startup.

HOTFIX
------
- The Browser 2355 persistent-canvas overlay contract now inspects String(AlienResponseCommand) instead of directly referencing EarthBaseGlobe.
- AlienResponseCommand contains the globe/map mount source needed by the contract, so the same architecture can be validated without crossing the lexical-scope boundary.
- Three older Geoscape visual contracts from Browsers 1515, 2045, and 2115 also contained direct String(EarthBaseGlobe) inspections.
- Those older contracts were hardened in the same way to prevent a second startup error later in the self-test chain after the first failure was removed.
- Adds GEOSCAPE_OVERLAY_SELF_TEST_SCOPE_STARTUP_HOTFIX_PATCH.
- The Build Health label now explicitly checks that the persistent-canvas overlay contract is startup-safe.

UNCHANGED
---------
- Browser 2355 persistent transparent canvas command overlays remain enabled.
- Terminator Map compositor solar surface remains enabled.
- Fixed-step cloudless Three.js globe remains enabled.
- Existing dateline route, tactical AI, FPV/TPV ground alignment, backdrop depth, fire/smoke, breach, and other recent systems are unchanged.
- Save format remains 4.

VALIDATION
----------
- Confirmed no pre-AlienResponseCommand Geoscape self-test contract still contains String(EarthBaseGlobe).
- Confirmed the hotfix flag is declared before the affected Build Health contract executes.
- All 6 non-empty embedded JavaScript blocks pass node --check.

MANUAL TEST GATES
-----------------
1. Launch index.html from the same local file:// workflow that produced the reported error.
2. Confirm the start screen appears and there is no EarthBaseGlobe startup exception.
3. Load/start a campaign and open the Geoscape.
4. Resume the Terminator Map / Globe tick-flicker test from Browser 2355.
5. If flicker remains, report it separately; Browser 0015 intentionally fixes startup only and does not claim to resolve the remaining visual flicker.

PREVIOUS BUILD 2355
-------------------
v0.26.08.18.2355_GEOSCAPE_IMPERATIVE_CANVAS_OVERLAY_TICK_ISOLATION_PATCH
