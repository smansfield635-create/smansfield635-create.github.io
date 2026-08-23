# Anatomical Basis Gen1 — Source Class Decision

Base: `f384215eec1d161c6a013fea7f267b45e440201d`

Decision: `DUAL_CLASS_ADMISSIBLE`

This boundary changes source admissibility only. It does not authorize a new brain mesh, native conversion, retopology, deformation, LOD generation, rendering, or publication.

## Admissible classes

`S1` — a pre-existing real-human anatomical surface satisfying the frozen source requirements.

`S2` — a real-human anatomical volume from which surfaces are produced by a fully frozen deterministic segmentation and surface-extraction pipeline.

The distinction is methodological: deterministic extraction of a measured anatomical boundary from real-human volumetric evidence is not procedural authorship of anatomy. The source remains the real-human volume; the extraction pipeline is a reproducible measurement transformation.

## S2 freeze requirement

Before observing the first candidate surface, freeze the dataset snapshot, subject, exact source files and digests, license/provenance, voxel geometry and orientation, all preprocessing/resampling, segmentation software/version and weights or thresholds, label ontology, surface extraction algorithm/version, topology-repair rules, smoothing and decimation policy, component inclusion rules, coordinate normalization, and deterministic output fingerprint procedure.

After output observation, morphology-targeted intervention is prohibited. No manual sculpting, reference-driven vertex movement, threshold retuning, selective smoothing, candidate-specific topology repair, or procedural replacement of missing anatomy is permitted.

## First concrete S2 candidate

OpenNeuro dataset `ds006072`, snapshot `1.1.0`, is admitted for candidate qualification, not source binding.

The published dataset identifies 11 participants, structural T1- and T2-weighted MRI at 0.9 mm isotropic resolution, DOI `10.18112/openneuro.ds006072.v1.1.0`, and CC0 licensing. This clears the source-class-level real-human, rights, modality, and nominal-resolution questions.

It does not yet clear exact source binding. A specific subject and exact T1w/T2w files have not been frozen by digest, and cerebral+cerebellar+brainstem surface recoverability has not yet been demonstrated through the frozen extraction pipeline.

Therefore:

`GEN1_SOURCE_CLASS_DECISION = DUAL_CLASS_ADMISSIBLE`

`OPENNEURO_DS006072_V1_1_0 = QUALIFIED_FOR_EXACT_SUBJECT_BINDING_TEST`

`ANATOMICAL_BASIS_GEN1_SOURCE_BINDING = NOT_YET_PASSED`

`NEW_GEOMETRY_AUTHORIZED = false`

Next boundary: `GEN1_VOLUME_CANDIDATE_EXACT_SUBJECT_AND_EXTRACTION_CONTRACT_BINDING`.
