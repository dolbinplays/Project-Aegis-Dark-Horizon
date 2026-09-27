# Beacon color rings — September 27 build 0001

Presentation only: one cyan ballistic-immunity ring and one magenta energy-immunity ring derived by calling the existing damage-blocking function. Combined shields receive both. No new shield/save state or combat rule. Disabled/destroyed/ordinary covers receive none.

Both 3D cover renderers add small crown geometry within their existing beacon model. Persistent rendering retains its ordinary revealed/current-visibility gate. Materials remain depth tested, with bounded geometry (up to two low-segment toruses per beacon); normal cover disposal releases them. Shield/state changes participate in the persistent cover dependency key. No label, tooltip, tutorial, objective/log explanation or patch-history explanation was added.

Validation: four ring tests plus ten prior TPV/review regressions; build seam, embedded JS syntax, whitespace checks. Full repository suite not rerun.

Field acceptance pending: inspect kinetic/combined/unshielded, disabled and destroyed beacons in Iso/FPV/TPV; compare daylight/night and render qualities, lose/reacquire visibility, save/reload and confirm subtle readable rings without hidden-location disclosure.
