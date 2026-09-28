# Tactical comms identity — Browser 0006

The saved appearance accessory "comms" is already represented in soldier portraits but was missing from tactical heads. The shared face builder now appends four low-segment pieces for an earpiece and microphone boom. Geometry uses the same radius, head scale and parent transform as facial features. It is merged into the existing vertex-colored face mesh, retaining one draw call and existing disposal ownership.

Only comms-equipped appearance receives this geometry. No random identity, equipment item, combat effect or save migration was added. Classic and full/mid articulated face-builder users inherit it; distant LOD and native parity are outside this slice.

Validation: 14 tests passed across comms, facial features, head proportions and helmet identity. Covers saved appearance gating, bounded finite geometry, parent transforms, disposal, reload identity and model signature invalidation. Build seam, embedded JavaScript syntax and whitespace checks passed. Full repository suite not rerun.

Field acceptance pending: compare the same comms-equipped soldier portrait with Iso/TPV and FPV teammate views, inspect helmet clearance through standing/kneeling/aiming and head turns, and switch classic/full/mid detail. Hair and armor insignia remain roadmap follow-ups.
