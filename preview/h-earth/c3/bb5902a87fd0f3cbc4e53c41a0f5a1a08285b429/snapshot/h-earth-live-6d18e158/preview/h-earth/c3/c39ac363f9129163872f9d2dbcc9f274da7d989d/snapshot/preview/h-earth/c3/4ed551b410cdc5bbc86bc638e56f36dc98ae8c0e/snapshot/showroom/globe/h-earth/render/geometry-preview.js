/**
 * /showroom/globe/h-earth/render/geometry-preview.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Preserves the Packet 001 wet-sand translation role while passing the exact
 * environment-owned shoreline occurrence and executable world translation to
 * the existing ground provider.
 */

import {
  H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,
  resolveHEarthSourceObjectGeometryRequest
} from '../../../../h-earth-3d/integration/h-earth.source-object-geometry-resolution.js';

import {
  H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
  H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
  evaluateHEarth3DWetSandNumericConstructionProfile,
  evaluateHEarth3DSharedShorelineBoundary
} from '../environment.js';

import {
  H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS,
  constructHEarthGroundProvider,
  isHEarthGroundProviderResult
} from './geometry-ground.js';

export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1';

const SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-preview.js';

const EXPECTED_PACKET_001_CONTRACT_ID =
  H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID;

const EXPECTED_ENVIRONMENT_CONTRACT_ID =
  H_EARTH_3D_ENVIRONMENT_CONTRACT_ID;

const EXPECTED_ENVIRONMENT_PROFILE_ID =
  'H_EARTH_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE_v1';

const EXPECTED_PROVIDER_IMPLEMENTATION_FILE =
  '/showroom/globe/h-earth/render/geometry-ground.js';

const EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

const EXPECTED_SOURCE_OBJECT_ID =
  'OBJ_002_FOREGROUND_WET_SAND';

const EXPECTED_ZONE_ID =
  'ZONE_001_FOREGROUND_INSPECTION_ZONE';

const EXPECTED_REGION_ID =
  'FOREGROUND_INSPECTION_GROUND';

const EXPECTED_PROVIDER_ROLE = 'GROUND';

const DEFAULT_REQUEST_PURPOSE =
  'WET_SAND_GEOMETRY_PREVIEW';

const DEFAULT_REQUEST_ID =
  'H_EARTH_WET_SAND_PREVIEW_DEFAULT_REQUEST';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Object.isFrozen(value)
  ) {
    return value;
  }
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  for (const nestedValue of Object.values(value)) {
    deepFreeze(nestedValue, seen);
  }
  return Object.freeze(value);
}

function isPlainRecord(value) {
  if (
    value === null ||
    typeof value !== 'object' ||
    Array.isArray(value)
  ) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return (
    prototype === Object.prototype ||
    prototype === null
  );
}

function isFiniteNumber(value) {
  return typeof value === 'number' &&
    Number.isFinite(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' &&
    value.trim().length > 0;
}

function arraysEqual(left, right) {
  return (
    Array.isArray(left) &&
    Array.isArray(right) &&
    left.length === right.length &&
    left.every(
      (value, index) => value === right[index]
    )
  );
}

function clamp(value, minimum, maximum) {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

function freezeIssues(issues) {
  return deepFreeze(
    issues.map((issue) => ({
      code: issue.code,
      message: issue.message,
      field: issue.field ?? null,
      expected: issue.expected ?? null,
      actual: issue.actual ?? null,
      details: issue.details ?? null
    }))
  );
}

function normalizeInput(input) {
  return deepFreeze({
    sourceObjectId:
      isNonEmptyString(input?.sourceObjectId)
        ? input.sourceObjectId.trim()
        : EXPECTED_SOURCE_OBJECT_ID,
    requestedPurpose:
      isNonEmptyString(input?.requestedPurpose)
        ? input.requestedPurpose.trim()
        : DEFAULT_REQUEST_PURPOSE,
    requestId:
      isNonEmptyString(input?.requestId)
        ? input.requestId.trim()
        : DEFAULT_REQUEST_ID,
    shorelineBoundary:
      input?.shorelineBoundary ??
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
  });
}

function buildRejectedResult({
  sourceObjectId = null,
  requestId = null,
  requestedPurpose = null,
  shorelineBoundary = null,
  issues = []
}) {
  return deepFreeze({
    ok: false,
    status:
      'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_REJECTED',
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
    requestId,
    providerRequestId: null,
    resolutionReceiptId: null,
    requestedPurpose,
    sourceObjectId,
    sourceObjectIds: EMPTY_FROZEN_ARRAY,
    sourceZoneIds: EMPTY_FROZEN_ARRAY,
    latticeRegionIds: EMPTY_FROZEN_ARRAY,
    profileId: null,
    shorelineBoundary:
      shorelineBoundary ?? null,
    shorelineBoundaryId:
      shorelineBoundary?.boundaryId ?? null,
    shorelineBoundaryContractId:
      shorelineBoundary?.boundaryContractId ?? null,
    translationReceipt: null,
    providerInputReceipt: null,
    providerResult: null,
    primitives: EMPTY_FROZEN_ARRAY,
    bounds: null,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    worldTranslationApplied: false,
    localHeightFieldConstructionVerified: false,
    issues: freezeIssues(issues)
  });
}

function hashStringToUnitFloat(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return (hash >>> 0) / 4294967295;
}

function buildPhaseContext(phaseSeed) {
  const basePhase =
    hashStringToUnitFloat(phaseSeed) *
    Math.PI *
    2;
  return deepFreeze({
    phaseSeed,
    basePhase,
    phaseX: basePhase,
    phaseZ: basePhase / 2
  });
}

function normalizeAxisCoordinate(
  value,
  minimum,
  maximum
) {
  const span = maximum - minimum;
  return isFiniteNumber(span) && span > 0
    ? (value - minimum) / span
    : 0;
}

function buildHeightFieldDescriptor(
  wetSandProfile
) {
  const xAxis =
    wetSandProfile.samplingPolicy.xAxis;
  const zAxis =
    wetSandProfile.samplingPolicy.zAxis;
  const elevation =
    wetSandProfile.elevationIntent;
  const law =
    wetSandProfile.heightLaw;
  const phase =
    buildPhaseContext(
      law.microRelief.phaseSeed
    );

  return deepFreeze({
    descriptorId:
      `${wetSandProfile.profileId}:HEIGHT_FIELD_DESCRIPTOR`,
    descriptorType:
      'HEIGHT_FIELD',
    coordinateSpace:
      wetSandProfile.coordinatePolicy
        .descriptorCoordinateSpace,
    xDomain: deepFreeze({
      minimum: xAxis.minimum,
      maximum: xAxis.maximum,
      topology: 'OPEN'
    }),
    zDomain: deepFreeze({
      minimum: zAxis.minimum,
      maximum: zAxis.maximum,
      topology: 'OPEN'
    }),
    evaluator(localX, localZ) {
      const normalizedX =
        normalizeAxisCoordinate(
          localX,
          xAxis.minimum,
          xAxis.maximum
        );
      const normalizedZ =
        normalizeAxisCoordinate(
          localZ,
          zAxis.minimum,
          zAxis.maximum
        );

      const gradient =
        law.gradient.coefficient *
        normalizedZ;

      const microRelief =
        law.microRelief.amplitude *
        Math.sin(
          normalizedX *
          Math.PI *
          law.microRelief.frequencyX +
          phase.phaseX
        ) *
        Math.sin(
          normalizedZ *
          Math.PI *
          law.microRelief.frequencyZ +
          phase.phaseZ
        );

      return clamp(
        elevation.baseElevation +
          gradient +
          microRelief,
        elevation.minimumHeightClamp,
        elevation.maximumHeightClamp
      );
    },
    metadata: deepFreeze({
      profileId:
        wetSandProfile.profileId,
      lawId:
        law.lawId,
      phaseSeed:
        law.microRelief.phaseSeed,
      sampledElevationValuesCreatedHere:
        true
    })
  });
}

function buildPreviewPrimitiveId(
  packet001Result
) {
  return [
    'H_EARTH_WET_SAND_PREVIEW_PRIMITIVE',
    packet001Result.providerRequestId
  ].join(':');
}

function buildProviderDescriptor({
  packet001Result,
  wetSandProfile,
  shorelineBoundary
}) {
  const worldTranslation =
    wetSandProfile.transformIntent
      .worldTranslation;

  return deepFreeze({
    enabled: true,
    strategy:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy.HEIGHT_FIELD,
    primitiveId:
      buildPreviewPrimitiveId(
        packet001Result
      ),
    semanticRole:
      'PRIMARY_INSPECTION_WET_SAND_GROUND_SURFACE',
    materialHint: deepFreeze({
      materialKey:
        packet001Result.materialIntent
          .materialKey,
      materialIntentId:
        wetSandProfile.materialIntentId
    }),
    source: deepFreeze({
      sourceType:
        'H_EARTH_PACKET_001_PLUS_ENVIRONMENT_WET_SAND_PROFILE',
      packet001ContractId:
        packet001Result.contractId,
      environmentContractId:
        H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
      environmentProfileId:
        wetSandProfile.profileId,
      shorelineBoundaryId:
        shorelineBoundary.boundaryId
    }),
    metadata: deepFreeze({
      requestId:
        packet001Result.requestId,
      providerRequestId:
        packet001Result.providerRequestId,
      resolutionReceiptId:
        packet001Result.resolutionReceiptId,
      sourceObjectId:
        packet001Result.sourceObjectId,
      zoneId:
        packet001Result.sourceResolution
          .zoneId,
      latticeRegionIds:
        packet001Result.latticeSelection
          .regionIds,
      latticeRows:
        packet001Result.latticeSelection
          .rows,
      latticeColumns:
        packet001Result.latticeSelection
          .preferredColumns,
      sourceRole:
        packet001Result.providerInput
          .sourceRole,
      inspectionRelevance:
        packet001Result.providerInput
          .inspectionRelevance,
      surfaceFamily:
        packet001Result.providerInput
          .surfaceFamily,
      primitiveIntent:
        packet001Result.providerInput
          .primitiveIntent,
      depthBand:
        packet001Result.providerInput
          .depthBand,
      renderPriorityHint:
        packet001Result.providerInput
          .renderPriorityHint,
      packet001ContractId:
        packet001Result.contractId,
      environmentContractId:
        EXPECTED_ENVIRONMENT_CONTRACT_ID,
      environmentProfileId:
        wetSandProfile.profileId,
      shorelineBoundaryId:
        shorelineBoundary.boundaryId,
      shorelineBoundaryContractId:
        shorelineBoundary.boundaryContractId,
      shorelineOrientation:
        shorelineBoundary.orientation,
      shorelineEndpointIds:
        shorelineBoundary.endpointIds,
      worldTranslationDeferred: false,
      worldTranslationIntent:
        worldTranslation,
      worldTranslationApplied: true,
      localHeightFieldTranslationDefined:
        true,
      localHeightFieldConstructionVerified:
        false,
      worldPositionedPreviewClaimed: false
    }),
    flatPlane: null,
    heightField: deepFreeze({
      descriptor:
        buildHeightFieldDescriptor(
          wetSandProfile
        ),
      xSampleCount:
        wetSandProfile.samplingPolicy
          .xSampleCount,
      zSampleCount:
        wetSandProfile.samplingPolicy
          .zSampleCount,
      shorelineBoundary,
      worldTranslation
    }),
    explicitTriangleMesh: null
  });
}

export function checkHEarthWetSandPreviewTranslationInput(
  input
) {
  const issues = [];
  if (!isPlainRecord(input)) {
    return deepFreeze({
      ok: false,
      status:
        'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_REJECTED',
      normalizedInput:
        normalizeInput({}),
      issues: freezeIssues([
        {
          code:
            'PREVIEW_TRANSLATION_INPUT_NOT_RECORD',
          message:
            'Preview translation input must be a plain record.'
        }
      ])
    });
  }

  const allowedKeys = new Set([
    'sourceObjectId',
    'requestedPurpose',
    'requestId',
    'shorelineBoundary'
  ]);

  for (const key of Object.keys(input)) {
    if (!allowedKeys.has(key)) {
      issues.push({
        code:
          'UNKNOWN_PREVIEW_INPUT_KEY_REJECTED',
        message:
          'Preview translation accepts only declared input keys.',
        field: key
      });
    }
  }

  const normalizedInput =
    normalizeInput(input);

  if (
    normalizedInput.sourceObjectId !==
    EXPECTED_SOURCE_OBJECT_ID
  ) {
    issues.push({
      code:
        'SOURCE_OBJECT_ID_MISMATCH',
      message:
        'Wet-sand preview requires the exact wet-sand source object.',
      expected:
        EXPECTED_SOURCE_OBJECT_ID,
      actual:
        normalizedInput.sourceObjectId
    });
  }

  if (
    !isNonEmptyString(
      normalizedInput.requestId
    )
  ) {
    issues.push({
      code:
        'REQUEST_ID_MISSING',
      message:
        'requestId is required.'
    });
  }

  const boundaryEvaluation =
    evaluateHEarth3DSharedShorelineBoundary(
      normalizedInput.shorelineBoundary
    );

  if (
    boundaryEvaluation.eligible !== true
  ) {
    issues.push({
      code:
        'SHARED_SHORELINE_BOUNDARY_INVALID',
      message:
        'Wet-sand preview requires one lawful environment-owned shoreline boundary.',
      details:
        boundaryEvaluation
    });
  }

  return deepFreeze({
    ok: issues.length === 0,
    status:
      issues.length === 0
        ? 'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_ACCEPTED'
        : 'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_REJECTED',
    normalizedInput,
    issues:
      freezeIssues(issues)
  });
}

export function evaluateHEarthWetSandPreviewCorrespondence({
  packet001Result,
  wetSandProfile,
  shorelineBoundary =
    H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
}) {
  const issues = [];

  const profileEvaluation =
    evaluateHEarth3DWetSandNumericConstructionProfile(
      wetSandProfile
    );

  const boundaryEvaluation =
    evaluateHEarth3DSharedShorelineBoundary(
      shorelineBoundary
    );

  if (
    packet001Result?.contractId !==
    EXPECTED_PACKET_001_CONTRACT_ID
  ) {
    issues.push({
      code:
        'PACKET_001_CONTRACT_ID_MISMATCH',
      message:
        'Packet 001 contract identity does not match.',
      expected:
        EXPECTED_PACKET_001_CONTRACT_ID,
      actual:
        packet001Result?.contractId ?? null
    });
  }

  if (
    packet001Result?.sourceObjectId !==
    EXPECTED_SOURCE_OBJECT_ID
  ) {
    issues.push({
      code:
        'PACKET_001_SOURCE_OBJECT_MISMATCH',
      message:
        'Packet 001 does not resolve the wet-sand source object.'
    });
  }

  if (
    packet001Result?.sourceResolution
      ?.zoneId !== EXPECTED_ZONE_ID
  ) {
    issues.push({
      code:
        'PACKET_001_ZONE_MISMATCH',
      message:
        'Packet 001 wet-sand zone identity does not match.'
    });
  }

  if (
    !Array.isArray(
      packet001Result?.latticeSelection
        ?.regionIds
    ) ||
    !packet001Result.latticeSelection
      .regionIds.includes(
        EXPECTED_REGION_ID
      )
  ) {
    issues.push({
      code:
        'PACKET_001_REGION_MISMATCH',
      message:
        'Packet 001 wet-sand region identity does not match.'
    });
  }

  if (
    packet001Result?.providerSelection
      ?.providerImplementationFile !==
      EXPECTED_PROVIDER_IMPLEMENTATION_FILE ||
    packet001Result?.providerSelection
      ?.providerImplementationContractId !==
      EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID
  ) {
    issues.push({
      code:
        'GROUND_PROVIDER_SELECTION_MISMATCH',
      message:
        'Packet 001 provider selection does not match the existing ground provider.'
    });
  }

  if (
    profileEvaluation.eligible !== true
  ) {
    issues.push({
      code:
        'WET_SAND_PROFILE_INVALID',
      message:
        'The environment wet-sand profile is not eligible.',
      details:
        profileEvaluation
    });
  }

  if (
    wetSandProfile?.profileId !==
    EXPECTED_ENVIRONMENT_PROFILE_ID
  ) {
    issues.push({
      code:
        'WET_SAND_PROFILE_ID_MISMATCH',
      message:
        'The environment wet-sand profile identity does not match.'
    });
  }

  if (
    boundaryEvaluation.eligible !== true ||
    shorelineBoundary !==
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
  ) {
    issues.push({
      code:
        'SHARED_BOUNDARY_OCCURRENCE_MISMATCH',
      message:
        'Wet-sand construction must consume the exact environment-owned shoreline occurrence.'
    });
  }

  if (
    shorelineBoundary?.sampleCount !==
    wetSandProfile?.samplingPolicy
      ?.xSampleCount
  ) {
    issues.push({
      code:
        'BOUNDARY_X_SAMPLE_COUNT_MISMATCH',
      message:
        'The shoreline sample count must equal the wet-sand X sample count.',
      expected:
        wetSandProfile?.samplingPolicy
          ?.xSampleCount ?? null,
      actual:
        shorelineBoundary?.sampleCount ??
        null
    });
  }

  return deepFreeze({
    ok: issues.length === 0,
    status:
      issues.length === 0
        ? 'H_EARTH_WET_SAND_PREVIEW_CORRESPONDENCE_ACCEPTED'
        : 'H_EARTH_WET_SAND_PREVIEW_CORRESPONDENCE_REJECTED',
    issues: freezeIssues(issues)
  });
}

export function translateHEarthWetSandPreviewProviderInput({
  packet001Result,
  wetSandProfile,
  shorelineBoundary =
    H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
}) {
  const correspondence =
    evaluateHEarthWetSandPreviewCorrespondence({
      packet001Result,
      wetSandProfile,
      shorelineBoundary
    });

  if (!correspondence.ok) {
    return deepFreeze({
      ok: false,
      status:
        'H_EARTH_WET_SAND_PREVIEW_PROVIDER_TRANSLATION_REJECTED',
      translationReceipt: null,
      providerInputReceipt: null,
      providerInput: null,
      issues:
        correspondence.issues
    });
  }

  const providerInput =
    deepFreeze({
      providerId:
        packet001Result.providerId,
      providerRole:
        EXPECTED_PROVIDER_ROLE,
      sourceZoneIds:
        deepFreeze([
          packet001Result.sourceResolution
            .zoneId
        ]),
      sourceObjectIds:
        deepFreeze([
          packet001Result.sourceObjectId
        ]),
      descriptor:
        buildProviderDescriptor({
          packet001Result,
          wetSandProfile,
          shorelineBoundary
        })
    });

  const translationReceipt =
    deepFreeze({
      receiptId:
        `${packet001Result.providerRequestId}:PREVIEW_TRANSLATION_RECEIPT`,
      status:
        'H_EARTH_WET_SAND_PREVIEW_PROVIDER_TRANSLATION_ACCEPTED',
      packet001ContractId:
        packet001Result.contractId,
      environmentContractId:
        EXPECTED_ENVIRONMENT_CONTRACT_ID,
      environmentProfileId:
        wetSandProfile.profileId,
      sourceObjectId:
        packet001Result.sourceObjectId,
      sourceZoneIds:
        providerInput.sourceZoneIds,
      latticeRegionIds:
        packet001Result.latticeSelection
          .regionIds,
      latticeRows:
        packet001Result.latticeSelection
          .rows,
      latticeColumns:
        packet001Result.latticeSelection
          .preferredColumns,
      providerImplementationFile:
        packet001Result.providerSelection
          .providerImplementationFile,
      providerImplementationContractId:
        packet001Result.providerSelection
          .providerImplementationContractId,
      topLevelProviderInputKeys:
        deepFreeze(
          Object.keys(providerInput).sort()
        ),
      exactTopLevelShapeVerified:
        arraysEqual(
          Object.keys(providerInput).sort(),
          [
            'descriptor',
            'providerId',
            'providerRole',
            'sourceObjectIds',
            'sourceZoneIds'
          ]
        ),
      shorelineBoundaryId:
        shorelineBoundary.boundaryId,
      shorelineBoundaryContractId:
        shorelineBoundary.boundaryContractId,
      shorelineOrientation:
        shorelineBoundary.orientation,
      shorelineEndpointIds:
        shorelineBoundary.endpointIds,
      shorelineSampleCount:
        shorelineBoundary.sampleCount,
      exactSharedBoundaryOccurrence:
        true,
      localHeightFieldTranslationDefined:
        true,
      localHeightFieldConstructionVerified:
        false,
      worldTranslationApplicationPerformed:
        true,
      worldPositionedPreviewClaimed:
        false,
      admitted: false,
      WestAdmissionPerformed: false,
      geometryIndexMutated: false
    });

  const providerInputReceipt =
    deepFreeze({
      receiptId:
        `${packet001Result.providerRequestId}:PROVIDER_INPUT_RECEIPT`,
      providerId:
        providerInput.providerId,
      providerRole:
        providerInput.providerRole,
      sourceZoneIds:
        providerInput.sourceZoneIds,
      sourceObjectIds:
        providerInput.sourceObjectIds,
      descriptorPrimitiveId:
        providerInput.descriptor
          .primitiveId,
      descriptorStrategy:
        providerInput.descriptor.strategy,
      descriptorSemanticRole:
        providerInput.descriptor
          .semanticRole,
      materialHint:
        providerInput.descriptor
          .materialHint,
      shorelineBoundaryId:
        shorelineBoundary.boundaryId,
      worldTranslation:
        wetSandProfile.transformIntent
          .worldTranslation,
      toleranceContextIncluded: false,
      admitted: false
    });

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_WET_SAND_PREVIEW_PROVIDER_TRANSLATION_ACCEPTED',
    translationReceipt,
    providerInputReceipt,
    providerInput,
    issues:
      EMPTY_FROZEN_ARRAY
  });
}

function validateGroundProviderPreviewResult({
  providerInput,
  providerResult,
  shorelineBoundary
}) {
  const issues = [];

  if (
    !isHEarthGroundProviderResult(
      providerResult
    ) ||
    providerResult.valid !== true ||
    providerResult.ineligible !== false ||
    providerResult.fatal !== false ||
    providerResult.constructionStatus !==
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus.VALID
  ) {
    issues.push({
      code:
        'GROUND_PROVIDER_RESULT_NOT_LAWFUL',
      message:
        'Ground provider result does not satisfy the provider-result law.'
    });
  }

  if (
    !arraysEqual(
      providerResult?.sourceObjectIds,
      providerInput.sourceObjectIds
    )
  ) {
    issues.push({
      code:
        'GROUND_PROVIDER_RESULT_SOURCE_OBJECT_IDS_MISMATCH',
      message:
        'Ground provider result does not preserve source-object provenance.'
    });
  }

  if (
    !arraysEqual(
      providerResult?.sourceZoneIds,
      providerInput.sourceZoneIds
    )
  ) {
    issues.push({
      code:
        'GROUND_PROVIDER_RESULT_SOURCE_ZONE_IDS_MISMATCH',
      message:
        'Ground provider result does not preserve source-zone provenance.'
    });
  }

  const primitives =
    Array.isArray(providerResult?.primitives)
      ? providerResult.primitives
      : EMPTY_FROZEN_ARRAY;

  const primitive =
    primitives[0];

  if (
    primitives.length !== 1 ||
    primitive?.metadata
      ?.shorelineBoundaryId !==
      shorelineBoundary.boundaryId ||
    primitive?.metadata
      ?.shorelineBoundaryContractId !==
      shorelineBoundary.boundaryContractId ||
    primitive?.metadata
      ?.worldTranslationApplied !==
      true
  ) {
    issues.push({
      code:
        'GROUND_PROVIDER_SHARED_BOUNDARY_CORRESPONDENCE_MISSING',
      message:
        'Wet-sand primitive must preserve the exact shoreline identity and applied world translation.'
    });
  }

  return deepFreeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    primitives:
      issues.length === 0
        ? deepFreeze([...primitives])
        : EMPTY_FROZEN_ARRAY,
    bounds:
      issues.length === 0
        ? providerResult.bounds
        : null
  });
}

export function constructHEarthWetSandPreview({
  packet001Result,
  wetSandProfile,
  shorelineBoundary =
    H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
}) {
  const translation =
    translateHEarthWetSandPreviewProviderInput({
      packet001Result,
      wetSandProfile,
      shorelineBoundary
    });

  if (!translation.ok) {
    return buildRejectedResult({
      sourceObjectId:
        packet001Result?.sourceObjectId ??
        null,
      requestId:
        packet001Result?.requestId ?? null,
      requestedPurpose:
        packet001Result?.requestedPurpose ??
        null,
      shorelineBoundary,
      issues:
        translation.issues
    });
  }

  const providerResult =
    constructHEarthGroundProvider(
      translation.providerInput
    );

  const validation =
    validateGroundProviderPreviewResult({
      providerInput:
        translation.providerInput,
      providerResult,
      shorelineBoundary
    });

  if (!validation.ok) {
    return buildRejectedResult({
      sourceObjectId:
        packet001Result.sourceObjectId,
      requestId:
        packet001Result.requestId,
      requestedPurpose:
        packet001Result.requestedPurpose,
      shorelineBoundary,
      issues:
        validation.issues
    });
  }

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_WET_SAND_PREVIEW_CONSTRUCTION_COMPLETE',
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
    requestId:
      packet001Result.requestId,
    providerRequestId:
      packet001Result.providerRequestId,
    resolutionReceiptId:
      packet001Result.resolutionReceiptId,
    sourceObjectId:
      packet001Result.sourceObjectId,
    sourceObjectIds:
      translation.providerInput
        .sourceObjectIds,
    sourceZoneIds:
      translation.providerInput
        .sourceZoneIds,
    latticeRegionIds:
      packet001Result.latticeSelection
        .regionIds,
    profileId:
      wetSandProfile.profileId,
    shorelineBoundary,
    shorelineBoundaryId:
      shorelineBoundary.boundaryId,
    shorelineBoundaryContractId:
      shorelineBoundary.boundaryContractId,
    shorelineOrientation:
      shorelineBoundary.orientation,
    shorelineEndpointIds:
      shorelineBoundary.endpointIds,
    shorelineSampleIds:
      deepFreeze(
        shorelineBoundary.samples.map(
          (sample) => sample.sampleId
        )
      ),
    translationReceipt:
      translation.translationReceipt,
    providerInputReceipt:
      translation.providerInputReceipt,
    providerResult,
    primitives:
      validation.primitives,
    bounds:
      validation.bounds,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    worldTranslationApplied: true,
    localHeightFieldConstructionVerified:
      true,
    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function previewHEarthWetSandGeometry(
  input
) {
  const inputCheck =
    checkHEarthWetSandPreviewTranslationInput(
      input
    );

  if (!inputCheck.ok) {
    return buildRejectedResult({
      sourceObjectId:
        inputCheck.normalizedInput
          .sourceObjectId,
      requestId:
        inputCheck.normalizedInput.requestId,
      requestedPurpose:
        inputCheck.normalizedInput
          .requestedPurpose,
      shorelineBoundary:
        inputCheck.normalizedInput
          .shorelineBoundary,
      issues:
        inputCheck.issues
    });
  }

  const packet001Result =
    resolveHEarthSourceObjectGeometryRequest({
      sourceObjectId:
        inputCheck.normalizedInput
          .sourceObjectId,
      requestedPurpose:
        inputCheck.normalizedInput
          .requestedPurpose,
      requestId:
        inputCheck.normalizedInput
          .requestId
    });

  return constructHEarthWetSandPreview({
    packet001Result,
    wetSandProfile:
      H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,
    shorelineBoundary:
      inputCheck.normalizedInput
        .shorelineBoundary
  });
}

export const H_EARTH_3D_GEOMETRY_PREVIEW_BOUNDARIES =
  deepFreeze({
    previewTranslationAuthorityOnly: true,
    previewProviderInvocationOnly: true,
    ownsPacket001SemanticResolution: false,
    ownsEnvironmentNumericProfile: false,
    ownsSharedBoundarySource: false,
    ownsProviderSelectionAuthority: false,
    ownsProviderImplementationAuthority: false,
    ownsWestAdmissionAuthority: false,
    ownsGeometryIndexAuthority: false,
    ownsCompositorAuthority: false,
    ownsRendererAuthority: false,
    ownsRuntimeAuthority: false,
    performsProviderInvocation: true,
    performsWestAdmission: false,
    mutatesGeometryIndex: false,
    createsCompositorNode: false,
    createsRenderInstance: false,
    activatesRenderer: false,
    activatesRuntime: false,
    validationClaim: false,
    productionClaim: false,
    deploymentClaim: false,
    visualPassClaim: false,
    matrixCollapse: false
  });

export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
    file:
      SOURCE_FILE,
    role:
      'PACKET_001_WET_SAND_PROVIDER_TRANSLATION_AND_PREVIEW_CONSTRUCTION',
    packet001DependencyContractId:
      EXPECTED_PACKET_001_CONTRACT_ID,
    environmentDependencyContractId:
      EXPECTED_ENVIRONMENT_CONTRACT_ID,
    environmentProfileId:
      EXPECTED_ENVIRONMENT_PROFILE_ID,
    sharedBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    providerImplementationFile:
      EXPECTED_PROVIDER_IMPLEMENTATION_FILE,
    providerImplementationContractId:
      EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID,
    directSeamTranslationCallableDefined:
      true,
    conveniencePreviewCallableDefined:
      true,
    exactTopLevelProviderShapeRequired:
      true,
    exactProviderInvocationCountPolicy:
      'ONE_INVOCATION_PER_SUCCESSFUL_PREVIEW_CONSTRUCTION',
    boundary:
      H_EARTH_3D_GEOMETRY_PREVIEW_BOUNDARIES
  });

export const H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_PREVIEW_TRANSLATION_RECEIPT_v1',
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
    sourceFile:
      SOURCE_FILE,
    packet001DependencyRecorded:
      true,
    environmentDependencyRecorded:
      true,
    providerDependencyRecorded:
      true,
    sharedBoundaryDependencyRecorded:
      true,
    directSeamTranslationCallableDefined:
      true,
    conveniencePreviewCallableDefined:
      true,
    provisionalLatticePolicyChecksDefined:
      true,
    deterministicHeightLawTranslationDefined:
      true,
    exactTopLevelProviderInputShapeDefined:
      true,
    exactProviderResultValidationDefined:
      true,
    previewOnlyContainmentDefined:
      true,
    localHeightFieldTranslationDefined:
      true,
    localHeightFieldConstructionVerified:
      false,
    worldTranslationApplicationPerformed:
      true,
    worldPositionedPreviewClaimed:
      false,
    moduleSyntaxVerified:
      false,
    importResolutionVerified:
      false,
    moduleInitializationVerified:
      false,
    isolatedBehaviorVerified:
      false,
    boundary:
      H_EARTH_3D_GEOMETRY_PREVIEW_BOUNDARIES
  });

export function getHEarth3DGeometryPreviewReceipt() {
  return H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT;
}

export const H_EARTH_3D_GEOMETRY_PREVIEW_AGGREGATE =
  deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
    contract:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT,
    boundaries:
      H_EARTH_3D_GEOMETRY_PREVIEW_BOUNDARIES,
    receipt:
      H_EARTH_3D_GEOMETRY_PREVIEW_RECEIPT,
    checkHEarthWetSandPreviewTranslationInput,
    evaluateHEarthWetSandPreviewCorrespondence,
    translateHEarthWetSandPreviewProviderInput,
    constructHEarthWetSandPreview,
    previewHEarthWetSandGeometry,
    getHEarth3DGeometryPreviewReceipt
  });

export default H_EARTH_3D_GEOMETRY_PREVIEW_AGGREGATE;
