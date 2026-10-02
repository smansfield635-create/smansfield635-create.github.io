# Mirrorland Relational Event and Derivation Contract

Status: **CANONICAL SUCCESSOR ARCHITECTURE — EVENT / DERIVATION LAYER**
Date: 2026-10-02

Authority:
- `project-records/mirrorland-information-authority-curiosity-boundary-law-2026-10-02.md`
- `project-records/mirrorland-relational-phenomena-law-pre-regime-2026-10-02.md`

This record defines how relational phenomena are derived from bounded semantic events.

It does not authorize runtime implementation, gauges, named levels, or matrix renewal.

## 1. Source-of-truth law

Relational state is derived from **what happened**, not from arbitrary trust points.

The durable source of truth is a bounded semantic event ledger plus subject/thread context.

Derived phenomena are interpretations of that ledger for character cognition.

Do not make a numeric score the authoritative record of the relationship.

## 2. Event anatomy

Every accepted relational event must contain enough identity to be auditable without storing a full transcript.

Minimum semantic fields:

- `eventType`
- `characterId`
- `sessionId` or equivalent session authority
- `sequence`
- `subjectId` where subject-local
- `threadId` where thread-local
- `sourceBeat` / source context
- `destinationId` where handoff-related
- `boundaryId` where boundary-related
- `timestamp/order authority` if required by runtime
- `metadata` limited to event-specific non-diagnostic facts

Events must not require storing the visitor's inferred personality.

## 3. Canonical event vocabulary

### Conversation/history events

**TOPIC_OPENED**
A substantive subject becomes active.

**TOPIC_MEANINGFULLY_PURSUED**
The visitor or character continues a subject in a way that creates useful shared context.

**TOPIC_COMPLETED**
The active conversational purpose for the subject is reasonably satisfied.

**TOPIC_REDIRECTED**
Conversation intentionally moves from one subject to another while preserving relevant continuity.

**TOPIC_REVISITED**
A previously discussed subject becomes active again.

### Character-disclosure events

**AUTHORIZED_CONTEXT_VOLUNTEERED**
The character voluntarily adds authorized information beyond the minimum direct answer.

**DEEPER_AUTHORIZED_CONTEXT_SHARED**
The character shares materially deeper information that is still within knowledge/disclosure authority.

**SELF_AUTHORITY_DEFERRED**
The speaker identifies that deeper material belongs to another character/surface.

These events describe character behavior; they do not automatically imply visitor merit.

### Boundary events

**BOUNDARY_ESTABLISHED**
A subject-specific disclosure limit is made clear for the first time or materially clarified.

**BOUNDARY_ACKNOWLEDGED**
The visitor's next relevant action demonstrates recognition of the stated limit.

**BOUNDED_CONTEXT_REQUESTED**
The visitor asks for permissible context within a known boundary.

**BOUNDARY_PRESSURED**
The visitor attempts to obtain substantially the same protected information beyond a known limit.

**BOUNDARY_REASSERTED**
The character restates/enforces the known limit.

**BOUNDARY_THREAD_RELEASED**
The conversation leaves the pressured protected request and resumes lawful interaction.

### Handoff events

**HANDOFF_OFFERED**
The character identifies a valid destination and gives a speaker-relative reason.

**HANDOFF_ACCEPTED**
The visitor takes the authorized handoff.

**HANDOFF_RETURNED**
An authorized return is recognized without importing private destination conversation.

**HANDOFF_THREAD_RESUMED**
The originating unresolved thread is resumed after return.

### Encounter/continuity events

**CONTEXTUAL_ASSISTANCE_ACCEPTED**
The visitor participates in a character/world situation in a bounded way.

**UNRESOLVED_THREAD_OPENED**
A conversational/situational matter is intentionally left active.

**UNRESOLVED_THREAD_RESUMED**
A prior active matter is resumed.

**UNRESOLVED_THREAD_RESOLVED**
That matter no longer requires continuation.

### Session event

**SESSION_RESET**
Clears session-only derived state according to the authorized memory boundary.

## 4. Events that are deliberately absent

Do not create canonical events such as:

- TRUST_GAINED;
- TRUST_LOST;
- GOOD_CHOICE;
- BAD_CHOICE;
- USER_AGREED;
- USER_DISAGREED;
- ARCHETYPE_PROVED;
- RELATIONSHIP_LEVEL_UP;
- RELATIONSHIP_LEVEL_DOWN.

Those encode premature evaluation rather than observable interaction.

## 5. Subject scoping

Events affecting disclosure/caution must use a stable semantic `subjectId` or domain.

Examples of subject domains may include:

- `auren:self`
- `mirrorland:principal-characters`
- `manor:protected-residents`
- `character:elara`
- `product:education`

Exact identifiers are implementation detail, but subject identity must be stable enough to distinguish:

- the protected subject;
- adjacent lawful subjects;
- unrelated subjects.

A subject may inherit an authority sensitivity from world/canon configuration without any visitor event.

## 6. Thread scoping

A `threadId` represents an active conversational purpose, not merely a node.

A thread may span:

- multiple questions;
- multiple authored beats;
- a handoff;
- a return;
- a temporary redirect.

This is how continuity survives topology changes.

A subject and thread are different:

- subject = what the conversation is about;
- thread = what the current conversational movement is trying to resolve/continue.

## 7. Bounded ledger

The event ledger is session-bounded unless a later memory authority explicitly extends it.

Requirements:

- deterministic order;
- finite storage;
- preserve currently active unresolved threads;
- preserve current boundary knowledge;
- preserve recent events needed for anti-replay/recovery;
- compact older redundant events when safe;
- never discard an active authority boundary merely to satisfy a fixed event count.

A bounded derived summary may coexist with a recent-event tail.

The architecture does not require a permanent transcript.

## 8. Familiarity derivation

Familiarity is derived from **meaningful shared history**, not event count.

Signals that may increase meaningful familiarity include:

- distinct substantive topics meaningfully pursued;
- unresolved threads later resumed/resolved;
- handoff-return continuity;
- contextual participation;
- repeated conversation that demonstrates remembered context.

Signals that do not independently establish familiarity:

- opening/closing menus;
- repeated clicks;
- mechanical revisits;
- boundary pressure;
- raw number of questions.

### Representation constraint

Implementation may use qualitative bands, counters, feature flags, or derived summaries internally, but must be able to explain familiarity from semantic history.

No arbitrary `+1 familiarity` per interaction.

## 9. Momentum derivation

Momentum is thread-local and short-horizon.

Momentum is supported by:

- TOPIC_MEANINGFULLY_PURSUED;
- UNRESOLVED_THREAD_RESUMED;
- coherent TOPIC_REVISITED;
- CONTEXTUAL_ASSISTANCE_ACCEPTED;
- HANDOFF_THREAD_RESUMED;
- character/visitor continuation of the same conversational purpose.

Momentum is reduced or ended by:

- TOPIC_COMPLETED;
- repeated mechanical loop without new context;
- abandoned thread;
- unrelated redirect without a continuity bridge;
- active boundary pressure that stalls the current thread.

### Natural decay

Momentum does not need clock-time decay during a short session.

It decays semantically when the active conversational thread changes, completes, stalls, or is abandoned.

## 10. Disclosure-disposition derivation

Disclosure disposition is not directly incremented.

It is derived from:

- what information is authorized;
- character disposition;
- familiarity/history;
- current momentum;
- subject caution;
- prior authorized disclosure on the same/related subject;
- active world/context purpose.

A useful conceptual ordering is:

`authority ceiling -> subject caution -> contextual relevance -> relational history -> character willingness`

The output may determine whether the character:

- answers minimally;
- answers normally;
- volunteers additional authorized context;
- offers deeper authorized context;
- defers/hands off.

This is a selection affordance, not a score.

## 11. Caution derivation

Caution has two sources that must remain distinguishable.

### Authority caution

Derived from canon/disclosure configuration.

Examples:

- protected residents;
- private details;
- another character's self-authoritative material.

Authority caution may persist regardless of visitor behavior.

### Interaction caution

Derived from event history.

Interaction caution may rise when:

- BOUNDARY_PRESSURED occurs;
- pressure repeats;
- the visitor attempts to evade the same known limit.

It may influence adjacent subjects only where canon/character reasoning establishes a legitimate connection.

Do not globally propagate caution by default.

## 12. Boundary-known derivation

For a subject/boundary pair:

- before BOUNDARY_ESTABLISHED: boundary may exist in authority but is not conversationally known to visitor;
- after BOUNDARY_ESTABLISHED: boundaryKnown=true for the relevant scope;
- BOUNDED_CONTEXT_REQUESTED after establishment remains lawful;
- BOUNDARY_PRESSURED requires boundaryKnown=true plus an attempt beyond the known scope.

This is the deterministic distinction between curiosity and pressure.

## 13. Recovery derivation

Recovery begins only after interaction pressure existed.

Signals supporting recovery:

- BOUNDARY_ACKNOWLEDGED;
- BOUNDED_CONTEXT_REQUESTED;
- TOPIC_REDIRECTED to a lawful subject;
- HANDOFF_ACCEPTED where the handoff was the lawful authority route;
- subsequent meaningful lawful interaction;
- BOUNDARY_THREAD_RELEASED.

Recovery should be derived from subsequent behavior, not an apology keyword.

### Recovery result

Recovery may reduce or clear **interaction caution**.

It never clears:

- authority caution;
- the fact that the boundary is known;
- the bounded historical fact that pressure occurred.

## 14. Repeat pressure

Repeated BOUNDARY_PRESSURED events on the same boundary may justify:

- stronger local interaction caution;
- shorter local answers;
- refusal to continue that protected thread;
- firmer redirection.

The contract does not authorize global hostility or permanent conversation lockout.

Repeated pressure on one subject is not evidence that every future question is adversarial.

## 15. Reset/session behavior

On SESSION_RESET:

Clear:

- active momentum;
- active unresolved threads unless explicitly carried by authorized return/session continuity;
- session-only interaction caution;
- session-only familiarity summary;
- session-only disclosure disposition derivations;
- session event tail.

Preserve only what a separate authorized memory/return mechanism explicitly carries.

World truth, character knowledge rules, disclosure authority, and authority caution are not session state and therefore do not reset.

## 16. Handoff derivation

HANDOFF_OFFERED must be justified by:

- valid destination;
- subject/thread relevance;
- speaker-relative orientation;
- authority appropriateness.

It must not require a relationship level.

HANDOFF_ACCEPTED opens bounded handoff context.

HANDOFF_RETURNED validates only authorized return facts.

HANDOFF_THREAD_RESUMED restores the originating conversational purpose where still relevant.

No event imports the destination character's private conversation.

## 17. Influence boundary

Derived phenomena may influence **selection constraints and affordances**.

They may influence:

- whether prior context is acknowledged;
- whether a response is first-pass or revisit;
- whether additional authorized context is volunteered;
- whether a local boundary response is normal or firm;
- whether a thread is resumed;
- whether a handoff is relevant;
- whether the character initiates a related subject.

They must not directly select a generic personality mask such as OPEN or PROTECTIVE and then let that mask replace character reasoning.

Character + context remain responsible for delivery.

## 18. Archetype separation

Archetype evidence is not a relational event.

The relational ledger must not contain:

- Strategist points;
- Builder points;
- Mitigator points;
- Auditor points;
- provisional archetype labels.

The same observable visitor action may be observed independently by:

- relational continuity logic; and
- archetype cognition.

Those systems may consume the same source action, but they maintain separate authorities and receipts.

Relational derivation must remain valid if archetype cognition is disabled.

## 19. Anti-replay interaction

The event system must support anti-replay without making response IDs the relationship model.

At minimum, session continuity separately records delivered authored beats/responses.

TOPIC_REVISITED plus delivered-beat history should cause the character layer to select:

- acknowledgment;
- deepening;
- clarification;
- connection;
- resumption;
- intentional contextual repetition.

Mechanical complete-response replay is not a relational event and does not create familiarity/momentum.

## 20. No timer-based social simulation requirement

This architecture does not require real-time clocks to simulate relationship decay.

Within a bounded session, semantic events are sufficient.

If future persistent memory introduces elapsed-time behavior, that requires separate authority.

Do not invent "trust decays after N minutes."

## 21. Deterministic examples

### First question about protected residents

Input:
- authority says identity protected;
- boundaryKnown=false;
- visitor asks who they are.

Derivation:
- BOUNDARY_ESTABLISHED;
- no BOUNDARY_PRESSURED;
- authority caution present;
- interaction caution absent.

Behavior:
- Auren may provide lawful non-identifying context and continue normally.

### Follow-up asking what protecting them requires

Input:
- boundaryKnown=true;
- request stays inside permitted context.

Derivation:
- BOUNDED_CONTEXT_REQUESTED;
- TOPIC_MEANINGFULLY_PURSUED;
- no pressure.

Behavior:
- Auren can elaborate within authority.

### Repeated demand for names

Input:
- boundaryKnown=true;
- request exceeds known boundary.

Derivation:
- BOUNDARY_PRESSURED;
- interaction caution rises locally.

Behavior:
- Auren reasserts the line more firmly.

### Visitor then asks about Elara

Input:
- Elara is visitor-facing;
- separate subject;
- no relevant authority prohibition.

Derivation:
- TOPIC_REDIRECTED;
- BOUNDARY_THREAD_RELEASED;
- new TOPIC_OPENED for Elara;
- recovery may begin.

Behavior:
- Auren can discuss Elara from Auren's perspective rather than carrying protected-resident guardedness globally.

## 22. Implementation-neutral derived snapshot

A future runtime snapshot should be able to expose internally, for testing/cognition, semantics equivalent to:

- meaningfulHistory summary;
- activeThread;
- activeSubject;
- momentum condition;
- disclosure affordance by relevant subject;
- caution by subject with source = authority / interaction / both;
- known boundaries;
- recent pressure;
- recovery condition;
- unresolved threads;
- handoff context.

This is not visitor-facing.

Exact field names and data structures remain implementation design.

## 23. What remains unresolved

This record closes event vocabulary and derivation semantics.

Still unresolved:

1. whether derived authoring regimes are useful;
2. whether any visitor-facing conversational indicator is useful;
3. final archetype influence boundary on character cognition;
4. renewed Auren corpus audit;
5. renewed interaction matrix;
6. successor runtime implementation contract.

## 24. Next architecture operation

Audit whether **derived behavioral regimes** add genuine authoring/verifier value or merely recreate the old phase machine under new names.

The operation must test both possibilities:

- no regimes: character selection consumes phenomena directly;
- bounded derived regimes: a small set of non-linear situational modes used only as conveniences, never source-of-truth.

Do not design visitor-facing gauges in that operation.

## Matrix renewal status

**BLOCKED.**

## Terminal law

**EVENTS RECORD WHAT HAPPENED.**

**PHENOMENA ARE DERIVED FROM SEMANTIC HISTORY.**

**AUTHORITY CAUTION AND VISITOR-CAUSED CAUTION ARE DIFFERENT.**

**BOUNDARY PRESSURE REQUIRES A KNOWN BOUNDARY.**

**RECOVERY CHANGES THE EFFECT OF PRESSURE, NOT THE AUTHORITY BOUNDARY.**

**ARCHETYPE EVIDENCE IS NOT RELATIONSHIP STATE.**
