// /assets/instruments.js
// MODE: DIRECT DIAGNOSTIC AUTHORITY
// CONTRACT: INSTRUMENT_CONTRACT_G4
// STATUS: READ ONLY | PARSE SAFE | NON-DRIFT

const INSTRUMENT_META = Object.freeze({
  name: "instruments",
  version: "G4",
  contract: "INSTRUMENT_CONTRACT_G4",
  role: "diagnostic_shaping_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true
});

function deepFreeze(value) {
  if (value === null || typeof value !== "object" || Object.isFrozen(value)) return value;
  const keys = Object.getOwnPropertyNames(value);
  for (let i = 0; i < keys.length; i += 1) {
    deepFreeze(value[keys[i]]);
  }
  return Object.freeze(value);
}

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "—") {
  if (typeof value !== "string") return fallback;
  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeNumber(value, fallback = null) {
  return Number.isFinite(value) ? value : fallback;
}

function stableRound(value, places = 3) {
  if (!Number.isFinite(value)) return null;
  const factor = 10 ** places;
  return Math.round(value * factor) / factor;
}

function stringifyValue(value) {
  if (value === null || value === undefined) return "—";
  if (typeof value === "number") return Number.isFinite(value) ? String(value) : "—";
  if (typeof value === "boolean") return value ? "true" : "false";
  if (typeof value === "string") return value.trim().length > 0 ? value : "—";
  return "—";
}

function escapeHtml(value) {
  return String(value)
    .split("&").join("&amp;")
    .split("<").join("&lt;")
    .split(">").join("&gt;")
    .split('"').join("&quot;")
    .split("'").join("&#39;");
}

function normalizeBoundary(runtime) {
  const classification = normalizeString(runtime?.boundary?.classification, "OPEN").toUpperCase();
  if (classification === "BLOCK") return "BLOCK";
  if (classification === "HOLD") return "HOLD";
  if (classification === "GATE") return "GATE";
  if (classification === "BRIDGE") return "BRIDGE";
  return "OPEN";
}

function normalizeProjectionState(runtime) {
  const projection = normalizeString(runtime?.projectionState, "flat").toLowerCase();
  if (projection === "tree") return "tree";
  if (projection === "globe") return "globe";
  return "flat";
}

function normalizeProjectionKind(render) {
  const selected =
    normalizeObject(render?.projection?.selectedProjection).kind !== undefined
      ? normalizeObject(render?.projection?.selectedProjection)
      : normalizeObject(render?.projection);
  const kind = normalizeString(selected.kind, "flat").toLowerCase();
  if (kind === "tree") return "tree";
  if (kind === "globe") return "globe";
  return "flat";
}

function classifyState(input) {
  const runtime = normalizeObject(input.runtime);
  const render = normalizeObject(input.render);
  const receiptRaw = runtime?.receipt?.timestamp;
  const receipt = receiptRaw === null || receiptRaw === undefined ? "—" : String(receiptRaw);
  const traversal = normalizeString(runtime?.traversalStatus?.action, "idle").toUpperCase();
  const runtimeProjection = normalizeProjectionState(runtime);
  const renderProjection = normalizeProjectionKind(render);
  const boundary = normalizeBoundary(runtime);

  if (boundary === "BLOCK") return "BLOCKED";
  if (traversal === "HALT") return "HALTED";
  if (receipt === "—") return "PENDING";
  if (runtimeProjection !== renderProjection) return "DESYNC";
  return "LIVE";
}

function buildSummary(input) {
  const runtime = normalizeObject(input.runtime);
  const render = normalizeObject(input.render);
  const classifiedState = input.classifiedState;
  const node = normalizeString(runtime?.node?.label);
  const region = normalizeString(runtime?.region?.label);
  const boundary = normalizeBoundary(runtime);
  const projection = normalizeProjectionState(runtime);
  const projectionKind = normalizeProjectionKind(render);

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

function buildDiagnostics(input) {
  const runtime = normalizeObject(input.runtime);
  const render = normalizeObject(input.render);
  const colorOutput = normalizeObject(render?.visible?.colorOutput);
  const emphasis = normalizeObject(render?.visible?.emphasis);
  const selectedProjection =
    normalizeObject(render?.projection?.selectedProjection).kind !== undefined
      ? normalizeObject(render?.projection?.selectedProjection)
      : normalizeObject(render?.projection);

  return deepFreeze({
    traversal: normalizeString(runtime?.traversalStatus?.action),
    receipt:
      runtime?.receipt?.timestamp === null || runtime?.receipt?.timestamp === undefined
        ? "—"
        : String(runtime.receipt.timestamp),
    terrain: normalizeString(runtime?.terrainClass),
    biome: normalizeString(runtime?.biomeType),
    hue: stableRound(normalizeNumber(colorOutput.hue), 3),
    saturation: stableRound(normalizeNumber(colorOutput.saturation), 3),
    value: stableRound(normalizeNumber(colorOutput.value), 3),
    emphasisBoundary: normalizeString(emphasis.boundary),
    emphasisTerrain: normalizeString(emphasis.terrain),
    emphasisBiome: normalizeString(emphasis.biome),
    projectionKind: normalizeString(selectedProjection.kind, "flat"),
    projectionX: stableRound(normalizeNumber(selectedProjection.x), 6),
    projectionY: stableRound(normalizeNumber(selectedProjection.y), 6),
    projectionZ: stableRound(normalizeNumber(selectedProjection.z), 6),
    projectionRoot: normalizeNumber(selectedProjection.root),
    projectionLeaf: normalizeNumber(selectedProjection.leaf),
    projectionLongitude: stableRound(normalizeNumber(selectedProjection.longitude), 6),
    projectionLatitude: stableRound(normalizeNumber(selectedProjection.latitude), 6)
  });
}

function buildMeta(input) {
  const runtime = normalizeObject(input.runtime);
  const render = normalizeObject(input.render);
  const selectedProjection =
    normalizeObject(render?.projection?.selectedProjection).kind !== undefined
      ? normalizeObject(render?.projection?.selectedProjection)
      : normalizeObject(render?.projection);

  return deepFreeze({
    runtime: deepFreeze({
      i: normalizeNumber(runtime?.index?.i),
      j: normalizeNumber(runtime?.index?.j),
      x: normalizeNumber(runtime?.denseIndex?.x),
      y: normalizeNumber(runtime?.denseIndex?.y),
      region: normalizeString(runtime?.region?.label),
      node: normalizeString(runtime?.node?.label),
      boundary: normalizeBoundary(runtime),
      terrain: normalizeString(runtime?.terrainClass),
      biome: normalizeString(runtime?.biomeType),
      traversal: normalizeString(runtime?.traversalStatus?.action),
      receipt:
        runtime?.receipt?.timestamp === null || runtime?.receipt?.timestamp === undefined
          ? "—"
          : String(runtime.receipt.timestamp),
      projectionState: normalizeProjectionState(runtime)
    }),
    render: deepFreeze({
      hue: stableRound(normalizeNumber(render?.visible?.colorOutput?.hue), 3),
      saturation: stableRound(normalizeNumber(render?.visible?.colorOutput?.saturation), 3),
      value: stableRound(normalizeNumber(render?.visible?.colorOutput?.value), 3),
      projectionKind: normalizeProjectionKind(render)
    }),
    projection: deepFreeze({
      kind: normalizeString(selectedProjection.kind, "flat"),
      x: stableRound(normalizeNumber(selectedProjection.x), 6),
      y: stableRound(normalizeNumber(selectedProjection.y), 6),
      z: stableRound(normalizeNumber(selectedProjection.z), 6),
      root: normalizeNumber(selectedProjection.root),
      leaf: normalizeNumber(selectedProjection.leaf),
      width: normalizeNumber(selectedProjection.width),
      height: normalizeNumber(selectedProjection.height),
      longitude: stableRound(normalizeNumber(selectedProjection.longitude), 6),
      latitude: stableRound(normalizeNumber(selectedProjection.latitude), 6)
    })
  });
}

export function buildInstrumentReceipt(options = {}) {
  const runtime = normalizeObject(options.runtimeState);
  const render = normalizeObject(options.renderState);
  const classifiedState = classifyState({ runtime, render });
  const summary = buildSummary({ runtime, render, classifiedState });
  const diagnostics = buildDiagnostics({ runtime, render });
  const meta = buildMeta({ runtime, render });

  return deepFreeze({
    classifiedState,
    displayPayload: deepFreeze({
      summary,
      lines: deepFreeze([
        summary.line,
        "TERRAIN=" + stringifyValue(diagnostics.terrain) + " | BIOME=" + stringifyValue(diagnostics.biome),
        "TRAVERSAL=" + stringifyValue(diagnostics.traversal) + " | RECEIPT=" + stringifyValue(diagnostics.receipt),
        "HSV=(" + stringifyValue(diagnostics.hue) + "," + stringifyValue(diagnostics.saturation) + "," + stringifyValue(diagnostics.value) + ")"
      ])
    }),
    diagnosticsPayload: diagnostics,
    meta
  });
}

export function renderPanelHTML(packet = null) {
  const instrument = normalizeObject(packet);
  const summary = normalizeObject(instrument?.displayPayload?.summary);
  const diagnostics = normalizeObject(instrument?.diagnosticsPayload);
  const meta = normalizeObject(instrument?.meta);
  const runtimeMeta = normalizeObject(meta.runtime);
  const projectionMeta = normalizeObject(meta.projection);

  return [
    '<section data-panel="instruments">',
    "<div><b>STATE:</b> " + escapeHtml(stringifyValue(instrument.classifiedState)) + "</div>",
    "<div><b>NODE:</b> " + escapeHtml(stringifyValue(summary.node)) + "</div>",
    "<div><b>REGION:</b> " + escapeHtml(stringifyValue(summary.region)) + "</div>",
    "<div><b>BOUNDARY:</b> " + escapeHtml(stringifyValue(summary.boundary)) + "</div>",
    "<div><b>PROJECTION:</b> " + escapeHtml(stringifyValue(summary.projection)) + "</div>",
    "<div><b>RENDER KIND:</b> " + escapeHtml(stringifyValue(summary.projectionKind)) + "</div>",
    "<div><b>TERRAIN:</b> " + escapeHtml(stringifyValue(diagnostics.terrain)) + "</div>",
    "<div><b>BIOME:</b> " + escapeHtml(stringifyValue(diagnostics.biome)) + "</div>",
    "<div><b>TRAVERSAL:</b> " + escapeHtml(stringifyValue(diagnostics.traversal)) + "</div>",
    "<div><b>RECEIPT:</b> " + escapeHtml(stringifyValue(diagnostics.receipt)) + "</div>",
    "<div><b>HSV:</b> " + escapeHtml(
      stringifyValue(diagnostics.hue) + ", " +
      stringifyValue(diagnostics.saturation) + ", " +
      stringifyValue(diagnostics.value)
    ) + "</div>",
    "<div><b>KERNEL:</b> " + escapeHtml(
      "(" + stringifyValue(runtimeMeta.i) + ", " + stringifyValue(runtimeMeta.j) + ")"
    ) + "</div>",
    "<div><b>DENSE:</b> " + escapeHtml(
      "(" + stringifyValue(runtimeMeta.x) + ", " + stringifyValue(runtimeMeta.y) + ")"
    ) + "</div>",
    "<div><b>PROJECTION META:</b> " + escapeHtml([
      "kind=" + stringifyValue(projectionMeta.kind),
      "x=" + stringifyValue(projectionMeta.x),
      "y=" + stringifyValue(projectionMeta.y),
      "z=" + stringifyValue(projectionMeta.z),
      "root=" + stringifyValue(projectionMeta.root),
      "leaf=" + stringifyValue(projectionMeta.leaf),
      "longitude=" + stringifyValue(projectionMeta.longitude),
      "latitude=" + stringifyValue(projectionMeta.latitude)
    ].join(" | ")) + "</div>",
    "</section>"
  ].join("");
}

export function renderPanelText(packet = null) {
  const instrument = normalizeObject(packet);
  const summary = normalizeObject(instrument?.displayPayload?.summary);
  const diagnostics = normalizeObject(instrument?.diagnosticsPayload);
  const meta = normalizeObject(instrument?.meta);
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

  return deepFreeze({
    meta: INSTRUMENT_META,

    update(options = {}) {
      last = buildInstrumentReceipt(options);
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
  });
}

const DEFAULT = createInstruments();

export const meta = DEFAULT.meta;
export default DEFAULT;
