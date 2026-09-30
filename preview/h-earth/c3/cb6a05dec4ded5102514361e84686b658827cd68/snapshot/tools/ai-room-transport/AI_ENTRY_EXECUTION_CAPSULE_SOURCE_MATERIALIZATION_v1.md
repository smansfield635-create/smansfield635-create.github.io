# AI_ENTRY_EXECUTION_CAPSULE_SOURCE_MATERIALIZATION_v1

Status: OPERATIONAL ORCHESTRATION CONTRACT — SOURCE REGISTRATION REQUIRED

The AI entry operation `MATERIALIZE_REGISTERED_EXECUTION_CAPSULE_SOURCE(source_id)` is split across the capabilities that own each edge:

1. Resolve `source_id` from `tools/ai-room-transport/ai-execution-capsule-source-registry.v1.json`.
2. Refuse unregistered sources. The empty registry therefore yields `UNREGISTERED_EXECUTION_CAPSULE_SOURCE_FAIL_CLOSED` until an exact capsule has been constructed, uploaded, and registered.
3. AI connector layer invokes only the registered provider raw fetch in streamed-file mode.
4. AI runtime consumes the connector file reference and establishes a local workspace path.
5. Apply `tools/ai-room-transport/ai-execution-capsule-source-materialization.v1.md` and validate the receipt against `tools/ai-room-transport/ai-execution-capsule-source-materialization-receipt.schema.v1.json`.
6. Only `PASS_CLOSED` with every required predicate true may classify the capsule as materialized and execution-ready.
7. Execute only the registry-declared fixed command. The materialization operation itself does not consume any project Hook.

For Audralia Gen1754, capsule construction and registration are a succession-infrastructure track separate from the live Hook 3 execution. They must not delay, consume, terminally disposition, or reveal a later Hook.

No user-side upload, terminal command, package installation, Codespace administration, or infrastructure management is part of this procedure; agents own source construction, provider upload, registration, retrieval, and qualification.
