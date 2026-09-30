# Browser 0021 — Reserve TU clarity and beacon completion

- Firing modes no longer own TU costs: Single 1 round / 0 penalty, Burst 3 / -14 accuracy per round, Full Auto 6 / -28. Manual and AI use Snap 14 TU or Aimed 22 TU. Existing weapon-mode upgrade restrictions and ballistic ammo limits remain. Energy weapons retain their established unlimited-ammo behavior.
- Reserve options: None 0, Snap 14, Aimed 22, Kneel 4. Aimed now also changes actual manual attack cost/accuracy. None and Kneel use Snap firing. Old Auto/Burst reserves migrate to Snap without changing fire mode.
- Movement accounts for the existing 4 TU standing cost before calculating steps. Door opening and dragging/escort costs cannot spend the protected reserve. Kneel reserves the later kneel even if standing up is needed first.
- Reaction bursts roll each round independently, return actual hit counts and deduct rounds fired.
- Confirmed active beacons now block victory regardless of mission-type exemption or principal extraction shortcut. Successful finalization rechecks live beacon state before discarding the battlefield. Unknown function, disabled/destroyed devices and withdrawal remain distinct.

Focused tests exercise timing/round combinations, stance/reserve boundaries, legacy selection, independent reaction hits, mission-type beacon requirements and principal extraction after neutralization. Existing stance and principal-rescue regressions are included.

All 35 focused checks pass (7 new, 12 principal-rescue, 4 stance, 6 incoming-fire and 6 AI-priority checks). Build consistency, packaging, embedded JavaScript syntax and whitespace checks pass. A fresh Edge tactical session verifies all reserve labels and confirms Aimed remains 22 TU after selecting Full Auto. The controls render without page errors. Preview: `E:/JoshGameProjects/GitHub/PADH GPT Files/character-performance/reserve-0021.png`.

Installed-game acceptance: compare displayed reserves and TU spent for all firing modes; move a kneeling soldier with Snap/Aimed/Kneel reserve, including doors and escorts; finish rescue and combat missions with a confirmed active beacon, then neutralize it and confirm victory becomes available. Save format remains 4.
