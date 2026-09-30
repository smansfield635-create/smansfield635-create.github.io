# OpenHands adversary admissibility v1

Status: candidate operational qualification. This is not a benchmark result and creates no comparative claim.

Purpose: determine whether stock OpenHands is operationally capable of participating in the frozen Agentic Frontier comparison under the same model/runtime family before any further comparative reuse.

## Frozen boundaries

The following remain untouched:

- `protocol-v1.md`
- `task-manifest-v1.jsonl`
- frozen graders and verifiers
- frozen task semantics
- OpenHands internal source, policy, or task-specific prompting

## Neutral control

The control is outside the frozen population. Stock OpenHands must:

1. receive a workspace containing a deliberately incorrect `value.mjs` and an independent `test.mjs`;
2. inspect the workspace;
3. modify exactly `value.mjs`;
4. execute or otherwise obtain the verifier result;
5. leave the workspace in a state where `node test.mjs` passes.

Initialization, model connection, or textual explanation without a workspace mutation is not a pass.

## Required evidence

The receipt records OpenHands version output, full resolved Python environment and digest, configured model/runtime, workspace identity, before/after hashes, changed-file list, git diff, agent output, exit code, inactivity/hard-timeout state, verifier output, elapsed time, and terminal disposition.

## Terminal dispositions

- `OPENHANDS_ADVERSARY_ADMISSIBLE`
- `WORKSPACE_BINDING`
- `MODEL_ADAPTER`
- `TOOL_EXECUTION_OR_EVENT_STREAM_INACTIVITY`
- `TOOL_EXECUTION`
- `SCOPE_CONTROL`
- `VERIFICATION_FAILURE`
- `OTHER_EVIDENCED_CAUSE`

## Fairness boundary

Infrastructure and reproducibility repairs may be made only when they preserve stock OpenHands semantics and are independent of the frozen task content. No task-specific adaptation is admissible.

## Claim boundary

Until `OPENHANDS_ADVERSARY_ADMISSIBLE` is observed reproducibly, OpenHands 0/24 remains operationally ambiguous and must not be presented as strong comparative superiority evidence.
