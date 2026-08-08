import {
  ENGINE_ID,
  STATE_SPACE_ID,
  ATLAS_ID,
  SEPARATION_LAW,
  ENGINE_MANIFEST,
  CoordinateEmbeddingError,
  compileChart,
  canonicalInvariantDigest,
  embedCoordinateState,
  verifyCoordinateState,
  sha256Canonical
} from './r8d-deterministic-coordinate-embedding-engine.v1.mjs';

export const HARNESS_ID = 'CROSS_FRAME_INVARIANCE_ROUNDTRIP_VERIFICATION_HARNESS_v1';
export const OVERLAP_POLICY = 'DECLARED_CANONICAL_DOMAIN_INTERSECTION';
export const RESOLUTION_POLICY = 'EXACT_CANONICAL_STATE_REGISTRY_RESOLUTION';
export const ROUNDTRIP_LAW = 'A_TO_B_TO_A_RETURNS_IDENTICAL_COORDINATE_STATE_RECORD_ON_DECLARED_OVERLAP';

export class CrossFrameVerificationError extends Error {
  constructor(code, detail = '') {
    super(detail ? `${code}: ${detail}` : code);
    this.name = 'CrossFrameVerificationError';
    this.code = code;
  }
}

function isObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function exactEqual(a, b) {
  return sha256Canonical(a) === sha256Canonical(b);
}

function requireString(value, code, detail) {
  if (typeof value !== 'string' || value.length === 0) throw new CrossFrameVerificationError(code, detail);
}

function requireCoordinateState(record, label) {
  if (!isObject(record) || record.representationState === 'NOT_REPRESENTABLE_IN_SELECTED_CHART') {
    throw new CrossFrameVerificationError('NO_COMMON_COORDINATE_DOMAIN', label);
  }
  for (const field of [
    'coordinateStateId', 'sourceDeliveryStateId', 'chartId', 'chartVersion', 'systemId',
    'coordinateVector', 'representedDimensionIds', 'systemSpecificStateSigma',
    'canonicalInvariantDigest', 'chartDigest', 'coordinateStateDigest'
  ]) {
    if (!Object.prototype.hasOwnProperty.call(record, field)) {
      throw new CrossFrameVerificationError('INVALID_COORDINATE_STATE_RECORD', `${label}.${field}`);
    }
  }
}

function normalizeRegistry(registryInput) {
  const states = Array.isArray(registryInput)
    ? registryInput
    : isObject(registryInput)
      ? Object.values(registryInput)
      : null;
  if (!states) throw new CrossFrameVerificationError('CANONICAL_REGISTRY_INVALID');

  const registry = new Map();
  for (const state of states) {
    if (!isObject(state)) throw new CrossFrameVerificationError('CANONICAL_REGISTRY_INVALID');
    requireString(state.deliveryStateId, 'CANONICAL_REGISTRY_INVALID', 'deliveryStateId');
    if (registry.has(state.deliveryStateId)) {
      throw new CrossFrameVerificationError('CANONICAL_REGISTRY_DUPLICATE_STATE_ID', state.deliveryStateId);
    }
    canonicalInvariantDigest(state);
    registry.set(state.deliveryStateId, clone(state));
  }
  return registry;
}

function findOverlap(chart, peer) {
  const declarations = chart.overlapDeclarations;
  if (!Array.isArray(declarations)) throw new CrossFrameVerificationError('OVERLAP_DECLARATION_INVALID', chart.chartId);
  const matches = declarations.filter((entry) => isObject(entry)
    && entry.peerChartId === peer.chartId
    && entry.peerChartVersion === peer.chartVersion);
  if (matches.length === 0) throw new CrossFrameVerificationError('NO_DECLARED_CHART_OVERLAP', `${chart.chartId}->${peer.chartId}`);
  if (matches.length !== 1) throw new CrossFrameVerificationError('AMBIGUOUS_CHART_OVERLAP', `${chart.chartId}->${peer.chartId}`);
  const declaration = matches[0];
  for (const field of ['overlapId', 'peerChartId', 'peerChartVersion', 'canonicalOverlapPolicy', 'resolutionPolicy']) {
    requireString(declaration[field], 'OVERLAP_DECLARATION_INVALID', `${chart.chartId}.${field}`);
  }
  if (declaration.canonicalOverlapPolicy !== OVERLAP_POLICY) {
    throw new CrossFrameVerificationError('OVERLAP_POLICY_UNSUPPORTED', chart.chartId);
  }
  if (declaration.resolutionPolicy !== RESOLUTION_POLICY) {
    throw new CrossFrameVerificationError('OVERLAP_RESOLUTION_POLICY_UNSUPPORTED', chart.chartId);
  }
  if (declaration.reciprocityRequired !== true) {
    throw new CrossFrameVerificationError('OVERLAP_RECIPROCITY_REQUIRED', chart.chartId);
  }
  return declaration;
}

export function compileDeclaredOverlap(chartAInput, chartBInput) {
  const chartA = compileChart(chartAInput);
  const chartB = compileChart(chartBInput);
  if (chartA.chartId === chartB.chartId && chartA.chartVersion === chartB.chartVersion) {
    throw new CrossFrameVerificationError('DISTINCT_CHARTS_REQUIRED');
  }
  const aToB = findOverlap(chartA, chartB);
  const bToA = findOverlap(chartB, chartA);
  if (aToB.overlapId !== bToA.overlapId) {
    throw new CrossFrameVerificationError('NONRECIPROCAL_CHART_OVERLAP', `${aToB.overlapId} != ${bToA.overlapId}`);
  }
  return Object.freeze({ chartA, chartB, overlapId: aToB.overlapId });
}

function resolveCoordinateState(record, chart, registry) {
  requireCoordinateState(record, chart.chartId);
  if (record.chartId !== chart.chartId || record.chartVersion !== chart.chartVersion || record.systemId !== chart.systemId) {
    throw new CrossFrameVerificationError('COORDINATE_STATE_CHART_MISMATCH', chart.chartId);
  }
  const source = registry.get(record.sourceDeliveryStateId);
  if (!source) throw new CrossFrameVerificationError('CANONICAL_SOURCE_NOT_FOUND', record.sourceDeliveryStateId);
  const invariant = canonicalInvariantDigest(source);
  if (record.canonicalInvariantDigest !== invariant) {
    throw new CrossFrameVerificationError('CANONICAL_INVARIANT_DIGEST_DRIFT', record.coordinateStateId);
  }
  try {
    verifyCoordinateState(record, source, chart);
  } catch (error) {
    if (error instanceof CoordinateEmbeddingError) {
      throw new CrossFrameVerificationError('COORDINATE_STATE_VERIFICATION_FAILED', error.code);
    }
    throw error;
  }
  return source;
}

function transitionWitness(record, sourceChart, targetChart, registry) {
  const source = resolveCoordinateState(record, sourceChart, registry);
  const target = embedCoordinateState(source, targetChart);
  requireCoordinateState(target, targetChart.chartId);
  if (target.sourceDeliveryStateId !== record.sourceDeliveryStateId) {
    throw new CrossFrameVerificationError('SOURCE_DELIVERY_STATE_ID_DRIFT');
  }
  if (target.canonicalInvariantDigest !== record.canonicalInvariantDigest) {
    throw new CrossFrameVerificationError('CANONICAL_INVARIANT_DIGEST_DRIFT');
  }
  return target;
}

export function verifyCrossFrameRoundtrip({ coordinateStateA, coordinateStateB, chartA: chartAInput, chartB: chartBInput, canonicalRegistry }) {
  const before = sha256Canonical({ coordinateStateA, coordinateStateB, chartAInput, chartBInput, canonicalRegistry });
  const { chartA, chartB, overlapId } = compileDeclaredOverlap(chartAInput, chartBInput);
  const registry = normalizeRegistry(canonicalRegistry);

  requireCoordinateState(coordinateStateA, 'A');
  requireCoordinateState(coordinateStateB, 'B');
  if (coordinateStateA.sourceDeliveryStateId !== coordinateStateB.sourceDeliveryStateId) {
    throw new CrossFrameVerificationError('CROSS_FRAME_SOURCE_ID_MISMATCH');
  }
  if (coordinateStateA.canonicalInvariantDigest !== coordinateStateB.canonicalInvariantDigest) {
    throw new CrossFrameVerificationError('CANONICAL_INVARIANT_DIGEST_DRIFT');
  }

  const sourceA = resolveCoordinateState(coordinateStateA, chartA, registry);
  const sourceB = resolveCoordinateState(coordinateStateB, chartB, registry);
  if (sourceA.deliveryStateId !== sourceB.deliveryStateId || !exactEqual(sourceA, sourceB)) {
    throw new CrossFrameVerificationError('CANONICAL_SOURCE_RESOLUTION_MISMATCH');
  }

  const aToB = transitionWitness(coordinateStateA, chartA, chartB, registry);
  if (!exactEqual(aToB, coordinateStateB)) {
    throw new CrossFrameVerificationError('A_TO_B_COORDINATE_STATE_MISMATCH');
  }
  const bToA = transitionWitness(aToB, chartB, chartA, registry);
  if (!exactEqual(bToA, coordinateStateA)) {
    throw new CrossFrameVerificationError('ROUNDTRIP_A_TO_B_TO_A_FAILURE');
  }

  const bToAInitial = transitionWitness(coordinateStateB, chartB, chartA, registry);
  if (!exactEqual(bToAInitial, coordinateStateA)) {
    throw new CrossFrameVerificationError('B_TO_A_COORDINATE_STATE_MISMATCH');
  }
  const aToBReturn = transitionWitness(bToAInitial, chartA, chartB, registry);
  if (!exactEqual(aToBReturn, coordinateStateB)) {
    throw new CrossFrameVerificationError('ROUNDTRIP_B_TO_A_TO_B_FAILURE');
  }

  const after = sha256Canonical({ coordinateStateA, coordinateStateB, chartAInput, chartBInput, canonicalRegistry });
  if (before !== after) throw new CrossFrameVerificationError('VERIFICATION_INPUT_MUTATION');

  const receipt = {
    harnessId: HARNESS_ID,
    status: 'CROSS_FRAME_VERIFICATION_PASS',
    overlapId,
    sourceDeliveryStateId: coordinateStateA.sourceDeliveryStateId,
    chartA: { chartId: chartA.chartId, chartVersion: chartA.chartVersion, systemId: chartA.systemId, chartDigest: chartA.chartDigest },
    chartB: { chartId: chartB.chartId, chartVersion: chartB.chartVersion, systemId: chartB.systemId, chartDigest: chartB.chartDigest },
    coordinateStateAId: coordinateStateA.coordinateStateId,
    coordinateStateBId: coordinateStateB.coordinateStateId,
    coordinateStateADigest: coordinateStateA.coordinateStateDigest,
    coordinateStateBDigest: coordinateStateB.coordinateStateDigest,
    canonicalInvariantDigest: coordinateStateA.canonicalInvariantDigest,
    canonicalInvariantPreserved: true,
    sourceIdentityPreserved: true,
    declaredOverlapVerified: true,
    aToBExact: true,
    bToAExact: true,
    roundtripAToBToAExact: true,
    roundtripBToAToBExact: true,
    coordinateVectorsMayDiffer: true,
    projectionRuntimeConstructed: false,
    presentationRuntimeConstructed: false,
    visiblePrototypeConstructed: false
  };
  receipt.verificationDigest = sha256Canonical(receipt);
  return receipt;
}

export function deriveAndVerifyCrossFrame({ sourceState, chartA, chartB, canonicalRegistry = [sourceState] }) {
  const compiled = compileDeclaredOverlap(chartA, chartB);
  const coordinateStateA = embedCoordinateState(sourceState, compiled.chartA);
  const coordinateStateB = embedCoordinateState(sourceState, compiled.chartB);
  requireCoordinateState(coordinateStateA, 'A');
  requireCoordinateState(coordinateStateB, 'B');
  return verifyCrossFrameRoundtrip({
    coordinateStateA,
    coordinateStateB,
    chartA: compiled.chartA,
    chartB: compiled.chartB,
    canonicalRegistry
  });
}

export const HARNESS_MANIFEST = Object.freeze({
  harnessId: HARNESS_ID,
  embeddingEngineId: ENGINE_ID,
  stateSpaceId: STATE_SPACE_ID,
  atlasId: ATLAS_ID,
  separationLaw: SEPARATION_LAW,
  overlapPolicy: OVERLAP_POLICY,
  resolutionPolicy: RESOLUTION_POLICY,
  roundtripLaw: ROUNDTRIP_LAW,
  coordinateEmbeddingRuntimeConstructed: ENGINE_MANIFEST.coordinateEmbeddingRuntimeConstructed,
  crossFrameVerificationHarnessConstructed: true,
  coordinateTransitionRuntimeConstructed: false,
  projectionRuntimeConstructed: false,
  presentationRuntimeConstructed: false,
  visiblePrototypeConstructed: false,
  r6AuthorizedTransformationCount: 0,
  r7SpatialTransformationDependentStateCount: 0
});