Alien Response Command / Project Aegis
Patch: v0.26.08.03.0155_ALIEN_COMMANDER_MISSED_CHECKIN_INVESTIGATION_REINFORCEMENT_PARITY_PATCH
Native: v0.26.08.03.GODOT.0025_ALIEN_COMMANDER_MISSED_CHECKIN_REINFORCEMENT_VERTICAL_SLICE

Purpose:
- Start a deterministic 5-to-15-round missed-check-in deadline when the original alien commander dies before making a reinforcement call.
- Send one investigation force if the original alien force is wiped out, the rescue mission remains unresolved, and that deadline expires.
- Share the existing one-reinforcement allowance between commander calls and missed-check-in investigations.
- Reuse the bounded 32-candidate landing search, separation rules, retry behavior, and two-to-four-alien deployment.
- Render the alien landing craft as one layered purple flying saucer with a rear deployment opening and ramp in browser 2D, Three.js, and Godot.
- Preserve save format 4, tactical outcomes, fog of war, and bounded turn work.

Validation performed:
- Godot 4.7.1 strict project parsing passed.
- Native tests passed 144/144, including deterministic 5-to-15-round deadlines, no early trigger, surviving-alien suppression, wiped-force investigation arrival, one-wave ownership, and saucer rendering contracts.
- Native Build Health passed 103/103 inside the automated suite.
- All six browser app scripts parsed and the build seam checker passed.
- Localhost start screen and Geoscape loading passed; Browser Build Health passed 326/326.
- A six-soldier Small 64x64 mission completed three confirmed End Turn cycles with all soldiers alive.
- The live battle switched to Three.js and created one tactical canvas successfully.
- Browser console contained no runtime errors.

Manual gate:
- Kill the original commander before a call, wipe the original aliens while a mandatory rescue remains unresolved, and confirm the displayed deterministic deadline is between 5 and 15 rounds after the commander death.
- Keep the mission active through that deadline and confirm one purple saucer lands, its rear ramp is visible, and two to four investigation aliens deploy.
- Complete an equivalent mission before the deadline and confirm no investigation force arrives.
- In a separate mission, allow a normal commander call and confirm no second missed-check-in force can arrive.
- Repeat on Medium and Large maps, including a two-Skyranger mission, and confirm the saucer never contacts a building or either Skyranger.
- Inspect the saucer and ramp in browser 2D, browser Three.js, and the native Godot tactical view.
