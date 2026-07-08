// /showroom/globe/h-earth/render/nodes.js
// COMPLETE RENEWED FILE
// H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_031H_FINAL_DOM_CLASS_EMISSION_RENUMERIZATION_RENEWAL_v1
//
// Renews:
// H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_023A_v1
//
// Parent standard:
// H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1
//
// Upstream support renewals:
// H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1
// H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1
// H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_031G_TRUE_LAYER_RENUMERIZATION_RENEWAL_v1
//
// Purpose:
// Final DOM node factory and class-emission authority for the H-Earth
// DOM/CSS-3D Candidate Renderer.
//
// This file creates renderer-owned DOM nodes and emits the complete live
// classList surface required by CSS. It consumes class-ready descriptors from
// geometry.js, material-only grammar from materials.js, and layer-membership
// grammar from layers.js.
//
// This file does not own geometry expansion, material lookup law, layer
// placement law, compositor law, controller classification law, route shell,
// route CSS, WebGL, canvas, traversal, simulation, validation, production,
// or matrix collapse.

export const H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT = Object.freeze({
  contractId:
    'H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_031H_FINAL_DOM_CLASS_EMISSION_RENUMERIZATION_RENEWAL_v1',
  renewedFrom: 'H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_023A_v1',

  parentStandard: 'H_EARTH_RENDER_SUPPORT_RENUMERIZATION_UNIFICATION_STANDARD_v1',
  parentGeometryRenewal:
    'H_EARTH_3D_RENDER_GEOMETRY_PORT_FILE_BIRTH_STEP_031E_SUPPORT_PORT_RENUMERIZATION_RENEWAL_v1',
  parentMaterialRenewal:
    'H_EARTH_3D_RENDER_MATERIAL_PORT_FILE_BIRTH_STEP_031F_TRUE_MATERIAL_RENUMERIZATION_RENEWAL_v1',
  parentLayerRenewal:
    'H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_031G_TRUE_LAYER_RENUMERIZATION_RENEWAL_v1',

  file: '/showroom/globe/h-earth/render/nodes.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_FINAL_NODE_CLASS_EMISSION_FACTORY',
  status: 'FINAL_DOM_CLASS_SURFACE_RENUMERIZED_CANDIDATE_ONLY',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  owns: Object.freeze({
    rendererOwnedDomNodeCreation: true,
    renderRootCreation: true,
    objectNodeCreation: true,
    labelNodeCreation: true,
    affordanceNodeCreation: true,
    finalObjectClassListEmission: true,
    finalDatasetEmission: true,
    supportPortClassAggregation: true,
    ownedNodeCleanup: true
  }),

  doesNotOwn: Object.freeze({
    geometryExpansion: true,
    materialMapAuthority: true,
    layerMapAuthority: true,
    layerPlacementAuthority: true,
    compositorOrdering: true,
    controllerTargetClassification: true,
    routeShell: true,
    routeCss: true,
    rendererOrchestration: true
  }),

  boundary: Object.freeze({
    createsDomNodes: true,
    touchesSuppliedDomOnly: true,
    queriesGlobalDocument: false,

    createsRendererRoot: true,
    createsObjectNodes: true,
    createsLayerContainers: false,
    expandsGeometry: false,
    resolvesMaterialMapInternallyOnlyAsFallback: false,
    resolvesLayerMapInternallyOnlyAsFallback: false,

    finalDomClassEmissionAuthority: true,
    webglActivation: false,
    canvasActivation: false,
    svgActivation: false,
    iframeActivation: false,
    scriptCreation: false,

    finalRendererClaim: false,
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

export const H_EARTH_3D_RENDER_NODE_DATASET_KEYS = Object.freeze({
  renderOwned: 'hEarthRenderOwned',
  renderNodeType: 'hEarthRenderNodeType',
  renderNodeId: 'hEarthRenderNodeId',
  objectId: 'hEarthObjectId',
  sourceObjectId: 'hEarthSourceObjectId',
  parentObjectId: 'hEarthParentObjectId',
  materialKey: 'hEarthMaterialKey',
  canonicalMaterialKey: 'hEarthCanonicalMaterialKey',
  primitiveType: 'hEarthPrimitiveType',
  parentPrimitiveType: 'hEarthParentPrimitiveType',
  layerId: 'hEarthLayerId',
  layerOrder: 'hEarthLayerOrder',
  classification: 'hEarthClassification',
  geometryRole: 'hEarthGeometryRole',
  geometryDepthZone: 'hEarthGeometryDepthZone',
  classReady: 'hEarthClassReady',
  visualGrammarReady: 'hEarthVisualGrammarReady'
});

export const H_EARTH_3D_RENDER_NODE_POLICY = Object.freeze({
  ownershipAttribute: 'data-h-earth-render-owned',
  ownershipValue: 'true',

  rootNodeType: 'root',
  objectNodeType: 'object',
  labelNodeType: 'label',
  affordanceNodeType: 'affordance',

  rootClassName: 'h-earth-render-root',
  sceneClassName: 'h-earth-render-scene',
  objectBaseClassName: 'h-earth-render-object',
  descriptorOnlyClassName: 'h-earth-render-descriptor-only',
  classReadyClassName: 'h-earth-render-class-ready',
  visualGrammarReadyClassName: 'h-earth-render-visual-grammar-ready',
  visualGrammarIncompleteClassName: 'h-earth-render-visual-grammar-incomplete',

  labelClassName: 'h-earth-render-label',
  affordanceClassName: 'h-earth-render-affordance',

  unresolvedMaterialClassName: 'h-earth-material-unresolved',
  unresolvedPrimitiveClassName: 'h-earth-primitive-unresolved',
  unresolvedLandscapeClassName: 'h-earth-landscape-unresolved',
  unresolvedLayerMemberClassName: 'h-earth-layer-member-unclassified-render',

  boundary: Object.freeze({
    nodeFactoryOnly: true,
    finalDomClassEmissionAuthority: true,
    createsDomNodes: true,
    mutatesOwnedNodesOnly: true,
    expandsGeometry: false,
    ownsMaterialMap: false,
    ownsLayerMap: false,
    ownsController: false,
    ownsRendererOrchestration: false,
    webglActivation: false,
    canvasActivation: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false,
    claimBoundaryPreserved: true
  })
});

export function isHEarthNodePlainObject(value) {
  return value !== null && typeof value === 'object' && Array.isArray(value) === false;
}

export function normalizeHEarthNodeToken(value, fallback = 'unresolved') {
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

export function normalizeHEarthNodeClassArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  if (typeof value === 'string') {
    return value.split(/\s+/).filter(Boolean);
  }

  return [];
}

export function uniqueHEarthNodeClassNames(classNames = []) {
  const seen = new Set();

  return Object.freeze(
    normalizeHEarthNodeClassArray(classNames)
      .flatMap((value) => normalizeHEarthNodeClassArray(value))
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

export function joinHEarthNodeClassNames(classNames = []) {
  return uniqueHEarthNodeClassNames(classNames).join(' ');
}

export function normalizeHEarthNodeNumber(value, fallback = 0) {
  const numberValue = Number(value);
  return Number.isFinite(numberValue) ? numberValue : fallback;
}

export function resolveHEarthNodeDocumentRef(input = {}) {
  return (
    input.documentRef ||
    input.document ||
    input.ownerDocument ||
    input.rootNode?.ownerDocument ||
    input.renderRoot?.ownerDocument ||
    null
  );
}

export function resolveHEarthNodeObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.objectId ||
    node.dataset?.hEarthObjectId ||
    node.sourceObject?.objectId ||
    node.sourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.id ||
    `UNRESOLVED_OBJECT_${String(fallbackIndex).padStart(3, '0')}`
  );
}

export function resolveHEarthNodeSourceObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.sourceObjectId ||
    node.dataset?.hEarthSourceObjectId ||
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthNodeObjectId(node, fallbackIndex)
  );
}

export function resolveHEarthNodeParentObjectId(node = {}, fallbackIndex = 0) {
  return (
    node.parentObjectId ||
    node.geometryParentObjectId ||
    node.geometryExpansion?.parentObjectId ||
    node.sourceObjectId ||
    node.sourceObject?.objectId ||
    resolveHEarthNodeObjectId(node, fallbackIndex)
  );
}

export function resolveHEarthNodeId(node = {}, fallbackIndex = 0) {
  return (
    node.nodeId ||
    node.sourceNodeId ||
    node.composedNodeId ||
    node.parentNodeId ||
    node.geometryParentNodeId ||
    node.geometryExpansion?.parentNodeId ||
    `h-earth-render-node-${String(fallbackIndex).padStart(3, '0')}`
  );
}

export function resolveHEarthNodeLabel(node = {}, fallbackIndex = 0) {
  return (
    node.label ||
    node.objectLabel ||
    node.sourceObject?.label ||
    node.title ||
    resolveHEarthNodeObjectId(node, fallbackIndex)
  );
}

export function resolveHEarthNodeMaterialKey(node = {}) {
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
    'unresolved'
  );
}

export function resolveHEarthNodePrimitiveType(node = {}) {
  return (
    node.primitiveType ||
    node.geometryExpansion?.childPrimitiveType ||
    node.primitive?.primitiveType ||
    node.primitiveSchema?.primitiveType ||
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    'unresolved'
  );
}

export function resolveHEarthNodeParentPrimitiveType(node = {}) {
  return (
    node.geometryExpansion?.parentPrimitiveType ||
    node.parentPrimitiveType ||
    node.sourceObject?.primitiveType ||
    node.originalPrimitiveType ||
    resolveHEarthNodePrimitiveType(node)
  );
}

export function resolveHEarthNodeLayerId(node = {}) {
  return (
    node.layerId ||
    node.geometryExpansion?.layerId ||
    node.renderLayerId ||
    node.layer?.layerId ||
    node.composition?.layerId ||
    node.sourceObject?.layerId ||
    node.parentLayerId ||
    'unclassified-render-layer'
  );
}

export function resolveHEarthNodeLayerOrder(node = {}) {
  return normalizeHEarthNodeNumber(
    node.layerOrder ??
      node.renderLayerOrder ??
      node.layer?.order ??
      node.composition?.layerOrder,
    999
  );
}

export function resolveHEarthNodeClassification(node = {}) {
  return (
    node.classification ||
    node.controllerClassification ||
    node.geometryExpansion?.classification ||
    node.sourceObject?.classification ||
    'UNCLASSIFIED_TARGET'
  );
}

export function getHEarthNodeObjectIdentityClassNames(node = {}, fallbackIndex = 0) {
  const objectId = resolveHEarthNodeObjectId(node, fallbackIndex);
  const sourceObjectId = resolveHEarthNodeSourceObjectId(node, fallbackIndex);
  const parentObjectId = resolveHEarthNodeParentObjectId(node, fallbackIndex);

  return Object.freeze({
    objectId,
    sourceObjectId,
    parentObjectId,
    classNames: uniqueHEarthNodeClassNames([
      `h-earth-object-${normalizeHEarthNodeToken(objectId)}`,
      `h-earth-source-object-${normalizeHEarthNodeToken(sourceObjectId)}`,
      `h-earth-parent-object-${normalizeHEarthNodeToken(parentObjectId)}`
    ])
  });
}

export function getHEarthNodeGeometryClassNames(node = {}) {
  return uniqueHEarthNodeClassNames([
    node.renumerizedClassNames,
    node.renumerizedClassName,
    node.geometryClassNames,
    node.geometryClassName,
    node.geometryProfileClassName,
    node.geometryNodeClassName,
    node.geometryRoleClassName,

    node.canonicalPrimitiveClassName,
    node.primitiveClassName,
    node.detailPrimitiveClassName,
    node.primitiveGeometry?.canonicalPrimitiveClassName,
    node.primitiveGeometry?.primitiveClassName,
    node.primitiveGeometry?.detailPrimitiveClassName,

    node.canonicalLandscapeClassName,
    node.canonicalLandscapeFamilyClassName,
    node.landscapeClassName,
    node.detailLandscapeClassName,
    node.primitiveGeometry?.canonicalLandscapeClassName,
    node.primitiveGeometry?.canonicalLandscapeFamilyClassName,
    node.primitiveGeometry?.landscapeClassName,
    node.primitiveGeometry?.detailLandscapeClassName
  ]);
}

export function getHEarthNodeFallbackPrimitiveClassNames(node = {}) {
  const parentPrimitiveType = resolveHEarthNodeParentPrimitiveType(node);
  const primitiveType = resolveHEarthNodePrimitiveType(node);

  const parentPrimitiveClass =
    parentPrimitiveType && parentPrimitiveType !== 'unresolved'
      ? `h-earth-primitive-${normalizeHEarthNodeToken(parentPrimitiveType)}`
      : H_EARTH_3D_RENDER_NODE_POLICY.unresolvedPrimitiveClassName;

  const childPrimitiveClass =
    primitiveType && primitiveType !== parentPrimitiveType
      ? `h-earth-primitive-${normalizeHEarthNodeToken(primitiveType)}`
      : null;

  return uniqueHEarthNodeClassNames([parentPrimitiveClass, childPrimitiveClass]);
}

export function getHEarthNodeFallbackMaterialClassNames(node = {}) {
  const materialKey = resolveHEarthNodeMaterialKey(node);

  if (!materialKey || materialKey === 'unresolved') {
    return Object.freeze([H_EARTH_3D_RENDER_NODE_POLICY.unresolvedMaterialClassName]);
  }

  return Object.freeze([
    `h-earth-material-${normalizeHEarthNodeToken(materialKey)}`
  ]);
}

export function getHEarthNodeFallbackLayerClassNames(node = {}) {
  const layerId = resolveHEarthNodeLayerId(node);
  const layerToken = normalizeHEarthNodeToken(String(layerId).replace(/-layer$/, ''));

  return uniqueHEarthNodeClassNames([
    'h-earth-layer-member',
    `h-earth-layer-member-${layerToken}`
  ]);
}

export function getHEarthNodeSupportPortClasses({
  node = {},
  controller = null,
  materialPort = null,
  layerPort = null
} = {}) {
  const materialResolution =
    materialPort && typeof materialPort.getRenderClassesForNode === 'function'
      ? materialPort.getRenderClassesForNode(node, controller)
      : materialPort && typeof materialPort.getMaterialClassForNode === 'function'
        ? materialPort.getMaterialClassForNode(node, controller)
        : null;

  const layerResolution =
    layerPort && typeof layerPort.getLayerClassForNode === 'function'
      ? layerPort.getLayerClassForNode(node)
      : layerPort && typeof layerPort.resolveLayerMembershipForNode === 'function'
        ? layerPort.resolveLayerMembershipForNode(node)
        : null;

  const materialClassNames = uniqueHEarthNodeClassNames([
    materialResolution?.classNames,
    materialResolution?.className,
    materialResolution?.material?.classNames,
    materialResolution?.material?.className,
    getHEarthNodeFallbackMaterialClassNames(node)
  ]);

  const layerClassNames = uniqueHEarthNodeClassNames([
    layerResolution?.classNames,
    layerResolution?.layerMemberClassNames,
    layerResolution?.objectMembershipClassNames,
    layerResolution?.className,
    layerResolution?.layerMemberClassName,
    getHEarthNodeFallbackLayerClassNames(node)
  ]);

  return Object.freeze({
    materialResolution,
    layerResolution,
    materialClassNames,
    layerClassNames,
    materialResolved:
      materialResolution?.resolved === true ||
      materialClassNames.includes(H_EARTH_3D_RENDER_NODE_POLICY.unresolvedMaterialClassName) === false,
    layerResolved:
      layerResolution?.resolved === true ||
      layerResolution?.fallbackUsed !== true ||
      layerClassNames.length > 0,
    claimBoundaryPreserved: true
  });
}

export function getHEarthNodeFinalClassContract({
  node = {},
  controller = null,
  materialPort = null,
  layerPort = null,
  fallbackIndex = 0
} = {}) {
  const identity = getHEarthNodeObjectIdentityClassNames(node, fallbackIndex);
  const support = getHEarthNodeSupportPortClasses({
    node,
    controller,
    materialPort,
    layerPort
  });

  const geometryClassNames = getHEarthNodeGeometryClassNames(node);
  const fallbackPrimitiveClassNames = getHEarthNodeFallbackPrimitiveClassNames(node);

  const classReady =
    node.classReadyDescriptor === true ||
    node.visualGrammarReadyDescriptor === true ||
    geometryClassNames.length > 0 ||
    support.materialClassNames.length > 0 ||
    support.layerClassNames.length > 0;

  const classNames = uniqueHEarthNodeClassNames([
    H_EARTH_3D_RENDER_NODE_POLICY.objectBaseClassName,
    H_EARTH_3D_RENDER_NODE_POLICY.descriptorOnlyClassName,

    identity.classNames,
    geometryClassNames,
    fallbackPrimitiveClassNames,
    support.materialClassNames,
    support.layerClassNames,

    classReady
      ? H_EARTH_3D_RENDER_NODE_POLICY.classReadyClassName
      : H_EARTH_3D_RENDER_NODE_POLICY.visualGrammarIncompleteClassName,

    classReady ? H_EARTH_3D_RENDER_NODE_POLICY.visualGrammarReadyClassName : null
  ]);

  const hasMaterial = classNames.some((className) =>
    className.startsWith('h-earth-material-')
  );

  const hasPrimitive = classNames.some((className) =>
    className.startsWith('h-earth-primitive-')
  );

  const hasLandscape = classNames.some((className) =>
    className.startsWith('h-earth-landscape-')
  );

  const hasLayerMembership = classNames.some((className) =>
    className.startsWith('h-earth-layer-member')
  );

  const visualGrammarReady =
    hasMaterial === true &&
    hasPrimitive === true &&
    hasLandscape === true &&
    hasLayerMembership === true;

  const finalClassNames = uniqueHEarthNodeClassNames([
    classNames,
    visualGrammarReady
      ? H_EARTH_3D_RENDER_NODE_POLICY.visualGrammarReadyClassName
      : H_EARTH_3D_RENDER_NODE_POLICY.visualGrammarIncompleteClassName
  ]);

  return Object.freeze({
    objectId: identity.objectId,
    sourceObjectId: identity.sourceObjectId,
    parentObjectId: identity.parentObjectId,
    nodeId: resolveHEarthNodeId(node, fallbackIndex),

    classNames: finalClassNames,
    className: joinHEarthNodeClassNames(finalClassNames),

    identityClassNames: identity.classNames,
    geometryClassNames,
    materialClassNames: support.materialClassNames,
    layerClassNames: support.layerClassNames,
    primitiveClassNames: fallbackPrimitiveClassNames,

    materialResolution: support.materialResolution,
    layerResolution: support.layerResolution,

    classReady,
    visualGrammarReady,
    hasMaterial,
    hasPrimitive,
    hasLandscape,
    hasLayerMembership,

    finalDomClassEmissionAuthority: true,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function setHEarthNodeDatasetValue(element, key, value) {
  if (!element || !key) {
    return;
  }

  const stringValue =
    value === null || value === undefined ? '' : String(value);

  if (element.dataset && H_EARTH_3D_RENDER_NODE_DATASET_KEYS[key]) {
    element.dataset[H_EARTH_3D_RENDER_NODE_DATASET_KEYS[key]] = stringValue;
  }
}

export function applyHEarthNodeBaseDataset({
  element,
  node = {},
  classContract,
  fallbackIndex = 0
} = {}) {
  if (!element || typeof element.setAttribute !== 'function') {
    return Object.freeze({
      applied: false,
      failureCode: 'INVALID_ELEMENT',
      claimBoundaryPreserved: true
    });
  }

  const objectId = classContract?.objectId || resolveHEarthNodeObjectId(node, fallbackIndex);
  const sourceObjectId =
    classContract?.sourceObjectId || resolveHEarthNodeSourceObjectId(node, fallbackIndex);
  const parentObjectId =
    classContract?.parentObjectId || resolveHEarthNodeParentObjectId(node, fallbackIndex);
  const nodeId = classContract?.nodeId || resolveHEarthNodeId(node, fallbackIndex);
  const materialKey = resolveHEarthNodeMaterialKey(node);
  const primitiveType = resolveHEarthNodePrimitiveType(node);
  const parentPrimitiveType = resolveHEarthNodeParentPrimitiveType(node);
  const layerId =
    classContract?.layerResolution?.layerId ||
    classContract?.layerResolution?.layer?.layerId ||
    resolveHEarthNodeLayerId(node);
  const layerOrder =
    classContract?.layerResolution?.layerOrder ||
    resolveHEarthNodeLayerOrder(node);
  const classification = resolveHEarthNodeClassification(node);

  element.setAttribute(
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipValue
  );

  element.setAttribute('data-h-earth-render-node-type', H_EARTH_3D_RENDER_NODE_POLICY.objectNodeType);
  element.setAttribute('data-h-earth-render-node-id', nodeId);
  element.setAttribute('data-h-earth-object-id', objectId);
  element.setAttribute('data-h-earth-source-object-id', sourceObjectId);
  element.setAttribute('data-h-earth-parent-object-id', parentObjectId);
  element.setAttribute('data-h-earth-material-key', materialKey);
  element.setAttribute(
    'data-h-earth-canonical-material-key',
    node.canonicalMaterialKey || node.geometryExpansion?.canonicalMaterialKey || materialKey
  );
  element.setAttribute('data-h-earth-primitive-type', primitiveType);
  element.setAttribute('data-h-earth-parent-primitive-type', parentPrimitiveType);
  element.setAttribute('data-h-earth-layer-id', layerId);
  element.setAttribute('data-h-earth-layer-order', String(layerOrder));
  element.setAttribute('data-h-earth-classification', classification);
  element.setAttribute(
    'data-h-earth-geometry-role',
    node.geometryExpansionRole ||
      node.geometryExpansion?.geometryNodeKind ||
      node.semanticRole ||
      ''
  );
  element.setAttribute(
    'data-h-earth-geometry-depth-zone',
    node.geometryDepthZone ||
      node.geometryExpansion?.childDepthZone ||
      node.geometryExpansion?.parentDepthZone ||
      ''
  );
  element.setAttribute(
    'data-h-earth-class-ready',
    String(classContract?.classReady === true)
  );
  element.setAttribute(
    'data-h-earth-visual-grammar-ready',
    String(classContract?.visualGrammarReady === true)
  );

  setHEarthNodeDatasetValue(element, 'renderOwned', 'true');
  setHEarthNodeDatasetValue(element, 'renderNodeType', H_EARTH_3D_RENDER_NODE_POLICY.objectNodeType);
  setHEarthNodeDatasetValue(element, 'renderNodeId', nodeId);
  setHEarthNodeDatasetValue(element, 'objectId', objectId);
  setHEarthNodeDatasetValue(element, 'sourceObjectId', sourceObjectId);
  setHEarthNodeDatasetValue(element, 'parentObjectId', parentObjectId);
  setHEarthNodeDatasetValue(element, 'materialKey', materialKey);
  setHEarthNodeDatasetValue(
    element,
    'canonicalMaterialKey',
    node.canonicalMaterialKey || node.geometryExpansion?.canonicalMaterialKey || materialKey
  );
  setHEarthNodeDatasetValue(element, 'primitiveType', primitiveType);
  setHEarthNodeDatasetValue(element, 'parentPrimitiveType', parentPrimitiveType);
  setHEarthNodeDatasetValue(element, 'layerId', layerId);
  setHEarthNodeDatasetValue(element, 'layerOrder', layerOrder);
  setHEarthNodeDatasetValue(element, 'classification', classification);
  setHEarthNodeDatasetValue(
    element,
    'geometryRole',
    node.geometryExpansionRole ||
      node.geometryExpansion?.geometryNodeKind ||
      node.semanticRole ||
      ''
  );
  setHEarthNodeDatasetValue(
    element,
    'geometryDepthZone',
    node.geometryDepthZone ||
      node.geometryExpansion?.childDepthZone ||
      node.geometryExpansion?.parentDepthZone ||
      ''
  );
  setHEarthNodeDatasetValue(element, 'classReady', String(classContract?.classReady === true));
  setHEarthNodeDatasetValue(
    element,
    'visualGrammarReady',
    String(classContract?.visualGrammarReady === true)
  );

  return Object.freeze({
    applied: true,
    failureCode: null,
    objectId,
    sourceObjectId,
    parentObjectId,
    nodeId,
    materialKey,
    primitiveType,
    parentPrimitiveType,
    layerId,
    layerOrder,
    classification,
    claimBoundaryPreserved: true
  });
}

export function applyHEarthNodePrimitiveGeometryDataset({
  element,
  node = {}
} = {}) {
  if (!element || typeof element.setAttribute !== 'function') {
    return Object.freeze({
      applied: false,
      failureCode: 'INVALID_ELEMENT',
      claimBoundaryPreserved: true
    });
  }

  const primitiveGeometry = node.primitiveGeometry || {};

  if (!primitiveGeometry || Object.keys(primitiveGeometry).length === 0) {
    return Object.freeze({
      applied: false,
      failureCode: 'NO_PRIMITIVE_GEOMETRY',
      claimBoundaryPreserved: true
    });
  }

  const widthPx = normalizeHEarthNodeNumber(
    node.renderWidthPx ?? primitiveGeometry.widthPx,
    0
  );
  const heightPx = normalizeHEarthNodeNumber(
    node.renderHeightPx ?? primitiveGeometry.heightPx,
    0
  );
  const depthPx = normalizeHEarthNodeNumber(
    node.renderDepthPx ?? primitiveGeometry.depthPx,
    0
  );

  element.setAttribute('data-h-earth-render-width-px', String(widthPx));
  element.setAttribute('data-h-earth-render-height-px', String(heightPx));
  element.setAttribute('data-h-earth-render-depth-px', String(depthPx));
  element.setAttribute(
    'data-h-earth-primitive-profile-id',
    primitiveGeometry.profileId || ''
  );
  element.setAttribute(
    'data-h-earth-primitive-profile-class',
    primitiveGeometry.profileClassName || ''
  );

  if (element.dataset) {
    element.dataset.hEarthRenderWidthPx = String(widthPx);
    element.dataset.hEarthRenderHeightPx = String(heightPx);
    element.dataset.hEarthRenderDepthPx = String(depthPx);
    element.dataset.hEarthPrimitiveProfileId = primitiveGeometry.profileId || '';
    element.dataset.hEarthPrimitiveProfileClass =
      primitiveGeometry.profileClassName || '';
  }

  return Object.freeze({
    applied: true,
    widthPx,
    heightPx,
    depthPx,
    profileId: primitiveGeometry.profileId || '',
    profileClassName: primitiveGeometry.profileClassName || '',
    finalGeometryClaim: false,
    visualPassClaim: false,
    claimBoundaryPreserved: true
  });
}

export function applyHEarthNodeCandidateStyle({
  element,
  node = {}
} = {}) {
  if (!element || !element.style) {
    return Object.freeze({
      applied: false,
      failureCode: 'INVALID_ELEMENT_STYLE',
      claimBoundaryPreserved: true
    });
  }

  const primitiveGeometry = node.primitiveGeometry || {};
  const widthPx = normalizeHEarthNodeNumber(
    node.renderWidthPx ?? primitiveGeometry.widthPx,
    0
  );
  const heightPx = normalizeHEarthNodeNumber(
    node.renderHeightPx ?? primitiveGeometry.heightPx,
    0
  );

  if (widthPx > 0) {
    element.style.width = `${widthPx}px`;
  }

  if (heightPx > 0) {
    element.style.height = `${heightPx}px`;
  }

  element.style.transformStyle = 'preserve-3d';
  element.style.position = element.style.position || 'absolute';

  return Object.freeze({
    applied: true,
    widthPx,
    heightPx,
    styleScope: 'candidate-dom-css3d-only',
    finalGeometryClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthRenderRoot({
  documentRef,
  existingRoot = null,
  rootClassName = H_EARTH_3D_RENDER_NODE_POLICY.rootClassName
} = {}) {
  const doc = documentRef || existingRoot?.ownerDocument || null;

  if (!doc || typeof doc.createElement !== 'function') {
    return Object.freeze({
      rootNode: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const rootNode = existingRoot || doc.createElement('div');

  const rootClasses = uniqueHEarthNodeClassNames([
    rootClassName,
    H_EARTH_3D_RENDER_NODE_POLICY.sceneClassName
  ]);

  rootNode.className = joinHEarthNodeClassNames(rootClasses);

  rootNode.setAttribute(
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipValue
  );
  rootNode.setAttribute(
    'data-h-earth-render-node-type',
    H_EARTH_3D_RENDER_NODE_POLICY.rootNodeType
  );
  rootNode.setAttribute('data-h-earth-render-contract', H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId);
  rootNode.setAttribute('data-h-earth-final-dom-class-emission-authority', 'true');

  if (rootNode.dataset) {
    rootNode.dataset.hEarthRenderOwned = 'true';
    rootNode.dataset.hEarthRenderNodeType = H_EARTH_3D_RENDER_NODE_POLICY.rootNodeType;
    rootNode.dataset.hEarthRenderContract = H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId;
    rootNode.dataset.hEarthFinalDomClassEmissionAuthority = 'true';
  }

  if (rootNode.style) {
    rootNode.style.position = rootNode.style.position || 'relative';
    rootNode.style.transformStyle = 'preserve-3d';
  }

  return Object.freeze({
    rootNode,
    created: true,
    reusedExistingRoot: Boolean(existingRoot),
    classNames: rootClasses,
    contractId: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId,
    claimBoundaryPreserved: true
  });
}

export function createHEarthRenderLabelNode({
  documentRef,
  node = {},
  fallbackIndex = 0
} = {}) {
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      labelNode: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const labelNode = documentRef.createElement('div');
  const label = resolveHEarthNodeLabel(node, fallbackIndex);

  labelNode.className = H_EARTH_3D_RENDER_NODE_POLICY.labelClassName;
  labelNode.textContent = label;

  labelNode.setAttribute(
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipValue
  );
  labelNode.setAttribute(
    'data-h-earth-render-node-type',
    H_EARTH_3D_RENDER_NODE_POLICY.labelNodeType
  );
  labelNode.setAttribute(
    'data-h-earth-parent-object-id',
    resolveHEarthNodeObjectId(node, fallbackIndex)
  );

  if (labelNode.dataset) {
    labelNode.dataset.hEarthRenderOwned = 'true';
    labelNode.dataset.hEarthRenderNodeType = H_EARTH_3D_RENDER_NODE_POLICY.labelNodeType;
    labelNode.dataset.hEarthParentObjectId = resolveHEarthNodeObjectId(node, fallbackIndex);
  }

  return Object.freeze({
    labelNode,
    created: true,
    label,
    claimBoundaryPreserved: true
  });
}

export function createHEarthRenderAffordanceNode({
  documentRef,
  node = {},
  fallbackIndex = 0
} = {}) {
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      affordanceNode: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const affordanceNode = documentRef.createElement('div');

  affordanceNode.className = H_EARTH_3D_RENDER_NODE_POLICY.affordanceClassName;
  affordanceNode.setAttribute(
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_NODE_POLICY.ownershipValue
  );
  affordanceNode.setAttribute(
    'data-h-earth-render-node-type',
    H_EARTH_3D_RENDER_NODE_POLICY.affordanceNodeType
  );
  affordanceNode.setAttribute(
    'data-h-earth-parent-object-id',
    resolveHEarthNodeObjectId(node, fallbackIndex)
  );

  if (affordanceNode.dataset) {
    affordanceNode.dataset.hEarthRenderOwned = 'true';
    affordanceNode.dataset.hEarthRenderNodeType =
      H_EARTH_3D_RENDER_NODE_POLICY.affordanceNodeType;
    affordanceNode.dataset.hEarthParentObjectId = resolveHEarthNodeObjectId(node, fallbackIndex);
  }

  return Object.freeze({
    affordanceNode,
    created: true,
    claimBoundaryPreserved: true
  });
}

export function createHEarthRenderObjectNode(input = {}) {
  const {
    documentRef,
    node = {},
    controller = null,
    materialPort = null,
    layerPort = null,
    fallbackIndex = 0,
    includeLabel = false,
    includeAffordance = false,
    applyCandidateStyle = true
  } = input || {};

  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      objectNode: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const objectNode = documentRef.createElement('div');

  const classContract = getHEarthNodeFinalClassContract({
    node,
    controller,
    materialPort,
    layerPort,
    fallbackIndex
  });

  objectNode.className = classContract.className;

  const datasetReceipt = applyHEarthNodeBaseDataset({
    element: objectNode,
    node,
    classContract,
    fallbackIndex
  });

  const geometryDatasetReceipt = applyHEarthNodePrimitiveGeometryDataset({
    element: objectNode,
    node
  });

  const styleReceipt =
    applyCandidateStyle === true
      ? applyHEarthNodeCandidateStyle({
          element: objectNode,
          node
        })
      : Object.freeze({
          applied: false,
          skipped: true,
          claimBoundaryPreserved: true
        });

  let labelReceipt = Object.freeze({
    created: false,
    skipped: true,
    claimBoundaryPreserved: true
  });

  if (includeLabel === true) {
    labelReceipt = createHEarthRenderLabelNode({
      documentRef,
      node,
      fallbackIndex
    });

    if (labelReceipt.labelNode) {
      objectNode.appendChild(labelReceipt.labelNode);
    }
  }

  let affordanceReceipt = Object.freeze({
    created: false,
    skipped: true,
    claimBoundaryPreserved: true
  });

  if (includeAffordance === true) {
    affordanceReceipt = createHEarthRenderAffordanceNode({
      documentRef,
      node,
      fallbackIndex
    });

    if (affordanceReceipt.affordanceNode) {
      objectNode.appendChild(affordanceReceipt.affordanceNode);
    }
  }

  return Object.freeze({
    objectNode,
    node,
    created: true,
    failureCode: null,

    objectId: classContract.objectId,
    sourceObjectId: classContract.sourceObjectId,
    parentObjectId: classContract.parentObjectId,
    nodeId: classContract.nodeId,

    classContract,
    classNames: classContract.classNames,
    className: classContract.className,

    datasetReceipt,
    geometryDatasetReceipt,
    styleReceipt,
    labelReceipt,
    affordanceReceipt,

    finalDomClassEmissionAuthority: true,
    classReady: classContract.classReady,
    visualGrammarReady: classContract.visualGrammarReady,

    materialClassNames: classContract.materialClassNames,
    primitiveClassNames: classContract.primitiveClassNames,
    geometryClassNames: classContract.geometryClassNames,
    layerClassNames: classContract.layerClassNames,

    createsDomNodes: true,
    expandsGeometry: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function createHEarthObjectNode(
  documentRefOrInput,
  nodeArg,
  materialPortArg,
  controllerArg,
  layerPortArg
) {
  if (isHEarthNodePlainObject(documentRefOrInput) && documentRefOrInput.documentRef) {
    return createHEarthRenderObjectNode(documentRefOrInput);
  }

  return createHEarthRenderObjectNode({
    documentRef: documentRefOrInput,
    node: nodeArg || {},
    materialPort: materialPortArg || null,
    controller: controllerArg || null,
    layerPort: layerPortArg || null
  });
}

export function createHEarthRenderNodes({
  documentRef,
  nodes = [],
  controller = null,
  materialPort = null,
  layerPort = null,
  includeLabels = false,
  includeAffordances = false,
  applyCandidateStyle = true
} = {}) {
  const sourceNodes = Array.isArray(nodes) ? nodes : [];
  const receipts = [];
  const objectNodes = [];

  sourceNodes.forEach((node, index) => {
    const receipt = createHEarthRenderObjectNode({
      documentRef,
      node,
      controller,
      materialPort,
      layerPort,
      fallbackIndex: index,
      includeLabel: includeLabels,
      includeAffordance: includeAffordances,
      applyCandidateStyle
    });

    receipts.push(receipt);

    if (receipt.objectNode) {
      objectNodes.push(receipt.objectNode);
    }
  });

  const visualGrammarReadyCount = receipts.filter(
    (receipt) => receipt.visualGrammarReady === true
  ).length;

  return Object.freeze({
    objectNodes: Object.freeze(objectNodes),
    receipts: Object.freeze(receipts),
    createdNodeCount: objectNodes.length,
    requestedNodeCount: sourceNodes.length,
    visualGrammarReadyCount,
    visualGrammarIncompleteCount: Math.max(0, objectNodes.length - visualGrammarReadyCount),
    failureCodes: Object.freeze(
      receipts
        .filter((receipt) => receipt.failureCode)
        .map((receipt) => receipt.failureCode)
    ),
    finalDomClassEmissionAuthority: true,
    claimBoundaryPreserved: true
  });
}

export function appendHEarthRenderObjectNode({
  parentNode,
  objectNode
} = {}) {
  if (!parentNode || typeof parentNode.appendChild !== 'function') {
    return Object.freeze({
      appended: false,
      failureCode: 'INVALID_PARENT_NODE',
      claimBoundaryPreserved: true
    });
  }

  if (!objectNode) {
    return Object.freeze({
      appended: false,
      failureCode: 'INVALID_OBJECT_NODE',
      claimBoundaryPreserved: true
    });
  }

  parentNode.appendChild(objectNode);

  return Object.freeze({
    appended: true,
    failureCode: null,
    domMutationScope: 'supplied-parent-only',
    rendererPassClaim: false,
    visualPassClaim: false,
    claimBoundaryPreserved: true
  });
}

export function removeHEarthOwnedRenderNodes(rootNode) {
  if (!rootNode || typeof rootNode.querySelectorAll !== 'function') {
    return Object.freeze({
      removed: false,
      removedCount: 0,
      failureCode: 'INVALID_ROOT_NODE',
      claimBoundaryPreserved: true
    });
  }

  const ownedNodes = Array.from(
    rootNode.querySelectorAll(`[${H_EARTH_3D_RENDER_NODE_POLICY.ownershipAttribute}="${H_EARTH_3D_RENDER_NODE_POLICY.ownershipValue}"]`)
  );

  ownedNodes.forEach((node) => {
    if (node.parentNode && typeof node.parentNode.removeChild === 'function') {
      node.parentNode.removeChild(node);
    }
  });

  return Object.freeze({
    removed: true,
    removedCount: ownedNodes.length,
    failureCode: null,
    domMutationScope: 'owned-render-nodes-only',
    claimBoundaryPreserved: true
  });
}

export function cleanupHEarthOwnedRenderNodes(rootNode) {
  return removeHEarthOwnedRenderNodes(rootNode);
}

export function destroyHEarthRenderRoot(rootNode) {
  if (!rootNode || !rootNode.parentNode) {
    return Object.freeze({
      destroyed: false,
      failureCode: 'INVALID_OR_UNMOUNTED_ROOT_NODE',
      claimBoundaryPreserved: true
    });
  }

  rootNode.parentNode.removeChild(rootNode);

  return Object.freeze({
    destroyed: true,
    failureCode: null,
    domMutationScope: 'supplied-root-only',
    claimBoundaryPreserved: true
  });
}

export const H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT',
  file: '/showroom/globe/h-earth/render/nodes.js',
  contractId: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId,
  renewedFrom: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.renewedFrom,
  parentStandard: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.parentStandard,
  parentGeometryRenewal:
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.parentGeometryRenewal,
  parentMaterialRenewal:
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.parentMaterialRenewal,
  parentLayerRenewal:
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.parentLayerRenewal,

  renderRootCreationDefined: true,
  objectNodeCreationDefined: true,
  labelNodeCreationDefined: true,
  affordanceNodeCreationDefined: true,
  ownedNodeCleanupDefined: true,

  finalDomClassEmissionAuthority: true,
  supportPortClassAggregationDefined: true,
  geometryClassConsumptionDefined: true,
  materialPortClassConsumptionDefined: true,
  layerPortClassConsumptionDefined: true,
  datasetEmissionDefined: true,

  requiredClassSurface: Object.freeze([
    'h-earth-render-object',
    'h-earth-render-descriptor-only',
    'h-earth-render-class-ready',
    'h-earth-render-visual-grammar-ready',
    'h-earth-material-*',
    'h-earth-primitive-*',
    'h-earth-landscape-*',
    'h-earth-geometry-*',
    'h-earth-geometry-node-*',
    'h-earth-layer-member',
    'h-earth-layer-member-*'
  ]),

  createsDomNodes: true,
  createsRendererRoot: true,
  createsObjectNodes: true,
  createsLayerContainers: false,
  expandsGeometry: false,
  ownsMaterialMap: false,
  ownsLayerMap: false,
  queriesGlobalDocument: false,

  boundary: Object.freeze({
    nodeFactoryOnly: true,
    finalDomClassEmissionAuthority: true,
    webglActivation: false,
    canvasActivation: false,
    svgActivation: false,
    iframeActivation: false,
    scriptCreation: false,
    finalRendererClaim: false,
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

export function getHEarthRenderNodeFactoryReceipt() {
  return H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT;
}

export function getRenderNodeFactoryReceipt() {
  return H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT;
}

export const H_EARTH_3D_RENDER_NODE_FACTORY = Object.freeze({
  id: 'H_EARTH_3D_RENDER_NODE_FACTORY',
  file: '/showroom/globe/h-earth/render/nodes.js',

  contract: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT,
  datasetKeys: H_EARTH_3D_RENDER_NODE_DATASET_KEYS,
  policy: H_EARTH_3D_RENDER_NODE_POLICY,

  isPlainObject: isHEarthNodePlainObject,
  normalizeToken: normalizeHEarthNodeToken,
  normalizeClassArray: normalizeHEarthNodeClassArray,
  uniqueClassNames: uniqueHEarthNodeClassNames,
  joinClassNames: joinHEarthNodeClassNames,
  normalizeNumber: normalizeHEarthNodeNumber,

  resolveDocumentRef: resolveHEarthNodeDocumentRef,
  resolveObjectId: resolveHEarthNodeObjectId,
  resolveSourceObjectId: resolveHEarthNodeSourceObjectId,
  resolveParentObjectId: resolveHEarthNodeParentObjectId,
  resolveNodeId: resolveHEarthNodeId,
  resolveLabel: resolveHEarthNodeLabel,
  resolveMaterialKey: resolveHEarthNodeMaterialKey,
  resolvePrimitiveType: resolveHEarthNodePrimitiveType,
  resolveParentPrimitiveType: resolveHEarthNodeParentPrimitiveType,
  resolveLayerId: resolveHEarthNodeLayerId,
  resolveLayerOrder: resolveHEarthNodeLayerOrder,
  resolveClassification: resolveHEarthNodeClassification,

  getObjectIdentityClassNames: getHEarthNodeObjectIdentityClassNames,
  getGeometryClassNames: getHEarthNodeGeometryClassNames,
  getFallbackPrimitiveClassNames: getHEarthNodeFallbackPrimitiveClassNames,
  getFallbackMaterialClassNames: getHEarthNodeFallbackMaterialClassNames,
  getFallbackLayerClassNames: getHEarthNodeFallbackLayerClassNames,
  getSupportPortClasses: getHEarthNodeSupportPortClasses,
  getFinalClassContract: getHEarthNodeFinalClassContract,

  applyBaseDataset: applyHEarthNodeBaseDataset,
  applyPrimitiveGeometryDataset: applyHEarthNodePrimitiveGeometryDataset,
  applyCandidateStyle: applyHEarthNodeCandidateStyle,

  createRenderRoot: createHEarthRenderRoot,
  createObjectNode: createHEarthObjectNode,
  createRenderObjectNode: createHEarthRenderObjectNode,
  createRenderNodes: createHEarthRenderNodes,
  createLabelNode: createHEarthRenderLabelNode,
  createAffordanceNode: createHEarthRenderAffordanceNode,
  appendObjectNode: appendHEarthRenderObjectNode,

  removeOwnedRenderNodes: removeHEarthOwnedRenderNodes,
  cleanupOwnedRenderNodes: cleanupHEarthOwnedRenderNodes,
  destroyRenderRoot: destroyHEarthRenderRoot,

  getReceipt: getHEarthRenderNodeFactoryReceipt,
  receipt: H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT
});

export default H_EARTH_3D_RENDER_NODE_FACTORY;
