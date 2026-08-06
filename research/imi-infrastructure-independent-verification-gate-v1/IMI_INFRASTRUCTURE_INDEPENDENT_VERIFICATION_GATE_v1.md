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
2. two independent clean executions of the frozen verifier procedure on the same authoritative candidate and tree.

## External-tool execution law

The verifier implementation is governance tooling and is not part of the frozen scientific candidate. It must be executed from outside an untouched checkout of the authoritative candidate.

The verifier must receive:

- the path to the untouched frozen checkout;
- an output directory outside that checkout;
- an executor identifier;
- an independence and workspace-separation attestation.

The verifier must refuse execution if:

- the checkout HEAD or tree differs from the authoritative identity;
- the frozen checkout contains tracked or untracked modifications;
- the output directory is inside the frozen checkout;
- Python is not version 3.12;
- the required Route Operator package is absent.

Canonical invocation:

```text
python run_equivalent_verifier.py \
  --repository-root /absolute/path/to/frozen-checkout \
  --output-dir /absolute/path/to/new-empty-output-directory \
  --executor-id EXECUTOR_IDENTIFIER \
  --independence-attestation "INDEPENDENCE_AND_WORKSPACE_STATEMENT"
```

The frozen checkout and the verifier-tool checkout must remain separate.

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

## Output package

Each execution must produce:

- `imi-equivalent-verifier.receipt.json`, containing the complete executor-specific run record;
- `imi-equivalent-verifier.comparison.json`, containing only the fields that must match across independent runs;
- `route-operator-platform-v1-demo.receipt.json`, containing the deterministic demonstration output.

Full receipt hashes are not required to match because timestamps, operating systems, paths, and executor identities may differ. The comparison projections and deterministic demonstration receipt hashes must match.

## Equivalence rule

The alternative gate passes only when both independent executions:

- report all required tests and integrity checks as PASS;
- bind to the same authoritative commit and tree;
- produce matching input hashes and comparison projections;
- produce matching deterministic demonstration receipt hashes;
- produce no unresolved discrepancy;
- are reviewed and admitted in Issue #674.

Any mismatch yields `INDETERMINATE`, not PASS.

## Independence minimum

The two executions must not share the same mutable workspace. At least one must be performed by an executor independent of the protocol authoring process. Containerized runs on separate machines are preferred.

The planned paths are:

- `RUN_A = PROJECT_CONTROLLED_CLEAN_CONTAINER_OR_VM`;
- `RUN_B = INDEPENDENT_EXTERNAL_CLEAN_CONTAINER_OR_VM`.

Neither run alone may certify passage.

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
- no verifier execution from the amendment branch against itself;
- no output written into the frozen checkout;
- no post-outcome gate amendment;
- no hidden-outcome access;
- no scientific interpretation of infrastructure failure;
- no equivalence claim without matching receipts.
