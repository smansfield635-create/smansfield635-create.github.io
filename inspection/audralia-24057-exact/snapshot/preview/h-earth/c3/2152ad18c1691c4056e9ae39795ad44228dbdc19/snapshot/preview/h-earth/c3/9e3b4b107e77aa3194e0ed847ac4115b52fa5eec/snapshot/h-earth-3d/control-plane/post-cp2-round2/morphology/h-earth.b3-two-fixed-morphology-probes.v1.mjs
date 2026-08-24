import b0 from './h-earth.b0-morphology-baseline-freeze.v1.mjs';
import b1 from './h-earth.b1-morphology-descriptor-baseline.v1.mjs';
import b2 from './h-earth.b2-protection-model.v1.mjs';

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || seen.has(value)) return value;
  seen.add(value);
  for (const member of Object.values(value)) deepFreeze(member, seen);
  return Object.freeze(value);
};

export const H_EARTH_B3_TWO_FIXED_MORPHOLOGY_PROBES_v1 = deepFreeze({
  schemaVersion: 'H_EARTH_B3_TWO_FIXED_MORPHOLOGY_PROBES_v1',
  checkpoint: 'B3',
  status: 'EXACTLY_TWO_OFFLINE_Y_ONLY_CAUSAL_PROBES',
  controllingB2Merge: '91a6b7d7f370ad1bca29d9c6dd1456fa12dc5294',
  b0AuthorityId: b0.schemaVersion,
  b1AuthorityId: b1.schemaVersion,
  b2AuthorityId: b2.schemaVersion,
  frozenBaselineDigest: 'fnv1a32:513f79fa',
  frozenProtectionDigest: 'fnv1a32:f228a5b5',
  grid: {
    width: 129,
    height: 97,
    xMinimum: -256,
    xMaximum: 256,
    zMinimum: -320,
    zMaximum: 64,
    xSpacingWorldUnits: 4,
    zSpacingWorldUnits: 4,
    vertexCount: 12513
  },
  probes: [
    {
      probeId: 'B1_A_4_PERCENT_LOCAL_RELIEF',
      amplitudeFractionOfLocalRelief: 0.04
    },
    {
      probeId: 'B1_B_8_PERCENT_LOCAL_RELIEF',
      amplitudeFractionOfLocalRelief: 0.08
    }
  ],
  localReliefLaw: {
    radiusCells: 'DOMINANT_REPETITION_LAG_CELLS',
    estimator: 'P95_MINUS_P05_WITHIN_CIRCULAR_RADIUS',
    minimumEnvelopeWorldUnits: 0,
    maximumDeltaPerCell: 'AMPLITUDE_FRACTION_TIMES_LOCAL_RELIEF'
  },
  erosionGuidance: {
    scaleCells: 'DOMINANT_REPETITION_LAG_CELLS',
    sequence: [
      'ONE_STREAM_POWER_EROSION_STEP',
      'ONE_THERMAL_RELAXATION_STEP',
      'ONE_DEPOSITION_STEP'
    ],
    streamPowerCoefficient: 0.42,
    accumulationExponent: 0.35,
    slopeExponent: 1,
    thermalTalusWorldSlope: 0.30,
    thermalTransferFraction: 0.18,
    depositionFraction: 0.35,
    hotspotWeightRequired: true,
    protectionEditableWeightRequired: true,
    randomDisplacement: false
  },
  reconstruction: {
    method: 'CONSTRAINED_SCREENED_POISSON_JACOBI',
    iterations: 96,
    gradientGuidanceWeight: 1,
    originalHeightFidelityBase: 0.18,
    originalHeightFidelityFromHardness: 2.75,
    p0HardConstraintEveryIteration: true,
    finalEnvelopeClampRequired: true,
    p1GradientChangeStronglyLimited: true
  },
  exactPreservation: {
    xzCoordinates: 'BYTE_IDENTICAL_BY_CONSTRUCTION',
    indexTopology: 'BYTE_IDENTICAL_BY_CONSTRUCTION',
    vertexCount: 'EXACT',
    terrainChunkMembership: 'EXACT',
    worldExtent: 'EXACT',
    p0Heights: 'EXACT',
    runtimeRenderer: 'ACCEPTED_CP2_UNCHANGED',
    runtimeMaterials: 'ACCEPTED_CP2_UNCHANGED',
    runtimeTextures: 'ACCEPTED_CP2_UNCHANGED',
    liveRoute: 'UNCHANGED'
  },
  artifactLaw: {
    outputClass: 'DIAGNOSTIC_OFFLINE_HEIGHTFIELD_PROBES',
    encoding: 'FLOAT64_LITTLE_ENDIAN',
    oneFilePerProbe: true,
    committedToProductSource: false,
    liveAdmission: false
  },
  exactPathScope: [
    '.github/workflows/h-earth-b3-two-fixed-morphology-probes.yml',
    'h-earth-3d/analysis/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs',
    'h-earth-3d/control-plane/post-cp2-round2/morphology/h-earth.b3-two-fixed-morphology-probes.v1.mjs',
    'h-earth-3d/validation/morphology/h-earth.b3-two-fixed-morphology-probes.mjs'
  ],
  gates: {
    exactProbeCount: 2,
    exactAmplitudeFractions: [0.04, 0.08],
    independentBuilds: 2,
    exactDigestIdentity: true,
    allValuesFinite: true,
    p0ExactnessTolerance: 0,
    amplitudeEnvelopeTolerance: 1e-6,
    minimumChangedCellCountPerProbe: 1,
    probeBMaximumDeltaNotLessThanProbeA: true,
    noThirdAmplitude: true,
    noProductMutation: true
  },
  boundaries: {
    productMutationPerformed: false,
    runtimeGeometryMutationPerformed: false,
    offlineProbeGenerationPerformed: true,
    finalFrameExecutionPerformed: false,
    causalClassificationPerformed: false,
    liveRouteChanged: false,
    stop: 'STOP_BEFORE_B4_MORPHOLOGY_LEVERAGE_CLASSIFICATION'
  },
  result: 'B3_TWO_FIXED_MORPHOLOGY_PROBES_PASS_CLOSED'
});

export default H_EARTH_B3_TWO_FIXED_MORPHOLOGY_PROBES_v1;
