#!/usr/bin/env node

import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const REPOSITORY = 'smansfield635-create/smansfield635-create.github.io';
const OPERATION_ID = 'CINEMATIC_PHYSICAL_SEAM_PROOF_ADMISSION_20260916_001';
const LOCK_GENERATION = 2307;
const LOCK_SCOPE = 'CINEMATIC:PHYSICAL_SEAM_PROOF:P01_P09:A75B4C70:V1';
const HARNESS_ID = 'CINEMATIC_CROSS_RUNTIME_PROOF_V1';
const RECEIPT_SCHEMA = 'CINEMATIC_CROSS_RUNTIME_PROOF_RECEIPT_v1';

export const FROZEN_SUBJECT = Object.freeze({
  schema: 'CINEMATIC_P01_P09_FROZEN_SUBJECT_V1',
  repository: REPOSITORY,
  operationId: OPERATION_ID,
  lockGeneration: LOCK_GENERATION,
  lockScope: LOCK_SCOPE,
  adoptedMain: 'a75b4c70c0d74612e2c28016631f46baa812b424',
  hEarth: Object.freeze({
    path: 'showroom/globe/h-earth/compositor.js',
    blob: 'ae69d5a26604a7bd12a685c283211afe61b46dbd',
    capability: 'BOUNDED_REALIZED_CAMERA_TARGET_Y'
  }),
  audralia: Object.freeze({
    path: 'showroom/globe/audralia/index.js',
    blob: 'f5b19493ff6ad55d196a1a4a27deefd4ff607bd1',
    capability: 'SET_CINEMATIC_VIEW_STATE_YAW_PITCH_DISTANCE'
  }),
  preproofManifestSha256: '23b23457aaa84ba6b314a0bdbfa564a64110765545f56556d846913746745c27',
  proofSet: 'P01-P09_FROZEN',
  denseCameraAuthority: false,
  fullRenderAuthority: false,
  deploymentAuthority: false,
  publicationAuthority: false
});

export const FROZEN_PROOFS = Object.freeze([
  Object.freeze({ id: 'P01', shot: 'SH01', label: 'LINE_01_FULL_PRESENCE', frame: 126, sample: 201600, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P02', shot: 'SH02', label: 'WASNT_TO_IS_EXACT_10S', frame: 300, sample: 480000, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P03', shot: 'SH03', label: 'LOW_ASCENT', frame: 482, sample: 771200, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P04', shot: 'SH03', label: 'MOUNTAIN_STATE', frame: 844, sample: 1350400, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P05', shot: 'SH03', label: 'SUMMIT_STATE', frame: 962, sample: 1539200, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P06', shot: 'SH04', label: 'H_EARTH_EXIT_CANDIDATE', frame: 1108, sample: 1772800, runtime: 'H_EARTH' }),
  Object.freeze({ id: 'P07', shot: 'SH04', label: 'AUDRALIA_ENTRY_CANDIDATE', frame: 1108, sample: 1772800, runtime: 'AUDRALIA' }),
  Object.freeze({ id: 'P08', shot: 'SH04', label: 'ESTABLISHED_AUDRALIA_SCALE', frame: 1140, sample: 1824000, runtime: 'AUDRALIA' }),
  Object.freeze({ id: 'P09', shot: 'SH05', label: 'TERMINAL_IDENTITY', frame: 1259, sample: 2014400, runtime: 'AUDRALIA' })
]);

export const SH04_CONTINUITY_CONTRACT = Object.freeze({
  schema: 'CINEMATIC_SH04_CONTINUITY_CONTRACT_V1',
  viewerLaw: 'SUMMIT -> RELEASE -> RECOGNITION',
  prohibitedInterpretation: 'H_EARTH_ENDS -> GLOBE_STARTS',
  preproofCorridor: Object.freeze({ firstFrame: 1104, lastFrame: 1112 }),
  exactHandoffFrameFrozen: false,
  pairedCandidateFrame: 1108,
  dimensions: Object.freeze([
    'SCREEN_SPACE_SUBJECT_POSITION',
    'HORIZON_RELATIONSHIP',
    'GOVERNING_MOVEMENT_DIRECTION',
    'PERCEIVED_SCALE_PROGRESSION',
    'LIGHT_DIRECTION_AND_TONAL_LINEAGE',
    'ATMOSPHERIC_DENSITY_PROGRESSION',
    'DOMINANT_GEOMETRY',
    'ENTRY_EXIT_MOTION_VELOCITY',
    'NEGATIVE_SPACE_STRUCTURE'
  ])
});

const EXPECTED_PROOF_IDS = Object.freeze(['P01', 'P02', 'P03', 'P04', 'P05', 'P06', 'P07', 'P08', 'P09']);
const EXPECTED_FRAMES = Object.freeze([126, 300, 482, 844, 962, 1108, 1108, 1140, 1259]);
const EXPECTED_SAMPLES = Object.freeze([201600, 480000, 771200, 1350400, 1539200, 1772800, 1772800, 1824000, 2014400]);
const EXPECTED_RUNTIMES = Object.freeze(['H_EARTH', 'H_EARTH', 'H_EARTH', 'H_EARTH', 'H_EARTH', 'H_EARTH', 'AUDRALIA', 'AUDRALIA', 'AUDRALIA']);
const ALLOWED_CLI = Object.freeze(['--self-test']);

function fail(code, message, detail = null) {
  const error = new Error(message);
  error.code = code;
  error.detail = detail;
  throw error;
}

function assert(condition, code, message, detail = null) {
  if (!condition) fail(code, message, detail);
}

function runGit(repoRoot, args) {
  const result = spawnSync('git', args, {
    cwd: repoRoot,
    encoding: 'utf8',
    stdio: ['ignore', 'pipe', 'pipe']
  });
  if (result.status !== 0) {
    fail('SUBJECT_IDENTITY_MISMATCH', `git ${args.join(' ')} failed`, {
      status: result.status,
      stderr: String(result.stderr || '').trim()
    });
  }
  return String(result.stdout || '').trim();
}

function findRepositoryRoot() {
  const here = path.dirname(fileURLToPath(import.meta.url));
  return runGit(here, ['rev-parse', '--show-toplevel']);
}

function assertHex(value, length, field) {
  assert(typeof value === 'string' && new RegExp(`^[0-9a-f]{${length}}$`).test(value), 'HARNESS_SELF_TEST_FAILURE', `${field} is not a ${length}-character lowercase hex identity`);
}

function assertFixedProofTopology() {
  assert(FROZEN_PROOFS.length === 9, 'HARNESS_SELF_TEST_FAILURE', 'proof count must be exactly nine');
  assert(JSON.stringify(FROZEN_PROOFS.map(p => p.id)) === JSON.stringify(EXPECTED_PROOF_IDS), 'HARNESS_SELF_TEST_FAILURE', 'proof ids moved');
  assert(JSON.stringify(FROZEN_PROOFS.map(p => p.frame)) === JSON.stringify(EXPECTED_FRAMES), 'HARNESS_SELF_TEST_FAILURE', 'proof frames moved');
  assert(JSON.stringify(FROZEN_PROOFS.map(p => p.sample)) === JSON.stringify(EXPECTED_SAMPLES), 'HARNESS_SELF_TEST_FAILURE', 'proof samples moved');
  assert(JSON.stringify(FROZEN_PROOFS.map(p => p.runtime)) === JSON.stringify(EXPECTED_RUNTIMES), 'HARNESS_SELF_TEST_FAILURE', 'proof runtime ownership moved');

  const p06 = FROZEN_PROOFS[5];
  const p07 = FROZEN_PROOFS[6];
  assert(p06.frame === 1108 && p07.frame === 1108, 'HARNESS_SELF_TEST_FAILURE', 'P06/P07 paired seam frame moved');
  assert(p06.sample === 1772800 && p07.sample === 1772800, 'HARNESS_SELF_TEST_FAILURE', 'P06/P07 paired seam sample moved');
  assert(p06.runtime === 'H_EARTH' && p07.runtime === 'AUDRALIA', 'HARNESS_SELF_TEST_FAILURE', 'P06/P07 runtime pairing moved');

  assert(SH04_CONTINUITY_CONTRACT.preproofCorridor.firstFrame === 1104, 'HARNESS_SELF_TEST_FAILURE', 'SH04 corridor start moved');
  assert(SH04_CONTINUITY_CONTRACT.preproofCorridor.lastFrame === 1112, 'HARNESS_SELF_TEST_FAILURE', 'SH04 corridor end moved');
  assert(SH04_CONTINUITY_CONTRACT.exactHandoffFrameFrozen === false, 'HARNESS_SELF_TEST_FAILURE', 'harness may not pre-freeze the final SH04 handoff frame');
  assert(SH04_CONTINUITY_CONTRACT.dimensions.length === 9, 'HARNESS_SELF_TEST_FAILURE', 'SH04 continuity contract must retain nine dimensions');
}

function assertFixedAuthorityBoundary() {
  assert(FROZEN_SUBJECT.proofSet === 'P01-P09_FROZEN', 'HARNESS_SELF_TEST_FAILURE', 'proof set identity moved');
  assert(FROZEN_SUBJECT.denseCameraAuthority === false, 'HARNESS_SELF_TEST_FAILURE', 'dense camera authority is prohibited');
  assert(FROZEN_SUBJECT.fullRenderAuthority === false, 'HARNESS_SELF_TEST_FAILURE', 'full render authority is prohibited');
  assert(FROZEN_SUBJECT.deploymentAuthority === false, 'HARNESS_SELF_TEST_FAILURE', 'deployment authority is prohibited');
  assert(FROZEN_SUBJECT.publicationAuthority === false, 'HARNESS_SELF_TEST_FAILURE', 'publication authority is prohibited');
  assertHex(FROZEN_SUBJECT.adoptedMain, 40, 'adoptedMain');
  assertHex(FROZEN_SUBJECT.hEarth.blob, 40, 'hEarth.blob');
  assertHex(FROZEN_SUBJECT.audralia.blob, 40, 'audralia.blob');
  assertHex(FROZEN_SUBJECT.preproofManifestSha256, 64, 'preproofManifestSha256');
}

export function verifyFrozenSubjectIdentity(repoRoot = findRepositoryRoot()) {
  assertFixedAuthorityBoundary();
  assertFixedProofTopology();

  const adopted = runGit(repoRoot, ['rev-parse', `${FROZEN_SUBJECT.adoptedMain}^{commit}`]);
  assert(adopted === FROZEN_SUBJECT.adoptedMain, 'GOVERNING_HEAD_MISMATCH', 'adopted main identity moved', { expected: FROZEN_SUBJECT.adoptedMain, actual: adopted });

  for (const runtime of [FROZEN_SUBJECT.hEarth, FROZEN_SUBJECT.audralia]) {
    const blob = runGit(repoRoot, ['rev-parse', `${FROZEN_SUBJECT.adoptedMain}:${runtime.path}`]);
    assert(blob === runtime.blob, 'SUBJECT_IDENTITY_MISMATCH', `${runtime.path} blob moved`, { expected: runtime.blob, actual: blob });
  }

  return Object.freeze({
    adoptedMain: adopted,
    hEarthBlob: FROZEN_SUBJECT.hEarth.blob,
    audraliaBlob: FROZEN_SUBJECT.audralia.blob,
    preproofManifestSha256: FROZEN_SUBJECT.preproofManifestSha256,
    proofSet: FROZEN_SUBJECT.proofSet
  });
}

export function buildFixedProofPlan() {
  assertFixedAuthorityBoundary();
  assertFixedProofTopology();
  return Object.freeze({
    schema: 'CINEMATIC_P01_P09_FIXED_PROOF_PLAN_V1',
    harnessId: HARNESS_ID,
    subject: FROZEN_SUBJECT,
    proofs: FROZEN_PROOFS,
    continuityContract: SH04_CONTINUITY_CONTRACT
  });
}

export function sha256File(filePath) {
  const bytes = readFileSync(filePath);
  return createHash('sha256').update(bytes).digest('hex');
}

export function buildPhysicalProofReceipt({ proofId, imagePath, observedRuntime }) {
  const proof = FROZEN_PROOFS.find(item => item.id === proofId);
  assert(Boolean(proof), 'PROOF_EXECUTION_FAILURE', 'receipt proof id is outside frozen P01-P09');
  assert(observedRuntime === proof.runtime, 'PROOF_EXECUTION_FAILURE', 'receipt runtime does not match frozen proof ownership', { proofId, expected: proof.runtime, actual: observedRuntime });
  const imageSha256 = sha256File(imagePath);
  assertHex(imageSha256, 64, 'imageSha256');

  return Object.freeze({
    schema: RECEIPT_SCHEMA,
    harnessId: HARNESS_ID,
    operationId: OPERATION_ID,
    lockGeneration: LOCK_GENERATION,
    subject: Object.freeze({
      adoptedMain: FROZEN_SUBJECT.adoptedMain,
      hEarthBlob: FROZEN_SUBJECT.hEarth.blob,
      audraliaBlob: FROZEN_SUBJECT.audralia.blob,
      preproofManifestSha256: FROZEN_SUBJECT.preproofManifestSha256
    }),
    proof: Object.freeze({
      id: proof.id,
      shot: proof.shot,
      label: proof.label,
      frame: proof.frame,
      sample: proof.sample,
      runtime: proof.runtime
    }),
    imageSha256,
    denseCameraAuthority: false,
    fullRenderAuthority: false,
    deploymentAuthority: false,
    publicationAuthority: false
  });
}

function selfTest() {
  assertFixedAuthorityBoundary();
  assertFixedProofTopology();
  assert(ALLOWED_CLI.length === 1 && ALLOWED_CLI[0] === '--self-test', 'HARNESS_SELF_TEST_FAILURE', 'CLI surface expanded');

  return Object.freeze({
    schema: 'CINEMATIC_CROSS_RUNTIME_PROOF_HARNESS_SELF_TEST_RECEIPT_v1',
    harnessId: HARNESS_ID,
    operationId: OPERATION_ID,
    lockGeneration: LOCK_GENERATION,
    result: 'PASS_CLOSED',
    proofSet: FROZEN_SUBJECT.proofSet,
    proofCount: FROZEN_PROOFS.length,
    pairedSeamFrame: 1108,
    continuityDimensionCount: SH04_CONTINUITY_CONTRACT.dimensions.length,
    adoptedMain: FROZEN_SUBJECT.adoptedMain,
    hEarthBlob: FROZEN_SUBJECT.hEarth.blob,
    audraliaBlob: FROZEN_SUBJECT.audralia.blob,
    preproofManifestSha256: FROZEN_SUBJECT.preproofManifestSha256,
    arbitraryCommandSurface: false,
    denseCameraAuthority: false,
    fullRenderAuthority: false,
    deploymentAuthority: false,
    publicationAuthority: false
  });
}

function main(argv) {
  if (argv.length !== 1 || argv[0] !== '--self-test') {
    fail('DECLARED_PATH_VIOLATION', 'This fixed harness exposes only the exact --self-test CLI. Physical P01-P09 execution must occur through the adopted ACTIVE_CERTIFIED descriptor and existing AI-room execution transport; no arbitrary command or argument surface is permitted.', { receivedArgCount: argv.length });
  }
  process.stdout.write(`${JSON.stringify(selfTest())}\n`);
}

const invokedDirectly = process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (invokedDirectly) {
  try {
    main(process.argv.slice(2));
  } catch (error) {
    process.stderr.write(`${JSON.stringify({
      schema: 'CINEMATIC_CROSS_RUNTIME_PROOF_HARNESS_ERROR_v1',
      harnessId: HARNESS_ID,
      operationId: OPERATION_ID,
      result: 'FAIL_CLOSED',
      errorCode: error?.code || 'HARNESS_SELF_TEST_FAILURE',
      message: error?.message || String(error),
      detail: error?.detail || null
    })}\n`);
    process.exitCode = 1;
  }
}
