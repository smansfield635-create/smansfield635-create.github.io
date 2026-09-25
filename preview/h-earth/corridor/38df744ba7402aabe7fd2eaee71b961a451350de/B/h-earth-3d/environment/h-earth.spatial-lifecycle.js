/**
 * /h-earth-3d/environment/h-earth.spatial-lifecycle.js
 *
 * H_EARTH_CANONICAL_SPATIAL_LIFECYCLE_RUN_7G_v1
 *
 * Canonical H-Earth spatial-lifecycle authority. It consumes externally supplied
 * observer and subject positions and owns only lifecycle classification,
 * bounded state transitions, residency policy, update cadence, density budget,
 * and instance-count budget. It creates no camera, geometry, population plan,
 * traversal, audio, navigation, renderer, route, deployment, or merge authority.
 */

const deepFreeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  Object.values(value).forEach((nested) => deepFreeze(nested, seen));
  return Object.freeze(value);
};

const finite = (value) => typeof value === 'number' && Number.isFinite(value);
const clamp = (value, minimum, maximum) =>
  Math.min(maximum, Math.max(minimum, value));
const clamp01 = (value) => clamp(value, 0, 1);

export const H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID =
  'H_EARTH_CANONICAL_SPATIAL_LIFECYCLE_RUN_7G_v1';

export const H_EARTH_SPATIAL_LIFECYCLE_REVISION = 1;

export const H_EARTH_SPATIAL_LIFECYCLE_STATES = deepFreeze([
  'ACTIVE_DETAIL',
  'ACTIVE_REDUCED',
  'SLEEPING',
  'UNLOADED'
]);

export const H_EARTH_SPATIAL_LIFECYCLE_VISIBILITY_CLASSES = deepFreeze([
  'VISIBLE',
  'EDGE_OF_VIEW',
  'OCCLUDED',
  'OUT_OF_VIEW',
  'UNKNOWN'
]);

export const H_EARTH_SPATIAL_LIFECYCLE_FORBIDDEN_NATIVE_OUTPUTS = deepFreeze([
  'geometry',
  'mesh',
  'renderPlan',
  'cameraState',
  'navigationDecision',
  'routePath',
  'terrainElevation',
  'surfaceClass',
  'waterClass',
  'biomeClass',
  'populationInstances',
  'audioLayerSelection',
  'ambientAudioClass',
  'deploymentState'
]);

export const H_EARTH_SPATIAL_LIFECYCLE_PROFILE = deepFreeze({
  profileId: 'H_EARTH_SAMSUNG_PHONE_REFERENCE_LIFECYCLE_PROFILE_v1',
  referenceTier: 'SAMSUNG_GALAXY_PHONE_PRIMARY_PERFORMANCE_TIER',
  thresholds: {
    activeDetailMaximum: 72,
    activeReducedMaximum: 180,
    sleepingMaximum: 340
  },
  hysteresis: {
    activeDetailExit: 84,
    activeDetailEnter: 60,
    activeReducedExit: 204,
    activeReducedEnter: 156,
    sleepingExit: 380,
    sleepingEnter: 300
  },
  visibilityDistancePenalty: {
    VISIBLE: 0,
    EDGE_OF_VIEW: 8,
    OCCLUDED: 18,
    OUT_OF_VIEW: 30,
    UNKNOWN: 10
  },
  memoryPressureDistancePenaltyMaximum: 96,
  importanceDistanceCreditMaximum: 36,
  statePolicies: {
    ACTIVE_DETAIL: {
      densityScale: 1,
      maxInstances: 96,
      updateIntervalFrames: 1,
      simulationCadence: 'EVERY_FRAME',
      residencyClass: 'FULL_INSTANCE_STATE',
      realizationClass: 'DETAIL_INSTANCE_ELIGIBLE',
      visibleEligibility: true,
      simulationEligibility: true,
      unloadingEligibility: false
    },
    ACTIVE_REDUCED: {
      densityScale: 1,
      maxInstances: 48,
      updateIntervalFrames: 4,
      simulationCadence: 'REDUCED_CADENCE',
      residencyClass: 'REDUCED_INSTANCE_STATE',
      realizationClass: 'REDUCED_INSTANCE_ELIGIBLE',
      visibleEligibility: true,
      simulationEligibility: true,
      unloadingEligibility: false
    },
    SLEEPING: {
      densityScale: 0,
      maxInstances: 0,
      updateIntervalFrames: 30,
      simulationCadence: 'WAKE_CHECK_ONLY',
      residencyClass: 'IDENTITY_AND_STATE_ONLY',
      realizationClass: 'NO_INSTANCE_REALIZATION',
      visibleEligibility: false,
      simulationEligibility: false,
      unloadingEligibility: true
    },
    UNLOADED: {
      densityScale: 0,
      maxInstances: 0,
      updateIntervalFrames: null,
      simulationCadence: 'NO_UPDATE',
      residencyClass: 'NO_RESIDENT_INSTANCE_STATE',
      realizationClass: 'NO_INSTANCE_REALIZATION',
      visibleEligibility: false,
      simulationEligibility: false,
      unloadingEligibility: true
    }
  }
});

export const H_EARTH_SPATIAL_LIFECYCLE = deepFreeze({
  contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
  spatialLifecycleRevision: H_EARTH_SPATIAL_LIFECYCLE_REVISION,
  states: H_EARTH_SPATIAL_LIFECYCLE_STATES,
  profile: H_EARTH_SPATIAL_LIFECYCLE_PROFILE,
  transitionLaw: 'ADJACENT_STATE_TRANSITIONS_ONLY',
  ownership: {
    ownsLifecycleClassification: true,
    ownsLifecycleStateTransition: true,
    ownsResidencyPolicy: true,
    ownsUpdateCadence: true,
    ownsDensityBudget: true,
    ownsInstanceCountBudget: true,
    ownsObserverOrCameraTruth: false,
    ownsPopulationPlanning: false,
    ownsPopulationIdentity: false,
    ownsTerrainTruth: false,
    ownsSurfaceState: false,
    ownsWaterState: false,
    ownsBiome: false,
    ownsTraversal: false,
    ownsAmbientAudioProjection: false,
    ownsGeometry: false,
    ownsNavigation: false,
    ownsRenderer: false,
    ownsPublicRoute: false,
    ownsDeployment: false
  }
});

const STATE_INDEX = deepFreeze({
  ACTIVE_DETAIL: 0,
  ACTIVE_REDUCED: 1,
  SLEEPING: 2,
  UNLOADED: 3
});

const STATE_BY_INDEX = H_EARTH_SPATIAL_LIFECYCLE_STATES;

function validateWorldVector(vector, issuePrefix) {
  if (!vector || ![vector.x, vector.y, vector.z].every(finite)) {
    return [`${issuePrefix}_WORLD_NOT_FINITE`];
  }
  return [];
}

function rejectLifecycleSample(input, issues) {
  return deepFreeze({
    valid: false,
    status: 'SPATIAL_LIFECYCLE_REJECTED_INVALID_INPUT',
    contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    spatialLifecycleRevision: H_EARTH_SPATIAL_LIFECYCLE_REVISION,
    subjectId: input?.subjectId ?? null,
    issues
  });
}

function classifyLifecycleState(effectiveDistance, previousState) {
  const thresholds = H_EARTH_SPATIAL_LIFECYCLE_PROFILE.thresholds;
  const hysteresis = H_EARTH_SPATIAL_LIFECYCLE_PROFILE.hysteresis;

  if (previousState === 'ACTIVE_DETAIL') {
    if (effectiveDistance <= hysteresis.activeDetailExit) return 'ACTIVE_DETAIL';
    if (effectiveDistance <= hysteresis.activeReducedExit) return 'ACTIVE_REDUCED';
    if (effectiveDistance <= hysteresis.sleepingExit) return 'SLEEPING';
    return 'UNLOADED';
  }

  if (previousState === 'ACTIVE_REDUCED') {
    if (effectiveDistance <= hysteresis.activeDetailEnter) return 'ACTIVE_DETAIL';
    if (effectiveDistance <= hysteresis.activeReducedExit) return 'ACTIVE_REDUCED';
    if (effectiveDistance <= hysteresis.sleepingExit) return 'SLEEPING';
    return 'UNLOADED';
  }

  if (previousState === 'SLEEPING') {
    if (effectiveDistance <= hysteresis.activeReducedEnter) return 'ACTIVE_REDUCED';
    if (effectiveDistance <= hysteresis.sleepingExit) return 'SLEEPING';
    return 'UNLOADED';
  }

  if (previousState === 'UNLOADED') {
    if (effectiveDistance <= hysteresis.sleepingEnter) return 'SLEEPING';
    return 'UNLOADED';
  }

  if (effectiveDistance <= thresholds.activeDetailMaximum) return 'ACTIVE_DETAIL';
  if (effectiveDistance <= thresholds.activeReducedMaximum) return 'ACTIVE_REDUCED';
  if (effectiveDistance <= thresholds.sleepingMaximum) return 'SLEEPING';
  return 'UNLOADED';
}

function resolveAdjacentState(previousState, desiredState) {
  if (previousState === null || previousState === desiredState) return desiredState;
  const previousIndex = STATE_INDEX[previousState];
  const desiredIndex = STATE_INDEX[desiredState];
  const step = desiredIndex > previousIndex ? 1 : -1;
  return STATE_BY_INDEX[previousIndex + step];
}

function isAllowedTransition(fromState, toState) {
  if (fromState === null) return H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(toState);
  if (!H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(fromState) ||
      !H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(toState)) return false;
  return Math.abs(STATE_INDEX[fromState] - STATE_INDEX[toState]) <= 1;
}

function resolveDistanceContext({
  subjectWorld,
  observerWorld,
  boundsRadius,
  visibilityClass,
  importance,
  memoryPressure
}) {
  const centerDistance = Math.hypot(
    subjectWorld.x - observerWorld.x,
    subjectWorld.y - observerWorld.y,
    subjectWorld.z - observerWorld.z
  );
  const edgeDistance = Math.max(0, centerDistance - boundsRadius);
  const visibilityPenalty =
    H_EARTH_SPATIAL_LIFECYCLE_PROFILE.visibilityDistancePenalty[visibilityClass];
  const memoryPressurePenalty = memoryPressure *
    H_EARTH_SPATIAL_LIFECYCLE_PROFILE.memoryPressureDistancePenaltyMaximum;
  const importanceCredit = importance *
    H_EARTH_SPATIAL_LIFECYCLE_PROFILE.importanceDistanceCreditMaximum;
  const effectiveDistance = Math.max(
    0,
    edgeDistance + visibilityPenalty + memoryPressurePenalty - importanceCredit
  );

  return deepFreeze({
    centerDistance,
    edgeDistance,
    visibilityPenalty,
    memoryPressurePenalty,
    importanceCredit,
    effectiveDistance
  });
}

export function sampleHEarthSpatialLifecycle({
  subjectId,
  subjectWorld,
  observerWorld,
  boundsRadius = 0,
  previousState = null,
  visibilityClass = 'VISIBLE',
  importance = 0,
  memoryPressure = 0
} = {}) {
  const issues = [
    ...validateWorldVector(subjectWorld, 'SUBJECT'),
    ...validateWorldVector(observerWorld, 'OBSERVER')
  ];

  if (typeof subjectId !== 'string' || subjectId.length === 0) {
    issues.push('SUBJECT_ID_MISSING');
  }
  if (!finite(boundsRadius) || boundsRadius < 0 || boundsRadius > 4096) {
    issues.push('BOUNDS_RADIUS_INVALID');
  }
  if (previousState !== null &&
      !H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(previousState)) {
    issues.push('PREVIOUS_STATE_INVALID');
  }
  if (!H_EARTH_SPATIAL_LIFECYCLE_VISIBILITY_CLASSES.includes(visibilityClass)) {
    issues.push('VISIBILITY_CLASS_INVALID');
  }
  if (!finite(importance) || importance < 0 || importance > 1) {
    issues.push('IMPORTANCE_INVALID');
  }
  if (!finite(memoryPressure) || memoryPressure < 0 || memoryPressure > 1) {
    issues.push('MEMORY_PRESSURE_INVALID');
  }

  if (issues.length > 0) {
    return rejectLifecycleSample({ subjectId }, issues);
  }

  const distance = resolveDistanceContext({
    subjectWorld,
    observerWorld,
    boundsRadius,
    visibilityClass,
    importance,
    memoryPressure
  });
  const desiredState = classifyLifecycleState(
    distance.effectiveDistance,
    previousState
  );
  const state = resolveAdjacentState(previousState, desiredState);
  const policy = H_EARTH_SPATIAL_LIFECYCLE_PROFILE.statePolicies[state];
  const transitionAllowed = isAllowedTransition(previousState, state);

  return deepFreeze({
    valid: true,
    status: 'SPATIAL_LIFECYCLE_SAMPLE_COMPLETE',
    contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    spatialLifecycleRevision: H_EARTH_SPATIAL_LIFECYCLE_REVISION,
    profileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId,
    referenceTier: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.referenceTier,
    subjectId,
    subject: {
      world: { ...subjectWorld },
      boundsRadius
    },
    observer: {
      world: { ...observerWorld }
    },
    visibilityClass,
    importance: clamp01(importance),
    memoryPressure: clamp01(memoryPressure),
    centerDistance: distance.centerDistance,
    edgeDistance: distance.edgeDistance,
    effectiveDistance: distance.effectiveDistance,
    distanceAdjustments: {
      visibilityPenalty: distance.visibilityPenalty,
      memoryPressurePenalty: distance.memoryPressurePenalty,
      importanceCredit: distance.importanceCredit
    },
    previousState,
    desiredState,
    state,
    transition: {
      fromState: previousState,
      toState: state,
      desiredState,
      changed: previousState !== null && previousState !== state,
      initialized: previousState === null,
      stepwise: previousState !== null && state !== desiredState,
      allowed: transitionAllowed,
      transitionDistance: previousState === null
        ? 0
        : Math.abs(STATE_INDEX[previousState] - STATE_INDEX[state])
    },
    statePolicy: {
      ...policy
    },
    sourceIdentities: {
      spatialLifecycleContractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
      spatialLifecycleRevision: H_EARTH_SPATIAL_LIFECYCLE_REVISION,
      lifecycleProfileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId
    },
    nativeTruthOwnership: 'SPATIAL_LIFECYCLE_ONLY',
    issues: transitionAllowed ? [] : ['TRANSITION_NOT_ALLOWED']
  });
}

export function projectHEarthSpatialLifecycleToPopulationContext(sample) {
  if (sample?.valid !== true ||
      sample.contractId !== H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID ||
      !H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(sample.state)) {
    return deepFreeze({
      eligible: false,
      status: 'SPATIAL_LIFECYCLE_POPULATION_CONTEXT_REJECTED',
      issues: ['SPATIAL_LIFECYCLE_SAMPLE_NOT_ELIGIBLE']
    });
  }

  const plannerState = {
    ACTIVE_DETAIL: 'ACTIVE_DETAIL',
    ACTIVE_REDUCED: 'ACTIVE_REDUCED',
    SLEEPING: 'DORMANT',
    UNLOADED: 'UNAVAILABLE'
  }[sample.state];

  return deepFreeze({
    contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    state: plannerState,
    canonicalState: sample.state,
    densityScale: sample.statePolicy.densityScale,
    maxInstances: sample.statePolicy.maxInstances,
    authorityEstablished: true,
    provisional: false,
    sourceSubjectId: sample.subjectId,
    sourceProfileId: sample.profileId
  });
}

function isDeepFrozen(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object') return true;
  if (seen.has(value)) return true;
  seen.add(value);
  return Object.isFrozen(value) &&
    Object.values(value).every((nested) => isDeepFrozen(nested, seen));
}

export function evaluateHEarthSpatialLifecycleSample(sample) {
  const issues = [];
  if (sample?.valid !== true) issues.push('SPATIAL_LIFECYCLE_SAMPLE_NOT_VALID');
  if (sample?.contractId !== H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID) {
    issues.push('SPATIAL_LIFECYCLE_CONTRACT_ID_MISMATCH');
  }
  if (!H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(sample?.state)) {
    issues.push('SPATIAL_LIFECYCLE_STATE_INVALID');
  }
  if (!H_EARTH_SPATIAL_LIFECYCLE_STATES.includes(sample?.desiredState)) {
    issues.push('SPATIAL_LIFECYCLE_DESIRED_STATE_INVALID');
  }
  for (const field of [
    'centerDistance',
    'edgeDistance',
    'effectiveDistance',
    'importance',
    'memoryPressure'
  ]) {
    if (!finite(sample?.[field])) issues.push(`NONFINITE_FIELD:${field}`);
  }
  if (finite(sample?.importance) && (sample.importance < 0 || sample.importance > 1)) {
    issues.push('IMPORTANCE_OUT_OF_RANGE');
  }
  if (finite(sample?.memoryPressure) &&
      (sample.memoryPressure < 0 || sample.memoryPressure > 1)) {
    issues.push('MEMORY_PRESSURE_OUT_OF_RANGE');
  }
  if (!sample?.statePolicy ||
      !finite(sample.statePolicy.densityScale) ||
      sample.statePolicy.densityScale < 0 ||
      sample.statePolicy.densityScale > 1 ||
      !Number.isInteger(sample.statePolicy.maxInstances) ||
      sample.statePolicy.maxInstances < 0) {
    issues.push('STATE_POLICY_INVALID');
  }
  if (!sample?.transition?.allowed ||
      !isAllowedTransition(sample?.previousState ?? null, sample?.state)) {
    issues.push('TRANSITION_INVALID');
  }
  if (sample?.nativeTruthOwnership !== 'SPATIAL_LIFECYCLE_ONLY') {
    issues.push('NATIVE_TRUTH_OWNERSHIP_INVALID');
  }
  if (sample?.sourceIdentities?.spatialLifecycleContractId !==
      H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID ||
      sample?.sourceIdentities?.lifecycleProfileId !==
      H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId) {
    issues.push('SOURCE_IDENTITIES_INVALID');
  }
  H_EARTH_SPATIAL_LIFECYCLE_FORBIDDEN_NATIVE_OUTPUTS.forEach((field) => {
    if (Object.prototype.hasOwnProperty.call(sample ?? {}, field)) {
      issues.push(`FORBIDDEN_NATIVE_OUTPUT:${field}`);
    }
  });
  if (!isDeepFrozen(sample)) issues.push('SPATIAL_LIFECYCLE_SAMPLE_NOT_DEEP_FROZEN');

  return deepFreeze({
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'SPATIAL_LIFECYCLE_SAMPLE_PASS'
      : 'SPATIAL_LIFECYCLE_SAMPLE_FAIL',
    contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    state: sample?.state ?? null,
    issues
  });
}

export function getHEarthSpatialLifecycleReceipt() {
  const observerWorld = { x: 0, y: 0, z: 0 };
  const samples = [
    ['ACTIVE_DETAIL', 32],
    ['ACTIVE_REDUCED', 120],
    ['SLEEPING', 260],
    ['UNLOADED', 420]
  ].map(([expectedState, distance]) => {
    const sample = sampleHEarthSpatialLifecycle({
      subjectId: `RECEIPT_${expectedState}`,
      subjectWorld: { x: distance, y: 0, z: 0 },
      observerWorld
    });
    return {
      expectedState,
      state: sample.state,
      eligible: evaluateHEarthSpatialLifecycleSample(sample).eligible
    };
  });
  const issues = samples
    .filter((sample) => sample.state !== sample.expectedState || sample.eligible !== true)
    .map((sample) => `RECEIPT_STATE_MISMATCH:${sample.expectedState}:${sample.state}`);

  return deepFreeze({
    receiptType: 'H_EARTH_SPATIAL_LIFECYCLE_RUN_7G_SOURCE_RECEIPT',
    contractId: H_EARTH_SPATIAL_LIFECYCLE_CONTRACT_ID,
    spatialLifecycleRevision: H_EARTH_SPATIAL_LIFECYCLE_REVISION,
    profileId: H_EARTH_SPATIAL_LIFECYCLE_PROFILE.profileId,
    eligible: issues.length === 0,
    status: issues.length === 0
      ? 'SPATIAL_LIFECYCLE_SOURCE_ELIGIBLE'
      : 'SPATIAL_LIFECYCLE_SOURCE_HELD',
    states: H_EARTH_SPATIAL_LIFECYCLE_STATES,
    stateCoverage: samples,
    ownsLifecycleClassification: true,
    ownsLifecycleStateTransition: true,
    ownsResidencyPolicy: true,
    ownsUpdateCadence: true,
    ownsDensityBudget: true,
    ownsInstanceCountBudget: true,
    ownsObserverOrCameraTruth: false,
    ownsPopulationPlanning: false,
    ownsGeometry: false,
    ownsNavigation: false,
    ownsRenderer: false,
    publicRouteMutation: false,
    productPromotionClaim: false,
    liveVerificationClaim: false,
    issues
  });
}

export default H_EARTH_SPATIAL_LIFECYCLE;
