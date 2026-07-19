# Project Aegis Godot 4 Vertical Slice

Native build: `v0.26.07.18.GODOT.0005_BASE_PERSONNEL_AND_RESEARCH_STAFFING_VERTICAL_SLICE`

This is a native Godot 4 vertical slice alongside the verified HTML game. It does not wrap `index.html`, replace the browser build, or write to the browser campaign save.

## Open And Run

1. In Godot Project Manager, choose **Import**.
2. Select the repository's `project.godot` file.
3. Open the project and press **F6** or the Run Project button.

The project uses the repository root so the native slice can reuse the existing `assets/` directory without duplicating media.

## Included Slice

- Start command screen and first-base region selection.
- Native campaign state, six-soldier roster, funds, clock, reports, research, workshop, squads, missions, and basic base status.
- Clickable strategic map with two opening incidents and Skyranger outbound travel.
- Clickable tracked UFO contact with Cautious, Standard, and Aggressive interception postures.
- Saber One outbound travel, deterministic bounded air combat, return, repair/refuel/rearm service, combat reports, and crash-site generation.
- Native 20x14 hex tactical incident with terrain, six soldiers, aliens, civilians, a Skyranger and nine-cell rear ramp, connected walls, cover, TU movement, rifle attacks, alien turns, and mission resolution.
- Civilian contact for 8 TU, up to four followers per escort, single-file trail following, panic/recontact behavior, and mandatory ramp extraction.
- Destructible wall cells that become nonblocking rubble for every tactical mover.
- Read-only browser campaign export selection, compatibility review, and subset normalization into a separate native imported-copy slot.
- Base-local personnel occupancy with 12 staff per Living Quarters, 10 scientists per Laboratory, live overflow feedback, and repeated imported facility counts.
- Adjustable research staffing bounded by available scientists and Laboratory capacity, with deterministic daily research points and completion reports.
- Native JSON save format 4 at `user://project_aegis_godot_save_v4.json`, with imported campaigns isolated at `user://project_aegis_godot_imported_copy_v4.json`.
- In-game Build Health with 36 checks, including bounded tactical-log trimming, the complete air-operation lifecycle, browser-import isolation, local personnel capacity, research staffing, large-list scrolling, and dense strategic marker placement.

## Tactical Controls

- Click a blue soldier to select them.
- Click a highlighted hex to move using the bounded reachable-cell flood and pathfinder.
- Move adjacent to a civilian and click them to spend 8 TU and begin escorting.
- Lead escorted civilians through the rear ramp cells to extract them.
- Click a revealed alien in rifle range to fire.
- Click an intact wall in rifle range to damage it; destroyed wall rubble is traversable.
- Use **End Turn** to run the alien phase and refresh soldier TU.

## Air Interception Controls

- Click the gold UFO marker to select the tracked contact.
- Choose Cautious, Standard, or Aggressive before launching Saber One.
- Use **Advance 10 Minutes** to progress outbound travel, combat, and return.
- Save while outbound to verify exact route and progress continuity.
- After return, advance the Geoscape clock until Saber One finishes service.
- Open the generated Scout Crash Site from Mission Control.

## Browser Save Import

1. In the HTML game, open the Backup Manager and export the current campaign or one individual save slot.
2. On the native start screen, choose **Import Browser Save** and select the downloaded `.project-aegis-save.json` file.
3. Review the source build, campaign date, selected base, roster count, incident count, and compatibility notes before confirming.
4. Continue the imported campaign as a native copy. The browser export is opened read only, the regular native campaign is not replaced, and later saves stay in the separate imported-copy slot.
5. Use **Load Imported Copy** on later launches to resume it.

## Personnel And Research

- The Base screen reports living soldiers, scientists, engineers, and total local Living Quarters occupancy.
- Each Living Quarters supports 12 personnel; KIA soldiers do not consume capacity.
- Each Laboratory supports 10 scientists. Research assignment cannot exceed either available scientists or Laboratory capacity.
- Each assigned scientist contributes 2 research points per strategic day; each project retains its own required-point total.
- The Research screen exposes assignment, daily rate, ETA, progress, and a one-day advance when no flight operation is active.

## Automated Verification

From the repository root:

```powershell
godot --headless --path . --editor --quit
godot --headless --path . --script res://godot/tests/test_runner.gd
```

The test runner covers campaign creation and travel, native save round-tripping, legacy personnel migration, local facility capacity, bounded research assignment, daily research progression/completion, mid-interception save/resume, deterministic air combat and return service, exact browser-export wrapper parsing, selected-base grid/research/roster/incident normalization, nested soldier stats and identity, six-seat native assignment capacity, source-file preservation, imported-copy round-tripping, dense strategic markers, bounded hex rules, tactical deployment, movement highlighting, three End Turn cycles, civilian contact cost/linking, wall destruction and traversal, and all visible Build Health rows.

Latest verification passes `50/50` native tests and `36/36` visible Build Health rows. Hardware OpenGL smoke at 1440x900 also verifies native/imported Base and Research layouts, including the current browser export's `170/180` research-point state.

## Deliberate Limits

- This is a focused vertical slice, not a feature-complete port of the browser campaign.
- The tactical mission is a fixed native sample battlefield rather than the browser game's complete procedural mission catalog.
- Browser import deliberately maps only the compatible vertical-slice subset. Complex browser base layouts, relationships, transfers, queues, multiple aircraft, and browser-only systems remain preserved only in the original browser save.
- Native export presets and release packages are not configured yet.
- Multi-base logistics, soldier relationships, the full research/manufacturing trees, richer aircraft loadouts, and campaign endgame remain in the HTML build.

## Manual Test Gate

Load a new or existing native campaign and confirm the Base screen begins at 11/12 local personnel with six soldiers, five scientists, and no engineers. On Research, change the assignment and confirm the daily rate and ETA update; advance one day and verify progress changes by 2 research points per assigned scientist. Re-import a browser campaign to confirm repeated Living Quarters/Laboratory counts, personnel totals, required research points, assigned scientists, save/reload, and the isolated imported-copy slot remain correct.
