(() => {
  // CHANGE THIS ONLY IF YOUR WORKER DOMAIN CHANGES
  const EVENT_URL = "https://geodiametrics-aggregator.smansfield635.workers.dev/event";

  const SESSION_TTL_MS = 30 * 60 * 1000; // 30 minutes
  const KEY = "geo_session_v1";

  function now() { return Date.now(); }

  function sourceBucket(ref) {
    const r = (ref || "").toLowerCase();
    if (!r) return "Direct";
    if (r.includes("osf.io")) return "OSF";
    if (r.includes("github.com") || r.includes("github.io")) return "GitHub";
    return "Other";
  }

  function sid() {
    try {
      let id = localStorage.getItem("geo_sid");
      if (!id) {
        id = "sid_" + Math.random().toString(16).slice(2) + "_" + now();
        localStorage.setItem("geo_sid", id);
      }
      return id;
    } catch {
      return null;
    }
  }

  function loadSession() {
    const t = now();
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) {
        const s = JSON.parse(raw);
        if (s && s.t0 && (t - s.t0) < SESSION_TTL_MS) return s;
      }
    } catch {}

    const s = { t0: t, sent: false };
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    return s;
  }

  function saveSession(s) {
    try { sessionStorage.setItem(KEY, JSON.stringify(s)); } catch {}
  }

  function send(type) {
    const payload = {
      type,                       // "session" | "pageview"
      path: location.pathname || "/",
      referrer: document.referrer || "",
      source: sourceBucket(document.referrer || ""),
      sid: sid(),
      ts: now()
    };

    const body = JSON.stringify(payload);

    // Prefer sendBeacon (best for mobile + page unload)
    try {
      if (navigator.sendBeacon) {
        const blob = new Blob([body], { type: "application/json" });
        navigator.sendBeacon(EVENT_URL, blob);
        return;
      }
    } catch {}

    // Fallback fetch
    try {
      fetch(EVENT_URL, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true
      }).catch(() => {});
    } catch {}
  }

  function boot() {
    const s = loadSession();

    if (!s.sent) {
      send("session");
      s.sent = true;
      saveSession(s);
    }

    send("pageview");
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot, { once: true });
  } else {
    boot();
  }
})();
