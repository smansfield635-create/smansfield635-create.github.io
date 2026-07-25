import fs from "node:fs";
import crypto from "node:crypto";

const EXPECTED_BLOBS = Object.freeze({
  "laws/index.crystals.js": "53559091d26eded7695c749797de91b1ea2ce169",
  "laws/index.interactions.source.round4.js": "6ee820886846cfe102d030389ca18ed4a13a1a23",
  "laws/index.interactions.js": "6b95c80213eedc12b0deb9ef02e172fcf2725d9d",
  "laws/index.html": "cff8306ab99a4c2d7544536a9f6a4f4b9045866f",
  "laws/index.css": "6095b12ebaab8d8263327b95dcbf0c8eab1039eb"
});

function gitBlobSha(content) {
  const bytes = Buffer.from(content, "utf8");
  return crypto
    .createHash("sha1")
    .update(`blob ${bytes.length}\0`)
    .update(bytes)
    .digest("hex");
}

function readWithCustody(path) {
  const content = fs.readFileSync(path, "utf8");
  const actual = gitBlobSha(content);
  const expected = EXPECTED_BLOBS[path];
  if (actual !== expected) {
    throw new Error(
      `SOURCE_CUSTODY_MISMATCH:${path}:expected=${expected}:actual=${actual}`
    );
  }
  return content;
}

function occurrenceCount(source, token) {
  return source.split(token).length - 1;
}

function replaceExact(source, before, after, label) {
  const count = occurrenceCount(source, before);
  if (count !== 1) {
    throw new Error(`TRANSFORM_ANCHOR_COUNT_INVALID:${label}:${count}`);
  }
  return source.replace(before, after);
}

function replaceRegex(source, pattern, replacement, label) {
  const matches = source.match(pattern);
  if (!matches || matches.length !== 1) {
    throw new Error(
      `TRANSFORM_REGEX_ANCHOR_INVALID:${label}:${matches ? matches.length : 0}`
    );
  }
  return source.replace(pattern, replacement);
}

function write(path, content) {
  fs.writeFileSync(path, content, "utf8");
}

let crystals = readWithCustody("laws/index.crystals.js");

crystals = replaceExact(
  crystals,
`    cluster:
      Object.freeze({
        horizontalRadius:
          1.36,

        verticalRadius:
          1.18,

        depthRadius:
          1.04,

        primaryAnchor:
          Object.freeze([
            0,
            0.70,
            0.714
          ]),

        latitudeAmplitude:
          0.48,

        latitudeFrequency:
          1.73
      })`,
`    cluster:
      Object.freeze({
        model:
          "EUCLIDEAN_COMMON_RADIUS_ORBIT",

        memberCount:
          4,

        commonRadius:
          1.40,

        phase:
          -Math.PI / 2,

        localPlane:
          "XY",

        planeNormal:
          Object.freeze([
            0,
            0,
            1
          ]),

        maximumTiltRadians:
          0.30,

        projectedClearanceMarginPx:
          8,

        primaryAnchor:
          Object.freeze([
            0,
            0.70,
            0.714
          ])
      })`,
  "crystals-cluster-contract"
);

crystals = replaceExact(
  crystals,
`  function clusterBaseVector(index, count) {
    const safeCount =
      Math.max(1, count);

    const longitude =
      (Math.PI * 2 * index) /
        safeCount -
      Math.PI / 2;

    const latitude =
      Math.sin(
        (index + 0.5) *
        SPHERE.cluster
          .latitudeFrequency
      ) *
      SPHERE.cluster
        .latitudeAmplitude;

    const cosineLatitude =
      Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) *
        cosineLatitude,

      Math.sin(latitude),

      Math.sin(longitude) *
        cosineLatitude
    ]);
  }`,
`  function clusterBaseVector(index, count) {
    invariant(
      count === SPHERE.cluster.memberCount,
      "LAWS_CRYSTALS_CLUSTER_MEMBER_COUNT_INVALID",
      {
        expected:
          SPHERE.cluster.memberCount,

        actual:
          count
      }
    );

    const angle =
      SPHERE.cluster.phase +
      index *
        Math.PI * 2 /
        SPHERE.cluster.memberCount;

    return [
      Math.cos(angle),
      Math.sin(angle),
      0
    ];
  }

  function validateClusterOrbitContract() {
    const vectors =
      Array.from(
        {
          length:
            SPHERE.cluster.memberCount
        },
        (_, index) =>
          clusterBaseVector(
            index,
            SPHERE.cluster.memberCount
          )
      );

    invariant(
      vectors.length === 4,
      "LAWS_CRYSTALS_CLUSTER_ORBIT_REQUIRES_FOUR_MEMBERS"
    );

    vectors.forEach(
      (vector, index) => {
        invariant(
          Math.abs(
            vectorLength(vector) - 1
          ) <= 1e-12,
          `LAWS_CRYSTALS_CLUSTER_UNIT_RADIUS_INVALID:${index}`
        );

        invariant(
          Math.abs(vector[2]) <= 1e-12,
          `LAWS_CRYSTALS_CLUSTER_COPLANARITY_INVALID:${index}`
        );
      }
    );

    for (let index = 0; index < 4; index += 1) {
      const adjacent =
        vectors[(index + 1) % 4];
      const opposite =
        vectors[(index + 2) % 4];

      invariant(
        Math.abs(
          dot(vectors[index], adjacent)
        ) <= 1e-12,
        `LAWS_CRYSTALS_CLUSTER_90_DEGREE_SPACING_INVALID:${index}`
      );

      invariant(
        Math.abs(
          dot(vectors[index], opposite) + 1
        ) <= 1e-12,
        `LAWS_CRYSTALS_CLUSTER_180_DEGREE_SPACING_INVALID:${index}`
      );
    }

    RECEIPT.clusterOrbitModel =
      SPHERE.cluster.model;
    RECEIPT.clusterOrbitMemberCount =
      SPHERE.cluster.memberCount;
    RECEIPT.clusterOrbitCommonRadius =
      SPHERE.cluster.commonRadius;
    RECEIPT.clusterOrbitCoplanar =
      true;
    RECEIPT.clusterOrbitEqualAngularSpacing =
      true;
    RECEIPT.clusterOrbitMaximumTiltRadians =
      SPHERE.cluster.maximumTiltRadians;
    RECEIPT.clusterProjectedClearanceMarginPx =
      SPHERE.cluster.projectedClearanceMarginPx;

    if (state.root) {
      state.root.dataset.lawsClusterOrbitModel =
        SPHERE.cluster.model;
      state.root.dataset.lawsClusterOrbitMemberCount =
        String(SPHERE.cluster.memberCount);
      state.root.dataset.lawsClusterOrbitCommonRadius =
        String(SPHERE.cluster.commonRadius);
      state.root.dataset.lawsClusterOrbitCoplanar =
        "true";
      state.root.dataset.lawsClusterOrbitEqualAngularSpacing =
        "true";
      state.root.dataset.lawsClusterOrbitMaximumTiltRadians =
        String(SPHERE.cluster.maximumTiltRadians);
    }

    return true;
  }`,
  "crystals-cluster-base-vector"
);

crystals = replaceExact(
  crystals,
`  function clusterQuaternionFromFrame(
    frame,
    direction
  ) {
    const fallback =
      state.clusterTargetQuaternions
        .get(direction) ||
      [0, 0, 0, 1];

    if (
      frame &&
      frame.cluster &&
      frame.cluster.direction === direction &&
      frame.cluster.orientation
    ) {
      return orientationQuaternion(
        frame.cluster.orientation,
        fallback
      );
    }

    return fallback.slice();
  }`,
`  function quaternionFromAxisAngleVector(
    axis,
    angle
  ) {
    const normalizedAxis =
      normalizeVector(
        axis,
        [1, 0, 0]
      );
    const half =
      angle * 0.5;
    const sine =
      Math.sin(half);

    return quaternionNormalize([
      normalizedAxis[0] * sine,
      normalizedAxis[1] * sine,
      normalizedAxis[2] * sine,
      Math.cos(half)
    ]);
  }

  function boundClusterQuaternion(value) {
    const quaternion =
      quaternionNormalize(value);
    const normal =
      normalizeVector(
        quaternionRotateVector(
          quaternion,
          SPHERE.cluster.planeNormal
        ),
        SPHERE.cluster.planeNormal
      );
    const tilt =
      Math.acos(
        clamp(
          normal[2],
          -1,
          1
        )
      );

    if (
      tilt <=
      SPHERE.cluster.maximumTiltRadians +
        1e-12
    ) {
      return quaternion;
    }

    const swingAxis =
      normalizeVector(
        [
          -normal[1],
          normal[0],
          0
        ],
        [1, 0, 0]
      );
    const swing =
      quaternionFromAxisAngleVector(
        swingAxis,
        SPHERE.cluster.maximumTiltRadians
      );
    const twistLength =
      Math.hypot(
        quaternion[2],
        quaternion[3]
      );
    const twist =
      twistLength > 1e-12
        ? quaternionNormalize([
            0,
            0,
            quaternion[2],
            quaternion[3]
          ])
        : [0, 0, 0, 1];

    return quaternionMultiply(
      swing,
      twist
    );
  }

  function clusterQuaternionFromFrame(
    frame,
    direction
  ) {
    const fallback =
      state.clusterTargetQuaternions
        .get(direction) ||
      [0, 0, 0, 1];

    if (
      frame &&
      frame.cluster &&
      frame.cluster.direction === direction &&
      frame.cluster.orientation
    ) {
      return boundClusterQuaternion(
        orientationQuaternion(
          frame.cluster.orientation,
          fallback
        )
      );
    }

    return boundClusterQuaternion(
      fallback
    );
  }`,
  "crystals-bounded-cluster-quaternion"
);

crystals = replaceExact(
  crystals,
`  function sphericalLawPosition(
    node,
    localQuaternion
  ) {
    const unit =
      rotatedLawUnitVector(
        node,
        localQuaternion
      );

    return {
      x:
        unit[0] *
          SPHERE.cluster.horizontalRadius,

      y:
        unit[1] *
          SPHERE.cluster.verticalRadius,

      z:
        unit[2] *
          SPHERE.cluster.depthRadius,

      depth:
        (unit[2] + 1) / 2,

      primary:
        clamp(
          (
            dot(
              unit,
              clusterAnchorVector()
            ) +
            1
          ) /
            2,
          0,
          1
        )
    };
  }`,
`  function euclideanLawPosition(
    node,
    localQuaternion
  ) {
    const unit =
      rotatedLawUnitVector(
        node,
        boundClusterQuaternion(
          localQuaternion
        )
      );
    const radius =
      SPHERE.cluster.commonRadius;

    return {
      x:
        unit[0] * radius,

      y:
        unit[1] * radius,

      z:
        unit[2] * radius,

      depth:
        (unit[2] + 1) / 2,

      primary:
        clamp(
          (
            dot(
              unit,
              clusterAnchorVector()
            ) +
            1
          ) /
            2,
          0,
          1
        )
    };
  }`,
  "crystals-euclidean-law-position"
);

crystals = replaceExact(
  crystals,
`        const sphere =
          sphericalLawPosition(
            node,
            localQuaternion
          );`,
`        const sphere =
          euclideanLawPosition(
            node,
            localQuaternion
          );`,
  "crystals-euclidean-law-position-call"
);

crystals = replaceExact(
  crystals,
`        const scale =
          (
            selected
              ? QUALITY.selectedLawScale
              : primary
                ? QUALITY.primaryLawScale
                : QUALITY.lawScale
          ) *
          (
            0.68 +
            sphere.depth *
              0.36
          );`,
`        const scale =
          selected
            ? QUALITY.selectedLawScale
            : primary
              ? QUALITY.primaryLawScale
              : QUALITY.lawScale;`,
  "crystals-remove-depth-scale"
);

crystals = replaceExact(
  crystals,
`      state.registry =
        buildRegistry();`,
`      state.registry =
        buildRegistry();

      validateClusterOrbitContract();`,
  "crystals-runtime-orbit-validation"
);

crystals = replaceExact(
  crystals,
`        sphere:
          SPHERE,

        nodeTypes:`,
`        sphere:
          SPHERE,

        clusterOrbit:
          SPHERE.cluster,

        getClusterOrbitContract:
          () => Object.freeze({
            ...SPHERE.cluster,
            planeNormal:
              Object.freeze(
                SPHERE.cluster
                  .planeNormal
                  .slice()
              )
          }),

        nodeTypes:`,
  "crystals-api-orbit-contract"
);

write("laws/index.crystals.js", crystals);

let interactions =
  readWithCustody(
    "laws/index.interactions.source.round4.js"
  );

const priorInteractionVersion =
  "1.0.1-pointer-gesture-interpreter-category-admission-tune";
const nextInteractionVersion =
  "1.1.0-euclidean-orbit-direct-manipulation";
const versionCount =
  occurrenceCount(
    interactions,
    priorInteractionVersion
  );
if (versionCount < 1) {
  throw new Error(
    "INTERACTION_VERSION_ANCHOR_MISSING"
  );
}
interactions =
  interactions
    .split(priorInteractionVersion)
    .join(nextInteractionVersion);

interactions = replaceExact(
  interactions,
`    maximumGrabCorrectionAngle:
      0.12,

    reducedMotionMultiplier:`,
`    maximumGrabCorrectionAngle:
      0.12,

    clusterMaximumTiltRadians:
      0.30,

    reducedMotionMultiplier:`,
  "interactions-cluster-tilt-contract"
);

interactions = replaceExact(
  interactions,
`    return quaternionFromAxisAngle(
      dy,
      dx,
      0,
      angle
    );`,
`    return quaternionFromAxisAngle(
      dy,
      -dx,
      0,
      angle
    );`,
  "interactions-negative-horizontal-yaw"
);

interactions = replaceExact(
  interactions,
`  function applyWorldSpaceDelta(
    currentQuaternion,
    deltaQuaternion
  ) {
    return quaternionMultiply(
      deltaQuaternion,
      currentQuaternion
    );
  }`,
`  function applyWorldSpaceDelta(
    currentQuaternion,
    deltaQuaternion
  ) {
    return quaternionMultiply(
      deltaQuaternion,
      currentQuaternion
    );
  }

  function constrainClusterQuaternion(value) {
    const quaternion =
      normalizeQuaternion(value);
    const normalX =
      2 *
      (
        quaternion[0] * quaternion[2] +
        quaternion[3] * quaternion[1]
      );
    const normalY =
      2 *
      (
        quaternion[1] * quaternion[2] -
        quaternion[3] * quaternion[0]
      );
    const normalZ =
      1 -
      2 *
      (
        quaternion[0] * quaternion[0] +
        quaternion[1] * quaternion[1]
      );
    const tilt =
      Math.acos(
        clamp(
          normalZ,
          -1,
          1
        )
      );

    if (
      tilt <=
      MOTION.clusterMaximumTiltRadians +
        1e-12
    ) {
      return quaternion;
    }

    const swing =
      quaternionFromAxisAngle(
        -normalY,
        normalX,
        0,
        MOTION.clusterMaximumTiltRadians
      );
    const twistLength =
      Math.hypot(
        quaternion[2],
        quaternion[3]
      );
    const twist =
      twistLength > 1e-12
        ? normalizeQuaternion([
            0,
            0,
            quaternion[2],
            quaternion[3]
          ])
        : Array.from(
            QUATERNION.identity
          );

    return quaternionMultiply(
      swing,
      twist
    );
  }`,
  "interactions-cluster-quaternion-bound"
);

interactions = replaceRegex(
  interactions,
/(  function buildIncrementalQuaternion\([\s\S]*?)    return normalizeQuaternion\(\n      result\n    \);\n  \}/,
`$1    const normalized =
      normalizeQuaternion(
        result
      );

    return activePresentationMode() ===
      PRESENTATION_MODES.CLUSTER
      ? constrainClusterQuaternion(
          normalized
        )
      : normalized;
  }`,
  "interactions-bounded-incremental-result"
);

write(
  "laws/index.interactions.source.round4.js",
  interactions
);

let wrapper =
  readWithCustody(
    "laws/index.interactions.js"
  );

wrapper = replaceExact(
  wrapper,
  '    "LAWS_COMPASS_FAMILY_CONTRAST_DISCLOSURE_LABELS_v3";',
  '    "LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4";',
  "interaction-wrapper-build"
);

wrapper = replaceExact(
  wrapper,
`      releaseSettlement: true,
      projectedConstellationLabels:`,
`      releaseSettlement: true,
      horizontalDragYawSign: "NEGATIVE",
      clusterMaximumTiltRadians: 0.30,
      euclideanClusterOrbitRequired: true,
      projectedConstellationLabels:`,
  "interaction-wrapper-receipt"
);

write("laws/index.interactions.js", wrapper);

let html = readWithCustody("laws/index.html");

html = replaceExact(
  html,
  "/laws/index.css?v=LAWS_COMPASS_FAMILY_CONTRAST_DISCLOSURES_v3",
  "/laws/index.css?v=LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4",
  "html-css-cache-identity"
);

html = replaceExact(
  html,
  "/laws/index.crystals.js?v=LAWS_COMPASS_FAMILY_ORBITAL_CONTRAST_v2",
  "/laws/index.crystals.js?v=LAWS_COMPASS_EUCLIDEAN_COMMON_RADIUS_ORBIT_v3",
  "html-crystals-cache-identity"
);

html = replaceExact(
  html,
  "/laws/index.interactions.js?v=LAWS_COMPASS_FAMILY_CONTRAST_DISCLOSURE_LABELS_v3",
  "/laws/index.interactions.js?v=LAWS_COMPASS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_v4",
  "html-interactions-cache-identity"
);

html = replaceExact(
  html,
`  data-compass-controller-navigation-authority="true"
>`,
`  data-compass-controller-navigation-authority="true"

  data-laws-cluster-orbit-model="euclidean-common-radius-coplanar"
  data-laws-cluster-orbit-member-count="4"
  data-laws-cluster-orbit-common-radius="1.40"
  data-laws-cluster-orbit-maximum-tilt-radians="0.30"
  data-laws-horizontal-drag-yaw-sign="negative"
>`,
  "html-orbit-contract-metadata"
);

write("laws/index.html", html);

let css = readWithCustody("laws/index.css");

const cssOverride = `

/* ============================================================
   24. EUCLIDEAN CLUSTER ORBIT CORRECTION
   ============================================================ */

/*
  The former field ellipse was atmospheric scenery and was not generated
  from the four law-star positions. It is suppressed while a law cluster
  is active so no decorative curve is presented as the governing orbit.
*/
[data-laws-root][data-laws-presentation-mode="CLUSTER"]
  .laws-orbit__field::after,
[data-laws-root][data-laws-presentation-mode="CLUSTER"]
  [data-laws-scene-field]::after {
  content: none;
  display: none;
}
`;

if (css.includes("EUCLIDEAN CLUSTER ORBIT CORRECTION")) {
  throw new Error(
    "CSS_EUCLIDEAN_ORBIT_OVERRIDE_ALREADY_PRESENT"
  );
}
css += cssOverride;
write("laws/index.css", css);

const transformed = Object.keys(EXPECTED_BLOBS);
for (const path of transformed) {
  const next = fs.readFileSync(path, "utf8");
  const nextSha = gitBlobSha(next);
  if (nextSha === EXPECTED_BLOBS[path]) {
    throw new Error(
      `TRANSFORM_DID_NOT_CHANGE_SOURCE:${path}`
    );
  }
}

console.log(
  JSON.stringify(
    {
      status: "PASS",
      transformation:
        "LAWS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION",
      sourceCustodyVerified: true,
      changedPaths: transformed
    },
    null,
    2
  )
);
