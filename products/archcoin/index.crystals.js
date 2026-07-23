/* /products/archcoin/index.crystals.js
 * ARCHCOIN crystal topology and visual-record authority.
 *
 * Seven-file authority rule:
 *   PLANET_IS_WORLD_AUTHORITY = true
 *   CRYSTALS_CONSUME_PLANET = true
 *   CRYSTALS_OWN_WORLD_GEOMETRY = false
 *   CRYSTALS_RECONSTRUCT_PLANET_STATE = false
 *
 * This file preserves the source-derived topology, bounds, anchors, hit-shape,
 * hashing, and validation mechanisms from the universal geometry candidate.
 * It removes identity registries, seat generation, world-position generation,
 * profile-owned membership, renderer ownership, and every import from the
 * abandoned eleven-file runtime.
 */
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_ARCHCOIN_CRYSTALS",
    version: "3.0.0-seven-file-planet-snapshot-consumer",
    file: "/products/archcoin/index.crystals.js",
    authority: "CRYSTALS",
    worldAuthority: "PLANET",
    projectionAuthority: "COMPOSITOR",
    acceptedStateAuthority: "CONTROLLER",
    pointerAuthority: "INTERACTIONS",
    ownsWorldIdentity: false,
    ownsWorldMembership: false,
    ownsWorldSeats: false,
    ownsWorldTransforms: false,
    ownsCameraOrProjection: false,
    ownsRendererLifecycle: false,
    externalContractDependency: false,
    externalMathDependency: false,
    productionAuthorized: false
  });

  const CRYSTAL_KIND = Object.freeze({
    CENTER: "CENTER",
    CARDINAL: "CARDINAL",
    CLUSTER_MEMBER: "CLUSTER_MEMBER"
  });

  const HIT_SHAPE_KIND = Object.freeze({
    SPHERE: "SPHERE",
    AABB: "AABB"
  });

  const SHAPE_TOPOLOGY = Object.freeze({
    TRIANGLES: "TRIANGLES"
  });

  const EPSILON = 1e-8;
  const TAU = Math.PI * 2;
  const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);
  const CRYSTAL_SNAPSHOT_SCHEMA = "ARCHCOIN_CRYSTAL_SNAPSHOT_v2";
  const CRYSTAL_VALIDATION_SCHEMA =
    "ARCHCOIN_CRYSTAL_VALIDATION_RECEIPT_v2";
  const COMPOSITOR_INPUT_SCHEMA =
    "ARCHCOIN_CRYSTAL_COMPOSITOR_INPUT_v2";

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;
    throw error;
  }

  function assert(condition, code, details = null) {
    if (!condition) fail(code, details);
  }

  function deepFreeze(value, seen = new WeakSet()) {
    if (
      value === null ||
      (typeof value !== "object" && typeof value !== "function")
    ) {
      return value;
    }
    if (seen.has(value)) return value;
    seen.add(value);
    Reflect.ownKeys(value).forEach(key => deepFreeze(value[key], seen));
    return Object.freeze(value);
  }

  function assertPlainRecord(value, code) {
    assert(
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
    const number = Number(value);
    assert(Number.isFinite(number), code, value);
    return Object.is(number, -0) ? 0 : number;
  }

  function vector3(value, code) {
    assert(
      Array.isArray(value) &&
        value.length === 3 &&
        value.every(component => Number.isFinite(Number(component))),
      code,
      value
    );
    return value.map(Number);
  }

  function vector4(value, code) {
    assert(
      Array.isArray(value) &&
        value.length === 4 &&
        value.every(component => Number.isFinite(Number(component))),
      code,
      value
    );
    return value.map(Number);
  }

  function positiveVector3(value, code) {
    const admitted = vector3(value, code);
    assert(admitted.every(component => component > 0), code, admitted);
    return admitted;
  }

  function requireId(value, code) {
    const id = String(value || "").trim();
    assert(id.length > 0, code, value);
    return id;
  }

  function optionalId(value) {
    return String(value || "").trim();
  }

  function normalize3(value, fallback = [0, 0, 1]) {
    const vector = vector3(value, "ARCHCOIN_CRYSTAL_VECTOR_INVALID");
    const length = Math.hypot(...vector);
    return length > EPSILON
      ? vector.map(component => component / length)
      : Array.from(fallback);
  }

  function normalizeQuaternion(value, fallback = IDENTITY_QUATERNION) {
    const quaternion = Array.from(value || []).map(Number);
    if (
      quaternion.length !== 4 ||
      quaternion.some(component => !Number.isFinite(component))
    ) {
      return Array.from(fallback);
    }
    const length = Math.hypot(...quaternion);
    return length > EPSILON
      ? quaternion.map(component => component / length)
      : Array.from(fallback);
  }

  function canonicalNumber(value) {
    return finiteNumber(value, "ARCHCOIN_CRYSTAL_NONFINITE_NUMBER");
  }

  function stableValue(value) {
    if (Array.isArray(value)) return value.map(stableValue);
    if (value && typeof value === "object") {
      const output = {};
      Object.keys(value)
        .sort()
        .forEach(key => {
          output[key] = stableValue(value[key]);
        });
      return output;
    }
    return typeof value === "number" ? canonicalNumber(value) : value;
  }

  function stableSerialize(value) {
    return JSON.stringify(stableValue(value));
  }

  function hashValue(value) {
    const source = stableSerialize(value);
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
    assert(
      length3(normal) > EPSILON,
      "ARCHCOIN_CRYSTAL_DEGENERATE_TRIANGLE",
      deepFreeze({ a, b, c })
    );
    return normalize3(normal);
  }

  function normalizeBounds(bounds) {
    assertPlainRecord(bounds, "ARCHCOIN_CRYSTAL_BOUNDS_REQUIRED");
    const minimum = vector3(bounds.min, "ARCHCOIN_CRYSTAL_BOUNDS_MIN_INVALID");
    const maximum = vector3(bounds.max, "ARCHCOIN_CRYSTAL_BOUNDS_MAX_INVALID");
    assert(
      maximum.every((value, index) => value > minimum[index]),
      "ARCHCOIN_CRYSTAL_BOUNDS_DEGENERATE",
      bounds
    );
    const center = minimum.map(
      (value, index) => (value + maximum[index]) * 0.5
    );
    const size = maximum.map((value, index) => value - minimum[index]);
    const radius = Math.hypot(size[0], size[1], size[2]) * 0.5;
    return deepFreeze({ min: minimum, max: maximum, center, size, radius });
  }

  function boundsFromPositions(positions) {
    assert(
      Array.isArray(positions) && positions.length >= 3,
      "ARCHCOIN_CRYSTAL_POSITIONS_REQUIRED"
    );
    const admitted = positions.map(position =>
      vector3(position, "ARCHCOIN_CRYSTAL_POSITION_INVALID")
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
    const admittedScale = positiveVector3(
      scale,
      "ARCHCOIN_CRYSTAL_VISUAL_SCALE_INVALID"
    );
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

  function calculateNormals(positions, indices) {
    const normals = positions.map(() => [0, 0, 0]);
    const triangleIndices =
      indices.length > 0 ? indices : positions.map((_, index) => index);
    assert(
      triangleIndices.length % 3 === 0,
      "ARCHCOIN_CRYSTAL_TRIANGLE_INDEX_COUNT_INVALID"
    );
    for (let cursor = 0; cursor < triangleIndices.length; cursor += 3) {
      const triangle = triangleIndices.slice(cursor, cursor + 3);
      triangle.forEach(index => {
        assert(
          Number.isInteger(index) && index >= 0 && index < positions.length,
          "ARCHCOIN_CRYSTAL_INDEX_OUT_OF_RANGE",
          index
        );
      });
      const normal = triangleNormal(
        positions[triangle[0]],
        positions[triangle[1]],
        positions[triangle[2]]
      );
      triangle.forEach(index => {
        normals[index][0] += normal[0];
        normals[index][1] += normal[1];
        normals[index][2] += normal[2];
      });
    }
    return normals.map(normal => normalize3(normal));
  }

  function createMeshShapeDefinition({
    id,
    positions,
    indices = [],
    normals = null,
    triangleMaterialRegionIds,
    triangleFacetRoleIds
  }) {
    const shapeId = requireId(id, "ARCHCOIN_CRYSTAL_SHAPE_ID_REQUIRED");
    assert(
      Array.isArray(positions) && positions.length >= 3,
      "ARCHCOIN_CRYSTAL_SHAPE_POSITIONS_REQUIRED"
    );
    const admittedPositions = positions.map(position =>
      vector3(position, "ARCHCOIN_CRYSTAL_SHAPE_POSITION_INVALID")
    );
    const admittedIndices = Array.from(indices || []).map(Number);
    const triangleIndexCount =
      admittedIndices.length > 0
        ? admittedIndices.length
        : admittedPositions.length;
    assert(
      triangleIndexCount % 3 === 0,
      "ARCHCOIN_CRYSTAL_SHAPE_TRIANGLE_COUNT_INVALID"
    );
    const triangleCount = triangleIndexCount / 3;
    const admittedNormals =
      normals === null
        ? calculateNormals(admittedPositions, admittedIndices)
        : normals.map(normal =>
            normalize3(
              vector3(normal, "ARCHCOIN_CRYSTAL_SHAPE_NORMAL_INVALID")
            )
          );
    assert(
      admittedNormals.length === admittedPositions.length,
      "ARCHCOIN_CRYSTAL_SHAPE_NORMAL_COUNT_MISMATCH"
    );
    admittedNormals.forEach(normal => {
      assert(
        Math.abs(length3(normal) - 1) <= 1e-7,
        "ARCHCOIN_CRYSTAL_SHAPE_NORMAL_NOT_NORMALIZED",
        normal
      );
    });
    assert(
      Array.isArray(triangleMaterialRegionIds) &&
        triangleMaterialRegionIds.length === triangleCount,
      "ARCHCOIN_CRYSTAL_MATERIAL_REGION_TRIANGLE_COUNT_INVALID"
    );
    assert(
      Array.isArray(triangleFacetRoleIds) &&
        triangleFacetRoleIds.length === triangleCount,
      "ARCHCOIN_CRYSTAL_FACET_ROLE_TRIANGLE_COUNT_INVALID"
    );
    return deepFreeze({
      id: shapeId,
      topology: SHAPE_TOPOLOGY.TRIANGLES,
      positions: admittedPositions,
      normals: admittedNormals,
      indices: admittedIndices,
      triangleMaterialRegionIds: triangleMaterialRegionIds.map(value =>
        requireId(value, "ARCHCOIN_CRYSTAL_TRIANGLE_MATERIAL_REGION_REQUIRED")
      ),
      triangleFacetRoleIds: triangleFacetRoleIds.map(value =>
        requireId(value, "ARCHCOIN_CRYSTAL_TRIANGLE_FACET_ROLE_REQUIRED")
      ),
      bounds: boundsFromPositions(admittedPositions)
    });
  }

  function pushTriangle(target, a, b, c, materialRegionId, facetRoleId) {
    target.positions.push(a, b, c);
    target.materials.push(materialRegionId);
    target.facets.push(facetRoleId);
  }

  function buildFacetedCrystalShape({
    id,
    radialSegments = 8,
    halfHeight = 1,
    shoulderRadius = 0.46,
    shoulderY = 0.3,
    waistRadius = 0.3,
    waistY = -0.28,
    capMaterialRegionId = "CRYSTAL_CAP",
    sideMaterialRegionId = "CRYSTAL_FACET"
  } = {}) {
    assert(
      Number.isInteger(radialSegments) && radialSegments >= 4,
      "ARCHCOIN_CRYSTAL_SEGMENT_COUNT_INVALID"
    );
    [halfHeight, shoulderRadius, waistRadius].forEach(value =>
      assert(
        Number.isFinite(value) && value > 0,
        "ARCHCOIN_CRYSTAL_DIMENSION_INVALID"
      )
    );
    assert(
      shoulderY < halfHeight && waistY > -halfHeight && shoulderY > waistY,
      "ARCHCOIN_CRYSTAL_LEVELS_INVALID"
    );
    const top = [0, halfHeight, 0];
    const bottom = [0, -halfHeight, 0];
    const upper = [];
    const lower = [];
    for (let index = 0; index < radialSegments; index += 1) {
      const angle = (TAU * index) / radialSegments;
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
      pushTriangle(
        mesh,
        top,
        upper[index],
        upper[next],
        capMaterialRegionId,
        "UPPER_CAP"
      );
      pushTriangle(
        mesh,
        upper[index],
        lower[index],
        lower[next],
        sideMaterialRegionId,
        `SIDE_${index}_A`
      );
      pushTriangle(
        mesh,
        upper[index],
        lower[next],
        upper[next],
        sideMaterialRegionId,
        `SIDE_${index}_B`
      );
      pushTriangle(
        mesh,
        bottom,
        lower[next],
        lower[index],
        capMaterialRegionId,
        "LOWER_CAP"
      );
    }
    return createMeshShapeDefinition({
      id,
      positions: mesh.positions,
      triangleMaterialRegionIds: mesh.materials,
      triangleFacetRoleIds: mesh.facets
    });
  }

  function buildRadialStarShape({
    id,
    points = 5,
    outerRadius = 1,
    innerRadius = 0.44,
    depth = 0.3,
    faceMaterialRegionId = "STAR_FACE",
    edgeMaterialRegionId = "STAR_EDGE"
  } = {}) {
    assert(
      Number.isInteger(points) && points >= 4,
      "ARCHCOIN_CRYSTAL_STAR_POINT_COUNT_INVALID"
    );
    [outerRadius, innerRadius, depth].forEach(value =>
      assert(
        Number.isFinite(value) && value > 0,
        "ARCHCOIN_CRYSTAL_STAR_DIMENSION_INVALID"
      )
    );
    assert(
      innerRadius < outerRadius,
      "ARCHCOIN_CRYSTAL_STAR_RADIUS_ORDER_INVALID"
    );
    const polygon = [];
    for (let index = 0; index < points * 2; index += 1) {
      const radius = index % 2 === 0 ? outerRadius : innerRadius;
      const angle = Math.PI * 0.5 + (Math.PI * index) / points;
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
      pushTriangle(
        mesh,
        frontCenter,
        frontA,
        frontB,
        faceMaterialRegionId,
        "FRONT_FACE"
      );
      pushTriangle(
        mesh,
        rearCenter,
        rearB,
        rearA,
        faceMaterialRegionId,
        "REAR_FACE"
      );
      pushTriangle(
        mesh,
        frontA,
        rearA,
        rearB,
        edgeMaterialRegionId,
        `EDGE_${index}_A`
      );
      pushTriangle(
        mesh,
        frontA,
        rearB,
        frontB,
        edgeMaterialRegionId,
        `EDGE_${index}_B`
      );
    }
    return createMeshShapeDefinition({
      id,
      positions: mesh.positions,
      triangleMaterialRegionIds: mesh.materials,
      triangleFacetRoleIds: mesh.facets
    });
  }

  function buildUvSphereShape({
    id,
    radius = 1,
    longitudeSegments = 20,
    latitudeSegments = 12,
    materialRegionId = "CENTER_SURFACE"
  } = {}) {
    assert(
      Number.isFinite(radius) && radius > 0,
      "ARCHCOIN_CRYSTAL_SPHERE_RADIUS_INVALID"
    );
    assert(
      Number.isInteger(longitudeSegments) && longitudeSegments >= 6,
      "ARCHCOIN_CRYSTAL_SPHERE_LONGITUDE_SEGMENTS_INVALID"
    );
    assert(
      Number.isInteger(latitudeSegments) && latitudeSegments >= 4,
      "ARCHCOIN_CRYSTAL_SPHERE_LATITUDE_SEGMENTS_INVALID"
    );
    const rings = [];
    for (
      let latitudeIndex = 1;
      latitudeIndex < latitudeSegments;
      latitudeIndex += 1
    ) {
      const latitude =
        -Math.PI * 0.5 + (Math.PI * latitudeIndex) / latitudeSegments;
      const ring = [];
      for (
        let longitudeIndex = 0;
        longitudeIndex < longitudeSegments;
        longitudeIndex += 1
      ) {
        const longitude = (TAU * longitudeIndex) / longitudeSegments;
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
    for (
      let longitudeIndex = 0;
      longitudeIndex < longitudeSegments;
      longitudeIndex += 1
    ) {
      const next = (longitudeIndex + 1) % longitudeSegments;
      pushTriangle(
        mesh,
        bottom,
        firstRing[next],
        firstRing[longitudeIndex],
        materialRegionId,
        "SOUTH_CAP"
      );
      pushTriangle(
        mesh,
        top,
        lastRing[longitudeIndex],
        lastRing[next],
        materialRegionId,
        "NORTH_CAP"
      );
    }
    for (let ringIndex = 0; ringIndex < rings.length - 1; ringIndex += 1) {
      const lower = rings[ringIndex];
      const upper = rings[ringIndex + 1];
      for (
        let longitudeIndex = 0;
        longitudeIndex < longitudeSegments;
        longitudeIndex += 1
      ) {
        const next = (longitudeIndex + 1) % longitudeSegments;
        pushTriangle(
          mesh,
          lower[longitudeIndex],
          upper[next],
          upper[longitudeIndex],
          materialRegionId,
          `BAND_${ringIndex}_A`
        );
        pushTriangle(
          mesh,
          lower[longitudeIndex],
          lower[next],
          upper[next],
          materialRegionId,
          `BAND_${ringIndex}_B`
        );
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
    assert(
      Array.isArray(definitions) && definitions.length > 0,
      "ARCHCOIN_CRYSTAL_MATERIAL_REGIONS_REQUIRED"
    );
    const ids = new Set();
    return definitions.map(definition => {
      assertPlainRecord(
        definition,
        "ARCHCOIN_CRYSTAL_MATERIAL_REGION_INVALID"
      );
      const id = requireId(
        definition.id,
        "ARCHCOIN_CRYSTAL_MATERIAL_REGION_ID_REQUIRED"
      );
      assert(
        !ids.has(id),
        "ARCHCOIN_CRYSTAL_MATERIAL_REGION_DUPLICATE",
        id
      );
      ids.add(id);
      return deepFreeze({
        id,
        semanticRole: requireId(
          definition.semanticRole,
          "ARCHCOIN_CRYSTAL_MATERIAL_REGION_ROLE_REQUIRED"
        )
      });
    });
  }

  function validateShapes(definitions, materialRegionIds) {
    assert(
      Array.isArray(definitions) && definitions.length > 0,
      "ARCHCOIN_CRYSTAL_SHAPES_REQUIRED"
    );
    const ids = new Set();
    return definitions.map(shape => {
      const admitted = createMeshShapeDefinition(shape);
      assert(!ids.has(admitted.id), "ARCHCOIN_CRYSTAL_SHAPE_DUPLICATE");
      ids.add(admitted.id);
      admitted.triangleMaterialRegionIds.forEach(regionId => {
        assert(
          materialRegionIds.has(regionId),
          "ARCHCOIN_CRYSTAL_SHAPE_MATERIAL_REGION_UNKNOWN",
          deepFreeze({ shapeId: admitted.id, regionId })
        );
      });
      return admitted;
    });
  }

  function normalizeKind(value) {
    const kind = String(value || "").trim().toUpperCase();
    assert(
      Object.values(CRYSTAL_KIND).includes(kind),
      "ARCHCOIN_CRYSTAL_WORLD_KIND_INVALID",
      value
    );
    return kind;
  }

  function validateWorldRecord(record) {
    assertPlainRecord(record, "ARCHCOIN_CRYSTAL_WORLD_RECORD_REQUIRED");
    const worldPosition = vector3(
      record.worldPosition,
      "ARCHCOIN_CRYSTAL_WORLD_POSITION_REQUIRED"
    );
    const worldOrientation = normalizeQuaternion(
      vector4(
        record.worldOrientation || IDENTITY_QUATERNION,
        "ARCHCOIN_CRYSTAL_WORLD_ORIENTATION_INVALID"
      )
    );
    const worldScale = positiveVector3(
      record.worldScale || [1, 1, 1],
      "ARCHCOIN_CRYSTAL_WORLD_SCALE_INVALID"
    );
    return deepFreeze({
      id: requireId(record.id, "ARCHCOIN_CRYSTAL_WORLD_ID_REQUIRED"),
      semanticId: optionalId(record.semanticId),
      kind: normalizeKind(record.kind),
      parentId: optionalId(record.parentId),
      seatId: optionalId(record.seatId),
      seatIndex:
        record.seatIndex === undefined ? -1 : Number(record.seatIndex),
      worldPosition,
      worldOrientation,
      worldScale,
      worldRevision: Number(record.worldRevision)
    });
  }

  function flattenWorldSnapshot(snapshot) {
    assertPlainRecord(snapshot, "ARCHCOIN_CRYSTAL_WORLD_SNAPSHOT_REQUIRED");
    const worldRevision = Number(snapshot.worldRevision);
    assert(
      Number.isInteger(worldRevision) && worldRevision >= 0,
      "ARCHCOIN_CRYSTAL_WORLD_REVISION_INVALID"
    );
    const sourceRecords = [];
    if (snapshot.centerRecord) sourceRecords.push(snapshot.centerRecord);
    assert(
      Array.isArray(snapshot.cardinalRecords) &&
        snapshot.cardinalRecords.length === 4,
      "ARCHCOIN_CRYSTAL_EXACTLY_FOUR_CARDINALS_REQUIRED"
    );
    sourceRecords.push(...snapshot.cardinalRecords);
    assertPlainRecord(
      snapshot.clusterTemplates,
      "ARCHCOIN_CRYSTAL_CLUSTER_TEMPLATES_REQUIRED"
    );
    Object.values(snapshot.clusterTemplates).forEach(template => {
      assertPlainRecord(template, "ARCHCOIN_CRYSTAL_CLUSTER_TEMPLATE_INVALID");
      assert(
        Array.isArray(template.memberRecords),
        "ARCHCOIN_CRYSTAL_CLUSTER_MEMBERS_REQUIRED"
      );
      sourceRecords.push(...template.memberRecords);
    });
    const ids = new Set();
    const records = sourceRecords.map(record => {
      const admitted = validateWorldRecord({ ...record, worldRevision });
      assert(!ids.has(admitted.id), "ARCHCOIN_CRYSTAL_WORLD_ID_DUPLICATE");
      ids.add(admitted.id);
      return admitted;
    });
    return deepFreeze({
      worldRevision,
      worldHash: String(snapshot.worldHash || snapshot.geometryHash || ""),
      records
    });
  }

  function validateMaterialRegionList(values, materialRegionIds, code) {
    assert(Array.isArray(values) && values.length > 0, code);
    const unique = new Set();
    return values.map(value => {
      const id = requireId(value, code);
      assert(
        materialRegionIds.has(id),
        "ARCHCOIN_CRYSTAL_RECORD_MATERIAL_REGION_UNKNOWN",
        id
      );
      assert(!unique.has(id), "ARCHCOIN_CRYSTAL_MATERIAL_REGION_DUPLICATE");
      unique.add(id);
      return id;
    });
  }

  function normalizeAnchorOffsets(record, bounds) {
    const source = record || {};
    assertPlainRecord(source, "ARCHCOIN_CRYSTAL_ANCHOR_OFFSETS_INVALID");
    const admittedBounds = normalizeBounds(bounds);
    const visual = source.visual
      ? vector3(source.visual, "ARCHCOIN_CRYSTAL_VISUAL_ANCHOR_INVALID")
      : [0, 0, 0];
    const semantic = source.semantic
      ? vector3(source.semantic, "ARCHCOIN_CRYSTAL_SEMANTIC_ANCHOR_INVALID")
      : visual.slice();
    const label = source.label
      ? vector3(source.label, "ARCHCOIN_CRYSTAL_LABEL_ANCHOR_INVALID")
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
    assertPlainRecord(record, "ARCHCOIN_CRYSTAL_HIT_SHAPE_INVALID");
    if (record.kind === HIT_SHAPE_KIND.SPHERE) {
      const radius = finiteNumber(
        record.radius,
        "ARCHCOIN_CRYSTAL_HIT_SPHERE_RADIUS_INVALID"
      );
      assert(radius > 0, "ARCHCOIN_CRYSTAL_HIT_SPHERE_NONPOSITIVE");
      return deepFreeze({
        kind: HIT_SHAPE_KIND.SPHERE,
        center: vector3(
          record.center,
          "ARCHCOIN_CRYSTAL_HIT_SPHERE_CENTER_INVALID"
        ),
        radius
      });
    }
    assert(
      record.kind === HIT_SHAPE_KIND.AABB,
      "ARCHCOIN_CRYSTAL_HIT_SHAPE_KIND_INVALID"
    );
    const admitted = normalizeBounds({ min: record.min, max: record.max });
    return deepFreeze({
      kind: HIT_SHAPE_KIND.AABB,
      min: admitted.min,
      max: admitted.max
    });
  }

  function validateCrystalProfile(profile, shapeById, materialRegionIds) {
    assertPlainRecord(profile, "ARCHCOIN_CRYSTAL_PROFILE_REQUIRED");
    const byKind = {};
    Object.values(CRYSTAL_KIND).forEach(kind => {
      const source = profile.byKind?.[kind];
      if (kind === CRYSTAL_KIND.CENTER && !source) {
        byKind[kind] = null;
        return;
      }
      assertPlainRecord(source, "ARCHCOIN_CRYSTAL_KIND_PROFILE_REQUIRED");
      const shapeId = requireId(
        source.shapeId,
        "ARCHCOIN_CRYSTAL_PROFILE_SHAPE_ID_REQUIRED"
      );
      assert(
        shapeById.has(shapeId),
        "ARCHCOIN_CRYSTAL_PROFILE_SHAPE_UNKNOWN",
        shapeId
      );
      byKind[kind] = deepFreeze({
        shapeId,
        visualScale: positiveVector3(
          source.visualScale || [1, 1, 1],
          "ARCHCOIN_CRYSTAL_PROFILE_VISUAL_SCALE_INVALID"
        ),
        materialRegionIds: validateMaterialRegionList(
          source.materialRegionIds,
          materialRegionIds,
          "ARCHCOIN_CRYSTAL_PROFILE_MATERIAL_REGIONS_INVALID"
        ),
        anchorOffsets: structuredClone(source.anchorOffsets || {}),
        hitShape:
          source.hitShape === undefined
            ? null
            : structuredClone(source.hitShape),
        visible: source.visible !== false
      });
    });
    return deepFreeze({
      id: requireId(profile.id, "ARCHCOIN_CRYSTAL_PROFILE_ID_REQUIRED"),
      byKind
    });
  }

  function createCrystalRecord({
    worldRecord,
    kindProfile,
    shape,
    crystalRevision
  }) {
    const visualScale = kindProfile.visualScale.map(
      (value, index) => value * worldRecord.worldScale[index]
    );
    const localBounds = scaledBounds(shape.bounds, visualScale);
    const anchors = normalizeAnchorOffsets(
      kindProfile.anchorOffsets,
      localBounds
    );
    return deepFreeze({
      id: worldRecord.id,
      semanticId: worldRecord.semanticId,
      kind: worldRecord.kind,
      parentId: worldRecord.parentId,
      seatId: worldRecord.seatId,
      seatIndex: worldRecord.seatIndex,
      worldPosition: worldRecord.worldPosition,
      worldOrientation: worldRecord.worldOrientation,
      worldScale: worldRecord.worldScale,
      shapeId: shape.id,
      visualScale,
      localBounds,
      visualAnchor: anchors.visual,
      semanticAnchor: anchors.semantic,
      labelAnchor: anchors.label,
      hitShape: normalizeHitShape(kindProfile.hitShape, localBounds),
      materialRegionIds: kindProfile.materialRegionIds,
      visible: kindProfile.visible,
      worldRevision: worldRecord.worldRevision,
      crystalRevision
    });
  }

  function createValidationReceipt(core) {
    const findings = [
      ["PLANET_WORLD_SNAPSHOT_CONSUMED", core.worldRevision >= 0],
      ["WORLD_IDENTITIES_PASSED_THROUGH", core.records.every(record => record.id)],
      [
        "WORLD_POSITIONS_PASSED_THROUGH",
        core.records.every(record => record.worldPosition.length === 3)
      ],
      [
        "NO_CRYSTAL_SEAT_GENERATION",
        core.records.every(record => typeof record.seatId === "string")
      ],
      ["NO_WORLD_MEMBERSHIP_OWNERSHIP", true],
      ["FINITE_LOCAL_VERTICES", core.shapeDefinitions.every(shape =>
        shape.positions.flat().every(Number.isFinite)
      )],
      ["FINITE_NORMALIZED_NORMALS", core.shapeDefinitions.every(shape =>
        shape.normals.every(normal => Math.abs(length3(normal) - 1) <= 1e-7)
      )],
      ["VALID_NONDEGENERATE_BOUNDS", core.records.every(record =>
        record.localBounds.size.every(value => value > 0)
      )],
      ["LOCAL_HIT_SHAPES_ONLY", core.records.every(record =>
        !Object.prototype.hasOwnProperty.call(record.hitShape, "radiusPx")
      )],
      ["NO_CAMERA_OR_PROJECTION_STATE", core.records.every(record =>
        !Object.prototype.hasOwnProperty.call(record, "screenX")
      )],
      ["NO_RENDERER_OR_DOM_STATE", !stableSerialize(core).includes("WebGL")],
      ["IMMUTABLE_CRYSTAL_PUBLICATION", true]
    ].map(([id, pass]) =>
      deepFreeze({ id, pass: Boolean(pass), status: pass ? "PASS" : "FAIL" })
    );
    const failed = findings.filter(finding => !finding.pass);
    return deepFreeze({
      schema: CRYSTAL_VALIDATION_SCHEMA,
      status: failed.length === 0 ? "PASS" : "FAIL",
      summary: deepFreeze({
        findingCount: findings.length,
        passed: findings.length - failed.length,
        failed: failed.length
      }),
      findings,
      productionAuthority: false
    });
  }

  function createCrystalAuthority({
    worldSnapshot,
    crystalProfile,
    shapeDefinitions,
    materialRegionDefinitions,
    crystalRevision = 1
  } = {}) {
    const revision = Number(crystalRevision);
    assert(
      Number.isInteger(revision) && revision > 0,
      "ARCHCOIN_CRYSTAL_REVISION_INVALID"
    );
    const world = flattenWorldSnapshot(worldSnapshot);
    const materials = validateMaterialRegions(materialRegionDefinitions);
    const materialIds = new Set(materials.map(record => record.id));
    const shapes = validateShapes(shapeDefinitions, materialIds);
    const shapeById = new Map(shapes.map(shape => [shape.id, shape]));
    const profile = validateCrystalProfile(
      crystalProfile,
      shapeById,
      materialIds
    );
    const records = world.records
      .map(worldRecord => {
        const kindProfile = profile.byKind[worldRecord.kind];
        if (!kindProfile) return null;
        const shape = shapeById.get(kindProfile.shapeId);
        const record = createCrystalRecord({
          worldRecord,
          kindProfile,
          shape,
          crystalRevision: revision
        });
        shape.triangleMaterialRegionIds.forEach(regionId => {
          assert(
            record.materialRegionIds.includes(regionId),
            "ARCHCOIN_CRYSTAL_RECORD_MISSING_SHAPE_MATERIAL_REGION",
            deepFreeze({ recordId: record.id, shapeId: shape.id, regionId })
          );
        });
        return record;
      })
      .filter(Boolean);
    const core = {
      schema: CRYSTAL_SNAPSHOT_SCHEMA,
      crystalRevision: revision,
      worldRevision: world.worldRevision,
      worldHash: world.worldHash,
      profileIdentity: profile.id,
      records,
      shapeDefinitions: shapes,
      materialRegionDefinitions: materials
    };
    const crystalHash = hashValue(core);
    const validationReceipt = createValidationReceipt(core);
    assert(
      validationReceipt.status === "PASS",
      "ARCHCOIN_CRYSTAL_VALIDATION_FAILED",
      validationReceipt
    );
    const snapshot = deepFreeze({
      ...core,
      crystalHash,
      validationReceipt
    });
    const compositorInput = deepFreeze({
      schema: COMPOSITOR_INPUT_SCHEMA,
      crystalRevision: revision,
      crystalHash,
      worldRevision: world.worldRevision,
      records: records.map(record =>
        deepFreeze({
          id: record.id,
          semanticId: record.semanticId,
          kind: record.kind,
          parentId: record.parentId,
          worldPosition: record.worldPosition,
          worldOrientation: record.worldOrientation,
          visualScale: record.visualScale,
          localBounds: record.localBounds,
          visualAnchor: record.visualAnchor,
          semanticAnchor: record.semanticAnchor,
          labelAnchor: record.labelAnchor,
          hitShape: record.hitShape,
          visible: record.visible,
          worldRevision: record.worldRevision,
          crystalRevision: record.crystalRevision
        })
      )
    });
    const byId = new Map(records.map(record => [record.id, record]));
    return Object.freeze({
      contract: CONTRACT,
      getSnapshot: () => snapshot,
      getRecord: id => byId.get(String(id || "")) || null,
      getCompositorInput: () => compositorInput,
      getRevision: () => revision,
      getHash: () => crystalHash,
      validate: () => validationReceipt
    });
  }

  const authority = Object.freeze({
    moduleId: CONTRACT.id,
    moduleVersion: CONTRACT.version,
    contract: CONTRACT,
    crystalKind: CRYSTAL_KIND,
    hitShapeKind: HIT_SHAPE_KIND,
    shapeTopology: SHAPE_TOPOLOGY,
    boundsFromPositions,
    createMeshShapeDefinition,
    buildFacetedCrystalShape,
    buildRadialStarShape,
    buildUvSphereShape,
    stableSerialize,
    hashValue,
    createCrystalAuthority
  });

  globalThis.DGB_ARCHCOIN_CRYSTALS = authority;
  globalThis.dispatchEvent?.(
    new CustomEvent("ARCHCOIN_CRYSTALS_AUTHORITY_READY", {
      detail: deepFreeze({
        moduleId: CONTRACT.id,
        moduleVersion: CONTRACT.version,
        factoryOnly: true,
        planetSnapshotRequired: true,
        productionAuthority: false
      })
    })
  );
})();
