// /assets/metrics.js — FULL TNT
// Conservative analytics: only increments when this script emits an event.
// Durable storage lives in Cloudflare DO behind the Worker.

(() => {
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const ENDPOINT_EVENT = WORKER_BASE + "/event";

  const LS_SID = "geo_session_id_v1";
  const LS_SID_TS = "geo_session_ts_v1";
  const SESSION_TTL_MS = 1000 * 60 * 60 * 6; // 6h rolling session

  function now() { return Date.now(); }

  function randId() {
    return "s_" + Math.random().toString(16).slice(2) + "_" + Math.random().toString(16).slice(2);
  }

  function getSessionId() {
    const t = parseInt(localStorage.getItem(LS_SID_TS) || "0", 10);
    const sid = localStorage.getItem(LS_SID) || "";
    const fresh = sid && t && (now() - t) < SESSION_TTL_MS;
    if (fresh) return sid;

    const next = randId();
    localStorage.setItem(LS_SID, next);
    localStorage.setItem(LS_SID_TS, String(now()));
    return next;
  }

  async function postEvent(type, meta = {}) {
    const payload = {
      type,
      path: location.pathname,
      sessionId: getSessionId(),
      meta: {
        ...meta,
        href: location.href,
        ref: document.referrer || "",
        ua: navigator.userAgent || "",
      },
    };

    try {
      await fetch(ENDPOINT_EVENT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload),
        // allow firing during navigation
        keepalive: true,
      });
    } catch (e) {
      // silent by design
    }
  }

  // One session_start per TTL window
  (function emitSessionStartOnce() {
    const t = parseInt(localStorage.getItem(LS_SID_TS) || "0", 10);
    const justCreated = !t || (now() - t) < 2000;
    if (justCreated) postEvent("session_start");
  })();

  // Pageview on load
  window.addEventListener("DOMContentLoaded", () => {
    postEvent("pageview");
  });

  // Click capture (anchors + buttons)
  document.addEventListener("click", (ev) => {
    const el = ev.target && ev.target.closest ? ev.target.closest("a,button") : null;
    if (!el) return;

    const tag = el.tagName ? el.tagName.toLowerCase() : "";
    const text = (el.textContent || "").trim().slice(0, 80);

    postEvent("click", {
      tag,
      text,
      id: el.id || "",
      href: el.getAttribute ? (el.getAttribute("href") || "") : "",
      cls: el.className || "",
    });
  }, { capture: true });

  // Optional API for manual "write" events later
  window.GEO_METRICS = {
    event: postEvent,
    sessionId: getSessionId,
    base: WORKER_BASE,
  };
})();
