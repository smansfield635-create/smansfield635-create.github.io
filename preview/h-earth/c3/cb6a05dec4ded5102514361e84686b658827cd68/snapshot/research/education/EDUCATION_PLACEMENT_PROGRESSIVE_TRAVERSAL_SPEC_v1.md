# EDUCATION PLACEMENT — PROGRESSIVE TRAVERSAL SPECIFICATION v1

Status: FROZEN PRE-CONSTRUCTION AUTHORITY
Product mutation authority: NONE
Bank authority: EDUCATION_PLACEMENT_CALIBRATED_BANK_v1

## Principle

Self-assessment chooses the initial difficulty stratum only. It never determines placement.

Placement is the highest difficulty boundary at which the learner demonstrates sustainable, sufficiently independent performance.

Difficulty D1-D8 is independent from curriculum/program stage.

## Traversal

1. Enter at claimed D1-D8.
2. Present an unused item at that difficulty.
3. Record correctness, assistance, item identity, competency, and difficulty.
4. Use evidence to choose the next difficulty:
   - sustained success -> probe harder;
   - sustained failure -> probe easier;
   - mixed evidence -> continue near the current boundary with unused material.
5. Once a transition from sustainable to unsustainable performance is bracketed, concentrate evidence around that boundary.
6. Resolve only after sufficient unique evidence supports the boundary.
7. Above D8, return ABOVE_RANGE only after D8 is sustainably demonstrated.
8. At D1, unresolved failure resolves at the supported floor without inventing a lower coordinate.

## Progressive law

The next probe must never become easier after demonstrated success unless it is explicitly a boundary-confirmation probe.

The next probe must never remain indefinitely above demonstrated inability.

Competency changes do not themselves constitute difficulty changes.

## Evidence sufficiency

- Repeated items never count as fresh evidence.
- One wrong answer is not a placement verdict.
- One right answer is not mastery.
- A candidate resolved boundary requires at least 5 unique relevant observations around the bracket.
- Mixed, assisted, or contradictory evidence extends toward 8 unique observations where available.
- Assisted success cannot silently equal independent success.
- Maximum ordinary traversal: 24 unique items.
- If the engine cannot resolve within 24 unique items, return UNCERTAIN_BOUNDARY with the narrowest supported bracket.

## Initial-direction rule

Two independent, unassisted successes at the entry difficulty permit an upward probe.
Two independent failures permit a downward probe.
Mixed evidence holds near the current difficulty.

These are routing signals only; they are not final placement evidence.

## Boundary model

Maintain:
- highestSustainableDifficulty
- lowestUnsustainableDifficulty
- usedItemIds
- evidenceByDifficulty
- totalUnique
- assistanceByItem

Normal resolution requires adjacent or identical bracket endpoints consistent with the evidence.

## Program placement mapping

Difficulty establishes diagnostic ability. Program entry is mapped only after the difficulty boundary is resolved.

The traversal must not infer program stage merely because an item originated in a particular historical stage.

## Required simulation profiles

Before runtime construction, deterministic simulation must cover at least:

1. true D1 beginner;
2. true D2;
3. true D3;
4. true D4;
5. true D5;
6. true D6;
7. true D7;
8. true D8;
9. above-range learner;
10. severe overestimate;
11. severe underestimate;
12. isolated accidental miss;
13. isolated lucky success;
14. mixed competency performance;
15. assisted-success-heavy learner;
16. contradictory boundary evidence.

## Simulation acceptance

Across deterministic profiles:
- every traversal terminates;
- no item repeats as fresh evidence;
- obvious overestimates descend;
- obvious underestimates ascend;
- isolated errors do not cause collapse;
- isolated successes do not cause unsupported promotion;
- difficulty progression is monotonic except explicit boundary confirmation;
- D1 can resolve honestly;
- D8 can resolve honestly;
- above-range can resolve honestly;
- unresolved contradictory evidence returns UNCERTAIN_BOUNDARY;
- no traversal exceeds 24 unique items.

No product construction is authorized until the simulation battery passes.
