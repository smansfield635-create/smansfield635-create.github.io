/**
 * /showroom/globe/h-earth/render/geometry-preview.js
 * COMPLETE RENEWED FILE CANDIDATE
 *
 * H_EARTH_3D_GEOMETRY_PREVIEW_FILE_RENEWAL_STEP_034O_6_PREVIEW_PACKET_001_WET_SAND_PROVIDER_TRANSLATION_v1
 *
 * Renews:
 * H_EARTH_3D_GEOMETRY_PREVIEW_FILE_BIRTH_STEP_034O_PREVIEW_PROVIDER_INSPECTION_v1
 *
 * Layer:
 * H-Earth Layer 4 · Showroom Execution Corridor
 *
 * Role:
 * PACKET_001_WET_SAND_PROVIDER_TRANSLATION_AND_PREVIEW_CONSTRUCTION
 *
 * Purpose:
 * Consume one lawful Packet 001 wet-sand semantic source-resolution result and
 * one lawful environment-owned wet-sand numeric construction profile, then
 * translate those two controlling seam occurrences into the exact callable
 * shape required by the existing ground provider and invoke that provider
 * exactly once for preview-only construction.
 *
 * This file owns:
 * - preview translation input validation
 * - Packet 001 / environment correspondence checks
 * - provisional lattice-policy correspondence checks
 * - deterministic height-law translation into provider-facing descriptor form
 * - exact provider-call payload construction
 * - preview-only provider invocation
 * - exact provider-result validation plus preview-specific containment checks
 * - bounded preview result construction
 * - preview translation receipt
 *
 * This file does not own:
 * - Packet 001 semantic source resolution authority
 * - environment numeric-profile authority
 * - provider selection authority
 * - provider implementation authority
 * - West admission
 * - admitted-geometry identity
 * - geometry-index mutation
 * - correspondence registration
 * - compositor node creation
 * - render-instance creation
 * - renderer activation
 * - runtime execution
 * - action execution
 * - readout construction
 * - receipt issuance
 * - persistence
 * - validation
 * - production
 * - deployment
 * - visual-pass approval
 * - matrix collapse
 */

import {
  H_EARTH_SOURCE_OBJECT_GEOMETRY_RESOLUTION_CONTRACT_ID,
  resolveHEarthSourceObjectGeometryRequest
} from '../../../../h-earth-3d/integration/h-earth.source-object-geometry-resolution.js';

import {
  H_EARTH_3D_ENVIRONMENT_CONTRACT_ID,
  H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE,
  evaluateHEarth3DWetSandNumericConstructionProfile
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

const EXPECTED_PROVIDER_ROLE =
  'GROUND';

const DEFAULT_SOURCE_OBJECT_ID =
  EXPECTED_SOURCE_OBJECT_ID;

const DEFAULT_REQUEST_PURPOSE =
  'WET_SAND_GEOMETRY_PREVIEW';

const DEFAULT_REQUEST_ID =
  'H_EARTH_WET_SAND_PREVIEW_DEFAULT_REQUEST';

const EMPTY_FROZEN_ARRAY = Object.freeze([]);

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

function isPlainRecord(value) {
  return (
    value !== null &&
    typeof value === 'object' &&
    Array.isArray(value) === false &&
    Object.getPrototypeOf(value) === Object.prototype
  );
}

function isFiniteNumber(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function normalizeRequiredString(value) {
  return isNonEmptyString(value)
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

function clamp(value, minimum, maximum) {
  return Math.min(
    Math.max(value, minimum),
    maximum
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
        actual: issue.actual ?? null,
        details: issue.details ?? null
      })
    )
  );
}

function buildRejectedResult({
  sourceObjectId = null,
  requestId = null,
  requestedPurpose = null,
  issues = []
}) {
  return Object.freeze({
    ok: false,
    status:
      'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_REJECTED',

    contractId:
      H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,

    requestId,
    providerRequestId: null,
    resolutionReceiptId: null,

    sourceObjectId,
    sourceZoneIds: EMPTY_FROZEN_ARRAY,
    latticeRegionIds: EMPTY_FROZEN_ARRAY,

    profileId: null,

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

function buildNormalizedConvenienceInput(input) {
  return Object.freeze({
    sourceObjectId:
      normalizeRequiredString(input?.sourceObjectId) ??
      DEFAULT_SOURCE_OBJECT_ID,

    requestedPurpose:
      normalizeRequiredString(input?.requestedPurpose) ??
      DEFAULT_REQUEST_PURPOSE,

    requestId:
      normalizeOptionalString(input?.requestId) ??
      DEFAULT_REQUEST_ID
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

function hashStringToRadians(value) {
  return hashStringToUnitFloat(value) * Math.PI * 2;
}

function buildPhaseContext(phaseSeed) {
  const basePhase =
    hashStringToRadians(phaseSeed);

  return deepFreeze({
    phaseSeed,
    basePhase,
    phaseX:
      basePhase,
    phaseZ:
      basePhase / 2
  });
}

function buildPreviewPrimitiveId(packet001Result) {
  return [
    'H_EARTH_WET_SAND_PREVIEW_PRIMITIVE',
    packet001Result.providerRequestId
  ].join(':');
}

function normalizeAxisCoordinate(value, minimum, maximum) {
  const span =
    maximum - minimum;

  if (!isFiniteNumber(span) || span <= 0) {
    return 0;
  }

  return (value - minimum) / span;
}

export function checkHEarthWetSandPreviewTranslationInput(input) {
  const issues = [];

  if (!isPlainRecord(input)) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_REJECTED',

      normalizedInput:
        buildNormalizedConvenienceInput({}),

      issues: freezeIssues([
        {
          code: 'PREVIEW_TRANSLATION_INPUT_NOT_RECORD',
          message:
            'Preview translation input must be a strict plain-record object.'
        }
      ])
    });
  }

  const allowedInputKeys = Object.freeze([
    'sourceObjectId',
    'requestedPurpose',
    'requestId'
  ]);

  const allowedInputKeySet =
    new Set(allowedInputKeys);

  for (const key of Object.keys(input)) {
    if (!allowedInputKeySet.has(key)) {
      issues.push({
        code: 'UNKNOWN_PREVIEW_INPUT_KEY_REJECTED',
        message:
          'Preview translation accepts only declared input keys.',
        field: key
      });
    }
  }

  const normalizedInput =
    buildNormalizedConvenienceInput(input);

  if (!normalizedInput.sourceObjectId) {
    issues.push({
      code: 'SOURCE_OBJECT_ID_MISSING',
      message:
        'sourceObjectId is required.',
      field: 'sourceObjectId'
    });
  }

  if (!normalizedInput.requestedPurpose) {
    issues.push({
      code: 'REQUEST_PURPOSE_MISSING',
      message:
        'requestedPurpose is required.',
      field: 'requestedPurpose'
    });
  }

  if (!normalizedInput.requestId) {
    issues.push({
      code: 'REQUEST_ID_MISSING',
      message:
        'requestId is required.',
      field: 'requestId'
    });
  }

  return Object.freeze({
    ok: issues.length === 0,

    status:
      issues.length === 0
        ? 'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_ACCEPTED'
        : 'H_EARTH_WET_SAND_PREVIEW_TRANSLATION_INPUT_REJECTED',

    normalizedInput,
    issues: freezeIssues(issues)
  });
}

export function evaluateHEarthWetSandPreviewCorrespondence({
  packet001Result,
  wetSandProfile
}) {
  const issues = [];

  if (!isPlainRecord(packet001Result)) {
    issues.push({
      code: 'PACKET_001_RESULT_NOT_RECORD',
      message:
        'packet001Result must be a plain-record object.',
      field: 'packet001Result'
    });
  }

  if (!isPlainRecord(wetSandProfile)) {
    issues.push({
      code: 'WET_SAND_PROFILE_NOT_RECORD',
      message:
        'wetSandProfile must be a plain-record object.',
      field: 'wetSandProfile'
    });
  }

  if (issues.length > 0) {
    return Object.freeze({
      ok: false,
      status:
        'H_EARTH_WET_SAND_PREVIEW_CORRESPONDENCE_REJECTED',
      issues: freezeIssues(issues)
    });
  }

  const profileEvaluation =
    evaluateHEarth3DWetSandNumericConstructionProfile(
      wetSandProfile
    );

  const regionIds =
    Array.isArray(
      packet001Result?.latticeSelection?.regionIds
    )
      ? packet001Result.latticeSelection.regionIds
      : null;

  const packetRows =
    Array.isArray(
      packet001Result?.latticeSelection?.rows
    )
      ? packet001Result.latticeSelection.rows
      : null;

  const packetColumns =
    Array.isArray(
      packet001Result?.latticeSelection?.preferredColumns
    )
      ? packet001Result.latticeSelection.preferredColumns
      : null;

  const packetProviderImplementationFile =
    packet001Result?.providerSelection?.providerImplementationFile ??
    null;

  const packetProviderImplementationContractId =
    packet001Result?.providerSelection?.providerImplementationContractId ??
    null;

  const profileProviderImplementationFile =
    wetSandProfile?.semanticDependencies?.providerImplementationFile ??
    null;

  const profileProviderImplementationContractId =
    wetSandProfile?.semanticDependencies?.providerImplementationContractId ??
    null;

  const packetZoneId =
    packet001Result?.sourceResolution?.zoneId ?? null;

  if (packet001Result.ok !== true) {
    issues.push({
      code: 'PACKET_001_RESULT_NOT_OK',
      message:
        'Packet 001 result must be lawful before preview translation.',
      details: packet001Result?.status ?? null
    });
  }

  if (
    packet001Result.contractId !==
    EXPECTED_PACKET_001_CONTRACT_ID
  ) {
    issues.push({
      code: 'PACKET_001_CONTRACT_ID_MISMATCH',
      message:
        'Packet 001 contract ID does not match the expected controlling occurrence.',
      expected:
        EXPECTED_PACKET_001_CONTRACT_ID,
      actual:
        packet001Result.contractId ?? null
    });
  }

  if (
    profileEvaluation.eligible !== true
  ) {
    issues.push({
      code: 'WET_SAND_PROFILE_NOT_ELIGIBLE',
      message:
        'Environment wet-sand numeric construction profile must be eligible.',
      details: profileEvaluation
    });
  }

  if (
    wetSandProfile.profileId !==
    EXPECTED_ENVIRONMENT_PROFILE_ID
  ) {
    issues.push({
      code: 'WET_SAND_PROFILE_ID_MISMATCH',
      message:
        'The supplied wet-sand profile is not the controlling environment occurrence.',
      expected:
        EXPECTED_ENVIRONMENT_PROFILE_ID,
      actual:
        wetSandProfile.profileId ?? null
    });
  }

  if (
    packet001Result.sourceObjectId !==
      wetSandProfile.sourceObjectId ||
    packet001Result.sourceObjectId !==
      EXPECTED_SOURCE_OBJECT_ID
  ) {
    issues.push({
      code: 'SOURCE_OBJECT_ID_MISMATCH',
      message:
        'Packet 001 source object must match both the expected source object and the environment wet-sand profile.',
      expected:
        EXPECTED_SOURCE_OBJECT_ID,
      actual:
        packet001Result.sourceObjectId ?? null
    });
  }

  if (
    packetZoneId !==
      wetSandProfile.primaryZoneId ||
    packetZoneId !==
      EXPECTED_ZONE_ID
  ) {
    issues.push({
      code: 'ZONE_ID_MISMATCH',
      message:
        'Packet 001 zone identity must match both the expected zone and the environment wet-sand profile.',
      expected:
        EXPECTED_ZONE_ID,
      actual:
        packetZoneId
    });
  }

  if (
    wetSandProfile.regionId !==
    EXPECTED_REGION_ID
  ) {
    issues.push({
      code: 'PROFILE_REGION_ID_MISMATCH',
      message:
        'Environment wet-sand profile regionId must match the expected region.',
      expected:
        EXPECTED_REGION_ID,
      actual:
        wetSandProfile.regionId ?? null
    });
  }

  if (
    !regionIds ||
    !regionIds.includes(
      wetSandProfile.regionId
    )
  ) {
    issues.push({
      code: 'REGION_ID_NOT_CONTAINED',
      message:
        'Packet 001 lattice region IDs do not contain the environment wet-sand region.',
      expected:
        wetSandProfile.regionId,
      actual:
        regionIds
    });
  }

  if (
    !arraysEqual(
      packetRows,
      wetSandProfile.latticeDerivation?.rowIndices
    )
  ) {
    issues.push({
      code: 'ROW_INDICES_MISMATCH',
      message:
        'Packet 001 rows do not match the environment wet-sand profile row indices.',
      expected:
        wetSandProfile.latticeDerivation?.rowIndices ?? null,
      actual:
        packetRows
    });
  }

  if (
    !arraysEqual(
      packetColumns,
      wetSandProfile.latticeDerivation?.columnIndices
    )
  ) {
    issues.push({
      code: 'COLUMN_INDICES_MISMATCH',
      message:
        'Packet 001 preferred columns do not match the environment wet-sand profile column indices.',
      expected:
        wetSandProfile.latticeDerivation?.columnIndices ?? null,
      actual:
        packetColumns
    });
  }

  if (
    packet001Result?.providerInput?.surfaceFamily !==
    'wetSand'
  ) {
    issues.push({
      code: 'SURFACE_FAMILY_MISMATCH',
      message:
        'Packet 001 surfaceFamily must be wetSand.',
      expected: 'wetSand',
      actual:
        packet001Result?.providerInput?.surfaceFamily ?? null
    });
  }

  if (
    packet001Result?.providerInput?.primitiveIntent !==
    'contouredTerrainBand'
  ) {
    issues.push({
      code: 'PRIMITIVE_INTENT_MISMATCH',
      message:
        'Packet 001 primitiveIntent must be contouredTerrainBand.',
      expected:
        'contouredTerrainBand',
      actual:
        packet001Result?.providerInput?.primitiveIntent ?? null
    });
  }

  if (
    wetSandProfile?.constructionStrategy !==
    'HEIGHT_FIELD'
  ) {
    issues.push({
      code: 'CONSTRUCTION_STRATEGY_MISMATCH',
      message:
        'Environment wet-sand constructionStrategy must be HEIGHT_FIELD.',
      expected: 'HEIGHT_FIELD',
      actual:
        wetSandProfile?.constructionStrategy ?? null
    });
  }

  if (
    packet001Result?.providerId !==
    wetSandProfile?.semanticDependencies?.providerId
  ) {
    issues.push({
      code: 'PROVIDER_ID_MISMATCH',
      message:
        'Packet 001 providerId does not match the environment semantic dependency providerId.',
      expected:
        wetSandProfile?.semanticDependencies?.providerId ?? null,
      actual:
        packet001Result?.providerId ?? null
    });
  }

  if (
    packetProviderImplementationFile !==
      EXPECTED_PROVIDER_IMPLEMENTATION_FILE ||
    profileProviderImplementationFile !==
      EXPECTED_PROVIDER_IMPLEMENTATION_FILE
  ) {
    issues.push({
      code: 'PROVIDER_IMPLEMENTATION_FILE_MISMATCH',
      message:
        'Packet 001 and environment profile must both target the controlling provider implementation file.',
      expected:
        EXPECTED_PROVIDER_IMPLEMENTATION_FILE,
      actual:
        deepFreeze({
          packet001:
            packetProviderImplementationFile,
          environment:
            profileProviderImplementationFile
        })
    });
  }

  if (
    packetProviderImplementationContractId !==
      EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID ||
    profileProviderImplementationContractId !==
      EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID
  ) {
    issues.push({
      code: 'PROVIDER_IMPLEMENTATION_CONTRACT_ID_MISMATCH',
      message:
        'Packet 001 and environment profile must both target the controlling provider implementation contract.',
      expected:
        EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID,
      actual:
        deepFreeze({
          packet001:
            packetProviderImplementationContractId,
          environment:
            profileProviderImplementationContractId
        })
    });
  }

  return Object.freeze({
    ok: issues.length === 0,

    status:
      issues.length === 0
        ? 'H_EARTH_WET_SAND_PREVIEW_CORRESPONDENCE_ACCEPTED'
        : 'H_EARTH_WET_SAND_PREVIEW_CORRESPONDENCE_REJECTED',

    issues: freezeIssues(issues)
  });
}

function buildHeightFieldDescriptor(wetSandProfile) {
  const xAxis =
    wetSandProfile.samplingPolicy.xAxis;

  const zAxis =
    wetSandProfile.samplingPolicy.zAxis;

  const phaseContext =
    buildPhaseContext(
      wetSandProfile.heightLaw.microRelief.phaseSeed
    );

  const xMinimum =
    xAxis.minimum;
  const xMaximum =
    xAxis.maximum;
  const zMinimum =
    zAxis.minimum;
  const zMaximum =
    zAxis.maximum;

  const baseElevation =
    wetSandProfile.elevationIntent.baseElevation;
  const minimumHeightClamp =
    wetSandProfile.elevationIntent.minimumHeightClamp;
  const maximumHeightClamp =
    wetSandProfile.elevationIntent.maximumHeightClamp;
  const gradientCoefficient =
    wetSandProfile.heightLaw.gradient.coefficient;
  const microAmplitude =
    wetSandProfile.heightLaw.microRelief.amplitude;
  const frequencyX =
    wetSandProfile.heightLaw.microRelief.frequencyX;
  const frequencyZ =
    wetSandProfile.heightLaw.microRelief.frequencyZ;
  const phaseX =
    phaseContext.phaseX;
  const phaseZ =
    phaseContext.phaseZ;

  const evaluator = ({
    x: localX,
    z: localZ
  } = {}) => {
    const normalizedX =
      normalizeAxisCoordinate(
        localX,
        xMinimum,
        xMaximum
      );

    const normalizedZ =
      normalizeAxisCoordinate(
        localZ,
        zMinimum,
        zMaximum
      );

    const gradientContribution =
      normalizedZ * gradientCoefficient;

    const microReliefContribution =
      microAmplitude *
      Math.sin(
        (normalizedX * Math.PI * 2 * frequencyX) +
          phaseX
      ) *
      Math.sin(
        (normalizedZ * Math.PI * 2 * frequencyZ) +
          phaseZ
      );

    const unclampedHeight =
      baseElevation +
      gradientContribution +
      microReliefContribution;

    return clamp(
      unclampedHeight,
      minimumHeightClamp,
      maximumHeightClamp
    );
  };

  return deepFreeze({
    descriptorId:
      `${wetSandProfile.profileId}:HEIGHT_FIELD_DESCRIPTOR`,

    descriptorType:
      'HEIGHT_FIELD',

    evaluator,

    metadata: deepFreeze({
      descriptorRole:
        'TRANSLATED_PREVIEW_HEIGHT_FIELD_DESCRIPTOR',
      normalizedInputSpace:
        wetSandProfile.heightLaw.inputSpace,
      coordinateSpace:
        wetSandProfile.coordinatePolicy.descriptorCoordinateSpace,

      baseElevation,
      minimumHeightClamp,
      maximumHeightClamp,

      shorelineGradient: deepFreeze({
        axis:
          wetSandProfile.heightLaw.shorelineAxis,
        direction:
          wetSandProfile.heightLaw.shorelineDirection,
        function:
          wetSandProfile.heightLaw.gradient.function,
        coefficient:
          gradientCoefficient,
        normalizedCoordinateLaw:
          'normalizedZ = (localZ - zMinimum) / (zMaximum - zMinimum)',
        evaluationLaw:
          'gradientContribution = normalizedZ * coefficient'
      }),

      microRelief: deepFreeze({
        function:
          wetSandProfile.heightLaw.microRelief.function,
        amplitude:
          microAmplitude,
        frequencyX,
        frequencyZ,
        phaseSeed:
          wetSandProfile.heightLaw.microRelief.phaseSeed,
        numericPhaseContext:
          phaseContext,
        evaluationLaw:
          'microReliefContribution = amplitude * sin((normalizedX * PI * 2 * frequencyX) + phaseX) * sin((normalizedZ * PI * 2 * frequencyZ) + phaseZ)'
      }),

      evaluationOrder:
        deepFreeze([
          ...wetSandProfile.heightLaw.evaluationOrder
        ]),

      clampLaw:
        'height = min(max(height, minimumHeightClamp), maximumHeightClamp)',

      localHeightFieldTranslationDefined: true,
      localHeightFieldConstructionVerified: false,
      worldTranslationApplied: false
    }),

    xDomain: deepFreeze({
      minimum:
        xMinimum,
      maximum:
        xMaximum,
      topology:
        'OPEN'
    }),

    zDomain: deepFreeze({
      minimum:
        zMinimum,
      maximum:
        zMaximum,
      topology:
        'OPEN'
    })
  });
}

function buildProviderDescriptor({
  packet001Result,
  wetSandProfile
}) {
  const primitiveId =
    buildPreviewPrimitiveId(
      packet001Result
    );

  return deepFreeze({
    enabled: true,
    strategy: 'HEIGHT_FIELD',

    primitiveId,

    semanticRole:
      'PRIMARY_INSPECTION_WET_SAND_GROUND_SURFACE',

    materialHint: deepFreeze({
      materialKey:
        packet001Result.materialIntent.materialKey,
      materialIntentId:
        wetSandProfile.materialIntentId
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
        packet001Result.sourceResolution.zoneId,
      latticeRegionIds:
        deepFreeze([
          ...packet001Result.latticeSelection.regionIds
        ]),
      latticeRows:
        deepFreeze([
          ...packet001Result.latticeSelection.rows
        ]),
      latticeColumns:
        deepFreeze([
          ...packet001Result.latticeSelection.preferredColumns
        ]),
      sourceRole:
        packet001Result.providerInput.sourceRole,
      inspectionRelevance:
        packet001Result.providerInput.inspectionRelevance,
      surfaceFamily:
        packet001Result.providerInput.surfaceFamily,
      primitiveIntent:
        packet001Result.providerInput.primitiveIntent,
      depthBand:
        packet001Result.providerInput.depthBand,
      renderPriorityHint:
        packet001Result.providerInput.renderPriorityHint,
      packet001ContractId:
        packet001Result.contractId,
      environmentContractId:
        EXPECTED_ENVIRONMENT_CONTRACT_ID,
      environmentProfileId:
        wetSandProfile.profileId,

      worldTranslationDeferred: true,
      worldTranslationIntent:
        wetSandProfile.transformIntent.worldTranslation,
      localHeightFieldTranslationDefined: true,
      localHeightFieldConstructionVerified: false,
      worldPositionedPreviewClaimed: false
    }),

    flatPlane: null,

    heightField: deepFreeze({
      descriptor:
        buildHeightFieldDescriptor(
          wetSandProfile
        ),
      xSampleCount:
        wetSandProfile.samplingPolicy.xSampleCount,
      zSampleCount:
        wetSandProfile.samplingPolicy.zSampleCount
    }),

    explicitTriangleMesh: null
  });
}

export function translateHEarthWetSandPreviewProviderInput({
  packet001Result,
  wetSandProfile
}) {
  const correspondence =
    evaluateHEarthWetSandPreviewCorrespondence({
      packet001Result,
      wetSandProfile
    });

  if (!correspondence.ok) {
    return Object.freeze({
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
        Object.freeze([
          packet001Result.sourceResolution.zoneId
        ]),

      sourceObjectIds:
        Object.freeze([
          packet001Result.sourceObjectId
        ]),

      descriptor:
        buildProviderDescriptor({
          packet001Result,
          wetSandProfile
        })
    });

  const providerInputTopLevelKeys =
    Object.keys(providerInput).sort();

  const expectedTopLevelKeys = Object.freeze([
    'descriptor',
    'providerId',
    'providerRole',
    'sourceObjectIds',
    'sourceZoneIds'
  ]);

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
        Object.freeze([
          packet001Result.sourceResolution.zoneId
        ]),

      latticeRegionIds:
        Object.freeze([
          ...packet001Result.latticeSelection.regionIds
        ]),

      latticeRows:
        Object.freeze([
          ...packet001Result.latticeSelection.rows
        ]),

      latticeColumns:
        Object.freeze([
          ...packet001Result.latticeSelection.preferredColumns
        ]),

      providerImplementationFile:
        packet001Result.providerSelection.providerImplementationFile,

      providerImplementationContractId:
        packet001Result.providerSelection.providerImplementationContractId,

      topLevelProviderInputKeys:
        Object.freeze([
          ...providerInputTopLevelKeys
        ]),

      exactTopLevelShapeVerified:
        arraysEqual(
          providerInputTopLevelKeys,
          [...expectedTopLevelKeys]
        ),

      localHeightFieldTranslationDefined: true,
      localHeightFieldConstructionVerified: false,
      worldTranslationApplicationPerformed: false,
      worldPositionedPreviewClaimed: false,

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
        providerInput.descriptor.primitiveId,

      descriptorStrategy:
        providerInput.descriptor.strategy,

      descriptorSemanticRole:
        providerInput.descriptor.semanticRole,

      materialHint:
        providerInput.descriptor.materialHint,

      toleranceContextIncluded: false,
      admitted: false
    });

  return Object.freeze({
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
  providerResult
}) {
  const issues = [];

  const providerResultLawful =
    isHEarthGroundProviderResult(providerResult) &&
    providerResult.valid === true &&
    providerResult.ineligible === false &&
    providerResult.fatal === false &&
    providerResult.constructionStatus ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus
        .VALID;

  if (providerResultLawful !== true) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_NOT_LAWFUL',
      message:
        'Ground provider result does not satisfy the exact provider result law.',
      details:
        providerResult
    });

    return Object.freeze({
      ok: false,
      issues: freezeIssues(issues),
      primitives: EMPTY_FROZEN_ARRAY,
      bounds: null
    });
  }

  const resultSourceObjectIds =
    Array.isArray(providerResult.sourceObjectIds)
      ? providerResult.sourceObjectIds
      : null;

  const resultSourceZoneIds =
    Array.isArray(providerResult.sourceZoneIds)
      ? providerResult.sourceZoneIds
      : null;

  const resultPrimitives =
    Array.isArray(providerResult.primitives)
      ? providerResult.primitives
      : null;

  const resultBounds =
    isPlainRecord(providerResult.bounds)
      ? providerResult.bounds
      : null;

  if (
    providerResult.providerId !==
    providerInput.providerId
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_PROVIDER_ID_MISMATCH',
      message:
        'Ground provider result providerId does not match the input providerId.',
      expected:
        providerInput.providerId,
      actual:
        providerResult.providerId ?? null
    });
  }

  if (
    providerResult.providerRole !==
    providerInput.providerRole
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_PROVIDER_ROLE_MISMATCH',
      message:
        'Ground provider result providerRole does not match the input providerRole.',
      expected:
        providerInput.providerRole,
      actual:
        providerResult.providerRole ?? null
    });
  }

  if (
    !arraysEqual(
      resultSourceObjectIds,
      providerInput.sourceObjectIds
    )
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_SOURCE_OBJECT_IDS_MISMATCH',
      message:
        'Ground provider result sourceObjectIds do not preserve input provenance.',
      expected:
        providerInput.sourceObjectIds,
      actual:
        resultSourceObjectIds
    });
  }

  if (
    !arraysEqual(
      resultSourceZoneIds,
      providerInput.sourceZoneIds
    )
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_SOURCE_ZONE_IDS_MISMATCH',
      message:
        'Ground provider result sourceZoneIds do not preserve input provenance.',
      expected:
        providerInput.sourceZoneIds,
      actual:
        resultSourceZoneIds
    });
  }

  if (
    !resultPrimitives ||
    resultPrimitives.length === 0
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_PRIMITIVES_MISSING',
      message:
        'Ground provider result must expose one or more preview primitives.'
    });
  }

  if (!resultBounds) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_BOUNDS_MISSING',
      message:
        'Ground provider result must expose preview bounds.'
    });
  }

  const admittedPrimitiveCount =
    Number.isSafeInteger(
      providerResult?.account?.admittedPrimitiveCount
    )
      ? providerResult.account.admittedPrimitiveCount
      : null;

  if (
    admittedPrimitiveCount !== 0
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_ADMITTED_PRIMITIVE_COUNT_FORBIDDEN',
      message:
        'Ground provider preview result may not report admitted primitives.',
      expected: 0,
      actual:
        admittedPrimitiveCount
    });
  }

  if (
    providerResult.geometryIndexEntryId !== undefined &&
    providerResult.geometryIndexEntryId !== null
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_GEOMETRY_INDEX_ID_FORBIDDEN',
      message:
        'Ground provider preview result may not create a geometry-index identity.'
    });
  }

  if (
    providerResult.compositorNodeId !== undefined &&
    providerResult.compositorNodeId !== null
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_COMPOSITOR_NODE_ID_FORBIDDEN',
      message:
        'Ground provider preview result may not create a compositor-node identity.'
    });
  }

  if (
    providerResult.renderInstanceId !== undefined &&
    providerResult.renderInstanceId !== null
  ) {
    issues.push({
      code: 'GROUND_PROVIDER_RESULT_RENDER_INSTANCE_ID_FORBIDDEN',
      message:
        'Ground provider preview result may not create a render-instance identity.'
    });
  }

  return Object.freeze({
    ok: issues.length === 0,
    issues: freezeIssues(issues),
    primitives:
      resultPrimitives
        ? deepFreeze([...resultPrimitives])
        : EMPTY_FROZEN_ARRAY,
    bounds:
      resultBounds
  });
}

export function constructHEarthWetSandPreview({
  packet001Result,
  wetSandProfile
}) {
  const translation =
    translateHEarthWetSandPreviewProviderInput({
      packet001Result,
      wetSandProfile
    });

  if (!translation.ok) {
    return buildRejectedResult({
      sourceObjectId:
        packet001Result?.sourceObjectId ?? null,
      requestId:
        packet001Result?.requestId ?? null,
      requestedPurpose:
        packet001Result?.requestedPurpose ?? null,
      issues:
        translation.issues
    });
  }

  const providerResult =
    constructHEarthGroundProvider(
      translation.providerInput
    );

  const providerValidation =
    validateGroundProviderPreviewResult({
      providerInput:
        translation.providerInput,
      providerResult
    });

  if (!providerValidation.ok) {
    return buildRejectedResult({
      sourceObjectId:
        packet001Result.sourceObjectId,
      requestId:
        packet001Result.requestId,
      requestedPurpose:
        packet001Result.requestedPurpose,
      issues:
        providerValidation.issues
    });
  }

  return Object.freeze({
    ok: true,

    status:
      'H_EARTH_WET_SAND_PREVIEW_PROVIDER_CONSTRUCTION_COMPLETE',

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

    sourceZoneIds:
      Object.freeze([
        packet001Result.sourceResolution.zoneId
      ]),

    latticeRegionIds:
      Object.freeze([
        ...packet001Result.latticeSelection.regionIds
      ]),

    profileId:
      wetSandProfile.profileId,

    translationReceipt:
      Object.freeze({
        ...translation.translationReceipt,
        localHeightFieldConstructionVerified: true
      }),

    providerInputReceipt:
      translation.providerInputReceipt,

    providerResult,

    primitives:
      providerValidation.primitives,

    bounds:
      providerValidation.bounds,

    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    worldTranslationApplied: false,
    localHeightFieldConstructionVerified: true,

    issues:
      EMPTY_FROZEN_ARRAY
  });
}

export function previewHEarthWetSandGeometry(input) {
  const inputCheck =
    checkHEarthWetSandPreviewTranslationInput(input);

  if (!inputCheck.ok) {
    return buildRejectedResult({
      sourceObjectId:
        inputCheck.normalizedInput.sourceObjectId,
      requestId:
        inputCheck.normalizedInput.requestId,
      requestedPurpose:
        inputCheck.normalizedInput.requestedPurpose,
      issues:
        inputCheck.issues
    });
  }

  const packet001Result =
    resolveHEarthSourceObjectGeometryRequest({
      sourceObjectId:
        inputCheck.normalizedInput.sourceObjectId,
      requestedPurpose:
        inputCheck.normalizedInput.requestedPurpose,
      requestId:
        inputCheck.normalizedInput.requestId
    });

  return constructHEarthWetSandPreview({
    packet001Result,
    wetSandProfile:
      H_EARTH_3D_WET_SAND_NUMERIC_CONSTRUCTION_PROFILE
  });
}

export const H_EARTH_3D_GEOMETRY_PREVIEW_BOUNDARIES =
  deepFreeze({
    previewTranslationAuthorityOnly: true,
    previewProviderInvocationOnly: true,

    ownsPacket001SemanticResolution: false,
    ownsEnvironmentNumericProfile: false,
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

    providerImplementationFile:
      EXPECTED_PROVIDER_IMPLEMENTATION_FILE,

    providerImplementationContractId:
      EXPECTED_PROVIDER_IMPLEMENTATION_CONTRACT_ID,

    directSeamTranslationCallableDefined: true,
    conveniencePreviewCallableDefined: true,
    exactTopLevelProviderShapeRequired: true,
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

    packet001DependencyRecorded: true,
    environmentDependencyRecorded: true,
    providerDependencyRecorded: true,

    directSeamTranslationCallableDefined: true,
    conveniencePreviewCallableDefined: true,

    provisionalLatticePolicyChecksDefined: true,
    deterministicHeightLawTranslationDefined: true,
    exactTopLevelProviderInputShapeDefined: true,
    exactProviderResultValidationDefined: true,
    previewOnlyContainmentDefined: true,

    localHeightFieldTranslationDefined: true,
    localHeightFieldConstructionVerified: false,
    worldTranslationApplicationPerformed: false,
    worldPositionedPreviewClaimed: false,

    moduleSyntaxVerified: false,
    importResolutionVerified: false,
    moduleInitializationVerified: false,
    isolatedBehaviorVerified: false,

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
