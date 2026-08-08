import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  FROZEN_SCIENTIFIC_INPUTS,
  ENGINE_MANIFEST,
  compileChart,
  embedCoordinateState,
  sha256Canonical
} from './r8d-deterministic-coordinate-embedding-engine.v1.mjs';
import {
  HARNESS_ID,
  OVERLAP_POLICY,
  RESOLUTION_POLICY,
  ROUNDTRIP_LAW,
  HARNESS_MANIFEST,
  CrossFrameVerificationError,
  compileDeclaredOverlap,
  verifyCrossFrameRoundtrip,
  deriveAndVerifyCrossFrame
} from './r8e-cross-frame-invariance-roundtrip-verification.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/f12-recursive-spatial-information-architecture-remediation-v1';
const CONTRACT_PATH = `${ROOT}/r8e-cross-frame-invariance-roundtrip-verification-contract.v1.json`;
const R8D_CONTRACT_PATH = `${ROOT}/r8d-deterministic-coordinate-embedding-engine-contract.v1.json`;
const R8D_RUNTIME_PATH = `${ROOT}/r8d-deterministic-coordinate-embedding-engine.v1.mjs`;
const R8C_PATH = `${ROOT}/r8c-transform-projection-presentation-separation.v1.json`;
const R8B_PATH = `${ROOT}/r8b-system-coordinate-atlas-contract.v1.json`;
const R8A_PATH = `${ROOT}/r8a-canonical-delivery-state-space-contract.v1.json`;
const contract = JSON.parse(readFileSync(CONTRACT_PATH, 'utf8'));
const r8d = JSON.parse(readFileSync(R8D_CONTRACT_PATH, 'utf8'));
const r8c = JSON.parse(readFileSync(R8C_PATH, 'utf8'));
const r8b = JSON.parse(readFileSync(R8B_PATH, 'utf8'));
const r8a = JSON.parse(readFileSync(R8A_PATH, 'utf8'));

const eq = (actual, expected, label) => assert.deepEqual(actual, expected, label);
const yes = (value, label) => assert.equal(value, true, label);
const no = (value, label) => assert.equal(value, false, label);
const has = (array, value, label) => assert.ok(Array.isArray(array) && array.includes(value), label);
const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const clone = (value) => JSON.parse(JSON.stringify(value));

function expectCode(fn, code) {
  assert.throws(fn, (error) => error instanceof CrossFrameVerificationError && error.code === code, `expected ${code}`);
}

const sourceState = {
  deliveryStateId: 'SYNTHETIC_R8E_DELIVERY_STATE_A',
  sourceObjectIdentityRef: 'SYNTHETIC_R8E_OBJECT_A',
  contextFrameId: 'SYNTHETIC_R8E_FRAME',
  destinationRef: 'SYNTHETIC_R8E_DESTINATION',
  familyDescriptorRef: 'SYNTHETIC_R8E_FAMILY_ALPHA',
  typedRelationRefs: ['SYNTHETIC_R8E_RELATION_SUPPORT', 'SYNTHETIC_R8E_RELATION_ADVERSE'],
  recursiveDepth: 3,
  ancestorLineage: ['SYNTHETIC_ROOT', 'SYNTHETIC_DESTINATION', 'SYNTHETIC_CLAIM'],
  evidenceStandingRef: 'SYNTHETIC_EVIDENCE_STANDING',
  claimCeilingRef: 'SYNTHETIC_CLAIM_CEILING',
  scientificStateRef: 'SYNTHETIC_SCIENTIFIC_STATE',
  sourceAuthorityRef: 'SYNTHETIC_SOURCE_AUTHORITY',
  sourceRecordDigests: ['synthetic-r8e-source-digest'],
  temporalDescriptorRef: '2026-08-08T00:00:00.000Z',
  disclosureStateRef: 'SYNTHETIC_DISCLOSURE_STATE',
  continuityStateRef: 'SYNTHETIC_CONTINUITY_STATE',
  canonicalPresenceState: 'PRESENT_IN_CANONICAL_STATE'
};

const secondState = {
  ...clone(sourceState),
  deliveryStateId: 'SYNTHETIC_R8E_DELIVERY_STATE_B',
  sourceObjectIdentityRef: 'SYNTHETIC_R8E_OBJECT_B',
  recursiveDepth: 4,
  ancestorLineage: ['SYNTHETIC_ROOT', 'SYNTHETIC_DESTINATION', 'SYNTHETIC_CLAIM', 'SYNTHETIC_RELATION']
};

function overlap(peerChartId, peerChartVersion, overlapId = 'SYNTHETIC_R8E_OVERLAP_AB') {
  return {
    overlapId,
    peerChartId,
    peerChartVersion,
    canonicalOverlapPolicy: OVERLAP_POLICY,
    resolutionPolicy: RESOLUTION_POLICY,
    reciprocityRequired: true
  };
}

function chartA() {
  return {
    chartId: 'SYNTHETIC_R8E_CHART_A',
    chartVersion: '1',
    systemId: 'SYNTHETIC_R8E_SYSTEM_A',
    canonicalDomainDeclaration: { type: 'ALL_ADMITTED_DELIVERY_STATES' },
    codomainDimension: 2,
    representedDimensions: ['R8E_DEPTH_A', 'R8E_FAMILY_A'],
    coordinateSemantics: [
      {
        dimensionId: 'R8E_DEPTH_A', dimensionIndex: 0, label: 'Synthetic depth A', semanticClass: 'ORDINAL_NUMERIC',
        sourceDeliveryFieldRefs: ['recursiveDepth'], valueDomain: { type: 'ANY_FINITE_NUMBER' },
        normalizationRule: { type: 'IDENTITY_NUMERIC' }, distanceParticipation: false, authorityBasis: 'SYNTHETIC_R8E_ONLY'
      },
      {
        dimensionId: 'R8E_FAMILY_A', dimensionIndex: 1, label: 'Synthetic family A', semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['familyDescriptorRef'], valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_R8E_FAMILY_ALPHA'] },
        normalizationRule: { type: 'DECLARED_LOOKUP', entries: [{ value: 'SYNTHETIC_R8E_FAMILY_ALPHA', coordinate: 2 }] },
        distanceParticipation: false, authorityBasis: 'SYNTHETIC_R8E_ONLY'
      }
    ],
    recoverabilityClass: 'EXACT_COORDINATE_CHART',
    metricPolicy: { distanceMeaning: 'NONE' },
    topologyPolicy: { neighborhoodMeaning: 'NONE' },
    overlapDeclarations: [overlap('SYNTHETIC_R8E_CHART_B', '1')],
    authorityBasis: 'R8E_SYNTHETIC_CONFORMANCE_ONLY',
    chartDigest: 'AUTO_DERIVE'
  };
}

function chartB() {
  return {
    chartId: 'SYNTHETIC_R8E_CHART_B',
    chartVersion: '1',
    systemId: 'SYNTHETIC_R8E_SYSTEM_B',
    canonicalDomainDeclaration: { type: 'ALL_ADMITTED_DELIVERY_STATES' },
    codomainDimension: 3,
    representedDimensions: ['R8E_FAMILY_B', 'R8E_DEPTH_B', 'R8E_IDENTITY_B'],
    coordinateSemantics: [
      {
        dimensionId: 'R8E_FAMILY_B', dimensionIndex: 0, label: 'Synthetic family B', semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['familyDescriptorRef'], valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_R8E_FAMILY_ALPHA'] },
        normalizationRule: { type: 'DECLARED_LOOKUP', entries: [{ value: 'SYNTHETIC_R8E_FAMILY_ALPHA', coordinate: 50 }] },
        distanceParticipation: false, authorityBasis: 'SYNTHETIC_R8E_ONLY'
      },
      {
        dimensionId: 'R8E_DEPTH_B', dimensionIndex: 1, label: 'Synthetic depth B', semanticClass: 'ORDINAL_NUMERIC',
        sourceDeliveryFieldRefs: ['recursiveDepth'], valueDomain: { type: 'ANY_FINITE_NUMBER' },
        normalizationRule: { type: 'AFFINE_NUMERIC', scale: 10, offset: 7 }, distanceParticipation: false, authorityBasis: 'SYNTHETIC_R8E_ONLY'
      },
      {
        dimensionId: 'R8E_IDENTITY_B', dimensionIndex: 2, label: 'Synthetic identity B', semanticClass: 'INDEX_COORDINATE',
        sourceDeliveryFieldRefs: ['sourceObjectIdentityRef'], valueDomain: { type: 'DECLARED_VALUES', values: ['SYNTHETIC_R8E_OBJECT_A', 'SYNTHETIC_R8E_OBJECT_B'] },
        normalizationRule: { type: 'DECLARED_LOOKUP', entries: [
          { value: 'SYNTHETIC_R8E_OBJECT_A', coordinate: 101 },
          { value: 'SYNTHETIC_R8E_OBJECT_B', coordinate: 202 }
        ] },
        distanceParticipation: false, authorityBasis: 'SYNTHETIC_R8E_ONLY'
      }
    ],
    recoverabilityClass: 'EXACT_COORDINATE_CHART',
    metricPolicy: { distanceMeaning: 'NONE' },
    topologyPolicy: { neighborhoodMeaning: 'NONE' },
    overlapDeclarations: [overlap('SYNTHETIC_R8E_CHART_A', '1')],
    authorityBasis: 'R8E_SYNTHETIC_CONFORMANCE_ONLY',
    chartDigest: 'AUTO_DERIVE'
  };
}

eq(git('rev-parse', 'HEAD^'), 'e3c45e93237286933bd07f843d7d06bcf73a4a2c', 'exact R8D parent');
eq(git('rev-parse', 'e3c45e93237286933bd07f843d7d06bcf73a4a2c^{tree}'), '538902a082f55479a279a7e28be8bf17e283dfec', 'R8D parent tree');
eq(git('rev-parse', `HEAD:${R8D_CONTRACT_PATH}`), 'c851d474a662d4f80c0342ec93c3d7ebe062e53b', 'R8D contract blob');
eq(git('rev-parse', `HEAD:${R8D_RUNTIME_PATH}`), '0605d450116b0583592fa2906bca71eb4c2598fa', 'R8D runtime blob');
eq(git('rev-parse', `HEAD:${R8C_PATH}`), 'd0c8441bb88b68b91282ff334270b739305ed97b', 'R8C contract blob');
eq(git('rev-parse', `HEAD:${R8B_PATH}`), 'ccbe92dc0f4bcee99a34f17ef9efdfcea4329ccf', 'R8B contract blob');
eq(git('rev-parse', `HEAD:${R8A_PATH}`), '3f593061fa3d4906c769707904108249943e3826', 'R8A contract blob');
eq(git('rev-parse', `HEAD:${ROOT}/r6-spatial-transformation-grammar-contract.v1.json`), '6abb8d6b30fc92aa1eaff44ca7f8ec4e567b5938', 'R6 contract blob');
eq(git('rev-parse', `HEAD:${ROOT}/r7-continuity-and-accessibility-contract.v1.json`), '475aa283c3feb2fb6520f953c0a96d94285bc214', 'R7 contract blob');

eq(r8a.status, 'PASS_CLOSED', 'R8A terminal');
eq(r8b.status, 'PASS_CLOSED', 'R8B terminal');
eq(r8c.status, 'PASS_CLOSED', 'R8C terminal');
eq(r8d.status, 'PASS_CLOSED', 'R8D terminal');
yes(r8d.closure.r8dPassClosed, 'R8D closed');
no(r8d.closure.r8PassClosed, 'R8 remains open at parent');
no(r8d.closure.r9Unlock, 'R9 remains blocked at parent');

eq(contract.schema, 'METHODS_MODELS_F12_R8E_CROSS_FRAME_INVARIANCE_ROUNDTRIP_VERIFICATION_CONTRACT_v1', 'schema');
eq(contract.subcheckpoint, 'R8E_CROSS_FRAME_INVARIANCE_AND_ROUNDTRIP_VERIFICATION', 'subcheckpoint');
eq(contract.status, 'PASS_CLOSED', 'terminal status');
eq(contract.verification.requiredTerminalStatus, 'PASS_CLOSED', 'required terminal status');
eq(contract.parentAuthority.head, 'e3c45e93237286933bd07f843d7d06bcf73a4a2c', 'parent head');
eq(contract.parentAuthority.tree, '538902a082f55479a279a7e28be8bf17e283dfec', 'parent tree');
yes(contract.parentAuthority.r8dPassClosed, 'R8D pass carried');

eq(contract.frozenScientificInputs.scientificStateDigest, FROZEN_SCIENTIFIC_INPUTS.scientificStateDigest, 'scientific digest');
eq(contract.frozenScientificInputs.relationGraphDigest, FROZEN_SCIENTIFIC_INPUTS.relationGraphDigest, 'relation graph digest');
eq(contract.frozenScientificInputs.projectionGraphDigest, FROZEN_SCIENTIFIC_INPUTS.projectionGraphDigest, 'projection graph digest');

yes(contract.authorityBoundary.crossFrameVerificationHarnessAuthority, 'harness authority');
no(contract.authorityBoundary.estateChartSemanticAuthorshipAuthority, 'no estate chart semantic authorship');
no(contract.authorityBoundary.coordinateTransitionRuntimeAuthority, 'no production transition runtime');
no(contract.authorityBoundary.projectionRuntimeAuthority, 'no projection runtime');
no(contract.authorityBoundary.presentationRuntimeAuthority, 'no presentation runtime');
no(contract.authorityBoundary.visiblePrototypeAuthority, 'no visible prototype');
no(contract.authorityBoundary.mayMutateMain, 'no main mutation');

eq(contract.operationalInverseWitness.resolutionPolicy, RESOLUTION_POLICY, 'resolution policy');
no(contract.operationalInverseWitness.numericVectorAloneAssumedToContainEntireCanonicalState, 'vector alone not canonical state');
eq(contract.declaredOverlapContract.policy, OVERLAP_POLICY, 'overlap policy');
yes(contract.declaredOverlapContract.reciprocalDeclarationRequired, 'reciprocal overlap');
no(contract.declaredOverlapContract.outsideOverlapMayBeTreatedAsCanonicalAbsence, 'overlap miss not canonical absence');

eq(contract.roundtripContract.lawAToBToA, 'T_A<-B(T_B<-A(C_A(m)))=C_A(m)', 'A roundtrip law');
eq(contract.roundtripContract.lawBToAToB, 'T_B<-A(T_A<-B(C_B(m)))=C_B(m)', 'B roundtrip law');
no(contract.roundtripContract.roundtripMayInvokeProjection, 'no projection in roundtrip');
no(contract.roundtripContract.roundtripMayInvokePresentation, 'no presentation in roundtrip');

eq(HARNESS_MANIFEST.harnessId, HARNESS_ID, 'harness id');
eq(HARNESS_MANIFEST.embeddingEngineId, ENGINE_MANIFEST.engineId, 'embedding engine');
eq(HARNESS_MANIFEST.separationLaw, contract.frozenDeliveryContracts.r8cSeparation.law, 'separation law');
eq(HARNESS_MANIFEST.overlapPolicy, OVERLAP_POLICY, 'manifest overlap policy');
eq(HARNESS_MANIFEST.resolutionPolicy, RESOLUTION_POLICY, 'manifest resolution policy');
eq(HARNESS_MANIFEST.roundtripLaw, ROUNDTRIP_LAW, 'manifest roundtrip law');
yes(HARNESS_MANIFEST.crossFrameVerificationHarnessConstructed, 'harness constructed');
no(HARNESS_MANIFEST.coordinateTransitionRuntimeConstructed, 'no production transition runtime');
no(HARNESS_MANIFEST.projectionRuntimeConstructed, 'no projection runtime');
no(HARNESS_MANIFEST.presentationRuntimeConstructed, 'no presentation runtime');
no(HARNESS_MANIFEST.visiblePrototypeConstructed, 'no visible prototype');
eq(HARNESS_MANIFEST.r6AuthorizedTransformationCount, 0, 'R6 count');
eq(HARNESS_MANIFEST.r7SpatialTransformationDependentStateCount, 0, 'R7 count');

const a = chartA();
const b = chartB();
const pair = compileDeclaredOverlap(a, b);
eq(pair.overlapId, 'SYNTHETIC_R8E_OVERLAP_AB', 'overlap id');
const coordinateA = embedCoordinateState(sourceState, pair.chartA);
const coordinateB = embedCoordinateState(sourceState, pair.chartB);
assert.notDeepEqual(coordinateA.coordinateVector, coordinateB.coordinateVector, 'coordinate vectors should differ across frames');
eq(coordinateA.sourceDeliveryStateId, coordinateB.sourceDeliveryStateId, 'same source state');
eq(coordinateA.canonicalInvariantDigest, coordinateB.canonicalInvariantDigest, 'same canonical invariant digest');
const fixtureBefore = sha256Canonical({ sourceState, a, b, coordinateA, coordinateB });
const receipt = verifyCrossFrameRoundtrip({ coordinateStateA: coordinateA, coordinateStateB: coordinateB, chartA: a, chartB: b, canonicalRegistry: [sourceState] });
eq(receipt.status, 'CROSS_FRAME_VERIFICATION_PASS', 'receipt status');
yes(receipt.canonicalInvariantPreserved, 'invariant preserved');
yes(receipt.sourceIdentityPreserved, 'source identity preserved');
yes(receipt.declaredOverlapVerified, 'overlap verified');
yes(receipt.aToBExact, 'A to B exact');
yes(receipt.bToAExact, 'B to A exact');
yes(receipt.roundtripAToBToAExact, 'A-B-A exact');
yes(receipt.roundtripBToAToBExact, 'B-A-B exact');
assert.equal(receipt.projectionRuntimeConstructed, false);
assert.equal(receipt.presentationRuntimeConstructed, false);
assert.equal(receipt.visiblePrototypeConstructed, false);
eq(fixtureBefore, sha256Canonical({ sourceState, a, b, coordinateA, coordinateB }), 'fixture immutability');

const derivedReceipt = deriveAndVerifyCrossFrame({ sourceState, chartA: a, chartB: b, canonicalRegistry: [sourceState] });
eq(derivedReceipt.verificationDigest, receipt.verificationDigest, 'deterministic verification receipt');

const noOverlap = chartA();
noOverlap.overlapDeclarations = [];
expectCode(() => compileDeclaredOverlap(noOverlap, b), 'NO_DECLARED_CHART_OVERLAP');

const nonreciprocalB = chartB();
nonreciprocalB.overlapDeclarations[0].overlapId = 'DIFFERENT_OVERLAP';
expectCode(() => compileDeclaredOverlap(a, nonreciprocalB), 'NONRECIPROCAL_CHART_OVERLAP');

const tamperedA = clone(coordinateA);
tamperedA.coordinateVector[0] += 999;
expectCode(() => verifyCrossFrameRoundtrip({ coordinateStateA: tamperedA, coordinateStateB: coordinateB, chartA: a, chartB: b, canonicalRegistry: [sourceState] }), 'COORDINATE_STATE_VERIFICATION_FAILED');

const tamperedInvariantB = clone(coordinateB);
tamperedInvariantB.canonicalInvariantDigest = '0'.repeat(64);
expectCode(() => verifyCrossFrameRoundtrip({ coordinateStateA: coordinateA, coordinateStateB: tamperedInvariantB, chartA: a, chartB: b, canonicalRegistry: [sourceState] }), 'CANONICAL_INVARIANT_DIGEST_DRIFT');

expectCode(() => verifyCrossFrameRoundtrip({ coordinateStateA: coordinateA, coordinateStateB: coordinateB, chartA: a, chartB: b, canonicalRegistry: [] }), 'CANONICAL_SOURCE_NOT_FOUND');
expectCode(() => verifyCrossFrameRoundtrip({ coordinateStateA: coordinateA, coordinateStateB: embedCoordinateState(secondState, b), chartA: a, chartB: b, canonicalRegistry: [sourceState, secondState] }), 'CROSS_FRAME_SOURCE_ID_MISMATCH');

const domainB = chartB();
domainB.canonicalDomainDeclaration = { type: 'FIELD_EQUALS', fieldRef: 'sourceObjectIdentityRef', value: 'NOT_THIS_OBJECT' };
expectCode(() => deriveAndVerifyCrossFrame({ sourceState, chartA: a, chartB: domainB, canonicalRegistry: [sourceState] }), 'NO_COMMON_COORDINATE_DOMAIN');

expectCode(() => verifyCrossFrameRoundtrip({ coordinateStateA: coordinateA, coordinateStateB: coordinateB, chartA: a, chartB: b, canonicalRegistry: [sourceState, clone(sourceState)] }), 'CANONICAL_REGISTRY_DUPLICATE_STATE_ID');

yes(contract.closure.r8ePassClosed, 'R8E closed');
yes(contract.closure.r8RemainsOpen, 'R8 remains open');
no(contract.closure.r8PassClosed, 'R8 not closed');
no(contract.closure.r9Unlock, 'R9 locked');
eq(contract.closure.scientificMutation, 'NONE', 'no scientific mutation');
eq(contract.closure.publicMutation, 'NONE', 'no public mutation');
eq(contract.closure.mainMutation, 'NONE', 'no main mutation');
yes(contract.closure.coordinateEmbeddingRuntimeConstructed, 'embedding retained');
yes(contract.closure.crossFrameVerificationHarnessConstructed, 'verification harness retained');
no(contract.closure.coordinateTransitionRuntimeConstructed, 'transition runtime absent');
no(contract.closure.projectionRuntimeConstructed, 'projection absent');
no(contract.closure.presentationRuntimeConstructed, 'presentation absent');
no(contract.closure.visiblePrototypeConstructed, 'visible prototype absent');
eq(contract.closure.nextSubcheckpointOnPass, 'R8F_REVISED_BOUNDED_EXPERIENTIAL_PROTOTYPE', 'next checkpoint');
eq(contract.closure.r8fEligibility, 'ELIGIBLE_READY_FOR_EXECUTION', 'R8F eligible');
has(contract.prohibited, 'MERGE_TO_MAIN', 'main merge prohibited');
has(contract.prohibited, 'EXECUTE_R9', 'R9 prohibited');
has(contract.prohibited, 'CONSTRUCT_VISIBLE_R8_PROTOTYPE', 'visible prototype prohibited at R8E');

console.log(JSON.stringify({
  status: 'PASS_CLOSED',
  operation: contract.subcheckpoint,
  harnessId: HARNESS_ID,
  overlapPolicy: OVERLAP_POLICY,
  resolutionPolicy: RESOLUTION_POLICY,
  roundtripLaw: ROUNDTRIP_LAW,
  positiveFixture: {
    chartA: coordinateA.chartId,
    chartB: coordinateB.chartId,
    coordinateVectorA: coordinateA.coordinateVector,
    coordinateVectorB: coordinateB.coordinateVector,
    canonicalInvariantDigest: coordinateA.canonicalInvariantDigest,
    roundtripAToBToAExact: receipt.roundtripAToBToAExact,
    roundtripBToAToBExact: receipt.roundtripBToAToBExact,
    verificationDigest: receipt.verificationDigest
  },
  r6AuthorizedTransformationCount: HARNESS_MANIFEST.r6AuthorizedTransformationCount,
  r7SpatialTransformationDependentStateCount: HARNESS_MANIFEST.r7SpatialTransformationDependentStateCount,
  crossFrameVerificationHarnessConstructed: true,
  coordinateTransitionRuntimeConstructed: false,
  projectionRuntimeConstructed: false,
  presentationRuntimeConstructed: false,
  visiblePrototypeConstructed: false,
  r8ePassClosed: true,
  r8PassClosed: false,
  r9Unlock: false,
  nextSubcheckpointOnPass: contract.closure.nextSubcheckpointOnPass,
  r8fEligibility: contract.closure.r8fEligibility
}, null, 2));