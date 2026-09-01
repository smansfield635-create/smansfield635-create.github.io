# PUBLICATION_AUTHORITY_BOUNDARY_v3

## Authority

**MERGE IS NOT VISUAL ACCEPTANCE. PUBLICATION IS NOT BEHAVIORAL ACCEPTANCE.**

The default publication sequence for accepted public-page changes is now:

`APPROVED CANDIDATE -> MERGE TO MAIN -> AUTOMATIC EXACT-HEAD RELEASE -> PUBLIC EXACT-SHA VERIFICATION -> LIVE BEHAVIORAL VERIFICATION`

PR #1621 restored automatic exact-head publication after accepted pushes to `main` without changing Compass product paths. The release path checks out the exact pushed SHA, stages the bounded Pages payload, stamps `.well-known/dgb-release.json`, deploys, and verifies that the public marker equals the target SHA.

The fallback AI-entry exact-head dispatch capability remains available for release recovery. It must target exact approved/current `main` and must end in the same public exact-SHA verification. Manual owner deployment is not the normal page-change process.

## Operational rule for future releases

For ordinary accepted page changes:

1. classify the change through the AI entry point;
2. identify the exact live state/layout/runtime authority before mutation;
3. satisfy governance only when the mutation class requires it;
4. make the smallest authoritative product change;
5. qualify source sanity and exact candidate scope;
6. merge/adopt the exact candidate to `main`;
7. allow the automatic exact-head release to publish the new `main` SHA;
8. require `.well-known/dgb-release.json` to equal that exact SHA;
9. then verify the intended live behavior on the real page;
10. only after live behavior passes may the room report the page change complete.

Do not create a separate deployment carrier, dummy release commit, release-branch nudge, or manual-owner deployment step for an ordinary accepted page change.

## Evidence separation

Every cycle must keep these facts separate:

- source change exists;
- source is wired to the actual authority;
- source sanity passes;
- exact candidate merged;
- exact SHA published;
- intended live behavior passes.

A successful publication proves only that the intended repository generation is being served. It does not prove that a state handler listens to the right signal, that a selector targets the right element, or that the user-visible behavior changed.

Conversely, if exact-SHA publication is proven and the intended behavior remains unchanged, do not keep blaming cache/CDN/device state. Move immediately to live product-authority tracing unless new evidence reopens publication ambiguity.

## 2026-08-22 Compass precedent

The Compass release-settlement/tablet cycle is the controlling example.

The product bytes were merged, the root capability loader identity was advanced, and exact-head publication was proven. Yet both intended visible changes remained absent.

Post-publication audit found two product wiring errors:

- the release-settlement bridge watched `data-orbit-gesture-active` on the root even though the controller did not publish the authoritative gesture-active state through that DOM attribute;
- the tablet correction centered already-centered outer containers rather than identifying the exact rendered child creating the left bias.

Therefore the correct diagnosis was:

`PUBLICATION PASS + PRODUCT AUTHORITY/WIRING FAIL`

This distinction is mandatory for future page work.

## Governing cross-page execution record

All rooms changing public pages must use:

`docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`

That protocol defines the live-authority-first rule, direct-authority repair rule, layout targeting evidence, publication/cache branching, acceptance ladder, room handoff requirements, and completion definition.

## Related records

- `AI_ENTRYPOINT.json`
- `.github/ai-router/publication-release-contract.v1.json`
- `.github/workflows/ai-entry-auto-release.yml`
- `.github/workflows/pages-direct-deploy.yml`
- `docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`
- `docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md`
- `docs/COMPASS_TAKEOVER_BOUNDARY.md`
- `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`

## Completion law

For public page work:

`AUTHORITATIVE CHANGE + EXACT PUBLICATION + LIVE BEHAVIORAL PROOF = COMPLETE`

Anything less is an intermediate state and must be reported as such.