import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const readText = (relativePath) => fs.readFileSync(path.join(root, relativePath), 'utf8');
const readJson = (relativePath) => JSON.parse(readText(relativePath));
const exists = (relativePath) => fs.existsSync(path.join(root, relativePath));
const hashObject = (relativePath) => execFileSync('git', ['hash-object', relativePath], {
  cwd: root,
  encoding: 'utf8'
}).trim();
const gitText = (...args) => execFileSync('git', args, { cwd: root, encoding: 'utf8' }).trim();
const gitSucceeds = (...args) => spawnSync('git', args, { cwd: root, encoding: 'utf8' }).status === 0;

const EXPECTED_MAIN = '465596de77ef0a28a7f779e06851130f4768e445';
const ACCEPTED_PACKAGE_HEAD = '9f155e183fa0ae63cb9277422ae069b6b8dc4c17';
const ACCEPTED_BOOTSTRAP_BLOB = 'e422e814a29e024df91e8410687ab29ffe63c382';
const ACCEPTANCE_DECLARATION_BLOB = 'b49e328d6a7a18b267800db234cab12f2a7dd61b';
const ACCEPTANCE_CUSTODY_BLOB = '78139d26c6f2e9a2b725f77ae7885c273fd97506';
const COMPLETION_RECEIPT_BLOB = '22a997a1082ecc4b7c9c9b35d1675516c68e4efc';
const PERMANENT_PREFLIGHT_WORKFLOW_BLOB = 'b230e688c2778f6b5acf5567d1cf32ac2450de25';
const SUCCESSOR_CANDIDATE_BLOB = '8cf7a1cce76c4381f9c5f017cc3a132d8ecea308';
const SUCCESSOR_IDENTITY_BLOB = 'a5d6ae2f64c7f8ac868aef70aa895bf9979be202';
const SUCCESSOR_DIGEST = 'a168f5a814f23f508d1c019867b707b30ec2ea8f1e0ae3125be6594e701f07e8';

const bootstrapPath = 'h-earth-3d/registry/h-earth.repository-registry.bootstrap.json';
const declarationPath = 'h-earth-3d/registry/finalization/h-earth.repository-registry.user-acceptance-declaration.json';
const custodyPath = 'h-earth-3d/registry/h-earth.repository-registry.user-acceptance-custody-receipt.json';
const completionPath = 'h-earth-3d/registry/h-earth.repository-registry.target-4f-completion-receipt.json';
const permanentWorkflowPath = '.github/workflows/h-earth-repository-registry-preflight.yml';
const successorCandidatePath = 'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.candidate.js';
const successorIdentityPath = 'h-earth-3d/registry/candidates/h-earth.repository-registry.successor.identity.json';

const bootstrap = readJson(bootstrapPath);
const declaration = readJson(declarationPath);
const custody = readJson(custodyPath);
const completion = readJson(completionPath);
const successorIdentity = readJson(successorIdentityPath);

const correctedImplementationPaths = [
  'showroom/globe/h-earth/environment.js',
  'showroom/globe/h-earth/render/ground-view-gate-b.js',
  'h-earth-3d/integration/h-earth.ground-view-gate-b-west-admission-adapter.js',
  'showroom/globe/h-earth/render/geometry-kernel.js',
  'h-earth-3d/integration/h-earth.post-west-admitted-geometry-transfer.js',
  'showroom/globe/h-earth/compositor.js',
  'showroom/globe/h-earth/admitted-geometry-frame.js',
  'showroom/globe/h-earth/index.html'
];
const rolledBackPaths = [
  'showroom/globe/h-earth/gate-b-route-input.js',
  'showroom/globe/h-earth/render/ground-view-gate-b-packet-002-adapter.js',
  'showroom/globe/h-earth/render/tests/ground-view-gate-b.contract.js'
];

const originMain = gitText('rev-parse', 'origin/main');
const changedPaths = gitText('diff', '--name-only', 'origin/main...HEAD').split('\n').filter(Boolean);
const changedPathSet = new Set(changedPaths);
const implementationChanges = correctedImplementationPaths.filter((entry) => changedPathSet.has(entry));
const rolledBackPresentOnMain = rolledBackPaths.filter((entry) => gitSucceeds('cat-file', '-e', `origin/main:${entry}`));

const checks = [];
const failures = [];
const check = (name, condition, details = null) => {
  const pass = Boolean(condition);
  checks.push({ name, pass, details });
  if (!pass) failures.push(name);
};

check('ORIGIN_MAIN_EXACT_MERGE_COMMIT', originMain === EXPECTED_MAIN, { observed: originMain, expected: EXPECTED_MAIN });
check('ACCEPTED_PACKAGE_HEAD_IS_ANCESTOR_OF_MAIN', gitSucceeds('merge-base', '--is-ancestor', ACCEPTED_PACKAGE_HEAD, 'origin/main'));
check('ACCEPTED_BOOTSTRAP_BLOB_EXACT', hashObject(bootstrapPath) === ACCEPTED_BOOTSTRAP_BLOB);
check('ACCEPTED_BOOTSTRAP_STATUS_EXACT', bootstrap.status === 'COMPLETE_VERIFIED_ACCEPTED_NONCANONICAL' && bootstrap.accepted === true && bootstrap.canonical === false);
check('ACCEPTED_BOOTSTRAP_REMAINS_READ_ONLY_NONCONTROLLING', bootstrap.controlsRepositoryScope === false && bootstrap.toolUseMode === 'AUTOMATIC_H_EARTH_SCOPED_READ_ONLY_FOR_COMPATIBLE_REPOSITORY_ENTRYPOINTS');
check('ACCEPTED_BOOTSTRAP_STILL_REFERENCES_V1_CANDIDATE', bootstrap.candidate?.path === '/h-earth-3d/registry/h-earth.repository-registry.candidate.js' && bootstrap.candidate?.gitBlobSha === '10ab7b203e03fde419e526d0cce2c0af42860911');
check('ACCEPTANCE_DECLARATION_BLOB_EXACT', hashObject(declarationPath) === ACCEPTANCE_DECLARATION_BLOB);
check('ACCEPTANCE_DECLARATION_EXACT', declaration.accepted === true && declaration.canonical === false && declaration.acceptanceStatement === 'I accept.' && declaration.acceptedPackage?.completionReceiptGitBlobSha === COMPLETION_RECEIPT_BLOB);
check('ACCEPTANCE_CUSTODY_BLOB_EXACT', hashObject(custodyPath) === ACCEPTANCE_CUSTODY_BLOB);
check('ACCEPTANCE_CUSTODY_PASS', custody.result === 'PASS' && custody.status === 'COMPLETE_VERIFIED_ACCEPTED_NONCANONICAL' && custody.acceptance?.accepted === true && custody.acceptance?.canonical === false);
check('COMPLETION_RECEIPT_BLOB_EXACT', hashObject(completionPath) === COMPLETION_RECEIPT_BLOB);
check('COMPLETION_RECEIPT_PASS_53_OF_53', completion.result === 'PASS' && completion.finalAudit?.result === 'PASS' && completion.finalAudit?.passedChecks === 53 && completion.finalAudit?.failedChecks === 0 && completion.targetStatus?.candidatePackageComplete === true);
check('PERMANENT_PREFLIGHT_WORKFLOW_EXACT', exists(permanentWorkflowPath) && hashObject(permanentWorkflowPath) === PERMANENT_PREFLIGHT_WORKFLOW_BLOB);
check('SUCCESSOR_CANDIDATE_BLOB_EXACT', hashObject(successorCandidatePath) === SUCCESSOR_CANDIDATE_BLOB);
check('SUCCESSOR_IDENTITY_BLOB_EXACT', hashObject(successorIdentityPath) === SUCCESSOR_IDENTITY_BLOB);
check('SUCCESSOR_IDENTITY_EXACT', successorIdentity.successorId === 'H_EARTH_REPOSITORY_REGISTRY_SUCCESSOR_CANDIDATE_v2' && successorIdentity.registryVersion === '1.0.0-candidate.2' && successorIdentity.contentDigest === SUCCESSOR_DIGEST);
check('SUCCESSOR_REMAINS_UNACCEPTED_NONCANONICAL_INACTIVE', successorIdentity.status === 'COMPLETE_CANDIDATE_NOT_ACCEPTED_NOT_CANONICAL_NOT_ACTIVE' && successorIdentity.acceptedBootstrapChanged === false && successorIdentity.activeRegistryChanged === false && successorIdentity.canonical === false);
check('SUCCESSOR_NOT_REFERENCED_BY_ACCEPTED_BOOTSTRAP', bootstrap.candidate?.path !== `/${successorCandidatePath}` && bootstrap.candidate?.registryVersion !== successorIdentity.registryVersion);
check('CORRECTED_IMPLEMENTATION_PATHS_UNCHANGED', implementationChanges.length === 0, implementationChanges);
check('ROLLED_BACK_PATHS_ABSENT_ON_MAIN', rolledBackPresentOnMain.length === 0, rolledBackPresentOnMain);
check('NO_SOURCE_OR_RUNTIME_AUTHORITY_CREATED', declaration.boundaries?.sourceAuthorityCreated === false && declaration.boundaries?.runtimeAuthorityCreated === false && declaration.boundaries?.rendererAuthorityCreated === false && declaration.boundaries?.deploymentAuthorityCreated === false && declaration.boundaries?.productionAuthorityCreated === false);
check('SUCCESSOR_SOURCE_SHA256_STABLE', crypto.createHash('sha256').update(readText(successorCandidatePath)).digest('hex') === 'b47666074b5489e4f314f7e77a4c59c1a4f70b86569e4ef368a81d5cddcd32e3');

const receipt = {
  receiptId: 'H_EARTH_REPOSITORY_REGISTRY_ACCEPTED_MAIN_AND_SUCCESSOR_V2_AUDIT_RECEIPT_v1',
  result: failures.length === 0 ? 'PASS' : 'FAIL',
  executedCommit: process.env.GITHUB_SHA ?? 'LOCAL_UNSPECIFIED',
  originMain,
  acceptedPackageHead: ACCEPTED_PACKAGE_HEAD,
  successorId: successorIdentity.successorId,
  successorDigest: successorIdentity.contentDigest,
  totalChecks: checks.length,
  passedChecks: checks.filter((entry) => entry.pass).length,
  failedChecks: failures.length,
  failures,
  checks,
  changedPaths,
  boundaries: {
    acceptedBootstrapChanged: false,
    successorActivated: false,
    canonicalizationCreated: false,
    implementationSourceChanged: implementationChanges.length > 0,
    mergeAuthorityCreated: false,
    mainChanged: false
  }
};

fs.mkdirSync(path.join(root, 'artifacts'), { recursive: true });
fs.writeFileSync(
  path.join(root, 'artifacts/h-earth.repository-registry.accepted-main-and-successor-v2-audit-receipt.json'),
  `${JSON.stringify(receipt, null, 2)}\n`
);
process.stdout.write(`${JSON.stringify(receipt, null, 2)}\n`);
if (failures.length) process.exitCode = 1;
