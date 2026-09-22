# Incident VIP reports validation

Build: v0.26.09.22.0003_INCIDENT_VIP_COUNTS_AND_INCOMPLETE_REPORTS_PATCH

- Incident creation records population before response selection. Counts derive from incident threat and intrinsic map profile, ignoring response transport size.
- A deterministic quarter of eligible mandatory-rescue incident IDs have incomplete reports. Their stored count is concealed until landing; tracker confirmation changes report knowledge only.
- Existing rescue quotas are unchanged. Legacy matching tactical saves derive population from existing civilians; subsequent migrations preserve the recorded original count despite losses.
- Incident details, Mission Control, and tactical rescue status expose the appropriate briefing or confirmed count.
- Save format remains 4. The preceding automatic backup work is preserved.

## Automated verification
- Six focused runtime tests passed: incident factories; unknown/confirmed briefings; legacy/current tactical population migration; outbound travel persistence; actual deployments with 2/4/8 VIPs and one/two transports; AI Command first-round handoff and campaign migration.
- Full suite before the final AI test was added: 422 checks, 387 passed, 35 failed. Failed test names exactly match the preceding save-recovery baseline (older editor/library failures); no new failing names.
- The final six-test focused suite passed separately.
- Build seam, embedded JavaScript syntax, and git diff whitespace checks passed.

## Live acceptance pending
Computer-use tooling could not initialize in this session (kernel asset write error), so visual/browser acceptance has not been claimed.
1. Open a new campaign and inspect both complete and interrupted rescue reports.
2. Switch between one and two response squads; the briefing count or unknown status should remain unchanged.
3. Save/reload during outbound travel, land, and verify one tracker confirmation with the recorded count.
4. Switch tactical control modes and save/reload; verify population and rescue requirements remain stable.
5. Resume an older tactical save and confirm its existing civilians remain present.
