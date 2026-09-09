# CODEX HANDOFF — v0.26.09.09.1324_MOBILE_REPORTS_ADAPTIVE_LAYOUT_PATCH

Systematic Mobile · Adaptive pass resumed from Browser 1244. This patch is presentation-only for the Reports command section and deliberately preserves the Browser 1242 terminal casualty/result authority.

## Implemented
- Added `MOBILE_REPORTS_ADAPTIVE_LAYOUT_PATCH` and a dedicated `MobileReportsScreen` adapter.
- Mobile Reports is viewport-bounded between the existing command rails.
- Portrait uses a report index or selected detail with Back to index; landscape/tablet displays index + detail together.
- Index and detail scroll independently. The existing monthly summary/mission report buttons remain the authoritative selection callbacks.
- The existing monthly Council detail, Council slide replay, Mission Action Log, General Reports, and Archived Tactical Timeline are reused rather than reimplemented.
- Post-mission resume still binds to `selectedMissionReportId`; a restored report therefore opens detail automatically in Mobile.
- Long tactical timelines no longer need a nested fixed-height scroll region on Mobile because the entire detail pane is bounded and scrollable.
- Shape guards return the original report content if Standard markup changes later. Standard/Desktop Reports is unchanged.

## Authority preserved
- Browser 1242: one active `finishAiPlayback`, last-buffered-frame terminal commit, explicit `alive:false` casualty authority, survivor/KIA reconciliation, committed Tactical Victory precedence.
- Browser 1244: Mobile Missions / launch confirmation.
- Monthly calculations, funding, mission reports, tactical timeline archive data, Council slides, campaign state, and save format 4 are unchanged.

## Release
Synchronize the repository's existing full `src/manifest.json` with `tools/apply-1324-source-manifest.cjs` after overlaying the package. Do not replace the complete manifest with the small merge file.

## Field gate
Test portrait index→monthly detail→Back, index→mission detail→Back, a long tactical timeline, post-mission direct restore to the new report, landscape/tablet split view, Council slide replay, and Standard/Desktop parity.

Next systematic Mobile target: Memorial.
