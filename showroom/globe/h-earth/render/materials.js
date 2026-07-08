// /showroom/globe/h-earth/render/materials.js
// NEW FILE
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1
//
// Purpose:
// Material/class mapping port for the H-Earth DOM/CSS-3D Candidate Renderer.
//
// This file maps candidate render/composed descriptors to safe CSS class names,
// context class names, primitive class names, interaction class names, and
// material metadata.
//
// This file does not create DOM nodes, touch DOM, import renderer.js, import
// compositor.js, import controller.js, create WebGL/canvas materials, claim
// physical material validation, claim renderer pass, claim visual pass, claim
// validation, claim production, authorize traversal, authorize simulation,
// or collapse matrices.

export const H_EARTH_3D_RENDER_MATERIAL_PORT_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',
  renewedRendererFrom: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',

  file: '/showroom/globe/h-earth/render/materials.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_MATERIAL_CLASS_PORT',
  status: 'MATERIAL_CLASS_PORT_DEFINED_NON_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

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
    matrixCollapse: false
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
  selectableClass: 'h-earth-target-selectable',
  inspectableClass: 'h-earth-target-inspectable',
  blockedClass: 'h-earth-target-blocked',
  contextOnlyClass: 'h-earth-target-context-only',
  unresolvedMaterialClass: 'h-earth-material-unresolved',
  unresolvedContextClass: 'h-earth-context-unclassified',

  boundary: Object.freeze({
    classPolicyOnly: true,
    createsDomNodes: false,
    bindsEvents: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  })
});

export function normalizeHEarthClassToken(value) {
  return String(value || 'unresolved')
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || 'unresolved';
}

export function resolveHEarthObjectIdForNode(node) {
  return (
    node?.objectId ||
    node?.dataset?.hEarthObjectId ||
    node?.sourceObjectId ||
    null
  );
}

export function resolveHEarthNodeIdForNode(node) {
  return (
    node?.sourceNodeId ||
    node?.nodeId ||
    node?.composedNodeId ||
    node?.dataset?.hEarthRenderNodeId ||
    null
  );
}

export function resolveHEarthMaterialKeyForNode(node) {
  return (
    node?.materialKey ||
    node?.materialToken?.materialKey ||
    node?.material?.materialKey ||
    'unresolved'
  );
}

export function getHEarthMaterialClassForNode(node) {
  const materialKey = resolveHEarthMaterialKeyForNode(node);
  const material =
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP[materialKey] ||
    H_EARTH_3D_RENDER_MATERIAL_CLASS_MAP.unresolved;

  const fallbackUsed = material.materialKey === 'unresolved';

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),
    materialKey: material.materialKey,
    className: material.className,
    cssVariablePrefix: material.cssVariablePrefix,
    category: material.category,
    resolved: fallbackUsed === false,
    fallbackUsed,
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

export function resolveHEarthClassificationForNode(node, controller) {
  const objectId = resolveHEarthObjectIdForNode(node);

  if (
    objectId &&
    controller &&
    typeof controller.getControllerTargetClassification === 'function'
  ) {
    return controller.getControllerTargetClassification(objectId);
  }

  if (
    objectId &&
    controller?.selectableTargetRegistry &&
    controller.selectableTargetRegistry[objectId]?.classification
  ) {
    return controller.selectableTargetRegistry[objectId].classification;
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.primaryInspectionTarget === objectId
  ) {
    return 'PRIMARY_INSPECTION_TARGET';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.supportingInspectionTargets?.includes?.(objectId)
  ) {
    return 'SUPPORTING_INSPECTION_TARGET';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.secondarySurfaceContextTargets?.includes?.(objectId)
  ) {
    return 'SECONDARY_SURFACE_CONTEXT';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.waterAtmosphericContextTargets?.includes?.(objectId)
  ) {
    return 'WATER_ATMOSPHERIC_CONTEXT';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.hearthContextTargets?.includes?.(objectId)
  ) {
    return 'HEARTH_CONTEXT_ONLY';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.audraliaContextTargets?.includes?.(objectId)
  ) {
    return 'AUDRALIA_CONTEXT_ONLY';
  }

  if (
    objectId &&
    controller?.inspectionTargetModel?.contextOnlyTargets?.includes?.(objectId)
  ) {
    return 'CONTEXT_ONLY_TARGET';
  }

  return 'UNCLASSIFIED_TARGET';
}

export function getHEarthContextClassForNode(node, controller) {
  const objectId = resolveHEarthObjectIdForNode(node);
  const classification = resolveHEarthClassificationForNode(node, controller);
  const context =
    H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP[classification] ||
    H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP.UNCLASSIFIED_TARGET;

  const fallbackUsed = context.classification === 'UNCLASSIFIED_TARGET';

  return Object.freeze({
    objectId,
    nodeId: resolveHEarthNodeIdForNode(node),
    classification: context.classification,
    className: context.className,
    resolved: fallbackUsed === false,
    fallbackUsed,
    contextOnly: context.contextOnly === true,
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

export function getHEarthPrimitiveClassForNode(node) {
  const primitiveType = node?.primitiveType || 'unresolved-primitive';
  const normalizedPrimitiveType = normalizeHEarthClassToken(primitiveType);

  return Object.freeze({
    objectId: resolveHEarthObjectIdForNode(node),
    nodeId: resolveHEarthNodeIdForNode(node),
    primitiveType,
    className: `h-earth-primitive-${normalizedPrimitiveType}`,
    resolved: primitiveType !== 'unresolved-primitive',
    fallbackUsed: primitiveType === 'unresolved-primitive',
    candidateGeometryOnly: true,
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function getHEarthInteractionClassForNode(node, controller) {
  const objectId = resolveHEarthObjectIdForNode(node);
  const target =
    objectId && controller?.selectableTargetRegistry
      ? controller.selectableTargetRegistry[objectId]
      : null;

  const context = getHEarthContextClassForNode(node, controller);

  const selectable = target?.selectable === true;
  const inspectable = target?.inspectable === true;
  const contextOnly = context.contextOnly === true;

  const classNames = [
    selectable ? H_EARTH_3D_RENDER_CLASS_POLICY.selectableClass : null,
    inspectable ? H_EARTH_3D_RENDER_CLASS_POLICY.inspectableClass : null,
    contextOnly ? H_EARTH_3D_RENDER_CLASS_POLICY.contextOnlyClass : null,
    selectable === false && inspectable === false
      ? H_EARTH_3D_RENDER_CLASS_POLICY.blockedClass
      : null
  ].filter(Boolean);

  return Object.freeze({
    objectId,
    nodeId: resolveHEarthNodeIdForNode(node),
    selectable,
    inspectable,
    contextOnly,
    classNames: Object.freeze(classNames),
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

export function getHEarthMaterialDataset(node) {
  const material = getHEarthMaterialClassForNode(node);
  const primitive = getHEarthPrimitiveClassForNode(node);

  return Object.freeze({
    hEarthMaterialKey: material.materialKey,
    hEarthMaterialCategory: material.category,
    hEarthPrimitiveType: primitive.primitiveType,
    hEarthCandidateMaterialOnly: 'true',
    hEarthMaterialValidationClaim: 'false',
    hEarthVisualPassClaim: 'false'
  });
}

export function getHEarthRenderClassesForNode(node, controller) {
  const objectId = resolveHEarthObjectIdForNode(node);
  const nodeId = resolveHEarthNodeIdForNode(node);
  const material = getHEarthMaterialClassForNode(node);
  const context = getHEarthContextClassForNode(node, controller);
  const primitive = getHEarthPrimitiveClassForNode(node);
  const interaction = getHEarthInteractionClassForNode(node, controller);

  const objectClass = `h-earth-object-${normalizeHEarthClassToken(objectId)}`;

  const classNames = Object.freeze([
    H_EARTH_3D_RENDER_CLASS_POLICY.baseObjectClass,
    objectClass,
    material.className,
    context.className,
    primitive.className,
    ...interaction.classNames
  ].filter(Boolean));

  return Object.freeze({
    objectId,
    nodeId,
    classNames,
    className: classNames.join(' '),

    material,
    context,
    primitive,
    interaction,

    resolved:
      material.resolved === true &&
      primitive.resolved === true &&
      Boolean(objectId),

    fallbackUsed:
      material.fallbackUsed === true ||
      context.fallbackUsed === true ||
      primitive.fallbackUsed === true,

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
  contractId: 'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',

  materialClassMapDefined: true,
  contextClassMapDefined: true,
  classPolicyDefined: true,

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
  contextClassMap: H_EARTH_3D_RENDER_CONTEXT_CLASS_MAP,
  classPolicy: H_EARTH_3D_RENDER_CLASS_POLICY,

  normalizeClassToken: normalizeHEarthClassToken,
  getMaterialClassForNode: getHEarthMaterialClassForNode,
  getContextClassForNode: getHEarthContextClassForNode,
  getPrimitiveClassForNode: getHEarthPrimitiveClassForNode,
  getInteractionClassForNode: getHEarthInteractionClassForNode,
  getRenderClassesForNode: getHEarthRenderClassesForNode,
  getMaterialDataset: getHEarthMaterialDataset,
  getReceipt: getRenderMaterialPortReceipt,

  receipt: H_EARTH_3D_RENDER_MATERIAL_PORT_RECEIPT
});

export default H_EARTH_3D_RENDER_MATERIAL_PORT;
