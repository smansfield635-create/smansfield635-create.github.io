from pathlib import Path
import json

CRYSTALS = Path('laws/index.crystals.js')
HTML = Path('laws/index.html')
HARNESS = Path('laws/validation/laws.orbit-direct-manipulation.harness.mjs')
REQUEST = Path('laws/validation/laws-runtime-projected-clearance.request.json')
CHECKPOINT = Path('laws/validation/laws-runtime-projected-clearance.implementation.json')


def rep(text, old, new, label, count=1):
    actual = text.count(old)
    if actual != count:
        raise SystemExit(f'{label}: expected {count}, found {actual}')
    return text.replace(old, new, count)


def main():
    c = CRYSTALS.read_text()
    h = HTML.read_text()
    v = HARNESS.read_text()

    c = rep(c, '''        projectedClearanceMarginPx:\n          8,\n\n        primaryAnchor:''', '''        projectedClearanceMarginPx:\n          8,\n\n        minimumRuntimeCommonRadius:\n          1.00,\n\n        maximumRuntimeCommonRadius:\n          1.82,\n\n        runtimeRadiusSearchStep:\n          0.02,\n\n        minimumUniformScaleFactor:\n          0.72,\n\n        uniformScaleSearchStep:\n          0.02,\n\n        viewportClearanceMarginPx:\n          6,\n\n        primaryAnchor:''', 'cluster-config')

    c = rep(c, '''    reducedMotion:\n      false,\n\n    generatedLawProxyCount:''', '''    reducedMotion:\n      false,\n\n    runtimeClusterRadius:\n      SPHERE.cluster.commonRadius,\n\n    runtimeClusterUniformScaleFactor:\n      1,\n\n    runtimeClusterProjectedClearancePassed:\n      false,\n\n    runtimeClusterClearanceResolutionAttempts:\n      0,\n\n    runtimeClusterClearanceWorstResidualPx:\n      null,\n\n    runtimeClusterClearanceReason:\n      "PENDING",\n\n    rigidClusterPositionInterpolation:\n      true,\n\n    clusterMemberFloatingTranslation:\n      false,\n\n    generatedLawProxyCount:''', 'receipt-fields')

    c = rep(c, '''    visualPrimaryLaws:\n      new Map(),\n\n    reducedMotion:''', '''    visualPrimaryLaws:\n      new Map(),\n\n    resolvedClusterRadius:\n      SPHERE.cluster.commonRadius,\n\n    resolvedClusterScaleFactor:\n      1,\n\n    clusterProjectedClearancePassed:\n      false,\n\n    clusterClearanceResolutionAttempts:\n      0,\n\n    clusterClearanceWorstResidualPx:\n      null,\n\n    reducedMotion:''', 'state-fields')

    c = rep(c, '''  function euclideanLawPosition(\n    node,\n    localQuaternion\n  ) {''', '''  function euclideanLawPosition(\n    node,\n    localQuaternion,\n    commonRadius = SPHERE.cluster.commonRadius\n  ) {''', 'position-signature')
    c = rep(c, '''    const radius =\n      SPHERE.cluster.commonRadius;''', '''    const radius = clamp(\n      finiteNumber(commonRadius, SPHERE.cluster.commonRadius),\n      SPHERE.cluster.minimumRuntimeCommonRadius,\n      SPHERE.cluster.maximumRuntimeCommonRadius\n    );''', 'position-radius')

    helper = r'''
  function runtimeClusterRadiusCandidates() {
    const { commonRadius, minimumRuntimeCommonRadius: minimum,
      maximumRuntimeCommonRadius: maximum, runtimeRadiusSearchStep: step } =
      SPHERE.cluster;
    const values = [];
    const seen = new Set();
    const admit = value => {
      const normalized = Number(clamp(value, minimum, maximum).toFixed(6));
      const key = normalized.toFixed(6);
      if (!seen.has(key)) {
        seen.add(key);
        values.push(normalized);
      }
    };
    admit(commonRadius);
    const distanceLimit = Math.max(commonRadius - minimum, maximum - commonRadius);
    for (let distance = step; distance <= distanceLimit + 1e-12; distance += step) {
      admit(commonRadius - distance);
      admit(commonRadius + distance);
    }
    return values;
  }

  function clusterCandidateFacts(direction, localQuaternion, commonRadius, scaleFactor) {
    const viewport = state.compositorFrame && state.compositorFrame.viewport;
    const laws = activeLawNodes(direction);
    let bounds = null;
    try {
      bounds = state.compositor.getCompassFieldBounds();
    } catch (_) {
      bounds = null;
    }
    if (!viewport || !bounds || laws.length !== SPHERE.cluster.memberCount ||
        ![bounds.left, bounds.top, bounds.right, bounds.bottom,
          bounds.width, bounds.height].every(Number.isFinite) ||
        bounds.width <= 0 || bounds.height <= 0) {
      return { pass: false, reason: "RUNTIME_PROJECTION_FACTS_UNAVAILABLE",
        residual: null, projectedRadius: null };
    }
    const projectedRadius = Math.max(18, 48 * QUALITY.selectedLawScale * scaleFactor);
    const edge = SPHERE.cluster.viewportClearanceMarginPx;
    let residual = Infinity;
    for (const node of laws) {
      const p = euclideanLawPosition(node, localQuaternion, commonRadius);
      const projected = state.compositor.projectWorldPoint([p.x, p.y, p.z], {
        projectedRadius,
        compassOverlapPadding: SPHERE.cluster.projectedClearanceMarginPx,
        rejectionMargin: 0.80,
        nodeId: node.id,
        nodeType: node.type
      });
      if (!projected || projected.visible === false || projected.compassOverlap === true) {
        return { pass: false, reason: "PROJECTED_COMPASS_CLEARANCE_FAILED",
          residual: Number.isFinite(residual) ? residual : null, projectedRadius };
      }
      if (projected.x - projectedRadius < edge ||
          projected.x + projectedRadius > viewport.cssWidth - edge ||
          projected.y - projectedRadius < edge ||
          projected.y + projectedRadius > viewport.cssHeight - edge) {
        return { pass: false, reason: "PROJECTED_VIEWPORT_CLEARANCE_FAILED",
          residual: Number.isFinite(residual) ? residual : null, projectedRadius };
      }
      const closestX = clamp(projected.x, bounds.left, bounds.right);
      const closestY = clamp(projected.y, bounds.top, bounds.bottom);
      residual = Math.min(residual,
        Math.hypot(projected.x - closestX, projected.y - closestY) -
        projectedRadius - SPHERE.cluster.projectedClearanceMarginPx);
    }
    return { pass: true, reason: "PASS", residual, projectedRadius };
  }

  function resolveClusterPresentation(direction, localQuaternion) {
    let attempts = 0;
    let last = null;
    const radii = runtimeClusterRadiusCandidates();
    for (let scaleFactor = 1;
      scaleFactor >= SPHERE.cluster.minimumUniformScaleFactor - 1e-12;
      scaleFactor -= SPHERE.cluster.uniformScaleSearchStep) {
      const scale = Math.max(SPHERE.cluster.minimumUniformScaleFactor,
        Number(scaleFactor.toFixed(6)));
      for (const radius of radii) {
        const facts = clusterCandidateFacts(direction, localQuaternion, radius, scale);
        attempts += 1;
        last = facts;
        if (facts.pass) {
          return { pass: true, radius, scale, attempts, reason: facts.reason,
            residual: facts.residual, projectedRadius: facts.projectedRadius };
        }
      }
    }
    return { pass: false, radius: SPHERE.cluster.commonRadius,
      scale: SPHERE.cluster.minimumUniformScaleFactor, attempts,
      reason: last ? last.reason : "NO_RUNTIME_CLEARANCE_CANDIDATE",
      residual: last ? last.residual : null,
      projectedRadius: last ? last.projectedRadius : null };
  }

  function publishClusterPresentationResolution(result) {
    state.resolvedClusterRadius = result.radius;
    state.resolvedClusterScaleFactor = result.scale;
    state.clusterProjectedClearancePassed = result.pass;
    state.clusterClearanceResolutionAttempts = result.attempts;
    state.clusterClearanceWorstResidualPx = result.residual;
    RECEIPT.runtimeClusterRadius = result.radius;
    RECEIPT.runtimeClusterUniformScaleFactor = result.scale;
    RECEIPT.runtimeClusterProjectedClearancePassed = result.pass;
    RECEIPT.runtimeClusterClearanceResolutionAttempts = result.attempts;
    RECEIPT.runtimeClusterClearanceWorstResidualPx = result.residual;
    RECEIPT.runtimeClusterClearanceReason = result.reason;
    RECEIPT.runtimeClusterProjectedRadiusPx = result.projectedRadius;
    if (state.root) {
      state.root.dataset.lawsClusterRuntimeCommonRadius = String(result.radius);
      state.root.dataset.lawsClusterRuntimeUniformScaleFactor = String(result.scale);
      state.root.dataset.lawsClusterRuntimeProjectedClearancePassed = String(result.pass);
      state.root.dataset.lawsClusterRuntimeClearanceResolutionAttempts = String(result.attempts);
      state.root.dataset.lawsClusterRuntimeClearanceWorstResidualPx =
        result.residual === null ? "" : String(result.residual);
      state.root.dataset.lawsClusterRuntimeClearanceReason = result.reason;
      state.root.dataset.lawsClusterRuntimeClearanceSource =
        "compositor-bounds-and-projection";
    }
    return result;
  }

'''
    c = rep(c, '''  function setUniformScale(\n    target,\n    scale\n  ) {''', helper + '''  function setUniformScale(\n    target,\n    scale\n  ) {''', 'solver-insert')

    c = rep(c, '''    const primaryLaw =\n      nearestPrimaryLaw(\n        direction,\n        localQuaternion\n      );''', '''    const resolution = publishClusterPresentationResolution(\n      resolveClusterPresentation(direction, localQuaternion)\n    );\n\n    const primaryLaw =\n      nearestPrimaryLaw(\n        direction,\n        localQuaternion\n      );''', 'solver-call')
    c = rep(c, '''        const sphere =\n          euclideanLawPosition(\n            node,\n            localQuaternion\n          );''', '''        const sphere =\n          euclideanLawPosition(\n            node,\n            localQuaternion,\n            resolution.radius\n          );''', 'resolved-radius')
    c = rep(c, '''        const scale =\n          selected\n            ? QUALITY.selectedLawScale\n            : primary\n              ? QUALITY.primaryLawScale\n              : QUALITY.lawScale;''', '''        const scale =\n          (\n            selected\n              ? QUALITY.selectedLawScale\n              : primary\n                ? QUALITY.primaryLawScale\n                : QUALITY.lawScale\n          ) * resolution.scale;''', 'resolved-scale')

    old_transform = '''    state.registry.forEach(\n      node => {\n        [\n          "x",\n          "y",\n          "z",\n          "sx",\n          "sy",\n          "sz",\n          "prominence",\n          "halo",\n          "rotationSpeed",\n          "float"\n        ].forEach(\n          key => {\n            node.transform[key] =\n              node.transform[key] +\n              (\n                node.target[key] -\n                node.transform[key]\n              ) *\n                interpolation;\n          }\n        );'''
    new_transform = '''    state.registry.forEach(\n      node => {\n        const rigidClusterLaw =\n          state.sceneProjection === SCENE_PROJECTIONS.CLUSTER &&\n          node.type === NODE_TYPES.LAW && node.visible;\n\n        if (rigidClusterLaw) {\n          node.transform.x = node.target.x;\n          node.transform.y = node.target.y;\n          node.transform.z = node.target.z;\n        }\n\n        (rigidClusterLaw\n          ? ["sx", "sy", "sz", "prominence", "halo", "rotationSpeed", "float"]\n          : ["x", "y", "z", "sx", "sy", "sz", "prominence", "halo",\n              "rotationSpeed", "float"]\n        ).forEach(\n          key => {\n            node.transform[key] =\n              node.transform[key] +\n              (node.target[key] - node.transform[key]) * interpolation;\n          }\n        );'''
    c = rep(c, old_transform, new_transform, 'rigid-position')

    c = rep(c, '''  function nodeFloatY(node) {\n    return state.reducedMotion\n      ? 0\n      : Math.sin(''', '''  function nodeFloatY(node) {\n    if (state.sceneProjection === SCENE_PROJECTIONS.CLUSTER &&\n        node.type === NODE_TYPES.LAW) {\n      return 0;\n    }\n\n    return state.reducedMotion\n      ? 0\n      : Math.sin(''', 'suppress-float')

    c = rep(c, '''                  projectedRadiusForNode(\n                      node\n                    ),\n\n                  nodeId:''', '''                  projectedRadiusForNode(\n                      node\n                    ),\n\n                  compassOverlapPadding:\n                    node.type === NODE_TYPES.LAW\n                      ? SPHERE.cluster.projectedClearanceMarginPx\n                      : undefined,\n\n                  nodeId:''', 'semantic-margin')

    for token in ('runtimeClusterRadiusCandidates(', 'resolveClusterPresentation(',
                  'getCompassFieldBounds()', 'const rigidClusterLaw =',
                  'compassOverlapPadding:'):
        if token not in c:
            raise SystemExit(f'missing-token:{token}')

    h = rep(h, 'LAWS_COMPASS_EUCLIDEAN_COMMON_RADIUS_ORBIT_v3',
            'LAWS_COMPASS_RUNTIME_PROJECTED_CLEARANCE_ORBIT_v4', 'cache-id')
    h = rep(h, '''  data-laws-cluster-orbit-common-radius="1.40"\n  data-laws-cluster-orbit-maximum-tilt-radians="0.30"''', '''  data-laws-cluster-orbit-common-radius="1.40"\n  data-laws-cluster-orbit-common-radius-role="nominal-runtime-radius"\n  data-laws-cluster-orbit-minimum-runtime-radius="1.00"\n  data-laws-cluster-orbit-maximum-runtime-radius="1.82"\n  data-laws-cluster-orbit-runtime-radius-source="compositor-bounds-and-projection"\n  data-laws-cluster-orbit-uniform-scale-range="1.00-to-0.72"\n  data-laws-cluster-orbit-projected-clearance-margin-px="8"\n  data-laws-cluster-orbit-rigid-position-interpolation="true"\n  data-laws-cluster-orbit-member-floating-translation="false"\n  data-laws-cluster-orbit-maximum-tilt-radians="0.30"''', 'html-contract')

    v = rep(v, '''  crystals: "laws/index.crystals.js",\n  interactions:''', '''  crystals: "laws/index.crystals.js",\n  compositor: "laws/index.compositor.js",\n  interactions:''', 'harness-compositor')
    assertions = r'''
assert(
  sources.crystals.includes("runtimeClusterRadiusCandidates") &&
  sources.crystals.includes("resolveClusterPresentation") &&
  sources.crystals.includes("getCompassFieldBounds()") &&
  sources.crystals.includes("compassOverlapPadding:") &&
  sources.crystals.includes("const rigidClusterLaw ="),
  "RUNTIME_PROJECTED_CLEARANCE_SOLVER_PRESENT"
);
assert(
  sources.crystals.includes("minimumRuntimeCommonRadius:\n          1.00") &&
  sources.crystals.includes("maximumRuntimeCommonRadius:\n          1.82") &&
  sources.crystals.includes("minimumUniformScaleFactor:\n          0.72"),
  "RUNTIME_CLEARANCE_BOUNDS_LOCKED"
);
assert(
  sources.html.includes("LAWS_COMPASS_RUNTIME_PROJECTED_CLEARANCE_ORBIT_v4") &&
  sources.html.includes("data-laws-cluster-orbit-runtime-radius-source=\"compositor-bounds-and-projection\""),
  "HTML_RUNTIME_CLEARANCE_CONTRACT_UPDATED"
);
assert(
  sources.compositor.includes("function getCompassFieldBounds()") &&
  sources.compositor.includes("function projectWorldPoint("),
  "PROTECTED_COMPOSITOR_FACTS_PRESENT"
);

'''
    v = rep(v, 'const memberCount = extractNumber(', assertions + 'const memberCount = extractNumber(', 'harness-assertions')
    v = rep(v, 'LAWS_EUCLIDEAN_ORBIT_DIRECT_MANIPULATION_ACCEPTANCE_RECEIPT_v1',
            'LAWS_RUNTIME_PROJECTED_CLEARANCE_RIGID_CLUSTER_ACCEPTANCE_RECEIPT_v2', 'receipt-id')
    v = rep(v, 'agent/laws-euclidean-orbit-direct-manipulation-001',
            'agent/laws-runtime-projected-clearance-001', 'receipt-branch')
    v = rep(v, '''  parentCommit:\n    "dedc73841de2b41f5905fd842e9a593116caf300",''', '''  parentCommit:\n    process.env.LAWS_REPAIR_PARENT_COMMIT ||\n    "UNRESOLVED",''', 'receipt-parent')
    v = rep(v, '''    commonRadius,\n    localPlane: "XY",''', '''    nominalCommonRadius:\n      commonRadius,\n    runtimeSharedRadius: true,\n    runtimeUniformScale: true,\n    runtimeBoundsSource:\n      "DGB_LAWS_COMPOSITOR.getCompassFieldBounds",\n    runtimeProjectionSource:\n      "DGB_LAWS_COMPOSITOR.projectWorldPoint",\n    localPlane: "XY",''', 'receipt-contract')
    v = rep(v, '''    oppositeSeparationDegrees: 180,\n    memberOffsets: false\n  },\n  projection:''', '''    oppositeSeparationDegrees: 180,\n    memberOffsets: false,\n    perMemberRadii: false,\n    rigidQuaternionPositioning: true,\n    secondaryPerNodePositionInterpolation: false,\n    clusterMemberFloatingTranslation: false\n  },\n  runtimeClearancePolicy: {\n    measuredEachFrame: true,\n    projectedClearanceMarginConsumed: true,\n    minimumRuntimeCommonRadius: 1.00,\n    maximumRuntimeCommonRadius: 1.82,\n    minimumUniformScaleFactor: 0.72\n  },\n  projection:''', 'receipt-policy')

    CRYSTALS.write_text(c)
    HTML.write_text(h)
    HARNESS.write_text(v)
    request = json.loads(REQUEST.read_text())
    CHECKPOINT.write_text(json.dumps({
        'artifactId': 'LAWS_RUNTIME_PROJECTED_CLEARANCE_IMPLEMENTATION_v1',
        'status': 'IMPLEMENTED_PENDING_INSTALLED_GATES',
        'requestArtifactId': request.get('artifactId'),
        'branch': 'agent/laws-runtime-projected-clearance-001',
        'mutatedProductPaths': ['laws/index.crystals.js', 'laws/index.html'],
        'mutatedEvidencePaths': [
            'laws/validation/laws.orbit-direct-manipulation.harness.mjs',
            'laws/validation/laws.orbit-direct-manipulation.receipt.json'
        ],
        'protectedAuthority': {
            'controllerChanged': False, 'compositorChanged': False,
            'planetChanged': False, 'interactionsChanged': False,
            'cssChanged': False, 'lawContentChanged': False, 'routesChanged': False
        },
        'implementation': {
            'nominalCommonRadius': 1.40,
            'minimumRuntimeCommonRadius': 1.00,
            'maximumRuntimeCommonRadius': 1.82,
            'oneSharedRadiusPerFrame': True,
            'oneUniformScaleFactorPerFrame': True,
            'minimumUniformScaleFactor': 0.72,
            'projectedClearanceMarginPx': 8,
            'rigidQuaternionPositioning': True,
            'clusterMemberFloatingTranslation': False,
            'perMemberOffsets': False,
            'perMemberRadii': False
        },
        'mergeAuthorized': False,
        'nextCheckpoint': 'INSTALLED_SMOKE_AND_BASELINE_GATES'
    }, indent=2) + '\n')


if __name__ == '__main__':
    main()
