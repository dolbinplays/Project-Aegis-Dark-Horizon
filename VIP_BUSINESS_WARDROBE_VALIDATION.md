# VIP and soldier presentation — September 28 Browser 0003

Six coordinated business palettes derive from stable VIP identity, with deterministic male/female presentation. Female-presenting VIPs use a blouse without a tie, a pantsuit silhouette and a bob attached to the shared head assembly. Existing VIPs adopt these new visuals on upgrade; camera changes, movement, escorting and save/reload do not reroll them. Ordinary civilian palettes and classic/distant civilian status colors are unchanged.

Soldiers already store appearance.gender. Female presentation now applies a 0.94 horizontal torso profile in portraits and classic/full/mid/low tactical models. Articulated torso children follow that transform; classic armor and emblems use the same width. Saved body build, face, hairstyle, accessories and equipment remain intact. Armored differences are intentionally subtle. Gender now participates in persistent model invalidation. No new save field or gameplay rule; save format remains 4.

Torso geometry keys include role/presentation and rendered clothing colors; head keys include presentation and skin/hair colors. Identical parts are shared across unrelated appearance differences. The bob is merged into the existing head mesh and uses cached geometry; VIP models retain ten meshes. Existing leg joints, pose hierarchy and gait code are unchanged. This establishes geometry reuse, not a measured frame-rate improvement.

Automated tests cover all six palettes across 300 identities, both VIP presentation variants across 100 identities, save/playback stability and input immutability, actual head/torso cache reuse, full/mid reuse, mesh counts, unarmed joints, calm/panic/death poses, material creation-order independence, female soldier construction across classic/full/mid/low, preserved hair/equipment/body identity and model invalidation.

Live visual acceptance pending: compare both VIP variants and male/female soldiers in portraits and supported tactical views; check daylight/nighttime, aiming, kneeling, escort walking, frightened movement, cover seeking, boarding and death. Dresses, more VIP hairstyles and security details remain separate work. Native parity is deferred. Full repository suite not rerun.

Results: all 33 targeted tests passed. Runtime packaging, build seam, embedded JavaScript syntax and whitespace checks passed.
