# Agentic Frontier full24 adjudication v1

## Disposition

`PASS_CONFIGURATION_BOUNDED_OBSERVATIONAL_RESULT`

This record adjudicates the frozen 24-task population executed by repository run `33509152430` at public head `c2dbceb0267b124f5c34ac2fdf5245fc2015bca3`. It preserves the aggregate receipts; it does not rerun the experiment.

## Frozen result

| Measure | Diamond Gate | Tested OpenHands configuration |
| --- | ---: | ---: |
| Verified task completions | 10/24 (41.7%) | 0/24 (0.0%) |
| Collaborative Handoff | 4/6 | 0/6 |
| Failure Recovery | 2/6 | 0/6 |
| Implementation Repair | 3/6 | 0/6 |
| Long Horizon | 1/6 | 0/6 |

Paired outcomes were `DG_ONLY=10`, `OH_ONLY=0`, `BOTH_PASS=0`, and `NEITHER=14`.

## OpenHands qualification

The OpenHands side was not inert. In the 23 non-timeout receipts, the preserved log tails show initialization, an assistant response, and a normal finished state. Twenty-one preserved tails contain action-shaped syntax naming `file_editor` or `terminal`. Eighteen contain an exact model-request timeout message followed by the recorded run behavior.

However, those same 23 tails record `tool_calls: null`; none contains an `ActionEvent`. No receipt records a non-empty persistent OpenHands changed-file list: 23 explicitly record an empty list and the single terminal-timeout receipt records no list. The tested OpenHands 1.14.0 / Qwen2.5-Coder 7B configuration therefore did not demonstrate a healthy end-to-end tool-execution loop.

## Entitled interpretation

Within this frozen population and the tested configurations, Diamond Gate converted task interaction into verified repository state changes and passing task outcomes on 10 tasks, while the tested OpenHands configuration produced no verified completion. The evidence distinguishes three layers:

1. model engagement;
2. executable tool realization;
3. verified task completion.

The tested OpenHands configuration reached the first layer in 23 receipts but did not produce recorded persistent workspace changes. Diamond Gate reached verified completion on 10 receipts. This is a configuration-bounded difference in conversion from agentic intent to verified state change.

The earlier Diamond Gate result of 7/24 and this result of 10/24 may be reported as a descriptive difference of three completions on the same frozen population. It is not a causal estimate.

## Claim ceiling

This evidence does not authorize:

- a universal ranking of Diamond Gate and OpenHands;
- a claim that every OpenHands configuration would score 0/24;
- a claim that OpenHands lacked reasoning ability;
- a claim that the tested OpenHands environment had a fully healthy tool loop;
- architecture-only causation, PSALM causation, or attribution of the 7/24-to-10/24 change to one mechanism;
- transfer of scientific support to VNF, VOER/LVTG, MAPS, Mars, cosmology, or any other domain.

Artifact hashes establish preserved identity, not truth, external certification, or universal validity. Any broader comparison requires a separately frozen experiment with a demonstrated end-to-end tool loop and a fresh untouched test substrate.

## Source identity

- Run: `33509152430`
- Aggregate artifact: `9808335875` (`agentic-frontier-full24-aggregate-v1`)
- Aggregate results SHA-256: `48db34097cd06b8e7eb87fa38a89a42c20a01a80de17c40294ca03bb70c7df65`
- Aggregate summary SHA-256: `d15db1265702c20ec7c7b26667c60a7a448cdf0fcab137413567045a2d4b2e1c`
- Frozen task manifest SHA-256: `231d7e19b932896c409297ca35192bdd76177b20f4f5d59df2b851fa8f584044`
- Frozen protocol SHA-256: `fa54c693686d55fd5a33a60bb953ed0ee296f44ce10f90fdad54046f09630784`
