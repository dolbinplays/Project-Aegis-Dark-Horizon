# Codex handoff — 2115 Tools / Editors rendered-runtime hotfix

Field report: 2051 showed no Tools / Editors control on Save / Load. Screenshot confirmed the game UI was still rendering the older browser runtime while 2051's launcher support files existed outside that rendered document.

2115 changes only the launcher delivery/access layer:
- service-worker navigation response is transformed to append `assets/runtime/aegis-tools-editor-launcher-runtime.js`;
- launch cache key is bumped to `aegis-launch-shell-v3-tools-editor-hotfix`;
- launcher recursively observes accessible iframe/srcdoc documents and installs into whichever document contains the Project Aegis UI;
- existing prop-library loader remains as a secondary bootstrap path;
- editor/gallery remain 2051 artifacts and continue to use separate-window return behavior;
- save format remains 4.

Field test after deployment: fully close installed app, relaunch, then Menu / Save. `Tools / Editors` should appear in the top row next to existing system controls. If first relaunch activates the new worker but still shows the old shell, close/relaunch once more and record service-worker/cache state.
