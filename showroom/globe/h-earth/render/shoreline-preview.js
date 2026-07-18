/**
 * /showroom/globe/h-earth/render/shoreline-preview.js
 * COMPLETE FILE
 *
 * H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1
 *
 * Corridor:
 * existing wet-sand preview
 * + native foam-contact geometry
 * + native water-surface geometry
 * -> one projection-neutral three-primitive preview aggregate
 * -> West admission
 * -> Packet 002
 *
 * This file owns aggregation only. It does not own source-object, zone,
 * lattice, material, admission, compositor, renderer, or visual authority.
 */

import {
  H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID as
    H_EARTH_3D_WET_SAND_GEOMETRY_PREVIEW_CONTRACT_ID,
  previewHEarthWetSandGeometry
} from './geometry-preview.js';

import {
  H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
  constructHEarthFoamContactGeometry
} from './geometry-foam.js';

import {
  H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
  constructHEarthWaterSurfaceGeometry
} from './geometry-water.js';

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  isHEarthNeutralPrimitiveRecord,
  isHEarthAABB3D,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';

export const H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID =
  'H_EARTH_3D_SHORELINE_PREVIEW_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

export const H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID =
  H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID;

export const H_EARTH_3D_SHORELINE_PREVIEW_SOURCE_FILE =
  '/showroom/globe/h-earth/render/shoreline-preview.js';

export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS =
  Object.freeze([
    'OBJ_002_FOREGROUND_WET_SAND',
    'OBJ_005_SHORELINE_FOAM_LINE',
    'OBJ_007_WATER_SURFACE_PLANE'
  ]);

export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS =
  Object.freeze([
    'ZONE_001_FOREGROUND_INSPECTION_ZONE',
    'ZONE_002_SHORELINE_CONTACT_ZONE',
    'ZONE_003_WATER_SURFACE_ZONE'
  ]);

export const H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS =
  Object.freeze([
    'FOREGROUND_INSPECTION_GROUND',
    'SHORELINE_CONTACT',
    'WATER_SURFACE_PLANE'
  ]);

function deepFreeze(
  value,
  seen = new WeakSet()
) {
  if (
    value === null ||
    typeof value !== 'object'
  ) {
    return value;
  }

  if (seen.has(value)) {
    return value;
  }

  seen.add(value);

  for (const nestedValue of Object.values(value)) {
    deepFreeze(
      nestedValue,
      seen
    );
  }

  return Object.freeze(value);
}

function isNonEmptyExactString(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim() === value
  );
}

function makeRejectedResult({
  requestId,
  componentResults,
  issues
}) {
  return deepFreeze({
    ok: false,
    status:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_PREVIEW_REJECTED',
    contractId:
      H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
    requestId:
      isNonEmptyExactString(requestId)
        ? requestId
        : null,
    providerRequestId: null,
    resolutionReceiptId: null,
    sourceObjectId:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS[0],
    sourceObjectIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
    sourceZoneIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
    latticeRegionIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
    profileId:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_AGGREGATE_PROFILE_v1',
    componentResults:
      deepFreeze(componentResults),
    primitives:
      Object.freeze([]),
    bounds: null,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    worldTranslationApplied: false,
    fluidSimulation: false,
    issues:
      Object.freeze([
        ...issues
      ])
  });
}

export function previewHEarthMinimumShorelineGeometry({
  sourceObjectId =
    'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose =
    'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW',
  requestId
} = {}) {
  if (
    sourceObjectId !==
      'OBJ_002_FOREGROUND_WET_SAND' ||
    requestedPurpose !==
      'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW' ||
    !isNonEmptyExactString(requestId)
  ) {
    return makeRejectedResult({
      requestId,
      componentResults: {},
      issues: [
        deepFreeze({
          code:
            'MINIMUM_SHORELINE_PREVIEW_INPUT_INVALID',
          message:
            'The minimum shoreline preview requires the exact wet-sand anchor, purpose, and requestId.'
        })
      ]
    });
  }

  const wetSandResult =
    previewHEarthWetSandGeometry({
      sourceObjectId:
        'OBJ_002_FOREGROUND_WET_SAND',
      requestedPurpose:
        'WET_SAND_GEOMETRY_PREVIEW',
      requestId:
        `${requestId}:WET_SAND`
    });

  const foamResult =
    constructHEarthFoamContactGeometry({
      requestId:
        `${requestId}:FOAM_CONTACT`
    });

  const waterResult =
    constructHEarthWaterSurfaceGeometry({
      requestId:
        `${requestId}:WATER_SURFACE`
    });

  const componentResults =
    deepFreeze({
      wetSand:
        wetSandResult,
      foamContact:
        foamResult,
      waterSurface:
        waterResult
    });

  const components = [
    wetSandResult,
    foamResult,
    waterResult
  ];

  const issues = [];

  components.forEach(
    (
      component,
      index
    ) => {
      if (
        component?.ok !== true ||
        !Array.isArray(component.primitives) ||
        component.primitives.length !== 1 ||
        !isHEarthNeutralPrimitiveRecord(
          component.primitives[0]
        ) ||
        !isHEarthAABB3D(
          component.bounds
        )
      ) {
        issues.push(
          deepFreeze({
            code:
              'MINIMUM_SHORELINE_COMPONENT_INVALID',
            message:
              'Every minimum shoreline component must provide one lawful neutral primitive and bounds.',
            componentIndex:
              index,
            componentStatus:
              component?.status ??
              null
          })
        );
      }
    }
  );

  if (issues.length > 0) {
    return makeRejectedResult({
      requestId,
      componentResults,
      issues
    });
  }

  const primitives =
    Object.freeze(
      components.flatMap(
        (component) =>
          component.primitives
      )
    );

  const bounds =
    mergeHEarthGeometryBounds(
      components.map(
        (component) =>
          component.bounds
      )
    );

  if (
    primitives.length !== 3 ||
    !isHEarthAABB3D(bounds)
  ) {
    return makeRejectedResult({
      requestId,
      componentResults,
      issues: [
        deepFreeze({
          code:
            'MINIMUM_SHORELINE_AGGREGATION_FAILED',
          message:
            'The minimum shoreline aggregate did not preserve three primitives and lawful bounds.'
        })
      ]
    });
  }

  const providerRequestId =
    `H_EARTH_PROVIDER_REQUEST:H_EARTH_MINIMUM_NATIVE_SHORELINE_PROVIDER:${H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS.join('+')}:${requestedPurpose}:${requestId}`;

  const resolutionReceiptId =
    `H_EARTH_MINIMUM_NATIVE_SHORELINE_RESOLUTION_RECEIPT:${providerRequestId}`;

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_PREVIEW_COMPLETE',
    contractId:
      H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
    requestId,
    providerRequestId,
    resolutionReceiptId,
    sourceObjectId:
      sourceObjectId,
    sourceObjectIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
    sourceZoneIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
    latticeRegionIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
    profileId:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_AGGREGATE_PROFILE_v1',
    translationReceipt:
      deepFreeze({
        receiptId:
          `${providerRequestId}:AGGREGATE_TRANSLATION_RECEIPT`,
        status:
          'H_EARTH_MINIMUM_NATIVE_SHORELINE_AGGREGATION_ACCEPTED',
        wetSandPreviewContractId:
          H_EARTH_3D_WET_SAND_GEOMETRY_PREVIEW_CONTRACT_ID,
        foamProviderContractId:
          H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
        waterProviderContractId:
          H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
        kernelFacadeContractId:
          H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
        sourceObjectIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
        sourceZoneIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
        latticeRegionIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
        primitiveCount:
          primitives.length,
        nativeFoamGeometry:
          true,
        nativeWaterGeometry:
          true,
        fluidSimulation:
          false,
        admitted:
          false
      }),
    componentResults,
    providerResult:
      deepFreeze({
        recordType:
          'H_EARTH_MINIMUM_NATIVE_SHORELINE_PROVIDER_RESULT',
        providerId:
          'H_EARTH_MINIMUM_NATIVE_SHORELINE_PROVIDER',
        providerRole:
          'SHORELINE_CONTEXT_AGGREGATOR',
        constructionStatus:
          'VALID',
        valid:
          true,
        sourceObjectIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
        sourceZoneIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
        latticeRegionIds:
          H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
        primitives,
        bounds,
        admitted:
          false,
        aggregateFrameAuthority:
          false
      }),
    primitives,
    bounds,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    worldTranslationApplied: false,
    localHeightFieldConstructionVerified:
      wetSandResult
        .localHeightFieldConstructionVerified ===
      true,
    nativeFoamGeometryConstructed:
      true,
    nativeWaterGeometryConstructed:
      true,
    fluidSimulation: false,
    issues:
      Object.freeze([])
  });
}

export function getHEarthMinimumShorelinePreviewContract() {
  return deepFreeze({
    contractId:
      H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
    sourceFile:
      H_EARTH_3D_SHORELINE_PREVIEW_SOURCE_FILE,
    sourceObjectIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
    sourceZoneIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
    latticeRegionIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
    primitiveCount:
      3,
    nativeGeometry:
      true,
    admitted:
      false,
    fluidSimulation:
      false,
    visualPassClaim:
      false,
    productionClaim:
      false
  });
}

export default Object.freeze({
  H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_PREVIEW_CONTRACT_ID,
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
  H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
  previewHEarthMinimumShorelineGeometry,
  getHEarthMinimumShorelinePreviewContract
});
