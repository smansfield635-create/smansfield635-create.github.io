import crypto from 'node:crypto';

export const AXIS_ORDER = Object.freeze([
  'SYSTEM','SCIENTIFIC_OBJECT','MODEL','METHOD_STAGE','EVIDENCE','EXECUTION','CUSTODY',
  'CLAIM_CEILING','SUPPORT_MODE','LENS','VIEW_MODE','ROUTE_HISTORY','CONTENT_VERSION'
]);

export const AXIS_STATUSES = Object.freeze(['DECLARED','UNSET','UNEVALUABLE','NOT_APPLICABLE']);
export const RESOLUTION_PRECEDENCE = Object.freeze(['INVALID','UNEVALUABLE','PARTIAL','RESOLVED']);

const CUSTODY_DOMAINS = Object.freeze(['SOURCE_SIDE','ANALYST_SIDE','OUTCOME_SIDE','SCORING_SIDE']);
const SUPPORT_MODES = Object.freeze(['INTRINSIC','SUPPORTED','SUBSTITUTED','MIXED']);

export const AXIS_MUTATION_AUTHORITY = Object.freeze({
  SYSTEM: 'SCIENTIFIC_OR_CONSTITUTIONAL_AUTHORITY_ONLY',
  SCIENTIFIC_OBJECT: 'SCIENTIFIC_OR_CONSTITUTIONAL_AUTHORITY_ONLY',
  MODEL: 'REGISTERED_MODEL_SELECTION_ONLY',
  METHOD_STAGE: 'REGISTERED_METHOD_SEQUENCE_ONLY',
  EVIDENCE: 'EVIDENCE_ADJUDICATION_ONLY',
  EXECUTION: 'EXECUTION_OR_ADJUDICATION_AUTHORITY_ONLY',
  CUSTODY: 'CUSTODY_AUTHORITY_ONLY',
  CLAIM_CEILING: 'EVIDENCE_ADJUDICATION_ONLY',
  SUPPORT_MODE: 'SCIENTIFIC_CLASSIFICATION_AUTHORITY_ONLY',
  LENS: 'REPRESENTATION_AUTHORITY',
  VIEW_MODE: 'REPRESENTATION_AUTHORITY',
  ROUTE_HISTORY: 'NAVIGATION_STATE_ONLY',
  CONTENT_VERSION: 'VERSIONED_CONTENT_AUTHORITY_ONLY'
});

export const TRANSITION_MUTATION_KINDS = Object.freeze({
  REPRESENTATION: ['LENS','VIEW_MODE'],
  NAVIGATION: ['ROUTE_HISTORY'],
  CONTENT_BINDING: ['CONTENT_VERSION'],
  SCIENTIFIC_REFERENT: ['SYSTEM','SCIENTIFIC_OBJECT'],
  MODEL_SELECTION: ['MODEL'],
  METHOD_STAGE: ['METHOD_STAGE'],
  EVIDENCE_ADJUDICATION: ['EVIDENCE','CLAIM_CEILING'],
  EXECUTION: ['EXECUTION'],
  CUSTODY: ['CUSTODY'],
  SUPPORT_CLASSIFICATION: ['SUPPORT_MODE']
});

const SHAPES = Object.freeze({
  SYSTEM: ['systemId','boundaryRef'],
  SCIENTIFIC_OBJECT: ['objectClass','objectId'],
  MODEL: ['modelId','role'],
  METHOD_STAGE: ['stageId','order','custodyDomain'],
  EVIDENCE: ['evidenceObjectId','evidenceStatus','classification','disposition','independenceStatus','contaminationStatus'],
  EXECUTION: ['executionId','executionStatus','scientificResultStatus'],
  CUSTODY: ['custodyDomain','custodyStatus'],
  CLAIM_CEILING: ['ceilingId','scopeRef','prohibitions'],
  SUPPORT_MODE: ['mode'],
  LENS: ['lensId'],
  VIEW_MODE: ['viewModeId'],
  CONTENT_VERSION: ['contentVersionId','contentFingerprint']
});

const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmpty = value => typeof value === 'string' && value.length > 0;
const sameKeySet = (obj, keys) => isObject(obj) && Object.keys(obj).length === keys.length && keys.every(key => Object.hasOwn(obj, key));
const clone = value => structuredClone(value);

function validateDeclaredValue(axis, value, errors, prefix) {
  if (axis === 'ROUTE_HISTORY') {
    if (!Array.isArray(value) || value.some(v => !isNonEmpty(v))) errors.push(`${prefix}.value must be an array of nonempty strings`);
    return;
  }
  const keys = SHAPES[axis];
  if (!sameKeySet(value, keys)) {
    errors.push(`${prefix}.value has wrong shape`);
    return;
  }
  for (const key of keys) {
    const v = value[key];
    if (axis === 'METHOD_STAGE' && key === 'order') {
      if (!Number.isInteger(v) || v < 1) errors.push(`${prefix}.value.order must be an integer >= 1`);
    } else if ((axis === 'METHOD_STAGE' || axis === 'CUSTODY') && key === 'custodyDomain') {
      if (!CUSTODY_DOMAINS.includes(v)) errors.push(`${prefix}.value.custodyDomain is invalid`);
    } else if (axis === 'CLAIM_CEILING' && key === 'prohibitions') {
      if (!Array.isArray(v) || v.some(x => !isNonEmpty(x)) || new Set(v).size !== v.length) errors.push(`${prefix}.value.prohibitions must be unique nonempty strings`);
    } else if (axis === 'SUPPORT_MODE' && key === 'mode') {
      if (!SUPPORT_MODES.includes(v)) errors.push(`${prefix}.value.mode is invalid`);
    } else if (!isNonEmpty(v)) {
      errors.push(`${prefix}.value.${key} must be a nonempty string`);
    }
  }
}

function validateAxis(axis, envelope, errors) {
  const prefix = `axes.${axis}`;
  if (!sameKeySet(envelope, ['status','authorityRef','sourceRef','value'])) {
    errors.push(`${prefix} must contain exactly status, authorityRef, sourceRef, value`);
    return;
  }
  if (!AXIS_STATUSES.includes(envelope.status)) errors.push(`${prefix}.status is invalid`);
  if (!isNonEmpty(envelope.authorityRef)) errors.push(`${prefix}.authorityRef must be nonempty`);
  if (!isNonEmpty(envelope.sourceRef)) errors.push(`${prefix}.sourceRef must be nonempty`);
  if (envelope.status === 'DECLARED') {
    if (envelope.value === null) errors.push(`${prefix}.DECLARED requires non-null value`);
    else validateDeclaredValue(axis, envelope.value, errors, prefix);
  } else if (AXIS_STATUSES.includes(envelope.status) && envelope.value !== null) {
    errors.push(`${prefix}.${envelope.status} requires null value`);
  }
}

export function validateState(state) {
  const errors = [];
  if (!sameKeySet(state, ['schema','kernelVersion','axes'])) {
    return { valid: false, errors: ['state must contain exactly schema, kernelVersion, axes'] };
  }
  if (state.schema !== 'METHODS_MODELS_CANONICAL_ENVIRONMENT_STATE_v1') errors.push('schema mismatch');
  if (state.kernelVersion !== 'TEXT_FIRST_STATEFUL_METHODS_MODELS_CANONICAL_STATE_v1') errors.push('kernelVersion mismatch');
  if (!isObject(state.axes)) errors.push('axes must be an object');
  else {
    const keys = Object.keys(state.axes);
    if (keys.length !== AXIS_ORDER.length || AXIS_ORDER.some(axis => !Object.hasOwn(state.axes, axis))) errors.push('axes must contain exactly the 13 F2 axes');
    for (const axis of AXIS_ORDER) if (Object.hasOwn(state.axes, axis)) validateAxis(axis, state.axes[axis], errors);
  }
  if (errors.length === 0) {
    const method = state.axes.METHOD_STAGE;
    const custody = state.axes.CUSTODY;
    if (method.status === 'DECLARED' && custody.status === 'DECLARED' && method.value.custodyDomain !== custody.value.custodyDomain) {
      errors.push('METHOD_STAGE_CUSTODY_DOMAIN_CONSISTENCY');
    }
  }
  return { valid: errors.length === 0, errors };
}

function validateDefaultRegistration(registration, errors) {
  const fields = ['defaultId','axis','mutationAuthority','authorityRef','sourceRef','value'];
  if (!sameKeySet(registration, fields)) {
    errors.push('default registration has wrong shape');
    return;
  }
  if (!isNonEmpty(registration.defaultId)) errors.push('defaultId must be nonempty');
  if (!AXIS_ORDER.includes(registration.axis)) errors.push('default axis is invalid');
  if (!isNonEmpty(registration.authorityRef) || !isNonEmpty(registration.sourceRef)) errors.push('default authorityRef/sourceRef must be nonempty');
  if (AXIS_ORDER.includes(registration.axis) && registration.mutationAuthority !== AXIS_MUTATION_AUTHORITY[registration.axis]) errors.push(`default mutationAuthority mismatch for ${registration.axis}`);
  if (AXIS_ORDER.includes(registration.axis)) {
    const candidate = { status: 'DECLARED', authorityRef: registration.authorityRef, sourceRef: registration.sourceRef, value: registration.value };
    validateAxis(registration.axis, candidate, errors);
  }
}

export function applyRegisteredDefaults(state, defaultRegistry = { defaults: [] }) {
  const result = clone(state);
  const errors = [];
  const applied = [];
  if (!isObject(defaultRegistry) || !Array.isArray(defaultRegistry.defaults)) return { state: result, applied, errors: ['default registry must contain defaults array'] };
  const seenAxes = new Set();
  for (const registration of defaultRegistry.defaults) {
    const before = errors.length;
    validateDefaultRegistration(registration, errors);
    if (errors.length !== before) continue;
    if (seenAxes.has(registration.axis)) { errors.push(`duplicate default for ${registration.axis}`); continue; }
    seenAxes.add(registration.axis);
    const target = result.axes?.[registration.axis];
    if (!target) { errors.push(`default target axis missing: ${registration.axis}`); continue; }
    if (target.status !== 'UNSET') { errors.push(`default may apply only to UNSET axis: ${registration.axis}`); continue; }
    result.axes[registration.axis] = {
      status: 'DECLARED', authorityRef: registration.authorityRef, sourceRef: registration.sourceRef, value: clone(registration.value)
    };
    applied.push(registration.defaultId);
  }
  return { state: result, applied, errors };
}

export function resolveState(inputState, options = {}) {
  const initial = validateState(inputState);
  if (!initial.valid) return { resolutionClass: 'INVALID', state: null, errors: initial.errors, defaultsApplied: [] };
  const defaults = applyRegisteredDefaults(inputState, options.defaultRegistry ?? { defaults: [] });
  if (defaults.errors.length) return { resolutionClass: 'INVALID', state: null, errors: defaults.errors, defaultsApplied: defaults.applied };
  const after = validateState(defaults.state);
  if (!after.valid) return { resolutionClass: 'INVALID', state: null, errors: after.errors, defaultsApplied: defaults.applied };
  const statuses = AXIS_ORDER.map(axis => defaults.state.axes[axis].status);
  const resolutionClass = statuses.includes('UNEVALUABLE') ? 'UNEVALUABLE' : statuses.includes('UNSET') ? 'PARTIAL' : 'RESOLVED';
  return { resolutionClass, state: defaults.state, errors: [], defaultsApplied: defaults.applied };
}

function sortNested(value) {
  if (Array.isArray(value)) return value.map(sortNested);
  if (!isObject(value)) return value;
  const out = {};
  for (const key of Object.keys(value).sort()) out[key] = sortNested(value[key]);
  return out;
}

function canonicalObject(state) {
  const axes = {};
  for (const axis of AXIS_ORDER) {
    const source = state.axes[axis];
    axes[axis] = {
      status: source.status,
      authorityRef: source.authorityRef,
      sourceRef: source.sourceRef,
      value: sortNested(source.value)
    };
  }
  return { schema: state.schema, kernelVersion: state.kernelVersion, axes };
}

export function serializeCanonical(inputState, options = {}) {
  const resolved = resolveState(inputState, options);
  if (resolved.resolutionClass === 'INVALID') return { ...resolved, bytes: null, sha256: null };
  const bytes = JSON.stringify(canonicalObject(resolved.state));
  const sha256 = crypto.createHash('sha256').update(bytes, 'utf8').digest('hex');
  return { ...resolved, bytes, sha256 };
}

export function restoreCanonical(bytes) {
  if (typeof bytes !== 'string' || bytes.length === 0) return { resolutionClass: 'INVALID', state: null, errors: ['canonical bytes must be a nonempty string'], canonical: false };
  let parsed;
  try { parsed = JSON.parse(bytes); } catch { return { resolutionClass: 'INVALID', state: null, errors: ['JSON_PARSE_FAILURE'], canonical: false }; }
  const serialized = serializeCanonical(parsed);
  if (serialized.resolutionClass === 'INVALID') return { ...serialized, canonical: false };
  if (serialized.bytes !== bytes) return { resolutionClass: 'INVALID', state: null, errors: ['NON_CANONICAL_SERIALIZATION'], canonical: false };
  return { resolutionClass: serialized.resolutionClass, state: serialized.state, errors: [], canonical: true, sha256: serialized.sha256 };
}

export function validateTransition(before, after, mutationKind) {
  const a = validateState(before);
  const b = validateState(after);
  if (!a.valid || !b.valid) return { valid: false, errors: [...a.errors, ...b.errors], changedAxes: [] };
  const allowed = TRANSITION_MUTATION_KINDS[mutationKind];
  if (!allowed) return { valid: false, errors: ['UNKNOWN_MUTATION_KIND'], changedAxes: [] };
  const changedAxes = AXIS_ORDER.filter(axis => JSON.stringify(sortNested(before.axes[axis])) !== JSON.stringify(sortNested(after.axes[axis])));
  const unauthorized = changedAxes.filter(axis => !allowed.includes(axis));
  return unauthorized.length ? { valid: false, errors: unauthorized.map(axis => `UNAUTHORIZED_AXIS_MUTATION:${axis}`), changedAxes } : { valid: true, errors: [], changedAxes };
}
