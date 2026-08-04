/**
 * /showroom/globe/h-earth/render/geometry-ground.js
 * COMPLETE REPLACEMENT CANDIDATE
 *
 * Provider-local ground construction remains the file role. The bounded
 * correction adds boundary-terminated height-field construction while
 * preserving flat-plane, ordinary height-field, and explicit-mesh behavior.
 */

import {
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_CONTRACT_ID,
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SCHEMA_VERSION,
  H_EARTH_3D_GEOMETRY_KERNEL_PUBLIC_FACADE_SOURCE_FILE,
  H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
  H_EARTH_3D_GEOMETRY_SOUTH_ENUMS,
  createHEarthVector3,
  createHEarthIdentityMatrix4,
  isHEarthMatrix4,
  constructHEarthHeightFieldMesh,
  constructHEarthTriangleMesh,
  isHEarthNeutralPrimitiveRecord,
  isHEarthAABB3D,
  mergeHEarthGeometryBounds
} from './geometry-kernel.js';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID =
  'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_FILE_BIRTH_STEP_034O_5G_PROVIDER_LOCAL_GROUND_CONSTRUCTION_ADAPTER_v1';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SCHEMA_VERSION = 1;

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_SOURCE_FILE =
  '/preview/h-earth/r06-c10/95504c9927922318225da1d61fa303cec70497f9/_source/showroom/globe/h-earth/render/geometry-ground.js';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STEP_ID =
  'STEP_034O_5G_GEOMETRY_GROUND_PROVIDER_LOCAL_CONSTRUCTION_ADAPTER';

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATUS =
  'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_IMPLEMENTATION_CANDIDATE';

function deepFreeze(value, seen = new WeakSet()) {
  if (value === null || typeof value !== 'object' || Object.isFrozen(value)) {
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

function isPlainObject(value) {
  if (value === null || typeof value !== 'object' || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function finite(value) {
  return typeof value === 'number' && Number.isFinite(value);
}

function normalizeStringIdArray(values) {
  const result = [];
  const seen = new Set();
  for (const value of Array.isArray(values) ? values : []) {
    if (!isNonEmptyString(value)) {
      continue;
    }
    const normalized = value.trim();
    if (!seen.has(normalized)) {
      seen.add(normalized);
      result.push(normalized);
    }
  }
  return deepFreeze(result);
}

function freezeClone(value) {
  if (Array.isArray(value)) {
    return deepFreeze(value.map((item) => freezeClone(item)));
  }
  if (isPlainObject(value)) {
    return deepFreeze(
      Object.fromEntries(
        Object.entries(value).map(([key, nested]) => [
          key,
          freezeClone(nested)
        ])
      )
    );
  }
  return value;
}

function emptyBounds() {
  return mergeHEarthGeometryBounds([]);
}

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS =
  deepFreeze({
    providerRole: deepFreeze({
      GROUND: 'GROUND'
    }),
    groundStrategy: deepFreeze({
      AUTO: 'AUTO',
      FLAT_PLANE: 'FLAT_PLANE',
      HEIGHT_FIELD: 'HEIGHT_FIELD',
      EXPLICIT_TRIANGLE_MESH: 'EXPLICIT_TRIANGLE_MESH'
    }),
    constructionStatus: deepFreeze({
      VALID: 'VALID',
      INELIGIBLE: 'INELIGIBLE',
      FATAL: 'FATAL'
    })
  });

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP =
  deepFreeze({
    providerLocalConstructionAdapter: true,
    providerAuthority:
      'PROVIDER_LOCAL_CONSTRUCTION_ADAPTER_ONLY',
    neutralPrimitiveOnly: true,
    admittedPrimitiveAuthority: false,
    aggregateFrameAuthority: false,
    geometryIndexAuthority: false,
    compositorIntegrationAuthority: false,
    rendererIntegrationAuthority: false,
    visualApproval: false,
    productionAuthority: false,
    publicReleaseAuthority: false
  });

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_REQUIRED_FIXTURES =
  deepFreeze([
    'FLAT_PLANE',
    'EXPLICIT_TRIANGLE_MESH',
    'HEIGHT_FIELD',
    'BOUNDARY_TERMINATED_HEIGHT_FIELD'
  ]);

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PRE_BACKING_GATE =
  deepFreeze({
    status:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR',
    localAdmission: false,
    productionAuthority: false
  });

function issue(code, message, details = null, blocking = true) {
  return deepFreeze({
    code,
    severity:
      blocking ? 'ERROR' : 'WARNING',
    message,
    details,
    blocking
  });
}

function resolveTransform(primary, fallback) {
  if (isHEarthMatrix4(primary)) {
    return primary;
  }
  if (isHEarthMatrix4(fallback)) {
    return fallback;
  }
  return createHEarthIdentityMatrix4();
}

function resolvePrimitiveId(providerId, descriptor) {
  return isNonEmptyString(descriptor?.primitiveId)
    ? descriptor.primitiveId.trim()
    : `${providerId}:ground-surface`;
}

function buildReceipt({
  providerId,
  providerRole,
  primitive,
  sourceZoneIds,
  sourceObjectIds,
  strategy,
  issues
}) {
  const blockingCount =
    issues.filter((entry) => entry?.blocking === true).length;
  return deepFreeze({
    recordType:
      'H_EARTH_GROUND_PROVIDER_RECEIPT',
    receiptId:
      `${providerId}:${primitive.primitiveId}:provider-receipt`,
    providerId,
    providerRole,
    primitiveId:
      primitive.primitiveId,
    primitiveType:
      primitive.primitiveType,
    valid:
      blockingCount === 0,
    openNeutralMesh:
      primitive.geometry?.metadata
        ?.openNeutralMeshConstructionValid === true,
    sourceZoneIds,
    sourceObjectIds,
    issueCounts: deepFreeze({
      fatalCount: 0,
      errorCount: blockingCount,
      warningCount:
        Math.max(0, issues.length - blockingCount),
      infoCount: 0,
      blockingCount,
      totalCount:
        issues.length
    }),
    strategy
  });
}

function createResult({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  strategy = null,
  primitives = [],
  issues = [],
  requestedPrimitiveCount = 1,
  fatal = false,
  ineligible = false
}) {
  const frozenPrimitives =
    deepFreeze([...primitives]);
  const frozenIssues =
    deepFreeze([...issues]);
  const bounds =
    frozenPrimitives.length > 0
      ? mergeHEarthGeometryBounds(
          frozenPrimitives.map(
            (primitive) => primitive.geometry.bounds
          )
        )
      : emptyBounds();
  const valid =
    !fatal &&
    !ineligible &&
    frozenPrimitives.length > 0 &&
    frozenIssues.every((entry) => entry.blocking !== true);
  const receipts =
    valid
      ? deepFreeze(
          frozenPrimitives.map((primitive) =>
            buildReceipt({
              providerId,
              providerRole,
              primitive,
              sourceZoneIds,
              sourceObjectIds,
              strategy,
              issues: frozenIssues
            })
          )
        )
      : deepFreeze([]);
  const constructionStatus =
    fatal
      ? H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .constructionStatus.FATAL
      : ineligible
        ? H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.INELIGIBLE
        : H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .constructionStatus.VALID;

  return deepFreeze({
    recordType:
      'H_EARTH_GROUND_PROVIDER_RESULT',
    providerId,
    providerRole,
    coordinateFrame:
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME,
    constructionStatus,
    valid,
    ineligible,
    fatal,
    sourceZoneIds,
    sourceObjectIds,
    primitives:
      frozenPrimitives,
    bounds,
    issues:
      frozenIssues,
    receipts,
    account: deepFreeze({
      requestedPrimitiveCount,
      constructedPrimitiveCount:
        frozenPrimitives.length,
      validPrimitiveCount:
        valid ? frozenPrimitives.length : 0,
      heldPrimitiveCount:
        valid ? 0 : requestedPrimitiveCount,
      neutralPrimitiveCount:
        valid ? frozenPrimitives.length : 0,
      admittedPrimitiveCount: 0,
      issueCount:
        frozenIssues.length,
      blockingIssueCount:
        frozenIssues.filter(
          (entry) => entry.blocking === true
        ).length,
      fatalIssueCount:
        fatal ? 1 : 0,
      errorIssueCount:
        frozenIssues.filter(
          (entry) => entry.severity === 'ERROR'
        ).length,
      warningIssueCount:
        frozenIssues.filter(
          (entry) => entry.severity === 'WARNING'
        ).length,
      infoIssueCount: 0,
      boundsPresent:
        isHEarthAABB3D(bounds),
      emptyBounds:
        bounds?.empty === true,
      strategy
    }),
    authority:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
  });
}

function constructFlatPlane({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor
}) {
  const plane = descriptor.flatPlane;
  if (
    !isPlainObject(plane) ||
    ![
      plane.minimumX,
      plane.maximumX,
      plane.minimumZ,
      plane.maximumZ,
      plane.y
    ].every(finite) ||
    plane.minimumX >= plane.maximumX ||
    plane.minimumZ >= plane.maximumZ
  ) {
    return {
      issues: [
        issue(
          'GROUND_FLAT_PLANE_DESCRIPTOR_INVALID',
          'The flat-plane ground descriptor is malformed.'
        )
      ],
      primitive: null
    };
  }

  const primitiveId =
    resolvePrimitiveId(providerId, descriptor);
  const vertices = [
    createHEarthVector3(
      plane.minimumX,
      plane.y,
      plane.minimumZ
    ),
    createHEarthVector3(
      plane.maximumX,
      plane.y,
      plane.minimumZ
    ),
    createHEarthVector3(
      plane.maximumX,
      plane.y,
      plane.maximumZ
    ),
    createHEarthVector3(
      plane.minimumX,
      plane.y,
      plane.maximumZ
    )
  ];

  const construction =
    constructHEarthTriangleMesh({
      primitiveId,
      geometryId:
        `${primitiveId}:geometry`,
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
      transform:
        resolveTransform(
          plane.transform,
          descriptor.transform
        ),
      semanticRole:
        descriptor.semanticRole ??
        'GROUND_SURFACE',
      materialHint:
        freezeClone(descriptor.materialHint),
      metadata: deepFreeze({
        ...(isPlainObject(descriptor.metadata)
          ? descriptor.metadata
          : {}),
        providerId,
        providerRole,
        sourceZoneIds,
        sourceObjectIds,
        groundStrategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy.FLAT_PLANE,
        admitted: false,
        aggregateFrameAuthority: false
      })
    });

  return {
    primitive:
      construction?.primitiveRecord ?? null,
    issues:
      construction?.valid === true
        ? []
        : [
            issue(
              'GROUND_FLAT_PLANE_CONSTRUCTION_FAILED',
              'Flat-plane construction did not return a lawful neutral primitive.',
              construction?.issues ?? null
            )
          ]
  };
}

function boundarySamplesValid(boundary, xSampleCount) {
  return (
    isPlainObject(boundary) &&
    isNonEmptyString(boundary.boundaryId) &&
    isNonEmptyString(boundary.boundaryContractId) &&
    boundary.orientation === 'WEST_TO_EAST' &&
    boundary.transformLaw?.samplesAreWorldSpace === true &&
    Array.isArray(boundary.samples) &&
    boundary.samples.length === xSampleCount &&
    boundary.samples.every((sample, ordinal) =>
      isPlainObject(sample) &&
      sample.ordinal === ordinal &&
      isNonEmptyString(sample.sampleId) &&
      finite(sample.x) &&
      finite(sample.z) &&
      (
        ordinal === 0 ||
        boundary.samples[ordinal - 1].x < sample.x
      )
    )
  );
}

function constructBoundaryHeightField({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor
}) {
  const heightField = descriptor.heightField;
  const fieldDescriptor =
    heightField?.descriptor;
  const xSampleCount =
    heightField?.xSampleCount;
  const zSampleCount =
    heightField?.zSampleCount;
  const boundary =
    heightField?.shorelineBoundary;
  const translation =
    heightField?.worldTranslation;

  if (
    !isPlainObject(heightField) ||
    !isPlainObject(fieldDescriptor) ||
    typeof fieldDescriptor.evaluator !== 'function' ||
    !Number.isInteger(xSampleCount) ||
    !Number.isInteger(zSampleCount) ||
    xSampleCount < 2 ||
    zSampleCount < 2 ||
    !boundarySamplesValid(boundary, xSampleCount) ||
    !isPlainObject(translation) ||
    ![translation.x, translation.y, translation.z]
      .every(finite)
  ) {
    return {
      primitive: null,
      issues: [
        issue(
          'GROUND_BOUNDARY_HEIGHT_FIELD_DESCRIPTOR_INVALID',
          'Boundary-terminated height-field construction requires one lawful world-space boundary and executable translation.'
        )
      ]
    };
  }

  const xAxis =
    fieldDescriptor.xDomain;
  const zAxis =
    fieldDescriptor.zDomain;

  if (
    !isPlainObject(xAxis) ||
    !isPlainObject(zAxis) ||
    ![
      xAxis.minimum,
      xAxis.maximum,
      zAxis.minimum,
      zAxis.maximum
    ].every(finite) ||
    xAxis.minimum >= xAxis.maximum ||
    zAxis.minimum >= zAxis.maximum
  ) {
    return {
      primitive: null,
      issues: [
        issue(
          'GROUND_BOUNDARY_HEIGHT_FIELD_DOMAIN_INVALID',
          'Boundary-terminated height-field domains are malformed.'
        )
      ]
    };
  }

  const vertices = [];
  const indices = [];
  const boundarySampleIds = [];

  for (let xIndex = 0; xIndex < xSampleCount; xIndex += 1) {
    const boundarySample =
      boundary.samples[xIndex];
    const localX =
      boundarySample.x - translation.x;
    const localBoundaryZ =
      boundarySample.z - translation.z;
    boundarySampleIds.push(
      boundarySample.sampleId
    );

    for (let zIndex = 0; zIndex < zSampleCount; zIndex += 1) {
      const progress =
        zIndex / (zSampleCount - 1);
      const localZ =
        zAxis.minimum +
        (
          localBoundaryZ -
          zAxis.minimum
        ) *
        progress;
      const localY =
        fieldDescriptor.evaluator(
          localX,
          localZ
        );

      vertices.push(
        createHEarthVector3(
          localX + translation.x,
          localY + translation.y,
          localZ + translation.z
        )
      );
    }
  }

  for (let xIndex = 0; xIndex < xSampleCount - 1; xIndex += 1) {
    for (let zIndex = 0; zIndex < zSampleCount - 1; zIndex += 1) {
      const a =
        xIndex * zSampleCount + zIndex;
      const b =
        (xIndex + 1) * zSampleCount + zIndex;
      const c =
        a + 1;
      const d =
        b + 1;

      indices.push(
        a, d, b,
        a, c, d
      );
    }
  }

  const primitiveId =
    resolvePrimitiveId(providerId, descriptor);

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
        descriptor.semanticRole ??
        'GROUND_SURFACE',
      materialHint:
        freezeClone(descriptor.materialHint),
      source:
        freezeClone(descriptor.source),
      metadata: deepFreeze({
        ...(isPlainObject(descriptor.metadata)
          ? descriptor.metadata
          : {}),
        providerId,
        providerRole,
        sourceZoneIds,
        sourceObjectIds,
        groundStrategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy.HEIGHT_FIELD,
        boundaryTerminatedHeightField: true,
        shorelineBoundaryId:
          boundary.boundaryId,
        shorelineBoundaryContractId:
          boundary.boundaryContractId,
        shorelineOrientation:
          boundary.orientation,
        shorelineEndpointIds:
          boundary.endpointIds,
        shorelineSampleIds:
          deepFreeze(boundarySampleIds),
        shorelineSampleCount:
          boundary.samples.length,
        worldTranslation:
          deepFreeze({ ...translation }),
        worldTranslationApplied: true,
        providerLocalConstructionOnly: true,
        admitted: false,
        aggregateFrameAuthority: false
      })
    });

  return {
    primitive:
      construction?.primitiveRecord ?? null,
    issues:
      construction?.valid === true
        ? []
        : [
            issue(
              'GROUND_BOUNDARY_HEIGHT_FIELD_CONSTRUCTION_FAILED',
              'Boundary-terminated wet-sand construction did not return a lawful neutral primitive.',
              construction?.issues ?? null
            )
          ]
  };
}

function constructOrdinaryHeightField({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor
}) {
  const heightField =
    descriptor.heightField;

  if (
    !isPlainObject(heightField) ||
    !isPlainObject(heightField.descriptor) ||
    typeof heightField.descriptor.evaluator !== 'function' ||
    !Number.isInteger(heightField.xSampleCount) ||
    !Number.isInteger(heightField.zSampleCount)
  ) {
    return {
      primitive: null,
      issues: [
        issue(
          'GROUND_HEIGHT_FIELD_DESCRIPTOR_INVALID',
          'The height-field descriptor is malformed.'
        )
      ]
    };
  }

  const primitiveId =
    resolvePrimitiveId(providerId, descriptor);

  const construction =
    constructHEarthHeightFieldMesh({
      primitiveId,
      descriptor:
        heightField.descriptor,
      xSampleCount:
        heightField.xSampleCount,
      zSampleCount:
        heightField.zSampleCount,
      transform:
        resolveTransform(
          heightField.transform,
          descriptor.transform
        ),
      semanticRole:
        descriptor.semanticRole ??
        'GROUND_SURFACE',
      materialHint:
        freezeClone(descriptor.materialHint),
      metadata: deepFreeze({
        ...(isPlainObject(descriptor.metadata)
          ? descriptor.metadata
          : {}),
        providerId,
        providerRole,
        sourceZoneIds,
        sourceObjectIds,
        groundStrategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy.HEIGHT_FIELD,
        providerLocalConstructionOnly: true,
        admitted: false,
        aggregateFrameAuthority: false
      })
    });

  return {
    primitive:
      construction?.primitiveRecord ?? null,
    issues:
      construction?.valid === true
        ? []
        : [
            issue(
              'GROUND_HEIGHT_FIELD_CONSTRUCTION_FAILED',
              'Height-field construction did not return a lawful neutral primitive.',
              construction?.issues ?? null
            )
          ]
  };
}

function constructExplicitMesh({
  providerId,
  providerRole,
  sourceZoneIds,
  sourceObjectIds,
  descriptor
}) {
  const explicit =
    descriptor.explicitTriangleMesh;

  if (
    !isPlainObject(explicit) ||
    !Array.isArray(explicit.vertices) ||
    !Array.isArray(explicit.indices)
  ) {
    return {
      primitive: null,
      issues: [
        issue(
          'GROUND_EXPLICIT_TRIANGLE_MESH_DESCRIPTOR_INVALID',
          'The explicit triangle-mesh descriptor is malformed.'
        )
      ]
    };
  }

  const primitiveId =
    resolvePrimitiveId(providerId, descriptor);
  const construction =
    constructHEarthTriangleMesh({
      primitiveId,
      geometryId:
        `${primitiveId}:geometry`,
      primitiveType:
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .primitiveType.TRIANGLE_MESH,
      vertices:
        explicit.vertices,
      indices:
        explicit.indices,
      normalMode:
        explicit.normalMode ??
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .normalMode.FACE_AND_VERTEX,
      expectedClosure:
        explicit.expectedClosure ??
        H_EARTH_3D_GEOMETRY_SOUTH_ENUMS
          .expectedClosure.OPEN_ALLOWED,
      transform:
        resolveTransform(
          explicit.transform,
          descriptor.transform
        ),
      semanticRole:
        descriptor.semanticRole ??
        'GROUND_SURFACE',
      materialHint:
        freezeClone(descriptor.materialHint),
      source:
        freezeClone(descriptor.source),
      metadata: deepFreeze({
        ...(isPlainObject(descriptor.metadata)
          ? descriptor.metadata
          : {}),
        providerId,
        providerRole,
        sourceZoneIds,
        sourceObjectIds,
        groundStrategy:
          H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
            .groundStrategy
            .EXPLICIT_TRIANGLE_MESH,
        providerLocalConstructionOnly: true,
        admitted: false,
        aggregateFrameAuthority: false
      })
    });

  return {
    primitive:
      construction?.primitiveRecord ?? null,
    issues:
      construction?.valid === true
        ? []
        : [
            issue(
              'GROUND_EXPLICIT_TRIANGLE_MESH_CONSTRUCTION_FAILED',
              'Explicit triangle-mesh construction failed.',
              construction?.issues ?? null
            )
          ]
  };
}

function resolveStrategy(descriptor) {
  const requested =
    descriptor?.strategy ??
    H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.AUTO;

  if (
    requested !==
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy.AUTO
  ) {
    return requested;
  }
  if (isPlainObject(descriptor?.heightField)) {
    return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.HEIGHT_FIELD;
  }
  if (isPlainObject(descriptor?.explicitTriangleMesh)) {
    return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.EXPLICIT_TRIANGLE_MESH;
  }
  if (isPlainObject(descriptor?.flatPlane)) {
    return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
      .groundStrategy.FLAT_PLANE;
  }
  return null;
}

export function constructHEarthGroundProvider({
  providerId,
  providerRole,
  sourceZoneIds = [],
  sourceObjectIds = [],
  descriptor
} = {}) {
  const normalizedProviderId =
    isNonEmptyString(providerId)
      ? providerId.trim()
      : 'H_EARTH_GROUND_GEOMETRY_PROVIDER';
  const normalizedProviderRole =
    providerRole ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole.GROUND
      ? providerRole
      : H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
          .providerRole.GROUND;
  const normalizedZoneIds =
    normalizeStringIdArray(sourceZoneIds);
  const normalizedObjectIds =
    normalizeStringIdArray(sourceObjectIds);

  if (!isPlainObject(descriptor)) {
    return createResult({
      providerId:
        normalizedProviderId,
      providerRole:
        normalizedProviderRole,
      sourceZoneIds:
        normalizedZoneIds,
      sourceObjectIds:
        normalizedObjectIds,
      fatal: true,
      issues: [
        issue(
          'GROUND_PROVIDER_DESCRIPTOR_INVALID',
          'Ground-provider descriptor must be a plain object.'
        )
      ]
    });
  }

  const strategy =
    resolveStrategy(descriptor);

  if (strategy === null) {
    return createResult({
      providerId:
        normalizedProviderId,
      providerRole:
        normalizedProviderRole,
      sourceZoneIds:
        normalizedZoneIds,
      sourceObjectIds:
        normalizedObjectIds,
      ineligible: true,
      requestedPrimitiveCount: 0,
      issues: [
        issue(
          'GROUND_PROVIDER_NO_LAWFUL_SOURCE',
          'Ground provider has no lawful construction source.',
          null,
          false
        )
      ]
    });
  }

  let constructed;

  if (
    strategy ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy.FLAT_PLANE
  ) {
    constructed =
      constructFlatPlane({
        providerId:
          normalizedProviderId,
        providerRole:
          normalizedProviderRole,
        sourceZoneIds:
          normalizedZoneIds,
        sourceObjectIds:
          normalizedObjectIds,
        descriptor
      });
  } else if (
    strategy ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .groundStrategy.HEIGHT_FIELD
  ) {
    constructed =
      descriptor.heightField?.shorelineBoundary
        ? constructBoundaryHeightField({
            providerId:
              normalizedProviderId,
            providerRole:
              normalizedProviderRole,
            sourceZoneIds:
              normalizedZoneIds,
            sourceObjectIds:
              normalizedObjectIds,
            descriptor
          })
        : constructOrdinaryHeightField({
            providerId:
              normalizedProviderId,
            providerRole:
              normalizedProviderRole,
            sourceZoneIds:
              normalizedZoneIds,
            sourceObjectIds:
              normalizedObjectIds,
            descriptor
          });
  } else {
    constructed =
      constructExplicitMesh({
        providerId:
          normalizedProviderId,
        providerRole:
          normalizedProviderRole,
        sourceZoneIds:
          normalizedZoneIds,
        sourceObjectIds:
          normalizedObjectIds,
        descriptor
      });
  }

  const primitive =
    constructed.primitive;

  if (!isHEarthNeutralPrimitiveRecord(primitive)) {
    return createResult({
      providerId:
        normalizedProviderId,
      providerRole:
        normalizedProviderRole,
      sourceZoneIds:
        normalizedZoneIds,
      sourceObjectIds:
        normalizedObjectIds,
      strategy,
      fatal: true,
      issues:
        constructed.issues.length > 0
          ? constructed.issues
          : [
              issue(
                'GROUND_PROVIDER_PRIMITIVE_INVALID',
                'Ground construction did not return a lawful neutral primitive.'
              )
            ]
    });
  }

  return createResult({
    providerId:
      normalizedProviderId,
    providerRole:
      normalizedProviderRole,
    sourceZoneIds:
      normalizedZoneIds,
    sourceObjectIds:
      normalizedObjectIds,
    strategy,
    primitives:
      [primitive],
    issues:
      constructed.issues,
    requestedPrimitiveCount:
      1
  });
}

export function isHEarthGroundProviderReceipt(receipt) {
  return (
    isPlainObject(receipt) &&
    receipt.recordType ===
      'H_EARTH_GROUND_PROVIDER_RECEIPT' &&
    isNonEmptyString(receipt.receiptId) &&
    isNonEmptyString(receipt.providerId) &&
    receipt.providerRole ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole.GROUND &&
    isNonEmptyString(receipt.primitiveId) &&
    typeof receipt.valid === 'boolean' &&
    Array.isArray(receipt.sourceZoneIds) &&
    Array.isArray(receipt.sourceObjectIds)
  );
}

export function isHEarthGroundProviderAccount(account) {
  const keys = [
    'requestedPrimitiveCount',
    'constructedPrimitiveCount',
    'validPrimitiveCount',
    'heldPrimitiveCount',
    'neutralPrimitiveCount',
    'admittedPrimitiveCount',
    'issueCount',
    'blockingIssueCount',
    'fatalIssueCount',
    'errorIssueCount',
    'warningIssueCount',
    'infoIssueCount'
  ];
  return (
    isPlainObject(account) &&
    keys.every(
      (key) =>
        Number.isInteger(account[key]) &&
        account[key] >= 0
    ) &&
    typeof account.boundsPresent === 'boolean' &&
    typeof account.emptyBounds === 'boolean'
  );
}

export function isHEarthGroundProviderResult(record) {
  return (
    isPlainObject(record) &&
    record.recordType ===
      'H_EARTH_GROUND_PROVIDER_RESULT' &&
    isNonEmptyString(record.providerId) &&
    record.providerRole ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .providerRole.GROUND &&
    record.coordinateFrame ===
      H_EARTH_3D_GEOMETRY_COORDINATE_FRAME &&
    Object.values(
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_ENUMS
        .constructionStatus
    ).includes(record.constructionStatus) &&
    Array.isArray(record.primitives) &&
    record.primitives.every(
      isHEarthNeutralPrimitiveRecord
    ) &&
    isHEarthAABB3D(record.bounds) &&
    Array.isArray(record.issues) &&
    Array.isArray(record.receipts) &&
    record.receipts.every(
      isHEarthGroundProviderReceipt
    ) &&
    isHEarthGroundProviderAccount(
      record.account
    ) &&
    record.authority ===
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_OWNERSHIP
  );
}

export function getHEarthGeometryGroundProviderStaticReview() {
  return deepFreeze({
    reviewId:
      'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_STATIC_SELF_REVIEW_v5',
    contractId:
      H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT_ID,
    passed: true,
    status:
      'STATIC_SELF_REVIEW_PASS_CANDIDATE',
    boundaryTerminatedHeightFieldDefined: true,
    localImplementationConformance:
      'HOLD_PENDING_EXECUTABLE_CORRIDOR'
  });
}

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT =
  deepFreeze({
    receiptId:
      'H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_IMPLEMENTATION_CANDIDATE_RECEIPT_v5',
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
    implementationBodyExists: true,
    boundaryTerminatedHeightFieldDefined: true,
    localAdmission: false,
    productionAuthority: false
  });

export const H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_PUBLIC_API_CANDIDATE =
  deepFreeze({
    manifestStatus:
      'CANDIDATE_NOT_FROZEN',
    owningModule:
      'geometry-ground.js',
    classification:
      'GROUND_PROVIDER_PUBLIC_CANDIDATE',
    symbols: deepFreeze([
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
    ])
  });

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
    localAdmission: false,
    productionAuthority: false
  });

export function getHEarthGeometryGroundProviderReceipt() {
  return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_RECEIPT;
}

export function getHEarthGeometryGroundProviderContract() {
  return H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT;
}

export default H_EARTH_3D_GEOMETRY_GROUND_PROVIDER_CONTRACT;
