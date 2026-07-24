/*
 * Universal Compass projection and camera authority.
 * Neutral seven-file compatibility implementation.
 *
 * Consumes immutable Planet world truth, Crystals local visual geometry, and
 * Controller presentation context. Publishes immutable projection facts only.
 * It owns no DOM, canvas, WebGL, renderer, pointer, target-selection,
 * controller-state, navigation, route, product, or production authority.
 */

export const UNIVERSAL_COMPASS_COMPOSITOR_CONTRACT = Object.freeze({
  id: "DGB_UNIVERSAL_COMPASS_COMPOSITOR_NEUTRAL_COMPATIBILITY_v1",
  namespace: "DGB_UNIVERSAL_COMPASS",
  schemaPrefix: "UNIVERSAL_COMPASS_",
  authority: "CAMERA_AND_PROJECTION_FACTS",
  worldAuthority: false,
  visualGeometryAuthority: false,
  controllerAuthority: false,
  interactionAuthority: false,
  targetSelectionAuthority: false,
  rendererAuthority: false,
  domAuthority: false,
  canvasAuthority: false,
  webglAuthority: false,
  cssMutationAuthority: false,
  navigationAuthority: false,
  productAuthority: false,
  productionAuthority: false,
  recordImmutability: "DEEP"
});

export const DEPTH_LAYER = Object.freeze({
  FRONT: "FRONT",
  CENTER: "CENTER",
  REAR: "REAR"
});

export const PRESENTATION = Object.freeze({
  CONSTELLATION: "CONSTELLATION",
  CLUSTER: "CLUSTER"
});

const PROJECTION_SNAPSHOT_SCHEMA =
  "UNIVERSAL_COMPASS_PROJECTION_SNAPSHOT_v1";
const PROJECTION_VALIDATION_SCHEMA =
  "UNIVERSAL_COMPASS_PROJECTION_VALIDATION_RECEIPT_v1";
const PROJECTED_RECORD_SCHEMA =
  "UNIVERSAL_COMPASS_PROJECTED_RECORD_v1";
const TOMBSTONE_SCHEMA =
  "UNIVERSAL_COMPASS_PROJECTION_TOMBSTONE_v1";
const CRYSTAL_INPUT_SCHEMA =
  "UNIVERSAL_COMPASS_CRYSTAL_INPUT_v1";
const PRESENTATION_CONTEXT_SCHEMA =
  "UNIVERSAL_COMPASS_PRESENTATION_CONTEXT_v1";
const WORLD_SNAPSHOT_SCHEMA_PREFIX =
  "UNIVERSAL_COMPASS_WORLD_SNAPSHOT_";
const EPSILON = 1e-8;
const IDENTITY_QUATERNION = Object.freeze([0, 0, 0, 1]);
const DEPTH_LAYER_ORDER = Object.freeze({
  FRONT: 0,
  CENTER: 1,
  REAR: 2
});

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

function assertPlainRecord(value, code) {
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

function assertExactKeys(record, expectedKeys, code) {
  assertPlainRecord(record, code);
  const actual = Object.keys(record).sort();
  const expected = Array.from(expectedKeys).sort();
  assertContract(
    actual.length === expected.length &&
      actual.every((key, index) => key === expected[index]),
    code,
    deepFreeze({ actual, expected })
  );
  return record;
}

function finiteNumber(value, code) {
  const admitted = Number(value);
  assertContract(Number.isFinite(admitted), code, value);
  return Object.is(admitted, -0) ? 0 : admitted;
}

function nonnegativeInteger(value, code) {
  assertContract(
    Number.isInteger(value) && value >= 0,
    code,
    value
  );
  return value;
}

function positiveInteger(value, code) {
  assertContract(
    Number.isInteger(value) && value > 0,
    code,
    value
  );
  return value;
}

function requireId(value, code) {
  const id = String(value ?? "").trim();
  assertContract(id.length > 0, code, value);
  return id;
}

function optionalId(value) {
  return String(value ?? "").trim();
}

function vector3(value, code) {
  assertContract(
    Array.isArray(value) && value.length === 3,
    code,
    value
  );
  return value.map(component => finiteNumber(component, code));
}

function positiveVector3(value, code) {
  const admitted = vector3(value, code);
  assertContract(
    admitted.every(component => component > 0),
    code,
    admitted
  );
  return admitted;
}

function quaternion(value, code) {
  assertContract(
    Array.isArray(value) && value.length === 4,
    code,
    value
  );
  const admitted = value.map(component => finiteNumber(component, code));
  const length = Math.hypot(...admitted);
  assertContract(length > EPSILON, code, value);
  return admitted.map(component => component / length);
}

function add3(a, b) {
  return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
}

function subtract3(a, b) {
  return [a[0] - b[0], a[1] - b[1], a[2] - b[2]];
}

function multiply3(a, b) {
  return [a[0] * b[0], a[1] * b[1], a[2] * b[2]];
}

function dot3(a, b) {
  return a[0] * b[0] + a[1] * b[1] + a[2] * b[2];
}

function cross3(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function normalize3(value, code) {
  const admitted = vector3(value, code);
  const length = Math.hypot(...admitted);
  assertContract(length > EPSILON, code, value);
  return admitted.map(component => component / length);
}

function lerp3(a, b, alpha) {
  return [
    a[0] + (b[0] - a[0]) * alpha,
    a[1] + (b[1] - a[1]) * alpha,
    a[2] + (b[2] - a[2]) * alpha
  ];
}

function quaternionConjugate(value) {
  return [-value[0], -value[1], -value[2], value[3]];
}

function quaternionMultiply(a, b) {
  return [
    a[3] * b[0] + a[0] * b[3] + a[1] * b[2] - a[2] * b[1],
    a[3] * b[1] - a[0] * b[2] + a[1] * b[3] + a[2] * b[0],
    a[3] * b[2] + a[0] * b[1] - a[1] * b[0] + a[2] * b[3],
    a[3] * b[3] - a[0] * b[0] - a[1] * b[1] - a[2] * b[2]
  ];
}

function rotateVectorByQuaternion(value, orientation) {
  const q = quaternion(orientation, "COMPASS_COMPOSITOR_QUATERNION_INVALID");
  const pure = [value[0], value[1], value[2], 0];
  const rotated = quaternionMultiply(
    quaternionMultiply(q, pure),
    quaternionConjugate(q)
  );
  return [rotated[0], rotated[1], rotated[2]];
}

function quaternionFromBasis(right, up, forward) {
  const m00 = right[0];
  const m01 = up[0];
  const m02 = forward[0];
  const m10 = right[1];
  const m11 = up[1];
  const m12 = forward[1];
  const m20 = right[2];
  const m21 = up[2];
  const m22 = forward[2];
  const trace = m00 + m11 + m22;
  let result;
  if (trace > 0) {
    const s = Math.sqrt(trace + 1) * 2;
    result = [
      (m21 - m12) / s,
      (m02 - m20) / s,
      (m10 - m01) / s,
      0.25 * s
    ];
  } else if (m00 > m11 && m00 > m22) {
    const s = Math.sqrt(1 + m00 - m11 - m22) * 2;
    result = [
      0.25 * s,
      (m01 + m10) / s,
      (m02 + m20) / s,
      (m21 - m12) / s
    ];
  } else if (m11 > m22) {
    const s = Math.sqrt(1 + m11 - m00 - m22) * 2;
    result = [
      (m01 + m10) / s,
      0.25 * s,
      (m12 + m21) / s,
      (m02 - m20) / s
    ];
  } else {
    const s = Math.sqrt(1 + m22 - m00 - m11) * 2;
    result = [
      (m02 + m20) / s,
      (m12 + m21) / s,
      0.25 * s,
      (m10 - m01) / s
    ];
  }
  return quaternion(result, "COMPASS_COMPOSITOR_CAMERA_ORIENTATION_INVALID");
}

function stableValue(value) {
  if (Array.isArray(value)) return value.map(stableValue);
  if (value && typeof value === "object") {
    const output = {};
    for (const key of Object.keys(value).sort()) {
      output[key] = stableValue(value[key]);
    }
    return output;
  }
  if (typeof value === "number") {
    return finiteNumber(value, "COMPASS_COMPOSITOR_NONFINITE_NUMBER");
  }
  return value;
}

function stableSerialize(value) {
  return JSON.stringify(stableValue(value));
}

function deterministicHash(value) {
  const source = stableSerialize(value);
  let hash = 0x811c9dc5;
  for (let index = 0; index < source.length; index += 1) {
    hash ^= source.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193) >>> 0;
  }
  return `fnv1a32:${hash.toString(16).padStart(8, "0")}`;
}

function matrixMultiply4(a, b) {
  assertContract(
    Array.isArray(a) && a.length === 16 &&
      Array.isArray(b) && b.length === 16,
    "COMPASS_COMPOSITOR_MATRIX4_REQUIRED"
  );
  const output = new Array(16).fill(0);
  for (let row = 0; row < 4; row += 1) {
    for (let column = 0; column < 4; column += 1) {
      let sum = 0;
      for (let cursor = 0; cursor < 4; cursor += 1) {
        sum += a[row * 4 + cursor] * b[cursor * 4 + column];
      }
      output[row * 4 + column] = sum;
    }
  }
  return output;
}

function allFinite(values) {
  return Array.isArray(values) && values.every(Number.isFinite);
}

function clamp(value, minimum, maximum) {
  return Math.min(maximum, Math.max(minimum, value));
}

function normalizeCameraRecord(source, previous = null) {
  assertPlainRecord(source, "COMPASS_COMPOSITOR_CAMERA_REQUIRED");
  const position = vector3(
    source.position ?? previous?.position,
    "COMPASS_COMPOSITOR_CAMERA_POSITION_INVALID"
  );

  const suppliedOrientation = source.orientation === undefined
    ? previous?.orientation ?? null
    : quaternion(
        source.orientation,
        "COMPASS_COMPOSITOR_CAMERA_ORIENTATION_INVALID"
      );

  let target;
  let requestedUp;
  if (source.target !== undefined || (!suppliedOrientation && previous?.target)) {
    target = vector3(
      source.target ?? previous?.target,
      "COMPASS_COMPOSITOR_CAMERA_TARGET_INVALID"
    );
    requestedUp = vector3(
      source.up ?? previous?.up ?? [0, 1, 0],
      "COMPASS_COMPOSITOR_CAMERA_UP_INVALID"
    );
  } else {
    assertContract(
      suppliedOrientation !== null,
      "COMPASS_COMPOSITOR_CAMERA_TARGET_OR_ORIENTATION_REQUIRED"
    );
    const forward = rotateVectorByQuaternion([0, 0, 1], suppliedOrientation);
    target = add3(position, forward);
    requestedUp = rotateVectorByQuaternion([0, 1, 0], suppliedOrientation);
  }

  const forward = normalize3(
    subtract3(target, position),
    "COMPASS_COMPOSITOR_CAMERA_DIRECTION_INVALID"
  );
  let right = cross3(requestedUp, forward);
  if (Math.hypot(...right) <= EPSILON) {
    right = cross3([0, 0, 1], forward);
  }
  if (Math.hypot(...right) <= EPSILON) {
    right = cross3([1, 0, 0], forward);
  }
  right = normalize3(right, "COMPASS_COMPOSITOR_CAMERA_RIGHT_INVALID");
  const up = normalize3(
    cross3(forward, right),
    "COMPASS_COMPOSITOR_CAMERA_BASIS_UP_INVALID"
  );
  const orientation = quaternionFromBasis(right, up, forward);

  const fieldOfViewYRadians = source.fieldOfViewYRadians !== undefined
    ? finiteNumber(
        source.fieldOfViewYRadians,
        "COMPASS_COMPOSITOR_CAMERA_FOV_INVALID"
      )
    : source.fieldOfViewYDegrees !== undefined
      ? finiteNumber(
          source.fieldOfViewYDegrees,
          "COMPASS_COMPOSITOR_CAMERA_FOV_INVALID"
        ) * Math.PI / 180
      : previous?.fieldOfViewYRadians ??
        45 * Math.PI / 180;

  assertContract(
    fieldOfViewYRadians > 0 && fieldOfViewYRadians < Math.PI,
    "COMPASS_COMPOSITOR_CAMERA_FOV_OUT_OF_RANGE",
    fieldOfViewYRadians
  );

  const near = finiteNumber(
    source.near ?? previous?.near ?? 0.1,
    "COMPASS_COMPOSITOR_CAMERA_NEAR_INVALID"
  );
  const far = finiteNumber(
    source.far ?? previous?.far ?? 1000,
    "COMPASS_COMPOSITOR_CAMERA_FAR_INVALID"
  );
  assertContract(
    near > 0 && far > near,
    "COMPASS_COMPOSITOR_CAMERA_CLIP_RANGE_INVALID",
    deepFreeze({ near, far })
  );

  return deepFreeze({
    position,
    target,
    up,
    orientation,
    fieldOfViewYRadians,
    near,
    far
  });
}

function normalizeProjectionConfig(source) {
  assertPlainRecord(
    source,
    "COMPASS_COMPOSITOR_PROJECTION_CONFIG_REQUIRED"
  );
  const centerDepth = finiteNumber(
    source.centerDepth,
    "COMPASS_COMPOSITOR_CENTER_DEPTH_INVALID"
  );
  const depthHysteresis = finiteNumber(
    source.depthHysteresis,
    "COMPASS_COMPOSITOR_DEPTH_HYSTERESIS_INVALID"
  );
  assertContract(
    centerDepth > 0 && depthHysteresis >= 0,
    "COMPASS_COMPOSITOR_DEPTH_POLICY_INVALID",
    deepFreeze({ centerDepth, depthHysteresis })
  );
  const interpolationRate = finiteNumber(
    source.interpolationRate ?? 10,
    "COMPASS_COMPOSITOR_INTERPOLATION_RATE_INVALID"
  );
  const maxDeltaSeconds = finiteNumber(
    source.maxDeltaSeconds ?? 0.1,
    "COMPASS_COMPOSITOR_MAX_DELTA_INVALID"
  );
  assertContract(
    interpolationRate >= 0 && maxDeltaSeconds > 0,
    "COMPASS_COMPOSITOR_TEMPORAL_POLICY_INVALID"
  );

  const expectedRecordCount = positiveInteger(
    source.expectedRecordCount ?? 21,
    "COMPASS_COMPOSITOR_EXPECTED_RECORD_COUNT_INVALID"
  );
  const expectedKindCounts = deepFreeze({
    CENTER: nonnegativeInteger(
      source.expectedKindCounts?.CENTER ?? 1,
      "COMPASS_COMPOSITOR_EXPECTED_CENTER_COUNT_INVALID"
    ),
    CARDINAL: nonnegativeInteger(
      source.expectedKindCounts?.CARDINAL ?? 4,
      "COMPASS_COMPOSITOR_EXPECTED_CARDINAL_COUNT_INVALID"
    ),
    CHILD: nonnegativeInteger(
      source.expectedKindCounts?.CHILD ?? 16,
      "COMPASS_COMPOSITOR_EXPECTED_CHILD_COUNT_INVALID"
    )
  });
  assertContract(
    Object.values(expectedKindCounts).reduce((sum, count) => sum + count, 0) ===
      expectedRecordCount,
    "COMPASS_COMPOSITOR_EXPECTED_KIND_COUNT_TOTAL_MISMATCH",
    deepFreeze({ expectedRecordCount, expectedKindCounts })
  );

  return deepFreeze({
    centerDepth,
    depthHysteresis,
    interpolationRate,
    maxDeltaSeconds,
    expectedRecordCount,
    expectedKindCounts
  });
}

function normalizeViewport(source) {
  assertPlainRecord(source, "COMPASS_COMPOSITOR_VIEWPORT_REQUIRED");
  const width = finiteNumber(
    source.width,
    "COMPASS_COMPOSITOR_VIEWPORT_WIDTH_INVALID"
  );
  const height = finiteNumber(
    source.height,
    "COMPASS_COMPOSITOR_VIEWPORT_HEIGHT_INVALID"
  );
  const pixelRatio = finiteNumber(
    source.pixelRatio,
    "COMPASS_COMPOSITOR_VIEWPORT_PIXEL_RATIO_INVALID"
  );
  assertContract(
    width > 0 && height > 0 && pixelRatio > 0,
    "COMPASS_COMPOSITOR_VIEWPORT_DIMENSIONS_INVALID",
    deepFreeze({ width, height, pixelRatio })
  );
  return deepFreeze({ width, height, pixelRatio });
}

function cameraBasisFor(camera) {
  const forward = normalize3(
    subtract3(camera.target, camera.position),
    "COMPASS_COMPOSITOR_CAMERA_FORWARD_INVALID"
  );
  let right = cross3(camera.up, forward);
  assertContract(
    Math.hypot(...right) > EPSILON,
    "COMPASS_COMPOSITOR_CAMERA_UP_PARALLEL"
  );
  right = normalize3(right, "COMPASS_COMPOSITOR_CAMERA_RIGHT_INVALID");
  const up = normalize3(
    cross3(forward, right),
    "COMPASS_COMPOSITOR_CAMERA_UP_INVALID"
  );
  return deepFreeze({ right, up, forward });
}

function createViewMatrix(camera, basis) {
  const { right, up, forward } = basis;
  const position = camera.position;
  return deepFreeze([
    right[0], right[1], right[2], -dot3(right, position),
    up[0], up[1], up[2], -dot3(up, position),
    forward[0], forward[1], forward[2], -dot3(forward, position),
    0, 0, 0, 1
  ]);
}

function createProjectionMatrix(camera, viewport) {
  const aspect = viewport.width / viewport.height;
  const focal = 1 / Math.tan(camera.fieldOfViewYRadians * 0.5);
  const near = camera.near;
  const far = camera.far;
  return deepFreeze([
    focal / aspect, 0, 0, 0,
    0, focal, 0, 0,
    0, 0, far / (far - near), -(near * far) / (far - near),
    0, 0, 1, 0
  ]);
}

function viewCoordinates(worldPoint, camera, basis) {
  const relative = subtract3(worldPoint, camera.position);
  return deepFreeze({
    x: dot3(relative, basis.right),
    y: dot3(relative, basis.up),
    z: dot3(relative, basis.forward)
  });
}

function projectWorldPoint(worldPoint, camera, basis, viewport) {
  const view = viewCoordinates(worldPoint, camera, basis);
  const safeDepth = Math.max(Math.abs(view.z), camera.near * 1e-6);
  const aspect = viewport.width / viewport.height;
  const focal = 1 / Math.tan(camera.fieldOfViewYRadians * 0.5);
  const ndcX = (view.x * focal / aspect) / safeDepth;
  const ndcY = (view.y * focal) / safeDepth;
  const normalizedDepth = clamp(
    (view.z - camera.near) / (camera.far - camera.near),
    0,
    1
  );
  const clipVisible =
    view.z >= camera.near &&
    view.z <= camera.far &&
    Math.abs(ndcX) <= 1 &&
    Math.abs(ndcY) <= 1;
  return deepFreeze({
    screenX: (ndcX * 0.5 + 0.5) * viewport.width,
    screenY: (0.5 - ndcY * 0.5) * viewport.height,
    viewDepth: view.z,
    normalizedDepth,
    ndcX,
    ndcY,
    clipVisible,
    viewportVisible:
      ndcX >= -1 && ndcX <= 1 &&
      ndcY >= -1 && ndcY <= 1
  });
}

function transformLocalPoint(localPoint, worldRecord) {
  const scaled = multiply3(localPoint, worldRecord.worldScale);
  const rotated = rotateVectorByQuaternion(
    scaled,
    worldRecord.worldOrientation
  );
  return add3(worldRecord.worldPosition, rotated);
}

function boundsCorners(bounds) {
  const corners = [];
  for (const x of [bounds.min[0], bounds.max[0]]) {
    for (const y of [bounds.min[1], bounds.max[1]]) {
      for (const z of [bounds.min[2], bounds.max[2]]) {
        corners.push([x, y, z]);
      }
    }
  }
  return corners;
}

function normalizeBounds(source, code) {
  assertPlainRecord(source, code);
  const minimum = vector3(source.min, `${code}_MIN`);
  const maximum = vector3(source.max, `${code}_MAX`);
  assertContract(
    maximum.every((value, index) => value > minimum[index]),
    `${code}_DEGENERATE`,
    source
  );
  const center = minimum.map(
    (value, index) => (value + maximum[index]) * 0.5
  );
  const size = maximum.map(
    (value, index) => value - minimum[index]
  );
  return deepFreeze({
    min: minimum,
    max: maximum,
    center,
    size,
    radius: Math.hypot(...size) * 0.5
  });
}

function validateWorldSnapshot(snapshot) {
  assertPlainRecord(
    snapshot,
    "COMPASS_COMPOSITOR_WORLD_SNAPSHOT_REQUIRED"
  );
  assertContract(
    typeof snapshot.schema === "string" &&
      snapshot.schema.startsWith(WORLD_SNAPSHOT_SCHEMA_PREFIX),
    "COMPASS_COMPOSITOR_WORLD_SNAPSHOT_SCHEMA_INVALID",
    snapshot.schema
  );
  nonnegativeInteger(
    snapshot.worldRevision,
    "COMPASS_COMPOSITOR_WORLD_REVISION_INVALID"
  );
  assertContract(
    Array.isArray(snapshot.records),
    "COMPASS_COMPOSITOR_WORLD_RECORDS_REQUIRED"
  );

  const ids = new Set();
  const canonicalOrders = new Set();
  const records = snapshot.records.map((source, sourceIndex) => {
    assertPlainRecord(
      source,
      "COMPASS_COMPOSITOR_WORLD_RECORD_INVALID"
    );
    const id = requireId(
      source.id,
      "COMPASS_COMPOSITOR_WORLD_RECORD_ID_REQUIRED"
    );
    assertContract(
      !ids.has(id),
      "COMPASS_COMPOSITOR_WORLD_RECORD_ID_DUPLICATE",
      id
    );
    ids.add(id);
    const kind = String(source.kind ?? "").toUpperCase();
    assertContract(
      ["CENTER", "CARDINAL", "CHILD"].includes(kind),
      "COMPASS_COMPOSITOR_WORLD_RECORD_KIND_INVALID",
      deepFreeze({ id, kind })
    );
    const parentId = optionalId(source.parentId);
    if (kind === "CHILD") {
      assertContract(
        parentId.length > 0,
        "COMPASS_COMPOSITOR_CHILD_PARENT_REQUIRED",
        id
      );
    }
    const canonicalOrderCandidate =
      source.canonicalOrder ?? source.index ?? sourceIndex;
    const canonicalOrder = nonnegativeInteger(
      canonicalOrderCandidate,
      "COMPASS_COMPOSITOR_WORLD_CANONICAL_ORDER_INVALID"
    );
    assertContract(
      !canonicalOrders.has(canonicalOrder),
      "COMPASS_COMPOSITOR_WORLD_CANONICAL_ORDER_DUPLICATE",
      canonicalOrder
    );
    canonicalOrders.add(canonicalOrder);
    return deepFreeze({
      id,
      kind,
      parentId,
      canonicalOrder,
      worldPosition: vector3(
        source.worldPosition,
        "COMPASS_COMPOSITOR_WORLD_POSITION_INVALID"
      ),
      worldOrientation: quaternion(
        source.worldOrientation,
        "COMPASS_COMPOSITOR_WORLD_ORIENTATION_INVALID"
      ),
      worldScale: positiveVector3(
        source.worldScale,
        "COMPASS_COMPOSITOR_WORLD_SCALE_INVALID"
      )
    });
  });

  return deepFreeze({
    schema: snapshot.schema,
    worldRevision: snapshot.worldRevision,
    records
  });
}

function validateCrystalRecord(source) {
  assertPlainRecord(
    source,
    "COMPASS_COMPOSITOR_CRYSTAL_RECORD_INVALID"
  );
  const id = requireId(
    source.id,
    "COMPASS_COMPOSITOR_CRYSTAL_RECORD_ID_REQUIRED"
  );
  const kind = String(source.kind ?? "").toUpperCase();
  assertContract(
    ["CENTER", "CARDINAL", "CHILD"].includes(kind),
    "COMPASS_COMPOSITOR_CRYSTAL_RECORD_KIND_INVALID",
    deepFreeze({ id, kind })
  );
  const localBounds = normalizeBounds(
    source.localBounds,
    "COMPASS_COMPOSITOR_CRYSTAL_LOCAL_BOUNDS_INVALID"
  );
  const visualAnchor = vector3(
    source.visualAnchor,
    "COMPASS_COMPOSITOR_VISUAL_ANCHOR_INVALID"
  );
  const semanticAnchor = vector3(
    source.semanticAnchor,
    "COMPASS_COMPOSITOR_SEMANTIC_ANCHOR_INVALID"
  );
  const labelAnchor = vector3(
    source.labelAnchor,
    "COMPASS_COMPOSITOR_LABEL_ANCHOR_INVALID"
  );
  assertPlainRecord(
    source.hitShape,
    "COMPASS_COMPOSITOR_HIT_SHAPE_REQUIRED"
  );
  let hitShape;
  if (source.hitShape.kind === "SPHERE") {
    const radius = finiteNumber(
      source.hitShape.radius,
      "COMPASS_COMPOSITOR_HIT_SPHERE_RADIUS_INVALID"
    );
    assertContract(
      radius > 0,
      "COMPASS_COMPOSITOR_HIT_SPHERE_RADIUS_NONPOSITIVE"
    );
    hitShape = deepFreeze({
      kind: "SPHERE",
      center: vector3(
        source.hitShape.center,
        "COMPASS_COMPOSITOR_HIT_SPHERE_CENTER_INVALID"
      ),
      radius
    });
  } else {
    assertContract(
      source.hitShape.kind === "AABB",
      "COMPASS_COMPOSITOR_HIT_SHAPE_KIND_INVALID",
      source.hitShape.kind
    );
    const admitted = normalizeBounds(
      source.hitShape,
      "COMPASS_COMPOSITOR_HIT_AABB_INVALID"
    );
    hitShape = deepFreeze({
      kind: "AABB",
      min: admitted.min,
      max: admitted.max
    });
  }
  return deepFreeze({
    id,
    kind,
    localBounds,
    visualAnchor,
    semanticAnchor,
    labelAnchor,
    hitShape
  });
}

function validateCrystalInput(input, worldSnapshot, projectionConfig) {
  assertPlainRecord(
    input,
    "COMPASS_COMPOSITOR_CRYSTAL_INPUT_REQUIRED"
  );
  assertContract(
    input.schema === CRYSTAL_INPUT_SCHEMA,
    "COMPASS_COMPOSITOR_CRYSTAL_INPUT_SCHEMA_INVALID",
    input.schema
  );
  nonnegativeInteger(
    input.worldRevision,
    "COMPASS_COMPOSITOR_CRYSTAL_WORLD_REVISION_INVALID"
  );
  positiveInteger(
    input.crystalRevision,
    "COMPASS_COMPOSITOR_CRYSTAL_REVISION_INVALID"
  );
  assertContract(
    typeof input.crystalHash === "string" &&
      input.crystalHash.length > 0,
    "COMPASS_COMPOSITOR_CRYSTAL_HASH_REQUIRED"
  );
  assertContract(
    input.worldRevision === worldSnapshot.worldRevision,
    "COMPASS_COMPOSITOR_WORLD_CRYSTAL_REVISION_MISMATCH",
    deepFreeze({
      worldRevision: worldSnapshot.worldRevision,
      crystalWorldRevision: input.worldRevision
    })
  );
  assertContract(
    Array.isArray(input.records),
    "COMPASS_COMPOSITOR_CRYSTAL_RECORDS_REQUIRED"
  );

  const worldById = new Map(
    worldSnapshot.records.map(record => [record.id, record])
  );
  const crystalById = new Map();
  const records = input.records.map(source => {
    const record = validateCrystalRecord(source);
    assertContract(
      !crystalById.has(record.id),
      "COMPASS_COMPOSITOR_DUPLICATE_CRYSTAL_ID",
      record.id
    );
    assertContract(
      worldById.has(record.id),
      "COMPASS_COMPOSITOR_EXTRA_CRYSTAL_RECORD",
      record.id
    );
    assertContract(
      worldById.get(record.id).kind === record.kind,
      "COMPASS_COMPOSITOR_WORLD_CRYSTAL_KIND_MISMATCH",
      deepFreeze({
        id: record.id,
        worldKind: worldById.get(record.id).kind,
        crystalKind: record.kind
      })
    );
    crystalById.set(record.id, record);
    return record;
  });

  const missing = worldSnapshot.records
    .filter(record => !crystalById.has(record.id))
    .map(record => record.id);
  assertContract(
    missing.length === 0,
    "COMPASS_COMPOSITOR_MISSING_CRYSTAL_RECORD",
    missing
  );
  assertContract(
    records.length === worldSnapshot.records.length,
    "COMPASS_COMPOSITOR_WORLD_CRYSTAL_ID_SET_MISMATCH",
    deepFreeze({
      worldCount: worldSnapshot.records.length,
      crystalCount: records.length
    })
  );
  assertContract(
    records.length === projectionConfig.expectedRecordCount,
    "COMPASS_COMPOSITOR_JOINED_RECORD_COUNT_INVALID",
    deepFreeze({
      expected: projectionConfig.expectedRecordCount,
      actual: records.length
    })
  );
  return deepFreeze({
    schema: input.schema,
    worldRevision: input.worldRevision,
    crystalRevision: input.crystalRevision,
    crystalHash: input.crystalHash,
    records,
    crystalById
  });
}

function validatePresentationContext(source, worldSnapshot) {
  assertPlainRecord(
    source,
    "COMPASS_COMPOSITOR_PRESENTATION_CONTEXT_REQUIRED"
  );
  assertContract(
    source.schema === PRESENTATION_CONTEXT_SCHEMA,
    "COMPASS_COMPOSITOR_PRESENTATION_CONTEXT_SCHEMA_INVALID",
    source.schema
  );
  nonnegativeInteger(
    source.controllerRevision,
    "COMPASS_COMPOSITOR_CONTROLLER_REVISION_INVALID"
  );
  assertContract(
    Object.values(PRESENTATION).includes(source.presentation),
    "COMPASS_COMPOSITOR_PRESENTATION_INVALID",
    source.presentation
  );
  assertContract(
    typeof source.held === "boolean",
    "COMPASS_COMPOSITOR_HELD_STATE_INVALID",
    source.held
  );
  assertContract(
    typeof source.reducedMotion === "boolean",
    "COMPASS_COMPOSITOR_REDUCED_MOTION_INVALID",
    source.reducedMotion
  );
  const activeCardinalId = optionalId(source.activeCardinalId);
  if (source.presentation === PRESENTATION.CLUSTER) {
    assertContract(
      activeCardinalId.length > 0 &&
        worldSnapshot.records.some(
          record =>
            record.id === activeCardinalId &&
            record.kind === "CARDINAL"
        ),
      "COMPASS_COMPOSITOR_ACTIVE_CARDINAL_INVALID",
      activeCardinalId
    );
  } else {
    assertContract(
      activeCardinalId === "",
      "COMPASS_COMPOSITOR_CONSTELLATION_ACTIVE_CARDINAL_PROHIBITED",
      activeCardinalId
    );
  }
  return deepFreeze({
    schema: source.schema,
    controllerRevision: source.controllerRevision,
    presentation: source.presentation,
    held: source.held,
    activeCardinalId,
    reducedMotion: source.reducedMotion
  });
}

function presentationEligible(worldRecord, context) {
  if (context.presentation === PRESENTATION.CONSTELLATION) {
    return worldRecord.kind === "CENTER" ||
      worldRecord.kind === "CARDINAL";
  }
  return (
    worldRecord.kind === "CENTER" ||
    (worldRecord.kind === "CARDINAL" &&
      worldRecord.id === context.activeCardinalId) ||
    (worldRecord.kind === "CHILD" &&
      worldRecord.parentId === context.activeCardinalId)
  );
}

function projectAnchor(localAnchor, worldRecord, camera, basis, viewport) {
  const worldPoint = transformLocalPoint(localAnchor, worldRecord);
  const projected = projectWorldPoint(
    worldPoint,
    camera,
    basis,
    viewport
  );
  return deepFreeze({
    screenX: projected.screenX,
    screenY: projected.screenY,
    viewDepth: projected.viewDepth,
    normalizedDepth: projected.normalizedDepth,
    clipVisible: projected.clipVisible,
    viewportVisible: projected.viewportVisible
  });
}

function projectBounds(bounds, worldRecord, camera, basis, viewport) {
  const worldCorners = boundsCorners(bounds).map(point =>
    transformLocalPoint(point, worldRecord)
  );
  const projectedCorners = worldCorners.map(point =>
    projectWorldPoint(point, camera, basis, viewport)
  );
  const xs = projectedCorners.map(point => point.screenX);
  const ys = projectedCorners.map(point => point.screenY);
  const viewDepths = projectedCorners.map(point => point.viewDepth);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const minViewDepth = Math.min(...viewDepths);
  const maxViewDepth = Math.max(...viewDepths);
  const viewportVisible =
    maxX >= 0 &&
    minX <= viewport.width &&
    maxY >= 0 &&
    minY <= viewport.height;
  const clipVisible =
    maxViewDepth >= camera.near &&
    minViewDepth <= camera.far &&
    viewportVisible;
  return deepFreeze({
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(0, maxX - minX),
    height: Math.max(0, maxY - minY),
    minViewDepth,
    maxViewDepth,
    clipVisible,
    viewportVisible
  });
}

function projectSphereGeometry(
  localCenter,
  localRadius,
  worldRecord,
  camera,
  basis,
  viewport
) {
  const worldCenter = transformLocalPoint(
    localCenter,
    worldRecord
  );
  const center = projectWorldPoint(
    worldCenter,
    camera,
    basis,
    viewport
  );
  const maximumScale = Math.max(...worldRecord.worldScale);
  const worldRadius = localRadius * maximumScale;
  const focalPixels =
    viewport.height /
    (2 * Math.tan(camera.fieldOfViewYRadians * 0.5));
  const radiusPx =
    focalPixels * worldRadius /
    Math.max(Math.abs(center.viewDepth), camera.near);
  const viewportVisible =
    center.screenX + radiusPx >= 0 &&
    center.screenX - radiusPx <= viewport.width &&
    center.screenY + radiusPx >= 0 &&
    center.screenY - radiusPx <= viewport.height;
  const clipVisible =
    center.viewDepth + worldRadius >= camera.near &&
    center.viewDepth - worldRadius <= camera.far &&
    viewportVisible;
  return deepFreeze({
    centerX: center.screenX,
    centerY: center.screenY,
    radiusPx,
    worldRadius,
    viewDepth: center.viewDepth,
    normalizedDepth: center.normalizedDepth,
    clipVisible,
    viewportVisible
  });
}

function classifyDepth(viewDepth, previousLayer, projectionConfig) {
  const { centerDepth, depthHysteresis } = projectionConfig;
  if (
    previousLayer === DEPTH_LAYER.FRONT &&
    viewDepth <= centerDepth + depthHysteresis
  ) {
    return DEPTH_LAYER.FRONT;
  }
  if (
    previousLayer === DEPTH_LAYER.REAR &&
    viewDepth >= centerDepth - depthHysteresis
  ) {
    return DEPTH_LAYER.REAR;
  }
  if (viewDepth < centerDepth - depthHysteresis) {
    return DEPTH_LAYER.FRONT;
  }
  if (viewDepth > centerDepth + depthHysteresis) {
    return DEPTH_LAYER.REAR;
  }
  return DEPTH_LAYER.CENTER;
}

function projectRecord({
  worldRecord,
  crystalRecord,
  camera,
  basis,
  viewport,
  context,
  projectionConfig,
  projectionRevision,
  worldRevision,
  crystalRevision,
  previousLayer
}) {
  const centerProjection = projectWorldPoint(
    worldRecord.worldPosition,
    camera,
    basis,
    viewport
  );
  const visualSphere = projectSphereGeometry(
    crystalRecord.localBounds.center,
    crystalRecord.localBounds.radius,
    worldRecord,
    camera,
    basis,
    viewport
  );
  const visualAabb = projectBounds(
    crystalRecord.localBounds,
    worldRecord,
    camera,
    basis,
    viewport
  );

  let projectedSphere = visualSphere;
  let projectedAabb = visualAabb;
  if (crystalRecord.hitShape.kind === "SPHERE") {
    projectedSphere = deepFreeze({
      ...projectSphereGeometry(
        crystalRecord.hitShape.center,
        crystalRecord.hitShape.radius,
        worldRecord,
        camera,
        basis,
        viewport
      ),
      source: "CRYSTALS_LOCAL_HIT_SPHERE"
    });
    projectedAabb = deepFreeze({
      ...visualAabb,
      source: "CRYSTALS_LOCAL_VISUAL_BOUNDS"
    });
  } else {
    projectedAabb = deepFreeze({
      ...projectBounds(
        {
          min: crystalRecord.hitShape.min,
          max: crystalRecord.hitShape.max
        },
        worldRecord,
        camera,
        basis,
        viewport
      ),
      source: "CRYSTALS_LOCAL_HIT_AABB"
    });
    projectedSphere = deepFreeze({
      ...visualSphere,
      source: "CRYSTALS_LOCAL_VISUAL_BOUNDS"
    });
  }

  const eligible = presentationEligible(worldRecord, context);
  const geometricallyVisible =
    centerProjection.viewDepth > 0 &&
    centerProjection.viewDepth <= camera.far &&
    (visualSphere.clipVisible || visualAabb.clipVisible);
  const visible = eligible && geometricallyVisible;
  const interactionEligible =
    visible &&
    !context.held &&
    (projectedSphere.viewportVisible ||
      projectedAabb.viewportVisible);
  const depthLayer = classifyDepth(
    centerProjection.viewDepth,
    previousLayer,
    projectionConfig
  );

  return deepFreeze({
    schema: PROJECTED_RECORD_SCHEMA,
    id: worldRecord.id,
    kind: worldRecord.kind,
    parentId: worldRecord.parentId,
    screenX: centerProjection.screenX,
    screenY: centerProjection.screenY,
    viewDepth: centerProjection.viewDepth,
    normalizedDepth: centerProjection.normalizedDepth,
    projectedSphere,
    projectedAabb,
    projectedVisualAnchor: projectAnchor(
      crystalRecord.visualAnchor,
      worldRecord,
      camera,
      basis,
      viewport
    ),
    projectedSemanticAnchor: projectAnchor(
      crystalRecord.semanticAnchor,
      worldRecord,
      camera,
      basis,
      viewport
    ),
    projectedLabelAnchor: projectAnchor(
      crystalRecord.labelAnchor,
      worldRecord,
      camera,
      basis,
      viewport
    ),
    visible,
    presentationEligible: eligible,
    interactionEligible,
    depthLayer,
    worldRevision,
    crystalRevision,
    projectionRevision,
    clipVisible:
      visualSphere.clipVisible || visualAabb.clipVisible,
    viewportVisible:
      visualSphere.viewportVisible || visualAabb.viewportVisible,
    canonicalOrder: worldRecord.canonicalOrder
  });
}

function publicationComparator(a, b) {
  return (
    Number(b.presentationEligible) -
      Number(a.presentationEligible) ||
    Number(b.visible) - Number(a.visible) ||
    DEPTH_LAYER_ORDER[a.depthLayer] -
      DEPTH_LAYER_ORDER[b.depthLayer] ||
    a.viewDepth - b.viewDepth ||
    a.canonicalOrder - b.canonicalOrder ||
    a.id.localeCompare(b.id)
  );
}

function overlapFacts(records) {
  const ordered = records.slice().sort((a, b) =>
    a.id.localeCompare(b.id)
  );
  const facts = [];
  for (let aIndex = 0; aIndex < ordered.length; aIndex += 1) {
    for (
      let bIndex = aIndex + 1;
      bIndex < ordered.length;
      bIndex += 1
    ) {
      const a = ordered[aIndex];
      const b = ordered[bIndex];
      const dx =
        a.projectedSphere.centerX -
        b.projectedSphere.centerX;
      const dy =
        a.projectedSphere.centerY -
        b.projectedSphere.centerY;
      const sphereOverlap =
        Math.hypot(dx, dy) <=
        a.projectedSphere.radiusPx +
          b.projectedSphere.radiusPx;
      const minX = Math.max(
        a.projectedAabb.minX,
        b.projectedAabb.minX
      );
      const maxX = Math.min(
        a.projectedAabb.maxX,
        b.projectedAabb.maxX
      );
      const minY = Math.max(
        a.projectedAabb.minY,
        b.projectedAabb.minY
      );
      const maxY = Math.min(
        a.projectedAabb.maxY,
        b.projectedAabb.maxY
      );
      const overlapWidth = Math.max(0, maxX - minX);
      const overlapHeight = Math.max(0, maxY - minY);
      const overlapArea = overlapWidth * overlapHeight;
      facts.push(deepFreeze({
        aId: a.id,
        bId: b.id,
        sphereOverlap,
        aabbOverlap: overlapArea > 0,
        overlapArea,
        depthDelta: Math.abs(a.viewDepth - b.viewDepth)
      }));
    }
  }
  return deepFreeze(facts);
}

function finiteProjectedRecord(record) {
  const numericValues = [
    record.screenX,
    record.screenY,
    record.viewDepth,
    record.normalizedDepth,
    record.projectedSphere.centerX,
    record.projectedSphere.centerY,
    record.projectedSphere.radiusPx,
    record.projectedAabb.minX,
    record.projectedAabb.minY,
    record.projectedAabb.maxX,
    record.projectedAabb.maxY,
    record.projectedVisualAnchor.screenX,
    record.projectedVisualAnchor.screenY,
    record.projectedSemanticAnchor.screenX,
    record.projectedSemanticAnchor.screenY,
    record.projectedLabelAnchor.screenX,
    record.projectedLabelAnchor.screenY
  ];
  return numericValues.every(Number.isFinite);
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
  projectionRevision,
  worldRevision,
  crystalRevision,
  controllerRevision,
  records,
  interactionProjectionRecords,
  hiddenRecords,
  tombstones,
  worldIds,
  crystalIds,
  viewMatrix,
  projectionMatrix,
  viewProjectionMatrix,
  context,
  projectionConfig
}) {
  const recordIds = records.map(record => record.id);
  const recordIdSet = new Set(recordIds);
  const kindCounts = records.reduce((counts, record) => {
    counts[record.kind] = (counts[record.kind] || 0) + 1;
    return counts;
  }, {});
  const expectedCounts = projectionConfig.expectedKindCounts;
  const deterministicOrder = records.every(
    (record, index) =>
      index === 0 ||
      publicationComparator(records[index - 1], record) <= 0
  );
  const findings = [
    finding(
      "WORLD_CRYSTAL_REVISION_MATCH",
      Number.isInteger(worldRevision) &&
        worldRevision >= 0 &&
        Number.isInteger(crystalRevision) &&
        crystalRevision > 0
    ),
    finding(
      "CONTROLLER_REVISION_VALID",
      Number.isInteger(controllerRevision) &&
        controllerRevision >= 0,
      controllerRevision
    ),
    finding(
      "WORLD_CRYSTAL_IDENTITY_SETS_MATCH",
      worldIds.size === crystalIds.size &&
        Array.from(worldIds).every(id => crystalIds.has(id))
    ),
    finding(
      "EXACT_JOINED_RECORD_COUNT",
      records.length === projectionConfig.expectedRecordCount,
      deepFreeze({
        expected: projectionConfig.expectedRecordCount,
        actual: records.length
      })
    ),
    finding(
      "EXPECTED_KIND_COUNTS",
      Object.entries(expectedCounts).every(
        ([kind, count]) => (kindCounts[kind] || 0) === count
      ),
      deepFreeze({ expected: expectedCounts, actual: kindCounts })
    ),
    finding(
      "UNIQUE_PROJECTED_IDENTITIES",
      recordIdSet.size === records.length,
      recordIdSet.size
    ),
    finding(
      "ALL_MATRICES_FINITE",
      allFinite(viewMatrix) &&
        allFinite(projectionMatrix) &&
        allFinite(viewProjectionMatrix)
    ),
    finding(
      "ALL_PROJECTED_VALUES_FINITE",
      records.every(finiteProjectedRecord)
    ),
    finding(
      "NORMALIZED_DEPTH_BOUNDED",
      records.every(
        record =>
          record.normalizedDepth >= 0 &&
          record.normalizedDepth <= 1
      )
    ),
    finding(
      "VISIBLE_RECORDS_FORWARD_OF_NEAR_PLANE",
      records
        .filter(record => record.visible)
        .every(record => record.viewDepth > 0)
    ),
    finding(
      "PROJECTION_ORDER_DETERMINISTIC",
      deterministicOrder
    ),
    finding(
      "INTERACTION_RECORDS_SUBSET_OF_PROJECTED",
      interactionProjectionRecords.every(record =>
        recordIdSet.has(record.id)
      )
    ),
    finding(
      "HELD_STATE_DISABLES_INTERACTION",
      !context.held ||
        interactionProjectionRecords.length === 0,
      context.held
    ),
    finding(
      "HIDDEN_RECORDS_NOT_INTERACTION_ELIGIBLE",
      hiddenRecords.every(
        record => record.interactionEligible === false
      )
    ),
    finding(
      "TOMBSTONES_NOT_INTERACTION_ELIGIBLE",
      tombstones.every(
        record =>
          record.interactionEligible === false &&
          record.worldAuthority === false
      )
    ),
    finding(
      "NO_DOM_CANVAS_RENDERER_AUTHORITY",
      UNIVERSAL_COMPASS_COMPOSITOR_CONTRACT.domAuthority === false &&
        UNIVERSAL_COMPASS_COMPOSITOR_CONTRACT.canvasAuthority === false &&
        UNIVERSAL_COMPASS_COMPOSITOR_CONTRACT.webglAuthority === false &&
        UNIVERSAL_COMPASS_COMPOSITOR_CONTRACT.rendererAuthority === false
    ),
    finding(
      "IMMUTABLE_PUBLICATION",
      Object.isFrozen(records) &&
        records.every(Object.isFrozen) &&
        Object.isFrozen(interactionProjectionRecords) &&
        Object.isFrozen(hiddenRecords) &&
        Object.isFrozen(tombstones)
    ),
    finding(
      "PROJECTION_REVISION_VALID",
      Number.isInteger(projectionRevision) &&
        projectionRevision > 0,
      projectionRevision
    )
  ];
  const failed = findings.filter(record => !record.pass);
  const receiptBody = {
    schema: PROJECTION_VALIDATION_SCHEMA,
    status: failed.length === 0 ? "PASS" : "FAIL",
    summary: {
      findingCount: findings.length,
      passed: findings.length - failed.length,
      failed: failed.length,
      recordCount: records.length,
      interactionRecordCount:
        interactionProjectionRecords.length,
      hiddenRecordCount: hiddenRecords.length,
      tombstoneCount: tombstones.length
    },
    projectionRevision,
    worldRevision,
    crystalRevision,
    controllerRevision,
    findings,
    productAuthority: false,
    runtimeAcceptanceAuthority: false,
    productionAuthority: false
  };
  return deepFreeze({
    ...receiptBody,
    receiptHash: deterministicHash(receiptBody)
  });
}

function interpolateCamera(
  current,
  target,
  deltaSeconds,
  reducedMotion,
  projectionConfig
) {
  if (reducedMotion || projectionConfig.interpolationRate === 0) {
    return target;
  }
  const boundedDelta = Math.min(
    deltaSeconds,
    projectionConfig.maxDeltaSeconds
  );
  const alpha = clamp(
    1 - Math.exp(
      -projectionConfig.interpolationRate * boundedDelta
    ),
    0,
    1
  );
  if (alpha >= 1 - EPSILON) return target;
  return normalizeCameraRecord({
    position: lerp3(current.position, target.position, alpha),
    target: lerp3(current.target, target.target, alpha),
    up: lerp3(current.up, target.up, alpha),
    fieldOfViewYRadians:
      current.fieldOfViewYRadians +
      (target.fieldOfViewYRadians -
        current.fieldOfViewYRadians) *
        alpha,
    near:
      current.near + (target.near - current.near) * alpha,
    far:
      current.far + (target.far - current.far) * alpha
  });
}

export function createCompositor({
  cameraConfig,
  projectionConfig
} = {}) {
  let targetCamera = normalizeCameraRecord(cameraConfig);
  let effectiveCamera = targetCamera;
  const admittedProjectionConfig =
    normalizeProjectionConfig(projectionConfig);
  let cameraRevision = 0;
  let projectionRevision = 0;
  let lastSnapshot = null;
  let disposed = false;
  let previousLayerById = new Map();
  let previousVisibleRecordById = new Map();

  function requireActive() {
    assertContract(
      !disposed,
      "COMPASS_COMPOSITOR_DISPOSED"
    );
  }

  function setCamera(nextCamera) {
    requireActive();
    targetCamera = normalizeCameraRecord(
      nextCamera,
      targetCamera
    );
    cameraRevision += 1;
    return targetCamera;
  }

  function project(input) {
    requireActive();
    assertExactKeys(
      input,
      [
        "worldSnapshot",
        "crystalInput",
        "presentationContext",
        "viewport",
        "timestampMs",
        "deltaSeconds"
      ],
      "COMPASS_COMPOSITOR_PROJECT_INPUT_KEYS_INVALID"
    );

    const timestampMs = finiteNumber(
      input.timestampMs,
      "COMPASS_COMPOSITOR_TIMESTAMP_INVALID"
    );
    const deltaSeconds = finiteNumber(
      input.deltaSeconds,
      "COMPASS_COMPOSITOR_DELTA_INVALID"
    );
    assertContract(
      timestampMs >= 0 && deltaSeconds >= 0,
      "COMPASS_COMPOSITOR_TIME_NEGATIVE",
      deepFreeze({ timestampMs, deltaSeconds })
    );

    const worldSnapshot = validateWorldSnapshot(
      input.worldSnapshot
    );
    const crystalInput = validateCrystalInput(
      input.crystalInput,
      worldSnapshot,
      admittedProjectionConfig
    );
    const presentationContext =
      validatePresentationContext(
        input.presentationContext,
        worldSnapshot
      );
    const viewport = normalizeViewport(input.viewport);

    effectiveCamera = interpolateCamera(
      effectiveCamera,
      targetCamera,
      deltaSeconds,
      presentationContext.reducedMotion,
      admittedProjectionConfig
    );
    const camera = effectiveCamera;
    const cameraBasis = cameraBasisFor(camera);
    const viewMatrix = createViewMatrix(camera, cameraBasis);
    const projectionMatrix =
      createProjectionMatrix(camera, viewport);
    const viewProjectionMatrix = deepFreeze(
      matrixMultiply4(projectionMatrix, viewMatrix)
    );

    const nextProjectionRevision =
      projectionRevision + 1;
    const joinedRecords = worldSnapshot.records.map(
      worldRecord => {
        const crystalRecord =
          crystalInput.crystalById.get(worldRecord.id);
        return projectRecord({
          worldRecord,
          crystalRecord,
          camera,
          basis: cameraBasis,
          viewport,
          context: presentationContext,
          projectionConfig: admittedProjectionConfig,
          projectionRevision: nextProjectionRevision,
          worldRevision: worldSnapshot.worldRevision,
          crystalRevision: crystalInput.crystalRevision,
          previousLayer:
            previousLayerById.get(worldRecord.id)
        });
      }
    );

    const records = deepFreeze(
      joinedRecords.slice().sort(publicationComparator)
    );
    const interactionProjectionRecords = deepFreeze(
      records.filter(record => record.interactionEligible)
    );
    const hiddenRecords = deepFreeze(
      records.filter(record => !record.visible)
    );
    const currentVisibleById = new Map(
      records
        .filter(record => record.visible)
        .map(record => [record.id, record])
    );
    const tombstones = deepFreeze(
      Array.from(previousVisibleRecordById.entries())
        .filter(([id]) => !currentVisibleById.has(id))
        .map(([id, lastRecord]) =>
          deepFreeze({
            schema: TOMBSTONE_SCHEMA,
            id,
            kind: lastRecord.kind,
            parentId: lastRecord.parentId,
            projectionRevision: nextProjectionRevision,
            previousProjectionRevision:
              lastRecord.projectionRevision,
            lastProjectionRecord: lastRecord,
            interactionEligible: false,
            worldAuthority: false
          })
        )
        .sort((a, b) => a.id.localeCompare(b.id))
    );
    const overlaps = overlapFacts(
      interactionProjectionRecords
    );

    const validationReceipt = createValidationReceipt({
      projectionRevision: nextProjectionRevision,
      worldRevision: worldSnapshot.worldRevision,
      crystalRevision: crystalInput.crystalRevision,
      controllerRevision:
        presentationContext.controllerRevision,
      records,
      interactionProjectionRecords,
      hiddenRecords,
      tombstones,
      worldIds: new Set(
        worldSnapshot.records.map(record => record.id)
      ),
      crystalIds: new Set(
        crystalInput.records.map(record => record.id)
      ),
      viewMatrix,
      projectionMatrix,
      viewProjectionMatrix,
      context: presentationContext,
      projectionConfig: admittedProjectionConfig
    });
    assertContract(
      validationReceipt.status === "PASS",
      "COMPASS_COMPOSITOR_PROJECTION_VALIDATION_FAILED",
      validationReceipt
    );

    projectionRevision = nextProjectionRevision;
    previousLayerById = new Map(
      records.map(record => [record.id, record.depthLayer])
    );
    previousVisibleRecordById = currentVisibleById;

    lastSnapshot = deepFreeze({
      schema: PROJECTION_SNAPSHOT_SCHEMA,
      projectionRevision,
      worldRevision: worldSnapshot.worldRevision,
      crystalRevision: crystalInput.crystalRevision,
      controllerRevision:
        presentationContext.controllerRevision,
      cameraRevision,
      timestampMs,
      deltaSeconds,
      viewport,
      camera,
      cameraBasis,
      viewMatrix,
      projectionMatrix,
      viewProjectionMatrix,
      records,
      interactionProjectionRecords,
      overlapFacts: overlaps,
      hiddenRecords,
      tombstones,
      validationReceipt
    });

    return lastSnapshot;
  }

  function validate(snapshot = lastSnapshot) {
    requireActive();
    assertContract(
      snapshot &&
        snapshot.schema === PROJECTION_SNAPSHOT_SCHEMA,
      "COMPASS_COMPOSITOR_PROJECTION_SNAPSHOT_INVALID",
      snapshot?.schema
    );
    assertContract(
      snapshot.validationReceipt?.status === "PASS",
      "COMPASS_COMPOSITOR_PROJECTION_RECEIPT_INVALID",
      snapshot.validationReceipt
    );
    assertContract(
      Object.isFrozen(snapshot),
      "COMPASS_COMPOSITOR_SNAPSHOT_NOT_IMMUTABLE"
    );
    return snapshot.validationReceipt;
  }

  function dispose() {
    if (disposed) return;
    disposed = true;
    lastSnapshot = null;
    previousLayerById = new Map();
    previousVisibleRecordById = new Map();
  }

  return Object.freeze({
    setCamera,
    getCamera: () => targetCamera,
    getCameraRevision: () => cameraRevision,
    project,
    getLastProjection: () => lastSnapshot,
    getProjectionRevision: () => projectionRevision,
    validate,
    dispose
  });
}
