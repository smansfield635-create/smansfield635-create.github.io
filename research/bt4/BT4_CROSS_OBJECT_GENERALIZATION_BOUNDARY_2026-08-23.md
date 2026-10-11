# BT4 Cross-Object Generalization Boundary — 2026-08-23

## Question

Does the same entitlement law generalize beyond the original public-claim test object, or was the first result a bespoke page behavior?

## Second heterogeneous object

A nonproduction synthetic planetary-runtime release authority was added at:

`/preview/bt4/operational-release-v1/`

This object is operational rather than a scientific claim card. It maps the unchanged shared entitlement states into release semantics:

- `QUALIFIED` -> `RELEASE AUTHORIZED`
- `SUPPORTED` -> `REQUALIFICATION REQUIRED`
- `CANDIDATE` -> `RELEASE CANDIDATE`
- `HELD` -> `RELEASE HELD`
- `CONTRADICTED` -> `RELEASE BLOCKED`

The operational surface imports the exact existing engine:

`../entitlement-v1/entitlement-engine.v1.mjs`

No forked decision logic was introduced.

## Publication

PR #1823 was merged to main as:

`7d4a9d7bc79e371db01e95a95e5b143514a1d69e`

The AI Entry Pages staging rule continues to exclude the global `preview/` tree and admits only the two explicitly bounded BT4 nonproduction surfaces.

## Live browser verification

Verification PR: #1824

Workflow run: `32671204504`

Job: `97272218394`

Result:

`BT4_OPERATIONAL_CROSS_OBJECT_LIVE_VERIFICATION_v1`

`13/13 PASS`

Observed live-domain behavior:

1. Baseline entitlement `QUALIFIED` -> operational label `RELEASE AUTHORIZED`.
2. Artifact/source identity failure -> `HELD` -> `RELEASE HELD`.
3. Attempted `RELEASE AUTHORIZED` override was blocked and served as `RELEASE HELD`.
4. Repair without fresh receipt -> `SUPPORTED` -> `REQUALIFICATION REQUIRED`.
5. Fresh release receipt -> `QUALIFIED` -> `RELEASE AUTHORIZED`.
6. Blocking/adverse evidence -> `CONTRADICTED` -> `RELEASE BLOCKED`.
7. Repair after blocking evidence without fresh receipt -> `SUPPORTED`.
8. Fresh receipt after repair -> `QUALIFIED`.

The verifier recorded 13 checks because it separately asserted underlying entitlement states, translated operational labels, and the override block.

## Binding disposition

`BT4_CROSS_OBJECT_GENERALIZATION = DEMONSTRATED_ON_TWO_HETEROGENEOUS_NONPRODUCTION_OBJECTS`

`BT4_SHARED_ENTITLEMENT_ENGINE_REUSED_UNCHANGED = YES`

`BT4_OPERATIONAL_OVERRIDE_BLOCKING = DEMONSTRATED_ON_LIVE_DOMAIN`

`BT4_STALE_RECOVERY_CEILING = DEMONSTRATED_ON_LIVE_DOMAIN`

`BT4_FRESH_REQUALIFICATION_RECOVERY = DEMONSTRATED_ON_LIVE_DOMAIN`

`BT4_CANONICAL_SITE_WIDE_ENFORCEMENT = NOT_DEMONSTRATED`

`BT4_NOVELTY = NOT_ESTABLISHED`

## Interpretation

The first served-surface result is no longer only a one-off claim-card behavior. The same entitlement kernel has now governed both a public-claim representation and an operational release-authority representation without changing the decision engine. This materially supports the proposition that BT4 is an architecture-level governance capability rather than a page-specific interaction.

The remaining stronger boundary is canonical integration: bind the entitlement law to one bounded real Diamond Gate object without disrupting production authority, then determine whether the same fail-closed behavior survives contact with an actual research/runtime lifecycle rather than synthetic test state.
