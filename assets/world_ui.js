function escapeHtml(value) {
  return String(value ?? "—")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function row(k, v) {
  return '<div class="instrument-row"><div class="instrument-row__k">' + escapeHtml(k) + '</div><div class="instrument-row__v">' + escapeHtml(v) + "</div></div>";
}

export function renderWorldUI(target, payload = {}) {
  if (!target) return;

  const host = payload.host || {};
  const receipt = payload.runtimeReceipt || {};
  const boundary = receipt.boundary || {};
  const region = receipt.region || {};
  const node = receipt.node || {};

  target.innerHTML =
    '<section class="instrument-ui__panel">' +
      '<h3 class="instrument-ui__panel-title">World UI</h3>' +
      row("Public Entry", host.publicEntry || "—") +
      row("Rooms", host.roomCount ?? "—") +
      row("Boundary", boundary.classification || "—") +
      row("Region", region.label || "—") +
      row("Node", node.label || "—") +
    "</section>";
}

export default {
  renderWorldUI
};
