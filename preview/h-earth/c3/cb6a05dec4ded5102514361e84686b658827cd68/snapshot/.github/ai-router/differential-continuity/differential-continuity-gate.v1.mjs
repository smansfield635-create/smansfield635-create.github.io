#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const REQUEST_SCHEMA = 'DIFFERENTIAL_CONTINUITY_ASSESSMENT_REQUEST_v1';
export const RECEIPT_SCHEMA = 'DIFFERENTIAL_CONTINUITY_RECEIPT_v1';
export const CARRY_FORWARD = 'CARRY_FORWARD_APPROVED';
export const STRICT_SUCCESSOR = 'STRICT_SUCCESSOR_REQUIRED';

const HEAD_RE = /^[0-9a-f]{40}$/;
const object = value => value && typeof value === 'object' && !Array.isArray(value);
const stable = value => Array.isArray(value)
  ? value.map(stable)
  : object(value)
    ? Object.fromEntries(Object.keys(value).sort().map(k => [k, stable(value[k])]))
    : value;

function fail(code, detail = null) {
  const error = new Error(code);
  error.code = code;
  error.detail = detail;
  throw error;
}

function normalizePath(value, field) {
  if (typeof value !== 'string' || !value.trim()) fail('PATH_INVALID', field);
  const normalized = value.replaceAll('\\', '/').replace(/^\.\//, '').replace(/\/+$/, '');
  if (!normalized || normalized.startsWith('/') || normalized.includes('../') || normalized === '..') fail('PATH_INVALID', field);
  return normalized;
}

function normalizeUniquePaths(values, field, allowEmpty = false) {
  if (!Array.isArray(values) || (!allowEmpty && values.length === 0)) fail('PATH_SET_INVALID', field);
  const normalized = values.map((value, index) => normalizePath(value, `${field}[${index}]`));
  if (new Set(normalized).size !== normalized.length) fail('PATH_SET_DUPLICATE', field);
  return [...normalized].sort();
}

function overlaps(a, b) {
  return a === b || a.startsWith(b + '/') || b.startsWith(a + '/');
}

export function assessDifferential(raw) {
  const request = object(raw) ? raw : fail('REQUEST_NOT_OBJECT');
  if (request.schema !== REQUEST_SCHEMA) fail('REQUEST_SCHEMA_INVALID');
  if (!HEAD_RE.test(request.baseHead || '')) fail('BASE_HEAD_INVALID');
  if (!HEAD_RE.test(request.currentHead || '')) fail('CURRENT_HEAD_INVALID');
  if (request.dependencySurfaceComplete !== true && request.dependencySurfaceComplete !== false) fail('DEPENDENCY_COMPLETENESS_INVALID');
  if (request.baseIsAncestor !== true && request.baseIsAncestor !== false) fail('ANCESTRY_EVIDENCE_INVALID');

  const dependencyPaths = normalizeUniquePaths(request.dependencyPaths, 'dependencyPaths');
  const changedPaths = normalizeUniquePaths(request.changedPaths, 'changedPaths', true);

  let result = CARRY_FORWARD;
  let reason = 'COMPLETE_DISJOINT_CHANGE_PROVEN';
  let overlapsObserved = [];

  if (request.dependencySurfaceComplete !== true) {
    result = STRICT_SUCCESSOR;
    reason = 'INCOMPLETE_DEPENDENCY_SURFACE';
  } else if (request.baseIsAncestor !== true) {
    result = STRICT_SUCCESSOR;
    reason = 'BASE_NOT_ANCESTOR_OF_CURRENT_HEAD';
  } else if (request.baseHead === request.currentHead) {
    reason = 'NO_HEAD_MOVEMENT';
  } else {
    overlapsObserved = changedPaths.flatMap(changed =>
      dependencyPaths.filter(dependency => overlaps(changed, dependency)).map(dependency => ({ changed, dependency }))
    );
    if (overlapsObserved.length) {
      result = STRICT_SUCCESSOR;
      reason = 'DEPENDENCY_OVERLAP';
    }
  }

  return stable({
    schema: RECEIPT_SCHEMA,
    result,
    reason,
    baseHead: request.baseHead,
    currentHead: request.currentHead,
    dependencySurfaceComplete: request.dependencySurfaceComplete,
    baseIsAncestor: request.baseIsAncestor,
    dependencyPaths,
    changedPaths,
    overlapsObserved,
    carryForwardAuthorized: result === CARRY_FORWARD,
    authorityExpanded: false,
    mutationAuthorityCreated: false,
    mergeAuthorityCreated: false,
    strictSuccessorFallbackPreserved: true,
    ambiguousEvidenceDisposition: STRICT_SUCCESSOR
  });
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 2) {
    const key = argv[i];
    const value = argv[i + 1];
    if (!['--input','--output'].includes(key) || value === undefined) fail('CLI_ARGUMENTS_INVALID', key);
    args[key.slice(2)] = value;
  }
  if (!args.input || !args.output || Object.keys(args).length !== 2) fail('CLI_ARGUMENTS_INCOMPLETE');
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  let receipt;
  try {
    const input = JSON.parse(fs.readFileSync(path.resolve(args.input), 'utf8'));
    receipt = assessDifferential(input);
  } catch (error) {
    receipt = stable({
      schema: RECEIPT_SCHEMA,
      result: STRICT_SUCCESSOR,
      reason: 'AMBIGUOUS_OR_INVALID_EVIDENCE',
      errorCode: error.code || 'UNEXPECTED_DIFFERENTIAL_FAILURE',
      detail: error.detail || error.message,
      carryForwardAuthorized: false,
      authorityExpanded: false,
      mutationAuthorityCreated: false,
      mergeAuthorityCreated: false,
      strictSuccessorFallbackPreserved: true,
      ambiguousEvidenceDisposition: STRICT_SUCCESSOR
    });
    process.exitCode = 2;
  }
  fs.mkdirSync(path.dirname(path.resolve(args.output)), { recursive: true });
  fs.writeFileSync(path.resolve(args.output), JSON.stringify(receipt, null, 2) + '\n');
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) main();
