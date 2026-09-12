# Agentic Frontier Replication Cycle v2

Status: candidate research execution contract; no outcome claims are created by this file.

Purpose: obtain a materially more defensible replication of the frozen 24-task Diamond Gate vs stock OpenHands comparison without changing the frozen task manifest or comparison protocol.

Sequence:

1. Resolve stock `openhands==1.14.0` once and capture the complete `pip freeze` environment plus SHA-256.
2. Run a neutral OpenHands inspect/edit/test capability control using the same `qwen2.5-coder:7b` Ollama runtime.
3. Only if that neutral control passes, reconstruct the exact frozen OpenHands environment and replay frozen AF-IR-01.
4. Treat AF-IR-01 `DG_ONLY`, `OH_ONLY`, `BOTH_PASS`, or `NEITHER` as an observed task outcome; do not require both lanes to pass before the population proceeds.
5. Reconstruct the same frozen OpenHands environment in each population shard and execute the unchanged remaining 23 frozen tasks.
6. Aggregate the current AF-IR-01 receipt plus the remaining 23 receipts only after 24 unique current receipts exist.
7. Compare against the preserved baseline: Diamond Gate 7/24, OpenHands 0/24, neither 17/24.

Failure boundaries:

- Neutral control failure: stop; OpenHands task outcomes remain infrastructure-ambiguous.
- Environment reconstruction mismatch: stop; no population comparison.
- Common model runtime unavailable: stop; no asymmetric inference.
- Missing or duplicate task receipts: stop; no aggregate claim.
- Negative, null, or unfavorable comparative outcomes are preserved unchanged.

Claim ceiling: this replication can support statements about the tested frozen population under the captured runtime. It cannot establish universal agent superiority or architecture-only causation.
