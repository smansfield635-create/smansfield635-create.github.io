import crypto from 'node:crypto';
import {
  serializeCanonical,
  restoreCanonical,
  validateTransition
} from '../f3-resolution-and-validity-engine/resolver.v1.mjs';

export const BASE_ROUTE = '/laws/research/methods-and-models/';
export const CODEC_VERSION = 'MMNAV1';
export const CAPSULE_SCHEMA = 'METHODS_MODELS_NAVIGATION_CAPSULE_v1';
export const FRAGMENT_PREFIX = '#mmnav1.';

const RETURN_FIELDS = Object.freeze([
  'ORIGIN_ROUTE',
  'ORIGIN_OBJECT_ID',
  'ORIGIN_DEPTH',
  'ORIGIN_LENS',
  'DECLARED_RELATION_USED',
  'DESTINATION_ROUTE',
  'RETURN_TARGET',
  'ORIGIN_ENTRY_POINT_ID',
  'ORIGIN_STATE_SHA256',
  'ORIGIN_STATE_BYTES_B64URL'
]);
const CAPSULE_FIELDS = Object.freeze([
  'schema','codecVersion','entryPointId','stateSha256','stateBytesB64Url','returnContext'
]);

const clone = value => structuredClone(value);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmpty = value => typeof value === 'string' && value.length > 0;
const sha256 = text => crypto.createHash('sha256').update(text, 'utf8').digest('hex');
const sameKeysInOrder = (obj, keys) => isObject(obj) && JSON.stringify(Object.keys(obj)) === JSON.stringify(keys);

function b64urlEncodeUtf8(text) {
  return Buffer.from(text, 'utf8').toString('base64url');
}
function b64urlDecodeUtf8(token) {
  if (typeof token !== 'string' || token.length === 0 || token.includes('=') || !/^[A-Za-z0-9_-]+$/.test(token)) throw new Error('NON_CANONICAL_BASE64URL');
  const decoded = Buffer.from(token, 'base64url').toString('utf8');
  if (b64urlEncodeUtf8(decoded) !== token) throw new Error('NON_CANONICAL_BASE64URL');
  return decoded;
}

function getEntry(registry, entryPointId) {
  const entries = registry?.entryPoints;
  if (!Array.isArray(entries)) throw new Error('ENTRYPOINT_REGISTRY_INVALID');
  const matches = entries.filter(e => e.entryPointId === entryPointId);
  if (matches.length !== 1) throw new Error(matches.length === 0 ? 'ENTRYPOINT_NO_MATCH' : 'ENTRYPOINT_AMBIGUOUS');
  return matches[0];
}

function objectIdentity(state) {
  const axis = state?.axes?.SCIENTIFIC_OBJECT;
  if (!axis || axis.status !== 'DECLARED') return null;
  return { objectClass: axis.value.objectClass, objectId: axis.value.objectId };
}

function lensToken(state) {
  const axis = state?.axes?.LENS;
  if (!axis) throw new Error('LENS_AXIS_MISSING');
  return axis.status === 'DECLARED' ? axis.value.lensId : axis.status;
}

function routeOnlyAuthorized(baseState, candidateState) {
  const transition = validateTransition(baseState, candidateState, 'NAVIGATION');
  return transition.valid;
}

export function buildAuthorityRegistry(entrypointRegistry, f4StateBindings) {
  if (!Array.isArray(f4StateBindings?.bindings)) throw new Error('F4_STATE_BINDINGS_INVALID');
  const byBinding = new Map(f4StateBindings.bindings.map(binding => [binding.bindingId, binding]));
  const records = {};
  for (const entry of entrypointRegistry.entryPoints ?? []) {
    const binding = byBinding.get(entry.bindingId);
    if (!binding) throw new Error(`ENTRYPOINT_BINDING_MISSING:${entry.entryPointId}`);
    const identity = objectIdentity(binding.state);
    if (!identity || identity.objectClass !== entry.expectedObjectClass || identity.objectId !== entry.expectedObjectId) throw new Error(`ENTRYPOINT_BINDING_IDENTITY_MISMATCH:${entry.entryPointId}`);
    records[entry.entryPointId] = { entry: clone(entry), baseState: clone(binding.state) };
  }
  return Object.freeze(records);
}

export function validateAuthorizedState(state, entryPointId, authorityRegistry) {
  const record = authorityRegistry?.[entryPointId];
  if (!record) return { valid: false, errors: ['ENTRYPOINT_NO_AUTHORITY'] };
  const serialized = serializeCanonical(state);
  if (serialized.resolutionClass === 'INVALID') return { valid: false, errors: serialized.errors };
  const identity = objectIdentity(serialized.state);
  if (!identity || identity.objectClass !== record.entry.expectedObjectClass || identity.objectId !== record.entry.expectedObjectId) return { valid: false, errors: ['ENTRYPOINT_TARGET_IDENTITY_MISMATCH'] };
  if (!routeOnlyAuthorized(record.baseState, serialized.state)) return { valid: false, errors: ['STATE_OUTRUNS_ENTRYPOINT_AUTHORITY'] };
  return { valid: true, errors: [], state: serialized.state, resolutionClass: serialized.resolutionClass, sha256: serialized.sha256, bytes: serialized.bytes };
}

function canonicalReturnContextObject(context) {
  if (!sameKeysInOrder(context, RETURN_FIELDS)) throw new Error('RETURN_CONTEXT_NON_CANONICAL_FIELDS');
  const out = {};
  for (const key of RETURN_FIELDS) out[key] = context[key];
  return out;
}

export function createReturnContext(originState, originEntryPointId, originRoute, originDepth, declaredRelationUsed, destinationRoute, authorityRegistry) {
  for (const [label, value] of Object.entries({ originEntryPointId, originRoute, originDepth, declaredRelationUsed, destinationRoute })) if (!isNonEmpty(value)) throw new Error(`RETURN_CONTEXT_${label.toUpperCase()}_INVALID`);
  const authorized = validateAuthorizedState(originState, originEntryPointId, authorityRegistry);
  if (!authorized.valid) throw new Error(`RETURN_ORIGIN_UNAUTHORIZED:${authorized.errors.join('|')}`);
  const identity = objectIdentity(authorized.state);
  const stateBytesB64Url = b64urlEncodeUtf8(authorized.bytes);
  const context = {
    ORIGIN_ROUTE: originRoute,
    ORIGIN_OBJECT_ID: identity.objectId,
    ORIGIN_DEPTH: originDepth,
    ORIGIN_LENS: lensToken(authorized.state),
    DECLARED_RELATION_USED: declaredRelationUsed,
    DESTINATION_ROUTE: destinationRoute,
    RETURN_TARGET: `STATE_SHA256:${authorized.sha256}#ROUTE:${originRoute}`,
    ORIGIN_ENTRY_POINT_ID: originEntryPointId,
    ORIGIN_STATE_SHA256: authorized.sha256,
    ORIGIN_STATE_BYTES_B64URL: stateBytesB64Url
  };
  return canonicalReturnContextObject(context);
}

export function validateReturnContext(context, authorityRegistry) {
  try {
    const canonical = canonicalReturnContextObject(context);
    for (const field of RETURN_FIELDS) if (!isNonEmpty(canonical[field])) return { valid: false, errors: [`RETURN_CONTEXT_EMPTY:${field}`] };
    const bytes = b64urlDecodeUtf8(canonical.ORIGIN_STATE_BYTES_B64URL);
    if (sha256(bytes) !== canonical.ORIGIN_STATE_SHA256) return { valid: false, errors: ['RETURN_ORIGIN_DIGEST_MISMATCH'] };
    const restored = restoreCanonical(bytes);
    if (!restored.canonical) return { valid: false, errors: ['RETURN_ORIGIN_NOT_CANONICAL', ...(restored.errors ?? [])] };
    const authorized = validateAuthorizedState(restored.state, canonical.ORIGIN_ENTRY_POINT_ID, authorityRegistry);
    if (!authorized.valid) return { valid: false, errors: ['RETURN_ORIGIN_NOT_AUTHORIZED', ...authorized.errors] };
    const identity = objectIdentity(restored.state);
    if (identity.objectId !== canonical.ORIGIN_OBJECT_ID) return { valid: false, errors: ['RETURN_ORIGIN_OBJECT_MISMATCH'] };
    if (lensToken(restored.state) !== canonical.ORIGIN_LENS) return { valid: false, errors: ['RETURN_ORIGIN_LENS_MISMATCH'] };
    const expectedTarget = `STATE_SHA256:${canonical.ORIGIN_STATE_SHA256}#ROUTE:${canonical.ORIGIN_ROUTE}`;
    if (canonical.RETURN_TARGET !== expectedTarget) return { valid: false, errors: ['RETURN_TARGET_MISMATCH'] };
    return { valid: true, errors: [], state: restored.state, route: canonical.ORIGIN_ROUTE, entryPointId: canonical.ORIGIN_ENTRY_POINT_ID };
  } catch (error) {
    return { valid: false, errors: [error.message] };
  }
}

function canonicalCapsuleObject(capsule, authorityRegistry) {
  if (!sameKeysInOrder(capsule, CAPSULE_FIELDS)) throw new Error('CAPSULE_NON_CANONICAL_FIELDS');
  if (capsule.schema !== CAPSULE_SCHEMA) throw new Error('CAPSULE_SCHEMA_MISMATCH');
  if (capsule.codecVersion !== CODEC_VERSION) throw new Error('CAPSULE_CODEC_VERSION_MISMATCH');
  if (!isNonEmpty(capsule.entryPointId) || !isNonEmpty(capsule.stateSha256) || !isNonEmpty(capsule.stateBytesB64Url)) throw new Error('CAPSULE_REQUIRED_FIELD_EMPTY');
  getEntry({ entryPoints: Object.values(authorityRegistry ?? {}).map(record => record.entry) }, capsule.entryPointId);
  if (capsule.returnContext !== null) {
    const returned = validateReturnContext(capsule.returnContext, authorityRegistry);
    if (!returned.valid) throw new Error(`CAPSULE_RETURN_CONTEXT_INVALID:${returned.errors.join('|')}`);
  }
  return {
    schema: capsule.schema,
    codecVersion: capsule.codecVersion,
    entryPointId: capsule.entryPointId,
    stateSha256: capsule.stateSha256,
    stateBytesB64Url: capsule.stateBytesB64Url,
    returnContext: capsule.returnContext === null ? null : canonicalReturnContextObject(capsule.returnContext)
  };
}

export function encodeDeepLink(state, entryPointId, authorityRegistry, returnContext = null) {
  const authorized = validateAuthorizedState(state, entryPointId, authorityRegistry);
  if (!authorized.valid) throw new Error(`STATE_NOT_AUTHORIZED_FOR_ENTRY:${authorized.errors.join('|')}`);
  if (returnContext !== null) {
    const checked = validateReturnContext(returnContext, authorityRegistry);
    if (!checked.valid) throw new Error(`RETURN_CONTEXT_INVALID:${checked.errors.join('|')}`);
  }
  const capsule = {
    schema: CAPSULE_SCHEMA,
    codecVersion: CODEC_VERSION,
    entryPointId,
    stateSha256: authorized.sha256,
    stateBytesB64Url: b64urlEncodeUtf8(authorized.bytes),
    returnContext
  };
  const canonical = JSON.stringify(canonicalCapsuleObject(capsule, authorityRegistry));
  const payload = b64urlEncodeUtf8(canonical);
  return `${BASE_ROUTE}${FRAGMENT_PREFIX}${payload}.${sha256(canonical)}`;
}

export function decodeDeepLink(inputUrl, authorityRegistry) {
  try {
    if (!isNonEmpty(inputUrl)) throw new Error('URL_EMPTY');
    const parsed = new URL(inputUrl, 'https://f5.invalid');
    if (parsed.pathname !== BASE_ROUTE) throw new Error('BASE_ROUTE_MISMATCH');
    if (parsed.search !== '') throw new Error('QUERY_NOT_AUTHORIZED');
    if (!parsed.hash.startsWith(FRAGMENT_PREFIX)) throw new Error('FRAGMENT_PREFIX_MISMATCH');
    const tail = parsed.hash.slice(FRAGMENT_PREFIX.length);
    const dot = tail.lastIndexOf('.');
    if (dot <= 0) throw new Error('CAPSULE_FRAGMENT_MALFORMED');
    const payload = tail.slice(0, dot);
    const digest = tail.slice(dot + 1);
    if (!/^[a-f0-9]{64}$/.test(digest)) throw new Error('CAPSULE_DIGEST_MALFORMED');
    const canonical = b64urlDecodeUtf8(payload);
    if (sha256(canonical) !== digest) throw new Error('CAPSULE_DIGEST_MISMATCH');
    let capsule;
    try { capsule = JSON.parse(canonical); } catch { throw new Error('CAPSULE_JSON_PARSE_FAILURE'); }
    const normalized = canonicalCapsuleObject(capsule, authorityRegistry);
    if (JSON.stringify(normalized) !== canonical) throw new Error('CAPSULE_NON_CANONICAL_SERIALIZATION');
    const stateBytes = b64urlDecodeUtf8(normalized.stateBytesB64Url);
    if (sha256(stateBytes) !== normalized.stateSha256) throw new Error('STATE_DIGEST_MISMATCH');
    const restored = restoreCanonical(stateBytes);
    if (!restored.canonical) throw new Error(`STATE_RESTORE_FAILURE:${(restored.errors ?? []).join('|')}`);
    const authorized = validateAuthorizedState(restored.state, normalized.entryPointId, authorityRegistry);
    if (!authorized.valid) throw new Error(`STATE_OUTRUNS_ENTRYPOINT_AUTHORITY:${authorized.errors.join('|')}`);
    const canonicalUrl = `${BASE_ROUTE}${FRAGMENT_PREFIX}${payload}.${digest}`;
    return { valid: true, errors: [], canonicalUrl, state: restored.state, resolutionClass: restored.resolutionClass, entryPointId: normalized.entryPointId, returnContext: normalized.returnContext };
  } catch (error) {
    return { valid: false, errors: [error.message], canonicalUrl: null, state: null, resolutionClass: 'INVALID', entryPointId: null, returnContext: null };
  }
}

export function navigateWithinState(state, routeId) {
  if (!isNonEmpty(routeId)) return { valid: false, errors: ['ROUTE_ID_INVALID'], state: null };
  const next = clone(state);
  const routeAxis = next?.axes?.ROUTE_HISTORY;
  if (!routeAxis) return { valid: false, errors: ['ROUTE_HISTORY_AXIS_MISSING'], state: null };
  if (routeAxis.status === 'UNEVALUABLE') return { valid: false, errors: ['ROUTE_HISTORY_UNEVALUABLE'], state: null };
  const prior = routeAxis.status === 'DECLARED' ? routeAxis.value : [];
  next.axes.ROUTE_HISTORY = {
    status: 'DECLARED',
    authorityRef: 'F5_NAVIGATION_CONTINUITY_AUTHORITY',
    sourceRef: 'F5_EXPLICIT_ROUTE_HISTORY',
    value: [...prior, routeId]
  };
  const transition = validateTransition(state, next, 'NAVIGATION');
  if (!transition.valid) return { valid: false, errors: transition.errors, state: null };
  return { valid: true, errors: [], state: next, changedAxes: transition.changedAxes };
}

export function buildCrossObjectDeepLink(originState, originEntryPointId, destinationState, destinationEntryPointId, relationId, semanticRelationRegistry, authorityRegistry, originRoute = 'ORIGIN', originDepth = 'F6_UNDEFINED', destinationRoute = 'DESTINATION') {
  const originAuthorized = validateAuthorizedState(originState, originEntryPointId, authorityRegistry);
  const destinationAuthorized = validateAuthorizedState(destinationState, destinationEntryPointId, authorityRegistry);
  if (!originAuthorized.valid || !destinationAuthorized.valid) throw new Error('CROSS_OBJECT_STATE_UNAUTHORIZED');
  const originObject = objectIdentity(originAuthorized.state).objectId;
  const destinationObject = objectIdentity(destinationAuthorized.state).objectId;
  const matches = (semanticRelationRegistry?.bundledRelations ?? []).filter(r => r.relationId === relationId && r.fromObjectId === originObject && r.toObjectId === destinationObject);
  if (matches.length !== 1) throw new Error(matches.length === 0 ? 'DECLARED_SEMANTIC_RELATION_NO_MATCH' : 'DECLARED_SEMANTIC_RELATION_AMBIGUOUS');
  const returnContext = createReturnContext(originAuthorized.state, originEntryPointId, originRoute, originDepth, relationId, destinationRoute, authorityRegistry);
  return encodeDeepLink(destinationAuthorized.state, destinationEntryPointId, authorityRegistry, returnContext);
}

export function restoreReturn(returnContext, authorityRegistry) {
  const checked = validateReturnContext(returnContext, authorityRegistry);
  return checked.valid
    ? { valid: true, errors: [], state: checked.state, route: checked.route, entryPointId: checked.entryPointId }
    : { valid: false, errors: checked.errors, state: null, route: null, entryPointId: null, disposition: 'EXPLICIT_NON_RESTORABLE_STATE' };
}

export function createHistoryLedger(initialUrl, authorityRegistry) {
  const decoded = decodeDeepLink(initialUrl, authorityRegistry);
  if (!decoded.valid) throw new Error(`HISTORY_INITIAL_ENTRY_INVALID:${decoded.errors.join('|')}`);
  return { entries: [decoded.canonicalUrl], index: 0 };
}

export function historyPush(ledger, url, authorityRegistry) {
  const decoded = decodeDeepLink(url, authorityRegistry);
  if (!decoded.valid) return { valid: false, errors: decoded.errors, ledger: clone(ledger), restored: null };
  const entries = ledger.entries.slice(0, ledger.index + 1);
  entries.push(decoded.canonicalUrl);
  const next = { entries, index: entries.length - 1 };
  return { valid: true, errors: [], ledger: next, restored: decoded };
}

export function historyBack(ledger, authorityRegistry) {
  if (ledger.index <= 0) return { valid: false, errors: ['NO_MATCH_BACK'], ledger: clone(ledger), restored: null };
  const next = { entries: [...ledger.entries], index: ledger.index - 1 };
  const restored = decodeDeepLink(next.entries[next.index], authorityRegistry);
  if (!restored.valid) return { valid: false, errors: restored.errors, ledger: clone(ledger), restored: null };
  return { valid: true, errors: [], ledger: next, restored };
}

export function historyForward(ledger, authorityRegistry) {
  if (ledger.index >= ledger.entries.length - 1) return { valid: false, errors: ['NO_MATCH_FORWARD'], ledger: clone(ledger), restored: null };
  const next = { entries: [...ledger.entries], index: ledger.index + 1 };
  const restored = decodeDeepLink(next.entries[next.index], authorityRegistry);
  if (!restored.valid) return { valid: false, errors: restored.errors, ledger: clone(ledger), restored: null };
  return { valid: true, errors: [], ledger: next, restored };
}

export function reloadFromUrl(url, authorityRegistry) {
  return decodeDeepLink(url, authorityRegistry);
}
