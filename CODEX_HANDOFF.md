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
