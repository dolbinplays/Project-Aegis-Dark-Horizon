# PROJECT AEGIS / ALIEN RESPONSE COMMAND
## Codex Handoff: Updated Full Roadmap + Game Bible

Last updated: 2026-08-01
Current handoff build: `v0.26.08.01.0148_TACTICAL_SIMULATION_RELIABILITY_AND_SQUAD_REPLACEMENT_INDEX_ONLY_PATCH`
Native vertical slice: `v0.26.08.01.GODOT.0018_TACTICAL_DISTRESS_RESPONSE_VERTICAL_SLICE`
Current patch status: **Browser 0148 and native 0018 preserve save format 4. Simulated encounters now refresh every living soldier's TU after round one, preventing survivors from becoming inert while aliens continue firing. Classic Lineup stages moving lethal targets alive through the firing frame and reveals the complete Classic action sequence. Paired A/B squad wipeouts allocate replacements sequentially as C and D instead of independently choosing C. In both clients, alien fire records a bounded squad distress contact: non-escort soldiers converge on a living casualty or a downed soldier's last position, then search toward the shooter's reported firing cell while escorts continue evacuation. Browser Build Health passes 306/306; the 0148 start screen and Geoscape load; a practical six-soldier simulated incident completed after three exchanges with five survivors and all three aliens eliminated; browser diagnostics contain no runtime errors. Native tests pass 115/115, native Build Health passes 88/88, and Godot 4.7.1 strict parsing passes. Remaining gates are hands-on paired-squad wipeout naming, exact Classic lethal playback, and visible distress convergence in an affected campaign.**

---

# v0.26.08.01.0148 / GODOT.0018 - Simulation Reliability, Squad Replacement, and Distress Response

Browser build `v0.26.08.01.0148_TACTICAL_SIMULATION_RELIABILITY_AND_SQUAD_REPLACEMENT_INDEX_ONLY_PATCH` and native build `v0.26.08.01.GODOT.0018_TACTICAL_DISTRESS_RESPONSE_VERTICAL_SLICE` preserve save format 4.

Root causes addressed:

- Fresh simulated encounters refreshed human TU only when inheriting an existing manual battlefield. After round one, a fresh squad could spend all TU and remain inert forever while aliens refreshed normally each turn.
- Classic sequential playback inherited a lethal target's final dead snapshot before its shooter frame, especially when the target also moved or the firing alien was hidden.
- Simultaneous squad replacements were generated inside one state map against the same unchanged used-name list, so both wiped A/B squads independently selected the C letter.
- Tactical AI retained general alien contact memory but did not broadcast a wounded or downed soldier's location and the firing direction as a squad response objective.
- A randomized building/deployment self-test compared unit positions against pre-landing cover, including props the Skyranger had legitimately removed from the authoritative battlefield, producing intermittent four-row Build Health failures.

Implemented roadmap scope:

- Every living simulated soldier refreshes to `maxTu` after round one; inherited first-round TU remains untouched and dead soldiers are never refreshed.
- Classic playback stages lethal targets alive at their final moved position through the shot frame, applies death on the following impact frame, and includes hidden firing actions in the all-seeing Classic presentation.
- Mission cleanup now allocates replacement squad names sequentially in one transaction. A/B wipeouts reserve C before generating D while surviving squads still remove KIA normally.
- Browser and native alien fire record the casualty position, shooter identity, and firing cell for twelve bounded turns. Non-escort AI soldiers converge on a living wounded soldier or a casualty's last position; once within four hexes they search the shooter's recorded firing direction. Current visible combat still takes priority and established civilian escorts remain on extraction duty.
- Tactical deployment health checks now validate against the post-placement cover collection used by rendering, pathfinding, and line of sight, removing the randomized false failure without changing map generation.
- Browser Build Health adds three rows and reaches 306. Native Build Health adds one row and reaches 88; native automation adds one direct check and reaches 115.

Verification checklist:

- Static browser app-script parsing passed through the build checker.
- `node tools\check-aegis-build.cjs` passed with synchronized browser 0148 and native 0018 labels and the new tactical seams.
- Localhost start screen displayed 0148 and Geoscape loaded.
- Browser Build Health passed `306/306` on two final cache-busted loads, including simulated TU refresh, paired C/D replacements, Classic lethal ordering, and squad distress response.
- A practical six-soldier simulated Red River Signal incident completed after three exchanges: five soldiers survived and all three aliens were eliminated.
- Browser diagnostics contained no runtime errors. The only warnings were Tailwind's existing development-CDN advisory.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `115/115`; all `88/88` visible native Build Health rows passed inside the suite.

Remaining risks and manual validation:

- Wipe both A and B squads in one coordinated browser mission and confirm the two empty replacements are labeled C and D with distinct names.
- Watch a lethal Classic Lineup exchange in which the target moves or the shooter is initially hidden. Confirm the target remains standing through the visible shot and falls only on impact.
- During AI command, let alien fire hit or miss a soldier. Confirm every available non-escort converges on the living soldier or downed position, then fans toward the reported shooter direction while active civilian escorts continue to the ramp.
- Repeat a high-threat two-squad Simulate Encounter and confirm every living soldier resumes acting after round one until the final alien is eliminated or the squad is genuinely defeated.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0147 / GODOT.0017 - Contact Memory, Tactical Continuity, and Safe Landing

Browser build `v0.26.08.01.0147_TACTICAL_CONTACT_MEMORY_STATE_CONTINUITY_AND_SAFE_LANDING_PARITY_PATCH` and native build `v0.26.08.01.GODOT.0017_TACTICAL_CONTACT_MEMORY_RESCUE_PRIORITY_AND_SAFE_LANDING_VERTICAL_SLICE` preserve save format 4 and close several tactical continuity gaps without restoring unbounded map work.

Root causes addressed:

- AI combat movement depended on currently visible aliens. Once line of sight broke, non-escort soldiers could resume generic search instead of reinforcing the last observed contact area.
- Civilian discovery did not establish ownership before alien contact, so later combat priority could displace the soldier who had first found an unapproached civilian.
- Leaving a manual tactical section unmounted `TacticalMission`; returning regenerated deployment, fog, units, damage, rescue progress, and controls from the mission seed.
- Skyranger placement used its preferred deployment center and then removed overlapping cover, which could erase structure cells and allow the craft to touch a procedural building.
- Sequential Classic Lineup frames applied lethal HP state in the firing frame, and all-clear dialogue could occur before the final impact/action frame had completed.
- A delayed alien-turn callback could read stale pre-resolution units after the final alien had already been removed.

Implemented roadmap scope:

- Browser aliens retain `lastKnownX/lastKnownY`; native aliens retain `last_known_cell`. A mission-level contact flag prevents a discovered threat from being forgotten merely because it leaves line of sight.
- Non-escort AI soldiers use bounded movement toward visible contacts first and remembered contact cells second. Shooting, reaction fire, visibility, and fog still require current observation and line of sight.
- Before any alien contact, a revealed civilian is claimed by the nearest eligible observing soldier. The civilian and soldier retain reciprocal priority IDs; an active escort remains exempt from combat convergence.
- Browser live tactical state is cached by mission ID across command-section unmounts, including deployment, cover damage, units/TU, selection, fog, view, fire/reserve/targeting controls, log, round, and AI playback. Cache entries are removed only when the incident finishes.
- Skyranger placement checks the complete hull/ramp footprint plus one-hex building clearance through a bounded battlefield search. Existing building cover is retained rather than deleted under the craft.
- Classic Lineup lethal shots keep the target alive in the shot frame and add an immediate impact frame for death. Final resolution and last-alien dialogue are phase-complete gated, and manual alien callbacks re-read authoritative units before acting.
- Browser Build Health gains five rows and reaches 303. Native Build Health gains two rows and reaches 87; native automation adds three direct checks and reaches 114.

Verification checklist:

- Static browser app-script parsing passed.
- `node tools\check-aegis-build.cjs` passed with paired 0147/0017 labels and the new tactical seams.
- Localhost start screen and Geoscape smoke passed with the 0147 label.
- Browser Build Health passed `303/303` on a cache-busted load.
- A practical six-soldier 64x64 safe-2D incident launched. Mina's selected state and the original deployment/log survived a visit to Base and return to Missions.
- Three End Turn cycles returned to the human phase in approximately 0.9, 1.1, and 1.1 seconds.
- Tactical-map AI playback showed sequential actor frames for Theo and Mina; Take Back Control returned to the same live mission.
- Browser diagnostics contained no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Native tests passed `114/114`; native Build Health passed `87/87`; Godot 4.7.1 strict editor parsing exited successfully.

Remaining risks and manual validation:

- Load the originally affected rescue campaign without overwriting it. Confirm every non-escort converges on the last observed alien area while current escorts continue to the ramp and no soldier oscillates or idles indefinitely.
- Spot a civilian before any alien and confirm the discovering soldier retains rescue priority after another soldier reveals a hostile.
- Inspect several dense urban maps and confirm the complete Skyranger hull and ramp remain at least one hex clear of every building.
- Damage a wall, move units, and begin civilian rescue; visit another command section and return to confirm every changed cell, TU value, and escort state remains exact.
- Watch a lethal Classic Lineup exchange and confirm the target remains standing until the shot appears, falls on impact, all-clear follows the final action, and no unit continues firing afterward.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.08.01.0146 / GODOT.0016 - Full-Squad AI, Threat-Aware Escorts, and Base Continuity

Browser build `v0.26.08.01.0146_FULL_SQUAD_AI_COMBAT_PRIORITY_AND_THREAT_AVOIDING_ESCORT_PARITY_PATCH` and native build `v0.26.08.01.GODOT.0016_FULL_SQUAD_AI_COMBAT_PRIORITY_THREAT_AVOIDING_ESCORT_AND_SEQUENTIAL_ACTION_VERTICAL_SLICE` preserve save format 4 and close the tactical AI utilization and strategic recovery-ownership gaps.

Root causes addressed:

- AI rescue scheduling could repeatedly consume one soldier's turn while other viable soldiers remained idle, and local contacts were not consistently promoted to squad-wide combat priorities.
- Escort path scoring favored short extraction routes without measuring how many known alien weapon envelopes the civilians would cross.
- Multiple state snapshots could become visible together during AI playback, making soldiers and aliens appear to move simultaneously.
- Classic Lineup shot lines inferred rows from shot order instead of carrying the firing and target unit identities.
- Successful mission recovery preferred the last launch/ferry base, which could misroute bodies and alien items away from the responding squad's home base.
- The minimized header had no base switch, and recruitment allowed a no-Skyranger base without an explicit player acknowledgement.

Implemented roadmap scope:

- Each viable AI soldier receives bounded work every turn: active escorts continue evacuation, non-escorts answer squad-observed contacts, and remaining soldiers search unexplored space or take a deterministic patrol step.
- Contact response remains combat-first unless a soldier already leads civilians. Stalled routes use bounded history resets and fallback cells instead of two-cell oscillation.
- Threat-aware rescue routing scores exposure steps, entries into danger, and total known firing-range exposure before route length. Searches cap at 192 unique cells and 768 processed states in both clients.
- AI output frames are split by visible actor. Visible soldiers and aliens move one at a time; alien state outside current observation remains suppressed and cannot pull the camera.
- Browser simulation shots carry `fromId` and `toId`; Classic Lineup resolves exact source/target endpoints from those identities.
- Both minimized command headers include the selected-base dropdown.
- Browser recruitment checks for a Skyranger assigned to the selected base and requires `window.confirm` before ordering a soldier without one.
- Successful recovery resolves the responding squad's stationing base first, then legacy soldier/original/launch fallbacks for save compatibility.
- Browser Build Health gains five rows; native Build Health gains three paired tactical rows. Multi-base recruitment/recovery remains an explicit native exception because the Godot vertical slice is still single-base.

Verification checklist:

- Static browser app-script parsing passed.
- `node tools\check-aegis-build.cjs` passed with paired 0146/0016 labels, bounded tactical seams, and the strategic continuity contract.
- Localhost start screen and Geoscape smoke passed with the 0146 label.
- The minimized header exposed both Command Section and Base selectors.
- Browser Build Health passed `298/298` on a cache-busted load.
- A practical six-soldier 64x64 safe-2D mission launched; selecting Hana exposed 151 reachable cells and movement reduced TU from 54 to 22.
- Three End Turn cycles returned to the human phase in approximately 2.7, 4.0, and 2.9 seconds.
- Browser diagnostics contained no runtime errors. The only warning was Tailwind's existing development-CDN advisory.
- Native tests passed `111/111`; native Build Health passed `85/85`.
- Godot 4.7.1 headless editor parsing exited successfully; Windows reported only the environment certificate-store warning and the expected scan-aborted message after the bounded quit.

Remaining risks and manual validation:

- Load the originally affected mandatory-rescue campaign without overwriting it. Give AI command for several turns and confirm every viable soldier acts, escorts progress, combat contacts rally non-escorts, and no unit oscillates indefinitely.
- Observe a large visible firefight and confirm soldiers and aliens animate one actor at a time while unobserved alien movement remains hidden.
- Confirm threat-aware civilian routes visibly avoid known alien firing lanes when a safe route exists and minimize exposure when none does.
- At a second browser base with no assigned Skyranger, recruit a soldier and confirm cancel creates no order while approval creates exactly one local order.
- Complete a ferry-staged browser mission and confirm alien bodies, alien items, and recovered squad equipment arrive at the squad's stationing base, not the staging base.
- Inspect Classic Lineup playback and confirm every tracer joins the correct shooter and target through movement and casualties.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.31.0145 - Direct-File Recorded Voice Playback Fallback

Browser build `v0.26.07.31.0145_DIRECT_FILE_RECORDED_VOICE_PLAYBACK_FALLBACK_INDEX_ONLY_PATCH` preserves save format 4 and native build 0015. It fixes recorded voices for players who open `index.html` directly without changing tactical outcomes or hosted audio behavior.

Root cause addressed:

- Music and synthesized SFX can play from a direct page, but browser security blocks the `fetch()` call used to load local recorded WAV files from a `file://` document.

Implemented roadmap scope:

- Direct-file launches use a native `Audio` element with bounded media-fragment take timing instead of fetching and decoding the WAV.
- The fallback stays inside the existing ordered dialogue queue and honors the independent Voices toggle, a perceptual volume curve, segmented take endings, active-media cleanup, and music ducking.
- The initial Test Voices media start remains inside the button gesture. Localhost and hosted pages continue to use the existing per-take normalization, computer/radio processing, limiter, and static bookends.
- Browser Build Health and the seam checker cover protocol selection, fallback volume bounds, active-player ownership, and the retained HTTP path.

Verification checklist:

- Static app-script parsing passed all `8/8` inline and external script assets.
- `node tools\\check-aegis-build.cjs` passed with the browser 0145/native 0015 labels and real Test Voices PCM energy checks.
- Localhost start-screen and Geoscape smoke passed with the new 0145 label.
- Browser Build Health passed `293/293`, including `Direct-file recorded voice fallback avoids blocked local fetches`.
- The localhost computer, aircraft, and soldier Test Voices sequence completed with status `passed` while music was active.
- A practical six-soldier 64x64 safe-2D incident launched, soldier selection exposed current TU and movement controls, and three End Turn cycles returned to the human phase.
- No browser runtime error overlay appeared during voice, Geoscape, Build Health, launch, or tactical testing.
- Godot 4.7.1 strict editor parsing passed; the unchanged native 0015 suite passed `108/108`, with Build Health remaining `82/82`.

Manual validation still required:

- Open `index.html` directly, open Audio Settings, leave Voices enabled at 100%, and press `Test Voices`.
- Confirm computer, aircraft, and soldier clips play in order, music dips and returns, and lowering or muting Voices affects speech without affecting SFX.

---

# v0.26.07.31.0144 / GODOT.0015 - Voice Audibility Normalization and Music Ducking

Browser build `v0.26.07.31.0144_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_PARITY_PATCH` and native build `v0.26.07.31.GODOT.0015_VOICE_AUDIBILITY_NORMALIZATION_AND_MUSIC_DUCKING_VERTICAL_SLICE` preserve save format 4 and repair the inaudible Test Voices mix without changing gameplay state or tactical outcomes.

Root causes addressed:

- The recorded takes are valid but average roughly -21 to -28 dBFS, leaving speech masked by the full-level music bed even with the voice slider raised.
- Computer and aircraft clips relied entirely on category processing, with no clean reinforcement path to preserve consonants and speech intelligibility.
- The old Test Voices result proved only that sources were scheduled and ended; it did not reject silent or near-silent take data.

Implemented roadmap scope:

- Browser playback samples at most 12,000 values from the selected take, caches its RMS/peak result, rejects takes below a conservative audibility floor, and applies bounded makeup gain limited by both target RMS and a 0.9 peak ceiling.
- Processed computer and aircraft voices keep their existing 1980s computer/radio character while adding a low-level clean intelligibility path. A dedicated compressor-limiter controls the combined voice peak.
- Active dialogue ducks streamed and synthesized music to 16% of its selected level, then restores it smoothly after the final queued clip. SFX volume and tactical behavior are unchanged.
- Godot voices receive matching +6 dB bounded player makeup and duck the Music player by 16 dB for the duration of the queued voice sequence.
- Browser Build Health adds actual bounded normalization and intelligibility/ducking rows. Native Build Health adds the paired makeup/ducking row. The seam checker reads the real PCM data for all three Test Voices categories and rejects any test take below the same audibility floor.

Verification checklist:

- Static browser parsing passed all `8/8` script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0144/0015 labels and real WAV energy checks.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`; native Build Health passed `82/82`.
- Browser Build Health passed `292/292`.
- Localhost start screen and Geoscape smoke passed with the new 0144 label.
- The computer, aircraft, and soldier test WAV URLs each returned HTTP 200 and the sequential browser Test Voices command completed while music was active.
- A practical six-soldier 64x64 safe-2D incident launched, selected-soldier movement highlighting produced 150 cells, and three End Turn cycles returned to the human phase.
- No browser runtime error overlay appeared during the voice, Geoscape, Build Health, launch, or tactical tests.

Manual validation still required:

- Set Voices to 100%, leave music playing, press `Test Voices`, and confirm all three categories are clearly audible while music dips and then returns.
- Repeat at 50% and confirm volume changes without muting SFX or music.
- Trigger a UFO/base announcement, a Skyranger aircraft call, and several tactical soldier lines naturally; confirm they remain ordered and intelligible.
- Toggle Voices off and confirm recorded speech stops while Test SFX and music remain audible, then reload and verify the preference persists.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.29.0143 / GODOT.0014 - Dedicated Voice Bus, Controls, and Playback Recovery

Browser build `v0.26.07.29.0143_DEDICATED_VOICE_BUS_CONTROLS_AND_PLAYBACK_RECOVERY_PARITY_PATCH` and native build `v0.26.07.29.GODOT.0014_DEDICATED_VOICE_BUS_CONTROLS_AND_PLAYBACK_RECOVERY_VERTICAL_SLICE` preserve save format 4 and repair the shared recorded-dialogue path without changing tactical outcomes.

Root causes addressed:

- Browser dialogue was connected to the low-gain SFX node, so voice level could not be raised independently from clicks and weapon sounds.
- Audio-context resume was issued without waiting for the browser to accept it. A queued strategic or tactical announcement could therefore reach playback while the context was still suspended.
- There was no explicit voice mute, voice level, or direct playback test, making a failure across all three voice categories difficult to distinguish from a quiet SFX mix.
- Native dialogue also reused its SFX player even though a `Voices` bus already existed in the project layout.

Implemented roadmap scope:

- Browser dialogue now routes through a dedicated `voiceGain` node connected directly to the destination. SFX remains on its existing bounded gain.
- Any pointer or keyboard interaction attempts to unlock the browser audio context; recorded playback explicitly awaits resume and declines cleanly if the context remains suspended.
- Audio Settings now includes a Voices checkbox, independent 0-100 volume slider, and `Test Voices` command. Enabled state and volume persist in local browser storage without changing campaign saves.
- `Test Voices` plays a base-computer clip, an aircraft-radio clip, and a soldier clip sequentially through their existing category-specific processing and reports a pass only when all three complete.
- Godot now uses a dedicated `VoicePlayer` on a `Voices` bus routed to `Master`, persistent voice mute/volume configuration, and matching Audio Settings/Test Voices controls.
- Browser Build Health gains three dedicated voice-control rows. Native Build Health gains a matching bus/control row, and the seam checker continues to validate all 105 WAV recordings and at least 300 segmented takes.

Verification checklist:

- Static browser parsing passed `8/8` executable script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0143/0014 labels and dedicated voice seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`.
- Native Build Health passed `81/81`.
- Browser Build Health passed `290/290`.
- Localhost smoke passed through the updated start screen, first-base confirmation, and Geoscape.
- Browser `Test Voices` transitioned from `playing` to `passed` after sequential computer, aircraft, and soldier playback.
- Voice mute disabled the test command and re-enabling voices restored it.
- Current browser diagnostics contain no runtime errors. The only warning is the existing Tailwind development-CDN advisory.

Manual validation still required:

- Use `Test Voices` at several voice levels and confirm the base-computer, aircraft-radio, and soldier clips are all clearly audible and appropriately processed.
- Turn Voices off, trigger base, aircraft, and combat events, and confirm all recorded speech remains muted while SFX still plays.
- Re-enable Voices, reload the page, and confirm enabled state and volume persist.
- Trigger a UFO detection, Skyranger launch/return, and tactical movement/fire sequence naturally; confirm clips remain ordered and do not overlap.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0142 / GODOT.0013 - AI Command Reclaim, Rescue Paths, and Voice Recovery

Browser build `v0.26.07.28.0142_TACTICAL_AI_COMMAND_RECLAIM_RESCUE_PATH_AND_VOICE_RECOVERY_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0013_TACTICAL_AI_RECLAIM_RESCUE_PATH_AND_VOICE_RECOVERY_VERTICAL_SLICE` preserve save format 4 and repair AI-controlled tactical continuity in both clients.

Root causes addressed:

- Browser AI command generated a bounded continuation from the live battle but exposed no way to stop playback and resume direct control.
- Rescue movement repeatedly chose one locally attractive step. Equal-scoring cells could make one escort oscillate while the rest of the squad was starved of work.
- A shortest route to the craft interior could approach beside the ramp, leaving a correctly following civilian one cell away from extraction.
- Browser soldier cues could begin outside the handoff click and be suppressed by soldier cooldown behavior. Native voice requests replaced the current stream instead of waiting their turn.

Implemented roadmap scope:

- `Take Back Control` cancels pending AI playback timers and restores direct human command at the currently displayed frame. Positions, HP, TU, ammunition, civilians, cover damage, breaches, fog, and round state are retained.
- Native AI command exposes the same reversible control and stops between bounded soldier actions before returning a living soldier selection and reachable cells.
- Human AI scheduling is deterministic and round-robin, so later soldiers receive rescue/exploration opportunities instead of one soldier monopolizing every turn.
- Rescue targets use one bounded reachable-cell flood per soldier. A short visited-cell history penalizes reversals, while two stalled escort turns release civilians for squad reassignment.
- Escort extraction composes the bounded approach path with the ordered ramp centerline and one clear interior egress cell, ensuring single-file followers cross an extraction hex.
- Combat movement in both clients remembers a bounded recent-cell history and penalizes immediate reversals without changing deterministic attack, LOS, cover, or TU rules.
- Browser handoff audio is unlocked by the player click and AI soldier cues explicitly join the tactical queue. Godot queues voice files sequentially and emits movement, contact, shot, hit, miss, kill, handoff, and reclaim cues.
- Browser and native Build Health each gain reclaim, rescue anti-loop, and tactical voice rows. Native automation directly verifies multi-soldier rescue work, unique-cell routing, and state-preserving reclaim.

Verification checklist:

- Static browser parsing passed `8/8` executable script assets.
- `node tools\check-aegis-build.cjs` passed with paired 0142/0013 labels and all new recovery seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `108/108`, including three practical End Turn cycles.
- Native Build Health passed `80/80`.
- Browser Build Health passed `287/287`.
- Localhost smoke passed through start screen, first-base confirmation, Geoscape, six-soldier squad assignment, launch confirmation, Skyranger travel, and a live 64x64 safe-2D incident.
- AI command inherited the live incident and exposed `Take Back Control`; reclaim at frame `2/17` restored a human turn and reported that positions, damage, ammunition, TU, civilians, and breached cover were retained.
- The reclaimed live battle completed three subsequent End Turn cycles and returned to the human phase each time.
- Current browser diagnostics contain no runtime errors. The only warning is the existing Tailwind development-CDN advisory.
- All seven native tactical cue files referenced by this patch exist in the dialogue asset directory.

Manual validation still required:

- Reproduce the originally affected mandatory-rescue battle, reveal civilians, hand command to AI, and confirm several soldiers act while escorts reach the ramp without two-cell oscillation.
- Use `Take Back Control` during movement, after a shot, after a casualty, and during the mandatory secure-rescue phase; verify every visible tactical value remains at the displayed frame.
- Listen with Voices enabled in both clients and confirm handoff, movement, contact, firing, miss, kill, and reclaim phrases play sequentially at a useful volume.
- Run an escort with two to four civilians and confirm the whole column follows the same path and extracts through the ramp centerline.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0141 / GODOT.0012 - Classic Hand Slots, Targeting, and Grenades

Browser build `v0.26.07.28.0141_TACTICAL_CLASSIC_HAND_SLOTS_TARGETING_AND_GRENADE_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0012_TACTICAL_HAND_SLOTS_TARGETING_AND_GRENADE_VERTICAL_SLICE` preserve save format 4 and advance the classic battlescape command surface in both clients.

Root causes addressed:

- Tactical inventory reported a right-hand weapon but did not expose functional hand selection or a left-hand field item.
- Clicking an alien, structure, or movement cell shared one implicit action path, leaving no persistent targeting state or readable cancellation step.
- The command console listed throwable preparation as a future exception because no bounded grenade gameplay contract existed.

Implemented roadmap scope:

- Each deployed soldier receives one mission-local Frag Grenade in the left hand; the equipped weapon remains in the right hand. Campaign saves and strategic stores are unchanged.
- Right-hand selection enters weapon targeting. Left-hand selection reports preparation state; priming costs 4 TU and enters grenade targeting. Cancel Target restores movement.
- Grenade throws cost 12 TU, have a six-hex range, consume the one charge, and return the active hand and mode to normal movement.
- The deterministic blast examines at most seven cells: 28 base damage at the center and 16 on neighboring cells, with small armor reduction and deterministic variance.
- Blast damage affects aliens, soldiers, and civilians. Alien kills are credited to the thrower, while civilian danger is reported honestly.
- Center and edge breach damage reuse structural destruction rules. Destroyed walls remain visible rubble with no hard blocker, so soldiers, aliens, and civilians can traverse the opening.
- Browser 2D cells and Three.js canvas use explicit fire/grenade cursors; the native board shows ranged target outlines and a line to the hovered target.
- Browser Build Health gains three hand/preparation/blast rows. Native Build Health gains the matching three rows, and the native automated suite gains three direct tactical checks.

Verification checklist:

- Static parsing passed for all six inline browser scripts.
- `node tools\check-aegis-build.cjs` passed with paired 0141/0012 labels and hand/grenade parity seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `105/105`, including three practical End Turn cycles.
- Native Build Health passed `77/77`.
- Browser Build Health passed `284/284`.
- Localhost browser smoke passed through start screen, first-base confirmation, Geoscape, mission selection, Skyranger flight, and safe-2D tactical launch.
- In a live browser battle Caleb primed at `59 -> 55 TU`, threw at `55 -> 43 TU`, consumed `Frag x1 -> x0`, applied a seven-cell blast, and returned to movement mode.
- The same live battle completed three additional End Turn cycles and returned to the human phase each time.
- Current-load browser diagnostics contain only the existing Tailwind CDN development warning; no current patch runtime error was recorded.

Manual validation still required:

- Throw grenades near mixed aliens, soldiers, and civilians to judge center/edge damage, friendly-fire clarity, and whether the 4 TU plus 12 TU cost feels fair.
- Destroy exterior walls and partitions with grenades, then path a soldier, alien, escorted civilian, and panicked civilian through the resulting rubble.
- Compare fire and grenade targeting in 2D Hex and Three.js Iso at normal display resolution, including cancellation and out-of-range feedback.
- Prime a grenade, end the turn, and confirm preserving preparation into the next human turn is understandable.
- Exercise the Godot hand buttons and grenade cursor at the player's normal window size to check console spacing and target-line readability.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_INVENTORY_TRANSFERS_AND_ELEVATION_FOUNDATION_PARITY_PATCH`, beginning with bounded adjacent-unit hand/belt transfers and floor-state data before any multi-level renderer rewrite.

---

# v0.26.07.28.0140 / GODOT.0011 - Tactical AI Doctrine, Reaction Fog, and Classic Command Console

Browser build `v0.26.07.28.0140_TACTICAL_AI_DOCTRINE_REACTION_FOG_AND_CLASSIC_COMMAND_CONSOLE_PARITY_PATCH` and native build `v0.26.07.28.GODOT.0011_TACTICAL_AI_DOCTRINE_AND_REACTION_FIRE_VERTICAL_SLICE` preserve save format 4 and advance the browser game and Godot vertical slice together.

Root causes addressed:

- AI movement previously favored direct pursuit and rescue routing without a shared commander-centered formation or cover/flank score.
- The Godot commander comparator selected the lowest-scoring candidate; it now selects the highest rank/mission/bravery/Reaction score with deterministic ID tie-breaking.
- Manual browser alien turns retained an older beeline branch and could target civilians while living soldiers remained.
- AI takeover could expose frame information beyond the squad's current observation even when direct player control used fog of war.
- Tactical action controls were distributed through the side panel and did not provide a compact classic battlescape command surface.

Implemented roadmap scope:

- Commanders learn Protected Wedge, Assault Line, Echelon Flank, Support and Maneuver, and Diamond Security doctrine from rank plus completed-mission thresholds.
- AI assigns commander, left/right flank, base-of-fire, and security roles; non-commanders remain within a bounded command radius while the formation fans toward known threats.
- One bounded reachable-cell flood supplies each move decision. Scoring considers cover, LOS, weapon range, flank side, commander distance, role, and forward progress without restoring per-cell pathfinding or full-map repeated scans.
- Exploring soldiers preserve enough TU for their selected fire mode. Civilian escorts preserve the same reaction reserve while advancing toward the ramp.
- Reaction fire checks each observed alien movement step against the soldier's Reaction stat, range, LOS, TU, current fire mode, and ammunition. Each soldier can interrupt a given alien phase only once.
- Alien AI targets living humans first, seeks cover and lateral pressure, preserves attack TU, and fires after movement when it gains a valid solution.
- AI command inherits the live battlefield and current round. Unobserved alien movement and shots remain hidden; map contacts and playback camera anchors use current observation rather than historical reveal.
- Both clients expose a first functional classic battlescape console: previous/next soldier, tactical map, field inventory, kneel/stand, no/snap/aimed/auto/kneel TU reserves, Done/TU bleed, End Turn, AI Command, and confirmed Dust Off.
- Remaining original-game command depth is recorded honestly: hand-slot transfers, throwable preparation, dedicated targeting cursors, and elevation controls are not represented until matching gameplay systems exist.

Verification checklist:

- Static parsing passed for all six inline browser scripts.
- `node tools\check-aegis-build.cjs` passed with paired build labels and required AI/UI seams.
- Godot 4.7.1 strict editor parsing passed.
- Native tests passed `102/102`, including three practical End Turn cycles.
- Native visible Build Health passed `74/74`.
- Browser Build Health passed `281/281`.
- Localhost smoke passed through start screen, first-base setup, Geoscape, six-soldier squad assignment, launch confirmation, Skyranger travel, and a live 64x64 safe-2D incident.
- Snap reserve and Field Inventory were exercised on a selected soldier.
- AI command inherited round 1, played fifteen frames across seven combat exchanges, and reached tactical victory.
- Browser console errors were clear. The only warning was Tailwind's existing development-CDN advisory.

Remaining risks and manual validation:

- Observe a veteran-led squad and confirm advanced doctrine produces readable flanks without excessive bunching or separation from the commander.
- Verify Snap, Aimed, Burst/Auto combinations reserve the expected TU after movement, reload, and fire-mode changes.
- Watch aliens cross multiple visible hexes and confirm valid Reaction-stat shots consume TU/ammo once; repeat with movement completely outside squad observation and confirm no alien model, movement, shot, or camera jump appears.
- Run a mandatory civilian rescue under AI command. Confirm the escort keeps a reaction reserve, civilians remain single-file, and rescue takes priority after civilians are spotted.
- Confirm aliens seek cover and attack soldiers rather than diverting to civilians while any soldier survives.
- At the player's normal resolution, inspect Map, Inventory, stance, reserves, Done, End Turn, AI Command, and Dust Off in both browser and Godot clients for clipping or ambiguity.

Next recommended paired patch after this gate: `TACTICAL_CLASSIC_HAND_SLOTS_TARGETING_AND_THROWABLE_PREP_PARITY_PATCH`, adding bounded functional hand-slot transfers, targeting cursors, and throwable preparation before deeper elevation controls.

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
- The browser campaign remains the complete reference game and the Godot 4 build remains a vertical slice, but new player-facing gameplay rules now ship as paired browser/Godot patches unless a temporary exception is explicitly recorded.

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
`v0.26.08.01.0146_FULL_SQUAD_AI_COMBAT_PRIORITY_AND_THREAT_AVOIDING_ESCORT_PARITY_PATCH`

## Native Vertical Slice Build
`v0.26.08.01.GODOT.0016_FULL_SQUAD_AI_COMBAT_PRIORITY_THREAT_AVOIDING_ESCORT_AND_SEQUENTIAL_ACTION_VERTICAL_SLICE`

## What This Patch Was Intended To Add
This paired tactical/strategic patch adds:
- Full-squad bounded AI tasking with squad-contact combat priority and retained civilian escort duty.
- Threat-aware civilian extraction routes and sequential visible-actor playback without exposing hidden aliens.
- Exact shooter-to-target Classic Lineup tracers.
- Compact-header base selection, explicit no-Skyranger recruitment confirmation, and squad-home mission recovery ownership in the browser campaign.
- Five browser Build Health rows and three paired native rows without changing save format 4.

The current release line also preserves this cumulative implemented scope:
- A save-compatible hangar-occupancy correction so Outbound and Returning aircraft no longer occupy the physical hangar they already departed.
- Preserved destination/home reservations, keeping real hangar capacity and staged-route overbooking protections intact.
- A supplied-save regression covering Fort Aegis to S. America staging and the final S. America incident round trip.
- An explicit browser-only parity exception for multi-base ferry routing until that system exists in the Godot vertical slice.
- Base-local browser Medkit issue, return, and display using the existing inventory ownership model.
- One-charge browser tactical self-treatment matching the native 12-HP and 12-TU rule.
- Final tactical HP and remaining Medkit charge propagation into browser mission resolution.
- One-to-five-day browser wound recovery derived from final missing HP, with unused KIA Medkit recovery on victory and loss on defeat.
- An explicit paired browser/Godot gameplay contract in the manifest and checker so future player-facing rules cannot silently diverge.
- Continuous Three.js building walls joined along the true offset-hex neighbor vectors instead of isolated per-cell posts.
- Solid corner cores with deliberate openings at doors and destroyed wall cells.
- Explicit all-unit breach traversal coverage for player movement, alien pathing, and panicked civilians.
- AI-controlled continuation through achievable mandatory civilian rescue phases after alien elimination.
- A bounded area-secure sweep for unrevealed survivors, distinct-rescuer assignment, deepest-ramp routing, and rescued/required playback labels.
- Shared manual/AI rescue completion rules without falsely killing a surviving squad when the AI extraction budget expires.
- Screen-neutral strategic UFO speed prompts so choosing a speed cannot replace Base, Soldiers, Research, Workshop, Missions, or a live incident battlefield with the Geoscape.
- Deferred post-battle Geoscape speed application while manual tactical combat keeps the strategic clock paused.
- A bounded area-secure rescue phase when a mandatory civilian requirement is incomplete but still achievable after the last alien falls.
- Clear remaining-rescue, completed, optional, and impossible objective feedback without changing tactical outcomes before area security.
- Build Health and checker coverage for tactical alert ownership, deferred speed, and civilian rescue-phase completion rules.
- A shared per-cell tactical visual descriptor used by both 2D CSS cells and Three.js terrain palette batches.
- Shared 0.755 row-step and half-cell odd-row-offset constants matching the actual 2D board layout.
- Exact base/accent canvas gradients on bounded Three.js instanced palette batches instead of midpoint-only solid colors.
- A custom flat Three.js hex footprint matching the 2D clip polygon, plus one bounded seam-underlay batch for raster junctions.
- Build Health and checker coverage for Urban gradient diversity, shared cell centers/footprints, and seam closure.
- Per-cell Three.js terrain colors sourced from the same `tacticalTerrainForCell` base/accent pairs as the 2D map.
- Bounded explicit-material palette batches that avoid the failing per-instance tint path while keeping thousands of ground cells instanced.
- Pointy-top Three.js hex geometry aligned to the existing odd-row tactical coordinate spacing, removing the repeating triangular holes between tiles.
- Build Health and checker coverage for 2D/3D palette parity, bounded batching, and gapless geometry math.
- Stronger base-computer processing with coarser stepped-wave quantization, deeper square-wave modulation, compression, and a bounded 22 ms metallic parallel delay.
- Generated band-limited static before and after soldier recordings without changing the supplied WAV assets or moving voices off the shared Sound Effects volume control.
- A soldier playback-tail promise that includes decode time, clip duration, and trailing static, and which strategic computer/aircraft FIFO work must await before starting.
- Explicit Wilderness, Farmland, Small Town, and Urban District ground colors on the existing single Three.js instanced ground mesh, bypassing the browser path that rendered per-instance floor colors black.
- Build Health and checker coverage for robotic computer processing, soldier static, the tactical-to-strategic audio gate, and visible biome ground materials.
- One context-aware recorded soldier callout per AI tactical playback frame, covering movement, fire, misses, kills, wounds, and the final alien defeat in both map and classic playback.
- Personality-aware AI chatter using each frame soldier's preserved campaign identity and the existing soldier-category cooldown, avoiding a delayed tactical speech backlog.
- A shared FIFO for all non-soldier recorded announcements so base-computer and aircraft clips cannot overlap or overtake one another.
- Clip-end waiting with a short inter-announcement gap; existing intentional delays remain relative to each queued phrase.
- Build Health and checker coverage for AI frame cue selection, soldier identity propagation, strategic queue routing, and tactical/strategic queue separation.
- Action-aware tactical AI watch-camera anchors for squad movement, civilian rescue, casualties, alien movement, shot midpoints, and quiet-frame squad fallback.
- Per-frame camera updates during AI tactical-map takeover without rebuilding or resetting the inherited battlefield.
- A high-pass/low-pass, stepped-wave, compressed, lightly modulated base-computer voice chain for recorded `computer` dialogue.
- A tighter-band, stronger-modulation aircraft-radio chain for recorded `aircraft` dialogue, while soldier and other voice categories remain clean.
- Shared Sound Effects volume/mute ownership for all recorded voice categories, preserving the existing audio controls.
- Build Health and seam-checker coverage for action camera selection and category-specific recorded-dialogue processing.
- A generated recorded-dialogue manifest covering all 105 supplied WAV files, 87 event keys, four soldier delivery styles, and 326 silence-separated takes without modifying the source recordings.
- Lazy per-file fetch/decode caching, take-repeat avoidance, category cooldowns, and synthesized SFX fallback so recordings do not add tactical map or turn-processing work.
- Command alerts for save/load, research/manufacturing/construction/transfer completion, personnel, incidents, UFO contact, mission outcomes, funding/aircraft blockers, council reports, and command attention.
- Aircraft announcements for Skyranger launch, touchdown, ramp deployment, return, landing, and interceptor launch.
- Personality-matched soldier selection, movement, reload, combat-result, injury, End Turn, and victory callouts with steady-professional fallback for phrases not recorded in every style.
- Build Health and checker coverage for recording count, take bounds, required events, source-file existence, personality variants, semantic mapping, and runtime seams.
- A lighting-free tactical visibility context with fixed 20-hex vision and indexed cover lookups, removing local-light generation and per-cell illumination work from LOS and rendering.
- A bounded human-visibility pass that visits only cells within observer vision range, deduplicates overlap, and exposes constant-time visible-cell membership to both tactical renderers.
- A single breadth-first reachable-cell flood fill for soldier selection instead of running a separate path search for every candidate destination.
- Removal of redundant 64x64 visibility scans during reveal/exploration and cover-reveal updates.
- Build Health coverage for a deterministic Port Attack visibility/reachability workload and the new indexed tactical seams.
- A single colorized `THREE.InstancedMesh` for tactical ground instead of one mesh per visible hex, while preserving instance-aware cell picking.
- Exact pointy-hex center spacing plus a tiny overlap so neighboring ground hexes meet edge to edge without blue seams.
- A reliable 2D tactical default for new campaigns; players opt into Three.js with the explicit `3D Iso` control.
- A Three.js context-loss/missing-instancing recovery path that returns to the playable 2D battlefield instead of leaving a stalled mission.
- Persistent Auto, Performance, and Quality controls on the main menu so lower-powered PCs can arm Performance mode before launching a mission.
- Build Health coverage for instanced-ground budgets, instance picking, gapless hex spacing, main-menu preference wiring, and 2D recovery.
- Persistent Auto, Performance, and Quality controls beside the Three.js tactical view selector.
- Conservative Auto hardware detection that selects Performance on lower/unknown memory-core profiles and balanced settings only on stronger profiles.
- Performance mode: 1x pixel ratio, antialiasing off, shadows off, Lambert materials, 32x32 maximum 3D overview, lower-detail rings, and no redundant fog meshes.
- Auto Balanced mode: 1.2x pixel ratio, shadows off, and a 40x40 maximum overview.
- Quality mode retains higher pixel density, shadows, standard materials, fog meshes, and the full 64x64 overview for players who explicitly choose it.
- Normal-cell ring removal so only edge, reachable, and selected cells create ring geometry.
- Tactical building, street-lamp, vehicle, and interior light simulation is parked; these remain terrain and visual props without affecting LOS or creating static point lights.
- On-demand idle rendering; continuous animation frames now run only for the victory dance.
- Build Health performance budgets covering mode resolution, view caps, light caps, shadow/fog/ring budgets, idle frames, picking, and UI wiring.
- Taller overlapping cutaway wall runs and internal room partitions so tactical structures read as enclosed buildings rather than isolated wall segments.
- Denser, purpose-specific interiors: records desks/files, market shelves, workshop tools/workbenches, diner counters/tables, residential beds/sofas, fire-station lockers, farmhouse kitchens, barn hay/racks, and outpost radios.
- Deterministic sedans, vans, utility vehicles, headlights, and roadside lamp posts on city, small-town, and farm routes.
- Incident arrival-clock stamping plus solar phase calculation from Geoscape month/day/minute and incident latitude/longitude.
- Day, twilight, and night ambient/fog/directional lighting in Three.js and matching brightness/saturation treatment in 2D Hex.
- Night/twilight visibility ranges that improve inside illuminated interiors and near lamps or vehicle headlights.
- Build Health coverage for enclosure partitions, furnishing diversity, vehicles, lamps, solar phase, local-light vision, render support, and mission clock normalization.
- Deterministic tactical building districts inspired by the readable, roofless battlefield architecture of early alien-defense strategy games while using original Project Aegis layouts and names.
- Urban Municipal Records Offices, Corner Markets, and Vehicle Workshops; small-town Diners, Residences, and Fire Stations; Farmhouses and Equipment Barns; and wilderness Ranger Outposts.
- Shared building plans for 2D Hex and Three.js, including passable door gaps, hard walls, partial-cover windows, interior floors, counters, tables, shelves, and storage racks.
- Building walls participate in existing hit points, shot absorption, pathfinding, fog of war, and line-of-sight rules instead of being decorative scenery.
- Roofless Three.js cutaway walls and glass plus distinct 2D wall/window/furnishing artwork.
- Tactical status and event-log summaries that name the generated structures without revealing hidden occupants.
- Build Health coverage for biome variety, doors, walls, windows, furnishings, interior terrain, both render paths, and safe unit deployment.
- A persistent Globe / Terminator Map segmented control on the Geoscape and first-base site view.
- A full-world flat map using the existing detailed landmass geometry and current Project Aegis map colors.
- A smooth day/night mask calculated from the authoritative Geoscape month, day, and minute state; the subsolar point and terminator move whenever simulation time advances.
- The same bases, incidents, detected UFOs, alien bases, aircraft, range rings, ferry links, and placement crosshair on the flat operational map.
- A serial aircraft relocation queue foundation that reserves destination hangars immediately and keeps queued aircraft unavailable until their clock-tracked route begins.
- Compact active/queued relocation summaries naming craft, destination, route, ETA, and reservation state.
- A classic-lineup victory-animation correction so only paper dolls dance while their information cards remain stable.
- Build Health rows for relocation queue reservations, classic paper-doll-only dancing, and the clock-synchronized terminator map.
- Staged Skyranger and interceptor markers now show compact current phase labels on the Geoscape globe, such as ferry, refuel, attack, and return phases.
- The Geoscape globe now includes a small Solar readout in the globe header so the player can tell whether the visible terminator is daylight, night side, dawn, or dusk.
- Day/night lighting is more readable through stronger terminator placement, a brighter sun glow, more visible twilight line, and synchronized Three.js ambient/back-light intensity.
- Build Health now includes `Staged aircraft route labels and day-night globe lighting are readable`.
- New-base placement ferry previews now render Interceptor and Skyranger ferry eligibility as separated side-by-side dotted lanes with distinct colors when both craft types can connect the proposed base to an existing base.
- Build Health now includes `New-base placement previews separated Interceptor and Skyranger ferry lanes`.
- Skyranger mission confirmation now surfaces staged ferry/refuel incident routes instead of only showing the final staging-base round trip.
- Staged Skyranger loadout checks use the home/origin base where the squad boards, not the forward staging base where the transport refuels.
- Build Health now includes `Skyranger ferry staging extends incident response range`, covering a mission that is out of direct Skyranger round-trip range but reachable through an open-hangar staging base.
- Phase-aware travel display for staged aircraft routes so craft visibly depart their home base, fly ferry/refuel legs, then depart the staging base for the UFO or incident.
- Skyranger mission launch can now select a same-base squad/Skyranger pairing that stages through an owned base with an open hangar when direct mission range is not enough.
- Staged Skyranger travel stores the final mission return base so the return leg goes back to the forward staging base instead of pretending the transport started there.
- The ChatGPT-applied staged-interceptor execution pass is now recorded: interceptor staged routes can execute ferry/refuel/attack/return phases and prompt after a surviving UFO whether to attack again or ferry back home.
- Build Health now includes `Staged aircraft routes display origin ferry legs`.

- UFO Tracking now checks the ferry/refuel staging planner when no interceptor has a direct home-base round trip to a detected UFO.
- Detected UFOs reachable through a staging base now report `staged route available`, naming the interceptor, staging base, one-way ferry leg, and final refueled intercept round trip.
- Interceptor launch blockers now distinguish a recognized staged route from a true range/fuel failure, while leaving full staged launch execution as the next bounded patch.
- Build Health now includes `Interceptor UFO tracking recognizes ferry-staged reach`.

- New-base placement now draws dotted ferry-link lines from the proposed site to existing bases when at least one currently accessible aircraft type can fly the one-way base-to-base leg.
- Ferry-link preview text names each connected base, approximate one-way distance, and the aircraft types that can make the trip.
- The link preview uses current aircraft access and fuel-tank upgrade range profiles, while keeping the existing aircraft reach rings intact.
- Build Health now includes `New-base placement previews dotted aircraft ferry links`.
- Aircraft ferry/refuel staging planning helpers that evaluate owned bases as intermediate refuel stops.
- Ferry legs are checked as one-way base-to-base flights so aircraft can use their full practical range to reach a staging base.
- Final incident/intercept legs from the staging base still require enough refueled range/fuel for the round trip back to that last staging base.
- Staging requires an owned base with an open hangar slot.
- UFO Tracking now includes a compact Ferry / Refuel Staging readout for selected incidents and detected UFOs.
- Build Health now includes `Aircraft ferry staging checks open hangars and refuel legs`.
- Mission launch confirmation now previews the selected Skyranger, launch base, round-trip distance, fuel commitment, and response-force soldier loadout before the player confirms.
- The confirmation modal now reports local launch-base weapons/armor stock, issued gear, in-transit gear, unarmed soldiers, and soldiers without armor.
- Barracks now shows a clear empty-state message when the selected base has no local weapons or armor available for rearming.
- Pure helper seams now summarize selected-base loadout stock and mission-launch loadout readiness.
- Build Health now includes `Mission confirmation explains local loadout and launch base`.
- Barracks equip buttons now list only weapons/armor available in the currently selected base's local stores.
- Equip button labels name the selected base stock source instead of showing aggregate global inventory.
- Loadout availability tooltips now describe selected-base stock, issued gear, and in-transit gear counts.
- Pure helper seams now count issued equipment and in-transit equipment for an item.
- Build Health now includes `Base-local loadout buttons only advertise selected-base stock`.
- A compact selected-base Logistics Center that merges inbound/outbound soldier and equipment transfers into one manifest.
- Transfer manifest rows show direction, payload, origin, destination, ETA, fee-paid state, no-refund status, and cancel action.
- Quartermaster equipment transfers now offer bulk payload choices of 1, 5, and All where local stock allows.
- Bulk transfer fees scale from the existing distance/handling cost rules.
- Build Health now includes `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Clear base-to-base logistics fees for soldier and equipment transfers.
- Insufficient-funds blockers for soldier/equipment transfer creation.
- Cancel-to-origin actions for in-transit soldiers and equipment, with explicit no-refund messaging.
- Personnel Transfers and Quartermaster item transfer cards now show transfer fee/cancel information.
- Build Health now includes `Base transfer logistics charge fees and cancel back to origin`.
- The solid Geoscape globe now renders visible land using the detailed `GEOSCAPE_THREE_LANDMASSES` dataset from the earlier hologram globe, preserving the more recognizable continent/island shapes.
- The coarse `EARTH_BASE_REGIONS` polygons are no longer used as filled visible continents; they remain as transparent/subtle selection boundaries for gameplay region logic.
- Build Health now includes `Solid Geoscape globe uses detailed landmasses and remains draggable`.
- Geoscape globe input now remains available even when Skyranger or interceptor travel state exists, preventing stale travel records from permanently locking map rotation.
- A small interaction policy helper defines drag, wheel, click, and incident-focus behavior so future travel-camera work does not accidentally disable player globe control.
- The Geoscape globe now uses a solid ocean fill, visible land fills/strokes, capped terminator shading, and restrained cloud/gloss layers so Earth reads more like a satellite globe than a transparent hologram.
- Build Health now includes `Solid Geoscape globe remains draggable during travel states`.
- The first-base selection screen now shows the first two opening alien incidents before the player confirms the starting base.
- Opening incidents are deterministic North America crisis markers: `Prairie Abduction` and `Red River Signal`.
- The confirmed campaign starts with those same two opening incidents, keeping setup guidance and actual Geoscape state aligned.
- The first-base globe now previews dotted starting reach rings for Shortwave Radar coverage, Interceptor practical reach, and Skyranger practical reach.
- The setup side panel now explains whether both opening crises are inside the proposed starting site's Skyranger radius.
- Build Health now includes `First-base selection previews opening incidents and starting reach`.
- Workshop orders now preserve the production/destination base chosen when the order starts, instead of implicitly using the selected base at completion time.
- Completed Workshop stock is routed into the intended destination base's local stores.
- Workshop inventory display now shows manufactured stock for the currently selected base instead of global stock.
- Quartermaster/Base Stores now surfaces compact inbound/outbound equipment logistics summaries for the selected base.
- Quartermaster item cards now distinguish local stock, issued gear, and in-transit gear in a compact availability line.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the current playable build label and verify the new Workshop/logistics Build Health row.
- Build Health now includes `Workshop production preserves destination base and equipment logistics summaries`.
- A first `src/` source-layout scaffold while preserving `index.html` as the playable distribution artifact.
- `src/manifest.json` records the current playable artifact, save format, source areas, required runtime seams, and future engine-port targets.
- `src/engine-port-contract.md` defines the Godot 4 readiness boundary: JSON-friendly data, deterministic systems, UI adapters, explicit save migrations, and manifest-keyed assets.
- `tools/check-aegis-build.cjs` provides a dependency-free static seam check that validates the current build label and required architecture/runtime markers.
- `index.html` now exposes `ARCHITECTURE_MODULE_PLAN` and Build Health includes `Modular source layout and engine-port prep contract is present`.
- Mission recovery stock routing into the Skyranger return-base local `baseInventories`, while keeping legacy aggregate `gearInventory` compatibility.
- Successful mission alien spoils and KIA equipment recovery now update the local stores of the base that receives the returning Skyranger.
- Mission summaries now include a compact return-base stock delivery line.
- High-visibility UI text encoding cleanup removed broken currency/icon mojibake from the game file, including the Time Control funds line class of issue.
- Former fragile inline load/save marker text now uses the existing icon component path.
- Build Health now includes `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
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

0c. **Supplied-save staged Skyranger route**
   - Import or load `Project-Aegis-Campaign_slot_10_v0_26_07_17_0137_2026-07-26T06-25-26.project-aegis-save.json` without overwriting the source export.
   - Select the active South America Alien Abduction Site from the first base.
   - Confirm a Fort Aegis Skyranger can stage through the now-empty S. America hangar, refuel, and launch the incident response.
   - Confirm Saber One continues its existing return to Fort Aegis and still owns its Fort Aegis recovery reservation.
   - Confirm no occupied staging hangar is treated as open and no aircraft is duplicated or displaced.

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

Future ambient base-life note: when a base has an empty, operationally free hangar reserved for ferry-route flexibility, stationed soldiers can sometimes use that open space for improvised recreation such as soccer, touch football, sparring drills, or other off-duty games. This should be flavor/morale texture first, not a blocker: aircraft storage, ferry staging, refuel stops, hangar reservation, and emergency operations always take priority and immediately clear the space.

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
- Future ferry/staging routes where aircraft can land at another owned base with an open compatible hangar, refuel there, and launch a follow-up leg to extend practical response range.
- Multi-base sortie staging so Skyrangers and their squads can fly to a forward base, refuel, and join a closer-base Skyranger response when hangar capacity and timing allow.
- Ambient base-life use for empty, operationally free hangars: soldiers stationed at that base may use unused hangar floor space for morale/recreation scenes such as improvised sports, as long as this never interferes with aircraft storage, ferry staging, refuel reservations, or emergency launch readiness.
- Interception stances that trade hit chance against ammo burn, fuel use, damage risk, and repair time.
- Lightweight UFO evasion / air-combat event outcomes: confirmed shootdown, damaged escape, evasive maneuvers, contact lost, forced disengage, ammunition pressure, and cautious breakaway.
- Compact air-combat after-action reports in UFO Tracking for launch, impact, delayed crash, and recovery phases.
- Lightweight damaged-UFO memory after damaged escapes, including follow-up hit bonuses and delayed crash-site chances.

Still planned:
- Pilot/crew identity if the air-war layer needs named aviators later.
- Fuller multi-step air-combat history and filtering if the report list grows beyond the current compact latest-report model.
- Fuel tank upgrade path for Interceptors and Skyrangers, likely through Workshop purchase/install or research unlocks, increasing fuel capacity/range while preserving automatic refueling.
- Aircraft ferry/refuel staging through owned bases, including hangar reservation, refuel/turnaround timing, staged mission launches, staged interceptions, and clear return-home/stay-staged options.
- Hangar downtime scenes that make empty hangars feel lived-in: soldiers can use unused hangars for improvised sports or recreation when no aircraft, ferry reservation, refuel stop, transfer, repair, or emergency sortie needs the space. These scenes can feed small morale, friendship, rivalry, or squad-cohesion flavor later.
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
- Deterministic nature, farm, small-town, and city terrain shared by 2D and Three.js tactical views.
- Original biome-specific building archetypes with roofless cutaway presentation, doors, windows, destructible walls, interior floors, and furnishings.
- Building geometry participates in tactical movement, deployment, cover, fog of war, and line of sight.
- Enclosed building silhouettes with internal partitions and purpose-specific furnishing layouts.
- Street vehicles, lamp posts, headlights, and interior fixtures remain readable tactical scenery without active local-light simulation.
- Tactical LOS now uses a fixed 20-hex visibility range; Geoscape-clock day/twilight/night illumination gameplay is parked until it can fit the tactical performance budget.
- Persistent Auto/Performance/Quality Three.js modes with conservative hardware-aware defaults.
- Three.js view-size, pixel-ratio, shadow, light, material, ring, fog-mesh, and idle-frame budgets to prevent tactical timeouts.

Still planned:
- Tactical event log.
- Better unit selection/facing indicators.
- Better impact/miss feedback.
- Battlefield-space optimization.
- Simulated mission sprite consistency.
- Improve the Three.js battle option for alien incidents so manual tactical missions feel more readable, responsive, and worth choosing over auto-resolve.
- Add deliberate building-breach actions, fire/smoke propagation, power loss, and clearer damaged-wall/window states.
- Add civilians, rescue/extraction zones, and structure-specific objectives for terror, abduction, harvest, and supply missions.
- Explore upper floors, stairs, and roof visibility only after the single-level cutaway maps remain readable and performant.

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
First validate browser build 0139 against the supplied slot-10 export without overwriting it. Confirm Fort Aegis can select a staged Skyranger response through S. America, that the S. America hangar is available after Saber One has departed, and that Saber One keeps its Fort Aegis return reservation. Then complete the paired native 0010/browser 0138 medical gate: exact Medkit issue/return stock, 12-HP/12-TU treatment, one-charge consumption, final-HP wound duration, strategic-midnight recovery, KIA ownership, and imported-copy source isolation.

In a mandatory civilian-rescue incident, hand AI Command the live battlefield after the last alien dies or just before AI kills it. Confirm AI enters secure rescue, searches for unrevealed survivors, preserves existing escort chains, reports rescued/required progress, and extracts enough civilians before victory. Confirm an impossible requirement still resolves and an exhausted bounded rescue does not falsely mark surviving soldiers KIA. Then trigger a UFO speed prompt while working in Base, Soldiers, Research, Workshop, and Missions; choose a speed and confirm the same command section remains open while time advances. Repeat from an in-progress incident and confirm the battlefield remains active until the deferred speed applies after battle.

Manually listen to several base-computer announcements and confirm the stronger effect remains intelligible and suitably computer-like. Complete an AI-controlled incident and confirm the final soldier phrase plus trailing static finish before `all_aboard` or the first return-flight pilot phrase begins. Confirm the static bookends do not clip consonants or overpower quiet soldier takes at low and high Sound Effects volume.

Load the same Urban District save used for the supplied screenshots without overwriting it. At Near and Close zoom, compare the tan center-right region, dark terrain bands, buildings, Skyranger, soldiers, props, and map-edge cells in 2D and `3D Iso`; confirm each region occupies the same hex coordinates and no repeating black junction triangles remain. Repeat the affected high-threat Port Attack in Performance mode.

In a live tactical battle, empty a ballistic magazine, click Reload, immediately fire, and confirm the shot uses the restored magazine and post-reload TU. Reduce a soldier below Burst cost but keep at least 14 TU, click Burst then Single, and confirm the Single shot resolves instead of reporting Burst's TU requirement. Also confirm the selected-soldier extraction readout updates as civilians form, follow, hold, panic, and extract.

Repeat the exact affected high-threat Port Attack in safe 2D. If it still stalls, use `TACTICAL_AI_TURN_CHUNKING_AND_2D_DOM_VIRTUALIZATION_INDEX_ONLY` with phase timings before changing outcomes. If performance and the new status feedback are stable, continue `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY` as the next bounded tactical slice.

Focus verification on:
- Build New Base placement showing dotted ferry links from the proposed new site to existing bases when current aircraft can fly the one-way leg.
- Ferry-link text naming connected bases, one-way distance, and whether Interceptors, Skyrangers, or both can make the ferry trip.
- Moving the proposed site updating both the aircraft reach rings and the ferry-link connections.
- Existing base-placement confirmation behavior remaining visible and usable.
- Build Health including `New-base placement previews dotted aircraft ferry links`.
- UFO Tracking showing the Ferry / Refuel Staging readout without crowding the existing aircraft/radar controls.
- Selected incidents producing a Skyranger staging preview when a ready Skyranger, open staging hangar, and valid final round trip exist.
- Detected UFOs producing an interceptor staging preview when a ready interceptor, open staging hangar, and valid final round trip exist.
- One-way ferry legs allowing a craft to reach a staging base farther than a normal round-trip sortie would allow.
- Final staging-base-to-target legs still requiring refueled round-trip range/fuel back to the staging base.
- Closed/occupied hangars blocking staged-route readiness.
- Build Health including `Aircraft ferry staging checks open hangars and refuel legs`.
- Mission launch confirmation naming the selected Skyranger, launch base, round-trip distance, and fuel commitment.
- Mission launch confirmation showing response-force weapon/armor state plus local launch-base stock/issued/in-transit messaging.
- Barracks showing a clear selected-base empty state when no local weapons/armor can be equipped.
- Build Health including `Mission confirmation explains local loadout and launch base`.
- Barracks equip buttons showing only weapons/armor stocked at the selected base.
- Equip button labels naming the selected base as the stock source.
- Equip tooltips explaining local stock, issued gear, and in-transit gear counts.
- Switching bases changes the available equip buttons to that base's local stores.
- Build Health including `Base-local loadout buttons only advertise selected-base stock`.
- Logistics Center appearing on the selected base when inbound/outbound soldier or equipment transfers exist.
- Logistics Center rows showing direction, payload, origin, destination, ETA, fee-paid text, no-refund text, and cancel actions.
- Quartermaster equipment transfer controls offering 1, 5, and All payload choices when local stock allows.
- Bulk equipment transfer fees scaling from payload quantity and handling size.
- Build Health including `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Soldier transfer buttons showing ETA and logistics fee.
- Equipment transfer buttons showing transfer fee in Quartermaster/Base Stores.
- Transfers blocking when funds are below the required logistics fee.
- In-transit soldiers and equipment showing cancel actions that return the payload to the origin base with no refund.
- Canceled soldiers/equipment becoming available again at the origin base.
- Build Health including `Base transfer logistics charge fees and cancel back to origin`.
- Dragging the Geoscape globe after aircraft travel has occurred, including after Skyranger and interceptor sorties.
- Confirming the globe reads as a solid Earth-style map while keeping the more detailed hologram-era continent/island shapes.
- Build Health including `Solid Geoscape globe uses detailed landmasses and remains draggable`.
- First-base setup showing `Prairie Abduction` and `Red River Signal` before confirmation.
- The dotted first-base setup rings showing starting Shortwave Radar coverage, Interceptor practical reach, and Skyranger practical reach.
- The opening-crisis coverage summary showing both opening incidents inside the default North America starting Skyranger radius.
- First base confirmation carrying those same two incidents into the main Geoscape.
- Build Health including `First-base selection previews opening incidents and starting reach`.
- Workshop build orders showing and preserving their intended destination base.
- Completed Workshop items appearing in the destination base's local stores even if another base is selected when time advances.
- Workshop stock display reflecting the currently selected base's manufactured stock.
- Quartermaster/Base Stores showing compact inbound/outbound equipment logistics for the selected base.
- Quartermaster availability lines distinguishing local stock, issued gear, and in-transit gear.
- Build Health including `Workshop production preserves destination base and equipment logistics summaries`.
- `index.html` remaining the playable artifact after the source-layout scaffold.
- `src/manifest.json`, `src/engine-port-contract.md`, and `tools/check-aegis-build.cjs` staying aligned with the current build label.
- The dependency-free build seam checker passing.
- Build Health including `Modular source layout and engine-port prep contract is present`.
- Successful missions adding alien bodies/materials/equipment to the returning Skyranger base's local stores.
- KIA recovered equipment returning to the correct local base stores.
- Legacy aggregate `gearInventory` still reflecting recovered stock for compatibility.
- Wrong-base local stores remaining isolated after mission recovery.
- The Time Control funds line rendering without stray encoding characters before `Funds`.
- Load / Save Menu using a real icon path rather than fragile inline symbol text.
- Build Health including `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
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

`STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`

Suggested focus:
- Fix staged interceptor visual semantics so arrival at a friendly staging base is shown as a landing/refuel/turnaround, not as an attack impact or base explosion.
- Separate friendly ferry/refuel phase effects from hostile UFO attack/interception effects in Geoscape rendering, event text, sound cues, and action logs.
- Preserve the current staged-interceptor reach/launch behavior, but make each route phase readable: home-base takeoff, ferry leg, staging-base landing, refuel timer, final attack launch, UFO attack, return-to-staging-base, and post-attack decision.
- When the player chooses to return home after a staged interception, show the interceptor retracing the planned ferry route through valid refuel stops instead of disappearing or snapping home.
- If the UFO survives and the interceptor returns to the staging base, keep the prompt to attack again or ferry back home, but make the aircraft's current base/status/readiness match the visible route phase.
- Keep direct interceptor launches, direct Skyranger launches, staged Skyranger travel, fuel tank upgrades, assigned-base range checks, local rosters/stores, transfer logistics, and save compatibility intact.
- Add Build Health coverage for friendly staging-base arrival using non-combat effects, no base-destruction/attack text on refuel stops, post-intercept return-to-staging-base, return-home route replay through ferry legs, and no-regression direct aircraft travel/repair/refuel.

## Near-Term First Base Placement Planning Candidate
Implemented in `v0.26.07.10.0020_FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY_PATCH`; keep this section as the reference contract for future first-base story/onboarding polish:

`FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`

Suggested focus:
- Seed the first two alien incidents before first-base confirmation and show them on the same world map the player uses to choose the starting base.
- Position those first two incidents so one well-placed starting base can respond to both with the starting Skyranger.
- Show dotted starting-site preview rings for Interceptor practical reach, Skyranger practical reach, and starting Shortwave Radar coverage.
- Use the opening incidents to make first-base placement feel like the world governments' direct response to the first alien crisis.
- Keep the first-base confirmation flow stable and readable.
- Add Build Health coverage for visible opening incidents, reachable first crises, preview ring values, inactive-state hiding, and no-regression first-base confirmation.

## Near-Term Aircraft Ferry / Refuel Staging Candidate
Planned as a future Air War and multi-base logistics patch:

`AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY`

Suggested focus:
- Allow Skyrangers and interceptors to ferry to another owned base as an intermediate staging/refuel stop when the destination base has an available compatible hangar.
- Treat base-to-base ferry legs as one-way legs that only need enough fuel/range to reach the next friendly base, because the aircraft will refuel there before continuing.
- Do not require a craft to have enough fuel for a full home-base round trip when it is transiting between owned bases; this effectively lets staged aircraft extend their operational reach by chaining valid base-to-base legs.
- Once an aircraft leaves the last friendly staging base for a mission site or UFO interception, require enough practical fuel/range to complete the outbound leg and return to that last staging base.
- After the sortie, aircraft should either remain at the last staging base until ordered home or retrace the planned staging route home through valid refuel stops, with each return leg advancing on Geoscape clock time.
- Friendly staging-base arrival must never reuse hostile attack/explosion presentation. It should show landing, hangar reservation/occupancy, refuel/turnaround progress, and clear action text so players understand the base is helping the aircraft rather than being attacked.
- Return-home after a staged interception should visibly replay the reverse ferry path from the staging base to the original home base, including travel time and refuel stops where needed, instead of teleporting or silently resetting the aircraft.
- Track hangar occupancy/reservations so a forward base cannot accept more staged aircraft than it can physically house.
- Keep ferry, refuel, turnaround, mission launch, interception, return, and optional return-home legs tied to Geoscape clock time.
- Let a Skyranger from a farther base carry its own stationed squad to a forward base, refuel, and then launch alongside a local Skyranger for the same incident when both routes and hangars are valid.
- Preserve squad stationing clarity: soldiers remain associated with the Skyranger/base they boarded from unless a later transfer or cross-base task-force system explicitly changes that.
- Let interceptors stage through forward bases to attack UFOs that are outside their direct home-base range, with the same fuel, damage, repair, and after-action rules used by normal interceptions.
- Surface route-leg planning clearly in Geoscape and aircraft readiness UI: home base, staging base, one-way ferry reach, final sortie round-trip reach from the last staging base, hangar blocker, refuel ETA, launch window, return-home/stay-staged choice, and combined response readiness.
- Preserve existing direct-launch behavior, fuel tank upgrades, assigned-base range checks, base-local rosters/stores, Skyranger stationing, interceptor selection, transfer logistics, and old-save compatibility.
- Add Build Health coverage for ferry-to-base creation, one-way base-to-base range validation, final sortie round-trip validation from the last staging base, hangar availability/reservation blockers, refuel timing at staging base, staged Skyranger incident launch, staged interceptor launch, in-range-after-staging validation, route-home/refuel-stop handling, return-home/stay-staged handling, old-save normalization, and no-regression direct aircraft travel/repair/refuel.

## Near-Term Staged Sortie Route UI / Return-Home Fix
Future bugfix and polish patch:

`STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`

Observed issue:
- During a staged interceptor sortie, the craft can appear to attack or blow up the friendly destination/staging base when it reaches that base for refueling, then continue on to the UFO after refuel completes.
- After the interception, the interceptor may not visibly return along the ferry route back to its original home base.

Suggested focus:
- Give route phases explicit presentation modes such as `friendly-ferry`, `friendly-landing`, `refuel`, `hostile-intercept`, `return-to-staging`, and `return-home-ferry`.
- Ensure friendly base arrival cannot trigger attack, explosion, combat, UFO impact, or base-damage visual/audio/text effects.
- Show a clear landing/refuel state at the staging base before the final attack leg begins.
- If the UFO survives, return the interceptor to the last staging base and ask whether to attack again or ferry home.
- If the player chooses ferry home, visibly fly the reverse route through each ferry/refuel leg back to the original base, preserving clock-based travel time and aircraft status.
- Keep aircraft `baseId`, `hangarKey`, status, fuel, repair, and current-route state aligned with what the player sees on the Geoscape.
- Add Build Health coverage for no friendly-base attack visuals, staging-base refuel presentation, post-attack return-to-staging, player choice to attack again, player choice to ferry home, reverse-route travel display, and no-regression direct interceptor/Skyranger sorties.

## Near-Term Base-Local Equipment Logistics Polish
Implemented in `v0.26.07.10.0005_BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY_PATCH`; keep this section as the reference contract for future logistics polish:

`BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`

Suggested focus:
- Give workshop orders an explicit production/base destination instead of implicitly using the selected base at day-end.
- Surface equipment transfers in a compact Logistics/Transfers summary so players can review inbound and outbound payloads without opening each item card.
- Add a confirmation screen before starting any equipment transfer. The confirmation should name the origin base, destination base, item, quantity, logistics fee, travel time/ETA, and the fact that the gear will be unavailable while in transit.
- Tighten mission loadout messaging so local base stock, issued gear, and in-transit gear are easy to distinguish before launch.
- Consider transfer costs and transfer cancellation rules after the core flow is playtested.
- Preserve global access for Mainframe/research database/alien intel/reports/memorial records.
- Add Build Health coverage for workshop destination stock, transfer UI summaries, local loadout messaging, old-save normalization, and no-regression soldier transfers / Skyranger stationing.

## Near-Term Modular Source Layout and Engine-Port Prep
Implemented in `v0.26.07.09.0045_MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future source extraction:

`MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY`

Suggested focus:
- Introduce a build-friendly source layout while preserving `index.html` as the playable distribution artifact.
- Split future work into clear source areas such as data definitions, simulation systems, UI panels, Build Health tests, and asset manifests.
- Keep the current single-file game runnable during the transition by generating or manually syncing the production `index.html` from the organized source.
- Create a lightweight contract for future Godot 4 migration: data-driven game state, deterministic simulation helpers, explicit UI adapters, and JSON-friendly campaign/save structures.
- Move no risky gameplay systems during the first pass; start with extracted constants/helpers/tests or a documented build harness if that is the safest step.
- Preserve save compatibility, current browser deployment, and localhost Build Health behavior.
- Add Build Health/static checks that prove the generated/playable `index.html` contains the expected build label and key systems after any source organization step.

## Near-Term Mission Recovery Local Stores Fix
Implemented in `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future mission-recovery expansion:

`MISSION_RECOVERY_TO_LOCAL_BASE_STORES_INDEX_ONLY`

Suggested focus:
- Route successful mission recovery loot into the Skyranger's return-base local `baseInventories`, not only the legacy aggregate `gearInventory`.
- Preserve old-save compatibility by keeping aggregate `gearInventory` synchronized or derivable from local base stores where older systems still read it.
- Recovered alien remains, alien weapon fragments, alien power cells, live aliens, and KIA soldier equipment should appear in the local stores of the base that actually received the returning Skyranger.
- Mission reports should continue to list recovered materials, but the Quartermaster/Base Stores screen should also visibly reflect the recovered stock at the correct base.
- Keep crash-site recovery, landed/terror incident recovery, alien containment handling, known alien unlocks, and research/autopsy prerequisites intact.
- Add Build Health coverage for successful mission alien-body recovery, alien equipment/material recovery, local return-base stock updates, legacy `gearInventory` compatibility, KIA equipment recovery to the return base, wrong-base stock isolation, and no-regression base-local equipment transfers.

## Near-Term UI Text Encoding and Icon Cleanup Candidate
Implemented in `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH`; keep this section as the reference contract for future text/icon sanitation passes:

`UI_TEXT_ENCODING_AND_ICON_SANITATION_INDEX_ONLY`

Suggested focus:
- Sweep the single-file build for mojibake / garbled encoding artifacts such as U+00C2, U+00E2, U+00C3, replacement characters, or broken currency/icon text.
- Clean up visible odd characters like the stray encoded currency marker before `Funds`; replace with the intended icon component where appropriate, or use plain readable text if an icon is not useful.
- Prefer existing `Icon` / `ICONS` usage for former inline-symbol UI markers so future encoding passes are less fragile.
- Check high-visibility UI surfaces first: Time Control header, Geoscape panels, mission reports, Quartermaster/Base Stores, build/transfer summaries, aircraft readiness, and modal confirmations.
- Preserve intentional ASCII abbreviations, version strings, save keys, and player-facing content that is already rendering correctly.
- Add Build Health coverage or static seam checks for disallowed mojibake markers in rendered/static UI text, plus a targeted check that the Time Control funds label renders cleanly.

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
- Future extension: mirror this range-preview behavior on the beginning first-base selection screen via `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`.
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
- Starting a soldier or equipment transfer should require a confirmation modal before the payload leaves the base. The modal should clearly summarize who/what is moving, origin, destination, ETA, fee, refund/cancellation rules, and operational consequences such as soldiers being unavailable for squads or gear being unavailable for loadouts.
- Soldiers in transit should be unavailable for squads/missions until they arrive.
- Equipment in transit should be unavailable at both origin and destination until arrival.
- Preserve save compatibility by normalizing older soldiers/equipment into the selected/first base if no base-local state exists.
- Add Build Health coverage for selected-base roster filtering, wrong-base squad assignment blocking, transfer confirmation, transfer creation, in-transit unavailability, arrival at destination, equipment stock movement, old-save normalization, and no-regression Skyranger stationing behavior.

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

## 2026-07-10 Patch Notes - First Base Selection Range Preview

Build `v0.26.07.10.0020_FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY_PATCH` makes first-base placement part of the campaign opening instead of a blind map choice:

- The first-base selection screen now shows two opening alien incidents before the player confirms the starting base.
- The opening incidents are deterministic and carry into the actual campaign Geoscape: `Prairie Abduction` and `Red River Signal`.
- The beginning globe now shows the opening incident markers alongside the proposed starting-base crosshair.
- Dotted first-base preview rings show starting Shortwave Radar coverage, starting Interceptor practical reach, and starting Skyranger practical reach from the proposed site.
- The setup side panel now reports whether both opening crises are inside the current proposed site's starting Skyranger radius.
- Build Health now includes `First-base selection previews opening incidents and starting reach`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, first-base setup verification, first base confirmation -> main Geoscape, clean browser console, and Build Health 214/214.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0020`.
- Start a new campaign and confirm the first-base setup screen shows `Prairie Abduction` and `Red River Signal`.
- Confirm the setup screen shows dotted starting reach rings and a `2/2` opening-crisis Skyranger coverage summary for the default North America site.
- Confirm first base placement carries those same two incidents into the main Geoscape.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Confirm Build Health passes 214/214 and includes the new first-base selection row.
- Confirm browser console errors are clear.

Roadmap follow-up was `BASE_LOCAL_LOADOUT_AND_MISSION_CONFIRMATION_HARDENING_INDEX_ONLY`, completed in `v0.26.07.10.0080`.

## 2026-07-10 Patch Notes - Base Placement Ferry Link Preview

Build `v0.26.07.10.0095_BASE_PLACEMENT_FERRY_LINK_PREVIEW_INDEX_ONLY_PATCH` extends new-base placement with ferry-network visibility:

- While Build New Base placement mode is active, the Geoscape draws dotted links from the proposed site to existing bases when at least one currently accessible aircraft type can fly the one-way ferry leg.
- The New Base Site summary now includes ferry-link text naming the connected base, approximate one-way distance, and whether Interceptors, Skyrangers, or both can make the trip.
- Ferry-link calculations use the player's current aircraft types and fuel-tank upgrade range profiles.
- Existing base-placement aircraft reach rings remain unchanged.
- Build Health now includes `New-base placement previews dotted aircraft ferry links`.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the new playable build label and seam.

Verification checklist:
- Run `node tools\check-aegis-build.cjs`.
- Run inline script syntax checks.
- Load `http://127.0.0.1:5173/index.html`, start/load a campaign, click Build New Base, and confirm dotted ferry-link lines/text appear when the proposed site is within one-way ferry range of existing bases.
- Move the proposed site and confirm ferry links update with the site.
- Run Build Health and confirm all checks pass, including `New-base placement previews dotted aircraft ferry links`.
- Confirm browser console errors are clear.

Roadmap follow-up remains `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_EXECUTION_INDEX_ONLY`, starting with one staged-leg execution path and hangar reservation/refuel timing.

## 2026-07-10 Patch Notes - Aircraft Ferry Refuel and Multi-Base Sortie Staging

Build `v0.26.07.10.0090_AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY_PATCH` seeds the aircraft ferry/refuel staging system without yet changing live launch/return state:

- Added pure helper seams for owned-base staging plans, open-hangar checks, one-way base-to-base ferry validation, and refueled final-leg round-trip validation.
- Ferry legs use one-way range/fuel checks because the aircraft is expected to land and refuel at the staging base.
- Final mission/interception legs still require enough refueled range/fuel to fly from the last staging base to the target and return to that same staging base.
- Staging candidates require an open hangar at the intermediate base before they can be considered ready.
- UFO Tracking now includes a compact Ferry / Refuel Staging card for selected incidents and detected UFOs.
- Build Health now includes `Aircraft ferry staging checks open hangars and refuel legs`.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track the new playable build label and seam.

Verification checklist:
- Run `node tools\check-aegis-build.cjs`.
- Run static app-script parse.
- Load `http://127.0.0.1:5173/index.html`, confirm the start screen shows the new build label, start a campaign, and confirm the Geoscape loads.
- Confirm UFO Tracking shows the Ferry / Refuel Staging card.
- Run Build Health and confirm all checks pass, including `Aircraft ferry staging checks open hangars and refuel legs`.
- Confirm browser console errors are clear.

Roadmap follow-up is `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_EXECUTION_INDEX_ONLY`, starting with one staged-leg execution path and hangar reservation/refuel timing.

## 2026-07-10 Patch Notes - Base-Local Loadout and Mission Confirmation Hardening

Build `v0.26.07.10.0080_BASE_LOCAL_LOADOUT_AND_MISSION_CONFIRMATION_HARDENING_INDEX_ONLY_PATCH` tightens the last step before squad deployment so commanders can see the local-base consequences before committing a Skyranger:

- Mission launch confirmation now previews the selected Skyranger, launch base, round-trip distance, and fuel commitment when a valid sortie can be selected.
- If launch is blocked, the confirmation preview surfaces the same Skyranger stationing/range/fuel blocker text used by the launch path.
- The confirmation modal now lists the response-force soldiers with weapon and armor state, plus a local loadout check for unarmed soldiers, under-armored soldiers, loose launch-base stock, issued gear, and in-transit gear.
- Barracks now shows a selected-base empty state when no local weapons or armor are available for rearming instead of silently rendering no equip buttons.
- Added pure helper seams for selected-base loadout summaries and mission-launch loadout summaries.
- Build Health now includes `Mission confirmation explains local loadout and launch base`.
- Verified through Node app-script parse, `node tools/check-aegis-build.cjs`, localhost start screen smoke, first-base confirmation to main Geoscape, and browser Build Health 219/219.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0080`.
- Start a new campaign and confirm first-base setup and main Geoscape still load without runtime errors.
- Open Build Health and confirm 219/219 checks pass with `Mission confirmation explains local loadout and launch base`.
- Open Barracks at a base with no local weapons/armor and confirm the empty rearm text is shown.
- Open a mission launch confirmation and confirm the launch base, Skyranger, fuel/distance, response-force loadout, and local stock/in-transit summary are visible.

Roadmap follow-up is `AIRCRAFT_FERRY_REFUEL_AND_MULTI_BASE_SORTIE_STAGING_INDEX_ONLY`, starting with a contained route-leg and hangar-eligibility seed.

## 2026-07-10 Patch Notes - Base-Local Loadout Stock Enforcement and Transfer Polish

Build `v0.26.07.10.0065_BASE_LOCAL_LOADOUT_STOCK_ENFORCEMENT_AND_TRANSFER_POLISH_INDEX_ONLY_PATCH` tightens the Barracks equipment UI so it matches the local-base stock rules already enforced by the equip action:

- Barracks equip buttons now list only weapons and armor physically stocked at the currently selected base.
- Equip button labels now show the selected base as the stock source instead of showing aggregate/global inventory counts.
- Equip button tooltips use `localLoadoutAvailabilityMessage` to show selected-base local stock plus issued and in-transit counts.
- Added helper seams for issued-equipment counting and in-transit equipment counting.
- Corrected the Build Health fixture to use shipped catalog item names such as `Laser Carbine`.
- Build Health now includes `Base-local loadout buttons only advertise selected-base stock`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, and browser Build Health 218/218.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0065`.
- Confirm Barracks equip buttons only show selected-base local weapons/armor.
- Confirm switching selected bases changes the available equip buttons to that base's local stores.
- Confirm equip button labels name the selected base stock source.
- Confirm equip button tooltips describe local stock, issued gear, and in-transit gear.
- Confirm transfer fees, Logistics Center rows, and bulk equipment transfer buttons still behave as in `v0.26.07.10.0060`.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 218/218 with the new local-loadout row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base Transfer Logistics Center and Bulk Payloads

Build `v0.26.07.10.0060_BASE_TRANSFER_LOGISTICS_CENTER_AND_BULK_PAYLOADS_INDEX_ONLY_PATCH` makes transfer logistics easier to inspect and reduces click friction for moving equipment:

- Added a compact selected-base Logistics Center that merges personnel and equipment transfers into one inbound/outbound manifest.
- Logistics Center rows show transfer direction, payload, origin, destination, ETA, fee-paid state, no-refund status, and cancel action.
- Quartermaster equipment transfer controls now offer bulk payload choices of `1`, `5`, and `All` where selected-base stock allows.
- Bulk transfer costs scale through the existing distance/handling cost rules.
- Added pure helper seams for equipment transfer quantity choices and selected-base transfer manifests.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track this build label and required Logistics Center Build Health row.
- Build Health now includes `Base transfer Logistics Center lists payloads and supports bulk equipment quantities`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, and browser Build Health 217/217.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0060`.
- Start or load a campaign with at least two bases and create a soldier or equipment transfer.
- Confirm the selected base shows a Logistics Center with inbound/outbound transfer manifest rows.
- Confirm manifest rows show payload, origin, destination, ETA, fee-paid/no-refund text, and cancel actions.
- Confirm Quartermaster equipment cards show `Send 1`, `Send 5`, and `Send All` options when local stock allows.
- Confirm bulk transfers deduct the correct local quantity and charge a scaled logistics fee.
- Confirm transfer cancellation still returns soldiers/equipment to origin with no refund.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 217/217 with the new Logistics Center row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base Transfer Costs, Cancellation, and Logistics Rules

Build `v0.26.07.10.0055_BASE_TRANSFER_COSTS_CANCELLATION_AND_LOGISTICS_RULES_INDEX_ONLY_PATCH` makes base-to-base logistics more legible and less free-form:

- Soldier transfers now charge distance-based logistics fees and block if funds are insufficient.
- Equipment transfers now charge distance/handling-based logistics fees and block if funds are insufficient.
- In-transit soldier transfers can be cancelled from the Personnel Transfers panel; cancellation returns the soldier to the origin base and does not refund the fee.
- In-transit equipment transfers can be cancelled from Quartermaster item logistics rows; cancellation returns the item payload to the origin base and does not refund the fee.
- Transfer summaries now include fee-paid/no-refund messaging so the player can understand cancellation consequences before using the action.
- The detailed solid Geoscape globe Build Health helper was tightened so the early self-test path recognizes the preserved 30-landmass / 356-vertex detailed geometry set.
- `src/manifest.json` and `tools/check-aegis-build.cjs` now track this build label and required transfer-cost Build Health row.
- Build Health now includes `Base transfer logistics charge fees and cancel back to origin`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, clean browser console, opaque/borderless globe DOM check, and browser Build Health 216/216.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0055`.
- Start a campaign with more than one base and confirm Barracks soldier transfer buttons show ETA and fee.
- Confirm low funds block soldier and equipment transfers with a clear required/available funds message.
- Confirm active soldier transfers appear in Personnel Transfers with a cancel action and return the soldier to the origin base without refund.
- Confirm Quartermaster equipment transfer buttons show fee and active equipment transfers can be cancelled back to origin.
- Confirm in-transit soldiers/equipment remain unavailable until arrival or cancellation.
- Confirm Geoscape landmasses remain detailed, opaque, borderless, and draggable.
- Run `node tools/check-aegis-build.cjs`.
- Run the Node app-script parse check.
- Run browser Build Health and confirm 216/216 with the new transfer-cost row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Opaque Borderless Geoscape Landmasses

Build `v0.26.07.10.0050_OPAQUE_BORDERLESS_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` makes the detailed solid Geoscape landmasses fully opaque:

- Landmass fill opacity is now `1`, so the ocean layer no longer shows through the continents.
- The borderless landmass stroke behavior from `v0.26.07.10.0045` is preserved.
- Build Health now checks the opaque detailed landmass contract.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0050`.
- Confirm Geoscape landmasses are solid/opaque and still borderless.
- Confirm globe dragging still works and Build Health passes the opaque detailed-landmass row.

## 2026-07-10 Patch Notes - Borderless Solid Geoscape Landmasses

Build `v0.26.07.10.0045_BORDERLESS_SOLID_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` removes the thin white outline from the detailed solid Geoscape landmasses:

- Detailed landmass paths now render with transparent stroke and zero stroke width.
- The globe keeps the restored `GEOSCAPE_THREE_LANDMASSES` shapes and solid ocean/land styling.
- Region gameplay boundaries remain separate and subtle, so selection logic is preserved without outlining every landmass.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0045`.
- Confirm Geoscape landmasses no longer show a thin white border.
- Confirm globe dragging still works and Build Health passes the detailed solid-landmass row.

## 2026-07-10 Patch Notes - Detailed Solid Geoscape Landmasses

Build `v0.26.07.10.0040_DETAILED_SOLID_GEOSCAPE_LANDMASSES_INDEX_ONLY_PATCH` keeps the solid Geoscape globe styling but restores the more detailed landmass shapes from the earlier hologram/Three.js globe:

- Visible continents and islands now render from `GEOSCAPE_THREE_LANDMASSES`, preserving the 30-landmass / 356-vertex geography set.
- Coarse `EARTH_BASE_REGIONS` polygons are no longer filled as visible land; they remain as transparent/subtle selection boundaries for region gameplay.
- The solid globe visual contract now records `landmassSource: "GEOSCAPE_THREE_LANDMASSES"`.
- Build Health now includes `Solid Geoscape globe uses detailed landmasses and remains draggable`.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0040`.
- Start a new campaign, confirm the first base, and verify the Geoscape globe landmasses look like the previous detailed globe shapes while staying solid.
- Drag the globe and confirm rotation still works.
- Run Build Health and confirm the detailed solid-landmass row passes.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Solid Geoscape Globe and Drag Recovery

Build `v0.26.07.10.0035_SOLID_GEOSCAPE_GLOBE_AND_DRAG_RECOVERY_INDEX_ONLY_PATCH` fixes the playtest issue where the Geoscape globe could stop accepting drag input partway through a campaign and updates the globe presentation to read as a solid Earth-style strategic map:

- Globe drag, wheel zoom, click selection, and incident focus now route through a dedicated interaction policy instead of returning early whenever aircraft travel state exists.
- Stale or active Skyranger/interceptor travel state should no longer permanently prevent the player from rotating the world map.
- The visible globe surface now uses a solid ocean fill, visible land fill/strokes, capped day/night shading, restrained cloud opacity, and less hologram-like glow.
- The older Build Health wording was updated so the map contract now describes solid land/ocean geography layers instead of claiming SVG geography is hidden.
- A stale memorial Build Health catalog threshold was aligned to the current shipped 150-item memorial offering catalog while preserving the 281-message template requirement.
- Build Health now includes `Solid Geoscape globe remains draggable during travel states`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first-base setup, first base confirmation -> main Geoscape, actual pointer-drag projection-change check, solid globe DOM checks, clean browser console, and Build Health 215/215.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0035`.
- Start a new campaign, confirm the first base, and drag the Geoscape globe before and after aircraft travel occurs.
- Confirm the globe appears solid with readable oceans and landmasses rather than transparent/holographic.
- Run Build Health and confirm 215/215 with the new solid-globe row.
- Confirm browser console errors are clear.

## 2026-07-10 Patch Notes - Base-Local Equipment Logistics Polish and Workshop Origin

Build `v0.26.07.10.0005_BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY_PATCH` tightens the base-local equipment loop without changing save format:

- Workshop orders now record the production/destination base at queue time.
- Completed Workshop items route into that destination base's local stores, rather than whichever base is selected when time advances.
- Workshop inventory display now shows manufactured stock for the currently selected base.
- Quartermaster/Base Stores now shows compact inbound/outbound equipment logistics for the selected base.
- Quartermaster item cards now include a compact availability line for local stock, issued gear, and in-transit gear.
- `src/manifest.json` now tracks the current build label and `tools/check-aegis-build.cjs` verifies the new Workshop/logistics Build Health row.
- Build Health now includes `Workshop production preserves destination base and equipment logistics summaries`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 213/213.

Verification checklist:
- Confirm the start screen shows `v0.26.07.10.0005`.
- Run `node tools/check-aegis-build.cjs` and confirm the source manifest matches the playable artifact.
- Run the Node app-script parse check.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Confirm Build Health passes 213/213 and includes the new Workshop/logistics row.
- Confirm browser console errors are clear.
- In practical play, queue Workshop production from one base, switch bases while time advances, and confirm completed stock appears at the original production destination.

Roadmap follow-up is `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`, then deeper transfer rules such as costs/cancellation if needed.

## 2026-07-09 Patch Notes - Modular Source Layout and Engine Port Prep

Build `v0.26.07.09.0045_MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY_PATCH` begins the project-organization pass without disrupting the current browser build:

- `index.html` remains the playable distribution artifact and save format remains 4.
- Added `ARCHITECTURE_MODULE_PLAN` inside the playable build so Build Health can verify the source-layout contract from the runtime artifact.
- Added `src/README.md` as the extraction roadmap for data, systems, UI, tests, and asset manifest areas.
- Added `src/manifest.json` with the current build label, save format, playable artifact, required runtime seams, and engine-port targets.
- Added `src/engine-port-contract.md` to define the Godot 4 migration boundary around JSON-friendly data, deterministic simulation helpers, UI adapters, and explicit save migrations.
- Added `tools/check-aegis-build.cjs`, a dependency-free Node seam check for the current build label and required architecture/runtime markers.
- Build Health now includes `Modular source layout and engine-port prep contract is present`.
- Verified through `node tools/check-aegis-build.cjs`, Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 212/212.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0045`.
- Run `node tools/check-aegis-build.cjs` and confirm the source manifest matches the playable artifact.
- Run the Node app-script parse check.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Confirm Build Health passes 212/212 and includes the new modular-source row.
- Confirm browser console errors are clear.

Roadmap follow-up is `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`, then `FIRST_BASE_SELECTION_RANGE_PREVIEW_INDEX_ONLY`.

## 2026-07-09 Patch Notes - Mission Recovery Local Stores and UI Encoding Cleanup

Build `v0.26.07.09.0035_MISSION_RECOVERY_LOCAL_STORES_AND_UI_ENCODING_CLEANUP_INDEX_ONLY_PATCH` tightens the new base-local inventory loop and cleans up visible text/icon encoding artifacts:

- Successful mission recovery now routes alien spoils into the returning Skyranger base's local `baseInventories`.
- KIA recovered equipment now returns to the same local base inventory instead of only updating the legacy aggregate stock.
- The legacy aggregate `gearInventory` remains synchronized for compatibility with older systems and older saves.
- Mission summaries now include a compact line naming the base that received recovered stock.
- The game file was swept for common mojibake markers and broken inline-symbol UI text in high-visibility surfaces.
- The Load / Save Menu button now uses the existing icon component path instead of a fragile inline marker.
- Build Health now includes `Mission recovery stock routes to Skyranger return-base local stores` and `UI text encoding cleanup keeps funds labels readable`.
- Verified through Node static app-script parse, localhost start screen smoke, Start New Game -> first base confirmation -> main Geoscape, clean browser console, and Build Health 211/211.

Verification checklist:
- Confirm the start screen shows `v0.26.07.09.0035`.
- Start a new campaign, confirm first base placement, and open the main Geoscape.
- Complete or simulate a successful mission and confirm alien bodies/materials/equipment arrive in the Skyranger return-base stores.
- Confirm KIA recovered gear returns to the correct local base inventory.
- Confirm wrong-base local stores do not receive the recovered stock.
- Confirm the Time Control funds label renders without stray encoded characters.
- Confirm Build Health passes 211/211 and includes the two new rows.

Roadmap follow-up is `MODULAR_SOURCE_LAYOUT_AND_ENGINE_PORT_PREP_INDEX_ONLY`, then `BASE_LOCAL_EQUIPMENT_LOGISTICS_POLISH_AND_WORKSHOP_ORIGIN_INDEX_ONLY`.

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

## v0.26.07.10.0100 - Interceptor Ferry-Staged Reach Recognition Fix

Build `v0.26.07.10.0100_INTERCEPTOR_FERRY_STAGING_RECOGNITION_FIX_INDEX_ONLY_PATCH` fixes a UFO Tracking/readiness gap in the ferry/refuel staging seed:

- Interceptor readiness text now consults the ferry/refuel staging planner after direct home-base range checks fail.
- UFOs reachable by ferrying to another base, refueling, then flying the final round trip are labeled as staged-route targets instead of being reported as simply out of range.
- Launch blockers now explain that a staged route was found but direct launch execution cannot yet fly the staged sortie.
- Build Health includes `Interceptor UFO tracking recognizes ferry-staged reach`.

Verification checklist:
- Confirm a UFO beyond direct interceptor round-trip range can show `staged route available` when a valid staging base has an open hangar.
- Confirm direct interceptor launches still behave as before.
- Confirm Build Health passes, including the new staged-reach row.

Next recommended patch: `LIVE_AIRCRAFT_FERRY_STAGED_SORTIE_EXECUTION_INDEX_ONLY`, implementing actual multi-leg staged launch/return state now that recognition is correct.

## v0.26.07.11.0005 - Staged Aircraft Route Display and Skyranger Ferry Fix

Build `v0.26.07.11.0005_STAGED_AIRCRAFT_ROUTE_DISPLAY_AND_SKYRANGER_FERRY_FIX_INDEX_ONLY_PATCH` syncs the recent staged-interceptor work and fixes the visible ferry-route issue:

- Records the ChatGPT-applied staged-interceptor execution work in the bible: staged interceptor launches can carry route phases, recover to the staging base, and ask whether to attack again or ferry home if the UFO survives.
- Adds phase-aware Skyranger travel display so transports do not appear to launch from the closest/staging base when they actually originate elsewhere.
- Allows Skyranger mission launch to use the existing ferry/refuel planner when a same-base squad and transport can reach a forward base with an open hangar, refuel, then continue to the incident.
- Staged Skyranger mission state preserves the original base, forward launch base, return hangar, route description, ferry/refuel timing, and final return base.
- Build Health includes `Staged aircraft routes display origin ferry legs`.

Verification checklist:
- Confirm an interceptor staged sortie visibly starts at its origin base and follows ferry/refuel/attack phases.
- Confirm a staged Skyranger visibly departs its home base before the final incident leg.
- Confirm direct interceptor and direct Skyranger launches still behave normally.
- Confirm Build Health passes, including `Staged aircraft routes display origin ferry legs`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY`, making multi-craft staged backup choices clearer in the launch confirmation UI and adding stronger route-line visualization for every ferry leg.

## v0.26.07.11.0015 - Skyranger Ferry-Staged Incident Response Fix

Build `v0.26.07.11.0015_SKYRANGER_FERRY_STAGED_INCIDENT_RESPONSE_FIX_INDEX_ONLY_PATCH` hardens Skyranger use of the ferry/refuel staging system so incident response behaves more like the updated interceptor staging flow:

- Skyranger mission confirmation now displays the full staged ferry/refuel plan when direct home-base round-trip range is not enough.
- Staged Skyranger confirmation text names the boarding/origin base, staging base, ferry distance, refuel stop, final incident round trip, and route fuel budget.
- Local loadout checks in the mission confirmation now use the boarding/origin base where the soldiers and Skyranger actually start, not the forward staging base.
- Build Health includes `Skyranger ferry staging extends incident response range`, covering a mission outside direct Skyranger range but reachable through an owned base with an open compatible hangar.
- The existing phase-aware staged Skyranger travel display and direct Skyranger launch behavior are preserved.

Verification checklist:
- Confirm a Skyranger/squad whose incident is outside direct round-trip range can use a valid open-hangar staging base when the ferry leg and final staging-base round trip are both valid.
- Confirm the launch confirmation explains the ferry/refuel route instead of only showing the final staging-base leg.
- Confirm the loadout warning/stock text references the soldiers' boarding base.
- Confirm closing the staging-base hangar blocks the staged route.
- Confirm Build Health passes, including `Skyranger ferry staging extends incident response range`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`, fixing friendly staging-base landing/refuel presentation and visible return-home ferry-route replay after staged interceptor attacks.

## v0.26.07.11.0020 - Base Placement Ferry Lanes and Skyranger Staging Fix

Build `v0.26.07.11.0020_BASE_PLACEMENT_FERRY_LANES_AND_SKYRANGER_STAGING_FIX_INDEX_ONLY_PATCH` adds the requested new-base siting readability pass on top of the Skyranger ferry-staged incident response work:

- New-base placement ferry previews now split Interceptor and Skyranger connection lines into separated side-by-side dotted lanes instead of collapsing both aircraft types into one line.
- Interceptor ferry lanes use the existing yellow aircraft-range language; Skyranger ferry lanes use the existing blue transport-range language.
- A proposed site that can connect to an existing base by both aircraft types now shows both lanes at once, making it easier to tell whether the new base can join the ferry network for combat craft, transports, or both.
- Existing range rings, base-placement confirmation, ferry reach math, and Skyranger staged incident response behavior are preserved.
- Build Health includes `New-base placement previews separated Interceptor and Skyranger ferry lanes`.

Verification checklist:
- Click Build New Base and confirm existing-base ferry links render as adjacent colored dotted lanes when both Interceptors and Skyrangers can make the one-way ferry leg.
- Confirm one-type ferry links still render as a single dotted lane in that craft type's color.
- Confirm the text summary still names connected bases, one-way distance, and eligible aircraft types.
- Confirm Build Health passes, including `New-base placement previews separated Interceptor and Skyranger ferry lanes` and `Skyranger ferry staging extends incident response range`.

Next recommended patch: `STAGED_SORTIE_ROUTE_UI_AND_RETURN_HOME_FIX_INDEX_ONLY`, fixing friendly staging-base landing/refuel presentation and visible return-home ferry-route replay after staged interceptor attacks.

## v0.26.07.11.0025 - Staged Route Labels and Day/Night Globe Readability

Build `v0.26.07.11.0025_STAGED_ROUTE_LABELS_AND_DAY_NIGHT_GLOBE_READABILITY_INDEX_ONLY_PATCH` continues the staged-sortie UI roadmap and improves Geoscape globe readability:

- Staged aircraft markers now display a compact current route phase label directly on the Geoscape globe, covering ferry, refuel, attack, mission, and return phases.
- The Geoscape globe header now includes a Solar readout that names Daylight, Night Side, Dawn Line, or Dusk Line and summarizes the current day/night mix.
- The SVG terminator overlay uses stronger shade placement, a clearer twilight ring, and a brighter sun glow so the day/night cycle is easier to parse at a glance.
- Three.js globe lighting now syncs sunlight, ambient light, and back-light intensity to the same day/night helper.
- Staged route phase labels use readable title-cased ferry text so the Geoscape label and Build Health route-label checks agree.
- Existing opaque detailed landmasses, globe dragging, base-placement ferry lanes, Skyranger staged incident response, and interceptor staged route behavior are preserved.
- Build Health includes `Staged aircraft route labels and day-night globe lighting are readable`.

Verification checklist:
- Open the Geoscape and confirm the globe header shows a Solar day/night readout.
- Advance time through morning/evening and confirm the terminator and sun glow visibly shift.
- Launch or simulate a staged route and confirm the current ferry/refuel/attack/return phase label appears near the aircraft marker.
- Confirm Build Health passes, including `Staged aircraft route labels and day-night globe lighting are readable`.

Next recommended patch: `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`, focusing on the staged interceptor landing/refuel presentation at friendly bases and replaying the return-home ferry route after attacks.

## v0.26.07.11.0030 - Sun Glow Overlay Softening

Build `v0.26.07.11.0030_SUN_GLOW_OVERLAY_SOFTENING_INDEX_ONLY_PATCH` is a small visual correction after the day/night readability pass:

- The Geoscape sun-glow cue was softened so it no longer reads as a literal yellow ball overlaid on the Earth.
- Both `geoscapeTerminatorOverlay` helper definitions now return the same explicit `sunGlowOpacity` and twilight data, preventing the SVG glow circle from falling back to full opacity.
- The glow is broader and opacity-capped, preserving the readable day/night lighting direction while keeping attention on the globe surface.
- Existing Solar readout, terminator shade, twilight ring, staged route labels, globe dragging, opaque landmasses, and aircraft ferry/staging behavior are preserved.

Verification checklist:
- Confirm the Geoscape globe still shows a readable day/night terminator and Solar readout.
- Confirm the former yellow sun-ball cue is no longer visually dominant on the globe.
- Confirm Build Health passes after the visual-only correction.

Next recommended patch remains `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`.


## v0.26.07.11.1650 - Transfer Time Sync Fix

Build `v0.26.07.11.1650_TRANSFER_TIME_SYNC_FIX_INDEX_ONLY_PATCH` was applied outside this Codex pass and then inspected here before further roadmap work:

- The playable `index.html` build label advanced from the sun-glow patch to the transfer time sync fix.
- App-script syntax parsing passed during inspection.
- The bible and manifest were found stale at `v0.26.07.11.0030_SUN_GLOW_OVERLAY_SOFTENING_INDEX_ONLY_PATCH` and required sync before the next patch.
- Existing staged interceptor and Skyranger ferry-route helpers, return-route planning, and clock-based route progress were present in the inspected build.

Verification checklist:
- Confirm manifest and bible match the playable build before future patches.
- Confirm Build Health after the metadata sync and any follow-up code changes.

Next recommended patch remained `STAGED_SORTIE_RETURN_HOME_AND_FRIENDLY_BASE_LANDING_FIX_INDEX_ONLY`.


## v0.26.07.11.1715 - Staged Sortie Friendly-Base Visual and Return Hardening

Build `v0.26.07.11.1715_STAGED_SORTIE_FRIENDLY_BASE_VISUAL_AND_RETURN_HARDENING_INDEX_ONLY_PATCH` tightens the staged ferry/interceptor presentation without changing the save format:

- Added a phase-aware interceptor combat-visual guard so weapon fire and hit explosions only render during `attack-outbound` phases.
- Friendly ferry, staging-base refuel, return-to-stage, and ferry-home phases remain visible as route labels/movement but no longer look like the interceptor is attacking a friendly base.
- The hit explosion timing now keys off the route plan's `impactProgress` instead of the old fixed `94-128` global-progress window, which could overlap friendly refuel phases on staged sorties.
- Added Build Health coverage for staged friendly-base phases staying non-combat while the actual attack leg remains combat-enabled.
- Tightened ferry staging so the final staging/destination base must have a real open hangar; transient route handling is no longer allowed to stand in for an occupied destination hangar.
- Fixed fast-forward recovered-soldier auto-equip so completed Workshop gear is seeded into the temporary equipment pool before recovered soldiers try to equip it.
- Synced `src/manifest.json` and the seam checker to the new build label.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Browser smoke from `http://127.0.0.1:5173/index.html` passed: start screen, first-base setup, first-base confirmation, and main Geoscape loaded.
- Browser Build Health passed `226/226`.
- Browser console errors: none from the game page.
- In play, staged interceptor ferry/refuel phases should show ferry/refuel labels, not weapon fire or explosion effects; confirmed hits should still show impact at the UFO and route home when applicable.

Next recommended patch: `STAGED_SORTIE_RETURN_DECISION_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY`, focusing on clearer post-attack choices for staged interceptors that miss or disengage and stronger multi-craft staged sortie confirmation text.


## v0.26.07.11.1730 - Staged Sortie Return Decision and Multi-Craft Backup Polish

Build `v0.26.07.11.1730_STAGED_SORTIE_RETURN_DECISION_AND_MULTI_CRAFT_BACKUP_POLISH_INDEX_ONLY_PATCH` continues the staged aircraft ferry roadmap while preserving save format 4:

- Added a compact sortie-selection summary helper so staged interceptor launches can name direct vs staged craft, the staging base, and the ferry route used.
- Polished the staged interceptor post-attack ferry decision modal with route, home-base, staging-base, and formation details.
- The Attack UFO Again action now checks whether enough eligible ready aircraft can reengage before it is enabled or executed.
- Multi-craft staged interceptor selection now reserves distinct open hangars at the staging base, preventing a pair of aircraft from sharing one empty hangar slot.
- Added Build Health coverage for clear staged return decisions and multi-craft staged backup hangar reservation.

Verification checklist:
- Run `node tools\\check-aegis-build.cjs`.
- Run a static app-script parse.
- Run browser smoke and Build Health from `http://127.0.0.1:5173/index.html` when localhost is available.
- In play, test a staged interceptor miss/disengage and confirm the decision modal clearly offers attack again only when valid, or ferry home to the original base.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_MANUAL_TEST_POLISH_INDEX_ONLY`, focusing on small visible route timeline improvements for staged ferry/attack/return phases and any manual-test findings from staged sortie play.

## v0.26.07.11.1740 - Staged Sortie Backup Hangar Reservation Fix

- Fixed a staged-interceptor formation fallback where backup selection could still treat one open staging hangar as enough for multiple aircraft after grouped selection failed.
- Backup interceptor formation selection now reserves distinct staging hangars in the fallback path too, keeping ferry staging capacity honest.
- Browser Build Health exposed the issue at 226/227; this fix restored the staged sortie return decision and multi-craft backup row.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.11.1740_STAGED_SORTIE_BACKUP_HANGAR_RESERVATION_FIX_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke confirmed start screen, first base confirmation, and Geoscape load.
- Browser Build Health passed `227/227`.
- Browser console errors: none from the game page.

Next recommended patch: STAGED_SORTIE_ROUTE_TIMELINE_AND_MANUAL_TEST_POLISH_INDEX_ONLY.

## v0.26.07.11.1755 - Staged Sortie Route Timeline Readout

Build `v0.26.07.11.1755_STAGED_SORTIE_ROUTE_TIMELINE_READOUT_INDEX_ONLY_PATCH` adds a compact route timeline readout while preserving save format 4:

- Added an active route timeline helper for Skyranger and interceptor route phases.
- Geoscape globe now shows a lightweight active route timeline strip during aircraft travel, including ferry, refuel, attack/mission, and return leg coloring.
- Added Build Health coverage for current phase text, progress conversion, and route segment coloring.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Browser smoke confirmed start screen, first base confirmation, and Geoscape load from `http://127.0.0.1:5173/index.html`.
- Browser Build Health passed `228/228`.
- Browser console errors: none from the fixed `1755` game page.
- In play, staged aircraft routes should show a bottom-of-globe route timeline during active travel.

Next recommended patch: STAGED_SORTIE_ROUTE_TIMELINE_MANUAL_FLOW_HARDENING_INDEX_ONLY.

## v0.26.07.12.1010 - Tactical 3D Victory Dance and Equipment Colors Sync

Build `v0.26.07.12.1010_TACTICAL_3D_VICTORY_DANCE_AND_EQUIPMENT_COLORS_INDEX_ONLY_PATCH` was applied outside this Codex pass and then inspected here before further roadmap work:

- Current `index.html` now reports the tactical 3D victory dance / equipment color patch.
- Added/confirmed Build Health coverage for a Three.js isometric tactical battlemap that reuses tactical hex state, natural cover, equipment colors, and victory display behavior.
- Synced `src/manifest.json` and `tools/check-aegis-build.cjs` to the actual current build so seam checks no longer point at stale `1755` metadata.
- Optimization note: the current build is still playable as a single-file artifact, but external patching appears to have dropped the recently added staged-sortie route timeline and staged-return decision Build Health rows. Treat that as a roadmap hardening item rather than assuming the previous staged-route polish is fully covered.

Verification checklist:
- `node tools\\check-aegis-build.cjs` should pass after this sync.
- Static app-script parse should pass.
- Browser smoke should confirm start screen, first base confirmation, and Geoscape load from `http://127.0.0.1:5173/index.html`.
- Browser Build Health initially failed `221/226` on the inspected tactical 3D build, which led directly to the follow-up ferry staging and fast-forward regression fix.
- Browser console errors should be checked after reload.

Next recommended patch at the time of inspection: `FERRY_STAGING_AND_FAST_FORWARD_REGRESSION_FIX_INDEX_ONLY`, restoring ferry staging and fast-forward coverage before further roadmap work.

## v0.26.07.12.1025 - Ferry Staging and Fast-Forward Regression Fix

Build `v0.26.07.12.1025_FERRY_STAGING_AND_FAST_FORWARD_REGRESSION_FIX_INDEX_ONLY_PATCH` hardens the externally added tactical 3D build after browser Build Health exposed ferry/fast-forward regressions:

- Restored real-open-hangar requirements for aircraft ferry staging and UFO tracking staged reach. Transient staging slots no longer satisfy live sortie planning.
- Restored staged multi-interceptor hangar reservation so backup aircraft cannot overbook one staging hangar.
- Restored fast-forward recovered-soldier auto-equip behavior so completed Workshop gear is seeded before recovered soldiers choose replacement equipment.
- Updated Build Health expectations around closed staging bases and full-network ferry assignment to match the real-hangar rule.

Verification checklist:
- `node tools\\check-aegis-build.cjs` should pass.
- Static app-script parse should pass.
- Browser smoke should confirm start screen, first base confirmation, and Geoscape load.
- Browser Build Health should return to all-pass from the observed `221/226` failure state.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY`, restoring the route timeline/readout and post-attack ferry decision coverage on top of the tactical 3D work.

## v0.26.07.12.1030 - Build Health Stabilization and Bible Sync

Build `v0.26.07.12.1030_BUILD_HEALTH_STABILIZATION_AND_BIBLE_SYNC_INDEX_ONLY_PATCH` follows the external tactical 3D work and the 1025 ferry regression fix with a small verification stabilization pass:

- Synced the playable `index.html` build constant with `src/manifest.json` so the seam checker and start screen point at the same current build lineage.
- Corrected the full-network ferry self-test target so the final staging base is actually within the interceptor's post-refuel round-trip range under real-open-hangar rules.
- Stabilized the memorial-offering variety self-test so randomized tribute selection no longer creates false negative Build Health rows when the expanded catalog is present.
- Confirmed the 1010 tactical 3D sync notes remain distinct from the later 1025 ferry regression notes.

Verification checklist:
- `node tools\\check-aegis-build.cjs` passed.
- Static app-script parse passed.
- Local diagnostic self-test harness passed with no failing rows.
- Browser smoke passed from `http://127.0.0.1:5173/index.html`: start screen, first base confirmation, and Geoscape load.
- Browser Build Health passed `226/226`.
- Browser console errors were clear.

Next recommended patch: `STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY`, then continue into the next roadmap systems once staged-route UX coverage is fully restored.


## v0.26.07.12.1115 - Staged Sortie Route Timeline and Return Decision Restore

Build `v0.26.07.12.1115_STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY_PATCH` restores the visible staged-sortie route readout on top of the ferry staging systems:

- Added a compact Geoscape route timeline panel for active interceptor and Skyranger ferry sorties.
- Timeline rows show queued, active, and completed ferry, refuel, attack, incident, and return legs.
- Staged interceptor post-attack decisions now summarize the staging base, origin base, and return-home route.
- Friendly staging-base arrival/refuel remains a non-combat route phase rather than a base attack.
- Cleaned the backup reminder funds line so corrupted replacement characters no longer appear before Funds.
- Build Health coverage now checks staged interceptor timeline/decision restoration and staged Skyranger ferry/refuel/incident/return route summaries.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1115_STAGED_SORTIE_ROUTE_TIMELINE_AND_RETURN_DECISION_RESTORE_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke passed from `http://127.0.0.1:5173/index.html`: start screen, first base confirmation, and main Geoscape load.
- Browser Build Health passed `228/228`, including the staged route timeline rows.
- Browser console errors were clear.
- Manual follow-up should launch a ferry-staged interceptor and Skyranger to confirm the route panel is readable during live travel.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY`, focused on manual staged-sortie playtest findings, attack-again/ferry-home flow polish, and any remaining route visualization edge cases. Near-term tactical candidate after the ferry/staged-sortie flow is stable: `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY`.

## Roadmap Addition - Tactical Three.js Alien Incident Battle Polish

Future patch candidate: `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY`.

Goal: improve the Three.js battle option for alien incidents so it becomes a clearer, more satisfying tactical choice rather than a novelty beside auto-resolve/classic simulation.

Planned scope:

- Improve tactical camera framing, zoom defaults, and unit readability on the Three.js battlefield.
- Make soldier and alien silhouettes, facing, movement paths, cover, overwatch/shot intent, hit/miss feedback, and deaths easier to read.
- Keep alien incidents, landed UFO missions, crash sites, and future terror missions using a shared tactical battle presentation where possible.
- Preserve existing tactical simulation helpers, mission reports, soldier XP/wounds/KIA handling, equipment recovery, and local-base Skyranger return logic.
- Keep tactical mode isolated from Geoscape clock advancement until the mission resolves.
- Add small tactical UI affordances for selected unit, current weapon, cover/line-of-sight hints, and end-turn/resolve state.
- Add Build Health coverage for tactical Three.js initialization, selected-unit display, cover/LOS consistency, hit/miss event rendering metadata, mission completion handoff, and no-regression auto-resolve/classic lineup paths.

Design note: this should remain an index-only polish pass until the tactical architecture is ready for a larger extraction. Avoid a broad tactical rewrite; make the current Three.js option visibly better and easier to test.


## v0.26.07.12.1140 - Tactical Three.js Readability Seed

Build `v0.26.07.12.1140_TACTICAL_THREEJS_READABILITY_SEED_INDEX_ONLY_PATCH` starts the tactical Three.js alien-incident polish roadmap without changing save format:

- Added a compact tactical readability overlay for the Three.js battle view that summarizes selected unit, weapon kind, cover state, HP/TU, current turn, and fire mode.
- Added a deterministic helper for tactical readability text so future camera/LOS/selection polish has a tested contract.
- Added Build Health coverage for the tactical readability overlay helper while preserving the existing Three.js tactical battlemap coverage.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1140_TACTICAL_THREEJS_READABILITY_SEED_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser Build Health should include the new Three.js tactical readability row on the next manual/browser pass.

Next recommended patch remains `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` for live ferry-route playtest hardening, with `TACTICAL_THREEJS_ALIEN_INCIDENT_BATTLE_POLISH_INDEX_ONLY` queued as the next tactical polish lane.

## v0.26.07.12.1210 - Tactical Three.js Incident Battle Polish

Build `v0.26.07.12.1210_TACTICAL_THREEJS_INCIDENT_BATTLE_POLISH_INDEX_ONLY_PATCH` expands the alien-incident Three.js tactical polish pass without changing save format:

- Tactical missions now default to the Three.js view when the bundled renderer is available, with the existing 2D Hex view still available as a manual fallback.
- Expanded the Three.js tactical readability overlay with selected soldier weapon, cover, HP/TU, ammo, fire mode, visible hostile count, line-of-sight target count, and reachable movement count.
- Added terrain-aware Three.js ground hex coloring so forest/brush, city/terror, crash/wreck, rock, crate, and open tiles read closer to the 2D tactical maps.
- Added Build Health coverage for the enhanced Three.js tactical incident battle readout, terrain color diversity, and 3D default/fallback seam.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1210_TACTICAL_THREEJS_INCIDENT_BATTLE_POLISH_INDEX_ONLY_PATCH`.
- Static app-script parse passed.
- Browser smoke confirmed the start screen shows `V0.26.07.12.1210`, first-base setup works, and Geoscape loads after confirming Fort Aegis.
- Browser Build Health passed `230/230` and includes `Three.js tactical incident battle polish shows terrain colors LOS movement ammo and 3D defaults`.
- Browser console check found no game runtime errors; the only warning observed was the existing Tailwind CDN production warning.
- Manual tactical smoke should verify Three.js incident maps open by default when available, 2D Hex remains selectable, and 3D tile colors feel closer to the 2D map.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` remains the route-flow priority, especially interceptor post-attack re-attack/send-home decisions and Skyranger staged-route manual playtesting. Tactical follow-up candidate: add stronger Three.js camera controls, cover markers, and selected-target previews after the ferry flow is stable.

## v0.26.07.12.1240 - Procedural Tactical Biomes

Build `v0.26.07.12.1240_PROCEDURAL_TACTICAL_BIOMES_INDEX_ONLY_PATCH` replaces the remaining cyan/holographic Three.js ground treatment with deterministic mission biomes without changing save format:

- Added Wilderness, Farmland, Small Town, and Urban District tactical environments selected from mission intent and mission seed.
- Unified the 2D and Three.js tactical views around the same procedural terrain data so paths, streams, roads, service lanes, irrigation ditches, fields, lawns, yards, and urban lots remain consistent when switching views.
- Natural maps can generate winding dirt paths and streams; farm maps generate crop bands, pasture, tilled soil, lanes, irrigation, hay, fencing, and crop cover.
- Small-town and city maps generate roads and lanes with environment-specific concrete, fencing, crates, wrecks, yards, lawns, and sparse vegetation.
- Replaced the default cyan Three.js tile and lighting treatment with opaque natural/urban ground colors, warmer daylight, biome-colored fog/backgrounds, and subdued neutral tile seams. Selection and movement highlights remain distinct.
- Added Build Health coverage for deterministic biome selection, terrain diversity, paths/water/roads, environment-specific cover, and shared 2D/Three.js terrain colors.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1240_PROCEDURAL_TACTICAL_BIOMES_INDEX_ONLY_PATCH`.
- Static app-script parsing passed after the final terrain and lighting edits.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, Skyranger mission launch, clock-based incident arrival, and opening a live Three.js tactical mission.
- Browser Build Health passed `231/231`, including `Procedural tactical biomes generate wilderness streams city roads farms and small towns`.
- The live opening incident rendered as a Wilderness battlefield with opaque varied ground colors and reported shared 2D/Three.js terrain state. Final lighting was reduced and filmic color handling added after the smoke screenshot showed over-bright greens/browns.
- Browser console contained no game runtime errors. The existing Tailwind development-CDN warning remains non-blocking.
- Additional manual variety testing should open Farmland, Small Town, and Urban District incidents and confirm their roads, lanes, irrigation, structures, and traversal feel distinct during normal play.

Next recommended patch: `STAGED_SORTIE_MANUAL_FLOW_AND_FERRY_RETURN_PLAYTEST_INDEX_ONLY` remains the campaign-flow priority. The next tactical follow-up should add Three.js camera controls, cover markers, and selected-target previews after biome playtesting.

## v0.26.07.12.1310 - Aircraft Ferry Range and Home Return Hardening

Build `v0.26.07.12.1310_AIRCRAFT_FERRY_RANGE_AND_HOME_RETURN_HARDENING_INDEX_ONLY_PATCH` audits and hardens interceptor/Skyranger ferry-network eligibility and return-home state without changing save format:

- Aircraft now normalize separate permanent `homeBaseId` / `homeHangarKey` identity alongside mutable current base/hangar location. Old saves infer home identity from their existing aircraft assignment.
- UFO Tracking and interceptor launch now use the same unified per-aircraft eligibility result, preferring a valid direct sortie and otherwise using a valid ferry/refuel route.
- Staged interceptors retain their original home base and outbound ferry route after a surviving-UFO pass, including through a repeat attack.
- A repeat attack that destroys the UFO now includes the reverse ferry/refuel route and does not silently treat the staging base as the aircraft's permanent home.
- The post-pass decision validates that the same aircraft are present and ready, the UFO remains tracked/detected, and it is still reachable before enabling another attack.
- Aircraft undergoing staging-base repair/refuel keep the decision pending without blocking Geoscape controls; the decision appears when the flight becomes ready.
- Blocked attack/return actions no longer erase the pending decision. The player can also intentionally keep the flight at its staging base while preserving its permanent home identity.
- Skyranger staged mission return remains incident site -> staging base -> reverse ferry route -> original home base, now backed by the same normalized aircraft home identity.
- Added Build Health coverage for old-save home normalization, direct reach from a current operating base, ferry-network reach, vanished contacts, repair waits, repeat-attack home lineage, reverse ferry phases, and final home-base recovery.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1310_AIRCRAFT_FERRY_RANGE_AND_HOME_RETURN_HARDENING_INDEX_ONLY_PATCH`.
- Static app-script parsing passed after the final route-contract wording fix.
- Localhost browser smoke passed through the start screen, first-base confirmation, and main Geoscape.
- Browser Build Health passed `232/232`, including `Aircraft ferry range and home return preserve direct staged and repeat-attack routes` and the existing staged-route timeline checks.
- Browser console contained no game runtime errors.
- Manually test a direct interceptor sortie and confirm it returns to its assigned home hangar.
- Manually test a staged miss, another attack, and a later shootdown; confirm the route returns through the staging/ferry network to the original home base.
- Let a UFO disappear after a staged pass and confirm re-attack is disabled while Ferry Back Home remains available.
- Run a staged Skyranger incident and confirm the return timeline reaches its original base after the mission.

Next recommended patch: `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, focused on canceling queued orders safely, returning reservations to the correct hangar state, and separating serial queue ownership from the future multi-flight travel model.

## v0.26.07.12.1415 - Geoscape Ferry Network Overlay

Build `v0.26.07.12.1415_GEOSCAPE_FERRY_NETWORK_OVERLAY_INDEX_ONLY_PATCH` was integrated externally after the 1310 handoff:

- Added player-controlled Interceptor and Skyranger ferry-network line filters to the Geoscape.
- Added Show Both and Hide Lines controls plus a connectivity summary for isolated bases.
- Kept ferry-network lines separate from range overlays and new-base placement previews.
- Added Build Health coverage for network filtering, one-way link visibility, lane types, and isolated-base reporting.

This external patch was inspected and preserved by the 1500 loaded-save eligibility pass.

## v0.26.07.12.1500 - Loaded-Save Interceptor Eligibility Fix

Build `v0.26.07.12.1500_LOADED_SAVE_INTERCEPTOR_ELIGIBILITY_FIX_INDEX_ONLY_PATCH` fixes loaded campaigns that could show nearby UFOs and home-base interceptors while leaving all interception controls unavailable, without changing save format:

- Legacy UFO records with tracking history but no explicit `detected` field now retain a firing-quality radar lock after normalization.
- Explicit modern `detected: false` contact-lost states remain false and still require radar reacquisition.
- Active Interceptor travel, Skyranger travel, and pending staged-return decisions are now included in campaign saves and restored on load.
- Migration now consults saved interceptor travel before applying stale-airborne recovery, preventing a legitimate active sortie from being incorrectly converted to Repairing.
- UFO Tracking now distinguishes a visible radar echo without firing-quality lock from aircraft readiness blockers and summarizes non-ready aircraft statuses.
- Added a deterministic loaded-save fixture with two ready North America interceptors and two nearby North America UFOs, including legacy radar-lock inference, home-base/hangar preservation, per-contact launch eligibility, explicit contact-lost preservation, and active-travel preservation.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed for `v0.26.07.12.1500_LOADED_SAVE_INTERCEPTOR_ELIGIBILITY_FIX_INDEX_ONLY_PATCH`.
- Static app-script parsing passed.
- Localhost browser smoke confirmed the 1500 start screen, loaded Autosave 2, and rendered the main Geoscape.
- Browser Build Health passed `234/234`, including `Loaded saves preserve interceptor eligibility and active travel`.
- No game runtime exception surfaced during the browser smoke or Build Health pass.
- Manually load the affected two-UFO North America campaign and confirm each detected contact enables `1 Interceptor` while a ready local craft remains available.
- Confirm an explicit contact-lost radar echo remains blocked and now explains that Geoscape time must advance for reacquisition.
- Save during a ferry/interception route, reload, and confirm the active route and original-home return decision remain intact.

Next recommended patch: `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY`, after manual confirmation of the new saved reservation and relocation flow.

## v0.26.07.25.0139 - Skyranger Ferry Airborne Hangar Release Fix

Browser build `v0.26.07.25.0139_SKYRANGER_FERRY_AIRBORNE_HANGAR_RELEASE_FIX_INDEX_ONLY_PATCH` preserves save format 4 and fixes a staged incident route reproduced from the supplied slot-10 browser export.

Root cause and implemented scope:

- Fort Aegis is about 10,820 km from the active South America incident, so the normal 21,640 km Skyranger round trip is correctly outside the standard 16,000 km range.
- S. America 1 is a valid staging base: the Fort Aegis ferry leg is about 8,792 km one way and the refueled incident round trip is about 7,098 km.
- Saber One had already departed S. America 1 and was Returning to Fort Aegis, but retained its S. America `hangarKey` for travel continuity. The generic slot lookup treated that stale departure key as physical occupancy while Fort Aegis also correctly held the craft's recovery reservation, blocking two hangars with one airborne craft.
- `aircraftOccupiesHangarSlot` now excludes only `Outbound` and `Returning` aircraft from physical departure-slot occupancy. Ready, Queued, and Repairing craft remain occupying, and destination/home reservation records continue to block their recovery hangars.
- The staging planner still requires a real open hangar. Transient staging and occupied-hangar overbooking remain disabled.
- Build Health now includes `Returning interceptors release departed staging hangars without losing home reservations`, using the supplied base, mission, range, and travel geometry.
- Multi-base ferry routing is recorded as a temporary browser-only gameplay parity exception because the current Godot vertical slice does not implement that strategic system.

Compatibility and risk:

- The supplied export was inspected read only and was not rewritten. Existing save records and save format 4 remain unchanged.
- The correction is constant-time inside the existing bounded fleet slot lookup and adds no Geoscape clock, tactical, pathfinding, visibility, rendering, or AI work.
- Manual validation should confirm the staged response in the exact export and verify that an actually occupied S. America hangar still blocks the route.

Verification completed during implementation:

- All six inline application scripts parsed.
- `node tools\check-aegis-build.cjs` passed for the 0139 build label and new occupancy seam.
- Browser Build Health passed `277/277`, including the supplied-save hangar-release regression and every prior ferry, tactical, and medical row.
- The supplied slot-10 export loaded through localhost without saving over the source file. Incident staging named Aegis One, Fort Aegis, S. America 1, the 8,792 km ferry, and the 7,098 km final round trip.
- Confirm Launch started the staged route, completed ferry/refuel/mission travel under the Geoscape clock, and opened the exact 12-soldier 64x64 safe-2D incident.
- Three End Turn cycles completed with control returning to the human turn and no browser application error. The only console warning was the existing Tailwind CDN production advisory.

## v0.26.07.24.0138 - Tactical Medkit and Wounded Recovery Parity Patch

Browser build `v0.26.07.24.0138_TACTICAL_MEDKIT_AND_WOUNDED_RECOVERY_PARITY_PATCH` preserves save format 4 and ports the pending native 0010 medical gameplay contract into the complete HTML campaign.

Implemented scope:

- Soldiers can issue or return one Medkit from the currently selected base. Issue consumes one local-store unit, return restores one, unavailable stock is disabled, repeated issue/return calls are idempotent, and existing weapon/armor mission-confirmation rules remain unchanged.
- An issued Medkit becomes one tactical charge. A selected injured living soldier can restore up to 12 HP for 12 TU; the charge is consumed immediately and HP, TU, movement highlighting, button state, campaign-soldier health, and tactical feedback update together.
- Full-health, no-charge, insufficient-TU, non-human-turn, dead/nonhuman, and no-selection attempts are rejected without changing medical state.
- Manual tactical completion carries each soldier's final HP and remaining Medkit charge into mission resolution. Surviving injured soldiers receive one recovery day per ten missing final HP, rounded up and capped from one to five days, and the after-action casualty line now identifies them instead of reporting no major casualties.
- Unused Medkits on KIA soldiers are recovered after victory and lost after defeat with mission-report feedback. Used charges remain consumed and surviving unused charges remain issued.
- Browser and native gameplay parity is now an explicit manifest/checker contract covering base-local ownership, the 12-HP/12-TU action, one-charge consumption, final-HP wound recovery, and victory-recovery/defeat-loss behavior.

Performance and compatibility:

- Medkit use touches only the selected unit and existing movement-preview state. Mission medical resolution scans only the bounded deployed roster. No tactical visibility, light, map-generation, pathfinding, civilian, alien-AI, or render-loop work was added.
- Save format remains 4. Missing soldier Medkit state defaults to false, existing browser inventory remains authoritative, and no active campaign or tactical save is rewritten during normalization.
- The browser Sickbay retains its existing bed-capacity and overflow behavior; the shared parity contract governs the player-facing medical action and ownership rules rather than forcing identical platform presentation.

Verification completed during implementation:

- All six inline application scripts parsed.
- `node tools\check-aegis-build.cjs` passed with matching browser/native labels, save format, medical constants, and parity-system declarations.
- Browser Build Health passed `276/276`, including four new medical/parity rows and every prior regression.
- A fresh unsaved localhost campaign bought one Medkit, issued it, returned it, and reissued it while local stock changed by exactly one each time.
- A six-soldier response launched into a 64x64 safe-2D incident. The carrier showed `Medkit ready`, the `Use Medkit - 12 TU` action correctly remained disabled at full HP, and three End Turn cycles returned control to the human turn without a runtime exception or lockup.
- Native counterpart verification remains `97/97` tests, `69/69` visible Build Health rows, strict Godot 4.7.1 parsing, and a hardware-rendered treatment plus three-turn tactical smoke.
- Browser work used a fresh unsaved campaign and native hardware work used an isolated in-memory campaign; no player save or browser export was overwritten.

Manual validation still required:

- Injure a browser Medkit carrier, use the action, and confirm HP rises by up to 12, TU falls by 12, the charge disappears, movement highlighting shrinks, and repeat use is disabled.
- Complete a browser mission with a surviving injured soldier and verify the final post-treatment HP produces the expected `Wounded - N days` state, save/reload persistence, midnight countdown, and return to duty.
- Confirm unused KIA Medkits return after victory and are lost after defeat in both versions.
- Repeat one bounded medical flow in an imported native copy and confirm the original browser export bytes remain unchanged.

Known risks:

- Self-treatment is the current paired scope. Adjacent ally aid, unconscious stabilization, body-part trauma, bleeding, multiple charges, and ground-item interaction remain deferred.
- Browser and native Sickbay presentation differs because the browser campaign already models bed capacity and overflow. Any future shared rule change must still be implemented and checked in both versions.

Next paired step after live validation: `TACTICAL_ADJACENT_FIELD_AID_AND_SICKBAY_PATIENT_ROSTER_PARITY_PATCH`, adding adjacent ally treatment and a focused patient roster to both versions without broad medical simulation.

## v0.26.07.19.GODOT.0010 - Tactical Medkit and Wounded Status Recovery Vertical Slice

Native build `v0.26.07.19.GODOT.0010_TACTICAL_MEDKIT_AND_WOUNDED_STATUS_RECOVERY_VERTICAL_SLICE` preserves save format 4 and follows player-verified 0009 with the smallest useful medical loop connecting manufactured Medkits, soldier loadouts, tactical damage, mission results, and strategic time.

Implemented scope:

- The Soldiers screen now displays loose Medkit stock and provides one binary Medkit control per living soldier. Issuing consumes one local item, returning restores one, repeated issue calls are idempotent, unavailable stock is disabled and rejected, and new recruits still arrive without free equipment.
- An issued Medkit becomes one tactical charge. The selected injured soldier can spend 12 TU to restore up to 12 HP; the charge is consumed immediately and authoritative HP, TU, movement range, button state, and Tactical Control feedback refresh together.
- Full-health, no-charge, insufficient-TU, non-human-turn, and no-selection attempts are rejected without changing HP, TU, or inventory.
- Tactical mission results preserve unused charges for survivors, consume used charges, recover unused Medkits from KIA soldiers after victory, and lose them with explicit field-loss feedback after defeat.
- Surviving soldiers below maximum HP enter `Wounded` status for one recovery day per ten missing final HP, rounded up and capped from one to five days. Final post-Medkit HP determines the duration.
- Wounded soldiers remain excluded from deployable assigned personnel. Each crossed strategic midnight decrements the exact timer; reaching zero restores `Ready` status and adds a medical-clearance report.
- Soldier cards show exact remaining recovery days. Native and imported-copy saves persist `medkit` ownership and `recovery_days`; legacy strings such as `Sickbay - 3 days` migrate conservatively.

Performance and compatibility:

- Medkit use touches only the selected unit. Wound recovery scans the bounded local roster only when strategic time crosses midnight; no tactical pathfinding, visibility, AI, civilian, map-generation, or render-loop workload was added.
- Save format remains 4. Missing Medkit ownership defaults to false, missing wounded timers default conservatively, negative loose stock clamps to zero, and issued ownership is not silently returned or duplicated during normalization.
- Browser imports preserve loose Medkit stock but do not infer issued medical items from ambiguous browser inventory shapes. The browser export remains read only.

Verification completed during implementation:

- Godot 4.7.1 strict editor parsing passed.
- Native tests pass `97/97`; visible native Build Health passes `69/69` through the same runner.
- Coverage includes Medkit issue/return/idempotence, save round-trip, legacy wound migration, exact 12-HP/12-TU tactical consumption, repeat-use rejection, post-treatment mission wounds, one-day midnight progression, exact partial recovery persistence, final clearance, successful KIA recovery, failed-mission loss, browser wound normalization, and every previous native regression.
- A hardware-rendered OpenGL smoke on the native main scene issued a Medkit, mounted the real Tactical Control UI, treated an injured soldier from 18/38 to 30/38 HP for 12 TU, showed `No medkit`, disabled repeat use, refreshed movement highlighting, and completed three End Turn cycles through human turn 4 without a lockup.
- The paired HTML build loaded through localhost, displayed build 0138, completed first-base setup, conserved Medkit stock across issue/return/reissue, reached Geoscape, launched a six-soldier 64x64 safe-2D incident, completed three End Turn cycles, and passed browser Build Health `276/276`.
- The hardware smoke used an unsaved in-memory campaign and the browser regression used a fresh unsaved browser campaign, so neither a native save nor a browser export was overwritten.

Manual validation still required:

- Issue and return a Medkit on the Soldiers screen and confirm loose stock changes by exactly one each time. Save/reload with one issued and confirm ownership and stock remain exact.
- Launch an injured Medkit carrier, use the tactical button, and confirm HP rises by up to 12, TU falls by 12, movement highlights shrink, the charge disappears, and a second use is disabled.
- Complete a mission with a surviving injured soldier, confirm the exact `Wounded - N days` roster status and deployment exclusion, save/reload, then cross each strategic midnight until medical clearance returns the soldier to duty.
- Confirm an unused Medkit on a KIA soldier returns after victory but is lost after defeat, with the corresponding command report.
- Repeat one bounded flow in an imported native copy and confirm the original browser export bytes remain unchanged.

Known risks:

- This slice supports self-treatment only. Adjacent ally treatment, stabilized unconscious soldiers, body-part trauma, bleeding, multiple charges, and item-ground interaction remain deferred.
- Recovery duration uses final missing HP and does not yet model Sickbay capacity, staff, facility damage, or treatment priority.

Next native step after live validation: `GODOT.0011_ADJACENT_FIELD_AID_AND_SICKBAY_PATIENT_ROSTER_VERTICAL_SLICE`, adding adjacent ally treatment and a focused patient view without broad medical simulation.

## v0.26.07.19.GODOT.0009 - Local Base Inventory and Soldier Loadout Vertical Slice

Native build `v0.26.07.19.GODOT.0009_LOCAL_BASE_INVENTORY_AND_SOLDIER_LOADOUT_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0008 construction gate with the smallest usable connection between Workshop output, local stores, soldier records, and tactical combat.

Implemented scope:

- Added content-defined Ballistic Rifle, Laser Rifle, Unarmed, Field Suit, and No Armor profiles. The Ballistic Rifle preserves the established 17-25 damage, seven-hex range, 16 TU shot, and 26 breach damage. The Laser Rifle uses 22-28 damage, nine-hex range, 14 TU shots, and 32 breach damage. Field Suits reduce incoming tactical damage by two.
- The Soldiers screen now exposes loose Ballistic Rifle, Laser Rifle, and Field Suit counts plus one compact weapon and armor selector per soldier.
- Loadout changes are atomic and base local: issuing an item consumes exactly one loose unit, while the previous issued item returns to the same stores record. Unavailable items are omitted and rejected by campaign state, preventing UI or direct-call duplication.
- Soldiers can deliberately return equipment by selecting Unarmed or No Armor. Existing imported equipment names remain preserved until the player chooses a supported native replacement.
- New recruits now arrive Unarmed and with No Armor so hiring cannot create free equipment outside Workshop/stores ownership.
- Saved weapon and armor names enter the native tactical unit record. Unarmed soldiers cannot shoot or breach; Laser Rifle range, damage, TU, and breach values affect live tactical actions; Field Suit mitigation affects alien damage.
- Tactical Control now republishes the authoritative selected-unit record whenever tactical state changes. Movement, shots, breaches, civilian contact, selection changes, and turn transitions therefore refresh displayed TU and HP in step with movement highlights and combat state.
- Successful missions recover issued weapon and armor from KIA soldiers into local stores. Failed missions remove that equipment as field losses and add explicit report feedback instead of leaving gear stranded on an unusable roster record.

Performance and compatibility:

- Equipment work is bounded to one soldier, two slots, and the small native content catalog per interaction. No tactical per-frame scan, map generation, pathfinding, visibility, civilian, alien-turn, or rendering workload was added.
- Native and imported-copy saves remain format 4. Soldier weapon/armor records and nonnegative store counts normalize conservatively; known native store keys are supplied without changing issued-item ownership.
- The browser export remains read only. Full browser Quartermaster rules, arbitrary imported equipment statistics, transfers, ammunition inventory, multiple bases, and body-part armor remain outside this vertical slice.

Verification completed during implementation:

- Godot 4.7.1 strict editor parsing passed.
- Native tests pass `88/88`; visible native Build Health passes `63/63` through the same runner.
- Coverage includes stock-conserving weapon/armor exchange, unavailable-item rejection, malformed stock/loadout migration, exact save/reload, unequipped recruits, successful KIA recovery, tactical profile inheritance, Unarmed fire rejection, a real range-eight Laser Rifle shot costing 14 TU, immediate selected-unit TU republishing from 64 to 50 after that shot, and all previous construction, manufacturing, import, aircraft, rescue, breach, and three-turn tactical regressions.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M loaded the 44-soldier imported Fort Aegis roster, displayed local Ballistic Rifle/Laser Rifle/Field Suit stock, exchanged both available Laser Rifles across assigned and unassigned soldiers without duplication, and rendered tactical combat through turn four without a lockup.
- The imported native-copy save was backed up before the live exchange and restored afterward to its exact original SHA-256 checksum. The browser source export was never written.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached the start screen, first-base setup, and Geoscape, and browser Build Health passed `272/272`. The runtime error overlay remained empty; console inspection found only the existing Tailwind production-CDN warning.

Player gate completed:

- During live tactical validation, the player identified that movement highlighting used the post-shot TU value while Tactical Control retained the selection-time value.
- Tactical state emission was corrected to republish the authoritative selected unit after every action and turn transition. The player confirmed the displayed TU now updates correctly and accepted 0009 for progression.
- Automated, Build Health, hardware GPU, and exact imported-copy restoration checks remain the recorded evidence for stock conservation, persistence, tactical profiles, Field Suit mitigation, Unarmed rejection, KIA recovery, and browser-source isolation.

Known risks:

- Native combat uses only the bounded catalog profiles. Unsupported imported equipment names remain display-preserved but use conservative fallback tactical values until exchanged for supported native equipment.
- Failed-mission KIA equipment is intentionally lost; successful-mission recovery is deterministic and does not yet model corpse access, mission extraction zones, or item-by-item salvage.

Next native step after live validation: `GODOT.0010_TACTICAL_MEDKIT_AND_WOUNDED_STATUS_RECOVERY_VERTICAL_SLICE`, making already manufactured Medkits useful without importing the browser game's full inventory, body-part injury, or Sickbay simulation.

## v0.26.07.19.GODOT.0008 - Base Facility Construction and Specialist Capacity Vertical Slice

Native build `v0.26.07.19.GODOT.0008_BASE_FACILITY_CONSTRUCTION_AND_SPECIALIST_CAPACITY_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0007 gate with the smallest local base-expansion loop needed to resolve full specialist facilities.

Implemented scope:

- Added Living Quarters, Laboratory, and Workshop projects using the browser campaign's established $300k, $450k, and $400k costs.
- Living Quarters take three crossed strategic midnights, Workshops take four, and Laboratories take five. Up to three projects advance concurrently.
- Construction is prepaid. A project occupies one bounded slot and grants no operational capacity until its exact completion day.
- Completed Living Quarters add 12 local personnel spaces, Laboratories add 10 Scientist spaces, and Workshops add 10 Engineer spaces. Existing hiring blockers immediately recalculate from the operational counts.
- Pending projects expose future facility count and capacity without permitting early specialist orders.
- Projects can be cancelled for half their prepaid cost. Identity, facility type, base ownership, cost, total duration, and exact days remaining persist in native or isolated imported-copy saves.
- The Base screen now combines construction catalog, operational/projected counts, three-slot status, funds, active progress, cancellation refund, personnel arrivals, and one shared strategic-day control.

Performance and compatibility:

- Construction is bounded to three records and updates only at strategic midnight; no tactical, rendering-loop, pathfinding, or per-frame work was added.
- Native 0001-0007 saves receive an empty construction list. Existing and imported repeated facility counts remain authoritative and are incremented only by completed local projects.
- Save format remains 4. Browser exports remain read only, and native/imported-copy slot isolation is unchanged.

Verification completed:

- Godot 4.7.1 strict editor parsing passed during implementation.
- Native tests pass `79/79`; visible native Build Health passes `58/58` through the same runner.
- Coverage includes exact established costs, three concurrent slots, full-queue blocking, no early capacity, projected capacity, independent countdowns, partial native save/reload, staggered completion, half-cost cancellation, specialist hiring reopening, and legacy empty-queue migration.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered imported Fort Aegis at 1440x900 with three partial projects, `[1, 3, 2]` days remaining, operational capacities `48/10/10`, and projected capacities `60/20/20`; catalog, progress, refunds, blockers, and personnel controls showed no horizontal overflow.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached first-base setup and Geoscape, browser Build Health passed `272/272`, and runtime errors were empty. The only warning was the existing Tailwind production-CDN notice.

Manual validation completed by player:

- The $1.15M three-project start, full-slot blocker, and no-early-capacity rules passed in imported Fort Aegis.
- Save/reload preserved exact project identities and 1/3, 3/5, and 2/4 days remaining.
- Day 3/4/5 capacity activation, reopened Scientist/Engineer hiring, half-cost cancellation, and unchanged browser source bytes all passed.

Next native step after live validation: `GODOT.0009_LOCAL_BASE_INVENTORY_AND_SOLDIER_LOADOUT_VERTICAL_SLICE`, making manufactured local-store equipment usable by native soldiers through a bounded weapon/armor assignment flow without importing the browser game's full Quartermaster, transfer, or multi-base logistics systems.

## v0.26.07.19.GODOT.0007 - Engineering Staffing and Manufacturing Queue Vertical Slice

Native build `v0.26.07.19.GODOT.0007_ENGINEERING_STAFFING_AND_MANUFACTURING_QUEUE_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0006 gate with the next bounded Workshop-management transition.

Implemented scope:

- Replaced instant Medkit and Laser Rifle delivery with a base-local prepaid FIFO queue capped at eight orders.
- Each assigned Engineer contributes three work points at each crossed strategic midnight, matching the browser campaign's established production rate. Assignment is bounded by both local Engineers and 10 spaces per Workshop.
- Medkits cost $40k and require 18 work. Research-gated Laser Rifles preserve the native slice's $180k cost and require 60 work.
- Only the active order receives work. Unused output from a completed order carries into the next FIFO order during the same midnight pass.
- Completed items enter local stores and release assigned Engineers when the queue empties. Cancelling any queued order returns half its prepaid cost.
- Workshop now exposes Engineer assignment, daily output, catalog authorization, local inventory, active/queued status, progress, FIFO ETA, cancellation refund, and one-day strategic advancement.
- Queue identifiers, item snapshots, progress, assignment, base ownership, funds, reports, and stores persist through save normalization without changing save format 4.

Performance and compatibility:

- Manufacturing is bounded to eight orders and advances only at strategic midnight; it adds no tactical or per-frame work.
- Native 0001-0006 saves receive an empty unstaffed queue. Browser-imported copies preserve their actual Workshop count and never mutate the browser source export.
- Tactical rules, air operations, personnel/research queues, active save paths, browser build 0137, and the single-file HTML artifact remain unchanged.

Verification completed:

- Godot 4.7.1 strict editor import and GDScript parsing passed.
- Native tests passed `70/70`; visible native Build Health passed `52/52` through the same run.
- Coverage includes locked production, Engineer/Workshop staffing clamps, prepaid orders, active-only midnight work, FIFO overflow, local-store completion, automatic staff release, half-cost cancellation, and exact partial-order normalization.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered the staffed Workshop catalog and scrolled partial-order queue at 1440x900 without clipping or horizontal overflow; seeded state read two orders, four assigned Engineers, 12 work per day, and 12/18 active progress.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed, localhost reached first-base setup and Geoscape, and browser Build Health passed `272/272`.
- Browser runtime errors were empty; the only warning was the existing Tailwind production-CDN notice.

Manual validation completed by player:

- Prepaid Medkit and Laser Rifle orders, Engineer assignment limits, active-only midnight progress, FIFO overflow, local-store completion, and displayed ETA all passed.
- Partial-order save/reload preserved exact order identity, progress, staffing, funds, and stores.
- Half-cost cancellation and imported-copy source isolation passed.

Next native step after live validation: `GODOT.0008_BASE_FACILITY_CONSTRUCTION_AND_SPECIALIST_CAPACITY_VERTICAL_SLICE`, adding bounded Laboratory, Workshop, and Living Quarters construction so a staffed campaign can deliberately expand specialist capacity without importing the browser game's complete base-building simulation.

## v0.26.07.19.GODOT.0006 - Personnel Arrivals and Research Unlock Vertical Slice

Native build `v0.26.07.19.GODOT.0006_PERSONNEL_ARRIVALS_AND_RESEARCH_UNLOCK_VERTICAL_SLICE` preserves save format 4 and follows the player-confirmed 0005 staffing gate with the next bounded personnel and technology transition.

Implemented scope:

- Added base-local Soldier, Scientist, and Engineer hiring orders using the browser game's established $120k, $95k, and $90k costs.
- Every order arrives after three crossed strategic midnights. Pending orders reserve Living Quarters capacity; Scientists also reserve Laboratory capacity and Engineers reserve Workshop capacity.
- Pending orders can be cancelled for a deterministic half-cost refund, immediately releasing their reserved capacity.
- Soldier orders capture one of six deterministic recruit records at order time. Delivered soldiers arrive Ready, local to the selected base, and unassigned so they cannot silently displace the active six-seat squad.
- Added 10 Engineer spaces per Workshop. New native campaigns include one Workshop, and native 0001-0005 saves conservatively gain the Workshop already implied by their functional Workshop command screen.
- Browser-imported copies preserve their actual Workshop count and remain blocked from Engineer hiring or manufacturing when no local Workshop exists.
- Laser Weapons completion now records the completed topic, releases assigned scientists, unlocks Laser Power Output 1, and grants the `laser_rifle_production` capability.
- Laser Power Output 1 opens as a separate unstaffed 180-point follow-on project. Browser imports already working on that topic infer Laser Weapons as completed without mutating the source export.
- Workshop Laser Rifle production is owned by campaign state: it remains blocked before research, requires a local Workshop, deducts $180k, and adds one rifle to local stores after the unlock.
- Base, Research, and Workshop screens now expose projected occupancy, pending arrivals, cancellation refund, engineer capacity, completed topics, unlocked capabilities, follow-on selection, and Laser Rifle stores/production.

Performance and compatibility:

- Personnel queues are bounded to the small pending-order list and update only when strategic time crosses midnight; no tactical or per-frame work was added.
- Capacity reservations prevent a queued batch from overbooking Living Quarters, Laboratories, or Workshops while preserving already over-capacity imported states.
- Queue identifiers, recruits, arrival timing, completed research, unlocks, follow-on progress, funds, and stores are JSON-friendly and survive normal or isolated imported-copy save round trips.
- Save format remains 4. HTML `index.html`, browser saves, native slot paths, tactical rules, air operations, and browser-import source isolation are unchanged.

Verification completed:

- Godot 4.7.1 strict editor import and GDScript parsing passed.
- Native tests passed `61/61`; visible native Build Health passed `45/45` through the same run.
- Coverage includes established hiring costs, projected quarters/specialist reservations, full specialist facilities remaining authoritative despite spare quarters, missing-Workshop blocking, half-refund cancellation, no early delivery, third-midnight delivery, deterministic unassigned recruits, legacy Workshop/queue migration, research completion, prerequisite inference, follow-on selection, locked/unlocked Laser Rifle production, funds, and stores.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered Base personnel queues, completed Research, and unlocked Workshop screens at 1440x900 without clipping or horizontal overflow.
- The unchanged HTML artifact's six inline scripts parsed and `node tools\check-aegis-build.cjs` passed for browser build 0137.
- Localhost browser smoke reached first-base setup and Geoscape; browser Build Health passed `272/272`, runtime error logs were empty, and only the existing Tailwind production-CDN warning remained.

Manual validation completed by player:

- Load the native campaign that passed 0005 and confirm the Workshop migration preserves all prior campaign values while adding 10 Engineer spaces.
- Recruit one Soldier, advance two days, save/reload, advance the third day, and confirm the same named recruit arrives Ready but unassigned.
- In the native campaign, use its final open quarters slot to hire/cancel a Scientist and then an Engineer, verifying each half-cost refund before recruiting the Soldier.
- In imported Fort Aegis, confirm five spare quarters allow Soldier hiring but its full 10/10 Laboratory and Workshop correctly block Scientist and Engineer orders.
- Complete Laser Weapons, begin Laser Power Output 1, manufacture one Laser Rifle, then save/reload and verify completed research, capability, active follow-on, funds, and local stores.
- Re-import the current browser campaign read only and confirm its exact Workshop count, inferred Laser Weapons prerequisite, isolated copy save, and unchanged source bytes.

Next native step after live validation: `GODOT.0007_ENGINEERING_STAFFING_AND_MANUFACTURING_QUEUE_VERTICAL_SLICE`, replacing instant Medkit/Laser Rifle construction with a small Engineer-assigned timed production queue while avoiding the full browser manufacturing tree and multi-base logistics.

## v0.26.07.18.GODOT.0005 - Base Personnel and Research Staffing Vertical Slice

Native build `v0.26.07.18.GODOT.0005_BASE_PERSONNEL_AND_RESEARCH_STAFFING_VERTICAL_SLICE` preserves save format 4 and implements the smallest safe strategic-management subset recommended after live browser-import validation.

Implemented scope:

- Added base-local facility counts without importing or simulating the browser build's complete multi-base layout.
- Living Quarters provide 12 personnel spaces and Laboratories support 10 scientists, matching the verified HTML rules.
- Local occupancy counts living soldiers, scientists, and engineers. KIA soldiers do not consume quarters capacity, while over-capacity imported states remain intact and receive visible feedback instead of destructive normalization.
- New native campaigns begin with six soldiers, five scientists, no engineers, 11/12 occupied personnel spaces, and five scientists assigned to Laser Weapons.
- Browser imports preserve selected-base repeated Living Quarters and Laboratory cells plus top-level scientist/engineer totals. All imported soldiers remain available, while base identity remains explicit for local occupancy accounting.
- Research assignment is adjustable from zero through the lower of available scientists and Laboratory capacity. The save stores both the new explicit assignment key and the prior 0004 compatibility alias.
- Each assigned scientist contributes 2 research points per elapsed strategic day. Projects preserve their own required-point totals; completion caps at that requirement, records one report, and releases the assigned staff.
- The Base screen now shows live local personnel, soldiers, scientists, engineers, capacity overflow, and facility-specific staffing instead of placeholder values.
- The Research screen now shows total scientists, lab capacity, assigned/available staff, progress, daily rate, ETA, a numeric staffing control, and a bounded one-day advance disabled during active flight operations.
- Save normalization supplies conservative scientist, engineer, facility-count, and staffing defaults to native 0001-0004 saves without changing save format or save-slot isolation.

Performance and compatibility:

- Capacity and staffing calculations traverse the bounded local roster only when strategic UI/state changes occur; no tactical or per-frame work was added.
- Research advances once per crossed strategic midnight rather than on every minute tick.
- Existing imported copies missing repeated facility counts infer one instance from their preserved facility list. Re-importing the unchanged browser export preserves exact repeated Quarters/Laboratory counts.
- The HTML artifact, browser saves, regular native save, and isolated imported-copy save paths remain unchanged.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native tests passed `50/50`; visible Build Health passed `36/36` through the same run.
- Coverage includes exact personnel/lab rules, legacy migration, staffing clamps, deterministic daily progress, completion/staff release, repeated browser facility counts, imported personnel totals, and all prior tactical/interception/import checks.
- Hardware OpenGL 3.3 on the NVIDIA GeForce GTX 960M rendered native and exact-import Base/Research screens at 1440x900. The three-column facility grid removed horizontal overflow and all summary/staffing controls remained readable.
- The exact July 12 browser export imported read-only in memory as Fort Aegis with four Living Quarters, 48 personnel capacity, 43 living/local personnel, one Laboratory, 10 scientists, 10 engineers, and Laser Power Output 1 at 170/180 points with 10 assigned and one day remaining. Source bytes remained unchanged and neither native save slot was written.
- Imported project requirements now set the ProgressBar maximum before its value; the exact 170/180 state visibly reports 94% instead of being clamped through the control's default 100-point maximum.
- The unchanged HTML artifact's six inline scripts parsed and `node tools\check-aegis-build.cjs` passed for browser build 0137.
- Localhost browser smoke reached first-base setup and the Geoscape; browser Build Health passed `272/272` and runtime error logs were empty. The existing Tailwind production-CDN warning remains non-blocking.

Manual validation still required:

- New/native Base personnel counts and capacity behaved as expected.
- Research staffing, daily rates, ETA, zero-staff pause, restored progress, and save/reload behavior passed.
- Browser-imported repeated facility counts, personnel totals, research staffing/progress, and isolated-copy behavior passed.

The completed gate authorized native 0006's bounded personnel hiring/arrival queues and first research-topic completion/unlock transition.

## v0.26.07.18.GODOT.0004 - Browser Save Import Copy Vertical Slice

Native build `v0.26.07.18.GODOT.0004_BROWSER_SAVE_IMPORT_COPY_VERTICAL_SLICE` preserves save format 4 and exposes the first conservative bridge from an exported HTML campaign into the native vertical slice.

Implemented scope:

- Added a start-screen browser-save file picker with a 32 MB input limit, JSON validation, recognized Project Aegis campaign kind, and rejection of future save formats or ambiguous all-slot backups.
- Corrected the dormant importer to read the actual HTML export contract under the `data` wrapper instead of the unused `game` key.
- Added a review-before-write dialog showing source file, browser build, save format, campaign date, funds, selected base, soldier count, compatible incident count, and explicit compatibility limits.
- Normalized the selected browser base, known facilities, soldier identity/stats/readiness/active squad, active incidents and rescue requirements, research summary, inventory, reports, funds, and Geoscape clock into the bounded native data model.
- The real browser schema's nested `stats`, `identity`, base `grid`, research `topic`, and assigned-scientist fields map directly; KIA and wounded status are visible in the roster.
- Browser active squads are capped at the native Skyranger's six ready seats, while the complete imported roster remains available through page-owned scrolling.
- Browser aircraft, complex layout, relationship, transfer, and queue systems remain in the untouched browser file; the native slice supplies its own Saber One and Nightglass defaults.
- Imported campaigns write only to `user://project_aegis_godot_imported_copy_v4.json`. The regular native slot at `user://project_aegis_godot_save_v4.json` and the selected browser export are never overwritten by this flow.
- Added **Load Imported Copy**, imported-copy save labeling, a persistent source-build provenance banner, and source metadata that survives save/reload.
- Dense imported incident sets receive distinct deterministic marker/hit positions; only selected or hovered incident labels render, preventing strategic-map label piles without changing selection outcomes.
- Fixed command-screen replacement by detaching outgoing UI synchronously before deferred deletion, preserving the new header/navigation while switching among long imported pages.

Performance and compatibility:

- File reads are user-initiated and bounded to 32 MB. Parsing and normalization each traverse the selected campaign data once, with no tactical or per-frame cost.
- Existing native and browser saves remain unchanged. Save format remains 4 because the imported copy maps into the existing native contract and uses a separate path.
- Unsupported all-slot backups explain that one individual browser campaign or slot must be exported, avoiding an ambiguous automatic choice.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native tests passed `45/45`; visible Build Health passed `32/32` through the same run.
- The test suite writes a representative 0137 campaign export, reads it through the exact `data` wrapper, maps the selected second base grid, eight-soldier roster, nested identity/stats, six-seat active squad, rescue incident, research, funds, date, and clock, then writes and reloads a separate imported copy.
- The test suite confirms the browser source file remains byte-for-byte unchanged and the imported path is distinct from the regular native save path.
- Hardware OpenGL smoke on the NVIDIA GeForce GTX 960M rendered and visually verified the start screen, Downloads-rooted picker, compatibility review, imported-copy Geoscape, full 44-soldier roster, and 11-incident Mission Control at 1440x900.
- The actual 606,055-byte July 12 build-1500 browser export previewed and normalized as Month 4 Day 1 at Fort Aegis with 44 soldiers, six ready soldiers assigned, 11 launchable incidents, and unchanged source bytes. Its disposable imported-copy file reloaded successfully and was removed after the test.
- The unchanged HTML artifact's six inline scripts parsed, `node tools\check-aegis-build.cjs` passed for build 0137, and localhost browser smoke reached first-base placement and the Geoscape.
- Browser Build Health passed `272/272`; browser error logs were empty during the start-screen, base-placement, Geoscape, and diagnostics flow.

Manual validation completed:

- The player imported the current browser campaign through the live picker and confirmed the review/import flow worked.
- The player confirmed native and imported save slots remained distinct and save/reload behavior worked.
- The player confirmed the imported command screens and mapped incident mission flow worked at the normal display scaling.

Next native step completed in native build 0005: base-local personnel capacity and research staffing now follow the verified HTML rules without broad multi-base logistics.

## v0.26.07.18.GODOT.0003 - Native Air Interception Vertical Slice

Native build `v0.26.07.18.GODOT.0003_AIR_INTERCEPTION_VERTICAL_SLICE` preserves save format 4 and adds the first bounded strategic aircraft-combat loop.

Implemented scope:

- Added one save-compatible Saber One interceptor and one tracked Nightglass Scout UFO contact to new and normalized native campaigns.
- Added clickable UFO markers, contact selection, Cautious/Standard/Aggressive posture controls, and mutually exclusive Skyranger/interceptor launch commitments.
- Added 20-minute outbound and return legs, map route/craft visualization, fuel commitment, missile expenditure, hull damage, reports, and recorded pilot cues.
- Air combat is deterministic and bounded to at most three exchanges; it cannot create an unbounded simulation loop.
- A destroyed UFO creates a selectable Scout Crash Site tactical incident. Escaped contacts and lost interceptors resolve without leaving an active-flight lock.
- Surviving craft return to bounded service time, then restore hull, fuel, missiles, and Ready status through Geoscape clock advancement.
- Save normalization preserves exact mid-interception phase, progress, posture, craft state, UFO state, combat log, and return/service state without changing save format.
- Added seven visible Build Health rows covering the complete air-operation lifecycle and ten headless checks including a real save/reload at 50% outbound progress.

Performance and compatibility:

- The strategic map still uses one custom-drawn control; UFO and aircraft route rendering add no per-marker scene-node churn.
- Combat executes at most three deterministic rounds only when outbound progress reaches 100%.
- Existing native saves receive missing aircraft/contact defaults through normalization. Browser saves and `index.html` remain untouched.

Verification completed:

- Godot 4.7.1 editor import and strict GDScript parsing passed.
- Native headless tests passed `33/33`; visible Build Health passed `23/23` through the same run.
- The test suite saved at 50% outbound travel, loaded that save into a new campaign object, resumed combat, created a crash site, returned, serviced, and restored Saber One readiness.
- Hardware-rendered OpenGL smoke produced and visually verified tracked-contact, outbound-route, and post-combat return states at 1440x900.

Manual validation completed:

- The player selected Nightglass, used the interception controls, and advanced through outbound combat, return, and service without a reported issue.
- The player confirmed native save continuity and the generated Scout Crash Site recovery flow work as expected.
- The player confirmed the pilot audio and complete native interception update work as expected.

Next native step completed in native build 0004: conservative browser-save import now uses a review-first picker and an isolated imported-copy slot without overwriting the browser export or regular native campaign.

## v0.26.07.18.GODOT.0002 - Tactical Battle Log Trim Fix

Native build `v0.26.07.18.GODOT.0002_TACTICAL_LOG_TRIM_FIX` preserves save format 4 and fixes the hard lock reported during an incident battle.

Root cause:

- The tactical sidebar retains at most ten battle-log labels.
- When an eleventh label arrived, the trimming loop called `queue_free()` on the oldest child and immediately checked `get_child_count()` again.
- Godot defers `queue_free()` until the frame ends, so the count remained eleven inside the synchronous loop. The same child was queued repeatedly without a terminating state change, driving CPU and memory growth until the window stopped responding.

Implemented fix:

- Excess log entries are now removed from the container before being freed, so the visible child count decreases synchronously on every loop iteration.
- The ten-entry display cap and newest-first message order are unchanged.
- Added native Build Health coverage that sends 24 consecutive tactical messages and requires the container to finish at exactly ten entries.

Verification completed:

- Godot 4.7.1 editor import and GDScript parsing passed.
- Native headless tests passed `22/22`.
- Native Build Health passed `16/16`, including `Tactical battle log trims immediately at ten entries`.
- The tactical test completed soldier movement highlighting, civilian contact, wall destruction, breach traversal, and three asynchronous End Turn cycles.

Manual validation completed:

- The player completed a full native incident mission without another lockup or reported issue.
- The tactical log passed its real sustained-play gate through mission completion and return to command.

## v0.26.07.18.GODOT.0001 - Native Godot 4 Vertical Slice

The first native Godot 4.7.1 slice lives beside the verified HTML artifact. It deliberately reuses save format 4 as a data-contract version while writing to a separate native JSON save, so browser campaigns are not overwritten.

Implemented scope:

- Added a native project, main scene, restrained command UI, data catalog, campaign state model, deterministic hex helpers, strategic map, and tactical board under `godot/`.
- Added first-base placement, Geoscape incidents, Skyranger travel, six-soldier roster management, research/workshop actions, mission and report views, and native save/load.
- Added a 20x14 tactical incident with terrain, connected building walls, cover, a single readable Skyranger and nine-cell rear ramp, six soldiers, three aliens, and two civilians.
- Added bounded reachable-cell/path calculations, TU movement and firing, alien turns, civilian contact/following/panic/recontact, mandatory extraction, mission resolution, and campaign rewards/casualty updates.
- Destroyed wall cells become soft rubble and are excluded from the shared blocker index, allowing human, alien, and civilian paths through the breach.
- Added an in-game 15-row Build Health checker plus a 22-check headless test suite covering campaign, save, hex, movement highlighting, three End Turn cycles, rescue, and breach contracts.

Performance and compatibility:

- Tactical rendering is one custom Godot control rather than one scene node per hex; movement highlighting uses one bounded reachable flood and paths are calculated only for chosen destinations.
- The sample battlefield is fixed at 20x14 and does not port the HTML lighting system, avoiding the browser build's former full-map lighting/DOM costs.
- `index.html`, its build label, and browser save remain unchanged. Godot stores native state separately at `user://project_aegis_godot_save_v4.json`.

Verification completed:

- Godot 4.7.1 headless editor import and GDScript parsing completed with all native classes registered.
- Native headless tests passed `22/22`; this run invokes and passes all `15/15` visible Build Health rows and completes three tactical End Turn cycles.
- A hardware-rendered OpenGL smoke run produced and visually verified the native start, Geoscape, and tactical states at 1440x900.
- The visual pass found and fixed zero-width/zero-height label behavior in wrapped command text and the tactical header; the rerender shows the title, live turn summary, and multiline battle log.

Manual validation still required:

- Complete one full native campaign loop from base placement through tactical victory and return to command.
- Select and move multiple soldiers, run at least three alien turns, destroy and cross a wall breach, and rescue a civilian through the rear ramp.
- Save, return to the menu, load the native campaign, and confirm funds, base, roster, reports, incidents, and mission outcome persist.
- Check music transitions, input feel, tactical readability, and display scaling on the player's normal setup.

Next native step: after this hands-on gate, port a bounded aircraft interception loop and expose a conservative browser-save import UI without overwriting the original save.

## v0.26.07.17.0137 - Continuous Tactical Walls and Traversable Breaches

Build `v0.26.07.17.0137_TACTICAL_CONTINUOUS_WALLS_AND_TRAVERSABLE_BREACHES_INDEX_ONLY_PATCH` preserves save format 4 while making incident-battle buildings read as connected structures and locking destroyed-wall traversal into the shared tactical movement contract.

Root causes:

- Three.js rendered every structural wall cell as one undersized box. Adjacent pieces did not touch, so building perimeters resembled isolated posts rather than solid walls.
- Offset hex rows do not share a simple north/south world axis. Enlarging one fixed box orientation could not reliably close both horizontal and diagonal neighbor gaps.
- Structural destruction already produced soft `breach-rubble` with `block: 0`, but there was no explicit regression test proving every tactical mover accepted that opening.

Implemented changes:

- Added `tacticalConnectedStructuralWalls`, using the existing cover-cell index and at most six neighbor lookups per visible structural cell.
- Three.js walls now render a larger central joint plus one canonical center-to-center bridge for each adjacent wall, window, or partition belonging to the same building.
- Bridge direction follows the actual shared offset-hex world coordinates, so straight runs and corners meet without assuming a square-grid axis.
- Door cells have no structural cover and therefore remain open. Destroyed segments become soft rubble and are excluded from the connector set, causing adjacent bridges to disappear and leaving a visible breach.
- Intact wall HP, cover, line of sight, and collision rules are unchanged.
- Added Build Health coverage proving an intact wall blocks the human reachable-cell flood, breached rubble enters it, alien `stepToward` selects it, and a panicked civilian uses it when it is the only available escape cell.

Performance and compatibility:

- No full-map scan, per-cell pathfinding pass, lighting work, or save field was added.
- Connector discovery is bounded to six indexed lookups per rendered wall and creates one bridge per unique visible neighboring pair.
- Safe 2D remains the default. Both battle views continue consuming the same cover HP, breach state, and movement rules.

Verification completed:

- Static app-script parsing passed for all six embedded scripts.
- `node --check tools/check-aegis-build.cjs`, `node tools/check-aegis-build.cjs`, and `git diff --check` passed for build 0137.
- Browser Build Health passed `272/272`, including `Continuous tactical walls open traversable breaches for every unit type`.
- Localhost browser smoke confirmed the 0137 start screen, first-base selection, fresh Geoscape, six-soldier response setup, mission confirmation, Skyranger travel, and 64x64 safe-2D tactical launch.
- The practical mission completed three End Turn cycles, switched to Three.js, and handed the same live turn-4 state to AI Command. Playback reached frame 23 mission success without resetting the battlefield.
- The revealed Wilderness Ranger Outpost rendered as a continuous joined wall run with a clear doorway interruption in Three.js Performance mode.

Manual validation still required:

- Inspect Urban and Small Town building perimeters in Three.js Near/Close views and confirm straight runs, corners, windows, partitions, and doors all read naturally.
- Shoot through a wall segment and confirm the joined wall visibly opens at that cell while rubble remains.
- Move a soldier through the breach, then observe an alien and both calm/escorted and panicked civilians route through the same opening.
- Repeat the affected high-threat Port Attack in safe 2D and Three.js Performance mode to confirm the bounded wall joins do not create a noticeable performance regression.

Next recommended patch: after live breach and Port validation, continue the bounded strategic roadmap slice `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, beginning with safe queued-order cancellation and destination-reservation release.

## v0.26.07.17.0136 - Tactical AI Mandatory Rescue and Extraction Progress

Build `v0.26.07.17.0136_TACTICAL_AI_MANDATORY_RESCUE_AND_EXTRACTION_PROGRESS_INDEX_ONLY_PATCH` preserves save format 4 and carries AI-controlled incident battles through the mandatory civilian rescue phase.

Root causes:

- The continuation resolver's main loop required at least one living alien. AI takeover after area security did not run any rescue turn, and killing the final alien inside the resolver broke out before the next rescue turn.
- AI rescue duty considered only revealed civilians even after the battlefield was secure, so an achievable mandatory objective could remain unfinished with hidden survivors.
- Escort AI selected the nearest ramp cell every step rather than the deepest rear-ramp cell, encouraging edge oscillation instead of leading the single-file chain through the extraction lane.
- Resolver success checked only alien elimination and surviving soldiers. It did not share the manual tactical `canResolveVictory` rescue contract, and the generic failure branch would wipe the squad if success were simply gated without separating area security from squad defeat.

Implemented changes:

- Added shared `tacticalAiRescueProgress`, `tacticalAiShouldContinueRescue`, and `tacticalAiMissionResolution` helpers around the existing civilian objective contract.
- Inherited AI continues for a maximum of 36 bounded exchanges while combat or an achievable mandatory rescue remains unresolved. Normal generated simulations retain their existing 24-round cap.
- Once no aliens remain, AI enters an area-secure sweep. Hidden living civilians become eligible search targets, are revealed on contact, and then use the existing 8-TU contact, panic recovery, four-follower capacity, and four-step movement rules.
- Each available rescuer claims a distinct civilian for the current turn. Existing escorts retain rescue duty and move toward the deepest Skyranger ramp cell so followers traverse extraction cells in order.
- Secure-rescue playback frames report `rescued/required` progress and continue driving the existing action camera and soldier dialogue paths.
- Final AI success now requires both area security and `canResolveVictory`. If the bounded extraction phase expires while rescue remains achievable, surviving soldiers are preserved and the result is reported as an incomplete rescue rather than a false squad wipe.
- Added deterministic Build Health coverage beginning with zero living aliens and one hidden mandatory civilian, then verifying sweep contact, escort, ramp extraction, survivor preservation, final mission success, and the lightweight incomplete-rescue resolution contract.

Performance and compatibility:

- No full-map visibility scan, local-light work, per-cell destination pathfinding, renderer fork, or save-format field was added.
- Rescue work remains bounded to the small unit list, at most six soldiers, four followers per escort, four movement steps per exchange, and 36 inherited exchanges.
- Safe 2D remains the default and the same unit/civilian frames continue feeding both tactical playback views.

Verification completed:

- Static app-script parsing passed for all six embedded scripts during implementation.
- `node --check tools/check-aegis-build.cjs` and `node tools/check-aegis-build.cjs` passed for build 0136.
- Browser Build Health passed `271/271`, including `AI mandatory rescue phase searches escorts and extracts before resolution`.
- Localhost browser smoke confirmed the 0136 start screen, first-base selection, fresh-campaign Geoscape, squad assignment, mission confirmation, and Skyranger arrival.
- A fresh six-soldier Red River Signal safe-2D mission handed its live frame to AI Command. Tactical-map playback began at `AI inherited round 1`, advanced through 11 preserved-state frames, and reached mission success.
- Browser diagnostics contained no application errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Hand AI Command a mandatory rescue incident after the final alien is dead. Confirm it searches for unrevealed survivors, makes contact, and extracts the required number before victory.
- Let AI kill the final alien while it already has one to four followers. Confirm the exact chain continues through the rear ramp without overlap or a map reset.
- Confirm secure-rescue playback labels, camera movement, and soldier rescue chatter remain understandable through the transition.
- Repeat the affected high-threat Port Attack in safe 2D and confirm the inherited 36-exchange ceiling does not create a noticeable performance regression.

Next recommended patch: validate the live AI rescue transition, then continue the next bounded strategic slice, `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`, beginning with safe queued-order cancellation and destination-reservation release.

## v0.26.07.17.0135 - Strategic Alert Screen Continuity and Secure Rescue Phase

Build `v0.26.07.17.0135_STRATEGIC_ALERT_SCREEN_CONTINUITY_AND_RESCUE_PHASE_INDEX_ONLY_PATCH` preserves save format 4, prevents strategic alert choices from replacing the active command screen, and advances the next bounded civilian-objective roadmap slice.

Root causes:

- `resolveTimeSpeedPrompt` treated every UFO prompt as a Geoscape navigation request. Choosing any prompt speed called `setTab("geoscape")`, replacing Base, Soldiers, Research, Workshop, Missions, or a still-active battlefield even though the player had work in progress there.
- Tactical victory resolved immediately when the final alien was removed. A mandatory rescue objective could therefore end before the player escorted the required civilians to the Skyranger ramp.

Implemented changes:

- `promptResolutionTargetTab` now makes UFO and personnel time prompts screen-neutral. Outside battle, the selected Geoscape speed starts immediately without changing the active command section.
- Speed choices made during tactical combat are stored as a deferred post-battle setting. The strategic clock stays stopped until tactical ownership ends, then resumes at the selected speed or remains paused when Pause was selected.
- Tactical alert copy and button labels state that the selection applies after battle, removing ambiguity without adding debug UI.
- Added `tacticalCivilianObjectiveProgress` to derive required, rescued, active, possible, complete, impossible, and rescue-phase state in one bounded calculation.
- When the last alien falls and a mandatory rescue remains achievable, End Turn refreshes the human rescue turn instead of resolving victory. Completed, optional, or impossible objectives continue to resolve normally.
- Added objective-panel progress text, a `Refresh Rescue Turn` command label, and deterministic Build Health rows for command-screen continuity, tactical deferred speed, and civilian rescue-phase completion rules.

Verification completed:

- Static app-script parsing passed after implementation.
- `node tools/check-aegis-build.cjs` passed for build 0135.
- Localhost browser smoke confirmed the 0135 start screen, fresh-campaign first-base flow, and main Geoscape.
- Browser Build Health passed `270/270`, including `UFO alert speed selection retains the active command screen` and `Mandatory civilian objectives continue through a bounded secure rescue phase`.
- A fresh six-soldier Red River Signal mission launched on the live 64 x 64 safe-2D battlefield. Soldier selection and movement highlighting remained responsive.
- Three End Turn cycles completed with control returning to the human turn each time; all six soldiers remained active and alien reveals advanced from zero to two.
- Browser diagnostics contained no application errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Trigger a UFO prompt from several non-Geoscape command sections and confirm every speed choice retains the active section while strategic time advances normally.
- Reproduce the reported UFO prompt from the affected in-progress save and confirm choosing each desired post-battle speed never changes the active battlefield state.
- Finish that battle and confirm the deferred Geoscape speed starts only after tactical ownership ends.
- Enter the secure rescue phase in a mandatory civilian incident, extract enough followers at the Skyranger ramp, and confirm victory appears at the requirement boundary.
- Confirm a mandatory requirement made impossible by civilian losses does not trap the battle.

Next recommended patch: continue the next safest bounded roadmap item after the alert transition and secure-rescue flow pass hands-on validation.

## v0.26.07.17.0134 - Shared Cell Gradient and Seamless Three.js Layout

Build `v0.26.07.17.0134_THREEJS_SHARED_CELL_GRADIENT_AND_SEAMLESS_LAYOUT_INDEX_ONLY_PATCH` preserves save format 4 and corrects the remaining Urban District 2D/3D color and placement mismatch.

Root causes:

- The 2D battlefield's pointy hex is intentionally drawn inside a square cell. Its rows advance by 0.755 cell and odd rows shift by half a cell. Build 0133 incorrectly treated the board as a regular pointy-hex grid with `sqrt(3) x radius` horizontal and `1.5 x radius` vertical center spacing.
- Build 0133 reduced each 2D `base` and `accent` gradient to one midpoint color in Three.js. Similar Urban grays collapsed visually, and the richer 2D road, lane, lot, plaza, and building-floor treatment did not carry across.
- Mathematically touching polygon edges still exposed the clear/background color at antialiased three-cell junctions.

Implemented changes:

- Added `tacticalCellVisual` as the shared terrain/fog descriptor used by both `tacticalCellStyle` and `tacticalThreeGroundPalette`.
- Centralized the 0.755 row step and 0.5 odd-row offset. The 2D rows, 2D shot overlay, Three.js world coordinates, and geometry tests now consume those constants.
- Replaced the regular cylinder floor with a flat custom buffer geometry whose square bounds and 25/75-percent shoulders match the 2D CSS clip polygon.
- Replaced midpoint-only materials with small cached canvas gradients using each cell palette's exact base/accent pair. Matching palettes remain grouped into bounded instanced batches and retain instance picking.
- Added a single slightly larger instanced underlay below the colored cells so antialiasing cannot expose black triangular holes. This adds one bounded draw call rather than per-cell DOM or mesh work.
- Added Build Health and checker seams for shared Urban palette inputs, exact 2D/3D cell-center math, custom footprints, texture cleanup, and the seam-underlay budget.

Verification completed:

- Static app-script parsing passed.
- `node tools/check-aegis-build.cjs` passed for build 0134.
- Browser smoke confirmed the 0134 start screen, first-base selection, and fresh-campaign Geoscape.
- Browser Build Health passed `268/268`, including all three new 2D/3D parity rows.
- A fresh six-soldier Red River Signal mission launched on the live 64 x 64 Wilderness battlefield.
- Matched live 2D and Three.js views showed the same orange path, dark unexplored field, bright green clearing, gray stone strip, vegetation, soldiers, and Skyranger regions.
- Performance-mode Three.js rendered the new gradient palette and custom footprint at Near and Close zoom without repeating black triangular junction gaps.
- Three.js picking selected Maia, displayed 164 reachable cells, and moved her to a sampled reachable ground hex for 8 TU, confirming instanced cell picking still maps to the authoritative tactical coordinate.
- Three End Turn cycles completed with control returning to the human turn each time.
- Browser diagnostics contained no application or WebGL errors; the only warning was the existing Tailwind CDN development notice.

Manual validation still required:

- Compare the same saved Urban District incident in 2D and 3D at Near and Close zoom, paying particular attention to the tan center-right region, dark terrain bands, buildings, Skyranger, and row-edge cells shown in the supplied screenshots. The browser verification used a fresh Wilderness mission because the affected save was not present in the isolated test session.
- Repeat on the affected high-threat Port Attack in Performance mode and watch for turn-time regression.

Next recommended patch: resume the next bounded roadmap gameplay item after matched Urban and Port Attack hands-on confirmation.

## v0.26.07.16.0133 - Three.js Terrain Palette and Hex Alignment

Build `v0.26.07.16.0133_THREEJS_TERRAIN_PALETTE_AND_HEX_ALIGNMENT_INDEX_ONLY_PATCH` preserves save format 4 and corrects the two isometric-ground regressions shown in matched 2D and 3D screenshots.

Root causes:

- Build 0132 deliberately replaced unreliable per-instance floor colors with one explicit biome material. That prevented black ground but flattened every procedural terrain region into one color.
- The tactical grid uses pointy-top odd-row coordinates with `sqrt(3) x radius` horizontal spacing and `1.5 x radius` vertical spacing. The Three.js cylinder used a 30-degree start angle, producing a flat-top hex against pointy-top placement math and leaving repeating triangular holes.

Implemented changes:

- Each 3D cell now receives the same deterministic `tacticalTerrainForCell` base/accent pair used by 2D. The representative 3D material color is the midpoint of those two colors.
- Cells with matching terrain colors are grouped into explicit-material `InstancedMesh` batches. This avoids per-cell meshes and the GPU-dependent per-instance color path while bounding ground batches to 24.
- Unexplored and explored-but-unseen ground retain tactical dimming; AI playback and resolved battles reveal the underlying terrain palette consistently.
- The hex cylinder now starts at zero radians, matching the pointy-top tactical coordinate system. A 0.1% radius overlap suppresses subpixel cracks without changing cell centers or picking.
- Exact per-instance picking remains attached to every palette batch, and tactical simulation, cover, movement, visibility, LOS, civilians, AI, and saves are unchanged.
- Added Build Health and checker seams for palette variation, 2D palette sourcing, pointy-top geometry, coordinate spacing, and bounded palette batching.

Verification completed:

- Static app-script parsing passed after the renderer rewrite.
- `node tools/check-aegis-build.cjs` passed for build 0133.
- Browser smoke confirmed the 0133 start screen, first-base selection, and fresh-campaign Geoscape.
- Browser Build Health passed `267/267`, including both new terrain-palette and pointy-hex rows.
- A fresh six-soldier Red River Signal mission launched on the 64 x 64 Wilderness battlefield.
- Live close-zoom 2D and 3D screenshots showed the same orange path, green vegetation, gray stone/road, bright grass, dark scrub, and unexplored regions in the same generated battlefield.
- Quality and Performance isometric modes both rendered varied terrain with pointy hex edges meeting cleanly and without the previous repeating triangular holes.
- Screenshot pixel analysis measured 350 quantized color buckets and 3,851 non-dark terrain-color samples in the isometric battle view.
- Three End Turn cycles completed with control returning to the player each time.
- AI inherited the live round-four battlefield, reached frame `21/21`, and produced a fully revealed tactical victory map with blue stream, orange path/dry ground, multiple green terrain families, gray stone/road, brown ground, and building areas.
- Browser diagnostics contained no application or WebGL errors; the only console entry was the existing Tailwind CDN development warning.

Manual validation still required:

- Repeat the 2D/3D comparison on Farmland, Small Town, and Urban District maps, including Performance mode.
- Inspect long animated battles for any rare overlap flicker at mixed-color palette boundaries; none appeared in the tested Wilderness mission.
- Re-test the affected high-threat Port Attack because ground draw calls rise from one biome batch to a bounded terrain-palette set.

Subsequent result: the supplied Urban District screenshots showed that 0133's Wilderness verification was insufficient. Urban colors remained visually flattened and the regular-hex Three.js footprint did not match the square-bounded 2D cell layout. Build 0134 supersedes those two implementation assumptions while retaining the verified instancing and picking recovery.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after cross-biome 3D palette/alignment and Port performance confirmation.

## v0.26.07.15.0132 - Computer Voice, Soldier Static, Transition Gate, and 3D Terrain Color

Build `v0.26.07.15.0132_COMPUTER_VOICE_STATIC_TRANSITION_AND_3D_TERRAIN_COLOR_INDEX_ONLY_PATCH` preserves save format 4 and improves recorded transmission character, post-battle voice ordering, and isometric environment readability.

Root causes:

- The base-computer effect was intentionally light, so the original recording still sounded mostly natural instead of like a 1980s command computer.
- Soldier clips bypassed the strategic FIFO. Their asynchronous fetch/decode could still be active when the first return-flight aircraft phrase entered the queue, allowing the pilot to begin before the final tactical recording actually ended.
- Three.js terrain used dark procedural 2D colors as per-instance tints. In the tested browser/GPU path those instance colors rendered effectively black, and scene fog darkened them further.

Implemented changes:

- Base-computer recordings now use 18-step wave shaping, 31 Hz square modulation, stronger compression, and a bounded 22 ms parallel metallic delay.
- Soldier recordings receive 75 ms of band-limited lead static and 90 ms of trailing static generated through Web Audio; original recordings remain unmodified.
- Soldier playback now tracks a Promise through decode, playback, and trailing static. Every queued computer or aircraft task awaits the latest soldier tail before starting.
- Strategic computer and aircraft clips retain the existing FIFO and clip-end gap, while tactical soldier lines remain immediate and cooldown-limited.
- The single Three.js instanced ground mesh now uses explicit biome material colors: green Wilderness, ochre Farmland, muted green-gray Small Town, and gray Urban District.
- Ground is unlit and excluded from scene fog so biome color remains visible; models, props, effects, LOS, exploration, and fog-of-war visibility rules are unchanged.
- Removed per-cell instance-color writes from the 3D ground hot path while preserving one batched ground mesh and exact instance picking.
- Added three Build Health rows and checker seams for computer metallic processing, soldier static/transition gating, and biome ground materials.

Verification completed:

- Static app-script parsing passed.
- `node tools/check-aegis-build.cjs` passed for build 0132.
- Browser smoke confirmed the 0132 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `266/266` after a clean reload.
- A fresh six-soldier Red River Signal mission launched on the 64 x 64 tactical battlefield.
- The Wilderness `3D Iso` view rendered a clearly green ground plane instead of black while retaining the cohesive Skyranger, soldiers, props, and one instanced ground mesh.
- AI inherited the live battlefield, reached its final playback frame at accelerated speed, and returned directly to Geoscape.
- The transition queue was allowed seven seconds to drain. No runtime exception or recorded-dialogue fallback warning appeared; the only console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Judge base-computer intelligibility and the intended 1980s computer character by ear.
- Confirm lead/trailing static is audible but does not clip speech or become distracting across varied soldier takes and Sound Effects volume levels.
- Confirm the final tactical soldier recording and static tail fully end before the first pilot phrase on incident return.
- Visually confirm Farmland, Small Town, and Urban District isometric ground colors on the affected machine, including Performance mode.
- Re-test a live spotted-civilian rescue, reload/fire-mode state changes, and the affected high-threat Port Attack.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the audio listening pass, cross-biome 3D check, live civilian rescue, and Port Attack performance check.

## v0.26.07.15.0131 - AI Tactical Soldier Dialogue and Geoscape Voice Queue

Build `v0.26.07.15.0131_AI_TACTICAL_SOLDIER_DIALOGUE_AND_GEOSCAPE_VOICE_QUEUE_INDEX_ONLY_PATCH` preserves save format 4 and closes the remaining dialogue gaps in AI tactical playback and strategic announcement ordering.

Root causes:

- Manual tactical actions called the recorded soldier dialogue system directly, but AI playback frames only emitted weapon, impact, and fall effects. The AI simulation retained soldier identities and action data without translating those frames into voice cues.
- Computer and aircraft categories used independent cooldown clocks. Rapid strategic events could therefore begin simultaneously, and later same-category phrases could be discarded instead of waiting their turn.

Implemented changes:

- AI playback derives at most one soldier cue per frame, prioritizing final-contact victory, a human kill, a wounded soldier, a human shot or miss, then squad movement.
- Frame coordinates identify the acting or wounded soldier, and the preserved campaign soldier record selects the appropriate recorded personality style.
- Tactical soldier clips remain immediate and cooldown-limited so accelerated battle playback cannot create a stale queue of old combat lines.
- All non-soldier recordings share a FIFO Promise chain. Computer and aircraft phrases wait for the preceding clip to end plus a 120 ms gap before beginning.
- Explicit phrase delays remain intact but begin only after earlier queued announcements finish, preserving sequences such as `all_aboard` followed by `returning_to_base`.
- Missing or failed clips release the queue and retain synthesized fallback behavior instead of blocking later announcements.
- Build Health covers kill, wound, movement, and final-contact AI cue selection plus strategic queue routing and soldier exclusion.

Verification completed:

- Static parsing passed for all 6 inline app scripts.
- `node tools/check-aegis-build.cjs` passed for build 0131.
- Browser smoke confirmed the 0131 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `263/263`.
- A six-soldier Red River Signal mission launched on the 64 x 64 safe-2D battlefield. AI inherited the live battle, completed all 17 playback frames at 150% speed, and reached tactical victory.
- The result returned to Geoscape and exercised the paired `all_aboard` / `returning_to_base` path plus landing progression without application errors or recorded-dialogue fallback warnings.
- The only browser console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Listen through a complete AI-led incident and confirm soldier lines are frequent enough to add character without talking over important battle sounds.
- Trigger two or more computer/aircraft announcements close together and confirm every phrase plays once, in event order, with a natural gap and no overlap.
- Re-test an AI-led spotted-civilian rescue and confirm movement/rescue chatter remains appropriate.
- Re-test the affected high-threat Port Attack for performance and audio pacing.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the AI chatter and strategic queue listening pass plus live civilian rescue and Port Attack checks.

## v0.26.07.15.0130 - Tactical AI Camera and Dialogue Transmission FX

Build `v0.26.07.15.0130_TACTICAL_AI_CAMERA_AND_DIALOGUE_TRANSMISSION_FX_INDEX_ONLY_PATCH` preserves save format 4 and adds action-aware AI tactical-map framing plus category-specific processing for recorded command and aircraft voices.

Root causes:

- AI tactical-map takeover preserved the battlefield state correctly, but later playback frames did not consistently update the watch camera. The simulation advanced while the viewport remained near its initial squad position.
- Recorded dialogue buffers were routed cleanly into the Sound Effects bus. That preserved the performances, but base-computer and aircraft-pilot clips had no source-specific transmission character.

Implemented changes:

- Every AI playback frame derives a bounded camera anchor from rescued civilians, casualties, moved soldiers, moved civilians, moved aliens, or the first shot midpoint, in that gameplay-first order.
- Shot playback re-centers on the shooter/target midpoint before the effect runs. Quiet frames fall back to the center of the living squad, then other living units.
- AI takeover continues from the inherited units, cover damage, explored cells, round, and Skyranger state; camera following does not regenerate the map or alter tactical outcomes.
- Base-computer recordings use high-pass and low-pass filtering, stepped wave shaping, compression, and light modulation for a constrained 1980s command-computer sound.
- Aircraft recordings use a narrower band and stronger modulation for radio-transmission character. Soldier and other categories retain clean recorded playback.
- All recorded voices remain attached to the existing Sound Effects gain, volume, and mute controls.
- Build Health now covers deterministic movement, shot, rescue, and fallback camera anchors plus distinct computer and aircraft processing profiles.

Verification completed:

- Static parsing passed for all 6 inline app scripts.
- `node tools/check-aegis-build.cjs` passed for build 0130.
- Browser smoke confirmed the 0130 start screen and a fresh-campaign Geoscape.
- Browser Build Health passed `261/261` after the final helper-scope correction.
- A six-soldier Red River Signal mission launched on the 64 x 64 safe-2D battlefield. AI inherited round 1 and advanced through playback frames 1-5 without resetting the map.
- Near-zoom screenshots confirmed the viewport moved from the deployment area to hostile action and back to the advancing squad as playback frames changed.
- Aircraft launch, touchdown, and ramp dialogue events ran after the corrected reload without application errors or recorded-dialogue fallback warnings. The only fresh console warning was the existing Tailwind CDN development warning.

Manual validation still required:

- Listen to several base alerts and confirm the computer treatment is intelligible, appropriately synthetic, and not too harsh at normal Sound Effects volume.
- Listen to launch, touchdown, ramp, return, and interceptor pilot clips and confirm the radio treatment is distinct without obscuring the words.
- Watch a complete AI-led incident, especially shots, casualties, and civilian rescue, and confirm the camera changes feel helpful rather than too frequent.
- Re-test the affected high-threat Port Attack for turn performance and camera pacing.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the transmission-listening pass plus live AI rescue and Port Attack checks.

## v0.26.07.14.0129 - Recorded Command and Tactical Dialogue Integration

Build `v0.26.07.14.0129_RECORDED_COMMAND_AND_TACTICAL_DIALOGUE_INTEGRATION_AUDIO_ASSET_PATCH` preserves save format 4 and incorporates the user-recorded command, aircraft, and soldier performances without adding tactical simulation work.

Implemented scope:

- Inventoried 105 mono, 48 kHz, 16-bit PCM WAV source recordings totaling about 22.5 minutes. The original files remain unedited.
- Added `tools/build-dialogue-manifest.cjs`, which detects silence-separated takes and emits `assets/audio/dialogue/manifest.js`. The current manifest contains 87 semantic events and 326 usable takes; every spoken file resolves to three or four alternatives.
- Recorded files are fetched and decoded only when their event first occurs, then cached for reuse. Playback avoids immediately repeating the same take and rate-limits computer, aircraft, and soldier channels independently.
- Soldier acknowledgements select aggressive-hotshot, grim, nervous-but-determined, or steady-professional delivery from the soldier's existing personality trait. Missing style-specific combat phrases fall back to the steady-professional recording.
- Tactical hooks cover selection, movement, reload, shot outcomes, wounds/armor hits, End Turn, and victory. Existing synthesized shot, impact, click, and Skyranger effects remain active underneath and act as a safe fallback.
- Strategic hooks cover save/load, research/manufacturing/construction/transfer completion, personnel arrival, UFO/incident contact, mission outcome, council/base warnings where emitted, blocked funding/aircraft actions, Skyranger phases, and interceptor launch.
- No visibility, line-of-sight, lighting, pathfinding, civilian, AI, map generation, or 2D/3D tactical rule was changed. Save format remains 4.

Verification completed:

- `node tools/build-dialogue-manifest.cjs` completed with 105 recordings, 87 events, and 326 takes. `node --check` passed for the generator and checker.
- Static parsing passed for all 6 inline app scripts. `node tools/check-aegis-build.cjs` passed for build 0129 and independently validated recording count, source existence, take bounds, required events, and soldier styles.
- Localhost returned HTTP 200 for `index.html`, the generated dialogue manifest, and a representative encoded WAV URL.
- Browser Build Health passed 259/259, including `Recorded command aircraft and soldier dialogue uses segmented cached playback`.
- Browser smoke confirmed short version 0129, first-base setup, Geoscape load, a real Save action, six-soldier Red River Signal safe-2D launch, soldier selection, reload, one-hex movement, and three complete End Turn cycles.
- Final console inspection found no application errors and no `Recorded dialogue unavailable` fallback warnings. The only console entry was the existing Tailwind CDN warning.

Manual validation still required:

- Listen to several command, aircraft, and each soldier-style acknowledgement in normal play. Confirm the chosen take starts/ends cleanly and that speech volume sits comfortably over SFX and optional music.
- In tactical combat, sample selection, movement, reload, hit, miss, kill, wound, End Turn, and victory lines. Confirm cooldowns prevent chatter without making the squad feel silent.
- Launch and recover a Skyranger and perform an interceptor sortie. Confirm touchdown/ramp/return lines occur at natural moments and do not overlap awkwardly.
- Continue the outstanding spotted-civilian AI rescue and affected high-threat Port Attack tests from build 0128.

Remaining risks:

- Automated tests can prove files decode without fallback warnings, but cannot judge performance quality, trim feel, loudness, or whether a delivery emotionally matches the moment.
- The source recordings add about 124 MB to a complete build package. Runtime loading is lazy and cached, but first playback of each long source file still transfers that entire WAV.
- Several strategic alerts depend on the existing report wording; the checker covers current mappings, but future text changes should preserve or explicitly update their semantic audio hooks.
- One pre-campaign browser remount reported 256/259 because three older procedural tactical-map rows rolled false; the immediate final rerun passed 259/259. Those pre-existing randomized self-tests should eventually use fixed fixtures so Build Health cannot flicker between reloads.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the dialogue listening pass plus the live AI rescue and Port Attack checks.

## v0.26.07.14.0128 - Tactical AI Continuation and Civilian Rescue Priority

Build `v0.26.07.14.0128_TACTICAL_AI_CONTINUATION_AND_CIVILIAN_RESCUE_PRIORITY_INDEX_ONLY_PATCH` preserves save format 4 and fixes manual-to-AI tactical handoff while adding bounded civilian rescue priorities to the continuation AI.

Gameplay scope implemented:

- AI Command now clones the current tactical units, cover state, round, explored cells, and Skyranger hull/ramp placement before invoking the mission resolver. It no longer asks the resolver to create a fresh deployment.
- Continuation soldiers preserve identity, position, facing, HP, TU, ammunition, and existing casualties. Aliens preserve identity, position, HP, reveal state, and casualties. Civilians preserve reveal, rescue, escort, formation, and panic state.
- Playback frames now carry civilians plus live HP, TU, and ammunition. Map playback applies those values instead of restoring pre-handoff values or dropping civilians from the unit array.
- AI rescue duty considers only living revealed civilians and existing revealed escorts. Hidden civilians remain unknown to the AI.
- Existing escorts move toward the current Skyranger ramp before their soldier performs combat actions. Available soldiers approach and contact the nearest revealed unescorted civilian, spending the existing 8 TU and using the existing repeated-contact chance for panic.
- Rescue movement reuses the existing single-file escort mover and remains bounded to six soldiers, four followers per soldier, and four soldier steps per exchange.
- Alien fire can select a visible civilian when one is exposed. Surviving civilian hits can trigger panic, and civilians whose escort dies can break and use the existing two-step line-of-sight panic movement and recovery rules.
- AI Command is disabled while a manual movement animation is active, preventing pending movement timers from racing the continuation snapshot.
- Extracted civilians remain rescued rather than being interpreted as fallen units during playback; they do not trigger death animations or sounds.

Performance and compatibility:

- Save format remains 4 because the continuation snapshot is transient tactical state and does not alter campaign-save structure.
- Normal instant simulations keep their existing generated-deployment behavior. The live-state branch is used only when AI inherits a manual tactical battle.
- Rescue decisions examine the small active unit lists and reuse indexed cover/visibility helpers. No full-map scan, per-cell pathfinding loop, local-light calculation, or 2D/3D state fork was added.
- Safe 2D remains the tactical default. Lighting remains removed from gameplay and render hot paths.

Verification completed:

- Static inline app-script parsing passed 6/6; `node --check tools\check-aegis-build.cjs` passed; `node tools\check-aegis-build.cjs` passed for build 0128.
- Localhost returned HTTP 200 and the start screen displayed short version 0128. A new checker seam now requires the short version to match the manifest build prefix.
- Browser Build Health passed 258/258, including `AI tactical handoff preserves the live battlefield and prioritizes spotted civilians`.
- A fresh campaign confirmed the North America first-base site, loaded the Geoscape, assigned six soldiers, and launched Red River Signal on the safe-2D 64 x 64 battlefield.
- Orin moved one hex toward the ramp and spent 4 TU. AI Command changed to disabled `Movement Active` during the animation and became available only after movement settled.
- Tactical Map handoff opened on `Frame 1/25: AI inherited round 1`, not a new `Contact confirmed` deployment. Playback reached Exchange 3A after three A/B exchanges without a tactical error banner.
- Final browser console inspection found no application errors. Build Health was rerun after the extracted-civilian playback correction and remained 258/258.

Manual validation still required:

- Reveal a civilian, leave them unescorted, then hand the battle to AI Command. Confirm an available soldier approaches, spends 8 TU on contact, and leads the civilian toward the existing rear ramp before taking combat actions.
- Hand off with one to four civilians already following a soldier. Confirm the exact chain, panic state, current positions, and extraction progress continue without overlap or a map reset.
- Hand off after damaging a soldier, spending ammunition/TU, killing an alien, and breaching structural cover. Confirm the first playback frame preserves each exact value and the breach remains passable.
- Let aliens threaten an AI-led civilian and kill an escort. Confirm panic, flight, recovery, and repeated contact feel appropriate during AI continuation.
- Repeat the affected high-threat Port Attack in safe 2D and confirm the inherited AI turns remain responsive.

Remaining risks:

- Build Health deterministically covers revealed-versus-hidden civilian priority, snapshot preservation, ramp extraction, and source seams, but a live spotted-civilian AI rescue was not reached during browser verification.
- The continuation resolver computes the remaining fight into playback frames up front. It preserves the inherited state but still uses the existing simulation AI combat model rather than replaying manual click-by-click tactical AI.
- Dense multi-escort cross-traffic and the exact high-threat Port Attack save remain the authoritative performance and interaction fixtures.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the live AI rescue and Port Attack checks.

## v0.26.07.14.0127 - Tactical Live Action State and Escort Route Feedback

Build `v0.26.07.14.0127_TACTICAL_LIVE_ACTION_STATE_AND_ESCORT_ROUTE_FEEDBACK_INDEX_ONLY_PATCH` preserves save format 4 and fixes stale tactical action state while completing the safest contained portion of `TACTICAL_CIVILIAN_ESCORT_STATUS_AND_EXTRACTION_ROUTE_FEEDBACK_INDEX_ONLY`.

Gameplay scope implemented:

- Reload, fire-mode selection, alien shots, and structural breach shots now resolve from an immediately current tactical unit and mode snapshot instead of a previous React render closure.
- Sequential actions cannot restore stale ammo or TU by mapping over an older unit array. Reload writes its updated unit to the live snapshot before the next click can resolve.
- Fire-mode selection updates the live mode before React completes its visual commit, so a Burst-to-Single switch uses Single's 14-TU cost and one-round profile on the next action.
- Selected soldiers now show an `Extraction Route` status with direct distance to the nearest rear-ramp hex and counts for assigned, following, forming, and held civilians.
- Escort feedback is derived from the existing four-civilian bounded chain and direct hex distance. It does not run pathfinding, scan the battlefield, or change escort outcomes.

Performance and compatibility:

- Save format remains 4 because tactical unit refs, selected fire mode, and escort-route summaries are transient manual-battle state.
- Port visibility indexing, one-pass movement reachability, lighting removal, safe-2D default, and 2D/Three.js parity remain unchanged.
- The route readout examines only the selected soldier, at most four active followers, and five Skyranger ramp cells.

Verification completed:

- Static inline app-script parsing passed 6/6; `node --check tools/check-aegis-build.cjs` passed; `node tools/check-aegis-build.cjs` passed for build 0127.
- Localhost returned HTTP 200, the start screen displayed build 0127, and browser Build Health passed 257/257.
- A fresh campaign reached first-base confirmation and the Geoscape. Range and ferry controls remained combined in the Operational Overlays section.
- A six-soldier Red River Signal mission launched in safe 2D on the 64 x 64 battlefield. Selecting Greta displayed `Ramp 3 hexes away` and `No civilians assigned`; movement consumed TU and updated ramp distance.
- Reload changed Greta from 55 to 37 TU with 12 rounds ready. Clicking Burst and then Single left Single visibly selected. Three End Turn cycles returned to human control with the selected soldier restored to full TU.
- Browser console inspection found no application errors; existing non-error browser advisories remain outside gameplay code.

Manual validation still required:

- Empty a ballistic magazine, reload, and immediately fire at a revealed alien or structural breach target. Confirm the restored ammunition is used and the shot does not report another reload requirement.
- With 14-23 TU remaining, click Burst, switch to Single, and immediately fire at a valid target. Confirm the shot succeeds at Single cost instead of reporting insufficient Burst TU.
- Escort civilians and confirm assigned/following/forming/held counts and ramp distance update through corners, blocked chains, panic, recovery, and extraction.
- Repeat the exact affected high-threat Port Attack in safe 2D for the authoritative performance check.

Remaining risks:

- Build Health covers zero-ammo reload state and the Burst-illegal/Single-legal threshold deterministically, but the exact target-click cadence still needs hands-on confirmation in a battle with a revealed valid target.
- Ramp distance is intentionally direct hex distance, not a promised traversable path length; blocked-route guidance remains future scope.
- The exact Port Attack save and dense multi-escort routes remain the authoritative performance and interaction fixtures.

Next recommended patch: `TACTICAL_ESCORT_EXTRACTION_PROGRESS_AND_RESCUE_OBJECTIVE_BALANCE_INDEX_ONLY`, after the reload/fire-mode target-click checks and escort-status playtest pass.

## v0.26.07.13.0126 - Escort Formation Collision and Panic Balance

Build `v0.26.07.13.0126_TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY_PATCH` preserves save format 4 and hardens the bounded civilian escort and panic systems introduced in build 0124.

Gameplay scope implemented:

- Escort chains now distinguish civilians still forming up from civilians joined to the single-file route. Newly contacted civilians can take bounded one-hex catch-up steps until they reach their predecessor's trail.
- Once joined, each civilian moves only into the exact hex vacated by the soldier or preceding follower. A link that cannot advance holds every follower behind it instead of compressing, overlapping, or cutting around the obstruction.
- Destination reservation includes every non-chain unit and each committed chain destination. The movement remains limited to one soldier and at most four followers, with no full-map path search.
- Civilian badges now distinguish `FORM`, `FOLLOW`, `HOLD`, and `PANIC` states in both tactical views through the shared unit glyph.
- Panicked civilians still move at most two hexes per alien turn, but candidate cells now rank fewer visible aliens ahead of raw distance. One indexed visibility context is reused for the bounded candidate checks.
- Panic balance is centralized and deterministic for tests: surviving civilian break chance is 65% after a hit and 20% after a miss; loss of an escort uses 75%; contact attempts remain 55%, 80%, then 95%; recovery out of sight is 55% on the first turn and reaches 95% by the third.
- Build Health controls now open on a normal click instead of pointer-down, preventing the newly mounted Close button from consuming the same click.

Performance and compatibility:

- Save format remains 4 because escort formation and panic state are transient to an active manual tactical battle.
- The optimization budget remains bounded to four followers, six neighboring cells per forming follower, and two panic steps. Panic candidate line-of-sight checks reuse one cover index per civilian move.
- Port visibility indexing, reachable-cell flood fill, lighting removal, safe-2D default, and the shared 2D/Three.js tactical state remain unchanged.

Verification checklist:

- Static app-script parsing passed 6/6 and `node tools\check-aegis-build.cjs` passed for build 0126; the checker also passed `node --check`.
- Browser Build Health passed 255/255, including `Escort chains reserve single-file cells and panic favors broken sightlines`.
- Localhost start screen displayed build 0126, first-base confirmation reached the Geoscape, and a six-soldier Red River Signal safe-2D mission launched on the 64 x 64 battlefield with 26 Skyranger hull cells and five passable ramp cells.
- Three End Turn cycles returned to human control in 575ms, 630ms, and 597ms without a runtime banner.
- Final browser console inspection found no errors. The only current-page messages were the existing Tailwind CDN production advisories emitted on page reload.

Manual validation still required:

- Contact two to four civilians from different sides of a soldier, walk several corners and a one-cell breach, and confirm `FORM` changes to `FOLLOW` without overlap. Block the chain and confirm trailing civilians display `HOLD` until the route clears.
- Walk the complete chain onto the visible rear ramp and confirm civilians extract in order while every vacated ramp cell remains traversable.
- Let aliens hit and miss escorted civilians, then kill an escort soldier. Confirm panic frequency feels fair, fleeing favors cells that break alien sightlines, and repeated 8-TU contact attempts can recover a panicked civilian.
- Repeat the exact affected high-threat Port Attack in safe 2D for the authoritative performance check.

Remaining risks:

- Collision and formation self-tests cover deterministic multi-follower movement and occupied neighboring cells, but dense player-created cross-traffic and multiple chains still need hands-on stress testing.
- Panic probabilities are intentionally conservative first-pass balance values and may need tuning after repeated real battles.
- The exact high-threat Port Attack save remains the authoritative performance case.

Next recommended patch: `TACTICAL_CIVILIAN_ESCORT_STATUS_AND_EXTRACTION_ROUTE_FEEDBACK_INDEX_ONLY`, after hands-on formation, ramp traversal, and panic-frequency validation.

## v0.26.07.13.0125 - Isometric Skyranger Single Craft and Ramp

Build `v0.26.07.13.0125_TACTICAL_ISOMETRIC_SKYRANGER_SINGLE_CRAFT_AND_RAMP_INDEX_ONLY_PATCH` preserves save format 4 and replaces the modular-looking isometric Skyranger hull with one cohesive aircraft and attached rear extraction ramp.

Visual scope implemented:

- Three.js no longer renders one box or panel for every Skyranger collision cell. Hull and ramp cover cells remain gameplay-only in the isometric renderer.
- One aligned `Skyranger` group now represents the complete transport with a continuous fuselage, lower hull, raised cabin, tapered nose, cockpit, wings, twin engines, tailplanes, vertical tail, rear cargo opening, and cargo floor.
- A single sloped rear ramp is visibly attached to the cargo opening. Ramp rails and transverse deck stripes make the civilian extraction route readable from the tactical camera.
- The craft uses the existing deterministic Skyranger placement and body direction, so the visual rear ramp remains aligned with the same passable extraction cells used by 2D, pathfinding, and civilian escort logic.
- The model uses one bounded group of fixed primitive meshes and adds no dynamic lights, animation loop, per-cell model generation, or save data.

Preserved behavior:

- Safe 2D keeps its multi-cell hull and ramp indicators for precise tactical path reading.
- Civilian escort capacity, breadcrumb following, panic, recovery, extraction rewards, and ramp-cell traversal are unchanged.
- Port visibility, indexed cover lookup, reachable-cell flood fill, lighting removal, and safe-2D default remain unchanged.

Verification checklist:

- Static app-script parsing passed 6/6.
- `node tools\check-aegis-build.cjs` passed for build 0125, and the checker passed `node --check`.
- Browser Build Health passed 254/254, including the cohesive Three.js craft and attached-ramp contract.
- The localhost start screen displayed build 0125, first-base confirmation reached the Geoscape, and a six-soldier 64 x 64 safe-2D mission launched with the unchanged 26-cell hull footprint and five passable ramp cells.
- Three.js Performance mode rendered a nonblank 648 x 640 canvas. Visual inspection at Near and Close zoom confirmed one continuous aircraft silhouette with cockpit, fuselage, wings, engines, tail, rear cargo opening, and one attached ramp facing the deployed soldiers.
- Three.js Quality mode rendered the same craft on a nonblank 800 x 750 canvas without a runtime error.
- Three End Turn cycles in isometric Close view returned to human control in 915ms, 856ms, and 841ms.
- Final browser console inspection found no errors. The only current-page message was the existing Tailwind CDN production advisory.

Manual validation still required:

- Inspect the Skyranger in Three.js Performance and Quality modes at Near and Close zoom. Confirm it reads as one aircraft rather than separate cover pieces.
- Walk a soldier and escorted civilians onto the rear ramp. Confirm the visible ramp aligns with the cyan extraction cells and civilians extract normally.
- Repeat the exact affected high-threat Port Attack in safe 2D to retain authoritative performance validation.

Remaining risks:

- The fixed primitive model is intentionally gameplay-readable rather than final aircraft art; proportions and colors may still benefit from art-direction tuning.
- Wing overhang is visual and does not expand the underlying five-hex-wide collision footprint.
- The exact high-threat Port Attack save remains the authoritative performance case.

Next recommended patch: `TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY`, after hands-on ramp alignment and multi-civilian escort validation.

## v0.26.07.13.0124 - Tactical Skyranger Ramp, Civilian Escorts, and Panic

Build `v0.26.07.13.0124_TACTICAL_SKYRANGER_RAMP_CIVILIAN_ESCORT_AND_PANIC_INDEX_ONLY_PATCH` preserves save format 4 and replaces instant civilian extraction with physical escort gameplay tied to a deployed Skyranger.

Gameplay scope implemented:

- Tactical deployment clears a deterministic five-hex-wide Skyranger footprint near the squad, adds indestructible hull cover, and leaves a visible five-cell centerline rear ramp/corridor. Soldiers deploy just outside the ramp as if they disembarked from the transport.
- Civilian extraction occurs only when a following civilian physically enters a Skyranger ramp cell. Rescued civilians retain living HP, leave occupancy and both renderers, and no longer intercept cell clicks or stale movement highlighting.
- Contacting an adjacent revealed civilian costs 8 TU and assigns them to the selected soldier. Each soldier may lead up to four living civilians.
- Escort followers advance through the cells vacated by the soldier and preceding followers. The update touches only that soldier's escort chain and keeps civilians in single file without full-map path searches.
- Alien fire can break a surviving civilian from their escort. Losing a soldier escort gives each follower a chance to panic and detach.
- Panicked civilians make at most two bounded neighbor steps per alien turn, choosing cells that increase distance from currently visible alien threats. Once no threat remains visible they have an increasing chance to recover.
- A soldier can retry contact with a panicked civilian for 8 TU. The first attempt can fail, while later attempts receive an increasing success chance.
- Safe 2D and Three.js both render the multi-cell Skyranger hull/ramp and civilian state feedback. Following civilians are cyan and marked `FOLLOW`; panicked civilians are red and marked `PANIC` without using the casualty state.
- The Geoscape now presents range rings and aircraft ferry-route controls inside one `Operational Overlays` section while preserving the independent Shortwave, Longwave, Interceptor, Skyranger, Show Both, and hide controls.

Performance and compatibility:

- Save format remains 4 because Skyranger placement, escort chains, and panic are transient manual-battle state.
- Port visibility, indexed cover lookup, shared reachable-cell flood fill, and lighting removal remain unchanged.
- Panic movement examines at most six neighbors for two steps per panicked civilian. Escort movement updates at most four followers for the moving soldier.

Verification checklist:

- Static app-script parsing passed 6/6 after the final Geoscape merge.
- `node tools\check-aegis-build.cjs` passed for build 0124, including the new escort and merged-overlay rows; the checker itself also passed `node --check`.
- Browser Build Health passed 253/253.
- The localhost start screen displayed build 0124, first-base confirmation reached the Geoscape, and the merged `Operational Overlays` section retained all seven range/ferry controls. Activating Shortwave reported one visible range ring; activating Show Both reported the combined Interceptor and Skyranger network without runtime errors.
- A six-soldier 64 x 64 safe-2D Red River Signal mission generated 26 visible Skyranger hull cells, five passable ramp cells, and two living civilians. Three End Turn cycles returned to human control in 684ms, 684ms, and 656ms without a runtime banner.
- Three.js Performance mode rendered the shared Skyranger state on a nonblank 648 x 640 canvas.
- Final browser console inspection found no errors. The only current-page message was the existing Tailwind CDN production advisory.

Manual validation still required:

- Contact one civilian and move through several turns and corners. Confirm the civilian follows the soldier's vacated cells without blocking the soldier or overlapping another follower.
- Build a four-civilian chain, walk the soldier up the Skyranger ramp, and confirm the civilians extract in order while the ramp cells remain traversable.
- Let aliens fire at an escorted civilian and kill an escort soldier in separate tests. Confirm panic can occur, fleeing increases distance from visible aliens, and civilians stop fleeing before recovering once the threat is no longer visible.
- Retry contact with a panicked civilian until they follow, confirming each attempt costs 8 TU and that an initial refusal remains possible.
- Load the affected campaign without overwriting it and run the exact high-threat Port Attack in safe 2D through selection, movement highlights, escort movement, and at least three End Turn cycles.

Remaining risks:

- The exact high-threat Port Attack save remains the authoritative performance case.
- Escort path behavior around tight one-cell breaches and multiple independently moving escort chains needs hands-on stress testing.
- Panic and recovery percentages are first-pass values and may need pacing adjustments after campaign play.

Next recommended patch: `TACTICAL_ESCORT_FORMATION_COLLISION_AND_PANIC_BALANCE_INDEX_ONLY`, after manual validation of multi-civilian corners, ramp entry, and panic recovery. Fire/smoke and building power-loss remain deferred while lighting is parked.

## v0.26.07.13.0123 - Tactical Rescue State, Rewards, and Objective Variants

Build `v0.26.07.13.0123_TACTICAL_RESCUE_STATE_REWARDS_AND_OBJECTIVES_INDEX_ONLY_PATCH` preserves save format 4, fixes extracted-civilian state rendering, and implements the safest contained portion of the rescue outcome and mission-objective roadmap item.

Gameplay scope implemented:

- Rescuing a civilian now records a living `rescued`/`extracted` state instead of setting HP to zero. Extracted civilians leave both tactical renderers, no longer occupy movement cells, and cannot be selected or targeted as battlefield casualties.
- Civilian casualty counts remain based on actual zero HP without the rescued flag, keeping rescued and killed outcomes separate.
- Terror and abduction incidents use a Critical Rescue objective requiring two thirds of civilians, paying $40k per extraction plus a $100k completion bonus after primary mission success.
- Port, urban, farmstead, harvest, prairie, and town incidents use an Area Evacuation objective requiring half of civilians, paying $30k per extraction plus a $60k completion bonus after primary mission success.
- Other incident types keep civilian rescue optional and pay $25k per extraction. Rescue earnings remain available after an abort, but objective completion bonuses require primary mission success.
- The tactical objective panel reports the mission-intent requirement and current rescue bonus. Manual mission results carry the civilian outcome into campaign funds, mission summaries, logs, and stored mission reports.
- Primary tactical victory rules remain unchanged: civilian objectives are secondary and cannot convert an alien-elimination failure into mission success.

Verification checklist:

- Static app-script parsing passed 6/6.
- `node tools\check-aegis-build.cjs` passed, including the build-label seam and required Build Health rows.
- Browser Build Health passed 251/251, including the rescue extraction-state and mission-intent reward row.
- Localhost start screen displayed build 0123 and a new campaign loaded through first-base placement into the Geoscape.
- A six-soldier 64 x 64 safe-2D Red River Signal mission launched with two living civilians and the Civilian Assistance objective visible. Three End Turn cycles returned to human control in 731ms, 770ms, and 734ms without a runtime banner; all six soldiers and both awaiting-rescue civilians remained active.
- Browser console inspection found no errors. The only warnings were the existing Tailwind CDN production advisory.

Manual validation still required:

- Player validation confirmed that a revealed adjacent civilian disappeared without turning red, spent 8 TU, and incremented the extracted counter. The vacated cell remained non-traversable because the click occupant lookup and reachable-cell memo dependency still retained stale civilian state; build 0124 supersedes instant extraction and fixes both stale boundaries.
- Complete and abort separate manual missions after extracting civilians. Confirm per-rescue funding is credited in both cases and the requirement completion bonus is credited only after primary victory.
- Load the affected campaign without overwriting it and run the exact high-threat Port Attack in safe 2D through selection, movement highlighting, rescue interaction if available, and at least three End Turn cycles.

Remaining risks:

- Auto-resolved/classic missions do not simulate the manual civilian layer, so they retain the base mission reward with no rescue bonus.
- The exact high-threat Port Attack save remains the authoritative performance case and still requires player-side validation.
- Reward amounts and rescue requirement ratios are deliberately conservative first-pass values and may need economy tuning after real campaign play.

Next recommended patch: `TACTICAL_CIVILIAN_ESCORT_INTERACTION_AND_OBJECTIVE_BALANCE_INDEX_ONLY`, only after hands-on rescue pacing and reward validation. Fire/smoke and building power-loss remain deferred while tactical lighting is parked and Port performance remains under observation. Parallel strategic work remains `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY` after its existing manual reservation-flow validation.

## v0.26.07.13.0122 - Tactical Lighting Removal, Civilian Rescue, and Breach Feedback

Build `v0.26.07.13.0122_TACTICAL_LIGHTING_REMOVAL_CIVILIAN_RESCUE_BREACH_FEEDBACK_INDEX_ONLY_PATCH` preserves save format 4, removes tactical illumination from active gameplay/render hot paths, and implements the first contained civilian/rescue and structural-breach roadmap slice.

Lighting decision:

- Tactical vision is fixed at 20 hexes for soldiers and aliens; local lamps, interiors, headlights, solar phase, and per-cell brightness no longer change LOS.
- The shared visibility context now contains only the indexed live-cover lookup used by bounded LOS checks.
- Safe 2D terrain styling no longer calculates mission lighting or per-cell local light.
- Three.js uses a neutral baseline scene and no longer builds static building, lamp, vehicle-headlight, or wreck point lights. Transient weapon-impact feedback remains.
- Street lamps, vehicle headlights, windows, and fixtures remain visual terrain props so a future lighting pass can be reconsidered without changing map generation or saves.

Gameplay scope implemented:

- Manual tactical deployments create two to four neutral civilians on clear deterministic cells without changing campaign save data.
- Civilians reveal through the existing bounded human visibility pass, can be attacked by aliens, and report rescued/lost/awaiting counts in the tactical objective panel and mission log.
- A soldier adjacent to a revealed civilian can spend 8 TU to escort that civilian to the marked cyan extraction perimeter.
- Both 2D and Three.js identify civilians separately from armed soldiers and aliens; civilians do not display weapons or facing beams.
- Revealed structural walls, windows, and partitions can be targeted deliberately with the selected fire mode.
- Structural damage produces damaged/critical HP badges. Destroyed structural cover becomes visible, passable breach rubble instead of disappearing without feedback.
- Build Health adds rows for lighting-free tactical hot paths and shared civilian/rescue/breach state while retaining the bounded Port visibility/reachability regression.

Verification checklist:

- Static parsing passed across all six inline scripts after the final polish.
- `node tools\check-aegis-build.cjs` passed for the 0122 manifest/build seams.
- Localhost start screen displayed `v0.26.07.13.0122`; first-base confirmation and the main Geoscape loaded normally.
- Browser Build Health passed `250/250`, including the lighting-removal, civilian/rescue/breach, and bounded Port rows.
- A final six-soldier safe-2D mission launched on the 64x64 field with two civilians, 19 extraction-zone cells, one selected-soldier ring, and 180 visible movement highlights.
- Three End Turn cycles returned to the human turn in approximately 1.17 to 1.20 seconds each without degrading the civilian objective state.
- The Three.js Performance view rendered a nonblank 648x640 canvas with the neutral-visibility status and shared civilian/rescue/breach contract.
- A separate clean localhost load produced no runtime or console errors. The only console message was the existing Tailwind CDN production warning.

Manual validation still required:

- Load the player's affected campaign without overwriting it and launch the exact high-threat Port Attack in safe 2D; compare launch, selection, highlights, and three End Turn cycles against 0121.
- In a mission where civilians become visible, move adjacent and click one. Confirm 8 TU is spent, the extraction count increments, and aliens can kill an unrescued civilian without affecting soldier controls.
- On a map with a revealed building, fire Single/Burst/Full Auto at a wall or window. Confirm HP badges progress through damaged/critical, destruction leaves passable rubble, and both 2D and 3D show the breach.
- Judge whether immediate 8-TU extraction feels appropriately paced or should become a multi-turn escort objective in the next gameplay patch.

Remaining risks:

- The exact high-threat Port Attack save remains the authoritative performance case and was not available in this automated session.
- The practical smoke mission did not reveal a civilian or structural building target near the drop zone, so live rescue and deliberate-breach interaction still need hands-on confirmation.
- Civilian targeting increases tactical pressure and may need threat-specific weighting after playtesting.
- Dormant lighting helper code remains parked for possible later reuse, but Build Health verifies that active LOS, safe 2D styling, and Three.js scene construction do not call it.

Next recommended patch: `TACTICAL_RESCUE_OUTCOME_REWARDS_AND_MISSION_OBJECTIVE_VARIANTS_INDEX_ONLY`, adding mission-intent-specific rescue requirements and outcome rewards after the interaction feel is confirmed. Fire/smoke and building power-loss simulation remain deferred until gameplay behavior and the Port performance baseline are stable.

## v0.26.07.13.0121 - Tactical Lighting Cache Performance Fix

Build `v0.26.07.13.0121_TACTICAL_LIGHTING_CACHE_PERFORMANCE_INDEX_ONLY_PATCH` preserves save format 4 and targets the remaining renderer-independent tactical CPU pressure from local lighting during safe-2D alien incident battles.

Root causes addressed:

- Tactical state changes scanned all 4,096 map cells and recalculated human visibility for each cell.
- Each visibility calculation could still rescan all local light sources for target and observer cells during repeated line-of-sight checks, making lighting a likely contributor to the remaining Port Attack slowdown.
- Cover reveal repeated much of the same visibility work after the full-map scan.
- Selecting a soldier ran an independent breadth-first path search for every possible destination instead of computing the reachable area once.

Implemented changes:

- Added per-cell local-light caching to the shared tactical visibility context so target and observer lighting are computed once per visibility pass.
- Reused the cached lighting object in tactical vision range checks instead of recalculating mission solar/phase lighting per cell.
- Preserved the existing indexed cover lookup, bounded visible-cell set, and single reachable-cell flood fill from the previous performance patch.
- Added Build Health row `Tactical lighting cache keeps local-light visibility bounded` and strengthened the deterministic Port Attack fixture.

Verification checklist:

- Static app-script parsing passed across all six inline scripts.
- `node tools\\check-aegis-build.cjs` passed with the 0121 manifest/build seams.
- Browser Build Health passed `249/249`, including `Tactical lighting cache keeps local-light visibility bounded` and `Port tactical visibility and turns use indexed bounded passes`.
- Localhost smoke passed through the 0121 start screen, first-base confirmation, main Geoscape load, Build Health, full six-soldier squad assignment, mission launch confirmation, Skyranger travel, and safe-2D tactical arrival.
- The live 64x64 2D battlefield became interactive after the Skyranger arrival tick in approximately 3.6 seconds, including the verification wait interval.
- Soldier selection returned the selected soldier controls in approximately 1.1 seconds; DOM inspection confirmed the selected-cell ring and tactical controls, but visual movement-highlight feel still needs manual eyes-on testing.
- Three End Turn cycles returned to the human turn in approximately 0.9-1.0 seconds each.
- No browser runtime or console errors surfaced during Build Health or the live tactical mission; the only browser warning was Tailwind's CDN production warning.

Manual validation still required:

- Load the player's affected campaign and launch the exact high-threat Port Attack in safe 2D.
- Confirm initial launch, soldier movement-range highlights, and at least three End Turn cycles remain responsive without Windows offering to close the page.
- If a long pause remains, note the displayed tactical phase and whether it occurs before the map appears, on soldier selection, or during alien actions.

Next recommended patch: `TACTICAL_AI_TURN_CHUNKING_AND_2D_DOM_VIRTUALIZATION_INDEX_ONLY` only if the affected Port Attack still stalls. Otherwise continue `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.13.0100 - Three.js Instanced Ground and Failsafe Recovery

Build `v0.26.07.13.0100_TACTICAL_THREEJS_INSTANCED_GROUND_AND_FAILSAFE_RECOVERY_INDEX_ONLY_PATCH` preserves save format 4 and removes the largest remaining per-map Three.js ground allocation while making isometric combat opt-in and recoverable.

Implemented changes:

- Replaced hundreds of individual tactical ground meshes with one colorized `THREE.InstancedMesh`; instance IDs map back to authoritative tactical cells for selection and movement picking.
- Standardized the ground transform on exact pointy-hex spacing (`sqrt(3) * radius` horizontally and `1.5 * radius` vertically) with a 1.2 percent overlap to eliminate visible seams between neighboring tiles.
- Performance mode now budgets one ground mesh while preserving terrain colors, height, fog visibility, edge cells, and tactical simulation data.
- New campaigns enter manual tactical combat in 2D Hex. Three.js remains available through the explicit `3D Iso` control and does not change tactical rules.
- Missing Three.js instancing support or a lost WebGL context automatically returns the mission to 2D with a readable recovery notice.
- Auto, Performance, and Quality controls now appear on the main menu and persist through the existing local preference key, allowing Performance to be selected before any battle loads.
- Build Health includes `Three.js tactical instanced ground preserves picking gapless hexes and 2D recovery`.

Verification checklist:

- `node tools\\check-aegis-build.cjs` passed with the 0100 manifest/build seams.
- Browser Build Health passed `247/247`.
- Localhost smoke passed through the start screen, main-menu Performance selection, first-base confirmation, squad assignment, mission launch, and Skyranger arrival.
- The mission opened in 2D Hex, then switched successfully to a live 26x26 Three.js Performance map with one 648x640 canvas.
- The Three.js readout reported `Wilderness - Night - Performance`, confirming that the pre-battle main-menu preference was honored.

Manual validation still required:

- On the affected PC, select Performance on the main menu and complete a full Three.js mission, including selection, movement, firing, End Turn, and victory.
- Confirm adjoining ground hexes visually meet edge to edge at Near, Close, and Map zoom levels.
- Confirm deliberate WebGL interruption or graphics-driver reset returns to 2D rather than trapping the campaign, if such a test can be performed safely.

Next recommended patch: `TACTICAL_THREEJS_SCENE_TELEMETRY_AND_COVER_INSTANCING_INDEX_ONLY` only if the affected PC still stalls. Otherwise continue `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.13.0030 - Three.js Tactical Performance and Timeout Hardening

Build `v0.26.07.13.0030_TACTICAL_THREEJS_PERFORMANCE_AND_TIMEOUT_HARDENING_INDEX_ONLY_PATCH` preserves save format 4 and targets the timeout/stall risk reported on the player's PC.

Root causes addressed:

- The isometric renderer previously created a ring mesh for every visible cell, including ordinary noninteractive ground.
- Unseen ground received a second fog mesh even though its base tile was already rendered dark.
- All tactical building, vehicle, and lamp lights were added even when far outside the current camera window.
- Dynamic shadows and a 1024px shadow map were always enabled.
- Device pixel ratio could reach 2x, multiplying fragment workload.
- The 64x64 Map view could attempt thousands of separate tile/ring/fog objects.
- A permanent requestAnimationFrame loop traversed and rendered the entire scene at roughly 60fps even while idle.

Implemented changes:

- Added persistent `Auto`, `Performance`, and `Quality` controls to manual Three.js tactical missions.
- Auto resolves to Performance for lower/unknown hardware hints and to Auto Balanced only when both reported CPU and memory hints are strong.
- Performance caps the 3D overview at 32x32, uses 1x pixel ratio, disables antialiasing/shadows/redundant fog meshes, uses Lambert materials, limits local lights to six, and lowers ring geometry detail.
- Auto Balanced caps at 40x40 with 1.2x pixel ratio, no shadows, and ten local lights.
- Quality remains opt-in and preserves the full 64x64 overview, higher pixel density, shadows, standard materials, more lights, and fog meshes.
- Ordinary cell rings are no longer created. Rings remain for map edges, reachable cells, and the selected unit cell.
- Local tactical lights are filtered to the visible map window, sorted by camera proximity, and capped by quality mode.
- Static scenes render once and again on resize/state rebuild. Continuous frame animation is reserved for the victory dance.
- Ray picking remains attached to ground tiles, preserving click-to-select/move behavior.
- The Three.js status identifies the resolved quality mode and the displayed Hexes count reveals any overview cap.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 0030 manifest/build seams.
- Browser Build Health passed `246/246`, including `Three.js tactical performance mode caps expensive rendering and idles on demand`.
- A live manual tactical mission loaded as `Auto Performance` with no console errors.
- Selecting the 64x64 Map control in Performance produced a responsive `Hexes: 32 x 32` Three.js view with a visible 648x600 canvas.
- Deterministic coverage confirms Performance has zero normal rings, zero redundant fog meshes, zero idle animation frames, six lights, no shadows, and a 1x pixel ratio.

Manual validation still required:

- Reproduce the formerly timing-out mission on the affected PC using Auto/Performance.
- Select, move, rotate, and fire with several soldiers; run alien turns and confirm responsiveness does not degrade over time.
- Test the capped Map overview, then return to Near/Close and confirm camera/selection behavior remains correct.
- Complete a victory and confirm the temporary animation loop stops when leaving the mission.
- Compare Performance lighting/building readability against Quality only if the optimized mode is stable.

Next recommended patch: `TACTICAL_THREEJS_INSTANCED_GROUND_AND_SCENE_TELEMETRY_INDEX_ONLY` only if Performance still stalls on the affected PC; it would batch ground tiles into instanced draw calls and add a compact renderer-object/draw-call readout. Otherwise resume `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`.

## v0.26.07.12.1940 - Tactical Enclosures, Vehicles, and Local Lighting

Build `v0.26.07.12.1940_TACTICAL_ENCLOSURES_VEHICLES_AND_LOCAL_LIGHTING_INDEX_ONLY_PATCH` preserves save format 4 while deepening tactical structure readability and incident atmosphere.

Implemented changes:

- Exterior wall segments are taller and overlap enough to read as continuous roofless building shells in the isometric view.
- Larger structures receive internal hard-cover partitions with passable room gaps.
- Furnishing placement now follows building purpose rather than a generic three-prop pattern, with at least eight distinct interior object types across district archetypes.
- City, small-town, and farm route networks can contain sedans, vans, utility vehicles, and nearby lamp posts.
- Vehicles provide substantial cover and street obstruction; lamps remain lighter cover while acting as illumination sources.
- Three.js vehicles include body/cabin geometry and headlights, while 2D Hex uses matching vehicle and lamp silhouettes.
- Manual tactical missions stamp their actual Geoscape arrival month/day/minute into mission state.
- Tactical solar phase uses the incident latitude/longitude plus stamped Geoscape clock to select Daylight, Twilight, or Night.
- Three.js changes sky, fog, hemisphere light, and directional light by phase, then adds local point lights for interiors, lamp posts, and vehicle headlights.
- 2D Hex uses the same solar/local-light model for per-cell brightness and saturation.
- Unaided visibility is longest in daylight, shorter at twilight, and shortest at night; lit target/observer areas restore part of that range without bypassing walls or facing cones.
- Coordinated-support copy now correctly describes round-based field time rather than the removed one-day mission cost.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 1940 manifest/build seams.
- Browser Build Health passed `245/245`, including `Tactical enclosures vehicles and local lights shape shared battlefield visibility`.
- Deterministic coverage confirms internal partitions, eight-plus furnishing visuals, three-plus city vehicles and lamps, all three solar phases, ordered vision ranges, local-light vision improvement, both render paths, and normalized mission clock stamps.
- Localhost browser smoke passed through start screen, first base, squad assignment, manual mission confirmation, Skyranger travel, and a North America night tactical arrival.
- The live Three.js status reported `Wilderness - Night`, named the Ranger Outpost, and explained that lamps/windows/vehicle lights affect visibility.

Manual validation still required:

- Reveal and enter several structures to judge wall continuity, room gaps, furniture density, and doorway pathfinding at normal tactical zoom.
- Play a city or small-town map to compare parked vehicle spacing and street-lamp placement against road usability.
- Compare the same tactical controls at day, twilight, and night and confirm darkness is tense without becoming visually exhausting.
- Confirm local light pools are apparent around interiors, street lamps, and headlights in both 2D and Three.js.
- Shoot vehicles, windows, partitions, and exterior walls to assess current cover-HP feedback before dedicated breach/fire work.

Next recommended tactical patch: `TACTICAL_CIVILIANS_RESCUE_BREACH_AND_POWER_FEEDBACK_INDEX_ONLY`, adding civilians/rescue zones, explicit breach feedback, fire/smoke, destructible light sources, and building power-loss states. Parallel strategic follow-up remains `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1900 - Tactical Building Archetypes and Interiors

Build `v0.26.07.12.1900_TACTICAL_BUILDING_ARCHETYPES_AND_INTERIORS_INDEX_ONLY_PATCH` preserves save format 4 and expands the procedural tactical battlefield with original early-alien-defense-inspired structures.

Implemented changes:

- Added deterministic building plans for all four tactical biome families.
- City districts can contain a Municipal Records Office, Corner Market, and Vehicle Workshop.
- Small towns can contain a Roadside Diner, Family Residence, and Volunteer Fire Station.
- Farmland can contain a Farmhouse and Equipment Barn; wilderness can contain a Ranger Outpost.
- Each structure has an original footprint, one or more passable doors, hard/destructible wall cells, partial-cover window cells, distinct interior flooring, and interior cover props.
- Building placement avoids roads, service lanes, streams, and irrigation channels while leaving navigable exterior space.
- Random terrain cover no longer spawns inside planned building footprints.
- The 2D Hex view renders distinct brick, plaster, metal, timber, window, shelf, rack, counter, and table silhouettes.
- The Three.js view renders roofless cutaway wall sections, translucent blue window panes, and raised interior furnishings.
- Both views consume the same terrain and cover records, preserving movement, TU, line of sight, fog, weapon, damage, and AI rules.
- Tactical status and event logs identify the generated district structures without revealing hidden units.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed for the 1900 manifest/build seams.
- Localhost browser smoke passed through start screen, first-base confirmation, squad assignment, mission confirmation, Skyranger travel, and Three.js tactical launch.
- Browser Build Health passed `244/244`, including `Tactical building archetypes share passable interiors across 2D and Three.js maps`.
- The deterministic test covers biome variety, six or more distinct structure names, blocking walls, partial windows, furnishings, passable doors, interior terrain, renderer support, and safe human/alien deployment.

Manual validation still required:

- Explore a wilderness/farm map and verify the outpost/farm structures read clearly after fog is revealed.
- Explore a small-town/city map in both 2D and Three.js and compare door, window, interior, and wall readability.
- Shoot structural wall/window cells and confirm their existing cover HP/destruction behavior feels appropriate.
- Confirm soldiers and aliens route through door gaps rather than clipping through hard wall cells.

Next recommended tactical patch: `TACTICAL_BUILDING_BREACHES_CIVILIANS_AND_OBJECTIVES_INDEX_ONLY`, adding clearer damaged structure states, controlled breach interactions, civilians/rescue zones, and mission-intent-specific objectives. Parallel strategic follow-up remains `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1830 - Relocation Queue, Classic Dance, and Terminator Map

Build `v0.26.07.12.1830_RELOCATION_QUEUE_CLASSIC_DANCE_AND_TERMINATOR_MAP_INDEX_ONLY_PATCH` preserves save format 4 while extending relocation logistics and adding an alternate operational world view.

Implemented changes:

- Send Home/Rebase requests made while another aircraft route is active can enter a conservative serial queue instead of failing outright.
- Queued craft are marked unavailable, retain origin/home identity, and reserve their destination hangar immediately.
- Queue state is included in campaign saves, normalized on load, and reconciled with existing active-route reservations.
- The Geoscape Ferry / Refuel Staging area lists active and queued relocation routes with craft, destination, route, ETA, and hangar reservation.
- Invalid or orphaned queued orders release their reservation and recover the affected craft safely.
- The classic-lineup victory celebration applies animation to the soldier paper-doll group only; the surrounding status card remains still.
- A persistent segmented control switches the Geoscape between the solid interactive globe and a full-world day/night terminator map.
- The terminator map reuses the detailed Geoscape land geometry plus bases, incidents, detected UFOs, alien bases, active aircraft, range overlays, ferry links, and placement previews.
- A continuous solar mask derives from the authoritative Geoscape clock. Advancing one Geoscape hour moves the subsolar longitude 15 degrees and redraws the day/night boundary.
- The flat map remains interactive for incident selection and land-site placement, and its view preference is stored separately from campaign saves.

Verification checklist:

- Static app-script parsing passed.
- `node tools\\check-aegis-build.cjs` passed with the 1830 manifest and required seams.
- Localhost browser smoke passed through start screen, first-base setup, map-mode switching, first-base confirmation, and main Geoscape.
- The Terminator Map rendered at 720x360 with detailed opaque landmasses, both opening incident markers, range previews, and a smooth clock-driven solar mask.
- A practical `Tick +1h` changed the displayed subsolar longitude from E60 to E45, confirming synchronization with Geoscape time.
- Browser Build Health passed `243/243`, including relocation queue, classic paper-doll dance, and terminator-map rows.

Manual validation still required:

- Queue two real aircraft relocation orders in a multi-base campaign and save/reload before the second begins.
- Confirm a queued destination hangar clearly remains reserved and cannot be claimed by another aircraft/order.
- Watch a classic-lineup victory and confirm cards stay fixed while surviving paper dolls dance.
- Compare the Globe and Terminator Map during active UFO/aircraft movement and confirm all operational markers remain readable on both day and night sides.

Next recommended patch: `AIRCRAFT_RELOCATION_QUEUE_CANCELLATION_AND_CONCURRENT_FLIGHT_PREP_INDEX_ONLY`.

## v0.26.07.12.1715 - Aircraft Relocation Reservations and Round-Based Mission Time

Build `v0.26.07.12.1715_AIRCRAFT_RELOCATION_RESERVATIONS_AND_ROUND_BASED_MISSION_TIME_INDEX_ONLY_PATCH` preserves save format 4 while hardening aircraft relocation and making incident duration proportional to battle length.

Implemented changes:

- Send Home/Rebase orders reserve their destination hangar as soon as the aircraft launches, preventing another route or purchase from claiming the slot.
- Hangar reservations are stored in existing campaign hangar state and survive save/load when the matching relocation remains active.
- Orphaned or mismatched reservations are cleared conservatively during load normalization instead of permanently blocking a base.
- A craft can recognize and use its own reservation, while other aircraft see the slot as occupied.
- Successful relocation converts the reservation into the aircraft's normal hangar assignment; Rebase still changes permanent home only on arrival.
- Alien incidents no longer advance an automatic full day after resolution.
- Mission results now store combat rounds. Manual tactical play counts completed player/alien rounds, while simulation, AI-led, and classic playback use the resolver's rounds.
- Field time is calculated as 30 deployment/recovery minutes plus 5 minutes per combat round, bounded by the existing 24-round battle limit. Typical incidents consume 35 to 150 Geoscape minutes.
- Mission time advances through the authoritative Geoscape minute system, so UFO movement, repairs, refueling, transfers, aircraft travel, incident timers, and midnight rollover remain synchronized.
- Mission Reports and the general event log show combat rounds and exact elapsed field time.
- The Three.js isometric battlefield now uses viewport-proportional orthographic camera bounds and a 600px minimum tactical height, reducing the vertically squashed appearance on wide screens without distorting hex geometry or units.
- Manual 2D, Three.js isometric, standard simulation-map, and classic-lineup battle views now animate living soldiers on the final victory frame. Defeats, fallen soldiers, and unresolved rounds remain still.

Verification checklist:

- Static app-script parsing passed.
- The dependency-free build seam checker passed.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, squad assignment, mission confirmation, Skyranger outbound travel, simulated combat, return travel, and Reports.
- A practical 9-round `Red River Signal` simulation consumed `1h 15m`, remained on Month 1 Day 1, returned the Skyranger normally, and recorded the duration in the mission report.
- Browser Build Health passed `240/240`.
- New rows pass for destination-hangar save/resume reservations, round-based incident duration, proportional Three.js tactical framing, and victory dances in every tactical presentation.
- Browser console errors were clear.

Manual validation still required:

- Save and reload during a real multi-base Send Home/Rebase flight, then confirm the destination remains reserved and the aircraft resumes its route.
- Confirm the reserved hangar is visibly understandable in the selected Base/Hangar UI.
- Compare the Three.js map height on the player's normal display and confirm the extra vertical space feels better rather than oversized.
- Watch the final success frame in all four battle presentations and confirm the celebration is readable without obscuring controls.

Next recommended patch: `AIRCRAFT_RELOCATION_MULTI_FLIGHT_QUEUE_AND_RESERVATION_UI_INDEX_ONLY`, adding a compact reservation badge/ETA and considering multiple simultaneous relocation flights after the single active-route architecture is safely expanded.

## v0.26.07.12.1630 - Ferry Aircraft Rebase and Homeward Recovery Controls

Build `v0.26.07.12.1630_FERRY_AIRCRAFT_REBASE_AND_HOMEWARD_RECOVERY_CONTROLS_INDEX_ONLY_PATCH` adds explicit player control over Ready aircraft parked away from their permanent home base without changing save format.

Implemented changes:

- The selected Hangar aircraft panel now shows the aircraft's current base and permanent home base.
- Ready aircraft away from home receive a `Send Home` order without requiring an active UFO or alien incident.
- Ready Interceptors and Skyrangers can be ordered to `Rebase` through a destination-base selector when a complete ferry route and open destination hangar exist.
- Send Home preserves permanent home identity. Rebase changes `homeBaseId` and `homeHangarKey` only after clock-tracked arrival.
- Ferry legs reuse complete graph routing, one-way full-tank leg checks, real intermediate hangars, per-stop refueling, and final-base refueling time.
- The route is stored in the existing aircraft travel save state, appears in the Geoscape route timeline, and keeps the aircraft unavailable until arrival.
- Arrival releases the old physical hangar assignment, reserves the destination hangar, and avoids creating duplicate seeded aircraft from stale hangar configuration.
- Repairing, airborne, under-fueled, unreachable, and no-open-hangar aircraft remain blocked with a player-readable reason.

Verification checklist:

- Static app-script parsing passed.
- The dependency-free build seam checker passed.
- Localhost browser smoke passed through start screen, first-base confirmation, main Geoscape, Base screen, and selected Interceptor Hangar.
- Browser Build Health passed `236/236`, including `Ready aircraft can ferry home or rebase through clock-tracked routes`.
- Browser console errors were clear.
- Deterministic coverage confirms final-destination refueling time, Send Home preserving home identity, Rebase changing home only on recovery, old-hangar release, destination-hangar reservation, and Ready-only blocking.

Manual validation still required:

- In a multi-base campaign, send a remotely parked craft home and confirm every ferry/refuel phase advances with Geoscape time.
- Save and reload during that flight; confirm the route resumes and the craft remains unavailable.
- Rebase a Ready aircraft to a different open hangar and confirm the old home slot is released only after arrival.
- Confirm a competing aircraft cannot claim the destination hangar during the active route. This patch validates the destination at order time; explicit in-flight hangar reservation hardening remains the next bounded patch.

Completed next in `v0.26.07.12.1715_AIRCRAFT_RELOCATION_RESERVATIONS_AND_ROUND_BASED_MISSION_TIME_INDEX_ONLY_PATCH`: active relocations now reserve destination hangars and restore valid reservations on load.

## v0.26.07.12.1545 - Attached-Save Multi-Hop Interceptor Ferry Fix

Build `v0.26.07.12.1545_ATTACHED_SAVE_MULTI_HOP_INTERCEPTOR_FERRY_FIX_INDEX_ONLY_PATCH` uses the player-provided Month 4 campaign export as the authoritative regression case without changing save format.

Root cause and save findings:

- The save's Fort Aegis hangar configuration still listed two interceptor home slots, but the fleet records placed Saber One at Oceana 1 with stale `Outbound` status and Saber Two at Madagascar 1 with 60 repair minutes remaining. The UI's configured-hangar count made those remote aircraft look local.
- Both records predated permanent `homeBaseId` / `homeHangarKey` fields. Normalization incorrectly treated their current ferry bases as permanent homes, even though their stable aircraft IDs still encoded the original Fort Aegis slots.
- Route planning treated the configured Fort Aegis home slots as occupied. A returning aircraft therefore could not select its own reserved home hangar as the final staging/refuel destination.
- Ferry graph search supported several hops, but intermediate stops used permissive transient placeholders instead of consistently requiring real open hangars.
- The two North America contacts are approximately 1,483 km and 1,486 km from Fort Aegis. Saber Two's valid route is `Madagascar 1 -> N. Africa 1 -> Fort Aegis`; Saber One's later route is `Oceana 1 -> Madagascar 1 -> N. Africa 1 -> Fort Aegis` once Madagascar's only hangar is clear.

Implemented changes:

- Legacy aircraft home identity is inferred from stable aircraft IDs and matching configured hangar slots when explicit home fields are absent.
- Aircraft may use their own reserved home hangar when returning or staging, but another physically present aircraft still blocks that slot.
- Every intermediate ferry/refuel base now requires a real open hangar; full-tank range is evaluated separately for every one-way leg.
- Explicit destination-transient overrides no longer leak through a conflicting `allowTransientStage` option.
- Interceptor preview, button state, formation selection, and launch execution now share `interceptorEligibilityForContact` as the authoritative result.
- UFO Tracking reports radar lock, eligible count, current aircraft status/base/timer, origin, complete ferry route, staging base, and final round-trip distance/fuel.
- Pair launches no longer silently clamp to one aircraft when only one interceptor is ready.
- Added a minimized regression fixture derived from the attached save, including both exact North America UFO coordinates and all five saved base coordinates.

Verification checklist:

- Static app-script parsing passed after the route and diagnostics changes.
- Browser Build Health passed `235/235`, including `Attached save supports reserved-home and multi-hop interceptor ferry routes`.
- The attached-save fixture confirms legacy Fort Aegis home identity for Saber One and Saber Two.
- The fixture confirms Saber Two's two-hop route and Saber One's three-hop route.
- The fixture confirms occupied intermediate hangars block refueling and each craft's own reserved Fort Aegis slot remains usable.
- The fixture confirms both North America contacts are independently launchable when the two aircraft are Ready at Fort Aegis.
- The fixture confirms UFO Tracking, launch-button eligibility, and formation selection agree.
- Chrome file-chooser import was attempted, but local browser policy rejected automated file assignment. The original save file was never modified.

Manual validation:

- Load the attached campaign and advance at least 60 Geoscape minutes. Both saved interceptors initially require recovery because the export contains no active travel record and records Saber Two with 60 repair minutes.
- Confirm UFO Tracking names Saber One at Oceana 1 and Saber Two at Madagascar 1 instead of presenting them as physically at Fort Aegis.
- Launch Saber Two against a North America contact and confirm the route reads `Madagascar 1 -> N. Africa 1 -> Fort Aegis`, refuels at each stop, then flies the Fort Aegis/UFO round trip.
- After Madagascar's hangar clears, confirm Saber One can route `Oceana 1 -> Madagascar 1 -> N. Africa 1 -> Fort Aegis`.
- Confirm both aircraft ultimately return to their original Fort Aegis home hangars.

Completed next in `v0.26.07.12.1630_FERRY_AIRCRAFT_REBASE_AND_HOMEWARD_RECOVERY_CONTROLS_INDEX_ONLY_PATCH`: explicit Send Home/Rebase commands now let Ready aircraft leave remote staging bases without requiring an active UFO.
