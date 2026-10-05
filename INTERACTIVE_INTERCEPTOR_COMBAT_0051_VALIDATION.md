# Interactive Interceptor Combat — 0051

Build: `v0.26.10.04.0051.1_INTERCEPTOR_COMBAT_REVIEW_HOTFIX`
Save format: `4`

## Contract
- Regular 1/Pair interceptor launches open an optional Pursuit → Weapons Solution → Breakaway player-skill overlay before fuel, ammunition, or sortie state is committed.
- Auto Resolve applies neutral modifiers and preserves the existing strategic resolver.
- Pursuit + Weapons can modify hit estimate only from -8 to +16 percentage points.
- Excellent Weapons can add at most one damaged-UFO severity level to an already-Damaged Escape outcome.
- Breakaway scales existing interceptor damage only from x0.70 to x1.20.
- Weapons performance scales ammo pressure only from x0.90 to x1.10.
- Global staggered swarms remain strategic Auto Resolve because their aircraft arrive at separate impact times.
- Save format remains 4.

## Automated checks
- Runtime executable script blocks parse with Node.
- Service worker parses with Node.
- Host embedded payload matches `src/browser-runtime.html` byte-for-byte and by SHA-256.
- 0051 contract helper verifies Auto Resolve neutrality, hit bounds, return-damage bounds, one-level UFO damage cap, deterministic stage targets/scoring, and save format 4.
- Static integration checks verify regular launch opens the 0051 minigame and the recursive committed launch passes `interactiveModifiers` into the existing resolver.
- Existing 0050 Resonance Lock and 0049 Signal Intrusion code remains present.

## Field acceptance
1. Launch one interceptor and a pair against detected UFOs; verify the three-stage overlay appears before the sortie commits.
2. Use mouse/touch and keyboard arrows on each vector slider.
3. Deliberately score very high and very low; verify the report shows a pilot modifier but never exceeds -8/+16 hit points.
4. Produce a Damaged Escape with an excellent Weapons score and verify damage memory may advance one additional level, never beyond the established level-3 cap.
5. Compare excellent/poor Breakaway outcomes and verify repair damage remains governed by the existing outcome/stance/threat calculation with only x0.70–x1.20 scaling.
6. Use Auto Resolve and verify the pre-0051 strategic result path remains neutral.
7. Abort before Pursuit commit and verify no fuel/ammo/sortie state is spent.
8. Launch All Interceptors and confirm staggered swarm behavior remains unchanged and does not require multiple simultaneous minigames.
9. Save/load during interceptor travel and verify travel/recovery continuity.

## Review hotfix — October 5, 2026
- The initial overlay left campaign time running while its launch callbacks retained the opening UFO/fleet state. Campaign advancement is now blocked throughout interception, including forced advancement; the existing clock speed/running preference is preserved.
- Keyboard focus is contained in the dialog; the game root is inert until dismissal. Native slider arrows still work, stage changes focus the slider, and closing restores the opener.
- Stage transitions and exit callbacks settle once. A delayed initial focus callback cannot focus a removed dialog.
- Neutral normalized modifiers remain neutral when passed back through the resolver.
- Canonical source manifest was still 0050; it now matches the hotfix release.

## Automated result — reviewed package
- Mandatory packaging gate: **56/56 tests pass**, including six new interceptor runtime tests.
- New tests cover clock blocking/unblocking, abort without launch, Auto Resolve exactly once, three-stage exactly-once completion, keyboard focus containment, neutral modifier round trips across 600 combat rolls/stances/formations, and UFO damage severity caps.
- `node tools/check-embedded-js.cjs`: PASS (9 non-empty script blocks across 4 HTML files).
- `node tools/check-aegis-build.cjs`: PASS, including packaged runtime/source parity and build seams.
- Launch host structural validation: PASS in canonical packaging.
- Runtime byte count: 7811404.
- Runtime SHA-256: `02ad94ae5805a8a4837f5a5b07f4a9423b150eef7f9d9f5ac744c406ec3558f7`.
- Full installed-game mouse/touch and save/travel field acceptance remains pending; automated dialog checks use a DOM test fixture.
