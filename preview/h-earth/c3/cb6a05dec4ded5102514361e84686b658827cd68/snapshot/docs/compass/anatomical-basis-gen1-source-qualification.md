# Anatomical Basis Gen1 — Source Qualification

Identity: `ANATOMICAL_BASIS_GEN1_SOURCE_SELECTION_AND_BINDING`

Base: `f5eddec4abed869d2af1fb10570c878a209427a8`

Status: `FAIL_CLOSED_CONTINUE_SOURCE_SEARCH`

## Governing acceptance condition

Before native conversion begins, the source must provide all of the following:

1. Real human-brain anatomical basis.
2. Sufficient cerebral, cerebellar, and brainstem morphology for the frozen projection fixtures.
3. Explicit provenance.
4. Redistribution and derivative-work rights compatible with the intended public/runtime use.
5. Stable source identity by exact file/object digest at binding time.
6. Known coordinate/orientation conventions.
7. Anatomical component identity.
8. Sufficient source resolution to survive Diamond Gate's own native LOD strategy without relying on irreversible upstream destructive reduction.

No candidate may advance by compensating for failure of one requirement with strength in another.

## Candidate 1 — BodyParts3D 4.0

### Provenance and license

Current LSDB Archive license page states that BodyParts3D is licensed under Creative Commons Attribution 4.0 International, last updated 2025-02-27. It expressly permits acquisition, redistribution, and creation/distribution of derivative works subject to attribution.

Authoritative archive references:

- https://dbarchive.biosciencedbc.jp/en/bodyparts3d/lic.html
- https://dbarchive.biosciencedbc.jp/en/bodyparts3d/download.html
- https://dbarchive.biosciencedbc.jp/data/bodyparts3d/LATEST/README_e.html

The older BodyParts3D ecosystem contains historical CC BY-SA 2.1 Japan references. For any future use, license authority must be bound to the current LSDB Archive distribution and its current license rather than combining old and current terms.

Decision: `PROVENANCE = PASS`; `LICENSE = PASS`.

### Anatomical identity and coverage

BodyParts3D is an anatomy database representing anatomical concepts as 3D structure data in a whole-body adult human model, with FMA-linked component identities and stable polygon-object identifiers. The release contains distinct cerebral, cerebellar, and brainstem-related anatomical components rather than a single undifferentiated brain shell.

Decision: `COMPONENT_IDENTITY = PASS`; `BRAINSTEM_CEREBELLUM_CEREBRAL_COVERAGE = PASS`.

### Resolution failure

The authoritative LSDB download exposes BodyParts3D 4.0 polygon archives explicitly described as `Polygon reduction rate = 99%`:

- `isa_BP3D_4.0_obj_99.zip`
- `partof_BP3D_4.0_obj_99.zip`

The archive therefore supplies an already destructively reduced surface representation. Diamond Gate's frozen perceptual reference requires preservation of cortical fold-frequency character, apparent sulcal depth, local curvature character, cerebellar foliation, and gross projection morphology. The surviving 1% polygon representation has not demonstrated sufficient fidelity to support Diamond Gate's own native LOD hierarchy without reconstructing information already removed upstream.

This is terminal under the source-resolution acceptance condition.

Decision: `NATIVE_SOURCE_RESOLUTION = NOT_QUALIFIED`.

### Disposition

`BODYParts3D_4.0 = REJECTED_AS_GEN1_GEOMETRIC_SOURCE`

It remains admissible as a corroborating component/landmark ontology and anatomical naming source. It must not be converted into the Gen1 production geometry and missing surface detail must not be procedurally reconstructed from it.

## Candidate 2 — BigBrain

BigBrain is a freely accessible 3D reconstruction of a real postmortem human brain derived from 7,404 histological sections, reconstructed at 20 μm isotropic resolution. The project states that images, volumes, and surfaces are available for download, with surfaces available in formats including MNI-OBJ, STL, GIFTI, and Wavefront OBJ.

Authoritative project references:

- https://bigbrainproject.org/about.html
- https://bigbrainproject.org/maps-and-models.html
- https://ftp.bigbrainproject.org/bigbrain-ftp/FAQ.html

Resolution and anatomical-source quality are therefore materially stronger than BodyParts3D for the present requirement.

However, the BigBrain dataset license is CC BY-NC-SA 4.0. Because `NonCommercial` is a use restriction and the intended Diamond Gate public/runtime distribution cannot be assumed noncommercial, the dataset cannot be bound without first establishing that the intended use falls within the license or obtaining separate permission.

Decision: `ANATOMICAL_RESOLUTION = STRONG`; `PUBLIC_RUNTIME_LICENSE = NOT_YET_QUALIFIED`.

Disposition: `HOLD_FOR_LICENSE_COMPATIBILITY`, not a bound Gen1 source.

## Candidate 3 — WU-Minn Human Connectome Project Open Access

WU-Minn HCP Open Access data include defaced structural MR image data. The Open Access Data Use Terms permit redistribution of original open-access data and derived data under the same Data Use Terms, with acknowledgement requirements.

References:

- https://www.humanconnectome.org/storage/app/media/data_use_terms/DataUseTerms-HCP-Open-Access-26Apr2013.pdf
- https://www.humanconnectome.org/study/hcp-young-adult/document/quick-reference-open-access-vs-restricted-data

The S1200 release includes structural MRI from 1,113 participants and also includes 7T imaging for a subset. This is a high-quality real-human anatomical basis, but it is primarily imaging data rather than a directly bound whole-brain surface package containing cerebral + cerebellar + brainstem exterior surfaces under the present contract.

Decision: `REAL_HUMAN_SOURCE = PASS`; `RESOLUTION = PROMISING`; `REDISTRIBUTION = CONDITIONAL_PASS`; `DIRECT_SURFACE_BINDING = NOT_YET_PROVEN`.

Disposition: `HOLD_FOR_SURFACE_AND_TERMS_QUALIFICATION`.

## Candidate 4 — OpenNeuro CC0 structural MRI

OpenNeuro requires published datasets to be made available under CC0. Public datasets may be downloaded without an account, and OpenNeuro explicitly supports structural MRI datasets in BIDS form.

References:

- https://openneuro.org/faq
- https://docs.openneuro.org/user-guide/

This creates a potentially strong licensing route to a high-resolution real-human anatomical source. However, a T1/T2 volume is not itself the frozen `3D source surface`. Binding an OpenNeuro volume would require a separately frozen segmentation/surface-extraction contract and would change the current source-surface acceptance model.

Decision: `LICENSE = STRONG`; `REAL_HUMAN_SOURCE = PASS`; `DIRECT_SURFACE_BINDING = NOT_SATISFIED_UNDER_CURRENT_CONTRACT`.

Disposition: `PROMISING_ALTERNATE_SOURCE_CLASS_REQUIRES_EXPLICIT_ARCHITECTURE_DECISION`.

## Boundary ruling

No candidate evaluated in this pass satisfies all current binding requirements.

`BODYParts3D_4.0` fails source-resolution authority.

`BigBrain` is strong anatomically but not yet license-compatible with unrestricted intended public/runtime use.

`WU-Minn HCP` is promising but requires surface and data-use qualification.

`OpenNeuro CC0` is promising as an anatomical volume source but requires explicit authorization to derive deterministic surfaces from volumetric anatomy rather than inherit a pre-existing surface.

Therefore:

`ANATOMICAL_BASIS_GEN1_SOURCE_BINDING = FAIL_CLOSED`

`NEW_GEOMETRY_AUTHORIZED = false`

`NEXT_BOUNDARY = HIGH_RESOLUTION_SOURCE_SEARCH_OR_SOURCE_CLASS_DECISION`

No conversion, retopology, LOD generation, deformation, or successor render is authorized by this document.