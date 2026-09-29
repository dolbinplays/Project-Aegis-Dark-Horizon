# Civilian/VIP Window Concealment + Pre-Secured Shelter Validation

Build: `v0.26.09.29.0014_CIVILIAN_VIP_WINDOW_CONCEALMENT_AND_PRESECURED_SHELTER_PATCH`

Save format: **4** (unchanged).

## Implemented scope

- Existing building window cover records now carry deterministic `blind` or `curtain` presentation plus open/closed/destroyed state.
- A closed intact covering blocks ordinary line of sight through that window aperture. It does not add ballistic armor, movement blocking or a second window-damage system.
- Shattering the authoritative window destroys its covering and immediately removes the concealment effect.
- When civilians/VIPs complete their existing shelter-securing step, intact coverings belonging to that building close and exterior sightlines are broken. Existing Last Known Contact behavior remains responsible for remembered positions.
- VIP-bearing tactical deployments choose a deterministic valid building with doors, windows and enough clear interior cells. Initial VIP positions are moved into that building, its existing doors begin closed/locked under shelter authority, and its intact coverings begin closed.
- This deployment state does not seed alien target knowledge. Alien discovery still depends on the existing LOS/contact/Last Known Contact systems, and Browser 0012 forced entry still requires legitimate knowledge before a locked entrance may be breached.
- Closed coverings render in Three.js and 2D Hex. Residence/farm/timber windows favor curtains; other building families favor blinds.
- Existing door, window, Call Out, escort, destruction, pathing, Hybrid/Simulation and save authority remain shared. No save-schema change was required.

## Automated regression

Focused `tools/test-vip-window-concealment.cjs`: **6/6 passed**.

Coverage verifies:
1. generated windows receive deterministic open coverings;
2. a closed intact covering blocks LOS while reopening restores LOS;
3. shattering a covered window destroys concealment and restores LOS;
4. authoritative VIP deployment starts tracked VIPs inside one locked, covered shelter;
5. non-VIP missions do not receive a pre-secured VIP shelter;
6. ordinary civilian shelter completion closes building coverings and renderer source consumes the covering state.

Inherited suites remain passing:
- Browser 0013 shot-impact sequencing / directional knockback: **6/6**;
- Browser 0012 alien forced entry: **6/6**;
- Browser 0011 cooperative planning/equivalence: **5/5**;
- Browser 0010 planning-query/hazard regressions: **6/6**.

All five executable embedded runtime JavaScript blocks pass syntax validation.

## Installed-game field acceptance

1. Place a civilian/VIP behind an intact open window and establish legitimate alien visual contact. Close the covering and confirm current visual contact is lost while any legitimate existing Last Known Contact remains only remembered information.
2. Repeat with an alien that never observed the occupant; closing/opening the covering must not reveal the occupant or building.
3. Shatter a closed covered window and confirm concealment ends immediately while ordinary window damage/ballistics remain unchanged.
4. Start multiple VIP-bearing incident types. Confirm the VIPs begin inside one usable building, its exterior doors are closed/locked, its relevant blinds/curtains are closed, and no alien receives hidden location knowledge.
5. Reach the shelter with AEGIS and verify existing Call Out / Identify AEGIS, escort acquisition and extraction still function.
6. Give aliens legitimate knowledge of sheltered occupants and verify Browser 0012 forced-entry doctrine can investigate/breach legal entrances without shooting unseen VIPs through closed coverings.
7. Check 2D Hex, 3D Iso, FPV and TPV presentation, including day/night window lighting and shattered-window transitions.
8. Save/reload during concealed shelter state and confirm door/covering state, VIP positions, contact knowledge and save format **4** remain correct.
