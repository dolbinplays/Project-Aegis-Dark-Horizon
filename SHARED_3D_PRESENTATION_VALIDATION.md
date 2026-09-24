# Shared 3D Color and Brightness validation

Build: v0.26.09.24.0004_SHARED_3D_COLOR_AND_BRIGHTNESS_PATCH

The existing sliders apply to Iso, FPV, TPV and incoming-fire cameras. Preference keys and defaults remain compatible. Brightness scales each camera's existing night/twilight presentation; 100% restores its baseline, and daylight brightness is unchanged. No tactical rules are modified.

Automated verification:
- Five focused tests cover existing Build Health contracts, noncompounding color across cameras, brightness in night/twilight/day, preference reload/reset, material restoration and unchanged local-light range/intensity relative to the same camera baseline.
- Build seam and embedded JavaScript syntax checks pass.
- Packaged index.html is generated from the canonical runtime; service worker cache advanced to v25.

Live visual playtest remains pending: change both sliders during a night mission, switch Iso/FPV/TPV, check incoming-fire view, reset to 100%, and reload the game. Repeat during twilight and daylight; verify daylight brightness remains unchanged.

Full regression run: 480 tests, 445 passed, 35 failed. All 35 failure names match the preceding VIP-counts baseline; no new failures. Log: E:/JoshGameProjects/GitHub/PADH GPT Files/shared-3d-controls/regressions.txt.
