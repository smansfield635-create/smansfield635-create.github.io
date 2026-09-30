# Agentic Frontier Comparative Protocol v1

Status: **FROZEN**  
Admission: `AGENTIC_FRONTIER_COMPARATIVE_STUDY_V1_20260825_003`  
Admission receipt SHA-256: `e0cc7c85d8c04c0148790bc69b4489f2179ea1b90db080da1dc379062ad790ec`  
Public governing head: `4abee910e521229ec1a90004372d77dee233e297`  
Primary adversary: **OpenHands v1.14.0**  
OpenHands target: `c0ba9e6d2b73dca07fe1127b91c1eff719853846`  
Population: **24 paired tasks**

## Research question

Under equivalent frozen task contracts, does the Diamond Gate execution architecture produce different verified material outcomes, human-intervention burden, recovery behavior, collaborative continuity, or elapsed execution than OpenHands v1.14.0?

The object under test is the execution system surrounding a model: task decomposition, authority routing, handoff, verification, recovery, and exact-state control. This protocol does not assume that any observed difference is caused by the harness alone.

## Experimental unit

One paired task is one frozen task package executed once by each system from an equivalent starting state. The task package fixes:

1. task text;
2. initial repository/fixture state;
3. allowed tools and network policy;
4. acceptance tests;
5. model/configuration attribution;
6. human-intervention policy;
7. role/handoff boundaries where applicable;
8. any predeclared disruption.

A pair is excluded before scoring if equivalent execution conditions cannot be established. It may not be excluded because one system performed poorly.

## Population

The population is exactly 24 task IDs in `task-manifest-v1.jsonl`, divided into four preregistered strata of six:

- `IMPLEMENTATION_REPAIR`: bounded implementation and repair;
- `LONG_HORIZON`: dependent multi-step repository work;
- `COLLABORATIVE_HANDOFF`: diagnosis → implementation → independent verification with explicit handoff boundaries;
- `FAILURE_RECOVERY`: execution with one predeclared disruption.

No task may be added, removed, rewritten, or substituted after either system's outcome for that task is opened. A scientifically unusable pair remains in the ledger with an exclusion reason.

## Neutral microrepository fixture

To avoid advantaging either system through prior familiarity with Diamond Gate code, all 24 tasks use fresh deterministic microrepositories described by the manifest. Each task records a `fixture_seed`, language/runtime, required files/modules, defect or requested capability, and acceptance contract. The execution controller materializes the task in an isolated temporary Git repository with no solution history and with network access disabled unless a task explicitly says otherwise.

Both systems receive the same materialized task package. Neither receives the other system's transcript, patch, private reasoning, or intermediate output.

## Configuration parity

Use the same underlying frontier model and materially equivalent model settings where both systems support them. Record exact provider, model identifier, temperature/reasoning settings where exposed, context limit, tool permissions, and execution limits.

If exact model parity is impossible, complete the pair only if the difference is explicitly recorded. Such a pair may support a **system-level comparison** but may not be used to attribute the difference solely to execution architecture.

## Human intervention

Allowed human actions are limited to starting the run, supplying the frozen task package, and recovering from infrastructure failure unrelated to the agent's decisions. Any substantive hint, code suggestion, task reinterpretation, manual patch, selective retry, or acceptance override is an intervention and must be logged.

Intervention severity:

- `0`: none;
- `1`: transport/infrastructure only, no task information;
- `2`: procedural clarification already entailed by the frozen contract;
- `3`: substantive task hint or redirection;
- `4`: human code/solution contribution or manual acceptance correction.

A severity-4 intervention prevents the task from counting as autonomously completed.

## Terminal outcome

A system receives `PASS` only when the frozen acceptance command passes from the final submitted state and no prohibited condition occurred. Partial work, plausible code, self-reported completion, or passing a subset of tests is not terminal success.

Terminal states are:

- `PASS`;
- `FAIL_TESTS`;
- `FAIL_SCOPE`;
- `FAIL_TIMEOUT`;
- `FAIL_COORDINATION`;
- `FAIL_RECOVERY`;
- `INFRA_EXCLUDED`.

## Primary measures

For every pair record:

- terminal outcome;
- acceptance-test pass fraction;
- specification coverage;
- prohibited regression count;
- human intervention count and maximum severity;
- retries/restarts;
- elapsed execution time;
- model/API tokens and cost when directly observable;
- number of handoff failures for collaborative tasks;
- recovery outcome for disruption tasks;
- final Git tree identity;
- verified material outcome (`true/false`).

`SUPPORT`-only transport, governance, logging, or evidence movement is not an independent material outcome.

## Reporting axes

Four independent axes are reported rather than one marketing score:

- **C — Capability:** paired terminal success and specification coverage.
- **A — Autonomy:** intervention burden and autonomous completion rate.
- **V — Verified material velocity:** verified material completions normalized by elapsed execution time.
- **R — Reliability:** regression avoidance, handoff continuity, and recovery success.

Report raw paired results first, then aggregate counts/rates with uncertainty. With only 24 pairs, emphasize effect sizes and paired outcomes; do not imply population-wide certainty from nominal significance alone.

## Collaboration rule

For `COLLABORATIVE_HANDOFF` tasks, roles are separated. The implementer may receive only the frozen task contract plus the prior role's authorized handoff artifact. It may not inherit the prior role's private transcript. The verifier receives the frozen acceptance contract and final candidate state, not the implementer's private transcript.

## Recovery rule

For `FAILURE_RECOVERY` tasks, the disruption is declared in the manifest before execution. Examples include stale-head rejection, an intentionally failing verifier, a conflicting assumption, a regression introduced by a first attempt, or an incomplete first solution. The disruption must be applied identically to both systems.

## Blinding and tuning

The scoring contract and task manifest are frozen before paired outcomes are opened. No threshold, acceptance test, weighting, exclusion rule, or task text may be changed to improve either system's result. Corrections to clerical metadata require a new study generation if outcomes have already been opened.

## Publication boundary

OpenHands is named descriptively as the tested open-source system. The study is independent and does not imply affiliation or endorsement.

Allowed conclusion form:

> Under Agentic Frontier Comparative Protocol v1, Diamond Gate Bridge configuration X and OpenHands v1.14.0 configuration Y were evaluated across N frozen paired tasks; the measured paired differences were ...

This study cannot by itself establish universal superiority, global rank, superiority to every OpenHands configuration, or causation by harness architecture alone.

## Immutable upstream research boundary

The closed Material Work Audit v1 remains immutable. Its merged aggregate result (17 PARAMOUNT / 682 STANDARD / 207 SUPPORT = 906; 699 material) is contextual baseline evidence only and is not rescored in this experiment.
