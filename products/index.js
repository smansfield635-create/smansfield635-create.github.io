// /products/index.js
// TNT FULL-FILE REPLACEMENT
// PRODUCTS_RUNTIME_BRIDGE_OPEN_FOCUS_AUTHORITY_RENEWAL_TNT_v1
// Purpose:
// - Bridge /products/ shell to /products/products_runtime.js when a runtime mount exists.
// - Preserve open-focus behavior for the molecular product runtime window.
// - Render safe boot receipts without unsafe innerHTML.
// - Keep cache authority deterministic through a stable runtime version key.
// - No generated image. No graphic box. No streaming. No visual pass claim.

const PRODUCTS_BRIDGE_CONTRACT =
  "PRODUCTS_RUNTIME_BRIDGE_OPEN_FOCUS_AUTHORITY_RENEWAL_TNT_v1";

const PRODUCTS_RUNTIME_SRC = "/products/products_runtime.js";
const PRODUCTS_RUNTIME_FLAG = "productsRuntimeBridgeLoaded";
const PRODUCTS_RUNTIME_RECEIPT = "productsRuntimeMounted";
const PRODUCTS_RUNTIME_VERSION = "four-lobed-molecular-flower-open-focus-v1";

const PRODUCTS_RUNTIME_SCRIPT_SELECTOR = 'script[data-products-runtime-script="true"]';
const PRODUCTS_RUNTIME_ROOT_SELECTOR = "[data-products-runtime-root]";
const PRODUCTS_RUNTIME_MOUNT_SELECTOR = "#productsRuntimeMount, [data-products-runtime-mount]";
const OPEN_MOLECULE_SELECTOR = "[data-open-molecule]";

const CHECK_AFTER_LOAD_MS = 900;
const TIMEOUT_MS = 3000;
const FOCUS_DELAY_MS = 350;

const state = {
  booted: false,
  requested: false,
  requestStartedAt: 0,
  lastStatus: "idle",
  lastDetail: "",
  lastError: ""
};

function getMount() {
  return (
    document.getElementById("productsRuntimeMount") ||
    document.querySelector("[data-products-runtime-mount]")
  );
}

function getFocusTarget() {
  return getMount();
}

function getRuntimeSrc() {
  return `${PRODUCTS_RUNTIME_SRC}?v=${encodeURIComponent(PRODUCTS_RUNTIME_VERSION)}`;
}

function runtimeAlreadyMounted() {
  return Boolean(
    document.querySelector(PRODUCTS_RUNTIME_ROOT_SELECTOR) ||
    window[PRODUCTS_RUNTIME_RECEIPT] === true
  );
}

function markDocument(extra = {}) {
  const markers = {
    productsBridgeContract: PRODUCTS_BRIDGE_CONTRACT,
    productsRuntimeSrc: PRODUCTS_RUNTIME_SRC,
    productsRuntimeVersion: PRODUCTS_RUNTIME_VERSION,
    productsRuntimeRequested: String(state.requested),
    productsRuntimeStatus: state.lastStatus,
    productsRuntimeMounted: String(runtimeAlreadyMounted()),
    generatedImage: "false",
    graphicBox: "false",
    streaming: "false",
    visualPassClaimed: "false",
    ...extra
  };

  Object.entries(markers).forEach(([key, value]) => {
    document.documentElement.dataset[key] = String(value);
    if (document.body) document.body.dataset[key] = String(value);
  });
}

function setRuntimeStatus(status, detail = "") {
  const mount = getMount();

  state.lastStatus = status;
  state.lastDetail = detail;

  if (mount) {
    mount.dataset.runtimeStatus = status;
    mount.dataset.runtimeDetail = detail;
    mount.dataset.runtimeBridgeContract = PRODUCTS_BRIDGE_CONTRACT;
    mount.dataset.runtimeVersion = PRODUCTS_RUNTIME_VERSION;
  }

  markDocument({
    productsRuntimeStatus: status,
    productsRuntimeDetail: detail
  });
}

function ensureFocusable(target) {
  if (!target) return;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
}

function focusMoleculeWindow() {
  const target = getFocusTarget();
  if (!target) return;

  ensureFocusable(target);

  target.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest"
  });

  window.setTimeout(() => {
    try {
      target.focus({ preventScroll: true });
    } catch {
      target.focus();
    }
  }, FOCUS_DELAY_MS);
}

function safeReplaceHash(hash) {
  try {
    history.replaceState(null, "", hash);
  } catch {
    window.location.hash = hash.replace(/^#/, "");
  }
}

function bindOpenMolecule() {
  document.querySelectorAll(OPEN_MOLECULE_SELECTOR).forEach((link) => {
    if (link.dataset.productsRuntimeOpenBound === "true") return;

    link.dataset.productsRuntimeOpenBound = "true";

    link.addEventListener("click", (event) => {
      event.preventDefault();
      safeReplaceHash("#productsRuntimeMount");
      focusMoleculeWindow();
    });
  });
}

function ensureBridgeStyles() {
  if (document.getElementById("productsRuntimeBridgeStyles")) return;

  const style = document.createElement("style");
  style.id = "productsRuntimeBridgeStyles";
  style.textContent = `
    .runtime-fallback {
      display: grid;
      gap: 1rem;
      padding: clamp(1rem, 3vw, 1.4rem);
      border: 1px solid rgba(243, 200, 111, .24);
      border-radius: 1.25rem;
      background:
        radial-gradient(circle at 20% 0%, rgba(36,120,255,.10), transparent 60%),
        rgba(255,255,255,.04);
      color: rgba(255,244,216,.94);
    }

    .runtime-fallback h2 {
      margin: 0;
      color: #f3c86f;
      font-size: clamp(1.35rem, 4vw, 2rem);
      line-height: 1;
      letter-spacing: -.04em;
    }

    .runtime-fallback p {
      margin: 0;
      color: rgba(230,238,255,.78);
      line-height: 1.5;
    }

    .runtime-receipt {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: .7rem;
    }

    .runtime-receipt .stat {
      display: grid;
      gap: .35rem;
      min-width: 0;
      padding: .85rem;
      border: 1px solid rgba(255,255,255,.12);
      border-radius: .95rem;
      background: rgba(255,255,255,.035);
    }

    .runtime-receipt .stat-label {
      color: rgba(230,238,255,.56);
      font-size: .68rem;
      font-weight: 950;
      letter-spacing: .10em;
      text-transform: uppercase;
    }

    .runtime-receipt .stat-value {
      color: rgba(255,244,216,.94);
      font-size: .82rem;
      font-weight: 850;
      overflow-wrap: anywhere;
    }

    @media (max-width: 760px) {
      .runtime-receipt {
        grid-template-columns: 1fr;
      }
    }
  `;

  document.head.appendChild(style);
}

function createStat(label, value) {
  const stat = document.createElement("div");
  stat.className = "stat";

  const labelNode = document.createElement("span");
  labelNode.className = "stat-label";
  labelNode.textContent = label;

  const valueNode = document.createElement("span");
  valueNode.className = "stat-value";
  valueNode.textContent = value;

  stat.append(labelNode, valueNode);
  return stat;
}

function renderBootReceipt(status, message) {
  const mount = getMount();
  if (!mount) return;

  ensureBridgeStyles();
  ensureFocusable(mount);

  const fallback = document.createElement("div");
  fallback.className = "runtime-fallback";
  fallback.dataset.productsRuntimeBridgeReceipt = "true";
  fallback.dataset.status = status;
  fallback.dataset.contract = PRODUCTS_BRIDGE_CONTRACT;

  const title = document.createElement("h2");
  title.textContent = `Products runtime ${status}`;

  const copy = document.createElement("p");
  copy.textContent = message;

  const receipt = document.createElement("div");
  receipt.className = "runtime-receipt";

  receipt.append(
    createStat("Expected file", PRODUCTS_RUNTIME_SRC),
    createStat("Bridge file", "/products/index.js"),
    createStat("Runtime version", PRODUCTS_RUNTIME_VERSION),
    createStat("Bridge contract", PRODUCTS_BRIDGE_CONTRACT),
    createStat("Runtime mounted", runtimeAlreadyMounted() ? "true" : "false"),
    createStat("Graphic box", "false")
  );

  fallback.append(title, copy, receipt);
  mount.replaceChildren(fallback);
}

function markMounted(detail = "runtime root detected") {
  window[PRODUCTS_RUNTIME_RECEIPT] = true;
  setRuntimeStatus("mounted", detail);

  if (window.location.hash === "#productsRuntimeMount") {
    focusMoleculeWindow();
  }
}

function checkMountedAfterLoad() {
  window.setTimeout(() => {
    if (runtimeAlreadyMounted()) {
      markMounted("runtime root detected after load");
      return;
    }

    setRuntimeStatus("loaded-but-not-mounted", "script loaded but no runtime root appeared");

    renderBootReceipt(
      "loaded but did not mount",
      "The runtime script loaded, but it did not inject the four-lobed molecular flower. Check /products/products_runtime.js for a JavaScript error before mount."
    );
  }, CHECK_AFTER_LOAD_MS);
}

function removeStaleRuntimeScript() {
  const existingRuntimeScript = document.querySelector(PRODUCTS_RUNTIME_SCRIPT_SELECTOR);
  if (!existingRuntimeScript) return;

  const expectedSrc = getRuntimeSrc();

  if (existingRuntimeScript.getAttribute("src") !== expectedSrc) {
    existingRuntimeScript.remove();
  }
}

function appendRuntimeScript() {
  const script = document.createElement("script");
  script.src = getRuntimeSrc();
  script.async = true;
  script.dataset.productsRuntimeScript = "true";
  script.dataset.productsRuntimeVersion = PRODUCTS_RUNTIME_VERSION;
  script.dataset.productsRuntimeBridgeContract = PRODUCTS_BRIDGE_CONTRACT;

  script.onload = () => {
    setRuntimeStatus("script-loaded", "runtime script loaded");
    checkMountedAfterLoad();
  };

  script.onerror = () => {
    window[PRODUCTS_RUNTIME_FLAG] = false;
    state.requested = false;

    setRuntimeStatus("failed", "script failed to load");

    renderBootReceipt(
      "failed",
      "The products shell loaded, but /products/products_runtime.js failed to load. Confirm the file exists at /products/products_runtime.js and is deployed beside /products/index.js."
    );
  };

  document.body.appendChild(script);
}

function startTimeoutWatch() {
  window.setTimeout(() => {
    if (runtimeAlreadyMounted()) {
      markMounted("runtime root detected before timeout");
      return;
    }

    const mount = getMount();
    if (!mount) return;

    if (
      mount.dataset.runtimeStatus === "loading" ||
      mount.dataset.runtimeStatus === "script-loaded"
    ) {
      setRuntimeStatus("timeout", "runtime did not respond before timeout");

      renderBootReceipt(
        "timed out",
        "The bridge requested /products/products_runtime.js, but no runtime root appeared. This usually means the runtime file is missing, cached incorrectly, or throwing before mount."
      );
    }
  }, TIMEOUT_MS);
}

function loadProductsRuntime() {
  const mount = getMount();

  markDocument({ boot: "started" });
  bindOpenMolecule();

  if (!mount) {
    setRuntimeStatus("not-mounted", "runtime mount target missing");
    markDocument({
      productsRuntimeMountPresent: "false",
      productsRuntimeRequested: "false"
    });
    return;
  }

  ensureFocusable(mount);

  if (runtimeAlreadyMounted()) {
    markMounted("runtime already mounted");
    return;
  }

  if (window[PRODUCTS_RUNTIME_FLAG]) {
    setRuntimeStatus("waiting", "runtime already requested");

    if (!runtimeAlreadyMounted()) {
      renderBootReceipt(
        "waiting",
        "The bridge already requested the runtime. Waiting for /products/products_runtime.js to mount the four-lobed molecular flower."
      );
    }

    return;
  }

  window[PRODUCTS_RUNTIME_FLAG] = true;
  state.requested = true;
  state.requestStartedAt = performance.now();

  setRuntimeStatus("loading", "requesting runtime script");

  renderBootReceipt(
    "loading",
    "Loading /products/products_runtime.js. If the molecule does not appear, this receipt will identify the failure."
  );

  removeStaleRuntimeScript();

  const existingRuntimeScript = document.querySelector(PRODUCTS_RUNTIME_SCRIPT_SELECTOR);
  if (existingRuntimeScript) {
    setRuntimeStatus("script-present", "runtime script already present");
    checkMountedAfterLoad();
    startTimeoutWatch();
    return;
  }

  appendRuntimeScript();
  startTimeoutWatch();
}

function isRuntimeSource(source) {
  return String(source || "").includes("/products/products_runtime.js") ||
    String(source || "").includes("products_runtime.js");
}

window.addEventListener("error", (event) => {
  if (!isRuntimeSource(event.filename)) return;

  const message = event.message || "runtime error";

  state.lastError = message;
  window[PRODUCTS_RUNTIME_FLAG] = false;
  state.requested = false;

  setRuntimeStatus("runtime-error", message);

  renderBootReceipt(
    "error",
    `The runtime file loaded, but threw an error before mounting: ${message}.`
  );
});

window.addEventListener("unhandledrejection", (event) => {
  if (!window[PRODUCTS_RUNTIME_FLAG] || runtimeAlreadyMounted()) return;

  const reason = event.reason?.message || String(event.reason || "unhandled promise rejection");

  state.lastError = reason;
  setRuntimeStatus("runtime-promise-error", reason);

  renderBootReceipt(
    "promise error",
    "The runtime hit an unhandled promise rejection before mounting. Check /products/products_runtime.js."
  );
});

window.addEventListener("hashchange", () => {
  if (window.location.hash === "#productsRuntimeMount") {
    focusMoleculeWindow();
  }
});

function boot() {
  if (state.booted) return;

  state.booted = true;
  loadProductsRuntime();

  window.DGBProductsRuntimeBridge = Object.freeze({
    contract: PRODUCTS_BRIDGE_CONTRACT,
    runtimeSrc: PRODUCTS_RUNTIME_SRC,
    runtimeVersion: PRODUCTS_RUNTIME_VERSION,

    focusMoleculeWindow,

    loadProductsRuntime,

    status() {
      return Object.freeze({
        contract: PRODUCTS_BRIDGE_CONTRACT,
        runtimeSrc: PRODUCTS_RUNTIME_SRC,
        runtimeVersion: PRODUCTS_RUNTIME_VERSION,
        booted: state.booted,
        requested: state.requested,
        mounted: runtimeAlreadyMounted(),
        status: state.lastStatus,
        detail: state.lastDetail,
        error: state.lastError,
        mountPresent: Boolean(getMount()),
        generatedImage: false,
        graphicBox: false,
        streaming: false,
        visualPassClaimed: false
      });
    }
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot, { once: true });
} else {
  boot();
}
