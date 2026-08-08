import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';

const ROOT = 'control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const CONTRACT_PATH = `${ROOT}/r8c-transform-projection-presentation-separation.v1.json`;
const R8B_PATH = `${ROOT}/r8b-system-coordinate-atlas-contract.v1.json`;
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const r8b = JSON.parse(readFileSync(R8B_PATH, 'utf8'));

const eq = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const yes = (value, label) => assert.equal(value, true, label);
const no = (value, label) => assert.equal(value, false, label);
const has = (array, value, label) => assert.ok(Array.isArray(array) && array.includes(value), label);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();

class SeparationContractError extends Error {}

function classifyPrimitive(operation) {
  const classes = [
    operation.coordinateTransition === true ? 'COORDINATE_TRANSITION' : null,
    operation.projection === true ? 'PROJECTION' : null,
    operation.presentation === true ? 'PRESENTATION' : null
  ].filter(Boolean);
  if (classes.length === 0) throw new SeparationContractError('UNCLASSIFIED_PRIMITIVE_OPERATION');
  if (classes.length !== 1) throw new SeparationContractError('AMBIGUOUS_PRIMITIVE_OPERATION_CLASS');
  return classes[0];
}

function validateTransition(t) {
  if (t.declaredOverlap !== true) throw new SeparationContractError('COORDINATE_TRANSITION_OUTSIDE_DECLARED_OVERLAP');
  if (t.roundtripRecoverable !== true) throw new SeparationContractError('COORDINATE_TRANSITION_ROUNDTRIP_FAILURE');
  if (t.canonicalInvariantDigestBefore !== t.canonicalInvariantDigestAfter) throw new SeparationContractError('CANONICAL_INVARIANT_DRIFT');
  if (t.projectionDisclosureBefore !== t.projectionDisclosureAfter) throw new SeparationContractError('COORDINATE_TRANSITION_DISCLOSURE_DRIFT');
  if (t.reducesInformation === true) throw new SeparationContractError('COORDINATE_TRANSITION_INFORMATION_REDUCTION');
  return true;
}

function validateProjection(p) {
  if (!p.disclosurePolicyDeclared) throw new SeparationContractError('PROJECTION_WITHOUT_DECLARED_DISCLOSURE_POLICY');
  if (!contract.projectionContract.disclosureStates.includes(p.disclosureState)) throw new SeparationContractError('UNDECLARED_PROJECTION_DISCLOSURE_STATE');
  if (p.canonicalPresence === 'ABSENT_FROM_CANONICAL_STATE' && p.disclosureState === 'HIDDEN_BY_PROJECTION') {
    throw new SeparationContractError('PROJECTION_HIDDEN_TREATED_AS_CANONICAL_ABSENCE');
  }
  if (p.scientificMutation === true || p.typedRelationMutation === true || p.evidenceUpgrade === true || p.claimCeilingUpgrade === true) {
    throw new SeparationContractError('PROJECTION_SCIENTIFIC_AUTHORSHIP_ATTEMPT');
  }
  return true;
}

function validatePresentation(p) {
  if (p.sourceProjectionDigest !== p.boundProjectionDigest) throw new SeparationContractError('PRESENTATION_SOURCE_PROJECTION_MISMATCH');
  if (p.projectionDisclosureBefore !== p.projectionDisclosureAfter) throw new SeparationContractError('PRESENTATION_DISCLOSURE_DRIFT');
  if (p.createsCoordinates === true) throw new SeparationContractError('PRESENTATION_COORDINATE_AUTHORSHIP_ATTEMPT');
  if (p.nonrenderingDisposition === 'HIDDEN_BY_PROJECTION') throw new SeparationContractError('PRESENTATION_NONRENDERING_TREATED_AS_PROJECTION_HIDDEN');
  if (p.nonrenderingDisposition === 'ABSENT_FROM_CANONICAL_STATE') throw new SeparationContractError('PRESENTATION_NONRENDERING_TREATED_AS_CANONICAL_ABSENCE');
  return true;
}

eq(git('rev-parse', 'HEAD^'), 'd0003cacb20d5f478a3ad0fcb819477b8ca44409', 'exact R8B parent');
eq(git('rev-parse', 'd0003cacb20d5f478a3ad0fcb819477b8ca44409^{tree}'), '215a504d16c57c2ffd79fda96fc5cbe572d0bfe9', 'R8B parent tree');
eq(git('rev-parse', `HEAD:${R8B_PATH}`), 'ccbe92dc0f4bcee99a34f17ef9efdfcea4329ccf', 'R8B contract blob drift');
eq(r8b.status, 'PASS_CLOSED', 'R8B status');
yes(r8b.closure.r8bPassClosed, 'R8B terminal closure');
no(r8b.closure.r8PassClosed, 'R8 remains open after R8B');
no(r8b.closure.r9Unlock, 'R9 remains blocked after R8B');
eq(r8b.closure.nextSubcheckpointOnPass, 'R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION', 'R8C named by R8B');
eq(r8b.closure.r8cEligibility, 'ELIGIBLE_READY_FOR_EXECUTION', 'R8C eligibility from R8B');
eq(r8b.closure.r8dStatus, 'BLOCKED_BY_R8C', 'R8D blocked before R8C');

eq(contract.schema, 'METHODS_MODELS_F12_R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION_CONTRACT_v1', 'schema');
eq(contract.program, 'F12_RECURSIVE_SPATIAL_INFORMATION_ARCHITECTURE_REMEDIATION_v1', 'program');
eq(contract.checkpoint, 'R8_BOUNDED_EXPERIENTIAL_PROTOTYPE', 'checkpoint');
eq(contract.subcheckpoint, 'R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION', 'subcheckpoint');
eq(contract.status, 'PASS_CLOSED', 'terminal status');
eq(contract.verification.requiredTerminalStatus, 'PASS_CLOSED', 'required terminal status');
eq(contract.parentAuthority.head, 'd0003cacb20d5f478a3ad0fcb819477b8ca44409', 'parent head');
eq(contract.parentAuthority.tree, '215a504d16c57c2ffd79fda96fc5cbe572d0bfe9', 'parent tree');
yes(contract.parentAuthority.r8bPassClosed, 'R8B pass carried');
eq(contract.parentAuthority.r8Status, 'OPEN_REMEDIATION', 'R8 open');
eq(contract.parentAuthority.r9Status, 'BLOCKED_BY_R8', 'R9 blocked');

eq(contract.frozenScientificInputs.scientificStateDigest, 'dde02e9b56c157caf7e6bf511067089c6bb65c068731883efd610f6722fcb0a5', 'scientific digest');
eq(contract.frozenScientificInputs.relationGraphDigest, '4dabc8872082535d01d9bfae3cd9661be68dcf7e1cd6aed5280a9028d4b8137b', 'relation digest');
eq(contract.frozenScientificInputs.projectionGraphDigest, '9ebef4a6b8102ffd251c8e7809d379bff560d09fe9c75baa3f707768927b6ce8', 'projection digest');
eq(contract.frozenDeliveryArchitecture.canonicalStateSpace, 'CANONICAL_DELIVERY_INFORMATION_STATE_SPACE_v1', 'canonical state-space id');
eq(contract.frozenDeliveryArchitecture.coordinateAtlas, 'SYSTEM_COORDINATE_ATLAS_v1', 'atlas id');
eq(contract.frozenDeliveryArchitecture.manifoldStatus, 'NOT_ASSUMED', 'manifold status');
no(contract.frozenDeliveryArchitecture.concreteChartInstancesConstructed, 'no chart instances');

eq(contract.threeWaySeparation.law, 'COORDINATE_TRANSITION_NE_PROJECTION_NE_PRESENTATION', 'three-way law');
eq(contract.threeWaySeparation.primitiveOperationClasses, ['COORDINATE_TRANSITION','PROJECTION','PRESENTATION'], 'primitive classes');
yes(contract.threeWaySeparation.primitiveClassificationMustBeExactlyOne, 'exactly one primitive class');
no(contract.threeWaySeparation.mixedPrimitiveOperationPermitted, 'mixed primitive prohibited');
yes(contract.threeWaySeparation.mixedBehaviorMustBeDecomposedIntoOrderedComposition, 'mixed behavior decomposed');

eq(contract.coordinateTransitionContract.notation, 'T_B<-A=phi_B o phi_A^-1', 'transition notation');
yes(contract.coordinateTransitionContract.requiresExactCoordinateCharts, 'exact charts');
yes(contract.coordinateTransitionContract.requiresDeclaredOverlap, 'declared overlap');
yes(contract.coordinateTransitionContract.requiresRoundtripRecoverability, 'roundtrip');
yes(contract.coordinateTransitionContract.canonicalInvariantDigestMustBePreserved, 'invariant preservation');
no(contract.coordinateTransitionContract.projectionDisclosureStateMayChange, 'transition cannot change disclosure');
no(contract.coordinateTransitionContract.mayReduceInformation, 'transition cannot reduce information');
eq(contract.coordinateTransitionContract.outsideOverlapDisposition, 'NO_COMMON_COORDINATE_DOMAIN', 'outside-overlap disposition');
no(contract.coordinateTransitionContract.runtimeConstructedAtR8C, 'no transition runtime');

eq(contract.projectionContract.notation, 'P_S:V_S->W_S', 'projection notation');
yes(contract.projectionContract.projectionMayReduceDimension, 'projection may reduce dimension');
yes(contract.projectionContract.projectionMayReduceDisclosure, 'projection may reduce disclosure');
yes(contract.projectionContract.projectionMayBeNoninvertible, 'projection may be noninvertible');
eq(contract.projectionContract.disclosureStates, ['EXPOSED_BY_PROJECTION','HIDDEN_BY_PROJECTION','NOT_REPRESENTABLE_IN_SELECTED_PROJECTION'], 'projection disclosure states');
no(contract.projectionContract.hiddenByProjectionIsCanonicalAbsence, 'hidden is not absence');
no(contract.projectionContract.projectionMayEraseCanonicalExistence, 'projection cannot erase canonical existence');
no(contract.projectionContract.projectionMayCreateScientificMeaning, 'projection no scientific authorship');
yes(contract.projectionContract.identityProjectionPermitted, 'identity projection allowed');
yes(contract.projectionContract.identityProjectionStillClassifiedAsProjection, 'identity projection remains projection');
no(contract.projectionContract.runtimeConstructedAtR8C, 'no projection runtime');

eq(contract.presentationContract.notation, 'rho_M:W_S->Y_M', 'presentation notation');
yes(contract.presentationContract.presentationConsumesProjectionState, 'presentation consumes projection');
no(contract.presentationContract.presentationMayCreateCoordinates, 'presentation cannot create coordinates');
no(contract.presentationContract.presentationMayPerformCoordinateTransition, 'presentation cannot transition');
no(contract.presentationContract.presentationMayCreateProjectionDisclosurePolicy, 'presentation cannot author disclosure');
no(contract.presentationContract.presentationMayChangeProjectionDisclosureState, 'presentation cannot change disclosure');
no(contract.presentationContract.presentationMayInferCanonicalAbsenceFromNonrendering, 'nonrendering is not absence');
no(contract.presentationContract.runtimeConstructedAtR8C, 'no presentation runtime');

yes(contract.presentationEquivalence.textFirstIsEquivalentPresentationOfSameProjectionState, 'text-first equivalence');
yes(contract.presentationEquivalence.accessibilityIsEquivalentPresentationOfSameProjectionState, 'accessibility equivalence');
no(contract.presentationEquivalence.visualPresentationMaySuppressProjectionExposedScientificContent, 'visual may not suppress exposed content');
no(contract.presentationEquivalence.textPresentationMaySuppressProjectionExposedScientificContent, 'text may not suppress exposed content');
no(contract.presentationEquivalence.presentationUnavailabilityIsProjectionHidden, 'presentation unavailability not projection hidden');
no(contract.presentationEquivalence.presentationUnavailabilityIsCanonicalAbsence, 'presentation unavailability not canonical absence');

for (const law of [
  'HIDDEN_BY_PROJECTION_NE_ABSENT_FROM_CANONICAL_STATE',
  'NOT_REPRESENTABLE_IN_SELECTED_CHART_NE_ABSENT_FROM_CANONICAL_STATE',
  'NOT_REPRESENTABLE_IN_SELECTED_PROJECTION_NE_ABSENT_FROM_CANONICAL_STATE',
  'UNAVAILABLE_IN_PRESENTATION_MODALITY_NE_HIDDEN_BY_PROJECTION',
  'UNAVAILABLE_IN_PRESENTATION_MODALITY_NE_ABSENT_FROM_CANONICAL_STATE',
  'PRESENTATION_NONRENDERING_NE_PROJECTION_DISCLOSURE_DECISION'
]) has(contract.presenceDisclosurePresentationDispositions.laws, law, `required disposition law ${law}`);

eq(contract.compositionContract.orderedPipeline, ['CANONICAL_DELIVERY_STATE','SYSTEM_COORDINATE_STATE','OPTIONAL_EXACT_COORDINATE_TRANSITION','PROJECTION_STATE','PRESENTATION_STATE'], 'ordered pipeline');
eq(contract.compositionContract.canonicalToCoordinateRuntimeTarget, 'R8D_DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE', 'R8D runtime target');
yes(contract.compositionContract.coordinateTransitionMayOnlyOccurBeforeProjection, 'transition before projection');
yes(contract.compositionContract.projectionMustPrecedePresentation, 'projection before presentation');
yes(contract.compositionContract.presentationMayNotFeedBackIntoProjection, 'no presentation feedback');
yes(contract.compositionContract.projectionMayNotFeedBackIntoCoordinateAuthority, 'no projection feedback');
yes(contract.compositionContract.coordinateRepresentationMayNotFeedBackIntoScientificAuthority, 'no coordinate feedback');
no(contract.compositionContract.directPresentationScientificMutationPathPermitted, 'no presentation-to-science path');

eq(contract.r6Compatibility.r6AuthorizedTransformationCountRemains, 0, 'R6 transform count');
no(contract.r6Compatibility.coordinateTransitionIsR6SpatialTransformation, 'coordinate transition is not R6 transform');
no(contract.r6Compatibility.projectionIsR6SpatialTransformation, 'projection is not R6 transform');
no(contract.r6Compatibility.presentationIsR6SpatialTransformation, 'presentation is not R6 transform');
no(contract.r6Compatibility.r8cCreatesR6TransformationAuthority, 'R8C no R6 inflation');

eq(contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains, 0, 'R7 dependent-state count');
yes(contract.r7Compatibility.scientificRecoverabilityWithoutSpatialInteractionRemainsRequired, 'R7 recoverability');
yes(contract.r7Compatibility.accessibilityAndTextFirstBindToSameContinuityCore, 'R7 continuity core');

for (const prohibition of [
  'CONSTRUCT_CONCRETE_SYSTEM_CHART_INSTANCE',
  'CONSTRUCT_COORDINATE_EMBEDDING_RUNTIME',
  'CONSTRUCT_COORDINATE_TRANSITION_RUNTIME',
  'CONSTRUCT_PROJECTION_RUNTIME',
  'CONSTRUCT_PRESENTATION_RUNTIME',
  'CONSTRUCT_VISIBLE_R8_PROTOTYPE',
  'CLASSIFY_MIXED_BEHAVIOR_AS_ONE_PRIMITIVE_OPERATION',
  'ALLOW_COORDINATE_TRANSITION_TO_REDUCE_DISCLOSURE',
  'ALLOW_PRESENTATION_TO_CHANGE_PROJECTION_DISCLOSURE',
  'TREAT_PRESENTATION_NONRENDERING_AS_CANONICAL_ABSENCE',
  'TREAT_PROJECTION_HIDDEN_AS_CANONICAL_ABSENCE',
  'EXECUTE_SPATIAL_TRANSFORMATION',
  'REOPEN_R6','REOPEN_R7','REOPEN_R8A','REOPEN_R8B','MERGE_TO_MAIN','EXECUTE_R9'
]) has(contract.prohibited, prohibition, `required prohibition ${prohibition}`);

eq(classifyPrimitive({ coordinateTransition: true, projection: false, presentation: false }), 'COORDINATE_TRANSITION', 'transition classification');
eq(classifyPrimitive({ coordinateTransition: false, projection: true, presentation: false }), 'PROJECTION', 'projection classification');
eq(classifyPrimitive({ coordinateTransition: false, projection: false, presentation: true }), 'PRESENTATION', 'presentation classification');
assert.throws(() => classifyPrimitive({ coordinateTransition: false, projection: false, presentation: false }), SeparationContractError, 'unclassified primitive fails closed');
assert.throws(() => classifyPrimitive({ coordinateTransition: true, projection: true, presentation: false }), SeparationContractError, 'mixed transition/projection fails closed');
assert.throws(() => classifyPrimitive({ coordinateTransition: false, projection: true, presentation: true }), SeparationContractError, 'mixed projection/presentation fails closed');

const validTransition = {
  declaredOverlap: true,
  roundtripRecoverable: true,
  canonicalInvariantDigestBefore: 'same',
  canonicalInvariantDigestAfter: 'same',
  projectionDisclosureBefore: 'UNCHANGED',
  projectionDisclosureAfter: 'UNCHANGED',
  reducesInformation: false
};
yes(validateTransition(validTransition), 'valid transition');
assert.throws(() => validateTransition({ ...validTransition, declaredOverlap: false }), SeparationContractError, 'outside overlap fails closed');
assert.throws(() => validateTransition({ ...validTransition, roundtripRecoverable: false }), SeparationContractError, 'roundtrip failure fails closed');
assert.throws(() => validateTransition({ ...validTransition, projectionDisclosureAfter: 'HIDDEN_BY_PROJECTION' }), SeparationContractError, 'transition disclosure drift fails closed');
assert.throws(() => validateTransition({ ...validTransition, reducesInformation: true }), SeparationContractError, 'transition information reduction fails closed');

const validProjection = {
  disclosurePolicyDeclared: true,
  disclosureState: 'HIDDEN_BY_PROJECTION',
  canonicalPresence: 'PRESENT_IN_CANONICAL_STATE',
  scientificMutation: false,
  typedRelationMutation: false,
  evidenceUpgrade: false,
  claimCeilingUpgrade: false
};
yes(validateProjection(validProjection), 'valid projection');
assert.throws(() => validateProjection({ ...validProjection, disclosurePolicyDeclared: false }), SeparationContractError, 'undeclared projection policy fails closed');
assert.throws(() => validateProjection({ ...validProjection, canonicalPresence: 'ABSENT_FROM_CANONICAL_STATE' }), SeparationContractError, 'hidden-as-absence fails closed');
assert.throws(() => validateProjection({ ...validProjection, scientificMutation: true }), SeparationContractError, 'projection scientific authorship fails closed');

const validPresentation = {
  sourceProjectionDigest: 'projection-digest',
  boundProjectionDigest: 'projection-digest',
  projectionDisclosureBefore: 'EXPOSED_BY_PROJECTION',
  projectionDisclosureAfter: 'EXPOSED_BY_PROJECTION',
  createsCoordinates: false,
  nonrenderingDisposition: 'UNAVAILABLE_IN_PRESENTATION_MODALITY'
};
yes(validatePresentation(validPresentation), 'valid presentation');
assert.throws(() => validatePresentation({ ...validPresentation, boundProjectionDigest: 'other' }), SeparationContractError, 'projection-source mismatch fails closed');
assert.throws(() => validatePresentation({ ...validPresentation, projectionDisclosureAfter: 'HIDDEN_BY_PROJECTION' }), SeparationContractError, 'presentation disclosure drift fails closed');
assert.throws(() => validatePresentation({ ...validPresentation, createsCoordinates: true }), SeparationContractError, 'presentation coordinate authorship fails closed');
assert.throws(() => validatePresentation({ ...validPresentation, nonrenderingDisposition: 'HIDDEN_BY_PROJECTION' }), SeparationContractError, 'nonrendering-as-hidden fails closed');
assert.throws(() => validatePresentation({ ...validPresentation, nonrenderingDisposition: 'ABSENT_FROM_CANONICAL_STATE' }), SeparationContractError, 'nonrendering-as-absence fails closed');

yes(contract.closure.r8cPassClosed, 'R8C terminal closure');
yes(contract.closure.r8RemainsOpen, 'R8 remains open');
no(contract.closure.r8PassClosed, 'R8 may not close at R8C');
no(contract.closure.r9Unlock, 'R9 remains locked');
eq(contract.closure.userDifferentialCarried, 'NO_MATERIAL_IMPROVEMENT', 'carried user differential');
eq(contract.closure.scientificMutation, 'NONE', 'scientific mutation');
eq(contract.closure.publicMutation, 'NONE', 'public mutation');
eq(contract.closure.mainMutation, 'NONE', 'main mutation');
no(contract.closure.coordinateEmbeddingRuntimeConstructed, 'no embedding runtime');
no(contract.closure.coordinateTransitionRuntimeConstructed, 'no transition runtime');
no(contract.closure.projectionRuntimeConstructed, 'no projection runtime');
no(contract.closure.presentationRuntimeConstructed, 'no presentation runtime');
no(contract.closure.visiblePrototypeConstructed, 'no visible prototype');
eq(contract.closure.nextSubcheckpointOnPass, 'R8D_DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE', 'next subcheckpoint');
eq(contract.closure.r8dEligibility, 'ELIGIBLE_READY_FOR_EXECUTION', 'R8D eligibility');

const result = {
  schema: 'METHODS_MODELS_F12_R8C_TRANSFORM_PROJECTION_PRESENTATION_SEPARATION_VERIFICATION_RESULT_v1',
  status: 'PASS_CLOSED',
  subcheckpoint: contract.subcheckpoint,
  separationLaw: contract.threeWaySeparation.law,
  coordinateTransitionRuntimeConstructed: contract.closure.coordinateTransitionRuntimeConstructed,
  projectionRuntimeConstructed: contract.closure.projectionRuntimeConstructed,
  presentationRuntimeConstructed: contract.closure.presentationRuntimeConstructed,
  visiblePrototypeConstructed: contract.closure.visiblePrototypeConstructed,
  r6AuthorizedTransformationCount: contract.r6Compatibility.r6AuthorizedTransformationCountRemains,
  r7SpatialTransformationDependentStateCount: contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains,
  r8cPassClosed: contract.closure.r8cPassClosed,
  r8PassClosed: contract.closure.r8PassClosed,
  r9Unlock: contract.closure.r9Unlock,
  nextSubcheckpointOnPass: contract.closure.nextSubcheckpointOnPass,
  r8dEligibility: contract.closure.r8dEligibility,
  scientificMutation: contract.closure.scientificMutation,
  publicMutation: contract.closure.publicMutation,
  mainMutation: contract.closure.mainMutation
};

console.log(JSON.stringify(result, null, 2));
