#!/usr/bin/env node
import cp from 'node:child_process';
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';

const BASE_HEAD = 'ac9a12293885121ed97602b6a08a91a5561abf84';
const AMENDMENT_PATH = 'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.audralia-diagnostic-path-recognition.js';
const LOADER_PATH = 'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';
const WORKFLOW_PATH = '.github/workflows/h-earth-repository-registry-preflight.yml';
const VERIFIER_PATH = 'h-earth-3d/validation/h-earth-audralia-diagnostic-path-recognition-verifier.v1.mjs';
const ALLOWED_PATHS = Object.freeze([
  AMENDMENT_PATH,
  LOADER_PATH,
  WORKFLOW_PATH,
  VERIFIER_PATH
].sort());
const DIAGNOSTIC_BLOBS = Object.freeze({
  'showroom/globe/audralia/diagnostic/index.html': '398bd1b438a72431446a9fc221e32d5a2d1b7f3e',
  'showroom/globe/audralia/diagnostic/index.controls.js': '4ea62b0c1291b997ab9b497f3e2e745ddd9d9808',
  'showroom/globe/audralia/diagnostic/index.inspection.lane.js': '206602dde5f48bcbddf29c40104babb8d0f52107'
});
const COMMENT_MARKER = 'H_EARTH_AUDRALIA_DIAGNOSTIC_PREMUTATION_PREFLIGHT_V1';

function parseArgs(argv) {
  const args = {verify: false, role: null, output: null};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--verify') args.verify = true;
    else if (token === '--role') args.role = argv[++index] ?? null;
    else if (token === '--output') args.output = argv[++index] ?? null;
    else throw new Error(`UNKNOWN_ARGUMENT:${token}`);
  }
  return args;
}

function requireCondition(value, code) {
  if (!value) throw new Error(code);
}

function git(args, options = {}) {
  return cp.execFileSync('git', args, {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe'],
    ...options
  }).trim();
}

function sha256Text(value) {
  return crypto.createHash('sha256').update(value).digest('hex');
}

function stableStringify(value) {
  if (value === null || typeof value !== 'object') return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(',')}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
}

function read(pathname) {
  return fs.readFileSync(pathname, 'utf8');
}

function countToken(haystack, needle) {
  return haystack.split(needle).length - 1;
}

function inspectRegistry() {
  const script = `
    import path from 'node:path';
    import { pathToFileURL } from 'node:url';
    const amendment = await import(pathToFileURL(path.resolve(${JSON.stringify(AMENDMENT_PATH)})).href);
    const loader = await import(pathToFileURL(path.resolve(${JSON.stringify(LOADER_PATH)})).href);
    const amendmentVerification = amendment.verifyHEarthAudraliaDiagnosticPathRecognition();
    const dependencies = loader.loadHEarthRepositoryRegistryValidatorDependencies();
    process.stdout.write(JSON.stringify({
      amendmentVerification,
      loaderId: dependencies.loaderId,
      identityVerified: dependencies.identityVerified,
      inheritedIdentityPreserved: dependencies.inheritedIdentityPreserved,
      successorIntegrityVerified: dependencies.successorIntegrityVerified,
      diagnosticLoaded: dependencies.stoppingCondition?.audraliaDiagnosticPathRecognitionLoaded,
      diagnosticVerification: dependencies.audraliaDiagnosticPathRecognitionVerification,
      registryId: dependencies.registryInstance?.registryId,
      registryVersion: dependencies.registryInstance?.registryVersion,
      schemaId: dependencies.registryInstance?.schemaId,
      schemaVersion: dependencies.registryInstance?.schemaVersion,
      boundary: dependencies.boundary
    }));
  `;
  const stdout = cp.execFileSync(process.execPath, [
    '--experimental-default-type=module',
    '--input-type=module',
    '--eval',
    script
  ], {
    cwd: process.cwd(),
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  return JSON.parse(stdout);
}

function writeReceipt(output, receipt) {
  if (!output) return;
  fs.mkdirSync(path.dirname(output), {recursive: true});
  fs.writeFileSync(output, `${JSON.stringify(receipt, null, 2)}\n`);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  requireCondition(args.verify === true, 'VERIFY_FLAG_REQUIRED');
  requireCondition(args.role === 'BUILDER' || args.role === 'ROLE_3', 'ROLE_MUST_BE_BUILDER_OR_ROLE_3');
  requireCondition(typeof args.output === 'string' && args.output.length > 0, 'OUTPUT_REQUIRED');

  const candidateHead = git(['rev-parse', 'HEAD']);
  git(['merge-base', '--is-ancestor', BASE_HEAD, candidateHead]);

  const changedPaths = git(['diff', '--name-only', `${BASE_HEAD}..${candidateHead}`])
    .split('\n')
    .map((entry) => entry.trim())
    .filter(Boolean)
    .sort();
  requireCondition(
    stableStringify(changedPaths) === stableStringify(ALLOWED_PATHS),
    `EXACT_FOUR_PATH_DIFF_MISMATCH:${JSON.stringify(changedPaths)}`
  );

  const diagnosticBlobIdentity = {};
  for (const [diagnosticPath, expectedBlob] of Object.entries(DIAGNOSTIC_BLOBS)) {
    const baseBlob = git(['rev-parse', `${BASE_HEAD}:${diagnosticPath}`]);
    const candidateBlob = git(['rev-parse', `${candidateHead}:${diagnosticPath}`]);
    requireCondition(baseBlob === expectedBlob, `BASE_DIAGNOSTIC_BLOB_MISMATCH:${diagnosticPath}`);
    requireCondition(candidateBlob === expectedBlob, `DIAGNOSTIC_BYTE_CHANGED:${diagnosticPath}`);
    diagnosticBlobIdentity[diagnosticPath] = candidateBlob;
  }

  const registry = inspectRegistry();
  requireCondition(registry.amendmentVerification?.eligible === true, 'EXACT_PATH_REGISTRATION_FAILURE');
  requireCondition(registry.amendmentVerification?.checks?.exactTargetPathCount === true, 'DIAGNOSTIC_PATH_COUNT_MISMATCH');
  requireCondition(registry.amendmentVerification?.checks?.allTargetPathsResolve === true, 'DIAGNOSTIC_PATH_UNRESOLVED');
  requireCondition(registry.amendmentVerification?.checks?.governingOccurrencesPresent === true, 'DIAGNOSTIC_OCCURRENCE_IDENTITY_FAILURE');
  requireCondition(registry.amendmentVerification?.checks?.noPrefixRegistration === true, 'PREFIX_WIDE_AUTHORITY_LEAK');
  requireCondition(registry.amendmentVerification?.checks?.auditOnly === true, 'REGISTRATION_NOT_AUDIT_ONLY');
  requireCondition(registry.amendmentVerification?.checks?.noDiagnosticByteAuthority === true, 'DIAGNOSTIC_MUTATION_AUTHORITY_LEAK');
  requireCondition(registry.inheritedIdentityPreserved === true, 'LOADER_IDENTITY_REGRESSION');
  requireCondition(registry.successorIntegrityVerified === true, 'LOADER_SUCCESSOR_INTEGRITY_FAILURE');
  requireCondition(registry.diagnosticLoaded === true, 'DIAGNOSTIC_RECOGNITION_NOT_LOADED');
  requireCondition(registry.diagnosticVerification?.eligible === true, 'LOADER_DIAGNOSTIC_VERIFICATION_FAILURE');

  const workflow = read(WORKFLOW_PATH);
  for (const diagnosticPath of Object.keys(DIAGNOSTIC_BLOBS)) {
    requireCondition(countToken(workflow, `'${diagnosticPath}'`) >= 2, `AUTOMATIC_TRIGGER_MISSING:${diagnosticPath}`);
  }
  for (const token of [
    'issue_comment:',
    COMMENT_MARKER,
    VERIFIER_PATH,
    'audralia-diagnostic-governance-builder',
    'audralia-diagnostic-governance-fresh-verifier',
    'audralia-diagnostic-governance-fingerprint-match',
    'contents: read'
  ]) requireCondition(workflow.includes(token), `WORKFLOW_CONTRACT_TOKEN_MISSING:${token}`);
  for (const forbidden of ['contents: write', 'issues: write', 'pull-requests: write', 'actions: write']) {
    requireCondition(!workflow.includes(forbidden), `WORKFLOW_WRITE_AUTHORITY_FORBIDDEN:${forbidden}`);
  }

  const fileDigests = Object.fromEntries(ALLOWED_PATHS.map((pathname) => [pathname, sha256Text(read(pathname))]));
  const fingerprintDomain = {
    schema: 'H_EARTH_AUDRALIA_DIAGNOSTIC_GOVERNANCE_FINGERPRINT_DOMAIN_v2',
    baseHead: BASE_HEAD,
    candidateHead,
    exactChangedPaths: changedPaths,
    diagnosticBlobIdentity,
    registry: {
      registryId: registry.registryId,
      registryVersion: registry.registryVersion,
      schemaId: registry.schemaId,
      schemaVersion: registry.schemaVersion,
      amendmentStatus: registry.amendmentVerification.status,
      loaderId: registry.loaderId
    },
    fileDigests,
    authorityEffect: 'NONE'
  };
  const fingerprint = sha256Text(stableStringify(fingerprintDomain));
  const checks = {
    exactFourPathDiff: true,
    diagnosticBytesUnchanged: true,
    exactThreePathsRegistered: true,
    noPrefixWideRegistration: true,
    loaderIdentityPreserved: true,
    automaticPullRequestAndPushTriggersPresent: true,
    fixedReadOnlyPremutationIssueCommentPreflightPresent: true,
    operationSpecificVerifierPresent: true,
    noWriteMergeDeploymentReleaseAuthority: true
  };
  const receipt = {
    schema: 'H_EARTH_AUDRALIA_DIAGNOSTIC_GOVERNANCE_VERIFICATION_RECEIPT_v2',
    result: 'PASS',
    role: args.role,
    baseHead: BASE_HEAD,
    candidateHead,
    exactChangedPaths: changedPaths,
    diagnosticBlobIdentity,
    checks,
    fingerprintDomain,
    fingerprint
  };
  writeReceipt(args.output, receipt);
  process.stdout.write(`${JSON.stringify(receipt)}\n`);
}

try {
  main();
} catch (error) {
  const args = (() => {
    try { return parseArgs(process.argv.slice(2)); } catch { return {role: null, output: null}; }
  })();
  const receipt = {
    schema: 'H_EARTH_AUDRALIA_DIAGNOSTIC_GOVERNANCE_VERIFICATION_RECEIPT_v2',
    result: 'FAIL',
    role: args.role,
    error: String(error?.message || error)
  };
  try { writeReceipt(args.output, receipt); } catch {}
  console.error(error?.stack || error);
  process.exit(1);
}
