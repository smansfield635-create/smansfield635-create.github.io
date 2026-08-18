# Semantic Evidence Conformance Support v1

Status: `CANDIDATE_NONPRODUCT_VALIDATION_INTEGRATION`

This package extends the existing Estate Validation sidecar without creating a second validation system and without modifying `LINEAGE_RECEIPT_PROTOCOL_v1`.

It provides reusable conformance profiles for four boundaries that were previously distributed across project-specific implementations:

1. semantic relation decisions preserve `ASSERTED`, `NONE`, `UNKNOWN`, `UNEVALUABLE`, and `CONFLICTED` as distinct states;
2. authority transitions cannot silently promote relation state, standing, or claim ceiling;
3. AI may paraphrase, synthesize, infer, or hypothesize within an explicit authority envelope, but AI reasoning alone cannot upgrade the source record;
4. a failed runtime must capture, seal, and persist decisive evidence before teardown.

## Layering

```text
SUBJECT SYSTEM
  -> semantic/runtime evidence payload
  -> LRPv1 receipt
  -> Estate Validation conformance/replay
```

The subject produces evidence. LRPv1 seals that evidence. Estate Validation evaluates bounded conformance claims. These roles are not interchangeable.

## What this package does not do

- It does not modify LRPv1.
- It does not construct the Laws relation resolver or the future contextual graph.
- It does not instrument the Laws spacecraft directly.
- It does not mutate H-Earth, Laws, Showroom, Research, Tests, or any product route.
- It does not claim that a payload is scientifically true.
- It does not establish producer identity, signatures, trusted timestamps, non-repudiation, certification, accreditation, or independent validation.
- It does not upgrade any scientific claim.
- It does not replace the Estate Validation master register, manifest, validation-class registry, threat model, or reproduction boundary.

## Immediate consumers

Later project-specific implementations can consume these profiles without redefining them:

- teardown-safe browser/runtime capture;
- Laws relation-resolution receipts;
- AI evidence-conformance adapters;
- authority-transition ledgers;
- contextual-graph verification after the graph contract is separately frozen.

## Verification

The self-verifier:

- accepts a valid `UNKNOWN` semantic decision with no asserted edge;
- rejects `UNKNOWN -> edgeEligible=true`;
- rejects AI claim-class inflation, unauthorized assertion, and suppression of unresolved state;
- rejects teardown before evidence capture/persistence;
- rejects an unauthorized transition from `UNKNOWN` to `ASSERTED`;
- accepts corresponding bounded positive cases;
- seals the compact verification summary with the existing LRPv1 JavaScript implementation;
- verifies the LRPv1 receipt;
- deliberately tampers with the receipt payload and requires LRPv1 to reject it.

A PASS is internal implementation/conformance evidence only. It is not external validation or certification.
