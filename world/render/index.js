import runtime from "./runtime.js";

const RENDER_META = Object.freeze({
  name: "render",
  version: "G1",
  role: "deterministic_expression_layer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false
});

const RENDER_CONSTANTS = Object.freeze({
  PROJECTIONS: Object.freeze(["flat", "tree", "globe"]),
  BOUNDARY_CLASSES: Object.freeze(["OPEN", "HOLD", "GATE", "BRIDGE", "BLOCK"]),
  FORCE_DIRECTIONS: Object.freeze(["N", "E", "S", "W"]),
  VALIDATOR_KEYS: Object.freeze([
    "runtimeTraceability",
    "latticeCompleteness",
    "projectionConsistency",
    "determinism",
    "boundaryConsistency",
    "receiptConsistency",
    "artifactDrift",
    "thresholdIntegrity",
    "successorProjectionCompleteness"
  ]),
  COLOR_THRESHOLD: 0.05,
  MOTION_THRESHOLD: 0.0001,
  DEFAULT_LIGHT: 0.5,
  REQUIRED_TOTAL_NODES: 256,
  TAU_OPEN: 0.8
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

const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const stableStringify = (value) => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
};

const forcePriorityIndex = (direction) => RENDER_CONSTANTS.FORCE_DIRECTIONS.indexOf(direction);

const varianceFromForces = (forces) => {
  const values = [forces.N, forces.E, forces.S, forces.W];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
};

const normalizeProjection = (projection) => {
  const p = String(projection || "flat").toLowerCase();
  assert(RENDER_CONSTANTS.PROJECTIONS.includes(p), "INVALID_PROJECTION");
  return p;
};

const normalizeIndex = (index) => {
  assert(index && Number.isInteger(index.i) && Number.isInteger(index.j), "INVALID_INDEX");
  return Object.freeze({ i: index.i, j: index.j });
};

const normalizeCoordinates = (coordinates) => {
  assert(coordinates && typeof coordinates === "object", "INVALID_COORDINATES");
  const x = Number(coordinates.x);
  const y = Number(coordinates.y);
  assert(Number.isFinite(x) && Number.isFinite(y), "INVALID_COORDINATE_VALUES");
  return Object.freeze({
    x,
    y,
    z: Number.isFinite(Number(coordinates.z)) ? Number(coordinates.z) : 0
  });
};

const normalizeRegion = (region) => {
  if (typeof region === "string") {
    return Object.freeze({ id: region, key: region });
  }
  assert(region && typeof region === "object", "INVALID_REGION");
  const key = region.regionKey || region.key || region.id;
  assert(typeof key === "string" && key.length > 0, "INVALID_REGION_KEY");
  return Object.freeze({ id: key, key });
};

const normalizeForces = (forces) => {
  const source =
    forces && typeof forces === "object"
      ? forces.normalized && typeof forces.normalized === "object"
        ? forces.normalized
        : forces
      : null;

  assert(source && typeof source === "object", "INVALID_FORCES");

  const normalized = Object.freeze({
    N: clamp01(Number(source.N || 0)),
    E: clamp01(Number(source.E || 0)),
    S: clamp01(Number(source.S || 0)),
    W: clamp01(Number(source.W || 0))
  });

  return normalized;
};

const sortForces = (forces) =>
  RENDER_CONSTANTS.FORCE_DIRECTIONS
    .map((direction) => Object.freeze({ direction, value: forces[direction] }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return forcePriorityIndex(a.direction) - forcePriorityIndex(b.direction);
    });

const normalizeNode = (node, forces) => {
  if (node && typeof node === "object" && typeof node.node === "string") {
    return Object.freeze({
      id: node.node,
      key: node.nodeKey || `node_${node.node}`
    });
  }
  if (typeof node === "string") {
    return Object.freeze({
      id: node,
      key: `node_${node}`
    });
  }
  const dominant = sortForces(forces)[0].direction;
  return Object.freeze({
    id: dominant,
    key: `node_${dominant}`
  });
};

const normalizeBoundaryClass = (value, openFlag = false) => {
  if (openFlag === true) return "OPEN";
  const upper = typeof value === "string" ? value.toUpperCase() : "";
  assert(
    upper === "" || RENDER_CONSTANTS.BOUNDARY_CLASSES.includes(upper),
    "INVALID_BOUNDARY_CLASS"
  );
  return upper || "HOLD";
};

const normalizeDivide = (divide, boundary) => {
  const classification =
    divide && typeof divide === "object"
      ? divide.classification || divide.divideClass || divide.boundary
      : divide;

  return Object.freeze({
    classification: normalizeBoundaryClass(classification, boundary && boundary.open === true)
  });
};

const normalizeBoundary = (boundary, divide, forces) => {
  const explicitOpen = boundary && typeof boundary === "object" ? boundary.open === true : false;
  const B =
    boundary && typeof boundary === "object" && Number.isFinite(Number(boundary.B))
      ? clamp01(Number(boundary.B))
      : clamp01(1 - varianceFromForces(forces));

  const open = explicitOpen || B < RENDER_CONSTANTS.TAU_OPEN;
  const boundaryClass = open ? "OPEN" : normalizeBoundaryClass(divide.classification, false);

  return Object.freeze({
    boundaryClass,
    open,
    B,
    boundaryType:
      boundary && typeof boundary === "object" && typeof boundary.boundaryType === "string"
        ? boundary.boundaryType
        : "interior"
  });
};

const normalizeThreshold = (threshold) => {
  const classification =
    threshold && typeof threshold === "object" && typeof threshold.classification === "string"
      ? threshold.classification.toUpperCase()
      : "FRAGMENTED";
  const action =
    threshold && typeof threshold === "object" && typeof threshold.action === "string"
      ? threshold.action.toUpperCase()
      : classification === "WITHIN"
        ? "PASS"
        : "HALT";

  assert(
    ["WITHIN", "FRAGMENTED"].includes(classification) && ["PASS", "HALT"].includes(action),
    "INVALID_THRESHOLD"
  );

  return Object.freeze({ classification, action });
};

const normalizeReceipt = (receipt) => {
  assert(receipt && typeof receipt === "object", "INVALID_RECEIPT");
  assert(receipt.state && Number.isInteger(receipt.state.i) && Number.isInteger(receipt.state.j), "INVALID_RECEIPT_STATE");
  assert(Number.isInteger(receipt.timestamp) && receipt.timestamp >= 0, "INVALID_RECEIPT_TIMESTAMP");

  return Object.freeze({
    state: Object.freeze({ i: receipt.state.i, j: receipt.state.j }),
    region: receipt.region,
    node: receipt.node,
    forces: normalizeForces(receipt.forces || {}),
    boundary: normalizeBoundaryClass(receipt.boundary, false),
    timestamp: receipt.timestamp
  });
};

const selectProjectionCoordinates = (projections, projection) => {
  assert(projections && typeof projections === "object", "MISSING_PROJECTIONS");
  const p = normalizeProjection(projection);
  const selected = projections[p];
  assert(selected && typeof selected === "object", "MISSING_PROJECTION_COORDINATES");

  if (p === "flat") {
    const i = Number(selected.i);
    const j = Number(selected.j);
    assert(Number.isFinite(i) && Number.isFinite(j), "INVALID_FLAT_PROJECTION");
    return Object.freeze({ x: i, y: j, z: 0 });
  }

  if (p === "tree") {
    const parent = selected.parent || {};
    const i = Number(parent.i);
    const j = Number(parent.j);
    assert(Number.isFinite(i) && Number.isFinite(j), "INVALID_TREE_PROJECTION");
    return Object.freeze({ x: i, y: j, z: 0 });
  }

  const x = Number(selected.x);
  const y = Number(selected.y);
  const z = Number(selected.z);
  assert(Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z), "INVALID_GLOBE_PROJECTION");
  return Object.freeze({ x, y, z });
};

const computeTerrainClass = (statePacket) => {
  const radial = clamp01(Number((statePacket.fields && statePacket.fields.radial) || 0));
  if (radial < 0.2) return "core";
  if (radial < 0.45) return "inner";
  if (radial < 0.7) return "middle";
  return "outer";
};

const computeBiome = (statePacket) => {
  const pressure = clamp01(Number((statePacket.fields && statePacket.fields.pressure) || 0));
  const curvature = clamp01(Number((statePacket.fields && statePacket.fields.curvature) || 0));
  if (pressure >= 0.7 && curvature <= 0.25) return "stable";
  if (pressure >= 0.45) return "temperate";
  if (curvature >= 0.6) return "fractured";
  return "frontier";
};

const computeElevationFamily = (statePacket) => {
  const pressure = clamp01(Number((statePacket.fields && statePacket.fields.pressure) || 0));
  return pressure >= 0.5 ? "summit" : "basin";
};

const colorFromState = (statePacket) => {
  const terrain = computeTerrainClass(statePacket);
  const biome = computeBiome(statePacket);
  const elevation = computeElevationFamily(statePacket);

  const terrainHueMap = Object.freeze({
    core: 0.12,
    inner: 0.24,
    middle: 0.48,
    outer: 0.72
  });

  const biomeSatMap = Object.freeze({
    stable: 0.35,
    temperate: 0.5,
    fractured: 0.75,
    frontier: 0.6
  });

  const elevationValMap = Object.freeze({
    summit: 0.8,
    basin: 0.55
  });

  return Object.freeze({
    terrainClass: terrain,
    biome,
    elevationFamily: elevation,
    hue: terrainHueMap[terrain],
    saturation: biomeSatMap[biome],
    value: elevationValMap[elevation]
  });
};

const luminanceFromState = (statePacket) => {
  const G = clamp01(Number(
    (statePacket.derived && (statePacket.derived.GPrime ?? statePacket.derived.G)) ?? 0
  ));
  const slope = clamp01(Number((statePacket.fields && statePacket.fields.gradient) || 0));
  const light = clamp01(Number(statePacket.visualLight ?? RENDER_CONSTANTS.DEFAULT_LIGHT));
  return clamp01((G + (1 - slope) + light) / 3);
};

const depthFromProjection = (projected) => clamp01((Number(projected.z || 0) + 1) / 2);

const motionFromTransition = (currentProjected, successorProjected) => {
  assert(successorProjected && typeof successorProjected === "object", "MISSING_SUCCESSOR_PROJECTION");
  const dx = successorProjected.x - currentProjected.x;
  const dy = successorProjected.y - currentProjected.y;
  const dz = successorProjected.z - currentProjected.z;
  const delta = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

  return Object.freeze({
    visible: delta >= RENDER_CONSTANTS.MOTION_THRESHOLD,
    delta,
    vector: Object.freeze({ x: dx, y: dy, z: dz })
  });
};

const boundaryVisibilityFromState = (boundaryClass) =>
  Object.freeze({
    OPEN: boundaryClass === "OPEN",
    HOLD: boundaryClass === "HOLD",
    GATE: boundaryClass === "GATE",
    BRIDGE: boundaryClass === "BRIDGE",
    BLOCK: boundaryClass === "BLOCK"
  });

const nodeForceVisibilityFromState = (node, forces) => {
  const sorted = sortForces(forces);
  return Object.freeze({
    nodeId: node.id,
    dominantForce: sorted[0].direction,
    dominantValue: sorted[0].value,
    secondaryForce: sorted[1].direction,
    secondaryValue: sorted[1].value,
    inspectableForces: Object.freeze({
      N: forces.N,
      E: forces.E,
      S: forces.S,
      W: forces.W
    })
  });
};

const transitionVisibilityFromState = (receipt, successorReceipt, traversalStatus, projected, successorProjected) => {
  const admissible = traversalStatus.admissible === true;
  const hasLineage =
    !!receipt &&
    !!successorReceipt &&
    successorReceipt.timestamp === receipt.timestamp + 1 &&
    successorReceipt.state &&
    Number.isInteger(successorReceipt.state.i) &&
    Number.isInteger(successorReceipt.state.j);

  if (!admissible || !hasLineage) {
    return Object.freeze({
      visible: false,
      admissible: admissible,
      lineage: hasLineage,
      sourceTimestamp: receipt ? receipt.timestamp : null,
      successorTimestamp: successorReceipt ? successorReceipt.timestamp : null,
      delta: 0
    });
  }

  const dx = successorProjected.x - projected.x;
  const dy = successorProjected.y - projected.y;
  const dz = successorProjected.z - projected.z;
  const delta = Math.sqrt(dx ** 2 + dy ** 2 + dz ** 2);

  return Object.freeze({
    visible: delta >= RENDER_CONSTANTS.MOTION_THRESHOLD,
    admissible: true,
    lineage: true,
    sourceTimestamp: receipt.timestamp,
    successorTimestamp: successorReceipt.timestamp,
    delta
  });
};

const extractRuntimePacket = (runtimeHandle, projection) => {
  assert(runtimeHandle && typeof runtimeHandle === "object", "RUNTIME_HANDLE_MISSING");
  const selectedProjection = normalizeProjection(projection);

  const statePacket =
    typeof runtimeHandle.getCurrentState === "function"
      ? runtimeHandle.getCurrentState()
      : runtimeHandle.currentState || runtimeHandle.state || runtimeHandle.current || null;

  assert(statePacket && typeof statePacket === "object", "RUNTIME_STATE_MISSING");

  const index = normalizeIndex(statePacket.index || statePacket.state || (statePacket.receipt && statePacket.receipt.state));
  const coordinates = normalizeCoordinates(statePacket.coordinates || { x: 0, y: 0, z: 0 });
  const region = normalizeRegion(statePacket.region);
  const forces = normalizeForces(statePacket.forces);
  const node = normalizeNode(statePacket.node, forces);
  const divide = normalizeDivide(statePacket.divide, statePacket.boundary);
  const boundary = normalizeBoundary(statePacket.boundary, divide, forces);
  const threshold = normalizeThreshold(statePacket.threshold);

  const receipt = normalizeReceipt(
    statePacket.receipt || {
      state: index,
      region: region.key,
      node: node.id,
      forces,
      boundary: boundary.boundaryClass,
      timestamp: 0
    }
  );

  const successorReceiptRaw =
    typeof runtimeHandle.getSuccessorReceipt === "function"
      ? runtimeHandle.getSuccessorReceipt()
      : runtimeHandle.successorReceipt || statePacket.successorReceipt || null;

  const successorReceipt = successorReceiptRaw ? normalizeReceipt(successorReceiptRaw) : null;

  const traversalStatusRaw =
    typeof runtimeHandle.getTraversalStatus === "function"
      ? runtimeHandle.getTraversalStatus()
      : runtimeHandle.traversalStatus || statePacket.traversalStatus || null;

  const traversalStatus = Object.freeze({
    admissible:
      traversalStatusRaw && typeof traversalStatusRaw === "object"
        ? traversalStatusRaw.admissible === true || traversalStatusRaw.action === "PASS"
        : threshold.action === "PASS" && boundary.boundaryClass !== "BLOCK",
    action:
      traversalStatusRaw && typeof traversalStatusRaw === "object" && typeof traversalStatusRaw.action === "string"
        ? traversalStatusRaw.action
        : threshold.action
  });

  const projections =
    statePacket.projections ||
    (typeof runtimeHandle.getProjections === "function" ? runtimeHandle.getProjections() : null);

  assert(projections && typeof projections === "object", "RUNTIME_PROJECTIONS_MISSING");

  const projected = selectProjectionCoordinates(projections, selectedProjection);

  let successorProjected = null;
  if (successorReceipt) {
    const successorStatePacket =
      typeof runtimeHandle.getStateByReceipt === "function"
        ? runtimeHandle.getStateByReceipt(successorReceipt)
        : runtimeHandle.successorState || null;

    assert(successorStatePacket && typeof successorStatePacket === "object", "MISSING_SUCCESSOR_STATE");
    assert(successorStatePacket.projections && typeof successorStatePacket.projections === "object", "MISSING_SUCCESSOR_PROJECTIONS");
    successorProjected = selectProjectionCoordinates(successorStatePacket.projections, selectedProjection);
  }

  return Object.freeze({
    projection: selectedProjection,
    index,
    coordinates,
    region,
    forces,
    node,
    divide,
    boundary,
    threshold,
    receipt,
    successorReceipt,
    traversalStatus,
    projections,
    projected,
    successorProjected,
    fields: deepFreeze(statePacket.fields || {}),
    derived: deepFreeze(statePacket.derived || {}),
    visualLight: statePacket.visualLight
  });
};

const computeProjectionInvariantSnapshot = (runtimeHandle, projection) => {
  const packet = extractRuntimePacket(runtimeHandle, projection);
  return Object.freeze({
    projection,
    sourceKey: `${packet.index.i},${packet.index.j}`,
    regionKey: packet.region.key,
    boundaryClass: packet.boundary.boundaryClass,
    nodeId: packet.node.id,
    forces: packet.forces,
    receipt: Object.freeze({
      state: packet.receipt.state,
      region: packet.receipt.region,
      node: packet.receipt.node,
      boundary: packet.receipt.boundary,
      timestamp: packet.receipt.timestamp
    })
  });
};

const validateRuntimeTraceability = (renderPacket) => {
  const sourceKey = `${renderPacket.state.index.i},${renderPacket.state.index.j}`;
  return (
    renderPacket.sourceKey === sourceKey &&
    renderPacket.receipt.state.i === renderPacket.state.index.i &&
    renderPacket.receipt.state.j === renderPacket.state.index.j
  );
};

const validateLatticeCompleteness = (runtimeHandle) => {
  const lattice =
    typeof runtimeHandle.getLattice === "function"
      ? runtimeHandle.getLattice()
      : runtimeHandle.lattice ||
        (runtimeHandle.systemHandle &&
        runtimeHandle.systemHandle.kernel &&
        runtimeHandle.systemHandle.kernel.lattice
          ? runtimeHandle.systemHandle.kernel.lattice
          : null);

  return !!(lattice && Array.isArray(lattice.nodes) && lattice.nodes.length === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES);
};

const validateProjectionConsistency = (runtimeHandle) => {
  const snapshots = RENDER_CONSTANTS.PROJECTIONS.map((projection) =>
    computeProjectionInvariantSnapshot(runtimeHandle, projection)
  );

  const reference = snapshots[0];

  return snapshots.every((snapshot) =>
    snapshot.sourceKey === reference.sourceKey &&
    snapshot.regionKey === reference.regionKey &&
    snapshot.boundaryClass === reference.boundaryClass &&
    snapshot.nodeId === reference.nodeId &&
    stableStringify(snapshot.forces) === stableStringify(reference.forces) &&
    stableStringify(snapshot.receipt) === stableStringify(reference.receipt)
  );
};

const validateBoundaryConsistency = (renderPacket) => {
  const visible = renderPacket.visible.boundaryVisibility;
  const active = renderPacket.state.boundary.boundaryClass;
  return Object.keys(visible).every((key) => visible[key] === (key === active));
};

const validateReceiptConsistency = (renderPacket) => {
  if (!renderPacket.state.successorReceipt) return true;
  return (
    renderPacket.state.successorReceipt.timestamp === renderPacket.receipt.timestamp + 1 &&
    renderPacket.visible.transitionVisibility.lineage === true &&
    renderPacket.visible.transitionVisibility.sourceTimestamp === renderPacket.receipt.timestamp &&
    renderPacket.visible.transitionVisibility.successorTimestamp === renderPacket.state.successorReceipt.timestamp
  );
};

const validateArtifactDrift = (renderPacket) => {
  const expectedColor = colorFromState(renderPacket.fullState);
  const expectedLuminance = luminanceFromState(renderPacket.fullState);
  const expectedDepth = depthFromProjection(renderPacket.projected);
  const expectedBoundaryVisibility = boundaryVisibilityFromState(renderPacket.state.boundary.boundaryClass);
  const expectedNodeForceVisibility = nodeForceVisibilityFromState(
    renderPacket.state.node,
    renderPacket.state.forces
  );

  return (
    stableStringify(renderPacket.visible.colorOutput) === stableStringify(expectedColor) &&
    renderPacket.visible.luminanceOutput === expectedLuminance &&
    renderPacket.visible.depthOutput === expectedDepth &&
    stableStringify(renderPacket.visible.boundaryVisibility) === stableStringify(expectedBoundaryVisibility) &&
    stableStringify(renderPacket.visible.nodeForceVisibility) === stableStringify(expectedNodeForceVisibility)
  );
};

const validateThresholdIntegrity = (renderPacket) => {
  const admissible = renderPacket.state.traversalStatus.admissible;
  const boundaryBlocked = renderPacket.state.boundary.boundaryClass === "BLOCK";
  const motionVisible = renderPacket.visible.motionOutput.visible;
  const transitionVisible = renderPacket.visible.transitionVisibility.visible;

  if (!admissible && (motionVisible || transitionVisible)) return false;
  if (boundaryBlocked && transitionVisible) return false;
  if (renderPacket.state.successorReceipt && !transitionVisible && admissible && !boundaryBlocked) {
    return renderPacket.visible.motionOutput.delta < RENDER_CONSTANTS.MOTION_THRESHOLD;
  }
  return true;
};

const validateSuccessorProjectionCompleteness = (renderPacket) => {
  if (!renderPacket.state.successorReceipt) return true;
  return !!renderPacket.successorProjected;
};

const buildVisibleOutputs = (fullState) => {
  const colorOutput = colorFromState(fullState);
  const luminanceOutput = luminanceFromState(fullState);
  const depthOutput = depthFromProjection(fullState.projected);
  const boundaryVisibility = boundaryVisibilityFromState(fullState.boundary.boundaryClass);
  const nodeForceVisibility = nodeForceVisibilityFromState(fullState.node, fullState.forces);

  const motionOutput =
    fullState.successorReceipt && fullState.traversalStatus.admissible
      ? motionFromTransition(fullState.projected, fullState.successorProjected)
      : Object.freeze({
          visible: false,
          delta: 0,
          vector: Object.freeze({ x: 0, y: 0, z: 0 })
        });

  const transitionVisibility = transitionVisibilityFromState(
    fullState.receipt,
    fullState.successorReceipt,
    fullState.traversalStatus,
    fullState.projected,
    fullState.successorProjected || fullState.projected
  );

  return Object.freeze({
    colorOutput,
    luminanceOutput,
    motionOutput,
    depthOutput,
    boundaryVisibility,
    nodeForceVisibility,
    transitionVisibility
  });
};

const runValidatorSuite = (runtimeHandle, renderPacket) => {
  const validators = Object.freeze({
    runtimeTraceability: () => validateRuntimeTraceability(renderPacket),
    latticeCompleteness: () => validateLatticeCompleteness(runtimeHandle),
    projectionConsistency: () => validateProjectionConsistency(runtimeHandle),
    determinism: () => true,
    boundaryConsistency: () => validateBoundaryConsistency(renderPacket),
    receiptConsistency: () => validateReceiptConsistency(renderPacket),
    artifactDrift: () => validateArtifactDrift(renderPacket),
    thresholdIntegrity: () => validateThresholdIntegrity(renderPacket),
    successorProjectionCompleteness: () => validateSuccessorProjectionCompleteness(renderPacket)
  });

  const keys = RENDER_CONSTANTS.VALIDATOR_KEYS;
  const actualKeys = Object.keys(validators).sort();
  const canonicalKeys = [...keys].sort();

  assert(
    stableStringify(actualKeys) === stableStringify(canonicalKeys),
    "VALIDATOR_KEY_DRIFT"
  );

  const checks = {};
  keys.forEach((key) => {
    checks[key] = Boolean(validators[key]());
  });

  return Object.freeze({
    ok: Object.values(checks).every(Boolean),
    checks: Object.freeze(checks)
  });
};

const buildRenderState = (runtimeHandle = runtime, projection = "flat") => {
  const fullState = extractRuntimePacket(runtimeHandle, projection);
  const visible = buildVisibleOutputs(fullState);

  const renderPacket = Object.freeze({
    meta: RENDER_META,
    projection: fullState.projection,
    sourceKey: `${fullState.index.i},${fullState.index.j}`,
    state: Object.freeze({
      index: fullState.index,
      region: fullState.region,
      divide: fullState.divide,
      node: fullState.node,
      forces: fullState.forces,
      boundary: fullState.boundary,
      threshold: fullState.threshold,
      traversalStatus: fullState.traversalStatus,
      successorReceipt: fullState.successorReceipt
    }),
    receipt: fullState.receipt,
    projected: fullState.projected,
    successorProjected: fullState.successorProjected,
    fullState,
    visible: Object.freeze({
      ...visible,
      validatorStatus: Object.freeze({
        ok: false,
        checks: Object.freeze({})
      })
    })
  });

  const validatorStatus = runValidatorSuite(runtimeHandle, renderPacket);

  return deepFreeze({
    ...renderPacket,
    visible: Object.freeze({
      ...renderPacket.visible,
      validatorStatus
    })
  });
};

const validateDeterminism = (runtimeHandle = runtime, projection = "flat") => {
  const first = buildRenderState(runtimeHandle, projection);
  const second = buildRenderState(runtimeHandle, projection);

  const firstComparable = Object.freeze({
    projection: first.projection,
    sourceKey: first.sourceKey,
    state: first.state,
    receipt: first.receipt,
    projected: first.projected,
    successorProjected: first.successorProjected,
    visible: {
      colorOutput: first.visible.colorOutput,
      luminanceOutput: first.visible.luminanceOutput,
      motionOutput: first.visible.motionOutput,
      depthOutput: first.visible.depthOutput,
      boundaryVisibility: first.visible.boundaryVisibility,
      nodeForceVisibility: first.visible.nodeForceVisibility,
      transitionVisibility: first.visible.transitionVisibility
    }
  });

  const secondComparable = Object.freeze({
    projection: second.projection,
    sourceKey: second.sourceKey,
    state: second.state,
    receipt: second.receipt,
    projected: second.projected,
    successorProjected: second.successorProjected,
    visible: {
      colorOutput: second.visible.colorOutput,
      luminanceOutput: second.visible.luminanceOutput,
      motionOutput: second.visible.motionOutput,
      depthOutput: second.visible.depthOutput,
      boundaryVisibility: second.visible.boundaryVisibility,
      nodeForceVisibility: second.visible.nodeForceVisibility,
      transitionVisibility: second.visible.transitionVisibility
    }
  });

  return stableStringify(firstComparable) === stableStringify(secondComparable);
};

const finalizeValidatorStatus = (runtimeHandle, renderPacket) => {
  const determinism = validateDeterminism(runtimeHandle, renderPacket.projection);

  const checks = Object.freeze({
    ...renderPacket.visible.validatorStatus.checks,
    determinism
  });

  return Object.freeze({
    ok: Object.values(checks).every(Boolean),
    checks
  });
};

const render = (runtimeHandle = runtime, projection = "flat") => {
  const packet = buildRenderState(runtimeHandle, projection);
  const validatorStatus = finalizeValidatorStatus(runtimeHandle, packet);

  const finalizedPacket = deepFreeze({
    ...packet,
    visible: Object.freeze({
      ...packet.visible,
      validatorStatus
    })
  });

  assert(finalizedPacket.visible.validatorStatus.ok === true, "RENDER_VALIDATION_FAILED");
  return finalizedPacket;
};

const renderFlat = (runtimeHandle = runtime) => render(runtimeHandle, "flat");
const renderTree = (runtimeHandle = runtime) => render(runtimeHandle, "tree");
const renderGlobe = (runtimeHandle = runtime) => render(runtimeHandle, "globe");

const validateRender = (runtimeHandle = runtime, projection = "flat") => {
  const packet = buildRenderState(runtimeHandle, projection);
  const validatorStatus = finalizeValidatorStatus(runtimeHandle, packet);

  return Object.freeze({
    ok: validatorStatus.ok,
    checks: validatorStatus.checks,
    packet: deepFreeze({
      ...packet,
      visible: Object.freeze({
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
  renderFlat,
  renderTree,
  renderGlobe,
  validateRender
});

export { render, renderFlat, renderTree, renderGlobe, validateRender };
export default renderModule;
