/* ============================================================
   CRP INSTRUMENT — CANONICAL UNIFORMITY PASS
   FILE: /assets/instrument.js
   SCOPE:
   - Canonical keys only: gd_lang, gd_depth, gd_time, gd_style
   - Canonical languages: en (primary), zh (parallel canonical)
   - Loads /assets/i18n_canon.json and applies to [data-i18n] nodes
   - Minimal gating only (deep pages require valid gd_lang)
   - NO UI geometry, NO CSS, NO timers
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

  // ---------- Drift cleanup (conservative) ----------
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
    var lang  = qp("lang")  || lsGet(K_LANG)  || "en";
    var depth = qp("depth") || lsGet(K_DEPTH) || "explore";
    var time  = qp("time")  || lsGet(K_TIME)  || "origin";
    var style = qp("style") || lsGet(K_STYLE) || "formal";

    // Only en/zh are canonical; everything else collapses to en.
    if (!ALLOW_LANG[lang]) lang = "en";
    if (!ALLOW_DEPTH[depth]) depth = "explore";
    if (!ALLOW_TIME[time]) time = "origin";
    if (!ALLOW_STYLE[style]) style = "formal";

    lsSet(K_LANG, lang);
    lsSet(K_DEPTH, depth);
    lsSet(K_TIME, time);
    lsSet(K_STYLE, style);

    return { lang: lang, depth: depth, time: time, style: style };
  }

  // ---------- Minimal gating ----------
  // Do NOT gate:
  // - / (index)
  // - /door/ (Terminal)
  // Gate deep pages if gd_lang missing/invalid:
  // - /home/, /explore/, /links/, /about/, /products/, /laws/, /cares/
  function gate(state) {
    var path = (window.location && window.location.pathname) ? window.location.pathname : "/";

    var isIndex = (path === "/" || path === "/index.html");
    var isDoor  = (path.indexOf("/door") === 0);

    if (isIndex || isDoor) return;

    var deepPrefixes = ["/home", "/explore", "/links", "/about", "/products", "/laws", "/cares"];
    var isDeep = false;
    for (var i = 0; i < deepPrefixes.length; i++) {
      if (path.indexOf(deepPrefixes[i]) === 0) { isDeep = true; break; }
    }
    if (!isDeep) return;

    // state.lang is normalized; ensure it is stored
    var lang = lsGet(K_LANG);
    if (!ALLOW_LANG[lang]) {
      window.location.replace("/");
    }
  }

  // ---------- Canon i18n apply ----------
  function getPath(obj, dotted) {
    if (!obj || !dotted) return null;
    var parts = dotted.split(".");
    var cur = obj;
    for (var i = 0; i < parts.length; i++) {
      if (cur == null) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function applyI18n(dict, lang) {
    try {
      var scope = (dict && dict[lang]) ? dict[lang] : (dict && dict.en ? dict.en : null);
      if (!scope) return;

      var nodes = document.querySelectorAll("[data-i18n]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var key = el.getAttribute("data-i18n");
        if (!key) continue;

        var val = getPath(scope, key);
        if (val == null) continue;

        var attr = el.getAttribute("data-i18n-attr");
        if (attr) el.setAttribute(attr, String(val));
        else el.textContent = String(val);
      }
    } catch (e) {}
  }

  function loadCanonI18n(lang) {
    try {
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/assets/i18n_canon.json?v=i18n_canon_v1", true);
      xhr.onreadystatechange = function () {
        if (xhr.readyState !== 4) return;
        if (xhr.status >= 200 && xhr.status < 300) {
          try {
            var dict = JSON.parse(xhr.responseText);
            applyI18n(dict, lang);
          } catch (e) {}
        }
      };
      xhr.send(null);
    } catch (e) {}
  }

  // ---------- Run ----------
  cleanupDrift();
  var state = normalize();
  gate(state);
  loadCanonI18n(state.lang);

  // Optional debug surface (non-authoritative)
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
    canon_langs: ["en", "zh"],
    primary_lang: "en"
  };
})();
