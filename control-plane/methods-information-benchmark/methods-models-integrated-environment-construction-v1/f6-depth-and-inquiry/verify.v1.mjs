import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { serializeCanonical } from '../f3-resolution-and-validity-engine/resolver.v1.mjs';
import {
  DEPTH_ORDER,
  projectDepth,
  inquireField,
  compareDepthIdentity,
  isCumulativeDisclosure
} from './depth-projector.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F3 = `${ROOT}/f3-resolution-and-validity-engine`;
const F4 = `${ROOT}/f4-scientific-content-binding`;
const F5 = `${ROOT}/f5-navigation-and-continuity`;
const F6 = `${ROOT}/f6-depth-and-inquiry`;
const F5_HEAD = 'c857d55670c43dd82eb903ff47fd50ac8c316c53';
const F5_TREE = 'f5ee9f72675c350f454045594bddc33ea36170b9';
const MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const MAIN_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f6-verify.yml';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const clone = value => structuredClone(value);

assert.equal(git('show','-s','--format=%T',F5_HEAD), F5_TREE, 'F5 tree drift');
execFileSync('git', ['merge-base','--is-ancestor',F5_HEAD,'HEAD']);
assert.equal(git('rev-parse','origin/main'), MAIN, 'governing main drift');
assert.equal(git('show','-s','--format=%T','origin/main'), MAIN_TREE, 'governing main tree drift');

const expectedUpstreamBlobs = {
  [`${F5}/f5-terminal-receipt.v1.json`]: 'df838b8be7fc5987fe441786889c80ee077524ec',
  [`${F5}/navigator.v1.mjs`]: '66d29091f3ecf81f44890f562c775c9e881a7a53',
  [`${F4}/state-bindings.v1.json`]: 'c140e326272ade6bb093eb71048fac353162cc1c',
  [`${F4}/empirical-instance-registry.v1.json`]: '14b7a21e5ff2e49a22196fdec99f93f146d76102',
  [`${F4}/evidence-and-claim-registry.v1.json`]: '2cca3d2a11870e6fffeda7d7e2b6cc7bbb996c1f',
  [`${F3}/resolver.v1.mjs`]: '3654d269ad38fc19d3b670fe8331f7c72cef1e26',
  ['control-plane/whole-estate/invariant-contract-package-v1/narrative-invariant-contract.v1.json']: 'de37525d99a2f51ec1b7a522aabd41b7700c54d7',
  ['control-plane/whole-estate/invariant-contract-package-v1/lens-view-invariant-contract.v1.json']: 'b84e8a76c6c12899a1f8ddc07106a3c660cf85d1'
};
for (const [path, blob] of Object.entries(expectedUpstreamBlobs)) assert.equal(git('rev-parse', `${F5_HEAD}:${path}`), blob, `upstream blob drift: ${path}`);

const changed = git('diff','--name-only',`${F5_HEAD}..HEAD`).split('\n').filter(Boolean);
assert(changed.length >= 1, 'F6 candidate has no changes');
for (const path of changed) assert(path.startsWith(`${F6}/`) || path === TEMP_WORKFLOW, `unauthorized F6 path mutation: ${path}`);
assert(!changed.some(path => path.includes('/f7-')), 'F7 artifact introduced before authority');
assert(!changed.some(path => path.startsWith('laws/research/methods-and-models/')), 'public Methods page mutated in F6');
assert(!changed.some(path => path.startsWith('laws/')), 'public Laws surface mutated in F6');

const sources = readJson(`${F6}/source-bindings.v1.json`);
const depthContract = readJson(`${F6}/depth-contract.v1.json`);
const profiles = readJson(`${F6}/depth-profile-registry.v1.json`);
const inquiry = readJson(`${F6}/inquiry-contract.v1.json`);
const fixtures = readJson(`${F6}/conformance-fixtures.v1.json`);
const receipt = readJson(`${F6}/f6-terminal-receipt.v1.json`);
const empirical = readJson(`${F4}/empirical-instance-registry.v1.json`);
const stateBindings = readJson(`${F4}/state-bindings.v1.json`);
const evidenceClaims = readJson(`${F4}/evidence-and-claim-registry.v1.json`);
const narrative = readJson('control-plane/whole-estate/invariant-contract-package-v1/narrative-invariant-contract.v1.json');
const lensView = readJson('control-plane/whole-estate/invariant-contract-package-v1/lens-view-invariant-contract.v1.json');

assert.equal(sources.inputF5.finalHead, F5_HEAD);
assert.equal(sources.inputF5.finalTree, F5_TREE);
assert.deepEqual(depthContract.depthSequence, DEPTH_ORDER);
assert.equal(depthContract.cumulativeDisclosure, true);
assert.equal(depthContract.structuralBoundary.depthIsF2Axis, false);
assert.equal(depthContract.structuralBoundary.depthMutatesLensAxis, false);
assert.equal(depthContract.structuralBoundary.depthMutatesViewModeAxis, false);
assert.equal(depthContract.structuralBoundary.canonicalScientificStateMustRemainByteEquivalent, true);
assert(depthContract.laws.includes('DEPTH_CHANGES_RESOLUTION_OF_EXPLANATION_NOT_AUTHORITY_OF_THE_SCIENCE'));
assert(depthContract.laws.includes('DELTA_D_DOES_NOT_IMPLY_DELTA_I'));
assert(narrative.scientificMeaningImmutableUnder.includes('DEPTH_CHANGE'));
assert.equal(narrative.requiredQualifierRule, 'MATERIAL_QUALIFIERS_MUST_APPEAR_AT_OR_BEFORE_THE_DEPTH_AT_WHICH_OMISSION_COULD_CHANGE_USER_CONCLUSION');
assert(lensView.visualAuthorityLaws.includes('DEPTH_NOT_TRUTH'));
assert.equal(inquiry.depthEscalation, 'EXPLICIT_USER_OR_CALLER_SELECTION_ONLY');
assert.equal(inquiry.naturalLanguageInferenceAuthorized, false);
assert.equal(inquiry.scientificInferenceAuthorized, false);
assert.equal(receipt.candidateDisposition, 'PASS_F6_DEPTH_AND_INQUIRY_v1');
assert.equal(receipt.f7ConstructionAuthorityBeforeVerification, false);
assert.equal(receipt.f7ConstructionAuthorityAfterEffectivePass, true);
assert.equal(receipt.f8ThroughF12Authority, false);
assert.equal(receipt.visualConstruction, 'NOT_STARTED');
assert.equal(receipt.spatialTopology, 'NOT_AUTHORIZED');
assert.equal(receipt.geometry, 'NOT_AUTHORIZED');
assert.equal(fixtures.terminalAssertion, 'PASS_F6_DEPTH_AND_INQUIRY_v1');
assert.equal(evidenceClaims.claimPosture.globalProductRejected, true);
assert.equal(evidenceClaims.claimPosture.multiplicativeSpecificity, false);

const sourceIds = empirical.instances.map(item => item.contentId).sort();
const profileIds = profiles.profiles.map(item => item.contentId).sort();
assert.deepEqual(profileIds, sourceIds, 'F6 profiles must bind exactly the F4 empirical instances');
assert.deepEqual(profileIds, ['BIO_LAB','HURRICANE_RAW_TC_RADAR_QC_CORRECTED'].sort());

const stateSnapshot = clone(stateBindings);
const projectionSets = {};
for (const contentId of profileIds) {
  projectionSets[contentId] = DEPTH_ORDER.map(depth => {
    const result = projectDepth(contentId, depth, empirical, stateBindings, profiles);
    assert.equal(result.valid, true, `${contentId} ${depth} projection failed: ${result.errors.join('|')}`);
    return result.projection;
  });
  const [d0, d1, d2, d3, d4] = projectionSets[contentId];
  for (const projection of projectionSets[contentId]) {
    assert.equal(compareDepthIdentity(d0, projection).valid, true, `${contentId} scientific identity changed with depth`);
    assert.equal(projection.scientificStateSha256, d0.scientificStateSha256);
    assert.equal(projection.bindingId, d0.bindingId);
  }
  assert.equal(isCumulativeDisclosure(d0, d1), true);
  assert.equal(isCumulativeDisclosure(d1, d2), true);
  assert.equal(isCumulativeDisclosure(d2, d3), true);
  assert.equal(isCumulativeDisclosure(d3, d4), true);
  assert.equal(projectDepth(contentId, 'D4', empirical, stateBindings, profiles).valid, true, 'D4 direct entry requires prior traversal');
}
assert.deepEqual(stateBindings, stateSnapshot, 'F6 projection mutated F4 state bindings');

const bio = projectionSets.BIO_LAB;
const hurricane = projectionSets.HURRICANE_RAW_TC_RADAR_QC_CORRECTED;
assert.equal(bio[0].disclosed.terminalDisposition, 'UCIC_ROUTE_SPECIFICITY_SUPPORTED_EXTERNAL_CSB');
assert.equal(bio[0].disclosed.claimCeilingRef, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY');
for (const qualifier of ['OUTCOME_BLINDNESS_NOT_ESTABLISHED','PUBLIC_OUTCOME_CONTAMINATION_PRESENT','INDEPENDENT_HUMAN_CONFIRMATION_NOT_ESTABLISHED','PROSPECTIVE_CONFIRMATION_NOT_ESTABLISHED','UNIVERSAL_LAW_NOT_ESTABLISHED']) assert(bio[0].disclosed.limitations.includes(qualifier), `Bio-Lab D0 buried qualifier: ${qualifier}`);
assert.deepEqual(bio[2].disclosed.registeredRelations, empirical.instances.find(x => x.contentId === 'BIO_LAB').registeredRelations, 'Bio-Lab D2 relations changed');

assert.equal(hurricane[0].disclosed.evidenceStanding, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED');
assert.equal(hurricane[0].disclosed.adverseEvidence, true);
assert.equal(hurricane[0].disclosed.additiveStanding, 'POSITIVE_POINT_ESTIMATE_INCONCLUSIVE');
assert.equal(hurricane[0].disclosed.warningTime, 'NOT_TESTED');
assert.equal(hurricane[4].disclosed.evidenceStanding, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED', 'D4 rewrote hurricane adverse standing');
assert(hurricane[0].disclosed.limitations.includes('PRIMARY_RAW_MECHANISTIC_TEST_NOT_SUPPORTED'));
assert(hurricane[0].disclosed.limitations.includes('ADDITIVE_BOOTSTRAP_INTERVAL_CROSSES_ZERO'));
assert(hurricane[0].disclosed.limitations.includes('NO_EARLY_WARNING_CAUSAL_PROSPECTIVE_UNIVERSAL_OR_IMI_CONFIRMATION_CLAIM'));

assert.equal(inquireField(bio[0], 'provenance').valid, false, 'D0 inquiry silently escalated to provenance');
assert.equal(inquireField(bio[4], 'provenance').valid, true);
assert.equal(inquireField(hurricane[0], 'primaryIncrementalAuc').valid, false, 'D0 inquiry silently escalated to structure');
assert.equal(inquireField(hurricane[2], 'primaryIncrementalAuc').valid, true);
assert.equal(projectDepth('UNKNOWN_CONTENT','D0',empirical,stateBindings,profiles).valid, false);
assert.equal(projectDepth('BIO_LAB','D9',empirical,stateBindings,profiles).valid, false);

const hurricaneBinding = stateBindings.bindings.find(binding => binding.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED');
assert.equal(hurricaneBinding.state.axes.SYSTEM.status, 'UNSET');
assert.equal(hurricaneBinding.state.axes.MODEL.status, 'UNSET');
for (const projection of hurricane) {
  assert(!projection.disclosedFieldNames.includes('systemBoundary'), 'depth filled hurricane UNSET SYSTEM');
  assert(!projection.disclosedFieldNames.includes('modelId'), 'depth filled hurricane UNSET MODEL');
}

const missingFieldProfiles = clone(profiles);
missingFieldProfiles.profiles.find(p => p.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').fieldsByDepth.D1.push('systemBoundary');
const missingField = projectDepth('HURRICANE_RAW_TC_RADAR_QC_CORRECTED','D1',empirical,stateBindings,missingFieldProfiles);
assert.equal(missingField.valid, false);
assert(missingField.errors.some(error => error.includes('PROFILE_FIELD_MISSING:systemBoundary')));

const relationProfiles = clone(profiles);
relationProfiles.profiles.find(p => p.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').fieldsByDepth.D2.push('registeredRelations');
const relationAttempt = projectDepth('HURRICANE_RAW_TC_RADAR_QC_CORRECTED','D2',empirical,stateBindings,relationProfiles);
assert.equal(relationAttempt.valid, false, 'depth created undeclared hurricane relation');

const claimMutation = clone(stateBindings);
claimMutation.bindings.find(binding => binding.contentId === 'BIO_LAB').state.axes.CLAIM_CEILING.value.ceilingId = 'FORGED_HIGHER_CLAIM';
assert.equal(projectDepth('BIO_LAB','D0',empirical,claimMutation,profiles).valid, false, 'altered claim ceiling passed F6 correspondence');

const adverseMutation = clone(stateBindings);
const adverseEvidence = adverseMutation.bindings.find(binding => binding.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').state.axes.EVIDENCE.value;
adverseEvidence.evidenceStatus = 'FORGED_SUPPORT';
adverseEvidence.disposition = 'FORGED_SUPPORT';
assert.equal(projectDepth('HURRICANE_RAW_TC_RADAR_QC_CORRECTED','D0',empirical,adverseMutation,profiles).valid, false, 'altered hurricane evidence standing passed F6 correspondence');

for (const binding of stateBindings.bindings) {
  const serialized = serializeCanonical(binding.state);
  assert.notEqual(serialized.resolutionClass, 'INVALID');
  const d0 = projectionSets[binding.contentId][0];
  assert.equal(d0.scientificStateSha256, serialized.sha256, `projection state digest is not F3 canonical for ${binding.contentId}`);
  assert.equal(Object.hasOwn(binding.state.axes, 'DEPTH'), false, 'F6 added DEPTH to F2 state');
  assert.equal(Object.keys(binding.state.axes).length, 13, 'F6 changed F2 axis cardinality');
}

console.log('F6_INPUT_HEAD=' + F5_HEAD);
console.log('F6_INPUT_TREE=' + F5_TREE);
console.log('F6_DEPTH_SEQUENCE=' + DEPTH_ORDER.join('>'));
console.log('F6_PROFILE_COUNT=' + profiles.profiles.length);
console.log('F6_PUBLIC_MUTATION=NONE');
console.log('F6_VISUAL_CONSTRUCTION=NOT_STARTED');
console.log('F6_SPATIAL_TOPOLOGY=NOT_AUTHORIZED');
console.log('F6_GEOMETRY=NOT_AUTHORIZED');
console.log('PASS_F6_DEPTH_AND_INQUIRY_v1');
