# Threat Model Boundary

Status: `INITIAL_LIMITED_THREAT_MODEL_v1`

This document states the protection boundary of the validation sidecar and the present LRPv1 primitive. It is not an independent security audit.

## Assets protected by the sidecar

- exact validation-source identities through SHA-256 manifest entries;
- declared validation classes and evidence-source classes;
- anti-overclaim rules;
- exact-head execution receipts;
- compact LRPv1 identity for the verification summary.

## Current LRPv1 security property used here

LRPv1 can determine whether a receipt remains exactly consistent with its declared protocol metadata and payload under its supported value domain.

It does not by itself establish:

- factual truth of the payload;
- producer identity;
- producer authorization;
- digital-signature authenticity;
- trusted timestamping;
- non-repudiation;
- append-only history;
- protection against an adversary who can replace both an unsigned artifact and its unsigned receipt together.

## Adversary cases

The harness must fail when:

1. a manifest-bound sidecar source file changes without a manifest update;
2. an unknown validation class or status is introduced;
3. an `ESTABLISHED` claim has no evidence;
4. internal evidence is used to claim independent reproduction;
5. internal evidence is used to claim independent security review;
6. certification/accreditation is claimed without `ACCREDITED_BODY` evidence;
7. a standards reference is represented as certification;
8. the deliberately invalid overclaim fixture is accepted.

## Outside the present protection model

- compromise of GitHub or the repository control plane;
- malicious replacement of both a subject artifact and all unsigned identity records by an actor controlling the trusted repository;
- signing-key compromise because signatures are not part of LRPv1 v1;
- transparency-log rollback because no external append-only transparency service is part of this candidate;
- truth or scientific-validity adjudication by cryptographic identity alone.

Future signature, identity, transparency, and external-review work must remain separate successor scopes.
