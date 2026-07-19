/**
 * /showroom/globe/h-earth/render/geometry-water.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Preserves the native water-surface provider role and existing object,
 * zone, region, and material identities. The landward water edge now uses
 * the exact environment-owned shoreline occurrence rather than an independent
 * straight rectangular edge.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

import {
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY,
  H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
  evaluateHEarth3DSharedShorelineBoundary
} from '../environment.js';

export const H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_WATER_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

export const H_EARTH_3D_GEOMETRY_WATER_PROVIDER_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-water.js';

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

export const H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE_v1',
    sourceObjectId:
      'OBJ_007_WATER_SURFACE_PLANE',
    sourceZoneIds:
      deepFreeze([
        'ZONE_003_WATER_SURFACE_ZONE'
      ]),
    latticeRegionIds:
      deepFreeze([
        'WATER_SURFACE_PLANE'
      ]),
    providerId:
      'H_EARTH_WATER_GEOMETRY_PROVIDER',
    providerRole:
      'WATER_SURFACE',
    primitiveType:
      'TRIANGLE_MESH',
    shorelineBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    worldBounds:
      deepFreeze({
        minimumX: -96,
        maximumX: 96,
        minimumZ:
          Math.min(
            ...H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
              .samples.map(
                (sample) => sample.z
              )
          ),
        maximumZ: -18,
        elevationY:
          H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
            .elevationPolicy.waterElevation
      }),
    constructionPolicy:
      deepFreeze({
        landwardEdge:
          'EXACT_SHARED_SHORELINE_SAMPLES',
        waterwardEdge:
          'SAME_X_AT_DECLARED_MAXIMUM_Z',
        orientation:
          'WEST_TO_EAST',
        waterSide:
          'POSITIVE_Z',
        independentLandwardEdge:
          false
      }),
    semanticRole:
      'OPEN_WATER_SURFACE_CONTEXT',
    materialReference:
      'H_EARTH_MATERIAL_OPEN_WATER',
    materialIntent:
      'OPEN_WATER',
    fluidSimulation:
      false,
    nativeGeometryRequired:
      true
  });

function makeRejectedResult({
  requestId,
  shorelineBoundary = null,
  issues
}) {
  const profile =
    H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE;

  return deepFreeze({
    ok: false,
    status:
      'H_EARTH_WATER_SURFACE_NATIVE_CONSTRUCTION_REJECTED',
    contractId:
      H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
    requestId,
    providerRequestId: null,
    resolutionReceiptId: null,
    sourceObjectId:
      profile.sourceObjectId,
    sourceObjectIds:
      deepFreeze([
        profile.sourceObjectId
      ]),
    sourceZoneIds:
      profile.sourceZoneIds,
    latticeRegionIds:
      profile.latticeRegionIds,
    profileId:
      profile.profileId,
    shorelineBoundary:
      shorelineBoundary ?? null,
    shorelineBoundaryId:
      shorelineBoundary?.boundaryId ?? null,
    shorelineBoundaryContractId:
      shorelineBoundary?.boundaryContractId ??
      null,
    primitives:
      deepFreeze([]),
    bounds: null,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    fluidSimulation: false,
    issues:
      deepFreeze([...issues])
  });
}

function boundaryCorrespondenceValid(
  shorelineBoundary
) {
  const evaluation =
    evaluateHEarth3DSharedShorelineBoundary(
      shorelineBoundary
    );

  return (
    evaluation.eligible === true &&
    shorelineBoundary ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY &&
    shorelineBoundary.boundaryContractId ===
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID &&
    shorelineBoundary.orientation ===
      'WEST_TO_EAST' &&
    shorelineBoundary.waterSide ===
      'POSITIVE_Z'
  );
}

function buildWaterVertices({
  shorelineBoundary,
  elevationY,
  maximumZ
}) {
  const vertices = [];

  shorelineBoundary.samples.forEach(
    (sample) => {
      vertices.push(
        createHEarthVector3(
          sample.x,
          elevationY,
          sample.z
        ),
        createHEarthVector3(
          sample.x,
          elevationY,
          maximumZ
        )
      );
    }
  );

  return vertices;
}

function buildWaterIndices(sampleCount) {
  const indices = [];

  for (
    let sampleIndex = 0;
    sampleIndex < sampleCount - 1;
    sampleIndex += 1
  ) {
    const firstContact =
      sampleIndex * 2;
    const firstWaterward =
      firstContact + 1;
    const secondContact =
      firstContact + 2;
    const secondWaterward =
      firstContact + 3;

    indices.push(
      firstContact,
      secondWaterward,
      firstWaterward,
      firstContact,
      secondContact,
      secondWaterward
    );
  }

  return indices;
}

export function constructHEarthWaterSurfaceGeometry({
  requestId,
  shorelineBoundary =
    H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
} = {}) {
  if (!isNonEmptyExactString(requestId)) {
    return makeRejectedResult({
      requestId: null,
      shorelineBoundary,
      issues: [
        deepFreeze({
          code:
            'WATER_SURFACE_REQUEST_ID_INVALID',
          message:
            'Water-surface construction requires one exact non-empty requestId.'
        })
      ]
    });
  }

  if (
    !boundaryCorrespondenceValid(
      shorelineBoundary
    )
  ) {
    return makeRejectedResult({
      requestId,
      shorelineBoundary,
      issues: [
        deepFreeze({
          code:
            'WATER_SHARED_SHORELINE_BOUNDARY_INVALID',
          message:
            'Water construction requires the exact environment-owned shoreline occurrence.'
        })
      ]
    });
  }

  const profile =
    H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE;

  if (
    shorelineBoundary.samples.some(
      (sample) =>
        sample.z >=
        profile.worldBounds.maximumZ
    )
  ) {
    return makeRejectedResult({
      requestId,
      shorelineBoundary,
      issues: [
        deepFreeze({
          code:
            'WATERWARD_EXTENT_NOT_BEYOND_SHORELINE',
          message:
            'The declared waterward extent must remain on the positive-Z side of every shoreline sample.'
        })
      ]
    });
  }

  const providerRequestId =
    `H_EARTH_PROVIDER_REQUEST:${profile.providerId}:${profile.sourceObjectId}:OPEN_WATER_GEOMETRY:${requestId}`;

  const resolutionReceiptId =
    `H_EARTH_NATIVE_WATER_GEOMETRY_RESOLUTION_RECEIPT:${providerRequestId}`;

  const primitiveId =
    `H_EARTH_OPEN_WATER_NATIVE_PRIMITIVE:${providerRequestId}`;

  const vertices =
    buildWaterVertices({
      shorelineBoundary,
      elevationY:
        profile.worldBounds.elevationY,
      maximumZ:
        profile.worldBounds.maximumZ
    });

  const indices =
    buildWaterIndices(
      shorelineBoundary.sampleCount
    );

  const shorelineSampleIds =
    deepFreeze(
      shorelineBoundary.samples.map(
        (sample) => sample.sampleId
      )
    );

  const construction =
    constructHEarthTriangleMesh({
      primitiveId,
      geometryId:
        `${primitiveId}:geometry`,
      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType.TRIANGLE_MESH,
      vertices,
      indices,
      normalMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .normalMode.FACE_AND_VERTEX,
      expectedClosure:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .expectedClosure.OPEN_ALLOWED,
      semanticRole:
        profile.semanticRole,
      materialHint:
        deepFreeze({
          materialKey:
            'openWater',
          materialIntentId:
            'H_EARTH_OPEN_WATER_DOMAIN',
          materialReference:
            profile.materialReference,
          materialIntent:
            profile.materialIntent
        }),
      source:
        deepFreeze({
          sourceType:
            'H_EARTH_SHARED_SHORELINE_DERIVED_WATER_SURFACE',
          profileId:
            profile.profileId,
          contractId:
            H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
          shorelineBoundaryId:
            shorelineBoundary.boundaryId,
          shorelineBoundaryContractId:
            shorelineBoundary.boundaryContractId
        }),
      metadata:
        deepFreeze({
          providerId:
            profile.providerId,
          providerRole:
            profile.providerRole,
          sourceObjectIds:
            deepFreeze([
              profile.sourceObjectId
            ]),
          sourceZoneIds:
            profile.sourceZoneIds,
          latticeRegionIds:
            profile.latticeRegionIds,
          profileId:
            profile.profileId,
          shorelineBoundaryId:
            shorelineBoundary.boundaryId,
          shorelineBoundaryContractId:
            shorelineBoundary.boundaryContractId,
          shorelineOrientation:
            shorelineBoundary.orientation,
          shorelineEndpointIds:
            shorelineBoundary.endpointIds,
          shorelineSampleIds,
          shorelineSampleCount:
            shorelineBoundary.sampleCount,
          sharedBoundaryOccurrenceConsumed:
            true,
          landwardEdgeUsesExactBoundarySamples:
            true,
          independentLandwardEdgeGenerated:
            false,
          nativeWaterSurface:
            true,
          fluidSimulation:
            false,
          aggregateFrameAuthority:
            false,
          admitted:
            false,
          admissionAuthority:
            'WEST_ONLY'
        })
    });

  if (
    construction?.valid !== true ||
    !isHEarthNeutralPrimitiveRecord(
      construction.primitiveRecord
    )
  ) {
    return makeRejectedResult({
      requestId,
      shorelineBoundary,
      issues:
        Array.isArray(construction?.issues)
          ? construction.issues
          : [
              deepFreeze({
                code:
                  'WATER_SURFACE_NATIVE_PRIMITIVE_INVALID',
                message:
                  'The water-surface constructor did not return a lawful neutral primitive.'
              })
            ]
    });
  }

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_WATER_SURFACE_NATIVE_CONSTRUCTION_COMPLETE',
    contractId:
      H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
    kernelFacadeContractId:
      H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
    requestId,
    providerRequestId,
    resolutionReceiptId,
    sourceObjectId:
      profile.sourceObjectId,
    sourceObjectIds:
      deepFreeze([
        profile.sourceObjectId
      ]),
    sourceZoneIds:
      profile.sourceZoneIds,
    latticeRegionIds:
      profile.latticeRegionIds,
    profileId:
      profile.profileId,
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
    primitive:
      construction.primitiveRecord,
    primitives:
      deepFreeze([
        construction.primitiveRecord
      ]),
    bounds:
      construction.geometry.bounds,
    constructionReceipt:
      deepFreeze({
        nativeGeometry: true,
        primitiveId,
        sourceObjectId:
          profile.sourceObjectId,
        sourceZoneIds:
          profile.sourceZoneIds,
        latticeRegionIds:
          profile.latticeRegionIds,
        materialReference:
          profile.materialReference,
        shorelineBoundaryId:
          shorelineBoundary.boundaryId,
        exactSharedBoundaryOccurrence:
          true,
        independentLandwardEdgeGenerated:
          false,
        fluidSimulation:
          false
      }),
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    fluidSimulation: false,
    issues:
      deepFreeze([])
  });
}

export function getHEarthWaterSurfaceGeometryContract() {
  return deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
    sourceFile:
      H_EARTH_3D_GEOMETRY_WATER_PROVIDER_SOURCE_FILE,
    profile:
      H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE,
    sharedBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    nativeGeometry: true,
    admissionAuthority:
      'WEST_ONLY',
    fluidSimulation: false,
    visualPassClaim: false,
    productionClaim: false
  });
}

export default Object.freeze({
  H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
  H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE,
  constructHEarthWaterSurfaceGeometry,
  getHEarthWaterSurfaceGeometryContract
});
