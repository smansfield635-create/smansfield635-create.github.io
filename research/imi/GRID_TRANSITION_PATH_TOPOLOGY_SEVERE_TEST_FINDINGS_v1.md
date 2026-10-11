# Grid Transition-Path Topology Severe Test — Findings v1

**Status: VALID COMPLETED — UNEVALUABLE**

The frozen transition-path study executed successfully on 160 fresh stressed IEEE 39-bus dispatch states and 5,600 non-islanding N-1 state-contingency rows. The source remained PowerAgentBench commit `a93255d827292922165c05396b600904e0a6130e`.

The result did not produce a scientific PASS or FAIL because the preregistered identifying-variation gates were not met.

## Execution facts

- States: **160**
- State-contingency rows: **5,600**
- Failure rate: **40.0%**
- Frozen switch candidates: branches `[2, 26, 11, 34, 16, 17, 28, 15, 31, 22, 10, 7]`
- Path-richness P range: **0.1477273 to 0.1515152**
- Distinct P values: **2** (required >= 20)
- Distinct state-survival values: **1** (required >= 20)
- Every state survival fraction: **0.6000**
- Bottom-P quartile survival: **0.6000**
- Top-P quartile survival: **0.6000**
- Quartile difference: **0.0000**, permutation p = **1.0000**

Recovery depth counts across all 5,600 rows:

- unrecovered: **2,240**
- direct redispatch (depth 0): **3,200**
- one switching action (depth 1): **160**
- two-step emergency path (depth 2): **0**

## Interpretation

The transition-path representation was almost invariant across dispatch states, and the recovery outcome was completely invariant at the state level. The 40% failures were again determined by contingency/topology identity rather than by dispatch-state path richness. Because P had only two values and state survival only one, the preregistered predictive and monotonic tests were correctly not run.

This does **not** count as evidence for or against the transition-path hypothesis. It does establish that intact-topology dispatch variation on this N-1 benchmark is insufficient to identify the hypothesis even after topology switching is added to the action set.

The clean next boundary is therefore a separately frozen topology-varying/N-2 realization in which the pre-contingency system state itself differs by a lawful maintenance-line topology, followed by an independent second outage. That creates genuine variation in the transition graph rather than trying to extract it from dispatch alone.

## Receipt

- GitHub Actions run: `32612388995`
- Artifact ID: `9485953562`
- Artifact digest: `sha256:2aca1461fa4552ff153fe43e185cd7d620c28ea0a20686dc98bbd0b8af8b263b`
- Execution head: `2b2a3e7f493edef626dd6be183b69ebfd4387dd8`
- Research PR: `#1726`

The UNEVALUABLE verdict is permanent and is not replaced by any subsequent study.