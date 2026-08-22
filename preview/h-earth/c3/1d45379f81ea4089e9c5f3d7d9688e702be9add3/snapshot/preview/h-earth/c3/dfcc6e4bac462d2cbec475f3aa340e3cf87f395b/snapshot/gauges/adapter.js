// /adapter.js
// MODE: ADAPTER BRIDGE
// STATUS: OBSERVER EXPORT ONLY | NON-DRIFT | NO TRUTH OWNERSHIP

const ADAPTER_META = Object.freeze({
  name: "adapter",
  version: "G1",
  role: "observer_export_bridge",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true
});

const RECEIPT_KEY = "__AUTHORITY_RECEIPT__";

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const cloneReceipt = (receipt, fallbackTimestamp) => {
  const source = normalizeObject(receipt);
  const state = normalizeObject(source.state);
  const region = normalizeObject(source.region);
  const node = normalizeObject(source.node);
  const forces = normalizeObject(source.forces);

  return deepFreeze({
    state: deepFreeze({
      i: Number.isInteger(state.i) ? state.i : null,
      j: Number.isInteger(state.j) ? state.j : null
    }),
    region:
      typeof source.region === "string"
        ? source.region
        : deepFreeze({
            regionId: region.regionId ?? null,
            label: typeof region.label === "string" ? region.label : "—"
          }),
    node:
      typeof source.node === "string"
        ? source.node
        : deepFreeze({
            nodeId: node.nodeId ?? null,
            label: typeof node.label === "string" ? node.label : "—"
          }),
    forces: deepFreeze({
      N: Number(forces.N || 0),
      E: Number(forces.E || 0),
      S: Number(forces.S || 0),
      W: Number(forces.W || 0),
      B: Number(forces.B || 0)
    }),
    boundary: source.boundary ?? null,
    timestamp:
      Number.isFinite(source.timestamp) ? source.timestamp : fallbackTimestamp
  });
};

const buildAuthorityReceipt = (runtimePacket, renderPacket) => {
  const runtime = normalizeObject(runtimePacket);
  const render = normalizeObject(renderPacket);
  const validatorStatus = normalizeObject(render.visible?.validatorStatus);
  const projection = normalizeObject(render.projection);
  const selectedProjection = normalizeObject(projection.selectedProjection);

  return deepFreeze({
    phase: "RUNNING",
    timestamp: Date.now(),
    verification: deepFreeze({
      pass: validatorStatus.ok === true
    }),
    state: deepFreeze({
      i: Number.isInteger(runtime.index?.i) ? runtime.index.i : null,
      j: Number.isInteger(runtime.index?.j) ? runtime.index.j : null
    }),
    region: deepFreeze({
      regionId: runtime.region?.regionId ?? null,
      label: typeof runtime.region?.label === "string" ? runtime.region.label : "—"
    }),
    node: deepFreeze({
      nodeId: runtime.node?.nodeId ?? null,
      label: typeof runtime.node?.label === "string" ? runtime.node.label : "—"
    }),
    boundary: runtime.boundary?.classification ?? null,
    forces: deepFreeze({
      N: Number(runtime.forces?.N || 0),
      E: Number(runtime.forces?.E || 0),
      S: Number(runtime.forces?.S || 0),
      W: Number(runtime.forces?.W || 0),
      B: Number(runtime.forces?.B || 0)
    }),
    receipt: cloneReceipt(runtime.receipt, Date.now()),
    projectionState: runtime.projectionState ?? "flat",
    primitive: deepFreeze({
      primitiveType: runtime.terrainClass ?? "UNKNOWN",
      primitivePath: projection.projectionState ?? runtime.projectionState ?? "flat"
    }),
    topology: deepFreeze({
      visibleCellCount: 1,
      emittedCellCount: 1,
      skippedCellCount: 0
    }),
    density: deepFreeze({
      densityTier: "HOST",
      subdivisionTier: "BASELINE",
      averageCellSpanPx: null
    }),
    audit: deepFreeze({
      waterFamilyCount: Number(runtime.waterMask || 0),
      landFamilyCount: Number(runtime.landMask || 0),
      cryosphereCount: 0,
      shorelineCount: Number(runtime.shorelineMask || 0),
      terrainChannelCount: 1,
      atmosphereChannelCount: 1,
      cosmosChannelCount: 1,
      psychologyChannelCount: 0
    }),
    renderAuthority: deepFreeze({
      liveRenderPath: "/world/render.js",
      renderReadsScope: true,
      renderReadsLens: true,
      fallbackMode: false
    }),
    projectionSummary: deepFreeze({
      centerX: Number(selectedProjection.x ?? null),
      centerY: Number(selectedProjection.y ?? null),
      radius: Number(selectedProjection.z ?? null),
      yaw: null,
      pitch: null
    }),
    traversalState: deepFreeze({
      activeMode: runtime.traversalStatus?.action ?? "—"
    }),
    worldModeState: deepFreeze({
      diagnostics: deepFreeze({
        activeTraversalMode: runtime.traversalStatus?.action ?? "—"
      })
    }),
    worldVariantState: deepFreeze({
      activeVariant: 1,
      ratio: runtime.projectionState ?? "flat"
    }),
    scope: "WORLD_HOST",
    lens: runtime.projectionState ?? "flat",
    psychology: deepFreeze({
      state: deepFreeze({}),
      envelope: deepFreeze({}),
      receipt: deepFreeze({})
    }),
    __source: "window"
  });
};

export const publishAuthorityReceipt = (runtimePacket, renderPacket) => {
  if (typeof window === "undefined") return null;
  const receipt = buildAuthorityReceipt(runtimePacket, renderPacket);
  window[RECEIPT_KEY] = receipt;
  return receipt;
};

export const clearAuthorityReceipt = () => {
  if (typeof window === "undefined") return;
  try {
    delete window[RECEIPT_KEY];
  } catch {
    window[RECEIPT_KEY] = undefined;
  }
};

const adapterModule = deepFreeze({
  meta: ADAPTER_META,
  publishAuthorityReceipt,
  clearAuthorityReceipt
});

export default adapterModule;
