# Administrative Observatory

This directory contains the first read-only Administrative Layer read model.

The observatory does not admit operations, close locks, dispatch successors, mutate repositories, deploy pages, release products, or rewrite control-plane state. It consumes already-collected receipts, workflow summaries, issue-return comments, artifact references, and related evidence references, then returns semantic classification.

## First acceptance cases

The first two cases are intentionally different.

1. A public `Remote Operation Successor v1` run that fails closed with `TEST_COMMAND_MISMATCH` on `exactTestCommand` should normalize as healthy platform protection and a request/procedure contract-composition failure.
2. A private research workflow failure with unavailable raw log detail should normalize as a research experiment failure with insufficient durable detail, not as shared control-plane failure.

## Test command

```bash
node --test tools/admin-observatory/administrative-failure-normalizer.self-test.v1.mjs
```

## Authority boundary

The module exports an authority boundary in which all authority-bearing capabilities are false:

- repository mutation authority
- lock authority
- admission authority
- successor authority
- deployment authority
- release authority
- workflow dispatch authority
- operation-ledger mutation authority

If a future administrative component needs any of those powers, it is no longer this read-only observatory and must be admitted as a separate governed operation.
