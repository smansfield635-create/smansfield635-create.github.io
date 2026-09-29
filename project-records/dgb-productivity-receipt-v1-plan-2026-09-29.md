# DGB Productivity Receipt v1 — Bounded Successor Plan

Date established: 2026-09-29

Status: PLAN_FROZEN — IMPLEMENTATION NOT YET ADMITTED

## Authority

This plan is the direct successor to the closed DGB longitudinal productivity audit in `project-records/dgb-longitudinal-productivity-audit-2026-09-29.md`.

It does not reopen or revise that historical audit. The frozen historical baseline is:

- manual / copy-paste AI-assisted operation;
- first unambiguously proven direct repository agency: 2026-07-23;
- formal control-plane agentic breakpoint: 2026-08-04;
- governed-agentic maturation: September 2026.

## Purpose

Produce a small machine-readable periodic receipt describing the composition and leverage of repository work. The receipt is an instrumentation surface, not a productivity score and not a dashboard.

## Existing infrastructure to reuse

The repository already contains:

- native GitHub Actions workflow execution;
- exact-head qualification conventions;
- JSON receipt/evidence conventions;
- artifact publication conventions;
- the existing AI Entry Workflow Dispatch Bridge and capability registry.

No new control plane, dashboard, publication subsystem, or agent authority is authorized by this plan.

## v1 measurement contract

A receipt must report the bounded period and exact repository head used for measurement, then expose evidence-backed signals for:

1. **Meaningful repository activity**
   - total mainline commits in the period;
   - identified automation/bot activity where deterministically detectable.

2. **Product construction**
   - product-associated commit/file signals;
   - Product Share = product-associated meaningful activity / meaningful repository activity.

3. **Qualification**
   - qualification/test/proof/verifier/evidence signals;
   - Qualification Density.

4. **Repair / rework**
   - repair/fix/restore/reconcile/rollback/corrective signals;
   - Repair Burden.

5. **Governance cost**
   - control-plane/governance/admission/authority/routing/dispatch/receipt/ledger signals;
   - Governance Cost.

6. **Publication / closure**
   - publication/deployment/adoption/terminal-closure signals;
   - Closure signal count/rate where denominator is valid.

7. **Reuse / leverage**
   - consumption of established capabilities, components, qualification paths, publication paths, or governance primitives;
   - evidence references rather than an invented universal numeric score in v1.

8. **Concurrency / workstream breadth**
   - materially active product/workstream families during the period.

9. **Human execution burden proxies**
   - manual/mechanical execution evidence versus reusable workflow/agent execution where repository evidence supports classification;
   - no invented labor-hours.

10. **Human abstraction level**
    - only when durable evidence supports the classification;
    - otherwise emit UNKNOWN rather than infer.

## Non-equivalence rules

The receipt must not:

- treat commits as equivalent engineering labor;
- convert commit count into engineer-hours;
- claim one human replaces a specific number of engineers;
- treat governance commits as product output;
- infer causality from temporal correlation;
- infer human effort from file size alone;
- force a numeric value when evidence is insufficient.

Overlapping classifications are allowed and must be declared as overlapping signals, not additive labor accounting.

## Period

v1 should support explicit bounded start/end inputs.

The first operational cadence, after qualification, should be **weekly**. Daily generation is unnecessary for the initial instrument and would add noise; historical daily decomposition was required only to defeat retrieval saturation.

## Output

Primary artifact: one JSON receipt.

Proposed schema identity:

`DGB_PRODUCTIVITY_RECEIPT_v1`

Minimum receipt fields:

- schema;
- generatedAt;
- repository;
- periodStart;
- periodEnd;
- measuredHead;
- methodologyVersion;
- commitCount;
- identifiedAutomationCount;
- meaningfulActivityCount;
- productSignals;
- qualificationSignals;
- repairSignals;
- governanceSignals;
- publicationClosureSignals;
- productShare;
- qualificationDensity;
- repairBurden;
- governanceCost;
- workstreamFamilies;
- reuseEvidence;
- humanExecutionBurdenEvidence;
- humanAbstractionEvidence;
- limitations;
- disposition.

Disposition is measurement validity, not a productivity grade:

- `PASS_MEASURED`
- `PASS_MEASURED_WITH_LIMITATIONS`
- `FAIL_INCOMPLETE_EVIDENCE`

## Implementation boundary

The smallest acceptable implementation is:

1. one read-only measurement script;
2. one workflow_dispatch/workflow_call workflow;
3. one JSON schema/example or verifier fixture as needed for deterministic qualification;
4. registration in the existing AI-entry workflow-dispatch capability registry only if AI-entry dispatch is required.

The workflow may read repository history and emit/upload the receipt. It must not mutate product files, deploy public surfaces, modify governance semantics, or write generated metrics back to main during measurement.

## Qualification boundary

Before recurring operation, v1 must be tested against periods already manually audited, including at least:

- one pre-agentic/manual high-volume period;
- one September governance-concentration period;
- one post-concentration product-heavy period.

The automated classifications need not reproduce every historical hand classification exactly, but discrepancies must be explainable and the receipt must not silently overstate precision.

## First deterministic implementation step

Construct the read-only measurement script and fixture-based verifier on an isolated candidate branch. Do not schedule recurring execution until the measurement contract passes qualification against the closed historical baseline.
