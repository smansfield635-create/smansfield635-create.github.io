/**
 * /showroom/globe/h-earth/render/geometry-foam.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Preserves the native foam-contact provider role and existing object,
 * zone, region, and material identities. The contact ribbon now derives from
 * the exact environment-owned shoreline occurrence rather than an independent
 * sinusoidal centerline.
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

export const H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_FILE_BIRTH_FD05_MINIMUM_NATIVE_SHORELINE_CONTEXT_v1';

export const H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_SOURCE_FILE =
  '/showroom/globe/h-earth/render/geometry-foam.js';

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

function finite(value) {
  return typeof value === 'number' &&
    Number.isFinite(value);
}

export const H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE =
  deepFreeze({
    profileId:
      'H_EARTH_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE_v1',
    sourceObjectId:
      'OBJ_005_SHORELINE_FOAM_LINE',
    sourceZoneIds:
      deepFreeze([
        'ZONE_002_SHORELINE_CONTACT_ZONE'
      ]),
    latticeRegionIds:
      deepFreeze([
        'SHORELINE_CONTACT'
      ]),
    providerId:
      'H_EARTH_FOAM_GEOMETRY_PROVIDER',
    providerRole:
      'SHORELINE_CONTACT',
    primitiveType:
      'TRIANGLE_MESH',
    shorelineBoundaryContractId:
      H_EARTH_3D_SHARED_SHORELINE_BOUNDARY_CONTRACT_ID,
    ribbonPolicy: deepFreeze({
      contactEdge:
        'EXACT_SHARED_SHORELINE_SAMPLES',
      waterwardWidth:
        3.2,
      elevationY:
        H_EARTH_3D_SHARED_SHORELINE_BOUNDARY
          .elevationPolicy.foamElevation,
      orientation:
        'WEST_TO_EAST',
      waterSide:
        'POSITIVE_Z',
      independentCenterline:
        false,
      deterministicWidthVariation:
        false
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

function makeRejectedResult({
  requestId,
  shorelineBoundary = null,
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

function normalizedWaterwardNormal(
  samples,
  index
) {
  const previous =
    samples[Math.max(0, index - 1)];
  const next =
    samples[
      Math.min(
        samples.length - 1,
        index + 1
      )
    ];

  const tangentX =
    next.x - previous.x;
  const tangentZ =
    next.z - previous.z;
  const length =
    Math.hypot(
      tangentX,
      tangentZ
    );

  if (!finite(length) || length <= 0) {
    return deepFreeze({
      x: 0,
      z: 1
    });
  }

  let normalX =
    -tangentZ / length;
  let normalZ =
    tangentX / length;

  if (normalZ < 0) {
    normalX *= -1;
    normalZ *= -1;
  }

  return deepFreeze({
    x: normalX,
    z: normalZ
  });
}

function buildFoamRibbonVertices({
  shorelineBoundary,
  profile
}) {
  const width =
    profile.ribbonPolicy.waterwardWidth;
  const elevationY =
    profile.ribbonPolicy.elevationY;
  const vertices = [];

  shorelineBoundary.samples.forEach(
    (sample, index) => {
      const normal =
        normalizedWaterwardNormal(
          shorelineBoundary.samples,
          index
        );

      vertices.push(
        createHEarthVector3(
          sample.x,
          elevationY,
          sample.z
        ),
        createHEarthVector3(
          sample.x +
            normal.x * width,
          elevationY,
          sample.z +
            normal.z * width
        )
      );
    }
  );

  return vertices;
}

function buildFoamRibbonIndices(
  sampleCount
) {
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

export function constructHEarthFoamContactGeometry({
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
            'FOAM_CONTACT_REQUEST_ID_INVALID',
          message:
            'Foam-contact construction requires one exact non-empty requestId.'
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
            'FOAM_SHARED_SHORELINE_BOUNDARY_INVALID',
          message:
            'Foam construction requires the exact environment-owned shoreline occurrence.'
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
    buildFoamRibbonVertices({
      shorelineBoundary,
      profile
    });

  const indices =
    buildFoamRibbonIndices(
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
          materialKey: 'foam',
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
            'H_EARTH_SHARED_SHORELINE_DERIVED_FOAM_CONTACT',
          profileId:
            profile.profileId,
          contractId:
            H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
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
          contactEdgeUsesExactBoundarySamples:
            true,
          independentCenterlineGenerated:
            false,
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
      shorelineBoundary,
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
        independentCenterlineGenerated:
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

export function getHEarthFoamContactGeometryContract() {
  return deepFreeze({
    contractId:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
    sourceFile:
      H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_SOURCE_FILE,
    profile:
      H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE,
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
  H_EARTH_3D_GEOMETRY_FOAM_PROVIDER_CONTRACT_ID,
  H_EARTH_3D_FOAM_CONTACT_NUMERIC_CONSTRUCTION_PROFILE,
  constructHEarthFoamContactGeometry,
  getHEarthFoamContactGeometryContract
});
