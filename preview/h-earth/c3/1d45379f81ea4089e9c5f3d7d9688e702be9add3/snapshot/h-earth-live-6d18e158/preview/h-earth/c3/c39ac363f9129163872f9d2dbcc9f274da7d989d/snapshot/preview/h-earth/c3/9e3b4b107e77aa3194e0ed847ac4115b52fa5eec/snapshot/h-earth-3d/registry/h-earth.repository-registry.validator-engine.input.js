/** Target 4B-3 · Proposed-operation input-schema validation. */
import { deepFreeze, stableStrings } from './h-earth.repository-registry.validator-engine.identity.js';

const OPERATION_CLASSES = new Set([
  'READ_ONLY_INSPECTION',
  'BOUNDED_MUTATION_PROPOSAL',
  'LIFECYCLE_TRANSITION_PROPOSAL',
  'AUTHORITY_CHANGE_PROPOSAL',
  'PACKAGE_INTEGRATION_PROPOSAL'
]);

const REQUIRED_FIELDS = Object.freeze([
  'operationId',
  'operationClass',
  'requestedAction',
  'requestedMutation',
  'requestedPaths',
  'declaredAffectedNodeIds',
  'declaredAffectedRelationIds',
  'declaredCompositeUnitIds',
  'assertedOccurrences',
  'assertedAuthority',
  'assertedLifecycleTransitions',
  'assertedCardinalRoles',
  'instructionSources',
  'evidenceReferences',
  'requestedDispositionContext'
]);

const EXACT_ID = /^[A-Z0-9][A-Z0-9._:-]*$/;
const SHA40 = /^[0-9a-f]{40}$/;
const isObject = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const isString = (value) => typeof value === 'string' && value.length > 0 && value.trim() === value;
const hasDuplicates = (values) => new Set(values.map((value) => JSON.stringify(value))).size !== values.length;

function validateClosedObject(value, required, allowed, label, issues) {
  if (!isObject(value)) {
    issues.push(`${label}:NOT_OBJECT`);
    return false;
  }
  for (const key of required) if (!Object.hasOwn(value, key)) issues.push(`${label}:MISSING:${key}`);
  for (const key of Object.keys(value)) if (!allowed.includes(key)) issues.push(`${label}:UNKNOWN:${key}`);
  for (const [key, nested] of Object.entries(value)) if (nested === null) issues.push(`${label}:NULL:${key}`);
  return true;
}

function validateUniqueArray(value, label, issues) {
  if (!Array.isArray(value)) {
    issues.push(`${label}:NOT_ARRAY`);
    return false;
  }
  if (hasDuplicates(value)) issues.push(`${label}:DUPLICATES`);
  return true;
}

export function validateHEarthRepositoryRegistryProposedOperation(input, dependencies) {
  const issues = [];
  const schema = dependencies?.contracts?.input?.schema;
  if (!isObject(input)) {
    return deepFreeze({
      valid: false,
      issues: Object.freeze(['INPUT:NOT_OBJECT']),
      failureCodes: Object.freeze(['OPERATION_SCOPE_UNRESOLVED']),
      normalizedInput: null
    });
  }

  validateClosedObject(input, REQUIRED_FIELDS, REQUIRED_FIELDS, 'INPUT', issues);

  if (!isString(input.operationId) || !EXACT_ID.test(input.operationId)) issues.push('operationId:INVALID');
  if (!OPERATION_CLASSES.has(input.operationClass)) issues.push('operationClass:INVALID');
  if (!isString(input.requestedAction)) issues.push('requestedAction:INVALID');
  if (typeof input.requestedMutation !== 'boolean') issues.push('requestedMutation:INVALID');

  for (const key of [
    'requestedPaths',
    'declaredAffectedNodeIds',
    'declaredAffectedRelationIds',
    'declaredCompositeUnitIds',
    'assertedOccurrences',
    'assertedAuthority',
    'assertedLifecycleTransitions',
    'assertedCardinalRoles',
    'instructionSources',
    'evidenceReferences'
  ]) validateUniqueArray(input[key], key, issues);

  for (const repositoryPath of input.requestedPaths ?? []) {
    if (!isString(repositoryPath) || !repositoryPath.startsWith('/')) issues.push('requestedPaths:INVALID_PATH');
  }
  for (const key of ['declaredAffectedNodeIds', 'declaredAffectedRelationIds', 'declaredCompositeUnitIds', 'instructionSources', 'evidenceReferences']) {
    for (const value of input[key] ?? []) if (!isString(value)) issues.push(`${key}:INVALID_STRING`);
  }
  if ((input.instructionSources ?? []).length === 0) issues.push('instructionSources:EMPTY');

  for (const occurrence of input.assertedOccurrences ?? []) {
    const allowed = ['path', 'commitSha', 'gitBlobSha', 'refName'];
    if (!validateClosedObject(occurrence, allowed, allowed, 'assertedOccurrences', issues)) continue;
    if (!isString(occurrence.path) || !occurrence.path.startsWith('/')) issues.push('assertedOccurrences:path:INVALID');
    if (!SHA40.test(occurrence.commitSha ?? '')) issues.push('assertedOccurrences:commitSha:INVALID');
    if (!SHA40.test(occurrence.gitBlobSha ?? '')) issues.push('assertedOccurrences:gitBlobSha:INVALID');
    if (!isString(occurrence.refName)) issues.push('assertedOccurrences:refName:INVALID');
  }

  for (const assertion of input.assertedAuthority ?? []) {
    const fields = ['nodeId', 'authorityClass', 'authorityClaim'];
    if (!validateClosedObject(assertion, fields, fields, 'assertedAuthority', issues)) continue;
    for (const field of fields) if (!isString(assertion[field])) issues.push(`assertedAuthority:${field}:INVALID`);
  }

  for (const transition of input.assertedLifecycleTransitions ?? []) {
    const fields = ['nodeId', 'fromStatus', 'toStatus'];
    if (!validateClosedObject(transition, fields, fields, 'assertedLifecycleTransitions', issues)) continue;
    for (const field of fields) if (!isString(transition[field])) issues.push(`assertedLifecycleTransitions:${field}:INVALID`);
  }

  for (const assertion of input.assertedCardinalRoles ?? []) {
    const fields = ['nodeId', 'cardinalRole', 'cardinalStatus'];
    if (!validateClosedObject(assertion, fields, fields, 'assertedCardinalRoles', issues)) continue;
    for (const field of fields) if (!isString(assertion[field])) issues.push(`assertedCardinalRoles:${field}:INVALID`);
  }

  const contextFields = ['allowReviewRequired', 'requireExactOccurrenceForReadOnly', 'separateAuthorityAvailable'];
  if (validateClosedObject(input.requestedDispositionContext, contextFields, contextFields, 'requestedDispositionContext', issues)) {
    for (const field of contextFields) {
      if (typeof input.requestedDispositionContext[field] !== 'boolean') issues.push(`requestedDispositionContext:${field}:INVALID`);
    }
  }

  if (schema?.additionalProperties !== false) issues.push('CONTRACT_INPUT_SCHEMA_NOT_CLOSED');
  if (JSON.stringify(schema?.required ?? []) !== JSON.stringify(REQUIRED_FIELDS)) issues.push('CONTRACT_REQUIRED_FIELDS_MISMATCH');

  const valid = issues.length === 0;
  return deepFreeze({
    validationId: 'H_EARTH_REPOSITORY_REGISTRY_VALIDATOR_INPUT_VALIDATION_v1',
    valid,
    issues: stableStrings(issues),
    failureCodes: valid ? Object.freeze([]) : Object.freeze(['OPERATION_SCOPE_UNRESOLVED']),
    normalizedInput: valid ? deepFreeze(structuredClone(input)) : null,
    stoppingCondition: {
      inputSchemaValidationComplete: true,
      advanceBeyondTarget4B3: false,
      nextAuthorizedSubtarget: '4B-4'
    }
  });
}

export default validateHEarthRepositoryRegistryProposedOperation;
