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
