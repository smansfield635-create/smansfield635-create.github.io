# EDUCATION PLACEMENT — 64-ITEM REBALANCED BANK AUTHORITY v1

Status: FROZEN CONTENT-CONSTRUCTION AUTHORITY
Product mutation authority: NONE
Source audit: EDUCATION_PLACEMENT_64_ITEM_COMPETENCY_DIFFICULTY_MATRIX_v1

## Governing correction

PROGRAM STAGE and PLACEMENT DIFFICULTY are independent coordinates.

The placement bank remains exactly 64 items. The target is 8 difficulty strata with 8 unique items per stratum.

Difficulty must rise because the English/cognitive demand rises, not merely because the competency category changes.

## Target distribution

| Difficulty | Required items | Intended demand |
|---|---:|---|
| D1 | 8 | elementary recognition / immediate functional meaning |
| D2 | 8 | basic words, relations, and simple sentence recognition |
| D3 | 8 | basic morphology and straightforward sentence construction |
| D4 | 8 | connected sentence meaning, functional construction, routine comprehension |
| D5 | 8 | paraphrase, practical multi-clause comprehension, basic transfer |
| D6 | 8 | unseen rules, conditional application, response synthesis |
| D7 | 8 | exceptions, conflict, summary, multi-constraint reasoning |
| D8 | 8 | integrated advanced transfer, uncertainty, reconciliation, precise action |

TOTAL = 64.

## Content law

Every final item MUST carry:

- stable item ID;
- competency;
- difficulty stratum D1–D8;
- evidence class;
- node;
- prompt;
- four response options;
- one keyed answer;
- instruction-burden classification.

The existing stage-prefixed IDs may remain stable for provenance, but their prefix MUST NOT determine placement difficulty.

## Instruction law

Use the shortest natural English instruction that preserves the measured construct.

Preferred forms include:

- What does “___” mean?
- Which is correct?
- Complete the sentence.
- Which means the same?
- What should you do?
- What does this mean?
- Which response is best?

Do not use longer meta-instructions when the same construct can be measured with simpler English.

Native/help-language guidance is fallback support, not the default language of the test.

## Rebalance strategy

The prior audit found:
D1=7, D2=8, D3=17, D4=12, D5=8, D6=5, D7=4, D8=3.

Therefore the bank must be redistributed without increasing cardinality.

Required net movement:
- D1: +1
- D2: 0
- D3: -9
- D4: -4
- D5: 0
- D6: +3
- D7: +4
- D8: +5

The excess low/middle items are the source material for harder rewrites. Do not merely relabel an easy item as difficult.

## Hardening requirements

To move an item upward, increase genuine demand through one or more of:

- less lexical cueing;
- more plausible distractors;
- multi-clause meaning;
- temporal/conditional relations;
- exception handling;
- paraphrase equivalence;
- unseen application;
- competing constraints;
- uncertainty distinction;
- synthesis before action.

Hardening MUST NOT rely primarily on verbose instructions or obscure vocabulary unrelated to the competency.

## Difficulty progression within competencies

Where possible, competency families should span multiple difficulty strata.

Examples:

LEXICAL / MEANING
D1 direct recognition
-> D2 common relation
-> D3 meaning in sentence context
-> D4 circumlocution
-> D5 semantic equivalence

SENTENCE / FORM
D2 simple sentence recognition
-> D3 morphology/order
-> D4 cause/comparison/request
-> D5 multi-clause relation
-> D6 controlled response synthesis

PRACTICAL COMPREHENSION
D1 immediate sign
-> D2 simple instruction
-> D3 routine form/message
-> D4 schedule/restriction
-> D5 multi-clause notice
-> D6 conditional rule
-> D7 exception
-> D8 conflicting evidence/constraints

TRANSFER
D5 basic unseen application
-> D6 conditional application
-> D7 exception/conflict
-> D8 integrated reconciliation and precise action

## Rewrite boundary

The 27 items marked REWRITE in the audit are authorized for wording/content revision.

The 18 MOVE items may retain their underlying item content when their calibrated difficulty changes, but if a target stratum lacks genuine demand they may also be hardened.

The 19 KEEP items should remain semantically stable unless a minimal instruction simplification is required for consistency.

No item may be rewritten merely to make the bank look symmetrical.

## Acceptance requirements

The calibrated candidate MUST prove:

1. exactly 64 items;
2. exactly 8 items at each D1–D8;
3. 64 unique IDs;
4. 64 unique prompts;
5. four response options per item;
6. valid answer indexes;
7. every item has competency + difficulty + evidence class + node;
8. instruction burden is NONE or BASIC for the final bank; MATERIAL is not permitted;
9. Stage 1 remains genuinely beginner-accessible;
10. D7/D8 difficulty comes from reasoning/English demand rather than instruction verbosity;
11. no stage prefix is used as difficulty authority;
12. no product runtime changes occur in the same construction.

## Next boundary

Construct the calibrated 64-item content candidate from this authority, then run a content-only qualification before any traversal/runtime mutation.
