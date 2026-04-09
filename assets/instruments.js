const INSTRUMENT_META = Object.freeze({
  name: "instruments",
  version: "G1_EXTERNAL_EXPRESSION",
  contract: "INSTRUMENT_CONTRACT_G1",
  role: "diagnostic_shaping_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  mutatesDOM: false,
  platformOwned: true,
  pageNeutral: true
});

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.getOwnPropertyNames(value).forEach((key) => deepFreeze(value[key]));
  return Object.freeze(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "—") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length ? trimmed : fallback;
}

function normalizeNumber(value, fallback = null) {
  return Number.isFinite(value) ? value : fallback;
}

function stableRound(value, places = 3) {
  if (!Number.isFinite(value)) return null;
  const factor = Math.pow(10, places);
  return Math.round(value * factor) / factor;
}

function stringifyValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "string") return value.trim().length ? value : "—";
  return "—";
}

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function pickProjectionObject(render) {
  const projection = normalizeObject(normalizeObject(render).projection);
  const selected = normalizeObject(projection.selectedProjection);
  return selected.kind !== undefined ? selected : projection;
}

function normalizeBoundary(runtime) {
  const classification = normalizeString(
    normalizeObject(normalizeObject(runtime).boundary).classification,
    "OPEN"
  ).toUpperCase();

  if (classification === "BLOCK") return "BLOCK";
  if (classification === "HOLD") return "HOLD";
  if (classification === "GATE") return "GATE";
  if (classification === "BRIDGE") return "BRIDGE";
  return "OPEN";
}

function normalizeRuntimeProjection(runtime) {
  const projection = normalizeString(normalizeObject(runtime).projectionState, "flat").toLowerCase();
  if (projection === "tree") return "tree";
  if (projection === "globe") return "globe";
  return "flat";
}

function normalizeRenderProjection(render) {
  const kind = normalizeString(pickProjectionObject(render).kind, "flat").toLowerCase();
  if (kind === "tree") return "tree";
  if (kind === "globe") return "globe";
  return "flat";
}

function classifyState(runtime, render) {
  const receiptTimestamp = normalizeObject(normalizeObject(runtime).receipt).timestamp;
  const traversal = normalizeString(
    normalizeObject(normalizeObject(runtime).traversalStatus).action,
    "idle"
  ).toUpperCase();
  const boundary = normalizeBoundary(runtime);
  const runtimeProjection = normalizeRuntimeProjection(runtime);
  const renderProjection = normalizeRenderProjection(render);

  if (boundary === "BLOCK") return "BLOCKED";
  if (traversal === "HALT") return "HALTED";
  if (receiptTimestamp === null || receiptTimestamp === undefined) return "PENDING";
  if (runtimeProjection !== renderProjection) return "DESYNC";
  return "LIVE";
}

function normalizeForceVector(runtime) {
  const source = normalizeObject(runtime).forces;
  return {
    N: Number.isFinite(source.N) ? source.N : 0,
    E: Number.isFinite(source.E) ? source.E : 0,
    S: Number.isFinite(source.S) ? source.S : 0,
    W: Number.isFinite(source.W) ? source.W : 0,
    B: Number.isFinite(source.B) ? source.B : 0
  };
}

function computeSignalMetrics(runtime, render) {
  const forceVector = normalizeForceVector(runtime);
  const visible = normalizeObject(normalizeObject(render).visible);
  const color = normalizeObject(visible.colorOutput);

  const N = forceVector.N;
  const E = forceVector.E;
  const S = forceVector.S;
  const W = forceVector.W;
  const B = forceVector.B;

  const magnitude = Math.sqrt((E - W) ** 2 + (N - S) ** 2 + B ** 2);
  const fragmentWeight = Math.min(
    1,
    (Math.abs(N) + Math.abs(E) + Math.abs(S) + Math.abs(W) + Math.abs(B)) / 20
  );
  const directionalWeight = Math.min(1, (Math.abs(E - W) + Math.abs(N - S) + Math.abs(B)) / 10);
  const directionalContrast = Math.min(
    1,
    Math.max(Math.abs(E - W), Math.abs(N - S), Math.abs(B)) / 10
  );

  return deepFreeze({
    magnitude: stableRound(magnitude, 6),
    fragmentWeight: stableRound(fragmentWeight, 6),
    directionalWeight: stableRound(directionalWeight, 6),
    directionalContrast: stableRound(directionalContrast, 6),
    hue: stableRound(normalizeNumber(color.hue), 3),
    saturation: stableRound(normalizeNumber(color.saturation), 3),
    value: stableRound(normalizeNumber(color.value), 3),
    forces: deepFreeze({
      N: stableRound(N, 6),
      E: stableRound(E, 6),
      S: stableRound(S, 6),
      W: stableRound(W, 6),
      B: stableRound(B, 6)
    })
  });
}

function buildSummary(runtime, render, classifiedState) {
  const node = normalizeString(normalizeObject(normalizeObject(runtime).node).label);
  const region = normalizeString(normalizeObject(normalizeObject(runtime).region).label);
  const boundary = normalizeBoundary(runtime);
  const projection = normalizeRuntimeProjection(runtime);
  const projectionKind = normalizeRenderProjection(render);

  return deepFreeze({
    state: classifiedState,
    node,
    region,
    boundary,
    projection,
    projectionKind,
    line: [
      "STATE=" + classifiedState,
      "NODE=" + node,
      "REGION=" + region,
      "BOUNDARY=" + boundary,
      "PROJECTION=" + projection,
      "RENDER_KIND=" + projectionKind
    ].join(" | ")
  });
}

function buildDiagnostics(runtime, render) {
  const selectedProjection = pickProjectionObject(render);
  const visible = normalizeObject(normalizeObject(render).visible);
  const emphasis = normalizeObject(visible.emphasis);
  const signal = computeSignalMetrics(runtime, render);

  return deepFreeze({
    traversal: normalizeString(normalizeObject(normalizeObject(runtime).traversalStatus).action),
    receipt: (() => {
      const ts = normalizeObject(normalizeObject(runtime).receipt).timestamp;
      return ts === null || ts === undefined ? "—" : String(ts);
    })(),
    terrain: normalizeString(runtime.terrainClass),
    biome: normalizeString(runtime.biomeType),
    emphasisBoundary: normalizeString(emphasis.boundary, "—"),
    emphasisTerrain: normalizeString(emphasis.terrain, "—"),
    emphasisBiome: normalizeString(emphasis.biome, "—"),
    projectionKind: normalizeString(selectedProjection.kind, "flat"),
    projectionX: stableRound(normalizeNumber(selectedProjection.x), 6),
    projectionY: stableRound(normalizeNumber(selectedProjection.y), 6),
    projectionZ: stableRound(normalizeNumber(selectedProjection.z), 6),
    projectionLongitude: stableRound(normalizeNumber(selectedProjection.longitude), 6),
    projectionLatitude: stableRound(normalizeNumber(selectedProjection.latitude), 6),
    signal
  });
}

function buildMeta(runtime, render) {
  const projection = pickProjectionObject(render);
  const dense = normalizeObject(runtime.denseIndex);
  const index = normalizeObject(runtime.index);

  return deepFreeze({
    runtime: {
      i: normalizeNumber(index.i),
      j: normalizeNumber(index.j),
      x: normalizeNumber(dense.x),
      y: normalizeNumber(dense.y),
      region: normalizeString(normalizeObject(runtime.region).label),
      node: normalizeString(normalizeObject(runtime.node).label),
      boundary: normalizeBoundary(runtime),
      terrain: normalizeString(runtime.terrainClass),
      biome: normalizeString(runtime.biomeType),
      traversal: normalizeString(normalizeObject(runtime.traversalStatus).action),
      receipt: (() => {
        const ts = normalizeObject(normalizeObject(runtime).receipt).timestamp;
        return ts === null || ts === undefined ? "—" : String(ts);
      })(),
      projectionState: normalizeRuntimeProjection(runtime)
    },
    render: {
      projectionKind: normalizeRenderProjection(render)
    },
    projection: {
      kind: normalizeString(projection.kind, "flat"),
      x: stableRound(normalizeNumber(projection.x), 6),
      y: stableRound(normalizeNumber(projection.y), 6),
      z: stableRound(normalizeNumber(projection.z), 6),
      root: normalizeNumber(projection.root),
      leaf: normalizeNumber(projection.leaf),
      width: normalizeNumber(projection.width),
      height: normalizeNumber(projection.height),
      longitude: stableRound(normalizeNumber(projection.longitude), 6),
      latitude: stableRound(normalizeNumber(projection.latitude), 6)
    }
  });
}

function buildLifecycle(options = {}) {
  const prefix = normalizeString(options.eventPrefix, "ARC::INSTRUMENTS");
  const timestamp = options.timestamp === undefined ? "—" : String(options.timestamp);

  return deepFreeze({
    packet: prefix + "::packet::" + timestamp,
    update: prefix + "::update::" + timestamp,
    read: prefix + "::read::" + timestamp,
    dispose: prefix + "::dispose::" + timestamp
  });
}

export function buildInstrumentReceipt(options = {}) {
  const safeOptions = normalizeObject(options);
  const runtime = normalizeObject(safeOptions.runtimeState);
  const render = normalizeObject(safeOptions.renderState);

  const classifiedState = classifyState(runtime, render);
  const summary = buildSummary(runtime, render, classifiedState);
  const diagnostics = buildDiagnostics(runtime, render);
  const meta = buildMeta(runtime, render);
  const lifecycle = buildLifecycle({
    eventPrefix: safeOptions.eventPrefix,
    timestamp: normalizeObject(runtime.receipt).timestamp
  });

  return deepFreeze({
    classifiedState,
    displayPayload: {
      summary,
      lines: deepFreeze([
        summary.line,
        "TERRAIN=" + stringifyValue(diagnostics.terrain) + " | BIOME=" + stringifyValue(diagnostics.biome),
        "TRAVERSAL=" + stringifyValue(diagnostics.traversal) + " | RECEIPT=" + stringifyValue(diagnostics.receipt),
        "SIGNAL=(" +
          stringifyValue(diagnostics.signal.fragmentWeight) + "," +
          stringifyValue(diagnostics.signal.directionalWeight) + "," +
          stringifyValue(diagnostics.signal.directionalContrast) + ")"
      ])
    },
    diagnosticsPayload: diagnostics,
    lifecycle,
    meta
  });
}

export function renderPanelHTML(packet) {
  const instrument = normalizeObject(packet);
  const summary = normalizeObject(normalizeObject(instrument.displayPayload).summary);
  const diagnostics = normalizeObject(instrument.diagnosticsPayload);
  const meta = normalizeObject(instrument.meta);
  const runtimeMeta = normalizeObject(meta.runtime);
  const signal = normalizeObject(diagnostics.signal);

  const rows = [
    ["State", stringifyValue(instrument.classifiedState)],
    ["Node", stringifyValue(summary.node)],
    ["Region", stringifyValue(summary.region)],
    ["Boundary", stringifyValue(summary.boundary)],
    ["Projection", stringifyValue(summary.projection)],
    ["Render Kind", stringifyValue(summary.projectionKind)],
    ["Terrain", stringifyValue(diagnostics.terrain)],
    ["Biome", stringifyValue(diagnostics.biome)],
    ["Traversal", stringifyValue(diagnostics.traversal)],
    ["Receipt", stringifyValue(diagnostics.receipt)],
    ["Kernel", "(" + stringifyValue(runtimeMeta.i) + ", " + stringifyValue(runtimeMeta.j) + ")"],
    ["Dense", "(" + stringifyValue(runtimeMeta.x) + ", " + stringifyValue(runtimeMeta.y) + ")"],
    ["Signal", "(" + stringifyValue(signal.fragmentWeight) + ", " + stringifyValue(signal.directionalWeight) + ", " + stringifyValue(signal.directionalContrast) + ")"]
  ];

  return [
    '<section class="instrument-panel">',
    '<header class="instrument-panel__head">',
    '<div class="instrument-panel__eyebrow">Instruments</div>',
    '<h2 class="instrument-panel__title">' + escapeHtml(stringifyValue(instrument.classifiedState)) + "</h2>",
    "</header>",
    '<div class="instrument-panel__rows">',
    rows.map(function (pair) {
      return '<div class="instrument-row"><div class="instrument-row__k">' + escapeHtml(pair[0]) + '</div><div class="instrument-row__v">' + escapeHtml(pair[1]) + "</div></div>";
    }).join(""),
    "</div>",
    "</section>"
  ].join("");
}

export function renderPanelText(packet) {
  const instrument = normalizeObject(packet);
  const summary = normalizeObject(normalizeObject(instrument.displayPayload).summary);
  const diagnostics = normalizeObject(instrument.diagnosticsPayload);
  const meta = normalizeObject(instrument.meta);
  const runtimeMeta = normalizeObject(meta.runtime);

  return [
    "STATE=" + stringifyValue(instrument.classifiedState),
    "NODE=" + stringifyValue(summary.node),
    "REGION=" + stringifyValue(summary.region),
    "BOUNDARY=" + stringifyValue(summary.boundary),
    "PROJECTION=" + stringifyValue(summary.projection),
    "RENDER_KIND=" + stringifyValue(summary.projectionKind),
    "TERRAIN=" + stringifyValue(diagnostics.terrain),
    "BIOME=" + stringifyValue(diagnostics.biome),
    "TRAVERSAL=" + stringifyValue(diagnostics.traversal),
    "RECEIPT=" + stringifyValue(diagnostics.receipt),
    "KERNEL=(" + stringifyValue(runtimeMeta.i) + "," + stringifyValue(runtimeMeta.j) + ")",
    "DENSE=(" + stringifyValue(runtimeMeta.x) + "," + stringifyValue(runtimeMeta.y) + ")"
  ].join("\n");
}

export function createInstruments() {
  let last = null;

  const api = {
    meta: INSTRUMENT_META,

    update(options) {
      last = buildInstrumentReceipt(options || {});
      return last;
    },

    read() {
      return last;
    },

    dispose() {
      last = null;
    },

    buildInstrumentReceipt,
    renderPanelHTML,
    renderPanelText
  };

  return Object.freeze(api);
}

const DEFAULT = createInstruments();

export const meta = DEFAULT.meta;
export default DEFAULT;
