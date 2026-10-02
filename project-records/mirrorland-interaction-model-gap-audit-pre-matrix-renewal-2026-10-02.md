# Mirrorland Interaction Model Gap Audit — Pre-Matrix Renewal

Status: **ARCHITECTURE AUDIT / MATRIX RENEWAL BLOCKED**
Date: 2026-10-02
Base audited: `b615b75452bd8b29be6f5f7b32fdc6b161bb168b`

## Purpose

Audit the current Mirrorland/Auren interaction model for conceptual gaps before any successor relationship/disclosure matrix is renewed.

This record does **not** define the final replacement standard.

It explicitly blocks matrix renewal and Auren successor runtime implementation until the missing standards below are resolved.

## Governing correction

The visitor's primary agency in character conversation is curiosity.

The character is the situated information holder.

The visitor may choose what to pursue, how deeply to pursue it, what to leave alone, and how to respond to a character's boundaries.

The experience is not intended to manufacture debate, disagreement, personality declarations, or diagnostic dilemmas merely to create relationship movement.

A character's answer is not a neutral encyclopedia answer. It is constrained by world truth and delivered through that character's own knowledge, authority, relationship, disposition, and perspective.

## Gap 1 — Curiosity is currently misclassified as pressure

Current Auren nodes label ordinary questions such as `Who else is here?` as `PRY`.

Current relationship law makes any `PRY` transition immediately produce `GUARDED`.

This is too coarse.

Ordinary curiosity about the world, its characters, or Auren's relationships must not itself be treated as a boundary violation.

A boundary event requires context: what was asked, whether the information is protected, whether a boundary has already been stated, and what the visitor does after that boundary is known.

### Required successor principle

**QUESTION != PRESSURE.**

Curiosity may discover a boundary without violating it.

Continued pressure after a clear boundary may affect the interaction.

## Gap 2 — Public heroes and protected residents are collapsed

Current `people` and `privacyBoundary` material treats "people here" as though identities are generally unavailable.

That is incorrect.

Mirrorland contains visitor-facing principal characters whom Auren should be able to identify and discuss within his authority.

Mirrorland may also contain protected/private people, including unnamed children or residents, whose identities must remain unavailable.

The runtime currently lacks a durable distinction between these classes.

### Required successor question

A character-knowledge/disclosure model must distinguish at least:

- people whose identity is intentionally visitor-facing;
- people whose identity is known and discussable but whose deeper story belongs to them;
- people whose existence may be acknowledged but whose identity/details are protected.

These are architecture categories, not necessarily visitor-facing labels.

## Gap 3 — Character perspective is not a first-class authority

Current architecture correctly protects privacy and handoff authority, but it does not yet formally require that information about another character be expressed from the speaking character's perspective.

Auren must not become Jeeves when answering about Mirrorland.

### Required successor stack

For a character answering about another person/topic, selection must account for:

1. **World truth** — what is canonically true.
2. **Character knowledge** — what this character actually knows.
3. **Disclosure authority** — what this character may reveal here.
4. **Relational/contextual availability** — what this character is willing/naturally positioned to reveal now.
5. **Character perspective** — how this character interprets and expresses the authorized information.

The final standard must define how these layers interact without turning conversation into a database query.

## Gap 4 — The current relationship model is prematurely linear

Current Auren relationship state is:

`PUBLIC -> ENGAGED -> GUARDED`

with `RESPECT_BOUNDARY` recovering `GUARDED -> ENGAGED`, and `RETREAT -> PUBLIC`.

This combines several concepts:

- initial familiarity/access posture;
- conversational engagement;
- disclosure willingness;
- boundary pressure;
- relational history.

Those are not proven to be one axis.

The term `PUBLIC` in particular appears to describe an initial disclosure/access posture more than a relationship condition.

### Required successor work

Do not rename the three states or add a fourth rung yet.

First determine the independent phenomena the relationship system actually needs to represent.

Only after those dimensions are established may the architecture decide whether a small number of derived behavioral regimes are useful.

## Gap 5 — Scene offers are hard-gated on ENGAGED

Current `auren.scene-offer.js` authorizes the Manor offer only when:

- the visitor is in the Learn path; and
- relationship phase is exactly `ENGAGED`.

This makes a linear relationship label an authorization gate for world progression.

That is too narrow for the emerging model.

A Manor offer may become natural because of topic, accumulated context, unresolved thread, visitor curiosity, Auren's purpose, or other authorized circumstances.

### Required successor principle

Handoff eligibility must be contextual and character-grounded, not merely a reward for entering a preferred relationship phase.

## Gap 6 — State-dependent delivery over-couples relationship phase and archetype framing

Current state-dependent selection maps:

- PUBLIC -> PUBLIC_MASK
- ENGAGED -> OPEN_MASK
- GUARDED -> PROTECTIVE_MASK

and then may select an archetype-framed variant.

This gives the diagnostic state substantial direct control over authored delivery.

The Mirrorland interaction law says diagnostics guide cognition/mechanics while character + context guide delivery.

### Required successor question

Determine whether relationship/archetype state should:

- alter information availability;
- alter tone;
- influence next-topic selection;
- influence what Auren notices;
- or some bounded combination.

Do not assume every internal state needs a parallel authored dialogue mask.

## Gap 7 — The current law overstates "experience before exposition"

The current law lists questions including `Who else is here?` among prompts that should not be relied upon when used for dossier exposition.

The anti-FAQ intent remains correct, but the clause can be misread as discouraging legitimate visitor curiosity.

A visitor should be able to ask direct questions.

The failure occurs when the **entire interaction architecture** becomes a static information tree, not when a human asks a straightforward question.

### Required successor clarification

Direct questions are valid.

Answers should:

- respect the speaker's perspective and authority;
- recognize prior conversation;
- expose natural follow-ups;
- permit character initiative;
- avoid turning every subject into a menu loop.

## Gap 8 — Boundaries need subject-specific authority

Current privacy mechanics are primarily global/protected-person oriented.

Real character boundaries are subject-specific.

Auren may be:

- freely informative about a visitor-facing hero;
- personally candid about his own responsibility;
- unwilling to disclose a protected resident's identity;
- able to identify another character while deferring that character's deeper motivations/story;
- unable to know information outside his experience.

### Required successor standard

Boundary logic must answer:

- Is this true?
- Does Auren know it?
- Is it Auren's information to disclose?
- Is it appropriate to disclose now?
- If not, can he provide bounded context?
- Is another character/surface the correct authority?

## Gap 9 — Relationship progression lacks a mature semantic target

The current architecture says relationship development should change behavior, but the exact thing being developed has not been standardized.

The final model must distinguish at least the concepts necessary to represent:

- ordinary conversational flow;
- increased willingness to share;
- established familiarity/history;
- active boundary pressure or caution;
- recovery after pressure;
- subject-specific limits that do not disappear through relationship progression.

These may or may not become independent gauges.

No visible gauge design is authorized yet.

## Gap 10 — Gauge/presentation semantics are unresolved

Removing the visible PUBLIC/ENGAGED/GUARDED gauge was directionally justified because it exposed immature machinery.

However, the broader question remains open: whether the experience should provide any subtle visible feedback about conversational condition.

Potential presentation must not be designed until the underlying semantics are stable.

A future visible surface, if any, must communicate something meaningful to the visitor without:

- revealing diagnostic classification;
- encouraging score optimization;
- implying every relationship is a linear ladder;
- penalizing curiosity;
- confusing disclosure authority with interpersonal rapport.

## Gap 11 — Handoff descriptions need speaker perspective

Auren should be able to introduce important characters and explain why they matter.

But the description must be **Auren's description**, not the canonical neutral dossier and not Jeeves's orientation voice.

The same world character may be introduced differently by different speakers while remaining consistent with world truth.

### Required successor principle

**HANDOFF ORIENTATION IS SPEAKER-RELATIVE.**

The originating character explains why the destination matters from their own relationship, knowledge, and perspective.

The destination character retains authority over their deeper story.

## Gap 12 — Matrix scope is currently incomplete

The prior matrix concept focused too heavily on relationship phase/archetype response.

The renewed matrix, once authorized, will need to test a broader interaction standard.

At minimum it must cover:

- ordinary curiosity;
- sensitive but legitimate curiosity;
- first discovery of a boundary;
- repeated pressure after a known boundary;
- recovery after pressure;
- public hero identification;
- bounded description of another character;
- protected/private person handling;
- speaker-relative character introduction;
- unknown information;
- information known but not owned for disclosure;
- handoff initiation;
- return continuity;
- same-topic revisit;
- unresolved-thread resumption;
- natural conversational progression without a disagreement mechanic;
- relationship adaptation without visible scoring.

## What remains valid

The audit does **not** reopen these established laws:

- diagnostics remain invisible;
- no terminal visitor evaluation;
- visitor options do not manufacture identity/personality;
- session continuity is required;
- mechanical replay is prohibited;
- handoffs preserve authority boundaries;
- characters retain their own dispositions;
- Back is not the model for human conversation;
- products may remain an explicit informational mode;
- cadence/typing mechanics remain provisionally preserved.

## Supersession impact on current Auren successor contract

The record:

`project-records/auren-first-encounter-successor-bounded-implementation-contract-2026-10-02.md`

is **not authorized for runtime execution yet**.

Its four-file boundary and session-continuity direction may remain useful, but its relationship/gauge assumptions and first-encounter design must not be treated as final until this gap audit is closed.

Specifically suspended pending successor standard:

- treating the existing relationship engine as semantically adequate;
- treating PUBLIC/ENGAGED/GUARDED as the settled internal relationship model;
- any assumption that a Manor offer should continue to depend on ENGAGED;
- any final decision about visible or invisible conversational gauges;
- any matrix derived from those assumptions.

## Required architecture sequence before matrix renewal

1. Define the information/disclosure stack: world truth -> character knowledge -> disclosure authority -> contextual availability -> character perspective.
2. Define how visitor curiosity interacts with that stack.
3. Define what constitutes a boundary discovery versus boundary pressure.
4. Define the relationship phenomena that need state, without assuming a linear ladder.
5. Define how those phenomena affect character behavior and information availability.
6. Define speaker-relative introductions and character-to-character handoffs.
7. Decide whether any visitor-facing conversational indicator is useful and what it actually represents.
8. Re-audit Auren's corpus against the resulting standard.
9. Only then renew the interaction matrix.
10. Only after the renewed matrix is accepted may the successor runtime implementation contract be reauthorized or replaced.

## Matrix renewal gate

**DO NOT RENEW THE MATRIX YET.**

Matrix renewal is authorized only when the architecture can answer all of the following without ambiguity:

- What may the character truthfully say?
- What does the character actually know?
- What information belongs to the character to disclose?
- What can the character naturally disclose in this relationship/context?
- How does this character uniquely frame the answer?
- What visitor behavior constitutes curiosity rather than pressure?
- What changes after a boundary is discovered?
- What changes after a boundary is repeatedly pressed?
- What relationship/context state is actually being represented?
- How does that state affect behavior without becoming a score?
- How are visitor-facing heroes distinguished from protected/private people?
- How does a handoff preserve the originating character's perspective without transferring authority?

Until those questions have a stable answer, a renewed matrix would encode an unfinished model.

## Terminal finding

The current model has enough proven mechanics to preserve, but **not yet a mature enough semantic standard to renew the interaction matrix**.

The next work is architecture closure, not implementation and not matrix generation.
