# Execution continuity

This directory records repository-wide execution-surface continuity requirements for AI rooms.

Current governing incident and repair record:

- `2026-08-27-room-execution-deadlock.md`

Machine-readable gate:

- `.github/ai-router/execution-capability-gate.v1.json`

The gate is fail-closed. Executable construction, verification, or reproduction work must not be assigned until a current `REPOSITORY_EXECUTION_CAPABILITY_RECEIPT_v1` proves `REPOSITORY_MATERIALIZED`, `DEPENDENCIES_READY`, and `COMMAND_EXECUTION_AVAILABLE` on a non-Actions native substrate.
