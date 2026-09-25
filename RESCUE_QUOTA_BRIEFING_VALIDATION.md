# Rescue quota briefing clarity

Build: v0.26.09.24.0006_RESCUE_QUOTA_BRIEFING_CLARITY_PATCH

Both planning layouts use the same new briefing helper. The helper reads existing mission objective authority rather than introducing another quota formula. Three-person critical rescues require two extractions, but unresolved survivors keep the mandatory rescue phase active. No combat, reward, rescue or terminal rules changed.

Behavioral tests cover all three rescue profiles for populations 0–8, quota-met versus terminal completion, mixed VIP/civilian counts and identical concealed text across unknown populations. Existing VIP and adaptive planning tests remain applicable.

Live visual acceptance remains pending: inspect standard and adaptive Briefing tabs for a known critical incident, optional assistance and an incomplete report; confirm wrapping and launch controls remain usable.
