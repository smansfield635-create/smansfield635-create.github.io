# H_EARTH_CONSTRUCTION_CYCLE_MATURITY_AND_OWNER_INSPECTION_DELIVERY_PROTOCOL_v1

Status: GOVERNING EXECUTION CONTINUITY / FAIL-CLOSED
Date: 2026-08-16
Scope: H-Earth construction cycles that require machine qualification followed by owner interactive inspection.

## 1. Purpose

Prevent a construction turn from stopping at an intermediate machine state and reporting that state as though the requested cycle were complete.

A cycle is not mature merely because construction exists, a PR exists, or a workflow has started. When the authorized target includes owner inspection, the execution obligation continues through machine-terminal disposition and, on PASS, through publication and verification of an exact-candidate interactive inspection surface.

Governing equation:

`CONSTRUCT -> QUALIFY_TO_TERMINAL -> REPAIR_IF_REQUIRED -> REQUALIFY -> MATERIALIZE_EXACT_PREVIEW -> VERIFY_PREVIEW -> DELIVER_FULL_LINK -> OWNER_INSPECTION`

No earlier state is a successful cycle completion boundary.

## 2. Maturity states

The following states are intermediate and SHALL NOT be reported as cycle completion:

- `CONSTRUCTION_COMPLETE`
- `PR_OPEN`
- `QUALIFICATION_QUEUED`
- `QUALIFICATION_IN_PROGRESS`
- `EVIDENCE_UPLOAD_IN_PROGRESS`
- `PREVIEW_BRANCH_CREATED`
- `PREVIEW_PR_OPEN`

The first valid owner-facing maturity boundary is:

`OWNER_INSPECTION_READY`

That state requires all of the following simultaneously:

1. exact candidate SHA frozen;
2. applicable machine qualification terminal `PASS` on that exact SHA;
3. machine evidence/artifact identity recorded;
4. immutable same-domain interactive preview created from the exact candidate tree;
5. preview transport merged without promoting product bytes;
6. public preview route verified to resolve and load the candidate;
7. full owner-facing URL emitted in the completion response;
8. product promotion remains prohibited until owner inspection passes.

## 3. Poll-to-terminal law

If a required workflow is queued or in progress, the active execution room SHALL continue checking it until it reaches a terminal conclusion, subject only to actual tool/session limits.

`IN_PROGRESS` is not a blocker and is not a completion result.

On terminal `PASS`, execution proceeds immediately to preview materialization unless another governing gate explicitly intervenes.

On terminal `FAIL`, execution SHALL inspect the failing job and evidence, classify the failure, and either repair the bounded candidate and re-run qualification or record a genuine external blocker that cannot be repaired with available authority.

The room SHALL NOT simply return the failed workflow name or assertion to the owner when the failure is diagnosable and repairable from the available repository surface.

## 4. Exact-head repair law

Any product repair after machine failure creates a new candidate SHA. All prior exact-head qualification evidence is invalid for the new SHA.

The room SHALL therefore record the failed SHA and failure cause, mutate only the bounded repair surface, obtain the new exact SHA, wait for or initiate the applicable exact-head qualifier, and qualify the new SHA from zero inherited evidence.

## 5. Preview materialization law

After exact-head machine PASS, the cycle SHALL automatically proceed to an owner-inspection surface when owner inspection is part of the governing contract.

The preview must be same-domain and interactive; bound to the exact qualified candidate SHA/tree; preserve the candidate repository hierarchy required for relative module imports; be `noindex,nofollow,noarchive` or equivalent nonproduction transport; not copy candidate product bytes onto the production H-Earth route; and not create product promotion authority.

Preferred canonical route:

`https://diamondgatebridge.com/preview/h-earth/c3/<EXACT_CANDIDATE_SHA>/`

## 6. Link verification law

Creating or merging a preview wrapper is insufficient.

Before reporting `OWNER_INSPECTION_READY`, the room SHALL verify that the full public URL resolves to the inspection transport and that its embedded candidate path targets the exact frozen candidate identity.

If the public route is not yet available due to deployment propagation, the cycle remains `PREVIEW_PROPAGATION_PENDING`, not complete. The room must continue checking when a callable verification surface is available.

## 7. Owner-facing completion response

A successful pre-owner cycle response MUST contain the exact candidate SHA, machine qualification disposition, preview/transport merge identity, the full clickable inspection URL, and an explicit statement that production product merge remains prohibited pending owner inspection.

It SHALL NOT end with only a PR number, workflow status, branch name, or relative path.

## 8. Failure reporting standard

A machine failure report must identify the exact failed SHA; exact workflow/run/job; first governing failing assertion or condition; whether failure is product, qualifier, infrastructure, or stale/prejudicial instrumentation; repair performed or exact uncallable authority preventing repair; and next executable action.

A repairable assertion is an execution task, not a blocker declaration.

## 9. C3C3R application

For C3C3R, the governing sequence is:

`C3C3R_PRODUCT_REPAIR -> EXACT_HEAD_CP3D_TERMINAL_PASS -> IMMUTABLE_C3C3R_PREVIEW -> PUBLIC_ROUTE_VERIFICATION -> FULL_LINK_DELIVERY -> OWNER_INTERACTIVE_INSPECTION`

The active positive baseline remains owner video `23750.mp4`, SHA-256 `a6525664d11b9cc576f6d3b859e93d73d87f6c2c2f6323973028b5857de2fd83`.

The current repair must preserve the C3C3 owner-success characteristics while closing the landward connected-region and planetary-ocean deficiencies.

## 10. Terminal predicates

Pre-owner maturity:

`EXACT_HEAD_MACHINE_PASS && IMMUTABLE_PREVIEW_PRESENT && PUBLIC_PREVIEW_VERIFIED && FULL_LINK_DELIVERED`

=> `OWNER_INSPECTION_READY`

Final product closure remains separately governed:

`OWNER_INSPECTION_PASS && ALL_PRESERVATION_ANCHORS_PASS`

=> `PROMOTION_ELIGIBLE`

Anything less than the pre-owner predicate SHALL NOT be described as a completed construction cycle when the owner's requested boundary is inspection readiness.

## 11. Fresh-room handoff

Any room resuming an active H-Earth construction cycle SHALL recover, in order: governing strategy/contract; active product PR and exact head SHA; latest exact-head machine run and terminal disposition; failure evidence and repair history, if any; preview existence for the latest passing SHA; public preview route verification; owner inspection disposition.

It then resumes from the first unsatisfied predicate. It does not restart the cycle, manufacture a new plan, or stop at a merely intermediate workflow state.
