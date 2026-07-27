from pathlib import Path

MARKER = "LAWS_MOBILE_HALO_SECONDARY_LABELS_20260726J"

for name in ("laws/index.crystals.js", "laws/index.crystals.source.js"):
    path = Path(name)
    source = path.read_text()
    old = "bloomDisableWidthPx:\n    420,"
    new = "bloomDisableWidthPx:\n    0,"
    if source.count(old) != 1:
        raise SystemExit(f"INVALID_BLOOM_GATE_COUNT:{name}:{source.count(old)}")
    source = source.replace(old, new, 1)
    if MARKER not in source:
        source = f"/* {MARKER} */\n" + source
    path.write_text(source)

interactions_path = Path("laws/index.interactions.js")
interactions = interactions_path.read_text()
if MARKER in interactions:
    raise SystemExit("INTERACTION_MARKER_ALREADY_PRESENT")

secondary = r'''

/* LAWS_MOBILE_HALO_SECONDARY_LABELS_20260726J */
;(() => {
  "use strict";
  const CONTRACT = "DGB_LAWS_ACTIVE_CLUSTER_SECONDARY_LABELS_v1";
  const state = {
    root: null,
    field: null,
    controller: null,
    frame: null,
    projections: Object.freeze([]),
    labels: new Map(),
    layer: null,
    scheduled: 0,
    bound: false
  };
  const text = value => String(value == null ? "" : value).trim();
  const lower = value => text(value).toLowerCase();
  const finite = (value, fallback = 0) => Number.isFinite(Number(value)) ? Number(value) : fallback;
  const escapeCss = value => globalThis.CSS && typeof globalThis.CSS.escape === "function"
    ? globalThis.CSS.escape(text(value))
    : text(value).replace(/["\\]/g, "\\$&");
  const mode = frame => text(frame && (frame.presentationMode || (frame.presentation && frame.presentation.mode))).toUpperCase();
  const activeDirection = frame => lower(frame && (frame.activeClusterDirection || frame.selectedDirection || (frame.cluster && frame.cluster.direction)));

  function normalizeProjection(record) {
    if (!record || typeof record !== "object") return null;
    const kind = lower(record.kind);
    const id = text(record.id || record.lawId || record.direction);
    if (kind !== "law" || !id) return null;
    return Object.freeze({
      id,
      x: finite(record.x),
      y: finite(record.y),
      radiusPx: Math.max(0, finite(record.radiusPx || record.radius || record.hitRadius || record.screenRadius, 24)),
      depthLayer: lower(record.depthLayer) || "unknown",
      visible: record.visible !== false
    });
  }

  function install() {
    if (!state.root || !state.field) return false;
    if (!document.getElementById("laws-active-cluster-secondary-label-style")) {
      const style = document.createElement("style");
      style.id = "laws-active-cluster-secondary-label-style";
      style.textContent = `
        [data-laws-projected-law-labels]{position:absolute;inset:0;z-index:23;pointer-events:none;overflow:hidden;contain:layout paint}
        [data-laws-projected-law-label]{position:absolute;max-width:min(10rem,44vw);padding:.24rem .42rem;border:0;border-radius:999px;background:rgba(3,6,13,.46);color:rgba(246,238,223,.94);font:850 clamp(.56rem,1.18vw,.72rem)/1.05 Inter,system-ui,sans-serif;letter-spacing:.075em;text-transform:uppercase;text-align:center;text-shadow:0 .1rem .18rem #000,0 0 .55rem #000;white-space:nowrap;pointer-events:none;touch-action:none;transform:translate(-50%,-50%);box-shadow:0 0 .72rem rgba(0,0,0,.42);backdrop-filter:blur(2px)}
        [data-laws-projected-law-label][data-depth-layer="rear"]{opacity:.54;filter:saturate(.74) brightness(.74)}
        [data-laws-projected-law-label][data-primary="true"]{opacity:1;color:#fff3be;filter:brightness(1.16) drop-shadow(0 0 .52rem rgba(245,213,130,.38))}
      `;
      document.head.append(style);
    }
    let layer = state.field.querySelector("[data-laws-projected-law-labels]");
    if (!layer) {
      layer = document.createElement("div");
      layer.dataset.lawsProjectedLawLabels = CONTRACT;
      layer.setAttribute("aria-hidden", "true");
      state.field.append(layer);
    }
    state.layer = layer;
    for (const control of state.root.querySelectorAll("[data-laws-law][data-law-id]")) {
      const id = text(control.dataset.lawId);
      if (!id) continue;
      let label = layer.querySelector(`[data-laws-projected-law-label="${escapeCss(id)}"]`);
      if (!label) {
        label = document.createElement("span");
        label.dataset.lawsProjectedLawLabel = id;
        label.hidden = true;
        layer.append(label);
      }
      label.textContent = text(control.dataset.lawLabel || control.dataset.label || id);
      state.labels.set(id, label);
    }
    return state.labels.size === 16;
  }

  function update() {
    state.scheduled = 0;
    if (!state.bound || !state.root || !state.field || !state.controller) return;
    try {
      state.frame = state.controller.getFrameState();
      state.projections = Object.freeze(Array.from(state.controller.getSemanticProjection() || []).map(normalizeProjection).filter(Boolean));
    } catch (_) {
      state.projections = Object.freeze([]);
    }
    for (const label of state.labels.values()) label.hidden = true;
    if (mode(state.frame) !== "CLUSTER") return;
    const direction = activeDirection(state.frame);
    const primary = text(state.root.dataset.lawsSpatialPrimaryId || (state.frame && state.frame.cluster && (state.frame.cluster.previewPrimaryLaw || state.frame.cluster.primaryLaw)));
    const fieldRect = state.field.getBoundingClientRect();
    const centerX = fieldRect.width / 2;
    const centerY = fieldRect.height / 2;
    const byId = new Map(state.projections.map(record => [record.id, record]));
    for (const [id, label] of state.labels) {
      const control = state.root.querySelector(`[data-laws-law][data-law-id="${escapeCss(id)}"]`);
      const record = byId.get(id);
      if (!control || !record || !record.visible || lower(control.dataset.direction) !== direction) continue;
      const dx = record.x - centerX;
      const dy = record.y - centerY;
      const magnitude = Math.hypot(dx, dy) || 1;
      const offset = Math.min(36, Math.max(20, record.radiusPx * 0.30 + 8));
      const candidateLeft = record.x - dx / magnitude * offset;
      const candidateTop = record.y - dy / magnitude * offset;
      label.hidden = false;
      label.style.visibility = "hidden";
      label.style.left = "0px";
      label.style.top = "0px";
      const measured = label.getBoundingClientRect();
      const width = Math.max(1, measured.width || label.offsetWidth || 1);
      const height = Math.max(1, measured.height || label.offsetHeight || 1);
      const inset = 8;
      const minLeft = inset + width / 2;
      const maxLeft = Math.max(minLeft, fieldRect.width - inset - width / 2);
      const minTop = inset + height / 2;
      const maxTop = Math.max(minTop, fieldRect.height - inset - height / 2);
      const left = Math.min(maxLeft, Math.max(minLeft, candidateLeft));
      const top = Math.min(maxTop, Math.max(minTop, candidateTop));
      label.style.left = `${left}px`;
      label.style.top = `${top}px`;
      label.style.zIndex = record.depthLayer === "rear" ? "3" : "10";
      label.style.visibility = "visible";
      label.dataset.depthLayer = record.depthLayer;
      label.dataset.primary = String(id === primary);
      label.dataset.lawsProjectedPlacement = "inward-edge-constrained";
      label.dataset.lawsProjectedClamped = String(Math.abs(left - candidateLeft) > 0.5 || Math.abs(top - candidateTop) > 0.5);
    }
  }

  function schedule() {
    if (!state.scheduled) state.scheduled = requestAnimationFrame(update);
  }

  function bind() {
    if (state.bound) return true;
    state.root = document.querySelector("[data-laws-root]");
    state.field = state.root && state.root.querySelector("[data-laws-scene-field]");
    state.controller = globalThis.DGB_LAWS_CONTROLLER;
    if (!state.root || !state.field || !state.controller || typeof state.controller.getFrameState !== "function") return false;
    if (!install()) return false;
    state.controller.subscribeFrameState(schedule);
    state.controller.subscribeSemanticProjection(schedule);
    globalThis.addEventListener("resize", schedule, { passive: true });
    state.bound = true;
    state.root.dataset.lawsSecondaryLabelContract = CONTRACT;
    state.root.dataset.lawsSecondaryLabelStatus = "active";
    schedule();
    globalThis.dispatchEvent(new CustomEvent("DGB_LAWS_SECONDARY_LABELS_READY", {
      detail: Object.freeze({ contract: CONTRACT, activeClusterOnly: true, labelCount: state.labels.size, pointerTransparent: true, placement: "inward-edge-constrained" })
    }));
    return true;
  }

  function activate() {
    if (!bind()) globalThis.setTimeout(activate, 80);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", activate, { once: true });
  else activate();

  globalThis.DGB_LAWS_SECONDARY_LABELS = Object.freeze({
    contract: CONTRACT,
    getState: () => Object.freeze({
      bound: state.bound,
      labelCount: state.labels.size,
      visibleCount: Array.from(state.labels.values()).filter(label => !label.hidden).length
    })
  });
})();
'''
interactions_path.write_text(interactions + secondary)

html_path = Path("laws/index.html")
html = html_path.read_text()
replacements = {
    'data-laws-bounded-round="LAWS_SHOWROOM_CANONICAL_CRYSTAL_CLONE_20260726H"': 'data-laws-bounded-round="LAWS_MOBILE_HALO_SECONDARY_LABELS_20260726J"\n  data-laws-secondary-label-model="active-cluster-four-law-labels-inward-edge-constrained"\n  data-laws-mobile-halo-model="showroom-strength-full-mesh-halo"',
    '/laws/index.crystals.js?v=LAWS_CANONICAL_MAIN_CRYSTAL_CLONE_20260726H': '/laws/index.crystals.js?v=LAWS_MOBILE_HALO_SECONDARY_LABELS_20260726J',
    '/laws/index.interactions.js?v=LAWS_MAIN_GESTURE_CONTINUITY_V8_20260726D': '/laws/index.interactions.js?v=LAWS_MOBILE_HALO_SECONDARY_LABELS_20260726J'
}
for old, new in replacements.items():
    if html.count(old) != 1:
        raise SystemExit(f"INVALID_HTML_IDENTITY_COUNT:{old}:{html.count(old)}")
    html = html.replace(old, new, 1)
if MARKER not in html:
    html = f"<!-- {MARKER} -->\n" + html
html_path.write_text(html)
