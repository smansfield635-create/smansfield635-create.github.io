/**
 * /showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js
 * COMPLETE RENEWED OPERATIONAL DIAGNOSTIC-OVERLAY MODULE
 *
 * CONTRACT:
 * H_EARTH_DIAGNOSTIC_FD_05_MODULE_IMPORT_TRACK_FILE_BIRTH_v1
 *
 * FAILURE DOMAIN:
 * FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH
 *
 * REPORT-SYSTEM ALIGNMENT:
 * H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_ACTIVE_FAILURE_DECISION_RENEWAL_DIRECTIVE_v1
 *
 * This file is a bounded diagnostic instrument. It does not modify or reopen
 * compositor, renderer, geometry, runtime, route, engine, or any of the
 * 43 constitutional source authorities.
 *
 * Renewal scope:
 *
 * - preserve direct root-response probes;
 * - preserve isolated compositor and renderer ES-module imports;
 * - preserve contract correspondence checks;
 * - preserve direct transitive-failure admission rules;
 * - preserve candidate-transitive URL separation;
 * - preserve source-correction withholding;
 * - align active supporting-report identities;
 * - classify All Diagnostic Evidence as the full archive;
 * - renew occurrence-scoped execution and publication markers;
 * - distinguish root-response evidence from exact-transitive response evidence;
 * - publish a flat, non-circular operator projection;
 * - publish exactly one authorized next operation;
 * - make no recursive graph expansion;
 * - make no backed-source correction.
 */

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID =
  'H_EARTH_DIAGNOSTIC_FD_05_MODULE_IMPORT_TRACK_FILE_BIRTH_v1';

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE =
  '/showroom/globe/h-earth/diagnostic/h-earth.fd-05-module-import-track.js';

export const H_EARTH_FD_05_REPORT_SYSTEM_DIRECTIVE_ID =
  'H_EARTH_DIAGNOSTIC_REPORT_SYSTEM_ACTIVE_FAILURE_DECISION_RENEWAL_DIRECTIVE_v1';

export const H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN =
  'FD_05_DEPLOYED_ES_MODULE_IMPORT_GRAPH';

export const H_EARTH_FD_06_NEXT_FAILURE_DOMAIN =
  'FD_06_API_AND_CONTRACT_CORRESPONDENCE';

export const H_EARTH_FD_05_PRIMARY_RECEIPT_ID =
  'H_EARTH_3D_MODULE_IMPORT_DIAGNOSTIC_RECEIPT';

export const H_EARTH_FD_05_PRIMARY_REPORT =
  'IMPORT_AND_CONTRACT';

export const H_EARTH_FD_05_SUPPORTING_REPORTS = Object.freeze([
  'SOURCE_RESOLUTION',
  'INITIALIZATION_VS_EXECUTION',
  'BOUNDARY_MISMATCH_REPORT'
]);

export const H_EARTH_FD_05_FULL_EVIDENCE_ARCHIVE =
  'ALL_DIAGNOSTIC_EVIDENCE';

export const H_EARTH_FD_05_PAYLOAD_CLASSIFICATION = Object.freeze({
  JAVASCRIPT_LIKE_RESPONSE:
    'JAVASCRIPT_LIKE_RESPONSE',

  JSON_LIKE_RESPONSE:
    'JSON_LIKE_RESPONSE',

  HTML_LIKE_RESPONSE:
    'HTML_LIKE_RESPONSE',

  EMPTY_RESPONSE:
    'EMPTY_RESPONSE',

  HTTP_ERROR_RESPONSE:
    'HTTP_ERROR_RESPONSE',

  UNRECOGNIZED_TEXT_RESPONSE:
    'UNRECOGNIZED_TEXT_RESPONSE',

  RESPONSE_BODY_UNAVAILABLE:
    'RESPONSE_BODY_UNAVAILABLE',

  FETCH_UNAVAILABLE:
    'FETCH_UNAVAILABLE',

  FETCH_FAILED:
    'FETCH_FAILED'
});

export const H_EARTH_FD_05_TRANSPORT_DISPOSITION = Object.freeze({
  DIRECT_RESPONSE:
    'DIRECT_RESPONSE',

  REDIRECTED_RESPONSE:
    'REDIRECTED_RESPONSE',

  HTTP_ERROR_RESPONSE:
    'HTTP_ERROR_RESPONSE',

  FETCH_FAILED:
    'FETCH_FAILED',

  FETCH_UNAVAILABLE:
    'FETCH_UNAVAILABLE'
});

export const H_EARTH_FD_05_RESPONSE_EVIDENCE_SCOPE = Object.freeze({
  EXACT_FAILED_TRANSITIVE_RESPONSE:
    'EXACT_FAILED_TRANSITIVE_RESPONSE',

  ROOT_BRANCH_RESPONSE:
    'ROOT_BRANCH_RESPONSE',

  NO_RESPONSE_EVIDENCE:
    'NO_RESPONSE_EVIDENCE'
});

const GLOBAL_RECEIPT_KEY =
  H_EARTH_FD_05_PRIMARY_RECEIPT_ID;

const GLOBAL_TRACK_KEY =
  'H_EARTH_FD_05_MODULE_IMPORT_TRACK';

const RECEIPT_EVENT =
  'h-earth:fd-05-module-import-diagnostic-receipt';

const MOUNT_ID =
  'h-earth-fd-05-module-import-track';

const STYLE_ID =
  `${MOUNT_ID}-style`;

const RESPONSE_PREFIX_LIMIT =
  512;

const STACK_LIMIT =
  2400;

const MESSAGE_LIMIT =
  1200;

const URL_LIMIT =
  12;

const MARKERS = Object.freeze({
  MODULE_LOADED_AT:
    'H_EARTH_FD_05_MODULE_LOADED_AT',

  INSTRUMENT_STARTED_AT:
    'H_EARTH_FD_05_INSTRUMENT_STARTED_AT',

  RECEIPT_PUBLISHED_AT:
    'H_EARTH_FD_05_RECEIPT_PUBLISHED_AT',

  RECEIPT_RENDERED_AT:
    'H_EARTH_FD_05_RECEIPT_RENDERED_AT'
});

const DEFAULT_BRANCHES = Object.freeze([
  Object.freeze({
    branchId:
      'COMPOSITOR_ROOT',

    label:
      'Compositor root',

    requestedPath:
      '../compositor.js',

    expectedSourcePath:
      '/showroom/globe/h-earth/compositor.js',

    expectedContractExport:
      'H_EARTH_3D_COMPOSITOR_CONTRACT_ID',

    expectedContractId:
      'H_EARTH_3D_COMPOSITOR_FILE_RENEWAL_STEP_034O_8_ADMITTED_GEOMETRY_FRAME_COMPOSITION_v1'
  }),

  Object.freeze({
    branchId:
      'RENDERER_ROOT',

    label:
      'Renderer root',

    requestedPath:
      '../renderer.js',

    expectedSourcePath:
      '/showroom/globe/h-earth/renderer.js',

    expectedContractExport:
      'H_EARTH_3D_RENDERER_CONTRACT_ID',

    expectedContractId:
      'H_EARTH_3D_RENDERER_FILE_RENEWAL_STEP_034O_9_ADMITTED_GEOMETRY_FRAME_MATERIALIZATION_v1'
  })
]);

function nowIso() {
  return new Date().toISOString();
}

function isNonEmptyString(value) {
  return (
    typeof value === 'string' &&
    value.trim().length > 0
  );
}

function bounded(
  value,
  limit
) {
  if (
    value === undefined ||
    value === null
  ) {
    return null;
  }

  const text =
    String(value);

  return text.length <= limit
    ? text
    : `${text.slice(0, limit)}…`;
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

  for (
    const key
    of Reflect.ownKeys(value)
  ) {
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
  }

  return Object.freeze(value);
}

function resolveUrl(
  value,
  base
) {
  try {
    return new URL(
      value,
      base
    ).href;
  } catch {
    return null;
  }
}

function equivalentUrl(
  left,
  right
) {
  if (
    !left ||
    !right
  ) {
    return false;
  }

  try {
    const a =
      new URL(left);

    const b =
      new URL(right);

    a.hash = '';
    b.hash = '';

    return a.href === b.href;
  } catch {
    return left === right;
  }
}

function normalizedPrefix(value) {
  return isNonEmptyString(value)
    ? value
        .replace(
          /\u0000/g,
          ''
        )
        .replace(
          /\r\n/g,
          '\n'
        )
        .slice(
          0,
          RESPONSE_PREFIX_LIMIT
        )
    : '';
}

function isHtmlLike(
  prefix,
  contentType
) {
  const type =
    String(
      contentType ||
      ''
    ).toLowerCase();

  const text =
    String(
      prefix ||
      ''
    )
      .trimStart()
      .toLowerCase();

  return (
    type.includes(
      'text/html'
    ) ||
    /^(?:<!doctype html|<html|<head|<body|<title|<script)/.test(
      text
    )
  );
}

function isJsonLike(
  prefix,
  contentType
) {
  const type =
    String(
      contentType ||
      ''
    ).toLowerCase();

  const text =
    String(
      prefix ||
      ''
    ).trim();

  if (
    type.includes(
      'application/json'
    ) ||
    type.includes(
      '+json'
    )
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
    String(
      contentType ||
      ''
    ).toLowerCase();

  const text =
    String(
      prefix ||
      ''
    ).trimStart();

  return (
    type.includes(
      'javascript'
    ) ||
    type.includes(
      'ecmascript'
    ) ||
    /^(?:\/\*|\/\/|import\s|export\s|const\s|let\s|var\s|class\s|function\s|async\s+function\s|['"]use strict['"])/.test(
      text
    )
  );
}

export function classifyHEarthFd05Payload({
  fetchAvailable,
  fetchSucceeded,
  responseOk,
  httpStatus,
  bodyReadSucceeded,
  responsePrefix,
  contentType
}) {
  if (
    fetchAvailable === false
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .FETCH_UNAVAILABLE;
  }

  if (
    fetchSucceeded === false
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .FETCH_FAILED;
  }

  if (
    responseOk === false ||
    (
      Number.isInteger(
        httpStatus
      ) &&
      (
        httpStatus < 200 ||
        httpStatus >= 400
      )
    )
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .HTTP_ERROR_RESPONSE;
  }

  if (
    bodyReadSucceeded === false
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .RESPONSE_BODY_UNAVAILABLE;
  }

  if (
    String(
      responsePrefix ||
      ''
    ).length === 0
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .EMPTY_RESPONSE;
  }

  if (
    isHtmlLike(
      responsePrefix,
      contentType
    )
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .HTML_LIKE_RESPONSE;
  }

  if (
    isJsonLike(
      responsePrefix,
      contentType
    )
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .JSON_LIKE_RESPONSE;
  }

  if (
    isJavaScriptLike(
      responsePrefix,
      contentType
    )
  ) {
    return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
      .JAVASCRIPT_LIKE_RESPONSE;
  }

  return H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
    .UNRECOGNIZED_TEXT_RESPONSE;
}

export function classifyHEarthFd05Transport({
  fetchAvailable,
  fetchSucceeded,
  responseOk,
  httpStatus,
  redirected,
  finalResponseUrl,
  resolvedUrl
}) {
  if (
    fetchAvailable === false
  ) {
    return H_EARTH_FD_05_TRANSPORT_DISPOSITION
      .FETCH_UNAVAILABLE;
  }

  if (
    fetchSucceeded === false
  ) {
    return H_EARTH_FD_05_TRANSPORT_DISPOSITION
      .FETCH_FAILED;
  }

  if (
    responseOk === false ||
    (
      Number.isInteger(
        httpStatus
      ) &&
      (
        httpStatus < 200 ||
        httpStatus >= 400
      )
    )
  ) {
    return H_EARTH_FD_05_TRANSPORT_DISPOSITION
      .HTTP_ERROR_RESPONSE;
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
    return H_EARTH_FD_05_TRANSPORT_DISPOSITION
      .REDIRECTED_RESPONSE;
  }

  return H_EARTH_FD_05_TRANSPORT_DISPOSITION
    .DIRECT_RESPONSE;
}

function captureError(
  error,
  evidenceType
) {
  return deepFreeze({
    errorEvidenceType:
      evidenceType,

    errorName:
      bounded(
        error?.name,
        160
      ),

    errorMessage:
      bounded(
        error?.message ??
        error,
        MESSAGE_LIMIT
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
        error?.cause?.message ??
        error?.cause?.name ??
        error?.cause,
        800
      )
  });
}

function noErrorEvidence() {
  return deepFreeze({
    errorEvidenceType:
      null,

    errorName:
      null,

    errorMessage:
      null,

    errorStack:
      null,

    errorFileName:
      null,

    errorLineNumber:
      null,

    errorColumnNumber:
      null,

    errorCause:
      null
  });
}

function extractUrls(
  text,
  baseUrl
) {
  if (
    !isNonEmptyString(text)
  ) {
    return [];
  }

  const output = [];

  const patterns = [
    /https?:\/\/[^\s<>'")\]]+/gi,
    /(?:\.\.\/|\.\/|\/)[A-Za-z0-9_./%+~@-]+\.m?js(?:\?[^\s<>'")\]]*)?/gi
  ];

  for (
    const pattern
    of patterns
  ) {
    for (
      const match
      of text.matchAll(pattern)
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

function uniqueCandidateUrls(
  errorEvidence,
  rootUrl,
  finalResponseUrl,
  moduleUrl
) {
  const texts = [
    errorEvidence.errorMessage,
    errorEvidence.errorStack,
    errorEvidence.errorFileName,
    errorEvidence.errorCause
  ];

  const seen =
    new Set();

  const output = [];

  for (
    const text
    of texts
  ) {
    for (
      const candidate
      of extractUrls(
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
          moduleUrl
        ) ||
        seen.has(candidate) ||
        !/\.m?js(?:$|\?)/i.test(
          candidate
        )
      ) {
        continue;
      }

      seen.add(candidate);
      output.push(candidate);

      if (
        output.length >=
        URL_LIMIT
      ) {
        return Object.freeze(
          output
        );
      }
    }
  }

  return Object.freeze(
    output
  );
}

function directUrlFromPattern(
  message,
  baseUrl
) {
  if (
    !isNonEmptyString(message)
  ) {
    return null;
  }

  const patterns = [
    {
      evidenceType:
        'DIRECT_DYNAMIC_IMPORT_REJECTION',

      regex:
        /(?:failed to fetch dynamically imported module|error loading dynamically imported module|importing a module script failed)\s*:?\s*(https?:\/\/[^\s'"<>]+)/i
    },

    {
      evidenceType:
        'DIRECT_MODULE_NOT_FOUND_REJECTION',

      regex:
        /cannot find module\s+['"]([^'"]+)['"]\s+imported from/i
    },

    {
      evidenceType:
        'DIRECT_MODULE_SPECIFIER_RESOLUTION_REJECTION',

      regex:
        /(?:failed to resolve module specifier|unable to resolve module specifier|cannot resolve module)\s+['"]([^'"]+)['"]/i
    },

    {
      evidenceType:
        'DIRECT_MODULE_RESOURCE_LOAD_REJECTION',

      regex:
        /(?:module resource|module script|script module)\s+(?:at\s+)?['"]?(https?:\/\/[^\s'"<>]+\.m?js(?:\?[^\s'"<>]*)?)/i
    }
  ];

  for (
    const pattern
    of patterns
  ) {
    const match =
      message.match(
        pattern.regex
      );

    if (!match) {
      continue;
    }

    const exactUrl =
      resolveUrl(
        match[1],
        baseUrl
      );

    if (exactUrl) {
      return deepFreeze({
        exactFailedTransitiveUrlObserved:
          true,

        exactFailedTransitiveUrl:
          exactUrl,

        exactFailedTransitiveUrlEvidenceType:
          pattern.evidenceType
      });
    }
  }

  return null;
}

export function classifyHEarthFd05TransitiveEvidence({
  errorEvidence,
  rootUrl,
  finalResponseUrl,
  moduleUrl
}) {
  const directMessageEvidence =
    directUrlFromPattern(
      errorEvidence?.errorMessage,
      rootUrl
    );

  if (directMessageEvidence) {
    const candidateTransitiveUrls =
      uniqueCandidateUrls(
        errorEvidence,
        rootUrl,
        finalResponseUrl,
        moduleUrl
      )
        .filter(
          (candidate) =>
            !equivalentUrl(
              candidate,
              directMessageEvidence
                .exactFailedTransitiveUrl
            )
        );

    return deepFreeze({
      candidateTransitiveUrls:
        Object.freeze(
          candidateTransitiveUrls
        ),

      ...directMessageEvidence
    });
  }

  const errorName =
    String(
      errorEvidence?.errorName ||
      ''
    );

  const directFileName =
    resolveUrl(
      errorEvidence?.errorFileName,
      rootUrl
    );

  if (
    directFileName &&
    /syntaxerror/i.test(
      errorName
    ) &&
    !equivalentUrl(
      directFileName,
      rootUrl
    ) &&
    !equivalentUrl(
      directFileName,
      finalResponseUrl
    ) &&
    /\.m?js(?:$|\?)/i.test(
      directFileName
    )
  ) {
    const candidateTransitiveUrls =
      uniqueCandidateUrls(
        errorEvidence,
        rootUrl,
        finalResponseUrl,
        moduleUrl
      )
        .filter(
          (candidate) =>
            !equivalentUrl(
              candidate,
              directFileName
            )
        );

    return deepFreeze({
      candidateTransitiveUrls:
        Object.freeze(
          candidateTransitiveUrls
        ),

      exactFailedTransitiveUrlObserved:
        true,

      exactFailedTransitiveUrl:
        directFileName,

      exactFailedTransitiveUrlEvidenceType:
        'DIRECT_PARSER_ERROR_FILENAME'
    });
  }

  return deepFreeze({
    candidateTransitiveUrls:
      uniqueCandidateUrls(
        errorEvidence,
        rootUrl,
        finalResponseUrl,
        moduleUrl
      ),

    exactFailedTransitiveUrlObserved:
      false,

    exactFailedTransitiveUrl:
      null,

    exactFailedTransitiveUrlEvidenceType:
      null
  });
}

async function probeResponse(
  branch,
  resolvedUrl,
  dependencies
) {
  const probeStartedAt =
    dependencies.now();

  const fetchImpl =
    dependencies.fetchImpl;

  if (
    typeof fetchImpl !==
    'function'
  ) {
    const evidence =
      captureError(
        new Error(
          'The Fetch API is unavailable in this occurrence.'
        ),
        'DIRECT_FETCH_ERROR'
      );

    return deepFreeze({
      probeStartedAt,

      probeCompletedAt:
        dependencies.now(),

      requestedPath:
        branch.requestedPath,

      resolvedUrl,

      finalResponseUrl:
        null,

      httpStatus:
        null,

      httpStatusText:
        null,

      responseOk:
        false,

      contentType:
        null,

      redirected:
        false,

      responsePrefix:
        '',

      responsePrefixLength:
        0,

      bodyReadSucceeded:
        false,

      fetchAvailable:
        false,

      fetchSucceeded:
        false,

      transportDisposition:
        H_EARTH_FD_05_TRANSPORT_DISPOSITION
          .FETCH_UNAVAILABLE,

      payloadClassification:
        H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
          .FETCH_UNAVAILABLE,

      responseClassification:
        H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
          .FETCH_UNAVAILABLE,

      fetchError:
        evidence,

      responseReadError:
        null
    });
  }

  try {
    const response =
      await fetchImpl(
        resolvedUrl,
        {
          method:
            'GET',

          cache:
            'no-store',

          credentials:
            'same-origin',

          redirect:
            'follow',

          headers: {
            Accept:
              'text/javascript, application/javascript, application/ecmascript, text/ecmascript, application/json, text/plain, */*;q=0.1'
          }
        }
      );

    let responsePrefix =
      '';

    let bodyReadSucceeded =
      true;

    let responseReadError =
      null;

    try {
      responsePrefix =
        normalizedPrefix(
          await response.text()
        );
    } catch (error) {
      bodyReadSucceeded =
        false;

      responseReadError =
        captureError(
          error,
          'RESPONSE_BODY_READ_ERROR'
        );
    }

    const finalResponseUrl =
      response.url ||
      resolvedUrl;

    const contentType =
      response.headers
        ?.get?.(
          'content-type'
        ) ??
      null;

    const redirected =
      response.redirected ===
        true ||
      !equivalentUrl(
        finalResponseUrl,
        resolvedUrl
      );

    const base = {
      fetchAvailable:
        true,

      fetchSucceeded:
        true,

      responseOk:
        response.ok,

      httpStatus:
        response.status,

      redirected,

      finalResponseUrl,

      resolvedUrl,

      bodyReadSucceeded,

      responsePrefix,

      contentType
    };

    const transportDisposition =
      classifyHEarthFd05Transport(
        base
      );

    const payloadClassification =
      classifyHEarthFd05Payload(
        base
      );

    return deepFreeze({
      probeStartedAt,

      probeCompletedAt:
        dependencies.now(),

      requestedPath:
        branch.requestedPath,

      resolvedUrl,

      finalResponseUrl,

      httpStatus:
        response.status,

      httpStatusText:
        response.statusText ||
        '',

      responseOk:
        response.ok,

      contentType,

      redirected,

      responsePrefix,

      responsePrefixLength:
        responsePrefix.length,

      bodyReadSucceeded,

      fetchAvailable:
        true,

      fetchSucceeded:
        true,

      transportDisposition,

      payloadClassification,

      responseClassification:
        payloadClassification,

      fetchError:
        null,

      responseReadError
    });
  } catch (error) {
    const fetchError =
      captureError(
        error,
        'DIRECT_FETCH_ERROR'
      );

    return deepFreeze({
      probeStartedAt,

      probeCompletedAt:
        dependencies.now(),

      requestedPath:
        branch.requestedPath,

      resolvedUrl,

      finalResponseUrl:
        null,

      httpStatus:
        null,

      httpStatusText:
        null,

      responseOk:
        false,

      contentType:
        null,

      redirected:
        false,

      responsePrefix:
        '',

      responsePrefixLength:
        0,

      bodyReadSucceeded:
        false,

      fetchAvailable:
        true,

      fetchSucceeded:
        false,

      transportDisposition:
        H_EARTH_FD_05_TRANSPORT_DISPOSITION
          .FETCH_FAILED,

      payloadClassification:
        H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
          .FETCH_FAILED,

      responseClassification:
        H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
          .FETCH_FAILED,

      fetchError,

      responseReadError:
        null
    });
  }
}

async function probeImport(
  branch,
  resolvedUrl,
  responseProbe,
  dependencies
) {
  const importStartedAt =
    dependencies.now();

  try {
    const moduleNamespace =
      await dependencies.importImpl(
        resolvedUrl
      );

    const actualContractId =
      moduleNamespace?.[
        branch.expectedContractExport
      ] ??
      null;

    const contractExportPresent =
      actualContractId !==
      null;

    const contractIdMatched =
      actualContractId ===
      branch.expectedContractId;

    return deepFreeze({
      importStartedAt,

      importCompletedAt:
        dependencies.now(),

      importAttempted:
        true,

      importSucceeded:
        true,

      expectedContractExport:
        branch.expectedContractExport,

      expectedContractId:
        branch.expectedContractId,

      actualContractId,

      contractExportPresent,

      contractIdMatched,

      branchClassification:
        contractIdMatched
          ? 'BRANCH_SUCCESS'
          : 'FD_06_CONTRACT_MISMATCH',

      exportedSymbolNames:
        Object.freeze(
          Object.keys(
            moduleNamespace ||
            {}
          ).sort()
        ),

      importError:
        null,

      candidateTransitiveUrls:
        Object.freeze([]),

      exactFailedTransitiveUrlObserved:
        false,

      exactFailedTransitiveUrl:
        null,

      exactFailedTransitiveUrlEvidenceType:
        null
    });
  } catch (error) {
    const importError =
      captureError(
        error,
        'DIRECT_IMPORT_ERROR'
      );

    const transitiveEvidence =
      classifyHEarthFd05TransitiveEvidence({
        errorEvidence:
          importError,

        rootUrl:
          resolvedUrl,

        finalResponseUrl:
          responseProbe
            ?.finalResponseUrl ??
          null,

        moduleUrl:
          dependencies.moduleUrl
      });

    return deepFreeze({
      importStartedAt,

      importCompletedAt:
        dependencies.now(),

      importAttempted:
        true,

      importSucceeded:
        false,

      expectedContractExport:
        branch.expectedContractExport,

      expectedContractId:
        branch.expectedContractId,

      actualContractId:
        null,

      contractExportPresent:
        false,

      contractIdMatched:
        false,

      branchClassification:
        H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

      exportedSymbolNames:
        Object.freeze([]),

      importError,

      ...transitiveEvidence
    });
  }
}

async function inspectBranch(
  branch,
  dependencies
) {
  const branchStartedAt =
    dependencies.now();

  const resolvedUrl =
    resolveUrl(
      branch.requestedPath,
      dependencies.moduleUrl
    );

  if (!resolvedUrl) {
    const resolutionError =
      captureError(
        new Error(
          `Unable to resolve configured module path: ${branch.requestedPath}`
        ),
        'URL_RESOLUTION_ERROR'
      );

    return deepFreeze({
      ...branch,

      branchStartedAt,

      branchCompletedAt:
        dependencies.now(),

      resolvedUrl:
        null,

      responseProbe:
        null,

      importProbe:
        deepFreeze({
          importAttempted:
            false,

          importSucceeded:
            false,

          contractIdMatched:
            false,

          branchClassification:
            H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

          importError:
            null,

          resolutionError,

          candidateTransitiveUrls:
            Object.freeze([]),

          exactFailedTransitiveUrlObserved:
            false,

          exactFailedTransitiveUrl:
            null,

          exactFailedTransitiveUrlEvidenceType:
            null
        }),

      exactTransitiveResponseProbe:
        null
    });
  }

  const responseProbe =
    await probeResponse(
      branch,
      resolvedUrl,
      dependencies
    );

  const importProbe =
    await probeImport(
      branch,
      resolvedUrl,
      responseProbe,
      dependencies
    );

  let exactTransitiveResponseProbe =
    null;

  if (
    importProbe
      .exactFailedTransitiveUrlObserved
  ) {
    exactTransitiveResponseProbe =
      await probeResponse(
        {
          ...branch,

          requestedPath:
            importProbe
              .exactFailedTransitiveUrl
        },

        importProbe
          .exactFailedTransitiveUrl,

        dependencies
      );
  }

  return deepFreeze({
    ...branch,

    branchStartedAt,

    branchCompletedAt:
      dependencies.now(),

    resolvedUrl,

    responseProbe,

    importProbe,

    exactTransitiveResponseProbe
  });
}

function selectStrongestErrorEvidence({
  fatalError,
  branchResults
}) {
  if (fatalError) {
    return captureError(
      fatalError,
      'FATAL_INSTRUMENT_ERROR'
    );
  }

  for (
    const branch
    of branchResults
  ) {
    if (
      branch.importProbe
        ?.importError
    ) {
      return branch
        .importProbe
        .importError;
    }
  }

  for (
    const branch
    of branchResults
  ) {
    if (
      branch.responseProbe
        ?.fetchError
    ) {
      return branch
        .responseProbe
        .fetchError;
    }
  }

  for (
    const branch
    of branchResults
  ) {
    if (
      branch.responseProbe
        ?.responseReadError
    ) {
      return branch
        .responseProbe
        .responseReadError;
    }
  }

  for (
    const branch
    of branchResults
  ) {
    if (
      branch.importProbe
        ?.resolutionError
    ) {
      return branch
        .importProbe
        .resolutionError;
    }
  }

  return noErrorEvidence();
}

function collectBranchSets(
  branchResults
) {
  const importFailedBranches =
    [];

  const contractMismatchBranches =
    [];

  const successfulBranches =
    [];

  for (
    const branch
    of branchResults
  ) {
    if (
      branch.importProbe
        ?.importSucceeded ===
      false
    ) {
      importFailedBranches.push(
        branch.branchId
      );
    } else if (
      branch.importProbe
        ?.contractIdMatched ===
      false
    ) {
      contractMismatchBranches.push(
        branch.branchId
      );
    } else if (
      branch.importProbe
        ?.importSucceeded ===
        true &&
      branch.importProbe
        ?.contractIdMatched ===
        true
    ) {
      successfulBranches.push(
        branch.branchId
      );
    }
  }

  return deepFreeze({
    importFailedBranches:
      Object.freeze(
        importFailedBranches
      ),

    contractMismatchBranches:
      Object.freeze(
        contractMismatchBranches
      ),

    successfulBranches:
      Object.freeze(
        successfulBranches
      ),

    failedBranches:
      Object.freeze([
        ...importFailedBranches
      ]),

    nextFailureDomain:
      importFailedBranches.length > 0
        ? H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN
        : contractMismatchBranches.length > 0
          ? H_EARTH_FD_06_NEXT_FAILURE_DOMAIN
          : null
  });
}

function findBranchById(
  branchResults,
  branchId
) {
  if (!branchId) {
    return null;
  }

  return (
    branchResults.find(
      (branch) =>
        branch.branchId ===
        branchId
    ) ??
    null
  );
}

function choosePrimaryBranch(
  branchResults,
  branchSets
) {
  const preferredIds = [
    ...branchSets
      .importFailedBranches,

    ...branchSets
      .contractMismatchBranches,

    ...branchSets
      .successfulBranches
  ];

  for (
    const branchId
    of preferredIds
  ) {
    const branch =
      findBranchById(
        branchResults,
        branchId
      );

    if (
      branch
        ?.importProbe
        ?.exactFailedTransitiveUrlObserved
    ) {
      return branch;
    }
  }

  for (
    const branchId
    of preferredIds
  ) {
    const branch =
      findBranchById(
        branchResults,
        branchId
      );

    if (
      branch?.responseProbe &&
      (
        branch
          .responseProbe
          .transportDisposition !==
          H_EARTH_FD_05_TRANSPORT_DISPOSITION
            .DIRECT_RESPONSE ||
        branch
          .responseProbe
          .payloadClassification !==
          H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
            .JAVASCRIPT_LIKE_RESPONSE
      )
    ) {
      return branch;
    }
  }

  return (
    findBranchById(
      branchResults,
      preferredIds[0]
    ) ??
    branchResults[0] ??
    null
  );
}

function chooseFailedBranch(
  branchResults,
  branchSets
) {
  return findBranchById(
    branchResults,
    branchSets
      .importFailedBranches[0]
  );
}

function findExactTransitiveBranch(
  branchResults
) {
  return (
    branchResults.find(
      (candidate) =>
        candidate
          .importProbe
          ?.exactFailedTransitiveUrlObserved ===
        true
    ) ??
    null
  );
}

function branchIdentificationStatus({
  fatalError,
  branchSets
}) {
  if (fatalError) {
    return 'INSTRUMENT_EXECUTION_FAILED';
  }

  if (
    branchSets
      .importFailedBranches
      .length === 0
  ) {
    return branchSets
      .contractMismatchBranches
      .length > 0
      ? 'NO_FD_05_IMPORT_FAILURE_CONTRACT_MISMATCH_ROUTED_TO_FD_06'
      : 'NO_ROOT_BRANCH_IMPORT_FAILURE_REPRODUCED';
  }

  return branchSets
    .importFailedBranches
    .length === 1
    ? 'ONE_FAILED_IMPORT_ROOT_BRANCH_IDENTIFIED'
    : 'MULTIPLE_FAILED_IMPORT_ROOT_BRANCHES_IDENTIFIED';
}

function collectCandidateUrls(
  branchResults
) {
  const output =
    [];

  const seen =
    new Set();

  for (
    const branch
    of branchResults
  ) {
    for (
      const url
      of branch.importProbe
        ?.candidateTransitiveUrls ??
      []
    ) {
      if (
        !seen.has(url)
      ) {
        seen.add(url);
        output.push(url);
      }
    }
  }

  return Object.freeze(
    output.slice(
      0,
      URL_LIMIT
    )
  );
}

function chooseExactTransitiveEvidence(
  branchResults
) {
  const branch =
    findExactTransitiveBranch(
      branchResults
    );

  return deepFreeze({
    exactFailedTransitiveUrlObserved:
      Boolean(branch),

    exactFailedTransitiveBranchId:
      branch?.branchId ??
      null,

    exactFailedTransitiveUrl:
      branch
        ?.importProbe
        ?.exactFailedTransitiveUrl ??
      null,

    exactFailedTransitiveUrlEvidenceType:
      branch
        ?.importProbe
        ?.exactFailedTransitiveUrlEvidenceType ??
      null
  });
}

function chooseControllingResponseEvidence({
  primaryBranch,
  exactTransitiveBranch
}) {
  if (
    exactTransitiveBranch
      ?.importProbe
      ?.exactFailedTransitiveUrlObserved ===
      true &&
    exactTransitiveBranch
      ?.exactTransitiveResponseProbe
  ) {
    return deepFreeze({
      responseEvidenceScope:
        H_EARTH_FD_05_RESPONSE_EVIDENCE_SCOPE
          .EXACT_FAILED_TRANSITIVE_RESPONSE,

      responseEvidenceBranchId:
        exactTransitiveBranch.branchId,

      responseProbe:
        exactTransitiveBranch
          .exactTransitiveResponseProbe
    });
  }

  if (
    primaryBranch
      ?.responseProbe
  ) {
    return deepFreeze({
      responseEvidenceScope:
        H_EARTH_FD_05_RESPONSE_EVIDENCE_SCOPE
          .ROOT_BRANCH_RESPONSE,

      responseEvidenceBranchId:
        primaryBranch.branchId,

      responseProbe:
        primaryBranch
          .responseProbe
    });
  }

  return deepFreeze({
    responseEvidenceScope:
      H_EARTH_FD_05_RESPONSE_EVIDENCE_SCOPE
        .NO_RESPONSE_EVIDENCE,

    responseEvidenceBranchId:
      null,

    responseProbe:
      null
  });
}

function deriveDiagnosticIntegrationStatus({
  executionStatus,
  publicationState
}) {
  if (
    executionStatus ===
    'RUNNING'
  ) {
    return 'FD_05_CURRENT_OCCURRENCE_RUNNING';
  }

  if (
    executionStatus ===
    'FAILED'
  ) {
    return 'FD_05_CURRENT_OCCURRENCE_FAILED';
  }

  if (
    publicationState
      .receiptPublishedToGlobal ===
      true &&
    publicationState
      .receiptRenderedOnPage ===
      true &&
    publicationState
      .receiptEventDispatched ===
      true
  ) {
    return 'FD_05_CURRENT_OCCURRENCE_COMPLETE_AND_PUBLISHED';
  }

  if (
    publicationState
      .receiptPublishedToGlobal ===
    true
  ) {
    return 'FD_05_CURRENT_OCCURRENCE_COMPLETE_PUBLICATION_PARTIAL';
  }

  return 'FD_05_CURRENT_OCCURRENCE_COMPLETE_NOT_PUBLISHED';
}

function buildNextOperation({
  fatalError,
  branchSets,
  primaryBranch,
  exactEvidence
}) {
  if (fatalError) {
    return deepFreeze({
      operationId:
        'INSPECT_FD_05_DIAGNOSTIC_OVERLAY_OCCURRENCE',

      targetOccurrence:
        H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

      instruction:
        'Inspect the FD_05 diagnostic-overlay occurrence and its fatal instrument evidence. Do not reopen compositor, renderer, geometry, runtime, route, or engine source.'
    });
  }

  if (
    branchSets
      .importFailedBranches
      .length > 0
  ) {
    if (
      exactEvidence
        .exactFailedTransitiveUrlObserved
    ) {
      return deepFreeze({
        operationId:
          'INSPECT_EXACT_FAILED_TRANSITIVE_DEPLOYED_OCCURRENCE',

        targetOccurrence:
          exactEvidence
            .exactFailedTransitiveUrl,

        instruction:
          'Inspect the exact failed transitive deployed occurrence and match it to its controlling source authority before authorizing source correction.'
      });
    }

    const responseProbe =
      primaryBranch
        ?.responseProbe;

    const abnormalPayload =
      responseProbe
        ?.payloadClassification !==
      H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
        .JAVASCRIPT_LIKE_RESPONSE;

    if (abnormalPayload) {
      return deepFreeze({
        operationId:
          'INSPECT_FAILED_ROOT_DEPLOYED_RESPONSE',

        targetOccurrence:
          responseProbe
            ?.finalResponseUrl ??
          primaryBranch
            ?.resolvedUrl ??
          null,

        instruction:
          'Inspect the failed root deployed response, route mapping, redirect, and returned payload. Source correction remains withheld.'
      });
    }

    return deepFreeze({
      operationId:
        'INSPECT_ROOT_IMPORT_REJECTION_EVIDENCE',

      targetOccurrence:
        primaryBranch
          ?.resolvedUrl ??
        null,

      instruction:
        'Inspect the failed root import rejection for parser, linker, resource-load, or directly identified transitive evidence. Do not treat stack-only candidate URLs as correction targets.'
    });
  }

  const primaryResponse =
    primaryBranch
      ?.responseProbe ??
    null;

  const primaryResponseAbnormal =
    primaryResponse &&
    (
      primaryResponse
        .transportDisposition !==
        H_EARTH_FD_05_TRANSPORT_DISPOSITION
          .DIRECT_RESPONSE ||
      primaryResponse
        .payloadClassification !==
        H_EARTH_FD_05_PAYLOAD_CLASSIFICATION
          .JAVASCRIPT_LIKE_RESPONSE
    );

  if (
    branchSets
      .importFailedBranches
      .length === 0 &&
    branchSets
      .contractMismatchBranches
      .length === 0 &&
    primaryResponseAbnormal
  ) {
    return deepFreeze({
      operationId:
        'INSPECT_FD_05_DEPLOYED_RESPONSE_PROBE_EVIDENCE',

      targetOccurrence:
        primaryResponse
          .finalResponseUrl ??
        primaryBranch
          ?.resolvedUrl ??
        null,

      instruction:
        'Inspect the deployed root response evidence because the module import succeeded while the bounded response probe remained abnormal or unavailable. Source correction remains withheld.'
    });
  }

  if (
    branchSets
      .contractMismatchBranches
      .length > 0
  ) {
    return deepFreeze({
      operationId:
        'ROUTE_TO_FD_06_API_AND_CONTRACT_CORRESPONDENCE',

      targetOccurrence:
        primaryBranch
          ?.resolvedUrl ??
        null,

      instruction:
        'Close FD_05 for the successfully imported branch and route the contract mismatch to FD_06_API_AND_CONTRACT_CORRESPONDENCE.'
    });
  }

  return deepFreeze({
    operationId:
      'PRESERVE_RECEIPT_AND_CLOSE_FD_05_FOR_CURRENT_OCCURRENCE',

    targetOccurrence:
      null,

    instruction:
      'Preserve the receipt as evidence that both root imports and contract identities succeeded for this occurrence.'
  });
}

function buildEvidenceStillMissing({
  fatalError,
  branchSets,
  exactEvidence
}) {
  const missing = [];

  if (fatalError) {
    missing.push(
      'ROOT_BRANCH_PROBES_NOT_COMPLETED_DUE_TO_INSTRUMENT_FAILURE'
    );
  }

  if (
    branchSets
      .importFailedBranches
      .length > 1
  ) {
    missing.push(
      'SINGLE_FAILED_IMPORT_ROOT_BRANCH_NOT_ISOLATED'
    );
  }

  if (
    branchSets
      .importFailedBranches
      .length > 0 &&
    exactEvidence
      .exactFailedTransitiveUrlObserved ===
    false
  ) {
    missing.push(
      'EXACT_FAILED_TRANSITIVE_URL_NOT_DIRECTLY_OBSERVED'
    );
  }

  if (
    exactEvidence
      .exactFailedTransitiveUrlObserved ===
    true
  ) {
    missing.push(
      'EXACT_FAILED_TRANSITIVE_IMPORTING_SOURCE_NOT_DIRECTLY_OBSERVED'
    );

    missing.push(
      'EXACT_FAILED_TRANSITIVE_IMPORT_SPECIFIER_NOT_DIRECTLY_OBSERVED'
    );
  }

  return Object.freeze(
    missing
  );
}

function buildOperatorProjection({
  runId,
  runStartedAt,
  runCompletedAt,
  executionStatus,
  moduleUrl,
  publicationState,
  branchSets,
  primaryBranch,
  failedBranch,
  exactTransitiveBranch,
  exactEvidence,
  controllingResponseEvidence,
  strongestError,
  evidenceStillMissing,
  nextAuthorizedOperation
}) {
  const controllingResponse =
    controllingResponseEvidence
      .responseProbe;

  const primaryReceiptPresenceStatus =
    publicationState
      .receiptPublishedToGlobal
      ? 'PUBLISHED'
      : 'NOT_PUBLISHED';

  return deepFreeze({
    currentOccurrenceId:
      runId,

    currentOccurrenceStartedAt:
      runStartedAt,

    currentOccurrenceCompletedAt:
      runCompletedAt,

    diagnosticIntegrationStatus:
      deriveDiagnosticIntegrationStatus({
        executionStatus,
        publicationState
      }),

    decisionFinalized:
      executionStatus !==
      'RUNNING',

    activeFailureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReport:
      H_EARTH_FD_05_PRIMARY_REPORT,

    supportingReports:
      H_EARTH_FD_05_SUPPORTING_REPORTS,

    fullEvidenceArchive:
      H_EARTH_FD_05_FULL_EVIDENCE_ARCHIVE,

    primaryReceiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    primaryReceiptPresenceStatus,

    primaryReceiptExecutionStatus:
      executionStatus,

    failedBranchId:
      failedBranch
        ?.branchId ??
      null,

    failedBranchLabel:
      failedBranch
        ?.label ??
      null,

    rootImportingSourceUrl:
      moduleUrl,

    rootImportSpecifier:
      primaryBranch
        ?.requestedPath ??
      null,

    rootRequestedUrl:
      primaryBranch
        ?.resolvedUrl ??
      null,

    rootResolvedDependencyUrl:
      primaryBranch
        ?.resolvedUrl ??
      null,

    failedBranchImportingSourceUrl:
      failedBranch
        ? moduleUrl
        : null,

    failedImportSpecifier:
      failedBranch
        ?.requestedPath ??
      null,

    failedResolvedDependencyUrl:
      failedBranch
        ?.resolvedUrl ??
      null,

    exactFailedTransitiveUrlObserved:
      exactEvidence
        .exactFailedTransitiveUrlObserved,

    exactFailedTransitiveBranchId:
      exactEvidence
        .exactFailedTransitiveBranchId,

    exactFailedTransitiveImportingSourceUrl:
      null,

    exactFailedTransitiveImportSpecifier:
      null,

    exactFailedTransitiveUrl:
      exactEvidence
        .exactFailedTransitiveUrl,

    exactFailedTransitiveUrlEvidenceType:
      exactEvidence
        .exactFailedTransitiveUrlEvidenceType,

    responseEvidenceScope:
      controllingResponseEvidence
        .responseEvidenceScope,

    responseEvidenceBranchId:
      controllingResponseEvidence
        .responseEvidenceBranchId,

    controllingFinalReturnedUrl:
      controllingResponse
        ?.finalResponseUrl ??
      null,

    controllingHttpStatus:
      controllingResponse
        ?.httpStatus ??
      null,

    controllingContentType:
      controllingResponse
        ?.contentType ??
      null,

    controllingTransportDisposition:
      controllingResponse
        ?.transportDisposition ??
      null,

    controllingResponseClassification:
      controllingResponse
        ?.responseClassification ??
      controllingResponse
        ?.payloadClassification ??
      null,

    controllingResponsePrefix:
      controllingResponse
        ?.responsePrefix ??
      null,

    directImportErrorEvidenceType:
      strongestError
        .errorEvidenceType,

    directImportErrorName:
      strongestError
        .errorName,

    directImportErrorMessage:
      strongestError
        .errorMessage,

    directImportErrorFileName:
      strongestError
        .errorFileName,

    directImportErrorLineNumber:
      strongestError
        .errorLineNumber,

    directImportErrorColumnNumber:
      strongestError
        .errorColumnNumber,

    directParserLinkerOrResourceLoadError:
      strongestError
        .errorMessage,

    importFailedBranches:
      branchSets
        .importFailedBranches,

    contractMismatchBranches:
      branchSets
        .contractMismatchBranches,

    successfulBranches:
      branchSets
        .successfulBranches,

    evidenceStillMissing,

    sourceCorrectionAuthorized:
      false,

    sourceCorrectionStatus:
      exactEvidence
        .exactFailedTransitiveUrlObserved
        ? 'WITHHELD_PENDING_CONTROLLING_SOURCE_CORRESPONDENCE'
        : 'WITHHELD_PENDING_DIRECT_FAILURE_TARGET_IDENTIFICATION',

    constitutionalSourceReopenAuthorized:
      false,

    oneExactNextOperationId:
      nextAuthorizedOperation
        .operationId,

    oneExactNextOperationTarget:
      nextAuthorizedOperation
        .targetOccurrence,

    oneExactNextOperationInstruction:
      nextAuthorizedOperation
        .instruction
  });
}

function buildBaseReceipt({
  runId,
  runStartedAt,
  runCompletedAt,
  executionStatus,
  branchResults,
  fatalError,
  publicationState,
  moduleUrl
}) {
  const branchSets =
    collectBranchSets(
      branchResults
    );

  const primaryBranch =
    choosePrimaryBranch(
      branchResults,
      branchSets
    );

  const failedBranch =
    chooseFailedBranch(
      branchResults,
      branchSets
    );

  const exactTransitiveBranch =
    findExactTransitiveBranch(
      branchResults
    );

  const exactEvidence =
    chooseExactTransitiveEvidence(
      branchResults
    );

  const candidateTransitiveUrls =
    collectCandidateUrls(
      branchResults
    );

  const selectedError =
    selectStrongestErrorEvidence({
      fatalError,
      branchResults
    });

  const strongestError =
    selectedError
      .errorEvidenceType !==
    null
      ? selectedError
      : publicationState
          .publicationErrorName ||
        publicationState
          .publicationErrorMessage ||
        publicationState
          .publicationErrorStack
        ? deepFreeze({
            errorEvidenceType:
              'INSTRUMENT_PUBLICATION_OR_RENDER_ERROR',

            errorName:
              publicationState
                .publicationErrorName,

            errorMessage:
              publicationState
                .publicationErrorMessage,

            errorStack:
              publicationState
                .publicationErrorStack,

            errorFileName:
              null,

            errorLineNumber:
              null,

            errorColumnNumber:
              null,

            errorCause:
              null
          })
        : selectedError;

  const primaryResponse =
    primaryBranch
      ?.responseProbe ??
    null;

  const primaryImport =
    primaryBranch
      ?.importProbe ??
    null;

  const controllingResponseEvidence =
    chooseControllingResponseEvidence({
      primaryBranch,
      exactTransitiveBranch
    });

  const controllingResponse =
    controllingResponseEvidence
      .responseProbe;

  const evidenceStillMissing =
    buildEvidenceStillMissing({
      fatalError,
      branchSets,
      exactEvidence
    });

  const nextAuthorizedOperation =
    buildNextOperation({
      fatalError,
      branchSets,
      primaryBranch,
      exactEvidence
    });

  const operatorProjection =
    buildOperatorProjection({
      runId,
      runStartedAt,
      runCompletedAt,
      executionStatus,
      moduleUrl,
      publicationState,
      branchSets,
      primaryBranch,
      failedBranch,
      exactTransitiveBranch,
      exactEvidence,
      controllingResponseEvidence,
      strongestError,
      evidenceStillMissing,
      nextAuthorizedOperation
    });

  return deepFreeze({
    receiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    receiptSchemaVersion:
      3,

    contractId:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID,

    reportSystemDirectiveId:
      H_EARTH_FD_05_REPORT_SYSTEM_DIRECTIVE_ID,

    sourceFile:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

    activeFailureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReport:
      H_EARTH_FD_05_PRIMARY_REPORT,

    supportingReports:
      H_EARTH_FD_05_SUPPORTING_REPORTS,

    fullEvidenceArchive:
      H_EARTH_FD_05_FULL_EVIDENCE_ARCHIVE,

    reportsClosedForCurrentOccurrence:
      'ALL_NONPRIMARY_AND_NONSUPPORTING_REPORTS',

    historicalReportCorpusPreserved:
      true,

    manualReportCyclingRequired:
      false,

    currentOccurrenceId:
      runId,

    runId,

    runStartedAt,

    runCompletedAt,

    executionStatus,

    primaryReceiptExecutionStatus:
      executionStatus,

    decisionFinalized:
      executionStatus !==
      'RUNNING',

    diagnosticIntegrationStatus:
      operatorProjection
        .diagnosticIntegrationStatus,

    branchIdentificationStatus:
      branchIdentificationStatus({
        fatalError,
        branchSets
      }),

    importFailedBranches:
      branchSets
        .importFailedBranches,

    contractMismatchBranches:
      branchSets
        .contractMismatchBranches,

    successfulBranches:
      branchSets
        .successfulBranches,

    failedBranches:
      branchSets
        .failedBranches,

    nextFailureDomain:
      branchSets
        .nextFailureDomain,

    importingSourceUrl:
      moduleUrl,

    importSpecifier:
      primaryBranch
        ?.requestedPath ??
      null,

    requestedUrl:
      primaryBranch
        ?.resolvedUrl ??
      null,

    failedBranchId:
      failedBranch
        ?.branchId ??
      null,

    failedRequestedPath:
      failedBranch
        ?.requestedPath ??
      primaryBranch
        ?.requestedPath ??
      null,

    resolvedUrl:
      primaryBranch
        ?.resolvedUrl ??
      null,

    rootResponseEvidence:
      primaryResponse,

    exactTransitiveResponseEvidence:
      exactTransitiveBranch
        ?.exactTransitiveResponseProbe ??
      null,

    responseEvidenceScope:
      controllingResponseEvidence
        .responseEvidenceScope,

    responseEvidenceBranchId:
      controllingResponseEvidence
        .responseEvidenceBranchId,

    finalResponseUrl:
      controllingResponse
        ?.finalResponseUrl ??
      null,

    httpStatus:
      controllingResponse
        ?.httpStatus ??
      null,

    contentType:
      controllingResponse
        ?.contentType ??
      null,

    redirected:
      controllingResponse
        ?.redirected ??
      null,

    transportDisposition:
      controllingResponse
        ?.transportDisposition ??
      null,

    payloadClassification:
      controllingResponse
        ?.payloadClassification ??
      null,

    responseClassification:
      controllingResponse
        ?.responseClassification ??
      controllingResponse
        ?.payloadClassification ??
      null,

    responsePrefix:
      controllingResponse
        ?.responsePrefix ??
      null,

    candidateTransitiveUrls,

    ...exactEvidence,

    ...strongestError,

    branchResults:
      Object.freeze([
        ...branchResults
      ]),

    evidenceStillMissing,

    nextAuthorizedOperation,

    nextAuthorizedOperationId:
      nextAuthorizedOperation
        .operationId,

    nextAuthorizedOperationTarget:
      nextAuthorizedOperation
        .targetOccurrence,

    nextAuthorizedOperationInstruction:
      nextAuthorizedOperation
        .instruction,

    sourceCorrectionAuthorized:
      false,

    sourceCorrectionStatus:
      exactEvidence
        .exactFailedTransitiveUrlObserved
        ? 'WITHHELD_PENDING_CONTROLLING_SOURCE_CORRESPONDENCE'
        : 'WITHHELD_PENDING_DIRECT_FAILURE_TARGET_IDENTIFICATION',

    constitutionalSourceReopenAuthorized:
      false,

    constitutionalSourceModificationPerformed:
      false,

    receiptPublishedToGlobal:
      publicationState
        .receiptPublishedToGlobal,

    receiptEventDispatched:
      publicationState
        .receiptEventDispatched,

    receiptRenderedOnPage:
      publicationState
        .receiptRenderedOnPage,

    primaryReceiptVisible:
      publicationState
        .receiptRenderedOnPage,

    primaryReceiptPresenceStatus:
      publicationState
        .receiptPublishedToGlobal
        ? 'PUBLISHED'
        : 'NOT_PUBLISHED',

    publicationErrorName:
      publicationState
        .publicationErrorName,

    publicationErrorMessage:
      publicationState
        .publicationErrorMessage,

    publicationErrorStack:
      publicationState
        .publicationErrorStack,

    fatalInstrumentError:
      fatalError === null
        ? null
        : captureError(
            fatalError,
            'FATAL_INSTRUMENT_ERROR'
          ),

    moduleLoadedAt:
      publicationState
        .moduleLoadedAt,

    instrumentStartedAt:
      publicationState
        .instrumentStartedAt,

    receiptPublishedAt:
      publicationState
        .receiptPublishedAt,

    receiptRenderedAt:
      publicationState
        .receiptRenderedAt,

    primaryImportEvidence:
      primaryImport,

    operatorProjection
  });
}

function ensureStyle(
  documentObject
) {
  if (
    !documentObject ||
    documentObject.getElementById(
      STYLE_ID
    )
  ) {
    return;
  }

  const style =
    documentObject.createElement(
      'style'
    );

  style.id =
    STYLE_ID;

  style.textContent = `
    #${MOUNT_ID}{box-sizing:border-box;margin:1rem auto;max-width:1120px;border:1px solid rgba(255,255,255,.18);border-radius:12px;background:rgba(10,14,20,.94);color:#eef3f8;font:14px/1.5 system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;overflow:hidden}
    #${MOUNT_ID} *{box-sizing:border-box}
    #${MOUNT_ID} header{padding:1rem 1.1rem;border-bottom:1px solid rgba(255,255,255,.14)}
    #${MOUNT_ID} h2{margin:0;font-size:1.05rem;letter-spacing:.02em}
    #${MOUNT_ID} p{margin:.35rem 0 0;color:#b8c4d0}
    #${MOUNT_ID} dl{display:grid;grid-template-columns:minmax(210px,.75fr) minmax(0,1.8fr);margin:0}
    #${MOUNT_ID} dt,#${MOUNT_ID} dd{margin:0;padding:.65rem 1rem;border-bottom:1px solid rgba(255,255,255,.08);overflow-wrap:anywhere;white-space:pre-wrap}
    #${MOUNT_ID} dt{color:#aebdca;font-weight:650}
    #${MOUNT_ID} dd{color:#f4f7fa}
    #${MOUNT_ID} footer{display:flex;justify-content:flex-end;padding:.9rem 1rem}
    #${MOUNT_ID} button{border:1px solid rgba(255,255,255,.25);border-radius:8px;background:#182330;color:#f4f7fa;padding:.55rem .8rem;cursor:pointer}
    #${MOUNT_ID} button:disabled{cursor:progress;opacity:.65}
    @media(max-width:720px){#${MOUNT_ID} dl{grid-template-columns:1fr}#${MOUNT_ID} dt{padding-bottom:.15rem;border-bottom:0}#${MOUNT_ID} dd{padding-top:.15rem}}
  `;

  documentObject.head
    ?.append(style);
}

function ensureMount(
  documentObject
) {
  if (!documentObject) {
    throw new Error(
      'Normal-page document is unavailable.'
    );
  }

  let mount =
    documentObject.getElementById(
      MOUNT_ID
    );

  if (mount) {
    return mount;
  }

  ensureStyle(
    documentObject
  );

  mount =
    documentObject.createElement(
      'section'
    );

  mount.id =
    MOUNT_ID;

  mount.setAttribute(
    'data-h-earth-diagnostic-failure-domain',
    H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN
  );

  mount.setAttribute(
    'data-h-earth-current-occurrence-evidence',
    'true'
  );

  mount.setAttribute(
    'aria-live',
    'polite'
  );

  const host =
    documentObject.querySelector(
      '[data-h-earth-diagnostic-track-host]'
    ) ||
    documentObject.querySelector(
      'main'
    ) ||
    documentObject.body;

  if (!host) {
    throw new Error(
      'No normal-page mount host is available.'
    );
  }

  host.append(mount);

  return mount;
}

function appendRow(
  documentObject,
  list,
  label,
  value
) {
  const term =
    documentObject.createElement(
      'dt'
    );

  const detail =
    documentObject.createElement(
      'dd'
    );

  term.textContent =
    label;

  detail.textContent =
    value === undefined ||
    value === null ||
    value === ''
      ? 'NOT YET DIRECTLY OBSERVED'
      : String(value);

  list.append(
    term,
    detail
  );
}

function renderReceipt(
  receipt,
  documentObject,
  rerun
) {
  const mount =
    ensureMount(
      documentObject
    );

  mount.replaceChildren();

  mount.setAttribute(
    'data-h-earth-current-occurrence-id',
    receipt.currentOccurrenceId
  );

  mount.setAttribute(
    'data-h-earth-primary-receipt-execution-status',
    receipt.primaryReceiptExecutionStatus
  );

  mount.setAttribute(
    'data-h-earth-decision-finalized',
    String(
      receipt.decisionFinalized ===
      true
    )
  );

  const header =
    documentObject.createElement(
      'header'
    );

  const title =
    documentObject.createElement(
      'h2'
    );

  const subtitle =
    documentObject.createElement(
      'p'
    );

  title.textContent =
    'H-Earth FD_05 Module Import Diagnostic Track';

  subtitle.textContent =
    'One active failure domain · one current occurrence · one primary receipt · one exact next operation';

  header.append(
    title,
    subtitle
  );

  const list =
    documentObject.createElement(
      'dl'
    );

  const operator =
    receipt.operatorProjection;

  const rows = [
    [
      'Current occurrence',
      operator.currentOccurrenceId
    ],

    [
      'Active failure domain',
      operator.activeFailureDomain
    ],

    [
      'Diagnostic integration status',
      operator.diagnosticIntegrationStatus
    ],

    [
      'Decision finalized',
      operator.decisionFinalized
    ],

    [
      'Instrument execution status',
      operator.primaryReceiptExecutionStatus
    ],

    [
      'Primary report',
      operator.primaryReport
    ],

    [
      'Supporting reports',
      operator.supportingReports.join(
        ', '
      )
    ],

    [
      'Full evidence archive',
      operator.fullEvidenceArchive
    ],

    [
      'Primary receipt status',
      operator.primaryReceiptPresenceStatus
    ],

    [
      'Failed import root branch',
      operator.failedBranchId ??
      'NONE'
    ],

    [
      'Root importing source URL',
      operator.rootImportingSourceUrl
    ],

    [
      'Root import specifier',
      operator.rootImportSpecifier
    ],

    [
      'Root resolved dependency URL',
      operator.rootResolvedDependencyUrl
    ],

    [
      'Exact failed transitive URL',
      operator.exactFailedTransitiveUrl
    ],

    [
      'Exact transitive evidence type',
      operator
        .exactFailedTransitiveUrlEvidenceType
    ],

    [
      'Exact transitive importing source',
      operator
        .exactFailedTransitiveImportingSourceUrl
    ],

    [
      'Exact transitive import specifier',
      operator
        .exactFailedTransitiveImportSpecifier
    ],

    [
      'Response evidence scope',
      operator.responseEvidenceScope
    ],

    [
      'Final response URL',
      operator.controllingFinalReturnedUrl
    ],

    [
      'HTTP status',
      operator.controllingHttpStatus
    ],

    [
      'Content type',
      operator.controllingContentType
    ],

    [
      'Transport disposition',
      operator
        .controllingTransportDisposition
    ],

    [
      'Response classification',
      operator
        .controllingResponseClassification
    ],

    [
      'Bounded response prefix',
      operator.controllingResponsePrefix
    ],

    [
      'Direct error evidence type',
      operator.directImportErrorEvidenceType
    ],

    [
      'Direct error name',
      operator.directImportErrorName
    ],

    [
      'Direct parser, linker, or resource-load error',
      operator
        .directParserLinkerOrResourceLoadError
    ],

    [
      'Candidate transitive URLs',
      receipt
        .candidateTransitiveUrls
        .join('\n') ||
      'NONE'
    ],

    [
      'Next failure domain',
      receipt.nextFailureDomain
    ],

    [
      'Evidence still missing',
      operator
        .evidenceStillMissing
        .join(', ') ||
      'NONE'
    ],

    [
      'One exact next operation',
      `${operator.oneExactNextOperationId}\n${operator.oneExactNextOperationInstruction}`
    ],

    [
      'Next operation target',
      operator.oneExactNextOperationTarget
    ],

    [
      'Source correction',
      operator.sourceCorrectionAuthorized
        ? 'AUTHORIZED'
        : receipt
            .sourceCorrectionStatus
    ],

    [
      'Constitutional source reopen',
      operator
        .constitutionalSourceReopenAuthorized
        ? 'AUTHORIZED'
        : 'NOT AUTHORIZED'
    ]
  ];

  for (
    const [
      label,
      value
    ]
    of rows
  ) {
    appendRow(
      documentObject,
      list,
      label,
      value
    );
  }

  const footer =
    documentObject.createElement(
      'footer'
    );

  const button =
    documentObject.createElement(
      'button'
    );

  button.type =
    'button';

  button.textContent =
    'Run FD_05 instrument again';

  button.addEventListener(
    'click',
    async () => {
      button.disabled =
        true;

      try {
        await rerun();
      } finally {
        button.disabled =
          false;
      }
    }
  );

  footer.append(button);

  mount.append(
    header,
    list,
    footer
  );

  if (
    !documentObject.getElementById(
      MOUNT_ID
    )
  ) {
    throw new Error(
      'FD_05 receipt mount was not retained in the document.'
    );
  }

  return true;
}

function defaultImportImpl(url) {
  return import(url);
}

function createDefaultDependencies(
  overrides = {}
) {
  const globalObject =
    overrides.globalObject ??
    globalThis;

  const documentObject =
    overrides.documentObject ??
    globalObject.document ??
    null;

  return {
    globalObject,

    documentObject,

    fetchImpl:
      Object.prototype.hasOwnProperty.call(
        overrides,
        'fetchImpl'
      )
        ? overrides.fetchImpl
        : globalObject.fetch
            ?.bind(
              globalObject
            ),

    importImpl:
      overrides.importImpl ??
      defaultImportImpl,

    now:
      overrides.now ??
      nowIso,

    moduleUrl:
      overrides.moduleUrl ??
      import.meta.url,

    branches:
      overrides.branches ??
      DEFAULT_BRANCHES,

    renderImpl:
      overrides.renderImpl ??
      (
        (
          receipt,
          rerun
        ) =>
          renderReceipt(
            receipt,
            documentObject,
            rerun
          )
      ),

    dispatchEventImpl:
      overrides.dispatchEventImpl ??
      (
        (event) =>
          globalObject
            .dispatchEvent
            ?.(event)
      ),

    createEventImpl:
      overrides.createEventImpl ??
      (
        (detail) =>
          new CustomEvent(
            RECEIPT_EVENT,
            {
              detail
            }
          )
      ),

    instrumentPreflightImpl:
      overrides.instrumentPreflightImpl ??
      (
        () =>
          true
      )
  };
}

export function createHEarthFd05InstrumentRuntime(
  overrides = {}
) {
  const dependencies =
    createDefaultDependencies(
      overrides
    );

  let runSequence =
    0;

  let activeRun =
    null;

  const publicationState = {
    receiptPublishedToGlobal:
      false,

    receiptEventDispatched:
      false,

    receiptRenderedOnPage:
      false,

    publicationErrorName:
      null,

    publicationErrorMessage:
      null,

    publicationErrorStack:
      null,

    moduleLoadedAt:
      dependencies
        .globalObject[
          MARKERS.MODULE_LOADED_AT
        ] ??
      dependencies.now(),

    instrumentStartedAt:
      null,

    receiptPublishedAt:
      null,

    receiptRenderedAt:
      null
  };

  function snapshotPublicationState() {
    return {
      ...publicationState
    };
  }

  function resetOccurrencePublicationState(
    runStartedAt
  ) {
    publicationState
      .receiptPublishedToGlobal =
      false;

    publicationState
      .receiptEventDispatched =
      false;

    publicationState
      .receiptRenderedOnPage =
      false;

    publicationState
      .publicationErrorName =
      null;

    publicationState
      .publicationErrorMessage =
      null;

    publicationState
      .publicationErrorStack =
      null;

    publicationState
      .instrumentStartedAt =
      runStartedAt;

    publicationState
      .receiptPublishedAt =
      null;

    publicationState
      .receiptRenderedAt =
      null;

    dependencies
      .globalObject[
        MARKERS.INSTRUMENT_STARTED_AT
      ] =
      runStartedAt;

    dependencies
      .globalObject[
        MARKERS.RECEIPT_PUBLISHED_AT
      ] =
      null;

    dependencies
      .globalObject[
        MARKERS.RECEIPT_RENDERED_AT
      ] =
      null;

    dependencies
      .globalObject[
        GLOBAL_RECEIPT_KEY
      ] =
      null;
  }

  function assignGlobalReceipt(
    receipt
  ) {
    dependencies
      .globalObject[
        GLOBAL_RECEIPT_KEY
      ] =
      receipt;

    publicationState
      .receiptPublishedToGlobal =
      true;

    publicationState
      .receiptPublishedAt =
      dependencies.now();

    dependencies
      .globalObject[
        MARKERS.RECEIPT_PUBLISHED_AT
      ] =
      publicationState
        .receiptPublishedAt;
  }

  function dispatchReceipt(
    receipt
  ) {
    try {
      const event =
        dependencies
          .createEventImpl(
            receipt
          );

      dependencies
        .dispatchEventImpl(
          event
        );

      publicationState
        .receiptEventDispatched =
        true;
    } catch (error) {
      publicationState
        .publicationErrorName =
        bounded(
          error?.name,
          160
        );

      publicationState
        .publicationErrorMessage =
        bounded(
          error?.message ??
          error,
          MESSAGE_LIMIT
        );

      publicationState
        .publicationErrorStack =
        bounded(
          error?.stack,
          STACK_LIMIT
        );
    }
  }

  function renderPublishedReceipt(
    receipt,
    rerun
  ) {
    try {
      dependencies.renderImpl(
        receipt,
        rerun
      );

      const mounted =
        dependencies
          .documentObject
          ?.getElementById?.(
            MOUNT_ID
          ) ??
        (
          overrides.renderImpl
            ? true
            : false
        );

      if (!mounted) {
        throw new Error(
          'FD_05 receipt render completed without a retained mount.'
        );
      }

      publicationState
        .receiptRenderedOnPage =
        true;

      publicationState
        .receiptRenderedAt =
        dependencies.now();

      dependencies
        .globalObject[
          MARKERS.RECEIPT_RENDERED_AT
        ] =
        publicationState
          .receiptRenderedAt;
    } catch (error) {
      publicationState
        .receiptRenderedOnPage =
        false;

      publicationState
        .publicationErrorName =
        bounded(
          error?.name,
          160
        );

      publicationState
        .publicationErrorMessage =
        bounded(
          error?.message ??
          error,
          MESSAGE_LIMIT
        );

      publicationState
        .publicationErrorStack =
        bounded(
          error?.stack,
          STACK_LIMIT
        );
    }
  }

  function publishAndRender(
    receiptFactory,
    rerun
  ) {
    let receipt =
      receiptFactory(
        snapshotPublicationState()
      );

    try {
      assignGlobalReceipt(
        receipt
      );
    } catch (error) {
      publicationState
        .publicationErrorName =
        bounded(
          error?.name,
          160
        );

      publicationState
        .publicationErrorMessage =
        bounded(
          error?.message ??
          error,
          MESSAGE_LIMIT
        );

      publicationState
        .publicationErrorStack =
        bounded(
          error?.stack,
          STACK_LIMIT
        );

      return receiptFactory(
        snapshotPublicationState()
      );
    }

    receipt =
      receiptFactory(
        snapshotPublicationState()
      );

    dependencies
      .globalObject[
        GLOBAL_RECEIPT_KEY
      ] =
      receipt;

    renderPublishedReceipt(
      receipt,
      rerun
    );

    receipt =
      receiptFactory(
        snapshotPublicationState()
      );

    dependencies
      .globalObject[
        GLOBAL_RECEIPT_KEY
      ] =
      receipt;

    dispatchReceipt(
      receipt
    );

    receipt =
      receiptFactory(
        snapshotPublicationState()
      );

    dependencies
      .globalObject[
        GLOBAL_RECEIPT_KEY
      ] =
      receipt;

    if (
      publicationState
        .receiptRenderedOnPage
    ) {
      try {
        dependencies.renderImpl(
          receipt,
          rerun
        );
      } catch {
        /*
         * The first successful retained render controls visibility truth.
         * The final refresh failure does not erase the retained render.
         */
      }
    }

    return receipt;
  }

  async function run() {
    if (activeRun) {
      return activeRun;
    }

    activeRun =
      (
        async () => {
          runSequence +=
            1;

          const runStartedAt =
            dependencies.now();

          const runId =
            `H_EARTH_FD_05_RUN_${String(
              runSequence
            ).padStart(
              4,
              '0'
            )}_${Date.now()}`;

          resetOccurrencePublicationState(
            runStartedAt
          );

          const pendingFactory =
            (state) =>
              buildBaseReceipt({
                runId,

                runStartedAt,

                runCompletedAt:
                  null,

                executionStatus:
                  'RUNNING',

                branchResults:
                  [],

                fatalError:
                  null,

                publicationState:
                  state,

                moduleUrl:
                  dependencies.moduleUrl
              });

          publishAndRender(
            pendingFactory,
            run
          );

          let branchResults =
            [];

          let fatalError =
            null;

          let executionStatus =
            'COMPLETE';

          try {
            await dependencies
              .instrumentPreflightImpl();

            branchResults =
              await Promise.all(
                dependencies
                  .branches
                  .map(
                    (branch) =>
                      inspectBranch(
                        branch,
                        dependencies
                      )
                  )
              );
          } catch (error) {
            fatalError =
              error;

            executionStatus =
              'FAILED';
          }

          const completedAt =
            dependencies.now();

          const completedFactory =
            (state) =>
              buildBaseReceipt({
                runId,

                runStartedAt,

                runCompletedAt:
                  completedAt,

                executionStatus,

                branchResults,

                fatalError,

                publicationState:
                  state,

                moduleUrl:
                  dependencies.moduleUrl
              });

          return publishAndRender(
            completedFactory,
            run
          );
        }
      )()
        .finally(
          () => {
            activeRun =
              null;
          }
        );

    return activeRun;
  }

  return deepFreeze({
    contractId:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_CONTRACT_ID,

    reportSystemDirectiveId:
      H_EARTH_FD_05_REPORT_SYSTEM_DIRECTIVE_ID,

    sourceFile:
      H_EARTH_FD_05_MODULE_IMPORT_TRACK_SOURCE_FILE,

    failureDomain:
      H_EARTH_FD_05_ACTIVE_FAILURE_DOMAIN,

    primaryReceiptId:
      H_EARTH_FD_05_PRIMARY_RECEIPT_ID,

    primaryReport:
      H_EARTH_FD_05_PRIMARY_REPORT,

    supportingReports:
      H_EARTH_FD_05_SUPPORTING_REPORTS,

    fullEvidenceArchive:
      H_EARTH_FD_05_FULL_EVIDENCE_ARCHIVE,

    branches:
      dependencies.branches,

    run,

    getReceipt() {
      return (
        dependencies
          .globalObject[
            GLOBAL_RECEIPT_KEY
          ] ??
        null
      );
    }
  });
}

const moduleLoadedAt =
  nowIso();

if (
  !globalThis[
    MARKERS.MODULE_LOADED_AT
  ]
) {
  globalThis[
    MARKERS.MODULE_LOADED_AT
  ] =
    moduleLoadedAt;
}

export const H_EARTH_FD_05_MODULE_IMPORT_TRACK =
  createHEarthFd05InstrumentRuntime();

globalThis[
  GLOBAL_TRACK_KEY
] =
  H_EARTH_FD_05_MODULE_IMPORT_TRACK;

export function runHEarthFd05ModuleImportTrack() {
  return H_EARTH_FD_05_MODULE_IMPORT_TRACK
    .run();
}

export function getHEarthFd05ModuleImportDiagnosticReceipt() {
  return H_EARTH_FD_05_MODULE_IMPORT_TRACK
    .getReceipt();
}

export const H_EARTH_FD_05_TEST_API =
  deepFreeze({
    classifyPayload:
      classifyHEarthFd05Payload,

    classifyTransport:
      classifyHEarthFd05Transport,

    classifyTransitiveEvidence:
      classifyHEarthFd05TransitiveEvidence,

    createRuntime:
      createHEarthFd05InstrumentRuntime,

    branches:
      DEFAULT_BRANCHES,

    markers:
      MARKERS,

    responseEvidenceScope:
      H_EARTH_FD_05_RESPONSE_EVIDENCE_SCOPE
  });

function startInstrument() {
  void runHEarthFd05ModuleImportTrack();
}

if (
  globalThis.document &&
  globalThis
    .H_EARTH_FD_05_DISABLE_AUTO_START_FOR_TESTS !==
  true
) {
  if (
    globalThis.document
      .readyState ===
    'loading'
  ) {
    globalThis.document
      .addEventListener(
        'DOMContentLoaded',
        startInstrument,
        {
          once:
            true
        }
      );
  } else {
    startInstrument();
  }
}

export default
  H_EARTH_FD_05_MODULE_IMPORT_TRACK;
