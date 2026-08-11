#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import cp from 'node:child_process';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../..');
const REGISTRY_PATH = path.join(ROOT, '.github/ai-router/bounded-exact-head-execution-carrier/registry.v1.json');
const LOCK_REF = 'refs/remotes/origin/operation-locks/repository-operation-intake-v1';
const LOCK_LEDGER_PATH = '.github/operation-intake/active-operation-ledger.v1.json';
const PAGE_TOOLSET_PATH = '.github/ai-router/page-excellence-toolchain/toolset.bundle.v1.json';
const REFERENCE_CLASS_VERIFIER_PATH = '.github/ai-router/reference-class-awards-admission/verify.v1.mjs';
const REFERENCE_CLASS_EVALUATOR_SELF_TEST_PATH = '.github/ai-router/reference-class-awards-admission/evaluator/self-test.v1.mjs';
const PAGE_GATE_PATH = '.github/ai-router/page-excellence-toolchain/page-operation-entry-gate.v1.mjs';
const GENERIC_PAGE_ARCHITECTURE_CLASS = 'PAGE_EXCELLENCE_ARCHITECTURE_FROM_CANONICAL_OPERATION_V1';
const GENERIC_PAGE_IMPLEMENTATION_CLASS = 'PAGE_EXCELLENCE_IMPLEMENTATION_FROM_CANONICAL_OPERATION_V1';
const GENERIC_PAGE_CLASSES = new Set([GENERIC_PAGE_ARCHITECTURE_CLASS, GENERIC_PAGE_IMPLEMENTATION_CLASS]);
const REQUIRED_IMPLEMENTATION_FINDINGS = [
  'CONTEXTUAL_ARCHITECTURE_BINDING_PRESERVED',
  'SEMANTIC_MARKUP',
  'FOCUS_MANAGEMENT',
  'KEYBOARD_MODEL',
  'STATE_RECOVERY',
  'BUNDLE_STRUCTURE',
  'RENDERING_STRATEGY',
  'SEARCH_AND_GRAPH_COMPLEXITY',
  'DEVICE_LAYOUT_RULES'
];
const REQUIRED_REQUEST_KEYS = ['schema','requestId','descriptorId','operationRequest','constructionProcedure','admissionReceipt','requestNonce'];
const FORBIDDEN_REQUEST_KEYS = ['command','shell','shellCommand','script','scriptBody','executable','arguments','extraArguments','environment','environmentOverride','paths','targetHead','workingDirectory','workflowOverride','architectureBundle','receiptBundle','pageReceiptBundle'];

export const stable = value => Array.isArray(value)
  ? value.map(stable)
  : value && typeof value === 'object'
    ? Object.fromEntries(Object.keys(value).sort().map(key => [key, stable(value[key])]))
    : value;
export const canonical = value => JSON.stringify(stable(value));
export const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');
export const hashObject = value => sha256(Buffer.from(canonical(value), 'utf8'));

function fail(code, detail = null) {
  const error = new Error(detail == null ? code : `${code}:${typeof detail === 'string' ? detail : JSON.stringify(detail)}`);
  error.code = code; error.detail = detail; throw error;
}
function assertObject(value, code) { if (!value || typeof value !== 'object' || Array.isArray(value)) fail(code); return value; }
function assertString(value, code) { if (typeof value !== 'string' || value.length === 0) fail(code); return value; }
function assertCommit(value, code) { if (!/^[0-9a-f]{40}$/.test(value ?? '')) fail(code, String(value)); return value; }
function assertDigest(value, code) { if (!/^[0-9a-f]{64}$/.test(value ?? '')) fail(code, String(value)); return value; }
function assertBlob(value, code) { return assertCommit(value, code); }
function assertRepositoryPath(value, code) {
  assertString(value, code);
  const normalized = value.replaceAll('\\', '/');
  if (normalized.startsWith('/') || normalized === '..' || normalized.startsWith('../') || normalized.includes('/../')) fail(code, value);
  if (!/^[A-Za-z0-9._/-]+$/.test(normalized)) fail(code, value);
  return normalized;
}
function assertClosedKeys(value, required, allowed, prefix) {
  assertObject(value, `${prefix}_OBJECT_REQUIRED`);
  for (const key of required) if (!Object.hasOwn(value, key)) fail(`${prefix}_MISSING_FIELD`, key);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) fail(`${prefix}_UNKNOWN_FIELD`, key);
}
function readJson(file) { return JSON.parse(fs.readFileSync(path.resolve(file), 'utf8')); }
function writeJson(file, value) {
  const target = path.resolve(file); fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${JSON.stringify(stable(value), null, 2)}\n`);
}
function execGit(args, cwd = ROOT, options = {}) {
  return cp.execFileSync('git', args, { cwd, encoding: options.encoding ?? 'utf8', maxBuffer: 32 * 1024 * 1024, stdio: options.stdio ?? ['ignore','pipe','pipe'] });
}
function parseArgs(argv) {
  const out = {};
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i]; if (!token.startsWith('--')) fail('UNKNOWN_ARGUMENT', token);
    const key = token.slice(2); if (Object.hasOwn(out, key)) fail('DUPLICATE_ARGUMENT', key);
    out[key] = argv[++i] ?? null;
  }
  return out;
}
function gitBlobSha(bytes) {
  return crypto.createHash('sha1').update(Buffer.concat([Buffer.from(`blob ${bytes.length}\0`), bytes])).digest('hex');
}

export function validateRequest(raw) {
  assertClosedKeys(raw, REQUIRED_REQUEST_KEYS, REQUIRED_REQUEST_KEYS, 'CARRIER_REQUEST');
  if (raw.schema !== 'BOUNDED_EXACT_HEAD_EXECUTION_REQUEST_v1') fail('REQUEST_SCHEMA_MISMATCH');
  for (const key of FORBIDDEN_REQUEST_KEYS) if (Object.hasOwn(raw, key)) fail('ARBITRARY_COMMAND_FIELD_PROHIBITED', key);
  if (!/^[0-9a-f]{64}$/.test(raw.requestNonce ?? '')) fail('REQUEST_NONCE_INVALID');
  return stable(raw);
}

function validateRegistry(registry) {
  assertObject(registry, 'REGISTRY_INVALID');
  if (registry.schema !== 'BOUNDED_EXECUTABLE_DESCRIPTOR_REGISTRY_v1') fail('REGISTRY_SCHEMA_MISMATCH');
  if (registry.closedWorld !== true || registry.arbitraryCommandAccepted !== false || registry.movingExecutableRefsAccepted !== false) fail('REGISTRY_NOT_FAIL_CLOSED');
  if (registry.status !== 'ACTIVE_RATIFIED_WHEN_ON_DEFAULT_BRANCH') fail('REGISTRY_STATUS_INVALID', registry.status);
  if (!Array.isArray(registry.descriptors) || registry.descriptors.length === 0) fail('REGISTRY_EMPTY');
}
function validateGenericPageDescriptor(descriptor) {
  if (descriptor.projectId !== 'REPOSITORY_AI_ROUTER_INFRASTRUCTURE') fail('GENERIC_PAGE_DESCRIPTOR_PROJECT_INVALID');
  if (descriptor.scriptPath !== PAGE_GATE_PATH || descriptor.mutationIntent !== true) fail('GENERIC_PAGE_DESCRIPTOR_INVALID');
  if (descriptor.targetHeadDerivation !== 'OPERATION_EXACT_GOVERNING_HEAD') fail('TARGET_HEAD_DERIVATION_UNSUPPORTED');
  if (descriptor.pageSubjectHeadDerivation !== 'SUBJECT_IDENTITY_PAGE_OPERATION_SUBJECT_HEAD_ELSE_FROZEN_AUTHORITY_HEAD') fail('PAGE_SUBJECT_HEAD_DERIVATION_UNSUPPORTED');
  if (descriptor.architectureFindingsDerivation !== 'OPERATION_SUBJECT_IDENTITY_PAGE_ARCHITECTURE_FINDINGS_EXACT') fail('ARCHITECTURE_FINDINGS_DERIVATION_UNSUPPORTED');
  if (descriptor.sourceIdentityDerivation !== 'OPERATION_SUBJECT_IDENTITY_EXISTING_CONSTRUCT_SEARCH_SOURCES_EXACT') fail('ARCHITECTURE_SOURCE_DERIVATION_UNSUPPORTED');
  if (descriptor.scriptBlobDerivation !== 'TARGET_HEAD_EXACT_BLOB') fail('PAGE_GATE_BLOB_DERIVATION_UNSUPPORTED');
  if (descriptor.executionClass === GENERIC_PAGE_ARCHITECTURE_CLASS) {
    if (descriptor.pagePhase !== 'ARCHITECTURE') fail('GENERIC_PAGE_DESCRIPTOR_INVALID');
  } else {
    if (descriptor.pagePhase !== 'IMPLEMENTATION') fail('GENERIC_PAGE_IMPLEMENTATION_DESCRIPTOR_INVALID');
    if (descriptor.implementationFindingsDerivation !== 'OPERATION_SUBJECT_IDENTITY_PAGE_IMPLEMENTATION_FINDINGS_EXACT') fail('IMPLEMENTATION_FINDINGS_DERIVATION_UNSUPPORTED');
    if (descriptor.architectureContinuityDerivation !== 'OPERATION_SUBJECT_IDENTITY_PAGE_ARCHITECTURE_CONTINUITY_EXACT') fail('ARCHITECTURE_CONTINUITY_DERIVATION_UNSUPPORTED');
  }
  for (const key of ['boundOperationId','boundLockGeneration','boundTargetHead','scriptBlob','architectureFindings','implementationFindings','receiptBundle']) {
    if (Object.hasOwn(descriptor, key)) fail('GENERIC_PAGE_DESCRIPTOR_MUST_NOT_BE_OPERATION_BOUND', key);
  }
}
function resolveDescriptor(registry, descriptorId) {
  validateRegistry(registry);
  const matches = registry.descriptors.filter(item => item.descriptorId === descriptorId);
  if (matches.length !== 1) fail(matches.length === 0 ? 'UNREGISTERED_EXECUTABLE' : 'EXECUTABLE_DESCRIPTOR_AMBIGUOUS');
  const descriptor = stable(matches[0]);
  if (descriptor.status !== 'ACTIVE_RATIFIED_WHEN_ON_DEFAULT_BRANCH') fail('DESCRIPTOR_NOT_ACTIVE', descriptor.status);
  if (descriptor.shell !== false || descriptor.extraArgumentsAllowed !== false || descriptor.environmentOverridesAllowed !== false || descriptor.callerSuppliedBundleAllowed !== false) fail('DESCRIPTOR_NOT_FAIL_CLOSED');
  if (descriptor.executable !== 'node') fail('DESCRIPTOR_EXECUTABLE_NOT_ALLOWED');
  if (descriptor.pathDerivation !== 'OPERATION_REQUEST_ALLOWED_PATHS_EXACT') fail('DESCRIPTOR_PATH_DERIVATION_UNSUPPORTED');
  if (descriptor.executionClass === 'ROUTER_MUTATION_V1') {
    if (descriptor.scriptPath !== 'tools/repository-ai-entry-router.mjs') fail('DESCRIPTOR_EXECUTABLE_NOT_ALLOWED');
  } else if (descriptor.executionClass === 'PAGE_EXCELLENCE_ARCHITECTURE_V1') {
    if (descriptor.scriptPath !== PAGE_GATE_PATH || descriptor.pagePhase !== 'ARCHITECTURE') fail('PAGE_PHASE_NOT_ALLOWED');
    assertBlob(descriptor.scriptBlob, 'PAGE_GATE_BLOB_INVALID');
    if (!Number.isInteger(descriptor.boundLockGeneration) || descriptor.boundLockGeneration < 1) fail('DESCRIPTOR_LOCK_BINDING_INVALID');
    assertCommit(descriptor.boundTargetHead, 'DESCRIPTOR_TARGET_HEAD_BINDING_INVALID');
    assertString(descriptor.boundOperationId, 'DESCRIPTOR_OPERATION_BINDING_INVALID');
  } else if (GENERIC_PAGE_CLASSES.has(descriptor.executionClass)) {
    validateGenericPageDescriptor(descriptor);
  } else if (descriptor.executionClass === 'REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1') {
    if (descriptor.scriptPath !== REFERENCE_CLASS_VERIFIER_PATH || descriptor.mutationIntent !== false) fail('REFERENCE_CLASS_VERIFIER_MUTATION_INTENT_PROHIBITED');
    assertBlob(descriptor.scriptBlob, 'REFERENCE_CLASS_VERIFIER_BLOB_INVALID');
    if (!Number.isInteger(descriptor.boundLockGeneration) || descriptor.boundLockGeneration < 1) fail('DESCRIPTOR_LOCK_BINDING_INVALID');
    assertCommit(descriptor.boundTargetHead, 'DESCRIPTOR_TARGET_HEAD_BINDING_INVALID'); assertString(descriptor.boundOperationId, 'DESCRIPTOR_OPERATION_BINDING_INVALID');
    if (canonical(descriptor.fixedArguments) !== canonical(['--verify-static'])) fail('REFERENCE_CLASS_VERIFIER_ARGUMENT_BINDING_INVALID');
    if (descriptor.targetHeadDerivation !== 'BOUND_DESCRIPTOR_TARGET_HEAD') fail('TARGET_HEAD_DERIVATION_UNSUPPORTED');
    if (descriptor.nativeReceiptSchema !== 'REFERENCE_CLASS_AWARDS_ADMISSION_STATIC_VERIFICATION_RECEIPT_v1' || descriptor.nativePassField !== 'result' || descriptor.nativePassValue !== 'PASS') fail('REFERENCE_CLASS_VERIFIER_NATIVE_RECEIPT_BINDING_INVALID');
  } else if (descriptor.executionClass === 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_V1') {
    if (descriptor.scriptPath !== REFERENCE_CLASS_EVALUATOR_SELF_TEST_PATH || descriptor.mutationIntent !== false) fail('REFERENCE_CLASS_EVALUATOR_MUTATION_INTENT_PROHIBITED');
    assertBlob(descriptor.scriptBlob, 'REFERENCE_CLASS_EVALUATOR_SELF_TEST_BLOB_INVALID');
    if (!Number.isInteger(descriptor.boundLockGeneration) || descriptor.boundLockGeneration < 1) fail('DESCRIPTOR_LOCK_BINDING_INVALID');
    assertCommit(descriptor.boundTargetHead, 'DESCRIPTOR_TARGET_HEAD_BINDING_INVALID'); assertString(descriptor.boundOperationId, 'DESCRIPTOR_OPERATION_BINDING_INVALID');
    if (canonical(descriptor.fixedArguments) !== canonical([])) fail('REFERENCE_CLASS_EVALUATOR_ARGUMENT_BINDING_INVALID');
    if (descriptor.targetHeadDerivation !== 'BOUND_DESCRIPTOR_TARGET_HEAD') fail('TARGET_HEAD_DERIVATION_UNSUPPORTED');
    if (descriptor.nativeReceiptSchema !== 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_RECEIPT_v1' || descriptor.nativePassField !== 'result' || descriptor.nativePassValue !== 'PASS') fail('REFERENCE_CLASS_EVALUATOR_NATIVE_RECEIPT_BINDING_INVALID');
  } else fail('DESCRIPTOR_EXECUTION_CLASS_UNSUPPORTED', descriptor.executionClass);
  return descriptor;
}

function validateOperationDocuments(request) {
  const op = assertObject(request.operationRequest, 'OPERATION_REQUEST_INVALID');
  const procedure = assertObject(request.constructionProcedure, 'CONSTRUCTION_PROCEDURE_INVALID');
  const admission = assertObject(request.admissionReceipt, 'ADMISSION_RECEIPT_INVALID');
  if (op.schema !== 'REPOSITORY_OPERATION_REQUEST_v1') fail('OPERATION_REQUEST_SCHEMA_MISMATCH');
  if (procedure.schema !== 'REPOSITORY_CONSTRUCTION_PROCEDURE_v1') fail('CONSTRUCTION_PROCEDURE_SCHEMA_MISMATCH');
  if (admission.schema !== 'REPOSITORY_OPERATION_ADMISSION_RECEIPT_v1' || admission.result !== 'ADMITTED_AND_LOCKED') fail('ADMISSION_NOT_ACTIVE');
  if (op.operationId !== admission.operationId || op.projectId !== admission.projectId) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH');
  if (op.exactGoverningHead !== procedure.exactGoverningHead) fail('GOVERNING_HEAD_MISMATCH');
  if (admission.operationStarted !== true || admission.workflowExecutionAuthorized !== true) fail('ADMISSION_EXECUTION_NOT_AUTHORIZED');
  const lock = assertObject(admission.lock, 'ADMISSION_LOCK_MISSING');
  if (lock.operationId !== op.operationId || lock.lockAcquired !== true) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH', 'admission.lock');
  if (!Number.isInteger(lock.lockGeneration) || lock.lockGeneration < 1) fail('LOCK_GENERATION_INVALID');
  assertDigest(lock.scopeHash, 'SCOPE_HASH_INVALID'); assertDigest(admission.requestDigest, 'REQUEST_DIGEST_INVALID'); assertDigest(admission.procedureLocatorDigest, 'PROCEDURE_DIGEST_INVALID');
  const allowed = Array.isArray(op.allowedPaths) ? op.allowedPaths.map(p => assertRepositoryPath(p, 'OPERATION_ALLOWED_PATH_INVALID')) : fail('OPERATION_ALLOWED_PATHS_INVALID');
  const procedureAllowed = Array.isArray(procedure.exactAllowedRepositoryPaths) ? procedure.exactAllowedRepositoryPaths.map(p => assertRepositoryPath(p, 'PROCEDURE_ALLOWED_PATH_INVALID')) : fail('PROCEDURE_ALLOWED_PATHS_INVALID');
  if (canonical([...allowed].sort()) !== canonical([...procedureAllowed].sort())) fail('REQUESTED_PATH_OUTSIDE_ADMITTED_SCOPE', 'operation/procedure path sets differ');
  return { op, procedure, admission, lock, allowedPaths: allowed };
}
function deriveTargetHead(op, descriptor) {
  let value;
  if (descriptor.targetHeadDerivation === 'SUBJECT_IDENTITY_REQUIRED_STARTING_HEAD_ELSE_EXACT_GOVERNING_HEAD') value = op.subjectIdentity?.requiredStartingHead ?? op.exactGoverningHead;
  else if (descriptor.targetHeadDerivation === 'BOUND_DESCRIPTOR_TARGET_HEAD') value = descriptor.boundTargetHead;
  else if (descriptor.targetHeadDerivation === 'OPERATION_EXACT_GOVERNING_HEAD') value = op.exactGoverningHead;
  else fail('TARGET_HEAD_DERIVATION_UNSUPPORTED');
  return assertCommit(value, 'TARGET_HEAD_NOT_AUTHORIZED');
}
function derivePageSubjectHead(op, descriptor, targetHead) {
  if (descriptor.executionClass === 'PAGE_EXCELLENCE_ARCHITECTURE_V1') return targetHead;
  if (!GENERIC_PAGE_CLASSES.has(descriptor.executionClass)) return null;
  return assertCommit(op.subjectIdentity?.pageOperationSubjectHead ?? op.subjectIdentity?.frozenAuthorityHead, 'PAGE_SUBJECT_HEAD_NOT_CANONICALLY_BOUND');
}
function deriveTask(op, descriptor) {
  if (descriptor.taskDerivation !== 'SUBJECT_IDENTITY_EXPERIMENT_ID_UPPERCASE_ELSE_OPERATION_ID') fail('TASK_DERIVATION_UNSUPPORTED');
  const raw = typeof op.subjectIdentity?.experimentId === 'string' && op.subjectIdentity.experimentId.length ? op.subjectIdentity.experimentId.toUpperCase() : op.operationId;
  if (!/^[A-Z0-9_.:-]+$/.test(raw)) fail('DERIVED_TASK_INVALID', raw);
  return raw;
}
function declaredSourceIdentitySet(op) {
  const sources = op.subjectIdentity?.existingConstructSearchSources;
  if (!Array.isArray(sources) || sources.length === 0) fail('ARCHITECTURE_SOURCE_DECLARATIONS_MISSING');
  const set = new Set();
  for (const source of sources) {
    assertCommit(source.commitSha, 'ARCHITECTURE_SOURCE_COMMIT_INVALID');
    if (!Array.isArray(source.files) || source.files.length === 0) fail('ARCHITECTURE_SOURCE_FILES_MISSING');
    for (const file of source.files) set.add(`${assertRepositoryPath(file.path,'ARCHITECTURE_SOURCE_PATH_INVALID')}|${source.commitSha}|${assertBlob(file.gitBlobSha,'ARCHITECTURE_SOURCE_BLOB_INVALID')}`);
  }
  return set;
}
function validateExistingSourceAdoption(findings, op) {
  const declared = declaredSourceIdentitySet(op);
  if (!Array.isArray(findings.exactSourceConstructIdentities) || findings.exactSourceConstructIdentities.length === 0) fail('ARCHITECTURE_SOURCE_IDENTITIES_MISSING');
  const ids = new Set();
  for (const source of findings.exactSourceConstructIdentities) {
    assertString(source.sourceId,'ARCHITECTURE_SOURCE_ID_INVALID');
    const p = assertRepositoryPath(source.path,'ARCHITECTURE_SOURCE_PATH_INVALID'), commit = assertCommit(source.commitSha,'ARCHITECTURE_SOURCE_COMMIT_INVALID'), blob = assertBlob(source.gitBlobSha,'ARCHITECTURE_SOURCE_BLOB_INVALID');
    if (source.adoptionDisposition !== 'ADOPT_IMPLEMENTATION_SOURCE') fail('ARCHITECTURE_SOURCE_DISPOSITION_INVALID');
    if (!declared.has(`${p}|${commit}|${blob}`)) fail('ARCHITECTURE_SOURCE_IDENTITY_MISMATCH', source.sourceId);
    ids.add(source.sourceId);
  }
  if (!Array.isArray(findings.adoptionMatrix) || findings.adoptionMatrix.length !== ids.size) fail('ARCHITECTURE_ADOPTION_MATRIX_INVALID');
  for (const row of findings.adoptionMatrix) {
    if (!ids.has(row.sourceId)) fail('ARCHITECTURE_ADOPTION_SOURCE_UNBOUND',row.sourceId);
    if (row.sourceRelation === 'INSPIRATION_ONLY') fail('ARCHITECTURE_INSPIRATION_SUBSTITUTION_PROHIBITED',row.sourceId);
    if (!Array.isArray(row.adoptedCapabilities) || row.adoptedCapabilities.length === 0 || !Array.isArray(row.adaptations) || !Array.isArray(row.exclusions)) fail('ARCHITECTURE_ADOPTION_MATRIX_INVALID',row.sourceId);
  }
  if (findings.visualArchitectureAuthority?.contentAdapterMayDefineVisualArchitecture !== false) fail('ADAPTER_VISUAL_ARCHITECTURE_AUTHORITY_PROHIBITED');
  if (!['EXISTING_SOURCE_CONSTRUCTS','EXISTING_SOURCE_CONSTRUCTS_WITH_BOUNDED_ADAPTER'].includes(findings.visualArchitectureAuthority?.authorityHolder)) fail('VISUAL_ARCHITECTURE_AUTHORITY_INVALID');
  if (findings.separateNewConstructAuthority !== null) fail('UNEXPECTED_NEW_CONSTRUCT_AUTHORITY');
}
function validateArchitectureFindingsCommon(findings) {
  assertObject(findings,'ARCHITECTURE_FINDINGS_MISSING');
  if (findings.schema !== 'CONTEXTUAL_ARCHITECTURE_FINDINGS_v1') fail('ARCHITECTURE_FINDINGS_SCHEMA_MISMATCH');
  if (!['EXISTING_CONSTRUCT_ADOPTION','NEW_CONSTRUCT_SEPARATELY_AUTHORIZED','NONVISUAL_CONTENT_ONLY'].includes(findings.implementationClass)) fail('ARCHITECTURE_IMPLEMENTATION_CLASS_NOT_ALLOWED');
  assertString(findings.classificationRationale,'ARCHITECTURE_CLASSIFICATION_RATIONALE_MISSING');
  if (findings.existingConstructSearch?.executed !== true || !Array.isArray(findings.existingConstructSearch?.searchedScopes) || !findings.existingConstructSearch.searchedScopes.length) fail('EXISTING_CONSTRUCT_SEARCH_INCOMPLETE');
  if (!Array.isArray(findings.prohibitedSubstituteArchitectures) || !findings.prohibitedSubstituteArchitectures.length) fail('PROHIBITED_SUBSTITUTE_ARCHITECTURES_MISSING');
  if (!Array.isArray(findings.requiredRuntimeConditions) || !findings.requiredRuntimeConditions.length) fail('REQUIRED_RUNTIME_CONDITIONS_MISSING');
  if (!findings.visualArchitectureAuthority || typeof findings.visualArchitectureAuthority.contentAdapterMayDefineVisualArchitecture !== 'boolean' || typeof findings.visualArchitectureAuthority.authorityHolder !== 'string' || !findings.visualArchitectureAuthority.authorityHolder.length) fail('VISUAL_ARCHITECTURE_AUTHORITY_INVALID');
}
export function validatePageArchitectureDescriptor(descriptor, docs, targetHead) {
  if (descriptor.executionClass !== 'PAGE_EXCELLENCE_ARCHITECTURE_V1') fail('PAGE_DESCRIPTOR_REQUIRED');
  if (descriptor.projectId !== docs.op.projectId || descriptor.boundOperationId !== docs.op.operationId || descriptor.boundLockGeneration !== docs.lock.lockGeneration || descriptor.boundTargetHead !== targetHead) fail('DESCRIPTOR_OPERATION_BINDING_MISMATCH');
  const findings = stable(descriptor.architectureFindings); validateArchitectureFindingsCommon(findings);
  if (findings.implementationClass !== 'EXISTING_CONSTRUCT_ADOPTION') fail('ARCHITECTURE_IMPLEMENTATION_CLASS_NOT_ALLOWED');
  validateExistingSourceAdoption(findings, docs.op); return findings;
}
export function validateCanonicalPageArchitectureFindings(descriptor, docs) {
  if (!GENERIC_PAGE_CLASSES.has(descriptor.executionClass)) fail('GENERIC_PAGE_DESCRIPTOR_REQUIRED');
  const findings = stable(docs.op.subjectIdentity?.pageArchitectureFindings); validateArchitectureFindingsCommon(findings);
  if (findings.implementationClass === 'EXISTING_CONSTRUCT_ADOPTION') validateExistingSourceAdoption(findings, docs.op);
  else if (findings.implementationClass === 'NEW_CONSTRUCT_SEPARATELY_AUTHORIZED') {
    const grant = findings.separateNewConstructAuthority;
    if (!grant || typeof grant.authorityId !== 'string' || !grant.authorityId.length) fail('NEW_CONSTRUCT_AUTHORITY_MISSING');
    assertCommit(grant.exactGoverningHead,'NEW_CONSTRUCT_AUTHORITY_MISSING');
    if (findings.visualArchitectureAuthority.contentAdapterMayDefineVisualArchitecture !== false) fail('ADAPTER_VISUAL_ARCHITECTURE_AUTHORITY_PROHIBITED');
  } else if (findings.visualArchitectureAuthority.authorityHolder !== 'NONE' || findings.visualArchitectureAuthority.contentAdapterMayDefineVisualArchitecture !== false) fail('VISUAL_ARCHITECTURE_AUTHORITY_INVALID');
  return findings;
}
export function validateImplementationFindings(raw) {
  assertObject(raw,'IMPLEMENTATION_FINDINGS_MISSING');
  if (raw.schema !== 'PAGE_EXCELLENCE_IMPLEMENTATION_FINDINGS_v1') fail('IMPLEMENTATION_FINDINGS_SCHEMA_MISMATCH');
  const findings = assertObject(raw.findings,'IMPLEMENTATION_FINDINGS_MISSING');
  const keys = Object.keys(findings).sort(), expected = [...REQUIRED_IMPLEMENTATION_FINDINGS].sort();
  if (canonical(keys) !== canonical(expected)) fail('IMPLEMENTATION_FINDINGS_KEYSET_INVALID',{expected,observed:keys});
  for (const key of REQUIRED_IMPLEMENTATION_FINDINGS) {
    const value = assertObject(findings[key],`IMPLEMENTATION_FINDING_INVALID:${key}`);
    assertClosedKeys(value,['result','evidence'],['result','evidence'],`IMPLEMENTATION_FINDING_${key}`);
    if (value.result !== 'PASS') fail('IMPLEMENTATION_FINDING_NONPASS',key);
    if (!Array.isArray(value.evidence) || value.evidence.length === 0 || value.evidence.some(item => typeof item !== 'string' || !item.length)) fail('IMPLEMENTATION_FINDING_EVIDENCE_MISSING',key);
  }
  return stable(raw);
}
export function validateArchitectureContinuity(raw, { descriptor, operationId, subjectHead, architectureFindings }) {
  const c = assertObject(raw,'ARCHITECTURE_CONTINUITY_MISSING');
  const keys = ['schema','priorOperationId','priorDescriptorId','subjectHead','architectureReceiptDigest','nativeReceiptDigest'].sort();
  if (canonical(Object.keys(c).sort()) !== canonical(keys)) fail('ARCHITECTURE_CONTINUITY_KEYSET_INVALID');
  if (c.schema !== 'PAGE_EXCELLENCE_ARCHITECTURE_CONTINUITY_v1') fail('ARCHITECTURE_CONTINUITY_SCHEMA_MISMATCH');
  assertString(c.priorOperationId,'ARCHITECTURE_CONTINUITY_PRIOR_OPERATION_MISSING');
  if (c.priorDescriptorId !== GENERIC_PAGE_ARCHITECTURE_CLASS) fail('ARCHITECTURE_CONTINUITY_DESCRIPTOR_INVALID');
  if (c.subjectHead !== subjectHead) fail('ARCHITECTURE_CONTINUITY_SUBJECT_MISMATCH');
  assertDigest(c.architectureReceiptDigest,'ARCHITECTURE_CONTINUITY_RECEIPT_DIGEST_INVALID');
  assertDigest(c.nativeReceiptDigest,'ARCHITECTURE_CONTINUITY_NATIVE_DIGEST_INVALID');
  const expected = hashObject({ descriptorId:c.priorDescriptorId, operationId:c.priorOperationId, subjectHead:c.subjectHead, findings:architectureFindings });
  if (c.architectureReceiptDigest !== expected) fail('ARCHITECTURE_CONTINUITY_RECEIPT_DIGEST_MISMATCH',{expected,observed:c.architectureReceiptDigest});
  if (c.priorOperationId === operationId) fail('ARCHITECTURE_CONTINUITY_PRIOR_OPERATION_NOT_DISTINCT');
  return stable(c);
}
function validateReferenceClassDescriptor(descriptor, docs, targetHead) {
  if (descriptor.projectId !== docs.op.projectId || descriptor.boundOperationId !== docs.op.operationId || descriptor.boundLockGeneration !== docs.lock.lockGeneration || descriptor.boundTargetHead !== targetHead) fail('DESCRIPTOR_OPERATION_BINDING_MISMATCH');
  if (docs.op.subjectIdentity?.instrumentId !== 'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_v1' || docs.op.subjectIdentity?.activationRequested !== false) fail('REFERENCE_CLASS_INSTRUMENT_IDENTITY_MISMATCH');
  if (docs.op.exactGoverningHead === targetHead) fail('REFERENCE_CLASS_TARGET_MUST_BE_CANDIDATE_HEAD');
  return stable({ instrumentId:docs.op.subjectIdentity.instrumentId,boundOperationId:descriptor.boundOperationId,boundLockGeneration:descriptor.boundLockGeneration,boundTargetHead:descriptor.boundTargetHead,scriptPath:descriptor.scriptPath,scriptBlob:descriptor.scriptBlob,fixedArguments:descriptor.fixedArguments });
}
function validateReferenceClassEvaluatorDescriptor(descriptor, docs, targetHead) {
  if (descriptor.projectId !== docs.op.projectId || descriptor.boundOperationId !== docs.op.operationId || descriptor.boundLockGeneration !== docs.lock.lockGeneration || descriptor.boundTargetHead !== targetHead) fail('DESCRIPTOR_OPERATION_BINDING_MISMATCH');
  if (docs.op.subjectIdentity?.instrumentId !== 'REFERENCE_CLASS_AWARDS_ADMISSION_INSTRUMENT_v1' || docs.op.subjectIdentity?.componentId !== 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_v1' || docs.op.subjectIdentity?.activationRequested !== false) fail('REFERENCE_CLASS_EVALUATOR_COMPONENT_IDENTITY_MISMATCH');
  if (docs.op.exactGoverningHead === targetHead) fail('REFERENCE_CLASS_TARGET_MUST_BE_CANDIDATE_HEAD');
  return stable({ instrumentId:docs.op.subjectIdentity.instrumentId,componentId:docs.op.subjectIdentity.componentId,boundOperationId:descriptor.boundOperationId,boundLockGeneration:descriptor.boundLockGeneration,boundTargetHead:descriptor.boundTargetHead,scriptPath:descriptor.scriptPath,scriptBlob:descriptor.scriptBlob,fixedArguments:descriptor.fixedArguments });
}
function collectInstrumentVersions(toolset) {
  const instruments = toolset?.instrumentRegistry?.instruments;
  if (!Array.isArray(instruments) || instruments.length !== 9 || !instruments.some(item => item.id === 'contextualArchitectureConformanceInstrument')) fail('INSTRUMENT_REGISTRY_NOT_UNIQUE');
  return Object.fromEntries(instruments.map(item => [item.id,item.version]));
}
function validateToolset(toolset) {
  if (toolset?.status !== 'ACTIVE_VERSION_BOUND' || toolset?.locator?.status !== 'ACTIVE_VERSION_BOUND') fail('PAGE_TOOLSET_NOT_ACTIVE');
  if (toolset?.locator?.toolsetId !== 'MANDATORY_PAGE_TOOLSET' || toolset?.locator?.version !== '1.1.0') fail('PAGE_TOOLSET_VERSION_MISMATCH');
  collectInstrumentVersions(toolset); return toolset;
}
export function makePageArchitectureBundle(descriptor, toolset, subjectHead, operationId, architectureFindings = descriptor.architectureFindings) {
  validateToolset(toolset); const instrumentVersions = collectInstrumentVersions(toolset), findings = stable(architectureFindings);
  return stable({ schema:'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1', toolsetId:toolset.locator.toolsetId, toolsetVersion:toolset.locator.version, subjectHead, phaseReceipts:[{phase:'ARCHITECTURE',result:'PASS',instrumentVersions,receiptDigest:hashObject({descriptorId:descriptor.descriptorId,operationId,subjectHead,findings}),findings}] });
}
export function makePageImplementationBundle(descriptor, toolset, subjectHead, operationId, architectureFindings, implementationFindings, architectureContinuity) {
  validateToolset(toolset); const instrumentVersions = collectInstrumentVersions(toolset);
  const architectureReceipt = { phase:'ARCHITECTURE', result:'PASS', instrumentVersions, receiptDigest:architectureContinuity.architectureReceiptDigest, findings:stable(architectureFindings) };
  const implementationReceipt = { phase:'IMPLEMENTATION', result:'PASS', instrumentVersions, receiptDigest:hashObject({descriptorId:descriptor.descriptorId,operationId,subjectHead,architectureReceiptDigest:architectureContinuity.architectureReceiptDigest,findings:implementationFindings.findings}), findings:stable(implementationFindings.findings) };
  return stable({ schema:'MANDATORY_PAGE_PHASE_RECEIPT_BUNDLE_v1', toolsetId:toolset.locator.toolsetId, toolsetVersion:toolset.locator.version, subjectHead, phaseReceipts:[architectureReceipt,implementationReceipt] });
}

export function validateAndResolve({ rawRequest, registry, ledger }) {
  const request = validateRequest(rawRequest), descriptor = resolveDescriptor(registry,request.descriptorId), docs = validateOperationDocuments(request);
  const live = ledger?.activeScopes?.[docs.lock.scopeHash];
  if (!live || live.operationId !== docs.op.operationId || live.lockGeneration !== docs.lock.lockGeneration || live.lockScope !== docs.lock.lockScope || live.state !== 'ADMITTED_LOCKED' || live.released !== false) fail('ACTIVE_OPERATION_IDENTITY_MISMATCH','ledger identity');
  const requestDigest = hashObject(docs.op), procedureDigest = hashObject(docs.procedure);
  if (requestDigest !== live.requestDigest || requestDigest !== docs.admission.requestDigest) fail('REQUEST_OR_PROCEDURE_DIGEST_MISMATCH','request');
  if (procedureDigest !== live.procedureLocatorDigest || procedureDigest !== docs.admission.procedureLocatorDigest) fail('REQUEST_OR_PROCEDURE_DIGEST_MISMATCH','procedure');
  const targetHead = deriveTargetHead(docs.op,descriptor), pageSubjectHead = derivePageSubjectHead(docs.op,descriptor,targetHead), task = deriveTask(docs.op,descriptor), paths = docs.allowedPaths;
  const architectureFindings = descriptor.executionClass === 'PAGE_EXCELLENCE_ARCHITECTURE_V1'
    ? validatePageArchitectureDescriptor(descriptor,docs,targetHead)
    : GENERIC_PAGE_CLASSES.has(descriptor.executionClass) ? validateCanonicalPageArchitectureFindings(descriptor,docs) : null;
  const implementationFindings = descriptor.executionClass === GENERIC_PAGE_IMPLEMENTATION_CLASS ? validateImplementationFindings(docs.op.subjectIdentity?.pageImplementationFindings) : null;
  const architectureContinuity = descriptor.executionClass === GENERIC_PAGE_IMPLEMENTATION_CLASS
    ? validateArchitectureContinuity(docs.op.subjectIdentity?.pageArchitectureContinuity,{descriptor,operationId:docs.op.operationId,subjectHead:pageSubjectHead,architectureFindings}) : null;
  const referenceClassBinding = descriptor.executionClass === 'REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1' ? validateReferenceClassDescriptor(descriptor,docs,targetHead) : null;
  const referenceClassEvaluatorBinding = descriptor.executionClass === 'REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_V1' ? validateReferenceClassEvaluatorDescriptor(descriptor,docs,targetHead) : null;
  return stable({ descriptor,executionClass:descriptor.executionClass,operationId:docs.op.operationId,projectId:docs.op.projectId,lockGeneration:docs.lock.lockGeneration,scopeHash:docs.lock.scopeHash,targetHead,pageSubjectHead,task,paths,requestDigest,procedureDigest,admissionReceipt:docs.admission,architectureFindings,implementationFindings,architectureContinuity,referenceClassBinding,referenceClassEvaluatorBinding });
}

function loadCanonicalLedger() {
  try { execGit(['show',`${LOCK_REF}:${LOCK_LEDGER_PATH}`]); }
  catch { try { execGit(['fetch','--no-tags','origin','+refs/heads/operation-locks/repository-operation-intake-v1:refs/remotes/origin/operation-locks/repository-operation-intake-v1']); } catch { fail('CANONICAL_LOCK_LEDGER_UNAVAILABLE'); } }
  try { return JSON.parse(execGit(['show',`${LOCK_REF}:${LOCK_LEDGER_PATH}`])); } catch { fail('CANONICAL_LOCK_LEDGER_INVALID'); }
}
function ensureCommitAvailable(commit) {
  try { execGit(['cat-file','-e',`${commit}^{commit}`]); }
  catch { try { execGit(['fetch','--no-tags','origin',commit]); } catch { fail('EXACT_HEAD_CHECKOUT_FAILURE',commit); } }
}
function verifyCanonicalSourceBlobs(resolution) {
  if (!GENERIC_PAGE_CLASSES.has(resolution.executionClass) || resolution.architectureFindings?.implementationClass !== 'EXISTING_CONSTRUCT_ADOPTION') return;
  for (const source of resolution.architectureFindings.exactSourceConstructIdentities) {
    ensureCommitAvailable(source.commitSha); let observed;
    try { observed = execGit(['rev-parse',`${source.commitSha}:${source.path}`]).trim(); } catch { fail('ARCHITECTURE_SOURCE_IDENTITY_NOT_REPRODUCIBLE',source.sourceId); }
    if (observed !== source.gitBlobSha) fail('ARCHITECTURE_SOURCE_IDENTITY_NOT_REPRODUCIBLE',`${source.sourceId}:${source.gitBlobSha}:${observed}`);
  }
}
function assertClean(cwd, code='WORKTREE_NOT_CLEAN') { const status=execGit(['status','--porcelain=v1','--untracked-files=all'],cwd); if(status.trim()!=='') fail(code,status.trim()); }
function baseSafeEnv(tempRoot,admissionPath) { return {PATH:process.env.PATH??'',HOME:process.env.HOME??tempRoot,TMPDIR:process.env.RUNNER_TEMP??os.tmpdir(),LANG:process.env.LANG??'C.UTF-8',LC_ALL:process.env.LC_ALL??'C.UTF-8',INTAKE_ADMISSION_RECEIPT:admissionPath}; }
function executeRouter(resolution,worktree,tempRoot,admissionPath) {
  const nativeReceiptPath=path.join(tempRoot,'native-receipt.json'),args=[resolution.descriptor.scriptPath,'--mutation-intent',...resolution.paths.flatMap(p=>['--path',p]),'--task',resolution.task,'--output',nativeReceiptPath];
  let exitCode=0; try{cp.execFileSync(resolution.descriptor.executable,args,{cwd:worktree,env:baseSafeEnv(tempRoot,admissionPath),shell:false,stdio:['ignore','pipe','pipe'],maxBuffer:32*1024*1024});}catch(error){exitCode=Number.isInteger(error.status)?error.status:1;}
  if(!fs.existsSync(nativeReceiptPath))fail('NATIVE_RECEIPT_MISSING_OR_INVALID');
  const nativeReceipt=readJson(nativeReceiptPath); if(nativeReceipt.schema!==resolution.descriptor.nativeReceiptSchema)fail('NATIVE_RECEIPT_MISSING_OR_INVALID','schema');
  const routePaths=Array.isArray(nativeReceipt.routes)?nativeReceipt.routes.map(r=>r.path).sort():[]; if(canonical(routePaths)!==canonical([...resolution.paths].sort()))fail('NATIVE_RECEIPT_MISSING_OR_INVALID','route path set');
  return{exitCode,nativePass:nativeReceipt[resolution.descriptor.nativePassField]===resolution.descriptor.nativePassValue,nativeReceipt,nativeReceiptDigest:sha256(fs.readFileSync(nativeReceiptPath)),commandDigest:hashObject({executable:resolution.descriptor.executable,args}),extraReceiptFields:{}};
}
function executePagePhase(resolution,worktree,tempRoot,admissionPath) {
  const gateBytes=fs.readFileSync(path.join(worktree,resolution.descriptor.scriptPath)),actualGateBlob=gitBlobSha(gateBytes);
  if(resolution.executionClass==='PAGE_EXCELLENCE_ARCHITECTURE_V1'&&actualGateBlob!==resolution.descriptor.scriptBlob)fail('PAGE_EXCELLENCE_GATE_BLOB_MISMATCH',`${resolution.descriptor.scriptBlob}:${actualGateBlob}`);
  if(GENERIC_PAGE_CLASSES.has(resolution.executionClass))verifyCanonicalSourceBlobs(resolution);
  const toolset=readJson(path.join(worktree,PAGE_TOOLSET_PATH));
  const bundle=resolution.executionClass===GENERIC_PAGE_IMPLEMENTATION_CLASS
    ? makePageImplementationBundle(resolution.descriptor,toolset,resolution.pageSubjectHead,resolution.operationId,resolution.architectureFindings,resolution.implementationFindings,resolution.architectureContinuity)
    : makePageArchitectureBundle(resolution.descriptor,toolset,resolution.pageSubjectHead,resolution.operationId,resolution.architectureFindings);
  const bundlePath=path.join(tempRoot,'page-phase-bundle.json'),routerReceiptPath=path.join(tempRoot,'delegated-router-receipt.json'),gateReceiptPath=path.join(tempRoot,'native-gate-receipt.json');
  writeJson(bundlePath,bundle);
  const args=[resolution.descriptor.scriptPath,'--mutation-intent',...resolution.paths.flatMap(p=>['--path',p]),'--task',resolution.task,'--page-phase',resolution.descriptor.pagePhase,'--page-receipt-bundle',bundlePath,'--output',routerReceiptPath];
  const child=cp.spawnSync(resolution.descriptor.executable,args,{cwd:worktree,env:{...baseSafeEnv(tempRoot,admissionPath),PAGE_OPERATION_SUBJECT_HEAD:resolution.pageSubjectHead},shell:false,encoding:'utf8',maxBuffer:32*1024*1024});
  const exitCode=child.error?1:(Number.isInteger(child.status)?child.status:1); let gateReceipt=null; try{gateReceipt=child.stdout?JSON.parse(child.stdout):null;}catch{}
  if(!gateReceipt||gateReceipt.schema!==resolution.descriptor.nativeReceiptSchema)fail('NATIVE_RECEIPT_MISSING_OR_INVALID','page gate receipt');
  writeJson(gateReceiptPath,gateReceipt); if(!fs.existsSync(routerReceiptPath))fail('DELEGATED_ROUTER_RECEIPT_MISSING');
  const routerReceipt=readJson(routerReceiptPath); if(routerReceipt.schema!==resolution.descriptor.delegatedRouterReceiptSchema)fail('DELEGATED_ROUTER_RECEIPT_INVALID','schema');
  const routePaths=Array.isArray(routerReceipt.routes)?routerReceipt.routes.map(r=>r.path).sort():[];
  if(canonical(routePaths)!==canonical([...resolution.paths].sort())||!routerReceipt.routes.every(route=>route.projectId===resolution.projectId&&route.disposition==='PASS'))fail('DELEGATED_ROUTER_RECEIPT_NONPASS');
  const gateClass=gateReceipt?.mandatoryReceipt?.contextualArchitecture?.implementationClass; if(gateClass!==resolution.architectureFindings.implementationClass)fail('PAGE_ARCHITECTURE_CLASS_MISMATCH',gateClass);
  const nativePass=gateReceipt[resolution.descriptor.nativePassField]===resolution.descriptor.nativePassValue&&routerReceipt.disposition==='PASS';
  const extra={pagePhase:resolution.descriptor.pagePhase,pageSubjectHead:resolution.pageSubjectHead,pageBundleDigest:sha256(fs.readFileSync(bundlePath)),architectureFindingsDigest:hashObject(resolution.architectureFindings),delegatedRouterReceiptDigest:sha256(fs.readFileSync(routerReceiptPath)),delegatedRouterReceipt:routerReceipt,pageGateBlobVerified:true,pageGateBlob:actualGateBlob,canonicalOperationDerived:GENERIC_PAGE_CLASSES.has(resolution.executionClass)};
  if(resolution.executionClass===GENERIC_PAGE_IMPLEMENTATION_CLASS)Object.assign(extra,{implementationFindingsDigest:hashObject(resolution.implementationFindings),architectureContinuityDigest:hashObject(resolution.architectureContinuity),architectureReceiptDigest:resolution.architectureContinuity.architectureReceiptDigest,callerSuppliedArchitectureReceiptAccepted:false});
  return{exitCode,nativePass,nativeReceipt:gateReceipt,nativeReceiptDigest:sha256(fs.readFileSync(gateReceiptPath)),commandDigest:hashObject({executable:resolution.descriptor.executable,args,derivedEnvironment:{PAGE_OPERATION_SUBJECT_HEAD:resolution.pageSubjectHead},executionHead:resolution.targetHead}),extraReceiptFields:extra};
}
function executeReferenceClassAdmissionVerification(resolution,worktree,tempRoot,admissionPath) {
  const bytes=fs.readFileSync(path.join(worktree,resolution.descriptor.scriptPath)),actual=gitBlobSha(bytes); if(actual!==resolution.descriptor.scriptBlob)fail('REFERENCE_CLASS_VERIFIER_BLOB_MISMATCH');
  const args=[resolution.descriptor.scriptPath,...resolution.descriptor.fixedArguments],child=cp.spawnSync(resolution.descriptor.executable,args,{cwd:worktree,env:baseSafeEnv(tempRoot,admissionPath),shell:false,encoding:'utf8',maxBuffer:32*1024*1024});
  const exitCode=child.error?1:(Number.isInteger(child.status)?child.status:1); let nativeReceipt=null; try{nativeReceipt=child.stdout?JSON.parse(child.stdout):null;}catch{}
  if(!nativeReceipt||nativeReceipt.schema!==resolution.descriptor.nativeReceiptSchema)fail('NATIVE_RECEIPT_MISSING_OR_INVALID','reference-class verifier receipt');
  if(nativeReceipt.executionHead!==resolution.targetHead||nativeReceipt.operationId!==resolution.operationId||nativeReceipt.lockGeneration!==resolution.lockGeneration||nativeReceipt.packagePathCount!==resolution.paths.length)fail('REFERENCE_CLASS_VERIFIER_OPERATION_BINDING_MISMATCH');
  if(nativeReceipt.activationAuthorityCreated!==false||nativeReceipt.awardsAuthorityCreated!==false)fail('REFERENCE_CLASS_VERIFIER_AUTHORITY_INFLATION');
  const p=path.join(tempRoot,'reference-class-verification-receipt.json');writeJson(p,nativeReceipt);
  return{exitCode,nativePass:nativeReceipt[resolution.descriptor.nativePassField]===resolution.descriptor.nativePassValue,nativeReceipt,nativeReceiptDigest:sha256(fs.readFileSync(p)),commandDigest:hashObject({executable:resolution.descriptor.executable,args,targetHead:resolution.targetHead,scriptBlob:resolution.descriptor.scriptBlob}),extraReceiptFields:{referenceClassVerifierBlobVerified:true,referenceClassVerifierFixedArgumentsVerified:true,referenceClassBinding:resolution.referenceClassBinding}};
}
function executeReferenceClassEvaluatorSelfTest(resolution,worktree,tempRoot,admissionPath) {
  const bytes=fs.readFileSync(path.join(worktree,resolution.descriptor.scriptPath)),actual=gitBlobSha(bytes); if(actual!==resolution.descriptor.scriptBlob)fail('REFERENCE_CLASS_EVALUATOR_SELF_TEST_BLOB_MISMATCH');
  const args=[resolution.descriptor.scriptPath,...resolution.descriptor.fixedArguments],child=cp.spawnSync(resolution.descriptor.executable,args,{cwd:worktree,env:baseSafeEnv(tempRoot,admissionPath),shell:false,encoding:'utf8',maxBuffer:32*1024*1024});
  const exitCode=child.error?1:(Number.isInteger(child.status)?child.status:1); let nativeReceipt=null; try{nativeReceipt=child.stdout?JSON.parse(child.stdout):null;}catch{}
  if(!nativeReceipt||nativeReceipt.schema!==resolution.descriptor.nativeReceiptSchema)fail('NATIVE_RECEIPT_MISSING_OR_INVALID','reference evaluator receipt');
  if(nativeReceipt.testCount!==nativeReceipt.passCount||nativeReceipt.failCount!==0||nativeReceipt.activationAuthorityCreated!==false||nativeReceipt.awardWinnerAuthorityCreated!==false||nativeReceipt.namedAwardReadinessAuthorityCreated!==false)fail('REFERENCE_CLASS_EVALUATOR_SELF_TEST_NONPASS_COUNTS');
  const p=path.join(tempRoot,'reference-class-evaluator-self-test-receipt.json');writeJson(p,nativeReceipt);
  return{exitCode,nativePass:nativeReceipt[resolution.descriptor.nativePassField]===resolution.descriptor.nativePassValue,nativeReceipt,nativeReceiptDigest:sha256(fs.readFileSync(p)),commandDigest:hashObject({executable:resolution.descriptor.executable,args,targetHead:resolution.targetHead,scriptBlob:resolution.descriptor.scriptBlob}),extraReceiptFields:{referenceClassEvaluatorSelfTestBlobVerified:true,referenceClassEvaluatorFixedArgumentsVerified:true,referenceClassEvaluatorBinding:resolution.referenceClassEvaluatorBinding}};
}

export function executeResolved(resolution,{root=ROOT}={}) {
  ensureCommitAvailable(resolution.targetHead);
  const tempRoot=fs.mkdtempSync(path.join(os.tmpdir(),'bounded-exact-head-carrier-')),worktree=path.join(tempRoot,'worktree'),admissionPath=path.join(tempRoot,'admission.json');writeJson(admissionPath,resolution.admissionReceipt);let added=false;
  try{
    execGit(['worktree','add','--detach',worktree,resolution.targetHead],root);added=true;
    const actualHead=execGit(['rev-parse','HEAD^{commit}'],worktree).trim();if(actualHead!==resolution.targetHead)fail('EXACT_HEAD_CHECKOUT_FAILURE',`${resolution.targetHead}:${actualHead}`);assertClean(worktree);
    const execution=['PAGE_EXCELLENCE_ARCHITECTURE_V1',...GENERIC_PAGE_CLASSES].includes(resolution.executionClass)
      ? executePagePhase(resolution,worktree,tempRoot,admissionPath)
      : resolution.executionClass==='REFERENCE_CLASS_AWARDS_ADMISSION_VERIFY_V1'
        ? executeReferenceClassAdmissionVerification(resolution,worktree,tempRoot,admissionPath)
        : resolution.executionClass==='REFERENCE_CLASS_AWARDS_ADMISSION_EVALUATOR_SELF_TEST_V1'
          ? executeReferenceClassEvaluatorSelfTest(resolution,worktree,tempRoot,admissionPath)
          : executeRouter(resolution,worktree,tempRoot,admissionPath);
    assertClean(worktree);
    return stable({schema:'BOUNDED_EXACT_HEAD_EXECUTION_RECEIPT_v1',result:execution.nativePass&&execution.exitCode===0?'COMMAND_EXECUTED_AND_PASSED':'COMMAND_EXECUTED_AND_RETURNED_NONPASS',descriptorId:resolution.descriptor.descriptorId,executionClass:resolution.executionClass,operationId:resolution.operationId,lockGeneration:resolution.lockGeneration,targetHead:resolution.targetHead,pageSubjectHead:resolution.pageSubjectHead,task:resolution.task,paths:resolution.paths,commandDigest:execution.commandDigest,exactHeadVerified:true,workingTreeCleanBeforeAndAfter:true,commandExecuted:true,commandExitCode:execution.exitCode,nativeReceiptSchema:execution.nativeReceipt.schema,nativeReceiptDigest:execution.nativeReceiptDigest,nativeReceiptRewritten:false,nativeReceipt:execution.nativeReceipt,...execution.extraReceiptFields,repositoryWritesPerformed:false,arbitraryCommandAuthority:false,callerSuppliedBundleAccepted:false,semanticAuthorityCreated:false,productAuthorityCreated:false});
  }finally{if(added){try{execGit(['worktree','remove','--force',worktree],root);}catch{}}try{fs.rmSync(tempRoot,{recursive:true,force:true});}catch{}}
}
export function runCarrier({request,registry=readJson(REGISTRY_PATH),ledger=loadCanonicalLedger(),root=ROOT}) { return executeResolved(validateAndResolve({rawRequest:request,registry,ledger}),{root}); }

function main(){const args=parseArgs(process.argv.slice(2));if(!args.input||!args.output)fail('INPUT_AND_OUTPUT_REQUIRED');const request=readJson(args.input),receipt=runCarrier({request});writeJson(args.output,receipt);if(receipt.result!=='COMMAND_EXECUTED_AND_PASSED')process.exitCode=2;}
const invoked=process.argv[1]&&path.resolve(process.argv[1])===fileURLToPath(import.meta.url);
if(invoked){try{main();}catch(error){const args=(()=>{try{return parseArgs(process.argv.slice(2));}catch{return{};}})();const failure=stable({schema:'BOUNDED_EXACT_HEAD_EXECUTION_FAILURE_v1',result:'FAIL_CLOSED',errorCode:error.code??'UNEXPECTED_CARRIER_ERROR',detail:error.detail??error.message,repositoryWritesPerformed:false,arbitraryCommandAuthority:false,callerSuppliedBundleAccepted:false,semanticAuthorityCreated:false,productAuthorityCreated:false});if(args.output)writeJson(args.output,failure);else process.stderr.write(`${JSON.stringify(failure,null,2)}\n`);process.exitCode=1;}}
