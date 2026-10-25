# DiamondGate full-cycle audit matrix

Operation: `DIAMONDGATE_FULL_CYCLE_MATRIX_REPAIR_20261025_001`, generation 2889.
Baseline: `8da340ed426ba8f1ab8cb39fb07f18715982a54a`. The 97 baseline tests passed while the new probes below exposed gaps. Passing old tests was not evidence of a complete progression cycle.

## Audit dimensions

Cross workflow stage (investigation, ready, execution, verification, correction, human review, complete) with record type (structured requirements, ordinary report, legacy), result/check identity (missing, matching, mismatched, superseded), prerequisites (open, satisfied, changed), authority (reported permission, absent, restricted), action (continue, accept, reject, request evidence, restore), and persistence (in memory, reload, backup).

The suite uses targeted combinations and complete journeys. It is not an exhaustive Cartesian-product or semantic-judgment certification.

| Area | Baseline defect or invariant | Required behavior | Evidence |
|---|---|---|---|
| Preparation → execution | Both accounting paths defaulted to investigation | Respect a specific ready action and applicable authorization; require a decision-changing missing fact to justify more preparation | workflow-matrix-test.mjs |
| Returned next action | Automatic accounting retained old unfinished list and replaced next step | New evidence and current bounded next action update the plan | workflow-matrix-test.mjs |
| Access and blockers | Accounting paths discarded blockers | Retain genuine dependencies; resolved claims need evidence | workflow-matrix-test.mjs |
| Repeated reports | Unchanged work could emit the same investigation again | Do not award progress for duplicate evidence; request the specific unresolved decision | workflow-matrix-test.mjs |
| Review controls | Global assessment controls always visible | Only show and enable result judgment when the shared workflow permits it | matrix-test.mjs; browser qualification |
| Human review applicability | Passing checks offered approval even for NOT_REQUIRED | Technical pass advances automatically when human judgment is unnecessary | evidence-matrix-test.mjs |
| Review before results | Underlying decision functions allowed premature decisions | Reject invalid-stage decisions even if called outside the UI | workflow-matrix-test.mjs; evidence-matrix-test.mjs |
| Need more evidence | Structured branch logged request then returned to same review | Persist the request and generate a verification action until new evidence | evidence-matrix-test.mjs |
| Dependencies | Downstream satisfaction ignored open/changed prerequisites | Prerequisites and current evidence identities control satisfaction | evidence-matrix-test.mjs |
| Exact results | Evidence must match result and criterion | Changed artifacts invalidate old checks and acceptance | evidence-matrix-test.mjs |
| Completion | Complete projects could produce another continuation | Completion suppresses continuation until explicit reopening | workflow-matrix-test.mjs |
| Historical restore | Old fields could mix with current structured progress | Keep tracked evidence history read-only; full backups recover a consistent record | matrix-test.mjs |
| Record versus result | Checkpoint saving used acceptance language | Save records separately from accepting results or authorizing actions | matrix-test.mjs |
| Imports and recovery | Validate malformed headings, backups, history, drafts | Preserve source text; reject ambiguous data without overwriting existing projects | packet-test.mjs; storage-audit-test.mjs; migration-test.mjs |
| Persistence and safety | Existing storage/Trash protections | Preserve drafts, stale-tab detection, explicit permanent deletion, plain text rendering | existing regression suite |

## Interpretation limits

DiamondGate validates record correspondence and explicit workflow conditions. It does not independently establish that an arbitrary technical claim is true, measure physical-device performance, or grant external execution/publication permission. The receiving tool must perform the actual work and verification. The stopping rule must improve the handoff without converting missing evidence into a pass.

A candidate is not a live release. Browser and test results, exact candidate identity, outstanding findings, and release standing must be reported separately.


## Candidate qualification

- 150/150 Node tests pass, compared with 97 passing baseline tests. No skipped tests. Existing review fixtures were corrected to provide actual check identities instead of assuming premature approval was valid.
- Generated subpath entry check and whitespace check pass. All 23 changed paths are within Gen2889 admission and resolve through the repository router.
- Served-browser synthetic journey: execution prompt, result-only verification, matching PASS review, additional-evidence feedback, FAIL correction, changed result/PASS, human acceptance, project closure, explicit reopening, reload and downloaded-backup restoration. Original project retained beside restored copy. Premature review stayed hidden; complete scope disabled continuation.
- Independent functional review found additional failed-check and stalled-continuation defects; regression cases now cover them. Reviewers did not independently certify their own implementations.
- Original H-Earth report informed the failure cases; its referenced external media, actual world, and technical source claims were not rerun or certified by this product audit.
- Physical Android layout and user acceptance of this candidate remain outstanding. Publication is separate from this candidate qualification.
