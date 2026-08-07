# Axioms, derivation, and theorem

## Definitions

Let `X` be a system observed at time `t` under an identity criterion `I`.

- `K_I` is the finite set of capacities required by criterion `I`.
- `R^I_k` is the finite set of routes admissible for producing required capacity `k`.
- `E(r)` is the set of required relations in route `r`.
- `q_e(t)` is the admitted integrity state of relation `e`.
- `a_I(r,t)` is the admissibility state of route `r` for identity criterion `I`, including provenance, substitution, external-support, lineage, and reentry restrictions.
- `∧` and `∨` are meet and join in the declared evidence lattice.
- `INVALID > UNEVALUABLE > NUMERIC` governs evidence precedence before numerical evaluation.

## Frozen axioms

### A1 — Identity requirement

An identity criterion is operational only if every capacity in `K_I` remains lawfully reachable.

### A2 — Route conjunction

A route is operational only if every relation declared required for that route is operational. Unrelated strength cannot compensate for a missing required relation within the route.

### A3 — Alternative-route disjunction

A required capacity remains reachable if at least one route in `R^I_k` is operational and admissible.

### A4 — Admissibility and provenance

A route that produces visible output but violates the declared identity criterion, provenance requirement, support rule, substitution rule, lineage rule, or reentry rule does not establish identity continuity.

### A5 — Boundary explicitness

The system boundary, required capacities, routes, and admissibility criterion must be declared before target outcome access. Silent post-result boundary or route repair is prohibited.

### A6 — Temporal continuity

Trajectory is change in the same identity-conditioned coherence object through time. A route-label, factor-version, evidence-definition, or boundary change invalidates direct temporal subtraction unless an explicit correspondence is frozen.

### A7 — Restoration

Restoration requires reopening an admissible identity-bearing route and satisfying any frozen reentry condition. Improved output or component score alone is insufficient.

### A8 — Fail-closed evidence

Invalid or unevaluable required evidence cannot be silently converted into a numerical coherence value.

## Derivation

By A2, route state is the meet of its admissibility gate and all required relation states:

\[
Q_I(r,t)=a_I(r,t)\wedge\bigwedge_{e\in E(r)}q_e(t).
\]

By A3, capacity reachability is the join across admissible alternative routes:

\[
G_I(k,t)=\bigvee_{r\in R^I_k}Q_I(r,t).
\]

By A1, identity-conditioned coherence is the meet across required capacities:

\[
\boxed{
\mathcal C_I(X,t)
=
\bigwedge_{k\in K_I}
\bigvee_{r\in R^I_k}
\left[
a_I(r,t)
\wedge
\bigwedge_{e\in E(r)}q_e(t)
\right]
}.
\]

The expression is therefore not selected by empirical curve fitting. It is the normal-form composition of the frozen route semantics.

## Numeric representation

When relation evidence is represented on `[0,1]` and meet/join use the Gödel lattice:

\[
\boxed{
C_I(X,t)
=
\min_{k\in K_I}
\max_{r\in R^I_k}
\min\left(a_I(r,t),\min_{e\in E(r)}q_e(t)\right)
}.
\]

A monotone order-preserving reparameterization may alter the displayed scale without changing the lattice ordering or logical result. It may not change route topology or compensation rules.

## Corollaries

### Noncompensation

If every admissible route for one required capacity contains a failed required relation, that capacity and therefore identity-conditioned coherence fail regardless of unrelated capacity magnitude.

### Lawful substitution

A substitute preserves the tested identity only when it belongs to the predeclared admissible route set for that identity criterion.

### Supported continuity

It is possible that:

\[
C_{output}(X,t)>0
\quad\text{and}\quad
C_I(X,t)=0.
\]

Visible output may therefore continue while original identity-conditioned coherence is absent.

### Restoration and hysteresis

Restoring a relation is necessary but not sufficient whenever route admissibility also requires clearance of a latched or hysteretic state.

### Product special case

A product may approximate soft conjunction inside a single predeclared route. It is not the universal topology. A global product is valid only under the restrictive special case that all included factors belong to one simultaneous series dependency and no lawful parallel routes, unrelated capacities, support distinctions, or identity distinctions exist.

### Additive-average failure

An average permits strength in unrelated elements to offset a required collapse, violating A2 and A1. It may be retained as a comparator or descriptive statistic, not as the definition of coherence.

## Theorem status

`FORMAL_THEOREM = ESTABLISHED_CONDITIONALLY_ON_AXIOMS_AND_ADMITTED_INPUT_STRUCTURE`

`UNIVERSAL_EMPIRICAL_PREMISES = OPEN`

The theorem proves what follows from the axioms. It does not prove that independent observers can recover the correct `K_I`, `R^I_k`, `E(r)`, or `a_I(r,t)` in every domain. That is the active severe empirical test.
