import assert from 'node:assert/strict';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  AXIS_ORDER,
  AXIS_STATUSES,
  RESOLUTION_PRECEDENCE,
  resolveState,
  serializeCanonical,
  restoreCanonical,
  validateTransition
} from './resolver.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F2 = `${ROOT}/f2-canonical-state-kernel`;
const F3 = `${ROOT}/f3-resolution-and-validity-engine`;
const F2_HEAD = '1381807be7f5420588ea107f73d449cbbd61b65f';
const F2_TREE = '61e0369af8a65bb5598ac9e4c56677d89bdb672e';
const MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const MAIN_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f3-verify.yml';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const deep = value => structuredClone(value);
const axis = (status = 'NOT_APPLICABLE', value = null, authorityRef = 'F3_FIXTURE_AUTHORITY', sourceRef = 'F3_FIXTURE_SOURCE') => ({ status, authorityRef, sourceRef, value });

assert.equal(git('show','-s','--format=%T',F2_HEAD), F2_TREE, 'F2 tree drift');
execFileSync('git', ['merge-base','--is-ancestor',F2_HEAD,'HEAD']);
assert.equal(git('rev-parse','origin/main'), MAIN, 'governing main drift');
assert.equal(git('show','-s','--format=%T','origin/main'), MAIN_TREE, 'governing main tree drift');

const expectedF2Blobs = {
  [`${F2}/f2-terminal-receipt.v1.json`]: 'f332ecc995e728733975ace43e32d0ecb178f47d',
  [`${F2}/canonical-state-kernel.v1.json`]: '5fe4506824b7fb4c8816583f59423911d7301157',
  [`${F2}/axis-registry.v1.json`]: 'c3dcaf8efd5822c151e17eb9267a8d55acfd0892',
  [`${F2}/state-envelope.schema.v1.json`]: '3ddd8e549200f0c0c6e673369fa3c02290a68683',
  [`${F2}/authority-and-plane-contract.v1.json`]: '5c9062e19be617936cb137cde4cf9fc450d30d88',
  [`${F2}/source-bindings.v1.json`]: '2bc09f28af80dbb8734551e3e392cce86e46e0a1'
};
for (const [path, blob] of Object.entries(expectedF2Blobs)) assert.equal(git('rev-parse', `${F2_HEAD}:${path}`), blob, `F2 source blob drift: ${path}`);

const changed = git('diff','--name-only',`${F2_HEAD}..HEAD`).split('\n').filter(Boolean);
assert(changed.length >= 1, 'F3 candidate has no changes');
for (const path of changed) assert(path.startsWith(`${F3}/`) || path === TEMP_WORKFLOW, `unauthorized F3 path mutation: ${path}`);

const f2Kernel = readJson(`${F2}/canonical-state-kernel.v1.json`);
const f2Axes = readJson(`${F2}/axis-registry.v1.json`);
const f2Planes = readJson(`${F2}/authority-and-plane-contract.v1.json`);
const sourceBindings = readJson(`${F3}/source-bindings.v1.json`);
const defaultsPolicy = readJson(`${F3}/default-policy.v1.json`);
const validity = readJson(`${F3}/validity-contract.v1.json`);
const canonical = readJson(`${F3}/canonicalization-contract.v1.json`);
const receipt = readJson(`${F3}/f3-terminal-receipt.v1.json`);
const fixtures = readJson(`${F3}/conformance-fixtures.v1.json`);

assert.deepEqual(f2Kernel.axisOrder, AXIS_ORDER);
assert.equal(f2Kernel.axisCount, 13);
assert.deepEqual(f2Axes.axisStatusVocabulary, AXIS_STATUSES);
assert.deepEqual(RESOLUTION_PRECEDENCE, ['INVALID','UNEVALUABLE','PARTIAL','RESOLVED']);
assert.deepEqual(validity.precedence, RESOLUTION_PRECEDENCE);
assert.equal(sourceBindings.inputF2.finalHead, F2_HEAD);
assert.equal(sourceBindings.inputF2.finalTree, F2_TREE);
assert.equal(sourceBindings.researchSpecificResolutionLogicAuthorized, false);
assert.equal(defaultsPolicy.bundledDefaults.length, 0);
assert.equal(defaultsPolicy.allowedTargetStatus, 'UNSET');
assert.deepEqual(defaultsPolicy.forbiddenTargetStatuses, ['DECLARED','UNEVALUABLE','NOT_APPLICABLE']);
assert.equal(f2Planes.authorityMetadataRule, 'EVERY_AXIS_CARRIES_AUTHORITY_REF_AND_SOURCE_REF_WITHOUT_CREATING_AN_AUTHORITY_AXIS');
assert(!AXIS_ORDER.includes('AUTHORITY'));
assert.equal(canonical.arrayRule, 'PRESERVE_INPUT_ORDER_EXACTLY');
assert.equal(receipt.candidateDisposition, 'PASS_F3_RESOLUTION_AND_VALIDITY_ENGINE_v1');
assert.equal(receipt.f4ConstructionAuthorityBeforeVerification, false);
assert.equal(receipt.f4ConstructionAuthorityAfterEffectivePass, true);
assert.equal(receipt.f5ThroughF12Authority, false);

function baseResolvedState() {
  const axes = Object.fromEntries(AXIS_ORDER.map(name => [name, axis()]));
  axes.SYSTEM = axis('DECLARED', { systemId: 'GENERIC_SYSTEM', boundaryRef: 'GENERIC_BOUNDARY' });
  axes.SCIENTIFIC_OBJECT = axis('DECLARED', { objectClass: 'METHOD', objectId: 'GENERIC_METHOD_OBJECT' });
  axes.LENS = axis('DECLARED', { lensId: 'TEXT_FIRST' });
  axes.VIEW_MODE = axis('DECLARED', { viewModeId: 'PRIMARY' });
  axes.ROUTE_HISTORY = axis('DECLARED', ['methods','models']);
  axes.CONTENT_VERSION = axis('DECLARED', { contentVersionId: 'fixture-v1', contentFingerprint: 'fixture-fingerprint-v1' });
  return { schema: 'METHODS_MODELS_CANONICAL_ENVIRONMENT_STATE_v1', kernelVersion: 'TEXT_FIRST_STATEFUL_METHODS_MODELS_CANONICAL_STATE_v1', axes };
}

const resolved = baseResolvedState();
assert.equal(resolveState(resolved).resolutionClass, 'RESOLVED');

const partial = deep(resolved);
partial.axes.EVIDENCE = axis('UNSET');
assert.equal(resolveState(partial).resolutionClass, 'PARTIAL');
assert.equal(resolveState(partial).state.axes.EVIDENCE.status, 'UNSET');

const unevaluable = deep(partial);
unevaluable.axes.EVIDENCE = axis('UNEVALUABLE');
unevaluable.axes.EXECUTION = axis('UNSET');
assert.equal(resolveState(unevaluable).resolutionClass, 'UNEVALUABLE');
assert.equal(resolveState(unevaluable).state.axes.EVIDENCE.status, 'UNEVALUABLE');
assert.equal(resolveState(unevaluable).state.axes.EXECUTION.status, 'UNSET');

const missing = deep(resolved);
delete missing.axes.MODEL;
assert.equal(resolveState(missing).resolutionClass, 'INVALID');

const extra = deep(resolved);
extra.axes.AUTHORITY = axis();
assert.equal(resolveState(extra).resolutionClass, 'INVALID');

const declaredNull = deep(resolved);
declaredNull.axes.MODEL = axis('DECLARED', null);
assert.equal(resolveState(declaredNull).resolutionClass, 'INVALID');

const nondeclaredValue = deep(resolved);
nondeclaredValue.axes.MODEL = axis('UNSET', { modelId: 'X', role: 'Y' });
assert.equal(resolveState(nondeclaredValue).resolutionClass, 'INVALID');

const unknownStatus = deep(resolved);
unknownStatus.axes.MODEL.status = 'MISSING';
assert.equal(resolveState(unknownStatus).resolutionClass, 'INVALID');

const invalidSupport = deep(resolved);
invalidSupport.axes.SUPPORT_MODE = axis('DECLARED', { mode: 'SUCCESS' });
assert.equal(resolveState(invalidSupport).resolutionClass, 'INVALID');

const custodyConflict = deep(resolved);
custodyConflict.axes.METHOD_STAGE = axis('DECLARED', { stageId: 'GENERIC_STAGE', order: 1, custodyDomain: 'SOURCE_SIDE' });
custodyConflict.axes.CUSTODY = axis('DECLARED', { custodyDomain: 'ANALYST_SIDE', custodyStatus: 'HELD' });
assert.equal(resolveState(custodyConflict).resolutionClass, 'INVALID');
assert(resolveState(custodyConflict).errors.includes('METHOD_STAGE_CUSTODY_DOMAIN_CONSISTENCY'));

const defaultTarget = deep(resolved);
defaultTarget.axes.LENS = axis('UNSET');
const lensDefault = { defaults: [{
  defaultId: 'GENERIC_TEXT_LENS_DEFAULT',
  axis: 'LENS',
  mutationAuthority: f2Axes.axes.LENS.mutationAuthority,
  authorityRef: 'REGISTERED_DEFAULT_AUTHORITY',
  sourceRef: 'REGISTERED_DEFAULT_SOURCE',
  value: { lensId: 'TEXT_FIRST' }
}]};
const defaulted = resolveState(defaultTarget, { defaultRegistry: lensDefault });
assert.equal(defaulted.resolutionClass, 'RESOLVED');
assert.deepEqual(defaulted.defaultsApplied, ['GENERIC_TEXT_LENS_DEFAULT']);
assert.equal(defaulted.state.axes.LENS.status, 'DECLARED');

const noDefaultUnevaluable = deep(resolved);
noDefaultUnevaluable.axes.LENS = axis('UNEVALUABLE');
assert.equal(resolveState(noDefaultUnevaluable, { defaultRegistry: lensDefault }).resolutionClass, 'INVALID');

const wrongAuthorityDefault = deep(resolved);
wrongAuthorityDefault.axes.LENS = axis('UNSET');
const wrongRegistry = deep(lensDefault);
wrongRegistry.defaults[0].mutationAuthority = 'EVIDENCE_ADJUDICATION_ONLY';
assert.equal(resolveState(wrongAuthorityDefault, { defaultRegistry: wrongRegistry }).resolutionClass, 'INVALID');

const representationAfter = deep(resolved);
representationAfter.axes.LENS = axis('DECLARED', { lensId: 'ALTERNATE_TEXT' });
assert.equal(validateTransition(resolved, representationAfter, 'REPRESENTATION').valid, true);

const badRepresentation = deep(representationAfter);
badRepresentation.axes.EVIDENCE = axis('UNEVALUABLE');
assert.equal(validateTransition(resolved, badRepresentation, 'REPRESENTATION').valid, false);

const badNavigation = deep(resolved);
badNavigation.axes.ROUTE_HISTORY = axis('DECLARED', ['methods','models','return']);
badNavigation.axes.SYSTEM = axis('DECLARED', { systemId: 'OTHER_SYSTEM', boundaryRef: 'GENERIC_BOUNDARY' });
assert.equal(validateTransition(resolved, badNavigation, 'NAVIGATION').valid, false);

const badExecution = deep(resolved);
badExecution.axes.EXECUTION = axis('DECLARED', { executionId: 'EXECUTION_1', executionStatus: 'ACTIVE', scientificResultStatus: 'NONE' });
badExecution.axes.EVIDENCE = axis('UNEVALUABLE');
assert.equal(validateTransition(resolved, badExecution, 'EXECUTION').valid, false);

const serialized = serializeCanonical(resolved);
assert.equal(serialized.resolutionClass, 'RESOLVED');
assert(serialized.bytes && serialized.sha256);
const restored = restoreCanonical(serialized.bytes);
assert.equal(restored.canonical, true);
assert.equal(restored.sha256, serialized.sha256);
assert.equal(JSON.stringify(restored.state), JSON.stringify(resolved));

const nonCanonicalBytes = JSON.stringify(JSON.parse(serialized.bytes), null, 2);
assert.equal(restoreCanonical(nonCanonicalBytes).resolutionClass, 'INVALID');
assert(restoreCanonical(nonCanonicalBytes).errors.includes('NON_CANONICAL_SERIALIZATION'));

const ordered = deep(resolved);
ordered.axes.ROUTE_HISTORY = axis('DECLARED', ['z-last','a-first']);
ordered.axes.CLAIM_CEILING = axis('DECLARED', { ceilingId: 'BOUND', scopeRef: 'GENERIC_SCOPE', prohibitions: ['SECOND','FIRST'] });
const orderedBytes = serializeCanonical(ordered).bytes;
const orderedParsed = JSON.parse(orderedBytes);
assert.deepEqual(orderedParsed.axes.ROUTE_HISTORY.value, ['z-last','a-first']);
assert.deepEqual(orderedParsed.axes.CLAIM_CEILING.value.prohibitions, ['SECOND','FIRST']);

const coreFiles = [
  `${F3}/README.md`,
  `${F3}/default-policy.v1.json`,
  `${F3}/validity-contract.v1.json`,
  `${F3}/canonicalization-contract.v1.json`,
  `${F3}/resolver.v1.mjs`
];
for (const token of fixtures.forbiddenResearchSpecificTokensInCoreContracts) {
  for (const path of coreFiles) assert(!fs.readFileSync(path, 'utf8').includes(token), `research-specific token in F3 core: ${token} @ ${path}`);
}

console.log('PASS_F3_RESOLUTION_AND_VALIDITY_ENGINE_v1');
console.log(JSON.stringify({
  inputF2Head: F2_HEAD,
  axisCount: AXIS_ORDER.length,
  axisStatuses: AXIS_STATUSES,
  resolutionPrecedence: RESOLUTION_PRECEDENCE,
  bundledDefaults: defaultsPolicy.bundledDefaults.length,
  fixtures: fixtures.fixtures.length,
  canonicalDigestExample: serialized.sha256,
  changedPaths: changed.length,
  scientificClaimUpgrade: false,
  publicMutation: false,
  f4ConstructionAuthorityAfterEffectivePass: true,
  f5ThroughF12Authority: false
}, null, 2));
