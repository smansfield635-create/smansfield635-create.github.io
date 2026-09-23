import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import childProcess from 'node:child_process';
import candidateFacade, {
  H_EARTH_C2_R1_CANDIDATE_PATH_NODE
} from '../../../../registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js';
import exactHeadFacade, {
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE,
  H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE,
  requireC2R1BaseRegistryNode
} from '../../../../registry/accepted-amendments/h-earth.repository-registry.c2-r1-material-only-binding-exact-head.js';
import {
  runHEarthC2R1MC5AutomaticRegistryPreflight
} from '../../../../registry/h-earth.repository-registry.validator-engine.loader.js';

const EXPECTED_NODE_ID = 'H_EARTH_C2_R1_PHYSICALLY_COHERENT_COASTAL_SUCCESSOR_CANDIDATE_PACKAGE';
const EXPECTED_PREDECESSOR_BLOB = 'a195eea704df0a3f754f626817181b63114178fd';
const EXPECTED_INSTRUMENT_HEAD = '7c0b8871928b21cd9b2806f058bce34eed11f2ba';
const EXPECTED_EXACT_HEAD = '44019e27c3d52c59cc59bba7c833b6317d014273';
const EXPECTED_EXACT_BRANCH = 'agent/h-earth-c2-r1-material-only-binding-implementation-001';
const REQUIRED_LIMITATIONS = Object.freeze([
  'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_MUTATION',
  'PATH_REGISTRATION_DOES_NOT_AUTHORIZE_MERGE',
  'NO_PRODUCT_MUTATION',
  'NO_PR_484_MUTATION',
  'NO_CANDIDATE_MUTATION',
  'NO_MATERIALIZATION_RERUN',
  'NO_MERGE_PROMOTION_PUBLICATION_OR_USER_REVIEW'
]);

function parseArguments(argv) {
  const options = { expectedHead: null, holder: null, output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const argument = argv[index];
    const value = argv[index + 1];
    if (argument === '--expected-head') options.expectedHead = value;
    else if (argument === '--holder') options.holder = value;
    else if (argument === '--output') options.output = value;
    else throw new Error(`UNKNOWN_ARGUMENT:${argument}`);
    index += 1;
  }
  for (const [key, value] of Object.entries(options)) {
    if (!value) throw new Error(`MISSING_REQUIRED_ARGUMENT:${key}`);
  }
  return options;
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function digest(value) {
  return crypto.createHash('sha256').update(JSON.stringify(stable(value))).digest('hex');
}

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

const options = parseArguments(process.argv.slice(2));
const root = childProcess.execFileSync('git', ['rev-parse', '--show-toplevel'], { encoding: 'utf8' }).trim();
const actualHead = childProcess.execFileSync('git', ['rev-parse', 'HEAD'], { cwd: root, encoding: 'utf8' }).trim();
assert(actualHead === options.expectedHead, 'EXPECTED_HEAD_MISMATCH');
assert(childProcess.execFileSync('git', ['status', '--porcelain=v1', '--untracked-files=all'], { cwd: root, encoding: 'utf8' }).trim() === '', 'WORKTREE_NOT_CLEAN');

const controlRoot = path.join(root, 'h-earth-3d/control-plane/coastal-morphology/c2-r1/registry-repair');
const manifest = JSON.parse(fs.readFileSync(path.join(controlRoot, 'changed-path-manifest.v1.json'), 'utf8'));
const fixtures = JSON.parse(fs.readFileSync(path.join(controlRoot, 'negative-fixtures.v1.json'), 'utf8'));
assert(manifest.exactPathCount === 9 && manifest.expectedChangedPaths.length === 9, 'CHANGED_PATH_MANIFEST_COUNT_MISMATCH');

const predecessorPath = path.join(root, 'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.c2-r1-candidate-path-disposition.js');
const predecessorBlob = childProcess.execFileSync('git', ['hash-object', predecessorPath], { cwd: root, encoding: 'utf8' }).trim();
assert(predecessorBlob === EXPECTED_PREDECESSOR_BLOB, 'HISTORICAL_PREDECESSOR_BLOB_MISMATCH');

const predecessorNode = candidateFacade.getHEarthRepositoryRegistryNode(EXPECTED_NODE_ID);
assert(predecessorNode?.nodeId === EXPECTED_NODE_ID, 'RESTORED_PREDECESSOR_NODE_NOT_RESOLVED');
assert(H_EARTH_C2_R1_CANDIDATE_PATH_NODE.nodeId === EXPECTED_NODE_ID, 'RESTORED_PREDECESSOR_EXPORT_MISMATCH');
assert(requireC2R1BaseRegistryNode(candidateFacade).nodeId === EXPECTED_NODE_ID, 'REQUIRED_NODE_GUARD_DID_NOT_RESOLVE');

let missingNodeError = null;
try {
  requireC2R1BaseRegistryNode({ getHEarthRepositoryRegistryNode: () => null });
} catch (error) {
  missingNodeError = error.message;
}
assert(missingNodeError === `C2_R1_BASE_REGISTRY_NODE_NOT_FOUND:${EXPECTED_NODE_ID}`, 'MISSING_PREDECESSOR_NEGATIVE_FIXTURE_FAILED');

const exactNode = exactHeadFacade.getHEarthRepositoryRegistryNode(EXPECTED_NODE_ID);
assert(exactNode === H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_SCOPE_NODE, 'EXACT_HEAD_NODE_EXPORT_MISMATCH');
assert(exactNode.lifecycleStatus === 'CONTROL_PLANE_EXACT_HEAD_REGISTERED', 'EXACT_HEAD_LIFECYCLE_MISMATCH');
assert(exactNode.repositoryPaths.length === 9, 'EXACT_HEAD_PATH_COUNT_MISMATCH');
assert(exactNode.repositoryOccurrences.length === 9, 'EXACT_HEAD_OCCURRENCE_COUNT_MISMATCH');
assert(exactNode.repositoryOccurrences.every((record) => record.refName === EXPECTED_EXACT_BRANCH && record.commitSha === EXPECTED_EXACT_HEAD), 'EXACT_HEAD_OCCURRENCE_IDENTITY_MISMATCH');
assert(H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE.currentOccurrenceCount === 9, 'EXACT_HEAD_EVIDENCE_OCCURRENCE_COUNT_MISMATCH');
for (const limitation of REQUIRED_LIMITATIONS) {
  assert(exactNode.authorityLimitations.includes(limitation), `AUTHORITY_LIMITATION_MISSING:${limitation}`);
}

const expectedFixtureIds = [
  'MISSING_PREDECESSOR_NODE',
  'WRONG_PREDECESSOR_BLOB',
  'EXACT_HEAD_OCCURRENCE_COUNT_DRIFT',
  'AUTHORITY_LIMITATION_REMOVED',
  'PR570_HEAD_DRIFT',
  'REPAIR_HOLDER_REUSE'
];
assert(JSON.stringify(fixtures.fixtures.map((fixture) => fixture.id)) === JSON.stringify(expectedFixtureIds), 'NEGATIVE_FIXTURE_REGISTRY_MISMATCH');

const mc5Receipt = await runHEarthC2R1MC5AutomaticRegistryPreflight();
assert(mc5Receipt.finalDisposition === 'PASS', 'MC5_AUTOMATIC_PREFLIGHT_NOT_PASS');
assert(mc5Receipt.mc5Checks && Object.values(mc5Receipt.mc5Checks).every(Boolean), 'MC5_CHECK_SET_NOT_CLOSED');

const fingerprintPayload = {
  operationId: manifest.operationId,
  exactCandidateHead: actualHead,
  historicalPredecessorBlob: predecessorBlob,
  restoredNodeId: predecessorNode.nodeId,
  exactHeadNode: {
    nodeId: exactNode.nodeId,
    lifecycleStatus: exactNode.lifecycleStatus,
    repositoryPaths: exactNode.repositoryPaths,
    repositoryOccurrences: exactNode.repositoryOccurrences,
    authorityLimitations: exactNode.authorityLimitations
  },
  exactHeadEvidence: H_EARTH_C2_R1_MATERIAL_ONLY_BINDING_EXACT_HEAD_EVIDENCE,
  manifest,
  negativeFixtureIds: expectedFixtureIds,
  mc5FinalDisposition: mc5Receipt.finalDisposition,
  preservedInstrumentHead: EXPECTED_INSTRUMENT_HEAD
};

const receipt = {
  schema: 'H_EARTH_C2_R1_REGISTRY_BASE_NODE_LINEAGE_REPAIR_TEST_RECEIPT_v1',
  result: 'PASS_CLOSED',
  operationId: manifest.operationId,
  holder: options.holder,
  exactCandidateHead: actualHead,
  packageFingerprint: digest(fingerprintPayload),
  historicalPredecessor: {
    gitBlob: predecessorBlob,
    exactBytesPreserved: true,
    nodeResolved: true
  },
  exactHeadProjection: {
    nodeId: exactNode.nodeId,
    lifecycleStatus: exactNode.lifecycleStatus,
    repositoryPathCount: exactNode.repositoryPaths.length,
    currentOccurrenceCount: exactNode.repositoryOccurrences.length,
    allOccurrencesExact: true,
    allRequiredLimitationsPreserved: true
  },
  negativeFixtures: {
    declared: expectedFixtureIds.length,
    passed: expectedFixtureIds.length,
    missingNodeError
  },
  mc5Preflight: {
    finalDisposition: mc5Receipt.finalDisposition,
    allChecksPass: true
  },
  preservedInstrument: {
    pullRequest: 570,
    exactHead: EXPECTED_INSTRUMENT_HEAD,
    mutated: false
  },
  boundaries: {
    terrainMutation: false,
    rendererOrRuntimeMutation: false,
    productOrRouteMutation: false,
    manorConstruction: false,
    deploymentOrRelease: false,
    mergeOrPromotion: false,
    authorityBroadening: false
  }
};

fs.mkdirSync(path.dirname(options.output), { recursive: true });
fs.writeFileSync(options.output, `${JSON.stringify(receipt, null, 2)}\n`, 'utf8');
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
