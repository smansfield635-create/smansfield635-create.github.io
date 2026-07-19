/**
 * /showroom/globe/h-earth/render/shoreline-preview.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Preserves aggregation-only authority. This file obtains the one immutable
 * environment-owned shoreline occurrence, passes that exact occurrence to
 * wet sand, foam, and water, then rejects aggregation unless all three
 * preserve the same boundary identity, orientation, endpoints, and samples.
 */

import {
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
  evaluateHEarth3DSharedShorelineBoundary
} from '../environment.js';

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

function isNonEmptyExactString(value) {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    value.trim() === value
  );
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

function expectedSampleIds(
  shorelineBoundary
) {
  return shorelineBoundary.samples.map(
    (sample) => sample.sampleId
  );
}

function componentBoundaryCorresponds({
  component,
  shorelineBoundary
}) {
  const expectedIds =
    expectedSampleIds(
      shorelineBoundary
    );

  return (
    component?.shorelineBoundary ===
      shorelineBoundary &&
    component?.shorelineBoundaryId ===
      shorelineBoundary.boundaryId &&
    component?.shorelineBoundaryContractId ===
      shorelineBoundary.boundaryContractId &&
    component?.shorelineOrientation ===
      shorelineBoundary.orientation &&
    component?.shorelineEndpointIds ===
      shorelineBoundary.endpointIds &&
    arraysEqual(
      component?.shorelineSampleIds,
      expectedIds
    ) &&
    component?.primitives?.[0]
      ?.metadata
      ?.shorelineBoundaryId ===
      shorelineBoundary.boundaryId &&
    component?.primitives?.[0]
      ?.metadata
      ?.shorelineBoundaryContractId ===
      shorelineBoundary.boundaryContractId &&
    component?.primitives?.[0]
      ?.metadata
      ?.shorelineOrientation ===
      shorelineBoundary.orientation &&
    arraysEqual(
      component?.primitives?.[0]
        ?.metadata
        ?.shorelineSampleIds,
      expectedIds
    )
  );
}

function makeRejectedResult({
  requestId,
  shorelineBoundary,
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
    shorelineBoundary:
      shorelineBoundary ?? null,
    shorelineBoundaryId:
      shorelineBoundary?.boundaryId ?? null,
    shorelineBoundaryContractId:
      shorelineBoundary?.boundaryContractId ??
      null,
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
      deepFreeze([...issues])
  });
}

export function previewHEarthMinimumShorelineGeometry({
  sourceObjectId =
    'OBJ_002_FOREGROUND_WET_SAND',
  requestedPurpose =
    'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW',
  requestId,
  shorelineBoundary =
    H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
} = {}) {
  const boundaryEvaluation =
    evaluateHEarth3DSharedShorelineBoundary(
      shorelineBoundary
    );

  if (
    sourceObjectId !==
      'OBJ_002_FOREGROUND_WET_SAND' ||
    requestedPurpose !==
      'MINIMUM_NATIVE_SHORELINE_GEOMETRY_PREVIEW' ||
    !isNonEmptyExactString(requestId) ||
    boundaryEvaluation.eligible !== true ||
    shorelineBoundary !==
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
  ) {
    return makeRejectedResult({
      requestId,
      shorelineBoundary,
      componentResults: {},
      issues: [
        deepFreeze({
          code:
            'MINIMUM_SHORELINE_PREVIEW_INPUT_INVALID',
          message:
            'The minimum shoreline preview requires the exact wet-sand anchor, purpose, requestId, and environment-owned shoreline occurrence.'
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
        `${requestId}:WET_SAND`,
      shorelineBoundary
    });

  const foamResult =
    constructHEarthFoamContactGeometry({
      requestId:
        `${requestId}:FOAM_CONTACT`,
      shorelineBoundary
    });

  const waterResult =
    constructHEarthWaterSurfaceGeometry({
      requestId:
        `${requestId}:WATER_SURFACE`,
      shorelineBoundary
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

  const componentNames = [
    'wetSand',
    'foamContact',
    'waterSurface'
  ];

  const issues = [];

  components.forEach(
    (component, index) => {
      if (
        component?.ok !== true ||
        !Array.isArray(
          component.primitives
        ) ||
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
            component:
              componentNames[index],
            componentStatus:
              component?.status ?? null
          })
        );
        return;
      }

      if (
        !componentBoundaryCorresponds({
          component,
          shorelineBoundary
        })
      ) {
        issues.push(
          deepFreeze({
            code:
              'MINIMUM_SHORELINE_SHARED_BOUNDARY_MISMATCH',
            message:
              'Every component must preserve the same shoreline occurrence, identity, orientation, endpoints, and ordered samples.',
            component:
              componentNames[index],
            expectedBoundaryId:
              shorelineBoundary.boundaryId,
            actualBoundaryId:
              component?.shorelineBoundaryId ??
              null
          })
        );
      }
    }
  );

  if (
    wetSandResult?.worldTranslationApplied !==
    true
  ) {
    issues.push(
      deepFreeze({
        code:
          'MINIMUM_SHORELINE_WET_SAND_WORLD_TRANSLATION_NOT_APPLIED',
        message:
          'Wet-sand construction must report that its intended world translation was applied.'
      })
    );
  }

  if (issues.length > 0) {
    return makeRejectedResult({
      requestId,
      shorelineBoundary,
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
      shorelineBoundary,
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

  const shorelineSampleIds =
    deepFreeze(
      expectedSampleIds(
        shorelineBoundary
      )
    );

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_PREVIEW_COMPLETE',
    contractId:
      H_EARTH_3D_SHORELINE_PREVIEW_CONTRACT_ID,
    requestId,
    providerRequestId,
    resolutionReceiptId,
    sourceObjectId,
    sourceObjectIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_OBJECT_IDS,
    sourceZoneIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_ZONE_IDS,
    latticeRegionIds:
      H_EARTH_3D_MINIMUM_NATIVE_SHORELINE_LATTICE_REGION_IDS,
    profileId:
      'H_EARTH_MINIMUM_NATIVE_SHORELINE_AGGREGATE_PROFILE_v1',
    shorelineBoundary,
    shorelineBoundaryId:
      shorelineBoundary.boundaryId,
    shorelineBoundaryContractId:
      shorelineBoundary.boundaryContractId,
    shorelineOrientation:
      shorelineBoundary.orientation,
    shorelineEndpointIds:
      shorelineBoundary.endpointIds,
    shorelineSampleIds,
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
        sharedBoundaryContractId:
          H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
        shorelineBoundaryId:
          shorelineBoundary.boundaryId,
        shorelineOrientation:
          shorelineBoundary.orientation,
        shorelineEndpointIds:
          shorelineBoundary.endpointIds,
        shorelineSampleIds,
        exactSharedBoundaryOccurrenceVerified:
          true,
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
        wetSandWorldTranslationApplied:
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
        shorelineBoundaryId:
          shorelineBoundary.boundaryId,
        sharedBoundaryCorrespondenceVerified:
          true,
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
    worldTranslationApplied: true,
    localHeightFieldConstructionVerified:
      wetSandResult
        .localHeightFieldConstructionVerified ===
      true,
    nativeFoamGeometryConstructed:
      true,
    nativeWaterGeometryConstructed:
      true,
    sharedBoundaryCorrespondenceVerified:
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
    sharedBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    aggregationAuthorityOnly:
      true,
    sharedBoundarySourceAuthority:
      false,
    primitiveCount: 3,
    nativeGeometry: true,
    admitted: false,
    fluidSimulation: false,
    visualPassClaim: false,
    productionClaim: false
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
