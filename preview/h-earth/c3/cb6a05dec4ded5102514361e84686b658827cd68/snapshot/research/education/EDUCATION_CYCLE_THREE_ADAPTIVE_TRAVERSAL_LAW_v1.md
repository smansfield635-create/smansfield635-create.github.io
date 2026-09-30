# EDUCATION CYCLE THREE — ADAPTIVE TRAVERSAL LAW v1

Status: FROZEN CONSTRUCTION AUTHORITY
Scope: English placement traversal
Product mutation authority: NONE

## Governing principle

SELF-ASSESSMENT SELECTS THE FIRST QUESTION. PERFORMANCE SELECTS EVERY QUESTION AFTER IT.

There is one adaptive placement engine with multiple provisional entrances. There are not seven independent placement tests.

## Provisional entrances

Each learner self-assessment maps to an initial competency neighborhood. The mapping is orientation only and must never become verified placement authority.

A learner claiming substantial ability must begin with correspondingly substantial evidence. A learner selecting the highest option must begin at the highest supported diagnostic neighborhood rather than being marched through elementary material.

## Unit of adaptation

Adaptation occurs after individual answered items, not only after a fixed three-question stage batch.

Each answer writes item-level evidence before the next question is selected.

Required evidence remains:

- stage
- item id
- competency/node
- evidence class
- correct / incorrect
- assisted / unassisted
- hint use

## State transitions

A single answer is evidence, not a verdict.

### Failure

ONE FAILURE -> CHALLENGE

An isolated incorrect answer does not immediately demote the learner. The engine tests whether the failure represents an actual boundary, an isolated gap, misunderstanding, or accidental response.

CONFIRMED FAILURE -> FALL

If an adjacent or equivalent competency challenge confirms insufficient performance, the next probe moves to the immediately lower relevant competency neighborhood.

The following question must not remain artificially at the same high difficulty after the learner has exposed a likely lower boundary.

### Success

ONE SUCCESS -> SUPPORTING EVIDENCE

A single correct answer does not establish mastery.

CONFIRMED SUCCESS -> RISE

When independent evidence confirms the competency, the engine may probe the immediately higher relevant neighborhood.

### Mixed evidence

MIXED EVIDENCE -> HOLD / ADJACENT CHALLENGE

Conflicting answers require another informative probe. The engine must prefer a question that discriminates between the competing boundary hypotheses rather than repeating arbitrary material.

## Competency-aware descent

Difficulty descent must follow the competency architecture where possible.

Example:

UNSEEN_TRANSFER failure
-> PRACTICAL_COMPREHENSION challenge
-> if demonstrated, re-challenge UNSEEN_TRANSFER with different material
-> if UNSEEN_TRANSFER fails again, resolve the unresolved boundary there.

The engine must not treat stage numbers as the only information available. Evidence class and competency/node participate in next-question selection.

## Competency-aware ascent

When a learner repeatedly demonstrates the current competency independently, the next probe should increase the evidence demand rather than merely change vocabulary at the same level.

Examples include progression from:

DIRECT_RECOGNITION
-> PRODUCTIVE_FORM
-> SENTENCE_CONSTRUCTION
-> MEANING_CONSTRUCTION
-> PRACTICAL_COMPREHENSION
-> UNSEEN_TRANSFER
-> INTEGRATED_TRANSFER

This sequence is a placement architecture, not a claim that all language competence is strictly one-dimensional.

## Assistance

Assisted success remains useful learning/placement evidence but cannot silently equal independent success.

A hint request is bound to the item on which it occurred. The next-question selector may use that fact when deciding whether a competency requires confirmation.

## Termination

Placement terminates only when the engine has enough evidence to establish a stable competency boundary within the supported range.

A normal result identifies:

- competencies demonstrated below the boundary;
- first unresolved competency boundary;
- recommended learning-entry stage;
- assisted/unassisted status of relevant evidence;
- traversal used to resolve the boundary.

## Above-range result

If the learner enters at the highest supported neighborhood and repeatedly demonstrates the highest supported evidence independently, the engine terminates with:

DEMONSTRATED ABILITY EXCEEDS CURRENT PLACEMENT RANGE

It must not lower the learner merely to force an in-range result.

## Anti-patterns prohibited

- Seven disconnected placement tests.
- Self-assessment becoming final placement.
- Fixed three-question batching as the sole adaptive unit.
- Immediate demotion from one wrong answer.
- Immediate promotion from one right answer.
- Continuing high-level questions after confirmed evidence establishes the need to descend.
- Marching an above-range learner through elementary material.
- Inventing a precise 1,001 coordinate without qualified curriculum mapping.
- Treating assisted and unassisted evidence as identical.
- Treating all evidence classes as interchangeable.

## Protected surfaces

This law does not authorize changes to:

- Cycle One;
- top-level interface-language authority;
- canonical 1,001-concept inventory;
- curriculum ordering;
- speech/listening claims;
- publication architecture.

## Construction acceptance

A Cycle-Three adaptive implementation is conformant only if:

1. self-assessment selects initial neighborhood only;
2. adaptation occurs item by item;
3. one failure challenges before demotion;
4. confirmed failure causes meaningful descent;
5. one success supports before promotion;
6. confirmed success permits meaningful ascent;
7. mixed evidence causes an informative adjacent challenge;
8. evidence class participates in traversal;
9. assistance remains item-attributable;
10. termination requires a stable boundary;
11. above-range performance can terminate honestly above range;
12. the final result remains a competency boundary rather than false numerical precision.
