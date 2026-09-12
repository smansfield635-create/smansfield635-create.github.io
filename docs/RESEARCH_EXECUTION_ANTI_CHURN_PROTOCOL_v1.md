# Research Execution Anti-Churn Protocol v1

**Status:** `PROPOSED_REUSABLE_EXECUTION_CONTROL`  
**Date:** `2026-09-04`

## Objective

Prevent evidence-bearing experiments from stalling in repeated discovery, transport substitution, or endless successor generations.

This protocol does not change scientific contracts. It controls how already-frozen experiments are recovered, executed, checkpointed, and terminated.

## 1. Separate four failure classes

Every failure must be classified before any repair:

- `RETRIEVAL_FAILURE` — required source/binding cannot be located;
- `MATERIALIZATION_FAILURE` — frozen inputs cannot be deterministically reconstructed;
- `EXECUTION_SUBSTRATE_FAILURE` — the current room/tooling cannot lawfully run the computation;
- `SCIENTIFIC_DISPOSITION` — the frozen experiment executed and produced its defined result.

Transport, retrieval, or substrate failures are never scientific outcomes.

## 2. Retrieval budget

For the same missing object:

- maximum two equivalent probes;
- strategy change required after the first failure;
- no third synonym/search-loop attempt without new evidence;
- after two evidence-free probes, record `NO_NEW_EVIDENCE_DO_NOT_REPEAT` and change source/substrate.

## 3. Execution-substrate honesty

If the active room lacks a lawful execution substrate, it must say so and stop at a durable execution packet.

It must not simulate progress by:

- searching workflow runs repeatedly;
- treating GitHub Actions as agent execution when prohibited;
- repeatedly enumerating branches/issues/commits;
- creating serial carrier issues with no new executable state.

## 4. Durable checkpoint requirement

Every experiment defines checkpoint receipts before execution begins.

At minimum:

1. source binding;
2. materialized input identity;
3. preprocessing/transformation identity;
4. execution result;
5. terminal disposition.

A successor context resumes from the latest receipt. Chat transcript memory is non-authoritative.

## 5. One-next-action invariant

Every durable receipt ends with exactly one `NEXT_LAWFUL_ACTION`.

If a room cannot perform that action, it must emit `SUBSTRATE_REQUIRED` with the exact requirement. It may not branch into broad exploratory work.

## 6. Terminal generation rule

Every experiment family must declare a terminal generation or terminal decision boundary before repeated repair begins.

After that boundary:

- unfavorable results are accepted;
- insufficient identifiability closes that route;
- scientific definitions/gates are not relaxed to rescue the result;
- a successor experiment requires a genuinely new scientific question, population, or preregistered design—not merely a desire for a different outcome.

## 7. Repair scope

Repair only the class of defect actually observed.

Examples:

- missing file path -> repair source binding only;
- nondeterministic reconstruction -> repair materialization only;
- unavailable runtime -> move to a lawful substrate only;
- underpowered frozen population -> terminate as insufficient identifiability unless a separately preregistered new experiment is warranted.

## 8. Scientific freeze protection

Once outcome-bearing execution starts, prohibit unregistered changes to:

- features;
- transformations;
- matching rules;
- tie-breaking;
- thresholds;
- gates;
- population inclusion/exclusion;
- seed semantics;
- comparator definitions;
- outcome adjudication.

## 9. Takeover procedure

A successor room performs only:

1. read the controlling handoff;
2. resolve exact repository/branch/head;
3. read latest receipt;
4. verify receipt identities;
5. execute `NEXT_LAWFUL_ACTION`.

Repository-wide rediscovery is exceptional and must be justified by a specifically missing binding.

## 10. Completion criterion

An experiment is complete when it reaches its predefined scientific terminal disposition, including negative, null, contradicted, insufficient-identifiability, or supported outcomes.

`MORE_GENERATIONS` is not itself progress.
