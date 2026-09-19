# v0.26.09.18.2115 — In-Game Tools / Editor Rendered Runtime Hotfix

- Fixes the missing **Tools / Editors** button reported on the Save / Load screen after 2051.
- Root cause: 2051 loaded the launcher through the transformed prop-library/service-worker path, which did not guarantee execution in the document that actually renders the Project Aegis React UI.
- The service worker now injects the launcher directly into the navigation shell.
- The launcher now discovers and observes same-origin / `srcdoc` runtime iframes and installs controls into the actual rendered game document.
- Adds launcher access to Save / Load, Command Settings, expanded System controls, minimized header, and tactical mini-header.
- Bumps the persistent launch-shell cache to v3 so the previous unmodified cached shell cannot mask the hotfix.
- Prop Editor and Runtime Test Gallery still open in separate windows/tabs and leave campaign state untouched.
- Save format remains 4.
