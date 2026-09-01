# Admissible History and Boundary Kernel (AHBK)

## Normative Specification v1.0

**Specification ID:** `AHBK_NORMATIVE_SPECIFICATION_v1`  
**Status:** `NORMATIVE_SPECIFICATION_COMPLETE`  
**Date:** `2026-09-01`  
**Scope:** Domain-neutral research kernel and non-executing C-MAPSS conformance binding  
**Construction boundary:** No Mars equations, cosmological equations, experiment execution, preregistration mutation, or empirical claim upgrade

---

## 1. Purpose

AHBK specifies a reusable research architecture for determining:

1. which candidate conditions may lawfully enter an investigation;
2. how a permitted candidate produces a history;
3. how that history is mapped to observations;
4. whether the candidate survives, fails, or cannot be interpreted;
5. which maximal-survival and minimal-failure frontiers are supported; and
6. what claims the resulting evidence entitles.

The governing form is:

\[
K=(\Omega,\preceq,A,\Phi,S,H,\Gamma).
\]

AHBK is a **research kernel**, not a universal physical law. Conformance permits domains to share types, invariants, boundary computations, receipts, and claim-control rules. It does not transfer equations, operators, parameters, causal mechanisms, empirical support, or scientific completion between domains.

The normative terms **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**, **SHOULD**, **SHOULD NOT**, and **MAY** are used in their ordinary standards sense.

---

## 2. Core type system

### 2.1 Candidate universe \(\Omega\)

For a realized AHBK investigation,

\[
\Omega=\{\omega_1,\ldots,\omega_n\}
\]

is a finite, versioned set of candidate identities. Every candidate MUST have:

```text
CandidateId       : stable unique identifier
CandidatePayload  : domain-defined immutable description
CandidateRole     : TEST | REFERENCE | CONTROL | CALIBRATION
PayloadDigest     : cryptographic digest of the frozen payload
```

Only candidates whose role is `TEST` participate in survival and failure frontiers. Reference, control, and calibration objects MAY be consumed by \(\Phi\), \(H\), or \(S\), but MUST NOT silently enter \(R^*\) or \(F_{\min}\).

An empty \(\Omega\) is representable but cannot produce experimental completion.

### 2.2 Partial order \(\preceq\)

\(\preceq\subseteq\Omega_T\times\Omega_T\) is a frozen burden, stress, or requirement order over the test subset \(\Omega_T\). The interpretation is:

\[
\omega_i\preceq\omega_j
\quad\Longleftrightarrow\quad
\omega_j\text{ is at least as demanding as }\omega_i
\]

under the domain's predeclared ordering law.

It MUST be:

- reflexive: \(\omega\preceq\omega\);
- antisymmetric: \(\omega_i\preceq\omega_j\land\omega_j\preceq\omega_i\Rightarrow\omega_i=\omega_j\);
- transitive: \(\omega_i\preceq\omega_j\land\omega_j\preceq\omega_k\Rightarrow\omega_i\preceq\omega_k\); and
- outcome-independent: no observed performance may define or alter it.

The order MAY be disconnected and MAY contain incomparable candidates. A scalarization is forbidden unless it is independently justified, predeclared, and incorporated into the frozen candidate definition before outcomes are available.

### 2.3 Admissibility bundle \(A\)

\(A\) is a staged bundle rather than a single Boolean:

\[
A=(A_{\mathrm{entry}},A_{\mathrm{observe}},A_{\mathrm{claim}}).
\]

Each stage is a finite indexed family of predicates returning:

```text
PASS | FAIL | UNRESOLVED
```

with a reason code, evidence reference, adjudicator identity, timestamp, and predicate-version digest.

- \(A_{\mathrm{entry}}\) determines whether \(\Phi\) may be invoked.
- \(A_{\mathrm{observe}}\) determines whether \(H\) may consume the produced history and protected measurement package.
- \(A_{\mathrm{claim}}\) determines whether \(\Gamma\) may construct empirical claims from the evaluation.

Define:

\[
\Omega_{\mathrm{entry}}
=
\{\omega\in\Omega_T:\forall a\in A_{\mathrm{entry}},\;a(\omega)=\mathrm{PASS}\}.
\]

A candidate with any `FAIL` or `UNRESOLVED` entry predicate MUST NOT enter \(\Phi\). It MUST remain in the output registry with its exact exclusion state; it may not be silently dropped.

Staging is normative. It allows an interpretable object failure during \(\Phi\) to remain a scientific `FAIL` even though later observation predicates cannot be satisfied. It also prevents invalid measurements or broken provenance from being relabeled as object failure.

### 2.4 History operator \(\Phi\)

\(\Phi\) is the domain-specific history constructor:

\[
\Phi:\Omega_{\mathrm{entry}}
\rightarrow
\mathcal X\uplus\mathcal F_{\Phi}\uplus\mathcal U_{\Phi}.
\]

Here:

- \(\mathcal X\) contains completed, frozen histories;
- \(\mathcal F_{\Phi}\) contains interpretable object failures occurring after lawful entry; and
- \(\mathcal U_{\Phi}\) contains histories whose meaning is unavailable because execution identity, custody, or provenance is invalid.

\(\Phi\) answers: **What happened to the permitted candidate through the declared process or evolution?**

It MUST NOT determine scientific survival by itself. A completed history is evidence input, not a survival conclusion.

### 2.5 Observation operator \(H\)

\(H\) is the domain-specific observation mapping:

\[
H:\mathcal X\times\mathcal M
\rightarrow
\mathcal Y\uplus\mathcal U_H,
\]

where \(\mathcal M\) is the protected measurement package, \(\mathcal Y\) is the observation record, and \(\mathcal U_H\) is a typed observation failure.

\(H\) answers: **What valid observable follows from the completed history and authorized measurement package?**

\(H\) MUST remain distinct from \(\Phi\). A domain MUST NOT conceal evolution, fitting, prediction, simulation, or state transition inside an observation label when those operations determine the history being evaluated. Measurement corruption, semantic invalidity, misalignment, prohibited leakage, or undefined observation mapping MUST return a typed uninterpretable result rather than `FAIL`.

### 2.6 Survival classifier \(S\)

Let \(\mathcal E\) be the sum type containing a completed observation record, an interpretable \(\Phi\)-failure, or a typed uninterpretable record. Then:

\[
S:\mathcal E
\rightarrow
\mathbb V_3,
\qquad
\mathbb V_3=
\{\mathrm{SURVIVE},\mathrm{FAIL},\mathrm{UNINTERPRETABLE}\}.
\]

The semantics are exact:

| Value | Normative meaning |
|---|---|
| `SURVIVE` | Lawful entry, interpretable execution and observation, every frozen survival requirement satisfied, and required provenance intact. |
| `FAIL` | Lawful entry followed by an interpretable object failure, or a valid observation that fails at least one frozen survival requirement. |
| `UNINTERPRETABLE` | No lawful survival judgment is available because measurement, semantic mapping, execution identity, custody, or provenance required for interpretation is invalid or unavailable. |

`UNINTERPRETABLE` is neither survival nor failure. It MUST NOT be coerced to a Boolean, imputed from neighboring candidates, replaced by a weaker result, or omitted from a frontier receipt.

For every candidate that enters \(\Phi\), the implementation MUST emit exactly one of the three values plus a reason record. Candidates excluded before \(\Phi\) have no \(S\)-value and remain first-class admissibility exclusions.

### 2.7 Claim-entitlement operator \(\Gamma\)

Let \(\mathcal C\) be a versioned claim language with a declared strength preorder \(\sqsubseteq\), where \(c_1\sqsubseteq c_2\) means that \(c_1\) is no stronger than \(c_2\). Then:

\[
\Gamma:\mathcal R\rightarrow\mathcal P(\mathcal C),
\]

where \(\mathcal R\) is the complete evidence-and-receipt bundle and \(\Gamma(\mathcal R)\) is the set of entitled claims.

The entitled set MUST be downward closed:

\[
c_2\in\Gamma(\mathcal R)\land c_1\sqsubseteq c_2
\Rightarrow c_1\in\Gamma(\mathcal R).
\]

The claim ceiling is set-valued:

\[
\Gamma_{\max}(\mathcal R)
=
\operatorname{Maximals}_{\sqsubseteq}\Gamma(\mathcal R).
\]

If no positive empirical claim is entitled, \(\Gamma_{\max}=\varnothing\) and the receipt MUST state why. A conformance claim is not an empirical survival claim.

---

## 3. Required invariants

An AHBK implementation is structurally conformant only if all of the following hold.

### 3.1 Identity and immutability

1. Every candidate, predicate, operator, survival rule, claim rule, and evidence object has a stable identity and digest.
2. The candidate universe, order, admissibility law, survival criteria, claim language, and claim ceiling template are frozen before protected outcomes are accessed.
3. Any post-freeze alteration creates a new version and cannot inherit the earlier completion receipt.

### 3.2 Separation

1. Admissibility is adjudicated without using performance outcomes forbidden at that phase.
2. \(\Phi\) and \(H\) have separate identities, inputs, outputs, and receipts.
3. Measurement validity is adjudicated before survival classification.
4. Survival classification precedes frontier computation.
5. Frontier computation precedes empirical claim construction.

### 3.3 Completeness and preservation

1. Every \(\omega\in\Omega_T\) appears in exactly one top-level registry state: excluded, entered-but-uninterpretable, survived, or failed.
2. No negative, incomparable, disconnected, nonmonotone, or uninterpretable result may be discarded.
3. Empty sets MUST be serialized as empty sets or arrays, never as missing fields, zero candidates, or implicit success.
4. Secondary metrics MUST NOT override the frozen primary survival law.

### 3.4 Claim discipline

1. Claims MUST be scoped to the exact candidate family, object, operator, observations, and completed evidence.
2. Evidence from one domain MUST NOT entitle a claim in another domain.
3. Structural conformance MUST NOT be described as experimental completion.
4. A fit or correspondence MUST NOT be upgraded to uniqueness, causation, constitutive mechanism, or origin without separate evidence that entitles that claim.

---

## 4. Boundary objects

Let \(\sigma(\omega)\) be the emitted \(S\)-value for each entered test candidate.

Define:

\[
V=\{\omega\in\Omega_{\mathrm{entry}}:\sigma(\omega)=\mathrm{SURVIVE}\},
\]

\[
F=\{\omega\in\Omega_{\mathrm{entry}}:\sigma(\omega)=\mathrm{FAIL}\}.
\]

The authoritative frontier sets are:

\[
R^*
=
\operatorname{Maximals}_{\preceq}(V)
=
\{v\in V:\nexists v'\in V\text{ with }v\prec v'\},
\]

\[
F_{\min}
=
\operatorname{Minimals}_{\preceq}(F)
=
\{f\in F:\nexists f'\in F\text{ with }f'\prec f\}.
\]

Neither object is presumed unique. Both are sets, including when they contain one element.

### 4.1 Exact meanings of \(I\), \(N\), and \(U\)

#### Incomparability object \(I\)

\[
I=
\left\{
\{\omega_i,\omega_j\}\in\binom{\Omega_{\mathrm{entry}}}{2}:
\omega_i\npreceq\omega_j\land\omega_j\npreceq\omega_i
\right\}.
\]

\(I\) is a set of unordered candidate pairs with order certificates. Incomparability is not generally transitive, so implementations MUST NOT report "incomparability classes" unless an independently defined equivalence relation exists.

#### Nonmonotonicity object \(N\)

Under the declared interpretation that greater order means no less demanding:

\[
N=
\left\{
(\omega_i,\omega_j):
\omega_i\prec\omega_j,
\sigma(\omega_i)=\mathrm{FAIL},
\sigma(\omega_j)=\mathrm{SURVIVE}
\right\}.
\]

\(N\) is a set of ordered witness pairs. It records an observed reversal of the expected survival monotonicity. It MUST be reported without smoothing, interpolation, threshold repair, or candidate deletion. Uninterpretable values do not themselves constitute nonmonotonicity; they belong to \(U\).

#### Uninterpretability object \(U\)

\[
U:
\{\omega\in\Omega_{\mathrm{entry}}:\sigma(\omega)=\mathrm{UNINTERPRETABLE}\}
\rightharpoonup
\mathcal R_U
\]

is a finite partial map from every uninterpretable candidate to a typed reason record. \(\mathcal R_U\) MUST distinguish at least:

```text
MEASUREMENT_INVALID
SEMANTIC_MAPPING_INVALID
EXECUTION_IDENTITY_INVALID
CUSTODY_INVALID
PROVENANCE_INVALID
OTHER_PREDECLARED_UNINTERPRETABLE
```

Each record MUST identify the failed interpretability requirement and supporting evidence. `OBJECT_FAILURE` is forbidden as a \(U\)-reason because lawful, interpretable object failure belongs to `FAIL`.

---

## 5. Normative frontier computation

For a finite realized candidate set, an implementation MUST compute frontiers by order comparison, not by list position or scalar rank.

```text
V := every entered TEST candidate classified SURVIVE
F := every entered TEST candidate classified FAIL

R_star := {v in V | no v2 in V satisfies v < v2}
F_min  := {f in F | no f2 in F satisfies f2 < f}

I := every unordered pair {x,y} of entered TEST candidates
     for which neither x <= y nor y <= x

N := every ordered pair (x,y) of entered TEST candidates
     for which x < y, S(x)=FAIL, and S(y)=SURVIVE

U := every entered TEST candidate classified UNINTERPRETABLE,
     mapped to its complete typed reason record
```

The computation receipt MUST include the canonical candidate order, the classifications consumed, the comparison results sufficient to reproduce each frontier, and the output digest.

---

## 6. Edge-case semantics

| Case | Required treatment |
|---|---|
| Empty \(\Omega_T\) | Emit `EMPTY_CANDIDATE_SPACE`; all boundary sets are empty; experimental completion is false. |
| No entry-admissible candidates | Emit `NO_ENTRY_ADMISSIBLE_CANDIDATES`; preserve every failed or unresolved predicate; no survival claim. |
| No survivors | \(R^*=\varnothing\); compute \(F_{\min}\) normally; no positive survival claim. |
| No failures | \(F_{\min}=\varnothing\); compute \(R^*\) normally; do not claim an unobserved failure boundary. |
| All candidates uninterpretable | \(R^*=F_{\min}=\varnothing\); \(U\) contains every entered candidate; experimental completion is false unless the preregistered objective explicitly permits an all-uninterpretable completion, which C-MAPSS does not. |
| All candidates incomparable | Every surviving candidate is in \(R^*\); every failed candidate is in \(F_{\min}\); \(I\) preserves every incomparable pair. |
| Disconnected poset | Compute within the full order; component-local maximal/minimal elements remain in the union; record all connected components of the undirected comparability graph. |
| Nonmonotone result | Preserve \(N\), \(R^*\), and \(F_{\min}\) exactly; no scalar threshold may replace them. |
| Nominal maximum uninterpretable | Preserve it in \(U\); no weaker candidate may substitute unless a pre-outcome selection law explicitly authorized that substitution. |
| Partial observation coverage | Emit all observed classifications and all missing obligations; experimental completion depends on the frozen coverage law, not convenience. |
| Invalid or cyclic order | Structural conformance fails; frontier output is unauthorized. |
| Duplicate candidate identity | Structural conformance fails until identity collision is resolved by a new version. |
| Unresolved admissibility | Candidate remains excluded with `UNRESOLVED`; it cannot be treated as failure or uninterpretability because \(\Phi\) was never lawfully entered. |

---

## 7. Required output schema

Every conformant realization MUST emit a machine-readable object equivalent to:

```yaml
ahbk_output:
  specification:
    id: string
    version: string
    digest: string
  binding:
    id: string
    domain: string
    object_under_test: string
    preregistration_id: string | null
    digest: string
  status:
    structural_conformance: PASS | FAIL
    execution_authorization: AUTHORIZED | PROHIBITED | NOT_APPLICABLE
    experimental_completion: COMPLETE | UNCOMPLETED | INVALID
    claim_entitlement: ENTITLED | NOT_ENTITLED | PARTIAL
    reason_codes: [string]
  candidates:
    test: [CandidateRecord]
    support: [CandidateRecord]
    excluded: [AdmissibilityExclusionRecord]
  order:
    relation_digest: string
    comparable_pairs: [OrderedPair]
    incomparable_pairs: [UnorderedPair]
    disconnected_components: [[CandidateId]]
    invariant_receipt: ReceiptRef
  evaluations:
    evaluation_state: NOT_EVALUATED | PARTIAL | COMPLETE
    classifications: [ClassificationRecord]
    survive_set: [CandidateId]
    fail_set: [CandidateId]
    uninterpretable_map: [UninterpretableRecord]
    missing_obligations: [ObligationRecord]
  boundaries:
    R_star: [CandidateId]
    F_min: [CandidateId]
    I: [UnorderedPair]
    N: [OrderedPair]
    U: [UninterpretableRecord]
  claims:
    language_id: string
    entitled_claims: [ClaimRecord]
    claim_ceiling: [ClaimRecord]
    forbidden_claims: [ClaimRecord]
    claim_receipt: ReceiptRef | null
  provenance:
    receipts: [ReceiptRef]
    deviations: [DeviationRecord]
    final_receipt_digest: string | null
```

The arrays for \(R^*\), \(F_{\min}\), \(I\), \(N\), and \(U\) are REQUIRED even when empty. When `evaluation_state` is `NOT_EVALUATED`, empty arrays mean that no empirical classifications yet exist; they MUST NOT be interpreted as observed empty boundary sets.

---

## 8. Claim-ceiling construction

The claim process MUST proceed in this order:

1. validate specification and binding identity;
2. validate candidate and partial-order invariants;
3. adjudicate staged admissibility;
4. validate \(\Phi\) identity and history custody;
5. validate \(H\), measurement identity, and interpretability;
6. apply \(S\) without modification;
7. compute \(R^*\), \(F_{\min}\), \(I\), \(N\), and \(U\);
8. check every preregistered coverage and provenance obligation;
9. enumerate candidate claims in the frozen claim language;
10. exclude every claim whose required evidence is absent;
11. compute the maximal entitled set \(\Gamma_{\max}\); and
12. issue the claim-ceiling receipt.

The claim-ceiling receipt MUST contain:

- exact specification, binding, preregistration, candidate, order, \(\Phi\), \(H\), and \(S\) identities;
- all boundary sets and their digests;
- the evidence requirements for every ceiling claim;
- explicit forbidden or unsupported stronger claims;
- all deviations, negative results, nonmonotone witnesses, and uninterpretable records;
- the adjudicator or authorized process identity;
- timestamp, version, parent receipts, and cryptographic digest; and
- an explicit declaration that no cross-domain evidence transfer occurred.

A missing claim-ceiling receipt means empirical completion is unestablished even if calculations exist.

---

## 9. Conformance versus experimental completion

### 9.1 Structural conformance

A binding is `STRUCTURALLY_CONFORMANT` when:

1. every kernel type has an exact domain binding;
2. the partial order passes all invariants;
3. admissibility is staged and outcome-independent;
4. \(\Phi\), \(H\), \(S\), and \(\Gamma\) have non-overlapping declared roles;
5. `SURVIVE`, `FAIL`, and `UNINTERPRETABLE` have executable or formally adjudicable semantics;
6. set-valued frontiers and \(I,N,U\) are preserved;
7. edge cases have declared outputs;
8. the required output schema can be populated; and
9. the binding introduces no domain equation, threshold, claim, or evidence not authorized by its source protocol.

Structural conformance does not authorize execution and does not establish an empirical result.

### 9.2 Experimental completion

A binding is `EXPERIMENTALLY_COMPLETE` only when, in addition to structural conformance:

1. every prerequisite freeze condition is satisfied;
2. execution was authorized before it began;
3. the declared blind or protected-outcome sequence was followed;
4. all mandatory candidates and measurements were adjudicated under the frozen coverage law;
5. raw outcomes, histories, predictions, classifications, and required secondary measurements are preserved;
6. no disqualifying provenance failure occurred;
7. the boundary receipt is reproducible; and
8. the final claim-ceiling receipt exists.

An execution may be `INVALID` rather than merely `UNCOMPLETED` when a protected sequence or frozen rule was violated.

---

## 10. Non-executing C-MAPSS binding

### 10.1 Binding identity and authority

```text
Binding ID:
  AHBK_CMAPSS_RESILIENCE_BINDING_v1

Source protocol:
  RESILIENCE_PREREGISTERED_STRONGEST_ATTACK_FD001_M3_v1

Source status:
  CONSTRUCTION_COMPLETE_NOT_FROZEN

Source execution disposition:
  DO_NOT_EXECUTE_AS_PREREGISTERED_BRIDGE_TEST

Object under test:
  FD001_M3_ADDITIVE_FACTORIAL_INFERENCE_PROCEDURE_v1
```

This section maps the source protocol into AHBK without changing, freezing, executing, completing, or reinterpreting it. The source preregistration remains authoritative if any paraphrase here is ambiguous.

### 10.2 Type binding

| AHBK type | C-MAPSS binding |
|---|---|
| \(\Omega_T\) | \(\{A1/FD003,A2/FD002,A3/FD004\}\) |
| Support object | `A0/FD001`, reference baseline and same-dataset age comparator source; not fresh bridge evidence and not frontier-eligible |
| Candidate payload | Frozen dataset identity plus operating-condition and fault-mode counts |
| \(\preceq\) | Componentwise order on `(operating conditions, fault modes)` |
| \(A_{\mathrm{entry}}\) | Source requirements 1–5: file authenticity and hashes; 26-column schema and ordering; outcome isolation; alignment verifiability without outcome values; hashed implementation and environment identity |
| \(A_{\mathrm{observe}}\) | Source requirements 6–7: training-only admission/preprocessing/CV/fitting and one finite frozen prediction per test engine, plus authorized outcome access and valid measurement alignment |
| \(A_{\mathrm{claim}}\) | Full preregistration conformity, custody sequence, preserved raw artifacts and required metrics, boundary adjudication, and claim-ceiling receipt |
| \(\Phi\) | Reapply the frozen M3 transport procedure using training predictors only; fit the same-dataset age comparator; generate and freeze unclipped test predictions and all required model artifacts |
| \(H\) | After authorized outcome access, combine frozen predictions with valid true-RUL measurements to compute RMSE, `RI`, the paired-bootstrap interval, and mandatory preserved secondary metrics |
| \(S\) | Frozen materiality and uncertainty decision, with interpretable object failure preserved as `FAIL` and invalid measurement/provenance preserved as `UNINTERPRETABLE` |
| \(\Gamma\) | Source outcome table, exact maximum-positive-claim text, exclusions, Resilience standing, and final claim-ceiling receipt |

The staged binding resolves, without modifying the source, the source distinction between:

- pre-history requirements whose failure blocks lawful entry;
- factor-admission, feature, fitting, or prediction failure after source requirements 1–5, which is `FAIL/OBJECT_FAILURE`; and
- invalid true-RUL measurement or broken protected provenance, which is `UNINTERPRETABLE` with a typed reason and cannot count as object failure.

### 10.3 Frozen order

```text
A1 = FD003 = (1 operating condition, 2 fault modes)
A2 = FD002 = (6 operating conditions, 1 fault mode)
A3 = FD004 = (6 operating conditions, 2 fault modes)
```

Therefore:

\[
A1\prec A3,\qquad A2\prec A3,
\]

while \(A1\) and \(A2\) are incomparable. No scalar ordering is introduced. `FD003 -> FD002 -> FD004` remains the source's frozen execution order; that linear execution order does not replace the partial order.

The pre-outcome selection law remains unchanged:

- \(A3\) is the nominal strongest attack;
- if \(A3\) is source-inadmissible before outcome access, the strongest admissible frontier is \(\{A1,A2\}\), with both required for survival;
- if exactly one frontier member is admissible, it becomes \(A^*\); and
- if \(A3\) becomes uninterpretable only after outcome authorization, no weaker result substitutes.

### 10.4 Frozen survival semantics

For each attack \(a\), the source defines:

\[
RI(a)=
\frac{RMSE_{\mathrm{age}}(a)-RMSE_{\mathrm{M3}}(a)}
{RMSE_{\mathrm{age}}(a)}.
\]

The paired-bootstrap procedure remains 10,000 engine-level resamples with seed `20260811`.

The AHBK classification is:

```text
SURVIVE
  iff execution and measurement are admissible,
      every test engine has one finite frozen prediction,
      RI(a) >= 0.02,
      and the paired-bootstrap 95% lower bound is > 0.

FAIL
  iff lawful source requirements permit object adjudication and either
      an interpretable object failure occurs after entry, or
      a valid preregistration-conformant observation fails the frozen
      survival requirement.

UNINTERPRETABLE
  iff no lawful object-survival judgment is available because the true-RUL
      measurement, semantic alignment, custody, execution identity, or
      required provenance is invalid or unavailable.
```

MAE, Spearman rho, calibration slope, calibration intercept, and mean error remain mandatory secondary measurements and cannot override \(S\).

### 10.5 C-MAPSS frontier objects

When lawful results eventually exist, the binding SHALL compute:

\[
R^*=\operatorname{Maximals}_{\preceq}
\{a\in\Omega_{\mathrm{entry}}:S(a)=\mathrm{SURVIVE}\},
\]

\[
F_{\min}=\operatorname{Minimals}_{\preceq}
\{a\in\Omega_{\mathrm{entry}}:S(a)=\mathrm{FAIL}\}.
\]

For the frozen poset, \(I\) MUST at minimum preserve the pair \(\{A1,A2\}\). \(N\) and \(U\) are result-dependent and currently empty only in the sense of **not yet evaluated**; they MUST NOT be reported as observed empty empirical sets before execution. The required output SHALL therefore set `evaluation_state: NOT_EVALUATED` and serialize the required boundary arrays as empty.

### 10.6 Claim binding

The source's maximum positive claim remains exactly:

> The frozen FD001 M3 additive factorial-temporal inference procedure retained materially positive remaining-useful-life predictive utility under the strongest admissible preregistered C-MAPSS heterogeneity attack.

It is a ceiling template, not a presently entitled result.

The binding forbids upgrading any future result into validation of:

- the multiplicative IMI operator;
- a universal coherence law;
- causal or constitutive relations;
- route restoration or structural collapse;
- hospital ranking or clinical use;
- Track B;
- the `256/192/3/451` architecture; or
- robustness outside the frozen attack family.

### 10.7 Present conformance verdict

```yaml
binding: AHBK_CMAPSS_RESILIENCE_BINDING_v1
structural_conformance: PASS
execution_authorization: PROHIBITED
experimental_completion: UNCOMPLETED
claim_entitlement: NOT_ENTITLED
source_status: CONSTRUCTION_COMPLETE_NOT_FROZEN
source_disposition: DO_NOT_EXECUTE_AS_PREREGISTERED_BRIDGE_TEST
evaluation_state: NOT_EVALUATED
R_star: []
F_min: []
I:
  - [A1, A2]
N: []
U: []
```

Structural conformance is supported because the source protocol supplies a finite candidate family, a valid componentwise partial order, staged admissibility conditions, separated history and observation roles, a frozen three-valued classification binding, set-valued boundary rules, a bounded claim template, explicit exclusions, and a protected receipt sequence.

Experimental completion remains unestablished because the source freeze gate still requires:

1. exact FD002, FD003, and FD004 predictor hashes;
2. registered outcome-custody identities without revealing values;
3. an attached execution-environment lock;
4. independently verified transport-code hashes;
5. a preregistration freeze receipt covering the document, machine manifest, verifier, and required input registries;
6. an authorized non-blocking repository AI-entry disposition;
7. the frozen blind execution and preserved results; and
8. the final boundary and claim-ceiling receipt.

No item in this list is satisfied merely by this structural binding.

---

## 11. Lawful stopping point

This construction stops at:

\[
\boxed{
\text{AHBK normative specification complete}
\;+
\text{C-MAPSS structurally conformant}
}
\]

The present statuses are:

```text
AHBK:
  NORMATIVE_SPECIFICATION_COMPLETE

C-MAPSS:
  STRUCTURALLY_CONFORMANT
  EXPERIMENTALLY_UNCOMPLETED
  EXECUTION_PROHIBITED
  CLAIM_NOT_ENTITLED

Mars:
  OUT_OF_SCOPE_FOR_THIS_CONSTRUCTION

Cosmology:
  OUT_OF_SCOPE_FOR_THIS_CONSTRUCTION

Relativistic dynamics:
  NOT_DERIVED
  NOT_TRANSFERRED
```

No empirical result, Resilience bridge closure, Mars frontier, cosmological correspondence, or relativistic mechanism is created by this specification.

---

## 12. Normative closure statement

AHBK v1 is complete as a specification target when its types, invariants, three-valued survival semantics, set-valued frontiers, first-class \(I,N,U\), edge cases, output schema, receipt requirements, and conformance distinction are all fixed as above.

The C-MAPSS preregistration is structurally conformant to that specification while remaining scientifically and procedurally uncompleted. Any successor work MUST preserve that separation.
