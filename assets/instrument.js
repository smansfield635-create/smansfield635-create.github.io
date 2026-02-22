/* ============================================================
   CRP INSTRUMENT (STATE NORMALIZER + MINIMAL GATING) — SINGLE OWNER
   FILE: /assets/instrument.js
   OWNERSHIP:
   - Canonical keys only: gd_lang, gd_depth, gd_time, gd_style
   - Normalizes from query params to localStorage
   - Minimal gating only (deep pages require valid gd_lang)
   - NO UI logic, NO timers, NO CSS, NO modal logic
   ============================================================ */

(function () {
  "use strict";

  // ---------- Canonical keys ----------
  var K_LANG  = "gd_lang";
  var K_DEPTH = "gd_depth";
  var K_TIME  = "gd_time";
  var K_STYLE = "gd_style";

  // ---------- Allowed values ----------
  var ALLOW_LANG  = { en: true, zh: true };
  var ALLOW_DEPTH = { explore: true, learn: true };
  var ALLOW_TIME  = { origin: true, now: true, trajectory: true };
  var ALLOW_STYLE = { formal: true, informal: true };

  // ---------- Helpers ----------
  function qp(name) {
    try { return new URLSearchParams(window.location.search).get(name); }
    catch (e) { return null; }
  }

  function lsGet(k) {
    try { return localStorage.getItem(k); } catch (e) { return null; }
  }

  function lsSet(k, v) {
    try { localStorage.setItem(k, v); } catch (e) {}
  }

  function lsDel(k) {
    try { localStorage.removeItem(k); } catch (e) {}
  }

  // ---------- Drift cleanup (only known bad namespaces) ----------
  function cleanupDrift() {
    var driftPrefixes = ["crp_", "CRP_"];
    var driftExact = ["lang", "depth", "time", "style", "language", "locale"];

    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i);
        if (!key) continue;

        // Keep canonical keys
        if (key === K_LANG || key === K_DEPTH || key === K_TIME || key === K_STYLE) continue;

        // Remove known drift prefixes
        for (var p = 0; p < driftPrefixes.length; p++) {
          if (key.indexOf(driftPrefixes[p]) === 0) {
            localStorage.removeItem(key);
            key = null;
            break;
          }
        }
        if (!key) continue;

        // Remove known drift exact keys
        for (var d = 0; d < driftExact.length; d++) {
          if (key === driftExact[d]) {
            localStorage.removeItem(key);
            break;
          }
        }
      }
    } catch (e) {}
  }

  // ---------- Normalize state ----------
  function normalize() {
    // Query wins; fall back to localStorage
    var lang  = qp("lang")  || lsGet(K_LANG);
    var depth = qp("depth") || lsGet(K_DEPTH);
    var time  = qp("time")  || lsGet(K_TIME);
    var style = qp("style") || lsGet(K_STYLE);

    // Validate + default
    if (!ALLOW_LANG[lang]) lang = null;
    if (!ALLOW_DEPTH[depth]) depth = "explore";
    if (!ALLOW_TIME[time]) time = "origin";
    if (!ALLOW_STYLE[style]) style = "formal";

    // Persist normalized values (only canonical)
    if (lang) lsSet(K_LANG, lang);
    lsSet(K_DEPTH, depth);
    lsSet(K_TIME, time);
    lsSet(K_STYLE, style);

    return { lang: lang, depth: depth, time: time, style: style };
  }

  // ---------- Minimal gating ----------
  // Do NOT gate:
  // - Index (/)
  // - Terminal (/door/) because it has its own Back-to-Start UI
  // Gate deep pages if gd_lang missing/invalid:
  // - /home/, /explore/, /links/, /about/, /products/, /laws/
  function gate(state) {
    var path = (window.location && window.location.pathname) ? window.location.pathname : "/";

    var isIndex = (path === "/" || path === "/index.html");
    var isDoor = (path.indexOf("/door") === 0);

    if (isIndex || isDoor) return;

    var deepPrefixes = ["/home", "/explore", "/links", "/about", "/products", "/laws"];
    var isDeep = false;
    for (var i = 0; i < deepPrefixes.length; i++) {
      if (path.indexOf(deepPrefixes[i]) === 0) { isDeep = true; break; }
    }
    if (!isDeep) return;

    if (!state.lang || !ALLOW_LANG[state.lang]) {
      window.location.replace("/");
    }
  }

  // ---------- Run ----------
  cleanupDrift();
  var state = normalize();
  gate(state);

  // Optional non-authoritative debug surface
  window.CRP_INSTRUMENT = {
    getState: function () {
      return {
        gd_lang: lsGet(K_LANG),
        gd_depth: lsGet(K_DEPTH),
        gd_time: lsGet(K_TIME),
        gd_style: lsGet(K_STYLE)
      };
    },
    reset: function () {
      lsDel(K_LANG); lsDel(K_DEPTH); lsDel(K_TIME); lsDel(K_STYLE);
      cleanupDrift();
    },
    allowed: {
      gd_lang: Object.keys(ALLOW_LANG),
      gd_depth: Object.keys(ALLOW_DEPTH),
      gd_time: Object.keys(ALLOW_TIME),
      gd_style: Object.keys(ALLOW_STYLE)
    }
  };
})();
