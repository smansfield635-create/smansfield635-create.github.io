import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  ENGINE_ID,
  STATE_SPACE_ID,
  ATLAS_ID,
  SEPARATION_LAW,
  FROZEN_SCIENTIFIC_INPUTS,
  ENGINE_MANIFEST,
  CoordinateEmbeddingError,
  compileChart,
  deriveChartDigest,
  canonicalInvariantDigest,
  embedCoordinateState,
  verifyCoordinateState
} from './r8d-deterministic-coordinate-embedding-engine.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const CONTRACT_PATH = `${ROOT}/r8d-deterministic-coordinate-embedding-engine-contract.v1.json`;
const R8A_PATH = `${ROOT}/r8a-canonical-delivery-state-space-contract.v1.json`;
const R8B_PATH = `${ROOT}/r8b-system-coordinate-atlas-contract.v1.json`;
const R8C_PATH = `${ROOT}/r8c-transform-projection-presentation-separation.v1.json`;
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const r8a = JSON.parse(readFileSync(R8A_PATH, 'utf8'));
const r8b = JSON.parse(readFileSync(R8B_PATH, 'utf8'));
const r8c = JSON.parse(readFileSync(R8C_PATH, 'utf8'));

const eq = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const yes = (value, label) => assert.equal(value, true, label);
const no = (value, label) => assert.equal(value, false, label);
const has = (array, value, label) => assert.ok(Array.isArray(array) && array.includes(value), label);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const clone = (value) => JSON.parse(JSON.stringify(value));

function expectCode(fn, code) {
  assert.throws(fn, (error) => error instanceof CoordinateEmbeddingError && error.code === code, `expected ${code}`);
}

function reverseObjectKeys(value) {
  if (Array.isArray(value)) return value.map(reverseObjectKeys);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).reverse().map(([key, child]) => [key, reverseObjectKeys(child)]));
  }
  return value;
}

const stateA = {
  deliveryStateId: 'SYNTHETIC_DELIVERY_STATE_A',
  sourceObjectIdentityRef: 'SYNTHETIC_OBJECT_A',
  contextFrameId: 'SYNTHETIC_FRAME_A',
  destinationRef: 'SYNTHETIC_DESTINATION',
  familyDescriptorRef: 'SYNTHETIC_FAMILY_A',
  typedRelationRefs: ['SYNTHETIC_RELATION_1'],
  recursiveDepth: 1,
  ancestorLineage: ['SYNTHETIC_ROOT', 'SYNTHETIC_PARENT_A'],
  evidenceStandingRef: 'SYNTHETIC_EVIDENCE_STANDING',
  claimCeilingRef: 'SYNTHETIC_CLAIM_CEILING',
  scientificStateRef: 'SYNTHETIC_SCIENTIFIC_STATE_REF',
  sourceAuthorityRef: 'SYNTHETIC_SOURCE_AUTHORITY',
  sourceRecordDigests: ['synthetic-source-digest-a'],
  temporalDescriptorRef: 'SYNTHETIC_TIME_A',
  disclosureStateRef: 'SYNTHETIC_DISCLOSURE_A',
  continuityStateRef: 'SYNTHETIC_CONTINUITY_A',
  canonicalPresenceState: 'PRESENT_IN_CANONICAL_STATE'
};

const stateB = {
  ...clone(stateA),
  deliveryStateId: 'SYNTHETIC_DELIVERY_STATE_B',
  sourceObjectIdentityRef: 'SYNTHETIC_OBJECT_B',
  contextFrameId: 'SYNTHETIC_FRAME_B',
  familyDescriptorRef: 'SYNTHETIC_FAMILY_B',
  recursiveDepth: 2,
  ancestorLineage: ['SYNTHETIC_ROOT', 'SYNTHETIC_PARENT_B'],
  sourceRecordDigests: ['synthetic-source-digest-b'],
  temporalDescriptorRef: 'SYNTHETIC_TIME_B',
  disclosureStateRef: 'SYNTHETIC_DISCLOSURE_B',
  continuityStateRef: 'SYNTHETIC_CONTINUITY_B'
};

function chartA() {
  return {
    chartId: 'SYNTHETIC_CONFORMANCE_CHART_A',
    chartVersion: '1',
    systemId: 'SYNTHETIC_SYSTEM_A',
    canonicalDomainDeclaration: { type: 'ALL_ADMITTED_DELIVERY_STATES' },
    codomainDimension: 3,
    representedDimensions: ['DEPTH_AXIS', 'FAMILY_AXIS', 'IDENTITY_AXIS'],
    coordinateSemantics: [
      {
        dimensionId: 'DEPTH_AXIS',
        dimensionIndex: 0,
        label: 'Synthetic recursive depth coordinate',
        semanticClass: 'ORDINAL_NUMERIC',
        sourceDeliveryFieldRefs: ['recursiveDepth'],
        valueDomain: { type: 'ANY_FINITE_NUMBER' },
        normalizationRule: { type: 'IDENTITY_NUMERIC' },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      },
      {
        dimensionId: 'FAMILY_AXIS',
        dimensionIndex: 1,
        label: 'Synthetic declared family index',
        semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['familyDescriptorRef'],
        valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_FAMILY_A', 'SYNTHETIC_FAMILY_B'] },
        normalizationRule: {
          type: 'DECLARED_LOOKUP',
          entries: [
            { value: 'SYNTHETIC_FAMILY_A', coordinate: 0 },
            { value: 'SYNTHETIC_FAMILY_B', coordinate: 1 }
          ]
        },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      },
      {
        dimensionId: 'IDENTITY_AXIS',
        dimensionIndex: 2,
        label: 'Synthetic declared identity index',
        semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['sourceObjectIdentityRef'],
        valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_OBJECT_A', 'SYNTHETIC_OBJECT_B'] },
        normalizationRule: {
          type: 'DECLARED_LOOKUP',
          entries: [
            { value: 'SYNTHETIC_OBJECT_A', coordinate: 10 },
            { value: 'SYNTHETIC_OBJECT_B', coordinate: 20 }
          ]
        },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      }
    ],
    recoverabilityClass: 'EXACT_COORDINATE_CHART',
    metricPolicy: { distanceMeaning: 'NONE' },
    topologyPolicy: { neighborhoodMeaning: 'NONE' },
    overlapDeclarations: [],
    authorityBasis: 'R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT_SYNTHETIC_CONFORMANCE_ONLY',
    chartDigest: 'AUTO_DERIVE'
  };
}

function chartB() {
  return {
    chartId: 'SYNTHETIC_CONFORMANCE_CHART_B',
    chartVersion: '1',
    systemId: 'SYNTHETIC_SYSTEM_B',
    canonicalDomainDeclaration: { type: 'ALL_ADMITTED_DELIVERY_STATES' },
    codomainDimension: 3,
    representedDimensions: ['IDENTITY_AXIS_B', 'DEPTH_AXIS_B', 'FAMILY_AXIS_B'],
    coordinateSemantics: [
      {
        dimensionId: 'IDENTITY_AXIS_B',
        dimensionIndex: 0,
        label: 'Synthetic alternate identity index',
        semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['sourceObjectIdentityRef'],
        valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_OBJECT_A', 'SYNTHETIC_OBJECT_B'] },
        normalizationRule: {
          type: 'DECLARED_LOOKUP',
          entries: [
            { value: 'SYNTHETIC_OBJECT_A', coordinate: 100 },
            { value: 'SYNTHETIC_OBJECT_B', coordinate: 200 }
          ]
        },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      },
      {
        dimensionId: 'DEPTH_AXIS_B',
        dimensionIndex: 1,
        label: 'Synthetic alternate depth coordinate',
        semanticClass: 'ORDINAL_NUMERIC',
        sourceDeliveryFieldRefs: ['recursiveDepth'],
        valueDomain: { type: 'ANY_FINITE_NUMBER' },
        normalizationRule: { type: 'AFFINE_NUMERIC', scale: 10, offset: 0 },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      },
      {
        dimensionId: 'FAMILY_AXIS_B',
        dimensionIndex: 2,
        label: 'Synthetic alternate family index',
        semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['familyDescriptorRef'],
        valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_FAMILY_A', 'SYNTHETIC_FAMILY_B'] },
        normalizationRule: {
          type: 'DECLARED_LOOKUP',
          entries: [
            { value: 'SYNTHETIC_FAMILY_A', coordinate: 5 },
            { value: 'SYNTHETIC_FAMILY_B', coordinate: 15 }
          ]
        },
        distanceParticipation: false,
        authorityBasis: 'SYNTHETIC_CONFORMANCE_ONLY'
      }
    ],
    recoverabilityClass: 'EXACT_COORDINATE_CHART',
    metricPolicy: { distanceMeaning: 'NONE' },
    topologyPolicy: { neighborhoodMeaning: 'NONE' },
    overlapDeclarations: [],
    authorityBasis: 'R8B_SYSTEM_COORDINATE_ATLAS_CONTRACT_SYNTHETIC_CONFORMANCE_ONLY',
    chartDigest: 'AUTO_DERIVE'
  };
}

// Exact parent and frozen payload identity.
eq(git('rev-parse', 'HEAD^'), '071abfc15af87b9350d037ee05fed528631be9a8', 'exact R8C parent');
eq(git('rev-parse', '071abfc15af87b9350d037ee05fed528631be9a8^{tree}'), '989d1d9c7de41836b11616de5f24b0d1ad6e42d8', 'R8C parent tree');
eq(git('rev-parse', `HEAD:${R8C_PATH}`), 'd0c8441bb88b68b91282ff334270b739305ed97b', 'R8C contract blob');
eq(git('rev-parse', `HEAD:${R8B_PATH}`), 'ccbe92dc0f4bcee99a34f17ef9efdfcea4329ccf', 'R8B contract blob');
eq(git('rev-parse', `HEAD:${R8A_PATH}`), '3f593061fa3d4906c769707904108249943e3826', 'R8A contract blob');
eq(git('rev-parse', `HEAD:${ROOT}/r6-spatial-transformation-grammar-contract.v1.json`), '6abb8d6b30fc92aa1eaff44ca7f8ec4e567b5938', 'R6 contract blob');
eq(git('rev-parse', `HEAD:${ROOT}/r7-continuity-and-accessibility-contract.v1.json`), '475aa283c3feb2fb6520f953c0a96d94285bc214', 'R7 contract blob');

eq(r8a.status, 'PASS_CLOSED', 'R8A terminal');
eq(r8b.status, 'PASS_CLOSED', 'R8B terminal');
eq(r8c.status, 'PASS_CLOSED', 'R8C terminal');
yes(r8c.closure.r8cPassClosed, 'R8C closure');
no(r8c.closure.r8PassClosed, 'R8 remains open at parent');
no(r8c.closure.r9Unlock, 'R9 remains blocked at parent');

// Contract terminal semantics and immutable scientific boundary.
eq(contract.schema, 'METHODS_MODELS_F12_R8D_DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE_CONTRACT_v1', 'schema');
eq(contract.subcheckpoint, 'R8D_DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE', 'subcheckpoint');
eq(contract.status, 'PASS_CLOSED', 'terminal status');
eq(contract.verification.requiredTerminalStatus, 'PASS_CLOSED', 'required terminal status');
eq(contract.parentAuthority.head, '071abfc15af87b9350d037ee05fed528631be9a8', 'parent head');
eq(contract.parentAuthority.tree, '989d1d9c7de41836b11616de5f24b0d1ad6e42d8', 'parent tree');
yes(contract.parentAuthority.r8cPassClosed, 'R8C pass carried');

eq(contract.frozenScientificInputs, {
  head: FROZEN_SCIENTIFIC_INPUTS.head,
  scientificStateDigest: FROZEN_SCIENTIFIC_INPUTS.scientificStateDigest,
  relationGraphDigest: FROZEN_SCIENTIFIC_INPUTS.relationGraphDigest,
  projectionGraphDigest: FROZEN_SCIENTIFIC_INPUTS.projectionGraphDigest,
  mode: 'READ_ONLY'
}, 'frozen scientific inputs');

eq(contract.frozenDeliveryContracts.r8aStateSpace.id, STATE_SPACE_ID, 'state space');
eq(contract.frozenDeliveryContracts.r8bAtlas.id, ATLAS_ID, 'atlas');
eq(contract.frozenDeliveryContracts.r8cSeparation.law, SEPARATION_LAW, 'separation law');

yes(contract.authorityBoundary.coordinateEmbeddingRuntimeAuthority, 'embedding runtime authority');
no(contract.authorityBoundary.estateChartSemanticAuthorshipAuthority, 'no estate chart semantic authorship');
no(contract.authorityBoundary.coordinateTransitionRuntimeAuthority, 'no transition runtime');
no(contract.authorityBoundary.projectionRuntimeAuthority, 'no projection runtime');
no(contract.authorityBoundary.presentationRuntimeAuthority, 'no presentation runtime');
no(contract.authorityBoundary.visiblePrototypeAuthority, 'no visible prototype');
no(contract.authorityBoundary.mayMutateMain, 'no main mutation authority');

// Runtime identity and capability boundary.
eq(ENGINE_MANIFEST.engineId, ENGINE_ID, 'engine id');
eq(ENGINE_MANIFEST.stateSpaceId, STATE_SPACE_ID, 'runtime state space');
eq(ENGINE_MANIFEST.atlasId, ATLAS_ID, 'runtime atlas');
eq(ENGINE_MANIFEST.separationLaw, SEPARATION_LAW, 'runtime separation law');
yes(ENGINE_MANIFEST.coordinateEmbeddingRuntimeConstructed, 'embedding runtime constructed');
no(ENGINE_MANIFEST.coordinateTransitionRuntimeConstructed, 'transition runtime absent');
no(ENGINE_MANIFEST.projectionRuntimeConstructed, 'projection runtime absent');
no(ENGINE_MANIFEST.presentationRuntimeConstructed, 'presentation runtime absent');
no(ENGINE_MANIFEST.visiblePrototypeConstructed, 'visible runtime absent');
eq(ENGINE_MANIFEST.r6AuthorizedTransformationCount, 0, 'R6 transform count');
eq(ENGINE_MANIFEST.r7SpatialTransformationDependentStateCount, 0, 'R7 dependency count');

// Deterministic chart compilation and coordinate embedding.
const inputChartA = chartA();
const inputChartASnapshot = JSON.stringify(inputChartA);
const compiledA = compileChart(inputChartA);
assert.match(compiledA.chartDigest, /^[0-9a-f]{64}$/);
eq(compiledA.chartDigest, deriveChartDigest(compiledA), 'chart digest protocol');
eq(JSON.stringify(inputChartA), inputChartASnapshot, 'chart input immutable');

const stateASnapshot = JSON.stringify(stateA);
const a1 = embedCoordinateState(stateA, inputChartA);
const a2 = embedCoordinateState(stateA, inputChartA);
eq(a1, a2, 'same state and chart deterministic');
eq(a1.coordinateVector, [1, 0, 10], 'chart A vector');
eq(a1.representedDimensionIds, ['DEPTH_AXIS', 'FAMILY_AXIS', 'IDENTITY_AXIS'], 'chart A dimension order');
eq(a1.systemSpecificStateSigma, {}, 'undeclared sigma empty');
eq(JSON.stringify(stateA), stateASnapshot, 'source state immutable');
yes(verifyCoordinateState(a1, stateA, inputChartA), 'coordinate state verifier');

const reorderedStateA = reverseObjectKeys(stateA);
const reorderedA = embedCoordinateState(reorderedStateA, reverseObjectKeys(inputChartA));
eq(reorderedA, a1, 'JSON object key order invariance');

const b1 = embedCoordinateState(stateA, chartB());
eq(b1.coordinateVector, [100, 10, 5], 'chart B vector');
assert.notDeepEqual(b1.coordinateVector, a1.coordinateVector, 'different system charts may yield different coordinates');
eq(b1.sourceDeliveryStateId, a1.sourceDeliveryStateId, 'same canonical source identity carried');
eq(b1.canonicalInvariantDigest, a1.canonicalInvariantDigest, 'canonical invariant digest across charts');
eq(a1.canonicalInvariantDigest, canonicalInvariantDigest(stateA), 'coordinate state carries canonical invariant digest');

// Domain nonrepresentability is fail-closed and not canonical absence or projection hiding.
const restricted = chartA();
restricted.chartId = 'SYNTHETIC_RESTRICTED_CHART';
restricted.canonicalDomainDeclaration = { type: 'FIELD_EQUALS', fieldRef: 'familyDescriptorRef', value: 'SYNTHETIC_FAMILY_A' };
const nonrepresentable = embedCoordinateState(stateB, restricted);
eq(nonrepresentable.representationState, 'NOT_REPRESENTABLE_IN_SELECTED_CHART', 'chart domain miss');
no(nonrepresentable.canonicalAbsence, 'domain miss not canonical absence');
no(nonrepresentable.projectionHidden, 'domain miss not projection hidden');
assert.ok(!Object.prototype.hasOwnProperty.call(nonrepresentable, 'coordinateVector'), 'no fabricated coordinate vector on domain miss');

// Fail-closed adversarial cases.
const coordinateContaminatedState = { ...clone(stateA), x: 1 };
expectCode(() => embedCoordinateState(coordinateContaminatedState, chartA()), 'SYSTEM_COORDINATE_IN_CANONICAL_STATE');

const absentState = { ...clone(stateA), canonicalPresenceState: 'ABSENT_FROM_CANONICAL_STATE' };
expectCode(() => embedCoordinateState(absentState, chartA()), 'CANONICAL_STATE_ABSENT');

const missingFieldState = clone(stateA);
delete missingFieldState.sourceAuthorityRef;
expectCode(() => embedCoordinateState(missingFieldState, chartA()), 'MISSING_CANONICAL_DELIVERY_FIELD');

const duplicateIndex = chartA();
duplicateIndex.coordinateSemantics[2].dimensionIndex = 1;
expectCode(() => compileChart(duplicateIndex), 'DUPLICATE_CHART_DIMENSION_INDEX');

const orderMismatch = chartA();
orderMismatch.representedDimensions = ['FAMILY_AXIS', 'DEPTH_AXIS', 'IDENTITY_AXIS'];
expectCode(() => compileChart(orderMismatch), 'REPRESENTED_DIMENSION_ORDER_MISMATCH');

const unsupportedRule = chartA();
unsupportedRule.coordinateSemantics[0].normalizationRule = { type: 'UNDECLARED_RULE' };
expectCode(() => compileChart(unsupportedRule), 'UNSUPPORTED_NORMALIZATION_RULE');

const noninvertible = chartA();
noninvertible.recoverabilityClass = 'NONINVERTIBLE_REPRESENTATION_NOT_A_COORDINATE_CHART';
expectCode(() => compileChart(noninvertible), 'NONINVERTIBLE_REPRESENTATION_NOT_ADMISSIBLE_AS_COORDINATE_CHART');

const badDigest = chartA();
badDigest.chartDigest = '0'.repeat(64);
expectCode(() => compileChart(badDigest), 'CHART_DIGEST_MISMATCH');

const downstreamContaminated = chartA();
downstreamContaminated.projectionPolicy = { hidden: true };
expectCode(() => compileChart(downstreamContaminated), 'DOWNSTREAM_OPERATION_FIELD_PROHIBITED_IN_CHART');

const scientificRewrite = chartA();
scientificRewrite.scientificClaimRewrite = 'FORBIDDEN';
expectCode(() => compileChart(scientificRewrite), 'SCIENTIFIC_REWRITE_FIELD_PROHIBITED');

const unknownFamilyState = { ...clone(stateA), familyDescriptorRef: 'SYNTHETIC_FAMILY_OUTSIDE_DECLARED_LOOKUP' };
expectCode(() => embedCoordinateState(unknownFamilyState, chartA()), 'COORDINATE_VALUE_OUTSIDE_DECLARED_DOMAIN');

const nondeterministicCandidate = { ...clone(a1), coordinateVector: [999, 999, 999] };
expectCode(() => verifyCoordinateState(nondeterministicCandidate, stateA, chartA()), 'NONDETERMINISTIC_COORDINATE_STATE');

// Contract laws and terminal closure.
eq(contract.canonicalInvariantDigest.members, [
  'IDENTITY',
  'SOURCE_AUTHORITY',
  'LINEAGE',
  'TYPED_RELATIONS',
  'EVIDENCE_STANDING',
  'CLAIM_CEILING',
  'SCIENTIFIC_STATE'
], 'canonical invariant set');
eq(contract.domainDeclarationContract.domainMissDisposition, 'NOT_REPRESENTABLE_IN_SELECTED_CHART', 'domain miss disposition');
no(contract.domainDeclarationContract.domainMissIsCanonicalAbsence, 'domain miss not absence');
no(contract.domainDeclarationContract.domainMissIsProjectionHidden, 'domain miss not projection hidden');
no(contract.conformanceFixtureBoundary.syntheticFixtureScientificAuthority, 'fixtures no science authority');
no(contract.conformanceFixtureBoundary.syntheticFixtureEstateAuthority, 'fixtures no estate authority');
no(contract.conformanceFixtureBoundary.syntheticFixtureMayCanonizeRealAxisSemantics, 'fixtures no axis canonization');
no(contract.conformanceFixtureBoundary.concreteEstateChartInstancesConstructedAtR8D, 'no estate charts');

eq(contract.r6Compatibility.r6AuthorizedTransformationCountRemains, 0, 'contract R6 transform count');
eq(contract.r7Compatibility.expectedSpatialTransformationDependentStateCountRemains, 0, 'contract R7 dependency count');
no(contract.r8cCompatibility.coordinateTransitionRuntimeConstructed, 'contract transition absent');
no(contract.r8cCompatibility.projectionRuntimeConstructed, 'contract projection absent');
no(contract.r8cCompatibility.presentationRuntimeConstructed, 'contract presentation absent');
no(contract.r8cCompatibility.visiblePrototypeConstructed, 'contract visible prototype absent');

for (const prohibition of [
  'INVENT_REAL_ESTATE_AXIS_SEMANTICS',
  'CONSTRUCT_COORDINATE_TRANSITION_RUNTIME',
  'CONSTRUCT_PROJECTION_RUNTIME',
  'CONSTRUCT_PRESENTATION_RUNTIME',
  'CONSTRUCT_VISIBLE_R8_PROTOTYPE',
  'EXECUTE_SPATIAL_TRANSFORMATION',
  'MERGE_TO_MAIN',
  'EXECUTE_R9'
]) has(contract.prohibited, prohibition, `required prohibition ${prohibition}`);

for (const reason of [
  'SYSTEM_COORDINATE_IN_CANONICAL_STATE',
  'NONINVERTIBLE_REPRESENTATION_NOT_ADMISSIBLE_AS_COORDINATE_CHART',
  'CHART_DIGEST_MISMATCH',
  'NONDETERMINISTIC_COORDINATE_STATE',
  'CANONICAL_INVARIANT_DIGEST_DRIFT',
  'COORDINATE_TRANSITION_CONSTRUCTION_ATTEMPT',
  'PROJECTION_RUNTIME_CONSTRUCTION_ATTEMPT',
  'PRESENTATION_RUNTIME_CONSTRUCTION_ATTEMPT',
  'R9_EXECUTION_ATTEMPT'
]) has(contract.failClosedReasons, reason, `required fail-closed reason ${reason}`);

yes(contract.closure.r8dPassClosed, 'R8D terminal closure');
yes(contract.closure.r8RemainsOpen, 'R8 remains open');
no(contract.closure.r8PassClosed, 'whole R8 not closed');
no(contract.closure.r9Unlock, 'R9 locked');
eq(contract.closure.userDifferentialCarried, 'NO_MATERIAL_IMPROVEMENT', 'user differential carried');
eq(contract.closure.scientificMutation, 'NONE', 'scientific mutation');
eq(contract.closure.publicMutation, 'NONE', 'public mutation');
eq(contract.closure.mainMutation, 'NONE', 'main mutation');
yes(contract.closure.coordinateEmbeddingRuntimeConstructed, 'embedding runtime closure');
yes(contract.closure.syntheticConformanceChartsConstructed, 'synthetic conformance charts');
no(contract.closure.concreteEstateChartInstancesConstructed, 'no concrete estate charts');
no(contract.closure.coordinateTransitionRuntimeConstructed, 'no transition runtime closure');
no(contract.closure.projectionRuntimeConstructed, 'no projection runtime closure');
no(contract.closure.presentationRuntimeConstructed, 'no presentation runtime closure');
no(contract.closure.visiblePrototypeConstructed, 'no visible prototype closure');
eq(contract.closure.nextSubcheckpointOnPass, 'R8E_CROSS_FRAME_INVARIANCE_AND_ROUNDTRIP_VERIFICATION', 'next subcheckpoint');
eq(contract.closure.r8eEligibility, 'ELIGIBLE_READY_FOR_EXECUTION', 'R8E eligibility');

const result = {
  schema: 'METHODS_MODELS_F12_R8D_DETERMINISTIC_COORDINATE_EMBEDDING_ENGINE_VERIFICATION_RESULT_v1',
  status: 'PASS_CLOSED',
  subcheckpoint: contract.subcheckpoint,
  engineId: ENGINE_ID,
  deterministicEmbeddingVerified: true,
  objectKeyOrderInvariantVerified: true,
  chartDigestVerified: true,
  coordinateStateDigestVerified: true,
  sourceAndChartImmutabilityVerified: true,
  crossChartCanonicalInvariantDigestPreserved: true,
  chartNonrepresentabilityFailClosedVerified: true,
  syntheticConformanceChartsConstructed: true,
  concreteEstateChartInstancesConstructed: false,
  r6AuthorizedTransformationCount: ENGINE_MANIFEST.r6AuthorizedTransformationCount,
  r7SpatialTransformationDependentStateCount: ENGINE_MANIFEST.r7SpatialTransformationDependentStateCount,
  coordinateEmbeddingRuntimeConstructed: true,
  coordinateTransitionRuntimeConstructed: false,
  projectionRuntimeConstructed: false,
  presentationRuntimeConstructed: false,
  visiblePrototypeConstructed: false,
  r8dPassClosed: true,
  r8PassClosed: false,
  r9Unlock: false,
  nextSubcheckpointOnPass: contract.closure.nextSubcheckpointOnPass,
  r8eEligibility: contract.closure.r8eEligibility,
  scientificMutation: 'NONE',
  publicMutation: 'NONE',
  mainMutation: 'NONE'
};

console.log(JSON.stringify(result, null, 2));
