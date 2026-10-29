# Classification of unmatched far boundary vertices

2026-10-29. Continues 54b2e4ad81d5057607a4e2606697a92717ef68e9 under H_EARTH_CORRECTED_MATERIAL_RENDERER_20261029_001. AI-entry read-only route reused. Frozen mesh hashes and source identity remain those in boundary-inputs.json. No new capture or product change.

All 420 indexed far boundary vertices are classified:

| Group | Count | Finding |
| --- | ---: | --- |
| Matched near join | 349 | Previous normal/coast check agrees within numerical precision. |
| Remaining main perimeter | 65 | All outside near XZ bounding box, minimum distance to near boundary 145.62419848812655 m. Not unmatched coincident near/far join vertices. |
| Two isolated triangular boundary loops | 6 | Three vertices per loop; separate mesh qualification finding. |

Boundary connected components contain 414, 3, and 3 vertices, all degree two. The first component contains all 349 matches and the 65 outside-footprint vertices. Do not call all unmatched vertices outer-world perimeter: six belong to the isolated loops.

Loop vertices [14206,14911,14249] enclose projected area 0.00735508743673563 m²; longest edge 345.48576738771635 m; altitude to that edge 0.00004257823696963754 m (0.0426 mm). Loop [14260,14926,14261] encloses 0.0028712376952171326 m²; longest edge 73.29506090796971 m; altitude 0.00007834737183238849 m (0.0783 mm). These are extremely thin indexed boundary loops. No claim is made that they are visible holes in the final composition or cause the broad bands.

Independent paired review reproduced component counts, outside-footprint classification, loop areas and altitudes, and accepted this bounded interpretation.

Decision: the 71 previously unclassified vertices are not evidence for further palette flattening. Preserve rich soil variation. Keep the two thin loops with the separate mesh-qualification track rather than treating them as the broad material-boundary cause. The saved eight-frame comparison has no active refinement, as established previously.

Next action: finish the complete shared-edge material-input continuity check (including contact and any differing shader inputs); do not repeat unmatched-vertex discovery or start a broad render sweep. Global visual acceptance remains separate from this indexed geometry check. Candidate still covers 358 selected faces; no global application or publication claim.

Reproduce: python classify-boundary.py boundary-inputs.py <mesh-directory> <capture-receipt.json> <vertex-check-output.json> <classification-output.json>. Requires NumPy. Machine output includes every unmatched vertex coordinate and nearest near-edge distance.

No GPU job, merge or publication initiated. Chamber display synchronization remains unverified.
