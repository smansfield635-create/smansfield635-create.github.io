// /showroom/globe/h-earth/render/materials.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1
//
// Renews:
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1
//
// Parent standard:
// H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1
//
// Purpose:
// Material, primitive, landscape, context, interaction, and CSS class
// renumerization port for the H-Earth DOM/CSS-3D Candidate Renderer.
//
// This file maps candidate render/composed/geometry-expanded descriptors to
// stable CSS-addressable class arrays. It consumes class-ready descriptor fields
// from geometry.js when present, resolves parent-aware identity for geometry
// children, and returns complete class grammar for nodes.js to emit.
//
// This file does not create DOM nodes, touch DOM, import renderer.js, import
// compositor.js, import controller.js, create WebGL/canvas materials, claim
// physical material validation, claim renderer pass, claim visual pass, claim
// validation, claim production, authorize traversal, authorize simulation,
// or collapse matrices.

export const H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',
  renewedFrom: 'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1',

  parentStandard: 'H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1',
  parentGeometryRenewal:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/render/materials.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_MATERIAL_RENUMERIZATION_PORT',
  status: 'MATERIAL_CLASS_PORT_RENUMERIZED_NON_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  renumerization: Object.freeze({
    consumesGeometryClassReadyDescriptors: true,
    emitsCompleteClassArrays: true,
    parentAwareGeometryChildResolution: true,
    canonicalAndDetailClassGrammarPreserved: true,
    dataAttributesDoNotSubstituteForClassGrammar: true,
    createsDomNodes: false,
    touchesDom: false
  }),

  boundary: Object.freeze({
    createsDomNodes: false,
    touchesDom: false,
    definesCssClassesOnly: true,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    webglMaterialClaim: false,
    canvasClaim: false,
    physicalMaterialValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    traversalClaim: false,
    simulationClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export const H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP = Object.freeze({
  wetSand: Object.freeze({
    materialKey: 'wetSand',
    className: 'h-earth-material-wet-sand',
    cssVariablePrefix: '--h-earth-wet-sand',
    category: 'ground-surface',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    visualValidationClaim: false
  }),

  drySand: Object.freeze({
    materialKey: 'drySand',
    className: 'h-earth-material-dry-sand',
    cssVariablePrefix: '--h-earth-dry-sand',
    category: 'ground-surface',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    visualValidationClaim: false
  }),

  foam: Object.freeze({
    materialKey: 'foam',
    className: 'h-earth-material-foam',
    cssVariablePrefix: '--h-earth-foam',
    category: 'shoreline-contact',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    visualValidationClaim: false
  }),

  tidePool: Object.freeze({
    materialKey: 'tidePool',
    className: 'h-earth-material-tide-pool',
    cssVariablePrefix: '--h-earth-tide-pool',
    category: 'reflective-shore-detail',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    fluidSimulationClaim: false,
    visualValidationClaim: false
  }),

  stone: Object.freeze({
    materialKey: 'stone',
    className: 'h-earth-material-stone',
    cssVariablePrefix: '--h-earth-stone',
    category: 'shore-detail',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    collisionClaim: false,
    visualValidationClaim: false
  }),

  jaggedRock: Object.freeze({
    materialKey: 'jaggedRock',
    className: 'h-earth-material-jagged-rock',
    cssVariablePrefix: '--h-earth-jagged-rock',
    category: 'foreground-rock-detail',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    collisionClaim: false,
    visualValidationClaim: false
  }),

  water: Object.freeze({
    materialKey: 'water',
    className: 'h-earth-material-water',
    cssVariablePrefix: '--h-earth-water',
    category: 'water-context',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    visualValidationClaim: false
  }),

  nearshoreWave: Object.freeze({
    materialKey: 'nearshoreWave',
    className: 'h-earth-material-nearshore-wave',
    cssVariablePrefix: '--h-earth-nearshore-wave',
    category: 'water-context',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    visualValidationClaim: false
  }),

  airHaze: Object.freeze({
    materialKey: 'airHaze',
    className: 'h-earth-material-air-haze',
    cssVariablePrefix: '--h-earth-air-haze',
    category: 'atmospheric-context',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    weatherEngineClaim: false,
    atmosphericSimulationClaim: false,
    visualValidationClaim: false
  }),

  manorContext: Object.freeze({
    materialKey: 'manorContext',
    className: 'h-earth-material-manor-context',
    cssVariablePrefix: '--h-earth-manor-context',
    category: 'hearth-context',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    manorInteriorAccessClaim: false,
    visualValidationClaim: false
  }),

  distantRock: Object.freeze({
    materialKey: 'distantRock',
    className: 'h-earth-material-distant-rock',
    cssVariablePrefix: '--h-earth-distant-rock',
    category: 'audralia-context',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    distantTraversalClaim: false,
    visualValidationClaim: false
  }),

  inspectionAnchor: Object.freeze({
    materialKey: 'inspectionAnchor',
    className: 'h-earth-material-inspection-anchor',
    cssVariablePrefix: '--h-earth-inspection-anchor',
    category: 'inspection-descriptor',
    candidateMaterialOnly: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    actionExecutionClaim: false,
    receiptCreationClaim: false,
    visualValidationClaim: false
  }),

  unresolved: Object.freeze({
    materialKey: 'unresolved',
    className: 'h-earth-material-unresolved',
    cssVariablePrefix: '--h-earth-material-unresolved',
    category: 'unresolved-material',
    candidateMaterialOnly: true,
    fallbackMaterial: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    visualValidationClaim: false
  })
});

export const H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP = Object.freeze({
  contouredTerrainBand: 'h-earth-primitive-contoured-terrain-band',
  terrainBand: 'h-earth-primitive-terrain-band',
  irregularShorelineBand: 'h-earth-primitive-irregular-shoreline-band',
  waterDepthBand: 'h-earth-primitive-water-depth-band',
  waterPlane: 'h-earth-primitive-water-plane',
  scatterCluster: 'h-earth-primitive-scatter-cluster',
  rockCluster: 'h-earth-primitive-rock-cluster',
  atmosphericLayer: 'h-earth-primitive-atmospheric-layer',
  layeredSilhouette: 'h-earth-primitive-layered-silhouette',
  distantCluster: 'h-earth-primitive-distant-cluster',
  inspectionAnchor: 'h-earth-primitive-inspection-anchor',
  unresolved: 'h-earth-primitive-unresolved'
});

export const H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP = Object.freeze({
  contouredTerrainBand: 'h-earth-landscape-ground-plane',
  terrainBand: 'h-earth-landscape-ground-plane',
  irregularShorelineBand: 'h-earth-landscape-shoreline-band',
  waterDepthBand: 'h-earth-landscape-water-band',
  waterPlane: 'h-earth-landscape-water-plane',
  scatterCluster: 'h-earth-landscape-surface-detail',
  rockCluster: 'h-earth-landscape-rock-cluster',
  atmosphericLayer: 'h-earth-landscape-atmosphere',
  layeredSilhouette: 'h-earth-landscape-context-silhouette',
  distantCluster: 'h-earth-landscape-distant-cluster',
  inspectionAnchor: 'h-earth-landscape-inspection-anchor',
  unresolved: 'h-earth-landscape-unresolved'
});

export const H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY = Object.freeze({
  contouredTerrainBand: 'wetSand',
  terrainBand: 'drySand',
  irregularShorelineBand: 'foam',
  waterDepthBand: 'nearshoreWave',
  waterPlane: 'water',
  scatterCluster: 'tidePool',
  rockCluster: 'jaggedRock',
  atmosphericLayer: 'airHaze',
  layeredSilhouette: 'manorContext',
  distantCluster: 'distantRock',
  inspectionAnchor: 'inspectionAnchor'
});

export const H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP = Object.freeze({
  PRIMARY_INSPECTION_TARGET: Object.freeze({
    classification: 'PRIMARY_INSPECTION_TARGET',
    className: 'h-earth-context-primary-inspection',
    contextOnly: false
  }),

  SUPPORTING_INSPECTION_TARGET: Object.freeze({
    classification: 'SUPPORTING_INSPECTION_TARGET',
    className: 'h-earth-context-supporting-inspection',
    contextOnly: false
  }),

  SECONDARY_SURFACE_CONTEXT: Object.freeze({
    classification: 'SECONDARY_SURFACE_CONTEXT',
    className: 'h-earth-context-secondary-surface',
    contextOnly: false
  }),

  WATER_ATMOSPHERIC_CONTEXT: Object.freeze({
    classification: 'WATER_ATMOSPHERIC_CONTEXT',
    className: 'h-earth-context-water-atmospheric',
    contextOnly: true
  }),

  HEARTH_CONTEXT_ONLY: Object.freeze({
    classification: 'HEARTH_CONTEXT_ONLY',
    className: 'h-earth-context-hearth-only',
    contextOnly: true
  }),

  AUDRALIA_CONTEXT_ONLY: Object.freeze({
    classification: 'AUDRALIA_CONTEXT_ONLY',
    className: 'h-earth-context-audralia-only',
    contextOnly: true
  }),

  CONTEXT_ONLY_TARGET: Object.freeze({
    classification: 'CONTEXT_ONLY_TARGET',
    className: 'h-earth-context-only',
    contextOnly: true
  }),

  UNCLASSIFIED_TARGET: Object.freeze({
    classification: 'UNCLASSIFIED_TARGET',
    className: 'h-earth-context-unclassified',
    contextOnly: false
  })
});

export const H_EARTH_3D_RENDER_CLASS_POLICY = Object.freeze({
  baseObjectClass: 'h-earth-render-object',
  descriptorOnlyClass: 'h-earth-render-descriptor-only',
  selectableClass: 'h-earth-target-selectable',
  inspectableClass: 'h-earth-target-inspectable',
  blockedClass: 'h-earth-target-blocked',
  contextOnlyClass: 'h-earth-target-context-only',
  layerMemberBaseClass: 'h-earth-layer-member',
  unresolvedMaterialClass: 'h-earth-material-unresolved',
  unresolvedPrimitiveClass: 'h-earth-primitive-unresolved',
  unresolvedLandscapeClass: 'h-earth-landscape-unresolved',
  unresolvedContextClass: 'h-earth-context-unclassified',

  boundary: Object.freeze({
    classPolicyOnly: true,
    createsDomNodes: false,
    bindsEvents: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export function normalizeHEarthClassToken(value, fallback = 'unresolved') {
  return (
    String(value || fallback)
      .trim()
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/[_\s]+/g, '-')
      .replace(/[^a-zA-Z0-9-]/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-|-$/g, '')
      .toLowerCase() || fallback
  );
}

export function normalizeHEarthClassArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

export function uniqueHEarthClassNames(classNames = []) {
  const seen = new Set();

  return Object.freeze(
    normalizeHEarthClassArray(classNames)
      .flatMap((value) => String(value || '').split(/\s+/))
      .map((value) => value.trim())
      .filter(Boolean)
      .filter((value) => {
        if (seen.has(value)) {
          return false;
        }

        seen.add(value);
        return true;
      })
  );
}

export function joinHEarthClassNames(classNames = []) {
  return uniqueHEarthClassNames(classNames).join(' ');
}

export function resolveHEarthObjectIdForNode(node = {}) {
  return (
    node.objectId ||
    node.dataset?.hEarthObjectId ||
    node.sourceObject?.objectId ||
    node.sourceObjectId ||
    null
  );
}

export function resolveHEarthSourceObjectIdForNode(node = {}) {
  return (
    node.sourceObjectId ||
    node.dataset?.hEarthSourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthObjectIdForNode(node)
  );
}

export function resolveHEarthParentObjectIdForNode(node = {}) {
  return (
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthObjectIdForNode(node)
  );
}

export function getHEarthIdentityCandidatesForNode(node = {}) {
  return Object.freeze(
    uniqueHEarthClassNames([
      resolveHEarthObjectIdForNode(node),
      resolveHEarthSourceObjectIdForNode(node),
      resolveHEarthParentObjectIdForNode(node),
      node.geometryExpansion?.parentObjectId,
      node.geometryParentObjectId,
      node.sourceObject?.objectId
    ])
  );
}

export function resolveHEarthNodeIdForNode(node = {}) {
  return (
    node.sourceNodeId ||
    node.nodeId ||
    node.composedNodeId ||
    node.dataset?.hEarthRenderNodeId ||
    null
  );
}

export function resolveHEarthParentPrimitiveTypeForNode(node = {}) {
  return (
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    node.originalPrimitiveType ||
    null
  );
}

export function resolveHEarthPrimitiveTypeForNode(node = {}) {
  return (
    node.primitiveType ||
    node.primitive?.primitiveType ||
    node.primitiveSchema?.primitiveType ||
    node.geometryExpansion?.childPrimitiveType ||
    resolveHEarthParentPrimitiveTypeForNode(node) ||
    'unresolved'
  );
}

export function resolveHEarthMaterialKeyForNode(node = {}) {
  const parentPrimitiveType = resolveHEarthParentPrimitiveTypeForNode(node);
  const mappedMaterialKey =
    H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY[parentPrimitiveType];

  return (
    node.canonicalMaterialKey ||
    node.materialKey ||
    node.geometryExpansion?.canonicalMaterialKey ||
    node.geometryExpansion?.childMaterialKey ||
    node.geometryExpansion?.parentMaterialKey ||
    node.materialToken?.materialKey ||
    node.material?.materialKey ||
    node.sourceObject?.materialKey ||
    node.sourceObject?.materialToken?.materialKey ||
    node.sourceObject?.materialIdentity?.materialKey ||
    mappedMaterialKey ||
    'unresolved'
  );
}

export function resolveHEarthCanonicalMaterialKeyForNode(node = {}) {
  const parentPrimitiveType = resolveHEarthParentPrimitiveTypeForNode(node);
  const mappedMaterialKey =
    H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY[parentPrimitiveType];

  return (
    node.canonicalMaterialKey ||
    node.geometryExpansion?.canonicalMaterialKey ||
    mappedMaterialKey ||
    resolveHEarthMaterialKeyForNode(node)
  );
}

export function resolveHEarthLayerIdForNode(node = {}) {
  return (
    node.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    node.sourceObject?.layerId ||
    'unclassified-render-layer'
  );
}

export function resolveHEarthLayerMemberClassNameForNode(node = {}) {
  return (
    node.layerMemberClassName ||
    node.geometryExpansion?.layerMemberClassName ||
    `h-earth-layer-member-${normalizeHEarthClassToken(
      String(resolveHEarthLayerIdForNode(node)).replace(/-layer$/, '')
    )}`
  );
}

export function getHEarthMaterialClassForNode(node = {}) {
  const materialKey = resolveHEarthMaterialKeyForNode(node);
  const canonicalMaterialKey = resolveHEarthCanonicalMaterialKeyForNode(node);

  const material =
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[materialKey] ||
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP.unresolved;

  const canonicalMaterial =
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[canonicalMaterialKey] ||
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[materialKey] ||
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP.unresolved;

  const geometryProvidedClass =
    node.canonicalMaterialClassName ||
    node.geometryExpansion?.canonicalMaterialClassName ||
    node.materialClassName ||
    null;

  const classNames = uniqueHEarthClassNames([
    canonicalMaterial.className,
    material.className,
    geometryProvidedClass
  ]);

  const fallbackUsed =
    material.materialKey === 'unresolved' &&
    canonicalMaterial.materialKey === 'unresolved';

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    materialKey: material.materialKey,
    canonicalMaterialKey: canonicalMaterial.materialKey,
    className: classNames[0] || H_EARTH_3D_RENDER_CLASS_POLICY.unresolvedMaterialClass,
    classNames,
    cssVariablePrefix: material.cssVariablePrefix,
    category: material.category,

    resolved: fallbackUsed === false,
    fallbackUsed,
    geometryProvidedClassUsed: Boolean(geometryProvidedClass),
    candidateMaterialOnly: true,

    webglMaterialClaim: false,
    canvasMaterialClaim: false,
    physicalMaterialClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthPrimitiveClassForNode(node = {}) {
  const primitiveType = resolveHEarthPrimitiveTypeForNode(node);
  const parentPrimitiveType = resolveHEarthParentPrimitiveTypeForNode(node);
  const canonicalPrimitiveClassName =
    node.canonicalPrimitiveClassName ||
    node.geometryExpansion?.canonicalPrimitiveClassName ||
    H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP[parentPrimitiveType] ||
    H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP[primitiveType] ||
    H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP.unresolved;

  const detailPrimitiveClassName =
    node.detailPrimitiveClassName ||
    node.primitiveGeometry?.detailPrimitiveClassName ||
    (
      primitiveType && primitiveType !== parentPrimitiveType
        ? `h-earth-primitive-${normalizeHEarthClassToken(primitiveType)}`
        : null
    );

  const primitiveClassName =
    node.primitiveClassName ||
    canonicalPrimitiveClassName ||
    `h-earth-primitive-${normalizeHEarthClassToken(primitiveType)}`;

  const classNames = uniqueHEarthClassNames([
    canonicalPrimitiveClassName,
    primitiveClassName,
    detailPrimitiveClassName
  ]);

  const fallbackUsed =
    primitiveType === 'unresolved' ||
    classNames.includes(H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP.unresolved);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    primitiveType,
    parentPrimitiveType,
    canonicalPrimitiveClassName,
    primitiveClassName,
    detailPrimitiveClassName,
    className: classNames[0] || H_EARTH_3D_RENDER_CLASS_POLICY.unresolvedPrimitiveClass,
    classNames,

    resolved: fallbackUsed === false,
    fallbackUsed,
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthLandscapeClassForNode(node = {}) {
  const primitiveType = resolveHEarthPrimitiveTypeForNode(node);
  const parentPrimitiveType = resolveHEarthParentPrimitiveTypeForNode(node);

  const canonicalLandscapeClassName =
    node.canonicalLandscapeClassName ||
    node.geometryExpansion?.canonicalLandscapeClassName ||
    H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP[parentPrimitiveType] ||
    H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP[primitiveType] ||
    H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP.unresolved;

  const canonicalLandscapeFamilyClassName =
    node.canonicalLandscapeFamilyClassName ||
    node.primitiveGeometry?.canonicalLandscapeFamilyClassName ||
    null;

  const detailLandscapeClassName =
    node.detailLandscapeClassName ||
    node.primitiveGeometry?.detailLandscapeClassName ||
    null;

  const landscapeClassName =
    node.landscapeClassName ||
    canonicalLandscapeClassName ||
    H_EARTH_3D_RENDER_CLASS_POLICY.unresolvedLandscapeClass;

  const classNames = uniqueHEarthClassNames([
    canonicalLandscapeClassName,
    canonicalLandscapeFamilyClassName,
    landscapeClassName,
    detailLandscapeClassName
  ]);

  const fallbackUsed =
    classNames.includes(H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP.unresolved);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    canonicalLandscapeClassName,
    canonicalLandscapeFamilyClassName,
    landscapeClassName,
    detailLandscapeClassName,
    className: classNames[0] || H_EARTH_3D_RENDER_CLASS_POLICY.unresolvedLandscapeClass,
    classNames,

    resolved: fallbackUsed === false,
    fallbackUsed,
    candidateLandscapeOnly: true,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthClassificationForNode(node = {}, controller) {
  const identityCandidates = getHEarthIdentityCandidatesForNode(node);

  if (
    controller &&
    typeof controller.getControllerTargetClassification === 'function'
  ) {
    for (const candidate of identityCandidates) {
      const classification =
        controller.getControllerTargetClassification(candidate);

      if (classification) {
        return classification;
      }
    }
  }

  for (const candidate of identityCandidates) {
    if (controller?.selectableTargetRegistry?.[candidate]?.classification) {
      return controller.selectableTargetRegistry[candidate].classification;
    }
  }

  for (const candidate of identityCandidates) {
    if (controller?.inspectionTargetModel?.primaryInspectionTarget === candidate) {
      return 'PRIMARY_INSPECTION_TARGET';
    }

    if (
      controller?.inspectionTargetModel?.supportingInspectionTargets?.includes?.(
        candidate
      )
    ) {
      return 'SUPPORTING_INSPECTION_TARGET';
    }

    if (
      controller?.inspectionTargetModel?.secondarySurfaceContextTargets?.includes?.(
        candidate
      )
    ) {
      return 'SECONDARY_SURFACE_CONTEXT';
    }

    if (
      controller?.inspectionTargetModel?.waterAtmosphericContextTargets?.includes?.(
        candidate
      )
    ) {
      return 'WATER_ATMOSPHERIC_CONTEXT';
    }

    if (
      controller?.inspectionTargetModel?.hearthContextTargets?.includes?.(candidate)
    ) {
      return 'HEARTH_CONTEXT_ONLY';
    }

    if (
      controller?.inspectionTargetModel?.audraliaContextTargets?.includes?.(candidate)
    ) {
      return 'AUDRALIA_CONTEXT_ONLY';
    }

    if (
      controller?.inspectionTargetModel?.contextOnlyTargets?.includes?.(candidate)
    ) {
      return 'CONTEXT_ONLY_TARGET';
    }
  }

  if (node.contextOnly === true || node.sourceObject?.contextOnly === true) {
    return 'CONTEXT_ONLY_TARGET';
  }

  if (node.geometryExpansion?.parentPrimitiveType === 'layeredSilhouette') {
    return 'HEARTH_CONTEXT_ONLY';
  }

  if (node.geometryExpansion?.parentPrimitiveType === 'distantCluster') {
    return 'AUDRALIA_CONTEXT_ONLY';
  }

  if (
    node.geometryExpansion?.parentPrimitiveType === 'waterPlane' ||
    node.geometryExpansion?.parentPrimitiveType === 'waterDepthBand' ||
    node.geometryExpansion?.parentPrimitiveType === 'atmosphericLayer'
  ) {
    return 'WATER_ATMOSPHERIC_CONTEXT';
  }

  return 'UNCLASSIFIED_TARGET';
}

export function getHEarthContextClassForNode(node = {}, controller) {
  const classification = resolveHEarthClassificationForNode(node, controller);
  const context =
    H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP[classification] ||
    H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP.UNCLASSIFIED_TARGET;

  const fallbackUsed = context.classification === 'UNCLASSIFIED_TARGET';

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    classification: context.classification,
    className: context.className,
    classNames: Object.freeze([context.className]),

    resolved: fallbackUsed === false,
    fallbackUsed,
    contextOnly: context.contextOnly === true,
    parentAwareResolution: true,

    traversalClaim: false,
    swimmingClaim: false,
    fluidSimulationClaim: false,
    manorInteriorAccessClaim: false,
    distantTraversalClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthControllerTargetForNode(node = {}, controller) {
  const identityCandidates = getHEarthIdentityCandidatesForNode(node);

  for (const candidate of identityCandidates) {
    if (controller?.selectableTargetRegistry?.[candidate]) {
      return Object.freeze({
        objectId: candidate,
        target: controller.selectableTargetRegistry[candidate],
        source: 'selectableTargetRegistry',
        found: true,
        parentAwareResolution: true
      });
    }
  }

  return Object.freeze({
    objectId: identityCandidates[0] || null,
    target: null,
    source: 'none',
    found: false,
    parentAwareResolution: true
  });
}

export function getHEarthInteractionClassForNode(node = {}, controller) {
  const controllerTarget = resolveHEarthControllerTargetForNode(node, controller);
  const target = controllerTarget.target;
  const context = getHEarthContextClassForNode(node, controller);

  const selectable =
    target?.selectable === true ||
    target?.isSelectable === true ||
    node.selectable === true ||
    node.controllerTarget?.selectable === true;

  const inspectable =
    target?.inspectable === true ||
    target?.isInspectable === true ||
    node.inspectable === true ||
    node.controllerTarget?.inspectable === true;

  const contextOnly = context.contextOnly === true;

  const classNames = uniqueHEarthClassNames([
    selectable ? H_EARTH_3D_RENDER_CLASS_POLICY.selectableClass : null,
    inspectable ? H_EARTH_3D_RENDER_CLASS_POLICY.inspectableClass : null,
    contextOnly ? H_EARTH_3D_RENDER_CLASS_POLICY.contextOnlyClass : null,
    selectable === false && inspectable === false && contextOnly === false
      ? H_EARTH_3D_RENDER_CLASS_POLICY.blockedClass
      : null
  ]);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    resolvedControllerTargetId: controllerTarget.objectId,
    nodeId: resolveHEarthNodeIdForNode(node),

    selectable,
    inspectable,
    contextOnly,
    classNames,
    className: joinHEarthClassNames(classNames),
    targetFound: controllerTarget.found,
    targetResolutionSource: controllerTarget.source,
    parentAwareResolution: true,

    domEventBindingClaim: false,
    gameplayExecutionClaim: false,
    actionExecutionClaim: false,
    readoutProductionClaim: false,
    receiptCreationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthLayerClassForNode(node = {}) {
  const layerId = resolveHEarthLayerIdForNode(node);
  const layerMemberClassName = resolveHEarthLayerMemberClassNameForNode(node);
  const layerClassName =
    node.layerClassName ||
    node.geometryExpansion?.layerClassName ||
    `h-earth-layer-${normalizeHEarthClassToken(
      String(layerId).replace(/-layer$/, '')
    )}`;

  const classNames = uniqueHEarthClassNames([
    H_EARTH_3D_RENDER_CLASS_POLICY.layerMemberBaseClass,
    layerMemberClassName
  ]);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    layerId,
    layerClassName,
    layerMemberClassName,
    classNames,
    className: joinHEarthClassNames(classNames),
    objectLayerMembershipClassRequired: true,

    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthObjectClassForNode(node = {}) {
  const objectId = resolveHEarthObjectIdForNode(node);
  const sourceObjectId = resolveHEarthSourceObjectIdForNode(node);
  const parentObjectId = resolveHEarthParentObjectIdForNode(node);

  return Object.freeze({
    objectId,
    sourceObjectId,
    parentObjectId,
    nodeId: resolveHEarthNodeIdForNode(node),

    objectClassName: `h-earth-object-${normalizeHEarthClassToken(objectId)}`,
    sourceObjectClassName: `h-earth-source-object-${normalizeHEarthClassToken(
      sourceObjectId
    )}`,
    parentObjectClassName: `h-earth-parent-object-${normalizeHEarthClassToken(
      parentObjectId
    )}`,

    classNames: uniqueHEarthClassNames([
      `h-earth-object-${normalizeHEarthClassToken(objectId)}`,
      `h-earth-source-object-${normalizeHEarthClassToken(sourceObjectId)}`,
      `h-earth-parent-object-${normalizeHEarthClassToken(parentObjectId)}`
    ]),

    parentAwareResolution: true,
    claimBoundaryPreserved: true
  });
}

export function getHEarthGeometryClassForNode(node = {}) {
  const classNames = uniqueHEarthClassNames([
    node.geometryClassNames,
    node.renumerizedClassNames,
    node.geometryClassName,
    node.renumerizedClassName,
    node.geometryProfileClassName,
    node.geometryNodeClassName,
    node.geometryRoleClassName
  ]);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    sourceObjectId: resolveHEarthSourceObjectIdForNode(node),
    parentObjectId: resolveHEarthParentObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),

    classNames,
    className: joinHEarthClassNames(classNames),
    geometryProvidedClassReadyDescriptor:
      node.classReadyDescriptor === true ||
      node.visualGrammarReadyDescriptor === true ||
      classNames.length > 0,

    candidateGeometryOnly: node.candidateGeometryOnly === true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthMaterialDataset(node = {}) {
  const material = getHEarthMaterialClassForNode(node);
  const primitive = getHEarthPrimitiveClassForNode(node);
  const landscape = getHEarthLandscapeClassForNode(node);
  const layer = getHEarthLayerClassForNode(node);
  const context = getHEarthContextClassForNode(node, null);

  return Object.freeze({
    hEarthMaterialKey: material.materialKey,
    hEarthCanonicalMaterialKey: material.canonicalMaterialKey,
    hEarthMaterialCategory: material.category,
    hEarthPrimitiveType: primitive.primitiveType,
    hEarthParentPrimitiveType: primitive.parentPrimitiveType || '',
    hEarthLayerId: layer.layerId,
    hEarthContextClassification: context.classification,
    hEarthCandidateMaterialOnly: 'true',
    hEarthMaterialValidationClaim: 'false',
    hEarthVisualPassClaim: 'false',
    hEarthRenumerizedClassReady: 'true'
  });
}

export function getHEarthRenderClassesForNode(node = {}, controller) {
  const object = getHEarthObjectClassForNode(node);
  const geometry = getHEarthGeometryClassForNode(node);
  const material = getHEarthMaterialClassForNode(node);
  const primitive = getHEarthPrimitiveClassForNode(node);
  const landscape = getHEarthLandscapeClassForNode(node);
  const layer = getHEarthLayerClassForNode(node);
  const context = getHEarthContextClassForNode(node, controller);
  const interaction = getHEarthInteractionClassForNode(node, controller);

  const classNames = uniqueHEarthClassNames([
    H_EARTH_3D_RENDER_CLASS_POLICY.baseObjectClass,
    H_EARTH_3D_RENDER_CLASS_POLICY.descriptorOnlyClass,

    object.classNames,
    geometry.classNames,
    material.classNames,
    primitive.classNames,
    landscape.classNames,
    layer.classNames,
    context.classNames,
    interaction.classNames
  ]);

  const resolved =
    Boolean(object.objectId) &&
    material.resolved === true &&
    primitive.resolved === true &&
    landscape.resolved === true &&
    classNames.length > 0;

  const fallbackUsed =
    material.fallbackUsed === true ||
    primitive.fallbackUsed === true ||
    landscape.fallbackUsed === true ||
    context.fallbackUsed === true;

  return Object.freeze({
    objectId: object.objectId,
    sourceObjectId: object.sourceObjectId,
    parentObjectId: object.parentObjectId,
    nodeId: resolveHEarthNodeIdForNode(node),

    classNames,
    className: joinHEarthClassNames(classNames),

    object,
    geometry,
    material,
    primitive,
    landscape,
    layer,
    context,
    interaction,

    resolved,
    fallbackUsed,

    parentAwareGeometryChildResolution: true,
    completeClassArrayReturned: true,
    canonicalAndDetailClassGrammarPreserved: true,
    visualGrammarReadyDescriptor:
      geometry.geometryProvidedClassReadyDescriptor === true ||
      node.visualGrammarReadyDescriptor === true ||
      node.classReadyDescriptor === true,

    boundary: Object.freeze({
      classResolutionOnly: true,
      createsDomNodes: false,
      touchesDom: false,
      bindsEvents: false,
      candidateMaterialOnly: true,
      finalMaterialClaim: false,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      traversalClaim: false,
      simulationClaim: false,
      matrixCollapse: false,
      claimBoundaryPreserved: true
    })
  });
}

export const H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT',
  file: '/showroom/globe/h-earth/render/materials.js',
  contractId: H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT.contractId,
  renewedFrom: H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT.renewedFrom,
  parentStandard: H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT.parentStandard,
  parentGeometryRenewal:
    H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT.parentGeometryRenewal,

  materialClassMapDefined: true,
  primitiveClassMapDefined: true,
  landscapeClassMapDefined: true,
  contextClassMapDefined: true,
  classPolicyDefined: true,

  parentAwareIdentityResolutionDefined: true,
  geometryClassReadyDescriptorConsumptionDefined: true,
  completeClassArrayEmissionDefined: true,
  canonicalAndDetailClassGrammarPreserved: true,
  objectLayerMembershipClassConsumptionDefined: true,

  requiredMaterialCategories: Object.freeze([
    'wetSand',
    'drySand',
    'foam',
    'tidePool',
    'stone',
    'jaggedRock',
    'water',
    'nearshoreWave',
    'airHaze',
    'manorContext',
    'distantRock',
    'inspectionAnchor'
  ]),

  createsDomNodes: false,
  touchesDom: false,
  importsRenderer: false,
  importsCompositor: false,
  importsController: false,

  boundary: Object.freeze({
    materialPortOnly: true,
    renumerizationPortOnly: true,
    webglMaterialClaim: false,
    canvasClaim: false,
    physicalMaterialValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    traversalClaim: false,
    simulationClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export function getRenderMaterialPortReceipt() {
  return H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT;
}

export const H_EARTH_3D_RENDER_MATERIAL_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_MATERIAL_PORT',
  file: '/showroom/globe/h-earth/render/materials.js',

  contract: H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT,
  classMap: H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP,
  materialClassMap: H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP,
  primitiveClassMap: H_EARTH_3D_RENDER_PRIMITIVE_CLASS_MAP,
  landscapeClassMap: H_EARTH_3D_RENDER_LANDSCAPE_CLASS_MAP,
  parentPrimitiveToMaterialKey: H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY,
  contextClassMap: H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP,
  classPolicy: H_EARTH_3D_RENDER_CLASS_POLICY,

  normalizeClassToken: normalizeHEarthClassToken,
  normalizeClassArray: normalizeHEarthClassArray,
  uniqueClassNames: uniqueHEarthClassNames,
  joinClassNames: joinHEarthClassNames,

  resolveObjectId: resolveHEarthObjectIdForNode,
  resolveSourceObjectId: resolveHEarthSourceObjectIdForNode,
  resolveParentObjectId: resolveHEarthParentObjectIdForNode,
  getIdentityCandidates: getHEarthIdentityCandidatesForNode,
  resolveNodeId: resolveHEarthNodeIdForNode,
  resolveParentPrimitiveType: resolveHEarthParentPrimitiveTypeForNode,
  resolvePrimitiveType: resolveHEarthPrimitiveTypeForNode,
  resolveMaterialKey: resolveHEarthMaterialKeyForNode,
  resolveCanonicalMaterialKey: resolveHEarthCanonicalMaterialKeyForNode,
  resolveLayerId: resolveHEarthLayerIdForNode,
  resolveLayerMemberClassName: resolveHEarthLayerMemberClassNameForNode,
  resolveClassification: resolveHEarthClassificationForNode,
  resolveControllerTarget: resolveHEarthControllerTargetForNode,

  getObjectClassForNode: getHEarthObjectClassForNode,
  getGeometryClassForNode: getHEarthGeometryClassForNode,
  getMaterialClassForNode: getHEarthMaterialClassForNode,
  getPrimitiveClassForNode: getHEarthPrimitiveClassForNode,
  getLandscapeClassForNode: getHEarthLandscapeClassForNode,
  getLayerClassForNode: getHEarthLayerClassForNode,
  getContextClassForNode: getHEarthContextClassForNode,
  getInteractionClassForNode: getHEarthInteractionClassForNode,
  getRenderClassesForNode: getHEarthRenderClassesForNode,
  getMaterialDataset: getHEarthMaterialDataset,
  getReceipt: getRenderMaterialPortReceipt,

  receipt: H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT
});

export default H_EARTH_3D_RENDER_MATERIAL_PORT;
