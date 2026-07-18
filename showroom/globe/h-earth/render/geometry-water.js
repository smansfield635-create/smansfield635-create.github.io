/**
 * /showroom/globe/h-earth/render/geometry-water.js
 * COMPLETE FILE
 *
 * H_EARTH_3D_GEOMETRY_WATER_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1
 *
 * Role:
 * Construct one projection-neutral native water-surface occurrence for
 * OBJ_007_WATER_SURFACE_PLANE from the existing object, zone, lattice, and
 * material identities. This file does not own admission, frame assembly,
 * compositor state, renderer materialization, fluid simulation, or visual pass.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

export const H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_WATER_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

export const H_EARTH_3D_GEOMETRY_WATER_PROVIDER_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-water.js';

export const H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE_v1',

    sourceObjectId:
      'OBJ_007_WATER_SURFACE_PLANE',

    sourceZoneIds:
      Object.freeze([
        'ZONE_003_WATER_SURFACE_ZONE'
      ]),

    latticeRegionIds:
      Object.freeze([
        'WATER_SURFACE_PLANE'
      ]),

    providerId:
      'H_EARTH_WATER_GEOMETRY_PROVIDER',

    providerRole:
      'WATER_SURFACE',

    primitiveType:
      'TRIANGLE_MESH',

    worldBounds:
      deepFreeze({
        minimumX: -96,
        maximumX: 96,
        minimumZ: -80,
        maximumZ: -18,
        elevationY: 0.68
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
  issues
}) {
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
      H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE
        .sourceObjectId,
    sourceObjectIds:
      Object.freeze([
        H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE
          .sourceObjectId
      ]),
    sourceZoneIds:
      H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE
        .sourceZoneIds,
    latticeRegionIds:
      H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE
        .latticeRegionIds,
    profileId:
      H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE
        .profileId,
    primitives:
      Object.freeze([]),
    bounds: null,
    admitted: false,
    WestAdmissionPerformed: false,
    geometryIndexMutated: false,
    compositorNodeCreated: false,
    renderInstanceCreated: false,
    fluidSimulation: false,
    issues:
      Object.freeze([
        ...issues
      ])
  });
}

export function constructHEarthWaterSurfaceGeometry({
  requestId
} = {}) {
  if (!isNonEmptyExactString(requestId)) {
    return makeRejectedResult({
      requestId: null,
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

  const profile =
    H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE;

  const providerRequestId =
    `H_EARTH_PROVIDER_REQUEST:${profile.providerId}:${profile.sourceObjectId}:OPEN_WATER_GEOMETRY:${requestId}`;

  const resolutionReceiptId =
    `H_EARTH_NATIVE_WATER_GEOMETRY_RESOLUTION_RECEIPT:${providerRequestId}`;

  const primitiveId =
    `H_EARTH_OPEN_WATER_NATIVE_PRIMITIVE:${providerRequestId}`;

  const {
    minimumX,
    maximumX,
    minimumZ,
    maximumZ,
    elevationY
  } = profile.worldBounds;

  const vertices = [
    createHEarthVector3(
      minimumX,
      elevationY,
      minimumZ
    ),
    createHEarthVector3(
      maximumX,
      elevationY,
      minimumZ
    ),
    createHEarthVector3(
      maximumX,
      elevationY,
      maximumZ
    ),
    createHEarthVector3(
      minimumX,
      elevationY,
      maximumZ
    )
  ];

  const construction =
    constructHEarthTriangleMesh({
      primitiveId,
      geometryId:
        `${primitiveId}:geometry`,
      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType
          .TRIANGLE_MESH,
      vertices,
      indices: [
        0, 2, 1,
        0, 3, 2
      ],
      normalMode:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .normalMode
          .FACE_AND_VERTEX,
      expectedClosure:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .expectedClosure
          .OPEN_ALLOWED,
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
            'H_EARTH_NATIVE_WATER_SURFACE_PROFILE',
          profileId:
            profile.profileId,
          contractId:
            H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID
        }),
      metadata:
        deepFreeze({
          providerId:
            profile.providerId,
          providerRole:
            profile.providerRole,
          sourceObjectIds:
            Object.freeze([
              profile.sourceObjectId
            ]),
          sourceZoneIds:
            profile.sourceZoneIds,
          latticeRegionIds:
            profile.latticeRegionIds,
          profileId:
            profile.profileId,
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
      Object.freeze([
        profile.sourceObjectId
      ]),
    sourceZoneIds:
      profile.sourceZoneIds,
    latticeRegionIds:
      profile.latticeRegionIds,
    profileId:
      profile.profileId,
    primitive:
      construction.primitiveRecord,
    primitives:
      Object.freeze([
        construction.primitiveRecord
      ]),
    bounds:
      construction.geometry.bounds,
    constructionReceipt:
      deepFreeze({
        nativeGeometry:
          true,
        primitiveId,
        sourceObjectId:
          profile.sourceObjectId,
        sourceZoneIds:
          profile.sourceZoneIds,
        latticeRegionIds:
          profile.latticeRegionIds,
        materialReference:
          profile.materialReference,
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
      Object.freeze([])
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
    nativeGeometry:
      true,
    admissionAuthority:
      'WEST_ONLY',
    fluidSimulation:
      false,
    visualPassClaim:
      false,
    productionClaim:
      false
  });
}

export default Object.freeze({
  H_EARTH_3D_GEOMETRY_WATER_PROVIDER_CONTRACT_ID,
  H_EARTH_3D_WATER_SURFACE_NUMERIC_CONSTRUCTION_PROFILE,
  constructHEarthWaterSurfaceGeometry,
  getHEarthWaterSurfaceGeometryContract
});
