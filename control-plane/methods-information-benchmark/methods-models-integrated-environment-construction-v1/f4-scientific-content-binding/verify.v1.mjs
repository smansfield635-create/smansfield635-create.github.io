import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import { validateCurrentF4Content } from './binding-validator.v1.mjs';
import { resolveState } from '../f3-resolution-and-validity-engine/resolver.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F2 = `${ROOT}/f2-canonical-state-kernel`;
const F3 = `${ROOT}/f3-resolution-and-validity-engine`;
const F4 = `${ROOT}/f4-scientific-content-binding`;
const GATE0 = 'control-plane/methods-information-benchmark/imi-methods-models-universal-integration-v1';
const CP7 = 'control-plane/whole-estate/first-safe-vertical-case-selection-v1';
const F1 = `${ROOT}/f1-construction-baseline`;
const F3_HEAD = '56d0a5991ad6cf44a486ce4b9c40bf044c3f21a3';
const F3_TREE = '2fcc0b563545a8e6ca1317fb7eef0a94248d45ff';
const MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const MAIN_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f4-verify.yml';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const clone = value => structuredClone(value);

assert.equal(git('show','-s','--format=%T',F3_HEAD), F3_TREE, 'F3 tree drift');
execFileSync('git', ['merge-base','--is-ancestor',F3_HEAD,'HEAD']);
assert.equal(git('rev-parse','origin/main'), MAIN, 'governing main drift');
assert.equal(git('show','-s','--format=%T','origin/main'), MAIN_TREE, 'governing main tree drift');

const expectedUpstreamBlobs = {
  [`${F3}/f3-terminal-receipt.v1.json`]: '35648e756e61bddacf5807e81ca48909d7730841',
  [`${F3}/resolver.v1.mjs`]: '3654d269ad38fc19d3b670fe8331f7c72cef1e26',
  [`${F3}/validity-contract.v1.json`]: 'c67ddf8bd744b837ac94cf475a729ddf3a60d409',
  [`${F2}/canonical-state-kernel.v1.json`]: '5fe4506824b7fb4c8816583f59423911d7301157',
  [`${F2}/axis-registry.v1.json`]: 'c3dcaf8efd5822c151e17eb9267a8d55acfd0892',
  [`${F2}/state-envelope.schema.v1.json`]: '3ddd8e549200f0c0c6e673369fa3c02290a68683',
  [`${F1}/scientific-source-and-claim-ledger.v1.json`]: '48bc82798bbbd06bcdb728820cf3485615a71e16',
  [`${GATE0}/README.md`]: 'cd50bad98ac8f9ae1ce7a772df5db6b82daa0929',
  [`${GATE0}/canonical-hierarchy.v1.json`]: 'c2d7383ff6377cdbe6b31710011db1d4287e49e4',
  [`${GATE0}/evidence-and-execution-state.v1.json`]: '9b80c1f4ad492037fd5bfc825ffdd933f9812b2f',
  [`${GATE0}/methods-sequence.v1.json`]: '4fbebc22d2cf0bf8d4fa28c8857b915e7c28bd16',
  [`${GATE0}/model-registry.v1.json`]: '61304f3a7230e1cc1a1ec89804b3fda45e3c9ced',
  [`${GATE0}/universal-object-model.v1.json`]: '034b1e5d546782d7a6a019b0af6b80c1407d616f',
  [`${CP7}/selected-vertical-case-contract.v1.json`]: '0773992cd6a20c55bd4e027af67b50351e07aa04',
  [`${CP7}/source-ledger.v1.json`]: '2f8ad4e2218d075c94bf78660bb08d4b551cd45a'
};
for (const [path, blob] of Object.entries(expectedUpstreamBlobs)) {
  assert.equal(git('rev-parse', `${F3_HEAD}:${path}`), blob, `upstream source blob drift: ${path}`);
}

const changed = git('diff','--name-only',`${F3_HEAD}..HEAD`).split('\n').filter(Boolean);
assert(changed.length >= 1, 'F4 candidate has no changes');
for (const path of changed) assert(path.startsWith(`${F4}/`) || path === TEMP_WORKFLOW, `unauthorized F4 path mutation: ${path}`);

const contract = readJson(`${F4}/content-binding-contract.v1.json`);
const sourceBindings = readJson(`${F4}/source-bindings.v1.json`);
const objects = readJson(`${F4}/scientific-object-registry.v1.json`);
const methods = readJson(`${F4}/method-content-registry.v1.json`);
const models = readJson(`${F4}/model-content-registry.v1.json`);
const evidence = readJson(`${F4}/evidence-and-claim-registry.v1.json`);
const empirical = readJson(`${F4}/empirical-instance-registry.v1.json`);
const stateBindings = readJson(`${F4}/state-bindings.v1.json`);
const fixtures = readJson(`${F4}/conformance-fixtures.v1.json`);
const receipt = readJson(`${F4}/f4-terminal-receipt.v1.json`);

assert.equal(sourceBindings.inputF3.finalHead, F3_HEAD);
assert.equal(sourceBindings.inputF3.finalTree, F3_TREE);
assert.equal(sourceBindings.ontologyExpansionAuthorized, false);
assert.equal(sourceBindings.researchSpecificResolverLogicAuthorized, false);
assert.equal(sourceBindings.publicMutationAuthorized, false);
assert.equal(sourceBindings.scientificClaimUpgradeAuthorized, false);
assert.equal(contract.publicMutationAuthorized, false);
assert.equal(contract.scientificClaimUpgradeAuthorized, false);
assert(contract.laws.includes('ADVERSE_EVIDENCE_IS_FIRST_CLASS_CONTENT'));
assert(contract.laws.includes('CONTENT_BINDING_MAY_INSTANTIATE_EXISTING_STATE_BUT_MAY_NOT_EXPAND_EXISTING_ONTOLOGY'));
assert(contract.laws.includes('EMPIRICAL_INSTANCE_MAY_DEMONSTRATE_A_METHOD_OR_MODEL_BUT_MAY_NOT_REDEFINE_IT'));

const validation = validateCurrentF4Content();
assert.equal(validation.valid, true, `binding validator failed: ${validation.errors.join(', ')}`);
assert.equal(validation.summary.universalObjects, 6);
assert.equal(validation.summary.methodStages, 15);
assert.equal(validation.summary.models, 7);
assert.equal(validation.summary.empiricalInstances, 2);
assert.equal(validation.summary.stateBindings, 2);

assert.equal(objects.objects.find(x => x.contentId === 'METHODS')?.contentClass, 'METHOD_DEFINITION');
assert.equal(objects.objects.find(x => x.contentId === 'MODEL_REGISTRY')?.contentClass, 'MODEL_DEFINITION');
assert.equal(empirical.instances.find(x => x.contentId === 'BIO_LAB')?.contentClass, 'EMPIRICAL_INSTANCE');
assert.equal(empirical.instances.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED')?.contentClass, 'PERSPECTIVE_RESEARCH_OBJECT');
assert(!objects.objects.some(x => x.contentId === 'BIO_LAB'));
assert(!objects.objects.some(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED'));

assert.equal(models.models.find(x => x.contentId === 'PRESSURE_AND_CAPACITY_MODEL')?.claimCeilingRef, 'BOUNDED_SUPPORTING_MODEL_ONLY');
assert.deepEqual(models.models.find(x => x.contentId === 'PRESSURE_AND_CAPACITY_MODEL')?.formalExpressions, [
  'Π = G × X',
  'K = P × R × A × C',
  'PCR = Π / max(K, εK)'
]);
assert(models.rejectedModels.some(x => x.contentId === 'GLOBAL_MULTIPLICATIVE_PRODUCT' && x.reason === 'GLOBAL_PRODUCT_REJECTED'));
assert.equal(evidence.claimPosture.globalProductRejected, true);
assert.equal(evidence.claimPosture.multiplicativeSpecificity, false);
assert.equal(evidence.prospectiveExecution.scientificResult, 'NONE');
assert.equal(evidence.prospectiveExecution.outcomeAccess, 'PROHIBITED');

const bio = empirical.instances.find(x => x.contentId === 'BIO_LAB');
assert.equal(bio.claimCeilingRef, fixtures.requiredSourcePostures.bioLabCeiling);
assert.equal(bio.limitations.includes('PROSPECTIVE_CONFIRMATION_NOT_ESTABLISHED'), true);
assert.equal(bio.limitations.includes('PUBLIC_OUTCOME_CONTAMINATION_PRESENT'), true);
const hurricane = empirical.instances.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED');
assert.equal(hurricane.evidenceStanding, fixtures.requiredSourcePostures.hurricaneStanding);
assert.equal(hurricane.claimCeilingRef, fixtures.requiredSourcePostures.hurricaneUsage);
assert.equal(hurricane.adverseEvidence, true);
assert.equal(hurricane.priorSupersededExecution.currentAdmission, 'QUARANTINED_SUPERSEDED_BY_QC_CORRECTED_RAW_RESULT');

for (const binding of stateBindings.bindings) {
  const resolved = resolveState(binding.state);
  assert.equal(resolved.resolutionClass, binding.expectedResolutionClass, `unexpected F3 resolution: ${binding.bindingId}`);
}
const hurricaneState = stateBindings.bindings.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').state;
assert.equal(hurricaneState.axes.SYSTEM.status, 'UNSET');
assert.equal(hurricaneState.axes.MODEL.status, 'UNSET');
assert.equal(hurricaneState.axes.EVIDENCE.value.evidenceStatus, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED');
const bioState = stateBindings.bindings.find(x => x.contentId === 'BIO_LAB').state;
assert.equal(bioState.axes.CLAIM_CEILING.value.ceilingId, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY');

// Adversarial source-bound mutations: the actual validator must reject each one.
function mutateAndRequireFailure(path, mutate, errorToken) {
  const originalBytes = fs.readFileSync(path, 'utf8');
  const value = JSON.parse(originalBytes);
  mutate(value);
  fs.writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
  try {
    const result = validateCurrentF4Content();
    assert.equal(result.valid, false, `mutation unexpectedly accepted: ${errorToken}`);
    assert(result.errors.some(x => x.includes(errorToken)), `expected rejection token missing: ${errorToken}; got ${result.errors.join(', ')}`);
  } finally {
    fs.writeFileSync(path, originalBytes);
  }
}

mutateAndRequireFailure(`${F4}/empirical-instance-registry.v1.json`, value => {
  value.instances.find(x => x.contentId === 'BIO_LAB').claimCeilingRef = 'PROSPECTIVE_CONFIRMATION';
}, 'BIO_LAB_CEILING_DRIFT');

mutateAndRequireFailure(`${F4}/empirical-instance-registry.v1.json`, value => {
  value.instances.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').evidenceStanding = 'SUPPORTED';
}, 'HURRICANE_STANDING_DRIFT');

mutateAndRequireFailure(`${F4}/state-bindings.v1.json`, value => {
  const state = value.bindings.find(x => x.contentId === 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED').state;
  state.axes.SYSTEM = {status:'DECLARED',authorityRef:'F4_CONTENT_BINDING_AUTHORITY',sourceRef:'INFERRED',value:{systemId:'INFERRED_SYSTEM',boundaryRef:'INFERRED_BOUNDARY'}};
}, 'HURRICANE_SYSTEM_MUST_REMAIN_UNSET');

mutateAndRequireFailure(`${F4}/state-bindings.v1.json`, value => {
  value.bindings.find(x => x.contentId === 'BIO_LAB').state.axes.SCIENTIFIC_OBJECT.value.objectClass = 'CASE_STUDY_SPECIAL_CLASS';
}, 'UNAUTHORIZED_OBJECT_CLASS');

mutateAndRequireFailure(`${F4}/model-content-registry.v1.json`, value => {
  value.models.find(x => x.contentId === 'PRESSURE_AND_CAPACITY_MODEL').globalProduct = true;
}, 'MODEL_GLOBAL_PRODUCT_DRIFT');

mutateAndRequireFailure(`${F4}/method-content-registry.v1.json`, value => {
  value.sequence[0].id = 'EMPIRICAL_CASE_FIRST';
}, 'METHOD_SEQUENCE_DRIFT');

assert.equal(receipt.candidateDisposition, 'PASS_F4_SCIENTIFIC_CONTENT_BINDING_v1');
assert.equal(receipt.scientificClaimUpgrade, false);
assert.equal(receipt.ontologyExpansion, false);
assert.equal(receipt.researchSpecificResolverLogic, false);
assert.equal(receipt.publicMutation, false);
assert.equal(receipt.f5ConstructionAuthorityBeforeVerification, false);
assert.equal(receipt.f5ConstructionAuthorityAfterEffectivePass, true);
assert.equal(receipt.f6ThroughF12Authority, false);

console.log('PASS_F4_SCIENTIFIC_CONTENT_BINDING_v1');
console.log(JSON.stringify({
  inputF3Head: F3_HEAD,
  universalObjects: validation.summary.universalObjects,
  methodStages: validation.summary.methodStages,
  models: validation.summary.models,
  empiricalInstances: validation.summary.empiricalInstances,
  empiricalStateBindings: validation.summary.stateBindings,
  bioLabResolution: resolveState(bioState).resolutionClass,
  hurricaneResolution: resolveState(hurricaneState).resolutionClass,
  hurricaneStanding: hurricane.evidenceStanding,
  scientificClaimUpgrade: false,
  ontologyExpansion: false,
  publicMutation: false,
  f5ConstructionAuthorityAfterEffectivePass: true,
  f6ThroughF12Authority: false,
  changedPaths: changed.length
}, null, 2));
