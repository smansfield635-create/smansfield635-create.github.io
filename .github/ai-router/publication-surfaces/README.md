# Universal public-surface verification

Every registered public route, page, file bundle, or runtime environment published by this repository uses the exact-head Pages publication authority in `.github/workflows/pages-exact-head-deploy-v3.yml`.

A public surface is registered by adding one declarative manifest named `.github/ai-router/publication-surfaces/<surface_id>.json` conforming to `schema.v1.json`. No surface-specific deployment workflow is allowed or required.

Each release supplies two explicit inputs: the exact approved current-main `target_sha` and a `surface_id`. The deployer publishes that exact commit, stamps `.well-known/dgb-release.json` with the commit, surface id, manifest path, and manifest digest, then verifies every declared public byte check. If the manifest declares runtime verification, the same workflow launches the public route and waits for the declared readiness contract.

Runtime verification is topology-aware. A direct-document surface must bind the browser's final top-level pathname to the declared runtime path. An iframe-backed surface must declare `runtime.binding.mode: "iframe"` and its frame selector, and the verifier binds that frame's resolved `src` pathname to the declared path. Do not infer iframe topology from a missing or empty `src` on a direct-document surface.

Runtime diagnostics preserve page errors, console errors, explicitly ignored console errors, actionable console errors, binding evidence, and failure classes in the receipt. `ignoreConsoleErrorIncludes` is surface-local and must only identify known non-authoritative browser/runtime noise; ignored entries remain visible in the receipt. Page errors remain fail-closed unless a manifest explicitly states otherwise.

A release is complete only when the exact-head deploy and its static/runtime verification pass. Merge, Pages deployment completion, visual appearance, cache churn, release-branch nudges, dummy commits, and project-specific push workflows are not release proof.

To add a future public surface, add or update only its manifest and the approved product bytes. Do not modify the deployment workflow unless the universal publication protocol itself changes.
