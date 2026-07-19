# Project Aegis Godot 4 Vertical Slice

Native build: `v0.26.07.19.GODOT.0006_PERSONNEL_ARRIVALS_AND_RESEARCH_UNLOCK_VERTICAL_SLICE`

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
- Base-local Soldier, Scientist, and Engineer hiring orders with established costs, three-day arrival timing, projected capacity reservations, half-refund cancellation, and deterministic recruit identities.
- Ten Engineer spaces per Workshop, including a conservative Workshop migration for native 0001-0005 campaigns that already exposed the Workshop command screen.
- Laser Weapons completion unlocking Laser Power Output 1 and state-owned Laser Rifle production in the Workshop.
- Native JSON save format 4 at `user://project_aegis_godot_save_v4.json`, with imported campaigns isolated at `user://project_aegis_godot_imported_copy_v4.json`.
- In-game Build Health with 44 checks, including bounded tactical-log trimming, the complete air-operation lifecycle, browser-import isolation, personnel arrivals, research unlocks, manufacturing authorization, large-list scrolling, and dense strategic marker placement.

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
- Each Workshop supports 10 engineers. Native campaigns created before 0006 receive the Workshop that their existing command screen already represented; imported browser bases preserve their actual facility counts.
- Soldiers cost $120k, Scientists $95k, and Engineers $90k. Pending orders reserve quarters and specialist capacity, arrive after three strategic midnights, and can be cancelled for half cost.
- New soldiers use deterministic recruit records and arrive Ready but unassigned, so they cannot silently displace the current six-seat squad.
- Each assigned scientist contributes 2 research points per strategic day; each project retains its own required-point total.
- Laser Weapons completion releases assigned scientists, unlocks Laser Rifle production, and exposes Laser Power Output 1 as an unstaffed follow-on project.
- The Research screen exposes assignment, daily rate, ETA, progress, unlocked capabilities, completed topics, and a one-day advance when no flight operation is active.

## Automated Verification

From the repository root:

```powershell
godot --headless --path . --editor --quit
godot --headless --path . --script res://godot/tests/test_runner.gd
```

The test runner covers campaign creation and travel, native save round-tripping, Workshop and personnel migration, hiring cost/capacity reservations, specialist-capacity blocking despite spare quarters, cancellation refunds, three-midnight arrivals, deterministic recruits, bounded research assignment, daily research progression/completion, prerequisite inference, follow-on selection, Laser Rifle manufacturing authorization, mid-interception save/resume, deterministic air combat and return service, exact browser-export wrapper parsing, selected-base grid/research/roster/incident normalization, nested soldier stats and identity, six-seat native assignment capacity, source-file preservation, imported-copy round-tripping, dense strategic markers, bounded hex rules, tactical deployment, movement highlighting, three End Turn cycles, civilian contact cost/linking, wall destruction and traversal, and all visible Build Health rows.

Latest verification passes `61/61` native tests and `45/45` visible Build Health rows. Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M at 1440x900 verifies the personnel queue, completed-research pipeline, and unlocked Workshop layouts without clipping or horizontal overflow. The unchanged HTML artifact also passes six-of-six inline-script parsing, its static seam checker, localhost Geoscape smoke, and browser Build Health `272/272` with no runtime errors.

## Deliberate Limits

- This is a focused vertical slice, not a feature-complete port of the browser campaign.
- The tactical mission is a fixed native sample battlefield rather than the browser game's complete procedural mission catalog.
- Browser import deliberately maps only the compatible vertical-slice subset. Complex browser base layouts, relationships, transfers, queues, multiple aircraft, and browser-only systems remain preserved only in the original browser save.
- Native export presets and release packages are not configured yet.
- Multi-base logistics, soldier relationships, the full research/manufacturing trees, richer aircraft loadouts, and campaign endgame remain in the HTML build.

## Manual Test Gate

Load the native campaign that passed 0005 and confirm Base now shows one Workshop with 10 Engineer spaces while preserving 11/12 occupied quarters. Before filling the final quarters slot, hire and cancel one Scientist, then hire and cancel one Engineer; confirm each half-cost refund. Recruit one Soldier, confirm the $120k deduction and 12/12 projected occupancy, advance two days and verify the order remains pending, then save/reload and advance the third day. Confirm the named recruit appears Ready but unassigned. In the imported Fort Aegis copy, confirm its five spare quarters allow a Soldier order while Scientist and Engineer remain correctly blocked by their full 10/10 Laboratory and Workshop. Complete Laser Weapons, open Laser Power Output 1, and build one $180k Laser Rifle from Workshop. Save/reload and verify the completed topic, unlock, follow-on progress, personnel queue, funds, and local stores persist.
