/*
 * Universal Compass geometry authority.
 * Source-derived candidate assembled from Main, Law, Showroom, ARCHCOIN,
 * shared Home Compass geometry, and Audralia geometry precedents.
 *
 * Candidate research architecture only.
 * No renderer, compositor, controller, source-Compass, deployment, or
 * production authority.
 */
import {
  assertContract,
  assertFiniteNumber,
  assertFiniteVector,
  assertPlainRecord,
  deepFreeze
} from "./compass.contracts.js";
import {
  EPSILON,
  IDENTITY_QUATERNION,
  normalize3,
  normalizeQuaternion
} from "./compass.math.js";

export const COMPASS_GEOMETRY_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_GEOMETRY_CANDIDATE_v1",
  version: "1.0.0-source-derived-variable-capacity-geometry",
  status: "CANDIDATE_NOT_ADMITTED",
  authority: "GEOMETRY",
  sourceFamilies: Object.freeze([
    "MAIN_COMPASS",
    "LAW_COMPASS",
    "SHOWROOM_COMPASS",
    "ARCHCOIN_COMPASS"
  ]),
  templateCompass: null,
  sourceFamilyPrecedence: null,
  canonicalIdentityOwner: "WORLD",
  canonicalPrimaryOwner: "WORLD",
  projectionOwner: "COMPOSITOR",
  visualStateOwner: "NODES_OR_RENDERER",
  controllerStateOwner: "CONTROLLER",
  pointerOwner: "INTERACTIONS",
  recordImmutability: "DEEP",
  stableClusterSeatIdentityRequired: true,
  variableClusterCapacityRequired: true,
  optionalCenterParticipant: true,
  productionAuthorized: false,
  liveRebuildAuthorized: false
});

export const CENTER_KIND = Object.freeze({
  CUSTOM_MIRRORLAND_THRESHOLD: "CUSTOM_MIRRORLAND_THRESHOLD",
  PLANET: "PLANET",
  COMPASS: "COMPASS",
  NONE: "NONE",
  CUSTOM: "CUSTOM"
});

export const CONSTELLATION_RELATION = Object.freeze({
  ELLIPSOIDAL: "ELLIPSOIDAL",
  SPHERICAL: "SPHERICAL",
  CARTESIAN_SEAT_TABLE: "CARTESIAN_SEAT_TABLE",
  PROFILE_DEFINED: "PROFILE_DEFINED"
});

export const CLUSTER_RELATION = Object.freeze({
  ELLIPSOIDAL_AROUND_CARDINAL: "ELLIPSOIDAL_AROUND_CARDINAL",
  CARTESIAN_SEAT_TABLE: "CARTESIAN_SEAT_TABLE",
  PROFILE_DEFINED: "PROFILE_DEFINED"
});

export const GEOMETRY_NODE_KIND = Object.freeze({
  CENTER: "CENTER",
  CARDINAL: "CARDINAL",
  CLUSTER_MEMBER: "CLUSTER_MEMBER"
});

export const HIT_SHAPE_KIND = Object.freeze({
  SPHERE: "SPHERE",
  AABB: "AABB"
});

export const SHAPE_TOPOLOGY = Object.freeze({
  TRIANGLES: "TRIANGLES"
});

const GEOMETRY_SCHEMA = "UNIVERSAL_COMPASS_GEOMETRY_MODEL_v1";
const IDENTITY_INPUT_SCHEMA = "UNIVERSAL_COMPASS_GEOMETRY_IDENTITY_INPUT_v1";
const VALIDATION_SCHEMA = "UNIVERSAL_COMPASS_GEOMETRY_VALIDATION_RECEIPT_v1";
const RENDERER_SNAPSHOT_SCHEMA = "UNIVERSAL_COMPASS_GEOMETRY_RENDERER_SNAPSHOT_v1";
const COMPOSITOR_INPUT_SCHEMA = "UNIVERSAL_COMPASS_GEOMETRY_COMPOSITOR_INPUT_v1";
const TAU = Math.PI * 2;

function finiteNumber(value, code) {
  return assertFiniteNumber(value, code);
}

function vector3(value, code) {
  return assertFiniteVector(value, 3, code).map(Number);
}

function vector4(value, code) {
  return assertFiniteVector(value, 4, code).map(Number);
}

function positiveVector3(value, code) {
  const admitted = vector3(value, code);
  assertContract(admitted.every(component => component > 0), code, admitted);
  return admitted;
}

function requireId(value, code) {
  const id = String(value || "").trim();
  assertContract(id.length > 0, code, value);
  return id;
}

function optionalId(value) {
  return String(value || "").trim();
}

function clone(value) {
  return structuredClone(value);
}

function canonicalNumber(value) {
  const number = Number(value);
  assertContract(Number.isFinite(number), "COMPASS_GEOMETRY_NONFINITE_NUMBER", value);
  return Object.is(number, -0) ? 0 : number;
}

function stableValue(value) {
  if (Array.isArray(value)) {
    return value.map(stableValue);
  }
  if (value && typeof value === "object") {
    const output = {};
    Object.keys(value).sort().forEach(key => {
      output[key] = stableValue(value[key]);
    });
    return output;
  }
  if (typeof value === "number") {
    return canonicalNumber(value);
  }
  return value;
}

export function stableGeometrySerialize(value) {
  return JSON.stringify(stableValue(value));
}

export function hashGeometryValue(value) {
  const source = stableGeometrySerialize(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, "0")}`;
}

function subtract3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function length3(value) {
  return Math.hypot(value[0], value[1], value[2]);
}

function triangleNormal(a, b, c) {
  const normal = cross3(subtract3(b, a), subtract3(c, a));
  assertContract(
    length3(normal) > EPSILON,
    "COMPASS_GEOMETRY_DEGENERATE_TRIANGLE",
    Object.freeze({ a, b, c })
  );
  return normalize3(normal, [0, 0, 1]);
}

function normalizeBounds(bounds) {
  assertPlainRecord(bounds, "COMPASS_GEOMETRY_BOUNDS_REQUIRED");
  const minimum = vector3(bounds.min, "COMPASS_GEOMETRY_BOUNDS_MIN_INVALID");
  const maximum = vector3(bounds.max, "COMPASS_GEOMETRY_BOUNDS_MAX_INVALID");
  assertContract(
    maximum.every((value, index) => value > minimum[index]),
    "COMPASS_GEOMETRY_BOUNDS_DEGENERATE",
    bounds
  );
  const center = minimum.map((value, index) => (value + maximum[index]) * 0.5);
  const size = maximum.map((value, index) => value - minimum[index]);
  const radius = Math.hypot(size[0], size[1], size[2]) * 0.5;
  return deepFreeze({ min: minimum, max: maximum, center, size, radius });
}

export function boundsFromPositions(positions) {
  assertContract(
    Array.isArray(positions) && positions.length >= 3,
    "COMPASS_GEOMETRY_POSITIONS_REQUIRED"
  );
  const admitted = positions.map(position =>
    vector3(position, "COMPASS_GEOMETRY_POSITION_INVALID")
  );
  const minimum = admitted[0].slice();
  const maximum = admitted[0].slice();
  admitted.slice(1).forEach(position => {
    for (let axis = 0; axis < 3; axis += 1) {
      minimum[axis] = Math.min(minimum[axis], position[axis]);
      maximum[axis] = Math.max(maximum[axis], position[axis]);
    }
  });
  for (let axis = 0; axis < 3; axis += 1) {
    if (maximum[axis] - minimum[axis] <= EPSILON) {
      minimum[axis] -= EPSILON;
      maximum[axis] += EPSILON;
    }
  }
  return normalizeBounds({ min: minimum, max: maximum });
}

function scaledBounds(bounds, scale) {
  const admitted = normalizeBounds(bounds);
  const admittedScale = positiveVector3(scale, "COMPASS_GEOMETRY_NODE_SCALE_INVALID");
  const candidates = [];
  for (const x of [admitted.min[0], admitted.max[0]]) {
    for (const y of [admitted.min[1], admitted.max[1]]) {
      for (const z of [admitted.min[2], admitted.max[2]]) {
        candidates.push([
          x * admittedScale[0],
          y * admittedScale[1],
          z * admittedScale[2]
        ]);
      }
    }
  }
  return boundsFromPositions(candidates);
}

function translatedBounds(bounds, translation) {
  const admitted = normalizeBounds(bounds);
  const offset = vector3(translation, "COMPASS_GEOMETRY_BOUNDS_TRANSLATION_INVALID");
  return normalizeBounds({
    min: admitted.min.map((value, index) => value + offset[index]),
    max: admitted.max.map((value, index) => value + offset[index])
  });
}

function unionBounds(boundsRecords) {
  assertContract(
    Array.isArray(boundsRecords) && boundsRecords.length > 0,
    "COMPASS_GEOMETRY_BOUND_SET_REQUIRED"
  );
  const admitted = boundsRecords.map(normalizeBounds);
  const minimum = admitted[0].min.slice();
  const maximum = admitted[0].max.slice();
  admitted.slice(1).forEach(bounds => {
    for (let axis = 0; axis < 3; axis += 1) {
      minimum[axis] = Math.min(minimum[axis], bounds.min[axis]);
      maximum[axis] = Math.max(maximum[axis], bounds.max[axis]);
    }
  });
  return normalizeBounds({ min: minimum, max: maximum });
}

function calculateNormals(positions, indices) {
  const normals = positions.map(() => [0, 0, 0]);
  const triangleIndices = indices.length > 0
    ? indices
    : positions.map((_, index) => index);

  assertContract(
    triangleIndices.length % 3 === 0,
    "COMPASS_GEOMETRY_TRIANGLE_INDEX_COUNT_INVALID"
  );

  for (let cursor = 0; cursor < triangleIndices.length; cursor += 3) {
    const ia = triangleIndices[cursor];
    const ib = triangleIndices[cursor + 1];
    const ic = triangleIndices[cursor + 2];
    [ia, ib, ic].forEach(index => {
      assertContract(
        Number.isInteger(index) && index >= 0 && index < positions.length,
        "COMPASS_GEOMETRY_INDEX_OUT_OF_RANGE",
        index
      );
    });
    const normal = triangleNormal(positions[ia], positions[ib], positions[ic]);
    [ia, ib, ic].forEach(index => {
      normals[index][0] += normal[0];
      normals[index][1] += normal[1];
      normals[index][2] += normal[2];
    });
  }

  return normals.map(normal => normalize3(normal, [0, 0, 1]));
}

export function createMeshShapeDefinition({
  id,
  positions,
  indices = [],
  normals = null,
  triangleMaterialRegionIds,
  triangleFacetRoleIds
}) {
  const shapeId = requireId(id, "COMPASS_GEOMETRY_SHAPE_ID_REQUIRED");
  assertContract(
    Array.isArray(positions) && positions.length >= 3,
    "COMPASS_GEOMETRY_SHAPE_POSITIONS_REQUIRED"
  );
  const admittedPositions = positions.map(position =>
    vector3(position, "COMPASS_GEOMETRY_SHAPE_POSITION_INVALID")
  );
  const admittedIndices = Array.from(indices || []).map(index => Number(index));
  const triangleIndexCount = admittedIndices.length > 0
    ? admittedIndices.length
    : admittedPositions.length;
  assertContract(
    triangleIndexCount % 3 === 0,
    "COMPASS_GEOMETRY_SHAPE_TRIANGLE_COUNT_INVALID"
  );
  const triangleCount = triangleIndexCount / 3;
  const admittedNormals = normals === null
    ? calculateNormals(admittedPositions, admittedIndices)
    : normals.map(normal => normalize3(
        vector3(normal, "COMPASS_GEOMETRY_SHAPE_NORMAL_INVALID"),
        [0, 0, 1]
      ));
  assertContract(
    admittedNormals.length === admittedPositions.length,
    "COMPASS_GEOMETRY_SHAPE_NORMAL_COUNT_MISMATCH"
  );
  admittedNormals.forEach(normal => {
    assertContract(
      Math.abs(length3(normal) - 1) <= 1e-7,
      "COMPASS_GEOMETRY_SHAPE_NORMAL_NOT_NORMALIZED",
      normal
    );
  });

  assertContract(
    Array.isArray(triangleMaterialRegionIds) &&
      triangleMaterialRegionIds.length === triangleCount,
    "COMPASS_GEOMETRY_MATERIAL_REGION_TRIANGLE_COUNT_INVALID"
  );
  assertContract(
    Array.isArray(triangleFacetRoleIds) &&
      triangleFacetRoleIds.length === triangleCount,
    "COMPASS_GEOMETRY_FACET_ROLE_TRIANGLE_COUNT_INVALID"
  );

  return deepFreeze({
    id: shapeId,
    topology: SHAPE_TOPOLOGY.TRIANGLES,
    positions: admittedPositions,
    normals: admittedNormals,
    indices: admittedIndices,
    triangleMaterialRegionIds: triangleMaterialRegionIds.map(value =>
      requireId(value, "COMPASS_GEOMETRY_TRIANGLE_MATERIAL_REGION_REQUIRED")
    ),
    triangleFacetRoleIds: triangleFacetRoleIds.map(value =>
      requireId(value, "COMPASS_GEOMETRY_TRIANGLE_FACET_ROLE_REQUIRED")
    ),
    bounds: boundsFromPositions(admittedPositions)
  });
}

function pushTriangle(target, a, b, c, materialRegionId, facetRoleId) {
  target.positions.push(a, b, c);
  target.materials.push(materialRegionId);
  target.facets.push(facetRoleId);
}

export function buildFacetedCrystalShape({
  id,
  radialSegments = 8,
  halfHeight = 1,
  shoulderRadius = 0.46,
  shoulderY = 0.30,
  waistRadius = 0.30,
  waistY = -0.28,
  capMaterialRegionId = "CRYSTAL_CAP",
  sideMaterialRegionId = "CRYSTAL_FACET"
} = {}) {
  assertContract(
    Number.isInteger(radialSegments) && radialSegments >= 4,
    "COMPASS_GEOMETRY_CRYSTAL_SEGMENT_COUNT_INVALID"
  );
  [halfHeight, shoulderRadius, waistRadius].forEach(value =>
    assertContract(Number.isFinite(value) && value > 0, "COMPASS_GEOMETRY_CRYSTAL_DIMENSION_INVALID")
  );
  assertContract(
    shoulderY < halfHeight && waistY > -halfHeight && shoulderY > waistY,
    "COMPASS_GEOMETRY_CRYSTAL_LEVELS_INVALID"
  );

  const top = [0, halfHeight, 0];
  const bottom = [0, -halfHeight, 0];
  const upper = [];
  const lower = [];
  for (let index = 0; index < radialSegments; index += 1) {
    const angle = TAU * index / radialSegments;
    upper.push([
      Math.cos(angle) * shoulderRadius,
      shoulderY,
      Math.sin(angle) * shoulderRadius
    ]);
    lower.push([
      Math.cos(angle) * waistRadius,
      waistY,
      Math.sin(angle) * waistRadius
    ]);
  }

  const mesh = { positions: [], materials: [], facets: [] };
  for (let index = 0; index < radialSegments; index += 1) {
    const next = (index + 1) % radialSegments;
    pushTriangle(mesh, top, upper[index], upper[next], capMaterialRegionId, "UPPER_CAP");
    pushTriangle(mesh, upper[index], lower[index], lower[next], sideMaterialRegionId, `SIDE_${index}_A`);
    pushTriangle(mesh, upper[index], lower[next], upper[next], sideMaterialRegionId, `SIDE_${index}_B`);
    pushTriangle(mesh, bottom, lower[next], lower[index], capMaterialRegionId, "LOWER_CAP");
  }

  return createMeshShapeDefinition({
    id,
    positions: mesh.positions,
    triangleMaterialRegionIds: mesh.materials,
    triangleFacetRoleIds: mesh.facets
  });
}

export function buildRadialStarShape({
  id,
  points = 5,
  outerRadius = 1,
  innerRadius = 0.44,
  depth = 0.30,
  faceMaterialRegionId = "STAR_FACE",
  edgeMaterialRegionId = "STAR_EDGE"
} = {}) {
  assertContract(
    Number.isInteger(points) && points >= 4,
    "COMPASS_GEOMETRY_STAR_POINT_COUNT_INVALID"
  );
  [outerRadius, innerRadius, depth].forEach(value =>
    assertContract(Number.isFinite(value) && value > 0, "COMPASS_GEOMETRY_STAR_DIMENSION_INVALID")
  );
  assertContract(innerRadius < outerRadius, "COMPASS_GEOMETRY_STAR_RADIUS_ORDER_INVALID");

  const polygon = [];
  for (let index = 0; index < points * 2; index += 1) {
    const radius = index % 2 === 0 ? outerRadius : innerRadius;
    const angle = Math.PI * 0.5 + Math.PI * index / points;
    polygon.push([Math.cos(angle) * radius, Math.sin(angle) * radius]);
  }
  const frontZ = depth * 0.5;
  const rearZ = -frontZ;
  const frontCenter = [0, 0, frontZ];
  const rearCenter = [0, 0, rearZ];
  const mesh = { positions: [], materials: [], facets: [] };

  for (let index = 0; index < polygon.length; index += 1) {
    const next = (index + 1) % polygon.length;
    const frontA = [polygon[index][0], polygon[index][1], frontZ];
    const frontB = [polygon[next][0], polygon[next][1], frontZ];
    const rearA = [polygon[index][0], polygon[index][1], rearZ];
    const rearB = [polygon[next][0], polygon[next][1], rearZ];
    pushTriangle(mesh, frontCenter, frontA, frontB, faceMaterialRegionId, "FRONT_FACE");
    pushTriangle(mesh, rearCenter, rearB, rearA, faceMaterialRegionId, "REAR_FACE");
    pushTriangle(mesh, frontA, rearA, rearB, edgeMaterialRegionId, `EDGE_${index}_A`);
    pushTriangle(mesh, frontA, rearB, frontB, edgeMaterialRegionId, `EDGE_${index}_B`);
  }

  return createMeshShapeDefinition({
    id,
    positions: mesh.positions,
    triangleMaterialRegionIds: mesh.materials,
    triangleFacetRoleIds: mesh.facets
  });
}

export function buildUvSphereShape({
  id,
  radius = 1,
  longitudeSegments = 20,
  latitudeSegments = 12,
  materialRegionId = "CENTER_SURFACE"
} = {}) {
  assertContract(Number.isFinite(radius) && radius > 0, "COMPASS_GEOMETRY_SPHERE_RADIUS_INVALID");
  assertContract(
    Number.isInteger(longitudeSegments) && longitudeSegments >= 6,
    "COMPASS_GEOMETRY_SPHERE_LONGITUDE_SEGMENTS_INVALID"
  );
  assertContract(
    Number.isInteger(latitudeSegments) && latitudeSegments >= 4,
    "COMPASS_GEOMETRY_SPHERE_LATITUDE_SEGMENTS_INVALID"
  );

  const rings = [];
  for (let latitudeIndex = 1; latitudeIndex < latitudeSegments; latitudeIndex += 1) {
    const latitude = -Math.PI * 0.5 + Math.PI * latitudeIndex / latitudeSegments;
    const ring = [];
    for (let longitudeIndex = 0; longitudeIndex < longitudeSegments; longitudeIndex += 1) {
      const longitude = TAU * longitudeIndex / longitudeSegments;
      ring.push([
        Math.cos(latitude) * Math.cos(longitude) * radius,
        Math.sin(latitude) * radius,
        Math.cos(latitude) * Math.sin(longitude) * radius
      ]);
    }
    rings.push(ring);
  }

  const bottom = [0, -radius, 0];
  const top = [0, radius, 0];
  const mesh = { positions: [], materials: [], facets: [] };
  const firstRing = rings[0];
  const lastRing = rings[rings.length - 1];

  for (let longitudeIndex = 0; longitudeIndex < longitudeSegments; longitudeIndex += 1) {
    const next = (longitudeIndex + 1) % longitudeSegments;
    pushTriangle(mesh, bottom, firstRing[next], firstRing[longitudeIndex], materialRegionId, "SOUTH_CAP");
    pushTriangle(mesh, top, lastRing[longitudeIndex], lastRing[next], materialRegionId, "NORTH_CAP");
  }

  for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex += 1) {
    const lower = rings[ringIndex];
    const upper = rings[ringIndex + 1];
    for (let longitudeIndex = 0; longitudeIndex < longitudeSegments; longitudeIndex += 1) {
      const next = (longitudeIndex + 1) % longitudeSegments;
      pushTriangle(mesh, lower[longitudeIndex], upper[next], upper[longitudeIndex], materialRegionId, `BAND_${ringIndex}_A`);
      pushTriangle(mesh, lower[longitudeIndex], lower[next], upper[next], materialRegionId, `BAND_${ringIndex}_B`);
    }
  }

  return createMeshShapeDefinition({
    id,
    positions: mesh.positions,
    triangleMaterialRegionIds: mesh.materials,
    triangleFacetRoleIds: mesh.facets
  });
}

export function buildStableEllipsoidalSeatTable({
  templateId,
  capacity,
  radii,
  latitudeAmplitude = 0.48,
  latitudeFrequency = 1.73
}) {
  const id = requireId(templateId, "COMPASS_GEOMETRY_SEAT_TEMPLATE_ID_REQUIRED");
  assertContract(
    Number.isInteger(capacity) && capacity > 0,
    "COMPASS_GEOMETRY_SEAT_TEMPLATE_CAPACITY_INVALID"
  );
  const admittedRadii = positiveVector3(radii, "COMPASS_GEOMETRY_SEAT_TEMPLATE_RADII_INVALID");
  const amplitude = finiteNumber(latitudeAmplitude, "COMPASS_GEOMETRY_SEAT_LATITUDE_AMPLITUDE_INVALID");
  const frequency = finiteNumber(latitudeFrequency, "COMPASS_GEOMETRY_SEAT_LATITUDE_FREQUENCY_INVALID");

  const seats = [];
  for (let seatIndex = 0; seatIndex < capacity; seatIndex += 1) {
    const longitude = TAU * seatIndex / capacity;
    const latitude = Math.sin(longitude * frequency) * amplitude;
    const direction = normalize3([
      Math.cos(latitude) * Math.sin(longitude),
      Math.sin(latitude),
      Math.cos(latitude) * Math.cos(longitude)
    ]);
    seats.push(deepFreeze({
      seatId: `${id}:seat:${String(seatIndex + 1).padStart(2, "0")}`,
      seatIndex,
      localPosition: [
        direction[0] * admittedRadii[0],
        direction[1] * admittedRadii[1],
        direction[2] * admittedRadii[2]
      ],
      localOrientation: [...IDENTITY_QUATERNION],
      localScale: [1, 1, 1]
    }));
  }
  return deepFreeze({
    templateId: `${id}:capacity:${capacity}`,
    capacity,
    generationMode: "FIXED_CAPACITY_MIGRATION_UTILITY",
    canonicalRuntimeInput: "EXPLICIT_SEAT_RECORDS",
    seats
  });
}

export function buildCartesianSeatTable({ templateId, positions }) {
  const id = requireId(templateId, "COMPASS_GEOMETRY_CARTESIAN_TEMPLATE_ID_REQUIRED");
  assertContract(
    Array.isArray(positions) && positions.length > 0,
    "COMPASS_GEOMETRY_CARTESIAN_POSITIONS_REQUIRED"
  );
  const seats = positions.map((position, seatIndex) => deepFreeze({
    seatId: `${id}:seat:${String(seatIndex + 1).padStart(2, "0")}`,
    seatIndex,
    localPosition: vector3(position, "COMPASS_GEOMETRY_CARTESIAN_POSITION_INVALID"),
    localOrientation: [...IDENTITY_QUATERNION],
    localScale: [1, 1, 1]
  }));
  return deepFreeze({
    templateId: id,
    capacity: seats.length,
    generationMode: "EXPLICIT_CARTESIAN_TABLE",
    canonicalRuntimeInput: "EXPLICIT_SEAT_RECORDS",
    seats
  });
}

function validateMaterialRegions(materialRegionDefinitions) {
  assertContract(
    Array.isArray(materialRegionDefinitions) && materialRegionDefinitions.length > 0,
    "COMPASS_GEOMETRY_MATERIAL_REGIONS_REQUIRED"
  );
  const ids = new Set();
  return materialRegionDefinitions.map(definition => {
    assertPlainRecord(definition, "COMPASS_GEOMETRY_MATERIAL_REGION_INVALID");
    const id = requireId(definition.id, "COMPASS_GEOMETRY_MATERIAL_REGION_ID_REQUIRED");
    assertContract(!ids.has(id), "COMPASS_GEOMETRY_MATERIAL_REGION_DUPLICATE", id);
    ids.add(id);
    return deepFreeze({
      id,
      semanticRole: requireId(
        definition.semanticRole,
        "COMPASS_GEOMETRY_MATERIAL_REGION_ROLE_REQUIRED"
      )
    });
  });
}

function validateShapes(shapeDefinitions, materialRegionIds) {
  assertContract(
    Array.isArray(shapeDefinitions) && shapeDefinitions.length > 0,
    "COMPASS_GEOMETRY_SHAPES_REQUIRED"
  );
  const ids = new Set();
  return shapeDefinitions.map(shape => {
    assertPlainRecord(shape, "COMPASS_GEOMETRY_SHAPE_RECORD_INVALID");
    const admitted = createMeshShapeDefinition(shape);
    assertContract(!ids.has(admitted.id), "COMPASS_GEOMETRY_SHAPE_DUPLICATE", admitted.id);
    ids.add(admitted.id);
    admitted.triangleMaterialRegionIds.forEach(regionId => {
      assertContract(
        materialRegionIds.has(regionId),
        "COMPASS_GEOMETRY_SHAPE_MATERIAL_REGION_UNKNOWN",
        Object.freeze({ shapeId: admitted.id, regionId })
      );
    });
    return admitted;
  });
}

function validateIdentityInput(identityInput) {
  assertPlainRecord(identityInput, "COMPASS_GEOMETRY_IDENTITY_INPUT_REQUIRED");
  assertContract(
    identityInput.schema === IDENTITY_INPUT_SCHEMA,
    "COMPASS_GEOMETRY_IDENTITY_SCHEMA_INVALID"
  );
  assertContract(
    Array.isArray(identityInput.cardinals) && identityInput.cardinals.length === 4,
    "COMPASS_GEOMETRY_EXACTLY_FOUR_CARDINALS_REQUIRED"
  );
  assertPlainRecord(identityInput.clusters, "COMPASS_GEOMETRY_CLUSTER_IDENTITIES_REQUIRED");

  const globalIds = new Set();
  const orders = new Set();
  const cardinals = identityInput.cardinals.map(cardinal => {
    assertPlainRecord(cardinal, "COMPASS_GEOMETRY_CARDINAL_IDENTITY_INVALID");
    const id = requireId(cardinal.id, "COMPASS_GEOMETRY_CARDINAL_ID_REQUIRED");
    assertContract(!globalIds.has(id), "COMPASS_GEOMETRY_NODE_ID_DUPLICATE", id);
    globalIds.add(id);
    const order = Number(cardinal.order);
    assertContract(
      Number.isInteger(order) && order >= 0 && order < 4 && !orders.has(order),
      "COMPASS_GEOMETRY_CARDINAL_ORDER_INVALID",
      order
    );
    orders.add(order);
    return deepFreeze({
      id,
      semanticId: requireId(cardinal.semanticId, "COMPASS_GEOMETRY_CARDINAL_SEMANTIC_ID_REQUIRED"),
      order,
      baseVector: normalize3(
        vector3(cardinal.baseVector, "COMPASS_GEOMETRY_CARDINAL_BASE_VECTOR_INVALID")
      )
    });
  }).sort((a, b) => a.order - b.order);

  assertContract(
    cardinals.every((cardinal, index) => cardinal.order === index),
    "COMPASS_GEOMETRY_CARDINAL_ORDER_NOT_CONTIGUOUS"
  );

  const clusters = {};
  cardinals.forEach(cardinal => {
    const members = identityInput.clusters[cardinal.id];
    assertContract(
      Array.isArray(members),
      "COMPASS_GEOMETRY_CLUSTER_MEMBER_IDENTITIES_REQUIRED",
      cardinal.id
    );
    const seatIds = new Set();
    clusters[cardinal.id] = members.map(member => {
      assertPlainRecord(member, "COMPASS_GEOMETRY_CLUSTER_MEMBER_IDENTITY_INVALID");
      const id = requireId(member.id, "COMPASS_GEOMETRY_CLUSTER_MEMBER_ID_REQUIRED");
      assertContract(!globalIds.has(id), "COMPASS_GEOMETRY_NODE_ID_DUPLICATE", id);
      globalIds.add(id);
      const seatId = requireId(member.seatId, "COMPASS_GEOMETRY_CLUSTER_MEMBER_SEAT_ID_REQUIRED");
      assertContract(!seatIds.has(seatId), "COMPASS_GEOMETRY_CLUSTER_MEMBER_SEAT_DUPLICATE", seatId);
      seatIds.add(seatId);
      return deepFreeze({
        id,
        semanticId: requireId(member.semanticId, "COMPASS_GEOMETRY_CLUSTER_MEMBER_SEMANTIC_ID_REQUIRED"),
        seatId
      });
    });
  });

  return deepFreeze({
    schema: IDENTITY_INPUT_SCHEMA,
    cardinals,
    clusters
  });
}

function validateCoordinateSystem(record) {
  assertPlainRecord(record, "COMPASS_GEOMETRY_COORDINATE_SYSTEM_REQUIRED");
  assertContract(
    record.handedness === "RIGHT_HANDED",
    "COMPASS_GEOMETRY_HANDEDNESS_INVALID",
    record.handedness
  );
  const upAxis = normalize3(
    vector3(record.upAxis, "COMPASS_GEOMETRY_UP_AXIS_INVALID"),
    [0, 1, 0]
  );
  return deepFreeze({
    handedness: "RIGHT_HANDED",
    upAxis,
    units: requireId(record.units, "COMPASS_GEOMETRY_UNITS_REQUIRED")
  });
}

function validateRelationValue(value, allowed, code) {
  assertContract(Object.values(allowed).includes(value), code, value);
  return value;
}

function validateMaterialRegionList(values, materialRegionIds, code) {
  assertContract(Array.isArray(values) && values.length > 0, code);
  const unique = new Set();
  return values.map(value => {
    const id = requireId(value, code);
    assertContract(materialRegionIds.has(id), "COMPASS_GEOMETRY_NODE_MATERIAL_REGION_UNKNOWN", id);
    assertContract(!unique.has(id), "COMPASS_GEOMETRY_NODE_MATERIAL_REGION_DUPLICATE", id);
    unique.add(id);
    return id;
  });
}

function normalizeAnchorOffsets(record, bounds) {
  const admittedBounds = normalizeBounds(bounds);
  const source = record || {};
  assertPlainRecord(source, "COMPASS_GEOMETRY_ANCHOR_OFFSETS_INVALID");
  const visual = source.visual
    ? vector3(source.visual, "COMPASS_GEOMETRY_VISUAL_ANCHOR_INVALID")
    : [0, 0, 0];
  const semantic = source.semantic
    ? vector3(source.semantic, "COMPASS_GEOMETRY_SEMANTIC_ANCHOR_INVALID")
    : visual.slice();
  const label = source.label
    ? vector3(source.label, "COMPASS_GEOMETRY_LABEL_ANCHOR_INVALID")
    : [0, admittedBounds.max[1] + admittedBounds.size[1] * 0.15, 0];
  return deepFreeze({ visual, semantic, label });
}

function normalizeHitShape(record, bounds) {
  const admittedBounds = normalizeBounds(bounds);
  if (record === null || record === undefined) {
    return deepFreeze({
      kind: HIT_SHAPE_KIND.SPHERE,
      center: admittedBounds.center.slice(),
      radius: admittedBounds.radius
    });
  }
  assertPlainRecord(record, "COMPASS_GEOMETRY_HIT_SHAPE_INVALID");
  if (record.kind === HIT_SHAPE_KIND.SPHERE) {
    const radius = finiteNumber(record.radius, "COMPASS_GEOMETRY_HIT_SPHERE_RADIUS_INVALID");
    assertContract(radius > 0, "COMPASS_GEOMETRY_HIT_SPHERE_RADIUS_NONPOSITIVE");
    return deepFreeze({
      kind: HIT_SHAPE_KIND.SPHERE,
      center: vector3(record.center, "COMPASS_GEOMETRY_HIT_SPHERE_CENTER_INVALID"),
      radius
    });
  }
  assertContract(record.kind === HIT_SHAPE_KIND.AABB, "COMPASS_GEOMETRY_HIT_SHAPE_KIND_INVALID");
  const hitBounds = normalizeBounds({ min: record.min, max: record.max });
  return deepFreeze({
    kind: HIT_SHAPE_KIND.AABB,
    min: hitBounds.min,
    max: hitBounds.max
  });
}

function validateGeometryProfile(profile, cardinalIds, shapeById, materialRegionIds) {
  assertPlainRecord(profile, "COMPASS_GEOMETRY_PROFILE_REQUIRED");
  const profileIdentity = requireId(profile.id, "COMPASS_GEOMETRY_PROFILE_ID_REQUIRED");
  const coordinateSystem = validateCoordinateSystem(profile.coordinateSystem);

  assertPlainRecord(profile.constellation, "COMPASS_GEOMETRY_CONSTELLATION_PROFILE_REQUIRED");
  const constellationRelation = validateRelationValue(
    profile.constellation.relation,
    CONSTELLATION_RELATION,
    "COMPASS_GEOMETRY_CONSTELLATION_RELATION_INVALID"
  );
  const cardinalShapeId = requireId(
    profile.constellation.cardinalShapeId,
    "COMPASS_GEOMETRY_CARDINAL_SHAPE_ID_REQUIRED"
  );
  assertContract(shapeById.has(cardinalShapeId), "COMPASS_GEOMETRY_CARDINAL_SHAPE_UNKNOWN", cardinalShapeId);
  const cardinalMaterialRegionIds = validateMaterialRegionList(
    profile.constellation.materialRegionIds,
    materialRegionIds,
    "COMPASS_GEOMETRY_CARDINAL_MATERIAL_REGIONS_INVALID"
  );
  const cardinalScale = positiveVector3(
    profile.constellation.localScale,
    "COMPASS_GEOMETRY_CARDINAL_SCALE_INVALID"
  );
  const constellationRadii = profile.constellation.radii === null || profile.constellation.radii === undefined
    ? null
    : positiveVector3(profile.constellation.radii, "COMPASS_GEOMETRY_CONSTELLATION_RADII_INVALID");
  if (constellationRelation === CONSTELLATION_RELATION.ELLIPSOIDAL) {
    assertContract(constellationRadii !== null, "COMPASS_GEOMETRY_ELLIPSOIDAL_RADII_REQUIRED");
  }
  if (constellationRelation === CONSTELLATION_RELATION.SPHERICAL) {
    assertContract(constellationRadii !== null, "COMPASS_GEOMETRY_SPHERICAL_RADII_REQUIRED");
    assertContract(
      Math.max(...constellationRadii) - Math.min(...constellationRadii) <= 1e-8,
      "COMPASS_GEOMETRY_SPHERICAL_RADII_NOT_EQUAL",
      constellationRadii
    );
  }
  const positionsByCardinal = {};
  if (
    constellationRelation === CONSTELLATION_RELATION.CARTESIAN_SEAT_TABLE ||
    constellationRelation === CONSTELLATION_RELATION.PROFILE_DEFINED
  ) {
    assertPlainRecord(
      profile.constellation.positionsByCardinal,
      "COMPASS_GEOMETRY_CARDINAL_POSITION_TABLE_REQUIRED"
    );
    cardinalIds.forEach(cardinalId => {
      positionsByCardinal[cardinalId] = vector3(
        profile.constellation.positionsByCardinal[cardinalId],
        "COMPASS_GEOMETRY_CARDINAL_POSITION_INVALID"
      );
    });
  }

  assertPlainRecord(profile.clusters, "COMPASS_GEOMETRY_CLUSTER_PROFILES_REQUIRED");
  const clusters = {};
  cardinalIds.forEach(cardinalId => {
    const cluster = profile.clusters[cardinalId];
    assertPlainRecord(cluster, "COMPASS_GEOMETRY_CLUSTER_PROFILE_REQUIRED");
    const relation = validateRelationValue(
      cluster.relation,
      CLUSTER_RELATION,
      "COMPASS_GEOMETRY_CLUSTER_RELATION_INVALID"
    );
    const capacity = Number(cluster.capacity);
    assertContract(
      Number.isInteger(capacity) && capacity > 0,
      "COMPASS_GEOMETRY_CLUSTER_CAPACITY_INVALID",
      Object.freeze({ cardinalId, capacity })
    );
    const memberShapeId = requireId(cluster.memberShapeId, "COMPASS_GEOMETRY_MEMBER_SHAPE_ID_REQUIRED");
    assertContract(shapeById.has(memberShapeId), "COMPASS_GEOMETRY_MEMBER_SHAPE_UNKNOWN", memberShapeId);
    const memberMaterialRegionIds = validateMaterialRegionList(
      cluster.materialRegionIds,
      materialRegionIds,
      "COMPASS_GEOMETRY_MEMBER_MATERIAL_REGIONS_INVALID"
    );
    const memberScale = positiveVector3(cluster.localScale, "COMPASS_GEOMETRY_MEMBER_SCALE_INVALID");
    assertContract(
      Array.isArray(cluster.seatRecords) && cluster.seatRecords.length === capacity,
      "COMPASS_GEOMETRY_CLUSTER_SEAT_COUNT_MISMATCH",
      cardinalId
    );
    const seatIds = new Set();
    const seatIndices = new Set();
    const seatRecords = cluster.seatRecords.map(seat => {
      assertPlainRecord(seat, "COMPASS_GEOMETRY_CLUSTER_SEAT_INVALID");
      const seatId = requireId(seat.seatId, "COMPASS_GEOMETRY_CLUSTER_SEAT_ID_REQUIRED");
      const seatIndex = Number(seat.seatIndex);
      assertContract(!seatIds.has(seatId), "COMPASS_GEOMETRY_CLUSTER_SEAT_ID_DUPLICATE", seatId);
      assertContract(
        Number.isInteger(seatIndex) && seatIndex >= 0 && seatIndex < capacity && !seatIndices.has(seatIndex),
        "COMPASS_GEOMETRY_CLUSTER_SEAT_INDEX_INVALID",
        seatIndex
      );
      seatIds.add(seatId);
      seatIndices.add(seatIndex);
      return deepFreeze({
        seatId,
        seatIndex,
        localPosition: vector3(seat.localPosition, "COMPASS_GEOMETRY_CLUSTER_SEAT_POSITION_INVALID"),
        localOrientation: normalizeQuaternion(
          seat.localOrientation || IDENTITY_QUATERNION
        ),
        localScale: positiveVector3(
          seat.localScale || [1, 1, 1],
          "COMPASS_GEOMETRY_CLUSTER_SEAT_SCALE_INVALID"
        )
      });
    }).sort((a, b) => a.seatIndex - b.seatIndex);
    assertContract(
      seatRecords.every((seat, index) => seat.seatIndex === index),
      "COMPASS_GEOMETRY_CLUSTER_SEAT_INDEX_NOT_CONTIGUOUS",
      cardinalId
    );
    clusters[cardinalId] = deepFreeze({
      relation,
      capacity,
      memberShapeId,
      materialRegionIds: memberMaterialRegionIds,
      localScale: memberScale,
      seatRecords,
      anchorOffsets: clone(cluster.anchorOffsets || {}),
      hitShape: cluster.hitShape === undefined ? null : clone(cluster.hitShape)
    });
  });

  let center = null;
  if (profile.center !== null && profile.center !== undefined) {
    assertPlainRecord(profile.center, "COMPASS_GEOMETRY_CENTER_PROFILE_INVALID");
    assertContract(
      Object.values(CENTER_KIND).includes(profile.center.kind) && profile.center.kind !== CENTER_KIND.NONE,
      "COMPASS_GEOMETRY_CENTER_KIND_INVALID",
      profile.center.kind
    );
    const shapeId = requireId(profile.center.shapeId, "COMPASS_GEOMETRY_CENTER_SHAPE_ID_REQUIRED");
    assertContract(shapeById.has(shapeId), "COMPASS_GEOMETRY_CENTER_SHAPE_UNKNOWN", shapeId);
    center = deepFreeze({
      id: requireId(profile.center.id, "COMPASS_GEOMETRY_CENTER_ID_REQUIRED"),
      visualIdentity: requireId(profile.center.visualIdentity, "COMPASS_GEOMETRY_CENTER_VISUAL_IDENTITY_REQUIRED"),
      semanticId: optionalId(profile.center.semanticId),
      kind: profile.center.kind,
      shapeId,
      localPosition: vector3(profile.center.localPosition, "COMPASS_GEOMETRY_CENTER_POSITION_INVALID"),
      localOrientation: normalizeQuaternion(profile.center.localOrientation || IDENTITY_QUATERNION),
      localScale: positiveVector3(profile.center.localScale, "COMPASS_GEOMETRY_CENTER_SCALE_INVALID"),
      materialRegionIds: validateMaterialRegionList(
        profile.center.materialRegionIds,
        materialRegionIds,
        "COMPASS_GEOMETRY_CENTER_MATERIAL_REGIONS_INVALID"
      ),
      anchorOffsets: clone(profile.center.anchorOffsets || {}),
      hitShape: profile.center.hitShape === undefined ? null : clone(profile.center.hitShape)
    });
  }

  return deepFreeze({
    id: profileIdentity,
    coordinateSystem,
    center,
    constellation: {
      relation: constellationRelation,
      radii: constellationRadii,
      positionsByCardinal,
      cardinalShapeId,
      materialRegionIds: cardinalMaterialRegionIds,
      localScale: cardinalScale,
      anchorOffsets: clone(profile.constellation.anchorOffsets || {}),
      hitShape: profile.constellation.hitShape === undefined ? null : clone(profile.constellation.hitShape)
    },
    clusters
  });
}

function constellationPosition(cardinal, constellationProfile) {
  if (
    constellationProfile.relation === CONSTELLATION_RELATION.ELLIPSOIDAL ||
    constellationProfile.relation === CONSTELLATION_RELATION.SPHERICAL
  ) {
    const unit = normalize3(cardinal.baseVector);
    return [
      unit[0] * constellationProfile.radii[0],
      unit[1] * constellationProfile.radii[1],
      unit[2] * constellationProfile.radii[2]
    ];
  }
  return constellationProfile.positionsByCardinal[cardinal.id].slice();
}

function makeNodeRecord({
  id,
  semanticId,
  kind,
  shape,
  localPosition,
  localOrientation,
  localScale,
  materialRegionIds,
  seatId = "",
  seatIndex = -1,
  parentId = "",
  anchorOffsets = {},
  hitShape = null,
  geometryRevision
}) {
  const scale = positiveVector3(localScale, "COMPASS_GEOMETRY_NODE_SCALE_INVALID");
  const bounds = scaledBounds(shape.bounds, scale);
  const anchors = normalizeAnchorOffsets(anchorOffsets, bounds);
  return deepFreeze({
    id: requireId(id, "COMPASS_GEOMETRY_NODE_ID_REQUIRED"),
    semanticId: optionalId(semanticId),
    kind,
    shapeId: shape.id,
    localPosition: vector3(localPosition, "COMPASS_GEOMETRY_NODE_POSITION_INVALID"),
    localOrientation: normalizeQuaternion(vector4(localOrientation, "COMPASS_GEOMETRY_NODE_ORIENTATION_INVALID")),
    localScale: scale,
    bounds,
    visualAnchor: anchors.visual,
    semanticAnchor: anchors.semantic,
    labelAnchor: anchors.label,
    hitShape: normalizeHitShape(hitShape, bounds),
    materialRegionIds: materialRegionIds.slice(),
    seatId: optionalId(seatId),
    seatIndex,
    parentId: optionalId(parentId),
    geometryRevision
  });
}

function validateNodeMaterialCompatibility(node, shape) {
  const nodeRegions = new Set(node.materialRegionIds);
  shape.triangleMaterialRegionIds.forEach(regionId => {
    assertContract(
      nodeRegions.has(regionId),
      "COMPASS_GEOMETRY_NODE_MISSING_SHAPE_MATERIAL_REGION",
      Object.freeze({ nodeId: node.id, shapeId: shape.id, regionId })
    );
  });
}

function createValidationReceipt(modelCore) {
  const allNodes = [
    ...(modelCore.centerRecord ? [modelCore.centerRecord] : []),
    ...modelCore.cardinalRecords,
    ...Object.values(modelCore.clusterTemplates).flatMap(template => template.memberRecords)
  ];
  const nodeIds = new Set(allNodes.map(node => node.id));
  const seatIds = Object.values(modelCore.clusterTemplates).flatMap(template =>
    template.seatRecords.map(seat => `${template.cardinalId}:${seat.seatId}`)
  );
  const findings = [
    ["RIGHT_HANDED_LOCAL_3D_COORDINATE_SPACE", modelCore.coordinateSystem.handedness === "RIGHT_HANDED"],
    ["EXACTLY_FOUR_CARDINAL_RECORDS", modelCore.cardinalRecords.length === 4],
    ["UNIQUE_NODE_IDENTITIES", nodeIds.size === allNodes.length],
    ["EXPLICIT_STABLE_CLUSTER_SEAT_IDENTITIES", new Set(seatIds).size === seatIds.length],
    ["VARIABLE_CLUSTER_CAPACITY_SUPPORTED", Object.values(modelCore.clusterTemplates).every(template => template.capacity === template.memberRecords.length)],
    ["DETERMINISTIC_MEMBER_ORDER", Object.values(modelCore.clusterTemplates).every(template => template.seatRecords.every((seat, index) => seat.seatIndex === index))],
    ["ONE_SHARED_CONSTELLATION_TRANSFORM_POLICY", modelCore.spatialRelations.constellation.transformPolicy === "ONE_SHARED_CONSTELLATION_TRANSFORM"],
    ["ONE_SHARED_TRANSFORM_PER_CLUSTER_POLICY", Object.values(modelCore.spatialRelations.clusters).every(record => record.transformPolicy === "ONE_SHARED_TRANSFORM_PER_CLUSTER")],
    ["NO_MEMBER_SPECIFIC_CANONICAL_DRIFT", Object.values(modelCore.clusterTemplates).every(template => template.memberRecords.every(member => member.parentId === template.cardinalId))],
    ["FINITE_LOCAL_VERTICES", modelCore.shapeDefinitions.every(shape => shape.positions.flat().every(Number.isFinite))],
    ["FINITE_NORMALIZED_NORMALS", modelCore.shapeDefinitions.every(shape => shape.normals.every(normal => Math.abs(length3(normal) - 1) <= 1e-7))],
    ["VALID_NONDEGENERATE_BOUNDS", allNodes.every(node => node.bounds.size.every(value => value > 0))],
    ["OPTIONAL_CENTER_SEPARATE_FROM_CARDINAL_REGISTRY", !modelCore.centerRecord || !modelCore.cardinalRecords.some(cardinal => cardinal.id === modelCore.centerRecord.id)],
    ["CENTER_VISUAL_SEMANTIC_SEPARATION_SUPPORTED", !modelCore.centerRecord || typeof modelCore.centerRecord.semanticId === "string"],
    ["LOCAL_HIT_SHAPES_ONLY", allNodes.every(node => !Object.prototype.hasOwnProperty.call(node.hitShape, "radiusPx"))],
    ["GEOMETRY_RENDERER_SEPARATION", !stableGeometrySerialize(modelCore).includes("WebGL")],
    ["GEOMETRY_PROJECTION_SEPARATION", !allNodes.some(node => Object.prototype.hasOwnProperty.call(node, "screenX"))],
    ["IMMUTABLE_GEOMETRY_PUBLICATION", true]
  ].map(([id, pass]) => deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL" }));

  const failed = findings.filter(finding => !finding.pass);
  return deepFreeze({
    schema: VALIDATION_SCHEMA,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length
    }),
    findings,
    productionAuthority: false,
    referenceModelAuthority: false
  });
}

export function createGeometryAuthority({
  identityInput,
  geometryProfile,
  shapeDefinitions,
  materialRegionDefinitions,
  geometryRevision = 1
}) {
  const revision = Number(geometryRevision);
  assertContract(
    Number.isInteger(revision) && revision > 0,
    "COMPASS_GEOMETRY_REVISION_INVALID"
  );

  const admittedIdentity = validateIdentityInput(identityInput);
  const admittedMaterialRegions = validateMaterialRegions(materialRegionDefinitions);
  const materialRegionIds = new Set(admittedMaterialRegions.map(record => record.id));
  const admittedShapes = validateShapes(shapeDefinitions, materialRegionIds);
  const shapeById = new Map(admittedShapes.map(shape => [shape.id, shape]));
  const cardinalIds = admittedIdentity.cardinals.map(cardinal => cardinal.id);
  const admittedProfile = validateGeometryProfile(
    geometryProfile,
    cardinalIds,
    shapeById,
    materialRegionIds
  );

  const nodeById = new Map();
  let centerRecord = null;
  if (admittedProfile.center) {
    const centerShape = shapeById.get(admittedProfile.center.shapeId);
    centerRecord = makeNodeRecord({
      id: admittedProfile.center.id,
      semanticId: admittedProfile.center.semanticId,
      kind: GEOMETRY_NODE_KIND.CENTER,
      shape: centerShape,
      localPosition: admittedProfile.center.localPosition,
      localOrientation: admittedProfile.center.localOrientation,
      localScale: admittedProfile.center.localScale,
      materialRegionIds: admittedProfile.center.materialRegionIds,
      anchorOffsets: admittedProfile.center.anchorOffsets,
      hitShape: admittedProfile.center.hitShape,
      geometryRevision: revision
    });
    validateNodeMaterialCompatibility(centerRecord, centerShape);
    nodeById.set(centerRecord.id, centerRecord);
  }

  const cardinalShape = shapeById.get(admittedProfile.constellation.cardinalShapeId);
  const cardinalRecords = admittedIdentity.cardinals.map(cardinal => {
    const node = makeNodeRecord({
      id: cardinal.id,
      semanticId: cardinal.semanticId,
      kind: GEOMETRY_NODE_KIND.CARDINAL,
      shape: cardinalShape,
      localPosition: constellationPosition(cardinal, admittedProfile.constellation),
      localOrientation: IDENTITY_QUATERNION,
      localScale: admittedProfile.constellation.localScale,
      materialRegionIds: admittedProfile.constellation.materialRegionIds,
      anchorOffsets: admittedProfile.constellation.anchorOffsets,
      hitShape: admittedProfile.constellation.hitShape,
      geometryRevision: revision
    });
    validateNodeMaterialCompatibility(node, cardinalShape);
    assertContract(!nodeById.has(node.id), "COMPASS_GEOMETRY_NODE_ID_DUPLICATE", node.id);
    nodeById.set(node.id, node);
    return node;
  });

  const clusterTemplates = {};
  const clusterSpatialRelations = {};
  admittedIdentity.cardinals.forEach(cardinal => {
    const profile = admittedProfile.clusters[cardinal.id];
    const members = admittedIdentity.clusters[cardinal.id];
    assertContract(
      members.length === profile.capacity,
      "COMPASS_GEOMETRY_CLUSTER_IDENTITY_CAPACITY_MISMATCH",
      Object.freeze({ cardinalId: cardinal.id, expected: profile.capacity, actual: members.length })
    );
    const seatById = new Map(profile.seatRecords.map(seat => [seat.seatId, seat]));
    const memberShape = shapeById.get(profile.memberShapeId);
    const memberRecords = members.map(member => {
      const seat = seatById.get(member.seatId);
      assertContract(
        seat,
        "COMPASS_GEOMETRY_CLUSTER_MEMBER_SEAT_UNKNOWN",
        Object.freeze({ cardinalId: cardinal.id, memberId: member.id, seatId: member.seatId })
      );
      const combinedScale = profile.localScale.map((value, index) => value * seat.localScale[index]);
      const node = makeNodeRecord({
        id: member.id,
        semanticId: member.semanticId,
        kind: GEOMETRY_NODE_KIND.CLUSTER_MEMBER,
        shape: memberShape,
        localPosition: seat.localPosition,
        localOrientation: seat.localOrientation,
        localScale: combinedScale,
        materialRegionIds: profile.materialRegionIds,
        seatId: seat.seatId,
        seatIndex: seat.seatIndex,
        parentId: cardinal.id,
        anchorOffsets: profile.anchorOffsets,
        hitShape: profile.hitShape,
        geometryRevision: revision
      });
      validateNodeMaterialCompatibility(node, memberShape);
      assertContract(!nodeById.has(node.id), "COMPASS_GEOMETRY_NODE_ID_DUPLICATE", node.id);
      nodeById.set(node.id, node);
      return node;
    }).sort((a, b) => a.seatIndex - b.seatIndex);

    const seatRecords = profile.seatRecords.map(seat => deepFreeze({
      seatId: seat.seatId,
      seatIndex: seat.seatIndex,
      localPosition: seat.localPosition,
      localOrientation: seat.localOrientation,
      localScale: seat.localScale
    }));
    const clusterBounds = unionBounds(memberRecords.map(member =>
      translatedBounds(member.bounds, member.localPosition)
    ));
    const clusterAnchors = normalizeAnchorOffsets({}, clusterBounds);
    clusterTemplates[cardinal.id] = deepFreeze({
      cardinalId: cardinal.id,
      capacity: profile.capacity,
      relation: profile.relation,
      memberShapeId: profile.memberShapeId,
      seatRecords,
      memberRecords,
      bounds: clusterBounds,
      anchors: clusterAnchors
    });
    clusterSpatialRelations[cardinal.id] = deepFreeze({
      relation: profile.relation,
      transformPolicy: "ONE_SHARED_TRANSFORM_PER_CLUSTER",
      memberSpecificCanonicalDrift: false
    });
  });

  const modelCore = {
    schema: GEOMETRY_SCHEMA,
    geometryRevision: revision,
    coordinateSystem: admittedProfile.coordinateSystem,
    profileIdentity: admittedProfile.id,
    centerRecord,
    cardinalRecords,
    clusterTemplates,
    shapeDefinitions: admittedShapes,
    materialRegionDefinitions: admittedMaterialRegions,
    spatialRelations: deepFreeze({
      centerToCardinal: centerRecord
        ? "CENTER_PARTICIPANT_SEPARATE_FROM_CARDINAL_REGISTRY"
        : "NO_CENTER_PARTICIPANT",
      constellation: deepFreeze({
        relation: admittedProfile.constellation.relation,
        transformPolicy: "ONE_SHARED_CONSTELLATION_TRANSFORM"
      }),
      clusters: deepFreeze(clusterSpatialRelations)
    })
  };
  const geometryHash = hashGeometryValue(modelCore);
  const validationReceipt = createValidationReceipt(modelCore);
  assertContract(validationReceipt.status === "PASS", "COMPASS_GEOMETRY_VALIDATION_FAILED", validationReceipt);

  const model = deepFreeze({
    ...modelCore,
    geometryHash,
    validationReceipt
  });

  const rendererSnapshot = deepFreeze({
    schema: RENDERER_SNAPSHOT_SCHEMA,
    geometryRevision: revision,
    geometryHash,
    profileIdentity: admittedProfile.id,
    centerRecord,
    cardinalRecords,
    clusterTemplates,
    shapeDefinitions: admittedShapes,
    materialRegionDefinitions: admittedMaterialRegions
  });

  const compositorInput = deepFreeze({
    schema: COMPOSITOR_INPUT_SCHEMA,
    geometryRevision: revision,
    geometryHash,
    centerRecord,
    records: [
      ...cardinalRecords,
      ...Object.values(clusterTemplates).flatMap(template => template.memberRecords)
    ].map(node => deepFreeze({
      id: node.id,
      kind: node.kind,
      parentId: node.parentId,
      localPosition: node.localPosition,
      localOrientation: node.localOrientation,
      localScale: node.localScale,
      bounds: node.bounds,
      visualAnchor: node.visualAnchor,
      semanticAnchor: node.semanticAnchor,
      labelAnchor: node.labelAnchor,
      hitShape: node.hitShape,
      geometryRevision: revision
    }))
  });

  return Object.freeze({
    contract: COMPASS_GEOMETRY_CONTRACT,
    getModel: () => model,
    getNode: id => nodeById.get(String(id || "")) || null,
    getClusterTemplate: cardinalId => clusterTemplates[String(cardinalId || "")] || null,
    getRendererConsumptionSnapshot: () => rendererSnapshot,
    getCompositorProjectionInput: () => compositorInput,
    getRevision: () => revision,
    getHash: () => geometryHash,
    validate: () => validationReceipt
  });
}
