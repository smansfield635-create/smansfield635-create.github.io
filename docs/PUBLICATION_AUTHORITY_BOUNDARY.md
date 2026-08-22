# PUBLICATION_AUTHORITY_BOUNDARY_v1

## Authority

Current product source head: `78ff88bf69bced653625e458b830d007bb8ce967` (Gen1587).

**MERGE IS NOT DEPLOYMENT. DEPLOYMENT IS NOT VERIFIED LIVE RELEASE.**

The canonical publication sequence is:

`APPROVED COMMIT -> EXPLICIT DEPLOYMENT -> LIVE EXACT-HEAD VERIFICATION`

The designated publication authority is `.github/workflows/pages-direct-deploy.yml` with required input `target_sha`. The release is proven only when `.well-known/dgb-release.json` on the public site returns the exact requested SHA and the workflow's live verification succeeds.

## Current authority conflict

Two Pages deployment authorities currently coexist:

1. `.github/workflows/pages-direct-deploy.yml` — explicit, exact-head, manually dispatched successor; requires `target_sha`, verifies requested SHA equals current `main`, stamps the release marker, deploys the bounded artifact, and verifies the public marker.
2. `.github/workflows/pages-promote-actions-authority.yml` — older predecessor that still triggers automatically on every push to `main` and also calls `actions/deploy-pages`.

This violates the active publication contract's `ONE_EXPLICIT_DEPLOYMENT_AUTHORITY` and `legacyImplicitPagesTriggerAllowed: false` rules. Until reconciled, publication authority is structurally ambiguous even when product source is correct.

## Required disposition

- Treat `pages-direct-deploy.yml(target_sha=<exact current approved main>)` as the canonical successor release path.
- Do not infer that a merge or push-triggered Pages run published the approved release.
- Do not call Gen1587 live until the public release marker returns exactly `78ff88bf69bced653625e458b830d007bb8ce967` through the explicit exact-head deployment path.
- Do not delete, disable, or mutate the conflicting predecessor workflow without applicable `RUNTIME_OR_AUTHORITY` governance and an `ADMITTED_AND_LOCKED` receipt (or valid successor lifecycle receipt) for that control-plane scope.
- Documentation of this conflict creates no deployment, workflow-mutation, governance, or production authority.

## Product/runtime distinction

Current evidence indicates legacy Compass presentation/runtime owners are retired or replaced rather than simultaneously authoritative. However, presentation styling remains layered across base CSS, presentation-convergence overrides, and Gen1587 capability bounds. Treat that as technical debt, not proof of multiple runtime owners. Do not add another presentation override generation merely to address publication recovery.

## Release acceptance

For any subsequent release:

1. classify the mutation through `AI_ENTRYPOINT.json` / `AGENTS.md`;
2. satisfy canonical intake only when the mutation class requires it;
3. qualify the exact approved product candidate;
4. merge/adopt the exact candidate;
5. explicitly dispatch `pages-direct-deploy.yml` with the exact current approved `main` SHA;
6. require `LIVE_EXACT_HEAD_VERIFIED` and a matching `.well-known/dgb-release.json` marker;
7. only then perform/record user-visible acceptance.

Publication success must never be substituted for visual/product qualification, and visual qualification must never be substituted for exact-head publication proof.

## Related authority records

- `.github/ai-router/publication-release-contract.v1.json`
- `AI_ENTRYPOINT.json`
- `AGENTS.md`
- `docs/COMPASS_TAKEOVER_BOUNDARY.md`
- `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md`
- `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`
