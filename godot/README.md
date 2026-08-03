# Project Aegis Godot 4 Vertical Slice

Native build: `v0.26.08.02.GODOT.0021_VIP_PRIORITY_GUARDS_VISIBILITY_AND_BUILDING_DENSITY_VERTICAL_SLICE`

Paired browser build: `v0.26.08.02.0151_TACTICAL_VIP_PRIORITY_GUARDS_CAMERA_VISIBILITY_AND_BUILDING_DENSITY_PARITY_PATCH`

This is a native Godot 4 vertical slice alongside the verified HTML game. It does not wrap `index.html`, replace the browser build, or write to the browser campaign save.

Gameplay additions now follow a paired browser/Godot parity policy. Platform-specific presentation may differ, but player-facing rules, ownership, save migration, and bounded simulation outcomes must ship together or be explicitly recorded as a temporary exception.

The browser's multi-base aircraft ferry network is currently an explicit temporary exception: the native vertical slice does not implement multi-base ferry routing yet, so browser hangar occupancy and route fixes remain reference behavior for that later port.

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
- Native Small 20x14, Medium 26x18, and Large 32x22 hex tactical incidents with scaled civilian capacity, terrain, soldiers, aliens, connected walls, cover, TU movement, rifle attacks, alien turns, and mission resolution.
- One Skyranger and nine-cell rear rescue ramp per dispatched squad, with each squad formed beside its own ramp and every craft separated from buildings.
- Playable-perimeter guards shared by neighbors, paths, movement, AI, and deployment prevent units from entering or walking beyond map-edge cells.
- Civilian contact for 8 TU, up to four followers per escort, single-file trail following, panic/recontact behavior, and mandatory ramp extraction.
- Mandatory-rescue civilians carry periodic VIP tracker pulses. Once aliens are eliminated, AI searchers split across distinct tracker contacts, unexplored building interiors, and unexplored map sectors while established escorts continue to the ramp.
- An unengaged soldier gives a visible, uncontacted VIP immediate priority even when another squad member remembers a remote alien contact. A visible in-range alien with line of sight still takes local combat priority.
- Escorted VIPs remain visible through fog until extraction. After alien defeat and contact with every surviving VIP, non-escort soldiers form distinct guard positions around the evacuation column and Skyranger ramps.
- Building generation scales deterministic opportunities by map tier and raises the placement chance from wilderness through farmland and town to city terrain.
- Destructible wall cells that become nonblocking rubble for every tactical mover.
- Rank- and mission-gated commander doctrine, commander-centered formations, bounded flanking, cover/LOS/range scoring, and selected-shot TU reserves during AI command.
- Reaction fire during alien movement driven by each soldier's Reaction stat, current weapon TU profile, range, line of sight, and available ammunition.
- Human-priority alien movement that seeks cover while preserving attack TU, plus live fog of war that hides unobserved alien movement during AI command.
- Reversible AI command, round-robin rescue scheduling, bounded anti-loop rescue routes, stalled-escort reassignment, and state-preserving return to direct control.
- Full-squad AI turn utilization: established escorts continue rescue, non-escorts answer any squad-observed alien contact, and otherwise each viable soldier receives a bounded search/patrol move.
- Threat-aware escort routing scores known alien weapon exposure before distance, while keeping the reachable-cell search capped at 192 unique cells and 768 processed states.
- Visible AI-controlled soldiers and aliens move one actor at a time; unobserved alien movement stays hidden and uses only the minimal phase delay.
- Sequential tactical soldier voice cues for AI handoff, movement, civilian contact, firing, misses, kills, and player reclaim.
- A dedicated Voices bus with persistent on/off and volume settings plus a three-category playback test for computer, aircraft, and soldier clips.
- Bounded voice makeup gain and automatic music ducking so low-level recordings remain intelligible without changing SFX volume.
- A classic battlescape-style command console with previous/next soldier, tactical map, field inventory, kneel/stand, shot reserves, TU bleed/Done, End Turn, AI Command, and Dust Off.
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
- Base-local loose weapon, armor, and Medkit stock with atomic soldier exchanges, Unarmed/No Armor states, exact save persistence, unequipped recruit arrivals, and mission recovery/loss ownership for KIA soldiers.
- Tactical Ballistic Rifle, Laser Rifle, Unarmed, Field Suit, No Armor, and Medkit profiles sourced from the content catalog; one issued Medkit restores up to 12 HP for 12 TU and is consumed after use.
- Final mission HP creates a bounded one-to-five-day wound-recovery record. Wounded soldiers remain unavailable until strategic midnights reduce the timer to zero and medical clearance returns them to duty.
- Native JSON save format 4 at `user://project_aegis_godot_save_v4.json`, with imported campaigns isolated at `user://project_aegis_godot_imported_copy_v4.json`.
- In-game Build Health with 95 checks, including per-soldier VIP priority, escorted-VIP visibility, rescue perimeter guards, biome/tier building density, map tiers, exact multi-Skyranger squad deployment, playable-perimeter guards, bounded tactical-log trimming, air operations, browser-import isolation, personnel arrivals, research/manufacturing/construction, local-stock conservation, tactical loadout inheritance, Medkit consumption, wound recovery, commander doctrine, TU reserves, reaction fire, AI fog, AI reclaim, full-squad combat priorities, tracked VIP guidance, building-clear Skyranger placement, threat-aware rescue routing, sequential visible actors, queued tactical voices, classic command controls, mission equipment recovery/loss, large-list scrolling, and dense strategic marker placement.

## Tactical Controls

- Click a blue soldier to select them.
- Click a highlighted hex to move using the bounded reachable-cell flood and pathfinder.
- Move adjacent to a civilian and click them to spend 8 TU and begin escorting.
- Lead escorted civilians through the rear ramp cells to extract them.
- Click a revealed alien in rifle range to fire.
- Laser Rifles fire up to nine hexes for 14 TU; Ballistic Rifles fire up to seven hexes for 16 TU. Unarmed soldiers cannot fire.
- Click an intact wall in rifle range to damage it; destroyed wall rubble is traversable.
- Select an injured soldier with an issued Medkit and use **Use Medkit - 12 TU** to restore up to 12 HP. The single charge is consumed immediately.
- Use **Prev/Next**, **Map**, and **Inventory** to inspect the squad and observation-safe battlefield contacts.
- Use **Kneel/Stand**, **None/Snap/Aimed/Auto/Kneel** TU reserves, and **Done** to control stance and protected action economy.
- Use **AI Command** to hand off the current battlefield without resetting it; current fog remains authoritative throughout the AI turn. Use **Take Back Control** to resume the same live battle between bounded AI actions.
- Use **Dust Off** to abandon an unresolved incident after confirmation.
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

## Personnel, Research, Manufacturing, And Loadouts

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
- The Soldiers screen shows loose Ballistic Rifle, Laser Rifle, Field Suit, and Medkit stock and provides weapon, armor, and one-charge Medkit controls for each living soldier.
- Issuing an item consumes one local-store unit and returns the prior item in the same operation. Unavailable equipment is not offered and cannot be duplicated.
- New recruits arrive Unarmed and with No Armor. Successful missions recover issued equipment from fallen soldiers; equipment carried by KIA soldiers in failed missions is lost with report feedback.
- The Tactical Control panel refreshes from the authoritative selected-unit record after movement, firing, breaching, civilian contact, selection changes, and turn transitions, keeping displayed TU aligned with movement highlights.
- Mission injuries use final post-treatment HP to assign one to five recovery days. Strategic midnights persistently decrement that timer, and the roster displays the exact remaining days until return to duty.

## Automated Verification

From the repository root:

```powershell
godot --headless --path . --editor --quit
godot --headless --path . --script res://godot/tests/test_runner.gd
```

The test runner covers campaign creation and travel, exact loadout/store save round-tripping, conservative loadout and wound migration, local-stock conservation and unavailable-item rejection, Medkit issue/return/consumption, mission recovery and loss, one-to-five-day wounds, exact recovery persistence, unequipped recruit arrivals, Workshop and personnel migration, hiring/capacity rules, construction, bounded research and manufacturing, air operations, browser-export normalization and source preservation, strategic markers, bounded hex rules, tactical loadout inheritance, Laser Rifle range/TU, selected-unit feedback, Unarmed fire rejection, movement highlighting, three End Turn cycles, civilian contact, wall destruction and traversal, full-squad contact response, per-soldier VIP priority, escorted-VIP visibility, distinct rescue guards, biome/tier building density, remembered alien-contact convergence, building-clear Skyranger placement, tracked VIP pings, pre-contact tracker guidance with shot reservation, distinct post-combat building/sector search assignments, threat-safe civilian paths, sequential visible actions, and all visible Build Health rows.

Latest automated verification passes `123/123` native tests and `95/95` visible Build Health rows. Godot 4.7.1 strict editor parsing passes. The paired browser 0151 start screen and Geoscape load, browser Build Health passes `314/314`, and a live six-soldier Small Red River Signal battle selected Bryn with authoritative `51/51` TU and completed three End Turn cycles with all six soldiers alive and no runtime errors.

## Deliberate Limits

- This is a focused vertical slice, not a feature-complete port of the browser campaign.
- The tactical mission is a fixed native sample battlefield rather than the browser game's complete procedural mission catalog.
- Browser import deliberately maps only the compatible vertical-slice subset. Complex browser base layouts, relationships, transfers, queues, multiple aircraft, and browser-only systems remain preserved only in the original browser save.
- Native export presets and release packages are not configured yet.
- Multi-base logistics, soldier relationships, the full research/manufacturing trees, richer aircraft loadouts, and campaign endgame remain in the HTML build.

## Manual Gates

The player confirmed the 0008 gate passes: all three construction costs and slots, no early capacity, exact save/reload countdowns, staggered day 3/4/5 completion, specialist hiring after activation, $150k Living Quarters cancellation refund, and imported-copy source isolation worked as expected.

The player accepted the 0009 gate after confirming that a selected soldier's displayed TU now decreases immediately after firing, in agreement with movement highlighting. Automated, Build Health, GPU, and isolated-save checks cover the remaining bounded loadout contracts recorded above.

The paired 0010/0138 gate requires live issue/return stock checks in both versions, one wounded self-treatment with exact HP/TU/charge feedback in both tactical clients, mission wound admission, exact save/reload of remaining recovery days, strategic-midnight clearance, KIA Medkit recovery/loss ownership, and imported-copy source isolation.

Browser build 0139 additionally requires loading the supplied slot-10 export without overwriting it, confirming a Fort Aegis Skyranger can stage through the departed S. America hangar to reach the active abduction incident, and confirming Saber One retains its Fort Aegis recovery reservation.

The paired 0013/0142 gate requires hands-on confirmation in the originally affected rescue battle that multiple soldiers act, escorts do not oscillate, civilians cross the ramp, `Take Back Control` preserves the displayed state, and tactical voices remain audible and sequential.

The paired 0015/0145 gate requires opening `index.html` directly and confirming all three Test Voices clips play through the direct-file fallback, music audibly ducks and restores, mute/volume behavior persists after relaunch, and natural event-trigger playback remains ordered during UFO detection, Skyranger operations, and tactical combat. Localhost and hosted builds retain the processed Web Audio path from browser build 0144.

The paired 0016/0146 gate requires the originally affected mandatory-rescue battle under AI command: confirm every viable soldier acts, existing escorts keep evacuating, non-escorts converge on squad-observed aliens, civilian routes avoid known firing lanes when possible, and visible soldiers/aliens animate one at a time. Browser-only multi-base checks must also confirm the no-Skyranger recruitment prompt and squad-home recovery after a ferry-staged victory.

The paired 0017/0147 gate requires the originally affected rescue campaign plus dense urban maps: confirm pre-contact civilian claims persist, non-escorts converge on the last observed alien area, Skyranger hull/ramp cells never touch buildings, damaged/rescue-progressed maps survive command-section navigation, and Classic Lineup targets fall only after their lethal shot is displayed with no post-resolution firing.

The paired 0021/0151 gate requires a mandatory-rescue battle with a remote remembered alien contact: confirm an unengaged soldier still contacts an adjacent VIP, a locally threatened soldier retains combat priority, the camera centers each manually selected soldier, blue escorted VIPs stay visible through fog, and idle soldiers form around VIPs or ramps after every survivor is escorted. Repeated Small, Medium, and Large wilderness, farm, town, and city launches should also be compared for expected building-density progression and practical pacing.

Next paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data.
