/* ============================================================
   GEODIAMETRICS INSTRUMENT — CANONICAL STATE + i18n LOADER + TELEMETRY EMIT
   FILE: /assets/instruments.js
   MODE: TNT (FULL FILE REPLACEMENT)

   LOCKS:
   - Owns ONLY: gd_* state normalization + minimal gating + i18n apply + telemetry emit
   - Does NOT touch html/body background (ui.css owns field)
   - Does NOT define geometry (branch.css owns geometry)
   - Canon keys only: gd_lang, gd_depth, gd_time, gd_style
   - Canon langs: ["en","zh","es"] primary: "en"
   - Gate deep pages if gd_lang invalid (root/index/door are ungated)

   TELEMETRY (ADDED):
   - Emits minimal events to Cloudflare Worker endpoint (POST JSON)
   - No new gd_* keys
   - Stores only a non-gd session id under cte_sid_v1

   PATCH (PER SEAN / DRIFT FIX):
   - Accept uppercase lang inputs (EN/ZH/ES) by coercing to lowercase
   - Accept common zh variants (zh-cn/zh-hans -> zh)
   ============================================================ */

(function(){
  "use strict";

  // ---------- Keys (LOCKED) ----------
  var K_LANG  = "gd_lang";
  var K_DEPTH = "gd_depth";
  var K_TIME  = "gd_time";
  var K_STYLE = "gd_style";

  // Telemetry keys (NON-gd_*; allowed)
  var K_SID = "cte_sid_v1";

  // ---------- Canon (LOCKED) ----------
  var CANON_LANG  = ["en","zh","es"];
  var CANON_DEPTH = ["explore","learn"];
  var CANON_TIME  = ["origin","now","post"];
  var CANON_STYLE = ["formal","informal"];
  var PRIMARY_LANG = "en";

  // Fast allow maps
  var ALLOW_LANG  = {en:1, zh:1, es:1};
  var ALLOW_DEPTH = {explore:1, learn:1};
  var ALLOW_TIME  = {origin:1, now:1, post:1};
  var ALLOW_STYLE = {formal:1, informal:1};

  // ---------- TELEMETRY ENDPOINT (SET) ----------
  // Cloudflare Worker (live):
  var TELEMETRY_ENDPOINT = "https://cte-telemetry.smansfield635.workers.dev";

  // ---------- LocalStorage helpers ----------
  function lsGet(k){
    try{ return localStorage.getItem(k); }catch(e){ return null; }
  }
  function lsSet(k,v){
    try{ localStorage.setItem(k, String(v)); }catch(e){}
  }
  function lsDel(k){
    try{ localStorage.removeItem(k); }catch(e){}
  }

  // ---------- Query helpers ----------
  function qsGet(name){
    try{
      var qs = new URLSearchParams(window.location.search);
      return qs.get(name);
    }catch(e){
      return null;
    }
  }

  // ---------- Canon coercion ----------
  function canonLang(v){
    if(!v) return "";
    v = String(v).trim();
    if(!v) return "";
    v = v.toLowerCase();
    // common variants -> zh
    if(v === "zh-cn" || v === "zh-hans" || v === "zh-hans-cn" || v === "zh-hans-hk" || v === "zh-hant") return "zh";
    // tolerate EN/ZH/ES etc already handled by lowercasing
    return v;
  }

  // ---------- Drift cleanup (LOCKED) ----------
  function cleanupDrift(){
    var lang  = lsGet(K_LANG);
    var depth = lsGet(K_DEPTH);
    var time  = lsGet(K_TIME);
    var style = lsGet(K_STYLE);

    if(lang){
      var cl = canonLang(lang);
      if(!ALLOW_LANG[cl]) lsDel(K_LANG);
      else if(cl !== lang) lsSet(K_LANG, cl);
    }
    if(depth && !ALLOW_DEPTH[depth])  lsDel(K_DEPTH);
    if(time && !ALLOW_TIME[time])     lsDel(K_TIME);
    if(style && !ALLOW_STYLE[style])  lsDel(K_STYLE);
  }

  // ---------- Normalize (URL → LS → defaults) ----------
  function normalize(){
    var lang  = canonLang(qsGet("lang")  || lsGet(K_LANG)  || PRIMARY_LANG);
    var depth = qsGet("depth") || lsGet(K_DEPTH) || "explore";
    var time  = qsGet("time")  || lsGet(K_TIME)  || "now";
    var style = qsGet("style") || lsGet(K_STYLE) || "formal";

    if(!ALLOW_LANG[lang])   lang  = PRIMARY_LANG;
    if(!ALLOW_DEPTH[depth]) depth = "explore";
    if(time==="trajectory") time="post";
    if(!ALLOW_TIME[time])   time  = "now";
    if(!ALLOW_STYLE[style]) style = "formal";

    lsSet(K_LANG, lang);
    lsSet(K_DEPTH, depth);
    lsSet(K_TIME, time);
    lsSet(K_STYLE, style);

    return { lang: lang, depth: depth, time: time, style: style };
  }

  // ---------- Minimal gating ----------
  // Do NOT gate:
  // - / (root)
  // - /index.html (Index)
  // - /door/ (door)
  function gate(state){
    var path = (window.location && window.location.pathname) ? window.location.pathname : "/";

    var isRoot  = (path === "/");
    var isIndex = (path === "/index.html");
    var isDoor  = (path.indexOf("/door") === 0);

    if(isRoot || isIndex || isDoor) return;

    var deepPrefixes = ["/home", "/explore", "/links", "/about", "/products", "/laws", "/gauges", "/innovation", "/prelude", "/research", "/index-core", "/governance", "/finance"];
    var isDeep = false;
    for(var i=0;i<deepPrefixes.length;i++){
      if(path.indexOf(deepPrefixes[i]) === 0){ isDeep = true; break; }
    }
    if(!isDeep) return;

    if(!state || !ALLOW_LANG[state.lang]){
      window.location.replace("/");
    }
  }

  // ---------- Canon i18n apply ----------
  function getPath(obj, dotted){
    if(!obj || !dotted) return null;
    var parts = dotted.split(".");
    var cur = obj;
    for(var i=0;i<parts.length;i++){
      if(cur == null) return null;
      cur = cur[parts[i]];
    }
    return cur;
  }

  function applyI18n(dict, lang){
    try{
      var scope = (dict && dict[lang]) ? dict[lang] : (dict && dict.en ? dict.en : null);
      if(!scope) return;

      var nodes = document.querySelectorAll("[data-i18n]");
      for(var i=0;i<nodes.length;i++){
        var el = nodes[i];
        var key = el.getAttribute("data-i18n");
        if(!key) continue;

        var val = getPath(scope, key);
        if(val == null) continue;

        var attr = el.getAttribute("data-i18n-attr");
        if(attr) el.setAttribute(attr, String(val));
        else el.textContent = String(val);
      }
    }catch(e){}
  }

  function loadCanonI18n(lang){
    try{
      var xhr = new XMLHttpRequest();
      xhr.open("GET", "/assets/i18n_canon.json?v=i18n_canon_v1.1", true);
      xhr.onreadystatechange = function(){
        if(xhr.readyState !== 4) return;
        if(xhr.status >= 200 && xhr.status < 300){
          try{
            var dict = JSON.parse(xhr.responseText);
            applyI18n(dict, lang);
          }catch(e){}
        }
      };
      xhr.send(null);
    }catch(e){}
  }

  // ============================================================
  // TELEMETRY EMIT (MINIMAL, GLOBAL)
  // ============================================================

  function nowISO(){
    try{ return new Date().toISOString(); }catch(e){ return ""; }
  }

  function randHex(n){
    var s=""; var chars="0123456789abcdef";
    for(var i=0;i<n;i++) s += chars[(Math.random()*16)|0];
    return s;
  }

  function getSid(){
    var sid = lsGet(K_SID);
    if(sid && sid.length > 8) return sid;
    sid = "cte_" + randHex(8) + "_" + randHex(8);
    lsSet(K_SID, sid);
    return sid;
  }

  function safeText(el){
    try{
      if(!el) return "";
      var t = (el.getAttribute && el.getAttribute("aria-label")) || "";
      if(t) return String(t).slice(0,160);
      t = (el.textContent || "").trim();
      if(t.length > 160) t = t.slice(0,160) + "…";
      return t;
    }catch(e){ return ""; }
  }

  function safeHref(el){
    try{
      if(!el || !el.getAttribute) return "";
      var href = el.getAttribute("href") || "";
      if(!href) return "";
      try{
        var u = new URL(href, window.location.origin);
        return u.pathname + (u.search || "") + (u.hash || "");
      }catch(e){
        return String(href).slice(0,240);
      }
    }catch(e){ return ""; }
  }

  function postTelemetry(evt){
    if(!TELEMETRY_ENDPOINT) return;
    try{
      fetch(TELEMETRY_ENDPOINT, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify(evt),
        keepalive: true
      }).catch(function(){});
    }catch(e){}
  }

  function emit(type, state, payload){
    var evt = {
      ts: nowISO(),
      sid: getSid(),
      type: type,
      page: (window.location && window.location.pathname) ? window.location.pathname : "/",
      state: {
        lang: state.lang,
        depth: state.depth,
        time: state.time,
        style: state.style
      },
      payload: payload || {}
    };
    postTelemetry(evt);
  }

  function initTelemetry(state){
    emit("page_view", state, {
      title: String(document.title || "").slice(0,140),
      ref: String(document.referrer || "").slice(0,300)
    });

    var thresholds = [25,50,75,90];
    var hit = {25:false,50:false,75:false,90:false};
    var last = 0;

    function onScroll(){
      var now = Date.now();
      if(now - last < 700) return;
      last = now;

      var doc = document.documentElement;
      var body = document.body;
      var scrollTop = (doc && doc.scrollTop) || (body && body.scrollTop) || 0;
      var scrollH = (doc && doc.scrollHeight) || (body && body.scrollHeight) || 0;
      var clientH = (doc && doc.clientHeight) || (body && body.clientHeight) || 1;
      var maxScroll = Math.max(1, scrollH - clientH);
      var pct = Math.round((scrollTop / maxScroll) * 100);

      for(var i=0;i<thresholds.length;i++){
        var th = thresholds[i];
        if(!hit[th] && pct >= th){
          hit[th] = true;
          emit("scroll_depth", state, {pct: th});
        }
      }
    }

    window.addEventListener("scroll", onScroll, {passive:true});

    function findAnchor(target){
      var el = target;
      for(var i=0;i<8 && el;i++){
        if(el.tagName === "A" && el.getAttribute && el.getAttribute("href")) return el;
        el = el.parentElement;
      }
      return null;
    }

    function findButton(target){
      var el = target;
      for(var i=0;i<8 && el;i++){
        if(el.tagName === "BUTTON") return el;
        el = el.parentElement;
      }
      return null;
    }

    function looksLikeAccordion(target){
      var el = target;
      for(var i=0;i<10 && el;i++){
        var role = (el.getAttribute && el.getAttribute("role")) || "";
        var cls = (el.className ? String(el.className).toLowerCase() : "");
        if(role === "button") return el;
        if(cls.indexOf("head") >= 0) return el;
        el = el.parentElement;
      }
      return null;
    }

    function clickHandler(e){
      var t = e.target;

      var a = findAnchor(t);
      if(a){
        emit("nav_click", state, {
          label: safeText(a),
          to: safeHref(a)
        });
        return;
      }

      var b = findButton(t);
      if(b){
        var label = safeText(b).toLowerCase();
        var cls = (b.className ? String(b.className).toLowerCase() : "");
        var isLens = (label.indexOf("informal")>=0 || label.indexOf("formal")>=0 || label.indexOf("platform")>=0 || label.indexOf("engineering")>=0 || label.indexOf("narrative")>=0 || cls.indexOf("pill")>=0);
        emit(isLens ? "lens_toggle" : "button_click", state, {
          label: safeText(b),
          id: (b.id || "")
        });
        return;
      }

      var h = looksLikeAccordion(t);
      if(h){
        emit("accordion_toggle", state, {
          label: safeText(h),
          id: (h.id || "")
        });
      }
    }

    document.addEventListener("click", clickHandler, {passive:true});
  }

  // ---------- Run ----------
  cleanupDrift();
  var state = normalize();
  gate(state);
  loadCanonI18n(state.lang);

  initTelemetry(state);

  // Optional debug surface (keep existing)
  window.CRP_INSTRUMENT = {
    getState: function(){
      return {
        gd_lang: lsGet(K_LANG),
        gd_depth: lsGet(K_DEPTH),
        gd_time: lsGet(K_TIME),
        gd_style: lsGet(K_STYLE)
      };
    },
    reset: function(){
      lsDel(K_LANG); lsDel(K_DEPTH); lsDel(K_TIME); lsDel(K_STYLE);
      cleanupDrift();
    },
    canon: {
      langs: CANON_LANG.slice(0),
      depth: CANON_DEPTH.slice(0),
      time: CANON_TIME.slice(0),
      style: CANON_STYLE.slice(0)
    },
    primary_lang: PRIMARY_LANG
  };

})();
