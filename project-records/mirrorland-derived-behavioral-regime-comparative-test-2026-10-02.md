# Mirrorland Derived Behavioral Regime Comparative Test

Status: **ARCHITECTURE TEST / NO RUNTIME MUTATION**
Date: 2026-10-02
Base: `8a9611ed37690642bfb92109253234ea21aa2f6f`

## Question

Do named derived behavioral regimes improve character authoring and verification enough to justify their complexity, or do they recreate the obsolete linear relationship phase model?

Two architectures are tested:

### Model A — Direct phenomena consumption

Character selection consumes:

- familiarity/history;
- active thread + momentum;
- disclosure affordance;
- subject-specific authority/interaction caution;
- boundary-known/pressure/recovery state;
- handoff/unresolved-thread context.

No intermediate relationship/regime label is generated.

### Model B — Derived situational regimes

The same phenomena remain source-of-truth, but a convenience layer derives a named situational mode for authoring/verifier use.

A regime is not persistent relationship state and may change by subject/thread.

## Test criteria

Each model is evaluated against:

1. curiosity neutrality;
2. subject locality;
3. mixed simultaneous conditions;
4. recovery behavior;
5. speaker perspective;
6. handoff relevance;
7. anti-replay/continuity;
8. authoring clarity;
9. verifier clarity;
10. risk of becoming a hidden score/ladder;
11. cross-character portability;
12. preservation of information authority.

## Scenario 1 — New visitor, strong lawful curiosity

Sequence:

- visitor asks what Auren is working on;
- follows the answer;
- asks a meaningful related question;
- no boundary is involved.

Derived phenomena:

- familiarity: low but accumulating;
- momentum: high;
- disclosure disposition: normal/expanding within authority;
- caution: low;
- recovery: not applicable.

### Model A

Selection directly sees low familiarity + high momentum + low caution.

Auren can continue naturally and volunteer a related authorized connection.

**Result: precise.**

### Model B

A regime would need a label meaning roughly "new but flowing."

If labeled simply ENGAGED, it loses the important fact that familiarity is still low.

**Result: regime compresses useful distinction unless it is narrowly defined.**

## Scenario 2 — Familiar visitor, protected subject

Sequence:

- substantial prior interaction exists;
- visitor asks who protected residents are;
- boundary not previously stated.

Derived phenomena:

- familiarity: high;
- momentum: high;
- authority caution: high on protected-resident subject;
- interaction caution: none;
- boundary becomes known.

### Model A

Auren can answer warmly/familiarly while refusing identifying information and offering lawful context.

**Result: precise and naturally nonlinear.**

### Model B

A single mode such as GUARDED would be wrong because the interaction is not globally guarded.

A subject-local mode such as BOUNDARY_ACTIVE could be useful, but it describes the **situation**, not the relationship.

**Result: only situational, scoped regimes survive.**

## Scenario 3 — First discovery of a boundary

Sequence:

- visitor asks a sensitive question for first time;
- Auren states limit;
- visitor asks for permissible non-identifying context.

Derived phenomena:

- boundaryKnown becomes true;
- no pressure;
- bounded context requested;
- momentum can continue;
- authority caution remains.

### Model A

No ambiguity: lawful follow-up continues.

### Model B

Any regime that treats "boundary present" as guardedness creates a false negative.

A regime would need to distinguish boundary discovery from pressure.

**Result: relationship-style regimes fail.**

## Scenario 4 — Known boundary pressured

Sequence:

- boundary already clear;
- visitor repeats demand for protected names.

Derived phenomena:

- interaction caution rises locally;
- momentum on protected thread stalls;
- familiarity remains unchanged;
- unrelated subjects remain available.

### Model A

Character selection can become firmer only on the affected subject.

### Model B

A scoped mode such as PRESSURE_ACTIVE could help an author/verifier require a firmer local response.

It must be keyed to subject/thread and must not become a global relationship phase.

**Result: situational mode may add bounded value.**

## Scenario 5 — Recovery after pressure

Sequence:

- visitor stops pressing;
- asks for lawful context or changes to Elara;
- meaningful lawful interaction resumes.

Derived phenomena:

- protected authority boundary remains;
- interaction caution decays/repairs;
- momentum rebuilds on lawful thread;
- familiarity remains.

### Model A

Recovery is naturally represented by event history and current derived state.

### Model B

A mode such as RECOVERING could help test that the character is no longer using the firm pressure response while still remembering the boundary.

But if treated as a required ladder step before normal conversation, it becomes artificial.

**Result: optional verifier convenience only.**

## Scenario 6 — High familiarity, low momentum

Sequence:

- visitor has substantial history with Auren;
- current topic has completed;
- visitor pauses or begins unrelated subject.

Derived phenomena:

- familiarity: high;
- momentum: low/new;
- disclosure disposition: potentially familiar but context dependent;
- caution: low.

### Model A

Auren can recognize history without pretending the new topic is already flowing.

### Model B

A global "open/close" regime cannot express this accurately.

**Result: direct phenomena superior.**

## Scenario 7 — Low familiarity, immediate handoff relevance

Sequence:

- new visitor asks directly about the Book;
- Auren knows Elara owns the deeper domain.

Derived phenomena:

- familiarity: low;
- momentum: adequate;
- self-authority boundary: relevant;
- destination valid.

### Model A

Handoff can be offered immediately for the correct reason.

### Model B

Any regime requiring progression before handoff blocks a natural route.

**Result: direct phenomena superior; no relationship gate allowed.**

## Scenario 8 — Same subject revisit

Sequence:

- visitor asks about the Manor;
- receives explanation;
- intervening conversation occurs;
- visitor returns to Manor.

Derived phenomena:

- topic previously discussed;
- delivered beat recorded;
- new context exists.

### Model A

Anti-replay logic + history selects deepen/connect/resume.

### Model B

A regime adds no useful information.

**Result: regime unnecessary.**

## Scenario 9 — Auren introduces another hero

Sequence:

- visitor asks who else matters;
- Auren identifies a principal character;
- description must be from Auren's angle.

Derived phenomena:

- topic relevance;
- knowledge/disclosure authority;
- speaker perspective;
- possible handoff.

### Model A

The information-authority stack supplies the required constraints.

### Model B

A relational regime contributes little or nothing.

**Result: regime unnecessary.**

## Scenario 10 — Different characters, same relational phenomena

Assume Auren and another character both have:

- high familiarity;
- high momentum;
- low interaction caution.

Their behavior should still differ because disposition/perspective differ.

### Model A

Phenomena act as affordances; character layer determines expression.

### Model B

A named mode such as OPEN risks producing shared tonal templates across characters.

**Result: direct phenomena better preserve character identity.**

## Comparative result

| Criterion | Model A: direct phenomena | Model B: derived regimes |
| --- | --- | --- |
| Curiosity neutrality | PASS | PASS only with careful regime design |
| Subject locality | PASS | FAIL if global; PASS if strictly scoped |
| Mixed simultaneous conditions | PASS | Compression risk |
| Recovery | PASS | Useful only as optional situational shorthand |
| Speaker perspective | PASS | No added value |
| Handoff relevance | PASS | Harmful if used as gate |
| Anti-replay | PASS | No added value |
| Authoring clarity | Moderate/high | Can help for narrow pressure situations |
| Verifier clarity | High with semantic assertions | Can help label specific test conditions |
| Ladder/score risk | Low | Material risk |
| Cross-character portability | High | Risk of generic tonal modes |
| Authority preservation | High | High only if regime cannot override authority |

## Finding

A general-purpose named behavioral regime layer is **not justified**.

The direct-phenomena model is more expressive, preserves simultaneous conditions, and avoids rebuilding the old relationship phase machine.

However, the test identifies a narrower useful concept:

### Ephemeral situational conditions

For authoring/verifier convenience, the runtime may derive **non-authoritative, subject/thread-scoped conditions** such as:

- boundary newly established;
- pressure active;
- recovery in progress;
- handoff context active;
- revisit with prior context.

These are not relationship levels.

They are not persistent identity of the relationship.

They do not replace the underlying phenomena.

They may be expressed as booleans/predicates rather than names.

## Decision

Adopt **Model A: direct phenomena consumption** as the target architecture.

Do not create a new PUBLIC/ENGAGED/GUARDED replacement.

Do not create four relationship levels.

Do not create a global regime enum.

Permit derived **situational predicates** only when they:

1. are deterministic from canonical events/phenomena;
2. are scoped to subject/thread where appropriate;
3. exist to simplify selection or verification;
4. cannot override knowledge/disclosure authority;
5. cannot become visitor-facing scores;
6. cannot gate unrelated conversation;
7. do not prescribe generic character tone.

## Suggested predicate family

Implementation may eventually expose semantics equivalent to:

- `isFirstPass(subject)`
- `isRevisit(subject)`
- `isBoundaryKnown(subject)`
- `isPressureActive(subject)`
- `isRecovering(subject)`
- `hasActiveMomentum(thread)`
- `hasResumableThread(thread)`
- `hasValidHandoffContext(destination)`

These are examples of semantics, not frozen API names.

## Consequence for old Auren architecture

The target successor must not reproduce:

- `phase = PUBLIC | ENGAGED | GUARDED`;
- `phase -> dialogue mask`;
- `phase === ENGAGED -> Manor offer`.

The existing runtime may remain untouched until implementation is reauthorized, but those constructs are now explicitly legacy behavior to be superseded.

## Consequence for gauges

This test does not authorize or design a gauge.

It does establish that a gauge cannot truthfully be a direct rendering of a global relationship regime because no such regime is justified.

Any future visible indicator must be evaluated against the actual phenomena and visitor utility.

## Consequence for matrix renewal

Matrix renewal remains blocked because two architecture questions remain:

1. final archetype influence boundary on character cognition/delivery;
2. whether any visitor-facing conversational indicator is useful and what it means.

After those are resolved, Auren's corpus must be re-audited before matrix renewal.

## Next deterministic operation

Define the **archetype influence boundary** under the new architecture.

The audit must determine:

- what archetype evidence may influence;
- what it must never influence;
- how it can affect what a character notices without manufacturing questions;
- how it remains invisible;
- how it avoids overriding information authority, relational phenomena, or character perspective;
- whether current archetype-specific dialogue variants should survive.

Do not design gauges in that operation.

## Terminal result

**DIRECT PHENOMENA WIN.**

**NO GLOBAL RELATIONSHIP REGIME IS NEEDED.**

**SITUATIONAL PREDICATES MAY HELP; RELATIONSHIP LEVELS DO NOT.**

**THE SAME RELATIONSHIP MAY CONTAIN HIGH MOMENTUM, HIGH FAMILIARITY, AND A HARD LOCAL BOUNDARY AT THE SAME TIME.**
