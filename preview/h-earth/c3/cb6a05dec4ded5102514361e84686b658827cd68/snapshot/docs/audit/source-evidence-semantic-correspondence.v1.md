# Universal Source-Evidence Semantic Correspondence

Status: governing audit/provenance specification candidate.

This record generalizes the historical Audralia ROOM_04_SOURCE_EVIDENCE source-hash determination into a repository-level pattern. `ROOM_04_SOURCE_EVIDENCE` is provenance/alias only and is not the implementation identity.

## Universal determination identity

`SOURCE_EVIDENCE_SEMANTIC_CORRESPONDENCE`

A source-evidence correspondence passes only when all seven noncompensatory relations pass independently:

`VALUE ∧ VERSION ∧ DOMAIN_DEFINITION ∧ SEMANTIC_OBJECT ∧ CANONICAL_BYTES ∧ FIELD_MEANING ∧ EVIDENTIARY_CLAIM`

Digest equality alone is insufficient. Envelope-identity equality, receipt equality, downstream projection equality, publication status, or unrelated implementation results may not compensate for any failed, held, or conflicting relation.

## Seven relations

1. **Value** — the carried digest/value equals the admitted source-evidence digest.
2. **Version** — the declared hash/version identity binds the correct algorithm, canonicalization, domain law, separator, and semantic object.
3. **Domain definition** — field-level semantic identifiers and preimage-domain identifiers are explicitly bound; literal string equality is not required unless the governing contract says so.
4. **Semantic object** — the exact object represented by the digest is identified and distinguished from downstream summaries, transport envelopes, raw undomained hashes, or unscoped digest strings.
5. **Canonical bytes** — the admitted source object deterministically reproduces the canonical byte sequence and all declared raw/domain-separated digests.
6. **Field meaning** — the downstream field's meaning is explicitly tied to the authenticated source-evidence object.
7. **Evidentiary claim** — the proof scope is bounded to what the correspondence establishes and excludes unrelated validity, readiness, release, or admission claims.

## Historical Audralia instantiation

Provenance alias: `ROOM_04_SOURCE_EVIDENCE`.

Historical source object: `AUDRALIA_DIAGNOSTIC_SOURCE_BUNDLE_v1`.

Current-pass canonical source byte length: `814`.

Raw SHA-256: `099b29178abf288064d3d42565a05768ca7ae48a650be514abe0bb32ab30fcc7`.

Preimage domain: `AUDRALIA:D05:SOURCE:v1`.

Separator: `0x00`.

Domain-separated SHA-256: `311c5c341cc1b3e3e7a46bd418deb94d0093c089babe74370c0fe73432227526`.

Downstream field: `D07.sourceHash` with field-semantic domain `AUDRALIA_DIAGNOSTIC_AUTHORITY_SOURCE_HASH`, version `SHA256-D05-1`, and value equal to the domain-separated D05 digest.

D06 `sourceSummary` is a downstream semantic projection and is not the source-hash preimage or semantic object.

Historical specialist result: `SOURCE_HASH_DOMAIN_SEMANTIC_CORRESPONDENCE_PASS` after all seven relations independently passed.

Historical verification lineage records 16/16 Room 05 absorption checks passed, 14 computed hash vectors passed, 8 relation-vector adjudications passed, and an empty discrepancy set. These facts are provenance for the Audralia instantiation, not universal constants.

## Corpus classification

- Historical recovered artifacts and physical-byte gaps belong to the **Legacy Evidence Corpus**.
- The seven-part correspondence law, noncompensation law, completed determinations, transition obligations, and claim ceilings belong to the **Governing Invariant and Transition Corpus**.
- Newly authorized source artifacts, executable fixtures, execution evidence, repository state, deployment state, and release evidence belong to the **Replacement Target Corpus**.

The three corpora may be linked but must not be merged. Legacy and replacement identity are distinct by default; lineage must be explicit.

## Claim ceiling

A correspondence PASS establishes only the defined source-evidence semantic correspondence. It does not by itself establish downstream projection validity, overall correspondence, implementation conformance beyond the scoped mechanism, readiness, release, governing admission, or permanent closure.

## Historical state preservation

Prior states such as `UNRESOLVED_HELD` remain retained history. A later PASS supersedes the active specialist uncertainty without deleting the history that explains why the hold existed.

## Repository use

Future implementations should reference the universal `SOURCE_EVIDENCE_SEMANTIC_CORRESPONDENCE` identity and record domain-specific rooms, lanes, tools, or authorities only as provenance aliases. New implementations should provide explicit lineage to their source object, canonicalization law, domain law, verifier evidence, and downstream representations rather than copying Audralia-specific naming into the universal contract.
