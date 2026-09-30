# AI workflow dispatch continuity channel

This path is a transport surface for the repository AI entry point when the connected GitHub integration cannot call `workflow_dispatch` directly.

The durable request and receipt live only on the dedicated `ai-dispatch` branch:

- `workflow-dispatch-request.json` — bounded request naming an allowlisted capability ID.
- `workflow-dispatch-receipt.json` — bridge-produced receipt binding the request commit, current `main`, native workflow, resolved inputs, and resulting GitHub Actions run ID.

The governing registry is `.github/ai-router/workflow-dispatch-capability.v1.json`. The bridge creates no generic command or arbitrary workflow authority. Direct connected-GitHub workflow dispatch supersedes this fallback whenever that native tool capability becomes available.
