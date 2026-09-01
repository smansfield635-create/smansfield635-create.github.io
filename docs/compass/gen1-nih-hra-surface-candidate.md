# Gen1 pre-existing anatomical surface candidate — NIH 3D / Human Reference Atlas

Status: CANDIDATE_UNDER_EMPIRICAL_QUALIFICATION

Candidate identity:
- NIH 3D entry: 3DPX-020960, Brain, Male, version 1.01.
- Human Reference Atlas object: `Allen_M_Brain.glb`.
- Frozen retrieval URI: `https://ccf-ontology.hubmapconsortium.org/objects/v1.2/Allen_M_Brain.glb`.
- NIH 3D reports the input mesh filename as `3d-vh-m-allen-brain.glb`.

Provenance and licensing:
- Created by the Human Reference Atlas project.
- NIH 3D states the model was created using data from the Allen human brain reference atlas described by Ding et al. (2016).
- The source atlas represented one half of the human brain; HRA mirrored the 141 anatomical structures to create the intended whole-brain reference organ and resized it to the Visible Human reference bodies.
- NIH 3D states the current model is licensed CC BY 4.0.

Why this candidate materially changes the route:
- It is already a browser-native GLB surface asset. No MRI segmentation, FreeSurfer execution, VTK surface extraction, threshold tuning, smoothing, retopology, or procedural anatomical reconstruction is required to inspect the source geometry.
- It carries explicit anatomical component structure (141 source structures) and institutional provenance.
- It has a directly inspectable NIH 3D web viewer and an independently addressable HRA GLB object.

Open qualification questions that must be answered empirically before Gen1 binding:
1. Exact SHA-256 and byte identity of the HRA GLB.
2. Actual GLB mesh/node/material/component counts.
3. Indexed triangle count must exceed the frozen minimum for fine cortical morphology.
4. Cerebral, cerebellar, and brainstem component identity must survive in the distributed GLB structure or be derivable from the 141 named structures without geometry modification.
5. Mirrored-half provenance must be explicitly accepted or rejected for Gen1; it is anatomical reference geometry, but not an untouched bilateral specimen surface.
6. Coordinate normalization must remain a rigid/scale transform only; no anatomical fitting or morphology edits.

Current law:
- `MRI_EXTRACTION = FALLBACK_NOT_PRIMARY`.
- `SOURCE_SELECTION != SOURCE_MODIFICATION`.
- No geometry conversion or visual tuning is authorized until the qualification workflow records the candidate's exact identity and structural resolution.
