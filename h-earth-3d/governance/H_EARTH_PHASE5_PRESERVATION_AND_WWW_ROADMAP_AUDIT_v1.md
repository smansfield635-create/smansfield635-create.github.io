# H-Earth Phase 5 Preservation and WWW Roadmap Audit v1

## Preserved authority
- Semantic material candidate: ca341f03492c1887f656dc8a52b7f7b29abe7d92
- Semantic material chamber: c4da54b31fd7411fc18e06f724b39409acbc2f36
- Phase 4 microtexture candidate: 10290358fbab4447b80b7bfa26e61474c814fc48
- Phase 5 microrelief candidate: ebdb03f026c930fa83fee77d040faf19be95f879
- Phase 5 inspection shell: e5bcec1fd37efb2b416f0d6a8790ea0a3d04d7c4
- Phase 3 shadow experiment remains isolated and is not promoted into the preserved terrain baseline.

## WWW audit findings
1. Modern landscape systems separate macro terrain, material/detail, geometric detail, foliage/detail instances, water, and shadow/lighting concerns rather than expecting one layer to provide realism.
2. High-detail landscape rendering increasingly uses distance-aware geometric detail/virtualized geometry; displacement/tessellation is a recognized terrain-detail layer.
3. Small terrain details such as grass and rocks are commonly rendered as instanced detail geometry, with distance/LOD controls.
4. Dense foliage systems rely on instancing and distance-dependent representation; preserving apparent volume while reducing distant geometric cost is a central concern.
5. High-resolution dynamic shadows can be expensive; caching, distance control, and static/dynamic separation are important performance strategies.

## Restructured H-Earth engineering roadmap
### Terrain substrate — current
T0 macro geometry/morphology — preserved
T1 semantic material geography — qualified/preserved
T2 packed microtexture — qualified/preserved
T3 bounded microrelief — preserved
T4 mesostructure geometry — NEXT AUDIT/EXPERIMENT
  - rocks, clumps, blades/tufts, debris-scale forms
  - deterministic semantic placement
  - near/mid distance budget and aggressive culling
  - instanced/reused primitive authority
  - no ecosystem simulation yet
T5 terrain transition polish
  - reduce visible faceting/transition artifacts
  - validate silhouettes and near-ground scale cues

### Water — held until terrain T4/T5 boundary
W1 shoreline contact and depth response
W2 normal/wave scale hierarchy
W3 reflection/refraction/foam only after contact geometry is stable

### Foliage — held until terrain T4 placement authority
F1 groundcover/grass instance layer
F2 shrubs
F3 trees/canopy
F4 wind/animation only after static density and LOD budgets qualify

### Lighting/shadows
L1 Phase 3 terrain-shadow experiment preserved as research evidence
L2 do not promote until mesostructure/foliage determines actual contact-shadow needs

## Immediate next operation
Read-only T4 mesostructure feasibility/cost audit against the current WebGL2 persistent renderer. Do not construct grass yet. Determine instance representation, draw-call strategy, placement authority, distance bands, and hard resource budget first.
