/**
 * /showroom/globe/h-earth/diagnostic/index.js
 * COMPLETE GENERAL-CONSTRUCT REPLACEMENT
 *
 * Controlling renewal contract:
 * H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_RENEWAL_STEP_034U_STEP_034P_LIVE_ROUTE_EVIDENCE_AND_BOUNDARY_REPORTING_v1
 *
 * Controlling report-system directive:
 * H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_ACTIVE_FAILURE_DECISION_RENEWAL_DIRECTIVE_v1
 *
 * Active failure domain:
 * FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH
 *
 * Authority boundary:
 * - diagnostic observation and human-facing report projection only;
 * - no compositor, renderer, import-graph, upstream-source, HTML, CSS,
 *   production-authority, or failure-law modification authority;
 * - production claim authority remains NONE;
 * - source correction is never authorized by this file.
 */

/* ==========================================================================
 * 01 · CONTRACT AND ADDRESS IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID =
  'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_FILE_RENEWAL_STEP_034U_STEP_034P_LIVE_ROUTE_EVIDENCE_AND_BOUNDARY_REPORTING_v1';

export const H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID =
  'H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_ACTIVE_FAILURE_DECISION_RENEWAL_DIRECTIVE_v1';

export const H_EARTH_3D_DIAGNOSTIC_FILE =
  '/showroom/globe/h-earth/diagnostic/index.js';

export const H_EARTH_3D_DIAGNOSTIC_ROUTE =
  '/showroom/globe/h-earth/diagnostic/';

export const H_EARTH_3D_FD_05_MODULE_ADDRESS =
  '/showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js';

export const H_EARTH_3D_FD_05_MODULE_PATH =
  './h-earth.fd-05-module-import-track.js';

export const H_EARTH_3D_FAILED_ROOT_MODULE =
  '/showroom/globe/h-earth/compositor.js';

export const H_EARTH_3D_ACTIVE_FAILURE_DOMAIN =
  'FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH';

export const H_EARTH_3D_PRIMARY_RECEIPT_KEY =
  'H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT';

export const H_EARTH_3D_WATCHDOG_RECEIPT_KEY =
  'H_EARTH_FD_05_INSTRUMENT_WATCHDOG_RECEIPT';

export const H_EARTH_3D_HOST_RECEIPT_KEY =
  'H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_RECEIPT';

export const H_EARTH_3D_REPORT_SYSTEM_KEY =
  'H_EARTH_3D_DIAGNOSTIC_REPORT_SYSTEM';

export const H_EARTH_3D_ROLE_REGISTRY_KEY =
  'H_EARTH_3D_DIAGNOSTIC_ROLE_REGISTRY';

export const H_EARTH_3D_ACTIVE_DECISION_KEY =
  'H_EARTH_3D_ACTIVE_FAILURE_DECISION';

export const H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY = 'NONE';
export const H_EARTH_3D_SOURCE_CORRECTION_AUTHORITY = 'WITHHELD';

export const H_EARTH_3D_MISSING_EVIDENCE_LABEL =
  'NOT YET DIRECTLY OBSERVED';

export const H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL =
  'HISTORICAL OR CURRENT OCCURRENCE UNCLASSIFIED';

export const H_EARTH_3D_READY_STATUS = 'COMPLETE';

export const H_EARTH_3D_REPORT_ROLES = Object.freeze({
  PRIMARY: 'PRIMARY',
  SUPPORTING: 'SUPPORTING',
  HISTORICAL: 'HISTORICAL',
  CUSTODY: 'CUSTODY'
});

export const H_EARTH_3D_REPORT_TIERS = Object.freeze({
  ACTIVE_FAILURE_DECISION: 1,
  WATCHDOG_STATUS: 'WATCHDOG',
  ACTIVE_SUPPORTING_REPORTS: 2,
  PRESERVED_DIAGNOSTIC_CORPUS: 3
});

export const H_EARTH_3D_INTERFACE_ORDER = Object.freeze([
  'ACTIVE FAILURE DECISION',
  'FD_05 WATCHDOG STATUS',
  'ACTIVE SUPPORTING REPORTS',
  'PRESERVED DIAGNOSTIC CORPUS'
]);

export const H_EARTH_3D_TIER_2_REPORT_TITLES = Object.freeze([
  'IMPORT AND CONTRACT',
  'SOURCE RESOLUTION',
  'INITIALIZATION VS EXECUTION',
  'BOUNDARY MISMATCH REPORT'
]);

export const H_EARTH_3D_WATCHDOG_INTERVAL_MS = 4000;

const INTERNAL = Object.freeze({
  mountId: 'h-earth-diagnostic-report-system',
  primaryReceiptEvent: 'h-earth:fd-05-primary-receipt',
  primaryReceiptUpdatedEvent:
    'h-earth:diagnostic-primary-evidence-updated',
  watchdogReceiptEvent:
    'h-earth:fd-05-instrument-watchdog-receipt',
  reportSystemEvent:
    'h-earth:diagnostic-report-system-updated',
  hostReceiptEvent:
    'h-earth:diagnostic-bootstrap-receipt',
  runtimeStateKey:
    '__H_EARTH_3D_DIAGNOSTIC_RUNTIME_STATE__',
  disableAutoStartKey:
    'H_EARTH_3D_DIAGNOSTIC_DISABLE_AUTO_START_FOR_TESTS'
});

const MARKERS = Object.freeze({
  moduleLoadedAt:
    'H_EARTH_FD_05_MODULE_LOADED_AT',
  instrumentStartedAt:
    'H_EARTH_FD_05_INSTRUMENT_STARTED_AT',
  receiptPublishedAt:
    'H_EARTH_FD_05_RECEIPT_PUBLISHED_AT',
  receiptRenderedAt:
    'H_EARTH_FD_05_RECEIPT_RENDERED_AT'
});

/* ==========================================================================
 * 02 · GENERAL SAFETY AND NORMALIZATION UTILITIES
 * ========================================================================== */

function isRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    !Array.isArray(value)
  );
}

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

function nowIso() {
  return new Date().toISOString();
}

function safeJsonReplacer() {
  const seen = new WeakSet();

  return function replaceUnsafe(_key, value) {
    if (value === undefined || value === null) {
      return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
    }

    if (typeof value === 'function') {
      return `[Function ${value.name || 'anonymous'}]`;
    }

    if (typeof value === 'symbol') {
      return value.description
        ? `Symbol(${value.description})`
        : 'Symbol()';
    }

    if (typeof value === 'bigint') {
      return value.toString();
    }

    if (typeof value === 'object') {
      if (seen.has(value)) {
        return H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL;
      }

      seen.add(value);
    }

    return value;
  };
}

function boundedText(value, limit = 1600) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  let text;

  if (typeof value === 'string') {
    text = value;
  } else if (
    typeof value === 'number' ||
    typeof value === 'boolean' ||
    typeof value === 'bigint'
  ) {
    text = String(value);
  } else if (value instanceof Error) {
    text =
      value.message ||
      value.name ||
      'Error';
  } else {
    try {
      text = JSON.stringify(
        value,
        safeJsonReplacer(),
        2
      );
    } catch (_error) {
      text =
        H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL;
    }
  }

  if (!isNonEmptyString(text)) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  return text.length <= limit
    ? text
    : `${text.slice(0, limit)}…`;
}

function cloneForReport(value) {
  if (value === undefined || value === null) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  if (
    typeof value === 'string' ||
    typeof value === 'number' ||
    typeof value === 'boolean'
  ) {
    return value === ''
      ? H_EARTH_3D_MISSING_EVIDENCE_LABEL
      : value;
  }

  try {
    return JSON.parse(
      JSON.stringify(
        value,
        safeJsonReplacer()
      )
    );
  } catch (_error) {
    return H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL;
  }
}

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value) ||
    seen.has(value)
  ) {
    return value;
  }

  seen.add(value);

  Reflect.ownKeys(value).forEach((key) => {
    const descriptor =
      Object.getOwnPropertyDescriptor(
        value,
        key
      );

    if (
      descriptor &&
      Object.prototype.hasOwnProperty.call(
        descriptor,
        'value'
      )
    ) {
      deepFreeze(
        descriptor.value,
        seen
      );
    }
  });

  return Object.freeze(value);
}

function readPath(source, path) {
  if (
    !isRecord(source) ||
    !isNonEmptyString(path)
  ) {
    return undefined;
  }

  return path
    .split('.')
    .reduce(
      (cursor, segment) => {
        if (
          cursor === undefined ||
          cursor === null
        ) {
          return undefined;
        }

        return cursor[segment];
      },
      source
    );
}

function firstObserved(sources, paths) {
  for (const source of sources) {
    if (!source) {
      continue;
    }

    for (const path of paths) {
      const value =
        readPath(source, path);

      if (
        value !== undefined &&
        value !== null &&
        value !== ''
      ) {
        return value;
      }
    }
  }

  return undefined;
}

function normalizeObserved(
  value,
  limit = 1600
) {
  if (
    value === undefined ||
    value === null ||
    value === ''
  ) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  if (Array.isArray(value)) {
    if (value.length === 0) {
      return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
    }

    return value.map((entry) =>
      normalizeObserved(entry, limit)
    );
  }

  if (isRecord(value)) {
    return cloneForReport(value);
  }

  return boundedText(value, limit);
}

function hasDirectEvidence(value) {
  if (Array.isArray(value)) {
    return (
      value.length > 0 &&
      value.some(hasDirectEvidence)
    );
  }

  if (isRecord(value)) {
    return Object.values(value).some(
      hasDirectEvidence
    );
  }

  return (
    value !== undefined &&
    value !== null &&
    value !== '' &&
    value !==
      H_EARTH_3D_MISSING_EVIDENCE_LABEL &&
    value !==
      H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL
  );
}

function normalizeStatus(value) {
  const text =
    boundedText(value, 120).toUpperCase();

  if (
    text === H_EARTH_3D_READY_STATUS
  ) {
    return H_EARTH_3D_READY_STATUS;
  }

  if (
    text.includes('FAIL') ||
    text.includes('ERROR')
  ) {
    return 'FAILED';
  }

  if (
    text.includes('RUNNING') ||
    text.includes('PENDING') ||
    text.includes('STARTED') ||
    text.includes('ACTIVE')
  ) {
    return 'RUNNING';
  }

  return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
}

/**
 * Canonical dynamic getter invocation.
 *
 * Corrects malformed invocation forms equivalent to:
 * targetgetterName
 *
 * Required form:
 * target[getterName]()
 */
export function invokeNamedGetter(
  target,
  getterName
) {
  if (
    !target ||
    !isNonEmptyString(getterName)
  ) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  if (
    typeof target[getterName] !== 'function'
  ) {
    return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
  }

  try {
    return target[getterName]();
  } catch (error) {
    return {
      getterInvocationStatus: 'FAILED',
      getterName,
      errorName: boundedText(
        error && error.name,
        160
      ),
      errorMessage: boundedText(
        error && error.message
          ? error.message
          : error,
        1200
      )
    };
  }
}

function dispatchBoundedEvent(
  root,
  eventName,
  detail
) {
  try {
    if (
      root &&
      typeof root.dispatchEvent ===
        'function' &&
      typeof root.CustomEvent === 'function'
    ) {
      root.dispatchEvent(
        new root.CustomEvent(
          eventName,
          {
            detail: cloneForReport(detail)
          }
        )
      );

      return true;
    }
  } catch (_error) {
    // Global publication remains the
    // controlling local evidence surface.
  }

  return false;
}

/* ==========================================================================
 * 03 · PRESERVED 31-REPORT CORPUS
 * ========================================================================== */

const PRESERVED_CORPUS_BLUEPRINT =
  Object.freeze([
    [
      'HISTORICAL',
      'H_EARTH_DIAGNOSTIC_ROUTE_HISTORY',
      'Diagnostic Route History'
    ],
    [
      'HISTORICAL',
      'H_EARTH_BOOTSTRAP_HISTORY',
      'Bootstrap History'
    ],
    [
      'HISTORICAL',
      'H_EARTH_FAILURE_DOMAIN_HISTORY',
      'Failure-Domain History'
    ],
    [
      'HISTORICAL',
      'H_EARTH_REPORT_SYSTEM_HISTORY',
      'Report-System History'
    ],
    [
      'HISTORICAL',
      'H_EARTH_PRODUCTION_CLAIM_HISTORY',
      'Production-Claim History'
    ],

    [
      'CUSTODY',
      'H_EARTH_SOURCE_CUSTODY',
      'Source Custody'
    ],
    [
      'CUSTODY',
      'H_EARTH_RECEIPT_CUSTODY',
      'Receipt Custody'
    ],
    [
      'CUSTODY',
      'H_EARTH_ROUTE_EVIDENCE_CUSTODY',
      'Route Evidence Custody'
    ],
    [
      'CUSTODY',
      'H_EARTH_CORPUS_CUSTODY',
      'Diagnostic Corpus Custody'
    ],

    [
      'CONTRACT',
      'H_EARTH_BOOTSTRAP_CONTRACT_ARCHIVE',
      'Bootstrap Contract Archive'
    ],
    [
      'CONTRACT',
      'H_EARTH_ROUTE_CONTRACT_ARCHIVE',
      'Route Contract Archive'
    ],
    [
      'CONTRACT',
      'H_EARTH_COMPOSITOR_CONTRACT_ARCHIVE',
      'Compositor Contract Archive'
    ],
    [
      'CONTRACT',
      'H_EARTH_RENDERER_CONTRACT_ARCHIVE',
      'Renderer Contract Archive'
    ],

    [
      'ROUTE SUPPORT',
      'H_EARTH_ROUTE_MOUNT_ARCHIVE',
      'Route Mount Archive'
    ],
    [
      'ROUTE SUPPORT',
      'H_EARTH_PUBLIC_INDEX_ARCHIVE',
      'Public Index Archive'
    ],
    [
      'ROUTE SUPPORT',
      'H_EARTH_DIAGNOSTIC_ENTRY_ARCHIVE',
      'Diagnostic Entry Archive'
    ],
    [
      'ROUTE SUPPORT',
      'H_EARTH_ROUTE_RESPONSE_ARCHIVE',
      'Route Response Archive'
    ],

    [
      'COMPOSITOR SUPPORT',
      'H_EARTH_COMPOSITOR_IMPORT_ARCHIVE',
      'Compositor Import Archive'
    ],
    [
      'COMPOSITOR SUPPORT',
      'H_EARTH_COMPOSITOR_API_ARCHIVE',
      'Compositor API Archive'
    ],
    [
      'COMPOSITOR SUPPORT',
      'H_EARTH_COMPOSITOR_INITIALIZATION_ARCHIVE',
      'Compositor Initialization Archive'
    ],
    [
      'COMPOSITOR SUPPORT',
      'H_EARTH_COMPOSITOR_RECEIPT_ARCHIVE',
      'Compositor Receipt Archive'
    ],

    [
      'RENDERER SUPPORT',
      'H_EARTH_RENDERER_IMPORT_ARCHIVE',
      'Renderer Import Archive'
    ],
    [
      'RENDERER SUPPORT',
      'H_EARTH_RENDERER_API_ARCHIVE',
      'Renderer API Archive'
    ],
    [
      'RENDERER SUPPORT',
      'H_EARTH_RENDERER_MOUNT_ARCHIVE',
      'Renderer Mount Archive'
    ],
    [
      'RENDERER SUPPORT',
      'H_EARTH_RENDERER_RECEIPT_ARCHIVE',
      'Renderer Receipt Archive'
    ],

    [
      'RAW EVIDENCE',
      'H_EARTH_GLOBAL_EVIDENCE_ARCHIVE',
      'Global Evidence Archive'
    ],
    [
      'RAW EVIDENCE',
      'H_EARTH_ERROR_EVIDENCE_ARCHIVE',
      'Error Evidence Archive'
    ],
    [
      'RAW EVIDENCE',
      'H_EARTH_NETWORK_EVIDENCE_ARCHIVE',
      'Network Evidence Archive'
    ],
    [
      'RAW EVIDENCE',
      'H_EARTH_MODULE_GRAPH_EVIDENCE_ARCHIVE',
      'Module-Graph Evidence Archive'
    ],

    [
      'AGGREGATE ARCHIVE',
      'H_EARTH_DIAGNOSTIC_AGGREGATE_ARCHIVE',
      'Diagnostic Aggregate Archive'
    ],
    [
      'AGGREGATE ARCHIVE',
      'H_EARTH_READINESS_AGGREGATE_ARCHIVE',
      'Readiness Aggregate Archive'
    ]
  ]);

export const H_EARTH_3D_PRESERVED_CORPUS_COUNT =
  PRESERVED_CORPUS_BLUEPRINT.length;

function historicalRoleForCategory(
  category
) {
  return category === 'CUSTODY'
    ? H_EARTH_3D_REPORT_ROLES.CUSTODY
    : H_EARTH_3D_REPORT_ROLES.HISTORICAL;
}

function buildPreservedCorpus() {
  return PRESERVED_CORPUS_BLUEPRINT.map(
    (
      [category, reportId, title],
      index
    ) =>
      deepFreeze({
        reportId,
        title,
        tier:
          H_EARTH_3D_REPORT_TIERS
            .PRESERVED_DIAGNOSTIC_CORPUS,
        ordinal: index + 1,
        role:
          historicalRoleForCategory(
            category
          ),
        category,
        activity: 'PRESERVED',
        status: 'PRESERVED',
        authority:
          'NONCONTROLLING_PRESERVED_CORPUS',
        evidenceClassification:
          category === 'RAW EVIDENCE'
            ? H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL
            : 'HISTORICAL',
        currentOccurrenceControl: false,
        productionClaimAuthority:
          H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY,
        sourceCorrectionAuthority:
          H_EARTH_3D_SOURCE_CORRECTION_AUTHORITY
      })
  );
}

/* ==========================================================================
 * 04 · PRIMARY RECEIPT AND CURRENT-OCCURRENCE EVIDENCE
 * ========================================================================== */

function getPrimaryReceipt(root) {
  const receipt =
    root &&
    root[H_EARTH_3D_PRIMARY_RECEIPT_KEY];

  return isRecord(receipt)
    ? receipt
    : undefined;
}

function getWatchdogReceipt(root) {
  const receipt =
    root &&
    root[H_EARTH_3D_WATCHDOG_RECEIPT_KEY];

  return isRecord(receipt)
    ? receipt
    : undefined;
}

function getOperatorProjection(receipt) {
  if (!isRecord(receipt)) {
    return undefined;
  }

  if (
    isRecord(receipt.operatorProjection)
  ) {
    return receipt.operatorProjection;
  }

  const projected =
    invokeNamedGetter(
      receipt,
      'getOperatorProjection'
    );

  return isRecord(projected)
    ? projected
    : undefined;
}

function receiptSources(receipt) {
  const operatorProjection =
    getOperatorProjection(receipt);

  return [
    operatorProjection,
    receipt,
    isRecord(receipt && receipt.receipt)
      ? receipt.receipt
      : undefined,
    isRecord(receipt && receipt.evidence)
      ? receipt.evidence
      : undefined,
    isRecord(
      receipt &&
        receipt.importEvidence
    )
      ? receipt.importEvidence
      : undefined,
    isRecord(
      receipt &&
        receipt.boundaryEvidence
    )
      ? receipt.boundaryEvidence
      : undefined
  ].filter(Boolean);
}

function markerValue(root, markerName) {
  const value =
    root &&
    root[MARKERS[markerName]];

  return isNonEmptyString(value)
    ? value
    : H_EARTH_3D_MISSING_EVIDENCE_LABEL;
}

function extractReturnedResponse(sources) {
  const responseObject =
    firstObserved(
      sources,
      [
        'returnedResponse',
        'response',
        'responseMetadata',
        'networkResponse',
        'deployedResponse'
      ]
    );

  if (isRecord(responseObject)) {
    return {
      finalResponseUrl:
        normalizeObserved(
          firstObserved(
            [responseObject],
            [
              'finalResponseUrl',
              'responseUrl',
              'url'
            ]
          )
        ),

      httpStatus:
        normalizeObserved(
          firstObserved(
            [responseObject],
            [
              'httpStatus',
              'status',
              'statusCode'
            ]
          )
        ),

      contentType:
        normalizeObserved(
          firstObserved(
            [responseObject],
            [
              'contentType',
              'mimeType',
              'headers.content-type',
              'headers.contentType'
            ]
          )
        ),

      payloadClassification:
        normalizeObserved(
          firstObserved(
            [responseObject],
            [
              'payloadClassification',
              'classification',
              'bodyClassification'
            ]
          )
        ),

      responsePrefix:
        normalizeObserved(
          firstObserved(
            [responseObject],
            [
              'responsePrefix',
              'bodyPrefix',
              'boundedResponsePrefix'
            ]
          ),
          600
        )
    };
  }

  return {
    finalResponseUrl:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'finalResponseUrl',
            'responseUrl',
            'returnedResponseUrl'
          ]
        )
      ),

    httpStatus:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'httpStatus',
            'responseStatus',
            'statusCode'
          ]
        )
      ),

    contentType:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'contentType',
            'responseContentType',
            'mimeType'
          ]
        )
      ),

    payloadClassification:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'payloadClassification',
            'responseClassification',
            'bodyClassification'
          ]
        )
      ),

    responsePrefix:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'responsePrefix',
            'boundedResponsePrefix',
            'responseBodyPrefix'
          ]
        ),
        600
      )
  };
}

export function extractCurrentOccurrenceEvidence(
  root = globalThis
) {
  const primaryReceipt =
    getPrimaryReceipt(root);

  const sources =
    receiptSources(primaryReceipt);

  const operatorProjection =
    getOperatorProjection(primaryReceipt);

  const returnedResponse =
    extractReturnedResponse(sources);

  const exactFailedDeployedBranch =
    normalizeObserved(
      firstObserved(
        sources,
        [
          'exactFailedDeployedTransitiveBranch',
          'failedDeployedTransitiveBranch',
          'exactFailedTransitiveBranch',
          'failedTransitiveBranch',
          'failedImportRootBranch',
          'importFailedBranch',
          'importFailedBranches.0'
        ]
      )
    );

  const requestedUrl =
    normalizeObserved(
      firstObserved(
        sources,
        [
          'requestedUrl',
          'failedRequestedUrl',
          'failedRequestedPath',
          'requestedPath',
          'resolvedUrl',
          'exactFailedTransitiveUrl'
        ]
      )
    );

  const errorName =
    normalizeObserved(
      firstObserved(
        sources,
        [
          'errorName',
          'importErrorName',
          'error.name'
        ]
      )
    );

  const errorMessage =
    normalizeObserved(
      firstObserved(
        sources,
        [
          'errorMessage',
          'importErrorMessage',
          'error.message'
        ]
      ),
      1800
    );

  const rawStatus =
    firstObserved(
      sources,
      [
        'status',
        'receiptStatus',
        'lifecycleStatus',
        'completionStatus',
        'diagnosticStatus'
      ]
    );

  const normalizedReceiptStatus =
    normalizeStatus(rawStatus);

  const finalFlag =
    firstObserved(
      sources,
      [
        'final',
        'finalReceipt',
        'isFinal',
        'receiptFinal'
      ]
    );

  const primaryReceiptFinal =
    Boolean(primaryReceipt) &&
    (
      finalFlag === true ||
      String(finalFlag)
        .toUpperCase() === 'TRUE' ||
      normalizedReceiptStatus ===
        H_EARTH_3D_READY_STATUS
    );

  const branchObserved =
    hasDirectEvidence(
      exactFailedDeployedBranch
    );

  const requestedUrlObserved =
    hasDirectEvidence(requestedUrl);

  const returnedResponseObserved =
    hasDirectEvidence(
      returnedResponse.finalResponseUrl
    ) ||
    hasDirectEvidence(
      returnedResponse.httpStatus
    ) ||
    hasDirectEvidence(
      returnedResponse.contentType
    ) ||
    hasDirectEvidence(
      returnedResponse.payloadClassification
    ) ||
    hasDirectEvidence(
      returnedResponse.responsePrefix
    );

  const directEvidenceComplete =
    branchObserved &&
    requestedUrlObserved &&
    returnedResponseObserved;

  return deepFreeze({
    occurrenceClassification:
      primaryReceipt
        ? 'CURRENT OCCURRENCE'
        : H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL,

    evidencePrecedence:
      operatorProjection
        ? 'OPERATOR_PROJECTION_BEFORE_LEGACY_NESTED_RECEIPT_FIELDS'
        : primaryReceipt
          ? 'LEGACY_NESTED_RECEIPT_FIELDS_USED_BECAUSE_OPERATOR_PROJECTION_NOT_PRESENT'
          : H_EARTH_3D_MISSING_EVIDENCE_LABEL,

    primaryReceiptPresent:
      Boolean(primaryReceipt),

    primaryReceiptFinal,

    primaryReceiptStatus:
      normalizedReceiptStatus,

    primaryReceiptId:
      normalizeObserved(
        firstObserved(
          sources,
          [
            'receiptId',
            'id',
            'receiptID'
          ]
        )
      ),

    exactFailedDeployedBranch,

    requestedUrl,

    returnedResponse,

    branchObserved,

    requestedUrlObserved,

    returnedResponseObserved,

    directEvidenceComplete,

    failedRootModule:
      H_EARTH_3D_FAILED_ROOT_MODULE,

    errorName,

    errorMessage,

    moduleLoadedAt:
      markerValue(
        root,
        'moduleLoadedAt'
      ),

    instrumentStartedAt:
      markerValue(
        root,
        'instrumentStartedAt'
      ),

    receiptPublishedAt:
      markerValue(
        root,
        'receiptPublishedAt'
      ),

    receiptRenderedAt:
      markerValue(
        root,
        'receiptRenderedAt'
      ),

    unrestrictedGlobalClassification:
      H_EARTH_3D_UNCLASSIFIED_GLOBAL_LABEL
  });
}

/* ==========================================================================
 * 05 · EXACTLY ONE CONTROLLING NEXT OPERATION
 * ========================================================================== */

function normalizeOperationCandidate(
  candidate
) {
  if (isNonEmptyString(candidate)) {
    return {
      operationId:
        'PRIMARY_RECEIPT_NAMED_OPERATION',

      instruction:
        boundedText(
          candidate,
          1600
        )
    };
  }

  if (!isRecord(candidate)) {
    return undefined;
  }

  const operationId =
    firstObserved(
      [candidate],
      [
        'operationId',
        'id',
        'operation',
        'name'
      ]
    );

  const instruction =
    firstObserved(
      [candidate],
      [
        'instruction',
        'description',
        'nextStep',
        'action'
      ]
    );

  if (
    !operationId &&
    !instruction
  ) {
    return undefined;
  }

  return {
    operationId:
      boundedText(
        operationId ||
          'PRIMARY_RECEIPT_NAMED_OPERATION',
        220
      ),

    instruction:
      boundedText(
        instruction ||
          operationId,
        1800
      )
  };
}

function operationFromPrimaryReceipt(
  root
) {
  const primaryReceipt =
    getPrimaryReceipt(root);

  const sources =
    receiptSources(primaryReceipt);

  const candidate =
    firstObserved(
      sources,
      [
        'controllingNextOperation',
        'nextAuthorizedOperation',
        'nextOperation',
        'decision.nextAuthorizedOperation',
        'activeFailureDecision.nextAuthorizedOperation'
      ]
    );

  return normalizeOperationCandidate(
    candidate
  );
}

export function determineControllingNextOperation(
  evidence,
  root = globalThis
) {
  const receiptNamedOperation =
    operationFromPrimaryReceipt(root);

  if (
    evidence.primaryReceiptFinal &&
    receiptNamedOperation
  ) {
    return deepFreeze({
      operationId:
        receiptNamedOperation.operationId,

      instruction:
        receiptNamedOperation.instruction,

      authoritySource:
        H_EARTH_3D_PRIMARY_RECEIPT_KEY,

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    });
  }

  if (!evidence.branchObserved) {
    return deepFreeze({
      operationId:
        'DIRECTLY_IDENTIFY_FAILED_DEPLOYED_TRANSITIVE_BRANCH',

      instruction:
        'Directly identify the exact failed deployed transitive import branch. Do not modify the compositor, renderer, import graph, upstream source, HTML, CSS, or production authority.',

      authoritySource:
        'ACTIVE_FAILURE_DECISION_DERIVED_FROM_CURRENT_OCCURRENCE_EVIDENCE',

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    });
  }

  if (
    !evidence.requestedUrlObserved
  ) {
    return deepFreeze({
      operationId:
        'DIRECTLY_IDENTIFY_REQUESTED_URL',

      instruction:
        'Directly identify the exact requested URL for the failed deployed transitive branch. Source correction remains unauthorized.',

      authoritySource:
        'ACTIVE_FAILURE_DECISION_DERIVED_FROM_CURRENT_OCCURRENCE_EVIDENCE',

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    });
  }

  if (
    !evidence.returnedResponseObserved
  ) {
    return deepFreeze({
      operationId:
        'DIRECTLY_IDENTIFY_RETURNED_RESPONSE',

      instruction:
        'Directly identify the returned deployed response for the exact requested URL, including final response URL, status, content type, payload classification, or bounded response prefix. Source correction remains unauthorized.',

      authoritySource:
        'ACTIVE_FAILURE_DECISION_DERIVED_FROM_CURRENT_OCCURRENCE_EVIDENCE',

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    });
  }

  return deepFreeze({
    operationId:
      'CLASSIFY_EXACT_DEPLOYED_BOUNDARY_MISMATCH',

    instruction:
      'Classify the exact deployed import-boundary mismatch using the directly observed branch, requested URL, and returned response. Any source correction requires separate explicit authorization.',

    authoritySource:
      evidence.primaryReceiptFinal
        ? H_EARTH_3D_PRIMARY_RECEIPT_KEY
        : 'ACTIVE_FAILURE_DECISION_DERIVED_FROM_CURRENT_OCCURRENCE_EVIDENCE',

    sourceCorrectionAuthorized:
      false,

    productionClaimAuthority:
      H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
  });
}

/* ==========================================================================
 * 06 · WATCHDOG RECEIPT
 * ========================================================================== */

function getObservedImportState(
  root,
  importState
) {
  const primaryReceipt =
    getPrimaryReceipt(root);

  return {
    moduleImportAttempted:
      importState
        .moduleImportAttempted === true,

    moduleImportResolved:
      importState
        .moduleImportResolved === true,

    moduleImportRejected:
      importState
        .moduleImportRejected === true,

    moduleImportErrorName:
      normalizeObserved(
        importState
          .moduleImportErrorName
      ),

    moduleImportErrorMessage:
      normalizeObserved(
        importState
          .moduleImportErrorMessage,
        1800
      ),

    moduleLoadedAt:
      markerValue(
        root,
        'moduleLoadedAt'
      ),

    instrumentStartedAt:
      markerValue(
        root,
        'instrumentStartedAt'
      ),

    receiptPublishedAt:
      markerValue(
        root,
        'receiptPublishedAt'
      ),

    receiptRenderedAt:
      markerValue(
        root,
        'receiptRenderedAt'
      ),

    primaryReceiptPresent:
      Boolean(primaryReceipt)
  };
}

function classifyWatchdogState(state) {
  const fullyPublishing =
    state.moduleImportResolved === true &&
    hasDirectEvidence(
      state.moduleLoadedAt
    ) &&
    hasDirectEvidence(
      state.instrumentStartedAt
    ) &&
    state.primaryReceiptPresent === true &&
    hasDirectEvidence(
      state.receiptPublishedAt
    ) &&
    hasDirectEvidence(
      state.receiptRenderedAt
    );

  if (fullyPublishing) {
    return (
      'A_INSTALLED_EXECUTING_' +
      'AND_PUBLISHING'
    );
  }

  if (
    hasDirectEvidence(
      state.instrumentStartedAt
    ) &&
    (
      !state.primaryReceiptPresent ||
      !hasDirectEvidence(
        state.receiptPublishedAt
      ) ||
      !hasDirectEvidence(
        state.receiptRenderedAt
      )
    )
  ) {
    return (
      'B_EXECUTING_BUT_' +
      'NOT_PUBLISHING'
    );
  }

  if (
    (
      state.moduleImportResolved ||
      hasDirectEvidence(
        state.moduleLoadedAt
      )
    ) &&
    !hasDirectEvidence(
      state.instrumentStartedAt
    )
  ) {
    return (
      'C_INCLUDED_BUT_NOT_REACHED_' +
      'OR_NOT_INITIALIZED'
    );
  }

  return (
    'D_NOT_INCLUDED_OR_' +
    'COULD_NOT_LOAD'
  );
}

function buildWatchdogReceipt({
  root,
  importState,
  watchdogStartedAt,
  watchdogCompletedAt
}) {
  const state =
    getObservedImportState(
      root,
      importState
    );

  const evidence =
    extractCurrentOccurrenceEvidence(
      root
    );

  const primarySupersedesWatchdog =
    evidence.primaryReceiptFinal === true;

  const nextOperation =
    determineControllingNextOperation(
      evidence,
      root
    );

  return deepFreeze({
    receiptId:
      H_EARTH_3D_WATCHDOG_RECEIPT_KEY,

    receiptSchemaVersion: 1,

    contractId:
      H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID,

    directiveId:
      H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID,

    sourceFile:
      H_EARTH_3D_DIAGNOSTIC_FILE,

    failureDomain:
      H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

    moduleAddress:
      H_EARTH_3D_FD_05_MODULE_ADDRESS,

    role:
      H_EARTH_3D_REPORT_ROLES
        .SUPPORTING,

    status:
      primarySupersedesWatchdog
        ? 'SUPERSEDED'
        : 'INTERIM',

    authority:
      primarySupersedesWatchdog
        ? 'SUPERSEDED_BY_CURRENT_FINAL_PRIMARY_RECEIPT'
        : 'INTERIM_SUPPORTING_ONLY',

    watchdogStartedAt,

    watchdogCompletedAt,

    moduleImportAttempted:
      state.moduleImportAttempted,

    moduleImportResolved:
      state.moduleImportResolved,

    moduleImportRejected:
      state.moduleImportRejected,

    moduleImportErrorName:
      state.moduleImportErrorName,

    moduleImportErrorMessage:
      state.moduleImportErrorMessage,

    moduleLoadedAt:
      state.moduleLoadedAt,

    instrumentStartedAt:
      state.instrumentStartedAt,

    receiptPublishedAt:
      state.receiptPublishedAt,

    receiptRenderedAt:
      state.receiptRenderedAt,

    primaryReceiptPresent:
      state.primaryReceiptPresent,

    primaryReceiptFinal:
      evidence.primaryReceiptFinal,

    primaryReceiptSupersedesWatchdog:
      primarySupersedesWatchdog,

    instrumentClassification:
      classifyWatchdogState(state),

    controllingNextOperation:
      primarySupersedesWatchdog
        ? {
            operationId:
              'SUPERSEDED_BY_PRIMARY_RECEIPT',

            instruction:
              'Read the ACTIVE FAILURE DECISION. The current final primary receipt supersedes this interim watchdog authority.'
          }
        : nextOperation,

    sourceCorrectionAuthorized:
      false,

    productionClaimAuthority:
      H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
  });
}

function publishWatchdogReceipt(
  root,
  receipt
) {
  root[
    H_EARTH_3D_WATCHDOG_RECEIPT_KEY
  ] = receipt;

  dispatchBoundedEvent(
    root,
    INTERNAL.watchdogReceiptEvent,
    receipt
  );

  return receipt;
}

/* ==========================================================================
 * 07 · REPORT CONSTRUCTION
 * ========================================================================== */

function makeReport({
  reportId,
  title,
  tier,
  role,
  category,
  activity,
  status,
  authority,
  summary,
  fields
}) {
  return deepFreeze({
    reportId,
    title,
    tier,
    role,
    category,
    activity,
    status,

    readinessEligible:
      status ===
      H_EARTH_3D_READY_STATUS,

    authority,

    failureDomain:
      H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

    summary:
      boundedText(
        summary,
        2200
      ),

    fields:
      cloneForReport(fields),

    sourceCorrectionAuthority:
      H_EARTH_3D_SOURCE_CORRECTION_AUTHORITY,

    productionClaimAuthority:
      H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
  });
}

function buildActiveFailureDecision(
  evidence,
  root
) {
  const controllingNextOperation =
    determineControllingNextOperation(
      evidence,
      root
    );

  const complete =
    evidence.primaryReceiptStatus ===
      H_EARTH_3D_READY_STATUS &&
    evidence.directEvidenceComplete;

  const status =
    complete
      ? H_EARTH_3D_READY_STATUS
      : evidence.primaryReceiptStatus ===
          'FAILED'
        ? 'FAILED'
        : 'RUNNING';

  return makeReport({
    reportId:
      'H_EARTH_3D_ACTIVE_FAILURE_DECISION_REPORT',

    title:
      'ACTIVE FAILURE DECISION',

    tier:
      H_EARTH_3D_REPORT_TIERS
        .ACTIVE_FAILURE_DECISION,

    role:
      H_EARTH_3D_REPORT_ROLES.PRIMARY,

    category:
      'ACTIVE FAILURE DECISION',

    activity:
      'ACTIVE',

    status,

    authority:
      evidence.primaryReceiptFinal
        ? 'CURRENT_FINAL_PRIMARY_RECEIPT_CONTROLS'
        : 'CURRENT_OCCURRENCE_DERIVED_DECISION_CONTROLS',

    summary:
      'One primary decision report governs FD_05 and exposes exactly one controlling next operation. Source correction and production claims remain withheld.',

    fields: {
      activeFailureDomain:
        H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

      failedRootModule:
        H_EARTH_3D_FAILED_ROOT_MODULE,

      primaryReceipt:
        H_EARTH_3D_PRIMARY_RECEIPT_KEY,

      primaryReceiptPresent:
        evidence.primaryReceiptPresent,

      primaryReceiptFinal:
        evidence.primaryReceiptFinal,

      primaryReceiptStatus:
        evidence.primaryReceiptStatus,

      evidencePrecedence:
        evidence.evidencePrecedence,

      exactFailedDeployedBranch:
        evidence
          .exactFailedDeployedBranch,

      requestedUrl:
        evidence.requestedUrl,

      returnedResponse:
        evidence.returnedResponse,

      evidenceStillMissing: [
        evidence.branchObserved
          ? 'NONE_FOR_FAILED_DEPLOYED_TRANSITIVE_BRANCH'
          : H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        evidence.requestedUrlObserved
          ? 'NONE_FOR_REQUESTED_URL'
          : H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        evidence.returnedResponseObserved
          ? 'NONE_FOR_RETURNED_RESPONSE'
          : H_EARTH_3D_MISSING_EVIDENCE_LABEL
      ],

      controllingNextOperation,

      controllingNextOperationCount:
        1,

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    }
  });
}

function buildWatchdogStatusReport(
  watchdogReceipt,
  evidence
) {
  return makeReport({
    reportId:
      'H_EARTH_3D_FD_05_WATCHDOG_STATUS_REPORT',

    title:
      'FD_05 WATCHDOG STATUS',

    tier:
      H_EARTH_3D_REPORT_TIERS
        .WATCHDOG_STATUS,

    role:
      H_EARTH_3D_REPORT_ROLES
        .SUPPORTING,

    category:
      'WATCHDOG',

    activity:
      'ACTIVE',

    status:
      evidence.primaryReceiptFinal
        ? 'SUPERSEDED'
        : 'RUNNING',

    authority:
      evidence.primaryReceiptFinal
        ? 'SUPERSEDED_BY_CURRENT_FINAL_PRIMARY_RECEIPT'
        : 'INTERIM_SUPPORTING_ONLY',

    summary:
      'The watchdog reports whether the FD_05 module was included, initialized, and able to publish its primary receipt. It never replaces a current final primary receipt.',

    fields:
      watchdogReceipt || {
        receiptId:
          H_EARTH_3D_WATCHDOG_RECEIPT_KEY,

        status:
          'INTERIM',

        authority:
          'INTERIM_SUPPORTING_ONLY',

        instrumentClassification:
          H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        primaryReceiptSupersedesWatchdog:
          evidence.primaryReceiptFinal,

        sourceCorrectionAuthorized:
          false,

        productionClaimAuthority:
          H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
      }
  });
}

function buildTier2Reports(
  evidence,
  watchdogReceipt
) {
  const importAndContractStatus =
    evidence.primaryReceiptStatus ===
      H_EARTH_3D_READY_STATUS &&
    hasDirectEvidence(
      evidence.errorMessage
    )
      ? H_EARTH_3D_READY_STATUS
      : 'RUNNING';

  const sourceResolutionStatus =
    evidence.directEvidenceComplete
      ? H_EARTH_3D_READY_STATUS
      : 'RUNNING';

  const initializationComplete =
    hasDirectEvidence(
      evidence.moduleLoadedAt
    ) &&
    hasDirectEvidence(
      evidence.instrumentStartedAt
    );

  const initializationStatus =
    initializationComplete
      ? H_EARTH_3D_READY_STATUS
      : watchdogReceipt &&
          watchdogReceipt
            .moduleImportRejected
        ? 'FAILED'
        : 'RUNNING';

  const mismatchComplete =
    evidence.directEvidenceComplete &&
    hasDirectEvidence(
      evidence.errorMessage
    );

  const boundaryStatus =
    mismatchComplete
      ? H_EARTH_3D_READY_STATUS
      : 'RUNNING';

  return deepFreeze([
    makeReport({
      reportId:
        'H_EARTH_3D_IMPORT_AND_CONTRACT_REPORT',

      title:
        'IMPORT AND CONTRACT',

      tier:
        H_EARTH_3D_REPORT_TIERS
          .ACTIVE_SUPPORTING_REPORTS,

      role:
        H_EARTH_3D_REPORT_ROLES
          .SUPPORTING,

      category:
        'IMPORT AND CONTRACT',

      activity:
        'ACTIVE',

      status:
        importAndContractStatus,

      authority:
        'CURRENT_OCCURRENCE_SUPPORTING_EVIDENCE',

      summary:
        'Reports the failed root module, FD_05 import contract, directly observed error identity, and primary-receipt status.',

      fields: {
        failureDomain:
          H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

        failedRootModule:
          H_EARTH_3D_FAILED_ROOT_MODULE,

        diagnosticModuleAddress:
          H_EARTH_3D_FD_05_MODULE_ADDRESS,

        renewalContract:
          H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID,

        reportSystemDirective:
          H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID,

        errorName:
          evidence.errorName,

        errorMessage:
          evidence.errorMessage,

        primaryReceiptStatus:
          evidence.primaryReceiptStatus,

        readinessLaw:
          'COMPLETE is the only status eligible for readiness; RUNNING and FAILED are never readiness-complete.'
      }
    }),

    makeReport({
      reportId:
        'H_EARTH_3D_SOURCE_RESOLUTION_REPORT',

      title:
        'SOURCE RESOLUTION',

      tier:
        H_EARTH_3D_REPORT_TIERS
          .ACTIVE_SUPPORTING_REPORTS,

      role:
        H_EARTH_3D_REPORT_ROLES
          .SUPPORTING,

      category:
        'SOURCE RESOLUTION',

      activity:
        'ACTIVE',

      status:
        sourceResolutionStatus,

      authority:
        'CURRENT_OCCURRENCE_SUPPORTING_EVIDENCE',

      summary:
        'Reports the exact failed deployed transitive branch, requested URL, and returned response without authorizing source modification.',

      fields: {
        exactFailedDeployedBranch:
          evidence
            .exactFailedDeployedBranch,

        requestedUrl:
          evidence.requestedUrl,

        returnedResponse:
          evidence.returnedResponse,

        branchDirectlyObserved:
          evidence.branchObserved,

        requestedUrlDirectlyObserved:
          evidence.requestedUrlObserved,

        returnedResponseDirectlyObserved:
          evidence
            .returnedResponseObserved,

        directEvidenceComplete:
          evidence.directEvidenceComplete,

        sourceCorrectionAuthorized:
          false
      }
    }),

    makeReport({
      reportId:
        'H_EARTH_3D_INITIALIZATION_VS_EXECUTION_REPORT',

      title:
        'INITIALIZATION VS EXECUTION',

      tier:
        H_EARTH_3D_REPORT_TIERS
          .ACTIVE_SUPPORTING_REPORTS,

      role:
        H_EARTH_3D_REPORT_ROLES
          .SUPPORTING,

      category:
        'INITIALIZATION VS EXECUTION',

      activity:
        'ACTIVE',

      status:
        initializationStatus,

      authority:
        'CURRENT_OCCURRENCE_SUPPORTING_EVIDENCE',

      summary:
        'Separates module inclusion, module load, instrument initialization, primary-receipt publication, and normal-page rendering.',

      fields: {
        moduleLoadedAt:
          evidence.moduleLoadedAt,

        instrumentStartedAt:
          evidence.instrumentStartedAt,

        receiptPublishedAt:
          evidence.receiptPublishedAt,

        receiptRenderedAt:
          evidence.receiptRenderedAt,

        watchdogClassification:
          watchdogReceipt
            ? watchdogReceipt
                .instrumentClassification
            : H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        initializationComplete,

        executionReadiness:
          initializationStatus ===
          H_EARTH_3D_READY_STATUS
            ? H_EARTH_3D_READY_STATUS
            : initializationStatus,

        readinessLaw:
          'Module loading or initialization alone is not execution proof, browser-runtime proof, visual proof, deployment proof, or production proof.'
      }
    }),

    makeReport({
      reportId:
        'H_EARTH_3D_BOUNDARY_MISMATCH_REPORT',

      title:
        'BOUNDARY MISMATCH REPORT',

      tier:
        H_EARTH_3D_REPORT_TIERS
          .ACTIVE_SUPPORTING_REPORTS,

      role:
        H_EARTH_3D_REPORT_ROLES
          .SUPPORTING,

      category:
        'BOUNDARY MISMATCH REPORT',

      activity:
        'ACTIVE',

      status:
        boundaryStatus,

      authority:
        'CURRENT_OCCURRENCE_SUPPORTING_EVIDENCE',

      summary:
        'Classifies the observable disagreement among requested module identity, deployed response identity, content type, payload classification, and JavaScript parser failure.',

      fields: {
        failedRootModule:
          H_EARTH_3D_FAILED_ROOT_MODULE,

        exactFailedDeployedBranch:
          evidence
            .exactFailedDeployedBranch,

        requestedUrl:
          evidence.requestedUrl,

        finalResponseUrl:
          evidence
            .returnedResponse
            .finalResponseUrl,

        httpStatus:
          evidence
            .returnedResponse
            .httpStatus,

        contentType:
          evidence
            .returnedResponse
            .contentType,

        payloadClassification:
          evidence
            .returnedResponse
            .payloadClassification,

        responsePrefix:
          evidence
            .returnedResponse
            .responsePrefix,

        errorName:
          evidence.errorName,

        errorMessage:
          evidence.errorMessage,

        mismatchClassification:
          mismatchComplete
            ? 'DIRECTLY_OBSERVED_DEPLOYED_BOUNDARY_MISMATCH_READY_FOR_CLASSIFICATION'
            : H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        sourceCorrectionAuthorized:
          false
      }
    })
  ]);
}

function buildRoleRegistry({
  activeFailureDecision,
  watchdogStatus,
  tier2Reports,
  preservedCorpus
}) {
  const entries = [
    activeFailureDecision,
    watchdogStatus,
    ...tier2Reports,
    ...preservedCorpus
  ].map((report) =>
    deepFreeze({
      reportId:
        report.reportId,

      title:
        report.title,

      tier:
        report.tier,

      role:
        report.role,

      category:
        report.category,

      activity:
        report.activity
    })
  );

  return deepFreeze(entries);
}

function scanForForbiddenControllingValues(
  value,
  path = 'root',
  findings = []
) {
  if (value === null) {
    findings.push(
      `${path}:null`
    );

    return findings;
  }

  if (value === undefined) {
    findings.push(
      `${path}:undefined`
    );

    return findings;
  }

  if (value === '[Circular]') {
    findings.push(
      `${path}:[Circular]`
    );

    return findings;
  }

  if (Array.isArray(value)) {
    value.forEach(
      (entry, index) =>
        scanForForbiddenControllingValues(
          entry,
          `${path}[${index}]`,
          findings
        )
    );

    return findings;
  }

  if (isRecord(value)) {
    Object.entries(value).forEach(
      ([key, entry]) =>
        scanForForbiddenControllingValues(
          entry,
          `${path}.${key}`,
          findings
        )
    );
  }

  return findings;
}

function auditReportSystem(system) {
  const roleRegistry =
    system.roleRegistry;

  const allowedRoles =
    new Set(
      Object.values(
        H_EARTH_3D_REPORT_ROLES
      )
    );

  const invalidRoleEntries =
    roleRegistry.filter(
      (entry) =>
        !allowedRoles.has(entry.role)
    );

  const duplicateRoleAssignments =
    roleRegistry.filter(
      (entry) =>
        Array.isArray(entry.role)
    );

  const tier2Count =
    system
      .tier2
      .activeSupportingReports
      .length;

  const corpusCount =
    system
      .tier3
      .preservedDiagnosticCorpus
      .length;

  const primaryCount =
    roleRegistry.filter(
      (entry) =>
        entry.role ===
        H_EARTH_3D_REPORT_ROLES.PRIMARY
    ).length;

  const primaryOperation =
    system
      .tier1
      .activeFailureDecision
      .fields
      .controllingNextOperation;

  const controllingNextOperationCount =
    primaryOperation &&
    isRecord(primaryOperation)
      ? 1
      : 0;

  const forbiddenControllingValues =
    scanForForbiddenControllingValues({
      tier1:
        system.tier1,

      watchdog:
        system.watchdog,

      tier2:
        system.tier2
    });

  return deepFreeze({
    auditId:
      'H_EARTH_3D_DIAGNOSTIC_REPORT_SYSTEM_SELF_AUDIT',

    status:
      invalidRoleEntries.length === 0 &&
      duplicateRoleAssignments.length ===
        0 &&
      tier2Count === 4 &&
      corpusCount === 31 &&
      roleRegistry.length === 37 &&
      primaryCount === 1 &&
      controllingNextOperationCount ===
        1 &&
      forbiddenControllingValues.length ===
        0
        ? H_EARTH_3D_READY_STATUS
        : 'FAILED',

    preservedCorpusCount:
      corpusCount,

    tier2ReportCount:
      tier2Count,

    roleRegistryCount:
      roleRegistry.length,

    primaryRoleCount:
      primaryCount,

    invalidRoleCount:
      invalidRoleEntries.length,

    duplicateRoleAssignmentCount:
      duplicateRoleAssignments.length,

    controllingNextOperationCount,

    forbiddenControllingValueCount:
      forbiddenControllingValues.length,

    forbiddenControllingValues:
      forbiddenControllingValues.length > 0
        ? forbiddenControllingValues
        : ['NONE'],

    productionClaimAuthority:
      H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY,

    deploymentClaim:
      'NOT CLAIMED',

    browserRuntimeClaim:
      'NOT CLAIMED',

    visualClaim:
      'NOT CLAIMED',

    productionSuccessClaim:
      'NOT CLAIMED'
  });
}

export function buildDiagnosticReportSystem(
  root = globalThis
) {
  const evidence =
    extractCurrentOccurrenceEvidence(
      root
    );

  const watchdogReceipt =
    getWatchdogReceipt(root);

  const activeFailureDecision =
    buildActiveFailureDecision(
      evidence,
      root
    );

  const watchdogStatus =
    buildWatchdogStatusReport(
      watchdogReceipt,
      evidence
    );

  const tier2Reports =
    buildTier2Reports(
      evidence,
      watchdogReceipt
    );

  const preservedCorpus =
    buildPreservedCorpus();

  const roleRegistry =
    buildRoleRegistry({
      activeFailureDecision,
      watchdogStatus,
      tier2Reports,
      preservedCorpus
    });

  const provisional = {
    contractId:
      H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID,

    directiveId:
      H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID,

    sourceFile:
      H_EARTH_3D_DIAGNOSTIC_FILE,

    generatedAt:
      nowIso(),

    activeFailureDomain:
      H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

    interfaceOrder:
      H_EARTH_3D_INTERFACE_ORDER,

    tier1: {
      label:
        'ACTIVE FAILURE DECISION',

      activeFailureDecision
    },

    watchdog: {
      label:
        'FD_05 WATCHDOG STATUS',

      watchdogStatus
    },

    tier2: {
      label:
        'ACTIVE SUPPORTING REPORTS',

      activeSupportingReports:
        tier2Reports
    },

    tier3: {
      label:
        'PRESERVED DIAGNOSTIC CORPUS',

      categories:
        Object.freeze([
          'HISTORICAL',
          'CUSTODY',
          'CONTRACT',
          'ROUTE SUPPORT',
          'COMPOSITOR SUPPORT',
          'RENDERER SUPPORT',
          'RAW EVIDENCE',
          'AGGREGATE ARCHIVE'
        ]),

      preservedDiagnosticCorpus:
        preservedCorpus
    },

    roleRegistry,

    evidence,

    claimCeiling: {
      deployment:
        'NOT CLAIMED',

      browserRuntime:
        'NOT CLAIMED',

      visual:
        'NOT CLAIMED',

      production:
        'NOT CLAIMED',

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
    }
  };

  const selfAudit =
    auditReportSystem(provisional);

  return deepFreeze({
    ...provisional,
    selfAudit
  });
}

/* ==========================================================================
 * 08 · DOM PROJECTION — NO HTML OR CSS SOURCE MODIFICATION
 * ========================================================================== */

function createElement(
  documentObject,
  tagName,
  text
) {
  const element =
    documentObject.createElement(
      tagName
    );

  if (text !== undefined) {
    element.textContent =
      boundedText(
        text,
        10000
      );
  }

  return element;
}

function appendDefinitionRow(
  documentObject,
  list,
  label,
  value
) {
  const term =
    createElement(
      documentObject,
      'dt',
      label
    );

  const detail =
    createElement(
      documentObject,
      'dd',
      Array.isArray(value)
        ? value
            .map((entry) =>
              boundedText(
                entry,
                1200
              )
            )
            .join('\n')
        : isRecord(value)
          ? JSON.stringify(
              value,
              safeJsonReplacer(),
              2
            )
          : boundedText(
              value,
              4000
            )
    );

  list.append(
    term,
    detail
  );
}

function appendReportCard(
  documentObject,
  host,
  report
) {
  const article =
    createElement(
      documentObject,
      'article'
    );

  article.setAttribute(
    'data-h-earth-diagnostic-report',
    report.reportId
  );

  article.setAttribute(
    'data-report-role',
    report.role
  );

  article.setAttribute(
    'data-report-status',
    report.status
  );

  article.setAttribute(
    'data-report-tier',
    String(report.tier)
  );

  const header =
    createElement(
      documentObject,
      'header'
    );

  header.append(
    createElement(
      documentObject,
      'h3',
      report.title
    ),

    createElement(
      documentObject,
      'p',
      (
        `${report.role} · ` +
        `${report.status} · ` +
        `${report.authority}`
      )
    )
  );

  const summary =
    createElement(
      documentObject,
      'p',
      report.summary
    );

  const list =
    createElement(
      documentObject,
      'dl'
    );

  Object
    .entries(report.fields || {})
    .forEach(([key, value]) => {
      appendDefinitionRow(
        documentObject,
        list,
        key,
        value
      );
    });

  appendDefinitionRow(
    documentObject,
    list,
    'Production claim authority',
    report.productionClaimAuthority
  );

  appendDefinitionRow(
    documentObject,
    list,
    'Source correction authority',
    report.sourceCorrectionAuthority
  );

  article.append(
    header,
    summary,
    list
  );

  host.append(article);
}

function groupCorpusByCategory(
  corpus
) {
  return corpus.reduce(
    (groups, report) => {
      if (
        !groups.has(report.category)
      ) {
        groups.set(
          report.category,
          []
        );
      }

      groups
        .get(report.category)
        .push(report);

      return groups;
    },
    new Map()
  );
}

function resolveMountHost(
  documentObject
) {
  return (
    documentObject.querySelector(
      '[data-h-earth-diagnostic-track-host]'
    ) ||
    documentObject.querySelector(
      '[data-h-earth-diagnostic-root]'
    ) ||
    documentObject.querySelector(
      'main'
    ) ||
    documentObject.body
  );
}

export function renderDiagnosticReportSystem(
  system,
  root = globalThis
) {
  const documentObject =
    root &&
    root.document;

  if (!documentObject) {
    return false;
  }

  const host =
    resolveMountHost(
      documentObject
    );

  if (!host) {
    return false;
  }

  let mount =
    documentObject.getElementById(
      INTERNAL.mountId
    );

  if (!mount) {
    mount =
      createElement(
        documentObject,
        'section'
      );

    mount.id =
      INTERNAL.mountId;

    mount.setAttribute(
      'data-h-earth-diagnostic-report-system',
      'true'
    );

    mount.setAttribute(
      'aria-live',
      'polite'
    );

    host.append(mount);
  }

  mount.replaceChildren();

  const title =
    createElement(
      documentObject,
      'h1',
      'H-Earth Diagnostic Report System'
    );

  const authority =
    createElement(
      documentObject,
      'p',
      (
        `${system.activeFailureDomain} · ` +
        'Production claim authority ' +
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
      )
    );

  mount.append(
    title,
    authority
  );

  const tier1Section =
    createElement(
      documentObject,
      'section'
    );

  tier1Section.setAttribute(
    'data-interface-order',
    '1'
  );

  tier1Section.append(
    createElement(
      documentObject,
      'h2',
      'ACTIVE FAILURE DECISION'
    )
  );

  appendReportCard(
    documentObject,
    tier1Section,
    system
      .tier1
      .activeFailureDecision
  );

  mount.append(tier1Section);

  const watchdogSection =
    createElement(
      documentObject,
      'section'
    );

  watchdogSection.setAttribute(
    'data-interface-order',
    '2'
  );

  watchdogSection.append(
    createElement(
      documentObject,
      'h2',
      'FD_05 WATCHDOG STATUS'
    )
  );

  appendReportCard(
    documentObject,
    watchdogSection,
    system
      .watchdog
      .watchdogStatus
  );

  mount.append(
    watchdogSection
  );

  const tier2Section =
    createElement(
      documentObject,
      'section'
    );

  tier2Section.setAttribute(
    'data-interface-order',
    '3'
  );

  tier2Section.append(
    createElement(
      documentObject,
      'h2',
      'ACTIVE SUPPORTING REPORTS'
    )
  );

  system
    .tier2
    .activeSupportingReports
    .forEach((report) => {
      appendReportCard(
        documentObject,
        tier2Section,
        report
      );
    });

  mount.append(tier2Section);

  const tier3Section =
    createElement(
      documentObject,
      'section'
    );

  tier3Section.setAttribute(
    'data-interface-order',
    '4'
  );

  tier3Section.append(
    createElement(
      documentObject,
      'h2',
      'PRESERVED DIAGNOSTIC CORPUS'
    )
  );

  const groupedCorpus =
    groupCorpusByCategory(
      system
        .tier3
        .preservedDiagnosticCorpus
    );

  system
    .tier3
    .categories
    .forEach((category) => {
      const details =
        createElement(
          documentObject,
          'details'
        );

      details.setAttribute(
        'data-corpus-category',
        category
      );

      const reports =
        groupedCorpus.get(category) ||
        [];

      const summary =
        createElement(
          documentObject,
          'summary',
          `${category} · ${reports.length}`
        );

      details.append(summary);

      reports.forEach((report) => {
        appendReportCard(
          documentObject,
          details,
          report
        );
      });

      tier3Section.append(details);
    });

  mount.append(tier3Section);

  const auditSection =
    createElement(
      documentObject,
      'section'
    );

  auditSection.setAttribute(
    'data-h-earth-self-audit',
    'true'
  );

  auditSection.append(
    createElement(
      documentObject,
      'h2',
      'REPORT SYSTEM SELF-AUDIT'
    )
  );

  const auditList =
    createElement(
      documentObject,
      'dl'
    );

  Object
    .entries(system.selfAudit)
    .forEach(([key, value]) => {
      appendDefinitionRow(
        documentObject,
        auditList,
        key,
        value
      );
    });

  auditSection.append(
    auditList
  );

  mount.append(
    auditSection
  );

  return Boolean(
    documentObject.getElementById(
      INTERNAL.mountId
    )
  );
}

/* ==========================================================================
 * 09 · PUBLICATION, REFRESH, AND HOST RECEIPT
 * ========================================================================== */

function publishReportSystem(
  root,
  system,
  rendered
) {
  root[
    H_EARTH_3D_REPORT_SYSTEM_KEY
  ] = system;

  root[
    H_EARTH_3D_ROLE_REGISTRY_KEY
  ] = system.roleRegistry;

  root[
    H_EARTH_3D_ACTIVE_DECISION_KEY
  ] =
    system
      .tier1
      .activeFailureDecision;

  const receipt =
    deepFreeze({
      receiptId:
        H_EARTH_3D_HOST_RECEIPT_KEY,

      contractId:
        H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID,

      directiveId:
        H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID,

      sourceFile:
        H_EARTH_3D_DIAGNOSTIC_FILE,

      publishedAt:
        nowIso(),

      status:
        system.selfAudit.status,

      renderedToNormalPage:
        rendered,

      activeFailureDomain:
        H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

      primaryReceiptKey:
        H_EARTH_3D_PRIMARY_RECEIPT_KEY,

      watchdogReceiptKey:
        H_EARTH_3D_WATCHDOG_RECEIPT_KEY,

      preservedCorpusCount:
        system
          .selfAudit
          .preservedCorpusCount,

      tier2ReportCount:
        system
          .selfAudit
          .tier2ReportCount,

      roleRegistryCount:
        system
          .selfAudit
          .roleRegistryCount,

      controllingNextOperationCount:
        system
          .selfAudit
          .controllingNextOperationCount,

      forbiddenControllingValueCount:
        system
          .selfAudit
          .forbiddenControllingValueCount,

      sourceCorrectionAuthorized:
        false,

      productionClaimAuthority:
        H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY,

      deploymentClaim:
        'NOT CLAIMED',

      browserRuntimeSuccessClaim:
        'NOT CLAIMED',

      visualSuccessClaim:
        'NOT CLAIMED',

      productionSuccessClaim:
        'NOT CLAIMED'
    });

  root[
    H_EARTH_3D_HOST_RECEIPT_KEY
  ] = receipt;

  dispatchBoundedEvent(
    root,
    INTERNAL.reportSystemEvent,
    system
  );

  dispatchBoundedEvent(
    root,
    INTERNAL.hostReceiptEvent,
    receipt
  );

  return receipt;
}

export function refreshHEarthDiagnosticReportSystem(
  root = globalThis
) {
  const system =
    buildDiagnosticReportSystem(
      root
    );

  const rendered =
    renderDiagnosticReportSystem(
      system,
      root
    );

  const receipt =
    publishReportSystem(
      root,
      system,
      rendered
    );

  return deepFreeze({
    system,
    receipt,
    rendered
  });
}

/* ==========================================================================
 * 10 · FD_05 MODULE WATCHDOG LIFECYCLE
 * ========================================================================== */

function runtimeStateFor(root) {
  if (
    !isRecord(
      root[INTERNAL.runtimeStateKey]
    )
  ) {
    root[INTERNAL.runtimeStateKey] = {
      initialized: false,
      destroyed: false,
      watchdogCompleted: false,

      watchdogTimerId:
        H_EARTH_3D_MISSING_EVIDENCE_LABEL,

      importPromise:
        H_EARTH_3D_MISSING_EVIDENCE_LABEL,

      cleanupFunctions: [],

      importState: {
        moduleImportAttempted:
          false,

        moduleImportResolved:
          false,

        moduleImportRejected:
          false,

        moduleImportErrorName:
          H_EARTH_3D_MISSING_EVIDENCE_LABEL,

        moduleImportErrorMessage:
          H_EARTH_3D_MISSING_EVIDENCE_LABEL
      },

      watchdogStartedAt:
        H_EARTH_3D_MISSING_EVIDENCE_LABEL
    };
  }

  return root[
    INTERNAL.runtimeStateKey
  ];
}

function listen(
  root,
  eventName,
  handler
) {
  if (
    !root ||
    typeof root.addEventListener !==
      'function'
  ) {
    return () => {};
  }

  root.addEventListener(
    eventName,
    handler
  );

  return () =>
    root.removeEventListener(
      eventName,
      handler
    );
}

function installReceiptListeners(
  root,
  state
) {
  const refresh = () => {
    if (!state.destroyed) {
      refreshHEarthDiagnosticReportSystem(
        root
      );
    }
  };

  state.cleanupFunctions.push(
    listen(
      root,
      INTERNAL.primaryReceiptEvent,
      refresh
    ),

    listen(
      root,
      INTERNAL.primaryReceiptUpdatedEvent,
      refresh
    ),

    listen(
      root,
      INTERNAL.watchdogReceiptEvent,
      refresh
    )
  );
}

function completeWatchdog(
  root,
  state
) {
  if (
    state.watchdogCompleted ||
    state.destroyed
  ) {
    return getWatchdogReceipt(root);
  }

  state.watchdogCompleted = true;

  if (
    state.watchdogTimerId !==
      H_EARTH_3D_MISSING_EVIDENCE_LABEL &&
    typeof root.clearTimeout ===
      'function'
  ) {
    root.clearTimeout(
      state.watchdogTimerId
    );
  }

  const receipt =
    buildWatchdogReceipt({
      root,

      importState:
        state.importState,

      watchdogStartedAt:
        state.watchdogStartedAt,

      watchdogCompletedAt:
        nowIso()
    });

  publishWatchdogReceipt(
    root,
    receipt
  );

  refreshHEarthDiagnosticReportSystem(
    root
  );

  return receipt;
}

export function startHEarthFd05Watchdog(
  root = globalThis,
  options = {}
) {
  const state =
    runtimeStateFor(root);

  if (state.destroyed) {
    throw new Error(
      'H-Earth diagnostic runtime has been destroyed for this occurrence.'
    );
  }

  if (
    state
      .importState
      .moduleImportAttempted
  ) {
    return state.importPromise;
  }

  state.watchdogStartedAt =
    nowIso();

  state
    .importState
    .moduleImportAttempted = true;

  const importFunction =
    options.importFunction ||
    (
      (modulePath) =>
        import(modulePath)
    );

  let importResult;

  try {
    importResult =
      importFunction(
        H_EARTH_3D_FD_05_MODULE_PATH
      );
  } catch (error) {
    state
      .importState
      .moduleImportRejected = true;

    state
      .importState
      .moduleImportErrorName =
        boundedText(
          error && error.name,
          160
        );

    state
      .importState
      .moduleImportErrorMessage =
        boundedText(
          error && error.message
            ? error.message
            : error,
          1800
        );

    state.importPromise =
      Promise.resolve(
        completeWatchdog(
          root,
          state
        )
      );

    return state.importPromise;
  }

  state.importPromise =
    Promise
      .resolve(importResult)
      .then(
        (moduleNamespace) => {
          state
            .importState
            .moduleImportResolved =
              true;

          const getterNames = [
            'getHEarthFd05ModuleImportDiagnosticReceipt',
            'getHEarth3DModuleImportDiagnosticReceipt',
            'getModuleImportDiagnosticReceipt'
          ];

          for (
            const getterName
            of getterNames
          ) {
            const projected =
              invokeNamedGetter(
                moduleNamespace,
                getterName
              );

            if (isRecord(projected)) {
              root[
                H_EARTH_3D_PRIMARY_RECEIPT_KEY
              ] = projected;

              break;
            }
          }

          refreshHEarthDiagnosticReportSystem(
            root
          );

          return moduleNamespace;
        },

        (error) => {
          state
            .importState
            .moduleImportRejected =
              true;

          state
            .importState
            .moduleImportErrorName =
              boundedText(
                error && error.name,
                160
              );

          state
            .importState
            .moduleImportErrorMessage =
              boundedText(
                error && error.message
                  ? error.message
                  : error,
                1800
              );

          completeWatchdog(
            root,
            state
          );

          return H_EARTH_3D_MISSING_EVIDENCE_LABEL;
        }
      );

  const interval =
    Number.isFinite(
      options.watchdogIntervalMs
    )
      ? Math.max(
          0,
          options.watchdogIntervalMs
        )
      : H_EARTH_3D_WATCHDOG_INTERVAL_MS;

  if (
    typeof root.setTimeout ===
      'function'
  ) {
    state.watchdogTimerId =
      root.setTimeout(
        () =>
          completeWatchdog(
            root,
            state
          ),
        interval
      );
  } else {
    completeWatchdog(
      root,
      state
    );
  }

  return state.importPromise;
}

/* ==========================================================================
 * 11 · INITIALIZATION AND TEARDOWN
 * ========================================================================== */

export function initializeHEarthDiagnosticReportSystem(
  root = globalThis,
  options = {}
) {
  const state =
    runtimeStateFor(root);

  if (
    state.initialized &&
    !state.destroyed
  ) {
    return refreshHEarthDiagnosticReportSystem(
      root
    );
  }

  state.initialized = true;
  state.destroyed = false;

  installReceiptListeners(
    root,
    state
  );

  const initial =
    refreshHEarthDiagnosticReportSystem(
      root
    );

  if (
    options.startWatchdog !== false
  ) {
    startHEarthFd05Watchdog(
      root,
      options
    ).catch((error) => {
      state
        .importState
        .moduleImportRejected =
          true;

      state
        .importState
        .moduleImportErrorName =
          boundedText(
            error && error.name,
            160
          );

      state
        .importState
        .moduleImportErrorMessage =
          boundedText(
            error && error.message
              ? error.message
              : error,
            1800
          );

      completeWatchdog(
        root,
        state
      );
    });
  }

  return initial;
}

export function destroyHEarthDiagnosticReportSystem(
  root = globalThis
) {
  const state =
    runtimeStateFor(root);

  state.destroyed = true;

  if (
    state.watchdogTimerId !==
      H_EARTH_3D_MISSING_EVIDENCE_LABEL &&
    typeof root.clearTimeout ===
      'function'
  ) {
    root.clearTimeout(
      state.watchdogTimerId
    );
  }

  state
    .cleanupFunctions
    .splice(0)
    .forEach((cleanup) => {
      try {
        cleanup();
      } catch (_error) {
        // Teardown continues through all
        // registered cleanup functions.
      }
    });

  const documentObject =
    root &&
    root.document;

  if (documentObject) {
    const mount =
      documentObject.getElementById(
        INTERNAL.mountId
      );

    if (mount) {
      mount.remove();
    }
  }

  return deepFreeze({
    status:
      'DESTROYED',

    sourceFile:
      H_EARTH_3D_DIAGNOSTIC_FILE,

    sourceCorrectionAuthorized:
      false,

    productionClaimAuthority:
      H_EARTH_3D_PRODUCTION_CLAIM_AUTHORITY
  });
}

/* ==========================================================================
 * 12 · EXPORTED TEST AND INSPECTION API
 * ========================================================================== */

export const H_EARTH_3D_DIAGNOSTIC_TEST_API =
  deepFreeze({
    contractId:
      H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID,

    directiveId:
      H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID,

    sourceFile:
      H_EARTH_3D_DIAGNOSTIC_FILE,

    failureDomain:
      H_EARTH_3D_ACTIVE_FAILURE_DOMAIN,

    primaryReceiptKey:
      H_EARTH_3D_PRIMARY_RECEIPT_KEY,

    watchdogReceiptKey:
      H_EARTH_3D_WATCHDOG_RECEIPT_KEY,

    preservedCorpusCount:
      H_EARTH_3D_PRESERVED_CORPUS_COUNT,

    expectedTier2ReportCount:
      4,

    expectedRoleRegistryCount:
      37,

    invokeNamedGetter,

    extractCurrentOccurrenceEvidence,

    determineControllingNextOperation,

    buildDiagnosticReportSystem,

    renderDiagnosticReportSystem,

    refreshHEarthDiagnosticReportSystem,

    startHEarthFd05Watchdog,

    initializeHEarthDiagnosticReportSystem,

    destroyHEarthDiagnosticReportSystem
  });

/* ==========================================================================
 * 13 · GLOBAL BINDING AND AUTO-START
 * ========================================================================== */

const ROOT =
  typeof globalThis !== 'undefined'
    ? globalThis
    : typeof window !== 'undefined'
      ? window
      : undefined;

if (ROOT) {
  ROOT
    .H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID =
      H_EARTH_3D_DIAGNOSTIC_BOOTSTRAP_CONTRACT_ID;

  ROOT
    .H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID =
      H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_DIRECTIVE_ID;

  ROOT
    .H_EARTH_3D_DIAGNOSTIC_TEST_API =
      H_EARTH_3D_DIAGNOSTIC_TEST_API;

  if (
    ROOT[
      INTERNAL.disableAutoStartKey
    ] !== true
  ) {
    if (
      ROOT.document &&
      ROOT.document.readyState ===
        'loading'
    ) {
      ROOT.document.addEventListener(
        'DOMContentLoaded',
        () =>
          initializeHEarthDiagnosticReportSystem(
            ROOT
          ),
        {
          once: true
        }
      );
    } else {
      initializeHEarthDiagnosticReportSystem(
        ROOT
      );
    }
  }
}
