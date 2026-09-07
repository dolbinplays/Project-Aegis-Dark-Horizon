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
