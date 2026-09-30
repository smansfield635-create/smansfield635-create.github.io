# Auren Visible Relationship Presentation — Owner-Intent Reconciliation Contract

Status: **FROZEN / PRESENTATION_SUCCESSOR_AUTHORIZED / NOT_YET_IMPLEMENTED**
Date: 2026-09-29

## Finding

Earlier owner intent explicitly accepted a visible trust/relationship meter as part of the Auren relationship experience.

The later C3.2 contract deliberately narrowed first implementation to an internal qualitative relationship substrate and stated that no visible meter was authorized. That was a staged implementation boundary, not recovered canon and not evidence that the owner abandoned visible relationship presentation.

The qualified relationship substrate now exists and has survived integrated regression. A successor presentation may therefore expose that existing state without replacing or duplicating the relationship engine.

## Controlling substrate

Existing relationship phases remain authoritative:

- PUBLIC
- ENGAGED
- GUARDED

Existing authored relationship events and deterministic transitions remain authoritative.

This presentation contract does not introduce:
- numeric trust;
- arbitrary gain/loss weights;
- a second relationship engine;
- inferred motives from generic navigation;
- product scoring;
- cross-session persistence;
- new scene-admission authority.

## Presentation scope

The visible relationship indicator belongs to **Learn About Auren**, the relationship/game path.

Products remains public utility:
- product questions do not automatically alter relationship state;
- product facts are not trust-paywalled;
- ordinary product navigation remains available regardless of relationship phase.

The indicator may remain visually present while navigating the chamber only if its presentation clearly distinguishes relationship state from product access. It must never imply that buying, browsing or selecting products earns trust.

## Visible model

The presentation reflects the existing qualitative state directly.

Required visible semantics:

- PUBLIC — initial/public distance
- ENGAGED — active relationship engagement
- GUARDED — Auren has become more protective/distant because of an authored relationship-bearing interaction

The UI may use a compact meter/track/indicator treatment, but it must not display a fabricated numeric score or percentage.

The visitor should be able to perceive that relationship state changed without needing developer tools or hidden receipts.

## Behavior law

Only already-authorized relationship events may move the indicator.

Generic Back, Products, route navigation, reload, elapsed time and ordinary product interactions remain neutral unless an exact authored relationship-bearing choice says otherwise.

The indicator updates from the same authoritative relationship-state receipt consumed by C3.4/C4/C5. It does not maintain independent state.

## Session boundary

Current session-only relationship behavior remains unchanged.

Reload/new session returns to the currently qualified relationship initialization behavior.

Cross-session persistence is not authorized by this presentation stage.

## Visual integration

The indicator must be subordinate to the conversation, not a dashboard that overwhelms Auren's chamber.

It must:
- be legible on mobile;
- not obscure Auren, the thread or choices;
- not increase contextual conversation choices;
- preserve the existing room geometry and conversation cadence;
- visibly distinguish PUBLIC / ENGAGED / GUARDED;
- update deterministically when relationship phase changes.

Exact styling is implementation detail subject to the existing Auren chamber presentation language.

## Authorized mutation scope

Expected:
- Auren chamber presentation/runtime binding required to render authoritative relationship state;
- Auren chamber CSS/HTML only to the minimum extent needed for the indicator;
- dedicated presentation verifier/workflow;
- integrated verifier updates needed to prove the visible state.

Relationship transition logic itself is not reopened.

C3.3 archetype logic is not reopened.

C3.4 state-dependent dialogue selection is not reopened.

C4/C5 world/custody/privacy/continuity logic is not reopened.

## Qualification

Browser qualification must prove:

1. initial visible indicator = PUBLIC;
2. entering Learn About Auren through the existing authored ENGAGE event visibly produces ENGAGED;
3. an existing authored PRY/boundary path visibly produces GUARDED;
4. an existing RESPECT_BOUNDARY recovery visibly returns to ENGAGED where the relationship contract already requires it;
5. generic Back does not independently change relationship state;
6. Products traversal does not change relationship state;
7. visible indicator always matches `AUREN_RELATIONSHIP_STATE().phase`;
8. no numeric/percentage trust score is fabricated;
9. no localStorage/sessionStorage/cookie persistence is introduced;
10. timing/typing/delayed choices and <=3 choice law remain intact;
11. no browser errors;
12. integrated C3.2-C5 behavior remains green.

## Terminal law

**VISIBLE RELATIONSHIP PRESENTATION = SUCCESSOR LAYER OVER EXISTING QUALIFIED STATE.**

**ONE RELATIONSHIP ENGINE. NO NUMERIC INVENTION.**

**PRODUCTS REMAIN PUBLIC/UNSCORED.**

**NEXT = BOUNDED PRESENTATION IMPLEMENTATION.**
