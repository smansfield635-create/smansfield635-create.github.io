export const CONTENT_VERSION = 'METHODS_CONTEXT_DISPLACEMENT_ENGINE_MINIMUM_SPATIAL_PROOF_v1.0.0';

export const LENSES = Object.freeze([
  { id: 'practical', label: 'Practical', short: 'Use' },
  { id: 'engineering', label: 'Engineering', short: 'Build' },
  { id: 'evidence', label: 'Evidence / empirical', short: 'Prove' }
]);

export const STAGES = Object.freeze([
  {
    id: 'pressure-capacity',
    ordinal: 1,
    title: 'Pressure & Capacity',
    kicker: 'Multiplicative state mechanics',
    description: 'Three connected objects describe pressure, usable capacity, and the protected ratio between them.',
    accent: 'amber',
    models: [
      {
        id: 'pressure-field',
        title: 'Pressure Field',
        notation: 'Π = G × X',
        sourceState: 'confirmed',
        relationship: 'feeds PCR numerator',
        lenses: {
          practical: {
            eyebrow: 'Practical reading',
            title: 'How much pressure is acting on the system?',
            body: 'Use the pressure field only after every required pressure factor has been admitted and normalized. The product keeps required weakness visible instead of allowing unrelated strength to compensate for it.',
            footer: 'Do not invoke as a universal default or post-hoc justification.'
          },
          engineering: {
            eyebrow: 'Engineering definition',
            title: 'Multiplicative kernel',
            body: 'Formal type: MULTIPLICATIVE_KERNEL. Computational boundary: computable after factor binding. Π becomes the numerator of PCR and remains undefined as an empirical measure until its factors, units, and normalizers are frozen.',
            footer: 'Execution readiness: NOT_EMPIRICALLY_READY.'
          },
          evidence: {
            eyebrow: 'Evidence posture',
            title: 'Formula confirmed; empirical validity unresolved',
            body: 'The record is source-confirmed within the Methods corpus. That confirmation establishes the declared formula and invocation boundary, not predictive validity, causal interpretation, or cross-domain calibration.',
            footer: 'Causal status: UNRESOLVED.'
          }
        }
      },
      {
        id: 'capacity-field',
        title: 'Usable Capacity',
        notation: 'K = P × R × A × C',
        sourceState: 'confirmed',
        relationship: 'protects PCR denominator',
        lenses: {
          practical: {
            eyebrow: 'Practical reading',
            title: 'What capacity is actually usable?',
            body: 'Capacity is treated as a required-factor product. It is invoked only after all required capacity factors are admitted and normalized.',
            footer: 'A missing required factor cannot be silently replaced.'
          },
          engineering: {
            eyebrow: 'Engineering definition',
            title: 'Multiplicative capacity kernel',
            body: 'Formal type: MULTIPLICATIVE_KERNEL. Computational boundary: computable after factor binding. K is consumed by the protected PCR denominator.',
            footer: 'Execution readiness: NOT_EMPIRICALLY_READY.'
          },
          evidence: {
            eyebrow: 'Evidence posture',
            title: 'Declared structure, not validated capacity scale',
            body: 'The formula and source state are confirmed, while empirical factor definitions and calibration remain outside this proof.',
            footer: 'Causal status: UNRESOLVED.'
          }
        }
      },
      {
        id: 'pcr',
        title: 'Pressure-to-Capacity Ratio',
        notation: 'PCR = Π / max(K, εK)',
        sourceState: 'confirmed',
        relationship: 'integrates pressure and capacity',
        fullyPopulated: true,
        lenses: {
          practical: {
            eyebrow: 'Practical lens',
            title: 'Read pressure relative to the capacity available to absorb it',
            body: 'PCR is used when pressure and capacity are both available and the denominator floor εK has been frozen. A lower ratio indicates more capacity relative to pressure; a higher ratio indicates pressure is consuming more of the usable capacity envelope. The protected denominator prevents an undefined divide-by-zero result, but it does not make a zero-capacity state safe.',
            callout: 'Use PCR to compare the active burden with the capacity that can actually be used—not with nominal capacity that has not been admitted.',
            footer: 'Invocation: pressure and capacity available; εK frozen.'
          },
          engineering: {
            eyebrow: 'Engineering lens',
            title: 'Protected ratio transform with an explicit denominator floor',
            body: 'Formal type: PROTECTED_RATIO_TRANSFORM. Computational boundary: COMPUTABLE_AFTER_FACTOR_AND_FLOOR_BINDING. Inputs are Π = G × X and K = P × R × A × C. The implementation must preserve required zeros, bind εK before evaluation, record whether the floor was used, and expose SAFE_MODE or equivalent zero-capacity semantics rather than treating max(K, εK) as ordinary capacity.',
            callout: 'Required state: { pressureFactors, capacityFactors, epsilonK, floorUsed, safeMode, contentVersion }.',
            footer: 'Execution readiness in the source record: NOT_EMPIRICALLY_READY.'
          },
          evidence: {
            eyebrow: 'Evidence / empirical lens',
            title: 'Mathematical record confirmed; empirical calibration remains bounded',
            body: 'The Methods corpus confirms the formula, source state, formal type, and invocation condition. It does not establish that any particular factor dictionary, normalization scheme, εK value, threshold, outcome relationship, or causal interpretation is empirically valid. Synthetic fixtures can test deterministic behavior without upgrading the measure to empirical validation.',
            callout: 'Confirmed formula ≠ validated instrument ≠ causal model.',
            footer: 'Causal status: UNRESOLVED. No universal-default use authorized.'
          }
        }
      }
    ]
  },
  {
    id: 'method-falsification',
    ordinal: 2,
    title: 'Method & Falsification',
    kicker: 'Ordered research discipline',
    description: 'Three procedural objects orient inquiry, reduction, falsification, and comparison without becoming universal defaults.',
    accent: 'cyan',
    models: [
      {
        id: 'first',
        title: 'F.I.R.S.T. Research Method',
        notation: 'Flow → Integrity → Reality → Structure → Test',
        sourceState: 'confirmed',
        relationship: 'orients research entry',
        lenses: {
          practical: {
            eyebrow: 'Practical reading',
            title: 'Begin by following the system before judging it',
            body: 'Use F.I.R.S.T. when a research question requires review of flow, integrity, reality, structure, and test in that order.',
            footer: 'Ordered orientation, not a universal default.'
          },
          engineering: {
            eyebrow: 'Engineering definition',
            title: 'Noncomputational method sequence',
            body: 'Formal type: ORDERED_RESEARCH_ORIENTATION. The sequence requires domain-specific operationalization before execution can be automated.',
            footer: 'Execution readiness: requires operationalization.'
          },
          evidence: {
            eyebrow: 'Evidence posture',
            title: 'Method identity confirmed; outcome superiority untested',
            body: 'The source confirms the declared sequence. It does not establish that the sequence outperforms alternative research methods.',
            footer: 'Causal status: UNRESOLVED.'
          }
        }
      },
      {
        id: 'integral-method',
        title: 'Integral Scientific Method',
        notation: 'Observe → Reduce → Falsify → Iterate → Terminate → Compress',
        sourceState: 'confirmed',
        relationship: 'organizes falsification cycle',
        lenses: {
          practical: {
            eyebrow: 'Practical reading',
            title: 'Reduce a claim until it can actually fail',
            body: 'Use the method when a claim must be reduced, falsified, iterated, and terminated objectively before its result is compressed.',
            footer: 'Do not invoke as post-hoc justification.'
          },
          engineering: {
            eyebrow: 'Engineering definition',
            title: 'Ordered falsification method',
            body: 'Formal type: ORDERED_FALSIFICATION_METHOD. The ordered states can be represented by a deterministic workflow, but the method remains noncomputational until its domain rules are bound.',
            footer: 'Execution readiness: requires operationalization.'
          },
          evidence: {
            eyebrow: 'Evidence posture',
            title: 'Procedure confirmed; comparative efficacy unresolved',
            body: 'The record confirms the ordered procedure and its invocation boundary. It does not establish empirical superiority or completeness.',
            footer: 'Causal status: UNRESOLVED.'
          }
        }
      },
      {
        id: 'falsification',
        title: 'Formal Falsification Path',
        notation: 'Define → Measure → Freeze → Score → Compare',
        sourceState: 'confirmed',
        relationship: 'converts claims into comparisons',
        lenses: {
          practical: {
            eyebrow: 'Practical reading',
            title: 'Freeze the test before seeing the answer',
            body: 'Use this path when a trajectory or narrowing claim is ready for pre-frozen disconfirmation.',
            footer: 'Comparison follows definition, measurement, and freeze.'
          },
          engineering: {
            eyebrow: 'Engineering definition',
            title: 'Mixed procedural and computational protocol',
            body: 'Formal type: FALSIFICATION_PROTOCOL. Define, Measure, and Freeze establish the admissible test; Score and Compare can then execute against the frozen rules.',
            footer: 'Execution readiness: requires operationalization.'
          },
          evidence: {
            eyebrow: 'Evidence posture',
            title: 'Protocol identity confirmed; result depends on the frozen route',
            body: 'A valid falsification result requires precommitted measures, thresholds, and comparison logic. A post-hoc score is not equivalent.',
            footer: 'Causal status: UNRESOLVED.'
          }
        }
      }
    ]
  }
]);
