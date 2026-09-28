# Tactical hair identity — Browser 0007

Uses existing saved hairstyle and hair color for uncovered classic/full/mid articulated soldier heads. Six bounded procedural silhouettes plus bald share the facial mesh and its head transforms. No additional draw call or save field. Equipped armor conceals hair; unarmored soldiers no longer receive the previously unconditional helmet. Existing mid-detail geometry keys already include equipment coverage, while persistent unit signatures now also include hairstyle and coverage.

Automated: 18 identity tests pass for styles, helmet coverage, saved color, bounded geometry, disposal, model invalidation, save reload, head proportions and prior accessories. Build seam, embedded JavaScript and whitespace checks passed. Full repository suite not rerun.

Field acceptance pending: compare each hairstyle and color to the same soldier portrait, inspect unarmored classic/full/mid models in Iso/TPV and visible FPV teammate views, turn/aim/kneel, then equip armor and verify hair is concealed. Native parity and uniform/armor insignia are outside this slice.
