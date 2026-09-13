#!/usr/bin/env node
// Structural and provided-observation comparison only. This module has no
// credential, trusted host channel, signing key, execution or admission power.
import {createHash} from 'node:crypto';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

export const RECORD_SCHEMA = 'CANONICAL_NATIVE_AGENT_EXECUTION_EVIDENCE_v1';
export const CHECK_SCHEMA = 'CANONICAL_NATIVE_AGENT_EVIDENCE_CHECK_v1';
export const TASK_CLASSES = Object.freeze(['MATERIAL_GOVERNED_ENGINEERING', 'STATIC_EDITORIAL_MICRO', 'BOUNDED_PAGE_RELEASE', 'READ_ONLY_ADMINISTRATIVE', 'SOURCE_READBACK', 'DIAGNOSTIC', 'QUALIFICATION', 'ADOPTION', 'PUBLICATION', 'CONTROL_PLANE']);
export const CANONICAL_IDENTITIES = Object.freeze({N: 'Alaric', E: 'Elara', S: 'Tarian', W: 'Soren'});
// The order is the frozen constitution's N,E,S,W basis, not a new identity.
export const STATION_IDENTITIES = Object.freeze(Object.fromEntries(Object.entries({
  N: ['Alaric'], NNE: ['Alaric', 'Elara'], NE: ['Alaric', 'Elara'], ENE: ['Alaric', 'Elara'],
  E: ['Elara'], ESE: ['Elara', 'Tarian'], SE: ['Elara', 'Tarian'], SSE: ['Elara', 'Tarian'],
  S: ['Tarian'], SSW: ['Tarian', 'Soren'], SW: ['Tarian', 'Soren'], WSW: ['Tarian', 'Soren'],
  W: ['Soren'], WNW: ['Alaric', 'Soren'], NW: ['Alaric', 'Soren'], NNW: ['Alaric', 'Soren']
}).map(([bearing, identities]) => [bearing, Object.freeze(identities)])));
const SHA256 = /^[a-f0-9]{64}$/;
const GIT_HEAD = /^[a-f0-9]{40}$/;
const NATIVE_TOOLS = new Set(['collaboration.spawn_agent', 'collaboration.followup_task']);
const STATES = new Set(['RUNNING', 'COMPLETED', 'FAILED']);
const BINDINGS = ['taskId', 'operationId', 'governingHead', 'taskClass'];

function fail(code, field) { const error = new Error(`${code}:${field}`); Object.assign(error, {code, field}); throw error; }
function object(value, field) { if (!value || typeof value !== 'object' || Array.isArray(value) || ![Object.prototype, null].includes(Object.getPrototypeOf(value))) fail('SCHEMA_INVALID', field); return value; }
function nonempty(value, field) { if (typeof value !== 'string' || !value.trim()) fail('SCHEMA_INVALID', field); return value; }
function keys(value, required, optional, field) {
  object(value, field);
  for (const key of required) if (!Object.hasOwn(value, key)) fail('MISSING_EVIDENCE', `${field}.${key}`);
  for (const key of Object.keys(value)) if (!required.includes(key) && !optional.includes(key)) fail('UNSUPPORTED_EVIDENCE_FIELD', `${field}.${key}`);
}

// Reject non-JSON values instead of normalizing undefined, NaN or sparse arrays
// into a different assignment. Canonicalization is integrity, not authenticity.
export function canonicalJson(value) {
  const visited = new Set();
  function encode(item) {
    if (item === null || typeof item === 'string' || typeof item === 'boolean') return JSON.stringify(item);
    if (typeof item === 'number' && Number.isFinite(item)) return JSON.stringify(item);
    if (typeof item !== 'object' || visited.has(item)) fail('SCHEMA_INVALID', 'canonicalJson');
    visited.add(item);
    let encoded;
    if (Array.isArray(item)) {
      if (Object.keys(item).length !== item.length) fail('SCHEMA_INVALID', 'canonicalJson.array');
      encoded = '[' + Array.from(item, encode).join(',') + ']';
    } else {
      object(item, 'canonicalJson.object');
      encoded = '{' + Object.keys(item).sort().map(key => JSON.stringify(key) + ':' + encode(item[key])).join(',') + '}';
    }
    visited.delete(item);
    return encoded;
  }
  return encode(value);
}
export function sha256Text(text) { if (typeof text !== 'string') fail('SCHEMA_INVALID', 'sha256Text'); return createHash('sha256').update(text, 'utf8').digest('hex'); }
export function sha256Canonical(value) { return sha256Text(canonicalJson(value)); }
function same(actual, expected, code, field) { if (canonicalJson(actual) !== canonicalJson(expected)) fail(code, field); }
function digest(value, field) { if (typeof value !== 'string' || !SHA256.test(value)) fail('MALFORMED_DIGEST', field); }

function validateAssignment(assignment) {
  keys(assignment, ['packetId', 'bearing', 'canonicalIdentities', 'objective', 'authority', 'unresolvedConditions', 'context'], [], 'assignment');
  nonempty(assignment.packetId, 'assignment.packetId');
  nonempty(assignment.objective, 'assignment.objective');
  if (!Object.hasOwn(STATION_IDENTITIES, assignment.bearing)) fail('CANONICAL_IDENTITY_MISMATCH', 'assignment.bearing');
  same(assignment.canonicalIdentities, STATION_IDENTITIES[assignment.bearing], 'CANONICAL_IDENTITY_MISMATCH', 'assignment.canonicalIdentities');
  object(assignment.authority, 'assignment.authority');
  if (Object.keys(assignment.authority).length === 0) fail('MISSING_EVIDENCE', 'assignment.authority');
  if (!Array.isArray(assignment.unresolvedConditions)) fail('SCHEMA_INVALID', 'assignment.unresolvedConditions');
  assignment.unresolvedConditions.forEach((condition, index) => nonempty(condition, `assignment.unresolvedConditions.${index}`));
  keys(assignment.context, ['repository', 'R', 'L', 'D', 'requiredOutput', 'evidenceRefs', 'prohibitedAuthority', 'handoff'], [], 'assignment.context');
  for (const field of ['repository', 'requiredOutput']) nonempty(assignment.context[field], `assignment.context.${field}`);
  for (const field of ['R', 'L', 'D', 'handoff']) {
    object(assignment.context[field], `assignment.context.${field}`);
    if (Object.keys(assignment.context[field]).length === 0) fail('MISSING_EVIDENCE', `assignment.context.${field}`);
  }
  for (const field of ['evidenceRefs', 'prohibitedAuthority']) {
    if (!Array.isArray(assignment.context[field])) fail('SCHEMA_INVALID', `assignment.context.${field}`);
    assignment.context[field].forEach((value, index) => nonempty(value, `assignment.context.${field}.${index}`));
  }
  canonicalJson(assignment);
}

function structure(receipt, expectedAssignment) {
  keys(receipt, ['schema', ...BINDINGS, 'assignment', 'assignmentSha256', 'nativeTaskId', 'invocation', 'state', 'output', 'observer'], ['failure', 'disposition'], 'receipt');
  if (receipt.schema !== RECORD_SCHEMA) fail('ROUTE_ONLY_OR_UNSUPPORTED_RECEIPT', 'schema');
  nonempty(receipt.taskId, 'taskId');
  if (typeof receipt.governingHead !== 'string' || !GIT_HEAD.test(receipt.governingHead)) fail('GOVERNING_HEAD_MISMATCH', 'governingHead');
  if (!TASK_CLASSES.includes(receipt.taskClass)) fail('TASK_CLASS_INVALID', 'taskClass');
  if (receipt.operationId !== null) nonempty(receipt.operationId, 'operationId');
  if (receipt.taskClass === 'MATERIAL_GOVERNED_ENGINEERING' && receipt.operationId === null) fail('MISSING_EVIDENCE', 'operationId');
  validateAssignment(receipt.assignment);
  digest(receipt.assignmentSha256, 'assignmentSha256');
  same(receipt.assignmentSha256, sha256Canonical(receipt.assignment), 'ASSIGNMENT_MISMATCH', 'assignmentSha256');
  nonempty(receipt.nativeTaskId, 'nativeTaskId');
  keys(receipt.invocation, ['tool', 'eventRef', 'returnedTaskId'], [], 'invocation');
  if (!NATIVE_TOOLS.has(receipt.invocation.tool)) fail('NATIVE_INVOCATION_MISSING', 'invocation.tool');
  nonempty(receipt.invocation.eventRef, 'invocation.eventRef');
  same(receipt.invocation.returnedTaskId, receipt.nativeTaskId, 'TASK_ID_MISMATCH', 'invocation.returnedTaskId');
  if (!STATES.has(receipt.state)) fail('STATE_INVALID', 'state');
  if (receipt.output !== null) {
    keys(receipt.output, ['text', 'sha256', 'sourceEventRef'], [], 'output');
    nonempty(receipt.output.text, 'output.text');
    nonempty(receipt.output.sourceEventRef, 'output.sourceEventRef');
    if (receipt.output.sourceEventRef === receipt.invocation.eventRef) fail('SOURCE_EVENT_MISMATCH', 'output.sourceEventRef');
    digest(receipt.output.sha256, 'output.sha256');
    same(receipt.output.sha256, sha256Text(receipt.output.text), 'OUTPUT_MISMATCH', 'output.sha256');
  }
  if (receipt.observer !== null) {
    keys(receipt.observer, ['nativeTaskId', 'sourceEventRef'], [], 'observer');
    nonempty(receipt.observer.nativeTaskId, 'observer.nativeTaskId');
    nonempty(receipt.observer.sourceEventRef, 'observer.sourceEventRef');
    if (receipt.observer.nativeTaskId === receipt.nativeTaskId) fail('INDEPENDENCE_FAILURE', 'observer.nativeTaskId');
    if ([receipt.invocation.eventRef, receipt.output?.sourceEventRef].includes(receipt.observer.sourceEventRef)) fail('INDEPENDENCE_FAILURE', 'observer.sourceEventRef');
  }
  if (receipt.state === 'COMPLETED' && (receipt.output === null || receipt.observer === null)) fail('MISSING_EVIDENCE', receipt.output === null ? 'output' : 'observer');
  if (receipt.state === 'RUNNING' && (receipt.output !== null || receipt.observer !== null)) fail('STATE_EVIDENCE_MISMATCH', 'state');
  if (receipt.state === 'FAILED') {
    keys(receipt.failure, ['code', 'detail', 'sourceEventRef'], [], 'failure');
    for (const field of ['code', 'detail', 'sourceEventRef']) nonempty(receipt.failure[field], `failure.${field}`);
  } else if (receipt.failure !== undefined && receipt.failure !== null) fail('STATE_EVIDENCE_MISMATCH', 'failure');
  if (receipt.disposition !== undefined && !['PRESERVE', 'RELEASE_ONLY'].includes(receipt.disposition)) fail('AUTHORITY_EFFECT_NONZERO', 'disposition');
  if (receipt.disposition === 'RELEASE_ONLY' && receipt.state !== 'FAILED') fail('STATE_EVIDENCE_MISMATCH', 'disposition');
  if (expectedAssignment !== null) {
    keys(expectedAssignment, [...BINDINGS, 'assignment', 'assignmentSha256'], ['nativeTaskId'], 'expectedAssignment');
    for (const field of BINDINGS) same(receipt[field], expectedAssignment[field], field === 'governingHead' ? 'GOVERNING_HEAD_MISMATCH' : 'ASSIGNMENT_MISMATCH', field);
    same(receipt.assignment, expectedAssignment.assignment, 'ASSIGNMENT_MISMATCH', 'assignment');
    same(receipt.assignmentSha256, expectedAssignment.assignmentSha256, 'ASSIGNMENT_MISMATCH', 'assignmentSha256');
    if (Object.hasOwn(expectedAssignment, 'nativeTaskId')) same(receipt.nativeTaskId, expectedAssignment.nativeTaskId, 'TASK_ID_MISMATCH', 'nativeTaskId');
  }
}

function result(receipt, code, error = null, expectedAssignment = null) {
  return {
    schema: CHECK_SCHEMA,
    result: code,
    errorCode: error?.code ?? null,
    field: error?.field ?? null,
    taskId: typeof receipt?.taskId === 'string' ? receipt.taskId : null,
    operationId: typeof receipt?.operationId === 'string' ? receipt.operationId : null,
    governingHead: typeof receipt?.governingHead === 'string' ? receipt.governingHead : null,
    state: STATES.has(receipt?.state) ? receipt.state : null,
    assignmentBinding: expectedAssignment === null ? 'NO_INDEPENDENT_EXPECTATION' : 'PROVIDED_EXPECTATION_ONLY',
    executionAuthenticity: 'UNVERIFIED_REQUIRES_NATIVE_HOST_SOURCE_READBACK',
    actualInvocationProved: false,
    workAuthorized: false,
    authorityEffect: 'NONE',
    authorityPreserved: error ? null : JSON.parse(canonicalJson(receipt.assignment.authority)),
    unresolvedConditionsPreserved: error ? null : [...receipt.assignment.unresolvedConditions],
    dispositionRequested: error ? null : receipt.disposition ?? 'PRESERVE',
    hostResponsibility: 'A distinct observer must read the actual native invocation and returned output from the host, bind them to this assignment and exact head, and apply existing admission. Supplied JSON and this module cannot establish source authenticity or grant authority.'
  };
}

export function validateReceipt(receipt, {expectedAssignment = null} = {}) {
  try { structure(receipt, expectedAssignment); return result(receipt, 'STRUCTURE_VALID_EXECUTION_UNVERIFIED', null, expectedAssignment); }
  catch (error) { return result(receipt, 'INVALID_EVIDENCE', {code: error.code ?? 'SCHEMA_INVALID', field: error.field ?? 'receipt'}, expectedAssignment); }
}

// Every observation below is caller-supplied data, even when a field says it was
// read from a tool. A caller can manufacture mutually consistent observations.
// This comparison deliberately NEVER returns EXECUTION_PROVEN or authorization.
export function compareReadback(receipt, observations, {expectedAssignment = null} = {}) {
  const check = validateReceipt(receipt, {expectedAssignment});
  if (check.result === 'INVALID_EVIDENCE') return check;
  try {
    keys(observations, ['assignmentObservation', 'invocationObservation', 'outputObservation', 'observerObservation'], [], 'observations');
    const {assignmentObservation: assignment, invocationObservation: invocation, outputObservation: output, observerObservation: observer} = observations;
    keys(assignment, ['sourceEventRef', ...BINDINGS, 'assignment', 'assignmentSha256', 'nativeTaskId'], [], 'assignmentObservation');
    nonempty(assignment.sourceEventRef, 'assignmentObservation.sourceEventRef');
    for (const field of [...BINDINGS, 'assignment', 'assignmentSha256', 'nativeTaskId']) same(assignment[field], receipt[field], field === 'governingHead' ? 'GOVERNING_HEAD_MISMATCH' : 'ASSIGNMENT_MISMATCH', `assignmentObservation.${field}`);
    keys(invocation, ['sourceEventRef', 'tool', 'returnedTaskId', 'taskId', 'operationId', 'governingHead', 'assignmentSha256', 'state'], ['failureSourceEventRef'], 'invocationObservation');
    same(invocation.sourceEventRef, receipt.invocation.eventRef, 'SOURCE_EVENT_MISMATCH', 'invocationObservation.sourceEventRef');
    same(invocation.tool, receipt.invocation.tool, 'NATIVE_INVOCATION_MISSING', 'invocationObservation.tool');
    same(invocation.returnedTaskId, receipt.nativeTaskId, 'TASK_ID_MISMATCH', 'invocationObservation.returnedTaskId');
    for (const field of ['taskId', 'operationId', 'governingHead', 'assignmentSha256', 'state']) same(invocation[field], receipt[field], field === 'governingHead' ? 'GOVERNING_HEAD_MISMATCH' : 'ASSIGNMENT_MISMATCH', `invocationObservation.${field}`);
    if (receipt.state === 'FAILED') same(invocation.failureSourceEventRef, receipt.failure.sourceEventRef, 'SOURCE_EVENT_MISMATCH', 'invocationObservation.failureSourceEventRef');
    if (receipt.output === null) same(output, null, 'OUTPUT_MISMATCH', 'outputObservation');
    else {
      keys(output, ['sourceEventRef', 'nativeTaskId', 'taskId', 'assignmentSha256', 'state', 'text', 'sha256'], [], 'outputObservation');
      for (const field of ['nativeTaskId', 'taskId', 'assignmentSha256', 'state']) same(output[field], receipt[field], 'OUTPUT_MISMATCH', `outputObservation.${field}`);
      for (const field of ['sourceEventRef', 'text', 'sha256']) same(output[field], receipt.output[field], 'OUTPUT_MISMATCH', `outputObservation.${field}`);
    }
    if (receipt.observer === null) same(observer, null, 'INDEPENDENCE_FAILURE', 'observerObservation');
    else {
      keys(observer, ['sourceEventRef', 'nativeTaskId', 'observedNativeTaskId', 'taskId', 'assignmentSha256', 'invocationEventRef', 'outputEventRef', 'outputSha256'], [], 'observerObservation');
      for (const field of ['sourceEventRef', 'nativeTaskId']) same(observer[field], receipt.observer[field], 'INDEPENDENCE_FAILURE', `observerObservation.${field}`);
      same(observer.observedNativeTaskId, receipt.nativeTaskId, 'TASK_ID_MISMATCH', 'observerObservation.observedNativeTaskId');
      for (const field of ['taskId', 'assignmentSha256']) same(observer[field], receipt[field], 'ASSIGNMENT_MISMATCH', `observerObservation.${field}`);
      same(observer.invocationEventRef, receipt.invocation.eventRef, 'SOURCE_EVENT_MISMATCH', 'observerObservation.invocationEventRef');
      same(observer.outputEventRef, receipt.output?.sourceEventRef ?? null, 'OUTPUT_MISMATCH', 'observerObservation.outputEventRef');
      same(observer.outputSha256, receipt.output?.sha256 ?? null, 'OUTPUT_MISMATCH', 'observerObservation.outputSha256');
    }
    return {...check, result: 'MATCHES_PROVIDED_OBSERVATIONS'};
  } catch (error) { return result(receipt, 'PROVIDED_OBSERVATION_MISMATCH', {code: error.code ?? 'SCHEMA_INVALID', field: error.field ?? 'observations'}, expectedAssignment); }
}

export function runCli(argv, {readFile = filename => fs.readFileSync(filename, 'utf8'), write = text => process.stdout.write(text)} = {}) {
  let authorize = false;
  let receipt = null;
  try {
    const args = {};
    for (let index = 0; index < argv.length; index++) {
      const argument = argv[index];
      if (argument === '--authorize') { authorize = true; continue; }
      if (!['--input', '--expected', '--observations'].includes(argument) || !argv[index + 1] || argv[index + 1].startsWith('--') || Object.hasOwn(args, argument)) fail('SCHEMA_INVALID', 'argument');
      args[argument] = argv[++index];
    }
    if (!args['--input']) fail('SCHEMA_INVALID', 'input');
    receipt = JSON.parse(readFile(args['--input']));
    const options = {expectedAssignment: args['--expected'] ? JSON.parse(readFile(args['--expected'])) : null};
    const check = args['--observations'] ? compareReadback(receipt, JSON.parse(readFile(args['--observations'])), options) : validateReceipt(receipt, options);
    const invalid = !['STRUCTURE_VALID_EXECUTION_UNVERIFIED', 'MATCHES_PROVIDED_OBSERVATIONS'].includes(check.result);
    // File-only CLI does not upgrade the structural disposition even when the
    // caller supplies a second file that agrees with its first file.
    const cliCheck = check.result === 'MATCHES_PROVIDED_OBSERVATIONS' ? {...check, result: 'STRUCTURE_VALID_EXECUTION_UNVERIFIED', providedObservationComparison: 'MATCHES_PROVIDED_OBSERVATIONS'} : check;
    if (authorize) cliCheck.authorizationAttempt = 'REJECTED_SOURCE_AUTHENTICITY_UNPROVABLE_FROM_FILES';
    write(JSON.stringify(cliCheck, null, 2) + '\n');
    return authorize ? 2 : invalid ? 1 : 0;
  } catch (error) {
    write(JSON.stringify(result(receipt, 'INVALID_EVIDENCE', {code: error.code ?? 'SCHEMA_INVALID', field: error.field ?? 'input'}), null, 2) + '\n');
    return authorize ? 2 : 1;
  }
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) process.exitCode = runCli(process.argv.slice(2));
