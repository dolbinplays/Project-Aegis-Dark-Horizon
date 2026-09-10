# CODEX HANDOFF — v0.26.09.09.1712_CLASSIC_CRASH_SITE_LAST_KNOWN_CONTACT_TERMINAL_HOTFIX

Browser 1628 passed a limited resolver fixture but the user's real Classic field replay still failed. Do not treat the 1628 fixture as full reproduction: the exported pre-mission save does not by itself prove the same transient response-force selection/random combat path used during the field run. The field report and `0 events retained` clue exposed the remaining terminal branch.

## Remaining defect
A dead alien could retain `aegisLastSeenMarkerActive:true`. `tacticalLastKnownAlienContactMarkers(...)` did not check alien liveness, and `tacticalUpdateAlienContactMemory(...)` could promote an observed contact to a marker after death if no current AEGIS observer saw the corpse. In Classic's zero-alien branch this made terminal authority return `unresolvedLastKnownContact:true`; with no rescue phase left, the one-shot resolver could break and finalize success=false.

## Repair
- `tacticalAlienCanOwnUnresolvedLastKnownContact(...)`: requires alien + HP > 0 + `alive !== false`.
- Marker enumeration, purge, and contact-memory update use that rule.
- Same-round zero-alien terminal evaluation purges dead/invalid contacts before checking mission completion.
- Final one-shot resolution purges once more as a terminal guard.
- Critical Classic resolve loops use `tacticalPlaybackFrameUnitAuthoritativeAlive(...)`.
- `simulateMission(...)` now passes campaign `alienFieldBeaconKnowledge` into `resolveMission(...)`.
- Failure diagnostics identify exact terminal blockers.
- `buildMissionReportEntries(...)` no longer masks `Mission incomplete.` with the generic scattered-alien failure line.
- New Classic reports with no structured timeline state that one-shot simulation did not emit one, instead of claiming they are legacy/pre-archive reports.

## Release-quality correction
The Browser 1517 and 1628 regression test blocks had been appended after the closing `</script>` tag and therefore were inert document text. Browser 1712 moves them inside the executable runtime and chains the new Last Known Contact contract after them.

## Preserve
Do not regress Browser 1242 final-VIP casualty authority, Browser 1517 arrival commit, Browser 1628 reinforcement actor liveness, Mobile Missions/Reports/Memorial, or the queued Mobile upper-right tactical HUD and Classic civilian/VIP/victory-dance roadmap items. Save format stays 4.

