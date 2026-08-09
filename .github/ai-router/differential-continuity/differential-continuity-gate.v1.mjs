#!/usr/bin/env node
import crypto from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { successorRemote } from '../operation-lifecycle/repository-operation-successor-gate.v1.mjs';

export const REQUEST_SCHEMA = 'DIFFERENTIAL_CONTINUITY_REQUEST_v1';
export const RECEIPT_SCHEMA = 'DIFFERENTIAL_CONTINUITY_RECEIPT_v1';
export const WRAPPER_RECEIPT_SCHEMA = 'DIFFERENTIAL_SUCCESSOR_GATE_RECEIPT_v1';
export const PROOF_CARRIER_SCHEMA = 'PROOF_CARRIER_LIFECYCLE_RECEIPT_v1';
const HEX40 = /^[0-9a-f]{40}$/;

export const stable = (value) => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map((key) => [key, stable(value[key])]))
    : value;

function text(value) { return `${JSON.stringify(stable(value), null, 2)}\n`; }
function sha256(value) { return crypto.createHash('sha256').update(typeof value === 'string' ? value : JSON.stringify(stable(value))).digest('hex'); }
function fail(code, detail = null) { const error = new Error(detail ? `${code}:${detail}` : code); error.code = code; error.detail = detail; throw error; }
function object(value, code) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(code); return value; }
function string(value, code) { if (typeof value !== 'string' || !value.trim()) fail(code); return value.trim(); }
function boolean(value, code) { if (typeof value !== 'boolean') fail(code); return value; }
function uniqueStrings(value, code) {
  if (!Array.isArray(value)) fail(code);
  const normalized = value.map((item) => string(item, code));
  if (new Set(normalized).size !== normalized.length) fail(code, 'DUPLICATE');
  return normalized;
}
function head(value, code) { const normalized = string(value, code); if (!HEX40.test(normalized)) fail(code); return normalized; }

function normalizePath(value) {
  const normalized = string(value, 'PATH_INVALID').replaceAll('\\', '/').replace(/^\.\/+/, '').replace(/\/+$/, '');
  if (!normalized || normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../') || normalized.includes('//')) fail('PATH_INVALID', value);
  return normalized;
}

function pathOverlap(a, b) {
  if (a === '*' || b === '*') return true;
  return a === b || a.startsWith(`${b}/`) || b.startsWith(`${a}/`);
}

export function validateDependencySurface(raw) {
  const surface = object(raw, 'DEPENDENCY_SURFACE_INVALID');
  if (boolean(surface.complete, 'DEPENDENCY_SURFACE_COMPLETE_INVALID') !== true) fail('DEPENDENCY_SURFACE_INCOMPLETE');
  const paths = uniqueStrings(surface.paths, 'DEPENDENCY_PATHS_INVALID').map(normalizePath).sort();
  if (!paths.length) fail('DEPENDENCY_PATHS_EMPTY');
  const interfaceKeys = uniqueStrings(surface.interfaceKeys ?? [], 'DEPENDENCY_INTERFACE_KEYS_INVALID').sort();
  const evidenceRefs = uniqueStrings(surface.evidenceRefs ?? [], 'DEPENDENCY_EVIDENCE_REFS_INVALID').sort();
  return stable({ complete: true, paths, interfaceKeys, evidenceRefs });
}

function normalizeChangedFiles(raw) {
  if (!Array.isArray(raw)) fail('CHANGED_FILES_INVALID');
  const records = [];
  for (const item of raw) {
    if (typeof item === 'string') {
      records.push({ filename: normalizePath(item), previousFilename: null, status: 'modified' });
      continue;
    }
    const record = object(item, 'CHANGED_FILE_INVALID');
    const filename = normalizePath(record.filename ?? record.path);
    const previousFilename = record.previous_filename || record.previousFilename ? normalizePath(record.previous_filename ?? record.previousFilename) : null;
    records.push({ filename, previousFilename, status: typeof record.status === 'string' ? record.status : 'modified' });
  }
  return records.sort((a, b) => `${a.filename}:${a.previousFilename ?? ''}`.localeCompare(`${b.filename}:${b.previousFilename ?? ''}`));
}

export function classifyProofCarrier(raw) {
  if (!raw) return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'RETAIN_REVIEW_REQUIRED', closeEligible: false, mergeAuthorized: false, reason: 'NO_PROOF_CARRIER_DECLARED' });
  const carrier = object(raw, 'PROOF_CARRIER_INVALID');
  const kind = string(carrier.kind, 'PROOF_CARRIER_KIND_INVALID');
  const status = string(carrier.status, 'PROOF_CARRIER_STATUS_INVALID');
  const mergeAuthorized = carrier.mergeAuthorized === true;
  if (kind !== 'VALIDATION_ONLY_PR') return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'RETAIN_REVIEW_REQUIRED', closeEligible: false, mergeAuthorized, reason: 'NOT_VALIDATION_ONLY_PR' });
  if (mergeAuthorized) return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'RETAIN_REVIEW_REQUIRED', closeEligible: false, mergeAuthorized: true, reason: 'MERGE_AUTHORITY_PRESENT' });
  if (status === 'CONSUMED') return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'CLOSE_ELIGIBLE_CONSUMED', closeEligible: true, mergeAuthorized: false, reason: 'VALIDATION_ONLY_EVIDENCE_CONSUMED' });
  if (status === 'SUPERSEDED') return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'CLOSE_ELIGIBLE_SUPERSEDED', closeEligible: true, mergeAuthorized: false, reason: 'VALIDATION_ONLY_EVIDENCE_SUPERSEDED' });
  if (status === 'ACTIVE') return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'ACTIVE_PROOF', closeEligible: false, mergeAuthorized: false, reason: 'PROOF_STILL_ACTIVE' });
  return stable({ schema: PROOF_CARRIER_SCHEMA, classification: 'RETAIN_REVIEW_REQUIRED', closeEligible: false, mergeAuthorized: false, reason: 'UNKNOWN_PROOF_STATUS' });
}

function blockedReceipt({ assessmentId = null, baseHead = null, targetHead = null, code, detail = null, dependencySurface = null, changedFiles = [], proofCarrier = null }) {
  const changedPaths = [...new Set(changedFiles.flatMap((record) => [record.filename, record.previousFilename].filter(Boolean)))].sort();
  return stable({
    schema: RECEIPT_SCHEMA,
    result: 'FAIL_CLOSED_SUCCESSOR_REQUIRED',
    assessmentId,
    baseHead,
    targetHead,
    impactClassification: 'AMBIGUOUS_OR_UNPROVEN_CHANGE',
    carryForwardAdmissible: false,
    continuationUnderExistingBoundedAuthorityAdmissible: false,
    successorRequired: true,
    errorCode: code,
    detail,
    dependencySurfaceDigest: dependencySurface ? sha256(dependencySurface) : null,
    changedPaths,
    changedPathsDigest: sha256(changedPaths),
    coalescedFromBaseDirectlyToTarget: true,
    proofCarrierLifecycle: classifyProofCarrier(proofCarrier),
    authorityInherited: false,
    newAuthorityCreated: false,
    repositoryMutationAuthorized: false,
    mergeAuthorityCreated: false
  });
}

export function assessDifferential(raw) {
  const request = object(raw, 'DIFFERENTIAL_REQUEST_INVALID');
  const assessmentId = string(request.assessmentId, 'ASSESSMENT_ID_INVALID');
  const baseHead = head(request.baseHead, 'BASE_HEAD_INVALID');
  const targetHead = head(request.targetHead, 'TARGET_HEAD_INVALID');
  let dependencySurface;
  let changedFiles;
  try { dependencySurface = validateDependencySurface(request.dependencySurface); }
  catch (error) { return blockedReceipt({ assessmentId, baseHead, targetHead, code: error.code ?? 'DEPENDENCY_SURFACE_INVALID', detail: error.detail ?? null, proofCarrier: request.proofCarrier }); }
  try { changedFiles = normalizeChangedFiles(request.changedFiles ?? []); }
  catch (error) { return blockedReceipt({ assessmentId, baseHead, targetHead, code: error.code ?? 'CHANGED_FILES_INVALID', detail: error.detail ?? null, dependencySurface, proofCarrier: request.proofCarrier }); }

  if (request.filesComplete !== true) return blockedReceipt({ assessmentId, baseHead, targetHead, code: 'CHANGED_FILE_SET_INCOMPLETE', dependencySurface, changedFiles, proofCarrier: request.proofCarrier });
  const compareStatus = string(request.compareStatus, 'COMPARE_STATUS_INVALID');
  if (!['ahead', 'identical'].includes(compareStatus)) return blockedReceipt({ assessmentId, baseHead, targetHead, code: 'COMPARE_NOT_LINEAR_AHEAD_OR_IDENTICAL', detail: compareStatus, dependencySurface, changedFiles, proofCarrier: request.proofCarrier });

  const changedPaths = [...new Set(changedFiles.flatMap((record) => [record.filename, record.previousFilename].filter(Boolean)))].sort();
  const overlaps = [];
  for (const changedPath of changedPaths) {
    for (const dependencyPath of dependencySurface.paths) {
      if (pathOverlap(changedPath, dependencyPath)) overlaps.push({ changedPath, dependencyPath });
    }
  }
  const sameHead = baseHead === targetHead;
  const material = overlaps.length > 0;
  const impactClassification = sameHead ? 'SAME_HEAD' : material ? 'MATERIAL_DEPENDENCY_CHANGE' : 'DISJOINT_DEPENDENCY_CHANGE';
  const carryForwardAdmissible = sameHead || !material;
  return stable({
    schema: RECEIPT_SCHEMA,
    result: carryForwardAdmissible ? 'PASS_CARRY_FORWARD_ADMISSIBLE' : 'PASS_SUCCESSOR_REQUIRED',
    assessmentId,
    baseHead,
    targetHead,
    compareStatus,
    impactClassification,
    carryForwardAdmissible,
    continuationUnderExistingBoundedAuthorityAdmissible: carryForwardAdmissible,
    successorRequired: !carryForwardAdmissible,
    errorCode: null,
    dependencySurface,
    dependencySurfaceDigest: sha256(dependencySurface),
    changedFiles,
    changedPaths,
    changedPathsDigest: sha256(changedPaths),
    overlaps,
    coalescedFromBaseDirectlyToTarget: true,
    intermediateHeadReplayRequired: false,
    proofCarrierLifecycle: classifyProofCarrier(request.proofCarrier),
    authorityInherited: false,
    newAuthorityCreated: false,
    repositoryMutationAuthorized: false,
    mergeAuthorityCreated: false
  });
}

function headers(token) {
  string(token, 'GITHUB_TOKEN_REQUIRED');
  return { Accept: 'application/vnd.github+json', Authorization: `Bearer ${token}`, 'X-GitHub-Api-Version': '2022-11-28' };
}
function repoBase(repository) {
  const value = string(repository, 'REPOSITORY_INVALID');
  if (!/^[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(value)) fail('REPOSITORY_INVALID');
  return `https://api.github.com/repos/${value}`;
}
async function githubJson(url, token) {
  const response = await fetch(url, { headers: headers(token) });
  const body = await response.json().catch(() => null);
  if (!response.ok) fail('GITHUB_API_ERROR', `${response.status}:${body?.message ?? 'UNKNOWN'}`);
  return body;
}
async function latestMainHead(repository, token) {
  const body = await githubJson(`${repoBase(repository)}/git/ref/heads/main`, token);
  return head(body?.object?.sha, 'LATEST_MAIN_HEAD_INVALID');
}

export async function assessRemote(raw, { token }) {
  const request = object(raw, 'DIFFERENTIAL_REQUEST_INVALID');
  if (request.schema !== REQUEST_SCHEMA) fail('DIFFERENTIAL_REQUEST_SCHEMA_MISMATCH');
  const repository = string(request.repository, 'REPOSITORY_INVALID');
  const assessmentId = string(request.assessmentId, 'ASSESSMENT_ID_INVALID');
  const baseHead = head(request.baseHead, 'BASE_HEAD_INVALID');
  const liveMain = await latestMainHead(repository, token);
  const targetHead = !request.targetHead || request.targetHead === 'LATEST_MAIN' ? liveMain : head(request.targetHead, 'TARGET_HEAD_INVALID');
  if (targetHead !== liveMain) return blockedReceipt({ assessmentId, baseHead, targetHead, code: 'TARGET_NOT_LATEST_MAIN', detail: `latest=${liveMain}`, dependencySurface: request.dependencySurface && request.dependencySurface.complete === true ? validateDependencySurface(request.dependencySurface) : null, proofCarrier: request.proofCarrier });
  if (baseHead === targetHead) return assessDifferential({ assessmentId, baseHead, targetHead, dependencySurface: request.dependencySurface, changedFiles: [], filesComplete: true, compareStatus: 'identical', proofCarrier: request.proofCarrier });

  let comparison;
  try { comparison = await githubJson(`${repoBase(repository)}/compare/${baseHead}...${targetHead}`, token); }
  catch (error) { return blockedReceipt({ assessmentId, baseHead, targetHead, code: 'COMPARE_UNAVAILABLE', detail: error.message, dependencySurface: request.dependencySurface && request.dependencySurface.complete === true ? validateDependencySurface(request.dependencySurface) : null, proofCarrier: request.proofCarrier }); }
  const files = Array.isArray(comparison.files) ? comparison.files : [];
  const filesComplete = files.length < 300;
  return assessDifferential({
    assessmentId,
    baseHead,
    targetHead,
    dependencySurface: request.dependencySurface,
    changedFiles: files,
    filesComplete,
    compareStatus: comparison.status,
    proofCarrier: request.proofCarrier
  });
}

export function successorActionForReceipt(receipt) {
  if (!receipt || receipt.schema !== RECEIPT_SCHEMA) return 'DELEGATE_TO_STRICT_SUCCESSOR';
  if (receipt.carryForwardAdmissible === true && receipt.successorRequired === false) return 'STOP_SUCCESSOR_CARRY_FORWARD';
  return 'DELEGATE_TO_STRICT_SUCCESSOR';
}

async function successorWrapper({ transition, request, procedure, repository, lockRef, token, casRetryLimit }) {
  const differentialRequest = transition?.differentialContinuityRequest ?? null;
  if (differentialRequest) {
    const normalized = { ...differentialRequest, schema: REQUEST_SCHEMA, repository, baseHead: transition?.predecessor?.governingHead, targetHead: transition?.successor?.governingHead };
    const differentialReceipt = await assessRemote(normalized, { token });
    if (successorActionForReceipt(differentialReceipt) === 'STOP_SUCCESSOR_CARRY_FORWARD') {
      return stable({
        schema: WRAPPER_RECEIPT_SCHEMA,
        result: 'SUCCESSOR_NOT_REQUIRED_DIFFERENTIAL_CONTINUITY_PASS',
        transitionId: transition?.transitionId ?? null,
        predecessorOperationId: transition?.predecessor?.operationId ?? null,
        differentialReceipt,
        successorDelegated: false,
        ledgerMutationPerformed: false,
        continuationUnderExistingBoundedAuthorityAdmissible: true,
        newAuthorityCreated: false,
        authorityInherited: false,
        mergeAuthorityCreated: false
      });
    }
  }
  const successorReceipt = await successorRemote({ repository, lockRef, token, transition, request, procedure, casRetryLimit });
  return stable({
    schema: WRAPPER_RECEIPT_SCHEMA,
    result: 'STRICT_SUCCESSOR_DELEGATED',
    transitionId: transition?.transitionId ?? null,
    successorDelegated: true,
    differentialReceipt: differentialRequest ? await assessRemote({ ...differentialRequest, schema: REQUEST_SCHEMA, repository, baseHead: transition?.predecessor?.governingHead, targetHead: transition?.successor?.governingHead }, { token }) : null,
    successorReceipt,
    ledgerMutationPerformed: successorReceipt?.ledgerCompareAndSwapCommitted === true,
    continuationUnderExistingBoundedAuthorityAdmissible: false,
    newAuthorityCreated: false,
    authorityInherited: false,
    mergeAuthorityCreated: false
  });
}

function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    args[token.slice(2)] = argv[++index] ?? null;
  }
  return args;
}
function readJson(file, field) {
  if (!file) fail('MISSING_CLI_ARGUMENT', field);
  try { return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
  catch (error) { fail('INVALID_JSON_INPUT', `${field}:${error.message}`); }
}
function writeJson(file, value) {
  if (!file) return process.stdout.write(text(value));
  const absolute = path.resolve(file);
  fs.mkdirSync(path.dirname(absolute), { recursive: true });
  fs.writeFileSync(absolute, text(value));
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  let receipt;
  if (args['differential-request']) {
    receipt = await assessRemote(readJson(args['differential-request'], 'differential-request'), { token: process.env.GITHUB_TOKEN });
  } else if (args.transition) {
    receipt = await successorWrapper({
      transition: readJson(args.transition, 'transition'),
      request: readJson(args.request, 'request'),
      procedure: readJson(args.procedure, 'procedure'),
      repository: args.repository,
      lockRef: args['lock-ref'],
      token: process.env.GITHUB_TOKEN,
      casRetryLimit: args['cas-retry-limit'] ? Number(args['cas-retry-limit']) : undefined
    });
  } else {
    fail('MISSING_OPERATION_MODE');
  }
  writeJson(args.output, receipt);
  const ok = ['PASS_CARRY_FORWARD_ADMISSIBLE', 'PASS_SUCCESSOR_REQUIRED', 'SUCCESSOR_NOT_REQUIRED_DIFFERENTIAL_CONTINUITY_PASS', 'STRICT_SUCCESSOR_DELEGATED'].includes(receipt.result);
  if (!ok) process.exitCode = 4;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
  main().catch((error) => {
    const receipt = stable({ schema: RECEIPT_SCHEMA, result: 'FAIL_CLOSED_SUCCESSOR_REQUIRED', errorCode: error.code ?? 'UNEXPECTED_DIFFERENTIAL_CONTINUITY_ERROR', detail: error.detail ?? error.message, carryForwardAdmissible: false, successorRequired: true, newAuthorityCreated: false, repositoryMutationAuthorized: false, mergeAuthorityCreated: false });
    try { writeJson(parseArgs(process.argv.slice(2)).output, receipt); } catch { process.stderr.write(text(receipt)); }
    process.exitCode = 1;
  });
}
