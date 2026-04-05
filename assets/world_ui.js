DESTINATION: /assets/world_ui.js
// /assets/world_ui.js
// MODE: WORLD UI CONTRACT RENEWAL
// STATUS: UI SHELL AUTHORITY v3 | CANVAS-FIRST | NON-DRIFT
// ROLE:
// - mount world-facing UI shell only
// - no render authority
// - no diagnostics authority
// - no truth mutation
// - support current round / flat / observe modes
// - keep UI under-expressed but structurally complete
// - remain compatible with /assets/ui.css and /assets/instruments.js
// OWNER: SEAN

function normalizeObject(value) {
  return value && typeof value === "object" && !Array.isArray(value) ? value : {};
}

function normalizeString(value, fallback = "") {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : fallback;
}

function resolveMode(value) {
  const mode = normalizeString(value, "round").toLowerCase();
  if (mode === "flat" || mode === "observe" || mode === "round") return mode;
  return "round";
}

function buildQueryString(extra = {}) {
  const current = new URLSearchParams(window.location.search);
  const next = new URLSearchParams();

  const lang = normalizeString(extra.lang, normalizeString(current.get("lang"), "en"));
  const style = normalizeString(extra.style, normalizeString(current.get("style"), "informal"));
  const time = normalizeString(extra.time, normalizeString(current.get("time"), "now"));
  const depth = normalizeString(extra.depth, normalizeString(current.get("depth"), "1"));
  const lane = normalizeString(extra.lane, normalizeString(current.get("lane"), ""));
  const mode = normalizeString(extra.mode, normalizeString(current.get("mode"), ""));

  next.set("lang", lang);
  next.set("style", style);
  next.set("time", time);
  next.set("depth", depth);

  if (lane === "platform" || lane === "engineering") {
    next.set("lane", lane);
  }

  if (mode.length > 0) {
    next.set("mode", mode);
  }

  return `?${next.toString()}`;
}

function routeTo(path, extra = {}) {
  window.location.href = `${path}${buildQueryString(extra)}`;
}

function applyModeToBody(nextMode) {
  const safeMode = resolveMode(nextMode);
  document.body.setAttribute("data-mode", safeMode);
  return safeMode;
}

function applyActiveModeButton(nodes, mode) {
  const map = {
    flat: nodes.btnFlat,
    round: nodes.btnRound,
    observe: nodes.btnObserve
  };

  Object.values(map).forEach((node) => {
    if (!node) return;
    node.classList.remove("is-active");
  });

  if (map[mode]) {
    map[mode].classList.add("is-active");
  }
}

function resolveBootTone(message) {
  const lower = normalizeString(message, "").toLowerCase();
  if (lower.includes("error") || lower.includes("failed") || lower.includes("timeout")) return "danger";
  if (lower.includes("running") || lower.includes("imported") || lower.includes("ok")) return "ok";
  return "warn";
}

function setBootTone(node, tone) {
  if (!node) return;
  node.style.borderColor =
    tone === "danger"
      ? "rgba(255,120,120,.34)"
      : tone === "ok"
        ? "rgba(130,220,170,.30)"
        : "rgba(255,220,120,.26)";
}

function createMarkerNode(id, code, label, route) {
  const button = document.createElement("button");
  button.className = "orbital-marker";
  button.id = id;
  button.type = "button";
  button.hidden = true;
  button.dataset.route = route;
  button.setAttribute("aria-label", label);
  button.innerHTML = `
    <div class="orbital-glow"></div>
    <div class="orbital-core"></div>
    <div class="orbital-diag-a"></div>
    <div class="orbital-diag-b"></div>
    <div class="orbital-code">${code}</div>
    <div class="orbital-name">${label}</div>
  `;
  return button;
}

function wireOrbitalMarkers(overlayMap) {
  Object.values(overlayMap).forEach((node) => {
    if (!node) return;
    node.addEventListener("click", () => {
      const route = normalizeString(node.dataset.route, "/");
      routeTo(route);
    });
  });
}

function buildShellMarkup() {
  return `
    <div id="universe-layer" aria-hidden="true"></div>
    <div id="atmosphere-layer" aria-hidden="true"></div>
    <div id="hero-layer" aria-hidden="true"></div>
    <div id="flat-layer" aria-hidden="true"></div>

    <div id="orbital-overlay" aria-label="Index markers"></div>

    <div class="top-ui">
      <div class="top-ui-row top-ui-row--home">
        <div class="home-pill" id="home-pill">HOME</div>
      </div>

      <div class="top-ui-row top-ui-row--modes">
        <div class="mode-cluster" id="mode-cluster">
          <button id="btn-flat" class="mode-btn" type="button">FLAT</button>
          <button id="btn-round" class="mode-btn" type="button">ROUND</button>
          <button id="btn-observe" class="mode-btn" type="button">OBSERVE</button>
        </div>
      </div>
    </div>

    <div id="boot-status" class="boot-status" aria-live="polite">
      <div id="boot-status-copy"></div>
    </div>
  `.trim();
}

function createOrbitalOverlayMap(runtimeRoot) {
  const orbitalOverlay = runtimeRoot.querySelector("#orbital-overlay");
  if (!orbitalOverlay) {
    return Object.freeze({
      overlay: null,
      map: Object.freeze({})
    });
  }

  orbitalOverlay.innerHTML = "";
  orbitalOverlay.appendChild(createMarkerNode("marker-north", "N", "PRODUCTS", "/products/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-east", "E", "GAUGES", "/gauges/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-south", "S", "LAWS", "/laws/"));
  orbitalOverlay.appendChild(createMarkerNode("marker-west", "W", "EXPLORE", "/explore/"));

  const map = Object.freeze({
    "north-products": runtimeRoot.querySelector("#marker-north"),
    "east-gauges": runtimeRoot.querySelector("#marker-east"),
    "south-laws": runtimeRoot.querySelector("#marker-south"),
    "west-explore": runtimeRoot.querySelector("#marker-west")
  });

  return Object.freeze({
    overlay: orbitalOverlay,
    map
  });
}

export function createWorldUI(runtimeRoot, options = {}) {
  const root = runtimeRoot instanceof HTMLElement ? runtimeRoot : document.getElementById("runtime-root");
  if (!root) {
    throw new Error("WORLD_UI_REQUIRES_RUNTIME_ROOT");
  }

  const opts = normalizeObject(options);

  root.innerHTML = buildShellMarkup();

  const orbital = createOrbitalOverlayMap(root);
  wireOrbitalMarkers(orbital.map);

  const nodes = Object.freeze({
    runtimeRoot: root,
    universeLayer: root.querySelector("#universe-layer"),
    atmosphereLayer: root.querySelector("#atmosphere-layer"),
    heroLayer: root.querySelector("#hero-layer"),
    flatLayer: root.querySelector("#flat-layer"),
    orbitalOverlay: orbital.overlay,
    modeCluster: root.querySelector("#mode-cluster"),
    homePill: root.querySelector("#home-pill"),
    btnFlat: root.querySelector("#btn-flat"),
    btnRound: root.querySelector("#btn-round"),
    btnObserve: root.querySelector("#btn-observe"),
    bootStatus: root.querySelector("#boot-status"),
    bootStatusCopy: root.querySelector("#boot-status-copy"),
    overlayMap: orbital.map
  });

  function setMode(nextMode) {
    const mode = applyModeToBody(nextMode);
    applyActiveModeButton(nodes, mode);
    return mode;
  }

  function syncModeFromDocument() {
    const mode = resolveMode(document.body.getAttribute("data-mode"));
    return setMode(mode);
  }

  function wireModeButtons(handler) {
    if (typeof handler !== "function") return;

    nodes.btnFlat?.addEventListener("click", () => handler("flat"));
    nodes.btnRound?.addEventListener("click", () => handler("round"));
    nodes.btnObserve?.addEventListener("click", () => handler("observe"));
  }

  function setBootStatus(message, visible = true) {
    const text = normalizeString(message, "");
    if (nodes.bootStatusCopy) {
      nodes.bootStatusCopy.textContent = text;
    }
    if (nodes.bootStatus) {
      nodes.bootStatus.classList.toggle("is-visible", visible && text.length > 0);
      setBootTone(nodes.bootStatus, resolveBootTone(text));
    }
  }

  function hideBootStatus() {
    if (nodes.bootStatus) {
      nodes.bootStatus.classList.remove("is-visible");
    }
    if (nodes.bootStatusCopy) {
      nodes.bootStatusCopy.textContent = "";
    }
  }

  function setHomeLabel(label = "HOME") {
    if (!nodes.homePill) return "HOME";
    const next = normalizeString(label, "HOME").toUpperCase();
    nodes.homePill.textContent = next;
    return next;
  }

  function setOverlayVisibility(key, visible) {
    const node = nodes.overlayMap[key];
    if (!node) return false;
    node.hidden = visible !== true;
    return visible === true;
  }

  function setAllOverlayVisibility(visible) {
    Object.keys(nodes.overlayMap).forEach((key) => {
      setOverlayVisibility(key, visible);
    });
  }

  function setOverlayRoute(key, route) {
    const node = nodes.overlayMap[key];
    if (!node) return "UNMODIFIED";
    const next = normalizeString(route, "");
    if (next.length === 0) return "UNMODIFIED";
    node.dataset.route = next;
    return next;
  }

  function setOverlayLabel(key, code, label) {
    const node = nodes.overlayMap[key];
    if (!node) return false;

    const codeNode = node.querySelector(".orbital-code");
    const labelNode = node.querySelector(".orbital-name");

    if (codeNode) codeNode.textContent = normalizeString(code, codeNode.textContent);
    if (labelNode) labelNode.textContent = normalizeString(label, labelNode.textContent);
    node.setAttribute("aria-label", normalizeString(label, "Orbital Marker"));

    return true;
  }

  function read() {
    return Object.freeze({
      mode: resolveMode(document.body.getAttribute("data-mode")),
      bootStatusVisible: !!nodes.bootStatus?.classList.contains("is-visible"),
      homeLabel: normalizeString(nodes.homePill?.textContent, "HOME"),
      overlayVisibility: Object.freeze(
        Object.keys(nodes.overlayMap).reduce((acc, key) => {
          acc[key] = nodes.overlayMap[key] ? !nodes.overlayMap[key].hidden : false;
          return acc;
        }, {})
      )
    });
  }

  setMode(resolveMode(opts.initialMode || document.body.getAttribute("data-mode")));
  setHomeLabel(normalizeString(opts.homeLabel, "HOME"));

  return Object.freeze({
    ...nodes,
    setMode,
    syncModeFromDocument,
    wireModeButtons,
    setBootStatus,
    hideBootStatus,
    setHomeLabel,
    setOverlayVisibility,
    setAllOverlayVisibility,
    setOverlayRoute,
    setOverlayLabel,
    read
  });
}

export default Object.freeze({
  createWorldUI
});
