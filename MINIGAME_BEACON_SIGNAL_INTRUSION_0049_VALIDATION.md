# Minigame Framework + Beacon Signal Intrusion — 0049

Build: `v0.26.10.04.0049_MINIGAME_FRAMEWORK_AND_BEACON_SIGNAL_INTRUSION_PATCH`
Save format: `4`

## Contract
- Manual researched Beacon hacks enter Signal Intrusion; AI remains on the established resolver.
- Puzzle has four attempts and returns exact phase + total resonance feedback.
- Attempt 1 success refunds 4 TU; attempt 2 refunds 2 TU; attempts 3-4 refund 0 TU.
- Auto Resolve uses the established 16-TU successful hack.
- Pale Commander badge override bypasses the minigame and remains 8 TU.
- Four failed guesses spend 16 TU and do not disable the Beacon.
- Abort before any guess spends 0 TU.
- Existing reinforcement cancellation and Beacon disable authority are reused on success.
- Save format remains 4.

## Automated checks
- All five executable embedded runtime JavaScript blocks pass `node --check`.
- `service-worker.js` passes `node --check`.
- Embedded runtime bytes and SHA-256 match `src/browser-runtime.html` and release metadata exactly.
- Deterministic helper fixture passes: identical seed produces identical puzzle, ten unique candidate signatures include the target, exact feedback returns 5/5 phase + resonance, and the rules expose four attempts with 4/2 TU early-solve refunds.
- Static integration checks confirm the manual player path calls Signal Intrusion, Pale Commander badge bypass remains direct, AI still calls the established Beacon resolver, Browser 0050/0051 roadmap entries are present, and save format remains 4.

## Field acceptance
1. Research Alien Beacon Interface Protocols, confirm Beacon function, move a soldier to a legal adjacent interface position, and choose Hack Beacon.
2. Verify the intrusion overlay is usable by mouse and touch, feedback changes after guesses, and Abort is available only before a committed guess.
3. Solve on attempt 1 and 2 and verify the 4/2 TU refunds relative to the normal 16-TU action. Solve on attempts 3-4 and verify no refund.
4. Exhaust all four attempts and verify 16 TU is spent but the Beacon remains active and can be attempted again later.
5. Use Auto Resolve and verify the pre-0049 16-TU successful disable behavior.
6. Carry a Pale Commander badge and verify Badge Override still disables directly for 8 TU without opening Signal Intrusion.
7. Confirm successful disable still collapses the shield, cancels pending reinforcement transit, and satisfies existing objective/mission-completion rules.
8. Run Simulation/Hybrid AI and verify AI Beacon hacking does not open or depend on the player minigame.
