# IMI Infrastructure-Independent Verification Gate v1

STATUS = ACTIVE_GOVERNANCE_AMENDMENT_CANDIDATE

AUTHORITATIVE_SCIENTIFIC_CANDIDATE = `5941e4841f2faf2664a0ec400642d85fd68e37e9`

AUTHORITATIVE_TREE = `fd9c7e0402075725f3262c4c1394ae2b7db53d49`

PURPOSE = preserve exact-head scientific verification without dependence on GitHub Actions availability.

## Non-mutation law

This gate does not modify the scientific candidate, tests, thresholds, comparators, custody requirements, prediction rules, admission criteria, or falsification conditions. It changes only the permitted execution infrastructure for the already-frozen verification procedure.

## Gate definition

The scientific requirement is `REPRODUCIBLE_EXACT_HEAD_VERIFICATION`, not GitHub Actions as a vendor.

Passage may be established by either:

1. the existing GitHub Actions Route Operator conformance workflow passing on the authoritative candidate; or
2. two independent clean executions of the frozen verifier package on the same authoritative candidate and tree.

## Required independent execution properties

Each execution must:

- begin from the exact authoritative commit and tree;
- use a clean environment with Python 3.12;
- execute `test_route_operator_platform_v1.py`;
- execute `test_pointer_custody_v1.py`;
- execute `demo_route_operator_platform_v1.py` and retain its JSON receipt;
- execute `verify_platform_manifest` against the repository root;
- execute `verify_imi_package_pointer` against `IMI_PACKAGE_POINTER.json`;
- validate `PLATFORM_AUTHORITY.json`, `IMI_PACKAGE_POINTER.json`, `MANIFEST_SHA256.json`, and the demonstration receipt as JSON;
- record the commit SHA, tree SHA, environment, input hashes, receipt hash, commands, timestamps, and terminal outcome;
- preserve complete stdout and stderr;
- disclose verifier identity and independence;
- execute without hidden intervention outcomes or scientific data.

## Equivalence rule

The alternative gate passes only when both independent executions:

- report all required tests and integrity checks as PASS;
- bind to the same authoritative commit and tree;
- produce matching deterministic demonstration receipt hashes;
- produce no unresolved discrepancy;
- are reviewed and admitted in Issue #674.

Any mismatch yields `INDETERMINATE`, not PASS.

## Independence minimum

The two executions must not share the same mutable workspace. At least one must be performed by an executor independent of the protocol authoring process. Containerized runs on separate machines are preferred.

## Governance disposition

This amendment is infrastructure substitution, not protocol relaxation.

Until either the GitHub Actions route passes or the two-run equivalent gate is fully satisfied:

- formal system admission remains closed;
- prediction freeze remains prohibited;
- hidden outcomes remain sealed;
- scoring and scientific evidence claims remain prohibited.

Upon valid passage, the next transition remains unchanged:

`VERIFICATION_PASS -> FORMAL_REGISTRATION_OPEN -> INDEPENDENCE_AND_ADMISSIBILITY_REVIEW`

## Prohibitions

- no candidate mutation;
- no test removal or threshold change;
- no single-run self-certification;
- no post-outcome gate amendment;
- no hidden-outcome access;
- no scientific interpretation of infrastructure failure;
- no equivalence claim without matching receipts.
