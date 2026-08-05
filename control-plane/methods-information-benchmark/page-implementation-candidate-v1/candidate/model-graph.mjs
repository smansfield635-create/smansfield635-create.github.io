export const MODEL_GRAPH = Object.freeze({
  "edges": [
    {
      "from": "gate-448",
      "to": "envelope-451",
      "relation": "NESTED_CARDINALITY_SUBSTRUCTURE",
      "confidence": "STRONGLY_SUPPORTED"
    },
    {
      "from": "spine-minimum",
      "to": "envelope-451",
      "relation": "STRUCTURALLY_INCLUDED_OPERATIONALLY_SEPARATE",
      "confidence": "STRONGLY_SUPPORTED"
    },
    {
      "from": "collapse-qualified",
      "to": "gate-448",
      "relation": "REQUIRES_SATURATION_GATE",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "collapse-qualified",
      "to": "spine-minimum",
      "relation": "REQUIRES_WEAKEST_SPINE_TEST",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "pcr",
      "to": "pressure-field",
      "relation": "NUMERATOR_DEPENDENCY",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "pcr",
      "to": "capacity-field",
      "relation": "DENOMINATOR_DEPENDENCY",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "stability",
      "to": "pcr",
      "relation": "DERIVED_FROM",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "hazard",
      "to": "pcr",
      "relation": "DERIVED_FROM",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "complement",
      "to": "stability",
      "relation": "IDENTITY_COMPONENT",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "complement",
      "to": "hazard",
      "relation": "IDENTITY_COMPONENT",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "zero-aware",
      "to": "pressure-field",
      "relation": "GOVERNS_REQUIRED_ZERO_SEMANTICS",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "zero-aware",
      "to": "capacity-field",
      "relation": "GOVERNS_REQUIRED_ZERO_SEMANTICS",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "residual-u",
      "to": "mass-ledger",
      "relation": "DERIVED_FROM_LEDGER_TERMS",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "closure-threshold",
      "to": "residual-u",
      "relation": "CLASSIFIES",
      "confidence": "DIRECTLY_DECLARED"
    },
    {
      "from": "useful-output",
      "to": "energy-loop",
      "relation": "CONSTRAINS_CYCLE_COMPLETENESS",
      "confidence": "STRONGLY_SUPPORTED"
    }
  ],
  "explicitNonedges": [
    {
      "from": "membrane-61",
      "to": "envelope-451",
      "relation": "EXPLICITLY_EXCLUDED_FROM_STRUCTURAL_SUM"
    },
    {
      "from": "anchors-9",
      "to": "envelope-451",
      "relation": "EXPLICITLY_EXCLUDED_FROM_STRUCTURAL_SUM"
    },
    {
      "from": "diagnostic-five",
      "to": "abcd",
      "relation": "NO_CANONICAL_DERIVATION_ESTABLISHED_CONCEPTUAL_OVERLAP_ONLY"
    },
    {
      "from": "first",
      "to": "integral-method",
      "relation": "NO_CANONICAL_DERIVATION_ESTABLISHED_PARALLEL_METHODS"
    }
  ]
});
