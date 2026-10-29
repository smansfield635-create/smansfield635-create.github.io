# H-Earth Gen2969 — conditional source owner candidate

This is a **diagnostic-only** source-domain candidate within the existing canonically admitted operation `H_EARTH_GEN2968_SOURCE_CUT_CLASSIFICATION_20261029_001`, lock generation 2969. It does not modify the original uploaded world, geometry, shader, foliage, shoreline, GPU or product release. Base diagnostic head: `6e6b60089ab640566dc27d50bcfe53b54564b42e`.

## Tested, not accepted

The candidate proposes **NEAR-local source ownership** for the 18 microscopic NEAR/FAR **LAND/LAND** projected overlap pairs. The local Run8B near-to-mid terrain remains unchanged; only duplicate FAR_LAND_CONTINUATION polygon fragments are removed from the *candidate source-domain calculation*. All 18 original overlap witnesses remain in the report and are not silently turned into a pass of the unmodified original mesh. Original shore/water geometry is untouched. This policy is a source-reviewed hypothesis, **not canonical ownership approval**.

Independent original-source replay: GitHub Actions run [40909501175](https://github.com/smansfield635-create/smansfield635-create.github.io/actions/runs/40909501175), artifact ZIP SHA-256 `e1eb8a2fdbaacce663783440e2189b17e487eacb6c13fd50907d07cdb640bc4a`. The verifier checks original world/upload hashes, 2,484 witnesses, 2,575 memberships, 48m original support, 40m artificial cut rule, 18 raw overlaps and two unresolved side seams. Artificial clearance is 48.193m PASS. Original 38.096m source-boundary review remains HELD.

Source evidence distinguishes the southern **LAND/COASTAL_SOIL** overlap near Z~-736 from mirrored **WATER/NEARSHORE_WATER** contact near X~±384. Never fill the water side seam as land. The draft clipped candidate preserves unique 2D support, computes source-affine 3D area and original vertex-color integral, but it does not prove full mass/flux, material shader, visual continuity or publication.

## Execute

```sh
python3 -m unittest test_owner_partition_candidate.py -v
python3 owner_partition_candidate.py --artifact /path/to/h-earth-gen2969-cpu-mesh-40909501175.zip --report /tmp/source-owner.json
```

Requires Python with NumPy and Shapely 2. The checked-in receipt records a local execution against the exact immutable artifact, not a GitHub-hosted CI result. Return `NEAR_PRIORITY_CLIPPED_SOURCE_CANDIDATE_REVIEW_REQUIRED` is an evidence state only; `policyAccepted=false`, `materialOwnerPromoted=false`, `scientificClosure=false`. Source owner policy requires independent geometric/source/material review before any material transport, mesh repair, GPU use or publication.


## Material-budget adversarial qualification — source-policy HELD

This exact candidate has now been replayed locally against the unchanged artifact with **11/11 focused tests PASS**. These tests and the source file have been read back at Git blobs `10d728bacfa8b3f833e3410b999a4141a79c2e4a` and `5ca289737f075de89c073d1a480e688500e0f4f7`. This does **not** mean the hosted PR test or production visual audit passed.

The unpartitioned pair of original sources double-owns 0.0005452013574540615 m² of projected area. Original summed source 3D area over the 22 triangles is **1368.2481917250432 m²**. NEAR-first disjoint clipping retains **1368.2476321952925 m²**, a subtraction of **0.0005595297507170471 m²** of duplicated FAR source 3D area. Its removed FAR weighted baseColorLinear RGBA integral is approximately `[0.000057775089914, 0.000070484783208, 0.000037858403175, 0.000559529750717]`. The *counterfactual* FAR-first partition yields **1368.2476458335018 m²**, and the maximum difference between the two candidates' weighted RGB source integrals is **0.000045288119736**. Both represent the same union in XZ but do **not** have invariant material integrals.

This is the exact outstanding condition: `SOURCE_MATERIAL_OWNER_PRECEDENCE_NOT_AUTHORIZED`. Neither double-counted source totals nor the candidate clipped values are independently validated physical flux/mass conservation targets. The canonical G_WORLD semantic classifier establishes LAND/COASTAL_SOIL versus shoreline WATER, but no accepted per-triangle NEAR/FAR material owner has been established. Camera weights, draw order, and near/far height coincidence may not serve as hidden ownership authority.

Accept the source-only geometric *method* for further examination, not the priority policy. Keep `policyAccepted=false`, `materialOwnerPromoted=false`, `scientificClosure=false` and `sourceSingleOwnerMaterialConservationQualified=false` until a verified static owner contract and full source-field/flux plus coast-protection evidence exist. Do not promote to runtime source, alter an epsilon/radius or call a material blur correction complete. No rerun of identical Gen2969 CPU artifact is needed.


## Gen2969 local source-face transport boundary (2026-10-29)

The same immutable official artifact #12913811096 was re-evaluated locally with the exact existing mesh-gate source (Git blob `10b5623b09c552930e54a1c1071c37535a831971`). Candidate implementation at Git blob `2a82ee02d8195cbd5ebe39bf2bab18dfbbe30522`; regression tests at `8bccbdbc017eeab493e9daceca26bb5b5c89f356`. **18/18 local tests PASS.** The candidate checks the original mesh-gate blob, checks all world/upload and witness hashes/counters, preserves the 18 raw positive overlaps and two partial side seams, and refuses to promote either material-owner priority.

Source-clipped area 1365.4884050600233 m² remains unchanged. The local 22-triangle geometry has **25 genuine shared 2D line contacts**, **9 crossing NEAR/FAR**, with total shared contact length 269.16987188297617 m. Every connection's original affine 3D heights was checked at both endpoints and midpoint using the *existing Float32-scale seam tolerance*. Maximum discrepancy: **0.000028884628786585154 m**. Point-only contacts are never flux links.

On the source-owned clipped 3D face areas, the existing `mesh_domain_gate.transport` computes one bounded internal step with 25 participating edges and RGB mass-balance error **4.263256414560601 × 10⁻¹⁴**. RGB remains in gamut (0.06578470755305618 to 0.2136593486592084). The original gate's vertex **and centroid** protected-face rule is reused, not replaced with a weaker vertex-only rule. The 22 real sample faces contain zero protected faces; synthetic tests prove protected source faces disable transport, while disconnected 3D contacts, vertex-only contact, and out-of-gamut source colors fail as intended.

**Limitation:** This is an internal 22-face, baseColorsLinear RGB *mechanism* qualification with sealed exterior boundaries. It does NOT evaluate full original P(c,f0)/D(c,f0), prove actual material-field conservation over the full 358-face influence region, authorize NEAR-vs-FAR material priority, resolve two original LAND/WATER side seams, or repair any broad visual groundcover band. Keep `scientificClosure=false`, `policyAccepted=false`, `sourceSingleOwnerMaterialConservationQualified=false`, `fullP_D_f0Evaluated=false`. Next bounded engineering dependency: establish an explicit source-defined global material-owner policy and physically compatible open-domain boundary/shoreline flux, then trace the already-known albedo/groundcover expression as an independent visual task. No duplicate immutable replay, GPU, production mutation or publication is authorized by this qualification.
