// /assets/instruments.js
// MODE: CONTRACT EXECUTION
// CONTRACT: INSTRUMENT_BASELINE_CONTRACT_G1
// STATUS: OBSERVATION ONLY | DETERMINISTIC | NON-DRIFT | NO TRUTH AUTHORITY

const INSTRUMENT_META = Object.freeze({
  name: "instruments",
  version: "G1",
  contract: "INSTRUMENT_BASELINE_CONTRACT_G1",
  role: "observation_and_classification_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: false,
  kernelSubordinate: true,
});

const EMPTY = "—";

const CANONICAL_THRESHOLDS = Object.freeze({
  stateLattice: 256,
  admissibilityMembrane: 61,
  totalBurden: 451,
});

const deepFreeze = (value) => {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
};

const normalizeObject = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

const normalizeString = (value, fallback = EMPTY) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;

const normalizePrimitive = (value, fallback = EMPTY) => {
  if (value === null || value === undefined) return fallback;
  if (typeof value === "string") return normalizeString(value, fallback);
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : fallback;
  if (typeof value === "boolean") return value ? "true" : "false";
  return fallback;
};

const isFiniteNumber = (value) => typeof value === "number" && Number.isFinite(value);

const toFixedSafe = (value, digits = 3, fallback = EMPTY) =>
  isFiniteNumber(value) ? value.toFixed(digits) : fallback;

const escapeHTML = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const labelize = (key) =>
  key
    .replace(/([A-Z])/g, " $1")
    .replace(/_/g, " ")
    .replace(/^./, (s) => s.toUpperCase());

const renderKeyValueSection = (title, data) => {
  const rows = Object.entries(data).map(([key, value]) => {
    return `<div class="panel-row"><span class="panel-key">${escapeHTML(
      labelize(key),
    )}</span><span class="panel-value">${escapeHTML(normalizePrimitive(value))}</span></div>`;
  });

  return `<section class="panel-section"><h3 class="panel-title">${escapeHTML(
    title,
  )}</h3>${rows.join("")}</section>`;
};

const classifyState = ({
  validatorOk,
  traversalAction,
  boundaryClass,
  successorReceiptPresent,
}) => {
  if (validatorOk !== true) return "INVALID";
  if (traversalAction === "HALT") return "HALTED";
  if (boundaryClass === "BLOCK") return "BLOCKED";
  if (successorReceiptPresent === true) return "TRANSITION_READY";
  return "LIVE";
};

const normalizeRuntimeState = (value) => {
  const source = normalizeObject(value);
  const index = normalizeObject(source.index);
  const denseIndex = normalizeObject(source.denseIndex);
  const region = normalizeObject(source.region);
  const divide = normalizeObject(source.divide);
  const node = normalizeObject(source.node);
  const boundary = normalizeObject(source.boundary);
  const threshold = normalizeObject(source.threshold);
  const receipt = normalizeObject(source.receipt);
  const traversalStatus = normalizeObject(source.traversalStatus);
  const fields = normalizeObject(source.fields);
  const derived = normalizeObject(source.derived);
  const forces = normalizeObject(source.forces);
  const selectedProjection = normalizeObject(source.selectedProjection);

  return deepFreeze({
    index: deepFreeze({
      i: Number.isInteger(index.i) ? index.i : null,
      j: Number.isInteger(index.j) ? index.j : null,
    }),
    denseIndex: deepFreeze({
      x: Number.isInteger(denseIndex.x) ? denseIndex.x : null,
      y: Number.isInteger(denseIndex.y) ? denseIndex.y : null,
    }),
    projectionState: normalizeString(source.projectionState, "flat"),
    region: deepFreeze({
      regionId: region.regionId ?? null,
      label: normalizeString(region.label),
    }),
    divide: deepFreeze({
      divideId: divide.divideId ?? null,
      label: normalizeString(divide.label),
    }),
    node: deepFreeze({
      nodeId: node.nodeId ?? null,
      label: normalizeString(node.label),
    }),
    boundary: deepFreeze({
      classification: normalizeString(boundary.classification),
      score: boundary.score ?? null,
    }),
    threshold: deepFreeze({
      action: normalizeString(threshold.action),
      classification: normalizeString(threshold.classification),
    }),
    receipt: deepFreeze({
      state: deepFreeze({
        i: Number.isInteger(receipt?.state?.i) ? receipt.state.i : null,
        j: Number.isInteger(receipt?.state?.j) ? receipt.state.j : null,
      }),
      boundary: normalizePrimitive(receipt.boundary),
      timestamp: isFiniteNumber(receipt.timestamp) ? receipt.timestamp : null,
    }),
    successorReceipt: source.successorReceipt
      ? deepFreeze({
          state: deepFreeze({
            i: Number.isInteger(source.successorReceipt?.state?.i)
              ? source.successorReceipt.state.i
              : null,
            j: Number.isInteger(source.successorReceipt?.state?.j)
              ? source.successorReceipt.state.j
              : null,
          }),
          boundary: normalizePrimitive(source.successorReceipt.boundary),
          timestamp: isFiniteNumber(source.successorReceipt.timestamp)
            ? source.successorReceipt.timestamp
            : null,
        })
      : null,
    traversalStatus: deepFreeze({
      action: normalizeString(traversalStatus.action),
      admissible: traversalStatus.admissible === true,
      thresholdPass: traversalStatus.thresholdPass === true,
      boundaryPass: traversalStatus.boundaryPass === true,
      targetExists: traversalStatus.targetExists === true,
      targetLawful: traversalStatus.targetLawful === true,
    }),
    terrainClass: normalizeString(source.terrainClass),
    biomeType: normalizeString(source.biomeType),
    surfaceMaterial: normalizeString(source.surfaceMaterial),
    climateBand: normalizePrimitive(source.climateBand),
    climate: isFiniteNumber(source.climate) ? source.climate : null,
    moisture: isFiniteNumber(source.moisture) ? source.moisture : null,
    accumulation: isFiniteNumber(source.accumulation) ? source.accumulation : null,
    habitability: isFiniteNumber(source.habitability) ? source.habitability : null,
    traversalDifficulty: isFiniteNumber(source.traversalDifficulty)
      ? source.traversalDifficulty
      : null,
    fields: deepFreeze({
      coherence: fields.coherence ?? null,
      visibility: fields.visibility ?? null,
      frontier: fields.frontier ?? null,
      integration: fields.integration ?? null,
      boundaryPressure: fields.boundaryPressure ?? null,
    }),
    derived: deepFreeze({
      G: derived.G ?? null,
      GPrime: derived.GPrime ?? null,
    }),
    forces: deepFreeze({
      N: isFiniteNumber(forces.N) ? forces.N : null,
      E: isFiniteNumber(forces.E) ? forces.E : null,
      S: isFiniteNumber(forces.S) ? forces.S : null,
      W: isFiniteNumber(forces.W) ? forces.W : null,
      B: isFiniteNumber(forces.B) ? forces.B : null,
    }),
    motion: deepFreeze({
      dynamicIllumination: isFiniteNumber(source.dynamicIllumination)
        ? source.dynamicIllumination
        : null,
      dynamicCloudBias: isFiniteNumber(source.dynamicCloudBias)
        ? source.dynamicCloudBias
        : null,
      dynamicStormBias: isFiniteNumber(source.dynamicStormBias)
        ? source.dynamicStormBias
        : null,
      dynamicCurrentBias: isFiniteNumber(source.dynamicCurrentBias)
        ? source.dynamicCurrentBias
        : null,
      dynamicAuroraBias: isFiniteNumber(source.dynamicAuroraBias)
        ? source.dynamicAuroraBias
        : null,
      dynamicGlowBias: isFiniteNumber(source.dynamicGlowBias)
        ? source.dynamicGlowBias
        : null,
    }),
    selectedProjection: deepFreeze({
      x: selectedProjection.x ?? null,
      y: selectedProjection.y ?? null,
      z: selectedProjection.z ?? null,
      root: selectedProjection.root ?? null,
      branch: selectedProjection.branch ?? null,
      leaf: selectedProjection.leaf ?? null,
      lat: selectedProjection.lat ?? null,
      lon: selectedProjection.lon ?? null,
    }),
  });
};

const normalizeRenderState = (value) => {
  const source = normalizeObject(value);
  const validatorStatus = normalizeObject(source?.visible?.validatorStatus);
  const colorOutput = normalizeObject(source?.visible?.colorOutput);
  const motionOutput = normalizeObject(source?.visible?.motionOutput);
  const transitionVisibility = normalizeObject(source?.visible?.transitionVisibility);
  const nodeForceVisibility = normalizeObject(source?.visible?.nodeForceVisibility);
  const boundaryVisibility = normalizeObject(source?.visible?.boundaryVisibility);

  return deepFreeze({
    validatorOk: validatorStatus.ok === true,
    validatorChecks: normalizeObject(validatorStatus.checks),
    colorOutput: deepFreeze({
      terrainClass: normalizeString(colorOutput.terrainClass),
      biomeType: normalizeString(colorOutput.biomeType),
      hue: isFiniteNumber(colorOutput.hue) ? colorOutput.hue : null,
      saturation: isFiniteNumber(colorOutput.saturation) ? colorOutput.saturation : null,
      value: isFiniteNumber(colorOutput.value) ? colorOutput.value : null,
    }),
    luminanceOutput: isFiniteNumber(source?.visible?.luminanceOutput)
      ? source.visible.luminanceOutput
      : null,
    depthOutput: isFiniteNumber(source?.visible?.depthOutput) ? source.visible.depthOutput : null,
    motionOutput: deepFreeze({
      visible: motionOutput.visible === true,
      delta: isFiniteNumber(motionOutput.delta) ? motionOutput.delta : null,
    }),
    transitionVisibility: deepFreeze({
      visible: transitionVisibility.visible === true,
      admissible: transitionVisibility.admissible === true,
      lineage: transitionVisibility.lineage === true,
      sourceTimestamp: isFiniteNumber(transitionVisibility.sourceTimestamp)
        ? transitionVisibility.sourceTimestamp
        : null,
      successorTimestamp: isFiniteNumber(transitionVisibility.successorTimestamp)
        ? transitionVisibility.successorTimestamp
        : null,
      delta: isFiniteNumber(transitionVisibility.delta) ? transitionVisibility.delta : null,
    }),
    nodeForceVisibility: deepFreeze({
      nodeId: nodeForceVisibility.nodeId ?? null,
      nodeLabel: normalizeString(nodeForceVisibility.nodeLabel),
      dominantForce: normalizeString(nodeForceVisibility.dominantForce),
      secondaryForce: normalizeString(nodeForceVisibility.secondaryForce),
      dominantValue: isFiniteNumber(nodeForceVisibility.dominantValue)
        ? nodeForceVisibility.dominantValue
        : null,
      secondaryValue: isFiniteNumber(nodeForceVisibility.secondaryValue)
        ? nodeForceVisibility.secondaryValue
        : null,
    }),
    boundaryVisibility: deepFreeze({
      OPEN: boundaryVisibility.OPEN === true,
      HOLD: boundaryVisibility.HOLD === true,
      GATE: boundaryVisibility.GATE === true,
      BRIDGE: boundaryVisibility.BRIDGE === true,
      BLOCK: boundaryVisibility.BLOCK === true,
    }),
  });
};

export function buildInstrumentReceipt({
  runtimeState = null,
  renderState = null,
  authorityState = null,
  nowMs = null,
} = {}) {
  const runtime = normalizeRuntimeState(runtimeState);
  const render = normalizeRenderState(renderState);
  const authority = normalizeObject(authorityState);

  const successorReceiptPresent = runtime.successorReceipt !== null;
  const classifiedState = classifyState({
    validatorOk: render.validatorOk,
    traversalAction: runtime.traversalStatus.action,
    boundaryClass: runtime.boundary.classification,
    successorReceiptPresent,
  });

  const displayPayload = deepFreeze({
    baseline: deepFreeze({
      projection: runtime.projectionState,
      node: runtime.node.label,
      region: runtime.region.label,
      boundary: runtime.boundary.classification,
    }),
    progress: deepFreeze({
      action: runtime.traversalStatus.action,
      admissible: runtime.traversalStatus.admissible,
      successor: successorReceiptPresent,
      validatorOk: render.validatorOk,
    }),
    summary: deepFreeze({
      state: [
        `STATE=${classifiedState}`,
        `NODE=${runtime.node.label}`,
        `REGION=${runtime.region.label}`,
        `BOUNDARY=${runtime.boundary.classification}`,
      ].join(" | "),
      world: [
        `TERRAIN=${runtime.terrainClass}`,
        `BIOME=${runtime.biomeType}`,
        `SURFACE=${runtime.surfaceMaterial}`,
        `PROJECTION=${runtime.projectionState}`,
      ].join(" | "),
      extended: [
        `256=${CANONICAL_THRESHOLDS.stateLattice}`,
        `61=${CANONICAL_THRESHOLDS.admissibilityMembrane}`,
        `451=${CANONICAL_THRESHOLDS.totalBurden}`,
      ].join(" | "),
    }),
  });

  const diagnosticsPayload = deepFreeze({
    classifiedState,
    validatorOk: render.validatorOk,
    transitionVisible: render.transitionVisibility.visible,
    motionVisible: render.motionOutput.visible,
    receiptTimestamp: runtime.receipt.timestamp,
    successorTimestamp: runtime.successorReceipt ? runtime.successorReceipt.timestamp : null,
    nowMs: isFiniteNumber(nowMs) ? nowMs : null,
  });

  const meta = deepFreeze({
    runtime: deepFreeze({
      index: runtime.index,
      denseIndex: runtime.denseIndex,
      projectionState: runtime.projectionState,
      region: runtime.region,
      divide: runtime.divide,
      node: runtime.node,
      boundary: runtime.boundary,
      threshold: runtime.threshold,
      traversalStatus: runtime.traversalStatus,
      receipt: runtime.receipt,
      successorReceipt: runtime.successorReceipt,
    }),
    render: deepFreeze({
      validatorChecks: render.validatorChecks,
      colorOutput: render.colorOutput,
      luminanceOutput: render.luminanceOutput,
      depthOutput: render.depthOutput,
      motionOutput: render.motionOutput,
      transitionVisibility: render.transitionVisibility,
      nodeForceVisibility: render.nodeForceVisibility,
      boundaryVisibility: render.boundaryVisibility,
    }),
    authority: deepFreeze({
      runtimeSource: normalizeString(authority.runtimeSource, "/world/runtime.js"),
      renderSource: normalizeString(authority.renderSource, "/world/render.js"),
      instrumentSource: normalizeString(authority.instrumentSource, "/assets/instruments.js"),
    }),
    thresholds: CANONICAL_THRESHOLDS,
  });

  return deepFreeze({
    classifiedState,
    displayPayload,
    diagnosticsPayload,
    meta,
  });
}

export function buildInstrumentState(input = {}) {
  return buildInstrumentReceipt(input);
}

export function renderCompactBarHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument || runtime);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const baseline = normalizeObject(displayPayload.baseline);
  const progress = normalizeObject(displayPayload.progress);
  const summary = normalizeObject(displayPayload.summary);

  return `
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">State</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(instrument.classifiedState))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Projection</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.projection))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Node</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.node))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Region</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.region))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Boundary</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(baseline.boundary))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Action</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(progress.action))}</span>
      </span>
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Validator</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(progress.validatorOk))}</span>
      </span>
    </div>
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Summary</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(summary.state, EMPTY))}</span>
      </span>
    </div>
    <div class="diagnostic-bar__group">
      <span class="diagnostic-pill">
        <span class="diagnostic-pill__label">Canon</span>
        <span class="diagnostic-pill__value">${escapeHTML(normalizePrimitive(summary.extended, EMPTY))}</span>
      </span>
    </div>
  `.trim();
}

export function renderPanelHTML(runtime = {}) {
  const instrument = normalizeObject(runtime.instrument || runtime);
  const displayPayload = normalizeObject(instrument.displayPayload);
  const diagnosticsPayload = normalizeObject(instrument.diagnosticsPayload);
  const meta = normalizeObject(instrument.meta);

  const runtimeMeta = normalizeObject(meta.runtime);
  const renderMeta = normalizeObject(meta.render);
  const authority = normalizeObject(meta.authority);
  const thresholds = normalizeObject(meta.thresholds);

  const sections = [
    renderKeyValueSection(
      "Instrument",
      deepFreeze({
        classifiedState: normalizePrimitive(instrument.classifiedState),
        validatorOk: normalizePrimitive(diagnosticsPayload.validatorOk),
        transitionVisible: normalizePrimitive(diagnosticsPayload.transitionVisible),
        motionVisible: normalizePrimitive(diagnosticsPayload.motionVisible),
        receiptTimestamp: normalizePrimitive(diagnosticsPayload.receiptTimestamp),
        successorTimestamp: normalizePrimitive(diagnosticsPayload.successorTimestamp),
      }),
    ),
    renderKeyValueSection(
      "Baseline",
      deepFreeze({
        projection: normalizePrimitive(displayPayload?.baseline?.projection),
        node: normalizePrimitive(displayPayload?.baseline?.node),
        region: normalizePrimitive(displayPayload?.baseline?.region),
        boundary: normalizePrimitive(displayPayload?.baseline?.boundary),
      }),
    ),
    renderKeyValueSection(
      "Runtime",
      deepFreeze({
        kernelI: normalizePrimitive(runtimeMeta?.index?.i),
        kernelJ: normalizePrimitive(runtimeMeta?.index?.j),
        denseX: normalizePrimitive(runtimeMeta?.denseIndex?.x),
        denseY: normalizePrimitive(runtimeMeta?.denseIndex?.y),
        divide: normalizePrimitive(runtimeMeta?.divide?.label),
        thresholdAction: normalizePrimitive(runtimeMeta?.threshold?.action),
        traversalAction: normalizePrimitive(runtimeMeta?.traversalStatus?.action),
        admissible: normalizePrimitive(runtimeMeta?.traversalStatus?.admissible),
      }),
    ),
    renderKeyValueSection(
      "Render",
      deepFreeze({
        hue: toFixedSafe(renderMeta?.colorOutput?.hue, 3),
        saturation: toFixedSafe(renderMeta?.colorOutput?.saturation, 3),
        value: toFixedSafe(renderMeta?.colorOutput?.value, 3),
        luminance: toFixedSafe(renderMeta?.luminanceOutput, 3),
        depth: toFixedSafe(renderMeta?.depthOutput, 3),
        dominantForce: normalizePrimitive(renderMeta?.nodeForceVisibility?.dominantForce),
        secondaryForce: normalizePrimitive(renderMeta?.nodeForceVisibility?.secondaryForce),
      }),
    ),
    renderKeyValueSection(
      "Authority",
      deepFreeze({
        runtimeSource: normalizePrimitive(authority.runtimeSource),
        renderSource: normalizePrimitive(authority.renderSource),
        instrumentSource: normalizePrimitive(authority.instrumentSource),
      }),
    ),
    renderKeyValueSection(
      "Thresholds",
      deepFreeze({
        stateLattice256: normalizePrimitive(thresholds.stateLattice),
        admissibility61: normalizePrimitive(thresholds.admissibilityMembrane),
        totalBurden451: normalizePrimitive(thresholds.totalBurden),
      }),
    ),
  ];

  return sections.join("");
}

export function createInstruments() {
  let lastReceipt = null;

  function update(receipt) {
    lastReceipt = receipt && typeof receipt === "object" ? receipt : lastReceipt;
    return lastReceipt;
  }

  function read() {
    return lastReceipt;
  }

  function dispose() {
    lastReceipt = null;
  }

  return deepFreeze({
    meta: INSTRUMENT_META,
    update,
    read,
    dispose,
    buildInstrumentState,
    buildInstrumentReceipt,
    renderCompactBarHTML,
    renderPanelHTML,
  });
}

const DEFAULT_INSTRUMENTS = createInstruments();

export default DEFAULT_INSTRUMENTS;
