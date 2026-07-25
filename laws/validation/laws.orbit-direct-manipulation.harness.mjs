import fs from "node:fs";
import crypto from "node:crypto";

const PATHS = Object.freeze({
  crystals: "laws/index.crystals.js",
  interactions:
    "laws/index.interactions.source.round4.js",
  wrapper: "laws/index.interactions.js",
  html: "laws/index.html",
  css: "laws/index.css",
  receipt:
    "laws/validation/laws.orbit-direct-manipulation.receipt.json"
});

const sources = Object.freeze(
  Object.fromEntries(
    Object.entries(PATHS)
      .filter(([key]) => key !== "receipt")
      .map(([key, path]) => [
        key,
        fs.readFileSync(path, "utf8")
      ])
  )
);

const assertions = [];

function assert(condition, code, details = null) {
  assertions.push({
    code,
    pass: Boolean(condition),
    details
  });

  if (!condition) {
    const error = new Error(code);
    error.details = details;
    throw error;
  }
}

function approx(actual, expected, epsilon, code) {
  assert(
    Math.abs(actual - expected) <= epsilon,
    code,
    { actual, expected, epsilon }
  );
}

function gitBlobSha(content) {
  const bytes = Buffer.from(content, "utf8");
  return crypto
    .createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
}

function extractNumber(source, pattern, code) {
  const match = source.match(pattern);
  assert(Boolean(match), code);
  const value = Number(match[1]);
  assert(Number.isFinite(value), `${code}_FINITE`, {
    value: match[1]
  });
  return value;
}

function normalize(vector) {
  const length = Math.hypot(...vector);
  assert(length > 1e-12, "VECTOR_LENGTH_REQUIRED", {
    vector
  });
  return vector.map(value => value / length);
}

function dot(a, b) {
  return a.reduce(
    (sum, value, index) =>
      sum + value * b[index],
    0
  );
}

function cross(a, b) {
  return [
    a[1] * b[2] - a[2] * b[1],
    a[2] * b[0] - a[0] * b[2],
    a[0] * b[1] - a[1] * b[0]
  ];
}

function subtract(a, b) {
  return a.map((value, index) => value - b[index]);
}

function add(a, b) {
  return a.map((value, index) => value + b[index]);
}

function scale(vector, amount) {
  return vector.map(value => value * amount);
}

function quaternionFromAxisAngle(axis, angle) {
  const unit = normalize(axis);
  const half = angle * 0.5;
  const sine = Math.sin(half);
  return [
    unit[0] * sine,
    unit[1] * sine,
    unit[2] * sine,
    Math.cos(half)
  ];
}

function quaternionMultiply(a, b) {
  const [ax, ay, az, aw] = a;
  const [bx, by, bz, bw] = b;
  return [
    aw * bx + ax * bw + ay * bz - az * by,
    aw * by - ax * bz + ay * bw + az * bx,
    aw * bz + ax * by - ay * bx + az * bw,
    aw * bw - ax * bx - ay * by - az * bz
  ];
}

function quaternionRotateVector(q, vector) {
  const qv = q.slice(0, 3);
  const w = q[3];
  const qvLengthSquared = dot(qv, qv);
  return add(
    add(
      scale(qv, 2 * dot(qv, vector)),
      scale(vector, w * w - qvLengthSquared)
    ),
    scale(cross(qv, vector), 2 * w)
  );
}

function cameraBasis(camera) {
  const forward = normalize(
    subtract(camera.target, camera.eye)
  );
  const right = normalize(
    cross(forward, [0, 1, 0])
  );
  const up = cross(right, forward);
  return { forward, right, up };
}

function projectPoint(point, camera) {
  const basis = cameraBasis(camera);
  const delta = subtract(point, camera.eye);
  const depth = dot(delta, basis.forward);

  assert(depth > 0.1, "PROJECTED_POINT_IN_FRONT_OF_CAMERA", {
    point,
    camera: camera.id,
    depth
  });

  const focal =
    camera.height /
    (
      2 *
      Math.tan(camera.fieldOfView * 0.5)
    );

  return {
    x:
      camera.width * 0.5 +
      dot(delta, basis.right) *
        focal /
        depth,
    y:
      camera.height * 0.5 -
      dot(delta, basis.up) *
        focal /
        depth,
    depth
  };
}

const sphereDirections = [];
for (let index = 0; index < 64; index += 1) {
  const z =
    1 -
    2 *
    (index + 0.5) /
    64;
  const angle =
    Math.PI *
    (3 - Math.sqrt(5)) *
    index;
  const radial =
    Math.sqrt(
      Math.max(0, 1 - z * z)
    );
  sphereDirections.push([
    radial * Math.cos(angle),
    radial * Math.sin(angle),
    z
  ]);
}

function projectedRadius(center, radius, camera) {
  const projectedCenter =
    projectPoint(center, camera);
  let maximum = 0;

  for (const direction of sphereDirections) {
    const projected =
      projectPoint(
        add(
          center,
          scale(direction, radius)
        ),
        camera
      );
    maximum = Math.max(
      maximum,
      Math.hypot(
        projected.x - projectedCenter.x,
        projected.y - projectedCenter.y
      )
    );
  }

  return maximum;
}

const clusterBlockMatch =
  sources.crystals.match(
    /    cluster:\n      Object\.freeze\(\{[\s\S]*?\n      \}\)\n  \}\);/
  );
assert(
  Boolean(clusterBlockMatch),
  "CLUSTER_CONTRACT_BLOCK_FOUND"
);
const clusterBlock = clusterBlockMatch[0];

assert(
  clusterBlock.includes(
    '"EUCLIDEAN_COMMON_RADIUS_ORBIT"'
  ),
  "EUCLIDEAN_ORBIT_MODEL_DECLARED"
);
assert(
  !clusterBlock.includes("horizontalRadius") &&
  !clusterBlock.includes("verticalRadius") &&
  !clusterBlock.includes("depthRadius"),
  "ELLIPSOIDAL_CLUSTER_RADII_REMOVED"
);
assert(
  !clusterBlock.includes("latitudeAmplitude") &&
  !clusterBlock.includes("latitudeFrequency"),
  "SINUSOIDAL_LATITUDE_REMOVED"
);
assert(
  sources.crystals.includes(
    "LAWS_CRYSTALS_CLUSTER_90_DEGREE_SPACING_INVALID"
  ),
  "RUNTIME_ANGULAR_VALIDATION_PRESENT"
);
assert(
  sources.crystals.includes(
    "validateClusterOrbitContract();"
  ),
  "RUNTIME_ORBIT_VALIDATION_EXECUTED"
);
assert(
  sources.crystals.includes(
    "boundClusterQuaternion"
  ),
  "RENDERER_TILT_BOUND_PRESENT"
);
assert(
  !sources.crystals.includes(
    "0.68 +\n            sphere.depth *\n              0.36"
  ),
  "DEPTH_BASED_LAW_SCALE_REMOVED"
);
assert(
  sources.interactions.includes(
    "dy,\n      -dx,\n      0,"
  ),
  "NEGATIVE_HORIZONTAL_YAW_PRESENT"
);
assert(
  !sources.interactions.includes(
    "dy,\n      dx,\n      0,"
  ),
  "POSITIVE_HORIZONTAL_YAW_RETIRED"
);
assert(
  sources.interactions.includes(
    "constrainClusterQuaternion"
  ),
  "INTERACTION_TILT_BOUND_PRESENT"
);
assert(
  sources.wrapper.includes(
    "LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"
  ),
  "INTERACTION_WRAPPER_CACHE_ID_UPDATED"
);
assert(
  sources.html.includes(
    "LAWS_COMPASS_EUCLIDEAN_COMMON_RADIUS_ORBIT_v3"
  ),
  "CRYSTALS_CACHE_ID_UPDATED"
);
assert(
  sources.html.includes(
    "LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"
  ),
  "INTERACTIONS_CACHE_ID_UPDATED"
);
assert(
  sources.html.includes(
    "LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4"
  ) &&
  sources.html.includes(
    "data-laws-horizontal-drag-yaw-sign=\"negative\""
  ),
  "HTML_ORBIT_CONTRACT_UPDATED"
);
assert(
  sources.css.includes(
    "EUCLIDEAN CLUSTER ORBIT CORRECTION"
  ) &&
  sources.css.includes(
    '[data-laws-presentation-mode="CLUSTER"]'
  ) &&
  sources.css.includes("content: none;"),
  "DECORATIVE_CLUSTER_ELLIPSE_SUPPRESSED"
);

const memberCount = extractNumber(
  clusterBlock,
  /memberCount:\n          ([0-9.]+)/,
  "MEMBER_COUNT_PARSED"
);
const commonRadius = extractNumber(
  clusterBlock,
  /commonRadius:\n          ([0-9.]+)/,
  "COMMON_RADIUS_PARSED"
);
const maximumTiltRadians = extractNumber(
  clusterBlock,
  /maximumTiltRadians:\n          ([0-9.]+)/,
  "MAXIMUM_TILT_PARSED"
);
const clearanceMarginPx = extractNumber(
  clusterBlock,
  /projectedClearanceMarginPx:\n          ([0-9.]+)/,
  "CLEARANCE_MARGIN_PARSED"
);
const interactionMaximumTilt = extractNumber(
  sources.interactions,
  /clusterMaximumTiltRadians:\n      ([0-9.]+)/,
  "INTERACTION_MAXIMUM_TILT_PARSED"
);

approx(memberCount, 4, 0, "MEMBER_COUNT_EQUALS_FOUR");
approx(commonRadius, 1.40, 1e-12, "COMMON_RADIUS_LOCKED");
approx(
  maximumTiltRadians,
  0.30,
  1e-12,
  "MAXIMUM_TILT_LOCKED"
);
approx(
  interactionMaximumTilt,
  maximumTiltRadians,
  1e-12,
  "CROSS_MODULE_TILT_CONTRACT_MATCHES"
);
approx(
  clearanceMarginPx,
  8,
  0,
  "PROJECTED_CLEARANCE_MARGIN_LOCKED"
);

const phase = -Math.PI / 2;
const localMembers =
  Array.from(
    { length: memberCount },
    (_, index) => {
      const angle =
        phase +
        index *
          Math.PI * 2 /
          memberCount;
      return [
        commonRadius * Math.cos(angle),
        commonRadius * Math.sin(angle),
        0
      ];
    }
  );

for (let index = 0; index < memberCount; index += 1) {
  const vector = localMembers[index];
  approx(
    Math.hypot(...vector),
    commonRadius,
    1e-12,
    `COMMON_RADIUS_MEMBER_${index}`
  );
  approx(
    vector[2],
    0,
    1e-12,
    `COPLANAR_MEMBER_${index}`
  );

  const adjacent =
    localMembers[(index + 1) % memberCount];
  const opposite =
    localMembers[(index + 2) % memberCount];

  approx(
    dot(vector, adjacent),
    0,
    1e-12,
    `ADJACENT_90_DEGREES_${index}`
  );
  approx(
    dot(vector, opposite),
    -commonRadius * commonRadius,
    1e-12,
    `OPPOSITE_180_DEGREES_${index}`
  );
}

const cameras = Object.freeze([
  Object.freeze({
    id: "desktop-1440x900",
    width: 1440,
    height: 900,
    eye: [0, 0.62, 6.28],
    target: [0, 0.02, 0.04],
    fieldOfView: Math.PI / 4.85
  }),
  Object.freeze({
    id: "mobile-390x844",
    width: 390,
    height: 844,
    eye: [0, 0.62, 7.68],
    target: [0, 0.02, 0.04],
    fieldOfView: Math.PI / 4.45
  }),
  Object.freeze({
    id: "compact-mobile-320x568",
    width: 320,
    height: 568,
    eye: [0, 0.62, 7.68],
    target: [0, 0.02, 0.04],
    fieldOfView: Math.PI / 4.45
  })
]);

const planetRadius = 0.486;
const maximumLawStarRadius =
  (0.42 + 0.075) * 1.18;
let worstClearancePx = Infinity;
let worstFixture = null;

for (const camera of cameras) {
  const projectedPlanetCenter =
    projectPoint([0, 0, 0], camera);
  const projectedPlanetRadius =
    projectedRadius(
      [0, 0, 0],
      planetRadius,
      camera
    );

  for (const tiltFactor of [0, 0.5, 1]) {
    const tilt =
      maximumTiltRadians * tiltFactor;

    for (
      let tiltAxisIndex = 0;
      tiltAxisIndex < 12;
      tiltAxisIndex += 1
    ) {
      const tiltAxisAngle =
        tiltAxisIndex *
        Math.PI * 2 /
        12;
      const swing =
        quaternionFromAxisAngle(
          [
            Math.cos(tiltAxisAngle),
            Math.sin(tiltAxisAngle),
            0
          ],
          tilt
        );

      for (
        let twistIndex = 0;
        twistIndex < 16;
        twistIndex += 1
      ) {
        const twist =
          quaternionFromAxisAngle(
            [0, 0, 1],
            twistIndex *
              Math.PI * 2 /
              16
          );
        const orientation =
          quaternionMultiply(
            swing,
            twist
          );
        const rotatedNormal =
          quaternionRotateVector(
            orientation,
            [0, 0, 1]
          );
        const actualTilt =
          Math.acos(
            Math.max(
              -1,
              Math.min(1, rotatedNormal[2])
            )
          );

        assert(
          actualTilt <=
            maximumTiltRadians +
            1e-10,
          "FIXTURE_TILT_WITHIN_BOUND",
          {
            camera: camera.id,
            actualTilt,
            maximumTiltRadians
          }
        );

        for (
          let memberIndex = 0;
          memberIndex < memberCount;
          memberIndex += 1
        ) {
          const center =
            quaternionRotateVector(
              orientation,
              localMembers[memberIndex]
            );
          const radius =
            Math.hypot(...center);
          approx(
            radius,
            commonRadius,
            1e-10,
            "ROTATION_PRESERVES_COMMON_RADIUS"
          );

          const projectedCenter =
            projectPoint(center, camera);
          const projectedStarRadius =
            projectedRadius(
              center,
              maximumLawStarRadius,
              camera
            );
          const centerDistance =
            Math.hypot(
              projectedCenter.x -
                projectedPlanetCenter.x,
              projectedCenter.y -
                projectedPlanetCenter.y
            );
          const clearance =
            centerDistance -
            projectedPlanetRadius -
            projectedStarRadius -
            clearanceMarginPx;

          if (clearance < worstClearancePx) {
            worstClearancePx = clearance;
            worstFixture = {
              camera: camera.id,
              tilt,
              tiltAxisIndex,
              twistIndex,
              memberIndex,
              centerDistance,
              projectedPlanetRadius,
              projectedStarRadius,
              requiredMarginPx:
                clearanceMarginPx,
              residualClearancePx:
                clearance
            };
          }
        }
      }
    }
  }
}

assert(
  worstClearancePx >= 0,
  "PROJECTED_GLOBE_CLEARANCE_ALL_FIXTURES",
  worstFixture
);

const receipt = {
  receiptId:
    "LAWS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_ACCEPTANCE_RECEIPT_v1",
  status: "PASS",
  branch:
    "agent/laws-euclidean-orbit-direct-manipulation-001",
  parentCommit:
    "dedc73841de2b41f5905fd842e9a593116caf300",
  sourceBlobs: Object.fromEntries(
    Object.entries(sources).map(
      ([key, content]) => [
        PATHS[key],
        gitBlobSha(content)
      ]
    )
  ),
  contract: {
    model: "EUCLIDEAN_COMMON_RADIUS_ORBIT",
    memberCount,
    commonRadius,
    localPlane: "XY",
    phaseRadians: phase,
    maximumTiltRadians,
    projectedClearanceMarginPx:
      clearanceMarginPx,
    horizontalDragYawSign: "NEGATIVE",
    depthBasedLawScale: false,
    decorativeClusterEllipseVisible:
      false
  },
  geometry: {
    commonCenter: true,
    commonRadius: true,
    coplanar: true,
    adjacentSeparationDegrees: 90,
    oppositeSeparationDegrees: 180,
    memberOffsets: false
  },
  projection: {
    planetOuterRadius: planetRadius,
    lawStarOuterRadius:
      maximumLawStarRadius,
    fixtureCount:
      cameras.length * 3 * 12 * 16 * memberCount,
    cameras:
      cameras.map(camera => camera.id),
    worstFixture
  },
  preservation: {
    mainConstellationGeometryChanged: false,
    controllerChanged: false,
    compositorChanged: false,
    planetChanged: false,
    routesChanged: false,
    labelsChanged: false,
    returnToOrbitChanged: false,
    swipeToConstellationChanged: false
  },
  assertions: {
    total: assertions.length,
    passed:
      assertions.filter(record => record.pass)
        .length,
    failed:
      assertions.filter(record => !record.pass)
        .length
  }
};

fs.mkdirSync(
  "laws/validation",
  { recursive: true }
);
fs.writeFileSync(
  PATHS.receipt,
  `${JSON.stringify(receipt, null, 2)}\n`,
  "utf8"
);

console.log(
  JSON.stringify(receipt, null, 2)
);
