# Browser 0040 — Civilian Objective Standing-Order Suspend + Resume Validation

Build: `v0.26.10.02.0040_CIVILIAN_OBJECTIVE_STANDING_ORDER_SUSPEND_RESUME_HOTFIX`  
Save format: `4`

## Problem

Assign Objectives previously cleared `fireTeamCommand*` state whenever a fire team was assigned to a civilian/VIP. That made a Patrol/Fallback/Check order disappear instead of behaving as a lower-priority standing instruction that should resume after rescue.

## Fix

- Existing Patrol Route, Fallback Post, and Check Location orders enter a persisted `suspended-objective:<prior-status>` state when a civilian/VIP, casualty-recovery, or Assist assignment temporarily owns the team.
- Command identity, target, patrol route, patrol index, issue round, preferred-target metadata, and blocked reason remain intact.
- Suspended standing orders are excluded from execution while the objective is active.
- Returning the team to Default after the temporary objective clears restores the original active/holding/blocked state.
- Changing civilian/VIP targets does not reset the suspended route.
- Orders UI renders the suspended route and explicitly labels it `SUSPENDED BY ASSIGNED OBJECTIVE`.
- Legacy one-shot Move / Hold remains temporary and is intentionally replaced by objective assignment.

## Automated coverage

`tools/test-civilian-objective-standing-order-0040.cjs` verifies:

1. VIP assignment suspends rather than clears an active patrol.
2. The explicit VIP assignment remains authoritative while patrol is suspended.
3. Reassigning to another VIP preserves the same route and index.
4. Clearing/completing the VIP objective resumes the exact patrol waypoint.
5. Blocked standing-order state and blocker reason survive override/resume.
6. Legacy Move/Hold remains destructively temporary.
7. Unified Orders exposes the suspended route/status.
8. Fallback Post resumes with its original target.
9. Check Location resumes with its original target.
10. Existing streamed snapshot fields carry all required save/load state.

The inherited Browser 0038 escort-authority fixture and Browser 0039 breach/standing-order fixture must remain green.

## Field acceptance

Advance a Patrol beyond waypoint 1, assign a VIP/civilian, save/reload during rescue, complete the rescue, and confirm the same team resumes the original route at the saved waypoint. Repeat with Fallback Post and Check Location, and verify Clear Order still intentionally removes a suspended standing order when the commander explicitly presses it.
