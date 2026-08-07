export const DATA = {
  "lane": {
    "id": "pressure-and-capacity",
    "title": "Pressure & Capacity",
    "defaultRecord": "pressure-field",
    "defaultLens": "practical",
    "records": [
      {
        "id": "pressure-field",
        "title": "Pressure Field",
        "expression": "Π = G × X",
        "relationship": "Feeds the protected numerator used by the Pressure-to-Capacity Ratio.",
        "lenses": {
          "practical": {
            "introduction": "Pressure is treated as a declared multiplicative field. The practical question is not whether some pressure exists, but how much admitted pressure is acting under the frozen factor contract.",
            "subtabs": [
              {
                "id": "meaning",
                "title": "Meaning",
                "body": [
                  "How much pressure is acting?",
                  "Required weakness is not averaged away inside the declared multiplicative field."
                ]
              },
              {
                "id": "admission-boundary",
                "title": "Admission boundary",
                "body": [
                  "Every required pressure factor must be admitted and normalized before use.",
                  "Units, source class, factor dictionary, and normalizer remain explicit."
                ]
              },
              {
                "id": "use-boundary",
                "title": "Use boundary",
                "body": [
                  "No universal-default or post-hoc use is authorized.",
                  "A later empirical result cannot retroactively redefine the factor contract."
                ]
              }
            ]
          },
          "engineering": {
            "introduction": "The engineering lens exposes the formula, factor contract, and freeze requirement without claiming universal scale validity.",
            "subtabs": [
              {
                "id": "expression",
                "title": "Expression",
                "body": [
                  "Π = G × X",
                  "Π is computed only from declared normalized factors."
                ]
              },
              {
                "id": "factor-contract",
                "title": "Factor contract",
                "body": [
                  "G and X are placeholders for admitted pressure-factor groups defined by a domain-specific dictionary.",
                  "Missing required factors cannot be silently imputed."
                ]
              },
              {
                "id": "freeze-requirement",
                "title": "Freeze requirement",
                "body": [
                  "The factor dictionary and normalizers must be frozen before empirical execution.",
                  "The source does not authorize a universal factor dictionary."
                ]
              }
            ]
          },
          "evidence": {
            "introduction": "The evidence lens separates confirmed mathematical structure from unresolved empirical validity.",
            "subtabs": [
              {
                "id": "confirmed-structure",
                "title": "Confirmed structure",
                "body": [
                  "The formula and invocation boundary are source-confirmed.",
                  "The protected pressure field is a declared input to PCR."
                ]
              },
              {
                "id": "unresolved-validity",
                "title": "Unresolved validity",
                "body": [
                  "Predictive validity, calibration, and causal interpretation remain unresolved."
                ],
                "hold": "NOT ESTABLISHED"
              },
              {
                "id": "claim-ceiling",
                "title": "Claim ceiling",
                "body": [
                  "Formula confirmation does not establish an empirically ready instrument."
                ],
                "hold": "STRUCTURE CONFIRMED ONLY"
              }
            ]
          }
        }
      },
      {
        "id": "capacity-field",
        "title": "Usable Capacity",
        "expression": "K = P × R × A × C",
        "relationship": "Protects the denominator by preserving indispensable required factors and their zero behavior.",
        "lenses": {
          "practical": {
            "introduction": "Usable capacity asks what the system can actually carry after required preservation, recovery, adaptation, and control factors are admitted.",
            "subtabs": [
              {
                "id": "meaning",
                "title": "Meaning",
                "body": [
                  "What capacity is actually usable?",
                  "Nominal abundance is not equivalent to usable capacity."
                ]
              },
              {
                "id": "required-factor-admission",
                "title": "Required-factor admission",
                "body": [
                  "Every required capacity factor must be admitted and normalized.",
                  "Missing factors cannot be silently substituted."
                ]
              },
              {
                "id": "noncompensation",
                "title": "Noncompensation",
                "body": [
                  "Abundance elsewhere cannot compensate for an indispensable required factor at zero.",
                  "The multiplicative form preserves this boundary."
                ]
              }
            ]
          },
          "engineering": {
            "introduction": "The complete expression remains anchored while a selected term advances and its peers recede.",
            "subtabs": [
              {
                "id": "complete-expression",
                "title": "Complete expression",
                "body": [
                  "K = P × R × A × C",
                  "The complete expression remains visible during term inspection."
                ]
              },
              {
                "id": "term-contract",
                "title": "Term contract",
                "body": [
                  "P, R, A, and C are required factor identities.",
                  "Universal operational definitions, normalizers, and thresholds are domain-bound and unresolved."
                ],
                "hold": "DOMAIN-BOUND / UNRESOLVED"
              },
              {
                "id": "zero-behavior",
                "title": "Zero behavior",
                "body": [
                  "Any required factor at zero drives K to zero.",
                  "This is structural noncompensation, not an empirical threshold claim."
                ]
              }
            ]
          },
          "evidence": {
            "introduction": "The source confirms the required-factor structure but does not validate universal definitions, scales, or thresholds.",
            "subtabs": [
              {
                "id": "confirmed-structure",
                "title": "Confirmed structure",
                "body": [
                  "The formula and required-factor structure are source-confirmed."
                ]
              },
              {
                "id": "domain-bound-scale",
                "title": "Domain-bound scale",
                "body": [
                  "Definitions, normalization, thresholds, and calibration remain domain-bound."
                ],
                "hold": "UNRESOLVED"
              },
              {
                "id": "claim-ceiling",
                "title": "Claim ceiling",
                "body": [
                  "Structure confirmed does not mean scale validated or instrument empirically ready."
                ],
                "hold": "NO EMPIRICAL UPGRADE"
              }
            ]
          }
        },
        "terms": [
          {
            "id": "P",
            "title": "Preservation",
            "detail": "Preservation is a required factor identity. Its operational definition, normalization, and threshold remain domain-bound and unresolved."
          },
          {
            "id": "R",
            "title": "Recovery",
            "detail": "Recovery is a required factor identity. Its operational definition, normalization, and threshold remain domain-bound and unresolved."
          },
          {
            "id": "A",
            "title": "Adaptation",
            "detail": "Adaptation is a required factor identity. Its operational definition, normalization, and threshold remain domain-bound and unresolved."
          },
          {
            "id": "C",
            "title": "Control",
            "detail": "Control is a required factor identity. Its operational definition, normalization, and threshold remain domain-bound and unresolved."
          }
        ]
      },
      {
        "id": "pcr",
        "title": "Pressure-to-Capacity Ratio",
        "expression": "PCR = Π / max(K, εK)",
        "relationship": "Integrates admitted pressure and usable capacity while keeping zero-capacity safety semantics separate from the numerical ratio.",
        "lenses": {
          "practical": {
            "introduction": "The same pressure may be manageable or hazardous depending on usable capacity. The protected denominator prevents undefined division but does not make zero capacity safe.",
            "subtabs": [
              {
                "id": "meaning",
                "title": "Meaning",
                "body": [
                  "The same pressure can imply different risk when usable capacity differs."
                ]
              },
              {
                "id": "invocation-conditions",
                "title": "Invocation conditions",
                "body": [
                  "Π, K, and εK must be frozen before invocation.",
                  "The ratio is not lawfully invoked from post-hoc inputs."
                ]
              },
              {
                "id": "zero-capacity-boundary",
                "title": "Zero-capacity boundary",
                "body": [
                  "The denominator floor prevents undefined division.",
                  "It does not convert a zero-capacity state into a safe condition."
                ]
              }
            ]
          },
          "engineering": {
            "introduction": "The protected ratio retains the used denominator and SAFE_MODE status as observable, separate state.",
            "subtabs": [
              {
                "id": "protected-ratio",
                "title": "Protected ratio",
                "body": [
                  "PCR = Π / K_used",
                  "K_used = max(K, εK)"
                ]
              },
              {
                "id": "denominator-floor",
                "title": "Denominator floor",
                "body": [
                  "εK is a declared numerical floor.",
                  "Its value must be frozen and observable."
                ]
              },
              {
                "id": "safe-mode",
                "title": "SAFE_MODE separation",
                "body": [
                  "SAFE_MODE semantics remain distinct from the numerical ratio.",
                  "Required observable state includes factors, εK, floorUsed, and safeMode."
                ]
              }
            ]
          },
          "evidence": {
            "introduction": "The ratio is structurally specified. Calibration, thresholds, outcome relations, and causal interpretation remain unresolved.",
            "subtabs": [
              {
                "id": "formula-confirmed",
                "title": "Formula confirmed",
                "body": [
                  "The protected ratio and denominator-floor structure are source-confirmed."
                ]
              },
              {
                "id": "calibration-unresolved",
                "title": "Calibration unresolved",
                "body": [
                  "No validated universal threshold or outcome relation is established."
                ],
                "hold": "NOT ESTABLISHED"
              },
              {
                "id": "synthetic-determinism",
                "title": "Synthetic determinism only",
                "body": [
                  "Synthetic fixtures can test deterministic execution.",
                  "They do not establish empirical validity or cross-domain transfer."
                ],
                "hold": "NO EMPIRICAL CLAIM"
              }
            ]
          }
        }
      }
    ]
  },
  "lenses": [
    {
      "id": "practical",
      "title": "Practical"
    },
    {
      "id": "engineering",
      "title": "Engineering"
    },
    {
      "id": "evidence",
      "title": "Evidence"
    }
  ],
  "contentVersion": "METHODS_SPATIAL_DATABASE_CHECKPOINT_4_CONTENT_v1",
  "sourceVersion": "TEXT_FIRST_V2_RATIFIED"
};
