/**
 * /showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js
 * COMPLETE NEW OPERATIONAL DIAGNOSTIC-OVERLAY MODULE
 *
 * CONTRACT:
 * H_EARTH_DIAGNOSTIC_FD_05_MODULE_IMPORT_TRACK_FILE_BIRTH_v1
 *
 * FAILURE DOMAIN:
 * FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH
 *
 * ROLE:
 * First operational failure-domain lane of the redesigned H-Earth diagnostic track.
 *
 * OWNS:
 * - independent compositor-root and renderer-root probes;
 * - deployed-response capture and classification;
 * - bounded import-error and response evidence;
 * - conservative exact transitive-URL detection;
 * - H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT publication;
 * - one operator-facing decision and one next authorized operation.
 *
 * DOES NOT OWN:
 * - modification or reopening of the 43 constitutional source authorities;
 * - compositor, renderer, geometry, runtime, route, or engine correction;
 * - redesign or deletion of the historical 31-report corpus;
 * - production, visual-pass, or incident-resolution claims.
 */

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID =
  'H_EARTH_DIAGNOSTIC_FD_05_MODULE_IMPORT_TRACK_FILE_BIRTH_v1';

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE =
  '/showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js';

export const H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN =
  'FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH';

export const H_EARTH_FD_05_PRIMARY_RECEIPT_ID =
  'H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT';

export const H_EARTH_FD_05_PRIMARY_REPORT =
  'IMPORT_AND_CONTRACT';

export const H_EARTH_FD_05_SUPPORTING_REPORTS = Object.freeze([
  'SOURCE_RESOLUTION',
  'ALL_DIAGNOSTIC_EVIDENCE_PRESENTATION_SURFACE'
]);

const GLOBAL_RECEIPT_KEY = H_EARTH_FD_05_PRIMARY_RECEIPT_ID;
const GLOBAL_TRACK_KEY = 'H_EARTH_FD_05_MODULE_IMPORT_TRACK';
const RECEIPT_EVENT =
  'h-earth:fd-05-module-import-diagnostic-receipt';
const MOUNT_ID = 'h-earth-fd-05-module-import-track';
const STYLE_ID = `${MOUNT_ID}-style`;
const RESPONSE_PREFIX_LIMIT = 512;
const STACK_LIMIT = 2400;
const URL_LIMIT = 12;

const CLASSIFICATION = Object.freeze({
  JAVASCRIPT_LIKE: 'JAVASCRIPT_LIKE',
  HTML_LIKE: 'HTML_LIKE',
  JSON_LIKE: 'JSON_LIKE',
  HTTP_ERROR: 'HTTP_ERROR',
  EMPTY: 'EMPTY',
  REDIRECTED: 'REDIRECTED',
  UNRECOGNIZED: 'UNRECOGNIZED',
  RESPONSE_UNAVAILABLE: 'RESPONSE_UNAVAILABLE'
});

const BRANCHES = Object.freeze([
  Object.freeze({
    branchId: 'COMPOSITOR_ROOT',
    label: 'Compositor root',
    requestedPath: '../compositor.js',
    expectedSourcePath:
      '/showroom/globe/h-earth/compositor.js',
    expectedContractExport:
      'H_EARTH_3D_COMPOSITOR_CONTRACT_ID',
    expectedContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'
  }),
  Object.freeze({
    branchId: 'RENDERER_ROOT',
    label: 'Renderer root',
    requestedPath: '../renderer.js',
    expectedSourcePath:
      '/showroom/globe/h-earth/renderer.js',
    expectedContractExport:
      'H_EARTH_3D_RENDERER_CONTRACT_ID',
    expectedContractId:
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1'
  })
]);

let runSequence = 0;
let activeRun = null;

function nowIso() {
  return new Date().toISOString();
}

function isText(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

function bounded(value, limit) {
  if (value === undefined || value === null) {
    return null;
  }

  const text = String(value);

  return text.length <= limit
    ? text
    : `${text.slice(0, limit)}…`;
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) {
    return value;
  }

  seen.add(value);

  for (const nested of Object.values(value)) {
    deepFreeze(nested, seen);
  }

  return Object.freeze(value);
}

function resolveUrl(
  value,
  base = document.baseURI
) {
  try {
    return new URL(value, base).href;
  } catch {
    return null;
  }
}

function equivalentUrl(left, right) {
  if (!left || !right) {
    return false;
  }

  try {
    const a = new URL(left);
    const b = new URL(right);

    a.hash = '';
    b.hash = '';

    return a.href === b.href;
  } catch {
    return left === right;
  }
}

function normalizedPrefix(value) {
  return isText(value)
    ? value
        .replace(/\u0000/g, '')
        .replace(/\r\n/g, '\n')
        .slice(0, RESPONSE_PREFIX_LIMIT)
    : '';
}

function isHtmlLike(prefix, contentType) {
  const type =
    String(contentType || '').toLowerCase();

  const text =
    String(prefix || '')
      .trimStart()
      .toLowerCase();

  return (
    type.includes('text/html') ||
    /^(?:<!doctype html|<html|<head|<body|<title|<script)/.test(
      text
    )
  );
}

function isJsonLike(prefix, contentType) {
  const type =
    String(contentType || '').toLowerCase();

  const text =
    String(prefix || '').trim();

  if (
    type.includes('application/json') ||
    type.includes('+json')
  ) {
    return true;
  }

  if (
    !text.startsWith('{') &&
    !text.startsWith('[')
  ) {
    return false;
  }

  try {
    JSON.parse(text);
    return true;
  } catch {
    return /^(?:\{\s*["}]|\[\s*(?:[\{\["0-9tfn-]|\]))/.test(
      text
    );
  }
}

function isJavaScriptLike(
  prefix,
  contentType
) {
  const type =
    String(contentType || '').toLowerCase();

  const text =
    String(prefix || '').trimStart();

  return (
    type.includes('javascript') ||
    type.includes('ecmascript') ||
    /^(?:\/\*|\/\/|import\s|export\s|const\s|let\s|var\s|class\s|function\s|async\s+function\s|['"]use strict['"])/.test(
      text
    )
  );
}

function classifyResponse({
  responseOk,
  httpStatus,
  redirected,
  finalResponseUrl,
  resolvedUrl,
  contentType,
  responsePrefix
}) {
  if (
    responseOk === false ||
    (
      Number.isInteger(httpStatus) &&
      (
        httpStatus < 200 ||
        httpStatus >= 400
      )
    )
  ) {
    return CLASSIFICATION.HTTP_ERROR;
  }

  if (
    redirected === true ||
    (
      finalResponseUrl &&
      resolvedUrl &&
      !equivalentUrl(
        finalResponseUrl,
        resolvedUrl
      )
    )
  ) {
    return CLASSIFICATION.REDIRECTED;
  }

  if (!isText(responsePrefix)) {
    return CLASSIFICATION.EMPTY;
  }

  if (
    isHtmlLike(
      responsePrefix,
      contentType
    )
  ) {
    return CLASSIFICATION.HTML_LIKE;
  }

  if (
    isJsonLike(
      responsePrefix,
      contentType
    )
  ) {
    return CLASSIFICATION.JSON_LIKE;
  }

  if (
    isJavaScriptLike(
      responsePrefix,
      contentType
    )
  ) {
    return CLASSIFICATION.JAVASCRIPT_LIKE;
  }

  return CLASSIFICATION.UNRECOGNIZED;
}

async function probeResponse(
  requestedPath,
  resolvedUrl
) {
  const probeStartedAt = nowIso();

  try {
    const response = await fetch(
      resolvedUrl,
      {
        method: 'GET',
        cache: 'no-store',
        credentials: 'same-origin',
        redirect: 'follow',
        headers: {
          Accept:
            'text/javascript, application/javascript, application/ecmascript, text/ecmascript, application/json, text/plain, */*;q=0.1'
        }
      }
    );

    let responsePrefix = '';
    let responseReadErrorName = null;
    let responseReadErrorMessage = null;

    try {
      responsePrefix =
        normalizedPrefix(
          await response.text()
        );
    } catch (error) {
      responseReadErrorName =
        bounded(
          error?.name,
          160
        );

      responseReadErrorMessage =
        bounded(
          error?.message,
          800
        );
    }

    const finalResponseUrl =
      response.url || resolvedUrl;

    const contentType =
      response.headers.get(
        'content-type'
      );

    const redirected =
      response.redirected === true ||
      !equivalentUrl(
        finalResponseUrl,
        resolvedUrl
      );

    const base = {
      probeStartedAt,
      probeCompletedAt: nowIso(),
      requestedPath,
      resolvedUrl,
      finalResponseUrl,
      httpStatus: response.status,
      httpStatusText:
        response.statusText || '',
      responseOk: response.ok,
      contentType,
      redirected,
      responsePrefix,
      responsePrefixLength:
        responsePrefix.length,
      responseReadErrorName,
      responseReadErrorMessage,
      fetchErrorName: null,
      fetchErrorMessage: null
    };

    return deepFreeze({
      ...base,
      responseClassification:
        classifyResponse(base)
    });
  } catch (error) {
    return deepFreeze({
      probeStartedAt,
      probeCompletedAt: nowIso(),
      requestedPath,
      resolvedUrl,
      finalResponseUrl: null,
      httpStatus: null,
      httpStatusText: null,
      responseOk: false,
      contentType: null,
      redirected: false,
      responseClassification:
        CLASSIFICATION.RESPONSE_UNAVAILABLE,
      responsePrefix: '',
      responsePrefixLength: 0,
      responseReadErrorName: null,
      responseReadErrorMessage: null,
      fetchErrorName:
        bounded(
          error?.name,
          160
        ),
      fetchErrorMessage:
        bounded(
          error?.message,
          800
        )
    });
  }
}

function captureError(error) {
  return deepFreeze({
    errorName:
      bounded(
        error?.name,
        160
      ),

    errorMessage:
      bounded(
        error?.message,
        1200
      ),

    errorStack:
      bounded(
        error?.stack,
        STACK_LIMIT
      ),

    errorFileName:
      bounded(
        error?.fileName,
        1200
      ),

    errorLineNumber:
      Number.isInteger(
        error?.lineNumber
      )
        ? error.lineNumber
        : null,

    errorColumnNumber:
      Number.isInteger(
        error?.columnNumber
      )
        ? error.columnNumber
        : null,

    errorCause:
      bounded(
        error?.cause?.message ||
          error?.cause?.name ||
          error?.cause,
        800
      )
  });
}

function extractUrls(text, baseUrl) {
  if (!isText(text)) {
    return [];
  }

  const output = [];

  const patterns = [
    /https?:\/\/[^\s<>'")\]]+/gi,
    /(?:\.\.\/|\.\/|\/)[A-Za-z0-9_./%+~@-]+\.m?js(?:\?[^\s<>'")\]]*)?/gi
  ];

  for (const pattern of patterns) {
    for (
      const match of
      text.matchAll(pattern)
    ) {
      const cleaned =
        match[0]
          .replace(
            /[),.;'"]+$/g,
            ''
          )
          .replace(
            /:(\d+):(\d+)$/g,
            ''
          )
          .replace(
            /:(\d+)$/g,
            ''
          );

      const url =
        resolveUrl(
          cleaned,
          baseUrl
        );

      if (url) {
        output.push(url);
      }
    }
  }

  return output;
}

function findTransitiveUrls(
  errorEvidence,
  rootUrl,
  finalResponseUrl
) {
  const texts = [
    errorEvidence.errorMessage,
    errorEvidence.errorStack,
    errorEvidence.errorFileName,
    errorEvidence.errorCause
  ];

  const urls = [];
  const seen = new Set();

  for (const text of texts) {
    for (
      const candidate of
      extractUrls(
        text,
        rootUrl
      )
    ) {
      if (
        equivalentUrl(
          candidate,
          rootUrl
        ) ||
        equivalentUrl(
          candidate,
          finalResponseUrl
        ) ||
        equivalentUrl(
          candidate,
          import.meta.url
        ) ||
        !/\.m?js(?:$|\?)/i.test(
          candidate
        ) ||
        seen.has(candidate)
      ) {
        continue;
      }

      seen.add(candidate);
      urls.push(candidate);

      if (
        urls.length >=
        URL_LIMIT
      ) {
        return Object.freeze(
          urls
        );
      }
    }
  }

  return Object.freeze(urls);
}

async function probeImport(
  branch,
  resolvedUrl
) {
  const importStartedAt = nowIso();

  try {
    const moduleNamespace =
      await import(resolvedUrl);

    const actualContractId =
      moduleNamespace?.[
        branch.expectedContractExport
      ] ?? null;

    return deepFreeze({
      importStartedAt,
      importCompletedAt: nowIso(),
      importAttempted: true,
      importSucceeded: true,

      exportedSymbolNames:
        Object.freeze(
          Object.keys(
            moduleNamespace
          ).sort()
        ),

      expectedContractExport:
        branch.expectedContractExport,

      expectedContractId:
        branch.expectedContractId,

      actualContractId,

      contractExportPresent:
        actualContractId !== null,

      contractIdMatched:
        actualContractId ===
        branch.expectedContractId,

      errorName: null,
      errorMessage: null,
      errorStack: null,
      errorFileName: null,
      errorLineNumber: null,
      errorColumnNumber: null,
      errorCause: null,

      exactFailedTransitiveUrlObserved:
        false,

      exactFailedTransitiveUrl:
        null,

      exactFailedTransitiveUrls:
        Object.freeze([])
    });
  } catch (error) {
    return deepFreeze({
      importStartedAt,
      importCompletedAt: nowIso(),
      importAttempted: true,
      importSucceeded: false,

      exportedSymbolNames:
        Object.freeze([]),

      expectedContractExport:
        branch.expectedContractExport,

      expectedContractId:
        branch.expectedContractId,

      actualContractId: null,
      contractExportPresent: false,
      contractIdMatched: false,

      ...captureError(error),

      exactFailedTransitiveUrlObserved:
        false,

      exactFailedTransitiveUrl:
        null,

      exactFailedTransitiveUrls:
        Object.freeze([])
    });
  }
}

async function inspectBranch(branch) {
  const branchStartedAt = nowIso();

  const resolvedUrl =
    resolveUrl(
      branch.requestedPath,
      import.meta.url
    );

  if (!resolvedUrl) {
    return deepFreeze({
      ...branch,
      branchStartedAt,
      branchCompletedAt: nowIso(),
      resolvedUrl: null,
      responseProbe: null,

      importProbe: {
        importAttempted: false,
        importSucceeded: false,
        contractIdMatched: false,

        errorName:
          'URL_RESOLUTION_FAILED',

        errorMessage:
          'The configured root-module URL could not be resolved.',

        errorStack: null,

        exactFailedTransitiveUrlObserved:
          false,

        exactFailedTransitiveUrl:
          null,

        exactFailedTransitiveUrls:
          Object.freeze([])
      },

      exactTransitiveResponseProbe:
        null,

      branchSucceeded: false,

      branchFailureStage:
        'URL_RESOLUTION'
    });
  }

  const [
    responseProbe,
    firstImportProbe
  ] = await Promise.all([
    probeResponse(
      branch.requestedPath,
      resolvedUrl
    ),
    probeImport(
      branch,
      resolvedUrl
    )
  ]);

  let importProbe =
    firstImportProbe;

  if (!importProbe.importSucceeded) {
    const urls =
      findTransitiveUrls(
        importProbe,
        resolvedUrl,
        responseProbe.finalResponseUrl
      );

    importProbe =
      deepFreeze({
        ...importProbe,

        exactFailedTransitiveUrlObserved:
          urls.length > 0,

        exactFailedTransitiveUrl:
          urls[0] ?? null,

        exactFailedTransitiveUrls:
          urls
      });
  }

  const exactTransitiveResponseProbe =
    importProbe.exactFailedTransitiveUrl
      ? await probeResponse(
          importProbe
            .exactFailedTransitiveUrl,
          importProbe
            .exactFailedTransitiveUrl
        )
      : null;

  const branchSucceeded =
    responseProbe.responseOk === true &&
    importProbe.importSucceeded === true &&
    importProbe.contractIdMatched === true;

  let branchFailureStage = null;

  if (
    responseProbe.responseOk !== true
  ) {
    branchFailureStage =
      'DEPLOYED_RESPONSE';
  } else if (
    !importProbe.importSucceeded
  ) {
    branchFailureStage =
      importProbe
        .exactFailedTransitiveUrl
        ? 'TRANSITIVE_MODULE_IMPORT'
        : 'ROOT_OR_UNIDENTIFIED_TRANSITIVE_MODULE_IMPORT';
  } else if (
    !importProbe.contractIdMatched
  ) {
    branchFailureStage =
      'ROOT_MODULE_CONTRACT_CORRESPONDENCE';
  }

  return deepFreeze({
    ...branch,
    branchStartedAt,
    branchCompletedAt: nowIso(),
    resolvedUrl,
    responseProbe,
    importProbe,
    exactTransitiveResponseProbe,
    branchSucceeded,
    branchFailureStage
  });
}

function primaryFailedBranch(failed) {
  if (failed.length === 0) {
    return null;
  }

  if (failed.length === 1) {
    return failed[0];
  }

  return (
    failed.find(
      (branch) =>
        branch
          .importProbe
          .exactFailedTransitiveUrlObserved
    ) ||
    failed[0]
  );
}

function branchIdentificationStatus(
  failed
) {
  if (failed.length === 0) {
    return (
      'NO_ROOT_BRANCH_FAILURE_REPRODUCED'
    );
  }

  if (failed.length === 1) {
    return (
      'ONE_FAILED_ROOT_BRANCH_IDENTIFIED'
    );
  }

  return (
    'MULTIPLE_FAILED_ROOT_BRANCHES_IDENTIFIED'
  );
}

function nextOperation(
  failed,
  primary
) {
  if (failed.length === 0) {
    return deepFreeze({
      operationId:
        'CAPTURE_CURRENT_OCCURRENCE_AFTER_ONE_NORMAL_PAGE_RELOAD',

      targetOccurrence:
        null,

      instruction:
        'Reload the normal H-Earth diagnostic page once and preserve the newly published receipt beside the current token-error occurrence; do not reopen source unless the failure reproduces with a directly identified target.'
    });
  }

  if (failed.length > 1) {
    return deepFreeze({
      operationId:
        'INSPECT_SHARED_DEPLOYMENT_BEHAVIOR_FOR_BOTH_ROOT_URLS',

      targetOccurrence:
        Object.freeze(
          failed.map(
            (branch) =>
              branch.resolvedUrl
          )
        ),

      instruction:
        'Inspect the shared deployment mapping, fallback, redirect, or response behavior affecting both root URLs before reopening compositor or renderer source.'
    });
  }

  const transitiveUrl =
    primary
      .importProbe
      .exactFailedTransitiveUrl;

  if (transitiveUrl) {
    return deepFreeze({
      operationId:
        'INSPECT_EXACT_FAILED_TRANSITIVE_DEPLOYED_OCCURRENCE',

      targetOccurrence:
        transitiveUrl,

      observedClassification:
        primary
          .exactTransitiveResponseProbe
          ?.responseClassification ??
        null,

      instruction:
        'Inspect the exact failed transitive deployed occurrence and its returned response; source correction remains withheld until that occurrence is matched to its controlling source authority.'
    });
  }

  const classification =
    primary
      .responseProbe
      .responseClassification;

  if (
    classification !==
    CLASSIFICATION.JAVASCRIPT_LIKE
  ) {
    return deepFreeze({
      operationId:
        'INSPECT_EXACT_FAILED_ROOT_DEPLOYED_RESPONSE',

      targetOccurrence:
        primary
          .responseProbe
          .finalResponseUrl ||
        primary.resolvedUrl,

      observedClassification:
        classification,

      instruction:
        'Inspect the exact failed root deployed response and its route mapping; do not modify compositor or renderer source merely because its root import rejected.'
    });
  }

  return deepFreeze({
    operationId:
      'INSPECT_ROOT_MODULE_PARSE_LINK_OR_EXPORT_CORRESPONDENCE',

    targetOccurrence:
      primary.resolvedUrl,

    observedClassification:
      classification,

    instruction:
      'Inspect the exact failed root module occurrence for parse, link, export, or unobserved transitive failure evidence; source correction remains withheld until the responsible occurrence is directly identified.'
  });
}

function missingEvidence(
  failed,
  primary
) {
  const missing = [];

  if (failed.length === 0) {
    missing.push(
      'CURRENT_TOKEN_ERROR_NOT_REPRODUCED_BY_THIS_OCCURRENCE'
    );
  }

  if (failed.length > 1) {
    missing.push(
      'SINGLE_FAILED_ROOT_BRANCH_NOT_ISOLATED'
    );
  }

  if (
    primary &&
    !primary
      .importProbe
      .exactFailedTransitiveUrlObserved
  ) {
    missing.push(
      'EXACT_FAILED_TRANSITIVE_URL_NOT_OBSERVED'
    );
  }

  if (
    primary
      ?.responseProbe
      .responseClassification ===
    CLASSIFICATION.RESPONSE_UNAVAILABLE
  ) {
    missing.push(
      'DEPLOYED_RESPONSE_BODY_AND_HEADERS_UNAVAILABLE'
    );
  }

  return Object.freeze(missing);
}

function buildReceipt({
  runId,
  runStartedAt,
  runCompletedAt,
  branchResults,
  executionStatus,
  fatalError = null
}) {
  const failed =
    branchResults.filter(
      (branch) =>
        !branch.branchSucceeded
    );

  const primary =
    primaryFailedBranch(failed);

  const response =
    primary?.responseProbe ??
    null;

  const importEvidence =
    primary?.importProbe ??
    null;

  const exactTransitiveUrl =
    importEvidence
      ?.exactFailedTransitiveUrl ??
    null;

  return deepFreeze({
    receiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    receiptSchemaVersion:
      1,

    contractId:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID,

    sourceFile:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

    activeFailureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReport:
      H_EARTH_FD_05_PRIMARY_REPORT,

    supportingReports:
      H_EARTH_FD_05_SUPPORTING_REPORTS,

    reportsClosedForCurrentOccurrence:
      'ALL_NONPRIMARY_AND_NONSUPPORTING_REPORTS',

    historicalReportCorpusPreserved:
      true,

    manualReportCyclingRequired:
      false,

    runId,
    runStartedAt,
    runCompletedAt,
    executionStatus,

    instrumentPresence:
      'INSTALLED_AND_REACHED',

    step034QInstrumentPresence:
      'A_INSTALLED_EXECUTING_AND_PUBLISHING',

    instrumentExecutionStatus:
      executionStatus,

    instrumentPublicationStatus:
      'PUBLISHED',

    primaryReceiptVisible:
      true,

    branchIdentificationStatus:
      branchIdentificationStatus(
        failed
      ),

    failedBranchIdentified:
      failed.length === 1,

    deployedResponseIdentified:
      response
        ?.responseClassification !=
      null,

    exactTransitiveUrlIdentified:
      exactTransitiveUrl !== null,

    failedBranches:
      Object.freeze(
        failed.map(
          (branch) =>
            branch.branchId
        )
      ),

    failedRequestedPath:
      primary?.requestedPath ??
      null,

    resolvedUrl:
      primary?.resolvedUrl ??
      null,

    finalResponseUrl:
      response
        ?.finalResponseUrl ??
      null,

    httpStatus:
      response?.httpStatus ??
      null,

    contentType:
      response?.contentType ??
      null,

    redirected:
      response?.redirected ??
      null,

    responseClassification:
      response
        ?.responseClassification ??
      null,

    responsePrefix:
      response
        ?.responsePrefix ??
      null,

    errorName:
      importEvidence?.errorName ??
      null,

    errorMessage:
      importEvidence
        ?.errorMessage ??
      null,

    errorStack:
      importEvidence?.errorStack ??
      null,

    exactFailedTransitiveUrlObserved:
      exactTransitiveUrl !== null,

    exactFailedTransitiveUrl:
      exactTransitiveUrl,

    branchResults:
      Object.freeze([
        ...branchResults
      ]),

    evidenceStillMissing:
      missingEvidence(
        failed,
        primary
      ),

    nextAuthorizedOperation:
      nextOperation(
        failed,
        primary
      ),

    sourceCorrectionAuthorized:
      false,

    sourceCorrectionStatus:
      exactTransitiveUrl
        ? 'WITHHELD_PENDING_CONTROLLING_SOURCE_CORRESPONDENCE'
        : 'WITHHELD_PENDING_DIRECT_FAILURE_TARGET_IDENTIFICATION',

    constitutionalSourceReopenAuthorized:
      false,

    constitutionalSourceModificationPerformed:
      false,

    fatalError
  });
}

function runningReceipt(
  runId,
  runStartedAt
) {
  return deepFreeze({
    receiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    receiptSchemaVersion:
      1,

    contractId:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID,

    sourceFile:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

    activeFailureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReport:
      H_EARTH_FD_05_PRIMARY_REPORT,

    supportingReports:
      H_EARTH_FD_05_SUPPORTING_REPORTS,

    reportsClosedForCurrentOccurrence:
      'ALL_NONPRIMARY_AND_NONSUPPORTING_REPORTS',

    historicalReportCorpusPreserved:
      true,

    manualReportCyclingRequired:
      false,

    runId,
    runStartedAt,
    runCompletedAt:
      null,

    executionStatus:
      'RUNNING',

    instrumentPresence:
      'INSTALLED_AND_REACHED',

    step034QInstrumentPresence:
      'A_INSTALLED_EXECUTING_AND_PUBLISHING',

    instrumentExecutionStatus:
      'RUNNING',

    instrumentPublicationStatus:
      'PUBLISHED',

    primaryReceiptVisible:
      true,

    branchIdentificationStatus:
      'BRANCH_PROBES_RUNNING',

    failedBranchIdentified:
      false,

    deployedResponseIdentified:
      false,

    exactTransitiveUrlIdentified:
      false,

    failedBranches:
      Object.freeze([]),

    failedRequestedPath:
      null,

    resolvedUrl:
      null,

    finalResponseUrl:
      null,

    httpStatus:
      null,

    contentType:
      null,

    redirected:
      null,

    responseClassification:
      null,

    responsePrefix:
      null,

    errorName:
      null,

    errorMessage:
      null,

    errorStack:
      null,

    exactFailedTransitiveUrlObserved:
      false,

    exactFailedTransitiveUrl:
      null,

    branchResults:
      Object.freeze([]),

    evidenceStillMissing:
      Object.freeze([
        'BRANCH_PROBES_NOT_COMPLETE'
      ]),

    nextAuthorizedOperation:
      deepFreeze({
        operationId:
          'WAIT_FOR_CURRENT_INSTRUMENT_RUN',

        targetOccurrence:
          null,

        instruction:
          'Allow the current bounded compositor and renderer probes to complete.'
      }),

    sourceCorrectionAuthorized:
      false,

    sourceCorrectionStatus:
      'WITHHELD_PENDING_DIRECT_FAILURE_TARGET_IDENTIFICATION',

    constitutionalSourceReopenAuthorized:
      false,

    constitutionalSourceModificationPerformed:
      false,

    fatalError:
      null
  });
}

function publish(receipt) {
  globalThis[
    GLOBAL_RECEIPT_KEY
  ] = receipt;

  globalThis.dispatchEvent(
    new CustomEvent(
      RECEIPT_EVENT,
      {
        detail: receipt
      }
    )
  );

  return receipt;
}

function ensureStyle() {
  if (
    document.getElementById(
      STYLE_ID
    )
  ) {
    return;
  }

  const style =
    document.createElement(
      'style'
    );

  style.id = STYLE_ID;

  style.textContent = `
    #${MOUNT_ID}{box-sizing:border-box;margin:1rem auto;max-width:1120px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(10,14,20,.94);color:#eef3f8;font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}
    #${MOUNT_ID} *{box-sizing:border-box}
    #${MOUNT_ID} header{padding:1rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.14)}
    #${MOUNT_ID} h2{margin:0;font-size:1.05rem;letter-spacing:.02em}
    #${MOUNT_ID} p{margin:.35rem 0 0;color:#b8c4d0}
    #${MOUNT_ID} dl{display:grid;grid-template-columns:minmax(180px,.7fr) minmax(0,1.8fr);margin:0}
    #${MOUNT_ID} dt,#${MOUNT_ID} dd{margin:0;padding:.65rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);overflow-wrap:anywhere;white-space:pre-wrap}
    #${MOUNT_ID} dt{color:#aebdca;font-weight:650}
    #${MOUNT_ID} dd{color:#f4f7fa}
    #${MOUNT_ID} footer{display:flex;justify-content:flex-end;padding:.9rem 1rem}
    #${MOUNT_ID} button{border:1px solid rgba(255,255,255,.25);border-radius:8px;background:#182330;color:#f4f7fa;padding:.55rem .8rem;cursor:pointer}
    #${MOUNT_ID} button:disabled{cursor:progress;opacity:.65}
    @media(max-width:720px){#${MOUNT_ID} dl{grid-template-columns:1fr}#${MOUNT_ID} dt{padding-bottom:.15rem;border-bottom:0}#${MOUNT_ID} dd{padding-top:.15rem}}
  `;

  document.head.append(style);
}

function ensureMount() {
  let mount =
    document.getElementById(
      MOUNT_ID
    );

  if (mount) {
    return mount;
  }

  ensureStyle();

  mount =
    document.createElement(
      'section'
    );

  mount.id = MOUNT_ID;

  mount.setAttribute(
    'data-h-earth-diagnostic-failure-domain',
    H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN
  );

  mount.setAttribute(
    'aria-live',
    'polite'
  );

  const host =
    document.querySelector(
      '[data-h-earth-diagnostic-track-host]'
    ) ||
    document.querySelector(
      'main'
    ) ||
    document.body;

  host.append(mount);

  return mount;
}

function appendRow(
  list,
  label,
  value
) {
  const term =
    document.createElement(
      'dt'
    );

  const detail =
    document.createElement(
      'dd'
    );

  term.textContent =
    label;

  detail.textContent =
    value === undefined ||
    value === null ||
    value === ''
      ? 'NOT YET VERIFIED'
      : String(value);

  list.append(
    term,
    detail
  );
}

function render(receipt) {
  const mount =
    ensureMount();

  mount.replaceChildren();

  const header =
    document.createElement(
      'header'
    );

  const title =
    document.createElement(
      'h2'
    );

  const subtitle =
    document.createElement(
      'p'
    );

  title.textContent =
    'H-Earth FD_05 Module Import Diagnostic Track';

  subtitle.textContent =
    'One active failure domain · one primary receipt · one next authorized operation';

  header.append(
    title,
    subtitle
  );

  const list =
    document.createElement(
      'dl'
    );

  appendRow(
    list,
    'Active failure domain',
    receipt.activeFailureDomain
  );

  appendRow(
    list,
    'Primary evidence',
    receipt.receiptId
  );

  appendRow(
    list,
    'Failed root branch',
    receipt.failedBranches.length
      ? receipt.failedBranches.join(
          ', '
        )
      : 'NO ROOT BRANCH FAILURE REPRODUCED'
  );

  appendRow(
    list,
    'Requested deployed URL',
    receipt.resolvedUrl
  );

  appendRow(
    list,
    'Returned response classification',
    receipt.responseClassification
  );

  appendRow(
    list,
    'HTTP status',
    receipt.httpStatus
  );

  appendRow(
    list,
    'Content type',
    receipt.contentType
  );

  appendRow(
    list,
    'Redirected',
    receipt.redirected
  );

  appendRow(
    list,
    'Response prefix',
    receipt.responsePrefix
  );

  appendRow(
    list,
    'Import error',
    receipt.errorName ||
    receipt.errorMessage
      ? `${
          receipt.errorName ||
          'ERROR'
        }: ${
          receipt.errorMessage ||
          ''
        }`
      : null
  );

  appendRow(
    list,
    'Exact failed transitive URL',
    receipt.exactFailedTransitiveUrl
  );

  const transitiveClassification =
    receipt.branchResults.find(
      (branch) =>
        branch
          .importProbe
          ?.exactFailedTransitiveUrl ===
        receipt
          .exactFailedTransitiveUrl
    )
      ?.exactTransitiveResponseProbe
      ?.responseClassification;

  appendRow(
    list,
    'Exact transitive response classification',
    transitiveClassification
  );

  appendRow(
    list,
    'Evidence still missing',
    receipt
      .evidenceStillMissing
      .length
      ? receipt
          .evidenceStillMissing
          .join(', ')
      : 'NONE'
  );

  appendRow(
    list,
    'Reports closed for this occurrence',
    receipt
      .reportsClosedForCurrentOccurrence
  );

  appendRow(
    list,
    'One next authorized operation',
    `${
      receipt
        .nextAuthorizedOperation
        .operationId
    }\n${
      receipt
        .nextAuthorizedOperation
        .instruction
    }`
  );

  appendRow(
    list,
    'Source correction',
    receipt
      .sourceCorrectionAuthorized
      ? 'AUTHORIZED'
      : receipt
          .sourceCorrectionStatus
  );

  const footer =
    document.createElement(
      'footer'
    );

  const button =
    document.createElement(
      'button'
    );

  button.type = 'button';

  button.textContent =
    'Run FD_05 instrument again';

  button.addEventListener(
    'click',
    async () => {
      button.disabled = true;

      try {
        await runHEarthFd05ModuleImportTrack();
      } finally {
        button.disabled = false;
      }
    }
  );

  footer.append(button);

  mount.append(
    header,
    list,
    footer
  );
}

export async function runHEarthFd05ModuleImportTrack() {
  if (activeRun) {
    return activeRun;
  }

  activeRun = (
    async () => {
      runSequence += 1;

      const runId =
        `H_EARTH_FD_05_RUN_${
          String(
            runSequence
          ).padStart(
            4,
            '0'
          )
        }_${
          Date.now()
        }`;

      const runStartedAt =
        nowIso();

      const pending =
        runningReceipt(
          runId,
          runStartedAt
        );

      publish(pending);
      render(pending);

      try {
        const branchResults =
          await Promise.all(
            BRANCHES.map(
              inspectBranch
            )
          );

        const receipt =
          buildReceipt({
            runId,
            runStartedAt,
            runCompletedAt:
              nowIso(),
            branchResults,
            executionStatus:
              'COMPLETE'
          });

        publish(receipt);
        render(receipt);

        return receipt;
      } catch (error) {
        const receipt =
          buildReceipt({
            runId,
            runStartedAt,
            runCompletedAt:
              nowIso(),
            branchResults: [],
            executionStatus:
              'FAILED',
            fatalError:
              captureError(error)
          });

        publish(receipt);
        render(receipt);

        return receipt;
      } finally {
        activeRun = null;
      }
    }
  )();

  return activeRun;
}

export function getHEarthFd05ModuleImportDiagnosticReceipt() {
  return (
    globalThis[
      GLOBAL_RECEIPT_KEY
    ] ??
    null
  );
}

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK =
  deepFreeze({
    contractId:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID,

    sourceFile:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

    failureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReceiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    branches:
      BRANCHES,

    responseClassification:
      CLASSIFICATION,

    runHEarthFd05ModuleImportTrack,

    getHEarthFd05ModuleImportDiagnosticReceipt
  });

globalThis[
  GLOBAL_TRACK_KEY
] =
  H_EARTH_FD_05_MODULE_IMPORT_TRACK;

function start() {
  void runHEarthFd05ModuleImportTrack();
}

if (
  document.readyState ===
  'loading'
) {
  document.addEventListener(
    'DOMContentLoaded',
    start,
    {
      once: true
    }
  );
} else {
  start();
}

export default
  H_EARTH_FD_05_MODULE_IMPORT_TRACK;
