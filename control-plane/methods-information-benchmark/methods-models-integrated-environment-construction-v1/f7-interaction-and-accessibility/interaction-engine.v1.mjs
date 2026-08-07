import {
  buildAuthorityRegistry,
  validateAuthorizedState,
  navigateWithinState
} from '../f5-navigation-and-continuity/navigator.v1.mjs';
import {
  projectDepth,
  inquireField,
  compareDepthIdentity
} from '../f6-depth-and-inquiry/depth-projector.v1.mjs';

export const SESSION_SCHEMA = 'METHODS_MODELS_INTERACTION_SESSION_v1';
export const ACTION_SCHEMA = 'METHODS_MODELS_INTERACTION_ACTION_v1';
export const USER_MODALITIES = Object.freeze(['POINTER','KEYBOARD','TOUCH','ASSISTIVE_TECHNOLOGY']);
export const MOTION_MODES = Object.freeze(['SYSTEM','FULL','REDUCED']);
export const VIEWPORT_CLASSES = Object.freeze(['MOBILE','TABLET','DESKTOP']);

const clone = value => structuredClone(value);
const isObject = value => value !== null && typeof value === 'object' && !Array.isArray(value);
const isNonEmpty = value => typeof value === 'string' && value.length > 0;
const same = (a, b) => JSON.stringify(a) === JSON.stringify(b);

function exactOne(items, predicate, noMatch, ambiguous) {
  if (!Array.isArray(items)) throw new Error('REGISTRY_NOT_ARRAY');
  const matches = items.filter(predicate);
  if (matches.length === 0) throw new Error(noMatch);
  if (matches.length !== 1) throw new Error(ambiguous);
  return matches[0];
}

function validateModalityRegistry(registry) {
  const ids = (registry?.modalities ?? []).map(item => item.id);
  if (!same(ids, USER_MODALITIES)) throw new Error('MODALITY_REGISTRY_MISMATCH');
}

function controlById(registry, controlId) {
  return exactOne(
    registry?.controls,
    control => control.controlId === controlId,
    'CONTROL_NO_MATCH',
    'CONTROL_AMBIGUOUS'
  );
}

function bindingByContent(stateBindings, contentId) {
  return exactOne(
    stateBindings?.bindings,
    binding => binding.contentId === contentId,
    'STATE_BINDING_NO_MATCH',
    'STATE_BINDING_AMBIGUOUS'
  );
}

function validateActionShape(action) {
  if (!isObject(action)) throw new Error('ACTION_INVALID');
  const keys = Object.keys(action).sort();
  if (!same(keys, ['controlId','kind','modality','payload','schema'])) throw new Error('ACTION_FIELDS_INVALID');
  if (action.schema !== ACTION_SCHEMA) throw new Error('ACTION_SCHEMA_MISMATCH');
  if (!['FOCUS','ACTIVATE'].includes(action.kind)) throw new Error('ACTION_KIND_INVALID');
  if (!USER_MODALITIES.includes(action.modality)) throw new Error('ACTION_MODALITY_INVALID');
  if (!isNonEmpty(action.controlId) || !isObject(action.payload)) throw new Error('ACTION_PAYLOAD_INVALID');
}

function validateSessionShape(session) {
  if (!isObject(session) || session.schema !== SESSION_SCHEMA) throw new Error('SESSION_INVALID');
  if (!isNonEmpty(session.entryPointId) || !isObject(session.state)) throw new Error('SESSION_INVALID');
  if (!isNonEmpty(session.scientificStateSha256) || !isNonEmpty(session.scientificBindingSha256)) throw new Error('SESSION_DIGEST_INVALID');
  if (!['D0','D1','D2','D3','D4'].includes(session.activeDepth)) throw new Error('SESSION_DEPTH_INVALID');
  if (!isObject(session.projection)) throw new Error('SESSION_PROJECTION_INVALID');
  if (session.focusTarget !== null && !isNonEmpty(session.focusTarget)) throw new Error('SESSION_FOCUS_INVALID');
  if (!MOTION_MODES.includes(session.motionPreference)) throw new Error('SESSION_MOTION_INVALID');
  if (!VIEWPORT_CLASSES.includes(session.viewportClass)) throw new Error('SESSION_VIEWPORT_INVALID');
}

function validateAuthorizedSession(session, context) {
  validateSessionShape(session);
  const authorized = validateAuthorizedState(session.state, session.entryPointId, context.authorityRegistry);
  if (!authorized.valid) throw new Error(`SESSION_STATE_UNAUTHORIZED:${authorized.errors.join('|')}`);
  if (authorized.sha256 !== session.scientificStateSha256) throw new Error('SESSION_STATE_DIGEST_MISMATCH');
  const expectedProjection = projectDepth(session.entryPointId, session.activeDepth, context.empiricalRegistry, context.stateBindings, context.depthProfileRegistry);
  if (!expectedProjection.valid) throw new Error(`SESSION_PROJECTION_RECOMPUTE_FAILED:${expectedProjection.errors.join('|')}`);
  if (expectedProjection.projection.scientificStateSha256 !== session.scientificBindingSha256) throw new Error('SESSION_BINDING_DIGEST_MISMATCH');
  if (!same(expectedProjection.projection, session.projection)) throw new Error('SESSION_PROJECTION_TAMPERED');
  return authorized;
}

function recoverySnapshot(session) {
  validateSessionShape(session);
  return {
    ENTRY_POINT_ID: session.entryPointId,
    SCIENTIFIC_STATE_SHA256: session.scientificStateSha256,
    SCIENTIFIC_BINDING_SHA256: session.scientificBindingSha256,
    ACTIVE_DEPTH: session.activeDepth,
    FOCUS_TARGET: session.focusTarget,
    MOTION_PREFERENCE: session.motionPreference,
    VIEWPORT_CLASS: session.viewportClass
  };
}

function fail(session, error) {
  return {
    valid: false,
    errors: [error instanceof Error ? error.message : String(error)],
    session: clone(session),
    output: null,
    recovery: recoverySnapshot(session)
  };
}

export function buildInteractionContext({ entrypointRegistry, stateBindings, empiricalRegistry, depthProfileRegistry, controlRegistry, modalityRegistry }) {
  validateModalityRegistry(modalityRegistry);
  const authorityRegistry = buildAuthorityRegistry(entrypointRegistry, stateBindings);
  for (const control of controlRegistry?.controls ?? []) {
    if (!isNonEmpty(control.controlId) || !isNonEmpty(control.role) || !isNonEmpty(control.operation) || !isNonEmpty(control.accessibleName)) throw new Error('CONTROL_REGISTRY_INVALID');
  }
  return Object.freeze({
    entrypointRegistry: clone(entrypointRegistry),
    stateBindings: clone(stateBindings),
    empiricalRegistry: clone(empiricalRegistry),
    depthProfileRegistry: clone(depthProfileRegistry),
    controlRegistry: clone(controlRegistry),
    modalityRegistry: clone(modalityRegistry),
    authorityRegistry
  });
}

export function createInteractionSession(entryPointId, context, depth = 'D0') {
  try {
    const record = context?.authorityRegistry?.[entryPointId];
    if (!record) throw new Error('ENTRYPOINT_NO_AUTHORITY');
    const authorized = validateAuthorizedState(record.baseState, entryPointId, context.authorityRegistry);
    if (!authorized.valid) throw new Error(`ENTRYPOINT_STATE_UNAUTHORIZED:${authorized.errors.join('|')}`);
    const projectionResult = projectDepth(entryPointId, depth, context.empiricalRegistry, context.stateBindings, context.depthProfileRegistry);
    if (!projectionResult.valid) throw new Error(`DEPTH_PROJECTION_FAILED:${projectionResult.errors.join('|')}`);
    const session = {
      schema: SESSION_SCHEMA,
      entryPointId,
      state: authorized.state,
      scientificStateSha256: authorized.sha256,
      scientificBindingSha256: projectionResult.projection.scientificStateSha256,
      activeDepth: depth,
      projection: projectionResult.projection,
      focusTarget: null,
      motionPreference: 'SYSTEM',
      viewportClass: 'DESKTOP'
    };
    validateAuthorizedSession(session, context);
    return { valid: true, errors: [], session };
  } catch (error) {
    return { valid: false, errors: [error.message], session: null };
  }
}

export function adaptViewport(session, viewportClass, context) {
  try {
    validateAuthorizedSession(session, context);
    if (!VIEWPORT_CLASSES.includes(viewportClass)) throw new Error('VIEWPORT_CLASS_INVALID');
    const next = clone(session);
    next.viewportClass = viewportClass;
    validateAuthorizedSession(next, context);
    if (next.scientificStateSha256 !== session.scientificStateSha256 || next.scientificBindingSha256 !== session.scientificBindingSha256 || next.activeDepth !== session.activeDepth) throw new Error('VIEWPORT_ADAPTATION_MUTATED_AUTHORITY');
    return { valid: true, errors: [], session: next, output: { viewportClass } };
  } catch (error) {
    return fail(session, error);
  }
}

export function performInteraction(session, action, context) {
  try {
    validateAuthorizedSession(session, context);
    validateActionShape(action);
    const control = controlById(context.controlRegistry, action.controlId);

    if (action.kind === 'FOCUS') {
      if (control.focusable !== true) throw new Error('CONTROL_NOT_FOCUSABLE');
      if (Object.keys(action.payload).length !== 0) throw new Error('FOCUS_PAYLOAD_MUST_BE_EMPTY');
      const next = clone(session);
      next.focusTarget = control.controlId;
      validateAuthorizedSession(next, context);
      return { valid: true, errors: [], session: next, output: { operation: 'FOCUS_MOVE', controlId: control.controlId } };
    }

    const next = clone(session);
    let output = { operation: control.operation, controlId: control.controlId };

    switch (control.operation) {
      case 'REQUEST_DEPTH': {
        if (Object.keys(action.payload).length !== 0) throw new Error('DEPTH_CONTROL_PAYLOAD_MUST_BE_EMPTY');
        const requestedDepth = control?.payload?.depth;
        if (!['D0','D1','D2','D3','D4'].includes(requestedDepth)) throw new Error('REGISTERED_DEPTH_INVALID');
        const projected = projectDepth(session.entryPointId, requestedDepth, context.empiricalRegistry, context.stateBindings, context.depthProfileRegistry);
        if (!projected.valid) throw new Error(`DEPTH_PROJECTION_FAILED:${projected.errors.join('|')}`);
        const identity = compareDepthIdentity(session.projection, projected.projection);
        if (!identity.valid) throw new Error(`DEPTH_CHANGED_SCIENTIFIC_IDENTITY:${identity.errors.join('|')}`);
        if (projected.projection.scientificStateSha256 !== session.scientificBindingSha256) throw new Error('DEPTH_CHANGED_BINDING_DIGEST');
        next.activeDepth = requestedDepth;
        next.projection = projected.projection;
        output = { ...output, depth: requestedDepth, scientificBindingSha256: projected.projection.scientificStateSha256 };
        break;
      }
      case 'INQUIRE_FIELD': {
        if (!same(Object.keys(action.payload).sort(), ['field'])) throw new Error('INQUIRY_PAYLOAD_INVALID');
        const result = inquireField(session.projection, action.payload.field);
        if (!result.valid) throw new Error(result.errors.join('|'));
        output = { ...output, field: action.payload.field, value: result.value, depth: session.activeDepth };
        break;
      }
      case 'NAVIGATE_ROUTE': {
        if (!same(Object.keys(action.payload).sort(), ['routeId'])) throw new Error('ROUTE_PAYLOAD_INVALID');
        const routed = navigateWithinState(session.state, action.payload.routeId);
        if (!routed.valid) throw new Error(`NAVIGATION_FAILED:${routed.errors.join('|')}`);
        const authorized = validateAuthorizedState(routed.state, session.entryPointId, context.authorityRegistry);
        if (!authorized.valid) throw new Error(`NAVIGATION_OUTRUNS_AUTHORITY:${authorized.errors.join('|')}`);
        next.state = authorized.state;
        next.scientificStateSha256 = authorized.sha256;
        output = { ...output, routeId: action.payload.routeId, changedAxes: routed.changedAxes, scientificStateSha256: authorized.sha256 };
        break;
      }
      case 'SET_MOTION_PREFERENCE': {
        if (!same(Object.keys(action.payload).sort(), ['preference'])) throw new Error('MOTION_PAYLOAD_INVALID');
        if (!MOTION_MODES.includes(action.payload.preference)) throw new Error('MOTION_PREFERENCE_INVALID');
        next.motionPreference = action.payload.preference;
        output = { ...output, preference: action.payload.preference };
        break;
      }
      default:
        throw new Error('CONTROL_OPERATION_NOT_ACTIVATABLE');
    }

    if (control.operation !== 'NAVIGATE_ROUTE' && next.scientificStateSha256 !== session.scientificStateSha256) throw new Error('INTERACTION_MUTATED_SCIENTIFIC_STATE');
    if (next.scientificBindingSha256 !== session.scientificBindingSha256) throw new Error('INTERACTION_MUTATED_SCIENTIFIC_BINDING');
    validateAuthorizedSession(next, context);
    return { valid: true, errors: [], session: next, output };
  } catch (error) {
    return fail(session, error);
  }
}

export function compareModalityEquivalentResults(results) {
  if (!Array.isArray(results) || results.length === 0 || results.some(result => result?.valid !== true)) return { valid: false, errors: ['RESULT_SET_INVALID'] };
  const first = results[0];
  const fields = ['entryPointId','scientificStateSha256','scientificBindingSha256','activeDepth','focusTarget','motionPreference','viewportClass'];
  const errors = [];
  for (let i = 1; i < results.length; i += 1) {
    for (const field of fields) if (!same(results[i].session[field], first.session[field])) errors.push(`MODALITY_RESULT_MISMATCH:${field}`);
    if (!same(results[i].output, first.output)) errors.push('MODALITY_OUTPUT_MISMATCH');
  }
  return { valid: errors.length === 0, errors };
}

export function sessionRecoverySnapshot(session) {
  return recoverySnapshot(session);
}

export function bindingStateForSession(session, context) {
  validateAuthorizedSession(session, context);
  return clone(bindingByContent(context.stateBindings, session.entryPointId).state);
}
