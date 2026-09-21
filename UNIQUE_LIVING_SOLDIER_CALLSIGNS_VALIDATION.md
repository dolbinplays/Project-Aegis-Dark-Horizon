# Unique living-soldier callsigns — validation

Build: `v0.26.09.20.0003_UNIQUE_LIVING_SOLDIER_CALLSIGNS_PATCH`

Save format remains 4. Changes are local; no commit or deployment was made by the agent.

## Behavior

- Callsigns belong to one living soldier across the campaign, regardless of base or availability.
- Comparisons ignore case, leading/trailing whitespace and repeated internal whitespace; display input retains the existing 22-character limit and removes quotation marks.
- Manual edits report the current owner. Changing or clearing a name releases it. Wounded, unconscious, hospitalized, downed and missing soldiers still reserve names, including at zero health. Only the game's confirmed KIA status releases a casualty's reservation.
- Mission award batches reserve each new callsign immediately and release confirmed mission casualties before assigning survivor names. Historical memorial callsigns are preserved.
- Randomization avoids both occupied names and the soldier's current name. Exhausted pools receive available numbered suffixes.
- New recruits still begin unnamed. Initial roster and recruitment boundaries share the repair helper for future generated names.
- Legacy/imported campaigns preserve the first living owner in saved roster order. Later duplicates receive the lowest available suffix, without taking an existing numbered callsign. Repairs appear in the campaign report. Migration does not mutate its input and repeated save/load cycles do not rename soldiers again or repeat the report.

## Automated results

- All 12 focused nickname tests pass against the canonical runtime. Coverage includes cross-base manual conflicts, normalized input, every recoverable state, KIA reuse, clear/blank behavior, length-limit collisions, deterministic duplicate repair, full campaign migration, save round trips, existing suffixes, random pool exhaustion across 220 soldiers, 70 mission awards, recruits and two manual claims before a React rerender.
- The full repository sweep reports **389 checks: 354 passed, 35 failed**. The previous patch documented 377 checks: 342 passed, 35 failed. Remaining failures are in older editor/library tests (historical build expectations, missing historical fixtures and existing geometry/runtime assumptions). The suite is not fully green; no tests were disabled or skipped.
- Build identity/source-payload consistency, embedded JavaScript syntax and diff whitespace checks pass.
- Existing full-runtime streamed AI and application hook/menu smoke tests pass in the full sweep.

Reproduce:

```powershell
node --test tools/test-unique-soldier-callsigns.cjs
node tools/check-aegis-build.cjs
node tools/check-embedded-js.cjs
$nicknamePatchTests = @(rg --files tools -g 'test-*.cjs')
node --test --test-concurrency=4 @nicknamePatchTests
```

## Field acceptance remaining

Automated tests are headless. Live browser interaction and physical-device acceptance were not performed for this patch.

1. Give a living soldier Ghost. Try ghost and padded Ghost on another soldier, including at another base; verify the owner appears in the rejection message.
2. Change the owner's casing, clear the name, and reuse it. Verify wounded/hospitalized/recoverable soldiers retain reservations.
3. Randomize several soldiers; complete a mission awarding several callsigns. Check for uniqueness. After confirmed KIA, reuse the name and verify the memorial retains its original name.
4. Load/import a duplicate campaign containing Ghost, ghost and Ghost 2. Verify the first owner and Ghost 2 remain unchanged, the duplicate becomes ghost 3, and the campaign report explains the repair.
5. Save/export, reload/import, and verify IDs, progress and repaired names persist without another repair notice.

Fire TV Performance & Field-Test Fixes remains the next separate patch.
