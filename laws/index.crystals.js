/* /laws/index.crystals.js
   Laws shared Compass-family spherical XYZ crystal loader.

   This bounded replacement preserves the controller-decoupled source in
   /laws/index.crystals.source.js, preserves the accepted Main Compass cluster
   presentation, restores the proven double-sided Compass crystal render state,
   and makes the ordinary crystal surface opaque while retaining the separate
   translucent halo pass.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_LAWS_CRYSTALS_RENDER_CONTINUITY_AND_OPAQUE_SURFACE_v3",
    sourceUrl:
      "./index.crystals.source.js?v=LAWS_CRYSTALS_SOURCE_RENDER_CONTINUITY_20260726E",
    geometryModel: "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    presentationModel: "MAIN_COMPASS_SPHERICAL_CLUSTER_PRESENTATION",
    faceVisibilityModel: "DOUBLE_SIDED_OPAQUE_ORDINARY_SURFACE_SEPARATE_HALO",
    memberCount: 4,
    horizontalRadius: 1.36,
    verticalRadius: 1.18,
    depthRadius: 1.04,
    latitudeAmplitude: 0.48,
    latitudeFrequency: 1.73,
    scaleProfile: Object.freeze({
      law: 0.88,
      primary: 1.12,
      selected: 1.18
    }),
    depthScale: Object.freeze({
      base: 0.70,
      range: 0.38
    }),
    primaryLift: 1.14,
    selectedLift: 1.08,
    yOffset: -0.08,
    zOffset: 0.18,
    cullFaceEnabled: false,
    ordinarySurfaceOpaque: true,
    haloPassSeparate: true,
    ownsController: false,
    ownsCompositor: false,
    ownsPlanet: false,
    ownsInteraction: false,
    ownsLawContent: false
  });

  const SCRIPT_ATTRIBUTE =
    "data-laws-main-compass-presentation-crystals-source";

  function fail(code, details = null) {
    const error = new Error(code);
    error.code = code;
    error.details = details;

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "held";
      root.dataset.lawsCrystalsWrapperFailure = code;
    }

    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_FAILURE = Object.freeze({
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
      fail(`LAWS_CRYSTALS_SOURCE_LOAD_FAILED:${request.status}`, { url });
    }

    return request.responseText;
  }

  function replaceRequired(source, before, after, identity) {
    const count = source.split(before).length - 1;
    if (count !== 1) {
      fail(`LAWS_CRYSTALS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`, {
        expected: 1,
        actual: count
      });
    }
    return source.replace(before, after);
  }

  function replaceRegexRequired(source, pattern, replacement, identity) {
    const matches = source.match(pattern);
    if (!matches || matches.length !== 1) {
      fail(`LAWS_CRYSTALS_REQUIRED_SOURCE_PATTERN_INVALID:${identity}`, {
        expected: 1,
        actual: matches ? matches.length : 0
      });
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
    const end = source.indexOf(endMarker, start + startMarker.length);

    if (
      start < 0 ||
      end < 0 ||
      source.indexOf(startMarker, start + 1) >= 0
    ) {
      fail(`LAWS_CRYSTALS_REQUIRED_SOURCE_SECTION_INVALID:${identity}`, {
        start,
        end
      });
    }

    return source.slice(0, start) + replacement + source.slice(end);
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

    source = replaceSection(
      source,
      "  function updateClusterTargets(",
      "\n\n  function updateTargets() {",
`  function updateClusterTargets(
    frame,
    direction
  ) {
    const localQuaternion =
      state.clusterQuaternions
        .get(direction) ||
      [0, 0, 0, 1];

    const primaryLaw =
      nearestPrimaryLaw(
        direction,
        localQuaternion
      );

    state.visualPrimaryLaws.set(
      direction,
      primaryLaw
    );

    activeLawNodes(direction).forEach(
      node => {
        const sphere =
          sphericalLawPosition(
            node,
            localQuaternion
          );

        const selected =
          frame.state === "LAW_SELECTED" &&
          frame.selectedLaw === node.id;

        const primary =
          node.id === primaryLaw;

        node.visible = true;
        node.depthScore = sphere.depth;
        node.primaryScore = sphere.primary;

        node.material =
          selected
            ? "LAW_SELECTED"
            : primary
              ? "LAW_PRIMARY"
              : "LAW_IDLE";

        const depthScale =
          0.70 +
          sphere.depth *
            0.38;

        const primaryLift =
          primary
            ? 1.14
            : 1;

        const selectedLift =
          selected
            ? 1.08
            : 1;

        const ordinaryScale =
          (
            selected
              ? QUALITY.selectedLawScale
              : primary
                ? QUALITY.primaryLawScale
                : QUALITY.lawScale
          ) *
          depthScale *
          primaryLift *
          selectedLift;

        const prominence =
          0.30 +
          sphere.depth *
            0.48 +
          sphere.primary *
            0.28 +
          (
            selected
              ? 0.08
              : 0
          );

        const halo =
          0.20 +
          sphere.depth *
            0.30 +
          sphere.primary *
            0.44 +
          (
            selected
              ? 0.18
              : 0
          );

        const rotationSpeed =
          primary || selected
            ? 0.13
            : 0.07 +
              sphere.depth *
                0.04;

        const float =
          primary || selected
            ? 0.012
            : 0.004 +
              sphere.depth *
                0.004;

        Object.assign(
          node.target,
          setUniformScale(
            {
              x:
                sphere.x,

              y:
                sphere.y -
                0.08,

              z:
                sphere.z +
                0.18,

              prominence:
                clamp(
                  prominence,
                  0.10,
                  1.20
                ),

              halo:
                clamp(
                  halo,
                  0,
                  1.24
                ),

              rotationSpeed,

              float
            },
            ordinaryScale
          )
        );
      }
    );
  }`,
      "MAIN_COMPASS_CLUSTER_PRESENTATION"
    );

    source = replaceRequired(
      source,
`      float alpha =
        clamp(
          uAlpha *
          (
            0.70 +
            uProminence *
            0.30 +
            fresnel *
            0.08
          ),
          0.12,
          1.0
        );`,
`      float alpha =
        1.0;`,
      "OPAQUE_ORDINARY_SURFACE_ALPHA"
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
      "validateClusterOrbitContract();",
      "gl.enable(gl.CULL_FACE);",
      "gl.cullFace(gl.BACK);",
      "gl.frontFace(gl.CCW);",
      "0.68 +\n            sphere.depth *\n              0.36"
    ];

    for (const token of retiredTokens) {
      if (source.includes(token)) {
        fail("LAWS_CRYSTALS_RETIRED_RENDER_TOKEN_REMAINS", { token });
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
      "const depthScale =\n          0.70 +",
      "const primaryLift =\n          primary\n            ? 1.14",
      "const selectedLift =\n          selected\n            ? 1.08",
      "sphere.y -\n                0.08",
      "sphere.z +\n                0.18",
      "gl.disable(gl.CULL_FACE);",
      "float alpha =\n        1.0;"
    ];

    for (const token of requiredTokens) {
      if (!source.includes(token)) {
        fail("LAWS_CRYSTALS_REQUIRED_RENDER_TOKEN_MISSING", { token });
      }
    }

    return source;
  }

  function install() {
    if (
      globalThis.DGB_LAWS_CRYSTALS &&
      globalThis.DGB_LAWS_CRYSTALS.initialized
    ) return;

    if (document.querySelector(`script[${SCRIPT_ATTRIBUTE}]`)) return;

    const source = transformSource(
      loadSourceSynchronously(CONTRACT.sourceUrl)
    );

    const script = document.createElement("script");
    script.setAttribute(SCRIPT_ATTRIBUTE, "true");
    script.dataset.ready = "false";
    script.textContent =
      source +
      "\n//# sourceURL=/laws/index.crystals.render-continuity.js";
    document.head.append(script);
    script.dataset.ready = "true";

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "available";
      root.dataset.lawsCrystalsWrapperContract = CONTRACT.id;
      root.dataset.lawsClusterGeometryModel = CONTRACT.geometryModel;
      root.dataset.lawsClusterPresentationModel = CONTRACT.presentationModel;
      root.dataset.lawsCrystalFaceVisibilityModel = CONTRACT.faceVisibilityModel;
      root.dataset.lawsMainCompassClusterPresentation = "true";
      root.dataset.lawsCrystalBackFaceCulling = "false";
      root.dataset.lawsCrystalOrdinarySurfaceOpaque = "true";
      root.dataset.lawsCrystalHaloPassSeparate = "true";
    }

    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT = Object.freeze({
      contractId: CONTRACT.id,
      sourceUrl: CONTRACT.sourceUrl,
      geometryModel: CONTRACT.geometryModel,
      presentationModel: CONTRACT.presentationModel,
      faceVisibilityModel: CONTRACT.faceVisibilityModel,
      memberCount: CONTRACT.memberCount,
      horizontalRadius: CONTRACT.horizontalRadius,
      verticalRadius: CONTRACT.verticalRadius,
      depthRadius: CONTRACT.depthRadius,
      latitudeAmplitude: CONTRACT.latitudeAmplitude,
      latitudeFrequency: CONTRACT.latitudeFrequency,
      scaleProfile: CONTRACT.scaleProfile,
      depthScale: CONTRACT.depthScale,
      primaryLift: CONTRACT.primaryLift,
      selectedLift: CONTRACT.selectedLift,
      yOffset: CONTRACT.yOffset,
      zOffset: CONTRACT.zOffset,
      backFaceCullingEnabled: false,
      doubleSidedCrystalDrawing: true,
      ordinarySurfaceOpaque: true,
      haloPassSeparate: true,
      sourceTransformed: true,
      sourceExecuted: Boolean(globalThis.DGB_LAWS_CRYSTALS),
      protectedAuthoritiesChanged: false,
      visualPassClaimed: false
    });

    globalThis.dispatchEvent(
      new CustomEvent("DGB_LAWS_CRYSTALS_WRAPPER_READY", {
        detail: globalThis.DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT
      })
    );
  }

  install();
})();
