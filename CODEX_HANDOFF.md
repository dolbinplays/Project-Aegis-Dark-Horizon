# CODEX HANDOFF — v0.26.09.09.1244_MOBILE_MISSIONS_ADAPTIVE_LAYOUT_PATCH

Completed the next systematic Mobile · Adaptive command screen: **Missions / Mission Control**. This release builds on Browser 1242 and retains its final-VIP playback/casualty authority fixes.

- The Browser 0707 source lineage already contained a partially staged Mobile Missions adapter; Browser 1244 formally promotes, hardens, versions, documents, and validates it.
- Mobile Mission Control uses **Briefing / Squads / Launch** sections inside a fixed viewport between the command rails. Each work area owns its own scrolling; the command page itself remains bounded.
- Squads reuses the existing primary-squad buttons, support-squad selector, selected Barracks base, response-force roster, and ready-soldier callbacks. Portrait stacks the two work panes; landscape/tablet uses a split view.
- Launch reuses the existing `requestMissionLaunch` authority and leader-instruction state. No launch, squad, inventory, aircraft, or campaign rule was copied into a second mobile implementation.
- `MissionLaunchReviewFrame` makes the launch confirmation viewport-bounded on Mobile, with scrollable review content, persistent Cancel / Confirm actions, focus entry/restore, and Tab containment.
- `MissionControlScreen` now has shape guards. If a future Standard Mission Control refactor changes the element structure it expects, the Mobile adapter returns the original content rather than crashing.
- Standard/Desktop returns the original Mission Control and launch confirmation unchanged. Save format remains 4.

QA focus: no-incident state; Briefing; primary/support squad changes; Barracks-base changes; leader orders; all four launch modes; portrait stack; landscape/tablet split; launch confirmation scrolling/actions; Mobile→Standard state parity. See `MOBILE_MISSIONS_FIELD_ACCEPTANCE.txt`.

Next systematic mobile target: **Reports**, then **Memorial** after field acceptance.

---

# CODEX HANDOFF — v0.26.09.09.1242_FINAL_VIP_PLAYBACK_COMPLETION_AND_CASUALTY_AUTHORITY_HOTFIX

Follow-up to Browser 1058 after review identified three concrete release/authority defects.

1. **Duplicate playback completion owner:** TacticalMission contained two same-scope `finishAiPlayback()` declarations. The later declaration overrode the earlier Browser 1058 repair. Browser 1242 removes the shadowed version and consolidates Hybrid continuation plus Simulation terminal completion into one handler.
2. **Death-animation display HP is not casualty authority:** an actor may temporarily show positive presentation HP while `alive:false` is already authoritative. `tacticalCommittedPlaybackFrameUnits(...)` now uses the explicit death flag first for permanent human/alien outcome state; omitted `alive` with positive HP still remains living.
3. **Source manifest synchronization:** do not replace the full repository manifest with a partial reconstruction. Run `node tools/apply-1242-source-manifest.cjs` after overlaying this package; it edits only currentBuild, lastInspectedBuild, gameplayParity.browserBuild, and status, preserving every other manifest field.

Terminal success now uses the last buffered playback frame, reconciles survivors, genuine casualties, and rescued civilians, then rebuilds medical/growth/KIA report data from that committed battlefield before `finishTacticalMission`. `aiTerminalVictoryCommitRef` participates in battle-outcome precedence so a committed Tactical Victory cannot later become Squad Lost because of transient presentation state.

Regression coverage checks one active finish handler, positive-HP/omitted-alive survivor preservation, explicit-death/positive-display-HP casualty preservation, rescued civilian state, final-frame completion, victory precedence, and save format 4.

No tactical decision, damage, TU, pathfinding, LOS, rescue quota, reinforcement, or save-format rules were intentionally changed. Physical field acceptance is still required for the exact live final-VIP sequence.


---

# CODEX HANDOFF — v0.26.09.09.1058_FINAL_VIP_TERMINAL_VICTORY_SURVIVOR_COMMIT_HOTFIX

Severe tactical terminal-state hotfix on top of Browser 0707.

## Reproduction
A mandatory VIP mission reached final extraction with no live aliens, unresolved contacts, active reinforcement source, pending arrival, or other mandatory objective. The timeline correctly logged that Tactical Victory was committed. Immediately afterward every surviving soldier fell to HP 0, the UI changed to Squad Lost, and confirming the loss produced a failed Mission Report with every soldier KIA.

## Root cause
`tacticalMissionTerminalState` correctly defines a positive-HP unit as living unless `alive === false`. Some TacticalMission actors had positive HP with `alive` omitted. `applyAiFrameToMap` used truthiness for `unit.alive`, so a second application of the synthetic `Mission success` terminal frame interpreted omitted `alive` as dead and wrote HP 0. The loss-first battle-outcome expression then overrode the committed victory, and campaign aftermath consumed the corrupted battlefield.

## Fix
- Shared `tacticalPlaybackFrameUnitAuthoritativeAlive` matches terminal-state semantics.
- Frame hydration writes explicit `alive` and `fellThisFrame` values for humans/aliens/civilians.
- Fresh tactical actors initialize with `alive:true`.
- Final-VIP victory normalizes committed human survivors.
- Terminal success reapplication restores frame-confirmed survivors before hydration.
- Battle outcome gives committed victory precedence.
- `finishAiPlayback` and manual `finish` reconcile successful casualty/medical result data from the committed battlefield.
- Save format remains 4.

## Field gate
Repeat the final-VIP boarding scenario, verify no survivor HP changes after the terminal frame, verify Tactical Victory remains visible, and verify the permanent Mission Report remains a success with only genuine KIA. Also verify a genuine wipe still reports Squad Lost.


---

# CODEX HANDOFF — v0.26.09.07.1925_MOBILE_PWA_AUDIO_REGRESSION_FIX_PATCH

## Patch focus

- Geoscape drawers keep their own bounded width on narrow phones.
- Mobile Geoscape and Base drawers remain below confirmation windows without changing board placement.
- Master Mute remains authoritative through music crossfades, delayed dialogue callbacks, and the post-mission audio bridge.
- Only game-shell navigation can update the offline game launch page; editor and tool pages remain separate.
- The canonical packager retains PWA installation support and regenerates release hashes and service-worker cache versions.
- Release identity is synchronized with the authoritative source manifest; Standard layout and save format 4 are preserved.

## Validation

Syntax and standard release checks pass. Focused suites pass 34/34. Seeded Build Health remains 792/854 with 62 pre-existing failures. Phone portrait, phone landscape, tablet, and Standard desktop flows were checked in the browser; construction completes with an unobscured, scrollable confirmation.

Canonical release workflow is documented in PWA_DEPLOYMENT_README.txt. The new regression suite is tools/test-mobile-pwa-regressions.cjs. .gitattributes preserves bytes used by embedded payloads and release hashes on Windows. No campaign authority or save-format changes. Physical device installation/audio output remains a field check.

---

# CODEX HANDOFF — v0.26.09.07.1428_MOBILE_BASE_DRAWER_BOARD_VISIBILITY_HOTFIX

## Patch focus
Mobile Base drawer/board coexistence hotfix. Browser 1404 correctly created independently scrolling Base drawers, but the fixed drawer overlaid the 6×6 facility board. Browser 1428 makes the drawer consume/reserve layout width so the Base primary workspace shifts left and the complete board remains visible/tappable while management controls are open.

## Authority preserved
- Existing `mobileBaseDrawer` state and Base Info / Activity / Defense / Facility / Build rail controls remain authoritative.
- No duplicate facility grid or mobile-only construction path was introduced.
- Facility tile buttons continue to call the established `buildFacility(x,y)` path.
- Standard/Desktop Base layout and save format 4 are unchanged.

## Implementation seam
- `data-aegis-base-layout` owns `--aegis-base-drawer-width`.
- The fixed Base sidebar consumes that variable.
- When `data-mobile-base-drawer` is non-empty, `data-aegis-base-primary` reserves the same width plus the drawer gap and remains left aligned.
- `data-aegis-base-grid` remains square and `max-width:100%` in the reserved workspace, allowing uniform shrink rather than drawer overlap.
- On narrow portrait phones, opening a Base drawer temporarily hides both command rails and reduces root padding so the board and drawer can split the full screen; a sticky **Close panel** control inside the drawer restores the rails.

## Field gate
On Mobile · Adaptive Base, open Build, choose a facility, and confirm every legal square across the full 6×6 board remains visible and tappable. Repeat with other Base drawers and on tablet sizing.

---

# CODEX HANDOFF — v0.26.09.07.1404_MOBILE_BASE_COMMAND_ADAPTIVE_LAYOUT_PATCH

## Scope
Second systematic Mobile · Adaptive screen pass. Preserve the accepted Geoscape and convert the Base command screen into a fixed phone/tablet workspace targeting a 1080×2340-class portrait smartphone while scaling upward to tablets. Save format remains 4.

## Implemented
- Mobile Base command root is fixed to the device viewport between the established scrollable command rails.
- The 6×6 facility grid is the persistent center workspace with a compact base selector/storage header.
- Right rail adds Base Info, Activity, Defense, Facility, and Build drawer toggles.
- Each drawer uses independent vertical scrolling and does not dismount the underlying base grid.
- Existing Base Info, activity layer, defense readiness, selected-facility/hangar controls, V.A.L.A.N.T. facility controls, and facility construction UI are reused rather than duplicated.
- Portrait phone presentation hides facility-name ribbons on the 6×6 tiles to protect touch target/readability; tablet sizing expands the board/drawers.
- Standard/Desktop Base remains untouched.

## Invariants
- Save format 4 unchanged.
- Facility placement/cost/upkeep and 2×2 Hangar footprint authority unchanged.
- Hangar assignment/order/rebase/ferry authority unchanged.
- Base Activity and Base Defense calculations unchanged.
- Browser 1345 Geoscape/Terminator correction, Browser 1258 master mute and remembered Resume speed, and PWA behavior retained.

## Field gate
Test Base on the same physical phone used for Geoscape acceptance, then on a representative tablet. Confirm no whole-page Base scrolling, complete grid visibility, independent rail/drawer scrolling, facility selection/build flow, Hangar controls, and Standard interface parity.

---

# CODEX HANDOFF — v0.26.09.07.1345_MOBILE_TERMINATOR_COMPOSITOR_SCALE_HOTFIX

## Scope
Field hotfix for the Browser 1258 mobile Terminator Map fill failure shown in the September 7 screenshot. Save format remains 4.

## Root cause
The Terminator background is not a static image with blank margins. `GlobalTickStableCompositorTerminatorSolarSurface` generates a 720×360 canvas and fills its parent. Browser 1258 also shipped an overly broad mobile CSS rule:

`[data-aegis-terminator-map-root] > div.pointer-events-none { transform: scale(.82); ... }`

The actual solar compositor is one of those direct children, so the background was rendered at 82% while the root and marker canvas stayed full-size.

## Implemented
- Remove the accidental compositor `scale(.82)` rule.
- Keep the generated base map, day/night mask, full-size marker canvas, and pointer coordinate space aligned to the same Mobile · Adaptive viewport.
- Preserve Browser 1258 master mute and remembered Resume speed.
- Preserve desktop Terminator behavior and save format 4.

---

# CODEX HANDOFF — v0.26.09.07.1258_MOBILE_GEOSCAPE_TERMINATOR_AUDIO_TIME_RESUME_HOTFIX

## Scope
Physical-phone follow-up to Browser 1231. Preserve the accepted fixed Mobile Geoscape while correcting Terminator scaling and adding two small mobile quality-of-life controls. Save format remains 4.

## Implemented
- Mobile-only Terminator root now flex-fills the full center strategic pane and overrides the desktop `aspect-ratio: 2/1`; Standard/Desktop remains unchanged.
- Right mobile rail adds master Mute / Unmute for music, SFX, and recorded voice. Individual audio settings remain intact; device-local mute preference restores them on Unmute.
- Pause / Resume tracks the last nonzero Geoscape compression rate in device-local storage and resumes that exact rate.
- Resume button identifies the stored rate (for example `Resume 30m`).

## Preserve
- Browser 1231 fixed Geoscape/scrollable rails/drawers.
- PWA orientation `any`.
- Save format 4, strategic simulation, day/night clock authority, map targeting, incident/UFO/base/range/ferry behavior.

---

# CODEX HANDOFF — v0.26.09.07.1231_MOBILE_GEOSCAPE_ADAPTIVE_PHONE_TABLET_LAYOUT_PATCH

## Scope
First systematic mobile optimization patch: Geoscape only. Target a 1080×2340-class portrait phone and scale upward to tablets without changing strategic authority or save format 4.

## Implemented
- Fixed mobile Geoscape command viewport; no whole-page vertical scroll while Geoscape is active.
- Persistent Globe/Terminator center between independently scrollable rails.
- Mobile drawers: Time / Status, Routes, Operational Overlays, New Base.
- Mobile-only base-placement cancel action.
- Adaptive phone/tablet rail/drawer sizing.
- PWA orientation changed to `any` to permit portrait use.

## Preserve
- Standard desktop UI behavior.
- Save format 4 and all campaign data.
- Existing globe pointer-capture hotfix, range/ferry overlays, incidents, UFO interception, aircraft travel, and base placement authority.

## Next requested work
After field acceptance of the Geoscape, continue screen-by-screen mobile optimization using the same principle: keep the primary workspace visible and move secondary controls into independently scrolling rails/drawers/sheets.

---

# Codex Handoff — v0.26.09.07.1127_PWA_INSTALLABLE_APP_SHELL_PATCH

Implemented installable PWA support around the existing Project Aegis browser host.

## Release identity
- Build: `v0.26.09.07.1127_PWA_INSTALLABLE_APP_SHELL_PATCH`
- Save format: `4` unchanged
- Canonical runtime: `src/browser-runtime.html`
- Playable host: `index.html`
- Runtime bytes: `6609480`
- Runtime SHA-256: `e29670f59967c93d6d0290152771154fbfde2412d4831e7427ffc3edafbab725`

## Added files
- `manifest.webmanifest`
- `service-worker.js`
- `assets/icons/aegis-192.png`
- `assets/icons/aegis-512.png`

## Behavior
- Installed PWA requests landscape; uses fullscreen where supported, standalone fallback otherwise.
- Host captures `beforeinstallprompt`; runtime exposes Install Aegis on start screen and Menu / Save.
- iOS/no-programmatic-prompt path provides Add to Home Screen guidance.
- Service worker is secure-context gated and uses network-first navigation plus opportunistic static caching.
- `file://` remains playable and does not attempt service-worker registration.

## Important deployment note
Deploy the entire patch over the existing repository so the existing `assets/` tree remains present. The patch ZIP contains the changed/new release files; it does not duplicate the game's pre-existing large asset library.
