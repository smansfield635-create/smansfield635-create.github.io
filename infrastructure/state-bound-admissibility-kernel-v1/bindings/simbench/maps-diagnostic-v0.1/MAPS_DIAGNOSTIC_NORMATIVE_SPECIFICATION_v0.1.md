# MAPS Diagnostic Normative Specification v0.1

**Instrument ID:** `MAPS_DIAGNOSTIC_v0.1`  
**Binding ID:** `MAPS_SIMBENCH_BINDING_v0.1`  
**Status:** `SOURCE_DEFINITION_COMPLETE_NOT_FROZEN`  
**Date:** `2026-09-01`  
**First development domain:** SimBench `1-HV-urban--0-sw`  
**Governing architecture:** `AHBK_NORMATIVE_SPECIFICATION_v1`  
**Parent protocol:** `SIMBENCH_LVTG_KERNEL_INCREMENTAL_VALUE_PREREGISTRATION_v1`  
**Execution disposition:** `PARENT_EXPERIMENT_DO_NOT_EXECUTE`

## 1. Identity and lawful boundary

`MAPS` is retained as the historical label of the proposed four-component
diagnostic interface. This specification does not invent a canonical expansion
of that label.

The emitted bundle is

\[
\mathcal D_K(t)=\left\{
E_{\mathrm{sup}}(t),
C_{\mathrm{coh}}(t),
\mathcal H_{\mathrm{ent}}(t),
\varphi_{\mathrm{phase}}(t)
\right\}.
\]

This is a new prospective instrument. It is not recovered prior authority and
does not inherit formulas, parameters, mechanisms, or empirical support from
Mars, cosmology, C-MAPSS, hospitals, agriculture, London, Paris, or IEEE RTS24.

MAPS v0.1 is a secondary SimBench measurement operator. It does not:

- define or modify LVTG or VOER;
- select PROBE or CHALLENGE transitions;
- adjudicate AC physical viability;
- use a CHALLENGE identity or outcome;
- define the primary target, baseline, materiality threshold, or claim decision;
- emit an AHBK `SURVIVE` or `FAIL` classification; or
- authorize the parent SimBench experiment to execute.

The exact AHBK authority digest is
`1c61a7101763dd39815b76b3dc71e9b6767c3be42f511860f572af73b343f297`.
The exact parent-preregistration digest is
`a7e9efbebee04c351bd8808f81acf054ce550ccf85cb08ea85c5b1bee2be1a3b`.

## 2. Operator role

For MAPS, the upstream SimBench BASE/PROBE evolution is part of AHBK's history
operator \(\Phi\). MAPS is a protected observation suboperator:

\[
H_{\mathrm{MAPS}}:
(X_{\mathrm{BASE}}(t-1),X_{\mathrm{BASE}}(t),
X_{\mathrm{PROBE}}(t))
\rightarrow
\mathcal D_K(t)\uplus\mathcal U_{\mathrm{MAPS}}.
\]

It maps already-adjudicated BASE and PROBE records to measurements. It never
runs a power flow, changes a transition, or reclassifies physical viability.

## 3. Frozen input types

At each canonical 15-minute index \(t\), the input MUST contain:

1. a stable ordered bus registry \(\mathcal B=(b_1,\ldots,b_n)\), \(n\ge2\);
2. a stable ordered PROBE registry \(\mathcal P=(p_1,\ldots,p_m)\), \(m\ge2\);
3. a frozen phase-reference bus \(r\in\mathcal B\);
4. valid BASE AC bus-voltage magnitudes and angles at \(t-1\) and \(t\);
5. requested active demand \(D_0(t)>0\) from the BASE lane;
6. for every PROBE identity, exactly one upstream result:
   `VIABLE`, `PHYSICAL_FAILURE`, or `NONINTERPRETABLE_SIMULATION`; and
7. for each `VIABLE` PROBE, served active demand, nonnegative active loss,
   bus-voltage magnitudes, and bus-voltage angles in the canonical bus order.

Permitted physical fields map to pandapower semantics as follows:

| MAPS field | Required upstream meaning |
|---|---|
| `voltage_pu` | AC bus voltage magnitude, p.u. |
| `angle_degree` | AC bus voltage angle, degrees |
| `requested_demand_mw` | frozen BASE active demand request, MW |
| `served_demand_mw` | active demand actually served in the viable PROBE state, MW |
| `active_loss_mw` | total nonnegative active-network loss in the viable PROBE state, MW |

The exact extraction tables and summation law MUST be frozen in the parent
SimBench source/environment binding. This instrument supplies an adapter for an
already-solved network but does not choose that binding.

Every field whose name contains `challenge`, case-insensitively, is forbidden at
any nesting depth. Input is also invalid unless `lane` is exactly
`BASE_PROBE_ONLY` and provenance declares only `BASE` and `PROBE` source lanes.

## 4. Common numerical conventions

Angles are converted to radians before computation. Define

\[
\operatorname{wrap}(x)=((x+\pi)\bmod 2\pi)-\pi\in[-\pi,\pi).
\]

All sums use the canonical registry order. All real inputs MUST be finite.
Machine-tolerance clipping is permitted only within `1e-12` of a declared
closed range. There is no learned normalization, imputation, outcome-dependent
deletion, rescaling, or post-development substitution.

## 5. Energy-support diagnostic

For PROBE \(p\), let \(v_p=1\) when its upstream status is `VIABLE` and
\(v_p=0\) when it is `PHYSICAL_FAILURE`.

For a viable PROBE, define delivery fraction and delivery efficiency:

\[
d_p(t)=\frac{D_p(t)}{D_0(t)},
\qquad
\eta_p(t)=
\begin{cases}
\frac{D_p(t)}{D_p(t)+L_p(t)},&D_p(t)+L_p(t)>0,\\
0,&D_p(t)+L_p(t)=0,
\end{cases}
\]

where \(0\le D_p\le D_0\) and \(L_p\ge0\). Define the safe-delivery support
contribution

\[
e_p(t)=v_p\,d_p(t)\eta_p(t).
\]

The component is

\[
\boxed{
E_{\mathrm{sup}}(t)=\frac1m\sum_{p\in\mathcal P}e_p(t)
}
\]

with unit `1` and range \([0,1]\). An interpretable physical failure contributes
zero safe-delivery support; it is not treated as missing data.

## 6. Phasor-coherence diagnostic

Let the complex AC bus-voltage vector of the BASE state be

\[
z_0(t)=\left(V_{0b}(t)e^{i\theta_{0b}(t)}\right)_{b\in\mathcal B},
\]

and define \(z_p(t)\) analogously for a viable PROBE. Its global-phase-invariant
phasor agreement with BASE is

\[
c_p(t)=
\frac{|z_0(t)^*z_p(t)|}
{\lVert z_0(t)\rVert_2\lVert z_p(t)\rVert_2}.
\]

The component is

\[
\boxed{
C_{\mathrm{coh}}(t)=
\frac1m\sum_{p\in\mathcal P}v_p c_p(t)
}
\]

with unit `1` and range \([0,1]\). A physical failure contributes zero viable
phasor coherence. Uniform global phase rotation and uniform voltage scaling do
not change \(c_p\).

## 7. Support-distribution entropy

If \(A(t)=\sum_p e_p(t)>0\), define

\[
\pi_p(t)=\frac{e_p(t)}{A(t)}
\]

and

\[
\boxed{
\mathcal H_{\mathrm{ent}}(t)=
-\frac{\sum_{p\in\mathcal P}\pi_p(t)\log\pi_p(t)}{\log m}
}
\]

with the convention \(0\log0=0\). If \(A(t)=0\), define
\(\mathcal H_{\mathrm{ent}}(t)=0\). The unit is `1` and range is \([0,1]\).
The denominator is the full frozen PROBE count, including physical failures, so
support concentrated on a shrinking subset cannot be reported as maximally
distributed.

## 8. Temporal voltage-phase increment

For each bus, remove the arbitrary global phase using the frozen reference bus:

\[
\tilde\theta_b(t)=
\operatorname{wrap}(\theta_{0b}(t)-\theta_{0r}(t)).
\]

Define

\[
\delta_b(t)=
\operatorname{wrap}(\tilde\theta_b(t)-\tilde\theta_b(t-1)).
\]

The component is

\[
\boxed{
\varphi_{\mathrm{phase}}(t)=
\sqrt{\frac1n\sum_{b\in\mathcal B}\delta_b(t)^2}
}
\]

with unit `rad` and range \([0,\pi]\). It uses one 15-minute BASE lookback and
is invariant to independent global reference-angle shifts at \(t-1\) and \(t\).

## 9. Missingness and uninterpretability

The bundle is atomic. Either all four values are valid or all four are `null`.

| Condition | Required result |
|---|---|
| Upstream `PHYSICAL_FAILURE` | retain the PROBE; use zero contributions in Sections 5 and 6; not missing |
| Any `NONINTERPRETABLE_SIMULATION` | whole bundle `UNINTERPRETABLE`; no failed-PROBE substitution |
| Invalid or missing BASE state | `UNINTERPRETABLE` |
| Missing lookback | `UNINTERPRETABLE` with `INSUFFICIENT_LOOKBACK` |
| Forbidden CHALLENGE-named field | `UNINTERPRETABLE` with `PROHIBITED_CHALLENGE_FIELD` |
| Duplicate, missing, extra, or reordered PROBE identity | `UNINTERPRETABLE` |
| Bus registry mismatch or nonfinite AC field | `UNINTERPRETABLE` |
| \(D_0\le0\), \(D_p<0\), \(D_p>D_0\), or \(L_p<0\) outside tolerance | `UNINTERPRETABLE` |
| Every PROBE is a physical failure | valid bundle with \(E=C=H=0\); phase remains measured from valid BASE history |

Typed categories follow AHBK observation semantics:
`MEASUREMENT_INVALID`, `SEMANTIC_MAPPING_INVALID`,
`EXECUTION_IDENTITY_INVALID`, `CUSTODY_INVALID`, and `PROVENANCE_INVALID`.
No uninterpretable record may be converted to a physical failure.

## 10. Temporal feature support

The parent protocol supplies MAPS to model arms as the current value and the
same frozen 96-step history treatment applied to the arm's permitted inputs.
MAPS v0.1 does not choose lags, rolling summaries, scaling, model families, or
time splits. The first time index without a lawful predecessor cannot emit a
MAPS row.

## 11. Deterministic implementation and receipts

The normative executable is `maps_diagnostic.py`; its only supported command
surface is `ai_entry.py`. The implementation MUST:

- accept UTF-8 JSON conforming to the input schema;
- reject nonfinite JSON numbers;
- preserve canonical registry order;
- emit every required status, value, unit, range, count, formula identity, and
  reason field;
- hash the raw input bytes and canonical output bytes with SHA-256;
- issue a computation receipt with source and configuration digests; and
- pass all packaged conformance tests before source-binding admission.

Canonical JSON for receipts is UTF-8 encoded Python JSON with sorted keys,
compact separators, Unicode preserved, and NaN/Infinity prohibited. The Python
runtime identity MUST be pinned by the parent environment manifest before
experimental freeze.

## 12. SimBench adapter boundary

`simbench_maps_adapter.py` extracts MAPS state records only from already-solved
pandapower network objects. It consumes an upstream viability classification.
It MUST NOT run `runpp`, choose a solver, open a line, select a PROBE, or decide
whether a state is viable. Adapter configuration, eligible result tables, stable
element identities, and package versions remain parent-freeze dependencies.

## 13. Claim language and ceiling

Before any protected outcome access, the maximum construction claim is:

> MAPS Diagnostic v0.1 is a deterministic, source-defined secondary
> measurement operator for frozen SimBench BASE and PROBE records.

That is a conformance claim, not an empirical result.

Only after the parent protocol is frozen, executed in its protected order, and
the corrected secondary decision law passes may the parent claim:

> The frozen MAPS diagnostic bundle contained incremental held-out predictive
> information within the specified SimBench experiment.

No result may claim that MAPS is physically fundamental, uniquely explanatory,
causal, universal, cross-domain validated, or evidence that energy, coherence,
entropy, or phase was newly discovered.

## 14. Present status and lawful stopping point

MAPS v0.1 may reach `SOURCE_DEFINITION_COMPLETE` after its specification, code,
schemas, fixtures, tests, manifest, and verification receipt agree by digest.
That closes only the parent checklist item “exact MAPS diagnostic definitions
and SHA-256 attached.”

The parent experiment remains:

```text
STATUS = CONSTRUCTION_COMPLETE_NOT_FROZEN
EXECUTION = DO_NOT_EXECUTE
CLAIM_ENTITLEMENT = NONE
```

Repository adoption also remains open until the canonical repository AI entry
can satisfy its full-checkout, operation-intake, routing, and project-authority
requirements and return an authentic command-emitted receipt.

