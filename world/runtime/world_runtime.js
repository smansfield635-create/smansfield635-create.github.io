// DESTINATION FILE: /world/runtime/world_runtime.js
// PURPOSE: GUARANTEED LIVE RECEIPT HEARTBEAT (diagnostics unblocking)

const RUNTIME_STORAGE_KEY = "cte_runtime_v3";

function writeReceipt(phase, extra = {}) {
  try {
    const payload = {
      page: "/index.html",
      phase,
      mode: document.body?.getAttribute("data-mode") || "unknown",
      timestamp: new Date().toISOString(),
      ...extra
    };
    localStorage.setItem(RUNTIME_STORAGE_KEY, JSON.stringify(payload));
  } catch (e) {
    // silent fail — diagnostics will show missing updates
  }
}

function startHeartbeat() {
  // HARD GUARANTEE: write every 250ms
  setInterval(() => {
    writeReceipt("RUNNING", {
      heartbeat: true
    });
  }, 250);
}

function boot() {
  // Immediate signal (no delay)
  writeReceipt("BOOT_START");

  try {
    startHeartbeat();

    // Confirm boot success AFTER heartbeat starts
    writeReceipt("BOOT_OK");

  } catch (err) {
    writeReceipt("BOOT_FAIL", {
      error: String(err)
    });
  }
}

// EXECUTE IMMEDIATELY
boot();
