/*
 * Universal Compass crystal and visual-geometry authority.
 * Neutral seven-file compatibility implementation.
 *
 * Consumes immutable Planet world snapshots and publishes immutable visual
 * records for the Compositor. It does not create identities, membership,
 * parentage, world transforms, camera state, projections, pointer targets,
 * accepted controller state, renderer lifecycle, routes, products, or finance.
 */

export const UNIVERSAL_COMPASS_CRYSTALS_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_CRYSTALS_NEUTRAL_COMPATIBILITY_v1",
  namespace: "DGB_UNIVERSAL_COMPASS",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  authority: "VISUAL_GEOMETRY_INTERPRETATION",
  planetWorldAuthorityRequired: true,
  identityAuthority: false,
  membershipAuthority: false,
  worldTransformAuthority: false,
  projectionAuthority: false,
  rendererAuthority: false,
  controllerAuthority: false,
  interactionAuthority: false,
  navigationAuthority: false,
  productAuthority: false,
  productionAuthority: false,
  recordImmutability: "DEEP"
});

export const CRYSTAL_NODE_KIND = Object.freeze({
  CENTER: "CENTER",
  CARDINAL: "CARDINAL",
  CHILD: "CHILD"
});

export const HIT_SHAPE_KIND = Object.freeze({
  SPHERE: "SPHERE",
  AABB: "AABB"
});

export const SHAPE_TOPOLOGY = Object.freeze({
  TRIANGLES: "TRIANGLES"
});

const CRYSTAL_MODEL_SCHEMA = "UNIVERSAL_COMPASS_CRYSTAL_MODEL_v1";
const CRYSTAL_RECORD_SCHEMA = "UNIVERSAL_COMPASS_CRYSTAL_RECORD_v1";
const CRYSTAL_INPUT_SCHEMA = "UNIVERSAL_COMPASS_CRYSTAL_INPUT_v1";
const CRYSTAL_VALIDATION_SCHEMA =
  "UNIVERSAL_COMPASS_CRYSTAL_VALIDATION_RECEIPT_v1";
const WORLD_SNAPSHOT_SCHEMA_PREFIX = "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_";
const EPSILON = 1e-8;
const TAU = Math.PI * 2;

function assertContract(condition, code, details = null) {
  if (condition) return;
  const error = new Error(code);
  error.code = code;
  error.details = details;
  throw error;
}

function deepFreeze(value, seen = new WeakSet()) {
  if (
    value === null ||
    (typeof value !== "object" && typeof value !== "function") ||
    seen.has(value)
  ) {
    return value;
  }
  seen.add(value);
  for (const key of Reflect.ownKeys(value)) deepFreeze(value[key], seen);
  return Object.freeze(value);
}

function assertPlainRecord(value, code = "COMPASS_PLAIN_RECORD_REQUIRED") {
  assertContract(
    value !== null &&
      typeof value === "object" &&
      !Array.isArray(value) &&
      (Object.getPrototypeOf(value) === Object.prototype ||
        Object.getPrototypeOf(value) === null),
    code,
    value
  );
  return value;
}

function finiteNumber(value, code) {
  const admitted = Number(value);
  assertContract(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function vector3(value, code) {
  assertContract(Array.isArray(value) && value.length === 3, code, value);
  return value.map(component => finiteNumber(component, code));
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

function normalize3(value, fallback = [0, 0, 1]) {
  const vector = vector3(value, "COMPASS_CRYSTAL_VECTOR3_INVALID");
  const length = Math.hypot(...vector);
  if (!(length > EPSILON) || !Number.isFinite(length)) {
    return Array.from(fallback);
  }
  return vector.map(component => component / length);
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    const output = {};
    for (const key of Object.keys(value).sort()) output[key] = stableValue(value[key]);
    return output;
  }
  if (typeof value === "number") return finiteNumber(value, "COMPASS_CRYSTAL_NONFINITE_NUMBER");
  return value;
}

export function stableCrystalSerialize(value) {
  return JSON.stringify(stableValue(value));
}

export function hashCrystalValue(value) {
  const source = stableCrystalSerialize(value);
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
    "COMPASS_CRYSTAL_DEGENERATE_TRIANGLE",
    deepFreeze({ a, b, c })
  );
  return normalize3(normal, [0, 0, 1]);
}

function normalizeBounds(bounds) {
  assertPlainRecord(bounds, "COMPASS_CRYSTAL_BOUNDS_REQUIRED");
  const minimum = vector3(bounds.min, "COMPASS_CRYSTAL_BOUNDS_MIN_INVALID");
  const maximum = vector3(bounds.max, "COMPASS_CRYSTAL_BOUNDS_MAX_INVALID");
  assertContract(
    maximum.every((value, index) => value > minimum[index]),
    "COMPASS_CRYSTAL_BOUNDS_DEGENERATE",
    bounds
  );
  const center = minimum.map((value, index) => (value + maximum[index]) * 0.5);
  const size = maximum.map((value, index) => value - minimum[index]);
  const radius = Math.hypot(...size) * 0.5;
  return deepFreeze({ min: minimum, max: maximum, center, size, radius });
}

export function boundsFromPositions(positions) {
  assertContract(
    Array.isArray(positions) && positions.length >= 3,
    "COMPASS_CRYSTAL_POSITIONS_REQUIRED"
  );
  const admitted = positions.map(position =>
    vector3(position, "COMPASS_CRYSTAL_POSITION_INVALID")
  );
  const minimum = admitted[0].slice();
  const maximum = admitted[0].slice();
  for (const position of admitted.slice(1)) {
    for (let axis = 0; axis < 3; axis += 1) {
      minimum[axis] = Math.min(minimum[axis], position[axis]);
      maximum[axis] = Math.max(maximum[axis], position[axis]);
    }
  }
  for (let axis = 0; axis < 3; axis += 1) {
    if (maximum[axis] - minimum[axis] <= EPSILON) {
      minimum[axis] -= EPSILON;
      maximum[axis] += EPSILON;
    }
  }
  return normalizeBounds({ min: minimum, max: maximum });
}

function scaledBounds(bounds, scale) {
  const admittedBounds = normalizeBounds(bounds);
  const admittedScale = positiveVector3(
    scale,
    "COMPASS_CRYSTAL_VISUAL_SCALE_INVALID"
  );
  const candidates = [];
  for (const x of [admittedBounds.min[0], admittedBounds.max[0]]) {
    for (const y of [admittedBounds.min[1], admittedBounds.max[1]]) {
      for (const z of [admittedBounds.min[2], admittedBounds.max[2]]) {
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

function calculateNormals(positions, indices) {
  const normals = positions.map(() => [0, 0, 0]);
  const triangleIndices = indices.length > 0
    ? indices
    : positions.map((_, index) => index);
  assertContract(
    triangleIndices.length % 3 === 0,
    "COMPASS_CRYSTAL_TRIANGLE_INDEX_COUNT_INVALID"
  );
  for (let cursor = 0; cursor < triangleIndices.length; cursor += 3) {
    const ia = triangleIndices[cursor];
    const ib = triangleIndices[cursor + 1];
    const ic = triangleIndices[cursor + 2];
    for (const index of [ia, ib, ic]) {
      assertContract(
        Number.isInteger(index) && index >= 0 && index < positions.length,
        "COMPASS_CRYSTAL_INDEX_OUT_OF_RANGE",
        index
      );
    }
    const normal = triangleNormal(positions[ia], positions[ib], positions[ic]);
    for (const index of [ia, ib, ic]) {
      normals[index][0] += normal[0];
      normals[index][1] += normal[1];
      normals[index][2] += normal[2];
    }
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
  const shapeId = requireId(id, "COMPASS_CRYSTAL_SHAPE_ID_REQUIRED");
  assertContract(
    Array.isArray(positions) && positions.length >= 3,
    "COMPASS_CRYSTAL_SHAPE_POSITIONS_REQUIRED"
  );
  const admittedPositions = positions.map(position =>
    vector3(position, "COMPASS_CRYSTAL_SHAPE_POSITION_INVALID")
  );
  const admittedIndices = Array.from(indices || []).map(Number);
  const triangleIndexCount = admittedIndices.length > 0
    ? admittedIndices.length
    : admittedPositions.length;
  assertContract(
    triangleIndexCount % 3 === 0,
    "COMPASS_CRYSTAL_SHAPE_TRIANGLE_COUNT_INVALID"
  );
  const triangleCount = triangleIndexCount / 3;
  const admittedNormals = normals === null
    ? calculateNormals(admittedPositions, admittedIndices)
    : normals.map(normal => normalize3(
        vector3(normal, "COMPASS_CRYSTAL_SHAPE_NORMAL_INVALID"),
        [0, 0, 1]
      ));
  assertContract(
    admittedNormals.length === admittedPositions.length,
    "COMPASS_CRYSTAL_SHAPE_NORMAL_COUNT_MISMATCH"
  );
  for (const normal of admittedNormals) {
    assertContract(
      Math.abs(length3(normal) - 1) <= 1e-7,
      "COMPASS_CRYSTAL_SHAPE_NORMAL_NOT_NORMALIZED",
      normal
    );
  }
  assertContract(
    Array.isArray(triangleMaterialRegionIds) &&
      triangleMaterialRegionIds.length === triangleCount,
    "COMPASS_CRYSTAL_MATERIAL_REGION_TRIANGLE_COUNT_INVALID"
  );
  assertContract(
    Array.isArray(triangleFacetRoleIds) &&
      triangleFacetRoleIds.length === triangleCount,
    "COMPASS_CRYSTAL_FACET_ROLE_TRIANGLE_COUNT_INVALID"
  );
  return deepFreeze({
    id: shapeId,
    topology: SHAPE_TOPOLOGY.TRIANGLES,
    positions: admittedPositions,
    normals: admittedNormals,
    indices: admittedIndices,
    triangleMaterialRegionIds: triangleMaterialRegionIds.map(value =>
      requireId(value, "COMPASS_CRYSTAL_TRIANGLE_MATERIAL_REGION_REQUIRED")
    ),
    triangleFacetRoleIds: triangleFacetRoleIds.map(value =>
      requireId(value, "COMPASS_CRYSTAL_TRIANGLE_FACET_ROLE_REQUIRED")
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
    "COMPASS_CRYSTAL_SEGMENT_COUNT_INVALID"
  );
  for (const value of [halfHeight, shoulderRadius, waistRadius]) {
    assertContract(
      Number.isFinite(value) && value > 0,
      "COMPASS_CRYSTAL_DIMENSION_INVALID",
      value
    );
  }
  assertContract(
    shoulderY < halfHeight && waistY > -halfHeight && shoulderY > waistY,
    "COMPASS_CRYSTAL_LEVELS_INVALID"
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
    "COMPASS_CRYSTAL_STAR_POINT_COUNT_INVALID"
  );
  for (const value of [outerRadius, innerRadius, depth]) {
    assertContract(
      Number.isFinite(value) && value > 0,
      "COMPASS_CRYSTAL_STAR_DIMENSION_INVALID",
      value
    );
  }
  assertContract(
    innerRadius < outerRadius,
    "COMPASS_CRYSTAL_STAR_RADIUS_ORDER_INVALID"
  );
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
  assertContract(
    Number.isFinite(radius) && radius > 0,
    "COMPASS_CRYSTAL_SPHERE_RADIUS_INVALID"
  );
  assertContract(
    Number.isInteger(longitudeSegments) && longitudeSegments >= 6,
    "COMPASS_CRYSTAL_SPHERE_LONGITUDE_SEGMENTS_INVALID"
  );
  assertContract(
    Number.isInteger(latitudeSegments) && latitudeSegments >= 4,
    "COMPASS_CRYSTAL_SPHERE_LATITUDE_SEGMENTS_INVALID"
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

function validateMaterialRegions(definitions) {
  assertContract(
    Array.isArray(definitions) && definitions.length > 0,
    "COMPASS_CRYSTAL_MATERIAL_REGIONS_REQUIRED"
  );
  const ids = new Set();
  return definitions.map(definition => {
    assertPlainRecord(definition, "COMPASS_CRYSTAL_MATERIAL_REGION_INVALID");
    const id = requireId(definition.id, "COMPASS_CRYSTAL_MATERIAL_REGION_ID_REQUIRED");
    assertContract(!ids.has(id), "COMPASS_CRYSTAL_MATERIAL_REGION_DUPLICATE", id);
    ids.add(id);
    return deepFreeze({
      id,
      semanticRole: requireId(
        definition.semanticRole,
        "COMPASS_CRYSTAL_MATERIAL_REGION_ROLE_REQUIRED"
      )
    });
  });
}

function validateShapes(definitions, materialRegionIds) {
  assertContract(
    Array.isArray(definitions) && definitions.length > 0,
    "COMPASS_CRYSTAL_SHAPES_REQUIRED"
  );
  const ids = new Set();
  return definitions.map(definition => {
    assertPlainRecord(definition, "COMPASS_CRYSTAL_SHAPE_RECORD_INVALID");
    const admitted = createMeshShapeDefinition(definition);
    assertContract(!ids.has(admitted.id), "COMPASS_CRYSTAL_SHAPE_DUPLICATE", admitted.id);
    ids.add(admitted.id);
    for (const regionId of admitted.triangleMaterialRegionIds) {
      assertContract(
        materialRegionIds.has(regionId),
        "COMPASS_CRYSTAL_SHAPE_MATERIAL_REGION_UNKNOWN",
        deepFreeze({ shapeId: admitted.id, regionId })
      );
    }
    return admitted;
  });
}

function normalizeAnchorOffsets(record, bounds) {
  const admittedBounds = normalizeBounds(bounds);
  const source = record || {};
  assertPlainRecord(source, "COMPASS_CRYSTAL_ANCHOR_OFFSETS_INVALID");
  const visual = source.visual
    ? vector3(source.visual, "COMPASS_CRYSTAL_VISUAL_ANCHOR_INVALID")
    : [0, 0, 0];
  const semantic = source.semantic
    ? vector3(source.semantic, "COMPASS_CRYSTAL_SEMANTIC_ANCHOR_INVALID")
    : visual.slice();
  const label = source.label
    ? vector3(source.label, "COMPASS_CRYSTAL_LABEL_ANCHOR_INVALID")
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
  assertPlainRecord(record, "COMPASS_CRYSTAL_HIT_SHAPE_INVALID");
  if (record.kind === HIT_SHAPE_KIND.SPHERE) {
    const radius = finiteNumber(record.radius, "COMPASS_CRYSTAL_HIT_SPHERE_RADIUS_INVALID");
    assertContract(radius > 0, "COMPASS_CRYSTAL_HIT_SPHERE_RADIUS_NONPOSITIVE");
    return deepFreeze({
      kind: HIT_SHAPE_KIND.SPHERE,
      center: vector3(record.center, "COMPASS_CRYSTAL_HIT_SPHERE_CENTER_INVALID"),
      radius
    });
  }
  assertContract(
    record.kind === HIT_SHAPE_KIND.AABB,
    "COMPASS_CRYSTAL_HIT_SHAPE_KIND_INVALID",
    record.kind
  );
  const admitted = normalizeBounds({ min: record.min, max: record.max });
  return deepFreeze({ kind: HIT_SHAPE_KIND.AABB, min: admitted.min, max: admitted.max });
}

function validateMaterialRegionList(values, materialRegionIds, code) {
  assertContract(Array.isArray(values) && values.length > 0, code);
  const unique = new Set();
  return values.map(value => {
    const id = requireId(value, code);
    assertContract(
      materialRegionIds.has(id),
      "COMPASS_CRYSTAL_NODE_MATERIAL_REGION_UNKNOWN",
      id
    );
    assertContract(
      !unique.has(id),
      "COMPASS_CRYSTAL_NODE_MATERIAL_REGION_DUPLICATE",
      id
    );
    unique.add(id);
    return id;
  });
}

function validateVisualProfile(profile, shapeById, materialRegionIds) {
  assertPlainRecord(profile, "COMPASS_CRYSTAL_VISUAL_PROFILE_REQUIRED");
  const id = requireId(profile.id, "COMPASS_CRYSTAL_VISUAL_PROFILE_ID_REQUIRED");
  assertPlainRecord(profile.byKind, "COMPASS_CRYSTAL_VISUAL_PROFILE_BY_KIND_REQUIRED");
  const byKind = {};
  for (const kind of Object.values(CRYSTAL_NODE_KIND)) {
    const source = profile.byKind[kind];
    assertPlainRecord(source, `COMPASS_CRYSTAL_VISUAL_PROFILE_${kind}_REQUIRED`);
    const shapeId = requireId(
      source.shapeId,
      `COMPASS_CRYSTAL_VISUAL_PROFILE_${kind}_SHAPE_REQUIRED`
    );
    assertContract(
      shapeById.has(shapeId),
      `COMPASS_CRYSTAL_VISUAL_PROFILE_${kind}_SHAPE_UNKNOWN`,
      shapeId
    );
    byKind[kind] = deepFreeze({
      shapeId,
      visualScale: positiveVector3(
        source.visualScale || [1, 1, 1],
        `COMPASS_CRYSTAL_VISUAL_PROFILE_${kind}_SCALE_INVALID`
      ),
      materialRegionIds: validateMaterialRegionList(
        source.materialRegionIds,
        materialRegionIds,
        `COMPASS_CRYSTAL_VISUAL_PROFILE_${kind}_MATERIALS_INVALID`
      ),
      anchorOffsets: deepFreeze(structuredClone(source.anchorOffsets || {})),
      hitShape:
        source.hitShape === undefined
          ? null
          : deepFreeze(structuredClone(source.hitShape))
    });
  }
  return deepFreeze({ id, byKind });
}

function validateShapeMaterialCompatibility(record, shape) {
  const admittedRegions = new Set(record.materialRegionIds);
  for (const regionId of shape.triangleMaterialRegionIds) {
    assertContract(
      admittedRegions.has(regionId),
      "COMPASS_CRYSTAL_RECORD_MISSING_SHAPE_MATERIAL_REGION",
      deepFreeze({ recordId: record.id, shapeId: shape.id, regionId })
    );
  }
}

function validateWorldSnapshot(snapshot) {
  assertPlainRecord(snapshot, "COMPASS_CRYSTAL_WORLD_SNAPSHOT_REQUIRED");
  assertContract(
    typeof snapshot.schema === "string" &&
      snapshot.schema.startsWith(WORLD_SNAPSHOT_SCHEMA_PREFIX),
    "COMPASS_CRYSTAL_WORLD_SNAPSHOT_SCHEMA_INVALID",
    snapshot.schema
  );
  assertContract(
    Number.isInteger(snapshot.worldRevision) && snapshot.worldRevision >= 0,
    "COMPASS_CRYSTAL_WORLD_REVISION_INVALID",
    snapshot.worldRevision
  );
  assertContract(Array.isArray(snapshot.records), "COMPASS_CRYSTAL_WORLD_RECORDS_REQUIRED");
  const ids = new Set();
  const cardinals = [];
  const children = [];
  const centers = [];
  const records = snapshot.records.map(record => {
    assertPlainRecord(record, "COMPASS_CRYSTAL_WORLD_RECORD_INVALID");
    const id = requireId(record.id, "COMPASS_CRYSTAL_WORLD_RECORD_ID_REQUIRED");
    assertContract(!ids.has(id), "COMPASS_CRYSTAL_WORLD_RECORD_ID_DUPLICATE", id);
    ids.add(id);
    const kind = String(record.kind || "").toUpperCase();
    assertContract(
      Object.values(CRYSTAL_NODE_KIND).includes(kind),
      "COMPASS_CRYSTAL_WORLD_RECORD_KIND_INVALID",
      deepFreeze({ id, kind })
    );
    const admitted = deepFreeze({ id, kind, parentId: optionalId(record.parentId) });
    if (kind === CRYSTAL_NODE_KIND.CENTER) centers.push(admitted);
    if (kind === CRYSTAL_NODE_KIND.CARDINAL) cardinals.push(admitted);
    if (kind === CRYSTAL_NODE_KIND.CHILD) children.push(admitted);
    return admitted;
  });
  assertContract(
    centers.length === 1,
    "COMPASS_CRYSTAL_EXACTLY_ONE_CENTER_REQUIRED",
    centers.length
  );
  assertContract(
    cardinals.length === 4,
    "COMPASS_CRYSTAL_EXACTLY_FOUR_CARDINALS_REQUIRED",
    cardinals.length
  );
  assertContract(
    children.length === 16,
    "COMPASS_CRYSTAL_EXACTLY_SIXTEEN_CHILDREN_REQUIRED",
    children.length
  );
  const cardinalIds = new Set(cardinals.map(record => record.id));
  assertContract(
    centers[0].parentId === "",
    "COMPASS_CRYSTAL_CENTER_PARENT_PROHIBITED",
    centers[0]
  );
  assertContract(
    cardinals.every(record => record.parentId === ""),
    "COMPASS_CRYSTAL_CARDINAL_PARENT_PROHIBITED",
    cardinals
  );
  assertContract(
    children.every(record => cardinalIds.has(record.parentId)),
    "COMPASS_CRYSTAL_CHILD_PARENT_INVALID",
    children
  );
  const childCounts = new Map(cardinals.map(cardinal => [cardinal.id, 0]));
  for (const child of children) {
    childCounts.set(child.parentId, childCounts.get(child.parentId) + 1);
  }
  assertContract(
    Array.from(childCounts.values()).every(count => count === 4),
    "COMPASS_CRYSTAL_EXACTLY_FOUR_CHILDREN_PER_CARDINAL_REQUIRED",
    deepFreeze(Object.fromEntries(childCounts))
  );
  return deepFreeze({
    schema: snapshot.schema,
    worldRevision: snapshot.worldRevision,
    records
  });
}

function createCrystalRecord({
  worldRecord,
  visualDefinition,
  shape,
  crystalRevision
}) {
  const localBounds = scaledBounds(shape.bounds, visualDefinition.visualScale);
  const anchors = normalizeAnchorOffsets(visualDefinition.anchorOffsets, localBounds);
  const record = deepFreeze({
    schema: CRYSTAL_RECORD_SCHEMA,
    id: worldRecord.id,
    kind: worldRecord.kind,
    shapeId: shape.id,
    localBounds,
    visualAnchor: anchors.visual,
    semanticAnchor: anchors.semantic,
    labelAnchor: anchors.label,
    hitShape: normalizeHitShape(visualDefinition.hitShape, localBounds),
    materialRegionIds: visualDefinition.materialRegionIds.slice(),
    crystalRevision
  });
  validateShapeMaterialCompatibility(record, shape);
  return record;
}

function finding(id, pass, details = null) {
  return deepFreeze({
    id,
    pass: Boolean(pass),
    status: pass ? "PASS" : "FAIL",
    details
  });
}

function createValidationReceipt({
  worldRevision,
  crystalRevision,
  crystalHash,
  records,
  shapeDefinitions
}) {
  const ids = new Set(records.map(record => record.id));
  const kinds = records.reduce((counts, record) => {
    counts[record.kind] = (counts[record.kind] || 0) + 1;
    return counts;
  }, {});
  const findings = [
    finding("EXACT_RECORD_COUNT", records.length === 21, records.length),
    finding("UNIQUE_RECORD_IDENTITIES", ids.size === records.length, ids.size),
    finding("EXACT_ONE_CENTER", kinds.CENTER === 1, kinds.CENTER || 0),
    finding("EXACT_FOUR_CARDINALS", kinds.CARDINAL === 4, kinds.CARDINAL || 0),
    finding("EXACT_SIXTEEN_CHILDREN", kinds.CHILD === 16, kinds.CHILD || 0),
    finding(
      "FINITE_LOCAL_VERTICES",
      shapeDefinitions.every(shape => shape.positions.flat().every(Number.isFinite))
    ),
    finding(
      "FINITE_NORMALIZED_NORMALS",
      shapeDefinitions.every(shape =>
        shape.normals.every(normal => Math.abs(length3(normal) - 1) <= 1e-7)
      )
    ),
    finding(
      "VALID_NONDEGENERATE_LOCAL_BOUNDS",
      records.every(record => record.localBounds.size.every(value => value > 0))
    ),
    finding(
      "LOCAL_HIT_SHAPES_ONLY",
      records.every(record => !Object.prototype.hasOwnProperty.call(record.hitShape, "radiusPx"))
    ),
    finding(
      "NO_WORLD_TRANSFORM_FIELDS",
      records.every(record =>
        ![
          "parentId",
          "worldPosition",
          "worldOrientation",
          "worldScale",
          "localPosition",
          "localOrientation",
          "localScale"
        ].some(key => Object.prototype.hasOwnProperty.call(record, key))
      )
    ),
    finding(
      "NO_PROJECTION_FIELDS",
      records.every(record =>
        ![
          "screenX",
          "screenY",
          "radiusPx",
          "viewDepth",
          "visible",
          "depthLayer"
        ].some(key => Object.prototype.hasOwnProperty.call(record, key))
      )
    ),
    finding(
      "IMMUTABLE_PUBLICATION",
      Object.isFrozen(records) && records.every(Object.isFrozen)
    ),
    finding(
      "WORLD_REVISION_PRESERVED",
      Number.isInteger(worldRevision) && worldRevision >= 0,
      worldRevision
    ),
    finding(
      "CRYSTAL_REVISION_PRESERVED",
      Number.isInteger(crystalRevision) && crystalRevision > 0,
      crystalRevision
    ),
    finding(
      "DETERMINISTIC_HASH_PRESENT",
      typeof crystalHash === "string" && crystalHash.startsWith("fnv1a32:"),
      crystalHash
    )
  ];
  const failed = findings.filter(record => !record.pass);
  return deepFreeze({
    schema: CRYSTAL_VALIDATION_SCHEMA,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: deepFreeze({
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      recordCount: records.length
    }),
    worldRevision,
    crystalRevision,
    crystalHash,
    findings,
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  });
}

export function createCrystalAuthority({
  visualProfile,
  shapeDefinitions,
  materialRegionDefinitions,
  crystalRevision = 1
} = {}) {
  const revision = Number(crystalRevision);
  assertContract(
    Number.isInteger(revision) && revision > 0,
    "COMPASS_CRYSTAL_REVISION_INVALID",
    crystalRevision
  );
  const admittedMaterialRegions = validateMaterialRegions(materialRegionDefinitions);
  const materialRegionIds = new Set(admittedMaterialRegions.map(record => record.id));
  const admittedShapes = validateShapes(shapeDefinitions, materialRegionIds);
  const shapeById = new Map(admittedShapes.map(shape => [shape.id, shape]));
  const admittedVisualProfile = validateVisualProfile(
    visualProfile,
    shapeById,
    materialRegionIds
  );
  let crystalRecords = deepFreeze([]);
  let compositorInput = null;
  let crystalHash = hashCrystalValue({
    crystalRevision: revision,
    visualProfile: admittedVisualProfile,
    shapeDefinitions: admittedShapes,
    materialRegionDefinitions: admittedMaterialRegions
  });
  let validationReceipt = deepFreeze({
    schema: CRYSTAL_VALIDATION_SCHEMA,
    status: "READY_UNCONSUMED",
    summary: deepFreeze({
      findingCount: 0,
      passed: 0,
      failed: 0,
      recordCount: 0
    }),
    worldRevision: null,
    crystalRevision: revision,
    crystalHash,
    findings: deepFreeze([]),
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  });
  const model = deepFreeze({
    schema: CRYSTAL_MODEL_SCHEMA,
    crystalRevision: revision,
    visualProfile: admittedVisualProfile,
    shapeDefinitions: admittedShapes,
    materialRegionDefinitions: admittedMaterialRegions
  });

  function consumeWorldSnapshot(worldSnapshot) {
    const admittedWorld = validateWorldSnapshot(worldSnapshot);
    crystalRecords = deepFreeze(
      admittedWorld.records.map(worldRecord => {
        const visualDefinition = admittedVisualProfile.byKind[worldRecord.kind];
        const shape = shapeById.get(visualDefinition.shapeId);
        return createCrystalRecord({
          worldRecord,
          visualDefinition,
          shape,
          crystalRevision: revision
        });
      })
    );
    const hashBody = {
      worldRevision: admittedWorld.worldRevision,
      crystalRevision: revision,
      records: crystalRecords
    };
    crystalHash = hashCrystalValue(hashBody);
    compositorInput = deepFreeze({
      schema: CRYSTAL_INPUT_SCHEMA,
      worldRevision: admittedWorld.worldRevision,
      crystalRevision: revision,
      crystalHash,
      records: crystalRecords
    });
    validationReceipt = createValidationReceipt({
      worldRevision: admittedWorld.worldRevision,
      crystalRevision: revision,
      crystalHash,
      records: crystalRecords,
      shapeDefinitions: admittedShapes
    });
    assertContract(
      validationReceipt.status === "PASS",
      "COMPASS_CRYSTAL_VALIDATION_FAILED",
      validationReceipt
    );
    return crystalRecords;
  }

  return Object.freeze({
    contract: UNIVERSAL_COMPASS_CRYSTALS_CONTRACT,
    consumeWorldSnapshot,
    getModel: () => model,
    getCrystalRecords: () => crystalRecords,
    getCompositorInput: () => compositorInput,
    getShape: id => shapeById.get(String(id || "")) || null,
    getRevision: () => revision,
    getHash: () => crystalHash,
    validate: () => validationReceipt
  });
}
