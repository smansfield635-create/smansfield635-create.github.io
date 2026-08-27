# Implementation boundary

This branch establishes the policy, schema, precedence, and current Audralia capability state needed to stop rooms from being assigned executable work without a machine.

It does not itself provision a Codespace, disposable builder, or other native executor. Therefore merging this control-plane repair must not be interpreted as `EXECUTION_CAPABILITY_READY` for Audralia or any other operation.

The first operation that wants to reveal an executable hook after adoption must produce a fresh receipt conforming to `.github/ai-router/execution-capability-receipt.schema.v1.json` and must prove all three capability checks on the actual room substrate.
