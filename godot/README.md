# Project Aegis Godot 4 Vertical Slice

Native build: `v0.26.07.19.GODOT.0008_BASE_FACILITY_CONSTRUCTION_AND_SPECIALIST_CAPACITY_VERTICAL_SLICE`

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
- Prepaid concurrent construction for Living Quarters, Laboratories, and Workshops using the browser campaign's established $300k, $450k, and $400k costs.
- Three, five, and four-day facility countdowns with operational capacity granted only at completion, three bounded project slots, half-cost cancellation, and exact partial-project persistence.
- Adjustable research staffing bounded by available scientists and Laboratory capacity, with deterministic daily research points and completion reports.
- Base-local Soldier, Scientist, and Engineer hiring orders with established costs, three-day arrival timing, projected capacity reservations, half-refund cancellation, and deterministic recruit identities.
- Ten Engineer spaces per Workshop, including a conservative Workshop migration for native 0001-0005 campaigns that already exposed the Workshop command screen.
- Engineer staffing bounded by local staff and Workshop capacity, with three work points per assigned Engineer at each strategic midnight.
- A bounded prepaid FIFO manufacturing queue for Medkits and research-gated Laser Rifles, including progress, ETA, local-store delivery, overflow work, half-cost cancellation, and exact save persistence.
- Laser Weapons completion unlocking Laser Power Output 1 and queued Laser Rifle production in the Workshop.
- Native JSON save format 4 at `user://project_aegis_godot_save_v4.json`, with imported campaigns isolated at `user://project_aegis_godot_imported_copy_v4.json`.
- In-game Build Health with 58 checks, including bounded tactical-log trimming, the complete air-operation lifecycle, browser-import isolation, personnel arrivals, research unlocks, manufacturing staffing/FIFO/persistence, facility construction/capacity activation, large-list scrolling, and dense strategic marker placement.

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

## Personnel, Research, And Manufacturing

- The Base screen reports living soldiers, scientists, engineers, and total local Living Quarters occupancy.
- Each Living Quarters supports 12 personnel; KIA soldiers do not consume capacity.
- Each Laboratory supports 10 scientists. Research assignment cannot exceed either available scientists or Laboratory capacity.
- Each Workshop supports 10 engineers. Native campaigns created before 0006 receive the Workshop that their existing command screen already represented; imported browser bases preserve their actual facility counts.
- Soldiers cost $120k, Scientists $95k, and Engineers $90k. Pending orders reserve quarters and specialist capacity, arrive after three strategic midnights, and can be cancelled for half cost.
- New soldiers use deterministic recruit records and arrive Ready but unassigned, so they cannot silently displace the current six-seat squad.
- Each assigned scientist contributes 2 research points per strategic day; each project retains its own required-point total.
- Laser Weapons completion releases assigned scientists, unlocks Laser Rifle production, and exposes Laser Power Output 1 as an unstaffed follow-on project.
- The Research screen exposes assignment, daily rate, ETA, progress, unlocked capabilities, completed topics, and a one-day advance when no flight operation is active.
- Workshop orders deduct their full cost when queued. Medkits require 18 work and Laser Rifles require 60 work; each assigned Engineer contributes 3 work per strategic day.
- Only the active FIFO order receives work. Excess midnight output carries into the next order, completed items enter local stores, and an empty queue releases its Engineers.
- Cancelling any queued order returns half its prepaid cost. Queue order, progress, assignment, and deterministic identifiers survive save/reload without changing save format 4.
- Living Quarters cost $300k and take 3 days, Laboratories cost $450k and take 5 days, and Workshops cost $400k and take 4 days. Up to three projects advance concurrently at strategic midnight.
- Pending facilities show future capacity but cannot accept personnel early. Completed facilities add 12 personnel, 10 Scientist, or 10 Engineer spaces locally and immediately refresh hiring limits.
- Cancelling construction returns half its prepaid cost. Construction identity, exact days remaining, base ownership, and funds persist in both native and isolated imported-copy saves.

## Automated Verification

From the repository root:

```powershell
godot --headless --path . --editor --quit
godot --headless --path . --script res://godot/tests/test_runner.gd
```

The test runner covers campaign creation and travel, native save round-tripping, Workshop and personnel migration, hiring cost/capacity reservations, specialist-capacity blocking despite spare quarters, facility costs and concurrent slots, no-early-capacity rules, staggered completion, construction cancellation and partial-save restoration, three-midnight arrivals, deterministic recruits, bounded research assignment, daily research progression/completion, prerequisite inference, follow-on selection, manufacturing research gates, staffing limits, prepaid FIFO progress, overflow, completion, cancellation, partial-order normalization, mid-interception save/resume, deterministic air combat and return service, exact browser-export wrapper parsing, selected-base grid/research/roster/incident normalization, nested soldier stats and identity, six-seat native assignment capacity, source-file preservation, imported-copy round-tripping, dense strategic markers, bounded hex rules, tactical deployment, movement highlighting, three End Turn cycles, civilian contact cost/linking, wall destruction and traversal, and all visible Build Health rows.

Latest verification passes `79/79` native tests and `58/58` visible Build Health rows. Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M at 1440x900 rendered imported Fort Aegis with three partial projects, exact operational/projected capacities, progress bars, refunds, blockers, personnel controls, and the shared day control without horizontal overflow. The player confirmed the complete 0008 construction, capacity activation, cancellation, specialist hiring, persistence, and imported-copy isolation gate passes. The unchanged HTML artifact passes six-of-six inline-script parsing, its static seam checker, localhost first-base/Geoscape smoke, and browser Build Health `272/272` with no runtime errors; only the existing Tailwind production-CDN warning remains.

## Deliberate Limits

- This is a focused vertical slice, not a feature-complete port of the browser campaign.
- The tactical mission is a fixed native sample battlefield rather than the browser game's complete procedural mission catalog.
- Browser import deliberately maps only the compatible vertical-slice subset. Complex browser base layouts, relationships, transfers, queues, multiple aircraft, and browser-only systems remain preserved only in the original browser save.
- Native export presets and release packages are not configured yet.
- Multi-base logistics, soldier relationships, the full research/manufacturing trees, richer aircraft loadouts, and campaign endgame remain in the HTML build.

## Verified Manual Gate

The player confirmed the 0008 gate passes: all three construction costs and slots, no early capacity, exact save/reload countdowns, staggered day 3/4/5 completion, specialist hiring after activation, $150k Living Quarters cancellation refund, and imported-copy source isolation worked as expected.
