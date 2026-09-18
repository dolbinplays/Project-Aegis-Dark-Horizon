# Roadmap Update — Prop Editor Context Auto-Selection

Status: **Implemented in 1522**.

When the user selects a prop in the Prop Editor, the live 3D placement reference now follows the prop's authoritative parent placement mode and legal road contexts automatically.

- Roadside props default to a legal road preview, preferring Straight/Any, then T, then Four-way.
- Building-Adjacent props open with the building reference.
- Free Placement props open in free context.
- Switching Placement Mode updates the preview immediately.
- Manual reference selection remains available for cross-context inspection.

This removes the confusing state where a Bus Stop could correctly be configured as Roadside while the live viewport still showed Free context.
