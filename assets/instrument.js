/* ============================================================
   CRP INSTRUMENT (STATE NORMALIZER + MINIMAL HUB GATING)
   FILE: /assets/instrument.js
   RULES:
   - Canonical keys only: gd_lang, gd_depth, gd_time, gd_style
   - No timers as gates
   - No UI ownership (CSS/DOM styling belongs elsewhere)
   - Minimal gating only (prevent deep pages without gd_lang)
   ============================================================ */

(function () {
  "use strict";

  // -----------------------------
  // Canonical keys + allowed values
  // -----------------------------
  var K_LANG  = "gd_lang";
  var K_DEPTH = "gd_depth";
  var K_TIME  = "gd_time";
  var K_STYLE = "gd_style";

  var ALLOW_LANG  = { en: true, zh: true };
  var ALLOW_DEPTH = { explore: true, learn: true };
  var ALLOW_TIME  = { origin: true, now: true, trajectory: true };
  var ALLOW_STYLE = { formal: true, informal: true };

  // -----------------------------
  // Helpers
  // -----------------------------
  function qsGet(name) {
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

  function startsWithAny(str, prefixes) {
    for (var i = 0; i < prefixes.length; i++) {
      if (str.indexOf(prefixes[i]) === 0) return true;
    }
    return false;
  }

  // -----------------------------
  // Cleanup: eliminate obvious drift keys
  // (Do NOT delete unrelated app keys; only known drift prefixes/keys)
  // -----------------------------
  function cleanupDriftKeys() {
    var driftPrefixes = ["crp_", "CRP_", "lang_", "depth_", "time_", "style_"];
    var driftExact = ["lang", "depth", "time", "style", "language", "locale"];

    try {
      for (var i = localStorage.length - 1; i >= 0; i--) {
        var key = localStorage.key(i);
        if (!key) continue;

        // Keep canonical keys only
        if (key === K_LANG || key === K_DEPTH || key === K_TIME || key === K_STYLE) continue;

        // Remove known drift keys/prefixes
        if (startsWithAny(key, driftPrefixes)) {
          localStorage.removeItem(key);
          continue;
        }
        for (var j = 0; j < driftExact.length; j++) {
          if (key === driftExact[j]) {
            localStorage.removeItem(key);
            break;
          }
        }
      }
    } catch (e) {
      // ignore
    }
  }

  // -----------------------------
  // Normalize state from query/localStorage
  // Query params (lang/depth/time/style) are accepted as inputs.
  // -----------------------------
  function normalizeState() {
    // Read candidates (query wins)
    var lang  = qsGet("lang")  || lsGet(K_LANG);
    var depth = qsGet("depth") || lsGet(K_DEPTH);
    var time  = qsGet("time")  || lsGet(K_TIME);
    var style = qsGet("style") || lsGet(K_STYLE);

    // Validate + default
    if (!ALLOW_LANG[lang]) lang = null; // lang is required only for deep pages
    if (!ALLOW_DEPTH[depth]) depth = "explore";
    if (!ALLOW_TIME[time]) time = "origin";
    if (!ALLOW_STYLE[style]) style = "formal";

    // Persist normalized values
    if (lang) lsSet(K_LANG, lang);
    lsSet(K_DEPTH, depth);
    lsSet(K_TIME, time);
    lsSet(K_STYLE, style);

    return { lang: lang, depth: depth, time: time, style: style };
  }

  // -----------------------------
  // Minimal hub gating:
  // - Do NOT gate Index (/)
  // - Do NOT hard-redirect Terminal (/door/) (it has its own Back-to-Start UI)
  // - DO gate deep pages if gd_lang missing/invalid:
  //     /home/, /explore/, /links/, /about/, /products/, /laws/
  // -----------------------------
  function gateIfMissingLang(state) {
    var path = (window.location && window.location.pathname) ? window.location.pathname : "/";
    var isIndex = (path === "/" || path === "/index.html");
    var isDoor  = (path.indexOf("/door") === 0);

    if (isIndex || isDoor) return;

    // Treat these as "deep" pages
    var deepPrefixes = ["/home", "/explore", "/links", "/about", "/products", "/laws"];
    var isDeep = false;
    for (var i = 0; i < deepPrefixes.length; i++) {
      if (path.indexOf(deepPrefixes[i]) === 0) { isDeep = true; break; }
    }
    if (!isDeep) return;

    if (!state.lang || !ALLOW_LANG[state.lang]) {
      // Hard gate back to start, no extra logic.
      window.location.replace("/");
    }
  }

  // -----------------------------
  // Run
  // -----------------------------
  cleanupDriftKeys();
  var state = normalizeState();
  gateIfMissingLang(state);

  // Optional debug surface (non-authoritative)
  window.CRP_INSTRUMENT = {
    keys: { lang: K_LANG, depth: K_DEPTH, time: K_TIME, style: K_STYLE },
    allowed: {
      lang: Object.keys(ALLOW_LANG),
      depth: Object.keys(ALLOW_DEPTH),
      time: Object.keys(ALLOW_TIME),
      style: Object.keys(ALLOW_STYLE)
    },
    getState: function () {
      return {
        lang: lsGet(K_LANG),
        depth: lsGet(K_DEPTH),
        time: lsGet(K_TIME),
        style: lsGet(K_STYLE)
      };
    },
    reset: function () {
      lsDel(K_LANG); lsDel(K_DEPTH); lsDel(K_TIME); lsDel(K_STYLE);
      cleanupDriftKeys();
    }
  };
})();
