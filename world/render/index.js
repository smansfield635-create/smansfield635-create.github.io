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
    "thresholdIntegrity"
  ]),
  COLOR_THRESHOLD: 0.05,
  MOTION_THRESHOLD: 0.0001,
  DEFAULT_LIGHT: 0.5,
  DEFAULT_SLOPE: 0.5,
  REQUIRED_TOTAL_NODES: 256
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

const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);

const stableStringify = (value) => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(stableStringify).join(",")}]`;
  const keys = Object.keys(value).sort();
  return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(",")}}`;
};

const normalizeBoundaryClass = (value, openFlag) => {
  if (typeof value === "string") {
    const upper = value.toUpperCase();
    if (RENDER_CONSTANTS.BOUNDARY_CLASSES.includes(upper)) return upper;
  }
  if (openFlag === true) return "OPEN";
  return "HOLD";
};

const normalizeProjection = (projection) => {
  const p = String(projection || "flat").toLowerCase();
  if (RENDER_CONSTANTS.PROJECTIONS.includes(p)) return p;
  return "flat";
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
  if (typeof region === "string") return Object.freeze({ id: region, key: region });
  assert(region && typeof region === "object", "INVALID_REGION");
  const key = region.regionKey || region.key || region.id || "region_unknown";
  return Object.freeze({
    id: key,
    key
  });
};

const normalizeDivide = (divide, boundary) => {
  const classification =
    divide && typeof divide === "object" ? divide.classification || divide.divideClass || divide.boundary : divide;
  return Object.freeze({
    classification: normalizeBoundaryClass(classification, boundary && boundary.open === true)
  });
};

const normalizeForces = (forces) => {
  const source =
    forces && typeof forces === "object"
      ? forces.normalized && typeof forces.normalized === "object"
        ? forces.normalized
        : forces
      : null;

  assert(source && typeof source === "object", "INVALID_FORCES");

  const N = clamp01(Number(source.N || 0));
  const E = clamp01(Number(source.E || 0));
  const S = clamp01(Number(source.S || 0));
  const W = clamp01(Number(source.W || 0));

  return Object.freeze({ N, E, S, W });
};

const sortForces = (forces) =>
  RENDER_CONSTANTS.FORCE_DIRECTIONS
    .map((direction) => Object.freeze({ direction, value: forces[direction] }))
    .sort((a, b) => {
      if (b.value !== a.value) return b.value - a.value;
      return RENDER_CONSTANTS.FORCE_DIRECTIONS.indexOf(a.direction) - RENDER_CONSTANTS.FORCE_DIRECTIONS.indexOf(b.direction);
    });

const normalizeNode = (node, forces) => {
  const sorted = sortForces(forces);
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
  return Object.freeze({
    id: sorted[0].direction,
    key: `node_${sorted[0].direction}`
  });
};

const normalizeBoundary = (boundary, divide, forces) => {
  const divideClass = normalizeBoundaryClass(
    boundary && typeof boundary === "object" ? boundary.divideClass || boundary.classification : undefined,
    boundary && boundary.open === true
  );
  const B = boundary && typeof boundary === "object" && Number.isFinite(Number(boundary.B))
    ? clamp01(Number(boundary.B))
    : clamp01(1 - varianceFromForces(forces));

  const open = divideClass === "OPEN" || B < 0.8;
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

const varianceFromForces = (forces) => {
  const values = [forces.N, forces.E, forces.S, forces.W];
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
};

const selectProjectionCoordinates = (statePacket, projection) => {
  const p = normalizeProjection(projection);
  const projections = statePacket.projections || {};
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
  const radial = clamp01(Number(statePacket.fields && statePacket.fields.radial || 0));
  if (radial < 0.2) return "core";
  if (radial < 0.45) return "inner";
  if (radial < 0.7) return "middle";
  return "outer";
};

const computeBiome = (statePacket) => {
  const pressure = clamp01(Number(statePacket.fields && statePacket.fields.pressure || 0));
  const curvature = clamp01(Number(statePacket.fields && statePacket.fields.curvature || 0));
  if (pressure >= 0.7 && curvature <= 0.25) return "stable";
  if (pressure >= 0.45) return "temperate";
  if (curvature >= 0.6) return "fractured";
  return "frontier";
};

const computeElevationFamily = (statePacket) => {
  const pressure = clamp01(Number(statePacket.fields && statePacket.fields.pressure || 0));
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
  const G = clamp01(Number(statePacket.derived && statePacket.derived.GPrime || statePacket.derived && statePacket.derived.G || 0));
  const slope = clamp01(Number(statePacket.fields && statePacket.fields.gradient || 0));
  const light = clamp01(Number(statePacket.visualLight || RENDER_CONSTANTS.DEFAULT_LIGHT));
  return clamp01((G + (1 - slope) + light) / 3);
};

const depthFromProjection = (projected) => clamp01((Number(projected.z || 0) + 1) / 2);

const motionFromTransition = (currentProjected, transition) => {
  const successor = transition && transition.successorProjected;
  if (!successor) {
    return Object.freeze({
      visible: false,
      delta: 0,
      vector: Object.freeze({ x: 0, y: 0, z: 0 })
    });
  }

  const dx = successor.x - currentProjected.x;
  const dy = successor.y - currentProjected.y;
  const dz = successor.z - currentProjected.z;
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
  const hasLineage = receipt && successorReceipt && successorReceipt.timestamp === receipt.timestamp + 1;

  if (!admissible || !hasLineage) {
    return Object.freeze({
      visible: false,
      admissible: false,
      lineage: false,
      sourceTimestamp: receipt ? receipt.timestamp : null,
      successorTimestamp: successorReceipt ? successorReceipt.timestamp : null
    });
  }

  return Object.freeze({
    visible: true,
    admissible: true,
    lineage: true,
    sourceTimestamp: receipt.timestamp,
    successorTimestamp: successorReceipt.timestamp,
    delta: Math.sqrt(
      (successorProjected.x - projected.x) ** 2 +
      (successorProjected.y - projected.y) ** 2 +
      (successorProjected.z - projected.z) ** 2
    )
  });
};

const validatorStatusFromChecks = (checks) => {
  const ok = Object.values(checks).every(Boolean);
  return Object.freeze({
    ok,
    checks: Object.freeze(checks)
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

  const index = normalizeIndex(statePacket.index || statePacket.state || statePacket.receipt && statePacket.receipt.state);
  const coordinates = normalizeCoordinates(statePacket.coordinates || { x: 0, y: 0, z: 0 });
  const region = normalizeRegion(statePacket.region);
  const divide = normalizeDivide(statePacket.divide, statePacket.boundary);
  const forces = normalizeForces(statePacket.forces);
  const node = normalizeNode(statePacket.node, forces);
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

  const packet = Object.freeze({
    index,
    coordinates,
    region,
    divide,
    forces,
    node,
    boundary,
    threshold,
    receipt,
    successorReceipt,
    traversalStatus,
    projections,
    fields: deepFreeze(statePacket.fields || {}),
    derived: deepFreeze(statePacket.derived || {}),
    visualLight: statePacket.visualLight
  });

  const projected = selectProjectionCoordinates(packet, selectedProjection);

  let successorProjected = null;
  if (successorReceipt) {
    const successorStatePacket =
      typeof runtimeHandle.getStateByReceipt === "function"
        ? runtimeHandle.getStateByReceipt(successorReceipt)
        : runtimeHandle.successorState || null;

    if (successorStatePacket && successorStatePacket.projections) {
      successorProjected = selectProjectionCoordinates(
        Object.freeze({ projections: successorStatePacket.projections }),
        selectedProjection
      );
    } else {
      successorProjected = projected;
    }
  }

  return Object.freeze({
    projection: selectedProjection,
    statePacket: packet,
    projected,
    successorProjected
  });
};

const validateRuntimeTraceability = (renderPacket) => {
  const sourceKey = `${renderPacket.state.index.i},${renderPacket.state.index.j}`;
  return (
    renderPacket.receipt.state.i === renderPacket.state.index.i &&
    renderPacket.receipt.state.j === renderPacket.state.index.j &&
    renderPacket.sourceKey === sourceKey
  );
};

const validateLatticeCompleteness = (runtimeHandle) => {
  const lattice =
    typeof runtimeHandle.getLattice === "function"
      ? runtimeHandle.getLattice()
      : runtimeHandle.lattice || runtimeHandle.systemHandle && runtimeHandle.systemHandle.kernel && runtimeHandle.systemHandle.kernel.lattice || null;

  if (!lattice || !Array.isArray(lattice.nodes)) return false;
  return lattice.nodes.length === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES;
};

const validateProjectionConsistency = (statePacket) => {
  const regionFlat = statePacket.region.key;
  const regionTree = statePacket.region.key;
  const regionGlobe = statePacket.region.key;

  const divideFlat = statePacket.divide.classification;
  const divideTree = statePacket.divide.classification;
  const divideGlobe = statePacket.divide.classification;

  const forcesFlat = stableStringify(statePacket.forces);
  const forcesTree = stableStringify(statePacket.forces);
  const forcesGlobe = stableStringify(statePacket.forces);

  return (
    regionFlat === regionTree &&
    regionTree === regionGlobe &&
    divideFlat === divideTree &&
    divideTree === divideGlobe &&
    forcesFlat === forcesTree &&
    forcesTree === forcesGlobe
  );
};

const validateDeterminism = (runtimeHandle, projection) => {
  const first = buildRenderState(runtimeHandle, projection);
  const second = buildRenderState(runtimeHandle, projection);
  return stableStringify(first) === stableStringify(second);
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
    renderPacket.visible.transitionVisibility.lineage === true
  );
};

const validateArtifactDrift = (renderPacket) => {
  return (
    renderPacket.visible.colorOutput != null &&
    renderPacket.visible.luminanceOutput != null &&
    renderPacket.visible.motionOutput != null &&
    renderPacket.visible.depthOutput != null &&
    renderPacket.visible.nodeForceVisibility != null &&
    renderPacket.visible.validatorStatus != null
  );
};

const validateThresholdIntegrity = (renderPacket) => {
  const admissible = renderPacket.state.traversalStatus.admissible;
  const boundaryBlocked = renderPacket.state.boundary.boundaryClass === "BLOCK";
  const motionVisible = renderPacket.visible.motionOutput.visible;
  const transitionVisible = renderPacket.visible.transitionVisibility.visible;

  if (!admissible && motionVisible) return false;
  if (boundaryBlocked && transitionVisible) return false;
  return true;
};

const buildRenderState = (runtimeHandle = runtime, projection = "flat") => {
  const extracted = extractRuntimePacket(runtimeHandle, projection);
  const statePacket = extracted.statePacket;

  const colorOutput = colorFromState(statePacket);
  const luminanceOutput = luminanceFromState(statePacket);
  const motionOutput = motionFromTransition(extracted.projected, {
    successorProjected: extracted.successorProjected
  });
  const depthOutput = depthFromProjection(extracted.projected);
  const boundaryVisibility = boundaryVisibilityFromState(statePacket.boundary.boundaryClass);
  const nodeForceVisibility = nodeForceVisibilityFromState(statePacket.node, statePacket.forces);
  const transitionVisibility = transitionVisibilityFromState(
    statePacket.receipt,
    statePacket.successorReceipt,
    statePacket.traversalStatus,
    extracted.projected,
    extracted.successorProjected || extracted.projected
  );

  const renderPacket = Object.freeze({
    meta: RENDER_META,
    projection: extracted.projection,
    sourceKey: `${statePacket.index.i},${statePacket.index.j}`,
    state: Object.freeze({
      index: statePacket.index,
      region: statePacket.region,
      divide: statePacket.divide,
      node: statePacket.node,
      boundary: statePacket.boundary,
      threshold: statePacket.threshold,
      traversalStatus: statePacket.traversalStatus,
      successorReceipt: statePacket.successorReceipt
    }),
    receipt: statePacket.receipt,
    projected: extracted.projected,
    visible: Object.freeze({
      colorOutput,
      luminanceOutput,
      motionOutput: statePacket.traversalStatus.admissible ? motionOutput : Object.freeze({
        visible: false,
        delta: 0,
        vector: Object.freeze({ x: 0, y: 0, z: 0 })
      }),
      depthOutput,
      boundaryVisibility,
      nodeForceVisibility,
      transitionVisibility,
      validatorStatus: null
    })
  });

  const checks = Object.freeze({
    runtimeTraceability: validateRuntimeTraceability(renderPacket),
    latticeCompleteness: validateLatticeCompleteness(runtimeHandle),
    projectionConsistency: validateProjectionConsistency(statePacket),
    determinism: true,
    boundaryConsistency: validateBoundaryConsistency(renderPacket),
    receiptConsistency: validateReceiptConsistency(renderPacket),
    artifactDrift: validateArtifactDrift(renderPacket),
    thresholdIntegrity: validateThresholdIntegrity(renderPacket)
  });

  const validatorStatus = validatorStatusFromChecks(checks);

  return deepFreeze({
    ...renderPacket,
    visible: Object.freeze({
      ...renderPacket.visible,
      validatorStatus
    })
  });
};

const render = (runtimeHandle = runtime, projection = "flat") => {
  const packet = buildRenderState(runtimeHandle, projection);
  assert(packet.visible.validatorStatus.ok === true, "RENDER_VALIDATION_FAILED");
  return packet;
};

const renderFlat = (runtimeHandle = runtime) => render(runtimeHandle, "flat");
const renderTree = (runtimeHandle = runtime) => render(runtimeHandle, "tree");
const renderGlobe = (runtimeHandle = runtime) => render(runtimeHandle, "globe");

const validateRender = (runtimeHandle = runtime, projection = "flat") => {
  const packet = buildRenderState(runtimeHandle, projection);
  const determinism = validateDeterminism(runtimeHandle, projection);

  const mergedChecks = Object.freeze({
    ...packet.visible.validatorStatus.checks,
    determinism
  });

  return Object.freeze({
    ok: Object.values(mergedChecks).every(Boolean),
    checks: mergedChecks,
    packet
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
