/* /laws/index.crystals.js
   Laws Compass bounded living-crystal continuity loader.

   This complete replacement preserves the accepted spherical X/Y/Z category
   and law-cluster positions and the clean single-surface crystal body, while
   restoring the shared Main Compass / ARCHCOIN autonomous facet rotation.
   Scale amplification, full-mesh halo duplication, and float drift remain
   excluded so the prior cavity/ghost regression cannot return through those
   mechanisms.
*/
(() => {
  "use strict";

  const CONTRACT = Object.freeze({
    id: "DGB_LAWS_CRYSTALS_LIVING_CONTINUITY_v5",
    sourceUrl:
      "./index.crystals.source.js?v=LAWS_CRYSTALS_SOURCE_LIVING_CONTINUITY_20260726G",
    geometryModel: "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    presentationModel: "SHARED_AUTONOMOUS_FACET_ROTATION_FIXED_GEOMETRY",
    faceVisibilityModel: "DOUBLE_SIDED_OPAQUE_SINGLE_SURFACE_PASS",
    categoryScale: 0.96,
    lawScale: 0.88,
    memberCount: 4,
    horizontalRadius: 1.36,
    verticalRadius: 1.18,
    depthRadius: 1.04,
    latitudeAmplitude: 0.48,
    latitudeFrequency: 1.73,
    cullFaceEnabled: false,
    ordinarySurfaceOpaque: true,
    haloPassEnabled: false,
    autonomousCrystalRotationEnabled: true,
    crystalFloatEnabled: false,
    depthBasedGeometryScaleEnabled: false,
    primaryGeometryScaleLiftEnabled: false,
    selectedGeometryScaleLiftEnabled: false,
    ownsController: false,
    ownsCompositor: false,
    ownsPlanet: false,
    ownsInteraction: false,
    ownsLawContent: false
  });

  const SCRIPT_ATTRIBUTE =
    "data-laws-living-continuity-crystals-source";

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
    const safeCount = Math.max(1, count);

    invariant(
      safeCount === SPHERE.cluster.memberCount,
      "LAWS_CRYSTALS_CLUSTER_MEMBER_COUNT_INVALID",
      {
        expected: SPHERE.cluster.memberCount,
        actual: safeCount
      }
    );

    const longitude =
      (Math.PI * 2 * index) / safeCount -
      Math.PI / 2;

    const latitude =
      Math.sin(
        (index + 0.5) *
        SPHERE.cluster.latitudeFrequency
      ) *
      SPHERE.cluster.latitudeAmplitude;

    const cosineLatitude = Math.cos(latitude);

    return normalizeVector([
      Math.cos(longitude) * cosineLatitude,
      Math.sin(latitude),
      Math.sin(longitude) * cosineLatitude
    ]);
  }

  function validateClusterSphereContract() {
    const vectors = Array.from(
      { length: SPHERE.cluster.memberCount },
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

    vectors.forEach((vector, index) => {
      invariant(
        Math.abs(vectorLength(vector) - 1) <= 1e-12,
        "LAWS_CRYSTALS_CLUSTER_UNIT_VECTOR_INVALID:" + index
      );
    });

    const edgeA = subtract(vectors[1], vectors[0]);
    const edgeB = subtract(vectors[2], vectors[0]);
    const edgeC = subtract(vectors[3], vectors[0]);

    const determinant =
      edgeA[0] *
        (edgeB[1] * edgeC[2] - edgeB[2] * edgeC[1]) -
      edgeA[1] *
        (edgeB[0] * edgeC[2] - edgeB[2] * edgeC[0]) +
      edgeA[2] *
        (edgeB[0] * edgeC[1] - edgeB[1] * edgeC[0]);

    invariant(
      Math.abs(determinant) > 1e-4,
      "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID",
      { determinant }
    );

    RECEIPT.clusterGeometryModel = SPHERE.cluster.model;
    RECEIPT.clusterMemberCount = SPHERE.cluster.memberCount;
    RECEIPT.clusterHorizontalRadius = SPHERE.cluster.horizontalRadius;
    RECEIPT.clusterVerticalRadius = SPHERE.cluster.verticalRadius;
    RECEIPT.clusterDepthRadius = SPHERE.cluster.depthRadius;
    RECEIPT.clusterLatitudeAmplitude = SPHERE.cluster.latitudeAmplitude;
    RECEIPT.clusterLatitudeFrequency = SPHERE.cluster.latitudeFrequency;
    RECEIPT.clusterNoncoplanar = true;
    RECEIPT.clusterFullXyzRotation = true;
    RECEIPT.clusterProjectedClearanceMarginPx =
      SPHERE.cluster.projectedClearanceMarginPx;

    if (state.root) {
      state.root.dataset.lawsClusterGeometryModel = SPHERE.cluster.model;
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
      state.root.dataset.lawsClusterNoncoplanar = "true";
      state.root.dataset.lawsClusterFullXyzRotation = "true";
    }

    return true;
  }`,
      "SPHERICAL_CLUSTER_VECTOR_AND_VALIDATION"
    );

    source = replaceSection(
      source,
      "  function boundClusterQuaternion = "true";
      state.root.dataset.lawsClusterFullXyzFrame(",
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
    const unit = rotatedLawUnitVector(
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
          (dot(unit, clusterAnchorVector()) + 1) / 2,
          0,
          1
        )
    };
  }`,
      "SPHERICAL_LAW_POSITION"
    );

    source = replaceSection(
      source,
      "  function updateConstellationTargets() {",
      "\n\n  function updateClusterTargets(",
`  function updateConstellationTargets() {
    state.visualPrimaryDirection =
      nearestPrimaryDirection();

    DIRECTIONS.forEach );

    source = replaceSection(
      source,
      "  function updateConstellationTargets() {",
      "\n\n  function updateClusterTargets(",
`  function updateConstellationTargets() {
    state.visualPrimaryDirection =
      nearestPrimaryDirection();

    DIRECTIONS.forEach(direction => {
      const node = state.registry.get(direction);
      const sphere = sphericalCategoryPosition(direction);
      const primary =
        direction === state.visualPrimaryDirection;

      node.visible = true;
      node.depthScore = sphere.depth;
      node.primaryScore = sphere.primary;
      node.material =
        primary
          ? "CATEGORY_FOCUSED"
          : "CATEGORY_IDLE";

      Object.assign(
        node.target,
        setUniformScale(
          {
            x: sphere.x,
            y: sphere.y,
            z: sphere.z,
            prominence: primary ? 0.90 : 0.78,
            halo: 0,
            rotationSpeed:
              primary
                ? 0.15
                : 0.08 + sphere.depth * 0.05,
            float: 0
          },
          QUALITY.categoryScale
        )
      );
    });
  }`,
      "LIVING_CONSTELLATION_PRESENTATION"
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
      state.clusterQuaternions.get(direction) ||
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

    activeLawNodes(direction).forEach(node => {
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

      Object.assign(
        node.target,
        setUniformScale(
          {
            x: sphere.x,
            y: sphere.y - 0.08,
            z: sphere.z + 0.18,
            prominence:
              selected
                ? 0.92
                : primary
                  ? 0.86
                  : 0.76,
            halo: 0,
            rotationSpeed:
              primary || selected
                ? 0.13
                : 0.07 + sphere.depth * 0.04,
            float: 0
          },
          QUALITY.lawScale
        )
      );
    });
  }`,
      "LIVING_CLUSTER_PRESENTATION"
    );

    source = replaceSection(
      source,
      "  function nodeFloatY(node) {",
      "\n\n  function modelMatrix(",
`  function nodeFloatY(node) {
    return 0;
  }`,
      "NO_CRYSTAL_FLOAT"
    );

    source = replaceSection(
      source,
      "  function drawCrystalNodes(",
      "\n\n  function projectedRadiusForNode(",
`  function drawCrystalNodes(
    renderer,
    nodes
  ) {
    const gl = renderer.gl;

    const layer =
      renderer.id === DEPTH_LAYERS.REAR
        ? state.compositor.getRearLayer()
        : state.compositor.getFrontLayer();

    gl.viewport(
      0,
      0,
      layer.width,
      layer.height
    );

    gl.clearColor(0, 0, 0, 0);
    gl.clear(
      gl.COLOR_BUFFER_BIT |
      gl.DEPTH_BUFFER_BIT
    );

    configureSharedUniforms(renderer);

    gl.depthMask(true);
    gl.blendFunc(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA
    );

    let drawCalls = 0;

    nodes.forEach(node => {
      drawCalls += drawNode(
        renderer,
        node,
        false
      );
    });

    const error = gl.getError();

    invariant(
      error === gl.NO_ERROR,
      "LAWS_CRYSTALS_" + renderer.id + "_DRAW_FAILURE",
      { error }
    );

    return Object.freeze({
      drawCalls,
      visibleNodeCount: nodes.length
    });
  }`,
      "SINGLE_SURFACE_RENDER_PASS"
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
      "drawNode(\n              renderer,\n              node,\n              true",
      "sphere.depth *\n             0.42",
      "QUALITY.focusedCategoryScale",
      "QUALITY.primaryLawScale",
      "QUALITY.selectedLawScale"
    ];

    for (const token of retiredTokens) {
      if (source.includes(token)) {
        fail("LAWS_CRYSTALS_RETIRED_VARIANCE_TOKEN_REMAINS", { token });
      }
    }

    const requiredTokens = [
      '"BOUNDED_SPHERICAL_XYZ_CLUSTER"',
      "horizontalRadius:\n          1.36",
      "verticalRadius:\n          1.18",
      "depthRadius:\n          1.04",
      "function sphericalLawPosition(",
      "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID",
      "QUALITY.categoryScale",
      "QUALITY.lawScale",
      "rotationSpeed:\n              primary",
      "0.08 + sphere.depth * 0.05",
      "0.07 + sphere.depth * 0.04",
      "node.transform.rz +=",
      "QUALITY.maximumYaw",
      "QUALITY.maximumPitch",
      "function nodeFloatY(node) {\n    return 0;",
      "gl.disable(gl.CULL_FACE);",
      "float alpha =\n        1.0;"
    ];

    for (const token of requiredTokens) {
      if (!source.includes(token)) {
        fail("LAWS_CRYSTALS_REQUIRED_CONTINUITY_TOKEN_MISSING", { token });
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
      "\n//# sourceURL=/laws/index.crystals.living-continuity.js";
    document.head.append(script);
    script.dataset.ready = "true";

    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "available";
      root.dataset.lawsCrystalsWrapperContract = CONTRACT.id;
      root.dataset.lawsClusterGeometryModel = CONTRACT.geometryModel;
      root.dataset.lawsClusterPresentationModel = CONTRACT.presentationModel;
      root.dataset.lawsCrystalFaceVisibilityModel = CONTRACT.faceVisibilityModel;
      root.dataset.lawsCrystalBackFaceCulling = "false";
      root.dataset.lawsCrystalOrdinarySurfaceOpaque = "true";
      root.dataset.lawsCrystalHaloPassEnabled = "false";
      root.dataset.lawsCrystalAutonomousRotationEnabled = "true";
      root.dataset.lawsCrystalFloatEnabled = "false";
      root.dataset.lawsCrystalDepthScaleEnabled = "false";
      root.dataset.lawsCrystalPrimaryScaleLiftEnabled = "false";
      root.dataset.lawsCrystalSelectedScaleLiftEnabled = "false";
      root.dataset.lawsCrystalLivingContinuity = "true";
    }

    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT = Object.freeze({
      contractId: CONTRACT.id,
      sourceUrl: CONTRACT.sourceUrl,
      geometryModel: CONTRACT.geometryModel,
      presentationModel: CONTRACT.presentationModel,
      faceVisibilityModel: CONTRACT.faceVisibilityModel,
      categoryScale: CONTRACT.categoryScale,
      lawScale: CONTRACT.lawScale,
      memberCount: CONTRACT.memberCount,
      horizontalRadius: CONTRACT.horizontalRadius,
      verticalRadius: CONTRACT.verticalRadius,
      depthRadius: CONTRACT.depthRadius,
      latitudeAmplitude: CONTRACT.latitudeAmplitude,
      latitudeFrequency: CONTRACT.latitudeFrequency,
      backFaceCullingEnabled: false,
      doubleSidedCrystalDrawing: true,
      ordinarySurfaceOpaque: true,
      haloPassEnabled: false,
      autonomousCrystalRotationEnabled: true,
      crystalFloatEnabled: false,
      depthBasedGeometryScaleEnabled: false,
      primaryGeometryScaleLiftEnabled: false,
      selectedGeometryScaleLiftEnabled: false,
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
