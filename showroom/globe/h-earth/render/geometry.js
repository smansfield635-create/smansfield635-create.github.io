/**
 * H-Earth 3D Candidate Geometry Expansion Port
 *
 * File:
 * /showroom/globe/h-earth/render/geometry.js
 *
 * Contract:
 * H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031_v1
 *
 * Parent target:
 * STEP_031_GEOMETRY_EXPANSION_PORT_BINDING
 *
 * Purpose:
 * Expand composed/render candidate descriptor nodes into candidate-only
 * DOM/CSS3D geometry descriptor nodes before renderer DOM node creation.
 *
 * Boundary:
 * - No WebGL
 * - No canvas
 * - No SVG
 * - No iframe
 * - No script creation
 * - No physics
 * - No terrain engine
 * - No fluid simulation
 * - No weather simulation
 * - No traversal
 * - No collision claim
 * - No final geometry claim
 * - No renderer-pass claim
 * - No visual-pass claim
 * - No validation claim
 * - No production claim
 */

export const H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031_v1',
  file: '/showroom/globe/h-earth/render/geometry.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',
  fileClass: 'DOM_CSS_3D_CANDIDATE_GEOMETRY_EXPANSION_PORT',
  status: 'GEOMETRY_EXPANSION_PORT_DEFINED_CANDIDATE_ONLY',
  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',
  parentStep: 'STEP_031_GEOMETRY_EXPANSION_PORT_BINDING',
  boundary: Object.freeze({
    expandsDescriptorNodes: true,
    createsDomNodes: false,
    touchesDom: false,
    queriesGlobalDocument: false,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    importsEnvironment: false,
    importsCss: false,
    webglActivation: false,
    canvasActivation: false,
    svgActivation: false,
    iframeActivation: false,
    scriptCreation: false,
    terrainEngineClaim: false,
    physicsClaim: false,
    collisionClaim: false,
    traversalClaim: false,
    fluidSimulationClaim: false,
    weatherSimulationClaim: false,
    finalGeometryClaim: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

const GEOMETRY_NODE_KIND = Object.freeze({
  PARENT: 'candidate-parent-descriptor',
  BASE: 'candidate-base-geometry',
  CONTOUR: 'candidate-contour-geometry',
  PATCH: 'candidate-surface-patch-geometry',
  SHEEN: 'candidate-reflective-sheen-geometry',
  GRAIN: 'candidate-grain-detail-geometry',
  FOAM: 'candidate-foam-fragment-geometry',
  WATER: 'candidate-water-detail-geometry',
  SCATTER: 'candidate-scatter-child-geometry',
  ROCK: 'candidate-rock-child-geometry',
  HAZE: 'candidate-haze-geometry',
  SILHOUETTE: 'candidate-silhouette-geometry',
  DISTANT: 'candidate-distant-context-geometry',
  ANCHOR: 'candidate-anchor-marker-geometry'
});

const DEFAULT_LAYER_ORDER_BY_PRIMITIVE = Object.freeze({
  distantCluster: 10,
  atmosphericLayer: 20,
  waterPlane: 30,
  waterDepthBand: 40,
  irregularShorelineBand: 50,
  layeredSilhouette: 60,
  terrainBand: 70,
  contouredTerrainBand: 80,
  scatterCluster: 90,
  rockCluster: 90,
  inspectionAnchor: 100
});

const CHILD_LIMITS = Object.freeze({
  contouredTerrainBand: 28,
  terrainBand: 20,
  irregularShorelineBand: 24,
  waterDepthBand: 18,
  waterPlane: 18,
  scatterCluster: 24,
  rockCluster: 24,
  atmosphericLayer: 8,
  layeredSilhouette: 10,
  distantCluster: 10,
  inspectionAnchor: 1,
  default: 12
});

function isPlainObject(value) {
  return value !== null && typeof value === 'object' && !Array.isArray(value);
}

function asFiniteNumber(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

function clamp(value, min, max) {
  const numeric = asFiniteNumber(value, min);
  return Math.max(min, Math.min(max, numeric));
}

function normalizeArray(value) {
  return Array.isArray(value) ? value : [];
}

function normalizePrimitiveType(node) {
  return (
    node?.primitiveType ||
    node?.sourceObject?.primitiveType ||
    node?.objectReference?.primitiveType ||
    'unclassifiedPrimitive'
  );
}

function normalizeMaterialKey(node) {
  return (
    node?.materialKey ||
    node?.sourceObject?.materialKey ||
    node?.materialToken?.materialKey ||
    'unresolved'
  );
}

function normalizeLayerOrder(node) {
  const primitiveType = normalizePrimitiveType(node);

  return asFiniteNumber(
    node?.layerOrder,
    DEFAULT_LAYER_ORDER_BY_PRIMITIVE[primitiveType] ?? 999
  );
}

function normalizeObjectId(node, fallbackIndex = 0) {
  return (
    node?.objectId ||
    node?.sourceObject?.objectId ||
    node?.nodeId ||
    `UNRESOLVED_OBJECT_${String(fallbackIndex).padStart(3, '0')}`
  );
}

function normalizeNodeId(node, fallbackIndex = 0) {
  return (
    node?.nodeId ||
    node?.composedNodeId ||
    node?.sourceNodeId ||
    `render-node-${normalizeObjectId(node, fallbackIndex)}`
  );
}

function normalizeLabel(node, fallbackIndex = 0) {
  return (
    node?.label ||
    node?.objectLabel ||
    node?.sourceObject?.label ||
    normalizeObjectId(node, fallbackIndex)
  );
}

function normalizeDepthClass(node) {
  return (
    node?.depthClass ||
    node?.primaryDepthClass ||
    node?.sourceObject?.primaryDepthClass ||
    'foreground'
  );
}

function normalizeNormalizedDepth(node) {
  return clamp(
    node?.normalizedDepth ??
      node?.candidateTransform?.normalizedPosition?.normalizedDepth ??
      node?.sourceObject?.normalizedDepth ??
      node?.sourceObject?.normalizedPosition?.normalizedDepth ??
      0.5,
    0,
    1
  );
}

function normalizeTranslate(node) {
  const source = node?.candidateTransform?.translate || node?.sourceObject?.candidateTransform?.translate;

  return {
    x: asFiniteNumber(source?.x, 0),
    y: asFiniteNumber(source?.y, 0),
    z: asFiniteNumber(source?.z, 0)
  };
}

function normalizeRotate(node) {
  const source = node?.candidateTransform?.rotate || node?.sourceObject?.candidateTransform?.rotate;

  return {
    x: asFiniteNumber(source?.x, 0),
    y: asFiniteNumber(source?.y, 0),
    z: asFiniteNumber(source?.z, 0)
  };
}

function normalizeScale(node) {
  const sourceScale =
    node?.candidateTransform?.scale ??
    node?.sourceObject?.candidateTransform?.scale ??
    node?.primitiveGeometry?.scaleTriplet?.scalar ??
    1;

  return Math.max(0.01, asFiniteNumber(sourceScale, 1));
}

function normalizeExtent(node) {
  const source =
    node?.candidateTransform?.extent ||
    node?.primitiveGeometry?.extent ||
    node?.sourceObject?.extent ||
    node?.sourceObject?.candidateTransform?.extent;

  return {
    x: Math.max(0.01, asFiniteNumber(source?.x, 1)),
    y: Math.max(0.01, asFiniteNumber(source?.y, 0.1)),
    z: Math.max(0.01, asFiniteNumber(source?.z, 1))
  };
}

function normalizeBounds(node) {
  return node?.sourceObject?.bounds || node?.bounds || null;
}

function normalizeShapeVariation(node) {
  const source = node?.sourceObject?.shapeVariation || node?.shapeVariation || {};

  return {
    shapeIrregularity: clamp(source.shapeIrregularity ?? node?.sourceObject?.shapeIrregularity ?? 0, 0, 1),
    edgeVariation: clamp(source.edgeVariation ?? 0.05, 0, 1),
    heightVariation: clamp(source.heightVariation ?? 0.05, 0, 1),
    rotationVariationDegrees: asFiniteNumber(source.rotationVariationDegrees, 0),
    scaleVariation: clamp(source.scaleVariation ?? 0.03, 0, 1),
    clusterSpread: clamp(source.clusterSpread ?? 0.1, 0, 1),
    finalMeshClaim: false,
    rendererPassClaim: false,
    visualValidationClaim: false
  };
}

function normalizeClusterMembers(node) {
  return normalizeArray(node?.sourceObject?.clusterMembers || node?.clusterMembers);
}

function normalizeDetailCount(node) {
  const declared = node?.sourceObject?.detailCount ?? node?.detailCount;
  const clusters = normalizeClusterMembers(node).length;

  return Math.max(0, Math.floor(asFiniteNumber(declared, clusters)));
}

function normalizeDetailDensity(node) {
  return clamp(node?.sourceObject?.detailDensity ?? node?.detailDensity ?? 0.25, 0, 1);
}

function makeChildId(parentNode, suffix, index = null) {
  const parentId = normalizeNodeId(parentNode);
  const normalizedSuffix = String(suffix || 'child')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toLowerCase();

  if (index === null || index === undefined) {
    return `${parentId}__${normalizedSuffix}`;
  }

  return `${parentId}__${normalizedSuffix}-${String(index).padStart(2, '0')}`;
}

function makeChildObjectId(parentNode, suffix, index = null) {
  const objectId = normalizeObjectId(parentNode);
  const normalizedSuffix = String(suffix || 'child')
    .replace(/[^A-Za-z0-9_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .toUpperCase();

  if (index === null || index === undefined) {
    return `${objectId}__${normalizedSuffix}`;
  }

  return `${objectId}__${normalizedSuffix}_${String(index).padStart(2, '0')}`;
}

function createCandidateTransform(parentNode, override = {}) {
  const parentTranslate = normalizeTranslate(parentNode);
  const parentRotate = normalizeRotate(parentNode);
  const parentScale = normalizeScale(parentNode);
  const parentExtent = normalizeExtent(parentNode);
  const normalizedDepth = normalizeNormalizedDepth(parentNode);

  const localOffset = override.localOffset || {};
  const localRotate = override.localRotate || {};
  const localScale = Math.max(0.01, asFiniteNumber(override.localScale, 1));
  const extentScale = Math.max(0.01, asFiniteNumber(override.extentScale, localScale));

  const translate = {
    x: parentTranslate.x + asFiniteNumber(localOffset.x, 0),
    y: parentTranslate.y + asFiniteNumber(localOffset.y, 0),
    z: parentTranslate.z + asFiniteNumber(localOffset.z, 0)
  };

  const rotate = {
    x: parentRotate.x + asFiniteNumber(localRotate.x, 0),
    y: parentRotate.y + asFiniteNumber(localRotate.y, 0),
    z: parentRotate.z + asFiniteNumber(localRotate.z, 0)
  };

  const scale = Math.max(0.01, parentScale * localScale);

  return {
    translate,
    scale,
    baseScale: scale,
    contextScale: 1,
    rotate,
    extent: {
      x: Math.max(0.01, parentExtent.x * extentScale),
      y: Math.max(0.01, parentExtent.y * extentScale),
      z: Math.max(0.01, parentExtent.z * extentScale)
    },
    normalizedPosition: {
      nx: clamp(override.nx ?? parentNode?.candidateTransform?.normalizedPosition?.nx ?? 0.5, 0, 1),
      ny: clamp(override.ny ?? parentNode?.candidateTransform?.normalizedPosition?.ny ?? 0.2, 0, 1),
      nz: clamp(override.nz ?? parentNode?.candidateTransform?.normalizedPosition?.nz ?? normalizedDepth, 0, 1),
      normalizedDepth: clamp(override.normalizedDepth ?? normalizedDepth, 0, 1)
    },
    transformClaim: 'candidate-only',
    domTransformClaim: false,
    cssTransformClaim: false,
    webglTransformClaim: false,
    finalGeometryClaim: false,
    rendererClaim: false,
    traversalClaim: false
  };
}

function createPrimitiveGeometry(parentNode, primitiveType, override = {}) {
  const parentGeometry = parentNode?.primitiveGeometry || {};
  const parentExtent = normalizeExtent(parentNode);
  const extent = override.extent || createCandidateTransform(parentNode, override).extent;
  const normalizedDepth = clamp(override.normalizedDepth ?? normalizeNormalizedDepth(parentNode), 0, 1);
  const depthClass = override.depthClass || normalizeDepthClass(parentNode);

  const widthPx =
    override.widthPx ??
    Math.max(4, asFiniteNumber(parentGeometry.widthPx, parentExtent.x * 9) * asFiniteNumber(override.widthRatio, 1));

  const heightPx =
    override.heightPx ??
    Math.max(2, asFiniteNumber(parentGeometry.heightPx, parentExtent.y * 9) * asFiniteNumber(override.heightRatio, 1));

  const depthPx =
    override.depthPx ??
    Math.max(1, asFiniteNumber(parentGeometry.depthPx, parentExtent.z * 3.2) * asFiniteNumber(override.depthRatio, 1));

  return {
    primitiveType,
    depthClass,
    normalizedDepth,
    profileId: override.profileId || `${primitiveType}-candidate-profile`,
    profileClassName: override.profileClassName || `h-earth-geometry-${primitiveType}`,
    groundPlane: Boolean(override.groundPlane),
    widthPx,
    heightPx,
    depthPx,
    extent,
    scaleTriplet: {
      x: Math.max(0.01, asFiniteNumber(override.scaleX, 1)),
      y: Math.max(0.01, asFiniteNumber(override.scaleY, 1)),
      z: Math.max(0.01, asFiniteNumber(override.scaleZ, 1)),
      scalar: Math.max(0.01, asFiniteNumber(override.scalar, 1)),
      contextScale: 1,
      source: 'geometry-expansion-port'
    },
    descriptorOnly: false,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  };
}

function createExpandedNode(parentNode, config = {}) {
  const primitiveType = config.primitiveType || normalizePrimitiveType(parentNode);
  const materialKey = config.materialKey || normalizeMaterialKey(parentNode);
  const depthClass = config.depthClass || normalizeDepthClass(parentNode);
  const normalizedDepth = clamp(config.normalizedDepth ?? normalizeNormalizedDepth(parentNode), 0, 1);
  const objectId = config.objectId || makeChildObjectId(parentNode, config.suffix || 'geometry', config.index);
  const nodeId = config.nodeId || makeChildId(parentNode, config.suffix || 'geometry', config.index);
  const transform = createCandidateTransform(parentNode, {
    ...(config.transform || {}),
    normalizedDepth
  });

  const geometry = createPrimitiveGeometry(parentNode, primitiveType, {
    ...(config.geometry || {}),
    depthClass,
    normalizedDepth,
    extent: transform.extent
  });

  return {
    ...parentNode,
    nodeId,
    sourceNodeId: normalizeNodeId(parentNode),
    composedNodeId: parentNode?.composedNodeId ?? null,
    objectId,
    parentObjectId: normalizeObjectId(parentNode),
    parentNodeId: normalizeNodeId(parentNode),
    objectLabel: config.label || normalizeLabel(parentNode),
    label: config.label || normalizeLabel(parentNode),
    primitiveType,
    materialKey,
    layerId: config.layerId || parentNode?.layerId || null,
    layerOrder: asFiniteNumber(config.layerOrder, normalizeLayerOrder(parentNode)),
    geometryExpansion: {
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      expandedFromParent: true,
      geometryNodeKind: config.geometryNodeKind || GEOMETRY_NODE_KIND.PATCH,
      parentObjectId: normalizeObjectId(parentNode),
      parentNodeId: normalizeNodeId(parentNode),
      candidateGeometryOnly: true,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      claimBoundaryPreserved: true
    },
    candidateTransform: transform,
    primitiveGeometry: geometry,
    normalizedDepth,
    depthClass,
    primaryDepthClass: depthClass,
    descriptorOnly: false,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  };
}

function createParentCarryNode(parentNode, index = 0) {
  return {
    ...parentNode,
    nodeId: `${normalizeNodeId(parentNode, index)}__parent-descriptor`,
    sourceNodeId: normalizeNodeId(parentNode, index),
    objectId: `${normalizeObjectId(parentNode, index)}__PARENT_DESCRIPTOR`,
    parentObjectId: normalizeObjectId(parentNode, index),
    parentNodeId: normalizeNodeId(parentNode, index),
    geometryExpansion: {
      geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
      geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
      expandedFromParent: false,
      geometryNodeKind: GEOMETRY_NODE_KIND.PARENT,
      parentCarryNode: true,
      candidateGeometryOnly: true,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      claimBoundaryPreserved: true
    },
    descriptorOnly: true,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  };
}

function selectClusterMembers(parentNode, maxCount) {
  const members = normalizeClusterMembers(parentNode);
  if (members.length > 0) {
    return members.slice(0, maxCount);
  }

  const detailCount = Math.min(maxCount, normalizeDetailCount(parentNode));
  const extent = normalizeExtent(parentNode);
  const irregularity = normalizeShapeVariation(parentNode).shapeIrregularity;

  return Array.from({ length: detailCount }, (_, index) => {
    const side = index % 2 === 0 ? 1 : -1;
    const spread = (index + 1) / Math.max(1, detailCount + 1);

    return {
      index,
      parentObjectId: normalizeObjectId(parentNode),
      offset: {
        dx: side * extent.x * (0.08 + spread * 0.32),
        dy: irregularity * spread * 0.25,
        dz: side * extent.z * (0.04 + spread * 0.2)
      },
      localScale: 0.72 + spread * 0.38,
      localRotation: {
        x: 0,
        y: side * spread * 12,
        z: side * irregularity * 8
      },
      irregularityWeight: irregularity,
      finalGeometryClaim: false,
      renderedNodeClaim: false,
      physicsBodyClaim: false,
      collisionObjectClaim: false
    };
  });
}

function createClusterChildNodes(parentNode, options = {}) {
  const maxCount = options.maxCount ?? CHILD_LIMITS.default;
  const members = selectClusterMembers(parentNode, maxCount);
  const primitiveType = options.primitiveType || normalizePrimitiveType(parentNode);
  const geometryNodeKind = options.geometryNodeKind || GEOMETRY_NODE_KIND.SCATTER;

  return members.map((member, index) => {
    const offset = member?.offset || {};
    const rotation = member?.localRotation || {};
    const localScale = Math.max(0.08, asFiniteNumber(member?.localScale, 1));
    const irregularity = clamp(member?.irregularityWeight ?? 0, 0, 1);

    return createExpandedNode(parentNode, {
      suffix: options.suffix || 'cluster-child',
      index,
      primitiveType,
      materialKey: options.materialKey || normalizeMaterialKey(parentNode),
      depthClass: options.depthClass || normalizeDepthClass(parentNode),
      geometryNodeKind,
      label: `${normalizeLabel(parentNode)} Detail ${String(index + 1).padStart(2, '0')}`,
      transform: {
        localOffset: {
          x: asFiniteNumber(offset.dx, 0),
          y: asFiniteNumber(offset.dy, 0),
          z: asFiniteNumber(offset.dz, 0)
        },
        localRotate: {
          x: asFiniteNumber(rotation.x, 0),
          y: asFiniteNumber(rotation.y, 0),
          z: asFiniteNumber(rotation.z, 0)
        },
        localScale,
        extentScale: clamp(0.08 + localScale * 0.12 + irregularity * 0.05, 0.05, 0.32)
      },
      geometry: {
        profileId: options.profileId || `${primitiveType}-cluster-child`,
        profileClassName: options.profileClassName || `h-earth-geometry-${primitiveType}-child`,
        groundPlane: Boolean(options.groundPlane),
        widthRatio: clamp(0.05 + localScale * 0.09, 0.04, 0.24),
        heightRatio: clamp(0.05 + localScale * 0.07, 0.03, 0.18),
        depthRatio: clamp(0.05 + localScale * 0.08, 0.03, 0.2),
        scalar: localScale
      }
    });
  });
}

function expandContouredTerrainBand(parentNode) {
  const nodes = [];
  const density = normalizeDetailDensity(parentNode);
  const detailCount = Math.min(CHILD_LIMITS.contouredTerrainBand, Math.max(8, normalizeDetailCount(parentNode)));
  const extent = normalizeExtent(parentNode);

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'wet-sand-base-plane',
      primitiveType: 'candidateTerrainBasePlane',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.BASE,
      label: `${normalizeLabel(parentNode)} Base Plane`,
      transform: {
        localOffset: { x: 0, y: 0, z: 0 },
        localScale: 1,
        extentScale: 1
      },
      geometry: {
        profileId: 'wet-sand-base-plane',
        profileClassName: 'h-earth-geometry-wet-sand-base-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.35,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  const contourCount = Math.min(8, Math.max(3, Math.round(detailCount * 0.28)));
  for (let index = 0; index < contourCount; index += 1) {
    const t = (index + 1) / (contourCount + 1);
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'wet-sand-contour-ridge',
        index,
        primitiveType: 'candidateContourRidge',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.CONTOUR,
        label: `${normalizeLabel(parentNode)} Contour Ridge ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.72,
            y: 0.02 + density * 0.08,
            z: (0.12 - t * 0.38) * extent.z
          },
          localRotate: {
            x: 0,
            y: 0,
            z: (t - 0.5) * 5
          },
          localScale: 0.42 + density * 0.2,
          extentScale: 0.28
        },
        geometry: {
          profileId: 'wet-sand-contour-ridge',
          profileClassName: 'h-earth-geometry-wet-sand-contour-ridge',
          groundPlane: true,
          widthRatio: 0.42,
          heightRatio: 0.08,
          depthRatio: 0.08,
          scalar: 0.5
        }
      })
    );
  }

  const patchCount = Math.min(8, Math.max(3, Math.round(detailCount * 0.24)));
  for (let index = 0; index < patchCount; index += 1) {
    const side = index % 2 === 0 ? -1 : 1;
    const t = (index + 1) / (patchCount + 1);

    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'wet-sand-moisture-patch',
        index,
        primitiveType: 'candidateMoisturePatch',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.PATCH,
        label: `${normalizeLabel(parentNode)} Moisture Patch ${index + 1}`,
        transform: {
          localOffset: {
            x: side * extent.x * (0.08 + t * 0.28),
            y: 0.015,
            z: -extent.z * (0.12 + t * 0.22)
          },
          localRotate: {
            x: 0,
            y: 0,
            z: side * (2 + t * 5)
          },
          localScale: 0.22 + t * 0.18,
          extentScale: 0.16 + t * 0.08
        },
        geometry: {
          profileId: 'wet-sand-moisture-patch',
          profileClassName: 'h-earth-geometry-wet-sand-moisture-patch',
          groundPlane: true,
          widthRatio: 0.16 + t * 0.08,
          heightRatio: 0.04,
          depthRatio: 0.1,
          scalar: 0.25 + t * 0.12
        }
      })
    );
  }

  const sheenCount = Math.min(5, Math.max(2, Math.round(detailCount * 0.16)));
  for (let index = 0; index < sheenCount; index += 1) {
    const t = (index + 1) / (sheenCount + 1);
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'wet-sand-reflective-sheen',
        index,
        primitiveType: 'candidateReflectiveSheen',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.SHEEN,
        label: `${normalizeLabel(parentNode)} Reflective Sheen ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.58,
            y: 0.018,
            z: -extent.z * (0.2 + t * 0.24)
          },
          localRotate: { x: 0, y: 0, z: (t - 0.5) * 3 },
          localScale: 0.16 + t * 0.14,
          extentScale: 0.14
        },
        geometry: {
          profileId: 'wet-sand-reflective-sheen',
          profileClassName: 'h-earth-geometry-wet-sand-reflective-sheen',
          groundPlane: true,
          widthRatio: 0.24,
          heightRatio: 0.025,
          depthRatio: 0.045,
          scalar: 0.2
        }
      })
    );
  }

  nodes.push(
    ...createClusterChildNodes(parentNode, {
      maxCount: Math.min(12, detailCount),
      suffix: 'wet-sand-grain-detail',
      primitiveType: 'candidateWetSandGrainDetail',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.GRAIN,
      profileId: 'wet-sand-grain-detail',
      profileClassName: 'h-earth-geometry-wet-sand-grain-detail',
      groundPlane: true
    })
  );

  return nodes;
}

function expandTerrainBand(parentNode) {
  const nodes = [];
  const extent = normalizeExtent(parentNode);
  const detailCount = Math.min(CHILD_LIMITS.terrainBand, Math.max(5, normalizeDetailCount(parentNode)));

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'dry-sand-base-plane',
      primitiveType: 'candidateDrySandBasePlane',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.BASE,
      label: `${normalizeLabel(parentNode)} Base Plane`,
      geometry: {
        profileId: 'dry-sand-base-plane',
        profileClassName: 'h-earth-geometry-dry-sand-base-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.28,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  const ridgeCount = Math.min(6, Math.max(2, Math.round(detailCount * 0.36)));
  for (let index = 0; index < ridgeCount; index += 1) {
    const t = (index + 1) / (ridgeCount + 1);
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'dry-sand-transition-ridge',
        index,
        primitiveType: 'candidateDrySandTransitionRidge',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.CONTOUR,
        label: `${normalizeLabel(parentNode)} Transition Ridge ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.68,
            y: 0.025,
            z: (t - 0.5) * extent.z * 0.48
          },
          localRotate: { z: (t - 0.5) * 7 },
          localScale: 0.34,
          extentScale: 0.22
        },
        geometry: {
          profileId: 'dry-sand-transition-ridge',
          profileClassName: 'h-earth-geometry-dry-sand-transition-ridge',
          groundPlane: true,
          widthRatio: 0.32,
          heightRatio: 0.07,
          depthRatio: 0.08,
          scalar: 0.35
        }
      })
    );
  }

  nodes.push(
    ...createClusterChildNodes(parentNode, {
      maxCount: Math.min(10, detailCount),
      suffix: 'dry-sand-surface-patch',
      primitiveType: 'candidateDrySandSurfacePatch',
      geometryNodeKind: GEOMETRY_NODE_KIND.PATCH,
      profileId: 'dry-sand-surface-patch',
      profileClassName: 'h-earth-geometry-dry-sand-surface-patch',
      groundPlane: true
    })
  );

  return nodes;
}

function expandIrregularShorelineBand(parentNode) {
  const nodes = [];
  const extent = normalizeExtent(parentNode);
  const detailCount = Math.min(CHILD_LIMITS.irregularShorelineBand, Math.max(8, normalizeDetailCount(parentNode)));

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'shoreline-contact-base',
      primitiveType: 'candidateShorelineContactBase',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.BASE,
      label: `${normalizeLabel(parentNode)} Contact Base`,
      geometry: {
        profileId: 'shoreline-contact-base',
        profileClassName: 'h-earth-geometry-shoreline-contact-base',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.22,
        depthRatio: 0.45,
        scalar: 1
      }
    })
  );

  const foamCount = Math.min(16, detailCount);
  for (let index = 0; index < foamCount; index += 1) {
    const t = (index + 1) / (foamCount + 1);
    const side = index % 2 === 0 ? -1 : 1;

    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'foam-break',
        index,
        primitiveType: 'candidateFoamBreak',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.FOAM,
        label: `${normalizeLabel(parentNode)} Foam Break ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.92,
            y: 0.03,
            z: side * extent.z * 0.08
          },
          localRotate: { z: side * (1 + t * 6) },
          localScale: 0.12 + t * 0.08,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'shoreline-foam-break',
          profileClassName: 'h-earth-geometry-shoreline-foam-break',
          groundPlane: true,
          widthRatio: 0.08 + t * 0.05,
          heightRatio: 0.025,
          depthRatio: 0.04,
          scalar: 0.16
        }
      })
    );
  }

  return nodes;
}

function expandWaterDepthBand(parentNode) {
  const nodes = [];
  const extent = normalizeExtent(parentNode);
  const detailCount = Math.min(CHILD_LIMITS.waterDepthBand, Math.max(5, normalizeDetailCount(parentNode)));

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'nearshore-water-band-base',
      primitiveType: 'candidateNearshoreWaterBandBase',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.BASE,
      label: `${normalizeLabel(parentNode)} Base Band`,
      geometry: {
        profileId: 'nearshore-water-band-base',
        profileClassName: 'h-earth-geometry-nearshore-water-band-base',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.18,
        depthRatio: 0.8,
        scalar: 1
      }
    })
  );

  const rippleCount = Math.min(12, detailCount + 3);
  for (let index = 0; index < rippleCount; index += 1) {
    const t = (index + 1) / (rippleCount + 1);
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'nearshore-ripple-strip',
        index,
        primitiveType: 'candidateNearshoreRippleStrip',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.WATER,
        label: `${normalizeLabel(parentNode)} Ripple Strip ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.72,
            y: 0.02,
            z: (t - 0.5) * extent.z * 0.55
          },
          localRotate: { z: (t - 0.5) * 4 },
          localScale: 0.14,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'nearshore-ripple-strip',
          profileClassName: 'h-earth-geometry-nearshore-ripple-strip',
          groundPlane: true,
          widthRatio: 0.18,
          heightRatio: 0.025,
          depthRatio: 0.04,
          scalar: 0.14
        }
      })
    );
  }

  return nodes;
}

function expandWaterPlane(parentNode) {
  const nodes = [];
  const extent = normalizeExtent(parentNode);

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'water-surface-base-plane',
      primitiveType: 'candidateWaterSurfaceBasePlane',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.BASE,
      label: `${normalizeLabel(parentNode)} Base Plane`,
      geometry: {
        profileId: 'water-surface-base-plane',
        profileClassName: 'h-earth-geometry-water-surface-base-plane',
        groundPlane: true,
        widthRatio: 1,
        heightRatio: 0.25,
        depthRatio: 1,
        scalar: 1
      }
    })
  );

  for (let index = 0; index < 10; index += 1) {
    const t = (index + 1) / 11;
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'water-depth-band',
        index,
        primitiveType: 'candidateWaterDepthBand',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.WATER,
        label: `${normalizeLabel(parentNode)} Depth Band ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.5,
            y: 0.015,
            z: (t - 0.5) * extent.z * 0.78
          },
          localScale: 0.18,
          extentScale: 0.12
        },
        geometry: {
          profileId: 'water-depth-band',
          profileClassName: 'h-earth-geometry-water-depth-band',
          groundPlane: true,
          widthRatio: 0.24,
          heightRatio: 0.025,
          depthRatio: 0.08,
          scalar: 0.18
        }
      })
    );
  }

  for (let index = 0; index < 6; index += 1) {
    const t = (index + 1) / 7;
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'water-reflection-strip',
        index,
        primitiveType: 'candidateWaterReflectionStrip',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.SHEEN,
        label: `${normalizeLabel(parentNode)} Reflection Strip ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * extent.x * 0.62,
            y: 0.02,
            z: -extent.z * (0.12 + t * 0.28)
          },
          localScale: 0.12,
          extentScale: 0.08
        },
        geometry: {
          profileId: 'water-reflection-strip',
          profileClassName: 'h-earth-geometry-water-reflection-strip',
          groundPlane: true,
          widthRatio: 0.18,
          heightRatio: 0.02,
          depthRatio: 0.035,
          scalar: 0.12
        }
      })
    );
  }

  return nodes;
}

function expandScatterCluster(parentNode) {
  return createClusterChildNodes(parentNode, {
    maxCount: CHILD_LIMITS.scatterCluster,
    suffix: 'scatter-member',
    primitiveType: 'candidateScatterMember',
    materialKey: normalizeMaterialKey(parentNode),
    geometryNodeKind: GEOMETRY_NODE_KIND.SCATTER,
    profileId: 'scatter-cluster-member',
    profileClassName: 'h-earth-geometry-scatter-cluster-member',
    groundPlane: true
  });
}

function expandRockCluster(parentNode) {
  const nodes = createClusterChildNodes(parentNode, {
    maxCount: CHILD_LIMITS.rockCluster,
    suffix: 'rock-member',
    primitiveType: 'candidateRockMember',
    materialKey: normalizeMaterialKey(parentNode),
    geometryNodeKind: GEOMETRY_NODE_KIND.ROCK,
    profileId: 'rock-cluster-member',
    profileClassName: 'h-earth-geometry-rock-cluster-member',
    groundPlane: false
  });

  return nodes.map((node) => ({
    ...node,
    primitiveGeometry: {
      ...node.primitiveGeometry,
      groundPlane: false,
      heightPx: Math.max(8, node.primitiveGeometry.heightPx * 1.6),
      depthPx: Math.max(4, node.primitiveGeometry.depthPx * 1.25)
    }
  }));
}

function expandAtmosphericLayer(parentNode) {
  const nodes = [];

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'air-haze-panel',
      primitiveType: 'candidateAirHazePanel',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.HAZE,
      label: `${normalizeLabel(parentNode)} Haze Panel`,
      geometry: {
        profileId: 'air-haze-panel',
        profileClassName: 'h-earth-geometry-air-haze-panel',
        groundPlane: false,
        widthRatio: 1,
        heightRatio: 1,
        depthRatio: 0.2,
        scalar: 1
      }
    })
  );

  for (let index = 0; index < 4; index += 1) {
    const t = (index + 1) / 5;
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'air-light-band',
        index,
        primitiveType: 'candidateAirLightBand',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.HAZE,
        label: `${normalizeLabel(parentNode)} Light Band ${index + 1}`,
        transform: {
          localOffset: {
            x: (t - 0.5) * normalizeExtent(parentNode).x * 0.42,
            y: (t - 0.5) * normalizeExtent(parentNode).y * 0.35,
            z: 0
          },
          localScale: 0.2,
          extentScale: 0.18
        },
        geometry: {
          profileId: 'air-light-band',
          profileClassName: 'h-earth-geometry-air-light-band',
          groundPlane: false,
          widthRatio: 0.28,
          heightRatio: 0.08,
          depthRatio: 0.04,
          scalar: 0.18
        }
      })
    );
  }

  return nodes;
}

function expandLayeredSilhouette(parentNode) {
  const nodes = [];
  const extent = normalizeExtent(parentNode);

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'silhouette-body',
      primitiveType: 'candidateSilhouetteBody',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.SILHOUETTE,
      label: `${normalizeLabel(parentNode)} Body`,
      geometry: {
        profileId: 'silhouette-body',
        profileClassName: 'h-earth-geometry-silhouette-body',
        groundPlane: false,
        widthRatio: 0.5,
        heightRatio: 0.8,
        depthRatio: 0.2,
        scalar: 0.6
      }
    })
  );

  nodes.push(
    createExpandedNode(parentNode, {
      suffix: 'silhouette-roof',
      primitiveType: 'candidateSilhouetteRoof',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.SILHOUETTE,
      label: `${normalizeLabel(parentNode)} Roof`,
      transform: {
        localOffset: { x: 0, y: extent.y * 0.32, z: 0 },
        localScale: 0.38,
        extentScale: 0.22
      },
      geometry: {
        profileId: 'silhouette-roof',
        profileClassName: 'h-earth-geometry-silhouette-roof',
        groundPlane: false,
        widthRatio: 0.62,
        heightRatio: 0.18,
        depthRatio: 0.16,
        scalar: 0.38
      }
    })
  );

  for (let index = 0; index < 3; index += 1) {
    nodes.push(
      createExpandedNode(parentNode, {
        suffix: 'silhouette-vertical-segment',
        index,
        primitiveType: 'candidateSilhouetteVerticalSegment',
        materialKey: normalizeMaterialKey(parentNode),
        geometryNodeKind: GEOMETRY_NODE_KIND.SILHOUETTE,
        label: `${normalizeLabel(parentNode)} Vertical Segment ${index + 1}`,
        transform: {
          localOffset: {
            x: (index - 1) * extent.x * 0.14,
            y: 0,
            z: 0
          },
          localScale: 0.22,
          extentScale: 0.12
        },
        geometry: {
          profileId: 'silhouette-vertical-segment',
          profileClassName: 'h-earth-geometry-silhouette-vertical-segment',
          groundPlane: false,
          widthRatio: 0.08,
          heightRatio: 0.5,
          depthRatio: 0.08,
          scalar: 0.22
        }
      })
    );
  }

  return nodes;
}

function expandDistantCluster(parentNode) {
  const nodes = createClusterChildNodes(parentNode, {
    maxCount: CHILD_LIMITS.distantCluster,
    suffix: 'distant-silhouette',
    primitiveType: 'candidateDistantSilhouette',
    materialKey: normalizeMaterialKey(parentNode),
    geometryNodeKind: GEOMETRY_NODE_KIND.DISTANT,
    profileId: 'distant-context-silhouette',
    profileClassName: 'h-earth-geometry-distant-context-silhouette',
    groundPlane: false
  });

  if (nodes.length > 0) {
    return nodes;
  }

  return [
    createExpandedNode(parentNode, {
      suffix: 'distant-silhouette',
      primitiveType: 'candidateDistantSilhouette',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.DISTANT,
      label: `${normalizeLabel(parentNode)} Distant Silhouette`,
      geometry: {
        profileId: 'distant-context-silhouette',
        profileClassName: 'h-earth-geometry-distant-context-silhouette',
        groundPlane: false,
        widthRatio: 0.45,
        heightRatio: 0.65,
        depthRatio: 0.12,
        scalar: 0.4
      }
    })
  ];
}

function expandInspectionAnchor(parentNode) {
  return [
    createExpandedNode(parentNode, {
      suffix: 'inspection-anchor-marker',
      primitiveType: 'candidateInspectionAnchorMarker',
      materialKey: normalizeMaterialKey(parentNode),
      geometryNodeKind: GEOMETRY_NODE_KIND.ANCHOR,
      label: `${normalizeLabel(parentNode)} Marker`,
      geometry: {
        profileId: 'inspection-anchor-marker',
        profileClassName: 'h-earth-geometry-inspection-anchor-marker',
        groundPlane: false,
        widthRatio: 1,
        heightRatio: 1,
        depthRatio: 1,
        scalar: 1
      }
    })
  ];
}

function expandByPrimitive(parentNode) {
  const primitiveType = normalizePrimitiveType(parentNode);

  switch (primitiveType) {
    case 'contouredTerrainBand':
      return expandContouredTerrainBand(parentNode);

    case 'terrainBand':
      return expandTerrainBand(parentNode);

    case 'irregularShorelineBand':
      return expandIrregularShorelineBand(parentNode);

    case 'waterDepthBand':
      return expandWaterDepthBand(parentNode);

    case 'waterPlane':
      return expandWaterPlane(parentNode);

    case 'scatterCluster':
      return expandScatterCluster(parentNode);

    case 'rockCluster':
      return expandRockCluster(parentNode);

    case 'atmosphericLayer':
      return expandAtmosphericLayer(parentNode);

    case 'layeredSilhouette':
      return expandLayeredSilhouette(parentNode);

    case 'distantCluster':
      return expandDistantCluster(parentNode);

    case 'inspectionAnchor':
      return expandInspectionAnchor(parentNode);

    default:
      return [
        createExpandedNode(parentNode, {
          suffix: 'generic-candidate-geometry',
          primitiveType: `candidate-${primitiveType}`,
          materialKey: normalizeMaterialKey(parentNode),
          geometryNodeKind: GEOMETRY_NODE_KIND.PATCH,
          label: `${normalizeLabel(parentNode)} Candidate Geometry`,
          geometry: {
            profileId: 'generic-candidate-geometry',
            profileClassName: 'h-earth-geometry-generic-candidate',
            groundPlane: false,
            widthRatio: 1,
            heightRatio: 1,
            depthRatio: 1,
            scalar: 1
          }
        })
      ];
  }
}

function shouldCarryParentDescriptor(parentNode) {
  const primitiveType = normalizePrimitiveType(parentNode);

  if (primitiveType === 'inspectionAnchor') {
    return false;
  }

  return true;
}

function makeExpansionReceipt(sourceNodes, expandedNodes, warnings = [], failures = []) {
  const parentCarryCount = expandedNodes.filter(
    (node) => node?.geometryExpansion?.parentCarryNode === true
  ).length;

  const geometryChildNodeCount = expandedNodes.filter(
    (node) => node?.geometryExpansion?.expandedFromParent === true
  ).length;

  return {
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_EXPANSION_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
    geometryPortUsed: true,
    geometryExpansionAttempted: true,
    sourceNodeCount: sourceNodes.length,
    expandedNodeCount: expandedNodes.length,
    descriptorParentNodeCount: parentCarryCount,
    geometryChildNodeCount,
    geometryExpansionSkippedCount: Math.max(0, sourceNodes.length - parentCarryCount),
    geometryExpansionWarningCodes: warnings,
    geometryExpansionFailureCodes: failures,
    primitiveExpansionSummary: summarizePrimitiveExpansion(sourceNodes, expandedNodes),
    claimsFinalGeometry: false,
    claimsRendererPass: false,
    claimsVisualPass: false,
    claimsValidation: false,
    claimsProduction: false,
    boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary,
    claimBoundaryPreserved: true
  };
}

function summarizePrimitiveExpansion(sourceNodes, expandedNodes) {
  const summary = {};

  for (const sourceNode of sourceNodes) {
    const primitiveType = normalizePrimitiveType(sourceNode);
    if (!summary[primitiveType]) {
      summary[primitiveType] = {
        primitiveType,
        sourceNodeCount: 0,
        expandedNodeCount: 0,
        geometryChildNodeCount: 0,
        descriptorParentNodeCount: 0
      };
    }

    summary[primitiveType].sourceNodeCount += 1;
  }

  for (const expandedNode of expandedNodes) {
    const parentPrimitiveType =
      expandedNode?.sourceObject?.primitiveType ||
      expandedNode?.geometryExpansion?.parentPrimitiveType ||
      normalizePrimitiveType(expandedNode);

    if (!summary[parentPrimitiveType]) {
      summary[parentPrimitiveType] = {
        primitiveType: parentPrimitiveType,
        sourceNodeCount: 0,
        expandedNodeCount: 0,
        geometryChildNodeCount: 0,
        descriptorParentNodeCount: 0
      };
    }

    summary[parentPrimitiveType].expandedNodeCount += 1;

    if (expandedNode?.geometryExpansion?.expandedFromParent === true) {
      summary[parentPrimitiveType].geometryChildNodeCount += 1;
    }

    if (expandedNode?.geometryExpansion?.parentCarryNode === true) {
      summary[parentPrimitiveType].descriptorParentNodeCount += 1;
    }
  }

  return Object.values(summary);
}

/**
 * Expand candidate geometry nodes.
 *
 * This function is intentionally renderer-adjacent but renderer-independent.
 * It returns descriptor objects only. The renderer remains responsible for
 * DOM node creation, material class application, layer placement, and mount receipts.
 *
 * @param {Array<object>} sourceNodes
 * @param {object} context
 * @returns {{ nodes: Array<object>, receipt: object }}
 */
export function expandHEarthCandidateGeometryNodes(sourceNodes, context = {}) {
  const warnings = [];
  const failures = [];
  const normalizedSourceNodes = normalizeArray(sourceNodes).filter(isPlainObject);

  if (!Array.isArray(sourceNodes)) {
    warnings.push('GEOMETRY_SOURCE_NODES_NOT_ARRAY');
  }

  if (normalizedSourceNodes.length === 0) {
    warnings.push('GEOMETRY_SOURCE_NODES_EMPTY');

    const receipt = makeExpansionReceipt([], [], warnings, failures);

    return {
      nodes: [],
      receipt,
      geometryPortUsed: true,
      geometryExpansionAttempted: true,
      claimBoundaryPreserved: true
    };
  }

  const expandedNodes = [];

  normalizedSourceNodes.forEach((sourceNode, index) => {
    try {
      const parentNode = {
        ...sourceNode,
        geometryExpansionContext: {
          geometryPortId: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
          geometryContractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
          sourceIndex: index,
          contextKeys: Object.keys(context || {}),
          candidateGeometryOnly: true,
          finalGeometryClaim: false,
          rendererPassClaim: false,
          visualPassClaim: false,
          validationClaim: false,
          claimBoundaryPreserved: true
        }
      };

      if (shouldCarryParentDescriptor(parentNode)) {
        expandedNodes.push(createParentCarryNode(parentNode, index));
      }

      const childNodes = expandByPrimitive(parentNode).map((childNode) => ({
        ...childNode,
        geometryExpansion: {
          ...(childNode.geometryExpansion || {}),
          parentPrimitiveType: normalizePrimitiveType(parentNode),
          parentMaterialKey: normalizeMaterialKey(parentNode),
          parentDepthClass: normalizeDepthClass(parentNode),
          sourceIndex: index,
          candidateGeometryOnly: true,
          finalGeometryClaim: false,
          rendererPassClaim: false,
          visualPassClaim: false,
          validationClaim: false,
          claimBoundaryPreserved: true
        }
      }));

      expandedNodes.push(...childNodes);
    } catch (error) {
      failures.push({
        code: 'GEOMETRY_NODE_EXPANSION_FAILED',
        sourceIndex: index,
        objectId: normalizeObjectId(sourceNode, index),
        message: error instanceof Error ? error.message : String(error),
        claimBoundaryPreserved: true
      });

      expandedNodes.push(createParentCarryNode(sourceNode, index));
    }
  });

  const receipt = makeExpansionReceipt(normalizedSourceNodes, expandedNodes, warnings, failures);

  return {
    nodes: expandedNodes,
    receipt,
    geometryPortUsed: true,
    geometryExpansionAttempted: true,
    sourceNodeCount: normalizedSourceNodes.length,
    expandedNodeCount: expandedNodes.length,
    geometryChildNodeCount: receipt.geometryChildNodeCount,
    descriptorParentNodeCount: receipt.descriptorParentNodeCount,
    geometryExpansionSkippedCount: receipt.geometryExpansionSkippedCount,
    geometryExpansionWarningCodes: warnings,
    geometryExpansionFailureCodes: failures,
    claimBoundaryPreserved: true
  };
}

export function getHEarthGeometryExpansionPortReceipt() {
  return {
    receiptType: 'H_EARTH_3D_RENDER_GEOMETRY_PORT_RECEIPT',
    file: '/showroom/globe/h-earth/render/geometry.js',
    contractId: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.contractId,
    status: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.status,
    geometryPortDefined: true,
    geometryExpansionFunctionDefined: typeof expandHEarthCandidateGeometryNodes === 'function',
    primitiveExpansionDefined: true,
    parentDescriptorCarryDefined: true,
    clusterMemberConsumptionDefined: true,
    candidateOnlyGeometryDefined: true,
    createsDomNodes: false,
    touchesDom: false,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    importsEnvironment: false,
    boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary,
    claimBoundaryPreserved: true
  };
}

export const H_EARTH_3D_RENDER_GEOMETRY_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_GEOMETRY_PORT',
  file: '/showroom/globe/h-earth/render/geometry.js',
  contract: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT,
  expandCandidateGeometryNodes: expandHEarthCandidateGeometryNodes,
  getReceipt: getHEarthGeometryExpansionPortReceipt,
  receipt: getHEarthGeometryExpansionPortReceipt(),
  boundary: H_EARTH_3D_RENDER_GEOMETRY_PORT_CONTRACT.boundary
});

export default H_EARTH_3D_RENDER_GEOMETRY_PORT;
