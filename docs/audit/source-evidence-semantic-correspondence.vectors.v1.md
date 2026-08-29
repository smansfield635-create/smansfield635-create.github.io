# Source-Evidence Semantic Correspondence — Verification Vectors

Universal verification should include both byte/hash vectors and semantic-relation vectors. The Audralia historical instantiation below is retained as a reference fixture family, not as a universal constant.

## Historical computed hash vectors

Positive reference:
- exact domain label `AUDRALIA:D05:SOURCE:v1`
- separator `0x00`
- exact 814 canonical D05 bytes
- expected SHA-256 `311c5c341cc1b3e3e7a46bd418deb94d0093c089babe74370c0fe73432227526`

Negative classes verified historically:
1. separator omitted;
2. separator changed to newline;
3. trailing newline appended;
4. UTF-8 BOM prepended;
5. preimage domain changed;
6. top-level key order reversed;
7. source-array order reversed;
8. source-record key order reversed;
9. provenance key order reversed;
10. required field omitted;
11. source version mutated;
12. field-domain identifier incorrectly substituted for the preimage domain;
13. D06 sourceSummary bytes substituted for the D05 semantic object.

Historical result: 14/14 computed hash vectors reproduced as declared, with all negative digests differing from the positive digest.

## Historical semantic relation vectors

1. raw D05 file hash substituted for the required domain-separated value → FAIL;
2. D07 transport digest substituted for sourceHash.value → FAIL;
3. D06 sourceSummary designated as semantic object → FAIL;
4. field-domain identifier required to equal the preimage-domain string literally → FAIL;
5. digest equality asserted to prove D06 projection validity → FAIL;
6. envelope-ID verification asserted to compensate for sourceHash semantic failure → FAIL;
7. matching value/version with undefined semantic object → HELD;
8. matching value/object with canonical bytes unavailable → HELD.

Historical result: 8/8 relation-vector adjudications were coherent with the governing noncompensatory decision law.

## Universal requirement

Implementations should instantiate equivalent vectors for their own object, canonicalization, domain, semantic object, field meaning, and claim ceiling. The specific Audralia hashes and identifiers are provenance examples only.
