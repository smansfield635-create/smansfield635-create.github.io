/* /laws/index.crystals.js
   Laws shared Compass-family spherical XYZ crystal loader.

   Preserves the controller-decoupled Laws crystal source byte-for-byte in
   /laws/index.crystals.source.js and applies only the settled shared
   Compass-family cluster geometry, depth hierarchy, and scale profile before
   synchronous execution.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_LAWS_CRYSTALS_SHARED_SPHERICAL_XYZ_WRAPPER_v1",
    sourceUrl:
      "./index.crystals.source.js?v=LAWS_CRYSTALS_CONTROLLER_DECOUPLED_SOURCE_v1",
    geometryModel: "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    memberCount: 4,
    horizontalRadius: 1.36,
    verticalRadius: 1.18,
    depthRadius: 1.04,
    latitudeAmplitude: 0.48,
    latitudeFrequency: 1.73,
    scaleProfile: Object.freeze({
      law: 0.68,
      primary: 0.84,
      selected: 0.91
    }),
    ownsController: false,
    ownsCompositor: false,
    ownsPlanet: false,
    ownsInteraction: false,
    ownsLawContent: false
  });

  const SCRIPT_ATTRIBUTE =
    "data-laws-shared-spherical-xyz-crystals-source";

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "held";
      root.dataset.lawsCrystalsWrapperFailure = code;
    }

    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_FAILURE =
      Object.freeze({
        contractId: CONTRACT.id,
        code,
        details
      });

    globalThis.dispatchEvent(
      new CustomEvent("DGB_LAWS_CRYSTALS_WRAPPER_FAILURE", {
        detail: globalThis.DGB_LAWS_CRYSTALS_WRAPPER_FAILURE
      })
    );

    throw error;
  }

  function loadSourceSynchronously(url) {
    const request = new XMLHttpRequest();
    request.open("GET", url, false);
    request.send(null);

    if (request.status < 200 || request.status >= 300) {
      fail(
        `LAWS_CRYSTALS_SOURCE_LOAD_FAILED:${request.status}`,
        { url }
      );
    }

    return request.responseText;
  }

  function replaceRequired(source, before, after, identity) {
    const count = source.split(before).length - 1;
    if (count !== 1) {
      fail(
        `LAWS_CRYSTALS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`,
        { expected: 1, actual: count }
      );
    }
    return source.replace(before, after);
  }

  function replaceRegexRequired(source, pattern, replacement, identity) {
    const matches = source.match(pattern);
    if (!matches || matches.length !== 1) {
      fail(
        `LAWS_CRYSTALS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`,
        { expected: 1, actual: matches ? matches.length : 0 }
      );
    }
    return source.replace(pattern, replacement);
  }

  function replaceSection(
    source,
    startMarker,
    endMarker,
    replacement,
    identity
  ) {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(
      endMarker,
      start + startMarker.length
    );

    if (
      start < 0 ||
      end < 0 ||
      source.indexOf(startMarker, start + 1) >= 0
    ) {
      fail(
        `LAWS_CRYSTALS_REQUIRED_SOURCE_SECTION_INVALID:${identity}`,
        { start, end }
      );
    }

    return (
      source.slice(0, start) +
      replacement +
      source.slice(end)
    );
  }

  function transformSource(input) {
    let source = input;

    source = replaceRegexRequired(
      source,
      /    cluster:\n      Object\.freeze\(\{[\s\S]*?\n      \}\)\n  \}\);/,
`    cluster:
      Object.freeze({
        model:
          "BOUNDED_SPHERICAL_XYZ_CLUSTER",

        memberCount:
          4,

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
          1.73,

        projectedClearanceMarginPx:
          8
      })
  });`,
      "SPHERICAL_CLUSTER_CONTRACT"
    );

    source = replaceRequired(
      source,
`    lawScale:
      0.88,

    primaryLawScale:
      1.12,

    selectedLawScale:
      1.18,`,
`    lawScale:
      0.68,

    primaryLawScale:
      0.84,

    selectedLawScale:
      0.91,`,
      "LAW_SCALE_PROFILE"
    );

    source = replaceSection(
      source,
      "  function clusterBaseVector(index, count) {",
      "\n\n  function makeNode(options) {",
`  function clusterBaseVector(index, count) {
    const safeCount =
      Math.max(
        1,
        count
      );

    invariant(
      safeCount ===
        SPHERE.cluster.memberCount,
      "LAWS_CRYSTALS_CLUSTER_MEMBER_COUNT_INVALID",
      {
        expected:
          SPHERE.cluster.memberCount,
        actual:
          safeCount
      }
    );

    const longitude =
      (
        Math.PI *
        2 *
        index
      ) /
      safeCount -
      Math.PI / 2;

    const latitude =
      Math.sin(
        (
          index +
          0.5
        ) *
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
  }

  function validateClusterSphereContract() {
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
      "LAWS_CRYSTALS_CLUSTER_SPHERE_REQUIRES_FOUR_MEMBERS"
    );

    vectors.forEach(
      (vector, index) => {
        invariant(
          Math.abs(
            vectorLength(vector) - 1
          ) <= 1e-12,
          "LAWS_CRYSTALS_CLUSTER_UNIT_VECTOR_INVALID:" + index
        );
      }
    );

    const edgeA =
      subtract(
        vectors[1],
        vectors[0]
      );
    const edgeB =
      subtract(
        vectors[2],
        vectors[0]
      );
    const edgeC =
      subtract(
        vectors[3],
        vectors[0]
      );
    const determinant =
      edgeA[0] *
        (
          edgeB[1] * edgeC[2] -
          edgeB[2] * edgeC[1]
        ) -
      edgeA[1] *
        (
          edgeB[0] * edgeC[2] -
          edgeB[2] * edgeC[0]
        ) +
      edgeA[2] *
        (
          edgeB[0] * edgeC[1] -
          edgeB[1] * edgeC[0]
        );

    invariant(
      Math.abs(determinant) > 1e-4,
      "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID",
      { determinant }
    );

    RECEIPT.clusterGeometryModel =
      SPHERE.cluster.model;
    RECEIPT.clusterMemberCount =
      SPHERE.cluster.memberCount;
    RECEIPT.clusterHorizontalRadius =
      SPHERE.cluster.horizontalRadius;
    RECEIPT.clusterVerticalRadius =
      SPHERE.cluster.verticalRadius;
    RECEIPT.clusterDepthRadius =
      SPHERE.cluster.depthRadius;
    RECEIPT.clusterLatitudeAmplitude =
      SPHERE.cluster.latitudeAmplitude;
    RECEIPT.clusterLatitudeFrequency =
      SPHERE.cluster.latitudeFrequency;
    RECEIPT.clusterNoncoplanar =
      true;
    RECEIPT.clusterFullXyzRotation =
      true;
    RECEIPT.clusterProjectedClearanceMarginPx =
      SPHERE.cluster.projectedClearanceMarginPx;

    if (state.root) {
      state.root.dataset.lawsClusterGeometryModel =
        SPHERE.cluster.model;
      state.root.dataset.lawsClusterMemberCount =
        String(SPHERE.cluster.memberCount);
      state.root.dataset.lawsClusterHorizontalRadius =
        String(SPHERE.cluster.horizontalRadius);
      state.root.dataset.lawsClusterVerticalRadius =
        String(SPHERE.cluster.verticalRadius);
      state.root.dataset.lawsClusterDepthRadius =
        String(SPHERE.cluster.depthRadius);
      state.root.dataset.lawsClusterLatitudeAmplitude =
        String(SPHERE.cluster.latitudeAmplitude);
      state.root.dataset.lawsClusterLatitudeFrequency =
        String(SPHERE.cluster.latitudeFrequency);
      state.root.dataset.lawsClusterNoncoplanar =
        "true";
      state.root.dataset.lawsClusterFullXyzRotation =
        "true";
    }

    return true;
  }`,
      "SPHERICAL_CLUSTER_VECTOR_AND_VALIDATION"
    );

    source = replaceSection(
      source,
      "  function boundClusterQuaternion(value) {",
      "\n\n  function clusterQuaternionFromFrame(",
`  function boundClusterQuaternion(value) {
    return quaternionNormalize(value);
  }`,
      "FULL_XYZ_CLUSTER_QUATERNION"
    );

    source = replaceSection(
      source,
      "  function euclideanLawPosition(",
      "\n\n  function setUniformScale(",
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
        SPHERE.cluster
          .horizontalRadius,

      y:
        unit[1] *
        SPHERE.cluster
          .verticalRadius,

      z:
        unit[2] *
        SPHERE.cluster
          .depthRadius,

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
      "SPHERICAL_LAW_POSITION"
    );

    source = replaceRequired(
      source,
`        const sphere =
          euclideanLawPosition(
            node,
            localQuaternion
          );`,
`        const sphere =
          sphericalLawPosition(
            node,
            localQuaternion
          );`,
      "SPHERICAL_CLUSTER_TARGET_CALL"
    );

    source = replaceRequired(
      source,
`        const scale =
          selected
            ? QUALITY.selectedLawScale
            : primary
              ? QUALITY.primaryLawScale
              : QUALITY.lawScale;`,
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
      "DEPTH_DERIVED_LAW_SCALE"
    );

    source = replaceRequired(
      source,
      "validateClusterOrbitContract();",
      "validateClusterSphereContract();",
      "SPHERE_VALIDATION_CALL"
    );

    const retiredTokens = [
      '"EUCLIDEAN_COMMON_RADIUS_ORBIT"',
      "SPHERE.cluster.commonRadius",
      "SPHERE.cluster.planeNormal",
      "SPHERE.cluster.maximumTiltRadians",
      "function euclideanLawPosition(",
      "validateClusterOrbitContract();"
    ];

    for (const token of retiredTokens) {
      if (source.includes(token)) {
        fail(
          "LAWS_CRYSTALS_RETIRED_CLUSTER_TOKEN_REMAINS",
          { token }
        );
      }
    }

    const requiredTokens = [
      '"BOUNDED_SPHERICAL_XYZ_CLUSTER"',
      "horizontalRadius:\n          1.36",
      "verticalRadius:\n          1.18",
      "depthRadius:\n          1.04",
      "latitudeAmplitude:\n          0.48",
      "latitudeFrequency:\n          1.73",
      "function sphericalLawPosition(",
      "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID",
      "0.68 +\n            sphere.depth *\n              0.36"
    ];

    for (const token of requiredTokens) {
      if (!source.includes(token)) {
        fail(
          "LAWS_CRYSTALS_REQUIRED_CLUSTER_TOKEN_MISSING",
          { token }
        );
      }
    }

    return source;
  }

  function install() {
    if (
      globalThis.DGB_LAWS_CRYSTALS &&
      globalThis.DGB_LAWS_CRYSTALS.initialized
    ) {
      return;
    }

    if (
      document.querySelector(
        `script[${SCRIPT_ATTRIBUTE}]`
      )
    ) {
      return;
    }

    const source =
      transformSource(
        loadSourceSynchronously(
          CONTRACT.sourceUrl
        )
      );

    const script =
      document.createElement("script");
    script.setAttribute(
      SCRIPT_ATTRIBUTE,
      "true"
    );
    script.dataset.ready = "false";
    script.textContent =
      source +
      "\n//# sourceURL=/laws/index.crystals.shared-spherical-xyz.js";
    document.head.append(script);
    script.dataset.ready = "true";

    const root =
      document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus =
        "available";
      root.dataset.lawsCrystalsWrapperContract =
        CONTRACT.id;
      root.dataset.lawsClusterGeometryModel =
        CONTRACT.geometryModel;
    }

    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT =
      Object.freeze({
        contractId:
          CONTRACT.id,
        sourceUrl:
          CONTRACT.sourceUrl,
        geometryModel:
          CONTRACT.geometryModel,
        memberCount:
          CONTRACT.memberCount,
        horizontalRadius:
          CONTRACT.horizontalRadius,
        verticalRadius:
          CONTRACT.verticalRadius,
        depthRadius:
          CONTRACT.depthRadius,
        latitudeAmplitude:
          CONTRACT.latitudeAmplitude,
        latitudeFrequency:
          CONTRACT.latitudeFrequency,
        scaleProfile:
          CONTRACT.scaleProfile,
        sourceTransformed:
          true,
        sourceExecuted:
          Boolean(
            globalThis.DGB_LAWS_CRYSTALS
          ),
        visualPassClaimed:
          false
      });

    globalThis.dispatchEvent(
      new CustomEvent(
        "DGB_LAWS_CRYSTALS_WRAPPER_READY",
        {
          detail:
            globalThis
              .DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT
        }
      )
    );
  }

  install();
})();
