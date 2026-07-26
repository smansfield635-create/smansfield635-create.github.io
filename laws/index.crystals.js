/* /laws/index.crystals.js · Laws living-crystal continuity */
(() => {
  "use strict";
  const C = Object.freeze({
    id: "DGB_LAWS_CRYSTALS_LIVING_CONTINUITY_v5",
    sourceUrl: "./index.crystals.source.js?v=LAWS_CRYSTALS_SOURCE_LIVING_CONTINUITY_20260726G",
    geometryModel: "BOUNDED_SPHERICAL_XYZ_CLUSTER",
    presentationModel: "SHARED_AUTONOMOUS_FACET_ROTATION_FIXED_GEOMETRY",
    faceVisibilityModel: "DOUBLE_SIDED_OPAQUE_SINGLE_SURFACE_PASS"
  });
  const A = "data-laws-living-continuity-crystals-source";
  function fail(code, details = null) {
    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "held";
      root.dataset.lawsCrystalsWrapperFailure = code;
    }
    const detail = Object.freeze({ contractId: C.id, code, details });
    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_FAILURE = detail;
    globalThis.dispatchEvent(new CustomEvent("DGB_LAWS_CRYSTALS_WRAPPER_FAILURE", { detail }));
    const error = new Error(code); error.code = code; error.details = details; throw error;
  }
  function load(url) {
    const request = new XMLHttpRequest(); request.open("GET", url, false); request.send(null);
    if (request.status < 200 || request.status >= 300) fail(`LAWS_CRYSTALS_SOURCE_LOAD_FAILED:${request.status}`, { url });
    return request.responseText;
  }
  function one(source, before, after, id) {
    const count = source.split(before).length - 1;
    if (count !== 1) fail(`LAWS_CRYSTALS_PATTERN_INVALID:${id}`, { count });
    return source.replace(before, after);
  }
  function regex(source, pattern, after, id) {
    const matches = source.match(pattern);
    if (!matches || matches.length !== 1) fail(`LAWS_CRYSTALS_PATTERN_INVALID:${id}`, { count: matches ? matches.length : 0 });
    return source.replace(pattern, after);
  }
  function section(source, startMarker, endMarker, replacement, id) {
    const start = source.indexOf(startMarker);
    const end = source.indexOf(endMarker, start + startMarker.length);
    if (start < 0 || end < 0 || source.indexOf(startMarker, start + 1) >= 0) fail(`LAWS_CRYSTALS_SECTION_INVALID:${id}`, { start, end });
    return source.slice(0, start) + replacement + source.slice(end);
  }
  function transform(input) {
    let source = input;
    source = regex(source, /    cluster:\n      Object\.freeze\(\{[\s\S]*?\n      \}\)\n  \}\);/, `    cluster:
      Object.freeze({
        model: "BOUNDED_SPHERICAL_XYZ_CLUSTER",
        memberCount: 4,
        horizontalRadius: 1.36,
        verticalRadius: 1.18,
        depthRadius: 1.04,
        primaryAnchor: Object.freeze([0, 0.70, 0.714]),
        latitudeAmplitude: 0.48,
        latitudeFrequency: 1.73,
        projectedClearanceMarginPx: 8
      })
  });`, "sphere-contract");
    source = section(source, "  function clusterBaseVector(index, count) {", "\n\n  function makeNode(options) {", `  function clusterBaseVector(index, count) {
    const safeCount = Math.max(1, count);
    invariant(safeCount === SPHERE.cluster.memberCount, "LAWS_CRYSTALS_CLUSTER_MEMBER_COUNT_INVALID");
    const longitude = Math.PI * 2 * index / safeCount - Math.PI / 2;
    const latitude = Math.sin((index + 0.5) * SPHERE.cluster.latitudeFrequency) * SPHERE.cluster.latitudeAmplitude;
    const cosine = Math.cos(latitude);
    return normalizeVector([Math.cos(longitude) * cosine, Math.sin(latitude), Math.sin(longitude) * cosine]);
  }

  function validateClusterSphereContract() {
    const vectors = Array.from({ length: SPHERE.cluster.memberCount }, (_, index) => clusterBaseVector(index, SPHERE.cluster.memberCount));
    invariant(vectors.length === 4, "LAWS_CRYSTALS_CLUSTER_SPHERE_REQUIRES_FOUR_MEMBERS");
    vectors.forEach((vector, index) => invariant(Math.abs(vectorLength(vector) - 1) <= 1e-12, "LAWS_CRYSTALS_CLUSTER_UNIT_VECTOR_INVALID:" + index));
    const a = subtract(vectors[1], vectors[0]);
    const b = subtract(vectors[2], vectors[0]);
    const c = subtract(vectors[3], vectors[0]);
    const determinant = a[0] * (b[1] * c[2] - b[2] * c[1]) - a[1] * (b[0] * c[2] - b[2] * c[0]) + a[2] * (b[0] * c[1] - b[1] * c[0]);
    invariant(Math.abs(determinant) > 1e-4, "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID", { determinant });
    RECEIPT.clusterGeometryModel = SPHERE.cluster.model;
    RECEIPT.clusterMemberCount = SPHERE.cluster.memberCount;
    RECEIPT.clusterHorizontalRadius = SPHERE.cluster.horizontalRadius;
    RECEIPT.clusterVerticalRadius = SPHERE.cluster.verticalRadius;
    RECEIPT.clusterDepthRadius = SPHERE.cluster.depthRadius;
    RECEIPT.clusterLatitudeAmplitude = SPHERE.cluster.latitudeAmplitude;
    RECEIPT.clusterLatitudeFrequency = SPHERE.cluster.latitudeFrequency;
    RECEIPT.clusterNoncoplanar = true;
    RECEIPT.clusterFullXyzRotation = true;
    RECEIPT.clusterProjectedClearanceMarginPx = SPHERE.cluster.projectedClearanceMarginPx;
    if (state.root) {
      state.root.dataset.lawsClusterGeometryModel = SPHERE.cluster.model;
      state.root.dataset.lawsClusterMemberCount = String(SPHERE.cluster.memberCount);
      state.root.dataset.lawsClusterHorizontalRadius = String(SPHERE.cluster.horizontalRadius);
      state.root.dataset.lawsClusterVerticalRadius = String(SPHERE.cluster.verticalRadius);
      state.root.dataset.lawsClusterDepthRadius = String(SPHERE.cluster.depthRadius);
      state.root.dataset.lawsClusterNoncoplanar = "true";
      state.root.dataset.lawsClusterFullXyzRotation = "true";
    }
    return true;
  }`, "sphere-vectors");
    source = section(source, "  function boundClusterQuaternion(value) {", "\n\n  function clusterQuaternionFromFrame(", `  function boundClusterQuaternion(value) {
    return quaternionNormalize(value);
  }`, "full-xyz-quaternion");
    source = section(source, "  function euclideanLawPosition(", "\n\n  function setUniformScale(", `  function sphericalLawPosition(node, localQuaternion) {
    const unit = rotatedLawUnitVector(node, localQuaternion);
    return {
      x: unit[0] * SPHERE.cluster.horizontalRadius,
      y: unit[1] * SPHERE.cluster.verticalRadius,
      z: unit[2] * SPHERE.cluster.depthRadius,
      depth: (unit[2] + 1) / 2,
      primary: clamp((dot(unit, clusterAnchorVector()) + 1) / 2, 0, 1)
    };
  }`, "sphere-law-position");
    source = section(source, "  function updateConstellationTargets() {", "\n\n  function updateClusterTargets(", `  function updateConstellationTargets() {
    state.visualPrimaryDirection = nearestPrimaryDirection();
    DIRECTIONS.forEach(direction => {
      const node = state.registry.get(direction);
      const sphere = sphericalCategoryPosition(direction);
      const primary = direction === state.visualPrimaryDirection;
      node.visible = true;
      node.depthScore = sphere.depth;
      node.primaryScore = sphere.primary;
      node.material = primary ? "CATEGORY_FOCUSED" : "CATEGORY_IDLE";
      Object.assign(node.target, setUniformScale({
        x: sphere.x, y: sphere.y, z: sphere.z,
        prominence: primary ? 0.90 : 0.78,
        halo: 0,
        rotationSpeed: primary ? 0.15 : 0.08 + sphere.depth * 0.05,
        float: 0
      }, QUALITY.categoryScale));
    });
  }`, "living-constellation");
    source = section(source, "  function updateClusterTargets(", "\n\n  function updateTargets() {", `  function updateClusterTargets(frame, direction) {
    const localQuaternion = state.clusterQuaternions.get(direction) || [0, 0, 0, 1];
    const primaryLaw = nearestPrimaryLaw(direction, localQuaternion);
    state.visualPrimaryLaws.set(direction, primaryLaw);
    activeLawNodes(direction).forEach(node => {
      const sphere = sphericalLawPosition(node, localQuaternion);
      const selected = frame.state === "LAW_SELECTED" && frame.selectedLaw === node.id;
      const primary = node.id === primaryLaw;
      node.visible = true;
      node.depthScore = sphere.depth;
      node.primaryScore = sphere.primary;
      node.material = selected ? "LAW_SELECTED" : primary ? "LAW_PRIMARY" : "LAW_IDLE";
      Object.assign(node.target, setUniformScale({
        x: sphere.x, y: sphere.y - 0.08, z: sphere.z + 0.18,
        prominence: selected ? 0.92 : primary ? 0.86 : 0.76,
        halo: 0,
        rotationSpeed: primary || selected ? 0.13 : 0.07 + sphere.depth * 0.04,
        float: 0
      }, QUALITY.lawScale));
    });
  }`, "living-cluster");
    source = section(source, "  function nodeFloatY(node) {", "\n\n  function modelMatrix(", `  function nodeFloatY(node) {
    return 0;
  }`, "no-float");
    source = section(source, "  function drawCrystalNodes(", "\n\n  function projectedRadiusForNode(", `  function drawCrystalNodes(renderer, nodes) {
    const gl = renderer.gl;
    const layer = renderer.id === DEPTH_LAYERS.REAR ? state.compositor.getRearLayer() : state.compositor.getFrontLayer();
    gl.viewport(0, 0, layer.width, layer.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    configureSharedUniforms(renderer);
    gl.depthMask(true);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    let drawCalls = 0;
    nodes.forEach(node => { drawCalls += drawNode(renderer, node, false); });
    const error = gl.getError();
    invariant(error === gl.NO_ERROR, "LAWS_CRYSTALS_" + renderer.id + "_DRAW_FAILURE", { error });
    return Object.freeze({ drawCalls, visibleNodeCount: nodes.length });
  }`, "single-surface");
    source = one(source, `      float alpha =
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
        );`, `      float alpha =
        1.0;`, "opaque-surface");
    source = one(source, "validateClusterOrbitContract();", "validateClusterSphereContract();", "sphere-validation");
    const retired = ["SPHERE.cluster.commonRadius", "SPHERE.cluster.planeNormal", "SPHERE.cluster.maximumTiltRadians", "function euclideanLawPosition(", "validateClusterOrbitContract();", "gl.enable(gl.CULL_FACE);", "gl.cullFace(gl.BACK);", "gl.frontFace(gl.CCW);", "QUALITY.focusedCategoryScale", "QUALITY.primaryLawScale", "QUALITY.selectedLawScale"];
    retired.forEach(token => { if (source.includes(token)) fail("LAWS_CRYSTALS_RETIRED_VARIANCE_TOKEN_REMAINS", { token }); });
    const required = ["BOUNDED_SPHERICAL_XYZ_CLUSTER", "function sphericalLawPosition(", "LAWS_CRYSTALS_NONCOPLANAR_DISTRIBUTION_INVALID", "QUALITY.categoryScale", "QUALITY.lawScale", "node.transform.rz +=", "QUALITY.maximumYaw", "QUALITY.maximumPitch", "gl.disable(gl.CULL_FACE);", "float alpha =\n        1.0;"];
    required.forEach(token => { if (!source.includes(token)) fail("LAWS_CRYSTALS_REQUIRED_CONTINUITY_TOKEN_MISSING", { token }); });
    return source;
  }
  function install() {
    if (globalThis.DGB_LAWS_CRYSTALS?.initialized || document.querySelector(`script[${A}]`)) return;
    const source = transform(load(C.sourceUrl));
    const script = document.createElement("script");
    script.setAttribute(A, "true"); script.dataset.ready = "false";
    script.textContent = source + "\n//# sourceURL=/laws/index.crystals.living-continuity.js";
    document.head.append(script); script.dataset.ready = "true";
    const root = document.querySelector("[data-laws-root]");
    if (root) {
      root.dataset.lawsCrystalsWrapperStatus = "available";
      root.dataset.lawsCrystalsWrapperContract = C.id;
      root.dataset.lawsClusterGeometryModel = C.geometryModel;
      root.dataset.lawsClusterPresentationModel = C.presentationModel;
      root.dataset.lawsCrystalFaceVisibilityModel = C.faceVisibilityModel;
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
    const receipt = Object.freeze({
      contractId: C.id, sourceUrl: C.sourceUrl,
      geometryModel: C.geometryModel, presentationModel: C.presentationModel,
      faceVisibilityModel: C.faceVisibilityModel,
      categoryScale: 0.96, lawScale: 0.88, memberCount: 4,
      horizontalRadius: 1.36, verticalRadius: 1.18, depthRadius: 1.04,
      backFaceCullingEnabled: false, ordinarySurfaceOpaque: true,
      haloPassEnabled: false, autonomousCrystalRotationEnabled: true,
      crystalFloatEnabled: false, depthBasedGeometryScaleEnabled: false,
      primaryGeometryScaleLiftEnabled: false, selectedGeometryScaleLiftEnabled: false,
      sourceTransformed: true, sourceExecuted: Boolean(globalThis.DGB_LAWS_CRYSTALS),
      protectedAuthoritiesChanged: false, visualPassClaimed: false
    });
    globalThis.DGB_LAWS_CRYSTALS_WRAPPER_RECEIPT = receipt;
    globalThis.dispatchEvent(new CustomEvent("DGB_LAWS_CRYSTALS_WRAPPER_READY", { detail: receipt }));
  }
  install();
})();
