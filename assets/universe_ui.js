function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function row(k, v) {
  return '<div class="instrument-row"><div class="instrument-row__k">' + escapeHtml(k) + '</div><div class="instrument-row__v">' + escapeHtml(v) + "</div></div>";
}

export function renderUniverseUI(target, payload = {}) {
  if (!target) return;

  const layers = Array.isArray(payload.layers) ? payload.layers : [];
  const projection = payload.projection || {};

  target.innerHTML =
    '<section class="instrument-ui__panel">' +
      '<h3 class="instrument-ui__panel-title">Universe UI</h3>' +
      row("Layer Count", layers.length) +
      row("Projection Kind", projection.kind || "—") +
      row("Frame Radius", projection.frameRadius ?? "—") +
      row("Scale", projection.scale ?? "—") +
    "</section>";
}

export default {
  renderUniverseUI
};
