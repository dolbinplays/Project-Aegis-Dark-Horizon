Alien Response Command / Project Aegis
Patch: v0.26.07.10.0101_INTERCEPTOR_FERRY_STAGED_REACH_REFERENCE_FIX_INDEX_ONLY_PATCH

Purpose:
- Fix startup-blocking runtime error: interceptorFerryStagedReachRecognitionTest is not defined.
- Add the missing Build Health regression test constant instead of removing the Build Health rows.
- Preserve the interceptor ferry-staged reach recognition feature and related Build Health coverage.

Validation performed:
- Extracted all inline scripts from index.html.
- Ran node --check against every non-empty inline script.
- Ran a static scan for missing *Test identifiers in the main game script; none remained except Three.js material option property depthTest, which is not a Build Health test identifier.

Browser note:
- Please open index.html locally and confirm the start screen renders, then run the in-browser Build Health panel.
