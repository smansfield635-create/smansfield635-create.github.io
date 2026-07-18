/**
 * /showroom/globe/h-earth/diagnostic/index.js
 * Small controller for the eight-file FD_05 diagnostic family.
 */

import {
  H_EARTH_FD05_MANIFEST_PROJECTION,
  validateHEarthFd05ManifestProjection
} from './manifest-projection.js';

import {
  deepFreeze,
  nowIso
} from './evidence.js';

import {
  createHEarthFd05CaptureRuntime,
  H_EARTH_FD05_ROW_LIFECYCLE_STATES
} from './capture-runtime.js';

import {
  buildCompleteRowProjection,
  buildCompletionReceiptProjection,
  buildFindingsReportProjection,
  buildHEarthFd05BrowserPackage,
  buildOperatorSummary,
  buildPackageDigestProjection,
  buildRowSummaryProjection,
  validateHEarthFd05Package
} from './browser-package.js?v=fd05-access-20260717c';

import {
  createHEarthFd05Ui
} from './ui.js?v=fd05-access-20260717c';

export const H_EARTH_FD05_DIAGNOSTIC_IMPLEMENTATION_CONTRACT_ID =
  'H_EARTH_FD05_NINETEEN_ROW_BROWSER_EVIDENCE_INSTRUMENT_v1';

export const H_EARTH_FD05_DIAGNOSTIC_SOURCE_FILE =
  '/showroom/globe/h-earth/diagnostic/index.js';

const GLOBAL_RUNTIME_API_KEY =
  'H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API';

const GLOBAL_PACKAGE_KEY =
  'H_EARTH_FD05_CURRENT_BROWSER_EVIDENCE_PACKAGE';

const GLOBAL_RECEIPT_KEY =
  'H_EARTH_FD05_BROWSER_CAPTURE_RECEIPT';

const COMPLETION_EVENT =
  'h-earth:fd05-browser-capture-complete';

const manifestValidation =
  validateHEarthFd05ManifestProjection(
    H_EARTH_FD05_MANIFEST_PROJECTION
  );

const captureRuntime =
  createHEarthFd05CaptureRuntime(
    H_EARTH_FD05_MANIFEST_PROJECTION
  );

const state = {
  initialized: false,
  runStarted: false,
  runCompleted: false,
  activeRunPromise: null,
  finalPackage: null,
  finalReceipt: null,
  cleanupFunctions: []
};

function createPacketId() {
  const suffix =
    globalThis.crypto?.randomUUID?.() ??
    nowIso().replace(/[^0-9A-Za-z]/g, '');

  return `H_EARTH_FD05_BROWSER_EVIDENCE_PACKAGE_${suffix}`;
}

let ui = null;

function publishFinalPackage(packageObject) {
  state.finalPackage = packageObject;
  state.finalReceipt = packageObject.finalCompletionReceipt;

  globalThis[GLOBAL_PACKAGE_KEY] = packageObject;
  globalThis[GLOBAL_RECEIPT_KEY] = state.finalReceipt;

  try {
    globalThis.dispatchEvent(
      new CustomEvent(COMPLETION_EVENT, {
        detail: state.finalReceipt
      })
    );
  } catch {
    // Event publication is optional and cannot mutate package evidence.
  }
}

function runCapture() {
  initialize();

  if (state.activeRunPromise) {
    return state.activeRunPromise;
  }

  if (!manifestValidation.valid) {
    state.activeRunPromise = Promise.reject(
      new Error(
        `MANIFEST_PROJECTION_INVALID:${manifestValidation.issues.join('|')}`
      )
    );
    return state.activeRunPromise;
  }

  state.runStarted = true;

  state.activeRunPromise = (async () => {
    try {
      const captureResult = await captureRuntime.run();

      ui?.render({
        phase: 'FINALIZING',
        rows: captureRuntime.rows
      });

      const packageObject =
        await buildHEarthFd05BrowserPackage({
          manifest:
            H_EARTH_FD05_MANIFEST_PROJECTION,
          diagnosticContractId:
            H_EARTH_FD05_DIAGNOSTIC_IMPLEMENTATION_CONTRACT_ID,
          pageUrl:
            globalThis.location?.href ?? null,
          captureResult,
          packetId: createPacketId()
        });

      publishFinalPackage(packageObject);

      state.runCompleted = true;

      ui?.render({
        phase: 'COMPLETE',
        rows: captureRuntime.rows,
        packageObject
      });

      return packageObject;
    } catch (error) {
      state.runCompleted = true;

      ui?.render({
        phase: 'ABORTED',
        rows: captureRuntime.rows,
        error
      });

      throw error;
    }
  })();

  // The same promise is returned while active and after completion.
  return state.activeRunPromise;
}

function initialize() {
  if (state.initialized) {
    return H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API;
  }

  ui = createHEarthFd05Ui({
    onStart: runCapture
  });

  ui.initialize(
    captureRuntime.rows,
    manifestValidation
  );

  const unsubscribe =
    captureRuntime.subscribe(({ phase, rows }) => {
      ui?.render({
        phase,
        rows
      });
    });

  state.cleanupFunctions.push(unsubscribe);
  state.cleanupFunctions.push(() => ui?.destroy());

  state.initialized = true;

  return H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API;
}

function teardown() {
  while (state.cleanupFunctions.length > 0) {
    const cleanup = state.cleanupFunctions.pop();
    try {
      cleanup();
    } catch {
      // Teardown is best effort and cannot mutate finalized evidence.
    }
  }

  ui = null;
  state.initialized = false;
  return true;
}

export const H_EARTH_FD05_INSPECTION_API =
  deepFreeze({
    manifest:
      H_EARTH_FD05_MANIFEST_PROJECTION,
    validateManifest:
      validateHEarthFd05ManifestProjection,
    validatePackage:
      validateHEarthFd05Package,
    buildOperatorSummary,
    buildCompletionReceiptProjection,
    buildFindingsReportProjection,
    buildPackageDigestProjection,
    buildRowSummaryProjection,
    buildCompleteRowProjection,
    lifecycleStates:
      H_EARTH_FD05_ROW_LIFECYCLE_STATES,
    getRows() {
      return deepFreeze(
        JSON.parse(JSON.stringify(captureRuntime.rows))
      );
    },
    getFinalPackage() {
      return state.finalPackage;
    },
    getFinalReceipt() {
      return state.finalReceipt;
    }
  });

export const H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API =
  deepFreeze({
    contractId:
      H_EARTH_FD05_DIAGNOSTIC_IMPLEMENTATION_CONTRACT_ID,
    sourceFile:
      H_EARTH_FD05_DIAGNOSTIC_SOURCE_FILE,
    manifestId:
      H_EARTH_FD05_MANIFEST_PROJECTION.manifestId,
    manifestDigest:
      H_EARTH_FD05_MANIFEST_PROJECTION.manifestDigest,
    initialize,
    runCapture,
    teardown,
    inspect:
      H_EARTH_FD05_INSPECTION_API,
    getState() {
      return deepFreeze({
        initialized: state.initialized,
        runStarted: state.runStarted,
        runCompleted: state.runCompleted,
        sharedRealmImportPassConsumed:
          captureRuntime.getState()
            .sharedRealmImportPassConsumed,
        manifestValidated:
          manifestValidation.valid,
        activeRunPromise:
          state.activeRunPromise,
        finalPackageAvailable:
          state.finalPackage !== null,
        finalReceiptAvailable:
          state.finalReceipt !== null
      });
    }
  });

globalThis[GLOBAL_RUNTIME_API_KEY] =
  H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API;

globalThis[GLOBAL_PACKAGE_KEY] = null;
globalThis[GLOBAL_RECEIPT_KEY] = null;

function initializeOnDomReady() {
  H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API.initialize();
}

if (globalThis.document) {
  if (globalThis.document.readyState === 'loading') {
    globalThis.document.addEventListener(
      'DOMContentLoaded',
      initializeOnDomReady,
      { once: true }
    );
  } else {
    queueMicrotask(initializeOnDomReady);
  }
}

export default H_EARTH_FD05_DIAGNOSTIC_RUNTIME_API;
