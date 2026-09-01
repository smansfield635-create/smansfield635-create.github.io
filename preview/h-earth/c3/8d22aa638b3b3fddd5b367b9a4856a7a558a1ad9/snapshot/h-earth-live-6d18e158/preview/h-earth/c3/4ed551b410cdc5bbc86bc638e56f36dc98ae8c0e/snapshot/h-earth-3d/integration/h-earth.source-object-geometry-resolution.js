/**
 * /h-earth-3d/integration/h-earth.source-object-geometry-resolution.js
 * COMPLETE NEW FILE CANDIDATE
 * H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1
 *
 * Packet:
 * API_SURFACE_PACKET_001
 * WET_SAND_IDENTITY_BEARING_GEOMETRY_CORRIDOR
 *
 * Purpose:
 * Resolve one stable H-Earth source-object identity through current object,
 * zone, and landscape-lattice authorities into a fail-closed neutral geometry
 * provider-request descriptor.
 *
 * First admitted source object:
 * OBJ_002_FOREGROUND_WET_SAND
 *
 * Direct authoritative imports:
 * /h-earth-3d/objects/ground-cell-001.objects.js
 * /h-earth-3d/zones/ground-cell-001.zones.js
 * /h-earth-3d/zones/ground-cell-001.landscape-lattice.js
 *
 * Declared provider implementation target:
 * /showroom/globe/h-earth/render/geometry-ground.js
 * H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1
 *
 * This file:
 * - accepts source identities through its public resolver;
 * - resolves authoritative descriptors internally;
 * - preserves exact source-object, zone, lattice, inspection-role, material-
 *   intent, and provider-selection provenance;
 * - derives lattice selection from current landscape authority;
 * - creates provider-request identity;
 * - returns an immutable provider-request descriptor;
 * - rejects caller-supplied authority descriptors;
 * - rejects unknown public input keys;
 * - requires strict plain-record public input;
 * - guards upstream array shapes before array operations;
 * - requires explicit requestId for live occurrence requests;
 * - limits deterministic fallback request identity to preview and test
 *   purposes only;
 * - bridges logical provider identity to the current implementation contract
 *   without importing or invoking the provider;
 * - fails closed on source disagreement.
 *
 * This file does not:
 * - import the provider implementation;
 * - invoke the geometry provider;
 * - construct geometry;
 * - create geometry-candidate identity;
 * - perform West admission;
 * - create admission requests or receipts;
 * - create admitted-geometry identity;
 * - create or mutate a geometry index;
 * - create correspondence records;
 * - create compositor nodes;
 * - create render instances;
 * - activate a renderer;
 * - execute Inspect Ground;
 * - produce a readout occurrence;
 * - produce or persist a receipt occurrence;
 * - commit runtime state;
 * - serialize or replay state;
 * - validate production behavior;
 * - deploy;
 * - collapse the matrix.
 */

import {
  H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT,
  H_EARTH_PRIMARY_INSPECTION_TARGET,
  getHEarthGroundCell001ObjectDescriptor,
  getHEarthGroundCell001ObjectZoneBinding,
  isHEarthGroundCell001ObjectId
} from '../objects/ground-cell-001.objects.js';

import {
  H_EARTH_GROUND_CELL_001_ZONES_CONTRACT,
  getHEarthGroundCell001ZoneDescriptor,
  isHEarthGroundCell001ZoneId
} from '../zones/ground-cell-001.zones.js';

import {
  H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT,
  H_EARTH_256_LATTICE_REGION_PROFILES,
  H_EARTH_256_LATTICE_OBJECT_HINTS
} from '../zones/ground-cell-001.landscape-lattice.js';

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID =
  'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_FILE_BIRTH_PACKET_001_WET_SAND_IDENTITY_CORRIDOR_v1';

const SOURCE_FILE =
  '/h-earth-3d/integration/h-earth.source-object-geometry-resolution.js';

const WET_SAND_OBJECT_ID =
  'OBJ_002_FOREGROUND_WET_SAND';

const WET_SAND_ZONE_ID =
  'ZONE_001_FOREGROUND_INSPECTION_ZONE';

const WET_SAND_REGION_ID =
  'FOREGROUND_INSPECTION_GROUND';

const GROUND_PROVIDER_ID =
  'H_EARTH_GROUND_GEOMETRY_PROVIDER';

const GROUND_PROVIDER_IMPLEMENTATION_FILE =
  '/showroom/globe/h-earth/render/geometry-ground.js';

const GROUND_PROVIDER_IMPLEMENTATION_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

const WET_SAND_PROVIDER_SELECTION_RULE_ID =
  'H_EARTH_WET_SAND_TO_GROUND_PROVIDER_SELECTION_RULE_v1';

const DEFAULT_REQUEST_PURPOSE =
  'LIVE_WET_SAND_VERTICAL_SLICE';

const ALLOWED_REQUEST_PURPOSES = Object.freeze([
  DEFAULT_REQUEST_PURPOSE,
  'WET_SAND_GEOMETRY_PREVIEW',
  'WET_SAND_GEOMETRY_TEST'
]);

const ALLOWED_PUBLIC_INPUT_KEYS = Object.freeze([
  'sourceObjectId',
  'requestedPurpose',
  'requestId'
]);

const ALLOWED_PUBLIC_INPUT_KEY_SET =
  new Set(ALLOWED_PUBLIC_INPUT_KEYS);

const FORBIDDEN_PUBLIC_DESCRIPTOR_KEYS = Object.freeze([
  'objectDescriptor',
  'zoneDescriptor',
  'landscapeRegionProfile',
  'latticeObjectHint',
  'providerInput',
  'providerSelection'
]);

const PREVIEW_AND_TEST_PURPOSES = Object.freeze([
  'WET_SAND_GEOMETRY_PREVIEW',
  'WET_SAND_GEOMETRY_TEST'
]);

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function freezeArray(values = []) {
  return Object.freeze(
    Array.isArray(values) ? [...values] : []
  );
}

function freezeIssues(issues) {
  return Object.freeze(
    issues.map((issue) =>
      Object.freeze({
        code: issue.code,
        message: issue.message,
        field: issue.field ?? null,
        expected: issue.expected ?? null,
        actual: issue.actual ?? null
      })
    )
  );
}

function normalizeRequiredString(value) {
  return typeof value === 'string' && value.trim().length > 0
    ? value.trim()
    : null;
}

function normalizeOptionalString(value) {
  if (value === undefined || value === null) {
    return null;
  }

  return normalizeRequiredString(value);
}

function arraysEqual(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every((value, index) => value === right[index])
  );
}

function deriveInclusiveRows(rowRange) {
  if (
    !rowRange ||
    !Number.isInteger(rowRange.min) ||
    !Number.isInteger(rowRange.max) ||
    rowRange.min < 1 ||
    rowRange.max > 16 ||
    rowRange.min > rowRange.max
  ) {
    return null;
  }

  return Object.freeze(
    Array.from(
      { length: rowRange.max - rowRange.min + 1 },
      (_, index) => rowRange.min + index
    )
  );
}

function makeCorrelationIdentity({
  sourceObjectId,
  requestedPurpose,
  requestId
}) {
  if (requestId) {
    return requestId;
  }

  return [
    'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION',
    sourceObjectId,
    requestedPurpose
  ].join(':');
}

function makeProviderRequestId({
  sourceObjectId,
  requestedPurpose,
  requestId
}) {
  return [
    'H_EARTH_PROVIDER_REQUEST',
    GROUND_PROVIDER_ID,
    sourceObjectId,
    requestedPurpose,
    requestId
  ].join(':');
}

function makeResolutionReceiptId(providerRequestId) {
  return [
    'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_RECEIPT',
    providerRequestId
  ].join(':');
}

function makeRejectedResult({
  sourceObjectId = null,
  requestedPurpose = null,
  requestId = null,
  issues
}) {
  return Object.freeze({
    ok: false,
    status: 'SOURCE_OBJECT_GEOMETRY_REQUEST_REJECTED',

    contractId:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,

    sourceObjectId,
    requestedPurpose,
    requestId,

    providerId: null,
    providerRequestId: null,
    resolutionReceiptId: null,

    sourceResolution: null,
    providerSelection: null,
    latticeSelection: null,
    materialIntent: null,
    providerInput: null,

    issues: freezeIssues(issues)
  });
}

function checkDescriptorResolverInput(input) {
  const issues = [];

  if (!isPlainRecord(input)) {
    issues.push({
      code: 'RESOLUTION_INPUT_NOT_RECORD',
      message: 'Resolution input must be a strict plain-record object.'
    });

    return issues;
  }

  const sourceObjectId =
    normalizeRequiredString(input.sourceObjectId);

  const requestedPurpose =
    normalizeRequiredString(input.requestedPurpose);

  const requestId =
    normalizeOptionalString(input.requestId);

  const deterministicFallbackAllowed =
    PREVIEW_AND_TEST_PURPOSES.includes(requestedPurpose);

  if (!sourceObjectId) {
    issues.push({
      code: 'SOURCE_OBJECT_ID_MISSING',
      message: 'sourceObjectId is required.',
      field: 'sourceObjectId'
    });
  }

  if (!requestedPurpose) {
    issues.push({
      code: 'REQUEST_PURPOSE_MISSING',
      message: 'requestedPurpose is required.',
      field: 'requestedPurpose'
    });
  } else if (!ALLOWED_REQUEST_PURPOSES.includes(requestedPurpose)) {
    issues.push({
      code: 'INVALID_REQUEST_PURPOSE',
      message: 'requestedPurpose is not admitted by this packet.',
      field: 'requestedPurpose',
      expected: ALLOWED_REQUEST_PURPOSES.join('|'),
      actual: requestedPurpose
    });
  }

  if (
    input.requestId !== undefined &&
    input.requestId !== null &&
    !requestId
  ) {
    issues.push({
      code: 'REQUEST_ID_INVALID',
      message: 'requestId must be a non-empty string when supplied.',
      field: 'requestId'
    });
  }

  if (
    requestedPurpose === DEFAULT_REQUEST_PURPOSE &&
    !requestId
  ) {
    issues.push({
      code: 'LIVE_REQUEST_ID_REQUIRED',
      message:
        'A live geometry-resolution request requires an explicit correlation identity.',
      field: 'requestId'
    });
  }

  if (
    !requestId &&
    requestedPurpose &&
    requestedPurpose !== DEFAULT_REQUEST_PURPOSE &&
    !deterministicFallbackAllowed
  ) {
    issues.push({
      code: 'DETERMINISTIC_REQUEST_ID_FALLBACK_NOT_ALLOWED',
      message:
        'Deterministic request identity fallback is limited to preview and test purposes.',
      field: 'requestedPurpose',
      actual: requestedPurpose
    });
  }

  return issues;
}

/**
 * Internal descriptor resolver.
 *
 * This callable is intentionally not exported. It exists for isolated internal
 * composition and may not be used as a caller-controlled authority-injection
 * surface.
 */
function resolveHEarthSourceObjectGeometryRequestFromDescriptors({
  sourceObjectId,
  objectDescriptor,
  objectZoneBinding,
  zoneDescriptor,
  landscapeRegionProfile,
  latticeObjectHint,
  requestedPurpose,
  requestId
}) {
  const issues = checkDescriptorResolverInput({
    sourceObjectId,
    requestedPurpose,
    requestId
  });

  if (!objectDescriptor) {
    issues.push({
      code: 'OBJECT_DESCRIPTOR_MISSING',
      message: 'Authoritative object descriptor was not resolved.'
    });
  }

  if (!objectZoneBinding) {
    issues.push({
      code: 'OBJECT_ZONE_BINDING_MISSING',
      message: 'Authoritative object-zone binding was not resolved.'
    });
  }

  if (!zoneDescriptor) {
    issues.push({
      code: 'ZONE_DESCRIPTOR_MISSING',
      message: 'Authoritative zone descriptor was not resolved.'
    });
  }

  if (!landscapeRegionProfile) {
    issues.push({
      code: 'LANDSCAPE_REGION_MISSING',
      message: 'Authoritative landscape region profile was not resolved.'
    });
  }

  if (!latticeObjectHint) {
    issues.push({
      code: 'LATTICE_OBJECT_HINT_MISSING',
      message: 'Authoritative lattice object hint was not resolved.'
    });
  }

  if (
    objectDescriptor &&
    objectDescriptor.objectId !== sourceObjectId
  ) {
    issues.push({
      code: 'OBJECT_IDENTITY_MISMATCH',
      message: 'Object descriptor identity does not match sourceObjectId.',
      expected: sourceObjectId,
      actual: objectDescriptor.objectId
    });
  }

  if (
    objectZoneBinding &&
    objectZoneBinding.objectId !== sourceObjectId
  ) {
    issues.push({
      code: 'OBJECT_ZONE_BINDING_IDENTITY_MISMATCH',
      message: 'Object-zone binding identity does not match sourceObjectId.',
      expected: sourceObjectId,
      actual: objectZoneBinding.objectId
    });
  }

  const resolvedZoneId =
    objectZoneBinding?.zoneId ??
    objectDescriptor?.zoneId ??
    null;

  if (!resolvedZoneId) {
    issues.push({
      code: 'ZONE_IDENTITY_MISSING',
      message: 'No authoritative zone identity was resolved.'
    });
  }

  if (
    objectDescriptor?.zoneId &&
    objectZoneBinding?.zoneId &&
    objectDescriptor.zoneId !== objectZoneBinding.zoneId
  ) {
    issues.push({
      code: 'OBJECT_ZONE_DESCRIPTOR_DISAGREEMENT',
      message:
        'Object descriptor and object-zone binding disagree on zone identity.',
      expected: objectZoneBinding.zoneId,
      actual: objectDescriptor.zoneId
    });
  }

  if (
    zoneDescriptor &&
    zoneDescriptor.zoneId !== resolvedZoneId
  ) {
    issues.push({
      code: 'ZONE_IDENTITY_MISMATCH',
      message: 'Zone descriptor identity does not match object zone.',
      expected: resolvedZoneId,
      actual: zoneDescriptor.zoneId
    });
  }

  if (
    landscapeRegionProfile &&
    landscapeRegionProfile.zoneId !== resolvedZoneId
  ) {
    issues.push({
      code: 'ZONE_REGION_DISAGREEMENT',
      message: 'Landscape region does not belong to the resolved zone.',
      expected: resolvedZoneId,
      actual: landscapeRegionProfile.zoneId
    });
  }

  if (
    latticeObjectHint &&
    latticeObjectHint.objectId !== sourceObjectId
  ) {
    issues.push({
      code: 'LANDSCAPE_REGION_OBJECT_HINT_MISMATCH',
      message: 'Lattice hint identity does not match sourceObjectId.',
      expected: sourceObjectId,
      actual: latticeObjectHint.objectId
    });
  }

  if (
    latticeObjectHint &&
    latticeObjectHint.primaryZoneId !== resolvedZoneId
  ) {
    issues.push({
      code: 'LATTICE_HINT_ZONE_MISMATCH',
      message: 'Lattice hint primary zone does not match resolved zone.',
      expected: resolvedZoneId,
      actual: latticeObjectHint.primaryZoneId
    });
  }

  const primaryObjectHints =
    landscapeRegionProfile?.primaryObjectHints ?? null;

  if (!Array.isArray(primaryObjectHints)) {
    issues.push({
      code: 'INVALID_REGION_PRIMARY_OBJECT_HINTS',
      message:
        'Landscape region primaryObjectHints must be a valid array before object-membership checks.'
    });
  } else if (!primaryObjectHints.includes(sourceObjectId)) {
    issues.push({
      code: 'LANDSCAPE_REGION_OBJECT_HINT_MISMATCH',
      message:
        'Landscape region does not identify sourceObjectId as a primary object hint.',
      expected: sourceObjectId,
      actual: primaryObjectHints.join('|')
    });
  }

  const derivedRows =
    deriveInclusiveRows(landscapeRegionProfile?.rowRange);

  if (!derivedRows || derivedRows.length === 0) {
    issues.push({
      code: 'EMPTY_DERIVED_LATTICE_SELECTION',
      message: 'No valid lattice rows could be derived.'
    });
  }

  const preferredRows =
    latticeObjectHint?.preferredRows ?? null;

  const preferredColumns =
    latticeObjectHint?.preferredColumns ?? null;

  const preferredRowsValid =
    Array.isArray(preferredRows) &&
    preferredRows.length > 0 &&
    preferredRows.every(
      (row) =>
        Number.isInteger(row) &&
        row >= 1 &&
        row <= 16
    );

  if (!preferredRowsValid) {
    issues.push({
      code: 'INVALID_LATTICE_ROWS',
      message:
        'Preferred rows must be non-empty valid lattice rows.'
    });
  }

  if (
    derivedRows &&
    preferredRowsValid &&
    !arraysEqual(derivedRows, preferredRows)
  ) {
    issues.push({
      code: 'DECLARED_RANGE_DOES_NOT_MATCH_REGION_PROFILE',
      message:
        'Lattice object-hint rows do not match rows derived from the region profile.',
      expected: derivedRows.join(','),
      actual: preferredRows.join(',')
    });
  }

  if (
    derivedRows &&
    preferredRowsValid &&
    preferredRows.some((row) => !derivedRows.includes(row))
  ) {
    issues.push({
      code: 'OBJECT_HINT_OUTSIDE_REGION',
      message:
        'One or more object-hint rows fall outside the region.'
    });
  }

  const preferredColumnsValid =
    Array.isArray(preferredColumns) &&
    preferredColumns.length > 0 &&
    preferredColumns.every(
      (column) =>
        Number.isInteger(column) &&
        column >= 1 &&
        column <= 16
    );

  if (!preferredColumnsValid) {
    issues.push({
      code: 'INVALID_LATTICE_COLUMNS',
      message:
        'Preferred columns must be non-empty valid lattice columns.'
    });
  }

  if (
    landscapeRegionProfile?.surfaceFamily !== 'wetSand'
  ) {
    issues.push({
      code: 'UNSUPPORTED_SURFACE_FAMILY',
      message: 'This packet supports only wetSand.',
      expected: 'wetSand',
      actual: landscapeRegionProfile?.surfaceFamily ?? null
    });
  }

  if (
    landscapeRegionProfile?.primitiveIntent !==
    'contouredTerrainBand'
  ) {
    issues.push({
      code: 'UNSUPPORTED_PRIMITIVE_INTENT',
      message: 'This packet supports only contouredTerrainBand.',
      expected: 'contouredTerrainBand',
      actual: landscapeRegionProfile?.primitiveIntent ?? null
    });
  }

  if (
    sourceObjectId !== WET_SAND_OBJECT_ID ||
    sourceObjectId !== H_EARTH_PRIMARY_INSPECTION_TARGET
  ) {
    issues.push({
      code: 'SOURCE_OBJECT_NOT_PRIMARY_INSPECTION_TARGET',
      message:
        'Packet 001 admits only the current primary wet-sand inspection object.',
      expected: H_EARTH_PRIMARY_INSPECTION_TARGET,
      actual: sourceObjectId
    });
  }

  if (
    resolvedZoneId &&
    resolvedZoneId !== WET_SAND_ZONE_ID
  ) {
    issues.push({
      code: 'UNSUPPORTED_ZONE',
      message: 'Packet 001 admits only the foreground inspection zone.',
      expected: WET_SAND_ZONE_ID,
      actual: resolvedZoneId
    });
  }

  if (
    landscapeRegionProfile?.regionId !== WET_SAND_REGION_ID
  ) {
    issues.push({
      code: 'UNSUPPORTED_LANDSCAPE_REGION',
      message: 'Packet 001 admits only the foreground inspection region.',
      expected: WET_SAND_REGION_ID,
      actual: landscapeRegionProfile?.regionId ?? null
    });
  }

  if (issues.length > 0) {
    return makeRejectedResult({
      sourceObjectId,
      requestedPurpose,
      requestId,
      issues
    });
  }

  const correlationIdentity =
    makeCorrelationIdentity({
      sourceObjectId,
      requestedPurpose,
      requestId
    });

  const providerRequestId =
    makeProviderRequestId({
      sourceObjectId,
      requestedPurpose,
      requestId: correlationIdentity
    });

  const resolutionReceiptId =
    makeResolutionReceiptId(providerRequestId);

  const latticeSelection = Object.freeze({
    regionIds: Object.freeze([
      landscapeRegionProfile.regionId
    ]),

    rows: freezeArray(derivedRows),

    preferredColumns:
      freezeArray(preferredColumns),

    derivationStatus:
      'DERIVED_FROM_CURRENT_LANDSCAPE_AUTHORITY',

    sourceContractId:
      H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT.contractId,

    sourceRegionId:
      landscapeRegionProfile.regionId,

    sourceObjectHintId:
      latticeObjectHint.objectId,

    resolverCreatesLatticeAuthority: false
  });

  const materialIntent = Object.freeze({
    materialKey:
      landscapeRegionProfile.materialKey,

    materialFamily: 'WET_SAND',

    authorityClass:
      'SOURCE_DERIVED_MATERIAL_INTENT',

    rendererMaterialResolved: false,
    backendMaterialCreated: false
  });

  const providerSelection = Object.freeze({
    providerId: GROUND_PROVIDER_ID,
    providerImplementationFile:
      GROUND_PROVIDER_IMPLEMENTATION_FILE,
    providerImplementationContractId:
      GROUND_PROVIDER_IMPLEMENTATION_CONTRACT_ID,
    providerIdentityRelationship:
      'LOGICAL_PROVIDER_ID_TO_CURRENT_IMPLEMENTATION_CONTRACT',
    selectionRuleId:
      WET_SAND_PROVIDER_SELECTION_RULE_ID,

    selectionBasis: Object.freeze([
      `surfaceFamily:${landscapeRegionProfile.surfaceFamily}`,
      `primitiveIntent:${landscapeRegionProfile.primitiveIntent}`,
      `zoneId:${resolvedZoneId}`
    ]),

    resolverCreatesProviderAuthority: false,
    resolverImportsProviderImplementation: false,
    resolverInvokesProvider: false
  });

  const sourceResolution = Object.freeze({
    sourceObjectId,
    zoneId: resolvedZoneId,

    objectContractId:
      H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

    zoneContractId:
      H_EARTH_GROUND_CELL_001_ZONES_CONTRACT.contractId,

    landscapeContractId:
      H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT.contractId,

    sourceRole:
      'PRIMARY_INSPECTION_TARGET',

    objectZoneRole:
      objectZoneBinding?.zoneRole ??
      objectDescriptor?.zoneRole ??
      null,

    publicStageReadable:
      latticeObjectHint.publicStageReadable === true,

    resolverCreatesObjectAuthority: false,
    resolverCreatesZoneAuthority: false,
    resolverCreatesLandscapeAuthority: false
  });

  const providerInput = Object.freeze({
    sourceObjectId,
    zoneId: resolvedZoneId,

    surfaceFamily:
      landscapeRegionProfile.surfaceFamily,

    primitiveIntent:
      landscapeRegionProfile.primitiveIntent,

    depthBand:
      landscapeRegionProfile.depthBand,

    inspectionRelevance: 'PRIMARY',

    sourceRole:
      'PRIMARY_INSPECTION_TARGET',

    providerConstructionDependsOnInspectionRole: false,
    provenancePreservesInspectionRole: true,

    renderPriorityHint:
      landscapeRegionProfile.renderPriorityHint,

    latticeSelection,
    materialIntent
  });

  return Object.freeze({
    ok: true,
    status: 'SOURCE_OBJECT_GEOMETRY_REQUEST_RESOLVED',

    contractId:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,

    sourceObjectId,
    requestedPurpose,
    requestId: correlationIdentity,

    providerId: GROUND_PROVIDER_ID,
    providerRequestId,
    resolutionReceiptId,

    sourceResolution,
    providerSelection,
    latticeSelection,
    materialIntent,
    providerInput,

    issues: EMPTY_FROZEN_ARRAY
  });
}

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT =
  Object.freeze({
    contractId:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,

    file: SOURCE_FILE,

    packetId:
      'API_SURFACE_PACKET_001',

    packetName:
      'WET_SAND_IDENTITY_BEARING_GEOMETRY_CORRIDOR',

    fileClass:
      'SOURCE_OBJECT_IDENTITY_TO_PROVIDER_REQUEST_RESOLUTION_ADAPTER',

    publicResolutionMode:
      'IDENTITY_BASED_INTERNAL_AUTHORITY_LOOKUP',

    firstSourceObjectId:
      WET_SAND_OBJECT_ID,

    firstZoneId:
      WET_SAND_ZONE_ID,

    firstLandscapeRegionId:
      WET_SAND_REGION_ID,

    selectedProviderId:
      GROUND_PROVIDER_ID,

    declaredProviderImplementationTarget: Object.freeze({
      providerImplementationFile:
        GROUND_PROVIDER_IMPLEMENTATION_FILE,
      providerImplementationContractId:
        GROUND_PROVIDER_IMPLEMENTATION_CONTRACT_ID,
      relationship:
        'DECLARED_PROVIDER_IMPLEMENTATION_TARGET_NOT_DIRECTLY_IMPORTED_NOT_INVOKED'
    }),

    providerSelectionRuleId:
      WET_SAND_PROVIDER_SELECTION_RULE_ID,

    publicResolverAcceptsIdentities: true,
    publicResolverAcceptsCallerAuthorityObjects: false,
    internalDescriptorResolverAllowed: true,
    externalDescriptorInjectionRejected: true,

    identifierOwnership: Object.freeze({
      requestId:
        'CALLER_OPTIONAL_CORRELATION_IDENTITY',

      providerRequestId:
        'SOURCE_OBJECT_GEOMETRY_RESOLUTION_ADAPTER',

      geometryCandidateId:
        'GEOMETRY_PROVIDER',

      admissionRequestId:
        'PROVIDER_RESULT_ADMISSION_ADAPTER',

      admissionReceiptId:
        'WEST_ADMISSION',

      admittedGeometryId:
        'WEST_ADMISSION',

      geometryIndexEntryId:
        'GEOMETRY_INDEX',

      correspondenceId:
        'GEOMETRY_CORRESPONDENCE_REGISTRY',

      compositorNodeId:
        'COMPOSITOR_ADAPTER_OR_COMPOSITOR',

      renderInstanceId:
        'RENDER_BACKEND'
    }),

    directAuthorityDependencies: Object.freeze([
      Object.freeze({
        file:
          '/h-earth-3d/objects/ground-cell-001.objects.js',

        contractId:
          H_EARTH_GROUND_CELL_001_OBJECTS_CONTRACT.contractId,

        relationship:
          'AUTHORITATIVE_SOURCE_OBJECT_LOOKUP'
      }),

      Object.freeze({
        file:
          '/h-earth-3d/zones/ground-cell-001.zones.js',

        contractId:
          H_EARTH_GROUND_CELL_001_ZONES_CONTRACT.contractId,

        relationship:
          'AUTHORITATIVE_ZONE_LOOKUP'
      }),

      Object.freeze({
        file:
          '/h-earth-3d/zones/ground-cell-001.landscape-lattice.js',

        contractId:
          H_EARTH_256_LATTICE_LANDSCAPE_CONTRACT.contractId,

        relationship:
          'AUTHORITATIVE_LANDSCAPE_REGION_AND_OBJECT_HINT_LOOKUP'
      })
    ]),

    allowedPublicInputKeys:
      ALLOWED_PUBLIC_INPUT_KEYS,

    allowedRequestPurposes:
      ALLOWED_REQUEST_PURPOSES,

    liveOccurrenceRequestRequiresExplicitRequestId: true,
    deterministicRequestKeyFallbackAllowedForPreviewAndTestOnly: true,

    providerImplementationImported: false,
    providerInvoked: false,
    candidateGeometryConstructed: false,
    WestAdmissionInvoked: false,
    geometryIndexMutated: false,
    correspondenceRegistryMutated: false,
    compositorInvoked: false,
    rendererInvoked: false,
    runtimeInvoked: false
  });

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_BOUNDARIES =
  Object.freeze({
    identityTranslationOnly: true,
    authoritativeDescriptorLookupInternal: true,
    callerAuthorityObjectInjectionAllowed: false,

    createsSourceObjectAuthority: false,
    createsZoneAuthority: false,
    createsLandscapeAuthority: false,
    createsProviderAuthority: false,
    createsMaterialAuthority: false,
    createsAdmissionAuthority: false,
    createsGeometryIndexAuthority: false,
    createsCorrespondenceAuthority: false,
    createsCompositorAuthority: false,
    createsRendererAuthority: false,
    createsActionAuthority: false,
    createsReadoutAuthority: false,
    createsReceiptAuthority: false,
    createsStateAuthority: false,

    providerImplementationImported: false,
    providerExecuted: false,
    geometryConstructed: false,
    geometryCandidateCreated: false,
    admissionRequestCreated: false,
    admissionExecuted: false,
    admissionReceiptCreated: false,
    admittedGeometryCreated: false,
    geometryIndexRegistrationExecuted: false,
    correspondenceRegistrationExecuted: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,

    liveRuntimeActivated: false,
    actionExecuted: false,
    readoutExecuted: false,
    receiptOccurrenceGenerated: false,
    receiptPersisted: false,
    stateCommitted: false,
    serializationExecuted: false,
    replayExecuted: false,

    rendererMaterialResolved: false,
    shaderCreated: false,
    textureCreated: false,
    backendResourceCreated: false,

    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    visualPassClaim: false,
    matrixCollapse: false
  });

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_PROVIDER_RULES =
  Object.freeze({
    ruleSetId:
      'H_EARTH_SOURCE_OBJECT_GEOMETRY_PROVIDER_RULES_PACKET_001',

    supportedMappings: Object.freeze([
      Object.freeze({
        sourceObjectId:
          WET_SAND_OBJECT_ID,

        zoneId:
          WET_SAND_ZONE_ID,

        landscapeRegionId:
          WET_SAND_REGION_ID,

        surfaceFamily:
          'wetSand',

        primitiveIntent:
          'contouredTerrainBand',

        providerId:
          GROUND_PROVIDER_ID,

        providerImplementationFile:
          GROUND_PROVIDER_IMPLEMENTATION_FILE,

        providerImplementationContractId:
          GROUND_PROVIDER_IMPLEMENTATION_CONTRACT_ID,

        selectionRuleId:
          WET_SAND_PROVIDER_SELECTION_RULE_ID,

        inspectionRole:
          'PRIMARY_INSPECTION_TARGET'
      })
    ]),

    providerRoutingScope:
      'PACKET_001_WET_SAND_ONLY',

    universalProviderRegistryClaim: false,
    providerImplementationAuthority: false,
    providerInvocationAuthority: false
  });

export function checkHEarthSourceObjectGeometryResolution(input) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      ok: false,
      status: 'SOURCE_OBJECT_GEOMETRY_RESOLUTION_INPUT_REJECTED',
      normalizedInput: Object.freeze({
        sourceObjectId: null,
        requestedPurpose: null,
        requestId: null
      }),
      issues: freezeIssues([
        {
          code: 'RESOLUTION_INPUT_NOT_RECORD',
          message:
            'Resolution input must be a strict plain-record object.'
        }
      ])
    });
  }

  for (const key of Object.keys(input)) {
    if (!ALLOWED_PUBLIC_INPUT_KEY_SET.has(key)) {
      issues.push({
        code: FORBIDDEN_PUBLIC_DESCRIPTOR_KEYS.includes(key)
          ? 'EXTERNAL_DESCRIPTOR_INJECTION_REJECTED'
          : 'UNKNOWN_PUBLIC_INPUT_KEY_REJECTED',
        message: FORBIDDEN_PUBLIC_DESCRIPTOR_KEYS.includes(key)
          ? 'Caller-supplied authority descriptors are not accepted by the public resolver.'
          : 'The public resolution surface accepts only declared input keys.',
        field: key
      });
    }
  }

  issues.push(...checkDescriptorResolverInput({
    sourceObjectId: input.sourceObjectId,
    requestedPurpose:
      input.requestedPurpose ?? DEFAULT_REQUEST_PURPOSE,
    requestId: input.requestId
  }));

  const sourceObjectId =
    normalizeRequiredString(input.sourceObjectId);

  if (
    sourceObjectId &&
    !isHEarthGroundCell001ObjectId(sourceObjectId)
  ) {
    issues.push({
      code: 'UNKNOWN_SOURCE_OBJECT',
      message: 'sourceObjectId is not recognized by object authority.',
      field: 'sourceObjectId',
      actual: sourceObjectId
    });
  }

  if (
    sourceObjectId &&
    sourceObjectId !== WET_SAND_OBJECT_ID
  ) {
    issues.push({
      code: 'SOURCE_OBJECT_NOT_SUPPORTED_BY_PACKET',
      message:
        'Packet 001 supports only the foreground wet-sand object.',
      expected: WET_SAND_OBJECT_ID,
      actual: sourceObjectId
    });
  }

  const requestedPurpose =
    normalizeRequiredString(input.requestedPurpose) ??
    DEFAULT_REQUEST_PURPOSE;

  const requestId =
    normalizeOptionalString(input.requestId);

  return Object.freeze({
    ok: issues.length === 0,

    status:
      issues.length === 0
        ? 'SOURCE_OBJECT_GEOMETRY_RESOLUTION_INPUT_ACCEPTED'
        : 'SOURCE_OBJECT_GEOMETRY_RESOLUTION_INPUT_REJECTED',

    normalizedInput: Object.freeze({
      sourceObjectId,
      requestedPurpose,
      requestId
    }),

    issues: freezeIssues(issues)
  });
}

export function resolveHEarthSourceObjectGeometryRequest(input) {
  const inputCheck =
    checkHEarthSourceObjectGeometryResolution(input);

  if (!inputCheck.ok) {
    return makeRejectedResult({
      sourceObjectId:
        inputCheck.normalizedInput?.sourceObjectId ?? null,

      requestedPurpose:
        inputCheck.normalizedInput?.requestedPurpose ?? null,

      requestId:
        inputCheck.normalizedInput?.requestId ?? null,

      issues: inputCheck.issues
    });
  }

  const {
    sourceObjectId,
    requestedPurpose,
    requestId
  } = inputCheck.normalizedInput;

  const objectDescriptor =
    getHEarthGroundCell001ObjectDescriptor(sourceObjectId);

  const objectZoneBinding =
    getHEarthGroundCell001ObjectZoneBinding(sourceObjectId);

  const zoneId =
    objectZoneBinding?.zoneId ??
    objectDescriptor?.zoneId ??
    null;

  const zoneDescriptor =
    zoneId && isHEarthGroundCell001ZoneId(zoneId)
      ? getHEarthGroundCell001ZoneDescriptor(zoneId)
      : null;

  const landscapeRegionProfile =
    H_EARTH_256_LATTICE_REGION_PROFILES
      .FOREGROUND_INSPECTION_GROUND ??
    null;

  const latticeObjectHint =
    H_EARTH_256_LATTICE_OBJECT_HINTS[sourceObjectId] ??
    null;

  return resolveHEarthSourceObjectGeometryRequestFromDescriptors({
    sourceObjectId,
    objectDescriptor,
    objectZoneBinding,
    zoneDescriptor,
    landscapeRegionProfile,
    latticeObjectHint,
    requestedPurpose,
    requestId
  });
}

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_RECEIPT =
  Object.freeze({
    receiptId:
      'H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_SOURCE_RECEIPT_PACKET_001',

    contractId:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,

    sourceFile:
      SOURCE_FILE,

    sourceConstructed: true,
    canonicalAdmissionClaimed: false,
    repositoryInstallationClaimed: false,

    publicIdentityBasedResolverDefined: true,
    internalAuthorityLookupDefined: true,
    callerDescriptorInjectionRejected: true,
    unknownPublicKeyRejectionDefined: true,
    strictPlainRecordInputRequired: true,
    upstreamArrayShapeGuardsDefined: true,
    explicitLiveRequestIdLawDefined: true,
    deterministicPreviewAndTestFallbackLawDefined: true,
    logicalProviderToImplementationBridgeDefined: true,

    providerSelectionRuleDefined: true,
    providerRequestConstructionDefined: true,
    latticeSelectionDerivationDefined: true,
    exactPrimaryInspectionRolePreserved: true,
    sourceDerivedMaterialIntentPreserved: true,

    providerImplementationImported: false,
    providerExecuted: false,
    geometryCandidateConstructed: false,
    WestAdmissionExecuted: false,
    geometryIndexRegistrationExecuted: false,
    correspondenceRegistrationExecuted: false,
    compositorExecution: false,
    rendererExecution: false,
    runtimeExecution: false,

    moduleSyntaxVerified: false,
    importResolutionVerified: false,
    moduleInitializationVerified: false,
    isolatedBehaviorTestsVerified: false,

    boundary:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_BOUNDARIES
  });

export function getHEarthSourceObjectGeometryResolutionReceipt() {
  return H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_RECEIPT;
}

export const H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_AGGREGATE =
  Object.freeze({
    contractId:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,

    contract:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT,

    boundaries:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_BOUNDARIES,

    providerRules:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_PROVIDER_RULES,

    receipt:
      H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_RECEIPT,

    resolveHEarthSourceObjectGeometryRequest,
    checkHEarthSourceObjectGeometryResolution,
    getHEarthSourceObjectGeometryResolutionReceipt
  });

export default H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_AGGREGATE;
