import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ROOT = 'control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const CONTRACT_PATH = `${ROOT}/r8b-system-coordinate-atlas-contract.v1.json`;
const R8A_PATH = `${ROOT}/r8a-canonical-delivery-state-space-contract.v1.json`;
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const r8a = JSON.parse(readFileSync(R8A_PATH, 'utf8'));

const eq = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const yes = (value, label) => assert.equal(value, true, label);
const no = (value, label) => assert.equal(value, false, label);
const has = (array, value, label) => assert.ok(Array.isArray(array) && array.includes(value), label);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

class AtlasContractError extends Error {}

function validateSyntheticChart(chart) {
  if (!Number.isInteger(chart.codomainDimension) || chart.codomainDimension <= 0) {
    throw new AtlasContractError('INVALID_CODOMAIN_DIMENSION');
  }
  if (!Array.isArray(chart.dimensions) || chart.dimensions.length !== chart.codomainDimension) {
    throw new AtlasContractError('UNDECLARED_CHART_DIMENSION');
  }
  const indices = chart.dimensions.map((d) => d.dimensionIndex);
  if (new Set(indices).size !== indices.length) {
    throw new AtlasContractError('DUPLICATE_CHART_DIMENSION_INDEX');
  }
  for (const d of chart.dimensions) {
    if (!contract.coordinateDimensionContract.permittedSemanticClasses.includes(d.semanticClass)) {
      throw new AtlasContractError('UNDECLARED_COORDINATE_SEMANTIC');
    }
  }
  if (chart.metricPolicy.distanceMeaning !== 'NONE') {
    if (!chart.metricPolicy.metricId || !chart.metricPolicy.semanticScope || !chart.metricPolicy.domainScope) {
      throw new AtlasContractError('DISTANCE_MEANING_WITHOUT_METRIC');
    }
  }
  if (chart.topologyPolicy.neighborhoodMeaning !== 'NONE' && !chart.topologyPolicy.topologyId) {
    throw new AtlasContractError('NEIGHBORHOOD_MEANING_WITHOUT_TOPOLOGY');
  }
  if (chart.recoverabilityClass === 'EXACT_COORDINATE_CHART' && chart.invertibleOnDeclaredDomain !== true) {
    throw new AtlasContractError('NONINVERTIBLE_REPRESENTATION_MISCLASSIFIED_AS_COORDINATE_CHART');
  }
  return true;
}

function requireCommonCoordinateDomain(commonDomainDeclared) {
  if (!commonDomainDeclared) return contract.chartOverlapContract.outsideOverlapDisposition;
  return 'DECLARED_COMMON_COORDINATE_DOMAIN';
}

const parent = git('rev-parse', 'HEAD^');
eq(parent, '1238fb73df7554e05da7714dfd3d7668b4749485', 'exact R8A parent');
eq(git('rev-parse', '1238fb73df7554e05da7714dfd3d7668b4749485^{tree}'), 'ce84819184c6117520bd1882bcf1b49a9b9c2ac2', 'R8A parent tree');
eq(git('rev-parse', `HEAD:${R8A_PATH}`), '3f593061fa3d4906c769707904108249943e3826', 'R8A contract blob drift');
eq(r8a.status, 'PASS_CLOSED', 'R8A status');
yes(r8a.closure.r8aPassClosed, 'R8A terminal closure');
no(r8a.closure.r8PassClosed, 'R8 remains open after R8A');
no(r8a.closure.r9Unlock, 'R9 remains blocked after R8A');
eq(r8a.closure.nextSubcheckpointOnPass, 'R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT', 'R8B named by R8A');

eq(contract.schema, 'METHODS_MODELS_F12_R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT_v1', 'schema');
eq(contract.program, 'F12_RECURSIVE_SPATIAL_INFORMATION_ARCHITECTURE_REMEDIATION_v1', 'program');
eq(contract.checkpoint, 'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE', 'checkpoint');
eq(contract.subcheckpoint, 'R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT', 'subcheckpoint');
eq(contract.status, 'PASS_CLOSED', 'terminal status');
eq(contract.verification.requiredTerminalStatus, 'PASS_CLOSED', 'required terminal status');

eq(contract.parentAuthority.head, '1238fb73df7554e05da7714dfd3d7668b4749485', 'parent head');
eq(contract.parentAuthority.tree, 'ce84819184c6117520bd1882bcf1b49a9b9c2ac2', 'parent tree');
yes(contract.parentAuthority.r8aPassClosed, 'R8A pass carried');
eq(contract.parentAuthority.r8Status, 'OPEN_REMEDIATION', 'R8 open');
eq(contract.parentAuthority.r9Status, 'BLOCKED_BY_R8', 'R9 blocked');

eq(contract.frozenScientificInputs.scientificStateDigest, 'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5', 'scientific digest');
eq(contract.frozenScientificInputs.relationGraphDigest, '4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b', 'relation digest');
eq(contract.frozenScientificInputs.projectionGraphDigest, '9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8', 'projection digest');
eq(contract.frozenScientificInputs.mode, 'READ_ONLY', 'scientific input mode');

eq(contract.r8aCanonicalStateSpace.id, 'CANONICAL_DELIVERY_INFORMATION_STATE_SPACE_v1', 'R8A state-space id');
eq(contract.r8aCanonicalStateSpace.symbol, 'M_D', 'R8A state-space symbol');
eq(contract.r8aCanonicalStateSpace.manifoldStatus, 'NOT_ASSUMED', 'manifold status');
no(contract.r8aCanonicalStateSpace.systemCoordinatesStoredInCanonicalState, 'system coordinates excluded from canonical state');
eq(contract.r8aCanonicalStateSpace.canonicalInvariantSet, [
  'IDENTITY','SOURCE_AUTHORITY','LINEAGE','TYPED_RELATIONS','EVIDENCE_STANDING','CLAIM_CEILING','SCIENTIFIC_STATE'
], 'canonical invariant set');

eq(contract.systemCoordinateAtlas.id, 'SYSTEM_COORDINATE_ATLAS_v1', 'atlas id');
eq(contract.systemCoordinateAtlas.symbol, 'A_D', 'atlas symbol');
no(contract.systemCoordinateAtlas.atlasIsScientificOntology, 'atlas is not scientific ontology');
no(contract.systemCoordinateAtlas.atlasIsPresentation, 'atlas is not presentation');
no(contract.systemCoordinateAtlas.atlasIsProjection, 'atlas is not projection');
yes(contract.systemCoordinateAtlas.atlasMayBePartial, 'atlas may be partial');
no(contract.systemCoordinateAtlas.atlasCompletenessClaimed, 'atlas completeness not claimed');
no(contract.systemCoordinateAtlas.concreteChartInstancesConstructedAtR8B, 'no concrete charts at R8B');
no(contract.systemCoordinateAtlas.coordinateEmbeddingRuntimeConstructedAtR8B, 'no embedding runtime at R8B');
no(contract.systemCoordinateAtlas.coordinateTransitionRuntimeConstructedAtR8B, 'no transition runtime at R8B');

eq(contract.chartContract.notation, 'phi_S:U_S subset M_D -> V_S subset R^(n_S)', 'chart notation');
yes(contract.chartContract.chartMayBePartial, 'chart may be partial');
yes(contract.chartContract.systemCoordinatesAreDerived, 'coordinates derived');
no(contract.chartContract.systemCoordinatesAreCanonicalScientificTruth, 'coordinates are not scientific truth');
yes(contract.chartContract.sameCanonicalStateMayHaveDifferentCoordinatesAcrossCharts, 'multi-chart representation');
no(contract.chartContract.chartMembershipCreatesScientificMeaning, 'chart membership no scientific authorship');
no(contract.chartContract.coordinateValueCreatesScientificMeaning, 'coordinate value no scientific authorship');

eq(contract.metricPolicy.defaultDistanceMeaning, 'NONE', 'default distance meaning');
no(contract.metricPolicy.euclideanDistanceScientificMeaningByDefault, 'Euclidean distance has no default scientific meaning');
yes(contract.metricPolicy.distanceMeaningRequiresExplicitDeclaration, 'explicit distance declaration');
yes(contract.metricPolicy.distanceMeaningDeclarationRequiresMetricId, 'metric id required');
no(contract.metricPolicy.universalEuclideanScientificMetricAssumed, 'no universal Euclidean scientific metric');

eq(contract.topologyPolicy.defaultNeighborhoodMeaning, 'NONE', 'default neighborhood meaning');
yes(contract.topologyPolicy.neighborhoodOrContinuityMeaningRequiresExplicitTopology, 'topology declaration required');
no(contract.topologyPolicy.implicitEuclideanTopologyScientificMeaningProhibited === false, 'implicit Euclidean scientific topology must be prohibited');
yes(contract.chartRecoverability.trueCoordinateChartRequiresRecoverableCanonicalIdentityOnDeclaredDomain, 'recoverability required');
yes(contract.chartRecoverability.noninvertibleRepresentationMustBeClassifiedAsProjectionOrPresentationDownstream, 'noninvertible representation classification');

eq(contract.chartOverlapContract.transitionNotation, 'T_B<-A=phi_B o phi_A^-1', 'transition notation');
yes(contract.chartOverlapContract.transitionDefinedOnlyOnDeclaredCanonicalOverlap, 'declared overlap required');
yes(contract.chartOverlapContract.trueTransitionRequiresRoundtrip, 'roundtrip required');
eq(contract.chartOverlapContract.outsideOverlapDisposition, 'NO_COMMON_COORDINATE_DOMAIN', 'outside overlap disposition');
no(contract.chartOverlapContract.transitionMayCreateScientificMeaning, 'coordinate transition no scientific authorship');
no(contract.chartOverlapContract.transitionRuntimeConstructedAtR8B, 'transition runtime prohibited');
has(contract.representationDispositions.laws, 'NOT_REPRESENTABLE_IN_SELECTED_CHART_NE_ABSENT_FROM_CANONICAL_STATE', 'chart presence law');
has(contract.representationDispositions.laws, 'HIDDEN_BY_PROJECTION_NE_ABSENT_FROM_CANONICAL_STATE', 'projection presence law');
has(contract.representationDispositions.laws, 'CHART_NONREPRESENTABILITY_NE_PROJECTION_HIDDEN', 'chart/projection distinction');
yes(contract.systemSpecificStateBoundary.systemSpecificStateSigmaMayExistInChartState, 'system-specific state may live in chart state');
no(contract.systemSpecificStateBoundary.systemSpecificStateSigmaBelongsInCanonicalDeliveryRecord, 'system-specific state excluded from canonical record');
no(contract.coordinateStateRecord.runtimeConstructedAtR8B, 'coordinate state runtime not built');
no(contract.coordinateStateRecord.mayReplaceCanonicalDeliveryState, 'coordinate state cannot replace canonical state');

eq(contract.r6Compatibility.law, 'SPATIAL_EMBEDDING_NE_SPATIAL_TRANSFORMATION', 'R6 compatibility law');
eq(contract.r6Compatibility.r6AuthorizedTransformationCountRemains, 0, 'R6 transform count');
no(contract.r6Compatibility.coordinateAssignmentIsSpatialTransformation, 'coordinate assignment is not R6 transform');
no(contract.r6Compatibility.coordinateTransitionIsR6SpatialTransformation, 'coordinate transition is not R6 transform');
no(contract.r6Compatibility.coordinateChartDefinitionRequiresR6Reopen, 'R6 reopen not required');

eq(contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains, 0, 'R7 transform-dependent state count');
yes(contract.r7Compatibility.scientificRecoverabilityWithoutSpatialInteractionRemainsRequired, 'R7 recoverability');
yes(contract.r7Compatibility.coordinateAtlasMayNotBecomeRequiredForScientificRecoverability, 'atlas cannot become scientific dependency');

eq(contract.r8cBoundary.nextSubcheckpoint, 'R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION', 'R8C successor');
no(contract.r8cBoundary.projectionRuntimeConstructedAtR8B, 'projection runtime prohibited');
no(contract.r8cBoundary.presentationRuntimeConstructedAtR8B, 'presentation runtime prohibited');
no(contract.r8cBoundary.visiblePrototypeConstructedAtR8B, 'visible prototype prohibited');

eq(contract.r8dBoundary.statusAtR8BClosure, 'BLOCKED_BY_R8C', 'R8D blocked by R8C');
no(contract.r8dBoundary.r8dMayBeginAtR8BClosure, 'R8D may not begin');

for (const prohibition of [
  'STORE_SYSTEM_COORDINATES_IN_CANONICAL_DELIVERY_STATE',
  'ASSUME_UNIVERSAL_EUCLIDEAN_SCIENTIFIC_METRIC',
  'INFER_SCIENTIFIC_RELATION_FROM_DISTANCE',
  'CONSTRUCT_CONCRETE_SYSTEM_CHART_INSTANCE',
  'CONSTRUCT_COORDINATE_EMBEDDING_RUNTIME',
  'CONSTRUCT_COORDINATE_TRANSITION_RUNTIME',
  'CONSTRUCT_PROJECTION_RUNTIME',
  'CONSTRUCT_PRESENTATION_RUNTIME',
  'CONSTRUCT_VISIBLE_R8_PROTOTYPE',
  'REOPEN_R6','REOPEN_R7','REOPEN_R8A','MERGE_TO_MAIN','EXECUTE_R9'
]) has(contract.prohibited, prohibition, `required prohibition ${prohibition}`);

const validChart = {
  codomainDimension: 2,
  dimensions: [
    { dimensionIndex: 0, semanticClass: 'INDEX_COORDINATE' },
    { dimensionIndex: 1, semanticClass: 'TEMPORAL_NUMERIC' }
  ],
  metricPolicy: { distanceMeaning: 'NONE' },
  topologyPolicy: { neighborhoodMeaning: 'NONE' },
  recoverabilityClass: 'EXACT_COORDINATE_CHART',
  invertibleOnDeclaredDomain: true
};
yes(validateSyntheticChart(validChart), 'valid synthetic chart');
assert.throws(() => validateSyntheticChart({ ...validChart, dimensions: [validChart.dimensions[0], validChart.dimensions[0]] }), AtlasContractError, 'duplicate dimension fails closed');
assert.throws(() => validateSyntheticChart({ ...validChart, dimensions: [{dimensionIndex:0, semanticClass:'UNDECLARED'}, validChart.dimensions[1]] }), AtlasContractError, 'undeclared semantic fails closed');
assert.throws(() => validateSyntheticChart({ ...validChart, metricPolicy: { distanceMeaning: 'MEANINGFUL' } }), AtlasContractError, 'undeclared metric fails closed');
assert.throws(() => validateSyntheticChart({ ...validChart, topologyPolicy: { neighborhoodMeaning: 'MEANINGFUL' } }), AtlasContractError, 'undeclared topology fails closed');
assert.throws(() => validateSyntheticChart({ ...validChart, invertibleOnDeclaredDomain: false }), AtlasContractError, 'noninvertible exact chart fails closed');
eq(requireCommonCoordinateDomain(false), 'NO_COMMON_COORDINATE_DOMAIN', 'no overlap fails closed');
eq(requireCommonCoordinateDomain(true), 'DECLARED_COMMON_COORDINATE_DOMAIN', 'declared overlap admitted');

yes(contract.closure.r8bPassClosed, 'R8B must be terminally closed');
yes(contract.closure.r8RemainsOpen, 'R8 remains open');
no(contract.closure.r8PassClosed, 'R8 may not close at R8B');
no(contract.closure.r9Unlock, 'R9 remains locked');
eq(contract.closure.userDifferentialCarried, 'NO_MATERIAL_IMPROVEMENT', 'carried user differential');
eq(contract.closure.scientificMutation, 'NONE', 'scientific mutation');
eq(contract.closure.publicMutation, 'NONE', 'public mutation');
eq(contract.closure.mainMutation, 'NONE', 'main mutation');
no(contract.closure.concreteChartInstancesConstructed, 'no concrete chart instances');
no(contract.closure.coordinateEmbeddingRuntimeConstructed, 'no embedding runtime');
no(contract.closure.coordinateTransitionRuntimeConstructed, 'no coordinate-transition runtime');
no(contract.closure.projectionRuntimeConstructed, 'no projection runtime');
no(contract.closure.presentationRuntimeConstructed, 'no presentation runtime');
no(contract.closure.visiblePrototypeConstructed, 'no visible prototype');
eq(contract.closure.nextSubcheckpointOnPass, 'R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION', 'next subcheckpoint');
eq(contract.closure.r8cEligibility, 'ELIGIBLE_READY_FOR_EXECUTION', 'R8C eligibility');
eq(contract.closure.r8dStatus, 'BLOCKED_BY_R8C', 'R8D block');

const result = {
  schema: 'METHODS_MODELS_F12_R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT_VERIFICATION_RESULT_v1',
  status: 'PASS_CLOSED',
  subcheckpoint: contract.subcheckpoint,
  atlas: contract.systemCoordinateAtlas.id,
  canonicalStateSpace: contract.r8aCanonicalStateSpace.id,
  manifoldStatus: contract.r8aCanonicalStateSpace.manifoldStatus,
  concreteChartInstancesConstructed: contract.closure.concreteChartInstancesConstructed,
  coordinateEmbeddingRuntimeConstructed: contract.closure.coordinateEmbeddingRuntimeConstructed,
  coordinateTransitionRuntimeConstructed: contract.closure.coordinateTransitionRuntimeConstructed,
  r6AuthorizedTransformationCount: contract.r6Compatibility.r6AuthorizedTransformationCountRemains,
  r7SpatialTransformationDependentStateCount: contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains,
  noCommonCoordinateDomainDisposition: contract.chartOverlapContract.outsideOverlapDisposition,
  r8bPassClosed: contract.closure.r8bPassClosed,
  r8PassClosed: contract.closure.r8PassClosed,
  r9Unlock: contract.closure.r9Unlock,
  nextSubcheckpointOnPass: contract.closure.nextSubcheckpointOnPass,
  r8cEligibility: contract.closure.r8cEligibility,
  r8dStatus: contract.closure.r8dStatus,
  scientificMutation: contract.closure.scientificMutation,
  publicMutation: contract.closure.publicMutation,
  mainMutation: contract.closure.mainMutation
};

console.log(JSON.stringify(result, null, 2));
