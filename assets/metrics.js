(() => {
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const EVENT_URL = WORKER_BASE + "/event";

  function sourceClassify(ref) {
    if (!ref) return "Direct";
    const r = ref.toLowerCase();
    if (r.includes("osf.io")) return "OSF";
    if (r.includes("github.io") || r.includes("github.com")) return "GitHub";
    return "Other";
  }

  function getSessionId() {
    const key = "geo_session_id_v1";
    let id = localStorage.getItem(key);
    if (!id) {
      id = cryptoRandomId();
      localStorage.setItem(key, id);
      // Mark new session so we emit a session event once
      localStorage.setItem(key + "_new", "1");
    }
    return id;
  }

  function shouldEmitSessionOnce() {
    const key = "geo_session_id_v1_new";
    const v = localStorage.getItem(key);
    if (v === "1") {
      localStorage.setItem(key, "0");
      return true;
    }
    return false;
  }

  function cryptoRandomId() {
    try {
      const a = new Uint8Array(16);
      crypto.getRandomValues(a);
      return [...a].map(x => x.toString(16).padStart(2, "0")).join("");
    } catch {
      return String(Date.now()) + "_" + Math.random().toString(16).slice(2);
    }
  }

  function sendEvent(type, extra = {}) {
    const payload = {
      type,
      page: location.pathname || "/",
      title: document.title || "",
      sessionId: getSessionId(),
      source: sourceClassify(document.referrer),
      ts: Date.now(),
      ...extra,
    };

    // Prefer sendBeacon for reliability on mobile / navigation
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([JSON.stringify(payload)], { type: "application/json" });
        navigator.sendBeacon(EVENT_URL, blob);
        return;
      }
    } catch {}

    fetch(EVENT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      mode: "cors",
      keepalive: true,
    }).catch(() => {});
  }

  // --- automatic events ---
  if (shouldEmitSessionOnce()) sendEvent("session");
  sendEvent("pageview");

  // --- optional: bubble-click tracking ---
  document.addEventListener("click", (e) => {
    const a = e.target && e.target.closest ? e.target.closest("a,button") : null;
    if (!a) return;
    const label = (a.textContent || "").trim().slice(0, 80);
    if (!label) return;
    sendEvent("click", { label });
  }, { capture: true });
})();
