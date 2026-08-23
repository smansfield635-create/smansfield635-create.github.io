# Gen1 volume candidate — exact subject and extraction binding

Identity: `GEN1_VOLUME_CANDIDATE_EXACT_SUBJECT_AND_EXTRACTION_CONTRACT_BINDING`

Governing main: `a2718019b9b0a4c9ed4e909d24f125dbaad92521`

Status: `FROZEN_PRE_EXTRACTION`

This boundary selects one real-human source subject and freezes the deterministic extraction architecture before any candidate surface is generated.

## Exact subject

Dataset: OpenNeuro `ds006072`, snapshot `1.1.0`, CC0.

Subject/session: `sub-P1/ses-1`.

Selection was identity-based rather than morphology-based: first primary non-replication subject, first structural session, first acquisition run. No generated surface existed when this rule was applied.

The dataset describes Siemens Prisma structural T1w/T2w MRI at 0.9 mm isotropic resolution. Both selected sidecars identify 3D head acquisitions, HFS patient position, and the same DICOM image orientation.

## Bound source identities

T1w:
`sub-P1/ses-1/anat/sub-P1_ses-1_acq-t1mpr0p9mm_rec-NDNORM_run-1_T1w.nii.gz`

Git-annex content identity:
`SHA256E-s8963163--15472257ccf51b7a95c5239ccb7e1f457ba6e4d73a4233af3e4167fef504863f.nii.gz`

T2w:
`sub-P1/ses-1/anat/sub-P1_ses-1_acq-t2spc0p9mmiso_rec-NDNORM_run-1_T2w.nii.gz`

Git-annex content identity:
`SHA256E-s8276862--67dcc82e1c1c61c78484bae0e0a8e59356e8c615f265e9eb554c4134e3d33fca.nii.gz`

The annex SHA-256 values, not the small Git symlink blobs, are the anatomical source-byte identities.

## Frozen extraction architecture

Primary segmentation is FreeSurfer 7.4.1 `recon-all` using the bound T1w and T2w inputs with `-T2pial`. Brainstem segmentation uses `segmentBS.sh` in the same environment. The execution container must itself be bound by immutable image digest before execution.

Cerebral geometry is the native extracted FreeSurfer pial topology. Cerebellum and brainstem geometry are deterministic iso-surfaces from frozen segmentation labels using VTK `vtkFlyingEdges3D` 9.3.0 at binary boundary 0.5.

Before anatomical qualification there is no smoothing, decimation, hole filling, retopology, welding, hand sculpting, reference-directed deformation, or morphology-targeted rerun.

The native NIfTI affine remains source coordinate authority. Conversion to RAS+ is a single recorded transform; no landmark-directed rotation, anisotropic scaling, or perceptual fitting is permitted.

## Reproducibility receipt

Execution must preserve input hashes, immutable container digest, exact software versions and commands, affine/normalization transform, label voxel counts, output hashes, vertex/face counts, and logs.

## Stopping boundary

This document does **not** authorize surface execution or new geometry. It freezes the source and algorithmic contract so the first generated candidate cannot influence those choices.

`SOURCE_BINDING_FROZEN = true`

`EXTRACTION_CONTRACT_FROZEN = true`

`SURFACE_EXECUTION_AUTHORIZED = false`

`NEW_GEOMETRY_AUTHORIZED = false`

Next boundary: `GEN1_EXTRACTION_ENVIRONMENT_IDENTITY_AND_PREEXECUTION_QUALIFICATION`.
