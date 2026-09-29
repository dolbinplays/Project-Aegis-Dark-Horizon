# Principal rescue and large-battle performance — September 28 Browser 0007

## Mission foundation

Routine mission generation from month 3 has a deterministic one-in-eight chance of a principal mission. Existing incident records are not retrofitted. A mission stores a named fictional senior scientist and stable principal ID before deployment, with three known VIPs total. Manual and AI creation use the same principal fields; explicit snapshot fields retain required/high-value markers. Save format remains 4.

Principal extraction is the primary victory condition even with live aliens or inbound reinforcements. Death, explicit permanentlyUnrecoverable state or missing principal data fails it; a temporary route blockage is not silently declared permanent. Optional rescues cannot substitute for the principal. Returning survivors may already be aboard the craft. Pending playback still defers presentation/finalization. AI stops advancing an already resolved principal mission and skips further alien turns after resolution.

Automatic unclaimed rescue assignment prefers the principal, without overriding explicit player orders or stealing an active escort. Higher established medical/combat doctrines are retained. Briefing states the exact rule and principal name; marker reads PRINCIPAL. Failure notices identify the principal. Report sections and event entries include primary state and optional rescues, including when a terminal log already exists. Partial optional rescue credit survives failure. Generation adds a 150k premium; person rescue credit is 40k, and successful principal completion adds 200k.

Armed security, cinematic briefing, bespoke sites, diplomacy and new capture/hack objectives are not in this foundation.

## Large-battle profiling

Ran node --cpu-prof tools/profile-large-battle.cjs against a real seeded tactical deployment and three streamed AI planning rounds: 48 soldiers, 6 VIPs, 8 aliens, 378 covers. Each round retained all 62 unit records and produced 38/50/49 playback frames before and after. Profile files are on E: under PADH GPT Files/character-performance.

The profile showed repeated footprint expansion in fire/smoke cell queries. The patch checks hazard eligibility first, then geometry. It adds no hazard cache and retains in-place ignition, smoke and destruction changes immediately. Regression compares old and new calculations across cells, multi-cell footprints and mutations, and verifies 378 non-hazard props cause zero occupancy queries.

| Round | Before ms | After ms |
| --- | ---: | ---: |
| 1 | 40078 | 30517 |
| 2 | 63452 | 45866 |
| 3 | 62613 | 46404 |

Indicative single profiled runs on this machine, approximately 24–28% faster. Other tests overlapped part of the after run; timings are not a controlled hardware benchmark. These are planning/stream-processing timings, not GPU frame times. Long planning pauses still remain. Full installed-game camera, equipment, night and boarding validation has not been completed; no smooth-FPS claim is made.

## Verification

New tests cover generation timing, identity/save stability, briefing, mandatory versus optional outcomes, loss/missing records, playback gating, already-boarded survivors, manual finalization, debrief retention, automatic priority and a real AI stream handoff followed by principal-loss finalization. Build Health includes a principal objective contract. Existing incident, terminal victory, failure notice, rescue commitment and AI handoff tests are included. The terminal-victory test harness now loads the new objective dependencies. Also repaired the stale Build Health assertion that expected only the pre-wardrobe VIP colors.

Live end-to-end installed campaign acceptance remains pending. Full repository suite not rerun.

Final results: all 62 targeted tests passed. Packaging, build seam, embedded JavaScript syntax and whitespace checks passed. Packaged index.html launched to the correct 0007 title screen in a fresh headless Edge profile with no page errors; this is startup smoke coverage, not live mission acceptance.
