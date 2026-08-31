export const CONTENT_VERSION = 'METHODS_CONTEXT_DISPLACEMENT_MINIMUM_REAL_3D_PROOF_v1.0.0';

export const LENSES = Object.freeze([
  Object.freeze({ id: 'practical', label: 'Practical' }),
  Object.freeze({ id: 'engineering', label: 'Engineering' }),
  Object.freeze({ id: 'evidence', label: 'Evidence' })
]);

const lens = (title, body, footer) => Object.freeze({ title, body, footer });

export const METHODS_CORPUS = Object.freeze({
  corpusId: 'methods-reference-corpus',
  version: CONTENT_VERSION,
  stages: Object.freeze([
    Object.freeze({
      id: 'pressure-capacity',
      title: 'Pressure & Capacity',
      accent: [1.0, 0.62, 0.22],
      origin: [-3.8, 0.0, 0.0],
      models: Object.freeze([
        Object.freeze({
          id: 'pressure-field',
          title: 'Pressure Field',
          equation: 'Π = G × X',
          relationship: 'feeds the PCR numerator',
          statement: 'Pressure is a declared multiplicative field. Required weakness remains visible rather than being averaged away.',
          sourceState: 'confirmed',
          position: [-2.4, 0.25, 0.0],
          lenses: Object.freeze({
            practical: lens('How much pressure is acting?', 'Use the pressure field only after every required pressure factor has been admitted and normalized. The product keeps a missing required term visible.', 'No universal-default or post-hoc use.'),
            engineering: lens('Multiplicative pressure kernel', 'Π is computed from declared normalized factors. Its units, factor dictionary, and normalizers must be frozen before empirical execution.', 'Execution readiness: not empirically ready.'),
            evidence: lens('Formula confirmed; validity unresolved', 'The source confirms the formula and invocation boundary. It does not establish predictive validity, calibration, or causal interpretation.', 'Causal status: unresolved.')
          })
        }),
        Object.freeze({
          id: 'capacity-field',
          title: 'Usable Capacity',
          equation: 'K = P × R × A × C',
          relationship: 'protects the PCR denominator',
          statement: 'Capacity is a required-factor product. Nominal abundance cannot compensate for one indispensable capacity at zero.',
          sourceState: 'confirmed',
          position: [0.0, 0.55, -0.65],
          lenses: Object.freeze({
            practical: lens('What capacity is actually usable?', 'Use capacity only after every required factor has been admitted and normalized. A missing factor cannot be silently substituted.', 'Required factors remain noncompensatory.'),
            engineering: lens('Multiplicative capacity kernel', 'K is the product of required capacity factors and is consumed by the protected PCR denominator. Zero behavior is preserved.', 'Execution readiness: not empirically ready.'),
            evidence: lens('Structure confirmed; scale unvalidated', 'The formula is source-confirmed, while factor definitions, normalization, thresholds, and calibration remain domain-bound.', 'Causal status: unresolved.')
          })
        }),
        Object.freeze({
          id: 'pcr',
          title: 'Pressure-to-Capacity Ratio',
          equation: 'PCR = Π / max(K, εK)',
          relationship: 'integrates pressure and capacity',
          statement: 'The same pressure can be manageable or hazardous depending on the usable capacity available to absorb it.',
          sourceState: 'confirmed',
          fullyPopulated: true,
          position: [2.45, 0.15, 0.15],
          lenses: Object.freeze({
            practical: lens('Read pressure relative to usable capacity', 'PCR compares active burden with capacity that can actually be used. The denominator floor prevents undefined division but does not make a zero-capacity state safe.', 'Invoke only when Π, K, and εK are frozen.'),
            engineering: lens('Protected ratio with explicit floor', 'The runtime preserves required zeros, records whether the floor was used, and retains SAFE_MODE semantics separately from the numerical ratio.', 'Required state includes factors, εK, floorUsed, and safeMode.'),
            evidence: lens('Mathematics confirmed; calibration bounded', 'Formula confirmation does not establish a validated instrument, threshold, outcome relation, causal model, or cross-domain transfer. Synthetic fixtures test determinism only.', 'Confirmed formula ≠ validated instrument.')
          })
        })
      ])
    }),
    Object.freeze({
      id: 'method-falsification',
      title: 'Method & Falsification',
      accent: [0.25, 0.82, 1.0],
      origin: [4.1, 0.0, -5.6],
      models: Object.freeze([
        Object.freeze({
          id: 'first',
          title: 'F.I.R.S.T. Research Method',
          equation: 'Flow → Integrity → Reality → Structure → Test',
          relationship: 'orients research entry',
          statement: 'Follow the system before judging it, then test the declared structure under a domain-specific operationalization.',
          sourceState: 'confirmed',
          position: [-2.35, 0.2, 0.25],
          lenses: Object.freeze({
            practical: lens('Begin by following the system', 'Use F.I.R.S.T. when a question requires ordered review of flow, integrity, reality, structure, and test.', 'Ordered orientation, not a universal default.'),
            engineering: lens('Noncomputational method sequence', 'The sequence can govern a deterministic workflow but requires domain-specific definitions before automation.', 'Execution requires operationalization.'),
            evidence: lens('Identity confirmed; superiority untested', 'The source confirms the declared sequence, not that it outperforms alternative research methods.', 'Comparative efficacy unresolved.')
          })
        }),
        Object.freeze({
          id: 'integral-method',
          title: 'Integral Scientific Method',
          equation: 'Observe → Reduce → Falsify → Iterate → Terminate → Compress',
          relationship: 'organizes the falsification cycle',
          statement: 'Reduce a claim until it can fail, then iterate under explicit stopping and compression rules.',
          sourceState: 'confirmed',
          position: [0.0, 0.5, -0.55],
          lenses: Object.freeze({
            practical: lens('Reduce a claim until it can fail', 'Use the method when a claim must be reduced, falsified, iterated, and terminated objectively before compression.', 'No post-hoc justification.'),
            engineering: lens('Ordered falsification workflow', 'The ordered states can be represented deterministically, but domain rules still govern each transition.', 'Execution requires operationalization.'),
            evidence: lens('Procedure confirmed; efficacy unresolved', 'The record confirms the ordered procedure, not empirical superiority or completeness.', 'Causal status: unresolved.')
          })
        }),
        Object.freeze({
          id: 'falsification',
          title: 'Formal Falsification Path',
          equation: 'Define → Measure → Freeze → Score → Compare',
          relationship: 'converts claims into comparisons',
          statement: 'Freeze the route before observing the answer so comparison remains capable of genuine disconfirmation.',
          sourceState: 'confirmed',
          position: [2.4, 0.1, 0.05],
          lenses: Object.freeze({
            practical: lens('Freeze the test before the answer', 'Use this path when a trajectory or narrowing claim is ready for precommitted disconfirmation.', 'Comparison follows definition and freeze.'),
            engineering: lens('Mixed procedural-computational protocol', 'Define, Measure, and Freeze establish the admissible test. Score and Compare execute only against those frozen rules.', 'Post-hoc scoring is not equivalent.'),
            evidence: lens('Result depends on the frozen route', 'A valid result requires precommitted measures, thresholds, and comparison logic. Motion or presentation cannot promote an evidence hold.', 'Causal status: unresolved.')
          })
        })
      ])
    })
  ])
});

export function validateCorpus(corpus) {
  if (!corpus || typeof corpus !== 'object') throw new TypeError('Corpus is required.');
  if (!Array.isArray(corpus.stages) || corpus.stages.length < 1) throw new Error('Corpus requires stages.');
  const ids = new Set();
  for (const stage of corpus.stages) {
    if (!stage.id || !Array.isArray(stage.models) || stage.models.length < 1) throw new Error('Every stage requires models.');
    for (const model of stage.models) {
      if (ids.has(model.id)) throw new Error(`Duplicate model id: ${model.id}`);
      ids.add(model.id);
      for (const { id } of LENSES) if (!model.lenses?.[id]) throw new Error(`${model.id} missing ${id} lens.`);
    }
  }
  return true;
}
