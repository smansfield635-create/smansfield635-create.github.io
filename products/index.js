const PRODUCTS_RUNTIME_SRC = "./products_runtime.js";
const PRODUCTS_RUNTIME_FLAG = "productsRuntimeBridgeLoaded";
const PRODUCTS_RUNTIME_RECEIPT = "productsRuntimeMounted";
const PRODUCTS_RUNTIME_VERSION = "four-lobed-molecular-flower-v2";

function getMount() {
  return (
    document.getElementById("productsRuntimeMount") ||
    document.querySelector("[data-products-runtime-mount]")
  );
}

function setRuntimeStatus(status, detail) {
  const mount = getMount();
  if (!mount) return;

  mount.dataset.runtimeStatus = status;

  if (detail) {
    mount.dataset.runtimeDetail = detail;
  }
}

function renderBootReceipt(status, message) {
  const mount = getMount();
  if (!mount) return;

  mount.innerHTML = `
    <div class="hero-side" style="margin:0;">
      <h2>Products runtime ${status}</h2>
      <p>${message}</p>
      <div class="hero-stats">
        <div class="stat">
          <span class="stat-label">Expected file</span>
          <span class="stat-value">/products/products_runtime.js</span>
        </div>
        <div class="stat">
          <span class="stat-label">Bridge file</span>
          <span class="stat-value">/products/index.js</span>
        </div>
        <div class="stat">
          <span class="stat-label">Contract</span>
          <span class="stat-value">four-lobed molecular flower</span>
        </div>
      </div>
    </div>
  `;
}

function runtimeAlreadyMounted() {
  return Boolean(
    document.querySelector("[data-products-runtime-root]") ||
    window[PRODUCTS_RUNTIME_RECEIPT] === true
  );
}

function markMounted() {
  window[PRODUCTS_RUNTIME_RECEIPT] = true;
  setRuntimeStatus("mounted", "runtime root detected");
}

function checkMountedAfterLoad() {
  window.setTimeout(() => {
    if (runtimeAlreadyMounted()) {
      markMounted();
      return;
    }

    setRuntimeStatus("loaded-but-not-mounted", "script loaded but no runtime root appeared");
    renderBootReceipt(
      "loaded but did not mount",
      "The runtime script loaded, but it did not inject the four-lobed molecular flower. Check /products/products_runtime.js for a JavaScript error before mount."
    );
  }, 900);
}

function loadProductsRuntime() {
  const mount = getMount();

  if (!mount) {
    console.error("[Products Runtime Bridge] Missing mount target: #productsRuntimeMount");
    return;
  }

  if (window[PRODUCTS_RUNTIME_FLAG]) {
    if (!runtimeAlreadyMounted()) {
      renderBootReceipt(
        "waiting",
        "The bridge already requested the runtime. Waiting for /products/products_runtime.js to mount the four-lobed molecular flower."
      );
    }
    return;
  }

  window[PRODUCTS_RUNTIME_FLAG] = true;
  setRuntimeStatus("loading", "requesting runtime script");

  renderBootReceipt(
    "loading",
    "Loading /products/products_runtime.js. If the molecule does not appear, this receipt will identify the failure."
  );

  const existingRuntimeScript = document.querySelector('script[data-products-runtime-script="true"]');
  if (existingRuntimeScript) {
    existingRuntimeScript.remove();
  }

  const script = document.createElement("script");
  script.src = `${PRODUCTS_RUNTIME_SRC}?v=${encodeURIComponent(PRODUCTS_RUNTIME_VERSION)}&t=${Date.now()}`;
  script.defer = true;
  script.dataset.productsRuntimeScript = "true";

  script.onload = () => {
    setRuntimeStatus("script-loaded", "runtime script loaded");
    checkMountedAfterLoad();
  };

  script.onerror = () => {
    window[PRODUCTS_RUNTIME_FLAG] = false;
    setRuntimeStatus("failed", "script failed to load");

    renderBootReceipt(
      "failed",
      "The products shell loaded, but /products/products_runtime.js failed to load. Confirm the file exists at /products/products_runtime.js and is deployed beside /products/index.js."
    );
  };

  document.body.appendChild(script);

  window.setTimeout(() => {
    if (runtimeAlreadyMounted()) {
      markMounted();
      return;
    }

    if (mount.dataset.runtimeStatus === "loading") {
      setRuntimeStatus("timeout", "runtime did not respond before timeout");
      renderBootReceipt(
        "timed out",
        "The bridge requested /products/products_runtime.js, but no runtime root appeared. This usually means the runtime file is missing, cached incorrectly, or throwing before mount."
      );
    }
  }, 3000);
}

window.addEventListener("error", (event) => {
  const source = String(event.filename || "");

  if (!source.includes("products_runtime.js")) return;

  setRuntimeStatus("runtime-error", event.message || "runtime error");

  renderBootReceipt(
    "error",
    `The runtime file loaded, but threw an error before mounting: ${event.message || "unknown runtime error"}.`
  );
});

window.addEventListener("unhandledrejection", (event) => {
  setRuntimeStatus("runtime-promise-error", "unhandled promise rejection");

  renderBootReceipt(
    "promise error",
    "The runtime hit an unhandled promise rejection before mounting. Check /products/products_runtime.js."
  );
});

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProductsRuntime, { once: true });
} else {
  loadProductsRuntime();
}
