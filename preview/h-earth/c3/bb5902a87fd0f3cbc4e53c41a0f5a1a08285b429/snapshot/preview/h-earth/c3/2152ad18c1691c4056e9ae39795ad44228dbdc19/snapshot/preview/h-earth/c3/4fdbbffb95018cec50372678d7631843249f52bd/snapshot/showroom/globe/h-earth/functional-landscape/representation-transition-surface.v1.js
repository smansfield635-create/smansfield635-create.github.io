/**
 * H_EARTH_REPRESENTATION_TRANSITION_SURFACE_v1
 *
 * Representation-owned H-side transition capability. Canonical identity and
 * transition-receipt authority are external mandatory dependencies. This
 * module owns no world representation state and exposes only P1 transition
 * references plus bounded transaction evidence.
 */

export const H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID =
  'H_EARTH_REPRESENTATION_TRANSITION_SURFACE_v1';

export const H_EARTH_TRANSITION_DIRECTIONS = Object.freeze({
  OUTBOUND: 'H_TO_O',
  INBOUND: 'O_TO_H'
});

export const H_EARTH_TRANSITION_P1_KEYS = Object.freeze([
  'canonicalPlaceId',
  'correspondenceId',
  'direction',
  'entryAnchorId',
  'returnContextId',
  'transitionReceiptId'
]);

const OUTBOUND_REQUEST_KEYS = Object.freeze([
  'canonicalPlaceId',
  'correspondenceId',
  'entryAnchorId',
  'transitionReceiptId'
]);

const freeze = (value, seen = new WeakSet()) => {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) return value;
  if (seen.has(value)) return value;
  seen.add(value);
  for (const nested of Object.values(value)) freeze(nested, seen);
  return Object.freeze(value);
};

const clone = (value) => JSON.parse(JSON.stringify(value));
const nonEmptyString = (value) =>
  typeof value === 'string' && value.trim().length > 0 && value === value.trim();
const exactKeys = (value, keys) => {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const actual = Object.keys(value).sort();
  const expected = [...keys].sort();
  return actual.length === expected.length &&
    actual.every((key, index) => key === expected[index]);
};

const stageState = (validate = 'NOT_REACHED', prepare = 'NOT_REACHED', accept = 'NOT_REACHED', commit = 'NOT_REACHED') =>
  freeze({ VALIDATE: validate, PREPARE: prepare, ACCEPT: accept, COMMIT: commit });

const failed = (status, stages) => freeze({
  ok: false,
  status,
  commit: false,
  stages
});

const committed = (status, sharedPayload, stages) => freeze({
  ok: true,
  status,
  commit: true,
  sharedPayload: freeze(clone(sharedPayload)),
  stages
});

function validateAuthorityAdapters(authorityAdapters) {
  if (!authorityAdapters || typeof authorityAdapters !== 'object') {
    return 'EXTERNAL_AUTHORITY_ADAPTERS_REQUIRED';
  }
  if (typeof authorityAdapters.validateCanonicalPlaceReference !== 'function') {
    return 'CANONICAL_REFERENCE_AUTHORITY_REQUIRED';
  }
  if (typeof authorityAdapters.validateTransitionReceipt !== 'function') {
    return 'TRANSITION_RECEIPT_AUTHORITY_REQUIRED';
  }
  return null;
}

function validateCommonReferences(input) {
  if (!nonEmptyString(input.canonicalPlaceId)) return 'CANONICAL_REFERENCE_REQUIRED';
  if (!nonEmptyString(input.correspondenceId)) return 'CORRESPONDENCE_REFERENCE_REQUIRED';
  if (!nonEmptyString(input.entryAnchorId)) return 'H_ANCHOR_REFERENCE_REQUIRED';
  if (!nonEmptyString(input.transitionReceiptId)) return 'TRANSITION_RECEIPT_REQUIRED';
  return null;
}

function validateCanonicalReference(canonicalPlaceId, authorityAdapters) {
  try {
    return authorityAdapters.validateCanonicalPlaceReference(canonicalPlaceId) === true;
  } catch {
    return false;
  }
}

function validateTransitionReceipt(input, authorityAdapters) {
  try {
    return authorityAdapters.validateTransitionReceipt(freeze(clone(input))) === true;
  } catch {
    return false;
  }
}

function validateHAdapter(adapter) {
  const required = [
    'listTransitionAnchorIds',
    'isKnownTransitionAnchor',
    'isTransitionAnchorActive',
    'getReturnContextId',
    'isKnownReturnContext',
    'prepareRestore',
    'commitRestore'
  ];
  return adapter && typeof adapter === 'object' &&
    required.every((name) => typeof adapter[name] === 'function');
}

export function createHEarthRepresentationTransitionSurface({ hRepresentationAdapter } = {}) {
  if (!validateHAdapter(hRepresentationAdapter)) {
    throw new TypeError('H_EARTH_REPRESENTATION_ADAPTER_REQUIRED');
  }

  const getCapabilityDescriptor = () => freeze({
    surfaceId: H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID,
    owner: 'H_EARTH',
    outbound: true,
    inbound: true,
    transitionPresentation: false,
    canonicalIdentityAuthority: false,
    canonicalReferencePolicy: freeze({
      required: true,
      default: null,
      fallback: null,
      autoMint: false
    }),
    sharedPayloadKeys: [...H_EARTH_TRANSITION_P1_KEYS],
    anchorIds: [...hRepresentationAdapter.listTransitionAnchorIds()]
  });

  const requestOutboundTransition = (request, authorityAdapters) => {
    const authorityIssue = validateAuthorityAdapters(authorityAdapters);
    if (authorityIssue) return failed(authorityIssue, stageState('FAIL'));
    if (!exactKeys(request, OUTBOUND_REQUEST_KEYS)) {
      return failed('OUTBOUND_REQUEST_SHAPE_INVALID', stageState('FAIL'));
    }
    const commonIssue = validateCommonReferences(request);
    if (commonIssue) return failed(commonIssue, stageState('FAIL'));
    if (!validateCanonicalReference(request.canonicalPlaceId, authorityAdapters)) {
      return failed('CANONICAL_REFERENCE_INVALID', stageState('FAIL'));
    }
    if (!hRepresentationAdapter.isKnownTransitionAnchor(request.entryAnchorId)) {
      return failed('UNKNOWN_H_ANCHOR', stageState('FAIL'));
    }
    const receiptInput = freeze({
      canonicalPlaceId: request.canonicalPlaceId,
      correspondenceId: request.correspondenceId,
      direction: H_EARTH_TRANSITION_DIRECTIONS.OUTBOUND,
      entryAnchorId: request.entryAnchorId,
      transitionReceiptId: request.transitionReceiptId
    });
    if (!validateTransitionReceipt(receiptInput, authorityAdapters)) {
      return failed('TRANSITION_RECEIPT_INVALID', stageState('FAIL'));
    }

    if (!hRepresentationAdapter.isTransitionAnchorActive(request.entryAnchorId)) {
      return failed('H_ANCHOR_NOT_ACTIVE', stageState('PASS', 'FAIL'));
    }
    const returnContextId = hRepresentationAdapter.getReturnContextId(request.entryAnchorId);
    if (!nonEmptyString(returnContextId)) {
      return failed('RETURN_CONTEXT_UNAVAILABLE', stageState('PASS', 'FAIL'));
    }

    const sharedPayload = freeze({
      canonicalPlaceId: request.canonicalPlaceId,
      correspondenceId: request.correspondenceId,
      direction: H_EARTH_TRANSITION_DIRECTIONS.OUTBOUND,
      entryAnchorId: request.entryAnchorId,
      returnContextId,
      transitionReceiptId: request.transitionReceiptId
    });
    if (!exactKeys(sharedPayload, H_EARTH_TRANSITION_P1_KEYS)) {
      return failed('P1_ALLOWLIST_VIOLATION', stageState('PASS', 'PASS', 'FAIL'));
    }

    return committed(
      'H_OUT_COMMITTED',
      sharedPayload,
      stageState('PASS', 'PASS', 'PASS', 'PASS')
    );
  };

  const requestInboundRestore = (sharedPayload, authorityAdapters) => {
    const authorityIssue = validateAuthorityAdapters(authorityAdapters);
    if (authorityIssue) return failed(authorityIssue, stageState('FAIL'));
    if (!exactKeys(sharedPayload, H_EARTH_TRANSITION_P1_KEYS)) {
      return failed('SHARED_PAYLOAD_SHAPE_INVALID', stageState('FAIL'));
    }
    const commonIssue = validateCommonReferences(sharedPayload);
    if (commonIssue) return failed(commonIssue, stageState('FAIL'));
    if (sharedPayload.direction !== H_EARTH_TRANSITION_DIRECTIONS.INBOUND) {
      return failed('INBOUND_DIRECTION_INVALID', stageState('FAIL'));
    }
    if (!nonEmptyString(sharedPayload.returnContextId)) {
      return failed('RETURN_CONTEXT_MALFORMED', stageState('FAIL'));
    }
    if (!validateCanonicalReference(sharedPayload.canonicalPlaceId, authorityAdapters)) {
      return failed('CANONICAL_REFERENCE_INVALID', stageState('FAIL'));
    }
    if (!hRepresentationAdapter.isKnownTransitionAnchor(sharedPayload.entryAnchorId)) {
      return failed('UNKNOWN_H_ANCHOR', stageState('FAIL'));
    }
    if (!hRepresentationAdapter.isKnownReturnContext(
      sharedPayload.entryAnchorId,
      sharedPayload.returnContextId
    )) {
      return failed('RETURN_CONTEXT_INVALID', stageState('FAIL'));
    }
    if (!validateTransitionReceipt(sharedPayload, authorityAdapters)) {
      return failed('TRANSITION_RECEIPT_INVALID', stageState('FAIL'));
    }

    let prepared;
    try {
      prepared = hRepresentationAdapter.prepareRestore(
        sharedPayload.entryAnchorId,
        sharedPayload.returnContextId
      );
    } catch {
      prepared = null;
    }
    if (!prepared || typeof prepared !== 'object') {
      return failed('RESTORE_PREPARATION_FAILED', stageState('PASS', 'FAIL'));
    }

    const acceptedPayload = freeze(clone(sharedPayload));
    if (!exactKeys(acceptedPayload, H_EARTH_TRANSITION_P1_KEYS)) {
      return failed('P1_ALLOWLIST_VIOLATION', stageState('PASS', 'PASS', 'FAIL'));
    }

    let restoreCommitted = false;
    try {
      restoreCommitted = hRepresentationAdapter.commitRestore(prepared) === true;
    } catch {
      restoreCommitted = false;
    }
    if (!restoreCommitted) {
      return failed('RESTORE_COMMIT_FAILED', stageState('PASS', 'PASS', 'PASS', 'FAIL'));
    }

    return committed(
      'H_IN_COMMITTED',
      acceptedPayload,
      stageState('PASS', 'PASS', 'PASS', 'PASS')
    );
  };

  return freeze({
    surfaceId: H_EARTH_REPRESENTATION_TRANSITION_SURFACE_ID,
    getCapabilityDescriptor,
    requestOutboundTransition,
    requestInboundRestore
  });
}

export default createHEarthRepresentationTransitionSurface;
