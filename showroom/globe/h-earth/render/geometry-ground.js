/**
 * /showroom/globe/h-earth/render/geometry-ground.js
 * COMPLETE PROVIDER FILE
 *
 * CONTRACT:
 * H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1
 *
 * DEPENDS ON:
 * H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_FILE_BIRTH_STEP_034O_4F_STABLE_DIRECTIONAL_KERNEL_EXPORT_SURFACE_v1
 *
 * STATUS:
 * PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_IMPLEMENTATION_CANDIDATE
 *
 * PURPOSE:
 * PROVIDER-LOCAL GROUND CONSTRUCTION ADAPTER OVER THE CLOSED PUBLIC GEOMETRY FACADE.
 *
 * IMPORT LAW:
 * THIS FILE IMPORTS ONLY:
 * - ./geometry-kernel.js
 *
 * THIS FILE DOES NOT:
 * - import directional kernels directly
 * - import geometry-index.js
 * - import compositor.js
 * - import renderer.js
 * - import controller.js
 * - import index.js
 * - own directional mathematics
 * - own descriptor analysis
 * - own aggregate-frame authority
 * - own compositor or renderer authority
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
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,

  createHEarthGeometryIssue,
  sortHEarthGeometryIssues,
  hasHEarthBlockingIssues,

  isHEarthFiniteNumber,
  isHEarthNonNegativeSafeInteger,
  isHEarthPositiveSafeInteger,
  isHEarthNonEmptyString,

  createHEarthVector3,
  isHEarthVector3,

  createHEarthIdentityMatrix4,
  isHEarthMatrix4,

  isHEarthAABB3D,
  mergeHEarthGeometryBounds,
  deriveHEarthGeometryToleranceContext,
  isHEarthGeometryToleranceContext,
  approximatelyEqualHEarthVector3,
  approximatelyEqualHEarthNumber,

  constructHEarthHeightFieldMesh,
  constructHEarthTriangleMesh,

  isHEarthNeutralPrimitiveRecord,

  getHEarthGeometryKernelPublicFacadeContract,
  getHEarthGeometryKernelPublicFacadeReceipt
} from './geometry-kernel.js';


/* ==========================================================================
 * 01 · CONTRACT IDENTITY
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION =
  1;

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-ground.js';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID =
  'STEP_034O_5G_GEOMETRY_GROUND_PROVIDER_LOCAL_CONSTRUCTION_ADAPTER';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATUS =
  'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_IMPLEMENTATION_CANDIDATE';


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


function createGroundProviderIssue(
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
        'geometry-ground.js'
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


function mergeProviderBounds(
  boundsList = [],
  toleranceContext
) {
  if (toleranceContext !== undefined) {
    return mergeHEarthGeometryBounds(
      boundsList,
      toleranceContext
    );
  }

  return mergeHEarthGeometryBounds(
    boundsList
  );
}


function getEmptyProviderBounds() {
  return mergeHEarthGeometryBounds([]);
}


function createGroundProviderAuthority() {
  return deepFreeze({
    providerLocalConstructionAdapter:
      true,

    providerAuthority:
      'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_ONLY',

    neutralPrimitiveOnly:
      true,

    admittedPrimitiveAuthority:
      false,

    aggregateFrameAuthority:
      false,

    geometryIndexAuthority:
      false,

    compositorIntegrationAuthority:
      false,

    rendererIntegrationAuthority:
      false,

    visualApproval:
      false,

    productionAuthority:
      false,

    publicReleaseAuthority:
      false
  });
}


function isGroundProviderAuthority(
  authority
) {
  return (
    isPlainObject(authority) &&
    authority
      .providerLocalConstructionAdapter ===
      true &&
    authority.providerAuthority ===
      'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_ONLY' &&
    authority.neutralPrimitiveOnly ===
      true &&
    authority.admittedPrimitiveAuthority ===
      false &&
    authority.aggregateFrameAuthority ===
      false &&
    authority.geometryIndexAuthority ===
      false &&
    authority
      .compositorIntegrationAuthority ===
      false &&
    authority
      .rendererIntegrationAuthority ===
      false &&
    authority.visualApproval ===
      false &&
    authority.productionAuthority ===
      false &&
    authority.publicReleaseAuthority ===
      false
  );
}


function resolveGroundConstructionStatus({
  valid,
  ineligible,
  fatal
}) {
  if (
    valid === true &&
    ineligible !== true &&
    fatal !== true
  ) {
    return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus
      .VALID;
  }

  if (
    valid !== true &&
    ineligible === true &&
    fatal !== true
  ) {
    return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus
      .INELIGIBLE;
  }

  return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
    .constructionStatus
    .FATAL;
}


function createStaticGroundHeightFieldDescriptor() {
  return deepFreeze({
    descriptorId:
      'STATIC_GROUND_PROVIDER_HEIGHT_FIELD_DESCRIPTOR',

    descriptorType:
      'HEIGHT_FIELD',

    evaluator:
      () => 0,

    metadata:
      null,

    xDomain:
      deepFreeze({
        minimum:
          -8,
        maximum:
          8,
        topology:
          'OPEN'
      }),

    zDomain:
      deepFreeze({
        minimum:
          -8,
        maximum:
          8,
        topology:
          'OPEN'
      })
  });
}


function areGroundBoundsEquivalent(
  left,
  right
) {
  if (
    !isHEarthAABB3D(left) ||
    !isHEarthAABB3D(right)
  ) {
    return false;
  }

  if (
    left.empty === true ||
    right.empty === true
  ) {
    return (
      left.empty === true &&
      right.empty === true
    );
  }

  const merged =
    mergeHEarthGeometryBounds([
      left,
      right
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

  return (
    approximatelyEqualHEarthVector3(
      left.minimum,
      right.minimum,
      context
    ) &&
    approximatelyEqualHEarthVector3(
      left.maximum,
      right.maximum,
      context
    ) &&
    approximatelyEqualHEarthVector3(
      left.center,
      right.center,
      context
    ) &&
    approximatelyEqualHEarthVector3(
      left.size,
      right.size,
      context
    ) &&
    approximatelyEqualHEarthVector3(
      left.halfExtent,
      right.halfExtent,
      context
    ) &&
    approximatelyEqualHEarthNumber(
      left.diagonalLength,
      right.diagonalLength,
      {
        absoluteTolerance:
          context.lengthTolerance,
        relativeTolerance:
          context.scalarRelativeTolerance
      }
    )
  );
}


function doGroundProviderBoundsMatchPrimitives(
  record
) {
  if (
    !Array.isArray(record?.primitives) ||
    record.primitives.length === 0
  ) {
    return false;
  }

  const derivedBounds =
    mergeHEarthGeometryBounds(
      record.primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  return areGroundBoundsEquivalent(
    record.bounds,
    derivedBounds
  );
}


function buildResultInconsistencyIssue(
  message,
  details = null
) {
  return createGroundProviderIssue(
    'GROUND_PROVIDER_RESULT_INCONSISTENT',
    'ERROR',
    message,
    details
  );
}


/* ==========================================================================
 * 03 · ENUMERATIONS
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS =
  deepFreeze({
    providerRole: deepFreeze({
      GROUND:
        'GROUND'
    }),

    groundStrategy: deepFreeze({
      AUTO:
        'AUTO',

      FLAT_PLANE:
        'FLAT_PLANE',

      HEIGHT_FIELD:
        'HEIGHT_FIELD',

      EXPLICIT_TRIANGLE_MESH:
        'EXPLICIT_TRIANGLE_MESH'
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
 * 04 · OUTPUT SHAPE
 * ========================================================================== */

export function isHEarthGroundProviderReceipt(
  receipt
) {
  return (
    isPlainObject(receipt) &&
    receipt.recordType ===
      'H_EARTH_GROUND_PROVIDER_RECEIPT' &&
    isHEarthNonEmptyString(
      receipt.receiptId
    ) &&
    isHEarthNonEmptyString(
      receipt.providerId
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole,
      receipt.providerRole
    ) &&
    isHEarthNonEmptyString(
      receipt.primitiveId
    ) &&
    isHEarthNonEmptyString(
      receipt.primitiveType
    ) &&
    typeof receipt.valid ===
      'boolean' &&
    receipt.valid ===
      (
        receipt.issueCounts
          ?.blockingCount === 0
      ) &&
    typeof receipt.openNeutralMesh ===
      'boolean' &&
    isNormalizedStringIdArray(
      receipt.sourceZoneIds
    ) &&
    isNormalizedStringIdArray(
      receipt.sourceObjectIds
    ) &&
    isIssueCountRecord(
      receipt.issueCounts
    ) &&
    (
      receipt.strategy === null ||
      enumIncludes(
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy,
        receipt.strategy
      )
    )
  );
}


export function isHEarthGroundProviderAccount(
  account
) {
  return (
    isPlainObject(account) &&
    isHEarthNonNegativeSafeInteger(
      account.requestedPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.constructedPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.validPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.heldPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.neutralPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.admittedPrimitiveCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.issueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.blockingIssueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.fatalIssueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.errorIssueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.warningIssueCount
    ) &&
    isHEarthNonNegativeSafeInteger(
      account.infoIssueCount
    ) &&
    typeof account.boundsPresent ===
      'boolean' &&
    typeof account.emptyBounds ===
      'boolean' &&
    (
      account.strategy === null ||
      enumIncludes(
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy,
        account.strategy
      )
    )
  );
}


function areGroundReceiptsAlignedWithPrimitives(
  record
) {
  if (
    !Array.isArray(record?.primitives) ||
    !Array.isArray(record?.receipts)
  ) {
    return false;
  }

  if (
    record.receipts.length !==
    record.primitives.length
  ) {
    return false;
  }

  return record.receipts.every(
    (receipt, index) =>
      isHEarthGroundProviderReceipt(
        receipt
      ) &&
      isHEarthNeutralPrimitiveRecord(
        record.primitives[index]
      ) &&
      receipt.providerId ===
        record.providerId &&
      receipt.providerRole ===
        record.providerRole &&
      receipt.primitiveId ===
        record.primitives[index]
          .primitiveId &&
      receipt.primitiveType ===
        record.primitives[index]
          .primitiveType &&
      areStringArraysEquivalent(
        receipt.sourceZoneIds,
        record.sourceZoneIds
      ) &&
      areStringArraysEquivalent(
        receipt.sourceObjectIds,
        record.sourceObjectIds
      )
  );
}


function doesGroundProviderAccountMatchIssues(
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
      issueCounts.blockingCount &&
    record.account
      .fatalIssueCount ===
      issueCounts.fatalCount &&
    record.account
      .errorIssueCount ===
      issueCounts.errorCount &&
    record.account
      .warningIssueCount ===
      issueCounts.warningCount &&
    record.account
      .infoIssueCount ===
      issueCounts.infoCount
  );
}


function doesGroundProviderStatusLawHold(
  record
) {
  const status =
    record.constructionStatus;

  if (
    status ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.VALID
  ) {
    return (
      record.valid === true &&
      record.ineligible === false &&
      record.fatal === false &&
      record.primitives.length > 0 &&
      record.bounds.empty === false &&
      record.receipts.length ===
        record.primitives.length &&
      !hasHEarthBlockingIssues(
        record.issues
      ) &&
      doGroundProviderBoundsMatchPrimitives(
        record
      ) &&
      record.account
        .requestedPrimitiveCount ===
        record.primitives.length &&
      record.account
        .constructedPrimitiveCount ===
        record.primitives.length &&
      record.account
        .validPrimitiveCount ===
        record.primitives.length &&
      record.account
        .neutralPrimitiveCount ===
        record.primitives.length &&
      record.account
        .admittedPrimitiveCount ===
        0 &&
      record.account
        .heldPrimitiveCount ===
        0 &&
      record.account.boundsPresent ===
        true &&
      record.account.emptyBounds ===
        false &&
      areGroundReceiptsAlignedWithPrimitives(
        record
      ) &&
      record.receipts.every(
        (receipt) =>
          receipt.valid === true
      )
    );
  }

  if (
    status ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.INELIGIBLE
  ) {
    return (
      record.valid === false &&
      record.ineligible === true &&
      record.fatal === false &&
      record.primitives.length === 0 &&
      record.receipts.length === 0 &&
      record.bounds.empty === true &&
      !hasHEarthBlockingIssues(
        record.issues
      ) &&
      record.account
        .constructedPrimitiveCount ===
        0 &&
      record.account
        .validPrimitiveCount ===
        0 &&
      record.account
        .neutralPrimitiveCount ===
        0 &&
      record.account
        .admittedPrimitiveCount ===
        0 &&
      record.account.boundsPresent ===
        true &&
      record.account.emptyBounds ===
        true
    );
  }

  return (
    status ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.FATAL &&
    record.valid === false &&
    record.ineligible === false &&
    record.fatal === true &&
    record.primitives.length === 0 &&
    record.receipts.length === 0 &&
    record.bounds.empty === true &&
    hasHEarthBlockingIssues(
      record.issues
    ) &&
    record.account
      .constructedPrimitiveCount ===
      0 &&
    record.account
      .validPrimitiveCount ===
      0 &&
    record.account
      .neutralPrimitiveCount ===
      0 &&
    record.account
      .admittedPrimitiveCount ===
      0 &&
    record.account.boundsPresent ===
      true &&
    record.account.emptyBounds ===
      true
  );
}


export function isHEarthGroundProviderResult(
  record
) {
  return (
    isPlainObject(record) &&
    record.recordType ===
      'H_EARTH_GROUND_PROVIDER_RESULT' &&
    isHEarthNonEmptyString(
      record.providerId
    ) &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole,
      record.providerRole
    ) &&
    record.coordinateFrame ===
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME &&
    enumIncludes(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus,
      record.constructionStatus
    ) &&
    isNormalizedStringIdArray(
      record.sourceZoneIds
    ) &&
    isNormalizedStringIdArray(
      record.sourceObjectIds
    ) &&
    Array.isArray(
      record.primitives
    ) &&
    record.primitives.every(
      isHEarthNeutralPrimitiveRecord
    ) &&
    isHEarthAABB3D(record.bounds) &&
    isHEarthGroundProviderAccount(
      record.account
    ) &&
    Array.isArray(record.issues) &&
    Array.isArray(record.receipts) &&
    record.receipts.every(
      isHEarthGroundProviderReceipt
    ) &&
    isGroundProviderAuthority(
      record.authority
    ) &&
    doesGroundProviderAccountMatchIssues(
      record
    ) &&
    doesGroundProviderStatusLawHold(
      record
    )
  );
}


function buildGroundProviderAccount({
  requestedPrimitiveCount,
  primitives,
  bounds,
  issues,
  strategy
}) {
  const issueCounts =
    countIssuesBySeverity(issues);

  const validPrimitiveCount =
    ensureArray(primitives)
      .filter(
        isHEarthNeutralPrimitiveRecord
      )
      .length;

  const constructedPrimitiveCount =
    ensureArray(primitives).length;

  const resolvedRequestedPrimitiveCount =
    isHEarthNonNegativeSafeInteger(
      requestedPrimitiveCount
    )
      ? requestedPrimitiveCount
      : 0;

  return deepFreeze({
    requestedPrimitiveCount:
      resolvedRequestedPrimitiveCount,

    constructedPrimitiveCount,

    validPrimitiveCount,

    heldPrimitiveCount:
      Math.max(
        0,
        resolvedRequestedPrimitiveCount -
          validPrimitiveCount
      ),

    neutralPrimitiveCount:
      validPrimitiveCount,

    admittedPrimitiveCount:
      0,

    issueCount:
      issueCounts.totalCount,

    blockingIssueCount:
      issueCounts.blockingCount,

    fatalIssueCount:
      issueCounts.fatalCount,

    errorIssueCount:
      issueCounts.errorCount,

    warningIssueCount:
      issueCounts.warningCount,

    infoIssueCount:
      issueCounts.infoCount,

    boundsPresent:
      isHEarthAABB3D(bounds),

    emptyBounds:
      isHEarthAABB3D(bounds)
        ? bounds.empty === true
        : false,

    strategy:
      strategy ?? null
  });
}


function buildGroundProviderReceipt({
  providerId,
  providerRole,
  primitiveRecord,
  issues,
  sourceZoneIds,
  sourceObjectIds,
  strategy
}) {
  if (
    !isHEarthNeutralPrimitiveRecord(
      primitiveRecord
    )
  ) {
    return null;
  }

  const issueCounts =
    countIssuesBySeverity(issues);

  return deepFreeze({
    recordType:
      'H_EARTH_GROUND_PROVIDER_RECEIPT',

    receiptId:
      `${providerId}:${primitiveRecord.primitiveId}:provider-receipt`,

    providerId,

    providerRole,

    primitiveId:
      primitiveRecord.primitiveId,

    primitiveType:
      primitiveRecord.primitiveType,

    valid:
      issueCounts.blockingCount === 0,

    openNeutralMesh:
      primitiveRecord
        .geometry
        ?.metadata
        ?.openNeutralMeshConstructionValid === true,

    sourceZoneIds:
      normalizeStringIdArray(
        sourceZoneIds
      ),

    sourceObjectIds:
      normalizeStringIdArray(
        sourceObjectIds
      ),

    issueCounts,

    strategy:
      strategy ?? null
  });
}


function createHEarthGroundProviderResult({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  valid,
  ineligible,
  fatal,
  primitives = [],
  bounds,
  issues = [],
  receipts = [],
  strategy = null,
  requestedPrimitiveCount = 0
}) {
  let normalizedIssues =
    sortHEarthGeometryIssues(
      ensureArray(issues)
    );

  let constructionStatus =
    resolveGroundConstructionStatus({
      valid,
      ineligible,
      fatal
    });

  if (
    constructionStatus !==
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.VALID &&
    hasHEarthBlockingIssues(
      normalizedIssues
    ) === false &&
    constructionStatus ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.FATAL
  ) {
    normalizedIssues =
      sortHEarthGeometryIssues([
        ...normalizedIssues,
        buildResultInconsistencyIssue(
          'A fatal ground-provider result must carry at least one blocking issue.'
        )
      ]);
  }

  if (
    constructionStatus ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.VALID &&
    hasHEarthBlockingIssues(
      normalizedIssues
    )
  ) {
    normalizedIssues =
      sortHEarthGeometryIssues([
        ...normalizedIssues,
        buildResultInconsistencyIssue(
          'A ground-provider result marked VALID cannot retain blocking issues.'
        )
      ]);

    constructionStatus =
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.FATAL;
  }

  if (
    constructionStatus ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.INELIGIBLE &&
    hasHEarthBlockingIssues(
      normalizedIssues
    )
  ) {
    normalizedIssues =
      sortHEarthGeometryIssues([
        ...normalizedIssues,
        buildResultInconsistencyIssue(
          'A ground-provider result marked INELIGIBLE cannot retain blocking issues.'
        )
      ]);

    constructionStatus =
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.FATAL;
  }

  let normalizedPrimitives =
    ensureArray(primitives)
      .filter(
        isHEarthNeutralPrimitiveRecord
      );

  let normalizedReceipts =
    ensureArray(receipts)
      .filter(
        isHEarthGroundProviderReceipt
      );

  let resolvedBounds =
    isHEarthAABB3D(bounds)
      ? bounds
      : getEmptyProviderBounds();

  if (
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.VALID
  ) {
    if (
      normalizedPrimitives.length === 0
    ) {
      normalizedIssues =
        sortHEarthGeometryIssues([
          ...normalizedIssues,
          buildResultInconsistencyIssue(
            'A VALID ground-provider result must contain at least one neutral primitive.'
          )
        ]);

      constructionStatus =
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .constructionStatus.FATAL;
    }

    if (
      !isHEarthAABB3D(
        resolvedBounds
      ) ||
      resolvedBounds.empty === true
    ) {
      normalizedIssues =
        sortHEarthGeometryIssues([
          ...normalizedIssues,
          buildResultInconsistencyIssue(
            'A VALID ground-provider result must contain a nonempty AABB bounds object.'
          )
        ]);

      constructionStatus =
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .constructionStatus.FATAL;
    }

    if (
      normalizedReceipts.length !==
      normalizedPrimitives.length
    ) {
      normalizedIssues =
        sortHEarthGeometryIssues([
          ...normalizedIssues,
          buildResultInconsistencyIssue(
            'A VALID ground-provider result must emit one receipt per neutral primitive.'
          )
        ]);

      constructionStatus =
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .constructionStatus.FATAL;
    }
  }

  if (
    constructionStatus !==
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.VALID
  ) {
    normalizedPrimitives = [];
    normalizedReceipts = [];
    resolvedBounds =
      getEmptyProviderBounds();
  }

  if (
    constructionStatus ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.FATAL &&
    hasHEarthBlockingIssues(
      normalizedIssues
    ) === false
  ) {
    normalizedIssues =
      sortHEarthGeometryIssues([
        ...normalizedIssues,
        buildResultInconsistencyIssue(
          'A FATAL ground-provider result must carry a blocking issue after normalization.'
        )
      ]);
  }

  const normalizedValid =
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.VALID;

  const normalizedIneligible =
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.INELIGIBLE;

  const normalizedFatal =
    constructionStatus ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .constructionStatus.FATAL;

  const normalizedRequestedPrimitiveCount =
    normalizedValid
      ? normalizedPrimitives.length
      : (
          isHEarthNonNegativeSafeInteger(
            requestedPrimitiveCount
          )
            ? requestedPrimitiveCount
            : 0
        );

  return deepFreeze({
    recordType:
      'H_EARTH_GROUND_PROVIDER_RESULT',

    providerId,

    providerRole,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    constructionStatus,

    valid:
      normalizedValid,

    ineligible:
      normalizedIneligible,

    fatal:
      normalizedFatal,

    sourceZoneIds:
      normalizeStringIdArray(
        sourceZoneIds
      ),

    sourceObjectIds:
      normalizeStringIdArray(
        sourceObjectIds
      ),

    primitives:
      deepFreeze(
        normalizedPrimitives.slice()
      ),

    bounds:
      resolvedBounds,

    account:
      buildGroundProviderAccount({
        requestedPrimitiveCount:
          normalizedRequestedPrimitiveCount,
        primitives:
          normalizedPrimitives,
        bounds:
          resolvedBounds,
        issues:
          normalizedIssues,
        strategy
      }),

    issues:
      normalizedIssues,

    receipts:
      deepFreeze(
        normalizedReceipts.slice()
      ),

    authority:
      createGroundProviderAuthority()
  });
}


/* ==========================================================================
 * 05 · DESCRIPTOR RECOGNITION
 * ========================================================================== */

function createProviderDefaultDescriptor() {
  return deepFreeze({
    enabled:
      true,

    strategy:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy.AUTO,

    primitiveId:
      null,

    semanticRole:
      'GROUND_SURFACE',

    materialHint:
      null,

    metadata:
      null,

    flatPlane:
      null,

    heightField:
      null,

    explicitTriangleMesh:
      null
  });
}


function isValidTriangleIndexArray(
  indices,
  vertexCount
) {
  return (
    Array.isArray(indices) &&
    indices.length >= 3 &&
    indices.length % 3 === 0 &&
    indices.every(
      (index) =>
        isHEarthNonNegativeSafeInteger(
          index
        ) &&
        index < vertexCount
    )
  );
}


function areFiniteVector3Array(values) {
  return (
    Array.isArray(values) &&
    values.length > 0 &&
    values.every(
      isHEarthVector3
    )
  );
}


function hasFlatPlanePayload(
  flatPlane
) {
  return (
    isPlainObject(flatPlane) &&
    isHEarthFiniteNumber(
      flatPlane.minimumX
    ) &&
    isHEarthFiniteNumber(
      flatPlane.maximumX
    ) &&
    isHEarthFiniteNumber(
      flatPlane.minimumZ
    ) &&
    isHEarthFiniteNumber(
      flatPlane.maximumZ
    ) &&
    isHEarthFiniteNumber(
      flatPlane.y
    ) &&
    flatPlane.minimumX <
      flatPlane.maximumX &&
    flatPlane.minimumZ <
      flatPlane.maximumZ &&
    (
      flatPlane.transform === undefined ||
      isHEarthMatrix4(
        flatPlane.transform
      )
    )
  );
}


function hasHeightFieldPayload(
  heightField
) {
  return (
    isPlainObject(heightField) &&
    heightField.descriptor !==
      undefined &&
    heightField.descriptor !==
      null &&
    isHEarthPositiveSafeInteger(
      heightField.xSampleCount
    ) &&
    heightField.xSampleCount >= 2 &&
    isHEarthPositiveSafeInteger(
      heightField.zSampleCount
    ) &&
    heightField.zSampleCount >= 2 &&
    (
      heightField.transform === undefined ||
      isHEarthMatrix4(
        heightField.transform
      )
    )
  );
}


function hasExplicitTriangleMeshPayload(
  explicitTriangleMesh
) {
  return (
    isPlainObject(
      explicitTriangleMesh
    ) &&
    areFiniteVector3Array(
      explicitTriangleMesh.vertices
    ) &&
    isValidTriangleIndexArray(
      explicitTriangleMesh.indices,
      explicitTriangleMesh.vertices
        .length
    ) &&
    (
      explicitTriangleMesh.transform === undefined ||
      isHEarthMatrix4(
        explicitTriangleMesh.transform
      )
    )
  );
}


function resolveGroundStrategy(
  descriptor
) {
  if (!isPlainObject(descriptor)) {
    return deepFreeze({
      valid:
        false,
      ineligible:
        true,
      fatal:
        false,
      strategy:
        null,
      issues:
        deepFreeze([
          createGroundProviderIssue(
            'GROUND_DESCRIPTOR_MISSING',
            'WARNING',
            'Ground provider descriptor is absent. The provider remains ineligible without a lawful construction source.'
          )
        ])
    });
  }

  if (descriptor.enabled === false) {
    return deepFreeze({
      valid:
        false,
      ineligible:
        true,
      fatal:
        false,
      strategy:
        null,
      issues:
        deepFreeze([
          createGroundProviderIssue(
            'GROUND_PROVIDER_DISABLED',
            'INFO',
            'Ground provider is explicitly disabled.'
          )
        ])
    });
  }

  const strategyWasOmitted =
    descriptor.strategy ===
      undefined ||
    descriptor.strategy ===
      null;

  if (
    !strategyWasOmitted &&
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy,
      descriptor.strategy
    )
  ) {
    return deepFreeze({
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      strategy:
        null,
      issues:
        deepFreeze([
          createGroundProviderIssue(
            'GROUND_PROVIDER_STRATEGY_INVALID',
            'ERROR',
            'Ground provider received an unsupported explicit construction strategy.',
            {
              strategy:
                descriptor.strategy
            }
          )
        ])
    });
  }

  const requestedStrategy =
    strategyWasOmitted
      ? H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy.AUTO
      : descriptor.strategy;

  if (
    requestedStrategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.FLAT_PLANE
  ) {
    return hasFlatPlanePayload(
      descriptor.flatPlane
    )
      ? deepFreeze({
          valid:
            true,
          ineligible:
            false,
          fatal:
            false,
          strategy:
            requestedStrategy,
          issues:
            deepFreeze([])
        })
      : deepFreeze({
          valid:
            false,
          ineligible:
            false,
          fatal:
            true,
          strategy:
            null,
          issues:
            deepFreeze([
              createGroundProviderIssue(
                'GROUND_FLAT_PLANE_DESCRIPTOR_INVALID',
                'ERROR',
                'Ground flat-plane strategy was requested but the flat-plane payload is malformed.'
              )
            ])
        });
  }

  if (
    requestedStrategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.HEIGHT_FIELD
  ) {
    return hasHeightFieldPayload(
      descriptor.heightField
    )
      ? deepFreeze({
          valid:
            true,
          ineligible:
            false,
          fatal:
            false,
          strategy:
            requestedStrategy,
          issues:
            deepFreeze([])
        })
      : deepFreeze({
          valid:
            false,
          ineligible:
            false,
          fatal:
            true,
          strategy:
            null,
          issues:
            deepFreeze([
              createGroundProviderIssue(
                'GROUND_HEIGHT_FIELD_DESCRIPTOR_INVALID',
                'ERROR',
                'Ground height-field strategy was requested but the height-field payload is malformed.'
              )
            ])
        });
  }

  if (
    requestedStrategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.EXPLICIT_TRIANGLE_MESH
  ) {
    return hasExplicitTriangleMeshPayload(
      descriptor.explicitTriangleMesh
    )
      ? deepFreeze({
          valid:
            true,
          ineligible:
            false,
          fatal:
            false,
          strategy:
            requestedStrategy,
          issues:
            deepFreeze([])
        })
      : deepFreeze({
          valid:
            false,
          ineligible:
            false,
          fatal:
            true,
          strategy:
            null,
          issues:
            deepFreeze([
              createGroundProviderIssue(
                'GROUND_EXPLICIT_TRIANGLE_MESH_DESCRIPTOR_INVALID',
                'ERROR',
                'Ground explicit-triangle-mesh strategy was requested but the explicit mesh payload is malformed.'
              )
            ])
        });
  }

  if (
    hasHeightFieldPayload(
      descriptor.heightField
    )
  ) {
    return deepFreeze({
      valid:
        true,
      ineligible:
        false,
      fatal:
        false,
      strategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy.HEIGHT_FIELD,
      issues:
        deepFreeze([])
    });
  }

  if (
    hasExplicitTriangleMeshPayload(
      descriptor.explicitTriangleMesh
    )
  ) {
    return deepFreeze({
      valid:
        true,
      ineligible:
        false,
      fatal:
        false,
      strategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy
          .EXPLICIT_TRIANGLE_MESH,
      issues:
        deepFreeze([])
    });
  }

  if (
    hasFlatPlanePayload(
      descriptor.flatPlane
    )
  ) {
    return deepFreeze({
      valid:
        true,
      ineligible:
        false,
      fatal:
        false,
      strategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy.FLAT_PLANE,
      issues:
        deepFreeze([])
    });
  }

  return deepFreeze({
    valid:
      false,
    ineligible:
      true,
    fatal:
      false,
    strategy:
      null,
    issues:
      deepFreeze([
        createGroundProviderIssue(
          'GROUND_PROVIDER_NO_LAWFUL_SOURCE',
          'WARNING',
          'Ground provider has no lawful flat-plane, height-field, or explicit-triangle-mesh source.'
        )
      ])
  });
}


function resolveGroundToleranceContext(
  toleranceContext
) {
  if (toleranceContext === undefined) {
    return deepFreeze({
      valid:
        true,
      toleranceContext:
        undefined,
      issues:
        deepFreeze([])
    });
  }

  return isHEarthGeometryToleranceContext(
    toleranceContext
  )
    ? deepFreeze({
        valid:
          true,
        toleranceContext,
        issues:
          deepFreeze([])
      })
    : deepFreeze({
        valid:
          false,
        toleranceContext:
          null,
        issues:
          deepFreeze([
            createGroundProviderIssue(
              'GROUND_PROVIDER_TOLERANCE_CONTEXT_INVALID',
              'ERROR',
              'Ground provider explicit tolerance context is invalid.'
            )
          ])
      });
}


function resolvePrimitiveId(
  providerId,
  descriptor
) {
  return isHEarthNonEmptyString(
    descriptor?.primitiveId
  )
    ? descriptor.primitiveId.trim()
    : `${providerId}:ground-surface`;
}


function resolvePrimitiveTransform(
  primary,
  fallback
) {
  if (isHEarthMatrix4(primary)) {
    return primary;
  }

  if (isHEarthMatrix4(fallback)) {
    return fallback;
  }

  return createHEarthIdentityMatrix4();
}


/* ==========================================================================
 * 06 · STRATEGY CONSTRUCTION HELPERS
 * ========================================================================== */

function constructFlatPlaneGroundPrimitive({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor,
  toleranceContext
}) {
  const flatPlane =
    descriptor.flatPlane;

  const primitiveId =
    resolvePrimitiveId(
      providerId,
      descriptor
    );

  const transform =
    resolvePrimitiveTransform(
      flatPlane?.transform,
      descriptor?.transform
    );

  const vertices = [
    createHEarthVector3(
      flatPlane.minimumX,
      flatPlane.y,
      flatPlane.minimumZ
    ),
    createHEarthVector3(
      flatPlane.maximumX,
      flatPlane.y,
      flatPlane.minimumZ
    ),
    createHEarthVector3(
      flatPlane.maximumX,
      flatPlane.y,
      flatPlane.maximumZ
    ),
    createHEarthVector3(
      flatPlane.minimumX,
      flatPlane.y,
      flatPlane.maximumZ
    )
  ];

  if (
    !vertices.every(
      isHEarthVector3
    )
  ) {
    return deepFreeze({
      valid:
        false,
      primitiveRecord:
        null,
      geometry:
        null,
      openNeutralMesh:
        false,
      issues:
        deepFreeze([
          createGroundProviderIssue(
            'GROUND_FLAT_PLANE_VERTEX_CONSTRUCTION_FAILED',
            'ERROR',
            'Ground flat-plane vertices could not be constructed as finite Vector3 values.'
          )
        ])
    });
  }

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.TRIANGLE_MESH,

    vertices,

    indices: [
      0, 2, 1,
      0, 3, 2
    ],

    normalMode:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode.FACE_AND_VERTEX,

    expectedClosure:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure.OPEN_ALLOWED,

    transform,

    semanticRole:
      isHEarthNonEmptyString(
        descriptor.semanticRole
      )
        ? descriptor.semanticRole
        : 'GROUND_SURFACE',

    materialHint:
      freezeClone(
        descriptor.materialHint
      ),

    metadata: {
      providerId,
      providerRole,
      sourceZoneIds:
        normalizeStringIdArray(
          sourceZoneIds
        ),
      sourceObjectIds:
        normalizeStringIdArray(
          sourceObjectIds
        ),
      groundStrategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy.FLAT_PLANE,
      orientationLaw:
        '[0,2,1] [0,3,2]',
      openNeutralMeshExpected:
        true,
      minX:
        flatPlane.minimumX,
      maxX:
        flatPlane.maximumX,
      minZ:
        flatPlane.minimumZ,
      maxZ:
        flatPlane.maximumZ,
      y:
        flatPlane.y,
      providerLocalConstructionOnly:
        true,
      admitted:
        false,
      aggregateFrameAuthority:
        false
    },

    toleranceContext
  });
}


function constructHeightFieldGroundPrimitive({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor,
  toleranceContext
}) {
  const heightField =
    descriptor.heightField;

  const primitiveId =
    resolvePrimitiveId(
      providerId,
      descriptor
    );

  const transform =
    resolvePrimitiveTransform(
      heightField?.transform,
      descriptor?.transform
    );

  return constructHEarthHeightFieldMesh({
    primitiveId,
    descriptor:
      heightField.descriptor,
    xSampleCount:
      heightField.xSampleCount,
    zSampleCount:
      heightField.zSampleCount,
    transform,

    semanticRole:
      isHEarthNonEmptyString(
        descriptor.semanticRole
      )
        ? descriptor.semanticRole
        : 'GROUND_SURFACE',

    materialHint:
      freezeClone(
        descriptor.materialHint
      ),

    metadata: {
      providerId,
      providerRole,
      sourceZoneIds:
        normalizeStringIdArray(
          sourceZoneIds
        ),
      sourceObjectIds:
        normalizeStringIdArray(
          sourceObjectIds
        ),
      groundStrategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy.HEIGHT_FIELD,
      providerLocalConstructionOnly:
        true,
      admitted:
        false,
      aggregateFrameAuthority:
        false
    },

    toleranceContext
  });
}


function constructExplicitTriangleMeshGroundPrimitive({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor,
  toleranceContext
}) {
  const explicitTriangleMesh =
    descriptor.explicitTriangleMesh;

  const primitiveId =
    resolvePrimitiveId(
      providerId,
      descriptor
    );

  const transform =
    resolvePrimitiveTransform(
      explicitTriangleMesh?.transform,
      descriptor?.transform
    );

  const expectedClosure =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .expectedClosure,
      explicitTriangleMesh
        ?.expectedClosure
    )
      ? explicitTriangleMesh
          .expectedClosure
      : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .expectedClosure.OPEN_ALLOWED;

  const normalMode =
    enumIncludes(
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .normalMode,
      explicitTriangleMesh
        ?.normalMode
    )
      ? explicitTriangleMesh
          .normalMode
      : H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .normalMode.FACE_AND_VERTEX;

  return constructHEarthTriangleMesh({
    primitiveId,

    primitiveType:
      H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
        .primitiveType.TRIANGLE_MESH,

    vertices:
      explicitTriangleMesh.vertices,

    indices:
      explicitTriangleMesh.indices,

    normalMode,

    expectedClosure,

    transform,

    semanticRole:
      isHEarthNonEmptyString(
        descriptor.semanticRole
      )
        ? descriptor.semanticRole
        : 'GROUND_SURFACE',

    materialHint:
      freezeClone(
        descriptor.materialHint
      ),

    metadata: {
      providerId,
      providerRole,
      sourceZoneIds:
        normalizeStringIdArray(
          sourceZoneIds
        ),
      sourceObjectIds:
        normalizeStringIdArray(
          sourceObjectIds
        ),
      groundStrategy:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .groundStrategy
          .EXPLICIT_TRIANGLE_MESH,
      providerLocalConstructionOnly:
        true,
      admitted:
        false,
      aggregateFrameAuthority:
        false
    },

    toleranceContext
  });
}


function constructGroundPrimitiveFromStrategy({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor,
  strategy,
  toleranceContext
}) {
  if (
    strategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.FLAT_PLANE
  ) {
    return constructFlatPlaneGroundPrimitive({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      descriptor,
      toleranceContext
    });
  }

  if (
    strategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.HEIGHT_FIELD
  ) {
    return constructHeightFieldGroundPrimitive({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      descriptor,
      toleranceContext
    });
  }

  if (
    strategy ===
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.EXPLICIT_TRIANGLE_MESH
  ) {
    return constructExplicitTriangleMeshGroundPrimitive({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      descriptor,
      toleranceContext
    });
  }

  return deepFreeze({
    valid:
      false,
    primitiveRecord:
      null,
    geometry:
      null,
    openNeutralMesh:
      false,
    issues:
      deepFreeze([
        createGroundProviderIssue(
          'GROUND_PROVIDER_STRATEGY_UNSUPPORTED',
          'ERROR',
          'Ground provider strategy is unsupported.'
        )
      ])
  });
}


/* ==========================================================================
 * 07 · PROVIDER CONSTRUCTION
 * ========================================================================== */

export function constructHEarthGroundProvider({
  providerId =
    'H_EARTH_GROUND_PROVIDER',

  providerRole =
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .providerRole.GROUND,

  sourceZoneIds = [],
  sourceObjectIds = [],

  descriptor =
    createProviderDefaultDescriptor(),

  toleranceContext
} = {}) {
  const issues = [];

  if (!isHEarthNonEmptyString(providerId)) {
    issues.push(
      createGroundProviderIssue(
        'GROUND_PROVIDER_ID_INVALID',
        'ERROR',
        'Ground provider requires a nonempty providerId.'
      )
    );
  }

  if (
    !enumIncludes(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole,
      providerRole
    )
  ) {
    issues.push(
      createGroundProviderIssue(
        'GROUND_PROVIDER_ROLE_INVALID',
        'ERROR',
        'Ground provider role is unsupported.'
      )
    );
  }

  const toleranceResolution =
    resolveGroundToleranceContext(
      toleranceContext
    );

  issues.push(
    ...toleranceResolution.issues
  );

  if (
    hasHEarthBlockingIssues(
      issues
    )
  ) {
    return createHEarthGroundProviderResult({
      providerId:
        isHEarthNonEmptyString(
          providerId
        )
          ? providerId
          : 'H_EARTH_GROUND_PROVIDER',
      providerRole:
        enumIncludes(
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .providerRole,
          providerRole
        )
          ? providerRole
          : H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
              .providerRole.GROUND,
      sourceZoneIds,
      sourceObjectIds,
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives:
        [],
      bounds:
        getEmptyProviderBounds(),
      issues,
      receipts:
        [],
      strategy:
        null,
      requestedPrimitiveCount:
        1
    });
  }

  const strategyResolution =
    resolveGroundStrategy(
      descriptor
    );

  issues.push(
    ...strategyResolution.issues
  );

  if (
    strategyResolution.ineligible ===
    true
  ) {
    return createHEarthGroundProviderResult({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      valid:
        false,
      ineligible:
        true,
      fatal:
        false,
      primitives:
        [],
      bounds:
        getEmptyProviderBounds(),
      issues,
      receipts:
        [],
      strategy:
        strategyResolution.strategy,
      requestedPrimitiveCount:
        0
    });
  }

  if (
    strategyResolution.fatal ===
    true
  ) {
    return createHEarthGroundProviderResult({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives:
        [],
      bounds:
        getEmptyProviderBounds(),
      issues,
      receipts:
        [],
      strategy:
        strategyResolution.strategy,
      requestedPrimitiveCount:
        1
    });
  }

  const primitiveConstruction =
    constructGroundPrimitiveFromStrategy({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      descriptor,
      strategy:
        strategyResolution.strategy,
      toleranceContext:
        toleranceResolution
          .toleranceContext
    });

  issues.push(
    ...ensureArray(
      primitiveConstruction.issues
    )
  );

  if (
    primitiveConstruction.valid !== true ||
    !isHEarthNeutralPrimitiveRecord(
      primitiveConstruction
        .primitiveRecord
    )
  ) {
    return createHEarthGroundProviderResult({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives:
        [],
      bounds:
        getEmptyProviderBounds(),
      issues,
      receipts:
        [],
      strategy:
        strategyResolution.strategy,
      requestedPrimitiveCount:
        1
    });
  }

  const primitives = [
    primitiveConstruction
      .primitiveRecord
  ];

  const bounds =
    mergeProviderBounds(
      primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      ),
      toleranceResolution
        .toleranceContext
    );

  const boundsContext =
    isHEarthAABB3D(bounds)
      ? deriveHEarthGeometryToleranceContext(
          bounds
        )
      : null;

  if (
    !isHEarthAABB3D(bounds) ||
    (
      boundsContext !== null &&
      !isHEarthGeometryToleranceContext(
        boundsContext
      )
    )
  ) {
    issues.push(
      createGroundProviderIssue(
        'GROUND_PROVIDER_MERGED_BOUNDS_INVALID',
        'ERROR',
        'Ground provider merged bounds are invalid.'
      )
    );

    return createHEarthGroundProviderResult({
      providerId,
      providerRole,
      sourceZoneIds,
      sourceObjectIds,
      valid:
        false,
      ineligible:
        false,
      fatal:
        true,
      primitives:
        [],
      bounds:
        getEmptyProviderBounds(),
      issues,
      receipts:
        [],
      strategy:
        strategyResolution.strategy,
      requestedPrimitiveCount:
        1
    });
  }

  const primitiveReceipt =
    buildGroundProviderReceipt({
      providerId,
      providerRole,
      primitiveRecord:
        primitiveConstruction
          .primitiveRecord,
      issues:
        primitiveConstruction.issues,
      sourceZoneIds,
      sourceObjectIds,
      strategy:
        strategyResolution.strategy
    });

  return createHEarthGroundProviderResult({
    providerId,
    providerRole,
    sourceZoneIds,
    sourceObjectIds,
    valid:
      !hasHEarthBlockingIssues(
        issues
      ),
    ineligible:
      false,
    fatal:
      hasHEarthBlockingIssues(
        issues
      ),
    primitives,
    bounds,
    issues,
    receipts:
      primitiveReceipt
        ? [primitiveReceipt]
        : [],
    strategy:
      strategyResolution.strategy,
    requestedPrimitiveCount:
      1
  });
}


/* ==========================================================================
 * 08 · OWNERSHIP
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP =
  deepFreeze({
    jurisdiction:
      'PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_ONLY',

    owns:
      deepFreeze([
        'GROUND_PROVIDER_RESULT_SHAPE',
        'GROUND_PROVIDER_RECEIPTS',
        'GROUND_PROVIDER_ACCOUNTING_SUMMARY',
        'GROUND_PROVIDER_LOCAL_STRATEGY_RESOLUTION',
        'GROUND_PROVIDER_FLAT_PLANE_ADAPTER',
        'GROUND_PROVIDER_HEIGHT_FIELD_ADAPTER',
        'GROUND_PROVIDER_EXPLICIT_TRIANGLE_MESH_ADAPTER',
        'GROUND_PROVIDER_SOURCE_TRACEABILITY',
        'GROUND_PROVIDER_AUTHORITY_CEILING'
      ]),

    mustNotOwn:
      deepFreeze([
        'DIRECTIONAL_KERNEL_MATHEMATICS',
        'DIRECTIONAL_DESCRIPTOR_ANALYSIS',
        'DIRECTIONAL_TOPOLOGY_CLASSIFICATION',
        'DIRECTIONAL_NEUTRAL_PRIMITIVE_CONSTRUCTION',
        'ADMISSION_AUTHORITY',
        'AGGREGATE_FRAME_AUTHORITY',
        'GEOMETRY_INDEX_AUTHORITY',
        'COMPOSITOR_INTEGRATION_AUTHORITY',
        'RENDERER_INTEGRATION_AUTHORITY',
        'VISUAL_APPROVAL',
        'PRODUCTION_AUTHORITY',
        'PUBLIC_RELEASE_AUTHORITY'
      ]),

    imports:
      deepFreeze([
        './geometry-kernel.js'
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

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_REQUIRED_FIXTURES =
  deepFreeze([
    'PROVIDER_IMPORTS_FACADE_ONLY',
    'PROVIDER_IMPORTS_NO_ENVIRONMENT_IN_V1',
    'PROVIDER_IMPORTS_NO_CAPACITY_IN_V1',
    'PROVIDER_IMPORTS_NO_DIRECTIONAL_KERNELS',
    'PROVIDER_IMPORTS_NO_GEOMETRY_INDEX',
    'PROVIDER_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_INDEX',
    'PROVIDER_OUTPUT_AUTHORITY_HOLDS_FALSE',
    'DISABLED_DESCRIPTOR_RETURNS_INELIGIBLE',
    'AUTO_WITHOUT_LAWFUL_SOURCE_RETURNS_INELIGIBLE',
    'INVALID_EXPLICIT_TOLERANCE_CONTEXT_REJECTED',
    'INVALID_EXPLICIT_STRATEGY_REJECTED',
    'FLAT_PLANE_CONSTRUCTION_VALID',
    'EXPLICIT_TRIANGLE_MESH_CONSTRUCTION_VALID',
    'HEIGHT_FIELD_CONSTRUCTION_VALID',
    'VALID_RESULT_EMITS_NEUTRAL_PRIMITIVES_ONLY',
    'VALID_RESULT_BOUNDS_MERGED_FROM_PRIMITIVES',
    'EMPTY_OR_INELIGIBLE_RESULT_USES_EMPTY_BOUNDS',
    'NO_ADMISSION_OR_AGGREGATE_FRAME_AUTHORITY_CREATED',
    'RESULT_REJECTS_CONTRADICTORY_STATUS_FLAGS',
    'RESULT_REJECTS_VALID_STATE_WITH_EMPTY_PRIMITIVES',
    'RESULT_REJECTS_VALID_STATE_WITH_EMPTY_BOUNDS',
    'RESULT_REJECTS_FALSE_NONEMPTY_BOUNDS',
    'RESULT_REJECTS_ACCOUNT_PRIMITIVE_COUNT_MISMATCH',
    'RESULT_REJECTS_RECEIPT_PRIMITIVE_COUNT_MISMATCH',
    'RESULT_REJECTS_FORGED_ADMISSION_AUTHORITY',
    'RESULT_REJECTS_FORGED_AGGREGATE_FRAME_AUTHORITY',
    'RECEIPT_REJECTS_MALFORMED_SOURCE_ZONE_IDS',
    'RECEIPT_REJECTS_DUPLICATE_SOURCE_OBJECT_IDS',
    'RESULT_REJECTS_MALFORMED_SOURCE_ZONE_IDS',
    'RESULT_REJECTS_DUPLICATE_SOURCE_OBJECT_IDS',
    'RECEIPT_REJECTS_PRIMITIVE_TYPE_MISMATCH',
    'RECEIPT_REJECTS_VALID_BLOCKING_COUNT_CONTRADICTION',
    'RECEIPT_REJECTS_BLOCKING_COUNT_ABOVE_TOTAL'
  ]);


/* ==========================================================================
 * 10 · PRE-BACKING GATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PRE_BACKING_GATE =
  deepFreeze({
    gateId:
      'GEOMETRY_GROUND_PROVIDER_PRE_BACKING_GATE_v1',

    requiredSequence:
      deepFreeze([
        'NODE_SYNTAX_CHECK',
        'NAMED_IMPORT_RESOLUTION',
        'UNUSED_IMPORT_SCAN',
        'PROHIBITED_IMPORT_SCAN',
        'STATIC_SELF_REVIEW',
        'PROVIDER_OUTPUT_SHAPE_RECHECK',
        'FLAT_PLANE_FIXTURE',
        'EXPLICIT_TRIANGLE_MESH_FIXTURE',
        'HEIGHT_FIELD_FIXTURE',
        'AUTHORITY_HOLD_RECHECK',
        'FIXTURES_FAILED_ZERO'
      ]),

    nodeSyntaxCheckCommand:
      'node --check geometry-ground.js',

    allowedImports:
      deepFreeze([
        './geometry-kernel.js'
      ]),

    requiredFixtureCount:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_REQUIRED_FIXTURES
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
    providerOutputShapeRecheckPerformed:
      false,
    flatPlaneFixturePerformed:
      false,
    explicitTriangleMeshFixturePerformed:
      false,
    heightFieldFixturePerformed:
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

export function getHEarthGeometryGroundProviderStaticReview() {
  const facadeContract =
    getHEarthGeometryKernelPublicFacadeContract();

  const facadeReceipt =
    getHEarthGeometryKernelPublicFacadeReceipt();

  const disabledResult =
    constructHEarthGroundProvider({
      descriptor: {
        enabled:
          false
      }
    });

  const emptyAutoResult =
    constructHEarthGroundProvider({
      descriptor: {
        enabled:
          true
      }
    });

  const invalidStrategyResult =
    constructHEarthGroundProvider({
      descriptor: {
        strategy:
          'HEIGHT_FELD'
      }
    });

  const flatPlaneResult =
    constructHEarthGroundProvider({
      providerId:
        'STATIC_GROUND_PROVIDER_FLAT',
      sourceZoneIds: [
        'ZONE_GROUND_001'
      ],
      sourceObjectIds: [
        'GROUND_SURFACE_001'
      ],
      descriptor: {
        strategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy.FLAT_PLANE,
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
    });

  const explicitTriangleMeshResult =
    constructHEarthGroundProvider({
      providerId:
        'STATIC_GROUND_PROVIDER_EXPLICIT',
      sourceZoneIds: [
        'ZONE_GROUND_001'
      ],
      sourceObjectIds: [
        'GROUND_SURFACE_002'
      ],
      descriptor: {
        strategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy
            .EXPLICIT_TRIANGLE_MESH,
        explicitTriangleMesh: {
          vertices: [
            createHEarthVector3(
              -8,
              0,
              -8
            ),
            createHEarthVector3(
              8,
              0,
              -8
            ),
            createHEarthVector3(
              8,
              0,
              8
            ),
            createHEarthVector3(
              -8,
              0,
              8
            )
          ],
          indices: [
            0, 2, 1,
            0, 3, 2
          ]
        }
      }
    });

  const heightFieldResult =
    constructHEarthGroundProvider({
      providerId:
        'STATIC_GROUND_PROVIDER_HEIGHT_FIELD',
      sourceZoneIds: [
        'ZONE_GROUND_001'
      ],
      sourceObjectIds: [
        'GROUND_SURFACE_003'
      ],
      descriptor: {
        strategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy.HEIGHT_FIELD,
        heightField: {
          descriptor:
            createStaticGroundHeightFieldDescriptor(),
          xSampleCount:
            3,
          zSampleCount:
            3
        }
      }
    });

  const invalidToleranceResult =
    constructHEarthGroundProvider({
      toleranceContext:
        {}
    });

  const contradictoryStatusRecord = {
    ...flatPlaneResult,
    valid:
      true,
    ineligible:
      false,
    fatal:
      true,
    constructionStatus:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.VALID
  };

  const validButEmptyPrimitiveRecord = {
    ...flatPlaneResult,
    primitives:
      deepFreeze([]),
    receipts:
      deepFreeze([]),
    account: {
      ...flatPlaneResult.account,
      requestedPrimitiveCount:
        0,
      constructedPrimitiveCount:
        0,
      validPrimitiveCount:
        0,
      heldPrimitiveCount:
        0,
      neutralPrimitiveCount:
        0
    }
  };

  const validButEmptyBoundsRecord = {
    ...flatPlaneResult,
    bounds:
      getEmptyProviderBounds(),
    account: {
      ...flatPlaneResult.account,
      boundsPresent:
        true,
      emptyBounds:
        true
    }
  };

  const falseNonemptyBoundsRecord = {
    ...flatPlaneResult,
    bounds:
      mergeHEarthGeometryBounds([
        mergeHEarthGeometryBounds(
          flatPlaneResult.primitives.map(
            (primitive) =>
              primitive.geometry.bounds
          )
        ),
        mergeHEarthGeometryBounds([
          {
            type:
              'AABB_3D',
            coordinateFrame:
              H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
            minimum:
              createHEarthVector3(
                100,
                100,
                100
              ),
            maximum:
              createHEarthVector3(
                101,
                101,
                101
              ),
            center:
              createHEarthVector3(
                100.5,
                100.5,
                100.5
              ),
            size:
              createHEarthVector3(
                1,
                1,
                1
              ),
            halfExtent:
              createHEarthVector3(
                0.5,
                0.5,
                0.5
              ),
            diagonalLength:
              Math.sqrt(3),
            empty:
              false,
            finite:
              true
          }
        ])
      ])
  };

  const accountMismatchRecord = {
    ...flatPlaneResult,
    account: {
      ...flatPlaneResult.account,
      requestedPrimitiveCount:
        5
    }
  };

  const receiptMismatchRecord = {
    ...flatPlaneResult,
    receipts:
      deepFreeze([])
  };

  const forgedAdmissionAuthorityRecord = {
    ...flatPlaneResult,
    authority: {
      ...flatPlaneResult.authority,
      admittedPrimitiveAuthority:
        true
    }
  };

  const forgedAggregateFrameAuthorityRecord = {
    ...flatPlaneResult,
    authority: {
      ...flatPlaneResult.authority,
      aggregateFrameAuthority:
        true
    }
  };

  const malformedReceiptSourceZoneIds = {
    ...flatPlaneResult.receipts[0],
    sourceZoneIds: [
      null,
      42,
      '',
      'ZONE_GROUND_001',
      'ZONE_GROUND_001'
    ]
  };

  const duplicateReceiptSourceObjectIds = {
    ...flatPlaneResult.receipts[0],
    sourceObjectIds: [
      'GROUND_SURFACE_001',
      'GROUND_SURFACE_001'
    ]
  };

  const primitiveTypeMismatchReceipt = {
    ...flatPlaneResult.receipts[0],
    primitiveType:
      'POINT'
  };

  const validBlockingCountContradictionReceipt = {
    ...flatPlaneResult.receipts[0],
    valid:
      true,
    issueCounts: {
      ...flatPlaneResult.receipts[0]
        .issueCounts,
      blockingCount:
        1,
      totalCount:
        Math.max(
          1,
          flatPlaneResult.receipts[0]
            .issueCounts.totalCount
        ),
      errorCount:
        Math.max(
          1,
          flatPlaneResult.receipts[0]
            .issueCounts.errorCount
        )
    }
  };

  const blockingCountAboveTotalReceipt = {
    ...flatPlaneResult.receipts[0],
    issueCounts: {
      ...flatPlaneResult.receipts[0]
        .issueCounts,
      totalCount:
        0,
      blockingCount:
        1,
      fatalCount:
        0,
      errorCount:
        0,
      warningCount:
        0,
      infoCount:
        0
    }
  };

  const malformedResultSourceZoneIds = {
    ...flatPlaneResult,
    sourceZoneIds: [
      null,
      42,
      '',
      'ZONE_GROUND_001',
      'ZONE_GROUND_001'
    ]
  };

  const duplicateResultSourceObjectIds = {
    ...flatPlaneResult,
    sourceObjectIds: [
      'GROUND_SURFACE_001',
      'GROUND_SURFACE_001'
    ]
  };

  const flatPlaneDerivedBounds =
    mergeHEarthGeometryBounds(
      flatPlaneResult.primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  const explicitDerivedBounds =
    mergeHEarthGeometryBounds(
      explicitTriangleMeshResult
        .primitives.map(
          (primitive) =>
            primitive.geometry.bounds
        )
    );

  const heightFieldDerivedBounds =
    mergeHEarthGeometryBounds(
      heightFieldResult.primitives.map(
        (primitive) =>
          primitive.geometry.bounds
      )
    );

  const checks = deepFreeze([
    deepFreeze({
      id:
        'PROVIDER_IMPORTS_FACADE_ONLY',
      passed:
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
          .imports.length === 1 &&
        H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
          .imports[0] ===
          './geometry-kernel.js'
    }),

    deepFreeze({
      id:
        'PROVIDER_IMPORTS_NO_ENVIRONMENT_IN_V1',
      passed:
        !H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
          .imports.includes(
            '../environment.js'
          )
    }),

    deepFreeze({
      id:
        'PROVIDER_IMPORTS_NO_CAPACITY_IN_V1',
      passed:
        !H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
          .imports.includes(
            '../capacity.js'
          )
    }),

    deepFreeze({
      id:
        'PROVIDER_IMPORTS_NO_DIRECTIONAL_KERNELS',
      passed:
        !H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
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
        'PROVIDER_IMPORTS_NO_GEOMETRY_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
          .imports.includes(
            './geometry-index.js'
          )
    }),

    deepFreeze({
      id:
        'PROVIDER_IMPORTS_NO_COMPOSITOR_RENDERER_CONTROLLER_INDEX',
      passed:
        !H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
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
        'PROVIDER_OUTPUT_AUTHORITY_HOLDS_FALSE',
      passed:
        isGroundProviderAuthority(
          flatPlaneResult.authority
        )
    }),

    deepFreeze({
      id:
        'DISABLED_DESCRIPTOR_RETURNS_INELIGIBLE',
      passed:
        disabledResult.valid === false &&
        disabledResult.ineligible === true &&
        disabledResult.fatal === false &&
        disabledResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus
            .INELIGIBLE &&
        isHEarthAABB3D(
          disabledResult.bounds
        ) &&
        disabledResult.bounds.empty === true
    }),

    deepFreeze({
      id:
        'AUTO_WITHOUT_LAWFUL_SOURCE_RETURNS_INELIGIBLE',
      passed:
        emptyAutoResult.ineligible === true &&
        emptyAutoResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus
            .INELIGIBLE
    }),

    deepFreeze({
      id:
        'INVALID_EXPLICIT_TOLERANCE_CONTEXT_REJECTED',
      passed:
        invalidToleranceResult.valid === false &&
        invalidToleranceResult.fatal === true &&
        invalidToleranceResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.FATAL
    }),

    deepFreeze({
      id:
        'INVALID_EXPLICIT_STRATEGY_REJECTED',
      passed:
        invalidStrategyResult.valid === false &&
        invalidStrategyResult.fatal === true &&
        invalidStrategyResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.FATAL
    }),

    deepFreeze({
      id:
        'FLAT_PLANE_CONSTRUCTION_VALID',
      passed:
        flatPlaneResult.valid === true &&
        flatPlaneResult.fatal === false &&
        flatPlaneResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.VALID &&
        flatPlaneResult.primitives.length === 1 &&
        flatPlaneResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        )
    }),

    deepFreeze({
      id:
        'EXPLICIT_TRIANGLE_MESH_CONSTRUCTION_VALID',
      passed:
        explicitTriangleMeshResult.valid === true &&
        explicitTriangleMeshResult.fatal === false &&
        explicitTriangleMeshResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.VALID &&
        explicitTriangleMeshResult.primitives.length === 1 &&
        explicitTriangleMeshResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        )
    }),

    deepFreeze({
      id:
        'HEIGHT_FIELD_CONSTRUCTION_VALID',
      passed:
        heightFieldResult.valid === true &&
        heightFieldResult.fatal === false &&
        heightFieldResult.constructionStatus ===
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.VALID &&
        heightFieldResult.primitives.length === 1 &&
        heightFieldResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        ) &&
        heightFieldResult.bounds.empty === false &&
        heightFieldResult.receipts.length === 1 &&
        heightFieldResult.account
          .admittedPrimitiveCount === 0
    }),

    deepFreeze({
      id:
        'VALID_RESULT_EMITS_NEUTRAL_PRIMITIVES_ONLY',
      passed:
        flatPlaneResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        ) &&
        explicitTriangleMeshResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        ) &&
        heightFieldResult.primitives.every(
          isHEarthNeutralPrimitiveRecord
        )
    }),

    deepFreeze({
      id:
        'VALID_RESULT_BOUNDS_MERGED_FROM_PRIMITIVES',
      passed:
        isHEarthAABB3D(
          flatPlaneDerivedBounds
        ) &&
        isHEarthAABB3D(
          explicitDerivedBounds
        ) &&
        isHEarthAABB3D(
          heightFieldDerivedBounds
        ) &&
        areGroundBoundsEquivalent(
          flatPlaneResult.bounds,
          flatPlaneDerivedBounds
        ) &&
        areGroundBoundsEquivalent(
          explicitTriangleMeshResult.bounds,
          explicitDerivedBounds
        ) &&
        areGroundBoundsEquivalent(
          heightFieldResult.bounds,
          heightFieldDerivedBounds
        )
    }),

    deepFreeze({
      id:
        'EMPTY_OR_INELIGIBLE_RESULT_USES_EMPTY_BOUNDS',
      passed:
        disabledResult.bounds.empty === true &&
        emptyAutoResult.bounds.empty === true &&
        invalidToleranceResult.bounds.empty === true
    }),

    deepFreeze({
      id:
        'NO_ADMISSION_OR_AGGREGATE_FRAME_AUTHORITY_CREATED',
      passed:
        flatPlaneResult.authority
          .admittedPrimitiveAuthority === false &&
        flatPlaneResult.authority
          .aggregateFrameAuthority === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_CONTRADICTORY_STATUS_FLAGS',
      passed:
        isHEarthGroundProviderResult(
          contradictoryStatusRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_VALID_STATE_WITH_EMPTY_PRIMITIVES',
      passed:
        isHEarthGroundProviderResult(
          validButEmptyPrimitiveRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_VALID_STATE_WITH_EMPTY_BOUNDS',
      passed:
        isHEarthGroundProviderResult(
          validButEmptyBoundsRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_FALSE_NONEMPTY_BOUNDS',
      passed:
        isHEarthGroundProviderResult(
          falseNonemptyBoundsRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_ACCOUNT_PRIMITIVE_COUNT_MISMATCH',
      passed:
        isHEarthGroundProviderResult(
          accountMismatchRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_RECEIPT_PRIMITIVE_COUNT_MISMATCH',
      passed:
        isHEarthGroundProviderResult(
          receiptMismatchRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_FORGED_ADMISSION_AUTHORITY',
      passed:
        isHEarthGroundProviderResult(
          forgedAdmissionAuthorityRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_FORGED_AGGREGATE_FRAME_AUTHORITY',
      passed:
        isHEarthGroundProviderResult(
          forgedAggregateFrameAuthorityRecord
        ) === false
    }),

    deepFreeze({
      id:
        'RECEIPT_REJECTS_MALFORMED_SOURCE_ZONE_IDS',
      passed:
        isHEarthGroundProviderReceipt(
          malformedReceiptSourceZoneIds
        ) === false
    }),

    deepFreeze({
      id:
        'RECEIPT_REJECTS_DUPLICATE_SOURCE_OBJECT_IDS',
      passed:
        isHEarthGroundProviderReceipt(
          duplicateReceiptSourceObjectIds
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_MALFORMED_SOURCE_ZONE_IDS',
      passed:
        isHEarthGroundProviderResult(
          malformedResultSourceZoneIds
        ) === false
    }),

    deepFreeze({
      id:
        'RESULT_REJECTS_DUPLICATE_SOURCE_OBJECT_IDS',
      passed:
        isHEarthGroundProviderResult(
          duplicateResultSourceObjectIds
        ) === false
    }),

    deepFreeze({
      id:
        'RECEIPT_REJECTS_PRIMITIVE_TYPE_MISMATCH',
      passed:
        isHEarthGroundProviderReceipt(
          primitiveTypeMismatchReceipt
        ) === true &&
        isHEarthGroundProviderResult({
          ...flatPlaneResult,
          receipts:
            deepFreeze([
              primitiveTypeMismatchReceipt
            ])
        }) === false
    }),

    deepFreeze({
      id:
        'RECEIPT_REJECTS_VALID_BLOCKING_COUNT_CONTRADICTION',
      passed:
        isHEarthGroundProviderReceipt(
          validBlockingCountContradictionReceipt
        ) === false
    }),

    deepFreeze({
      id:
        'RECEIPT_REJECTS_BLOCKING_COUNT_ABOVE_TOTAL',
      passed:
        isHEarthGroundProviderReceipt(
          blockingCountAboveTotalReceipt
        ) === false
    }),

    deepFreeze({
      id:
        'FACADE_CONTRACT_DEPENDENCY_MATCHES',
      passed:
        facadeContract?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID &&
        facadeContract?.schemaVersion ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION &&
        facadeReceipt?.contractId ===
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID
    })
  ]);

  const passed =
    checks.every(
      (check) =>
        check.passed === true
    );

  return deepFreeze({
    reviewId:
      'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATIC_SELF_REVIEW_v4',

    contractId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID,

    stepId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID,

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
    providerOutputShapeRecheckPerformed:
      false,
    flatPlaneFixturePerformed:
      false,
    explicitTriangleMeshFixturePerformed:
      false,
    heightFieldFixturePerformed:
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

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_IMPLEMENTATION_CANDIDATE_RECEIPT_v4',

    contractId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID,

    sourceFile:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION,

    stepId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID,

    dependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,

    dependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,

    dependencySourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,

    importsFacadeOnly:
      true,

    importsEnvironment:
      false,

    importsCapacity:
      false,

    importsDirectionalKernels:
      false,

    importsGeometryIndex:
      false,

    importsCompositor:
      false,

    importsRenderer:
      false,

    importsController:
      false,

    importsIndex:
      false,

    implementationBodyExists:
      true,

    providerRole:
      'GROUND',

    providerOutputAuthority:
      'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_ONLY',

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
    providerOutputShapeRecheckPerformed:
      false,
    flatPlaneFixturePerformed:
      false,
    explicitTriangleMeshFixturePerformed:
      false,
    heightFieldFixturePerformed:
      false,
    authorityHoldRecheckPerformed:
      false,

    localAdmission:
      false,

    admissionAuthority:
      false,

    aggregateFrameAuthority:
      false,

    geometryIndexAuthority:
      false,

    compositorIntegrationAuthority:
      false,

    rendererIntegrationAuthority:
      false,

    visualApproval:
      false,

    productionAuthority:
      false,

    publicReleaseAuthority:
      false,

    nextRequired:
      'NODE_SYNTAX_CHECK_THEN_NAMED_IMPORT_RESOLUTION_THEN_UNUSED_IMPORT_SCAN_THEN_PROHIBITED_IMPORT_SCAN_THEN_STATIC_SELF_REVIEW_THEN_PROVIDER_OUTPUT_SHAPE_RECHECK_THEN_FLAT_PLANE_FIXTURE_THEN_EXPLICIT_TRIANGLE_MESH_FIXTURE_THEN_HEIGHT_FIELD_FIXTURE_THEN_AUTHORITY_HOLD_RECHECK_THEN_FIXTURES_FAILED_ZERO'
  });


/* ==========================================================================
 * 13 · PUBLIC API CANDIDATE
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',

    owningModule:
      'geometry-ground.js',

    classification:
      'GROUND_PROVIDER_PUBLIC_CANDIDATE',

    symbols:
      deepFreeze([
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATUS',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_REQUIRED_FIXTURES',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PRE_BACKING_GATE',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PUBLIC_API_CANDIDATE',
        'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT',
        'isHEarthGroundProviderReceipt',
        'isHEarthGroundProviderAccount',
        'isHEarthGroundProviderResult',
        'constructHEarthGroundProvider',
        'getHEarthGeometryGroundProviderStaticReview',
        'getHEarthGeometryGroundProviderReceipt',
        'getHEarthGeometryGroundProviderContract'
      ]),

    collisionStatus:
      'NOT_YET_REVIEWED',

    implementationStatus:
      'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_IMPLEMENTATION_CANDIDATE',

    conformanceStatus:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });


/* ==========================================================================
 * 14 · CONTRACT
 * ========================================================================== */

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID,

    schemaVersion:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION,

    sourceFile:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE,

    stepId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID,

    status:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATUS,

    dependencyContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,

    dependencySchemaVersion:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,

    dependencySourceFile:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,

    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,

    ownership:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP,

    requiredFixtures:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_REQUIRED_FIXTURES,

    preBackingGate:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PRE_BACKING_GATE,

    publicApiCandidate:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PUBLIC_API_CANDIDATE,

    receipt:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT,

    implementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',

    localAdmission:
      false,

    admissionAuthority:
      false,

    aggregateFrameAuthority:
      false,

    geometryIndexAuthority:
      false,

    compositorIntegrationAuthority:
      false,

    rendererIntegrationAuthority:
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

export function getHEarthGeometryGroundProviderReceipt() {
  return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT;
}


export function getHEarthGeometryGroundProviderContract() {
  return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT;
}


export default H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT;
