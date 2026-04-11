import { buildInstrumentReceipt } from "../assets/instruments.js";

function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function ensureRoot(rootId = "app") {
  let root = document.getElementById(rootId);
  if (root) return root;

  root = document.createElement("div");
  root.id = rootId;
  document.body.appendChild(root);
  return root;
}

function row(k, v) {
  return (
    '<div class="instrument-row">' +
      '<div class="instrument-row__k">' + escapeHtml(k) + "</div>" +
      '<div class="instrument-row__v">' + escapeHtml(v) + "</div>" +
    "</div>"
  );
}

function ensureCanvas(id) {
  const node = document.getElementById(id);
  return node && node.tagName === "CANVAS" ? node : null;
}

function drawSeries(canvas, seriesDefs, minY = null, maxY = null) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const w = canvas.width;
  const h = canvas.height;

  ctx.clearRect(0, 0, w, h);

  const bg = ctx.createLinearGradient(0, 0, 0, h);
  bg.addColorStop(0, "#0a1019");
  bg.addColorStop(1, "#070b12");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  ctx.strokeStyle = "#1f2a36";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(0, h - 12);
  ctx.lineTo(w, h - 12);
  ctx.stroke();

  let values = [];
  seriesDefs.forEach((series) => {
    values = values.concat((series.data || []).filter((value) => Number.isFinite(value)));
  });

  let lo = minY;
  let hi = maxY;

  if (lo === null || hi === null) {
    const safeValues = values.length ? values : [0];
    lo = Math.min(...safeValues);
    hi = Math.max(...safeValues);
    if (lo === hi) {
      lo -= 1;
      hi += 1;
    }
  }

  const span = (hi - lo) || 1;

  seriesDefs.forEach((series) => {
    const data = Array.isArray(series.data) ? series.data : [];
    if (!data.length) return;

    ctx.beginPath();
    ctx.strokeStyle = series.color || "#6fe7ff";
    ctx.lineWidth = 2;

    data.forEach((value, index) => {
      const x = (index / Math.max(1, data.length - 1)) * w;
      const y = (h - 12) - ((value - lo) / span) * (h - 24);

      if (index === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });

    ctx.stroke();
  });
}

function normalizeHistory(history = {}) {
  const safe = history && typeof history === "object" ? history : {};
  return {
    fragmentWeight: Array.isArray(safe.fragmentWeight) ? safe.fragmentWeight : [],
    directionalWeight: Array.isArray(safe.directionalWeight) ? safe.directionalWeight : [],
    directionalContrast: Array.isArray(safe.directionalContrast) ? safe.directionalContrast : []
  };
}

export function renderInstrument(receiptLike, options = {}) {
  const root = ensureRoot(options.rootId || "app");

  const packet =
    receiptLike && receiptLike.classifiedState
      ? receiptLike
      : buildInstrumentReceipt(receiptLike || {});

  if (!packet) {
    root.innerHTML =
      '<section class="instrument-ui__panel">' +
        '<h3 class="instrument-ui__panel-title">Instrument Surface</h3>' +
        row("State", "OFFLINE") +
      "</section>";
    return null;
  }

  const summary = (packet.displayPayload || {}).summary || {};
  const diagnostics = packet.diagnosticsPayload || {};
  const signal = diagnostics.signal || {};
  const history = normalizeHistory(options.history);

  root.innerHTML =
    '<section class="instrument-ui">' +
      '<header class="instrument-ui__head">' +
        '<div class="instrument-ui__eyebrow">Instrument Surface</div>' +
        '<h2 class="instrument-ui__title">' + escapeHtml(packet.classifiedState || "OFFLINE") + "</h2>" +
      "</header>" +
      '<div class="instrument-ui__grid">' +
        '<section class="instrument-ui__panel">' +
          '<h3 class="instrument-ui__panel-title">Summary</h3>' +
          row("Node", summary.node || "—") +
          row("Region", summary.region || "—") +
          row("Boundary", summary.boundary || "—") +
          row("Projection", summary.projection || "—") +
          row("Render Kind", summary.projectionKind || "—") +
        "</section>" +
        '<section class="instrument-ui__panel">' +
          '<h3 class="instrument-ui__panel-title">Diagnostics</h3>' +
          row("Terrain", diagnostics.terrain || "—") +
          row("Biome", diagnostics.biome || "—") +
          row("Traversal", diagnostics.traversal || "—") +
          row("Receipt", diagnostics.receipt || "—") +
          row(
            "Signal",
            "(" +
              (signal.fragmentWeight ?? "—") + ", " +
              (signal.directionalWeight ?? "—") + ", " +
              (signal.directionalContrast ?? "—") +
            ")"
          ) +
        "</section>" +
      "</div>" +
      '<section class="instrument-ui__panel">' +
        '<h3 class="instrument-ui__panel-title">Signal History</h3>' +
        '<canvas id="instrumentSignalChart" width="480" height="140"></canvas>' +
      "</section>" +
    "</section>";

  drawSeries(ensureCanvas("instrumentSignalChart"), [
    { data: history.fragmentWeight, color: "#ffd27a" },
    { data: history.directionalWeight, color: "#7fffd4" },
    { data: history.directionalContrast, color: "#6fe7ff" }
  ], 0, 1);

  return packet;
}

export default {
  renderInstrument
}
