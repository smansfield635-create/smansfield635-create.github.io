// /showroom/globe/h-earth/render/layers.js
// NEW FILE
// H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_023A_v1
//
// Purpose:
// Layer placement port for the H-Earth DOM/CSS-3D Candidate Renderer.
//
// This file creates renderer-owned layer containers inside a supplied renderer
// root node and places already-created object nodes into deterministic layer
// containers.
//
// This file does not create object nodes, define material classes, own
// compositor law, define object identity, query the global document, create
// WebGL/canvas, claim renderer pass, claim visual pass, claim validation,
// claim production, authorize traversal, authorize simulation, or collapse
// matrices.

export const H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT = Object.freeze({
  contractId: 'H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',
  renewedRendererFrom: 'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023_v1',

  file: '/showroom/globe/h-earth/render/layers.js',
  parentFile: '/showroom/globe/h-earth/renderer.js',
  route: '/showroom/globe/h-earth/',
  sourceRoot: '/h-earth-3d/',

  fileClass: 'DOM_CSS_3D_CANDIDATE_LAYER_PLACEMENT_PORT',
  status: 'LAYER_PLACEMENT_PORT_DEFINED_NON_FINAL_RENDERING',

  targetMatrix: 'H-Earth',
  matrixRole: 'Ground-View Matrix',
  activeCell: 'H_EARTH_GROUND_CELL_001',
  sceneIdentity: 'earth-water-air-survival-shoreline-manor',

  boundary: Object.freeze({
    createsLayerContainers: true,
    createsObjectNodes: false,
    definesMaterialClasses: false,
    ownsCompositorOrdering: false,
    bypassesCompositor: false,
    queriesGlobalDocument: false,
    webglActivation: false,
    canvasActivation: false,
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

export const H_EARTH_3D_RENDER_LAYER_DATASET_KEYS = Object.freeze({
  renderOwned: 'hEarthRenderOwned',
  renderNodeType: 'hEarthRenderNodeType',
  layerId: 'hEarthLayerId',
  layerOrder: 'hEarthLayerOrder',
  layerClass: 'hEarthLayerClass'
});

export const H_EARTH_3D_RENDER_LAYER_CLASS_MAP = Object.freeze({
  'distant-world-context-layer': Object.freeze({
    layerId: 'distant-world-context-layer',
    className: 'h-earth-layer-distant-world-context',
    defaultOrder: 10
  }),

  'air-haze-light-layer': Object.freeze({
    layerId: 'air-haze-light-layer',
    className: 'h-earth-layer-air-haze-light',
    defaultOrder: 20
  }),

  'water-surface-plane-layer': Object.freeze({
    layerId: 'water-surface-plane-layer',
    className: 'h-earth-layer-water-surface-plane',
    defaultOrder: 30
  }),

  'nearshore-wave-band-layer': Object.freeze({
    layerId: 'nearshore-wave-band-layer',
    className: 'h-earth-layer-nearshore-wave-band',
    defaultOrder: 40
  }),

  'shoreline-foam-line-layer': Object.freeze({
    layerId: 'shoreline-foam-line-layer',
    className: 'h-earth-layer-shoreline-foam-line',
    defaultOrder: 50
  }),

  'manor-exterior-context-layer': Object.freeze({
    layerId: 'manor-exterior-context-layer',
    className: 'h-earth-layer-manor-exterior-context',
    defaultOrder: 60
  }),

  'dry-sand-transition-layer': Object.freeze({
    layerId: 'dry-sand-transition-layer',
    className: 'h-earth-layer-dry-sand-transition',
    defaultOrder: 70
  }),

  'foreground-wet-sand-layer': Object.freeze({
    layerId: 'foreground-wet-sand-layer',
    className: 'h-earth-layer-foreground-wet-sand',
    defaultOrder: 80
  }),

  'tide-pools-stones-rocks-detail-layer': Object.freeze({
    layerId: 'tide-pools-stones-rocks-detail-layer',
    className: 'h-earth-layer-tide-pools-stones-rocks-detail',
    defaultOrder: 90
  }),

  'inspection-anchor-overlay-layer': Object.freeze({
    layerId: 'inspection-anchor-overlay-layer',
    className: 'h-earth-layer-inspection-anchor-overlay',
    defaultOrder: 100
  }),

  'unclassified-render-layer': Object.freeze({
    layerId: 'unclassified-render-layer',
    className: 'h-earth-layer-unclassified-render',
    defaultOrder: 999
  })
});

export const H_EARTH_3D_RENDER_LAYER_POLICY = Object.freeze({
  ownershipAttribute: 'data-h-earth-render-owned',
  ownershipValue: 'true',
  layerNodeType: 'layer',
  fallbackLayerId: 'unclassified-render-layer',
  baseLayerClass: 'h-earth-render-layer',

  boundary: Object.freeze({
    layerPlacementOnly: true,
    createsLayerContainers: true,
    createsObjectNodes: false,
    mutatesOnlySuppliedRenderRoot: true,
    queriesGlobalDocument: false,
    webglActivation: false,
    canvasActivation: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    matrixCollapse: false
  })
});

export function normalizeHEarthLayerId(layerId) {
  return String(layerId || H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId)
    .trim()
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[_\s]+/g, '-')
    .replace(/[^a-zA-Z0-9-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .toLowerCase() || H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;
}

export function resolveHEarthLayerClass(layerId) {
  const normalizedLayerId = normalizeHEarthLayerId(layerId);
  const layer =
    H_EARTH_3D_RENDER_LAYER_CLASS_MAP[normalizedLayerId] ||
    H_EARTH_3D_RENDER_LAYER_CLASS_MAP[
      H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
    ];

  const fallbackUsed =
    layer.layerId === H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;

  return Object.freeze({
    layerId: layer.layerId,
    requestedLayerId: layerId || null,
    className: layer.className,
    defaultOrder: layer.defaultOrder,
    resolved: fallbackUsed === false,
    fallbackUsed,
    compositorOrderingBypassed: false,
    finalOrderingValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthLayerIdForNode(node) {
  const nodeId =
    node?.sourceNodeId ||
    node?.nodeId ||
    node?.composedNodeId ||
    null;

  const objectId = node?.objectId || node?.sourceObjectId || null;

  const requestedLayerId =
    node?.layerId ||
    node?.renderLayerId ||
    node?.layer?.layerId ||
    node?.composition?.layerId ||
    null;

  const resolvedLayer = resolveHEarthLayerClass(requestedLayerId);

  const rawLayerOrder =
    node?.layerOrder ??
    node?.renderLayerOrder ??
    node?.layer?.order ??
    node?.composition?.layerOrder ??
    resolvedLayer.defaultOrder;

  const layerOrder = Number.isFinite(Number(rawLayerOrder))
    ? Number(rawLayerOrder)
    : resolvedLayer.defaultOrder;

  return Object.freeze({
    nodeId,
    objectId,
    layerId: resolvedLayer.layerId,
    requestedLayerId,
    layerOrder,
    resolved: resolvedLayer.resolved,
    fallbackUsed: resolvedLayer.fallbackUsed,
    compositorOrderingBypassed: false,
    finalOrderingValidationClaim: false,
    claimBoundaryPreserved: true
  });
}

export function resolveHEarthLayerDescriptors({
  layerOrder,
  composedCandidateFrame,
  candidateRenderScene
} = {}) {
  const descriptors = [];

  if (Array.isArray(layerOrder) && layerOrder.length > 0) {
    layerOrder.forEach((entry, index) => {
      if (typeof entry === 'string') {
        const resolved = resolveHEarthLayerClass(entry);
        descriptors.push({
          layerId: resolved.layerId,
          order: resolved.defaultOrder ?? index,
          source: 'layerOrder'
        });
        return;
      }

      if (entry && typeof entry === 'object') {
        const resolved = resolveHEarthLayerClass(
          entry.layerId || entry.id || entry.name
        );
        descriptors.push({
          layerId: resolved.layerId,
          order:
            Number.isFinite(Number(entry.order)) === true
              ? Number(entry.order)
              : resolved.defaultOrder ?? index,
          source: 'layerOrder'
        });
      }
    });
  }

  const frameLayerOrder =
    composedCandidateFrame?.layerOrder ||
    composedCandidateFrame?.composition?.layerOrder ||
    composedCandidateFrame?.layers ||
    null;

  if (descriptors.length === 0 && Array.isArray(frameLayerOrder)) {
    frameLayerOrder.forEach((entry, index) => {
      const layerId =
        typeof entry === 'string'
          ? entry
          : entry?.layerId || entry?.id || entry?.name;

      const resolved = resolveHEarthLayerClass(layerId);

      descriptors.push({
        layerId: resolved.layerId,
        order:
          typeof entry === 'object' && Number.isFinite(Number(entry?.order))
            ? Number(entry.order)
            : resolved.defaultOrder ?? index,
        source: 'composedCandidateFrame'
      });
    });
  }

  const sceneLayerOrder =
    candidateRenderScene?.layerOrder ||
    candidateRenderScene?.layers ||
    null;

  if (descriptors.length === 0 && Array.isArray(sceneLayerOrder)) {
    sceneLayerOrder.forEach((entry, index) => {
      const layerId =
        typeof entry === 'string'
          ? entry
          : entry?.layerId || entry?.id || entry?.name;

      const resolved = resolveHEarthLayerClass(layerId);

      descriptors.push({
        layerId: resolved.layerId,
        order:
          typeof entry === 'object' && Number.isFinite(Number(entry?.order))
            ? Number(entry.order)
            : resolved.defaultOrder ?? index,
        source: 'candidateRenderScene'
      });
    });
  }

  if (descriptors.length === 0) {
    Object.values(H_EARTH_3D_RENDER_LAYER_CLASS_MAP)
      .filter(
        (layer) =>
          layer.layerId !== H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
      )
      .forEach((layer) => {
        descriptors.push({
          layerId: layer.layerId,
          order: layer.defaultOrder,
          source: 'defaultLayerMap'
        });
      });
  }

  const seen = new Set();
  const deduped = descriptors
    .filter((descriptor) => {
      if (!descriptor?.layerId || seen.has(descriptor.layerId)) {
        return false;
      }
      seen.add(descriptor.layerId);
      return true;
    })
    .sort((a, b) => Number(a.order) - Number(b.order));

  const fallbackLayer = H_EARTH_3D_RENDER_LAYER_CLASS_MAP[
    H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId
  ];

  if (!seen.has(fallbackLayer.layerId)) {
    deduped.push({
      layerId: fallbackLayer.layerId,
      order: fallbackLayer.defaultOrder,
      source: 'requiredFallbackLayer'
    });
  }

  return Object.freeze(
    deduped.map((descriptor) =>
      Object.freeze({
        layerId: descriptor.layerId,
        order: descriptor.order,
        source: descriptor.source
      })
    )
  );
}

export function createHEarthLayerContainer({
  documentRef,
  layerDescriptor
} = {}) {
  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      layerContainer: null,
      created: false,
      failureCode: 'INVALID_DOCUMENT_REF',
      claimBoundaryPreserved: true
    });
  }

  const resolvedLayer = resolveHEarthLayerClass(layerDescriptor?.layerId);
  const layerOrder = Number.isFinite(Number(layerDescriptor?.order))
    ? Number(layerDescriptor.order)
    : resolvedLayer.defaultOrder;

  const layerContainer = documentRef.createElement('div');

  layerContainer.className = [
    H_EARTH_3D_RENDER_LAYER_POLICY.baseLayerClass,
    resolvedLayer.className
  ]
    .filter(Boolean)
    .join(' ');

  layerContainer.setAttribute(
    H_EARTH_3D_RENDER_LAYER_POLICY.ownershipAttribute,
    H_EARTH_3D_RENDER_LAYER_POLICY.ownershipValue
  );

  layerContainer.setAttribute(
    'data-h-earth-render-node-type',
    H_EARTH_3D_RENDER_LAYER_POLICY.layerNodeType
  );

  layerContainer.setAttribute('data-h-earth-layer-id', resolvedLayer.layerId);
  layerContainer.setAttribute('data-h-earth-layer-order', String(layerOrder));
  layerContainer.setAttribute('data-h-earth-layer-class', resolvedLayer.className);

  layerContainer.dataset.hEarthRenderOwned = 'true';
  layerContainer.dataset.hEarthRenderNodeType =
    H_EARTH_3D_RENDER_LAYER_POLICY.layerNodeType;
  layerContainer.dataset.hEarthLayerId = resolvedLayer.layerId;
  layerContainer.dataset.hEarthLayerOrder = String(layerOrder);
  layerContainer.dataset.hEarthLayerClass = resolvedLayer.className;

  layerContainer.style.transformStyle = 'preserve-3d';

  return Object.freeze({
    layerContainer,
    layerId: resolvedLayer.layerId,
    layerOrder,
    layerClass: resolvedLayer.className,
    created: true,
    fallbackUsed: resolvedLayer.fallbackUsed,
    rendererOwned: true,
    boundary: Object.freeze({
      createdInsideRendererRootOnly: true,
      createsObjectNodes: false,
      ownsCompositorOrdering: false,
      bypassesCompositor: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function createHEarthLayerContainers({
  renderRoot,
  rootNode,
  layerOrder,
  composedCandidateFrame,
  candidateRenderScene
} = {}) {
  const targetRoot = renderRoot || rootNode;

  if (!targetRoot || typeof targetRoot.appendChild !== 'function') {
    return Object.freeze({
      layerContainersById: Object.freeze({}),
      orderedLayerIds: Object.freeze([]),
      layerCount: 0,
      created: false,
      failureCodes: Object.freeze(['INVALID_RENDER_ROOT']),
      warningCodes: Object.freeze([]),
      boundary: Object.freeze({
        rendererRootAccepted: false,
        claimBoundaryPreserved: true
      })
    });
  }

  const documentRef = targetRoot.ownerDocument;

  if (!documentRef || typeof documentRef.createElement !== 'function') {
    return Object.freeze({
      layerContainersById: Object.freeze({}),
      orderedLayerIds: Object.freeze([]),
      layerCount: 0,
      created: false,
      failureCodes: Object.freeze(['INVALID_DOCUMENT_REF']),
      warningCodes: Object.freeze([]),
      boundary: Object.freeze({
        rendererRootAccepted: true,
        claimBoundaryPreserved: true
      })
    });
  }

  const descriptors = resolveHEarthLayerDescriptors({
    layerOrder,
    composedCandidateFrame,
    candidateRenderScene
  });

  const layerContainersById = {};
  const orderedLayerIds = [];
  const warningCodes = [];

  descriptors.forEach((descriptor) => {
    const result = createHEarthLayerContainer({
      documentRef,
      layerDescriptor: descriptor
    });

    if (result.created !== true || !result.layerContainer) {
      warningCodes.push(`LAYER_CONTAINER_SKIPPED:${descriptor.layerId}`);
      return;
    }

    targetRoot.appendChild(result.layerContainer);
    layerContainersById[result.layerId] = result.layerContainer;
    orderedLayerIds.push(result.layerId);
  });

  return Object.freeze({
    layerContainersById: Object.freeze(layerContainersById),
    orderedLayerIds: Object.freeze(orderedLayerIds),
    layerCount: orderedLayerIds.length,
    created: orderedLayerIds.length > 0,
    failureCodes: Object.freeze([]),
    warningCodes: Object.freeze(warningCodes),
    boundary: Object.freeze({
      createdInsideRendererRootOnly: true,
      createsObjectNodes: false,
      ownsCompositorOrdering: false,
      bypassesCompositor: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    })
  });
}

export function getHEarthLayerContainer({
  layerContainersById,
  layerId
} = {}) {
  const resolved = resolveHEarthLayerClass(layerId);

  const directContainer = layerContainersById?.[resolved.layerId] || null;

  if (directContainer) {
    return Object.freeze({
      layerContainer: directContainer,
      layerId: resolved.layerId,
      fallbackUsed: false,
      found: true,
      claimBoundaryPreserved: true
    });
  }

  const fallbackLayerId = H_EARTH_3D_RENDER_LAYER_POLICY.fallbackLayerId;
  const fallbackContainer = layerContainersById?.[fallbackLayerId] || null;

  return Object.freeze({
    layerContainer: fallbackContainer,
    layerId: fallbackContainer ? fallbackLayerId : resolved.layerId,
    requestedLayerId: resolved.layerId,
    fallbackUsed: Boolean(fallbackContainer),
    found: Boolean(fallbackContainer),
    claimBoundaryPreserved: true
  });
}

export function placeHEarthNodeInLayer({
  objectNode,
  node,
  layerContainersById
} = {}) {
  const nodeLayer = resolveHEarthLayerIdForNode(node);
  const targetLayer = getHEarthLayerContainer({
    layerContainersById,
    layerId: nodeLayer.layerId
  });

  if (!objectNode || typeof objectNode.setAttribute !== 'function') {
    return Object.freeze({
      placed: false,
      objectId: nodeLayer.objectId,
      nodeId: nodeLayer.nodeId,
      layerId: nodeLayer.layerId,
      layerOrder: nodeLayer.layerOrder,
      fallbackUsed: targetLayer.fallbackUsed,
      failureCode: 'INVALID_OBJECT_NODE',
      warningCodes: Object.freeze([]),
      domMutationScope: 'none',
      finalOrderingValidationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    });
  }

  if (!targetLayer.layerContainer) {
    return Object.freeze({
      placed: false,
      objectId: nodeLayer.objectId,
      nodeId: nodeLayer.nodeId,
      layerId: nodeLayer.layerId,
      layerOrder: nodeLayer.layerOrder,
      fallbackUsed: targetLayer.fallbackUsed,
      failureCode: 'LAYER_CONTAINER_MISSING',
      warningCodes: Object.freeze([]),
      domMutationScope: 'none',
      finalOrderingValidationClaim: false,
      rendererPassClaim: false,
      visualPassClaim: false,
      validationClaim: false,
      productionClaim: false,
      claimBoundaryPreserved: true
    });
  }

  objectNode.setAttribute('data-h-earth-layer-id', targetLayer.layerId);
  objectNode.setAttribute('data-h-earth-layer-order', String(nodeLayer.layerOrder));

  objectNode.dataset.hEarthLayerId = targetLayer.layerId;
  objectNode.dataset.hEarthLayerOrder = String(nodeLayer.layerOrder);

  targetLayer.layerContainer.appendChild(objectNode);

  return Object.freeze({
    placed: true,
    objectId: nodeLayer.objectId,
    nodeId: nodeLayer.nodeId,
    layerId: targetLayer.layerId,
    requestedLayerId: nodeLayer.layerId,
    layerOrder: nodeLayer.layerOrder,
    fallbackUsed: targetLayer.fallbackUsed,
    failureCode: null,
    warningCodes: Object.freeze(
      targetLayer.fallbackUsed === true ? ['FALLBACK_LAYER_USED'] : []
    ),
    domMutationScope: 'renderer-root-only',
    finalOrderingValidationClaim: false,
    rendererPassClaim: false,
    visualPassClaim: false,
    validationClaim: false,
    productionClaim: false,
    claimBoundaryPreserved: true
  });
}

export const H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT = Object.freeze({
  receiptType: 'H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT',
  file: '/showroom/globe/h-earth/render/layers.js',
  contractId: 'H_EARTH_3D_RENDER_LAYER_PORT_FILE_BIRTH_STEP_023A_v1',
  parentRenewal:
    'H_EARTH_3D_RENDERER_FILE_BIRTH_STEP_023A_MOUNT_API_AND_RENDER_PORT_RENEWAL_PACKET_v1',

  layerClassMapDefined: true,
  layerDatasetKeysDefined: true,
  layerContainerFactoryDefined: true,
  layerPlacementFunctionDefined: true,

  requiredLayerIds: Object.freeze([
    'distant-world-context-layer',
    'air-haze-light-layer',
    'water-surface-plane-layer',
    'nearshore-wave-band-layer',
    'shoreline-foam-line-layer',
    'manor-exterior-context-layer',
    'dry-sand-transition-layer',
    'foreground-wet-sand-layer',
    'tide-pools-stones-rocks-detail-layer',
    'inspection-anchor-overlay-layer'
  ]),

  fallbackLayerId: 'unclassified-render-layer',

  createsLayerContainers: true,
  createsObjectNodes: false,
  definesMaterialClasses: false,
  ownsCompositorOrdering: false,
  bypassesCompositor: false,
  queriesGlobalDocument: false,

  boundary: Object.freeze({
    layerPortOnly: true,
    mutatesOnlySuppliedRenderRoot: true,
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

export function getRenderLayerPortReceipt() {
  return H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT;
}

export const H_EARTH_3D_RENDER_LAYER_PORT = Object.freeze({
  id: 'H_EARTH_3D_RENDER_LAYER_PORT',
  file: '/showroom/globe/h-earth/render/layers.js',

  contract: H_EARTH_3D_RENDER_LAYER_PORT_CONTRACT,
  classMap: H_EARTH_3D_RENDER_LAYER_CLASS_MAP,
  datasetKeys: H_EARTH_3D_RENDER_LAYER_DATASET_KEYS,
  policy: H_EARTH_3D_RENDER_LAYER_POLICY,

  normalizeLayerId: normalizeHEarthLayerId,
  resolveLayerClass: resolveHEarthLayerClass,
  resolveLayerIdForNode: resolveHEarthLayerIdForNode,
  resolveLayerDescriptors: resolveHEarthLayerDescriptors,
  createLayerContainer: createHEarthLayerContainer,
  createLayerContainers: createHEarthLayerContainers,
  getLayerContainer: getHEarthLayerContainer,
  placeNodeInLayer: placeHEarthNodeInLayer,
  getReceipt: getRenderLayerPortReceipt,

  receipt: H_EARTH_3D_RENDER_LAYER_PORT_RECEIPT
});

export default H_EARTH_3D_RENDER_LAYER_PORT;
