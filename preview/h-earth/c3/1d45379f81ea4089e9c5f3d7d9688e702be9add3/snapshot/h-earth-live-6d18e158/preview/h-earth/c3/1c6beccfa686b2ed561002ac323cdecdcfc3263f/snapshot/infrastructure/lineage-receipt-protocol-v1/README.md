# Lineage Receipt Protocol v1

`LINEAGE_RECEIPT_PROTOCOL_v1` (LRPv1) is a small, domain-independent protocol for content-addressed execution lineage.

It answers one narrow question:

> Is this receipt still exactly consistent with the protocol metadata and payload from which its digest was created?

It does not claim that the payload is factually true or that its producer was authorized.

## What is standardized

- a strict cross-language JSON value domain;
- RFC 8785-compatible canonicalization over that restricted domain;
- SHA-256 receipt-body identity;
- a minimal receipt envelope;
- structured fail-closed verification;
- versioned conformance vectors;
- Python and ECMAScript reference implementations;
- read-only wrapping of historical Route Operator receipts without rewriting their legacy hashes.

## Minimal Python use

```python
from lineage_receipt_protocol_v1 import create_receipt, verify_receipt

receipt = create_receipt({"input": "dataset-A", "run": 7})
assert verify_receipt(receipt)["state"] == "VALID"
```

## Minimal JavaScript use

```js
import {createReceipt, verifyReceipt} from "./lineage_receipt_protocol_v1.mjs";

const receipt = await createReceipt({input: "dataset-A", run: 7});
console.assert((await verifyReceipt(receipt)).state === "VALID");
```

## Boundaries

LRPv1 is not a blockchain, distributed consensus system, signature scheme, authentication system, scientific-validity oracle, or truth oracle. It is a deterministic receipt and verification primitive intended to sit underneath those higher-level systems.

See `SPECIFICATION.md` for the normative candidate contract and `vectors/` for conformance data.
