# Browser 0022 — Victory soldier flythrough

The persistent 3D renderer visits eligible surviving conscious AEGIS soldiers in stable fire-team/id order once victory celebration is active and shot/movement/other cinematic effects have cleared. Each normal visit lasts about 2.3 seconds; reduced-motion visits use stationary 1-second holds. Existing poses, effects and music continue.

Close visits interpolate only across explored cells. Distant/unexplored transitions cut to the next actor. TPV obstruction recovery constrains the camera. A visible Skip celebration button restores the ordinary camera; completion, invalid actors, an empty roster and a two-minute bound cannot block mission results. Unmount removes the control. No gameplay or save-state mutations are made; result controls remain available throughout.

Eight focused tests cover eligibility/order, final-action gating, exactly-once completion, invalid/empty actors, reduced motion/unexplored cuts, skip/deadline behavior, real Three.js obstruction clearance and weapon-effect isolation/restoration. Together with existing planning, camera, shield/roof, incoming-shot and reserve/beacon regressions, 35 checks pass. Build packaging, build seam validation and whitespace checks pass.

A fresh headless Edge battlefield preview with 12 mixed-weapon survivors confirmed readable confetti and energy-effect views, progression between soldiers, and the working Skip celebration control, with no page errors. The preview exposed overlapping map-sized effects: close visits now show only the featured soldier's effect at a smaller scale, restoring the full celebration afterward. This synthetic browser preview is not installed-game or hardware performance acceptance.

Installed-game acceptance remaining: win from Iso/FPV/TPV with mixed weapons, indoor/Skyranger-adjacent survivors and casualties. Verify readable framing, skip, reduced motion and normal result progression. Save format remains 4. The 2D renderer retains its existing celebration.
