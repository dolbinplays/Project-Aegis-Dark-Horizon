Alien Response Command / Project Aegis
v0.26.07.04.0031_THREE_GEOSCAPE_CAMERA_TICK_SNAP_FIX_INDEX_ONLY_PATCH

Patch type: INDEX_ONLY

Summary:
- Restores Geoscape camera ownership separation for the Three.js globe.
- Prevents passive render/tick/base/incident/cloud/UFO/solar refreshes from recentering the player camera.
- Keeps selected base/incident UI selection separate from globe viewCenter.
- Makes incident marker clicks explicitly focus the globe, while selectedIncidentId refreshes only sync the focused-region label.
- Keeps reset token and cinematic travel as intentional camera owners.
- Adds stronger Build Health coverage for passive render/incident-refresh and explicit incident-click focus behavior.

Validation performed:
- Extracted main game script from index.html and ran node --check successfully.
- Ran targeted static assertions confirming the duplicate geoscapeShouldAutoFocusCamera declarations were both patched and old selected-incident camera effect was removed.
