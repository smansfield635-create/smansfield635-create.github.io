# Owner criterion and terrain material code audit — 2026-10-29

## Controlling visual criterion

Preserve rich, varied earth/groundcover composition. Blend transitions naturally. Avoid abrupt cut-out boundaries, straight color seams and material changes caused solely by terrain ownership. Soft tonal bands and natural color variation are not failures merely because they remain visible. Do not continue flattening or desaturating accepted appearance to minimize a numerical band score.

The owner's latest comments clarify this criterion. They do not select a particular side of the comparison, authorize a palette change, prove every world boundary, or independently authorize publication. The prior partial-improvement record is retained as historical evidence; its observation that tonal bands remain is not by itself a reason to reject the visual composition.

## Exact source inspected

Current main:69ddfa53d39aa7c940334e6cba6d0cd8c23a4d2d. Main renderer SHA256:fa6acc426c75c3b2292b3ed76a756157698d8e7a5562511ad7ced5af58e25dec, identical to frozen cb57c275b95d0d48883bc4da4dcfcf17cbec5060. Git tree comparison found no differences in showroom/globe/h-earth/render, vegetation-prototype or functional-landscape between those heads. This is repository source verification, not a fresh live-site deployment claim.

Candidate tooling3e2c347a930003532a1452b3f549d564b7c5edd9; captured run40939354824; preserved result e8d8bfe8dcb890609d34a42b1dfcc1fe87f90e67. Reused its67tests, independent export/source/capture reviews and8images. No render or transport solve repeated.

## Findings

1. **Richness retained in source design, not fully invariant in appearance.** Main renderer lines970–1006 retain six soil families, texture and environmental variation. Lines1007–1057 use smoothly varying groundcover weights and colors. The candidate adds a correction after this composition without replacing palettes or changing gain. Its expression is Q+w*(L32-Lsource-c), so the unmodified fine residual Q-Lsource remains algebraically present. However, L32 intentionally smooths broader variation; preserving mean and fine residual does not prove unchanged perceived richness. No further smoothing is justified solely by remaining soft bands.

2. **Continuous weights do not prove seamless final terrain.** Groundcover suitability/protection and the reviewed beach/hillside/foothill/habitat helpers use smooth transitions. Yet those expressions consume interpolated normals, coast/contact distances and discrete terrain-role/primitive branches. The main material branch at664, geological exclusion at937, refinement replacement/discard at677, and later soil/habitat overlays at1100–1209 must agree at actual interfaces. The existence of smoothstep/mix alone is insufficient. This audit identifies the interfaces; it does not invent a newly proven cause for the owner's screenshots.

3. **Candidate coverage is limited.** preparePresentation maps only manifest sourceOffsets:314NEAR plus44FAR original triangles. Selected uploaded XZ bounds are approximately NEAR[-264.011,-136.004]×[-736.030,-640.023], FAR[-428.628,-101.814]×[-1110.480,-736.024]. These are geometric bounds, not evidence of a filled rectangle. All other vertices receive atlasID0; separate refinement/geological VAOs do not acquire the atlas correction. There are122222original indexed triangles in the captured upload (not all are eligible terrain). This is a bounded diagnostic application, not a universal terrain implementation.

4. **Boundary safety is narrower than boundary repair.** The12m correction taper reaches zero at each selected original domain perimeter. The archived atlas review verifies matching internal shared-edge traces and zero exported correction at its perimeter. This avoids adding a correction jump; it does not remove an existing difference between separate original domains where the correction is zero. It is incorrect to infer cross-domain blending from this check.

5. **Preservation evidence is strong within its tested scope.** The renderer verifies exact original positions, indices, consumed normals and coast attributes. All358selected triangles were applied, none retired. Meadow and coast PNGs are byte/pixel identical to baseline. Geometry and original triangle ordering are preserved. These are useful results and need not be repeated.

## Checked active terrain consumers

| Consumer | Material path and field source | Candidate correction coverage |
|---|---|---|
| Ordinary near terrain | Role1 shared main fragment shader; base upload plus seam-presented normals/coast/contact |314selected source faces only |
| Far continuation | Primitive selected by uGlobalCoverFarPrimitiveIndex; shared soil path; matched boundary fields from createTerrainSeamPresentation |44selected source faces only |
| Refinement replacement | Role1 shared shader; separately sampled normals/coast and patch contact field, separate VAO |None; atlas selector defaults0 |
| Eroded terrain / mountain overburden | Role1 shared shader; geological rim reconciliation and coast presentation, separate VAOs |None; atlas selector defaults0 |
| Natural cliff / cavern physical shell | Primitive62001 geological soil branch; environmental identity/groundcover block excluded |None; separate material behavior requires interface-specific assessment |

**Integration caveat found:** refinement activation (renderer lines2876–2881) refreshes the original contact-distance buffer with contactField.packageDistances. The diagnostic duplicates selected vertices and their initial contact attributes; that existing refresh does not populate the appended duplicate entries. A future integrated candidate must synchronize those duplicates when their source contact values change, or prove the refresh cannot affect them. No visible failure from this path was established in the saved8frames. This is a concrete source-level integration limit, not evidence that the accepted image composition is wrong.

## Disposition and next action

The work established a reproducible correction, tested application, and preserved controls. It has not established environment-wide compliance with the owner's rule. Do not continue reducing every remaining tonal band; do not represent this diagnostic as a completed global fix.

Next action: use the checked consumer table above to verify actual interface inputs with the existing indexed mesh and saved material/world-position results. At each actual terrain interface, identify the material branch and input fields on both sides and whether the same rich material evaluates continuously. Reuse already-qualified matching interfaces. Resolve only a demonstrated hard-boundary or uncovered-consumer gap; retain natural tonal variation. No additional GPU job is authorized by this audit, and no publication occurred.
