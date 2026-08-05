export const RECORDS_2 = Object.freeze([
  {
    "id": "mass-ledger",
    "title": "Industrial Closure Equation",
    "family": "closure",
    "equationOrProcedure": "M_in = M_out + M_dest + DeltaM_inv +/- epsilon",
    "sourceState": "confirmed",
    "formalType": "CONSERVATION_BALANCE",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_MEASUREMENT_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_ADMITTED_MASS_DISPOSITION_MUST_BE_RECONCILED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "residual-u",
    "title": "Unaccounted Residual",
    "family": "closure",
    "equationOrProcedure": "U = M_in - (M_out + M_dest + DeltaM_inv)",
    "sourceState": "confirmed",
    "formalType": "DERIVED_RESIDUAL",
    "computationalBoundary": {
      "classification": "COMPUTABLE_FROM_LEDGER_TERMS",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "AFTER_COMMON_BASIS_LEDGER_TERMS_ARE_FROZEN",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "closure-threshold",
    "title": "Closure Threshold",
    "family": "closure",
    "equationOrProcedure": "Closed if |U| <= 3epsilon; Open if |U| > 3epsilon",
    "sourceState": "confirmed",
    "formalType": "THRESHOLD_CLASSIFIER",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_UNCERTAINTY_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "AFTER_U_AND_EPSILON_ARE_FROZEN",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "energy-loop",
    "title": "Energy Loop Law",
    "family": "closure",
    "equationOrProcedure": "Storage -> Release -> Operate -> Recover -> Storage",
    "sourceState": "confirmed",
    "formalType": "PROCEDURAL_CYCLE",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_SEQUENCE_UNLESS_OPERATIONALIZED",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_LOOP_COMPLETENESS_AND_RETURN_TO_STORAGE_ARE_BEING_ASSESSED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "useful-output",
    "title": "Useful Output Condition",
    "family": "closure",
    "equationOrProcedure": "Useful_Output >= Total_Input + Losses + Reset_Costs",
    "sourceState": "confirmed",
    "formalType": "ACCOUNTING_INEQUALITY",
    "computationalBoundary": {
      "classification": "COMPUTABLE_AFTER_ACCOUNTING_BOUNDARY_BINDING",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "WHEN_FULL_LOOP_INPUT_LOSS_AND_RESET_COSTS_SHARE_ONE_ACCOUNTING_BOUNDARY",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "first",
    "title": "F.I.R.S.T. Research Method",
    "family": "method",
    "equationOrProcedure": "Flow -> Integrity -> Reality -> Structure -> Test",
    "sourceState": "confirmed",
    "formalType": "ORDERED_RESEARCH_ORIENTATION",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_METHOD",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_A_RESEARCH_QUESTION_REQUIRES_FLOW_INTEGRITY_REALITY_STRUCTURE_AND_TEST_REVIEW",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "integral-method",
    "title": "Integral Scientific Method",
    "family": "method",
    "equationOrProcedure": "Observe -> Reduce -> Falsify -> Iterate -> Terminate -> Compress",
    "sourceState": "confirmed",
    "formalType": "ORDERED_FALSIFICATION_METHOD",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_METHOD",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_A_CLAIM_MUST_BE_REDUCED_FALSIFIED_ITERATED_AND_TERMINATED_OBJECTIVELY",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "diagnostic-five",
    "title": "Five-Diagnostic Classification Set",
    "family": "method",
    "equationOrProcedure": "C.A.D. ; C.T.D. ; C.F.D. ; I.M.D. ; T.D.",
    "sourceState": "confirmed",
    "formalType": "FIXED_DIAGNOSTIC_SET",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_UNTIL_RULES_BOUND",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_THE_FIVE_FROZEN_DIAGNOSTIC_LENSES_HAVE_APPLICABLE_RULES_AND_EVIDENCE",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "abcd",
    "title": "A-B-C-D Diagnostic Procedure",
    "family": "method",
    "equationOrProcedure": "A -> B -> C -> D",
    "sourceState": "confirmed",
    "formalType": "ORDERED_DIAGNOSTIC_PROCEDURE",
    "computationalBoundary": {
      "classification": "NONCOMPUTATIONAL_UNTIL_RULES_BOUND",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_ORDERED_INTERNAL_COHERENCE_CONSTRAINT_FRAGMENTATION_AND_TRAJECTORY_REVIEW_IS_REQUIRED",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "falsification",
    "title": "Formal Falsification Path",
    "family": "method",
    "equationOrProcedure": "Define -> Measure -> Freeze -> Score -> Compare",
    "sourceState": "confirmed",
    "formalType": "FALSIFICATION_PROTOCOL",
    "computationalBoundary": {
      "classification": "MIXED_PROCEDURAL_AND_COMPUTATIONAL",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_A_TRAJECTORY_OR_NARROWING_CLAIM_IS_READY_FOR_PRE_FROZEN_DISCONFIRMATION",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "no-match",
    "title": "No-Match Discipline",
    "family": "method",
    "equationOrProcedure": "No match => no consumption",
    "sourceState": "confirmed",
    "formalType": "EPISTEMIC_ADMISSION_RULE",
    "computationalBoundary": {
      "classification": "COMPUTABLE_WHEN_MATCH_PREDICATES_BOUND",
      "executionReadiness": "NOT_EMPIRICALLY_READY"
    },
    "invocationCondition": "BEFORE_CONSUMING_EVIDENCE_THAT_MAY_NOT_SATISFY_APPLICABILITY_CONDITIONS",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  },
  {
    "id": "fixtures",
    "title": "Synthetic Fixtures",
    "family": "method",
    "equationOrProcedure": "Fixture pass != empirical validation",
    "sourceState": "confirmed",
    "formalType": "TEST_EVIDENCE_BOUNDARY",
    "computationalBoundary": {
      "classification": "COMPUTATIONAL_TEST_CONTRACT",
      "executionReadiness": "NOT_APPLICABLE_OR_REQUIRES_OPERATIONALIZATION"
    },
    "invocationCondition": "WHEN_DETERMINISTIC_CONTRACT_BEHAVIOR_MUST_BE_TESTED_WITHOUT_EMPIRICAL_PROMOTION",
    "doNotInvokeAs": "UNIVERSAL_DEFAULT_OR_POST_HOC_JUSTIFICATION",
    "causalStatus": "UNRESOLVED"
  }
]);
