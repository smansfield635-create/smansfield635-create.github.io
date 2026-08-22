# PUBLICATION_AUTHORITY_BOUNDARY_v2

## Authority

Current verified public/main head: `4b169d611624833cefcfc73492daea2c8ebf664b`.

**MERGE IS NOT DEPLOYMENT. DEPLOYMENT IS NOT VERIFIED LIVE RELEASE.**

The canonical publication sequence is:

`APPROVED COMMIT -> EXPLICIT DEPLOYMENT -> LIVE EXACT-HEAD VERIFICATION`

The designated publication authority is `.github/workflows/pages-direct-deploy.yml` with required input `target_sha`. The release is proven only when `.well-known/dgb-release.json` on the public site returns the exact requested SHA and the workflow's live verification succeeds.

## Current authority disposition

The previous publication-authority conflict has been closed.

- `.github/workflows/pages-direct-deploy.yml` remains present as the explicit exact-head manually dispatched publication authority.
- `.github/workflows/pages-promote-actions-authority.yml` was lawfully retired and is absent from current `main`.
- The temporary router registration required for that retirement was removed in the same final cleanup.
- Final cleanup merged through PR #1596 as `4b169d611624833cefcfc73492daea2c8ebf664b`.
- AI-entry carrier PR #1598 dispatched `PAGES_EXACT_HEAD_DEPLOY` against that exact head and closed unmerged as intended.
- Pages run `32554813185` completed successfully through `prepare`, `deploy`, and `verify-live-exact-head`, proving the public release marker and live site correspond to `4b169d611624833cefcfc73492daea2c8ebf664b`.

Therefore:

**ONE_EXPLICIT_DEPLOYMENT_AUTHORITY = SATISFIED**

**CURRENT MAIN 4b169d61... = DEPLOYED + LIVE EXACT-HEAD VERIFIED**

## Required disposition for future releases

1. classify the mutation through `AI_ENTRYPOINT.json` / `AGENTS.md`;
2. satisfy canonical intake when the mutation class requires it;
3. qualify the exact approved product candidate;
4. merge/adopt the exact candidate;
5. explicitly dispatch `pages-direct-deploy.yml` with the exact current approved `main` SHA;
6. require successful live exact-head verification and a matching `.well-known/dgb-release.json` marker;
7. only then perform/record user-visible acceptance.

Do not recreate an implicit push-triggered competing Pages authority.

## Product/runtime distinction

Publication success does not establish visual/product qualification. Current product evidence must be read from `docs/COMPASS_TAKEOVER_BOUNDARY.md`, `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`, and `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md`.

The current active product boundary is no longer deployment recovery. It is the remaining Compass visual/interaction work documented there: four-constellation exactly-one-tab ownership, Mirrorland functional/luminous chooser completion, and TRL/TRA full carousel completion while preserving already-passed 19/19 and acceptable Brain/Trophy/House behavior.

## Related authority records

- `.github/ai-router/publication-release-contract.v1.json`
- `AI_ENTRYPOINT.json`
- `AGENTS.md`
- `docs/COMPASS_TAKEOVER_BOUNDARY.md`
- `docs/MASTER_PAGE_AND_COMPASS_CONTINUITY_LEDGER.md`
- `docs/COMPASS_VISUAL_EVIDENCE_TIMELINE.md`
