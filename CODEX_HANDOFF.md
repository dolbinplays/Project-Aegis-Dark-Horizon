# CODEX HANDOFF — v0.26.09.07.2330_MOBILE_COMMAND_LAYOUT_REVIEW_FIX_PATCH

Reviewed browser patches 2059, 2141, and 2258 against patch 1925. Fixed Orders clipping on short landscape phones, generic mobile modal CSS overriding dedicated sheets, construction-sheet horizontal overflow, and a stale src/manifest.json that broke the canonical release checks.

Restored the missing in-game patch 2141 record from its original commit and extended the release checker to retain the 2059/2141/2258 records.

Orders now has a bounded flex dialog, a map that fits its allocated space, and a separately scrollable sidebar. At short landscape heights the header hides explanatory prose and keeps selectors and action buttons in one row. Objective decisions retain their explicit 10010 layer and persistent footer. Facility authorization retains the visible 6x6 board and its portrait/tablet widths.

The prior report of an entire AI turn apparently stopping has a documented cause in patch 2059: a required objective decision opened under mobile chrome. That fix is retained. No independent AI planning/playback deadlock was reproduced during this review, so no speculative AI authority changes were made.

Release source of truth: update CURRENT_GAME_BUILD and all three src/manifest.json browser build fields together, then run node tools/package-runtime-shell.cjs. Do not treat the source manifest as an optional manual deployment step. See VALIDATION_SUMMARY.txt for the exact checks and known Build Health baseline.

Next systematic mobile target remains Mainframe Database, then Soldiers/Barracks after field acceptance.

---

# CODEX HANDOFF — v0.26.09.07.2258_MOBILE_QUARTERMASTER_INVENTORY_ADAPTIVE_LAYOUT_PATCH

## Patch focus

Third systematic strategic-screen Mobile · Adaptive pass after Geoscape and Base: make Quartermaster / Base Stores comfortable on a tall phone while scaling cleanly to tablets and preserving Standard/Desktop.

## Implemented

- Mobile Quartermaster command root is fixed to the device viewport between the established scrollable rails.
- Compact mobile section strip: **Stores / Loadout / Upgrades / Status**.
- Each section owns bounded vertical scrolling; the command page itself does not scroll.
- Loadout Counter selects a living soldier stationed at the selected base and reuses existing `equipFromInventory`, `removeEquipmentFromSoldier`, and `changeSoldierMedkit` authority.
- Stores retains buy/sell/transfer/logistics behavior. Phone item cards collapse long descriptions behind Details; touch targets are enlarged.
- Tablet Stores uses a two-column stock-card layout.
- Standard/Desktop keeps the existing two-column Quartermaster screen.

## Authority preserved

No changes to inventory counts, base-local ownership, storage capacity, prices, transfer fees/timing/cancellation, research locks, Workshop manufacture rules, soldier equipment state, campaign state, or save format. Save format remains 4.

## Next mobile target

Mainframe Database, then Soldiers/Barracks after Quartermaster field acceptance.

---

# CODEX HANDOFF — v0.26.09.07.2141_MOBILE_COMMAND_WINDOWS_AND_PLACEMENT_COHABITATION_PATCH

## Patch focus

Continue the systematic Mobile · Adaptive interface pass without changing tactical or strategic authority. This release gives the tactical **Orders** and **Assign Objectives** workflows deliberate phone/tablet layouts and applies the established workspace-cohabitation rule to **New Base placement** and **facility construction confirmation**.

## Implemented

- **Orders / Hybrid Fire-Team Command Map:** map-first mobile command workspace with compact controls, bounded internal scrolling, phone roster reduction, and tablet map/sidebar split.
- **Assign Objectives:** full-height mobile decision sheet with a compact header, horizontal known-objective strip, vertically scrolling fire-team assignments, and persistent action controls.
- Browser 2059 modal layering remains authoritative: Assign Objectives stays above Mobile tactical chrome and below the higher-priority escort-support decision.
- **New Base:** the placement drawer owns reserved right-side width; Globe/Terminator stays mounted, shifts left, and scales into the remaining selectable strategic workspace.
- **Facility Build Confirmation:** confirmation becomes a right-side sheet over the Build region rather than a full-screen blocker. The 6x6 base board reserves the same width and remains visible/tappable for location verification.
- Narrow portrait phone layouts may temporarily hide command rails while placement/authorization sheets are active; tablets keep more simultaneous chrome.

## Authority preserved

No changes to objective discovery semantics, Hybrid order semantics, Simulation AI, pathfinding, TU, LOS, fog, damage, facility costs/footprints, base-site coordinates, campaign state, or save data. Save format remains 4. Standard/Desktop presentation is unchanged.

## Field gate

Test at a 390x844-class portrait viewport and a representative tablet: Orders map interaction; Assign Objectives scrolling and Apply/Cancel; New Base selection at far planet edges with the drawer open; and facility confirmation while verifying the selected far-left/far-right/top/bottom tile remains visible on the 6x6 board. Repeat the Browser 2059 new-objective discovery flow under Mobile · Adaptive.

---

# CODEX HANDOFF — v0.26.09.07.2059_MOBILE_OBJECTIVE_ASSIGNMENT_MODAL_LAYERING_HOTFIX

## Patch focus

Mobile · Adaptive tactical objective-assignment layering hotfix. Simulation AI could appear to stall when a newly discovered objective opened the fire-team assignment board because the modal requested an uncompiled `z-[10010]` Tailwind utility and therefore rendered beneath the mobile tactical layer. Switching to Standard controls exposed the already-pending decision, confirming that AI was waiting rather than deadlocked.

## Implementation

- `FireTeamObjectiveAssignmentOverlay` remains portaled to `document.body`.
- The overlay now sets inline `zIndex: 10010`, making modal authority independent of Tailwind compilation.
- The precompiled stylesheet also includes `.z-[10010]{z-index:10010}` as a secondary guard.
- Mobile tactical chrome and rails remain below the command modal.
- Escort-support contact assignment remains at z-index 10020 and therefore still supersedes objective assignment when that higher-priority tactical decision is active.
- Existing objective-assignment viewport bounding, internal scrolling, transactional Cancel/Apply behavior, and focus restoration are preserved.

## Authority preserved

No AI decision-making, round scheduling, pathfinding, movement, TU, LOS, fog, damage, objective discovery, fire-team assignment semantics, save data, or save-format changes. Save format remains 4.

## Field reproduction / acceptance

1. Select Mobile · Adaptive, start a tactical mission, and hand control to Simulation AI.
2. Reach a point where a new mission objective is discovered.
3. Confirm **New Mission Objective Identified / Assign fire teams to known goals** appears immediately above the battlefield and mobile rails.
4. Apply or cancel the assignment and confirm Simulation AI continues normally.
5. Repeat on PC while Mobile · Adaptive is selected, then on an actual phone.
6. Confirm switching to Standard controls is no longer necessary to reveal the pending decision.

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
