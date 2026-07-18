/**
 * /showroom/globe/h-earth/render/geometry-foam.js
 * COMPLETE FILE
 *
 * H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1
 *
 * Role:
 * Construct one projection-neutral native shoreline foam-contact ribbon for
 * OBJ_005_SHORELINE_FOAM_LINE. This file does not own water simulation,
 * admission, frame assembly, renderer materialization, or visual approval.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord
} from './geometry-kernel.js';

export const H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

export const H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-foam.js';

export const H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE_v1',

    sourceObjectId:
      'OBJ_005_SHORELINE_FOAM_LINE',

    sourceZoneIds:
      Object.freeze([
        'ZONE_002_SHORELINE_CONTACT_ZONE'
      ]),

    latticeRegionIds:
      Object.freeze([
        'SHORELINE_CONTACT'
      ]),

    providerId:
      'H_EARTH_FOAM_GEOMETRY_PROVIDER',

    providerRole:
      'SHORELINE_CONTACT',

    primitiveType:
      'TRIANGLE_MESH',

    worldProfile:
      deepFreeze({
        minimumX: -96,
        maximumX: 96,
        centerZ: -18,
        halfWidth: 2.2,
        meanderAmplitude: 2.6,
        elevationY: 0.79,
        segmentCount: 18
      }),

    semanticRole:
      'SHORELINE_FOAM_CONTACT_SURFACE',

    materialReference:
      'H_EARTH_MATERIAL_FOAM',

    materialIntent:
      'FOAM_CONTACT',

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
  const profile =
    H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE;

  return deepFreeze({
    ok: false,
    status:
      'H_EARTH_FOAM_CONTACT_NATIVE_CONSTRUCTION_REJECTED',
    contractId:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
    requestId,
    providerRequestId: null,
    resolutionReceiptId: null,
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

function buildFoamRibbonVertices(profile) {
  const {
    minimumX,
    maximumX,
    centerZ,
    halfWidth,
    meanderAmplitude,
    elevationY,
    segmentCount
  } = profile.worldProfile;

  const vertices = [];

  for (
    let segmentIndex = 0;
    segmentIndex <= segmentCount;
    segmentIndex += 1
  ) {
    const progress =
      segmentIndex /
      segmentCount;

    const x =
      minimumX +
      (
        maximumX -
        minimumX
      ) *
      progress;

    const centerOffset =
      Math.sin(
        progress *
        Math.PI *
        3
      ) *
      meanderAmplitude +
      Math.sin(
        progress *
        Math.PI *
        7
      ) *
      meanderAmplitude *
      0.24;

    vertices.push(
      createHEarthVector3(
        x,
        elevationY,
        centerZ +
          centerOffset -
          halfWidth
      ),
      createHEarthVector3(
        x,
        elevationY,
        centerZ +
          centerOffset +
          halfWidth
      )
    );
  }

  return vertices;
}

function buildFoamRibbonIndices(segmentCount) {
  const indices = [];

  for (
    let segmentIndex = 0;
    segmentIndex < segmentCount;
    segmentIndex += 1
  ) {
    const firstInner =
      segmentIndex *
      2;

    const firstOuter =
      firstInner +
      1;

    const secondInner =
      firstInner +
      2;

    const secondOuter =
      firstInner +
      3;

    indices.push(
      firstInner,
      secondOuter,
      firstOuter,
      firstInner,
      secondInner,
      secondOuter
    );
  }

  return indices;
}

export function constructHEarthFoamContactGeometry({
  requestId
} = {}) {
  if (!isNonEmptyExactString(requestId)) {
    return makeRejectedResult({
      requestId: null,
      issues: [
        deepFreeze({
          code:
            'FOAM_CONTACT_REQUEST_ID_INVALID',
          message:
            'Foam-contact construction requires one exact non-empty requestId.'
        })
      ]
    });
  }

  const profile =
    H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE;

  const providerRequestId =
    `H_EARTH_PROVIDER_REQUEST:${profile.providerId}:${profile.sourceObjectId}:FOAM_CONTACT_GEOMETRY:${requestId}`;

  const resolutionReceiptId =
    `H_EARTH_NATIVE_FOAM_GEOMETRY_RESOLUTION_RECEIPT:${providerRequestId}`;

  const primitiveId =
    `H_EARTH_FOAM_CONTACT_NATIVE_PRIMITIVE:${providerRequestId}`;

  const vertices =
    buildFoamRibbonVertices(
      profile
    );

  const indices =
    buildFoamRibbonIndices(
      profile.worldProfile
        .segmentCount
    );

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
      indices,
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
            'foam',
          materialIntentId:
            'H_EARTH_FOAM_CONTACT_DOMAIN',
          materialReference:
            profile.materialReference,
          materialIntent:
            profile.materialIntent
        }),
      source:
        deepFreeze({
          sourceType:
            'H_EARTH_NATIVE_FOAM_CONTACT_PROFILE',
          profileId:
            profile.profileId,
          contractId:
            H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID
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
          nativeFoamContact:
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
                  'FOAM_CONTACT_NATIVE_PRIMITIVE_INVALID',
                message:
                  'The foam-contact constructor did not return a lawful neutral primitive.'
              })
            ]
    });
  }

  return deepFreeze({
    ok: true,
    status:
      'H_EARTH_FOAM_CONTACT_NATIVE_CONSTRUCTION_COMPLETE',
    contractId:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
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

export function getHEarthFoamContactGeometryContract() {
  return deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
    sourceFile:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_SOURCE_FILE,
    profile:
      H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE,
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
  H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
  H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE,
  constructHEarthFoamContactGeometry,
  getHEarthFoamContactGeometryContract
});
