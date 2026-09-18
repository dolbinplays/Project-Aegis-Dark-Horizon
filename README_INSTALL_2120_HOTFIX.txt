AEGIS v0.26.09.17.2120 PROP TEST GALLERY INSTALLED APP URL HOTFIX

PURPOSE
Fixes the Runtime Test Gallery launcher crash seen in Installed App Mode:
  TypeError: Failed to construct 'URL': Invalid URL

ROOT CAUSE
The 2058 launcher resolved the gallery relative to location.href. In the installed-app shell,
the playable/settings document can run from an about:srcdoc context. about:srcdoc is not a
hierarchical URL and cannot be used as the base for new URL('./gallery.html', location.href).

FIX
The launcher now resolves the Project Aegis repository root from the already-loaded
assets/data/aegis-prop-library.js script URL first. This works for:
- GitHub Pages / installed PWA
- normal browser mode
- local file:// development copies
It also has top-window/document-base fallbacks when needed.

INSTALL
1. Close Project Aegis if it is open.
2. Extract this ZIP directly into the root of Project-Aegis-Dark-Horizon.
3. Allow Windows to merge folders and replace files.
4. Commit/push the changed files as usual.
5. Let the installed app update, then try Ctrl+Shift+G again.

FILES TO PUSH
- assets/data/aegis-prop-library.js
- AEGIS_Prop_Runtime_Test_Gallery_CURRENT.html (unchanged from 2058; included for completeness)
- AEGIS_Prop_Runtime_Test_Gallery_v0.26.09.17.2058_PROP_RUNTIME_FIDELITY_AND_TEST_GALLERY_PATCH.html (unchanged from 2058; included for completeness)
- README_INSTALL_2120_HOTFIX.txt
- VALIDATION_SUMMARY_2120_HOTFIX.txt

SAVE FORMAT
4 (unchanged)
