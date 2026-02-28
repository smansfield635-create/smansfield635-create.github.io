/* ============================================================
   GEODIAMETRICS INSTRUMENT — CANONICAL STATE + i18n LOADER
   FILE: /assets/instruments.js
   MODE: TNT (FULL FILE REPLACEMENT)
   LOCKS:
   - Owns ONLY: gd_* state normalization + minimal gating + i18n apply
   - Does NOT touch html/body background (ui.css owns field)
   - Does NOT define geometry (branch.css owns geometry)
   - Canon keys only: gd_lang, gd_depth, gd_time, gd_style
   - Canon langs: ["en","zh","es"]  primary: "en"
   - Gate deep pages if gd_lang invalid (root/index/door are ungated)
   ============================================================ */

(function(){
  "use strict";

  // ---------- Keys (LOCKED) ----------
  var K_LANG  = "gd_lang";
  var K_DEPTH = "gd_depth";
  var K_TIME  = "gd_time";
  var K_STYLE = "gd_style";

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

  // ---------- Drift cleanup (LOCKED) ----------
  function cleanupDrift(){
    var lang  = lsGet(K_LANG);
    var depth = lsGet(K_DEPTH);
    var time  = lsGet(K_TIME);
    var style = lsGet(K_STYLE);

    if(lang && !ALLOW_LANG[lang])     lsDel(K_LANG);
    if(depth && !ALLOW_DEPTH[depth])  lsDel(K_DEPTH);
    if(time && !ALLOW_TIME[time])     lsDel(K_TIME);
    if(style && !ALLOW_STYLE[style])  lsDel(K_STYLE);
  }

  // ---------- Normalize (URL → LS → defaults) ----------
  function normalize(){
    var lang  = qsGet("lang")  || lsGet(K_LANG)  || PRIMARY_LANG;
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

    var deepPrefixes = ["/home", "/explore", "/links", "/about", "/products", "/laws", "/gauges", "/innovation", "/prelude"];
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

  // ---------- Run ----------
  cleanupDrift();
  var state = normalize();
  gate(state);
  loadCanonI18n(state.lang);

  // Optional debug surface
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
