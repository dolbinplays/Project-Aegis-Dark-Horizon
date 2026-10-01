# Browser 0029 — Unified Orders, Patrol Routes + Fallback Posts

Build: `v0.26.10.01.0029_UNIFIED_ORDERS_PATROL_FALLBACK_POSTS_PATCH`
Save format: **4**

## Scope

Browser 0029 expands the existing tactical Orders / Command Map instead of introducing a second command system.

- **Move / Hold** preserves the existing temporary Command Map behavior.
- **Check Location** is a one-time standing order. The fire-team leader routes to the selected point; after a quiet arrival the order clears and normal doctrine resumes.
- **Patrol Route** stores up to 12 unique waypoints and cycles through them deterministically. The leader owns route movement and supporting soldiers continue to use normal fire-team formation behavior.
- **Fallback Post** is a persistent return-and-hold point used only when no higher-priority duty is active.
- **Assign Objectives** opens the existing objective-assignment screen directly from Orders.

Standing orders sit below explicit mission objectives and below the established Default AI priorities. They yield to bleeding stabilization, active escort, visible alien contact, downed AEGIS recovery/extraction, Last Known/distress, Beacon/UFO reinforcement-source work, and known civilian/VIP rescue. They are retained during those interruptions and resume afterward.

Blocked standing routes are retained as `blocked` with an explicit `route-unreachable` reason and retry when battlefield conditions change. The older temporary Move / Hold waypoint retains its existing auto-clear behavior after repeated no-progress.

Patrol route, waypoint index, blocked state and order kind are carried through tactical snapshots/playback merge state. Save format remains 4.

## Automated verification

- `test-unified-orders-0029.cjs`: **13/13** checks passed.
  - patrol route storage and de-duplication;
  - waypoint advancement;
  - deterministic loop back to the first waypoint;
  - persistent fallback hold;
  - one-time Check Location completion;
  - blocked standing-order retention;
  - visible-combat interruption in Simulation/Hybrid autonomous behavior;
  - Beacon/UFO takeover without deleting standing orders;
  - snapshot persistence fields;
  - Orders UI mode/objective-navigation wiring;
  - save format 4.
- All five executable embedded runtime JavaScript blocks pass `node --check`.
- Service-worker syntax and release hash/package checks are part of the final packaging gate.

## Manual acceptance after deployment

1. Open **Orders**, leave the default **Move / Hold** selected and verify the legacy one-shot Command Map workflow is unchanged.
2. Create a 3+ point Patrol Route. Let the team visit several points and confirm the route loops without reordering.
3. Reveal an alien during patrol. Confirm the patrol pauses while higher-priority contact is handled, then resumes at the retained patrol waypoint after contact resolves.
4. Assign a Fallback Post, give the same team a higher mission objective/contact, then clear that duty and confirm it returns to the post.
5. Use Check Location and verify it clears exactly once on quiet arrival, then normal search resumes.
6. Block a standing-order route with changing tactical geometry/occupancy. Confirm the order reports blocked rather than disappearing and retries after the route becomes legal.
7. Open **Assign Objectives** from Orders and return without losing the current standing order.
8. Save/reload an active mission containing a patrol route, fallback post and blocked standing order across different teams. Confirm route order/index/status remain intact.
9. Repeat on Mobile / Adaptive to verify map interaction, scroll regions and controls remain usable.
