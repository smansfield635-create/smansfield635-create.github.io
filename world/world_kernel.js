// /world/world_kernel.js
// KERNEL_BASELINE_CONTRACT_G1
// GOLD_STANDARD_WORLD_KERNEL_G1
// Truth-only canonical world kernel.
// No render logic. No runtime orchestration. No browser/platform dependencies.

const GRID_SIZE = 16;
const GRID_MIN = 0;
const GRID_MAX = GRID_SIZE - 1;
const TOTAL_NODES = GRID_SIZE * GRID_SIZE;
const REGION_COUNT = 9;
const DIVIDE_COUNT = 3;
const NODE_COUNT = 16;
const EPSILON = 1e-9;
const TWO_PI = Math.PI * 2;

const deepFreeze = (value) => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.freeze(value);
  for (const key of Object.keys(value)) {
    deepFreeze(value[key]);
  }
  return value;
};

const clamp01 = (n) => {
  if (!Number.isFinite(n)) return 0;
  if (n <= 0) return 0;
  if (n >= 1) return 1;
  return n;
};

const clamp = (n, min, max) => {
  if (!Number.isFinite(n)) return min;
  if (n < min) return min;
  if (n > max) return max;
  return n;
};

const assertFinite = (name, value) => {
  if (!Number.isFinite(value)) {
    throw new TypeError(`${name} must be finite. Received ${value}`);
  }
};

const assertInteger = (name, value) => {
  if (!Number.isInteger(value)) {
    throw new TypeError(`${name} must be an integer. Received ${value}`);
  }
};

const assertIndex = (i, j) => {
  assertInteger("i", i);
  assertInteger("j", j);
  if (i < GRID_MIN || i > GRID_MAX || j < GRID_MIN || j > GRID_MAX) {
    throw new RangeError(
      `Indices out of bounds. Expected 0..${GRID_MAX}; received i=${i}, j=${j}`,
    );
  }
};

const stableRound = (value, places = 12) => {
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
};

const normalizeAngle = (angle) => {
  let out = angle % TWO_PI;
  if (out < 0) out += TWO_PI;
  return out;
};

const makeKey = (prefix, ...parts) => `${prefix}:${parts.join(":")}`;

const pairwiseVariance = (values) => {
  const n = values.length;
  if (n === 0) return 0;
  let mean = 0;
  for (let i = 0; i < n; i += 1) mean += values[i];
  mean /= n;
  let acc = 0;
  for (let i = 0; i < n; i += 1) {
    const d = values[i] - mean;
    acc += d * d;
  }
  return acc / n;
};

const NODE_LABELS_16 = deepFreeze([
  "E",
  "ENE",
  "NE",
  "NNE",
  "N",
  "NNW",
  "NW",
  "WNW",
  "W",
  "WSW",
  "SW",
  "SSW",
  "S",
  "SSE",
  "SE",
  "ESE",
]);

const PRIMARY_FORCE_ORDER = deepFreeze(["N", "E", "S", "W"]);
const BOUNDARY_CLASSES = deepFreeze(["OPEN", "HOLD", "GATE", "BRIDGE", "BLOCK"]);
const DIVIDE_LABELS = deepFreeze(["DIVIDE_1", "DIVIDE_2", "DIVIDE_3"]);
const REGION_LABELS = deepFreeze([
  "GRATITUDE",
  "GENEROSITY",
  "DEPENDABILITY",
  "ACCOUNTABILITY",
  "HUMILITY",
  "FORGIVENESS",
  "SELF_CONTROL",
  "PATIENCE",
  "PURITY",
]);

const DEFAULT_THRESHOLDS = deepFreeze({
  ctWithin: 0.6,
  aqWithin: 0.4,
  boundaryOpen: 0.18,
  boundaryHold: 0.34,
  boundaryGate: 0.5,
  boundaryBridge: 0.7,
});

const DEFAULT_WORLD_PROFILE = deepFreeze({
  id: "theta_single_planet_g1",
  attractors: deepFreeze([
    { x: 0.18, y: 0.18, weight: 1.0, label: REGION_LABELS[0] },
    { x: 0.50, y: 0.18, weight: 1.05, label: REGION_LABELS[1] },
    { x: 0.82, y: 0.18, weight: 1.0, label: REGION_LABELS[2] },
    { x: 0.18, y: 0.50, weight: 1.05, label: REGION_LABELS[3] },
    { x: 0.50, y: 0.50, weight: 1.15, label: REGION_LABELS[4] },
    { x: 0.82, y: 0.50, weight: 1.05, label: REGION_LABELS[5] },
    { x: 0.18, y: 0.82, weight: 1.0, label: REGION_LABELS[6] },
    { x: 0.50, y: 0.82, weight: 1.05, label: REGION_LABELS[7] },
    { x: 0.82, y: 0.82, weight: 1.0, label: REGION_LABELS[8] },
  ]),
  alpha: 2.0,
  beta: 1.25,
  gamma: 0.18,
  divides: deepFreeze([
    { phi: 0.0, mu: 0.0, label: DIVIDE_LABELS[0] },
    { phi: Math.PI / 3, mu: 0.0, label: DIVIDE_LABELS[1] },
    { phi: (2 * Math.PI) / 3, mu: 0.0, label: DIVIDE_LABELS[2] },
  ]),
  terrainBias: 0.25,
  climateBias: 0.2,
  stabilityBias: 0.65,
  symmetry: 0.82,
  thresholds: DEFAULT_THRESHOLDS,
});

const normalizeIndex = (i, j) => {
  assertIndex(i, j);

  const x01 = (i + 0.5) / GRID_SIZE;
  const y01 = (j + 0.5) / GRID_SIZE;

  const x = stableRound(-1 + 2 * x01);
  const y = stableRound(-1 + 2 * y01);

  const radius01 = clamp01(Math.sqrt(x * x + y * y) / Math.SQRT2);
  const theta = stableRound(normalizeAngle(Math.atan2(y, x)));

  return deepFreeze({
    i,
    j,
    x01: stableRound(x01),
    y01: stableRound(y01),
    x,
    y,
    radius01: stableRound(radius01),
    theta,
  });
};

const denormalizeIndex = (x01, y01) => {
  assertFinite("x01", x01);
  assertFinite("y01", y01);
  const i = clamp(Math.floor(x01 * GRID_SIZE), GRID_MIN, GRID_MAX);
  const j = clamp(Math.floor(y01 * GRID_SIZE), GRID_MIN, GRID_MAX);
  return deepFreeze({ i, j });
};

const normalizeWorldProfile = (profile = DEFAULT_WORLD_PROFILE) => {
  if (!profile || typeof profile !== "object") {
    throw new TypeError("World profile must be an object.");
  }

  const attractors = Array.isArray(profile.attractors) ? profile.attractors : [];
  const divides = Array.isArray(profile.divides) ? profile.divides : [];

  if (attractors.length !== REGION_COUNT) {
    throw new Error(`World profile must define exactly ${REGION_COUNT} attractors.`);
  }

  if (divides.length !== DIVIDE_COUNT) {
    throw new Error(`World profile must define exactly ${DIVIDE_COUNT} divides.`);
  }

  const normalizedAttractors = attractors.map((a, index) => {
    assertFinite(`attractor[${index}].x`, a.x);
    assertFinite(`attractor[${index}].y`, a.y);
    assertFinite(`attractor[${index}].weight`, a.weight);
    return deepFreeze({
      x: clamp01(a.x),
      y: clamp01(a.y),
      weight: Math.max(EPSILON, a.weight),
      label:
        typeof a.label === "string" && a.label.length > 0
          ? a.label
          : REGION_LABELS[index],
      id: index + 1,
    });
  });

  const normalizedDivides = divides.map((d, index) => {
    assertFinite(`divide[${index}].phi`, d.phi);
    assertFinite(`divide[${index}].mu`, d.mu);
    return deepFreeze({
      phi: normalizeAngle(d.phi),
      mu: d.mu,
      label:
        typeof d.label === "string" && d.label.length > 0
          ? d.label
          : DIVIDE_LABELS[index],
      id: index + 1,
    });
  });

  const thresholds = {
    ...DEFAULT_THRESHOLDS,
    ...(profile.thresholds || {}),
  };

  return deepFreeze({
    id:
      typeof profile.id === "string" && profile.id.length > 0
        ? profile.id
        : DEFAULT_WORLD_PROFILE.id,
    attractors: normalizedAttractors,
    alpha: Math.max(EPSILON, Number(profile.alpha ?? DEFAULT_WORLD_PROFILE.alpha)),
    beta: Math.max(EPSILON, Number(profile.beta ?? DEFAULT_WORLD_PROFILE.beta)),
    gamma: Number(profile.gamma ?? DEFAULT_WORLD_PROFILE.gamma),
    divides: normalizedDivides,
    terrainBias: Number(profile.terrainBias ?? DEFAULT_WORLD_PROFILE.terrainBias),
    climateBias: Number(profile.climateBias ?? DEFAULT_WORLD_PROFILE.climateBias),
    stabilityBias: Number(profile.stabilityBias ?? DEFAULT_WORLD_PROFILE.stabilityBias),
    symmetry: clamp01(Number(profile.symmetry ?? DEFAULT_WORLD_PROFILE.symmetry)),
    thresholds: deepFreeze({
      ctWithin: Number(thresholds.ctWithin),
      aqWithin: Number(thresholds.aqWithin),
      boundaryOpen: Number(thresholds.boundaryOpen),
      boundaryHold: Number(thresholds.boundaryHold),
      boundaryGate: Number(thresholds.boundaryGate),
      boundaryBridge: Number(thresholds.boundaryBridge),
    }),
  });
};

const attractorDistance = (x01, y01, attractor) => {
  const dx = x01 - attractor.x;
  const dy = y01 - attractor.y;
  return Math.sqrt(dx * dx + dy * dy);
};

const attractorScores = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const n = normalizeIndex(i, j);
  const profile = normalizeWorldProfile(worldProfile);

  const scores = profile.attractors.map((a) => {
    const d = attractorDistance(n.x01, n.y01, a);
    const influence = a.weight / (Math.pow(d, profile.alpha) + EPSILON);
    const sharpened = Math.pow(influence, profile.beta);
    const directional = profile.gamma * ((n.x01 - a.x) + (n.y01 - a.y));
    const score = sharpened + directional;

    return deepFreeze({
      regionId: a.id,
      label: a.label,
      attractor: a,
      distance: stableRound(d),
      influence: stableRound(influence),
      sharpened: stableRound(sharpened),
      directional: stableRound(directional),
      score: stableRound(score),
    });
  });

  scores.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    if (a.distance !== b.distance) return a.distance - b.distance;
    return a.regionId - b.regionId;
  });

  return deepFreeze(scores);
};

const regionAssignment = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);
  const scores = attractorScores(i, j, profile);
  const winner = scores[0];
  const runnerUp = scores[1];
  const margin = stableRound(winner.score - runnerUp.score);

  return deepFreeze({
    profileId: profile.id,
    regionId: winner.regionId,
    label: winner.label,
    attractor: winner.attractor,
    score: winner.score,
    margin,
    tieBrokenBy: winner.score === runnerUp.score ? "distance" : "score",
    scores,
  });
};

const divideFunction = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const n = normalizeIndex(i, j);
  const profile = normalizeWorldProfile(worldProfile);

  const values = profile.divides.map((d) => {
    const raw = Math.cos(d.phi) * n.x01 + Math.sin(d.phi) * n.y01 - d.mu;
    return deepFreeze({
      divideId: d.id,
      label: d.label,
      phi: d.phi,
      mu: d.mu,
      lineValue: stableRound(raw),
      magnitude: stableRound(Math.abs(raw)),
      sign: raw < 0 ? -1 : raw > 0 ? 1 : 0,
    });
  });

  values.sort((a, b) => {
    if (b.magnitude !== a.magnitude) return b.magnitude - a.magnitude;
    return a.divideId - b.divideId;
  });

  const dominant = values[0];

  return deepFreeze({
    profileId: profile.id,
    divideId: dominant.divideId,
    label: dominant.label,
    dominant,
    values,
  });
};

const computeRawFields = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const n = normalizeIndex(i, j);
  const region = regionAssignment(i, j, worldProfile);
  const divide = divideFunction(i, j, worldProfile);
  const profile = normalizeWorldProfile(worldProfile);

  const centerDistance = n.radius01;
  const axialEast = clamp01(n.x01);
  const axialNorth = clamp01(n.y01);
  const diagonalTension = clamp01(Math.abs(n.x01 - n.y01));
  const coherence = clamp01((1 - centerDistance) * profile.stabilityBias + profile.symmetry * 0.25);
  const visibility = clamp01(centerDistance * 0.85 + (1 - Math.abs(n.y)) * 0.15);
  const frontier = clamp01((axialEast + (1 - axialNorth)) / 2);
  const integration = clamp01((1 - diagonalTension) * 0.7 + (1 - region.margin) * 0.3);
  const boundaryPressure = clamp01(
    divide.dominant.magnitude * 0.65 + diagonalTension * 0.2 + centerDistance * 0.15,
  );

  return deepFreeze({
    coherence,
    visibility,
    frontier,
    integration,
    boundaryPressure,
    centerDistance,
    axialEast,
    axialNorth,
    diagonalTension,
  });
};

const fieldNormalizationPipeline = (rawFields) => {
  if (!rawFields || typeof rawFields !== "object") {
    throw new TypeError("Raw fields must be an object.");
  }

  return deepFreeze({
    coherence: clamp01(rawFields.coherence),
    visibility: clamp01(rawFields.visibility),
    frontier: clamp01(rawFields.frontier),
    integration: clamp01(rawFields.integration),
    boundaryPressure: clamp01(rawFields.boundaryPressure),
    centerDistance: clamp01(rawFields.centerDistance),
    axialEast: clamp01(rawFields.axialEast),
    axialNorth: clamp01(rawFields.axialNorth),
    diagonalTension: clamp01(rawFields.diagonalTension),
  });
};

const FORCE_WEIGHT_MATRIX = deepFreeze({
  N: deepFreeze({
    coherence: 0.45,
    axialNorth: 0.2,
    integration: 0.2,
    centerDistance: -0.1,
    visibility: 0.05,
  }),
  E: deepFreeze({
    frontier: 0.45,
    axialEast: 0.25,
    visibility: 0.15,
    coherence: 0.05,
    diagonalTension: 0.1,
  }),
  S: deepFreeze({
    visibility: 0.4,
    centerDistance: 0.25,
    frontier: 0.1,
    diagonalTension: 0.15,
    coherence: 0.1,
  }),
  W: deepFreeze({
    integration: 0.45,
    coherence: 0.2,
    diagonalTension: 0.15,
    centerDistance: 0.05,
    axialEast: -0.15,
  }),
});

const weightedForce = (fields, matrix) => {
  let sum = 0;
  for (const key of Object.keys(matrix)) {
    sum += (fields[key] ?? 0) * matrix[key];
  }
  return clamp01(sum);
};

const forceComputation = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const raw = computeRawFields(i, j, worldProfile);
  const fields = fieldNormalizationPipeline(raw);

  const N = weightedForce(fields, FORCE_WEIGHT_MATRIX.N);
  const E = weightedForce(fields, FORCE_WEIGHT_MATRIX.E);
  const S = weightedForce(fields, FORCE_WEIGHT_MATRIX.S);
  const W = weightedForce(fields, FORCE_WEIGHT_MATRIX.W);
  const variance = pairwiseVariance([N, E, S, W]);
  const B = clamp01(fields.boundaryPressure * 0.7 + variance * 0.3);

  return deepFreeze({
    fields,
    vector: deepFreeze({
      N: stableRound(N),
      E: stableRound(E),
      S: stableRound(S),
      W: stableRound(W),
      B: stableRound(B),
    }),
    variance: stableRound(variance),
  });
};

const rankDirectionalForces = (vector) => {
  const ranked = PRIMARY_FORCE_ORDER.map((key) => ({
    key,
    value: vector[key],
  }));

  ranked.sort((a, b) => {
    if (b.value !== a.value) return b.value - a.value;
    return PRIMARY_FORCE_ORDER.indexOf(a.key) - PRIMARY_FORCE_ORDER.indexOf(b.key);
  });

  return deepFreeze(ranked);
};

const vectorToNodeIndex = (vector) => {
  const vx = vector.E - vector.W;
  const vy = vector.N - vector.S;

  if (Math.abs(vx) < EPSILON && Math.abs(vy) < EPSILON) {
    return 0;
  }

  const angle = normalizeAngle(Math.atan2(vy, vx));
  const sector = Math.floor(((angle + Math.PI / 16) % TWO_PI) / (TWO_PI / NODE_COUNT)) % NODE_COUNT;
  return sector;
};

const nodeResolution = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const forces = forceComputation(i, j, worldProfile);
  const ranked = rankDirectionalForces(forces.vector);
  const primary = ranked[0];
  const secondary = ranked[1];
  const nodeId = vectorToNodeIndex(forces.vector);

  return deepFreeze({
    nodeId,
    label: NODE_LABELS_16[nodeId],
    primary: primary.key,
    primaryValue: stableRound(primary.value),
    secondary: secondary.key,
    secondaryValue: stableRound(secondary.value),
    ranked,
  });
};

const boundaryClassification = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);
  const forces = forceComputation(i, j, profile);
  const ranked = rankDirectionalForces(forces.vector);
  const dominanceGap = ranked[0].value - ranked[1].value;
  const boundaryScore = clamp01((1 - dominanceGap) * 0.6 + forces.vector.B * 0.4);

  let classification = "BLOCK";
  if (boundaryScore < profile.thresholds.boundaryOpen) classification = "OPEN";
  else if (boundaryScore < profile.thresholds.boundaryHold) classification = "HOLD";
  else if (boundaryScore < profile.thresholds.boundaryGate) classification = "GATE";
  else if (boundaryScore < profile.thresholds.boundaryBridge) classification = "BRIDGE";

  return deepFreeze({
    classification,
    score: stableRound(boundaryScore),
    dominanceGap: stableRound(dominanceGap),
  });
};

const receiptShape = (state, timeStep = 0) => {
  if (!state || typeof state !== "object") {
    throw new TypeError("Receipt creation requires a state object.");
  }
  assertFinite("timeStep", timeStep);

  return deepFreeze({
    state: deepFreeze({ i: state.i, j: state.j }),
    region: deepFreeze({
      regionId: state.region.regionId,
      label: state.region.label,
    }),
    node: deepFreeze({
      nodeId: state.node.nodeId,
      label: state.node.label,
    }),
    forces: deepFreeze({ ...state.force.vector }),
    boundary: state.boundary.classification,
    timestamp: timeStep,
  });
};

const thresholdEvaluation = (measurement, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);
  const CT = clamp01(Number(measurement?.CT ?? 1));
  const AQ = clamp01(Number(measurement?.AQ ?? 0));
  const within = CT >= profile.thresholds.ctWithin && AQ <= profile.thresholds.aqWithin;

  return deepFreeze({
    CT: stableRound(CT),
    AQ: stableRound(AQ),
    classification: within ? "WITHIN" : "FRAGMENTED",
    action: within ? "PASS" : "HALT",
  });
};

const projectionFlat = (i, j) => {
  const n = normalizeIndex(i, j);
  return deepFreeze({
    x: n.x01,
    y: n.y01,
  });
};

const projectionTree = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const region = regionAssignment(i, j, worldProfile);
  const node = nodeResolution(i, j, worldProfile);

  return deepFreeze({
    root: region.regionId,
    branch: node.primary,
    leaf: node.nodeId,
    label: node.label,
  });
};

const projectionGlobe = (i, j) => {
  const n = normalizeIndex(i, j);
  const lon = stableRound((n.x01 * 360) - 180);
  const lat = stableRound(90 - (n.y01 * 180));

  const theta = stableRound(((i + 0.5) / GRID_SIZE) * TWO_PI);
  const phi = stableRound(((j + 0.5) / GRID_SIZE) * Math.PI);

  const x = stableRound(Math.cos(theta) * Math.sin(phi));
  const y = stableRound(Math.sin(theta) * Math.sin(phi));
  const z = stableRound(Math.cos(phi));

  return deepFreeze({ lat, lon, x, y, z });
};

const createCell = (i, j, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const normalized = normalizeIndex(i, j);
  const region = regionAssignment(i, j, worldProfile);
  const divide = divideFunction(i, j, worldProfile);
  const force = forceComputation(i, j, worldProfile);
  const node = nodeResolution(i, j, worldProfile);
  const boundary = boundaryClassification(i, j, worldProfile);

  const state = deepFreeze({
    i,
    j,
    normalized,
    region,
    divide,
    force,
    node,
    boundary,
  });

  const receipt = receiptShape(state, 0);
  const threshold = thresholdEvaluation({ CT: 1, AQ: 0 }, worldProfile);

  return deepFreeze({
    ...state,
    receipt,
    threshold,
    projections: deepFreeze({
      flat: projectionFlat(i, j),
      tree: projectionTree(i, j, worldProfile),
      globe: projectionGlobe(i, j),
    }),
  });
};

const buildLattice = (worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);
  const cells = [];

  for (let j = GRID_MIN; j <= GRID_MAX; j += 1) {
    for (let i = GRID_MIN; i <= GRID_MAX; i += 1) {
      cells.push(createCell(i, j, profile));
    }
  }

  return deepFreeze(cells);
};

const validateKernel = (lattice, worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);

  if (!Array.isArray(lattice)) {
    throw new TypeError("Kernel lattice must be an array.");
  }

  if (lattice.length !== TOTAL_NODES) {
    throw new Error(`Kernel lattice must contain ${TOTAL_NODES} cells. Found ${lattice.length}.`);
  }

  const seen = new Set();
  const regionIds = new Set();
  const divideIds = new Set();
  const nodeIds = new Set();

  for (const cell of lattice) {
    const key = makeKey("cell", cell.i, cell.j);

    if (seen.has(key)) {
      throw new Error(`Duplicate lattice cell detected at ${key}.`);
    }

    seen.add(key);

    if (!cell.region || !cell.divide || !cell.force || !cell.node || !cell.boundary) {
      throw new Error(`Incomplete cell at ${key}.`);
    }

    regionIds.add(cell.region.regionId);
    divideIds.add(cell.divide.divideId);
    nodeIds.add(cell.node.nodeId);

    if (cell.node.nodeId < 0 || cell.node.nodeId >= NODE_COUNT) {
      throw new Error(`Invalid node id at ${key}.`);
    }

    if (!BOUNDARY_CLASSES.includes(cell.boundary.classification)) {
      throw new Error(`Invalid boundary class at ${key}.`);
    }

    const flat = projectionFlat(cell.i, cell.j);
    const tree = projectionTree(cell.i, cell.j, profile);
    const globe = projectionGlobe(cell.i, cell.j);

    if (tree.root !== cell.region.regionId) {
      throw new Error(`Tree projection changed region truth at ${key}.`);
    }

    if (!Number.isFinite(flat.x) || !Number.isFinite(flat.y)) {
      throw new Error(`Invalid flat projection at ${key}.`);
    }

    if (!Number.isFinite(globe.lat) || !Number.isFinite(globe.lon)) {
      throw new Error(`Invalid globe projection at ${key}.`);
    }
  }

  if (regionIds.size !== REGION_COUNT) {
    throw new Error(`Expected ${REGION_COUNT} regions. Found ${regionIds.size}.`);
  }

  if (divideIds.size !== DIVIDE_COUNT) {
    throw new Error(`Expected ${DIVIDE_COUNT} divides. Found ${divideIds.size}.`);
  }

  if (nodeIds.size < 12) {
    throw new Error(`Insufficient 16-node expression coverage. Found ${nodeIds.size} distinct nodes.`);
  }

  return deepFreeze({
    valid: true,
    totalNodes: lattice.length,
    fullCoverage: true,
    regionCount: regionIds.size,
    divideCount: divideIds.size,
    nodeCoverage: nodeIds.size,
    profileId: profile.id,
  });
};

const createWorldKernel = (worldProfile = DEFAULT_WORLD_PROFILE) => {
  const profile = normalizeWorldProfile(worldProfile);
  const lattice = buildLattice(profile);
  const validation = validateKernel(lattice, profile);

  const kernel = {
    meta: deepFreeze({
      name: "GOLD_STANDARD_WORLD_KERNEL_G1",
      version: "1.1.0",
      sourceOfTruth: true,
      immutable: true,
      deterministic: true,
      latticeSize: GRID_SIZE,
      totalNodes: TOTAL_NODES,
      regionCount: REGION_COUNT,
      divideCount: DIVIDE_COUNT,
      nodeCount: NODE_COUNT,
      profileId: profile.id,
    }),
    constants: deepFreeze({
      GRID_SIZE,
      GRID_MIN,
      GRID_MAX,
      TOTAL_NODES,
      REGION_COUNT,
      DIVIDE_COUNT,
      NODE_COUNT,
      EPSILON,
      BOUNDARY_CLASSES,
      REGION_LABELS,
      DIVIDE_LABELS,
      NODE_LABELS_16,
      FORCE_WEIGHT_MATRIX,
      DEFAULT_THRESHOLDS,
    }),
    worldProfile: profile,
    lattice,
    api: deepFreeze({
      normalizeIndex,
      denormalizeIndex,
      normalizeWorldProfile,
      attractorScores,
      regionAssignment,
      divideFunction,
      computeRawFields,
      fieldNormalizationPipeline,
      forceComputation,
      nodeResolution,
      boundaryClassification,
      receiptShape,
      thresholdEvaluation,
      projectionFlat,
      projectionTree,
      projectionGlobe,
      createCell,
      buildLattice,
      validateKernel,
    }),
    validation,
  };

  return deepFreeze(kernel);
};

const WORLD_KERNEL = createWorldKernel();

export {
  GRID_SIZE,
  GRID_MIN,
  GRID_MAX,
  TOTAL_NODES,
  REGION_COUNT,
  DIVIDE_COUNT,
  NODE_COUNT,
  BOUNDARY_CLASSES,
  REGION_LABELS,
  DIVIDE_LABELS,
  NODE_LABELS_16,
  FORCE_WEIGHT_MATRIX,
  DEFAULT_WORLD_PROFILE,
  normalizeIndex,
  denormalizeIndex,
  normalizeWorldProfile,
  attractorScores,
  regionAssignment,
  divideFunction,
  computeRawFields,
  fieldNormalizationPipeline,
  forceComputation,
  nodeResolution,
  boundaryClassification,
  receiptShape,
  thresholdEvaluation,
  projectionFlat,
  projectionTree,
  projectionGlobe,
  createCell,
  buildLattice,
  validateKernel,
  createWorldKernel,
};

export default WORLD_KERNEL;
