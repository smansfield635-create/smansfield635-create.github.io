# Auren C3.4 — State-Dependent Auren Contract

Status: **FROZEN / IMPLEMENTATION_NOT_YET_AUTHORIZED_BY_THIS RECORD**
Date: 2026-09-29

Accepted C3.3 baseline: `5ff47514485c36e3b9edbbac0695f5449df91584`

Controlling records:
- `project-records/auren-c3-step1-canon-audit-2026-09-29.md`
- `project-records/auren-c3-four-audit-crosswalk-resolidified-plan-2026-09-29.md`
- `project-records/auren-c3-2-relationship-state-foundation-contract-2026-09-29.md`
- `project-records/auren-c3-3-visitor-archetype-evidence-contract-2026-09-29.md`

## 1. Purpose

C3.4 makes the already-qualified C3.2 relationship state and C3.3 visitor-evidence state materially affect Auren's authored Learn About Auren conversation.

This stage does not create new knowledge authority. It selects among pre-authored, canon-bounded Auren variants.

The objective is differentiated conversation, not automated personality diagnosis.

## 2. Inputs

C3.4 may consume only:

### Relationship input
- PUBLIC
- ENGAGED
- GUARDED
- explicit recent C3.2 authored relationship events where needed

### Visitor-evidence input
- full four-archetype vector
- provisional primary/support
- disposition
- confidence
- claimed pattern only as separate claim evidence

C3.4 SHALL NOT consume hidden personal data, browser history, external identity data, product history, click speed, inferred demographics, or uncontracted signals.

## 3. Outputs C3.4 may vary

Within Learn About Auren only, C3.4 may select authored variants for:

- tone;
- public-mask intensity;
- question framing;
- concise explanatory emphasis;
- voluntary personal perspective;
- willingness to continue a personal topic;
- which lawful authored follow-up is offered.

C3.4 may not generate arbitrary facts at runtime.

## 4. Canonical mask bands

C3.4 defines three presentation bands aligned to qualified relationship phases.

### PUBLIC -> PUBLIC_MASK
Auren remains sharp, self-assured, somewhat impatient, polished and guarded.

This is the public/low-trust rich-kid layer subordinate to the full Sanctuary Builder canon.

### ENGAGED -> OPEN_MASK
Auren may become more candid about responsibility, custody, difficult decisions, overprotection, inherited obligation and the burden beneath the polished-host performance.

He remains 13-year-old Auren. Openness must not turn him into a generic adult counselor.

### GUARDED -> PROTECTIVE_MASK
Auren becomes more selective and boundary-conscious.

He may acknowledge that a topic exists while refusing to elaborate beyond his authority.

GUARDED must not become hostility, punishment, humiliation, manipulation or product denial.

## 5. Relationship state has precedence over visitor framing

Relationship state controls mask/disclosure eligibility.

Visitor archetype evidence may influence framing only inside what the current mask permits.

Examples:

- a Strategist-leaning framing may emphasize order, sequence or governing decisions;
- Builder may emphasize what is built, changed or made workable;
- Mitigator may emphasize protection, continuity and harm reduction;
- Auditor may emphasize evidence, contradiction and why Auren does not accept a claim at face value.

These are framing emphases, not labels spoken to the visitor.

If relationship phase is GUARDED, archetype framing cannot force deeper disclosure.

## 6. Evidence threshold for archetype framing

C3.4 may use archetype-specific framing only when C3.3 state is:

- disposition = LEADING; and
- confidence = MODERATE or HIGH; and
- provisionalPrimary is non-null.

INSUFFICIENT, MIXED, LOW-confidence or tied evidence MUST use neutral framing.

Claimed archetype alone never activates archetype framing.

## 7. No archetype disclosure

Auren SHALL NOT say or imply:

- "You're a Strategist."
- "I figured out you're a Builder."
- "Your type is Auditor."
- any equivalent fixed identity statement.

C3.4 adapts framing silently.

The underlying evidence state remains inspectable for qualification but need not be publicly surfaced.

## 8. Authored variant architecture

C3.4 should extend the voice authority with explicit variant banks.

A state-dependent node may provide:

- `public`
- `engaged`
- `guarded`

and optionally framing variants:

- `neutral`
- `Strategist`
- `Builder`
- `Mitigator`
- `Auditor`

Selection must be deterministic from qualified state.

Fallback order:

1. exact relationship mask + eligible archetype framing;
2. relationship mask + neutral framing;
3. existing baseline node response.

Missing variant data must fail safely to the baseline response, not produce an error or fabricate content.

## 9. Initial bounded content targets

C3.4 SHALL NOT rewrite the entire conversation tree at once.

The first implementation targets the existing Learn About Auren subjects where recovered canon is strongest:

- About Auren / what his role means;
- what he actually does;
- Mirrorland;
- who else is here / disclosure boundary;
- his room / sanctuary function.

Products are excluded.

The Book/Elara handoff is excluded.

Scene offers are excluded.

## 10. Canon/disclosure boundary

Allowed deeper Auren material must be sourced from recovered Step-1 canon, including:

- inherited wealth as obligation rather than passive luxury;
- estate as distance, cover, custody and rescue;
- owner-to-custodian responsibility;
- hidden-resident responsibility without exposing protected identities;
- polished host/public performance;
- exhausted sanctuary builder beneath it;
- protective deception/public misdirection;
- overprotection as weakness;
- exposure versus protection;
- admission/trust/security decisions;
- inherited obligations and consequences.

C3.4 must not invent:

- names/identities of protected residents not already public-authorized;
- unsupported chronology;
- private facts belonging to another character;
- secret lineage details beyond recovered authority;
- new Mirrorland discoveries;
- scene outcomes;
- product claims.

## 11. Products remain invariant

Products mode remains public utility.

Relationship phase and visitor evidence MUST NOT:

- change product factual content;
- hide product choices;
- change product availability;
- change routes;
- change Book -> Elara;
- alter product evidence claims;
- score product traversal.

Auren's public personality remains present in Products, but C3.4 adaptation is confined to Learn About Auren.

## 12. Questions and follow-ups

C3.4 may vary lawful follow-up selection to fit state.

Rules:

- <=3 contextual choices remains absolute;
- every offered choice must map to an authored node;
- no generated free-text question engine;
- no choice may expose its hidden scoring/archetype purpose;
- ordinary Back/navigation remains neutral unless already explicitly authored under C3.2;
- state-dependent choice selection must not strand the visitor without a lawful continuation.

## 13. Deterministic selection receipt

The C3.4 selector must expose an inspectable receipt containing:

- contract;
- sourceNode;
- relationshipPhase;
- maskBand;
- archetypeDisposition;
- archetypeConfidence;
- eligibleFraming;
- selectedFraming;
- selectedVariant;
- fallbackUsed;
- reason.

This receipt is instrumentation, not necessarily public UI.

Unknown/malformed state fails to baseline/neutral authored content.

## 14. No persistence expansion

C3.4 uses current in-memory C3.2/C3.3 state only.

It does not add:

- localStorage;
- sessionStorage relationship/archetype persistence;
- cookies;
- account memory;
- cloud memory;
- cross-character memory.

C3.5 remains the optional persistence stage.

## 15. No scene authority

C3.4 may discuss Mirrorland within Auren's knowledge authority.

It may not:

- unlock a scene;
- offer a gated scene based on relationship;
- admit the visitor into a world scene;
- mutate world state.

C3.6 owns the scene-offer bridge.

## 16. Preferred implementation surface

Preferred new selector:

- `products/auren/auren.state-dependent.js`

Minimal composition changes:

- `products/auren/auren.voice.js` — authored variant banks / variant lookup authority;
- `products/auren/auren.chamber.js` — obtain current C3.2/C3.3 state and request selected authored response/options;
- `products/auren/index.html` — module-loading plumbing only.

C3.2 and C3.3 state modules should remain unchanged absent proven integration defects.

No CSS/room redesign is authorized.

## 17. Qualification requirements

Exact-head browser qualification against accepted C3.3 baseline `5ff47514485c36e3b9edbbac0695f5449df91584` must prove:

1. C3.2 and C3.3 state invariants remain intact;
2. PUBLIC selects PUBLIC_MASK;
3. ENGAGED selects OPEN_MASK;
4. GUARDED selects PROTECTIVE_MASK;
5. INSUFFICIENT/MIXED/LOW evidence selects neutral framing;
6. LEADING + MODERATE/HIGH + non-null primary permits matching framing;
7. claimed archetype alone does not activate framing;
8. relationship phase takes precedence over archetype framing;
9. guarded state cannot be bypassed by strong archetype evidence;
10. missing/malformed variant falls back safely;
11. selected responses are authored and canon-bounded;
12. no archetype identity label is emitted;
13. Products content/routes remain invariant across relationship/archetype states;
14. <=3 choices remains true;
15. C2 timing/typing/delayed-choice behavior remains true;
16. C3.2 relationship transitions remain true;
17. C3.3 evidence/revision behavior remains true;
18. no persistence is introduced;
19. no scene/world state is mutated;
20. no page errors occur.

## 18. Explicit non-goals

C3.4 does NOT authorize:

- persistence;
- visible trust/archetype meters;
- free-text generative dialogue;
- psychological diagnosis;
- product personalization/gating;
- scene offers/admission;
- world-state mutation;
- other-character mutation;
- broad room/UI redesign;
- C3.5/C3.6 behavior.

## 19. Success condition

C3.4 succeeds when the same canonical Auren can lawfully present differently according to qualified relationship state and sufficiently strong visitor evidence while:

- remaining authored;
- remaining canon-bound;
- never labeling the visitor;
- preserving Products;
- respecting disclosure boundaries;
- preserving all prior qualified state machinery.

## 20. Next operation after freeze

After this architecture-only contract is merged:

1. implement bounded selector + authored variants;
2. add exact-head verifier/workflow;
3. register transport separately;
4. qualify against `5ff47514485c36e3b9edbbac0695f5449df91584`;
5. repair only proven defects;
6. adopt only after green exact-head evidence.

After C3.4 adoption, decide whether to execute optional C3.5 persistence or explicitly omit it before C3.6.

## Terminal law

**RELATIONSHIP CONTROLS MASK.**

**QUALIFIED VISITOR EVIDENCE MAY CONTROL FRAMING.**

**CLAIM ALONE DOES NOT.**

**ALL OUTPUT REMAINS AUTHORED AND CANON-BOUND.**

**PRODUCTS REMAIN PUBLIC AND INVARIANT.**

**NO PERSISTENCE. NO SCENE AUTHORITY.**
