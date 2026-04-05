DESTINATION: /world/runtime.js
// /world/runtime.js
// MODE: CONTRACT EXECUTION
// CONTRACT: UNIVERSE_RUNTIME_CONTRACT_G2
// STATUS: ORCHESTRATION ONLY | DETERMINISTIC | NON-DRIFT | CANVAS-FIRST
// OWNER: SEAN

const RUNTIME_META = Object.freeze({
  name: "runtime",
  version: "G2_UNIVERSE",
  contract: "UNIVERSE_RUNTIME_CONTRACT_G2",
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
  STEP_MAX: 1,
  PRIMARY_SYSTEM_CODES: Object.freeze(["N", "NE", "E", "SE", "S", "SW", "W", "NW", "C"]),
  DEFAULT_WIDTH: 256,
  DEFAULT_HEIGHT: 256,
  DEFAULT_PRIMARY_SYSTEM_COUNT: 9
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

const normalizeArray = (value) => (Array.isArray(value) ? value : []);

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
  assert(RUNTIME_CONSTANTS.PROJECTIONS.includes(projection), "INVALID_PROJECTION");
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

const normalizeUniverseSample = (sample, x, y, index) => {
  const s = normalizeObject(sample);
  const receipt = normalizeObject(s.receipt);
  const threshold = normalizeObject(s.threshold);
  const boundary = normalizeObject(s.boundary);
  const force = normalizeObject(s.force);
  const projections = normalizeObject(s.projections);
  const region = normalizeObject(s.region);
  const divide = normalizeObject(s.divide);
  const node = normalizeObject(s.node);

  assert(Number.isInteger(s.i) && Number.isInteger(s.j), "INVALID_SAMPLE_KERNEL_INDEX");
  assert(receipt && typeof receipt === "object", "INVALID_SAMPLE_RECEIPT");
  assert(typeof boundary.classification === "string", "INVALID_SAMPLE_BOUNDARY");
  assert(typeof threshold.action === "string", "INVALID_SAMPLE_THRESHOLD");
  assert(force && typeof force === "object", "INVALID_SAMPLE_FORCE");
  assert(projections && typeof projections === "object", "INVALID_SAMPLE_PROJECTIONS");

  return deepFreeze({
    dense: deepFreeze({ x, y }),
    kernel: deepFreeze({ i: s.i, j: s.j }),
    order: index,
    code: String(s.code || RUNTIME_CONSTANTS.PRIMARY_SYSTEM_CODES[index] || `P${index + 1}`),
    region: deepFreeze({
      regionId: region.regionId || s.code || `REGION_${index + 1}`,
      label: region.label || "MACRO_UNIVERSE"
    }),
    divide: deepFreeze({
      divideId: divide.divideId || `DIVIDE_${index + 1}`,
      label: divide.label || "PRIMARY_FIELD"
    }),
    node: deepFreeze({
      nodeId: node.nodeId || s.code || `NODE_${index + 1}`,
      label: node.label || `${s.code || RUNTIME_CONSTANTS.PRIMARY_SYSTEM_CODES[index] || `P${index + 1}`}_SYSTEM`
    }),
    boundary: deepFreeze({
      classification: String(boundary.classification || "OPEN").toUpperCase(),
      label: String(boundary.label || "OPEN")
    }),
    force: deepFreeze({
      vector: deepFreeze({
        N: Number(normalizeObject(force.vector).N || 0),
        E: Number(normalizeObject(force.vector).E || 0),
        S: Number(normalizeObject(force.vector).S || 0),
        W: Number(normalizeObject(force.vector).W || 0),
        B: Number(normalizeObject(force.vector).B || 0)
      }),
      dominant: String(force.dominant || "N")
    }),
    terrainClass: String(s.terrainClass || "MACRO_UNIVERSE"),
    biomeType: String(s.biomeType || "UNIVERSE"),
    surfaceMaterial: String(s.surfaceMaterial || "VACUUM"),
    climateBand: s.climateBand ?? null,
    climate: Number(s.climate || 0),
    moisture: Number(s.moisture || 0),
    accumulation: Number(s.accumulation || 0),
    shorelineMask: Number(s.shorelineMask || 0),
    landMask: Number(s.landMask || 0),
    waterMask: Number(s.waterMask || 0),
    habitability: Number(s.habitability || 0),
    traversalDifficulty: Number(s.traversalDifficulty || 0),
    fields: deepFreeze(normalizeObject(s.fields)),
    derived: deepFreeze(normalizeObject(s.derived)),
    projections: deepFreeze(projections),
    receipt: deepFreeze(receipt),
    threshold: deepFreeze({
      action: String(threshold.action || "PASS").toUpperCase()
    }),
    dynamicIllumination: Number(s.dynamicIllumination || 1),
    dynamicCloudBias: Number(s.dynamicCloudBias || 0),
    dynamicStormBias: Number(s.dynamicStormBias || 0),
    dynamicCurrentBias: Number(s.dynamicCurrentBias || 0),
    dynamicAuroraBias: Number(s.dynamicAuroraBias || 0),
    dynamicGlowBias: Number(s.dynamicGlowBias || 1),
    motionState: deepFreeze(normalizeObject(s.motionState)),
    position: deepFreeze({
      x: Number(normalizeObject(s.position).x || 0),
      y: Number(normalizeObject(s.position).y || 0),
      z: Number(normalizeObject(s.position).z || 0)
    }),
    prominence: Number(s.prominence || 1),
    haloStrength: Number(s.haloStrength || 1),
    galaxyBandWeight: Number(s.galaxyBandWeight || 1)
  });
};

const buildDefaultUniverseField = (source = {}) => {
  const width =
    Number.isInteger(source.width) && source.width > 0
      ? source.width
      : RUNTIME_CONSTANTS.DEFAULT_WIDTH;
  const height =
    Number.isInteger(source.height) && source.height > 0
      ? source.height
      : RUNTIME_CONSTANTS.DEFAULT_HEIGHT;

  const cx = width * 0.5;
  const cy = height * 0.53;
  const r = Math.min(width, height) * 0.32;
  const d = r * 0.72;

  const anchors = [
    { code: "N", x: cx, y: cy - r },
    { code: "NE", x: cx + d, y: cy - d },
    { code: "E", x: cx + r, y: cy },
    { code: "SE", x: cx + d, y: cy + d },
    { code: "S", x: cx, y: cy + r },
    { code: "SW", x: cx - d, y: cy + d },
    { code: "W", x: cx - r, y: cy },
    { code: "NW", x: cx - d, y: cy - d },
    { code: "C", x: cx, y: cy }
  ];

  const samples = anchors.map((anchor, index) => {
    const ageBias = index / Math.max(anchors.length - 1, 1);
    const regionLabel = "MACRO_UNIVERSE";
    const nodeLabel = `${anchor.code}_SYSTEM`;

    return deepFreeze({
      i: index,
      j: 0,
      code: anchor.code,
      region: deepFreeze({
        regionId: regionLabel,
        label: regionLabel
      }),
      divide: deepFreeze({
        divideId: "PRIMARY_FIELD",
        label: "PRIMARY_FIELD"
      }),
      node: deepFreeze({
        nodeId: nodeLabel,
        label: nodeLabel
      }),
      boundary: deepFreeze({
        classification: "OPEN",
        label: "OPEN"
      }),
      force: deepFreeze({
        vector: deepFreeze({
          N: anchor.code.includes("N") ? 1 : 0,
          E: anchor.code.includes("E") ? 1 : 0,
          S: anchor.code.includes("S") ? 1 : 0,
          W: anchor.code.includes("W") ? 1 : 0,
          B: 1 - ageBias
        }),
        dominant: anchor.code === "C" ? "N" : anchor.code.charAt(0)
      }),
      terrainClass: "MACRO_UNIVERSE",
      biomeType: "UNIVERSE",
      surfaceMaterial: "VACUUM",
      climateBand: null,
      climate: 0,
      moisture: 0,
      accumulation: 0,
      shorelineMask: 0,
      landMask: 0,
      waterMask: 0,
      habitability: 0,
      traversalDifficulty: 0,
      fields: deepFreeze({
        primarySystemCount: 9,
        galaxyBandState: "STRONG",
        filterMode: "UNIVERSE_FIRST",
        filterTarget: "UNIVERSE"
      }),
      derived: deepFreeze({
        prominence: 1 - ageBias * 0.36,
        ageBias
      }),
      projections: deepFreeze({
        flat: deepFreeze({
          kind: "macro-universe-flat",
          x: anchor.x,
          y: anchor.y,
          width,
          height
        }),
        tree: deepFreeze({
          kind: "tree",
          root: 0,
          branch: anchor.code,
          leaf: index
        }),
        globe: deepFreeze({
          kind: "globe",
          x: (anchor.x - cx) / Math.max(r, 1),
          y: (anchor.y - cy) / Math.max(r, 1),
          z: 0
        })
      }),
      receipt: deepFreeze({
        state: deepFreeze({ i: index, j: 0 }),
        region: deepFreeze({
          regionId: regionLabel,
          label: regionLabel
        }),
        node: deepFreeze({
          nodeId: nodeLabel,
          label: nodeLabel
        }),
        forces: deepFreeze({
          N: anchor.code.includes("N") ? 1 : 0,
          E: anchor.code.includes("E") ? 1 : 0,
          S: anchor.code.includes("S") ? 1 : 0,
          W: anchor.code.includes("W") ? 1 : 0,
          B: 1 - ageBias
        }),
        boundary: "OPEN",
        timestamp: 0
      }),
      threshold: deepFreeze({
        action: "PASS"
      }),
      dynamicIllumination: 1,
      dynamicCloudBias: 0,
      dynamicStormBias: 0,
      dynamicCurrentBias: 0,
      dynamicAuroraBias: 0,
      dynamicGlowBias: 1,
      motionState: deepFreeze({}),
      position: deepFreeze({
        x: anchor.x,
        y: anchor.y,
        z: 0
      }),
      prominence: 1 - ageBias * 0.36,
      haloStrength: 1 - ageBias * 0.28,
      galaxyBandWeight: 1 - ageBias * 0.18
    });
  });

  const normalizedRows = [deepFreeze(samples)];
  const byDenseKey = {};
  const byKernelReceiptKey = {};

  samples.forEach((sample, x) => {
    const normalizedSample = normalizeUniverseSample(sample, x, 0, x);
    byDenseKey[`${x},0`] = normalizedSample;
    byKernelReceiptKey[`${normalizedSample.kernel.i},${normalizedSample.kernel.j}`] = normalizedSample;
    normalizedRows[0] = Object.freeze([...(normalizedRows[0] || []).slice(0, x), normalizedSample, ...(normalizedRows[0] || []).slice(x + 1)]);
  });

  return deepFreeze({
    width: samples.length,
    height: 1,
    samples: deepFreeze([deepFreeze(samples.map((sample, x) => normalizeUniverseSample(sample, x, 0, x)))]),
    byDenseKey: deepFreeze(
      samples.reduce((acc, sample, x) => {
        const normalizedSample = normalizeUniverseSample(sample, x, 0, x);
        acc[`${x},0`] = normalizedSample;
        return acc;
      }, {})
    ),
    byKernelReceiptKey: deepFreeze(
      samples.reduce((acc, sample, x) => {
        const normalizedSample = normalizeUniverseSample(sample, x, 0, x);
        acc[`${normalizedSample.kernel.i},${normalizedSample.kernel.j}`] = normalizedSample;
        return acc;
      }, {})
    ),
    summary: deepFreeze({
      sceneClass: "MACRO_UNIVERSE",
      filterMode: "UNIVERSE_FIRST",
      filterTarget: "UNIVERSE",
      primarySystemCount: 9,
      defaultCursor: deepFreeze({ x: 8, y: 0 }),
      width,
      height
    }),
    motionContract: deepFreeze({
      mode: "PRIMARY_SYSTEM_SELECTION"
    }),
    timeState: deepFreeze({
      elapsedSeconds: 0
    })
  });
};

const normalizeUniverseField = (universeField) => {
  const field = normalizeObject(universeField);
  if (!Array.isArray(field.samples) || field.samples.length === 0) {
    return buildDefaultUniverseField(field);
  }

  const samples = Array.isArray(field.samples) ? field.samples : null;
  assert(samples && samples.length > 0, "INVALID_UNIVERSE_FIELD_SAMPLES");

  const height = typeof field.height === "number" ? field.height : samples.length;
  const width =
    typeof field.width === "number"
      ? field.width
      : Array.isArray(samples[0])
        ? samples[0].length
        : 0;

  assert(Number.isInteger(width) && width > 0, "INVALID_UNIVERSE_FIELD_WIDTH");
  assert(Number.isInteger(height) && height > 0, "INVALID_UNIVERSE_FIELD_HEIGHT");
  assert(samples.length === height, "UNIVERSE_FIELD_HEIGHT_MISMATCH");

  const normalizedRows = [];
  const byDenseKey = {};
  const byKernelReceiptKey = {};

  let order = 0;
  for (let y = 0; y < height; y += 1) {
    const row = samples[y];
    assert(Array.isArray(row), "INVALID_UNIVERSE_FIELD_ROW");
    assert(row.length === width, "UNIVERSE_FIELD_WIDTH_MISMATCH");

    const normalizedRow = [];
    for (let x = 0; x < width; x += 1) {
      const normalizedSample = normalizeUniverseSample(row[x], x, y, order);
      order += 1;
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

const buildProjectionPackets = (sample) =>
  deepFreeze({
    flat: normalizeObject(sample.projections).flat || null,
    tree: normalizeObject(sample.projections).tree || null,
    globe: normalizeObject(sample.projections).globe || null
  });

const selectProjectionPacket = (projectionPackets, projectionState) =>
  projectionPackets[projectionState] || null;

const buildCurrentStatePacket = (sample, projectionState, traversalStatus, field) => {
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
    visualLight: sample.dynamicIllumination,
    sceneClass: "MACRO_UNIVERSE",
    universeMode: "UNIVERSE_FIRST",
    filterTarget: "UNIVERSE",
    primarySystemCount: Number(normalizeObject(field.summary).primarySystemCount || 9),
    primaryProminence: Number(sample.prominence || 1),
    galaxyBandState: "STRONG",
    jsStamp: "RUNTIME_G2_UNIVERSE",
    htmlStamp: "INDEX_HTML_ACTIVE",
    canvasAuthority: "CANVAS_FIRST",
    canvasActive: true,
    cssFallbackActive: false
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
    traversalStatus,
    field
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

const buildFacade = (stateRef, frameStateRef) => {
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
        buildTraversalStatus(sample, null),
        stateRef.current.field
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

      const nextField = normalizeUniverseField(
        hasOwn(next, "universeField")
          ? next.universeField
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

  const frameStateRef = {
    current: normalizeFrameState(source.frameState)
  };

  const initialProjectionState = normalizeProjection(source.projection || "flat");
  const field = normalizeUniverseField(source.universeField || source.planetField || null);
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

  return buildFacade(stateRef, frameStateRef);
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
      height: Number(field.height || 0),
      primarySystemCount: Number(normalizeObject(field.summary).primarySystemCount || 9)
    }),
    terrainClass: currentState.terrainClass || null,
    biomeType: currentState.biomeType || null,
    surfaceMaterial: currentState.surfaceMaterial || null,
    climateBand: currentState.climateBand || null,
    climate: currentState.climate || null,
    moisture: currentState.moisture ?? null,
    accumulation: currentState.accumulation ?? null,
    shorelineMask: currentState.shorelineMask ?? null,
    landMask: currentState.landMask ?? null,
    waterMask: currentState.waterMask ?? null,
    habitability: currentState.habitability ?? null,
    traversalDifficulty: currentState.traversalDifficulty ?? null,
    sceneClass: currentState.sceneClass || "MACRO_UNIVERSE",
    universeMode: currentState.universeMode || "UNIVERSE_FIRST",
    filterTarget: currentState.filterTarget || "UNIVERSE",
    primarySystemCount: currentState.primarySystemCount ?? 9,
    primaryProminence: currentState.primaryProminence ?? 1,
    galaxyBandState: currentState.galaxyBandState || "STRONG",
    jsStamp: currentState.jsStamp || "RUNTIME_G2_UNIVERSE",
    htmlStamp: currentState.htmlStamp || "INDEX_HTML_ACTIVE",
    canvasAuthority: currentState.canvasAuthority || "CANVAS_FIRST",
    canvasActive: currentState.canvasActive !== false,
    cssFallbackActive: currentState.cssFallbackActive === true
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
