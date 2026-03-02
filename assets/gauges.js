/* TNT — /assets/gauges.js
   PURPOSE: Local-only telemetry capture for /gauges/live/ (no backend).
   OUTPUT: Writes events to localStorage["cte_gauges_v1"].
   SAFE: No new gd_* keys. Uses existing gd_lang/gd_style/gd_time/gd_depth read-only.
   NOTE: This file intentionally exists even if you already have /assets/guages.js.
         Your pages should reference THIS exact path:
         <script defer src="/assets/gauges.js"></script>
*/

(function(){
  "use strict";

  var STORE_KEY = "cte_gauges_v1";
  var SID_KEY   = "cte_sid_v1";
  var DBG_KEY   = "cte_gauges_debug";
  var MAX_EVENTS = 5000;

  function nowISO(){ try{ return new Date().toISOString(); }catch(e){ return ""; } }

  function safeGetLS(k){
    try{ return localStorage.getItem(k); }catch(e){ return null; }
  }
  function safeSetLS(k,v){
    try{ localStorage.setItem(k,v); }catch(e){}
  }

  function randHex(n){
    var s=""; var chars="0123456789abcdef";
    for(var i=0;i<n;i++) s += chars[(Math.random()*16)|0];
    return s;
  }
  function getSid(){
    var sid = safeGetLS(SID_KEY);
    if(sid && sid.length>6) return sid;
    sid = "cte_" + randHex(8) + "_" + randHex(8);
    safeSetLS(SID_KEY, sid);
    return sid;
  }

  function loadStore(){
    try{
      var raw = safeGetLS(STORE_KEY);
      if(!raw) return {v:1, events:[]};
      var obj = JSON.parse(raw);
      if(!obj || !Array.isArray(obj.events)) return {v:1, events:[]};
      return obj;
    }catch(e){
      return {v:1, events:[]};
    }
  }

  function saveStore(store){
    try{
      if(store.events.length > MAX_EVENTS){
        store.events = store.events.slice(store.events.length - MAX_EVENTS);
      }
      safeSetLS(STORE_KEY, JSON.stringify(store));
    }catch(e){}
  }

  function dbgOn(){ return safeGetLS(DBG_KEY)==="1"; }
  function dbg(){ if(!dbgOn()) return; try{ console.log.apply(console, arguments); }catch(e){} }

  function getState(){
    var qs = new URLSearchParams(location.search);
    var lang  = qs.get("lang")  || safeGetLS("gd_lang")  || "en";
    var style = qs.get("style") || safeGetLS("gd_style") || "informal";
    var time  = qs.get("time")  || safeGetLS("gd_time")  || "now";
    var depth = qs.get("depth") || safeGetLS("gd_depth") || "explore";
    // do not write gd_* here (capture layer is read-only)
    return {lang:lang, style:style, time:time, depth:depth};
  }

  function textOf(el){
    if(!el) return "";
    var t = (el.getAttribute && el.getAttribute("aria-label")) || "";
    if(t) return t;
    t = (el.textContent || "").trim();
    if(t.length>120) t = t.slice(0,120) + "…";
    return t;
  }

  function pathOf(el){
    try{
      if(!el) return "";
      var href = el.getAttribute && el.getAttribute("href");
      if(!href) return "";
      // normalize absolute to path+search
      try{
        var u = new URL(href, location.origin);
        return u.pathname + (u.search || "") + (u.hash || "");
      }catch(e){
        return href;
      }
    }catch(e){
      return "";
    }
  }

  function toSearchOf(el){
    try{
      if(!el) return "";
      var href = el.getAttribute && el.getAttribute("href");
      if(!href) return "";
      var u = new URL(href, location.origin);
      return u.search || "";
    }catch(e){
      return "";
    }
  }

  function storeEvent(type, payload){
    var sid = getSid();
    var evt = {
      ts: nowISO(),
      sid: sid,
      type: type,
      page: location.pathname,
      state: getState(),
      payload: payload || {}
    };
    var store = loadStore();
    store.events.push(evt);
    saveStore(store);
    dbg("[cte]", type, evt.page, evt.payload);
  }

  // ===== Page view =====
  storeEvent("page_view", {
    ref: (document.referrer || "").slice(0, 300),
    title: (document.title || "").slice(0, 140)
  });

  // ===== Time-on-page =====
  var t0 = Date.now();
  var lastEmit = 0;
  function emitTime(force){
    var ms = Date.now() - t0;
    if(!force){
      if(ms - lastEmit < 15000) return; // every 15s max
    }
    lastEmit = ms;
    storeEvent("time_on_page", {ms: ms});
  }
  var timeTimer = setInterval(function(){ emitTime(false); }, 15000);

  window.addEventListener("beforeunload", function(){
    try{ clearInterval(timeTimer); }catch(e){}
    emitTime(true);
  });

  // ===== Scroll depth =====
  var thresholds = [25,50,75,90];
  var hit = {25:false,50:false,75:false,90:false};
  function emitScroll(){
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
        storeEvent("scroll_depth", {pct: th});
      }
    }
  }
  window.addEventListener("scroll", function(){
    // cheap throttle
    if((Date.now() - lastEmit) < 800) return;
    emitScroll();
  }, {passive:true});

  // ===== Click capture (nav + buttons + “accordions”) =====
  function findAnchor(target){
    var el = target;
    for(var i=0;i<8 && el;i++){
      if(el.tagName === "A" && el.getAttribute("href")) return el;
      el = el.parentElement;
    }
    return null;
  }

  function classStr(el){
    try{ return (el && el.className) ? String(el.className).slice(0, 160) : ""; }
    catch(e){ return ""; }
  }

  function clickHandler(e){
    var t = e.target;

    // anchor click
    var a = findAnchor(t);
    if(a){
      var toPath = pathOf(a);
      // ignore external nav (only record internal)
      var internal = true;
      try{
        var u = new URL(a.getAttribute("href"), location.origin);
        internal = (u.origin === location.origin);
      }catch(err){
        internal = true;
      }
      if(internal){
        storeEvent("nav_click", {
          label: textOf(a),
          to_path: (function(){
            try{
              var u2 = new URL(a.getAttribute("href"), location.origin);
              return u2.pathname;
            }catch(err2){
              return toPath;
            }
          })(),
          to_search: toSearchOf(a),
          to_full: toPath,
          from: location.pathname,
          classes: classStr(a)
        });
      }
      return;
    }

    // button-like click (lens toggles are usually buttons)
    var el = t;
    for(var j=0;j<8 && el;j++){
      if(el.tagName === "BUTTON"){
        var label = textOf(el);
        var cls = classStr(el).toLowerCase();
        // heuristic: lens toggles often have words like INFORMAL/FORMAL/PLATFORM/ENGINEERING/NARRATIVE
        var isLens = /informal|formal|platform|engineering|narrative/.test(label.toLowerCase()) || /pill/.test(cls);
        storeEvent(isLens ? "lens_toggle" : "button_click", {
          label: label,
          classes: classStr(el),
          id: (el.id || ""),
          page: location.pathname
        });
        return;
      }
      el = el.parentElement;
    }

    // accordion header clicks (common patterns: .head, role=button, or data-* contracts)
    var h = t;
    for(var k=0;k<10 && h;k++){
      var cls2 = classStr(h).toLowerCase();
      var role = (h.getAttribute && h.getAttribute("role")) || "";
      var looksLikeHead = (cls2.indexOf("head")>=0) || (role==="button");
      if(looksLikeHead){
        storeEvent("accordion_toggle", {
          label: textOf(h),
          classes: classStr(h),
          id: (h.id || ""),
          page: location.pathname
        });
        return;
      }
      h = h.parentElement;
    }
  }

  document.addEventListener("click", clickHandler, {passive:true});

  // expose minimal debug handle
  window.__cte = window.__cte || {};
  window.__cte.telemetry = {
    store_key: STORE_KEY,
    sid_key: SID_KEY,
    sid: getSid,
    read: loadStore,
    write: saveStore,
    push: storeEvent
  };
})();
