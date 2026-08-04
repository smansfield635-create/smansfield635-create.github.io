# Generic first-assignment infrastructure

This package is role-neutral and operation-neutral. It does not assign Role 6 or any other role, does not bind a substantive operation, and does not activate permanent authority during construction or verification.

A future production assignment must supply an authentic activation-eligibility receipt, a hash-bound bounded-operation packet, a separate user-origin atomic-assignment authorization receipt, an exact expected ledger head, and a unique holder execution identity.

The first-assignment tool must enforce compare-and-swap ledger semantics. Admission is limited to the exact role, operation, holder, assignment, and ledger head. Return closes only that active assignment. Return does not adopt substantive outputs, assign another role, merge, deploy, or mutate product surfaces.

All construction-time and verifier executions use test fixtures and temporary ledgers outside the repository. Production fixtures are prohibited. Conversation memory, summaries, screenshots, and private working state are not assignment authority.
