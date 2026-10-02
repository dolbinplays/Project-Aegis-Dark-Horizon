# Early Tactical Hydration 0046 Validation

Build: `v0.26.10.02.0046_EARLY_TACTICAL_HYDRATION_COMPATIBILITY_HOTFIX`  
Save format: `4`

## Regression fixed

A Browser 0042 cached tactical state could hydrate before the later seasonal patch block registered `seasonalHalloweenMapDecorations`, producing `seasonalHalloweenMapDecorations is not a function` after 0045 guarded only the outer 0044 helper.

## 0046 authority

- When `cachedBattleState.covers` exists, those saved covers are authoritative during the initial React state hydration.
- No late seasonal helper is required in that cached-save branch.
- `tacticalRestoreMissingBuildingPerimeterAuthority` is optional and wrapped in `typeof` + `try/catch`.
- If any optional repair helper is unavailable or throws, hydration returns the saved covers and continues.
- Fresh tactical initialization may still use `tacticalPrepareMissionCovers0044` when available, also guarded by `try/catch`.
- Save format remains 4.
