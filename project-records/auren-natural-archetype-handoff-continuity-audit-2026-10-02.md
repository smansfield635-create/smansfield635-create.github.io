# Auren Natural Archetype Observation and Handoff Continuity Audit

Status: **STATIC PASS / SUCCESSOR COGNITION + CONTINUITY**
Date: 2026-10-02

## Archetype observation

`AUREN_SUCCESSOR_NATURAL_ARCHETYPE_OBSERVATION_V1` replaces generic caller-supplied archetype evidence with a bounded natural-action cue map.

The chamber calls only:
`archetype.observeAction({sourceNode, choiceId})`.

Option-authored `archetypeEvidence` is no longer consumed.

Evidence remains:
- invisible;
- session-only;
- separate from relational events;
- unable to select dialogue;
- unable to change truth, authority, boundaries, handoff validity or product access.

Actions with no canonical cue produce `NO_CANONICAL_CUE` rather than invented evidence.

## Handoff continuity

For Manor, Elara and Jeeves character handoffs:
- a relevant unresolved handoff thread is opened before departure;
- `HANDOFF_OFFERED` records destination + originating subject/thread;
- clicking the actual destination link records `HANDOFF_ACCEPTED`.

Product links remain handoffs but do not require character-conversation thread creation.

## Manor return

A validated Manor return now:
- records `HANDOFF_RETURNED`;
- records `HANDOFF_THREAD_RESUMED` when an originating thread exists;
- does not import private Manor conversation.

Visible acknowledgment no longer implies Auren knows what happened inside. It says the visitor returned and permits explicit continuation.

## Remaining limitation

The current `resumeThread` authored response is a general Auren/Manor continuation rather than dynamically reconstructing every possible originating sentence. The semantic originating thread is nevertheless restored in session authority.

Final qualification should verify this is sufficient or require thread-specific authored continuation variants.

## Result

Archetype evidence now arises from natural interaction rather than diagnostic option metadata, and validated handoffs have explicit offer -> accept -> return -> resume semantics.
