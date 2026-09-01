# Estate-Wide Validation Sidecar v1

Status: `CANDIDATE_NONPRODUCT_VALIDATION_INFRASTRUCTURE`

This namespace is additive and read-only with respect to the systems it evaluates.

Its purpose is to make validation claims explicit, bounded, reproducible, and auditable without changing the subject under validation.

## Governing rule

`VALIDATION MAY OBSERVE, COPY, HASH, REPLAY, COMPARE, AND CHALLENGE. VALIDATION MAY NOT SILENTLY ALTER THE OBJECT IT IS VALIDATING.`

The sidecar separates:

- exact asset identity;
- implementation verification;
- conformance to a frozen internal specification;
- benchmarking against an external reference;
- genuine independent reproduction;
- independent security review;
- scientific or empirical validation where applicable;
- certification or accreditation by a competent external body.

No generic `VALIDATED` label is permitted because it hides which of those propositions has actually been established.

## Current boundary

This candidate does not:

- change H-Earth, Laws, Route Operator, IMI mathematics, or LRPv1;
- grant product, merge, deployment, scientific, release, or acceptance authority;
- convert an internal test into independent validation;
- convert a standards crosswalk into certification;
- convert software correctness into scientific validity;
- erase an earlier failed attempt after a later success.

## Structure

- `master-validation-register.v1.json` — initial estate asset/claim inventory.
- `standards/standards-registry.v1.json` — external reference identifiers and their bounded intended use.
- `claims/validation-classes.v1.json` — validation classes, statuses, evidence-source classes, and anti-overclaim rules.
- `schemas/asset-validation-record.schema.v1.json` — structural record contract.
- `crosswalks/` — bounded external-reference mappings.
- `harness/verify-estate-validation.v1.mjs` — dependency-free manifest, register, semantic overclaim, subject-identity, and LRPv1 receipt verifier.
- `harness/fixtures/` — one admissible fixture and one deliberately inadmissible overclaim fixture.
- `reproduction/README.md` — clean-room reproduction boundary.
- `threat-model/README.md` — validation-system and LRPv1 threat boundary.
- `manifest.v1.json` — SHA-256 identity for every validation-sidecar source file except the manifest itself.

## Evidence policy

An `ESTABLISHED` status requires evidence. More importantly, the evidence class must be capable of supporting the claim class.

Internal CI can establish an internal implementation-verification result. It cannot establish independent reproduction, independent security review, certification, accreditation, or broad scientific validity.

The verifier fails closed when the negative overclaim fixture is accepted.

## Execution

The repository workflow performs:

1. exact-head checkout;
2. repository-router self-test;
3. mutation-intent routing for this sidecar and its workflow;
4. manifest and semantic validation;
5. subject-identity checks;
6. negative-overclaim rejection;
7. an LRPv1 receipt over the compact validation summary;
8. artifact upload of the command-emitted receipts.

A successful run establishes only the bounded internal claims emitted by that run.
