# Stand before movement — Browser 0005

Two defects were found: automatic movement stance changes were free, and AI snapshot/playback omitted kneeling state, allowing an old crouched pose to survive movement.

Movement now budgets the existing 4 TU standing cost. Common commit validation refuses unaffordable stand-plus-step and incapacitated human movement. AI route budgets reserve standing TU; main/emergency movement, escort leaders/support/traffic yields and manual route preflight deduct it once. Fear route budgets reserve standing cost before their existing all-turn expenditure. Playback does not charge TU: authoritative snapshots contain kneeling, moving soldiers stand at the previous cell before timed steps, and final snapshots restore any stationary kneeling. Carried casualties remain downed.

Automated coverage: affordability boundary, downed rejection, multi-step budget, escort stance and one-time charge, no mutation of input units, playback pose/authority wiring, and an actual AI round with stance-bearing snapshots. Escort obstacle and marker regressions also pass. Hybrid persistence and TPV regressions rerun for release. Build seam, embedded JS and whitespace checks required. Full repository suite not rerun.

Field acceptance pending: observe kneeling soldiers through AI and Hybrid support turns, formation following, rescue/escort and retreat; verify standing before the first step in 2D/Iso/FPV/TPV, insufficient-TU holds, stationary kneeling and save/load during playback.
