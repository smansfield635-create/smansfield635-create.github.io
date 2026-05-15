// /products/index.js
// TNT FULL-FILE REPLACEMENT
// PRODUCTS_PUBLIC_ORBIT_RUNTIME_DEMOTION_BRIDGE_TNT_v2
// Purpose:
// - Quietly bridge /products/ to /products/products_runtime.js when the public product orbit exists.
// - Keep the public page usable without JavaScript.
// - Keep runtime enhancement optional.
// - Preserve hidden dataset receipts for builder/Gauges inspection.
// - Never render visible runtime diagnostics, boot receipts, cache keys, script errors, or products_runtime.js failure text to visitors.
// - No generated image. No graphic box. No streaming. No visual pass claim.

const PRODUCTS_BRIDGE_CONTRACT =
  "PRODUCTS_PUBLIC_ORBIT_RUNTIME_DEMOTION_BRIDGE_TNT_v2";

const PRODUCTS_PAGE_CONTRACT =
  "PRODUCTS_PUBLIC_ORBIT_RUNTIME_DEMOTION_RENEWAL_TNT_v2";

const PRODUCTS_RUNTIME_SRC = "/products/products_runtime.js";
const PRODUCTS_RUNTIME_FLAG = "productsRuntimeBridgeLoaded";
const PRODUCTS_RUNTIME_RECEIPT = "productsRuntimeMounted";
const PRODUCTS_RUNTIME_VERSION = "public-orbit-enhancement-v2";

const PRODUCTS_RUNTIME_SCRIPT_SELECTOR = 'script[data-products-runtime-script="true"]';
const PRODUCTS_RUNTIME_ROOT_SELECTOR = "[data-products-runtime-root]";
const PRODUCTS_RUNTIME_MOUNT_SELECTOR = "[data-products-runtime-mount]";
const OPEN_PRODUCT_ORBIT_SELECTOR =
  "[data-open-product-orbit], [data-open-molecule], a[href='#product-orbit'], a[href='#productsRuntimeMount']";

const CHECK_AFTER_LOAD_MS = 900;
const TIMEOUT_MS = 3000;
const FOCUS_DELAY_MS = 300;

const state = {
  booted: false,
  requested: false,
  requestStartedAt: 0,
  lastStatus: "idle",
  lastDetail: "",
  lastError: ""
};

function getMount() {
  return document.querySelector(PRODUCTS_RUNTIME_MOUNT_SELECTOR);
}

function getPublicOrbit() {
  return document.getElementById("product-orbit") || getMount();
}

function getRuntimeRoot() {
  return document.querySelector(PRODUCTS_RUNTIME_ROOT_SELECTOR);
}

function getRuntimeSrc() {
  return `${PRODUCTS_RUNTIME_SRC}?v=${encodeURIComponent(PRODUCTS_RUNTIME_VERSION)}`;
}

function runtimeAlreadyMounted() {
  return Boolean(getRuntimeRoot() || window[PRODUCTS_RUNTIME_RECEIPT] === true);
}

function markDocument(extra = {}) {
  const markers = {
    productsPageContract: PRODUCTS_PAGE_CONTRACT,
    productsBridgeContract: PRODUCTS_BRIDGE_CONTRACT,
    productsRuntimeSrc: PRODUCTS_RUNTIME_SRC,
    productsRuntimeVersion: PRODUCTS_RUNTIME_VERSION,
    productsRuntimeRequested: String(state.requested),
    productsRuntimeStatus: state.lastStatus,
    productsRuntimeMounted: String(runtimeAlreadyMounted()),
    productsRuntimePublicMessage: "false",
    visibleRuntimeDiagnostics: "false",
    visibleBootReceipts: "false",
    visibleCacheKeys: "false",
    visibleScriptFailureText: "false",
    runtimeEnhancementOnly: "true",
    staticPageUsableWithoutJs: "true",
    eightDoorsVisibleWithoutRuntime: "true",
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
    mount.dataset.runtimeEnhancementOnly = "true";
    mount.dataset.runtimePublicMessage = "false";
    mount.dataset.visibleRuntimeDiagnostics = "false";
  }

  markDocument({
    productsRuntimeStatus: status,
    productsRuntimeDetail: detail
  });

  writeHiddenReceipt(status, detail);
}

function ensureFocusable(target) {
  if (!target) return;

  if (!target.hasAttribute("tabindex")) {
    target.setAttribute("tabindex", "-1");
  }
}

function focusProductOrbit() {
  const target = getPublicOrbit();
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

function bindOpenProductOrbit() {
  document.querySelectorAll(OPEN_PRODUCT_ORBIT_SELECTOR).forEach((link) => {
    if (link.dataset.productsPublicOrbitOpenBound === "true") return;

    link.dataset.productsPublicOrbitOpenBound = "true";

    link.addEventListener("click", (event) => {
      const href = link.getAttribute("href") || "";

      if (
        href === "#product-orbit" ||
        href === "#productsRuntimeMount" ||
        link.hasAttribute("data-open-product-orbit") ||
        link.hasAttribute("data-open-molecule")
      ) {
        event.preventDefault();
        safeReplaceHash("#product-orbit");
        focusProductOrbit();
      }
    });
  });
}

function ensureHiddenReceiptNode() {
  let receipt = document.getElementById("productsRuntimeHiddenReceipt");

  if (receipt) return receipt;

  receipt = document.createElement("template");
  receipt.id = "productsRuntimeHiddenReceipt";
  receipt.dataset.productsRuntimeHiddenReceipt = "true";
  receipt.dataset.contract = PRODUCTS_BRIDGE_CONTRACT;
  receipt.dataset.visible = "false";

  document.body.appendChild(receipt);
  return receipt;
}

function writeHiddenReceipt(status, detail = "") {
  if (!document.body) return;

  const receipt = ensureHiddenReceiptNode();
  const payload = [
    PRODUCTS_BRIDGE_CONTRACT,
    `page_contract=${PRODUCTS_PAGE_CONTRACT}`,
    "route=/products/",
    "role=quiet_runtime_bridge",
    "runtime_public_message=false",
    "visible_runtime_diagnostics=false",
    "visible_boot_receipts=false",
    "visible_cache_keys=false",
    "visible_script_failure_text=false",
    "runtime_enhancement_only=true",
    `runtime_src=${PRODUCTS_RUNTIME_SRC}`,
    `runtime_version=${PRODUCTS_RUNTIME_VERSION}`,
    `status=${status}`,
    `detail=${String(detail).replace(/\s+/g, "_")}`,
    `mounted=${runtimeAlreadyMounted() ? "true" : "false"}`,
    "generated_image=false",
    "graphic_box=false",
    "streaming=false",
    "visual_pass_claimed=false"
  ].join("\n");

  receipt.textContent = payload;
}

function markMounted(detail = "runtime root detected") {
  window[PRODUCTS_RUNTIME_RECEIPT] = true;
  setRuntimeStatus("mounted", detail);

  if (
    window.location.hash === "#product-orbit" ||
    window.location.hash === "#productsRuntimeMount"
  ) {
    focusProductOrbit();
  }
}

function checkMountedAfterLoad() {
  window.setTimeout(() => {
    if (runtimeAlreadyMounted()) {
      markMounted("runtime root detected after load");
      return;
    }

    setRuntimeStatus(
      "loaded-but-not-mounted",
      "script loaded but no runtime root appeared"
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
  script.dataset.runtimeEnhancementOnly = "true";
  script.dataset.runtimePublicMessage = "false";

  script.onload = () => {
    setRuntimeStatus("script-loaded", "runtime script loaded");
    checkMountedAfterLoad();
  };

  script.onerror = () => {
    window[PRODUCTS_RUNTIME_FLAG] = false;
    state.requested = false;
    setRuntimeStatus("failed", "script failed to load");
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
      mount.dataset.runtimeStatus === "script-loaded" ||
      mount.dataset.runtimeStatus === "script-present"
    ) {
      setRuntimeStatus("timeout", "runtime did not respond before timeout");
    }
  }, TIMEOUT_MS);
}

function loadProductsRuntime() {
  const mount = getMount();

  markDocument({ productsBridgeBoot: "started" });
  bindOpenProductOrbit();

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
    return;
  }

  window[PRODUCTS_RUNTIME_FLAG] = true;
  state.requested = true;
  state.requestStartedAt = performance.now();

  setRuntimeStatus("loading", "requesting runtime script");

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
  return (
    String(source || "").includes("/products/products_runtime.js") ||
    String(source || "").includes("products_runtime.js")
  );
}

window.addEventListener("error", (event) => {
  if (!isRuntimeSource(event.filename)) return;

  const message = event.message || "runtime error";

  state.lastError = message;
  window[PRODUCTS_RUNTIME_FLAG] = false;
  state.requested = false;

  setRuntimeStatus("runtime-error", message);
});

window.addEventListener("unhandledrejection", (event) => {
  if (!window[PRODUCTS_RUNTIME_FLAG] || runtimeAlreadyMounted()) return;

  const reason =
    event.reason?.message || String(event.reason || "unhandled promise rejection");

  state.lastError = reason;
  setRuntimeStatus("runtime-promise-error", reason);
});

window.addEventListener("hashchange", () => {
  if (
    window.location.hash === "#product-orbit" ||
    window.location.hash === "#productsRuntimeMount"
  ) {
    focusProductOrbit();
  }
});

function boot() {
  if (state.booted) return;

  state.booted = true;

  markDocument({
    boot: "started",
    productsPublicOrbitBridge: "quiet",
    productsRuntimePublicMessage: "false"
  });

  loadProductsRuntime();

  window.DGBProductsRuntimeBridge = Object.freeze({
    contract: PRODUCTS_BRIDGE_CONTRACT,
    pageContract: PRODUCTS_PAGE_CONTRACT,
    runtimeSrc: PRODUCTS_RUNTIME_SRC,
    runtimeVersion: PRODUCTS_RUNTIME_VERSION,
    runtimePublicMessage: false,
    visibleRuntimeDiagnostics: false,
    runtimeEnhancementOnly: true,

    focusProductOrbit,

    loadProductsRuntime,

    status() {
      return Object.freeze({
        contract: PRODUCTS_BRIDGE_CONTRACT,
        pageContract: PRODUCTS_PAGE_CONTRACT,
        runtimeSrc: PRODUCTS_RUNTIME_SRC,
        runtimeVersion: PRODUCTS_RUNTIME_VERSION,
        booted: state.booted,
        requested: state.requested,
        mounted: runtimeAlreadyMounted(),
        status: state.lastStatus,
        detail: state.lastDetail,
        error: state.lastError,
        mountPresent: Boolean(getMount()),
        publicOrbitPresent: Boolean(getPublicOrbit()),
        runtimePublicMessage: false,
        visibleRuntimeDiagnostics: false,
        visibleBootReceipts: false,
        visibleCacheKeys: false,
        visibleScriptFailureText: false,
        runtimeEnhancementOnly: true,
        staticPageUsableWithoutJs: true,
        eightDoorsVisibleWithoutRuntime: true,
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
