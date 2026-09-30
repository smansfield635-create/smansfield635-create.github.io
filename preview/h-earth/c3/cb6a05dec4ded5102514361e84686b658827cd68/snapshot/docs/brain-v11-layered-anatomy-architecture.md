# Brain V11 Layered Anatomical Architecture

## Governing decision

Brain V10 G1.1 is frozen. V11 replaces the global-primitive model with a layered anatomical assembly. Anatomical continuity is produced by governed interfaces between independently shaped layers, not by forcing the entire brain into one mesh.

## Required layers

1. **Left cerebral hemisphere** — independent closed volume with its own proportion field and later its own cortical fold field.
2. **Right cerebral hemisphere** — independent closed volume, paired to the left by symmetry constraints but not welded into a single primitive. The longitudinal fissure is therefore structural, not carved from one mass.
3. **Cerebellum** — independent posterior-inferior layer. G0 uses one compact mass; later generations may subdivide left/right cerebellar hemispheres and vermis without changing the cerebral layers.
4. **Brainstem** — independent continuous midbrain/pons/medulla layer. The pons must project anteriorly; the medulla must narrow inferiorly.
5. **Cord** — separate descending continuation layer beginning at the medulla interface. It is anatomically connected but geometrically independently controlled.
6. **Interface layer** — explicit registration and overlap zones governing hemisphere-to-brainstem, cerebellum-to-brainstem, and medulla-to-cord continuity. Interfaces must hide construction seams without collapsing layers into one primitive.

## Architectural laws

- No return to exposed cortical tubes.
- No single global ellipsoid or sphere may govern the cerebrum.
- Left and right cerebral layers remain separate objects at every generation.
- Brainstem and cord remain separate layers with a governed transition.
- Cerebellum is not represented as paired bulbs, discs, or attached ellipsoids.
- A component may overlap another only inside an explicit interface zone.
- Fine gyri and folia are prohibited until gross layered anatomy passes all fixed views.
- Every layer must remain individually addressable by the renderer and verifier.

## V11 G0 acceptance geometry

G0 is intentionally smooth. It must prove only the layered gross anatomy:

- frontal poles fuller than occipital poles;
- temporal regions descend independently on both cerebral hemispheres;
- structural longitudinal fissure remains visible from superior, frontal, and rear views;
- cerebellum is centered posterior to the brainstem and tucked beneath occipital tissue;
- pons presents as an anterior transverse bulge of the brainstem layer;
- medulla narrows below the pons;
- cord begins below the medulla as a separate layer without a peg-like seam;
- inferior view contains no pole pinch or Hershey-kiss artifact;
- no layer floats visibly away from its anatomical interface.

## Implementation schedule

### G0 — Layer assembly
Build the five major geometry layers plus explicit interface transforms. No cortical folds. Deliver six fixed inspection views and drag rotation. This is the make-or-break architecture gate.

### G0.1 — Interface refinement
Only if G0 reads correctly. Remove visible seams, correct overlap depth, refine pons-medulla-cord transition, and tune cerebellar tuck. No cortical detail.

### G1 — Regional cerebral proportions
Within each hemisphere, establish independent frontal, parietal, temporal, and occipital control regions. Preserve separate hemisphere meshes. Acceptance is a convincing brain silhouette before folding.

### G2 — Primary sulcal hierarchy
Add longitudinal fissure refinement and primary central/lateral/parieto-occipital organizers as surface depressions within each hemisphere. No secondary noise.

### G3 — Regional cortical flow
Add broad region-specific gyri driven by the primary sulcal fields. Frontal flow arcs, temporal flow remains more horizontal, parietal flow turns superior-posteriorly, and occipital flow tightens.

### G4 — Cerebellar foliation and stem refinement
Add dense cerebellar folia, peduncular transitions, and final pons/medulla shaping while preserving the established layer interfaces.

### G5 — Materials, lighting, and carousel qualification
Only after anatomical geometry is accepted from all fixed views. Materials and cinematic lighting are finishing layers, never geometry substitutes.

## Verification order

Every generation is judged in this order: front, rear, left lateral, right lateral, superior, inferior, then oblique drag inspection. A generation cannot advance because one hero angle looks correct.

## Rollback law

V10 G1.1 remains immutable evidence. Any V11 generation that loses immediate brain identity, structural hemisphere separation, inferior continuity, or cerebellar/brainstem registration is rejected without mutating the frozen V10 object.
