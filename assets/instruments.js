DESTINATION: /assets/instruments.js
// /assets/instruments.js
// MODE: CONTRACT RENEWAL
// CONTRACT: INSTRUMENT_RUNTIME_ALIGNMENT_CONTRACT_G3
// STATUS: RUNTIME-ALIGNED | OBSERVATION-ONLY | NON-DRIFT | HOST-ALIGNED
// OWNER: SEAN

const INSTRUMENT_META = Object.freeze({
  name: "instruments",
  version: "G3",
  contract: "INSTRUMENT_RUNTIME_ALIGNMENT_CONTRACT_G3",
  role: "observation_only",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  platformOwned: true
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
  return trimmed.length > 0 ? trimmed : fallback;
}

function normalizeNumber(value, fallback = null) {
  return Number.isFinite(value) ? value : fallback;
}

function normalizeBoolean(value, fallback = null) {
  return typeof value === "boolean" ? value : fallback;
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
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
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
  const kind = normalizeString(render?.projection?.selectedProjection?.kind, "flat").toLowerCase();
  if (kind === "tree") return "tree";
  if (kind === "globe") return "globe";
  return "flat";
}

function normalizeSceneClass(runtime, render) {
  const candidates = [
    runtime?.sceneClass,
    runtime?.viewClass,
    render?.sceneClass,
    render?.viewClass
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value.toUpperCase();
  }

  return "UNSPECIFIED";
}

function normalizeUniverseMode(runtime, render) {
  const candidates = [
    runtime?.universeMode,
    runtime?.macroMode,
    render?.universeMode,
    render?.macroMode
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value.toUpperCase();
  }

  return "UNSPECIFIED";
}

function normalizeJsStamp(runtime, render) {
  const candidates = [
    runtime?.jsStamp,
    runtime?.buildStamp,
    runtime?.runtimeStamp,
    render?.jsStamp,
    render?.buildStamp,
    render?.runtimeStamp
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value;
  }

  return "—";
}

function normalizeHtmlStamp(runtime, render) {
  const candidates = [
    runtime?.htmlStamp,
    runtime?.pageStamp,
    render?.htmlStamp,
    render?.pageStamp
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value;
  }

  return "—";
}

function normalizePrimarySystemCount(runtime, render) {
  const candidates = [
    runtime?.primarySystemCount,
    runtime?.systemCount,
    render?.primarySystemCount,
    render?.systemCount,
    render?.primarySystems?.length
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = candidates[i];
    if (Number.isFinite(value)) return value;
  }

  return null;
}

function normalizePrimaryProminence(runtime, render) {
  const candidates = [
    runtime?.primaryProminence,
    render?.primaryProminence,
    render?.dominanceScore
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = stableRound(normalizeNumber(candidates[i]), 3);
    if (value !== null) return value;
  }

  return null;
}

function normalizeGalaxyBandState(runtime, render) {
  const candidates = [
    runtime?.galaxyBandState,
    runtime?.bandState,
    render?.galaxyBandState,
    render?.bandState
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value.toUpperCase();
  }

  return "UNSPECIFIED";
}

function normalizeCanvasAuthority(runtime, render) {
  const candidates = [
    runtime?.canvasAuthority,
    render?.canvasAuthority,
    render?.sceneAuthority
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeString(candidates[i], "");
    if (value !== "") return value.toUpperCase();
  }

  return "UNSPECIFIED";
}

function normalizeCanvasActive(runtime, render) {
  const candidates = [
    runtime?.canvasActive,
    runtime?.sceneActive,
    render?.canvasActive,
    render?.sceneActive
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeBoolean(candidates[i], null);
    if (value !== null) return value;
  }

  return null;
}

function normalizeCssFallbackActive(runtime, render) {
  const candidates = [
    runtime?.cssFallbackActive,
    render?.cssFallbackActive,
    render?.backgroundFallbackActive
  ];

  for (let i = 0; i < candidates.length; i += 1) {
    const value = normalizeBoolean(candidates[i], null);
    if (value !== null) return value;
  }

  return null;
}

function normalizeControlProjectionAlignment(runtime, render) {
  const runtimeProjection = normalizeProjectionState(runtime);
  const renderProjection = normalizeProjectionKind(render);
  return runtimeProjection === renderProjection ? "ALIGNED" : "DESYNC";
}

function classifyState({ runtime, render }) {
  const boundary = normalizeBoundary(runtime);
  const traversal = normalizeString(runtime?.traversalStatus?.action, "idle").toUpperCase();
  const receipt = normalizeString(runtime?.receipt?.timestamp, "—");
  const projectionAlignment = normalizeControlProjectionAlignment(runtime, render);
  const canvasActive = normalizeCanvasActive(runtime, render);
  const primarySystemCount = normalizePrimarySystemCount(runtime, render);

  if (boundary === "BLOCK") return "BLOCKED";
  if (traversal === "HALT") return "HALTED";
  if (receipt === "—") return "PENDING";
  if (projectionAlignment !== "ALIGNED") return "DESYNC";
  if (canvasActive === false) return "FALLBACK";
  if (primarySystemCount === 9) return "LIVE";
  return "ACTIVE";
}

function buildSummary({ runtime, render, classifiedState }) {
  const node = normalizeString(runtime?.node?.label);
  const region = normalizeString(runtime?.region?.label);
  const boundary = normalizeBoundary(runtime);
  const runtimeProjection = normalizeProjectionState(runtime);
  const renderProjection = normalizeProjectionKind(render);
  const sceneClass = normalizeSceneClass(runtime, render);
  const universeMode = normalizeUniverseMode(runtime, render);
  const primarySystemCount = stringifyValue(normalizePrimarySystemCount(runtime, render));
  const jsStamp = normalizeJsStamp(runtime, render);

  return deepFreeze({
    state: classifiedState,
    node,
    region,
    boundary,
    runtimeProjection,
    renderProjection,
    sceneClass,
    universeMode,
    primarySystemCount,
    jsStamp,
    line: [
      `STATE=${classifiedState}`,
      `SCENE=${sceneClass}`,
      `MODE=${universeMode}`,
      `SYSTEMS=${primarySystemCount}`,
      `JS=${jsStamp}`
    ].join(" | ")
  });
}

function buildDiagnostics({ runtime, render }) {
  const colorOutput = normalizeObject(render?.visible?.colorOutput);
  const emphasis = normalizeObject(render?.visible?.emphasis);
  const selectedProjection = normalizeObject(render?.projection?.selectedProjection);

  return deepFreeze({
    traversal: normalizeString(runtime?.traversalStatus?.action),
    receipt: normalizeString(runtime?.receipt?.timestamp),
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
    projectionRoot: normalizeNumber(selectedProjection.root),
    projectionLeaf: normalizeNumber(selectedProjection.leaf),
    projectionLongitude: stableRound(normalizeNumber(selectedProjection.longitude), 6),
    projectionLatitude: stableRound(normalizeNumber(selectedProjection.latitude), 6),
    jsStamp: normalizeJsStamp(runtime, render),
    htmlStamp: normalizeHtmlStamp(runtime, render),
    sceneClass: normalizeSceneClass(runtime, render),
    universeMode: normalizeUniverseMode(runtime, render),
    canvasAuthority: normalizeCanvasAuthority(runtime, render),
    canvasActive: normalizeCanvasActive(runtime, render),
    cssFallbackActive: normalizeCssFallbackActive(runtime, render),
    primarySystemCount: normalizePrimarySystemCount(runtime, render),
    primaryProminence: normalizePrimaryProminence(runtime, render),
    galaxyBandState: normalizeGalaxyBandState(runtime, render),
    controlRenderAlignment: normalizeControlProjectionAlignment(runtime, render)
  });
}

function buildMeta({ runtime, render }) {
  const selectedProjection = normalizeObject(render?.projection?.selectedProjection);

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
      receipt: normalizeString(runtime?.receipt?.timestamp),
      projectionState: normalizeProjectionState(runtime),
      sceneClass: normalizeSceneClass(runtime, render),
      universeMode: normalizeUniverseMode(runtime, render),
      jsStamp: normalizeJsStamp(runtime, render),
      htmlStamp: normalizeHtmlStamp(runtime, render),
      canvasAuthority: normalizeCanvasAuthority(runtime, render),
      canvasActive: normalizeCanvasActive(runtime, render),
      cssFallbackActive: normalizeCssFallbackActive(runtime, render),
      primarySystemCount: normalizePrimarySystemCount(runtime, render),
      primaryProminence: normalizePrimaryProminence(runtime, render),
      galaxyBandState: normalizeGalaxyBandState(runtime, render),
      controlRenderAlignment: normalizeControlProjectionAlignment(runtime, render)
    }),
    render: deepFreeze({
      hue: stableRound(normalizeNumber(render?.visible?.colorOutput?.hue), 3),
      saturation: stableRound(normalizeNumber(render?.visible?.colorOutput?.saturation), 3),
      value: stableRound(normalizeNumber(render?.visible?.colorOutput?.value), 3),
      projectionKind: normalizeProjectionKind(render),
      sceneClass: normalizeSceneClass(runtime, render),
      universeMode: normalizeUniverseMode(runtime, render),
      jsStamp: normalizeJsStamp(runtime, render),
      htmlStamp: normalizeHtmlStamp(runtime, render),
      canvasAuthority: normalizeCanvasAuthority(runtime, render),
      canvasActive: normalizeCanvasActive(runtime, render),
      cssFallbackActive: normalizeCssFallbackActive(runtime, render),
      primarySystemCount: normalizePrimarySystemCount(runtime, render),
      primaryProminence: normalizePrimaryProminence(runtime, render),
      galaxyBandState: normalizeGalaxyBandState(runtime, render),
      controlRenderAlignment: normalizeControlProjectionAlignment(runtime, render)
    }),
    projection: deepFreeze({
      kind: normalizeString(selectedProjection?.kind, "flat"),
      x: stableRound(normalizeNumber(selectedProjection?.x), 6),
      y: stableRound(normalizeNumber(selectedProjection?.y), 6),
      root: normalizeNumber(selectedProjection?.root),
      leaf: normalizeNumber(selectedProjection?.leaf),
      width: normalizeNumber(selectedProjection?.width),
      height: normalizeNumber(selectedProjection?.height),
      longitude: stableRound(normalizeNumber(selectedProjection?.longitude), 6),
      latitude: stableRound(normalizeNumber(selectedProjection?.latitude), 6)
    })
  });
}

export function buildInstrumentReceipt({
  runtimeState = null,
  renderState = null
} = {}) {
  const runtime = normalizeObject(runtimeState);
  const render = normalizeObject(renderState);
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
        `BOUNDARY=${stringifyValue(summary.boundary)} | NODE=${stringifyValue(summary.node)} | REGION=${stringifyValue(summary.region)}`,
        `CANVAS=${stringifyValue(diagnostics.canvasActive)} | CSS_FALLBACK=${stringifyValue(diagnostics.cssFallbackActive)} | AUTHORITY=${stringifyValue(diagnostics.canvasAuthority)}`,
        `ALIGNMENT=${stringifyValue(diagnostics.controlRenderAlignment)} | BAND=${stringifyValue(diagnostics.galaxyBandState)} | PROMINENCE=${stringifyValue(diagnostics.primaryProminence)}`,
        `JS=${stringifyValue(diagnostics.jsStamp)} | HTML=${stringifyValue(diagnostics.htmlStamp)}`
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

  return `
    <section data-panel="instruments">
      <div><b>STATE:</b> ${escapeHtml(stringifyValue(instrument.classifiedState))}</div>
      <div><b>SCENE:</b> ${escapeHtml(stringifyValue(summary.sceneClass))}</div>
      <div><b>MODE:</b> ${escapeHtml(stringifyValue(summary.universeMode))}</div>
      <div><b>SYSTEMS:</b> ${escapeHtml(stringifyValue(summary.primarySystemCount))}</div>
      <div><b>BOUNDARY:</b> ${escapeHtml(stringifyValue(summary.boundary))}</div>
      <div><b>NODE:</b> ${escapeHtml(stringifyValue(summary.node))}</div>
      <div><b>REGION:</b> ${escapeHtml(stringifyValue(summary.region))}</div>
      <div><b>RUNTIME PROJECTION:</b> ${escapeHtml(stringifyValue(summary.runtimeProjection))}</div>
      <div><b>RENDER PROJECTION:</b> ${escapeHtml(stringifyValue(summary.renderProjection))}</div>
      <div><b>ALIGNMENT:</b> ${escapeHtml(stringifyValue(diagnostics.controlRenderAlignment))}</div>
      <div><b>CANVAS ACTIVE:</b> ${escapeHtml(stringifyValue(diagnostics.canvasActive))}</div>
      <div><b>CSS FALLBACK:</b> ${escapeHtml(stringifyValue(diagnostics.cssFallbackActive))}</div>
      <div><b>CANVAS AUTHORITY:</b> ${escapeHtml(stringifyValue(diagnostics.canvasAuthority))}</div>
      <div><b>PRIMARY PROMINENCE:</b> ${escapeHtml(stringifyValue(diagnostics.primaryProminence))}</div>
      <div><b>GALAXY BAND:</b> ${escapeHtml(stringifyValue(diagnostics.galaxyBandState))}</div>
      <div><b>TRAVERSAL:</b> ${escapeHtml(stringifyValue(diagnostics.traversal))}</div>
      <div><b>RECEIPT:</b> ${escapeHtml(stringifyValue(diagnostics.receipt))}</div>
      <div><b>JS STAMP:</b> ${escapeHtml(stringifyValue(diagnostics.jsStamp))}</div>
      <div><b>HTML STAMP:</b> ${escapeHtml(stringifyValue(diagnostics.htmlStamp))}</div>
      <div><b>HSV:</b> ${escapeHtml(
        `${stringifyValue(diagnostics.hue)}, ${stringifyValue(diagnostics.saturation)}, ${stringifyValue(diagnostics.value)}`
      )}</div>
      <div><b>KERNEL:</b> ${escapeHtml(
        `(${stringifyValue(runtimeMeta.i)}, ${stringifyValue(runtimeMeta.j)})`
      )}</div>
      <div><b>DENSE:</b> ${escapeHtml(
        `(${stringifyValue(runtimeMeta.x)}, ${stringifyValue(runtimeMeta.y)})`
      )}</div>
      <div><b>PROJECTION META:</b> ${escapeHtml(
        [
          `kind=${stringifyValue(projectionMeta.kind)}`,
          `x=${stringifyValue(projectionMeta.x)}`,
          `y=${stringifyValue(projectionMeta.y)}`,
          `root=${stringifyValue(projectionMeta.root)}`,
          `leaf=${stringifyValue(projectionMeta.leaf)}`,
          `longitude=${stringifyValue(projectionMeta.longitude)}`,
          `latitude=${stringifyValue(projectionMeta.latitude)}`
        ].join(" | ")
      )}</div>
    </section>
  `.trim();
}

export function renderPanelText(packet = null) {
  const instrument = normalizeObject(packet);
  const summary = normalizeObject(instrument?.displayPayload?.summary);
  const diagnostics = normalizeObject(instrument?.diagnosticsPayload);
  const meta = normalizeObject(instrument?.meta);
  const runtimeMeta = normalizeObject(meta.runtime);

  return [
    `STATE=${stringifyValue(instrument.classifiedState)}`,
    `SCENE=${stringifyValue(summary.sceneClass)}`,
    `MODE=${stringifyValue(summary.universeMode)}`,
    `SYSTEMS=${stringifyValue(summary.primarySystemCount)}`,
    `BOUNDARY=${stringifyValue(summary.boundary)}`,
    `NODE=${stringifyValue(summary.node)}`,
    `REGION=${stringifyValue(summary.region)}`,
    `RUNTIME_PROJECTION=${stringifyValue(summary.runtimeProjection)}`,
    `RENDER_PROJECTION=${stringifyValue(summary.renderProjection)}`,
    `ALIGNMENT=${stringifyValue(diagnostics.controlRenderAlignment)}`,
    `CANVAS_ACTIVE=${stringifyValue(diagnostics.canvasActive)}`,
    `CSS_FALLBACK=${stringifyValue(diagnostics.cssFallbackActive)}`,
    `CANVAS_AUTHORITY=${stringifyValue(diagnostics.canvasAuthority)}`,
    `PRIMARY_PROMINENCE=${stringifyValue(diagnostics.primaryProminence)}`,
    `GALAXY_BAND=${stringifyValue(diagnostics.galaxyBandState)}`,
    `JS_STAMP=${stringifyValue(diagnostics.jsStamp)}`,
    `HTML_STAMP=${stringifyValue(diagnostics.htmlStamp)}`,
    `KERNEL=(${stringifyValue(runtimeMeta.i)},${stringifyValue(runtimeMeta.j)})`,
    `DENSE=(${stringifyValue(runtimeMeta.x)},${stringifyValue(runtimeMeta.y)})`
  ].join("\n");
}

export function createInstruments() {
  let last = null;

  return deepFreeze({
    meta: INSTRUMENT_META,

    update({
      runtimeState = null,
      renderState = null
    } = {}) {
      last = buildInstrumentReceipt({ runtimeState, renderState });
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
