import assert from 'node:assert/strict';
import crypto from 'node:crypto';
import fs from 'node:fs';
import { execFileSync } from 'node:child_process';
import {
  BASE_ROUTE,
  FRAGMENT_PREFIX,
  buildAuthorityRegistry,
  validateAuthorizedState,
  navigateWithinState,
  encodeDeepLink,
  decodeDeepLink,
  buildCrossObjectDeepLink,
  restoreReturn,
  createHistoryLedger,
  historyPush,
  historyBack,
  historyForward,
  reloadFromUrl
} from './navigator.v1.mjs';
import { serializeCanonical, validateTransition } from '../f3-resolution-and-validity-engine/resolver.v1.mjs';

const ROOT = 'control-plane/methods-information-benchmark/methods-models-integrated-environment-construction-v1';
const F1 = `${ROOT}/f1-construction-baseline`;
const F3 = `${ROOT}/f3-resolution-and-validity-engine`;
const F4 = `${ROOT}/f4-scientific-content-binding`;
const F5 = `${ROOT}/f5-navigation-and-continuity`;
const F4_HEAD = '343077118a3e6b00478369b64b11f47db7c9568e';
const F4_TREE = '59f9d0c2c67ac3fc6d08e6438331db54e66733cc';
const MAIN = 'a8ef9e4b4701bd15d09ad14c829e2f4b10f9ccfc';
const MAIN_TREE = '420e56a71801034c3e40e66d1048302a39a55da7';
const TEMP_WORKFLOW = '.github/workflows/temporary-methods-models-final-f5-verify.yml';

const git = (...args) => execFileSync('git', args, { encoding: 'utf8' }).trim();
const readJson = path => JSON.parse(fs.readFileSync(path, 'utf8'));
const clone = value => structuredClone(value);
const hash = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const b64 = text => Buffer.from(text, 'utf8').toString('base64url');
const unb64 = token => Buffer.from(token, 'base64url').toString('utf8');
const canonicalBytes = state => {
  const serialized = serializeCanonical(state);
  assert.notEqual(serialized.resolutionClass, 'INVALID', `state failed F3 canonicalization: ${(serialized.errors ?? []).join('|')}`);
  return serialized.bytes;
};

assert.equal(git('show','-s','--format=%T',F4_HEAD), F4_TREE, 'F4 tree drift');
execFileSync('git', ['merge-base','--is-ancestor',F4_HEAD,'HEAD']);
assert.equal(git('rev-parse','origin/main'), MAIN, 'governing main drift');
assert.equal(git('show','-s','--format=%T','origin/main'), MAIN_TREE, 'governing main tree drift');

const expectedUpstreamBlobs = {
  [`${F4}/f4-terminal-receipt.v1.json`]: 'e25c7922e56417c207935d79e7790fc1b1095dff',
  [`${F4}/state-bindings.v1.json`]: 'c140e326272ade6bb093eb71048fac353162cc1c',
  [`${F3}/resolver.v1.mjs`]: '3654d269ad38fc19d3b670fe8331f7c72cef1e26',
  [`${F3}/validity-contract.v1.json`]: 'c67ddf8bd744b837ac94cf475a729ddf3a60d409',
  [`${F3}/canonicalization-contract.v1.json`]: 'cd8ba4ca872788f53cc0d2efb0846a48ce6948f9',
  [`${F1}/public-and-runtime-baseline.v1.json`]: '58e42ffa3727895092a300bc49bf15f2ef56b41e',
  ['control-plane/whole-estate/invariant-contract-package-v1/invariant-registry.v1.json']: '748f017d9ea37214d0853d21622ebd764d390915',
  ['control-plane/whole-estate/invariant-contract-package-v1/routing-return-context-invariant-contract.v1.json']: 'e73c70a587b796ca722b209407c171f22bae0117',
  ['.github/ai-router/projects/methods-information-benchmark/spatial-database-text-first-interaction-contract-v2-permanent-ratification.v1.json']: '0375241beb7ae76030402fb882d9cc1d46b257a5'
};
for (const [path, blob] of Object.entries(expectedUpstreamBlobs)) assert.equal(git('rev-parse', `${F4_HEAD}:${path}`), blob, `upstream blob drift: ${path}`);

const changed = git('diff','--name-only',`${F4_HEAD}..HEAD`).split('\n').filter(Boolean);
assert(changed.length >= 1, 'F5 candidate has no changes');
for (const path of changed) assert(path.startsWith(`${F5}/`) || path === TEMP_WORKFLOW, `unauthorized F5 path mutation: ${path}`);
assert(!changed.some(path => path.includes('/f6-')), 'F6 artifact introduced before authority');
assert(!changed.some(path => path.startsWith('laws/research/methods-and-models/')), 'public Methods page mutated in F5');

const sourceBindings = readJson(`${F5}/source-bindings.v1.json`);
const navigation = readJson(`${F5}/navigation-contract.v1.json`);
const codec = readJson(`${F5}/url-codec-contract.v1.json`);
const entrypoints = readJson(`${F5}/entrypoint-registry.v1.json`);
const relations = readJson(`${F5}/semantic-route-admission.v1.json`);
const returnContract = readJson(`${F5}/return-context-contract.v1.json`);
const historyContract = readJson(`${F5}/history-contract.v1.json`);
const fixtures = readJson(`${F5}/conformance-fixtures.v1.json`);
const receipt = readJson(`${F5}/f5-terminal-receipt.v1.json`);
const f4Bindings = readJson(`${F4}/state-bindings.v1.json`);
const f1Public = readJson(`${F1}/public-and-runtime-baseline.v1.json`);
const cp6Return = readJson('control-plane/whole-estate/invariant-contract-package-v1/routing-return-context-invariant-contract.v1.json');

assert.equal(sourceBindings.inputF4.finalHead, F4_HEAD);
assert.equal(sourceBindings.inputF4.finalTree, F4_TREE);
assert.equal(navigation.governingPrinciple, 'NAVIGATION_MAY_CHANGE_LOCATION_BUT_MAY_NOT_CHANGE_SCIENTIFIC_MEANING');
assert.deepEqual(navigation.operationClasses.NAVIGATION_MUTATION.allowedStateMutation, ['ROUTE_HISTORY']);
assert.equal(codec.canonicalBaseRoute, f1Public.publicMethodsBaseline.route);
assert.equal(codec.canonicalBaseRoute, BASE_ROUTE);
assert.equal(codec.fragmentPrefix, FRAGMENT_PREFIX);
assert.equal(codec.silentFallbackAuthorized, false);
assert.equal(relations.bundledRelations.length, 0);
assert.equal(relations.entryPointCoexistenceCreatesRelation, false);
assert.equal(entrypoints.entryPoints.length, 2);
assert.equal(returnContract.silentFallbackAuthorized, false);
for (const field of cp6Return.returnContext.minimumFields) assert(returnContract.cp6MinimumFieldsPreserved.includes(field), `CP6 return field lost: ${field}`);
assert.equal(historyContract.historyMayNotInferScientificState, true);
assert.equal(receipt.candidateDisposition, 'PASS_F5_NAVIGATION_AND_CONTINUITY_v1');
assert.equal(receipt.f6ConstructionAuthorityBeforeVerification, false);
assert.equal(receipt.f6ConstructionAuthorityAfterEffectivePass, true);
assert.equal(receipt.f7ThroughF12Authority, false);

const authority = buildAuthorityRegistry(entrypoints, f4Bindings);
assert.deepEqual(Object.keys(authority).sort(), ['BIO_LAB','HURRICANE_RAW_TC_RADAR_QC_CORRECTED'].sort());
const bio = clone(authority.BIO_LAB.baseState);
const hurricane = clone(authority.HURRICANE_RAW_TC_RADAR_QC_CORRECTED.baseState);

const bioAuthorized = validateAuthorizedState(bio, 'BIO_LAB', authority);
const hurricaneAuthorized = validateAuthorizedState(hurricane, 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED', authority);
assert.equal(bioAuthorized.valid, true);
assert.equal(bioAuthorized.resolutionClass, 'RESOLVED');
assert.equal(hurricaneAuthorized.valid, true);
assert.equal(hurricaneAuthorized.resolutionClass, 'PARTIAL');

const bioUrl = encodeDeepLink(bio, 'BIO_LAB', authority);
const hurricaneUrl = encodeDeepLink(hurricane, 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED', authority);
const bioDecoded = decodeDeepLink(bioUrl, authority);
const hurricaneDecoded = decodeDeepLink(hurricaneUrl, authority);
assert.equal(bioDecoded.valid, true);
assert.equal(hurricaneDecoded.valid, true);
assert.equal(canonicalBytes(bioDecoded.state), canonicalBytes(bioAuthorized.state));
assert.equal(canonicalBytes(hurricaneDecoded.state), canonicalBytes(hurricaneAuthorized.state));
assert.equal(hurricaneDecoded.resolutionClass, 'PARTIAL');
assert.equal(reloadFromUrl(bioUrl, authority).canonicalUrl, bioUrl);
assert.equal(reloadFromUrl(hurricaneUrl, authority).canonicalUrl, hurricaneUrl);

const routed1 = navigateWithinState(bio, 'ENTRY:BIO_LAB');
assert.equal(routed1.valid, true);
assert.deepEqual(routed1.changedAxes, ['ROUTE_HISTORY']);
assert.equal(validateAuthorizedState(routed1.state, 'BIO_LAB', authority).valid, true);
for (const axis of Object.keys(bio.axes).filter(axis => axis !== 'ROUTE_HISTORY')) assert.deepEqual(routed1.state.axes[axis], bio.axes[axis], `navigation mutated ${axis}`);
const routed2 = navigateWithinState(routed1.state, 'RETURNABLE:DETAIL');
assert.equal(routed2.valid, true);
const routed3 = navigateWithinState(routed1.state, 'ALTERNATE:DETAIL');
assert.equal(routed3.valid, true);

const url1 = encodeDeepLink(routed1.state, 'BIO_LAB', authority);
const url2 = encodeDeepLink(routed2.state, 'BIO_LAB', authority);
const url3 = encodeDeepLink(routed3.state, 'BIO_LAB', authority);
let ledger = createHistoryLedger(bioUrl, authority);
let pushed = historyPush(ledger, url1, authority); assert.equal(pushed.valid, true); ledger = pushed.ledger;
pushed = historyPush(ledger, url2, authority); assert.equal(pushed.valid, true); ledger = pushed.ledger;
assert.equal(ledger.entries.length, 3);
let back = historyBack(ledger, authority); assert.equal(back.valid, true); ledger = back.ledger;
assert.equal(back.restored.canonicalUrl, url1);
let forward = historyForward(ledger, authority); assert.equal(forward.valid, true); ledger = forward.ledger;
assert.equal(forward.restored.canonicalUrl, url2);
back = historyBack(ledger, authority); assert.equal(back.valid, true); ledger = back.ledger;
pushed = historyPush(ledger, url3, authority); assert.equal(pushed.valid, true); ledger = pushed.ledger;
assert.equal(ledger.entries.length, 3);
assert.equal(ledger.entries[2], url3);
assert.equal(historyForward(ledger, authority).valid, false);

const testRelations = {
  bundledRelations: [{
    relationId: 'TEST_AUTHORIZED_RELATION',
    fromObjectId: 'BIO_LAB',
    toObjectId: 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED'
  }]
};
assert.throws(() => buildCrossObjectDeepLink(bio, 'BIO_LAB', hurricane, 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED', 'TEST_AUTHORIZED_RELATION', relations, authority), /DECLARED_SEMANTIC_RELATION_NO_MATCH/);
const crossUrl = buildCrossObjectDeepLink(bio, 'BIO_LAB', hurricane, 'HURRICANE_RAW_TC_RADAR_QC_CORRECTED', 'TEST_AUTHORIZED_RELATION', testRelations, authority, 'BIO_ORIGIN', 'F6_UNDEFINED', 'HURRICANE_DESTINATION');
const crossDecoded = decodeDeepLink(crossUrl, authority, testRelations);
assert.equal(crossDecoded.valid, true);
assert(crossDecoded.returnContext);
const returned = restoreReturn(crossDecoded.returnContext, authority);
assert.equal(returned.valid, true);
assert.equal(returned.entryPointId, 'BIO_LAB');
assert.equal(returned.route, 'BIO_ORIGIN');
assert.equal(canonicalBytes(returned.state), canonicalBytes(bioAuthorized.state));
assert.equal(decodeDeepLink(crossUrl, authority, relations).valid, false, 'return-bearing link accepted without relation authority');

function unpack(url) {
  const parsed = new URL(url, 'https://f5.invalid');
  const tail = parsed.hash.slice(FRAGMENT_PREFIX.length);
  const dot = tail.lastIndexOf('.');
  const canonical = unb64(tail.slice(0, dot));
  return JSON.parse(canonical);
}
function repack(capsule, canonicalOverride = null) {
  const canonical = canonicalOverride ?? JSON.stringify(capsule);
  return `${BASE_ROUTE}${FRAGMENT_PREFIX}${b64(canonical)}.${hash(canonical)}`;
}

const tamperedCapsuleDigest = `${bioUrl.slice(0, -1)}${bioUrl.endsWith('0') ? '1' : '0'}`;
assert.equal(decodeDeepLink(tamperedCapsuleDigest, authority).valid, false);

const stateDigestMismatchCapsule = unpack(bioUrl);
stateDigestMismatchCapsule.stateSha256 = '0'.repeat(64);
assert.equal(decodeDeepLink(repack(stateDigestMismatchCapsule), authority).valid, false);

const reordered = unpack(bioUrl);
const nonCanonicalCapsule = {
  codecVersion: reordered.codecVersion,
  schema: reordered.schema,
  entryPointId: reordered.entryPointId,
  stateSha256: reordered.stateSha256,
  stateBytesB64Url: reordered.stateBytesB64Url,
  returnContext: reordered.returnContext
};
assert.equal(decodeDeepLink(repack(nonCanonicalCapsule), authority).valid, false);

const unknownEntry = unpack(bioUrl);
unknownEntry.entryPointId = 'UNKNOWN_ENTRY';
assert.equal(decodeDeepLink(repack(unknownEntry), authority).valid, false);

const forgedClaimState = clone(bio);
forgedClaimState.axes.CLAIM_CEILING.value.ceilingId = 'UNIVERSAL_LAW_ESTABLISHED';
const forgedClaimSerialized = serializeCanonical(forgedClaimState);
assert.notEqual(forgedClaimSerialized.resolutionClass, 'INVALID', 'forged claim must remain structurally valid for authority attack');
const forgedClaimCapsule = unpack(bioUrl);
forgedClaimCapsule.stateSha256 = forgedClaimSerialized.sha256;
forgedClaimCapsule.stateBytesB64Url = b64(forgedClaimSerialized.bytes);
assert.equal(decodeDeepLink(repack(forgedClaimCapsule), authority).valid, false, 'self-consistent forged claim URL accepted');
assert.equal(validateAuthorizedState(forgedClaimState, 'BIO_LAB', authority).valid, false);

const forgedEvidenceState = clone(hurricane);
forgedEvidenceState.axes.EVIDENCE.value.evidenceStatus = 'SUPPORTED';
forgedEvidenceState.axes.EVIDENCE.value.disposition = 'SUPPORTED';
const forgedEvidenceSerialized = serializeCanonical(forgedEvidenceState);
assert.notEqual(forgedEvidenceSerialized.resolutionClass, 'INVALID');
const forgedEvidenceCapsule = unpack(hurricaneUrl);
forgedEvidenceCapsule.stateSha256 = forgedEvidenceSerialized.sha256;
forgedEvidenceCapsule.stateBytesB64Url = b64(forgedEvidenceSerialized.bytes);
assert.equal(decodeDeepLink(repack(forgedEvidenceCapsule), authority).valid, false, 'self-consistent forged evidence URL accepted');

const scientificObjectMutation = clone(bio);
scientificObjectMutation.axes.SCIENTIFIC_OBJECT.value.objectId = 'OTHER_OBJECT';
assert.equal(validateTransition(bio, scientificObjectMutation, 'NAVIGATION').valid, false);
assert.equal(validateAuthorizedState(scientificObjectMutation, 'BIO_LAB', authority).valid, false);

const tamperedReturnObject = unpack(crossUrl);
tamperedReturnObject.returnContext.ORIGIN_OBJECT_ID = 'OTHER_OBJECT';
assert.equal(decodeDeepLink(repack(tamperedReturnObject), authority, testRelations).valid, false);

const tamperedReturnState = unpack(crossUrl);
const hurricaneSerialized = serializeCanonical(hurricane);
tamperedReturnState.returnContext.ORIGIN_STATE_SHA256 = hurricaneSerialized.sha256;
tamperedReturnState.returnContext.ORIGIN_STATE_BYTES_B64URL = b64(hurricaneSerialized.bytes);
tamperedReturnState.returnContext.RETURN_TARGET = `STATE_SHA256:${hurricaneSerialized.sha256}#ROUTE:${tamperedReturnState.returnContext.ORIGIN_ROUTE}`;
assert.equal(decodeDeepLink(repack(tamperedReturnState), authority, testRelations).valid, false);

assert.equal(decodeDeepLink(`${BASE_ROUTE}?claim=universal${new URL(bioUrl, 'https://f5.invalid').hash}`, authority).valid, false);
assert.equal(decodeDeepLink(`/wrong-route/${new URL(bioUrl, 'https://f5.invalid').hash}`, authority).valid, false);

assert.equal(fixtures.fixtures.length, 21);
assert.equal(fixtures.requiredAdversarialBoundary, 'A_SELF_CONSISTENT_URL_IS_NOT_AUTHORITY_AND_MUST_NOT_BE_ABLE_TO_PROMOTE_OR_REWRITE_SCIENTIFIC_STATE');

console.log('PASS_F5_NAVIGATION_AND_CONTINUITY_v1');
console.log(JSON.stringify({
  inputF4Head: F4_HEAD,
  directEntryPoints: entrypoints.entryPoints.length,
  bundledCrossObjectRelations: relations.bundledRelations.length,
  bioResolution: bioAuthorized.resolutionClass,
  hurricaneResolution: hurricaneAuthorized.resolutionClass,
  navigationChangedAxes: routed1.changedAxes,
  fixtures: fixtures.fixtures.length,
  canonicalBaseRoute: BASE_ROUTE,
  scientificClaimUpgrade: false,
  publicMutation: false,
  visualConstruction: false,
  spatialTopology: false,
  geometry: false,
  f6ConstructionAuthorityAfterEffectivePass: true,
  f7ThroughF12Authority: false
}, null, 2));
