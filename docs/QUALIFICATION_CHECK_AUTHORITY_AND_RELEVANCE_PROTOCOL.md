# Qualification Check Authority and Relevance Protocol

Status: repository-wide acceptance law.

A red check is not automatically a product rejection. A candidate may be rejected only by an authoritative check declared for the active operation and only when that check completes its intended evaluation and emits machine-readable acceptance evidence.

## Classification order

Every failed/red check must be classified before product mutation:

1. `AUTHORITATIVE_PRODUCT_FAIL` — declared check completed and emitted explicit failed acceptance criteria. Product correction may be authorized.
2. `QUALIFIER_INFRA_FAILURE` — verifier/runner/browser/checkout/harness failed before an acceptance result existed. Merge waits for repair/rerun; product mutation is prohibited.
3. `FALSE_POSITIVE_SCOPE` — the gate evaluated an unauthorized/non-consumer/non-project surface. Repair the gate and rerun; do not alter product bytes.
4. `NON_BLOCKING_EXTERNAL` — external integration that is not authority for this operation. It cannot block.
5. `UNRELATED_PROJECT` — page/project/benchmark/clone check not declared by this operation. It cannot block.
6. `AUTHORITATIVE_PASS` — declared check completed with a machine-readable pass.

## Permanent defaults

Unless explicitly declared by the active operation:

- Vercel statuses are non-blocking when GitHub Pages is publication authority. Quota, preview, or deployment failures do not reject the candidate.
- Benchmark Compass checks do not block page-specific work.
- clone/isolated-clone checks do not block live-root work.
- H-Earth, Audralia, Laws, Door, Home, Showroom, or other page workflows do not block a different bounded operation.
- a missing artifact caused by an earlier verifier crash is part of the same infrastructure failure, not a second product failure.

## Harness failure rule

`Execution context was destroyed`, browser launch failure, checkout failure, runner failure, timeout before acceptance evaluation, or a missing result caused by verifier failure are `QUALIFIER_INFRA_FAILURE`.

Required response: `FIX/RERUN QUALIFIER -> OBTAIN MACHINE-READABLE RESULT`.

Forbidden response: mutate product to satisfy a check that never evaluated the product.

## Gate-scope rule

Static-asset identity authority belongs to actual consumers/loaders. A changed asset is not its own loader merely because its source contains a string naming its public path. Nonexistent inferred consumers are not authority. Self-reference (`page === asset`) and non-consumer string occurrences must not create stale-identity violations.

## Active-operation rule

Each operation packet/manifest identifies the checks allowed to block it. All others are informational by default. Machine-readable companion: `.github/qualification/check-authority.v1.json`.

## Compass R2 precedent

For candidate head `16db35228fd6aa505935e69c10ed16a507fb2128`, the two red pre-merge runs were instrumentation failures until rerun:

- Compass audit qualification crashed with an execution-context/navigation error before producing the audit result: `QUALIFIER_INFRA_FAILURE`.
- Static Asset Identity Gate observed fresh `index.html` identities for both changed Compass assets but also treated `compass.crystals.js` as its own consumer: `FALSE_POSITIVE_SCOPE`.

Neither result authorizes another Compass product mutation. Correct the instruments and rerun the unchanged candidate first.
