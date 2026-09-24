# VIP-Only Briefing Counts

Build: v0.26.09.24.0003_VIP_ONLY_BRIEFING_COUNTS_PATCH

Mission records now separate actual incidentVipCount from ordinary incidentCivilianCount with an additive incidentRescueCountVersion marker. Their sum retains the original spawn population. Existing save format remains 4. Civilian-assistance incidents report zero VIPs; mandatory rescue incidents retain their established default VIP population. This patch does not introduce additional civilians or change rescue quotas/rewards.

Legacy active battles classify stored units by VIP identity flags, including dead or rescued units. Explicit false flags preserve ordinary civilian identity. Completely unmarked legacy units fall back to the existing mission classification. Without stored unit identities, migration can only infer the existing mission-type classification. Once normalized, original counts do not shrink when units die, extract, or disappear from a later snapshot.

Mission-list, active-mission and aircraft-travel copies retain both counts. Manual and AI generation use total population and separate VIP identity. Explicit identities survive AI handoff, including partially classified rosters. Standard and adaptive planning use the same briefing function. Unknown reports remain concealed until tracker contact.

Validation: 13 focused incident/briefing tests pass, including real first-round AI handoff and population placement. Full regression run: 475 tests, 440 pass, 35 fail; failure names match the prior baseline, with no new failures. Final packaged-runtime identity, build seams, embedded JavaScript syntax and whitespace checks pass. Full-run logs are stored on E: under PADH GPT Files/vip-counts. Live gameplay/visual verification remains pending.
