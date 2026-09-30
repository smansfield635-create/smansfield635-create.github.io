#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const COMPILE_REQUEST_SCHEMA = 'REPOSITORY_OPERATION_SUCCESSOR_PACKET_COMPILE_REQUEST_v1';
export const COMPILED_PACKET_SCHEMA = 'REPOSITORY_OPERATION_SUCCESSOR_COMPILED_PACKET_v1';
export const COMPILER_RECEIPT_SCHEMA = 'REPOSITORY_OPERATION_SUCCESSOR_PACKET_COMPILER_RECEIPT_v1';
export const TRANSITION_SCHEMA = 'REPOSITORY_OPERATION_SUCCESSOR_TRANSITION_REQUEST_v1';
export const AUTHORITY_POLICY = 'FRESH_SUCCESSOR_REQUEST_REQUIRED_NO_IMPLICIT_INHERITANCE';
export const EVIDENCE_POLICY = 'EXACT_HEAD_REVALIDATION_REQUIRED';
export const GOVERNING_REF = 'refs/heads/main';

function fail(code, field, detail = null) {
  const error = new Error(`${code}:${field}${detail ? `:${detail}` : ''}`);
  Object.assign(error, { code, field, detail });
  throw error;
}

function object(value, field) {
  if (!value || typeof value !== 'object' || Array.isArray(value)) fail('INVALID_OBJECT', field);
  return value;
}

function string(value, field) {
  if (typeof value !== 'string' || value.length === 0) fail('INVALID_STRING', field);
  return value;
}

function sha(value, field) {
  string(value, field);
  if (!/^[0-9a-f]{40}$/.test(value)) fail('INVALID_SHA1', field);
  return value;
}

function array(value, field) {
  if (!Array.isArray(value)) fail('INVALID_ARRAY', field);
  return value;
}

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function decodeToken(token) {
  return token.replace(/~1/g, '/').replace(/~0/g, '~');
}

function pointerParts(pointer) {
  string(pointer, 'rebind.pointer');
  if (!pointer.startsWith('/')) fail('INVALID_JSON_POINTER', 'rebind.pointer', pointer);
  return pointer.slice(1).split('/').map(decodeToken);
}

function getAt(root, pointer) {
  let node = root;
  for (const part of pointerParts(pointer)) {
    if (node === null || node === undefined || !Object.hasOwn(Object(node), part)) fail('REBIND_POINTER_NOT_FOUND', pointer);
    node = node[part];
  }
  return node;
}

function setAt(root, pointer, value) {
  const parts = pointerParts(pointer);
  let node = root;
  for (let i = 0; i < parts.length - 1; i += 1) {
    const part = parts[i];
    if (node === null || node === undefined || !Object.hasOwn(Object(node), part)) fail('REBIND_POINTER_NOT_FOUND', pointer);
    node = node[part];
  }
  const leaf = parts.at(-1);
  if (node === null || node === undefined || !Object.hasOwn(Object(node), leaf)) fail('REBIND_POINTER_NOT_FOUND', pointer);
  node[leaf] = value;
}

const FORBIDDEN_REBIND_PREFIXES = [
  '/operationId',
  '/projectId',
  '/lockScope',
  '/allowedPaths',
  '/prohibitedPaths',
  '/requestingAuthority',
  '/executingRole',
  '/independentVerifier',
  '/terminalDispositions',
  '/exactAllowedRepositoryPaths',
  '/operationClass'
];

function forbiddenPointer(pointer) {
  return FORBIDDEN_REBIND_PREFIXES.some((prefix) => pointer === prefix || pointer.startsWith(`${prefix}/`));
}

function applyRebind(document, raw, oldHead, newHead, seen) {
  const rebind = object(raw, 'rebind');
  const documentName = string(rebind.document, 'rebind.document');
  if (!['operationRequest', 'constructionProcedure'].includes(documentName)) fail('REBIND_DOCUMENT_INVALID', 'rebind.document');
  const pointer = string(rebind.pointer, 'rebind.pointer');
  if (forbiddenPointer(pointer)) fail('REBIND_AUTHORITY_OR_SCOPE_FIELD_FORBIDDEN', `${documentName}${pointer}`);
  const key = `${documentName}:${pointer}`;
  if (seen.has(key)) fail('DUPLICATE_REBIND_POINTER', key);
  seen.add(key);
  const target = documentName === 'operationRequest' ? document.operationRequest : document.constructionProcedure;
  const current = getAt(target, pointer);
  const mode = string(rebind.mode, 'rebind.mode');
  if (mode === 'REPLACE_VALUE_IF_EQUALS') {
    const from = string(rebind.from, 'rebind.from');
    const to = string(rebind.to, 'rebind.to');
    if (from !== oldHead || to !== newHead) fail('REBIND_MUST_BE_EXACT_GOVERNING_HEAD_REPLACEMENT', key);
    if (current !== from) fail('REBIND_SOURCE_MISMATCH', key);
    setAt(target, pointer, to);
    return { document: documentName, pointer, mode, from, to };
  }
  if (mode === 'REPLACE_SUBSTRING_EXACTLY_ONCE') {
    if (typeof current !== 'string') fail('REBIND_TARGET_NOT_STRING', key);
    const from = string(rebind.from, 'rebind.from');
    const to = string(rebind.to, 'rebind.to');
    const lower = oldHead;
    const upper = oldHead.toUpperCase();
    const valid = (from === lower && to === newHead) || (from === upper && to === newHead.toUpperCase());
    if (!valid) fail('REBIND_SUBSTRING_MUST_BE_EXACT_GOVERNING_HEAD_REPLACEMENT', key);
    const first = current.indexOf(from);
    const last = current.lastIndexOf(from);
    if (first < 0 || first !== last) fail('REBIND_SUBSTRING_NOT_EXACTLY_ONCE', key);
    setAt(target, pointer, `${current.slice(0, first)}${to}${current.slice(first + from.length)}`);
    return { document: documentName, pointer, mode, from, to };
  }
  fail('REBIND_MODE_INVALID', 'rebind.mode', mode);
}

function collectHeadOccurrences(root, oldHead, document, pointer = '') {
  const found = [];
  if (typeof root === 'string') {
    if (root.includes(oldHead) || root.includes(oldHead.toUpperCase())) found.push(`${document}:${pointer || '/'}`);
    return found;
  }
  if (Array.isArray(root)) {
    root.forEach((value, index) => found.push(...collectHeadOccurrences(value, oldHead, document, `${pointer}/${index}`)));
    return found;
  }
  if (root && typeof root === 'object') {
    for (const [key, value] of Object.entries(root)) {
      const escaped = key.replace(/~/g, '~0').replace(/\//g, '~1');
      found.push(...collectHeadOccurrences(value, oldHead, document, `${pointer}/${escaped}`));
    }
  }
  return found;
}

function sameStrings(a, b) {
  return JSON.stringify(a ?? null) === JSON.stringify(b ?? null);
}

function validateNoScopeExpansion(beforeRequest, afterRequest, beforeProcedure, afterProcedure) {
  if (afterRequest.projectId !== beforeRequest.projectId) fail('PROJECT_ID_EXPANSION_FORBIDDEN', 'operationRequest.projectId');
  if (afterRequest.lockScope !== beforeRequest.lockScope) fail('LOCK_SCOPE_CHANGE_FORBIDDEN', 'operationRequest.lockScope');
  if (!sameStrings(afterRequest.allowedPaths, beforeRequest.allowedPaths)) fail('ALLOWED_PATH_CHANGE_FORBIDDEN', 'operationRequest.allowedPaths');
  if (!sameStrings(afterRequest.prohibitedPaths, beforeRequest.prohibitedPaths)) fail('PROHIBITED_PATH_CHANGE_FORBIDDEN', 'operationRequest.prohibitedPaths');
  if (!sameStrings(afterProcedure.exactAllowedRepositoryPaths, beforeProcedure.exactAllowedRepositoryPaths)) fail('PROCEDURE_PATH_CHANGE_FORBIDDEN', 'constructionProcedure.exactAllowedRepositoryPaths');
  if (afterProcedure.operationClass !== beforeProcedure.operationClass) fail('OPERATION_CLASS_CHANGE_FORBIDDEN', 'constructionProcedure.operationClass');
  if (afterRequest.requestingAuthority?.authorityInherited !== false) fail('AUTHORITY_INHERITANCE_FORBIDDEN', 'operationRequest.requestingAuthority.authorityInherited');
  if (afterRequest.subjectIdentity && Object.hasOwn(afterRequest.subjectIdentity, 'authorityInherited') && afterRequest.subjectIdentity.authorityInherited !== false) {
    fail('SUBJECT_AUTHORITY_INHERITANCE_FORBIDDEN', 'operationRequest.subjectIdentity.authorityInherited');
  }
}

export function compileSuccessorPacket(raw) {
  const input = object(raw, '$');
  if (input.schema !== COMPILE_REQUEST_SCHEMA) fail('COMPILE_REQUEST_SCHEMA_MISMATCH', 'schema');
  const repository = string(input.repository, 'repository');
  const predecessor = object(input.predecessor, 'predecessor');
  const predecessorRequest = clone(object(predecessor.operationRequest, 'predecessor.operationRequest'));
  const predecessorProcedure = clone(object(predecessor.constructionProcedure, 'predecessor.constructionProcedure'));
  if (predecessorRequest.schema !== 'REPOSITORY_OPERATION_REQUEST_v1') fail('PREDECESSOR_REQUEST_SCHEMA_MISMATCH', 'predecessor.operationRequest.schema');
  if (predecessorProcedure.schema !== 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1') fail('PREDECESSOR_PROCEDURE_SCHEMA_MISMATCH', 'predecessor.constructionProcedure.schema');
  const predecessorGeneration = predecessor.lockGeneration;
  if (!Number.isInteger(predecessorGeneration) || predecessorGeneration < 1) fail('PREDECESSOR_GENERATION_INVALID', 'predecessor.lockGeneration');
  const oldHead = sha(predecessor.governingHead, 'predecessor.governingHead');
  if (predecessorRequest.exactGoverningHead !== oldHead) fail('PREDECESSOR_REQUEST_HEAD_MISMATCH', 'predecessor.operationRequest.exactGoverningHead');
  if (predecessorProcedure.exactGoverningHead !== oldHead) fail('PREDECESSOR_PROCEDURE_HEAD_MISMATCH', 'predecessor.constructionProcedure.exactGoverningHead');
  if (predecessor.operationId !== predecessorRequest.operationId) fail('PREDECESSOR_OPERATION_ID_MISMATCH', 'predecessor.operationId');
  if (predecessor.lockScope !== predecessorRequest.lockScope) fail('PREDECESSOR_SCOPE_MISMATCH', 'predecessor.lockScope');

  const successor = object(input.successor, 'successor');
  const newOperationId = string(successor.operationId, 'successor.operationId');
  if (newOperationId === predecessor.operationId) fail('SUCCESSOR_OPERATION_ID_MUST_CHANGE', 'successor.operationId');
  const newProcedureId = string(successor.procedureId, 'successor.procedureId');
  const newHead = sha(successor.exactGoverningHead, 'successor.exactGoverningHead');
  if (newHead === oldHead) fail('SUCCESSOR_HEAD_NOT_ADVANCED', 'successor.exactGoverningHead');
  const transitionId = string(successor.transitionId, 'successor.transitionId');
  const preservedEvidenceRefs = array(successor.preservedEvidenceRefs, 'successor.preservedEvidenceRefs').map((value, index) => string(value, `successor.preservedEvidenceRefs[${index}]`));
  if (new Set(preservedEvidenceRefs).size !== preservedEvidenceRefs.length) fail('DUPLICATE_PRESERVED_EVIDENCE_REF', 'successor.preservedEvidenceRefs');

  const operationRequest = clone(predecessorRequest);
  const constructionProcedure = clone(predecessorProcedure);
  operationRequest.operationId = newOperationId;
  constructionProcedure.procedureId = newProcedureId;
  operationRequest.constructionProcedureLocator = `INLINE:${newProcedureId}`;
  const document = { operationRequest, constructionProcedure };
  const seen = new Set();
  const appliedRebinds = array(successor.rebinds, 'successor.rebinds').map((rebind) => applyRebind(document, rebind, oldHead, newHead, seen));
  const mandatory = new Set([
    'operationRequest:/exactGoverningHead',
    'constructionProcedure:/exactGoverningHead'
  ]);
  for (const key of mandatory) if (!seen.has(key)) fail('MANDATORY_HEAD_REBIND_MISSING', key);

  const leftovers = [
    ...collectHeadOccurrences(operationRequest, oldHead, 'operationRequest'),
    ...collectHeadOccurrences(constructionProcedure, oldHead, 'constructionProcedure')
  ];
  if (leftovers.length) fail('UNDECLARED_PREDECESSOR_HEAD_BINDING_REMAINS', 'successor.rebinds', leftovers.join(','));
  if (operationRequest.exactGoverningHead !== newHead || constructionProcedure.exactGoverningHead !== newHead) fail('SUCCESSOR_HEAD_REBIND_FAILED', 'exactGoverningHead');
  validateNoScopeExpansion(predecessorRequest, operationRequest, predecessorProcedure, constructionProcedure);

  const transition = {
    schema: TRANSITION_SCHEMA,
    transitionId,
    reasonCode: 'GOVERNING_HEAD_ADVANCED',
    governingRef: GOVERNING_REF,
    authorityPolicy: AUTHORITY_POLICY,
    evidencePolicy: EVIDENCE_POLICY,
    predecessor: {
      operationId: predecessor.operationId,
      lockScope: predecessor.lockScope,
      lockGeneration: predecessorGeneration,
      governingHead: oldHead
    },
    successor: {
      operationId: newOperationId,
      lockScope: predecessor.lockScope,
      governingHead: newHead
    },
    inheritedAuthority: [],
    preservedEvidenceRefs
  };
  const compilerReceipt = {
    schema: COMPILER_RECEIPT_SCHEMA,
    result: 'PASS_CLOSED',
    repository,
    predecessorOperationId: predecessor.operationId,
    predecessorLockGeneration: predecessorGeneration,
    predecessorGoverningHead: oldHead,
    successorOperationId: newOperationId,
    successorGoverningHead: newHead,
    rebindCount: appliedRebinds.length,
    appliedRebinds,
    exactScopePreserved: true,
    authorityInherited: false,
    predecessorEvidenceRelabeledAsSuccessorEvidence: false,
    freshOperationIdRequired: true,
    freshProcedureIdRequired: true,
    existingSuccessorGateStillRequired: true
  };
  return {
    schema: COMPILED_PACKET_SCHEMA,
    repository,
    operationRequest,
    constructionProcedure,
    transition,
    compilerReceipt
  };
}

function parseArgs(argv) {
  const args = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith('--')) continue;
    const key = argv[i].slice(2);
    const value = argv[i + 1];
    if (!value || value.startsWith('--')) fail('CLI_ARGUMENT_MISSING_VALUE', key);
    args[key] = value;
    i += 1;
  }
  return args;
}

function main() {
  const args = parseArgs(process.argv.slice(2));
  const inputPath = string(args.input, '--input');
  const outputPath = string(args.output, '--output');
  const input = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
  const result = compileSuccessorPacket(input);
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, `${JSON.stringify(result, null, 2)}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
