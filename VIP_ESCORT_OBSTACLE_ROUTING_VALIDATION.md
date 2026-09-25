# VIP escort obstacle routing

Build: v0.26.09.25.0002_VIP_ESCORT_OBSTACLE_ROUTING_HOTFIX

A runtime fixture reproduces a VIP at (5,5), escort at (8,5), and a three-cell wall at x=6, y=4..6. Twelve follower movement beats previously left the VIP at (5,5), still assigned to the escort and marked blocked. The repaired fixture routes around the wall.

The shared manual/AI follower movement helper now uses bounded hazard-aware paths to formation targets and reachable alternatives when a target is blocked. Adjacent safe targets retain a fast path. Each call advances at most one hex; occupied cells, hard cover, interior ramps and requested building-reentry restrictions are retained. No save-schema changes.

Validation:
- 23 targeted tests pass: obstacle routing, enclosed/occupied/forbidden cells, blocked slots, escort/ramp/traffic contracts, casualty and synchronized movement playback, civilian emergency aid.
- Full regression run: 515 tests, 478 passed, 37 failed. Against the prior baseline, 35 failure names are unchanged; two additional packaging checks passed on isolated rerun (10/10 checks). That run overlapped packaging and encountered a transient runtime file lock; final source/payload consistency checks pass.
- Final package, build seam, embedded JavaScript syntax and whitespace checks pass.
- Logs: E:/JoshGameProjects/GitHub/PADH GPT Files/vip-escort-routing/.

The reported live mission was not captured. This confirms and fixes a matching obstacle-routing defect, not the exact cause in that mission. Installed-game verification remains pending; no live save was changed and no deployment or commit was performed.
