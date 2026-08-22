# Repository Live Qualification Engine

Status: design draft only; this branch is not the implementation authority for this engine.

The intended repository-wide contract is that the instrumentation itself is the receipt. A room, operator, or project-specific workflow may request qualification, but may not manufacture or restate PASS independently.

Required state chain:

SOURCE_IDENTITY -> CANDIDATE_QUALIFICATION -> ASSET_IDENTITY -> MERGE_IDENTITY -> PUBLICATION -> PUBLIC_BYTES -> LIVE_RUNTIME -> PASS_CLOSED

A terminal PASS_CLOSED receipt is valid only when every project-required state is PASS and each state carries exact evidence bound to one SHA.

The generalized engine must be manifest-driven. Each project supplies only project-specific declarations: public route, allowed changed paths, staging adapter if nonstandard, public byte assertions, viewport/runtime verifier adapter, and any required interaction assertions. The reusable engine owns exact-main binding, checkout, publication, release-marker verification, source/public hashing, runtime invocation, receipt assembly, receipt digest, and artifact retention.

The receipt must include at minimum: schema version, project id, manifest digest, requested SHA, observed main SHA, candidate/merge SHA when applicable, public release-marker SHA, every source/public byte digest pair, runtime assertion results, workflow/run/job identity, timestamps, terminal disposition, and receipt SHA-256.

No room may treat merge success, workflow success, deployment success, cache clearing, or a release marker by itself as live acceptance. The receipt is the acceptance object.

Project-specific workflows should eventually become thin wrappers around the reusable engine rather than independent publication/verification implementations.
