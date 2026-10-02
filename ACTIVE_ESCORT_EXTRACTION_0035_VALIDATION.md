# Active Escort Extraction Persistence — Browser 0035

Browser 0035 fixes an escort-owner stall where a soldier could display Escort Duty while the objective HUD fell back to Priority 3 visible-alien combat and the escort leader held position for several rounds instead of moving VIPs/civilians toward extraction. Save format remains **4**.

## Root cause

Two older seams could suppress Priority 2 escort authority. First, `tacticalEscortFollowers` excluded a civilian whenever that civilian's `panic` flag was set, even when the authoritative `escortId` still named the same living escort. The leader could therefore lose the active-escort lock while the UI and civilian state still showed an escort relationship. Second, the established escort leader still consumed ordinary fire-team formation pacing; scattered support soldiers could reduce the leader's movement allowance to zero before the VIP column advanced.

## Correction

- A living, non-rescued civilian/VIP with a valid `escortId` remains an owned escort follower even while panicked/frightened. Fear can still alter civilian movement and cover-seeking, but it no longer releases the escort owner to lower-priority combat.
- The active escort leader remains **Priority 2**, above visible alien contact (**Priority 3**), until the escort is genuinely released/resolved.
- Established escorts bypass ordinary fire-team reformation pacing. Support soldiers may catch up or use the configured escort-support doctrine, but they cannot make the escort leader wait in place.
- Civilian-column catch-up pacing remains authoritative: a lagging VIP can still slow the leader to half pace, so the leader cannot outrun the people being escorted.
- Existing evacuation routing, doors/breaches, Skyranger ramp authority, panic movement, TU, hazards, occupancy, and save format 4 are preserved.

## Verification

Focused Build Health coverage checks that a panicked escorted VIP remains a follower, the escort-leader lock remains active, Priority 2 beats visible contact, established escort movement bypasses fire-team reformation pacing while preserving civilian catch-up pacing, and save format remains 4.

## Manual acceptance

Assign/establish an escort, allow visible alien contact to scatter the fire team and frighten one or more VIPs, then continue AI play. Confirm the escort owner retains Priority 2, advances the VIP column toward the Skyranger without waiting for support formation, slows only when the civilian column itself needs to catch up, and does not abandon the escort for ordinary visible-alien combat.
