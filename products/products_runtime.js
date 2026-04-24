const RUNTIME_SRC = "./products_runtime.js";
const RUNTIME_FLAG = "productsRuntimeBridgeLoaded";

function setRuntimeStatus(message) {
  const mount = document.getElementById("productsRuntimeMount");
  if (!mount) return;

  mount.setAttribute("data-runtime-status", message);
}

function loadProductsRuntime() {
  if (window[RUNTIME_FLAG]) return;

  window[RUNTIME_FLAG] = true;
  setRuntimeStatus("loading");

  const script = document.createElement("script");
  script.src = `${RUNTIME_SRC}?v=four-lobed-molecular-flower`;
  script.defer = true;

  script.onload = () => {
    setRuntimeStatus("mounted");
  };

  script.onerror = () => {
    window[RUNTIME_FLAG] = false;
    setRuntimeStatus("failed");

    const mount = document.getElementById("productsRuntimeMount");
    if (!mount) return;

    mount.innerHTML = `
      <div class="hero-side">
        <h2>Runtime failed to mount</h2>
        <p>
          The products shell loaded, but the molecular flower runtime did not mount.
          Confirm that /products/products_runtime.js exists and is deployed beside /products/index.js.
        </p>
      </div>
    `;
  };

  document.body.appendChild(script);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", loadProductsRuntime, { once: true });
} else {
  loadProductsRuntime();
}
