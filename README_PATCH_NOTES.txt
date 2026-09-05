PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.09.05.1245_GEOSCAPE_MOBILE_BROWSER_POINTER_CAPTURE_LIFECYCLE_HOTFIX
Date: September 5, 2026
Save format: 4 (unchanged)
Base build: v0.26.09.04.2004_TACTICAL_AI_PLAYBACK_SEQUENCER_AND_FRAME_PACING_PATCH

SUMMARY
-------
Fixes the mobile-browser Geoscape globe drag error:

NotFoundError: Failed to execute 'releasePointerCapture' on 'Element': No active pointer with the given id is found.

The issue was in the shared globe pointer lifecycle, so it could occur on a phone/tablet in either Standard Interface or Mobile Interface mode.

ROOT CAUSE
----------
The same globe cleanup handler was attached to pointerup, pointerleave, and pointercancel. Mobile browsers can implicitly release pointer capture before one of those later events arrives. The handler then unconditionally called releasePointerCapture(pointerId) a second time, which raises NotFoundError on affected browsers. The game remained playable, but the runtime error overlay persisted.

FIX
---
- Pointer-capture acquisition is now guarded with a race-safe helper.
- Pointer release first checks hasPointerCapture(pointerId) before calling releasePointerCapture(pointerId).
- Release remains wrapped in try/catch to cover a browser lifecycle race between the check and release.
- pointerleave no longer ends the drag while the globe still owns pointer capture; pointerup/pointercancel remain authoritative.
- Duplicate pointerup/pointerleave/pointercancel cleanup is therefore safe and idempotent.
- The fix applies to the common Geoscape globe used by both Standard and Mobile Interface modes.

UNCHANGED
---------
- Globe rotation behavior and drag threshold.
- Click suppression after a globe drag.
- Base/incident/region selection.
- Strategic simulation and time controls.
- Tactical systems.
- Save data and save format 4.
- Assets are unchanged.

VALIDATION
----------
- All five executable runtime JavaScript blocks pass node --check.
- Persistent host-shell JavaScript passes node --check.
- Focused pointer-lifecycle smoke test verifies inactive captures are not released and NotFoundError-style acquisition/release races are contained.
- Host body build ID, host BUILD constant, and runtime CURRENT_GAME_BUILD are synchronized.
- Embedded runtime is byte-for-byte identical to src/browser-runtime.html.
- Embedded runtime byte count: 6600385.
- Embedded runtime SHA-256: 7c3d6ec555bc73fa046860f7dfc848fa7ba03ee5a78a894d48830c49e04daf1e.
- Previous Browser 2004 patch-history entry is frozen and the new build owns the mutable current entry.
- Save format remains 4.

FIELD ACCEPTANCE
----------------
1. On a mobile browser, select Standard Interface and repeatedly drag/rotate the Geoscape globe, including quick drags that end near/outside the globe edge. Confirm no releasePointerCapture NotFoundError appears.
2. Repeat using Mobile Interface.
3. Try interrupted gestures (drag then lift quickly, drag across the edge, browser UI appearing/disappearing, and orientation/viewport changes if practical).
4. Confirm the globe still rotates normally and a drag does not accidentally select a region/incident.
5. Confirm ordinary taps still select the expected Geoscape target.
