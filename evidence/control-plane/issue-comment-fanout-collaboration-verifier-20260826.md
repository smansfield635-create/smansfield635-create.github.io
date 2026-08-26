# Issue-comment fanout collaboration verifier — 2026-08-26

Independent verifier bound to public main `1f7a9753dafab681e9b68e23197056aee8024d04`.

Verified live `issue_comment` transports that exist at this head:

1. `.github/workflows/ai-room-execution-transport.yml`
2. `.github/workflows/canonical-operation-intake-transport-v1.yml`
3. `.github/workflows/public-private-successor-execution-v1.yml`
4. `.github/workflows/public-private-terminal-closure-carrier-v1.yml`
5. `.github/workflows/remote-operation-terminal-closure-v1.yml`

`.github/workflows/remote-operation-terminal-closure-v2.yml` does not exist at this head (404), so any consolidation verifier expecting six retained listeners is stale and will fail closed incorrectly.

The neighboring backend room owns the active consolidation execution from issue #2123. This verifier does not authorize or launch a competing consolidation. It exists to provide independent corroboration that the correct retained transport count is five and to prevent reintroduction of the nonexistent v2 listener into the acceptance set.

Expected consolidation acceptance after the neighboring execution lands:

- exactly the five files above retain top-level `issue_comment` subscriptions;
- at least 20 legacy listeners are retired (neighboring execution targets 25);
- the temporary one-shot consolidation listener retires itself;
- no product/runtime bytes change;
- receipt retained-count and filename set match repository bytes;
- only then issue one fresh exact-head Laws canonical intake as the final transport proof.
