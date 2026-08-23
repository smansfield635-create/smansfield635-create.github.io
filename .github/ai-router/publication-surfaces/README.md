# Universal public-surface verification

Every public route, page, file bundle, or runtime environment published by this repository uses the same deployment authority: `.github/workflows/pages-direct-deploy.yml`.

A public surface is registered by adding one declarative manifest named `.github/ai-router/publication-surfaces/<surface_id>.json` conforming to `schema.v1.json`. No surface-specific deployment workflow is allowed or required.

Each release supplies two explicit inputs: the exact approved current-main `target_sha` and a `surface_id`. The deployer publishes that exact commit, stamps `.well-known/dgb-release.json` with the commit, surface id, manifest path, and manifest digest, then verifies every declared public byte check. If the manifest declares runtime verification, the same workflow launches the public route and waits for the declared readiness contract.

A release is complete only when the workflow emits `LIVE_EXACT_HEAD_VERIFIED`. Merge, Pages deployment completion, visual appearance, cache churn, release-branch nudges, dummy commits, and project-specific push workflows are not release proof.

To add a future public surface, add or update only its manifest and the approved product bytes. Do not modify the deployment workflow unless the universal publication protocol itself changes.
