# EPISTEMIC_CONTROL_PLANE_INTAKE_v1

**Mode:** Intake · Non-drift · Evidence governance  
**Status:** ACTIVE_INTAKE  
**Program:** Multidomain State / Trajectory Validation Framework  
**Primary proving ground:** Cardiovascular system

## 1. Intake purpose

Bring the current research program under explicit epistemic governance before additional construction, testing, or claim escalation.

The control plane does not decide truth by authority.

It governs:
- what is currently known,
- what is hypothesized,
- what evidence supports each claim,
- what evidence is still missing,
- what promotion gates must be passed,
- what claims must be downgraded, quarantined, or rejected.

## 2. Intake objects

### OBJECT_1 — Validation architecture

Current state:
**LOCKED_ARCHITECTURE**

Claim:
A reusable experimental architecture can test whether multidimensional state and trajectory representations add predictive value beyond simpler alternatives.

Required next evidence:
- successful execution in a concrete domain,
- comparator performance,
- calibration,
- temporal validation,
- external validation,
- replication.

### OBJECT_2 — Cardiac mapping

Current state:
**DOMAIN_MAPPING_PROVISIONAL**

Claim:
Cardiovascular variables such as GLS, BNP/NT-proBNP, troponin, HRV, stroke volume, cardiac output, blood pressure, remodeling, and recovery trajectories may provide a useful multidimensional longitudinal test bed.

Required next evidence:
- exact variable definitions,
- inclusion/exclusion criteria,
- temporal windows,
- normalization rules,
- missing-data rules,
- locked endpoint,
- locked prediction horizon.

### OBJECT_3 — Trajectory hypothesis

Current state:
**MODELING_HYPOTHESIS**

Claim:
Longitudinal trajectories may contain useful predictive information beyond isolated measurements.

Required test:
- Model A: latest observation only
- Model B: conventional clinical baseline
- Model C: longitudinal variables without proposed architecture
- Model D: proposed state/trajectory architecture

Promotion gate:
Model D must reproducibly add useful predictive value beyond B and C.

### OBJECT_4 — Burden / pressure / integrity constructs

Current state:
**MODELING_HYPOTHESIS**

Claim:
Latent constructs may provide a useful state representation.

Constraint:
They are not physiological mechanisms by default.

Promotion requires:
- reproducible domain mapping,
- ablation support,
- biological/physical interpretability where claimed,
- independent evidence for mechanism.

### OBJECT_5 — Collapse

Current state:
**UNDEFINED_AS_EMPIRICAL_ENDPOINT**

Constraint:
"Collapse" cannot function as a confirmatory endpoint.

Required action:
Replace it with a prospectively defined measurable endpoint or validated composite.

### OBJECT_6 — Universality

Current state:
**QUARANTINED_HYPOTHESIS**

Claim boundary:
One successful domain does not establish universality.

Promotion requires:
- independent mapping in multiple domains,
- domain-native comparator testing,
- replication,
- evidence that the shared architecture adds value beyond domain-specific methods.

## 3. Epistemic state vocabulary

Allowed states:

- LOCKED_ARCHITECTURE
- ENGINEERED
- MODELING_HYPOTHESIS
- DOMAIN_MAPPING_PROVISIONAL
- PREDICTIVE_ASSOCIATION
- TEMPORALLY_VALIDATED
- EXTERNALLY_VALIDATED
- REPLICATED
- MECHANISTIC_HYPOTHESIS
- MECHANISTIC_EVIDENCE
- CAUSAL_EVIDENCE
- REJECTED
- FALSIFIED
- QUARANTINED_HYPOTHESIS
- REQUIRES_REPLICATION

No claim may skip intermediate states merely because the architecture is coherent.

## 4. Promotion law

A claim changes state only when a predefined evidence gate is satisfied.

Examples:

RETROSPECTIVE_SIGNAL
→ PREDICTIVE_ASSOCIATION

PREDICTIVE_ASSOCIATION + unseen temporal validation
→ TEMPORALLY_VALIDATED

TEMPORALLY_VALIDATED + independent external cohort
→ EXTERNALLY_VALIDATED

EXTERNALLY_VALIDATED + independent repeat confirmation
→ REPLICATED

REPLICATED predictive performance
≠ MECHANISTIC_EVIDENCE

MECHANISTIC_EVIDENCE
≠ CAUSAL_EVIDENCE

## 5. Demotion law

Claims must be downgraded when:

- comparator advantage disappears,
- calibration fails,
- temporal validation fails,
- external validation fails,
- ablation removes the apparent value,
- the result depends on post hoc thresholding,
- leakage is discovered,
- missing-data handling drives performance,
- replication fails.

## 6. Comparator authority

The proposed architecture may not evaluate itself against weak controls.

Minimum comparator set:

A — latest observation only  
B — conventional clinical baseline  
C — ordinary longitudinal modeling  
D — proposed architecture

Central kill rule:

If D does not reproducibly improve useful prediction over B and C by a predefined meaningful margin, a central empirical claim fails.

## 7. Claim boundary

Currently admissible:

> A falsifiable framework for testing whether multidimensional state and trajectory representations contain reproducible predictive information about deterioration, stability, and recovery beyond conventional measurements and simpler longitudinal models.

Currently inadmissible:

- universal diagnostic law
- discovered cardiovascular mechanism
- causal explanation
- clinically proven collapse prediction
- cross-domain validity without independent validation

## 8. Construction gate

Allowed next construction:

- cardiac variable mapping
- endpoint definition
- prediction-horizon definition
- comparator specification
- normalization specification
- missing-data specification
- ablation plan
- calibration plan
- temporal validation plan
- external cohort plan
- preregistration artifact

Not allowed:

- claim escalation
- universality language as fact
- mechanism language as fact
- outcome claims before validation

## 9. Intake disposition

**PROGRAM_ADMITTED_TO_EPISTEMIC_CONTROL_PLANE = TRUE**

Current highest evidence state:
**LOCKED_ARCHITECTURE**

Current highest empirical state:
**NOT_YET_VALIDATED**

Next deterministic gate:
**CARDIAC_PREREGISTRATION_AND_DOMAIN_MAPPING_v1**
