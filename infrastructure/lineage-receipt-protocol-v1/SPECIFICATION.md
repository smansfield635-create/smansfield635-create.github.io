# Lineage Receipt Protocol v1 — Specification

Status: `CANDIDATE_STANDARD_v1`

Protocol identifier: `LRP`

Protocol version: `1.0.0`

Canonicalization identifier: `JCS-RFC8785-SAFEINT`

Digest algorithm: `SHA-256`

## 1. Purpose

LRPv1 provides a domain-independent, content-addressed, tamper-evident receipt for computational lineage. It proves that a receipt body is consistent with a specific canonical byte representation and digest. It does not prove that the facts inside the payload are true, that the producer was authorized, or that the claimed execution actually occurred.

## 2. Accepted value domain

LRPv1 deliberately accepts a strict subset of I-JSON/JCS values:

- JSON `null`;
- JSON Booleans;
- Unicode strings containing no lone UTF-16 surrogate code points;
- integers in `[-9007199254740991, 9007199254740991]`;
- arrays containing accepted values, with element order preserved;
- objects with string property names and accepted values.

LRPv1 rejects floating-point values, `NaN`, infinities, integers outside the safe range, binary blobs embedded as language-native objects, and language-specific values such as Python tuples/sets or JavaScript `BigInt`, `Date`, `Map`, and `Set`.

Applications that require decimal, arbitrary-precision, datetime, binary, or other semantic types MUST encode them using a profile-level string/object convention before passing the payload into LRPv1.

The v1 restriction on numbers is intentional. RFC 8785 defines ECMAScript/IEEE-754 number serialization, but LRPv1 initially narrows the numeric domain to safe integers so the Python and ECMAScript reference implementations can provide cross-language determinism without introducing an independent floating-point serialization algorithm.

## 3. Canonicalization

For every accepted value, LRPv1 emits canonical JSON according to the applicable RFC 8785 JCS rules:

- no whitespace between JSON tokens;
- literals serialize as `null`, `true`, and `false`;
- strings use JSON/ECMAScript escaping and are preserved without Unicode normalization;
- object property names are sorted recursively by their raw UTF-16 code units as unsigned values;
- array order is never changed;
- canonical text is encoded as UTF-8.

Because LRPv1 accepts only safe integers, integer serialization is the ordinary base-10 JSON representation and is identical in the Python and ECMAScript reference implementations for the accepted range.

## 4. Receipt body and digest

The digest binds the protocol metadata and payload together. The receipt body is:

```json
{
  "protocol": "LRP",
  "protocol_version": "1.0.0",
  "canonicalization": "JCS-RFC8785-SAFEINT",
  "digest_algorithm": "SHA-256",
  "payload": {}
}
```

Let `C(body)` be the canonical UTF-8 bytes and let `SHA256` be SHA-256. Then:

`lineage_digest = lowercase_hex(SHA256(C(body)))`

A full receipt is the body plus the `lineage_digest` field. The digest is not computed over itself.

## 5. Verification

A verifier MUST fail closed when:

- the receipt is not an object;
- any required top-level field is missing;
- an undeclared top-level field is present;
- protocol, version, canonicalization, or digest identifiers differ;
- the payload violates the accepted value domain;
- the claimed digest is not 64 lowercase hexadecimal characters;
- recomputing the receipt-body digest does not equal the claimed digest.

Verification returns `VALID` only when every required check succeeds. LRPv1 itself does not define `UNEVALUABLE` or scientific/numeric states; those belong to higher-level profiles such as Route Operator or IMI.

## 6. Security and trust boundary

LRPv1 provides content identity and tamper evidence relative to a trusted receipt/digest anchor. It does not provide producer authentication, authorization, trusted timestamps, non-repudiation, or external append-only history. Those capabilities require an additional signature, key-management, timestamping, or transparency-log layer.

## 7. Legacy Route Operator compatibility

`ROUTE_OPERATOR_CANONICAL_V1` remains a separate historical canonicalization contract. Existing Route Operator receipts are never silently reinterpreted as LRPv1 receipts. The included read-only integration verifies the legacy receipt under its original Python canonicalization contract and then serializes the complete verified legacy receipt under that same historical canonicalization. The resulting canonical JSON text is carried as a string inside a new LRPv1 payload together with the original `receipt_sha256`. This avoids reinterpreting legacy floating-point values through the narrower LRPv1 value domain.

This produces a migration chain without invalidating or silently reserializing historical hashes.

## 8. Conformance

A conforming implementation MUST reproduce every valid vector in `vectors/lrpv1_conformance_vectors.json` byte-for-byte and digest-for-digest, and MUST reject the invalid value-domain and tampering cases covered by the reference conformance suites.

The Python and ECMAScript implementations are reference implementations, not independent standards. This specification and its versioned conformance vectors define LRPv1 behavior.
