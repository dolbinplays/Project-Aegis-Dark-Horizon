# Tactical head identity

Build: v0.26.09.24.0008_TACTICAL_HEAD_IDENTITY_PATCH

Scope: shared portrait/tactical head width and height ratios. Existing spherical tactical geometry is scaled; this does not add facial anatomy, hair or accessories. Both classic renderer paths and full/mid articulated paths consume the same proportions. Mid-detail merged geometry keys distinguish head shapes; persistent model identity tracks appearance changes. Existing helmet markings are unchanged.

Eight focused identity tests cover the five supported shapes and fallback, bundled Three.js geometry bounds, save/reload identity, legacy deterministic appearance and helmet marking behavior. Build seam, packaging and embedded JavaScript checks also pass. No additional meshes or draw submissions.

Live visual acceptance remains pending: compare named soldiers' portraits against Classic, Quality and Performance tactical heads, verify helmet fit and kneeling/prone animation, and repeat after reload.
