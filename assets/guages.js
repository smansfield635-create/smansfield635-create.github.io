/* TNT — /assets/gauges.js
   CTE_GAUGES_v1 — HARDWIRED LOCAL TELEMETRY (NO SERVER)
   PURPOSE:
     - Track traversal + engagement in live motion across the site
   RULES:
     - No new gd_* keys (storage key is cte_gauges_v1)
     - No modals/overlays
     - Runs silently by default (localStorage + console only if enabled)
*/

(function(){
  "use strict";

  // ==============================
  // CONFIG
  // ==============================
  var STORE_KEY = "cte_gauges_v1";
  var MAX_EVENTS = 1500; // rolling buffer
  var SESSION_KEY = "cte_gauges_session_id";

  // If you want console prints, set localStorage cte_gauges_debug=1
  var DEBUG_KEY = "cte_gauges_debug";

  function nowISO(){
    try { return new Date().toISOString(); } catch(e){ return String(Date.now()); }
  }

  function safeGetLS(k){
    try { return localStorage.getItem(k); } catch(e){ return null; }
  }
  function safeSetLS(k,v){
    try { localStorage.setItem(k,v); } catch(e){}
  }

  function isDebug(){
    return safeGetLS(DEBUG_KEY)==="1";
  }

  function getSessionId(){
    var sid = safeGetLS(SESSION_KEY);
    if(sid) return sid;
    // simple session id
    sid = "S" + Math.random().toString(16).slice(2) + "-" + Date.now().toString(16);
    safeSetLS(SESSION_KEY, sid);
    return sid;
  }

  function getStateSnapshot(){
    // Canon keys only; do not create new gd_* keys
    var qs = new URLSearchParams(location.search);
    return {
      path: location.pathname,
      // canonical state (read-only)
      lang: qs.get("lang") || safeGetLS("gd_lang") || "en",
      style: qs.get("style") || safeGetLS("gd_style") || "informal",
      time: qs.get("time") || safeGetLS("gd_time") || "now",
      depth: qs.get("depth") || safeGetLS("gd_depth") || "explore",
      lane: qs.get("lane") || null
    };
  }

  function loadStore(){
    var raw = safeGetLS(STORE_KEY);
    if(!raw) return { v:1, events:[] };
    try{
      var obj = JSON.parse(raw);
      if(!obj || !Array.isArray(obj.events)) return { v:1, events:[] };
      return obj;
    }catch(e){
      return { v:1, events:[] };
    }
  }

  function saveStore(obj){
    // trim
    if(obj.events.length > MAX_EVENTS){
      obj.events = obj.events.slice(obj.events.length - MAX_EVENTS);
    }
    try{ safeSetLS(STORE_KEY, JSON.stringify(obj)); }catch(e){}
  }

  function logEvent(type, payload){
    var store = loadStore();
    var snap = getStateSnapshot();
    var evt = {
      ts: nowISO(),
      sid: getSessionId(),
      type: type,
      page: snap.path,
      state: snap,
      payload: payload || {}
    };
    store.events.push(evt);
    saveStore(store);
    if(isDebug()){
      try { console.log("[GAUGES]", evt); } catch(e){}
    }
  }

  // ==============================
  // GAUGE: TRAVERSAL (from → to)
  // ==============================
  function isInternalLink(a){
    if(!a || !a.getAttribute) return false;
    var href = a.getAttribute("href") || "";
    if(!href) return false;
    if(href.indexOf("mailto:")===0 || href.indexOf("tel:")===0) return false;
    if(href.indexOf("#")===0) return false;

    // Treat absolute same-origin and relative as internal
    try{
      var u = new URL(href, location.origin);
      return u.origin === location.origin;
    }catch(e){
      return href.indexOf("/")===0;
    }
  }

  function linkTarget(a){
    var href = a.getAttribute("href") || "";
    try{
      var u = new URL(href, location.origin);
      return { path:u.pathname, search:u.search || "", hash:u.hash || "" };
    }catch(e){
      return { path:href, search:"", hash:"" };
    }
  }

  function bindTraversal(){
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;
      // climb to anchor
      var a = t.closest ? t.closest("a") : null;
      if(!a) return;
      if(!isInternalLink(a)) return;

      var to = linkTarget(a);
      logEvent("nav_click", {
        from: location.pathname,
        to_path: to.path,
        to_search: to.search,
        to_hash: to.hash,
        text: (a.textContent||"").trim().slice(0,120)
      });
    }, true);
  }

  // ==============================
  // GAUGE: ACCORDION OPEN (generic)
  // ==============================
  function findAccordionLabel(node){
    if(!node) return "";
    // Try common patterns
    var t = node.querySelector && node.querySelector(".ti, .title, .q, h2, h3, h4");
    if(t && t.textContent) return t.textContent.trim().slice(0,140);
    return "";
  }

  function bindAccordionOpens(){
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;

      // Common accordion headers: .head
      var head = t.closest ? t.closest(".head") : null;
      if(!head) return;

      // Identify card/row container
      var card = head.closest ? head.closest(".card, .row, .block, .section") : null;
      if(!card) return;

      var label = findAccordionLabel(head) || findAccordionLabel(card) || "accordion";
      // state after click happens; wait microtask
      setTimeout(function(){
        var isOpen = card.classList && (card.classList.contains("open"));
        logEvent("accordion_toggle", {
          label: label,
          open: !!isOpen
        });
      }, 0);
    }, true);
  }

  // ==============================
  // GAUGE: LENS TOGGLE (generic)
  // ==============================
  function bindLensToggles(){
    document.addEventListener("click", function(e){
      var t = e.target;
      if(!t) return;

      // buttons commonly used for lens: .pill, .pill*, .lensBtn, .toggleBtn, or ids containing lens/pill
      var btn = t.closest ? t.closest("button, .pill, .lensBtn, .toggleBtn") : null;
      if(!btn) return;

      var id = (btn.id || "").toLowerCase();
      var cls = (btn.className || "").toLowerCase();
      var txt = (btn.textContent || "").trim();

      var looksLikeLens =
        cls.indexOf("pill")>=0 ||
        cls.indexOf("lens")>=0 ||
        cls.indexOf("toggle")>=0 ||
        id.indexOf("lens")>=0 ||
        id.indexOf("pill")>=0 ||
        txt === "NARRATIVE" || txt === "ENGINEERING" ||
        txt === "PLATFORM" || txt === "INFORMAL" || txt === "FORMAL" ||
        txt === "LAYMAN" || txt === "HOMEOWNER VIEW" || txt === "ENGINEER VIEW";

      if(!looksLikeLens) return;

      // Capture current canonical state after click
      setTimeout(function(){
        var snap = getStateSnapshot();
        logEvent("lens_toggle", {
          control_text: txt.slice(0,80),
          control_id: btn.id || null,
          control_class: btn.className || null,
          state_after: snap
        });
      }, 0);
    }, true);
  }

  // ==============================
  // GAUGE: SCROLL DEPTH
  // ==============================
  function bindScrollDepth(){
    var fired = {25:false,50:false,75:false,90:false};
    function pct(){
      var h = document.documentElement;
      var scrollTop = (window.pageYOffset || h.scrollTop || 0);
      var docH = Math.max(h.scrollHeight, document.body.scrollHeight);
      var winH = window.innerHeight || h.clientHeight || 1;
      var denom = Math.max(1, docH - winH);
      return Math.min(100, Math.max(0, Math.round((scrollTop/denom)*100)));
    }

    function onScroll(){
      var p = pct();
      if(p>=25 && !fired[25]){ fired[25]=true; logEvent("scroll_depth",{pct:25}); }
      if(p>=50 && !fired[50]){ fired[50]=true; logEvent("scroll_depth",{pct:50}); }
      if(p>=75 && !fired[75]){ fired[75]=true; logEvent("scroll_depth",{pct:75}); }
      if(p>=90 && !fired[90]){ fired[90]=true; logEvent("scroll_depth",{pct:90}); }
    }

    window.addEventListener("scroll", onScroll, {passive:true});
    // fire once
    setTimeout(onScroll, 250);
  }

  // ==============================
  // GAUGE: TIME ON PAGE
  // ==============================
  function bindTimeMilestones(){
    var ms = [15000, 30000, 60000, 120000];
    ms.forEach(function(t){
      setTimeout(function(){
        logEvent("time_on_page", {ms:t});
      }, t);
    });
  }

  // ==============================
  // GAUGE: PAGE VIEW
  // ==============================
  function firePageView(){
    logEvent("page_view", {
      referrer: document.referrer || null
    });
  }

  // ==============================
  // PUBLIC API (optional)
  // ==============================
  window.CTE_GAUGES = {
    log: logEvent,
    export: function(){
      return loadStore();
    },
    clear: function(){
      saveStore({v:1, events:[]});
    },
    enableDebug: function(){
      safeSetLS(DEBUG_KEY, "1");
    },
    disableDebug: function(){
      safeSetLS(DEBUG_KEY, "0");
    }
  };

  // ==============================
  // HARDWIRE ON LOAD
  // ==============================
  function init(){
    firePageView();
    bindTraversal();
    bindAccordionOpens();
    bindLensToggles();
    bindScrollDepth();
    bindTimeMilestones();
  }

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded", init);
  }else{
    init();
  }

})();
