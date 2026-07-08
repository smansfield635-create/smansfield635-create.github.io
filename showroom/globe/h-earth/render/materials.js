// /showroom/globe/h-earth/render/materials.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1
//
// Renews:
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1
//
// Parent standard:
// H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1
//
// Parent geometry renewal:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1
//
// Purpose:
// Optimized material-only resolver for the H-Earth DOM/CSS-3D Candidate Renderer.
//
// This file owns material-key normalization, material class lookup, material
// category metadata, canonical material fallback from parent primitive type,
// preservation of geometry-provided material class fields, and material dataset
// export.
//
// This file does not own final DOM class emission, geometry expansion,
// primitive grammar, landscape grammar, layer membership, controller target
// classification, interaction state, route shell, compositor law, renderer
// orchestration, gameplay, traversal, simulation, WebGL, canvas, visual-pass
// claims, validation claims, production claims, or matrix collapse.

export const H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1',
  renewedFrom: 'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1',

  parentStandard: 'H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1',
  parentGeometryRenewal:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/render/materials.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_TRUE_MATERIAL_RESOLUTION_PORT',
  status: 'TRUE_MATERIAL_PORT_RENUMERIZED_NON_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  owns: Object.freeze({
    materialKeyNormalization: true,
    materialClassLookup: true,
    canonicalMaterialFallback: true,
    geometryProvidedMaterialClassPreservation: true,
    materialDataset: true
  }),

  doesNotOwn: Object.freeze({
    geometryExpansion: true,
    primitiveClassGeneration: true,
    landscapeClassGeneration: true,
    layerMembershipResolution: true,
    contextClassification: true,
    interactionResolution: true,
    finalDomClassEmission: true,
    rendererOrchestration: true
  }),

  boundary: Object.freeze({
    createsDomNodes: false,
    touchesDom: false,
    definesMaterialCssClassesOnly: true,
    importsRenderer: false,
    importsCompositor: false,
    importsController: false,
    importsGeometry: false,
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
    materialFamily: 'sand',
    surfaceRole: 'primary-wet-ground',
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
    materialFamily: 'sand',
    surfaceRole: 'secondary-dry-ground',
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
    materialFamily: 'water-contact',
    surfaceRole: 'shoreline-foam-contact',
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
    materialFamily: 'water-detail',
    surfaceRole: 'reflective-puddle-detail',
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
    materialFamily: 'stone',
    surfaceRole: 'small-beach-stone-detail',
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
    materialFamily: 'rock',
    surfaceRole: 'foreground-jagged-rock-detail',
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
    materialFamily: 'water',
    surfaceRole: 'background-water-surface',
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
    materialFamily: 'water',
    surfaceRole: 'nearshore-wave-band',
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
    materialFamily: 'atmosphere',
    surfaceRole: 'air-haze-light-layer',
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
    materialFamily: 'distant-structure',
    surfaceRole: 'manor-exterior-context',
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
    materialFamily: 'distant-rock',
    surfaceRole: 'distant-rock-stack-islet-context',
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
    materialFamily: 'inspection-marker',
    surfaceRole: 'primary-ground-inspection-anchor',
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
    materialFamily: 'unresolved',
    surfaceRole: 'unresolved-material',
    candidateMaterialOnly: true,
    fallbackMaterial: true,
    webglMaterialClaim: false,
    physicalMaterialClaim: false,
    visualValidationClaim: false
  })
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

export const H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_MATERIAL_KEY = Object.freeze({
  candidateWetSandGroundPlane: 'wetSand',
  candidateWetSandContourRidge: 'wetSand',
  candidateWetSandMoisturePatch: 'wetSand',
  candidateWetSandReflectiveSheen: 'wetSand',
  candidateWetSandGrainDetail: 'wetSand',

  candidateDrySandGroundPlane: 'drySand',
  candidateDrySandTransitionRidge: 'drySand',
  candidateDrySandSurfacePatch: 'drySand',

  candidateShorelineContactBase: 'foam',
  candidateShorelineIrregularEdge: 'foam',
  candidateShorelineFoamBreak: 'foam',

  candidateNearshoreWaterDepthBase: 'nearshoreWave',
  candidateNearshoreRippleStrip: 'nearshoreWave',

  candidateWaterSurfacePlane: 'water',
  candidateWaterDepthBand: 'water',
  candidateWaterReflectionStrip: 'water',

  candidateSurfaceScatterMember: 'tidePool',
  candidateRockClusterMember: 'jaggedRock',

  candidateAirHazePanel: 'airHaze',
  candidateAirLightBand: 'airHaze',

  candidateManorContextBody: 'manorContext',
  candidateManorContextRoof: 'manorContext',
  candidateManorContextVerticalSegment: 'manorContext',

  candidateDistantWorldSilhouette: 'distantRock',
  candidateInspectionAnchorMarker: 'inspectionAnchor'
});

export const H_EARTH_3D_RENDER_MATERIAL_POLICY = Object.freeze({
  unresolvedMaterialKey: 'unresolved',
  unresolvedMaterialClassName: 'h-earth-material-unresolved',

  boundary: Object.freeze({
    materialOnlyPolicy: true,
    createsDomNodes: false,
    touchesDom: false,
    primitiveGrammarOwner: false,
    landscapeGrammarOwner: false,
    layerGrammarOwner: false,
    contextGrammarOwner: false,
    interactionGrammarOwner: false,
    finalDomClassEmissionOwner: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export function normalizeHEarthMaterialToken(value, fallback = 'unresolved') {
  const raw = String(value || fallback).trim();

  if (!raw) {
    return fallback;
  }

  const normalized = raw
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase();

  const tokenMap = Object.freeze({
    'wet-sand': 'wetSand',
    'damp-sand': 'wetSand',
    'foreground-wet-sand': 'wetSand',

    'dry-sand': 'drySand',
    'sand-transition': 'drySand',
    'dry-sand-transition': 'drySand',

    foam: 'foam',
    'shoreline-foam': 'foam',
    'foam-line': 'foam',

    'tide-pool': 'tidePool',
    'tide-pools': 'tidePool',
    puddle: 'tidePool',
    puddles: 'tidePool',

    stone: 'stone',
    stones: 'stone',
    'small-stone': 'stone',
    'small-beach-stone': 'stone',

    'jagged-rock': 'jaggedRock',
    'jagged-rocks': 'jaggedRock',
    rock: 'jaggedRock',
    rocks: 'jaggedRock',

    water: 'water',
    'water-plane': 'water',
    'water-surface': 'water',

    'nearshore-wave': 'nearshoreWave',
    'nearshore-water': 'nearshoreWave',
    wave: 'nearshoreWave',

    'air-haze': 'airHaze',
    haze: 'airHaze',
    atmosphere: 'airHaze',

    'manor-context': 'manorContext',
    manor: 'manorContext',
    'manor-exterior': 'manorContext',

    'distant-rock': 'distantRock',
    'distant-rocks': 'distantRock',
    islet: 'distantRock',
    islets: 'distantRock',

    'inspection-anchor': 'inspectionAnchor',
    anchor: 'inspectionAnchor',

    unresolved: 'unresolved'
  });

  return tokenMap[normalized] || raw || fallback;
}

export function normalizeHEarthMaterialClassArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

export function uniqueHEarthMaterialClassNames(classNames = []) {
  const seen = new Set();

  return Object.freeze(
    normalizeHEarthMaterialClassArray(classNames)
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

export function joinHEarthMaterialClassNames(classNames = []) {
  return uniqueHEarthMaterialClassNames(classNames).join(' ');
}

export function resolveHEarthMaterialObjectId(node = {}) {
  return (
    node.objectId ||
    node.sourceObject?.objectId ||
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    null
  );
}

export function resolveHEarthMaterialSourceObjectId(node = {}) {
  return (
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthMaterialObjectId(node)
  );
}

export function resolveHEarthMaterialParentObjectId(node = {}) {
  return (
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthMaterialObjectId(node)
  );
}

export function resolveHEarthMaterialNodeId(node = {}) {
  return (
    node.nodeId ||
    node.sourceNodeId ||
    node.composedNodeId ||
    node.parentNodeId ||
    node.geometryParentNodeId ||
    node.geometryExpansion?.parentNodeId ||
    null
  );
}

export function resolveHEarthMaterialParentPrimitiveType(node = {}) {
  return (
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    node.originalPrimitiveType ||
    null
  );
}

export function resolveHEarthMaterialChildPrimitiveType(node = {}) {
  return (
    node.geometryExpansion?.childPrimitiveType ||
    node.primitiveType ||
    node.primitive?.primitiveType ||
    node.primitiveSchema?.primitiveType ||
    null
  );
}

export function resolveHEarthCanonicalMaterialKeyForNode(node = {}) {
  const explicitCanonical =
    node.canonicalMaterialKey ||
    node.geometryExpansion?.canonicalMaterialKey ||
    null;

  if (explicitCanonical) {
    return normalizeHEarthMaterialToken(explicitCanonical);
  }

  const parentPrimitiveType = resolveHEarthMaterialParentPrimitiveType(node);
  const parentMapped =
    H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY[parentPrimitiveType];

  if (parentMapped) {
    return parentMapped;
  }

  const childPrimitiveType = resolveHEarthMaterialChildPrimitiveType(node);
  const childMapped =
    H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_MATERIAL_KEY[childPrimitiveType];

  if (childMapped) {
    return childMapped;
  }

  return normalizeHEarthMaterialToken(
    node.materialKey ||
      node.materialToken?.materialKey ||
      node.material?.materialKey ||
      node.sourceObject?.materialKey ||
      node.sourceObject?.materialToken?.materialKey ||
      node.sourceObject?.materialIdentity?.materialKey ||
      H_EARTH_3D_RENDER_MATERIAL_POLICY.unresolvedMaterialKey
  );
}

export function resolveHEarthMaterialKeyForNode(node = {}) {
  const rawMaterialKey =
    node.materialKey ||
    node.geometryExpansion?.childMaterialKey ||
    node.geometryExpansion?.parentMaterialKey ||
    node.materialToken?.materialKey ||
    node.material?.materialKey ||
    node.sourceObject?.materialKey ||
    node.sourceObject?.materialToken?.materialKey ||
    node.sourceObject?.materialIdentity?.materialKey ||
    null;

  if (rawMaterialKey) {
    return normalizeHEarthMaterialToken(rawMaterialKey);
  }

  return resolveHEarthCanonicalMaterialKeyForNode(node);
}

export function getHEarthMaterialDefinition(materialKey) {
  const normalizedMaterialKey = normalizeHEarthMaterialToken(materialKey);

  return (
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[normalizedMaterialKey] ||
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[
      H_EARTH_3D_RENDER_MATERIAL_POLICY.unresolvedMaterialKey
    ]
  );
}

export function getHEarthGeometryProvidedMaterialClasses(node = {}) {
  return uniqueHEarthMaterialClassNames([
    node.canonicalMaterialClassName,
    node.materialClassName,
    node.geometryExpansion?.canonicalMaterialClassName,
    node.geometryExpansion?.materialClassName,
    node.primitiveGeometry?.canonicalMaterialClassName,
    node.primitiveGeometry?.materialClassName
  ]);
}

export function getHEarthMaterialClassForNode(node = {}) {
  const materialKey = resolveHEarthMaterialKeyForNode(node);
  const canonicalMaterialKey = resolveHEarthCanonicalMaterialKeyForNode(node);

  const material = getHEarthMaterialDefinition(materialKey);
  const canonicalMaterial = getHEarthMaterialDefinition(canonicalMaterialKey);
  const geometryProvidedClassNames = getHEarthGeometryProvidedMaterialClasses(node);

  const classNames = uniqueHEarthMaterialClassNames([
    canonicalMaterial.className,
    material.className,
    geometryProvidedClassNames
  ]);

  const fallbackUsed =
    material.materialKey === H_EARTH_3D_RENDER_MATERIAL_POLICY.unresolvedMaterialKey &&
    canonicalMaterial.materialKey ===
      H_EARTH_3D_RENDER_MATERIAL_POLICY.unresolvedMaterialKey;

  return Object.freeze({
    objectId: resolveHEarthMaterialObjectId(node),
    sourceObjectId: resolveHEarthMaterialSourceObjectId(node),
    parentObjectId: resolveHEarthMaterialParentObjectId(node),
    nodeId: resolveHEarthMaterialNodeId(node),

    materialKey: material.materialKey,
    canonicalMaterialKey: canonicalMaterial.materialKey,

    className:
      classNames[0] ||
      H_EARTH_3D_RENDER_MATERIAL_POLICY.unresolvedMaterialClassName,
    classNames,
    classNameJoined: joinHEarthMaterialClassNames(classNames),

    cssVariablePrefix: material.cssVariablePrefix,
    canonicalCssVariablePrefix: canonicalMaterial.cssVariablePrefix,
    category: material.category,
    canonicalCategory: canonicalMaterial.category,
    materialFamily: material.materialFamily,
    surfaceRole: material.surfaceRole,

    geometryProvidedClassNames,
    geometryProvidedMaterialClassPreserved:
      geometryProvidedClassNames.length > 0,

    resolved: fallbackUsed === false,
    fallbackUsed,
    candidateMaterialOnly: true,

    boundary: Object.freeze({
      materialResolutionOnly: true,
      createsDomNodes: false,
      touchesDom: false,
      primitiveGrammarOwner: false,
      landscapeGrammarOwner: false,
      layerGrammarOwner: false,
      contextGrammarOwner: false,
      interactionGrammarOwner: false,
      finalDomClassEmissionOwner: false,
      webglMaterialClaim: false,
      canvasMaterialClaim: false,
      physicalMaterialClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function getHEarthMaterialDataset(node = {}) {
  const material = getHEarthMaterialClassForNode(node);

  return Object.freeze({
    hEarthMaterialKey: material.materialKey,
    hEarthCanonicalMaterialKey: material.canonicalMaterialKey,
    hEarthMaterialCategory: material.category,
    hEarthCanonicalMaterialCategory: material.canonicalCategory,
    hEarthMaterialFamily: material.materialFamily,
    hEarthMaterialSurfaceRole: material.surfaceRole,
    hEarthMaterialCssVariablePrefix: material.cssVariablePrefix,
    hEarthCandidateMaterialOnly: 'true',
    hEarthMaterialValidationClaim: 'false',
    hEarthVisualPassClaim: 'false',
    hEarthPhysicalMaterialClaim: 'false',
    hEarthWebglMaterialClaim: 'false'
  });
}

export function getHEarthRenderClassesForNode(node = {}) {
  const material = getHEarthMaterialClassForNode(node);

  return Object.freeze({
    objectId: material.objectId,
    sourceObjectId: material.sourceObjectId,
    parentObjectId: material.parentObjectId,
    nodeId: material.nodeId,

    classNames: material.classNames,
    className: material.classNameJoined || material.className,

    material,

    resolved: material.resolved,
    fallbackUsed: material.fallbackUsed,

    materialOnlyClassResolution: true,
    completeRenderClassStackOwner: false,
    finalDomClassEmissionOwner: false,

    boundary: Object.freeze({
      materialClassResolutionOnly: true,
      createsDomNodes: false,
      touchesDom: false,
      bindsEvents: false,
      primitiveGrammarOwner: false,
      landscapeGrammarOwner: false,
      layerGrammarOwner: false,
      contextGrammarOwner: false,
      interactionGrammarOwner: false,
      finalDomClassEmissionOwner: false,
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
  parentPrimitiveToMaterialFallbackDefined: true,
  childPrimitiveToMaterialFallbackDefined: true,
  materialKeyNormalizationDefined: true,
  geometryProvidedMaterialClassPreservationDefined: true,
  materialDatasetDefined: true,
  materialOnlyClassResolutionDefined: true,

  primitiveClassGenerationOwnedHere: false,
  landscapeClassGenerationOwnedHere: false,
  layerMembershipResolutionOwnedHere: false,
  contextClassificationOwnedHere: false,
  interactionResolutionOwnedHere: false,
  finalDomClassEmissionOwnedHere: false,

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
  importsGeometry: false,

  boundary: Object.freeze({
    materialPortOnly: true,
    trueMaterialResolver: true,
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
  parentPrimitiveToMaterialKey: H_EARTH_3D_RENDER_PARENT_PRIMITIVE_TO_MATERIAL_KEY,
  childPrimitiveToMaterialKey: H_EARTH_3D_RENDER_CHILD_PRIMITIVE_TO_MATERIAL_KEY,
  policy: H_EARTH_3D_RENDER_MATERIAL_POLICY,

  normalizeMaterialToken: normalizeHEarthMaterialToken,
  normalizeClassArray: normalizeHEarthMaterialClassArray,
  uniqueClassNames: uniqueHEarthMaterialClassNames,
  joinClassNames: joinHEarthMaterialClassNames,

  resolveObjectId: resolveHEarthMaterialObjectId,
  resolveSourceObjectId: resolveHEarthMaterialSourceObjectId,
  resolveParentObjectId: resolveHEarthMaterialParentObjectId,
  resolveNodeId: resolveHEarthMaterialNodeId,
  resolveParentPrimitiveType: resolveHEarthMaterialParentPrimitiveType,
  resolveChildPrimitiveType: resolveHEarthMaterialChildPrimitiveType,
  resolveCanonicalMaterialKey: resolveHEarthCanonicalMaterialKeyForNode,
  resolveMaterialKey: resolveHEarthMaterialKeyForNode,

  getMaterialDefinition: getHEarthMaterialDefinition,
  getGeometryProvidedMaterialClasses: getHEarthGeometryProvidedMaterialClasses,
  getMaterialClassForNode: getHEarthMaterialClassForNode,
  getRenderClassesForNode: getHEarthRenderClassesForNode,
  getMaterialDataset: getHEarthMaterialDataset,
  getReceipt: getRenderMaterialPortReceipt,

  receipt: H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT
});

export default H_EARTH_3D_RENDER_MATERIAL_PORT;
