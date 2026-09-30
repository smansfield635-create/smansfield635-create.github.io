#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { createHash } from 'node:crypto';
import { spawnSync } from 'node:child_process';

const GATE_ID = 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_GATE_v1';
const ASSERTION_SET_ID = 'H_EARTH_R06_C10_GEOMETRY_ARTICULATION_ASSERTIONS_28_v1';
const EXPECTED_ASSERTION_COUNT = 28;
const MANIFEST_PATH = 'h-earth-3d/control-plane/r06-c10/candidate-admission/h-earth.r06-c10.current-candidate-admission.manifest.v1.json';
const ADAPTER_PATH = 'h-earth-3d/validation/h-earth.r06-c10.candidate-admission.adapter.v1.mjs';
const SELF_PATH = 'h-earth-3d/validation/h-earth.r06-c10.exact-candidate-admission-gate.v1.mjs';
const LOCATOR_PATH = 'h-earth-3d/control-plane/r06-c10/tool-base/h-earth.r06-c10.successor-room-candidate-admission.locator.v1.json';
const CONTRACT_PATH = 'h-earth-3d/control-plane/r06-c10/governance/h-earth.r06-c10.inter-role-candidate-admission-gate.v1.json';
const SCHEMA_PATH = 'h-earth-3d/control-plane/r06-c10/schemas/h-earth.r06-c10.exact-candidate-admission.receipt.schema.v1.json';
const AUTHORITY_PATHS = [SELF_PATH, ADAPTER_PATH, LOCATOR_PATH, CONTRACT_PATH, SCHEMA_PATH];

function die(message, code = 1) {
  process.stderr.write(`${message}\n`);
  process.exit(code);
}

function parseArgs(argv) {
  const result = { candidate: null, output: null };
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === '--candidate') result.candidate = argv[++i] ?? null;
    else if (token === '--output') result.output = argv[++i] ?? null;
    else if (token === '--help') {
      process.stdout.write(`Usage: node ${SELF_PATH} --candidate <commit> [--output <receipt.json>]\n`);
      process.exit(0);
    } else die(`UNKNOWN_ARGUMENT:${token}`);
  }
  if (!result.candidate) die('MISSING_REQUIRED_ARGUMENT:--candidate');
  return result;
}

function run(command, args, options = {}) {
  const execution = spawnSync(command, args, {
    cwd: options.cwd,
    encoding: 'utf8',
    env: { ...process.env, ...(options.env ?? {}) },
    maxBuffer: 64 * 1024 * 1024
  });
  const stdout = execution.stdout ?? '';
  const stderr = execution.stderr ?? '';
  if (execution.error) throw execution.error;
  if (!options.allowFailure && execution.status !== 0) {
    throw new Error(`${command} ${args.join(' ')} failed (${execution.status})\n${stderr || stdout}`);
  }
  return { status: execution.status ?? 1, stdout, stderr };
}

function git(args, cwd, allowFailure = false) {
  return run('git', args, { cwd, allowFailure });
}

function sha256Text(value) {
  return createHash('sha256').update(value, 'utf8').digest('hex');
}

function stable(value) {
  if (Array.isArray(value)) return value.map(stable);
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]));
  }
  return value;
}

function stableJson(value) {
  return JSON.stringify(stable(value));
}

function parseJson(text, label) {
  try {
    return JSON.parse(text);
  } catch (error) {
    throw new Error(`INVALID_JSON:${label}:${error.message}`);
  }
}

function resolveCommit(repoRoot, ref) {
  const value = git(['rev-parse', `${ref}^{commit}`], repoRoot).stdout.trim();
  if (!/^[0-9a-f]{40}$/.test(value)) throw new Error(`INVALID_COMMIT:${ref}`);
  return value;
}

function blobAt(repoRoot, commit, filePath) {
  const result = git(['rev-parse', `${commit}:${filePath}`], repoRoot, true);
  return result.status === 0 ? result.stdout.trim() : null;
}

function showText(repoRoot, commit, filePath) {
  const result = git(['show', `${commit}:${filePath}`], repoRoot, true);
  if (result.status !== 0) throw new Error(`MISSING_COMMITTED_FILE:${filePath}`);
  return result.stdout;
}

function currentBlob(repoRoot, filePath) {
  const absolute = path.join(repoRoot, filePath);
  if (!fs.existsSync(absolute)) return null;
  return git(['hash-object', filePath], repoRoot).stdout.trim();
}

function ensureClean(repoRoot) {
  const status = git(['status', '--porcelain=v1', '--untracked-files=all'], repoRoot).stdout.trim();
  if (status) throw new Error(`AUTHORITY_WORKTREE_DIRTY:${status.split('\n').join('|')}`);
}

function validateAuthorityIdentity(repoRoot, candidateHead, parentHead) {
  const records = AUTHORITY_PATHS.map((filePath) => {
    const candidateBlob = blobAt(repoRoot, candidateHead, filePath);
    const parentBlob = blobAt(repoRoot, parentHead, filePath);
    const executingBlob = currentBlob(repoRoot, filePath);
    return {
      path: filePath,
      candidateBlob,
      parentBlob,
      executingBlob,
      pass: Boolean(candidateBlob && parentBlob && executingBlob &&
        candidateBlob === parentBlob && candidateBlob === executingBlob)
    };
  });
  const failures = records.filter((record) => !record.pass);
  if (failures.length) {
    throw new Error(`AUTHORITY_IDENTITY_MISMATCH:${failures.map((entry) => entry.path).join(',')}`);
  }
  return records;
}

function validateManifest(manifest) {
  const required = {
    schema: 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_MANIFEST_v1',
    candidateHeadBinding: 'RESOLVED_FROM_GATE_ARGUMENT',
    assertionSetId: ASSERTION_SET_ID,
    expectedAssertionCount: EXPECTED_ASSERTION_COUNT,
    adapterPath: ADAPTER_PATH,
    privateStateAllowed: false,
    dirtyWorktreeAllowed: false,
    oneDeclaredCommandRequired: true
  };
  for (const [key, expected] of Object.entries(required)) {
    if (manifest[key] !== expected) throw new Error(`MANIFEST_FIELD_MISMATCH:${key}`);
  }
  if (typeof manifest.evaluatorPath !== 'string' || !manifest.evaluatorPath.endsWith('.mjs')) {
    throw new Error('MANIFEST_EVALUATOR_PATH_INVALID');
  }
  if (manifest.evaluatorPath === SELF_PATH || manifest.evaluatorPath === ADAPTER_PATH) {
    throw new Error('MANIFEST_EVALUATOR_PATH_COLLISION');
  }
  return manifest;
}

function changedPaths(repoRoot, candidateHead) {
  return git(['diff-tree', '--no-commit-id', '--name-only', '-r', candidateHead], repoRoot)
    .stdout.split('\n').map((value) => value.trim()).filter(Boolean).sort();
}

function blobMap(repoRoot, candidateHead, paths) {
  return Object.fromEntries(paths.map((filePath) => [filePath, blobAt(repoRoot, candidateHead, filePath)]));
}

function validateAdapterReceipt(receipt, independent) {
  const requiredTopLevel = [
    'schema', 'gateInputCandidateHead', 'candidateHead', 'parentHead', 'assertionSetId',
    'assertions', 'passCount', 'failCount', 'overallResult', 'workingTreeClean',
    'privateStateUsed', 'executionCommand', 'changedPaths', 'candidateBlobs',
    'rawMeasurements', 'evidencePackage', 'rollbackIdentity'
  ];
  for (const key of requiredTopLevel) {
    if (!(key in receipt)) throw new Error(`ADAPTER_RECEIPT_MISSING:${key}`);
  }
  if (receipt.schema !== 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_RECEIPT_v1') {
    throw new Error('ADAPTER_RECEIPT_SCHEMA_MISMATCH');
  }
  if (receipt.gateInputCandidateHead !== independent.candidateHead ||
      receipt.candidateHead !== independent.candidateHead ||
      receipt.parentHead !== independent.parentHead) {
    throw new Error('ADAPTER_RECEIPT_COMMIT_BINDING_MISMATCH');
  }
  if (receipt.assertionSetId !== ASSERTION_SET_ID) throw new Error('ADAPTER_ASSERTION_SET_MISMATCH');
  if (!Array.isArray(receipt.assertions) || receipt.assertions.length !== EXPECTED_ASSERTION_COUNT) {
    throw new Error('ADAPTER_ASSERTION_COUNT_MISMATCH');
  }
  const ids = new Set();
  for (const assertion of receipt.assertions) {
    if (!assertion || typeof assertion.id !== 'string' || typeof assertion.pass !== 'boolean') {
      throw new Error('ADAPTER_ASSERTION_RECORD_INVALID');
    }
    if (ids.has(assertion.id)) throw new Error(`ADAPTER_ASSERTION_DUPLICATE:${assertion.id}`);
    ids.add(assertion.id);
  }
  const passCount = receipt.assertions.filter((entry) => entry.pass).length;
  const failCount = EXPECTED_ASSERTION_COUNT - passCount;
  if (receipt.passCount !== passCount || receipt.failCount !== failCount) {
    throw new Error('ADAPTER_ASSERTION_TOTAL_MISMATCH');
  }
  const expectedOverall = failCount === 0 ? 'PASS_28_OF_28' : `FAIL_${passCount}_OF_28`;
  if (receipt.overallResult !== expectedOverall) throw new Error('ADAPTER_OVERALL_RESULT_MISMATCH');
  if (receipt.workingTreeClean !== true || receipt.privateStateUsed !== false) {
    throw new Error('ADAPTER_PRIVATE_OR_DIRTY_STATE_PROHIBITED');
  }
  const normalizedChanged = [...receipt.changedPaths].sort();
  if (stableJson(normalizedChanged) !== stableJson(independent.changedPaths)) {
    throw new Error('ADAPTER_CHANGED_PATHS_MISMATCH');
  }
  if (stableJson(receipt.candidateBlobs) !== stableJson(independent.candidateBlobs)) {
    throw new Error('ADAPTER_CANDIDATE_BLOBS_MISMATCH');
  }
  if (!receipt.evidencePackage || typeof receipt.evidencePackage.sha256 !== 'string' ||
      !/^[0-9a-f]{64}$/.test(receipt.evidencePackage.sha256)) {
    throw new Error('ADAPTER_EVIDENCE_PACKAGE_IDENTITY_INVALID');
  }
  if (!receipt.rawMeasurements || typeof receipt.rawMeasurements !== 'object') {
    throw new Error('ADAPTER_RAW_MEASUREMENTS_INVALID');
  }
  return { passCount, failCount, expectedOverall };
}

const args = parseArgs(process.argv.slice(2));
let repoRoot;
let tempRoot;
let outputPath;
try {
  repoRoot = git(['rev-parse', '--show-toplevel'], process.cwd()).stdout.trim();
  ensureClean(repoRoot);
  const candidateHead = resolveCommit(repoRoot, args.candidate);
  const parentHead = resolveCommit(repoRoot, `${candidateHead}^`);
  const authorityIdentity = validateAuthorityIdentity(repoRoot, candidateHead, parentHead);
  const manifest = validateManifest(parseJson(showText(repoRoot, candidateHead, MANIFEST_PATH), MANIFEST_PATH));
  const evaluatorCandidateBlob = blobAt(repoRoot, candidateHead, manifest.evaluatorPath);
  if (!evaluatorCandidateBlob) throw new Error(`MISSING_COMMITTED_EVALUATOR:${manifest.evaluatorPath}`);
  const adapterCandidateBlob = blobAt(repoRoot, candidateHead, ADAPTER_PATH);
  const adapterParentBlob = blobAt(repoRoot, parentHead, ADAPTER_PATH);
  if (!adapterCandidateBlob || adapterCandidateBlob !== adapterParentBlob) {
    throw new Error('ADAPTER_MUTATED_OR_MISSING_IN_CANDIDATE');
  }

  const independentChangedPaths = changedPaths(repoRoot, candidateHead);
  const independentCandidateBlobs = blobMap(repoRoot, candidateHead, independentChangedPaths);
  const candidateTree = git(['rev-parse', `${candidateHead}^{tree}`], repoRoot).stdout.trim();
  const candidateMessage = git(['log', '-1', '--format=%s', candidateHead], repoRoot).stdout.trim();

  tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), 'h-earth-r06-c10-admission-'));
  const checkoutDir = path.join(tempRoot, 'candidate');
  git(['worktree', 'add', '--detach', checkoutDir, candidateHead], repoRoot);
  const checkoutHead = resolveCommit(checkoutDir, 'HEAD');
  if (checkoutHead !== candidateHead) throw new Error('DETACHED_CHECKOUT_HEAD_MISMATCH');
  const checkoutStatus = git(['status', '--porcelain=v1', '--untracked-files=all'], checkoutDir).stdout.trim();
  if (checkoutStatus) throw new Error(`DETACHED_CHECKOUT_DIRTY:${checkoutStatus}`);

  const adapterOutput = path.join(tempRoot, 'adapter-receipt.json');
  const command = ['node', ADAPTER_PATH, '--candidate-head', candidateHead, '--output', adapterOutput];
  const adapterExecution = run(command[0], command.slice(1), {
    cwd: checkoutDir,
    allowFailure: true,
    env: {
      H_EARTH_R06_C10_GATE_ID: GATE_ID,
      H_EARTH_R06_C10_GATE_INPUT_CANDIDATE: candidateHead,
      H_EARTH_R06_C10_GATE_PRIVATE_STATE_ALLOWED: 'false'
    }
  });
  if (!fs.existsSync(adapterOutput)) {
    throw new Error(`ADAPTER_RECEIPT_NOT_WRITTEN:exit=${adapterExecution.status}`);
  }
  const adapterReceipt = parseJson(fs.readFileSync(adapterOutput, 'utf8'), adapterOutput);
  const independent = {
    candidateHead,
    parentHead,
    changedPaths: independentChangedPaths,
    candidateBlobs: independentCandidateBlobs
  };
  const counts = validateAdapterReceipt(adapterReceipt, independent);

  const fingerprintPayload = {
    gateId: GATE_ID,
    candidateHead,
    parentHead,
    candidateTree,
    authorityIdentity,
    manifestBlob: blobAt(repoRoot, candidateHead, MANIFEST_PATH),
    evaluatorPath: manifest.evaluatorPath,
    evaluatorBlob: evaluatorCandidateBlob,
    changedPaths: independentChangedPaths,
    candidateBlobs: independentCandidateBlobs,
    assertionSetId: ASSERTION_SET_ID,
    assertions: adapterReceipt.assertions,
    rawMeasurements: adapterReceipt.rawMeasurements,
    evidencePackage: adapterReceipt.evidencePackage,
    rollbackIdentity: adapterReceipt.rollbackIdentity
  };
  const reproductionFingerprintSha256 = sha256Text(stableJson(fingerprintPayload));
  const gatePass = counts.failCount === 0 && adapterExecution.status === 0;
  const gateReceipt = {
    schema: 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_GATE_RECEIPT_v1',
    gateId: GATE_ID,
    candidateHead,
    parentHead,
    candidateTree,
    candidateMessage,
    authorityIdentity,
    manifestPath: MANIFEST_PATH,
    manifestBlob: blobAt(repoRoot, candidateHead, MANIFEST_PATH),
    evaluatorPath: manifest.evaluatorPath,
    evaluatorBlob: evaluatorCandidateBlob,
    adapterPath: ADAPTER_PATH,
    adapterBlob: adapterCandidateBlob,
    exactCommand: command,
    adapterExitCode: adapterExecution.status,
    adapterStdoutSha256: sha256Text(adapterExecution.stdout),
    adapterStderrSha256: sha256Text(adapterExecution.stderr),
    changedPaths: independentChangedPaths,
    candidateBlobs: independentCandidateBlobs,
    assertionSetId: ASSERTION_SET_ID,
    assertionCount: EXPECTED_ASSERTION_COUNT,
    passCount: counts.passCount,
    failCount: counts.failCount,
    exactFailIds: adapterReceipt.assertions.filter((entry) => !entry.pass).map((entry) => entry.id),
    candidateResult: adapterReceipt.overallResult,
    gateResult: gatePass ? 'PASS_EXACT_COMMITTED_CANDIDATE_ADMISSION' : 'FAIL_CLOSED_CANDIDATE_NOT_ADMITTED',
    rawMeasurements: adapterReceipt.rawMeasurements,
    evidencePackage: adapterReceipt.evidencePackage,
    rollbackIdentity: adapterReceipt.rollbackIdentity,
    workingTreeClean: true,
    privateStateUsed: false,
    conversationMemoryRequired: false,
    reproductionFingerprintSha256
  };

  const serialized = `${JSON.stringify(gateReceipt, null, 2)}\n`;
  outputPath = args.output ? path.resolve(process.cwd(), args.output) : null;
  if (outputPath) {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized, 'utf8');
  } else {
    process.stdout.write(serialized);
  }
  process.exitCode = gatePass ? 0 : 2;
} catch (error) {
  const failure = {
    schema: 'H_EARTH_R06_C10_EXACT_CANDIDATE_ADMISSION_GATE_FAILURE_v1',
    gateId: GATE_ID,
    gateResult: 'FAIL_CLOSED_INSTRUMENT_OR_BINDING_ERROR',
    candidateArgument: args.candidate,
    error: error instanceof Error ? error.message : String(error),
    conversationMemoryRequired: false
  };
  const serialized = `${JSON.stringify(failure, null, 2)}\n`;
  if (args.output) {
    outputPath = path.resolve(process.cwd(), args.output);
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, serialized, 'utf8');
  } else {
    process.stderr.write(serialized);
  }
  process.exitCode = 1;
} finally {
  if (tempRoot && repoRoot) {
    const checkoutDir = path.join(tempRoot, 'candidate');
    if (fs.existsSync(checkoutDir)) git(['worktree', 'remove', '--force', checkoutDir], repoRoot, true);
    fs.rmSync(tempRoot, { recursive: true, force: true });
  }
}
