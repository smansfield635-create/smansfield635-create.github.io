/* ==========================================================================
   Diamond Gate Bridge · Instruments Asset Layer
   GAUGES_B6_SEMANTIC_SEPARATOR_PATCH
   PATH: /assets/instruments.js

   PURPOSE:
   - Preserve the existing page-neutral instrument receipt API.
   - Preserve reusable Gauges dashboard data, semantics, colors, routes, and render helpers.
   - Improve copied-text, screen-reader, and audit-read spacing.
   - Keep Gauges as an asset-driven instrument contract rather than page-local duplication.

   BOUNDARY:
   - This file does not mutate DOM.
   - This file does not own page layout.
   - This file does not use GraphicBox.
   - This file does not use generated images.
   - This file exposes data and render helpers only.
========================================================================== */

const INSTRUMENT_META = deepFreeze({
  name: "instruments",
  version: "G2_GAUGES_B6_SEMANTIC_SEPARATOR_PATCH",
  contract: "INSTRUMENT_CONTRACT_G2",
  role: "diagnostic_shaping_and_gauge_asset_layer",
  deterministic: true,
  sourceOfTruth: false,
  mutatesState: false,
  mutatesDOM: false,
  platformOwned: true,
  pageNeutral: true
});

export const GAUGES_META = deepFreeze({
  name: "gauges",
  version: "GAUGES_TRUE_INSTRUMENT_ROOM_B6",
  role: "site_health_instrument_contract",
  readMode: "compact_engineer_dashboard_plus_ted_talk",
  activePageGoldRule: true,
  pageRelativeGold: "gauges",
  operatingRule: "speed_efficiency_optimum_nature",
  semanticSeparator: " | "
});

export const GAUGE_ROUTES = deepFreeze({
  compass: "/",
  door: "/door/",
  products: "/products/",
  gauges: "/gauges/",
  showroom: "/showroom/",
  vault: "/products/archcoin/",
  upperRoom: "/big-laugh/upper-room/"
});

export const GAUGE_COLOR_STATES = deepFreeze({
  healthy: {
    label: "Healthy",
    semanticLabel: "Healthy status",
    cssVar: "--green",
    tone: "#93efbd",
    meaning: "Working cleanly."
  },
  active: {
    label: "Active",
    semanticLabel: "Active priority",
    cssVar: "--gold",
    tone: "#ffd98a",
    meaning: "Current page or priority instrument."
  },
  proof: {
    label: "Proof",
    semanticLabel: "Proof signal",
    cssVar: "--blue",
    tone: "#8ec5ff",
    meaning: "Stable signal requiring live confirmation."
  },
  watch: {
    label: "Watch",
    semanticLabel: "Watch item",
    cssVar: "--yellow",
    tone: "#ffcf7a",
    meaning: "Strong concept, needs inspection."
  },
  break: {
    label: "Break",
    semanticLabel: "Break condition",
    cssVar: "--red",
    tone: "#ff6f78",
    meaning: "Urgent failure or broken path."
  },
  complex: {
    label: "Complex",
    semanticLabel: "Complex item",
    cssVar: "--purple",
    tone: "#caa8ff",
    meaning: "Valid but interpretation-heavy."
  }
});

export const GAUGE_READINGS = deepFreeze([
  {
    id: "G01",
    key: "routeIntegrity",
    title: "Route Integrity",
    value: 96,
    state: "active",
    label: "Optimal",
    needle: 78,
    meaning: "Primary route movement is clean and fast.",
    receipt: ["ROUTE_INTEGRITY=96 | STATUS=ACTIVE_PRIORITY"]
  },
  {
    id: "G02",
    key: "backlinkIntegrity",
    title: "Backlink Integrity",
    value: 91,
    state: "healthy",
    label: "Healthy",
    needle: 66,
    meaning: "Canonical product destinations are mostly unified.",
    receipt: ["BACKLINK_CANONICALITY=91 | RULE=ONE_DESTINATION"]
  },
  {
    id: "G03",
    key: "renderStability",
    title: "Render Stability",
    value: 88,
    state: "proof",
    label: "Proof",
    needle: 58,
    meaning: "Page surfaces are coherent; screenshots still matter.",
    receipt: ["RENDER_STABILITY=88 | NEXT=LIVE_RENDER_INSPECTION"]
  },
  {
    id: "G04",
    key: "productConnectivity",
    title: "Product Connectivity",
    value: 94,
    state: "healthy",
    label: "Locked",
    needle: 70,
    meaning: "Products source chamber coordinates the product rooms.",
    receipt: ["PRODUCT_DESTINATION_LOCK=94 | ROOM=SOURCE_CHAMBER"]
  },
  {
    id: "G05",
    key: "archcoinVaultHealth",
    title: "Vault / ARCHCOIN",
    value: 82,
    state: "watch",
    label: "Watch",
    needle: 42,
    meaning: "Vault is strong; final live render needs confirmation.",
    receipt: ["ARCHCOIN_VAULT_HEALTH=82 | WATCH=JS_RUNTIME_RENDER"]
  },
  {
    id: "G06",
    key: "showroomHealth",
    title: "Showroom Health",
    value: 86,
    state: "proof",
    label: "Proof",
    needle: 52,
    meaning: "Showroom remains the public proof window.",
    receipt: ["SHOWROOM_HEALTH=86 | ROLE=PROOF_WINDOW"]
  },
  {
    id: "G07",
    key: "upperRoomEvents",
    title: "Upper Room Events",
    value: 77,
    state: "complex",
    label: "Complex",
    needle: 32,
    meaning: "Event logic is rich; public pathway should stay simple.",
    receipt: ["EVENT_HEALTH=77 | INTERPRETATION_REQUIRED=TRUE"]
  },
  {
    id: "G08",
    key: "systemStability",
    title: "System Stability",
    value: 90,
    state: "healthy",
    label: "Stable",
    needle: 62,
    meaning: "Room identities, route law, and products are aligned.",
    receipt: ["SYSTEM_STABILITY=90 | STATE=COHERENT"]
  }
]);

export const GAUGE_TED_READ = deepFreeze({
  eyebrow: "TED Talk read",
  title: "What the gauges mean.",
  thesis:
    "The Manor is healthy when each room has one clear destination, each backlink returns correctly, each product opens into its proper chamber, and each public surface tells the visitor where they are standing.",
  support:
    "The engineer wall gives the readings. This side translates those readings into the next practical move.",
  cards: [
    {
      state: "healthy",
      eyebrow: "Healthy",
      title: "The route law is working.",
      copy:
        "Products is behaving like a source chamber. The main product paths are no longer scattered across competing bodies."
    },
    {
      state: "proof",
      eyebrow: "Proof",
      title: "The public rooms are becoming places.",
      copy:
        "Showroom, Compass, Products, AAI, ESL, Nutrition, and ARCHCOIN now carry stronger physical identities inside the Manor."
    },
    {
      state: "active",
      eyebrow: "Priority",
      title: "Gauges is useful, not decorative.",
      copy:
        "This page shows what is connected, what is stable, what needs inspection, and what should be patched next."
    },
    {
      state: "complex",
      eyebrow: "Complex",
      title: "Some rooms need interpretation.",
      copy:
        "Upper Room and ARCHCOIN contain more moving parts. They should be judged by live render, not by concept alone."
    }
  ],
  nextAction: {
    title: "Next practical move",
    copy:
      "Inspect live render before patching. If a page visually fails, patch that page only. Do not rebuild route law unless a real backlink fails.",
    receipt: [
      "GAUGES_TRUE_INSTRUMENT_ROOM_B6=ACTIVE | ROUTE_INTEGRITY=96 | BACKLINK_CANONICALITY=91 | RENDER_STABILITY=88 | PRODUCT_DESTINATION_LOCK=94 | NEXT_ACTION=INSPECT_LIVE_RENDER_BEFORE_PATCH"
    ]
  }
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
  if (typeof value === "string") return value.trim().length ? value.trim() : "—";
  return "—";
}

function escapeHtml(value) {
  return String(value ?? "—")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function clampNumber(value, min, max, fallback) {
  const number = Number.isFinite(value) ? value : fallback;
  return Math.min(max, Math.max(min, number));
}

function semanticJoin(lines, separator = " | ") {
  if (!Array.isArray(lines)) return "";
  return lines
    .map((line) => normalizeString(line, ""))
    .filter(Boolean)
    .join(separator);
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
  const fragmentWeight = Math.min(1, (Math.abs(N) + Math.abs(E) + Math.abs(S) + Math.abs(W) + Math.abs(B)) / 20);
  const directionalWeight = Math.min(1, (Math.abs(E - W) + Math.abs(N - S) + Math.abs(B)) / 10);
  const directionalContrast = Math.min(1, Math.max(Math.abs(E - W), Math.abs(N - S), Math.abs(B)) / 10);

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

function normalizeGaugeReading(reading) {
  const safeReading = normalizeObject(reading);
  const state = normalizeString(safeReading.state, "healthy").toLowerCase();
  const colorState = GAUGE_COLOR_STATES[state] ? state : "healthy";
  const receipt = Array.isArray(safeReading.receipt)
    ? safeReading.receipt.map((line) => normalizeString(line)).filter((line) => line !== "—")
    : [];

  return deepFreeze({
    id: normalizeString(safeReading.id, "G00"),
    key: normalizeString(safeReading.key, "unknown"),
    title: normalizeString(safeReading.title, "Unnamed Gauge"),
    value: clampNumber(Number(safeReading.value), 0, 100, 0),
    state: colorState,
    label: normalizeString(safeReading.label, GAUGE_COLOR_STATES[colorState].label),
    semanticLabel: normalizeString(safeReading.semanticLabel, GAUGE_COLOR_STATES[colorState].semanticLabel),
    needle: clampNumber(Number(safeReading.needle), -48, 86, 0),
    meaning: normalizeString(safeReading.meaning, "No gauge meaning supplied."),
    receipt: deepFreeze(receipt),
    receiptText: semanticJoin(receipt),
    semanticText:
      normalizeString(safeReading.id, "G00") +
      " | " +
      normalizeString(safeReading.title, "Unnamed Gauge") +
      " | VALUE=" +
      stringifyValue(clampNumber(Number(safeReading.value), 0, 100, 0)) +
      " | STATE=" +
      colorState.toUpperCase()
  });
}

function mergeGaugeReadings(overrides = {}) {
  const safeOverrides = normalizeObject(overrides);

  return deepFreeze(
    GAUGE_READINGS.map((reading) => {
      const override = normalizeObject(safeOverrides[reading.key]);

      return normalizeGaugeReading({
        ...reading,
        ...override,
        receipt: Array.isArray(override.receipt) ? override.receipt : reading.receipt
      });
    })
  );
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
          stringifyValue(diagnostics.signal.fragmentWeight) +
          "," +
          stringifyValue(diagnostics.signal.directionalWeight) +
          "," +
          stringifyValue(diagnostics.signal.directionalContrast) +
          ")"
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
    [
      "Signal",
      "(" +
        stringifyValue(signal.fragmentWeight) +
        ", " +
        stringifyValue(signal.directionalWeight) +
        ", " +
        stringifyValue(signal.directionalContrast) +
        ")"
    ]
  ];

  return [
    '<section class="instrument-panel" aria-label="Instrument receipt">',
    '<p class="instrument-panel__eyebrow">Instruments</p>',
    '<h2 class="instrument-panel__title">' + escapeHtml(stringifyValue(instrument.classifiedState)) + "</h2>",
    '<dl class="instrument-panel__rows">',
    rows
      .map(function (pair) {
        return (
          '<div class="instrument-panel__row">' +
          "<dt>" +
          escapeHtml(pair[0]) +
          "</dt>" +
          "<dd>" +
          escapeHtml(pair[1]) +
          "</dd>" +
          "</div>"
        );
      })
      .join(""),
    "</dl>",
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

export function buildGaugeDashboardPacket(options = {}) {
  const safeOptions = normalizeObject(options);
  const readings = mergeGaugeReadings(safeOptions.overrides);
  const activePage = normalizeString(safeOptions.activePage, "gauges").toLowerCase();

  const average = stableRound(
    readings.reduce((sum, item) => sum + item.value, 0) / Math.max(readings.length, 1),
    2
  );

  const watchItems = readings.filter((item) => item.state === "watch" || item.state === "complex" || item.state === "break");

  const legendText = Object.keys(GAUGE_COLOR_STATES)
    .map((key) => GAUGE_COLOR_STATES[key].semanticLabel)
    .join(" | ");

  return deepFreeze({
    meta: GAUGES_META,
    routes: GAUGE_ROUTES,
    colorStates: GAUGE_COLOR_STATES,
    activePage,
    readings,
    tedRead: GAUGE_TED_READ,
    semantic: {
      legendText,
      receiptSeparator: GAUGES_META.semanticSeparator,
      routeText: "Compass | Door | Products | Showroom | Vault | Upper Room"
    },
    summary: {
      average,
      watchCount: watchItems.length,
      watchKeys: deepFreeze(watchItems.map((item) => item.key)),
      line:
        "GAUGES_AVERAGE=" +
        stringifyValue(average) +
        " | WATCH_COUNT=" +
        stringifyValue(watchItems.length) +
        " | ACTIVE_PAGE=" +
        activePage
    }
  });
}

export function renderGaugeCardHTML(reading) {
  const gauge = normalizeGaugeReading(reading);
  const color = GAUGE_COLOR_STATES[gauge.state] || GAUGE_COLOR_STATES.healthy;

  return [
    '<article class="gaugeCard' + (gauge.state === "active" ? " priority" : "") + '"',
    ' style="--tone:' + escapeHtml(color.cssVar) + ';--needle:' + escapeHtml(String(gauge.needle)) + 'deg;"',
    ' aria-label="' + escapeHtml(gauge.semanticText + " | " + gauge.receiptText) + '">',
    '<div class="gaugeTop">',
    '<span class="gaugeName">',
    '<small>' + escapeHtml(gauge.id) + '</small>',
    '<strong>' + escapeHtml(gauge.title) + '</strong>',
    '</span>',
    '<span class="gaugeValue" aria-label="Value ' + escapeHtml(String(gauge.value)) + '">' + escapeHtml(gauge.value) + '</span>',
    '</div>',
    '<div class="dial" aria-hidden="true">',
    '<span class="needle"></span>',
    '<span class="dialRead"><strong>' + escapeHtml(gauge.value) + '</strong><small>' + escapeHtml(gauge.label) + '</small></span>',
    '</div>',
    '<p class="gaugeMeaning">' + escapeHtml(gauge.meaning) + '</p>',
    '<ul class="telemetry" aria-label="' + escapeHtml(gauge.title + " telemetry") + '">',
    gauge.receipt.map((line) => '<li>' + escapeHtml(line) + '</li>').join("\n"),
    '</ul>',
    '</article>'
  ].join("\n");
}

export function renderGaugeLegendHTML(colorStates = GAUGE_COLOR_STATES) {
  const states = normalizeObject(colorStates);

  return Object.keys(states)
    .map((key) => {
      const item = states[key];
      return (
        '<span class="legendItem" aria-label="' +
        escapeHtml(item.semanticLabel || item.label) +
        '">' +
        '<span class="dot" style="--tone:' +
        escapeHtml(item.cssVar) +
        '" aria-hidden="true"></span>' +
        '<span>' +
        escapeHtml(item.label) +
        "</span>" +
        "</span>"
      );
    })
    .join("\n");
}

export function renderGaugeTedHTML(tedRead = GAUGE_TED_READ) {
  const safeTed = normalizeObject(tedRead);
  const cards = Array.isArray(safeTed.cards) ? safeTed.cards : [];
  const nextAction = normalizeObject(safeTed.nextAction);

  return [
    '<div class="tedLead">',
    '<span class="pill">' + escapeHtml(normalizeString(safeTed.eyebrow, "TED Talk read")) + '</span>',
    '<h1 id="tedTitle">' + escapeHtml(normalizeString(safeTed.title, "What the gauges mean.")) + '</h1>',
    '<h2 class="thesis">' + escapeHtml(normalizeString(safeTed.thesis)) + '</h2>',
    '<p>' + escapeHtml(normalizeString(safeTed.support)) + '</p>',
    '</div>',
    '<div class="plainCards">',
    cards
      .map((card) => {
        const safeCard = normalizeObject(card);
        const state = normalizeString(safeCard.state, "").toLowerCase();
        const className = state ? "plainCard " + escapeHtml(state) : "plainCard";

        return (
          '<article class="' +
          className +
          '">' +
          '<small>' +
          escapeHtml(normalizeString(safeCard.eyebrow)) +
          '</small>' +
          '<strong>' +
          escapeHtml(normalizeString(safeCard.title)) +
          '</strong>' +
          '<p>' +
          escapeHtml(normalizeString(safeCard.copy)) +
          '</p>' +
          '</article>'
        );
      })
      .join("\n"),
    '</div>',
    '<section class="nextAction" aria-label="Next practical action">',
    '<h3>' + escapeHtml(normalizeString(nextAction.title, "Next practical move")) + '</h3>',
    '<p>' + escapeHtml(normalizeString(nextAction.copy)) + '</p>',
    '<ul class="receipt" aria-label="Gauge next action receipt">',
    (Array.isArray(nextAction.receipt) ? nextAction.receipt : [])
      .map((line) => '<li>' + escapeHtml(line) + '</li>')
      .join("\n"),
    '</ul>',
    '</section>'
  ].join("\n");
}

export function renderGaugePlainText(packet = buildGaugeDashboardPacket()) {
  const safePacket = normalizeObject(packet);
  const readings = Array.isArray(safePacket.readings) ? safePacket.readings : [];

  const lines = [
    "GAUGES=" + normalizeString(normalizeObject(safePacket.meta).version, "UNKNOWN"),
    normalizeString(normalizeObject(safePacket.summary).line, "NO_SUMMARY")
  ];

  readings.forEach((reading) => {
    const gauge = normalizeGaugeReading(reading);
    lines.push("");
    lines.push(gauge.id + " | " + gauge.title);
    lines.push("VALUE=" + gauge.value + " | STATE=" + gauge.state.toUpperCase() + " | LABEL=" + gauge.label.toUpperCase());
    lines.push("MEANING=" + gauge.meaning);
    gauge.receipt.forEach((receiptLine) => lines.push(receiptLine));
  });

  return lines.join("\n");
}

export function createInstruments() {
  let last = null;
  let lastGaugeDashboard = null;

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
      lastGaugeDashboard = null;
    },

    buildInstrumentReceipt,
    renderPanelHTML,
    renderPanelText,

    gauges: {
      meta: GAUGES_META,
      routes: GAUGE_ROUTES,
      colorStates: GAUGE_COLOR_STATES,
      readings: GAUGE_READINGS,
      tedRead: GAUGE_TED_READ,

      update(options) {
        lastGaugeDashboard = buildGaugeDashboardPacket(options || {});
        return lastGaugeDashboard;
      },

      read() {
        return lastGaugeDashboard;
      },

      buildGaugeDashboardPacket,
      renderGaugeCardHTML,
      renderGaugeLegendHTML,
      renderGaugeTedHTML,
      renderGaugePlainText
    }
  };

  return Object.freeze(api);
}

const DEFAULT = createInstruments();

export const meta = DEFAULT.meta;
export default DEFAULT;
