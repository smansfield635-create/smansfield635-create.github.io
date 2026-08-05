export const MODEL_ROUTING = Object.freeze({
  "questionIntentRoutes": [
    {
      "intent": "WHAT_CONSTITUTES_THE_COMPLETE_STRUCTURE",
      "recordIds": [
        "envelope-451"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHAT_MUST_SATURATE",
      "recordIds": [
        "gate-448"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "CAN_STRENGTH_COMPENSATE_FOR_REQUIRED_FAILURE",
      "recordIds": [
        "spine-minimum",
        "zero-aware"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "IS_COLLAPSE_FORMALLY_QUALIFIED",
      "recordIds": [
        "collapse-qualified"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHAT_MAY_ENTER_THE_MODEL",
      "recordIds": [
        "membrane-61",
        "no-match"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHAT_IS_OUTSIDE_THE_COLLAPSE_SUM",
      "recordIds": [
        "membrane-61",
        "anchors-9"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_IS_PRESSURE_CONSTRUCTED",
      "recordIds": [
        "pressure-field"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_IS_USABLE_CAPACITY_CONSTRUCTED",
      "recordIds": [
        "capacity-field"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_DO_PRESSURE_AND_CAPACITY_COMPARE",
      "recordIds": [
        "pcr"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_ARE_STABILITY_AND_HAZARD_BOUNDED",
      "recordIds": [
        "stability",
        "hazard",
        "complement"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHERE_DID_MATERIAL_GO",
      "recordIds": [
        "mass-ledger",
        "residual-u",
        "closure-threshold"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "IS_THE_OPERATING_LOOP_COMPLETE",
      "recordIds": [
        "energy-loop",
        "useful-output"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_SHOULD_RESEARCH_BE_ORIENTED",
      "recordIds": [
        "first",
        "integral-method"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHICH_DIAGNOSTIC_PROCEDURE_APPLIES",
      "recordIds": [
        "diagnostic-five",
        "abcd"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "HOW_CAN_THE_CLAIM_BE_DISPROVED",
      "recordIds": [
        "falsification"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    },
    {
      "intent": "WHAT_DO_SYNTHETIC_TESTS_ESTABLISH",
      "recordIds": [
        "fixtures"
      ],
      "selectionRule": "RETURN_ALL_LAWFULLY_RELEVANT_RECORDS_WITH_DEPENDENCY_CONTEXT"
    }
  ],
  "holds": [
    {
      "holdId": "HOLD_SOURCE_GATE_448",
      "recordIds": [
        "gate-448"
      ],
      "reason": "ORIGINAL_CONTROLLING_SOURCE_UNDER_RECOVERY",
      "releaseEvidence": "RECOVERED_HASH_BOUND_SOURCE_OR_GOVERNANCE_ACCEPTED_EQUIVALENT"
    },
    {
      "holdId": "HOLD_SOURCE_MEMBRANE_61",
      "recordIds": [
        "membrane-61"
      ],
      "reason": "EXACT_ORIGINAL_ADMISSIBILITY_SEMANTICS_UNDER_RECOVERY",
      "releaseEvidence": "RECOVERED_HASH_BOUND_SOURCE"
    },
    {
      "holdId": "HOLD_SOURCE_ANCHORS_9",
      "recordIds": [
        "anchors-9"
      ],
      "reason": "EXACT_BASIN_ANCHOR_SEMANTICS_UNDER_RECOVERY",
      "releaseEvidence": "RECOVERED_HASH_BOUND_SOURCE"
    },
    {
      "holdId": "HOLD_DOMAIN_BINDINGS",
      "recordIds": [
        "spine-minimum",
        "collapse-qualified",
        "pressure-field",
        "capacity-field",
        "pcr",
        "mass-ledger",
        "closure-threshold",
        "useful-output"
      ],
      "reason": "DOMAIN_FACTORS_NORMALIZERS_THRESHOLDS_AND_UNCERTAINTIES_NOT_FROZEN",
      "releaseEvidence": "VERSIONED_DOMAIN_ROUTE_AND_HELD_OUT_TEST_PLAN"
    },
    {
      "holdId": "HOLD_METHOD_RELATION",
      "recordIds": [
        "diagnostic-five",
        "abcd"
      ],
      "reason": "CONCEPTUAL_OVERLAP_DOES_NOT_ESTABLISH_DERIVATION_OR_EQUIVALENCE",
      "releaseEvidence": "SOURCE_CROSSWALK_AND_GOVERNANCE_DECISION"
    },
    {
      "holdId": "HOLD_EMPIRICAL_STATUS",
      "recordIds": [
        "envelope-451",
        "gate-448",
        "spine-minimum",
        "collapse-qualified",
        "membrane-61",
        "anchors-9",
        "pressure-field",
        "capacity-field",
        "pcr",
        "stability",
        "hazard",
        "complement",
        "zero-aware",
        "mass-ledger",
        "residual-u",
        "closure-threshold",
        "energy-loop",
        "useful-output",
        "first",
        "integral-method",
        "diagnostic-five",
        "abcd",
        "falsification",
        "no-match",
        "fixtures"
      ],
      "reason": "FORMAL_AND_FIXTURE_STATUS_DOES_NOT_ESTABLISH_EMPIRICAL_VALIDATION",
      "releaseEvidence": "ROUTE_SPECIFIC_HELD_OUT_REAL_DATA_EVIDENCE"
    }
  ]
});
