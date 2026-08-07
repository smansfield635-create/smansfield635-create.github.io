#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

import {
  H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_NODE,
  H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE,
  H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS,
  verifyHEarthTerrainEstateConstructionV1AuthorizedCandidateScope
} from '../h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.terrain-estate-construction-v1-authorized-candidate-scope.js';
import {
  loadHEarthRepositoryRegistryValidatorDependencies
} from '../h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js';
import {
  runAutomaticHEarthPreflight
} from '../h-earth-3d/registry/activation/h-earth.repository-registry.auto-preflight.js';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const GOVERNING_HEAD = '2b4fae98b06a46370f2e3f1af94ace49905657a9';
const GOVERNING_TREE = '81c2d80b45e40da7e935d2c72f3a3b2804b99704';
const CONSTRUCTION_BRANCH = 'build/h-earth-terrain-estate-construction-v1-001';
const CONSTRUCTION_HEAD = '304f5df7d4fbe9aad2d6bdbd5c5cad7d0ff365e7';
const CONSTRUCTION_OPERATION = 'H_EARTH_TERRAIN_AND_ESTATE_CONSTRUCTION_v1';
const CONSTRUCTION_LOCK_GENERATION = 411;
const REGISTRY_OPERATION =
  'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_001';
const REGISTRY_LOCK_GENERATION = 413;
const LOCK_REF = 'operation-locks/repository-operation-intake-v1';
const NODE_ID =
  'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE';

const EXPECTED_PRESENT = Object.freeze({
  '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/terrain-estate-construction-v1/AGENTS.md':
    '1232fda311bd43a74b94a39eec84a0e08a245952',
  '/h-earth-3d/control-plane/map-wide-terrain-articulation-estate-reservation/terrain-estate-construction-v1/changed-path-manifest.v1.json':
    '8fcb067063cb63389d1450fc3689e9684430a4f7'
});

const EXACT_REPAIR_PATHS = Object.freeze([
  '.github/workflows/h-earth-terrain-estate-construction-registry-prerequisite.yml',
  'h-earth-3d/registry/accepted-amendments/h-earth.repository-registry.terrain-estate-construction-v1-authorized-candidate-scope.js',
  'h-earth-3d/registry/h-earth.repository-registry.validator-engine.loader.js',
  'tools/h-earth-terrain-estate-construction-registry-prerequisite.v1.mjs'
]);

const stable = (value) =>
  Array.isArray(value)
    ? value.map(stable)
    : value && typeof value === 'object'
      ? Object.fromEntries(
          Object.keys(value)
            .sort()
            .map((key) => [key, stable(value[key])])
        )
      : value;
const canonical = (value) => JSON.stringify(stable(value));
const sha256 = (value) =>
  crypto.createHash('sha256').update(value).digest('hex');
const fail = (code, detail = null) => {
  const error = new Error(detail == null ? code : `${code}:${canonical(detail)}`);
  error.code = code;
  error.detail = detail;
  throw error;
};

function parseArgs(argv) {
  const result = { verify: false, role: 'BUILDER', output: null };
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (token === '--verify') {
      result.verify = true;
      continue;
    }
    if (token === '--role' || token === '--output') {
      const value = argv[index + 1];
      if (value == null || value.startsWith('--')) fail('CLI_VALUE_MISSING', token);
      result[token.slice(2)] = value;
      index += 1;
      continue;
    }
    fail('CLI_ARGUMENT_UNKNOWN', token);
  }
  if (result.verify !== true) fail('VERIFY_FLAG_REQUIRED');
  if (!['BUILDER', 'ROLE_3'].includes(result.role)) fail('ROLE_INVALID', result.role);
  return result;
}

function git(args, { allowFailure = false } = {}) {
  const child = spawnSync('git', args, {
    cwd: path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..'),
    encoding: 'utf8',
    shell: false
  });
  if (!allowFailure && child.status !== 0) {
    fail('GIT_COMMAND_FAILED', {
      args,
      status: child.status,
      stdout: child.stdout,
      stderr: child.stderr
    });
  }
  return {
    status: child.status,
    stdout: String(child.stdout ?? '').trim(),
    stderr: String(child.stderr ?? '').trim()
  };
}

function sameSet(left, right) {
  return canonical([...new Set(left)].sort()) === canonical([...new Set(right)].sort());
}

function ensureFetched() {
  git([
    'fetch',
    '--no-tags',
    'origin',
    `refs/heads/${CONSTRUCTION_BRANCH}:refs/remotes/origin/${CONSTRUCTION_BRANCH}`
  ]);
  git([
    'fetch',
    '--no-tags',
    'origin',
    `refs/heads/${LOCK_REF}:refs/remotes/origin/${LOCK_REF}`
  ]);
}

function blobAt(commit, repositoryPath) {
  const normalized = repositoryPath.startsWith('/') ? repositoryPath.slice(1) : repositoryPath;
  const line = git(['ls-tree', commit, '--', normalized], { allowFailure: true }).stdout;
  if (!line) return null;
  const match = line.match(/^[0-9]{6}\s+blob\s+([0-9a-f]{40})\t/);
  return match?.[1] ?? null;
}

function flattenEntries(value, result = []) {
  if (Array.isArray(value)) {
    value.forEach((entry) => flattenEntries(entry, result));
    return result;
  }
  if (value && typeof value === 'object') {
    if (typeof value.operationId === 'string') result.push(value);
    Object.values(value).forEach((entry) => flattenEntries(entry, result));
  }
  return result;
}

function readLockLedger() {
  const text = git([
    'show',
    `refs/remotes/origin/${LOCK_REF}:.github/operation-intake/active-operation-ledger.v1.json`
  ]).stdout;
  return JSON.parse(text);
}

function exactLock(entries, operationId, lockGeneration) {
  return entries.find(
    (entry) =>
      entry.operationId === operationId &&
      Number(entry.lockGeneration) === lockGeneration
  );
}

function writeReceipt(outputPath, receipt) {
  const text = `${JSON.stringify(stable(receipt), null, 2)}\n`;
  if (outputPath) {
    fs.mkdirSync(path.dirname(path.resolve(outputPath)), { recursive: true });
    fs.writeFileSync(path.resolve(outputPath), text);
  }
  process.stdout.write(text);
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  ensureFetched();

  const currentHead = git(['rev-parse', 'HEAD']).stdout;
  const currentTree = git(['rev-parse', 'HEAD^{tree}']).stdout;
  const governingTree = git(['rev-parse', `${GOVERNING_HEAD}^{tree}`]).stdout;
  const ancestor = git(
    ['merge-base', '--is-ancestor', GOVERNING_HEAD, 'HEAD'],
    { allowFailure: true }
  ).status === 0;
  const changedPaths = git([
    'diff',
    '--name-only',
    GOVERNING_HEAD,
    'HEAD'
  ]).stdout.split('\n').filter(Boolean).sort();

  const occurrenceChecks =
    H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS.map(
      (repositoryPath) => {
        const actualBlob = blobAt(CONSTRUCTION_HEAD, repositoryPath);
        const expectedBlob = EXPECTED_PRESENT[repositoryPath] ?? null;
        const expectedExistence = expectedBlob == null ? 'ABSENT' : 'PRESENT';
        return stable({
          repositoryPath,
          expectedExistence,
          expectedBlob,
          actualBlob,
          pass:
            expectedExistence === 'PRESENT'
              ? actualBlob === expectedBlob
              : actualBlob === null
        });
      }
    );

  const amendmentVerification =
    verifyHEarthTerrainEstateConstructionV1AuthorizedCandidateScope();
  const dependencies = loadHEarthRepositoryRegistryValidatorDependencies();
  const preflight = runAutomaticHEarthPreflight({
    paths: [...H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS],
    taskText:
      'H-Earth terrain-and-estate construction V1 exact thirty-path registry prerequisite verification',
    mutationIntent: true
  });

  const ledger = readLockLedger();
  const activeEntries = flattenEntries(ledger.activeScopes ?? {});
  const constructionLock = exactLock(
    activeEntries,
    CONSTRUCTION_OPERATION,
    CONSTRUCTION_LOCK_GENERATION
  );
  const registryLock = exactLock(
    activeEntries,
    REGISTRY_OPERATION,
    REGISTRY_LOCK_GENERATION
  );

  const checks = stable({
    repositoryIdentity: REPOSITORY === 'smansfield635-create/smansfield635-create.github.io',
    currentHeadIsCommit: /^[0-9a-f]{40}$/.test(currentHead),
    currentTreeIsTree: /^[0-9a-f]{40}$/.test(currentTree),
    governingTreeExact: governingTree === GOVERNING_TREE,
    governingHeadAncestor: ancestor,
    exactFourPathDiff: sameSet(changedPaths, EXACT_REPAIR_PATHS),
    amendmentEligible: amendmentVerification.eligible === true,
    loaderIdentityVerified: dependencies.identityVerified === true,
    predecessorExactHeadVerified:
      dependencies.exactHeadRegistrationVerified === true,
    constructionScopeVerified:
      dependencies.constructionCandidateScopeVerified === true,
    nodeIdentity:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_NODE
        .nodeId === NODE_ID,
    evidenceConstructionLock:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE
        .constructionLockGeneration === CONSTRUCTION_LOCK_GENERATION,
    evidenceRegistryLock:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_EVIDENCE
        .registryPrerequisiteLockGeneration === REGISTRY_LOCK_GENERATION,
    exactThirtyPathSet:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS.length === 30,
    occurrenceTruth: occurrenceChecks.every((entry) => entry.pass),
    exactTwoPresent:
      occurrenceChecks.filter((entry) => entry.actualBlob !== null).length === 2,
    exactTwentyEightAbsent:
      occurrenceChecks.filter((entry) => entry.actualBlob === null).length === 28,
    allThirtyRegistered:
      preflight.pathClassification?.hEarthPaths?.length === 30 &&
      preflight.pathClassification.classifications.every(
        (entry) =>
          entry.registered === true &&
          entry.classification === 'REGISTERED_H_EARTH_PATH'
      ),
    registryPreflightDependenciesVerified: preflight.dependenciesVerified === true,
    registryValidatorPass:
      preflight.validatorReceipt?.finalDisposition === 'PASS',
    registryPreflightPass: preflight.finalDisposition === 'PASS',
    constructionLock411Active: constructionLock != null,
    registryLock413Active: registryLock != null,
    noConstructionPathsChanged:
      changedPaths.every((repositoryPath) => EXACT_REPAIR_PATHS.includes(repositoryPath)),
    noMainMutation: currentHead !== GOVERNING_HEAD,
    noMergeDeploymentReleaseAuthority:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_CANDIDATE_SCOPE_NODE
        .authorityLimitations.includes(
          'NO_MERGE_DEPLOYMENT_RELEASE_OR_PUBLICATION'
        )
  });

  const fingerprintDomain = stable({
    governingHead: GOVERNING_HEAD,
    governingTree: GOVERNING_TREE,
    candidateHead: currentHead,
    candidateTree: currentTree,
    exactRepairPaths: [...EXACT_REPAIR_PATHS].sort(),
    constructionBranch: CONSTRUCTION_BRANCH,
    constructionHead: CONSTRUCTION_HEAD,
    constructionLockGeneration: CONSTRUCTION_LOCK_GENERATION,
    registryLockGeneration: REGISTRY_LOCK_GENERATION,
    registryNodeId: NODE_ID,
    exactConstructionPaths:
      [...H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS].sort(),
    occurrenceTruth: occurrenceChecks,
    amendmentChecks: amendmentVerification.checks,
    loaderConstructionChecks: dependencies.constructionChecks,
    preflightDisposition: preflight.finalDisposition,
    preflightResolvedNodeIds:
      preflight.pathClassification.classifications.map((entry) => ({
        repositoryPath: entry.repositoryPath,
        resolvedNodeIds: entry.resolvedNodeIds
      }))
  });
  const verificationFingerprint = sha256(canonical(fingerprintDomain));
  const eligible = Object.values(checks).every(Boolean);

  const receipt = stable({
    schema:
      args.role === 'ROLE_3'
        ? 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_ROLE_3_RECEIPT_v1'
        : 'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_VERIFICATION_RECEIPT_v1',
    result: eligible ? 'PASS' : 'FAIL',
    role: args.role,
    operationId: REGISTRY_OPERATION,
    exactGoverningHead: GOVERNING_HEAD,
    exactGoverningTree: GOVERNING_TREE,
    candidateHead: currentHead,
    candidateTree: currentTree,
    constructionBranch: CONSTRUCTION_BRANCH,
    constructionHead: CONSTRUCTION_HEAD,
    constructionLockGeneration: CONSTRUCTION_LOCK_GENERATION,
    registryPrerequisiteLockGeneration: REGISTRY_LOCK_GENERATION,
    exactRepairPathCount: EXACT_REPAIR_PATHS.length,
    exactConstructionPathCount:
      H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_AUTHORIZED_PATHS.length,
    presentOccurrenceCount:
      occurrenceChecks.filter((entry) => entry.actualBlob !== null).length,
    absentOccurrenceCount:
      occurrenceChecks.filter((entry) => entry.actualBlob === null).length,
    checks,
    occurrenceChecks,
    verificationFingerprint,
    constructionMutationPerformed: false,
    productMutationPerformed: false,
    mainMutationPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false,
    nextAction: eligible
      ? 'FRESH_ROLE_3_OR_MERGE_AUTHORITY_GATE'
      : 'FAIL_CLOSED_NO_REPAIR'
  });

  writeReceipt(args.output, receipt);
  if (!eligible) process.exitCode = 1;
}

try {
  main();
} catch (error) {
  const failure = stable({
    schema:
      'H_EARTH_TERRAIN_ESTATE_CONSTRUCTION_V1_REGISTRY_PREREQUISITE_PROCESS_FAILURE_v1',
    result: 'FAIL',
    errorCode: error.code ?? 'UNEXPECTED_ERROR',
    detail: error.detail ?? error.message,
    constructionMutationPerformed: false,
    productMutationPerformed: false,
    mergePerformed: false,
    deploymentPerformed: false,
    releasePerformed: false
  });
  process.stderr.write(`${JSON.stringify(failure, null, 2)}\n`);
  process.exitCode = 1;
}
