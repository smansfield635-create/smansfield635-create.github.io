const WORLD_KERNEL_META = {
  name: "world_kernel",
  version: "G1",
  sourceOfTruth: true,
  immutable: true,
  deterministic: true,
  latticeSize: 16,
  totalNodes: 256
};

const CONSTANTS = Object.freeze({
  LATTICE_MIN: 0,
  LATTICE_MAX: 15,
  LATTICE_SIZE: 16,
  TOTAL_NODES: 256,
  EPSILON: 1e-6,
  TWO_PI: Math.PI * 2,
  PI: Math.PI,
  REGION: Object.freeze({
    anchors: Object.freeze([
      Object.freeze({ id: 1, x: 0.125, y: 0.125, w: 1 }),
      Object.freeze({ id: 2, x: 0.375, y: 0.125, w: 1 }),
      Object.freeze({ id: 3, x: 0.625, y: 0.125, w: 1 }),
      Object.freeze({ id: 4, x: 0.125, y: 0.375, w: 1 }),
      Object.freeze({ id: 5, x: 0.5, y: 0.5, w: 1 }),
      Object.freeze({ id: 6, x: 0.875, y: 0.375, w: 1 }),
      Object.freeze({ id: 7, x: 0.125, y: 0.875, w: 1 }),
      Object.freeze({ id: 8, x: 0.375, y: 0.875, w: 1 }),
      Object.freeze({ id: 9, x: 0.875, y: 0.875, w: 1 })
    ]),
    alpha: 2,
    gamma: 0,
    epsilon: 1e-6
  }),
  DIVIDE: Object.freeze({
    phi: Object.freeze([0, Math.PI / 3, (2 * Math.PI) / 3]),
    mu: Object.freeze([0, 0, 0]),
    tau1: 0.05,
    tau2: 0.15,
    tau3: 0.3
  }),
  FORCE: Object.freeze({
    primaryWeight: 1,
    secondaryWeight: 0.5,
    tieBreakOrder: Object.freeze(["N", "E", "S", "W"]),
    families: Object.freeze({
      N: Object.freeze(["elevation_stability", "coherence"]),
      E: Object.freeze(["generation_potential", "frontier_access"]),
      S: Object.freeze(["visibility", "settlement_density"]),
      W: Object.freeze(["integration_capacity", "adjacency"])
    })
  }),
  THRESHOLD: Object.freeze({
    coherenceThreshold: 0.5,
    anomalyThreshold: 0.5
  }),
  OPEN: Object.freeze({
    tauOpen: 0.8
  }),
  TIME: Object.freeze({
    t0: 0,
    monotonicStep: 1
  })
});

const clamp01 = (value) => {
  if (value < 0) return 0;
  if (value > 1) return 1;
  return value;
};

const floorIndex = (value) => {
  const idx = Math.floor(CONSTANTS.LATTICE_SIZE * value);
  if (idx < CONSTANTS.LATTICE_MIN) return CONSTANTS.LATTICE_MIN;
  if (idx > CONSTANTS.LATTICE_MAX) return CONSTANTS.LATTICE_MAX;
  return idx;
};

const normalizeIndex = (index) => (index + 0.5) / CONSTANTS.LATTICE_SIZE;

const denormalizeCoordinate = (value) => floorIndex(value);

const polarTheta = (x, y) => Math.atan2(y - 0.5, x - 0.5);

const radialDistance = (x, y) => Math.sqrt((x - 0.5) ** 2 + (y - 0.5) ** 2);

const normalizeField = (raw, min, max) => {
  if (max - min === 0) return 0;
  return clamp01((raw - min) / (max - min));
};

const variance = (values) => {
  const mean = values.reduce((sum, v) => sum + v, 0) / values.length;
  return values.reduce((sum, v) => sum + (v - mean) ** 2, 0) / values.length;
};

const canonicalFields = (x, y) => {
  const dx = x - 0.5;
  const dy = y - 0.5;
  const radius = radialDistance(x, y);
  const radiusMax = Math.sqrt(0.5 ** 2 + 0.5 ** 2);
  const radial = normalizeField(radius, 0, radiusMax);
  const axialX = clamp01(x);
  const axialY = clamp01(y);
  const curvature = clamp01(Math.abs(dx * dy) * 4);
  const pressure = clamp01(1 - radial);
  const gradient = clamp01((Math.abs(dx) + Math.abs(dy)) / 1);

  return Object.freeze({
    radial,
    axialX,
    axialY,
    curvature,
    pressure,
    gradient
  });
};

const regionScore = (x, y, anchor, alpha, gamma, epsilon) => {
  const dx = x - anchor.x;
  const dy = y - anchor.y;
  const d = Math.sqrt(dx ** 2 + dy ** 2);
  const influence = anchor.w / (d ** alpha + epsilon);
  const delta = gamma * (dx + dy);
  return Object.freeze({
    anchorId: anchor.id,
    distance: d,
    influence,
    delta,
    score: influence + delta
  });
};

const assignRegion = (x, y) => {
  const { anchors, alpha, gamma, epsilon } = CONSTANTS.REGION;
  const scored = anchors.map((anchor) => regionScore(x, y, anchor, alpha, gamma, epsilon));

  let best = scored[0];
  for (let idx = 1; idx < scored.length; idx += 1) {
    const candidate = scored[idx];
    if (candidate.score > best.score) {
      best = candidate;
      continue;
    }
    if (candidate.score === best.score) {
      if (candidate.distance < best.distance) {
        best = candidate;
        continue;
      }
      if (candidate.distance === best.distance && candidate.anchorId < best.anchorId) {
        best = candidate;
      }
    }
  }

  return Object.freeze({
    regionId: best.anchorId,
    regionKey: `region_${best.anchorId}`,
    score: best.score,
    distance: best.distance
  });
};

const divideLines = (x, y) => {
  return CONSTANTS.DIVIDE.phi.map((phi, idx) => {
    const value = Math.cos(phi) * x + Math.sin(phi) * y - CONSTANTS.DIVIDE.mu[idx];
    return Object.freeze({
      index: idx + 1,
      phi,
      mu: CONSTANTS.DIVIDE.mu[idx],
      value,
      absValue: Math.abs(value)
    });
  });
};

const classifyDivide = (x, y) => {
  const lines = divideLines(x, y);
  let dominant = lines[0];
  for (let idx = 1; idx < lines.length; idx += 1) {
    const candidate = lines[idx];
    if (candidate.absValue > dominant.absValue) dominant = candidate;
  }

  const mValue = dominant.absValue;
  let division = "BLOCK";
  if (mValue < CONSTANTS.DIVIDE.tau1) division = "HOLD";
  else if (mValue < CONSTANTS.DIVIDE.tau2) division = "GATE";
  else if (mValue < CONSTANTS.DIVIDE.tau3) division = "BRIDGE";

  return Object.freeze({
    dominantLine: dominant.index,
    magnitude: mValue,
    classification: division,
    lines: Object.freeze(lines)
  });
};

const resolveFieldFamilies = (fields) => {
  const elevation_stability = fields.pressure;
  const coherence = clamp01(1 - fields.curvature);

  const generation_potential = fields.axialX;
  const frontier_access = fields.radial;

  const visibility = clamp01(1 - fields.radial);
  const settlement_density = clamp01(1 - fields.axialY);

  const integration_capacity = clamp01(1 - fields.axialX);
  const adjacency = clamp01(1 - fields.gradient);

  return Object.freeze({
    elevation_stability,
    coherence,
    generation_potential,
    frontier_access,
    visibility,
    settlement_density,
    integration_capacity,
    adjacency
  });
};

const computeForce = (fieldFamilies) => {
  const primary = CONSTANTS.FORCE.primaryWeight;
  const secondary = CONSTANTS.FORCE.secondaryWeight;

  const raw = Object.freeze({
    N: primary * fieldFamilies.elevation_stability + secondary * fieldFamilies.coherence,
    E: primary * fieldFamilies.generation_potential + secondary * fieldFamilies.frontier_access,
    S: primary * fieldFamilies.visibility + secondary * fieldFamilies.settlement_density,
    W: primary * fieldFamilies.integration_capacity + secondary * fieldFamilies.adjacency
  });

  const maxRaw = Math.max(raw.N, raw.E, raw.S, raw.W);
  const normalized =
    maxRaw === 0
      ? Object.freeze({ N: 0, E: 0, S: 0, W: 0 })
      : Object.freeze({
          N: raw.N / maxRaw,
          E: raw.E / maxRaw,
          S: raw.S / maxRaw,
          W: raw.W / maxRaw
        });

  const boundaryCoherence = clamp01(1 - variance([normalized.N, normalized.E, normalized.S, normalized.W]));

  return Object.freeze({
    raw,
    normalized,
    B: boundaryCoherence
  });
};

const resolveNode = (forces) => {
  const ordered = CONSTANTS.FORCE.tieBreakOrder;
  let winner = ordered[0];
  let maxValue = forces.normalized[winner];

  for (let idx = 1; idx < ordered.length; idx += 1) {
    const dir = ordered[idx];
    const value = forces.normalized[dir];
    if (value > maxValue) {
      winner = dir;
      maxValue = value;
    }
  }

  return Object.freeze({
    node: winner,
    nodeKey: `node_${winner}`
  });
};

const classifyBoundary = (divide, forces, i, j) => {
  const atWest = i === CONSTANTS.LATTICE_MIN;
  const atEast = i === CONSTANTS.LATTICE_MAX;
  const atSouth = j === CONSTANTS.LATTICE_MIN;
  const atNorth = j === CONSTANTS.LATTICE_MAX;

  const edgeCount = [atWest, atEast, atSouth, atNorth].filter(Boolean).length;
  const boundaryType =
    edgeCount >= 2 ? "corner" : edgeCount === 1 ? "edge" : i === 7 || i === 8 || j === 7 || j === 8 ? "axis" : "interior";

  return Object.freeze({
    divideClass: divide.classification,
    boundaryType,
    open: forces.B < CONSTANTS.OPEN.tauOpen,
    B: forces.B
  });
};

const evaluateThreshold = (M) => {
  const within =
    M.CT >= CONSTANTS.THRESHOLD.coherenceThreshold &&
    M.AQ <= CONSTANTS.THRESHOLD.anomalyThreshold;

  return Object.freeze({
    classification: within ? "WITHIN" : "FRAGMENTED",
    action: within ? "PASS" : "HALT"
  });
};

const flatProjection = (i, j) => Object.freeze({ i, j });

const treeProjection = (i, j) =>
  Object.freeze({
    parent: Object.freeze({
      i: Math.floor(i / 2),
      j: Math.floor(j / 2)
    })
  });

const globeProjection = (i, j) => {
  const theta_g = CONSTANTS.TWO_PI * (i / CONSTANTS.LATTICE_SIZE);
  const phi_g = CONSTANTS.PI * (j / CONSTANTS.LATTICE_SIZE);
  const x = Math.cos(theta_g) * Math.sin(phi_g);
  const y = Math.sin(theta_g) * Math.sin(phi_g);
  const z = Math.cos(phi_g);

  return Object.freeze({
    theta_g,
    phi_g,
    x,
    y,
    z
  });
};

const createReceipt = (node, t) => {
  if (!Number.isInteger(t) || t < 0) {
    throw new Error("timestamp must be a non-negative integer");
  }

  return Object.freeze({
    state: Object.freeze({ i: node.index.i, j: node.index.j }),
    region: node.region.regionKey,
    node: node.node.node,
    forces: node.forces.normalized,
    boundary: node.divide.classification,
    timestamp: t
  });
};

const createNode = (i, j) => {
  const x = normalizeIndex(i);
  const y = normalizeIndex(j);
  const theta = polarTheta(x, y);

  const fields = canonicalFields(x, y);
  const region = assignRegion(x, y);
  const divide = classifyDivide(x, y);
  const fieldFamilies = resolveFieldFamilies(fields);
  const forces = computeForce(fieldFamilies);
  const node = resolveNode(forces);
  const boundary = classifyBoundary(divide, forces, i, j);

  const M = Object.freeze({
    CT: fieldFamilies.coherence,
    AQ: clamp01(1 - forces.B),
    tau: Object.freeze({
      tau1: CONSTANTS.THRESHOLD.coherenceThreshold,
      tau2: CONSTANTS.THRESHOLD.anomalyThreshold
    })
  });

  const threshold = evaluateThreshold(M);

  const projections = Object.freeze({
    flat: flatProjection(i, j),
    tree: treeProjection(i, j),
    globe: globeProjection(i, j)
  });

  return Object.freeze({
    index: Object.freeze({ i, j }),
    coordinates: Object.freeze({ x, y, theta, radius: radialDistance(x, y) }),
    region,
    divide,
    fields,
    fieldFamilies,
    forces,
    node,
    boundary,
    metric: M,
    threshold,
    projections
  });
};

const buildLattice = () => {
  const nodes = [];
  const byKey = {};

  for (let j = CONSTANTS.LATTICE_MIN; j <= CONSTANTS.LATTICE_MAX; j += 1) {
    for (let i = CONSTANTS.LATTICE_MIN; i <= CONSTANTS.LATTICE_MAX; i += 1) {
      const node = createNode(i, j);
      const key = `${i},${j}`;
      nodes.push(node);
      byKey[key] = node;
    }
  }

  return Object.freeze({
    nodes: Object.freeze(nodes),
    byKey: Object.freeze(byKey)
  });
};

const validateKernel = (kernel) => {
  const errors = [];

  if (kernel.lattice.nodes.length !== CONSTANTS.TOTAL_NODES) {
    errors.push("INVALID_NODE_COUNT");
  }

  const seen = new Set();
  for (const node of kernel.lattice.nodes) {
    const key = `${node.index.i},${node.index.j}`;
    if (seen.has(key)) errors.push(`DUPLICATE_NODE:${key}`);
    seen.add(key);

    const inverseI = denormalizeCoordinate(node.coordinates.x);
    const inverseJ = denormalizeCoordinate(node.coordinates.y);
    if (inverseI !== node.index.i || inverseJ !== node.index.j) {
      errors.push(`NON_REVERSIBLE_INDEX:${key}`);
    }

    const flatRegion = node.region.regionKey;
    const treeRegion = node.region.regionKey;
    const globeRegion = node.region.regionKey;

    const flatDivide = node.divide.classification;
    const treeDivide = node.divide.classification;
    const globeDivide = node.divide.classification;

    const flatForce = JSON.stringify(node.forces.normalized);
    const treeForce = JSON.stringify(node.forces.normalized);
    const globeForce = JSON.stringify(node.forces.normalized);

    if (!(flatRegion === treeRegion && treeRegion === globeRegion)) {
      errors.push(`REGION_PROJECTION_MISMATCH:${key}`);
    }
    if (!(flatDivide === treeDivide && treeDivide === globeDivide)) {
      errors.push(`DIVIDE_PROJECTION_MISMATCH:${key}`);
    }
    if (!(flatForce === treeForce && treeForce === globeForce)) {
      errors.push(`FORCE_PROJECTION_MISMATCH:${key}`);
    }
  }

  return Object.freeze({
    ok: errors.length === 0,
    errors: Object.freeze(errors)
  });
};

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((name) => {
    deepFreeze(value[name]);
  });
  return Object.freeze(value);
};

const lattice = buildLattice();

const API = Object.freeze({
  normalizeIndex,
  denormalizeCoordinate,
  polarTheta,
  canonicalFields,
  assignRegion,
  classifyDivide,
  resolveFieldFamilies,
  computeForce,
  resolveNode,
  classifyBoundary,
  evaluateThreshold,
  flatProjection,
  treeProjection,
  globeProjection,
  createReceipt,
  getNode(i, j) {
    const ii = Math.max(CONSTANTS.LATTICE_MIN, Math.min(CONSTANTS.LATTICE_MAX, i));
    const jj = Math.max(CONSTANTS.LATTICE_MIN, Math.min(CONSTANTS.LATTICE_MAX, j));
    return lattice.byKey[`${ii},${jj}`];
  }
});

const worldKernel = deepFreeze({
  meta: WORLD_KERNEL_META,
  constants: CONSTANTS,
  lattice,
  api: API,
  validation: Object.freeze({})
});

const validatedWorldKernel = deepFreeze({
  ...worldKernel,
  validation: validateKernel(worldKernel)
});

export default validatedWorldKernel;
