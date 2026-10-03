# Auren Pre-Publication Contradiction and Dependency Audit
Status: PRE-DISPATCH STATIC CLOSURE
Date: 2026-10-02
Candidate head: 2a5144d5a2841b5c9f18a753aebf73ea6fcd100f

## Scope audited
- runtime lexical scope and helper dependencies;
- script load/global initialization dependencies;
- voice graph node/choice referential integrity;
- semantic session/revisit predicates;
- transcript/scroll architecture contradictions;
- handoff DOM/state behavior;
- verifier click/readiness assumptions;
- verifier traversals against actual voice labels;
- publication manifest include/exclude contract;
- exact-head workflow lineage boundary.

## Proven runtime repairs already incorporated
1. P2 formExpression no longer reaches boot-local thread.
2. P2 formExpression no longer reaches boot-local seq.
3. P2 formExpression no longer reaches boot-local wait.
4. Module-scope audit now finds zero references to boot-local runtime bindings.
5. Obsolete nearBottom/scrollThread helpers removed; runtime no longer carries old transcript-scroll machinery.
6. record() revisit detection now uses the same topicSeen predicate as S12 continuity.

## Voice graph proof
- 40 nodes discovered;
- every choice target resolves to a real node;
- zero duplicate node keys;
- no runtime subject-map IDs reference nonexistent product/story nodes.

## Dependency/load proof
HTML load order establishes session/archetype/state/scene/return/custody/privacy/voice/geometry/presentation/environment before chamber runtime.
Required chamber boot globals are all defined by those preceding scripts.
Previous diagnostic confirmed those required globals were present even when P2 scope failed.

## Verifier repairs
- startup failure diagnostics persist before timeout;
- click completion no longer assumes option-label arrays must change;
- click waits on semantic node change or handoff-state change;
- final traversals use labels present in the accepted voice graph;
- browser/page errors remain acceptance failures.

## Publication/workflow proof
- publication manifest token audit: PASS, zero missing/forbidden;
- complete lineage boundary was previously proven with zero unauthorized non-analytics files;
- no product route changes introduced by this audit.

## Remaining evidence boundary
Static audit cannot substitute for browser execution.
The next run is allowed only because known false dependencies and contradictions have been audited and repaired before dispatch.
If browser qualification passes, proceed to publication fast preflight.
