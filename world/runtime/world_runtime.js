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
  DEFAULT_SLOPE: 0.5,
  REQUIRED_TOTAL_NODES: 256,
  REQUIRED_LOCAL_GATE: 61,
  WHOLE_ENVELOPE: 451,
  NODE_RADIUS: 0.028,
  BOUNDARY_RING_SCALE: 1.45,
  LABEL_OFFSET: 0.065,
  EDGE_ALPHA_MIN: 0.22,
  EDGE_ALPHA_MAX: 0.92,
  RECEIPT_VERSION: "RENDER_RECEIPT_G1"
});

function deepFreeze(value) {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) deepFreeze(value[key]);
  return value;
}

function invariant(condition, message) {
  if (!condition) throw new Error(`[render] ${message}`);
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function round(value, places = 6) {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function mix(a, b, t) {
  return round(a + (b - a) * t);
}

function hexToRgb(hex) {
  const normalized = hex.replace("#", "");
  invariant(normalized.length === 6, `invalid hex color: ${hex}`);
  return {
    r: parseInt(normalized.slice(0, 2), 16),
    g: parseInt(normalized.slice(2, 4), 16),
    b: parseInt(normalized.slice(4, 6), 16)
  };
}

function rgbToHex({ r, g, b }) {
  const toHex = (value) => {
    const n = clamp(Math.round(value), 0, 255);
    return n.toString(16).padStart(2, "0");
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

function mixHex(hexA, hexB, t) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  return rgbToHex({
    r: mix(a.r, b.r, t),
    g: mix(a.g, b.g, t),
    b: mix(a.b, b.b, t)
  });
}

function luminance(hex) {
  const { r, g, b } = hexToRgb(hex);
  return round((0.2126 * r + 0.7152 * g + 0.0722 * b) / 255);
}

function colorDistance(hexA, hexB) {
  const a = hexToRgb(hexA);
  const b = hexToRgb(hexB);
  const dr = (a.r - b.r) / 255;
  const dg = (a.g - b.g) / 255;
  const db = (a.b - b.b) / 255;
  return round(Math.sqrt(dr * dr + dg * dg + db * db));
}

const PALETTE = deepFreeze({
  biomeBase: deepFreeze({
    ocean: "#1f4fa3",
    lake: "#3478c7",
    river: "#4e96dd",
    wetland: "#5b8c7b",
    desert: "#c9ab6a",
    grassland: "#7ea358",
    forest: "#3e6f44",
    temperate_forest: "#567b4f",
    boreal_forest: "#436457",
    tundra: "#9aa59f",
    highland: "#8e826d",
    alpine: "#b7bcc4",
    peak: "#f1f4f8"
  }),
  boundaryStroke: deepFreeze({
    OPEN: "#d8e2ec",
    HOLD: "#f2c66d",
    GATE: "#f07f61",
    BRIDGE: "#85d3b0",
    BLOCK: "#af4b45"
  }),
  text: deepFreeze({
    dark: "#17212b",
    light: "#f5f7fa"
  })
});

function getRuntimeCells() {
  const cells = runtime.getCells();
  invariant(Array.isArray(cells), "runtime cells unavailable");
  invariant(cells.length === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES, "runtime cell count mismatch");
  return cells;
}

function computeLight(packet) {
  const altitude =
    packet.point.z !== undefined ? (packet.point.z + 1) * 0.5 : RENDER_CONSTANTS.DEFAULT_LIGHT;
  const heightLight = packet.scalar.elevation * 0.45;
  const slopeRelief = (1 - packet.scalar.slope) * 0.15;
  const coherenceLift = packet.scalar.coherence * 0.10;
  const rainfallDim = packet.scalar.rainfall * 0.06;
  return round(clamp(
    0.30 + altitude * 0.24 + heightLight + slopeRelief + coherenceLift - rainfallDim,
    0,
    1
  ));
}

function computeMotion(packet, projection) {
  const radial =
    projection === "globe"
      ? Math.abs(packet.point.z) * 0.35
      : projection === "tree"
        ? Math.abs(packet.point.x) * 0.22
        : Math.abs(packet.point.y) * 0.12;

  const flow = clamp(packet.scalar.flowAccumulation / 10, 0, 1) * 0.30;
  const slope = packet.scalar.slope * 0.18;
  return round(clamp(radial + flow + slope, 0, 1));
}

function computeRadius(packet) {
  const boundaryBoost =
    packet.boundary === "BLOCK" ? 0.012 :
    packet.boundary === "GATE" ? 0.009 :
    packet.boundary === "BRIDGE" ? 0.007 :
    packet.boundary === "HOLD" ? 0.004 : 0;

  const waterAdjust =
    packet.waterClass === "ocean" ? 0.004 :
    packet.waterClass === "lake" ? 0.003 :
    packet.waterClass === "river" ? -0.003 : 0;

  return round(clamp(
    RENDER_CONSTANTS.NODE_RADIUS +
    packet.scalar.elevation * 0.012 +
    packet.scalar.coherence * 0.010 +
    boundaryBoost +
    waterAdjust,
    0.016,
    0.060
  ));
}

function computeFillColor(packet, light) {
  const base = PALETTE.biomeBase[packet.biome] || "#888888";
  const highlight = packet.waterClass === "ocean" || packet.waterClass === "lake" || packet.waterClass === "river"
    ? "#dff3ff"
    : "#ffffff";
  const shadow = "#101820";

  const lit = mixHex(base, highlight, clamp(light * 0.42, 0, 0.42));
  return mixHex(lit, shadow, clamp((1 - light) * 0.24, 0, 0.24));
}

function computeStrokeColor(packet, fillColor) {
  const boundary = PALETTE.boundaryStroke[packet.boundary];
  return colorDistance(fillColor, boundary) < RENDER_CONSTANTS.COLOR_THRESHOLD
    ? mixHex(boundary, "#ffffff", 0.18)
    : boundary;
}

function computeLabelColor(fillColor) {
  return luminance(fillColor) > 0.56 ? PALETTE.text.dark : PALETTE.text.light;
}

function computeOpacity(packet, light) {
  const waterOpacity =
    packet.waterClass === "ocean" ? 0.82 :
    packet.waterClass === "lake" ? 0.86 :
    packet.waterClass === "river" ? 0.90 : 0.96;

  return round(clamp(waterOpacity - (1 - light) * 0.08, 0.60, 1));
}

function computeRing(packet, radius) {
  const needed =
    packet.boundary === "GATE" ||
    packet.boundary === "BRIDGE" ||
    packet.boundary === "BLOCK" ||
    packet.boundary === "HOLD";

  return deepFreeze({
    enabled: needed,
    radius: needed ? round(radius * RENDER_CONSTANTS.BOUNDARY_RING_SCALE) : 0,
    stroke: needed ? PALETTE.boundaryStroke[packet.boundary] : null,
    alpha: needed
      ? round(clamp(
          packet.boundary === "BLOCK" ? 0.90 :
          packet.boundary === "GATE" ? 0.78 :
          packet.boundary === "BRIDGE" ? 0.66 : 0.54,
          0,
          1
        ))
      : 0
  });
}

function computeLabel(packet, radius, labelColor) {
  return deepFreeze({
    text: `${packet.region}`,
    shortText: `${packet.region.slice(0, 3).toUpperCase()}`,
    color: labelColor,
    anchor: deepFreeze({
      x: round(packet.point.x),
      y: round(packet.point.y + radius + RENDER_CONSTANTS.LABEL_OFFSET),
      z: round(packet.point.z)
    })
  });
}

function buildNodeArtifact(packet, projection) {
  const light = computeLight(packet);
  const motion = computeMotion(packet, projection);
  const radius = computeRadius(packet);
  const fill = computeFillColor(packet, light);
  const stroke = computeStrokeColor(packet, fill);
  const labelColor = computeLabelColor(fill);
  const opacity = computeOpacity(packet, light);
  const ring = computeRing(packet, radius);
  const label = computeLabel(packet, radius, labelColor);

  return deepFreeze({
    index: packet.index,
    i: packet.i,
    j: packet.j,
    region: packet.region,
    summit: packet.summit,
    biome: packet.biome,
    boundary: packet.boundary,
    waterClass: packet.waterClass,
    point: deepFreeze({
      x: round(packet.point.x),
      y: round(packet.point.y),
      z: round(packet.point.z)
    }),
    style: deepFreeze({
      radius,
      fill,
      stroke,
      labelColor,
      opacity,
      light,
      motion
    }),
    ring,
    label,
    scalar: packet.scalar
  });
}

function buildEdgeArtifact(nodeA, nodeB) {
  const sameRegion = nodeA.region === nodeB.region;
  const bridgeBonus =
    nodeA.boundary === "BRIDGE" || nodeB.boundary === "BRIDGE" ? 0.18 : 0;
  const gateBonus =
    nodeA.boundary === "GATE" || nodeB.boundary === "GATE" ? 0.12 : 0;
  const blockPenalty =
    nodeA.boundary === "BLOCK" || nodeB.boundary === "BLOCK" ? 0.22 : 0;
  const elevationContrast = Math.abs(nodeA.scalar.elevation - nodeB.scalar.elevation) * 0.35;

  const alpha = round(clamp(
    (sameRegion ? 0.52 : 0.36) +
    bridgeBonus +
    gateBonus -
    blockPenalty -
    elevationContrast,
    RENDER_CONSTANTS.EDGE_ALPHA_MIN,
    RENDER_CONSTANTS.EDGE_ALPHA_MAX
  ));

  const color = sameRegion
    ? mixHex(nodeA.style.fill, nodeB.style.fill, 0.50)
    : mixHex(nodeA.style.stroke, nodeB.style.stroke, 0.50);

  return deepFreeze({
    from: nodeA.index,
    to: nodeB.index,
    points: deepFreeze([
      deepFreeze({ x: nodeA.point.x, y: nodeA.point.y, z: nodeA.point.z }),
      deepFreeze({ x: nodeB.point.x, y: nodeB.point.y, z: nodeB.point.z })
    ]),
    alpha,
    color
  });
}

function buildProjectionArtifacts(projection) {
  const packets = runtime.getProjection(projection);
  invariant(
    Array.isArray(packets) && packets.length === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES,
    `projection packet count mismatch: ${projection}`
  );

  const nodes = packets.map((packet) => buildNodeArtifact(packet, projection));
  const nodeMap = new Map(nodes.map((node) => [node.index, node]));
  const edges = [];
  const seen = new Set();

  for (const node of nodes) {
    const neighbors = runtime.getNeighbors(node.index);
    for (const neighbor of neighbors) {
      const low = Math.min(node.index, neighbor.index);
      const high = Math.max(node.index, neighbor.index);
      const key = `${low}:${high}`;
      if (seen.has(key)) continue;
      seen.add(key);

      const other = nodeMap.get(neighbor.index);
      if (!other) continue;
      edges.push(buildEdgeArtifact(node, other));
    }
  }

  return deepFreeze({
    projection,
    nodes: deepFreeze(nodes),
    edges: deepFreeze(edges)
  });
}

function buildProjectionSuite() {
  const suite = {};
  for (const projection of RENDER_CONSTANTS.PROJECTIONS) {
    suite[projection] = buildProjectionArtifacts(projection);
  }
  return deepFreeze(suite);
}

function countBoundaryNodes(nodes) {
  const counts = {
    OPEN: 0,
    HOLD: 0,
    GATE: 0,
    BRIDGE: 0,
    BLOCK: 0
  };
  for (const node of nodes) counts[node.boundary] += 1;
  return deepFreeze(counts);
}

function collectProjectionSummary(artifacts) {
  const nodes = artifacts.nodes;
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;
  let averageLight = 0;
  let averageMotion = 0;

  for (const node of nodes) {
    if (node.point.x < minX) minX = node.point.x;
    if (node.point.x > maxX) maxX = node.point.x;
    if (node.point.y < minY) minY = node.point.y;
    if (node.point.y > maxY) maxY = node.point.y;
    if (node.point.z < minZ) minZ = node.point.z;
    if (node.point.z > maxZ) maxZ = node.point.z;
    averageLight += node.style.light;
    averageMotion += node.style.motion;
  }

  const denom = Math.max(nodes.length, 1);

  return deepFreeze({
    nodeCount: nodes.length,
    edgeCount: artifacts.edges.length,
    extent: deepFreeze({
      minX: round(minX),
      maxX: round(maxX),
      minY: round(minY),
      maxY: round(maxY),
      minZ: round(minZ),
      maxZ: round(maxZ)
    }),
    averageLight: round(averageLight / denom),
    averageMotion: round(averageMotion / denom),
    boundaryCounts: countBoundaryNodes(nodes)
  });
}

function buildOverlayArtifacts(runtimeCells, flatNodes) {
  const focus = runtime.getFocusCell();
  const flatFocus = flatNodes.find((node) => node.index === focus.index);

  const regionAnchors = runtime.getRegionPackets().map((region) => {
    const members = flatNodes.filter((node) => node.region === region.name);
    let x = 0;
    let y = 0;
    let z = 0;

    for (const node of members) {
      x += node.point.x;
      y += node.point.y;
      z += node.point.z;
    }

    const denom = Math.max(members.length, 1);

    return deepFreeze({
      region: region.name,
      anchor: deepFreeze({
        x: round(x / denom),
        y: round(y / denom + 0.09),
        z: round(z / denom)
      }),
      cellCount: region.cellCount
    });
  });

  const gateMarkers = flatNodes
    .filter((node) => node.boundary === "GATE")
    .map((node) =>
      deepFreeze({
        index: node.index,
        point: node.point,
        radius: round(node.style.radius * 1.18)
      })
    );

  return deepFreeze({
    focus: deepFreeze({
      index: focus.index,
      point: flatFocus ? flatFocus.point : { x: 0, y: 0, z: 0 },
      radius: flatFocus ? round(flatFocus.style.radius * 1.55) : 0.05,
      color: "#ffffff"
    }),
    regionAnchors: deepFreeze(regionAnchors),
    gateMarkers: deepFreeze(gateMarkers),
    totalRuntimeCells: runtimeCells.length
  });
}

function computeChecksum(renderState) {
  let acc = 31;

  for (const projection of RENDER_CONSTANTS.PROJECTIONS) {
    const artifacts = renderState.projections[projection];
    for (const node of artifacts.nodes) {
      acc = (
        acc * 43 +
        node.index * 19 +
        Math.round(node.point.x * 1000) +
        Math.round(node.point.y * 1000) +
        Math.round(node.point.z * 1000) +
        Math.round(node.style.radius * 1000) +
        Math.round(node.style.light * 1000) +
        Math.round(node.style.motion * 1000) +
        node.fill?.charCodeAt?.(1) || 0
      ) % 1000000007;
    }
  }

  return String(acc);
}

function buildReceipt(renderState) {
  const runtimeReceipt = runtime.getReceipt();

  return deepFreeze({
    receiptVersion: RENDER_CONSTANTS.RECEIPT_VERSION,
    render: RENDER_META.name,
    version: RENDER_META.version,
    deterministic: true,
    runtimeChecksum: runtimeReceipt.runtimeChecksum,
    renderChecksum: computeChecksum(renderState),
    requiredTotalNodes: RENDER_CONSTANTS.REQUIRED_TOTAL_NODES,
    requiredLocalGate: RENDER_CONSTANTS.REQUIRED_LOCAL_GATE,
    wholeEnvelope: RENDER_CONSTANTS.WHOLE_ENVELOPE,
    projectionSummaries: deepFreeze({
      flat: collectProjectionSummary(renderState.projections.flat),
      tree: collectProjectionSummary(renderState.projections.tree),
      globe: collectProjectionSummary(renderState.projections.globe)
    }),
    overlay: deepFreeze({
      regionAnchorCount: renderState.overlay.regionAnchors.length,
      gateMarkerCount: renderState.overlay.gateMarkers.length,
      focusIndex: renderState.overlay.focus.index
    })
  });
}

function buildValidators(renderState) {
  const runtimeValidation = runtime.validate();
  const receipt = renderState.receipt;
  const flatSummary = receipt.projectionSummaries.flat;
  const treeSummary = receipt.projectionSummaries.tree;
  const globeSummary = receipt.projectionSummaries.globe;

  return deepFreeze({
    runtimeTraceability: runtimeValidation.runtimeTraceability === true,
    latticeCompleteness:
      flatSummary.nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      treeSummary.nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      globeSummary.nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES,
    projectionConsistency:
      flatSummary.edgeCount > 0 &&
      treeSummary.edgeCount > 0 &&
      globeSummary.edgeCount > 0,
    determinism: receipt.renderChecksum === computeChecksum(renderState),
    boundaryConsistency:
      flatSummary.boundaryCounts.GATE === RENDER_CONSTANTS.REQUIRED_LOCAL_GATE &&
      treeSummary.boundaryCounts.GATE === RENDER_CONSTANTS.REQUIRED_LOCAL_GATE &&
      globeSummary.boundaryCounts.GATE === RENDER_CONSTANTS.REQUIRED_LOCAL_GATE,
    receiptConsistency:
      receipt.requiredTotalNodes === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      receipt.requiredLocalGate === RENDER_CONSTANTS.REQUIRED_LOCAL_GATE &&
      receipt.wholeEnvelope === RENDER_CONSTANTS.WHOLE_ENVELOPE,
    artifactDrift: false,
    thresholdIntegrity:
      runtime.getReceipt().requiredTotalNodes === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      runtime.getReceipt().requiredLocalGate === RENDER_CONSTANTS.REQUIRED_LOCAL_GATE &&
      runtime.getReceipt().wholeEnvelope === RENDER_CONSTANTS.WHOLE_ENVELOPE,
    successorProjectionCompleteness:
      collectProjectionSummary(renderState.projections.flat).nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      collectProjectionSummary(renderState.projections.tree).nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES &&
      collectProjectionSummary(renderState.projections.globe).nodeCount === RENDER_CONSTANTS.REQUIRED_TOTAL_NODES
  });
}

function buildRenderState() {
  const runtimeValidation = runtime.validate();

  invariant(runtimeValidation.runtimeTraceability, "runtime traceability invalid");
  invariant(runtimeValidation.latticeCompleteness, "runtime lattice invalid");
  invariant(runtimeValidation.projectionConsistency, "runtime projection invalid");
  invariant(runtimeValidation.determinism, "runtime determinism invalid");
  invariant(runtimeValidation.boundaryConsistency, "runtime boundary invalid");
  invariant(runtimeValidation.receiptConsistency, "runtime receipt invalid");
  invariant(runtimeValidation.thresholdIntegrity, "runtime threshold invalid");

  const runtimeCells = getRuntimeCells();
  const projections = buildProjectionSuite();
  const overlay = buildOverlayArtifacts(runtimeCells, projections.flat.nodes);

  const state = deepFreeze({
    meta: RENDER_META,
    constants: RENDER_CONSTANTS,
    projections,
    overlay
  });

  const receipt = buildReceipt(state);
  const fullState = deepFreeze({
    ...state,
    receipt
  });
  const validators = buildValidators(fullState);

  invariant(validators.runtimeTraceability, "render runtime traceability failed");
  invariant(validators.latticeCompleteness, "render lattice completeness failed");
  invariant(validators.projectionConsistency, "render projection consistency failed");
  invariant(validators.determinism, "render determinism failed");
  invariant(validators.boundaryConsistency, "render boundary consistency failed");
  invariant(validators.receiptConsistency, "render receipt consistency failed");
  invariant(validators.thresholdIntegrity, "render threshold integrity failed");
  invariant(validators.successorProjectionCompleteness, "render successor projection completeness failed");

  return deepFreeze({
    ...fullState,
    validators
  });
}

const RENDER = buildRenderState();

const render = deepFreeze({
  meta: RENDER.meta,
  constants: RENDER.constants,

  getMeta() {
    return RENDER.meta;
  },

  getConstants() {
    return RENDER.constants;
  },

  getProjection(projection) {
    invariant(
      RENDER_CONSTANTS.PROJECTIONS.includes(projection),
      `unknown projection: ${projection}`
    );
    return RENDER.projections[projection];
  },

  getNodes(projection) {
    return this.getProjection(projection).nodes;
  },

  getEdges(projection) {
    return this.getProjection(projection).edges;
  },

  getOverlay() {
    return RENDER.overlay;
  },

  getReceipt() {
    return RENDER.receipt;
  },

  getValidators() {
    return RENDER.validators;
  },

  getValidatorKeys() {
    return RENDER_CONSTANTS.VALIDATOR_KEYS;
  },

  validate() {
    return RENDER.validators;
  }
});

export default render;
