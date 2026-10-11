# BT4 Entitlement Harness Result v1

Status: `ISOLATED_RESEARCH_HARNESS_PASS`

Purpose: test the surviving BT4 composition as an isolated executable mechanism without mutating any public product route.

## Clarification regarding Stencila

This experiment does not assume or imply that Stencila copied, monitored, or used Diamond Gate Bridge updates. The chronology audit found temporal and architectural convergence only. No citation, access trail, issue, commit reference, discussion, or other evidence of causal influence has been established.

## Harness contract

A public claim entitlement is derived from current evidence, reproduction/qualification state, provenance, authority, adverse evidence, and a qualification receipt epoch. Presentation is downstream of entitlement and is prohibited from requesting a stronger state than the derived entitlement.

State order:

`HELD/CONTRADICTED < CANDIDATE < SUPPORTED < QUALIFIED`

Recovery after a failure increments the required qualification epoch. Repairing the underlying evidence without a fresh qualification receipt may recover only to `SUPPORTED`; it may not restore `QUALIFIED`.

## Adversarial interventions

1. Baseline: all evidence, reproduction, provenance, authority, and qualification conditions valid -> `QUALIFIED`.
2. Source/provenance mutation -> entitlement becomes `HELD`; a stale request to render `QUALIFIED` is blocked and rendered as `HELD`.
3. Reproduction failure -> `HELD`.
4. Admissible adverse evidence -> `CONTRADICTED`.
5. Presentation drift attempt while entitlement is degraded -> stronger presentation override blocked.
6. Underlying condition repaired but old qualification receipt retained -> `SUPPORTED`; attempted `QUALIFIED` representation blocked.
7. Fresh admissible qualification receipt at the required new epoch -> `QUALIFIED` restored.

## Execution result

The exact committed JavaScript harness was executed under Node.js in the analysis environment before preservation in the repository.

Result schema: `BT4_ENTITLEMENT_HARNESS_RESULT_v1`

Checks: `7`

Passed: `7 / 7`

Overall: `PASS`

## Binding disposition

`ISOLATED_MACHINE_ENTITLEMENT_CONTRACTION = DEMONSTRATED`

`STRONGER_PUBLIC_STATE_UNREACHABLE_WHEN_ENTITLEMENT_DEGRADED = DEMONSTRATED_IN_HARNESS`

`RECOVERY_REQUIRES_FRESH_QUALIFICATION_RECEIPT = DEMONSTRATED_IN_HARNESS`

`PUBLIC_SERVED_DIAMOND_GATE_INTEGRATION = NOT_DEMONSTRATED`

`BT4_STRONG_FORM_AS_DEPLOYED_SYSTEM = NOT_YET_PROVED`

This experiment demonstrates that the surviving composition is computationally implementable and internally coherent. It does not yet establish that the live Diamond Gate public surface is actually governed by this mechanism, nor does it establish novelty relative to all possible prior art.

## Next material boundary

Bind the entitlement engine to one non-critical public research claim in an isolated preview/public-test route and prove the full served-state loop:

`QUALIFIED -> induced evidence/provenance/reproduction failure -> automatically served HELD/CONTRADICTED -> attempted manual stronger presentation rejected -> repair without fresh qualification remains below QUALIFIED -> fresh qualification receipt -> served QUALIFIED restored`.

No production or canonical claim should be advanced until that served-state experiment passes.