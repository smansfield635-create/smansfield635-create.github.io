import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  ACTION_SCHEMA,
  USER_MODALITIES,
  buildInteractionContext,
  createInteractionSession,
  performInteraction,
  adaptViewport,
  compareModalityEquivalentResults,
  sessionRecoverySnapshot,
  bindingStateForSession
} from './interaction-engine.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F4 = `${ROOT}/f4-scientific-content-binding`;
const F5 = `${ROOT}/f5-navigation-and-continuity`;
const F6 = `${ROOT}/f6-depth-and-inquiry`;
const F7 = `${ROOT}/f7-interaction-and-accessibility`;
const F6_HEAD = '661979de2b027836112267bb59df8881d79fb2a9';
const F6_TREE = '3c03c4753e4d3f22cc1abcaa7ff61968c7c33b55';
const MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const MAIN_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f7-verify.yml';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const clone = value => structuredClone(value);
const action = (modality, kind, controlId, payload = {}) => ({ schema: ACTION_SCHEMA, modality, kind, controlId, payload });

assert.equal(git('show','-s','--format=%T',F6_HEAD), F6_TREE, 'F6 tree drift');
execFileSync('git', ['merge-base','--is-ancestor',F6_HEAD,'HEAD']);
assert.equal(git('rev-parse','origin/main'), MAIN, 'governing main drift');
assert.equal(git('show','-s','--format=%T','origin/main'), MAIN_TREE, 'governing main tree drift');

const upstreamBlobs = {
  [`${F6}/f6-terminal-receipt.v1.json`]: '05a4aeee2bd89332ebbbe696056ca6b55edc9c7d',
  [`${F6}/depth-projector.v1.mjs`]: '9856323e6389c1cf97ff7fbe84da28e6b1ea4f99',
  [`${F6}/depth-profile-registry.v1.json`]: 'a96ee72c9346bf3a46b95721942d8cf3fa32d6fb',
  [`${F5}/navigator.v1.mjs`]: '66d29091f3ecf81f44890f562c775c9e881a7a53',
  [`${F5}/entrypoint-registry.v1.json`]: 'bb250fce5de10a94d22819245622770cd105acaf',
  [`${F4}/state-bindings.v1.json`]: 'c140e326272ade6bb093eb71048fac353162cc1c',
  [`${F4}/empirical-instance-registry.v1.json`]: '14b7a21e5ff2e49a22196fdec99f93f146d76102',
  ['.github/ai-router/projects/methods-information-benchmark/spatial-database-text-first-interaction-contract-v2-permanent-ratification.v1.json']: '0375241beb7ae76030402fb882d9cc1d46b257a5',
  ['control-plane/whole-estate/invariant-contract-package-v1/lens-view-invariant-contract.v1.json']: 'b84e8a76c6c12899a1f8ddc07106a3c660cf85d1',
  ['control-plane/whole-estate/invariant-contract-package-v1/narrative-invariant-contract.v1.json']: 'de37525d99a2f51ec1b7a522aabd41b7700c54d7'
};
for (const [path, blob] of Object.entries(upstreamBlobs)) assert.equal(git('rev-parse', `${F6_HEAD}:${path}`), blob, `upstream blob drift: ${path}`);

const changed = git('diff','--name-only',`${F6_HEAD}..HEAD`).split('\n').filter(Boolean);
assert(changed.length >= 1, 'F7 candidate has no changes');
for (const path of changed) assert(path.startsWith(`${F7}/`) || path === TEMP_WORKFLOW, `unauthorized F7 path mutation: ${path}`);
assert(!changed.some(path => path.includes('/f8-')), 'F8 artifact introduced before authority');
assert(!changed.some(path => path.startsWith('laws/')), 'public Laws/Methods mutation introduced in F7');

const expectedPermanentFiles = [
  'README.md',
  'accessibility-contract.v1.json',
  'conformance-fixtures.v1.json',
  'f7-terminal-receipt.v1.json',
  'interaction-contract.v1.json',
  'interaction-engine.v1.mjs',
  'modality-registry.v1.json',
  'semantic-control-registry.v1.json',
  'source-bindings.v1.json',
  'verify.v1.mjs'
].sort();
assert.deepEqual(fs.readdirSync(F7).sort(), expectedPermanentFiles, 'F7 permanent package drift');

const sourceBindings = readJson(`${F7}/source-bindings.v1.json`);
const interactionContract = readJson(`${F7}/interaction-contract.v1.json`);
const modalityRegistry = readJson(`${F7}/modality-registry.v1.json`);
const controlRegistry = readJson(`${F7}/semantic-control-registry.v1.json`);
const accessibility = readJson(`${F7}/accessibility-contract.v1.json`);
const fixtures = readJson(`${F7}/conformance-fixtures.v1.json`);
const receipt = readJson(`${F7}/f7-terminal-receipt.v1.json`);
const entrypointRegistry = readJson(`${F5}/entrypoint-registry.v1.json`);
const stateBindings = readJson(`${F4}/state-bindings.v1.json`);
const empiricalRegistry = readJson(`${F4}/empirical-instance-registry.v1.json`);
const depthProfileRegistry = readJson(`${F6}/depth-profile-registry.v1.json`);
const textFirst = readJson('.github/ai-router/projects/methods-information-benchmark/spatial-database-text-first-interaction-contract-v2-permanent-ratification.v1.json');
const lensInvariant = readJson('control-plane/whole-estate/invariant-contract-package-v1/lens-view-invariant-contract.v1.json');
const narrativeInvariant = readJson('control-plane/whole-estate/invariant-contract-package-v1/narrative-invariant-contract.v1.json');

assert.equal(sourceBindings.inputF6.finalHead, F6_HEAD);
assert.equal(sourceBindings.inputF6.finalTree, F6_TREE);
assert.equal(interactionContract.governingPrinciple, 'INTERACTION_MAY_OPERATE_THE_ENVIRONMENT_BUT_MAY_NOT_ALTER_SCIENTIFIC_STATE_WITHOUT_AN_ALREADY_AUTHORIZED_TRANSITION');
assert.equal(interactionContract.silentFallbackAuthorized, false);
assert.equal(interactionContract.visualConstructionAuthorized, false);
assert.deepEqual(modalityRegistry.modalities.map(item => item.id), USER_MODALITIES);
assert.equal(modalityRegistry.equivalenceLaw, 'THE_SAME_REGISTERED_CONTROL_AND_EXPLICIT_PAYLOAD_MUST_DISPATCH_THE_SAME_OPERATION_INDEPENDENT_OF_MODALITY');
assert.equal(accessibility.requirements.semanticDomTextPrimary, true);
assert.equal(accessibility.requirements.keyboardOperableRegisteredControls, true);
assert.equal(accessibility.requirements.invalidInteractionDoesNotSilentlyFallback, true);
assert.equal(textFirst.textFirstSemantics.semanticDomTextPrimary, true);
assert.equal(textFirst.textFirstSemantics.webglOptionalSupportingNoncontrolling, true);
assert.equal(textFirst.textFirstSemantics.gestureHeavyFirstProofProhibited, true);
assert(lensInvariant.visualAuthorityLaws.includes('DEPTH_NOT_TRUTH'));
assert(narrativeInvariant.scientificMeaningImmutableUnder.includes('DEPTH_CHANGE'));
assert.equal(receipt.candidateDisposition, 'PASS_F7_INTERACTION_AND_ACCESSIBILITY_v1');
assert.equal(receipt.f8ConstructionAuthorityBeforeVerification, false);
assert.equal(receipt.f8ConstructionAuthorityAfterEffectivePass, true);
assert.equal(receipt.f9ThroughF12Authority, false);
assert(fixtures.negative.includes('FOCUS_DOES_NOT_ACTIVATE_DEPTH'));

for (const control of controlRegistry.controls) {
  assert.equal(typeof control.accessibleName, 'string');
  assert(control.accessibleName.length > 0);
  assert.equal(typeof control.role, 'string');
  assert(control.role.length > 0);
}
for (const depth of ['D0','D1','D2','D3','D4']) {
  const control = controlRegistry.controls.find(item => item.controlId === `DEPTH_${depth}`);
  assert(control, `missing semantic control for ${depth}`);
  assert.equal(control.operation, 'REQUEST_DEPTH');
  assert.equal(control.payload.depth, depth);
  assert.equal(control.focusable, true);
  assert.equal(control.requiresExplicitActivation, true);
}

const context = buildInteractionContext({ entrypointRegistry, stateBindings, empiricalRegistry, depthProfileRegistry, controlRegistry, modalityRegistry });
const bioCreated = createInteractionSession('BIO_LAB', context, 'D0');
const hurricaneCreated = createInteractionSession('HURRICANE_RAW_TC_RADAR_QC_CORRECTED', context, 'D0');
assert.equal(bioCreated.valid, true);
assert.equal(hurricaneCreated.valid, true);
const bio = bioCreated.session;
const hurricane = hurricaneCreated.session;

assert.equal(bio.projection.disclosed.claimCeilingRef, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY');
assert(bio.projection.disclosed.limitations.includes('PROSPECTIVE_CONFIRMATION_NOT_ESTABLISHED'));
assert(bio.projection.disclosed.limitations.includes('PUBLIC_OUTCOME_CONTAMINATION_PRESENT'));
assert.equal(hurricane.projection.disclosed.evidenceStanding, 'RAW_TC_RADAR_MECHANISTIC_NOT_SUPPORTED');
assert.equal(hurricane.projection.disclosed.adverseEvidence, true);
assert.equal(hurricane.projection.disclosed.additiveStanding, 'POSITIVE_POINT_ESTIMATE_INCONCLUSIVE');
assert(hurricane.projection.disclosed.limitations.includes('NO_EARLY_WARNING_CAUSAL_PROSPECTIVE_UNIVERSAL_OR_IMI_CONFIRMATION_CLAIM'));

const focusResults = USER_MODALITIES.map(modality => performInteraction(bio, action(modality, 'FOCUS', 'DEPTH_D3'), context));
assert.equal(compareModalityEquivalentResults(focusResults).valid, true);
for (const result of focusResults) {
  assert.equal(result.session.activeDepth, 'D0', 'focus silently activated depth');
  assert.equal(result.session.focusTarget, 'DEPTH_D3');
  assert.equal(result.session.scientificStateSha256, bio.scientificStateSha256);
  assert.equal(result.session.scientificBindingSha256, bio.scientificBindingSha256);
}

const depthResults = USER_MODALITIES.map(modality => performInteraction(bio, action(modality, 'ACTIVATE', 'DEPTH_D3'), context));
assert.equal(compareModalityEquivalentResults(depthResults).valid, true);
for (const result of depthResults) {
  assert.equal(result.session.activeDepth, 'D3');
  assert.equal(result.session.scientificStateSha256, bio.scientificStateSha256);
  assert.equal(result.session.scientificBindingSha256, bio.scientificBindingSha256);
  assert(result.session.projection.disclosedFieldNames.includes('caseScore'));
  assert(result.session.projection.disclosed.limitations.includes('PROSPECTIVE_CONFIRMATION_NOT_ESTABLISHED'));
}

for (const modality of ['KEYBOARD','ASSISTIVE_TECHNOLOGY']) {
  for (const depth of ['D0','D1','D2','D3','D4']) {
    const result = performInteraction(bio, action(modality, 'ACTIVATE', `DEPTH_${depth}`), context);
    assert.equal(result.valid, true, `${modality} cannot reach ${depth}`);
    assert.equal(result.session.activeDepth, depth);
    assert.equal(result.session.scientificBindingSha256, bio.scientificBindingSha256);
  }
}

const hiddenInquiry = performInteraction(bio, action('KEYBOARD','ACTIVATE','INQUIRE_FIELD',{ field: 'systemBoundary' }), context);
assert.equal(hiddenInquiry.valid, false);
assert(hiddenInquiry.errors.some(error => error.includes('FIELD_NOT_AUTHORIZED_AT_DEPTH')));
assert.equal(hiddenInquiry.session.activeDepth, 'D0');
assert.deepEqual(hiddenInquiry.recovery, sessionRecoverySnapshot(bio));
const visibleInquiry = performInteraction(bio, action('ASSISTIVE_TECHNOLOGY','ACTIVATE','INQUIRE_FIELD',{ field: 'terminalDisposition' }), context);
assert.equal(visibleInquiry.valid, true);
assert.equal(visibleInquiry.output.value, 'UCIC_ROUTE_SPECIFICITY_SUPPORTED_EXTERNAL_CSB');
assert.equal(visibleInquiry.session.activeDepth, 'D0');

const routeResults = USER_MODALITIES.map(modality => performInteraction(bio, action(modality,'ACTIVATE','NAVIGATE_ROUTE',{ routeId: 'F7_EQUIVALENCE_ROUTE' }), context));
assert.equal(compareModalityEquivalentResults(routeResults).valid, true);
for (const result of routeResults) {
  assert.deepEqual(result.output.changedAxes, ['ROUTE_HISTORY']);
  assert.notEqual(result.session.scientificStateSha256, bio.scientificStateSha256);
  assert.equal(result.session.scientificBindingSha256, bio.scientificBindingSha256);
  for (const axis of Object.keys(bio.state.axes).filter(axis => axis !== 'ROUTE_HISTORY')) assert.deepEqual(result.session.state.axes[axis], bio.state.axes[axis], `route interaction mutated ${axis}`);
}

const motionResults = USER_MODALITIES.map(modality => performInteraction(bio, action(modality,'ACTIVATE','MOTION_PREFERENCE',{ preference: 'REDUCED' }), context));
assert.equal(compareModalityEquivalentResults(motionResults).valid, true);
for (const result of motionResults) {
  assert.equal(result.session.motionPreference, 'REDUCED');
  assert.equal(result.session.scientificStateSha256, bio.scientificStateSha256);
  assert.equal(result.session.scientificBindingSha256, bio.scientificBindingSha256);
  assert.equal(result.session.activeDepth, 'D0');
  assert.deepEqual(result.session.projection.disclosed, bio.projection.disclosed);
}

for (const viewport of ['MOBILE','TABLET','DESKTOP']) {
  const result = adaptViewport(hurricane, viewport, context);
  assert.equal(result.valid, true);
  assert.equal(result.session.viewportClass, viewport);
  assert.equal(result.session.scientificStateSha256, hurricane.scientificStateSha256);
  assert.equal(result.session.scientificBindingSha256, hurricane.scientificBindingSha256);
  assert.equal(result.session.activeDepth, 'D0');
  assert.deepEqual(result.session.projection.disclosed, hurricane.projection.disclosed);
}

const unknownControl = performInteraction(bio, action('KEYBOARD','ACTIVATE','UNKNOWN_CONTROL'), context);
assert.equal(unknownControl.valid, false);
assert.deepEqual(unknownControl.recovery, sessionRecoverySnapshot(bio));
const badModality = performInteraction(bio, { schema: ACTION_SCHEMA, modality: 'VOICE_MAGIC', kind: 'FOCUS', controlId: 'DEPTH_D1', payload: {} }, context);
assert.equal(badModality.valid, false);
assert.deepEqual(badModality.recovery, sessionRecoverySnapshot(bio));
const overrideAction = performInteraction(bio, { ...action('POINTER','FOCUS','DEPTH_D1'), scientificOverride: { claimCeiling: 'UNIVERSAL' } }, context);
assert.equal(overrideAction.valid, false);
assert(overrideAction.errors.includes('ACTION_FIELDS_INVALID'));

const forgedClaimSession = clone(bio);
forgedClaimSession.state.axes.CLAIM_CEILING.value.ceilingId = 'UNIVERSAL_LAW_ESTABLISHED';
const forgedClaimResult = performInteraction(forgedClaimSession, action('KEYBOARD','FOCUS','DEPTH_D1'), context);
assert.equal(forgedClaimResult.valid, false, 'tampered claim session accepted');
assert(forgedClaimResult.errors[0].includes('SESSION_STATE_UNAUTHORIZED') || forgedClaimResult.errors[0].includes('SESSION_STATE_DIGEST_MISMATCH'));

const forgedEvidenceSession = clone(hurricane);
forgedEvidenceSession.state.axes.EVIDENCE.value.evidenceStatus = 'SUPPORTED';
const forgedEvidenceResult = performInteraction(forgedEvidenceSession, action('TOUCH','FOCUS','DEPTH_D2'), context);
assert.equal(forgedEvidenceResult.valid, false, 'tampered evidence session accepted');

const forgedProjectionSession = clone(hurricane);
forgedProjectionSession.projection.disclosed.evidenceStanding = 'SUPPORTED';
const forgedProjectionResult = performInteraction(forgedProjectionSession, action('ASSISTIVE_TECHNOLOGY','FOCUS','DEPTH_D2'), context);
assert.equal(forgedProjectionResult.valid, false, 'tampered disclosure session accepted');
assert(forgedProjectionResult.errors.includes('SESSION_PROJECTION_TAMPERED'));

const hurricaneBinding = bindingStateForSession(hurricane, context);
assert.equal(hurricaneBinding.axes.SYSTEM.status, 'UNSET');
assert.equal(hurricaneBinding.axes.SYSTEM.value, null);
assert.equal(hurricaneBinding.axes.MODEL.status, 'UNSET');
assert.equal(hurricaneBinding.axes.MODEL.value, null);
const bioBinding = bindingStateForSession(bio, context);
assert.equal(bioBinding.axes.CLAIM_CEILING.value.ceilingId, 'EXPLORATORY_EXTERNAL_ROUTE_CONCORDANCE_AND_SPECIFICITY_SUPPORT_ONLY');

console.log(JSON.stringify({
  gate: 'F7_INTERACTION_AND_ACCESSIBILITY',
  disposition: 'PASS_F7_INTERACTION_AND_ACCESSIBILITY_v1',
  modalities: USER_MODALITIES,
  permanentFileCount: expectedPermanentFiles.length,
  assertions: {
    modalityEquivalence: 'PASS',
    focusIsNotActivation: 'PASS',
    explicitDepthOnly: 'PASS',
    routeHistoryOnlyNavigation: 'PASS',
    reducedMotionEquivalence: 'PASS',
    viewportEquivalence: 'PASS',
    recoverableInvalidInteraction: 'PASS',
    perOperationSessionRevalidation: 'PASS',
    scientificStandingPreserved: 'PASS',
    noF8Construction: 'PASS'
  }
}, null, 2));
