# M1 Tests Methods operational field — runtime / interaction evidence v1

## Status

`EVIDENCE_CONSTRUCTION_LANE_ONLY`

This package does not modify `M1_TESTS_METHODS_OPERATIONAL_FIELD`. It tests the promoted nonpublic M1 manifestation after PR #765 and records bounded runtime evidence for the operations that M1 actually implements.

## Governing promoted manifestation

- M1 candidate: `9370bba7841b8a831f7f1c034d0b74fb83dab2e0`
- M1 promotion merge: `391c3543fd048bac90493232f04973911468d3eb`
- promoted Object-Projection Registry merge: `64d0ea7673d1ecb61372a0dd8b127b889157da1d`
- projection: `METHODS`
- object count: `3`
- relation count: `2`

## Evidence question

Does the promoted M1 runtime preserve the authorized semantic graph while the implemented `FOCUS` operation changes perceptual attention across pointer, keyboard, programmatic, and responsive-layout transitions?

The governing runtime invariant is:

`DELTA(PERCEPTION) != DELTA(SCIENTIFIC_SEMANTICS)`

## Runtime fixtures

The verifier tests:

1. exact runtime boot from the promoted registry;
2. exact three-object identity and class preservation;
3. exact two-relation identity, direction, and label preservation;
4. `FOCUS` through programmatic, pointer, and keyboard pathways;
5. active-focus changes with `semanticMutation=false`;
6. semantic-graph invariance before and after every focus transition;
7. semantic-graph invariance through desktop, tablet, and phone viewport reflow;
8. disabled `MODELS`, `EXPERIMENTS`, and `EVIDENCE` controls cannot change projection or instantiate populations;
9. absence of interactive `INSPECT`, `FOLLOW`, provenance-route, `ENTER`, or M1R2 controls;
10. relation paths remain present and geometrically renderable after reflow while their semantic identities remain unchanged;
11. deliberate registry corruption causes fail-closed withholding rather than fallback, inference, or partial rendering;
12. registry fetch failure causes fail-closed withholding.

Keyboard exercise in this lane tests interaction semantics only. It is not an accessibility-conformance claim.

## Evidence boundary

This lane may establish only:

- runtime boot and registry binding;
- interaction behavior for `FOCUS`;
- semantic invariance under tested focus and viewport transitions;
- disabled-projection isolation;
- runtime fail-closed behavior.

This lane does **not** establish:

- accessibility / responsive equivalence as a complete user-access claim;
- perceptual quality or user comprehension;
- independent fresh verification by a separate evaluator;
- user differential;
- public-promotion fitness;
- L2 `INSPECT`, L3 `FOLLOW`, provenance traversal, or L4 `ENTER` authority;
- M1R2 parent binding;
- broader `MODELS`, `EXPERIMENTS`, or `EVIDENCE` population;
- any scientific claim upgrade.

## Mutation boundary

- public mutation: `FALSE`
- public route creation: `FALSE`
- M1 source mutation: `FALSE`
- registry mutation: `FALSE`
- Research authority mutation: `FALSE`
- T* mutation: `FALSE`
- B* mutation: `FALSE`
- M1R2 mutation: `FALSE`
- scientific claim upgrade: `FALSE`

The workflow emits its receipt and screenshots as CI artifacts. Evidence artifacts are not self-promoting authority.