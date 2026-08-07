import { serializeCanonical } from '../f3-resolution-and-validity-engine/resolver.v1.mjs';

export const DEPTH_ORDER = Object.freeze(['D0','D1','D2','D3','D4']);
export const PROJECTION_SCHEMA = 'METHODS_MODELS_DEPTH_PROJECTION_v1';

const clone = value => structuredClone(value);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmpty = value => typeof value === 'string' && value.length > 0;

function exactOne(items, predicate, noMatch, ambiguous) {
  if (!Array.isArray(items)) throw new Error('REGISTRY_NOT_ARRAY');
  const matches = items.filter(predicate);
  if (matches.length === 0) throw new Error(noMatch);
  if (matches.length !== 1) throw new Error(ambiguous);
  return matches[0];
}

function validateProfile(profile) {
  if (!isObject(profile) || !isNonEmpty(profile.contentId) || !isNonEmpty(profile.entryPointId)) throw new Error('PROFILE_INVALID');
  if (!isObject(profile.fieldsByDepth)) throw new Error('PROFILE_INVALID');
  const all = [];
  for (const depth of DEPTH_ORDER) {
    const fields = profile.fieldsByDepth[depth];
    if (!Array.isArray(fields) || fields.some(field => !isNonEmpty(field))) throw new Error(`PROFILE_INVALID:${depth}`);
    all.push(...fields);
  }
  if (new Set(all).size !== all.length) throw new Error('PROFILE_DUPLICATE_FIELD');
  if (!Array.isArray(profile.requiredAtD0) || profile.requiredAtD0.some(field => !profile.fieldsByDepth.D0.includes(field))) throw new Error('PROFILE_D0_REQUIRED_FIELD_INVALID');
  if (!Array.isArray(profile.materialD0QualifierValues) || profile.materialD0QualifierValues.some(value => !isNonEmpty(value))) throw new Error('PROFILE_D0_QUALIFIER_INVALID');
}

function cumulativeFields(profile, depth) {
  const index = DEPTH_ORDER.indexOf(depth);
  if (index < 0) throw new Error('DEPTH_NO_MATCH');
  return DEPTH_ORDER.slice(0, index + 1).flatMap(level => profile.fieldsByDepth[level]);
}

function containsScalar(value, target) {
  if (value === target) return true;
  if (Array.isArray(value)) return value.some(item => containsScalar(item, target));
  if (isObject(value)) return Object.values(value).some(item => containsScalar(item, target));
  return false;
}

function findBinding(stateBindings, contentId) {
  return exactOne(
    stateBindings?.bindings,
    binding => binding.contentId === contentId,
    'STATE_BINDING_NO_MATCH',
    'STATE_BINDING_AMBIGUOUS'
  );
}

function findInstance(empiricalRegistry, contentId) {
  return exactOne(
    empiricalRegistry?.instances,
    instance => instance.contentId === contentId,
    'CONTENT_NO_MATCH',
    'CONTENT_AMBIGUOUS'
  );
}

function findProfile(profileRegistry, contentId) {
  const profile = exactOne(
    profileRegistry?.profiles,
    candidate => candidate.contentId === contentId,
    'PROFILE_NO_MATCH',
    'PROFILE_AMBIGUOUS'
  );
  validateProfile(profile);
  return profile;
}

function validateContentStateCorrespondence(instance, binding) {
  const objectAxis = binding?.state?.axes?.SCIENTIFIC_OBJECT;
  if (!objectAxis || objectAxis.status !== 'DECLARED') throw new Error('STATE_OBJECT_IDENTITY_UNDECLARED');
  if (objectAxis.value.objectId !== instance.contentId) throw new Error('STATE_CONTENT_IDENTITY_MISMATCH');
  const claimAxis = binding?.state?.axes?.CLAIM_CEILING;
  if (!claimAxis || claimAxis.status !== 'DECLARED') throw new Error('STATE_CLAIM_CEILING_UNDECLARED');
  if (claimAxis.value.ceilingId !== instance.claimCeilingRef) throw new Error('STATE_CONTENT_CLAIM_CEILING_MISMATCH');
  if (instance.evidenceStanding) {
    const evidenceAxis = binding?.state?.axes?.EVIDENCE;
    if (!evidenceAxis || evidenceAxis.status !== 'DECLARED' || evidenceAxis.value.evidenceStatus !== instance.evidenceStanding) throw new Error('STATE_CONTENT_EVIDENCE_STANDING_MISMATCH');
  }
  if (instance.terminalDisposition) {
    const evidenceAxis = binding?.state?.axes?.EVIDENCE;
    if (!evidenceAxis || evidenceAxis.status !== 'DECLARED' || evidenceAxis.value.disposition !== instance.terminalDisposition) throw new Error('STATE_CONTENT_TERMINAL_DISPOSITION_MISMATCH');
  }
}

function disclose(instance, fields) {
  const out = {};
  for (const field of fields) {
    if (!Object.hasOwn(instance, field)) throw new Error(`PROFILE_FIELD_MISSING:${field}`);
    out[field] = clone(instance[field]);
  }
  return out;
}

function validateD0Qualifiers(profile, d0Disclosure) {
  for (const field of profile.requiredAtD0) if (!Object.hasOwn(d0Disclosure, field)) throw new Error(`D0_REQUIRED_FIELD_MISSING:${field}`);
  for (const qualifier of profile.materialD0QualifierValues) if (!containsScalar(d0Disclosure, qualifier)) throw new Error(`D0_MATERIAL_QUALIFIER_MISSING:${qualifier}`);
}

export function projectDepth(contentId, depth, empiricalRegistry, stateBindings, profileRegistry) {
  if (!isNonEmpty(contentId)) return { valid: false, errors: ['CONTENT_ID_INVALID'], projection: null };
  try {
    const instance = findInstance(empiricalRegistry, contentId);
    const binding = findBinding(stateBindings, contentId);
    const profile = findProfile(profileRegistry, contentId);
    if (profile.entryPointId !== contentId) throw new Error('PROFILE_ENTRYPOINT_IDENTITY_MISMATCH');
    validateContentStateCorrespondence(instance, binding);

    const serialized = serializeCanonical(binding.state);
    if (serialized.resolutionClass === 'INVALID') throw new Error(`STATE_AUTHORITY_FAILURE:${serialized.errors.join('|')}`);

    const d0 = disclose(instance, profile.fieldsByDepth.D0);
    validateD0Qualifiers(profile, d0);

    const fields = cumulativeFields(profile, depth);
    const disclosed = disclose(instance, fields);
    const projection = {
      schema: PROJECTION_SCHEMA,
      contentId,
      depth,
      scientificStateSha256: serialized.sha256,
      resolutionClass: serialized.resolutionClass,
      bindingId: binding.bindingId,
      disclosedFieldNames: [...fields],
      disclosed
    };
    return { valid: true, errors: [], projection };
  } catch (error) {
    return { valid: false, errors: [error.message], projection: null };
  }
}

export function inquireField(projection, field) {
  if (!isObject(projection) || projection.schema !== PROJECTION_SCHEMA) return { valid: false, errors: ['PROJECTION_INVALID'], value: null };
  if (!isNonEmpty(field)) return { valid: false, errors: ['FIELD_INVALID'], value: null };
  if (!Array.isArray(projection.disclosedFieldNames) || !projection.disclosedFieldNames.includes(field)) return { valid: false, errors: ['FIELD_NOT_AUTHORIZED_AT_DEPTH'], value: null };
  if (!Object.hasOwn(projection.disclosed, field)) return { valid: false, errors: ['PROJECTION_FIELD_INCONSISTENT'], value: null };
  return { valid: true, errors: [], value: clone(projection.disclosed[field]) };
}

export function compareDepthIdentity(a, b) {
  if (!isObject(a) || !isObject(b) || a.schema !== PROJECTION_SCHEMA || b.schema !== PROJECTION_SCHEMA) return { valid: false, errors: ['PROJECTION_INVALID'] };
  const errors = [];
  if (a.contentId !== b.contentId) errors.push('CONTENT_ID_CHANGED');
  if (a.scientificStateSha256 !== b.scientificStateSha256) errors.push('SCIENTIFIC_STATE_DIGEST_CHANGED');
  if (a.resolutionClass !== b.resolutionClass) errors.push('RESOLUTION_CLASS_CHANGED');
  if (a.bindingId !== b.bindingId) errors.push('BINDING_ID_CHANGED');
  return { valid: errors.length === 0, errors };
}

export function isCumulativeDisclosure(shallow, deep) {
  if (!isObject(shallow) || !isObject(deep)) return false;
  const shallowFields = shallow.disclosedFieldNames ?? [];
  const deepFields = new Set(deep.disclosedFieldNames ?? []);
  if (shallowFields.some(field => !deepFields.has(field))) return false;
  return shallowFields.every(field => JSON.stringify(shallow.disclosed[field]) === JSON.stringify(deep.disclosed[field]));
}
