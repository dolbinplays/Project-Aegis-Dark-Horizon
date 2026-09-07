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
