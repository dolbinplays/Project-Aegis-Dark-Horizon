# TPV observer camera — Browser 0016

Right-drag orbits the TPV camera around its actor-relative look point; scroll changes distance within bounded limits. A stored yaw, pitch and distance scale is applied afresh for each actor and facing. Reset Camera mutates the shared preference to default. The component retains that preference when its renderer is rebuilt for a quality change. It lasts for the mounted tactical view, not across campaign reloads.

Input is accepted only while the normal TPV camera owns the view. Reaction and cinematic cameras cannot overwrite the preference. Pointer capture/cancellation and click suppression prevent an orbit gesture from becoming a tactical map click. Disposal removes the added context-menu and wheel listeners.

## Validation
- Five real-Three.js behavioral tests in tools/test-tpv-observer-orbit.cjs: default pose parity; drag/wheel and repeated actor switches without drift or actor mutation; relative-facing rotation; reaction/cinematic priority and reset; FPV input isolation and zoom bounds.
- Five prior review tests protect UFO flight alignment, late observation, geometry cleanup and medical stabilization.
- Build seam, embedded JavaScript syntax and whitespace checks.
- Full repository suite not rerun.

## Field acceptance
Observe AI soldiers in TPV; right-drag and scroll, then let playback switch actors. Verify the chosen view carries. Trigger an incoming-fire/boarding/UFO cinematic and confirm return. Press Reset Camera. Also change rendering quality, switch FPV/TPV, and check that ordinary map left-drag still pans. Visual/browser interaction acceptance remains pending.
