#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import cp from 'node:child_process';

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;

export const canonical = value => JSON.stringify(stable(value));
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const hashObject = value => sha256(Buffer.from(canonical(value), 'utf8'));
export const jsonText = value => `${JSON.stringify(stable(value), null, 2)}\n`;

export function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${detail}`);
  error.code = code;
  error.detail = detail;
  throw error;
}

export function readJson(file) {
  try {
    return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8'));
  } catch (error) {
    fail('JSON_READ_FAILED', `${file}:${error.message}`);
  }
}

export function writeJson(file, value) {
  const target = path.resolve(file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, jsonText(value));
}

export function assertObject(value, code = 'OBJECT_REQUIRED') {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail(code);
  return value;
}

export function assertString(value, code = 'STRING_REQUIRED') {
  if (typeof value !== 'string' || value.length === 0) fail(code);
  return value;
}

export function assertArray(value, code = 'ARRAY_REQUIRED') {
  if (!Array.isArray(value)) fail(code);
  return value;
}

export function assertClosedKeys(value, required, allowed, codePrefix) {
  assertObject(value, `${codePrefix}_OBJECT_REQUIRED`);
  for (const key of required) if (!Object.hasOwn(value, key)) fail(`${codePrefix}_MISSING_FIELD`, key);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${codePrefix}_UNKNOWN_FIELD`, key);
}

export function assertCommit(value, code = 'INVALID_COMMIT') {
  if (!/^[0-9a-f]{40}$/.test(value ?? '')) fail(code, String(value));
  return value;
}

export function assertDigest(value, code = 'INVALID_SHA256') {
  if (!/^[0-9a-f]{64}$/.test(value ?? '')) fail(code, String(value));
  return value;
}

export function assertRepositoryPath(value, code = 'INVALID_REPOSITORY_PATH') {
  assertString(value, code);
  const normalized = value.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) fail(code, value);
  if (!/^[A-Za-z0-9._/-]+$/.test(normalized)) fail(code, value);
  return normalized;
}

export function validateReceiptIdentity(identity) {
  assertClosedKeys(
    identity,
    ['sourceClass', 'exactHead', 'path', 'sha256'],
    ['sourceClass', 'exactHead', 'path', 'sha256'],
    'RECEIPT_IDENTITY'
  );
  if (identity.sourceClass !== 'REPOSITORY_PATH_AT_EXACT_HEAD') fail('UNSUPPORTED_RECEIPT_SOURCE_CLASS', identity.sourceClass);
  assertCommit(identity.exactHead, 'RECEIPT_IDENTITY_HEAD_INVALID');
  assertRepositoryPath(identity.path, 'RECEIPT_IDENTITY_PATH_INVALID');
  assertDigest(identity.sha256, 'RECEIPT_IDENTITY_DIGEST_INVALID');
  return stable(identity);
}

export function loadJsonAtIdentity(root, rawIdentity) {
  const identity = validateReceiptIdentity(rawIdentity);
  let bytes;
  try {
    bytes = cp.execFileSync('git', ['show', `${identity.exactHead}:${identity.path}`], {
      cwd: path.resolve(root),
      maxBuffer: 32 * 1024 * 1024
    });
  } catch (error) {
    fail('RECEIPT_IDENTITY_NOT_RESOLVABLE', `${identity.exactHead}:${identity.path}`);
  }
  const actualDigest = sha256(bytes);
  if (actualDigest !== identity.sha256) fail('RECEIPT_IDENTITY_DIGEST_MISMATCH', `${identity.sha256}:${actualDigest}`);
  try {
    return { identity, value: JSON.parse(bytes.toString('utf8')) };
  } catch (error) {
    fail('RECEIPT_IDENTITY_JSON_INVALID', identity.path);
  }
}

export function validateInputObject(schema, input) {
  assertObject(schema, 'INPUT_SCHEMA_INVALID');
  assertObject(input, 'INPUT_OBJECT_REQUIRED');
  const required = assertArray(schema.required, 'INPUT_SCHEMA_REQUIRED_INVALID');
  const allowed = assertArray(schema.allowed, 'INPUT_SCHEMA_ALLOWED_INVALID');
  assertClosedKeys(input, required, allowed, 'INPUT');
  for (const [field, rule] of Object.entries(schema.properties ?? {})) {
    const value = input[field];
    if (rule.type === 'string' && typeof value !== 'string') fail('INPUT_TYPE_MISMATCH', field);
    if (Object.hasOwn(rule, 'const') && value !== rule.const) fail('INPUT_CONST_MISMATCH', field);
    if (rule.pattern && !new RegExp(rule.pattern).test(value ?? '')) fail('INPUT_PATTERN_MISMATCH', field);
  }
  return stable(input);
}

export function parseArgs(argv) {
  const args = {};
  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    const key = token.slice(2);
    if (Object.hasOwn(args, key)) fail('DUPLICATE_ARGUMENT', key);
    args[key] = argv[++index] ?? null;
  }
  return args;
}

export function commandDigest(executable, args) {
  return hashObject({ executable, args });
}

export function pathIsWithinAllowed(pathValue, allowedExact, allowedPrefixes = []) {
  return allowedExact.includes(pathValue) || allowedPrefixes.some(prefix => pathValue.startsWith(prefix));
}
