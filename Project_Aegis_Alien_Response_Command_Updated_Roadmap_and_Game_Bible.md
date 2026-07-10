# PROJECT AEGIS / ALIEN RESPONSE COMMAND
## Codex Handoff: Updated Full Roadmap + Game Bible

Last updated: 2026-07-09  
Current handoff build: `v0.26.07.09.0025_BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH`  
Current patch status: **Built in `index.html`; Node static app-script parse passed, localhost browser smoke passed, Start New Game -> first base confirmation -> main Geoscape passed, Quartermaster local-store UI rendered, browser console showed no errors, and Build Health passed 209/209. The prior `v0.26.07.09.0008_START_SCREEN_MOUNT_FIX_INDEX_ONLY_PATCH` was also verified through localhost with Build Health 208/208 before this equipment patch.**

---

# 1. Project Identity

## Working Title
Alien Response Command

## Project Codename
Project Aegis

## Genre
Single-player strategy / base-management / tactical alien-defense game inspired by classic X-COM-style structure, built as a single-file HTML game.

## Current Platform / Build Format
- Primary format: single-file HTML game.
- Deployment target: GitHub Pages and local browser play.
- Patch distribution: zipped build folder containing `index.html` at the root of the folder.
- Preferred patch type: `INDEX_ONLY` unless assets are required.
- Future possibility: paid alpha on itch.io.
- Possible later sequel or expanded version could move to Godot, but the current project is HTML-first.

## Player Fantasy
The player commands a fledgling global defense organization responding to escalating alien activity. They recruit soldiers, manage a base, research alien threats, shoot down UFOs, deploy squads, endure casualties, and build emotional attachment to soldiers whose personalities, stress, friendships, injuries, commendations, and deaths shape the campaign.

## Tone
- Military sci-fi
- Tactical command
- Human cost of war
- Slightly pulpy alien-invasion drama
- Soldiers should become memorable individuals, not disposable units.

## Core Pillars
1. **Strategic command pressure** — Balance funding, panic, radar coverage, aircraft readiness, personnel, research, and soldier health.
2. **Soldier attachment** — Soldiers should feel like people with histories, stress, relationships, accomplishments, and memorial consequences.
3. **Tactical readability** — Tactical missions must be readable, paced, and emotionally legible, even in a lightweight browser implementation.
4. **Campaign escalation** — Alien activity should grow over time and eventually point toward alien command-site discovery and a final mission.
5. **Fast patchability** — The game should remain easy to patch, test, package, and deploy through single-file HTML builds.

---

# 2. Current Build State

## Latest Known Build
`v0.26.07.09.0025_BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH`

## What This Patch Was Intended To Add
This patch adds:
- Start-screen mount recovery from `v0.26.07.09.0008_START_SCREEN_MOUNT_FIX_INDEX_ONLY_PATCH`, verified through localhost before continuing roadmap work.
- Base-local equipment store normalization with old-save compatible `baseInventories` while preserving aggregate `gearInventory` compatibility.
- Quartermaster/Base Stores selected-base stock display, local storage capacity/readout, and all-bases storage summary.
- Buy, sell, equip, remove, and forced assignment auto-equip paths now route practical loose stock through the relevant local base inventory where safely contained.
- Initial equipment transfer logistics for portable gear, with origin base, destination base, item payload, quantity, travel time, in-transit status, and Geoscape-clock arrival.
- In-transit equipment is removed from the origin's available local stock until it arrives at the destination base.
- Build Health now includes `Base-local equipment stores and transfers keep stock local until arrival`.
- Base-local Barracks and Sickbay filtering using the currently selected base.
- In-transit soldier state for initial soldier-only base transfers.
- Barracks transfer buttons for moving a ready soldier from the selected base to another base.
- Transfers record origin base, destination base, total/remaining travel time, and in-transit status.
- Soldier transfers advance through Geoscape clock time and update the soldier's base on arrival.
- In-transit soldiers are hidden from local base rosters, excluded from squad assignment, and unavailable for mission launch.
- Selected-base Sickbay capacity/readout now matches the filtered local patient list.
- Build Health now includes `Base-local rosters and soldier transfers keep personnel available only at their base`.
- A compact Geoscape Range Overlays control with toggles for Shortwave Radar, Longwave Radar, Interceptor reach, Skyranger reach, and All Off.
- Lightweight dotted/dashed base-centered range rings on the Geoscape globe.
- Overlay rings respect Interceptor Drop Tanks and Skyranger Extended Tanks when showing practical aircraft reach.
- Base-placement aircraft range preview rings remain separate from the persistent Geoscape overlay rings.
- The Squads screen now filters available assignment candidates to soldiers stationed at the same base as the selected squad.
- Squad base matching resolves real campaign base IDs first, then safe legacy stationing fields, and falls back conservatively for empty/legacy squads.
- Cross-base soldiers are hidden from the selected squad's available assignment list, and direct assignment is defensively blocked if a soldier is stationed at another base.
- Build Health now includes `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.
- UFO mission intents for active craft: Recon, Abduction, Terror Raid, Harvest, Base Scout, and Supply.
- UFO flights can now complete operations into ground incidents before simply escaping, with threat/panic based on UFO size, region, alien type, and mission intent.
- Crash sites remain separate from landed/terror-style incidents.
- Interception outcomes can disrupt UFO operations, delaying mission completion and downgrading later ground threat/panic when damage or forced disengagement occurs.
- UFO Tracking now surfaces mission intent/risk text once radar contact quality is strong enough to read the operation.
- Build Health now includes `UFO mission intents can create landed terror incidents`, covering old-save intent normalization, landed incident generation, panic consequences, radar-readable mission text, and air-combat disruption/downgrade behavior.
- Distance-based base radar coverage for UFO contacts, derived from installed Shortwave and Longwave Radar facilities and each base's Geoscape location.
- Shortwave Radar acts as a local/regional detector with a 4,500km range; Longwave Radar acts as a wider strategic detector with a 9,000km range.
- UFO Tracking and the Geoscape globe now show only detected/known UFOs or contacts currently inside radar coverage, rather than exposing all UFOs whenever any radar exists.
- Contact quality states such as Weak, Faint, Tracked, and Locked now affect detection chance and air-combat firing-solution quality.
- Overlapping radar coverage improves contact quality and detection chance.
- UFO Tracking now names the best detecting base/radar source, approximate distance, detection chance, and overlap count for each contact.
- Build Health coverage now includes radar range gating, out-of-range UFO hiding, Shortwave-vs-Longwave range differences, overlapping coverage improvements, starting radar continuity, and no-regression checks for interceptor and Skyranger launch selection.
- A second Skyranger stationing fix for saves where ready transport bases were visible but selected soldiers still failed to match either Fort Aegis or N. Africa ready Skyranger bases.
- Soldier stationing now resolves through real campaign base IDs first, then safe legacy base name/region tokens, while ignoring room/activity-only `baseLocation` labels such as Barracks as base identity.
- Save/load migration now normalizes missing soldier `baseId` values with the selected/first campaign base when only room-state location data exists.
- Skyranger launch blockers now name mixed-base offending soldiers and their interpreted stationing so the player can see exactly why a response force is blocked.
- Build Health coverage now includes Fort Aegis plus N. Africa ready-Skyranger matching, room-only legacy location fallback, mixed-base named blocker text, and legacy load normalization.
- A targeted Skyranger stationing fix so mission launch checks soldiers against the actual Skyranger launch base using current and legacy base identifiers.
- Soldier stationing now recognizes base `id`, base name, region, legacy `baseLocation` strings/objects, and older `homeBaseId` / `assignedBaseId` fields without weakening wrong-base squad blocking.
- North America-to-nearby-incident range validation remains tied to the Skyranger practical range/fuel model; a representative North America to Central America round trip is about 6,813km, inside the starting 16,000km range.
- Skyranger blocker text now names the ready Skyranger bases involved when soldiers are not stationed at any matching transport base.
- Build Health coverage for in-range North America launch eligibility, legacy soldier stationing normalization, wrong-base blocking, under-fueled blocking, and the existing Skyranger assigned-base regression row.
- X-COM-style Geoscape time compression modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- A smoother one-second Geoscape clock cadence where the selected compression mode controls elapsed simulation minutes instead of changing aircraft/travel formulas.
- Old-save normalization for legacy or odd Geoscape tick settings, snapping them to the nearest supported compression mode.
- Time-control UI labels that show the selected compression mode and perceived clock rate.
- Build Health coverage for time-scale conversion, route progress scaling, repair/refuel progression, and no-regression tactical/modal clock blocking.
- Dotted aircraft reach previews during Build New Base placement mode, centered on the proposed site on the Geoscape globe.
- Separate current Interceptor and Skyranger practical reach rings, using the existing aircraft range profile and half-range round-trip planning model.
- Additional upgrade-preview rings when Interceptor Drop Tanks or Skyranger Extended Tanks are not yet owned, so the player can compare starting craft reach against upgraded reach.
- Selected-site summary text explaining the current aircraft reach values without requiring the player to hunt through unrelated panels.
- Build Health coverage for placement-mode range preview state, range values, hidden inactive-mode previews, render data, summary text, and no-regression base construction behavior.
- One Shortwave Radar seeded into the default Fort Aegis starting base layout.
- Expansion bases remain clean starter bases with only their free Access Lift.
- Starting radar coverage now contributes to the existing shortwave/longwave detection summary from the beginning of a new campaign.
- Build Health coverage for the starting Shortwave Radar seed without disturbing the existing hangar layout or expansion-base construction contract.
- Global save-compatible aircraft fuel tank upgrade flags for Interceptors and Skyrangers.
- Purchasable Interceptor Drop Tanks and Skyranger Extended Tanks in UFO Tracking.
- Upgraded Interceptors increase from 100 fuel / 7,800km range to 135 fuel / 10,500km range.
- Upgraded Skyrangers increase from 100 fuel / 16,000km range to 130 fuel / 20,800km range.
- Existing and newly ordered aircraft inherit the upgraded capacity/range while preserving current status, repair, airborne, and fuel behavior.
- Old saves normalize missing tank flags safely; saves that already have a fuel tank flag apply it to the aircraft fleet during load/migration.
- Build Health coverage for fuel tank upgrade normalization, application, range expansion, refueling to the new capacity, and no-regression aircraft travel/range selection.
- A targeted stuck-airborne recovery fix for interceptors left in `Outbound` or `Returning` without an active `interceptorTravel` record.
- Active interceptor travel now synchronizes aircraft fleet status as `Outbound` before the attack leg and `Returning` after the attack leg.
- Save/load migration now recovers stale airborne interceptors into a short `Repairing` recovery window so they become grounded and eligible to refuel instead of staying permanently unusable.
- Aircraft readiness lines now call out airborne refuel pause and stale-travel recovery status.
- Build Health coverage for active travel status sync, return recovery, stale `Outbound` / `Returning` recovery, recovered refueling, legitimate airborne no-refuel behavior, and recovery display text.
- Richer UFO interception outcomes: confirmed shootdown, damaged escape, evasive maneuvers, contact lost, forced disengage, ammunition pressure, and cautious breakaway.
- A shared air-combat outcome helper that uses UFO size/speed/threat, formation size, weapon power, detection coverage, and Cautious/Standard/Aggressive stance.
- Interceptor launch summaries now show the outcome, hit estimate, combat roll, evasion pressure, fuel cost, launch base, and clock-based ETA.
- UFO Tracking sortie text now previews hit estimate and UFO evasion pressure alongside range/fuel readiness.
- Missed/non-crash encounters can advance the UFO flight, mark contact lost, or preserve a damaged-escape summary without changing the clock-based travel/return contract.
- Aircraft recovery now records the richer air-combat outcome and applies bounded outcome modifiers to damage and repair burden.
- Build Health coverage for richer evasion/contact-lost outcomes, stance modifiers, ammo bounds, contact-state updates, recovery bounds, and no-regression checks for interceptor base range, Skyranger base matching, and new-base placement.
- A targeted Geoscape UI fix so the new-base placement confirmation controls render directly above the globe when placement mode is active.
- A visible base name field, selected site summary, construction cost, funds-after-construction readout, and confirm button near the existing Build/Cancel placement controls.
- Shared placement validation state so confirm is disabled with a clear reason until a name is entered and enough funds are available.
- Build Health coverage for the base-placement confirmation state and new-base construction data contract.
- A targeted correction so Skyranger mission launch evaluates each ready Skyranger's assigned base instead of the selected/first campaign base.
- Save-compatible soldier home-base normalization so old saves place missing soldier base state at the campaign's selected/first base.
- Mission launch pairing that only selects a ready Skyranger whose base contains the assigned response soldiers.
- Clear Skyranger launch blockers for no ready transport, soldiers not stationed at a ready Skyranger base, practical range, and fuel.
- Manual and simulated missions now resolve their response force from the preserved Skyranger launch base.
- A targeted correction so interceptor range/fuel checks use each interceptor's assigned base or hangar, not the first campaign base.
- Launch selection now prefers eligible ready interceptors from bases that can actually reach the UFO.
- Interceptor travel now preserves the selected launch base for ETA/progress.
- Old aircraft records with a `hangarKey` but missing `baseId` derive the base from the hangar key during normalization.
- Save-compatible fuel, range, and refuel readiness fields on top of the existing `aircraftFleet` identity/readiness state.
- Simple practical range profiles for Skyrangers and interceptors, with launch blocking when a round trip exceeds range.
- Fuel consumption committed at launch and refueling advanced only by Geoscape clock minutes while craft are not airborne.
- Interception stance choices: Cautious, Standard, and Aggressive.
- Stance effects on hit chance, aircraft damage risk, ammo expenditure, fuel use, and repair time.
- UFO Tracking readouts for interceptor fuel/range readiness and per-contact sortie feasibility.
- Hangar readiness readouts expanded through `aircraftStatusLine` to show fuel, range, repair, and refuel state.
- Build Health coverage for old-save normalization, range checks, refueling behavior, stance effects, fuel-based launch blocking, and existing repair behavior.
- Build Health coverage for multi-base interceptor range selection, hangar-key base normalization, Skyranger assigned-base selection, wrong-base soldier blocking, multi-base Skyranger matching, fuel/refuel continuity, and old-save soldier base fallback.

## Current Player Verification Needed
Before moving to the next major feature stage, test:

0. **New base placement**
   - Click Build New Base from the Geoscape.
   - Confirm the New Base Site panel, base name field, selected site summary, cost, and confirm button appear immediately above the globe without needing to hunt through the page.
   - Confirm dotted Interceptor and Skyranger aircraft reach rings appear centered on the proposed base site.
   - Confirm the selected-site summary includes the dotted aircraft reach values.
   - Confirm the button stays disabled until a base name is entered and enough funds are available.
   - Enter a name, confirm construction, and verify the new base is created with the standard Access Lift seed layout.

0b. **Smooth Geoscape time**
   - Use the Geoscape Clock modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
   - Confirm the clock feels like time compression rather than a chunky End Day-only flow.
   - Launch aircraft or track a UFO and confirm faster modes make visible progress faster while preserving the same clock-based travel/return/repair/refuel rules.
   - Confirm tactical/manual mission states, council slides, and blocking modal states still stop the auto-clock.

0a. **Starting Shortwave Radar**
   - Start a new campaign and inspect the starting base.
   - Confirm the default base includes one Shortwave Radar facility.
   - Confirm expansion bases built through Build New Base still start with only the Access Lift seed layout.
   - Confirm UFO Tracking coverage starts with one shortwave radar counted.

1. **Aircraft readiness and hangars**
   - Start a new campaign and inspect the starting base hangars.
   - Confirm the Skyranger and starting Interceptor show named aircraft, fuel, range, and readiness text.
   - Order a new aircraft from an empty hangar and confirm the new craft receives a stable name/status plus full fuel/range values.

2. **Interceptor readiness and repair**
   - Launch one or more interceptors at a detected UFO.
   - Confirm ready interceptor count drops immediately and launch buttons disable when no ready/fueled/in-range craft remain.
   - With multiple bases, confirm UFO Tracking and launch use the base where each interceptor is stationed.
   - Confirm airborne interceptors show Outbound before the attack leg and Returning after the attack leg.
   - Advance Geoscape time through the return leg and confirm any damaged craft enter Repairing.
   - Advance more clock time and confirm repaired craft return to Ready.
   - Confirm fuel refills only while craft are not Outbound or Returning.
   - Load an older/save-mismatched campaign with a stale Outbound or Returning interceptor and confirm it recovers through a short Repairing state instead of staying stuck.

3. **Interception stance**
   - Change stance between Cautious, Standard, and Aggressive in UFO Tracking.
   - Confirm contact readouts and launch reports show the selected stance.
   - Confirm Aggressive improves hit chance but increases ammo/fuel/damage/repair pressure in Build Health and practical play.

3a. **Richer air-combat outcomes**
   - Launch one or more interceptors at detected UFOs with different stances.
   - Confirm launch summaries can report outcomes such as Confirmed Shootdown, Damaged Escape, Evasive Maneuvers, Contact Lost, Forced Disengage, Ammunition Pressure, or Breakaway.
   - Confirm the UFO Tracking contact readout includes hit estimate and UFO evasion pressure.
   - Confirm misses still send interceptors through clock-based return/recovery instead of instantly resetting them.
   - Confirm any contact-lost result clearly changes the contact state instead of pretending the UFO was simply shot down or ignored.

3b. **Aircraft fuel tank upgrades**
   - Open UFO Tracking and confirm Interceptor Tanks and Skyranger Tanks upgrade cards are visible near aircraft ordnance.
   - Purchase Interceptor Drop Tanks and confirm interceptor readiness text shows 10,500km range and 135 fuel capacity after normalization/refuel.
   - Purchase Skyranger Extended Tanks and confirm Skyranger readiness text shows 20,800km range and 130 fuel capacity.
   - Confirm upgraded aircraft can accept longer practical sorties but still block missions that exceed range or fuel.
   - Confirm automatic refueling still uses Geoscape clock time and does not require funds or Base Stores.

4. **Skyranger status**
   - Launch a mission and confirm Skyranger travel still uses clock-based progress.
   - With multiple bases, confirm the Skyranger launches from the base where the chosen transport is housed.
   - Confirm soldiers assigned to the mission must be stationed at the chosen Skyranger's launch base.
   - From a North America starting base, confirm a ready Skyranger and squad can launch to a nearby North/Central America incident that is within the 16,000km practical range.
   - Confirm older soldiers with legacy `baseLocation` or missing `baseId` no longer get falsely blocked when they are effectively stationed at the Skyranger base.
   - Confirm launch is blocked or clearly reported if the round trip exceeds practical range or current fuel.
   - Finish/return from the mission and confirm the Skyranger becomes Ready again.

5. **Save compatibility**
   - Load or import an older save with no `aircraftFleet` field.
   - Confirm it normalizes a Skyranger/interceptor fleet with fuel/range fields and no crash.

6. **Build Health**
   - Confirm the in-browser Build Health panel passes all checks, including the expanded Skyranger stationing/range launch row, smooth Geoscape time compression, base-placement aircraft range previews, fuel tank upgrades, air-combat reports, stuck-Outbound recovery, richer UFO evasion, new-base placement, aircraft identity/repair, range/fuel/stance, interceptor assigned-base, and Skyranger assigned-base rows.

---

# 3. Packaging and Versioning Rules

These rules matter for every Codex patch.

## Versioning
Use version format:

`v0.yy.mm.dd.hhmm_SHORT_PATCH_NAME`

Example:

`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY`

## Displayed Version
The in-game displayed version number must match the zip/build version.

## Zip Naming
Zip file name should match:

`Alien_Response_Command_Game_v0_YY_MM_DD_HHMM_PATCH_LABEL_INDEX_ONLY.zip`

## Folder Structure Inside Zip
The zip should contain one folder, named exactly like the zip without `.zip`.

Inside that folder:
- `index.html` must be at the root.
- Do not add an extra outer folder.
- Do not bury `index.html` deeper than one folder.

## Patch Type
Use `INDEX_ONLY` unless the patch truly requires external assets. If a new asset is added, include it in the package and use an asset-aware build label.

## Build Health
Whenever possible:
- Keep existing Build Health tests passing.
- Add tests for new systems.
- Avoid removing prior tests unless replacing them with stronger coverage.

---

# 4. Gameplay Overview

## Core Loop
1. Review base status, personnel, funding, panic, facilities, and threats.
2. Recruit / manage soldiers, scientists, engineers, and aircraft.
3. Advance time.
4. Detect alien incidents / UFOs.
5. Intercept UFOs or respond to ground incidents.
6. Resolve missions tactically or through simulation.
7. Soldiers gain XP, injuries, stress, commendations, relationships, and service notes.
8. Research, build, expand facilities, and improve readiness.
9. End month with Council Review.
10. Survive escalating alien activity until command-site discovery and final mission path.

## Main Screens / Sections
- Start screen
- Base / Command view
- Barracks
- Sickbay
- Memorial
- Training Center
- Recreation / Rec Room
- Laboratory
- Workshop
- Stores / Quartermaster
- Hangars / aircraft management
- Geoscape
- Incident list
- Tactical mission
- Simulated mission
- Council Review / End-of-Month Review
- Build Health / Self-tests
- Instructions

---

# 5. Soldier Systems Game Bible

## Soldier Identity
Each soldier can have:
- Name
- Rank
- Callsign
- Personality
- Background
- Specialization
- Squad assignment
- Service notes
- Cosmetic unlock notes
- Mission count
- Kills
- Wounds
- XP / level progress
- Commendations
- Stress / morale state
- Downtime preference
- Friendships
- Squad history
- KIA memorial record if killed

## Callsigns
Completed features:
- Edit Callsign
- Random Callsign
- Clear Callsign
- Save/load persistence
- Special callsigns include:
  - Pirate Detective
  - Chat Ghost
  - Cogito

## Specializations
Completed / polished:
- Rifleman
- Medic
- Scout
- Heavy
- Sniper
- Engineer
- Assault
- Officer

Implemented:
- Auto specialization assignment
- Assignment rebalance
- Dropdown specialization selector
- Squad role composition
- Save/load persistence

## Ranks and Progression
Soldiers have rank progression and XP. Promotions should feel meaningful but not overcomplicated. Rank should influence leadership, morale impact, and squad chain-of-command in later systems.

## Stress / Morale
Morale states:
- Steady
- Stable
- Tense
- Shaken
- Critical

Current behavior:
- Missions increase stress.
- Rec Room / recovery downtime reduces stress.
- Stress can apply minor gameplay penalties/bonuses.
- Stress changes can create service notes.
- Friend deaths can create stress shocks.
- Officers and cohesion can help mitigate morale damage or trigger rally recovery.

## Downtime
Implemented first-pass systems:
- Training Center
- Rec Room
- Downtime assignment UI
- Training progress seed system
- Stress reduction seed system
- Autonomous downtime selection
- Preferred activity logic
- Facility slot/fallback logic
- Shared downtime friendship growth
- Daily/monthly downtime summary hooks

## Soldier Needs and Preferences
Soldiers should autonomously choose downtime activities based on:
- stress
- personality
- specialization
- background
- recent events
- facility availability
- player guidance

Example preferred activities:
- pool
- cards
- darts
- gym
- running
- shooting range
- maintenance
- reading
- memorial visits

Design direction: the player should set broad guidance, not micromanage every recreation choice. Soldiers should feel like people making choices based on need and temperament.

## Friendships
Implemented first-pass systems:
- Friendship scores
- Shared downtime friendship growth
- Shared mission friendship growth
- Compatibility bonuses from similar backgrounds/preferences
- Top-friend display logic
- Friend-death stress penalties

Future improvements:
- More emotionally specific service notes.
- Friendship-based memorial offerings.
- Rivalries or strained relationships.
- Squad relationship map.

## Squad Cohesion
Implemented first-pass systems:
- Squad cohesion scoring
- Cohesion labels such as Loose / Familiar / Cohesive / Bonded
- Cohesion bonuses
- Rally recovery hooks
- Friend-death cohesion effects

Future improvements:
- Clearer squad-level UI card.
- Tactical cohesion feedback.
- Better event log entries explaining cohesion effects.
- Officer and second-in-command rally events.

---

# 6. Memorial Game Bible

## Memorial Purpose
The Memorial should make casualties matter. It should be emotional, inspectable, and persistent.

## Current Completed Systems
- KIA soldiers move to Memorial.
- Memorial sorting.
- Memorial upgrades.
- Service summaries.
- Early KIA commendations:
  - Line of Duty
  - First Fallen

## Approved Memorial Tone Examples
**Worn Playing Card**  
“You still owe me one rematch. I’ll keep the table open.”  
Left by Sgt. Mara Voss.

**Spent Rifle Casing**  
“You covered my retreat at Redfall. I came home because you didn’t.”  
Left by Cpl. Dane Okafor.

## Future Memorial Offering System
Planned Stage 2.7:
- Clickable tribute items.
- Relationship-based offerings.
- Emotional inspected-item writing.
- Persistent memorial history.
- Offerings influenced by friendship, squad membership, shared missions, and service history.

Design rule: memorial writing should be short, specific, and personal. Avoid generic “you were brave” text when a concrete memory can be referenced.

---

# 7. Base Facilities Game Bible

## Existing / Planned Base Facilities
- Access Lift
- Living Quarters
- Sickbay
- Laboratory
- Workshop
- Base Stores
- Training Center
- Recreation / Rec Room
- Memorial
- Radar / Longwave Radar
- Quartermaster / Upgrade Bench
- Hangar

## Facility Roles
### Living Quarters
Personnel capacity and base life.

### Sickbay
Injury recovery. Sickbay soldier cards have been optimized/collapsed similarly to barracks cards.

### Laboratory
Research. Current assumption: 10 scientists per lab.

### Workshop
Engineering/manufacturing. Current assumption: 10 engineers per workshop.

### Base Stores
Storage and supplies. Text readability has been fixed for dark mode.

### Training Center
Soldier stat improvement over time. Also supports downtime/training guidance.

Future minigame note: when the Training Center receives a deeper interaction pass, allow optional playable drill minigames based on available training activities. These should be opt-in bonuses/immersive activities, not mandatory chores, and can feed small training progress, morale, rivalry/friendship, or squad-cohesion outcomes.

### Rec Room
Stress reduction and friendship growth through recreation.

Future minigame note: eventually add playable versions of the games soldiers can play in the Rec Room. These should use soldier relationship context where possible, so friends, rivals, and squadmates can produce different banter, stakes, morale outcomes, and memorial memories later.

### Memorial
KIA record, emotional attachment, future offerings.

### Radar
Detects alien activity and UFOs. Longwave Radar adds incidents and detection value.

Roadmap update: radar detection should eventually be distance-based from each base, not only a global coverage score. Shortwave Radar should provide local/regional detection, Longwave Radar should project farther coverage, and overlapping radar fields should improve contact quality.

### Hangar
Aircraft storage. Hangar is conceptually a 2x2 tile. Supports craft purchase/assignment and empty hangar states.

Default starting base layout should include **two 2x2 hangars**: one populated with the starting Interceptor and one populated with the Skyranger. This keeps the visual base layout consistent with the campaign starting equipment.

Roadmap update: the default starting base should also include **one Shortwave Radar** so new campaigns begin with minimal local detection coverage. Longwave Radar should remain the broader/deeper detection expansion facility.

---

# 8. Tactical / Mission Game Bible

## Tactical Mission Goals
Tactical missions should be readable, dramatic, and paced well. Even if lightweight, the player should understand:
- who is acting
- where shots originate
- what was hit or missed
- who moved
- who died
- why the outcome happened

## Completed Tactical Improvements
- Hex map.
- Larger tactical units.
- Heads/figures visible above hex edge.
- Path line in blue.
- Bouncy movement steps.
- Speed control range.
- AI slowed for readability.
- Minimum exchange pacing.
- Shot origin/impact fixes.
- No blink-in/blink-out movement.
- Camera stability improvements.
- Replay stability fixes.
- Shot/death timing sync.
- Classic Lineup Sim View restored.

## Still Planned Tactical Readability Improvements
- Tactical event log.
- Better unit selection indicators.
- Better facing indicators.
- Better hit/miss/impact feedback.
- Playback speed controls.
- Battlefield-space optimization so more of the map uses available screen area.
- Simulated mission paper-doll/layered sprite consistency.

## Simulated Missions
Current direction:
- Probability-driven outcome.
- Optional Classic Lineup View.
- Soldiers should use the newer layered sprite system where practical, not old static images.

---

# 9. Geoscape / Campaign Game Bible

## Current Campaign Foundations
Implemented or first-pass:
- Geoscape ticking time.
- UFO spawning.
- Radar detection.
- Interceptors.
- Aircraft ammo/upgrades.
- Persistent aircraft identity/readiness seed.
- Aircraft damage/repair seed after interception.
- Crash-site incidents.
- Hidden command-site discovery gating.

## Future Campaign Goals
- Replace static End Day/End Month feeling with more continuous time progression.
- Let the player control time speed.
- Make Geoscape time feel closer to classic X-COM: smooth clock flow with selectable time compression, where aircraft and UFO motion visibly speed up or slow down with the selected time scale while underlying travel math remains clock-accurate.
- Seed the first base with one Shortwave Radar so initial UFO detection feels intentional before the player expands the radar network.
- Replace abstract global radar coverage with base-centered radar range so UFOs can only be reliably detected when they fly within Shortwave/Longwave coverage.
- Add player-controlled Geoscape overlay filters so commanders can toggle radar rings, Interceptor practical reach, Skyranger practical reach, and all range rings off when the globe is too busy.
- UFOs range from very small to very large.
- Larger craft are harder to shoot down.
- Shootdowns create crash incidents.
- Some UFOs should eventually land or complete a mission profile, creating alien ground incidents such as terror raids, abductions, harvest sites, scouting operations, or landed UFO missions if not intercepted in time.
- Live alien research should eventually reveal alien command sites.
- Highest-tier live alien research gates alien base/final command-site discovery.
- Endgame final mission should become available after the correct chain of detection/research/escalation.

## Air War
Current aircraft ideas:
- Interceptors are faster and shorter range than Skyrangers.
- Multi-interceptor attack formation.
- Default gatling + small missiles.
- Large missiles purchasable.
- Energy weapons later.
- Aircraft ammo/upgrades.
- Aircraft fuel tank upgrades to extend practical range and make starting craft more useful before full aircraft replacement.
- Hangar assignment and empty hangar states.
- Named Skyranger/interceptor craft with Ready, Outbound, Returning, and Repairing status.
- Light post-sortie interceptor damage and clock-driven repair timers.
- Simple aircraft fuel/range readiness with clock-driven refueling.
- Interception stances that trade hit chance against ammo burn, fuel use, damage risk, and repair time.
- Lightweight UFO evasion / air-combat event outcomes: confirmed shootdown, damaged escape, evasive maneuvers, contact lost, forced disengage, ammunition pressure, and cautious breakaway.
- Compact air-combat after-action reports in UFO Tracking for launch, impact, delayed crash, and recovery phases.
- Lightweight damaged-UFO memory after damaged escapes, including follow-up hit bonuses and delayed crash-site chances.

Still planned:
- Pilot/crew identity if the air-war layer needs named aviators later.
- Fuller multi-step air-combat history and filtering if the report list grows beyond the current compact latest-report model.
- Fuel tank upgrade path for Interceptors and Skyrangers, likely through Workshop purchase/install or research unlocks, increasing fuel capacity/range while preserving automatic refueling.
- Deeper aircraft damage outcomes and repair cost/bay constraints.

---

# 10. Council Review / End-of-Month Game Bible

## Purpose
The Council Review is the monthly strategic report and narrative checkpoint. It should summarize the month, funding, panic, performance, and consequences.

## Current Issue Addressed
The **Next Slide** button previously moved around because slide content could change modal height.

## Latest Patch Goal
`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY` should:
- Give Council Review a stable slide frame.
- Keep footer buttons in a consistent location.
- Let long slide content scroll inside the body instead of resizing the whole modal.
- Preserve Skip to Reports / Next Slide usability.

## Future Council Review Improvements
- Better visual presentation.
- More specific Council commentary.
- Better standardized slide size and spacing.
- Replay monthly review.
- More readable graphs or status blocks.
- Ensure all controls remain stable across all slide types.

---

# 11. Audio / Music Game Bible

## Current Audio Features
- Music/SFX toggles.
- Volume sliders.
- Music changes automatically when moving between screens/sections.

## Known Preference
Music may need balancing:
- Music default can be low.
- SFX can remain high.
- Prior note: music around 5%, SFX around 100% felt closer to desired balance.

## New Roadmap Feature: Music Track Selection / Auto Mode
First pass built in v0.26.06.09.0030:
- Player can manually select the currently playing music track.
- Player can leave music in Auto Songs mode.
- Auto mode preserves current behavior where tracks switch when moving from one screen/section to another.
- Manual mode keeps the selected track while navigating between screens.
- Track selection is available from both normal and minimized header layouts.
- Current music/SFX sliders remain available.

Still planned:
- Save selected music mode and track preference if playtesting confirms the control shape.
- Refine compact selector layout if it feels too tall in the minimized header.
- Add more track labels if future music modes are added.

---

# 12. UI / Accessibility Game Bible

## Current UI Direction
- Dark mode support.
- Collapsible soldier cards.
- Cleaner soldier card actions.
- Barracks and Sickbay cards optimized to reduce clutter.
- Header minimized.
- Dropdowns and section controls preferred when cards become too busy.
- Build Health button in header/menu.
- Menu/Save access should remain easy.

## Important UI Rules
- Keep dense cards collapsible.
- Avoid burying vital status information.
- Do not let action buttons drift around if the player is stepping through repeated content.
- Preserve mobile responsiveness when possible.
- Preserve focus visibility and reduce-motion support.
- Avoid decorative layers blocking clicks.

## Future UI Polish
- More consistent card sizes.
- Better summary badges.
- Cleaner squad overview.
- Better soldier detail modal.
- More unified visual styling.
- Improved tactical screen space usage.
- Better music selector UI.

---

# 13. Roadmap Status

## Stage 1 — Stabilize Current Build
Status: **Complete**

Completed:
- Save / Load / Import / Export verification.
- Start screen / version verification.
- Command-section rendering fixes.
- Tactical / Simulated mission verification.
- Portrait / geoscape / UI regression repairs.
- Build Health / Campaign Self-Tests.
- 113/113 test pass verification.

---

## Stage 2 — Soldier Attachment / Soldier Life Systems
Status: **In progress, late Stage 2**

### 2.1 — Soldier Dossier Foundation
Status: **Complete**

Completed:
- Personality display.
- Background display.
- Service notes.
- Squad history.
- Cosmetic unlock notes.
- Record / kills / missions / wounds tracking.

### 2.2 — Editable Callsigns
Status: **Complete**

Completed:
- Edit Callsign.
- Random Callsign.
- Clear Callsign.
- Save/load persistence.
- Special callsigns:
  - Pirate Detective
  - Chat Ghost
  - Cogito

### 2.3 — Medals / Commendations
Status: **Complete**

Completed:
- First Blood.
- Survivor.
- Wounded in Action.
- Veteran.
- Ace.
- Field Promotion.
- Base Breaker.
- Earth’s Shield.
- Fallen Star.
- Commendation display in dossier.

### 2.4 — Squad History + Memorial Upgrade
Status: **Complete**

Completed:
- Squad Legacy panel.
- Current/former/KIA squad tracking.
- Memorial upgrades.
- Memorial sorting.
- Service summary improvements.
- Early KIA commendations:
  - Line of Duty
  - First Fallen

### 2.5 — Soldier Specializations
Status: **Complete / Polished**

Completed:
- Rifleman.
- Medic.
- Scout.
- Heavy.
- Sniper.
- Engineer.
- Assault.
- Officer.
- Auto specialization assignment.
- Assignment rebalance.
- Dropdown specialization selector.
- Squad role composition.
- Save/load persistence.

### 2.6A — Downtime Facilities Seed
Status: **Complete**

Completed:
- Training Center.
- Rec Room.
- Downtime assignment UI.
- Training progress seed system.
- Stress reduction seed system.
- Future optional minigame parking lot for Training Center drills and Rec Room games, to be added when interaction depth fits the roadmap stage.
- Rec Room downtime now separates soldier tastes for cards, pool, and darts. Training Center downtime separates tastes for shooting range, gym work, and running, so soldiers can like one activity without liking every activity in that facility.

### 2.6B — Soldier Stress / Morale Seed
Status: **Complete**

Completed:
- Stress values.
- Morale states.
- Mission stress increases.
- Rec Room stress reduction.
- Minor gameplay penalties/bonuses.
- Stress service notes.

### 2.6C — Soldier Needs and Preferences
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Soldiers autonomously choose downtime activities.
- Preferences influenced by stress/personality/specialization/background/recent events.
- Preferred activities visible in Soldier Dossier.
- Player sets guidance rather than micromanaging every recreation action.

### 2.6D — Facility Scheduling / First-Come-First-Served Usage
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Facilities have limited slots.
- Soldiers compete for preferred activities.
- Backup activities selected if full.
- Activity participation feeds friendship growth.

### 2.6E — Friendship and Attachment Growth
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Soldiers develop friendships.
- Shared downtime accelerates bonds.
- Shared missions accelerate bonds.
- Similar backgrounds/preferences improve compatibility.
- Friendships visible in dossier.

### 2.6F — Squad Cohesion Effects
Status: **Built / Needs playtest confirmation**

Implemented direction:
- Cohesion bonuses.
- Friend-death grief effects.
- Morale shocks.
- Officer mitigation.
- Rally recovery mechanics.

### 2.6G — Downtime / Friendship / Cohesion QA + Visibility Polish
Status: **Built / Needs playtest confirmation**

Latest patch:
`v0.26.05.25.2214_DOWNTIME_QA_COUNCIL_SLIDE_FRAME_INDEX_ONLY`

Included:
- Downtime QA/self-tests.
- Better visibility for preferred activity reasoning.
- Daily downtime summary text.
- Council Review fixed slide frame.

Recommended next action: test and verify before moving to 2.7.

---

## Stage 2.7 — Memorial Offerings / Personal Tributes
Status: **Built / pending player playtest confirmation**

Built in v0.26.06.08.2415:
- Expanded memorial offerings to 100 distinct tribute item types.
- Added 20 contextual message patterns that reference the item, activity, donor, fallen soldier, mission, or region.
- Updated in v0.26.06.09.1719 with the supplied Memorial Offerings Content Pack: 100 tagged item types and 80 tagged message templates, including item-specific messages for Rec Room, medic, engineer, crash-site, mission, training, barracks, and personal tribute contexts.
- Updated in v0.26.06.09.1750 with the expansion pack: +50 offering items and +120 non-duplicate messages, for 150 tagged items and 200 message templates total.`n- Updated in v0.26.06.10.0100 with the Rec Room Memorial Content Pack: +50 tagged rec-room/adult-offtime/game keepsake items and +81 tagged messages, for 200 tagged items and 281 message templates total. Selection now supports cards, pool, darts, music, movies, chess/dice, rivalry, close-friend absence, and subtle adult-offtime keepsakes with wording guardrails.`n- Updated in v0.26.06.10.0200 with the Massive Memorial Message Library JSON: +3,500 fallback/variety messages across 7 relationship tiers and 10 item categories. Existing hand-written messages remain preferred when they are strong contextual matches. The massive library scores relationship tier first, item category/tags second, and tone third; it supports rival-respect and deep-bond gating, per-fallen message ID history, and recent global duplicate reduction.
- Memorial friendship tiers: 4-7 Buddy can rarely leave a simple offering only with same-squad, same-fatal-mission, or witnessed-death context; 8-13 Friend is the normal offering threshold; 14-24 Close Friend has high chance for emotionally specific personal offerings; 25+ Deep Bond enables premium emotional tags for anniversary visits, post-victory/final-mission offerings, and highly specific shared-history items. Friendship scores still clamp to the existing 99 max.
- Memorial donors now need a believable reason to leave something: friendship, respect, shared squad history, downtime bond, officer/medic/engineer role context, mission-survivor connection, or command tribute fallback. Soldiers with strong rivalry/dislike and no meaningful respect are suppressed.
- Added a lightweight rivalry/dislike layer for soldier relationships based on personality friction, mismatched downtime preferences, stress gaps, role rivalry, and background/work-style tension.
- Preserved clickable tribute inspection and save-compatible memorial offering normalization.
- Added Sickbay/forced-deployment equipment validation so recovered or force-assigned soldiers with missing weapon/armor attempt to equip the best available inventory by rank, XP, combat strength, then coin-flip tie breaker.
- Set Barracks Guidance default to Autonomous and added a Barracks bulk button to set all ready Barracks soldiers to Autonomous.
Goals:
- Clickable tribute items.
- Relationship-based offerings.
- Emotional inspected-item writing.
- Persistent memorial history.
- Offerings left by friends, squadmates, survivors, officers, or rescued soldiers.
- Offerings should reference actual relationships/events when possible.

Recommended patch name:
`Alien_Response_Command_Game_v0_26_MM_DD_HHMM_MEMORIAL_OFFERINGS_SEED_INDEX_ONLY`

Suggested implementation steps:
1. Add memorialOffering data structure.
2. Generate offerings on soldier death, monthly review, or after friend/squadmate survives a mission.
3. Display offering list on each KIA memorial entry.
4. Add inspect modal with short emotional text.
5. Add Build Health tests:
   - KIA can receive offering.
   - Friend is more likely to leave offering.
   - Offering persists through save/load.
   - Inspect text renders safely.
   - Memorial still works with no offerings.

---

## Stage 2.8 — Squad Leadership / Chain of Command
Status: **Built / pending player playtest confirmation**

Completed:
- Squad lead + second-in-command are selected automatically.
- Leadership selection weighs rank, bravery, Officer specialization, background, service history, missions, and commendations.
- Small cohesion/morale command bonuses are calculated and surfaced on the Squad screen.
- Squad-leader death creates survivor morale shock.
- A surviving second-in-command can rally the squad and record a service note.
- Mission results can call out leader loss and second-in-command rally events.
- Build Health tests cover leader selection, second-in-command selection, command bonus bounds, leader death shock, second-in-command rally, active squad command resolution, and command event report text.

Still planned:
- Manual officer assignment or lock-in options if auto-selection feels too opaque.
- Additional Officer specialization interactions during tactical missions.

---

## Stage 3 — Tactical Readability
Status: **Started / Partially complete**

Completed:
- Tactical sprite visibility fixes.
- Larger tactical units.
- Movement pacing improvements.
- Shot origin improvements.
- Camera stability improvements.
- Replay stability fixes.
- Shot/death timing sync.
- Classic Lineup Sim View restoration.
- Simulated/classic playback speed controls: Slow, Normal, Fast, and Instant.

Still planned:
- Tactical event log.
- Better unit selection/facing indicators.
- Better impact/miss feedback.
- Battlefield-space optimization.
- Simulated mission sprite consistency.

Possible next Stage 3 patch:
`TACTICAL_EVENT_LOG_AND_FEEDBACK_PASS_INDEX_ONLY`

---

## Stage 3.5 — UI / Audio / Quality-of-Life Polish
Status: **Started / first pass built**

Completed / first pass:
- Music Track Selection / Auto Songs mode.
- Manual Song mode from the normal header.
- Manual Song mode from the minimized header.
- Better exposed music labels through the selector.
- Base downtime location visualization seed: individual soldiers can be represented on the base grid according to downtime activity and wounded status.
- Geoscape command-globe styling pass.

Still planned:
- Save music preference if playtesting confirms the selector behavior.
- Audio balance defaults.
- More consistent modal/button layouts.
- More responsive tactical/base panels.
- More card collapse refinements.
- Stronger Skyranger in-flight presentation that matches the rest of the command-interface aesthetic.
- Fuller live-base animation layer for soldiers moving through halls and rooms during downtime.

Recommended patch:
`BASE_ACTIVITY_ANIMATION_AND_SKYRANGER_FLIGHT_POLISH_INDEX_ONLY`

---

## Stage 4 — Campaign Completion
Status: **Foundation started**

Completed / first pass:
- Geoscape ticking time.
- UFO spawning.
- Radar detection.
- Interceptors.
- Aircraft ammo/upgrades.
- Save-compatible aircraft identity/readiness state.
- Named Skyranger/interceptor craft with launch/return/repair status.
- Light interceptor damage and clock-driven repair timers.
- Aircraft fuel/range readiness and clock-driven refueling.
- Cautious/Standard/Aggressive interception stance choices.
- Richer UFO evasion / air-combat event outcomes with stance-visible launch summaries and report lines.
- Compact air-combat after-action reports and damaged-UFO memory after damaged escapes.
- Crash-site incidents.
- Hidden command-site discovery gating.
- Base hallway/pathing foundation where hallways are represented by the grid lines around rooms, not by room tiles.
- Base invasion readiness helpers for entry points, traversable layout, containment reachability, and air-defense reduction.
- Air Defense Battery seed facility.

Still planned:
- Command Objectives Tracker.
- Alien escalation over months.
- Smooth Geoscape time-compression model where aircraft/UFO perceived speed scales with the selected clock rate without breaking real route duration, repair, refuel, or event timing.
- Base-centered radar range and contact-quality model where UFO detection depends on distance from each base's radar facilities.
- Geoscape overlay filter controls for showing/hiding radar and aircraft range rings around each existing base.
- Selected-base scoping for base-local screens such as Barracks, Squads, Hangars, Sickbay, Workshop/Base Stores views, and personnel/equipment readiness lists.
- Base-to-base transfer logistics for soldiers, weapons, armor, aircraft stores, and other portable equipment, with transfer time/cost and clear origin/destination state.
- UFO landing / terror-style incident chain where flying UFOs have mission intent and can touch down or complete operations that create ground incidents and panic consequences.
- Live alien research chain polish.
- Command-site assault rewards.
- Final mission path.
- Victory/defeat endings.
- Base invasion event chain.

## Stage 4B — Base Invasions / Facility Defense
Status: **Roadmapped / foundation started**

Design target:
- Larger alien ships can locate and land at a player base later in the campaign.
- Base invasions enter through the central Access Lift/elevator and through Hangars.
- The actual base layout directly determines the tactical/base-defense map.
- Hallways fit around the outside of facilities/rooms as the grid lines/gaps between room tiles and become the primary movement lanes.
- Soldiers physically present in the base respond from their current locations.
- Sickbay soldiers start with whatever equipment they currently have on them; stripped patients must reach a Barracks/Base Stores arms locker or pick up dropped weapons.
- Dropped human or alien weapons can be recovered during the defense.
- Soldiers can use alien weapons only after the relevant alien weapon research is completed in the Laboratory.
- If attackers reach Alien Containment, they can free captured aliens there, adding them to the attacking force.
- Air Defense Batteries can damage incoming ships, potentially driving them off or reducing how many attackers breach the base.
- Base Stores should function as arms/armor locker points for emergency rearming.
- The live downtime base view should eventually become the pre-invasion state: soldiers seen moving/resting/training in the base are the same soldiers who must react when the alarm hits.

Recommended staged implementation:
1. Expand hallway/base-grid rendering and connectivity rules, keeping hallways as the grid spaces around rooms.
2. Add persistent soldier base-location state and simple movement between downtime destinations.
3. Add base-defense tactical map generation from the real base grid.
4. Add invasion trigger rules from large alien craft and campaign escalation.
5. Add air-defense interception roll before breach.
6. Add emergency arming behavior from stores/barracks and dropped equipment.
7. Add containment breach/free-captive behavior.
8. Add mission report and council consequences for successful or failed base defense.

Recommended design: Stage 4 should focus on making the campaign finishable while building base invasion as the major late-campaign defensive threat.

---

## Stage 5 — Release Prep / Paid Alpha
Status: **Not yet started in earnest**

Planned:
- Tutorial/onboarding.
- Difficulty settings.
- Balance pass.
- Bug-fix pass.
- Itch.io page assets.
- Trailer GIFs/screenshots.
- Store copy.
- Alpha release packaging.
- Basic analytics or feedback collection if appropriate.
- Known issues list.
- Control/help screen.
- First-run player guidance.

---

# 14. Next Recommended Patch

## Immediate Recommendation
Playtest `v0.26.07.08.0140_BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH` before expanding transfers to equipment and base-local stores.

Focus verification on:
- Geoscape Clock modes showing Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- The active clock mode displaying a readable compression/rate label.
- Aircraft/UFO visible progress feeling faster at higher compression while still completing from elapsed Geoscape minutes.
- Repair, refuel, delayed crash, UFO movement, and mission timers remaining clock-based under every compression mode.
- Tactical/manual mission states, council slides, and blocking modal states still stopping automatic time flow.
- Build New Base placement mode showing dotted aircraft reach rings centered on the proposed site.
- Interceptor and Skyranger current practical reach rings matching the aircraft range profile.
- Fuel tank upgrade preview rings appearing only when the relevant tank upgrade is not already owned.
- The New Base Site summary explaining dotted aircraft reach values near the confirm controls.
- Base construction still creating the expected Access Lift seed layout after using the preview.
- New campaigns showing one Shortwave Radar in the starting base.
- UFO Tracking coverage showing one shortwave radar counted at campaign start.
- Expansion bases still starting with only the free Access Lift layout.
- Fort Aegis and N. Africa both listing ready Skyrangers while a Fort Aegis squad launches from the Fort Aegis Skyranger to an in-range incident.
- Mixed-base response forces producing a blocker that names which soldiers are stationed away from the selected launch base.
- UFO Tracking listing only contacts that are detected/known or currently inside radar range.
- Shortwave Radar showing local/regional coverage while Longwave Radar reaches farther strategic contacts.
- Per-contact radar text naming the detecting base/radar source and contact quality.
- Overlapping radar coverage improving contact quality/detection chance in Build Health.
- UFO Tracking showing mission intent/risk once contact quality is strong enough.
- Active UFOs sometimes completing operations into landed/terror-style incidents instead of only escaping.
- Crash-site incidents staying distinct from landed/terror-style incidents.
- Damaged or disrupted UFOs delaying/downgrading later ground incident threat/panic.
- Build Health including the new `UFO mission intents can create landed terror incidents` row.
- Geoscape Range Overlays controls toggling Shortwave, Longwave, Interceptor, Skyranger, and All Off.
- Dotted/dashed base-centered overlay rings staying visually distinct from new-base placement preview rings.
- Aircraft overlay reach updating from Interceptor Drop Tanks and Skyranger Extended Tanks.
- Squads screen available-soldier list showing only soldiers stationed at the selected squad's base.
- Same-base soldiers still appearing as assignable and wrong-base soldiers being hidden/blocked.
- Build Health including `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.
- Barracks showing soldiers stationed at the currently selected base only.
- Sickbay showing wounded/recovering soldiers stationed at the currently selected base only.
- Transfer buttons appearing on ready Barracks soldiers when more than one base exists.
- Transferred soldiers appearing in Personnel Transfers, becoming unavailable while in transit, and arriving after Geoscape clock time advances.
- In-transit soldiers being blocked from squad assignment and mission launch.
- Build Health including `Base-local rosters and soldier transfers keep personnel available only at their base`.
- Interceptor Tanks and Skyranger Tanks cards appearing in UFO Tracking beside aircraft ordnance.
- Interceptor Drop Tanks installing for $320k and raising Interceptors to 135 fuel / 10,500km practical range.
- Skyranger Extended Tanks installing for $440k and raising Skyrangers to 130 fuel / 20,800km practical range.
- Old saves normalizing missing tank flags safely.
- Saves with tank flags applying upgraded range/fuel values to existing aircraft during load/migration.
- Newly ordered Interceptors or Skyrangers inheriting the purchased global tank upgrade.
- Longer sorties becoming possible only when upgraded range/fuel actually supports the route.
- Refueling still advancing automatically through Geoscape clock time with no funds or Base Stores requirement.
- Latest Air Combat report card appearing in UFO Tracking after an interception.
- Per-contact Last air contact details appearing after damaged escape, contact lost, evasive maneuvers, forced disengage, ammunition pressure, or breakaway.
- Damaged Escape UFOs showing damaged-memory follow-up hit bonus and delayed crash chance.
- Damaged UFOs sometimes creating delayed crash sites as Geoscape clock time advances.
- Existing saves or playtest states with interceptors stuck in `Outbound` / `Returning` recovering into a short Repairing window instead of staying permanently unusable.
- Active interceptor flights showing `Outbound` before the attack leg and `Returning` after the attack leg.
- Grounded recovered interceptors gaining fuel again when Geoscape time advances.
- Interceptor launches showing richer outcomes, hit estimate, combat roll, evasion pressure, fuel cost, launch base, and clock-based ETA.
- UFO Tracking showing hit estimate and evasion pressure while still respecting range/fuel/base readiness.
- Outcomes such as Confirmed Shootdown, Damaged Escape, Contact Lost, Forced Disengage, Ammunition Pressure, and Breakaway appearing clearly in practical play over several launches.
- Old saves normalizing a valid aircraft fleet with fuel/range fields.
- Starting hangars showing named Skyranger/interceptor fuel, range, readiness, repair, and refuel state.
- Multi-base campaigns where interceptors stationed in a newer base can intercept nearby UFOs even when the first base is out of range.
- Multi-base campaigns where Skyranger mission launch originates from the Skyranger's assigned base and blocks squads whose soldiers are stationed elsewhere.
- Interceptor ready count and fuel dropping on launch, then recovering after return/repair/refuel.
- Repair and refuel timers advancing only through Geoscape clock time.
- Skyranger mission launch/return still using the clock-based travel contract.
- New-base placement mode showing the name field, selected site summary, cost, and confirm button immediately above the Geoscape globe.
- Build Health passing all checks in browser.

## Best Next Feature Patch
If this batch tests well, continue with the next priority roadmap patch:

`BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`

Suggested focus:
- Give workshop orders an explicit production/base destination instead of implicitly using the selected base at day-end.
- Surface equipment transfers in a compact Logistics/Transfers summary so players can review inbound and outbound payloads without opening each item card.
- Tighten mission loadout messaging so local base stock, issued gear, and in-transit gear are easy to distinguish before launch.
- Consider transfer costs and transfer cancellation rules after the core flow is playtested.
- Preserve global access for Mainframe/research database/alien intel/reports/memorial records.
- Add Build Health coverage for workshop destination stock, transfer UI summaries, local loadout messaging, old-save normalization, and no-regression soldier transfers / Skyranger stationing.

## Near-Term Starting Base Upgrade Candidate
Implemented in `v0.26.07.06.0155_STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY_PATCH`; keep this section as the reference contract for any future starting-base template adjustments:

`STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY`

Suggested focus:
- Add one Shortwave Radar to the default Fort Aegis starting layout.
- Keep newly constructed expansion bases seeded only with their intended starter facilities unless a later base-template system changes this.
- Preserve the existing starting hangar layout and avoid crowding or overlapping the base grid.
- Ensure radar detection/coverage calculations count the seeded Shortwave Radar.
- Surface the starting radar clearly in Base Facilities and any radar-readiness summaries.
- Add Build Health coverage for first-base facility seeding, old-save normalization, radar count/detection coverage, and no-regression base construction behavior.

## Near-Term Base Placement Planning Candidate
Implemented in `v0.26.07.06.0165_BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY_PATCH`; keep this section as the reference contract for future base-placement planning overlays:

`BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY`

Suggested focus:
- While Build New Base placement mode is active, show dotted circular range overlays centered on the proposed new base site.
- Use the existing aircraft range profiles so the player can see practical Interceptor and Skyranger reach before confirming construction.
- Show separate dotted circles for current Interceptor and Skyranger reach, plus upgraded fuel-tank preview rings when those upgrades are not already purchased.
- Keep the overlay lightweight and readable on the Geoscape globe: thin dashed/dotted rings, restrained colors, and no large opaque coverage fills.
- Update the selected-site summary to explain what the dotted circles represent, including approximate radius/range values.
- Preserve current base-placement confirmation behavior, construction cost, validation, and save compatibility.
- Add Build Health coverage for placement-mode range preview state, range values matching aircraft profiles/upgrades, no overlay when placement mode is inactive, and no regression to new-base construction.

## Near-Term Radar Model Candidate
Implemented in `v0.26.07.07.0140_BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY_PATCH`; keep this section as the reference contract for future radar polish:

`BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`

Suggested focus:
- Give each base radar facility a detection radius from that base's geoscape location.
- Make Shortwave Radar a local/regional detection source and Longwave Radar a wider strategic detection source.
- Replace or supplement the current global radar coverage score with distance-based per-UFO coverage from eligible bases.
- Let overlapping radar fields improve detection chance, tracking speed, contact quality, or intercept solution accuracy.
- Track contact quality states such as Faint Echo, Tracked Contact, and Precise Fix before a UFO becomes fully actionable.
- Surface which base/radar network is detecting or tracking each UFO in UFO Tracking.
- Keep old saves compatible by deriving radar coverage from existing base facilities.
- Add Build Health coverage for distance-based detection, out-of-range UFO invisibility, overlapping coverage bonuses, Shortwave vs Longwave range differences, contact-quality progression, old-save normalization, and no-regression interceptor launch behavior.

## Near-Term Geoscape Overlay Filter Candidate
Future patch candidate:

`GEOSCAPE_RANGE_OVERLAY_FILTERS_INDEX_ONLY`

Suggested focus:
- Add a compact Geoscape overlay/filter control that lets the player choose which base-centered rings are visible.
- Ring options should include Shortwave Radar range, Longwave Radar range, Interceptor practical reach, Skyranger practical reach, and an All Off state.
- Rings should render around existing bases, not only proposed new-base sites.
- Use dotted or dashed lightweight circles with restrained colors so overlays help planning without covering the globe.
- Respect aircraft fuel tank upgrades when showing current Interceptor and Skyranger practical reach.
- Make the control persistent/save-compatible if possible, but safe to default to a readable setting for old saves.
- Keep base-placement range preview behavior intact; placement-preview rings and existing-base overlay rings should not visually fight each other.
- Add Build Health coverage for overlay filter state, per-ring visibility, upgraded aircraft range values, radar ring values, all-off hiding, and no-regression base-placement preview behavior.

## Near-Term Multi-Base Scope and Transfers Candidate
Future patch candidate:

`BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`

Suggested focus:
- Base-local screens should show information for the currently selected base when the data is physically local to a base.
- Barracks should list only soldiers stationed at the selected base, with clear counts for other bases.
- Squads should only assign soldiers stationed at the selected base unless a future explicit cross-base task force mode exists.
- Sickbay should show wounded soldiers at the selected base; global memorial/history views can remain shared.
- Hangars should show aircraft housed at the selected base and preserve assigned-base launch logic.
- Base Stores / equipment views should separate local stock from globally shared knowledge. Mainframe, research database, alien intel, reports, and memorial records remain globally accessible.
- Add base-to-base transfers for soldiers and portable equipment such as weapons, armor, medkits, recovered materials, and aircraft ammunition where appropriate.
- Transfers should have origin base, destination base, item/person payload, travel time, optional cost, and clear in-transit status.
- Soldiers in transit should be unavailable for squads/missions until they arrive.
- Equipment in transit should be unavailable at both origin and destination until arrival.
- Preserve save compatibility by normalizing older soldiers/equipment into the selected/first base if no base-local state exists.
- Add Build Health coverage for selected-base roster filtering, wrong-base squad assignment blocking, transfer creation, in-transit unavailability, arrival at destination, equipment stock movement, old-save normalization, and no-regression Skyranger stationing behavior.

## Near-Term Geoscape Time Candidate
Implemented in `v0.26.07.06.0175_SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY_PATCH`; keep this section as the reference contract for future time-control polish:

`SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY`

Suggested focus:
- Replace the chunky tick-feeling Geoscape controls with smoother time compression modes inspired by X-COM: Pause, 5 Seconds, 1 Minute, 5 Minutes, 30 Minutes, 1 Hour, 6 Hours, and 1 Day.
- Keep simulation authoritative in elapsed Geoscape minutes while using a consistent one-second real-time cadence for automatic advancement.
- Make perceived aircraft/UFO speed visibly scale with selected time compression: fast time should make craft progress faster, slow time should make them creep.
- Preserve current route duration math, fuel use, repair, refuel, UFO progress, delayed crash, Skyranger travel, and interceptor return timing.
- Pause or slow time automatically for important prompts such as new radar contact, mission landing/terror incident, interception result, crash site, base invasion warning, or council-critical event.
- Surface the active time scale clearly near the Geoscape clock without making the interface feel like an End Day/End Month button stack.
- Add Build Health coverage for time-scale conversion, route progress scaling, clock-accurate travel completion, repair/refuel progression, UFO movement progression, and no-regression tactical/modal clock blocking.

## Near-Term Campaign Escalation Candidate
After fuel tanks, the starting radar seed, smoother Geoscape time, and base-centered radar range, consider:

`UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`

Suggested focus:
- Give active UFOs a simple mission intent such as Recon, Abduction, Terror Raid, Harvest, Base Scout, or Supply.
- Let some UFOs land or complete their operation when flight progress reaches a threshold instead of only escaping.
- Generate a ground incident from that UFO's size, region, alien type, mission intent, and detection state.
- Keep crash sites separate from landed/terror incidents: shootdowns create crash sites, while missed/ignored operations create alien activity incidents.
- Add panic/funding consequences for ignored terror-style incidents and smaller consequences for lesser operations.
- Let successful interception prevent, delay, downgrade, or alter the incident depending on outcome.
- Surface UFO mission intent and landing/operation risk in UFO Tracking once enough radar contact is available.
- Add Build Health coverage for UFO mission intent normalization, landing incident generation, panic consequences, interception prevention/downgrade, old-save compatibility, and no-regression air travel/damage behavior.

---

# 15. Codex Implementation Guidelines

## General
- Work inside `index.html` unless explicitly adding assets.
- Preserve existing functions and tests.
- Avoid large rewrites when a targeted patch is safer.
- Keep save/load backward compatible.
- Defensive coding: handle missing fields on old saves.
- Prefer small helper functions over duplicating logic.
- Keep UI copy short and readable.

## Testing
After changes:
1. Run JavaScript syntax check on inline scripts.
2. Run Build Health in browser if possible.
3. Verify version label.
4. Verify no console errors on load.
5. Verify save/load still works.
6. Verify old saves do not crash if new fields are absent.

## Save Compatibility
When adding fields to soldiers, squads, memorial entries, facilities, or campaign state:
- Default missing values on read.
- Avoid assuming every soldier has new arrays/maps.
- Add migration/normalization helper when needed.
- Do not break existing exported saves.

## UI Safety
- Do not make cards taller unless collapsible.
- Avoid buttons shifting during repeated interactions.
- Use internal scroll areas for variable-length content.
- Keep mobile/narrow width pressure in mind.
- Keep focus rings visible.

## Narrative Text
- Keep memorial/service note text concise.
- Prefer specific details over generic praise.
- Use actual available game data when possible:
  - friend name
  - squad name
  - mission count
  - kills
  - wounds
  - shared downtime activity
  - specialization
  - rank

---

# 16. Open Design Questions

These are not blockers, but should be kept in mind.

1. How much should the player directly control soldier downtime vs broad guidance?  
   Current direction: broad guidance, not micromanagement.

2. Should friendships ever create negative effects beyond grief?  
   Possible future: panic, refusal, rivalry, overprotectiveness.

3. Should squad cohesion affect tactical outcomes visibly?  
   Current direction: yes, but it needs clear UI/event-log explanation.

4. Should the campaign be made finishable before adding more life-sim detail?  
   Recommended answer: yes, while using base-invasion/downtime visualization work as systems that support campaign escalation.

5. Should the HTML version stay the paid alpha, with Godot saved for a sequel?  
   Current direction: yes.

6. How tactical should base invasions become in this HTML version?  
   Current direction: use an X-COM-style base-defense model, but stage it carefully: visual base pathing first, then map generation, then invasion combat.

---

# 17. One-Paragraph Codex Summary

Alien Response Command / Project Aegis is a single-file HTML X-COM-like strategy game focused on base management, tactical alien response, and soldier attachment. The current build is `v0.26.06.10.0300_BASE_ACTIVITY_ANIMATION_AND_INVASION_MAP_SEED_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH`, which corrects hallways to be textured grid-line/gap spaces around facilities rather than buildable room tiles, adds `assets/base_tiles/hallway.png`, keeps the Air Defense Battery seed facility, base-invasion readiness helpers, persistent soldier base-location state, Live/Static downtime movement markers in the Base view, Base Defense Preview seed panel, a geoscape command-globe styling pass, tagged relationship-aware memorial offerings, 200-item/281-handwritten-message memorial expansion content plus a 3,500-message fallback library, Buddy/Friend/Close Friend/Deep Bond offering tiers, object-matched memorial messages, separated Rec Room/Training Center activity tastes, rivalry/dislike relationship suppression, and future parked Rec Room/Training Center minigame scope. Stage 1 is complete. Stage 2 soldier-life systems are built through Stage 2.8 pending playtest confirmation. Stage 3/3.5 UI/audio/tactical polish is in progress. Stage 4 campaign completion now includes a clear base-invasion roadmap where real base layout, hallway-grid movement, Access Lift, Hangars, Sickbay gear state, Base Stores arms lockers, Alien Containment breaches, air defense, and alien weapon research all matter. Maintain index-only patching, matching displayed version/build zip names, save compatibility, Build Health coverage, and stable UI layouts.

## 2026-06-10 Patch Notes - Base Time Alerts and Geoscape Interceptor Visuals

Build `v0.26.06.10.0310_SICKBAY_BASE_TIME_AND_GEOSCAPE_INTERCEPTOR_VISUALS_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` adds the next strategic-map and base-life pass:

- Fixed forced-Sickbay mission return exploit: a wounded or overflow-recovering soldier who is forced onto a mission and comes back alive without new wounds keeps their prior wound/recovery status instead of becoming fully healed.
- Base view now auto-selects 5-minute geoscape ticks when opened so live soldier movement can be watched at a useful cadence.
- Base downtime movement now advances on geoscape clock ticks, giving soldiers visible movement between current and destination base locations instead of only updating during daily downtime resolution.
- Personnel arrivals for ordered soldiers, scientists, and engineers now raise a time-control alert so the player can pause or switch to 5m/30m/1h before updating squads, research, or workshop orders.
- Newly detected UFO contacts now raise the same kind of time-control alert for UFO tracking/interception decisions.
- Tracked UFOs now drift across the geoscape as time advances instead of staying pinned to their original contact point.
- Geoscape clouds now get a fresh visible offset and slide direction on time ticks, avoiding the repeated same-position reset.
- Interceptor launches now create a temporary geoscape attack run using one to four visible interceptor craft, with weapon-fire visuals based on the available aircraft weapon set.
- Build Health coverage expanded for Sickbay mission returns, Base auto-speed, arrival/contact prompts, tick-based movement, moving UFOs, and interceptor formation payloads.

Roadmap follow-up: continue evolving interception from a visual attack run into a fuller air-combat layer with travel time, return-to-base handling, interceptor damage/repair, fuel/range, pilot/aircraft identity, and richer UFO evasive behavior. Keep the current geoscape visuals as the first readable layer before adding deeper tactical air combat.

## 2026-06-10 Patch Notes - Interceptor Return, Crash, Cloud, and Base Doll Motion

Build `v0.26.06.10.0320_INTERCEPTOR_RETURN_CRASH_CLOUD_AND_BASE_DOLL_MOTION_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` refines the geoscape and Base activity presentation:

- Interceptor attack runs are slowed down from the initial fast pass; they remain faster than Skyrangers but give the player time to read the launch, approach, firing pass, and return/crash result.
- Missed interceptor attacks now make the firing pass and return to base before the interceptors become available again.
- Successful interceptor attacks now show a small explosion and crashing UFO effect at the target.
- UFO tracking alerts now route the player to Geoscape after they choose a time speed, so interceptor launch controls are immediately available.
- Cloud movement now uses independent per-cloud offsets and headings instead of locking all clouds into the same relative formation.
- Clouds continue drifting during pause; time ticks refresh the cloud seed, but pause itself no longer requires clouds to jump.
- Base activity markers now use miniature soldier paper-dolls with initials overlaid, plus small idle movement while soldiers are on station in a room.
- Wounded soldiers now prefer the same Sickbay destination until the notional room capacity fills, preventing two wounded soldiers from being spread across two Sickbay rooms unnecessarily.
- Build Health coverage expanded for Sickbay grouping, cloud independence, idle Base marker motion, and UFO prompt routing.

Roadmap follow-up: continue improving air combat readability with hit/miss timing, damage states, interceptor return/repair state, and eventual interception tactical choices. Continue improving Base life by moving paper-doll markers toward hallway-aware overlays and room-specific idle animations.

## 2026-06-10 Patch Notes - Deferred UFO Crash Marker and Interceptor Return Camera

Build `v0.26.06.10.0330_DEFERRED_UFO_CRASH_MARKER_AND_INTERCEPTOR_RETURN_CAMERA_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` refines successful interceptor attacks on the Geoscape:

- Successful interceptor attacks now keep the UFO model visible during launch, approach, and firing instead of immediately replacing it with a crash-site incident marker.
- Crash-site incidents are now created only after the explosion/crash visual beat, so the marker appears after the UFO is visibly shot down.
- Successful attacks now continue showing the interceptor formation returning to base after the hit, matching the miss flow and keeping the return trip readable.
- The Geoscape camera target follows the interceptor run through the return leg so players can watch aircraft come home after the shootdown.
- Build Health coverage remains green for the full campaign self-test suite after the deferred crash marker and return-run timing changes.

Roadmap follow-up: keep building the interception layer toward persistent aircraft state, return-to-base service windows, damage/repair outcomes, and deeper UFO/interceptor encounter choices. The current geoscape run should remain visually readable as those mechanics are added.

## 2026-06-29 Patch Notes - Three.js Geoscape and Camera Ownership

Build `v0.26.06.29.0100_THREE_GEOSCAPE_CAMERA_OWNERSHIP_AND_SOLAR_DAY_NIGHT_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` upgrades the Geoscape presentation and fixes camera ownership during simulation ticks:

- Normal Geoscape time ticks, UFO drift, cloud refreshes, and background simulation updates no longer auto-recenter the camera on North America or the first base.
- Explicit focus actions remain allowed: selected regions, selected incidents, Skyranger travel, interceptor travel, and reset-token behavior can still move the camera intentionally.
- Cinematic travel now uses a separate camera center while updating the player view to the travel endpoint, so control returns without snapping back to the starting base after a Skyranger or interceptor sequence.
- The flat primary globe presentation now has a local Three.js-rendered sphere underneath the existing marker overlay, with recognizable continent meshes, rim lighting, atmosphere, clouds, and retained SVG marker/click layers.
- A local `assets/vendor/three.min.js` dependency is packaged with the build so the globe does not require a CDN connection.
- The Geoscape globe now receives campaign clock state and computes a sun vector from month/day/minute, letting the day-night lighting direction advance with the campaign clock.
- Build Health coverage expanded for camera ownership, player/cinematic camera separation, Three.js initialization helpers, globe marker compatibility helpers, and solar clock movement.

Roadmap follow-up: continue the Three.js migration by moving markers/routes from the SVG overlay into native 3D billboards and arcs, then add interactive globe drag/zoom controls that write back into the same player-owned camera state. Preserve the current camera ownership rules as the globe becomes more fully 3D.

## 2026-06-29 Patch Notes - Aligned Three.js Geoscape Projection

Build `v0.26.06.29.0110_ALIGNED_THREE_GEOSCAPE_AUTHORITATIVE_PROJECTION_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` fixes the mixed Three.js/SVG Geoscape globe presentation:

- The SVG orthographic projection is now the authoritative geography, marker, route, and click/placement model again, so bases, UFOs, incidents, labels, and route effects share one camera/orientation source.
- The Three.js layer no longer draws independent continent meshes that can drift away from the overlay. It now provides a restrained spherical ocean/lighting backdrop under the projected landmasses.
- Region and island fills were restored to readable opacity so North America, Europe, Africa, South America, East Asia, and Oceania visibly line up with their labels and markers.
- The oversized cyan rim/ring was reduced to a subtle atmospheric sphere, avoiding the previous target-disc/second-shell look.
- A subtle clock-driven gloss/night overlay now uses the same Geoscape clock sun-vector helper without changing marker projection.
- Camera ownership rules from the previous patch remain intact: normal time ticks and background simulation updates do not snap the player view back to the first base.
- Build Health coverage expanded with an authoritative projection test for visible region centers, hidden far-side points, zoom scaling, and the clock-driven terminator overlay.

Roadmap follow-up: a future deeper Three.js pass should move the marker layer into true 3D billboards/arcs only after the 3D camera, click picking, hidden-side rejection, and SVG fallback all share one tested coordinate transform.

## 2026-06-29 Patch Notes - Three.js Globe Owns the Geoscape Surface

Build `v0.26.06.29.0130_THREE_GLOBE_OWNS_GEOSCAPE_SURFACE_ALIGNED_MARKERS_COUNCIL_SLIDE_FRAME_INDEX_ONLY_PATCH` moves the visible Geoscape Earth surface into the Three.js layer:

- The Three.js canvas now owns the visible globe surface, ocean sphere, and landmass meshes instead of acting as a decorative backing behind the old SVG map.
- Three.js landmasses are rebuilt from the same orthographic lon/lat projection math used by marker placement, so tactical SVG markers, labels, and routes align with the Three globe surface.
- The old SVG continent/terrain/river/road visual map has been removed from the visible geography layer. SVG is now reserved for operational overlays, labels, boundaries, markers, routes, clouds, and effects.
- The landmass set was expanded into more Earth-like simplified continents and islands: Alaska, Canada, main North America, Central America, Caribbean, Greenland, South America, Europe, Britain/Ireland, Africa, Madagascar, Asia, India/Southeast Asia, Japan, Indonesia, Australia, New Zealand, and Antarctica.
- Camera ownership protections remain in place: ordinary time ticks and background simulation updates should not snap the Geoscape camera back to the first base.
- Build Health now verifies Three surface alignment with marker projection, the larger Earth-like landmass set, zoom/projection behavior, and the existing Geoscape camera ownership rules.

Roadmap follow-up: continue improving the Three.js globe toward true interactive 3D drag/pick controls, but keep the tested shared projection contract until all SVG overlays have equivalent Three billboards/arcs.

## 2026-07-04 Patch Notes - Aircraft Clock Speed and Council Frame Repair

Build `v0.26.07.04.0053_AIRCRAFT_CLOCK_SPEED_COUNCIL_FRAME_INDEX_ONLY_PATCH` repairs two roadmap-critical presentation and simulation contracts:

- Council Review slides now use a shared fixed-frame contract for the modal overlay, slide body, and stable footer controls instead of relying on a stale build-name marker for Build Health.
- The Council Review fixed-slide-frame Build Health row now tests the actual modal frame/footer helper, including fixed overlay placement, bounded slide height, scrollable body, and persistent Skip/Next/Finish controls.
- Skyranger and interceptor travel now use aircraft top speed, Earth-scale route distance, and elapsed Geoscape clock minutes to advance progress.
- Short aircraft trips finish sooner because they cover less distance. Long trips take proportionally longer instead of changing the aircraft's speed.
- Interceptor runs still use the existing outbound and return visual path, but progress is now clock-driven from 0-100 outbound and 100-200 return.
- Successful interceptor hits defer crash-site creation until the attack reaches the UFO; interceptor availability returns only after the clock-driven return leg completes.
- Launch messages now include route ETA/top-speed feedback so the player can read why a craft is still en route.
- Build Health coverage now includes fixed aircraft speed consistency, route-distance progress scaling, elapsed-clock advancement, return-leg behavior, and the repaired Council slide frame.

Roadmap follow-up: continue building toward persistent aircraft identity, aircraft damage/repair, range/fuel constraints, and richer UFO/interceptor choices. Keep travel progress tied to Geoscape time so future air-combat systems remain physically readable at Earth scale.

## 2026-07-05 Patch Notes - Aircraft Identity, Damage, and Repair Seed

Build `v0.26.07.05.0100_AIRCRAFT_IDENTITY_DAMAGE_REPAIR_SEED_INDEX_ONLY_PATCH` adds the first persistent aircraft readiness layer:

- Added save-compatible `aircraftFleet` normalization so old saves without aircraft identity data receive named Skyranger/interceptor records from hangar assignments and legacy interceptor counts.
- Aircraft now carry stable names, callsigns, base/hangar identity, status, damage, repair time, and last-sortie outcome.
- Skyranger mission launch marks the selected Skyranger Outbound, mission return marks it Returning, and completed return restores it to Ready.
- Interceptor launch now selects ready named interceptor craft, marks them Outbound, and blocks launches when no ready craft are available.
- Returning interceptors can take light sortie damage and enter short Repairing windows; repair timers advance through Geoscape clock minutes.
- The Geoscape UFO Tracking panel now reports ready/configured interceptors plus repairing/returning totals.
- Hangar inspection now surfaces the named aircraft and its readiness/damage/repair status.
- Build Health coverage now includes old-save aircraft-fleet normalization, repair readiness, and launch blocking.

Roadmap follow-up: playtest the repair cadence and UI clarity, then extend the air-war layer with range/fuel constraints and player-facing interception choices that trade hit chance, damage risk, ammo use, and repair time.

## 2026-07-05 Patch Notes - Aircraft Range, Fuel, and Interception Choices

Build `v0.26.07.05.0200_AIRCRAFT_RANGE_FUEL_AND_INTERCEPTION_CHOICES_INDEX_ONLY_PATCH` extends the aircraft readiness layer without changing the single-file architecture:

- Added save-compatible fuel capacity, current fuel, range, and refuel timer fields to normalized aircraft records.
- Skyrangers and interceptors now use simple practical range profiles and block launches when the round trip exceeds range or available fuel.
- Fuel is consumed at launch and refuels through existing Geoscape clock advancement while craft are not Outbound or Returning.
- UFO Tracking now surfaces interceptor fuel/range readiness and per-contact sortie feasibility.
- Added Cautious, Standard, and Aggressive interception stances; stance modifies hit chance, ammo expenditure, fuel use, damage risk, and repair time.
- Hangar inspection inherits clearer fuel/range/repair/refuel status through the shared aircraft readiness line.
- Existing clock-based Skyranger/interceptor travel and interceptor repair behavior are preserved.
- Build Health coverage now includes aircraft fuel/range normalization, route range checks, fuel refill behavior, stance effect bounds, fuel-based launch blocking, and the previous repair readiness checks.

Verification checklist:
- Start a new campaign and confirm the start screen/build label shows `v0.26.07.05.0200`.
- Open Build Health in browser and confirm all checks pass, including aircraft identity/repair and aircraft range/fuel/stance rows.
- Inspect a hangar and confirm named aircraft show fuel and range readiness.
- In UFO Tracking, switch stances and confirm contact launch buttons/readouts respond to readiness.
- Launch an interceptor and confirm fuel is consumed, the craft becomes Outbound/Returning, then returns to Ready or Repairing after the clock-driven return leg.
- Advance Geoscape time and confirm grounded aircraft refuel while airborne aircraft do not.

Roadmap follow-up: if this tests cleanly, move next to `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` so UFO size, speed, stance, and formation choices produce more varied interception outcomes while preserving the new fuel/range/repair foundation.

## 2026-07-05 Patch Notes - Interceptor Base Range Selection Fix

Build `v0.26.07.05.0210_INTERCEPTOR_BASE_RANGE_SELECTION_FIX_INDEX_ONLY_PATCH` corrects the first-base range bug found after the aircraft fuel/range patch:

- Interceptor sortie readiness now resolves each aircraft's launch base from its `baseId` or `hangarKey`.
- Old aircraft records that have a hangar assignment but no explicit `baseId` now derive the base from the hangar key during normalization.
- UFO Tracking readiness and launch blocking now evaluate all ready interceptors across all bases and prefer eligible aircraft with the lowest fuel cost.
- Interceptor launch reports and travel plans preserve the selected launch base instead of always using the first base with a location.
- Existing fuel consumption, refueling, stance effects, damage/repair, and clock-based travel contracts are preserved.
- Build Health now includes a multi-base range selection row verifying that an interceptor in a closer North Africa base can be selected while a North America interceptor remains out of range.

Verification checklist:
- Build a first base far from a detected UFO and confirm its interceptor is correctly blocked by range.
- Build/order an interceptor at a closer second base and confirm the UFO can be intercepted from that closer base once the aircraft is Ready and fueled.
- Confirm Build Health passes the new `Interceptor range uses each aircraft assigned base` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this bugfix verifies cleanly.

## 2026-07-06 Patch Notes - Richer UFO Evasion and Air Combat Events

Build `v0.26.07.06.0100_RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY_PATCH` deepens interceptor resolution without changing the single-file architecture or the clock-based travel contract:

- UFO interception can now resolve into Confirmed Shootdown, Damaged Escape, Evasive Maneuvers, Contact Lost, Forced Disengage, Ammunition Pressure, or Breakaway.
- Outcome selection uses UFO size/speed/threat, formation size, weapon power, detection coverage, and the current Cautious/Standard/Aggressive stance.
- UFO Tracking readiness text now includes a lightweight hit estimate and UFO evasion pressure preview.
- Launch summaries and command reports now include outcome label, stance, hit estimate, combat roll, evasion pressure, launch base, fuel cost, and ETA.
- Non-shootdown outcomes can advance UFO progress, mark contact lost, or store a damaged/evasion summary while interceptors still fly home on Geoscape clock ticks.
- Aircraft recovery records the richer air-combat outcome and applies bounded damage/repair modifiers after the return leg.
- Build Health now includes `Richer UFO evasion and air combat events stay bounded`, covering outcome variety, contact-lost state, stance modifiers, ammo bounds, recovery bounds, and regression checks for multi-base interceptor range, Skyranger base matching, and new-base placement.

Verification checklist:
- Launch interceptors against detected UFOs with different stances and confirm the launch summary names a richer air-combat outcome.
- Confirm UFO Tracking shows hit estimate / evasion pressure while preserving range/fuel/base readiness.
- Advance Geoscape time after an interception and confirm return/repair still follows clock time.
- Confirm Build Health passes the new `Richer UFO evasion and air combat events stay bounded` row.
- Confirm older saves still normalize `aircraftFleet` records safely.

Roadmap follow-up: `AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Interceptor Stuck-Outbound Recovery Fix

Build `v0.26.07.06.0115_INTERCEPTOR_STUCK_OUTBOUND_RECOVERY_FIX_INDEX_ONLY_PATCH` fixes a playtest bug where an interceptor could remain stuck in `Outbound` with low fuel after the visible interception travel state was gone:

- Active interceptor travel now synchronizes assigned aircraft to `Outbound` during the outbound leg and `Returning` after the attack leg reaches the UFO.
- Stale airborne interceptor records with no active `interceptorTravel` are recovered conservatively into a short `Repairing` window instead of staying permanently Outbound/Returning.
- Recovered craft are grounded and can refuel normally as Geoscape clock time advances.
- Legitimately Outbound/Returning aircraft still do not refuel while airborne.
- Aircraft status lines now indicate when airborne craft have refueling paused and when a craft was recovered from stale travel.
- Save/load migration applies the stale-airborne recovery guard so old or mismatched saves can recover stuck interceptors.
- Build Health now includes `Interceptor airborne status recovery prevents stuck Outbound craft`, covering active travel status sync, return recovery, stale Outbound/Returning recovery, recovered refueling, airborne no-refuel behavior, and recovery display text.

Verification checklist:
- Load a save with a stuck Outbound/Returning interceptor and confirm it enters short Repairing recovery, then refuels over clock time.
- Launch an interceptor, advance time past the attack leg, and confirm the aircraft status changes to Returning before final recovery.
- Confirm airborne craft do not refuel while Outbound/Returning.
- Confirm recovered/grounded craft do refuel while Geoscape time advances.
- Confirm Build Health passes the new `Interceptor airborne status recovery prevents stuck Outbound craft` row.

Roadmap follow-up remains `AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Base-Local Equipment Stores and Transfer Logistics

Build `v0.26.07.09.0025_BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH` extends the multi-base logistics pass from personnel into portable equipment:

- Added old-save compatible `baseInventories` while preserving aggregate `gearInventory` for compatibility with older saves and existing systems.
- Quartermaster/Base Stores now show selected-base local stock, selected-base storage capacity, all-bases storage totals, and local issued gear.
- Buying, selling, equipping, removing gear, and forced auto-equip now use the selected/relevant base inventory where safely contained.
- Added initial equipment transfer records with origin base, destination base, item name, quantity, total/remaining travel time, and in-transit status.
- Equipment transfers advance through Geoscape clock time and add stock to the destination base on arrival.
- In-transit equipment is unavailable at both origin and destination until arrival.
- Build Health now includes `Base-local equipment stores and transfers keep stock local until arrival`.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0025`.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Open Quartermaster and confirm local storage, local free storage, all-bases storage, and local issued items render.
- Confirm Build Health passes 209/209 and includes the new equipment logistics row.
- Confirm browser console errors are clear during start screen, Geoscape, Quartermaster, and Build Health.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Start-Screen Mount Fix

Build `v0.26.07.09.0008_START_SCREEN_MOUNT_FIX_INDEX_ONLY_PATCH` repaired the start-screen mount after the first base-local roster/transfer patch.

- Start screen loads from localhost.
- Start New Game works.
- First base confirmation reaches the main Geoscape.
- Browser console errors were clear.
- Build Health passed 208/208 before the equipment-localization patch.
## 2026-07-08 Patch Notes - Base-Local Rosters and Soldier Transfer Logistics

Build `v0.26.07.08.0140_BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY_PATCH` begins the multi-base logistics pass:

- Barracks now derives its visible soldier roster from the currently selected base.
- Sickbay now derives its visible patient/recovery roster from the currently selected base.
- Selected-base Sickbay patient count uses selected-base Sickbay capacity for the local screen.
- Ready Barracks soldiers can be transferred from the selected base to another base when multiple bases exist.
- Soldier transfers store origin base, destination base, total/remaining travel time, and in-transit status.
- Transfers advance through Geoscape clock time and update the soldier's base on arrival.
- In-transit soldiers are removed from squad duty, hidden from local base rosters, blocked from squad assignment, and excluded from mission response forces until arrival.
- Personnel Transfers appear in Barracks for inbound/outbound selected-base transfers.
- Build Health now includes `Base-local rosters and soldier transfers keep personnel available only at their base`.

Verification checklist:
- Select different bases and confirm Barracks shows only soldiers stationed at the selected base.
- Confirm Sickbay/patient lists are filtered to the selected base.
- Transfer a ready soldier from one base to another and confirm the soldier is removed from squad duty and listed as in transit.
- Advance Geoscape clock time and confirm the transferred soldier arrives at the destination base.
- Confirm in-transit soldiers cannot be assigned to squads or launched on missions.
- Confirm Build Health passes with the new base-local transfer row and the prior squad/base filter row.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_STORES_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-08 Patch Notes - Geoscape Range Overlay Filters and Squad Base Filter

Build `v0.26.07.08.0120_GEOSCAPE_RANGE_OVERLAY_FILTERS_AND_SQUAD_BASE_FILTER_INDEX_ONLY_PATCH` adds player-selectable range planning overlays and tightens squad assignment to base-local soldiers:

- Geoscape now has a compact Range Overlays control with toggles for Shortwave Radar, Longwave Radar, Interceptor reach, Skyranger reach, and All Off.
- Overlay rings render as lightweight dotted/dashed circles around existing bases.
- Radar rings use the existing Shortwave 4,500km and Longwave 9,000km range model.
- Aircraft rings use practical round-trip reach and respect purchased Interceptor Drop Tanks and Skyranger Extended Tanks.
- New-base placement preview rings remain separate and visually distinct from persistent base overlay rings.
- Squads now resolve a selected squad's base from explicit squad base fields when available, assigned members when needed, and the selected/current base as a conservative fallback.
- The Squads screen available-soldier list now only shows unassigned, living, non-wounded soldiers stationed at the selected squad's base.
- Wrong-base soldiers are hidden from the assignable list and are defensively blocked if directly assigned through stale UI state.
- Build Health now includes `Geoscape range overlay filters render base rings` and `Squad assignment list filters by selected squad base`.

Verification checklist:
- Open Geoscape and toggle Shortwave, Longwave, Interceptor, Skyranger, and All Off range overlays.
- Confirm the overlay rings draw around existing bases and remain visually distinct from Build New Base preview rings.
- Confirm tank upgrades change aircraft overlay reach values.
- Open Squads, select a squad, and confirm only soldiers stationed at that squad's base appear in the available assignment list.
- Confirm soldiers stationed at other bases are hidden and that same-base soldiers can still be assigned.
- Confirm Build Health passes with the two new rows.

Roadmap follow-up is `BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-08 Patch Notes - UFO Landing and Terror Incidents

Build `v0.26.07.08.0100_UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY_PATCH` adds the first UFO operation-to-ground-incident loop:

- Active UFOs now normalize with a mission intent: Recon, Abduction, Terror Raid, Harvest, Base Scout, or Supply.
- UFOs can complete operations into ground incidents once flight progress reaches the mission threshold, instead of only disappearing as escaped contacts.
- Landed/terror-style incidents are generated from UFO size, region, alien type, and mission intent, while existing crash-site incidents remain separate.
- Air-combat outcomes can disrupt UFO operations: damaged escapes, forced disengagements, ammunition pressure, and breakaways add delay/downgrade pressure before a later ground incident.
- UFO Tracking now shows a mission-risk line once radar contact quality and tracking are good enough to read the operation.
- Old saves with UFO records missing mission intent normalize safely to a valid intent.
- Build Health now includes `UFO mission intents can create landed terror incidents`, covering intent normalization, incident generation, panic consequences, radar-readable mission text, and interception disruption/downgrade behavior.

Verification checklist:
- Start/load a campaign and confirm UFO Tracking still respects radar range/contact quality.
- Track contacts long enough to see mission risk text appear once radar quality improves.
- Advance Geoscape time and confirm some UFOs generate landed/terror-style incidents rather than only lost-contact reports.
- Confirm crash sites from shootdowns and delayed damaged-UFO crashes remain separate from landed incidents.
- Intercept a UFO and confirm damaged/disrupted outcomes can delay or downgrade the later operation.
- Confirm Build Health passes with the new UFO mission-intent row.

Roadmap follow-up is `GEOSCAPE_RANGE_OVERLAY_FILTERS_INDEX_ONLY`, followed by `BASE_LOCAL_ROSTERS_AND_TRANSFER_LOGISTICS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Base Radar Range and Contact Quality

Build `v0.26.07.07.0140_BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY_PATCH` implements the first distance-based radar model:

- Base radar coverage is now derived from each base's installed radar facilities and Geoscape location.
- Shortwave Radar provides local/regional UFO contact range at 4,500km.
- Longwave Radar provides wider strategic UFO contact range at 9,000km.
- UFOs outside radar range stay hidden unless already detected/known; the Geoscape globe and UFO Tracking panel no longer reveal all UFOs just because the player owns any radar.
- Radar contact quality now reports Weak, Faint, Tracked, or Locked based on distance, UFO detectability, radar type, and overlapping radar coverage.
- Overlapping radar coverage improves detection chance and air-combat firing solution quality.
- UFO Tracking contact rows now name the detecting base/radar source, approximate range, detection chance, and overlap count.
- Build Health now includes `Base radar range and contact quality gate UFO tracking`, covering range gating, Shortwave-vs-Longwave behavior, overlap quality, visible-contact filtering, starting radar continuity, and no-regression checks for interceptor and Skyranger launch selection.

Verification checklist:
- Start/load a campaign and confirm Fort Aegis' Shortwave Radar creates local/regional UFO coverage without globally revealing every UFO.
- Add/build Longwave Radar and confirm it reaches farther contacts than Shortwave Radar.
- Add overlapping radar coverage from multiple bases and confirm contact quality/detection improves.
- Confirm detected UFOs still support assigned-base interceptor range/fuel selection.
- Confirm Skyranger stationing/load normalization still passes and launch blockers remain clear.
- Confirm Build Health passes 204/204 checks, including the new radar row.

Roadmap follow-up is `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Skyranger Stationing Load Normalization Fix

Build `v0.26.07.07.0120_SKYRANGER_STATIONING_LOAD_NORMALIZATION_FIX_INDEX_ONLY_PATCH` fixes the remaining playtest blocker where the game listed ready Skyranger bases such as `N. Africa1` and `Fort Aegis` but still refused launch because selected soldiers did not match either base:

- Soldier stationing now resolves against actual campaign base IDs before falling back to safe legacy base name/region tokens.
- Room/activity-only `baseLocation` state, such as Barracks movement markers, no longer counts as base identity and no longer prevents fallback to the selected/first base during old-save normalization.
- Save/load migration assigns a real fallback base ID when soldiers lack explicit `baseId`, `homeBaseId`, or `assignedBaseId` data.
- Skyranger launch selection now correctly chooses the matching ready Skyranger when Fort Aegis and N. Africa both have ready transports.
- Mixed-base response forces remain blocked, but the blocker now names offending soldiers and where the game believes they are stationed.
- Build Health expands the Skyranger assigned-base row with Fort Aegis/N. Africa matching, room-only legacy location fallback, mixed-base named blocker text, and legacy load normalization.

Verification checklist:
- Load the affected campaign and confirm a Fort Aegis squad can launch from a ready Fort Aegis Skyranger to an in-range incident while N. Africa also has a ready Skyranger.
- Confirm an N. Africa squad can still launch from an N. Africa Skyranger to an in-range incident.
- Confirm mixed-base squads are blocked with named soldiers and their interpreted stationing.
- Confirm under-fueled and out-of-range Skyrangers still produce fuel/range blockers rather than stationing blockers.
- Confirm Build Health passes the expanded `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-07 Patch Notes - Skyranger Stationing and Range Launch Fix

Build `v0.26.07.07.0105_SKYRANGER_STATIONING_RANGE_LAUNCH_FIX_INDEX_ONLY_PATCH` fixes a playtest blocker where a ready Skyranger and apparently stationed squad could be refused with `assigned soldiers are not stationed at any ready Skyranger base`:

- Skyranger launch eligibility now compares soldiers against the actual launch base object rather than only a raw base id string.
- Soldier stationing checks now recognize current `baseId`, older `homeBaseId` / `assignedBaseId`, legacy `baseLocation` strings, legacy `baseLocation` objects, base names, and base regions.
- Old-save and mixed-save soldier stationing data can match the correct base without allowing truly wrong-base soldiers to launch.
- Blocking text now lists the ready Skyranger base names when soldiers are not stationed at any matching ready transport base.
- Representative North America to Central America-style incidents validate as in range under the existing model: about 6,813km round trip against the starting Skyranger's 16,000km practical range.
- Build Health expands the Skyranger assigned-base row with North America in-range launch eligibility, legacy stationing normalization, wrong-base blocking, under-fueled blocking, and existing multi-base/range/fuel continuity checks.

Verification checklist:
- Load or start a campaign with a ready North America Skyranger and squad at that base.
- Launch to a nearby North/Central America incident and confirm the false stationing blocker no longer appears.
- Confirm a squad stationed at a different base is still blocked from using the wrong Skyranger.
- Confirm under-fueled and out-of-range Skyrangers still produce fuel/range blockers rather than stationing blockers.
- Confirm Build Health passes the expanded `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Smooth X-COM Style Geoscape Time

Build `v0.26.07.06.0175_SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY_PATCH` makes the Geoscape clock feel more like classic time compression while preserving the existing simulation contract:

- Added Geoscape time compression modes: Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d.
- Automatic Geoscape time now advances on a smoother one-second cadence, with the selected mode controlling elapsed Geoscape minutes.
- Time-control labels now show the active compression mode and perceived clock rate.
- Old saves with missing or odd clock settings normalize to the nearest supported compression mode.
- Aircraft travel, UFO movement, repair, refuel, delayed crash, and mission timing remain driven by elapsed Geoscape minutes.
- Build Health now includes `Smooth X-COM-style Geoscape time compression preserves clock math`, covering time-scale conversion, route progress scaling, repair/refuel progression, and no-regression clock blocking.

Verification checklist:
- Open the Geoscape and confirm the clock offers Pause, 5s, 1m, 5m, 30m, 1h, 6h, and 1d modes.
- Confirm higher compression modes visibly advance aircraft/UFO progress faster than low compression modes.
- Confirm repair and refuel progress still match elapsed Geoscape minutes.
- Confirm tactical/manual mission states and council/modal states still block automatic clock flow.
- Confirm Build Health passes the new `Smooth X-COM-style Geoscape time compression preserves clock math` row.

Roadmap follow-up: `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Base Placement Aircraft Range Preview

Build `v0.26.07.06.0165_BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY_PATCH` makes new-base siting more readable by previewing aircraft reach before the player commits funds:

- Build New Base placement mode now renders dotted aircraft reach rings centered on the proposed site.
- The preview shows current Interceptor and Skyranger practical reach using the existing round-trip range model.
- If Interceptor Drop Tanks or Skyranger Extended Tanks are not owned, lighter upgrade-preview rings show how future fuel tank upgrades would improve reach.
- The New Base Site summary now includes a dotted aircraft reach line so the globe overlay is explained near the name/cost/confirm controls.
- Existing base-placement confirmation behavior, construction cost, validation, and Access Lift seed layout are preserved.
- Build Health now includes `New-base placement previews dotted aircraft range rings`, covering inactive preview hiding, ring values, render data, summary text, and no-regression base construction.

Verification checklist:
- Click Build New Base and confirm dotted Interceptor and Skyranger range rings appear around the proposed site.
- Confirm the selected-site summary includes current aircraft reach values.
- Purchase one or both fuel tank upgrades and confirm the preview no longer treats the owned upgrade as a future-preview ring.
- Construct a new base and confirm it still starts with the expected Access Lift seed layout.
- Confirm Build Health passes the new `New-base placement previews dotted aircraft range rings` row.

Roadmap follow-up: `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`, followed by `UFO_LANDING_AND_TERROR_INCIDENTS_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Starting Base Shortwave Radar Seed

Build `v0.26.07.06.0155_STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY_PATCH` gives the player a clearer default radar foothold without changing expansion-base construction:

- Added one Shortwave Radar to the default Fort Aegis starting base layout.
- Preserved the existing two starting hangars, Access Lift, Living Quarters, Laboratory, Sickbay, and Base Stores seed.
- Newly constructed expansion bases still start with only their free Access Lift.
- Existing radar coverage math now counts the seeded Shortwave Radar at campaign start.
- Build Health now includes `Initial base starts with one Shortwave Radar`, covering the seed while preserving the starting hangar and expansion-base checks.

Verification checklist:
- Start a new campaign and confirm the starting base contains one Shortwave Radar.
- Confirm the starting Skyranger and Interceptor hangars are still present.
- Open UFO Tracking and confirm coverage shows one shortwave radar counted at campaign start.
- Build a new expansion base and confirm it still starts with only the Access Lift.
- Confirm Build Health passes the new `Initial base starts with one Shortwave Radar` row.

Roadmap follow-up: `BASE_PLACEMENT_AIRCRAFT_RANGE_PREVIEW_INDEX_ONLY` and `SMOOTH_XCOM_STYLE_GEOSCAPE_TIME_INDEX_ONLY` are complete; next target is `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY`.

## 2026-07-06 Patch Notes - Aircraft Fuel Tank Upgrades

Build `v0.26.07.06.0145_AIRCRAFT_FUEL_TANK_UPGRADES_INDEX_ONLY_PATCH` makes starting craft more useful deeper into the campaign without replacing the single-file aircraft model:

- Added global save-compatible fuel tank upgrade flags for Interceptors and Skyrangers.
- Added purchasable Interceptor Drop Tanks in UFO Tracking for $320k.
- Added purchasable Skyranger Extended Tanks in UFO Tracking for $440k.
- Interceptor Drop Tanks raise Interceptors from 100 fuel / 7,800km range to 135 fuel / 10,500km range.
- Skyranger Extended Tanks raise Skyrangers from 100 fuel / 16,000km range to 130 fuel / 20,800km range.
- Existing aircraft, loaded aircraft, and newly ordered aircraft inherit purchased tank upgrades while preserving status, repair, airborne, and refuel behavior.
- Refueling remains automatic and clock-based; no funds or Base Stores fuel storage is required.
- Build Health now includes `Aircraft fuel tank upgrades extend sortie reach safely`, covering old-save normalization, upgrade application, upgraded range checks, upgraded refueling, and no-regression aircraft travel/range selection.

Verification checklist:
- Open Geoscape/UFO Tracking and confirm Interceptor Tanks and Skyranger Tanks upgrade cards appear beside aircraft ordnance.
- Purchase Interceptor Drop Tanks and confirm Interceptor readiness/range updates to 10,500km / 135 fuel.
- Purchase Skyranger Extended Tanks and confirm Skyranger readiness/range updates to 20,800km / 130 fuel.
- Confirm upgraded aircraft can launch longer valid sorties while still blocking routes beyond upgraded practical range or current fuel.
- Confirm refueling still advances only through Geoscape clock time and airborne craft still do not refuel.
- Confirm Build Health passes the new `Aircraft fuel tank upgrades extend sortie reach safely` row.

Roadmap follow-up: `STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY`, then `BASE_RADAR_RANGE_AND_CONTACT_QUALITY_INDEX_ONLY` after the starting radar seed verifies cleanly.

## 2026-07-06 Patch Notes - Air Combat Reports and UFO Damage Memory

Build `v0.26.07.06.0130_AIR_COMBAT_AFTER_ACTION_REPORTS_AND_UFO_DAMAGE_MEMORY_INDEX_ONLY_PATCH` makes interceptor outcomes easier to review and gives damaged UFO escapes a small persistent consequence layer:

- Added compact air-combat after-action reports for launch, impact, delayed crash, and aircraft recovery phases.
- UFO Tracking now surfaces the latest Air Combat report card and per-contact Last air contact summaries.
- Damaged Escape outcomes now attach lightweight UFO damage memory with a follow-up hit bonus and delayed crash chance.
- Damaged UFO memory advances only through Geoscape clock time; damaged contacts can later create delayed crash-site incidents.
- Save/load migration normalizes older UFO contacts and air-combat report history safely.
- Build Health now includes `Air combat after-action reports and UFO damage memory persist`, covering report creation, damaged-UFO memory, delayed crash behavior, report normalization, stance continuity, multi-base interceptor selection, and interceptor return recovery.

Verification checklist:
- Open Geoscape and confirm the UFO Tracking panel loads.
- Launch an interceptor and confirm Latest Air Combat appears with outcome, stance, aircraft, fuel/ammo, and roll information.
- Confirm damaged escapes show Last air contact plus UFO damaged follow-up/crash chance text on the contact.
- Advance Geoscape time and confirm damaged-UFO delayed crash behavior does not break normal UFO detection/escape flow.
- Confirm Build Health passes the new `Air combat after-action reports and UFO damage memory persist` row.

Roadmap follow-up: `AIRCRAFT_FUEL_TANK_UPGRADES_INDEX_ONLY`, with `STARTING_BASE_SHORTWAVE_RADAR_SEED_INDEX_ONLY` still queued as a small starting-base quality-of-life patch.

## 2026-07-05 Patch Notes - New Base Placement Confirmation UI Fix

Build `v0.26.07.05.0230_NEW_BASE_PLACEMENT_CONFIRMATION_UI_FIX_INDEX_ONLY_PATCH` corrects the Geoscape placement flow where the globe entered base-placement mode but the actual confirmation controls were not visible to the player:

- The New Base Site confirmation controls now render directly above the Geoscape globe whenever placement mode is active.
- The visible placement panel includes the base name field, selected region/location summary, construction cost, projected funds after construction, validation reason, and confirm button.
- The existing Cancel Base Placement button remains in the Geoscape action row.
- Confirm construction is disabled until the base has a name and the council has enough funds.
- Existing `buildNewBase` behavior remains the construction authority, preserving the single-file architecture and save compatibility.
- Build Health now includes a row for new-base placement confirmation state and the new-base creation contract.

Verification checklist:
- Click Build New Base and confirm the New Base Site panel appears above the globe without scrolling.
- Enter a valid base name and confirm the button enables when funds are sufficient.
- Construct the base and confirm the new base appears with the Access Lift seed layout.
- Confirm Build Health passes the new `New-base placement confirmation stays visible and validates construction` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this UI bugfix verifies cleanly.

## 2026-07-05 Patch Notes - Skyranger Base and Soldier Location Fix

Build `v0.26.07.05.0220_SKYRANGER_BASE_AND_SOLDIER_LOCATION_FIX_INDEX_ONLY_PATCH` corrects the Skyranger equivalent of the multi-base aircraft-origin bug:

- Skyranger sortie selection now evaluates ready Skyrangers from their assigned `baseId` / `hangarKey` base instead of the currently selected or first base.
- Mission response soldiers now carry a save-compatible `baseId`; old saves with missing soldier base state normalize to the campaign selected/first base.
- Mission launch only selects a Skyranger whose launch base contains the assigned response force.
- Launch blocking now reports whether the blocker is no ready Skyranger, soldiers not stationed at a ready Skyranger base, route range, or fuel.
- Skyranger travel still consumes fuel at launch, advances by Geoscape clock time, preserves the launch base for arrival/return, and restores Ready status after the return leg.
- Manual tactical missions and simulated missions now resolve the response force against the preserved launch base.
- Selected-base live activity and base-defense preview data now use soldiers stationed at that base rather than every global soldier.
- Build Health now includes Skyranger assigned-base selection, wrong-base soldier blocking, multi-base matching, range/fuel continuity, and old-save soldier base fallback checks.

Verification checklist:
- Build or load a multi-base campaign with a Skyranger in a secondary base and soldiers still stationed at the first base; confirm launch is blocked with a soldier-location reason.
- Station or recruit soldiers at the same base as a ready Skyranger and confirm mission launch originates from that Skyranger's base.
- Confirm existing interceptor multi-base range behavior still passes.
- Confirm Build Health passes the new `Skyranger launch matches assigned base and stationed soldiers` row.

Roadmap follow-up remains `RICHER_UFO_EVASION_AND_AIR_COMBAT_EVENTS_INDEX_ONLY` after this bugfix verifies cleanly.
