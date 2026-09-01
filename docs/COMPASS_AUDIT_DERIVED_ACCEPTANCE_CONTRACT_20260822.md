# Compass audit-derived acceptance contract — 2026-08-22

## Governing rule

This contract converts the completed Compass/Laws audit into executable acceptance criteria. It exists to prevent architectural analysis from being replaced by easier proxy tests during implementation.

The governing chain is:

`AUDIT -> EXPLICIT CRITERIA -> IMPLEMENTATION -> MACHINE QUALIFICATION -> LIVE RECEIPT`

A room may not substitute a different criterion because it is easier to measure.

## Audit authority

Primary sources:

1. `docs/COMPASS_LAWS_PRECEDENT_AND_STATE_TRANSITION_AUDIT_20260822.md`
2. `docs/COMPASS_RELEASE_SETTLEMENT_AND_TABLET_CONTEXT_CYCLE_20260822.md`
3. `docs/COMPASS_TAKEOVER_BOUNDARY.md`
4. `docs/PAGE_CHANGE_EXECUTION_AND_LIVE_VERIFICATION_PROTOCOL.md`

Current-state source conclusions must still be resolved from an exact pinned `main` SHA.

## Correction to the prior cycle

PR #1659 and its later live verification proved public byte identity and several controller/DOM facts, but the acceptance translation was incomplete.

Two proxy substitutions are formally rejected:

- `scene container center error == 0` is not proof that the audited top contextual composition was corrected;
- `data-primary changed and one label became visible` is not proof that the selected Compass object physically settled into canonical foreground/resting geometry.

The prior `PASS_CLOSED` is therefore valid only for publication/byte identity and the narrow state assertions it actually tested. It is not the perceptual acceptance receipt for the audited repair.

## Criterion A — tablet contextual alignment

The audit identified the top Compass contextual presentation as the layout target and explicitly prohibited moving the interactive constellation stage as a substitute.

At the 900 x 1000 tablet qualification viewport:

- the contextual heading immediately above the interactive Compass (`.compass-orbit-intro h2`) must be visually centered relative to the viewport centerline;
- its explanatory guidance line must be visually centered to the same reference;
- text geometry is measured from rendered text-line rectangles, not merely the width of a full-width ancestor;
- each contextual text center must be within 12 px of the viewport centerline;
- the interactive scene must retain the audited pre-correction tablet column placement, center error `-160 px +/- 18 px`, unless a later owner-approved audit explicitly changes that requirement.

A candidate that centers the scene while leaving contextual text materially unchanged fails this criterion.

## Criterion B — canonical visual settlement

The Laws precedent is `preview -> canonical settlement -> semantic ownership`.

For the main Compass, a committed direction must not merely change a controller field. The newly selected cardinal must visibly occupy the same canonical foreground/resting anchor previously occupied by the outgoing settled cardinal.

The runtime verifier must therefore:

1. capture the initial settled primary cardinal's rendered center as the canonical foreground anchor;
2. perform real touch/pointer drag/release gestures;
3. require committed focus to change;
4. require the incoming primary cardinal's rendered center to settle within 20 px of that canonical anchor;
5. require the outgoing cardinal to depart at least 28 px from the anchor;
6. sample the committed state twice after release and require <= 6 px positional drift;
7. demonstrate at least three distinct committed transitions in the controlled cycle.

A state-field change with no corresponding foreground-geometry change fails.

## Criterion C — one settled readable label

All four cardinal star owners remain present in `CONSTELLATION`.

After every committed transition:

- exactly one cardinal is controller-primary;
- exactly one cardinal label is visibly readable;
- the readable label belongs to the committed primary cardinal;
- preview is not accepted as semantic settlement;
- no second label or stale outgoing label may remain visible after settlement.

## Criterion D — four-star presence

The runtime must expose all four cardinal semantic star owners with non-zero rendered bounds. Hiding three owners to obtain one label is prohibited by the Laws precedent.

## Criterion E — release stability

The committed visual position must remain stable after release. A transient pass at the moment of commitment followed by spring-back, old-state restoration, or continuing drift is a failure.

## Criterion F — publication identity

Behavioral qualification is evaluated only after the repository live-qualification engine proves:

- exact current-main SHA;
- public release marker equality;
- public byte equality for the root and decision-critical Compass runtimes;
- runtime verifier completion.

Publication identity is necessary but never sufficient for perceptual acceptance.

## Machine authority

The executable contract is:

- manifest: `.github/live-qualification/manifests/compass-root.v1.json`
- runtime verifier: `.github/live-qualification/verifiers/compass-root.v1.mjs`
- shared engine: `.github/workflows/repository-live-qualification-engine.yml`

The terminal `DGB_LIVE_QUALIFICATION_RECEIPT_v1` is the authoritative qualification disposition. A room may explain the receipt but may not override it with a narrative PASS.

## Pre-repair requirement

Before another Compass product mutation is accepted, this verifier should be demonstrated to reject the currently owner-reported failing live presentation. This proves that the instrument distinguishes the actual defect rather than merely reproducing the previous proxy test.

## Completion law

`AUDIT CRITERIA SATISFIED + EXACT PUBLIC BYTES + LIVE RUNTIME PASS = REPAIR COMPLETE`

Anything less remains open.
