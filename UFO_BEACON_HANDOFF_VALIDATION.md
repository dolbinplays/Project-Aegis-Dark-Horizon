# UFO-to-beacon handoff

Build: v0.26.09.25.0001_UFO_BEACON_HANDOFF_PATCH

New UFO arrivals carry version-2 landed state and a fixed handoff deadline R+2, guaranteeing the entire subsequent tactical round. Manual and AI reinforcement phases use one transition helper. Source-specific craft covers are removed and one stable-ID beacon is committed; units/wave count are untouched. The departed craft record persists for replay/save safety and removes its matching renderer placement.

Seven behavioral tests cover deadline, duplicate planting/arrival rejection, no premature victory, save/load, blocked anchor retry, hidden handoff, unrelated craft preservation, and actual AI round resolution with no remaining aliens. Existing landing tests cover safe placement.

Limits: this applies to new arrivals through the existing UFO reinforcement path. Initial and replacement beacon routing is not yet converted. Version-1/legacy craft are not retrofitted. Flight approach and animated takeoff remain pending; departure currently updates authoritative/rendered state without the final flight animation. The stored hull anchor is retained; exact geometric-center reservation remains future work.

Live Manual/Hybrid/Classic/PWA acceptance remains pending. Save format is 4.

Validation results: full suite before the final Build Health fixture update: 509 tests, 474 passed, 35 pre-existing failures; no new failure names. After updating the sequential-wave contract to execute the handoff and acknowledge committed arrival units, all 11 targeted handoff/landing tests pass, including that Build Health contract. Repackaged build, syntax and whitespace checks pass. Full-suite log: E:/JoshGameProjects/GitHub/PADH GPT Files/ufo-beacon-handoff/regressions.txt.
