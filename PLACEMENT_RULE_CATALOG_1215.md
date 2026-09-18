# Placement Rule Catalog — 1215

All shared props receive a parent placement definition at load time. Unlisted visuals default to **Free Placement / Preferred Context**.

| Visual | Mode | Strictness | Context / behavior |
|---|---|---|---|
| lamp-post | Roadside | Preferred | Straight, T, Four-way; off drivable lane |
| bus-stop | Roadside | Preferred | Straight or T; faces road; mirror enabled |
| street-bench | Roadside | Preferred | Straight, T, Four-way; faces road |
| stop-sign | Roadside | Required | T or Four-way only; off drivable lane |
| traffic-light | Roadside | Required | T or Four-way only; off drivable lane |
| vehicle-sedan | Roadside | Preferred | Any authored road type; road surface allowed |
| vehicle-van | Roadside | Preferred | Any authored road type; road surface allowed |
| vehicle-utility | Roadside | Preferred | Any authored road type; road surface allowed |
| vehicle-bus | Roadside | Preferred | Any authored road type; road surface allowed |
| vending-machine | Building-Adjacent | Preferred | Wall-adjacent; ingress protected; avoid-window intent |
| newspaper-machine | Building-Adjacent | Preferred | Wall-adjacent; ingress protected; avoid-window intent |
| playground | Building-Adjacent | Preferred | Wider wall clearance; ingress protected |

The editor can change any shared prop to Free, Roadside, or Building-Adjacent and write project-side overrides without creating separate rules for Damaged/Destroyed/cosmetic variants.
