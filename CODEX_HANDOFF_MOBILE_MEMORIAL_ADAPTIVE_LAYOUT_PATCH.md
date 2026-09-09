# CODEX HANDOFF — v0.26.09.09.1453_MOBILE_MEMORIAL_ADAPTIVE_LAYOUT_PATCH

Systematic Mobile · Adaptive pass continued from Browser 1324 and completed the current command-screen sequence with **Memorial / Hall of the Fallen**. This is presentation-only and deliberately preserves Browser 1242 casualty/result authority.

## Implemented
- Added `MOBILE_MEMORIAL_ADAPTIVE_LAYOUT_PATCH` and a dedicated `MobileMemorialScreen`.
- Mobile Memorial owns the fixed phone/tablet command viewport between the existing rails.
- Portrait uses Remembrance Wall index or one selected service record with **Back to wall**; landscape/tablet shows both panes together.
- The Mobile roster consumes `sortedMemorialSoldiers`, `memorialSortKey`, and `setSelectedMemorialSoldierId` rather than creating a second KIA store.
- Compact rows show grayscale portrait, name, missions, kills, and final squad.
- Retired Squad Names remain available with retirement month, total-loss mission, and region.
- Selected detail reuses `SoldierCard`, `memorialServiceSummary`, `MemorialTributeList`, mission/kills/XP counts, squad history, final squad, and recovered-equipment state.
- Standard Memorial is explicitly rendered only outside Mobile and remains unchanged.

## Authority preserved
- Browser 1242: single active `finishAiPlayback`, final buffered battlefield casualty authority, explicit death flags, survivor/KIA reconciliation, committed Tactical Victory precedence.
- Browser 1244 Mobile Missions and Browser 1324 Mobile Reports.
- KIA creation/removal, retired-squad history, tribute data, report data, campaign state, and save format 4.
- The approved Mobile tactical upper-right soldier/fire-team/objective HUD roadmap item is retained and remains the next focused tactical-mobile presentation target.

## Release
Synchronize the repository's existing full `src/manifest.json` with `tools/apply-1453-source-manifest.cjs` after overlaying the package. Do not replace the full manifest with the merge fragment.

## Field gate
Test no-KIA, one-KIA, long-roster, retired-squad, all sort modes, portrait selection/back, landscape/tablet split, tribute inspection, Mobile→Standard parity, and a genuine new mission KIA.

Next focused Mobile target: **Tactical upper-right unit / fire-team / objective HUD**.

