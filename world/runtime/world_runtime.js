// /world/runtime.js
// MODE: CONTRACT EXECUTION
// CONTRACT: RUNTIME_BASELINE_CONTRACT_G1
// STATUS: ORCHESTRATION ONLY | DETERMINISTIC | NON-DRIFT | NO PLATFORM OWNERSHIP

import { createPlanetEngine } from "./planet_engine.js";

const RUNTIME_META = Object.freeze({
  name: "runtime",
  version: "G1_BASELINE",
  contract: "RUNTIME_BASELINE_CONTRACT_G1",
  role: "orchestration_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: false,
  renderOwned: false
});

const RUNTIME_CONSTANTS = Object.freeze({
  PROJECTIONS: Object.freeze(["flat", "tree", "globe"]),
  STEP_MIN: -1,
  STEP_MAX: 1
});

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => {
    deepFreeze(value[key]);
  });
  return Object.freeze(value);
};

const assert = (condition, code) => {
  if (!condition) {
    const error = new Error(code);
    error.code = code;
    throw error;
  }
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const clamp = (value, min, max) => {
  if (!Number.isFinite(value)) return min;
  if (value < min) return min;
  if (value > max) return max;
  return value;
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const normalizeFrameState = (value = {}) => {
  const source = normalizeObject(value);
  const elapsedSeconds =
    typeof source.elapsedSeconds === "number" && Number.isFinite(source.elapsedSeconds)
      ? Math.max(0, source.elapsedSeconds)
      : 0;

  return deepFreeze({
    elapsedSeconds
  });
};

const normalizeProjection = (value) => {
  const projection = String(value || "flat").toLowerCase();
  assert(
    RUNTIME_CONSTANTS.PROJECTIONS.includes(projection),
    "INVALID_PROJECTION"
  );
  return projection;
};

const normalizeIntegerStep = (value) =>
  clamp(
    Number.isFinite(value) ? Math.trunc(value) : 0,
    RUNTIME_CONSTANTS.STEP_MIN,
    RUNTIME_CONSTANTS.STEP_MAX
  );

const safeReceiptClone = (receipt, timestamp) => {
  const source = normalizeObject(receipt);
  const state = normalizeObject(source.state);
  const region = normalizeObject(source.region);
  const node = normalizeObject(source.node);
  const forces = normalizeObject(source.forces);

  assert(Number.isInteger(state.i) && Number.isInteger(state.j), "INVALID_RECEIPT_STATE");
  assert(Number.isFinite(timestamp), "INVALID_RECEIPT_TIMESTAMP");

  return deepFreeze({
    state: deepFreeze({
      i: state.i,
      j: state.j
    }),
    region:
      typeof source.region === "string"
        ? source.region
        : deepFreeze({
            regionId: region.regionId,
            label: region.label
          }),
    node:
      typeof source.node === "string"
        ? source.node
        : deepFreeze({
            nodeId: node.nodeId,
            label: node.label
          }),
    forces:
      source.forces && typeof source.forces === "object"
        ? deepFreeze({
            N: Number(forces.N || 0),
            E: Number(forces.E || 0),
            S: Number(forces.S || 0),
            W: Number(forces.W || 0),
            B: Number(forces.B || 0)
          })
        : source.forces,
    boundary: source.boundary,
    timestamp
  });
};

const normalizeSample = (sample, x, y) => {
  const s = normalizeObject(sample);
  const receipt = normalizeObject(s.receipt);
  const threshold = normalizeObject(s.threshold);
  const boundary = normalizeObject(s.boundary);
  const force = normalizeObject(s.force);
  const projections = normalizeObject(s.projections);

  assert(Number.isInteger(s.i) && Number.isInteger(s.j), "INVALID_SAMPLE_KERNEL_INDEX");
  assert(receipt && typeof receipt === "object", "INVALID_SAMPLE_RECEIPT");
  assert(typeof boundary.classification === "string", "INVALID_SAMPLE_BOUNDARY");
  assert(typeof threshold.action === "string", "INVALID_SAMPLE_THRESHOLD");
  assert(force && typeof force === "object", "INVALID_SAMPLE_FORCE");
  assert(projections && typeof projections === "object", "INVALID_SAMPLE_PROJECTIONS");

  return deepFreeze({
    dense: deepFreeze({ x, y }),
    kernel: deepFreeze({ i: s.i, j: s.j }),
    region: s.region,
    divide: s.divide,
    node: s.node,
    boundary: s.boundary,
    force: s.force,
    terrainClass: s.terrainClass,
    biomeType: s.biomeType,
    surfaceMaterial: s.surfaceMaterial,
    climateBand: s.climateBand,
    climate: s.climate,
    moisture: s.moisture,
    accumulation: s.accumulation,
    shorelineMask: s.shorelineMask,
    landMask: s.landMask,
    waterMask: s.waterMask,
    habitability: s.habitability,
    traversalDifficulty: s.traversalDifficulty,
    fields: s.fields,
    derived: s.derived,
    projections: s.projections,
    receipt: s.receipt,
    threshold: s.threshold,
    dynamicIllumination: s.dynamicIllumination,
    dynamicCloudBias: s.dynamicCloudBias,
    dynamicStormBias: s.dynamicStormBias,
    dynamicCurrentBias: s.dynamicCurrentBias,
    dynamicAuroraBias: s.dynamicAuroraBias,
    dynamicGlowBias: s.dynamicGlowBias,
    motionState: s.motionState
  });
};

const normalizePlanetField = (planetField) => {
  const field = normalizeObject(planetField);
  const samples = Array.isArray(field.samples) ? field.samples : null;

  assert(samples && samples.length > 0, "INVALID_PLANET_FIELD_SAMPLES");

  const height = typeof field.height === "number" ? field.height : samples.length;
  const width =
    typeof field.width === "number"
      ? field.width
      : Array.isArray(samples[0])
        ? samples[0].length
        : 0;

  assert(Number.isInteger(width) && width > 0, "INVALID_PLANET_FIELD_WIDTH");
  assert(Number.isInteger(height) && height > 0, "INVALID_PLANET_FIELD_HEIGHT");
  assert(samples.length === height, "PLANET_FIELD_HEIGHT_MISMATCH");

  const normalizedRows = [];
  const byDenseKey = {};
  const byKernelReceiptKey = {};

  for (let y = 0; y < height; y += 1) {
    const row = samples[y];
    assert(Array.isArray(row), "INVALID_PLANET_FIELD_ROW");
    assert(row.length === width, "PLANET_FIELD_WIDTH_MISMATCH");

    const normalizedRow = [];
    for (let x = 0; x < width; x += 1) {
      const normalizedSample = normalizeSample(row[x], x, y);
      normalizedRow.push(normalizedSample);
      byDenseKey[`${x},${y}`] = normalizedSample;

      const kernelKey = `${normalizedSample.kernel.i},${normalizedSample.kernel.j}`;
      if (!hasOwn(byKernelReceiptKey, kernelKey)) {
        byKernelReceiptKey[kernelKey] = normalizedSample;
      }
    }
    normalizedRows.push(deepFreeze(normalizedRow));
  }

  return deepFreeze({
    width,
    height,
    samples: deepFreeze(normalizedRows),
    byDenseKey: deepFreeze(byDenseKey),
    byKernelReceiptKey: deepFreeze(byKernelReceiptKey),
    summary: deepFreeze(normalizeObject(field.summary)),
    motionContract: deepFreeze(normalizeObject(field.motionContract)),
    timeState: deepFreeze(normalizeObject(field.timeState))
  });
};

const getSampleByDenseIndex = (field, x, y) => {
  const xx = clamp(x, 0, field.width - 1);
  const yy = clamp(y, 0, field.height - 1);
  return field.byDenseKey[`${xx},${yy}`];
};

const buildTraversalStatus = (currentSample, targetSample = null) => {
  const currentThreshold = normalizeObject(currentSample.threshold);
  const currentBoundary = normalizeObject(currentSample.boundary);

  const thresholdPass = currentThreshold.action === "PASS";
  const boundaryPass = currentBoundary.classification !== "BLOCK";
  const targetExists = !!targetSample;
  const targetLawful = targetExists
    ? !!(
        targetSample &&
        targetSample.receipt &&
        Number.isInteger(targetSample.kernel.i) &&
        Number.isInteger(targetSample.kernel.j)
      )
    : false;

  const admissible = thresholdPass && boundaryPass && (!targetExists || targetLawful);

  return deepFreeze({
    admissible,
    action: admissible ? "PASS" : "HALT",
    thresholdPass,
    boundaryPass,
    targetExists,
    targetLawful
  });
};

const buildProjectionPackets = (sample) => {
  const projections = normalizeObject(sample.projections);
  return deepFreeze({
    flat: projections.flat || null,
    tree: projections.tree || null,
    globe: projections.globe || null
  });
};

const selectProjectionPacket = (projectionPackets, projectionState) =>
  projectionPackets[projectionState] || null;

const buildCurrentStatePacket = (sample, projectionState, traversalStatus) => {
  const projectionPackets = buildProjectionPackets(sample);

  return deepFreeze({
    index: deepFreeze({
      i: sample.kernel.i,
      j: sample.kernel.j
    }),
    denseIndex: deepFreeze({
      x: sample.dense.x,
      y: sample.dense.y
    }),
    projectionState,
    selectedProjection: selectProjectionPacket(projectionPackets, projectionState),
    region: sample.region,
    divide: sample.divide,
    node: sample.node,
    boundary: sample.boundary,
    forces: sample.force.vector,
    force: sample.force,
    threshold: sample.threshold,
    receipt: sample.receipt,
    successorReceipt: null,
    traversalStatus,
    projections: projectionPackets,
    fields: sample.fields,
    derived: sample.derived,
    terrainClass: sample.terrainClass,
    biomeType: sample.biomeType,
    surfaceMaterial: sample.surfaceMaterial,
    climateBand: sample.climateBand,
    climate: sample.climate,
    moisture: sample.moisture,
    accumulation: sample.accumulation,
    shorelineMask: sample.shorelineMask,
    landMask: sample.landMask,
    waterMask: sample.waterMask,
    habitability: sample.habitability,
    traversalDifficulty: sample.traversalDifficulty,
    dynamicIllumination: sample.dynamicIllumination,
    dynamicCloudBias: sample.dynamicCloudBias,
    dynamicStormBias: sample.dynamicStormBias,
    dynamicCurrentBias: sample.dynamicCurrentBias,
    dynamicAuroraBias: sample.dynamicAuroraBias,
    dynamicGlowBias: sample.dynamicGlowBias,
    motionState: sample.motionState,
    visualLight: sample.dynamicIllumination
  });
};

const buildRuntimeSnapshot = (
  field,
  cursor,
  projectionState,
  runtimeTick,
  activeTraversalStatus = null
) => {
  const currentSample = getSampleByDenseIndex(field, cursor.x, cursor.y);
  const traversalStatus = activeTraversalStatus || buildTraversalStatus(currentSample, null);
  const currentReceipt = safeReceiptClone(currentSample.receipt, runtimeTick);

  const currentPacket = buildCurrentStatePacket(
    deepFreeze({
      ...currentSample,
      receipt: currentReceipt
    }),
    projectionState,
    traversalStatus
  );

  return deepFreeze({
    field,
    cursor: deepFreeze({ x: cursor.x, y: cursor.y }),
    projectionState,
    runtimeTick,
    currentSample,
    currentReceipt,
    traversalStatus,
    currentPacket,
    projectionPackets: currentPacket.projections
  });
};

const computeSuccessor = (snapshot, dx, dy) => {
  const nextX = clamp(snapshot.cursor.x + dx, 0, snapshot.field.width - 1);
  const nextY = clamp(snapshot.cursor.y + dy, 0, snapshot.field.height - 1);

  const targetSample = getSampleByDenseIndex(snapshot.field, nextX, nextY);
  const traversalStatus = buildTraversalStatus(snapshot.currentSample, targetSample);

  if (!traversalStatus.admissible) {
    return deepFreeze({
      advanced: false,
      cursor: snapshot.cursor,
      sample: snapshot.currentSample,
      traversalStatus
    });
  }

  return deepFreeze({
    advanced: true,
    cursor: deepFreeze({ x: nextX, y: nextY }),
    sample: targetSample,
    traversalStatus
  });
};

const resolveDefaultCursor = (field, source = {}) => {
  const summary = normalizeObject(field.summary);
  const preferred = normalizeObject(summary.defaultCursor);

  return deepFreeze({
    x: clamp(
      Number.isInteger(source.initialX)
        ? source.initialX
        : Number.isInteger(preferred.x)
          ? preferred.x
          : Math.floor(field.width / 2),
      0,
      field.width - 1
    ),
    y: clamp(
      Number.isInteger(source.initialY)
        ? source.initialY
        : Number.isInteger(preferred.y)
          ? preferred.y
          : Math.floor(field.height / 2),
      0,
      field.height - 1
    )
  });
};

const buildFacade = (stateRef, engineRef, frameStateRef) => {
  const api = {
    meta: RUNTIME_META,

    getCurrentState() {
      return stateRef.current.currentPacket;
    },

    getTraversalStatus() {
      return stateRef.current.traversalStatus;
    },

    getProjectionState() {
      return stateRef.current.projectionState;
    },

    getSelectedProjection() {
      return selectProjectionPacket(
        stateRef.current.projectionPackets,
        stateRef.current.projectionState
      );
    },

    getProjections() {
      return stateRef.current.projectionPackets;
    },

    getSuccessorReceipt() {
      return null;
    },

    getStateByReceipt(receipt) {
      const r = normalizeObject(receipt);
      const receiptState = normalizeObject(r.state);

      assert(
        Number.isInteger(receiptState.i) && Number.isInteger(receiptState.j),
        "INVALID_RECEIPT_LOOKUP"
      );

      const sample = stateRef.current.field.byKernelReceiptKey[`${receiptState.i},${receiptState.j}`];
      if (!sample) return null;

      const clonedReceipt = safeReceiptClone(
        sample.receipt,
        Number.isInteger(r.timestamp) ? r.timestamp : stateRef.current.runtimeTick
      );

      return buildCurrentStatePacket(
        deepFreeze({
          ...sample,
          receipt: clonedReceipt
        }),
        stateRef.current.projectionState,
        buildTraversalStatus(sample, null)
      );
    },

    getField() {
      return stateRef.current.field;
    },

    refreshFrameState(nextFrameState = {}) {
      frameStateRef.current = normalizeFrameState(nextFrameState);

      stateRef.current = buildRuntimeSnapshot(
        stateRef.current.field,
        stateRef.current.cursor,
        stateRef.current.projectionState,
        stateRef.current.runtimeTick,
        null
      );

      return stateRef.current.currentPacket;
    },

    advance(step = {}) {
      const move = normalizeObject(step);
      const dx = normalizeIntegerStep(move.dx);
      const dy = normalizeIntegerStep(move.dy);

      const successor = computeSuccessor(stateRef.current, dx, dy);

      if (!successor.advanced) {
        stateRef.current = buildRuntimeSnapshot(
          stateRef.current.field,
          stateRef.current.cursor,
          stateRef.current.projectionState,
          stateRef.current.runtimeTick,
          successor.traversalStatus
        );

        return deepFreeze({
          advanced: false,
          state: stateRef.current.currentPacket,
          traversalStatus: successor.traversalStatus,
          successorReceipt: null
        });
      }

      stateRef.current = buildRuntimeSnapshot(
        stateRef.current.field,
        successor.cursor,
        stateRef.current.projectionState,
        stateRef.current.runtimeTick + 1,
        successor.traversalStatus
      );

      return deepFreeze({
        advanced: true,
        state: stateRef.current.currentPacket,
        traversalStatus: stateRef.current.traversalStatus,
        successorReceipt: null
      });
    },

    reset(resetOptions = {}) {
      const next = normalizeObject(resetOptions);
      frameStateRef.current = normalizeFrameState(
        hasOwn(next, "frameState") ? next.frameState : frameStateRef.current
      );

      const nextProjectionState = normalizeProjection(
        hasOwn(next, "projection") ? next.projection : stateRef.current.projectionState
      );

      const nextField = normalizePlanetField(
        hasOwn(next, "planetField")
          ? next.planetField
          : stateRef.current.field
      );

      const nextCursor = resolveDefaultCursor(nextField, next);

      stateRef.current = buildRuntimeSnapshot(
        nextField,
        nextCursor,
        nextProjectionState,
        0,
        null
      );

      return stateRef.current.currentPacket;
    }
  };

  return deepFreeze(api);
};

export function createRuntime(options = {}) {
  const source = normalizeObject(options);

  const engineRef = {
    current:
      source.engine && typeof source.engine.buildPlanetFrame === "function"
        ? source.engine
        : createPlanetEngine()
  };

  const frameStateRef = {
    current: normalizeFrameState(source.frameState)
  };

  const initialProjectionState = normalizeProjection(source.projection || "flat");
  const providedField = source.planetField || null;

  const field = normalizePlanetField(
    providedField || engineRef.current.buildPlanetFrame(frameStateRef.current)
  );

  const initialCursor = resolveDefaultCursor(field, source);

  const stateRef = {
    current: buildRuntimeSnapshot(
      field,
      initialCursor,
      initialProjectionState,
      0,
      null
    )
  };

  return buildFacade(stateRef, engineRef, frameStateRef);
}

const defaultRuntimeRef = {
  current: null
};

const ensureDefaultRuntime = () => {
  if (!defaultRuntimeRef.current) {
    defaultRuntimeRef.current = createRuntime();
  }
  return defaultRuntimeRef.current;
};

export const hasDefaultRuntime = () => defaultRuntimeRef.current !== null;

export const clearDefaultRuntime = () => {
  defaultRuntimeRef.current = null;
  return null;
};

export const getDefaultRuntime = () => ensureDefaultRuntime();

export const getCurrentState = () => ensureDefaultRuntime().getCurrentState();
export const getTraversalStatus = () => ensureDefaultRuntime().getTraversalStatus();
export const getProjectionState = () => ensureDefaultRuntime().getProjectionState();
export const getSelectedProjection = () => ensureDefaultRuntime().getSelectedProjection();
export const getProjections = () => ensureDefaultRuntime().getProjections();
export const getSuccessorReceipt = () => ensureDefaultRuntime().getSuccessorReceipt();
export const getStateByReceipt = (receipt) => ensureDefaultRuntime().getStateByReceipt(receipt);
export const getField = () => ensureDefaultRuntime().getField();
export const refreshFrameState = (frameState = {}) =>
  ensureDefaultRuntime().refreshFrameState(frameState);
export const advance = (step = {}) => ensureDefaultRuntime().advance(step);
export const reset = (options = {}) => ensureDefaultRuntime().reset(options);

const buildRuntimeReceipt = (runtime, timestamp) => {
  const currentState = normalizeObject(runtime.getCurrentState());
  const traversalStatus = normalizeObject(runtime.getTraversalStatus());
  const field = normalizeObject(runtime.getField());
  const receipt = normalizeObject(currentState.receipt);
  const state = normalizeObject(receipt.state);
  const region = normalizeObject(currentState.region);
  const node = normalizeObject(currentState.node);
  const boundary = normalizeObject(currentState.boundary);
  const threshold = normalizeObject(currentState.threshold);
  const force = normalizeObject(currentState.force);
  const forceVector = normalizeObject(force.vector);
  const selectedProjection = normalizeObject(currentState.selectedProjection);

  return deepFreeze({
    source: RUNTIME_META.name,
    contract: RUNTIME_META.contract,
    timestamp,
    verification: deepFreeze({
      pass: true,
      deterministic: RUNTIME_META.deterministic
    }),
    phase:
      typeof threshold.action === "string"
        ? threshold.action
        : traversalStatus.admissible
          ? "PASS"
          : "HALT",
    projection: runtime.getProjectionState(),
    state: deepFreeze({
      i: Number.isInteger(currentState.index?.i) ? currentState.index.i : state.i,
      j: Number.isInteger(currentState.index?.j) ? currentState.index.j : state.j
    }),
    denseIndex: deepFreeze({
      x: Number.isInteger(currentState.denseIndex?.x) ? currentState.denseIndex.x : 0,
      y: Number.isInteger(currentState.denseIndex?.y) ? currentState.denseIndex.y : 0
    }),
    region:
      typeof currentState.region === "string"
        ? currentState.region
        : deepFreeze({
            regionId: region.regionId || region.label || null,
            label: region.label || region.regionId || null
          }),
    node:
      typeof currentState.node === "string"
        ? currentState.node
        : deepFreeze({
            nodeId: node.nodeId || node.label || null,
            label: node.label || node.nodeId || null
          }),
    boundary: currentState.boundary,
    threshold: currentState.threshold,
    forces: deepFreeze({
      N: Number(forceVector.N || 0),
      E: Number(forceVector.E || 0),
      S: Number(forceVector.S || 0),
      W: Number(forceVector.W || 0),
      B: Number(forceVector.B || 0)
    }),
    traversalStatus: currentState.traversalStatus,
    selectedProjection,
    fieldSummary: deepFreeze({
      width: Number(field.width || 0),
      height: Number(field.height || 0)
    }),
    terrainClass: currentState.terrainClass || null,
    biomeType: currentState.biomeType || null,
    surfaceMaterial: currentState.surfaceMaterial || null,
    climateBand: currentState.climateBand || null,
    habitability: currentState.habitability ?? null,
    traversalDifficulty: currentState.traversalDifficulty ?? null
  });
};

export const getRuntimeReceipt = (options = {}) => {
  const source = normalizeObject(options);
  const runtime =
    source.runtime && typeof source.runtime.getCurrentState === "function"
      ? source.runtime
      : ensureDefaultRuntime();

  if (hasOwn(source, "frameState")) {
    runtime.refreshFrameState(source.frameState);
  }

  const timestamp =
    typeof source.timestamp === "number" && Number.isFinite(source.timestamp)
      ? source.timestamp
      : Date.now();

  return buildRuntimeReceipt(runtime, timestamp);
};

const DEFAULT_RUNTIME = deepFreeze({
  meta: RUNTIME_META,

  getCurrentState() {
    return ensureDefaultRuntime().getCurrentState();
  },

  getTraversalStatus() {
    return ensureDefaultRuntime().getTraversalStatus();
  },

  getProjectionState() {
    return ensureDefaultRuntime().getProjectionState();
  },

  getSelectedProjection() {
    return ensureDefaultRuntime().getSelectedProjection();
  },

  getProjections() {
    return ensureDefaultRuntime().getProjections();
  },

  getSuccessorReceipt() {
    return ensureDefaultRuntime().getSuccessorReceipt();
  },

  getStateByReceipt(receipt) {
    return ensureDefaultRuntime().getStateByReceipt(receipt);
  },

  getField() {
    return ensureDefaultRuntime().getField();
  },

  refreshFrameState(frameState = {}) {
    return ensureDefaultRuntime().refreshFrameState(frameState);
  },

  advance(step = {}) {
    return ensureDefaultRuntime().advance(step);
  },

  reset(options = {}) {
    return ensureDefaultRuntime().reset(options);
  },

  getRuntimeReceipt(options = {}) {
    return getRuntimeReceipt(options);
  }
});

export default DEFAULT_RUNTIME;
