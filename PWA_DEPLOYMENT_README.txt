PROJECT AEGIS / ALIEN RESPONSE COMMAND — PWA DEPLOYMENT
Build: v0.26.09.07.2059_MOBILE_OBJECTIVE_ASSIGNMENT_MODAL_LAYERING_HOTFIX

BUILD FROM SOURCE
1. Edit src/browser-runtime.html for game changes and tools/package-runtime-shell.cjs for host/PWA changes.
2. Synchronize CURRENT_GAME_BUILD with src/manifest.json (currentBuild, lastInspectedBuild, and gameplayParity.browserBuild), and update the patch notes and Game Bible.
3. Run node tools/package-runtime-shell.cjs. It retains the PWA shell, embeds the runtime, versions both service-worker caches, and refreshes release-metadata.json hashes.
4. Run node tools/check-embedded-js.cjs, node tools/check-aegis-build.cjs, and node --test tools/test-mobile-pwa-regressions.cjs before deployment.

HOW TO DEPLOY
1. Copy the contents of this patch over the matching files in the existing Project Aegis GitHub Pages repository.
2. Keep the repository's existing assets/ tree. This patch ZIP includes only the new PWA icon assets under assets/icons/ and does not duplicate the game's large existing asset library.
3. Commit/push the canonical source, packaging tools, src/manifest.json, index.html, release-metadata.json, manifest.webmanifest, service-worker.js, assets/icons/, and updated docs.
4. Wait for GitHub Pages to publish the HTTPS site, then open it on the phone.
5. On a supported Chromium browser, use Install Aegis App on the start screen/Menu when available. On iPhone/iPad, use Share > Add to Home Screen.
6. Launch the installed Aegis icon from the home screen/app launcher. The installed window uses fullscreen where supported and standalone otherwise, removing the normal browser address bar.

LOCAL TESTING
- Ordinary file:// play remains supported.
- PWA installation/service workers do not activate from a normal file:// launch.
- For local PWA testing, use localhost/HTTPS rather than opening index.html directly.

UPDATE NOTE
The packager updates both build-versioned caches so old Aegis caches are retired on activation. Only navigation to the game root or index.html updates the offline launch page; editor and QA pages cannot replace it.

Mobile Geoscape note (Browser 1231): the manifest now allows any orientation so the adaptive Geoscape can run in portrait on tall smartphones and scale through tablets.

Browser 1258 note: the service-worker cache key advances for the Terminator/audio/time-resume mobile follow-up. Manifest orientation remains `any`.

Browser 2059 note: Mobile · Adaptive Assign Objectives now owns an explicit z-index 10010 above tactical chrome; the service-worker cache key advances so installed PWAs receive the modal-layer fix.
