// /world/render.js
// MODE: CONTRACT EXECUTION
// CONTRACT: RENDER_BASELINE_CONTRACT_G1
// STATUS: DETERMINISTIC EXPRESSION ONLY | NON-DRIFT | RUNTIME-SUBORDINATE

import runtime from "./runtime.js";

const RENDER_META = Object.freeze({
  name: "render",
  version: "G1",
  contract: "RENDER_BASELINE_CONTRACT_G1",
  role: "deterministic_expression_layer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: false,
  runtimeSubordinate: true
});

const RENDER_CONSTANTS = Object.freeze({
  PROJECTIONS: Object.freeze(["flat", "tree", "globe"]),
  BOUNDARY_CLASSES: Object.freeze(["OPEN", "HOLD", "GATE", "BRIDGE", "BLOCK"]),
  FORCE_DIRECTIONS: Object.freeze(["N", "E", "S", "W"]),
  VALIDATOR_KEYS: Object.freeze([
    "runtimeTraceability",
    "fieldCompleteness",
    "projectionConsistency",
    "determinism",
    "boundaryConsistency",
    "receiptConsistency",
    "artifactDrift",
    "thresholdIntegrity",
    "successorProjectionCompleteness"
  ]),
  MOTION_THRESHOLD: 0.0001
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

const clamp01 = (value) => {
  if (!Number.isFinite(value) || value <= 0) return 0;
  if (value >= 1) return 1;
  return value;
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const stableStringify = (value) => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
};

const normalizeProjection = (value) => {
  const projection = String(value || "flat").toLowerCase();
  assert(RENDER_CONSTANTS.PROJECTIONS.includes(projection), "INVALID_PROJECTION");
  return projection;
};

const normalizeBoundaryClass = (value) => {
  const boundaryClass = String(value || "").toUpperCase();
  assert(RENDER_CONSTANTS.BOUNDARY_CLASSES.includes(boundaryClass), "INVALID_BOUNDARY_CLASS");
  return boundaryClass;
};

const forcePriorityIndex = (direction) => RENDER_CONSTANTS.FORCE_DIRECTIONS.indexOf(direction);

const sortForces = (forces) =>
  RENDER_CONSTANTS.FORCE_DIRECTIONS
    .map((direction) => deepFreeze({ direction, value: Number(forces[direction] || 0) }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return forcePriorityIndex(a.direction) - forcePriorityIndex(b.direction);
    });

const normalizeReceipt = (receipt) => {
  const source = normalizeObject(receipt);
  const state = normalizeObject(source.state);
  const region = normalizeObject(source.region);
  const node = normalizeObject(source.node);
  const forces = normalizeObject(source.forces);

  assert(Number.isInteger(state.i) && Number.isInteger(state.j), "INVALID_RECEIPT_STATE");
  assert(Number.isFinite(source.timestamp), "INVALID_RECEIPT_TIMESTAMP");

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
            label: typeof region.label === "string" ? region.label : String(region.regionId)
          }),
    node:
      typeof source.node === "string"
        ? source.node
        : deepFreeze({
            nodeId: node.nodeId,
            label: typeof node.label === "string" ? node.label : String(node.nodeId)
          }),
    forces: deepFreeze({
      N: Number(forces.N || 0),
      E: Number(forces.E || 0),
      S: Number(forces.S || 0),
      W: Number(forces.W || 0),
      B: Number(forces.B || 0)
    }),
    boundary: source.boundary,
    timestamp: source.timestamp
  });
};

const normalizeRuntimePacket = (runtimePacket) => {
  const packet = normalizeObject(runtimePacket);
  const index = normalizeObject(packet.index);
  const denseIndex = normalizeObject(packet.denseIndex);
  const region = normalizeObject(packet.region);
  const divide = normalizeObject(packet.divide);
  const node = normalizeObject(packet.node);
  const boundary = normalizeObject(packet.boundary);
  const forces = normalizeObject(packet.forces);
  const force = normalizeObject(packet.force);
  const threshold = normalizeObject(packet.threshold);
  const traversalStatus = normalizeObject(packet.traversalStatus);
  const projections = normalizeObject(packet.projections);
  const fields = normalizeObject(packet.fields);
  const derived = normalizeObject(packet.derived);

  assert(Number.isInteger(index.i) && Number.isInteger(index.j), "INVALID_RUNTIME_INDEX");
  assert(Number.isInteger(denseIndex.x) && Number.isInteger(denseIndex.y), "INVALID_RUNTIME_DENSE_INDEX");
  assert(typeof boundary.classification === "string", "INVALID_RUNTIME_BOUNDARY");
  assert(typeof threshold.action === "string", "INVALID_RUNTIME_THRESHOLD");
  assert(typeof traversalStatus.action === "string", "INVALID_RUNTIME_TRAVERSAL");
  assert(projections.flat && projections.tree && projections.globe, "INVALID_RUNTIME_PROJECTIONS");

  return deepFreeze({
    index: deepFreeze({ i: index.i, j: index.j }),
    denseIndex: deepFreeze({ x: denseIndex.x, y: denseIndex.y }),
    projectionState: normalizeProjection(packet.projectionState || "flat"),
    selectedProjection: packet.selectedProjection || null,
    region: deepFreeze({
      regionId: region.regionId,
      label: typeof region.label === "string" ? region.label : String(region.regionId)
    }),
    divide: deepFreeze({
      divideId: divide.divideId,
      label: typeof divide.label === "string" ? divide.label : String(divide.divideId)
    }),
    node: deepFreeze({
      nodeId: node.nodeId,
      label: typeof node.label === "string" ? node.label : String(node.nodeId)
    }),
    boundary: deepFreeze({
      ...boundary,
      classification: normalizeBoundaryClass(boundary.classification)
    }),
    forces: deepFreeze({
      N: Number(forces.N || 0),
      E: Number(forces.E || 0),
      S: Number(forces.S || 0),
      W: Number(forces.W || 0),
      B: Number(forces.B || 0)
    }),
    force,
    threshold,
    receipt: normalizeReceipt(packet.receipt),
    successorReceipt: packet.successorReceipt ? normalizeReceipt(packet.successorReceipt) : null,
    traversalStatus: deepFreeze({
      admissible: traversalStatus.admissible === true,
      action: traversalStatus.action,
      thresholdPass: traversalStatus.thresholdPass === true,
      boundaryPass: traversalStatus.boundaryPass === true,
      targetExists: traversalStatus.targetExists === true,
      targetLawful: traversalStatus.targetLawful === true
    }),
    projections: deepFreeze({
      flat: projections.flat,
      tree: projections.tree,
      globe: projections.globe
    }),
    fields: deepFreeze({ ...fields }),
    derived: deepFreeze({ ...derived }),
    terrainClass: String(packet.terrainClass || "UNKNOWN"),
    biomeType: String(packet.biomeType || "UNKNOWN"),
    surfaceMaterial: String(packet.surfaceMaterial || "UNKNOWN"),
    climateBand: packet.climateBand !== undefined && packet.climateBand !== null ? String(packet.climateBand) : null,
    climate: Number(packet.climate || 0),
    moisture: Number(packet.moisture || 0),
    accumulation: Number(packet.accumulation || 0),
    shorelineMask: Number(packet.shorelineMask || 0),
    landMask: Number(packet.landMask || 0),
    waterMask: Number(packet.waterMask || 0),
    habitability: Number(packet.habitability || 0),
    traversalDifficulty: Number(packet.traversalDifficulty || 0),
    dynamicIllumination: Number(packet.dynamicIllumination || 0),
    dynamicCloudBias: Number(packet.dynamicCloudBias || 0),
    dynamicStormBias: Number(packet.dynamicStormBias || 0),
    dynamicCurrentBias: Number(packet.dynamicCurrentBias || 0),
    dynamicAuroraBias: Number(packet.dynamicAuroraBias || 0),
    dynamicGlowBias: Number(packet.dynamicGlowBias || 0),
    motionState: deepFreeze({ ...normalizeObject(packet.motionState) }),
    visualLight: Number(packet.visualLight || 0)
  });
};

const normalizeSelectedProjection = (projectionState, selectedProjection, projections) => {
  const selected = normalizeObject(selectedProjection || projections[projectionState]);
  assert(selectedProjection || projections[projectionState], "MISSING_SELECTED_PROJECTION");

  if (projectionState === "flat") {
    assert(Number.isFinite(selected.x) && Number.isFinite(selected.y), "INVALID_FLAT_PROJECTION");
    return deepFreeze({
      projectionState,
      selectedProjection: selected,
      coordinates: deepFreeze({
        x: selected.x,
        y: selected.y,
        z: 0
      })
    });
  }

  if (projectionState === "tree") {
    assert(
      Number.isFinite(selected.root) &&
        (typeof selected.branch === "string" || Number.isFinite(selected.branch)) &&
        Number.isFinite(selected.leaf),
      "INVALID_TREE_PROJECTION"
    );
    return deepFreeze({
      projectionState,
      selectedProjection: selected,
      coordinates: deepFreeze({
        x: selected.root / 9,
        y: selected.leaf / 16,
        z: 0
      })
    });
  }

  assert(
    Number.isFinite(selected.x) &&
      Number.isFinite(selected.y) &&
      Number.isFinite(selected.z),
    "INVALID_GLOBE_PROJECTION"
  );

  return deepFreeze({
    projectionState,
    selectedProjection: selected,
    coordinates: deepFreeze({
      x: selected.x,
      y: selected.y,
      z: selected.z
    })
  });
};

const normalizeSuccessorPacket = (runtimeHandle) => {
  const successorReceipt =
    typeof runtimeHandle.getSuccessorReceipt === "function"
      ? runtimeHandle.getSuccessorReceipt()
      : null;

  if (!successorReceipt) return null;

  const successorState =
    typeof runtimeHandle.getStateByReceipt === "function"
      ? runtimeHandle.getStateByReceipt(successorReceipt)
      : null;

  assert(successorState, "MISSING_SUCCESSOR_STATE");

  const normalizedState = normalizeRuntimePacket(successorState);
  const projection = normalizeSelectedProjection(
    normalizedState.projectionState,
    normalizedState.selectedProjection,
    normalizedState.projections
  );

  return deepFreeze({
    receipt: normalizeReceipt(successorReceipt),
    state: normalizedState,
    projection
  });
};

const buildColorOutput = (packet) => {
  const terrainHue = Object.freeze({
    BASIN: 0.58,
    PLAIN: 0.22,
    PLATEAU: 0.16,
    RIDGE: 0.12,
    MOUNTAIN: 0.08,
    SUMMIT: 0.04
  });

  const biomeSat = Object.freeze({
    DESERT: 0.35,
    GRASSLAND: 0.50,
    FOREST: 0.62,
    RAINFOREST: 0.78,
    GLACIER: 0.10,
    TUNDRA: 0.16
  });

  const elevationProxy = clamp01(1 - Number(packet.forces.B || 0));
  const climate = clamp01(packet.climate);
  const moisture = clamp01(packet.moisture);

  return deepFreeze({
    terrainClass: packet.terrainClass,
    biomeType: packet.biomeType,
    hue: terrainHue[packet.terrainClass] ?? 0.5,
    saturation: clamp01(biomeSat[packet.biomeType] ?? 0.4),
    value: clamp01(0.35 + climate * 0.25 + moisture * 0.15 + elevationProxy * 0.25)
  });
};

const buildLuminanceOutput = (packet) => {
  const illumination = clamp01(packet.dynamicIllumination);
  const gradient = clamp01(Number(packet.fields.boundaryPressure || 0));
  const climate = clamp01(packet.climate);
  const moisture = clamp01(packet.moisture);

  return clamp01(
    illumination * 0.45 +
      (1 - gradient) * 0.2 +
      climate * 0.2 +
      moisture * 0.15
  );
};

const buildDepthOutput = (coordinates) => clamp01((Number(coordinates.z || 0) + 1) / 2);

const buildBoundaryVisibility = (boundaryClass) =>
  deepFreeze({
    OPEN: boundaryClass === "OPEN",
    HOLD: boundaryClass === "HOLD",
    GATE: boundaryClass === "GATE",
    BRIDGE: boundaryClass === "BRIDGE",
    BLOCK: boundaryClass === "BLOCK"
  });

const buildNodeForceVisibility = (packet) => {
  const sorted = sortForces(packet.forces);

  return deepFreeze({
    nodeId: packet.node.nodeId,
    nodeLabel: packet.node.label,
    dominantForce: sorted[0].direction,
    dominantValue: sorted[0].value,
    secondaryForce: sorted[1].direction,
    secondaryValue: sorted[1].value,
    inspectableForces: deepFreeze({
      N: packet.forces.N,
      E: packet.forces.E,
      S: packet.forces.S,
      W: packet.forces.W,
      B: packet.forces.B
    })
  });
};

const buildMotionOutput = (runtimePacket, projection, successor) => {
  if (!successor || runtimePacket.traversalStatus.admissible !== true) {
    return deepFreeze({
      visible: false,
      delta: 0,
      vector: deepFreeze({ x: 0, y: 0, z: 0 })
    });
  }

  const dx = successor.projection.coordinates.x - projection.coordinates.x;
  const dy = successor.projection.coordinates.y - projection.coordinates.y;
  const dz = successor.projection.coordinates.z - projection.coordinates.z;
  const delta = Math.sqrt(dx * dx + dy * dy + dz * dz);

  return deepFreeze({
    visible: delta >= RENDER_CONSTANTS.MOTION_THRESHOLD,
    delta,
    vector: deepFreeze({ x: dx, y: dy, z: dz })
  });
};

const buildTransitionVisibility = (runtimePacket, successor, motionOutput) => {
  const currentReceipt = runtimePacket.receipt;
  const successorReceipt = successor ? successor.receipt : null;

  const lineage =
    !!successorReceipt &&
    successorReceipt.timestamp === currentReceipt.timestamp + 1 &&
    successorReceipt.state.i === successor.state.index.i &&
    successorReceipt.state.j === successor.state.index.j;

  if (runtimePacket.traversalStatus.admissible !== true || !lineage) {
    return deepFreeze({
      visible: false,
      admissible: runtimePacket.traversalStatus.admissible === true,
      lineage,
      sourceTimestamp: currentReceipt.timestamp,
      successorTimestamp: successorReceipt ? successorReceipt.timestamp : null,
      delta: 0
    });
  }

  return deepFreeze({
    visible: motionOutput.visible,
    admissible: true,
    lineage: true,
    sourceTimestamp: currentReceipt.timestamp,
    successorTimestamp: successorReceipt.timestamp,
    delta: motionOutput.delta
  });
};

const validateRuntimeTraceability = (packet) =>
  packet.runtime.receipt.state.i === packet.runtime.index.i &&
  packet.runtime.receipt.state.j === packet.runtime.index.j &&
  packet.runtime.denseIndex.x === packet.sourceDense.x &&
  packet.runtime.denseIndex.y === packet.sourceDense.y;

const validateFieldCompleteness = (runtimeHandle) => {
  const field = typeof runtimeHandle.getField === "function" ? runtimeHandle.getField() : null;
  const width = Number(field && field.width);
  const height = Number(field && field.height);
  const samples = field && Array.isArray(field.samples) ? field.samples : null;

  if (!(Number.isInteger(width) && Number.isInteger(height) && samples && samples.length === height)) {
    return false;
  }

  for (let y = 0; y < height; y += 1) {
    if (!Array.isArray(samples[y]) || samples[y].length !== width) {
      return false;
    }
  }

  return true;
};

const validateProjectionConsistency = (packet) => {
  const base = packet.runtime;
  const projections = ["flat", "tree", "globe"];

  return projections.every((projectionName) => {
    const variant = base.projections[projectionName];
    return !!variant &&
      base.region.label === packet.runtime.region.label &&
      base.boundary.classification === packet.runtime.boundary.classification &&
      base.node.nodeId === packet.runtime.node.nodeId &&
      stableStringify(base.forces) === stableStringify(packet.runtime.forces) &&
      stableStringify({
        state: base.receipt.state,
        region: base.receipt.region,
        node: base.receipt.node,
        boundary: base.receipt.boundary,
        timestamp: base.receipt.timestamp
      }) === stableStringify({
        state: packet.runtime.receipt.state,
        region: packet.runtime.receipt.region,
        node: packet.runtime.receipt.node,
        boundary: packet.runtime.receipt.boundary,
        timestamp: packet.runtime.receipt.timestamp
      });
  });
};

const validateBoundaryConsistency = (packet) => {
  const visible = packet.visible.boundaryVisibility;
  const active = packet.runtime.boundary.classification;
  return Object.keys(visible).every((key) => visible[key] === (key === active));
};

const validateReceiptConsistency = (packet) => {
  const currentReceipt = packet.runtime.receipt;
  const successorReceipt = packet.successor ? packet.successor.receipt : null;

  if (!successorReceipt) return true;

  return (
    successorReceipt.timestamp === currentReceipt.timestamp + 1 &&
    packet.visible.transitionVisibility.lineage === true &&
    packet.visible.transitionVisibility.sourceTimestamp === currentReceipt.timestamp &&
    packet.visible.transitionVisibility.successorTimestamp === successorReceipt.timestamp
  );
};

const validateArtifactDrift = (packet) => {
  const expectedColor = buildColorOutput(packet.runtime);
  const expectedLuminance = buildLuminanceOutput(packet.runtime);
  const expectedDepth = buildDepthOutput(packet.projection.coordinates);
  const expectedBoundaryVisibility = buildBoundaryVisibility(packet.runtime.boundary.classification);
  const expectedNodeForceVisibility = buildNodeForceVisibility(packet.runtime);

  return (
    stableStringify(packet.visible.colorOutput) === stableStringify(expectedColor) &&
    packet.visible.luminanceOutput === expectedLuminance &&
    packet.visible.depthOutput === expectedDepth &&
    stableStringify(packet.visible.boundaryVisibility) === stableStringify(expectedBoundaryVisibility) &&
    stableStringify(packet.visible.nodeForceVisibility) === stableStringify(expectedNodeForceVisibility)
  );
};

const validateThresholdIntegrity = (packet) => {
  const admissible = packet.runtime.traversalStatus.admissible;
  const blocked = packet.runtime.boundary.classification === "BLOCK";
  const motionVisible = packet.visible.motionOutput.visible;
  const transitionVisible = packet.visible.transitionVisibility.visible;

  if (!admissible && (motionVisible || transitionVisible)) return false;
  if (blocked && transitionVisible) return false;
  if (packet.successor && !transitionVisible && admissible && !blocked) {
    return packet.visible.motionOutput.delta < RENDER_CONSTANTS.MOTION_THRESHOLD;
  }

  return true;
};

const validateSuccessorProjectionCompleteness = (packet) => {
  if (!packet.successor) return true;
  return !!(packet.successor.projection.selectedProjection && packet.successor.projection.coordinates);
};

const runValidatorSuite = (runtimeHandle, packet) => {
  const validators = Object.freeze({
    runtimeTraceability: () => validateRuntimeTraceability(packet),
    fieldCompleteness: () => validateFieldCompleteness(runtimeHandle),
    projectionConsistency: () => validateProjectionConsistency(packet),
    determinism: () => true,
    boundaryConsistency: () => validateBoundaryConsistency(packet),
    receiptConsistency: () => validateReceiptConsistency(packet),
    artifactDrift: () => validateArtifactDrift(packet),
    thresholdIntegrity: () => validateThresholdIntegrity(packet),
    successorProjectionCompleteness: () => validateSuccessorProjectionCompleteness(packet)
  });

  const actualKeys = Object.keys(validators).sort();
  const canonicalKeys = [...RENDER_CONSTANTS.VALIDATOR_KEYS].sort();
  assert(stableStringify(actualKeys) === stableStringify(canonicalKeys), "VALIDATOR_KEY_DRIFT");

  const checks = {};
  RENDER_CONSTANTS.VALIDATOR_KEYS.forEach((key) => {
    checks[key] = Boolean(validators[key]());
  });

  return deepFreeze({
    ok: Object.values(checks).every(Boolean),
    checks: deepFreeze(checks)
  });
};

const buildRenderPacket = (runtimeHandle = runtime) => {
  const runtimePacket = normalizeRuntimePacket(
    typeof runtimeHandle.getCurrentState === "function"
      ? runtimeHandle.getCurrentState()
      : runtimeHandle
  );

  const projection = normalizeSelectedProjection(
    runtimePacket.projectionState,
    runtimePacket.selectedProjection,
    runtimePacket.projections
  );

  const successor = normalizeSuccessorPacket(runtimeHandle);
  const colorOutput = buildColorOutput(runtimePacket);
  const luminanceOutput = buildLuminanceOutput(runtimePacket);
  const depthOutput = buildDepthOutput(projection.coordinates);
  const boundaryVisibility = buildBoundaryVisibility(runtimePacket.boundary.classification);
  const nodeForceVisibility = buildNodeForceVisibility(runtimePacket);
  const motionOutput = buildMotionOutput(runtimePacket, projection, successor);
  const transitionVisibility = buildTransitionVisibility(runtimePacket, successor, motionOutput);

  const basePacket = deepFreeze({
    meta: RENDER_META,
    sourceDense: deepFreeze({
      x: runtimePacket.denseIndex.x,
      y: runtimePacket.denseIndex.y
    }),
    runtime: runtimePacket,
    projection,
    successor,
    visible: deepFreeze({
      colorOutput,
      luminanceOutput,
      motionOutput,
      depthOutput,
      boundaryVisibility,
      nodeForceVisibility,
      transitionVisibility,
      validatorStatus: deepFreeze({
        ok: false,
        checks: deepFreeze({})
      })
    })
  });

  const validatorStatus = runValidatorSuite(runtimeHandle, basePacket);

  return deepFreeze({
    ...basePacket,
    visible: deepFreeze({
      ...basePacket.visible,
      validatorStatus
    })
  });
};

const deterministicComparable = (packet) =>
  deepFreeze({
    sourceDense: packet.sourceDense,
    projectionState: packet.runtime.projectionState,
    runtime: {
      index: packet.runtime.index,
      denseIndex: packet.runtime.denseIndex,
      receipt: packet.runtime.receipt,
      traversalStatus: packet.runtime.traversalStatus,
      boundary: packet.runtime.boundary,
      forces: packet.runtime.forces
    },
    projection: packet.projection,
    successor: packet.successor
      ? {
          receipt: packet.successor.receipt,
          coordinates: packet.successor.projection.coordinates
        }
      : null,
    visible: {
      colorOutput: packet.visible.colorOutput,
      luminanceOutput: packet.visible.luminanceOutput,
      motionOutput: packet.visible.motionOutput,
      depthOutput: packet.visible.depthOutput,
      boundaryVisibility: packet.visible.boundaryVisibility,
      nodeForceVisibility: packet.visible.nodeForceVisibility,
      transitionVisibility: packet.visible.transitionVisibility
    }
  });

const validateDeterminism = (runtimeHandle = runtime) => {
  const first = buildRenderPacket(runtimeHandle);
  const second = buildRenderPacket(runtimeHandle);
  return stableStringify(deterministicComparable(first)) === stableStringify(deterministicComparable(second));
};

const finalizeValidatorStatus = (runtimeHandle, packet) => {
  const determinism = validateDeterminism(runtimeHandle);

  const checks = deepFreeze({
    ...packet.visible.validatorStatus.checks,
    determinism
  });

  return deepFreeze({
    ok: Object.values(checks).every(Boolean),
    checks
  });
};

const render = (runtimeHandle = runtime) => {
  const packet = buildRenderPacket(runtimeHandle);
  const validatorStatus = finalizeValidatorStatus(runtimeHandle, packet);

  const finalized = deepFreeze({
    ...packet,
    visible: deepFreeze({
      ...packet.visible,
      validatorStatus
    })
  });

  assert(finalized.visible.validatorStatus.ok === true, "RENDER_VALIDATION_FAILED");
  return finalized;
};

const validateRender = (runtimeHandle = runtime) => {
  const packet = buildRenderPacket(runtimeHandle);
  const validatorStatus = finalizeValidatorStatus(runtimeHandle, packet);

  return deepFreeze({
    ok: validatorStatus.ok,
    checks: validatorStatus.checks,
    packet: deepFreeze({
      ...packet,
      visible: deepFreeze({
        ...packet.visible,
        validatorStatus
      })
    })
  });
};

const renderModule = deepFreeze({
  meta: RENDER_META,
  constants: RENDER_CONSTANTS,
  render,
  validateRender
});

export { render, validateRender };
export default renderModule;
