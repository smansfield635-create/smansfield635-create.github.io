(() => {
  // ====== CONFIG (edit ONLY these if needed) ======
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const EVENT_PATH = "/event";   // Worker endpoint that increments counters
  const TIMEOUT_MS = 2500;

  // ====== Helpers ======
  const now = () => Date.now();
  const safeJson = async (res) => { try { return await res.json(); } catch { return null; } };
  const timeoutFetch = (url, opts) =>
    Promise.race([
      fetch(url, opts),
      new Promise((_, rej) => setTimeout(() => rej(new Error("timeout")), TIMEOUT_MS))
    ]);

  // ====== Session model (human-simple) ======
  // One "session" here means: first time this browser ever hits the site (until storage cleared).
  // If you want session windows later, we can add a 30-min expiry, but this is the minimum.
  const SID_KEY = "gd_sid_v1";

  let isNewSession = false;
  let sid = null;

  try {
    sid = localStorage.getItem(SID_KEY);
    if (!sid) {
      sid = `gd_${now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
      localStorage.setItem(SID_KEY, sid);
      isNewSession = true;
    }
  } catch {
    // Storage blocked; fall back to a per-load sid (still counts pageviews)
    sid = `gd_${now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    isNewSession = true;
  }

  // ====== Send event (non-blocking, safe) ======
  const sendEvent = async () => {
    const url = `${WORKER_BASE}${EVENT_PATH}`;
    const payload = {
      type: "pageview",
      sid,
      session: isNewSession ? 1 : 0,
      path: location.pathname,
      ref: document.referrer || "",
      ua: navigator.userAgent || "",
      ts: now()
    };

    try {
      await timeoutFetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
    } catch {
      // Silent failure by design: website must never break if telemetry is down.
    }
  };

  // ====== Run on every page load ======
  if (document.readyState === "complete" || document.readyState === "interactive") {
    sendEvent();
  } else {
    document.addEventListener("DOMContentLoaded", sendEvent, { once: true });
  }
})();
