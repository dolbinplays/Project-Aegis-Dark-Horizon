# AI Reliability and Standing Order Resumption — 0048

The 0040 suspension path restored standing orders when the player explicitly reset an objective, but extraction cleanup did not automatically resolve a completed civilian assignment. The generic completion reset also only preserved active orders, discarding suspended ones. Both paths now preserve the intended route/post and reset resolved objectives. Unknown targets and unfinished escort groups remain active. Prior playback objects are not mutated.

## Automated release gate

Run `node tools/package-runtime-shell.cjs`. Before writing release artifacts, it runs seven runtime suites covering normal/editor startup, missing dependencies, an embedded reduced 0042 failed mission save, diagnostics export, streamed AI, hidden escorts, principal/beacon completion, VIP priority locks, and standing-order resumption. No private Downloads path is required. A failed test or changed runtime source stops packaging.

`tools/test-order-resumption-runtime.cjs` covers Patrol, Fallback Post, and Check Location, combat and medical priority overrides, actual post-combat AI movement, serialized rescue state, partial escort groups, cancellation, replacement orders, and immutable earlier playback snapshots. Check Location remains one-shot; completed/cancelled commands are not resurrected.

## Field acceptance

1. Select a patrol route or fallback post in Orders, fight a contact, and verify movement returns to the chosen order once higher-priority duties are clear.
2. Assign a VIP/civilian objective, save/reload while escorting, and extract the whole group. Verify the original waypoint/post resumes. Repeat with Check Location.
3. While escorting, cancel or replace the standing order; verify the old route does not return.
4. Open Orders/pause and check the AI status. Export AI Diagnostics from the playback banner and verify the JSON includes round, error (if any), team orders, and escort IDs.

This patch detects missing helpers and reports existing failure/pause state; it does not infer a stall solely from elapsed wall-clock time. Browser UI field acceptance remains pending. Save format 4 is unchanged.
