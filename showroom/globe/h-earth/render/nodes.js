// /showroom/globe/h-earth/render/nodes.js
// NEW FILE
// H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_023A_v1
//
// Purpose:
// DOM/CSS-3D node factory and cleanup authority for the H-Earth Candidate Renderer.
//
// This file creates renderer-owned root/object/label/affordance DOM nodes
// from candidate render/composed descriptors and removes only renderer-owned
// nodes from a supplied mount node.
//
// This file does not own material law, layer order, compositor law,
// controller law, route shell, route CSS, global document mutation,
// route-level controls, gameplay loops, WebGL, canvas, visual-pass claims,
// validation claims, production claims, traversal, simulation, or matrix collapse.

export const H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',
  renewedRendererFrom: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',

  file: '/showroom/globe/h-earth/render/nodes.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_NODE_FACTORY_PORT',
  status: 'NODE_FACTORY_PORT_DEFINED_NON_FINAL_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  boundary: Object.freeze({
    createsRendererOwnedDomNodes: true,
    createsRouteShell: false,
    bindsRouteControls: false,
    installsGlobalListeners: false,
    queriesGlobalDocument: false,
    createsCanvas: false,
    createsWebGL: false,
    createsSvg: false,
    createsIframe: false,
    createsScript: false,
    gameplayLoopClaim: false,
    finalRendererClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    traversalClaim: false,
    simulationClaim: false,
    matrixCollapse: false
  })
});

export const H_EARTH_3D_RENDER_DOM_OWNERSHIP = Object.freeze({
  ownershipAttribute: 'data-h-earth-render-owned',
  ownershipValue: 'true',
  ownershipSelector: '[data-h-earth-render-owned="true"]',

  rootNodeType: 'root',
  objectNodeType: 'object',
  labelNodeType: 'label',
  affordanceNodeType: 'affordance',

  allowedElementNames: Object.freeze(['div', 'span', 'button']),
  forbiddenElementNames: Object.freeze(['canvas', 'iframe', 'script', 'svg']),

  dataAttributes: Object.freeze({
    renderOwned: 'data-h-earth-render-owned',
    renderNodeType: 'data-h-earth-render-node-type',
    renderNodeId: 'data-h-earth-render-node-id',
    objectId: 'data-h-earth-object-id',
    layerId: 'data-h-earth-layer-id',
    classification: 'data-h-earth-classification',
    materialKey: 'data-h-earth-material-key',
    primitiveType: 'data-h-earth-primitive-type',
    renderContract: 'data-h-earth-render-contract'
  }),

  boundary: Object.freeze({
    soleCleanupAuthorityMarker: true,
    clearsOnlyOwnedNodesInsideSuppliedMountNode: true,
    routeShellPreserved: true,
    canonDescriptorsPreserved: true,
    webglActivation: false,
    canvasActivation: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  })
});

export const H_EARTH_3D_RENDER_NODE_CLASS_POLICY = Object.freeze({
  rootClassName: 'h-earth-render-root h-earth-css-3d-candidate-root',
  objectBaseClassName: 'h-earth-render-object',
  labelClassName: 'h-earth-render-label',
  affordanceClassName: 'h-earth-render-affordance',
  transformMissingClassName: 'h-earth-render-transform-missing',
  descriptorOnlyClassName: 'h-earth-render-descriptor-only',

  boundary: Object.freeze({
    cssClassPolicyOnly: true,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  })
});

export function isValidHEarthMountNode(mountNode) {
  const exists = Boolean(mountNode);

  const hasAppendChild = exists && typeof mountNode.appendChild === 'function';
  const hasQuerySelectorAll =
    exists && typeof mountNode.querySelectorAll === 'function';
  const hasOwnerDocument =
    exists &&
    mountNode.ownerDocument &&
    typeof mountNode.ownerDocument.createElement === 'function';

  const nodeTypeCompatible =
    exists &&
    (
      mountNode.nodeType === 1 ||
      mountNode.nodeType === 9 ||
      mountNode.nodeType === 11
    );

  const valid =
    exists &&
    hasAppendChild &&
    hasQuerySelectorAll &&
    hasOwnerDocument &&
    nodeTypeCompatible;

  let reason = null;

  if (!exists) {
    reason = 'MISSING_MOUNT_NODE';
  } else if (!nodeTypeCompatible) {
    reason = 'INCOMPATIBLE_NODE_TYPE';
  } else if (!hasAppendChild) {
    reason = 'MISSING_APPEND_CHILD';
  } else if (!hasQuerySelectorAll) {
    reason = 'MISSING_QUERY_SELECTOR_ALL';
  } else if (!hasOwnerDocument) {
    reason = 'MISSING_OWNER_DOCUMENT';
  }

  return Object.freeze({
    valid,
    reason,
    exists,
    hasAppendChild,
    hasQuerySelectorAll,
    hasOwnerDocument,
    nodeTypeCompatible,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthNodeId(node) {
  return (
    node?.sourceNodeId ||
    node?.nodeId ||
    node?.composedNodeId ||
    node?.id ||
    null
  );
}

export function resolveHEarthObjectId(node) {
  return node?.objectId || node?.sourceObjectId || null;
}

export function resolveHEarthLayerId(node) {
  return (
    node?.layerId ||
    node?.renderLayerId ||
    node?.layer?.layerId ||
    node?.composition?.layerId ||
    'unclassified-render-layer'
  );
}

export function resolveHEarthPrimitiveType(node) {
  return (
    node?.primitiveType ||
    node?.primitive?.primitiveType ||
    node?.primitiveSchema?.primitiveType ||
    'unresolved-primitive'
  );
}

export function resolveHEarthMaterialKey(node) {
  return (
    node?.materialKey ||
    node?.materialToken?.materialKey ||
    node?.material?.materialKey ||
    'unresolved'
  );
}

export function resolveHEarthCssTransform(node) {
  const cssTransform =
    node?.cssTransformDescriptor?.cssTransform ||
    node?.cssTransform?.cssTransform ||
    node?.candidateTransform?.cssTransform ||
    node?.transform?.cssTransform ||
    null;

  return Object.freeze({
    cssTransform,
    transformApplied: Boolean(cssTransform),
    source:
      node?.cssTransformDescriptor?.cssTransform
        ? 'cssTransformDescriptor.cssTransform'
        : node?.cssTransform?.cssTransform
          ? 'cssTransform.cssTransform'
          : node?.candidateTransform?.cssTransform
            ? 'candidateTransform.cssTransform'
            : node?.transform?.cssTransform
              ? 'transform.cssTransform'
              : 'none',
    candidateTransformOnly: true,
    finalGeometryClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function setHEarthOwnedAttribute(element, nodeType) {
  if (!element || typeof element.setAttribute !== 'function') {
    return element;
  }

  element.setAttribute(
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.ownershipAttribute,
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.ownershipValue
  );

  element.setAttribute('data-h-earth-render-node-type', nodeType);

  if (element.dataset) {
    element.dataset.hEarthRenderOwned = 'true';
    element.dataset.hEarthRenderNodeType = nodeType;
  }

  return element;
}

export function applyHEarthDataset(element, dataset = {}) {
  if (!element || typeof element.setAttribute !== 'function') {
    return element;
  }

  Object.entries(dataset).forEach(([key, value]) => {
    if (value === null || value === undefined) {
      return;
    }

    const dataKey = String(key)
      .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
      .replace(/_/g, '-')
      .toLowerCase();

    element.setAttribute(`data-${dataKey}`, String(value));

    if (element.dataset) {
      element.dataset[key] = String(value);
    }
  });

  return element;
}

export function createHEarthRenderRootNode({
  mountNode,
  documentRef,
  receiptId,
  options
} = {}) {
  const ownerDocument =
    documentRef ||
    mountNode?.ownerDocument ||
    null;

  if (!ownerDocument || typeof ownerDocument.createElement !== 'function') {
    return Object.freeze({
      rootNode: null,
      created: false,
      receiptId: receiptId || null,
      failureCode: 'INVALID_DOCUMENT_REF',
      boundary: Object.freeze({
        claimBoundaryPreserved: true
      })
    });
  }

  const rootNode = ownerDocument.createElement('div');

  setHEarthOwnedAttribute(
    rootNode,
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.rootNodeType
  );

  rootNode.className = H_EARTH_3D_RENDER_NODE_CLASS_POLICY.rootClassName;

  rootNode.setAttribute(
    'data-h-earth-render-contract',
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId
  );

  rootNode.setAttribute(
    'data-h-earth-render-receipt-id',
    String(receiptId || 'H_EARTH_3D_RENDERER_MOUNT_RECEIPT_PENDING')
  );

  rootNode.setAttribute('data-h-earth-matrix', 'H-Earth');
  rootNode.setAttribute('data-h-earth-matrix-role', 'Ground-View Matrix');
  rootNode.setAttribute('data-h-earth-active-cell', 'H_EARTH_GROUND_CELL_001');
  rootNode.setAttribute(
    'data-h-earth-scene-identity',
    'earth-water-air-survival-shoreline-manor'
  );

  rootNode.dataset.hEarthRenderContract =
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId;
  rootNode.dataset.hEarthMatrix = 'H-Earth';
  rootNode.dataset.hEarthMatrixRole = 'Ground-View Matrix';
  rootNode.dataset.hEarthActiveCell = 'H_EARTH_GROUND_CELL_001';
  rootNode.dataset.hEarthSceneIdentity =
    'earth-water-air-survival-shoreline-manor';

  rootNode.style.transformStyle = 'preserve-3d';

  if (options?.ariaLabel !== false) {
    rootNode.setAttribute(
      'aria-label',
      options?.ariaLabel || 'H-Earth DOM CSS 3D candidate renderer root'
    );
  }

  return Object.freeze({
    rootNode,
    created: true,
    receiptId: receiptId || null,
    boundary: Object.freeze({
      rendererOwned: true,
      appendedByFactory: false,
      routeShellCreated: false,
      cssShellCreated: false,
      webglActivation: false,
      canvasActivation: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function createHEarthRenderObjectNode({
  node,
  controller,
  materialPort,
  options
} = {}) {
  const ownerDocument =
    options?.documentRef ||
    options?.mountNode?.ownerDocument ||
    options?.renderRoot?.ownerDocument ||
    null;

  if (!ownerDocument || typeof ownerDocument.createElement !== 'function') {
    return Object.freeze({
      objectNode: null,
      created: false,
      objectId: resolveHEarthObjectId(node),
      nodeId: resolveHEarthNodeId(node),
      failureCode: 'INVALID_DOCUMENT_REF',
      boundary: Object.freeze({
        claimBoundaryPreserved: true
      })
    });
  }

  const objectId = resolveHEarthObjectId(node);
  const nodeId = resolveHEarthNodeId(node);
  const layerId = resolveHEarthLayerId(node);
  const primitiveType = resolveHEarthPrimitiveType(node);
  const materialKey = resolveHEarthMaterialKey(node);

  const classResolution =
    materialPort && typeof materialPort.getRenderClassesForNode === 'function'
      ? materialPort.getRenderClassesForNode(node, controller)
      : null;

  const contextClassification =
    classResolution?.context?.classification || 'UNCLASSIFIED_TARGET';

  const objectNode = ownerDocument.createElement('div');

  setHEarthOwnedAttribute(
    objectNode,
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.objectNodeType
  );

  const className = [
    H_EARTH_3D_RENDER_NODE_CLASS_POLICY.objectBaseClassName,
    H_EARTH_3D_RENDER_NODE_CLASS_POLICY.descriptorOnlyClassName,
    classResolution?.className
  ]
    .filter(Boolean)
    .join(' ');

  objectNode.className = className;

  objectNode.setAttribute(
    'data-h-earth-render-contract',
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId
  );

  objectNode.setAttribute('data-h-earth-render-node-id', String(nodeId || ''));
  objectNode.setAttribute('data-h-earth-object-id', String(objectId || ''));
  objectNode.setAttribute('data-h-earth-layer-id', String(layerId || ''));
  objectNode.setAttribute('data-h-earth-classification', contextClassification);
  objectNode.setAttribute('data-h-earth-material-key', String(materialKey));
  objectNode.setAttribute('data-h-earth-primitive-type', String(primitiveType));
  objectNode.setAttribute('data-h-earth-candidate-dom-node-only', 'true');

  objectNode.dataset.hEarthRenderContract =
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId;
  objectNode.dataset.hEarthRenderNodeId = String(nodeId || '');
  objectNode.dataset.hEarthObjectId = String(objectId || '');
  objectNode.dataset.hEarthLayerId = String(layerId || '');
  objectNode.dataset.hEarthClassification = contextClassification;
  objectNode.dataset.hEarthMaterialKey = String(materialKey);
  objectNode.dataset.hEarthPrimitiveType = String(primitiveType);
  objectNode.dataset.hEarthCandidateDomNodeOnly = 'true';

  const materialDataset =
    materialPort && typeof materialPort.getMaterialDataset === 'function'
      ? materialPort.getMaterialDataset(node)
      : null;

  if (materialDataset) {
    applyHEarthDataset(objectNode, materialDataset);
  }

  const transform = resolveHEarthCssTransform(node);

  if (transform.transformApplied === true) {
    objectNode.style.transform = transform.cssTransform;
  } else {
    objectNode.classList.add(
      H_EARTH_3D_RENDER_NODE_CLASS_POLICY.transformMissingClassName
    );
    objectNode.setAttribute('data-h-earth-transform-missing', 'true');
  }

  objectNode.style.transformStyle = 'preserve-3d';

  const labelText =
    node?.label ||
    node?.objectLabel ||
    node?.displayName ||
    objectId ||
    nodeId ||
    '';

  if (labelText) {
    objectNode.setAttribute('aria-label', String(labelText));
  }

  return Object.freeze({
    objectNode,
    created: true,
    objectId,
    nodeId,
    layerId,
    classification: contextClassification,
    materialKey,
    primitiveType,
    classNames: Object.freeze(
      String(objectNode.className || '')
        .split(/\s+/)
        .filter(Boolean)
    ),
    transformApplied: transform.transformApplied,
    transformSource: transform.source,
    candidateDomNodeOnly: true,
    failureCode: null,
    warningCodes: Object.freeze(
      transform.transformApplied === true
        ? []
        : ['TRANSFORM_DESCRIPTOR_MISSING']
    ),
    boundary: Object.freeze({
      rendererOwned: true,
      routeControlBinding: false,
      gameplayExecutionClaim: false,
      finalGeometryClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function createHEarthRenderLabelNode({
  node,
  controllerTarget,
  text,
  options
} = {}) {
  const ownerDocument =
    options?.documentRef ||
    options?.mountNode?.ownerDocument ||
    options?.renderRoot?.ownerDocument ||
    null;

  if (!ownerDocument || typeof ownerDocument.createElement !== 'function') {
    return Object.freeze({
      labelNode: null,
      created: false,
      objectId: resolveHEarthObjectId(node),
      nodeId: resolveHEarthNodeId(node),
      failureCode: 'INVALID_DOCUMENT_REF',
      boundary: Object.freeze({
        claimBoundaryPreserved: true
      })
    });
  }

  const objectId = resolveHEarthObjectId(node);
  const nodeId = resolveHEarthNodeId(node);
  const labelText =
    text ||
    controllerTarget?.label ||
    node?.label ||
    node?.objectLabel ||
    node?.displayName ||
    objectId ||
    nodeId ||
    '';

  const labelNode = ownerDocument.createElement('span');

  setHEarthOwnedAttribute(
    labelNode,
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.labelNodeType
  );

  labelNode.className = H_EARTH_3D_RENDER_NODE_CLASS_POLICY.labelClassName;
  labelNode.textContent = String(labelText);

  labelNode.setAttribute(
    'data-h-earth-render-contract',
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId
  );

  labelNode.setAttribute('data-h-earth-render-node-id', String(nodeId || ''));
  labelNode.setAttribute('data-h-earth-object-id', String(objectId || ''));
  labelNode.setAttribute('data-h-earth-label-descriptor-only', 'true');

  labelNode.dataset.hEarthRenderContract =
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId;
  labelNode.dataset.hEarthRenderNodeId = String(nodeId || '');
  labelNode.dataset.hEarthObjectId = String(objectId || '');
  labelNode.dataset.hEarthLabelDescriptorOnly = 'true';

  return Object.freeze({
    labelNode,
    created: true,
    objectId,
    nodeId,
    labelText: String(labelText),
    failureCode: null,
    boundary: Object.freeze({
      rendererOwned: true,
      descriptorLabelOnly: true,
      actionBinding: false,
      routeControlBinding: false,
      receiptCreationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function createHEarthRenderAffordanceNode({
  node,
  controllerTarget,
  options
} = {}) {
  if (options?.showAffordances !== true) {
    return Object.freeze({
      affordanceNode: null,
      created: false,
      skipped: true,
      skipReason: 'AFFORDANCES_DISABLED',
      objectId: resolveHEarthObjectId(node),
      nodeId: resolveHEarthNodeId(node),
      claimBoundaryPreserved: true
    });
  }

  const ownerDocument =
    options?.documentRef ||
    options?.mountNode?.ownerDocument ||
    options?.renderRoot?.ownerDocument ||
    null;

  if (!ownerDocument || typeof ownerDocument.createElement !== 'function') {
    return Object.freeze({
      affordanceNode: null,
      created: false,
      objectId: resolveHEarthObjectId(node),
      nodeId: resolveHEarthNodeId(node),
      failureCode: 'INVALID_DOCUMENT_REF',
      boundary: Object.freeze({
        claimBoundaryPreserved: true
      })
    });
  }

  const objectId = resolveHEarthObjectId(node);
  const nodeId = resolveHEarthNodeId(node);

  const affordanceNode = ownerDocument.createElement('span');

  setHEarthOwnedAttribute(
    affordanceNode,
    H_EARTH_3D_RENDER_DOM_OWNERSHIP.affordanceNodeType
  );

  affordanceNode.className =
    H_EARTH_3D_RENDER_NODE_CLASS_POLICY.affordanceClassName;

  affordanceNode.textContent = controllerTarget?.inspectable === true ? 'Inspect' : '';

  affordanceNode.setAttribute(
    'data-h-earth-render-contract',
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId
  );

  affordanceNode.setAttribute('data-h-earth-render-node-id', String(nodeId || ''));
  affordanceNode.setAttribute('data-h-earth-object-id', String(objectId || ''));
  affordanceNode.setAttribute('data-h-earth-affordance-descriptor-only', 'true');

  affordanceNode.dataset.hEarthRenderContract =
    H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT.contractId;
  affordanceNode.dataset.hEarthRenderNodeId = String(nodeId || '');
  affordanceNode.dataset.hEarthObjectId = String(objectId || '');
  affordanceNode.dataset.hEarthAffordanceDescriptorOnly = 'true';

  return Object.freeze({
    affordanceNode,
    created: true,
    objectId,
    nodeId,
    failureCode: null,
    boundary: Object.freeze({
      rendererOwned: true,
      descriptorAffordanceOnly: true,
      actionBinding: false,
      routeControlBinding: false,
      receiptCreationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function clearHEarthRendererOwnedNodes({ mountNode } = {}) {
  const mountValidation = isValidHEarthMountNode(mountNode);

  if (mountValidation.valid !== true) {
    return Object.freeze({
      cleared: false,
      removedCount: 0,
      selector: H_EARTH_3D_RENDER_DOM_OWNERSHIP.ownershipSelector,
      failureCode: mountValidation.reason || 'INVALID_MOUNT_NODE',
      routeShellPreserved: true,
      canonDescriptorsDestroyed: false,
      claimBoundaryPreserved: true
    });
  }

  const ownedNodes = Array.from(
    mountNode.querySelectorAll(H_EARTH_3D_RENDER_DOM_OWNERSHIP.ownershipSelector)
  );

  ownedNodes.forEach((node) => {
    if (node?.parentNode && typeof node.parentNode.removeChild === 'function') {
      node.parentNode.removeChild(node);
    }
  });

  return Object.freeze({
    cleared: true,
    removedCount: ownedNodes.length,
    selector: H_EARTH_3D_RENDER_DOM_OWNERSHIP.ownershipSelector,
    failureCode: null,
    routeShellPreserved: true,
    canonDescriptorsDestroyed: false,
    boundary: Object.freeze({
      clearedOnlyRendererOwnedNodes: true,
      mountNodeInnerHtmlClearedBlindly: false,
      removedRouteShellNodes: false,
      removedUnownedNodes: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    }),
    claimBoundaryPreserved: true
  });
}

export const H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT',
  file: '/showroom/globe/h-earth/render/nodes.js',
  contractId: 'H_EARTH_3D_RENDER_NODE_FACTORY_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',

  domOwnershipMarker: 'data-h-earth-render-owned="true"',
  mountNodeValidationDefined: true,
  nodeTypeCompatibleValidationDefined: true,
  rootFactoryDefined: true,
  objectFactoryDefined: true,
  labelFactoryDefined: true,
  affordanceFactoryDefined: true,
  cleanupFunctionDefined: true,

  allowedElements: Object.freeze(['div', 'span', 'button']),
  forbiddenElements: Object.freeze(['canvas', 'iframe', 'script', 'svg']),

  createsRendererOwnedDomNodes: true,
  createsRouteShell: false,
  bindsRouteControls: false,
  installsGlobalListeners: false,
  queriesGlobalDocument: false,
  clearsMountNodeInnerHtmlBlindly: false,

  boundary: Object.freeze({
    nodeFactoryPortOnly: true,
    clearAuthorityMarkerOnly: true,
    webglActivation: false,
    canvasActivation: false,
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

export function getRenderNodeFactoryReceipt() {
  return H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT;
}

export const H_EARTH_3D_RENDER_NODE_FACTORY = Object.freeze({
  id: 'H_EARTH_3D_RENDER_NODE_FACTORY',
  file: '/showroom/globe/h-earth/render/nodes.js',

  contract: H_EARTH_3D_RENDER_NODE_FACTORY_CONTRACT,
  ownership: H_EARTH_3D_RENDER_DOM_OWNERSHIP,
  classPolicy: H_EARTH_3D_RENDER_NODE_CLASS_POLICY,

  isValidMountNode: isValidHEarthMountNode,
  createRenderRootNode: createHEarthRenderRootNode,
  createRenderObjectNode: createHEarthRenderObjectNode,
  createRenderLabelNode: createHEarthRenderLabelNode,
  createRenderAffordanceNode: createHEarthRenderAffordanceNode,
  clearRendererOwnedNodes: clearHEarthRendererOwnedNodes,
  getReceipt: getRenderNodeFactoryReceipt,

  receipt: H_EARTH_3D_RENDER_NODE_FACTORY_RECEIPT
});

export default H_EARTH_3D_RENDER_NODE_FACTORY;
