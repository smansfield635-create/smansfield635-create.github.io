/**
 * /showroom/globe/h-earth/diagnostic/capture-runtime.js
 * Mutable execution authority for one browser capture run.
 */

import {
  arrayBufferToBase64,
  calculateSha256,
  classifyPayloadShape,
  decodeUtf8,
  decodeUtf8Prefix,
  equivalentUrl,
  extractContractCandidates,
  nowIso,
  projectBrowserExposedHeaders,
  projectError
} from './evidence.js';

export const H_EARTH_FD05_ROW_LIFECYCLE_STATES = Object.freeze([
  'SCHEDULED',
  'TRANSPORT_FETCHING',
  'TRANSPORT_FETCH_FULFILLED',
  'TRANSPORT_FETCH_REJECTED',
  'BODY_CAPTURE_COMPLETE',
  'BODY_DIGEST_COMPLETE',
  'TRANSPORT_OUTCOME_RECORDED',
  'NATIVE_IMPORT_QUEUED',
  'NATIVE_IMPORT_RUNNING',
  'NATIVE_IMPORT_FULFILLED',
  'NATIVE_IMPORT_REJECTED',
  'NATIVE_IMPORT_NOT_REACHED_INSTRUMENT_IMPOSSIBILITY',
  'NATIVE_IMPORT_RESULT_UNOBSERVABLE_INSTRUMENT_FAILURE',
  'TERMINAL_PASS',
  'TERMINAL_FINDING',
  'TERMINAL_UNRESOLVED'
]);

const TERMINAL_STATES = new Set([
  'TERMINAL_PASS',
  'TERMINAL_FINDING',
  'TERMINAL_UNRESOLVED'
]);

const ALLOWED_TRANSITIONS = Object.freeze({
  SCHEDULED: Object.freeze(['TRANSPORT_FETCHING']),
  TRANSPORT_FETCHING: Object.freeze([
    'TRANSPORT_FETCH_FULFILLED',
    'TRANSPORT_FETCH_REJECTED'
  ]),
  TRANSPORT_FETCH_FULFILLED: Object.freeze([
    'BODY_CAPTURE_COMPLETE',
    'TRANSPORT_OUTCOME_RECORDED'
  ]),
  TRANSPORT_FETCH_REJECTED: Object.freeze(['TRANSPORT_OUTCOME_RECORDED']),
  BODY_CAPTURE_COMPLETE: Object.freeze([
    'BODY_DIGEST_COMPLETE',
    'TRANSPORT_OUTCOME_RECORDED'
  ]),
  BODY_DIGEST_COMPLETE: Object.freeze(['TRANSPORT_OUTCOME_RECORDED']),
  TRANSPORT_OUTCOME_RECORDED: Object.freeze(['NATIVE_IMPORT_QUEUED']),
  NATIVE_IMPORT_QUEUED: Object.freeze([
    'NATIVE_IMPORT_RUNNING',
    'NATIVE_IMPORT_NOT_REACHED_INSTRUMENT_IMPOSSIBILITY'
  ]),
  NATIVE_IMPORT_RUNNING: Object.freeze([
    'NATIVE_IMPORT_FULFILLED',
    'NATIVE_IMPORT_REJECTED',
    'NATIVE_IMPORT_RESULT_UNOBSERVABLE_INSTRUMENT_FAILURE'
  ]),
  NATIVE_IMPORT_FULFILLED: Object.freeze([
    'TERMINAL_PASS',
    'TERMINAL_FINDING',
    'TERMINAL_UNRESOLVED'
  ]),
  NATIVE_IMPORT_REJECTED: Object.freeze([
    'TERMINAL_FINDING',
    'TERMINAL_UNRESOLVED'
  ]),
  NATIVE_IMPORT_NOT_REACHED_INSTRUMENT_IMPOSSIBILITY: Object.freeze([
    'TERMINAL_UNRESOLVED'
  ]),
  NATIVE_IMPORT_RESULT_UNOBSERVABLE_INSTRUMENT_FAILURE: Object.freeze([
    'TERMINAL_UNRESOLVED'
  ]),
  TERMINAL_PASS: Object.freeze([]),
  TERMINAL_FINDING: Object.freeze([]),
  TERMINAL_UNRESOLVED: Object.freeze([])
});

function createDigestComparison(authority, observedDigest, bodyDisposition) {
  const sourceEstablished = authority.sourceDigestStatus === 'ESTABLISHED';
  const bodyComplete = bodyDisposition === 'COMPLETE';
  const comparisonEligible = sourceEstablished && bodyComplete;
  const comparisonPerformed = comparisonEligible;

  let result = 'UNEVALUABLE';
  let unevaluableReason = null;

  if (comparisonPerformed) {
    result =
      authority.expectedDigest === observedDigest
        ? 'MATCH'
        : 'MISMATCH';
  } else if (!bodyComplete) {
    unevaluableReason =
      bodyDisposition === 'RESOLVED_ABSENCE'
        ? 'TRANSPORT_REJECTED_RESOLVED_ABSENCE'
        : 'BODY_CUSTODY_UNRESOLVED';
  } else if (!sourceEstablished) {
    unevaluableReason = 'SOURCE_DIGEST_UNEVALUATED';
  } else {
    unevaluableReason = 'COMPARISON_NOT_AUTHORIZED';
  }

  return {
    expectedDigest: authority.expectedDigest,
    expectedDigestDomain: authority.expectedDigestDomain,
    expectedDigestAuthority: authority.expectedDigestAuthority,
    sourceDigestStatus: authority.sourceDigestStatus,
    comparisonEligible,
    comparisonPerformed,
    observedDeployedDigest: comparisonPerformed ? observedDigest : null,
    result,
    unevaluableReason,
    evidenceReferences: comparisonPerformed
      ? ['row.deployedSha256', 'manifest-projection.digestAuthority']
      : ['row.bodyCustodyDisposition', 'manifest-projection.digestAuthority']
  };
}

export function initializeHEarthFd05Row(manifestRow, timestamp = nowIso()) {
  return {
    captureOrder: manifestRow.captureOrder,
    repositoryPath: manifestRow.repositoryPath,
    importParents: manifestRow.importParents.map((parent) => ({ ...parent })),
    requestedDeployedUrl: manifestRow.requestedDeployedUrl,
    expectedResponseClass: manifestRow.expectedResponseClass,
    currentState: 'SCHEDULED',
    terminalState: null,
    stateHistory: [
      {
        state: 'SCHEDULED',
        timestamp,
        detail: 'ROW_INITIALIZED_FROM_ACCEPTED_MANIFEST_PROJECTION'
      }
    ],
    finalResponseUrl: null,
    redirected: null,
    httpStatus: null,
    responseType: null,
    responseOk: null,
    contentType: null,
    browserExposedResponseHeaders: [],
    completeWireResponseHeadersObserved: false,
    responseByteLength: null,
    deployedSha256: null,
    boundedResponsePrefix: null,
    payloadShape: null,
    observedContractCandidates: [],
    expectedContractId: manifestRow.expectedContractId,
    exactExpectedContractLiteralObserved: null,
    contractCorrespondenceDisposition: null,
    serviceWorkerControllerPresent: null,
    serviceWorkerControllerScriptUrl: null,
    transportResult: null,
    bodyCustodyDisposition: null,
    capturedBodyEncoding: null,
    capturedBodyBase64: null,
    driveDigestComparison: null,
    repositoryDigestComparison: null,
    nativeImportPolicy: manifestRow.nativeImportPolicy,
    nativeImportAuthorized: manifestRow.nativeImportAuthorized,
    nativeImportSkipReason: manifestRow.nativeImportSkipReason,
    nativeImportRiskFlags: { ...manifestRow.nativeImportRiskFlags },
    nativeImportExecutionDisposition: null,
    nativeImportNotReachedReason: null,
    nativeImportResultUnobservableReason: null,
    nativeDynamicImportResult: null,
    nativeModuleExportNames: [],
    nativeImportFreshNetworkRetrievalClaim: false,
    nativeImportExactFailedLeafClaim: false,
    transportError: null,
    bodyCustodyError: null,
    nativeImportError: null,
    backedDigestAuthority: { ...manifestRow.backedDigest },
    repositoryDigestAuthority: { ...manifestRow.repositoryDigest }
  };
}

export function initializeHEarthFd05Rows(manifest, timestamp = nowIso()) {
  return manifest.rows
    .slice()
    .sort((left, right) => left.captureOrder - right.captureOrder)
    .map((row) => initializeHEarthFd05Row(row, timestamp));
}

export function transitionHEarthFd05Row(
  row,
  nextState,
  detail = null,
  timestamp = nowIso()
) {
  const allowed = ALLOWED_TRANSITIONS[row.currentState] || [];

  if (!allowed.includes(nextState)) {
    throw new Error(
      `INVALID_ROW_TRANSITION:${row.captureOrder}:${row.currentState}->${nextState}`
    );
  }

  row.currentState = nextState;
  row.stateHistory.push({
    state: nextState,
    timestamp,
    detail
  });

  if (TERMINAL_STATES.has(nextState)) {
    row.terminalState = nextState;
  }

  return row;
}

async function captureTransportRow(row, manifestRow, dependencies, onUpdate) {
  transitionHEarthFd05Row(row, 'TRANSPORT_FETCHING');
  onUpdate(row);

  const controller = dependencies.navigatorObject?.serviceWorker?.controller;
  row.serviceWorkerControllerPresent = Boolean(controller);
  row.serviceWorkerControllerScriptUrl = controller?.scriptURL ?? null;

  if (typeof dependencies.fetchImpl !== 'function') {
    const error = new Error('FETCH_API_UNAVAILABLE');
    row.transportResult = 'REJECTED';
    row.bodyCustodyDisposition = 'RESOLVED_ABSENCE';
    row.transportError = projectError(error, 'TRANSPORT', [
      `rows[${row.captureOrder - 1}].requestedDeployedUrl`
    ]);
    transitionHEarthFd05Row(row, 'TRANSPORT_FETCH_REJECTED', error.message);
    finalizeTransportEvidence(row, manifestRow);
    transitionHEarthFd05Row(row, 'TRANSPORT_OUTCOME_RECORDED');
    onUpdate(row);
    return row;
  }

  let response;

  try {
    response = await dependencies.fetchImpl(row.requestedDeployedUrl, {
      method: 'GET',
      cache: 'no-store',
      credentials: 'same-origin',
      redirect: 'follow',
      headers: {
        Accept:
          'text/javascript, application/javascript, application/ecmascript, text/ecmascript, text/plain, */*;q=0.1'
      }
    });
  } catch (error) {
    row.transportResult = 'REJECTED';
    row.bodyCustodyDisposition = 'RESOLVED_ABSENCE';
    row.transportError = projectError(error, 'TRANSPORT', [
      `rows[${row.captureOrder - 1}].requestedDeployedUrl`
    ]);
    transitionHEarthFd05Row(row, 'TRANSPORT_FETCH_REJECTED');
    finalizeTransportEvidence(row, manifestRow);
    transitionHEarthFd05Row(row, 'TRANSPORT_OUTCOME_RECORDED');
    onUpdate(row);
    return row;
  }

  row.transportResult = 'FULFILLED';
  row.finalResponseUrl = response.url || null;
  row.redirected = response.redirected === true;
  row.httpStatus = Number.isInteger(response.status) ? response.status : null;
  row.responseType = typeof response.type === 'string' ? response.type : null;
  row.responseOk = response.ok === true;
  row.contentType = response.headers?.get?.('content-type') ?? null;
  row.browserExposedResponseHeaders = projectBrowserExposedHeaders(
    response.headers
  );

  transitionHEarthFd05Row(row, 'TRANSPORT_FETCH_FULFILLED');
  onUpdate(row);

  let arrayBuffer;

  try {
    arrayBuffer = await response.arrayBuffer();
    row.responseByteLength = arrayBuffer.byteLength;
    row.capturedBodyEncoding = 'BASE64';
    row.capturedBodyBase64 = arrayBufferToBase64(arrayBuffer);
    row.boundedResponsePrefix = decodeUtf8Prefix(
      arrayBuffer,
      dependencies.responsePrefixMaximumBytes,
      dependencies.TextDecoderImpl
    );
    row.bodyCustodyDisposition = 'COMPLETE';
    transitionHEarthFd05Row(row, 'BODY_CAPTURE_COMPLETE');
    onUpdate(row);
  } catch (error) {
    row.bodyCustodyDisposition = 'UNRESOLVED_FAILURE';
    row.bodyCustodyError = projectError(error, 'BODY_CUSTODY', [
      `rows[${row.captureOrder - 1}].capturedBodyBase64`
    ]);
    finalizeTransportEvidence(row, manifestRow);
    transitionHEarthFd05Row(row, 'TRANSPORT_OUTCOME_RECORDED');
    onUpdate(row);
    return row;
  }

  try {
    row.deployedSha256 = await calculateSha256(
      arrayBuffer,
      dependencies.cryptoObject
    );

    const completeText = decodeUtf8(arrayBuffer, dependencies.TextDecoderImpl);
    row.observedContractCandidates = extractContractCandidates(completeText);
    row.exactExpectedContractLiteralObserved = completeText.includes(
      row.expectedContractId
    );
    row.contractCorrespondenceDisposition =
      row.exactExpectedContractLiteralObserved ? 'MATCH' : 'MISMATCH';
    row.payloadShape = classifyPayloadShape(
      row.boundedResponsePrefix,
      row.contentType
    );

    transitionHEarthFd05Row(row, 'BODY_DIGEST_COMPLETE');
  } catch (error) {
    row.bodyCustodyDisposition = 'UNRESOLVED_FAILURE';
    row.bodyCustodyError = projectError(error, 'BODY_CUSTODY', [
      `rows[${row.captureOrder - 1}].deployedSha256`
    ]);
  }

  finalizeTransportEvidence(row, manifestRow);
  transitionHEarthFd05Row(row, 'TRANSPORT_OUTCOME_RECORDED');
  onUpdate(row);
  return row;
}

function finalizeTransportEvidence(row, manifestRow) {
  if (row.transportResult === 'REJECTED') {
    row.contractCorrespondenceDisposition =
      'NOT_EVALUATED_RESOLVED_ABSENCE';
    row.exactExpectedContractLiteralObserved = null;
  } else if (row.bodyCustodyDisposition !== 'COMPLETE') {
    row.contractCorrespondenceDisposition = 'NOT_EVALUATED_UNRESOLVED';
    row.exactExpectedContractLiteralObserved = null;
  }

  row.driveDigestComparison = createDigestComparison(
    manifestRow.backedDigest,
    row.deployedSha256,
    row.bodyCustodyDisposition
  );

  row.repositoryDigestComparison = createDigestComparison(
    manifestRow.repositoryDigest,
    row.deployedSha256,
    row.bodyCustodyDisposition
  );
}

export function verifyHEarthFd05TransportBarrier(rows) {
  return (
    Array.isArray(rows) &&
    rows.length === 19 &&
    rows.every(
      (row) =>
        row.currentState === 'TRANSPORT_OUTCOME_RECORDED' &&
        ['FULFILLED', 'REJECTED'].includes(row.transportResult)
    )
  );
}

async function observeNativeImport(row, dependencies, onUpdate) {
  transitionHEarthFd05Row(row, 'NATIVE_IMPORT_QUEUED');
  onUpdate(row);

  if (
    row.nativeImportPolicy !== 'OBSERVE' ||
    row.nativeImportAuthorized !== true
  ) {
    row.nativeImportExecutionDisposition = 'SKIPPED_BY_POLICY';
    row.nativeImportSkipReason =
      row.nativeImportSkipReason || 'MANIFEST_POLICY_DIRECTED_SKIP';
    row.nativeDynamicImportResult = null;
    row.nativeImportNotReachedReason =
      'POLICY_SKIP_HAS_NO_NATIVE_IMPORT_DISPATCH';
    transitionHEarthFd05Row(
      row,
      'NATIVE_IMPORT_NOT_REACHED_INSTRUMENT_IMPOSSIBILITY',
      'POLICY_SKIP'
    );
    onUpdate(row);
    return row;
  }

  if (typeof dependencies.importImpl !== 'function') {
    row.nativeImportExecutionDisposition =
      'NOT_REACHED_INSTRUMENT_IMPOSSIBILITY';
    row.nativeImportNotReachedReason =
      'DYNAMIC_IMPORT_IMPLEMENTATION_UNAVAILABLE';
    row.nativeDynamicImportResult = null;
    transitionHEarthFd05Row(
      row,
      'NATIVE_IMPORT_NOT_REACHED_INSTRUMENT_IMPOSSIBILITY'
    );
    onUpdate(row);
    return row;
  }

  row.nativeImportExecutionDisposition = 'ATTEMPTED';
  transitionHEarthFd05Row(row, 'NATIVE_IMPORT_RUNNING');
  onUpdate(row);

  try {
    const namespace = await dependencies.importImpl(
      row.requestedDeployedUrl
    );

    row.nativeDynamicImportResult = 'FULFILLED';
    row.nativeModuleExportNames = Object.keys(namespace || {}).sort();
    transitionHEarthFd05Row(row, 'NATIVE_IMPORT_FULFILLED');
  } catch (error) {
    row.nativeDynamicImportResult = 'REJECTED';
    row.nativeImportError = projectError(error, 'NATIVE_IMPORT', [
      `rows[${row.captureOrder - 1}].requestedDeployedUrl`
    ]);
    transitionHEarthFd05Row(row, 'NATIVE_IMPORT_REJECTED');
  }

  onUpdate(row);
  return row;
}

function rowHasUnresolvedEvidence(row) {
  return (
    row.bodyCustodyDisposition === 'UNRESOLVED_FAILURE' ||
    row.contractCorrespondenceDisposition === 'NOT_EVALUATED_UNRESOLVED' ||
    row.nativeImportExecutionDisposition ===
      'NOT_REACHED_INSTRUMENT_IMPOSSIBILITY' ||
    row.nativeImportExecutionDisposition ===
      'ATTEMPTED_RESULT_UNOBSERVABLE_INSTRUMENT_FAILURE'
  );
}

function rowHasMaterialFinding(row) {
  return (
    row.transportResult === 'REJECTED' ||
    row.responseOk === false ||
    row.redirected === true ||
    (
      row.finalResponseUrl !== null &&
      !equivalentUrl(row.finalResponseUrl, row.requestedDeployedUrl)
    ) ||
    row.payloadShape !== 'JAVASCRIPT_LIKE_RESPONSE' ||
    row.contractCorrespondenceDisposition === 'MISMATCH' ||
    row.driveDigestComparison?.result === 'MISMATCH' ||
    row.repositoryDigestComparison?.result === 'MISMATCH' ||
    row.nativeDynamicImportResult === 'REJECTED'
  );
}

export function finalizeHEarthFd05Row(row, onUpdate = () => {}) {
  let terminalState;

  if (rowHasUnresolvedEvidence(row)) {
    terminalState = 'TERMINAL_UNRESOLVED';
  } else if (rowHasMaterialFinding(row)) {
    terminalState = 'TERMINAL_FINDING';
  } else {
    terminalState = 'TERMINAL_PASS';
  }

  transitionHEarthFd05Row(row, terminalState);
  onUpdate(row);
  return row;
}

function defaultImportImpl(url) {
  return import(url);
}

function createDependencies(overrides = {}) {
  const globalObject = overrides.globalObject ?? globalThis;

  return {
    globalObject,
    fetchImpl:
      Object.prototype.hasOwnProperty.call(overrides, 'fetchImpl')
        ? overrides.fetchImpl
        : globalObject.fetch?.bind(globalObject),
    importImpl: overrides.importImpl ?? defaultImportImpl,
    cryptoObject: overrides.cryptoObject ?? globalObject.crypto,
    navigatorObject: overrides.navigatorObject ?? globalObject.navigator ?? null,
    TextDecoderImpl: overrides.TextDecoderImpl ?? globalObject.TextDecoder,
    responsePrefixMaximumBytes:
      overrides.responsePrefixMaximumBytes ?? 512,
    now: overrides.now ?? nowIso
  };
}

export function createHEarthFd05CaptureRuntime(
  manifest,
  overrides = {}
) {
  const dependencies = createDependencies(overrides);
  const rows = initializeHEarthFd05Rows(manifest, dependencies.now());

  let activeRunPromise = null;
  let runStarted = false;
  let runCompleted = false;
  let sharedRealmImportPassConsumed = false;

  const listeners = new Set();

  const notify = (row = null) => {
    for (const listener of listeners) {
      try {
        listener({
          phase: getPhase(),
          row,
          rows
        });
      } catch {
        // UI/listener failure is non-authoritative.
      }
    }
  };

  const getPhase = () => {
    if (!runStarted) return 'READY';
    if (runCompleted) return 'COMPLETE';
    if (rows.every((row) => row.currentState === 'TRANSPORT_OUTCOME_RECORDED')) {
      return 'NATIVE_IMPORT';
    }
    return 'TRANSPORT';
  };

  const run = () => {
    if (activeRunPromise) {
      return activeRunPromise;
    }

    runStarted = true;
    notify();

    activeRunPromise = (async () => {
      const runStartedAt = dependencies.now();

      await Promise.all(
        rows.map((row, index) =>
          captureTransportRow(
            row,
            manifest.rows[index],
            dependencies,
            notify
          )
        )
      );

      if (!verifyHEarthFd05TransportBarrier(rows)) {
        throw new Error('NINETEEN_ROW_TRANSPORT_OUTCOME_BARRIER_FAILED');
      }

      if (sharedRealmImportPassConsumed) {
        throw new Error('SECOND_SHARED_REALM_IMPORT_PASS_NOT_AUTHORIZED');
      }

      sharedRealmImportPassConsumed = true;

      for (const row of rows) {
        await observeNativeImport(row, dependencies, notify);
        finalizeHEarthFd05Row(row, notify);
      }

      runCompleted = true;
      notify();

      return {
        runStartedAt,
        runCompletedAt: dependencies.now(),
        sharedRealmImportPassConsumed,
        rows
      };
    })();

    // The completed promise is intentionally retained permanently.
    return activeRunPromise;
  };

  return Object.freeze({
    rows,
    run,
    subscribe(listener) {
      if (typeof listener !== 'function') {
        throw new TypeError('CAPTURE_RUNTIME_LISTENER_MUST_BE_FUNCTION');
      }
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getState() {
      return {
        phase: getPhase(),
        runStarted,
        runCompleted,
        sharedRealmImportPassConsumed,
        activeRunPromise
      };
    }
  });
}
