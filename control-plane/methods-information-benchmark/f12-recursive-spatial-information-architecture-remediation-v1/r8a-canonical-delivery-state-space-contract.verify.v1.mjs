import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ROOT = 'control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const CONTRACT_PATH = `${ROOT}/r8a-canonical-delivery-state-space-contract.v1.json`;
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));

const eq = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const yes = (value, label) => assert.equal(value, true, label);
const no = (value, label) => assert.equal(value, false, label);
const has = (array, value, label) => assert.ok(Array.isArray(array) && array.includes(value), label);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

eq(contract.schema, 'METHODS_MODELS_F12_R8A_CANONICAL_DELIVERY_STATE_SPACE_CONTRACT_v1', 'schema');
eq(contract.program, 'F12_RECURSIVE_SPATIAL_INFORMATION_ARCHITECTURE_REMEDIATION_v1', 'program');
eq(contract.checkpoint, 'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE', 'checkpoint');
eq(contract.subcheckpoint, 'R8A_CANONICAL_DELIVERY_STATE_SPACE_CONTRACT', 'subcheckpoint');
eq(contract.status, 'PASS_CLOSED', 'terminal status');
eq(contract.verification.requiredTerminalStatus, 'PASS_CLOSED', 'required terminal status');

eq(contract.parentAuthority.head, 'b0efa41c13fa061828bf7674a97b35aacaa34071', 'parent head');
eq(contract.parentAuthority.tree, '321feeacdad97388eca6c329225e057ecd2e8272', 'parent tree');
eq(contract.parentAuthority.contractGitBlobSha, '86ea28520cc4954ab533142fc22abd0cac5a9d9e', 'corridor contract blob');
eq(contract.parentAuthority.r9Status, 'BLOCKED_BY_R8', 'R9 remains blocked');

eq(contract.reviewFailureEvidence.candidateHead, 'bb22e805ca6a029d7caa95d16dc710ae280d40da', 'review evidence head');
eq(contract.reviewFailureEvidence.candidateTree, '27825a0d38f043bd36975d9ba1aa1356e13b7663', 'review evidence tree');
eq(contract.reviewFailureEvidence.userDifferential, 'NO_MATERIAL_IMPROVEMENT', 'user differential');
eq(contract.reviewFailureEvidence.candidateClass, 'PERMANENT_NONCONTROLLING_R8_FAILURE_EVIDENCE', 'failure evidence class');
no(contract.reviewFailureEvidence.mayBeUsedAsControllingPresentationBaseline, 'rejected prototype may not control');
no(contract.reviewFailureEvidence.mayUnlockR9, 'rejected prototype may not unlock R9');

const r1Blob = git('rev-parse', `HEAD:${ROOT}/r1-authority-boundary-contract.v1.json`);
const r6Blob = git('rev-parse', `HEAD:${ROOT}/r6-spatial-transformation-grammar-contract.v1.json`);
const r7Blob = git('rev-parse', `HEAD:${ROOT}/r7-continuity-and-accessibility-contract.v1.json`);
eq(r1Blob, contract.authorityBoundary.r1ContractGitBlobSha, 'R1 blob drift');
eq(r6Blob, contract.authorityBoundary.r6ContractGitBlobSha, 'R6 blob drift');
eq(r7Blob, contract.authorityBoundary.r7ContractGitBlobSha, 'R7 blob drift');

for (const field of [
  'scientificAuthority','scientificOntologyAuthority','typedRelationAuthority','claimAuthority',
  'claimCeilingAuthority','sourceAdmissionAuthority','coordinateChartAuthority','projectionRuntimeAuthority',
  'presentationRuntimeAuthority','spatialTransformationExecutionAuthority','mayMutateR0ThroughR7',
  'mayMutateF1ThroughF11','mayMutatePublicMethods','mayMutateMain'
]) no(contract.authorityBoundary[field], `authority boundary ${field}`);

eq(contract.frozenScientificInputs.scientificStateDigest, 'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5', 'scientific digest');
eq(contract.frozenScientificInputs.relationGraphDigest, '4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b', 'relation digest');
eq(contract.frozenScientificInputs.projectionGraphDigest, '9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8', 'projection digest');
eq(contract.frozenScientificInputs.mode, 'READ_ONLY', 'scientific input mode');

eq(contract.canonicalDeliveryStateSpace.id, 'CANONICAL_DELIVERY_INFORMATION_STATE_SPACE_v1', 'state space id');
eq(contract.canonicalDeliveryStateSpace.symbol, 'M_D', 'state space symbol');
eq(contract.canonicalDeliveryStateSpace.manifoldStatus, 'NOT_ASSUMED', 'manifold status');
no(contract.canonicalDeliveryStateSpace.smoothManifoldClaimed, 'smooth manifold may not be assumed');
no(contract.canonicalDeliveryStateSpace.localEuclideanStructureClaimed, 'local Euclidean structure may not be assumed');
yes(contract.canonicalDeliveryStateSpace.productOrStratifiedStateSpacePermitted, 'product or stratified state space permitted');
no(contract.canonicalDeliveryStateSpace.coordinatesStoredInCanonicalState, 'coordinates excluded from canonical state');
no(contract.canonicalDeliveryStateSpace.systemSpecificCoordinatesStoredInCanonicalState, 'system coordinates excluded');
no(contract.canonicalDeliveryStateSpace.presentationPropertiesStoredInCanonicalState, 'presentation excluded');

eq(contract.deliveryEmbeddingContract.expression, 'm_i(F)=eta(o_i,F) in M_D', 'embedding expression');
no(contract.deliveryEmbeddingContract.runtimeConstructedAtR8A, 'R8A may not construct embedding runtime');
yes(contract.deliveryEmbeddingContract.readOnlyUpstream, 'embedding must be read only upstream');
no(contract.deliveryEmbeddingContract.mayCreateScientificObject, 'embedding may not create scientific object');
no(contract.deliveryEmbeddingContract.mayCreateTypedRelation, 'embedding may not create relation');
no(contract.deliveryEmbeddingContract.mayInferScientificMeaningFromGeometry, 'geometry may not author science');

eq(contract.deliveryStateRecord.conceptualNotation, 'Q_i^F', 'delivery state notation');
no(contract.deliveryStateRecord.recordIsScientificCanonicalObject, 'Q_i^F is not scientific object');
yes(contract.deliveryStateRecord.recordIsDeliveryState, 'Q_i^F is delivery state');
for (const field of ['systemCoordinateVector','x','y','z','cameraPosition','renderStyle','visualProminence','euclideanScientificDistance','systemSpecificStateSigma']) {
  has(contract.deliveryStateRecord.forbiddenFields, field, `forbidden canonical field ${field}`);
}

eq(contract.canonicalInvariantsAcrossSystemCoordinateChanges.members, [
  'IDENTITY','SOURCE_AUTHORITY','LINEAGE','TYPED_RELATIONS','EVIDENCE_STANDING','CLAIM_CEILING','SCIENTIFIC_STATE'
], 'canonical invariant set');
no(contract.canonicalInvariantsAcrossSystemCoordinateChanges.coordinateChangeMayAlterObjectMeaning, 'coordinate change cannot alter meaning');
no(contract.canonicalInvariantsAcrossSystemCoordinateChanges.coordinateChangeMayCreateScientificRelation, 'coordinate change cannot create relation');
eq(contract.presenceAndDisclosureLaw.law, 'HIDDEN_BY_PROJECTION_NE_ABSENT_FROM_CANONICAL_STATE', 'presence/disclosure law');
no(contract.presenceAndDisclosureLaw.absenceMayBeInferredFromNonExposure, 'nonexposure cannot imply absence');
no(contract.futureSystemChartInterface.chartMayBeDefinedAtR8A, 'R8A cannot construct chart');
yes(contract.futureSystemChartInterface.systemCoordinatesAreDerived, 'coordinates are derived');
no(contract.futureSystemChartInterface.systemCoordinatesAreCanonicalScientificTruth, 'coordinates are not science');
yes(contract.futureSystemChartInterface.chartMustDeclareMetricOrTopologyWhenDistanceCarriesMeaning, 'metric/topology declaration');
no(contract.futureSystemChartInterface.universalEuclideanRelationMetricAssumed, 'universal Euclidean metric prohibited');
no(contract.coordinateTransitionBoundary.transitionRuntimeConstructedAtR8A, 'transition runtime prohibited');
eq(contract.coordinateTransitionBoundary.outsideOverlapDisposition, 'NO_COMMON_COORDINATE_DOMAIN', 'overlap fail closed');
yes(contract.coordinateTransitionBoundary.roundtripRequiredForTrueCoordinateTransition, 'roundtrip required');
no(contract.coordinateTransitionBoundary.coordinateTransformIsProjection, 'transform != projection');
no(contract.coordinateTransitionBoundary.coordinateTransformIsPresentation, 'transform != presentation');
no(contract.projectionBoundary.projectionRuntimeConstructedAtR8A, 'projection runtime prohibited');
no(contract.projectionBoundary.projectionMayEraseCanonicalExistence, 'projection cannot erase canonical existence');
no(contract.presentationBoundary.presentationCreatesCoordinates, 'presentation cannot create coordinates');
no(contract.presentationBoundary.presentationCreatesScientificMeaning, 'presentation cannot create science');
no(contract.presentationBoundary.spatialModeToggleRequired, 'spatial mode toggle is not required');
no(contract.presentationBoundary.spatialArchitectureMayBeOptionalMode, 'spatial architecture cannot be optional peer mode');
eq(contract.r6Compatibility.law, 'SPATIAL_EMBEDDING_NE_SPATIAL_TRANSFORMATION', 'R6 compatibility law');
eq(contract.r6Compatibility.r6AuthorizedTransformationCountRemains, 0, 'R6 transform count');
no(contract.r6Compatibility.coordinateBearingStateRequiresR6Reopen, 'R6 reopen prohibited');
eq(contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains, 0, 'R7 spatial dependent state count');
yes(contract.r7Compatibility.scientificRecoverabilityWithoutSpatialInteractionRemainsRequired, 'R7 recoverability');
no(contract.r7Compatibility.textFirstEquivalentIsPeerSpatialMode, 'text first cannot become peer mode');
eq(contract.threeWaySeparation.law, 'COORDINATE_TRANSFORM_NE_PROJECTION_NE_PRESENTATION', 'three way separation');
no(contract.layerPlacement.L5AToL5CAreNewScientificLayers, 'L5A-L5C are not scientific layers');
yes(contract.layerPlacement.L5AToL5CAreSubordinateDeliveryArchitecture, 'L5A-L5C are subordinate delivery architecture');

for (const prohibition of [
  'CREATE_NEW_SCIENTIFIC_CANONICAL_OBJECT','ASSUME_SMOOTH_MANIFOLD_STRUCTURE',
  'STORE_SYSTEM_COORDINATES_IN_CANONICAL_DELIVERY_STATE','CONSTRUCT_SYSTEM_COORDINATE_ATLAS',
  'CONSTRUCT_VISIBLE_R8_PROTOTYPE','EXECUTE_SPATIAL_TRANSFORMATION','REOPEN_R6','REOPEN_R7',
  'PUBLIC_METHODS_REPLACEMENT','MERGE_TO_MAIN','EXECUTE_R9'
]) has(contract.prohibited, prohibition, `required prohibition ${prohibition}`);

for (const reason of [
  'SCIENTIFIC_OBJECT_REWRITE_ATTEMPT','SYSTEM_COORDINATE_IN_CANONICAL_STATE',
  'SMOOTH_MANIFOLD_ASSUMPTION_WITHOUT_PROOF','PROJECTION_HIDDEN_TREATED_AS_CANONICAL_ABSENCE',
  'EUCLIDEAN_DISTANCE_USED_AS_UNDECLARED_SCIENTIFIC_RELATION','R6_TRANSFORMATION_AUTHORITY_INFLATION',
  'R7_SPATIAL_DEPENDENCY_INTRODUCTION','R9_EXECUTION_ATTEMPT'
]) has(contract.failClosedReasons, reason, `required fail closed reason ${reason}`);

yes(contract.closure.r8aPassClosed, 'R8A must be terminally closed');
yes(contract.closure.r8RemainsOpen, 'R8 must remain open');
no(contract.closure.r8PassClosed, 'R8 may not close at R8A');
no(contract.closure.r9Unlock, 'R9 must remain locked');
eq(contract.closure.userDifferentialCarried, 'NO_MATERIAL_IMPROVEMENT', 'carried differential');
eq(contract.closure.scientificMutation, 'NONE', 'scientific mutation');
eq(contract.closure.publicMutation, 'NONE', 'public mutation');
eq(contract.closure.mainMutation, 'NONE', 'main mutation');
no(contract.closure.visiblePrototypeConstructed, 'R8A is nonvisual');
eq(contract.closure.nextSubcheckpointOnPass, 'R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT', 'next subcheckpoint');

const result = {
  schema: 'METHODS_MODELS_F12_R8A_CANONICAL_DELIVERY_STATE_SPACE_VERIFICATION_RESULT_v1',
  status: 'PASS_CLOSED',
  subcheckpoint: contract.subcheckpoint,
  stateSpace: contract.canonicalDeliveryStateSpace.id,
  manifoldStatus: contract.canonicalDeliveryStateSpace.manifoldStatus,
  reviewFailureEvidence: {
    head: contract.reviewFailureEvidence.candidateHead,
    userDifferential: contract.reviewFailureEvidence.userDifferential,
    controlling: false
  },
  invariants: contract.canonicalInvariantsAcrossSystemCoordinateChanges.members,
  separationLaw: contract.threeWaySeparation.law,
  r6AuthorizedTransformationCount: contract.r6Compatibility.r6AuthorizedTransformationCountRemains,
  r7SpatialTransformationDependentStateCount: contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains,
  r8aPassClosed: contract.closure.r8aPassClosed,
  r8PassClosed: contract.closure.r8PassClosed,
  r9Unlock: contract.closure.r9Unlock,
  nextSubcheckpointOnPass: contract.closure.nextSubcheckpointOnPass,
  scientificMutation: contract.closure.scientificMutation,
  publicMutation: contract.closure.publicMutation,
  mainMutation: contract.closure.mainMutation
};

console.log(JSON.stringify(result, null, 2));
