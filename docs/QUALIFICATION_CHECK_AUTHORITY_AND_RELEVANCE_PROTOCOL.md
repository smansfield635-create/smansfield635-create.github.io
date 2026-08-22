# Qualification Check Authority and Relevance Protocol

Status: repository-wide acceptance law.

## Purpose

Prevent irrelevant, external, or failed verification infrastructure from being misclassified as a product failure and triggering unnecessary product changes.

A red check is not automatically a product rejection. A product candidate may be rejected only by an authoritative check declared for the active operation and only when that check actually completes its intended evaluation and emits machine-readable acceptance evidence.

## Classification order

Every failed or red check must be classified before any product mutation is authorized:

1. `AUTHORITATIVE_PRODUCT_FAIL` — the active operation declared the check, the verifier completed, a machine-readable acceptance result exists, and one or more declared product criteria failed. This may authorize a bounded product correction.
2. `QUALIFIER_INFRA_FAILURE` — the verifier/runner/browser/checkout/harness crashed or failed before an acceptance result was produced. This blocks merge until repaired and rerun, but MUST NOT authorize product mutation.
3. `FALSE_POSITIVE_SCOPE` — the check completed enough to expose that it evaluated an unauthorized/non-consumer/non-project surface. Repair the gate and rerun; do not alter product bytes to satisfy it.
4. `NON_BLOCKING_EXTERNAL` — an external provider or integration that is not publication/execution authority for the operation. It cannot block the operation.
5. `UNRELATED_PROJECT` — a page/project/benchmark/clone check not declared by the active operation. It cannot block the operation.
6. `AUTHORITATIVE_PASS` — declared check completed and emitted a machine-readable pass.

## Permanent non-blocking defaults

Unless an active operation explicitly declares otherwise:

- Vercel statuses are non-blocking for Diamond Gate GitHub Pages publication. Vercel quota, preview, or deployment failures do not reject a GitHub Pages candidate.
- Benchmark Compass checks do not block a page-specific operation unless that operation declares Benchmark Compass as an acceptance dependency.
- clone/isolated-clone checks do not block live-root work.
- H-Earth, Audralia, Laws, Door, Home, Showroom, or other page/project workflows do not block a different page's bounded operation.
- a workflow being red because an artifact was never created after an earlier harness crash is the same infrastructure failure, not a second product failure.

## Harness failure rule

Examples such as `Execution context was destroyed`, browser launch failure, checkout failure, runner failure, timeout before the verifier starts evaluating criteria, or a missing result artifact caused by the verifier crash are `QUALIFIER_INFRA_FAILURE`.

The required response is:

`FIX/RERUN QUALIFIER -> OBTAIN MACHINE-READABLE RESULT`

not:

`MUTATE PRODUCT`.

## Gate-scope rule

Static-asset identity authority belongs to actual consumers/loaders. A changed asset is not its own loader merely because its source contains a string naming its public path. Nonexistent inferred consumers are not authority. Self-reference (`page === asset`) and non-consumer string occurrences must not create stale-identity violations.

## Active-operation rule

Each operation's execution/qualification packet should identify the checks that are allowed to block it. All other checks are informational by default.

The repository machine-readable companion is `.github/qualification/check-authority.v1.json`.

## Current Compass R2 precedent

For candidate head `16db35228fd6aa505935e69c10ed16a507fb2128`, the two reported red pre-merge runs are instrumentation failures until successfully rerun:

- Compass audit qualification crashed with an execution-context/navigation error before producing the audit result. Classification: `QUALIFIER_INFRA_FAILURE`.
- Static Asset Identity Gate correctly observed fresh `index.html` identities for the two changed Compass assets but also treated `compass.crystals.js` as its own consumer. Classification: `FALSE_POSITIVE_SCOPE`.

Neither result authorizes another Compass product mutation. The two instruments must be corrected and rerun against the unchanged candidate first.
