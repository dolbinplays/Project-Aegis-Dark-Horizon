# PROJECT AEGIS / ALIEN RESPONSE COMMAND
## Codex Handoff: Updated Full Roadmap + Game Bible

Last updated: 2026-07-05  
Current handoff build: `v0.26.07.05.0100_AIRCRAFT_IDENTITY_DAMAGE_REPAIR_SEED_INDEX_ONLY_PATCH`  
Current patch status: **Built in `index.html`; local static verification should be followed by browser Build Health/smoke testing for aircraft readiness, repair timers, hangar readouts, and launch blocking.**

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
`v0.26.07.05.0100_AIRCRAFT_IDENTITY_DAMAGE_REPAIR_SEED_INDEX_ONLY_PATCH`

## What This Patch Was Intended To Add
This patch adds:
- Save-compatible `aircraftFleet` identity/readiness state alongside the legacy interceptor count.
- Stable Skyranger/interceptor names and callsigns generated from hangar assignments or legacy interceptor counts.
- Aircraft statuses for Ready, Outbound, Returning, and Repairing.
- Skyranger launch/return status transitions tied to existing clock-based travel.
- Interceptor launch blocking based on ready aircraft, not just raw owned count.
- Interceptor sortie recovery that can place returning craft into short repair windows with light damage.
- Repair timers advanced by Geoscape clock minutes.
- Hangar and Geoscape readiness readouts showing named aircraft, repair state, ready/configured counts, and returning/repairing totals.
- Build Health coverage for old-save aircraft normalization, repair readiness, and launch blocking.

## Current Player Verification Needed
Before moving to the next major feature stage, test:

1. **Aircraft identity and hangars**
   - Start a new campaign and inspect the starting base hangars.
   - Confirm the Skyranger and starting Interceptor show named aircraft/readiness text.
   - Order a new aircraft from an empty hangar and confirm the new craft receives a stable name/status.

2. **Interceptor readiness and repair**
   - Launch one or more interceptors at a detected UFO.
   - Confirm ready interceptor count drops immediately and launch buttons disable when no ready craft remain.
   - Advance Geoscape time through the return leg and confirm any damaged craft enter Repairing.
   - Advance more clock time and confirm repaired craft return to Ready.

3. **Skyranger status**
   - Launch a mission and confirm Skyranger travel still uses clock-based progress.
   - Finish/return from the mission and confirm the Skyranger becomes Ready again.

4. **Save compatibility**
   - Load or import an older save with no `aircraftFleet` field.
   - Confirm it normalizes a Skyranger/interceptor fleet without crashing.

5. **Build Health**
   - Confirm the in-browser Build Health panel passes all checks, including the aircraft identity/repair readiness row.

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

### Hangar
Aircraft storage. Hangar is conceptually a 2x2 tile. Supports craft purchase/assignment and empty hangar states.

Default starting base layout should include **two 2x2 hangars**: one populated with the starting Interceptor and one populated with the Skyranger. This keeps the visual base layout consistent with the campaign starting equipment.

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
- UFOs range from very small to very large.
- Larger craft are harder to shoot down.
- Shootdowns create crash incidents.
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
- Hangar assignment and empty hangar states.
- Named Skyranger/interceptor craft with Ready, Outbound, Returning, and Repairing status.
- Light post-sortie interceptor damage and clock-driven repair timers.

Still planned:
- Fuel/range constraints.
- Pilot/crew identity if the air-war layer needs named aviators later.
- Richer UFO evasive behavior and interception choices.
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
- Crash-site incidents.
- Hidden command-site discovery gating.
- Base hallway/pathing foundation where hallways are represented by the grid lines around rooms, not by room tiles.
- Base invasion readiness helpers for entry points, traversable layout, containment reachability, and air-defense reduction.
- Air Defense Battery seed facility.

Still planned:
- Command Objectives Tracker.
- Alien escalation over months.
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
Playtest `v0.26.07.05.0100_AIRCRAFT_IDENTITY_DAMAGE_REPAIR_SEED_INDEX_ONLY_PATCH` before extending the air-war layer again.

Focus verification on:
- Old saves normalizing a valid aircraft fleet.
- Starting hangars showing named Skyranger/interceptor readiness.
- Interceptor ready count dropping on launch and recovering after return/repair.
- Repair timers advancing only through Geoscape clock time.
- Skyranger mission launch/return still using the clock-based travel contract.
- Build Health passing all checks in browser.

## Best Next Feature Patch
If this batch tests well, continue the air-war foundation:

`AIRCRAFT_RANGE_FUEL_AND_INTERCEPTION_CHOICES_INDEX_ONLY`

Suggested focus:
- Add simple interceptor/Skyranger range and fuel readiness values.
- Block or warn on impossible long-range sorties.
- Add limited interception choices such as cautious, standard, and aggressive attack runs.
- Let choice affect hit chance, damage risk, ammo use, and repair time.
- Keep all movement and recovery tied to Geoscape clock minutes.

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
