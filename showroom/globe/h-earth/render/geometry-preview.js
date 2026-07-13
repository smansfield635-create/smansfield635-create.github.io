/**
 * /showroom/globe/h-earth/render/geometry-preview.js
 * COMPLETE PREVIEW FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_PREVIEW_FILE_BIRTH_STEP_034O_5P_DEVELOPER_VISIBLE_PROVIDER_PREVIEW_BRIDGE_v3
 *
 * DEPENDS ON:
 * H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1
 * H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1
 *
 * STATUS:
 * PREVIEW_INTEGRATION_CANDIDATE
 *
 * PURPOSE:
 * DEVELOPER-VISIBLE PREVIEW BRIDGE FOR PROVIDER OUTPUT BEFORE FORMAL
 * GEOMETRY-INDEX AUTHORITY EXISTS.
 *
 * IMPORT LAW:
 * THIS FILE IMPORTS ONLY:
 * - ./geometry-kernel.js
 * - ./geometry-ground.js
 *
 * THIS FILE DOES NOT:
 * - own formal aggregate-frame authority
 * - own geometry-index authority
 * - own compositor policy
 * - own renderer materialization
 * - own visual approval
 * - own production authority
 * - own public-release authority
 *
 * IMPLEMENTATION CONFORMANCE:
 * HOLD_PENDING_EXECUTABLE_CORRIDOR.
 *
 * LOCAL ADMISSION:
 * FALSE.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthNonEmptyString,
  isHEarthNonNegativeSafeInteger,
  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext,

  getHEarthGeometryKernelPublicFacadeContract,
  getHEarthGeometryKernelPublicFacadeReceipt
} from './geometry-kernel.js';

import {
  H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE,

  constructHEarthGroundProvider,
  isHEarthGroundProviderResult,

  getHEarthGeometryGroundProviderContract,
  getHEarthGeometryGroundProviderReceipt,
  getHEarthGeometryGroundProviderStaticReview
} from './geometry-ground.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_PREVIEW_FILE_BIRTH_STEP_034O_5P_DEVELOPER_VISIBLE_PROVIDER_PREVIEW_BRIDGE_v3';

export const H_EARTH_3D_GEOMETRY_PREVIEW_SCHEMA_VERSION =
  3;

export const H_EARTH_3D_GEOMETRY_PREVIEW_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-preview.js';

export const H_EARTH_3D_GEOMETRY_PREVIEW_STEP_ID =
  'STEP_034O_5P_DEVELOPER_VISIBLE_PROVIDER_PREVIEW_BRIDGE';

export const H_EARTH_3D_GEOMETRY_PREVIEW_STATUS =
  'PREVIEW_INTEGRATION_CANDIDATE';


/* ==========================================================================
 * 02 · INTERNAL STRUCTURE
 * ========================================================================== */

function deepFreeze(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }

  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue);
  }

  return Object.freeze(value);
}

function isPlainObject(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }

  const prototype =
    Object.getPrototypeOf(value);

  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function clonePlainValue(value) {
  if (Array.isArray(value)) {
    return value.map(clonePlainValue);
  }

  if (isPlainObject(value)) {
    return Object.fromEntries(
      Object.entries(value).map(
        ([key, nestedValue]) => [
          key,
          clonePlainValue(nestedValue)
        ]
      )
    );
  }

  return value;
}

function freezeClone(value) {
  return deepFreeze(
    clonePlainValue(value)
  );
}

function ensureArray(value) {
  return Array.isArray(value)
    ? value
    : [];
}

function enumIncludes(enumObject, value) {
  return Object.values(enumObject)
    .includes(value);
}

function createPreviewIssue(
  code,
  severity,
  message,
  details = null,
  blocking = null,
  context = {}
) {
  return createHEarthGeometryIssue(
    code,
    severity,
    message,
    details,
    blocking,
    {
      ...context,
      sourceModule:
        'geometry-preview.js'
    }
  );
}

function normalizeStringIdArray(values) {
  const normalized = [];
  const seen = new Set();

  for (const value of ensureArray(values)) {
    if (!isHEarthNonEmptyString(value)) {
      continue;
    }

    const trimmed =
      value.trim();

    if (seen.has(trimmed)) {
      continue;
    }

    seen.add(trimmed);
    normalized.push(trimmed);
  }

  return deepFreeze(normalized);
}

function isNormalizedStringIdArray(values) {
  if (!Array.isArray(values)) {
    return false;
  }

  const normalized =
    normalizeStringIdArray(values);

  return (
    normalized.length ===
      values.length &&
    values.every(
      (value, index) =>
        isHEarthNonEmptyString(value) &&
        value === value.trim() &&
        value === normalized[index]
    )
  );
}

function areStringArraysEquivalent(
  left,
  right
) {
  const normalizedLeft =
    normalizeStringIdArray(left);

  const normalizedRight =
    normalizeStringIdArray(right);

  return (
    normalizedLeft.length ===
      normalizedRight.length &&
    normalizedLeft.every(
      (value, index) =>
        value ===
        normalizedRight[index]
    )
  );
}

function countIssuesBySeverity(issues = []) {
  let fatalCount = 0;
  let errorCount = 0;
  let warningCount = 0;
  let infoCount = 0;
  let blockingCount = 0;

  for (const issue of ensureArray(issues)) {
    if (!isPlainObject(issue)) {
      continue;
    }

    if (issue.blocking === true) {
      blockingCount += 1;
    }

    if (issue.severity === 'FATAL') {
      fatalCount += 1;
    } else if (issue.severity === 'ERROR') {
      errorCount += 1;
    } else if (issue.severity === 'WARNING') {
      warningCount += 1;
    } else if (issue.severity === 'INFO') {
      infoCount += 1;
    }
  }

  return deepFreeze({
    fatalCount,
    errorCount,
    warningCount,
    infoCount,
    blockingCount,
    totalCount:
      fatalCount +
      errorCount +
      warningCount +
      infoCount
  });
}

function buildPreviewAuthority() {
  return deepFreeze({
    previewOnly:
      true,
    providerLocalConstructionAdapter:
      false,
    aggregateFrameAuthority:
      false,
    geometryIndexAuthority:
      false,
    compositorAuthority:
      false,
    rendererAuthority:
      false,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false
  });
}

function isPreviewAuthority(value) {
  return (
    isPlainObject(value) &&
    value.previewOnly === true &&
    value.providerLocalConstructionAdapter === false &&
    value.aggregateFrameAuthority === false &&
    value.geometryIndexAuthority === false &&
    value.compositorAuthority === false &&
    value.rendererAuthority === false &&
    value.visualApproval === false &&
    value.productionAuthority === false &&
    value.publicReleaseAuthority === false
  );
}

function getEmptyPreviewBounds() {
  return mergeHEarthGeometryBounds([]);
}

function resolvePreviewConstructionStatus({
  valid,
  ineligible,
  fatal
}) {
  if (
    valid === true &&
    ineligible !== true &&
    fatal !== true
  ) {
    return H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus
      .VALID;
  }

  if (
    valid !== true &&
    ineligible === true &&
    fatal !== true
  ) {
    return H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus
      .INELIGIBLE;
  }

  return H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
    .constructionStatus
    .FATAL;
}


/* ==========================================================================
 * 03 · ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS =
  deepFreeze({
    previewRole: deepFreeze({
      DEVELOPER_VISIBLE_PROVIDER_PREVIEW:
        'DEVELOPER_VISIBLE_PROVIDER_PREVIEW'
    }),

    providerSelection: deepFreeze({
      GROUND_ONLY:
        'GROUND_ONLY'
    }),

    constructionStatus: deepFreeze({
      VALID:
        'VALID',
      INELIGIBLE:
        'INELIGIBLE',
      FATAL:
        'FATAL'
    })
  });


/* ==========================================================================
 * 04 · DISPLAY POLICY / INTEROP / SUMMARY / HANDOFF
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_DISPLAY_POLICY =
  deepFreeze({
    previewLane:
      'ADDITIVE',
    optionalOverlay:
      true,
    environmentFirstCompositorPreserved:
      true,
    previewMaySupplementCompositor:
      true,
    previewMayNotReplaceEnvironmentTruth:
      true,
    previewMayNotReplaceCompositorPolicy:
      true,
    previewMayNotCreateGeometryIndexAuthority:
      true,
    previewMayNotCreateRendererAuthority:
      true,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false
  });

export const H_EARTH_3D_GEOMETRY_PREVIEW_INTEROP =
  deepFreeze({
    compositorInteropMode:
      'OPTIONAL_PREVIEW_OVERLAY_HANDOFF',
    rendererInteropMode:
      'OPTIONAL_PREVIEW_PRIMITIVE_DISPLAY',
    geometryIndexAuthority:
      false,
    compositorAuthority:
      false,
    rendererAuthority:
      false,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false
  });

function buildPreviewSummary(previewResult) {
  if (!isHEarthGeometryPreviewResult(previewResult)) {
    return null;
  }

  return deepFreeze({
    previewId:
      previewResult.previewId,
    previewRole:
      previewResult.previewRole,
    constructionStatus:
      previewResult.constructionStatus,
    valid:
      previewResult.valid,
    ineligible:
      previewResult.ineligible,
    fatal:
      previewResult.fatal,
    sourceProviderIds:
      previewResult.sourceProviderIds,
    sourceZoneIds:
      previewResult.sourceZoneIds,
    sourceObjectIds:
      previewResult.sourceObjectIds,
    primitiveCount:
      previewResult.primitives.length,
    bounds:
      previewResult.bounds,
    issueCounts:
      countIssuesBySeverity(
        previewResult.issues
      ),
    previewOnly:
      true,
    additivePreviewLane:
      true,
    environmentFirstCompositorPreserved:
      true
  });
}

function isHEarthGeometryPreviewSummary(value) {
  return (
    isPlainObject(value) &&
    isHEarthNonEmptyString(
      value.previewId
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .previewRole,
      value.previewRole
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .constructionStatus,
      value.constructionStatus
    ) &&
    typeof value.valid ===
      'boolean' &&
    typeof value.ineligible ===
      'boolean' &&
    typeof value.fatal ===
      'boolean' &&
    isNormalizedStringIdArray(
      value.sourceProviderIds
    ) &&
    isNormalizedStringIdArray(
      value.sourceZoneIds
    ) &&
    isNormalizedStringIdArray(
      value.sourceObjectIds
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.primitiveCount
    ) &&
    isHEarthAABB3D(
      value.bounds
    ) &&
    isIssueCountRecord(
      value.issueCounts
    ) &&
    value.previewOnly === true &&
    value.additivePreviewLane === true &&
    value.environmentFirstCompositorPreserved === true
  );
}

export function createHEarthGeometryPreviewHandoff(
  previewResult
) {
  if (
    !isHEarthGeometryPreviewResult(
      previewResult
    ) ||
    previewResult.valid !== true
  ) {
    return null;
  }

  return deepFreeze({
    recordType:
      'H_EARTH_GEOMETRY_PREVIEW_HANDOFF',

    handoffId:
      `${previewResult.previewId}:preview-handoff`,

    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,

    previewResult:
      freezeClone(previewResult),

    previewSummary:
      buildPreviewSummary(
        previewResult
      ),

    previewOnly:
      true,
    optionalOverlay:
      true,
    additivePreviewLane:
      true,
    environmentFirstCompositorPreserved:
      true,

    displayPolicy:
      H_EARTH_3D_GEOMETRY_PREVIEW_DISPLAY_POLICY,

    interop:
      H_EARTH_3D_GEOMETRY_PREVIEW_INTEROP,

    geometryIndexAuthority:
      false,
    compositorAuthority:
      false,
    rendererAuthority:
      false,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false
  });
}

export function isHEarthGeometryPreviewHandoff(
  handoff
) {
  return (
    isPlainObject(handoff) &&
    handoff.recordType ===
      'H_EARTH_GEOMETRY_PREVIEW_HANDOFF' &&
    isHEarthNonEmptyString(
      handoff.handoffId
    ) &&
    handoff.contractId ===
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID &&
    isHEarthGeometryPreviewResult(
      handoff.previewResult
    ) &&
    handoff.previewResult.valid === true &&
    isHEarthGeometryPreviewSummary(
      handoff.previewSummary
    ) &&
    handoff.previewSummary.previewId ===
      handoff.previewResult.previewId &&
    handoff.previewOnly === true &&
    handoff.optionalOverlay === true &&
    handoff.additivePreviewLane === true &&
    handoff.environmentFirstCompositorPreserved === true &&
    handoff.displayPolicy ===
      H_EARTH_3D_GEOMETRY_PREVIEW_DISPLAY_POLICY &&
    handoff.interop ===
      H_EARTH_3D_GEOMETRY_PREVIEW_INTEROP &&
    handoff.geometryIndexAuthority === false &&
    handoff.compositorAuthority === false &&
    handoff.rendererAuthority === false &&
    handoff.visualApproval === false &&
    handoff.productionAuthority === false &&
    handoff.publicReleaseAuthority === false
  );
}


/* ==========================================================================
 * 05 · RECEIPT / ACCOUNT / RESULT VALIDATION
 * ========================================================================== */

function isIssueCountRecord(value) {
  return (
    isPlainObject(value) &&
    isHEarthNonNegativeSafeInteger(
      value.fatalCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.errorCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.warningCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.infoCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.blockingCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      value.totalCount
    ) &&
    value.totalCount ===
      value.fatalCount +
        value.errorCount +
        value.warningCount +
        value.infoCount &&
    value.blockingCount <=
      value.totalCount
  );
}

export function isHEarthGeometryPreviewReceipt(
  receipt
) {
  return (
    isPlainObject(receipt) &&
    receipt.recordType ===
      'H_EARTH_GEOMETRY_PREVIEW_RECEIPT' &&
    isHEarthNonEmptyString(
      receipt.receiptId
    ) &&
    isHEarthNonEmptyString(
      receipt.previewId
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .previewRole,
      receipt.previewRole
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .providerSelection,
      receipt.providerSelection
    ) &&
    typeof receipt.valid ===
      'boolean' &&
    receipt.valid ===
      (
        receipt.issueCounts
          ?.blockingCount === 0
      ) &&
    isNormalizedStringIdArray(
      receipt.sourceProviderIds
    ) &&
    isNormalizedStringIdArray(
      receipt.sourceZoneIds
    ) &&
    isNormalizedStringIdArray(
      receipt.sourceObjectIds
    ) &&
    isIssueCountRecord(
      receipt.issueCounts
    ) &&
    typeof receipt.previewOnly ===
      'boolean' &&
    receipt.previewOnly === true
  );
}

export function isHEarthGeometryPreviewAccount(
  account
) {
  return (
    isPlainObject(account) &&
    isHEarthNonNegativeSafeInteger(
      account.requestedProviderCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.contributingProviderCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.previewPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.validProviderCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.ineligibleProviderCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.fatalProviderCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.issueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.blockingIssueCount
    ) &&
    typeof account.boundsPresent ===
      'boolean' &&
    typeof account.emptyBounds ===
      'boolean'
  );
}

function doesPreviewAccountMatchIssues(
  record
) {
  const issueCounts =
    countIssuesBySeverity(
      record.issues
    );

  return (
    record.account.issueCount ===
      issueCounts.totalCount &&
    record.account
      .blockingIssueCount ===
      issueCounts.blockingCount
  );
}

function doPreviewReceiptsMatchResult(
  record
) {
  if (
    !Array.isArray(record.receipts)
  ) {
    return false;
  }

  return (
    record.receipts.length === 1 &&
    isHEarthGeometryPreviewReceipt(
      record.receipts[0]
    ) &&
    record.receipts[0].previewId ===
      record.previewId &&
    record.receipts[0].previewRole ===
      record.previewRole &&
    areStringArraysEquivalent(
      record.receipts[0].sourceProviderIds,
      record.sourceProviderIds
    ) &&
    areStringArraysEquivalent(
      record.receipts[0].sourceZoneIds,
      record.sourceZoneIds
    ) &&
    areStringArraysEquivalent(
      record.receipts[0].sourceObjectIds,
      record.sourceObjectIds
    )
  );
}

function doPreviewBoundsMatchPrimitives(
  record
) {
  if (
    !Array.isArray(record?.primitives)
  ) {
    return false;
  }

  if (
    record.primitives.length === 0
  ) {
    return (
      isHEarthAABB3D(record.bounds) &&
      record.bounds.empty === true
    );
  }

  const derivedBounds =
    mergeHEarthGeometryBounds(
      record.primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  if (
    !isHEarthAABB3D(derivedBounds) ||
    !isHEarthAABB3D(record.bounds)
  ) {
    return false;
  }

  const merged =
    mergeHEarthGeometryBounds([
      derivedBounds,
      record.bounds
    ]);

  const context =
    isHEarthAABB3D(merged)
      ? deriveHEarthGeometryToleranceContext(
          merged
        )
      : null;

  if (
    !isHEarthGeometryToleranceContext(
      context
    )
  ) {
    return false;
  }

  if (
    derivedBounds.empty === true ||
    record.bounds.empty === true
  ) {
    return (
      derivedBounds.empty === true &&
      record.bounds.empty === true
    );
  }

  const left =
    derivedBounds;
  const right =
    record.bounds;

  const vectorEqual =
    (a, b) => (
      a.x === b.x &&
      a.y === b.y &&
      a.z === b.z
    );

  return (
    vectorEqual(
      left.minimum,
      right.minimum
    ) &&
    vectorEqual(
      left.maximum,
      right.maximum
    ) &&
    vectorEqual(
      left.center,
      right.center
    ) &&
    vectorEqual(
      left.size,
      right.size
    ) &&
    vectorEqual(
      left.halfExtent,
      right.halfExtent
    ) &&
    left.diagonalLength ===
      right.diagonalLength &&
    left.empty ===
      right.empty &&
    left.coordinateFrame ===
      right.coordinateFrame
  );
}

export function isHEarthGeometryPreviewResult(
  record
) {
  if (
    !isPlainObject(record) ||
    record.recordType !==
      'H_EARTH_GEOMETRY_PREVIEW_RESULT' ||
    !isHEarthNonEmptyString(
      record.previewId
    ) ||
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .previewRole,
      record.previewRole
    ) !== true ||
    enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .constructionStatus,
      record.constructionStatus
    ) !== true ||
    !isNormalizedStringIdArray(
      record.sourceProviderIds
    ) ||
    !isNormalizedStringIdArray(
      record.sourceZoneIds
    ) ||
    !isNormalizedStringIdArray(
      record.sourceObjectIds
    ) ||
    !Array.isArray(record.providerResults) ||
    !record.providerResults.every(
      isHEarthGroundProviderResult
    ) ||
    !Array.isArray(record.primitives) ||
    !isHEarthAABB3D(record.bounds) ||
    !isHEarthGeometryPreviewAccount(
      record.account
    ) ||
    !Array.isArray(record.issues) ||
    !Array.isArray(record.receipts) ||
    !isPreviewAuthority(
      record.authority
    ) ||
    doesPreviewAccountMatchIssues(
      record
    ) !== true ||
    doPreviewReceiptsMatchResult(
      record
    ) !== true ||
    doPreviewBoundsMatchPrimitives(
      record
    ) !== true
  ) {
    return false;
  }

  if (
    record.constructionStatus ===
    H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus.VALID
  ) {
    return (
      record.valid === true &&
      record.ineligible === false &&
      record.fatal === false &&
      record.primitives.length > 0 &&
      record.bounds.empty === false &&
      !hasHEarthBlockingIssues(
        record.issues
      ) &&
      record.account
        .requestedProviderCount ===
        1 &&
      record.account
        .contributingProviderCount ===
        1 &&
      record.account
        .previewPrimitiveCount ===
        record.primitives.length &&
      record.account
        .validProviderCount ===
        1 &&
      record.account
        .ineligibleProviderCount ===
        0 &&
      record.account
        .fatalProviderCount ===
        0
    );
  }

  if (
    record.constructionStatus ===
    H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus.INELIGIBLE
  ) {
    return (
      record.valid === false &&
      record.ineligible === true &&
      record.fatal === false &&
      record.primitives.length === 0 &&
      record.bounds.empty === true &&
      !hasHEarthBlockingIssues(
        record.issues
      ) &&
      record.account
        .requestedProviderCount ===
        1 &&
      record.account
        .contributingProviderCount ===
        0 &&
      record.account
        .previewPrimitiveCount ===
        0 &&
      record.account
        .validProviderCount ===
        0 &&
      record.account
        .ineligibleProviderCount ===
        1 &&
      record.account
        .fatalProviderCount ===
        0
    );
  }

  return (
    record.valid === false &&
    record.ineligible === false &&
    record.fatal === true &&
    record.primitives.length === 0 &&
    record.bounds.empty === true &&
    hasHEarthBlockingIssues(
      record.issues
    ) &&
    record.account
      .requestedProviderCount ===
      1 &&
    record.account
      .contributingProviderCount ===
      0 &&
    record.account
      .previewPrimitiveCount ===
      0 &&
    record.account
      .validProviderCount ===
      0 &&
    record.account
      .ineligibleProviderCount ===
      0 &&
    record.account
      .fatalProviderCount ===
      record.providerResults.filter(
        (providerResult) =>
          providerResult.fatal === true
      ).length &&
    record.account
      .fatalProviderCount <=
      1
  );
}


/* ==========================================================================
 * 06 · RESULT BUILDERS
 * ========================================================================== */

function buildPreviewAccount({
  providerResults,
  primitives,
  bounds,
  issues
}) {
  const issueCounts =
    countIssuesBySeverity(issues);

  const validProviderCount =
    ensureArray(providerResults)
      .filter(
        (result) =>
          result.valid === true
      )
      .length;

  const ineligibleProviderCount =
    ensureArray(providerResults)
      .filter(
        (result) =>
          result.ineligible === true
      )
      .length;

  const fatalProviderCount =
    ensureArray(providerResults)
      .filter(
        (result) =>
          result.fatal === true
      )
      .length;

  return deepFreeze({
    requestedProviderCount:
      1,
    contributingProviderCount:
      validProviderCount,
    previewPrimitiveCount:
      ensureArray(primitives).length,
    validProviderCount,
    ineligibleProviderCount,
    fatalProviderCount,
    issueCount:
      issueCounts.totalCount,
    blockingIssueCount:
      issueCounts.blockingCount,
    boundsPresent:
      isHEarthAABB3D(bounds),
    emptyBounds:
      isHEarthAABB3D(bounds)
        ? bounds.empty === true
        : false
  });
}

function buildPreviewReceipt({
  previewId,
  previewRole,
  sourceProviderIds,
  sourceZoneIds,
  sourceObjectIds,
  issues
}) {
  const issueCounts =
    countIssuesBySeverity(
      issues
    );

  return deepFreeze({
    recordType:
      'H_EARTH_GEOMETRY_PREVIEW_RECEIPT',

    receiptId:
      `${previewId}:preview-receipt`,

    previewId,
    previewRole,

    providerSelection:
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .providerSelection
        .GROUND_ONLY,

    valid:
      issueCounts.blockingCount === 0,

    sourceProviderIds:
      normalizeStringIdArray(
        sourceProviderIds
      ),

    sourceZoneIds:
      normalizeStringIdArray(
        sourceZoneIds
      ),

    sourceObjectIds:
      normalizeStringIdArray(
        sourceObjectIds
      ),

    issueCounts,

    previewOnly:
      true
  });
}

function createHEarthGeometryPreviewResult({
  previewId,
  previewRole,
  sourceProviderIds,
  sourceZoneIds,
  sourceObjectIds,
  providerResults,
  valid,
  ineligible,
  fatal,
  primitives,
  bounds,
  issues
}) {
  const constructionStatus =
    resolvePreviewConstructionStatus({
      valid,
      ineligible,
      fatal
    });

  const normalizedProviderResults =
    deepFreeze(
      ensureArray(providerResults)
        .filter(
          isHEarthGroundProviderResult
        )
        .slice()
    );

  const normalizedPrimitives =
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus.VALID
      ? deepFreeze(
          ensureArray(primitives).slice()
        )
      : deepFreeze([]);

  const normalizedBounds =
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .constructionStatus.VALID
      ? bounds
      : getEmptyPreviewBounds();

  const normalizedIssues =
    sortHEarthGeometryIssues(
      issues
    );

  const receipt =
    buildPreviewReceipt({
      previewId,
      previewRole,
      sourceProviderIds,
      sourceZoneIds,
      sourceObjectIds,
      issues:
        normalizedIssues
    });

  return deepFreeze({
    recordType:
      'H_EARTH_GEOMETRY_PREVIEW_RESULT',

    previewId,
    previewRole,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    constructionStatus,

    valid:
      constructionStatus ===
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .constructionStatus.VALID,

    ineligible:
      constructionStatus ===
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .constructionStatus
        .INELIGIBLE,

    fatal:
      constructionStatus ===
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .constructionStatus.FATAL,

    sourceProviderIds:
      normalizeStringIdArray(
        sourceProviderIds
      ),

    sourceZoneIds:
      normalizeStringIdArray(
        sourceZoneIds
      ),

    sourceObjectIds:
      normalizeStringIdArray(
        sourceObjectIds
      ),

    providerResults:
      normalizedProviderResults,

    primitives:
      normalizedPrimitives,

    bounds:
      normalizedBounds,

    account:
      buildPreviewAccount({
        providerResults:
          normalizedProviderResults,
        primitives:
          normalizedPrimitives,
        bounds:
          normalizedBounds,
        issues:
          normalizedIssues
      }),

    issues:
      normalizedIssues,

    receipts:
      deepFreeze([receipt]),

    authority:
      buildPreviewAuthority()
  });
}


/* ==========================================================================
 * 07 · DEFAULT OCCURRENCE / PREVIEW CONSTRUCTION
 * ========================================================================== */

function resolvePreviewId(
  previewId
) {
  return isHEarthNonEmptyString(
    previewId
  )
    ? previewId.trim()
    : 'H_EARTH_GEOMETRY_PREVIEW';
}

function collectSourceZoneIdsFromProvider(
  providerResult
) {
  return normalizeStringIdArray(
    providerResult?.sourceZoneIds
  );
}

function collectSourceObjectIdsFromProvider(
  providerResult
) {
  return normalizeStringIdArray(
    providerResult?.sourceObjectIds
  );
}

export function constructHEarthGeometryPreview({
  previewId =
    'H_EARTH_GEOMETRY_PREVIEW',

  previewRole =
    H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
      .previewRole
      .DEVELOPER_VISIBLE_PROVIDER_PREVIEW,

  groundProviderInput = {}
} = {}) {
  const issues = [];

  if (
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .previewRole,
      previewRole
    )
  ) {
    issues.push(
      createPreviewIssue(
        'GEOMETRY_PREVIEW_ROLE_INVALID',
        'ERROR',
        'Geometry preview role is unsupported.'
      )
    );
  }

  const resolvedPreviewId =
    resolvePreviewId(previewId);

  if (
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
        .previewRole,
      previewRole
    )
  ) {
    return createHEarthGeometryPreviewResult({
      previewId:
        resolvedPreviewId,
      previewRole:
        H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
          .previewRole
          .DEVELOPER_VISIBLE_PROVIDER_PREVIEW,
      sourceProviderIds: [],
      sourceZoneIds: [],
      sourceObjectIds: [],
      providerResults: [],
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives: [],
      bounds:
        getEmptyPreviewBounds(),
      issues
    });
  }

  const groundProviderResult =
    constructHEarthGroundProvider(
      groundProviderInput
    );

  if (
    !isHEarthGroundProviderResult(
      groundProviderResult
    )
  ) {
    issues.push(
      createPreviewIssue(
        'GEOMETRY_PREVIEW_PROVIDER_RESULT_INVALID',
        'ERROR',
        'Ground provider did not return a lawful provider result.'
      )
    );

    return createHEarthGeometryPreviewResult({
      previewId:
        resolvedPreviewId,
      previewRole,
      sourceProviderIds: [],
      sourceZoneIds: [],
      sourceObjectIds: [],
      providerResults: [],
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives: [],
      bounds:
        getEmptyPreviewBounds(),
      issues
    });
  }

  issues.push(
    ...ensureArray(
      groundProviderResult.issues
    )
  );

  const sourceProviderIds = [
    groundProviderResult.providerId
  ];

  const sourceZoneIds =
    collectSourceZoneIdsFromProvider(
      groundProviderResult
    );

  const sourceObjectIds =
    collectSourceObjectIdsFromProvider(
      groundProviderResult
    );

  if (
    groundProviderResult.ineligible ===
    true
  ) {
    return createHEarthGeometryPreviewResult({
      previewId:
        resolvedPreviewId,
      previewRole,
      sourceProviderIds,
      sourceZoneIds,
      sourceObjectIds,
      providerResults: [
        groundProviderResult
      ],
      valid:
        false,
      ineligible:
        true,
      fatal:
        false,
      primitives: [],
      bounds:
        getEmptyPreviewBounds(),
      issues
    });
  }

  if (
    groundProviderResult.fatal === true ||
    groundProviderResult.valid !== true
  ) {
    return createHEarthGeometryPreviewResult({
      previewId:
        resolvedPreviewId,
      previewRole,
      sourceProviderIds,
      sourceZoneIds,
      sourceObjectIds,
      providerResults: [
        groundProviderResult
      ],
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives: [],
      bounds:
        getEmptyPreviewBounds(),
      issues
    });
  }

  const primitives =
    deepFreeze(
      ensureArray(
        groundProviderResult.primitives
      ).slice()
    );

  const bounds =
    mergeHEarthGeometryBounds(
      primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  if (!isHEarthAABB3D(bounds)) {
    issues.push(
      createPreviewIssue(
        'GEOMETRY_PREVIEW_MERGED_BOUNDS_INVALID',
        'ERROR',
        'Preview bridge could not derive lawful merged bounds from preview primitives.'
      )
    );

    return createHEarthGeometryPreviewResult({
      previewId:
        resolvedPreviewId,
      previewRole,
      sourceProviderIds,
      sourceZoneIds,
      sourceObjectIds,
      providerResults: [
        groundProviderResult
      ],
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives: [],
      bounds:
        getEmptyPreviewBounds(),
      issues
    });
  }

  return createHEarthGeometryPreviewResult({
    previewId:
      resolvedPreviewId,
    previewRole,
    sourceProviderIds,
    sourceZoneIds,
    sourceObjectIds,
    providerResults: [
      groundProviderResult
    ],
    valid:
      true,
    ineligible:
      false,
    fatal:
      false,
    primitives,
    bounds,
    issues
  });
}

export const H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE =
  deepFreeze(
    constructHEarthGeometryPreview({
      previewId:
        'H_EARTH_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE',
      groundProviderInput: {
        providerId:
          'H_EARTH_PREVIEW_GROUND_PROVIDER_DEFAULT',
        sourceZoneIds: [
          'ZONE_001_FOREGROUND_INSPECTION_ZONE'
        ],
        sourceObjectIds: [
          'OBJ_002_FOREGROUND_WET_SAND'
        ],
        descriptor: {
          strategy:
            'FLAT_PLANE',
          flatPlane: {
            minimumX:
              -16,
            maximumX:
              16,
            minimumZ:
              -16,
            maximumZ:
              16,
            y:
              0
          }
        }
      }
    })
  );

export const H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_SUMMARY =
  deepFreeze(
    buildPreviewSummary(
      H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE
    )
  );

export const H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_HANDOFF =
  createHEarthGeometryPreviewHandoff(
    H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE
  );


/* ==========================================================================
 * 08 · OWNERSHIP
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'DEVELOPER_VISIBLE_PROVIDER_PREVIEW_BRIDGE_ONLY',

    additivePreviewLane:
      true,
    environmentFirstCompositorPreserved:
      true,

    owns:
      deepFreeze([
        'PREVIEW_RESULT_SHAPE',
        'PREVIEW_RECEIPT_SHAPE',
        'PREVIEW_ACCOUNT_SUMMARY',
        'PREVIEW_PROVIDER_COLLECTION',
        'PREVIEW_BOUNDS_SUMMARY',
        'PREVIEW_ISSUE_SUMMARY',
        'PREVIEW_AUTHORITY_CEILING',
        'GROUND_PROVIDER_PREVIEW_BRIDGE',
        'OPTIONAL_PREVIEW_OVERLAY_HANDOFF',
        'PREVIEW_STATUS_PASSTHROUGH'
      ]),

    mustNotOwn:
      deepFreeze([
        'DIRECTIONAL_KERNEL_MATHEMATICS',
        'FORMAL_AGGREGATE_FRAME_AUTHORITY',
        'GEOMETRY_INDEX_AUTHORITY',
        'COMPOSITOR_POLICY',
        'RENDERER_MATERIALIZATION',
        'VISUAL_APPROVAL',
        'PRODUCTION_AUTHORITY',
        'PUBLIC_RELEASE_AUTHORITY',
        'ENVIRONMENT_SOURCE_TRUTH'
      ]),

    imports:
      deepFreeze([
        './geometry-kernel.js',
        './geometry-ground.js'
      ]),

    optionalFutureInputs:
      deepFreeze([
        '../environment.js',
        '../capacity.js'
      ]),

    prohibitedImports:
      deepFreeze([
        './geometry-kernel.north.js',
        './geometry-kernel.east.js',
        './geometry-kernel.south.js',
        './geometry-kernel.west.js',
        './geometry-index.js',
        '../compositor.js',
        '../renderer.js',
        '../controller.js',
        '../index.js'
      ])
  });


/* ==========================================================================
 * 09 · REQUIRED FIXTURES
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_REQUIRED_FIXTURES =
  deepFreeze([
    'PREVIEW_IMPORTS_PUBLIC_FACADE_AND_GROUND_ONLY',
    'PREVIEW_IMPORTS_NO_DIRECTIONAL_KERNELS',
    'PREVIEW_IMPORTS_NO_GEOMETRY_INDEX',
    'PREVIEW_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_INDEX',
    'PREVIEW_IMPORTS_NO_ENVIRONMENT_IN_V1',
    'PREVIEW_IMPORTS_NO_CAPACITY_IN_V1',
    'PREVIEW_AUTHORITY_HOLDS_FALSE',
    'GROUND_PROVIDER_PREVIEW_VALID',
    'GROUND_PROVIDER_PREVIEW_INELIGIBLE_PROPAGATES',
    'GROUND_PROVIDER_PREVIEW_FATAL_PROPAGATES',
    'PREVIEW_VALID_RESULT_CONTAINS_PROVIDER_PRIMITIVES',
    'PREVIEW_VALID_RESULT_BOUNDS_MERGED_FROM_PRIMITIVES',
    'PREVIEW_INELIGIBLE_RESULT_USES_EMPTY_BOUNDS',
    'PREVIEW_FATAL_RESULT_USES_EMPTY_BOUNDS',
    'PREVIEW_RECEIPT_ALIGNMENT_VALID',
    'PREVIEW_RESULT_REJECTS_FORGED_GEOMETRY_INDEX_AUTHORITY',
    'PREVIEW_RESULT_REJECTS_FORGED_COMPOSITOR_AUTHORITY',
    'PREVIEW_RESULT_REJECTS_FORGED_RENDERER_AUTHORITY',
    'PREVIEW_RESULT_REJECTS_MALFORMED_SOURCE_PROVIDER_IDS',
    'PREVIEW_RESULT_REJECTS_DUPLICATE_SOURCE_PROVIDER_IDS',
    'INVALID_PREVIEW_ROLE_RETURNS_LAWFUL_FATAL_RESULT',
    'INVALID_HANDOFF_INPUT_RETURNS_NULL',
    'INELIGIBLE_PREVIEW_HANDOFF_RETURNS_NULL',
    'FATAL_PREVIEW_HANDOFF_RETURNS_NULL',
    'DEFAULT_VALID_HANDOFF_IS_LAWFUL'
  ]);


/* ==========================================================================
 * 10 · PRE-BACKING GATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_PRE_BACKING_GATE =
  deepFreeze({
    gateId:
      'GEOMETRY_PREVIEW_PRE_BACKING_GATE_v3',

    requiredSequence:
      deepFreeze([
        'NODE_SYNTAX_CHECK',
        'NAMED_IMPORT_RESOLUTION',
        'UNUSED_IMPORT_SCAN',
        'PROHIBITED_IMPORT_SCAN',
        'STATIC_SELF_REVIEW',
        'PREVIEW_OUTPUT_SHAPE_RECHECK',
        'GROUND_PROVIDER_PREVIEW_FIXTURE',
        'AUTHORITY_HOLD_RECHECK',
        'FIXTURES_FAILED_ZERO'
      ]),

    nodeSyntaxCheckCommand:
      'node --check geometry-preview.js',

    allowedImports:
      deepFreeze([
        './geometry-kernel.js',
        './geometry-ground.js'
      ]),

    requiredFixtureCount:
      H_EARTH_3D_GEOMETRY_PREVIEW_REQUIRED_FIXTURES
        .length,

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    staticSelfReviewPerformed:
      false,
    previewOutputShapeRecheckPerformed:
      false,
    groundProviderPreviewFixturePerformed:
      false,
    authorityHoldRecheckPerformed:
      false,
    fixturesFailed:
      null,
    gatePassed:
      false
  });


/* ==========================================================================
 * 11 · STATIC SELF-REVIEW
 * ========================================================================== */

export function getHEarthGeometryPreviewStaticReview() {
  const facadeContract =
    getHEarthGeometryKernelPublicFacadeContract();

  const facadeReceipt =
    getHEarthGeometryKernelPublicFacadeReceipt();

  const groundContract =
    getHEarthGeometryGroundProviderContract();

  const groundReceipt =
    getHEarthGeometryGroundProviderReceipt();

  const groundStaticReview =
    getHEarthGeometryGroundProviderStaticReview();

  const validPreview =
    constructHEarthGeometryPreview({
      previewId:
        'STATIC_GEOMETRY_PREVIEW_VALID',
      groundProviderInput: {
        providerId:
          'STATIC_PREVIEW_GROUND_PROVIDER',
        sourceZoneIds: [
          'ZONE_GROUND_001'
        ],
        sourceObjectIds: [
          'GROUND_SURFACE_001'
        ],
        descriptor: {
          strategy:
            'FLAT_PLANE',
          flatPlane: {
            minimumX:
              -16,
            maximumX:
              16,
            minimumZ:
              -16,
            maximumZ:
              16,
            y:
              0
          }
        }
      }
    });

  const ineligiblePreview =
    constructHEarthGeometryPreview({
      previewId:
        'STATIC_GEOMETRY_PREVIEW_INELIGIBLE',
      groundProviderInput: {
        providerId:
          'STATIC_PREVIEW_GROUND_PROVIDER_INELIGIBLE',
        descriptor: {
          enabled:
            false
        }
      }
    });

  const fatalPreview =
    constructHEarthGeometryPreview({
      previewId:
        'STATIC_GEOMETRY_PREVIEW_FATAL',
      groundProviderInput: {
        providerId:
          'STATIC_PREVIEW_GROUND_PROVIDER_FATAL',
        descriptor: {
          strategy:
            'HEIGHT_FELD'
        }
      }
    });

  const invalidRolePreview =
    constructHEarthGeometryPreview({
      previewId:
        'STATIC_GEOMETRY_PREVIEW_INVALID_ROLE',
      previewRole:
        'UNSUPPORTED_PREVIEW_ROLE'
    });

  const forgedGeometryIndexAuthority = {
    ...validPreview,
    authority: {
      ...validPreview.authority,
      geometryIndexAuthority:
        true
    }
  };

  const forgedCompositorAuthority = {
    ...validPreview,
    authority: {
      ...validPreview.authority,
      compositorAuthority:
        true
    }
  };

  const forgedRendererAuthority = {
    ...validPreview,
    authority: {
      ...validPreview.authority,
      rendererAuthority:
        true
    }
  };

  const malformedSourceProviderIds = {
    ...validPreview,
    sourceProviderIds: [
      null,
      17,
      '',
      'STATIC_PREVIEW_GROUND_PROVIDER',
      'STATIC_PREVIEW_GROUND_PROVIDER'
    ]
  };

  const duplicateSourceProviderIds = {
    ...validPreview,
    sourceProviderIds: [
      'STATIC_PREVIEW_GROUND_PROVIDER',
      'STATIC_PREVIEW_GROUND_PROVIDER'
    ]
  };

  const checks = deepFreeze([
    deepFreeze({
      id:
        'PREVIEW_IMPORTS_PUBLIC_FACADE_AND_GROUND_ONLY',
      passed:
        H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.length === 2 &&
        H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.includes(
            './geometry-kernel.js'
          ) &&
        H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.includes(
            './geometry-ground.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_IMPORTS_NO_DIRECTIONAL_KERNELS',
      passed:
        !H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.some(
            (value) =>
              value === './geometry-kernel.north.js' ||
              value === './geometry-kernel.east.js' ||
              value === './geometry-kernel.south.js' ||
              value === './geometry-kernel.west.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_IMPORTS_NO_GEOMETRY_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.includes(
            './geometry-index.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.some(
            (value) =>
              value === '../compositor.js' ||
              value === '../renderer.js' ||
              value === '../controller.js' ||
              value === '../index.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_IMPORTS_NO_ENVIRONMENT_IN_V1',
      passed:
        !H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.includes(
            '../environment.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_IMPORTS_NO_CAPACITY_IN_V1',
      passed:
        !H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP
          .imports.includes(
            '../capacity.js'
          )
    }),

    deepFreeze({
      id:
        'PREVIEW_AUTHORITY_HOLDS_FALSE',
      passed:
        isPreviewAuthority(
          validPreview.authority
        )
    }),

    deepFreeze({
      id:
        'GROUND_PROVIDER_PREVIEW_VALID',
      passed:
        validPreview.valid === true &&
        validPreview.ineligible === false &&
        validPreview.fatal === false &&
        validPreview.primitives.length > 0 &&
        validPreview.providerResults.length === 1 &&
        validPreview.providerResults[0].valid === true
    }),

    deepFreeze({
      id:
        'GROUND_PROVIDER_PREVIEW_INELIGIBLE_PROPAGATES',
      passed:
        ineligiblePreview.valid === false &&
        ineligiblePreview.ineligible === true &&
        ineligiblePreview.fatal === false &&
        ineligiblePreview.primitives.length === 0 &&
        ineligiblePreview.bounds.empty === true &&
        ineligiblePreview.providerResults.length === 1 &&
        ineligiblePreview.providerResults[0].ineligible === true
    }),

    deepFreeze({
      id:
        'GROUND_PROVIDER_PREVIEW_FATAL_PROPAGATES',
      passed:
        fatalPreview.valid === false &&
        fatalPreview.ineligible === false &&
        fatalPreview.fatal === true &&
        fatalPreview.primitives.length === 0 &&
        fatalPreview.bounds.empty === true &&
        fatalPreview.providerResults.length === 1 &&
        fatalPreview.providerResults[0].fatal === true
    }),

    deepFreeze({
      id:
        'PREVIEW_VALID_RESULT_CONTAINS_PROVIDER_PRIMITIVES',
      passed:
        validPreview.primitives.length ===
          validPreview.providerResults[0]
            .primitives.length &&
        validPreview.primitives.every(
          (primitive, index) =>
            primitive ===
            validPreview.providerResults[0]
              .primitives[index]
        )
    }),

    deepFreeze({
      id:
        'PREVIEW_VALID_RESULT_BOUNDS_MERGED_FROM_PRIMITIVES',
      passed:
        doPreviewBoundsMatchPrimitives(
          validPreview
        ) === true
    }),

    deepFreeze({
      id:
        'PREVIEW_INELIGIBLE_RESULT_USES_EMPTY_BOUNDS',
      passed:
        ineligiblePreview.bounds.empty === true
    }),

    deepFreeze({
      id:
        'PREVIEW_FATAL_RESULT_USES_EMPTY_BOUNDS',
      passed:
        fatalPreview.bounds.empty === true
    }),

    deepFreeze({
      id:
        'PREVIEW_RECEIPT_ALIGNMENT_VALID',
      passed:
        doPreviewReceiptsMatchResult(
          validPreview
        ) === true
    }),

    deepFreeze({
      id:
        'PREVIEW_RESULT_REJECTS_FORGED_GEOMETRY_INDEX_AUTHORITY',
      passed:
        isHEarthGeometryPreviewResult(
          forgedGeometryIndexAuthority
        ) === false
    }),

    deepFreeze({
      id:
        'PREVIEW_RESULT_REJECTS_FORGED_COMPOSITOR_AUTHORITY',
      passed:
        isHEarthGeometryPreviewResult(
          forgedCompositorAuthority
        ) === false
    }),

    deepFreeze({
      id:
        'PREVIEW_RESULT_REJECTS_FORGED_RENDERER_AUTHORITY',
      passed:
        isHEarthGeometryPreviewResult(
          forgedRendererAuthority
        ) === false
    }),

    deepFreeze({
      id:
        'PREVIEW_RESULT_REJECTS_MALFORMED_SOURCE_PROVIDER_IDS',
      passed:
        isHEarthGeometryPreviewResult(
          malformedSourceProviderIds
        ) === false
    }),

    deepFreeze({
      id:
        'PREVIEW_RESULT_REJECTS_DUPLICATE_SOURCE_PROVIDER_IDS',
      passed:
        isHEarthGeometryPreviewResult(
          duplicateSourceProviderIds
        ) === false
    }),

    deepFreeze({
      id:
        'INVALID_PREVIEW_ROLE_RETURNS_LAWFUL_FATAL_RESULT',
      passed:
        isHEarthGeometryPreviewResult(
          invalidRolePreview
        ) === true &&
        invalidRolePreview.valid === false &&
        invalidRolePreview.ineligible === false &&
        invalidRolePreview.fatal === true &&
        invalidRolePreview.constructionStatus ===
          H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS
            .constructionStatus.FATAL
    }),

    deepFreeze({
      id:
        'INVALID_HANDOFF_INPUT_RETURNS_NULL',
      passed:
        createHEarthGeometryPreviewHandoff(
          null
        ) === null
    }),

    deepFreeze({
      id:
        'INELIGIBLE_PREVIEW_HANDOFF_RETURNS_NULL',
      passed:
        createHEarthGeometryPreviewHandoff(
          ineligiblePreview
        ) === null
    }),

    deepFreeze({
      id:
        'FATAL_PREVIEW_HANDOFF_RETURNS_NULL',
      passed:
        createHEarthGeometryPreviewHandoff(
          fatalPreview
        ) === null
    }),

    deepFreeze({
      id:
        'DEFAULT_VALID_HANDOFF_IS_LAWFUL',
      passed:
        isHEarthGeometryPreviewHandoff(
          H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_HANDOFF
        ) === true
    }),

    deepFreeze({
      id:
        'FACADE_AND_GROUND_DEPENDENCY_IDENTITIES_MATCH',
      passed:
        facadeContract?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID &&
        facadeContract?.schemaVersion ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION &&
        facadeReceipt?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID &&
        groundContract?.contractId ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID &&
        groundContract?.schemaVersion ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION &&
        groundReceipt?.contractId ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID &&
        groundStaticReview?.passed === true
    })
  ]);

  const passed =
    checks.every(
      (check) =>
        check.passed === true
    );

  return deepFreeze({
    reviewId:
      'H_EARTH_3D_GEOMETRY_PREVIEW_STATIC_SELF_REVIEW_v3',

    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,

    stepId:
      H_EARTH_3D_GEOMETRY_PREVIEW_STEP_ID,

    passed,

    status:
      passed
        ? 'STATIC_SELF_REVIEW_PASS_CANDIDATE'
        : 'STATIC_SELF_REVIEW_HOLD',

    checks,

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    previewOutputShapeRecheckPerformed:
      false,
    groundProviderPreviewFixturePerformed:
      false,
      authorityHoldRecheckPerformed:
      false,

    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });
}


/* ==========================================================================
 * 12 · RECEIPT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_PREVIEW_IMPLEMENTATION_CANDIDATE_RECEIPT_v3',

    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_PREVIEW_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_PREVIEW_SCHEMA_VERSION,

    stepId:
      H_EARTH_3D_GEOMETRY_PREVIEW_STEP_ID,

    dependencyContractIds:
      deepFreeze([
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID
      ]),

    dependencySchemaVersions:
      deepFreeze([
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION
      ]),

    dependencySourceFiles:
      deepFreeze([
        H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE
      ]),

    previewOnly:
      true,
    additivePreviewLane:
      true,
    optionalOverlay:
      true,
    environmentFirstCompositorPreserved:
      true,

    aggregateFrameAuthority:
      false,
    geometryIndexAuthority:
      false,
    compositorAuthority:
      false,
    rendererAuthority:
      false,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false,

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    nodeSyntaxCheckPerformed:
      false,
    namedImportResolutionScanPerformed:
      false,
    unusedImportScanPerformed:
      false,
    prohibitedImportScanPerformed:
      false,
    staticSelfReviewPerformed:
      false,
    previewOutputShapeRecheckPerformed:
      false,
    groundProviderPreviewFixturePerformed:
      false,
    authorityHoldRecheckPerformed:
      false,

    localAdmission:
      false,

    nextRequired:
      'NODE_SYNTAX_CHECK_THEN_NAMED_IMPORT_RESOLUTION_THEN_UNUSED_IMPORT_SCAN_THEN_PROHIBITED_IMPORT_SCAN_THEN_STATIC_SELF_REVIEW_THEN_PREVIEW_OUTPUT_SHAPE_RECHECK_THEN_GROUND_PROVIDER_PREVIEW_FIXTURE_THEN_AUTHORITY_HOLD_RECHECK_THEN_FIXTURES_FAILED_ZERO'
  });


/* ==========================================================================
 * 13 · PUBLIC API CANDIDATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-preview.js',

    classification:
      'PREVIEW_PUBLIC_CANDIDATE',

    symbols:
      deepFreeze([
        'H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID',
        'H_EARTH_3D_GEOMETRY_PREVIEW_SCHEMA_VERSION',
        'H_EARTH_3D_GEOMETRY_PREVIEW_SOURCE_FILE',
        'H_EARTH_3D_GEOMETRY_PREVIEW_STEP_ID',
        'H_EARTH_3D_GEOMETRY_PREVIEW_STATUS',
        'H_EARTH_3D_GEOMETRY_PREVIEW_ENUMS',
        'H_EARTH_3D_GEOMETRY_PREVIEW_DISPLAY_POLICY',
        'H_EARTH_3D_GEOMETRY_PREVIEW_INTEROP',
        'H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE',
        'H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_SUMMARY',
        'H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_HANDOFF',
        'H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP',
        'H_EARTH_3D_GEOMETRY_PREVIEW_REQUIRED_FIXTURES',
        'H_EARTH_3D_GEOMETRY_PREVIEW_PRE_BACKING_GATE',
        'H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT',
        'H_EARTH_3D_GEOMETRY_PREVIEW_PUBLIC_API_CANDIDATE',
        'H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT',
        'isHEarthGeometryPreviewReceipt',
        'isHEarthGeometryPreviewAccount',
        'isHEarthGeometryPreviewResult',
        'isHEarthGeometryPreviewHandoff',
        'constructHEarthGeometryPreview',
        'createHEarthGeometryPreviewHandoff',
        'getHEarthGeometryPreviewStaticReview',
        'getHEarthGeometryPreviewReceipt',
        'getHEarthGeometryPreviewContract',
        'getHEarthGeometryPreviewDefaultOccurrence',
        'getHEarthGeometryPreviewDefaultSummary',
        'getHEarthGeometryPreviewDefaultHandoff'
      ]),

    collisionStatus:
      'NOT_YET_REVIEWED',

    implementationStatus:
      'PREVIEW_INTEGRATION_CANDIDATE',

    conformanceStatus:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 14 · CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_PREVIEW_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_PREVIEW_SOURCE_FILE,

    stepId:
      H_EARTH_3D_GEOMETRY_PREVIEW_STEP_ID,

    status:
      H_EARTH_3D_GEOMETRY_PREVIEW_STATUS,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    displayPolicy:
      H_EARTH_3D_GEOMETRY_PREVIEW_DISPLAY_POLICY,

    interop:
      H_EARTH_3D_GEOMETRY_PREVIEW_INTEROP,

    defaultOccurrence:
      H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE,

    defaultSummary:
      H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_SUMMARY,

    ownership:
      H_EARTH_3D_GEOMETRY_PREVIEW_OWNERSHIP,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_PREVIEW_REQUIRED_FIXTURES,

    preBackingGate:
      H_EARTH_3D_GEOMETRY_PREVIEW_PRE_BACKING_GATE,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_PREVIEW_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT,

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    localAdmission:
      false,

    previewOnly:
      true,
    additivePreviewLane:
      true,
    optionalOverlay:
      true,
    environmentFirstCompositorPreserved:
      true,

    aggregateFrameAuthority:
      false,
    geometryIndexAuthority:
      false,
    compositorAuthority:
      false,
    rendererAuthority:
      false,
    visualApproval:
      false,
    productionAuthority:
      false,
    publicReleaseAuthority:
      false
  });


/* ==========================================================================
 * 15 · ACCESSORS
 * ========================================================================== */

export function getHEarthGeometryPreviewReceipt() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT;
}

export function getHEarthGeometryPreviewContract() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT;
}

export function getHEarthGeometryPreviewDefaultOccurrence() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_OCCURRENCE;
}

export function getHEarthGeometryPreviewDefaultSummary() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_SUMMARY;
}

export function getHEarthGeometryPreviewDefaultHandoff() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_DEFAULT_HANDOFF;
}

export default H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT;
