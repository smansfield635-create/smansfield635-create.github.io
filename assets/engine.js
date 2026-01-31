/* /assets/engine.js — receipts + click capture + optional worker sync */
(() => {
  const KEY = "gm_receipts_v1";
  const CLICK_KEY = "gm_clicks_v1";

  // SET THIS to your worker metrics base if you have it:
  // Example seen earlier: https://geodiametrics-aggregator.smansfield635.workers.dev
  const WORKER_BASE = "https://geodiametrics-aggregator.smansfield635.workers.dev";

  const now = () => Date.now();
  const iso = () => new Date().toISOString();

  const load = (k, d) => { try { return JSON.parse(localStorage.getItem(k) || JSON.stringify(d)); } catch { return d; } };
  const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

  const receipts = () => load(KEY, {});
  const clicks = () => load(CLICK_KEY, { total: 0, by: {} });

  async function post(path, payload) {
    if (!WORKER_BASE) return { ok:false, skipped:true };
    try {
      const res = await fetch(WORKER_BASE + path, {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(payload)
      });
      return { ok: res.ok, status: res.status };
    } catch (e) {
      return { ok:false, error: String(e) };
    }
  }

  async function get(path) {
    if (!WORKER_BASE) return { ok:false, skipped:true };
    try {
      const res = await fetch(WORKER_BASE + path, { method: "GET" });
      if (!res.ok) return { ok:false, status: res.status };
      return { ok:true, data: await res.json() };
    } catch (e) {
      return { ok:false, error: String(e) };
    }
  }

  // Engines: SEL / RES / COM / CON
  async function receipt(engine, meta = {}) {
    const db = receipts();
    db[engine] = { ts: now(), iso: iso(), meta };
    save(KEY, db);

    // Best-effort publish (safe if endpoint ignores)
    await post("/receipt", { engine, stamp: db[engine] });
    return db[engine];
  }

  async function click(name = "click") {
    const db = clicks();
    db.total += 1;
    db.by[name] = (db.by[name] || 0) + 1;
    db.last = { ts: now(), iso: iso(), name };
    save(CLICK_KEY, db);

    // Best-effort publish
    await post("/click", { name, stamp: db.last, total: db.total });
    return db;
  }

  async function fetchMetrics() {
    // If your worker exposes /metrics, this will populate Control
    return await get("/metrics");
  }

  function bindClicks() {
    // Any element with data-click="NAME" will emit a click receipt
    document.querySelectorAll("[data-click]").forEach(el => {
      el.addEventListener("click", () => click(el.getAttribute("data-click") || "click"));
    });
  }

  window.GM = { receipt, receipts, click, clicks, fetchMetrics, bindClicks };
})();
