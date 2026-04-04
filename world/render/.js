// /world/render.js
// MODE: CONTRACT EXECUTION
// CONTRACT: WORLD_RENDER_CONTRACT_G1
// STATUS: RENDER ONLY | HOST-COMPATIBLE | NON-DRIFT

const RENDER_META = Object.freeze({
  name: "world/render",
  version: "G1",
  contract: "WORLD_RENDER_CONTRACT_G1",
  role: "visible_packet_producer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true
});

const RENDER_CONSTANTS = Object.freeze({
  DEFAULT_HUE: 0.58,
  DEFAULT_SATURATION: 0.52,
  DEFAULT_VALUE: 0.82,
  BLOCK_HUE: 0.0,
  HOLD_HUE: 0.11,
  GATE_HUE: 0.57,
  BRIDGE_HUE: 0.29,
  OPEN_HUE: 0.23,
  BLOCK_SATURATION: 0.72,
  HOLD_SATURATION: 0.68,
  GATE_SATURATION: 0.64,
  BRIDGE_SATURATION: 0.62,
  OPEN_SATURATION: 0.42,
  BLOCK_VALUE: 0.96,
  HOLD_VALUE: 0.96,
  GATE_VALUE: 0.92,
  BRIDGE_VALUE: 0.88,
  OPEN_VALUE: 0.84
});

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
};

const assert = (condition, code) => {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
};

const clamp01 = (value, fallback = 0) => {
  if (!Number.isFinite(value)) return fallback;
  if (value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const asNumber = (value, fallback = 0) => (Number.isFinite(value) ? value : fallback);

const asInteger = (value, fallback = 0) => {
  if (!Number.isFinite(value)) return fallback;
  return Math.trunc(value);
};

const asString = (value, fallback = "") => (typeof value === "string" && value.length > 0 ? value : fallback);

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

const stableRound = (value, places = 12) => {
  const factor = 10 ** places;
  return Math.round(asNumber(value, 0) * factor) / factor;
};

const normalizeLabel = (value, fallback) => {
  const text = asString(value, "").trim();
  return text.length > 0 ? text : fallback;
};

const normalizeClassification = (value) => {
  const text = asString(value, "OPEN").trim().toUpperCase();
  if (text === "BLOCK" || text === "HOLD" || text === "GATE" || text === "BRIDGE") return text;
  return "OPEN";
};

const getRuntimeHandleState = (runtimeHandle) => {
  assert(runtimeHandle && typeof runtimeHandle === "object", "RUNTIME_HANDLE_REQUIRED");
  assert(typeof runtimeHandle.getCurrentState === "function", "RUNTIME_HANDLE_GET_CURRENT_STATE_REQUIRED");

  const state = runtimeHandle.getCurrentState();
  assert(state && typeof state === "object", "RUNTIME_STATE_REQUIRED");

  return state;
};

const getRuntimeField = (runtimeHandle) => {
  if (!runtimeHandle || typeof runtimeHandle.getField !== "function") {
    return deepFreeze({ width: 1, height: 1 });
  }

  const field = normalizeObject(runtimeHandle.getField());
  const width = Math.max(1, asInteger(field.width, 1));
  const height = Math.max(1, asInteger(field.height, 1));

  return deepFreeze({ width, height });
};

const normalizeIndex = (index) =>
  deepFreeze({
    i: asInteger(normalizeObject(index).i, 0),
    j: asInteger(normalizeObject(index).j, 0)
  });

const normalizeDenseIndex = (denseIndex, field) =>
  deepFreeze({
    x: Math.max(0, Math.min(field.width - 1, asInteger(normalizeObject(denseIndex).x, 0))),
    y: Math.max(0, Math.min(field.height - 1, asInteger(normalizeObject(denseIndex).y, 0)))
  });

const normalizeRegion = (region, denseIndex, field) => {
  const regionObject = normalizeObject(region);
  const defaultLabel = `R-${denseIndex.x}-${denseIndex.y}`;

  return deepFreeze({
    label: normalizeLabel(regionObject.label, defaultLabel),
    width: field.width,
    height: field.height
  });
};

const normalizeNode = (node, denseIndex) => {
  const nodeObject = normalizeObject(node);
  const defaultLabel = `N-${denseIndex.x}-${denseIndex.y}`;

  return deepFreeze({
    label: normalizeLabel(nodeObject.label, defaultLabel)
  });
};

const normalizeBoundary = (boundary) => {
  const boundaryObject = normalizeObject(boundary);
  const classification = normalizeClassification(boundaryObject.classification);

  return deepFreeze({
    classification,
    label: normalizeLabel(boundaryObject.label, classification)
  });
};

const normalizeTraversalStatus = (traversalStatus) => {
  const traversalObject = normalizeObject(traversalStatus);

  return deepFreeze({
    action: normalizeLabel(traversalObject.action, "idle")
  });
};

const normalizeReceipt = (receipt, elapsedSeconds) => {
  const receiptObject = normalizeObject(receipt);
  const timestamp = receiptObject.timestamp;

  if (typeof timestamp === "string" && timestamp.length > 0) {
    return deepFreeze({ timestamp });
  }

  return deepFreeze({
    timestamp: `t${stableRound(elapsedSeconds, 3)}`
  });
};

const normalizeProjectionState = (value) => {
  const projection = asString(value, "flat").trim().toLowerCase();
  if (projection === "tree" || projection === "globe") return projection;
  return "flat";
};

const normalizeRuntimePacket = (state, field) => {
  const frameState = normalizeObject(state.frameState);
  const elapsedSeconds = asNumber(frameState.elapsedSeconds, 0);
  const denseIndex = normalizeDenseIndex(state.denseIndex, field);
  const index = normalizeIndex(state.index);

  return deepFreeze({
    projectionState: normalizeProjectionState(state.projectionState),
    index,
    denseIndex,
    region: normalizeRegion(state.region, denseIndex, field),
    node: normalizeNode(state.node, denseIndex),
    boundary: normalizeBoundary(state.boundary),
    terrainClass: normalizeLabel(state.terrainClass, "PLAIN"),
    biomeType: normalizeLabel(state.biomeType, "DEFAULT"),
    traversalStatus: normalizeTraversalStatus(state.traversalStatus),
    receipt: normalizeReceipt(state.receipt, elapsedSeconds)
  });
};

const computeBoundaryColorOutput = (classification) => {
  if (classification === "BLOCK") {
    return deepFreeze({
      hue: RENDER_CONSTANTS.BLOCK_HUE,
      saturation: RENDER_CONSTANTS.BLOCK_SATURATION,
      value: RENDER_CONSTANTS.BLOCK_VALUE
    });
  }

  if (classification === "HOLD") {
    return deepFreeze({
      hue: RENDER_CONSTANTS.HOLD_HUE,
      saturation: RENDER_CONSTANTS.HOLD_SATURATION,
      value: RENDER_CONSTANTS.HOLD_VALUE
    });
  }

  if (classification === "GATE") {
    return deepFreeze({
      hue: RENDER_CONSTANTS.GATE_HUE,
      saturation: RENDER_CONSTANTS.GATE_SATURATION,
      value: RENDER_CONSTANTS.GATE_VALUE
    });
  }

  if (classification === "BRIDGE") {
    return deepFreeze({
      hue: RENDER_CONSTANTS.BRIDGE_HUE,
      saturation: RENDER_CONSTANTS.BRIDGE_SATURATION,
      value: RENDER_CONSTANTS.BRIDGE_VALUE
    });
  }

  return deepFreeze({
    hue: RENDER_CONSTANTS.OPEN_HUE,
    saturation: RENDER_CONSTANTS.OPEN_SATURATION,
    value: RENDER_CONSTANTS.OPEN_VALUE
  });
};

const computeVisiblePacket = (runtimePacket, field) => {
  const boundaryColor = computeBoundaryColorOutput(runtimePacket.boundary.classification);

  return deepFreeze({
    field,
    colorOutput: deepFreeze({
      hue: clamp01(boundaryColor.hue, RENDER_CONSTANTS.DEFAULT_HUE),
      saturation: clamp01(boundaryColor.saturation, RENDER_CONSTANTS.DEFAULT_SATURATION),
      value: clamp01(boundaryColor.value, RENDER_CONSTANTS.DEFAULT_VALUE)
    }),
    emphasis: deepFreeze({
      boundary: runtimePacket.boundary.classification,
      terrain: runtimePacket.terrainClass,
      biome: runtimePacket.biomeType
    })
  });
};

const computeFlatProjection = (runtimePacket, field) =>
  deepFreeze({
    kind: "flat",
    x: runtimePacket.denseIndex.x,
    y: runtimePacket.denseIndex.y,
    width: field.width,
    height: field.height
  });

const computeTreeProjection = (runtimePacket, field) => {
  const root = Math.max(0, Math.min(8, Math.floor((runtimePacket.denseIndex.x / Math.max(1, field.width)) * 9)));
  const leaf = Math.max(0, Math.min(15, Math.floor((runtimePacket.denseIndex.y / Math.max(1, field.height)) * 16)));

  return deepFreeze({
    kind: "tree",
    root,
    leaf,
    width: 9,
    height: 16
  });
};

const computeGlobeProjection = (runtimePacket, field) => {
  const nx = field.width <= 1 ? 0 : runtimePacket.denseIndex.x / (field.width - 1);
  const ny = field.height <= 1 ? 0 : runtimePacket.denseIndex.y / (field.height - 1);

  const longitude = nx * (Math.PI * 2) - Math.PI;
  const latitude = (0.5 - ny) * Math.PI;

  const x = stableRound(Math.cos(latitude) * Math.sin(longitude), 12);
  const y = stableRound(Math.sin(latitude), 12);

  return deepFreeze({
    kind: "globe",
    longitude: stableRound(longitude, 12),
    latitude: stableRound(latitude, 12),
    x,
    y
  });
};

const computeProjectionPacket = (runtimePacket, field) => {
  const projectionState = runtimePacket.projectionState;

  if (projectionState === "tree") {
    return deepFreeze({
      selectedProjection: computeTreeProjection(runtimePacket, field)
    });
  }

  if (projectionState === "globe") {
    return deepFreeze({
      selectedProjection: computeGlobeProjection(runtimePacket, field)
    });
  }

  return deepFreeze({
    selectedProjection: computeFlatProjection(runtimePacket, field)
  });
};

const render = (runtimeHandle) => {
  const state = getRuntimeHandleState(runtimeHandle);
  const field = getRuntimeField(runtimeHandle);
  const runtime = normalizeRuntimePacket(state, field);
  const visible = computeVisiblePacket(runtime, field);
  const projection = computeProjectionPacket(runtime, field);

  return deepFreeze({
    meta: RENDER_META,
    runtime,
    visible,
    projection
  });
};

const WORLD_RENDER = deepFreeze({
  meta: RENDER_META,
  constants: RENDER_CONSTANTS,
  render
});

export const meta = WORLD_RENDER.meta;
export const constants = WORLD_RENDER.constants;
export { render };
export default WORLD_RENDER;
