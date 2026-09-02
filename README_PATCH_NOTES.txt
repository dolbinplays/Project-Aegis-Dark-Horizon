BUILD: v0.26.09.02.1144_BEACON_NEUTRALIZATION_AND_FIRE_TEAM_SEARCH_FORMATION_HOTFIX
TITLE: Beacon Neutralization + Fire-Team Search Formation Hotfix
DATE: September 2, 2026

Summary
- Keeps assigned Beacon Assault teams committed until the beacon is neutralized and makes post-contact/search deconfliction operate at the fire-team level so support soldiers stay in formation.

Key changes
- A Beacon Assault assignment is complete only when its assigned beacon is destroyed or legitimately disabled. Arrival, inspection, shield entry, or reaching an assault cell is not completion.
- If AEGIS knows the beacon is a reinforcement spawn point but has not learned a non-destructive shutdown method, the assigned team explicitly uses destruction doctrine.
- Active beacon assignments are excluded from generic fallback patrol. Members that cannot legally move or attack the beacon this turn hold or re-form instead of wandering away.
- Visible aliens and active civilian/VIP escorts may temporarily interrupt Beacon Assault; the same persistent assignment resumes after formation recovery.
- Post-contact split-search state is now leader-owned. Only leaders receive sector/fanout slots; support soldiers receive formation-follow behavior.
- Systematic search targets are derived from the fire-team leader so every member of one team shares the same search destination while supports remain in formation.
- Any visible firefight arms formation recovery. When combat ends, leaders hold while supports reform before objectives or sector search resume.
- Last Known Contact marker clearing, shields, LOS, TU, pathfinding, saves, assets, and save format 4 remain unchanged.

Validation
- Embedded JavaScript syntax checks, build/version synchronization, payload byte/SHA identity, deterministic contracts, and ZIP integrity are required for release.

---

BUILD: v0.26.09.02.0954_POST_CONTACT_FORMATION_AND_BEACON_OBJECTIVE_RESUME_HOTFIX
TITLE: Post-Contact Formation + Beacon Objective Resume Hotfix
DATE: September 2, 2026

Summary
- Re-forms fire teams after combat/contact investigations before resuming persistent objectives, and prevents stale distress/search movement from pulling explicitly assigned Beacon Assault teams away from their beacon.

Key changes
- When a firefight or Last Known Contact investigation ends, affected fire teams enter an explicit formation-recovery phase. Leaders hold while surviving supports return to their exact effective formation cells.
- Generic post-contact sector fanout is deferred until the fire team is re-formed.
- After formation recovery, persistent Assign Objectives orders resume before ordinary distress, patrol, or sector-search behavior.
- An explicit Alien Field Beacon assignment therefore survives alien contact and marker investigation and resumes automatically once the immediate threat is dealt with.
- Fixes the resolver branch where lingering distress/search state could execute direct movement before Beacon Assault movement despite the beacon being the selected target.
- The designated beacon breacher participates in the one-time re-form phase, then regains independent shield-entry/attack behavior. If the assigned team currently has no capable breacher, its leader holds/re-forms and reports the blocker instead of wandering into generic search.
- Unassigned teams still split into their established deconflicted search sectors after re-forming.
- Visible aliens and active civilian/VIP escorts remain higher priority. Beacon shields, TU, LOS, pathfinding, ammunition, grenades, saves, assets, and save format 4 remain unchanged.

Validation
- Deterministic contracts cover leader hold/support re-form, completion of recovery before split-search release, persistent Beacon Assault identity, suppression of stale distress movement, combat interruption, and unchanged save format 4.
- Release packaging verifies synchronized build identity, runtime payload byte count/SHA-256, byte-for-byte payload/source identity, embedded JavaScript syntax, and ZIP integrity.

---

BUILD: v0.26.09.02.0041_LAST_KNOWN_CONTACT_PRIORITY_AND_SEARCH_DECONFLICTION_HOTFIX
TITLE: Last-Known Contact Priority + Search Deconfliction Hotfix
DATE: September 2, 2026

Summary
- Hardens last-known-contact clearing, gives unresolved markers authoritative non-combat/non-escort priority, distributes teams across multiple reports, and splits converged teams back into separate search sectors after clearance.

Key changes
- Resolution tombstones now suppress stale contact state in ordinary contact updates as well as playback merges.
- A visible dead alien clears stale contact state instead of spawning a new marker. Hidden death knowledge is not leaked.
- Inspecting an empty reported cell clears every stale report on that same cell/deck, including overlapping records.
- Reports are shared AEGIS knowledge and remain clearable after the original observer dies.
- With no live alien visible and no active civilian/VIP escort, marker investigation outranks distress search, beacons, UFO-bay inspection, assigned/assist objectives, transient Hybrid movement, and normal fog search.
- Multiple markers are assigned across fire teams by recency/distance/stable identity.
- Once a marker clears, stale search targets are reset; if no marker remains, fire teams resume distinct sector slots so teams that converged do not continue sweeping together.
- Persistent assignments are deferred, not deleted. Combat and active escort duty still interrupt marker work and normal objectives resume afterward.
- Save format 4 and assets are unchanged.

Validation
- Deterministic contracts cover tombstones, dead observers/dead aliens, stacked reports, marker priority, multi-team assignment, post-clear sector splitting, combat/escort exceptions, and save compatibility.

---

BUILD: v0.26.09.01.2229_CONTACT_TOMBSTONE_AND_BEACON_ASSAULT_RESUME_HOTFIX
TITLE: Contact Tombstone + Beacon Assault Resume Hotfix
DATE: September 1, 2026

Summary
- Prevents cleared Last Known Contact markers from being resurrected by stale Simulation playback and makes explicitly assigned Beacon Assault teams automatically resume beacon destruction after temporary visible-alien combat.

Key changes
- A resolved contact record now blocks older/same-sighting playback frames from reactivating its marker or observed-contact flag.
- A genuinely newer sighting after the resolution round creates fresh contact state normally.
- The soldier who originally reported the alien may die; any other living AEGIS soldier with legitimate LOS can still clear the marker.
- Spotted aliens may temporarily interrupt an explicitly assigned Beacon Assault team. The assignment itself remains intact.
- As soon as visible contact is gone and no active civilian/VIP escort owns the soldier, the assigned team automatically resumes its beacon approach/attack.
- Hybrid AI transient round waypoints no longer override that persistent beacon assignment after combat clears; deliberate player Command Map waypoints remain separate.
- Beacon shields, weapon capability, TU, ammo, grenades, LOS, fog, pathfinding, formations, escorts, saves, and assets are otherwise unchanged. Save format remains 4.

Validation
- Added deterministic contracts for stale-frame tombstones, reporter-death clearance, fresh re-sightings, combat interruption/resume, Hybrid transient waypoint yielding, and player-waypoint preservation.

---

BUILD: v0.26.09.01.2147_LAST_KNOWN_CONTACT_LOS_CLEARANCE_HOTFIX
TITLE: Last-Known Contact LOS Clearance Hotfix
DATE: September 1, 2026

Summary
- Fixes last-known alien markers returning after a soldier has already looked at the recorded tile and verified that the alien is gone.

Key changes
- A living AEGIS soldier on the recorded deck now clears the underlying last-known-contact record when ordinary authoritative LOS confirms the stored hex is empty.
- The marker therefore stays gone after the observer turns away; presentation can no longer merely suppress it while leaving an unresolved record behind.
- Proximity alone no longer clears a report through walls, heavy smoke, or outside the soldier's vision cone.
- Simulation AI uses the same LOS verification before resolving a report and continues bounded local investigation when the cell cannot yet be verified.
- A later legitimate alien sighting refreshes the record normally, including on the same hex, so a new marker can appear there only after a new sighting followed by another loss of contact.
- Hidden alien coordinates remain secret and are never consulted to clear the marker.
- Threat-music intensity now tracks the corrected authoritative unresolved-report state.
- Movement, TU, pathfinding, fog, targeting, civilian/VIP behavior, alien AI, save data, assets, and save format 4 are unchanged.

Validation
- Deterministic Build Health coverage now includes LOS-based empty-cell verification, blocked-LOS retention, Simulation clearance authority, and same-cell re-sighting/re-loss.
- Embedded JavaScript syntax, host/payload build identity, payload byte count/SHA-256, payload/source identity, and documentation synchronization were checked for this release.
- Live tactical field confirmation should reproduce the original case: lose contact, look directly at the empty marker tile, turn away, and confirm the marker does not return.

---

BUILD: v0.26.09.01.1553_LAST_KNOWN_ALIEN_CONTACT_AND_THREAT_MUSIC_PATCH
TITLE: Last-Known Alien Contacts + Threat-Music Memory
DATE: September 1, 2026

Summary
- Preserves momentary AEGIS alien sightings as knowledge-authoritative investigation markers, directs eligible AI search toward them, and keeps mission contact music elevated until each report is resolved.

Key changes
- A verified alien sighting now records only the observed hex, deck, round, and observer. Hidden alien movement never updates that record.
- Losing LOS creates a persistent Last Known Contact marker in 2D Hex, 3D Iso, FPV, and TPV without rendering the hidden alien or exposing its live position.
- Reacquiring the alien, alive or dead, removes the stale marker and refreshes the report from the newly observed location.
- When no live alien is visible and no higher-priority escort or explicit objective applies, Simulation AI converges on unresolved contact reports before resuming ordinary fog search.
- Reaching the reported area without reacquiring the alien clears the marker and returns the team to mission-status doctrine.
- Unresolved reports keep the contact/intense segment of the Mission Threat Theme active. Clearing every report with no visible alien returns the existing crossfade to the low-intensity search segment.
- Contact lifecycle fields persist through deterministic Simulation snapshots and streamed playback. Older optional frame data cannot silently erase a newer report.
- Marker presentation is independent of continuous ground, fog, hidden-unit rendering, and static-scene rebuilds.
- Live contact, active escort, player/fire-team orders, beacon objectives, TU, LOS, fog, movement, damage, saves, and save format 4 remain authoritative. `assets/` is unchanged.

Validation
- Deterministic Build Health covers first observation, hidden-position secrecy, report search priority, marker clearing, threat-music ownership, 2D/3D/FPV/TPV presentation, streamed playback continuity, and unchanged save format.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release seams pass.

---

BUILD: v0.26.09.01.1111_RAMP_CONTACT_NONCLIPPING_CIVILIAN_BOARDING_PATCH
TITLE: Ramp-Contact Nonclipping Civilian Boarding
DATE: September 1, 2026

Summary
- Ends long-running Skyranger evacuation deadlocks by making exterior ramp contact the soldier-owned extraction handoff and giving escorted civilians/VIPs a sequenced, presentation-only walk into the craft.

Key changes
- The first exterior cell of the correct Skyranger ramp is now the terminal extraction target for escort soldiers. Manual and AI pathing treat the remaining narrow ramp/troop-bay cells as unavailable to soldiers.
- Boarding begins only after the escort soldier's rendered model reaches the exact ramp-contact cell. An adjacent soldier cannot trigger an early extraction.
- Every civilian/VIP currently escorted by that soldier receives a deterministic approach and ramp trail through that same craft. The escort remains outside rather than entering the troop bay.
- Boarding civilians temporarily ignore living-unit occupancy for their presentation trail, preventing other evacuees, soldiers, or ramp traffic from blocking the animation.
- Multiple evacuees board in stable escort order. Simulation playback waits for the escort movement to finish, then plays each civilian/VIP walk separately.
- A civilian/VIP remains visible and unextracted during playback and disappears only after reaching the final interior boarding point.
- Active legacy tactical states that contain a living soldier inside an interior ramp cell relocate that soldier to the nearest legal battlefield cell during integrity repair.
- Interior ramp movement blocking is independent of LOS and cover authority. Rescue scoring, mission objectives, TU, fog, two-Skyranger selection, saves, and save format 4 are unchanged. `assets/` is unchanged.

Validation
- Deterministic Build Health covers exact contact gating, exterior-only soldier routes, hard-blocked troop-bay movement, nonblocking civilian trails, sequential multi-VIP playback, two-Skyranger craft ownership, loaded-state repair, Manual/Simulation parity, and unchanged save format.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release seams pass.

---

BUILD: v0.26.09.01.0958_VIEWPORT_BOUNDED_SCROLLABLE_OBJECTIVE_ASSIGNMENT_PATCH
TITLE: Viewport-Bounded Scrollable Objective Assignment
DATE: September 1, 2026

Summary
- Keeps the Assign Objectives command board entirely inside the visible browser window and makes long two-Skyranger fire-team rosters scroll internally.

Key changes
- Replaces the ineffective `max-h-[92vh]` Tailwind token, which was not present in the embedded precompiled stylesheet, with an explicit dynamic-viewport maximum that works in the packaged offline build.
- Known mission objectives and every fire-team assignment row now occupy a dedicated internal scroll region with contained mouse-wheel and touchpad scrolling.
- The title and explanation remain above the scrolling content. Use Default Logic for All, Cancel, and Apply Objective Assignments remain below it and reachable regardless of roster length.
- Compact viewport padding and the existing responsive stacked assignment rows support shorter displays, browser zoom, and Windows display scaling without requiring the player to zoom out.
- The board remains portaled above 2D Hex, 3D Iso, FPV, and TPV tactical presentation. Its backdrop continues to block interaction with the battlefield.
- The dialog receives keyboard focus when opened, restores the previously focused control when closed, and lets Escape invoke the existing transactional Cancel behavior.
- Objective ownership, Default AI Doctrine, follow/assist relationships, tactical AI, saves, and save format 4 are unchanged. `assets/` is unchanged.

Validation
- Deterministic Build Health covers the shipped viewport bound, internal scroll ownership, persistent action controls, responsive layout, keyboard cancellation/focus restoration, portal layering, two-Skyranger roster scale, and unchanged save format.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release seams pass.

---

BUILD: v0.26.09.01.0058_TACTICAL_MISSION_DEFAULT_PRESENTATION_PATCH
TITLE: Tactical Mission Default Presentation
DATE: September 1, 2026

Summary
- Starts fresh tactical missions in 3D Iso at Full zoom with Battle Speed set to 100%, without overwriting the choices stored by an active saved battle.

Key changes
- New manual tactical deployments open directly in the persistent 3D Iso view rather than 2D Hex.
- The ordinary mission zoom now starts at Full.
- Simulation AI's separate watch-zoom selection also starts at Full, so activating AI command does not immediately replace the requested default with Wide.
- Battle Speed starts at 100% instead of 50%. This changes presentation timing only; TU, AI decisions, reactions, accuracy, damage, and tactical results are unchanged.
- Players may still select 2D Hex, any zoom level, FPV, TPV, or Battle Speed from 10% through 150% after deployment.
- Cached and saved active missions keep their stored view, zoom, AI watch zoom, and Battle Speed. The new values are fallbacks only for fresh mission presentation.
- Invalid loaded presentation values are bounded safely. Campaign save format remains 4 and `assets/` is unchanged.

Validation
- Deterministic Build Health covers all three fresh defaults, Simulation AI's watch zoom, saved-state precedence, invalid-value bounds, and unchanged save format.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release seams pass.

---

BUILD: v0.26.08.31.2307_POST_MISSION_RECOVERY_OUTCOME_ANNOUNCEMENT_PATCH
TITLE: Post-Mission Recovery Outcome Announcement
DATE: August 31, 2026

Summary
- Plays the appropriate recorded Mission successful or Mission failed command line after the memory-management reboot has restored and authenticated the exact After Action Report.

Key changes
- The resume token's authoritative success boolean now remains bound to the build, autosave slot, report ID, and checkpoint ID through the reboot request and the host's completion acknowledgement.
- The replacement runtime verifies that the restored report has the same success/failure outcome as the checkpoint before applying it. A mismatch enters recovery handling and remains silent.
- Dialogue is queued only after React commits the Reports screen, selects the exact report, completes two presentation frames, and receives an explicit acceptance from the persistent host.
- Successful mission reports queue `mission_successful`; failed reports queue `mission_failed` through the existing computer-dialogue queue, dedicated voice bus, Voices setting, and established music duck/restore path.
- The resume token is consumed before the accepted-host dialogue gate. Remounts, report reopening, and already-consumed checkpoints cannot repeat the line; a genuine retry can announce only after later verified acceptance.
- The result line remains separate from the tactical `thats_the_last_of_them` cue. Recovery failure and Continue to Start Screen paths do not announce an unverified outcome.
- Campaign outcomes, rewards, casualties, panic, recovered equipment, report contents, memory disposal, audio assets, and save format 4 are unchanged.

Validation
- Deterministic Build Health covers success/failure event selection, report/outcome binding, accepted-host timing, token consumption, and separation from the tactical all-clear cue.
- The release checker requires outcome-bearing tokens and exact outcome agreement at both host handshakes.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release seams pass.

---

BUILD: v0.26.08.31.2203_POST_MISSION_RESUME_SINGLE_CHECKPOINT_CONSUMER_HOTFIX
TITLE: Post-Mission Resume Single Checkpoint Consumer Hotfix
DATE: August 31, 2026

Summary
- Fixes the false Recovery Check Required loop that appeared after a successful memory-releasing runtime reboot and correct After Action Report restore.

Key changes
- Removes an obsolete earlier resume effect that consumed the verified token before the newer checkpoint-aware restore path could process it.
- The retired effect restored the correct report but acknowledged success without `checkpointId`, causing the persistent host to correctly reject the incomplete acknowledgement as a different checkpoint.
- The replacement runtime now has exactly one resume-token consumer. It verifies build, autosave slot, report, and checkpoint identity before applying campaign data.
- Success remains deferred until React has committed the Reports screen and selected mission report, followed by two presentation frames.
- Genuine restore failures still retain Retry Verified Autosave and Continue to Start Screen recovery controls. Successful restores now dismiss the transition automatically.
- Runtime disposal, memory release, campaign aftermath, report selection, music continuity, tactical outcomes, and save contents are unchanged. Save format remains 4 and `assets/` is unchanged.

Validation
- Source inspection confirms one `postMissionRuntimeResumeAttemptedRef` consumer, one checkpoint-bearing completion acknowledgement, and no legacy 120 ms early acknowledgement.
- A new deterministic Build Health contract protects the single checkpoint-aware consumer boundary.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, payload/source identity, and static release-seam validation pass.

---

BUILD: v0.26.08.31.1857_ALIEN_VIP_INFORMATION_SEARCH_AND_SHARED_MEMORY_PATCH
TITLE: Alien VIP Information Search + Shared Memory
DATE: August 31, 2026

Summary
- Replaces exact hidden-VIP tracking with information-limited alien detection, last-known memory, bounded communication, approximate clues, and expanding search behavior.

Key changes
- Aliens can acquire a VIP only through personal LOS, an eligible nearby alien's confirmed report, retained last-known information, an approximate disturbance clue, or explicit scenario-authored prior knowledge.
- Losing sight freezes the VIP's last legitimately observed hex. Hidden VIP movement never updates that record; informed aliens investigate it and then fan outward through deterministic open-cell and nearby-structure search points.
- Living aliens within 28 hexes may share a current VIP sighting or retained report. Shared information carries the location, source, confidence, and observation age rather than permanent access to hidden tactical state.
- Ordinary confirmed memory expires after 12 rounds and suspected noise memory after 6. Search then returns to the established building and sector sweep instead of silently reacquiring the hidden target.
- Recent authored VIP noise/distress evidence produces an approximate cell two to four hexes from its source. The suspected point is deterministic, time-bounded, and never the exact sound or hidden VIP cell.
- Narratively appropriate missions can explicitly seed prior exact knowledge, such as an abduction already in progress. The starting location is captured once; moving the hidden VIP does not move the aliens' record.
- The shared objective planner serves streamed Simulation and live tactical Alien turns. Existing continuation fields retain last-known coordinates, observation age, and expanding-search progress without changing save format 4.
- Human escort ownership, civilian/VIP behavior, movement, pathfinding, TU, LOS, fog, targeting, damage, objectives, mission results, tactical presentation, save data, and assets are otherwise unchanged.

Validation
- Nine deterministic contracts cover completely hidden VIPs, direct sightings, contact loss, bounded expanding search, allied sighting reports, memory expiry, one-time scenario intelligence, approximate clues, and continuation/save authority.
- Embedded JavaScript syntax passes. Repeated live Build Health reports **660-661/715** with all nine new contracts passing, 54 stable unrelated historical diagnostics plus the known randomized failed-mission fixture, and no browser-console errors.

---

BUILD: v0.26.08.31.1705_ARTICULATED_SEGMENT_FACING_AND_FORWARD_WALK_PATCH
TITLE: Articulated Segment Facing + Forward Walk
DATE: August 31, 2026

Summary
- Corrects smooth articulated locomotion so moving soldiers face each world-space path segment instead of retaining a stale combat, camera, or prior-segment facing.

Key changes
- Travel yaw is derived from the same projected start and destination hex centers that drive persistent-root translation, keeping facing and motion on one presentation authority.
- The model completes its shortest-path turn during the opening 24% of a step and holds the segment heading through the remainder of translation, preventing sideways sliding and backward-looking walking.
- Every turn in a multi-cell route receives a fresh segment heading. On arrival, the model restores the authoritative destination facing required by stance, target, reaction, escort, formation, or command state.
- Manual, Hybrid, Simulation, civilian/VIP escort, and autonomous playback retain the shared movement wrapper and animation clock.
- Repairs the prior reboot integration's Build Health scope error by inspecting its component-local checkpoint writer through `AlienResponseCommand` source rather than attempting an invalid global function reference.
- Pathfinding, coordinates, occupancy, TU, LOS, fog, reactions, targeting, AI decisions, formations, mission results, save data, and assets are unchanged. Save format remains 4.

Validation
- Deterministic contracts cover six travel directions, early segment-facing acquisition, shortest-path turning, exact destination centers, destination-facing restoration, persistent-scene ownership, and save compatibility.
- Deterministic packaging, embedded JavaScript syntax, manifest parsing, and static build-seam validation pass. Live browser startup is clean and Build Health reports **652/706**, with both new movement-facing contracts and the repaired reboot checkpoint contract passing; 54 existing unrelated diagnostics remain.

---

BUILD: v0.26.08.31.1153_POST_MISSION_RUNTIME_REBOOT_RELEASE_INTEGRATION_PATCH
TITLE: Post-Mission Runtime Reboot Release Integration
DATE: August 31, 2026

Summary
- Rebuilds the post-mission disposable-runtime memory boundary on the complete Browser 2102 game lineage and hardens packaging, recovery, and After Action Report restoration.

Key changes
- Browser 1921 first-class Beacon Assault orders, Browser 2005 FPV/TPV alien target crosshairs, and Browser 2102 smooth articulated locomotion are all present in the packaged runtime. The stale Browser 1728-era payload from the experimental artifact is no longer used.
- `src/browser-runtime.html` is the committed canonical browser runtime. `tools/package-runtime-shell.cjs` deterministically packages it into the playable `index.html`, refuses stale lineage, and records the exact UTF-8 payload length and SHA-256.
- Mission aftermath still writes, reads back, and verifies a clean post-mission autosave before releasing the old iframe. The autosave, session token, and host reboot request now share a build-bound checkpoint identity.
- The host destroys the retired iframe and creates a fresh same-origin runtime. Restore completion is acknowledged only after React has committed the Reports screen and selected mission result, followed by two presentation frames.
- A 30-second watchdog detects a replacement runtime that never confirms restoration. A persistent recovery panel offers **Retry Verified Autosave** or **Continue to Start Screen** rather than silently hiding a failed recovery.
- Existing music enabled state, music and SFX volume, selection mode, soundtrack, and report-theme bridge remain continuous across the runtime replacement.
- The wrapper-aware syntax and release-seam validators now decode the payload, inspect the actual game, compare it byte-for-byte with the canonical runtime, and validate its published hash and lineage guards.
- Tactical authority, campaign outcomes, save contents, and save format remain unchanged. Save format is 4 and `assets/` is unchanged.

Validation
- The deterministic packager generated `index.html` from the canonical runtime and reported the matching payload byte length and SHA-256.
- All decoded embedded JavaScript blocks pass the syntax checker.
- Static release seams validate payload/source identity, build synchronization, recovery controls, watchdog coverage, checkpoint binding, report-commit acknowledgement, and all pre-existing gameplay markers.
- Live browser startup renders the versioned start screen with no console errors. The long-session six-mission memory soak and a natural post-mission reboot remain playtest gates because they require completing representative tactical missions.

---

BUILD: v0.26.08.30.2102_SMOOTH_ARTICULATED_HEX_TO_HEX_LOCOMOTION_PATCH
TITLE: Smooth Articulated Hex-to-Hex Locomotion
DATE: August 30, 2026

Summary
- Visible full- and mid-detail articulated AEGIS soldiers, civilians, and VIPs now move continuously between consecutive authoritative hex centers instead of visually teleporting one cell at a time.

Key changes
- One shared presentation timeline now eases persistent articulated unit roots from their previous visual position to the next authoritative path cell. It applies to Manual, Hybrid, Simulation AI, escort, and autonomous movement because it observes the common renderer update seam rather than creating role-specific movement systems.
- Visual facing rotates through the shortest angle at path turns while the established articulated leg gait remains active throughout each translated step. Destination stance, frightened/calm civilian presentation, and other authoritative poses settle cleanly when translation finishes.
- Each playback step now supplies its presentation duration. Battle Speed therefore scales Simulation movement, while all movement remains bounded to a readable 90-620 ms transition.
- FPV and TPV camera targets follow the same interpolated unit root; their existing smoothing, camera ownership, weapon presentation, compass, and view selection remain intact.
- Only an adjacent authoritative step is interpolated. A load, model-tier change, newly revealed unit, interruption, or other non-adjacent update normalizes directly to its authoritative cell instead of drawing an illegal shortcut through a wall, door, building, vehicle, prop, Skyranger hull, or occupied space.
- Interpolation mutates only existing persistent unit transforms and articulated joints. Terrain, continuous ground, fog, buildings, roofs, materials, geometry, static-scene caches, and the renderer are not rebuilt per frame.
- Occupancy, movement, pathfinding, TU, LOS, fog, cover, reactions, contact discovery, targeting, damage, extraction, escorts, AI decisions, objectives, mission results, and save data remain discrete and unchanged. Save format remains 4. Assets are unchanged.

Validation
- All 5 non-empty embedded JavaScript blocks pass the syntax checker.
- Seven new deterministic Build Health contracts pass, including a runtime midpoint/end-point smoke test for exact root translation and visual facing.
- Live local-browser Build Health reports 643/697 with every new locomotion contract passing. The remaining 54 failures are unrelated existing diagnostics.
- The live browser start screen, deferred Build Health panel, in-game patch-history ownership, and browser console were checked; no console warnings or errors were recorded.
- Static release/version checks and extraction validation cover the Browser 2102 index-only package.

---

BUILD: v0.26.08.30.2005_FPV_TPV_ALIEN_CIRCULAR_CROSSHAIR_TARGET_MARKERS_PATCH
TITLE: FPV / TPV Alien Circular Crosshair Target Markers
DATE: August 30, 2026

Summary
- Replaces the ground-level perspective target ellipse for visible alien contacts with a compact red circular crosshair projected above the alien model.

Key changes
- First Person and Third Person observer views now render a bright-red circular ring with four short cardinal ticks and a clear center above each currently valid alien target.
- The crosshair uses the existing persistent observer-HUD root and authoritative hex-to-world projection. It follows camera motion, unit movement, stance/animation changes, perspective handoffs, and distance-aware scaling without adding another renderer or mesh layer.
- Alien Field Beacons keep the established FPV/TPV ground-objective ring, but receive a red target circle only after AEGIS has confirmed that Field Beacons are active reinforcement sources. Merely seeing an unknown beacon does not identify it as a threat.
- The 3D Iso glowing target-hex circles and 2D Hex target rings are unchanged in shape. Eligibility remains tied to current AEGIS visibility and campaign-intelligence authority. Hidden, dead, extracted, friendly, civilian, remembered, and not-yet-understood beacon contacts never receive a target marker.
- The marker stays occlusion-proof as a HUD presentation while qualifying, remains visually separate from the weapon reticle, and is removed when the shared target set no longer includes the alien.
- Targeting, LOS, fog, AI knowledge, accuracy, range, movement, pathfinding, TU, damage, objectives, renderer ownership, tactical outcomes, and save data are unchanged. Save format remains 4. Assets are unchanged.

Validation
- All 5 non-empty embedded JavaScript blocks pass the syntax checker.
- Static release/version checks pass for Browser 2005.
- The existing visible-target suite now includes five additional deterministic contracts covering alien-only crosshair styling, above-model anchoring, four cardinal ticks with bounded distance scaling, knowledge-gated beacon circles, retained beacon and Iso/2D presentation, persistent camera projection, and unchanged save format 4.
- The in-app browser security policy blocks direct navigation to local `file:` builds in this environment, so a new live Build Health total is not claimed. The prior live baseline remains 630/677 with 47 unrelated historical failures.

---

BUILD: v0.26.08.30.1921_FIRST_CLASS_FIRE_TEAM_BEACON_ASSAULT_ORDERS_PATCH
TITLE: First-Class Fire-Team Beacon Assault Orders
DATE: August 30, 2026

Summary
- Makes assigning a fire team to an Alien Field Beacon mean breach and destroy it, rather than issuing a generic waypoint that can suppress the beacon-combat AI.

Key changes
- Known Field Beacon objectives now include legal, open shield-entry cells. The assigned destination excludes the solid beacon-center hex.
- Fire-team command state distinguishes a typed `beacon-assault` from an ordinary waypoint and retains the objective/device identity. Missing metadata from older save-format-four tactical state safely defaults to waypoint behavior, while an existing explicit beacon objective is recognized by its established mission-objective identity.
- The assigned team selects its own best living breach-capable soldier. That assaulter uses the established close-assault shield-entry planner independently of leader formation pacing and holds position to shoot or throw a Frag Grenade as soon as a legal attack exists.
- Known live aliens and active civilian/VIP escort duties remain higher priority. When those interruptions clear, the typed assignment remains available and the assault resumes.
- Teams following through the objective-assist system continue to reinforce the primary beacon team without becoming a competing objective owner.
- A team with no loaded ranged weapon or usable Frag Grenade reports the exact blocker. A designated breacher that repeatedly fails to reduce approach distance records a route obstruction and directs supporting soldiers through the established perimeter-clearing planner.
- Save format remains 4. Assets are unchanged.

Validation
- All 5 non-empty embedded JavaScript blocks pass the syntax checker.
- The static Project Aegis build/release seam check passes for Browser 1921.
- Eight deterministic Build Health contracts cover legal assault-cell selection, center-cell exclusion, typed order identity, team-local breacher selection, shield-entry firing, incapable-team reporting, must-progress/perimeter clearing, assisting teams, priority boundaries, and save format 4.
- The in-app browser security policy blocks direct navigation to local `file:` builds in this environment, so a fresh live Build Health total is not claimed for Browser 1921. The previous live baseline was 630/677 with 47 unrelated failures.

---

BUILD: v0.26.08.30.1728_ISO_VISIBLE_TARGET_RED_GLOW_HOTFIX
TITLE: 3D Iso Visible-Target Red Glow Hotfix
DATE: August 30, 2026

Summary
- Fixes the 3D Iso visible-target rings rendering black instead of the intended glowing red used by the perspective target HUD.

Key changes
- 3D Iso visible-target rings no longer use the shared scene-lit MeshStandardMaterial / MeshLambertMaterial path. They now use dedicated unlit MeshBasicMaterial overlays so battlefield lighting cannot darken them.
- The target marker now has a bright red core ring plus a slightly larger additive red halo, matching the readable glow language seen in FPV/TPV.
- Both Iso marker layers disable depth testing and depth writing, disable fog and tone mapping, use high render order, and remain attached to the authoritative target hex. Roofs, walls, buildings, vehicles, vegetation, smoke presentation, and other scene geometry therefore cannot occlude the marker.
- Existing marker eligibility remains authoritative: only already-visible living aliens and active revealed Alien Field Beacons receive target rings. Hidden, dead, destroyed, disabled, friendly, and civilian entities remain excluded.
- The fix is presentation-only. Target selection, targeting legality, LOS, fog, cover, accuracy, AI knowledge, movement, TU, damage, objectives, mission results, and save data are unchanged. Save format remains 4.
- Assets are unchanged.

Validation
- All 5 non-empty `index.html` JavaScript blocks pass the embedded syntax checker.
- The visible-target Build Health contract is extended to require the unlit MeshBasicMaterial core, fog/tone-mapping immunity, additive halo, authoritative anchoring, and depth-independent rendering.
- Static release/version history checks confirm `index.html`, `src/manifest.json`, this archive, and the Game Bible all identify Browser 1728 while Browser 1656 and Browser 1358 remain immutable historical entries.
- The repaired index-only release package is `Alien_Response_Command_Game_v0_26_08_30_1728_ISO_VISIBLE_TARGET_RED_GLOW_HOTFIX_INDEX_ONLY.zip`; its embedded `index.html` is syntax-checked after extraction.
- Live local-browser validation boots Browser 1728, exposes it as the latest in-game history entry, reports **630/677** full Build Health checks passing with every visible-target/hotfix contract passing, and records no browser-console warnings or errors. The remaining 47 failures are the existing unrelated diagnostic baseline; final field confirmation should still exercise the marker inside a live 3D Iso mission.

---

BUILD: v0.26.08.30.1656_BROWSER_LONG_SESSION_MEMORY_OWNERSHIP_AND_STREAM_COMPACTION_PATCH
TITLE: Browser Long-Session Memory Ownership + Stream Compaction
DATE: August 30, 2026

Summary
- Adds the second targeted long-session memory pass after the player's post-1103 field session still climbed from roughly 700 MB to about 4.5 GB over approximately six missions.

Key changes
- Streamed Simulation AI no longer retains every already-played full battlefield frame for the rest of the mission. It keeps the previous/current action boundary plus future/prefetched frames, while a compact prior-shot flag preserves continuation behavior after old frames are released.
- Rotating autosave no longer deep-clones the complete live tactical cache during ordinary parent renders. It retains a lightweight current-state provider and builds the full save payload only when the autosave interval actually writes. Explicit manual saves are unchanged.
- Completed missions now release the mission-scoped known-objective memory map that Browser 1103 did not evict.
- Renderer teardown removes the detached target HUD mount, clears render-target/animation-loop ownership, releases replaced world-continuation canvas textures through the common disposer, and nulls large texture/root/scene references after disposal.
- Renderer context-release diagnostics now correctly return success when the global disposal guard performs the final context loss from inside renderer.dispose().
- The memory lifecycle report now includes streamed AI frames discarded, tactical save-payload builds, and known-objective-memory size for the next soak run.

Validation
- Six deterministic Build Health contracts cover streamed-frame compaction and prior-shot continuity, complete mission-cache eviction, lazy autosave snapshot construction, stronger renderer teardown, extended diagnostics, and unchanged save format 4.
- All 5 non-empty embedded JavaScript blocks pass `node --check`; static release-identity/seam checks also pass.
- A live Chromium page smoke was attempted, but this execution environment blocks browser navigation to local/localhost artifacts, so I am not claiming a live Build Health result from this environment.
- The supplied Month 3 / Day 12 Browser 1103 campaign is treated as the real-world reproduction profile, but leaked browser/GPU allocations are not serialized inside a save file; the ten-mission live browser soak remains the acceptance gate before declaring the investigation closed.
- Tactical rules, AI decisions, coordinates, movement, TU, pathfinding, LOS, fog, cover, damage, objectives, strategic progression, and assets are unchanged. Save format remains 4.

Manual memory soak gate
- Import the supplied Month 3 / Day 12 Browser 1103 campaign into Browser 1656, or continue an equivalent campaign. Record browser memory after load, after first tactical warm-up, and after every mission return for at least 10 missions.
- In the browser console, `window.__AEGIS_TACTICAL_MEMORY_LIFECYCLE_REPORT()` should show `renderer.active` returning to 0 outside tactical view, `caches.knownObjectiveMemory` not growing with completed missions, and `streaming.framesDiscarded` increasing during longer Simulation-AI battles.
- `streaming.tacticalSavePayloadBuilds` should increase when a manual save/export or rotating autosave actually serializes tactical state; ordinary tactical presentation updates should no longer manufacture full autosave payloads.
- After the first warm mission, repeated comparable mission returns should approach a plateau rather than climb linearly. Keep the roadmap target of retained memory within roughly 15% of the warm plateau as the acceptance goal.

---

BUILD: v0.26.08.30.1358_OCCLUSION_PROOF_VISIBLE_TARGET_HEX_MARKERS_PATCH
TITLE: Occlusion-Proof Visible-Target Hex Markers
DATE: August 30, 2026

Summary
- Adds a consistent red glowing target-hex aid across 2D Hex, 3D Iso, First Person, and Third Person mission views without changing what AEGIS can see or target.

Key changes
- Living alien contacts currently exposed by established AEGIS visibility authority receive a red ring around their authoritative tactical hex. Active, revealed Alien Field Beacons use the same marker language while destroyed or disabled beacons do not.
- 3D Iso rings use the existing hex-to-world transform and depth-independent materials, so the marker remains readable through buildings, roofs, walls, vehicles, vegetation, terrain props, and smoke presentation while staying fixed to the correct cell.
- FPV and TPV use a shared projected ground-hex HUD marker that remains visible through visual occluders and follows the active perspective camera. This also restores the persistent renderer's detached observer-HUD mount without creating another renderer or scene.
- 2D Hex adds the marker inside already-authorized alien and active-beacon glyphs. The red outline remains distinct from blue selection, lime movement, cyan extraction, magenta beacon shields, and shot-result presentation.
- Hidden, dead, extracted, destroyed, disabled, friendly, and civilian entities are excluded. A resolved battlefield exposes no current-target markers.
- Marker updates reuse persistent dynamic roots. Visibility or unit-state changes refresh the small target overlay only; camera movement, target markers, and observer projection do not rebuild terrain, buildings, fog geometry, or the static scene.
- Tactical coordinates, movement, TU, pathfinding, LOS, fog, cover, hazards, accuracy, targeting, AI knowledge, objectives, damage, and save data are unchanged. Save format remains 4.

Validation
- Seven deterministic Build Health contracts cover target eligibility, hidden-information exclusion, living/active removal gates, 2D Hex, 3D Iso, FPV, TPV, authoritative anchoring, occlusion-proof depth state, persistent invalidation, presentation-only scope, and save format 4.
- Full live Build Health reports 622/670 with all seven new contracts passing. The remaining 48 failures are existing unrelated diagnostics, and the browser console reports no warnings or errors.
- Embedded JavaScript syntax, build seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.30.1103_BROWSER_TACTICAL_MEMORY_LIFECYCLE_AND_TEARDOWN_PATCH
TITLE: Browser Tactical Memory Lifecycle + Teardown
DATE: August 30, 2026

Summary
- Adds the first targeted long-session memory pass by releasing mission-owned caches, canvas textures, persistent renderer references, and retired WebGL contexts at their true lifecycle boundaries.

Key changes
- Completed tactical missions now evict their live snapshot, reinforcement state, prepared deployment, building plans/cells, static terrain, segmented terrain palettes, and visibility caches. Unrelated active-mission state remains intact.
- Persistent tactical renderer teardown disposes terrain/FPV/TPV canvas textures once, collapses their CPU canvas backing stores, clears retained maps, sets, arrays, scene/camera references, and the global diagnostic runtime handle.
- Every disposed Project Aegis Three.js renderer now explicitly releases its WebGL context and render lists. This includes the recurring Geoscape surfaces that are recreated when entering and leaving missions.
- Runtime metrics now track active and peak tactical renderers, released contexts, textures, canvases, cache entries, and completed-mission releases. `window.__AEGIS_TACTICAL_MEMORY_LIFECYCLE_REPORT()` returns the current snapshot only when requested, so it adds no polling hot path.
- This is a lifecycle/ownership patch only. Tactical coordinates, movement, TU, pathfinding, LOS, fog, cover, AI, civilians/VIPs, fire teams, objectives, results, strategic progression, and save contents are unchanged. Save format remains 4.

Validation
- Six focused Build Health contracts cover completed-mission cache eviction, idempotence, unrelated active-state preservation, texture/canvas release, WebGL context release, persistent-runtime reference cleanup, diagnostics, and save format 4.
- Full live Build Health reports 616/663 with all six new contracts passing. The remaining 47 failures are the existing unrelated diagnostic baseline, and the browser console reports no warnings or errors.
- The deterministic contracts establish resource ownership; the roadmap retains the full ten-mission browser heap/GPU soak as the next measurement gate before declaring the entire long-session investigation closed.
- `assets/` is unchanged.

---

BUILD: v0.26.08.30.1036_TACTICAL_3D_ISO_SUPPORT_SLAB_REMOVAL_PATCH
TITLE: Tactical 3D Iso Support-Slab Removal
DATE: August 30, 2026

Summary
- Removes the battlefield-sized rectangular support plane beneath 3D Iso missions so the tactical surface reads as part of the surrounding world rather than a board resting on a table.

Key changes
- The former stable terrain bed now retires through a compatibility-safe no-op. It allocates no PlaneGeometry, material, mesh, texture, or draw call, and renderer diagnostics explicitly report that the support slab is absent.
- The cached continuous Iso ground remains at its established world height and continues to provide exact raycast-to-authoritative-hex picking. No tactical object or overlay was repositioned.
- The terrain skirt, edge-derived distant scenery, sky, horizon silhouettes, haze, fog, perimeter indicators, roofs, cinematics, and FPV/TPV ground paths remain independent and intact.
- Camera movement, rotation, pan, zoom, Fit Map, selection, unit movement, targeting, fog changes, and AI playback do not rebuild terrain as a consequence of this change.
- This is presentation-only. Hex coordinates, movement, TU, pathfinding, occupancy, LOS, cover, hazards, accuracy, AI knowledge, extraction, objectives, mission resolution, and save data are unchanged. Save format remains 4.

Validation
- Six focused Build Health contracts cover absent slab allocation/attachment, explicit runtime diagnostics, retained continuous ground and world-continuation layers, authoritative ground picking, camera-only invalidation, presentation-only scope, and save format 4.
- Full live Build Health reports 610/657 with all six support-slab contracts passing. The remaining 47 failures are the existing unrelated diagnostic baseline, and the browser console reports no warnings or errors.
- Embedded JavaScript syntax, build seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.30.0826_SKYRANGER_EXTRACTION_CORRIDOR_CIVILIAN_PRIORITY_YIELD_PATCH
TITLE: Skyranger Extraction-Corridor Civilian Priority Yield
DATE: August 30, 2026

Summary
- Prevents civilians and VIPs clustered on a Skyranger ramp from trapping an AI soldier inside the craft.

Key changes
- AI soldiers already inside a Skyranger extraction corridor can plan through civilian ramp traffic rather than treating the whole queue as an impassable wall.
- When the next corridor cell is occupied by a civilian or VIP, that person yields into the soldier's simultaneously vacated cell. This lets the soldier leave while the queue advances without overlapping units.
- Civilians moved onto the authoritative boarding cell are immediately resolved through the established rescued/extracted state so they cannot remain as hidden occupancy.
- The exception is restricted to civilian traffic in the selected player Skyranger corridor. Aliens, vehicles, hard cover, off-corridor civilians, ordinary collision, TU, LOS, fog, AI knowledge, and save data remain unchanged. Save format remains 4.

Validation
- Four focused Build Health contracts cover corridor-aware planning, controlled soldier/civilian yielding, unique living-unit occupancy, restricted scope, and save format 4.
- Full live Build Health reports 604/651 with all four corridor contracts and all six beacon-result contracts passing. The remaining 47 failures are the existing unrelated diagnostic baseline.
- Embedded JavaScript syntax, build seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.29.2133_SIMULATION_AI_BEACON_SHOT_RESULT_AUTHORITY_PATCH
TITLE: Simulation AI Beacon Shot-Result Authority
DATE: August 29, 2026

Summary
- Prevents beacon-targeted Simulation AI attacks from reporting Target Down unless the authoritative beacon state confirms that the device was destroyed or disabled.

Key changes
- Beacon-targeted grenades now separate nearby alien casualties from the beacon's own target result. Killing an alien in the blast no longer marks a surviving beacon as down.
- Direct AI and endgame-watchdog attacks record beacon identity, pre-shot HP, maximum HP, applied damage, rounds fired, and target-specific destruction state.
- Dialogue and map playback reconcile beacon shot records against the same cover record used for HP, shields, rendering, reinforcement transit, and mission objectives. A stale or collateral lethal flag is demoted while the beacon remains active.
- Tactical shot results now say BEACON HIT for a surviving device and BEACON DESTROYED only after authoritative neutralization.
- Beacon damage, shields, reinforcement transit cancellation, tactical objectives, TU, ammunition, AI targeting, fog, and save data are otherwise unchanged. Save format remains 4.

Validation
- Six focused Build Health contracts cover active/destroyed beacon reconciliation, collateral grenade kills, soldier dialogue, shot-result labels, Simulation metadata, playback wiring, and save format 4.
- Embedded JavaScript syntax, build seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.29.2053_EXACT_OVERHEAD_RIFLE_BARREL_SHOT_ALIGNMENT_PATCH
TITLE: Exact Overhead Rifle-Barrel Shot Alignment
DATE: August 29, 2026

Summary
- Aligns the articulated rifle barrel to the exact resolved shot endpoint from an overhead view without changing tactical facing or any combat authority.

Key changes
- Full and 11-submission mid articulated soldiers now have a temporary fire-time yaw pivot between the authoritative six-direction facing parent and the authored pose root.
- When a shot is presented, the renderer measures the transformed weapon-to-muzzle barrel vector and turns that temporary pivot toward the resolved impact cell. Misses continue aiming at their already-resolved miss location rather than a mutable target object.
- Standing, kneeling, and prone shooters keep the appropriate authored aim pose. Manual, Hybrid, Simulation, reaction, burst, and cinematic playback inherit the correction through the shared shot snapshot.
- Clearing the shot resets only the temporary aim pivot. The soldier's existing tactical-facing pivot remains unchanged and resumes presentation authority cleanly after the aim hold.
- Persistent unit nodes are mutated in place. The patch does not rebuild soldier geometry, static terrain, fog, buildings, or other battlefield caches during ordinary firing.
- Target selection, LOS, fog, distance modifiers, cover, accuracy, TU, ammunition, damage, AI knowledge, shot resolution, movement, and save data are unchanged. Save format remains 4.

Validation
- Seven focused Build Health contracts cover the six neighboring hex directions, non-cardinal long shots, a 2.5-degree tolerance, full/mid hierarchy, standing/kneeling/prone poses, resolved hit/miss endpoints, runtime alignment/reset, facing preservation, persistent mutation, and save format 4.
- Full live Build Health reports 594/641: all seven new contracts pass; the remaining failures are the same 46 unrelated existing diagnostics plus the pre-existing intermittent `Failed simulated missions wipe the whole squad` fixture.
- Embedded JavaScript syntax, build seams, whitespace, and live start-screen/history checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.29.1656_VALANT_MENTAL_HEALTH_CENTER_STAFFING_AND_AUTONOMOUS_APPOINTMENTS_PATCH
TITLE: V.A.L.A.N.T. Staffing + Autonomous Appointments
DATE: August 29, 2026

Summary
- Renames the Mental Health Center, moves specialist staffing into the selected Base facility panel, and lets severely stressed soldiers join the established FCFS care queue autonomously.

Key changes
- The facility is now the V.A.L.A.N.T. Mental Health Center: Validation, Acceptance, Listening, Advocacy, Nurturing, and Therapy. Its persistent `mentalhealth` facility key is unchanged for existing saves.
- Selecting a built V.A.L.A.N.T. facility shows included and additional specialists, occupied and available staffed positions, maximum capacity, FCFS queue length, hire cost, added upkeep, and a clear hiring blocker when applicable.
- Specialist hiring no longer appears on Soldier cards. The selected Base facility now owns a two-step Review/Confirm hire action; the established $85k cost, $22k monthly upkeep, per-base staffing, and four-specialist-per-facility cap remain authoritative.
- Ready soldiers at a staffed center automatically request care when stress reaches 60 (Shaken/Critical) or persistent panic reaches 20. Same-boundary requests sort by severity and then stable soldier ID before joining the existing queue.
- Commander and autonomous requests use one FCFS queue. Request origin is visible, duplicate requests are rejected, and a commander cancellation or completed session imposes a one-day autonomous rebooking cooldown while manual requests remain available.
- Mission commitment, transfer, wounds, KIA, facility loss, one-hour uninterrupted progress, zero partial benefit, time compression, and relationship isolation retain the Browser 1810 authority.
- Request origin and cooldown normalize as ordinary optional soldier fields under save format 4. Older queued saves without an origin are treated as commander-requested without losing queue order or progress.

Validation
- Seven focused Build Health contracts pass for V.A.L.A.N.T. naming, selected-facility staffing, confirmed base-local hiring, Soldier-card separation, severity ordering, duplicate prevention, cooldowns, completion, old-save normalization, and save format 4.
- Live Base testing confirms the staffing panel appears only for a selected built V.A.L.A.N.T. facility, remains absent from the construction preview, and preserves the hire confirmation. Live Soldiers testing confirms care controls remain and hiring controls are absent.
- Full live Build Health reports 588/634 before the release-identity synchronization pass: all seven new contracts pass and the 46 unrelated existing failures are unchanged.
- Embedded JavaScript syntax and release seams pass. `assets/` is unchanged.

---

BUILD: v0.26.08.29.1450_PERFORMANCE_MODE_FPV_TPV_SOLDIER_MID_LOD_PATCH
TITLE: Performance-Mode FPV/TPV Soldier Mid-LOD
DATE: August 29, 2026

Summary
- Reduces world-space articulated soldier rendering cost in First Person, Third Person, and incoming-fire reaction views whenever the resolved tactical quality profile is Performance.

Key changes
- Explicit Performance and hardware-resolved Auto Performance now select the established animated 11-submission articulated-mid model for world-space AEGIS soldiers in FPV, TPV, and reaction TPV.
- Quality and Auto Balanced retain the optimized 20-submission full articulated model. Existing Iso Near/Close, Full/Wide, Map, and Fit Map tier rules remain unchanged.
- Mid-LOD soldiers retain standing and kneeling aim, right-handed weapon handling, tactical facing, gait, armor and helmet colors, injury/collapse state, muzzle attachment, and weapon-light hierarchy.
- The separate camera-owned FPV carried weapon/hands layer remains full and readable; only battlefield soldier geometry changes tier.
- Persistent unit signatures recreate a soldier node only when its resolved model tier changes. Camera movement, unit movement, selection, targeting, and ordinary animation continue reusing the renderer, scene, caches, and unit nodes.
- Renderer diagnostics now identify Iso, FPV, TPV, and reaction TPV beside the active model tier and expose structural comparisons for 1, 6, 12, and 24 soldiers.
- This is presentation-only. Movement, TU, pathfinding, formation following, LOS, fog, cover, accuracy, targeting, ammunition, damage, AI, objectives, save data, and save format 4 are unchanged.

Performance comparison
- The per-soldier structural submission budget falls from 20 to 11 in Performance perspective views, a 45% reduction: 1 soldier 20 to 11, 6 soldiers 120 to 66, 12 soldiers 240 to 132, and 24 soldiers 480 to 264.
- Actual frame time remains scene-, hardware-, visibility-, and camera-dependent; the existing live diagnostic records average frame time, approximate FPS, draw calls, triangles, active view/tier, node creates, and node mutations on the current battlefield.

Validation
- Deterministic Build Health contracts cover explicit Performance, Auto Performance, Auto Balanced, Quality, FPV, TPV, reaction TPV, persistent tier signatures, the separate FPV weapon rig, animated 11-mesh construction, diagnostics, and save format 4.
- Two consecutive live Browser Build Health runs report 580/627. All seven articulated-renderer contracts pass; the 47 failures are the unchanged 46 unrelated legacy diagnostics plus the pre-existing randomized `Failed simulated missions wipe the whole squad` fixture. Startup, current Patch Notes history, and the Save / Load interface render without browser console warnings or errors.
- Embedded JavaScript syntax, release seams, JSON, whitespace, and asset-integrity checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.28.1810_MENTAL_HEALTH_CENTER_AND_SPECIALIST_TREATMENT_QUEUE_PATCH
TITLE: Mental Health Center + Specialist Treatment Queue
DATE: August 28, 2026

Summary
- Adds a buildable, staffed Mental Health Center with authoritative one-hour FCFS treatment, concurrent specialists, and zero-benefit interruption.

Key changes
- Mental Health Center is available in Base construction for $425k with $60k monthly upkeep. Each facility includes one specialist and room for three additional hires; each staffed specialist treats one soldier at a time.
- Soldier-card controls expose requests, FCFS queue position, active-session progress, remaining time, cancellation, staffing, and additional specialist hiring. Additional specialists cost $85k and $22k monthly upkeep.
- One uninterrupted authoritative Geoscape hour reduces stress by 12 and panic by 3. Ordinary ticks and compressed time share the same progression helper.
- Cancellation, mission assignment, transfer, wounding, KIA, or facility loss before minute 60 clears all session progress with no partial improvement. Mission launch confirmation warns when selected personnel will forfeit an incomplete session.
- Treatment suspends ordinary social downtime and never changes friendships, rivalries, or squad cohesion. Completed patients leave the queue, allowing the next FCFS soldier to begin immediately during the same compressed interval.
- Facility staffing, queue order, elapsed progress, completion history, and interruption history persist as ordinary base/soldier fields under save format 4.

Validation
- Seven deterministic Build Health contracts pass for included/additional staffing, concurrent FCFS order, exact one-hour completion, 59-minute interruption, time-compression parity, relationship isolation, UI/launch-warning wiring, and save format 4.
- Consecutive live Browser Build Health runs report 578-579/625. The one-check variation is the pre-existing randomized `Failed simulated missions wipe the whole squad` fixture; the usual 46 unrelated legacy diagnostics are unchanged and this patch adds no new failure. Startup and the Soldiers/Base interfaces render without browser console errors.
- Embedded JavaScript syntax, release seams, JSON, whitespace, and asset-integrity checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.28.1457_SELECTED_SQUAD_MORALE_SUMMARY_MISSION_CONTROL_PATCH
TITLE: Selected-Squad Morale Summary on Mission Control
DATE: August 28, 2026

Summary
- Adds live highest, lowest, and average mental-readiness scores for the selected primary squad before mission launch.

Key changes
- Mission Control now places a Selected Squad Morale panel immediately below the primary-squad choices.
- Morale Score is `100 - current morale stress`, so higher values indicate better readiness while preserving the existing Steady, Stable, Tense, Shaken, and Critical states.
- Highest, lowest, and arithmetic average recalculate whenever the selected squad or its authoritative roster changes.
- KIA and in-transit personnel are excluded. Wounded mission overrides remain included because the existing launch workflow permits their explicit deployment.
- Squads with no deployable personnel display an unavailable explanation instead of a misleading zero score.

Validation
- Five new deterministic Build Health contracts pass for mixed morale, one soldier, roster changes, unavailable members, wounded overrides, UI wiring, and save format 4.
- Live Mission Control renders the unavailable-roster state correctly. Full Build Health reports 571/618; the additional failure over the usual 46 is the pre-existing randomized `Failed simulated missions wipe the whole squad` fixture, not this patch.
- Startup, embedded JavaScript syntax, release seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.28.1422_ORANGE_LASER_CARBINE_EQUIPMENT_IDENTITY_PATCH
TITLE: Orange Laser Carbine Equipment Identity
DATE: August 28, 2026

Summary
- Gives the Laser Carbine one high-contrast orange identity across equipment lists, soldier presentation, articulated weapons, and tactical fire without changing its combat behavior.

Key changes
- Laser Carbine inventory and Quartermaster glyphs use an orange border and dark-orange surface with an explicit accessible label; the name and weapon icon remain visible so color is never the only identifier.
- Soldier cards add an orange equipment accent when the carried weapon is a Laser Carbine, and articulated Laser Carbine geometry reads the same canonical orange token.
- Laser shot presentation is orange, separating it from green plasma weapons and common blue AEGIS interface accents.
- Workshop text calls out the orange coding. Research, manufacturing cost, work, stores, transfers, ammunition, accuracy, damage, range, and TU rules are unchanged.

Validation
- Five deterministic Build Health contracts cover the canonical token, accessible glyph, soldier-card marker, articulated weapon, tactical shot, unchanged Workshop data, combat identity, and save format 4.
- Live Browser Build Health reports 567/613: all five Browser 1422 contracts pass and the remaining 46 failures are the unchanged unrelated legacy diagnostics.
- Startup, latest Patch Notes history, embedded JavaScript syntax, release seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.28.1101_OBJECTIVE_ASSIGNMENT_TRANSACTIONAL_CANCEL_AND_DRAFT_PRESERVATION_PATCH
TITLE: Objective Assignment Transactional Cancel + Draft Preservation
DATE: August 28, 2026

Summary
- Adds a true Cancel path to the fire-team objective board so tentative edits can be abandoned without changing any live assignment or restarting tactical AI.

Key changes
- The Assign Objectives overlay now shows Cancel beside Apply Objective Assignments.
- Direct objective owners, Default AI Doctrine teams, and follow/assist relationships remain authoritative while the overlay is open. All dropdown changes are draft-only.
- Cancel rebuilds the displayed choices from the untouched live units and closes the overlay. Reopening shows the same assignments that existed before the cancelled edit.
- Cancel never invokes the assignment mutator, AI-stream invalidation, Simulation/Hybrid restart, command transfer, formation reset, or movement restart.
- Apply Objective Assignments remains the only commit path.

Validation
- Three deterministic Build Health contracts cover exact direct/default/assist restoration, UI wiring, repeated cancellation, no AI replan, and unchanged save format 4.
- Embedded JavaScript syntax, release seams, JSON, and whitespace checks pass. `assets/` is unchanged.

---

BUILD: v0.26.08.28.0910_ARTICULATED_CIVILIAN_VIP_APPEARANCE_FEAR_AND_MOVEMENT_PATCH
TITLE: Articulated Civilian/VIP Appearance, Fear + Movement
DATE: August 28, 2026

Summary
- Replaces the close and mid-distance civilian/VIP silhouettes with lightweight unarmed articulated characters whose appearance and pose follow existing tactical state.

Key changes
- Ordinary civilians receive deterministic varied clothing, skin, hair, and bounded height variation. Tracked VIPs use black or charcoal suits with restrained shirt and tie variation.
- Near, Close, Full, Wide, FPV, and TPV use a ten-submission vertex-colored civilian hierarchy. Map and Fit Map retain the bounded Classic civilian LOD.
- Calm civilians use Attention. Panicked civilians use the existing Victory arms as a readable fear posture. A stationary panicked civilian beside valid hard cover combines those arms with kneeling legs.
- Moving civilians and VIPs reuse the established soldier gait for hips, knees, ankles, torso bob, and neck stabilization while preserving the current calm/fear upper-body pose.
- Panic recovery returns the character to Attention. Existing escort movement, visibility, boarding/extraction, injury, collapse, and prone-death state continue to drive presentation.
- Diagnostics count articulated civilians and VIPs separately. No civilian owns a weapon rig, muzzle socket, or weapon light.

Performance / authority
- The articulated civilian uses exactly 10 structural mesh submissions: torso, head, four leg segments, and four arm segments. Rigid clothing, shoes, hands, hair, shirt, and tie details are merged with vertex colors inside those segments.
- The persistent renderer reuses cached geometry/materials and only rebuilds a civilian node when its real signature or LOD tier changes. Gait animation mutates retained joints only.
- This is presentation-only. AI, movement, pathfinding, TU, LOS, fog, cover, targeting, damage, mission objectives, civilian panic/recovery rolls, rescue/extraction state, and save data are unchanged.

Validation
- Embedded JavaScript syntax, release-seam, JSON, and whitespace checks pass before packaging.
- Build Health adds five deterministic contracts, including a runtime construction test requiring exactly ten vertex-colored meshes, no weapon/muzzle ownership, fear-arm preservation during gait, pose-state mapping, and save format 4.
- `assets/` is unchanged. Save format remains 4.

---

BUILD: v0.26.08.27.2300_ARTICULATED_POSE_EDITOR_AND_DOCUMENTATION_CONSOLIDATION_PATCH
TITLE: Articulated Pose Editor + Documentation Consolidation
DATE: August 27, 2026

Summary
- Establishes one stable current articulated-pose authoring entry point, clearly archives the superseded preset tool, and makes the tactical-facing-parent / exported-pose-child transform boundary explicit and testable.

Key changes
- `AEGIS_Articulated_Pose_Editor_CURRENT.html` is the stable launcher for future pose work and forwards to the approved 0033 eight-pose library.
- The approved editor is visibly marked **Current approved authoring tool**.
- A six-direction Facing Preview now rotates a dedicated `AEGIS tactical-facing preview parent`, while the editable/exported pose remains on its `AEGIS exported pose child`.
- Facing Preview never enters exported JSON. `rootPosition`, `rootRotation`, body joints, and weapon transforms continue to represent pose-local values for `tacticalArticulatedSoldierPoseSpec`.
- The historical 2356 editor remains available for reproduction but now opens with an unmistakable archived/superseded warning and a direct link to the current launcher.
- The manifest and release checker identify the launcher, approved editor, archived editor, all eight approved presets, and the non-exported facing-preview contract.
- Recent Game Bible records now consistently distinguish the current build delta from historical build deltas, and the completed articulated cleanup sequence points next to articulated civilian/VIP presentation.

Validation
- Embedded JavaScript syntax checks cover the game and both pose editors.
- Build Health adds two deterministic registry/transform-authority contracts without changing tactical outcomes.
- Live Browser 2300 Build Health reports 554/600: both new contracts pass over the 552/598 Browser 2013 baseline, with the same 46 unrelated failures. Changing Facing Preview from East to West leaves the exported pose JSON byte-for-byte unchanged.
- Save format remains 4. Tactical rendering, approved poses, AI, movement, TU, pathfinding, LOS, targeting, fog, saves, and `assets/` remain unchanged.

---

BUILD: v0.26.08.27.2209_ARTICULATED_TACTICAL_MID_LOD_AND_FULL_WIDE_GAIT_PATCH
TITLE: Articulated Tactical Mid-LOD + Full/Wide Gait
DATE: August 27, 2026

Summary
- Replaces the stationary 20-submission Full/Wide soldier presentation with an 11-submission articulated tactical model that retains recognizable equipment, colors, stance poses, and animated walking.

Key changes
- Full and Wide 3D Iso now select an **articulated-mid** tier whenever Articulated Soldiers is enabled.
- Rigid pieces are merged within their joint segment: torso with vest, head with neck and helmet, forearms with hands, lower legs with boots, and all rifle pieces. Vertex colors retain armor, vest, skin, boot, helmet, and weapon separation without restoring extra material submissions.
- Hips, knees, shoulders, elbows, tactical facing, standing/kneeling stance authority, aiming, damage/death presentation, and gait animation remain active.
- Near, Close, FPV, TPV, incoming-fire reactions, and cinematics retain the optimized 20-submission full model. Map and Fit Map retain the seven-submission Classic LOD.
- Persistent unit signatures and diagnostics distinguish articulated-full, articulated-mid, articulated-LOD, and Classic tiers.

Structural comparison
- 6 soldiers: 120 full-detail submissions versus 66 mid-LOD submissions.
- 12 soldiers: 240 versus 132.
- 24 soldiers: 480 versus 264.
- Full/Wide soldier-model submissions are reduced by 45%. Actual whole-frame improvement remains battlefield- and device-dependent.

Validation
- Build Health covers tier selection, the 11-submission profile, retained joint/pose/gait authority, vertex-colored rigid merging, persistent tier transitions, and diagnostic accounting. Its runtime smoke test constructs the model, verifies exactly 11 colored meshes, and confirms that the gait changes retained hip motion.
- Two live Browser 2209 runs report 551/598. All five revised articulated-renderer contracts and both civilian-objective-memory contracts pass. The 47 unrelated failures include the known randomized **Failed simulated missions wipe the whole squad** fixture, which happened to pass in the 552/598 Browser 2013 run.
- Civilian objective identity memory from Browser 2013 remains active.
- Tactical simulation, movement, TU, pathfinding, LOS, targeting, fog, AI, save data, and save format 4 are unchanged. Assets are unchanged.

---

BUILD: v0.26.08.27.2013_ARTICULATED_FULL_WIDE_DETAIL_AND_OBJECTIVE_MEMORY_PATCH
TITLE: Articulated Full/Wide Detail + Objective Memory
DATE: August 27, 2026

Summary
- Uses detailed articulated AEGIS soldiers in Full and Wide 3D Iso while holding their leg joints stationary, and stops known civilians from repeatedly reopening the fire-team assignment board after temporary visibility loss.

Key changes
- Full and Wide now use the optimized 20-mesh articulated soldier whenever the Articulated Soldiers presentation option is selected, replacing the seven-mesh Classic silhouette previously used at these zooms.
- The new articulated-static tier retains armor colors, helmet, rifle, facing, standing/kneeling/aiming poses, injury and death state, and normal battlefield translation.
- Walking-leg animation is explicitly disabled for articulated-static models. A moving soldier still travels along the authoritative movement path, but its legs remain in the appropriate stationary stance.
- Near, Close, FPV, TPV, and incoming-fire reaction cameras retain fully animated articulated soldiers. Map and Fit Map retain the seven-mesh Classic LOD.
- Persistent unit signatures and renderer diagnostics now distinguish articulated-full, articulated-static, articulated-LOD, and Classic tiers.
- Individual ordinary civilians become mission-known when first identified. Their objective identity is retained if they temporarily leave sight or the tactical component remounts, so seeing the same person again is not treated as a newly discovered goal.
- Dead, rescued, and extracted civilians still leave the active assignment list normally. A genuinely new civilian, VIP, beacon, UFO bay, or command core can still reopen the board as designed.

Validation
- The five articulated-renderer contracts cover Full/Wide static articulation, Map/Fit Map LOD, Near/Close and perspective animation, static gait suppression, persistent tier boundaries, and diagnostic accounting. Two objective-memory contracts cover re-spot suppression and terminal objective removal.
- Live Build Health reports 552/598. All seven contracts added or revised for this update pass; 46 existing unrelated checks remain failing.
- Embedded JavaScript syntax, release seam, JSON, and whitespace checks pass.
- This is presentation-only: tactical simulation, movement, TU use, pathfinding, LOS, targeting, fog, AI behavior, save data, and save format 4 remain unchanged. Assets are unchanged.

---

BUILD: v0.26.08.27.1550_ARTICULATED_RENDERER_PERFORMANCE_AND_BOUNDED_LOD_PATCH
TITLE: Articulated Renderer Performance + Bounded LOD
DATE: August 27, 2026

Summary
- Reduces the rendering cost of articulated AEGIS soldiers while keeping full joint-driven models wherever their additional detail is visually useful.

Key changes
- Merges the rigid helmet shell/brim into one cached geometry and consolidates the rifle body and dark-detail pieces into two cached geometries. Animated body joints, tactical facing, muzzle origin, weapon light, stance poses, and gait remain independent.
- An armored full articulated soldier now presents 20 structural meshes instead of 24, reducing its model-level draw submissions by 16.7% before battlefield visibility and renderer batching are considered.
- Fit Map and 64-cell Map/Full Iso views use the existing seven-mesh Classic silhouette as a bounded articulated LOD. Performance mode also uses the LOD at Wide zoom. This reduces comparable distant soldier submissions by 70.8% while retaining armor, helmet, weapon, facing, life state, lighting, and map position.
- Near, Close, Quality-mode Wide, FPV, TPV, incoming-fire reaction cameras, firing poses, and walking animation retain the full articulated hierarchy.
- The LOD tier is part of each persistent unit presentation signature, so crossing a genuine detail boundary rebuilds only the affected unit nodes. Movement, selection, panning, targeting, and ordinary animation do not cause LOD rebuilds.
- Renderer diagnostics now maintain independent Classic, articulated-full, and articulated-LOD frame buckets and report draw calls, triangles, visible model-tier counts, unit creates, and unit mutations.

Performance comparison
- 6 soldiers: legacy articulated 144 structural submissions; optimized full detail 120; distant LOD 42.
- 12 soldiers: legacy articulated 288; optimized full detail 240; distant LOD 84.
- 24 soldiers: legacy articulated 576; optimized full detail 480; distant LOD 168.
- Full-detail structural reduction: 16.7%. Distant-Iso structural reduction: 70.8%. Runtime frame timing remains device- and battlefield-dependent and is recorded by the live same-battlefield diagnostic rather than inferred from mesh count alone.

Validation
- Live Build Health reports 549/596 against the same campaign's 544/591 pre-patch baseline. All five new articulated-renderer contracts pass, with the unrelated failure count unchanged at 47.
- Embedded JavaScript syntax, release seam, JSON, and whitespace checks pass.
- Tactical rules, FPV/TPV pose presentation, save schema, and save format remain unchanged at format 4. Assets are unchanged.

---

BUILD: v0.26.08.27.1502_FPV_TPV_AI_HANDOFF_PERSPECTIVE_PRESERVATION_HOTFIX
TITLE: FPV/TPV AI Handoff Perspective Preservation
DATE: August 27, 2026

Summary
- Keeps the active First Person or Third Person observer camera selected when tactical decisions rebuild the Simulation AI stream instead of falling back to 3D Iso.

Key changes
- Before an active AI playback stream is cleared for recalculation, the tactical layer snapshots FPV/TPV and the view that should be restored after observer mode ends.
- The same perspective is restored when the replacement AI stream becomes active, centered on the current observed soldier.
- Automatic and manual Civilian Escort Support decisions, mission-objective reassignment, and Command Map order changes all use the preservation path.
- The Transferring Tactical Command overlay remains a temporary planning interruption rather than an implicit camera-mode change.
- Take Back Control and terminal AI cleanup still exit observer mode normally and return to the player's prior 2D Hex or 3D Iso view.

Validation
- Live Build Health reports 545/591; all three new FPV/TPV handoff contracts pass.
- No browser runtime errors were recorded. Embedded JavaScript syntax, release seam, and whitespace checks pass.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.27.1413_FIRE_TEAM_OBJECTIVE_ASSIST_AND_COMBINED_FORCE_PATCH
TITLE: Fire-Team Objective Assist + Combined Force
DATE: August 27, 2026

Summary
- Lets the player reinforce an important assigned objective with one or more intact fire teams that dynamically follow its primary team without merging identities or breaking established formations.

Key changes
- The mission-objective assignment board now separates **Own an objective** from **Follow and assist** choices.
- A fire team may assist another fire team only when that primary team directly owns a known objective. Self-assist and assist chains are rejected.
- Multiple teams may assist the same primary. Their leaders receive distinct live rear/flank slots around the primary leader, effectively creating a larger coordinated force without replacing any fire-team leader or support formation.
- The follow destination updates with the primary leader instead of retaining a frozen objective coordinate. Supporting soldiers continue to form around their own leader.
- Visible alien contact and active Civilian Escort Support decisions temporarily override objective-follow movement. The assist assignment remains intact so the combined force can resume after contact.
- Assisting teams are excluded from claiming a separate VIP through default rescue allocation.
- Assignment state remains compatible with tactical cache, save/load, Simulation playback, Hybrid control, and AI Command under save format 4.

Validation
- Consecutive live Build Health runs report 541-542/588. All six new objective-assist contracts pass in both runs; the one-check variation is the documented randomized failed-mission fixture rather than this patch.
- Embedded JavaScript syntax, release seam, and whitespace checks pass with no browser runtime errors.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.27.1306_RELEASE_CHECKER_AND_BUILD_HEALTH_CONTRACT_REPAIR_PATCH
TITLE: Release Checker + Build Health Contract Repair
DATE: August 27, 2026

Summary
- Repairs two stale Build Health assumptions so the diagnostics accurately validate the current persistent renderer and staged Field Beacon intelligence behavior.

Key changes
- The 3D Iso Night Brightness contract now recognizes the current persistent-renderer dependency sequence, including `soldierModelStyle` between the existing presentation dependencies.
- The contract still proves that night brightness changes renderer exposure and ambient shadow fill without changing light range, illuminated hexes, fog, LOS, accuracy, or AI knowledge.
- The beacon-intelligence fixture uses a loaded laser-equipped observer for known kinetic-shield guidance, while its separate known-field no-breach case retains a deliberately unarmed observer.
- This corrects the diagnostic fixtures only; renderer output, shield discovery, objective wording, beacon behavior, and tactical authority are unchanged.

Validation
- Live Build Health improves from 534/582 to 536/582 in the same browser harness.
- Both targeted checks pass and no runtime errors are recorded.
- Embedded JavaScript syntax, release seam, and whitespace checks pass.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.27.1205_FIRE_TEAM_ASSIGNMENT_MODAL_LAYERING_HOTFIX
TITLE: Fire-Team Assignment Modal Layering Hotfix
DATE: August 27, 2026

Summary
- Moves the mission-objective fire-team assignment screen into the document-level modal layer so the Three.js tactical map and tactical HUD can no longer render over it.

Key changes
- The assignment screen now uses a React portal attached directly to the document body, escaping tactical-panel transforms, clipping, and stacking contexts.
- Its full-screen backdrop, assignment cards, selectors, and action buttons render above the 2D and 3D Iso battle presentations.
- The higher-priority Civilian Escort Support decision retains its existing overlay priority when alien contact interrupts an escort.
- Objective choices, AI priorities, pathing, formations, tactical authority, and save data are unchanged.

Validation
- Embedded JavaScript syntax and release seam checks pass.
- Build Health now verifies the assignment modal uses the document-level portal.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.27.0924_FIRE_TEAM_MISSION_OBJECTIVE_ASSIGNMENT_AND_REPLAN_PATCH
TITLE: Fire-Team Mission Objective Assignment + Replan
DATE: August 27, 2026

Summary
- Adds a mission-scoped decision board for assigning known VIPs and other tactical goals to specific fire teams while preserving the familiar default AI doctrine for every unassigned team.

Key changes
- Missions with multiple known goals open the assignment board at landing. Every living fire team can select one explicit goal or remain on Default AI Doctrine.
- Tracked VIPs are assignable at landing. Ordinary civilians, Alien Field Beacons, crashed-UFO bays, and alien-base command cores join the board only when AEGIS legitimately knows them.
- Identifying a new goal reopens the same board, highlights the new entry, and lets the player revise every fire-team assignment.
- One known goal can have only one explicit fire team, preventing accidental duplicate VIP assignments.
- Explicit VIP assignments feed the existing rescue coordinator, building ingress, escort, formation, extraction, and traffic logic. Teams left on Default retain the established automatic allocation behavior.
- Non-VIP assignments reuse persistent fire-team command orders. Rescued, destroyed, lost, or otherwise resolved goals release stale explicit assignments back to Default.
- Routine alien sightings continue through the current contact-replan system rather than repeatedly opening this board. Alien contact outranks an unformed rescue approach, and the Civilian Escort Support decision retains higher authority once an escort column exists.
- Assignment data survives the live tactical cache, save/load, Simulation frames, and control-mode handoffs without changing tactical outcome authority.
- Movement, TU, pathfinding, LOS, fog, cover, accuracy, targeting, formations, damage, mission objectives, and hidden information are unchanged.

Validation
- All 5 non-empty embedded JavaScript blocks pass node --check.
- The release seam checker passes for Browser 0924 with synchronized artifact, manifest, patch-history, and Game Bible identity.
- A deterministic Build Health contract covers tracked/hidden goal knowledge, explicit and default VIP allocation, escort-contact authority, beacon knowledge gating, frame persistence, and unchanged save format 4.
- Live Browser 0924 Build Health reports 535/582 checks passing. All nine focused objective-assignment checks pass; the remaining 47 failures are established diagnostics unrelated to this patch.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.27.0813_SEGMENTED_ORGANIC_TERRAIN_COLOR_TRANSITIONS_PATCH
TITLE: Segmented Organic Terrain Color Transitions
DATE: August 27, 2026

Summary
- Preserves recognizable authored-color cores inside open-ground regions while replacing hard block borders with deterministic, irregular, 100-step color transitions toward neighboring regions.

Key changes
- Every open-ground region receives a seed-jittered center and eight independently seeded core radii, producing irregular cores rather than repeated circles or squares.
- Hexes outside a core project onto the line between their own region anchor and the nearest meaningfully different neighboring color anchor.
- Each line is treated as 100 discrete color segments. A hex deterministically chooses from the segment interval crossing that cell, retaining visible variation instead of becoming a smooth gradient.
- Core hexes retain the established palette. Roads, paths, water, irrigation, buildings, doors, sidewalks, and other authored structural surfaces bypass the transition system.
- The same generated palette feeds 2D Hex, Legacy 3D ground, Continuous 3D Iso, FPV, and TPV without adding per-frame work or terrain rebuilds.
- Neighbor-anchor palette samples are cached by mission and region, bounding the extra generation work on 64x64, 80x80, and 96x96 maps.
- Tactical coordinates, terrain semantics, movement, TU, pathfinding, LOS, fog, cover, accuracy, AI knowledge, damage, objectives, and save format 4 are unchanged.

Validation
- All 5 non-empty embedded JavaScript blocks pass node --check.
- The release seam checker passes for Browser 0813, including synchronized manifest/document/history identity.
- Live Build Health is 526/573. The new irregular-core/100-step transition contract and the prior metadata/history contract both pass.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.26.2315_BROWSER_BUILD_METADATA_AND_PATCH_HISTORY_SYNCHRONIZATION_PATCH
TITLE: Browser Build Metadata + Patch-History Synchronization
DATE: August 26, 2026

Summary
- Establishes one authoritative browser release identity across the artifact, manifest, documentation, and in-game history while locking old patch records to the builds that introduced them.

Key changes
- Twenty-two historical in-game patch records no longer inherit CURRENT_GAME_BUILD and therefore cannot be relabeled when the next build ships.
- The articulated history explicitly retains Browsers 2216, 2249, 2311, 2356, 0033, 0046, 0816, 1238, 1312, 1628, and 1739 as distinct releases.
- Patch-history build IDs are unique again, so the version picker has stable keys and prior releases cannot disappear behind duplicate current-build values.
- The Game Bible now starts with one authoritative project/build header; older build addenda are clearly historical records rather than competing current declarations.
- The release checker verifies current-build parity in the manifest, README, Game Bible, and browser artifact and rejects mutable historical history records.
- A deterministic Build Health contract verifies the current build, articulated history, one mutable latest entry, version derivation, and unchanged save format 4.
- No gameplay, renderer, AI, tactical rules, assets, or save schema changed.

Validation
- All 5 non-empty embedded JavaScript blocks pass node --check.
- The release seam checker passes for Browser 2315 and verifies current-build/document parity, one mutable latest history record, immutable articulated records, and unique historical build IDs.
- Live start-screen and Patch Notes testing shows Browser 2315 as latest and all 130 listed releases with distinct version labels.
- Repeated live Build Health runs report 524-525/572; the final clean reload is 525/572. The new metadata/history contract passes, and the one-check variation is the documented randomized failed-mission fixture rather than a new deterministic failure.
- Save format remains 4 and assets are unchanged.

---

BUILD: v0.26.08.26.2000_EMERGENCY_TACTICAL_JSON_AND_COORDINATED_ALIEN_SEARCH_PATCH
TITLE: Emergency Tactical JSON + Coordinated Alien Search
DATE: August 26, 2026

Summary
- Preserves the current campaign and live tactical battle as a direct JSON download when browser slot storage fails, while replacing nearest-fog circling with coordinated fire-team sectors and observed-UFO sweep priorities.

Key changes
- Browser slot-write failures now distinguish quota exhaustion from unavailable storage access.
- If a normal slot write fails, the game builds an emergency campaign JSON directly from the current in-memory state and downloads it without depending on localStorage.
- The emergency file includes activeTacticalState, identifies itself as an emergency export, records the storage-failure category, and remains compatible with the established campaign importer.
- The existing Download Current Backup button continues to provide the same storage-independent route at any time.
- Hidden-alien searches now assign deterministic, non-overlapping eight-hex sectors to fire teams instead of making every team repeatedly choose its nearest unrevealed cell.
- Search targets expire after eight rounds without completion, allowing a team to abandon an unreachable or nonproductive destination and advance to another sector.
- Once AEGIS has observed a landed reinforcement craft, a designated search team prioritizes its ramp cells. Observed crashed-UFO bay approaches receive the same treatment.
- Unobserved craft are not used as AI targets, preserving fog-of-war and knowledge authority.
- Build Health adds a direct emergency-export/search contract and expands the established last-alien sweep contract.

Validation
- All 5 non-empty embedded JavaScript blocks pass node --check.
- The static build-seam checker passes for the completed build.
- Final browser Build Health reports 524/571 passing. The new contract passes; 47 unrelated legacy assertions remain failing.

Compatibility
- Movement, TU, pathfinding, LOS, fog, formations, targeting, damage, mission objectives, and alien positions are unchanged.
- Save format remains 4; the emergency metadata is optional export-wrapper information.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.1739_ARTICULATED_AIM_WALK_DIRECTION_AND_RANGE_ACCURACY_PATCH
TITLE: Articulated Aim/Walk Direction + Range Accuracy
DATE: August 26, 2026

Summary
- Reverses the misdirected Standing Aim presentation, makes the articulated foot cycle read as forward walking, and gives every tactical firearm path one bounded distance-based accuracy curve.

Key changes
- Standing Aim now uses the opposite runtime yaw from Browser 1312, a 180-degree correction from that build's observed firing presentation.
- The correction remains beneath the authoritative six-direction tactical-facing pivot and does not change the selected target, shot vector, or muzzle-socket ownership.
- Rephases the active knee bend and ankle recovery against the existing hip stride so the rear leg pushes off while the leading leg reaches forward, preserving the approved Standing Carry upper body, rifle pose, route, speed, and root bob.
- Adds a shared range modifier for manual fire, reaction fire, ordinary Simulation AI fire, AI-recovery fire, and alien fire.
- One-hex point-blank fire resolves at 95%-97% before any intervening-window penalty.
- Close shots receive a bounded bonus, the curve is neutral at eight hexes, and longer shots receive a capped penalty.
- Stance, fire mode, darkness, fear, morale, equipment, cover, LOS, windows, and weapon range remain part of shot legality and accuracy.
- Manual shot-result feedback uses the same range-adjusted chance as shot resolution; Simulation shot records use the same helper.
- Build Health covers the corrected pose yaw, gait phase, accuracy breakpoints, point-blank bounds, all five firing paths, and save format 4.

Compatibility
- Movement coordinates, pathfinding, TU cost, fire-team formations, AI movement, targeting authority, LOS, damage, fog, and save data are unchanged.
- Approved authored pose values remain unchanged; the correction is applied only by the runtime presentation layer.
- Classic soldiers and FPV weapon ownership are unchanged.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.1628_ARTICULATED_WEAPON_LIGHT_AND_MUZZLE_ATTACHMENT_PARITY_PATCH
TITLE: Articulated Weapon-Light + Muzzle Attachment Parity
DATE: August 26, 2026

Summary
- Moves the articulated rifle's weapon-light housing, spotlight direction, and visual tracer origin onto the right-wrist weapon hierarchy so the equipment remains aligned through every pose and tactical facing.

Key changes
- Keeps the single articulated rifle owned by the named right-wrist joint.
- Adds a weapon-local equipment root containing the flashlight housing, spotlight, and spotlight target.
- Creates that articulated light subtree only while the soldier's weapon light is enabled, avoiding an inactive mesh/light on every soldier.
- The complete weapon-light presentation now inherits Standing Carry, Standing Aim, Kneeling Aim, Prone Aim, walking, downed, and six-direction facing transforms.
- Adds a weapon-local muzzle socket at the rendered barrel endpoint.
- Human articulated shot tracers begin at the transformed muzzle socket when that rendered shooter is available.
- Classic soldiers, aliens, and any unavailable rendered shooter retain the established cell-center tracer fallback.
- Disables the old root-level flashlight branch for articulated soldiers, preventing duplicate housing and spotlight geometry.
- Reuses cached flashlight-housing geometry instead of allocating a new articulated housing geometry for every rebuild.
- Preserves the visual spotlight's existing 1.55 intensity and 14-unit range.
- Adds deterministic Build Health coverage for right-wrist ownership, weapon/equipment hierarchy, transformed muzzle lookup, legacy-duplicate prevention, Classic fallback, facing-pivot isolation, and save format 4.

Compatibility
- Presentation-only: tactical illumination hexes, light range authority, LOS, fog, accuracy, targeting, damage, movement, TU, pathfinding, and AI are unchanged.
- The current rifle, armor, vest, and skin colors and the single-rifle presentation are preserved.
- FPV weapon ownership and Classic soldier presentation are unchanged.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.1312_STANDING_AIM_ALIGNMENT_AND_SOLDIER_CYCLE_CAMERA_PATCH
TITLE: Standing Aim Alignment + Soldier-Cycle Camera
DATE: August 26, 2026

Summary
- Rotates only the runtime Standing Aim presentation 90 degrees to the right so the rifle barrel lines up with the shot direction, and recenters the tactical camera when the player cycles to the previous or next soldier/fire-team lead.

Key changes
- Adds a local +90-degree yaw to Standing Aim beneath the independent six-direction tactical-facing pivot.
- Keeps the approved player-authored Standing Aim transform unchanged in the pose library; the barrel-alignment correction is a small runtime presentation layer.
- Leaves Standing Carry, Kneeling Aim, Prone Aim, walking, downed, ceremonial, and victory transforms unchanged.
- Previous/Next Soldier and Hybrid Previous/Next Fire Team retain their existing selection rules.
- 3D Iso now clears stale manual camera pan when selection changes and centers on the newly selected unit.
- 2D Hex continues to derive its viewport center directly from the selected soldier, so cycling selection recenters it through the established camera path.
- Fit Map stays a full-map view and does not force a zoom change when the selected unit is already visible.
- Adds deterministic Build Health coverage for the exact 90-degree local yaw, facing-pivot isolation, stance isolation, soldier/fire-team cycling, selected-unit centering, and 3D pan reset.

Compatibility
- Presentation-only: firing vectors, shot destination, LOS, accuracy, targeting, damage, movement, TU, pathfinding, fog, AI, and tactical outcomes are unchanged.
- Approved authored pose data remains unchanged.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.1238_RIGHT_HANDED_ARTICULATED_SOLDIERS_AND_VISIBLE_AIM_POSE_PATCH
TITLE: Right-Handed Articulated Soldiers + Visible Aim Pose
DATE: August 26, 2026

Summary
- Mirrors the articulated soldier's local left/right presentation so the rifle and grip hand read on the anatomical right side, and repairs the persistent renderer lifecycle that prevented shot events from visibly applying the approved aiming poses.

Key changes
- Corrects the model-coordinate convention with one local X mirror beneath the independent tactical-facing pivot.
- Keeps the rifle attached to the named right-wrist chain; the left arm continues to support the fore-end.
- Applies consistently to Standing Carry, Standing Aim, Kneeling Aim, Prone Aim, downed, Attention, At Ease, Victory, and the Standing Carry walk cycle.
- Preserves all approved player-authored joint and weapon transform values instead of maintaining a second mirrored pose library.
- Keeps the six-direction tactical-facing pivot independent, so the handedness correction cannot alter map orientation.
- Adds shot identity and shooter identity to the persistent unit-layer invalidation key. A shot now updates the soldier pose as well as the tracer/effect layer, then clearing the shot restores the authoritative carry or stance pose.
- Holds the active aiming presentation for at least 900 ms so the browser has time to paint and the player can read the posture, including at accelerated AI playback speeds.
- Standing shooters use Standing Aim, kneeling shooters use Kneeling Aim, and prone shooters retain Prone Aim.
- Adds deterministic Build Health coverage for the mirrored anatomical side, right-wrist weapon ownership, shot-driven unit invalidation, minimum pose duration, stance-correct aiming, and save format 4.

Compatibility
- Presentation-only: no changes to firing authority, accuracy, targeting, damage, TU, movement, pathfinding, LOS, AI, or combat outcomes.
- Standing shooters still use Standing Aim and kneeling shooters still use Kneeling Aim.
- Classic soldiers and FPV weapon ownership are unchanged.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.0816_ARTICULATED_SOLDIER_FACING_PIVOT_AND_STANCE_AIM_AUTHORITY_PATCH
TITLE: Articulated Soldier Facing Pivot + Stance Aim Authority
DATE: August 26, 2026

Summary
- Separates authoritative tactical facing from local articulated poses so walking, aiming, stance changes, and pose resets cannot turn a soldier away from their current hex direction.
- Makes the firing pose follow the soldier's authoritative stance: standing soldiers use Standing Aim and kneeling soldiers use Kneeling Aim.

Key changes
- Adds a dedicated parent facing pivot to every articulated AEGIS soldier.
- Keeps approved Standing Carry, Standing Aim, Kneeling Aim, Prone Aim, downed, ceremonial, victory, and procedural walking transforms on a child pose root.
- All six hex directions now rotate the facing pivot while authored local body and neck counter-rotation remains intact beneath it.
- Walking and end-of-movement resets update only the pose root, preserving the soldier's last tactical facing.
- Firing pose selection now gives authoritative `unit.kneeling` and `unit.prone` state priority over stale presentation-pose metadata.
- Standing fire selects Standing Aim; kneeling fire selects Kneeling Aim; prone fire retains its separate Prone Aim presentation path.
- Adds deterministic Build Health coverage for the hierarchy boundary, all six facing angles, walk/pose isolation, stance-correct firing, and save format 4.
- Synchronizes the articulated patch history and release checker with the current renderer dependency list.

Compatibility
- Presentation-only: no changes to coordinates, movement, TU costs, pathfinding, LOS, accuracy, targeting, AI, or combat outcomes.
- Approved player-authored pose values remain unchanged.
- Classic soldier fallback remains available.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.0046_ARTICULATED_STANDING_CARRY_WALK_CYCLE_PATCH
TITLE: Articulated Standing Carry Walk Cycle
DATE: August 26, 2026

Summary
- Adds a basic procedural walking animation to articulated AEGIS soldiers, using the approved player-authored Standing Carry pose as the immutable base posture.

Key changes
- Alternating left/right hip swing while walking.
- Knee flexion rises on the recovering leg so the gait does not read as rigid sliding.
- Ankles counter the leg swing for a more planted step.
- Adds a small vertical bob and lateral weight shift through the articulated root.
- Adds subtle torso and neck counter-motion while keeping the approved Standing Carry arm/rifle relationship intact.
- Walk animation runs only for living articulated human soldiers moving in the normal standing posture.
- Firing, kneeling, prone, victory, death/unconscious, Attention, and At Ease continue to use their approved authored poses rather than the walk cycle.
- When movement ends, the model is restored exactly to the approved Standing Carry values.
- Renderer animation lifecycle now remains active during tactical movement so Iso/TPV observers can see the gait instead of a static model sliding between cells.
- Added deterministic Build Health coverage for gait phase, alternating knee lift, movement-state wiring, weight shift/bob, and animation lifecycle.

Compatibility
- Presentation-only: no changes to movement speed, TU costs, pathfinding, collision, LOS, combat timing, or AI.
- Approved pose values remain unchanged.
- Single FPV-style articulated rifle and Classic fallback remain unchanged.
- Save format remains 4.
- No game assets changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.26.0033_APPROVED_ARTICULATED_POSE_SET_PATCH
TITLE: Approved Articulated AEGIS Pose Set
DATE: August 26, 2026

Summary
- Replaces the temporary articulated soldier pose estimates with the exact player-authored pose-editor values approved for Standing Carry, Standing Aim, Kneeling Aim, Prone Aim, Death / Unconscious, Attention, At Ease, and Victory.

Key changes
- Standing Carry: exact approved body, arm, wrist, neck, and rifle transforms.
- Standing Aim: exact approved aiming transforms, including body facing / neck counter-rotation.
- Kneeling Aim: exact approved one-knee firing posture. The normal live kneeling visual uses this approved pose as well.
- Prone Aim: exact approved prone firing posture. The live prone-alive visual uses this approved pose as well.
- Death / Unconscious: exact approved downed pose and dropped-rifle transform.
- Attention and At Ease: exact approved ceremonial/rest postures.
- Victory: exact approved victory posture and now wired into articulated mission-victory presentation.
- Build Health now checks numeric anchors from every approved pose so later patches cannot silently drift the authored values.
- Standalone pose editor presets synchronized to the same approved pose library.

Compatibility
- Single FPV-style articulated rifle remains in place.
- Classic soldier fallback remains available.
- All current armor colors and all six current skin tones remain unchanged.
- Save format remains 4.
- No gameplay, AI, LOS, pathfinding, damage, or TU rules changed.

--------------------------------------------------------------------------------

BUILD: v0.26.08.25.2356_ARTICULATED_SINGLE_RIFLE_AND_POSE_EDITOR_TOOL_PATCH
TITLE: Articulated Single Rifle + Pose Editor Tool
DATE: August 25, 2026

Summary
- Fixes the articulated AEGIS soldier so only one rifle is rendered and adds a standalone articulated pose editor tool for authoring the poses you want.

Key changes
- Articulated soldiers now suppress the old facing beam / duplicate groin object, leaving only a single visible rifle in the articulated presentation.
- The articulated rifle was rebuilt from the same low-poly receiver, shroud, barrel, grip, sight, and muzzle language used by the FPV weapon so it looks like the same family of gun.
- The single rifle remains anchored to the right-hand wrist chain rather than the torso.
- The package now includes a standalone AEGIS articulated pose editor HTML tool. It lets you rotate hinge joints, tweak root and weapon offsets, preview armor / skin / weapon palettes, and export or import pose JSON.
- Classic fallback, current armor colors, current skin tones, and save format 4 remain unchanged.

Regression notes
- No save-format change. Save format remains 4.
- No assets added or changed inside the game renderer.
- Added one standalone helper HTML tool to the package.

--------------------------------------------------------------------------------

BUILD: v0.26.08.25.2311_ARTICULATED_AEGIS_HAND_ANCHORED_RIFLES_AND_AIM_POSE_FIX_PATCH
TITLE: Articulated AEGIS Hand-Anchored Rifles + Aim Pose Fix
DATE: August 25, 2026

Summary
- Fixes the articulated AEGIS rifle presentation so weapons are anchored from the right hand / wrist instead of reading as chest- or groin-mounted across Iso, FPV, and TPV.

Key changes
- The articulated rifle mount now attaches to the right wrist joint rather than the torso.
- Standing carry posture now presents the rifle diagonally across the chest, with the right hand as the grip hand and the left arm posed into a fore-end support role.
- Added dedicated firing presentation poses for standing, kneeling, and prone when the active shot presentation identifies the soldier as the current human shooter.
- Kneeling and prone aiming were refined again to read more like deliberate shouldered firing positions.
- Existing prone-dead, attention, and at-ease posture support remain intact.
- Classic fallback, current skin tones, armor colors, and save format 4 are unchanged.

Regression notes
- No save-format change. Save format remains 4.
- No assets added or changed.
- Classic soldier presentation remains available through the AEGIS Soldier Model toggle.

--------------------------------------------------------------------------------

BUILD: v0.26.08.25.2249_ARTICULATED_AEGIS_WEAPON_HANDLING_AND_POSE_POLISH_PATCH
TITLE: Articulated AEGIS Weapon Handling + Pose Polish
DATE: August 25, 2026

Summary
- Refines the articulated AEGIS soldier so rifles are held more naturally from the shoulders, hands, and forearms instead of appearing to emerge from the center of the chest.

Key changes
- Standing articulated pose now carries the rifle diagonally across the chest in a more believable ready-carry posture.
- Kneeling articulated pose now shoulders the rifle more like a deliberate kneeling firing stance.
- Prone alive articulated pose now aligns the rifle and arms more like a low supported prone firing posture.
- Prone dead articulated pose now sprawls asymmetrically in a more believable unconscious/death presentation, with the weapon dropped away from the torso centerline.
- Attention and At Ease ceremonial poses were also refined so the rifle reads better in non-combat presentation states.
- Added wrist-aware articulated pose application while preserving the current skin-tone, armor-color, and Classic fallback authority.

Regression notes
- No save-format change. Save format remains 4.
- No assets added or changed.
- Classic soldier presentation remains available through the AEGIS Soldier Model toggle.

--------------------------------------------------------------------------------

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.25.2216_ARTICULATED_AEGIS_SOLDIER_MODELS_AND_CLASSIC_TOGGLE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds a new lightweight articulated Three.js AEGIS soldier body with distinct feet, shins, thighs, torso, neck, head, upper arms, forearms, and hands, while preserving the complete previous soldier renderer as a player-selectable Classic option.

ARTICULATED LOW-POLY BODY
--------------------------
- The Articulated presentation uses shared cached BoxGeometry, six-sided tapered CylinderGeometry, and low-segment SphereGeometry pieces connected by lightweight THREE.Group joint pivots rather than a skinned mesh or external model asset.
- Visible body construction includes two feet, two shins, two thighs, torso, neck, head, two upper arms, two forearms, and two hands. The existing chest-plate, tactical helmet, and equipment-colored weapon presentation are integrated into the same hierarchy.
- Geometry and materials are shared through the persistent renderer caches. Changing a pose rotates/repositions joints instead of rebuilding geometry. No new files under assets/ are required.

POSE AUTHORITY
--------------
- Six reusable pose definitions are included: Standing Combat, Kneeling, Prone Alive, Prone Dead, Attention, and At Ease.
- Existing tactical kneeling now bends the articulated legs and lowers the body rather than vertically squashing the entire soldier.
- Ordinary lethal presentation retains the existing impact/collapse timing, then settles an articulated casualty into a distinct asymmetric prone-dead pose instead of rotating the complete standing model onto its side.
- Prone Alive, Attention, and At Ease are available presentation poses for the planned prone/ceremonial/downtime systems without creating a second body model.

CURRENT COLOR + APPEARANCE PARITY
---------------------------------
- Articulated soldiers consume the existing soldierVisualData authority rather than introducing a parallel appearance palette.
- All six current skin tones are supported: #f2c7a5, #d79a6b, #b8754a, #8d5534, #5f3a2c, and #3b241f.
- Current armor presentation remains equipment-driven: Field Suit blue (#2563eb / #1e40af), Ceramic Armor light gray/white (#d1d5db / #f8fafc), and Psi Weave violet (#7c3aed / #a78bfa).
- Soldiers without equipped armor continue using their selected fatigues/undersuit color through the existing appearance system. Weapon colors remain ballistic slate, Laser cyan, or Plasma green through the existing equipment palette.
- Lean, standard, and stocky appearance data continue affecting silhouette width. The articulated hierarchy is vertically calibrated to the established Classic soldier scale so soldiers remain proportionate beside doors, windows, cover, vehicles, Skyrangers, and other mission scenery.

ARTICULATED / CLASSIC PLAYER TOGGLE
-----------------------------------
- The original Three.js AEGIS soldier construction remains intact as Classic. It is not deleted or silently migrated.
- A new AEGIS Soldier Model control offers Articulated and Classic on the start screen, in Save / Load settings, and in the live 3D tactical toolbar.
- Articulated is the default for new device preferences. The choice is stored locally on the device and never enters campaign or tactical save data.
- Switching during an active tactical mission changes only AEGIS presentation nodes. Unit identity, location, facing, HP, TU, equipment, fog, AI, cover, objectives, and the persistent terrain/cover scene remain unchanged.

VALIDATION
----------
- Embedded JavaScript syntax passes for every inline script.
- Critical browser boot smoke passes with no page errors in the headless harness.
- The Articulated/Classic control was exercised live in the browser harness: the default resolves to Articulated, switches to Classic, and switches back to Articulated without errors.
- The new deterministic Build Health contract verifies all six pose definitions, all six skin-tone values, Field Suit/Ceramic/Psi colors, required body-part construction, scale authority, live model switching, Classic fallback, and unchanged save format 4.
- Under the same headless full-suite harness, the uploaded 2049 baseline reports 509/561 while this build reports 511/562. The new articulated-model contract is the added deterministic pass; one existing randomized failed-mission fixture also happened to pass in this run, while no new failing test was introduced.
- Save format remains 4. No assets changed.

MANUAL TEST GATES
-----------------
1. Start a mission with soldiers using Field Suit, Ceramic Armor, Psi Weave, and no equipped armor; compare every skin tone and confirm colors match the Barracks/loadout identity.
2. Toggle Articulated / Classic from the live tactical toolbar and confirm the same soldiers remain on the same cells with identical HP, TU, equipment, selection, facing, and mission state.
3. Kneel and stand multiple soldiers in 3D Iso; confirm articulated joints pose correctly and the model remains centered and proportionate to doors, cars, cover, building interiors, and the Skyranger.
4. Observe ordinary deaths and confirm the impact/collapse finishes into Prone Dead without the articulated model snapping back to a standing hierarchy.
5. Exercise explicit Prone Alive, Attention, and At Ease presentation poses in diagnostics/future presentation hooks and confirm all limbs remain attached and weapons/helmets follow the body hierarchy.
6. Switch through 3D Iso, FPV, TPV, roof cutaway, night brightness/color settings, and victory/death cinematics; confirm no model-style choice changes tactical authority or causes a terrain/cover rebuild.

--------------------------------------------------------------------------------

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.25.2049_INTELLIGENCE_GATED_FIELD_BEACON_SHIELD_OBJECTIVE_TEXT_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Prevents the Field Beacon objective panel from revealing shield geometry and countermeasures before AEGIS personnel actually encounter that alien defense.

INTELLIGENCE-GATED GUIDANCE
---------------------------
- A newly confirmed shielded beacon now reports: "Secure the Beacon: investigate and neutralize the confirmed Alien Field Beacon. Defensive properties unknown."
- The initial text no longer reveals the seven-hex footprint, field-entry bypass, compatible weapons, or Frag Grenades.
- An intercepted attack or a living AEGIS soldier entering the field records the observed shield tier on the active beacon. The detailed kinetic or combined-field doctrine then appears and remains available after soldiers move away or the active battle is saved and loaded.
- Kinetic-field knowledge does not reveal later combined kinetic-energy behavior. No-breach withdrawal advice is also withheld until AEGIS understands the field.

PRESERVED AUTHORITY + VALIDATION
--------------------------------
- Shield blocking, damage, targeting, AI behavior, fog, TU, mission priority, completion logic, and save format 4 are unchanged.
- One deterministic Build Health contract covers spoiler-free text, interception and entry observations, remembered discovery, tier isolation, known-field no-breach guidance, and report-intelligence normalization.
- Embedded JavaScript, release seams, manifest parity, and whitespace checks pass. No files under assets/ changed.

--------------------------------------------------------------------------------

Build: v0.26.08.25.1938_TACTICAL_WORLD_CONTINUATION_TERRAIN_SKIRT_AND_HORIZON_SCENERY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes tactical battlefields appear to continue into a larger surrounding world by adding a persistent biome-matched terrain skirt, deterministic road/water/path continuations, sparse world-fixed scenery, and a map-sized instanced horizon backdrop without expanding the playable hex map.

WORLD CONTINUATION PRESENTATION
-------------------------------
- A cached continuous plane now extends beyond the authoritative battlefield and blends regional terrain toward the atmospheric horizon. It is visual only: no cells, collision, pathfinding, TU, LOS, fog knowledge, cover, hazards, targeting, AI, objectives, or save state are added.
- Real boundary cells are sampled once when terrain is built. Roads, sidewalks, streams, dirt paths, field rows, concrete, and utility corridors continue outward, taper, simplify, and dissolve instead of ending abruptly at the last playable hex.
- Seeded low-detail scenery near the map remains world-fixed for useful parallax. Distant settlement, forest, mountain, farm, arid, and tundra silhouettes remain camera-centered inside the existing sky shell.
- The playable perimeter rings remain independently visible so the legal tactical boundary is still clear.

PERSISTENT BATCHING + LIFECYCLE
-------------------------------
- Iso adds one cached skirt draw and one instanced near-scenery draw. FPV/TPV may add two far-scene instance batches and one haze draw, keeping the complete extension within 3-5 added draw calls depending on view/profile.
- The former many-object perspective backdrop is consolidated into instanced box/cone batches and now scales from real 64x64, 80x80, and 96x96 world bounds rather than fixed Small-map distances.
- Camera movement, rotation, zoom, selection, fog updates, soldier movement, targeting, and AI playback do not rebuild the skirt texture or static scenery.
- No shadows, tactical lights, collision meshes, extra animation timers, or dynamic ambient traffic were added.

VALIDATION
----------
- Twelve deterministic Build Health contracts cover all three map sizes, boundary sampling, presentation-only authority, no picking, cached invalidation, feature continuation, controlled instancing/draw counts, horizon sizing, edge readability, Iso/FPV/TPV compatibility, and unchanged save format 4.
- Repeated fresh-campaign browser runs report 513-514/560 passing. Every new continuation contract passes consistently; one pre-existing randomized failed-mission fixture accounts for the 46/47 unrelated historical-failure variation.
- Embedded JavaScript and whitespace checks pass. No files under assets/ changed.

--------------------------------------------------------------------------------

Build: v0.26.08.25.1855_PROCEDURAL_BUILDING_WALL_CONNECTOR_INTEGRITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restores continuous 3D building walls in generated and loaded tactical states where missing ownership metadata, same-cell effects, or mixed wall/partition records could leave intact perimeter sections looking like disconnected slabs.

STRUCTURAL CONNECTOR AUTHORITY
------------------------------
- Both 3D render paths now build a dedicated index containing only intact hard wall, window, and partition records. Smoke, fire, hazards, or another later cover record sharing the cell can no longer hide the structural neighbor used to build a wall bridge.
- Current records retain their stable building ID. Older/loaded records without it recover presentation ownership from the authoritative procedural building footprint, then use the saved building label only as a final compatibility fallback.
- Connection ownership prefers a wall/window renderer when paired with a partition. Lexical cell order can no longer assign the only bridge to a partition presentation branch that does not draw connectors.
- Continuous Ground remains the permanent Iso ground direction. The same structural fix also applies to diagnostic Legacy Hex Ground because buildings remain an independent presentation layer.

INTENTIONAL OPENINGS
--------------------
- Door cells remain open because they have no structural cover record.
- Destroyed walls and breached rubble remain disconnected and traversable.
- Adjacent walls belonging to different buildings are never joined.
- A connector appears only after both of its intact structural cells are revealed, preserving fog authority.

VALIDATION
----------
- Live browser Build Health reports the original continuous-wall contract and the new generated/loaded connector-integrity contract as OK.
- The new deterministic contract covers authoritative-plan recovery, same-cell overlay collisions, unrelated neighboring buildings, wall-to-partition ownership, door gaps, and breached gaps.
- Build Health moved from 500/547 to 501/548: one new passing contract with the same 47 unrelated historical failures.
- Embedded JavaScript, release seams, and whitespace checks pass. Save format remains 4 and assets are unchanged.

--------------------------------------------------------------------------------

Build: v0.26.08.25.1443_CONTINUOUS_ISO_GROUND_RENDERING_AND_PERFORMANCE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
3D Iso now defaults to one persistent cached continuous battlefield surface instead of thousands of visible ordinary ground-hex instances. The tactical simulation remains completely hex-authoritative, and the legacy ground presentation remains available through the renderer diagnostic for direct comparison.

CONTINUOUS ISO GROUND
---------------------
- A shared authoritative hex-to-world projection drives an Iso-specific cached CanvasTexture and world-aligned plane. It preserves biome color, roads, sidewalks, dirt, grass, concrete, authored variation, building floors, restrained cell borders, and bounded scorched-ground presentation without making the overhead map soft or uniform.
- The cached surface replaces only ordinary base terrain. Fog, cover, roofs, units, corpses, vehicles, Skyrangers, UFOs, props, objectives, extraction zones, movement/target overlays, shields, elevators, smoke, fire, debris, destruction, and cinematics remain independent dynamic layers.
- Camera motion, rotation, zoom, selection, fog changes, soldier movement, AI playback, and targeting do not rebuild the ground texture. Authoritative terrain damage can redraw only the affected cell region.
- FPV and TPV retain their established continuous-ground path and visual settings.

EXACT PICKING + DIAGNOSTICS
---------------------------
- Continuous mode raycasts the battlefield plane and converts the world hit through the authoritative odd-row hex projection. It does not retain invisible per-cell meshes merely for selection.
- The renderer diagnostic can switch between Continuous Ground and Legacy Hex Ground on the same battlefield. The switch changes presentation only and persists locally for comparison testing.
- Lightweight live metrics report average frame submission time, approximate renderer FPS, draw calls, triangles, visible ground instances, texture rebuilds, and static-scene rebuilds.

DETERMINISTIC PERFORMANCE COMPARISON
------------------------------------
Map      Legacy Hex Ground                         Continuous Ground                         Submission change
64x64    0.464 ms, 23 calls, 27,312 triangles     0.114 ms, 2 calls, 2,738 triangles      75.4% faster
80x80    0.439 ms, 27 calls, 42,672 triangles     0.089 ms, 2 calls, 4,274 triangles      79.7% faster
96x96    0.494 ms, 28 calls, 59,616 triangles     0.092 ms, 2 calls, 4,322 triangles      81.4% faster

The benchmark uses identical seeded terrain per size, a common static-prop load, and repeated zoom/pan/rotation submissions in actual WebGL. It isolates renderer submission cost rather than claiming equivalent whole-game FPS. Continuous Ground becomes the default because it materially reduced renderer cost at every size while preserving exact interaction and presentation boundaries.

VALIDATION
----------
- Thirteen deterministic Build Health contracts cover battlefield dimensions, exact known-center projection, world-to-hex round trips, interior-floor alignment, unchanged movement/pathfinding/TU authority, independent fog and overlays, bounded invalidation, presentation-only mode switching, FPV/TPV continuity, full Medium/Large coverage, and save format 4.
- Existing Embedded JavaScript, manifest/version, static Build Health, whitespace, and release-document checks remain required.
- The 3D Iso Color and Night Brightness controls continue applying after terrain replacement. No gameplay schema or save data changed.

FOLLOW-UP OPTIONS
-----------------
- Adaptive higher-resolution textures, chunked texture uploads, distance-dependent grid treatment, GPU texture atlasing, and additional static-scene batching remain worthwhile measured follow-ups rather than silent scope expansion.
- No files under assets/ changed in this patch.

--------------------------------------------------------------------------------

Build: v0.26.08.25.1335_REINFORCEMENT_DEPLOYMENT_CONTINUITY_HARDENING_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hardens the Medium/Hard reinforcement expansion across live Manual battles, Simulation battles, loaded tactical states, procedural alien bases, and beacon waves too large to fit the protected six-cell ring at once.

DEPLOYMENT + LOAD CONTINUITY
----------------------------
- Manual and Simulation battles retain their distinct normal roster formulas, then apply the same difficulty multiplier. Easy and Medium remain 1x; Hard is exactly 2x in both paths.
- The final multi-Skyranger deployment layer now reserves enough unique legal alien cells for the live Hard roster. Low-threat Hard missions no longer create only three positions and collapse additional aliens onto a shared fallback center.
- Live procedural alien-base units preserve authored deck assignment and singular Pale Commander metadata.
- Loaded Medium tactical states from the prior one-wave implementation reopen only after a deterministic cooldown. A saved `arrived` latch cannot immediately duplicate the completed wave.
- The existing active-tactical save payload serializes reinforcement difficulty, wave number, caller, cooldown, pending arrival, and staged remainder without changing save format 4.

OVERSIZED BEACON WAVES
----------------------
- A Hard beacon wave larger than the six protected neighboring cells materializes as bounded subgroups under one committed wave identity.
- The first six arrive inside the shield. Any remainder retries on later rounds until protected cells clear; it never spawns outside the seven-hex shield or overlaps another unit.
- One wave retains exactly one commander, one wave number, and one arrival cinematic across all staged subgroups.
- Mission terminal authority continues to treat the unfinished remainder as a pending committed arrival.

VALIDATION
----------
- Embedded JavaScript syntax and whitespace checks pass.
- Focused browser diagnostics pass every Easy/Medium/Hard count, legacy migration, manual placement, alien-base roster, six-unit beacon, and staged eight-unit beacon contract.
- The eight-unit regression verifies six-plus-two materialization, eight persistent arrival IDs, one commander, protected arrival records, unique current cells, and no repeated arrival cinematic.
- Save format remains 4.

ROADMAP ADDITION
----------------
- Unescorted civilians and VIPs should instinctively seek nearby shelter/cover. Frightened civilians and VIPs should flee aliens they know about and prefer safer covered destinations when one is legally reachable.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.25.0902_MEDIUM_UNLIMITED_REINFORCEMENTS_AND_HARD_DOUBLE_DEPLOYMENT_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Alien Reinforcement Difficulty now has complete Easy, Medium, and Hard tactical rules. Medium can begin another bounded reinforcement cycle after an arrival instead of reaching a lifetime wave cap. Hard inherits that doctrine and doubles both initial alien rosters and every arriving wave.

DIFFICULTY CONTRACT
-------------------
- Easy retains its original bounded one-wave behavior, visual-contact pressure, and deterministic 5-15 round post-wipe missed check-in.
- Medium retains casualty pressure and the five-round commander-loss investigation, and now has no fixed total-wave limit while a living legal caller or active source remains.
- Hard uses the Medium call/casualty/check-in lifecycle and applies an exact 2x alien deployment multiplier.
- The selected difficulty is copied into a mission at launch. Loading a deployed force or changing the campaign setting later cannot multiply existing aliens again.

SEQUENTIAL REINFORCEMENT SAFETY
-------------------------------
- A completed Medium/Hard arrival installs that wave's singular commander as the next potential caller, clears the prior call, and begins a deterministic cooldown before another call is eligible.
- Only one arrival can be pending. Population pressure pauses later calls when the existing reinforcement force plus the next legal wave would exceed the established concurrent-reinforcement safeguard.
- A destroyed field beacon cancels later calls through that source. Existing VIP terminal-resolution and reinforcement-source rules remain authoritative.
- Later dropship waves retire the previous reinforcement craft presentation before placing the next one, preventing an unlimited sequence from accumulating obsolete hull cover.

HARD DOUBLE DEPLOYMENT
----------------------
- Normal Earth missions calculate their legal starting roster first and then double it on Hard.
- Procedural alien-base assaults likewise double their ordinary 15/18-defender roster while retaining one Pale Commander and one command core.
- Commander-called, missed-check-in, beacon, and dropship arrivals calculate the normal two-to-four-unit wave first and then double that result on Hard.
- Civilians, VIPs, AEGIS soldiers, scenery, objectives, unique commanders, and already-existing saved units are never doubled.

VALIDATION
----------
- Embedded JavaScript syntax passes for all five non-empty inline scripts.
- The standalone game boots without console errors and exposes Easy, Medium, and Hard in both new-game setup and Save / Load settings.
- The new deferred Build Health contract is green. It verifies preserved Easy counts, unchanged Medium initial counts, exact doubled Hard initial/wave counts, a second Medium call cycle, a real six-alien Hard beacon arrival, and exactly one commander in that arrival.
- Static build-seam validation passes against the synchronized index, manifest, patch notes, and game bible.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Run fixed-seed Earth and alien-base missions on Medium and Hard. Hard must deploy exactly twice the corresponding Medium alien roster with no duplicate unique commander.
2. Let at least five Medium reinforcement waves arrive while callers and the source remain legal. Confirm wave number, cooldown, one-pending-arrival ownership, and save/load continuity.
3. Repeat beacon and dropship arrivals on Hard. Each committed wave must contain exactly twice its normal roster in unique legal cells.
4. Destroy the beacon before and after a call commits, and complete every other mandatory objective. Confirm later calls stop and terminal mission authority remains unchanged.
5. Exercise Manual, Hybrid, and Simulation handoffs during cooldown, countdown, arrival, and the next call cycle.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.24.2345_TACTICAL_PROP_INGRESS_CLEARANCE_AND_STRUCTURAL_PRECEDENCE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Procedural Earth buildings now reserve their doorways and immediate inside/outside approach cells before scenery is accepted. Decorative/generated cover can no longer seal those lanes, and required building walls/windows/partitions now outrank conflicting prop records during medium/large perimeter restoration.

PROTECTED BUILDING INGRESS
--------------------------
- Every authored procedural building door produces one shared protected traversal mask containing the doorway itself plus every legal immediate interior and exterior approach cell.
- Street props consume the same mask after their ordinary deterministic generation. Vending machines, newspaper machines, benches, lamps, vehicles, and other scenery cannot retain a footprint that intrudes into a protected entrance lane.
- A blocked single-cell street prop may relocate to a nearby legal side cell rather than simply occupying the doorway approach. Multi-cell props are rejected when any footprint cell conflicts.
- The protection is footprint-aware rather than anchor-only, so future rotated or multi-cell props cannot hide part of their body inside a reserved lane.

FINAL GENERATION CLEARANCE + CONNECTIVITY
-----------------------------------------
- The completed Earth battlefield receives a final ingress-clearance pass after generic hard/soft cover placement. Rocks, trees, crates, vehicles, and other later-generated non-building cover are removed if they somehow occupy a protected doorway/approach cell.
- `tacticalBuildingIngressConnectivityState(...)` verifies that each procedural building retains at least one passable outside -> door -> interior route after generation.
- The rule is shared by synchronous generation and streamed/asynchronous tactical startup, preventing the two paths from producing different doorway legality.
- Procedural alien-base generation is explicitly excluded from the Earth-building repair layer so its dedicated bulkheads, elevators, and command-core reachability remain unchanged.

BUILDING STRUCTURAL PRECEDENCE
------------------------------
- Required authored wall, window, and partition cells are revalidated after the medium/large building-restoration pass.
- If a decorative, malformed, or future prop record occupies a required structural cell, the conflicting non-authoritative cover is removed and the authored building structure is restored.
- Existing correctly generated structural records are preserved rather than recreated, so the rule does not duplicate walls or windows.
- This closes the future collision seam where the older restoration code treated any occupied cell as sufficient reason to skip a missing building segment.

PRESERVED AUTHORITY
-------------------
- Door geometry, building footprints, cover HP, destruction, windows, LOS, fog, lighting, movement costs, AI knowledge, civilian/VIP escort rules, Skyranger placement, and mission resolution are otherwise unchanged.
- The patch changes new battlefield generation integrity only; it does not make solid props passable after placement.
- Save format remains 4.

VALIDATION
----------
- Embedded JavaScript syntax passes `node --check` for every inline script.
- The new deterministic Build Health contract passes a deliberate medium-map fixture where a vending-machine cover occupies a required outer wall cell; the vending machine is removed and the authored wall/window is restored.
- Full-CSS deferred Build Health passes 69/74 checks versus 68/73 in Browser 2251. The new ingress/structural-precedence contract is the added pass; the same five pre-existing unrelated AI/camera/tutorial checks remain red.
- A deterministic stress audit generated 648 Earth missions across all six supported regions and Small/Medium/Large tactical sizes. All 648 retained clear protected prop footprints and at least one valid outside-to-door-to-interior route for every generated building.
- The procedural alien-base reachability contract remains green after explicitly excluding alien-base layouts from the Earth-building repair layer.
- Browser 2115 VIP boarding and Browser 2251 roof/cutaway regressions continue to pass in the shared suite.

MANUAL TEST GATES
-----------------
1. Generate city/town maps with markets, offices, residences, workshops, diners, barns, and outposts. Confirm vending/newspaper machines and other props can appear near doors but never on the doorway or immediate approach cells.
2. Stress dense scenery near entrances, including multi-hex vehicles and hard cover. Confirm every building retains a usable outside -> door -> interior route in 2D and 3D Iso.
3. Run Manual, Hybrid, and Simulation movement/escort traffic through those entrances. No mode should need to walk through scenery, teleport, or repeatedly recover from a generation-created blockage.
4. Exercise Medium 80x80 and Large 96x96 maps with outer-district buildings. Confirm restored walls/windows appear even if a conflicting decorative cover record is deliberately introduced in the same cell.
5. Repeat roof/cutaway playtesting on repaired entrances and confirm the presentation layer follows the same intact/damaged building structure without affecting pathing.
6. Run an alien-base assault and confirm its dedicated bulkheads, elevators, defenders, command core, and reachability remain unchanged.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.24.2251_TACTICAL_BUILDING_ROOFS_AND_PLAYER_AWARE_CUTAWAY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Discovered procedural buildings now appear as complete roofed structures in the persistent Three.js tactical renderer. Roofs automatically and smoothly cut away only when needed to keep known AEGIS soldiers readable, including camera occlusion in 3D Iso, FPV, TPV, and incoming-fire views.

PERSISTENT BUILDING ROOFS
-------------------------
- Every discovered procedural building receives a presentation-only roof group aligned to the authored building footprint rather than remaining permanently open at the top.
- Roof color and pitch follow the mission's regional architecture profile. Flat/parapet environments remain flatter, while pitched, tiled, deep-eave, and steep-eave environments receive progressively stronger roof rise and pitch.
- Roof panels reuse the existing persistent hex geometry. Soldier movement and selection change only roof presentation state and do not rebuild terrain, walls, cover, or the complete battlefield scene.
- Structural damage darkens the roof treatment and destroyed/breached perimeter structure can produce bounded presentation gaps near the committed damaged edge.

PLAYER-AWARE AUTOMATIC CUTAWAY
------------------------------
- A building containing any living AEGIS soldier fades automatically so its interior remains readable.
- The building containing the currently selected AEGIS soldier receives the clearest isometric cutaway. Other simultaneously occupied buildings retain a lighter translucent roof so multiple fire teams can still be tracked.
- FPV, TPV, and incoming-fire reaction observers receive the strongest cutaway for the known AEGIS actor being followed.
- The active camera also ray-tests only toward the known selected/observed AEGIS actor. If another roof blocks that sightline, that roof temporarily fades as an occluder and restores afterward.
- Alien, civilian, VIP, item, reinforcement, and objective positions are not consulted when choosing cutaway state. Hidden occupants therefore cannot cause a roof to fade or leak tactical knowledge.

SMOOTH PERSISTENT PRESENTATION
------------------------------
- Roof opacity eases over a bounded 360 ms transition inside the existing persistent renderer animation loop rather than popping between visible and hidden states.
- Each building owns an independent roof material set, so one cutaway never makes every roof transparent.
- Roof details fade with the parent roof instead of remaining as floating opaque objects over an exposed interior.
- Roof groups remain inside the existing persistent cover scene and are cleaned up through the existing renderer disposal path.

PRESERVED TACTICAL AUTHORITY
----------------------------
- Roofs are presentation only. They do not add movement levels, collision, hard cover, shot blocking, LOS blocking, light blocking, accuracy modifiers, path costs, or AI knowledge.
- Fog, explored state, windows, doors, structural destruction, fire-team movement, VIP/civilian escort routing, targeting, damage, mission resolution, and save/load remain authoritative and unchanged.
- Save format remains 4.

VALIDATION
----------
- Embedded JavaScript passes `node --check`.
- Critical boot smoke passes and the rendered start screen reports the synchronized Browser 2251 build ID without a runtime-error panel.
- Added a deterministic Build Health contract proving that living AEGIS occupancy/selection/perspective causes the expected cutaway while alien/civilian-only occupancy does not.
- The comparable full deferred headless suite passes 68/73 checks versus 67/72 in Browser 2115. The new roof/cutaway contract passes and the same five pre-existing unrelated AI/camera/tutorial contracts remain red.
- The prior Browser 2115 VIP/civilian Skyranger boarding regression still passes.

MANUAL TEST GATES
-----------------
1. Enter a discovered building with one AEGIS soldier in 3D Iso. Confirm its roof fades smoothly and restores after the soldier leaves.
2. Put AEGIS soldiers in two buildings, select each in turn, and confirm the selected building gets the clearest cutaway while the other occupied building remains lightly translucent.
3. Rotate/pan the Iso camera so another roof lies between the camera and the selected soldier; confirm only the occluding roof fades and restores when the sightline clears.
4. Repeat inside buildings in FPV, TPV, and an incoming-fire reaction camera. Interior units, doors, windows, cover, and hazards should remain readable without permanent roof disappearance.
5. Place hidden aliens, civilians, VIPs, items, and objectives inside unrevealed buildings without AEGIS occupants. Confirm their presence cannot trigger a roof cutaway or bypass fog/LOS.
6. Damage/breach perimeter walls and confirm bounded roof damage presentation follows the committed structure while combat/pathing results remain unchanged.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.24.2115_VIP_SKYRANGER_BOARDING_PLAYBACK_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Escorted civilians and VIPs now remain visible for their complete final boarding movement. They walk onto the real Skyranger ramp, continue into the passable troop-bay aisle, and are removed from tactical rendering only after the last boarding animation step finishes.

FULL SKYRANGER BOARDING PATH
----------------------------
- Civilian/VIP extraction no longer completes on the first ramp hex.
- Each player Skyranger uses the innermost cell of its saved passable ramp/aisle sequence as the civilian handoff point, so evacuees visibly traverse the ramp and enter the craft before extraction completes.
- The boarding target follows the craft's real saved heading and ramp sequence. North, south, east, west, and diagonal seeded Skyranger orientations therefore use the same authoritative geometry.
- The existing ramp corridor remains passable and available for escort traffic; only the final interior boarding cell commits `rescued` / `extracted` for civilians and VIPs.

PLAYBACK / RENDER COMMIT ORDER
------------------------------
- The Simulation/Hybrid resolver may know that a VIP will finish boarding during the round, but the playback frame no longer culls that unit immediately from the final snapshot.
- A rescued civilian with a recorded final movement trail is treated as a pending presentation transition. Playback begins from the previous visible, unextracted state and animates every recorded step.
- Only after the movement trail reaches the interior boarding cell does playback apply the authoritative rescued/extracted state and remove the model from the battlefield.
- This specifically fixes the case where a VIP vanished before even touching the ramp because the planner had already determined that extraction would occur later in the same round.

PRESERVED AUTHORITY
-------------------
- Mission scoring, rescue quotas, post-extraction escort release, Skyranger traffic reservations, fire-team formation, TU, fog, LOS, AI knowledge, and terminal mission rules are unchanged.
- Save format remains 4.

VALIDATION
----------
- Embedded JavaScript passes `node --check` after the patch.
- Added a deterministic Build Health contract covering orientation-aware interior boarding, first-ramp non-extraction, final boarding-cell extraction, and preservation of a visible pre-extraction playback state while the final movement trail is pending.
- Deferred headless Build Health passes 67/72 checks versus 66/71 in the uploaded Browser 1745 baseline. The new boarding contract passes, and the same five pre-existing unrelated AI/camera/tutorial checks remain red.
- Manual test gate: observe an escorted VIP/civilian from outside the ramp through boarding under Simulation and Hybrid. The unit must remain visible outside, step onto the ramp, continue into the troop bay, and disappear only after the final interior step.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.1745_GLOBALLY_SEEDED_OPENING_INCIDENT_PAIR_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
New campaigns now begin with a deterministic pair of alien crises selected across all six supported world regions instead of always starting in North America, while retaining a legal one-base starting Skyranger response.

GLOBALLY SEEDED OPENING PAIR
----------------------------
- Opening sites are selected from curated playable land coordinates in North America, South America, Europe, North Africa, East Asia, and Oceania.
- A stable seed chooses a region, two distinct sites, and bounded incident archetypes; an explicit seed always reproduces the same identities and coordinates.
- The first-base preview and committed new campaign share the same session seed. Campaign data records `openingIncidentSeed` and the resulting mission records.
- Incident names, alien types, rewards, and panic values vary without inspecting the player's later choices or revealing hidden strategic information.

ONE-BASE RESPONSE GUARANTEE
---------------------------
- Every generated pair is validated against the authoritative starting Skyranger sortie radius and normal Geoscape distance helpers.
- The generator proves at least one practical candidate command site can reach both incidents. If that proof ever fails, the known-safe legacy pair remains a bounded fallback.
- Existing first-base range rings and the explicit 0/2, 1/2, or 2/2 reach summary remain authoritative. The patch grants no extra range, fuel, free travel, or mission time.

COMPATIBILITY AND VALIDATION
----------------------------
- Existing saves retain their recorded incidents. Later procedural incidents, aircraft rules, radar, fog, tactical difficulty, and regional panic are unchanged; save format remains 4.
- Deterministic coverage samples 120 seeds, requires all six regions, stable pairs, distinct incidents, and a viable all-reachable first-base site for every sample.
- Full browser Build Health passes 474/518 checks versus the prior 473/517 baseline, including the new contract and the preserved legacy first-base diagnostic fixtures.
- Embedded JavaScript syntax and the build-seam checker pass for the current build.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.1730_SEEDED_SKYRANGER_LANDING_AND_ORIENTATION_VARIETY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Skyrangers now approach suitable battlefield perimeter regions and face varied hex-grid headings selected reproducibly from the mission seed, while their real ramp geometry remains authoritative for deployment and extraction.

SEEDED LANDING VARIETY
----------------------
- Single- and multi-Skyranger missions distribute their initial approach anchors across north, east, south, and west perimeter bands instead of repeating fixed north or northwest/southeast layouts.
- All six hex-grid headings are eligible. A craft can point diagonally or broadly along an edge rather than always aiming its ramp toward the map center.
- Selection is deterministic from the mission seed and transport index, so save/load, Hybrid handoff, Simulation playback, and continued battles retain the same landing geometry.
- The bounded placement search validates every hull, ramp, rear deployment lane, and staging cell against the playable map boundary, buildings, intact land vehicles, indestructible objectives, and previously placed Skyrangers.
- If generated terrain offers no new legal candidate, the existing bounded placement authority remains available as a safe compatibility fallback.

ORIENTATION-AWARE EXTRACTION
----------------------------
- Each craft now records its forward/rear direction, body and nose cells, rear deployment lane, chosen perimeter band, and placement seed.
- Soldier deployment, ramp extraction, evacuation traffic reservations, escort guards, and post-extraction egress follow the craft's actual saved heading instead of assuming north/south movement.
- The persistent Three.js model derives its rotation from the same body-to-nose geometry used by tactical pathing, keeping the visible ramp aligned with the real extraction cells.
- Legacy tactical saves without the new heading fields continue using their recorded north/south body sign.

PRESERVED AUTHORITY
-------------------
- Skyranger capacity, squad ownership, TU costs, LOS, fog of war, alien knowledge, objective priority, and mission resolution are unchanged.
- Candidate scoring uses only generated battlefield scenery and mission seed data; it never inspects hidden alien positions.
- Save format remains 4.

VALIDATION
----------
- Added deterministic coverage across 24 seeds for all four perimeter regions and at least five of six headings.
- The contract verifies continuous ramp direction, complete in-bounds footprints, extraction egress alignment, two-craft clearance, intact-vehicle avoidance, outside-ramp escort positions, and shared renderer heading use.
- Embedded JavaScript syntax and the build-seam checker pass for the current build.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.1650_EMPTY_CRASHED_UFO_BAY_VICTORY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Crashed-UFO missions now end when the alien force is truly eliminated instead of requiring an 8 TU inspection of an empty deployment bay.

EMPTY UFO-BAY VICTORY
---------------------
- A confirmed crashed-UFO bay remains a priority while at least one authoritative living alien remains on the battlefield.
- Once the complete living-alien count reaches zero, an uninspected bay becomes Secured by Elimination and no longer blocks mission victory.
- The rule uses the authoritative roster rather than visible contacts, so a concealed or undiscovered living alien still prevents completion.
- Full Simulation and Hybrid support logic stop assigning an inspection team after elimination and proceed through the shared terminal mission state.
- Manual inspection is no longer required after elimination; the existing inspection interaction remains available while living aliens make bay verification relevant.

PRESERVED TERMINAL RULES
------------------------
- A reinforcement arrival already called and committed still blocks victory until its existing arrival or cancellation state resolves.
- Mandatory rescue quotas, field beacons, alien-base command centers, and other required objectives remain independent completion gates.
- Manual, Hybrid, streamed Simulation, control handoff, and loaded tactical state consume the same empty-bay resolution rule.
- Save format remains 4.

VALIDATION
----------
- Added deterministic coverage for an empty uninspected bay, a hidden living alien, a committed reinforcement arrival, AI continuation, manual inspection state, and terminal victory.
- Updated the earlier reinforcement-source and crash-site stall contracts to enforce the simplified result instead of the superseded mandatory post-combat inspection.
- Embedded JavaScript syntax and the build-seam checker pass for the current build.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.1502_LEADERSHIP_UNDER_FEAR_AND_UNIFIED_TACTICAL_STATUS_HUD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fire teams now maintain a temporary chain of command when a leader is overcome by fear, and 3D Iso, First Person, and Third Person share one authoritative soldier-status panel.

LEADERSHIP UNDER FEAR
---------------------
- A panicked fire-team leader retains permanent rank and roster identity but temporarily stops providing command/morale support. Existing player orders remain attached to the team.
- The best living, non-overridden support becomes acting leader. Formation, escort, objective, and fire-team-leader helpers resolve through the deputy until safe round-boundary restoration.
- Teammates who witness the panic or receive a nearby fire-team report record one deduplicated leadership shock. They can hold a known fight, preserve an active escort, cover withdrawal, or assume command instead of blindly following the frightened leader.
- If neither a visible contact nor an active escort has priority, one adjacent eligible support can spend 8 TU to rally the leader. Its +14 modifier applies only to the next ordinary recovery check and cannot manufacture a second roll.
- Command disruption, deputy assignment, response, rally, and restoration persist through Simulation frames, Hybrid/manual handoffs, observer playback, and saved tactical continuation.

UNIFIED 3D TACTICAL STATUS HUD
------------------------------
- 3D Iso, First Person, and Third Person now use the same upper-right component and authoritative observed/selected soldier.
- The panel shows name, rank, weapon, HP, TU, ammunition, fire-team role, effective/formal command, AI reserve/final action, and current objective/order.
- Compact badges expose Panicked, Shaken, Pinned, Wounded, Bleeding when present, Kneeling, Fire, Smoke, Acting Leader, Command Disrupted, and Escort Duty.
- Badge explanations use the existing optional global hover-help system and its three-second pointer delay.

VALIDATION
----------
- The embedded-JavaScript syntax check and build-seam check pass.
- The new deterministic browser contract passes for deputy selection, one leadership-shock event, rally TU/payment, next-check-only recovery bonus, command restoration, persistence, and shared HUD/status output.
- The complete deferred Build Health suite was exercised in headless Chrome: 63/68 checks pass. The five existing red contracts are older AI/camera/tutorial contract drift and are not in this patch's leadership/HUD seam.
- Save format remains 4.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.1115_BRAVERY_FEAR_AND_TACTICAL_CINEMATIC_FRAMEWORK_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Bravery now governs deterministic tactical fear and recovery for AEGIS soldiers and aliens, ordinary lethal hits and scenery destruction receive readable transitions, and reinforcement craft cinematics preserve fog-of-war knowledge.

BRAVERY, MORALE PRESSURE, AND FEAR
----------------------------------
- AEGIS personnel use their existing Bravery stat; alien Bravery is derived from species and command rank without exposing hidden numeric alien statistics to the player.
- Only perceived events contribute: personal wounds, recent incoming fire, nearby visible ally or leader losses, visible hostiles, numerical pressure, isolation, fire/smoke, nearby allies, active leadership, and useful cover.
- Steady, Shaken, Pinned, and Fear Override states persist in the authoritative unit snapshot. Shaken and Pinned states apply bounded accuracy penalties.
- A unit already under Fear Override receives exactly one deterministic recovery check at the start of each eligible unit-turn. The roll ID persists through playback, take-back control, Hybrid/Simulation handoff, save/load, and view changes so it cannot be rerolled.
- Failed recovery may force a freeze, cover-seeking move, or fallback. Forced movement uses the normal path, occupancy, vehicle-footprint, structure, hazard, level, and map-boundary authority, consumes the rest of the turn, and preserves fire-team and escort identity.
- Tactical Readability displays exact AEGIS Bravery and current morale state. Alien behavior can be observed without disclosing its hidden Bravery score.

SHARED TACTICAL CINEMATICS
--------------------------
- VIP/civilian fatalities, ordinary AEGIS/alien deaths, objective/scenery destruction, and reinforcement arrivals now feed one bounded tactical cinematic presentation queue.
- The persistent Three.js renderer retains the existing unit node through an ordinary lethal result and animates an impact/collapse before settling into the corpse pose. Existing rare Critical Kill dismemberment remains the specialized priority case.
- Destroyed or breached scenery creates a bounded debris-and-smoke transition from the persistent effect layer instead of only disappearing during the next cover rebuild.
- Gameplay remains immediate and authoritative: HP, death, target invalidation, objective state, reinforcement cancellation, mission resolution, and recovery bookkeeping do not wait for presentation.

KNOWLEDGE-LIMITED REINFORCEMENT ARRIVALS
----------------------------------------
- An observed craft landing or beacon materialization may focus the verified location and identify the detected arrival count.
- An unobserved craft produces only a screen-space overhead-pass beat. Its playback record omits landing coordinates and cannot reveal terrain, ramp orientation, aliens, camera direction, or exact positional audio at the hidden site.
- Existing fog, LOS, alien visibility, reinforcement timing, and AI knowledge remain unchanged.

SESSION AND VALIDATION
----------------------
- Fresh sessions start with the command header minimized; Show Header remains immediately available.
- Build Health covers deterministic Bravery ordering, once-per-turn recovery, forced-turn consumption, hidden reinforcement focus suppression, persistent death signatures, and the minimized-header default.
- tools/check-embedded-js.cjs now provides a reusable syntax-only check for every non-empty embedded JavaScript block.
- Save format remains 4.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.0955_VIP_ESCORT_INGRESS_AND_COVERED_REPEAT_FIRE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
VIPs immediately shed dead or missing escort ownership, crowded Skyranger entrances make friendly traffic yield, and AEGIS soldiers can hold useful cover for multiple legal shots instead of moving by default.

ORPHANED ESCORT RECOVERY
------------------------
- A living VIP or civilian whose escort ID no longer resolves to a living AEGIS soldier becomes Unescorted immediately. The one-full-round grace period remains only for a living escort who temporarily loses sight.
- Dead-team VIP assignments, recall orders, extraction guards, priority claims, and rescue-route latches are cleared at round start, manual/AI handoff, streamed continuation, and loaded-state battlefield repair.
- The released VIP remains revealed, retains its last escort and fire-team identity for reporting, and becomes eligible for same-round assignment to another living fire-team leader.

CROWDED SKYRANGER INGRESS
-------------------------
- The rear ramp mouth is treated as a reserved evacuation lane rather than an ordinary idle/guard position while an escorted VIP is waiting to enter.
- A living friendly soldier blocking the ramp mouth yields one legal adjacent cell, spends the normal 4 TU, clears stale extraction-guard state, and receives an explicit playback trail before the VIP advances.
- Other VIPs queue instead of overlapping. Hard cover, Skyranger hull cells, vehicles, hazards, unrelated occupancy, insufficient TU, and immediate visible threats remain authoritative blockers.
- Per-VIP no-progress state now records failed final approaches and forces route rebuilding instead of repeatedly accepting a zero-step extraction plan.

COVERED HOLD + REPEAT FIRE
--------------------------
- Before moving, every non-escort AEGIS actor checks whether the current hex already provides legal range, personal LOS, acceptable fire-team cohesion, no immediate hazard, and useful threat-facing cover.
- A valid position produces Hold Cover + Fire instead of compulsory movement. Hybrid supports may retain useful flanking cover when already acceptably formed around their leader.
- After each committed shot, the AI checks the live target, personal visibility, cover relationship, TU, ammunition, and chosen reserve again. It can spend up to four legal shot actions from the same position and immediately stops when any requirement fails.
- Explicit Hybrid leader destinations, rescue/escort duties, hazards, reinforcement-source objectives, and badly broken formation remain higher-authority reasons to move.

VALIDATION
----------
- Build Health covers a VIP orphaned by a wiped-out fire team, same-round reassignment, loaded-state repair, a friendly soldier yielding from a crowded ramp mouth, unique occupancy, useful covered holds, formation rejection, and TU/ammunition-bounded repeat-fire budgets.
- Save format remains 4.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.24.0845_UFO_UPRIGHT_AND_ALIEN_VEHICLE_PATHING_INTEGRITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Detected UFOs remain visually upright on both Geoscape views while alien movement, reinforcements, playback, and loaded-state repair consistently respect every intact land-vehicle footprint cell.

UPRIGHT UFO PRESENTATION
------------------------
- The shared Globe and Terminator Map UFO body is now an upright billboard. Its bright dome always remains above the saucer and its underside lights always remain below it.
- Travel heading now rotates a small independent direction chevron instead of rotating the complete craft body. North, south, east, west, route reversal, Globe rotation, limb movement, and date-line travel cannot flip the canopy underneath the hull.
- Contact location, interpolation, size, damage, detection, radar knowledge, pursuit, interception, and strategic movement remain authoritative and unchanged.

ALIEN VEHICLE-PATHING INTEGRITY
-------------------------------
- Ordinary alien routing, pursuit, flanking, search, exfiltration, emergency movement, authoritative per-step commits, streamed playback reconstruction, and save/load repair use the same complete hard-cover footprint index as AEGIS movement.
- Alien dropship placement now rejects any landing footprint that overlaps an intact land vehicle.
- Dropship reinforcement spawn cells now validate against retained battlefield cover as well as the arriving craft, closing the gap that could place an alien inside a car, van, utility vehicle, truck, or bus.
- Beacon reinforcement cells already used the complete hard-cover footprint and remain under that same authority.
- Destroyed vehicles retain their established passable wreck/rubble state. This patch does not change vehicle HP, durability, damage, explosions, fire, smoke, cover, LOS, TU costs, or alien knowledge.

VALIDATION
----------
- Build Health covers upright body orientation at four cardinal headings, heading wraparound, and shared renderer ownership.
- Alien regressions cover path planning, final step rejection, playback reconstruction, loaded-state relocation, dropship landing and spawn placement, and restored passability after vehicle destruction.
- Save format remains 4.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.2345_GLOBE_TERMINATOR_UFO_VISUAL_PARITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Detected UFO contacts on the persistent Three.js Globe now use the same recognizable alien-craft visual language as the Terminator Map instead of reading as generic oval markers.

SHARED ALIEN-CRAFT MARKER
-------------------------
- The Globe and player-facing Terminator Map now call one imperative-canvas UFO renderer.
- The shared silhouette includes a violet/magenta saucer hull, bright raised dome, side vanes, luminous underside nodes, bounded glow, and damage-readable hull accents.
- Small, Medium, Large, and Very Large contacts use increasing but bounded silhouette scales.
- Existing previous/current visual locations supply travel orientation, including shortest-path date-line handling.
- Globe contacts receive a restrained limb scale so they stay legible without floating away from or becoming oversized against Earth.

PRESERVED AUTHORITY
-------------------
- The existing detected-and-flying gate remains unchanged; unresolved and hidden contacts receive no marker.
- Contact identity, authoritative position, shared Globe/Map interpolation, route progress, damage, radar knowledge, selection/list controls, pursuit, interception, and time compression remain unchanged.
- The existing persistent canvas overlays own the visuals. No React-per-contact tree, second craft-position stream, or gameplay timer was added.
- Save format remains 4.

VALIDATION
----------
- Build Health checks ordered size scaling, damage styling, shortest-path date-line heading, the detected-flying gate, and shared renderer use in both player-facing overlays.
- Static validation checks the patch marker, shared renderer, visual-state and heading helpers, current build labels, and save compatibility.

ROADMAP ADDITION
----------------
- Added covered firing-position hold doctrine: an AI soldier who already has legal LOS, weapon range, and useful threat-facing cover should be allowed to remain in place and fire without compulsory movement.
- If TU, ammunition, fire mode, reserve doctrine, target life, and current visibility continue to permit it, the soldier may take multiple shots from that advantageous position, reassessing after every committed shot.
- Movement remains appropriate when it materially improves the solution or is required by hazards, objectives, escort/casualty duties, explicit player orders, or formation/survival authority.

MANUAL TEST GATES
-----------------
1. Compare detected Small, Medium, Large, and Very Large contacts side by side on the Globe and Terminator Map.
2. Switch views while time is running and confirm the same contact keeps its identity, interpolated position, heading, and damage appearance.
3. Rotate a contact toward the Globe limb and follow one across the date line; confirm stable attachment, scale, and continuity.
4. Confirm unresolved/undetected contacts remain hidden and interception behavior is unchanged.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.2145_ESCORT_CORNER_MOBILE_TRAFFIC_YIELD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Active civilian and VIP escort columns no longer burn rounds at exterior building corners merely because a supporting soldier occupies the leader's next legal route hex.

ATOMIC MOBILE-TRAFFIC YIELD
---------------------------
- Escort route planning already treated the leader, followers, and same fire team as mobile formation traffic. The final movement boundary now honors that same ownership without weakening normal occupancy.
- When an eligible support or escorted follower occupies the next planned escort step, that unit first yields to one legal adjacent side/rear cell and the leader then commits the original step.
- Human supports spend the normal 4 TU for the yield and are excluded from the later formation adjustment for that leader step, preventing a second move or snap-back animation.
- Escorted civilians/VIPs retain the established follower movement authority and escort identity.

PROTECTED BOUNDARIES
--------------------
- Player-held Hybrid leaders, unrelated units, another active escort owner, supports already moved by building-egress clearance, and supports without enough TU remain fixed blockers.
- Yield cells reject hard cover, intact land-vehicle footprints, occupied cells, extraction cells, hazards by the existing ranking, and building re-entry after the column has committed outdoors.
- Stay / Ask / Engage doctrine and normal leader-relative formation resume from the committed positions.

TRUTHFUL STALL RECOVERY
-----------------------
- Rescue movement records a route step only when the escort leader actually changes cells.
- A rejected step immediately stops the remaining route instead of attempting later non-adjacent cells.
- Failed movement now increments the existing rescue stall counter, allowing bounded route recovery instead of resetting the counter with false progress every round.

VALIDATION
----------
- Build Health covers a same-team support yielding exactly one hex for exactly 4 TU, unique final occupancy, retained VIP escort ownership, and successful leader progress.
- It also confirms unrelated units, already-acted supports, and zero-TU supports are not displaced.
- Live Build Health also repaired the previous contact-replan contract so it inspects the owning TacticalMission source instead of trying to reference its nested playback helper from global scope.
- Static validation requires the yield helper, committed-progress break, patch marker, and deferred Build Health row.
- Save format remains 4. Fog, LOS, AI knowledge, damage, mission resolution, building solidity, vehicle footprints, and Hybrid command ownership remain authoritative.

MANUAL TEST GATES
-----------------
1. Resume a Stay With Escort column beside an exterior building corner and confirm a blocking support yields once, the leader and VIP continue, and the team reforms outside.
2. Repeat with two supports, another escort column nearby, an intact vehicle, fire/smoke, and a narrow wall lane; confirm no overlap, wall crossing, vehicle crossing, free TU, or double movement.
3. Repeat in full Simulation and Hybrid support playback and confirm player-held leaders remain player controlled.
4. Block every legal yield cell and confirm the round reports a real stall/retry instead of silently counting progress.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.2045_NEW_CONTACT_INTERRUPT_REMAINING_ROUND_REPLAN_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
AI-controlled tactical rounds now visibly pause when an AEGIS soldier newly spots an alien, then recalculate every remaining unplayed fire-team action from that verified contact. Completed movement and combat remain committed.

AUTHORITATIVE CONTACT INTERRUPT
-------------------------------
- A contact interrupt occurs only when a living alien becomes personally visible to a living AEGIS observer through the current range, tactical-level, facing, lighting, smoke, wall, door, and window LOS rules.
- Persistent reveal flags, remembered coordinates, another side's knowledge, and hidden aliens cannot create the interrupt.
- Each alien identity can trigger at most once in a round, preventing repeated visibility changes from producing an interrupt loop.
- Escort movement and the emergency grid-search fallback use the same contact checkpoint as ordinary Simulation and Hybrid support movement.

REMAINING-ACTION REPLAN
-----------------------
- The discovering actor's atomic action finishes first. Its position, spent TU/ammunition, reveal, shot, damage, kills, escort progress, and formation state are never refunded or replayed.
- Only living AEGIS actors whose actions have not begun are marked for the contact replan.
- Those remaining actors recompute against the live battlefield. Full Simulation drops quiet formation, beacon, UFO-bay, and patrol priorities while a visible alien is present and returns to normal contact movement, cover, flanking, and fire decisions.
- Hybrid keeps player-directed fire-team leader orders. Supporting soldiers retain established enemy-relative flanking and the mission's Ask / Stay / Engage escort-support doctrine instead of changing control mode.

PLAYBACK
--------
- Streamed Tactical Map playback inserts a dedicated **Contact - replanning remaining fire teams** hold after the discovering actor's committed action.
- The hold reveals only the verified contact identities and carries no movement or weapon action of its own.
- Recalculated actors then resume in the existing sequential playback stream; completed actors do not receive another action or animation.

VALIDATION
----------
- Build Health covers valid contact acquisition, solid-wall rejection, same-round deduplication, exact remaining-actor ownership, no mutation by the contact-record helper, verified target reveal during the hold, and playback ordering before the next actor.
- The static build seam requires the new contact helper, interrupt/replan patch marker, playback hold, and Build Health contract.
- Save format remains 4. Fog, LOS, TU, ammunition, damage, fire-team formation, escort doctrine, mission resolution, and AI knowledge remain authoritative.

MANUAL TEST GATES
-----------------
1. Start a no-contact Simulation round with several fire teams. Let an early soldier reveal an alien while moving; confirm playback pauses after that soldier and later units switch from search/quiet formation to legal contact behavior.
2. Repeat with the alien behind a solid wall, closed door, smoke, and nighttime vision boundary. Confirm no interrupt occurs until personal LOS is genuinely established.
3. Repeat in Hybrid with a player-directed leader waypoint and supporting soldiers. Confirm the leader order remains player-owned, supports replan/flank, and control returns to Hybrid rather than full Simulation.
4. Confirm the discovering soldier does not regain TU, replay movement, or act twice, and the same alien cannot repeatedly interrupt one round.
5. Repeat during an active VIP escort under Ask, Stay, and Engage, and across streamed continuation plus active-mission save/load.

ROADMAP DOCUMENTATION
---------------------
- Added future Globe / Terminator Map UFO visual parity: recognizable alien-craft silhouette, color, glow, class, selection, and damage presentation without changing strategic detection or interception rules.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.1930_SUPPORT_FIRST_ESCORT_BUILDING_EGRESS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Prevents supporting soldiers from trapping an active civilian or VIP escort inside a procedural building. In quiet structures, supports now clear the selected door or breach and exterior lane before the escort owner advances the column.

SUPPORT-FIRST BUILDING EGRESS
-----------------------------
- The rule follows the soldier who actually owns the escort, including a support-owned escort, rather than assuming the formal fire-team leader owns every civilian column.
- It activates only while the escort owner and a living follower share a building and a same-team support occupies that building, the selected opening, or the reserved exterior lane.
- A legal door or already-destroyed wall breach is selected with the existing bounded, hazard-aware exit planner. The leader/follower route, opening, first exterior cell, and onward lane are reserved for the column.
- Contending supports move first toward legal exterior side/perimeter positions. Supports already outside do not re-enter the building to restore formation.
- If a support cannot finish clearing in one bounded move, the escort owner holds instead of colliding, teleporting, or walking through the soldier. Clearance resumes from the authoritative positions next round.

ACTION AND KNOWLEDGE INTEGRITY
------------------------------
- Each support spends 4 TU per committed hex and retains the AI-selected shot reserve. Movement remains capped at eight steps and obeys hard cover, live vehicle footprints, fire/smoke costs, extraction traffic, and living occupancy.
- A support moved during clearance is marked as already acted and is excluded from the column's later formation adjustment, preventing a duplicate action or second movement animation.
- A living alien authoritatively known inside the structure suppresses quiet egress; contact behavior and the mission's Ask / Stay / Engage escort-support doctrine remain authoritative.
- Unobserved aliens are excluded from route planning. They can block a real attempted cell commit, but their hidden position cannot silently change the chosen exit.
- The same rescue scheduler feeds full Simulation, Hybrid support rounds, streamed continuation, and active tactical saves. Hybrid leader control is not converted into full AI command.

VALIDATION
----------
- Build Health covers support-first ordering, exact TU spending, exterior clearance, leader hold, known-contact suppression, hidden-contact planning isolation, rescue-duty ownership, and duplicate-formation exclusion.
- Existing VIP rescue quotas, fire-team formation, extraction flow, LOS/fog, hazards, vehicle solidity, save/load, and save format 4 remain authoritative.

MANUAL TEST GATES
-----------------
1. Escort a VIP from a procedural building with one or more supports between the escort owner and door. Under Simulation, confirm supports clear outside first and the column then exits through the selected opening.
2. Repeat in Hybrid after moving the fire-team lead and ending the turn. Confirm supports clear/follow without a second movement phase and control returns to the player.
3. Place a visible living alien inside the same building. Confirm normal contact and escort-support doctrine replace quiet clearance.
4. Repeat with a hidden alien, smoke/fire, an existing breach, a vehicle near the door, and another fire team outside. Confirm no hidden-information route change, illegal overlap, teleport, or extra TU.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.1750_POST_RESCUE_BEACON_ASSAULT_HANDOFF_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Stops the post-rescue beacon phase from burning empty rounds at the Skyranger or sending one soldier along an unproductive edge route, while restoring normal supporting-soldier following during Hybrid turns.

CONFIRMED LIVE CAUSE
--------------------
- The live operation had completed all three VIP extractions, had no remaining alien units, and retained a confirmed 72/72 HP field beacon.
- Full Simulation's beacon endgame assigned one soldier while every non-assaulting soldier more than three hexes away was incorrectly treated as already clear of the beacon perimeter and ordered to hold.
- The assaulter selector could prefer a zero-TU fire-team lead held by Hybrid authority over an available support soldier.
- Hybrid inherited the full-Simulation solo-assault override, which suppressed leader-relative formation targets and made supporting soldiers stand still even after the player moved their leads.

BEACON ASSAULT HANDOFF
----------------------
- Full Simulation now favors a breach-capable soldier with usable TU as the endgame assaulter.
- Close-assault pathing prefers a reachable bounded move that reduces beacon distance when a hazard-aware route initially heads away. If a complete shield-entry route cannot be built in one planning pass, a legal local approach step keeps the assault advancing.
- Other soldiers advance toward legal positions three to five hexes from the beacon instead of holding at any distance. Once staged, they leave the shield and its immediate approach clear for the assaulter.
- The normal watchdog still requires beacon HP reduction, shield entry, or reduced assaulter distance before a round counts as objective progress.

HYBRID FORMATION AUTHORITY
--------------------------
- Hybrid no longer applies the full-Simulation solo-assault and distant-perimeter hold override.
- Player-directed fire-team leads remain under player control, and supporting soldiers again calculate and move toward their established leader-relative formation cells.
- Capable supports can attack the beacon after following their leader into a legal firing position, including entering the seven-hex shield when required.

VALIDATION
----------
- Build Health covers zero-TU leader selection, goal-directed shield approach, distant perimeter advance, and the Simulation-versus-Hybrid authority split.
- Existing completed-escort cleanup, TU spending, occupancy, vehicle footprints, hazards, shield compatibility, fog, LOS, AI knowledge, and mission resolution remain authoritative.

MANUAL TEST GATES
-----------------
1. Continue the affected operation from a live tactical save or hand control back to Simulation. Confirm at least one capable assaulter reduces beacon distance every round and the rest of the squad advances to the outer perimeter.
2. Take control, enable Hybrid, move each fire-team lead, and run the Hybrid support turn. Confirm supports follow their own lead rather than remaining at the Skyranger.
3. Move a Hybrid-led team into the beacon shield and confirm a support with legal LOS/TU can attack the beacon without switching control modes.
4. Repeat around walls, vehicles, fire/smoke, and occupied approach cells; no unit may teleport, cross hard cover, or gain a duplicate action.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.1200_MULTI_FIRETEAM_VIP_RESCUE_TRAFFIC_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Keeps every active rescue fire team moving after the first VIP reaches the Skyranger by separating defensive positions from evacuation traffic and following the soldier who actually owns each escort.

MULTI-TEAM EXTRACTION TRAFFIC
-----------------------------
- Ramp, egress, and widened approach-lane cells are reserved for VIP traffic. Completed escorts and defensive perimeter teams choose side positions outside that lane.
- Extraction pathfinding treats the escort's own fire-team members as mobile formation participants instead of permanent blockers.
- Live missions created before this patch self-clear a completed leader standing in the approach lane by assigning that team a legal side-perimeter position.

ESCORT OWNERSHIP
----------------
- When a support soldier owns a VIP escort, that soldier becomes the rescue actor for the fire team; the formal leader and remaining supports form around the actual escort owner.
- Completing one team's VIP handoff no longer strips active rescue assignments from the other fire teams.
- One rescue actor coordinates each fire team per round, preventing duplicate movement while preserving standard formation support.

VALIDATION
----------
- Build Health covers completed-team lane clearance, non-blocking guard positions, preservation of another team's VIP assignment, support-owned escorts, formation duty, and continued progress toward the ramp.
- Manual, Hybrid, streamed Simulation, save/load, active-escort priority, fog, LOS, damage, and mission resolution remain authoritative.

ROADMAP DOCUMENTATION
---------------------
- Added a presentation-only VIP death cinematic: slow the existing hit/death camera on a VIP's fatal impact, show the actual attacker and victim, then return to the prior tactical camera without changing battle rules.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.1009_PER_SHOOTER_VISIBILITY_AND_VIP_EXTRACTION_HANDOFF_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Requires every AEGIS shot to pass the firing soldier's current authoritative visibility check, guarantees that verified target is rendered in the shot frame, and releases fire-team supports trapped in obsolete Skyranger guard duty after the final VIP extracts.

PER-SHOOTER SHOT AUTHORITY
--------------------------
- Manual, Simulation, emergency-recovery, and reaction fire share one final living-state, target-team, weapon-range, tactical-level, and LOS check before TU, ammunition, damage, or playback is committed.
- Lost personal contact cancels the shot and records a withheld-fire reason. Squad reports, stale reveals, last-known coordinates, and prior-frame visibility can still guide movement but cannot authorize fire.
- The synthetic "Long-range contact" tracer is removed. Playback no longer pairs arbitrary units when no real shot occurred.
- A verified shot marks only its exact alien as required for that frame, so 2D Hex and persistent Three.js display the target through projectile/impact presentation without revealing unrelated contacts.

VIP EXTRACTION / CONTROL-MODE HANDOFF
-------------------------------------
- When the final escorted VIP boards, completed target/claim/route state and orphaned extraction-guard hexes are cleared.
- The escort leader keeps the ramp-egress action already spent. Stationary supports with TU remaining are released to normal AI work in the same round; supports that moved cannot act twice.
- Stream continuations, later Simulation rounds, Hybrid activation, Hybrid support execution, and return to leader control normalize the same stale state, fixing the round-after-round former-escort-only movement and the no-follow Hybrid symptom.
- Living handoff snapshots without an explicit alive:true flag now refresh TU consistently; confirmed dead units do not.

VALIDATION
----------
- Build Health covers clear, blocked, and different-level fire; exact shot-frame rendering; synthetic-shot removal; final-VIP extraction; stationary-support release; stale-guard cleanup; TU refresh; and Hybrid/Simulation normalization seams.
- Fire-team formations, active escorts, fog, LOS, illumination, mission resolution, campaign state, and save format 4 remain authoritative.

MANUAL TEST GATES
-----------------
1. Extract the final VIP under AI control and confirm available supports leave their former Skyranger guard positions instead of only the escort leader moving on later rounds.
2. Take control, enable Hybrid, move each fire-team lead, and run the Hybrid support phase; supports should follow current leader-relative formation.
3. Repeat across a Hybrid-to-Simulation handoff and an active tactical save/reload.
4. Place aliens behind walls, on another level, and in legitimate LOS; only the personally visible target should receive fire and it must render before the shot.

PREVIOUS PATCH NOTES
====================

Build: v0.26.08.23.0138_PATCH_NOTES_HISTORY_SCOPE_STARTUP_HOTFIX
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restores startup after Browser 0125 attempted to update the in-game patch-note library from outside the React campaign component that owns it.

CONFIRMED CAUSE AND FIX
-----------------------
- `PATCH_NOTES_HISTORY` is intentionally local to `AlienResponseCommand`, alongside the patch-history screen state and rendering functions.
- Browser 0125 appended its new history mutation near the global regression tests. That code executed before React mounted and could not resolve the component-local identifier, producing the reported ReferenceError.
- The 0125 history entry and the 0138 hotfix entry now live inside the same lexical scope as the library declaration.
- The single-owner victory-dialogue guard from Browser 0125 remains active and unchanged.

VALIDATION
----------
- Main-script syntax and the victory-announcement claim regression pass.
- Build Health requires the new entries to be present inside `AlienResponseCommand`.
- Static validation rejects any `PATCH_NOTES_HISTORY.unshift` mutation placed after the campaign component's closing boundary, directly covering this startup failure.
- Campaign data, tactical rules, audio assets, and save format 4 are unchanged.

MANUAL TEST GATES
-----------------
1. Reload the hosted build and confirm the title screen renders without a runtime-error panel.
2. Open Save / Load -> Patch Notes and confirm Browser 0138 is Latest and Browser 0125 appears immediately below it.
3. Complete an AI-controlled tactical mission and confirm "That's the last of them" plays once.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.23.0125_SINGLE_OWNER_MISSION_VICTORY_DIALOGUE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Stops the mission-ending soldier line "That's the last of them" from playing twice when the final Simulation or Hybrid playback frame and the terminal-victory commit both request it.

CONFIRMED CAUSE
---------------
- The final AI playback frame correctly recognized that no living aliens remained and queued the announcement.
- The terminal-victory commit then requested the same event again with its cooldown disabled so a victory could not end silently if playback skipped the cue.
- Both paths were individually valid, but neither owned a shared one-shot claim. The two requests could therefore reach the recorded-dialogue router back to back.

SINGLE-OWNER VICTORY ANNOUNCEMENT
---------------------------------
- Tactical dialogue now passes through a mission-scoped victory-announcement gate before it reaches the existing audio router.
- The first "That's the last of them" request claims that mission synchronously. Later requests for the same mission are ignored.
- The final playback frame remains the preferred owner, preserving its normal timing. The terminal commit remains a fallback for unusual playback states but cannot repeat a cue already played.
- A different mission receives a fresh claim, and all non-victory dialogue continues through the existing queue and cooldown rules unchanged.

TACTICAL AUTHORITY
------------------
- The patch covers manual, Hybrid, and Simulation tactical paths without changing mission victory conditions, terminal-frame commitment, final battlefield presentation, or victory music.
- Kill confirmations such as "Target down" remain separate events and are not suppressed.
- Save format remains 4 because the one-shot claim is transient presentation state scoped to the mounted mission.

VALIDATION
----------
- Build Health verifies that the first claim for a mission plays, a second claim for the same mission is rejected, and a new mission can announce normally.
- Static validation requires the shared gate to wrap the TacticalMission dialogue callback and requires browser/native parity metadata for the rule.

MANUAL TEST GATES
-----------------
1. Complete a mission under Simulation AI and confirm "That's the last of them" plays once when the last alien is eliminated.
2. Repeat under Hybrid AI and confirm the terminal battlefield remains visible without a duplicate announcement.
3. Complete a manually controlled mission and confirm the line still plays once.
4. Start and complete a second mission in the same session and confirm its announcement is not suppressed.
5. Confirm ordinary movement, contact, hit, kill, and extraction dialogue still plays normally.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.22.2124_MEDIUM_LARGE_BUILDING_PERIMETER_RESTORATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restores missing building walls, windows, partitions, and furnishings in the outer districts of streamed 80x80 and 96x96 tactical maps. This fixes the exposed interior floor seen around the circled VIPs in the East Asia Threat 3 Alien Terror Raid.

CONFIRMED REPRODUCTION
----------------------
- The archived mission result identifies the affected operation as Alien Terror Raid, East Asia, Bear Squad, Threat 3, Signal Leech.
- Its tactical timeline confirms a Medium 80x80 map with Corner Market, Vehicle Workshop, and Municipal Records Office structures.
- Building plans and interior floor classification already used the full 80-cell map, but asynchronous mission startup discarded cover records beyond the older 64-cell boundary. That left patterned interior floors and valid VIP positions visible without the corresponding perimeter walls.

MISSION-SIZED BUILDING RESTORATION
----------------------------------
- Streamed medium and large battlefield generation now runs an idempotent mission-sized building-cover restoration step after its ordinary generation pass.
- Every authored outer-district wall, transparent window, partition, furnishing, power control, building ID, light source, and grid-size record can survive up to the real mission boundary.
- Existing cover cells are indexed first, so the restoration cannot duplicate walls or overwrite already-generated cover.
- Small 64x64 maps and procedural alien bases bypass the compatibility step and keep their established generation paths.
- The synchronous generator's existing medium/large restoration behavior remains authoritative and is checked against the streamed path.

TACTICAL AUTHORITY
------------------
- Restored walls resume their normal movement, LOS, cover, breach, window-shattering, lighting, fog, AI-pathing, and shot-collision behavior.
- The patch does not reveal the structures through fog or disclose occupants. Every restored cover record begins unrevealed and follows normal observer visibility.
- Mission objectives, civilian/VIP requirements, unit placement, AI knowledge, combat results, and save format remain unchanged.

VALIDATION
----------
- Build Health searches deterministic East Asia terror-site seeds for a medium-map building crossing the legacy boundary, simulates the clipped startup state, and requires every outer wall/window to be restored.
- It verifies public synchronous generation contains the same perimeter and checks the legal inner bounds for 80x80 and 96x96 maps.
- Static validation requires the asynchronous generator to call the mission-sized restoration helper and report its outer-district generation stage.

MANUAL TEST GATES
-----------------
1. Start a new Threat 3 Alien Terror Raid or another medium/large mission with a structure near the outer map district.
2. In 2D and 3D Iso, confirm patterned building floors are surrounded by the expected walls/windows except at authored doors or destroyed breaches.
3. Confirm windows remain visible and shootable, solid walls block sight and movement, and doors remain passable.
4. Confirm VIPs/civilians inside outer buildings can be reached through valid entrances and are not exposed through missing facade sections.
5. Confirm a small 64x64 mission and an alien-base assault generate without new duplicate cover.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.22.1552_CRASH_SITE_AI_TERMINAL_STALL_RECOVERY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the crash-site Round 8 stall and false Hybrid failure documented in the attached tactical timeline. Simulation AI now continues while a confirmed crashed-UFO bay still needs inspection, and Hybrid may finalize only an explicit victory, objective failure, squad defeat, or rescue dust-off.

CRASH-SITE AI CONTINUATION
--------------------------
- A pending crashed-UFO bay inspection now participates in the same bounded Simulation continuation gate as living aliens, inbound reinforcements, rescues, and field beacons.
- Killing the last visible reinforcement no longer produces a zero-action tactical chunk while the UFO deployment bay remains unchecked.
- Once the bay is observed, the existing free-fire-team assignment, approach, inspection, and victory-gate logic can continue normally. Until then, ordinary fog-respecting search behavior remains authoritative.
- The mission log now identifies an unfinished reinforcement-source inspection instead of describing every such state only as a beacon or rescue requirement.

HYBRID TERMINAL SAFETY
----------------------
- Hybrid playback no longer assumes that a missing continuation snapshot is automatically a terminal mission result.
- Mission resolution now requires an explicit terminal outcome: victory, objective failure, squad defeat, or rescue dust-off, with no unresolved continuation flag.
- If an unexpected nonterminal Hybrid snapshot has no continuation, the last authoritative battlefield frame is reconstructed, fire-team-leader control returns for the next round, and no victory or failure is committed.
- Full Simulation streaming uses the same terminal-outcome predicate, preventing the two control modes from disagreeing about whether a mission is over.

VALIDATION
----------
- Build Health reproduces a Medium UFO Crash Site with living AEGIS soldiers, no living aliens, an optional civilian outcome, and a revealed but uncleared UFO bay.
- The contract proves the bay keeps Simulation active, a cleared bay releases that requirement, an unresolved Hybrid snapshot cannot finalize, and legitimate victory/failure outcomes still can.
- Save format remains 4; existing active tactical saves use their retained unit, cover, reinforcement, and UFO-bay state.

MANUAL TEST GATES
-----------------
1. Load or enter a crash site after AEGIS understands reinforcement sources, allow a reinforcement UFO to arrive, and eliminate every visible alien.
2. Confirm Simulation continues searching for or approaching the crashed-UFO bay rather than repeatedly reconstructing the same round.
3. Use Hybrid before the bay is clear and confirm End Turn returns leader control after support action unless a real terminal result occurs.
4. Inspect the empty bay and confirm the mission succeeds when all other mandatory objectives are complete.
5. Confirm optional civilian assistance still reports partial rescue/loss results without becoming a mandatory failure.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.22.1349_ALIEN_BASE_VERTICAL_DECK_FOCUS_PRESENTATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds a persistent 3D Iso vertical-level command stack to alien-base assaults. Players can follow the current action, view the entire facility, or focus the camera on any of the three named levels without changing tactical state.

VERTICAL DECK COMMAND STACK
---------------------------
- Alien-base 3D Iso now identifies Levels 1 through 3 as a vertical stack, with each procedural deck's authored name.
- Every level reports whether it is still unknown or surveyed, how many living AEGIS soldiers occupy it, and how many currently visible hostile contacts are present.
- Level 3 is presented at the top and Level 1 at the bottom, matching the squad's ascent from the insertion chamber toward the command center.
- Moving or selecting an actor on another level updates the active-level readout. Crossing between levels produces a short ascending/descending lift callout.

CAMERA CONTROL
--------------
- Follow Action preserves normal selected-unit and Simulation-playback camera ownership.
- All Levels restores an exact full-facility overview.
- Level 1, Level 2, and Level 3 focus only the persistent camera on that sector; they do not rebuild the renderer or battlefield.
- FPV, TPV, and incoming-fire reaction cameras retain temporary ownership. Deck controls become available again when the observer camera releases.

AUTHORITY AND PERFORMANCE
-------------------------
- The feature is presentation-only. Authoritative side-by-side hex coordinates and paired elevator routes remain the source of truth.
- Fog, LOS, lighting, accuracy, TU, movement, pathfinding, formations, targeting, AI knowledge, objectives, damage, and victory rules are unchanged.
- Camera focus invalidates only the camera layer. The renderer, scene, terrain, cover, material caches, fog batches, and unit nodes remain persistent.
- Save format remains 4; the selected deck view is a transient camera preference and does not alter campaign or tactical save data.

ROADMAP ADDITION
----------------
- Added a future Fallout-inspired localized injury system for soldiers and aliens, with human head/torso/left-right arm/left-right leg zones and data-driven alien anatomy equivalents.
- The planned effects cover accuracy and weapon handling, perception and reactions, movement and TU, bleeding/incapacitation, armor coverage, AI adaptation, first aid, Sickbay recovery, presentation, and save continuity.
- Hit-location weights, called-shot rules, exact penalties, recovery behavior, and alien anatomy remain intentionally open for later prototyping and balance work.

VALIDATION
----------
- Build Health covers three-level presentation state, nearest-deck handling through elevator galleries, Level 3 camera focus, required controls and presentation-only disclosure.
- Static validation requires the new build ID, patch contract, deck-stack and lift-transition markers, manifest parity system, and documented native exception.

MANUAL TEST GATES
-----------------
1. Open an alien-base assault in 3D Iso and confirm the right-side vertical stack shows Level 3 above Level 2 above Level 1 with procedural names.
2. Select each level and confirm the camera moves without changing any unit, fog, TU, path, or objective state.
3. Press All Levels, then Follow Action, and confirm full-map framing and normal selected/acting-unit camera ownership return.
4. Move a unit through both elevator galleries and confirm the level readout plus ascending/descending callout follow the transition.
5. Switch through FPV, TPV, and incoming-fire presentation and confirm those cameras retain control, then release safely back to the chosen deck behavior.
6. Confirm the Three.js renderer identity and static rebuild counters do not change while switching deck camera modes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.22.0017_BEACON_LINKED_PROCEDURAL_MULTILEVEL_ALIEN_BASE_ASSAULT_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Turns captured intact Alien Field Beacons into playable links to threatening, procedurally generated three-level alien bases. AEGIS inserts beside a linked beacon, advances through paired alien elevator galleries, and must take the Level 3 command core offline.

BEACON NETWORK ACCESS
---------------------
- A securely disabled intact beacon plus Alien Beacon Interface Protocols now opens an alternate command-site discovery route.
- The original successful-mission, tracked-UFO, and Command Signal Triangulation route remains valid for old and alternate campaigns.
- Base assaults transit through the captured beacon network and do not consume a Skyranger sortie. The tactical force materializes inside a Level 1 beacon chamber with no transport hull rendered.
- Every base records a stable beacon-link ID and origin. The first endpoint links from the captured field beacon; the final portal site links from command-map intelligence recovered from the first offline base.

PROCEDURAL MULTILEVEL BASES
---------------------------
- Each base stores a stable seed, three levels, named deck roles, and one of four archetypes: Signal Bastion, War Foundry, Bio-Vault, or Psionic Labyrinth.
- Bulkheads, room partitions, door gaps, cover fixtures, floor circuits, elevator placement, and defenders vary from the seed. Reloading the same base reproduces its layout; separate base seeds do not all produce the same site.
- The three authoritative tactical sectors are connected only through two paired elevator galleries. The elevator pads remain visible tactical landmarks in both 2D and persistent Three.js views.
- Standard fog, LOS, cover, movement, fire-team formation, Hybrid command, and Simulation AI remain authoritative across the whole base map.

THREAT AND SHUTDOWN OBJECTIVE
-----------------------------
- Ordinary bases field 15 defenders across all three levels. The final portal base fields 18, with a Pale Commander anchored in the command-level defense.
- Live aliens remain the immediate combat priority. Once the force is defeated, existing beacon-assault AI carries the squad toward the command center rather than ending the mission or burning empty rounds.
- The command core is a durable reinforcement-and-control source. Victory is locked until the core is neutralized and the base is taken offline.
- Manual players can target the command core using the established cover/beacon shooting rules; Hybrid and full Simulation use the same proven assault routing and fire logic.

CONTINUITY
----------
- Existing alien-base records normalize forward with stable generated fields while preserving IDs, locations, defeated state, and final-base progression.
- Base seed, archetype, level names, beacon link, mission metadata, covers, elevator landmarks, and command-core state persist through existing campaign and active-tactical saves.
- Save format remains 4. The Godot vertical slice does not yet have native beacon transit or multilevel alien-base parity.

VALIDATION
----------
- Build Health covers beacon-route eligibility, destroyed-versus-intact beacon evidence, stable/different base seeds, three deck records, two paired elevators, insertion-room deployment, 15-defender distribution, hidden Skyranger transit, command-core terminal gating, alien-base floor presentation, and save format 4.
- Static build validation requires the current build ID, patch contract, procedural generator, insertion beacon, elevator, command-core, manifest parity system, and documented native exception.

MANUAL TEST GATES
-----------------
1. Disable an Alien Field Beacon intact after researching Alien Beacon Interface Protocols, then confirm Command Signal Analysis permits a command-site reveal.
2. Plan the assault and confirm squad launch enters tactical play without consuming or displaying a Skyranger.
3. Confirm the squad appears in a Level 1 room beside the cyan linked beacon.
4. In 2D and 3D Iso, advance through both paired elevator galleries and confirm fog, LOS, formation following, and alien contact remain normal.
5. Defeat the defenders and confirm the mission remains active until the Level 3 command core is neutralized.
6. Save/reload the active assault and confirm the same layout, elevator landmarks, unit positions, and core state return.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.2322_REINFORCEMENT_SOURCE_PRIORITY_AND_UFO_BAY_CLEARANCE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes confirmed reinforcement sources durable tactical objectives and adds persistent clearance for simplified crashed-UFO deployment bays.

REINFORCEMENT-SOURCE PRIORITY
-----------------------------
- Once AEGIS has confirmed the reinforcement function, an active field beacon or observed crashed-UFO bay outranks routine patrol, fog search, stale-contact search, and lower-priority Simulation-owned Command Map waypoints.
- An active civilian/VIP escort or an authoritative known-living-alien contact remains higher priority.
- Full Simulation can release a routine waypoint to investigate the source; Hybrid preserves player-directed leader orders, and manual control receives the same urgent objective without forced movement.

CRASHED-UFO BAY CLEARANCE
-------------------------
- Simplified, non-navigable crash wrecks now persist through Unverified, Investigation Assigned, Clearing, and Bay Clear.
- Simulation AI assigns an eligible fire team, routes its leader to an open wreck-ring cell, preserves established support formation behavior, and verifies the bay after nearby known contact is clear.
- Manual control can use Inspect UFO Bay while adjacent for 8 TU when no living alien is within three hexes.
- After reinforcement knowledge is confirmed, applicable crash-site victories wait for Bay Clear. Unknown doctrine does not expose or impose the new gate early.

CONTINUITY AND SCOPE
--------------------
- Bay phase, inspector, assigned team, and verification round live in the existing tactical cover snapshot and survive active-mission save/load.
- Mission history records UFO Bay Clear when verification succeeds.
- Navigable landed UFO interiors, multi-deck sweeps, inaccessible-source recovery, richer debrief states, and native parity remain staged work.
- Save format remains 4; fire-team formation, escort ownership, fog, LOS, illumination, targeting, and alien knowledge acquisition are unchanged.

VALIDATION
----------
- Build Health covers knowledge gating, all objective priorities, Simulation-versus-Hybrid waypoint ownership, the 8-TU manual action, persistent Bay Clear state, and crash-site terminal gating.
- Static validation requires the shared source helpers, status/action interface, patch metadata, parity exception, and save format 4.

MANUAL TEST GATES
-----------------
1. Discover a simplified crash wreck before and after reinforcement knowledge is confirmed; confirm only the latter creates the urgent source objective.
2. Under Simulation control, issue a quiet Command Map waypoint and confirm a known source can supersede it while support soldiers retain formation movement.
3. Under Hybrid control, confirm the player-directed leader waypoint remains intact and the urgent objective stays visible.
4. Inspect an adjacent clear bay manually, confirm 8 TU is spent, save/reload, and confirm Bay Clear persists.
5. With no living aliens, confirm a known uncleared crash bay blocks victory and Bay Clear releases the mission gate.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.2113_DEFAULT_CIVILIAN_ESCORT_SUPPORT_DOCTRINE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds a mission-level Civilian Escort Support doctrine so players can default escorting fire teams to Ask, Stay, or Engage while preserving manual, Hybrid, and Simulation AI ownership.

ESCORT SUPPORT DOCTRINE
-----------------------
- Ask When Contact Is Spotted preserves the existing once-per-contact assignment board and remains the default for existing and new missions.
- Stay With Escort keeps supporting soldiers with the civilian/VIP column without opening the routine contact prompt.
- Engage Spotted Aliens automatically releases supporting soldiers to normal combat and flanking AI while the fire-team leader keeps the escort moving; supports return when contact ends.
- The selected doctrine is mission-scoped and travels with the active tactical snapshot through save/load.

CONTROL AND OVERRIDES
---------------------
- The doctrine selector is available on the battle screen and inside the Command Map.
- Assign Teams opens the existing per-fire-team decision board as a temporary override whenever an escort column and visible alien contact are both present.
- Manual overrides remain manual, Hybrid decisions resume only the bounded Hybrid support round, and Simulation AI resumes its existing stream.
- Automatic decisions log one concise acknowledgement per new alien-contact episode and do not reset TU or erase movement already shown.

VALIDATION
----------
- Build Health covers all three defaults, invalid/default normalization, support mode assignment, leader-owned escort behavior, manual ownership preservation, both interface locations, and tactical snapshot continuity.
- Save format remains 4; fog, LOS, targeting, fire-team formation, escort routing, extraction traffic, and alien knowledge are unchanged.

MANUAL TEST GATES
-----------------
1. Save and reload an active escort mission under Ask, Stay, and Engage and confirm the selected doctrine survives.
2. Spot aliens under Stay and Engage, confirming the former guards the column and the latter sends only supports into normal combat/flanking behavior.
3. End contact and confirm detached supports return to their original escort leader.
4. Exercise Assign Teams under manual, Hybrid, and Simulation control and confirm no choice changes the owning control mode.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1845_LIVE_VEHICLE_FOOTPRINT_MOVEMENT_INTEGRITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes every live land-vehicle footprint cell authoritative at the final movement-commit boundary and aligns persistent 3D vehicle bodies with those same cells.

LIVE VEHICLE MOVEMENT AUTHORITY
-------------------------------
- Cars, vans, utility vehicles, trucks, and buses now expose one shared set containing every occupied footprint hex while they remain intact.
- Manual and escort step commits, Simulation AI plans, emergency search fallback, beacon-watchdog movement, and alien per-step movement all recheck the destination against current hard cover and unit occupancy immediately before coordinates change.
- A stale or fallback plan that reaches any live vehicle footprint cell is held in place instead of allowing the unit to enter the vehicle.
- Existing path authority still rejects every blocked intermediate step, while battlefield integrity repair continues to relocate loaded units that overlap any living hard-cover footprint.
- Destroyed vehicles are omitted from the live footprint authority and retain their existing post-destruction passability behavior.

PERSISTENT 3D ALIGNMENT
-----------------------
- Multi-hex vehicle models are centered on the world-space centroid of their authoritative footprint rather than the single generation anchor hex.
- A vehicle becomes eligible for persistent rendering when any footprint cell is visible, eliminating anchor-side reveal mismatches.
- This alignment is presentation-only; vehicle size, cover, HP, path cost, LOS, fog, formations, escorts, Skyranger rules, and battle knowledge are unchanged.

VALIDATION
----------
- Build Health covers live and destroyed footprints, blocked final commits, safe route reconstruction, escort-step rejection, 3D centroid alignment, and the existing integrity-repair seam.
- Static validation requires the shared live-footprint authority, all final commit guards, persistent-renderer centroid use, parity documentation, and save format 4.

MANUAL TEST GATES
-----------------
1. Test intact cars and buses in 2D, 3D Iso, Simulation AI, and Hybrid support movement.
2. Confirm previews, committed routes, and playback never cross or finish inside any vehicle footprint cell.
3. Confirm the visible 3D body occupies the same cells that pathing blocks, without a soldier visually standing under its side.
4. Destroy a vehicle and confirm its established rubble/passability behavior returns.
5. Confirm fire-team formation, VIP/civilian escort, Skyranger ramp movement, and command-map orders still work normally.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1730_THREE_ISO_NIGHT_BRIGHTNESS_CONTROL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds a persistent 3D Iso Night Brightness control that lifts dark vehicles, shrubs, buildings, terrain, and the Skyranger without changing tactical illumination or knowledge rules.

PLAYER-ADJUSTABLE NIGHT BRIGHTNESS
----------------------------------
- 3D Iso Night Brightness controls are available on the start screen, in Save / Load settings, and in the active 3D Iso battle toolbar.
- The slider runs from 50% to 200% in 5% steps. 100% exactly preserves Browser 1630 lighting, and Reset returns to that neutral default.
- Changes apply immediately to the live persistent battlefield and persist locally across missions, campaign loads, and browser restarts.
- The setting affects only 3D Iso during night and twilight. Daylight, 2D Hex, FPV, TPV, and incoming-fire reaction cameras retain their neutral presentation.

PRESENTATION-ONLY LIGHTING BOUNDARY
-----------------------------------
- The slider scales renderer exposure plus hemisphere ambient, key, and rim presentation. Above 100%, it also introduces a cool, non-authoritative AmbientLight fill and a bounded shadow-color lift derived from each light-reactive material's authored color, so shadow-facing vehicle, foliage, building, and Skyranger surfaces retain readable hue instead of collapsing to black.
- The material lift covers both cached and directly created scene materials and is reversible: 100%, daylight, and perspective cameras restore each material's exact original emissive color and intensity without cloning materials or rebuilding the battlefield.
- At 200%, exposure rises by 45%, hemisphere ambient by 65%, key light by 40%, rim light by 25%, and the dedicated fill reaches a bounded 0.36 intensity relative to Browser 1630.
- The preference does not change PointLight distance or PointLight intensity scaling. The authored local-light presentation remains fixed.
- Illuminated hex calculations, fog, LOS, visibility, darkness accuracy, AI knowledge, targeting, movement, cover, damage, power circuits, and mission rules are unchanged.
- Adjusting the slider does not rebuild the renderer, scene, terrain, static objects, materials, or battlefield caches.
- This remains a device presentation preference, so save format 4 is unchanged.

VALIDATION
----------
- Build Health compares 50%, 100%, and 200%, verifies neutral daylight and perspective restoration, and confirms local-light intensity and distance remain identical while dark-scene exposure and ambient fill rise.
- Static validation requires one shared control, all three UI placements, persistent-renderer dependency wiring, fixed local-light scale, and no fog or distance mutation.

MANUAL TEST GATES
-----------------
1. Compare 50%, 100%, 150%, and 200% in night and twilight 3D Iso scenes containing buildings, vehicles, vegetation, and a Skyranger.
2. Confirm 100% matches Browser 1630 exactly and Reset returns to it.
3. Adjust the live slider and confirm the renderer identity, camera, selection, fog, and battlefield state do not reset.
4. Confirm daylight and FPV/TPV remain neutral regardless of the saved value.
5. Confirm lamps, headlights, windows, flares, fire, and Skyranger lights do not illuminate additional hexes.
6. Reload the page and verify the device preference persists.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1630_THREE_ISO_COLOR_CONTROL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds a persistent player-adjustable 3D Iso Color control so players can tune battlefield vibrance for their display without changing tactical lighting or battle rules.

PLAYER-ADJUSTABLE 3D ISO COLOR
------------------------------
- 3D Iso Color controls are available on the start screen, in Save / Load settings, and in the active 3D Iso battle toolbar.
- The slider runs from 50% to 200% in 5% steps. 100% exactly preserves the Browser 1245 presentation, and Reset returns to that neutral default.
- Changes apply immediately to the live persistent battlefield and persist locally across missions, campaign loads, and browser restarts.
- This is a device presentation preference, not campaign state, so save format 4 remains unchanged.

PERSISTENT PRESENTATION BOUNDARY
--------------------------------
- The existing Three.js canvas receives one absolute saturation filter; moving the slider never compounds earlier adjustments.
- Changing color does not rebuild the renderer, scene, terrain, static battlefield objects, geometry/material caches, selection, fog, or camera position.
- 2D Hex, FPV, TPV, and incoming-fire reaction cameras restore neutral color immediately.
- Exposure, PointLight distance, illuminated hexes, LOS, visibility, darkness accuracy, targeting, AI, movement, damage, and power circuits are unchanged.

VALIDATION
----------
- Build Health covers slider bounds and normalization, device persistence wiring, all three UI placements, live Iso application, perspective restoration, and unchanged save compatibility.
- Static validation requires one shared control boundary, one persistent-renderer color helper, all three control seams, and the Browser 1630 contract.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Set 50%, 100%, 150%, and 200% from the start screen and verify the displayed percentage and Reset action.
2. Open Save / Load and confirm it shows the same device preference.
3. Adjust the setting during a live 3D Iso mission and confirm the battlefield updates without resetting the camera, selection, fog, or renderer.
4. Switch among 2D, Iso, FPV, and TPV and confirm only Iso consumes the color preference.
5. Reload the page and verify the preference persists.
6. Run deferred Build Health and verify the Browser 1630 contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1245_STABLE_INCIDENT_BOUNDARIES_AND_ISO_NIGHT_VIBRANCE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues strategic UI consolidation and makes illuminated night scenes more colorful in 3D Iso without changing tactical light range or battle rules.

STABLE STRATEGIC INCIDENT PRESENTATION
--------------------------------------
- IncidentListModal, IncidentDetailsModal, and ActiveAircraftRouteTimelinePanel now have stable module-scope React.memo identities.
- Threat sorting and public alien labels feed the incident list through a memoized explicit entry snapshot.
- Incident claim state, committed-response status, and alien identification feed the details dialog through a memoized explicit presentation snapshot.
- Incident selection, response planning, active-mission state, aircraft travel, and campaign mutations remain owned by AlienResponseCommand.
- The aircraft route timeline now recomputes only when its memoized interceptor or Skyranger travel inputs change.

3D ISO NIGHT VIBRANCE
----------------------
- Night 3D Iso raises tone-mapped exposure from 0.50 to 0.62 while retaining a clearly dark sky, fog, and battlefield atmosphere.
- Night ambient, key, rim, and local-light presentation intensities receive restrained view-specific boosts so building, vehicle, terrain, and prop colors do not collapse into black blocks.
- Twilight receives a smaller version of the same adjustment.
- First Person, Third Person, and incoming-fire reaction cameras retain the existing darker physical-light response.
- Point-light distances, authoritative light radii, LOS, visibility, darkness accuracy, fog range, power circuits, and destructible-light behavior are unchanged.

ROADMAP ADDITION
----------------
- Recorded the remaining report that soldiers can sometimes path through or finish movement inside multi-hex land vehicles.
- The future fix must unify planning, fallback movement, playback, and integrity repair around every live vehicle footprint cell without making destroyed vehicles permanently impassable.

VALIDATION
----------
- Build Health covers the three extracted boundaries, explicit callbacks, derived incident data, route rendering, Iso-only night boosts, perspective restoration, and unchanged PointLight distance.
- Static validation requires one declaration for each extracted boundary before AlienResponseCommand and records both browser-only parity exceptions.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open the incident list, select an incident, close/reopen its details, and plan a response.
2. Launch or relocate aircraft and verify the active route timeline updates normally.
3. Compare a night mission in 3D Iso and FPV/TPV; Iso objects should retain more color while the perspective views remain unchanged.
4. Confirm street lamps, windows, headlights, flares, fire, and Skyranger lamps do not illuminate additional hexes.
5. Run deferred Build Health and verify both Browser 1245 contracts pass.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1130_STABLE_MISSION_LAUNCH_CONFIRMATION_BOUNDARY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues architectural consolidation by extracting the mission launch confirmation from the monolithic campaign component without moving launch authority.

STABLE MISSION LAUNCH CONFIRMATION
----------------------------------
- MissionLaunchConfirmModal now has one module-scope React.memo identity with explicit confirmation, sortie, loadout, roster, squad-label, and action inputs.
- AlienResponseCommand still assembles the authoritative response force, launch-base fallback, local base inventory, loadout warning, eligible Skyranger, and launch-block reason only while confirmation is open.
- Cancel and Confirm Launch continue calling controller-owned actions. Transport assignment, deployment mode, spending, travel, active-mission state, and save data are unchanged.
- Unrelated campaign updates can reconcile an open launch dialog without manufacturing a new component type or remounting its DOM and scroll state.
- The unused local Skyranger-name preview value was removed from the assembly path.

VALIDATION
----------
- Build Health renders the extracted boundary directly, verifies its displayed mission/sortie/loadout/roster data, and exercises both action callbacks.
- Static validation requires exactly one memoized MissionLaunchConfirmModal declaration before AlienResponseCommand and preserves controller-owned sortie assembly.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open a mission launch confirmation and verify incident, region, threat, response count, launch base / transport, local loadout, and roster labels.
2. Cancel and confirm that the launch chooser remains available with no mission started.
3. Reopen the confirmation, choose Confirm Launch, and verify the selected deployment mode and Skyranger travel begin normally.
4. Run deferred Build Health and verify the stable mission-launch confirmation contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.1000_COMMAND_MAP_SEARCH_RESUME_HOTFIX
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Prevents Simulation AI from advancing empty rounds after player-directed fire teams reach their Command Map waypoints.

COMMAND MAP ARRIVAL HANDOFF
---------------------------
- A player-issued Command Map waypoint now releases automatically when its fire-team leader arrives and no alien contact is visible.
- The leader can select the normal alien-hunt, beacon, rescue, or patrol objective during that same AI round instead of repeatedly targeting its current hex.
- Supporting soldiers continue using standard leader-relative formation movement after the temporary order releases.
- A waypoint remains active while an alien contact is visible, preserving engagement holds, preferred targets, and enemy-relative support flanking.
- One-round Hybrid AI support orders use their separate hybrid-round identity and are not cleared by the new Command Map arrival rule.

STREAM RECOVERY
---------------
- The no-progress recovery path detects quiet completed player waypoints retained by an affected continuation or save.
- Those stale orders are cleared before search state is rebuilt, allowing a stalled UFO crash operation to self-heal rather than burn additional empty rounds.
- Command Map help now explains that a quiet arrival releases the temporary waypoint back to autonomous search.

VALIDATION
----------
- Build Health covers quiet waypoint release, active-contact hold retention, Hybrid round ownership, post-release formation following, and streamed recovery.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. During Simulation AI, issue a Command Map waypoint while no aliens are visible and let the leader reach it.
2. Confirm the temporary order disappears and the fire team resumes a normal search route without player intervention.
3. Confirm supporting soldiers keep moving into their leader-relative formation after release.
4. Reach a waypoint while an alien is visible and confirm the team holds, flanks, and engages instead of abandoning the contact.
5. Run deferred Build Health and verify the Command Map autonomous-search-resume contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.21.0845_STABLE_OPERATIONAL_APPROVAL_BOUNDARIES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues architectural consolidation by moving understrength deployment, workshop funding, and facility construction approvals out of the monolithic campaign component.

STABLE OPERATIONAL APPROVALS
----------------------------
- UnderstrengthMissionConfirmModal, WorkshopFundingConfirmModal, and FacilityBuildConfirmModal now have stable module-scope React.memo identities.
- Each dialog receives explicit display data and controller-owned action callbacks.
- Skyranger launch, workshop spending/queue mutation, facility spending, and base-grid placement remain owned by AlienResponseCommand.
- Open approval DOM, focus, and scroll state can reconcile through unrelated campaign updates instead of remounting under newly created component functions.
- Mission capacity/power, queue cost, affordability, facility footprint, and placement readouts retain their existing calculations.

ROADMAP ADDITION
----------------
- Approved a broader library of infrastructure and terror-site locations, including ports, data centers, refineries, factories, monument districts, amusement parks, and other high-impact public sites.
- Added live alien-leader capture, alien-database hacking, and principal-versus-optional VIP rescue objective designs with armed allied security details.
- High-value rescues are planned to receive short skippable/replayable Three.js FPV command-room briefings with an original military-science ensemble tone, concise intelligence, restrained dry humor, clear stakes, and a 2D/reduced-motion fallback.
- Mission resolution and AI acceptance gates explicitly distinguish mandatory principals from optional VIPs and require honest terminal handling for capture, hacking, extraction, and impossible-objective states.

VALIDATION
----------
- Static validation requires exactly one memoized declaration for each extracted approval before AlienResponseCommand.
- Build Health verifies explicit inputs and confirms that controller-local state/action names did not leak into the extracted components.
- Browser checks cover dialog rendering, displayed calculations, disabled unaffordable funding, callback wiring, cancellation, and clean startup.
- Launch rules, production rules, construction rules, campaign state, tactical behavior, and save format remain unchanged.

MANUAL TEST GATES
-----------------
1. Launch with an understrength response force and verify the selected squads, capacity, power, roster, Cancel, and Proceed actions.
2. Let an unfunded workshop queue pause and verify approval cost, remaining funds, disabled unaffordable approval, and Keep Queue Paused.
3. Select a valid facility footprint and verify base, cost, remaining funds, footprint, grid position, Cancel, and Confirm Build.
4. Run deferred Build Health and verify the stable operational-approval contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.2300_STABLE_CAMPAIGN_CONFIRMATION_BOUNDARIES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues architectural consolidation by moving New Game, End Month, and Surrender confirmations out of the monolithic campaign component.

STABLE CAMPAIGN CONFIRMATIONS
-----------------------------
- NewGameConfirmModal, EndMonthConfirmModal, and SurrenderConfirmModal now have stable module-scope React.memo identities.
- Each dialog receives only the campaign values it displays and the action callbacks it invokes.
- Campaign reset, monthly processing, unresolved-incident consequences, and surrender remain owned by AlienResponseCommand.
- Open dialog DOM, focus, and scroll state can reconcile through unrelated campaign updates instead of remounting under newly created component functions.
- Existing warnings, incident ordering, button labels, and consequences are unchanged.

VALIDATION
----------
- Static validation requires exactly one memoized declaration for each extracted confirmation before AlienResponseCommand.
- Build Health includes an explicit-prop and controller-ownership contract for all three boundaries.
- Browser checks cover live New Game, End Month, and Surrender display/action wiring and cancellation without campaign mutation.
- Direct startup, monthly rules, campaign reset, surrender consequences, tactical behavior, and save format remain unchanged.

MANUAL TEST GATES
-----------------
1. Open New Game from Save / Load, verify the campaign snapshot, and cancel back to the current game.
2. Request End Month with active incidents and confirm the warning list remains threat-sorted; cancel without advancing time.
3. Request Surrender, verify campaign/date/incident/living-soldier counts, and cancel without changing campaign state.
4. Run deferred Build Health and verify the stable campaign-confirmation contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.2230_STABLE_TRANSIENT_OVERLAY_BOUNDARIES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues architectural consolidation by moving the event-speed prompt, backup reminder, and Build Health overlay out of the monolithic campaign component.

STABLE TRANSIENT OVERLAYS
-------------------------
- EventSpeedPromptModal, BackupReminderModal, and SelfTestOverlay now have stable module-scope React.memo identities.
- The event-speed prompt receives its prompt record, tactical-ownership presentation flag, and authoritative resolver through explicit props.
- The backup reminder receives a display snapshot plus dismiss/download actions; export and reminder state remain owned by AlienResponseCommand.
- Build Health receives the current completed test collection and Close action without taking ownership of deferred test execution.
- Mounted overlay content can reconcile normally through unrelated parent updates instead of remounting under newly created component functions.

VALIDATION
----------
- Static validation requires exactly one memoized declaration for each extracted overlay before AlienResponseCommand.
- Browser checks Build Health opens, retains its root and focused Close button through a parent update, closes normally, and still runs the deferred full suite.
- Direct startup, Geoscape time authority, tactical handoff, backup format, diagnostics, campaign rules, and save format remain unchanged.

MANUAL TEST GATES
-----------------
1. Open Build Health, scroll the test list, and confirm Close returns to the same command screen.
2. Trigger a UFO/base-logistics speed prompt and verify Pause, 5 Min, 30 Min, and 1 Hour retain their normal result.
3. Trigger a campaign backup reminder; test Remind Me Later and Download Backup Now with a disposable backup.
4. Confirm tactical speed prompts still describe and apply their post-battle speed without leaving the active incident.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.2110_STABLE_CAMPAIGN_LIST_BOUNDARIES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Continues architectural consolidation by moving notification, save-list, autosave-list, and Council Review presentation components out of the monolithic campaign component.

STABLE CAMPAIGN LIST BOUNDARIES
-------------------------------
- NotificationStack, SaveSlotCards, AutoSaveSlotCards, and CouncilReviewSlidesModal now have stable module-scope React.memo identities.
- Save and autosave slot collections and actions are explicit component inputs. AlienResponseCommand still owns campaign state, browser storage, and every authoritative action.
- Notifications can bypass unrelated campaign rerenders when their collection is unchanged.
- Save / Load list DOM remains reconcilable in place across unrelated parent updates instead of being remounted under newly created component functions.
- Council Review keeps its existing slide data, framing, highlights, Skip, Next, and Finish behavior.

VALIDATION
----------
- Static validation requires exactly one memoized declaration for each extracted component before AlienResponseCommand.
- Browser checks stable notification/save/autosave DOM identity across a live parent update, explicit component inputs, deferred Build Health, and current build metadata.
- Save/load/export/clear ownership, notification timing, monthly resolution, tactical behavior, and save format remain unchanged.

MANUAL TEST GATES
-----------------
1. Open Save / Load and confirm all ten manual slots and both autosave slots render normally.
2. Save, load, export, and clear a disposable slot; confirm the same confirmations and campaign results as before.
3. Trigger several notices while navigating command screens and confirm the stack still fades each notice normally.
4. Complete a month and confirm Council Review Skip, Next, and Finish retain their normal behavior and layout.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1745_STABLE_SETTINGS_COMPONENT_BOUNDARIES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Begins architectural consolidation by moving reusable settings UI out of the monolithic campaign component and giving those controls stable memoized identities.

STABLE COMPONENT BOUNDARIES
---------------------------
- RangeSliderStyles, ReinforcementDifficultyPanel, and IncidentMapLimitPanel now live at module scope rather than being redeclared inside AlienResponseCommand on every campaign render.
- Each boundary uses React.memo. Unchanged primitive values and stable state setters can bypass unrelated parent updates, while genuine setting changes still render immediately.
- Range and select DOM nodes retain their identity and focus across unrelated campaign rerenders instead of being remounted under a newly created component function.
- Existing title/setup, Command Settings, and Save / Load placements remain unchanged.

VALIDATION
----------
- Static validation requires exactly one memoized declaration for each extracted component before AlienResponseCommand.
- Chromium checks component identity, focused Incident Map Limit input continuity, range-style node continuity, deferred Build Health, and current build metadata.
- Reinforcement cadence, incident generation, audio behavior, campaign state, and save format remain unchanged.

MANUAL TEST GATES
-----------------
1. Open Command Settings and Save / Load; adjust Alien Reinforcement Difficulty and Incident Map Limit and confirm both update normally.
2. Focus the Incident Map Limit range control, change it, and confirm focus does not jump or disappear.
3. Toggle unrelated settings while the panel is open and confirm sliders/selects do not reset.
4. Start a new campaign and confirm the setup-screen reinforcement selector retains its normal appearance and behavior.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1705_PRECOMPILED_TAILWIND_AND_STYLE_INTEGRITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Removes Tailwind compilation from normal startup, embeds the complete retained utility stylesheet, and repairs malformed opacity classes that previously produced no visual rule.

STARTUP / STANDALONE CSS
------------------------
- The browser no longer executes the embedded Tailwind 3.4.17 compiler or its mutation observer when the game opens.
- A 74 KB precompiled stylesheet covers the utility inventory used by strategic, tactical, menu, report, Memorial, responsive, hover/focus, and arbitrary-value layouts.
- The standalone index shrinks by roughly 330 KB while remaining offline-capable. Gameplay and save data do not depend on CSS generation.

STYLE INTEGRITY
---------------
- Invalid `/350`, `/300`, and `/800` opacity suffixes now use valid `/35`, `/30`, and `/80` forms.
- Corrupted double suffixes such as `/45/90` now resolve to the intended `/45` status-card backgrounds.
- Incident-marker hover/focus states, backup controls, AI animation controls, modal backgrounds, and soldier assignment/status cards now receive their intended styles.

VALIDATION
----------
- Static validation rejects a restored runtime compiler, an undersized precompiled inventory, missing responsive/arbitrary selectors, and the known malformed opacity forms.
- Chromium startup and deferred Build Health verify the embedded stylesheet and the absence of a runtime Tailwind script.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open the title screen, Save / Load, Command Settings, Geoscape, Barracks, and a 2D/3D tactical battle; confirm layout, colors, responsive panels, and hover/focus states remain styled.
2. Confirm the browser console no longer reports Tailwind's development/runtime compiler warning.
3. Inspect incident markers, Backup All Slots, Simulation-AI controls, modal overlays, and assigned/wounded/overflow soldier cards for the corrected opacity styling.
4. Run Build Health from Save / Load and confirm the precompiled Tailwind contract passes.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1310_HOVER_HELP_AND_PERSISTENT_RENDERER_REFINEMENT_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes contextual hover help deliberate, optional, and useful; avoids repeated persistent-renderer key/material work; and prevents the alien reinforcement craft's troop bay from drawing through its hull.

HOVER HELP
----------
- Pointer hover descriptions now wait 3 seconds before appearing. Keyboard focus retains a short delay for accessibility.
- Generic “Activates X” / “Click to activate X” descriptions are suppressed. Recognized controls explain their purpose, consequences, and state; an unsupported control shows no tooltip until it has useful guidance.
- Detailed descriptions were added for Build Health, patch history, audio/SFX controls, incident and UFO lists, tactical shot results, Simulation/Hybrid handoff, fire-team cycling, and Command Map pause/resume.
- Hover Help: On / Off buttons appear on the start screen, in Command Settings, and on Save / Load.
- The setting is stored locally, does not affect campaign saves, and immediately dismisses a visible/pending tooltip when turned off.

PERSISTENT THREE.JS TACTICAL RENDERER
-------------------------------------
- Unit, cover, reachable-cell, movement-path, camera-focus, and Skyranger invalidation keys are memoized while their authoritative inputs are unchanged.
- Iso/perspective unit-material traversal now runs only after a unit-layer change or camera-lighting presentation transition.
- Renderer, scene, geometry/material caches, static terrain, cover, fog, and unit nodes remain persistent across movement and selection updates.

ALIEN CRAFT INTERIOR OCCLUSION
------------------------------
- Alien reinforcement craft now use a deliberately bounded rear hull aperture sized to the ramp.
- Troop-bay materials again use normal depth testing and depth writes instead of forced foreground rendering.
- An opaque roof shroud prevents the interior ceiling, seats, and glow strips from appearing through the top of the saucer while retaining a readable rear-ramp view.

VALIDATION
----------
- Embedded JavaScript parsing, manifest/build parity, whitespace, static build seams, deferred boot diagnostics, hover preference persistence, renderer memoization, and alien-craft depth contracts are checked.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Rest the pointer over Build Health for less than 3 seconds, then longer than 3 seconds; confirm no early tooltip and a detailed delayed explanation.
2. Turn Hover Help off from each exposed settings location and confirm pending/visible descriptions disappear and remain off after reload; turn it back on and confirm behavior returns.
3. Hover an unmapped control and confirm no generic activation-only tooltip appears.
4. In 3D Iso and FPV/TPV, inspect a landed alien reinforcement craft from above, the side, and the rear ramp. The bay must be hidden by intact hull/roof surfaces and visible only through the rear opening.
5. Move/select soldiers repeatedly in 3D Iso and confirm the persistent renderer ID remains stable while units, fog, cover, and camera presentation update correctly.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1130_BUILD_HEALTH_AND_RUNTIME_HOTPATH_HARDENING_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restores authoritative dead-VIP mission resolution and removes avoidable work from boot diagnostics, global hover movement, tactical unmount cleanup, and the hidden Three.js Geoscape globe. Build metadata and the external validator are synchronized with the playable artifact again.

VIP TERMINAL RESOLUTION
-----------------------
- A civilian or VIP marked alive: false is now an authoritative casualty even if staged playback temporarily retains positive display HP.
- An impossible mandatory rescue quota can therefore resolve as a failed objective with the existing per-VIP partial credit instead of continuing AI search rounds indefinitely.
- A deterministic regression contract recreates the 2-rescued / 2-dead / 3-required case.

BUILD HEALTH LIFECYCLE
----------------------
- Full Build Health now combines both the original test suite and contracts added after the deferral patch only when the diagnostics panel is opened.
- Startup continues to expose only the small critical smoke result; later patch wrappers no longer leak tests back into synchronous boot.
- The manifest, browser build label, in-game patch-history head, and external build checker now agree on the current build.

RUNTIME HOTPATH HARDENING
-------------------------
- Global hover help measures the tooltip only when its content changes and limits pointer-follow placement to one requestAnimationFrame callback per visual frame.
- Tooltip motion uses a transform and bounds contextual label text before description matching.
- TacticalMission now owns one combined unmount cleanup for AI streams, playback timers, and shot-feedback timers instead of five overlapping hooks.
- The persistent Three.js globe stops scheduling its fixed-step loop while inactive and wakes with a fresh timing baseline when the Globe view returns.

PRESERVED BEHAVIOR
------------------
- Persistent Three.js scenes and caches remain intact while their hidden render loop sleeps.
- Hover descriptions, keyboard focus help, AI tactical rules, combat timing, campaign data, and save format remain unchanged.
- Native Godot parity remains recorded separately.

BUILD HEALTH / VALIDATION
-------------------------
- Embedded JavaScript syntax, whitespace, manifest parity, current lighting/terrain contracts, VIP death-flag resolution, hover throttling, consolidated cleanup, and hidden-globe suspension are checked.
- The deferred 477-contract suite now runs to completion without a runtime exception. It still reports 40 older stale assertion rows; those remain visible for follow-up instead of being suppressed or run during boot.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Load or create a mandatory 3-of-4 VIP mission, leave two rescued and two explicitly dead, eliminate remaining aliens, and confirm the operation resolves as an objective failure with partial rescue credit.
2. Launch the game and confirm the start screen appears before opening Build Health; then open Build Health and confirm the complete suite runs.
3. Move the pointer rapidly across controls and confirm hover help follows smoothly without intercepting clicks.
4. Switch repeatedly between Terminator Map and Globe views and confirm the persistent globe resumes with correct lighting and no jump or blank frame.
5. Enter and exit tactical battles, including AI playback, and confirm no stale playback or shot-result timers survive mission teardown.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1045_GLOBAL_CLICKABLE_HOVER_HELP_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Extends the descriptive hover behavior used by the tactical Auto / Performance / Quality rendering choices to the rest of the game. A global delegated tooltip layer now gives every supported interactive control a concise explanation of what activation will do, while preserving richer authored help when it already exists. New controls automatically inherit a safe fallback instead of silently having no tooltip.

GLOBAL CLICKABLE HOVER / FOCUS HELP
-----------------------------------
- Covers buttons, links, form controls, keyboard-focusable UI, tabs/switches/menu roles, interactive maps/canvases, cursor-pointer markers, and tutorial drag handles.
- Delegated document-level handling means React controls created later automatically participate; individual screens do not need their own tooltip component.
- Keyboard focus shows the same contextual explanation for non-mouse navigation.
- Hover help follows the pointer and stays inside the viewport; the tooltip is pointer-transparent and cannot block clicks.
- Touch taps do not open hover popups merely because a touch pointer entered a control.

DETAILED HIGH-VALUE DESCRIPTIONS
--------------------------------
- Auto explains automatic hardware-based tactical 3D quality selection.
- Performance explains its frame-rate/stability tradeoffs: 1x rendering, fewer lights, no dynamic shadows, simpler materials, and smaller overview budget.
- Quality explains the higher-resolution/antialiasing/shadow/light/view-size tradeoff and potential performance cost.
- 2D Hex / 3D Iso / First Person / Third Person explain presentation-only camera/view changes.
- Battle Speed +/- explicitly states that only playback speed changes.
- Command Map, Hybrid AI, Simulation AI, End Turn, Weapon Light, Field Flare, Medkit/Medpac, Reload, Kneel/Stand, Dust Off, attacks, and tactical zoom choices receive system-specific explanations.
- Strategic command sections, Save/Load, portable backup/download/import, retry, confirmation, cancellation, navigation, removal, and destructive actions receive action-specific explanations.
- Disabled controls begin with an Unavailable right now notice while still explaining their normal purpose.

FALLBACK BEHAVIOR
-----------------
- Existing data-aegis-help / aria-description / sufficiently descriptive title text remains authoritative when present.
- A control with no authored or known description still receives a generated Click to activate <label> explanation.
- Interactive map/battlefield surfaces explain click/selection and drag/pan/rotation behavior generically where the exact object under the pointer determines the action.

PRESERVED BEHAVIOR
------------------
- No click handler, campaign rule, tactical AI rule, TU cost, combat rule, rendering setting value, tutorial state, or save/load authority is changed.
- Browser 1035 tutorial dragging/position memory remains intact.
- Browser 1015 startup-scope safety, Browser 0945 vehicle/lighting-aware target authority, Browser 2325 beacon recovery, and Browser 2155 AI recovery remain intact.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- Added a safe global contract covering semantic/control selector coverage, Auto/Performance/Quality descriptions, generic fallback generation, pointer hover, keyboard focus, and disabled-control messaging.
- Focused helper validation confirms detailed quality-mode copy plus Battle Speed/navigation/fallback text.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Hover Auto / Performance / Quality on the start screen and during a 3D battle.
2. Hover controls throughout Geoscape, Missions, Squads, Soldiers, Research, Workshop, Mainframe, Reports, Save/Load, and tutorial screens.
3. During a battle, hover view/zoom/speed, FPV/TPV, Command Map, AI handoff, End Turn, movement/combat/medical/stance controls, and interactive map surfaces.
4. Hover disabled controls and confirm the tooltip explains both the unavailable state and normal purpose.
5. Tab through keyboard-focusable controls and confirm help appears on focus.
6. Confirm tooltips never intercept clicks and existing actions behave unchanged.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1035_DRAGGABLE_TUTORIAL_WINDOW_POSITION_MEMORY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Makes both tutorial overlays draggable and remembers where the player places them. The strategic New Player Tutorial and tactical Battle Tutorial now default to the lower-left corner, can be dragged by their title bars when they obstruct something the player wants to inspect, remain clamped inside the viewport, and reopen at the last player-selected position.

DRAGGABLE TUTORIAL WINDOWS
--------------------------
- Strategic and tactical tutorial panels both expose a title-bar **Drag to move** handle.
- Buttons inside the header remain clickable and do not initiate drag operations.
- Both tutorial types default to the lower-left when no saved position exists.
- Dragging is viewport-clamped so the entire panel cannot be lost off-screen.

POSITION MEMORY
---------------
- Strategic and tactical positions are stored independently in browser-local tutorial preference keys.
- Hiding and reopening a tutorial restores its most recently placed position.
- Tactical positioning persists across different incident missions and ordinary page reloads.
- This is presentation preference data only; save format remains 4.

PRESERVED BEHAVIOR
------------------
- Tutorial step/progress/skip/completion state is unchanged.
- Strategic onboarding remains spoiler-free.
- Battle Tutorial content remains unchanged.
- Browser 1015 startup-scope hotfix, Browser 0945 vehicle-footprint/lighting-aware targeting fixes, Browser 2325 beacon recovery, and Browser 2155 AI recovery are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a Browser 1035 contract requiring separate position keys, lower-left default styling, normalized stored coordinates, drag handles in both tutorial components, and pointer-drag wiring.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open the strategic tutorial with no stored position and confirm it starts lower-left.
2. Drag it by the title bar, Hide it, reopen it, and confirm the new location is retained.
3. Enter an incident, drag the Battle Tutorial independently, hide/reopen it, and confirm its location is retained.
4. Confirm moving the Battle Tutorial does not move the strategic tutorial.
5. Drag against all four screen edges and confirm the panel remains recoverable onscreen.
6. Confirm Hide / Skip / Back / Next / Finish controls still work normally.
7. Reload the page and confirm both saved positions restore.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.1015_TACTICAL_TUTORIAL_SELF_TEST_SCOPE_STARTUP_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hotfixes the Browser 0945 startup failure `ReferenceError: tacticalAiFrameNewContactShot is not defined`. The new tactical tutorial/path/visibility regression test was global, while `tacticalAiFrameNewContactShot(...)` is intentionally local to the `TacticalMission` component. The test crossed that lexical-scope boundary during `runSelfTests()` and prevented application startup before any tactical gameplay ran.

SELF-TEST SCOPE FIX
-------------------
- Keeps the actual first-contact playback helper local to `TacticalMission`; gameplay behavior is unchanged.
- The global Browser 0945 contract now computes the synthetic new-contact fixture with equivalent local test logic rather than directly calling the component-local helper.
- Source coverage still requires `TacticalMission` to contain the real `tacticalAiFrameNewContactShot` helper and `contactRevealLead` playback wiring.
- The Browser 0945 vehicle-footprint final movement validation, lighting-aware pre-shot LOS revalidation, reveal-before-shot timing, and Battle Tutorial are unchanged.
- Browser 2155 AI recovery and Browser 2325 beacon must-progress recovery remain unchanged.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- The launch-time contract no longer contains an out-of-scope direct call to `tacticalAiFrameNewContactShot(currentFrame,previousFrame)`.
- The fixture still verifies a previously hidden alien becomes a legitimate first-contact shot candidate when the current frame reveals it.
- Source inspection confirms the real tactical helper remains in `TacticalMission`.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Launch the local `index.html` and confirm the start screen appears without the reported ReferenceError.
2. Open Build Health and confirm the Browser 0945 contract passes.
3. Re-test a first AI shot at a newly illuminated/revealed alien and confirm reveal precedes projectile playback.
4. Re-test land-vehicle path blocking and lighting-aware AI target validation.

PREVIOUS BUILD - 0945
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.0945_TACTICAL_INCIDENT_TUTORIAL_VEHICLE_PATH_AND_VISIBILITY_AUTHORITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds an independent spoiler-free tutorial overlay for the incident battle screen and fixes two live tactical correctness issues found during testing. Simulation movement now performs a final hard-cover/vehicle-footprint validation before any human or alien coordinate commit, so a stale or malformed planner route cannot carry a unit through a land vehicle. Human Simulation AI also revalidates lighting-aware line of sight immediately before firing and synchronizes first-contact reveal with playback so soldiers cannot shoot legitimately unseen contacts or appear to fire before a newly visible alien has rendered.

TACTICAL INCIDENT BATTLE TUTORIAL
---------------------------------
- Adds a separate tactical tutorial preference record; strategic tutorial completion/skip does not suppress battle guidance.
- First tactical incident auto-opens a non-blocking Battle Tutorial card unless that tactical tutorial was skipped or completed previously.
- Hide preserves the current step.
- Skip Tutorial suppresses automatic reopening.
- A Battle Tutorial button remains in the tactical command bar so guidance can be reopened/restarted deliberately.
- Eight lessons cover:
  1. soldier selection, legal movement and TU;
  2. 2D Hex vs 3D Iso, zoom/Fit Map and Iso drag-pan;
  3. FPV/TPV Simulation-AI observer cameras;
  4. Battle Speed;
  5. Command Map orders plus Pause Action / Resume Action;
  6. Hybrid AI vs Simulation AI and Take Back Control;
  7. inventory, stance, shot feedback and night-light tools;
  8. mission objectives, extraction, timeline, Menu / Save and Dust Off.
- The tactical guide follows the Browser 0845 spoiler rule and does not name/foreshadow unrevealed late-campaign systems.

LAND-VEHICLE / HARD-COVER MOVEMENT AUTHORITY
---------------------------------------------
- Existing path planners already expand multi-hex vehicle footprints, but the final Simulation resolver coordinate mutation could still trust a bad/stale plan path.
- New `tacticalAuthoritativeMovementPlan(...)` rechecks every route step and destination immediately before movement is committed.
- The guard consumes the same authoritative hard-cover footprint index used by movement, LOS and vehicle collision.
- An illegal path is rerouted with the shared hazard-aware pathfinder.
- If the legal detour exceeds the current movement allowance, only the legal prefix is used.
- If no legal path exists, the unit holds instead of moving through a vehicle/hard-cover cell.
- The guard covers ordinary AEGIS Simulation movement, emergency grid-search recovery, beacon-watchdog movement, and alien Simulation movement.
- Manual pathing continues using its existing footprint-aware reachable/path authority.
- Vehicle dimensions, HP, destruction and cover values are unchanged.

LIGHTING-AWARE AI TARGET VALIDATION
-----------------------------------
- Human AI actual visible contacts now use the same `hasLineOfSight(...)` authority as the tactical battlefield, including daylight/twilight/night vision range, local artificial light, Weapon Lights, Field Flares, smoke, facing cone and physical LOS.
- Immediately before a normal AI shot spends TU or ammunition, the target is revalidated against current lighting-aware LOS.
- If the contact is no longer currently visible, the shot is cancelled and the acting soldier records contact lost.
- Legitimately visible alien contacts are marked revealed and receive current last-known coordinates before frame capture.
- Tactical frame snapshots derive reveal state from current legitimate human visibility as an additional synchronization guard.
- Newly acquired human-shot contacts receive a short reveal lead during Tactical Map playback so Iso/FPV/TPV renders the alien before the projectile is animated.
- Reaction fire already uses lighting-aware LOS and remains unchanged.

PRESERVED BEHAVIOR
------------------
- Browser 2155 grid-search/exception recovery remains intact.
- Browser 2325 beacon must-progress recovery remains intact.
- Night vision ranges and darkness accuracy penalties are unchanged.
- Fog of war is unchanged; remembered/hidden contacts are not made targetable.
- TU costs, ammunition, hit/damage RNG, vehicle destruction, AI authority and save format are unchanged.
- Browser 0845 strategic onboarding remains independently spoiler-free.

BUILD HEALTH / VALIDATION
-------------------------
- Added a combined Browser 0945 contract with:
  - a deliberately illegal path through a multi-hex vehicle footprint;
  - a full-night target beyond unaided AEGIS vision;
  - the same contact becoming legitimate under a Field Flare;
  - contact reveal-before-first-shot playback detection;
  - source coverage for human, emergency, beacon-watchdog and alien movement commit guards;
  - tactical tutorial presence and spoiler rejection.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Live Three.js/lighting/AI playback remains the desktop manual gate.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Clear tactical tutorial local state and enter an incident battle. Confirm the Battle Tutorial appears independently of strategic tutorial state.
2. Test Hide, Skip, completion, and reopening through Battle Tutorial.
3. Confirm tutorial guidance accurately covers views, Battle Speed, Command Map, Hybrid/Simulation AI and battle controls without campaign spoilers.
4. In a map with cars/vans/trucks/buses, watch both friendly and alien AI path around every live vehicle footprint.
5. Destroy a vehicle and confirm the footprint can reopen under the normal destruction rules.
6. At night, keep an alien beyond unaided human vision and confirm AEGIS AI does not shoot it.
7. Illuminate the contact with a Field Flare/local light or Weapon Light and confirm it becomes targetable.
8. Observe the first shot at a newly acquired contact and confirm the alien is visibly rendered before the projectile fires.
9. Remove LOS/light before firing and confirm the shot is cancelled rather than spending TU/ammunition.
10. Re-run AI grid-search and beacon-only cleanup scenarios to confirm Browsers 2155/2325 remain stable.

PREVIOUS BUILD - 0845
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.0845_TUTORIAL_SPOILER_FREE_ONBOARDING_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Removes alien-base and hidden-command-site references from the new-player tutorial so those campaign discoveries remain genuine surprises revealed only through gameplay. Browser 0045's tutorial mechanics are preserved; only onboarding content and its regression contract are changed.

SPOILER-FREE TUTORIAL
---------------------
- The former Alien Base Discovery lesson is removed.
- The eighth lesson is now Continue the Campaign / Campaign Readiness.
- The final lesson tells players that future threats, opportunities, technologies, and strategic information will emerge naturally through missions, research, reports, contacts, and the Mainframe without naming or foreshadowing specific late-campaign discoveries.
- Tutorial titles, body text, bullets, and regression coverage must not contain `alien base` or `alien command site`.
- This restriction is tutorial-only; alien-base gameplay, progression, Mainframe logic, strategic rendering, and campaign documentation remain unchanged.

PRESERVED BEHAVIOR
------------------
- Eight-step, non-blocking tutorial structure remains intact.
- First Base Setup, Command Overview, Squad Assignment, First Mission Response, Research, Workshop, and Save / Export are unchanged.
- Hide, Skip Tutorial, Base Setup Tutorial, and What should I do next? remain available.
- Tutorial state remains browser-local and save format remains 4.
- Browser 2325 beacon must-progress recovery and Browser 2155 mission-AI recovery remain unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Updated the tutorial contract to require the final `campaign-readiness` step.
- The contract explicitly rejects `alien base` and `alien command site` strings inside the tutorial-step payload.
- All non-empty embedded JavaScript blocks must pass node --check.

MANUAL TEST GATES
-----------------
1. Start a fresh campaign and progress through all eight tutorial cards.
2. Confirm no tutorial card mentions, names, or foreshadows alien bases or hidden command sites.
3. Confirm the final lesson is Continue the Campaign / Campaign Readiness and returns to the Geoscape.
4. Confirm Hide, Skip Tutorial, Base Setup Tutorial, and What should I do next? still work normally.
5. Confirm later campaign discoveries remain available through their normal gameplay progression.

PREVIOUS BUILD - 0045
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.20.0045_NEW_PLAYER_TUTORIAL_OVERLAY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Implements the first release-prep onboarding slice: a lightweight, optional, skippable new-player tutorial overlay that guides a fresh commander through Project Aegis's first-base choice and the core strategic workflow without replacing the existing Instructions reference screen.

NEW-PLAYER TUTORIAL OVERLAY
---------------------------
- Fresh players who have not skipped/completed the tutorial see a non-blocking coaching card when they enter First Base Setup.
- The overlay does not darken or intercept the whole screen; the player can use the globe, base-selection controls, command sections, and Save / Load controls underneath it.
- Hide closes the current card without losing progress.
- Skip Tutorial suppresses automatic continuation.
- Tutorial completion is stored as browser-local onboarding preference data and does not change campaign save format.
- The Base Setup screen includes a Tutorial button so guidance can be deliberately restarted.
- Expanded and minimized normal command headers include What should I do next? to reopen the current tutorial step later.

FIRST 15 MINUTES GUIDANCE
-------------------------
1. First Base Setup: site selection, opening reach rings, base naming, and paused-time reassurance.
2. Command Overview / Geoscape: player role, command sections, opening incidents, panic, aircraft/base awareness, and time controls.
3. Squad Assignment: assign available soldiers to a Skyranger squad and point toward Soldiers/Quartermaster for equipment details.
4. First Mission Response: select an incident, review threat/readiness, plan a Skyranger response, and explain manual/Hybrid/Simulation tactical options.
5. Research: Laboratory scientists, research progression, and technology unlocks.
6. Workshop: production requirements and how unlocked designs become physical equipment.
7. Save / Export: shared Menu / Save, manual/autosaves, and Download Current Backup as the safest portable campaign copy.
8. Alien Base Discovery: non-spoilery explanation that deeper alien infrastructure is revealed through accumulated missions, tracked contacts, command-signal research, Mainframe discoveries, and reports rather than passive scanning alone.

NAVIGATION / SAFETY
-------------------
- Next automatically opens the relevant command section for the following lesson.
- The base-site lesson closes after acknowledgment so the player can interact freely; after Confirm Site - Begin Campaign the guide resumes automatically at Command Overview.
- The Save / Export lesson follows the player into the existing shared Menu / Save screen and returns to Geoscape for the last lesson.
- Tutorial state is separate from campaign simulation and does not change funds, time, mission state, AI, research, aircraft, squad composition, or combat.
- Browser 2325 beacon must-progress recovery and Browser 2155 mission-AI recovery remain unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added NEW_PLAYER_TUTORIAL_OVERLAY_PATCH and an eight-step tutorial contract.
- Focused helper validation confirms tutorial state clamps safely, defaults to step 0, and retains skip/completion flags independently of campaign saves.
- Source coverage requires the non-blocking overlay, Base Setup Tutorial button, What should I do next? control, skip behavior, backup guidance, and alien-base discovery explanation.
- All 6 non-empty embedded JavaScript blocks pass node --check.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Start a fresh campaign and confirm the base-site tutorial opens without blocking globe/site controls.
2. Hide and reopen it from Base Setup Tutorial.
3. Confirm site and verify Command Overview resumes automatically.
4. Advance through Squads, Missions, Research, Workshop, Save / Export, and Alien Base Discovery; confirm each destination opens correctly.
5. Verify What should I do next? works in expanded and minimized normal headers.
6. Skip the tutorial and confirm it does not force itself open again.
7. Finish the tutorial, start another campaign, and confirm automatic onboarding stays suppressed while manual guidance remains available.

PREVIOUS BUILD - 2325
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2325_BEACON_ENDGAME_MUST_PROGRESS_WATCHDOG_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes a live beacon-only Simulation-AI stall reproduced immediately after the final VIP was rescued. With no living aliens or unresolved VIPs left, a confirmed Alien Field Beacon could remain as the sole mandatory objective while the streamed AI rapidly advanced tactical rounds without useful movement or fire. Browser 1315 already assigned a beacon assaulter, but the round resolver did not require that assignment to make measurable progress before another continuation was generated.

BEACON MUST-PROGRESS WATCHDOG
-----------------------------
- Beacon-only endgame now measures progress using beacon HP/state plus the selected assaulter's distance/inside-shield state.
- If the normal AEGIS pass does not damage/disable/destroy the beacon, move the assaulter closer, or put the assaulter inside the shield, the assaulter receives an immediate same-round retry.
- The watchdog clears the assaulter's movement reserve and stale temporary command fields, retries the beacon approach, and fires immediately when a legal loaded ranged shot is available.
- The resolver therefore does not silently treat an empty beacon-only round as satisfactory progress.

FRIENDLY-TRAFFIC CLEARING
-------------------------
- Non-assaulting soldiers occupying the seven-hex beacon field or crowding the immediate approach now move to a short legal perimeter position rather than simply freezing in place.
- The close-assault pathfinder ignores same-side AEGIS traffic along the path so a capable assaulter can pass through teammates.
- Final destination occupancy remains authoritative; the assaulter cannot finish movement on an occupied hex.
- These changes are specifically intended to prevent support troops from trapping the only capable soldier outside a combined shield.

NO-BREACH STREAM GUARD
----------------------
- If no living AEGIS soldier has a loaded ranged weapon or Frag Grenade available for a legal beacon breach solution, the existing no-breach state is preserved.
- Full Simulation AI now treats that state as blocked and stops automatic continuation.
- The live battlefield is preserved for Take Back Control or Dust Off instead of rapidly consuming empty rounds.
- The patch does not invent ammunition, grenades, beacon damage, or victory.

PRESERVED BEHAVIOR
------------------
- Unshielded, kinetic, and combined beacon shield rules are unchanged.
- Research-gated intact beacon disable/hacking and Pale Commander badge behavior are unchanged.
- Browser 2155 AI exception/grid-search recovery, Browser 2255 timeline report archive, and Browser 2305 shot-feedback accessibility remain intact.
- Hit chance, damage, TU costs, ammunition, LOS, cover, rescue scoring, mission victory authority, and save format are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a perimeter-clear helper regression using a soldier standing inside the beacon shield.
- Added a combined-shield close-assault regression with friendly traffic in the approach.
- Added progress-state validation for reduced beacon HP / improved assaulter position.
- Added source contracts requiring the same-round watchdog retry, perimeter-clear action, and blocked no-breach stream handling.
- Focused helper harness confirmed a shield-adjacent non-assault soldier moves to a legal cell outside the field.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Complete the VIP rescue portion of a mission so the beacon is the only objective and confirm Simulation AI immediately commits to it.
2. Confirm a capable assaulter moves closer/inside and damages or neutralizes the beacon instead of rapidly advancing empty rounds.
3. Place friendly troops around the shield and confirm non-assault troops clear outward while the assaulter can pass through their traffic.
4. Confirm combined shielding still requires the loaded ranged assaulter to enter the field before firing.
5. Exhaust all usable ranged ammunition and Frag Grenades, then confirm auto-streaming stops in the no-breach state and preserves the battlefield.
6. Confirm Hybrid AI, VIP extraction, Browser 2155 grid-search recovery, save/load, and Browser 2305 shot-result settings are unchanged.

PREVIOUS BUILD - 2305
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2305_TACTICAL_SHOT_FEEDBACK_ACCESSIBILITY_SETTINGS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Implements the next Stage 3 Tactical Readability accessibility follow-up. Tactical HIT / MISS / ARMOR HIT / TARGET DOWN / CRITICAL KILL result cards now support persistent Brief (3s), Standard (10s), and Extended (20s) visibility choices plus Standard or Reduced Motion presentation. Shot Results On/Off now persists across missions as part of the same presentation preference. Reduced Motion removes the card slide/scale transition and the first-run default honors the operating-system/browser reduced-motion preference when available.

SHOT RESULT DURATION
--------------------
- Brief: 3 seconds.
- Standard: 10 seconds and remains the existing default.
- Extended: 20 seconds.
- Changing the duration clears currently scheduled shot cards/timers before applying the new timing so mixed old/new expiry rules cannot overlap.

REDUCED MOTION
--------------
- Standard Motion retains the existing opacity + translate/scale exit animation.
- Reduced Motion removes transform/transition animation and removes each card directly when its selected duration expires.
- First-run motion preference follows `prefers-reduced-motion: reduce` when the browser exposes it.
- Projectile effects, Critical Kill cinematics, incoming-fire reaction slow motion, tactical movement, and camera motion are not changed by this card-only setting.

PERSISTENCE / SAVE CONTINUITY
-----------------------------
- Shot Results On/Off, duration, and motion are stored in local presentation preferences.
- Active tactical state also stores optional duration/motion values so Menu / Save continuity preserves the current mission presentation.
- Older saves normalize safely. Save format remains 4.

GAMEPLAY / AI UNCHANGED
-----------------------
- Hit chance, RNG, damage, armor, ammunition, TU, AI decisions, Simulation/Hybrid playback pacing, mission resolution, tactical timeline generation, and Browser 2255 report archiving are unchanged.
- Browser 2155 AI exception containment and emergency grid-search recovery are untouched; this build intentionally avoids changing the AI behavior that is currently testing without stalls.

BUILD HEALTH / VALIDATION
-------------------------
- Added bounded helper validation for 3s / 10s / 20s duration normalization and invalid-value fallback.
- Added validation that Reduced Motion produces no translate/scale transform and no transition.
- Build Health requires the duration and motion controls plus settings-aware timer scheduling in TacticalMission.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Select Brief and fire several shots; confirm result cards clear after about 3 seconds.
2. Repeat with Standard and Extended; confirm approximately 10-second and 20-second visibility.
3. Toggle Reduced Motion and confirm cards no longer slide/scale when leaving.
4. Turn Shot Results Off, leave/re-enter tactical play, and confirm the preference persists.
5. Change duration/motion, save and reload an active tactical mission, and confirm the current presentation settings remain selected.
6. Confirm shot results, combat timing, tactical timeline, Simulation/Hybrid AI behavior, incoming-fire reaction shots, and Critical Kill cinematics are otherwise unchanged.

PREVIOUS BUILD - 2255
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2255_TACTICAL_TIMELINE_MISSION_REPORT_ARCHIVE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Implements the next Stage 3 Tactical Readability roadmap follow-up by carrying the live 48-event categorized Mission Timeline into the permanent Mission Report when a tactical operation ends. Manual tactical play, Hybrid AI, and full Simulation-AI Tactical Map completion all pass through the same archive wrapper. Existing Mission Action Log entries remain intact for compatibility, while newly completed reports gain a scrollable archived timeline with category, round, acting side, and event text. Older reports remain readable and explicitly identify that they predate timeline archiving.

TACTICAL TIMELINE ARCHIVE
-------------------------
- The live tactical Mission Timeline remains bounded to the latest 48 events.
- Mission completion now snapshots those events into `result.tacticalTimeline` before control returns to campaign aftermath.
- Missing terminal result-log lines are merged into the archive so success/failure/withdrawal text is not lost if React state has not yet committed the final UI update.
- Timeline records retain text, Combat/Rescue/Movement/System category, tactical round, and acting side.
- The archive is JSON-safe and stored directly on the existing mission report object; save format remains 4 because the field is optional and backward compatible.

ALL CONTROL MODES SHARE THE SAME HANDOFF
----------------------------------------
- Manual `finish(...)` routes through the timeline archive wrapper.
- Full Simulation-AI playback completion routes through the same wrapper.
- Hybrid-AI terminal completion routes through the same wrapper.
- Taking back control or continuing an unfinished mission does not prematurely create a permanent report archive.
- Browser 2155 AI recovery/search behavior is unchanged.

REPORTS UI
----------
- The existing Mission Action Log remains unchanged and continues to support older campaign/report assumptions.
- New mission reports add an **Archived Tactical Timeline** section below the Action Log.
- Each archived event shows category, round, acting side, and the original tactical event text.
- The archive is scroll-bounded in the Reports view so a 48-event mission does not excessively expand the page.
- Reports created before Browser 2255 display a clear legacy note instead of failing on a missing timeline field.

CATEGORY CORRECTION
-------------------
- The tactical event classifier previously used a raw `miss` substring test, which could classify `Mission success` / `Mission failed` as Combat because `mission` begins with `miss`.
- Miss classification now uses a word-boundary form (`miss`, `missed`, `misses`, `missing`) so mission-result/system lines remain System events while genuine missed-shot text remains Combat.

BUILD HEALTH / VALIDATION
-------------------------
- Added a direct archive regression covering Movement, Rescue, and terminal System events with preserved round data.
- Build Health now requires completed mission reports to archive the categorized tactical timeline.
- Static verification confirms all TacticalMission terminal `onFinish(...)` paths route through `finishTacticalMission(...)`.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Complete a manual tactical mission after generating Combat, Rescue, Movement, and System events; open Reports and confirm the Archived Tactical Timeline appears beneath the existing Mission Action Log.
2. Complete a Hybrid-AI-controlled mission and confirm its terminal report also contains the archive.
3. Complete a full Simulation-AI Tactical Map mission and confirm its terminal report contains the archive.
4. Confirm event rounds/categories remain readable and that `Mission success` / `Mission failed` is categorized as System rather than Combat.
5. Load an older save with pre-2255 mission reports and confirm those reports still open and show the legacy-timeline note without migration errors.
6. Save/reload after completing a 2255 mission and confirm the archived timeline survives because it is stored with `missionReports`.
7. Continue stress-testing Browser 2155 AI recovery behavior and confirm this patch does not change AI planning, search, escort, TU, combat, or mission-resolution rules.

PREVIOUS BUILD - 2155
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2155_AI_EXCEPTION_GRID_SEARCH_RECOVERY_AND_MISSION_SCOPE_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hotfixes the newly reproduced tactical-AI failure where manual movement/end-turn could make AI takeover responsive again, only for the resolver to throw `mission is not defined`. The crash came from the shared fallback patrol/search helper passing a bare `mission` identifier that was not in scope. The same patch also turns fallback patrol into a deterministic fire-team sector/grid sweep and contains per-soldier planner exceptions so one bad movement/order branch cannot abort the entire Hybrid or Simulation AI round. Escorting soldiers remain dedicated to civilian/VIP extraction and do not get diverted into the emergency search.

MISSION-SCOPE CRASH FIX
-----------------------
- `tacticalAiFallbackPatrolPlan(...)` now binds the mission explicitly from `options.mission` before calling reachable/path helpers.
- The former free `mission` reference that produced `ReferenceError: mission is not defined` is removed.
- This specifically covers the fallback branch reached after some manually altered/end-turn battlefield states.

EMERGENCY GRID / SECTOR SEARCH
------------------------------
- The old generic fallback patrol now uses the existing systematic alien-hunt grid cells and fire-team slot assignment.
- Different fire teams receive different portions of the sweep where possible instead of collapsing onto one patrol point.
- Search movement remains bounded by available TU, reserve TU, hard-cover/occupancy blockers, hazard costs, and the shared fast-planning budget.
- Repeated/visited cells are penalized so a stalled unit is encouraged to make fresh map progress.
- If a soldier legitimately acquires LOS to a living alien partway through the fallback route, the emergency route stops at that contact checkpoint rather than blindly finishing the sweep.

PER-SOLDIER EXCEPTION CONTAINMENT
---------------------------------
- Each non-escort human AI turn is now executed through a safe wrapper.
- If normal tactical planning throws, only that soldier's normal plan is abandoned; the rest of the AI round continues.
- The affected soldier performs the bounded grid-search fallback from its current authoritative position/TU state.
- If a valid visible alien is acquired and the soldier still has a legal firing reserve, the soldier immediately returns to combat and fires using the normal hit/damage/shield/window rules.
- If no legal movement exists, the soldier holds instead of blocking the entire mission AI.

VIP / CIVILIAN ESCORT AUTHORITY
------------------------------
- Soldiers already claimed by the civilian/VIP rescue pass remain outside the emergency grid-search wrapper.
- They continue escort/extraction duty using the existing rescue authority and Skyranger routing rules.
- Emergency search therefore cannot pull an escort away from a civilian/VIP simply because another AI planner failed.

SHARED HYBRID / SIMULATION SAFEGUARDS RETAINED
----------------------------------------------
- The in-progress 2150 bounded-planning work is included in this hotfix: Hybrid one-round resolution now uses the same fast bounded planning authority as Simulation-AI round generation.
- Stale Hybrid animation latches are cleared when no movement/playback/timer actually owns them.
- These changes reduce the chance of a long pathological path search making either AI mode appear unresponsive.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression that executes the fallback plan with a real mission object and rejects the old out-of-scope `mission` failure.
- Build Health also requires sector-grid fallback wiring, per-soldier exception containment, escort exclusion, and contact reacquisition behavior.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Retry the mission that produced `mission is not defined`; hand control to Hybrid and Simulation AI after a manual move/end-turn and confirm the exception does not recur.
2. Force a no-contact/search-heavy state and confirm non-escort fire teams spread through different grid sectors instead of freezing on one stale target.
3. Confirm soldiers actively escorting civilians/VIPs continue toward extraction and are never reassigned into emergency grid search.
4. During an emergency sweep, reveal an alien and confirm the searching soldier stops the blind sweep and returns to normal combat behavior/fire when TU permits.
5. Create a blocked soldier with no legal fallback move and confirm that soldier holds while other AI units continue acting.
6. Confirm Hybrid AI returns control after its bounded round and full Simulation AI can continue streamed rounds normally.

PREVIOUS BUILD - 2050
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2050_TACTICAL_AI_RESERVE_AND_FINAL_ACTION_PLAYBACK_HUD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Implements the next tactical-AI readability refinement explicitly called out by the roadmap. During Simulation-AI Tactical Map playback, the established upper-right observer panel now shows the acting soldier's chosen TU reserve and resolved final turn action from the authoritative metadata already stored on playback frame units. The feature is presentation-only and does not change AI decisions or combat results.

AI TURN PLAN HUD
----------------
- Adds a compact AI Turn Plan block to the persistent upper-right tactical observer panel.
- The readout follows the current AI action actor from the active playback frame rather than whichever soldier may still be selected underneath AI control.
- Chosen Reserve uses the recorded `aiReserveLabel` and displays the recorded `reserveTu` when non-zero.
- Final Turn Action translates `aiTurnAction` into readable outcomes including Move, Move + Fire, Move + Throw Frag Grenade, Move + Kneel, Regroup with Fire Team, Disable Beacon, Hybrid Flank, ranged cover/standoff movement, and Hold Position.
- If the resolver performed its existing single movement checkpoint reassessment, the HUD notes that reassessment.
- The block remains visible during Simulation-AI Tactical Map playback in Iso, FPV, and TPV.

AUTHORITATIVE METADATA / COMPATIBILITY
--------------------------------------
- The UI consumes the active frame's human soldier snapshot; it does not infer or recalculate an AI plan from current live state.
- Older/incomplete cached playback data receives safe readable fallbacks instead of undefined labels.
- No changes to adaptive reserve selection, movement planning, fire-team pacing, rescue/search doctrine, beacon logic, hit chance, damage, RNG, TU costs, ammunition, fog of war, or mission resolution.
- Save format remains 4.
- Browser 2045 hidden-contact VIP rescue and AI handoff recovery remains intact.
- Browser 1935 kneeling movement/pose parity and Browser 1815 concurrent Skyranger operations remain intact.

BUILD HEALTH / VALIDATION
-------------------------
- Added a deterministic metadata-to-HUD contract that verifies an Aimed Shot / 22 TU reserve and Move + Fire final action resolve to the expected display values.
- The contract requires the current frame soldier authority and the AI Turn Plan DOM marker in TacticalMission.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Hand a mission to Simulation AI and watch Tactical Map playback in Iso. Confirm the active soldier's Chosen Reserve and Final Turn Action update with each action frame.
2. Confirm Aimed Shot, Snap Shot, Burst, Full Auto, and Kneel + Snap labels match actual AI behavior when those reserves occur.
3. Confirm movement-only, Move + Fire, grenade, kneel, formation catch-up, and beacon outcomes use readable final-action labels.
4. Toggle FPV and TPV and confirm the same AI Turn Plan stays synchronized with the acting soldier.
5. Confirm no hidden alien/VIP information is exposed by the new block.
6. Save/reload and verify tactical continuity remains unchanged.

PREVIOUS BUILD - 2045
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.19.2045_HIDDEN_CONTACT_VIP_RESCUE_AND_AI_HANDOFF_RECOVERY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the Simulation-AI stall reproduced on a mandatory VIP mission where several VIPs remained active and one living alien was hidden. The key fault was not the VIP pathing alone: a previously seen but currently hidden alien could retain a last-known position and be treated as global combat priority. That suppressed autonomous VIP rescue assignments and sent the squad back into repeated hidden-contact searching. Hybrid AI could still complete its bounded support round, but full Simulation AI could stall or fail to produce a useful continuation until the hidden alien was manually killed.

HIDDEN-CONTACT / VIP SPLIT-TASK DOCTRINE
----------------------------------------
- Rescue arbitration now distinguishes an alien that is currently observed from a merely remembered/hidden contact.
- A currently visible alien still creates normal immediate combat priority.
- If living aliens remain but none are currently observed and mandatory VIPs are still active, Simulation AI can search and rescue concurrently.
- With two or more eligible free fire-team leaders, one fire team continues the hidden-contact search while the remaining free teams continue VIP recovery.
- The search-team lead prefers the nearest legitimate last-known alien position when one exists.
- With only one eligible free fire-team leader, no search reservation is created; the sole team continues the mandatory rescue first rather than deadlocking itself on the hunt.
- Hidden aliens remain hidden. The searching team uses only legitimate last-known information or the existing systematic map-sweep doctrine.

VIP RESCUE STALL RECOVERY
-------------------------
- Multiple tracked VIPs continue to be distributed across available rescue fire teams.
- Rescue-authority phases can clear stale autonomous fire-team command orders for non-player-owned teams so required rescue work can resume.
- Rescue leader pathing ignores temporary same-fire-team traffic when building a route, preventing forming supports from falsely blocking the leader's path.
- Rescue teams can use independent pacing when no alien is currently observed, avoiding zero-progress formation locks.
- Repeated no-progress rescue routes reset bounded rescue-route memory rather than replaying the same failed route indefinitely.

SIMULATION AI / RETRY RECOVERY
------------------------------
- Retry AI Continuation now treats active VIP rescue with no currently visible alien as a rescue-recovery state even if a hidden alien is still alive.
- Recovery clears stale hunt/search/patrol state as before and also resets stale rescue target/visited/stall state and non-player autonomous fire-team orders for this condition.
- This is intended to make a retry generate a genuinely fresh rescue/search split rather than reconstructing the same deadlock.
- Existing 1045 first-handoff planning limits and 0945 continuation self-heal remain intact.

PRESERVED BEHAVIOR
------------------
- Fog of war and hidden-information rules are unchanged.
- VIP tracker information is used only where the mission legitimately provides it.
- Hit chance, damage, armor, TU costs, ammunition, weapon ranges, LOS, cover, AI action order, mission victory authority, kneeling balance, and save format are unchanged.
- Browser 1935 kneeling movement/pose parity and Browser 1815 concurrent Skyranger operations are preserved.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression covering three active VIPs, a living hidden alien, three fire-team leaders, one reserved search leader, concurrent rescue assignments, the single-team no-deadlock fallback, and hidden-contact Retry recovery.
- All 6 non-empty embedded JavaScript blocks pass `node --check`.
- Full live browser/Three.js mission validation remains a desktop test gate.

MANUAL TEST GATES
-----------------
1. Reproduce a mandatory rescue with 3 active VIPs and one previously seen alien hidden from all current AEGIS LOS.
2. Hand full control to Simulation AI and confirm it does not stall at takeover.
3. Confirm one free fire team searches while other free teams continue VIP rescue.
4. Repeat with only one free fire-team leader and confirm that team rescues rather than being reserved for an endless search.
5. Reveal the hidden alien and confirm immediate combat priority resumes.
6. Hide it again and confirm split rescue/search can resume.
7. If an AI stream is interrupted in this state, press Retry AI Continuation and confirm it produces a fresh plan.
8. Confirm Hybrid AI still works normally and switching from Hybrid to full Simulation AI does not require manually killing the hidden alien.

PREVIOUS PATCH NOTES
====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.2115_ISO_UNIT_FOG_FREE_READABILITY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixes the remaining 3D Iso night-unit readability problem shown in live testing. Browser 2045 made visible units unlit in Iso, but the temporary readability materials still participated in the dark Night Operations scene fog, and unit pieces that were already MeshBasicMaterial could bypass the conversion. Browser 2115 makes the Iso-only unit materials both unlit and fog-free. FPV, TPV, and incoming-fire reaction cameras still restore the original light-reactive materials and retain the normal night atmosphere.

3D ISO FOG-FREE UNIT READABILITY
--------------------------------
- This fix is specifically for the **3D Iso view**.
- Every legitimately visible soldier, alien, civilian, and VIP mesh now uses a cached Iso readability material with `fog:false` and `toneMapped:false`.
- Atmospheric night fog can no longer blend visible unit models toward black at elevated Iso camera distances.
- Unit parts that already use MeshBasicMaterial are no longer returned unchanged; they receive the same cached fog-free readability treatment as lit MeshStandard/MeshLambert parts.
- Authored armor, vest, skin, weapon, civilian/VIP, and alien-archetype colors remain readable.
- Terrain, buildings, vehicles, Skyrangers, vegetation, props, sky, and environmental fog remain dark at night.

FPV / TPV LIGHTING PRESERVED
-----------------------------
- First Person, Third Person, and incoming-fire reaction views restore each unit mesh's original material immediately.
- Street lamps, vehicle headlights, building lights, Skyranger lights, Weapon Lights, Field Flares, alien beacon light, and scene fog remain visually meaningful in those close-camera views.
- Returning to Iso reapplies the cached fog-free readability materials without rebuilding unit geometry.

GAMEPLAY UNCHANGED
------------------
- Night/twilight sight ranges remain unchanged.
- Darkness accuracy penalties remain unchanged.
- Artificial-light visibility restoration remains unchanged.
- Physical LOS/shot blocking remains unchanged.
- Hidden units are not revealed by this presentation fix.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Build Health requires `fog:false` on the Iso readability material.
- Build Health rejects the prior `if(material.isMeshBasicMaterial)return material` bypass.
- The existing mode-aware material restoration contract still requires FPV/TPV/reaction cameras to use the original light-reactive material.
- All embedded JavaScript blocks pass `node --check`.

MANUAL TEST GATES
-----------------
1. Open a full-night mission in **3D Iso** and confirm visible AEGIS soldiers are clearly readable rather than near-black silhouettes.
2. Check aliens, civilians, and VIPs in the same view and confirm their authored palette remains readable.
3. Switch to FPV/TPV near and away from a light source and confirm characters again react normally to local lighting and night atmosphere.
4. Return to Iso and confirm unit colors brighten immediately without globally brightening terrain/buildings.
5. Confirm LOS, night sight range, hit penalties, Weapon Lights, and Field Flares behave exactly as before.

PREVIOUS BUILD 2045 - 3D ISO UNIT READABILITY AT NIGHT
------------------------------------------------------

SUMMARY
-------
Keeps Night Operations gameplay-authoritative while restoring unit readability in the 3D Iso presentation. Soldiers, aliens, civilians, and VIPs no longer become nearly black simply because the scene is at night. In 3D Iso, visible unit meshes use temporary unlit readability materials that preserve their authored colors. FPV, TPV, and incoming-fire TPV reaction views immediately restore the original light-reactive materials, so local lamps, headlights, Weapon Lights, Field Flares, Skyranger lighting, and darkness still shape the close-camera visual experience.

3D ISO UNIT READABILITY
-----------------------
- Individual tactical units in 3D Iso are decoupled from dynamic night-light shading once they are legitimately visible.
- Human armor/vest/skin/weapon colors, civilian colors, and the six canonical alien palettes remain readable instead of collapsing toward black under low exposure.
- Iso readability uses temporary MeshBasicMaterial equivalents derived from each unit's existing material and preserves color, opacity, side/depth behavior, maps, vertex-color flags, and fog participation.
- Terrain, buildings, vehicles, vegetation, Skyrangers, street props, sky, fog, and environmental light sources remain night-dark. This is not a global brightness increase.

FPV / TPV LIGHTING PRESERVED
-----------------------------
- Entering First Person restores each unit's original MeshStandard/MeshLambert material immediately.
- Entering Third Person does the same, including the temporary incoming-fire TPV reaction camera.
- Returning to Iso reapplies the cached unlit readability materials without rebuilding the tactical scene.
- Weapon-light spotlights, street lamps, vehicle headlights, building lights, Field Flares, and Skyranger lights therefore remain visually meaningful in FPV/TPV.

GAMEPLAY LIGHTING UNCHANGED
---------------------------
- Day/twilight/night sight ranges are unchanged from Browser 1515.
- Darkness accuracy penalties are unchanged.
- Artificial-light visibility restoration is unchanged.
- LOS/shot blocking through walls, vehicles, Skyranger hull cells, and other opaque cover is unchanged.
- Flashlight and Field Flare state/AI behavior is unchanged.
- The change is presentation-only and does not reveal hidden units.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Build Health verifies that Iso uses an unlit unit-readability path while FPV/TPV/reaction cameras select the original light-reactive materials.
- An isolated material-swap harness confirms Iso -> FPV -> reaction TPV -> Iso restores and reuses the correct material set.
- All six embedded JavaScript blocks pass `node --check`.

PREVIOUS BUILD 1545 - VIP EXTRACTION RAMP PATHING + ESCORT HOLD FIX
-------------------------------------------------------------------
Fixes a VIP rescue/extraction stall where an escort soldier could reach the Skyranger ramp/cabin while escorted VIPs remained stationary beside the craft for multiple turns. Once the escort commits to the Skyranger extraction corridor, each escorted VIP now receives an independent bounded path to an actually open ramp cell. The escort may hold position while followers route around the solid Skyranger hull. A VIP is not counted rescued until that VIP itself occupies a valid extraction cell.

VIP EXTRACTION RAMP PATHING FIX
--------------------------------
- Escorted VIP movement no longer depends exclusively on the escort soldier taking another movement step after reaching the Skyranger.
- When the escort is already on/in the extraction corridor, remaining escorted VIPs perform their own bounded route search toward the ramp.
- The route respects hard-cover/path blockers, including the solid Skyranger hull, and uses only open/passable ramp cells as extraction targets.
- VIPs beside either side of the craft can route around the hull toward the rear opening instead of remaining stationary beside the fuselage.
- The escort can remain stationary while followers advance up to three path cells during the rescue pass; movement trails are retained for 3D/FPV/TPV playback.
- Multi-Skyranger missions preserve craft affinity by selecting the extraction craft associated with the escort.
- `rescued` / `extracted` is set only when the civilian itself reaches a valid extraction-ramp cell.
- Save format remains 4.

REGRESSION COVERAGE
-------------------
- Added a Build Health scenario with the escort already two cells inside the ramp, zero movement TU, and two VIPs stalled beside opposite sides of the Skyranger.
- The contract requires both VIPs to progress around the solid hull and extract while the escort stays stationary.
- Existing building-egress, no-building-reentry, extraction-traffic, and Skyranger hard-cover contracts remain in place.

PREVIOUS BUILD 1515 - NIGHT OPERATIONS
---------------------------------------
Makes night and twilight materially affect tactical missions instead of acting as visual atmosphere only. Unaided AEGIS visibility is reduced, darkness penalizes shot accuracy, and a unified local-light system allows street lamps, abandoned vehicle headlights, lit buildings, Skyranger lights, underslung Weapon Lights, Field Flares, and alien beacon glow to restore practical visibility. The optimized visibility cache was updated so light/time state remains authoritative without discarding the earlier performance work.

NIGHT / TWILIGHT GAMEPLAY
-------------------------
- Daylight retains the normal 20-hex AEGIS vision ceiling.
- Twilight reduces unaided human vision to 12 hexes.
- Full night reduces unaided human vision to 7 hexes.
- Aliens retain stronger unaided dark vision: 16 hexes at twilight and 14 at night.
- Unilluminated human shots receive an 8-point twilight or 18-point night accuracy penalty. Aliens receive smaller 3/6-point penalties.
- Illuminating the target cell with a local source or the shooter's Weapon Light removes the darkness accuracy penalty.
- Physical LOS remains authoritative: light never permits sight or fire through buildings, vehicles, Skyranger hull cells, or other opaque hard cover.

ENVIRONMENTAL LIGHT SOURCES
---------------------------
- Street lamps now provide a functional approximately 7-hex night light radius.
- A deterministic subset of abandoned cars/vans/trucks spawn with headlights left on (approximately 8 hexes); buses can illuminate approximately 9.
- A deterministic subset of building windows represent occupied/lit interiors and illuminate approximately 5 hexes around the facade.
- The friendly Skyranger rear ramp/extraction area provides approximately 8 hexes of gameplay illumination. The 3D craft also has visible rear perimeter lamps and a troop-bay light.
- Active Alien Field Beacons retain a weaker local glow that can reveal a small pocket of the battlefield.

WEAPON LIGHTS
-------------
- AEGIS soldiers now carry an underslung Weapon Light state.
- During manual control, Weapon Light can be toggled ON/OFF outside full daylight.
- The gameplay beam extends useful forward visibility to approximately 14 hexes inside its facing cone.
- FPV uses a real Three.js SpotLight attached beneath the weapon; ordinary 3D soldiers also display an active light when appropriate.
- Simulation AI automatically switches AEGIS Weapon Lights on during twilight/night.
- Weapon Light state is included in observer visibility caches, React visibility memoization, AI snapshots, and persistent-render keys so toggling it immediately updates actual LOS.

FIELD FLARES
------------
- Every AEGIS soldier currently begins a mission with 1 Field Flare.
- Manual throw cost: 8 TU.
- Throwing range: 8 hexes.
- Illumination radius: approximately 10 hexes.
- Flares may be thrown into unexplored darkness and remain active for the mission in this first balance pass.
- Field Flares are light sources, not solid cover, and therefore do not alter movement/pathing by themselves.

VISIBILITY CACHE / PERFORMANCE
------------------------------
- The later optimized visibility-cache layer was updated to carry the mission lighting state into `tacticalVisibilityContext` instead of silently rebuilding a daylight-only context.
- Relevant cover-light metadata (`lightType`, active state, radius, alien beacon state) is part of the visibility cover key.
- Observer cache keys include Weapon Light state. React visibility memo keys also include Weapon Light and environmental light metadata.
- Civilian threat/panic LOS now receives the same mission lighting context so civilians do not use a separate daylight-only illumination model at night.
- Three.js environmental dynamic lights are capped at 14 active local lights. Gameplay illumination remains authoritative even if more sources exist than the renderer chooses to represent with real-time PointLights.

NIGHT PRESENTATION
------------------
- Full-night sky/atmosphere exposure, hemisphere illumination, key light, and fog distance are reduced so night is meaningfully darker.
- The existing safe camera-relative sky shell remains below the FPV far clipping range; this patch does not reintroduce the old giant celestial/sky-dome geometry regression.
- Field Flares render as emissive tactical light objects.
- Headlight-equipped vehicles and lit building windows receive emissive visual treatment when visible.
- Skyranger rear lamps visually reinforce the illuminated extraction pocket.

BUILD HEALTH / VALIDATION
-------------------------
- Updated the older 'lighting disabled' performance contracts so Build Health now expects bounded, indexed tactical lighting rather than requiring lighting to be absent.
- Added a Night Operations contract covering full-night range reduction, artificial-light range restoration, darkness accuracy penalties, Weapon Light/Field Flare controls, Three.js spot lighting, street lamps, and Skyranger gameplay lighting.
- Isolated helper validation confirms: full night = 7 human unaided hexes, Field Flare-lit target = 18, Weapon Light forward reach = 14, unlit night human accuracy penalty = 18, lit penalty = 0, daylight range = 20, light-source cache invalidation works, and Weapon Light observer keys differ immediately.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Compare similar daylight, twilight, and full-night missions. Confirm unexplored night terrain closes in substantially around the squad.
2. At night, approach a street lamp, lit building window, or vehicle with headlights on and confirm visibility expands locally rather than globally.
3. Toggle Weapon Light in manual control and confirm forward visibility/accuracy changes immediately; check the visible beam in FPV and TPV.
4. Throw a Field Flare into darkness and confirm a roughly ten-hex pocket becomes useful without allowing sight through walls/vehicles.
5. Approach the friendly Skyranger at night and confirm the ramp/extraction area is locally illuminated while hull cells remain solid LOS/shot blockers.
6. Allow AI to take control at night and confirm AEGIS soldiers automatically use Weapon Lights.
7. Confirm dense night urban maps remain responsive; renderer-side environmental PointLights are capped even when gameplay has more active light sources.

ASSETS
------
- No new binary assets were added.
- Existing victory music and the rest of the packaged assets are unchanged.

PREVIOUS BUILD - 1335
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.1335_TACTICAL_DRAG_PAN_SOLID_VEHICLES_SKYRANGER_VOICE_AND_FPV_DANCE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Adds direct click-and-drag panning to the persistent Three.js Iso battlefield, simplifies player-facing AI handoff to the Tactical Map, closes remaining multi-hex road-vehicle movement/LOS/shot seams, makes the Skyranger rear troop bay visibly open while preserving solid hull geometry, removes duplicate AI shot voice confirmations, and fixes an already-active FPV camera failing to enter the victory-dance motion when success begins.

THREE.JS ISO CLICK-DRAG PAN
---------------------------
- Left-click dragging directly on the 3D Iso battlefield now pans the persistent orthographic camera like grabbing and moving a physical map.
- A five-pixel movement threshold distinguishes a drag from an ordinary hex click. After a real drag, the following click event is briefly suppressed so releasing the mouse cannot accidentally select or order a destination.
- Panning uses the real camera right/up directions and current orthographic zoom so movement remains consistent at Close, Near, Wide, Full, and Fit Map scales.
- The pan offset lives on the persistent renderer runtime and therefore survives ordinary soldier movement, AI updates, fog changes, and React renders rather than snapping back every update.
- Entering Fit Map from another zoom state resets the pan offset so Fit Map still performs its exact Browser 1235 complete-map framing.
- FPV, TPV, incoming-fire reaction, and Critical Kill cameras do not accept the map-drag gesture.

AI HANDOFF - TACTICAL MAP ONLY
------------------------------
- The player-facing AI Command confirmation now offers only Cancel and Watch Tactical Map.
- Classic Overlay is no longer offered as a handoff choice.
- `handOffToSimulationAi(...)` normalizes player handoff to `view="map"`, preventing a stale caller from selecting the removed presentation path.
- Legacy overlay playback code remains internally available only for compatibility with historical/cached states; no current player control invokes it.

ROAD VEHICLES - FULL FOOTPRINT AUTHORITY
----------------------------------------
- The existing 3x2 car/van/utility footprints and larger bus footprints are now consumed consistently by movement playback, hard-cover collision, shot interception, target-cover selection, cover adjacency, and FPV shot-solution checks.
- AI/pathfinding blocker indexes already expanded multi-hex vehicles; Browser 1335 removes the remaining anchor-cell assumptions from actual projectile-cover resolution and presentation helpers.
- Recorded AI movement trails are validated against the current hard-cover and occupied-cell indexes before animation.
- If a recorded route is stale, the renderer reconstructs a legal path with a larger bounded search. The old unconditional straight-line fallback that could visibly carry a soldier through a car or other hard cover is removed.
- A direct line is used only when every traversed cell is legal. If no legal displayed route exists, the presentation refuses to animate through solid geometry.
- Vehicles remain destructible hard cover with their existing HP and dimensions.

SKYRANGER - OPEN REAR / SOLID HULL
----------------------------------
- The solid rear cargo-opening slab has been removed from the friendly Skyranger model.
- A narrow overhead lintel and two side jambs now frame a genuinely open rear troop-bay aperture, allowing FPV/TPV to see from outside through the lowered ramp into the cabin.
- The existing tactical Skyranger data remains authoritative: side hull cells are indestructible hard cover with full shot/LOS blocking, while the center ramp/aisle cells remain passable extraction cells.
- `tacticalBreachCover(...)` now explicitly preserves `indestructible` cover records, preventing Skyranger hull cells from being accidentally converted into breach rubble by a sufficiently large shot.

SINGLE VOICE EVENT PER AI SHOT
------------------------------
- AI playback previously announced a shot/kill through `tacticalAiFrameDialogueCue(...)` and then sent the same shot to `showShotEvent(...)`, whose shared manual-fire dialogue routing could immediately announce a second line.
- AI map playback now calls the shared shot presenter with `suppressDialogue:true`.
- AI frame dialogue remains the single voice owner for the event, preserving higher-priority lines such as `That's the last of them` while preventing combinations such as `Target down` immediately followed by `Alien down` for one kill.
- Manual player shots still use the established shared dialogue routing.

FPV VICTORY-DANCE TRANSITION
----------------------------
- The FPV animation system already supported victory movement once its camera target was refreshed, but the persistent camera invalidation key did not include the victory state.
- `victoryDance` is now part of the camera key. A false -> true victory transition immediately refreshes the active FPV target state without requiring the player to leave and re-enter First Person.
- Soldier-eye celebration motion, weapon movement, surviving-soldier rules, and the ordinary 3D/2D victory dance remain otherwise unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a combined regression contract covering drag-pan ownership, Tactical Map-only player handoff, full vehicle-footprint blockers, Skyranger hard-hull/open-ramp rules, voice suppression during AI shot presentation, safe playback-route validation, and FPV victory camera invalidation.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. In 3D Iso, click-drag the battlefield horizontally and vertically at several zoom levels. Confirm the map follows the drag and releasing after a drag does not issue a movement order.
2. Choose AI Command and confirm the handoff dialog offers only Cancel and Watch Tactical Map.
3. In AI FPV, watch soldiers route around cars, vans, trucks, and buses. Confirm no actor visibly walks through the body and shots/LOS are blocked by any occupied footprint cell.
4. Approach the friendly Skyranger from behind with its ramp down. Confirm the cabin is visible through the open rear, the ramp/center aisle can be entered, and side hull walls cannot be walked or fired through.
5. Observe several AI kills and confirm one resolved shot produces at most one soldier voice confirmation.
6. Win while already in FPV and confirm the soldier-eye camera begins the victory celebration immediately without toggling FPV off/on.

PREVIOUS BUILD - 1235
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.1235_ISO_FIT_MAP_EXACT_PROJECTED_BOUNDS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrects the remaining Three.js Iso Fit Map southeast-edge clipping reported after Browser 0725. The previous safe-frame pass calculated Fit Map against an approximate symmetric viewport model even though the live orthographic camera uses asymmetric top/bottom bounds. Fit Map now measures the actual rendered boundary-hex vertices, fits them against the real camera frustum, and offsets the camera target for the frustum's asymmetric center.

EXACT PROJECTED-BOUND FIT MAP
-----------------------------
- Fit Map no longer estimates the battlefield from cell centers plus generic X/Y margins.
- The fit helper projects every vertex of the outermost rendered hexes, including odd-row staggering and the southeast perimeter, into the same camera-right/camera-up coordinate system used by Three.js.
- Zoom is calculated from those exact rendered bounds against the actual live `tacticalIsoCameraBounds(...)` width and height.
- The camera target is shifted to compensate for the real orthographic frustum center. This matters because the tactical camera deliberately has different top and bottom extents; simply looking at the nominal world center does not center the rendered map inside that frustum.
- Approximately 4.5% projected padding is retained around the limiting axis, with a minimum fractional-hex safety margin.
- The old 90% CSS scale workaround is removed. Fit Map now uses the available canvas instead of shrinking the entire tactical view independently of the camera calculation.
- Close, Near, Wide, Full, FPV, TPV, incoming-fire reaction, and Critical Kill cameras are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- The existing road-vehicle two-thirds-height contract remains active and unchanged.
- Fit Map validation now checks the exact rendered boundary rather than the approximate projected-center bounds.
- Regression fixtures cover 64x64, 80x80, and 96x96 maps at 1457x653, 1450x635, 1280x720, and 900x900 viewport shapes.
- A dedicated southeast assertion verifies the rightmost/lower projected boundary stays inside the real frustum plus padding.
- Independent numeric validation confirms positive margin on all four rendered edges for every fixture.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Reopen the same 64x64 Three.js Iso mission from the reported screenshot and select Fit Map.
2. Confirm the southeast / near-bottom corner is fully visible rather than ending at the camera boundary.
3. Confirm Fit Map now uses substantially more of the canvas than Browser 0725 while still retaining a narrow safety perimeter.
4. Resize to a wide browser shape and confirm all outer hexes remain visible.
5. Leave Fit Map and verify ordinary unit focus, hex picking, FPV, and TPV are unchanged.

PREVIOUS BUILD - 0725
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0725_ROAD_VEHICLE_HEIGHT_AND_ISO_FIT_MAP_SAFE_FRAME_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Implements the two queued tactical-presentation roadmap refinements from Browser 0630. Road vehicles retain their established multi-hex solid/hard-cover footprints but reduce vertical presentation to two-thirds of the prior doubled height. Three.js Iso Fit Map now uses the live canvas aspect ratio, the true world-space center of the complete battlefield, and additional corner-safe zoom padding so the entire projected map remains onscreen.

ROAD-VEHICLE HEIGHT REFINEMENT
------------------------------
- Cars, vans, utility vehicles, trucks represented by the utility profile, and buses retain their existing 3x2 or longer multi-hex visual/tactical footprints.
- Body, cabin, and bus-window vertical scales use a shared `TACTICAL_ROAD_VEHICLE_HEIGHT_SCALE = 2/3` multiplier.
- The vertical positions of those body/cabin/window components use the same multiplier, preserving their assembled proportions rather than compressing only individual pieces.
- Wheel placement, vehicle width/length, road alignment, authoritative HP, destruction record, solid occupancy, hard-cover behavior, pathfinding footprint, and LOS blocking are unchanged.
- The Browser 0555 doubled-height feature remains part of history, but Browser 0725 supersedes its final presentation height.

THREE.JS ISO FIT MAP SAFE FRAME
-------------------------------
- Fit Map now applies an explicit 0.86 safety factor after calculating the projected-map fit zoom.
- The fit calculation uses the live Three.js canvas width and height rather than a default viewport aspect.
- While Fit Map is active, action focus no longer drags the camera within the available slack. The camera targets the true world-space center derived from the complete map's outer rows and columns.
- This guarantees deliberate perimeter room around all four projected map corners, including the near/bottom corner that could previously be clipped.
- Ordinary Close/Near/Wide/Full camera focus behavior remains unchanged.
- Tactical coordinates, click picking, map size, pathfinding, fog, AI movement, unit positions, cover, and combat rules are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression contract covering the exact two-thirds vehicle-height multiplier and the current explicit-material vehicle renderer wiring.
- Fit Map validation checks 64x64, 80x80, and 96x96 battlefields at 1457x653, 1280x720, and 900x900 viewports.
- The wide 1457x653 / 64x64 fixture retains roughly 13 world-units of vertical projected-map margin after the safety factor.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Open a tactical map containing cars, vans/utility vehicles, and a bus. Confirm their footprint remains large/solid while their height is visibly two-thirds of Browser 0630.
2. In 3D Iso choose Fit Map on Small, Medium, and Large battlefields. Confirm all four map corners are simultaneously visible with a small perimeter margin.
3. Resize the browser to a very wide shape similar to the reported screenshot and confirm the near/bottom corner remains inside the canvas.
4. Click/select units after leaving Fit Map and confirm ordinary camera focus and exact hex picking are unchanged.
5. Confirm units still path around road vehicles and treat their complete footprints as hard cover.

PREVIOUS BUILD - 0630
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0630_TACTICAL_AI_MAP_PLAYBACK_TDZ_HOTFIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hotfixes the Browser 0625 tactical-display crash: `Cannot access 'aiMapPlayback' before initialization`. The new incoming-fire reaction camera referenced the local `aiMapPlayback` const before that declaration had executed inside `TacticalMission`, causing the tactical map error boundary to replace the battle view as soon as the component rendered.

TACTICAL AI MAP PLAYBACK TDZ HOTFIX
-----------------------------------
- Root cause: Browser 0625 added `aiIncomingFireReactionActor` alongside the early observer/HUD state. That expression used `aiMapPlayback` roughly 105 KB of component source before `const aiMapPlayback = aiPlayback?.view === "map"` was initialized.
- JavaScript `const` bindings are in the temporal dead zone until execution reaches their declaration, so merely evaluating the early expression threw a ReferenceError even though the value would later have been valid.
- The incoming-fire reaction actor now checks the already-available authoritative playback value directly: `aiPlayback?.view === "map"`.
- The authoritative `aiMapPlayback` / `aiOverlayPlayback` derivation has also been moved up beside `aiPlaybackFrame`, before every tactical observer expression and FPV/TPV toggle function that references it. The later duplicate declaration is removed.
- Browser 0625 functionality is otherwise unchanged: incoming alien-fire TPV reactions, FPV victory dancing, alien saucer interiors, TPV observer mode, consolidated observer HUD, vehicle cover, replacement beacons, and all prior tactical systems remain active.
- Save format remains 4; no campaign migration is required.

VALIDATION
----------
- All non-empty embedded JavaScript blocks pass `node --check`.
- Static declaration-order validation confirms there are zero `aiMapPlayback` references inside `TacticalMission` before the authoritative `const aiMapPlayback` declaration.
- The incoming-fire reaction expression still requires Tactical Map playback plus an alien shooter and human target.

MANUAL TEST GATES
-----------------
1. Launch a tactical mission and confirm the map loads instead of showing the tactical display error.
2. Hand control to Simulation AI in Tactical Map mode and confirm normal Iso/FPV/TPV playback works.
3. Let an alien fire at an AEGIS soldier and confirm the temporary targeted-soldier TPV reaction camera still occurs.
4. Win while in FPV and confirm the FPV victory-dance camera remains active.

PREVIOUS BUILD - 0625
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0625_INCOMING_FIRE_REACTION_FPV_VICTORY_DANCE_AND_ALIEN_SAUCER_INTERIOR_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Expanded AI-observer battle presentation. Incoming alien fire now temporarily cuts to a close third-person reaction view of the targeted AEGIS soldier and returns to the player's prior camera afterward. Successful missions can remain in FPV after AI playback ends, with the soldier-eye camera participating in the victory dance. Alien reinforcement saucers now expose a simple illuminated interior behind an open ramp.

INCOMING-FIRE TARGET REACTION CAMERA
------------------------------------
- Tactical shot presentation now retains shooter ID/team and target ID/team metadata.
- During Tactical Map AI playback, an alien shot aimed at an AEGIS soldier temporarily overrides Iso, FPV, or TPV with a third-person reaction camera centered on the targeted soldier.
- The camera is placed just beyond and to one side of the target along the incoming-fire axis so the player can see the soldier, the direction of attack, and the impact context.
- The automatic cut is presentation-only. It does not toggle the player's selected observer mode, hand back control, recalculate the attack, or alter hit chance, damage, TU, ammunition, or action order.
- When the shot effect expires, the renderer returns to the previously selected Iso/FPV/TPV camera automatically.
- If the player was in FPV, the viewed soldier model is temporarily made visible during the reaction cut so the targeted body is actually shown.

FPV VICTORY CELEBRATION
------------------------
- A victorious AI-controlled mission no longer forces an active FPV/TPV observer back to Iso merely because the AI playback stream has completed.
- The surviving observed soldier remains the FPV actor while the final battlefield stays open.
- First-person victory motion now adds rhythmic side sway, head lift/nod, small roll, and matching weapon movement on top of the existing soldier victory-dance animation.
- This is a camera presentation of the same established success-only victory state. Fallen soldiers, failures, withdrawals, incomplete objectives, and unresolved reinforcement states do not receive it.

ALIEN SAUCER INTERIOR
---------------------
- Open-ramp alien reinforcement saucers no longer terminate at a solid black rear panel.
- The rear opening is framed by left/right jambs and an upper lintel.
- A lightweight illuminated troop bay is visible behind the ramp: floor, ceiling, side walls, two simple seats, a forward bulkhead, overhead light strips, and a small interior core light.
- The interior is a presentation layer and does not change the craft footprint, reinforcement placement, ramp logic, cover, pathfinding, or mission rules.

BUILD HEALTH / VALIDATION
-------------------------
- Added a contract covering incoming-fire shot metadata, targeted-soldier TPV reaction wiring, FPV victory camera motion, and open-saucer interior geometry.
- Updated the prior TPV lifecycle contract so the new incoming-fire reaction animation path remains part of the persistent-renderer animation gate.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Watch an AI Tactical Map battle in Iso, FPV, and TPV and let an alien fire at an AEGIS soldier. Confirm the camera temporarily cuts to the targeted soldier and returns to the prior view after the shot.
2. Win while FPV is enabled. Confirm the view remains in FPV on the final battlefield and the camera visibly bobs/sways with the surviving soldier's celebration.
3. Observe an alien reinforcement saucer with its ramp open from FPV/TPV and confirm a readable illuminated interior is visible behind the ramp.
4. Confirm incoming-fire cuts do not change combat results or AI control state.

PREVIOUS BUILD - 0605
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0605_TPV_CAMERA_LIFECYCLE_AND_CHASE_FOLLOW_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed the newly added AI Third Person observer opening from the tactical world origin and appearing static. TPV now seeds the chase camera immediately from the acting soldier, remains in the persistent renderer's animation loop throughout ordinary AI observation, and explicitly participates in camera invalidation when switching between Iso, FPV, and TPV.

THIRD-PERSON CAMERA LIFECYCLE FIX
---------------------------------
- Root cause: Browser 0555 created and targeted the TPV camera correctly, but the persistent animation-state gate omitted `thirdPersonView`. If no victory dance, VIP tracker, gib cinematic, beacon flyover, or FPV animation was active, the renderer performed one static render before `tacticalThreePersistentAnimateThirdPerson(...)` ever copied the chase target into the camera.
- That left the perspective camera near its default world-origin pose, producing the ground-level static view shown in testing.
- A newly observed TPV soldier now immediately seeds the perspective camera position/look target before the first frame is rendered.
- Third Person now keeps the persistent animation loop alive at the same high observer-camera cadence as FPV, so position and look smoothing continue while the AI actor moves and turns.
- The camera invalidation key explicitly includes Third Person on/off state and actor identity, and the dynamic renderer effect now explicitly depends on `thirdPersonView`.
- Switching Iso -> TPV, FPV -> TPV, TPV -> FPV, and TPV -> Iso therefore hands camera ownership over immediately without waiting for an unrelated tactical update.
- The upper-left renderer status now identifies `AI Soldier Third-Person` while TPV is active instead of incorrectly reporting the isometric tactical view.

PRESERVED BEHAVIOR
------------------
- TPV still follows the current living AEGIS AI action actor from an over-the-shoulder position and keeps that soldier model visible.
- FPV, Tactical Focus, Critical Kill cinematics, compass, mini-map, consolidated upper-right soldier/fire-team/order HUD, solid vehicle footprints, hollow Skyranger, beacon redeployment, and all gameplay simulation rules are unchanged.
- TPV remains a presentation layer over the same persistent Three.js scene; no second battlefield or simulation is created.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- Added a dedicated regression contract requiring the TPV animation-state gate, Third Person camera invalidation key, immediate initial camera seeding, and per-frame chase-camera application.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static checks confirm the active renderer now contains `firstPersonView||thirdPersonView||victoryDance` in its animation ownership gate and that both initial TPV targeting and animation apply the chase pose through the same camera helper.
- A full live WebGL mission cannot be executed in this environment; AI TPV movement remains the manual visual gate.

MANUAL TEST GATES
-----------------
1. Start AI Tactical Map playback in 3D Iso and enable Third Person. Confirm the first TPV frame appears behind/above the current AEGIS soldier rather than at the map origin.
2. Watch a soldier walk several hexes and turn. Confirm the chase camera follows continuously instead of remaining static.
3. Switch TPV off and on during a quiet AI interval with no visible shot/tracker animation; confirm the camera still starts and follows immediately.
4. Switch between FPV and TPV and confirm each mode takes ownership cleanly without an origin flash or frozen frame.
5. Confirm the upper-left status reads AI Soldier Third-Person in TPV and that compass/mini-map/upper-right soldier status remain active.

PREVIOUS BUILD - 0555
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0555_SKY_VEHICLE_COVER_SKYRANGER_TPV_AND_HUD_CONSOLIDATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected the remaining camera-relative FPV sky-shell clipping, made civilian road vehicles taller and authoritative multi-hex hard cover, rebuilt the Skyranger as a hollow troop-bay shell for first-person extraction, added a reversible AI third-person observer camera beside FPV, and consolidated soldier identity, fire-team assignment, and current-order data into one upper-right observer HUD.

FPV SKY STABILITY
-----------------
- The location-aware sky sphere now uses a 96-unit radius instead of 168, keeping the complete atmosphere shell safely inside the FPV camera's 140-unit far plane.
- The atmosphere shell and stars no longer depth-test against battlefield geometry. They remain camera-relative background presentation with depth writing disabled.
- Star radius is reduced to 86 units so the star field also remains inside the perspective clip range.
- Regional day/dusk/night colors and mission-time lighting remain active. This corrects the giant clipped pale/yellow dome without reintroducing a physical sun/moon object.

ROAD VEHICLES - TALL, SOLID MULTI-HEX HARD COVER
-------------------------------------------------
- Cars/vans/utilities retain the established 3-hex-long by 2-hex-wide footprint and buses retain their longer 5x2 footprint.
- Vehicle body/cabin height is approximately doubled so a standing soldier visually fits inside the vehicle volume in Iso, FPV, and TPV.
- Every cell in a road vehicle's footprint is now authoritative hard-cover occupancy rather than decorative reservation only.
- Shared hard-cover lookup, path blockers, and tactical visibility context expand vehicle covers across all footprint cells. Soldiers, aliens, civilians, and VIPs therefore cannot path through the body, and fire/LOS queries recognize the complete vehicle footprint.
- A destroyed vehicle opens its entire footprint through the existing cover HP/destruction path; no additional save fields are required.

HOLLOW SKYRANGER TROOP BAY
--------------------------
- The old solid main-fuselage block is replaced by a thin floor, roof, left/right shell walls, forward bulkhead/cabin, and an open rear troop bay aligned with the extraction ramp.
- Interior side benches and a central aisle make the rear cabin visually readable when escorting civilians/VIPs into extraction in FPV/TPV.
- The Skyranger remains a lightweight presentation model over the existing authoritative ramp/extraction footprint; extraction rules and save data are unchanged.

AI THIRD-PERSON OBSERVER
------------------------
- AI Tactical Map playback now places a Third Person: Off / On button directly beside First Person.
- TPV follows the same current living AEGIS action actor as FPV from a smoothed over-the-shoulder/chase camera.
- Switching FPV/TPV is mutually exclusive and reuses the same persistent Three.js renderer, scene, units, terrain, effects, and simulation state.
- Ending AI map playback or returning to 2D automatically clears either observer camera and restores the prior tactical view.
- TPV is presentation-only: movement, TU, targeting, hit rolls, Tactical Focus, Critical Kill results, escort logic, and AI action sequencing remain authoritative and unchanged.

CONSOLIDATED FPV / TPV STATUS HUD
---------------------------------
- The redundant lower-left FPV soldier identity card has been removed.
- During FPV or TPV, the upper-right observer status panel now displays the soldier's name, rank, equipped weapon, HP, and TU first.
- Fire Team Assignment appears directly below the soldier identity, followed by Current Objective / Order.
- The top compass and lower-right knowledge-limited tactical mini-map remain available in both observer camera modes.
- Objective/order text continues to consume only legitimately known tactical information.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted blocker test confirms all six cells of a representative 3x2 vehicle footprint enter the authoritative hard-cover blocker index.
- Static release checks confirm the 96-unit no-depth-test sky shell, doubled vehicle dimensions, footprint-aware cover/LOS/path helpers, hollow Skyranger shell, Third Person camera/button, consolidated observer HUD, current build metadata, and unchanged save format 4.
- A full live WebGL mission has not been executed in this environment; FPV sky, TPV camera framing, vehicle scale/cover, and Skyranger cabin traversal remain manual visual gates.

MANUAL TEST GATES
-----------------
1. Enter FPV in the same daylight mission that showed the giant pale dome. Confirm the sky is continuous with no circular/dome boundary following the camera.
2. Compare a soldier beside a car/van and bus. Confirm vehicle height reads plausibly and units route around the complete multi-hex body.
3. Fire across a vehicle footprint and confirm the body behaves as hard cover; destroy the vehicle and confirm its footprint becomes traversable under the normal cover-destruction rules.
4. Escort a civilian/VIP into the Skyranger in FPV and confirm the rear ramp opens into a visible hollow troop bay instead of a solid fuselage block.
5. During AI Tactical Map playback, toggle First Person and Third Person beside one another; confirm TPV follows the acting soldier smoothly and switching modes never creates a second battlefield.
6. Confirm the upper-right panel shows soldier identity above Fire Team Assignment and Current Objective / Order, with no duplicate lower-left identity box.

PREVIOUS BUILD - 0525
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0525_LARGE_ROAD_VEHICLES_BEACON_FLYOVER_AND_FPV_ORDER_HUD_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Rescaled civilian road vehicles to believable multi-hex proportions, completed the five-turn replacement-beacon mechanic with a lightweight overhead craft/drop presentation, and expanded the AI first-person visor with the observed soldier's current objective/order beneath Fire Team Assignment.

LARGE ROAD VEHICLE PROPORTIONS
------------------------------
- Ordinary sedan/van/utility props now use a visual envelope at least three hexes long by two hexes wide so their scale reads correctly beside soldiers in Iso and FPV.
- Vehicle placement reserves the complete decorative footprint so bus stops, benches, machines, signs, and other street props do not spawn through the same vehicle body.
- Vehicles orient along the local road/lane/path direction instead of all sharing one world-axis heading.
- Buses remain longer than ordinary cars while using the same lightweight low-poly primitive approach.
- The scale change is primarily presentation; it does not rewrite tactical movement rules or vehicle simulation.

REPLACEMENT BEACON FLYOVER PRESENTATION
---------------------------------------
- The existing authoritative five-turn beacon-redeployment rule is unchanged.
- When a replacement beacon actually deploys, a small alien saucer crosses the battlefield, an energy drop beam appears, and a beacon payload descends at the chosen safe drop point before the craft exits.
- The animation uses the already-selected safe drop cell and cannot move the beacon, change the countdown, reveal hidden information, alter reinforcements, or affect combat.
- The effect is bounded to roughly five seconds and reuses the persistent renderer animation loop.

FPV CURRENT OBJECTIVE / ORDER HUD
---------------------------------
- Beneath Fire Team Assignment, FPV now shows the observed soldier's current objective/order.
- The readout can identify player/fire-team waypoints, VIP rescue assignments, escort/extraction duty, separated-civilian regrouping, escort support/break-off duty, fog/grid searches, last-contact searches, beacon support, visible-contact engagement, and default leader/support formation behavior.
- The readout is derived only from the soldier's authoritative AI/order state and known tactical state. It does not expose hidden aliens, unrevealed VIPs, or unseen objectives.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static contracts require a six-cell-or-larger 3x2 ordinary vehicle footprint, replacement-beacon flyover renderer seams, and FPV Current Objective / Order wiring.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Open a Small Town/urban mission and compare a civilian car directly against a soldier; confirm the car reads as approximately 3 hexes long by 2 hexes wide and follows the road direction.
2. Destroy an active beacon, keep the operation active for five turns, and confirm the replacement event includes an overhead craft, descending payload/beam, and the beacon at a safe unoccupied location.
3. Use AI Command > Tactical Map > FPV and confirm the upper-right Fire Team panel gains a Current Objective / Order section that changes as the acting soldier transitions between search, combat, escort, rescue, and extraction work.
4. Confirm the order panel does not name hidden aliens or unrevealed civilians/VIPs.

PREVIOUS BUILD - 0455
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0455_FPV_CONTINUOUS_GROUND_BEACON_REDEPLOYMENT_CRITICAL_CINEMA_AND_STREET_LIFE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This combined tactical presentation/campaign patch replaces the stubborn first-person hex-edge shimmer with a continuous FPV-only ground renderer instead of another depth-offset adjustment, removes the physical camera-relative sun sphere that could fill the horizon, standardizes all reinforcement/legacy alien models on the six Mainframe archetypes, restores the yellow AI acting-soldier ring, permits alien recovery after an objective failure when AEGIS survivors have nevertheless cleared the battlefield, adds the requested five-turn Alien Field Beacon redeployment cycle, expands lightweight street-life scenery, and gives rare Critical Kill dismemberments a slowed cinematic camera presentation.

FPV CONTINUOUS-GROUND STABILITY
-------------------------------
- FPV no longer displays the battlefield floor as thousands of neighboring hex meshes. While First Person View is active, those individual ground batches are hidden and replaced by one continuous textured plane assembled from the authoritative per-cell terrain palettes.
- The continuous texture retains local terrain color, authored accent color, deterministic variation, sidewalks/access walks, and the same regional terrain identity while eliminating shared polygon borders from the first-person depth buffer.
- Returning to Three.js Iso immediately restores the normal explicit-material hex batches. The isometric renderer, picking, terrain identity, movement cells, paths, cover, and tactical rules are unchanged.
- FPV also hides the per-hex ground-fog meshes while the continuous plane is active so a second set of touching coplanar hex borders cannot shimmer over the replacement floor. Entity visibility, objective reveal rules, minimap knowledge, cover visibility, and tactical LOS remain authoritative.
- Browser 0135's permanent safety rule remains intact: the live persistent ground still does not use `setColorAt()` / ground `instanceColor`.

CAMERA-RELATIVE SUN DOME REMOVAL
--------------------------------
- The giant yellow dome reported at the FPV horizon was the physical sun/halo geometry living inside the camera-relative sky root.
- The physical sun/moon sphere and halo are removed entirely from the battlefield scene.
- The location/time-derived celestial direction remains available for directional key lighting, daylight/twilight/night sky gradients, stars, and regional atmosphere.
- Because there is no longer a physical celestial mesh, no yellow sphere can follow the FPV camera or intersect the battlefield horizon.

CANONICAL REINFORCEMENT ALIEN MODELS
------------------------------------
- New beacon and dropship reinforcement waves no longer spawn placeholder `Void Lancer` / `Void Raider` alien types that fell through to the old purple generic geometry.
- The reinforcement commander uses the Pale Commander silhouette; supporting reinforcements deterministically select Signal Leech, Glass Wraith, Needle Drone, Tide Horror, or Chitin Brute.
- Legacy/unknown alien records are also mapped deterministically onto one of those six Mainframe archetypes at render time, so old save data cannot reintroduce the purple fallback in the middle of a mission.
- The existing Mainframe-aligned colors and modular gib-capable body parts remain authoritative.

AI ACTING-SOLDIER SELECTION RING
--------------------------------
- During AI tactical-map control, the active AEGIS actor is once again identified by a bright yellow selection ring in Three.js Iso.
- The ring follows `movingUnit` / current FPV actor before falling back to the ordinary selected soldier, and its invalidation key now changes when the AI actor changes.
- Manual selection retains the established cyan selected-unit ring.

FAILED-MISSION ALIEN RECOVERY
-----------------------------
- Mission success is no longer the only condition that permits recovery of dead alien material.
- If an objective fails but AEGIS still has at least one living soldier and every alien on the battlefield has been killed, the normal alien remains / weapon-fragment / power-cell recovery table is still applied.
- A squad wipe or failed mission with surviving aliens still recovers no battlefield alien loot.
- Live alien capture remains success-gated; this change applies to killed-alien battlefield recovery only.
- Save format remains 4.

FIVE-TURN REPLACEMENT BEACON REDEPLOYMENT
-----------------------------------------
- Destroying the active Alien Field Beacon starts a five-turn redeployment countdown if the mission remains active for another reason, such as surviving aliens or unresolved rescue work.
- Example: destroying the beacon on round 3 makes the replacement eligible on round 8.
- If all objectives are already complete before the deadline, the mission still ends normally; the countdown does not hold open an otherwise completed operation.
- On the due round an alien craft performs an overhead redeployment pass and attempts to place a replacement beacon in a deterministic random safe cell.
- Safe placement excludes living AEGIS personnel, living aliens, civilians/VIPs, Skyranger hull/ramp cells, live cover/structures, building cells, map edges, and a safety radius around AEGIS/civilians.
- If no safe cell exists, the craft retries on the following round instead of overwriting an occupied cell.
- Replacement beacons receive unique generation IDs and the normal adaptive shield type for that campaign. Destroying a replacement starts a fresh five-turn cycle if the mission continues.
- Destroying any beacon generation still counts as a beacon destruction in the mission report/history even if a later replacement remains active.

LIGHTWEIGHT STREET-LIFE PASS
----------------------------
- Sedan/van/utility-car proportions are longer and lower, with visible cabins and wheels rather than the previous tall box-like vehicles.
- Bounded context-aware props can now appear on urban/small-town/farm maps: buses, bus stops, traffic lights, stop signs, benches, newspaper machines, vending machines, civic statues, water fountains, and small playground equipment.
- Props are placed near roads, curbs, building fronts, or appropriate open/civic/residential spaces rather than uniformly scattered.
- Counts are deliberately capped by settlement type. The new objects reuse simple low-poly primitives and the existing cover renderer rather than creating a heavy simulation system.
- Existing vegetation, sidewalks, access walks, buildings, and destructible-cover behavior remain active.

CRITICAL KILL CINEMATIC
-----------------------
- Rare exceptional lethal shots that already qualify for modular alien dismemberment now receive a dedicated cinematic presentation.
- The visible projectile travel is lengthened for those kills, the camera cuts to an over-shoulder / target-side angle, and detached alien pieces move in time-dilated slow motion through the impact beat.
- The camera then returns to the prior First Person or AI-observer camera automatically.
- Ordinary kills do not invoke the cinematic, so normal firefights keep their established pace.
- The cinematic is strictly post-resolution presentation: target choice, RNG, accuracy, damage, ammunition, TU, XP, kill credit, recovery, and mission outcome are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Targeted reinforcement testing verifies a beacon destroyed on round 3 produces due round 8, remains unavailable on round 7, and becomes replacement-ready on round 8.
- Safe-cell testing rejects occupied units, cover, buildings, and Skyranger footprint cells.
- Legacy `Void Raider` rendering resolves to a Mainframe archetype rather than the purple fallback.
- A failed result explicitly marked as battlefield-cleared-with-survivors qualifies for alien field recovery.
- Static validation requires the FPV continuous-ground toggle, physical celestial-geometry removal, five-turn redeployment branch, canonical reinforcement types, yellow AI selection ring, street-life catalog, Critical Kill cinematic camera, and unchanged explicit-material/no-ground-instance-color invariant.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Re-run the same FPV route that previously showed flickering shared hex edges and confirm the floor is stable while moving/turning/leaning.
2. Sweep the FPV horizon in daylight and confirm no large yellow sphere/dome follows the camera.
3. Trigger initial aliens and later reinforcement aliens in one mission and confirm every alien uses one of the six modular Mainframe silhouettes/colors.
4. Watch AI control in Three.js Iso and confirm the currently acting soldier has a yellow selection ring.
5. Fail a VIP/objective mission after killing every alien while at least one AEGIS soldier survives; confirm dead-alien recovery is awarded in aftermath.
6. Destroy a beacon, keep the mission active for five more turns, and confirm the overhead replacement event places a new beacon only in a safe open cell.
7. Inspect city/small-town maps for appropriately bounded buses, bus stops, traffic controls, benches, machines, civic fixtures, playgrounds, and more believable car proportions.
8. Trigger a rare Critical Kill and confirm the camera cuts to a slowed cinematic dismemberment beat, then returns cleanly to FPV/AI observation.

PREVIOUS BUILD - 0345
=====================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0345_FPV_DEPTH_STABILITY_ALIEN_DATABASE_PALETTE_AND_CONTINUOUS_WINDOW_WALL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Focused the next tactical renderer pass on the three live visual issues reported after Browser 0335. The remaining ground-edge shimmer is specifically first-person, so the FPV perspective camera now uses a depth-buffer-friendly near/far clipping range and the ground drops the obsolete polygon offset that was no longer needed after physical terrain-bed separation. Modular alien models retain their distinct/gib-capable silhouettes but move toward the colors of the Mainframe database sprite families. Transparent window apertures keep their see-through opening while new sill/lintel junction geometry closes the visible gaps between neighboring wall sections.

FPV GROUND-EDGE DEPTH STABILITY
--------------------------------
- The remaining edge flicker was reported specifically in first-person rather than the elevated isometric camera, pointing to perspective depth precision rather than another terrain-palette problem.
- FPV camera clipping changes from near/far 0.04/180 to 0.12/140. Raising the near plane substantially improves perspective Z-buffer precision at shallow ground angles while still leaving the camera-space weapon comfortably inside the visible volume.
- Ground surface materials no longer use `polygonOffsetFactor:-2` / `polygonOffsetUnits:-2`. Browser 0205/0245 already physically separated the visible terrain face, lower terrain bed, fog, and other overlay layers, so the extra depth bias could create unnecessary grazing-angle instability.
- Isometric terrain colors, texture generation, neighbor grading, sidewalks, paths, vegetation, fog knowledge, movement, cover, and tactical math are otherwise unchanged.
- Browser 0135's explicit-material terrain invariant remains permanent: no ground `instanceColor` / `setColorAt()` path is restored.

MAINFRAME-ALIGNED MODULAR ALIEN COLORS
--------------------------------------
- The six modular battlefield silhouettes from Browser 0245 remain intact and remain assembled from separable gib-capable parts.
- Signal Leech now uses a cooler gray-scout palette instead of the stronger purple body treatment.
- Glass Wraith shifts toward pale translucent cyan/white.
- Needle Drone uses insectoid bronze/tan and dark mechanical accents.
- Tide Horror uses a clearer reptilian olive/green palette.
- Chitin Brute uses stronger rust/chitin browns and orange-brown armor accents.
- Pale Commander uses pale gray/lilac psionic tones rather than warm off-white alone.
- These changes are presentation-only. Alien HP, weapons, armor, AI, recovery, autopsy identity, database records, and Critical Kill rules are unchanged.

CONTINUOUS WALLS AROUND TRANSPARENT WINDOWS
-------------------------------------------
- Browser 0335 correctly removed opaque full-height bridge geometry from window openings, but that exposed visible gaps between adjacent structural cells.
- Wall/window and window/window junctions now build a low sill connector and an upper lintel connector across the cell boundary instead of a full-height slab.
- The middle of the window remains physically open and carries the existing transparent glass pane, so an alien on the far side reads as being seen through glass rather than through a solid wall.
- Solid wall-to-wall junctions retain the existing full structural connector.
- Junction geometry is derived only from currently living authoritative cover cells. If either source wall/window segment is destroyed or breached, the connector disappears on the next cover rebuild, so the facade remains visually consistent with destruction.
- LOS, glass shattering, the established first-shot accuracy penalty, movement blocking, wall HP, and breach rules are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the FPV camera uses 0.12/140 clipping, the current ground material no longer uses the old negative polygon offset, and the prior 0.04/180 FPV camera definition is absent.
- Static validation confirms all six alien archetypes retain unique body colors and that the new gray-scout / insectoid / reptilian / chitin / pale-psionic palette markers are present.
- Transparent-window validation now requires explicit sill and lintel connector seams rather than the Browser 0335 rule that skipped every structural connection touching a window.
- Save format remains 4; existing campaigns require no migration.

MANUAL TEST GATES
-----------------
1. Reproduce the same FPV walk across a multi-texture hex boundary that was flickering in Browser 0335. Confirm the edge remains stable while the camera walks, leans, turns, and enters Tactical Focus.
2. Switch out of FPV and confirm the elevated isometric battlefield still has the same rich terrain colors/textures and does not show a new seam regression.
3. View every identified alien archetype in the Mainframe and then in 3D tactical view; confirm the battlefield colors now read closer to the corresponding database image family while silhouettes remain distinct.
4. Inspect wall-window-wall and window-window sequences in FPV. Confirm the facade is visually continuous at the sill and lintel but the central glass aperture remains transparent.
5. Destroy/breach a structural segment adjacent to a window and confirm its junction connector disappears with that structure.

PREVIOUS BUILD - 0335
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0335_FPV_NAV_HUD_TRANSPARENT_WINDOWS_AND_AI_RESCUE_DUSTOFF_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Expanded the AI-observer first-person presentation and aligned two tactical behaviors with what the player sees. FPV now carries a persistent soldier identity panel, a continuously scrolling compass ribbon driven by the smoothed camera heading, and a north-up lower-right local tactical mini-map that remains constrained to legitimate squad knowledge. Three.js building windows now render as true framed transparent apertures rather than short opaque walls with blue panels, matching the existing line-of-sight and shot-through-window rules. Mandatory VIP missions under AI command can now end cleanly with a Dust Off once every VIP is resolved and a missed rescue quota is mathematically unrecoverable, even if hostile aliens remain on the map.

FPV SOLDIER IDENTITY / COMPASS / MINI-MAP
------------------------------------------
- The lower-left FPV visor identity block now gives the observed AEGIS soldier's name primary visual prominence and retains available rank, equipped weapon, HP, and TU context.
- A top-center compass ribbon scrolls continuously from the smoothed first-person camera direction rather than snapping only between stored hex facings. Tactical Focus target acquisition therefore rotates naturally through intermediate bearings as well.
- The centered compass index includes a live cardinal and degree readout.
- A compact 19 x 19 local tactical mini-map occupies the lower-right corner while FPV is active. It is north-up so the compass and map form a stable navigation pair.
- Explored/visible terrain can appear on the mini-map. AEGIS squadmates and known Skyranger extraction ramps remain known; hostile aliens, VIPs/civilians, and Alien Field Beacons are included only when the existing tactical visibility/reveal rules permit them.
- The mini-map therefore improves situational awareness without creating omniscient contacts or revealing an objective through opaque terrain.
- The existing renderer/coverage status readout moves to bottom-center during FPV so it does not overlap the mini-map.

TRANSPARENT WINDOW APERTURES
----------------------------
- The gameplay model already treats building-window cover as line-of-sight transparent and allows projectiles to cross it; solid wall sections remain opaque. The 3D presentation now visually matches that contract.
- A window cell no longer places a shortened opaque wall directly behind the glass. The wall is assembled as a lower section, upper lintel, and two side jambs around an actual central opening.
- Intact glass is now lightly transparent, double-sided, and non-depth-writing so soldiers and aliens on the far side are visibly understandable in FPV instead of appearing to be targeted through a solid wall.
- Shattered glass becomes almost clear while retaining a small broken-frame/shard presentation.
- Structural connector geometry is forbidden from drawing a solid bridge across any edge involving a window aperture. Adjacent true wall cells retain their normal opaque connected-wall treatment.
- Decorative regional trim, sills, shutters, awnings, foundations, roofs, damage cracking, and smoke remain available around the aperture.
- This changes presentation only. Existing 18-point first-shot glass accuracy penalty, shattering, movement blocking, structural breaching, cover HP, LOS, and ballistics rules are unchanged.

AI DUST OFF AFTER IRRECOVERABLE VIP FAILURE
--------------------------------------------
- Mandatory VIP objectives distinguish an active rescue phase from a terminal failed objective. The new AI-specific Dust Off rule applies only after every VIP is resolved (rescued or confirmed dead), no unresolved VIP remains, and the required rescue quota was missed.
- Simulation AI and Hybrid AI support handoffs check this state after rescue processing and before committing the squad to another combat exchange.
- When the state is terminal, the AI commander orders Dust Off immediately rather than continuing to hunt remaining aliens during an operation that can no longer be turned into a success.
- The mission resolves as a normal failure even if living aliens remain on the battlefield. It is not treated as a simulation safety-limit withdrawal or an incomplete operation.
- Extracted VIPs retain their normal per-rescue partial credit. The missed-quota completion bonus remains withheld, and normal failure panic/reward/report consequences remain authoritative.
- Surviving soldiers retain their real HP, wounds, KIA state, XP, and kill credit at the moment of withdrawal. No synthetic casualties are created to explain the remaining hostile force.
- Manual-control doctrine is intentionally unchanged: a player who has not handed the operation to AI can still choose whether to continue fighting or use the existing Dust Off control.
- If the rescue quota was met, or even one mandatory VIP remains alive and unresolved, the new failure Dust Off does not trigger.

PRESERVED TACTICAL PRESENTATION
-------------------------------
- Browser 0245 stable hex-depth separation, guaranteed-visible batched vegetation, modular alien silhouettes, and rare Critical Kill dismemberment remain active.
- Browser 0205 sidewalks/access walks and Tactical Focus remain active.
- Browser 0145 rich terrain presentation, FPV obstacle-avoidance lean, weapon rig, regional sky/day-night atmosphere, and regional architecture remain active.
- The left-side shot-result stack remains in its approved location.
- Browser 0135's explicit-material/no-ground-instance-color invariant remains permanent.
- Random victory music, reinforcement/victory gating, indexed tactical pathfinding, cooperative mission aftermath, and lazy memorial indexing are unchanged.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted mandatory-VIP fixture confirms one rescued plus two dead VIPs on a 2-of-3 terror quota triggers AI Dust Off; one remaining live unresolved VIP does not; and a completed 2-of-3 quota does not produce failure Dust Off.
- Static window validation requires a lower wall, lintel, two aperture jambs, transparent pane material, disabled glass depth writing, double-sided glass, and the guard that prevents solid connector geometry from spanning a window.
- FPV Build Health retains the soldier identity, smooth compass, and knowledge-limited mini-map contract from the planned navigation-HUD work.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Enter Simulation AI map playback, enable First Person, and confirm the lower-left panel clearly shows the observed soldier name, the top compass moves smoothly as that soldier turns, and the lower-right mini-map remains north-up.
2. Rotate through a full turn/Tactical Focus shot and confirm the compass degree/cardinal readout moves continuously rather than jumping between six hex facings.
3. Place an alien on the far side of an intact building window. Confirm FPV visibly shows transparent glass/open aperture framing rather than an opaque wall, while an adjacent true wall still completely blocks the view.
4. Fire through the intact window and confirm the established glass-shatter/accuracy behavior still occurs; inspect the same opening afterward and confirm shattered glass is nearly clear.
5. Run a mandatory 2-of-3 VIP mission under Simulation AI. Rescue only one VIP and allow the other two to die while aliens remain. Confirm the AI announces Dust Off and the mission completes as a failure without continuing alien-hunting rounds.
6. Repeat with one VIP still alive/unresolved and confirm AI does not Dust Off merely because the quota has become difficult or impossible; the remaining VIP must first be resolved.
7. Repeat after rescuing enough VIPs to meet the quota and confirm this failure-specific Dust Off does not trigger.
8. Confirm extracted VIP partial credit, soldier wounds/KIA/XP/kills, failure panic/reward handling, mission report, and return-to-base aftermath remain correct.

PREVIOUS BUILD - 0245
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0245_STABLE_HEX_EDGES_VISIBLE_VEGETATION_CRITICAL_GIBS_AND_ALIEN_SILHOUETTES_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Strengthened the persistent Three.js tactical presentation after Browser 0205 testing. Neighboring hex surfaces now have a larger deterministic inset plus explicit vertical/depth separation so two textured terrain faces cannot compete for the same edge pixels. Decorative grass and shrubs are larger, denser within bounded quality caps, and no longer eligible for whole-batch frustum culling, addressing the case where generated vegetation was not visible at all. The six existing Mainframe alien archetypes now receive distinct modular low-poly battlefield silhouettes. Exceptional lethal AEGIS gunshots can produce a presentation-only Critical Kill dismemberment effect assembled from those modular body pieces; ordinary lethal hits retain the normal fallen-body presentation.

STABLE HEX EDGE DEPTH SEPARATION
--------------------------------
- Browser 0205 removed the old overlapping seam batches, but live testing still showed high-contrast neighboring hex edges appearing to flip or squiggle while the camera moved.
- Visible terrain faces are now inset farther (`surfaceScale 0.982` instead of `0.996`), creating a deliberate microscopic separation between neighboring surfaces rather than relying on mathematically shared raster edges.
- The visible surface plane is raised to approximately `y = 0.035`, while the single stable terrain bed is lowered to approximately `y = -0.085`. The bed fills the tiny visual gaps without being coplanar with either adjacent tile.
- Ground materials also use an explicit polygon offset as an additional depth-stability guard. Fog sits independently at approximately `y = 0.165`.
- The Browser 0135 root-cause invariant remains permanent: visible ground color still comes from explicit ordinary material batches. The active ground builder contains no `setColorAt()` / ground `instanceColor` path, so the black-ground regression is not reintroduced.
- Rich Browser 0145 neighbor grading, procedural ground texture, rotated texture orientation, roadside sidewalks, building access walks, and regional palettes remain active.

VISIBLE BATCHED GRASS / SHRUBS
------------------------------
- The Browser 0205 grass and shrub `InstancedMesh` objects could be culled as a complete batch even though their translated instances covered a large battlefield. Both decorative batches now explicitly disable frustum culling.
- Grass geometry is taller/wider and shrubs are modestly larger so they remain readable from both 3D Iso and FPV without becoming heavy scene objects.
- Density remains biome-aware but is increased enough to be visible: tropical/temperate remain fuller, arid/tundra remain restrained.
- Quality caps remain bounded at approximately 220/440/680 grass tufts and 28/54/88 shrubs for Performance/Balanced/Quality before biome scaling.
- Sidewalk/access-walk edges adjacent to natural terrain can now receive a small pair of tufts roughly one third of the eligible time, biased toward the natural side of the boundary. This produces occasional grass peeking between paving hexes rather than a continuous border.
- Grass and shrubs remain two lightweight instanced decorative batches. They add no collision, occupancy, cover, concealment, LOS, ballistics, TU, or pathfinding behavior.

MODULAR MAINFRAME-ARCHETYPE ALIENS
----------------------------------
- Tactical aliens are no longer all represented by the same generic purple body/head pair.
- The battlefield renderer now uses the same six archetype identities already used by the Mainframe database visual mapping and alien descriptions:
  - Signal Leech: compact bulbous neural-parasite silhouette with hanging tendrils.
  - Glass Wraith: tall, narrow, translucent/crystalline body with elongated limbs.
  - Needle Drone: low mechanical core with multiple legs and visible dorsal needles.
  - Tide Horror: broad amphibious/reptilian body with elongated head, heavy limbs, and tail.
  - Chitin Brute: thick armored torso, prominent shoulder plates, and oversized limbs.
  - Pale Commander: tall pale frame, enlarged head, and recognizable neural-crown spines.
- The models deliberately remain low-poly and lightweight. The goal is immediate silhouette recognition at tactical scale rather than photorealism.
- Each alien is assembled from tagged modular pieces (head, torso/core, limbs, plates, tendrils, needles, tail/crown as appropriate). This gives the renderer real separable parts for the critical-kill presentation rather than spawning unrelated debris.
- Alien archetype is now part of the persistent unit visual signature so changing/creating a different alien type cannot accidentally reuse another species' model.

EXCEPTIONAL LETHAL-SHOT / CRITICAL KILL PRESENTATION
----------------------------------------------------
- Only a successful AEGIS shot that actually kills an alien can qualify. Nonlethal shots, misses, alien-on-human attacks, and Frag Grenades do not use this effect.
- Qualification is deterministic and intentionally uncommon. A presentation score considers damage relative to the alien's maximum HP, true overkill beyond the HP it had before the shot, shot hit chance, aimed/sniper fire, complete multi-round hits, and modest energy-weapon bonuses.
- The score threshold is high enough that an ordinary lethal hit remains an intact fallen alien. A severe high-quality overkill can trigger `CRITICAL KILL` in the left-side shot-result stack.
- Combat is already resolved before this presentation is evaluated. It does not reroll accuracy, alter damage, change ammunition/TU, award extra kills, change salvage/recovery, or affect mission outcome.
- When triggered in Three.js, the target's actual modular alien pieces separate at impact, travel outward in deterministic physics-like arcs, spin, fall under gravity, and leave a small persistent remnant on the battlefield.
- The original alien node is hidden only for that critical-kill presentation; campaign casualty/remains logic continues using the authoritative tactical result.
- Tactical Focus still acquires the authoritative target before the shot, so an FPV Critical Kill occurs as the culmination of the existing deliberate acquisition/release sequence rather than as a disconnected effect.

PRESERVED SYSTEMS
-----------------
- Roadside sidewalks and building access paths remain presentation-only and unchanged.
- Tactical Focus, FPV target HUD, weapon rig, pre-aim, camera smoothing, avoidance lean, regional sky/day-night presentation, and regional architecture remain active.
- The left-side shot-result stack remains in its approved location.
- Random victory music and the terminal reinforcement/victory gate remain unchanged.
- Browser 1930 indexed pathfinding, Browser 2207 cooperative aftermath, and Browser 2335 lazy memorial index remain active.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Targeted critical-kill tests confirm a severe aimed plasma overkill qualifies, while an ordinary ballistic lethal hit, a grenade kill, and an alien killing a human do not.
- All six Mainframe archetype names resolve to six distinct tactical silhouette profiles.
- The active persistent ground builder contains no `setColorAt()` call, uses the 0.982 surface inset, raises visible faces, applies depth/polygon separation, and raises fog independently.
- Both vegetation batches explicitly use `frustumCulled=false`, and sidewalk-edge tufts are biased farther toward the natural boundary.
- Static Build Health now covers the hex-depth, visible-vegetation, modular-alien, and critical-dismemberment seams.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Reopen the same mixed-terrain mission that showed the edge shimmer. Pan, orbit, zoom, and enter FPV while watching a boundary between two very different terrain materials. Confirm neither edge repeatedly swaps/flips on top of the other.
2. Confirm rich terrain color fading and texture from Browser 0145 remain visible and the black-ground regression does not return.
3. Check arid, temperate, and tropical missions in 3D Iso and FPV. Confirm actual grass/shrubs are visibly present, while arid growth remains sparse.
4. Find sidewalk/access-walk boundaries beside natural ground and confirm occasional small grass pairs poke through near the hex edge without becoming a continuous hedge.
5. Compare Signal Leech, Glass Wraith, Needle Drone, Tide Horror, Chitin Brute, and Pale Commander on the battlefield. Confirm they can be identified from silhouette/major anatomy without opening the Mainframe.
6. Observe ordinary alien deaths and confirm most remain intact fallen models.
7. Observe an exceptionally strong lethal AEGIS firearm/energy shot. When it qualifies, confirm the shot stack reports `CRITICAL KILL`, modular parts separate only after impact, and pieces arc/fall without affecting the already-resolved combat result.
8. Confirm nonlethal fire, grenade kills, and alien attacks on humans never invoke alien gunshot dismemberment.
9. Confirm kills, XP, ammunition, TU, mission reports, rewards, salvage/remains recovery, and victory gating match the authoritative battle exactly.

PREVIOUS BUILD - 0205
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0205_SIDEWALK_STABLE_TERRAIN_TACTICAL_FOCUS_AND_LIGHT_VEGETATION_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added a presentation-focused tactical pass on top of Browser 0145's rich explicit-material terrain. Roads and service lanes now receive lighter one-hex pedestrian sidewalks, and building doors can receive short decorative access walks to the nearest sidewalk. The persistent ground renderer no longer overlaps enlarged neighboring hex faces or competing seam meshes, removing the coplanar z-fighting that made hex edges shimmer and squiggle. AI first-person firefights gain an original Tactical Focus presentation that frames and acquires the authoritative target before releasing the already-resolved shot. Sparse biome-aware grass tufts and shrubs are added through two bounded instanced decorative batches, including occasional edge grass where pedestrian paving meets natural ground.

ROADSIDE SIDEWALKS AND BUILDING ACCESS WALKS
---------------------------------------------
- Cells directly beside true road and service-lane cells can receive a one-hex-wide pedestrian sidewalk rendered in a lighter neutral gray than the roadway.
- Sidewalk generation excludes the road itself, building interiors, streams/irrigation, hard cover, and the outer map boundary.
- Each authored building door examines valid exterior approach cells and performs a bounded search for the nearest generated sidewalk. When a route exists, the exterior cells between the door and sidewalk receive a slightly lighter pedestrian access-walk treatment.
- Access walks are capped and deterministic; they do not grow arbitrarily across the map.
- Sidewalk and access-walk state is presentation-only. The underlying tactical terrain, TU movement costs, passability, occupancy, cover, building-entry rules, AI pathfinding, and line of sight remain authoritative and unchanged.
- Sidewalk/access-walk surfaces remain part of the rich explicit-material terrain system and retain restrained paved wear rather than becoming featureless flat polygons.

STABLE TERRAIN LAYERS / Z-FIGHTING FIX
--------------------------------------
- Browser 0145's visible hex faces used a slightly oversized surface together with locally colored seam underlays. Adjacent surfaces could therefore occupy overlapping pixels at the same depth and fight for ownership, producing the reported shimmering/squiggling edge effect.
- Visible tactical hex faces are now slightly inset instead of oversized (`surfaceScale 0.996`). Neighboring terrain batches therefore do not overlap one another.
- The many overlapping colored seam underlays are removed from the active persistent terrain builder.
- One lower terrain bed sits safely below the complete battlefield and is visible only through the very narrow raster gaps between inset hexes. It uses a darkened average battlefield tone and never competes with the surface plane for depth.
- The Browser 0135 black-ground invariant remains permanent: the active visible terrain builder uses explicit ordinary material colors and contains no ground `setColorAt()` / `instanceColor` dependency.
- Fog remains on its own elevated transparent layer and cannot z-fight with the ground surface.

AI FPV - TACTICAL FOCUS
-----------------------
- Human AI-controlled shots shown in first person now enter an original `Tactical Focus` presentation phase after movement and before visible firing.
- The camera tightens from the normal approximately 72-degree field of view toward approximately 58 degrees while the reticle turns onto the authoritative shot target.
- The visor panel identifies the target, approximate distance, weapon, and a presentation-only firing-solution quality indicator while the sight settles.
- At normal Battle Speed the target-acquisition beat is approximately 0.88 seconds, with bounded scaling for faster/slower playback. The shot then enters a short release and recovery beat.
- The actual AI decision, hit/miss roll, damage, ammunition, TU use, target choice, shot order, and mission result are already authoritative before the presentation begins and are not recalculated by Tactical Focus.
- Alien actions never steal the soldier-eye observer camera. Existing FPV target visibility, HUD knowledge restrictions, pre-aim behavior, weapon rig, avoidance lean, and camera smoothing remain active.
- The feature intentionally uses Project Aegis terminology and visual language rather than another game's branding or proprietary interface.

LIGHTWEIGHT BIOME VEGETATION
----------------------------
- Sparse grass tufts and small shrubs are generated only on compatible organic ground and are deterministic for the mission seed.
- Grass uses one instanced three-sided cone batch and shrubs use one low-poly icosahedron batch. Hundreds of decorative plants therefore require only two additional draw batches rather than one object/draw call per plant.
- Density is scaled by environment: tropical and temperate maps can be fuller, while arid and tundra maps remain sparse.
- Density is also quality-aware. Performance mode uses lower caps than Balanced and Quality modes.
- Current caps are approximately 150/280/430 grass tufts and 18/38/62 shrubs for Performance/Balanced/Quality before biome scaling.
- A small minority of sidewalk/access-walk cells beside natural terrain can receive one short grass tuft biased toward the natural edge, creating occasional vegetation peeking through the paving boundary rather than a continuous grass border.
- Decorative vegetation has no occupancy, collision, cover, concealment, LOS, projectile, TU, or pathfinding role and does not cast tactical shadows.

PRESERVED SYSTEMS
-----------------
- Browser 0145's rich terrain fading, explicit material batches, procedural surface textures, local biome palettes, and FPV obstacle-avoidance lean remain active.
- The left-side tactical shot-result stack remains unchanged.
- FPV weapon barrel, visor markers, target pre-aim, location-aware sky, day/night presentation, regional architecture, and victory celebration remain active.
- Terminal victory/reinforcement gating and the random Operation Vindicator victory bank are unchanged.
- Browser 1930 pathfinding optimization, Browser 2207 cooperative mission aftermath, and Browser 2335 lazy memorial index remain active.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- The active persistent terrain builder contains no `seamBatches` and no `setColorAt()` call; it requires the stable lower terrain bed and marks the rendered surface as non-overlapping.
- The shared hex geometry contract requires `surfaceScale < 1` for the active ground surface.
- Static release checks require the pedestrian surface map, stable terrain bed, lightweight vegetation layer, Tactical Focus acquisition seam, current build metadata, and unchanged save format.
- The packaged victory MP3 files are byte-for-byte unchanged from Browser 0145.

MANUAL TEST GATES
-----------------
1. Load a Small Town/urban tactical mission containing roads. Confirm a lighter one-hex sidewalk appears alongside road edges and that building entrances receive plausible short access walks toward the nearest sidewalk where geometry permits.
2. Pan/zoom the 3D Iso camera over high-contrast adjacent terrain and watch the edges while the camera moves. Confirm neighboring hex faces no longer shimmer, squiggle, or repeatedly swap which texture appears on top.
3. Confirm the rich Browser 0145 terrain colors/textures remain visible and the black-ground regression does not return.
4. Enable AI FPV and observe a human soldier firing. Confirm movement finishes, Tactical Focus turns the reticle onto the intended target, the FOV tightens, the solution panel appears, and only then does the visible shot release.
5. Compare the tactical result with normal AI playback and confirm Tactical Focus changes presentation only, not target, hit/miss, damage, TU, ammunition, or action order.
6. Inspect tropical/temperate/arid/tundra maps at different 3D quality settings. Confirm grass/shrub density is sparse and biome-appropriate and does not noticeably reduce responsiveness.
7. Inspect sidewalk/path boundaries and confirm only occasional small edge tufts appear rather than a dense continuous grass line.
8. Confirm the left-side shot-result stack remains in its current position and behavior.

PREVIOUS BUILD - 0145
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0145_RICH_TERRAIN_EXPLICIT_MATERIAL_AND_FPV_AVOIDANCE_LEAN_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Browser 0135 finally isolated and fixed the black-ground regression: the live GPU path was failing when the consolidated persistent terrain depended on `InstancedMesh.setColorAt()` / `instanceColor`. With that root cause now known, this patch deliberately rolls back the visual simplifications from the unsuccessful terrain-diagnostic passes and restores the richer terrain treatment on top of the proven explicit-material renderer. Balanced neighbor fading, authored base/accent variation, CanvasTexture surface detail, rotated texture orientation, and color-matched seams are active again, but ground color never returns to per-instance colors. FPV also gains a small obstacle-avoidance lean while an AI-controlled soldier moves past nearby units or cover.

ROOT-CAUSE FIX PRESERVED
------------------------
- Browser 0135's successful rule is retained as a hard renderer invariant: the persistent terrain builder contains no `setColorAt()` call and does not rely on `instanceColor` for visible ground color.
- Each terrain batch uses an ordinary explicit `MeshBasicMaterial.color`, the same reliable material-color path that fixed the live black-ground screenshots.
- Fog remains matrix/count-only instancing and likewise does not use per-instance color.
- Exact tactical picking is preserved through each batch's instance-indexed cell list.

RICH TERRAIN PRESENTATION RESTORED
----------------------------------
- Restored the Browser 2335 balanced neighbor-fading doctrine instead of the later diagnostic flat-color presentation.
- Every cell first mixes its authored base/accent palette with deterministic local variation.
- Neighbor influence is contrast-aware: approximately 9% for similar adjacent terrain, 14% for moderate transitions, and 18% for strong boundaries.
- This allows dry ground, scrub, grass, roads, stone, building floors, paths, and other surfaces to grade into one another without replacing the owning terrain identity with one map-wide average.
- Cell colors are quantized into explicit-material batches. This preserves local fading while avoiding one draw call per hex and avoiding the broken instance-color path.

GROUND TEXTURE AND SEAMS RESTORED SAFELY
----------------------------------------
- Procedural 64 x 64 CanvasTexture detail is active again.
- The texture is a neutral light modulation map rather than the source of terrain hue. Explicit material color remains authoritative, so texture sampling cannot recreate the previous black instance-color failure.
- Organic ground receives irregular mottling; crop/field surfaces receive subtle bands; roads, lanes, stone, and built surfaces receive restrained wear/fleck detail.
- Every hex receives one of six deterministic 60-degree texture rotations so repeated patterns do not align across the complete battlefield.
- A narrow color-matched seam underlay is restored. Seam color is derived from the owning cell plus nearby terrain rather than a universal dark strip.

DIAGNOSTIC TERRAIN PASSES ROLLED BACK FROM ACTIVE PRESENTATION
-------------------------------------------------------------
- Browser 2355's no-neighbor-blend palette-only presentation is no longer the active terrain surface.
- Browser 0030's forced daylight luminance lift and texture removal are no longer used by the active persistent terrain builder.
- Browser 0125's terrain-derived per-cell fog-color experiment is no longer active.
- Browser 0135's deliberately simplified flat semantic-family colors served their diagnostic purpose and are superseded by the rich explicit-material batches in this build.
- The historical helper code remains in the single-file artifact for patch-history/build-health continuity, but the live terrain path now follows Browser 0145's explicit-material rich-rendering contract.
- Pre-diagnostic unseen/explored fog strengths are restored while retaining the safe matrix-only fog implementation.

FPV OBSTACLE-AVOIDANCE LEAN
---------------------------
- During AI movement, FPV examines the current movement path and nearby living units/cover around the observed soldier.
- If another unit or cover object occupies or crowds the movement corridor, the camera eases toward the clearer side instead of remaining perfectly centered through the obstruction.
- Centerline obstacles choose a deterministic left/right side so the view does not jitter between directions.
- The lean uses a small lateral eye shift, a restrained camera roll, and matching weapon-rig movement.
- The lean eases in and out rather than snapping at hex boundaries.
- This is visual only. It does not alter the authoritative movement path, occupancy, collision, TU use, formation logic, AI decisions, or where the soldier actually stands.

PRESERVED SYSTEMS
-----------------
- The left-side shot-result stack remains unchanged.
- FPV target pre-aim, weapon barrel, visor HUD, camera smoothing, local sky, traditional regional architecture, and day/night presentation remain active.
- Victory music and the terminal reinforcement gate are unchanged.
- Browser 1930 pathfinding optimization, Browser 2207 cooperative mission aftermath, and Browser 2335 lazy memorial indexing remain active.
- Save format remains 4.

VALIDATION
----------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the active persistent terrain builder has no `setColorAt()` call.
- Static validation confirms the active terrain builder both uses `map:tacticalThreePersistentGroundTexture(...)` and assigns an explicit material color for every terrain batch.
- The active terrain path contains the restored contrast-aware neighbor blend and color-matched seam batches.
- An isolated FPV avoidance test confirms: no nearby obstacle = zero lean; a centerline obstacle creates a deterministic nonzero lean; a side obstacle produces a lean away from that side.
- Assets are unchanged from Browser 0135.

MANUAL TEST GATES
-----------------
1. Reopen the arid Small Town daylight mission that proved Browser 0135 fixed the black ground. Confirm the ground remains colored rather than black.
2. Compare the same battlefield with Browser 0135: Browser 0145 should show noticeably richer within-tile mottling, local gradient/variation, and softer terrain transitions.
3. Verify true roads, dry soil, scrub, vegetation, stone, and building-floor surfaces remain visually distinct instead of becoming one averaged sheet.
4. Enable FPV during AI movement and watch a soldier pass close to another soldier, a wall/crate/tree, or other cover. Confirm the camera and weapon lean slightly to the clearer side and return smoothly to center afterward.
5. Confirm the lean does not change the actual hex route, movement timing, occupancy, firing, or AI result.
6. Confirm the left-side shot-result stack, FPV target acquisition, HUD markers, victory music, and mission completion still behave normally.

PREVIOUS BUILD - 0135
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0135_EXPLICIT_TERRAIN_MATERIAL_BATCH_AND_FOG_OVERLAY_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
The Browser 0125 screenshots provided decisive new evidence: the battlefield remained pure black even in FPV immediately around a living AEGIS soldier, where the ground receives no fog-of-war mesh. That rules out fog as the primary remaining failure. The common factor was Browser 0030's single ground `InstancedMesh`, which depended on per-instance `setColorAt()` data to produce every terrain color. Browser 0135 removes that dependency completely. The persistent battlefield now uses a bounded set of still-instanced meshes whose ordinary Three.js materials carry explicit terrain colors, while fog uses fixed translucent materials and matrix-only instancing. This follows the same basic material-color path that is already rendering soldiers, buildings, props, and the Skyranger correctly in the supplied screenshots.

EXPLICIT TERRAIN MATERIAL BATCHES
---------------------------------
- Removed the single vertex/instance-colored ground mesh from the persistent renderer.
- Ground cells are grouped into semantic surface families such as road, lane, path, stream, building floor, doorway, dry earth, scrub, grass, forest, crop, stone, and open terrain.
- Every resulting batch is still an `InstancedMesh`, but its `MeshBasicMaterial.color` explicitly contains the terrain color. Ground visibility no longer depends on `InstancedMesh.instanceColor` or `setColorAt()`.
- Organic terrain families use two deterministic variants so large areas do not become one perfectly flat material while remaining within a bounded draw-call count.
- True pavement and built surfaces retain stable dedicated material families, preserving road-versus-soil value separation.

BLACK UNDERLAY / SEAM REMOVAL
-----------------------------
- The persistent ground seam underlay has been removed from the active terrain builder.
- The slightly oversized main hex geometry already closes raster gaps, so a second ground layer is not required.
- This removes another possible full-map dark surface beneath the playable tiles and simplifies diagnosis of the renderer.
- Edge/reachable/selected/extraction rings remain independent and unchanged.

FOG WITHOUT INSTANCE COLORS
---------------------------
- Unseen and explored fog remain dynamic instanced overlays, but they now use fixed translucent day/twilight/night material colors.
- Fog instances update matrices/counts only. There are no fog `setColorAt()` calls and no `instanceColor` dependency.
- Browser 0125's substantially reduced day/twilight/night fog opacities are retained.
- Visible cells still receive no fog overlay at all.
- Hidden aliens, civilians, VIPs, beacons, covers, and objective information remain governed by the existing tactical reveal/LOS rules.

PRESERVED SYSTEMS
-----------------
- The well-received left-side shot-result stack is unchanged.
- FPV pre-aim, weapon model, visor HUD, camera smoothing, location-aware sky, regional architecture, and biome selection remain active.
- Victory music, reinforcement victory gate, pathfinding optimization, cooperative aftermath, lazy memorial indexing, cover, movement, LOS, Time Units, AI decisions, and mission resolution are unchanged.
- Save format remains 4.

VALIDATION
----------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static validation confirms the persistent terrain/fog block contains no `setColorAt()` calls.
- Static validation confirms terrain batches use explicit `MeshBasicMaterial({color: batch.color})` values.
- A representative material-batch fixture produced separate arid dry-ground (`#da9b51`), scrub (`#9c7733`), road (`#455060`), and grass (`#6f873b`) materials with only four batches.
- Build Health now requires the explicit-material-batch marker and rejects reintroduction of the ground `setColorAt(cell.surfaceColor)` dependency.

MANUAL TEST GATES
-----------------
1. Load the same arid Small Town daylight mission shown in the Browser 0125 screenshots.
2. In FPV, the ground directly around and ahead of the observed soldier must no longer be a pure black plane.
3. In 3D Iso, roads should render as a distinct darker gray while dry earth/scrub/vegetation use visibly different tan, ochre, and muted green materials.
4. Move between visible, explored, and unrevealed areas and confirm fog changes brightness without replacing the terrain with a black sheet.
5. Confirm unit/cover/objective visibility, hex picking, movement, pathfinding, the FPV HUD, and the left-side shot stack remain correct.

PREVIOUS BUILD - 0125
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0125_TERRAIN_COLOR_PRESERVING_FOG_FIX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Live screenshots from Browser 0030 proved that the terrain palette itself was no longer the main problem. The persistent fog-of-war renderer was still placing a single dark biome-colored mesh over every unseen cell at 72% opacity in daylight, visually flattening otherwise distinct tan, brown, green, gray, and road surfaces into one near-black sheet. Browser 0125 fixes the fog layer itself: unseen and explored ground now receive per-cell fog tints derived from each tile's own terrain color, with substantially lower daytime opacity, so terrain remains readable in 3D Iso and FPV without revealing hidden units, objectives, or tactical knowledge.

COLOR-PRESERVING FOG-OF-WAR
----------------------------
- Persistent unseen/explored fog batches now use `vertexColors` and per-instance colors instead of one universal dark biome color.
- Each unseen cell derives its veil from that cell's presented terrain color, slightly cooled/desaturated toward the mission biome and then darkened. Grass remains greenish, arid soil remains brown/tan, roads remain gray, and concrete/stone retain their own value relationships under fog.
- Explored cells use a lighter version of the same per-cell tint so known terrain remains almost fully readable when it is outside current sight.
- Currently visible cells continue to receive no ground fog mesh at all.

DAY / TWILIGHT / NIGHT OPACITY
-------------------------------
- Daylight unseen fog: 72% -> 34%.
- Daylight explored fog: 13% -> 10%.
- Twilight unseen/explored fog: 79% / 24% -> 42% / 15%.
- Night unseen/explored fog: 84% / 36% -> 50% / 22%.
- Night remains visually darker because the underlying terrain itself still follows the mission's local lighting phase. The fog layer no longer has to create darkness by painting the map black.

TACTICAL KNOWLEDGE PRESERVED
-----------------------------
- Alien, civilian, VIP, beacon, and other objective reveal rules are unchanged.
- Fog still consumes the existing authoritative visible/explored sets.
- Hidden contacts are not rendered merely because their ground tile is now readable.
- Line of sight, AI knowledge, shooting, pathfinding, cover, movement, Time Units, and mission outcomes are unchanged.
- Save format remains 4.

VALIDATION
----------
- All six embedded JavaScript blocks pass syntax validation.
- Static validation confirms both persistent fog materials are per-instance vertex-colored and the dynamic update writes independent unseen/explored colors for every fogged cell.
- Representative daylight arid composites now remain clearly separated under unseen fog: dry ground approximately `#b88345`, scrub approximately `#84652b`, and true road approximately `#3a4451` rather than converging toward a common near-black value.
- The left-side shot result stack, FPV weapon/HUD/pre-aim, regional architecture, victory music, pathfinding optimization, cooperative aftermath, and lazy memorial index are untouched.

MANUAL TEST GATES
-----------------
1. Recreate the arid Small Town daylight operation shown in the Browser 0030 screenshots. The unrevealed ground should now retain visible tan/brown/gray terrain families instead of reading as a black sheet.
2. In 3D Iso, compare a road against adjacent dry ground/scrub both inside and outside current sight. The road should remain noticeably darker and grayer.
3. Enable FPV and confirm the ground ahead is no longer black merely because cells are outside the current visibility set.
4. Confirm unrevealed aliens/VIPs/objectives remain hidden exactly as before.
5. Verify the left-side shot-result stack remains unchanged.

PREVIOUS BUILD - 0030
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.17.0030_BRIGHT_REGIONAL_TERRAIN_READABILITY_AND_ASPHALT_REMOVAL_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Reworked the persistent Three.js tactical ground after live screenshots showed Browser 2355 still rendering arid daylight missions as a dark, nearly uniform asphalt sheet. The remaining problem was the visual stack rather than neighbor averaging: palette CanvasTextures were still multiplied across every tile and produced a repeated diagonal streak pattern, while the explored-ground fog veil remained dark enough to bury already-known biome color. Browser 0030 removes the active ground texture map entirely, renders explicit per-cell biome colors, raises daylight readability by regional environment, narrows the seam underlay again, and lightens only explored daylight fog. Unrevealed fog-of-war remains strongly obscured.

BRIGHT BIOME-SPECIFIC GROUND
----------------------------
- Persistent 3D ground now uses one vertex-colored instanced hex surface with the authoritative per-cell terrain color written directly to each instance.
- The active tile material no longer uses `tacticalThreePersistentGroundTexture(...)`; this removes the repeated diagonal dash/streak artifact visible in both isometric and FPV screenshots.
- Arid daylight receives the strongest readability lift so desert scrub, dusty yards, dry ground, and pale stone read as tan/ochre/sun-bleached surfaces rather than charcoal.
- Mediterranean, tropical, temperate, boreal, and tundra/alpine surfaces receive smaller environment-specific daylight lifts that preserve their own palette identity.
- True roads and service lanes intentionally receive much less lift, preserving the visual hierarchy of darker pavement against brighter surrounding soil/vegetation.
- Twilight and night retain darker presentation scaling; the change does not turn nighttime missions into daylight.

FOG-OF-WAR READABILITY
----------------------
- Explored-but-not-currently-visible ground uses a 13% veil during daylight instead of the previous 38% dark overlay.
- Twilight explored fog remains stronger at 24%; night remains stronger at 36%.
- Completely unrevealed cells remain heavily obscured: 72% by day, 79% at twilight, and 84% at night.
- No tactical knowledge is added. Alien/civilian/objective reveal rules and the authoritative visible/explored sets are unchanged.

SEAMS / HEX READABILITY
-----------------------
- Surface geometry scale is tightened from 1.008 to 1.006 and raster-closing underlay scale from 1.018 to 1.012.
- Seam color is now only about 1.5% darker than the owning presented tile and receives almost no detail-color pull.
- This keeps tiny WebGL gaps closed without redrawing the battlefield as dark hex outlines.
- Per-cell deterministic color variation remains, but its range is reduced so it cannot overpower the terrain category.

PRESERVED SYSTEMS
-----------------
- The left-side shot-result stack remains exactly where it is.
- FPV pre-aim, weapon rendering, target/VIP/civilian/extraction HUD, camera smoothing, sky/day-night atmosphere, architecture, victory music, reinforcement victory gate, pathfinding, cooperative aftermath, and lazy memorial indexing remain active.
- Cover, movement, pathfinding, line of sight, fog knowledge, hit chance, AI decisions, Time Units, mission resolution, and campaign data are unchanged.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Static release validation confirms the persistent terrain builder contains no active ground texture map, uses explicit instance colors, retains the new patch flag, keeps the left shot stack, and uses the narrower seam geometry.
- A representative arid daylight fixture moves desert scrub from approximately `#745726` to `#9c7733` (luminance ~122) and dry ground from approximately `#a87539` to `#da9b51` (luminance ~163), while a true road remains near `#455060` (luminance ~79).
- Build Health now requires the bright regional terrain marker, texture-map-free persistent terrain, a brighter arid surface than road surface, narrow color-matched seams, and the reduced daylight explored-fog opacity.

MANUAL TEST GATES
-----------------
1. Re-run an arid Small Town daylight mission similar to the supplied screenshots. Open ground should read as dusty tan/ochre/stone, not black asphalt.
2. From 3D Iso, verify roads remain visibly darker than lawns/yards/scrub/soil and that terrain categories can be distinguished at a glance.
3. Enable FPV and verify nearby visible ground retains the same bright regional colors without the repeating diagonal dash texture.
4. Move into previously explored but currently unseen ground and verify it is shaded but still readable; completely unrevealed terrain should remain strongly fogged.
5. Confirm the left-side shot-result stack remains unchanged.
6. Run Build Health and confirm the FPV/terrain readability contract reports OK.

PREVIOUS BUILD - 2355
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2355_TERRAIN_PALETTE_RESTORE_AND_COLOR_MATCHED_SEAMS_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected the 3D terrain presentation after Browser 2335 still made the battlefield read as a uniform sheet of asphalt. The problem was structural rather than a percentage needing another small adjustment: the complete interior color of every tile was still averaged toward neighboring tiles and then multiplied through one neutral texture. This build removes whole-tile neighbor averaging, restores authored terrain-specific textures, and confines visual softening to narrow color-matched seams plus subtle organic texture variation.

AUTHORED TERRAIN PALETTE RESTORE
--------------------------------
- The interior of each tactical hex again uses its own authored base, accent, and detail colors.
- Grass, forest floor, scrub, farmland, harvested fields, tilled soil, roads, service lanes, concrete, building interiors, stone, snow/sand, crash scars, and regional biome palettes remain visibly distinct.
- Neighbor colors no longer alter the complete tile face.
- The former single neutral ground texture has been removed from active persistent rendering.
- Palette-specific 64x64 textures now contain subdued deterministic mottling based on that terrain's own colors.
- Hex textures receive one of six rotations plus a very small brightness variation, reducing repeated stamped patterns without flattening terrain categories.

COLOR-MATCHED SEAMS
-------------------
- The raster-gap underlay is narrowed from scale 1.024 to 1.018.
- Each underlay instance receives a slightly darkened color derived from its own tile instead of one battlefield-wide gray seam color.
- The seam remains sufficient to close tiny WebGL junction gaps but no longer redraws the board as a dark hex grid.
- The legacy/fallback Three.js renderer receives the same terrain-matched seam behavior.

PRESERVED SYSTEMS
-----------------
- The well-received left-side shot-result stack is unchanged.
- FPV pre-aim, weapon rendering, HUD markers, regional sky, first-person camera smoothing, architecture, victory music, reinforcement victory gate, pathfinding, cooperative aftermath, and lazy memorial indexing remain unchanged.
- Terrain labels, cover, movement, pathfinding, line of sight, fog, extraction, destruction, AI decisions, and combat balance are unchanged.
- Save format remains 4.

BUILD HEALTH / VALIDATION
-------------------------
- Build Health now requires authored palette batches, palette-matched seams, and removal of the active `neighborBlendedGround` renderer marker.
- A high-contrast grass-versus-road fixture must retain at least 86% of its authored color separation.
- The seam must remain close to the source tile color rather than becoming a universal gray.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Package validation confirms all victory-audio assets are unchanged.

MANUAL TEST GATES
-----------------
1. Inspect a mixed 3D battlefield from high zoom. Roads, fields, grass, soil, concrete, forest floor, and building interiors should be immediately distinguishable.
2. Confirm the ground no longer reads as one gray/asphalt sheet.
3. Look for narrow dark gaps between hexes. Tiny raster gaps should remain closed without an obvious universal grid.
4. Enter FPV and confirm the restored terrain color variety remains readable near ground level.
5. Confirm the shot-result stack remains on the left and unchanged.
6. Run Build Health and confirm the authored-palette terrain contract reports OK.

PREVIOUS BUILD - 2335
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2335_BALANCED_TERRAIN_BLEND_AND_LAZY_MEMORIAL_INDEX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Refined Browser 2300's terrain smoothing to a middle ground: neighboring hexes still soften abrupt boundaries, but each cell now retains more of its authored base/accent identity and natural local variation. The well-received left-side shot-result stack is unchanged. This build also completes the next documented performance cleanup by lazily indexing the 3,500-entry memorial message library and reusing that index during KIA/tribute generation.

BALANCED 3D TERRAIN BLENDING
----------------------------
- A cell's authored base and accent colors now create a deterministic local tone before any neighbor influence is applied.
- Neighbor blending is reduced from a uniform 26% to a contrast-aware 9%, 14%, or 18%.
- Similar neighboring terrain receives only a light smoothing pass; visibly different terrain receives a somewhat stronger but still bounded transition.
- Brightness variation is narrower and secondary to authored palette variation, preventing both flat sameness and regular alternating tiles.
- The seam underlay remains terrain-derived but is slightly lighter, avoiding a return to dark chessboard outlines.
- The renderer continues using one instanced ground batch with per-cell colors and exact instance-to-hex picking.
- Terrain labels, biome classification, cover, movement, pathfinding, visibility, fog, extraction, destruction, and balance are unchanged.

LAZY MEMORIAL MESSAGE INDEX
---------------------------
- The 3,500-entry massive memorial-message library no longer repeatedly normalizes every message's tags for every generated tribute.
- The first memorial selection lazily builds reusable records and indexes for relationship tier, item category, relationship tags, item tags, and tone.
- Later KIA and Memorial-screen selections reuse normalized Set-based records instead of allocating and scanning normalized tag arrays repeatedly.
- Candidate selection includes every message capable of receiving a positive score for the requested relationship/item/tone context.
- Exact legacy selection is preserved: if the best indexed candidate is low enough that unrelated zero-score entries could enter the weighted near-best pool, selection automatically falls back to the complete indexed record list.
- The index is transient runtime data. It is not serialized and requires no save migration.

PRESERVED PRESENTATION
----------------------
- The shot-result stack remains in the compact left-side position introduced by Browser 2300.
- FPV pre-aim, target HUD, visible weapon, regional sky, architecture, victory music, and the terminal reinforcement gate are unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a balanced-blend contract requiring neighbor smoothing while retaining at least 62% of the original color separation in a high-contrast fixture.
- Added a lazy-index contract verifying one reusable cache, full library coverage, meaningful candidate narrowing, and identical indexed/exhaustive selected message IDs.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A 76,800-cell deterministic terrain comparison found that the revised blend preserved more of the authored cell color in 89.9% of samples while still moving 80.2% of samples toward their neighboring palette.
- Memorial equivalence validation compared 420 representative contexts against the previous exhaustive selector with zero message-ID mismatches. In an isolated 180-selection benchmark, the warmed indexed selector was about 4.2× faster (99 ms versus 420 ms).
- Save format remains 4 and the victory audio assets are unchanged.

MANUAL TEST GATES
-----------------
1. Inspect mixed forest/farmland, urban-edge, arid, tropical, tundra, road, soil, and concrete areas from elevated 3D Iso. Confirm boundaries are softened but the terrain no longer looks uniformly colored.
2. Zoom between local cells and confirm forests, fields, roads, scars, snow/sand, and building ground retain recognizable color differences.
3. Confirm the left-side shot-result stack remains unchanged and does not cover the primary action.
4. Complete a mission with one or more KIA, allow the cooperative aftermath to finish, and inspect the Memorial. Confirm tribute text/items remain varied and appropriate.
5. Reopen several fallen soldiers' memorial entries and confirm no runtime error and no missing offerings.
6. Run Build Health and confirm the balanced terrain / lazy memorial index contracts report OK.

PREVIOUS BUILD - 2300
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2300_FPV_PREAIM_LEFT_SHOT_STACK_AND_TERRAIN_BLEND_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Improved AI first-person combat readability by adding an explicit pre-fire target-acquisition phase: after movement completes, the camera and crosshair turn toward the acting AEGIS soldier's target and receive a bounded settle interval before the visible shot, muzzle response, and projectile effect begin. Tactical shot-result cards now occupy a compact left-side stack rather than the center of the battlefield, and persistent 3D ground colors blend with neighboring hexes to reduce the chessboard appearance from elevated camera angles.

FPV PRE-FIRE TARGET ACQUISITION
--------------------------------
- Human AI shots shown through First Person now create a temporary aim cue after the soldier's movement animation completes.
- The perspective camera targets the actual shot destination before `showShotEvent(...)` creates recoil, weapon audio, tracer/projectile, and impact presentation.
- Aim turning uses a faster but still smoothed interpolation while the cue is active, allowing the center reticle to settle onto the target instead of snapping at the same instant as the shot.
- At normal Battle Speed the acquisition interval is approximately 620 milliseconds. Faster playback scales the interval down but retains a 360-millisecond minimum; slower playback receives a proportionally longer interval.
- The reticle changes to an amber acquisition state and identifies the pending target during this short presentation window.
- Alien action frames and non-first-person playback retain their existing timing. The observer never changes to an alien viewpoint.
- This delay is presentation-only. AI choice, hit chance, resolved hit/miss result, damage, ammunition, Time Units, target selection, reaction-fire authority, and frame order are already authoritative and remain unchanged.

LEFT-SIDE TACTICAL SHOT STACK
------------------------------
- Shot-result cards have moved from the upper center of the tactical battlefield to a compact column on the left.
- The stack begins below the upper-left renderer/FPV status block so it does not cover the center reticle, line of fire, target brackets, or the main action.
- Cards use left-aligned text and a slightly narrower maximum width while preserving newest-first ordering, six-entry capacity, ten-second full visibility, independent fade timing, toggle behavior, and permanent Mission Timeline records.
- The relocation applies to 2D, 3D isometric, manual, Hybrid AI, and Simulation AI tactical presentation.

NEIGHBOR-BLENDED 3D TERRAIN
----------------------------
- Each persistent 3D ground hex now mixes its authored terrain color with the average color of adjacent hexes.
- A small deterministic location/mission variation keeps natural ground from becoming a flat single color while avoiding harsh alternating palette blocks.
- The prior set of separate palette batches is replaced in the live persistent renderer by one instanced ground batch with per-instance colors. This reduces terrain draw-call fragmentation while retaining one pickable cell mapping for tactical interaction.
- The seam underlay now derives from the average battlefield ground color instead of using a high-contrast slate seam, making neighboring terrain read as a continuous surface from above.
- Terrain identity, labels, regional biome selection, cover objects, occupancy, pathfinding, fog-of-war, visibility, movement, extraction cells, and tactical balance are unchanged.
- The change is procedural and requires no new image or audio assets.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression contract requiring the FPV aim cue, target-directed camera pose, speed-bounded settle delay, left-side shot-result stack, and neighbor-blended instanced terrain path.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted pure-helper test confirmed human shots create aim cues, alien shots do not take over the soldier-eye camera, the camera pose points at the intended target, and settle delays remain 620 ms at normal speed / 413 ms at 150% / 1240 ms at 50%.
- A high-contrast adjacent-cell fixture reduced summed RGB difference from 288 to 190 after blending, confirming the algorithm softens abrupt tile transitions without flattening them completely.
- Static package validation confirms the current build identifier, aim state/prop wiring, left-side stack classes, instanced per-cell colors, unchanged save format 4, and retained victory audio files.
- A complete live WebGL AI firefight remains the manual validation gate in this execution environment.

MANUAL TEST GATES
-----------------
1. Start a 3D tactical mission, hand control to Simulation AI, enable First Person, and observe an AEGIS soldier with a visible target. Confirm the camera turns and the reticle settles onto the target before the shot/tracer begins.
2. Repeat at 10%, 50%, 100%, and 150% Battle Speed. Confirm acquisition remains readable and no shot is skipped or duplicated.
3. Observe alien actions and confirm FPV holds the last valid AEGIS soldier rather than aiming through an alien's eyes.
4. Confirm hit/miss, damage, ammunition, career kill credit, shot audio, impact timing, and playback order match the authoritative simulation result.
5. Generate several shot results and confirm the stack stays on the left, below the FPV status panel, without covering the reticle or main target area.
6. Toggle Shot Results Off/On and confirm the established clearing/timing behavior remains intact.
7. Inspect mixed forest, farmland, urban-edge, arid, tropical, and tundra battlefields from 3D isometric zoom. Confirm neighboring ground colors transition more naturally and dark chessboard seams are reduced.
8. Confirm cover, walls, windows, buildings, movement paths, extraction, fog, and cell clicking remain aligned with the same authoritative hexes.
9. Run Build Health and confirm the new FPV pre-aim / left stack / terrain blend contract reports OK.

PREVIOUS BUILD - 2255
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2255_CAMERA_RELATIVE_SKY_FPV_HUD_WEAPON_AND_TRADITIONAL_ARCHITECTURE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected the oversized first-person celestial sphere by making the procedural sky camera-relative, repaired the persistent renderer's missing first-person weapon geometries so an armed soldier's barrel is reliably visible, added a visibility-authorized sci-fi visor HUD, and made regional buildings easier to recognize from ground level through traditional facade, roofline, window, shutter, and foundation details.

CAMERA-RELATIVE SKY / SUN FIX
-----------------------------
- The sky dome, stars, sun, moon, and celestial halo now remain centered on the active camera rather than remaining fixed at the battlefield world origin.
- The player can no longer approach the sun sphere as the observed soldier crosses a large map.
- Sun and moon discs use a smaller fixed apparent scale and remain near the atmospheric horizon/sky direction derived from mission time and longitude.
- The sky-gradient shader now derives height from local sphere coordinates, preventing camera translation from distorting the horizon gradient.
- The directional light continues to use the celestial direction while the decorative sky layer follows the camera.
- This is presentation-only and does not alter tactical light sources, line of sight, fog-of-war, accuracy, detection, or mission time.

FIRST-PERSON WEAPON VISIBILITY REPAIR
-------------------------------------
- Root cause: Browser 2210's persistent Three.js renderer created a first-person weapon rig but its own geometry cache did not define the referenced barrel, shroud, sight, and muzzle geometries. The older non-persistent renderer did define them, which allowed static source checks to pass while the live persistent view could show no weapon.
- The persistent runtime now owns explicit barrel, shroud, receiver, grip, sight, and muzzle geometry.
- The rig remains attached to the perspective camera and renders above world depth, preventing terrain or nearby cover from hiding the weapon.
- Barrel, shroud, and receiver retain the authoritative `soldierVisualData(...).weaponColor` used by the soldier card and battlefield model.
- Weapon length scaling, walking sway, and recoil remain presentation-only. Unarmed soldiers still show no firearm.

SCI-FI SOLDIER VISOR HUD
------------------------
- First-person observation now projects tactical brackets for visible hostile targets, priority VIPs, civilians, squadmates, a revealed active Alien Field Beacon, and known Skyranger extraction ramps.
- Each bracket has a role label, color-coded outline, and approximate hex distance.
- The HUD uses the same tactical visibility authorization as the battlefield renderer. A hidden alien, unrevealed civilian, or unseen beacon is not added merely because First Person is active.
- The viewed soldier is omitted from the overlay.
- Brackets are projected from world space every first-person render frame and naturally track smooth camera movement, turns, and unit motion.
- The overlay is observer information only. It does not select targets, issue orders, change AI priorities, or provide line-of-sight through cover.

TRADITIONAL / REGIONALLY READABLE BUILDINGS
--------------------------------------------
- The six existing regional environment profiles now select matching architectural presentation kits:
  - tropical veranda architecture,
  - arid adobe courtyard architecture,
  - Mediterranean stucco and tile architecture,
  - temperate brick-and-timber architecture,
  - boreal timber architecture,
  - tundra/alpine stone-and-timber architecture.
- Structural wall cells retain their exact gameplay footprint but now add recognizable foundations, facade palettes, eaves or parapets, roofline trim, vertical posts, framed windows, sills, shutters, and climate-appropriate awnings.
- Windows remain the same ballistic/visibility objects and retain their intact or shattered state.
- No decorative door is placed on a blocked wall cell, avoiding misleading false entrances.
- Existing authored doorway gaps, wall continuity, breach rubble, building interiors, cover values, destruction, pathfinding, and line-of-sight remain authoritative and unchanged.

BUILD HEALTH / VALIDATION
-------------------------
- Added a release contract requiring the camera-relative sky seam, complete persistent first-person weapon geometry, visibility-gated entity HUD, six architecture styles, and regional facade details.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- A targeted HUD fixture confirmed visible hostile, VIP, civilian, objective, and extraction entries while rejecting a revealed-but-currently-unseen alien.
- Static validation confirms the persistent geometry cache includes all weapon-rig parts and that the sky sync occurs before rendering.
- Headless Chromium could not produce a page DOM in this execution environment, so full live WebGL/React validation remains a manual gate.
- Save format remains 4. No external assets changed; players with the Browser 0043+ assets folder can replace only `index.html`.

MANUAL TEST GATES
-----------------
1. Enter a 3D tactical mission during daylight, enable AI First Person, and cross a large portion of the map. Confirm the sun remains a distant small disc and never becomes a large yellow dome.
2. Repeat at night and confirm the moon/stars remain fixed at atmospheric distance while the camera moves.
3. Observe an armed ballistic, laser, and plasma soldier. Confirm a barrel/receiver/grip are visible and match the weapon color on the soldier card.
4. Confirm the visor HUD brackets only contacts the squad can currently see, plus known squadmates/extraction. Move an alien behind opaque cover and confirm its hostile bracket disappears with tactical visibility.
5. Confirm VIP, civilian, revealed beacon, and extraction markers use distinct colors and track correctly while the observed soldier moves and turns.
6. Compare tropical, arid, Mediterranean, temperate, boreal, and tundra missions. Confirm buildings read as deliberate architecture rather than featureless slabs, especially from ground level.
7. Shoot through and shatter a window, breach a wall, and enter a doorway. Confirm all prior structural gameplay behavior remains unchanged.
8. Run Build Health and confirm the new FPV sky/HUD/weapon/architecture contract reports OK.

PREVIOUS BUILD - 2210
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2210_FIRST_PERSON_CAMERA_SKY_WEAPON_AND_REGIONAL_BIOME_POLISH_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Polished AI soldier-eye observation so discrete tactical hex movement reads as smooth first-person motion, added a camera-space weapon barrel that uses the same equipped-weapon color as the soldier card and battlefield model, introduced mission-location day/night skies, and expanded regional terrain/flora presentation across tropical, arid, Mediterranean, temperate, boreal, and tundra/alpine environments.

FIRST-PERSON CAMERA STABILIZATION
---------------------------------
- The observer camera no longer snaps directly to each newly committed tactical hex and facing.
- Eye position eases toward the soldier's authoritative world position while viewing direction uses a slightly softer interpolation, keeping movement responsive without abrupt turns.
- Acting-soldier changes snap to the new soldier rather than flying the camera across the battlefield between units.
- Movement uses restrained, bounded head bob and lateral sway. Idle breathing motion is deliberately minimal.
- Shots add a short controlled recoil response without changing aim, ballistics, damage, playback timing, or AI decisions.
- First-person rendering runs at the normal animation-frame cadence while active instead of using the slower tracker/victory-animation refresh interval.
- Isometric rendering, fog, terrain caches, unit nodes, and tactical simulation still use the same persistent Three.js runtime.

FIRST-PERSON WEAPON PRESENTATION
--------------------------------
- A compact camera-space weapon rig is shown in the lower-right portion of the first-person view.
- Barrel and shroud color come from `soldierVisualData(...).weaponColor`, the same source used by the soldier card and Three.js soldier model.
- Ballistic weapons remain dark gunmetal, laser weapons use the established blue/cyan treatment, and plasma weapons use the established green treatment.
- Basic length/scale differences distinguish carbines, sniper weapons, and heavier weapons while retaining a low-obstruction silhouette.
- The rig follows camera sway and recoil, updates when the acting soldier changes, and remains hidden for unarmed soldiers.
- The first-person HUD now identifies the viewed soldier and equipped weapon.

LOCATION-AWARE TACTICAL SKY
----------------------------
- Tactical atmosphere reads the mission's stored `tacticalClock` and geographic `location`.
- Local solar state selects daylight, twilight, or night presentation.
- The sky uses a procedural horizon-to-zenith gradient rather than an external image asset.
- Twilight receives a warmer horizon; night adds deterministic stars and a moon; daylight/twilight place a sun-like celestial disc according to local solar time.
- Hemisphere, key, rim, fog color, and fog distance are adjusted to the presentation phase.
- The atmosphere is available in first person and remains compatible with the isometric view.
- Sky and lighting are presentation only. Tactical visibility range, line of sight, fog-of-war discovery, AI knowledge, and weapon accuracy are unchanged.

REGIONAL TERRAIN AND FLORA VARIETY
-----------------------------------
- Mission coordinates and campaign region select one of six broad environmental profiles: tropical rainforest, arid scrubland, Mediterranean scrub, temperate woodland, boreal forest, or tundra/alpine ground.
- Open-ground labels and palettes adapt by profile, including rainforest floors, humid earth, desert scrub, acacia woodland, conifer forest, frost-paled ground, and regional stone tones.
- Three.js trees vary in canopy proportions and color: broad tropical crowns, flattened acacia forms, olive-like Mediterranean forms, tall conifers, and sparse alpine trees.
- Bushes, brush, crops, trunks, and rocks use matching regional palettes and modest deterministic shape variation.
- Small bounded cosmetic flora/stone batches add ground-level detail without occupying cells or becoming tactical cover.
- Cosmetic scatter uses a bounded deterministic sampling pass rather than scanning or creating detail on every map cell.
- Existing hard/soft cover records remain authoritative. Regional presentation does not add movement blockers, cover bonuses, line-of-sight blockers, or destructible objects.

GAMEPLAY / COMPATIBILITY
------------------------
- AI orders, movement paths, Time Units, fire-team formation, escort behavior, reaction fire, damage, reinforcement logic, victory handling, and mission results are unchanged.
- Existing cached tactical battles and save-format-4 campaigns require no migration.
- No new external assets were added. The victory-music assets from Browser 0043/1930/2145 are unchanged, so players with an intact assets folder may replace only `index.html`.

BUILD HEALTH / VALIDATION
-------------------------
- Added a presentation contract covering tropical/arid/tundra classification, local atmosphere generation, eased first-person animation, high-cadence first-person rendering, weapon-color sourcing, procedural sky/stars, and bounded regional scatter.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Isolated helper validation confirmed tropical South America, arid Africa, tundra northern Europe, temperate mid-latitude East Asia, arid forest-to-acacia terrain conversion, and night atmosphere selection.
- Static release checks confirm synchronized build metadata, current patch history, both new patch flags, the first-person weapon rig, local sky, regional flora profiles, and unchanged save format 4.
- A full live WebGL mission remains the final manual validation gate.

MANUAL TEST GATES
-----------------
1. Start a 3D tactical mission, hand control to Simulation AI, enable First Person, and watch a soldier cross several hexes. Confirm the camera glides through each step without hard positional snaps.
2. Watch the soldier turn and fire. Confirm the turn is readable, recoil is brief, and the reticle remains usable.
3. Observe ballistic-, laser-, and plasma-equipped soldiers and confirm the visible barrel matches the weapon color shown on their soldier cards.
4. Launch missions at daytime, twilight, and nighttime campaign hours. Confirm the sky, horizon, stars/celestial object, fog tone, and light levels change without altering fog-of-war discovery.
5. Compare low-latitude South America/Africa, arid Africa or the Middle East, northern Europe, and ordinary temperate missions. Confirm terrain and flora differ while every tactical cover cell and route remains unchanged.
6. Toggle First Person off during movement and confirm the persistent isometric battlefield returns cleanly.
7. Run Build Health and confirm the first-person camera/weapon/sky/regional-biome contract reports OK.

PREVIOUS BUILD - 2145
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.2145_AI_FIRST_PERSON_OBSERVER_AND_TERMINAL_VICTORY_MUSIC_GATE_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added an optional soldier-eye camera for AI-controlled tactical-map playback and corrected a reinforcement-state race that could briefly declare victory and start victory music before a newly materialized Alien Field Beacon wave reached the live battlefield unit state. The first-person view reuses the persistent Three.js scene and authoritative AI action stream; the victory cue now waits for a fully committed terminal mission state.

AI SOLDIER FIRST-PERSON OBSERVER
--------------------------------
- During full Simulation AI map playback and the AI-controlled portion of Hybrid AI, the tactical toolbar exposes `First Person: Off / On`.
- Enabling the option remembers the player's current 2D/3D view, switches to the persistent Three.js battlefield, and follows the currently acting living AEGIS soldier from eye height.
- During an AEGIS movement or shot, the camera follows that soldier and looks along the soldier's facing or active firing direction.
- During an alien/civilian action, the observer holds the most recently followed living AEGIS soldier rather than granting an alien-eye view.
- The viewed soldier's own Three.js model is hidden only from that perspective, preventing helmet/body clipping. A restrained reticle and `EYES:` identifier show whose viewpoint is active.
- Turning the option off restores the prior tactical view. It also turns itself off and restores the prior view when map-based AI playback ends, or safely falls back to 2D if the renderer reports a failure.
- The perspective camera shares the existing renderer, scene, terrain, fog, cover, actors, effects, and action timing. It does not create a second tactical simulation or rebuild the battlefield.

TERMINAL VICTORY / REINFORCEMENT AUDIO GATE
--------------------------------------------
- Root cause of the reported false cue: Alien Field Beacon arrival code updated the reinforcement cache before React committed the generated alien units. During that short boundary, the mission could see `arrived=true` while the old unit array still contained zero living aliens.
- Every reinforcement arrival now records the exact generated alien IDs and marks `arrivalCommitPending=true`.
- The pending marker remains authoritative until all generated IDs appear in the live unit collection. Tactical terminal-state evaluation cannot declare victory during that boundary.
- Because the victory dance and direct-control victory cue derive from the same terminal state, neither can start before the wave is actually present.
- Direct tactical audio also contains a defensive reversible handoff: if a previously signaled victory becomes non-terminal, the victory player is stopped and its mission trigger is released.
- Simulation/Classic playback victory music now requires the actual final `Mission success` frame, a completed stream, no continuation state, and no pending reinforcement commit.
- Confirmed beacon destruction, mandatory rescue objectives, incomplete operations, withdrawals, failures, and all existing victory rules remain authoritative.

GAMEPLAY / COMPATIBILITY
------------------------
- First-person mode is an observer camera only. AI orders, Time Units, movement paths, formations, escorts, visibility rules, weapon fire, damage, reinforcement behavior, and mission results are unchanged.
- Team-authoritative fog and hidden-contact rules remain active; the camera does not reveal unrevealed aliens or unexplored battlefield state.
- The four Operation Vindicator victory MP3 files are unchanged from Browser 0043/1930. Players updating from Browser 1930 may keep their existing `assets` directory.
- Save format remains 4; existing campaigns and cached tactical battles require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- Added a terminal-victory regression that reproduces a reinforcement cache containing generated IDs before those IDs exist in the live unit array. Victory must remain false until the units are committed.
- Added a playback-audio regression requiring the final completed frame and rejecting an incomplete stream or a reinforcement commit boundary.
- Added an AI first-person observer contract covering human-only actor selection, last-soldier fallback, facing/shot camera direction, perspective-camera ownership, active-camera rendering, toolbar wiring, reticle, and reversible view cleanup.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Isolated tests confirm the reinforcement pending marker clears only after every generated ID is present, terminal victory remains blocked during the gap, final-frame victory audio remains allowed afterward, and first-person actor/facing selection is correct.
- Automated Chromium loading remains blocked by the execution environment's browser-administrator policy, so a complete live WebGL mission is retained as a manual test gate.

MANUAL TEST GATES
-----------------
1. Hand a 3D tactical mission to Simulation AI, toggle First Person on, and confirm the camera follows each acting AEGIS soldier during movement and firing.
2. Let an alien act and confirm the view remains with the last living AEGIS soldier rather than changing to an alien viewpoint.
3. Toggle First Person off and confirm the exact previous 2D/3D view returns. Repeat by allowing AI playback to end while First Person is still active.
4. Repeat during a Hybrid AI support handoff and confirm the view follows support soldiers, then exits when player leader control returns.
5. Trigger an Alien Field Beacon reinforcement as the apparent last alien is defeated. Confirm no victory music or victory dance begins before the arriving aliens are committed and visible under normal fog rules.
6. Defeat the actual final force and satisfy all beacon/rescue objectives; confirm one random Operation Vindicator cue begins exactly once.
7. Run Build Health and confirm the new first-person observer and terminal victory-music contracts report OK.

PREVIOUS BUILD - 1930
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.1930_TACTICAL_PATH_PARENT_POINTER_AND_BLOCKER_INDEX_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Optimized tactical route searches without changing movement rules or route choice. The main breadth-first pathfinder now indexes hard cover and living occupancy once per search, stores parent links instead of copying the complete route into every queued node, and reconstructs only the final winning path. Multi-destination beacon and rescue planners also reuse one blocker index across their candidate searches.

INDEXED BLOCKERS
----------------
- `tacticalPathBlockerIndex(...)` builds one hard-cover key set and one living-unit occupancy key set for a route-search context.
- Destroyed/soft cover remains passable, rescued units remain non-blocking, and the acting unit is excluded exactly as before.
- Each explored cell now performs constant-time blocker membership checks rather than scanning the full cover and unit arrays.
- `tacticalReachableCellSet(...)` uses the same indexed blocker doctrine.

PARENT-POINTER ROUTE RECONSTRUCTION
-----------------------------------
- The old breadth-first queue stored a full copied `path` array on every candidate node. Longer searches repeatedly allocated and copied every prior step.
- Each queued node now stores only coordinates, step count, and its parent queue index.
- Once the destination is found, the route is reconstructed backward through those parent indexes and reversed once.
- Neighbor order, visited-on-enqueue behavior, shortest-path selection, maximum-step handling, target blocking, and returned start-to-target coordinate shape remain unchanged.
- `tacticalPathDistance(...)` can return the discovered step count without reconstructing a coordinate array.

SHARED MULTI-DESTINATION INDEXES
--------------------------------
- Alien Field Beacon close-assault planning reuses one blocker index while comparing the six legal shield-entry cells.
- VIP/civilian rescue ingress planning reuses one blocker index while comparing multiple legal contact cells, doors, and breached approaches.
- This reduces repeated setup work in AI situations that intentionally compare several routes from the same unit and battlefield state.

VALIDATION
----------
- A deterministic Build Health contract verifies hard-cover indexing, living occupancy indexing, rescued-unit exclusion, route legality, path-distance agreement, parent-index storage, and removal of per-node path-array copying.
- An external randomized equivalence test compared 5,000 generated maps against the previous pathfinder and produced identical routes or identical null results in every case.
- In an isolated 96 x 96 long-route Node benchmark, 30 identical searches fell from roughly 855 ms with copied route arrays to roughly 255 ms with indexed blockers and parent indexes. Browser gains will vary by battlefield and hardware.
- All non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; existing campaigns and cached tactical states require no migration.

MANUAL TEST GATES
-----------------
1. Move a soldier around hard cover in 2D and Three.js views and confirm the preview and completed route match prior behavior.
2. Run Hybrid AI and full Simulation AI through buildings, narrow doors, friendly traffic, and long formation catch-up routes.
3. Run a VIP rescue with an occupied doorway and confirm the leader still chooses a legal interior contact route while supports remain formation traffic.
4. Assault a confirmed shielded Alien Field Beacon and confirm the team can compare and select reachable entry cells without changing shield or formation rules.
5. Confirm TU cost, reserved-fire allowance, occupancy, extraction, fog, reaction fire, and movement animation remain unchanged.
6. Run Build Health and confirm “Tactical pathfinding uses indexed blockers and parent-pointer reconstruction” reports OK.

PREVIOUS BUILD - 0043
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.16.0043_RANDOM_MISSION_VICTORY_MUSIC_AUDIO_ASSET_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Added a four-track mission-victory music bank using the supplied Operation Vindicator recordings. When a tactical mission reaches an authoritative successful outcome, one track is randomly selected and plays while surviving soldiers celebrate on the final battlefield.

RANDOM SUCCESS MUSIC
--------------------
- Packaged all four supplied MP3 files under `assets/audio/victory/`.
- A successful direct-control, Hybrid AI, Simulation AI, or Classic Lineup mission selects one Operation Vindicator track at random.
- The selector avoids immediately repeating the last successfully played track whenever another track is available.
- The cue triggers once for a mission even if the victory battlefield rerenders, switches between 2D and Three.js, or remains open after the song ends.
- Mission failure, withdrawal, objective failure, incomplete operations, and unresolved AI safety handoffs do not trigger victory music.

MUSIC HANDOFF
-------------
- The active mission-threat score pauses when the victory cue starts.
- Victory music follows the existing Music On / Off setting and master music volume.
- Changing the music mode manually remains an explicit player override.
- Leaving the completed mission stops the victory cue immediately; the normal Geoscape/command music system then resumes through its existing context routing.
- The four tracks are external packaged assets rather than base64 strings, avoiding a large increase to `index.html` parse and startup cost.

BUILD HEALTH / VALIDATION
-------------------------
- Added a regression contract requiring four unique victory assets, randomized no-immediate-repeat selection, successful-mission wiring in `TacticalMission`, and successful terminal-frame wiring in Simulation/Classic playback.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- All four MP3 assets decode as stereo 44.1 kHz audio and are approximately 60.0 seconds long.
- Save format remains 4; existing campaigns require no migration.

MANUAL TEST GATES
-----------------
1. Complete a direct-control 3D Iso mission and confirm one Operation Vindicator cue starts once when Tactical Victory appears.
2. Switch between 3D Iso and 2D Hex while the victory screen remains open and confirm the cue does not restart.
3. End the incident before the cue finishes and confirm it stops immediately as the Skyranger return begins.
4. Complete several successful missions and confirm the selected cue varies without immediately repeating when alternatives exist.
5. Complete or withdraw from a failed mission and confirm no victory cue plays.
6. Test Simulation AI and Classic Lineup victories and confirm the cue begins on the authoritative `Mission success` frame.
7. Turn Music Off before victory and confirm the victory cue remains silent; turn music back on for a later mission and confirm normal operation.

PREVIOUS BUILD - 2207
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.2207_COOPERATIVE_MISSION_AFTERMATH_AND_DIRECT_FINALIZER_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Further optimized the tactical mission ending and return-to-base debrief after Browser 2024 removed the hidden second battle simulation. The manual exit path now constructs its result directly from the live battlefield instead of entering the shared tactical resolver at all, and the campaign aftermath is processed cooperatively in short chunks so Chromium can repaint and service input between expensive stages.

DIRECT LIVE-BATTLE FINALIZER
----------------------------
- `End Incident and Return to Base`, loss confirmation, and manual withdrawal no longer construct a tactical continuation snapshot after the visible battle has ended.
- The manual finish path no longer calls `resolveMission(...)`, even in `finalizeOnly` mode.
- Growth, XP, kill credit, wound/KIA state, tactical medical status, stat-up rolls, civilian outcome, and round count are derived directly from the authoritative live tactical units.
- This avoids the resolver's remaining simulation-oriented setup work such as tactical visibility recomputation, unit visibility snapshots, playback-frame construction, continuation-state packaging, and other state preparation that is unnecessary after a completed player battle.
- The shared resolver and its `finalizeOnly` compatibility seam remain available for other code paths; this patch only removes that overhead from the already-completed manual battlefield exit.

COOPERATIVE RETURN-TO-BASE AFTERMATH
------------------------------------
- `finishMission(...)` is now a cooperative asynchronous debrief pipeline rather than one uninterrupted JavaScript task.
- Large roster updates are applied through bounded 12-soldier chunks with an event-loop yield between chunks.
- Friendship aftermath, KIA memorial processing, soldier-state commit, reports, recovery, and Geoscape-time advancement receive separate yield boundaries so the browser can render between major stages.
- KIA memorial-offering generation is processed in smaller chunks, preventing the large memorial-message library from monopolizing the entire mission-return transition when several soldiers are lost.
- Mission growth is indexed by soldier ID once and reused through roster and squad-wipe checks instead of repeatedly scanning the result-growth array.

SAVE / CONSISTENCY SAFETY
-------------------------
- A mission-aftermath in-progress guard prevents the same debrief from being started twice.
- Rotating autosave is suspended while the cooperative aftermath is only partially applied.
- Manual save is temporarily blocked during that short debrief window so no save slot can capture an in-between campaign state.
- The guard clears when the debrief completes or if the debrief throws an error.
- Save format remains 4; existing campaigns require no migration.

BUILD HEALTH / VALIDATION
-------------------------
- Build Health now requires the manual tactical path to use `tacticalFinalizeLiveBattleResult(...)` and rejects reintroduction of `finalizeOnly:true` or a `finalBattleState` continuation snapshot in the tactical finish function.
- The same contract requires cooperative roster mapping, explicit event-loop yields, and the autosave in-progress guard.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Current build metadata and in-game patch history are synchronized to Browser 2207.

MANUAL TEST GATES
-----------------
1. Win a 3D Iso mission, leave the soldiers dancing briefly, then click End Incident and Return to Base. Confirm the Skyranger return transition begins without a long frozen pause.
2. Let the Skyranger reach base and confirm the debrief/report transition remains responsive instead of producing a browser "page not responding" warning.
3. Repeat with wounded soldiers and at least one KIA to exercise the heavier memorial/recovery path.
4. Confirm XP, career kills, wounds/KIA, recovered gear/materials, rescue totals, reward, panic, mission report, and squad removal still match the played battle.
5. Try saving during the brief debrief-processing window and confirm the game refuses the save rather than writing a partial campaign state.
6. Repeat a 2D mission and a Hybrid AI mission that returns to manual control before victory.

PREVIOUS BUILD - 2024
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.2024_MANUAL_TACTICAL_EXIT_FAST_PATH_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Optimized the manual tactical mission exit transition. Ending a played battle no longer launches a second hidden multi-round AI simulation before the Skyranger return handoff. The game now snapshots the live battlefield and runs only the established result-finalization formulas, preserving the actual battle outcome while making the exit click substantially lighter.

MANUAL TACTICAL EXIT FAST PATH
------------------------------
- `End Incident and Return to Base`, loss confirmation, and manual withdrawal now snapshot the current tactical units, cover, rescue state, Alien Field Beacon state, reinforcement state, explored cells, round, and Skyranger deployment.
- `resolveMission(...)` gained a `finalizeOnly` path. It reuses the existing XP, wounds, KIA, stat-up, civilian, beacon, result-log, recovery, and campaign aftermath formulas but skips the combat simulation loop completely.
- The previous manual exit path invoked `resolveMission(...)` from a fresh deployment. That could spend time resolving up to dozens of hidden AI rounds after the visible battle had already ended.
- The new path does not create an extra tactical round, does not move units, does not fire hidden shots, and does not regenerate the battlefield.
- Full Simulation AI and Hybrid AI results that already own an authoritative resolved result continue to use their existing result handoff.

LIVE KILL ACCOUNTING
--------------------
- Manual direct-fire kills now increment the acting soldier's mission kill counter.
- Frag Grenade multi-kills add the exact number of aliens eliminated to the thrower's mission kill counter.
- Manual reaction-fire kills increment the reacting soldier's counter.
- AI/Hybrid playback snapshots now retain the `kills` value so command handoffs do not erase previously earned kills before a later manual mission exit.
- Mission XP and career kill totals therefore use the played battle's retained kill count rather than a hidden post-battle re-simulation.

BUILD HEALTH / VALIDATION
-------------------------
- Added a Build Health contract requiring the manual finish path to create a live-state continuation snapshot, request `finalizeOnly:true`, and gate the resolver's combat loop behind `!finalizeOnly`.
- The contract also checks direct-fire and grenade kill-accounting seams.
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Save format remains 4; no migration is required.

MANUAL TEST GATES
-----------------
1. Complete a 3D Iso tactical victory and click End Incident and Return to Base; confirm the Geoscape/Skyranger return transition begins promptly.
2. Repeat after a 2D manual victory.
3. Confirm wounded/KIA soldiers, rescue totals, beacon status, recovered materials, rewards, panic, and mission report still match the battle.
4. Confirm soldiers receive career kills for manual rifle kills, grenade multi-kills, and reaction-fire kills.
5. Test a manual withdrawal/failed mission and confirm no extra hidden combat occurs before return.

PREVIOUS BUILD - 1650
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1650_ALL_TACTICAL_VICTORY_DANCE_RESTORE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Restored the soldier victory celebration across successful tactical mission outcomes. The persistent Three.js renderer was starting its victory animation loop but not invalidating the actor layer when the victory flag changed, so existing soldier nodes never received the dance state. 2D and playback celebrations remain active, and the shared success rule is now future-safe for victory objectives that may not require every alien to be dead.

ALL-SUCCESS VICTORY CELEBRATION
-------------------------------
- Every surviving AEGIS soldier celebrates while a successfully completed tactical battlefield remains open for review.
- Direct-control, Hybrid AI, full Simulation AI, Classic Lineup, 2D Hex, tactical-map playback, and Three.js Iso all retain their existing presentation paths but share the same successful-outcome doctrine.
- KIA soldiers remain fallen and do not animate. Mission failures, withdrawals, objective failures, incomplete operations, and unresolved AI handoffs do not trigger celebration.
- Playback victory detection now keys off the authoritative `Mission success` terminal frame instead of additionally requiring `alienAlive === 0`. This preserves celebrations for future objective-driven victories that can legitimately end with hostiles still present.

PERSISTENT THREE.JS REGRESSION FIX
----------------------------------
- Root cause: Browser 1342 made the Three.js scene persistent and separated actor updates from animation state. `victoryDance` correctly restarted the animation loop, but the actor invalidation key only tracked unit state. When victory arrived without a unit-state change, `tacticalThreePersistentUpdateUnits(...)` did not run and every existing soldier node kept `victoryDance=false`.
- The persistent actor key now includes the victory-dance state. A victory transition updates the existing nodes in place, marks only living human soldiers to celebrate, and retains the same renderer, scene, terrain, cover, fog, and actor objects.
- Returning from celebration or disposing the battlefield still restores normal standing/fallen poses through the existing explicit living-state logic from Browser 1645.

BUILD HEALTH
------------
- Strengthened the all-battle-views victory contract to verify direct 2D/3D wiring, Simulation/Classic playback, living-vs-fallen behavior, failure exclusion, and persistent actor invalidation when only the victory flag changes.
- Added a future-facing success fixture whose terminal frame is `Mission success` even with a nonzero alien count; surviving soldiers still celebrate because success, not elimination count, is authoritative.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1645
=====================

PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.15.1645_THREEJS_LIVING_UNIT_POSE_HOTFIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Corrected an intermittent persistent-3D pose bug that could make every soldier, civilian, and alien begin a mission lying prone despite being alive. The 1615 2D cell-index optimization remains active.

LIVING UNIT POSE HOTFIX
-----------------------
- VIP tracker animation exposed the bug because it keeps the persistent renderer animation loop active.
- The loop previously searched a composite visual signature for `:0:` as a shorthand for death. Ordinary living-unit fields such as not panicked also contain that token.
- Every 3D unit node now stores an explicit living-state property. Animation and animation shutdown use only that property to choose standing or fallen rotation.
- Fallen units remain prone, while living soldiers, civilians, and aliens remain upright during tracker pulses and other continuous animations.

2D CELL RENDER INDEXES
----------------------
- Living/visible-state unit occupancy is indexed once per unit-state update while preserving fallen-human and resolved-battle display rules.
- Active cover is indexed once per cover update; destroyed cover is excluded exactly as before.
- Ground-level equipment is grouped by cell once per inventory change rather than filtered for every rendered hex.
- The current movement path is indexed by cell and retains the first step number when a path revisits a hex.
- Each rendered cell constructs its coordinate key once and reuses it for visibility, exploration, tracker, beacon-shield, item, movement, and React-key lookups.
- The optimization changes presentation lookup cost only; tactical movement, formation following, fog, line of sight, targeting, and mission resolution are unchanged.

VISIBILITY AND TERRAIN CACHES
-----------------------------
- Procedural 2D terrain cells are generated once per mission/cell and reused during later renders.
- Sight-blocking cover is indexed once per cover-state signature, including wall, window, breach, HP, blocking, and shattered-window state.
- Each living human observer has a bounded visibility entry keyed by mission, grid size, position, facing, and current cover signature.
- Alien or civilian movement reuses every soldier visibility entry. Moving one soldier misses only that observer entry while the remaining fire team stays cached.
- Bounded mission, context, and observer cache sizes prevent long campaigns from growing memory without limit.

AI-CONTROLLED FOG-OF-WAR FIX
----------------------------
- The supplied Sunken Relay save exposed a presentation mismatch: full-AI playback suppressed every 3D ground-fog instance even though unit and cover discovery still followed soldier vision.
- `aiMapPlayback` no longer reveals the complete ground. Unseen cells use the strong fog batch, explored cells use the lighter batch, and visible cells remain clear in manual, Hybrid AI, and full-AI control.
- Only a resolved tactical battle may reveal the complete ground for the final battlefield view.

PERSISTENT THREE.JS TACTICAL RUNTIME
------------------------------------
- Entering a 3D tactical mission creates one renderer and scene runtime. It is disposed when the mission view ends, the mission changes, or the player changes the 3D quality setting.
- The complete tactical grid is built once with instanced ground and seam geometry. Changing the viewed area, selecting a soldier, or following an action moves the camera without reconstructing terrain.
- Fog uses two reusable instanced batches for unseen and explored cells. Visibility changes update their matrices and counts rather than creating thousands of new meshes.
- Static cover and Skyranger geometry live in their own scene layer and rebuild only when their source state changes. Cover changes also invalidate visibility so a newly opened breach cannot leave stale fog behind.
- Human, alien, and civilian models are indexed by unit ID. Movement mutates each existing node's position, and facing rotates only the weapon/direction pieces. Visual-signature changes such as death, equipment, panic, or escort status replace only that unit node.
- Selection rings, VIP trackers, movement/shot effects, camera framing, and animation state each have bounded update paths instead of sharing a single full-scene rebuild effect.

VALIDATION
----------
- Added a regression contract proving that a living unit whose signature contains unrelated zero-valued fields remains upright while a fallen unit remains prone.
- Added a deterministic contract covering living and fallen unit rules, destroyed cover exclusion, floor-level item grouping, and repeated movement-path cells.
- The 2D render-source check requires all four memoized indexes to be wired into the visible-cell loop.
- Added a focused cache contract proving that unrelated alien movement reuses every soldier sight result, while moving one soldier recalculates only that observer.
- The contract also verifies deterministic terrain reuse, shared cover-context reuse, and bounded cache behavior. JavaScript syntax and the static release checker pass for build 1445.
- Added Build Health contracts for persistent scene ownership, cached terrain, stable unit nodes, cleanup, and layer-specific invalidation.
- Static JavaScript syntax validation passes.
- Live browser validation launched a 64 x 64 tactical mission, switched into 3D Iso, selected another soldier, and completed a turn update while retaining the same renderer identity (`tactical-three-1`) with exactly one live 3D root and no runtime-error overlay.
- The full diagnostic suite remains at the prior build's established baseline; the new persistence-specific check passes.
- Save format remains 4. Existing campaigns and cached tactical battle state require no migration.

PREVIOUS BUILD - 1615
=====================

Build: v0.26.08.15.1615_TACTICAL_2D_CELL_RENDER_INDEX_PATCH
Save format: 4 (unchanged)

Added memoized 2D cell indexes for units, cover, floor equipment, and movement paths.

PREVIOUS BUILD - 1445
=====================

Build: v0.26.08.15.1445_TACTICAL_VISIBILITY_AND_STATIC_TERRAIN_CACHE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Added deterministic terrain, reusable cover-context, and per-observer tactical visibility caches.

PREVIOUS BUILD - 1430
=====================

Build: v0.26.08.15.1430_PERSISTENT_THREE_TACTICAL_RENDERER_AND_AI_FOG_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Restored unexplored and explored 3D fog shading during full-AI tactical control while retaining the persistent renderer.

PREVIOUS BUILD - 1342
=====================

Build: v0.26.08.15.1342_PERSISTENT_THREE_TACTICAL_RENDERER_INDEX_ONLY_PATCH
Save format: 4 (unchanged)

Introduced the persistent Three.js tactical renderer, stable actor nodes, instanced terrain/fog, and layer-specific invalidation. Full-AI ground fog was corrected in the following 1430 build.

PREVIOUS BUILD - 1208
=====================

Build: v0.26.08.15.1208_DEFERRED_BUILD_HEALTH_AND_STABLE_GEOCLOCK_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Reduced boot work and corrected the Geoscape clock lifecycle. Startup now runs only a tiny critical smoke test covering the game root, React runtime, and build/save metadata. The complete Build Health suite is cached but not executed until the player opens Build Health. The Geoscape clock now keeps one interval across ordinary campaign and UFO updates while a live callback reference supplies current simulation state.

DEFERRED BUILD HEALTH
---------------------
- The full diagnostic suite no longer runs from the app component's boot-time memo. The memo receives a shared four-check boot result without constructing battlefields, visibility contexts, path searches, tactical fixtures, or the rest of the full suite.
- Selecting any Build Health button opens the diagnostics panel immediately and schedules the full suite through requestIdleCallback, with a short timer fallback for browsers that do not implement the idle API.
- The completed result array is cached for the session. Reopening Build Health does not repeat the full suite.
- Full-suite exceptions are caught and displayed as a failed diagnostic instead of escaping into the startup path.
- The critical boot smoke remains synchronous and deliberately small: root element, React runtime, and build/save metadata only.

STABLE GEOSCAPE CLOCK LIFECYCLE
--------------------------------
- The Geoscape timer now depends only on whether the clock is running, its selected speed, the active app screen, and game-over state.
- Month, day, minute, mission, playback, council, UFO, and radar updates no longer tear down and recreate the interval on every simulation tick.
- A render-updated callback ref gives each interval tick the latest campaign closure, avoiding stale state without adding volatile effect dependencies.
- Pausing, changing speed, leaving the game screen, or reaching game over still tears the timer down normally.

BUILD HEALTH
------------
- Browser validation confirms the start screen appears while the full-suite status remains deferred, Build Health first displays the four boot checks, and the complete suite then replaces them after the idle run.
- The full suite now reports dedicated passing contracts for deferred execution and stable Geoscape interval ownership. A live 5-minute clock run advanced from 08:00 to 08:10 without a runtime error.
- Static release checks require the new patch flags, deferred runner/cache/listener, live Geoscape callback ref, bounded timer dependencies, current metadata, and unchanged save format.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 2112
=====================

Build: v0.26.08.14.2112_HYBRID_OPENING_ESCORT_SUPPORT_FOLLOW_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed Hybrid AI support soldiers being suppressed by the escort/rescue system during the opening support handoff. When a player-controlled fire-team leader is holding position with a VIP or civilian, only the leader remains committed to the escort action; supports spend their own TU moving toward the current formation cells. Long catch-up moves may complete their second movement checkpoint instead of being reduced to a single hex while the support remains outside normal cohesion.

OPENING HYBRID ESCORT FOLLOW FIX
--------------------------------
- Hybrid AI marks the player-controlled leader as a fixed escort lead during the support handoff. The rescue planner no longer treats the entire fire team as already committed merely because the held leader has zero TU.
- Supporting soldiers remain eligible for the normal hybrid movement pass and calculate their positions around the leader and escorted civilian/VIP column.
- Stay on Escort keeps supports on escort-relative formation cells even when aliens are visible. Break Off and Engage retains enemy-relative flank behavior.
- The leader does not move a second time under rescue AI after the player has positioned them.
- Formation catch-up extensions may continue when each additional leg makes progress toward the held leader.

PREVIOUS BUILD - 1728
=====================

Build: v0.26.08.14.1728_HYBRID_ESCORT_PROMPT_MODE_PRESERVATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed the escort-contact decision in Hybrid AI Command. Applying Stay on Escort or Break Off and Engage now replans the remaining support action as a bounded Hybrid AI round, keeps fire-team leads under player control, and returns to the next Hybrid AI leader phase instead of silently handing the entire mission to full Simulation AI.

HYBRID ESCORT DECISION MODE PRESERVATION
----------------------------------------
- Applying an escort-contact decision now detects whether it interrupted a normal Simulation AI stream or a one-round Hybrid AI support handoff from the active playback marker.
- In Hybrid AI, Apply Escort Decisions cancels only the stale pre-decision playback plan, applies the selected team assignments to the live battlefield, and rebuilds one bounded hybrid support round from that position.
- The rebuilt playback retains the Hybrid AI round marker, holds player-controlled fire-team leads in place, and uses the chosen stay/break-off duties for support movement and engagement.
- When that support round ends, the normal Hybrid AI completion path refreshes TU and returns selection to a living fire-team lead. It does not continue simulating future rounds or finish the mission under full AI control.
- Normal full Simulation AI escort prompts retain their prior continuation behavior. The fix changes only prompts raised during a Hybrid AI support round.
- If the hybrid replan cannot be prepared, the battlefield is restored to a fresh player-controlled Hybrid AI leader phase instead of falling through to full AI.

BUILD HEALTH
------------
- A deterministic regression checks explicit hybrid prompts, legacy prompts detected from a hybrid playback marker, and ordinary Simulation AI prompts.
- Static release checks require the patch flag, continuation-mode helper, hybrid restart path, bounded one-round settings, and Build Health result label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1712
=====================

Build: v0.26.08.14.1712_UFO_INTERCEPTION_BOARD_AND_HYBRID_SUPPORT_CATCH_UP_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Active UFOs now opens a centered, scrollable UFO Interception Board instead of expanding the contact cards at the bottom of the Geoscape. The board retains the complete radar, mission-risk, damage-memory, sortie-readiness, and one/pair/all-base interceptor controls. Hybrid support soldiers also use a full-TU formation catch-up when their selected shot reserve would otherwise leave them behind their moved fire-team lead.

UFO INTERCEPTION BOARD
----------------------
- The Active UFOs (count) button beside Open Incident List now opens a centered modal panel with a fixed header, close button, and independently scrollable contact list.
- Players no longer need to scroll below the globe and tracking panels to review a long list of UFOs.
- Each contact retains its UFO size or unresolved-echo label, region, flight progress, radar quality, threat, sortie summary, mission-risk estimate, last air-combat report, and remembered UFO damage.
- The existing 1 Interceptor, Pair, and All Bases launch actions operate directly from the board and keep their established readiness, detection, route, ferry-network, and active-travel safeguards.
- The panel is presentation-only: UFO movement, detection, air combat, time progression, and save data remain authoritative and unchanged.

FULL-TU HYBRID FORMATION CATCH-UP
---------------------------------
- A hybrid support compares the distance to its current leader-relative formation cell with the number of steps available after its AI-selected shot reserve.
- If that reserve is the only reason the support cannot reach formation during a no-contact handoff, the AI temporarily chooses Formation Catch-Up, releases the reserve, and may spend its full movement TU allowance.
- The catch-up uses the direct formation path and the normal two-leg reassessment playback, so a support may cover up to the full fifteen-step adaptive movement ceiling rather than stopping at an eight-step aimed-reserve allowance.
- A support does not discard its reserve for catch-up when an alien is observed. Enemy-relative flanking, legal fire, cover, cohesion, occupancy, escort, and extraction rules remain authoritative during contact.

BUILD HEALTH
------------
- A new Geoscape contract verifies the centered dialog, independent scroll region, radar-contact cards, and all three interceptor launch controls.
- A tactical regression compares the same distant support route with and without catch-up, confirming eight reserved steps become fifteen full-TU steps while visible contact preserves the original reserve.
- Static release checks require both patch flags, modal controls, scroll markers, catch-up planner, action label, and regression fixtures.
- Save format remains 4. Existing campaigns require no migration.

PREVIOUS BUILD - 1347
=====================

Build: v0.26.08.14.1347_HYBRID_AGGRESSIVE_FLANKING_AND_SUPPORT_MOVEMENT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Fixed hybrid AI support soldiers holding position when they should follow their leader. During alien contact, left and right supports now calculate aggressive firing flanks relative to the line between their fire-team lead and an actually observed alien. Outside contact, or when a safe flank cannot be reached, supports use a direct route toward their normal leader-relative formation slots.

HYBRID SUPPORT MOVEMENT FIX
---------------------------
- The previous handoff sent a desired formation cell through a general combat-position scorer as though that cell were an enemy. That scorer could prefer the soldier's starting hex, producing a complete support hold despite available TU.
- Formation following now uses a dedicated path to the exact open role cell selected by the established fire-team formation system. It spends only TU available after the AI's chosen reserve and retains normal occupancy, terrain, and bounded-route checks.
- A blocked exact role cell falls back to the reachable cell that makes the best progress toward it instead of silently abandoning the movement.

AGGRESSIVE ENEMY-RELATIVE FLANKS
--------------------------------
- When the fire team observes an alien, support movement is evaluated against that real alien rather than the formation marker.
- Left and right roles seek opposite lateral sides of the lead-to-alien line. Candidate positions favor line of sight, weapon range, useful forward pressure, nearby cover, low crowding, and cohesion within six hexes of the lead.
- The team's preferred alien remains first choice when it is alive and observed; otherwise the nearest currently observed alien becomes the flank reference.
- If no legal aggressive flank is available, the soldier safely returns to direct formation-follow movement. This keeps the standard fire-team formation as the fallback and does not give supports independent player orders.
- Fire-team leads remain under player control during the hybrid phase. Run Hybrid AI Turn still resolves one sequentially animated support-and-engagement round and then returns control with refreshed TU.

BUILD HEALTH
------------
- A deterministic regression fixture places left and right supports behind their lead, confirms both spend movement TU, and verifies that they choose opposite sides of an observed alien while remaining within fire-team cohesion.
- The fixture also verifies that direct formation fallback advances toward an exact role cell when no combat flank is being used.
- Static release checks require the new patch marker, combat-target selection, dedicated formation-follow planner, aggressive flank planner, resolver integration, and regression label.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1236
=====================

Build: v0.26.08.14.1236_HYBRID_LEADER_CONTROL_AND_COLLAPSIBLE_UFO_LIST_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Hybrid AI Command is now available directly from the main tactical toolbar in both the 2D and Three.js isometric battle views. While active, the player cycles through fire-team leads, moves them using the normal TU and reserve system, and may fire at an alien to establish the team's preferred target. Ending the turn hands supporting-soldier formation movement and alien engagement to the AI for one animated round, then returns leader control. The Geoscape's long active-UFO card list is now collapsed by default behind an Active UFOs button beside Open Incident List.

BATTLE-SCREEN HYBRID AI COMMAND
-------------------------------
- A Hybrid AI: On / Off button is part of the shared tactical toolbar, so it remains available in both 2D Map and Three.js ISO views.
- Enabling it changes Prev Soldier and Next Soldier into Prev Fire Team and Next Fire Team. The buttons select one living lead per fire team rather than cycling supporting soldiers.
- Clicking a supporting soldier while hybrid command is active selects that soldier's fire-team lead. This prevents accidental independent support routes.
- The selected lead keeps the normal movement preview, reachable-cell range, TU cost, reserved-shot allowance, kneeling, inventory, firing, and targeting controls.
- Normal manual battle control is restored immediately when Hybrid AI is switched off during an idle player phase.

ONE-ROUND AI SUPPORT HANDOFF
----------------------------
- Run Hybrid AI Turn holds every lead at the position chosen by the player and gives supporting soldiers an in-place formation order around that lead.
- The established formation, occupancy, cohesion, escort, rescue, and movement-safety rules remain authoritative; hybrid mode does not create a second movement system.
- AI chooses support routes, remaining movement, kneeling, legal fire mode, and end-of-movement engagement. Its paths, movement, shots, and impacts use the sequential tactical playback introduced in build 1142.
- If a lead fired at an alien during the player phase, that alien becomes the team's preferred handoff target. A dead, hidden, blocked, or out-of-range preferred target falls back to another legal visible alien.
- Only one AI-controlled tactical round is resolved. Leads are marked finished during that handoff so the AI cannot spend their leftover player-phase TU a second time. When playback finishes, temporary in-place orders clear, the tactical round advances, every surviving soldier receives the normal fresh-turn TU allocation, and control returns to the first living fire-team lead.
- Existing command-map orders, rescue responsibilities, and campaign save format remain compatible.

COLLAPSIBLE ACTIVE UFO LIST
---------------------------
- The Geoscape interface places Active UFOs (count) directly beside Open Incident List.
- Active UFO cards and the no-contacts message are hidden by default, preventing the tracking panel from growing into a long always-visible list.
- Opening the button reveals the same authoritative UFO cards and controls. Hide Active UFOs collapses them again without changing tracking, interception, radar detection, travel, or time progression.

BUILD HEALTH
------------
- A new regression fixture verifies leader-only cycling, shared in-place formation orders, preferred-target propagation, order cleanup, the one-round AI handoff markers, and both battle-toolbar labels.
- Static release checks require the two patch flags, hybrid helpers, main battle-screen toggle, fire-team navigation labels, one-round handoff control, and Geoscape UFO-list toggle.
- Save format remains 4. Existing campaigns and cached tactical battles require no migration.

PREVIOUS BUILD - 1142
=====================

Build: v0.26.08.14.1142_HYBRID_FIRETEAM_PLAYBACK_HELMETS_AND_TRANSFER_CONFIRMATION_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
AI tactical playback now isolates movement to the unit whose action and route are being shown, removing out-of-order walks and position snap-backs. The Tactical Command Map is now a hybrid fire-team control layer: players command each leader's waypoint and may choose a preferred alien, while the AI retains TU-reserve, movement-execution, shot-mode, kneeling, and fallback-target decisions. Supporting soldiers continue using the established formation system. Three.js soldiers now wear small armor-matched tactical helmets. Barracks soldier cards hide destinations behind a Transfer button and require a detailed confirmation screen before a troop transfer begins.

ORDERED AI MOVEMENT PRESENTATION
--------------------------------
- Sequential playback frames now record the exact IDs allowed to move during each action.
- Combat damage may update a target's HP and state without borrowing that target's later position from the end-of-phase snapshot.
- Only the acting soldier and any civilian actually following that soldier animate during the route display. Other soldiers wait for their own action frame.
- Impact and phase-completion frames cannot replay leftover movement, eliminating the unmarked walk-and-snap-back sequence.
- Timing estimates use the same per-frame movement set as the renderer, so audio, paths, movement, shots, and impacts stay ordered.

HYBRID FIRE-TEAM COMMAND
------------------------
- The Tactical Command Map is now labeled Hybrid Fire-Team Command.
- The player chooses a fire team, an optional preferred visible alien, and a waypoint for that team's leader.
- The AI still determines its TU reserve, snap/aimed/burst behavior, kneeling, route execution, post-move reassessment, and whether it has a valid shot.
- Supporting soldiers do not receive independent player routes. They continue deriving their positions from the existing leader-relative formation, pace, occupancy, and cohesion rules.
- After movement, every team member prefers the designated alien when it is alive, visible, in range, and in line of sight. If it dies or cannot be seen, the soldier may engage another visible alien.
- Arriving at the waypoint changes the order into a formation hold instead of silently discarding it. The player may clear or replace the order from the map.
- Rescue/escort responsibilities and hard tactical safety rules remain authoritative; a blocked command still clears after bounded failed progress rather than deadlocking the battle.

THREE.JS TACTICAL HELMETS
-------------------------
- Every living or fallen Three.js AEGIS soldier model receives a small tactical helmet shell and brim.
- Helmet material comes from the same armor-color value used by that soldier's equipped armor, so Field Suits, Ceramic Armor, Psi Weave, and future palette variants remain visually consistent.
- Helmets are presentation-only and do not alter armor protection, visibility, hit chance, movement, TU, or save data.

BARRACKS TRANSFER CONFIRMATION
------------------------------
- Destination buttons are no longer permanently expanded on every soldier card.
- A Transfer button reveals the valid destination-base list for only that card.
- Choosing a destination opens a confirmation screen showing soldier name, origin, destination, travel time, logistics fee, squad-duty removal, availability during transit, and the no-refund cancellation rule.
- Confirm Transfer is disabled when campaign funds cannot cover the fee. Back closes the confirmation without moving the soldier or charging funds.
- The existing authoritative transfer function still performs the final fund deduction, squad removal, transit record, ETA, and arrival behavior only after confirmation.

BUILD HEALTH
------------
- Sequential playback regression covers a second soldier who moves later but is also updated by an earlier combat action; that soldier must retain the old position until their own frame.
- Hybrid-command regression covers preferred-target selection, nearest-visible fallback, clearing preferred-target state, formation-source preservation, and the new Command Map language.
- Static release checks require explicit action movement IDs, hybrid command fields and fallback targeting, armor-matched Three.js helmet construction, and both transfer-option and transfer-confirmation UI markers.
- Save format remains 4. Existing campaigns and in-progress tactical states require no migration.

PREVIOUS BUILD - 0949
=====================

Build: v0.26.08.14.0949_VIP_RESCUE_INGRESS_PATCH_HISTORY_SHOT_STACK_AND_SFX_MULTIPLIERS_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue missions use the rescue quota as an authoritative victory condition, with partial credit preserved when a quota is missed. Fire-team leaders route into VIP buildings more reliably when their own supports occupy narrow approaches. Testers can open patch notes and version history directly from Save / Load. Tactical shot results stack at the top of a battle for ten seconds, fade independently, and can be hidden from a battle-screen button. Enhanced SFX entries support persistent 1x, 2x, 3x, and 4x multipliers.

VIP BUILDING INGRESS
--------------------
- Rescue route planning now treats the leader's own fire-team members as mobile formation traffic instead of permanent path blockers. The formation mover remains responsible for shifting those supports safely as the leader advances.
- When a VIP is inside a building, the contact destination must also be inside that building. Soldiers no longer satisfy the approach by merely standing against the exterior side of a solid wall.
- Full routes compare valid adjacent contact cells inside the target building and naturally cross a door or an already-open breach.
- If a complete route is temporarily blocked by unrelated occupants, bounded fallback movement prioritizes the target building's valid door and breach cells instead of repeatedly pressing toward the nearest exterior wall.
- Extraction no-reentry behavior is unchanged. This traffic exception applies while approaching a VIP; escorted columns that have cleared a building still remain committed to outdoor routes toward the Skyranger.
- Fire-team movement authority is unchanged: the leader owns the move, supports preserve formation, and this fix does not create additional movement phases.

MISSION RESOLUTION CONSISTENCY
------------------------------
- Meeting the mandatory rescue quota and resolving every remaining VIP permits victory once the alien force and any required confirmed beacon objective are neutralized.
- Resolving every VIP below quota creates a terminal objective failure after the alien force is defeated. Manual and AI-controlled battles now consume the same terminal-state result.
- A mathematically impossible quota does not immediately discard surviving VIPs. The rescue phase remains open while any VIP is still active so the squad can extract them for partial credit.
- Terminal quota failure ends cleanly rather than consuming extra reinforcement waits, beacon-search turns, or the AI safety interval in pursuit of an impossible victory.

PARTIAL CREDIT AND CAMPAIGN RESULTS
-----------------------------------
- A missed mandatory quota records a mission failure and applies the mission's normal failure panic penalty and 20% base-reward fallback.
- Each extracted VIP still awards the profile's per-rescue payment. The quota-completion bonus is withheld on failure.
- Surviving soldiers retain their ordinary mission experience and medical outcomes; extracted and lost VIP totals remain explicit in the action log and report.

PATCH NOTES AND VERSION HISTORY
-------------------------------
- Save / Load now includes a Patch Notes / Version History button beside Build Health and the Enhanced SFX Library.
- The latest build opens by default with a readable summary and detailed highlights for testing.
- A desktop build list and mobile version selector expose the recent browser-build history without leaving the game or requiring network access.
- Each entry shows its human-readable version, date, title, summary, full build identifier, save-format compatibility, and the most important testing points.
- The viewer is embedded in index.html for direct-file play. README_PATCH_NOTES.txt remains the authoritative detailed archive.

TACTICAL SHOT RESULT STACK
--------------------------
- Shot results remain fully visible for 10 seconds, then fade over 700 milliseconds before removal.
- New results enter at the top and push older results downward. Up to six recent shots can remain visible at once and each keeps its own display/fade timer.
- The battle header includes a Shot Results: On / Off button. Turning the display off immediately clears its notices and timers but does not alter ballistics, damage, sound, dialogue, or the Mission Timeline.
- The display preference is retained in the live state for the current battle when moving between command sections.

ENHANCED SFX BOOST MULTIPLIERS
------------------------------
- Every sound now exposes 1x, 2x, 3x, and 4x choices instead of a single 2x toggle.
- The selected multiplier applies after the sound's individual level and before the master SFX volume.
- Existing locally saved boolean boost settings migrate automatically: Boost On becomes 2x and Boost Off becomes 1x.
- Reset Mix restores every individual level to 100% and every multiplier to 1x.

BUILD HEALTH
------------
- The rescue-phase regression now distinguishes `canResolveVictory` from `canResolveFailure` and covers both below-quota failure and quota-met victory terminal states.
- The door-ingress regression now places a support soldier directly in the only immediate entrance route and verifies that the leader still enters through the opening, finishes inside the VIP's building, contacts the VIP, and keeps the support on fire-team duty.
- The tactical feedback regression covers newest-first stacking, independent fade/removal transforms, the exact 10-second visibility contract, and a stack capacity greater than one.
- Enhanced SFX regression now covers boolean-setting migration plus bounded 1x, 2x, 3x, and 4x gain calculations.
- Static checks require the Save / Load viewer, version selection, battle-screen shot toggle, ten-second stack timing, fade timing, and all four SFX multiplier controls.
- Static checks require the shared terminal failure branch in AI simulation and manual End Turn handling, plus the partial-credit contract and browser/native parity record.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 0903
=====================

Build: v0.26.08.14.0903_VIP_RESCUE_QUOTA_AND_BUILDING_INGRESS_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Mandatory VIP rescue quotas became authoritative across manual and AI mission resolution. Resolving all VIPs below quota became a clean failure with normal per-VIP partial credit, while fire-team rescue routes began treating their own formation supports as mobile traffic and required a valid interior approach to a VIP inside a building.

CORE CHANGES
------------
- Split terminal rescue permission into canResolveVictory and canResolveFailure.
- Prevented impossible-but-still-active rescue objectives from ending before surviving VIPs could be extracted for partial credit.
- Routed leaders through valid building doors or breaches and prevented exterior adjacency through a solid wall from counting as contact.
- Preserved leader-owned formation movement and the outdoor extraction no-reentry rule.

PREVIOUS BUILD - 2320
=====================

Build: v0.26.08.13.2320_SEVEN_HEX_BEACON_SHIELD_AND_MISSION_EXIT_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Alien Field Beacon shields now occupy the beacon hex and its six adjacent hexes. Compatible incoming fire is intercepted when fired from outside the field, protecting reinforcements that have just beamed into those cells, while soldiers can still walk through the field and attack the beacon from inside. This build also fixes the undefined beacon-objective reference that could crash the tactical victory exit handoff.

SEVEN-HEX SHIELD AND CLOSE ASSAULT
----------------------------------
- The shield footprint is exactly seven passable hexes: the beacon center and all six immediate neighbors. Only the beacon itself remains a physical obstacle.
- Kinetic shields stop outside ballistic fire entering any protected hex. Combined shields stop outside ballistic, laser, plasma, and alien-energy fire. Explosive attacks retain their established penetration behavior.
- Reinforcements materialize in the six surrounding cells and are protected while they remain inside the field; the protection is positional and does not follow them after they leave.
- A soldier standing in any shield hex is already inside the boundary, so compatible direct fire can damage the beacon without being intercepted. This gives every armed fire team a close-assault solution even when it lacks the shield's preferred ranged counter or a Frag Grenade.
- Fire-team formation movement is preserved. The assigned leader remains movement authority, supports use their established leader-relative positions, and the shield footprint adds no pathing obstruction.

PRESENTATION AND MISSION EXIT FIX
---------------------------------
- Revealed shield footprints are outlined across all seven cells in 2D: cyan for kinetic and magenta for combined fields.
- The Three.js shell is enlarged and flattened around the complete seven-hex footprint rather than hugging only the beacon model.
- Shield impacts against protected units use the same visible beacon-field feedback as blocked direct beacon shots.
- Tactical victory exit now stores `tacticalBeaconObjective`, the objective value actually in scope, instead of referencing the undefined `tacticalAlienBeaconObjective` name.

BUILD HEALTH
------------
- Added a seven-hex contract covering exact footprint, passable adjacent cells, outside interception, explosive passage, inside-field bypass, protected reinforcement arrival, 2D/Three.js presentation, and preserved leader-only formation movement.
- The mission-completion regression now explicitly requires the correct result-handoff variable and rejects the undefined name that caused the reported runtime error.
- Save format remains 4; no migration is required. Native Godot parity remains queued.

PREVIOUS BUILD - 1956
=====================

Build: v0.26.08.13.1956_CONFIRMED_BEACON_MISSION_COMPLETION_GATE_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Eliminate-force missions now treat a confirmed active Alien Field Beacon as part of the hostile operation. Defeating the last alien begins a visible Locate or Secure the Beacon phase instead of ending the mission early. AI-controlled squads search without artificial battlefield knowledge, preserve fire-team formation during the strike, and stop cleanly with a withdrawal option if the deployed shield cannot be breached.

MISSION COMPLETION GATE
-----------------------
- A non-crash mission that requires alien-force defeat cannot report victory while a campaign-confirmed field beacon remains active.
- Mandatory VIP/civilian rescue remains an independent requirement; beacon completion does not bypass the existing rescue terminal state.
- Missions with unknown beacon doctrine, UFO crash sites, and objectives that do not require alien-force defeat retain their established completion rules.
- The same beacon-aware terminal helper now governs direct control, Watch AI Team Leader, streamed Simulation AI, and Classic Lineup outcomes.

SEARCH, STRIKE, AND FIRE-TEAM COHESION
--------------------------------------
- A confirmed but unseen beacon stays hidden. After the last alien falls, AI units conduct coordinated grid/fog exploration until normal range and line of sight reveal it.
- Once discovered, one free shield-capable fire team receives the strike assignment. The leader remains movement authority and supporting soldiers keep their existing formation behavior.
- Tactical controls, logs, and playback explicitly distinguish Locate, Neutralize, No Breach, and Complete phases.
- Direct control remains available throughout the objective so the player can adjust equipment use or choose Dust Off.

REINFORCEMENTS AND DEADLOCK SAFETY
----------------------------------
- Destroying the beacon cancels a reinforcement wave that is still in transit. Reinforcements that already arrived remain on the battlefield and must still be defeated.
- Manual Frag Grenade destruction now follows the same pending-transit cancellation rule as direct weapon fire and AI attacks.
- If no living soldier can breach the deployed shield, automated resolution returns an incomplete operation instead of looping or inventing a victory, with a clear withdrawal explanation.

BUILD HEALTH
------------
- Added a regression contract covering unknown and confirmed doctrine, locate/neutralize/complete phases, already-arrived reinforcements, transit cancellation, mandatory rescue coexistence, impossible combined-shield breach, non-elimination and crash-site exclusions, AI search continuation, shared-mode wiring, and tactical objective presentation.
- Save format remains 4; no migration is required.
- Native Godot parity remains queued.

PREVIOUS BUILD - 1204
=====================

Build: v0.26.08.13.1204_ADAPTIVE_ALIEN_BEACON_COMBINED_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
Phase 3 of Alien Field Beacon adaptation is active. After six beacon destructions are recorded in campaign mission reports, newly generated non-crash incidents upgrade from the ballistic-only kinetic field to a combined shield that also intercepts laser and plasma fire. Grenades and personnel still pass through, existing battlefields retain their deployed shield state, and reinforcement arrivals still preserve original beacons and crashed-UFO landmarks.

COMBINED KINETIC-ENERGY SHIELD
------------------------------
- Destruction history remains report-based and save-format-4 compatible: 0-2 destroyed beacons deploy unshielded, 3-5 deploy the Phase 2 kinetic shield, and 6 or more deploy the combined field.
- Combined shields block ballistic, laser, plasma, and alien energy weapon damage without reducing beacon HP. TU/ammunition are still spent and the tactical log identifies the intercepted damage class.
- Frag Grenades remain the intentional Phase 3 breach path and use the existing prime/throw costs, range, seven-cell blast, and friendly-risk rejection.
- The field remains non-solid around the beacon. Soldiers, aliens, civilians, and VIPs can move through the shield volume; only the beacon's physical hex remains occupied.
- UFO crash-site deployments remain excluded and continue replacing the beacon with the angled smoking wreck and impact trail.

AI, FORMATION, AND PRESENTATION
-------------------------------
- Simulation AI assigns a combined-shield beacon only to a free fire team that still has a living soldier with a Frag Grenade. Ballistic- or energy-only teams do not waste turns firing into the field.
- The fire-team leader remains the sole movement authority. A grenade-capable support follows normal formation and attacks only when the formation places that soldier safely in range.
- Laser/plasma users carrying grenades reserve their direct weapon fire against the combined shield and use the existing safe grenade decision instead.
- 2D displays a magenta `K+E SHIELD` badge and descriptive tooltip. Three.js uses a magenta combined-field shell distinct from the cyan Phase 2 kinetic field.

PRESERVED REINFORCEMENT LANDMARKS
---------------------------------
- Beacon reinforcement waves retain the original beacon record, including its shield, HP, damage, and revealed state.
- Reinforcement dropships in crash missions retain the original crashed-UFO craft, wreckage, trail, broken trees/buildings, and smoke.

BUILD HEALTH
------------
- Added a Phase 3 regression contract covering the six-destruction threshold, ballistic/laser/plasma interception, grenade passage, AI team eligibility, formation movement ownership, and 2D/Three.js presentation.
- Existing Phase 2 kinetic-shield and reinforcement-landmark regression contracts remain active.
- Save format remains 4; no migration is required.

PREVIOUS BUILD - 1552
=====================

Build: v0.26.08.12.1552_ADAPTIVE_ALIEN_BEACON_KINETIC_SHIELD_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
After three Alien Field Beacon destructions recorded in campaign mission reports, later non-crash incidents deploy the beacon with an adaptive kinetic shield. The field stops ballistic rounds, while laser/plasma fire, Frag Grenades, and personnel continue to pass through. Existing tactical battles retain their deployed beacon state, UFO crash sites still replace the beacon with the crashed craft and impact trail, and reinforcement arrivals no longer remove either mission landmark.

ADAPTIVE KINETIC SHIELD
-----------------------
- The campaign derives the alien adaptation threshold from saved mission reports, so existing format-4 campaigns need no migration or new campaign field.
- The first three destroyed-beacon encounters retain the original unshielded device. Once the third destruction is in the report archive, newly generated beacon missions receive the kinetic field.
- Ballistic fire still spends the chosen shot's TU and ammunition, but causes no beacon HP damage and produces a shield-interception combat log message.
- Laser and plasma weapons pass through the field and damage the beacon normally.
- Frag Grenade blast damage passes through the field and can destroy the beacon under the existing prime, throw, blast-radius, and friendly-risk rules.
- The field does not occupy surrounding cells, so soldiers, aliens, civilians, and VIPs retain normal movement around it.
- A mission's shield state is fixed when its battlefield is created and is preserved by the existing tactical snapshot system.

AI AND FIRE-TEAM SAFETY
-----------------------
- Confirmed-beacon doctrine assigns only one free fire team, preserving player orders, combat priorities, rescue work, escorts, and existing formation movement.
- A shielded-beacon assignment is accepted only if the chosen team has an energy weapon or a Frag Grenade that can breach the field.
- The fire-team leader remains the movement authority and advances the whole team under the existing leader/support formation and pacing rules; any shield-capable member may attack once the formation puts that soldier in range. Other teams do not clump on the beacon.
- The established safe-grenade logic still rejects any throw whose blast includes an AEGIS soldier, civilian, or VIP.

REINFORCEMENT LANDMARK PERSISTENCE
----------------------------------
- Beacon reinforcement materialization preserves the exact original beacon cover record, including HP, shield state, damage state, and visibility.
- Crash-site reinforcement arrivals preserve every crashed-UFO hull, wing, core, impact-trail, scar, broken-tree, debris, and smoke source cover.
- Registering a live reinforcement dropship no longer removes the crashed-UFO craft model from the battlefield; both can coexist for the duration of the arrival.
- The preservation merge is identity-based, so an already retained landmark is not duplicated.

PRESENTATION AND BUILD HEALTH
-----------------------------
- The 2D beacon marker carries a K-SHIELD badge and its hover description identifies the ballistic block.
- The 3D Iso beacon receives a translucent cyan shield shell that brightens on a ballistic impact.
- Cover details and tactical logs distinguish shield interception from ordinary damage and destruction.
- Regression coverage verifies the three-destruction threshold, ballistic interception, energy/grenade passage, unshielded legacy damage, mission deployment, report-history counting, capable AI team selection, 2D/3D presentation seams, and beacon/crashed-UFO persistence through reinforcement arrival.

PREVIOUS BUILD - 1305
=====================
Build: v0.26.08.12.1305_ESCORT_CONTACT_AND_EXTRACTION_TRAFFIC_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
VIPs and civilians who remain both separated from and unable to see their escort for one complete round now return to an unescorted, reassignable state. The original fire team is recalled when possible. At Skyranger extraction, supporting soldiers form defensive positions outside the ramp cells, and the escort leader clears the corridor after the final assigned civilian extracts.

ESCORT CONTACT AND REASSIGNMENT
--------------------------------
- Normal four-person escort-column spacing remains valid and does not start the lost-contact timer.
- Separation alone does not release a follower if the VIP and escort retain an unobstructed line of sight.
- Blocked sight alone does not release a follower while the escort remains within normal contact distance.
- The first completed round of both separation and lost sight starts a regroup warning; a second completed round in that same condition releases the follower, ensuring a full round elapsed.
- Regaining distance or sight during the grace round clears the warning without changing the escort assignment.
- A released civilian is revealed, calm, and free of exclusive escort claims so another fire-team leader can immediately make contact.
- The original living fire team is switched back to stay-together escort support, and its leader receives a return target. If another team reaches the civilian first, the stale recall clears.
- The rule runs at round boundaries in direct-control, reinforcement-wait, post-combat rescue, and simulation-AI battles. Its state is retained across streamed tactical snapshots.

EXTRACTION-ZONE TRAFFIC
-----------------------
- When an escort leader enters the selected Skyranger extraction corridor, living fire-team supports receive defensive guard cells outside every ramp and hull footprint.
- Guard positions prefer nearby cover and remain subject to TU, occupancy, formation-order, and passability checks.
- Supporting soldiers are explicitly prevented from choosing extraction cells while the guard assignment is active, leaving ramp capacity for VIPs and civilians.
- The leader holds the corridor while the assigned civilian column advances, preserving the existing single-file escort behavior.
- When the last assigned follower reaches an extraction cell and leaves the map, the leader immediately moves to a clear cell outside the extraction footprint and releases the temporary guard assignment.
- These overrides apply only to active escorted extraction; normal patrol, combat, building entry, manual movement, and fire-team formation behavior are unchanged.

BUILD HEALTH
------------
- Added a deterministic two-round blocked-sight scenario that verifies the grace round, release, original-team recall, support return, another-team reassignment, and contact recovery reset.
- Added a Skyranger traffic scenario that verifies supports remain outside extraction cells, the VIP extracts, and the leader clears the ramp afterward.

PREVIOUS BUILD - 0915
=====================
Build: v0.26.08.12.0915_VIP_EXTRACTION_NO_BUILDING_REENTRY_INDEX_ONLY_PATCH

AI-controlled VIP rescue teams now commit to outdoor extraction routes after leaving a building. Escorts route around cleared structures instead of treating their interiors as shortcuts, and each VIP or supporting fire-team soldier that reaches outdoor ground is prevented from stepping back inside while following formation.

VIP EXTRACTION - NO BUILDING RE-ENTRY
-------------------------------------
- Added an extraction-specific route search that treats every building as closed terrain once an escort is outdoors.
- Escorts already inside still use the established door-or-breach egress route, then switch to the outdoor-only route for the remaining journey to the Skyranger.
- Outdoor routing plans all the way to the selected ramp corridor before committing the current TU-bounded movement segment, avoiding local distance choices that can produce doorway loops.
- If a temporary obstacle blocks the complete route, the escort can still make bounded outdoor progress toward extraction and retry from its new position next round.
- Escorted VIPs independently inherit the same rule: once an individual VIP reaches outdoor ground during extraction, its formation choices exclude building cells.
- Fire-team supports retain normal formation targets, pace limits, TU costs, occupancy rules, and break-off behavior; only indoor candidate cells are removed after that support has exited.
- Units that have not yet cleared the structure can continue moving inside and through a valid door or breach, preventing the new rule from trapping the rear of a civilian column.
- When the leader reaches the far end of the ramp first, it now holds the extraction corridor and spends its remaining bounded movement allowance advancing trailing VIPs instead of leaving the rear of the column stranded.

BUILD HEALTH
------------
- Added a cross-building regression scenario with extraction on the far side of a structure. The contract requires a complete route whose committed segment contains no building cells.
- Extended the contract to verify the extraction-only follower guard is active while the normal formation system remains the movement authority.

PREVIOUS BUILD - 0858
=====================
Build: v0.26.08.12.0858_ENHANCED_SFX_PER_SOUND_DOUBLE_BOOST_INDEX_ONLY_PATCH

SUMMARY
-------
Every sound in the Save / Load Enhanced SFX Library now has its own persistent Boost ×2 button. Boost doubles only the selected effect after its individual slider and before the master SFX volume, so quiet sounds can be raised without changing the rest of the mix.

PER-SOUND DOUBLE BOOST
----------------------
- Added a Boost ×2 toggle beside Play on all 17 Enhanced SFX Library rows.
- An active boost is clearly highlighted and reads Boost ×2 On; the row readout also shows its slider percentage followed by ×2.
- Boost multiplies the sound's individual slider by two before the master SFX bus. For example, 60% with Boost ×2 produces a 120% per-sound gain that still follows the master SFX volume.
- Boost state persists locally for each sound under a separate versioned preference key. Existing saved slider levels migrate without changes and every boost defaults off.
- Reset Mix returns all sliders to 100% and switches every boost off.
- Original SFX bypasses both enhanced levels and enhanced boosts. Switching back to Enhanced Tactical SFX restores the player's saved mix.
- Boost is audio presentation only and cannot affect combat, TU, AI decisions, escort routing, or fire-team formation movement.

BUILD HEALTH
------------
- Extended the 17-entry audio-library contract to verify boost normalization, default-off behavior, the exact ×2 gain calculation, unique per-row boost controls, local persistence, and reset behavior.

PREVIOUS BUILD - 0825
=====================
Build: v0.26.08.12.0825_ENHANCED_SFX_LIBRARY_AND_PER_SOUND_MIX_INDEX_ONLY_PATCH

Save / Load Game now has a dedicated Enhanced SFX Library. Players can audition all 17 enhanced effects, tune each one independently, adjust the existing master SFX volume from the same screen, and keep the mix as a local audio preference without changing campaign saves.

ENHANCED SFX LIBRARY
--------------------
- Added an Enhanced SFX Library button to the Save / Load Game header and a full library screen with a clear return control.
- The library exposes every enhanced sound currently routed in the browser build: four role-specific footsteps; ballistic, laser, AEGIS plasma, and alien weapon reports; miss/flyby, hit/injury, armor, glass, death, and fall feedback; plus Skyranger flyby, takeoff, and landing.
- Every sound has its own Play button and 0-100 percent level control. Library previews always use the enhanced version so it can be compared even when Original SFX is currently selected.
- Individual levels multiply the existing master SFX volume. The library also exposes that master control and provides Reset All to 100%.
- Per-sound levels persist in local audio preferences under their own versioned setting and do not enter campaign save data.
- Original SFX bypasses the enhanced per-sound mix. A one-click Use Enhanced SFX control is shown when the original profile is active.
- Added an audible glass-shatter route to window-crossing shots in manual and simulated tactical playback, using the same presentation-only callback layer as existing weapon and impact sounds.

GAMEPLAY SAFETY
---------------
- The mixer only scales audio destinations. It does not write movement, combat, TU, AI, escort, or formation state.
- Fire-team formation movement and the coherent single-turn AI rules remain unchanged.

BUILD HEALTH
------------
- Added a 17-entry catalog contract covering unique routing keys, bounded level normalization, persistent local storage, the Save / Load entry button, screen controls, preview routing, master-volume multiplication, and glass feedback.

PREVIOUS BUILD - 0024
=====================
Build: v0.26.08.12.0024_TACTICAL_MISSION_VISIBILITY_MUSIC_CROSSFADE_INDEX_ONLY_PATCH

The Dark Horizon alternate mission track is now visibility-reactive. Contact in the Dark loops its 0:00-0:36 search section while no living alien is in current soldier line of sight, loops its 0:37-1:00 combat section while any alien is visible, and crossfades between those two sections as contact changes.

MISSION MUSIC VISIBILITY CROSSFADES
-----------------------------------
- Current line of sight, rather than permanent revealed/last-known-contact memory, drives the music state. Losing sight behind a wall or other cover returns the score to search even though soldiers remember the contact.
- Search uses 0:00 up to the 0:36 boundary. Visible engagement uses 0:37 up to the 1:00 boundary. Each segment seeks back to its own start before playback can drift into the other section.
- Visibility changes start a 1.4-second two-player crossfade: the old segment fades down while a second synchronized media player starts and fades up at the new segment boundary.
- A rapid second visibility change cancels and cleans up the stale outgoing player before starting the newest transition, preventing stacked playback.
- The behavior applies specifically to Dark Horizon Alternate's Contact in the Dark mission cue. Original Soundtrack mission playback and all non-mission tracks retain their established looping and fallback behavior.
- This is presentation-only: visibility rules are read without changing unit reveal memory, AI decisions, fire-team formation movement, TU, combat, or save format.

BUILD HEALTH
------------
- Added required seams for the 0:00/0:36 and 0:37/1:00 segment contract, live LOS visibility signal, crossfade duration, outgoing-player cleanup, and alternate-mission routing.

PREVIOUS BUILD - 2200
=====================
Build: v0.26.08.11.2200_ALTERNATE_SOUNDTRACK_AND_TACTICAL_AUDIO_DIRECTION_INDEX_ONLY_PATCH

The browser build added a selectable Dark Horizon alternate soundtrack, a selectable enhanced tactical-SFX profile, role-specific movement footfalls, and event-driven tactical radio direction. Routine movement acknowledgements are rare; soldiers announce meaningful transitions such as engaging alien contact, resuming a VIP/contact search, and securing the area. Fire-team formation movement is unchanged.

ALTERNATE SOUNDTRACK
--------------------
- Added 15 original ElevenLabs-generated score cues alongside the existing score, giving every existing music context its own one-to-one alternate.
- Audio Settings now lets players switch between Original Soundtrack and Dark Horizon Alternate without changing their campaign save.
- The alternate bank independently scores Start, Command Menu, Geoscape, Base, Inventory, Database, Soldiers, Research, Workshop, Squads, Sickbay, Missions, Reports, Memorial, and Pause.
- If an alternate file cannot load, playback safely falls back through the original file bank and existing synthesized theme.

TACTICAL AUDIO DIRECTION
------------------------
- Human, alien, civilian, and tracked-VIP movement now produces distinct footfall textures on the same animation steps that already drive movement.
- Simulation AI radio dialogue prioritizes tactical state changes: alien engagement begins, contact ends and VIP search resumes, contact search resumes, or the area becomes secure.
- The VIP transition is authored as “Resuming search for the VIP” and uses the recorded Keep Moving performance until a dedicated recording is added.
- Generic Moving/Advancing acknowledgements remain as an occasional manual-order response and a deterministic one-in-seven AI-movement accent, with longer cooldowns.
- Existing hit, kill, last-contact, weapon, armor-impact, pain, death, glass, and environmental sounds remain active.
- Audio Settings includes Enhanced Tactical SFX and Original SFX choices; the preference persists locally and does not alter save format 4.

ELEVENLABS SOURCE LIBRARY
-------------------------
- Generated a 16-category sound-effects library in the project's signed-in ElevenLabs account: role-specific footsteps; ballistic, laser, and alien plasma weapons; soldier, alien, and civilian injury/death reactions; glass; dirt/concrete impacts; and armor impacts.
- The integrated enhanced profile establishes the routing and event timing for those categories while generated takes can be auditioned and substituted without changing combat or formation logic.

BUILD HEALTH
------------
- Added checks for alternate-track routing, persisted soundtrack/SFX selection, state-change radio callouts, bounded generic movement acknowledgements, and footfalls on movement animation steps.
- Fire-team paths, TU use, escort following, cohesion limits, and formation pacing are untouched by the audio hooks.

PREVIOUS BUILD - 1652
=====================
Build: v0.26.08.11.1652_ADAPTIVE_COHERENT_AI_TURNS_AND_WINDOW_BALLISTICS_INDEX_ONLY_PATCH

Simulation AI now gives each soldier an individual TU reserve and presents that soldier's movement as one coherent turn: move, reassess once from the new position, optionally continue within the same path, then fire or kneel. Fire-team formation pacing remains authoritative. Building windows now transmit sight and can be shot through; the first passing projectile shatters intact glass and takes an accuracy penalty, while solid wall sections remain opaque.

SIMULATION AI - ADAPTIVE COHERENT TURNS
---------------------------------------
- Each AI-controlled soldier independently selects Snap Shot, Aimed Shot, Burst, Full Auto, or Kneel + Snap according to range, target cover, visible contact count, role, ammunition, and available TU.
- AI movement may use the soldier's full post-reserve TU allowance instead of inheriting the old eight-step planning ceiling.
- Movement is recorded as one continuous playback trail with one internal observation checkpoint and at most one continuation.
- After reaching the checkpoint, the soldier reassesses personal line of sight and can continue toward a newly observed or existing objective before choosing the final action.
- If an alien is visible after movement, the soldier may shoot with the selected reserve. A suitable rear/base-fire soldier with no target may end by kneeling while preserving a snap reserve.
- The continuation is rechecked by fire-team formation pacing. Leaders still wait for supports, supporting soldiers stay within leader cohesion bounds, contact-rush rules remain intact, and movement cannot exceed remaining TU.

TACTICAL BUILDINGS - WINDOWS AND SOLID WALLS
--------------------------------------------
- Procedural buildings retain alternating window sections and solid wall sections.
- Intact and shattered windows transmit line of sight for soldiers, aliens, civilians, visibility maps, and AI targeting.
- Solid wall and partition sections continue to block line of sight.
- A projectile crossing an intact window shatters it before the normal target hit roll and applies an 18-point accuracy penalty to that first round.
- Later rounds and later attacks pass through the shattered opening without the glass penalty.
- Shattered window cells remain hard wall geometry for movement, so the change does not create unintended walk-through routes; structural breaches remain the way to create passable openings.
- Manual fire, Simulation AI fire, alien fire, and reaction fire share the window-shattering rule.

BUILD HEALTH
------------
- Added adaptive-reserve and coherent-turn regression coverage, including the fire-team formation continuation guard.
- Added window-ballistics regression coverage for sight through windows, blocked sight through solid walls, glass shattering, first-shot penalty, and persistent movement blocking.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm the new adaptive AI-turn and building-window contracts report OK.
2. Watch a Simulation AI round and confirm each soldier shows one continuous movement trail followed by one final action, without separate repeated movement phases.
3. Confirm fire-team leaders still wait for supports and that supports do not abandon formation during the checkpoint continuation.
4. Place a soldier and alien across a window and confirm sight is possible, the first shot shatters the glass, and a later shot crosses the broken pane normally.
5. Repeat across a solid wall section and confirm neither sight nor target fire is available.

PREVIOUS BUILD - 1005
=====================
Build: v0.26.08.10.1005_UFO_CRASH_SITE_WRECK_AND_IMPACT_TRAIL_INDEX_ONLY_PATCH

UFO Crash Site tactical maps now show the downed alien craft itself instead of an intact Alien Field Beacon. Each site builds a deterministic impact scene with a visibly tilted, damaged UFO, a churned-earth trail, context-sensitive broken trees or building debris, and smoke from the wreck.

TACTICAL - UFO CRASH SITE WRECKS
--------------------------------
- Removed the Alien Field Beacon from every mission identified as a UFO Crash Site.
- Added a persistent crashed-UFO footprint as hard cover near the surviving alien deployment area.
- The UFO is rendered at a deterministic off-axis yaw and tilt so it reads as a forced landing rather than a parked reinforcement craft.
- Added torn hull panels, a fractured dome, exposed damaged machinery, dead alien lighting, scorch damage, and a bounded smoke plume in the Three.js view.
- Added dedicated crashed-UFO artwork and smoke cues to the 2D tactical view.
- Added a 10-20-cell impact trail that widens irregularly as it approaches the wreck.
- Existing trees, brush, crops, concrete, and buildings crossed by the trail are replaced with fallen trees, stumps, masonry, beams, or other debris as appropriate; open ground becomes churned earth.
- Alien and civilian deployment is recalculated around the completed crash scene, preventing units from spawning inside the UFO's hard-cover footprint.
- Ordinary Alien Field Beacon and reinforcement-dropship behavior remains unchanged on non-crash missions.

BUILD HEALTH
------------
- Added a regression contract proving that crash sites contain no active beacon, include the angled UFO craft and complete wreck footprint, generate a substantial impact trail, keep units out of hard cover, and retain both 2D and Three.js rendering support.
- Save format remains 4; no migration is required.

VALIDATION / MANUAL GATES
-------------------------
1. Run Build Health and confirm "UFO crash sites replace the field beacon with an angled smoking wreck and impact trail" reports OK.
2. Deploy to forest/farmland and urban UFO Crash Sites and confirm the trail selects broken vegetation or building debris appropriately.
3. Inspect the wreck in both 2D Hex and Three.js views and confirm the unusual angle, hull damage, impact scar, and smoke remain visible.
4. Confirm ordinary incident missions can still use Alien Field Beacons and reinforcement dropships.

PREVIOUS BUILD - 2055
=====================
Build: v0.26.08.07.2055_INCIDENT_MAP_LIMIT_SELF_TEST_STARTUP_TDZ_FIX_INDEX_ONLY_PATCH

Startup-crash hotfix for browser build 1850. The Incident Map Limit feature itself was valid, but its new Build Health contract referenced a local React component before that `const` binding had initialized, preventing the start screen from loading.

STARTUP - INCIDENT MAP LIMIT SELF-TEST TDZ FIX
---------------------------------------------
- Fixed: `ReferenceError: IncidentMapLimitPanel is not defined` during `runSelfTests()`.
- Root cause: `String(IncidentMapLimitPanel)` executed while `AlienResponseCommand` was still initializing, before the local `const IncidentMapLimitPanel = ...` declaration had executed.
- Removed the unsafe forward reference.
- The regression still verifies 5-20 clamping and routine incident limiting directly.
- UI coverage now comes from `String(AlienResponseCommand)`, which safely contains the local settings-panel source without evaluating the uninitialized binding.
- All 1850 gameplay features remain active: VIP rescue fire-team distribution, Simulation AI grenade use, staged Alien Field Beacon knowledge and database unlock, confirmed-beacon targeting, row-major Barracks reading order, and the saved 5-20 Incident Map Limit.

POST-REVIEW CODE CLEANUP
------------------------
- Routine-incident cap accounting now excludes critical crash sites and other protected operations, so those missions can push the board above the routine limit without consuming routine slots.
- Candidate routine incidents are de-duplicated against both the active board and the rest of the same generated batch.
- The Incident Map Limit slider now receives a real `aria-label` instead of leaking the invalid React-only `ariaLabel` prop to the DOM.
- VIP rescue coordination now falls back to the established nearest-VIP behavior when a legacy or test tactical state has no assignable fire-team leaders, instead of enabling coordination with an empty assignment board.
- The structural-damage Build Health check now inspects the base cover renderer where the crack, shattered-window, and smoke code lives, while also verifying that the alien-technology wrapper delegates to that renderer. This removes a false failure without weakening coverage.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Zero `String(IncidentMapLimitPanel)` references remain.
- Start-screen version derives as v0.26.08.07.2055 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Open `index.html` locally and confirm the start screen appears without a runtime error.
2. Open Command Settings and confirm Incident Map Limit remains selectable from 5 through 20.
3. Open Barracks and confirm soldiers still fill left-to-right, then down.
4. Load an existing save and confirm the Incident Map Limit defaults/persists correctly.
5. Run Build Health and confirm the Barracks/Incident Map Limit contract no longer crashes startup.

PREVIOUS CURRENT FEATURE BUILD - 1850
=====================================
Build: v0.26.08.07.1850_VIP_RESCUE_COORDINATION_GRENADE_AI_BEACON_INTEL_BARRACKS_ROW_ORDER_AND_INCIDENT_LIMIT_INDEX_ONLY_PATCH

1850 introduced coordinated VIP-rescue fire-team assignments, selective Simulation AI Frag Grenades, staged Alien Field Beacon knowledge with a persistent Mainframe database unlock after observed reinforcement materialization, confirmed-beacon tactical targeting, row-major Barracks reading order, and a saved configurable 5-20 routine Incident Map Limit. These features remain active in 2055.

INTERMEDIATE FEATURE BUILD - 1630
=================================
Build: v0.26.08.07.1630_TACTICAL_DAMAGE_STATE_SMOKE_BREACH_FEEDBACK_AND_UNLIMITED_DOWNTIME_CAPACITY_INDEX_ONLY_PATCH

1630 added shared structural-damage presentation for the 2D and Three.js tactical views: cracked damaged walls, stronger critical-state damage, shattered windows, and bounded dust/smoke cues for damaged structures and breaches. It also temporarily removed Training Center, Rec Room, and per-activity attendance caps while preserving the requirement to own the matching facility.

PREVIOUS FEATURE BUILD - 1415
=============================
Build: v0.26.08.07.1415_TACTICAL_ALIEN_BEACON_FANOUT_SEARCH_AND_LONE_SURVIVOR_EXFIL_FIX_INDEX_ONLY_PATCH

1415 stopped groups of original aliens from camping around the Alien Field Beacon. Groups with no contact now fan out through deterministic battlefield search outside the immediate beacon perimeter, while a lone original survivor can still fall back to the beacon or insertion point and attempt the existing emergency reinforcement call.

OLDER PATCH HISTORY
===================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1145_INTERCEPTOR_SWARM_TARGET_SNAPSHOT_NULL_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This is a targeted stability patch for the 1015 All Bases interceptor swarm. It fixes the player-reported `Cannot read properties of null (reading 'id')` crash that could occur while a swarm and Skyranger incident response were progressing at the same time.

STRATEGIC AIR COMBAT - SWARM SHOOTDOWN TARGET SNAPSHOT FIX
-----------------------------------------------------------
- Confirmed stack frame: `index.html:5605:152`, inside `Array.some` during the successful staggered-swarm shootdown path.
- Root cause: the queued `setMissions(...)` functional updater referenced the mutable local variable `target.id`.
- The same swarm effect subsequently assigned `target = null` so later inbound aircraft would abort.
- React executed the queued updater after that mutation, causing the null-ID exception.
- Build 1145 snapshots both the defeated UFO object and `defeatedTargetId` before queuing mission-state work.
- Crash-site de-duplication now runs through `appendCrashMissionOnceForTarget(...)` and never depends on the later mutable target variable.
- The helper tolerates null/legacy mission entries while checking `sourceCraftId`.
- Contact removal and shootdown reporting use the same immutable defeated-target snapshot.

PRESERVED 1015 BEHAVIOR
------------------------
- All Bases still launches every Ready interceptor with a legal direct/ferry-network route from all bases.
- Sorties retain independent staggered attack ETAs and combat passes.
- A confirmed shootdown still aborts every not-yet-engaged inbound interceptor from its current route position.
- Aborted aircraft still route home through normal ferry/refuel logic and retain permanent home-base/home-hangar ownership.
- Simultaneous Skyranger travel remains allowed and is not cancelled by interceptor combat.
- Alien Field Beacon, dynamic friendly re-pathing, strict fire-team cohesion, living-soldier hex separation, and escort-support response from 1015 are unchanged.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct target-snapshot regression: true.
- Static test scan: 351 `*Test` references / 350 declarations; the only unmatched token is the existing Three.js `depthTest` material property.
- The old mutable closure `mission.sourceCraftId===target.id` is absent from the swarm resolution block.
- Build Health includes `Interceptor swarm shootdown snapshots target identity before queued mission state updates`.
- Start-screen version derives as v0.26.08.07.1145 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
1. Launch All Bases against a detected UFO.
2. Launch Skyrangers to an incident before the interceptor swarm finishes.
3. Advance Geoscape time until the swarm scores a confirmed shootdown.
4. Verify one crash site is added and no runtime error appears.
5. Verify remaining inbound interceptors abort and return home normally.
6. Verify the Skyranger mission continues independently through arrival and tactical ownership.
7. Save/reload during overlapping travel and repeat the completion path.


PREVIOUS BUILD NOTES - 1015
===========================
PROJECT AEGIS / ALIEN RESPONSE COMMAND
PATCH NOTES

Build: v0.26.08.07.1015_GLOBAL_INTERCEPTOR_SWARM_AND_TACTICAL_COHESION_FIX_INDEX_ONLY_PATCH
Save format: 4 (unchanged)
Native Godot parity: still v0.26.08.03.GODOT.0026_CROSS_SQUAD_DIRECT_CONTACT_RESPONSE_VERTICAL_SLICE

SUMMARY
-------
This update combines the current tactical follow-up fixes with a new global multi-base interceptor swarm response.

TACTICAL - CURRENT INCIDENTS USE THE ALIEN FIELD BEACON
--------------------------------------------------------
- Fixed the effective multi-Skyranger deployment override, which could bypass the newer Alien Field Beacon deployment code and make fresh incidents use the legacy purple saucer reinforcement path.
- Current-build one- and two-Skyranger tactical deployments now create exactly one Alien Field Beacon.
- The six immediately adjacent hexes around the beacon are reserved clear of procedural cover so the beacon always has its intended materialization ring.
- Starting aliens preferentially use that ring; beacon reinforcements continue to materialize in those six adjacent cells.
- Purple saucers remain supported only as a compatibility path for genuine legacy tactical snapshots with no beacon state.

TACTICAL - DYNAMIC FRIENDLY RE-PATHING
--------------------------------------
- AI movement remains deterministic simulation-side; gameplay pathfinding was not moved into the visual animation layer.
- When a soldier's direct route is blocked mainly by a friendly soldier who has not acted yet, the mover can defer and re-path after friendly traffic changes.
- Even a one-step avoidable detour can now trigger the defer/re-path rule.
- Static terrain, cover, enemies, map edges, TU costs, reaction fire, and visibility remain authoritative.
- The movement-trail playback system continues to animate the route the AI actually used.

TACTICAL - STRICT FIRE-TEAM ASSEMBLY PACING
-------------------------------------------
- Fire-team leaders remain at half movement until supporting soldiers actually occupy their formation positions.
- This is enforced at mission deployment and when a team reforms after combat.
- Once formed, leaders pace to the slowest active team member.
- Only a genuine rush toward a currently visible living alien overrides AI formation pacing.
- Player-controlled soldiers remain exempt from AI formation speed rules.

TACTICAL - NO TWO LIVING SOLDIERS END ON THE SAME HEX
------------------------------------------------------
- Living soldier destinations are treated as occupied during completed movement/action states.
- Deferred re-pathing rechecks the current occupancy map before movement resolves.
- Tactical-state repair deterministically separates any legacy/edge-case overlap to a nearest valid cell.

TACTICAL - ESCORT SUPPORT RESPONSE
----------------------------------
When an alien is spotted while one or more fire-team leaders are escorting civilians/VIPs, the player receives an escort-support decision:

1. Stay With Escort
   - supports remain with their leader and protect the rescue column.

2. Break Off To Support
   - supports temporarily leave the escort formation and use normal combat AI to reinforce the visible alien contact.
   - the escort leader keeps moving the civilians/VIPs toward extraction.
   - after the active visible/engaged alien contact is gone, detached supports automatically return to their original fire-team leader and resume formation.

STRATEGIC AIR COMBAT - ALL BASES INTERCEPTOR SWARM
---------------------------------------------------
- Detected flying UFOs now have an `All Bases (N)` launch option.
- It selects every Ready interceptor with a legal direct or ferry-network route, across every base.
- Staging hangars are reserved independently so multiple aircraft cannot claim the same transient hangar slot.
- Every aircraft gets its own route phases, impact ETA, return path, and home-base/home-hangar identity.
- Attack passes occur as each interceptor reaches the UFO; they are intentionally staggered when travel times differ.
- Earlier passes can damage the UFO before later passes arrive.
- If one aircraft destroys the UFO, every interceptor still inbound aborts pursuit from its current route position and begins a clock-driven return.
- Aborted aircraft use the normal ferry/refuel network to get back to their permanent home bases rather than teleporting or remaining at a staging base.
- Aircraft that already fought retain normal damage/repair outcomes; aircraft that aborted before combat do not receive fictitious combat damage.
- All swarm aircraft eventually recover at their permanent home bases/hangars.
- The strategic aircraft route display shows each swarm member and its current phase/remaining ETA.

The All Bases command does not launch an aircraft that is Repairing, otherwise unavailable, or has no legal route under normal range/fuel/ferry/hangar rules. If every stationed interceptor is Ready and routable, all of them launch.

PRESERVED FIXES
---------------
- Observed reinforcement arrivals visibly stage their troops before AI movement.
- AI movement trails animate long/multi-stage routes instead of snapping units to destination cells.
- Alien Field Beacon boot null guards.
- Beacon destruction cancels/prevents reinforcement transit.
- Tactical startup main-thread optimization.
- Fire-team Command Map and persistent pause/multi-order controls.
- Manual tactical movement and manual civilian/VIP escort override AI formation restrictions.
- VIP sequential reinforcement and terminal rescue behavior.
- Tactical AI false-total-loss prevention.
- Atomic multi-Skyranger launch and staged per-leg fuel correction.

VALIDATION COMPLETED
--------------------
- All six non-empty embedded JavaScript blocks pass `node --check`.
- Direct Node contract results:
  beacon=true
  traffic=true
  cohesion=true
  occupancy=true
  escort=true
  baseBeacon=true
  movementTrail=true
  swarm=true
- Static Build Health scan: 350 *Test references / 349 declarations; the only unmatched token is the existing Three.js material property `depthTest`, not a missing regression test.
- Current two-Skyranger deployment contract confirms the beacon path.
- Beacon foundation contract confirms the six-cell adjacent deployment ring and beacon reinforcement deployment.
- Interceptor swarm contract confirms options spanning multiple bases, independent elapsed travel, staging-hangar reservation, and a target-destroyed return route aimed at the permanent home base.
- Start-screen version derives as v0.26.08.07.1015 from the authoritative build ID.
- Save format remains 4.

MANUAL TEST GATES
-----------------
A complete live Chromium tactical/geoscape smoke test remains the final validation gate because the container browser sandbox/zygote process is unreliable. Recommended manual checks:

1. Start a fresh two-Skyranger tactical incident and confirm a Field Beacon, not a purple saucer, is present.
2. Watch an AI fire team form at deployment and after combat; the leader should remain at half pace until supports are actually formed up.
3. Put friendly soldiers in each other's likely travel lanes and confirm later movers re-path more directly after the lane clears.
4. Confirm no two living soldiers finish a round on the same hex.
5. Escort a VIP/civilian with a fire-team leader, spot an alien, test both escort-support choices, and confirm detached supports return afterward.
6. Station Ready interceptors at several bases, select `All Bases`, verify staggered arrivals, destroy the UFO before every interceptor arrives, and follow the remaining aircraft home through normal ferry routing.
