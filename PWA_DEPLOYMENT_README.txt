PROJECT AEGIS / ALIEN RESPONSE COMMAND — PWA DEPLOYMENT
Build: v0.26.09.07.1127_PWA_INSTALLABLE_APP_SHELL_PATCH

HOW TO DEPLOY
1. Copy the contents of this patch over the matching files in the existing Project Aegis GitHub Pages repository.
2. Keep the repository's existing assets/ tree. This patch ZIP includes only the new PWA icon assets under assets/icons/ and does not duplicate the game's large existing asset library.
3. Commit/push index.html, manifest.webmanifest, service-worker.js, assets/icons/, the updated docs, and (if used by your workflow) src/browser-runtime.html.
4. Wait for GitHub Pages to publish the HTTPS site, then open it on the phone.
5. On a supported Chromium browser, use Install Aegis App on the start screen/Menu when available. On iPhone/iPad, use Share > Add to Home Screen.
6. Launch the installed Aegis icon from the home screen/app launcher. The installed window uses fullscreen where supported and standalone otherwise, removing the normal browser address bar.

LOCAL TESTING
- Ordinary file:// play remains supported.
- PWA installation/service workers do not activate from a normal file:// launch.
- For local PWA testing, use localhost/HTTPS rather than opening index.html directly.

UPDATE NOTE
The service worker uses a build-versioned cache. A future patch should update the build/cache identity so old Aegis caches are retired on activation.
