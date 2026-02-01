/* assets/telemetry.js
   Minimal, safe telemetry for a static site.
   Sends:
     - pageview on load
     - click on link/button taps
*/

(() => {
  const METRICS_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";
  const ENDPOINT = `${METRICS_BASE}/event`;

  function pagePath() {
    // Normalize to "/path/" form (matches worker normalizer)
    let p = location.pathname || "/";
    if (!p.startsWith("/")) p = "/" + p;
    if (!p.endsWith("/")) p += "/";
    // collapse common index forms
    p = p.replace(/\/index\.html\/?$/i, "/");
    return p;
  }

  function source() {
    const r = (document.referrer || "").toLowerCase();
    if (!r) return "Direct";
    if (r.includes("osf.io")) return "OSF";
    if (r.includes("github.io") || r.includes("github.com")) return "GitHub";
    return "Other";
  }

  async function send(type) {
    try {
      await fetch(ENDPOINT, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ type, page: pagePath(), source: source() }),
        keepalive: true,
      });
    } catch (_) {
      // silent by design
    }
  }

  // pageview once per load
  if (document.readyState === "complete" || document.readyState === "interactive") {
    send("pageview");
  } else {
    document.addEventListener("DOMContentLoaded", () => send("pageview"), { once: true });
  }

  // click tracking (only counts real taps)
  document.addEventListener(
    "click",
    (e) => {
      const t = e.target;
      if (!t) return;

      // links + buttons + anything styled as a button
      const el = t.closest("a,button,.btn");
      if (!el) return;

      // ignore disabled controls
      if (el.matches("button:disabled,[aria-disabled='true']")) return;

      send("click");
    },
    { capture: true }
  );
})();
