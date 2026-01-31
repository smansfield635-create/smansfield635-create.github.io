/* Geodiametrics — Engine Tracker (B)
   B = Session is created only by CHOICE (first user interaction).
   No page-load tracking. No background pings.
*/
(() => {
  "use strict";

  // === CONFIG ===
  const TRUTH_BASE =
    "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const METRICS_ENDPOINT = `${TRUTH_BASE}/metrics`;

  // local guard so one device doesn't spam
  const LS_KEY = "gd_session_touch_v1";
  const SESSION_WINDOW_MS = 30 * 60 * 1000; // 30 minutes

  function now() {
    return Date.now();
  }

  function safeJsonParse(s) {
    try { return JSON.parse(s); } catch { return null; }
  }

  function shouldSendTouch() {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return true;
    const obj = safeJsonParse(raw);
    if (!obj || typeof obj.t !== "number") return true;
    return (now() - obj.t) > SESSION_WINDOW_MS;
  }

  function markTouchSent() {
    try {
      localStorage.setItem(LS_KEY, JSON.stringify({ t: now() }));
    } catch {
      // ignore storage failures
    }
  }

  function sendTouchReceipt() {
    if (!shouldSendTouch()) return;

    const payload = {
      event: "session_touch",
      ts: now(),
      path: location.pathname,
      ref: document.referrer || "",
      ua: navigator.userAgent || ""
    };

    const url = `${METRICS_ENDPOINT}?t=${payload.ts}`;

    const body = JSON.stringify(payload);
    const blob = new Blob([body], { type: "application/json" });

    // Prefer beacon (mobile-safe)
    const beaconOk = typeof navigator.sendBeacon === "function"
      ? navigator.sendBeacon(url, blob)
      : false;

    if (!beaconOk) {
      // Fallback fetch with keepalive (also mobile-safe)
      fetch(url, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body,
        keepalive: true,
        cache: "no-store"
      }).catch(() => {});
    }

    markTouchSent();
  }

  // Fire ONCE per session-window, on first real interaction only.
  let armed = false;

  function armOnce() {
    if (armed) return;
    armed = true;

    const fire = () => {
      disarm();
      sendTouchReceipt();
    };

    // capture phase so we catch taps even if a link navigates immediately
    document.addEventListener("pointerdown", fire, { capture: true, once: true });
    document.addEventListener("keydown", fire, { capture: true, once: true });
    document.addEventListener("touchstart", fire, { capture: true, once: true });
  }

  function disarm() {
    // no-op because we used {once:true}; kept for clarity
  }

  // Arm when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", armOnce, { once: true });
  } else {
    armOnce();
  }

  // Optional: expose a manual trigger for debugging from console
  window.GD_TOUCH = () => sendTouchReceipt();
})();
