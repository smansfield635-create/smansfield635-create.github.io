export const RECORDS_1 = Object.freeze([
  {
    "id": "envelope-451",
    "title": "451 Structural Envelope",
    "family": "structure",
    "equationOrProcedure": "451 = 256 + 192 + 3",
    "sourceState": "confirmed",
    "formalType": "STRUCTURAL_CARDINALITY_IDENTITY",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_ARCHITECTURE",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_THE_COMPLETE_DECLARED_STRUCTURAL_MEASUREMENT_ENVELOPE_MUST_BE_DESCRIBED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "gate-448",
    "title": "448 Saturation Gate",
    "family": "structure",
    "equationOrProcedure": "448 = 256 + 192",
    "sourceState": "hold",
    "formalType": "SATURATION_CARDINALITY_IDENTITY",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_ARCHITECTURE",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_EXACT_INTERNAL_PLUS_EXTERNAL_SATURATION_IS_BEING_DISTINGUISHED_FROM_SPINE_FAILURE",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "spine-minimum",
    "title": "E / I / V Minimum Principle",
    "family": "structure",
    "equationOrProcedure": "W_d = min(E_d, I_d, V_d)",
    "sourceState": "confirmed",
    "formalType": "NONCOMPENSATORY_MINIMUM_OPERATOR",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_DOMAIN_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_REQUIRED_AXIS_FAILURE_MUST_REMAIN_NONCOMPENSATORY",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "collapse-qualified",
    "title": "Qualified Collapse Predicate",
    "family": "structure",
    "equationOrProcedure": "CollapseQualified_d = (B256_d >= 256) AND (P192_d >= 192) AND (min(E_d,I_d,V_d) <= epsilon_d)",
    "sourceState": "confirmed",
    "formalType": "CONJUNCTIVE_BOOLEAN_PREDICATE",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_DOMAIN_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_ALL_COLLAPSE_QUALIFICATION_CLAUSES_ARE_FROZEN_AND_EVALUATED_AT_ONE_STATE",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "membrane-61",
    "title": "61 Admissibility Membrane",
    "family": "structure",
    "equationOrProcedure": "61 not-in 451",
    "sourceState": "hold",
    "formalType": "SET_EXCLUSION_AND_ADMISSION_BOUNDARY",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_ARCHITECTURE",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_ADMISSIBILITY_OF_A_SOURCE_MAPPING_THRESHOLD_OR_CLAIM_MUST_BE_DECIDED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "anchors-9",
    "title": "Nine Basin Anchors",
    "family": "structure",
    "equationOrProcedure": "9 not-in 451",
    "sourceState": "hold",
    "formalType": "SET_EXCLUSION_AND_ORIENTATION_ARCHITECTURE",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_ARCHITECTURE",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_BASIN_ORIENTATION_IS_REQUIRED_WITHOUT_CHANGING_THE_COLLAPSE_SUM",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "pressure-field",
    "title": "Pressure Field",
    "family": "pressure",
    "equationOrProcedure": "Pi = G * X",
    "sourceState": "confirmed",
    "formalType": "MULTIPLICATIVE_KERNEL",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_FACTOR_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_ALL_REQUIRED_PRESSURE_FACTORS_ARE_ADMITTED_AND_NORMALIZED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "capacity-field",
    "title": "Usable Capacity",
    "family": "pressure",
    "equationOrProcedure": "K = P * R * A * C",
    "sourceState": "confirmed",
    "formalType": "MULTIPLICATIVE_KERNEL",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_FACTOR_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_ALL_REQUIRED_CAPACITY_FACTORS_ARE_ADMITTED_AND_NORMALIZED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "pcr",
    "title": "Pressure-to-Capacity Ratio",
    "family": "pressure",
    "equationOrProcedure": "PCR = Pi / max(K, epsilon_K)",
    "sourceState": "confirmed",
    "formalType": "PROTECTED_RATIO_TRANSFORM",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_FACTOR_AND_FLOOR_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_PRESSURE_AND_CAPACITY_ARE_AVAILABLE_AND_EPSILON_K_IS_FROZEN",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "stability",
    "title": "Stability Complement",
    "family": "pressure",
    "equationOrProcedure": "S* = 1 / (1 + PCR)",
    "sourceState": "confirmed",
    "formalType": "BOUNDED_MONOTONE_TRANSFORM",
    "computationalBoundary": {
      "classification": "COMPUTABLE_FROM_PCR",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_A_BOUNDED_STABILITY_VIEW_OF_PCR_IS_REQUIRED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "hazard",
    "title": "Hazard Complement",
    "family": "pressure",
    "equationOrProcedure": "H* = PCR / (1 + PCR)",
    "sourceState": "confirmed",
    "formalType": "BOUNDED_MONOTONE_TRANSFORM",
    "computationalBoundary": {
      "classification": "COMPUTABLE_FROM_PCR",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_A_BOUNDED_HAZARD_VIEW_OF_PCR_IS_REQUIRED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "complement",
    "title": "Stability-Hazard Identity",
    "family": "pressure",
    "equationOrProcedure": "S* + H* = 1",
    "sourceState": "confirmed",
    "formalType": "COMPLEMENT_IDENTITY",
    "computationalBoundary": {
      "classification": "COMPUTABLE_INVARIANT_CHECK",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_ARITHMETIC_CONSISTENCY_OF_STABILITY_AND_HAZARD_MUST_BE_TESTED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "zero-aware",
    "title": "Zero-Aware Multiplication",
    "family": "pressure",
    "equationOrProcedure": "required zero => product = 0",
    "sourceState": "confirmed",
    "formalType": "NUMERICAL_SEMANTIC_RULE",
    "computationalBoundary": {
      "classification": "COMPUTATIONAL_IMPLEMENTATION_RULE",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "BEFORE_ANY_LOG_DOMAIN_PRODUCT_IMPLEMENTATION_OR_ZERO_SENSITIVE_AGGREGATION",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  }
]);
